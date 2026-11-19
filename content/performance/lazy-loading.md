# Lazy Loading

## 1. Lazy Loading이란?

Lazy Loading은 애플리케이션의 리소스를 즉시 로드하지 않고 실제로 필요한 시점까지 로딩을 지연하는 기법입니다.

일반적인 애플리케이션에서는 초기 화면을 구성하는 데 직접 사용되지 않는 리소스도 함께 로드될 수 있습니다. 이러한 리소스가 많아지면 네트워크 요청과 다운로드 용량이 증가하고, 초기 화면을 표시하는 데 필요한 작업이 지연될 수 있습니다.

Lazy Loading을 적용하면 초기 화면에 필요한 리소스를 우선적으로 로드하고, 나머지 리소스는 사용자의 행동이나 화면 진입 등의 조건에 따라 로드할 수 있습니다.

예를 들어 다음과 같은 상황에 적용할 수 있습니다.

- 사용자가 특정 페이지에 접근했을 때 해당 페이지의 컴포넌트를 로드합니다.
- 사용자가 모달을 열었을 때 모달 내부의 복잡한 컴포넌트를 로드합니다.
- 이미지가 화면에 가까워졌을 때 해당 이미지를 다운로드합니다.
- 사용자가 특정 기능을 실행했을 때 관련 라이브러리를 로드합니다.

### 주요 목적

- **초기 로딩 부담 감소**: 초기 화면에 필요하지 않은 리소스의 다운로드를 지연합니다.
- **네트워크 사용량 최적화**: 실제로 사용하지 않는 리소스의 불필요한 다운로드를 줄입니다.
- **리소스 로딩 시점 제어**: 사용자 행동과 화면 상태에 따라 리소스를 로드합니다.
- **사용자 경험 개선**: 초기 화면에 필요한 콘텐츠를 우선적으로 제공할 수 있습니다.

Lazy Loading은 모든 리소스의 로딩을 늦추는 기법이 아닙니다. 초기 화면의 핵심 콘텐츠는 즉시 제공하고, 중요도가 낮거나 나중에 필요한 리소스에 선택적으로 적용해야 합니다.

## 2. Eager Loading과 Lazy Loading

리소스를 로드하는 방식은 크게 Eager Loading과 Lazy Loading으로 구분할 수 있습니다.

### Eager Loading

Eager Loading은 리소스를 필요한 시점보다 미리 로드하는 방식입니다.

```tsx
import Dashboard from './Dashboard';

function App() {
  return <Dashboard />;
}
```

위 예제에서는 `Dashboard`를 정적으로 Import합니다.

일반적인 번들링 환경에서는 해당 모듈이 의존성 그래프에 포함되며, 번들러의 분할 설정에 따라 초기 번들이나 별도 청크에 포함될 수 있습니다.

### Lazy Loading

Lazy Loading은 리소스가 실제로 필요한 시점까지 로딩을 지연하는 방식입니다.

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
```

위 예제에서는 `Dashboard`를 동적으로 Import하고, 컴포넌트가 렌더링될 때 필요한 코드를 로드합니다.

| 구분 | Eager Loading | Lazy Loading |
|---|---|---|
| 로딩 시점 | 초기 또는 사전에 로드 | 실제 사용 시점까지 지연 |
| 초기 다운로드 | 불필요한 리소스가 포함될 수 있음 | 초기 로딩에 필요한 리소스만 우선 로드 |
| 첫 사용 시점 | 이미 로드되어 있다면 즉시 사용 가능 | 추가 다운로드 시간이 발생할 수 있음 |
| 주요 목적 | 즉각적인 리소스 사용 | 리소스 로딩 시점 최적화 |

Eager Loading과 Lazy Loading은 서로 대립하는 방식이 아닙니다. 애플리케이션의 사용 패턴과 리소스 중요도에 따라 함께 적용해야 합니다.

## 3. React.lazy를 활용한 컴포넌트 Lazy Loading

React는 `lazy` 함수를 제공하여 컴포넌트의 코드를 동적으로 로드할 수 있도록 지원합니다.

### 기본 사용법

```tsx
import { lazy, Suspense } from 'react';

