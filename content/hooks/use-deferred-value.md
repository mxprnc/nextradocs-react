# useDeferredValue

## 1. useDeferredValue란?

`useDeferredValue`는 특정 값의 업데이트를 지연하여 UI의 반응성을 유지하는 React Hook입니다.

일반적으로 React의 상태가 변경되면 해당 상태를 사용하는 컴포넌트가 다시 렌더링됩니다. 이때 렌더링 비용이 높은 컴포넌트가 상태 변경에 직접적으로 연결되어 있다면 사용자의 입력이나 상호작용이 지연될 수 있습니다.

`useDeferredValue`를 사용하면 특정 값의 최신 업데이트를 즉시 반영하는 대신, React가 더 중요한 작업을 먼저 처리할 수 있도록 해당 값의 업데이트를 지연할 수 있습니다.

기본 문법은 다음과 같습니다.

```tsx
const deferredValue = useDeferredValue(value);
```

- `value`: 지연할 대상 값입니다.
- `deferredValue`: React가 지연하여 반영하는 값입니다.

`deferredValue`는 처음에는 전달받은 `value`와 동일합니다. 이후 `value`가 변경되면 React는 새로운 값을 사용한 백그라운드 렌더링을 시도합니다.

백그라운드 렌더링이 완료되면 `deferredValue`가 최신 값으로 업데이트됩니다.

## 2. 기본 사용법

다음은 검색 입력값과 검색 결과 목록을 분리하는 예제입니다.

```tsx
import { useDeferredValue, useState } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');

  const deferredQuery = useDeferredValue(query);

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="검색어를 입력하세요."
      />

      <SearchResults query={deferredQuery} />
    </div>
  );
}

function SearchResults({ query }: { query: string }) {
  const results = Array.from({ length: 10000 }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
  }));

  const filteredResults = results.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ul>
      {filteredResults.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

export default SearchPage;
```

검색 입력값과 검색 결과에 서로 다른 값을 사용합니다.

- `query`: 사용자가 입력하는 최신 값입니다.
- `deferredQuery`: React가 지연하여 반영하는 검색어입니다.

사용자가 입력할 때 `query`는 즉시 변경되지만, 검색 결과는 `deferredQuery`가 업데이트된 이후 다시 렌더링됩니다.

이를 통해 검색 입력 UI가 무거운 검색 결과 렌더링에 영향을 덜 받도록 구성할 수 있습니다.

단, `useDeferredValue`는 계산 자체를 최적화하는 기능은 아닙니다. 렌더링 작업의 우선순위를 조정하여 중요한 UI 업데이트가 먼저 처리될 수 있도록 하는 기능입니다.

## 3. 지연 렌더링의 동작 방식

`useDeferredValue`는 값의 업데이트를 일정 시간 동안 지연시키는 방식이 아니라 React의 렌더링 우선순위를 활용합니다.

일반적인 동작 과정은 다음과 같습니다.

1. 사용자가 입력하거나 이벤트가 발생하여 상태가 변경됩니다.
2. `value`가 새로운 값으로 업데이트됩니다.
3. React는 새로운 `value`를 기준으로 렌더링을 시도합니다.
4. `useDeferredValue`는 기존 값을 유지한 상태로 백그라운드 렌더링을 시작할 수 있습니다.
5. 더 높은 우선순위의 업데이트가 발생하면 백그라운드 렌더링을 중단하고 해당 업데이트를 먼저 처리할 수 있습니다.
6. 백그라운드 렌더링이 완료되면 최신 `deferredValue`를 반영합니다.

예를 들어 검색어가 `react`에서 `react hooks`로 변경되는 경우 다음과 같은 흐름이 가능합니다.

```text
사용자 입력
    |
    v
query = "react hooks"
    |
    v
긴급한 입력 UI 업데이트
    |
    v
deferredQuery = "react"
    |
    v
검색 결과 백그라운드 렌더링
    |
    +---- 더 높은 우선순위 업데이트 발생
    |          |
    |          v
    |      백그라운드 렌더링 중단
    |          |
    |          v
    |      긴급한 업데이트 처리
    |
    v
백그라운드 렌더링 완료
    |
    v
deferredQuery = "react hooks"
    |
    v
최신 검색 결과 반영
```

백그라운드 렌더링은 중단되거나 다시 시작될 수 있습니다. 따라서 지연된 값을 사용하는 컴포넌트는 렌더링이 반복되더라도 올바르게 동작하도록 구성해야 합니다.

## 4. useDeferredValue의 주요 특징

