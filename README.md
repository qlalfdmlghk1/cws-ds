# CHOI Design System (`@choi/ds`)

개인 프로젝트에서 쓰는 React + TypeScript 디자인 시스템이에요. 컴포넌트 30개, 라이트/다크 테마, 접근성(대비 4.5:1, 키보드 조작, ARIA)을 기본으로 갖추고 있어요.

> 디자인 기준 문서는 claude.ai의 **CHOI Design System** 아티팩트예요. 색·간격 같은 값은 둘 다 `src/tokens/tokens.json` 하나를 기준으로 맞춰요.

## 설치

npm에 올리지 않고 GitHub에서 바로 설치해요. 설치할 때 `prepare` 스크립트가 자동으로 빌드해요.

```bash
npm i github:<계정명>/choi-ds
# 또는 pnpm add github:<계정명>/choi-ds
```

## 사용

```tsx
// 앱 진입점에서 한 번
import '@choi/ds/styles.css';   // 토큰 + 컴포넌트 스타일
import '@choi/ds/fonts.css';    // Pretendard (이미 Pretendard를 불러오고 있으면 생략)

import { Button, Modal, ToastProvider, useToast } from '@choi/ds';

export default function App() {
  return (
    <ToastProvider>
      <Page />
    </ToastProvider>
  );
}

function Page() {
  const { toast } = useToast();
  return <Button onClick={() => toast('저장했어요')}>저장</Button>;
}
```

### 다크 모드

`<html data-theme="dark">`로 바꾸면 모든 컴포넌트가 따라 바뀌어요.

```ts
document.documentElement.dataset.theme = 'dark'; // 'light'로 되돌리기
```

### Next.js (App Router)

빌드 결과물 맨 위에 `'use client'`가 들어 있어서 서버 컴포넌트에서 import해도 돼요. 스타일은 `app/layout.tsx`에서 import하세요.

```tsx
// app/layout.tsx
import '@choi/ds/styles.css';
import '@choi/ds/fonts.css';
```

## 컴포넌트

| 그룹 | 컴포넌트 |
| --- | --- |
| Actions | `Button` `IconButton` `Chip` `DropdownMenu` |
| Form | `TextInput` `Textarea` `Select` `MultiSelect` `Checkbox` `CheckGroup` `Radio` `RadioGroup` `Switch` `Datepicker` `Calendar` |
| Data | `Table` `Card` `CardHeader` `CardBody` `CardFooter` `StatCard` `Badge` `Avatar` `AvatarGroup` |
| Navigation | `Tabs` `Pagination` |
| Feedback | `Modal` `ConfirmModal` `Toast` `ToastProvider` `useToast` `Tooltip` `Popover` `Skeleton` |

각 컴포넌트의 props 설명은 타입 정의(JSDoc)에 한국어로 들어 있어서 에디터에서 바로 보여요.

## 토큰

- `src/tokens/tokens.json`이 **단일 기준**이에요. 값을 바꾸면 `npm run tokens`로 `tokens.css`를 다시 만들어요.
- CSS 변수로 쓸 수 있어요: `var(--brand)`, `var(--space-4)`, `var(--radius-md)` …
- 글자 스타일 클래스: `.cds-text-display` `.cds-text-title` `.cds-text-subtitle` `.cds-text-body` `.cds-text-body-sm` `.cds-text-label` `.cds-text-caption`
- 원본 값이 필요하면 `import tokens from '@choi/ds/tokens.json'`.

## 개발

```bash
npm install
npm run dev        # playground (모든 컴포넌트 한 화면)
npm run build      # 토큰 생성 → 타입 검사 → 라이브러리 빌드 (dist/)
npm run typecheck
```

```
src/
├─ tokens/tokens.json      ← 색·글꼴·간격·모서리·그림자 (단일 기준)
├─ styles/                 ← tokens.css(생성) · base.css · components.css
├─ fonts/ · fonts.css      ← Pretendard
├─ internal/               ← 공용 훅·아이콘·날짜 유틸
├─ components/<Name>/      ← 컴포넌트별 .tsx
└─ index.ts
playground/                ← 개발용 데모 페이지
```

## 라이선스

MIT. Pretendard 폰트는 SIL Open Font License 1.1.
