# Concurrent Rendering

## 1. Concurrent Rendering이란?

Concurrent Rendering은 React가 UI를 렌더링하는 작업을 중단하거나 재개하고, 필요에 따라 진행 중인 렌더링 작업을 폐기할 수 있도록 하는 렌더링 모델입니다.

기존의 동기식 렌더링에서는 렌더링 작업이 시작되면 해당 작업이 완료될 때까지 메인 스레드를 점유합니다. 따라서 컴포넌트 트리가 크거나 렌더링 비용이 높은 경우 사용자 입력에 대한 반응이 지연될 수 있습니다.

Concurrent Rendering에서는 React가 렌더링 작업을 여러 단위로 나누고, 작업의 우선순위에 따라 실행을 조정할 수 있습니다.

예를 들어 사용자가 검색어를 입력하는 동안 대량의 검색 결과를 렌더링해야 하는 상황을 고려할 수 있습니다.

- 검색어 입력은 사용자의 직접적인 상호작용이므로 즉시 반영해야 합니다.
- 검색 결과 렌더링은 상대적으로 시간이 걸릴 수 있으므로 나중에 처리할 수 있습니다.
- 검색 결과를 렌더링하는 도중 새로운 입력이 발생하면 진행 중인 렌더링 작업을 중단하고 최신 입력을 우선 처리할 수 있습니다.

이를 통해 React는 비용이 높은 렌더링 작업이 진행되는 동안에도 사용자 인터페이스의 응답성을 유지할 수 있습니다.

Concurrent Rendering은 React 18에서 도입된 Concurrent Renderer를 기반으로 제공됩니다.

## 2. Concurrent Rendering의 핵심 특징

### 2.1. Interruptible Rendering

Interruptible Rendering은 렌더링 작업을 진행하는 도중 해당 작업을 중단할 수 있는 특성입니다.

기존 동기식 렌더링에서는 렌더링 작업이 시작되면 완료될 때까지 다른 렌더링 작업으로 전환할 수 없었습니다.

반면 Concurrent Rendering에서는 React가 렌더링 작업을 진행하다가 더 높은 우선순위의 업데이트가 발생하면 현재 작업을 중단할 수 있습니다.

예를 들어 다음과 같은 상황을 고려할 수 있습니다.

1. 사용자가 검색어를 입력합니다.
2. React가 검색 결과 목록을 렌더링하기 시작합니다.
3. 검색 결과를 렌더링하는 도중 사용자가 새로운 문자를 입력합니다.
4. React는 진행 중인 낮은 우선순위의 렌더링 작업을 중단합니다.
5. 새로운 검색어를 입력 필드에 반영합니다.
6. 최신 검색어를 기준으로 검색 결과 렌더링을 다시 시작합니다.

이 과정에서 이전 검색어를 기준으로 진행하던 렌더링 작업은 최신 상태에 따라 폐기될 수 있습니다.

중요한 점은 렌더링 작업이 중단되더라도 사용자에게 표시되는 DOM이 중간 상태로 변경되지 않는다는 것입니다.

React는 새로운 UI 트리를 준비하는 과정과 실제 DOM에 변경 사항을 반영하는 과정을 구분합니다. 렌더링 작업이 완료된 이후 Commit 단계에서 변경 사항을 반영하므로 중단된 렌더링 작업이 불완전한 UI를 노출하지 않습니다.

### 2.2. Rendering Work Scheduling

Concurrent Rendering에서는 모든 상태 업데이트를 동일한 우선순위로 처리하지 않습니다.

React는 업데이트의 성격에 따라 처리 우선순위를 조정하여 사용자 상호작용에 직접적으로 영향을 주는 작업을 우선 처리할 수 있습니다.

대표적인 업데이트 구분은 다음과 같습니다.

| 업데이트 유형 | 설명 | 예시 |
|---|---|---|
| Urgent Update | 즉시 반영해야 하는 업데이트 | 입력 필드, 버튼 상호작용 |
| Transition Update | 상대적으로 지연 가능한 업데이트 | 검색 결과, 탭 전환, 화면 탐색 |

Urgent Update는 사용자 상호작용에 직접적으로 연결되므로 높은 우선순위로 처리됩니다.

Transition Update는 상대적으로 낮은 우선순위로 처리되며, 더 높은 우선순위의 업데이트가 발생하면 중단될 수 있습니다.

