import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { Row } from '../../stories/demo';

const meta = { title: 'Feedback/Spinner', component: Spinner } satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const 크기: Story = { render: () => <Row><Spinner size="sm" /><Spinner /><Spinner size="lg" /></Row> };
export const 글자색_따라가기: Story = {
  render: () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: 14 }}>
      <Spinner size="sm" tone="current" label="목록 불러오는 중" />목록을 불러오는 중
    </span>
  ),
};
