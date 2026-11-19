# Rendering Optimization

## 1. 개요

React의 렌더링 최적화(Rendering Optimization)는 컴포넌트의 불필요한 렌더링과 반복적인 계산을 줄여 애플리케이션의 응답성과 성능을 개선하는 작업입니다.

React는 컴포넌트의 Props, State, Context 등이 변경되면 새로운 UI를 계산하는 렌더링 과정을 수행합니다. 이 과정에서 부모 컴포넌트가 업데이트되면 자식 컴포넌트도 기본적으로 다시 렌더링될 수 있습니다.

일반적으로 컴포넌트의 렌더링 자체는 가벼운 작업이지만, 다음과 같은 상황에서는 성능 저하가 발생할 수 있습니다.

- 부모 컴포넌트의 업데이트로 인해 불필요한 자식 컴포넌트 렌더링이 반복되는 경우
- 렌더링 과정에서 비용이 높은 계산을 반복적으로 수행하는 경우
- 컴포넌트 간 상태 공유 범위가 지나치게 넓은 경우
- Effect를 통한 연속적인 상태 업데이트가 발생하는 경우
- 대량의 데이터를 한 번에 렌더링하는 경우
- 불필요한 객체 및 함수 참조 변경으로 메모이제이션이 무효화되는 경우

React의 렌더링 최적화는 이러한 문제를 파악하고 필요한 작업만 수행하도록 컴포넌트 구조와 데이터 흐름을 개선하는 데 목적이 있습니다.

## 2. React 렌더링 과정과 최적화 대상

React의 렌더링 과정은 크게 Trigger, Render, Commit 단계로 구분할 수 있습니다.

### 2.1. Trigger

렌더링을 시작하게 만드는 업데이트가 발생하는 단계입니다.

대표적인 렌더링 트리거는 다음과 같습니다.

- 컴포넌트의 State 변경
- 부모 컴포넌트의 렌더링
- 컴포넌트가 구독하는 Context 값 변경
- 외부 스토어 업데이트를 구독하는 컴포넌트의 업데이트

### 2.2. Render

React가 컴포넌트를 호출하여 새로운 UI 구조를 계산하는 단계입니다.

이 과정에서 컴포넌트 함수가 실행되고 JSX가 평가됩니다.

```tsx
type User = {
  id: number;
  name: string;
};

type UserListProps = {
  users: User[];
};

function UserList({ users }: UserListProps) {
  console.log('UserList rendered');

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

컴포넌트가 렌더링되면 함수 본문이 다시 실행됩니다. 따라서 함수 내부에서 수행하는 계산이나 객체 생성도 다시 실행될 수 있습니다.

### 2.3. Commit

Render 단계에서 계산된 변경 사항을 실제 DOM에 반영하는 단계입니다.

React는 이전 렌더링 결과와 새로운 렌더링 결과를 비교하여 필요한 DOM 변경 사항을 적용합니다.

여기서 중요한 점은 **컴포넌트의 리렌더링이 반드시 실제 DOM 변경을 의미하지는 않는다는 것**입니다.

컴포넌트 함수가 다시 실행되더라도 결과가 이전과 동일하다면 실제 DOM 업데이트가 발생하지 않을 수 있습니다.

따라서 렌더링 최적화에서는 다음 두 가지를 구분해야 합니다.

- 불필요한 컴포넌트 렌더링 및 계산 감소
- 실제 DOM 변경 및 브라우저 렌더링 비용 감소

두 작업은 서로 연관되어 있지만 동일한 개념은 아닙니다.

## 3. 불필요한 리렌더링 방지

React는 기본적으로 부모 컴포넌트가 다시 렌더링되면 자식 컴포넌트도 렌더링을 수행할 수 있습니다.

자식 컴포넌트가 부모의 업데이트와 무관한 작업을 수행한다면 불필요한 계산이 발생할 수 있습니다.

### 3.1. React.memo

`React.memo`는 컴포넌트의 Props가 이전 렌더링과 동일하면 부모 컴포넌트의 렌더링으로 인한 자식 컴포넌트의 리렌더링을 생략할 수 있도록 하는 고차 컴포넌트(Higher-Order Component)입니다.

```tsx
import { memo, useState } from 'react';

type UserProfileProps = {
  name: string;
  age: number;
};