const UserProfile = lazy(
  () => import('./UserProfile')
);

function App() {
  return (
    <Suspense fallback={<div>프로필 로딩 중...</div>}>
      <UserProfile />
    </Suspense>
  );
}
```

`lazy`는 컴포넌트를 기본 Export로 제공하는 Promise를 반환하는 함수를 인자로 받습니다.

```tsx
const UserProfile = lazy(
  () => import('./UserProfile')
);
```

실제 컴포넌트 코드가 필요해지면 Dynamic Import가 실행되고, 모듈 로딩이 완료될 때까지 가장 가까운 Suspense 경계가 Fallback UI를 표시합니다.

모듈 로딩이 완료되면 React는 해당 컴포넌트를 정상적으로 렌더링합니다.

### 컴포넌트 정의 위치

Lazy Component는 컴포넌트 내부가 아닌 모듈 최상위 영역에서 선언해야 합니다.

```tsx
// 권장하는 방식
const UserProfile = lazy(
  () => import('./UserProfile')
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
}
```

다음과 같이 컴포넌트 내부에서 선언하면 안 됩니다.

```tsx
function App() {
  // 권장하지 않는 방식
  const UserProfile = lazy(
    () => import('./UserProfile')
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfile />
    </Suspense>
  );
}
```

렌더링 과정에서 새로운 Lazy Component 타입이 생성될 수 있으며, 기존 컴포넌트의 State가 초기화되는 등 의도하지 않은 동작이 발생할 수 있습니다.

### Named Export 처리

`React.lazy`는 기본적으로 Dynamic Import 결과의 `default` Export를 사용합니다.

Named Export만 제공하는 모듈을 사용하는 경우에는 다음과 같이 변환할 수 있습니다.

```tsx
// UserProfile.tsx

export function UserProfile() {
  return <div>User Profile</div>;
}
```

```tsx
// App.tsx

import { lazy } from 'react';

const UserProfile = lazy(
  () =>
    import('./UserProfile').then((module) => ({
      default: module.UserProfile,
    }))
);
```

이 방식은 기존 모듈의 Export 구조를 변경하지 않고 Lazy Loading을 적용할 수 있습니다.

## 4. Suspense를 활용한 로딩 상태 관리

Suspense는 하위 트리에서 Suspense를 지원하는 렌더링 작업이 대기 상태가 되었을 때 Fallback UI를 표시하는 React 컴포넌트입니다.

Lazy Loading에서는 컴포넌트의 코드가 아직 로드되지 않은 상태를 처리하는 데 사용합니다.

### Fallback UI 구성

```tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(
  () => import('./Dashboard')
);

function LoadingFallback() {
  return (
    <div className="loading">
      대시보드를 불러오는 중입니다.
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Dashboard />
    </Suspense>
  );
}
```

Fallback에는 문자열, JSX, Spinner, Skeleton UI 등 React Node를 지정할 수 있습니다.

```tsx
function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-header" />
      <div className="skeleton-content" />
      <div className="skeleton-chart" />
    </div>
  );
}
```

```tsx
function App() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
```

실제 화면과 유사한 구조의 Skeleton UI를 사용하면 콘텐츠가 로드되는 동안 레이아웃의 급격한 변화를 줄일 수 있습니다.

### Suspense 경계 분리

Suspense 경계를 어디에 배치하는지에 따라 로딩 UI가 표시되는 범위가 달라집니다.

페이지 전체를 하나의 경계로 구성하면 하위 컴포넌트 중 하나가 대기 상태가 되었을 때 전체 영역에 Fallback UI가 표시될 수 있습니다.

```tsx
function DashboardPage() {
  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <DashboardHeader />
      <DashboardContent />
      <DashboardSidebar />
    </Suspense>
  );
}
```

반면 기능별로 경계를 분리하면 각 영역의 로딩 상태를 독립적으로 처리할 수 있습니다.

```tsx
function DashboardPage() {
  return (
    <div>
      <DashboardHeader />

      <Suspense fallback={<div>콘텐츠 로딩 중...</div>}>
        <DashboardContent />
      </Suspense>

      <Suspense fallback={<div>사이드바 로딩 중...</div>}>
        <DashboardSidebar />
      </Suspense>
    </div>
  );
}
```

Suspense 경계는 단순히 컴포넌트의 수를 기준으로 나누는 것이 아니라 사용자에게 로딩 상태를 어떤 단위로 보여줄 것인지에 따라 설계해야 합니다.

## 5. 사용자 행동에 따른 Lazy Loading

모든 Lazy Component가 페이지 진입 시점에 로드될 필요는 없습니다.

특정 기능을 사용자가 실제로 실행하는 시점에 렌더링하도록 구성하면 초기 화면에서 불필요한 리소스 다운로드를 줄일 수 있습니다.

### 조건부 렌더링

```tsx
import { lazy, Suspense, useState } from 'react';