이러한 우선순위 구분을 통해 React는 모든 렌더링 작업을 동일하게 처리하지 않고 사용자 경험에 적합한 방식으로 작업을 조정합니다.

### 2.3. Interrupt, Resume, Abandon

Concurrent Rendering의 렌더링 작업은 다음과 같은 형태로 처리될 수 있습니다.

- Interrupt: 진행 중인 렌더링 작업을 일시적으로 중단합니다.
- Resume: 중단했던 렌더링 작업을 이어서 진행합니다.
- Abandon: 기존 렌더링 작업을 폐기하고 최신 상태를 기준으로 새로운 렌더링을 시작합니다.

예를 들어 대량의 목록을 렌더링하는 도중 새로운 검색어가 입력되면 기존 렌더링 작업을 계속 진행하는 대신 최신 검색어를 기준으로 다시 렌더링할 수 있습니다.

이러한 동작은 사용자에게 불필요한 이전 상태의 렌더링 결과를 표시하지 않고 최신 상태를 반영하기 위한 것입니다.

## 3. Concurrent Rendering의 동작 과정

Concurrent Rendering은 기존 React 렌더링 과정의 Render Phase와 Commit Phase를 기반으로 동작합니다.

### 3.1. Render Phase

Render Phase에서는 변경된 상태와 Props를 기준으로 새로운 UI 트리를 계산합니다.

이 단계에서 React는 다음 작업을 수행합니다.

1. 업데이트가 발생한 컴포넌트를 확인합니다.
2. 컴포넌트를 실행하여 새로운 React Element를 생성합니다.
3. 기존 Fiber 트리와 비교하여 변경 사항을 계산합니다.
4. 새로운 UI 트리를 구성합니다.

Concurrent Rendering이 활성화된 상황에서는 Render Phase의 작업을 중단하거나 재개할 수 있습니다.

렌더링 작업이 완료되지 않은 상태에서 더 높은 우선순위의 업데이트가 발생하면 현재 작업을 중단하고 해당 업데이트를 먼저 처리할 수 있습니다.

### 3.2. Commit Phase

Commit Phase에서는 Render Phase에서 계산한 변경 사항을 실제 DOM에 반영합니다.

이 단계에서는 다음과 같은 작업이 수행됩니다.

- DOM 노드 생성 및 수정
- DOM 노드 제거
- Ref 업데이트
- Layout Effect 실행

중요한 점은 Concurrent Rendering에서도 Commit Phase는 원자적으로 처리된다는 것입니다.

React는 새로운 UI 트리가 완성되기 전에 일부 변경 사항만 실제 DOM에 반영하지 않습니다.

따라서 렌더링 작업이 중단되거나 폐기되더라도 화면에는 일관된 UI 상태가 유지됩니다.

### 3.3. 렌더링 과정 비교

기존 동기식 렌더링과 Concurrent Rendering의 차이는 다음과 같습니다.

**동기식 렌더링**

1. 상태 업데이트 발생
2. Render Phase 시작
3. Render Phase 완료
4. Commit Phase 실행
5. 화면 업데이트

Render Phase가 시작되면 완료될 때까지 해당 작업이 중단되지 않습니다.

**Concurrent Rendering**

1. 상태 업데이트 발생
2. Render Phase 시작
3. 렌더링 작업 진행
4. 더 높은 우선순위의 업데이트 발생
5. 기존 렌더링 작업 중단
6. 높은 우선순위 업데이트 처리
7. 기존 작업 재개 또는 폐기
8. 최신 UI 트리의 Render Phase 완료
9. Commit Phase 실행
10. 화면 업데이트

Concurrent Rendering에서는 렌더링 작업을 유연하게 조정할 수 있지만, 실제 DOM 변경은 완료된 렌더링 결과를 기준으로 수행됩니다.

## 4. Concurrent Rendering을 지원하는 주요 API

Concurrent Rendering은 별도의 Hook 하나로 구현되는 기능이 아니라 여러 React API를 통해 활용하는 렌더링 모델입니다.

대표적인 API는 다음과 같습니다.

| API | 역할 |
|---|---|
| `createRoot` | Concurrent Renderer를 사용하는 React Root 생성 |
| `startTransition` | 상태 업데이트를 Transition으로 지정 |
| `useTransition` | Transition 실행 및 진행 상태 확인 |
| `useDeferredValue` | 특정 값의 업데이트를 지연하여 렌더링 |
| `Suspense` | 렌더링에 필요한 콘텐츠가 준비되지 않았을 때 대체 UI 표시 |
| `useSyncExternalStore` | 외부 Store와 Concurrent Rendering의 일관성 유지 |

