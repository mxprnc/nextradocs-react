# Suspense

## 1. Suspense란?

Suspense는 하위 컴포넌트가 렌더링에 필요한 리소스를 준비하는 동안 대체 UI(Fallback)를 표시하고, 리소스가 준비되면 실제 콘텐츠를 렌더링하도록 지원하는 React 기능입니다.

일반적으로 다음과 같은 상황에서 활용됩니다.

- 컴포넌트 코드를 동적으로 불러오는 Lazy Loading
- Suspense를 지원하는 데이터 로딩 라이브러리 및 프레임워크
- React Server Components에서 전달되는 Promise 처리
- Streaming Server Rendering에서 콘텐츠를 점진적으로 전달하는 경우

Suspense는 로딩 상태를 선언적으로 관리할 수 있도록 지원합니다. 컴포넌트 내부에서 로딩 여부를 직접 관리하고 조건부 렌더링을 구현하는 대신, 특정 UI 영역을 Suspense Boundary로 감싸 해당 영역의 로딩 상태를 관리할 수 있습니다.

```tsx
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserProfile />
    </Suspense>
  );
}
```

위 예제에서 `UserProfile` 또는 하위 컴포넌트가 Suspense를 활성화하는 작업으로 인해 렌더링을 일시 중단하면 `fallback`이 표시됩니다.

리소스가 준비되면 실제 콘텐츠가 렌더링됩니다.

Suspense는 React 16.6에서 `React.lazy`와 함께 처음 도입되었으며, React 18 이후 Concurrent Rendering 및 Streaming Server Rendering과 결합되어 더 다양한 비동기 렌더링 시나리오를 지원합니다.

## 2. Suspense Boundary

Suspense Boundary는 `<Suspense>` 컴포넌트로 정의하는 렌더링 경계입니다.

Boundary 내부의 컴포넌트가 렌더링을 일시 중단하면 해당 Boundary가 대체 UI를 표시합니다.

### 2.1. 기본 구조

```tsx
import { Suspense } from 'react';

function App() {
  return (
    <div>
      <h1>User Dashboard</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <UserProfile />
      </Suspense>
    </div>
  );
}
```

`Suspense`는 다음 두 가지 주요 Props를 제공합니다.

| Prop | 타입 | 설명 |
|---|---|---|
| `children` | `ReactNode` | 실제로 렌더링할 콘텐츠입니다. |
| `fallback` | `ReactNode` | 하위 콘텐츠가 준비되지 않았을 때 표시할 대체 UI입니다. |

`fallback`에는 문자열, JSX, 컴포넌트 등 유효한 React Node를 전달할 수 있습니다.

### 2.2. Suspense Boundary의 범위

Suspense Boundary는 자신이 감싸고 있는 하위 컴포넌트 트리에서 발생한 Suspense 상태를 처리합니다.

여러 컴포넌트를 하나의 Boundary로 감싸면 해당 영역 전체가 하나의 로딩 단위로 처리됩니다.

```tsx
function Dashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <UserProfile />
      <RecentActivities />
      <Notifications />
    </Suspense>
  );
}
```

위 구조에서는 세 컴포넌트 중 하나라도 렌더링을 일시 중단하면 해당 Boundary의 Fallback이 표시될 수 있습니다.

따라서 여러 영역의 로딩 상태를 독립적으로 관리하려면 Boundary를 분리하는 것이 적절합니다.

```tsx
function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfile />
      </Suspense>

      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivities />
      </Suspense>

      <Suspense fallback={<NotificationSkeleton />}>
        <Notifications />
      </Suspense>
    </div>
  );
}
```

각 영역은 독립적인 Suspense Boundary를 가지므로 한 영역의 로딩이 다른 영역의 Fallback 표시를 반드시 유발하지는 않습니다.

### 2.3. 중첩 Suspense Boundary

Suspense Boundary는 중첩해서 구성할 수 있습니다.

