# CHOI Design System (`@choi/ds`)

개인 프로젝트에서 쓰는 React + TypeScript 디자인 시스템이에요. 컴포넌트 39개, 라이트/다크 테마, 접근성(대비 4.5:1, 키보드 조작, ARIA)을 기본으로 갖추고 있어요.

> 디자인 기준 문서는 claude.ai의 **CHOI Design System** 아티팩트예요. 색·간격 같은 값은 둘 다 `src/tokens/tokens.json` 하나를 기준으로 맞춰요.

## 설치

npm에 올리지 않고 GitHub에서 바로 설치해요. 설치할 때 `prepare` 스크립트가 자동으로 빌드해요.

```bash
npm i github:qlalfdmlghk1/cws-ds
# 버전 고정: npm i github:qlalfdmlghk1/cws-ds#v0.4.0
```

## 사용

```tsx
// 앱 진입점에서 한 번
import '@choi/ds/styles.css';   // 토큰 + 컴포넌트 스타일
import '@choi/ds/fonts.css';    // Pretendard (이미 Pretendard를 불러오고 있으면 생략)

import { AppButton, AppModal, AppToastProvider, useToast } from '@choi/ds';

export default function App() {
  return (
    <AppToastProvider>
      <Page />
    </AppToastProvider>
  );
}

function Page() {
  const { toast } = useToast();
  return <AppButton onClick={() => toast('저장했어요')}>저장</AppButton>;
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
| Actions | `AppButton` `AppIconButton` `AppChip` `AppDropdownMenu` |
| Form | `AppTextInput` `AppTextarea` `AppSelect` `AppMultiSelect` `AppCheckbox` `AppCheckGroup` `AppRadio` `AppRadioGroup` `AppSwitch` `AppDatepicker` `AppCalendar` `AppSlider` `AppFileUpload` |
| Data | `AppTable` `AppCard` `AppCardHeader` `AppCardBody` `AppCardFooter` `AppStatCard` `AppBadge` `AppAvatar` `AppAvatarGroup` `AppAccordion` `AppDivider` |
| Navigation | `AppTabs` `AppPagination` `AppBreadcrumb` |
| Feedback | `AppModal` `AppConfirmModal` `AppToast` `AppToastProvider` `useToast` `AppTooltip` `AppPopover` `AppSkeleton` `AppAlert` `AppSpinner` `AppProgress` `AppDrawer` |

각 컴포넌트의 props 설명은 타입 정의(JSDoc)에 한국어로 들어 있어서 에디터에서 바로 보여요.

## 이름 규칙

컴포넌트는 모두 `App`으로 시작해요 (`AppButton`, `AppSelect`, `AppModal` …). Props 타입도 같아요 (`AppButtonProps`). 훅과 함수(`useToast`, `createBrandTheme`, `datePresets`)와 CSS 클래스(`cds-`)는 그대로예요.

v0.3 이전 이름(`Button`, `Select` …)은 v0.4에서는 별칭으로 남아 있어요. 에디터에서 줄이 그어져 보이고, v0.5에서 지워요.

## 브랜드 색 바꾸기

프로젝트마다 서비스 메인 색이 달라도 **색 하나만 넣으면** 버튼·체크박스·탭·슬라이더·포커스 링이 함께 바뀌어요. 라이트·다크 값을 만들고, 글자 4.5:1 · 채움과 포커스 링 3:1 대비가 모자라면 밝기를 조금 옮겨 맞춰요.

```tsx
// 1) React — 서버 렌더링 첫 화면부터 적용 (Next.js app/layout.tsx의 <head>에)
import { AppBrandStyle } from '@choi/ds';
<AppBrandStyle color="#0E9888" />
```

```bash
# 2) CSS 파일로 고정 — 만든 파일을 앱에서 import (불러오는 순서와 상관없이 기본 색보다 우선)
npx choi-ds-brand "#0E9888" > src/brand.css
```

```ts
// 3) 실행 중에 바꾸기
import { applyBrandTheme } from '@choi/ds';
const reset = applyBrandTheme('#2B45E0');

