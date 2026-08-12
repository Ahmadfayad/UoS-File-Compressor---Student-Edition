## 2024-05-24 - Integer Math for Pixel Hot Loops
**Learning:** In vanilla JS pixel processing (like `canvas.getImageData`), floating point math (`Math.round(r * 0.299 + ...`) and string interpolation (`${r}-${g}-${b}`) inside the `index += 4` loop cause significant garbage collection pressure and CPU overhead.
**Action:** Use fixed-point integer arithmetic (`(r * 77 + g * 150 + b * 29) >> 8`) and bitwise packing (`(r >> 5) << 10 | (g >> 5) << 5 | (b >> 5)`) for >3x speedup in hot loops processing millions of pixels.