### 4.1. 초기 렌더링에서는 전달받은 값과 동일합니다.

`useDeferredValue`는 컴포넌트의 최초 렌더링에서 전달받은 값을 그대로 반환합니다.

```tsx
function Example() {
  const [value, setValue] = useState('initial');

  const deferredValue = useDeferredValue(value);

  console.log(value === deferredValue); // true

  return (
    <button onClick={() => setValue('updated')}>
      Update
    </button>
  );
}
```

초기 렌더링에서는 `value`와 `deferredValue`가 동일합니다.

이후 값이 변경되면 React는 지연된 업데이트를 처리할 수 있습니다.

### 4.2. 값의 변경 여부를 Object.is로 비교합니다.

React는 이전 렌더링의 값과 새로운 값을 `Object.is`를 사용하여 비교합니다.

값이 동일하다면 새로운 백그라운드 렌더링을 시작할 필요가 없습니다.

```tsx
const deferredValue = useDeferredValue(value);
```

원시 값은 값 자체를 비교하지만 객체와 배열은 참조를 비교합니다.

따라서 렌더링마다 새로운 객체를 전달하면 실제 내용이 동일하더라도 React가 값의 변경으로 판단할 수 있습니다.

```tsx
function Example({ items }: { items: string[] }) {
  const deferredItems = useDeferredValue({
    items,
  });

  return <List items={deferredItems.items} />;
}
```

위 예제에서는 렌더링할 때마다 새로운 객체가 생성됩니다.

이러한 불필요한 참조 변경은 지연 렌더링을 반복적으로 발생시킬 수 있습니다.

필요하다면 `useMemo`를 사용하여 객체 참조를 안정화할 수 있습니다.

```tsx
function Example({ items }: { items: string[] }) {
  const value = useMemo(
    () => ({ items }),
    [items],
  );

  const deferredValue = useDeferredValue(value);

  return <List items={deferredValue.items} />;
}
```

### 4.3. 고정된 지연 시간이 존재하지 않습니다.

`useDeferredValue`는 지정된 시간만큼 업데이트를 지연하는 API가 아닙니다.

다음과 같은 방식으로 동작하지 않습니다.

```tsx
// useDeferredValue는 일정 시간 후 업데이트하는 API가 아닙니다.
setTimeout(() => {
  setDeferredValue(value);
}, 300);
```

React는 현재 렌더링 작업과 우선순위를 고려하여 지연된 업데이트를 처리합니다.

따라서 지연 시간은 고정되어 있지 않으며, 렌더링 환경과 작업량에 따라 달라질 수 있습니다.

일정 시간 동안 입력이 없을 때 검색을 실행하는 Debounce와는 목적과 동작 방식이 다릅니다.

## 5. memo와 함께 사용하기

`useDeferredValue`는 `memo`와 함께 사용하면 효과적입니다.

지연된 값을 전달하더라도 해당 값을 사용하는 컴포넌트가 부모 컴포넌트의 렌더링에 의해 매번 다시 렌더링된다면 지연 렌더링의 효과가 제한될 수 있습니다.

`memo`를 사용하면 전달받은 Props가 변경되지 않은 경우 불필요한 렌더링을 생략할 수 있습니다.

```tsx
import {
  memo,
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
        onChange={(event) => setQuery(event.target.value)}
      />

      <SearchResults query={deferredQuery} />
    </div>
  );
}

const SearchResults = memo(function SearchResults({
  query,
}: {
  query: string;
}) {
  console.log('SearchResults rendered');

  const results = Array.from(
    { length: 10000 },
    (_, index) => `Item ${index}`,
  );

  const filteredResults = results.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ul>
      {filteredResults.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});
```

이 구조에서는 다음과 같은 렌더링 흐름이 가능합니다.

1. 사용자가 검색어를 입력합니다.
2. `query`가 변경되어 부모 컴포넌트가 렌더링됩니다.
3. `deferredQuery`는 기존 값을 유지할 수 있습니다.
4. `SearchResults`에 전달되는 `query` Prop이 변경되지 않았으므로 `memo`가 렌더링을 생략할 수 있습니다.
5. React가 지연된 업데이트를 처리하면 새로운 검색어를 전달하여 `SearchResults`를 렌더링합니다.

`memo`는 `useDeferredValue`가 제공하는 지연 렌더링 효과를 활용하는 데 도움이 됩니다.

다만 `memo`는 성능 최적화 수단이며, 컴포넌트가 렌더링되지 않는다는 것을 보장하는 기능은 아닙니다.

## 6. useDeferredValue와 Suspense

