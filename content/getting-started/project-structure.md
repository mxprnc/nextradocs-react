# Project Structure

## 1. React 프로젝트 구조란?

React 프로젝트 구조(Project Structure)는 애플리케이션을 구성하는 소스 코드, 컴포넌트, 상태 관리 로직, API 통신 코드, 정적 리소스 및 설정 파일 등을 디렉터리와 파일 단위로 조직화하는 방식입니다.

React는 특정 프로젝트 디렉터리 구조를 강제하지 않습니다. 애플리케이션의 규모, 기능, 개발팀의 구성 및 사용 기술에 따라 다양한 구조를 선택할 수 있습니다.

일반적으로 React 프로젝트를 구성할 때는 다음과 같은 목적을 고려합니다.

- **Separation of Concerns**: UI, 비즈니스 로직, 데이터 접근 등의 역할을 분리합니다.
- **Reusability**: 여러 영역에서 공통으로 사용하는 컴포넌트와 로직을 재사용할 수 있도록 구성합니다.
- **Maintainability**: 기능을 수정하거나 확장할 때 관련 코드를 쉽게 찾을 수 있도록 구성합니다.
- **Scalability**: 애플리케이션의 규모가 커지더라도 구조를 유지하고 확장할 수 있도록 구성합니다.
- **Colocation**: 함께 변경되거나 밀접하게 관련된 파일을 가까운 위치에 배치합니다.

프로젝트 구조는 정해진 정답이 있는 영역이 아닙니다. 프로젝트의 현재 요구사항을 충족하면서 향후 확장과 유지보수가 용이한 구조를 선택하는 것이 중요합니다.

## 2. Basic React Project Structure

React + TypeScript 프로젝트는 일반적으로 프로젝트 루트에 설정 파일과 애플리케이션 소스 코드를 배치합니다.

Vite를 사용하여 React + TypeScript 프로젝트를 생성하면 다음과 유사한 기본 구조를 확인할 수 있습니다.

```text
my-react-app/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

실제 생성되는 파일과 구성은 Vite 템플릿 및 버전에 따라 달라질 수 있습니다.

### 2.1. Root Directory

프로젝트 루트 디렉터리에는 애플리케이션 전체에 영향을 주는 설정 파일과 패키지 관리 파일을 배치합니다.

| 파일 및 디렉터리 | 역할 |
|---|---|
| `public/` | 빌드 과정에서 별도 처리 없이 제공되는 정적 파일 |
| `src/` | React 애플리케이션의 소스 코드 |
| `index.html` | 웹 애플리케이션의 HTML 진입점 |
| `package.json` | 프로젝트 메타데이터, 의존성 및 실행 스크립트 |
| `package-lock.json` | npm 의존성 버전 및 설치 정보 |
| `tsconfig.json` | TypeScript 컴파일러 설정의 기본 진입점 |
| `vite.config.ts` | Vite 빌드 도구 설정 |
| `eslint.config.js` | ESLint 코드 검사 설정 |
| `README.md` | 프로젝트 설명 및 실행 방법 |

### 2.2. public/

`public/` 디렉터리는 빌드 도구에서 별도 모듈 처리하지 않고 원본 파일을 정적으로 제공하기 위한 공간입니다.

```text
public/
├── favicon.svg
├── robots.txt
├── manifest.json
└── images/
    └── logo.png
