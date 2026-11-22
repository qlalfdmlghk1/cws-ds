import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AppTabs } from './AppTabs';
import { AppButton } from '../AppButton/AppButton';

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

export const 오른쪽_버튼: Story = {
  args: { actions: <AppButton size="sm">+ 작성</AppButton> },
};

export const 선택_없음: Story = {
  render: function Render(args) {
    const [tab, setTab] = useState<string>('compose');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AppTabs {...args} value={tab} onChange={setTab} actions={<AppButton size="sm" variant={tab === 'compose' ? 'primary' : 'secondary'} onClick={() => setTab('compose')}>+ 작성</AppButton>} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-muted)' }}>
          {tab === 'compose' ? '작성 화면이에요. 선택된 탭이 없어도 Tab 키로 탭 줄에 들어갈 수 있어요.' : `${tab} 탭`}
        </p>
      </div>
    );
  },
};