`useDeferredValue`는 Suspense와 함께 사용할 수 있습니다.

지연된 값에 따라 렌더링하는 컴포넌트가 아직 준비되지 않은 데이터를 기다리는 경우, Suspense Boundary를 통해 로딩 UI를 표시할 수 있습니다.

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
        onChange={(event) => setQuery(event.target.value)}
      />

      <Suspense fallback={<p>Loading...</p>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </div>
  );
}
```

지연된 값으로 백그라운드 렌더링을 수행하는 동안 새로운 콘텐츠가 준비되지 않았다면 React는 기존에 표시된 UI를 유지할 수 있습니다.

이는 Suspense Boundary가 없는 상황에서 즉시 대체 UI를 표시하는 것과 구분됩니다.

특히 이미 콘텐츠가 표시된 상태에서 새로운 값으로 렌더링을 시도하다가 Suspense가 발생하면, React는 기존 콘텐츠를 유지하면서 백그라운드 렌더링을 진행할 수 있습니다.

이러한 동작을 활용하면 검색 결과나 화면 전환 과정에서 기존 UI가 갑자기 사라지는 현상을 줄일 수 있습니다.

단, Suspense와 데이터 로딩의 실제 연동은 사용하는 데이터 소스 및 프레임워크의 Suspense 지원 방식에 따라 달라집니다.

## 7. 지연 상태 표시하기

`useDeferredValue`를 사용하면 입력값과 지연된 값이 서로 다른 시점에 반영될 수 있습니다.

두 값의 차이를 이용하면 검색 결과가 최신 입력값을 아직 반영하지 않았다는 사실을 UI에 표시할 수 있습니다.

```tsx
import {
  useDeferredValue,
  useState,
} from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');

  const deferredQuery = useDeferredValue(query);

  const isStale = query !== deferredQuery;

  return (
    <div>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  );
}
```

`isStale`은 현재 입력값과 검색 결과에 사용되는 값이 서로 다른지를 나타냅니다.

- `isStale === true`: 검색 결과가 최신 입력값을 아직 반영하지 않은 상태입니다.
- `isStale === false`: 검색 결과가 현재 입력값을 반영한 상태입니다.

이 패턴을 활용하면 기존 검색 결과를 유지하면서 투명도를 낮추거나 로딩 표시를 추가할 수 있습니다.

단, 두 값이 다르다는 사실만으로 네트워크 요청이 진행 중인지 판단할 수는 없습니다. 실제 데이터 요청 상태는 별도의 로딩 상태로 관리해야 합니다.

## 8. useDeferredValue와 useTransition 비교

`useDeferredValue`와 `useTransition`은 모두 긴급하지 않은 업데이트를 지연하여 UI의 반응성을 유지하는 데 활용됩니다.

그러나 업데이트를 제어하는 방식에 차이가 있습니다.

### 8.1. useDeferredValue

`useDeferredValue`는 특정 값의 업데이트를 지연합니다.

```tsx
const deferredValue = useDeferredValue(value);
```

기존 상태나 Props를 직접 변경하지 않고, 해당 값을 사용하는 렌더링에 지연 우선순위를 적용할 수 있습니다.

따라서 부모로부터 전달받은 값이나 이미 존재하는 상태를 기준으로 지연된 값을 생성할 때 적합합니다.

### 8.2. useTransition

`useTransition`은 특정 상태 업데이트를 Transition으로 표시합니다.

```tsx
const [isPending, startTransition] = useTransition();

function handleClick() {
  startTransition(() => {
    setTab('profile');
  });
}
```

`startTransition` 내부에서 실행되는 상태 업데이트를 긴급하지 않은 업데이트로 표시합니다.

따라서 업데이트를 직접 발생시키는 코드에 접근할 수 있을 때 적합합니다.

### 8.3. 비교

| 구분 | useDeferredValue | useTransition |
|---|---|---|
| 목적 | 특정 값의 업데이트 지연 | 특정 상태 업데이트를 Transition으로 표시 |
| 사용 방식 | 기존 값을 전달 | 상태 업데이트 함수를 전달 |
| 상태 변경 | 기존 상태를 직접 변경하지 않음 | 내부 상태 업데이트를 Transition으로 처리 |
| 주요 반환값 | 지연된 값 | `isPending`, `startTransition` |
| 활용 사례 | Props 및 상태값 기반 렌더링 지연 | 탭 전환, 화면 변경, 목록 업데이트 |
| 사용 시점 | 값 자체를 지연하고 싶을 때 | 상태 업데이트의 우선순위를 지정하고 싶을 때 |

두 Hook은 서로 대체 관계라기보다 상황에 따라 선택할 수 있는 API입니다.

또한 `useDeferredValue`로 지연된 값을 사용하는 경우에도 `useTransition`을 별도로 사용하여 다른 상태 업데이트를 Transition으로 처리할 수 있습니다.

## 9. useDeferredValue와 Debounce 비교

`useDeferredValue`와 Debounce는 모두 특정 작업이 즉시 실행되지 않도록 하는 데 활용될 수 있지만, 목적과 동작 방식은 다릅니다.

### 9.1. Debounce

Debounce는 일정 시간 동안 이벤트가 발생하지 않을 때 작업을 실행하는 기법입니다.

예를 들어 검색 입력이 발생할 때마다 300ms 타이머를 초기화하고, 300ms 동안 추가 입력이 없으면 API 요청을 실행할 수 있습니다.

```tsx
import { useEffect, useState } from 'react';