```

일반적으로 다음과 같은 파일을 배치합니다.

- Favicon
- Robots.txt
- Manifest 파일
- 외부에서 직접 접근해야 하는 정적 리소스

Vite에서는 `public/` 내부의 파일을 루트 경로를 기준으로 참조할 수 있습니다.

```tsx
function App() {
  return (
    <img src="/images/logo.png" alt="Logo" />
  );
}
```

`public/`에 배치된 파일은 일반적으로 소스 코드에서 import하여 사용하는 방식이 아니라 URL을 통해 직접 참조합니다.

### 2.3. src/

`src/` 디렉터리는 React 애플리케이션의 주요 소스 코드를 관리하는 공간입니다.

컴포넌트, Hooks, 상태 관리, API 통신, 스타일, 타입 정의 및 유틸리티 등의 코드를 배치합니다.

```text
src/
├── assets/
├── components/
├── hooks/
├── pages/
├── services/
├── types/
├── utils/
├── App.tsx
├── main.tsx
└── index.css
```

애플리케이션의 규모와 복잡도에 따라 하위 디렉터리를 추가하거나 기능별로 재구성할 수 있습니다.

### 2.4. index.html

`index.html`은 웹 애플리케이션의 HTML 문서 진입점입니다.

Vite는 해당 HTML 파일을 기반으로 애플리케이션을 실행하고 빌드합니다.

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Application</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`root` 요소는 React 애플리케이션이 렌더링될 DOM 컨테이너입니다.

### 2.5. main.tsx

`main.tsx`는 React 애플리케이션의 진입점(Entry Point)입니다.

React DOM의 `createRoot` API를 사용하여 HTML 문서의 DOM 요소에 React 애플리케이션을 연결합니다.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

주요 역할은 다음과 같습니다.

- React DOM Root 생성
- 최상위 애플리케이션 컴포넌트 렌더링
- 전역 스타일 로드
- Strict Mode 적용
- 필요한 Provider 구성

### 2.6. App.tsx

`App.tsx`는 일반적으로 애플리케이션의 최상위 컴포넌트(Root Component)를 정의하는 파일입니다.

```tsx
function App() {
  return (
    <main>
      <h1>React Application</h1>
    </main>
  );
}

export default App;
```

실제 프로젝트에서는 Router, Layout, Provider 등의 상위 구조를 조합하는 역할을 담당할 수 있습니다.

다만 `App.tsx`가 반드시 모든 페이지와 기능을 직접 관리해야 하는 것은 아닙니다. 애플리케이션의 진입점 역할과 각 기능의 구현 책임을 분리하는 것이 좋습니다.

## 3. Project Organization Strategies

React 프로젝트는 다양한 방식으로 파일을 구성할 수 있습니다.

대표적인 방식은 다음과 같습니다.

1. File-Type-Based Structure
2. Feature-Based Structure
3. Route-Based Structure
4. Hybrid Structure

각 방식은 파일을 분류하는 기준과 관련 코드의 배치 방식에서 차이가 있습니다.

### 3.1. File-Type-Based Structure

File-Type-Based Structure는 파일의 기술적 역할이나 유형을 기준으로 디렉터리를 구성하는 방식입니다.

예를 들어 컴포넌트는 `components/`, Hooks는 `hooks/`, API 통신 코드는 `services/`에 배치합니다.

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.css
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.css
│   └── Footer/
│       ├── Footer.tsx
│       └── Footer.css
│
├── hooks/
│   ├── useAuth.ts
│   └── useFetch.ts
│
├── services/
│   ├── authService.ts
│   └── userService.ts
│
├── types/
│   ├── user.ts
│   └── auth.ts
│
├── utils/
│   ├── date.ts
│   └── format.ts
│
└── App.tsx
```

**장점**

- 파일의 역할을 기준으로 쉽게 탐색할 수 있습니다.
- 디렉터리의 목적이 명확합니다.
- 초기 프로젝트를 간단하게 구성할 수 있습니다.
- 공통 기능을 중앙에서 관리하기 쉽습니다.

**단점**

- 프로젝트 규모가 커지면 하나의 디렉터리에 많은 파일이 집중될 수 있습니다.
- 특정 기능을 수정할 때 여러 디렉터리를 탐색해야 할 수 있습니다.
- 기능별 의존 관계를 파악하기 어려워질 수 있습니다.

이 방식은 규모가 작거나 기능 간 복잡한 의존 관계가 많지 않은 프로젝트에 적합합니다.

### 3.2. Feature-Based Structure

Feature-Based Structure는 애플리케이션의 비즈니스 기능을 기준으로 파일을 구성하는 방식입니다.

