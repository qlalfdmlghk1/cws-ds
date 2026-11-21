import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Toast, ToastProvider, useToast } from './Toast';
import { Button } from '../Button/Button';
import { Row } from '../../stories/demo';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  args: { title: '링크를 복사했어요', onClose: fn() },
  decorators: [(Story) => <ToastProvider position="bottom-right"><div style={{ maxWidth: 400 }}><Story /></div></ToastProvider>],
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Success: Story = { args: { tone: 'success', title: '배포를 마쳤어요', description: 'v0.2가 공개됐어요.' } };
export const WithAction: Story = { args: { tone: 'info', title: '새 버전이 있어요', action: { label: '보기', onClick: fn() } } };
export const Danger: Story = { args: { tone: 'danger', title: '저장하지 못했어요', description: '네트워크 연결을 확인해 주세요.', action: { label: '다시 시도', onClick: fn() } } };

function Triggers() {
  const { toast } = useToast();
  return (
    <Row>
      <Button variant="secondary" size="sm" onClick={() => toast('저장했어요')}>neutral</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'success', title: '배포를 마쳤어요' })}>success</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ tone: 'danger', title: '저장하지 못했어요', action: { label: '다시 시도', onClick: () => {} } })}>danger</Button>
      <Button variant="secondary" size="sm" onClick={() => toast({ title: '항목을 삭제했어요', action: { label: '실행 취소', onClick: () => toast('되돌렸어요') } })}>action</Button>
    </Row>
  );
}
export const 띄우기: Story = { render: () => <Triggers /> };
