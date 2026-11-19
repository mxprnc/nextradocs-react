# Code Splitting

## 1. Code Splitting이란?

Code Splitting은 애플리케이션의 JavaScript 코드를 여러 개의 독립적인 청크(Chunk)로 분리하는 기법입니다.

일반적인 번들링 환경에서는 애플리케이션의 여러 모듈을 하나 이상의 JavaScript 번들로 결합합니다. 애플리케이션 규모가 커지면 초기 화면을 표시하는 데 필요하지 않은 기능의 코드까지 초기 번들에 포함될 수 있습니다.

Code Splitting을 적용하면 코드를 기능이나 라우트 단위로 분리하고, 실제로 필요한 시점에 해당 청크를 다운로드하도록 구성할 수 있습니다.

예를 들어 다음과 같은 애플리케이션을 생각할 수 있습니다.

- 메인 페이지
- 사용자 설정 페이지
- 관리자 대시보드
- 통계 및 차트 페이지

모든 페이지의 코드를 초기 번들에 포함하는 대신 각 페이지의 코드를 별도의 청크로 분리하면 사용자가 특정 페이지에 접근할 때 해당 페이지의 코드만 로드할 수 있습니다.

### 주요 목적

- **초기 번들 크기 감소**: 초기 화면에 필요하지 않은 코드를 초기 다운로드에서 제외합니다.
- **초기 로딩 성능 개선**: 다운로드 및 JavaScript 파싱·컴파일에 필요한 작업량을 줄일 수 있습니다.
- **필요한 코드의 지연 로딩**: 사용자가 특정 기능에 접근하는 시점에 관련 코드를 로드합니다.
- **캐싱 효율 개선**: 변경되지 않은 청크를 독립적으로 캐싱하여 불필요한 재다운로드를 줄일 수 있습니다.

Code Splitting은 초기 로딩 성능을 개선하는 데 유용하지만, 분리된 청크를 다운로드하는 추가 네트워크 요청이 발생할 수 있습니다. 따라서 청크의 크기와 분리 기준을 적절하게 설계해야 합니다.

## 2. Static Import와 Dynamic Import

JavaScript에서는 모듈을 불러오는 방식에 따라 Static Import와 Dynamic Import를 구분할 수 있습니다.

### Static Import

Static Import는 모듈을 정적으로 가져오는 방식입니다.

```tsx
import { Dashboard } from './Dashboard';

function App() {
  return <Dashboard />;
}

export default App;
```

정적 Import는 모듈 간 의존성을 빌드 시점에 파악할 수 있도록 합니다.

일반적인 번들러는 정적 Import를 기반으로 모듈 의존성 그래프를 구성하고, 이를 번들링합니다.

별도의 분할 지점이 없다면 해당 모듈은 이를 참조하는 번들에 포함될 수 있습니다.

### Dynamic Import

Dynamic Import는 `import()` 함수를 사용하여 모듈을 비동기적으로 가져오는 방식입니다.

```tsx
async function loadDashboard() {
  const module = await import('./Dashboard');

  return module.Dashboard;
}
```

`import()`는 모듈을 비동기적으로 로드하고 Promise를 반환합니다.

번들러는 Dynamic Import를 Code Splitting의 기준으로 활용하여 해당 모듈을 별도의 청크로 생성할 수 있습니다.

다음과 같이 사용자 이벤트가 발생했을 때 모듈을 로드하도록 구성할 수도 있습니다.

```tsx
function App() {
  const handleOpenDashboard = async () => {
    const module = await import('./Dashboard');

    // 로드한 모듈을 활용하는 로직
    console.log(module.Dashboard);
  };

  return (
    <button onClick={handleOpenDashboard}>
      대시보드 모듈 로드
    </button>
  );
}
```

Dynamic Import 자체가 모든 환경에서 반드시 별도 파일을 생성한다는 의미는 아닙니다. 실제 청크 분할 여부와 생성 방식은 Vite, Webpack 등의 번들러 설정과 빌드 결과에 따라 달라집니다.

## 3. React.lazy

React는 `lazy` 함수를 제공하여 컴포넌트를 동적으로 로드할 수 있도록 지원합니다.

`React.lazy`는 Dynamic Import와 Suspense를 결합하여 컴포넌트의 코드가 필요한 시점에 로드되도록 구성할 때 사용합니다.

### 기본 사용법

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(
  () => import('./Dashboard')
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}

