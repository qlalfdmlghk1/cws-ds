import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppTextInput } from './AppTextInput';
import { icons } from '../../stories/demo';

const meta = {
  title: 'Form Controls/AppTextInput',
  component: AppTextInput,
  args: { label: '이름', placeholder: '예: 홍길동' },
  argTypes: { iconLeft: { control: false } },
} satisfies Meta<typeof AppTextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { helperText: '실명을 입력해 주세요.' } };
export const Error: Story = { args: { label: '이메일', required: true, defaultValue: 'choi@incross', error: '이메일 형식이 아니에요. 도메인까지 입력해 주세요.' } };
export const WithIcon: Story = { args: { label: '검색', placeholder: '프로젝트 이름', iconLeft: icons.search } };
export const Suffix: Story = { args: { label: '예산', defaultValue: '1,500,000', suffix: '원', inputMode: 'numeric' } };
export const Count: Story = { args: { label: '한 줄 소개', defaultValue: '작게 시작하는 디자인 시스템', maxLength: 30, showCount: true } };
export const ReadOnly: Story = { args: { label: '아이디', defaultValue: 'choi', readOnly: true, helperText: '아이디는 바꿀 수 없어요.' } };
export const Disabled: Story = { args: { label: '비활성', placeholder: '입력할 수 없어요', disabled: true } };

export const 크기: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AppTextInput label="Small" placeholder="sm 32px" size="sm" />
      <AppTextInput label="Medium" placeholder="md 40px" />
      <AppTextInput label="Large" placeholder="lg 48px" size="lg" />
    </div>
  ),
};
