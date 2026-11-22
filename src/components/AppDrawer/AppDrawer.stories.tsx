import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AppDrawer } from './AppDrawer';
import { AppButton } from '../AppButton/AppButton';
import { AppSelect } from '../AppSelect/AppSelect';
import { AppCheckGroup } from '../AppCheckGroup/AppCheckGroup';
import { AppSlider } from '../AppSlider/AppSlider';

const meta = {
  title: 'Feedback/AppDrawer',
  component: AppDrawer,
  args: { open: false, onClose: fn(), title: '필터', description: '조건에 맞는 프로젝트만 보여줘요.', size: 'sm' },
  parameters: { docs: { story: { inline: false, height: '520px' } } },
} satisfies Meta<typeof AppDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo(args: Story['args']) {
  const [open, setOpen] = useState(true);
  const close = () => setOpen(false);
  return (
    <>
      <AppButton variant="secondary" onClick={() => setOpen(true)}>필터 열기</AppButton>
      <AppDrawer
        {...args}
        open={open}
        onClose={close}
        footer={<><AppButton variant="secondary" onClick={close}>초기화</AppButton><AppButton onClick={close}>적용</AppButton></>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AppSelect label="상태" fullWidth defaultValue="live" options={[{ value: 'live', label: '운영 중' }, { value: 'draft', label: '초안' }, { value: 'archived', label: '보관됨' }]} />
          <AppCheckGroup label="스택" defaultValue={['react']} options={[{ value: 'react', label: 'React' }, { value: 'vue', label: 'Vue' }, { value: 'next', label: 'Next.js' }]} />
          <AppSlider label="최소 진행률" defaultValue={40} formatValue={(n) => `${n}%`} fullWidth />
        </div>
      </AppDrawer>
    </>
  );
}

export const Right: Story = { render: (args) => <Demo {...args} /> };
export const Left: Story = { args: { side: 'left' }, render: (args) => <Demo {...args} /> };