각 기능 디렉터리에 해당 기능에서 사용하는 컴포넌트, Hooks, API 통신 코드, 타입 정의 및 유틸리티를 함께 배치합니다.

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── authService.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   └── index.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserList.tsx
│   │   ├── hooks/
│   │   │   └── useUsers.ts
│   │   ├── services/
│   │   │   └── userService.ts
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── index.ts
│   │
│   └── products/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── components/
├── hooks/
├── services/
├── types/
├── utils/
└── App.tsx
```

**장점**

- 관련 코드가 하나의 기능 디렉터리에 모입니다.
- 특정 기능의 변경 범위를 파악하기 쉽습니다.
- 기능별 책임과 경계를 명확하게 구분할 수 있습니다.
- 새로운 기능을 추가할 때 기존 디렉터리의 영향을 줄일 수 있습니다.
- 기능 단위로 개발 및 테스트를 수행하기 쉽습니다.

**단점**

- 기능 간 공통 코드의 위치를 별도로 결정해야 합니다.
- 기능의 경계를 잘못 정의하면 코드 중복이 발생할 수 있습니다.
- 작은 프로젝트에서는 디렉터리 구조가 과도하게 복잡해질 수 있습니다.

Feature-Based Structure는 여러 비즈니스 기능이 독립적으로 존재하고 애플리케이션의 규모가 커지는 환경에 적합합니다.

### 3.3. Route-Based Structure

Route-Based Structure는 URL 경로나 페이지 단위를 기준으로 파일을 구성하는 방식입니다.

각 페이지에 해당하는 컴포넌트와 관련 코드를 페이지별로 배치합니다.

```text
src/
├── pages/
│   ├── home/
│   │   ├── HomePage.tsx
│   │   └── components/
│   │       └── HeroSection.tsx
│   │
│   ├── users/
│   │   ├── UserListPage.tsx
│   │   ├── UserDetailPage.tsx
│   │   └── components/
│   │       └── UserTable.tsx
│   │
│   └── settings/
│       └── SettingsPage.tsx
│
├── components/
├── hooks/
├── services/
└── App.tsx
```

**장점**

- URL과 페이지 컴포넌트의 대응 관계가 명확합니다.
- 페이지 단위로 코드를 탐색하기 쉽습니다.
- 페이지별 데이터 로딩 및 레이아웃을 관리하기 편리합니다.

**단점**

- 하나의 비즈니스 기능이 여러 페이지에 걸쳐 존재하면 관련 코드가 분산될 수 있습니다.
- 페이지와 무관하게 재사용되는 기능의 관리 기준이 별도로 필요합니다.

Route-Based Structure는 페이지 중심의 애플리케이션이나 라우팅 구조가 명확한 프로젝트에 적합합니다.

### 3.4. Hybrid Structure

Hybrid Structure는 앞서 설명한 여러 구성 방식을 결합하는 방식입니다.

일반적으로 애플리케이션 전체에서 공통으로 사용하는 코드는 역할별로 분리하고, 비즈니스 기능과 관련된 코드는 기능별로 구성합니다.

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│       └── AppProviders.tsx
│
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   │
│   └── layout/
│       ├── Header/
│       └── Footer/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   │
│   └── products/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── hooks/
│   └── useDebounce.ts
│
├── lib/
│   └── httpClient.ts
│
├── types/
│   └── common.ts
│
├── utils/
│   └── formatDate.ts
│
├── assets/
│
└── main.tsx
```

**장점**

- 공통 코드와 기능별 코드를 명확하게 구분할 수 있습니다.
- 기능별 독립성과 코드 재사용성을 함께 확보할 수 있습니다.
- 애플리케이션의 성장에 따라 점진적으로 확장할 수 있습니다.

**단점**

- 공통 코드와 기능별 코드의 경계를 결정해야 합니다.
- 팀 차원의 일관된 코드 배치 규칙이 필요합니다.
- 작은 프로젝트에서는 구조가 복잡하게 느껴질 수 있습니다.

실무에서는 하나의 구성 방식만 엄격하게 적용하기보다 프로젝트의 요구사항에 맞게 여러 방식을 조합하는 경우가 많습니다.

## 4. Recommended Directory Structure

React + TypeScript 기반의 일반적인 웹 애플리케이션에서는 Hybrid Structure를 출발점으로 사용하는 것을 권장합니다.

