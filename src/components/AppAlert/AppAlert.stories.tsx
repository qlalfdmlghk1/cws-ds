import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppAlert } from './AppAlert';
import { AppButton } from '../AppButton/AppButton';

const meta = {
  title: 'Feedback/AppAlert',
  component: AppAlert,
  args: { tone: 'info', title: '새 버전이 나왔어요', children: '다시 불러오면 바뀐 화면을 볼 수 있어요.' },
  argTypes: { action: { control: false }, icon: { control: false } },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof AppAlert>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { action: <AppButton size="sm" variant="secondary">업데이트</AppButton> } };
export const Success: Story = { args: { tone: 'success', title: '결제 수단을 등록했어요', children: undefined } };
export const Danger: Story = { args: { tone: 'danger', title: '저장하지 못했어요', children: '네트워크 연결을 확인하고 다시 시도해 주세요.', onClose: fn() } };
export const Neutral: Story = { args: { tone: 'neutral', title: '점검 예정', children: '11월 30일 새벽 2시부터 4시까지 일부 기능을 쓸 수 없어요.' } };
