import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppChip } from './AppChip';
import { AppButton } from '../AppButton/AppButton';
import { Row, Stack } from '../../stories/demo';

const meta = {
  title: 'Actions/AppChip',
  component: AppChip,
  args: { children: 'Vue', onClick: fn() },
} satisfies Meta<typeof AppChip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Filter: Story = { args: { selected: true, count: 12 } };
export const Removable: Story = { args: { children: '포트폴리오', onClick: undefined, onRemove: fn() } };
export const Disabled: Story = { args: { children: '비활성', disabled: true } };

const OPTS = [['vue', 'Vue', 12], ['react', 'React', 8], ['ts', 'TypeScript', 15], ['echarts', 'ECharts', 4]] as const;

export const 필터와_태그: Story = {
  render: function Render() {
    const [on, setOn] = useState<Record<string, boolean>>({ vue: true, ts: true });
    const [tags, setTags] = useState(['포트폴리오', '대시보드', '디자인 시스템']);
    const any = Object.values(on).some(Boolean);
    return (
      <Stack>
        <Row label="filter">
          {OPTS.map(([k, label, count]) => (
            <AppChip key={k} selected={!!on[k]} count={count} onClick={() => setOn({ ...on, [k]: !on[k] })}>{label}</AppChip>
          ))}
          {any && <AppButton variant="ghost" size="sm" onClick={() => setOn({})}>초기화</AppButton>}
        </Row>
        <Row label="remove">
          {tags.map((t) => <AppChip key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>{t}</AppChip>)}
        </Row>
      </Stack>
    );
  },
};