const Editor = lazy(() => import('./Editor'));

function ArticlePage() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <section>
      <h1>게시글 작성</h1>

      <button onClick={() => setShowEditor(true)}>
        편집기 열기
      </button>

      {showEditor && (
        <Suspense fallback={<div>편집기 로딩 중...</div>}>
          <Editor />
        </Suspense>
      )}
    </section>
  );
}
```

`showEditor`가 `true`가 되면 `Editor`가 렌더링되고, 이 시점에 필요한 모듈을 로드합니다.

사용자가 편집기를 열지 않는다면 해당 모듈의 로딩을 지연할 수 있습니다.

### 모달과 Lazy Loading

모달 내부에 복잡한 컴포넌트가 포함되어 있다면 모달이 열리는 시점에 해당 컴포넌트를 로드하도록 구성할 수 있습니다.

```tsx
import { lazy, Suspense, useState } from 'react';

const UserDetailModal = lazy(
  () => import('./UserDetailModal')
);

function UserList() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    null
  );

  return (
    <div>
      <button onClick={() => setSelectedUserId('user-1')}>
        사용자 상세 보기
      </button>

      {selectedUserId && (
        <Suspense fallback={<div>모달 로딩 중...</div>}>
          <UserDetailModal
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
```

모달이 실제로 열릴 때만 관련 컴포넌트를 렌더링하므로 초기 페이지 로딩 부담을 줄일 수 있습니다.

## 6. 이미지 Lazy Loading

Lazy Loading은 JavaScript 컴포넌트뿐 아니라 이미지와 같은 정적 리소스에도 적용할 수 있습니다.

이미지가 많은 페이지에서는 화면에 보이지 않는 이미지까지 한 번에 다운로드하지 않도록 구성하는 것이 효과적입니다.

### HTML loading 속성

HTML의 `img` 요소는 `loading` 속성을 지원합니다.

```tsx
function ArticleList() {
  return (
    <div>
      <img
        src="/images/article-1.webp"
        alt="첫 번째 게시글 이미지"
        loading="lazy"
        width={800}
        height={450}
      />

      <img
        src="/images/article-2.webp"
        alt="두 번째 게시글 이미지"
        loading="lazy"
        width={800}
        height={450}
      />
    </div>
  );
}
```

`loading="lazy"`를 지정하면 브라우저가 이미지가 화면에 가까워지는 시점을 고려하여 다운로드를 지연할 수 있습니다.

브라우저가 로딩 시점을 결정하므로 정확한 다운로드 시점을 직접 제어하는 방식은 아닙니다.

### 이미지 크기 지정

이미지에 `width`와 `height`를 지정하면 이미지가 로드되기 전에 레이아웃 공간을 확보할 수 있습니다.

```tsx
<img
  src="/images/article.webp"
  alt="게시글 이미지"
  loading="lazy"
  width={800}
  height={450}
/>
```

이미지 크기를 사전에 지정하면 이미지 로딩으로 인한 레이아웃 이동(Layout Shift)을 줄이는 데 도움이 됩니다.

### 초기 화면의 주요 이미지

초기 화면에서 즉시 표시해야 하는 주요 이미지에는 무조건 Lazy Loading을 적용하지 않는 것이 좋습니다.

특히 LCP(Largest Contentful Paint)에 영향을 주는 대표 이미지나 Hero Image는 우선적으로 로드해야 할 수 있습니다.

```tsx
function HeroSection() {
  return (
    <section>
      <img
        src="/images/hero.webp"
        alt="서비스 대표 이미지"
        fetchPriority="high"
        width={1200}
        height={600}
      />
    </section>
  );
}
```

`fetchPriority="high"`는 브라우저에 해당 리소스의 우선순위가 높다는 힌트를 제공합니다.

반면 화면 아래쪽에 위치한 이미지에는 `loading="lazy"`를 적용할 수 있습니다.

```tsx
function ArticleSection() {
  return (
    <section>
      <h2>관련 콘텐츠</h2>

      <img
        src="/images/article.webp"
        alt="관련 콘텐츠 이미지"
        loading="lazy"
        width={800}
        height={450}
      />
    </section>
  );
}
```

이미지 Lazy Loading은 초기 화면의 핵심 콘텐츠를 지연시키지 않도록 적용해야 합니다.

## 7. Intersection Observer를 활용한 Lazy Loading

`Intersection Observer`는 특정 요소가 다른 요소 또는 Viewport와 교차하는 상태를 비동기적으로 관찰하는 브라우저 API입니다.

이를 활용하면 사용자가 특정 콘텐츠에 접근하는 시점에 컴포넌트를 렌더링하거나 데이터를 요청할 수 있습니다.

### 기본 동작 원리

1. 관찰할 DOM 요소를 지정합니다.
2. Intersection Observer가 해당 요소의 교차 상태를 관찰합니다.
3. 요소가 지정한 조건에 도달하면 Callback이 실행됩니다.
4. 필요한 리소스를 로드하거나 컴포넌트를 렌더링합니다.

### React Hook 구현

```tsx
import {
  useEffect,
  useRef,
  useState,
} from 'react';

function useIntersectionObserver(
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return {
    targetRef,
    isIntersecting,
  };
}
```

이 Hook은 지정한 DOM 요소의 교차 상태를 추적합니다.

### Lazy Component에 적용

```tsx
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function ChartSection() {
  const { targetRef, isIntersecting } =
    useIntersectionObserver({
      rootMargin: '200px',
      threshold: 0,
    });

  return (
    <section ref={targetRef}>
      {isIntersecting && (
        <Suspense fallback={<div>차트 로딩 중...</div>}>
          <HeavyChart />
        </Suspense>
      )}
    </section>
  );
}
```

이 예제에서는 관찰 대상이 Viewport에 가까워지면 `HeavyChart`를 렌더링합니다.

`rootMargin`을 사용하면 실제로 화면에 진입하기 전에 미리 로드를 시작할 수 있습니다.

예를 들어 `rootMargin: '200px'`는 관찰 영역을 상하좌우로 확장하여 요소가 실제 Viewport에 진입하기 전에도 교차 상태가 발생하도록 합니다.

### 관찰 이후 중단

한 번 로드한 콘텐츠를 다시 관찰할 필요가 없다면 교차 상태가 확인된 이후 관찰을 중단할 수 있습니다.

```tsx
import {
  useEffect,
  useRef,
  useState,
} from 'react';

function useOnceIntersection(
  options?: IntersectionObserverInit
) {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    const target = targetRef.current;

    if (!target || hasIntersected) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      options
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasIntersected, options]);

  return {
    targetRef,
    hasIntersected,
  };
}
```

이 방식은 특정 콘텐츠를 최초로 화면에 표시할 때만 로드하는 경우에 적합합니다.

## 8. Lazy Loading과 데이터 요청

Lazy Loading은 컴포넌트 코드뿐 아니라 데이터 요청에도 적용할 수 있습니다.

예를 들어 특정 탭을 선택했을 때만 해당 탭에 필요한 데이터를 요청하도록 구성할 수 있습니다.

```tsx
import { useState } from 'react';

interface User {
  id: number;
  name: string;
}

function UserTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadUsers = async () => {
    if (isLoaded || isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users');

      if (!response.ok) {
        throw new Error('사용자 목록을 불러오지 못했습니다.');
      }

      const data: User[] = await response.json();

      setUsers(data);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <button onClick={loadUsers}>
        사용자 목록 불러오기
      </button>

      {isLoading && <p>데이터 로딩 중...</p>}

      {users.map((user) => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </section>
  );
}
```

위 예제에서는 사용자가 버튼을 클릭했을 때 데이터를 요청합니다.

`isLoaded`와 `isLoading`을 확인하여 이미 요청이 완료되었거나 진행 중인 경우 중복 요청을 방지합니다.

실제 서비스에서는 다음 사항도 고려해야 합니다.

- 요청 실패 시 재시도 정책
- 컴포넌트가 사라진 이후의 요청 처리
- 중복 요청 및 동시 요청 제어
- 데이터 캐싱과 만료 정책
- 페이지네이션 및 Infinite Scroll과의 연계

데이터 요청에 Lazy Loading을 적용할 때는 단순히 요청 시점만 지연하는 것이 아니라 요청 상태와 캐싱 전략까지 함께 설계해야 합니다.

## 9. Lazy Loading과 Preloading

Lazy Loading은 리소스의 로딩을 지연하지만, 사용자가 실제로 기능을 실행한 이후에 다운로드가 시작되면 해당 기능을 처음 사용하는 시점에 지연이 발생할 수 있습니다.

이러한 문제를 줄이기 위해 Preloading과 Prefetching을 함께 활용할 수 있습니다.

### Preloading

Preloading은 가까운 시점에 필요할 가능성이 높은 리소스를 미리 로드하는 전략입니다.

예를 들어 사용자가 특정 페이지로 이동할 가능성이 높아졌을 때 해당 페이지의 코드를 미리 다운로드할 수 있습니다.

```tsx
function DashboardLink() {
  const preloadDashboard = () => {
    void import('./Dashboard');
  };

  return (
    <button
      onMouseEnter={preloadDashboard}
      onFocus={preloadDashboard}
    >
      대시보드
    </button>
  );
}
```

사용자가 버튼에 마우스를 올리거나 키보드 포커스를 이동하면 모듈을 미리 로드합니다.

### Prefetching

Prefetching은 현재 당장 필요하지 않지만 이후에 사용될 가능성이 있는 리소스를 미리 가져오는 전략입니다.

예를 들어 브라우저가 유휴 상태일 때 다음 페이지의 리소스를 미리 다운로드하도록 구성할 수 있습니다.

다만 실제 적용 방식은 사용하는 번들러와 브라우저의 리소스 힌트 지원 여부에 따라 달라집니다.

### 적용 시 주의사항

Lazy Loading과 Preloading은 서로 보완적인 전략입니다.

- 초기 화면에서 사용하지 않는 리소스는 Lazy Loading합니다.
- 사용자가 접근할 가능성이 높은 리소스는 적절한 시점에 Preload합니다.
- 사용 가능성이 낮은 리소스까지 무분별하게 미리 로드하지 않습니다.

미리 로드하는 리소스가 많아지면 초기 다운로드 부담이 다시 증가할 수 있으므로 사용자 행동과 네트워크 환경을 고려해야 합니다.

## 10. Lazy Loading과 Error Boundary

Lazy Loading은 네트워크 오류나 청크 다운로드 실패 등으로 인해 실패할 수 있습니다.

`Suspense`는 로딩 중인 상태를 처리하지만 로딩 오류를 처리하지는 않습니다.

`React.lazy`에서 반환된 Promise가 Reject되면 React는 해당 오류를 가장 가까운 Error Boundary로 전달합니다.

따라서 Lazy Loading을 적용할 때는 Error Boundary를 함께 구성하는 것이 좋습니다.

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
    console.error('페이지 로딩 오류:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          페이지를 불러오지 못했습니다.
          <button
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      );
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

실제 서비스에서는 단순한 페이지 새로고침 외에도 다음과 같은 복구 전략을 고려할 수 있습니다.

- 재시도 버튼을 통한 모듈 재로딩
- 오류 상태 및 원인 로깅
- 대체 콘텐츠 표시
- 사용자에게 페이지 이동 또는 새로고침 안내

## 11. Lazy Loading 적용 시 주의사항

### 11.1 초기 화면의 핵심 콘텐츠는 지연하지 않습니다.

초기 화면에서 바로 표시해야 하는 콘텐츠까지 Lazy Loading하면 오히려 사용자에게 콘텐츠가 늦게 표시될 수 있습니다.

특히 LCP에 영향을 주는 이미지나 핵심 컴포넌트는 우선적으로 로드하는 것이 좋습니다.

### 11.2 지나치게 작은 단위로 분리하지 않습니다.

컴포넌트마다 무조건 Lazy Loading을 적용하면 지나치게 많은 청크와 네트워크 요청이 발생할 수 있습니다.

페이지, 기능, 사용자 접근 패턴을 기준으로 적절한 분할 단위를 선택해야 합니다.

### 11.3 로딩 UI의 레이아웃을 고려합니다.

Fallback UI가 실제 콘텐츠와 지나치게 다른 크기나 구조를 가지면 콘텐츠가 로드된 이후 화면이 크게 변경될 수 있습니다.

Skeleton UI 등을 활용하여 로딩 전후의 레이아웃 차이를 줄이는 것이 좋습니다.

### 11.4 불필요한 재요청을 방지합니다.

데이터 Lazy Loading에서는 이미 로드한 데이터를 다시 요청하지 않도록 캐싱과 중복 요청 방지 전략을 고려해야 합니다.

### 11.5 접근성을 고려합니다.

Lazy Loading으로 콘텐츠가 늦게 표시되는 경우 보조 기술을 사용하는 사용자도 로딩 상태를 인식할 수 있도록 구성해야 합니다.

필요에 따라 `aria-busy`, `aria-live` 등의 속성을 활용할 수 있습니다.

```tsx
function LoadingRegion() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      콘텐츠를 불러오는 중입니다.
    </div>
  );
}
```

## 12. Lazy Loading과 관련 개념 비교

| 개념 | 설명 |
|---|---|
| Lazy Loading | 리소스가 필요한 시점까지 로딩을 지연하는 전략입니다. |
| Eager Loading | 리소스를 초기 또는 사전에 로드하는 전략입니다. |
| Code Splitting | JavaScript 코드를 여러 청크로 분리하는 기법입니다. |
| Dynamic Import | `import()`를 사용하여 모듈을 비동기적으로 로드하는 기능입니다. |
| `React.lazy` | Dynamic Import를 기반으로 React 컴포넌트를 지연 로드하는 API입니다. |
| `Suspense` | 지원되는 렌더링 작업이 대기 중일 때 Fallback UI를 표시합니다. |
| Intersection Observer | 요소가 Viewport 또는 지정한 영역과 교차하는 상태를 관찰하는 브라우저 API입니다. |
| Preloading | 가까운 시점에 필요한 리소스를 미리 로드하는 전략입니다. |
| Prefetching | 이후 필요할 가능성이 있는 리소스를 미리 가져오는 전략입니다. |

## 13. 참고 자료

### React 공식 문서

- [React - lazy](https://react.dev/reference/react/lazy)
- [React - Suspense](https://react.dev/reference/react/Suspense)
- [React - Component](https://react.dev/reference/react/Component) - Error Boundary 관련 API

### Web API 공식 문서

- [MDN - Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN - HTMLImageElement.loading](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/loading)
- [MDN - HTMLImageElement.fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority)
- [MDN - import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)

### Web Performance

- [web.dev - Lazy loading](https://web.dev/articles/browser-level-image-lazy-loading)
- [web.dev - Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp)
- [web.dev - Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls)