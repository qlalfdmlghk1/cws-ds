import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  // 라이브러리 빌드 전용 플러그인(타입 파일 생성, dist 복사)은 Storybook에선 뺀다.
  viteFinal: (cfg) => {
    const skip = new Set(['vite:dts', 'copy-token-files']);
    cfg.plugins = (cfg.plugins ?? []).flat().filter((p) => !(p && typeof p === 'object' && 'name' in p && skip.has(p.name)));
    return cfg;
  },
};
export default config;
