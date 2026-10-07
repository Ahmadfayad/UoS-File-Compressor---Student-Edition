const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');

const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
function source(name) {
  const start = html.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.ok(start >= 0, `Missing ${name}`);
  const tail = html.slice(start);
  const next = tail.slice(1).search(/\n\t\t(?:async )?function /);
  return tail.slice(0, next + 1);
}

test('PDF fallback accepts the first fitting candidate and rejects oversized results', async () => {
  const cap = 972800;
  let sizes, calls;
  const context = vm.createContext({
    Blob, Uint8Array, TARGET_MAX: cap,
    getEffectiveCap: () => cap,
    renderPdfToImagePdf: async () => ({ size: sizes[calls++] }),
  });
  vm.runInContext(source('makeResult') + source('smartRasterizeTextPdf') + source('pngChunk'), context);
  const file = {size: 2917369, name: 'sample.pdf', arrayBuffer: async () => new ArrayBuffer(0)};
  sizes = [6000000, 5000000, cap, 900000]; calls = 0;
  const result = await context.smartRasterizeTextPdf(file, () => {});
  assert.equal(result.compressedSize, cap);
  assert.equal(calls, 3);
  sizes = Array(7).fill(cap + 1); calls = 0;
  await assert.rejects(context.smartRasterizeTextPdf(file, () => {}), /Unable to create/);
  assert.equal(context.makeResult({size: 200}, 'x.pdf', 'application/pdf', 100, '').savingsPercent, -100);
  context.TextEncoder = TextEncoder;
  assert.deepEqual([...context.pngChunk('IEND', new Uint8Array())].slice(-4), [174, 66, 96, 130]);
});

test('shared PDF routing enforces the cap and does not hide encrypted-file errors', async () => {
  const cap = 972800;
  const context = vm.createContext({
    Blob, Error, TARGET_MAX: cap, MAX_INPUT_BYTES: 100 * 1024 * 1024, AUTO_LEVEL: 'low', console,
    window: {PDFLib: {PDFDocument: {load: async () => ({catalog: {has: () => false}})}, PDFName: {of: key => key}}},
    optimizePdfImages: async () => ({blob: {size: cap + 1}}),
    isSupportedFile: () => true, isPdfFile: () => true, isImageFile: () => false,
    buildGuaranteedFallbackPdf: () => {throw new Error('Unexpected fallback');},
  });
  vm.runInContext(source('makeResult') + source('compressPdfSmart') + source('compressAnyFile'), context);
  const file = {size: 2917369, name: 'sample.pdf', arrayBuffer: async () => new ArrayBuffer(0)};
  await assert.rejects(context.compressAnyFile(file), /1 MB admission limit/);
  context.window.PDFLib.PDFDocument.load = async () => {throw new Error('Encrypted PDF');};
  await assert.rejects(context.compressAnyFile(file), /Encrypted PDF/);
});

test('PDF cleanup retains referenced arrays, image dictionaries and cyclic page links', () => {
  class PDFRef {constructor(id) {this.id=id;} toString() {return this.id;}}
  class PDFDict extends Map {}
  class PDFArray extends Array {asArray() {return this;}}
  class PDFRawStream {constructor(dict) {this.dict=dict;}}
  const root=new PDFRef('root'), array=new PDFRef('array'), image=new PDFRef('image'), unused=new PDFRef('unused');
  const objects=new Map([
    [root,new PDFDict([['Pages',array]])],
    [array,new PDFArray(image)],
    [image,new PDFRawStream(new PDFDict([['Parent',root]]))],
    [unused,new PDFDict()],
  ]);
  const context=vm.createContext({window:{PDFLib:{PDFRef,PDFDict,PDFArray,PDFRawStream}}});
  vm.runInContext(source('removeUnusedPdfObjects'),context);
  context.removeUnusedPdfObjects({context:{trailerInfo:{Root:root},lookup:ref=>objects.get(ref),enumerateIndirectObjects:()=>[...objects],delete:ref=>objects.delete(ref)}});
  assert.deepEqual([...objects.keys()],[root,array,image]);
});

test('identical images are shared without merging different image dictionaries', async () => {
  class PDFRef {constructor(id) {this.id=id;} toString() {return this.id;}}
  class PDFDict extends Map {lookup(key) {return this.get(key);} toString() {return JSON.stringify([...this]);}}
  class PDFArray extends Array {size() {return this.length;} get(i) {return this[i];} set(i,value) {this[i]=value;}}
  class PDFRawStream {constructor(width) {this.dict=new PDFDict([['Subtype','/Image'],['Width',width]]);this.contents=new Uint8Array([1,2,3]);}}
  const root=new PDFRef('root'), first=new PDFRef('first'), duplicate=new PDFRef('duplicate'), different=new PDFRef('different');
  const refs=new PDFArray(first,duplicate,different);
  const objects=new Map([[root,new PDFDict([['Images',refs]])],[first,new PDFRawStream(10)],[duplicate,new PDFRawStream(10)],[different,new PDFRawStream(20)]]);
  const context=vm.createContext({crypto:require('node:crypto').webcrypto,Uint8Array,window:{PDFLib:{PDFRef,PDFDict,PDFArray,PDFRawStream,PDFName:{of:key=>key}}}});
  vm.runInContext(source('deduplicatePdfImages'),context);
  await context.deduplicatePdfImages({context:{enumerateIndirectObjects:()=>[...objects],delete:ref=>objects.delete(ref)}});
  assert.equal(refs[1],first);
  assert.equal(refs[2],different);
  assert.equal(objects.has(duplicate),false);
});