const UserProfile = memo(function UserProfile({
  name,
  age,
}: UserProfileProps) {
  console.log('UserProfile rendered');

  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Count: {count}
      </button>

      <UserProfile name="Alice" age={25} />
    </div>
  );
}
```

위 예제에서 `App`의 `count`가 변경되면 부모 컴포넌트는 다시 렌더링됩니다.

그러나 `UserProfile`에 전달되는 `name`과 `age`가 이전 Props와 동일하다면 `UserProfile`의 리렌더링을 생략할 수 있습니다.

`React.memo`는 기본적으로 Props를 얕게 비교(Shallow Comparison)합니다. 각 Props의 변경 여부는 `Object.is`를 기준으로 판단합니다.

다음과 같은 경우에는 메모이제이션이 정상적으로 활용되지 않을 수 있습니다.

```tsx
function App() {
  const [count, setCount] = useState(0);

  const user = {
    name: 'Alice',
    age: 25,
  };

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        {count}
      </button>

      <UserProfile user={user} />
    </div>
  );
}
```

`App`이 다시 렌더링될 때마다 새로운 `user` 객체가 생성됩니다.

객체의 내부 속성이 동일하더라도 참조가 달라지므로 `React.memo`의 기본 비교에서는 변경된 Props로 판단합니다.

이러한 상황에서는 `useMemo` 등을 활용하여 객체 참조를 안정적으로 유지할 수 있습니다.

단, `React.memo`는 렌더링을 생략할 수 있도록 돕는 성능 최적화 기능이지 렌더링을 반드시 방지하는 보장은 아닙니다. 컴포넌트 자체의 State나 Context가 변경되면 메모이제이션된 컴포넌트도 다시 렌더링될 수 있습니다.

## 4. 메모이제이션(Memoization)

메모이제이션은 이전에 계산한 결과나 함수 참조를 캐싱하여 동일한 입력에 대한 반복 작업을 줄이는 최적화 기법입니다.

React에서는 주로 다음 기능을 활용합니다.

- `useMemo`: 계산 결과 캐싱
- `useCallback`: 함수 참조 캐싱
- `React.memo`: 컴포넌트 렌더링 생략

### 4.1. useMemo

`useMemo`는 계산 결과를 메모이제이션하는 Hook입니다.

지정한 의존성 배열의 값이 변경되지 않으면 이전에 계산한 결과를 재사용합니다.

```tsx
import { useMemo, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
};

type ProductListProps = {
  products: Product[];
};

