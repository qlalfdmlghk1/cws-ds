import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppCheckbox } from './AppCheckbox';
import { Stack } from '../../stories/demo';

const meta = {
  title: 'Form Controls/AppCheckbox',
  component: AppCheckbox,
  args: { label: '이용약관에 동의해요' },
} satisfies Meta<typeof AppCheckbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: '필수 항목이에요.', defaultChecked: true } };
export const Indeterminate: Story = { args: { label: '전체 선택', checked: true, indeterminate: true, readOnly: true } };
export const Disabled: Story = { args: { label: '비활성 (켜짐)', disabled: true, defaultChecked: true } };

const NAMES = ['프론트엔드', '백엔드', '디자인'];
export const 전체_선택: Story = {
  render: function Render() {
    const [v, setV] = useState([true, false, true]);
    const all = v.every(Boolean), some = v.some(Boolean);
    return (
      <Stack gap={12}>
        <AppCheckbox label="전체 선택" checked={all} indeterminate={some && !all} onChange={() => setV(v.map(() => !all))} />
        <Stack gap={12} style={{ paddingLeft: 26 }}>
          {NAMES.map((n, i) => (
            <AppCheckbox key={n} label={n} checked={v[i]} onChange={() => setV(v.map((x, k) => (k === i ? !x : x)))} />
          ))}
        </Stack>
      </Stack>
    );
  },
};