다음은 기능 중심 구조와 공통 코드 분리를 결합한 예시입니다.

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│       ├── AppProviders.tsx
│       ├── QueryProvider.tsx
│       └── ThemeProvider.tsx
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Input/
│   │   └── Modal/
│   │
│   └── layout/
│       ├── Header/
│       ├── Footer/
│       └── Sidebar/
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── users/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── products/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       ├── types/
│       └── index.ts
│
├── hooks/
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── lib/
│   ├── httpClient.ts
│   └── queryClient.ts
│
├── styles/
│   ├── global.css
│   └── variables.css
│
├── types/
│   ├── api.ts
│   └── common.ts
│
├── utils/
│   ├── formatDate.ts
│   └── formatNumber.ts
│
├── main.tsx
└── vite-env.d.ts
```

각 디렉터리의 역할은 다음과 같습니다.

| 디렉터리 | 역할 |
|---|---|
| `app/` | 애플리케이션 진입 이후의 최상위 구성 및 Provider 관리 |
| `assets/` | 이미지, 아이콘, 폰트 등 정적 리소스 관리 |
| `components/` | 여러 기능에서 공통으로 사용하는 UI 및 Layout 컴포넌트 |
| `features/` | 비즈니스 기능별 컴포넌트와 로직 관리 |
| `hooks/` | 여러 기능에서 공유하는 Custom Hooks 관리 |
| `lib/` | 외부 라이브러리 설정 및 공통 인프라 코드 관리 |
| `styles/` | 전역 스타일 및 디자인 변수 관리 |
| `types/` | 여러 영역에서 공유하는 공통 타입 관리 |
| `utils/` | 특정 UI나 비즈니스 기능에 종속되지 않는 유틸리티 관리 |

위 구조는 고정된 표준이 아닙니다. 프로젝트에 실제로 필요한 디렉터리만 생성하고, 필요성이 확인될 때 점진적으로 확장하는 것이 좋습니다.

## 5. Component Organization

React 프로젝트에서는 컴포넌트의 재사용 범위와 책임에 따라 배치 위치를 결정하는 것이 중요합니다.

일반적으로 컴포넌트는 다음과 같이 구분할 수 있습니다.

### 5.1. Shared UI Components

Shared UI Components는 애플리케이션의 여러 기능에서 공통으로 사용하는 UI 컴포넌트입니다.

예를 들어 Button, Input, Modal, Checkbox 등이 해당합니다.

```text
components/
└── ui/
    ├── Button/
    │   ├── Button.tsx
    │   ├── Button.types.ts
    │   ├── Button.module.css
    │   └── index.ts
    │
    ├── Input/
    │   ├── Input.tsx
    │   ├── Input.types.ts
    │   └── index.ts
    │
    └── Modal/
        ├── Modal.tsx
        ├── Modal.types.ts
        └── index.ts
```

이러한 컴포넌트는 특정 비즈니스 도메인에 종속되지 않도록 구성하는 것이 좋습니다.

### 5.2. Layout Components

Layout Components는 페이지의 전체적인 구조와 배치를 담당합니다.

```text
components/
└── layout/
    ├── Header/
    ├── Footer/
    ├── Sidebar/
    └── MainLayout/
```

페이지 전체에서 반복되는 Header, Footer, Navigation 등의 구조를 재사용할 수 있도록 구성합니다.

### 5.3. Feature Components

Feature Components는 특정 비즈니스 기능에 종속되는 컴포넌트입니다.

예를 들어 사용자 관리 기능에서 사용하는 UserProfile, UserTable, UserForm 등이 해당합니다.

```text
features/
└── users/
    └── components/
        ├── UserProfile.tsx
        ├── UserTable.tsx
        └── UserForm.tsx
```

이러한 컴포넌트는 다른 기능에서 직접 재사용할 필요가 없다면 해당 기능 디렉터리 내부에 유지하는 것이 좋습니다.

컴포넌트를 무조건 공통 디렉터리로 이동하기보다는 실제 재사용 범위와 책임을 기준으로 배치해야 합니다.

## 6. Colocation

Colocation은 서로 밀접하게 관련되어 있거나 함께 변경되는 파일을 가까운 위치에 배치하는 설계 원칙입니다.

React 프로젝트에서는 컴포넌트, 스타일, 타입, 테스트 파일을 동일한 컴포넌트 디렉터리에 배치하는 방식으로 적용할 수 있습니다.

예를 들어 다음과 같이 구성할 수 있습니다.

```text
components/
└── Button/
    ├── Button.tsx
    ├── Button.types.ts
    ├── Button.module.css
    ├── Button.test.tsx
    └── index.ts
