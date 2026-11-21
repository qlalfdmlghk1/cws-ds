import { useMemo } from 'react';
import { brandThemeCss } from './brand';

export interface BrandStyleProps {
  /** 서비스 메인 색. "#0E9888". 라이트·다크 값과 대비 보정은 자동. */
  color: string;
}

/**
 * 브랜드 색을 <style>로 넣는다. 서버 렌더링에서도 첫 화면부터 색이 맞는다.
 * 앱의 가장 바깥(Next.js app/layout.tsx의 <head> 또는 <body> 맨 앞)에 한 번 둔다.
 */
export function BrandStyle({ color }: BrandStyleProps) {
  const css = useMemo(() => brandThemeCss(color), [color]);
  return <style id="cds-brand-theme" dangerouslySetInnerHTML={{ __html: css }} />;
}
