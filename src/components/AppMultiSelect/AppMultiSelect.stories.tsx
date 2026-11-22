import type { Meta, StoryObj } from '@storybook/react-vite';
import { AppMultiSelect } from './AppMultiSelect';

const stacks = ['Vue', 'React', 'TypeScript', 'JavaScript', 'Next.js', 'Nuxt', 'Pinia', 'Zustand', 'TanStack Query', 'ECharts', 'Tailwind CSS', 'Storybook', 'Vite', 'Node.js']
  .map((s) => ({ value: s.toLowerCase(), label: s }));

const meta = {
  title: 'Form Controls/AppMultiSelect',
  component: AppMultiSelect,
  args: { label: '기술 스택', searchable: true, max: 5, options: stacks, defaultValue: ['vue', 'typescript', 'echarts'], fullWidth: true },
  decorators: [(Story) => <div style={{ width: 300, minHeight: 420 }}><Story /></div>],
} satisfies Meta<typeof AppMultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Open: Story = { args: { defaultOpen: true } };
export const Error: Story = {
  args: { label: '관심 직군', required: true, searchable: false, max: undefined, defaultValue: [], error: '하나 이상 골라 주세요.', options: [{ value: 'fe', label: '프론트엔드' }, { value: 'be', label: '백엔드' }] },
};
