import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import { applyBrandTheme } from '../src/theme/brand';
import '../src/fonts.css';
import '../src/styles/index.css';

// 툴바의 테마 전환 → <html data-theme>. 컴포넌트는 토큰만 쓰므로 이것만으로 바뀐다.
const withTheme: Decorator = (Story, ctx) => {
  const theme = ctx.globals.theme === 'dark' ? 'dark' : 'light';
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return <Story />;
};

// 툴바의 브랜드 색 → createBrandTheme()으로 만든 값을 <style>로 적용. 'default'면 tokens.json의 바이올렛.
const BRANDS: Record<string, string> = { teal: '#0E9888', blue: '#2B45E0', orange: '#EA580C', pink: '#EC4899', yellow: '#EAB308', green: '#16A34A', black: '#18171C' };
const withBrand: Decorator = (Story, ctx) => {
  const color = BRANDS[ctx.globals.brand as string];
  useEffect(() => (color ? applyBrandTheme(color) : undefined), [color]);
  return <Story />;
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '테마',
      toolbar: {
        title: '테마',
        icon: 'mirror',
        items: [
          { value: 'light', title: '라이트' },
          { value: 'dark', title: '다크' },
        ],
        dynamicTitle: true,
      },
    },
    brand: {
      description: '브랜드 색 (createBrandTheme)',
      toolbar: {
        title: '브랜드 색',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: '바이올렛 (기본)' },
          { value: 'teal', title: '틸 #0E9888' },
          { value: 'blue', title: '블루 #2B45E0' },
          { value: 'orange', title: '오렌지 #EA580C' },
          { value: 'pink', title: '핑크 #EC4899' },
          { value: 'yellow', title: '옐로 #EAB308' },
          { value: 'green', title: '그린 #16A34A' },
          { value: 'black', title: '블랙 #18171C' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', brand: 'default' },
  decorators: [withTheme, withBrand],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['소개', '브랜드 색 바꾸기', 'Actions', 'Form Controls', 'Data Display', 'Navigation', 'Feedback'] },
    },
  },
  tags: ['autodocs'],
};
export default preview;