```

각 파일은 다음과 같은 역할을 담당합니다.

| 파일 | 역할 |
|---|---|
| `Button.tsx` | 버튼 컴포넌트 구현 |
| `Button.types.ts` | 버튼 Props 및 관련 타입 정의 |
| `Button.module.css` | 버튼 전용 스타일 |
| `Button.test.tsx` | 버튼 컴포넌트 테스트 |
| `index.ts` | 컴포넌트 외부 공개 인터페이스 |

Colocation을 적용하면 특정 컴포넌트를 수정할 때 관련 파일을 쉽게 찾을 수 있으며, 기능 변경에 필요한 작업 범위를 명확하게 파악할 수 있습니다.

다만 모든 파일을 하나의 디렉터리에 배치해야 하는 것은 아닙니다. 프로젝트의 규모와 공유 범위에 따라 공통 타입이나 스타일은 별도 영역에서 관리할 수 있습니다.

## 7. Separation of Concerns

Separation of Concerns는 서로 다른 책임을 가진 코드를 분리하여 관리하는 설계 원칙입니다.

React 프로젝트에서는 UI 표현, 상태 관리, 데이터 접근 및 비즈니스 로직을 적절히 분리하는 방식으로 적용할 수 있습니다.

예를 들어 사용자 정보를 조회하는 기능은 다음과 같이 구성할 수 있습니다.

```text
features/
└── users/
    ├── components/
    │   └── UserProfile.tsx
    │
    ├── hooks/
    │   └── useUser.ts
    │
    ├── services/
    │   └── userService.ts
    │
    └── types/
        └── user.ts
```

각 영역의 책임은 다음과 같습니다.

**Component**

사용자 정보를 화면에 표시하는 역할을 담당합니다.

```tsx
import { useUser } from '../hooks/useUser';

type UserProfileProps = {
  userId: number;
};

export function UserProfile({ userId }: UserProfileProps) {
  const { user, isLoading, error } = useUser(userId);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to load user.</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return <h1>{user.name}</h1>;
}
```

**Custom Hook**

컴포넌트에서 사용할 상태와 데이터 조회 로직을 관리합니다.

```tsx
import { useEffect, useState } from 'react';

import { getUser } from '../services/userService';
import type { User } from '../types/user';

export function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getUser(userId);

        if (!ignore) {
          setUser(result);
        }
      } catch (cause) {
        if (!ignore) {
          setError(
            cause instanceof Error
              ? cause
              : new Error('Unknown error'),
          );
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      ignore = true;
    };
  }, [userId]);

  return {
    user,
    isLoading,
    error,
  };
}
```

**Service**

외부 API와 통신하는 역할을 담당합니다.

```ts
import type { User } from '../types/user';

export async function getUser(userId: number): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json() as Promise<User>;
}
```

**Type**

사용자 데이터의 구조를 정의합니다.

```ts
export type User = {
  id: number;
  name: string;
  email: string;
};
```

위 예제는 각 파일의 책임을 분리하는 기본적인 방법을 보여줍니다.

실제 프로젝트에서는 API 응답의 런타임 검증, 요청 취소, 캐싱 및 중복 요청 처리 등의 요구사항에 따라 구현을 확장할 수 있습니다.

## 8. Module Organization and Public APIs

프로젝트가 커지면 디렉터리 내부의 구현을 외부에 어떤 방식으로 공개할 것인지 결정해야 합니다.

TypeScript에서는 `export`와 `import`를 사용하여 모듈 간 의존 관계를 관리합니다.

### 8.1. Named Export

Named Export는 모듈에서 여러 개의 값을 명시적으로 내보내는 방식입니다.

```tsx
export function Button() {
  return <button>Click</button>;
}

export type ButtonProps = {
  label: string;
};
```

다음과 같이 사용할 수 있습니다.

```tsx
import { Button } from './Button';
```

### 8.2. Barrel Files

Barrel File은 여러 모듈의 Export를 하나의 파일에서 다시 Export하는 방식입니다.

일반적으로 `index.ts`를 사용합니다.

```text
components/
└── ui/
    └── Button/
        ├── Button.tsx
        ├── Button.types.ts
        └── index.ts
