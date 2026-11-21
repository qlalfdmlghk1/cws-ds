import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/fonts.css';
import '../src/styles/index.css';
import {
  Avatar, AvatarGroup, Badge, Button, Card, CardBody, CardFooter, CardHeader, CheckGroup, Checkbox, Chip, ConfirmModal, Datepicker,
  DropdownMenu, IconButton, Modal, MultiSelect, Pagination, Popover, RadioGroup, Select, Skeleton, StatCard, Switch, Table, Tabs,
  TextInput, Textarea, ToastProvider, Tooltip, datePresets, useToast,
} from '../src';

const More = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round"><path d="M5 12h.01M12 12h.01M19 12h.01" /></svg>
);

const rows = [
  { id: 1, name: 'StockFolio', status: '운영 중', visits: 12480 },
  { id: 2, name: '개인 블로그', status: '준비', visits: 0 },
  { id: 3, name: 'Baseball Together WE', status: '운영 중', visits: 8312 },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
      <h2 className="cds-text-subtitle" style={{ margin: 0 }}>{title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>{children}</div>
    </section>
  );
}

function App() {
  const { toast } = useToast();
  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [page, setPage] = useState(1);
  return (
    <main style={{ maxWidth: 1080, margin: '0 auto', padding: 32 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="cds-text-title" style={{ margin: 0 }}>CHOI Design System</h1>
        <Switch label="다크 모드" checked={dark} onChange={(e) => { setDark(e.target.checked); document.documentElement.dataset.theme = e.target.checked ? 'dark' : 'light'; }} />
      </header>

      <Section title="Actions">
        <Button onClick={() => toast({ tone: 'success', title: '저장했어요' })}>저장</Button>
        <Button variant="secondary" onClick={() => setModal(true)}>모달 열기</Button>
        <Button variant="danger" onClick={() => setConfirm(true)}>삭제하기</Button>
        <Button loading>저장 중</Button>
        <IconButton icon={<More />} label="더보기" variant="secondary" />
        <DropdownMenu items={[{ label: '편집', onSelect: () => toast('편집') }, { divider: true }, { label: '삭제', danger: true, onSelect: () => setConfirm(true) }]}>
          <Button variant="secondary">메뉴</Button>
        </DropdownMenu>
        <Popover title="도움말" content="Popover 안에는 무엇이든 넣을 수 있어요."><Button variant="ghost">Popover</Button></Popover>
        <Tooltip content="툴팁이에요"><Button variant="ghost">Tooltip</Button></Tooltip>
        <Chip selected onClick={() => {}}>Vue</Chip>
        <Chip onRemove={() => {}}>React</Chip>
      </Section>

      <Section title="Form">
        <TextInput label="이름" placeholder="예: 홍길동" helperText="실명을 입력해 주세요." />
        <TextInput label="이메일" error="이메일 형식이 아니에요." defaultValue="choi@" />
        <Select label="지역" options={['서울', '경기', '부산'].map((v) => ({ value: v, label: v }))} />
        <MultiSelect label="기술 스택" searchable options={['Vue', 'React', 'TypeScript', 'ECharts'].map((v) => ({ value: v, label: v }))} />
        <Datepicker label="마감일" />
        <Datepicker label="조회 기간" mode="range" presets={[datePresets.last7, datePresets.thisMonth]} />
        <Textarea label="설명" maxLength={100} showCount />
        <RadioGroup label="공개 범위" defaultValue="team" options={[{ value: 'public', label: '전체' }, { value: 'team', label: '팀만' }]} />
        <CheckGroup label="관심 분야" allLabel="전체 선택" options={[{ value: 'fe', label: '프론트엔드' }, { value: 'be', label: '백엔드' }]} />
        <Checkbox label="약관에 동의해요" />
      </Section>

      <Section title="Data">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}>
          <StatCard label="월 방문자" value="12,480" unit="명" delta={{ value: '+12.4%', direction: 'up' }} caption="지난달 대비" />
          <Card>
            <CardHeader eyebrow="포트폴리오" title="StockFolio" action={<IconButton icon={<More />} label="더보기" size="sm" />} />
            <CardBody>실시간 주식 포트폴리오 트래커</CardBody>
            <CardFooter><Badge tone="success" dot>운영 중</Badge></CardFooter>
          </Card>
          <Card><Skeleton lines={3} /></Card>
        </div>
        <Tabs items={[{ value: 'a', label: '개요', content: '개요 내용' }, { value: 'b', label: '이슈', count: 3, content: '이슈 내용' }]} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Table caption="프로젝트" selectable rows={rows} columns={[
            { key: 'name', header: '프로젝트', sortable: true },
            { key: 'status', header: '상태', render: (r) => <Badge tone={r.status === '운영 중' ? 'success' : 'neutral'}>{r.status}</Badge> },
            { key: 'visits', header: '방문자', align: 'right', numeric: true, sortable: true, render: (r) => r.visits.toLocaleString() },
          ]} />
          <Pagination total={248} pageSize={20} page={page} onChange={setPage} showTotal />
        </div>
        <AvatarGroup max={3}><Avatar name="최원서" /><Avatar name="김지윤" /><Avatar name="John Doe" /><Avatar name="박민" /></AvatarGroup>
      </Section>

      <Modal open={modal} onClose={() => setModal(false)} title="멤버 초대" footer={<><Button variant="secondary" onClick={() => setModal(false)}>취소</Button><Button onClick={() => setModal(false)}>초대</Button></>}>
        <TextInput label="이메일" fullWidth />
      </Modal>
      <ConfirmModal open={confirm} tone="danger" title="삭제할까요?" description="되돌릴 수 없어요." confirmLabel="삭제하기" onConfirm={() => { setConfirm(false); toast({ tone: 'danger', title: '삭제했어요' }); }} onClose={() => setConfirm(false)} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider><App /></ToastProvider>
  </StrictMode>,
);
