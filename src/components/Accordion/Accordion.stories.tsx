import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';

const meta = {
  title: 'Data Display/Accordion',
  component: Accordion,
  args: {
    defaultValue: ['refund'],
    items: [
      { id: 'refund', title: '환불은 언제까지 할 수 있나요?', content: '결제한 날부터 7일 안에, 쓰지 않은 상품만 환불할 수 있어요.' },
      { id: 'ship', title: '배송은 얼마나 걸리나요?', content: '평일 오후 2시 전 주문은 그날 보내고, 보통 1~2일 뒤에 도착해요.' },
      { id: 'change', title: '주문을 바꾸고 싶어요', content: '배송 준비 전이면 주문 내역에서 바로 바꿀 수 있어요.' },
      { id: 'biz', title: '사업자 구매 (준비 중)', content: '', disabled: true },
    ],
  },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {};
export const Multiple: Story = { args: { multiple: true, defaultValue: ['refund', 'ship'] } };
