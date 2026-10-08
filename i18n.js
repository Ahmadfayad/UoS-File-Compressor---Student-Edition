/* Shared interface translations. Uploaded documents and submitted comments are never translated. */
(() => {
  'use strict';
  const key = 'uos-interface-language';
  const arabic = {
    'UoS File Compressor': 'أداة ضغط الملفات بجامعة الشارقة',
    'University of Sharjah logo': 'شعار جامعة الشارقة',
    'University of Sharjah': 'جامعة الشارقة',
    'University of Sharjah - Office of the Registrar': 'جامعة الشارقة — إدارة التسجيل',
    'Powered by Ahmad Albalbissi': 'تطوير أحمد البلبيسي',
    'Information': 'معلومات',
    'Close information': 'إغلاق المعلومات',
    'Privacy and Data Handling': 'الخصوصية ومعالجة البيانات',
    'All file processing takes place locally in your browser; files are not uploaded. If you voluntarily submit feedback, your rating and optional comment are transmitted to and stored in our feedback database for service evaluation and improvement.': 'تُعالج جميع الملفات محليًا داخل متصفحك، ولا تُرفع إلى الخادم. وإذا اخترت إرسال تقييمك، فسيُرسل التقييم والتعليق الاختياري إلى قاعدة بيانات الملاحظات ويُحفظان فيها لأغراض تقييم الخدمة وتحسينها.',
    'Files are processed locally. Submitted feedback is stored for service evaluation.': 'تُعالج الملفات محليًا، وتُحفظ الملاحظات المرسلة لأغراض تقييم الخدمة.',
    'Compress PDFs and images.': 'ضغط ملفات PDF والصور.',
    'Compress PDFs, images, and text files.': 'ضغط ملفات PDF والصور والملفات النصية.',
    'Select one or more files and save each result individually.': 'اختر ملفًا واحدًا أو أكثر، ثم احفظ كل ملف ناتج على حدة.',
    'Choose Tool': 'اختر الأداة',
    'Tool mode': 'أدوات معالجة الملفات',
    'Compress': 'ضغط', 'Merge': 'دمج', 'Split': 'تقسيم', 'Convert': 'تحويل',
    'compress': 'ضغط', 'merge': 'دمج', 'split': 'تقسيم', 'convert': 'تحويل',
    'Reduce file size for separate downloads': 'تقليل حجم الملفات وتنزيل كل ملف على حدة',
    'Combine PDFs and images into one PDF': 'دمج ملفات PDF والصور في مستند PDF واحد',
    'Extract pages from a PDF — preview, pick, download': 'معاينة صفحات PDF وتحديدها واستخراجها',
    'Change formats (JPG, PNG, WEBP, PDF)': 'تحويل الصيغ: JPG وPNG وWEBP وPDF',
    'Upload file': 'اختيار ملف',
    'Upload a PDF to split': 'اختيار مستند PDF لتقسيمه',
    'Upload files to merge': 'اختيار الملفات المطلوب دمجها',
    'Upload files to compress': 'اختيار الملفات المطلوب ضغطها',
    'Drag & drop PDFs or images': 'اسحب ملفات PDF أو الصور وأفلتها هنا',
    'Drag & drop PDFs, images, or text files': 'اسحب ملفات PDF أو الصور أو الملفات النصية وأفلتها هنا',
    'or click to browse': 'أو اضغط لاختيار الملفات',
    'Selected Files': 'الملفات المحددة', 'Add Files': 'إضافة ملفات', 'Clear files': 'إزالة الملفات',
    'Compress File': 'ضغط الملف', 'Compress Files': 'ضغط الملفات',
    'Merge PDFs and images into one PDF.': 'دمج ملفات PDF والصور في مستند PDF واحد.',
    'Choose multiple PDFs or images, merge them into one document.': 'اختر ملفات PDF أو صورًا متعددة لدمجها في مستند واحد.',
    'Drag & drop files to merge': 'اسحب الملفات المطلوب دمجها وأفلتها هنا',
    'Choose PDFs or images to combine into one PDF': 'اختر ملفات PDF أو صورًا لدمجها في مستند PDF واحد',
    'Files To Merge': 'الملفات المطلوب دمجها', 'Select 2+ Files': 'اختر ملفين على الأقل',
    'Merge Into One PDF': 'دمج في مستند PDF واحد',
    'Split a PDF by previewing and picking pages.': 'تقسيم مستند PDF بعد معاينة صفحاته وتحديدها.',
    'Upload one PDF, preview every page, then download the pages you want — separately or merged.': 'اختر مستند PDF واحدًا، ثم عاين صفحاته وحدد الصفحات المطلوبة لتنزيلها منفصلة أو ضمن مستند واحد.',
    'Drag & drop a PDF to split': 'اسحب مستند PDF المطلوب تقسيمه وأفلته هنا',
    'Only one PDF at a time': 'مستند PDF واحد في كل مرة', 'Source PDF': 'مستند PDF الأصلي',
    'Extract Pages': 'استخراج الصفحات', 'Upload a PDF first': 'اختر مستند PDF أولًا',
    'Select pages to extract': 'حدد الصفحات المطلوب استخراجها',
    'Convert & compress images or PDFs.': 'تحويل الصور أو ملفات PDF وضغطها.',
    'Change image formats, or turn PDF pages into images — optimized to under 1MB.': 'حوّل صيغ الصور أو صفحات PDF إلى صور، مع تقليل حجم كل ملف ناتج إلى أقل من 1 ميغابايت.',
    'Drag & drop images or PDFs to convert': 'اسحب الصور أو ملفات PDF المطلوب تحويلها وأفلتها هنا',
    'Files to Convert': 'الملفات المطلوب تحويلها', 'Convert File': 'تحويل الملف', 'Convert Files': 'تحويل الملفات',
    'PDF only': 'ملفات PDF فقط',
    'Generating page previews…': 'جارٍ إعداد معاينات الصفحات…',
    'Select all pages': 'تحديد جميع الصفحات', 'Select all': 'تحديد الكل',
    'Clear selection': 'إلغاء التحديد', 'Clear Selection': 'إلغاء التحديد', 'Clear': 'إلغاء',
    'Invert selection': 'عكس التحديد', 'Invert': 'عكس التحديد',
    'Add range:': 'إضافة نطاق:', 'e.g. 1-5, 8, 11-13': '1-5, 8, 11-13',
    'Page range input': 'نطاق الصفحات', 'Add pages from range': 'إضافة صفحات النطاق', 'Add': 'إضافة',
    'PDF page thumbnails': 'معاينات صفحات PDF', 'Download as': 'التنزيل بصيغة', 'Download format': 'صيغة التنزيل',
    'Separate PDFs (ZIP)': 'ملفات PDF منفصلة ضمن ملف ZIP',
    'Each page as its own PDF in a .zip file': 'كل صفحة في ملف PDF مستقل ضمن ملف ZIP',
    'Merged PDF': 'مستند PDF موحد', 'All selected pages in one PDF': 'جميع الصفحات المحددة في مستند PDF واحد',
    'Tip: you only selected one page — Merged PDF will give you a single file.': 'لقد حددت صفحة واحدة فقط؛ اختر «مستند PDF موحد» لتنزيلها في ملف مستقل.',
    'Convert to': 'التحويل إلى', 'Best for photos': 'مناسب للصور الفوتوغرافية',
    'Best for quality': 'مناسب للحفاظ على الجودة', 'Modern & small': 'صيغة حديثة بحجم صغير', 'Document format': 'صيغة المستندات',
    '⚠️ Your image has transparency. JPG will fill it with white.': 'تحتوي الصورة على مناطق شفافة؛ ستُستبدل بخلفية بيضاء عند التحويل إلى JPG.',
    'Preparing…': 'جارٍ التحضير…', 'Starting…': 'جارٍ البدء…',
    'Processing locally. Nothing is uploaded.': 'تجري المعالجة على جهازك دون رفع الملفات.',
    'Compression Complete': 'اكتمل ضغط الملفات', 'Merge Complete': 'اكتمل دمج الملفات',
    'Split Complete': 'اكتمل استخراج الصفحات', 'Conversion Complete': 'اكتمل تحويل الملفات',
    'Processed locally. Save each file individually.': 'تمت المعالجة على جهازك. احفظ كل ملف على حدة.',
    'Merged and processed locally. Save the final PDF.': 'تم الدمج والمعالجة على جهازك. احفظ مستند PDF الناتج.',
    'Pages extracted locally. Nothing was uploaded.': 'تم استخراج الصفحات على جهازك دون رفع المستند.',
    'Converted and compressed locally. Save each file.': 'تم التحويل والضغط على جهازك. احفظ كل ملف ناتج.',
    'Compression Failed': 'تعذر ضغط الملفات', 'Processing failed': 'تعذرت معالجة الملفات',
    'No files were processed successfully.': 'لم تكتمل معالجة أي من الملفات.',
    'An unexpected error occurred.': 'حدث خطأ غير متوقع. يرجى المحاولة مجددًا.',
    'Try Again': 'المحاولة مجددًا', 'Download': 'تنزيل',
    'Download All (Separate)': 'تنزيل جميع الملفات منفصلة', 'Download All (ZIP)': 'تنزيل الجميع ضمن ملف ZIP',
    'Ready to upload · Under 1 MB': 'جاهز للرفع · أقل من 1 ميغابايت',
    'Keep your original document for official verification.': 'احتفظ بالمستند الأصلي لأغراض التحقق الرسمي.',
    'This copy may not support text search or fillable fields.': 'قد لا تدعم هذه النسخة البحث في النص أو تعبئة الحقول.',
    'Already within the size limit; original file kept.': 'حجم الملف ضمن الحد المسموح؛ تم الاحتفاظ بالنسخة الأصلية.',
    'Zipping…': 'جارٍ إنشاء ملف ZIP…',
    '100% Private': 'خصوصية تامة', 'Everything stays on this device': 'تبقى ملفاتك على هذا الجهاز',
    'Fast Workflow': 'سهولة وسرعة الاستخدام', 'Smooth upload, compress, and download flow': 'اختيار الملفات وضغطها وتنزيلها بخطوات يسيرة',
    'Target Range': 'الحجم المستهدف', 'Designed around 300 KB to 1 MB': 'حجم مستهدف بين 300 كيلوبايت و1 ميغابايت',
    'Customer satisfaction': 'رضا المستفيدين', 'Help us improve the UoS File Compressor': 'ساهم في تحسين أداة ضغط الملفات بجامعة الشارقة',
    'Overall, how satisfied were you with your experience today?': 'ما مدى رضاك العام عن تجربتك مع الخدمة اليوم؟',
    'Overall satisfaction rating': 'تقييم الرضا العام',
    '1 star, very dissatisfied': 'نجمة واحدة: غير راضٍ إطلاقًا', '2 stars, dissatisfied': 'نجمتان: غير راضٍ',
    '3 stars, neither satisfied nor dissatisfied': 'ثلاث نجوم: محايد', '4 stars, satisfied': 'أربع نجوم: راضٍ',
    '5 stars, very satisfied': 'خمس نجوم: راضٍ جدًا', 'Very dissatisfied': 'غير راضٍ إطلاقًا', 'Very satisfied': 'راضٍ جدًا',
    'What influenced your rating?': 'ما الأسباب التي أثرت في تقييمك؟', '(optional)': '(اختياري)',
    'Share a suggestion or a little more context': 'اكتب اقتراحًا أو وضح أسباب تقييمك',
    'Please do not include personal or confidential information. Submitted feedback may be reviewed and analyzed for service evaluation and improvement.': 'يرجى عدم إدراج معلومات شخصية أو سرية. قد تُراجع الملاحظات المرسلة وتُحلل لأغراض تقييم الخدمة وتحسينها.',
    'Leave this field empty': 'اترك هذا الحقل فارغًا', 'Not now': 'لاحقًا', 'Submit feedback': 'إرسال التقييم',
    'Thank you for your feedback': 'شكرًا لمشاركتك في تقييم الخدمة',
    'Your response will help us improve this service.': 'ستساهم ملاحظاتك في تحسين هذه الخدمة.',
    'Done': 'تم', 'Open customer satisfaction survey': 'فتح استبيان رضا المستفيدين', 'Share feedback': 'تقييم الخدمة',
    'Thanks for sharing feedback today': 'شكرًا لمشاركتك في تقييم الخدمة اليوم',
    'You can send another response tomorrow. Your feedback helps us improve this service.': 'يمكنك إرسال تقييم آخر غدًا. تسهم ملاحظاتك في تحسين الخدمة.',
    'Your response will help us improve this service. You can share feedback again tomorrow.': 'ستساهم ملاحظاتك في تحسين الخدمة. يمكنك إرسال تقييم آخر غدًا.',
    'Submitting…': 'جارٍ الإرسال…',
    "Please close this survey and try again. We couldn't identify which tool you used.": 'يرجى إغلاق الاستبيان والمحاولة مجددًا؛ تعذر تحديد الأداة المستخدمة.',
    'Feedback is temporarily unavailable. Please try again later.': 'خدمة إرسال التقييم غير متاحة مؤقتًا. يرجى المحاولة لاحقًا.',
    "We couldn't save your feedback just now. Please try again later.": 'تعذر حفظ تقييمك حاليًا. يرجى المحاولة لاحقًا.',
    'Feedback submission failed.': 'تعذر إرسال التقييم.',
    "We couldn't submit your feedback right now. Please try again.": 'تعذر إرسال تقييمك حاليًا. يرجى المحاولة مجددًا.',
    'Compress as Image': 'ضغط الصورة بصيغتها الأصلية',
    'Keep original format (JPEG, PNG, etc.)': 'الاحتفاظ بالصيغة الأصلية، مثل JPEG أو PNG',
    'Convert & Compress as PDF': 'التحويل إلى PDF والضغط', 'Convert to PDF format': 'تحويل الصورة إلى مستند PDF',
    'Image File Detected': 'تم التعرف على ملف صورة', 'Image Files Detected': 'تم التعرف على ملفات صور',
    'Loading image…': 'جارٍ تحميل الصورة…', 'Trying lossless PNG optimization…': 'جارٍ تحسين الصورة مع الحفاظ على جودتها…',
    'Applying light optimization…': 'جارٍ تحسين حجم الملف…', 'Trying stronger optimization…': 'جارٍ تطبيق ضغط إضافي…',
    'Searching best quality…': 'جارٍ اختيار أفضل جودة ضمن الحجم المسموح…', 'Analyzing image…': 'جارٍ فحص الصورة…',
    'Encoding…': 'جارٍ معالجة الصورة…', 'Compressing to fit size limit…': 'جارٍ تقليل الحجم إلى الحد المسموح…',
    'Finalizing…': 'جارٍ إتمام المعالجة…', 'Loading PDF…': 'جارٍ تحميل مستند PDF…', 'Building PDF…': 'جارٍ إنشاء مستند PDF…',
    'Converting image to PDF…': 'جارٍ تحويل الصورة إلى PDF…',
    'Applying guaranteed fallback…': 'جارٍ تطبيق ضغط إضافي للوصول إلى الحجم المسموح…',
    'Checking pages and searchable text…': 'جارٍ التحقق من الصفحات وسلامة النص…',
    'High-quality raster fallback…': 'جارٍ إعداد نسخة مصغرة من المستند…',
    'File already within target size': 'حجم الملف ضمن الحد المسموح بالفعل',
    'Preparing text payload…': 'جارٍ إعداد الملف النصي…', 'Compressing with GZIP…': 'جارٍ ضغط الملف النصي…',
    'GZIP savings negligible, keeping original text…': 'تم الاحتفاظ بالنص الأصلي لعدم وجود تقليل ملموس في الحجم…',
    'Preparing merged PDF…': 'جارٍ إعداد مستند PDF الموحد…', 'Complete!': 'اكتملت المعالجة',
    'Loading source PDF…': 'جارٍ تحميل المستند الأصلي…', 'Creating ZIP archive…': 'جارٍ إنشاء ملف ZIP…',
    'Download starting…': 'جارٍ بدء التنزيل…', 'Saving PDF…': 'جارٍ حفظ مستند PDF…',
    'Compressing extracted PDF…': 'جارٍ ضغط المستند المستخرج…', 'Preview unavailable': 'المعاينة غير متاحة',
    'Drop a PDF to split': 'أفلت مستند PDF المطلوب تقسيمه هنا', 'Drop PDFs or images here': 'أفلت ملفات PDF أو الصور هنا',
    'Drop PDFs, images, or text files here': 'أفلت ملفات PDF أو الصور أو الملفات النصية هنا',
    'Loading codecs…': 'جارٍ تجهيز الخدمة…', 'Compression engine status': 'حالة خدمة المعالجة',
    'Canvas Fallback': 'المعالجة الأساسية متاحة',
    'IMAGE': 'صورة',
    'Canvas encoding returned null.': 'تعذرت معالجة الصورة. يرجى المحاولة مجددًا.',
    'Unknown error.': 'حدث خطأ غير متوقع.', 'unknown error.': 'حدث خطأ غير متوقع.',
    'This field is required.': 'يرجى تعبئة هذا الحقل.',
    'Please enter a valid value.': 'يرجى إدخال قيمة صالحة.',
    'Unable to compress this image within the target constraints.': 'تعذر ضغط الصورة إلى الحجم المسموح. يرجى استخدام صورة أصغر.',
    'Unable to convert this image under the size limit.': 'تعذر تحويل الصورة ضمن الحد المسموح لحجم الملف.',
    'Unable to meet the 1 MB admission limit. No oversized download was created.': 'تعذر تقليل حجم الملف إلى أقل من 1 ميغابايت. لم يُنشأ ملف يتجاوز الحد المسموح.',
    'Unable to process this file without changing its format or content.': 'تعذرت معالجة الملف مع الحفاظ على صيغته ومحتواه.',
    'Unable to compress this PDF without losing pages. The original document was not changed.': 'تعذر ضغط المستند إلى الحجم المسموح مع الحفاظ على جميع صفحاته. لم يُعدّل المستند الأصلي.',
    'Unable to create a complete fallback PDF. The original file was not changed.': 'تعذر إنشاء نسخة كاملة من المستند. لم يُعدّل الملف الأصلي.',
    'GZIP compression is not supported in this browser.': 'لا يدعم هذا المتصفح ضغط الملفات النصية بهذه الصيغة.',
    'PDF engine is not available for text fallback conversion.': 'خدمة تحويل النص إلى PDF غير متاحة حاليًا.',
    'Unable to create a cap-safe fallback PDF from text content.': 'تعذر تحويل النص إلى PDF ضمن الحد المسموح للحجم.',
    'PDF content verification failed.': 'تعذر التحقق من سلامة محتوى المستند.',
    'Unable to create a high-quality raster fallback PDF.': 'تعذر إنشاء نسخة مصغرة بجودة مناسبة.',
    'Merge failed.': 'تعذر دمج الملفات.', 'Conversion failed.': 'تعذر تحويل الملف.', 'Compression failed.': 'تعذر ضغط الملف.',
    'The combined files for a merge must total 100 MB or less.': 'يجب ألا يتجاوز الحجم الإجمالي للملفات المطلوب دمجها 100 ميغابايت.',
    'No supported local PDF or image files were selected.': 'لم تُحدد ملفات PDF أو صور بصيغ مدعومة.',
    'No supported local PDF, image, or text files were selected.': 'لم تُحدد ملفات PDF أو صور أو ملفات نصية بصيغ مدعومة.',
    'This PDF is password-protected. Split isn’t supported for encrypted files.': 'هذا المستند محمي بكلمة مرور. يرجى إزالة الحماية قبل تقسيمه.',
    'Failed to open this PDF. It may be corrupt or password-protected.': 'تعذر فتح المستند؛ قد يكون تالفًا أو محميًا بكلمة مرور.',
    'This PDF has no pages. Please upload a valid PDF.': 'لا يحتوي المستند على صفحات. يرجى اختيار مستند PDF صالح.',
    'The PDF must be 100 MB or smaller.': 'يجب ألا يتجاوز حجم مستند PDF مقدار 100 ميغابايت.',
    'Please upload a PDF file to split.': 'يرجى اختيار مستند PDF لتقسيمه.',
    'Split mode only accepts PDF files. Please drop a single PDF.': 'تقبل أداة التقسيم ملفات PDF فقط. يرجى اختيار مستند واحد.',
    'Split mode accepts only one PDF at a time. Please drop a single PDF file.': 'تقبل أداة التقسيم مستند PDF واحدًا في كل مرة.',
    'Extraction cancelled because the tool mode changed.': 'أُلغي استخراج الصفحات بسبب تغيير الأداة.',
    'No source PDF found. Please upload a PDF first.': 'لم يُحدد مستند أصلي. يرجى اختيار مستند PDF أولًا.',
    'Please select at least one page to extract.': 'يرجى تحديد صفحة واحدة على الأقل لاستخراجها.',
    'Feedback Admin | UoS File Compressor': 'إدارة التقييمات | أداة ضغط الملفات بجامعة الشارقة',
    'Customer feedback': 'تقييمات المستفيدين', 'Review ratings and download reports for any date period.': 'استعراض التقييمات وتنزيل التقارير لأي فترة زمنية.',
    'Back to compressor': 'العودة إلى أداة ضغط الملفات', 'Administrator sign-in': 'تسجيل دخول المسؤول',
    'Sign in with your administrator email and password.': 'أدخل البريد الإلكتروني وكلمة المرور لحساب المسؤول.',
    'Email address': 'البريد الإلكتروني', 'Password': 'كلمة المرور', 'Sign in': 'تسجيل الدخول', 'Sign out': 'تسجيل الخروج',
    'Feedback reports': 'تقارير تقييم الخدمة', 'Date period': 'الفترة الزمنية', 'All records': 'جميع السجلات',
    'Weekly': 'أسبوعية', 'Monthly': 'شهرية', 'Yearly': 'سنوية', 'Custom date range': 'فترة محددة',
    'Service': 'الخدمة', 'All services': 'جميع الخدمات', 'Date timezone': 'المنطقة الزمنية', 'Dubai (UTC+4)': 'دبي (UTC+4)',
    'Choose a date in the week, month, or year': 'اختر تاريخًا ضمن الأسبوع أو الشهر أو السنة المطلوبة',
    'From': 'من', 'Through': 'إلى',
    'Weeks run Monday to Sunday. Custom ranges include both dates. Exported timestamps use UTC.': 'يبدأ الأسبوع يوم الاثنين وينتهي يوم الأحد. تشمل الفترة المحددة تاريخَي البداية والنهاية. تُعرض الأوقات في التقارير المنزلة وفق التوقيت العالمي المنسق (UTC).',
    'Show feedback': 'عرض التقييمات', 'Download CSV': 'تنزيل تقرير CSV', 'Download Excel (.xlsx)': 'تنزيل تقرير Excel (.xlsx)',
    'Matching feedback': 'التقييمات المطابقة', 'ID': 'الرقم المرجعي', 'Submitted': 'تاريخ الإرسال', 'Rating': 'التقييم',
    'Comment': 'التعليق', 'Actions': 'الإجراءات', 'Authorized users': 'المستخدمون المخولون',
    'Add people who may view and export feedback. Only the owner can manage accounts.': 'أضف مستخدمين مخولين باستعراض التقييمات وتنزيل التقارير. تقتصر إدارة الحسابات على مالك النظام.',
    'User email address': 'البريد الإلكتروني للمستخدم', 'New user password': 'كلمة المرور الجديدة للمستخدم',
    'Add authorized user': 'إضافة مستخدم مخول', 'Reset password / restore access': 'إعادة تعيين كلمة المرور واستعادة الصلاحية',
    'Choose a unique password with at least 6 characters. Share credentials privately with the intended user. Passwords cannot be viewed after saving.': 'اختر كلمة مرور غير مستخدمة سابقًا تتكون من 6 أحرف على الأقل، وشارك بيانات الدخول بصورة خاصة مع المستخدم المعني. لا يمكن عرض كلمات المرور بعد حفظها.',
    'Email': 'البريد الإلكتروني', 'Access': 'الصلاحية', 'Added': 'تاريخ الإضافة',
    'Loading feedback...': 'جارٍ تحميل التقييمات…', 'Delete feedback': 'حذف التقييم', 'No comment': 'لا يوجد تعليق',
    'All dates': 'جميع التواريخ', 'Feedback loaded.': 'تم تحميل التقييمات.',
    'No feedback matches these filters.': 'لا توجد تقييمات تطابق معايير البحث.',
    'Signing in...': 'جارٍ تسجيل الدخول…', 'Signed out.': 'تم تسجيل الخروج.',
    'Unable to connect. Please try again.': 'تعذر الاتصال. يرجى المحاولة مجددًا.', 'Active': 'فعّالة', 'Revoked': 'ملغاة',
    'Reset / restore': 'إعادة التعيين والاستعادة', 'Revoke access': 'إلغاء الصلاحية',
    'Enter a new password above, then choose Reset password / restore access.': 'أدخل كلمة مرور جديدة في الحقل أعلاه، ثم اختر إعادة تعيين كلمة المرور واستعادة الصلاحية.',
    'Saving account...': 'جارٍ حفظ الحساب…',
    'Permanently delete this feedback?': 'هل تريد حذف هذا التقييم نهائيًا؟',
    'This cannot be undone.': 'لا يمكن التراجع عن هذا الإجراء.',
    'Feedback storage is not configured. Set DATABASE_URL in Vercel Production.': 'لم تُهيأ خدمة حفظ التقييمات. يرجى ضبط DATABASE_URL في إعدادات بيئة الإنتاج على Vercel.',
    'Set ADMIN_EMAIL in Vercel Production.': 'يرجى ضبط ADMIN_EMAIL في إعدادات بيئة الإنتاج على Vercel.',
    'Set ADMIN_PASSWORD in Vercel Production.': 'يرجى ضبط ADMIN_PASSWORD في إعدادات بيئة الإنتاج على Vercel.',
    'ADMIN_PASSWORD must contain 6–256 characters. Update it in Vercel Production and redeploy.': 'يجب أن تتكون كلمة مرور المسؤول من 6 إلى 256 حرفًا. يرجى تحديث ADMIN_PASSWORD في بيئة الإنتاج على Vercel وإعادة نشر الموقع.',
    'Method not allowed.': 'هذا الإجراء غير مسموح.', 'Cross-origin requests are not accepted.': 'لا تُقبل الطلبات من موقع آخر.',
    'Invalid request origin.': 'مصدر الطلب غير صالح.', 'Admin sign-in is not configured.': 'لم تُهيأ خدمة تسجيل دخول المسؤول.',
    'Please sign in.': 'يرجى تسجيل الدخول.', 'Admin sign-in is temporarily unavailable.': 'تسجيل دخول المسؤول غير متاح مؤقتًا.',
    'Admin sign-in is temporarily unavailable. Check the admin database setup.': 'تسجيل دخول المسؤول غير متاح مؤقتًا. يرجى التحقق من إعداد قاعدة بيانات الإدارة.',
    'Enter your email and password.': 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
    'Too many sign-in attempts. Try again in 15 minutes.': 'تجاوزت عدد محاولات تسجيل الدخول المسموح. يرجى المحاولة بعد 15 دقيقة.',
    'Email or password is incorrect.': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    'This account cannot delete feedback.': 'لا يملك هذا الحساب صلاحية حذف التقييمات.',
    'Select a valid feedback ID and confirm deletion.': 'حدد رقمًا مرجعيًا صالحًا للتقييم وأكد الحذف.',
    'Feedback was not found or was already deleted.': 'لم يُعثر على التقييم، أو سبق حذفه.',
    'Feedback deleted.': 'تم حذف التقييم.', 'Feedback could not be deleted. Please try again.': 'تعذر حذف التقييم. يرجى المحاولة مجددًا.',
    'Only the owner can manage authorized users.': 'تقتصر إدارة المستخدمين المخولين على مالك النظام.',
    'Enter a valid email address.': 'يرجى إدخال بريد إلكتروني صالح.', 'Manage the owner credentials in Vercel.': 'تُدار بيانات دخول مالك النظام من إعدادات Vercel.',
    'Use a unique password of 6–256 characters.': 'استخدم كلمة مرور غير مستخدمة سابقًا تتكون من 6 إلى 256 حرفًا.',
    'This email already has an account. Use Reset password to update or restore access.': 'يوجد حساب بهذا البريد الإلكتروني. استخدم إعادة تعيين كلمة المرور لتحديث الحساب أو استعادة صلاحيته.',
    'Access revoked.': 'تم إلغاء الصلاحية.', 'Authorized user added.': 'تمت إضافة المستخدم المخول.',
    'Password reset and access enabled. Previous sessions are invalid.': 'تمت إعادة تعيين كلمة المرور وتفعيل الصلاحية. أُلغيت جلسات الدخول السابقة.',
    'User account not found.': 'لم يُعثر على حساب المستخدم.',
    'User management is temporarily unavailable. Check the admin database setup.': 'إدارة المستخدمين غير متاحة مؤقتًا. يرجى التحقق من إعداد قاعدة بيانات الإدارة.',
    'Invalid timezone.': 'المنطقة الزمنية غير صالحة.', 'Choose a valid timeline date.': 'يرجى اختيار تاريخ صالح للفترة الزمنية.',
    'Invalid export period.': 'الفترة الزمنية للتقرير غير صالحة.',
    'Choose a valid start and end date, with the start date no later than the end date.': 'اختر تاريخَي بداية ونهاية صالحين، بحيث لا يتجاوز تاريخ البداية تاريخ النهاية.',
    'Invalid service filter.': 'معيار تصفية الخدمة غير صالح.', 'Invalid export format.': 'صيغة التقرير غير صالحة.',
    'Feedback storage is not configured.': 'لم تُهيأ خدمة حفظ التقييمات.',
    'Feedback export could not be generated.': 'تعذر إعداد تقرير التقييمات.',
    'Feedback is too large.': 'يتجاوز حجم التقييم الحد المسموح.',
    'Rating must be a whole number from 1 to 5.': 'يجب أن يكون التقييم عددًا صحيحًا من 1 إلى 5.',
    'Invalid tool mode.': 'الأداة المحددة غير صالحة.', 'Comment must be 1000 characters or fewer.': 'يجب ألا يتجاوز التعليق 1000 حرف.',
    'Feedback could not be stored.': 'تعذر حفظ التقييم.',
    'Failed to fetch': 'تعذر الاتصال بالخدمة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجددًا.',
    'Device language': 'وفق لغة الجهاز', 'Your selection': 'اختيارك المحفوظ', 'Interface language': 'لغة الواجهة',
  };
  // Dynamic labels are matched as complete interface messages, never arbitrary substrings.
  const patterns = [
    [/^(\d+) of (\d+) pages? selected$/, (_, a, b) => `الصفحات المحددة: ${a} من ${b}`],
    [/^Page (\d+) of (\d+)(, (not selected|selected))?$/, (_, a, b, suffix, selection) => `الصفحة ${a} من ${b}${suffix ? (selection === 'selected' ? '، محددة' : '، غير محددة') : ''}`],
    [/^Page (\d+)$/, (_, n) => `الصفحة ${n}`],
    [/^(\d+) pages?$/, (_, n) => `عدد الصفحات: ${n}`],
    [/^(\d+)% saved$/, (_, n) => `تقليل الحجم بنسبة ${n}%`], [/^(\d+)% larger$/, (_, n) => `زيادة الحجم بنسبة ${n}%`],
    [/^Converted from (.+)$/, (_, name) => `تم التحويل من الملف: ${name}`],
    [/^You've uploaded (\d+) images?\. How would you like to process (?:it|them)\?$/, (_, n) => `عدد الصور المختارة: ${n}. كيف ترغب في معالجتها؟`],
    [/^Scaling to (\d+)×(\d+)…$/, (_, w, h) => `جارٍ ضبط أبعاد الصورة إلى ${w} × ${h}…`],
    [/^(Converting|Rendering) page (\d+)\/(\d+)…$/, (_, action, n, total) => `جارٍ ${action === 'Converting' ? 'تحويل' : 'معالجة'} الصفحة ${n} من ${total}…`],
    [/^Optimizing embedded images \((\d+)\/(\d+)\)…$/, (_, n, total) => `جارٍ تحسين الصور داخل المستند… (${n} من ${total})`],
    [/^Rasterizing at high quality \((\d+)\/(\d+)\)…$/, (_, n, total) => `جارٍ إعداد نسخة مصغرة… (${n} من ${total})`],
    [/^Converting text to image PDF \((\d+)\/(\d+)\)…$/, (_, n, total) => `جارٍ تحويل النص إلى PDF… (${n} من ${total})`],
    [/^Merging (.+)…$/, (_, name) => `جارٍ دمج الملف: ${name}…`],
    [/^(Creating PDF for|Compressing|Copying) page (\d+)… \((\d+) of (\d+)\)$/, (_, action, page, n, total) => `جارٍ ${action === 'Compressing' ? 'ضغط' : action === 'Copying' ? 'نسخ' : 'إنشاء ملف PDF للصفحة'} ${action === 'Creating PDF for' ? '' : 'الصفحة '}${page}… (${n} من ${total})`],
    [/^Compressing ZIP… \((\d+)%\)$/, (_, n) => `جارٍ ضغط ملف ZIP… (${n}%)`],
    [/^Extracted (\d+) pages? from “(.+)” into (a ZIP|one PDF)\.$/, (_, n, name, type) => `تم استخراج ${n} من الصفحات من «${name}» وحفظها في ${type === 'a ZIP' ? 'ملف ZIP' : 'مستند PDF واحد'}.`],
    [/^Invalid range\. Use format like "1-5, 8, 11-13" \(1 to (\d+)\)\.$/, (_, total) => `نطاق الصفحات غير صالح. استخدم صيغة مثل 1-5, 8, 11-13 ضمن الصفحات من 1 إلى ${total}.`],
    [/^Each file must be 100 MB or smaller\. (.+) exceeds the limit\.$/, (_, names) => `يجب ألا يتجاوز حجم كل ملف 100 ميغابايت. الملفات التالية تتجاوز الحد المسموح: ${names}.`],
    [/^File too large: (.+)\. Maximum supported size is 100 MB\.$/, (_, size) => `حجم الملف كبير جدًا (${size}). الحد الأقصى المسموح هو 100 ميغابايت.`],
    [/^Unsupported file type: (.+)\. Please upload a PDF, image, or text file\.$/, (_, type) => `صيغة الملف غير مدعومة (${type}). يرجى اختيار ملف PDF أو صورة أو ملف نصي.`],
    [/^This browser cannot encode (.+)\. Choose a supported output format\.$/, (_, type) => `لا يدعم هذا المتصفح إنشاء ملفات بصيغة ${type}. يرجى اختيار صيغة مدعومة.`],
    [/^Unable to convert page (\d+) under the size limit\.$/, (_, n) => `تعذر تحويل الصفحة ${n} ضمن الحد المسموح للحجم.`],
    [/^Your browser doesn't support (.+) files\. Please convert to JPG or PNG first(.*)$/, (_, type, suffix) => `لا يدعم متصفحك ملفات ${type}. يرجى تحويلها أولًا إلى JPG أو PNG${suffix.includes('Safari') ? '، أو استخدام Safari لملفات HEIC.' : '.'}`],
    [/^(Failed to load the PDF|Extraction failed): (.+)$/, (_, action, error) => `${action === 'Extraction failed' ? 'تعذر استخراج الصفحات' : 'تعذر تحميل المستند'}: ${translate(error, 'ar')}`],
    [/^Signed in as (.+)$/, (_, email) => `تم تسجيل الدخول بالحساب: ${email}`],
    [/^(\d+) responses?(?: · Average rating ([\d.]+)\/5)?$/, (_, n, avg) => `عدد التقييمات: ${n}${avg ? ` · متوسط التقييم: ${avg} من 5` : ''}`],
    [/^From (.+) to (.+) \((.+)\)$/, (_, start, end, zone) => `من ${start} إلى ${end} (${zone})`],
    [/^Your (Excel|CSV) export is ready\.$/, (_, type) => `تقرير ${type} جاهز للتنزيل.`],
    [/^Feedback #(\d+) deleted\.$/, (_, id) => `تم حذف التقييم رقم ${id}.`],
    [/^Access revoked for (.+)\.$/, (_, email) => `تم إلغاء صلاحية الحساب: ${email}.`],
    [/^Revoke feedback access for (.+)\?$/, (_, email) => `هل تريد إلغاء صلاحية الاطلاع على التقييمات للحساب ${email}؟`],
    [/^Reset the password and enable access for (.+)\? Existing sessions will stop working\.$/, (_, email) => `هل تريد إعادة تعيين كلمة المرور وتفعيل صلاحية الحساب ${email}؟ ستُلغى جلسات الدخول الحالية.`],
    [/^Permanently delete feedback #(\d+) \((\d+)\/5, (.+)\)\? Comment: (.+) This cannot be undone\.$/, (_, id, rating, mode, comment) => `هل تريد حذف التقييم رقم ${id} نهائيًا؟ التقييم: ${rating} من 5، الخدمة: ${translate(mode, 'ar')}.\nالتعليق: ${comment}\nلا يمكن التراجع عن هذا الإجراء.`],
    [/^Request failed \((\d+)\)\.$/, (_, code) => `تعذر تنفيذ الطلب (${code}). يرجى المحاولة مجددًا.`],
    [/^Please enter at least (\d+) characters\.$/, (_, n) => `يرجى إدخال ${n} أحرف على الأقل.`],
    [/^.*encrypted.*$/i, () => 'هذا المستند محمي بكلمة مرور. يرجى إزالة الحماية قبل معالجته.'],
    [/^.*Invalid PDF.*$/i, () => 'مستند PDF غير صالح. يرجى اختيار مستند آخر.'],
    [/^PDF • (\d+) pages • (.+)$/, (_, n, size) => `PDF • عدد الصفحات: ${n} • ${size}`],
  ];
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Private browsing may disable storage. */ }
  let manual = saved === 'ar' || saved === 'en';
  let language = manual ? saved : (/^ar(?:-|$)/i.test(navigator.languages?.[0] || navigator.language || '') ? 'ar' : 'en');
  const originals = new WeakMap();
  const attributes = new WeakMap();
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  function translate(value, locale = language) {
    const text = normalize(String(value));
    if (locale !== 'ar' || !text) return String(value);
    if (Object.hasOwn(arabic, text)) return arabic[text];
    for (const [pattern, replace] of patterns) {
      const match = text.match(pattern);
      if (match) return replace(...match);
    }
    return String(value);
  }
  const excluded = 'script,style,textarea,code,pre,[data-no-i18n],.file-list-item-name,.result-item-name,#progress-name';
  function textNode(node) {
    if (!node.parentElement || node.parentElement.closest(excluded) || !node.data.trim()) return;
    let record = originals.get(node);
    if (!record || node.data !== record.output) record = {source: node.data};
    let translated = translate(record.source);
    if (language === 'ar' && translated === record.source && /[a-z]{3,}/i.test(translated)
        && node.parentElement.closest('#error-message,#feedback-error,.error .result-item-meta,.status.error')) {
      translated = 'تعذر إتمام العملية. يرجى التحقق من الملف أو البيانات المدخلة والمحاولة مجددًا.';
    }
    record.output = translated === record.source ? record.source : record.source.match(/^\s*/)[0] + translated + record.source.match(/\s*$/)[0];
    originals.set(node, record);
    if (node.data !== record.output) node.data = record.output;
  }
  function element(node) {
    if (node.closest(excluded)) return;
    const records = attributes.get(node) || {};
    for (const name of ['aria-label', 'title', 'placeholder', 'alt']) {
      const value = node.getAttribute(name);
      if (value === null) continue;
      let record = records[name];
      if (!record || value !== record.output) record = {source: value};
      record.output = translate(record.source);
      records[name] = record;
      if (value !== record.output) node.setAttribute(name, record.output);
    }
    attributes.set(node, records);
  }
  function render(root = document.documentElement) {
    if (root.nodeType === Node.TEXT_NODE) { textNode(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE) return;
    element(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) walker.currentNode.nodeType === Node.TEXT_NODE ? textNode(walker.currentNode) : element(walker.currentNode);
  }
  function controls() {
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.querySelectorAll('[data-language-source]').forEach(label => {label.textContent = translate(manual ? 'Your selection' : 'Device language');});
  }
  function setLanguage(next, remember = true) {
    if (!['en', 'ar'].includes(next)) return;
    language = next;
    if (remember) {
      manual = true;
      try {localStorage.setItem(key, next);} catch { /* The choice still works for this visit. */ }
    }
    document.documentElement.lang = next;
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    render(); controls();
    document.querySelectorAll('input,textarea,select').forEach(input => input.setCustomValidity(''));
    document.dispatchEvent(new CustomEvent('languagechange', {detail: {language: next}}));
  }
  window.AppLanguage = {translate, setLanguage, get language() {return language;}, get locale() {return language === 'ar' ? 'ar-AE' : 'en-GB';}};
  // Set direction before the body is parsed, avoiding an English layout flash.
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.addEventListener('DOMContentLoaded', () => {
    render(); controls();
    document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
    document.addEventListener('input', event => event.target.setCustomValidity?.(''));
    document.addEventListener('invalid', event => {
      const input = event.target;
      input.setCustomValidity('');
      if (language !== 'ar') return;
      const message = input.validity.valueMissing ? 'This field is required.'
        : input.validity.typeMismatch && input.type === 'email' ? 'Enter a valid email address.'
        : input.validity.tooShort ? `Please enter at least ${input.minLength} characters.`
        : 'Please enter a valid value.';
      input.setCustomValidity(translate(message));
    }, true);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === 'childList') record.addedNodes.forEach(render);
        else if (record.type === 'characterData') textNode(record.target);
        else element(record.target);
      }
    });
    observer.observe(document.documentElement, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'placeholder', 'alt']});
  });
})();