```

```ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

외부에서는 다음과 같이 사용할 수 있습니다.

```tsx
import { Button } from '@/components/ui/Button';
```

Barrel File은 외부에 공개할 인터페이스를 명확하게 만들고 내부 파일 구조를 숨기는 데 유용합니다.

다만 모든 디렉터리에 무조건 `index.ts`를 추가할 필요는 없습니다. 불필요한 재수출 계층은 의존 관계를 복잡하게 만들거나 순환 참조 및 번들링 문제를 유발할 수 있으므로 필요한 범위에서 사용하는 것이 좋습니다.

### 8.3. Feature Public API

Feature-Based Structure에서는 각 기능 디렉터리의 외부 공개 인터페이스를 `index.ts`로 관리할 수 있습니다.

```text
features/
└── users/
    ├── components/
    │   └── UserProfile.tsx
    ├── hooks/
    │   └── useUser.ts
    ├── services/
    │   └── userService.ts
    ├── types/
    │   └── user.ts
    └── index.ts
```

```ts
export { UserProfile } from './components/UserProfile';
export { useUser } from './hooks/useUser';
export type { User } from './types/user';
```

다른 기능에서는 다음과 같이 접근할 수 있습니다.

```tsx
import { UserProfile } from '@/features/users';
```

이러한 방식은 기능 간 의존 관계를 명확하게 하고 내부 구현에 대한 직접적인 접근을 제한하는 데 도움이 됩니다.

## 9. Naming Conventions

일관된 파일명과 디렉터리명은 프로젝트 탐색과 유지보수에 도움이 됩니다.

React + TypeScript 프로젝트에서는 다음과 같은 명명 규칙을 사용할 수 있습니다.

| 대상 | 권장 규칙 | 예시 |
|---|---|---|
| 디렉터리 | kebab-case 또는 프로젝트 표준 | `user-profile/` |
| React 컴포넌트 | PascalCase | `UserProfile.tsx` |
| React 컴포넌트 디렉터리 | PascalCase 또는 kebab-case | `UserProfile/` |
| Custom Hook | camelCase, `use` 접두사 | `useUser.ts` |
| 일반 함수 | camelCase | `formatDate.ts` |
| 타입 정의 | 도메인에 맞는 이름 | `user.ts` |
| 상수 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| 테스트 파일 | 대상 파일명 + `.test` | `UserProfile.test.tsx` |
| CSS Module | 대상 파일명 + `.module.css` | `UserProfile.module.css` |

파일명 규칙은 프로젝트의 일관성이 가장 중요합니다.

예를 들어 컴포넌트 디렉터리는 PascalCase를 사용하고 일반 유틸리티 디렉터리는 kebab-case를 사용하는 등 규칙을 구분할 수도 있습니다.

## 10. Project Structure Evolution

프로젝트 구조는 처음부터 복잡하게 설계하기보다 실제 코드와 기능이 증가하는 과정에서 점진적으로 확장하는 것이 좋습니다.

### 10.1. Small Projects

작은 프로젝트에서는 단순한 디렉터리 구조만으로도 충분합니다.

```text
src/
├── components/
├── hooks/
├── App.tsx
├── main.tsx
└── index.css
```

이 단계에서는 불필요하게 많은 디렉터리를 생성하지 않는 것이 좋습니다.

### 10.2. Medium Projects

기능과 컴포넌트가 증가하면 공통 코드와 기능별 코드를 분리할 수 있습니다.

```text
src/
├── components/
├── features/
│   ├── auth/
│   ├── users/
│   └── products/
├── hooks/
├── services/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

기능별로 관련 코드를 그룹화하고 공통으로 사용하는 요소를 별도 영역에서 관리합니다.

### 10.3. Large Projects

대규모 프로젝트에서는 기능별 디렉터리 내부의 구조를 세분화하고 기능 간 의존 관계를 관리할 수 있습니다.

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── config/
│
├── components/
│   ├── ui/
│   └── layout/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── orders/
│   └── payments/
│
├── shared/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── utils/
│
├── assets/
└── main.tsx
```

이 단계에서는 단순히 디렉터리를 늘리는 것보다 모듈 간 의존 방향과 공개 인터페이스를 명확하게 정의하는 것이 중요합니다.

