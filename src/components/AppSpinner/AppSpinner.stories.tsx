import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppSpinner } from './AppSpinner';
import { Row } from '../../stories/demo';

const meta = { title: 'Feedback/AppSpinner', component: AppSpinner } satisfies Meta<typeof AppSpinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const 크기: Story = { render: () => <Row><AppSpinner size="sm" /><AppSpinner /><AppSpinner size="lg" /></Row> };
export const 글자색_따라가기: Story = {
  render: () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: 14 }}>
      <AppSpinner size="sm" tone="current" label="목록 불러오는 중" />목록을 불러오는 중
    </span>
  ),
};
