# React.memo

## 1. 개요

`React.memo`는 컴포넌트를 메모이제이션하여 불필요한 리렌더링을 줄이는 React API입니다.

일반적으로 부모 컴포넌트가 다시 렌더링되면 자식 컴포넌트도 렌더링을 수행합니다. 자식 컴포넌트에 전달되는 Props가 변경되지 않았더라도 부모의 렌더링에 따라 자식 컴포넌트 함수가 다시 실행될 수 있습니다.

`React.memo`를 사용하면 이전 렌더링과 현재 렌더링의 Props를 비교하여 변경 사항이 없는 경우 자식 컴포넌트의 렌더링을 생략할 수 있습니다.

기본 사용법은 다음과 같습니다.

```tsx
import { memo } from 'react';

type UserProfileProps = {
  name: string;
  age: number;
};

const UserProfile = memo(function UserProfile({
  name,
  age,
}: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
});
```

`memo`는 기존 컴포넌트를 감싸는 방식으로 사용하며, 메모이제이션된 컴포넌트를 반환합니다.

React는 부모 컴포넌트가 다시 렌더링될 때 이전 Props와 새로운 Props를 비교합니다. 두 Props가 동일하다면 기존 렌더링 결과를 재사용할 수 있습니다.

단, `React.memo`는 렌더링을 반드시 방지하는 기능이 아니라 렌더링을 생략할 수 있도록 하는 성능 최적화 기능입니다.

## 2. React.memo의 동작 원리

### 2.1. 기본 동작

일반적인 React 컴포넌트는 부모 컴포넌트가 다시 렌더링되면 자식 컴포넌트도 렌더링될 수 있습니다.

```tsx
import { useState } from 'react';

function Child({ name }: { name: string }) {
  console.log('Child rendered');

  return <div>{name}</div>;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Count: {count}
      </button>

      <Child name="Alice" />
    </div>
  );
}
```

위 예제에서 `count`가 변경되면 `App`이 다시 렌더링됩니다.

이때 `Child`에 전달되는 `name`은 변경되지 않았지만, 일반적인 부모-자식 렌더링 흐름에 따라 `Child`도 다시 실행됩니다.

`React.memo`를 적용하면 다음과 같습니다.

```tsx
import { memo, useState } from 'react';

const Child = memo(function Child({
  name,
}: {
  name: string;
}) {
  console.log('Child rendered');

  return <div>{name}</div>;
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Count: {count}
      </button>

      <Child name="Alice" />
    </div>
  );
}
```

이제 `count`가 변경되어 `App`이 다시 렌더링되더라도 `Child`의 Props가 동일하다면 해당 컴포넌트의 리렌더링을 생략할 수 있습니다.

### 2.2. Props 비교 방식

`React.memo`는 기본적으로 이전 Props와 새로운 Props를 얕게 비교(Shallow Comparison)합니다.

각 Props의 변경 여부는 `Object.is`를 기준으로 판단합니다.

다음 예제를 살펴보겠습니다.

```tsx
const Child = memo(function Child({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return (
    <div>
      {name} - {age}
    </div>
  );
});
```

다음과 같이 원시 타입을 전달하는 경우 값이 동일하면 Props도 동일한 것으로 판단합니다.

```tsx
<Child name="Alice" age={25} />
```

반면 객체, 배열, 함수는 참조를 기준으로 비교합니다.

```tsx
const Child = memo(function Child({
  user,
}: {
  user: { name: string; age: number };
}) {
  return <div>{user.name}</div>;
});

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

      <Child user={user} />
    </div>
  );
}
```

`App`이 다시 렌더링될 때마다 새로운 `user` 객체가 생성됩니다.

객체 내부의 값이 동일하더라도 참조가 변경되었기 때문에 `React.memo`는 Props가 변경된 것으로 판단합니다.

따라서 객체, 배열, 함수 등을 Props로 전달할 때는 참조 안정성을 고려해야 합니다.

## 3. 객체와 함수 Props의 최적화

`React.memo`는 Props의 참조 변경에 영향을 받으므로 객체, 배열, 함수 Props를 전달할 때 주의해야 합니다.

### 3.1. 객체 및 배열 Props

다음과 같이 렌더링마다 새로운 객체를 생성하면 메모이제이션 효과가 발생하지 않을 수 있습니다.

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

이 문제는 `useMemo`를 활용하여 해결할 수 있습니다.

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

`useMemo`를 통해 `user` 객체의 참조를 유지하면 `count`가 변경되더라도 `UserProfile`의 Props는 동일하게 유지됩니다.

### 3.2. 함수 Props

