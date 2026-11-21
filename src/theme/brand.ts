/**
 * 브랜드 색 하나로 라이트·다크 테마의 브랜드 토큰을 만든다.
 * React가 필요 없어서 서버(Next.js 서버 컴포넌트, 빌드 스크립트)에서도 쓸 수 있다: `@choi/ds/brand`.
 *
 * 색은 OKLCH(사람 눈에 고른 밝기 단위)로 다루고, 대비는 WCAG 2.x 공식으로 확인한다.
 * - 글자: 4.5:1 이상 (on-brand / brand, brand-ink / 바탕, brand-ink / brand-soft)
 * - 테두리·채움·포커스 링: 3:1 이상 (brand / 바탕, focus / 바탕)
 * 모자라면 같은 색상(hue)을 유지한 채 밝기만 조금씩 옮겨 맞추고, 무엇을 바꿨는지 notes에 적는다.
 */

export interface BrandTokens {
  brand: string;
  'brand-hover': string;
  'brand-soft': string;
  'brand-ink': string;
  'on-brand': string;
  focus: string;
}

export interface BrandTheme {
  light: BrandTokens;
  dark: BrandTokens;
  /** 대비를 맞추려고 고친 내용. 고친 게 없으면 빈 배열. */
  notes: string[];
}

// tokens.json의 바탕색. 바뀌면 brand.test.ts가 알려 준다.
export const SURFACES = {
  light: { surface: '#ffffff', raised: '#f5f5f7' },
  dark: { surface: '#131217', raised: '#1c1b21' },
} as const;

type Rgb = [number, number, number]; // 0~1
interface Lch { l: number; c: number; h: number }

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const fromLinear = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

function parseHex(input: string): Rgb {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!m) throw new Error(`브랜드 색은 #RGB 또는 #RRGGBB 형식이어야 해요: "${input}"`);
  const hex = m[1].length === 3 ? m[1].replace(/./g, (ch) => ch + ch) : m[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as Rgb;
}

function toHex(rgb: Rgb): string {
  return '#' + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0')).join('');
}

function rgbToLch([r8, g8, b8]: Rgb): Lch {
  const [r, g, b] = [r8, g8, b8].map(toLinear);
  const l_ = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m_ = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s_ = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  return { l: L, c: Math.hypot(a, bb), h: Math.atan2(bb, a) };
}

function lchToRgbRaw({ l, c, h }: Lch): Rgb {
  const a = c * Math.cos(h), b = c * Math.sin(h);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const [L, M, S] = [l_ ** 3, m_ ** 3, s_ ** 3];
  return [
    4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
    -1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
    -0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S,
  ].map(fromLinear) as Rgb;
}

const inGamut = (rgb: Rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** 화면에 낼 수 없는 색이면 채도만 줄여서 낼 수 있는 가장 가까운 색으로. */
function lchToHex(lch: Lch): string {
  const p = { ...lch, l: Math.min(1, Math.max(0, lch.l)) };
  if (inGamut(lchToRgbRaw(p))) return toHex(lchToRgbRaw(p));
  let lo = 0, hi = p.c;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(lchToRgbRaw({ ...p, c: mid }))) lo = mid; else hi = mid;
  }
  return toHex(lchToRgbRaw({ ...p, c: lo }));
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 대비. 1 ~ 21. */
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** 같은 색상·채도로 밝기만 step씩 옮기며 ok가 될 때까지. 끝까지 못 맞추면 마지막 값. */
function shiftUntil(start: Lch, step: number, ok: (hex: string) => boolean): { hex: string; lch: Lch } {
  let cur = { ...start };
  for (let i = 0; i < 100; i++) {
    const hex = lchToHex(cur);
    if (ok(hex)) return { hex, lch: cur };
    const l = cur.l + step;
    if (l < 0 || l > 1) break;
    cur = { ...cur, l };
  }
  return { hex: lchToHex(cur), lch: cur };
}

const passes = (fg: string, bgs: string[], min: number) => bgs.every((bg) => contrast(fg, bg) >= min);

function lightTokens(base: Lch, input: string, notes: string[]): BrandTokens {
  const { surface, raised } = SURFACES.light;
  // 1) 메인 색: 흰 바탕에서 채움·테두리로 보이도록 3:1.
  let main = shiftUntil(base, -0.01, (hex) => contrast(hex, surface) >= 3);
  // 2) 위 글자: 흰색을 우선한다. 조금만(밝기 0.11 이하) 진하게 해서 흰 글자가 4.5:1이 되면 그렇게 하고,
  //    (얼마나 진해졌는지는 처음 넣은 색 기준으로 잰다.) 많이 진하게 해야 하는 밝은 색(노랑, 하늘색 등)은 색을 지키고 글자를 같은 계열의 아주 진한 색으로.
  const darkText = lchToHex({ l: 0.22, c: Math.min(base.c, 0.06), h: base.h });
  let onBrand = '#ffffff';
  if (contrast('#ffffff', main.hex) < 4.5) {
    const darker = shiftUntil(main.lch, -0.01, (hex) => contrast('#ffffff', hex) >= 4.5);
    if (base.l - darker.lch.l <= 0.11 || contrast(darkText, main.hex) < 4.5) main = darker;
    else onBrand = darkText;
  }
  if (main.hex !== input.toLowerCase()) notes.push(`라이트: 대비를 맞추려고 메인 색을 진하게 했어요 (${input} → ${main.hex}).`);
  if (onBrand !== '#ffffff') notes.push(`라이트: 메인 색이 밝아서 버튼 글자를 흰색 대신 진한 색(${onBrand})으로 했어요.`);
  // 3) hover: 흰 글자면 더 진하게, 진한 글자면 더 밝게 (글자 대비가 줄지 않는 쪽으로).
  //    이미 아주 진한 색(검정에 가까움)은 더 진해질 수 없으니 밝게.
  const hoverDir = onBrand !== '#ffffff' || main.lch.l < 0.2 ? 1 : -1;
  const hoverStep = main.lch.l < 0.2 ? 0.26 : 0.06;
  const hover = shiftUntil({ ...main.lch, l: main.lch.l + hoverStep * hoverDir }, -0.01 * hoverDir, (hex) => contrast(onBrand, hex) >= 4.5).hex;
  // 4) 옅은 바탕과 그 위·흰 바탕 위 글자.
  const soft = lchToHex({ l: 0.965, c: Math.min(base.c * 0.2, 0.03), h: base.h });
  const ink = shiftUntil({ ...main.lch, l: Math.min(main.lch.l, 0.5) }, -0.01, (hex) => passes(hex, [surface, raised, soft], 4.5)).hex;
  return { brand: main.hex, 'brand-hover': hover, 'brand-soft': soft, 'brand-ink': ink, 'on-brand': onBrand, focus: main.hex };
}

function darkTokens(base: Lch, notes: string[]): BrandTokens {
  const { surface, raised } = SURFACES.dark;
  // 어두운 바탕에서는 밝고 채도를 조금 낮춘 같은 계열이 편하다.
  const start = { l: Math.max(base.l, 0.72), c: Math.min(base.c, 0.16), h: base.h };
  const main = shiftUntil(start, 0.01, (hex) => passes(hex, [surface, raised], 3));
  let onBrand = lchToHex({ l: 0.2, c: Math.min(base.c, 0.08), h: base.h });
  if (contrast(onBrand, main.hex) < 4.5) {
    onBrand = shiftUntil({ l: 0.2, c: Math.min(base.c, 0.08), h: base.h }, -0.01, (hex) => contrast(hex, main.hex) >= 4.5).hex;
    if (contrast(onBrand, main.hex) < 4.5) notes.push(`다크: 버튼 글자 대비가 4.5:1에 못 미쳐요 (${contrast(onBrand, main.hex).toFixed(2)}:1).`);
  }
  const hover = shiftUntil({ ...main.lch, l: main.lch.l + 0.07 }, -0.01, (hex) => contrast(onBrand, hex) >= 4.5).hex;
  const soft = lchToHex({ l: 0.27, c: Math.min(base.c * 0.35, 0.07), h: base.h });
  const ink = shiftUntil({ l: Math.max(main.lch.l, 0.82), c: Math.min(base.c, 0.12), h: base.h }, 0.01, (hex) => passes(hex, [surface, raised, soft], 4.5)).hex;
  return { brand: main.hex, 'brand-hover': hover, 'brand-soft': soft, 'brand-ink': ink, 'on-brand': onBrand, focus: ink };
}

/** 브랜드 색 하나("#0E9888")로 라이트·다크 브랜드 토큰을 만든다. */
export function createBrandTheme(color: string): BrandTheme {
  const input = toHex(parseHex(color));
  const base = rgbToLch(parseHex(input));
  const notes: string[] = [];
  return { light: lightTokens(base, input, notes), dark: darkTokens(base, notes), notes };
}

const block = (sel: string, t: BrandTokens) =>
  `${sel} {\n${(Object.keys(t) as Array<keyof BrandTokens>).map((k) => `  --${k}: ${t[k]};`).join('\n')}\n}`;

/**
 * 브랜드 토큰을 CSS 문자열로. 선택자를 두 번 겹쳐 써서(특정성 높이기) 라이브러리 기본값보다 항상 이긴다.
 * 그래서 styles.css보다 먼저 불러와도, 나중에 불러와도 같은 결과다.
 */
export function brandThemeCss(color: string | BrandTheme): string {
  const t = typeof color === 'string' ? createBrandTheme(color) : color;
  return [
    `/* CHOI Design System — brand theme. Generated by createBrandTheme(). */`,
    block(":root:root,\n[data-theme='light'][data-theme='light']", t.light),
    block("[data-theme='dark'][data-theme='dark']", t.dark),
  ].join('\n') + '\n';
}

const STYLE_ID = 'cds-brand-theme';

/**
 * 브라우저에서 바로 적용한다 (<head>에 <style> 하나). 다시 부르면 바꾸고, 돌려준 함수를 부르면 원래 색으로.
 * 서버 렌더링에서 첫 화면부터 색을 맞추려면 BrandStyle 컴포넌트나 brandThemeCss()로 만든 CSS 파일을 쓴다.
 */
export function applyBrandTheme(color: string | BrandTheme): () => void {
  if (typeof document === 'undefined') return () => {};
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = brandThemeCss(color);
  return () => document.getElementById(STYLE_ID)?.remove();
}
