# Memoization

## 1. 개요

메모이제이션(Memoization)은 이전에 수행한 계산 결과를 저장하고 동일한 입력에 대해 저장된 결과를 재사용하는 최적화 기법입니다.

일반적으로 동일한 계산을 반복하거나 동일한 작업을 수행하는 과정에서 발생하는 비용을 줄이기 위해 사용됩니다.

React에서는 컴포넌트의 렌더링 과정에서 반복적으로 수행되는 계산이나 참조 변경으로 인한 불필요한 업데이트를 줄이기 위해 메모이제이션을 활용합니다.

React에서 제공하는 대표적인 메모이제이션 기능은 다음과 같습니다.

| 기능 | 대상 | 주요 목적 |
|---|---|---|
| `React.memo` | 컴포넌트 | Props가 변경되지 않은 경우 리렌더링 생략 |
| `useMemo` | 계산 결과 | 이전 계산 결과 재사용 |
| `useCallback` | 함수 참조 | 이전 함수 참조 재사용 |

세 기능은 서로 다른 대상을 메모이제이션하지만, 공통적으로 이전 값과 새로운 값의 비교를 통해 불필요한 작업을 줄이는 데 목적이 있습니다.

## 2. 메모이제이션의 필요성

React 컴포넌트는 State, Props, Context 등의 변경으로 다시 렌더링될 수 있습니다.

컴포넌트가 렌더링되면 함수 본문이 다시 실행되므로 내부에서 수행하는 계산과 객체 및 함수 생성 작업도 반복됩니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function ProductList({ products }: ProductListProps) {
  const [count, setCount] = useState(0);

  const filteredProducts = products.filter(
    (product) => product.price > 1000
  );

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Count: {count}
      </button>

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

위 예제에서는 `count`가 변경될 때마다 `ProductList`가 다시 렌더링됩니다.

이 과정에서 `products.filter()`도 반복적으로 실행됩니다.

`products`가 변경되지 않았다면 필터링 결과도 동일하지만, 컴포넌트가 다시 실행되기 때문에 동일한 계산이 반복됩니다.

계산 비용이 높은 작업이라면 이러한 반복이 성능 저하의 원인이 될 수 있습니다.

이때 `useMemo`를 사용하면 의존성이 변경되지 않은 경우 이전 계산 결과를 재사용할 수 있습니다.

## 3. React의 메모이제이션 기능

### 3.1. React.memo

`React.memo`는 컴포넌트를 메모이제이션하는 고차 컴포넌트(Higher-Order Component)입니다.

부모 컴포넌트가 다시 렌더링되더라도 전달받은 Props가 이전과 동일하면 해당 컴포넌트의 렌더링을 생략할 수 있습니다.

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

`App`의 `count`가 변경되면 부모 컴포넌트가 다시 렌더링됩니다.

그러나 `UserProfile`에 전달되는 `name`과 `age`가 이전 Props와 동일하다면 React는 `UserProfile`의 렌더링을 생략할 수 있습니다.

#### Props 비교 방식

`React.memo`는 기본적으로 이전 Props와 새로운 Props를 얕게 비교합니다.

각 Props의 변경 여부는 `Object.is`를 기준으로 판단합니다.

원시 타입은 값에 따라 비교되지만 객체, 배열, 함수는 참조를 기준으로 비교됩니다.

다음 예제에서는 메모이제이션의 효과가 발생하지 않을 수 있습니다.

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
        Count: {count}
      </button>

      <UserProfile user={user} />
    </div>
  );
}
```

`App`이 다시 렌더링될 때마다 새로운 `user` 객체가 생성됩니다.

객체 내부의 속성이 동일하더라도 참조가 달라지므로 `React.memo`는 변경된 Props로 판단합니다.

이러한 경우에는 `useMemo`를 사용하여 객체 참조를 안정적으로 유지할 수 있습니다.

#### 사용자 정의 비교 함수

`React.memo`는 두 번째 인자로 사용자 정의 비교 함수를 전달할 수 있습니다.

```tsx
const UserProfile = memo(
  function UserProfile({ user }: UserProfileProps) {
    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

비교 함수가 `true`를 반환하면 Props가 변경되지 않은 것으로 판단하여 기존 렌더링 결과를 재사용합니다.

반대로 `false`를 반환하면 컴포넌트를 다시 렌더링합니다.

사용자 정의 비교 함수에서는 화면에 영향을 주는 모든 Props를 정확하게 비교해야 합니다.

특히 함수 Props를 비교하지 않으면 이전 렌더링의 State나 Props를 참조하는 오래된 클로저(Closure)가 유지될 수 있으므로 주의해야 합니다.

### 3.2. useMemo

`useMemo`는 계산 결과를 메모이제이션하는 Hook입니다.

의존성 배열에 지정한 값이 변경되지 않으면 이전 렌더링에서 계산한 결과를 재사용합니다.

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
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

`useMemo`의 첫 번째 인자는 계산 함수이며, 두 번째 인자는 의존성 배열입니다.

의존성 배열의 값이 변경되지 않으면 이전 계산 결과를 반환합니다.

#### 동작 과정

1. 컴포넌트가 처음 렌더링됩니다.
2. `useMemo`의 계산 함수가 실행됩니다.
3. 계산 결과와 의존성 값이 저장됩니다.
4. 컴포넌트가 다시 렌더링됩니다.
5. 이전 의존성과 새로운 의존성을 비교합니다.
6. 의존성이 동일하면 이전 계산 결과를 재사용합니다.
7. 의존성이 변경되면 계산 함수를 다시 실행합니다.

#### 객체 및 배열의 참조 안정화

`useMemo`는 계산 결과뿐 아니라 객체와 배열의 참조를 안정적으로 유지하는 데도 활용됩니다.

```tsx
function App() {
  const [count, setCount] = useState(0);

  const user = useMemo(
    () => ({
      name: 'Alice',
      age: 25,
    }),
    []
  );

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

위 예제에서는 `count`가 변경되어도 `user` 객체의 참조가 유지됩니다.

따라서 `React.memo`로 감싼 `UserProfile`은 Props 변경이 없다고 판단하여 리렌더링을 생략할 수 있습니다.

### 3.3. useCallback

`useCallback`은 함수를 메모이제이션하는 Hook입니다.

컴포넌트가 다시 렌더링되더라도 의존성이 변경되지 않으면 이전 함수 참조를 재사용합니다.

```tsx
import { memo, useCallback, useState } from 'react';

type ActionButtonProps = {
  onClick: () => void;
};

const ActionButton = memo(function ActionButton({
  onClick,
}: ActionButtonProps) {
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

일반적으로 컴포넌트 내부에서 함수를 선언하면 컴포넌트가 다시 렌더링될 때 새로운 함수 객체가 생성됩니다.

`useCallback`을 사용하면 의존성이 변경되지 않는 동안 동일한 함수 참조를 유지할 수 있습니다.

#### useCallback과 useMemo의 관계

`useCallback`은 함수 참조를 메모이제이션하며, 다음과 같이 `useMemo`로 표현할 수 있습니다.

```tsx
const handleClick = useCallback(() => {
  execute();
}, []);
```

위 코드는 다음 코드와 동일한 목적을 가집니다.

```tsx
const handleClick = useMemo(() => {
  return () => execute();
}, []);
```

두 Hook의 차이는 반환값에 있습니다.

- `useMemo`: 계산 함수의 실행 결과를 반환합니다.
- `useCallback`: 전달한 함수를 반환합니다.

일반적으로 함수 참조를 안정화하려는 목적이라면 `useCallback`을 사용하는 것이 더 명확합니다.

## 4. 의존성 배열(Dependency Array)

React의 메모이제이션 Hook은 의존성 배열을 통해 이전 렌더링과 현재 렌더링 사이의 변경 여부를 판단합니다.

`useMemo`와 `useCallback`은 의존성 배열의 각 항목을 `Object.is`로 비교합니다.

### 4.1. 빈 의존성 배열

```tsx
const value = useMemo(() => {
  return calculateValue();
}, []);
```

빈 배열을 전달하면 일반적으로 컴포넌트의 최초 렌더링에서 계산한 결과를 이후 렌더링에서도 재사용합니다.

```tsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

함수 역시 의존성이 없으므로 동일한 함수 참조를 재사용합니다.

단, 빈 의존성 배열을 사용한다고 해서 컴포넌트가 마운트되는 동안 캐시가 절대 폐기되지 않는 것은 아닙니다.

React는 특정 상황에서 메모이제이션 캐시를 폐기할 수 있습니다.

### 4.2. 의존성 배열 지정

```tsx
const value = useMemo(() => {
  return calculateValue(data);
}, [data]);
```

`data`가 변경되면 계산 함수를 다시 실행합니다.

```tsx
const handleClick = useCallback(() => {
  execute(userId);
}, [userId]);
```

`userId`가 변경되면 새로운 함수 참조를 반환합니다.

의존성 배열에는 계산 함수 또는 콜백 함수 내부에서 참조하는 반응형 값(Props, State 및 컴포넌트 내부에서 선언된 변수와 함수 등)을 정확하게 지정해야 합니다.

의존성을 누락하면 이전 렌더링의 값을 참조하는 문제가 발생할 수 있습니다.

### 4.3. 의존성 비교의 주의사항

다음과 같이 렌더링마다 새로운 객체를 생성하여 의존성으로 전달하면 메모이제이션이 무효화될 수 있습니다.

```tsx
function Component({ products }: ProductListProps) {
  const options = {
    sortBy: 'price',
  };

  const result = useMemo(() => {
    return filterProducts(products, options);
  }, [products, options]);

  return <div>{result.length}</div>;
}
```

`options`는 렌더링마다 새로운 객체로 생성되므로 이전 객체와 참조가 달라집니다.

다음과 같이 객체를 계산 함수 내부에서 생성하면 불필요한 참조 변경을 방지할 수 있습니다.

```tsx
function Component({ products }: ProductListProps) {
  const result = useMemo(() => {
    const options = {
      sortBy: 'price',
    };

    return filterProducts(products, options);
  }, [products]);

  return <div>{result.length}</div>;
}
```

의존성 배열은 최적화 결과를 임의로 고정하기 위한 수단이 아니라 실제 데이터 의존 관계를 선언하는 수단입니다.

## 5. 메모이제이션과 렌더링 동작

메모이제이션은 React의 렌더링 과정에서 불필요한 작업을 줄이는 데 활용됩니다.

그러나 메모이제이션이 적용되었다고 해서 모든 렌더링이 차단되는 것은 아닙니다.

### 5.1. React.memo와 부모 컴포넌트

부모 컴포넌트가 렌더링되더라도 메모이제이션된 자식 컴포넌트의 Props가 동일하면 자식 컴포넌트의 렌더링을 생략할 수 있습니다.

```tsx
const Child = memo(function Child({ name }: { name: string }) {
  console.log('Child rendered');

  return <div>{name}</div>;
});
```

### 5.2. 컴포넌트 자체 State 변경

`React.memo`를 적용한 컴포넌트라도 자신의 State가 변경되면 다시 렌더링됩니다.

```tsx
const Counter = memo(function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </button>
  );
});
```

`React.memo`는 부모로부터 전달받은 Props를 기준으로 렌더링을 생략하는 기능이며 컴포넌트 자체의 State 업데이트를 차단하지 않습니다.

### 5.3. Context 변경

컴포넌트가 구독하는 Context 값이 변경되면 `React.memo`가 적용되어 있더라도 해당 컴포넌트는 다시 렌더링됩니다.

```tsx
const ThemeContext = createContext('light');

const ThemeButton = memo(function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Theme</button>;
});
```

Context Provider가 제공하는 값이 변경되면 `ThemeButton`도 새로운 Context 값을 반영하기 위해 다시 렌더링됩니다.

따라서 Context를 사용하는 컴포넌트의 렌더링 범위가 넓다면 Context 구독 위치를 분리하거나 상태를 세분화하는 방법을 고려할 수 있습니다.

## 6. 메모이제이션의 한계와 주의사항

### 6.1. 메모이제이션은 캐시이며 영구적인 저장소가 아닙니다.

React는 `useMemo`와 `useCallback`의 캐시를 성능 최적화 목적으로 관리합니다.

React가 특정 상황에서 캐시를 폐기하면 계산 함수가 다시 실행되거나 새로운 함수 참조가 생성될 수 있습니다.

따라서 애플리케이션의 정상적인 동작이 메모이제이션 캐시의 영속성에 의존해서는 안 됩니다.

메모이제이션은 상태 저장이나 비즈니스 로직의 정확성을 보장하는 기능이 아닙니다.

### 6.2. 불필요한 메모이제이션 지양

모든 계산과 함수에 메모이제이션을 적용할 필요는 없습니다.

메모이제이션에는 다음과 같은 비용이 발생할 수 있습니다.

- 의존성 비교 비용
- 캐시 유지 및 관리 비용
- 코드 복잡도 증가
- 의존성 관리의 어려움
- 메모리 사용량 증가 가능성

단순한 계산이나 렌더링 비용이 낮은 컴포넌트에서는 메모이제이션이 오히려 불필요한 복잡성을 증가시킬 수 있습니다.

### 6.3. 클로저와 오래된 값(Stale Closure)

함수는 생성된 시점의 렌더링 환경을 기준으로 Props와 State를 참조합니다.

`useCallback`에서 필요한 의존성을 누락하면 이전 렌더링의 값을 계속 참조할 수 있습니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count);
  }, []);

  return (
    <button onClick={handleClick}>
      Increment
    </button>
  );
}
```

위 예제의 `handleClick`은 최초 렌더링 시점의 `count` 값을 참조합니다.

따라서 버튼을 클릭하더라도 최신 State가 아닌 이전 값을 출력할 수 있습니다.

다음과 같이 의존성을 지정해야 합니다.

```tsx
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

이렇게 하면 `count`가 변경될 때 새로운 함수가 생성되고 최신 값을 참조합니다.

### 6.4. 메모이제이션과 순수성

React 컴포넌트와 Hook은 순수성을 유지해야 합니다.

렌더링 과정에서 외부 변수를 직접 변경하거나 부수 효과를 수행하는 코드는 메모이제이션 여부와 관계없이 예측하기 어려운 동작을 발생시킬 수 있습니다.

특히 `useMemo`의 계산 함수는 렌더링 과정에서 실행되므로 순수한 계산만 수행하도록 작성해야 합니다.

```tsx
const result = useMemo(() => {
  return products.filter((product) => product.price > 1000);
}, [products]);
```

반면 다음과 같이 외부 상태를 변경하는 작업은 적절하지 않습니다.

```tsx
const result = useMemo(() => {
  externalCounter++;

  return products.filter((product) => product.price > 1000);
}, [products]);
```

외부 시스템과의 동기화나 부수 효과는 적절한 Effect 또는 이벤트 핸들러에서 처리해야 합니다.

## 7. React Compiler와 메모이제이션

React Compiler는 컴파일 시점에 컴포넌트와 Hook의 코드를 분석하여 자동으로 메모이제이션을 적용하는 기능입니다.

기존에는 개발자가 직접 `React.memo`, `useMemo`, `useCallback`을 사용하여 렌더링 최적화를 수행하는 경우가 많았습니다.

React Compiler는 코드의 데이터 흐름과 의존 관계를 분석하여 필요한 메모이제이션을 자동으로 수행할 수 있습니다.

예를 들어 다음과 같은 코드가 있습니다.

```tsx
function ProductList({ products }: ProductListProps) {
  const sortedProducts = [...products].sort(
    (a, b) => a.price - b.price
  );

  return (
    <ul>
      {sortedProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

React Compiler가 활성화된 환경에서는 컴파일러가 해당 계산 결과를 메모이제이션하도록 최적화할 수 있습니다.

React Compiler는 다음과 같은 이점을 제공합니다.

- 수동 메모이제이션 코드 감소
- 불필요한 컴포넌트 렌더링 감소
- 반복적인 계산 비용 감소
- 개발자의 메모이제이션 관리 부담 감소

다만 React Compiler가 적용되어도 다음 사항은 여전히 중요합니다.

- React의 순수성 규칙 준수
- State와 Props의 적절한 설계
- Effect의 올바른 사용
- 실제 성능 측정 및 검증

React Compiler는 잘못된 컴포넌트 구조나 비효율적인 데이터 흐름을 자동으로 해결하는 도구가 아닙니다.

또한 수동 메모이제이션이 필요한 모든 상황을 무조건 대체한다고 볼 수는 없습니다.

## 8. 메모이제이션 적용 기준

메모이제이션은 실제 성능 문제를 확인한 후 필요한 위치에 적용하는 것이 좋습니다.

다음은 일반적인 적용 기준입니다.

| 상황 | 권장 방법 | 이유 |
|---|---|---|
| 비용이 높은 계산을 반복하는 경우 | `useMemo` | 계산 결과 재사용 |
| 메모이제이션된 자식에게 객체를 전달하는 경우 | `useMemo` | 객체 참조 안정화 |
| 메모이제이션된 자식에게 함수를 전달하는 경우 | `useCallback` | 함수 참조 안정화 |
| 부모 업데이트와 무관한 자식 컴포넌트가 반복 렌더링되는 경우 | `React.memo` | Props가 동일하면 렌더링 생략 |
| 단순한 산술 연산 | 일반 계산 | 메모이제이션 비용이 더 클 수 있음 |
| 렌더링 비용이 거의 없는 컴포넌트 | 일반 컴포넌트 | 불필요한 최적화 방지 |

메모이제이션을 적용하기 전에 다음 사항을 확인하는 것이 좋습니다.

1. 실제로 반복되는 계산이나 렌더링이 발생하는지 확인합니다.
2. 해당 작업의 비용이 유의미한지 측정합니다.
3. State의 위치와 컴포넌트 구조를 개선할 수 있는지 검토합니다.
4. 필요한 경우 메모이제이션을 적용합니다.
5. 적용 전후의 성능을 비교합니다.

## 9. 정리

React의 메모이제이션은 렌더링 과정에서 반복되는 계산과 참조 변경으로 인한 불필요한 작업을 줄이는 최적화 기법입니다.

주요 기능은 다음과 같습니다.

- `React.memo`: Props가 동일한 컴포넌트의 리렌더링을 생략합니다.
- `useMemo`: 의존성이 동일한 경우 이전 계산 결과를 재사용합니다.
- `useCallback`: 의존성이 동일한 경우 이전 함수 참조를 재사용합니다.

메모이제이션을 적용할 때는 다음 원칙을 고려해야 합니다.

1. 메모이제이션은 성능 최적화를 위한 수단이며 정확성을 보장하는 수단이 아닙니다.
2. 의존성 배열에는 실제로 참조하는 반응형 값을 정확하게 지정해야 합니다.
3. 객체, 배열, 함수의 참조 변경이 메모이제이션에 영향을 줄 수 있습니다.
4. 컴포넌트 자체의 State 및 Context 변경은 `React.memo`로 차단되지 않습니다.
5. 불필요한 메모이제이션은 코드 복잡도와 관리 비용을 증가시킬 수 있습니다.
6. React Compiler를 사용하는 경우 자동 메모이제이션 기능을 함께 고려해야 합니다.

**메모이제이션의 핵심은 모든 작업을 캐싱하는 것이 아니라, 반복되는 비용이 실제로 문제가 되는 지점을 식별하고 필요한 작업만 선택적으로 최적화하는 것입니다.**

## 10. 참고 자료

- [React - memo](https://react.dev/reference/react/memo)
- [React - useMemo](https://react.dev/reference/react/useMemo)
- [React - useCallback](https://react.dev/reference/react/useCallback)
- [React - React Compiler](https://react.dev/learn/react-compiler/introduction)
- [React - Render and Commit](https://react.dev/learn/render-and-commit)
- [React - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React - Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
- [React - You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)