function useDebouncedValue<T>(
  value: T,
  delay: number,
): T {
  const [debouncedValue, setDebouncedValue] =
    useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

위 예제는 입력값이 변경될 때마다 이전 타이머를 정리하고 새로운 타이머를 등록합니다.

일정 시간 동안 추가 변경이 발생하지 않으면 지연된 값을 업데이트합니다.

### 9.2. 차이점

| 구분 | useDeferredValue | Debounce |
|---|---|---|
| 목적 | 렌더링 우선순위 조정 | 이벤트 발생 후 작업 실행 시점 조절 |
| 지연 기준 | React 스케줄러 | 지정된 시간 |
| 지연 시간 | 고정되지 않음 | 개발자가 지정 |
| 렌더링 | 백그라운드 렌더링 가능 | 별도의 렌더링 우선순위 제어 기능 없음 |
| 주요 활용 | 비용이 높은 UI 렌더링 | 검색 API 요청, 자동 저장, 입력 이벤트 처리 |

예를 들어 검색어를 입력할 때 다음과 같이 조합할 수 있습니다.

- Debounce: 검색 API 요청 빈도를 줄입니다.
- `useDeferredValue`: 검색 결과를 렌더링하는 동안 입력 UI의 반응성을 유지합니다.

두 기능은 서로 다른 문제를 해결하므로 함께 사용할 수 있습니다.

## 10. useDeferredValue 사용 시 주의사항

### 10.1. 모든 렌더링 비용을 해결하지는 않습니다.

`useDeferredValue`는 렌더링 우선순위를 조정하는 기능입니다.

컴포넌트 내부의 계산 자체를 빠르게 만들거나 렌더링 비용을 제거하지는 않습니다.

예를 들어 다음과 같은 계산은 지연된 렌더링에서도 동일하게 수행됩니다.

```tsx
const filteredItems = items.filter((item) =>
  item.name.includes(query),
);
```

대량의 데이터 처리로 렌더링이 느려지는 경우 다음 방법을 함께 검토해야 합니다.

- 불필요한 계산을 줄입니다.
- `useMemo`를 활용하여 계산 결과를 캐싱합니다.
- `memo`를 활용하여 불필요한 컴포넌트 렌더링을 줄입니다.
- 가상화 라이브러리를 활용하여 화면에 표시되는 항목만 렌더링합니다.
- 데이터 검색 및 필터링을 서버 측에서 처리합니다.

### 10.2. 객체와 배열의 참조를 주의해야 합니다.

렌더링마다 새로운 객체나 배열을 전달하면 `Object.is` 비교에서 변경된 값으로 판단될 수 있습니다.

```tsx
// 렌더링마다 새로운 객체가 생성됩니다.
const deferredValue = useDeferredValue({
  query,
  filters,
});
```

필요한 경우 `useMemo`로 객체 참조를 안정화해야 합니다.

```tsx
const value = useMemo(
  () => ({
    query,
    filters,
  }),
  [query, filters],
);

const deferredValue = useDeferredValue(value);
```

### 10.3. 상태 업데이트 자체를 지연시키는 기능은 아닙니다.

`useDeferredValue`는 전달받은 상태를 변경하거나 업데이트하는 API가 아닙니다.

기존 상태는 즉시 변경될 수 있으며, 해당 상태를 사용하는 렌더링에 지연된 값을 제공합니다.

따라서 입력값 자체의 변경을 지연시키려는 목적이라면 적절하지 않습니다.

### 10.4. 백그라운드 렌더링은 중단될 수 있습니다.

지연된 렌더링은 더 높은 우선순위의 업데이트가 발생하면 중단될 수 있습니다.

따라서 렌더링 과정에서 외부 시스템을 직접 변경하거나 부수 효과를 실행해서는 안 됩니다.

React 컴포넌트는 순수하게 작성하고, 외부 시스템과의 동기화는 Effect 등의 적절한 수단을 사용해야 합니다.

### 10.5. 모든 값에 적용할 필요는 없습니다.

값의 변경에 따른 렌더링 비용이 크지 않다면 `useDeferredValue`를 사용할 필요가 없습니다.

불필요한 지연은 오히려 UI에 표시되는 정보가 최신 상태를 반영하지 못하는 시간을 늘릴 수 있습니다.

실제 성능 문제가 확인되는 경우에 적용하는 것이 좋습니다.

## 11. TypeScript와 함께 사용하기

`useDeferredValue`는 전달받은 값의 타입을 유지하므로 일반적인 TypeScript 환경에서는 별도의 제네릭 타입 지정이 필요하지 않습니다.

```tsx
import {
  useDeferredValue,
  useState,
} from 'react';

function SearchPage() {
  const [query, setQuery] = useState<string>('');

  const deferredQuery = useDeferredValue(query);

  // deferredQuery의 타입은 string입니다.
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

function SearchResults({
  query,
}: {
  query: string;
}) {
  return <p>검색어: {query}</p>;
}
```

객체나 배열을 전달하는 경우에도 기존 타입이 유지됩니다.

```tsx
type SearchFilters = {
  category: string;
  sort: 'asc' | 'desc';
};

function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    sort: 'asc',
  });

  const deferredFilters = useDeferredValue(filters);

  // deferredFilters의 타입은 SearchFilters입니다.
  return <SearchResults filters={deferredFilters} />;
}
```

React의 타입 정의에서는 `useDeferredValue`를 제네릭 함수로 제공하므로 전달한 값의 타입을 추론할 수 있습니다.

## 12. React Compiler와 useDeferredValue

React Compiler는 컴포넌트와 Hook의 렌더링 최적화를 자동으로 수행할 수 있습니다.

Compiler가 적용된 환경에서는 불필요한 메모이제이션을 직접 작성하지 않아도 되는 경우가 있습니다.

다만 `useDeferredValue`는 단순히 불필요한 렌더링을 방지하기 위한 API가 아닙니다.

특정 값의 업데이트를 지연하여 렌더링 우선순위를 조정하는 기능이므로 React Compiler가 적용되어 있어도 사용 목적이 유효합니다.

`useDeferredValue`와 `memo`, `useMemo`는 서로 다른 목적을 가진 기능입니다.

- `useDeferredValue`: 특정 값의 업데이트를 지연합니다.
- `memo`: 컴포넌트의 불필요한 렌더링을 생략할 수 있습니다.
- `useMemo`: 계산 결과를 메모이제이션합니다.
- React Compiler: 컴포넌트와 Hook의 메모이제이션을 자동으로 최적화할 수 있습니다.

## 13. 정리

`useDeferredValue`는 React의 렌더링 우선순위를 활용하여 특정 값의 업데이트를 지연하는 Hook입니다.

주요 특징은 다음과 같습니다.

- 특정 값의 최신 업데이트를 지연된 렌더링으로 처리할 수 있습니다.
- 긴급한 UI 업데이트가 먼저 처리될 수 있도록 지원합니다.
- 백그라운드 렌더링은 중단되거나 다시 시작될 수 있습니다.
- 지연 시간은 고정되어 있지 않습니다.
- `memo`와 함께 사용하면 지연 렌더링의 효과를 활용하기 좋습니다.
- Suspense와 함께 사용하면 기존 UI를 유지하면서 새로운 콘텐츠를 준비할 수 있습니다.
- Debounce와 달리 시간 기반의 이벤트 지연이나 API 요청 제어 기능은 아닙니다.

`useDeferredValue`는 입력 필드, 검색 결과, 대규모 목록, 복잡한 필터링 UI처럼 즉각적인 사용자 상호작용과 비용이 높은 렌더링 작업을 분리해야 하는 상황에서 유용합니다.

다만 렌더링 비용 자체를 제거하는 기능은 아니므로 `memo`, `useMemo`, 가상화 및 데이터 처리 최적화와 함께 적절하게 사용해야 합니다.

## 참고 자료

- [React 공식 문서 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React 공식 문서 - useTransition](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - memo](https://react.dev/reference/react/memo)
- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - useMemo](https://react.dev/reference/react/useMemo)
- [React 공식 문서 - React Compiler](https://react.dev/learn/react-compiler)

