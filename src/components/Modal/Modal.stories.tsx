import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConfirmModal, Modal } from './Modal';
import { Button } from '../Button/Button';
import { TextInput } from '../TextInput/TextInput';
import { RadioGroup } from '../Radio/Radio';

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  args: { open: false, onClose: fn(), title: '멤버 초대', description: '초대 메일을 받은 사람만 프로젝트에 들어올 수 있어요.' },
  parameters: { docs: { story: { inline: false, height: '480px' } } },
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const 폼: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    const close = () => setOpen(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>멤버 초대</Button>
        <Modal
          {...args}
          open={open}
          onClose={close}
          closeOnOverlay={false}
          footer={<><Button variant="secondary" onClick={close}>취소</Button><Button onClick={close}>초대 보내기</Button></>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextInput label="이메일" placeholder="name@example.com" type="email" fullWidth />
            <RadioGroup label="권한" direction="horizontal" defaultValue="edit" options={[{ value: 'view', label: '보기' }, { value: 'edit', label: '편집' }, { value: 'admin', label: '관리' }]} />
          </div>
        </Modal>
      </>
    );
  },
};

export const 삭제_확인: Story = {
  render: function Render() {
    const [open, setOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const del = () => { setLoading(true); setTimeout(() => { setLoading(false); setOpen(false); }, 1200); };
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>프로젝트 삭제</Button>
        <ConfirmModal
          open={open}
          tone="danger"
          loading={loading}
          title="프로젝트를 삭제할까요?"
          description="삭제한 프로젝트와 안의 파일 12개는 되돌릴 수 없어요."
          confirmLabel="삭제하기"
          onConfirm={del}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};