### 4.1. createRoot

React 18에서는 기존 `ReactDOM.render` 대신 `createRoot`를 사용하여 React Root를 생성합니다.

```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(<App />);
```

`createRoot`는 React 18의 새로운 Root API이며 Concurrent Rendering을 지원하는 렌더러를 활성화합니다.

React 18의 새로운 Concurrent 기능을 사용하려면 기존 Legacy Root API가 아닌 `createRoot`를 사용해야 합니다.

단, `createRoot`를 사용한다고 모든 상태 업데이트가 자동으로 Transition으로 처리되는 것은 아닙니다. 업데이트의 우선순위는 Transition API 등의 사용 여부에 따라 달라집니다.

### 4.2. startTransition

`startTransition`은 특정 상태 업데이트를 긴급하지 않은 Transition Update로 지정하는 API입니다.

```tsx
import { useState, startTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setQuery(value);

    startTransition(() => {
      setSearchQuery(value);
    });
  };

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
      />

      <SearchResults query={searchQuery} />
    </div>
  );
}
```

위 예제에서는 두 가지 상태 업데이트가 발생합니다.

- `setQuery`: 입력 필드의 값을 즉시 업데이트합니다.
- `setSearchQuery`: 검색 결과를 업데이트하는 작업을 Transition으로 지정합니다.

React는 입력 필드의 상태 업데이트를 우선 처리하고 검색 결과 렌더링은 상대적으로 낮은 우선순위로 처리할 수 있습니다.

`startTransition`의 콜백은 즉시 실행됩니다. 콜백 실행 자체를 지연하는 것이 아니라 콜백 내부에서 예약되는 상태 업데이트를 Transition으로 표시합니다.

### 4.3. useTransition

`useTransition`은 컴포넌트 내부에서 Transition을 시작하고 진행 상태를 확인할 수 있는 Hook입니다.

```tsx
import { useState, useTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('home');

  const [isPending, startTransition] = useTransition();

  const selectTab = (nextTab: string) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <button onClick={() => selectTab('home')}>
        Home
      </button>

      <button onClick={() => selectTab('posts')}>
        Posts
      </button>

      {isPending && <p>Loading...</p>}

      <TabContent tab={tab} />
    </div>
  );
}
```

`useTransition`은 다음 두 가지 값을 반환합니다.

- `isPending`: Transition 작업이 진행 중인지 나타내는 Boolean 값입니다.
- `startTransition`: 상태 업데이트를 Transition으로 지정하는 함수입니다.

Transition이 진행되는 동안 기존 UI를 유지하면서 새로운 UI를 준비할 수 있습니다.

`isPending`을 활용하면 새로운 콘텐츠가 준비되는 동안 사용자에게 진행 상태를 표시할 수 있습니다.

### 4.4. useDeferredValue

`useDeferredValue`는 특정 값의 업데이트를 지연하여 해당 값을 사용하는 컴포넌트의 렌더링 우선순위를 낮추는 Hook입니다.

`startTransition`이 상태 업데이트를 직접 지정하는 방식이라면, `useDeferredValue`는 전달받은 값의 최신 변경 사항을 반영하는 렌더링을 지연하는 방식입니다.

```tsx
import { useState, useDeferredValue, memo } from 'react';

const SearchResults = memo(function SearchResults({
  query,
}: {
  query: string;
}) {
  return (
    <div>
      <p>Search Results: {query}</p>
    </div>
  );
});

function SearchPage() {
  const [query, setQuery] = useState('');

  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <SearchResults query={deferredQuery} />
    </div>
  );
}
```

위 예제에서는 입력 필드의 상태가 즉시 업데이트되지만 검색 결과 컴포넌트에는 지연된 값이 전달됩니다.

React는 먼저 최신 입력값을 반영한 렌더링을 수행한 다음, 백그라운드에서 지연된 값을 최신 값으로 업데이트하는 렌더링을 시도합니다.

이 과정에서 새로운 입력이 발생하면 진행 중인 백그라운드 렌더링을 중단하고 최신 값으로 다시 시작할 수 있습니다.

`useDeferredValue`는 Debouncing이나 Throttling과 다릅니다.

