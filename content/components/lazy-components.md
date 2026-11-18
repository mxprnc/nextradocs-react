# Lazy Components

## 1. Lazy Components 개요

Lazy Components는 컴포넌트의 코드를 처음부터 모두 로딩하지 않고, 해당 컴포넌트가 실제로 필요해지는 시점까지 로딩을 지연하는 기법입니다.

React에서는 `lazy()` API를 사용하여 컴포넌트를 지연 로딩할 수 있습니다. 일반적으로 JavaScript의 동적 `import()`와 함께 사용하며, 컴포넌트 코드가 로딩되는 동안에는 `Suspense`를 통해 대체 UI를 표시합니다.

Lazy Loading은 Code Splitting을 구현하는 대표적인 방법으로, 초기 페이지 로딩에 필요하지 않은 코드를 별도의 청크(Chunk)로 분리하여 사용자가 해당 기능을 요청할 때 다운로드하도록 구성할 수 있습니다.

주요 목적은 다음과 같습니다.

- **초기 번들 크기 감소**: 첫 화면에 필요하지 않은 컴포넌트 코드를 초기 다운로드 대상에서 분리합니다.
- **필요한 시점에 코드 로딩**: 사용자가 특정 기능에 접근할 때 해당 컴포넌트를 로딩합니다.
- **로딩 상태 관리**: 컴포넌트 코드가 준비되지 않은 동안 `Suspense`의 Fallback UI를 표시합니다.
- **기능별 코드 분리**: 페이지, 모달, 에디터, 차트 등 독립적인 기능 단위로 코드를 분리할 수 있습니다.

Lazy Components는 컴포넌트의 렌더링 비용 자체를 줄이는 최적화 기법이 아니라, **JavaScript 코드의 다운로드 및 초기 실행 부담을 분산하는 최적화 기법**입니다.

## 2. Code Splitting

### 2.1. 정적 Import와 동적 Import

일반적인 컴포넌트는 정적 `import`를 사용하여 모듈을 가져옵니다.

```tsx
import Dashboard from './Dashboard';

function App() {
  return <Dashboard />;
}
```

정적 Import는 모듈 간의 의존성을 빌드 시점에 파악할 수 있도록 합니다. 번들러는 이러한 의존성 관계를 분석하여 애플리케이션의 JavaScript 파일을 생성합니다.

반면 동적 `import()`는 모듈을 비동기적으로 가져오는 기능입니다.

```tsx
function loadDashboard() {
  return import('./Dashboard');
}
```

동적 Import는 Promise를 반환하며, 번들러는 이를 기준으로 별도의 코드 청크를 생성할 수 있습니다.

예를 들어 다음과 같은 구조로 코드를 분리할 수 있습니다.

```text
src/
├── App.tsx
├── pages/
│   ├── Home.tsx
│   └── Dashboard.tsx
└── components/
    └── Loading.tsx
```

빌드 결과는 번들러의 설정에 따라 달라지지만, 개념적으로 다음과 같이 분리될 수 있습니다.

```text
dist/
├── main.js
└── Dashboard.chunk.js
```

`Dashboard.chunk.js`는 해당 모듈이 필요해지는 시점에 다운로드할 수 있습니다.

다만 동적 Import를 사용했다고 해서 모든 환경에서 반드시 동일한 방식으로 청크가 생성되는 것은 아닙니다. 실제 코드 분할과 청크 로딩은 Vite, Webpack 등 번들러와 프레임워크의 빌드 설정에 영향을 받습니다.

### 2.2. Code Splitting의 필요성

애플리케이션의 기능이 증가하면 초기 로딩에 필요한 JavaScript 코드의 양도 증가할 수 있습니다.

예를 들어 대시보드에 다음 기능이 포함되어 있다고 가정하겠습니다.

- 사용자 프로필
- 데이터 시각화 차트
- Markdown 편집기
- 관리자 설정
- 로그 분석 화면

사용자가 첫 화면에 접근했을 때 모든 기능의 코드가 필요한 것은 아닙니다.

모든 기능을 하나의 초기 번들에 포함하면 사용자가 실제로 사용하지 않는 기능의 코드까지 다운로드하고 파싱해야 할 수 있습니다.

Code Splitting을 적용하면 기능별로 코드를 분리하고, 필요한 기능만 선택적으로 로딩할 수 있습니다.

