import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppTable, type TableColumn } from './AppTable';

interface Project { id: number; name: string; status: '운영 중' | '점검' | '준비'; visits: number; rate: number; updated: string }
const rows: Project[] = [
  { id: 1, name: 'StockFolio', status: '운영 중', visits: 12480, rate: 3.2, updated: '2026-11-18' },
  { id: 2, name: '개인 블로그', status: '준비', visits: 0, rate: 0, updated: '2026-11-02' },
  { id: 3, name: 'Template-Tester', status: '점검', visits: 2104, rate: 1.1, updated: '2026-09-30' },
];
const dot = { '운영 중': 'var(--success)', 점검: 'var(--danger)', 준비: 'var(--ink-muted)' };
const columns: TableColumn<Project>[] = [
  { key: 'name', header: '프로젝트', sortable: true, render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span> },
  { key: 'status', header: '상태', render: (r) => <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 9999, background: dot[r.status] }} />{r.status}</span> },
  { key: 'visits', header: '방문자', align: 'right', numeric: true, sortable: true, render: (r) => r.visits.toLocaleString('ko-KR') },
  { key: 'rate', header: '전환율', align: 'right', numeric: true, sortable: true, render: (r) => `${r.rate.toFixed(1)}%` },
  { key: 'updated', header: '수정일', sortable: true },
];

const meta = {
  title: 'Data Display/AppTable',
  component: AppTable<Project>,
  args: { caption: '프로젝트 목록', columns, rows, defaultSort: { key: 'visits', direction: 'desc' } },
  argTypes: { columns: { control: false }, rows: { control: false } },
} satisfies Meta<typeof AppTable<Project>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selectable: Story = {
  render: function Render(args) {
    const [sel, setSel] = useState<Array<string | number>>([1]);
    return <AppTable {...args} selectable selectedKeys={sel} onSelectionChange={setSel} />;
  },
};
export const Compact: Story = { args: { density: 'compact' } };
export const Loading: Story = { args: { loading: true, loadingRows: 3, rows: [] } };
export const Empty: Story = { args: { rows: [], empty: '아직 프로젝트가 없어요. 새 프로젝트를 만들어 보세요.' } };