```tsx
function Dashboard() {
  return (
    <Suspense fallback={<p>Loading dashboard...</p>}>
      <DashboardLayout />

      <Suspense fallback={<p>Loading profile...</p>}>
        <UserProfile />
      </Suspense>

      <Suspense fallback={<p>Loading activities...</p>}>
        <RecentActivities />
      </Suspense>
    </Suspense>
  );
}
```

하위 컴포넌트에서 Suspense 상태가 발생하면 가장 가까운 상위 Suspense Boundary가 해당 상태를 처리합니다.

내부 Boundary가 처리할 수 있는 Suspense 상태는 외부 Boundary까지 전파되지 않습니다.

반면 내부 Boundary가 없는 영역에서 Suspense 상태가 발생하면 상위 Boundary가 Fallback을 표시합니다.

이러한 구조를 활용하면 페이지 전체의 로딩 상태와 개별 콘텐츠 영역의 로딩 상태를 계층적으로 관리할 수 있습니다.

## 3. Suspense가 활성화되는 조건

Suspense는 모든 비동기 작업을 자동으로 감지하지 않습니다.

React가 Suspense를 활성화하는 대표적인 상황은 다음과 같습니다.

| 상황 | 설명 |
|---|---|
| Lazy Loading | `React.lazy`를 통해 컴포넌트 코드를 동적으로 로드합니다. |
| Promise 읽기 | React 19의 `use` API로 Promise의 결과를 읽습니다. |
| Suspense 지원 데이터 로딩 | Suspense를 지원하는 프레임워크 또는 데이터 라이브러리가 렌더링 중 데이터를 읽도록 처리합니다. |
| Streaming Server Rendering | 서버에서 HTML을 생성하고 전달하는 과정에서 Suspense Boundary를 활용합니다. |
| 리소스 로딩 | React가 관리하는 특정 스타일시트 로딩 등의 작업이 Boundary의 표시를 지연시킬 수 있습니다. |

반면 다음과 같은 일반적인 비동기 작업은 Suspense를 자동으로 활성화하지 않습니다.

- `useEffect` 내부에서 실행하는 `fetch()`
- 이벤트 핸들러 내부에서 실행하는 네트워크 요청
- 일반적인 Promise의 완료 여부를 `useState`로 관리하는 방식

Suspense는 Promise가 존재한다는 사실만으로 활성화되지 않습니다. React가 지원하는 방식으로 렌더링 과정에서 해당 Promise를 읽거나 Suspense를 지원하는 리소스 로딩 메커니즘을 사용해야 합니다.

특히 데이터 로딩을 위한 Suspense 통합 방식은 사용하는 React 버전과 프레임워크 또는 라이브러리의 지원 범위에 따라 달라집니다.

## 4. Lazy Loading과 Suspense

Lazy Loading은 필요한 시점에 컴포넌트 코드를 동적으로 로드하는 방식입니다.

React는 `lazy` API를 제공하여 컴포넌트의 코드 로딩을 지연할 수 있습니다.

### 4.1. React.lazy

`React.lazy`는 컴포넌트를 동적으로 불러오는 API입니다.

```tsx
import { lazy } from 'react';

const UserProfile = lazy(
  () => import('./UserProfile')
);
```

`lazy`는 동적으로 로드한 모듈의 `default` export를 React 컴포넌트로 사용합니다.

컴포넌트 코드가 처음 필요해지는 시점에 로딩이 시작되며, 로딩이 완료되지 않은 동안 해당 컴포넌트를 렌더링하면 Suspense 상태가 발생합니다.

### 4.2. Suspense와 함께 사용하기

Lazy Loading을 사용하는 컴포넌트는 Suspense Boundary 내부에서 렌더링해야 합니다.

```tsx
import { lazy, Suspense } from 'react';

const UserProfile = lazy(
  () => import('./UserProfile')
);

function App() {
  return (
    <div>
      <h1>User Dashboard</h1>

      <Suspense fallback={<p>Loading profile...</p>}>
        <UserProfile />
      </Suspense>
    </div>
  );
}
```

동작 과정은 다음과 같습니다.

