#!/usr/bin/env node
// 브랜드 색 CSS 만들기:  npx choi-ds-brand "#0E9888" > src/brand.css
import { brandThemeCss, createBrandTheme } from '../dist/brand.js';

const color = process.argv[2];
if (!color || color === '-h' || color === '--help') {
  console.error('사용법: choi-ds-brand "#0E9888" > brand.css\n메인 색 하나로 라이트·다크 브랜드 토큰 CSS를 만들어요. 대비가 모자라면 자동으로 보정해요.');
  process.exit(color ? 0 : 1);
}
try {
  const theme = createBrandTheme(color);
  process.stdout.write(brandThemeCss(theme));
  for (const note of theme.notes) console.error(`참고: ${note}`);
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
}
