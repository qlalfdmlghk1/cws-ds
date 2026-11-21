import { describe, expect, it } from 'vitest';
import { brandThemeCss, contrast, createBrandTheme, SURFACES } from './brand';
import tokens from '../tokens/tokens.json';

// 흔한 브랜드 색 + 일부러 까다로운 색(아주 밝은·어두운·무채색).
const COLORS = [
  '#7c3aed', '#0e9888', '#2b45e0', '#eab308', '#ea580c', '#16a34a', '#ec4899', '#06b6d4',
  '#dc2626', '#facc15', '#a3e635', '#22d3ee', '#1e3a8a', '#f472b6', '#000000', '#ffffff',
  '#808080', '#3e8e4b', '#ff0000', '#00ff00', '#0000ff', '#fff59d', '#4a148c', '#5c74ff',
];

describe('createBrandTheme', () => {
  it.each(COLORS)('%s: 라이트 테마 대비', (color) => {
    const t = createBrandTheme(color).light;
    const { surface, raised } = SURFACES.light;
    expect(contrast(t['on-brand'], t.brand)).toBeGreaterThanOrEqual(4.5); // 버튼 글자
    expect(contrast(t['on-brand'], t['brand-hover'])).toBeGreaterThanOrEqual(4.5); // hover 버튼 글자
    for (const bg of [surface, raised, t['brand-soft']]) expect(contrast(t['brand-ink'], bg)).toBeGreaterThanOrEqual(4.5); // 강조 글자
    expect(contrast(t.brand, surface)).toBeGreaterThanOrEqual(3); // 체크박스·슬라이더 채움
    expect(contrast(t.focus, surface)).toBeGreaterThanOrEqual(3); // 포커스 링
  });

  it.each(COLORS)('%s: 다크 테마 대비', (color) => {
    const t = createBrandTheme(color).dark;
    const { surface, raised } = SURFACES.dark;
    expect(contrast(t['on-brand'], t.brand)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t['on-brand'], t['brand-hover'])).toBeGreaterThanOrEqual(4.5);
    for (const bg of [surface, raised, t['brand-soft']]) expect(contrast(t['brand-ink'], bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.brand, surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(t.focus, surface)).toBeGreaterThanOrEqual(3);
  });

  it('보정할 필요가 없는 색은 그대로 쓴다', () => {
    const t = createBrandTheme('#7C3AED');
    expect(t.light.brand).toBe('#7c3aed');
    expect(t.light['on-brand']).toBe('#ffffff');
    expect(t.notes).toEqual([]);
  });

  it('밝은 색은 색을 지키고 버튼 글자를 진하게 바꾼다', () => {
    const t = createBrandTheme('#facc15');
    expect(t.light['on-brand']).not.toBe('#ffffff');
    expect(t.notes.some((n) => n.includes('버튼 글자'))).toBe(true);
  });

  it('조금만 진하게 하면 되는 색은 흰 글자를 유지한다', () => {
    expect(createBrandTheme('#0e9888').light['on-brand']).toBe('#ffffff');
  });

  it('잘못된 색은 알아듣기 쉬운 오류를 낸다', () => {
    expect(() => createBrandTheme('violet')).toThrow(/#RGB/);
    expect(() => createBrandTheme('#12345')).toThrow();
  });

  it('#RGB 짧은 형식도 받는다', () => {
    expect(createBrandTheme('#f00').light).toEqual(createBrandTheme('#ff0000').light);
  });
});

describe('brandThemeCss', () => {
  it('두 테마 블록과 6개 변수를 만든다', () => {
    const css = brandThemeCss('#0e9888');
    expect(css).toContain(":root:root,\n[data-theme='light'][data-theme='light'] {");
    expect(css).toContain("[data-theme='dark'][data-theme='dark'] {");
    for (const k of ['brand', 'brand-hover', 'brand-soft', 'brand-ink', 'on-brand', 'focus']) {
      expect(css.match(new RegExp(`--${k}: #[0-9a-f]{6};`, 'g'))).toHaveLength(2);
    }
  });
});

describe('SURFACES', () => {
  it('tokens.json의 바탕색과 같다', () => {
    const value = (name: string) => tokens.color.tokens.find((t) => t.name === name)?.value;
    expect(value('surface')).toEqual({ light: SURFACES.light.surface, dark: SURFACES.dark.surface });
    expect(value('surface-raised')).toEqual({ light: SURFACES.light.raised, dark: SURFACES.dark.raised });
  });
});
