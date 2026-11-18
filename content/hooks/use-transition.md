# useTransition

## 1. useTransition이란?

`useTransition`은 일부 State 업데이트를 Transition으로 표시하여 긴급한 업데이트와 긴급하지 않은 업데이트를 구분하는 React Hook입니다.

React는 사용자 입력에 즉각 반응해야 하는 업데이트와 상대적으로 시간이 걸려도 되는 업데이트를 구분할 수 있습니다.

예를 들어 검색 화면에서 사용자가 입력하는 텍스트는 즉시 반영되어야 하지만, 검색 결과 목록을 대량으로 렌더링하는 작업은 상대적으로 낮은 우선순위로 처리할 수 있습니다.

이때 `useTransition`을 사용하면 입력 상태는 긴급하게 업데이트하고, 검색 결과 상태는 Transition으로 처리할 수 있습니다.

대표적인 사용 사례는 다음과 같습니다.

- 검색 결과와 같이 렌더링 비용이 큰 UI 업데이트
- 탭 전환 및 화면 전환
- 대량의 데이터 목록 렌더링
- Suspense를 사용하는 화면의 전환
- 비동기 Action이 진행되는 동안 로딩 상태 표시
- 긴급한 사용자 입력과 상대적으로 느린 UI 업데이트의 우선순위 분리

기본 문법은 다음과 같습니다.

```tsx
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();
```

- `isPending`: Transition이 진행 중인지 나타내는 Boolean 값입니다.
- `startTransition`: 전달된 State 업데이트를 Transition으로 표시하는 함수입니다.

`useTransition`은 렌더링 작업 자체를 더 빠르게 만드는 Hook이 아닙니다. 업데이트의 우선순위를 조정하여 긴급한 UI가 지연되지 않도록 하는 기능입니다.

## 2. 기본 문법

```tsx
const [isPending, startTransition] = useTransition();
```

`useTransition`은 두 가지 값을 반환합니다.

### 2.1. isPending

`isPending`은 Transition이 진행 중인지 나타내는 Boolean 값입니다.

```tsx
import { useState, useTransition } from 'react';

function Tabs() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  function handleTabChange(nextTab: string) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <div>
      <button onClick={() => handleTabChange('home')}>
        Home
      </button>

      <button onClick={() => handleTabChange('posts')}>
        Posts
      </button>

      {isPending && <p>화면을 업데이트하고 있습니다.</p>}

      {tab === 'home' && <Home />}
      {tab === 'posts' && <Posts />}
    </div>
  );
}
```

Transition으로 표시된 업데이트가 아직 완료되지 않았다면 `isPending`이 `true`가 될 수 있습니다.

이를 활용하여 다음과 같은 UI를 구성할 수 있습니다.

- 로딩 표시
- 버튼 비활성화
- 화면 전환 중 상태 표시
- 기존 콘텐츠 유지와 함께 진행 상태 표시

단, `isPending`은 모든 비동기 작업의 진행 상태를 자동으로 추적하는 값은 아닙니다. 해당 Hook에서 관리하는 Transition의 진행 상태를 나타냅니다.

### 2.2. startTransition

`startTransition`은 전달된 함수를 실행하고 해당 함수 내부에서 발생하는 State 업데이트를 Transition으로 표시합니다.

```tsx
startTransition(() => {
  setTab('posts');
});
```

일반적인 State 업데이트와 달리 Transition 업데이트는 긴급한 업데이트보다 낮은 우선순위로 처리될 수 있습니다.

따라서 React는 Transition 렌더링이 진행 중이더라도 더 긴급한 업데이트가 발생하면 해당 렌더링 작업을 중단하고 긴급한 업데이트를 먼저 처리할 수 있습니다.

`startTransition` 자체는 State를 변경하거나 업데이트를 예약하는 함수가 아닙니다. 전달한 함수 내부에서 발생하는 React State 업데이트에 Transition 우선순위를 부여하는 역할을 합니다.

## 3. 기본 사용 예제

다음은 탭 전환을 `useTransition`으로 처리하는 예제입니다.

```tsx
import { useState, useTransition } from 'react';

function Tabs() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (nextTab: string) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <button onClick={() => handleTabChange('home')}>
        Home
      </button>

      <button onClick={() => handleTabChange('posts')}>
        Posts
      </button>

      <button onClick={() => handleTabChange('settings')}>
        Settings
      </button>

      {isPending && <p>화면을 변경하고 있습니다.</p>}

      {tab === 'home' && <Home />}
      {tab === 'posts' && <Posts />}
      {tab === 'settings' && <Settings />}
    </div>
  );
}
```

탭 변경은 상대적으로 긴급하지 않은 UI 업데이트이므로 Transition으로 처리할 수 있습니다.

