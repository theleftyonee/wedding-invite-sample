const fs = require('fs');
let code = fs.readFileSync('src/components/OpeningScreen.tsx', 'utf8');

const targetRegex = /<div className="flex flex-col items-center" style=\{\{ gap: "4px" \}\}>[\s\S]*?<\/div>/;

const replacement = `<div className="flex flex-col items-center" style={{ gap: "4px" }}>
            {!(!ceremony.displayDate || /SAMPLE|TO BE CONFIRMED|TBC/i.test(ceremony.displayDate)) && (
              <p className="uppercase-label text-ink" style={{ fontSize: "0.75rem", letterSpacing: "0.15em", margin: 0, fontWeight: 700 }}>
                {ceremony.displayDate}
              </p>
            )}
            {!(!ceremony.venue || /SAMPLE|TO BE CONFIRMED|TBC/i.test(ceremony.venue)) && (
              <p className="font-body text-ink-soft uppercase" style={{ fontSize: "0.65rem", letterSpacing: "0.1em", fontWeight: 600, margin: 0 }}>
                {ceremony.venue} — {ceremony.city}
              </p>
            )}
          </div>`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('src/components/OpeningScreen.tsx', code);
