import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppCheckGroup } from './AppCheckGroup';

const meta = {
  title: 'Form Controls/AppCheckGroup',
  component: AppCheckGroup,
  args: {
    label: '관심 분야',
    allLabel: '전체 선택',
    defaultValue: ['fe'],
    options: [
      { value: 'fe', label: '프론트엔드' },
      { value: 'be', label: '백엔드' },
      { value: 'design', label: '디자인', description: 'UX · UI' },
      { value: 'pm', label: '기획', disabled: true },
    ],
  },
} satisfies Meta<typeof AppCheckGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const 개수_제한: Story = {
  render: function Render() {
    const [v, setV] = useState(['vue', 'ts', 'react', 'echarts']);
    return (
      <AppCheckGroup
        label="주력 기술 (최대 3개)"
        direction="horizontal"
        value={v}
        onChange={setV}
        error={v.length > 3 ? '최대 3개까지 고를 수 있어요.' : undefined}
        options={[{ value: 'vue', label: 'Vue' }, { value: 'react', label: 'React' }, { value: 'ts', label: 'TypeScript' }, { value: 'echarts', label: 'ECharts' }]}
      />
    );
  },
};