React가 새로운 화면을 렌더링하는 동안 다른 긴급한 업데이트가 발생하면 해당 업데이트를 먼저 처리할 수 있습니다.

이러한 방식은 화면 전환에 시간이 걸리는 경우에도 다른 사용자 상호작용에 대한 반응성을 유지하는 데 도움이 됩니다.

## 4. 긴급한 업데이트와 Transition 업데이트

React는 모든 State 업데이트를 동일한 우선순위로 처리하지 않습니다.

사용자 입력에 즉각 반응해야 하는 업데이트와 시간이 조금 더 걸려도 되는 업데이트를 구분할 수 있습니다.

### 4.1. 긴급한 업데이트(Urgent Update)

긴급한 업데이트는 사용자의 상호작용에 즉각적으로 반응해야 하는 State 변경입니다.

대표적인 예시는 다음과 같습니다.

- Input 입력값 변경
- 버튼 클릭에 따른 즉각적인 피드백
- 체크박스 선택 상태 변경
- 사용자 입력에 대한 UI 반응

```tsx
import { useState } from 'react';

function SearchInput() {
  const [input, setInput] = useState('');

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setInput(event.target.value);
  }

  return (
    <input
      value={input}
      onChange={handleChange}
    />
  );
}
```

Input의 입력값은 사용자가 입력하는 즉시 반영되어야 합니다.

따라서 일반적으로 Transition으로 처리하지 않습니다.

### 4.2. Transition 업데이트

Transition 업데이트는 긴급한 사용자 입력보다 낮은 우선순위로 처리할 수 있는 State 변경입니다.

대표적인 예시는 다음과 같습니다.

- 대량의 검색 결과 렌더링
- 복잡한 데이터 필터링 결과 표시
- 탭 콘텐츠 변경
- 화면 전환
- 많은 컴포넌트가 영향을 받는 UI 업데이트

```tsx
startTransition(() => {
  setSearchResults(results);
});
```

React는 Transition 업데이트의 렌더링을 중단하고 긴급한 업데이트를 먼저 처리할 수 있습니다.

### 4.3. 우선순위 비교

| 구분 | 긴급한 업데이트 | Transition 업데이트 |
| --- | --- | --- |
| 목적 | 즉각적인 사용자 반응 | 상대적으로 비용이 큰 UI 변경 |
| 우선순위 | 높음 | 낮음 |
| 중단 가능성 | 우선 처리 대상 | 더 긴급한 업데이트에 의해 렌더링이 중단될 수 있음 |
| 주요 사용 사례 | Input, 버튼, 체크박스 | 검색 결과, 탭, 화면 전환 |
| 처리 방식 | 일반 State 업데이트 | `startTransition` 내부에서 업데이트 |

Transition은 업데이트를 지연시키기 위한 타이머가 아닙니다.

React가 렌더링 작업의 우선순위를 조정할 수 있도록 업데이트의 성격을 표시하는 기능입니다.

## 5. 검색 기능에서 useTransition 활용

`useTransition`의 대표적인 활용 사례는 검색 기능입니다.

검색어 입력과 검색 결과 렌더링은 서로 다른 우선순위를 가질 수 있습니다.

검색어 입력은 즉시 반영되어야 하지만, 검색 결과를 필터링하고 대량의 목록을 렌더링하는 작업은 상대적으로 낮은 우선순위로 처리할 수 있습니다.

### 5.1. 기본 검색 예제

```tsx
import { useState, useTransition } from 'react';

const items = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  name: `Item ${index}`,
}));

function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    // 긴급한 업데이트
    setInput(value);

    // Transition 업데이트
    startTransition(() => {
      setQuery(value);
    });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div>
      <input
        value={input}
        onChange={handleChange}
        placeholder="검색어를 입력하세요."
      />

      {isPending && <p>검색 결과를 업데이트하고 있습니다.</p>}

      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

위 예제에서는 두 개의 State를 사용합니다.

- `input`: 사용자가 입력한 실제 검색어입니다.
- `query`: 검색 결과를 계산하는 데 사용하는 검색어입니다.

Input의 입력값은 일반 State 업데이트로 즉시 반영합니다.

검색 결과에 사용하는 `query`는 Transition으로 처리합니다.

이렇게 하면 검색 결과 렌더링이 진행되는 동안에도 사용자의 입력에 우선적으로 반응할 수 있습니다.

다만 위 예제의 `filter()`는 렌더링 과정에서 동기적으로 실행됩니다. Transition은 이 JavaScript 계산을 별도의 스레드에서 실행하지 않습니다.

계산 자체가 동기적으로 오래 걸린다면 메인 스레드를 차단할 수 있습니다. 이러한 경우에는 계산 최적화, Worker 활용, 데이터 구조 개선 등을 별도로 고려해야 합니다.

또한 검색 결과를 계산하는 컴포넌트의 렌더링 비용이 실제로 크다면 `memo` 등을 활용하여 긴급한 입력 업데이트가 불필요하게 무거운 하위 컴포넌트의 렌더링까지 유발하지 않도록 구성할 수 있습니다.

## 6. Transition으로 제어할 수 없는 Input 업데이트

`useTransition`을 사용할 때 중요한 제약 중 하나는 Controlled Input의 State 업데이트를 Transition으로 처리할 수 없다는 점입니다.

다음과 같은 코드는 적절하지 않습니다.

```tsx
import { useState, useTransition } from 'react';

function Search() {
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    startTransition(() => {
      setInput(event.target.value);
    });
  };

  return (
    <input
      value={input}
      onChange={handleChange}
    />
  );
}
```

Controlled Input의 입력값은 사용자의 키 입력에 즉각적으로 반응해야 합니다.

따라서 Input을 제어하는 State 업데이트는 Transition으로 처리하지 않아야 합니다.

올바른 방식은 긴급한 입력 상태와 Transition으로 처리할 상태를 분리하는 것입니다.

```tsx
import { useState, useTransition } from 'react';

function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setInput(value);

    startTransition(() => {
      setQuery(value);
    });
  };

  return (
    <>
      <input
        value={input}
        onChange={handleChange}
      />

      {isPending && <p>검색 중...</p>}

      <SearchResults query={query} />
    </>
  );
}
```

이러한 구조에서는 Input의 반응성과 검색 결과의 렌더링 우선순위를 별도로 관리할 수 있습니다.

## 7. useTransition과 useDeferredValue 비교

`useTransition`과 `useDeferredValue`는 모두 긴급한 업데이트와 상대적으로 낮은 우선순위의 렌더링을 분리하는 데 사용합니다.

다만 적용하는 대상이 다릅니다.

- `useTransition`: State 업데이트를 Transition으로 표시합니다.
- `useDeferredValue`: 전달받은 값을 기반으로 하는 렌더링을 지연할 수 있도록 새로운 값을 반환합니다.

### 7.1. useTransition

```tsx
import { useState, useTransition } from 'react';

function Search() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setInput(value);

    startTransition(() => {
      setQuery(value);
    });
  };

  return (
    <>
      <input
        value={input}
        onChange={handleChange}
      />

      {isPending && <p>Updating...</p>}

      <SearchResults query={query} />
    </>
  );
}
```

`useTransition`은 개발자가 직접 State 업데이트를 Transition으로 표시할 수 있습니다.

따라서 State를 직접 관리하는 컴포넌트에서 업데이트 우선순위를 제어하기에 적합합니다.

### 7.2. useDeferredValue

```tsx
import { useDeferredValue, useState } from 'react';

function Search() {
  const [input, setInput] = useState('');

  const deferredInput = useDeferredValue(input);

  return (
    <>
      <input
        value={input}
        onChange={event => setInput(event.target.value)}
      />

      <SearchResults query={deferredInput} />
    </>
  );
}
```

`useDeferredValue`는 현재 값보다 늦게 반영될 수 있는 지연된 값을 제공합니다.

Input의 입력값은 즉시 변경되지만, `SearchResults`는 이전 값을 사용하여 렌더링할 수 있습니다.

### 7.3. 비교

| 구분 | useTransition | useDeferredValue |
| --- | --- | --- |
| 입력 대상 | State 업데이트 | 값 |
| 주요 기능 | State 업데이트를 Transition으로 표시 | 값의 업데이트를 지연 |
| 사용 방식 | `startTransition`으로 업데이트 감싸기 | 기존 값을 Hook에 전달 |
| Pending 상태 | `isPending` 제공 | 별도의 Pending 상태를 제공하지 않음 |
| 적합한 상황 | 업데이트를 직접 제어할 수 있는 경우 | 전달받은 값을 기반으로 렌더링을 지연해야 하는 경우 |

### 7.4. 선택 기준

다음과 같은 경우에는 `useTransition`을 고려할 수 있습니다.

- State를 직접 관리하는 컴포넌트에서 업데이트 우선순위를 제어해야 하는 경우
- 여러 State 업데이트를 하나의 Transition으로 처리해야 하는 경우
- Transition 진행 상태를 `isPending`으로 표시해야 하는 경우

다음과 같은 경우에는 `useDeferredValue`를 고려할 수 있습니다.

- 다른 컴포넌트에서 전달받은 값을 기반으로 렌더링하는 경우
- State 업데이트를 직접 제어하기 어려운 경우
- 특정 값에 의존하는 무거운 UI의 업데이트를 지연해야 하는 경우

두 Hook은 함께 사용할 수도 있지만, 일반적으로 동일한 업데이트에 중복 적용할 필요는 없습니다.

## 8. Transition과 Suspense

`useTransition`은 Suspense와 함께 사용하여 화면 전환 중 기존 UI를 유지하는 데 활용할 수 있습니다.

Suspense는 하위 컴포넌트가 아직 렌더링에 필요한 데이터를 준비하지 못한 경우 Fallback UI를 표시할 수 있습니다.

하지만 이미 표시되고 있는 화면에서 새로운 화면으로 전환하는 과정에 Suspense가 발생하면 기존 콘텐츠가 Fallback으로 대체될 수 있습니다.

Transition을 사용하면 새로운 콘텐츠가 준비되는 동안 기존 UI를 유지하도록 구성할 수 있습니다.

### 8.1. Suspense와 Transition

```tsx
import { Suspense, useState, useTransition } from 'react';

function App() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (nextTab: string) => {
    startTransition(() => {
      setTab(nextTab);
    });
  };

  return (
    <div>
      <button onClick={() => handleTabChange('home')}>
        Home
      </button>

      <button onClick={() => handleTabChange('profile')}>
        Profile
      </button>

      {isPending && <p>화면을 전환하고 있습니다.</p>}

      <Suspense fallback={<p>Loading...</p>}>
        {tab === 'home' ? <Home /> : <Profile />}
      </Suspense>
    </div>
  );
}
```

새로운 탭의 렌더링 과정에서 Suspense가 발생하더라도 Transition으로 처리된 업데이트라면 기존 콘텐츠를 유지하면서 새로운 콘텐츠가 준비되기를 기다릴 수 있습니다.

이러한 동작은 사용자가 기존 화면을 갑자기 잃어버리는 상황을 줄이는 데 도움이 됩니다.

다만 Suspense와 Transition의 동작은 경계의 위치, 기존 콘텐츠의 존재 여부, 데이터 로딩 방식 등에 따라 달라질 수 있습니다.

Transition이 모든 Suspense Fallback 표시를 방지하는 것은 아닙니다. 최초 렌더링처럼 유지할 기존 콘텐츠가 없는 경우에는 Fallback이 표시될 수 있습니다.

## 9. 비동기 Action과 useTransition

React 19에서는 Transition 내부에서 비동기 함수를 실행하는 방식이 지원됩니다.

이러한 비동기 작업은 Action으로 활용할 수 있습니다.

Action은 사용자 상호작용에 따른 비동기 작업과 그 결과로 발생하는 State 업데이트를 관리하는 데 사용할 수 있습니다.

`startTransition`에 전달한 함수가 Promise를 반환하면 React는 해당 비동기 작업이 진행되는 동안 Transition의 Pending 상태를 관리할 수 있습니다.

### 9.1. 비동기 함수 실행

```tsx
import { useState, useTransition } from 'react';

async function updateName(name: string) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('이름을 변경하지 못했습니다.');
  }

  return response.json() as Promise<{ name: string }>;
}

function Profile() {
  const [name, setName] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      await updateName(name);
    });
  };

  return (
    <div>
      <input
        value={name}
        onChange={event => setName(event.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
      >
        변경
      </button>

      {isPending && <p>변경 중...</p>}
    </div>
  );
}
```

위 예제에서는 비동기 작업을 Transition 내부에서 실행합니다.

React는 Action이 진행 중인 동안 `isPending`을 통해 진행 상태를 제공할 수 있습니다.

단, `isPending`은 네트워크 요청뿐 아니라 해당 Transition에 포함된 작업의 진행 상태를 나타냅니다. 별도의 비동기 작업 전체를 자동으로 추적하는 범용 로딩 상태는 아닙니다.

### 9.2. 비동기 작업 결과를 State에 반영

```tsx
import { useState, useTransition } from 'react';

async function updateName(name: string) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('이름을 변경하지 못했습니다.');
  }

  return response.json() as Promise<{ name: string }>;
}

function Profile() {
  const [name, setName] = useState('');
  const [savedName, setSavedName] = useState('');

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await updateName(name);

      startTransition(() => {
        setSavedName(result.name);
      });
    });
  };

  return (
    <div>
      <input
        value={name}
        onChange={event => setName(event.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
      >
        저장
      </button>

      {isPending && <p>저장 중...</p>}

      <p>저장된 이름: {savedName}</p>
    </div>
  );
}
```

비동기 함수에서 `await` 이후에 발생하는 State 업데이트는 별도의 `startTransition`으로 감싸는 것이 필요합니다.

현재 React의 Transition 동작에서는 `await` 이후의 State 업데이트가 자동으로 동일한 Transition에 포함되지 않을 수 있기 때문입니다.

### 9.3. 비동기 Action에서 주의할 점

비동기 Action을 사용할 때는 다음 사항을 고려해야 합니다.

- `await` 이전과 이후의 State 업데이트가 동일하게 처리된다고 가정하지 않습니다.
- `await` 이후의 Transition 업데이트는 필요에 따라 다시 `startTransition`으로 감쌉니다.
- 비동기 작업의 오류는 `try/catch` 또는 Error Boundary 등을 통해 처리합니다.
- 여러 비동기 요청의 실행 순서가 중요한 경우 별도의 순서 제어가 필요합니다.
- 여러 요청이 동시에 발생할 수 있다면 오래된 응답이 최신 State를 덮어쓰지 않도록 주의해야 합니다.

## 10. 비동기 Action의 오류 처리

`useTransition`은 비동기 Action에서 발생하는 오류를 자동으로 사용자에게 표시하지 않습니다.

오류를 처리하려면 `try/catch`를 사용하거나 Error Boundary와 같은 오류 처리 구조를 활용해야 합니다.

```tsx
import { useState, useTransition } from 'react';

async function updateName(name: string) {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error('이름을 변경하지 못했습니다.');
  }

  return response.json();
}

function Profile() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null);

      try {
        await updateName(name);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
        );
      }
    });
  };

  return (
    <div>
      <input
        value={name}
        onChange={event => setName(event.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
      >
        저장
      </button>

      {isPending && <p>저장 중...</p>}

      {error && <p role="alert">{error}</p>}
    </div>
  );
}
```

비동기 Action의 오류를 직접 처리하면 컴포넌트에서 오류 메시지를 표시하거나 별도의 복구 로직을 실행할 수 있습니다.

오류를 `try/catch`로 처리하지 않고 전파하는 경우에는 Error Boundary 등의 오류 처리 구조를 고려해야 합니다.

단, Error Boundary는 일반적인 이벤트 핸들러 내부에서 동기적으로 발생한 오류를 자동으로 포착하는 용도로 사용할 수 없습니다. 오류가 발생한 실행 경로와 비동기 처리 방식을 고려하여 적절한 오류 처리 구조를 선택해야 합니다.

## 11. useTransition과 useActionState

`useTransition`과 `useActionState`는 비동기 Action과 관련된 상태를 관리할 수 있지만 목적에 차이가 있습니다.

- `useTransition`: 업데이트의 우선순위를 조정하고 진행 상태를 제공합니다.
- `useActionState`: Action의 실행 결과를 State로 관리하고 Pending 상태를 제공합니다.

### 11.1. useTransition

```tsx
import { useTransition } from 'react';

function SaveButton() {
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await saveData();
    });
  }

  return (
    <button
      onClick={handleSave}
      disabled={isPending}
    >
      {isPending ? '저장 중...' : '저장'}
    </button>
  );
}
```

비동기 작업을 Transition으로 실행하고 진행 상태를 확인할 수 있습니다.

작업 결과를 별도로 관리하려면 State를 추가하거나 다른 Hook을 조합해야 합니다.

### 11.2. useActionState

```tsx
import { useActionState } from 'react';

async function submitAction(
  previousState: string,
  formData: FormData,
) {
  const name = formData.get('name');

  await saveName(String(name));

  return '저장되었습니다.';
}