- Debouncing: 일정 시간 동안 추가 입력이 없을 때 작업을 실행합니다.
- Throttling: 일정 시간 간격으로 작업 실행을 제한합니다.
- useDeferredValue: 고정된 지연 시간이 아니라 React의 렌더링 우선순위에 따라 업데이트를 지연합니다.

따라서 `useDeferredValue`는 네트워크 요청 횟수를 직접 제한하지 않습니다. 주로 렌더링 작업의 우선순위를 조정하는 데 사용됩니다.

또한 지연된 값이 전달되는 컴포넌트가 불필요하게 다시 렌더링되지 않도록 `memo`와 함께 사용하는 것이 중요할 수 있습니다.

## 5. Concurrent Rendering과 Suspense

`Suspense`는 하위 컴포넌트가 렌더링에 필요한 리소스를 기다리는 동안 대체 UI를 표시하는 기능입니다.

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

하위 컴포넌트가 Suspense를 활성화하는 작업으로 인해 렌더링을 일시 중단하면 가장 가까운 상위 Suspense Boundary가 `fallback`을 표시합니다.

Concurrent Rendering과 Suspense를 함께 사용하면 새로운 UI를 백그라운드에서 준비하면서 기존에 표시 중인 콘텐츠를 유지할 수 있습니다.

예를 들어 이미 표시된 페이지에서 새로운 데이터를 필요로 하는 화면으로 전환할 때, 새로운 콘텐츠가 준비되지 않았다는 이유로 기존 화면 전체를 로딩 화면으로 교체하는 현상을 줄일 수 있습니다.

특히 Transition과 Suspense를 함께 사용하면 다음과 같은 사용자 경험을 구현할 수 있습니다.

1. 기존 화면이 표시됩니다.
2. 사용자가 새로운 화면으로 이동합니다.
3. React가 새로운 화면을 백그라운드에서 렌더링합니다.
4. 새로운 화면이 Suspense 상태에 진입하면 기존 화면을 유지할 수 있습니다.
5. 새로운 콘텐츠가 준비되면 화면을 전환합니다.

단, Suspense는 모든 비동기 작업을 자동으로 감지하는 것은 아닙니다. Effect나 이벤트 핸들러 내부에서 실행하는 일반적인 데이터 요청은 Suspense를 활성화하지 않습니다.

## 6. Concurrent Rendering에서 고려해야 할 사항

### 6.1. Render Phase의 순수성

Concurrent Rendering에서는 렌더링 작업이 중단되거나 다시 실행될 수 있습니다.

따라서 컴포넌트의 렌더링 과정은 동일한 Props와 State에 대해 동일한 결과를 반환하도록 순수하게 작성해야 합니다.

다음과 같이 렌더링 과정에서 외부 상태를 직접 변경하는 코드는 피해야 합니다.

```tsx
let renderCount = 0;

function Counter() {
  renderCount += 1;

  return <p>{renderCount}</p>;
}
```

이 코드는 컴포넌트가 렌더링될 때마다 외부 변수를 변경합니다.

React가 렌더링 작업을 중단하거나 다시 수행하면 실제 화면에 반영되지 않은 렌더링 과정에서도 외부 상태가 변경될 수 있습니다.

렌더링 과정에서는 Props와 State를 기반으로 UI를 계산하고, 외부 시스템과의 상호작용은 Effect 또는 이벤트 핸들러 등 적절한 위치에서 처리해야 합니다.

### 6.2. Transition으로 입력 필드를 제어하지 않기

Transition은 긴급하지 않은 상태 업데이트를 처리하기 위한 기능입니다.

따라서 사용자의 입력에 즉각 반응해야 하는 Controlled Input의 상태를 Transition으로 처리해서는 안 됩니다.

```tsx
import { useState, useTransition } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    // 입력 상태는 동기적으로 업데이트합니다.
    setQuery(value);

    // 검색 결과 상태만 Transition으로 처리합니다.
    startTransition(() => {
      setSearchQuery(value);
    });
  };

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
      />

      {isPending && <span>Searching...</span>}

      <SearchResults query={searchQuery} />
    </div>
  );
}
```

입력 필드의 상태는 즉시 업데이트하고, 상대적으로 비용이 높은 검색 결과 렌더링을 Transition으로 처리하는 방식이 적절합니다.

### 6.3. Side Effect를 렌더링 과정에서 실행하지 않기

Concurrent Rendering에서는 렌더링 작업이 완료되지 않고 폐기될 수 있습니다.