// 값만 필요하면 (React 없이 서버·스크립트에서도: '@choi/ds/brand')
import { createBrandTheme, brandThemeCss } from '@choi/ds/brand';
const { light, dark, notes } = createBrandTheme('#EAB308'); // notes: 무엇을 보정했는지
```

Storybook 툴바의 "브랜드 색"에서 여러 색으로 바로 비교할 수 있어요.

## 모달·스크롤 영역 안에서 쓰기

**목록이 잘릴 때 — `portal`**
AppSelect·AppMultiSelect·AppDatepicker를 모달 본문처럼 스크롤되는 영역 안에 두면 목록이 그 안에 갇혀요. `portal`을 켜면 목록을 `document.body`에 띄워요. 트리거 위치를 따라가고, 아래 공간이 모자라면 위로 펼쳐요.

```tsx
<AppSelect label="지역" options={regions} portal />
```

**겹치는 순서 — z-index 토큰**
앱의 sticky 헤더보다 모달이 아래 깔리면 CSS 변수만 바꿔요 (기본값).

```css
:root {
  --z-popover: 20;   /* 트리거 아래 목록·메뉴 (portal 아닐 때) */
  --z-modal: 100;    /* AppModal · AppDrawer */
  --z-portal: 150;   /* portal 목록 — 모달 위, 토스트 아래 */
  --z-toast: 200;
  --z-tooltip: 300;
}
```

**라벨 없이 쓸 때**
AppSelect·AppMultiSelect·AppDatepicker는 `aria-label`(또는 `aria-labelledby`)을 받아요. 화면에 라벨이 없어도 스크린리더가 "조회 기간, 2026.11.01 – 11.07"처럼 읽어요. AppTextInput·AppTextarea에 넘긴 `aria-describedby`는 도움말 id와 합쳐져요.

## 토큰

- `src/tokens/tokens.json`이 **단일 기준**이에요. 값을 바꾸면 `npm run tokens`로 `tokens.css`를 다시 만들어요.
- CSS 변수로 쓸 수 있어요: `var(--brand)`, `var(--space-4)`, `var(--radius-md)` …
- 글자 스타일 클래스: `.cds-text-display` `.cds-text-title` `.cds-text-subtitle` `.cds-text-body` `.cds-text-body-sm` `.cds-text-label` `.cds-text-caption`
- 원본 값이 필요하면 `import tokens from '@choi/ds/tokens.json'`.

## 개발

```bash
npm install
npm run dev              # playground (모든 컴포넌트 한 화면)
npm run storybook        # Storybook (http://localhost:6006) — 컴포넌트별 예시·props·접근성 검사
npm run build            # 토큰 생성 → 타입 검사 → 라이브러리 빌드 (dist/)
npm run build-storybook  # Storybook 정적 빌드 (storybook-static/)
npm run build:artifact   # Claude Design System 아티팩트용 bundle.js·bundle.css·index.d.ts (artifact/)
npm run typecheck
npm test                 # 단위 테스트 (Vitest) — 브랜드 색 대비 등
```

Storybook 툴바의 "테마"로 라이트와 다크를 오가고, 아래 Accessibility 패널에서 대비·ARIA 문제를 확인해요.

### 아티팩트와 맞추기

Claude Design System 아티팩트의 컴포넌트는 이 저장소 코드에서 만들어요. 컴포넌트를 고친 뒤에는 `npm run build && npm run build:artifact`를 돌리고, `artifact/components/`의 세 파일을 아티팩트의 `project/components/`에 올려요. 그래서 아티팩트와 패키지가 같은 코드로 동작해요.

```
src/
├─ tokens/tokens.json      ← 색·글꼴·간격·모서리·그림자 (단일 기준)
├─ styles/                 ← tokens.css(생성) · base.css · components.css
├─ fonts/ · fonts.css      ← Pretendard
├─ internal/               ← 공용 훅·아이콘·날짜 유틸
├─ theme/                  ← 브랜드 색 생성 (createBrandTheme · AppBrandStyle)
├─ components/<Name>/      ← 컴포넌트별 .tsx + .stories.tsx
├─ stories/                ← 스토리용 데모 아이콘·레이아웃 (패키지에 안 들어감)
├─ Introduction.mdx        ← Storybook 첫 페이지
└─ index.ts
.storybook/                ← Storybook 설정 (테마 툴바, 접근성 검사)
scripts/                   ← 토큰 생성 · 아티팩트 번들 생성
bin/                       ← choi-ds-brand 명령
playground/                ← 개발용 데모 페이지
```

## 라이선스

MIT. Pretendard 폰트는 SIL Open Font License 1.1.