```text
초기 로딩
    |
    v
main.js
    |
    +-- 공통 UI
    +-- 라우팅
    +-- 기본 페이지

기능 접근 시
    |
    +-- Chart.chunk.js
    +-- Editor.chunk.js
    +-- Admin.chunk.js
```

이를 통해 초기 다운로드 크기를 줄이고 애플리케이션의 초기 로딩 성능을 개선할 수 있습니다.

다만 코드 분할이 항상 전체 성능을 개선하는 것은 아닙니다. 지나치게 작은 청크를 많이 생성하면 네트워크 요청이 증가하거나 필요한 코드가 뒤늦게 로딩되어 화면 표시가 지연될 수 있습니다.

## 3. React.lazy()

### 3.1. lazy() 개요

`lazy()`는 컴포넌트의 코드를 실제로 렌더링하려는 시점까지 로딩하지 않도록 지연하는 React API입니다.

```tsx
import { lazy } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
```

`lazy()`는 다음과 같은 함수를 인자로 받습니다.

```tsx
lazy(load);
```

`load` 함수는 Promise 또는 Promise와 유사한 객체(Thenable)를 반환해야 합니다.

React는 지연 로딩된 컴포넌트를 처음 렌더링하려고 시도할 때 `load` 함수를 실행합니다. Promise가 해결되면 결과 객체의 `default` 속성을 컴포넌트로 사용합니다.

```tsx
const Dashboard = lazy(() => import('./Dashboard'));
```

위 코드는 다음과 같은 흐름으로 동작합니다.

1. `lazy()`를 호출하여 지연 로딩 컴포넌트를 선언합니다.
2. 컴포넌트가 처음 렌더링되기 전까지 모듈 로딩을 지연합니다.
3. 해당 컴포넌트를 렌더링하려고 시도하면 `load` 함수를 실행합니다.
4. 동적 Import가 반환한 Promise가 해결될 때까지 렌더링을 일시 중단합니다.
5. 모듈 로딩이 완료되면 모듈의 `default` Export를 컴포넌트로 렌더링합니다.

`lazy()`는 로딩 함수가 반환한 Promise와 해결된 결과를 캐시합니다. 따라서 동일한 Lazy Component의 로딩 함수는 최초 로딩 과정에서 한 번 실행됩니다.

### 3.2. 기본 사용법

다음과 같이 일반 컴포넌트를 Lazy Component로 변경할 수 있습니다.

```tsx
// Dashboard.tsx

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

```tsx
// App.tsx

import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