function Form() {
  const [message, formAction, isPending] = useActionState(
    submitAction,
    '',
  );

  return (
    <form action={formAction}>
      <input name="name" />

      <button type="submit" disabled={isPending}>
        저장
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
```

`useActionState`는 Action의 반환값을 State로 관리하므로 폼 제출 결과나 서버 응답을 처리하는 데 유용합니다.

첫 번째 인자인 Action 함수는 이전 State와 제출된 데이터를 인자로 받으며, 반환값은 다음 State가 됩니다.

### 11.3. 비교

| 구분 | useTransition | useActionState |
| --- | --- | --- |
| 주요 목적 | Transition 업데이트 관리 | Action 결과를 State로 관리 |
| 반환값 | `isPending`, `startTransition` | `state`, dispatch 함수, `isPending` |
| 주요 사용 사례 | 화면 전환, 렌더링 우선순위 | 폼 제출, 비동기 Action 결과 |
| 결과 상태 관리 | 별도로 구현 | Hook에서 관리 |
| Pending 상태 | 제공 | 제공 |

비동기 작업의 진행 상태만 필요하다면 `useTransition`을 사용할 수 있습니다.

Action의 실행 결과까지 State로 관리해야 한다면 `useActionState`를 고려할 수 있습니다.

두 Hook은 함께 사용할 수도 있습니다. 예를 들어 Action의 결과를 관리하면서 다른 UI 업데이트의 우선순위를 별도로 제어할 수 있습니다.

## 12. useTransition과 일반적인 비동기 처리의 차이

일반적인 비동기 함수와 Transition은 서로 다른 개념입니다.

비동기 함수는 작업이 완료될 때까지 기다리는 실행 흐름을 관리합니다.

반면 Transition은 React의 State 업데이트 우선순위를 관리합니다.

```tsx
async function handleSubmit() {
  await saveData();
}
```

위 코드는 비동기 작업을 수행하지만 React의 Transition을 사용하지 않습니다.

반면 다음 코드는 비동기 작업을 Transition으로 실행합니다.

```tsx
import { useTransition } from 'react';

function SaveButton() {
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      await saveData();
    });
  }

  return (
    <button
      onClick={handleSubmit}
      disabled={isPending}
    >
      저장
    </button>
  );
}
```

두 개념을 비교하면 다음과 같습니다.

| 구분 | async/await | useTransition |
| --- | --- | --- |
| 주요 목적 | 비동기 실행 흐름 관리 | React 업데이트 우선순위 관리 |
| 실행 대기 | Promise 완료를 기다림 | 비동기 Action을 지원하며 Transition의 진행 상태를 관리 |
| UI 진행 상태 | 별도 State로 관리 | `isPending` 제공 |
| 렌더링 중단 및 재시작 | 직접 제어하지 않음 | React가 Transition 렌더링을 조정 |

비동기 함수가 포함되어 있다고 해서 자동으로 Transition이 되는 것은 아닙니다.

반대로 동기적인 State 업데이트도 `startTransition`으로 감싸면 Transition으로 처리할 수 있습니다.

## 13. Transition의 중단과 재시작

Transition 업데이트는 긴급한 업데이트가 발생하면 렌더링이 중단될 수 있습니다.

이러한 특성은 React가 사용자 입력에 빠르게 반응할 수 있도록 합니다.

예를 들어 대량의 데이터를 렌더링하는 Transition이 진행 중인 상태에서 사용자가 Input에 새로운 값을 입력하면 React는 긴급한 입력 업데이트를 우선 처리할 수 있습니다.

이후 React는 최신 State를 기준으로 Transition 렌더링을 다시 진행할 수 있습니다.

이러한 동작을 통해 오래 걸리는 렌더링 작업이 사용자 입력을 불필요하게 차단하는 상황을 줄일 수 있습니다.

다만 Transition은 JavaScript 계산 자체를 백그라운드 스레드에서 실행하는 기능이 아닙니다.

React의 렌더링 작업을 중단하고 다시 시작할 수 있도록 조정하는 기능입니다.

따라서 컴포넌트 렌더링 과정에서 실행되는 동기적인 계산이 지나치게 오래 걸리면 여전히 메인 스레드가 차단될 수 있습니다.

또한 React의 렌더링 과정은 중단되거나 다시 실행될 수 있으므로 렌더링 중 발생하는 부수 효과를 피해야 합니다. 외부 시스템과의 동기화나 DOM 조작 등은 적절한 Effect 또는 이벤트 핸들러에서 처리해야 합니다.

## 14. 여러 State 업데이트를 하나의 Transition으로 처리하기

하나의 `startTransition` 내부에서 여러 State 업데이트를 수행할 수 있습니다.

```tsx
import { useState, useTransition } from 'react';