컴포넌트 내부에서 선언한 함수는 컴포넌트가 다시 실행될 때마다 새로운 함수 객체로 생성됩니다.

```tsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('Clicked');
  };

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        {count}
      </button>

      <ActionButton onClick={handleClick} />
    </div>
  );
}
```

`ActionButton`이 `React.memo`로 감싸져 있더라도 `handleClick`의 참조가 변경되므로 리렌더링이 발생할 수 있습니다.

이러한 경우 `useCallback`을 사용할 수 있습니다.

```tsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        {count}
      </button>

      <ActionButton onClick={handleClick} />
    </div>
  );
}
```

`useCallback`을 사용하면 의존성이 변경되지 않는 동안 동일한 함수 참조를 재사용합니다.

따라서 `ActionButton`에 전달되는 Props가 안정적으로 유지됩니다.

## 4. 사용자 정의 Props 비교 함수

`React.memo`는 두 번째 인자로 사용자 정의 비교 함수(Custom Comparison Function)를 전달할 수 있습니다.

이를 통해 기본적인 얕은 비교 대신 특정 기준에 따라 Props의 변경 여부를 판단할 수 있습니다.

```tsx
import { memo } from 'react';

type User = {
  id: number;
  name: string;
  age: number;
};

type UserProfileProps = {
  user: User;
};

const UserProfile = memo(
  function UserProfile({ user }: UserProfileProps) {
    console.log('UserProfile rendered');

    return <div>{user.name}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id;
  }
);
```

사용자 정의 비교 함수는 다음과 같이 동작합니다.

- `true` 반환: Props가 변경되지 않은 것으로 판단하여 렌더링을 생략합니다.
- `false` 반환: Props가 변경된 것으로 판단하여 다시 렌더링합니다.

위 예제에서는 `user.id`만 비교하므로 이름이나 나이가 변경되더라도 ID가 동일하면 리렌더링을 생략합니다.

이는 화면에 표시되는 값이 변경되었음에도 이전 UI가 유지되는 문제를 발생시킬 수 있습니다.

따라서 비교 함수에서는 컴포넌트의 렌더링 결과에 영향을 주는 모든 Props를 정확하게 비교해야 합니다.

### 4.1. 함수 Props 비교 시 주의사항

사용자 정의 비교 함수에서는 함수 Props도 정확하게 비교해야 합니다.

```tsx
const Button = memo(
  function Button({
    onClick,
    label,
  }: {
    onClick: () => void;
    label: string;
  }) {
    return <button onClick={onClick}>{label}</button>;
  },
  (prevProps, nextProps) => {
    return prevProps.label === nextProps.label;
  }
);
```

위 비교 함수는 `onClick`을 비교하지 않습니다.

이 경우 새로운 함수가 전달되었더라도 기존 함수를 계속 사용할 수 있으며, 이전 렌더링의 State나 Props를 참조하는 오래된 클로저(Closure)가 유지될 수 있습니다.

따라서 함수 Props도 비교 대상에 포함해야 합니다.

```tsx
const Button = memo(
  function Button({
    onClick,
    label,
  }: {
    onClick: () => void;
    label: string;
  }) {
    return <button onClick={onClick}>{label}</button>;
  },
  (prevProps, nextProps) => {
    return (
      prevProps.label === nextProps.label &&
      prevProps.onClick === nextProps.onClick
    );
  }
);
```

사용자 정의 비교 함수는 깊은 비교를 무조건 수행하는 용도로 사용하기보다는 실제 컴포넌트의 렌더링 결과에 영향을 주는 최소한의 비교 기준을 명확하게 정의하는 데 사용하는 것이 좋습니다.

## 5. React.memo가 리렌더링을 방지하지 못하는 경우

`React.memo`는 부모 컴포넌트의 업데이트로 인해 발생하는 불필요한 리렌더링을 줄이는 기능입니다.

컴포넌트 자체의 업데이트까지 차단하는 것은 아닙니다.

### 5.1. 컴포넌트 자체의 State 변경

컴포넌트 내부에서 관리하는 State가 변경되면 `React.memo`가 적용되어 있더라도 다시 렌더링됩니다.

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

`count`가 변경되면 해당 컴포넌트는 업데이트되어야 하므로 다시 렌더링됩니다.

### 5.2. Context 변경

컴포넌트가 구독하는 Context의 값이 변경되면 `React.memo`가 적용되어 있더라도 다시 렌더링됩니다.

