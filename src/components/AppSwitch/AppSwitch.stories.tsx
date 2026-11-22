import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppSwitch } from './AppSwitch';

const meta = {
  title: 'Form Controls/AppSwitch',
  component: AppSwitch,
  args: { label: '알림', description: '새 댓글과 멘션을 알려줘요.', defaultChecked: true },
} satisfies Meta<typeof AppSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Off: Story = { args: { label: '다크 모드', description: undefined, defaultChecked: false } };
export const Small: Story = { args: { label: '자동 저장', description: undefined, size: 'sm' } };
export const Disabled: Story = { args: { label: '비활성 (켜짐)', description: undefined, disabled: true } };