1. `UserProfile` 컴포넌트의 렌더링이 시작됩니다.
2. React가 동적으로 컴포넌트 모듈을 로드합니다.
3. 모듈 로딩이 완료되지 않았다면 Suspense 상태가 발생합니다.
4. 가장 가까운 Suspense Boundary가 Fallback을 표시합니다.
5. 모듈 로딩이 완료되면 React가 컴포넌트를 다시 렌더링합니다.
6. 실제 `UserProfile` UI가 화면에 표시됩니다.

### 4.3. 여러 컴포넌트의 Lazy Loading

여러 컴포넌트를 각각 Lazy Loading으로 구성할 수 있습니다.

```tsx
import { lazy, Suspense } from 'react';

const UserProfile = lazy(
  () => import('./UserProfile')
);

const ActivityList = lazy(
  () => import('./ActivityList')
);

function Dashboard() {
  return (
    <div>
      <Suspense fallback={<p>Loading dashboard...</p>}>
        <UserProfile />
        <ActivityList />
      </Suspense>
    </div>
  );
}
```

위 예제에서는 두 컴포넌트가 하나의 Suspense Boundary에 포함되어 있습니다.

따라서 둘 중 하나라도 아직 로딩되지 않았다면 해당 Boundary가 Fallback을 표시할 수 있습니다.

각 컴포넌트의 로딩 상태를 독립적으로 처리하려면 별도의 Suspense Boundary를 사용하는 것이 좋습니다.

## 5. Suspense와 Data Fetching

Suspense는 데이터 로딩과 함께 사용할 수 있지만, 일반적인 데이터 요청을 자동으로 감지하는 기능은 아닙니다.

Suspense 기반 데이터 로딩을 사용하려면 React가 지원하는 방식으로 렌더링 과정에서 데이터를 읽을 수 있어야 합니다.

데이터 로딩을 위한 Suspense 통합 방식은 React 버전 및 사용하는 프레임워크나 라이브러리에 따라 달라집니다.

### 5.1. use API를 이용한 Promise 읽기

React 19에서는 `use` API를 사용하여 Promise의 결과를 읽을 수 있습니다.

Promise가 아직 완료되지 않았다면 해당 컴포넌트는 Suspense 상태가 됩니다.

```tsx
import { Suspense, use } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile({
  userPromise,
}: {
  userPromise: Promise<User>;
}) {
  const user = use(userPromise);

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function App({
  userPromise,
}: {
  userPromise: Promise<User>;
}) {
  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}
```

위 예제에서 `use(userPromise)`는 Promise가 완료될 때까지 렌더링을 일시 중단합니다.

Promise가 완료되면 반환된 데이터를 기반으로 컴포넌트를 렌더링합니다.

이때 주의할 점은 Promise의 인스턴스를 렌더링마다 새롭게 생성하지 않는 것입니다.

React가 동일한 Promise를 다시 읽을 수 있도록 Promise를 컴포넌트 외부나 적절한 캐시 계층에서 관리해야 합니다.

또한 `use` API는 Promise뿐 아니라 Context를 읽는 데에도 사용할 수 있습니다. Promise를 읽는 경우에는 Promise가 Pending 상태인지, Fulfilled 상태인지, Rejected 상태인지에 따라 각각 Suspense 또는 Error Boundary와 연계됩니다.

### 5.2. Suspense와 일반적인 useEffect 데이터 요청의 차이

다음은 일반적인 `useEffect`를 이용한 데이터 요청입니다.

```tsx
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user')
      .then((response) => response.json())
      .then((data: User) => {
        setUser(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return <h2>{user.name}</h2>;
}
```

이 방식은 컴포넌트 내부에서 로딩 상태를 직접 관리합니다.

반면 Suspense 기반 데이터 로딩은 렌더링 과정에서 데이터가 준비되지 않았음을 React에 전달하고, 상위 Suspense Boundary가 Fallback을 관리하도록 합니다.