function ProductList({ products }: ProductListProps) {
  const [keyword, setKeyword] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.includes(keyword)
    );
  }, [products, keyword]);

  return (
    <div>
      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name}: {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

위 예제에서 `filteredProducts`는 `products` 또는 `keyword`가 변경될 때만 다시 계산됩니다.

다른 State가 변경되어 컴포넌트가 리렌더링되더라도 두 의존성이 동일하다면 기존 계산 결과를 재사용합니다.

`useMemo`는 다음과 같은 경우에 유용합니다.

- 대량의 데이터를 필터링하거나 정렬하는 등 계산 비용이 높은 경우
- 계산 결과를 `React.memo`로 감싼 자식 컴포넌트에 전달하는 경우
- 다른 Hook의 의존성으로 사용하는 객체나 배열의 참조를 안정적으로 유지해야 하는 경우

반대로 단순한 산술 연산이나 비용이 거의 발생하지 않는 계산에는 불필요할 수 있습니다.

### 4.2. useCallback

`useCallback`은 함수 정의를 메모이제이션하여 렌더링 사이에 동일한 함수 참조를 재사용할 수 있도록 하는 Hook입니다.

```tsx
import { memo, useCallback, useState } from 'react';

type ButtonProps = {
  onClick: () => void;
};

const ActionButton = memo(function ActionButton({
  onClick,
}: ButtonProps) {
  console.log('ActionButton rendered');

  return <button onClick={onClick}>Execute</button>;
});

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Action executed');
  }, []);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Count: {count}
      </button>

      <ActionButton onClick={handleClick} />
    </div>
  );
}
```

일반적으로 컴포넌트 내부에서 함수를 선언하면 컴포넌트가 다시 실행될 때마다 새로운 함수 객체가 생성됩니다.

`useCallback`을 사용하면 의존성이 변경되지 않는 동안 이전 함수 참조를 재사용할 수 있습니다.

다음과 같은 경우에 유용합니다.

- `React.memo`로 감싼 자식 컴포넌트에 함수를 전달하는 경우
- 다른 Hook의 의존성으로 함수를 사용하는 경우
- 함수 참조의 안정성이 필요한 API를 사용하는 경우

다만 `useCallback`은 함수의 실행 결과를 캐싱하는 기능이 아닙니다. 함수 참조를 캐싱하는 기능입니다.

또한 `useCallback` 내부에서 참조하는 State나 Props가 변경되면 새로운 함수 참조가 반환됩니다.

### 4.3. 메모이제이션 기능 비교

| 기능 | 최적화 대상 | 주요 목적 |
|---|---|---|
| `React.memo` | 컴포넌트 | Props가 동일한 경우 리렌더링 생략 |
| `useMemo` | 계산 결과 | 반복적인 계산 방지 |
| `useCallback` | 함수 참조 | 불필요한 함수 참조 변경 방지 |

세 기능은 서로 다른 대상을 최적화하지만 함께 사용하여 효과를 얻을 수도 있습니다.

```tsx
const value = useMemo(() => calculateValue(data), [data]);

const handleClick = useCallback(() => {
  execute(value);
}, [value]);

const MemoizedComponent = memo(Component);
```

메모이제이션은 성능 최적화를 위한 수단이며 애플리케이션의 정상적인 동작을 보장하기 위한 수단으로 사용해서는 안 됩니다.

## 5. 컴포넌트 구조를 통한 최적화

메모이제이션을 적용하지 않고도 컴포넌트 구조를 개선하여 불필요한 렌더링을 줄일 수 있습니다.

### 5.1. State의 지역화(State Colocation)

State는 해당 상태를 실제로 사용하는 컴포넌트와 가까운 위치에 배치하는 것이 좋습니다.

상태를 지나치게 상위 컴포넌트로 끌어올리면 관련 없는 컴포넌트까지 반복적으로 렌더링될 수 있습니다.

다음은 상위 컴포넌트에서 입력 상태를 관리하는 예제입니다.

```tsx
function App() {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      <Header />
      <SearchInput value={keyword} onChange={setKeyword} />
      <ProductList keyword={keyword} />
      <Footer />
    </div>
  );
}
```

입력값이 변경될 때마다 `App`이 다시 렌더링되므로 `Header`, `ProductList`, `Footer` 등의 자식 컴포넌트도 렌더링 대상이 될 수 있습니다.

입력 상태를 별도의 컴포넌트로 분리하면 업데이트 범위를 줄일 수 있습니다.

```tsx
function SearchSection() {
  const [keyword, setKeyword] = useState('');

  return (
    <div>
      <SearchInput value={keyword} onChange={setKeyword} />
      <ProductList keyword={keyword} />
    </div>
  );
}

function App() {
  return (
    <div>
      <Header />
      <SearchSection />
      <Footer />
    </div>
  );
}
```

이제 검색어가 변경되더라도 `App` 자체는 검색 상태의 변경으로 인해 다시 렌더링되지 않습니다.

State의 지역화는 다음과 같은 상황에서 유용합니다.

- 특정 컴포넌트에서만 사용하는 입력 상태
- 모달 및 드롭다운의 열림 여부
- 특정 영역에서만 사용하는 UI 상태
- 일시적인 사용자 인터랙션 상태

모든 State를 전역으로 관리하거나 상위 컴포넌트에 배치하는 것보다 실제 사용 범위에 맞게 배치하는 것이 효율적입니다.

### 5.2. 컴포넌트 분리(Component Splitting)

하나의 컴포넌트가 서로 다른 업데이트 주기를 가진 여러 UI 영역을 포함한다면 이를 별도의 컴포넌트로 분리할 수 있습니다.

```tsx
function Dashboard() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <DashboardHeader />

      <Counter
        count={count}
        onIncrement={() => setCount((prev) => prev + 1)}
      />

      <DashboardContent />
    </div>
  );
}
```

`Dashboard`의 State가 변경되면 하위 컴포넌트도 렌더링될 수 있습니다.

컴포넌트 분리는 책임과 상태 변경 범위를 명확하게 만들며, 필요한 경우 `React.memo` 등을 적용할 수 있는 단위를 제공합니다.

단순히 컴포넌트의 개수를 늘리는 것이 목적은 아닙니다. 독립적인 상태와 렌더링 책임을 기준으로 분리하는 것이 중요합니다.

### 5.3. Children을 활용한 컴포넌트 구성

컴포넌트가 다른 UI를 감싸는 역할을 수행한다면 `children`을 활용할 수 있습니다.

```tsx
import type { ReactNode } from 'react';

type PanelProps = {
  children: ReactNode;
};

function Panel({ children }: PanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button onClick={() => setOpen((prev) => !prev)}>
        Toggle
      </button>

      {open && children}
    </section>
  );
}

function App() {
  return (
    <Panel>
      <ExpensiveComponent />
    </Panel>
  );
}
```

`Panel`의 State가 변경되어 다시 렌더링되더라도 부모인 `App`이 다시 렌더링되지 않았다면 기존 `children` 요소를 재사용할 수 있습니다.

이를 통해 감싸는 컴포넌트의 상태 변경이 하위 UI의 불필요한 렌더링으로 이어지는 것을 방지할 수 있습니다.

## 6. 불필요한 Effect와 상태 업데이트 제거

React에서 성능 저하를 일으키는 주요 원인 중 하나는 불필요한 Effect를 통해 발생하는 연속적인 State 업데이트입니다.

다음 예제는 Props를 기반으로 계산할 수 있는 값을 별도의 State로 관리하는 경우입니다.

```tsx
function ProductList({ products }: ProductListProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) => product.price > 1000)
    );
  }, [products]);

  return (
    <ul>
      {filteredProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

이 구조에서는 다음과 같은 작업이 발생합니다.

1. `products`가 변경됩니다.
2. 컴포넌트가 렌더링됩니다.
3. Effect가 실행됩니다.
4. `setFilteredProducts`가 호출됩니다.
5. State가 변경되어 컴포넌트가 다시 렌더링됩니다.

계산된 값을 State로 별도 관리할 필요가 없다면 렌더링 과정에서 직접 계산하는 것이 적절합니다.

```tsx
function ProductList({ products }: ProductListProps) {
  const filteredProducts = products.filter(
    (product) => product.price > 1000
  );

  return (
    <ul>
      {filteredProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

계산 비용이 높은 경우에는 `useMemo`를 적용할 수 있습니다.

```tsx
const filteredProducts = useMemo(
  () => products.filter((product) => product.price > 1000),
  [products]
);
```

Effect는 외부 시스템과 동기화하기 위한 용도로 사용하는 것이 적절합니다. 단순히 다른 State나 Props로부터 파생되는 값을 계산하기 위해 Effect를 사용하는 것은 피하는 것이 좋습니다.

## 7. 대량 데이터 렌더링 최적화

대량의 데이터를 한 번에 렌더링하면 컴포넌트 생성, DOM 노드 관리 및 브라우저 레이아웃 계산에 상당한 비용이 발생할 수 있습니다.

이러한 문제를 해결하기 위해 데이터 렌더링 범위를 제한하는 기법을 사용할 수 있습니다.

### 7.1. 리스트 가상화(List Virtualization)

리스트 가상화는 실제 화면에 표시되는 항목만 렌더링하고 화면 밖의 항목은 필요할 때 렌더링하는 기법입니다.

예를 들어 10,000개의 데이터를 일반적인 방식으로 렌더링하면 상당수의 DOM 노드가 동시에 생성됩니다.

가상화를 적용하면 화면에 표시되는 일부 항목만 렌더링하므로 DOM 노드 수와 업데이트 비용을 줄일 수 있습니다.

대표적인 라이브러리는 다음과 같습니다.

- TanStack Virtual
- react-window

리스트 가상화는 다음과 같은 UI에 적합합니다.

- 대량의 테이블 데이터
- 메시지 목록
- 상품 목록
- 로그 뷰어
- 무한 스크롤 기반 데이터 목록

### 7.2. Pagination과 Infinite Scroll

Pagination과 Infinite Scroll은 한 번에 처리하는 데이터의 양을 제한하는 기법입니다.

**Pagination**은 데이터를 페이지 단위로 나누어 표시합니다.

**Infinite Scroll**은 사용자가 목록의 하단에 도달하면 추가 데이터를 불러옵니다.

두 방식 모두 초기 렌더링 시 처리해야 하는 데이터의 양을 줄일 수 있습니다.

다만 Infinite Scroll은 데이터를 계속 누적하면 DOM 노드가 증가할 수 있으므로, 대량 데이터를 처리하는 경우 리스트 가상화를 함께 고려하는 것이 좋습니다.

## 8. 렌더링 성능 측정

성능 최적화는 실제 측정 결과를 기반으로 진행해야 합니다.

렌더링이 발생한다는 사실만으로 성능 문제가 있다고 판단해서는 안 됩니다.

### 8.1. React Developer Tools Profiler

React Developer Tools의 Profiler는 컴포넌트의 렌더링 성능을 분석할 수 있는 도구입니다.

주요 분석 항목은 다음과 같습니다.

- 어떤 컴포넌트가 렌더링되었는지
- 렌더링에 소요된 시간
- 어떤 업데이트로 렌더링이 발생했는지
- 컴포넌트별 렌더링 빈도
- 불필요한 리렌더링이 발생하는 위치

Profiler를 사용하면 실제 성능 병목이 발생하는 컴포넌트를 확인하고 최적화 대상을 선정할 수 있습니다.

### 8.2. React Profiler API

React는 프로그래밍 방식으로 렌더링 성능을 측정할 수 있도록 `Profiler` 컴포넌트를 제공합니다.

```tsx
import { Profiler } from 'react';

type ProfilerCallbackProps = {
  id: string;
  phase: 'mount' | 'update' | 'nested-update';
  actualDuration: number;
  baseDuration: number;
};

function onRender(
  id: string,
  phase: ProfilerCallbackProps['phase'],
  actualDuration: number,
  baseDuration: number
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
  });
}

function App() {
  return (
    <Profiler id="ProductList" onRender={onRender}>
      <ProductList products={products} />
    </Profiler>
  );
}
```

주요 측정값은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `id` | 측정 대상 Profiler의 식별자 |
| `phase` | 마운트 또는 업데이트 구분 |
| `actualDuration` | 해당 커밋에서 하위 트리를 렌더링하는 데 소요된 시간 |
| `baseDuration` | 메모이제이션이 적용되지 않았다고 가정했을 때 하위 트리의 렌더링 예상 비용 |

`actualDuration`과 `baseDuration`을 비교하면 메모이제이션 등의 최적화가 렌더링 비용을 얼마나 줄였는지 파악하는 데 도움이 됩니다.

참고로 일반적인 개발 환경에서는 Strict Mode 등의 영향으로 렌더링 횟수와 시간이 실제 프로덕션 환경과 다를 수 있습니다. 정확한 성능 측정에는 프로덕션 빌드와 실제 사용자 환경에 가까운 조건을 사용하는 것이 좋습니다.

## 9. React Compiler

React Compiler는 컴파일 시점에 React 코드를 분석하고 자동으로 메모이제이션을 적용하는 빌드 도구입니다.

기존에는 컴포넌트의 불필요한 리렌더링이나 계산을 줄이기 위해 개발자가 직접 `React.memo`, `useMemo`, `useCallback`을 적용해야 하는 경우가 많았습니다.

React Compiler는 React의 규칙을 분석하여 필요한 메모이제이션을 자동으로 적용할 수 있습니다.

기존 방식은 다음과 같습니다.

```tsx
import { memo, useCallback, useMemo } from 'react';

const ProductList = memo(function ProductList({
  products,
  onSelect,
}: ProductListProps) {
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products]
  );

  const handleSelect = useCallback(
    (id: number) => {
      onSelect(id);
    },
    [onSelect]
  );

  return (
    <ul>
      {sortedProducts.map((product) => (
        <li key={product.id}>
          <button onClick={() => handleSelect(product.id)}>
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
});
```

React Compiler를 적용하면 다음과 같이 수동 메모이제이션 코드를 줄일 수 있습니다.

```tsx
function ProductList({
  products,
  onSelect,
}: ProductListProps) {
  const sortedProducts = [...products].sort(
    (a, b) => a.price - b.price
  );

  const handleSelect = (id: number) => {
    onSelect(id);
  };

  return (
    <ul>
      {sortedProducts.map((product) => (
        <li key={product.id}>
          <button onClick={() => handleSelect(product.id)}>
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

React Compiler는 컴포넌트와 Hook 내부의 코드를 분석하여 필요한 메모이제이션을 자동으로 적용합니다.

다만 다음 사항에 유의해야 합니다.

- React Compiler는 잘못된 State 관리나 컴포넌트 설계를 자동으로 해결하지 않습니다.
- 렌더링 과정에서 발생하는 불필요한 Effect와 상태 업데이트는 별도로 개선해야 합니다.
- 컴파일러가 최적화할 수 있도록 React의 규칙을 준수해야 합니다.
- 컴파일러를 사용하더라도 성능 측정과 프로파일링은 여전히 중요합니다.
- 기존의 수동 메모이제이션 코드를 무조건 제거하기보다는 컴파일 결과와 동작을 검증해야 합니다.

React Compiler가 적용된 환경에서는 수동 메모이제이션의 필요성이 크게 줄어들지만, 모든 상황에서 메모이제이션을 직접 제어할 수 있는 방법이 불필요해지는 것은 아닙니다.

## 10. 렌더링 최적화 시 주의사항

렌더링 최적화는 무조건 많은 최적화 기법을 적용하는 것이 아니라 실제 성능 문제를 해결하는 데 집중해야 합니다.

### 10.1. 무분별한 메모이제이션 지양

모든 컴포넌트에 `React.memo`를 적용하거나 모든 함수에 `useCallback`을 적용하는 것은 권장되지 않습니다.

메모이제이션 자체에도 의존성 비교 및 캐시 관리 비용이 발생하며 코드 복잡도가 증가할 수 있습니다.

실제 렌더링 비용이 크거나 반복적인 계산이 문제가 되는 경우에 적용하는 것이 좋습니다.

### 10.2. 불필요한 객체 및 함수 생성 주의

컴포넌트가 렌더링될 때마다 새로운 객체나 함수가 생성되면 참조 비교를 기반으로 하는 메모이제이션의 효과가 감소할 수 있습니다.

특히 객체, 배열, 함수를 Props로 전달할 때 주의해야 합니다.

### 10.3. 렌더링 로직의 순수성 유지

React 컴포넌트의 렌더링 로직은 동일한 Props와 State에 대해 동일한 결과를 반환하도록 유지하는 것이 좋습니다.

렌더링 과정에서 외부 상태를 직접 변경하거나 부수 효과를 수행하면 예측하기 어려운 동작과 성능 문제가 발생할 수 있습니다.

### 10.4. State 업데이트 최소화

하나의 사용자 인터랙션으로 여러 번의 불필요한 State 업데이트가 발생하지 않도록 관리해야 합니다.

가능하면 파생 가능한 값을 별도 State로 관리하지 않고 기존 Props나 State를 기반으로 계산하는 것이 좋습니다.

### 10.5. 실제 성능 측정 우선

최적화 기법을 적용하기 전에 성능 병목을 먼저 확인해야 합니다.

개발 환경에서 렌더링 횟수만 확인하는 것보다 실제 사용자 환경에서 발생하는 지연 시간과 상호작용 응답성을 측정하는 것이 중요합니다.

## 11. 정리

React의 렌더링 최적화는 불필요한 컴포넌트 렌더링, 반복적인 계산, 과도한 DOM 노드 생성 및 불필요한 상태 업데이트를 줄이는 데 목적이 있습니다.

주요 최적화 기법은 다음과 같습니다.

| 최적화 기법 | 주요 목적 |
|---|---|
| `React.memo` | Props가 동일한 컴포넌트의 리렌더링 생략 |
| `useMemo` | 비용이 높은 계산 결과 재사용 |
| `useCallback` | 함수 참조 안정화 |
| State Colocation | 상태 변경에 따른 렌더링 범위 축소 |
| Component Splitting | 독립적인 렌더링 단위 구성 |
| List Virtualization | 대량 데이터의 DOM 렌더링 범위 제한 |
| Effect 최적화 | 불필요한 연속 렌더링 방지 |
| React Compiler | 컴파일 시점의 자동 메모이제이션 |

효과적인 렌더링 최적화를 위해서는 다음 순서를 권장합니다.

1. Profiler를 사용하여 성능 병목을 확인합니다.
2. 불필요한 State 및 Effect를 제거합니다.
3. State의 위치와 컴포넌트 구조를 개선합니다.
4. 대량 데이터 렌더링 방식을 개선합니다.
5. 필요한 경우 메모이제이션을 적용합니다.
6. React Compiler 적용 여부를 검토합니다.
7. 최적화 전후의 성능을 측정하여 효과를 검증합니다.

**React 렌더링 최적화의 핵심은 렌더링 자체를 무조건 줄이는 것이 아니라, 실제로 필요한 작업만 효율적으로 수행하도록 컴포넌트와 상태 구조를 설계하는 것입니다.**

## 12. 참고 자료

- [React - Render and Commit](https://react.dev/learn/render-and-commit)
- [React - memo](https://react.dev/reference/react/memo)
- [React - useMemo](https://react.dev/reference/react/useMemo)
- [React - useCallback](https://react.dev/reference/react/useCallback)
- [React - Profiler](https://react.dev/reference/react/Profiler)
- [React - React Developer Tools](https://react.dev/learn/react-developer-tools)
- [React - You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React - React Compiler](https://react.dev/learn/react-compiler/introduction)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [react-window](https://github.com/bvaughn/react-window)