따라서 렌더링 과정에서 네트워크 요청, 외부 변수 변경, DOM 직접 조작과 같은 Side Effect를 실행하면 의도하지 않은 동작이 발생할 수 있습니다.

```tsx
// 잘못된 예시
function UserProfile() {
  fetch('/api/user');

  return <div>User Profile</div>;
}
```

위 코드는 컴포넌트가 렌더링될 때마다 네트워크 요청을 발생시킬 수 있습니다.

외부 시스템과의 동기화는 Effect를 사용하거나 적절한 데이터 로딩 라이브러리 및 프레임워크의 데이터 로딩 방식을 활용해야 합니다.

### 6.4. 외부 Store의 일관성 유지

React 외부에서 관리되는 상태를 Concurrent Rendering과 함께 사용할 때는 상태의 일관성을 고려해야 합니다.

예를 들어 Redux와 같은 외부 상태 관리 시스템을 React 컴포넌트에서 구독하는 경우, 렌더링 도중 외부 Store의 값이 변경되면 서로 다른 시점의 상태가 혼합되어 관찰되는 문제가 발생할 수 있습니다.

React는 이러한 문제를 방지하기 위해 `useSyncExternalStore`를 제공합니다.

```tsx
import { useSyncExternalStore } from 'react';

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}
```

`useSyncExternalStore`는 외부 Store의 변경 사항을 React에 안전하게 전달하고, Concurrent Rendering 환경에서도 일관된 Snapshot을 읽을 수 있도록 지원합니다.

주로 외부 상태 관리 라이브러리나 React와 연동되는 Store를 구현할 때 활용됩니다.

## 7. Concurrent Rendering과 기존 렌더링 모델 비교

| 구분 | 기존 동기식 렌더링 | Concurrent Rendering |
|---|---|---|
| 렌더링 방식 | 동기적으로 진행 | 작업 중단 및 재개 가능 |
| 작업 우선순위 | 기본적으로 구분하지 않음 | 업데이트 우선순위 조정 |
| 렌더링 중단 | 불가능 | 가능 |
| 렌더링 작업 폐기 | 일반적인 동기 렌더링 모델에서는 해당 개념이 없음 | 가능 |
| DOM 반영 | Commit 단계에서 반영 | Commit 단계에서 원자적으로 반영 |
| 사용자 입력 응답성 | 렌더링 비용에 영향을 받음 | 긴급 업데이트를 우선 처리 가능 |

Concurrent Rendering은 기존 렌더링 모델을 완전히 대체하는 별도의 렌더링 API가 아닙니다.

React의 내부 렌더링 모델을 확장하여 여러 종류의 업데이트를 효율적으로 처리할 수 있도록 하는 기반입니다.

## 8. 정리

Concurrent Rendering은 React가 렌더링 작업을 중단하고 재개하거나 폐기할 수 있도록 하여 사용자 인터페이스의 응답성을 향상시키는 렌더링 모델입니다.

핵심 개념은 다음과 같습니다.

- Interruptible Rendering을 통해 렌더링 작업을 중단할 수 있습니다.
- 업데이트의 우선순위에 따라 사용자 상호작용을 먼저 처리할 수 있습니다.
- 진행 중인 렌더링 작업을 재개하거나 폐기할 수 있습니다.
- Commit Phase에서 변경 사항을 원자적으로 반영하여 UI의 일관성을 유지합니다.
- `startTransition`, `useTransition`, `useDeferredValue`를 통해 업데이트 우선순위를 조정할 수 있습니다.
- `Suspense`와 함께 사용하여 콘텐츠 로딩 및 화면 전환 경험을 개선할 수 있습니다.
- 렌더링 작업이 반복되거나 폐기될 수 있으므로 컴포넌트의 렌더링 과정은 순수하게 유지해야 합니다.

Concurrent Rendering의 핵심 목적은 렌더링 자체를 무조건 빠르게 만드는 것이 아니라, 렌더링 비용이 높은 작업이 진행되는 상황에서도 사용자 상호작용에 대한 응답성을 유지하는 것입니다.

## 9. 참고 자료

- [React 공식 문서 - React v18.0](https://react.dev/blog/2022/03/29/react-v18)
- [React 공식 문서 - useTransition](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - startTransition](https://react.dev/reference/react/startTransition)
- [React 공식 문서 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [React 공식 문서 - React Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks)