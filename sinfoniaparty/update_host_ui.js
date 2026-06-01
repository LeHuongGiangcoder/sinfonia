const fs = require('fs');
const file = './app/quiz/host/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace dark background with light background
content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-background');
content = content.replace(/text-\[#0a0a0a\]/g, 'text-background');

// Replace light text/accents with primary color
content = content.replace(/\[#f3ede1\]/g, 'primary');

// Replace rgb variants of #f3ede1
content = content.replace(/rgba\(243,\s*237,\s*225,/g, 'rgba(75, 80, 6,');

// Add the vintage grain overlay to the wrapper
content = content.replace(
  /<div\n\s*className="fixed inset-0 pointer-events-none z-0"\n\s*style={{\n\s*background:\n\s*"radial-gradient\(circle at center, transparent 30%, rgba\(0,0,0,0\.4\) 100%\)",\n\s*}}\n\s*\/>/g,
  `<div className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]">
        <div className="w-full h-full" style={{
          backgroundImage: \`url('data:image/svg+xml,%3Csvg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/%3E%3CfeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23n)"/%3E%3C/svg%3E')\`,
        }} />
      </div>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.05) 100%)",
        }}
      />`
);

// Change "Bảng xếp hạng" heading to "Ranking" (keep purgatory class as requested: "để là ranking cho đỡ lỗi font nhé" implies they want the font but it works better with English text)
content = content.replace(
  /Bảng xếp hạng\n\s*<\/h2>/g,
  'Ranking\n              </h2>'
);

fs.writeFileSync(file, content);
console.log("Updated host page UI!");