| 구분 | useEffect 기반 로딩 | Suspense 기반 로딩 |
|---|---|---|
| 로딩 상태 관리 | 컴포넌트에서 직접 관리 | Suspense Boundary에서 관리 |
| 데이터 요청 시점 | Effect 실행 시점 | 사용하는 데이터 로딩 메커니즘에 따름 |
| 렌더링 중단 | 자동으로 발생하지 않음 | 지원되는 리소스를 읽으면 발생 |
| 로딩 UI | 조건부 렌더링 | Fallback |
| 주요 활용 | 일반적인 클라이언트 데이터 요청 | Suspense 지원 데이터 로딩 및 리소스 처리 |

Suspense가 `useEffect` 기반 데이터 요청을 대체하는 것은 아닙니다. 두 방식은 서로 다른 데이터 로딩 모델이며 애플리케이션의 구조와 사용하는 프레임워크에 따라 선택해야 합니다.

### 5.3. Promise 생성 및 캐싱 주의사항

Suspense 기반 데이터 로딩에서는 Promise의 생명주기를 적절하게 관리해야 합니다.

다음과 같이 컴포넌트가 렌더링될 때마다 새로운 Promise를 생성하는 방식은 피해야 합니다.

```tsx
import { use } from 'react';

function UserProfile() {
  const user = use(
    fetch('/api/user').then((response) => response.json())
  );

  return <h2>{user.name}</h2>;
}
```

컴포넌트가 다시 렌더링될 때마다 새로운 Promise가 생성될 수 있으므로 동일한 리소스에 대한 반복적인 요청이나 불필요한 Suspense 상태가 발생할 수 있습니다.

Promise는 컴포넌트 외부, 데이터 캐시 또는 적절한 데이터 로딩 계층에서 관리하는 것이 좋습니다.

## 6. Suspense와 Concurrent Rendering

Suspense는 Concurrent Rendering과 밀접하게 연관되어 있습니다.

Concurrent Rendering에서는 React가 렌더링 작업을 중단하거나 재개할 수 있습니다. Suspense는 이러한 렌더링 모델을 기반으로 콘텐츠가 준비되지 않은 상황을 선언적으로 처리합니다.

### 6.1. 콘텐츠가 준비되지 않은 경우

Suspense Boundary 내부의 컴포넌트가 렌더링을 일시 중단하면 React는 해당 Boundary의 Fallback을 표시할 수 있습니다.

```tsx
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserDashboard />
    </Suspense>
  );
}
```

React는 준비되지 않은 콘텐츠를 사용자에게 불완전한 상태로 노출하는 대신 Fallback을 표시하고, 콘텐츠가 준비되면 실제 UI를 표시합니다.

### 6.2. 이미 표시된 콘텐츠 유지하기

이미 화면에 표시된 콘텐츠가 새로운 업데이트로 인해 다시 Suspense 상태에 진입하면 기본적으로 Fallback이 표시될 수 있습니다.

이러한 동작은 화면 전체가 로딩 UI로 교체되는 불필요한 깜빡임을 발생시킬 수 있습니다.

React는 `startTransition`을 활용하여 이미 표시된 콘텐츠를 유지하면서 새로운 콘텐츠를 준비할 수 있도록 지원합니다.

```tsx
import {
  Suspense,
  startTransition,
  useState,
} from 'react';

function App() {
  const [page, setPage] = useState('home');

  const navigate = (nextPage: string) => {
    startTransition(() => {
      setPage(nextPage);
    });
  };

  return (
    <div>
      <button onClick={() => navigate('home')}>
        Home
      </button>

      <button onClick={() => navigate('profile')}>
        Profile
      </button>

      <Suspense fallback={<p>Loading page...</p>}>
        <PageContent page={page} />
      </Suspense>
    </div>
  );
}
```

위 예제에서는 페이지 변경을 Transition으로 처리합니다.

새로운 페이지가 준비되지 않은 경우 React는 이미 표시된 콘텐츠를 가능한 한 유지하면서 새로운 UI를 준비합니다.