function Dashboard() {
  const [tab, setTab] = useState('home');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest');

  const [isPending, startTransition] = useTransition();

  const handleChange = () => {
    startTransition(() => {
      setTab('posts');
      setFilter('active');
      setSort('popular');
    });
  };

  return (
    <div>
      <button onClick={handleChange}>
        게시물 화면으로 이동
      </button>

      {isPending && <p>화면을 업데이트하고 있습니다.</p>}

      <DashboardContent
        tab={tab}
        filter={filter}
        sort={sort}
      />
    </div>
  );
}
```

여러 State 업데이트를 하나의 Transition으로 묶으면 관련된 UI 변경을 동일한 우선순위로 처리할 수 있습니다.

React는 이러한 업데이트를 함께 처리할 수 있으며, Transition 진행 상태도 하나의 `isPending`으로 확인할 수 있습니다.

단, 하나의 Transition으로 묶었다고 해서 모든 업데이트가 반드시 하나의 렌더링 작업으로만 처리되는 것은 아닙니다. React는 업데이트의 우선순위와 렌더링 상황에 따라 작업을 조정합니다.

## 15. useTransition 사용 시 주의사항

### 15.1. Input State를 Transition으로 처리하지 않습니다

Controlled Input의 입력값은 즉시 반영되어야 합니다.

Input State는 일반적인 State 업데이트로 처리하고, 검색 결과와 같이 상대적으로 낮은 우선순위의 업데이트만 Transition으로 처리해야 합니다.

### 15.2. 모든 State 업데이트에 사용하지 않습니다

Transition은 모든 State 업데이트에 적용하는 기능이 아닙니다.

사용자 입력이나 즉각적인 피드백이 필요한 업데이트는 일반 State 업데이트로 처리해야 합니다.

### 15.3. 렌더링 계산 자체를 빠르게 만들지는 않습니다

`useTransition`은 React 업데이트의 우선순위를 조정합니다.

복잡한 계산이나 대량의 동기적인 JavaScript 실행을 별도의 스레드에서 처리하지 않습니다.

계산 비용이 큰 경우에는 알고리즘 최적화, 메모이제이션, Web Worker 등을 고려해야 합니다.

### 15.4. isPending을 모든 로딩 상태로 사용하지 않습니다

`isPending`은 해당 Hook에서 관리하는 Transition의 진행 상태를 나타냅니다.

Transition과 관계없는 API 요청이나 타이머의 진행 상태까지 자동으로 추적하지 않습니다.

별도의 비동기 작업이 필요하다면 해당 작업의 상태를 별도로 관리해야 합니다.

### 15.5. await 이후의 State 업데이트를 확인합니다

비동기 Action에서 `await` 이후에 발생하는 State 업데이트는 별도의 Transition으로 감싸야 할 수 있습니다.

```tsx
startTransition(async () => {
  await saveData();

  startTransition(() => {
    setSaved(true);
  });
});
```

React의 현재 비동기 Transition 동작에서는 `await` 이후의 State 업데이트가 자동으로 Transition에 포함되지 않을 수 있습니다.

따라서 `await` 이후의 업데이트 우선순위가 중요하다면 다시 `startTransition`으로 감싸는 것이 안전합니다.

### 15.6. 여러 비동기 작업의 실행 순서를 고려합니다

Transition은 비동기 작업의 실행 순서를 자동으로 보장하는 기능이 아닙니다.

여러 요청이 동시에 실행되는 경우 응답이 도착하는 순서가 요청을 보낸 순서와 다를 수 있습니다.

예를 들어 다음과 같은 상황을 고려해야 합니다.

1. 사용자가 첫 번째 요청을 실행합니다.
2. 첫 번째 요청이 완료되기 전에 두 번째 요청을 실행합니다.
3. 두 번째 요청의 응답이 먼저 도착합니다.
4. 첫 번째 요청의 응답이 나중에 도착하여 최신 State를 덮어쓸 수 있습니다.

이러한 문제를 방지하려면 요청 ID, 순서 번호, 취소 가능한 요청, 최신 요청만 반영하는 조건 등을 활용할 수 있습니다.

Transition은 UI 업데이트의 우선순위를 관리하는 기능이며, 네트워크 요청의 순서나 데이터 일관성을 보장하지 않습니다.

### 15.7. startTransition의 콜백은 동기적으로 실행됩니다

`startTransition`에 전달하는 함수는 즉시 실행됩니다.

React는 해당 함수 내부에서 발생하는 State 업데이트를 Transition으로 표시합니다.

```tsx
startTransition(() => {
  setTab('posts');
});
```

`startTransition` 자체가 콜백의 실행을 나중으로 미루거나 별도의 스레드에서 실행하는 것은 아닙니다.

React 19에서는 비동기 함수를 전달하는 Action 방식도 지원하지만, 동기적인 콜백 실행과 비동기 작업의 진행 상태 관리는 구분해야 합니다.

### 15.8. startTransition을 렌더링 중 호출하지 않습니다

`startTransition`은 이벤트 핸들러나 비동기 Action 등 적절한 실행 경로에서 호출해야 합니다.

컴포넌트 렌더링 중 State 업데이트를 발생시키는 용도로 사용해서는 안 됩니다.

렌더링 과정에서는 컴포넌트가 순수하게 동작하도록 유지해야 합니다.

### 15.9. useTransition은 컴포넌트 최상위에서 호출합니다

`useTransition`은 다른 React Hook과 마찬가지로 컴포넌트 또는 Custom Hook의 최상위에서 호출해야 합니다.

조건문, 반복문, 중첩 함수 내부에서 호출할 수 없습니다.

```tsx
function Component() {
  const [isPending, startTransition] = useTransition();

  // 이벤트 핸들러 내부에서는 startTransition을 사용할 수 있습니다.
  function handleClick() {
    startTransition(() => {
      // State 업데이트
    });
  }

  return (
    <button onClick={handleClick}>
      업데이트
    </button>
  );
}
```

Hook 호출은 컴포넌트의 렌더링 순서에 따라 일관되게 유지해야 합니다.

## 16. useTransition과 startTransition의 차이

React는 `useTransition` 외에도 `startTransition`이라는 API를 제공합니다.

두 기능은 모두 State 업데이트를 Transition으로 표시하지만 사용 방식에 차이가 있습니다.

### 16.1. useTransition

```tsx
import { useState, useTransition } from 'react';