```tsx
import { createContext, memo, useContext } from 'react';

const ThemeContext = createContext('light');

const ThemeButton = memo(function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Theme</button>;
});

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={theme}>
      <button
        onClick={() =>
          setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
        }
      >
        Change Theme
      </button>

      <ThemeButton />
    </ThemeContext.Provider>
  );
}
```

`theme`이 변경되면 Context를 구독하는 `ThemeButton`도 새로운 값을 반영하기 위해 다시 렌더링됩니다.

### 5.3. Props 변경

전달되는 Props 중 하나라도 이전 값과 다르면 컴포넌트는 다시 렌더링됩니다.

```tsx
const UserProfile = memo(function UserProfile({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return (
    <div>
      {name} - {age}
    </div>
  );
});
```

`name` 또는 `age`가 변경되면 새로운 UI를 계산하기 위해 다시 렌더링됩니다.

### 5.4. Key 변경

컴포넌트의 `key`가 변경되면 React는 기존 컴포넌트와 다른 컴포넌트로 취급할 수 있습니다.

이 경우 기존 컴포넌트 인스턴스가 제거되고 새로운 컴포넌트가 마운트됩니다.

```tsx
<UserProfile key={userId} name={name} age={age} />
```

`userId`가 변경되면 기존 컴포넌트의 State와 메모이제이션 상태가 유지되지 않고 새로운 컴포넌트 인스턴스가 생성됩니다.

`React.memo`는 서로 다른 컴포넌트 인스턴스 사이의 렌더링을 재사용하는 기능이 아닙니다.

## 6. children과 React.memo

`children`도 컴포넌트의 Props 중 하나이므로 `React.memo`의 비교 대상입니다.

다음 예제를 살펴보겠습니다.

```tsx
const Panel = memo(function Panel({
  children,
}: {
  children: ReactNode;
}) {
  console.log('Panel rendered');

  return <section>{children}</section>;
});
```

부모 컴포넌트가 다음과 같이 `children`을 직접 JSX로 전달하는 경우를 살펴보겠습니다.

```tsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount((prev) => prev + 1)}>
        {count}
      </button>

      <Panel>
        <p>Hello React</p>
      </Panel>
    </div>
  );
}
```

`App`이 다시 렌더링될 때마다 새로운 React Element 객체가 생성되므로 `children`의 참조가 변경될 수 있습니다.

이 경우 `Panel`은 Props가 변경된 것으로 판단하여 다시 렌더링됩니다.

반면 `children`을 변경하지 않는 별도의 부모 구조를 사용하거나 JSX 요소를 안정적으로 유지하면 불필요한 렌더링을 줄일 수 있습니다.

`React.memo`는 `children`이라는 Props의 이름이나 타입에 특별한 예외를 두지 않습니다. 다른 Props와 동일한 비교 규칙이 적용됩니다.

## 7. React.memo와 컴포넌트 구조

`React.memo`만으로 모든 렌더링 문제를 해결할 수 있는 것은 아닙니다.

컴포넌트의 구조와 State 배치를 개선하면 메모이제이션 없이도 불필요한 렌더링을 줄일 수 있습니다.

### 7.1. State Colocation

State를 실제로 사용하는 컴포넌트 가까이에 배치하면 업데이트 범위를 제한할 수 있습니다.