다만 Transition이 모든 로딩을 완료할 때까지 기다리는 것은 아닙니다. 새롭게 등장하는 Suspense Boundary는 자체 Fallback을 표시할 수 있습니다.

### 6.3. useDeferredValue와 Suspense

`useDeferredValue`는 값의 업데이트를 지연하여 기존 콘텐츠를 유지하는 데 활용할 수 있습니다.

```tsx
import {
  Suspense,
  useDeferredValue,
  useState,
} from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');

  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />

      <Suspense fallback={<p>Loading results...</p>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}
```

입력 필드는 최신 `query`를 즉시 반영하지만 검색 결과는 `deferredQuery`를 기준으로 렌더링합니다.

새로운 검색 결과가 준비되는 동안 기존 결과를 유지할 수 있으므로 사용자에게 불필요한 Fallback 표시를 줄일 수 있습니다.

`startTransition`과 `useDeferredValue`는 모두 Suspense Fallback이 불필요하게 표시되는 상황을 줄이는 데 활용할 수 있습니다.

## 7. Streaming Server Rendering과 Suspense

Suspense는 클라이언트 렌더링뿐 아니라 서버 렌더링에서도 중요한 역할을 합니다.

Streaming Server Rendering은 서버에서 생성한 HTML을 하나의 완성된 결과로 전달하는 대신 준비된 콘텐츠부터 점진적으로 전달하는 방식입니다.

React는 Streaming Server Rendering 과정에서 Suspense Boundary를 활용하여 페이지의 일부 영역이 준비되지 않았더라도 나머지 영역의 HTML을 먼저 전달할 수 있습니다.

### 7.1. 기존 SSR과 Streaming SSR

기존의 일반적인 SSR 방식에서는 페이지 전체의 렌더링 결과를 준비한 다음 HTML을 전달하는 구조를 사용할 수 있습니다.

Streaming SSR에서는 콘텐츠 영역을 Suspense Boundary로 분리하여 준비된 영역부터 전달할 수 있습니다.

```tsx
import { Suspense } from 'react';

function ProfilePage() {
  return (
    <div>
      <h1>User Profile</h1>

      <ProfileHeader />

      <Suspense fallback={<p>Loading posts...</p>}>
        <UserPosts />
      </Suspense>

      <Suspense fallback={<p>Loading friends...</p>}>
        <UserFriends />
      </Suspense>
    </div>
  );
}
```

위 구조에서는 다음과 같은 처리가 가능합니다.

1. 페이지의 기본 레이아웃과 준비된 콘텐츠를 먼저 전달합니다.
2. 게시물 데이터가 준비되지 않았다면 해당 영역의 Fallback을 전달합니다.
3. 친구 목록이 준비되지 않았다면 해당 영역의 Fallback을 전달합니다.
4. 각 콘텐츠가 준비되면 해당 영역의 HTML을 추가로 전달합니다.

이를 통해 모든 콘텐츠가 준비될 때까지 전체 페이지의 HTML 전달을 기다리지 않아도 됩니다.

### 7.2. Streaming SSR의 주요 장점

- 페이지의 준비된 영역을 먼저 전달할 수 있습니다.
- 느린 데이터 로딩이 전체 페이지의 HTML 전달을 지연시키는 문제를 줄일 수 있습니다.
- 콘텐츠 영역별로 독립적인 로딩 UI를 제공할 수 있습니다.
- 브라우저가 JavaScript를 다운로드하고 실행하기 전에 HTML 콘텐츠를 점진적으로 표시할 수 있습니다.
- Suspense Boundary를 활용하여 Selective Hydration을 지원할 수 있습니다.

### 7.3. Selective Hydration

Selective Hydration은 서버에서 렌더링된 HTML을 클라이언트에서 Hydration할 때 페이지 전체를 하나의 단위로 처리하지 않고, 필요한 영역부터 선택적으로 Hydration할 수 있도록 하는 React의 기능입니다.

Suspense Boundary는 이러한 Hydration 작업을 분리하는 경계로 활용됩니다.

