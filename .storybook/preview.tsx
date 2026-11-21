import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
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
  },
  initialGlobals: { theme: 'light' },
  decorators: [withTheme],
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    controls: { expanded: true, sort: 'requiredFirst' },
    a11y: { test: 'error' },
    options: {
      storySort: { order: ['소개', 'Actions', 'Form Controls', 'Data Display', 'Navigation', 'Feedback'] },
    },
  },
  tags: ['autodocs'],
};
export default preview;