export default App;
```

`lazy`는 컴포넌트를 반환하는 Promise를 인자로 받습니다.

```tsx
const Dashboard = lazy(
  () => import('./Dashboard')
);
```

이 코드는 `./Dashboard` 모듈을 동적으로 불러옵니다.

React는 해당 모듈이 로드되기 전까지 컴포넌트의 렌더링을 중단하고, 가장 가까운 Suspense 경계에 지정된 Fallback UI를 표시합니다.

모듈 로딩이 완료되면 React는 해당 컴포넌트를 렌더링합니다.

### 컴포넌트 정의 위치

`lazy`로 생성한 컴포넌트는 컴포넌트 외부의 모듈 최상위 영역에서 선언하는 것이 권장됩니다.

```tsx
import { lazy, Suspense } from 'react';

// 모듈 최상위에서 선언
const Dashboard = lazy(
  () => import('./Dashboard')
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

다음과 같이 컴포넌트 내부에서 매번 `lazy`를 호출하는 방식은 피해야 합니다.

```tsx
function App() {
  // 권장하지 않는 방식
  const Dashboard = lazy(
    () => import('./Dashboard')
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

컴포넌트 내부에서 `lazy`를 호출하면 렌더링할 때마다 새로운 컴포넌트 타입이 생성될 수 있습니다. 이로 인해 기존 컴포넌트의 State가 초기화되는 등 의도하지 않은 동작이 발생할 수 있습니다.

따라서 Lazy Component는 모듈 최상위에서 선언해야 합니다.

## 4. Suspense와 Loading UI

Suspense는 하위 트리의 렌더링이 완료될 때까지 Fallback UI를 표시하는 React 컴포넌트입니다.

Code Splitting에서는 Lazy Component의 코드가 아직 로드되지 않은 상태를 처리하는 데 사용합니다.

### 기본 구조

```tsx
import { lazy, Suspense } from 'react';

const UserProfile = lazy(
  () => import('./UserProfile')
);

function App() {
  return (
    <div>
      <h1>사용자 페이지</h1>

      <Suspense fallback={<p>사용자 정보를 불러오는 중입니다.</p>}>
        <UserProfile />
      </Suspense>
    </div>
  );
}
```

`Suspense`의 `fallback`에는 로딩 중 표시할 React Node를 지정합니다.

Fallback UI는 일반적인 텍스트뿐 아니라 Spinner, Skeleton UI 등의 컴포넌트로 구성할 수 있습니다.

```tsx
function LoadingSpinner() {
  return <div className="spinner">Loading...</div>;
}
```

```tsx
function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <UserProfile />
    </Suspense>
  );
}
```

### Suspense 경계의 위치

Suspense는 하위 트리에서 Suspense를 지원하는 작업이 대기 상태가 되었을 때 가장 가까운 Suspense 경계를 기준으로 Fallback UI를 표시합니다.

따라서 Suspense의 위치에 따라 로딩 UI가 적용되는 범위가 달라집니다.

다음 예제에서는 페이지 전체를 하나의 Suspense 경계로 감쌉니다.

```tsx
function App() {
  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <Header />
      <UserProfile />
      <Dashboard />
    </Suspense>
  );
}
```

이 구조에서는 하위 트리의 렌더링이 대기 상태가 되면 해당 Suspense 경계의 Fallback UI가 표시될 수 있습니다.

반면 기능별로 Suspense 경계를 분리하면 로딩 상태를 독립적으로 관리할 수 있습니다.

```tsx
function App() {
  return (
    <>
      <Header />

      <Suspense fallback={<div>프로필 로딩 중...</div>}>
        <UserProfile />
      </Suspense>

      <Suspense fallback={<div>대시보드 로딩 중...</div>}>
        <Dashboard />
      </Suspense>
    </>
  );
}
```

Suspense 경계는 로딩 상태를 사용자에게 어떤 단위로 보여줄 것인지에 따라 배치해야 합니다.

## 5. Named Export와 Lazy Loading

`React.lazy`는 기본적으로 Dynamic Import의 결과에서 `default` Export를 사용합니다.

따라서 다음과 같은 Default Export 구조는 별도의 변환 없이 사용할 수 있습니다.

```tsx
// Dashboard.tsx

export default function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

```tsx
// App.tsx

import { lazy } from 'react';

const Dashboard = lazy(
  () => import('./Dashboard')
);
```

반면 Named Export만 제공하는 모듈은 `React.lazy`가 기대하는 형태로 변환해야 합니다.

```tsx
// Dashboard.tsx

export function Dashboard() {
  return <h1>Dashboard</h1>;
}
```

이 경우 `then()`을 사용하여 Named Export를 Default Export 형태로 변환할 수 있습니다.