test('image-to-PDF compression and conversion use the same route', async () => {
  const cap = 972800;
  let calls = 0;
  const context = vm.createContext({
    Error, TARGET_MAX: cap, MAX_INPUT_BYTES: 100000000, AUTO_LEVEL: 'low',
    isSupportedFile: () => true, isPdfFile: () => false, isImageFile: () => true,
    isTextFile: () => false, detectInternalFileProfile: async () => ({}),
    convertImageToPdf: async () => {calls++; return {blob: {size: cap}, mime: 'application/pdf'};},
  });
  vm.runInContext(source('compressAnyFile') + source('convertFile'), context);
  const file = {size: 2000000, name: 'scan.jpg', userPreference: 'pdf'};
  await context.compressAnyFile(file);
  await context.convertFile(file, 'application/pdf', () => {});
  assert.equal(calls, 2);
  context.convertImageToPdf = async () => {throw new Error('Invalid image');};
  await assert.rejects(context.compressAnyFile(file), /Invalid image/);
});

test('embedded images step down further before rasterization and verify text', async () => {
  const cap = 972800;
  class PDFRawStream {constructor(size) {this.contents = new Uint8Array(size); this.dict = {lookup: () => '/Image'};}}
  const objects = new Map([['image', new PDFRawStream(2000)]]);
  let quality = 1, closed = 0, outputText = 'same', qualities = [];
  const doc = {
    setTitle() {}, setAuthor() {}, setSubject() {}, setKeywords() {}, setProducer() {}, setCreator() {},
    context: {enumerateIndirectObjects: () => [...objects], lookup: ref => objects.get(ref), assign: (ref, value) => objects.set(ref, value), delete: ref => objects.delete(ref)},
    embedJpg: async bytes => {objects.set('new', new PDFRawStream(bytes.byteLength)); return {ref: 'new', embed: async () => {}};},
    save: async () => new Uint8Array(quality > 0.5 ? cap + 1 : cap),
  };
  const context = vm.createContext({
    Blob, TARGET_MAX: cap,
    window: {PDFLib: {PDFDocument: {load: async () => doc}, PDFRawStream, PDFName: {of: key => key}}},
    removeUnusedPdfObjects: () => {}, deduplicatePdfImages: async () => {},
    pdfImageToBitmap: async () => ({width: 3000, height: 2000, close: () => closed++}),
    encodeJpeg: async (bitmap, width, height, q) => {quality = q; qualities.push(q); return new Blob([new Uint8Array(Math.round(q * 1000))]);},
    pdfContentSnapshot: async buffer => buffer.byteLength === 1 ? 'same' : outputText,
  });
  vm.runInContext(source('makeResult') + source('optimizePdfImages'), context);
  const file = {size: 2000000, name: 'scan.pdf', arrayBuffer: async () => new ArrayBuffer(1)};
  const result = await context.optimizePdfImages(file, () => {});
  assert.equal(result.renderedPdf, false);
  assert.equal(result.blob.size, cap);
  assert.equal(qualities.at(-1), 0.5);
  assert.equal(qualities.length, 7);
  assert.equal(closed, 1);
  objects.set('image', new PDFRawStream(2000)); outputText = 'changed';
  await assert.rejects(context.optimizePdfImages(file, () => {}), /content verification failed/);
  assert.equal(closed, 2);
});

test('last PDF fallback can actually reduce resolution and JPEG quality', async () => {
  let scale, quality, destroyed = false, pageSize;
  const scales = [];
  const page = {getViewport: options => {scales.push(options.scale); scale = Math.max(scale || 0, options.scale); return {width: 612 * options.scale, height: 792 * options.scale};}, render: () => ({promise: Promise.resolve()})};
  const doc = {embedJpg: async () => ({}), addPage: dimensions => {pageSize = dimensions; return {drawImage() {}};}, save: async () => new Uint8Array(10)};
  const context = vm.createContext({
    Blob, TARGET_MAX: 972800, MIN_JPEG_QUALITY: 0.62, LEVELS: {high: {pdfDpi: 96, pdfQuality: 0.68}}, state: {codecs: {}},
    window: {pdfjsLib: {GlobalWorkerOptions: {}, getDocument: () => ({promise: Promise.resolve({numPages: 1, getPage: async () => page, destroy: async () => {destroyed = true;}})})}, PDFLib: {PDFDocument: {create: async () => doc}}},
    getCanvas: () => ({getContext: () => ({})}),
    canvasToBlob: async (canvas, type, q) => {quality = q; return new Blob([new Uint8Array(10)]);},
  });
  vm.runInContext(source('renderPdfToImagePdf'), context);
  await context.renderPdfToImagePdf(new ArrayBuffer(0), 'high', 2000000, () => {}, false, {dpiScale: 0.24, qualityDelta: -0.42, minimumQuality: 0.28});
  assert.equal(quality, 0.28);
  assert.deepEqual([...pageSize], [612, 792]);
  // getViewport(scale:1) is also used to preserve the physical page size.
  assert.equal(scale, 1);
  assert.equal(scales[0], 60 / 72);
  assert.equal(destroyed, true);
});
