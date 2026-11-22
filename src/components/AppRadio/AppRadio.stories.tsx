import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppRadioGroup } from './AppRadio';

const meta = {
  title: 'Form Controls/AppRadio',
  component: AppRadioGroup,
  args: {
    label: '공개 범위',
    defaultValue: 'team',
    options: [
      { value: 'public', label: '전체 공개' },
      { value: 'team', label: '팀만', description: '같은 팀 멤버만 볼 수 있어요.' },
      { value: 'private', label: '나만 보기' },
      { value: 'link', label: '링크로 공유', disabled: true },
    ],
  },
} satisfies Meta<typeof AppRadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = {
  args: { label: '정렬', direction: 'horizontal', defaultValue: 'new', options: [{ value: 'new', label: '최신순' }, { value: 'pop', label: '인기순' }, { value: 'name', label: '이름순' }] },
};
export const Error: Story = {
  args: { label: '결제 수단', required: true, direction: 'horizontal', defaultValue: undefined, error: '결제 수단을 골라 주세요.', options: [{ value: 'card', label: '카드' }, { value: 'bank', label: '계좌이체' }] },
};