```tsx
import { lazy } from 'react';

const Dashboard = lazy(
  () =>
    import('./Dashboard').then((module) => ({
      default: module.Dashboard,
    }))
);
```

이 방식은 기존 모듈의 Export 구조를 변경하지 않고 Lazy Loading을 적용할 수 있다는 장점이 있습니다.

## 6. Route-based Code Splitting

Route-based Code Splitting은 애플리케이션의 페이지 또는 라우트 단위로 코드를 분리하는 방식입니다.

일반적으로 사용자가 모든 페이지를 한 번에 방문하지 않으므로 라우트 단위의 Code Splitting은 초기 번들 크기를 줄이는 데 효과적입니다.

React Router를 사용하는 경우 각 라우트의 컴포넌트를 Lazy Loading하도록 구성할 수 있습니다.

### React Router와 React.lazy

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

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>페이지 로딩 중...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
```

각 페이지 컴포넌트는 해당 라우트가 렌더링될 때 필요한 코드를 로드합니다.

이 구조에서는 초기 진입 페이지에 필요한 코드와 다른 페이지의 코드를 분리할 수 있습니다.

### React Router의 Lazy Route

React Router는 라우트 모듈을 Lazy Loading하는 기능도 제공합니다.

Data Router API를 사용하는 경우 `lazy` 속성을 이용하여 라우트의 Component, Loader, Action 등의 구현을 동적으로 가져올 수 있습니다.

```tsx
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    lazy: () => import('./routes/home'),
  },
  {
    path: '/dashboard',
    lazy: () => import('./routes/dashboard'),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

라우트 모듈은 React Router가 기대하는 라우트 속성을 Export해야 합니다.

```tsx
// routes/dashboard.tsx

export function Component() {
  return <h1>Dashboard</h1>;
}
```

React Router의 `lazy`는 React의 `React.lazy`와 다른 API입니다.

- `React.lazy`: React 컴포넌트를 동적으로 로드합니다.
- React Router의 `lazy`: 라우트 구현을 동적으로 로드합니다.

라우팅 라이브러리에서 제공하는 Lazy Loading 기능을 활용하면 라우트 단위의 코드 분할과 라우트 관련 구현을 함께 관리할 수 있습니다.

## 7. Component-based Code Splitting

Component-based Code Splitting은 특정 페이지 전체가 아니라 기능이나 컴포넌트 단위로 코드를 분리하는 방식입니다.

다음과 같은 기능은 초기 화면에서 반드시 필요하지 않을 수 있습니다.

- 복잡한 차트 및 데이터 시각화
- Markdown Editor
- 코드 에디터
- 관리자 전용 기능
- 대용량 이미지 편집 기능
- 모달 내부의 복잡한 콘텐츠

이러한 기능은 실제로 사용자가 접근하는 시점에 로드하도록 구성할 수 있습니다.

### 조건부 Lazy Loading

```tsx
import { lazy, Suspense, useState } from 'react';

const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <section>
      <h1>Dashboard</h1>

      <button onClick={() => setShowChart(true)}>
        차트 보기
      </button>

      {showChart && (
        <Suspense fallback={<div>차트 로딩 중...</div>}>
          <Chart />
        </Suspense>
      )}
    </section>
  );
}
```

차트 컴포넌트는 `showChart`가 `true`가 되어 실제로 렌더링을 시도할 때 로드됩니다.

이 방식은 초기 화면에서 사용하지 않는 무거운 기능의 코드를 초기 다운로드에서 제외할 수 있습니다.

## 8. Error Boundary와 Lazy Loading 실패 처리

Lazy Loading은 네트워크 오류, 청크 다운로드 실패, 모듈 평가 오류 등의 이유로 실패할 수 있습니다.

`React.lazy`로 불러온 모듈의 로딩 Promise가 Reject되면 React는 해당 오류를 가장 가까운 Error Boundary로 전달합니다.

Suspense는 로딩 중인 상태를 처리하지만 오류 자체를 처리하지는 않습니다.

따라서 Lazy Loading을 안정적으로 구성하려면 Suspense와 Error Boundary를 함께 사용하는 것이 좋습니다.

```tsx
import {
  Component,
  lazy,
  Suspense,
  type ErrorInfo,
  type ReactNode,
} from 'react';

const Dashboard = lazy(
  () => import('./Dashboard')
);

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
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

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('컴포넌트 로딩 오류:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div>페이지를 불러오지 못했습니다.</div>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

각 컴포넌트의 역할은 다음과 같습니다.

| 구성 요소 | 역할 |
|---|---|
| `React.lazy` | 컴포넌트를 동적으로 로드합니다. |
| `Suspense` | 컴포넌트 로딩 중 Fallback UI를 표시합니다. |
| `ErrorBoundary` | 하위 컴포넌트에서 발생한 렌더링 오류를 처리합니다. |

실제 서비스에서는 오류 로깅, 재시도 버튼, 페이지 이동 등의 복구 전략을 함께 고려해야 합니다.

## 9. Code Splitting과 Preloading

Code Splitting을 적용하면 초기 번들 크기를 줄일 수 있지만, 사용자가 특정 기능에 접근한 후에야 코드를 다운로드하면 해당 기능의 첫 실행이 지연될 수 있습니다.

이러한 지연을 줄이기 위해 Preloading 또는 Prefetching 전략을 사용할 수 있습니다.

- **Preloading**: 가까운 시점에 필요할 가능성이 높은 리소스를 미리 로드합니다.
- **Prefetching**: 현재 시점에는 필요하지 않지만 이후에 필요할 가능성이 있는 리소스를 브라우저의 유휴 시간 등에 미리 가져오도록 요청합니다.

예를 들어 사용자가 대시보드 진입 버튼에 마우스를 올렸을 때 관련 모듈을 미리 다운로드하도록 구성할 수 있습니다.

```tsx
import { useState } from 'react';

function DashboardLink() {
  const [isLoading, setIsLoading] = useState(false);

  const preloadDashboard = () => {
    void import('./Dashboard');
  };

  const handleNavigate = async () => {
    setIsLoading(true);

    try {
      const module = await import('./Dashboard');

      // 라우팅 또는 화면 전환 로직에서 module을 활용합니다.
      console.log(module);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onMouseEnter={preloadDashboard}
      onFocus={preloadDashboard}
      onClick={handleNavigate}
      disabled={isLoading}
    >
      대시보드 이동
    </button>
  );
}
```

위 예제에서는 버튼에 마우스를 올리거나 키보드 포커스가 이동했을 때 모듈을 미리 로드합니다.

동일한 모듈을 다시 `import()`하더라도 모듈 시스템과 번들러의 캐싱 동작에 따라 이미 로드된 모듈을 재사용할 수 있습니다.

다만 모든 기능을 미리 로드하면 초기 다운로드를 줄이려는 Code Splitting의 효과가 감소할 수 있습니다. 사용자 행동과 접근 가능성을 고려하여 필요한 모듈만 선택적으로 Preload하는 것이 좋습니다.

## 10. Code Splitting의 한계와 주의사항

### 10.1 청크 분할에 따른 추가 네트워크 요청

코드를 여러 청크로 분리하면 초기 다운로드 크기를 줄일 수 있지만, 필요한 청크를 추가로 요청해야 합니다.

특히 네트워크 환경이 좋지 않은 경우 Lazy Loading된 컴포넌트의 첫 렌더링이 지연될 수 있습니다.

따라서 지나치게 작은 단위로 코드를 분리하기보다는 기능과 사용 흐름을 기준으로 적절한 크기의 청크를 구성해야 합니다.

### 10.2 공통 의존성 중복 방지

여러 청크에서 동일한 라이브러리나 모듈을 사용하면 번들러의 설정에 따라 공통 의존성이 별도의 공유 청크로 분리될 수 있습니다.

반대로 청크 분할 전략이 적절하지 않으면 유사한 코드가 여러 청크에 포함될 수도 있습니다.

번들러의 빌드 결과를 분석하여 공통 의존성이 어떻게 분리되었는지 확인해야 합니다.

### 10.3 Lazy Loading과 초기 화면

초기 화면을 표시하는 데 반드시 필요한 컴포넌트까지 무조건 Lazy Loading할 필요는 없습니다.

사용자가 페이지에 진입하자마자 확인해야 하는 핵심 콘텐츠를 지연 로드하면 오히려 사용자 경험이 나빠질 수 있습니다.

초기 화면에 필요한 핵심 코드와 나중에 사용되는 부가 기능을 구분하는 것이 중요합니다.

### 10.4 Suspense의 적용 범위

Suspense는 모든 비동기 작업을 자동으로 감지하는 범용 로딩 처리 기능이 아닙니다.

React가 Suspense를 지원하는 렌더링 작업에서 대기 상태가 발생할 때 Fallback UI를 표시합니다.

예를 들어 다음 작업은 Suspense가 자동으로 감지하지 않습니다.

- `useEffect` 내부에서 실행하는 일반적인 비동기 데이터 요청
- 이벤트 핸들러 내부에서 실행하는 비동기 작업
- Suspense와 통합되지 않은 임의의 Promise 기반 작업

따라서 일반적인 데이터 요청의 로딩 상태는 해당 데이터 요청 방식에 맞게 별도로 관리해야 합니다.

### 10.5 청크 배포 및 캐싱 전략

Code Splitting을 적용한 애플리케이션은 초기 번들과 여러 개의 청크로 구성될 수 있습니다.

새로운 버전이 배포되면서 기존 청크 파일이 제거되거나 파일명이 변경되면, 이전 HTML을 사용하는 클라이언트가 존재하지 않는 청크를 요청할 수 있습니다.

이러한 상황을 줄이기 위해 다음 사항을 고려해야 합니다.

- 파일명에 콘텐츠 기반 해시를 적용합니다.
- HTML과 JavaScript 청크의 캐시 정책을 구분합니다.
- 이전 버전의 청크 파일을 일정 기간 유지하는 방안을 검토합니다.
- 청크 로딩 실패 시 사용자에게 오류를 안내하고 복구할 수 있는 방법을 제공합니다.

## 11. Code Splitting 적용 전략

Code Splitting은 애플리케이션의 구조와 사용 패턴에 따라 단계적으로 적용하는 것이 좋습니다.

| 적용 대상 | 분할 기준 | 적용 목적 |
|---|---|---|
| 페이지 | Route-based | 초기 페이지에 필요한 코드만 로드 |
| 무거운 기능 | Component-based | 사용하지 않는 기능의 초기 다운로드 방지 |
| 모달 및 다이얼로그 | 기능 접근 시점 | 초기 화면에서 사용하지 않는 코드 분리 |
| 관리자 기능 | 권한 및 접근 경로 | 일반 사용자에게 불필요한 코드 분리 |
| 대용량 라이브러리 | Dynamic Import | 특정 기능에서만 사용하는 라이브러리 분리 |

일반적으로 다음 순서로 적용할 수 있습니다.

1. 초기 번들에 포함된 모듈과 크기를 분석합니다.
2. 페이지 단위로 분리할 수 있는 영역을 식별합니다.
3. 초기 화면에서 사용하지 않는 무거운 기능을 식별합니다.
4. `React.lazy`와 `Suspense`를 활용하여 Lazy Loading을 적용합니다.
5. 로딩 실패에 대비하여 Error Boundary를 구성합니다.
6. 사용자 접근 패턴에 따라 Preloading 전략을 적용합니다.
7. 빌드 결과와 실제 브라우저 성능을 비교하여 개선 효과를 확인합니다.

## 12. Code Splitting과 관련 개념 비교

| 개념 | 설명 |
|---|---|
| Code Splitting | JavaScript 코드를 여러 청크로 분리하는 빌드 최적화 기법입니다. |
| Dynamic Import | `import()`를 사용하여 모듈을 비동기적으로 로드하는 JavaScript 기능입니다. |
| Lazy Loading | 필요한 시점까지 리소스 로딩을 지연하는 전략입니다. |
| `React.lazy` | Dynamic Import를 기반으로 컴포넌트를 지연 로드하는 React API입니다. |
| `Suspense` | 지원되는 렌더링 작업이 대기 중일 때 Fallback UI를 표시하는 React 컴포넌트입니다. |
| Preloading | 가까운 시점에 필요한 리소스를 미리 로드하는 전략입니다. |
| Prefetching | 이후 필요할 가능성이 있는 리소스를 미리 가져오는 전략입니다. |

Code Splitting은 코드를 분리하는 기법이며, Lazy Loading은 분리된 코드를 필요한 시점에 로드하는 전략입니다. 두 개념은 밀접하게 연관되어 있지만 동일한 의미는 아닙니다.

## 13. 참고 자료

### React 공식 문서

- [React - lazy](https://react.dev/reference/react/lazy)
- [React - Suspense](https://react.dev/reference/react/Suspense)
- [React - Component](https://react.dev/reference/react/Component) - Error Boundary 관련 API

### JavaScript 공식 문서

- [MDN - import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)

### Bundler 공식 문서

- [Vite - Features: Dynamic Import](https://vite.dev/guide/features.html#dynamic-import)
- [Webpack - Code Splitting](https://webpack.js.org/guides/code-splitting/)

### React Router 공식 문서

- [React Router - Lazy Route Discovery](https://reactrouter.com/explanation/lazy-route-discovery)
- [React Router - Route.lazy](https://reactrouter.com/api/components/Route#lazy)