export default function App() {
  return (
    <Suspense fallback={<p>Loading Dashboard...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

`Dashboard` 컴포넌트는 처음 렌더링될 때 동적으로 로딩됩니다.

모듈 로딩이 완료되기 전까지는 `Suspense`의 `fallback`에 지정된 UI가 표시됩니다.

### 3.3. Default Export 요구사항

`lazy()`에 전달하는 동적 Import는 기본적으로 모듈의 `default` Export를 컴포넌트로 사용합니다.

따라서 다음과 같이 Default Export를 사용하는 것이 가장 간단합니다.

```tsx
// Dashboard.tsx

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

```tsx
const Dashboard = lazy(() => import('./Dashboard'));
```

Named Export를 사용하는 모듈을 그대로 전달하면 `lazy()`가 기대하는 `default` 속성이 없으므로 사용할 수 없습니다.

다음과 같이 Named Export를 Default Export 형태로 변환할 수 있습니다.

```tsx
// Dashboard.tsx

export function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

```tsx
// App.tsx

import { lazy } from 'react';

const Dashboard = lazy(() =>
  import('./Dashboard').then((module) => ({
    default: module.Dashboard,
  }))
);
```

동적 Import의 결과를 `then()`으로 변환하여 `default` 속성을 가진 객체를 반환하는 방식입니다.

이때 `default`에 지정하는 값은 유효한 React 컴포넌트 타입이어야 합니다.

## 4. Suspense

### 4.1. Suspense 개요

`Suspense`는 하위 컴포넌트가 렌더링을 완료할 준비가 되지 않았을 때 대체 UI를 표시하는 React 내장 컴포넌트입니다.

```tsx
import { Suspense } from 'react';

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

`Suspense`는 하위 트리의 렌더링이 일시 중단(Suspend)되면 `fallback`을 표시하고, 필요한 리소스가 준비되면 실제 콘텐츠를 표시합니다.

React의 `lazy()`로 로딩하는 컴포넌트는 코드가 아직 준비되지 않았을 때 렌더링을 일시 중단하므로 `Suspense`와 함께 사용해야 합니다.

주요 Props는 다음과 같습니다.

| Prop | 설명 |
| --- | --- |
| `children` | 실제로 표시할 하위 콘텐츠입니다. |
| `fallback` | 하위 콘텐츠가 준비되지 않았을 때 표시할 대체 UI입니다. |

`fallback`에는 React Node를 전달할 수 있으며, 일반적으로 Spinner나 Skeleton UI를 사용합니다.

```tsx
function Loading() {
  return (
    <div className="loading">
      <span>Loading...</span>
    </div>
  );
}
```

### 4.2. Suspense Boundary

`Suspense`가 감싸는 하위 컴포넌트 영역을 Suspense Boundary라고 합니다.

컴포넌트가 Suspend되면 가장 가까운 상위 Suspense Boundary가 해당 영역의 Fallback UI를 표시합니다.

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <main>
      <h1>Application</h1>

      <Suspense fallback={<p>Loading Dashboard...</p>}>
        <Dashboard />
      </Suspense>
    </main>
  );
}
```

위 구조에서 `Dashboard`의 로딩이 완료되지 않았다면 `Dashboard`가 표시될 영역에 Fallback UI가 렌더링됩니다.

`main`과 `h1`은 Suspense Boundary 외부에 있으므로 기존 UI를 유지합니다.

즉, Suspense Boundary는 애플리케이션 전체를 로딩 상태로 변경하는 것이 아니라 지정된 하위 영역의 로딩 상태를 관리합니다.

### 4.3. 중첩 Suspense Boundary

여러 기능의 로딩 상태를 독립적으로 관리하려면 Suspense Boundary를 중첩할 수 있습니다.

```tsx
import { lazy, Suspense } from 'react';

const Profile = lazy(() => import('./Profile'));
const Chart = lazy(() => import('./Chart'));
const Activity = lazy(() => import('./Activity'));

function Dashboard() {
  return (
    <main>
      <Suspense fallback={<p>Loading Profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading Chart...</p>}>
        <Chart />
      </Suspense>

      <Suspense fallback={<p>Loading Activity...</p>}>
        <Activity />
      </Suspense>
    </main>
  );
}
```

각 컴포넌트는 독립적인 Suspense Boundary에 포함되어 있으므로 개별적으로 로딩 상태를 관리할 수 있습니다.

반대로 여러 컴포넌트를 하나의 Boundary로 묶으면 하나의 단위로 콘텐츠를 표시할 수 있습니다.

```tsx
function Dashboard() {
  return (
    <Suspense fallback={<p>Loading Dashboard...</p>}>
      <Profile />
      <Chart />
      <Activity />
    </Suspense>
  );
}
```

이 구조에서는 하위 컴포넌트 중 하나라도 렌더링을 일시 중단하면 해당 Boundary가 전체 하위 영역 대신 Fallback UI를 표시할 수 있습니다.

Boundary의 배치는 단순히 컴포넌트의 개수에 따라 결정하기보다 사용자가 어떤 콘텐츠를 하나의 로딩 단위로 인식해야 하는지를 기준으로 설계해야 합니다.

### 4.4. Suspense와 데이터 페칭

`Suspense`는 코드 로딩뿐 아니라 데이터 로딩과 같은 비동기 작업의 대기 상태를 표현하는 데에도 사용할 수 있습니다.

다만 `Suspense` 자체가 데이터를 요청하거나 캐싱하는 기능을 제공하는 것은 아닙니다.

`lazy()`는 동적 Import를 통해 컴포넌트 코드를 로딩하도록 설계된 API입니다. 데이터 페칭은 별도의 데이터 소스나 라이브러리에서 처리해야 합니다.

데이터 로딩과 Suspense를 함께 사용하려면 사용하는 데이터 소스가 React의 Suspense 동작을 지원해야 합니다.

대표적인 지원 방식은 다음과 같습니다.

- Suspense를 지원하는 프레임워크의 데이터 로딩 기능
- Suspense 통합을 제공하는 데이터 라이브러리
- React가 지원하는 Suspense 기반 리소스 로딩 방식

예를 들어 React Router, Next.js와 같은 프레임워크는 자체적인 라우팅 및 데이터 로딩 구조를 통해 비동기 데이터와 UI의 로딩 상태를 통합할 수 있습니다. 다만 구체적인 지원 범위와 사용 방법은 각 프레임워크의 버전과 API에 따라 달라집니다.

반면 다음과 같이 일반적인 `useEffect()`와 `useState()`를 사용하여 데이터를 요청하는 방식은 자동으로 Suspense를 발생시키지 않습니다.

```tsx
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/user');
        const data: User = await response.json();

        setUser(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (isLoading) {
    return <p>Loading User...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return <h2>{user.name}</h2>;
}
```

위 코드는 컴포넌트 내부에서 로딩 상태를 직접 관리합니다. 데이터 요청이 진행되는 동안 `isLoading`을 기준으로 로딩 UI를 렌더링하며, `Suspense`에 의존하지 않습니다.

따라서 다음과 같이 구분할 수 있습니다.

| 구분 | 설명 |
| --- | --- |
| `lazy()` | 동적 Import를 이용하여 컴포넌트 코드를 지연 로딩합니다. |
| `Suspense` | 지원되는 하위 작업이 Suspend되었을 때 Fallback UI를 표시합니다. |
| `useEffect()` 기반 데이터 페칭 | 컴포넌트 내부에서 요청과 로딩 상태를 직접 관리합니다. |
| Suspense 기반 데이터 페칭 | Suspense를 지원하는 데이터 소스나 프레임워크를 통해 로딩 상태를 통합합니다. |

`Suspense`는 로딩 상태를 표현하는 UI 경계이며, 데이터 요청·캐싱·재검증·오류 복구 등의 책임은 데이터 소스나 프레임워크에 따라 별도로 관리됩니다.

## 5. TypeScript와 Lazy Components

### 5.1. 기본 타입 추론

TypeScript에서는 동적 Import의 모듈 타입을 기반으로 Lazy Component의 Props 타입을 추론할 수 있습니다.

```tsx
// UserProfile.tsx

interface UserProfileProps {
  userId: number;
  name: string;
}

export default function UserProfile({
  userId,
  name,
}: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>User ID: {userId}</p>
    </div>
  );
}
```

```tsx
// App.tsx

import { lazy, Suspense } from 'react';

const UserProfile = lazy(() => import('./UserProfile'));

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserProfile userId={1} name="Alice" />
    </Suspense>
  );
}
```

`UserProfile`의 Props 타입은 원본 컴포넌트의 타입을 기반으로 추론됩니다.

따라서 별도로 Lazy Component의 Props 타입을 선언할 필요가 없습니다.

### 5.2. Named Export의 타입 처리

Named Export를 Lazy Component로 변환하는 경우에도 TypeScript가 모듈의 타입을 추론할 수 있습니다.

```tsx
// Settings.tsx

interface SettingsProps {
  theme: 'light' | 'dark';
}

export function Settings({ theme }: SettingsProps) {
  return <div>Current theme: {theme}</div>;
}
```

```tsx
// App.tsx

import { lazy, Suspense } from 'react';

const Settings = lazy(() =>
  import('./Settings').then((module) => ({
    default: module.Settings,
  }))
);

export default function App() {
  return (
    <Suspense fallback={<p>Loading Settings...</p>}>
      <Settings theme="dark" />
    </Suspense>
  );
}
```

`module.Settings`의 타입이 `default` 속성에 전달되므로 컴포넌트의 Props 타입도 유지됩니다.

잘못된 Props를 전달하면 TypeScript가 타입 오류를 감지할 수 있습니다.

## 6. 조건부 Lazy Loading

### 6.1. 조건부 렌더링과 결합

Lazy Component는 조건부 렌더링과 함께 사용하여 특정 기능이 필요해지는 시점에만 로딩할 수 있습니다.

```tsx
import { lazy, Suspense, useState } from 'react';

const MarkdownEditor = lazy(() => import('./MarkdownEditor'));

export default function App() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  return (
    <main>
      <button onClick={() => setIsEditorOpen(true)}>
        Open Editor
      </button>

      {isEditorOpen && (
        <Suspense fallback={<p>Loading Editor...</p>}>
          <MarkdownEditor />
        </Suspense>
      )}
    </main>
  );
}
```

`isEditorOpen`이 `true`가 되기 전까지 `MarkdownEditor`는 렌더링되지 않으므로 동적 Import도 실행되지 않습니다.

사용자가 편집기를 처음 열면 해당 모듈을 다운로드하고, 로딩이 완료되면 컴포넌트를 표시합니다.

### 6.2. 로딩 완료 이후의 동작

`lazy()`는 로딩 함수가 반환한 Promise와 해결된 결과를 캐시합니다.

따라서 위 예제에서 편집기를 닫았다가 다시 열더라도 일반적으로 이미 로딩된 모듈을 다시 다운로드하지 않습니다.

다만 컴포넌트가 조건부 렌더링에 의해 언마운트되었다면 컴포넌트의 로컬 State는 유지되지 않습니다.

즉, 다음 두 가지는 구분해야 합니다.

- **모듈 캐시**: 로딩된 JavaScript 모듈의 재사용과 관련됩니다.
- **컴포넌트 State**: 해당 컴포넌트 인스턴스의 마운트 및 언마운트와 관련됩니다.

모듈이 캐시되어 있더라도 컴포넌트가 다시 마운트되면 로컬 State는 초기화될 수 있습니다.

## 7. Lazy Components와 Error Boundary

### 7.1. 모듈 로딩 실패

Lazy Component의 동적 Import가 실패하면 Promise가 Reject됩니다.

React는 해당 오류를 가장 가까운 Error Boundary가 처리할 수 있도록 전달합니다.

따라서 `Suspense`만으로는 모듈 로딩 실패를 처리할 수 없습니다.

- `Suspense`: 로딩 중인 상태를 처리합니다.
- `Error Boundary`: 렌더링 과정에서 발생한 오류를 처리합니다.

두 컴포넌트를 함께 사용하면 로딩 상태와 오류 상태를 구분할 수 있습니다.

```tsx
import {
  Component,
  lazy,
  Suspense,
  type PropsWithChildren,
} from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return <p>Failed to load Dashboard.</p>;
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>Loading Dashboard...</p>}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

위 구조에서는 다음과 같이 동작합니다.

1. `Dashboard`가 로딩 중이면 `Suspense`가 Fallback UI를 표시합니다.
2. 모듈 로딩에 성공하면 `Dashboard`를 렌더링합니다.
3. 모듈 로딩이 실패하면 오류가 Error Boundary로 전달됩니다.
4. Error Boundary는 오류 상태에 해당하는 Fallback UI를 표시합니다.

실제 애플리케이션에서는 Error Boundary에 오류 기록, 재시도 UI 및 사용자 안내 기능을 추가할 수 있습니다.

### 7.2. 동적 Import 실패와 재시도

`lazy()`는 최초 로딩 과정에서 Promise와 그 결과를 캐시합니다.

따라서 로딩 Promise가 Reject된 경우 동일한 Lazy Component를 다시 렌더링하는 것만으로 새로운 Import 요청이 발생한다고 보장할 수 없습니다.

재시도 동작이 필요하다면 다음 사항을 고려해야 합니다.

- Error Boundary의 오류 상태를 초기화하는 기능을 제공합니다.
- 재시도 시 새로운 Lazy Component 타입을 생성하는 전략을 검토합니다.
- 번들러와 브라우저의 모듈 로딩 및 캐시 동작을 확인합니다.
- 네트워크 오류와 배포된 청크 파일의 부재를 구분하여 처리합니다.

특히 애플리케이션이 새 버전으로 배포된 직후 사용자의 브라우저가 이전 HTML이나 JavaScript를 참조하면 이전 버전에서 생성된 청크 파일을 요청하여 로딩에 실패할 수 있습니다.

이러한 상황을 고려하여 배포 시점의 캐시 정책과 청크 파일의 제공 전략도 함께 설계해야 합니다.

## 8. Lazy Component 선언 위치

### 8.1. 컴포넌트 외부에서 선언

`lazy()`로 생성한 컴포넌트는 모듈의 최상위 수준에서 선언해야 합니다.

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

### 8.2. 컴포넌트 내부에서 선언하면 안 되는 이유

다음과 같이 다른 컴포넌트 내부에서 `lazy()`를 호출하는 방식은 피해야 합니다.

```tsx
import { lazy, Suspense } from 'react';

export default function App() {
  const Dashboard = lazy(() => import('./Dashboard'));

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}
```

이 구조에서는 `App`이 다시 렌더링될 때마다 새로운 Lazy Component 타입이 생성됩니다.

React는 컴포넌트 타입의 변경을 서로 다른 컴포넌트로 판단할 수 있으므로 기존 하위 컴포넌트가 언마운트되고 새 컴포넌트가 마운트될 수 있습니다.

그 결과 하위 컴포넌트의 State가 초기화되거나 불필요한 재마운트가 발생할 수 있습니다.

따라서 Lazy Component는 컴포넌트 외부에서 한 번 선언하고 재사용해야 합니다.

## 9. Suspense와 Transition

Lazy Component를 사용하면 특정 기능을 처음 로딩할 때 Fallback UI가 표시됩니다.

하지만 이미 화면에 표시된 콘텐츠를 새로운 화면으로 전환하는 과정에서 Fallback UI가 갑자기 나타나면 사용자 경험이 저하될 수 있습니다.

React의 Transition API를 사용하면 이러한 화면 전환을 비긴급 업데이트로 처리할 수 있습니다.

```tsx
import {
  lazy,
  Suspense,
  useState,
  useTransition,
} from 'react';

const Dashboard = lazy(() => import('./Dashboard'));
const Reports = lazy(() => import('./Reports'));

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'reports'>(
    'dashboard'
  );

  const [isPending, startTransition] = useTransition();

  function navigate(nextPage: 'dashboard' | 'reports') {
    startTransition(() => {
      setPage(nextPage);
    });
  }

  return (
    <main>
      <nav>
        <button onClick={() => navigate('dashboard')}>
          Dashboard
        </button>

        <button onClick={() => navigate('reports')}>
          Reports
        </button>
      </nav>

      {isPending && <span>Updating...</span>}

      <Suspense fallback={<p>Loading Page...</p>}>
        {page === 'dashboard' ? <Dashboard /> : <Reports />}
      </Suspense>
    </main>
  );
}
```

`startTransition()`으로 표시한 State 업데이트가 Suspend되면 React는 이미 표시된 콘텐츠를 즉시 Fallback UI로 교체하는 대신 새로운 콘텐츠가 준비될 때까지 기존 UI를 유지할 수 있습니다.

이때 `isPending`을 활용하면 전환이 진행 중이라는 사실을 별도로 표시할 수 있습니다.

Transition은 로딩 시간을 단축하는 기능이 아니라, 비동기적으로 준비되는 UI를 전환하는 동안 기존 화면을 유지하여 사용자 경험을 개선하는 기능입니다.

## 10. Lazy Loading 적용 전략

Lazy Loading은 모든 컴포넌트에 적용하기보다 초기 로딩 비용과 실제 사용 시점을 고려하여 선택적으로 적용해야 합니다.

### 10.1. 적용하기 적합한 대상

다음과 같은 컴포넌트는 Lazy Loading을 적용하기 적합합니다.

- **라우트 단위 페이지**: 사용자가 특정 경로에 접근할 때만 필요한 페이지 컴포넌트
- **대형 모달**: 버튼을 클릭해야 표시되는 복잡한 모달
- **에디터**: Markdown Editor, Rich Text Editor 등 무거운 편집 기능
- **차트 및 데이터 시각화**: 초기 화면에서는 필요하지 않은 차트 라이브러리
- **관리자 기능**: 일반 사용자가 접근하지 않는 관리 화면
- **고급 설정 기능**: 사용 빈도가 낮은 추가 설정 UI

이러한 기능은 초기 화면을 구성하는 데 필수적이지 않으므로 별도 청크로 분리했을 때 초기 번들 크기를 줄이는 데 도움이 될 수 있습니다.

### 10.2. 적용을 신중하게 검토해야 하는 대상

다음과 같은 컴포넌트는 Lazy Loading 적용을 신중하게 검토해야 합니다.

- **초기 화면의 핵심 컴포넌트**: 페이지가 표시되기 위해 반드시 필요한 컴포넌트
- **작은 공통 컴포넌트**: 코드 크기가 작아 별도 청크로 분리할 실익이 적은 컴포넌트
- **즉시 사용되는 핵심 UI**: 사용자가 페이지에 접근하자마자 사용해야 하는 기능
- **빈번하게 접근하는 컴포넌트**: 별도 청크 로딩으로 인해 반복적인 화면 전환 지연이 발생할 수 있는 기능

특히 초기 화면에 필요한 컴포넌트를 무조건 Lazy Loading으로 처리하면 초기 번들 크기는 감소하더라도 추가 네트워크 요청으로 인해 실제 콘텐츠 표시가 늦어질 수 있습니다.

### 10.3. 라우트 단위 코드 분할

라우트 단위 Code Splitting은 Lazy Loading의 대표적인 활용 사례입니다.

```tsx
import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading Page...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

위 구조에서는 각 페이지를 별도 모듈로 분리하고 해당 페이지가 렌더링되는 시점에 코드를 로딩할 수 있습니다.

다만 실제 라우팅 애플리케이션에서는 라우터가 제공하는 Lazy Loading 및 데이터 사전 로딩 기능을 함께 검토하는 것이 좋습니다.

라우터 차원의 사전 로딩을 활용하면 페이지 전환이 시작된 이후에야 필요한 코드를 요청하는 상황을 줄일 수 있습니다.

## 11. Lazy Loading과 성능 최적화

### 11.1. 초기 번들 크기 감소

Lazy Loading의 가장 직접적인 효과는 초기 번들에 포함되는 JavaScript 코드의 양을 줄이는 것입니다.

초기 번들이 작아지면 다음 작업의 부담을 줄이는 데 도움이 될 수 있습니다.

- JavaScript 다운로드
- JavaScript 파싱
- 코드 컴파일 및 실행
- 초기 React 애플리케이션 구동

다만 실제 성능 개선 여부는 네트워크 환경, 캐시 상태, 코드 크기, 청크 분할 방식 등에 따라 달라집니다.

### 11.2. Network Waterfall 주의

Lazy Loading은 필요한 시점에 코드를 요청한다는 특성이 있으므로 요청 시점이 늦어질 수 있습니다.

예를 들어 다음과 같은 상황을 고려할 수 있습니다.

1. 사용자가 페이지에 접근합니다.
2. 페이지의 JavaScript 코드가 로딩됩니다.
3. 페이지가 렌더링됩니다.
4. 하위 컴포넌트가 Lazy Component를 렌더링하려고 시도합니다.
5. 해당 컴포넌트의 JavaScript 청크를 요청합니다.
6. 다운로드가 완료된 후 실제 UI를 표시합니다.

이처럼 필요한 코드의 요청이 늦어지면 화면 표시까지 추가적인 대기 시간이 발생할 수 있습니다.

이를 Network Waterfall이라고 하며, 특히 라우트 전환이나 여러 단계로 이어지는 데이터 및 코드 요청에서 문제가 될 수 있습니다.

성능이 중요한 페이지에서는 다음과 같은 전략을 고려할 수 있습니다.

- 라우터의 사전 로딩 기능 활용
- 사용자 상호작용을 기반으로 한 코드 사전 로딩
- 초기 화면에 필요한 코드와 지연 로딩 대상의 구분
- 번들 분석 도구를 이용한 청크 크기 확인
- 네트워크 요청 순서와 로딩 시간 측정

### 11.3. 번들 분석

Lazy Loading을 적용한 이후에는 실제 빌드 결과를 확인해야 합니다.

다음 항목을 중심으로 분석할 수 있습니다.

- 초기 JavaScript 번들 크기
- 분리된 청크의 개수와 크기
- 특정 기능 접근 시 발생하는 추가 요청
- 중복 의존성의 포함 여부
- 청크 다운로드 및 실행 시간

Vite나 Webpack과 같은 번들러에서 제공하는 분석 기능 또는 별도의 Bundle Analyzer를 활용하면 코드 분할이 의도대로 적용되었는지 확인할 수 있습니다.

## 12. 주의사항

Lazy Components를 사용할 때는 다음 사항을 고려해야 합니다.

1. **Lazy Component는 모듈 최상위에서 선언해야 합니다.** 컴포넌트 내부에서 선언하면 렌더링마다 새로운 컴포넌트 타입이 생성되어 State가 초기화될 수 있습니다.
2. **동적 Import는 Promise를 반환해야 합니다.** `lazy()`는 Promise 또는 Thenable을 반환하는 로딩 함수를 요구합니다.
3. **기본 Export 형식을 확인해야 합니다.** `lazy()`는 동적 Import 결과의 `default` 속성을 컴포넌트로 사용합니다.
4. **Suspense Boundary를 지정해야 합니다.** Lazy Component가 로딩 중일 때 표시할 Fallback UI가 필요합니다.
5. **로딩 오류는 Error Boundary로 처리해야 합니다.** Suspense는 로딩 중인 상태를 관리하지만 모듈 로딩 실패를 직접 처리하지 않습니다.
6. **모든 컴포넌트에 적용하지 않아야 합니다.** 코드 분할에 따른 초기 번들 감소 효과와 추가 네트워크 요청에 따른 비용을 함께 고려해야 합니다.
7. **라우터의 사전 로딩 기능을 검토해야 합니다.** 페이지 전환 이후에 코드 다운로드가 시작되는 구조는 Network Waterfall을 유발할 수 있습니다.
8. **모듈 캐시와 컴포넌트 State를 구분해야 합니다.** 모듈이 캐시되어 있더라도 컴포넌트가 언마운트되었다가 다시 마운트되면 로컬 State는 초기화될 수 있습니다.
9. **데이터 페칭과 코드 로딩을 구분해야 합니다.** `lazy()`는 컴포넌트 코드의 로딩을 지연하며 데이터 요청을 자동으로 처리하지 않습니다. 데이터 로딩에 Suspense를 활용하려면 이를 지원하는 프레임워크나 데이터 소스가 필요합니다.

## 13. 정리

Lazy Components는 React의 `lazy()` API와 동적 `import()`를 이용하여 컴포넌트 코드를 필요한 시점까지 로딩하지 않는 기법입니다.

`lazy()`는 동적 Import가 반환하는 Promise를 기반으로 컴포넌트를 지연 로딩하며, 로딩이 완료되기 전까지 렌더링을 일시 중단합니다.

`Suspense`는 이러한 로딩 상태를 감지하여 Fallback UI를 표시하고, 컴포넌트가 준비되면 실제 콘텐츠를 렌더링합니다.

또한 Suspense는 데이터 로딩과 같은 비동기 작업의 대기 상태를 표현하는 데에도 사용할 수 있지만, 데이터 요청 자체를 수행하지는 않습니다. 데이터 로딩을 Suspense와 통합하려면 해당 동작을 지원하는 프레임워크나 데이터 소스를 사용해야 합니다.

주요 개념은 다음과 같습니다.

| 개념 | 역할 |
| --- | --- |
| `import()` | 모듈을 비동기적으로 로딩합니다. |
| Code Splitting | 애플리케이션 코드를 여러 청크로 분리합니다. |
| `lazy()` | 컴포넌트 코드의 로딩을 실제 렌더링 시점까지 지연합니다. |
| `Suspense` | 하위 컴포넌트가 Suspend되었을 때 Fallback UI를 표시합니다. |
| Error Boundary | Lazy Component의 모듈 로딩 실패와 같은 렌더링 오류를 처리합니다. |
| Transition | 비동기적으로 준비되는 UI의 전환 과정에서 기존 콘텐츠를 유지하도록 돕습니다. |

Lazy Loading은 초기 번들 크기를 줄이고 필요한 기능만 선택적으로 로딩할 수 있도록 지원합니다. 다만 추가 네트워크 요청과 로딩 지연이 발생할 수 있으므로, 컴포넌트의 크기와 사용 빈도, 초기 화면의 중요도 및 사용자 경험을 종합적으로 고려하여 적용해야 합니다.

## 참고자료

- [React 공식 문서 - lazy](https://react.dev/reference/react/lazy)
- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - useTransition](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - Component (Error Boundary)](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React 공식 문서 - Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [React 공식 문서 - You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Router 공식 문서 - Data Loading](https://reactrouter.com/start/framework/data-loading)
- [Next.js 공식 문서 - Lazy Loading](https://nextjs.org/docs/app/guides/lazy-loading)
- [TypeScript 공식 문서 - Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [MDN - import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)