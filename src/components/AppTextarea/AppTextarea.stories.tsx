import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppTextarea } from './AppTextarea';

const meta = {
  title: 'Form Controls/AppTextarea',
  component: AppTextarea,
  args: { label: '프로젝트 설명', fullWidth: true },
  decorators: [(Story) => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof AppTextarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Count: Story = { args: { maxLength: 120, showCount: true, defaultValue: '실시간 시세를 WebSocket으로 받아 보유 종목 수익률을 보여주는 대시보드예요.' } };
export const AutoResize: Story = { args: { label: '댓글 (자동 높이)', autoResize: true, rows: 1, maxRows: 5, placeholder: '입력하면 높이가 늘어나요', helperText: '최대 5줄까지 늘어나요.' } };
export const Error: Story = { args: { label: '피드백', required: true, rows: 2, error: '피드백을 입력해 주세요.' } };
export const Disabled: Story = { args: { label: '비활성', rows: 2, disabled: true, placeholder: '입력할 수 없어요' } };
