import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppTabs } from './AppTabs';

const p = (t: string) => <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)' }}>{t}</p>;
const meta = {
  title: 'Navigation/AppTabs',
  component: AppTabs,
  args: {
    label: '프로젝트',
    items: [
      { value: 'overview', label: '개요', content: p('프로젝트 목표와 진행 상황을 한눈에 봐요.') },
      { value: 'issues', label: '이슈', count: 12, content: p('열린 이슈 12개가 있어요.') },
      { value: 'members', label: '멤버', count: 3, content: p('멤버 3명이 참여 중이에요.') },
      { value: 'settings', label: '설정', disabled: true },
    ],
  },
} satisfies Meta<typeof AppTabs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {};
export const Segment: Story = { args: { variant: 'segment', label: '기간', defaultValue: 'w', items: [{ value: 'd', label: '일간' }, { value: 'w', label: '주간' }, { value: 'm', label: '월간' }] } };