```tsx
function SearchSection() {
  const [keyword, setKeyword] = useState('');

  return (
    <>
      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <ProductList keyword={keyword} />
    </>
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

검색어가 변경되어도 `App` 자체는 해당 State 변경으로 인해 다시 렌더링되지 않습니다.

이러한 구조는 상위 컴포넌트의 불필요한 업데이트 범위를 줄이는 데 도움이 됩니다.

### 7.2. 컴포넌트 분리

하나의 컴포넌트가 서로 다른 업데이트 주기를 가진 여러 영역을 포함한다면 독립적인 컴포넌트로 분리할 수 있습니다.

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

이러한 구조에서 `DashboardContent`의 렌더링 비용이 크고 Props가 안정적으로 유지된다면 `React.memo`를 적용할 수 있습니다.

```tsx
const DashboardContent = memo(function DashboardContent() {
  return <ExpensiveContent />;
});
```

컴포넌트 분리와 메모이제이션을 함께 활용하면 독립적인 렌더링 단위를 구성할 수 있습니다.

## 8. React Compiler와 React.memo

React Compiler는 컴파일 시점에 컴포넌트와 Hook의 코드를 분석하여 필요한 메모이제이션을 자동으로 적용합니다.

기존에는 개발자가 직접 `React.memo`를 적용하여 부모 컴포넌트의 업데이트로 인한 불필요한 리렌더링을 방지하는 경우가 많았습니다.

React Compiler가 활성화된 환경에서는 컴파일러가 컴포넌트의 데이터 흐름을 분석하여 필요한 최적화를 수행할 수 있습니다.

기존 방식은 다음과 같습니다.

```tsx
const ProductList = memo(function ProductList({
  products,
}: ProductListProps) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
});
```

React Compiler를 사용하는 환경에서는 다음과 같이 일반 컴포넌트로 작성해도 컴파일러가 적절한 메모이제이션을 적용할 수 있습니다.

```tsx
function ProductList({ products }: ProductListProps) {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

다만 React Compiler가 모든 환경에서 자동으로 활성화되는 것은 아니므로 프로젝트의 설정과 적용 범위를 확인해야 합니다.

또한 컴파일러를 사용하더라도 컴포넌트 구조, State 관리, Context 구독 범위 및 렌더링 성능 측정은 여전히 중요합니다.

## 9. React.memo 사용 시 주의사항

### 9.1. 무분별한 적용 지양

모든 컴포넌트에 `React.memo`를 적용할 필요는 없습니다.

메모이제이션에는 Props 비교 비용과 코드 복잡도가 발생합니다.

렌더링 비용이 낮은 컴포넌트라면 메모이제이션으로 얻는 성능 이점보다 비교 비용이 더 클 수 있습니다.

### 9.2. 객체 및 함수 Props의 참조 안정성

객체, 배열, 함수는 참조를 기준으로 비교되므로 렌더링마다 새로운 값이 생성되면 메모이제이션의 효과가 감소할 수 있습니다.

필요한 경우 `useMemo`와 `useCallback`을 함께 활용할 수 있습니다.

### 9.3. 사용자 정의 비교 함수의 비용

사용자 정의 비교 함수에서 복잡한 깊은 비교를 수행하면 비교 자체가 상당한 비용을 발생시킬 수 있습니다.

메모이제이션을 적용하는 목적과 실제 비교 비용을 함께 고려해야 합니다.

### 9.4. 성능 최적화와 정확성 구분

`React.memo`는 컴포넌트의 정상적인 동작을 보장하는 기능이 아니라 성능 최적화 기능입니다.

메모이제이션이 적용되지 않아도 컴포넌트는 올바르게 동작해야 합니다.

### 9.5. Strict Mode와 렌더링 횟수

개발 환경의 Strict Mode는 컴포넌트의 순수성을 검증하기 위해 렌더링 과정에서 컴포넌트를 추가로 호출할 수 있습니다.

따라서 개발 환경에서 콘솔 로그로 확인한 렌더링 횟수가 프로덕션 환경과 다를 수 있습니다.

렌더링 성능을 정확하게 측정하려면 React Profiler 등을 활용하고 실제 배포 환경에서도 검증해야 합니다.

## 10. 정리

`React.memo`는 Props를 기준으로 컴포넌트의 불필요한 리렌더링을 줄이는 메모이제이션 API입니다.

핵심 특징은 다음과 같습니다.

- 부모 컴포넌트가 다시 렌더링되더라도 Props가 동일하면 자식 컴포넌트의 렌더링을 생략할 수 있습니다.
- 기본적으로 Props를 얕게 비교하며 각 Props는 `Object.is`를 기준으로 비교합니다.
- 객체, 배열, 함수는 참조가 변경되면 새로운 Props로 판단됩니다.
- 사용자 정의 비교 함수를 통해 Props 비교 방식을 지정할 수 있습니다.
- 컴포넌트 자체의 State 또는 구독하는 Context가 변경되면 다시 렌더링됩니다.
- 컴포넌트의 `key`가 변경되면 기존 메모이제이션 상태가 유지되지 않습니다.
- React Compiler를 사용하면 수동 메모이제이션의 필요성이 줄어들 수 있습니다.

**React.memo의 핵심은 Props가 변경되지 않은 컴포넌트의 불필요한 렌더링을 줄이는 것입니다. 실제 렌더링 비용과 Props의 안정성을 확인한 후 필요한 컴포넌트에 선택적으로 적용하는 것이 좋습니다.**

## 11. 참고 자료

- [React - memo](https://react.dev/reference/react/memo)
- [React - Render and Commit](https://react.dev/learn/render-and-commit)
- [React - useMemo](https://react.dev/reference/react/useMemo)
- [React - useCallback](https://react.dev/reference/react/useCallback)
- [React - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React - React Compiler](https://react.dev/learn/react-compiler/introduction)
- [React - StrictMode](https://react.dev/reference/react/StrictMode)
- [React - Profiler](https://react.dev/reference/react/Profiler)