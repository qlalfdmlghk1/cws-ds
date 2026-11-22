import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppToast, AppToastProvider, useToast } from './AppToast';
import { AppButton } from '../AppButton/AppButton';
import { Row } from '../../stories/demo';

const meta = {
  title: 'Feedback/AppToast',
  component: AppToast,
  args: { title: '링크를 복사했어요', onClose: fn() },
  decorators: [(Story) => <AppToastProvider position="bottom-right"><div style={{ maxWidth: 400 }}><Story /></div></AppToastProvider>],
} satisfies Meta<typeof AppToast>;
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
      <AppButton variant="secondary" size="sm" onClick={() => toast('저장했어요')}>neutral</AppButton>
      <AppButton variant="secondary" size="sm" onClick={() => toast({ tone: 'success', title: '배포를 마쳤어요' })}>success</AppButton>
      <AppButton variant="secondary" size="sm" onClick={() => toast({ tone: 'danger', title: '저장하지 못했어요', action: { label: '다시 시도', onClick: () => {} } })}>danger</AppButton>
      <AppButton variant="secondary" size="sm" onClick={() => toast({ title: '항목을 삭제했어요', action: { label: '실행 취소', onClick: () => toast('되돌렸어요') } })}>action</AppButton>
    </Row>
  );
}
export const 띄우기: Story = { render: () => <Triggers /> };