function Tabs() {
  const [tab, setTab] = useState('home');
  const [isPending, startTransition] = useTransition();

  function handleChange() {
    startTransition(() => {
      setTab('posts');
    });
  }

  return (
    <div>
      <button onClick={handleChange}>
        게시물
      </button>

      {isPending && <p>전환 중...</p>}

      <Content tab={tab} />
    </div>
  );
}
```

`useTransition`은 Transition을 실행하는 함수와 진행 상태를 함께 제공합니다.

컴포넌트에서 Transition의 진행 상태를 표시해야 하는 경우 적합합니다.

### 16.2. startTransition

```tsx
import { startTransition, useState } from 'react';

function Tabs() {
  const [tab, setTab] = useState('home');

  function handleChange() {
    startTransition(() => {
      setTab('posts');
    });
  }

  return (
    <button onClick={handleChange}>
      게시물
    </button>
  );
}
```

`startTransition`은 React에서 제공하는 독립적인 API입니다.

Hook을 호출하지 않아도 사용할 수 있으며, Transition의 Pending 상태를 직접 제공하지는 않습니다.

따라서 별도의 Pending UI가 필요하지 않고 State 업데이트의 우선순위만 조정하면 되는 경우 사용할 수 있습니다.

### 16.3. 비교

| 구분 | useTransition | startTransition |
| --- | --- | --- |
| 형태 | React Hook | 독립적인 API |
| 호출 위치 | 컴포넌트 또는 Custom Hook 최상위 | 이벤트 핸들러 등 일반 함수 |
| Pending 상태 | `isPending` 제공 | 직접 제공하지 않음 |
| 주요 목적 | Pending 상태와 Transition 관리 | Transition 우선순위 지정 |
| 사용 사례 | 로딩 표시가 필요한 화면 전환 | Pending 상태가 필요하지 않은 업데이트 |

## 17. useTransition의 반환값과 타입

`useTransition`은 다음과 같은 튜플을 반환합니다.

```tsx
const [isPending, startTransition] = useTransition();
```

TypeScript에서는 다음과 같은 형태로 사용할 수 있습니다.

```tsx
import { useTransition } from 'react';

function Component() {
  const [isPending, startTransition] = useTransition();

  function handleUpdate() {
    startTransition(() => {
      // Transition으로 처리할 State 업데이트
    });
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={isPending}
    >
      업데이트
    </button>
  );
}
```

React가 제공하는 Hook이므로 별도의 제네릭 타입을 지정할 필요는 없습니다.

- `isPending`: `boolean`
- `startTransition`: Transition으로 처리할 함수를 전달받는 함수

TypeScript 환경에서는 `useTransition`의 반환 타입을 직접 선언하기보다 React가 제공하는 타입 추론을 사용하는 것이 일반적입니다.

## 18. 정리

`useTransition`은 React State 업데이트의 우선순위를 조정하여 긴급한 UI와 상대적으로 낮은 우선순위의 UI 업데이트를 구분하는 Hook입니다.

핵심 개념은 다음과 같습니다.

- `useTransition`은 `isPending`과 `startTransition`을 반환합니다.
- `startTransition` 내부의 State 업데이트는 Transition으로 표시됩니다.
- Transition 업데이트는 긴급한 업데이트보다 낮은 우선순위로 처리될 수 있습니다.
- 긴급한 업데이트가 발생하면 Transition 렌더링이 중단되고 다시 진행될 수 있습니다.
- Controlled Input의 입력값을 관리하는 State는 Transition으로 처리하지 않습니다.
- `useDeferredValue`는 값의 지연을 제어하고, `useTransition`은 State 업데이트의 우선순위를 직접 제어합니다.
- Suspense와 함께 사용하면 화면 전환 중 기존 콘텐츠를 유지하는 데 도움이 됩니다.
- React 19에서는 비동기 Action을 Transition 내부에서 실행할 수 있습니다.
- `await` 이후의 State 업데이트는 필요에 따라 다시 `startTransition`으로 감싸야 합니다.
- `isPending`은 모든 비동기 작업의 상태가 아니라 해당 Transition의 진행 상태를 나타냅니다.
- Transition은 JavaScript 계산 자체를 별도 스레드에서 실행하거나 네트워크 요청 순서를 보장하지 않습니다.

결과적으로 `useTransition`은 렌더링 비용이 큰 UI 업데이트가 사용자 입력이나 즉각적인 상호작용을 방해하지 않도록 React의 업데이트 우선순위를 조정하는 데 활용할 수 있습니다.

## 참고 자료

- [React 공식 문서 - useTransition](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - startTransition](https://react.dev/reference/react/startTransition)
- [React 공식 문서 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React 공식 문서 - useActionState](https://react.dev/reference/react/useActionState)
- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - Actions](https://react.dev/reference/react/useTransition#displaying-a-pending-visual-state-during-the-transition)
- [React 공식 문서 - State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React 공식 문서 - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [MDN - Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)