예를 들어 페이지의 일부 컴포넌트에 필요한 JavaScript가 아직 로드되지 않았더라도 다른 영역은 먼저 Hydration을 진행할 수 있습니다.

이를 통해 특정 컴포넌트의 로딩 지연이 전체 페이지의 상호작용 가능 시점에 미치는 영향을 줄일 수 있습니다.

## 8. Suspense Boundary의 State와 Effect 처리

Suspense는 단순히 Fallback을 표시하는 것 외에도 컴포넌트의 Mount 및 Unmount 동작과 관련된 특성을 가집니다.

### 8.1. 최초 Mount 이전에 중단된 렌더링

컴포넌트가 처음 Mount되기 전에 Suspense 상태에 진입하면 해당 렌더링 과정에서 생성된 State는 보존되지 않습니다.

콘텐츠가 준비되면 React는 중단된 트리를 처음부터 다시 렌더링합니다.

따라서 최초 Mount가 완료되지 않은 컴포넌트에서 렌더링 도중 생성한 State가 유지될 것이라고 가정해서는 안 됩니다.

### 8.2. 이미 표시된 콘텐츠가 다시 중단되는 경우

이미 화면에 표시된 콘텐츠가 이후 업데이트로 인해 다시 Suspense 상태에 진입하면 React는 상황에 따라 기존 콘텐츠를 숨기고 Fallback을 표시할 수 있습니다.

이 과정에서 해당 콘텐츠 트리의 Layout Effect가 정리됩니다.

콘텐츠가 다시 표시될 준비가 되면 Layout Effect가 다시 실행됩니다.

이는 화면에서 숨겨진 콘텐츠에 대해 DOM 레이아웃 측정 작업이 잘못 수행되는 것을 방지하기 위한 동작입니다.

`startTransition` 또는 `useDeferredValue`를 사용하면 이미 표시된 콘텐츠를 불필요하게 숨기는 상황을 줄일 수 있습니다.

## 9. Suspense와 Error Boundary

Suspense와 Error Boundary는 서로 다른 문제를 처리합니다.

| 구분 | Suspense | Error Boundary |
|---|---|---|
| 목적 | 콘텐츠 준비 대기 | 렌더링 오류 처리 |
| 처리 대상 | Suspense 상태 | 하위 컴포넌트에서 발생한 오류 |
| 표시 UI | Fallback | Error Fallback |
| 대표적인 상황 | Lazy Loading, Promise 대기 | 컴포넌트 렌더링 오류 |

Suspense는 로딩 상태를 처리하지만 일반적인 렌더링 오류를 처리하지 않습니다.

반대로 Error Boundary는 하위 컴포넌트에서 발생한 렌더링 오류를 처리하지만 일반적인 로딩 상태를 관리하지 않습니다.

두 기능은 함께 사용할 수 있습니다.

```tsx
import { Suspense } from 'react';

function App() {
  return (
    <ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <Suspense fallback={<p>Loading...</p>}>
        <UserProfile />
      </Suspense>
    </ErrorBoundary>
  );
}
```

이 구조에서는 다음과 같이 처리됩니다.

- 컴포넌트가 Suspense 상태에 진입하면 `Loading...`이 표시됩니다.
- 컴포넌트에서 처리되지 않은 렌더링 오류가 발생하면 Error Boundary의 Fallback이 표시됩니다.

Lazy Loading 과정에서 동적으로 불러오는 모듈의 Promise가 Reject되는 경우에도 일반적으로 가장 가까운 Error Boundary가 오류를 처리합니다.

## 10. Suspense 사용 시 주의사항

### 10.1. Suspense가 모든 비동기 작업을 감지하지는 않습니다.

일반적인 `fetch()` 호출이나 `useEffect` 내부의 비동기 작업은 Suspense를 자동으로 활성화하지 않습니다.

Suspense를 사용하려면 React가 지원하는 데이터 로딩 메커니즘을 사용해야 합니다.