## 11. Common Mistakes

React 프로젝트 구조를 설계할 때 다음과 같은 문제를 주의해야 합니다.

### 11.1. Over-Engineering

프로젝트의 실제 규모와 요구사항에 비해 지나치게 복잡한 구조를 설계하는 경우입니다.

작은 프로젝트에 모든 기능별 디렉터리와 추상화 계층을 미리 만드는 것은 오히려 개발 속도와 코드 탐색 효율을 떨어뜨릴 수 있습니다.

실제 필요성이 확인된 경우에 구조를 확장하는 것이 좋습니다.

### 11.2. Excessive Directory Nesting

불필요하게 깊은 디렉터리 구조는 파일 탐색과 모듈 간 import를 어렵게 만들 수 있습니다.

```text
src/
└── features/
    └── users/
        └── components/
            └── profile/
                └── sections/
                    └── header/
                        └── UserProfileHeader.tsx
```

디렉터리의 깊이는 실제 책임과 구조적 필요성에 따라 결정해야 합니다.

### 11.3. Global Components Directory Overload

모든 컴포넌트를 하나의 `components/` 디렉터리에 배치하면 프로젝트 규모가 커질수록 탐색이 어려워집니다.

특정 기능에서만 사용하는 컴포넌트는 해당 기능의 디렉터리 내부에 배치하고, 여러 기능에서 실제로 공유하는 컴포넌트만 공통 영역으로 이동하는 것이 좋습니다.

### 11.4. Unclear Responsibility Boundaries

하나의 파일이나 디렉터리가 UI 렌더링, API 통신, 상태 관리 및 비즈니스 로직을 모두 담당하면 변경 영향 범위를 파악하기 어려워집니다.

각 모듈의 책임을 명확히 정의하고 관련 로직을 적절하게 분리해야 합니다.

### 11.5. Premature Abstraction

실제로 재사용되는지 확인하지 않은 상태에서 모든 코드를 공통 컴포넌트나 유틸리티로 추상화하는 경우입니다.

서로 다른 기능에서 사용하는 코드가 겉으로 유사하더라도 변경 이유와 책임이 다를 수 있습니다.

실제 재사용 요구사항과 변경 패턴을 확인한 후 공통 모듈로 분리하는 것이 좋습니다.

## 12. Summary

React 프로젝트 구조는 애플리케이션의 소스 코드와 설정 파일을 역할 및 기능에 따라 조직화하는 방법입니다.

React는 특정 디렉터리 구조를 강제하지 않으므로 프로젝트의 규모와 요구사항에 맞는 구조를 선택해야 합니다.

주요 구성 전략은 다음과 같습니다.

| 구조 | 분류 기준 | 적합한 환경 |
|---|---|---|
| File-Type-Based | 파일의 기술적 역할 | 소규모 프로젝트 |
| Feature-Based | 비즈니스 기능 | 기능이 많은 프로젝트 |
| Route-Based | 페이지 및 URL | 페이지 중심 애플리케이션 |
| Hybrid | 여러 분류 방식의 조합 | 중대형 애플리케이션 |

프로젝트 구조를 설계할 때 고려해야 할 주요 원칙은 다음과 같습니다.

- Separation of Concerns
- Reusability
- Maintainability
- Scalability
- Colocation
- Clear Module Boundaries

특히 프로젝트 초기에는 단순한 구조를 유지하고, 기능과 코드가 증가하면서 실제로 필요한 영역을 분리하는 점진적인 접근이 효과적입니다.

## 13. References

### Official Documentation

- [React - File Structure](https://legacy.reactjs.org/docs/faq-structure.html)
- [React - Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [React - Thinking in React](https://react.dev/learn/thinking-in-react)
- [React - Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [Vite - Getting Started](https://vite.dev/guide/)
- [Vite - Static Asset Handling](https://vite.dev/guide/assets.html)
- [TypeScript - Project Configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

### Development Guides

- [MDN - Getting Started with React](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Frameworks_libraries/React_getting_started)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Infinum - React Project Structure](https://infinum.com/handbook/frontend/react/project-structure)

### Related Topics

- [React - Your First Component](https://react.dev/learn/your-first-component)
- [React - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [TypeScript - Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)