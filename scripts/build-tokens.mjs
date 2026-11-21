// tokens.json → src/styles/tokens.css (CSS custom properties).
// tokens.json is the single source of truth, shared with the Claude design-system artifact.
import { readFileSync, writeFileSync } from 'node:fs';

const t = JSON.parse(readFileSync(new URL('../src/tokens/tokens.json', import.meta.url), 'utf8'));
const themes = t.color.themes.map((x) => x.id);
const [first, ...rest] = themes;
const val = (tok, th) => (typeof tok.value === 'string' ? tok.value : tok.value[th] ?? tok.value[first]);
const v = (s) => String(s).replace(/^\{(.+)\}$/, 'var(--$1)');
const themed = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];

let css = `/* CHOI Design System — generated from tokens.json. Do not edit by hand: run \`npm run tokens\`. */\n\n`;
// Fonts live in their own stylesheet (src/fonts.css → dist/fonts.css) so the library build
// never inlines the woff2 files into styles.css.
const fontsCss = `/* Pretendard (SIL OFL 1.1) — import '@choi/ds/fonts.css' once, or load Pretendard yourself. */\n` +
  t.type.fonts
    .map((f) => `@font-face {\n  font-family: '${f.family}';\n  src: url('./fonts/${f.file.split('/').pop()}') format('woff2');\n  font-weight: ${f.weight};\n  font-style: normal;\n  font-display: swap;\n}`)
    .join('\n') + '\n';
writeFileSync(new URL('../src/fonts.css', import.meta.url), fontsCss);
css += `:root,\n[data-theme='${first}'] {\n${themed.map((x) => `  --${x.name}: ${v(val(x, first))};`).join('\n')}\n}\n\n`;
for (const th of rest) {
  css += `[data-theme='${th}'] {\n${themed.map((x) => `  --${x.name}: ${v(val(x, th))};`).join('\n')}\n}\n\n`;
}
const fixed = [...t.spacing.tokens, ...t.radius.tokens];
css += `:root {\n${fixed.map((x) => `  --${x.name}: ${x.value};`).join('\n')}\n${Object.entries(t.type.families)
  .map(([k, s]) => `  --font-${k}: ${s};`)
  .join('\n')}\n}\n\n`;
for (const g of t.type.groups) {
  for (const s of g.styles) {
    css += `.cds-text-${s.name} {\n  font-family: var(--font-${s.family ?? g.family});\n  font-size: ${s.fontSize};\n  line-height: ${s.lineHeight};\n  font-weight: ${s.fontWeight};${s.letterSpacing ? `\n  letter-spacing: ${s.letterSpacing};` : ''}\n}\n`;
  }
}
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log(`tokens.css: ${themed.length} themed tokens × ${themes.length} themes, ${fixed.length} fixed tokens`);