특히 React 19의 `use` API를 이용한 Promise 읽기와 Suspense 지원 프레임워크 또는 라이브러리의 데이터 로딩 기능은 구분해서 이해해야 합니다.

### 10.2. Boundary의 위치가 중요합니다.

Suspense Boundary를 너무 상위에 배치하면 작은 영역의 로딩만으로 페이지 전체가 Fallback으로 교체될 수 있습니다.

반대로 지나치게 많은 Boundary를 사용하면 UI 영역별 로딩 상태를 관리하기 복잡해질 수 있습니다.

페이지 구조와 사용자 경험을 고려하여 적절한 단위로 Boundary를 배치해야 합니다.

### 10.3. Fallback은 가볍게 구성해야 합니다.

Fallback 자체가 또 다른 Suspense 상태에 진입하면 가장 가까운 상위 Suspense Boundary가 활성화됩니다.

따라서 Fallback은 가능한 한 단순하고 빠르게 렌더링할 수 있도록 구성하는 것이 좋습니다.

### 10.4. Lazy Loading 오류는 별도로 처리해야 합니다.

Lazy Loading 중 모듈 로딩이 실패하면 Suspense가 아니라 Error Boundary가 해당 오류를 처리합니다.

따라서 로딩 상태와 오류 상태를 각각 고려해야 합니다.

### 10.5. Suspense와 네트워크 요청을 구분해야 합니다.

Suspense는 네트워크 요청을 실행하거나 요청 횟수를 제한하는 기능이 아닙니다.

데이터 요청, 캐싱, 중복 요청 방지, 재검증 등의 기능은 사용하는 데이터 로딩 라이브러리나 프레임워크에서 별도로 관리해야 합니다.

## 11. 정리

Suspense는 하위 컴포넌트가 렌더링에 필요한 리소스를 준비하는 동안 대체 UI를 표시하고, 준비가 완료되면 실제 콘텐츠를 렌더링하도록 지원하는 React 기능입니다.

핵심 개념은 다음과 같습니다.

- Suspense Boundary는 하위 컴포넌트의 Suspense 상태를 처리하는 렌더링 경계입니다.
- `fallback`은 하위 콘텐츠가 준비되지 않았을 때 표시하는 대체 UI입니다.
- `React.lazy`와 함께 사용하여 컴포넌트의 Lazy Loading을 구현할 수 있습니다.
- React 19의 `use` API를 통해 Promise의 결과를 읽고 Suspense 상태를 발생시킬 수 있습니다.
- 일반적인 `useEffect` 기반 데이터 요청은 Suspense를 자동으로 활성화하지 않습니다.
- 데이터 로딩을 위한 Suspense 통합 방식은 사용하는 React 버전과 프레임워크 또는 라이브러리의 지원 범위에 따라 달라집니다.
- `startTransition`과 `useDeferredValue`를 활용하면 이미 표시된 콘텐츠를 유지하면서 새로운 UI를 준비할 수 있습니다.
- Streaming Server Rendering에서는 준비된 콘텐츠를 점진적으로 전달할 수 있습니다.
- Selective Hydration을 통해 Suspense Boundary별로 Hydration 작업을 조정할 수 있습니다.
- Suspense는 로딩 상태를 처리하며, 렌더링 오류는 Error Boundary가 담당합니다.

Suspense의 핵심 목적은 비동기 리소스가 필요한 UI를 선언적으로 구성하고, 콘텐츠의 준비 상태에 따라 사용자에게 적절한 UI를 제공하는 것입니다.

## 12. 참고 자료

- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - lazy](https://react.dev/reference/react/lazy)
- [React 공식 문서 - use](https://react.dev/reference/react/use)
- [React 공식 문서 - startTransition](https://react.dev/reference/react/startTransition)
- [React 공식 문서 - useTransition](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React 공식 문서 - renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream)
- [React 공식 문서 - renderToReadableStream](https://react.dev/reference/react-dom/server/renderToReadableStream)
- [React 공식 문서 - React v18](https://react.dev/blog/2022/03/29/react-v18)
- [React 공식 문서 - Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)