# Rules of Hooks

## 1. 개념

Rules of Hooks는 React에서 Hooks를 사용할 때 반드시 준수해야 하는 호출 규칙입니다.

Hooks는 함수 형태로 제공되지만 일반적인 JavaScript 함수와 달리 React의 렌더링 과정과 연결되어 동작합니다. React는 컴포넌트가 렌더링될 때 Hooks가 호출되는 순서를 기준으로 각 Hook의 상태와 관련 정보를 관리합니다.

따라서 Hooks를 호출하는 위치와 순서가 렌더링마다 일관되게 유지되어야 합니다.

Rules of Hooks는 다음 두 가지 기본 원칙으로 구성됩니다.

1. Only Call Hooks at the Top Level
2. Only Call Hooks from React Functions

이 규칙을 준수하면 React가 컴포넌트의 렌더링 과정에서 Hook의 상태를 올바르게 관리할 수 있으며, 상태 불일치와 같은 예기치 않은 동작을 방지할 수 있습니다.

## 2. Only Call Hooks at the Top Level

Hooks는 함수 컴포넌트 또는 Custom Hook의 최상위 수준에서만 호출해야 합니다.

다음과 같은 위치에서는 일반적인 Hooks를 호출할 수 없습니다.

- 조건문 내부
- 반복문 내부
- 중첩 함수 내부
- 이벤트 핸들러 내부
- `try/catch/finally` 블록 내부
- `useMemo`, `useReducer`, `useEffect` 등에 전달하는 콜백 내부
- 조건부 `return` 이후

Hooks는 컴포넌트가 렌더링될 때마다 동일한 순서로 호출되어야 합니다.

### 2.1. 조건문 내부에서 호출하지 않기

조건에 따라 Hook의 호출 여부가 달라지면 렌더링마다 Hook의 호출 순서가 변경될 수 있습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function Counter({ enabled }: { enabled: boolean }) {
  if (enabled) {
    // 잘못된 사용
    const [count, setCount] = useState<number>(0);
  }

  return <div>Counter</div>;
}
```

위 코드에서는 `enabled` 값에 따라 `useState`의 호출 여부가 달라집니다.

첫 번째 렌더링에서 `enabled`가 `true`였다가 다음 렌더링에서 `false`로 변경되면 Hook의 호출 순서가 달라집니다.

React는 이러한 상황에서 각 Hook 호출에 대응하는 상태를 일관되게 추적할 수 없습니다.

올바른 사용 방법은 Hook을 조건문 외부에서 호출하는 것입니다.

```tsx
import { useState } from 'react';

function Counter({ enabled }: { enabled: boolean }) {
  const [count, setCount] = useState<number>(0);

  if (!enabled) {
    return null;
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
```

Hook을 최상위 수준에서 호출한 후 조건에 따라 렌더링 결과를 결정하면 호출 순서를 유지할 수 있습니다.

### 2.2. 반복문 내부에서 호출하지 않기

반복문 내부에서도 일반적인 Hooks를 호출하면 안 됩니다.

반복 횟수가 변경되거나 반복 조건이 달라지면 Hook의 호출 횟수와 순서가 변경될 수 있기 때문입니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function ItemList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => {
        // 잘못된 사용
        const [selected, setSelected] = useState(false);

        return (
          <li key={item}>
            {item}
          </li>
        );
      })}
    </ul>
  );
}
```

위 코드는 `map()` 콜백 내부에서 Hook을 호출하고 있습니다.

반복되는 항목마다 독립적인 상태가 필요하다면 각 항목을 별도의 컴포넌트로 분리하는 것이 적절합니다.

```tsx
import { useState } from 'react';

function Item({
  name,
}: {
  name: string;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => setSelected(event.target.checked)}
        />
        {name}
      </label>
    </li>
  );
}

function ItemList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <Item key={item} name={item} />
      ))}
    </ul>
  );
}
```

각 항목을 별도의 컴포넌트로 분리하면 React가 각 컴포넌트의 상태를 독립적으로 관리할 수 있습니다.

### 2.3. 중첩 함수 내부에서 호출하지 않기

일반 함수나 중첩 함수 내부에서도 Hooks를 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function Counter() {
  function initializeCounter() {
    // 잘못된 사용
    const [count, setCount] = useState<number>(0);

    return count;
  }

  return <div>{initializeCounter()}</div>;
}
```

`initializeCounter`는 React 컴포넌트도 Custom Hook도 아니므로 내부에서 Hook을 호출할 수 없습니다.

상태 관리 로직을 별도의 Custom Hook으로 추출하면 올바르게 구성할 수 있습니다.

```tsx
import { useState } from 'react';

function useCounter() {
  const [count, setCount] = useState<number>(0);

  return {
    count,
    setCount,
  };
}

function Counter() {
  const { count, setCount } = useCounter();

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </button>
  );
}
```

Custom Hook 역시 최상위 수준에서 다른 Hooks를 호출해야 합니다.

### 2.4. 이벤트 핸들러 내부에서 호출하지 않기

이벤트 핸들러는 사용자의 상호작용에 의해 실행되는 함수입니다.

이벤트 핸들러는 React의 컴포넌트 렌더링 과정에서 호출되는 함수가 아니므로 내부에서 Hooks를 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function Counter() {
  function handleClick() {
    // 잘못된 사용
    const [count, setCount] = useState<number>(0);

    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Increment
    </button>
  );
}
```

올바른 사용 방법은 컴포넌트의 최상위 수준에서 Hook을 호출하고, 이벤트 핸들러에서는 반환된 Setter를 사용하는 것입니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  function handleClick() {
    setCount((prev) => prev + 1);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
```

### 2.5. 조건부 return 이후에 호출하지 않기

컴포넌트에서 조건부 `return`을 사용한 이후에 Hook을 호출하는 것도 규칙 위반입니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function UserProfile({
  user,
}: {
  user: { name: string } | null;
}) {
  if (!user) {
    return <p>User not found</p>;
  }

  // 잘못된 사용
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => setExpanded((prev) => !prev)}>
        Toggle
      </button>
      {expanded && <p>Additional information</p>}
    </div>
  );
}
```

`user`가 존재하지 않으면 Hook에 도달하기 전에 컴포넌트가 반환됩니다.

반대로 `user`가 존재하면 Hook이 호출됩니다. 따라서 Props의 값에 따라 Hook의 호출 여부가 달라집니다.

올바른 사용 방법은 모든 Hook을 조건부 `return`보다 앞에서 호출하는 것입니다.

```tsx
import { useState } from 'react';

function UserProfile({
  user,
}: {
  user: { name: string } | null;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => setExpanded((prev) => !prev)}>
        Toggle
      </button>
      {expanded && <p>Additional information</p>}
    </div>
  );
}
```

### 2.6. try/catch/finally 내부에서 호출하지 않기

일반적인 Hooks는 `try/catch/finally` 블록 내부에서도 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function Counter() {
  try {
    // 잘못된 사용
    const [count, setCount] = useState<number>(0);
  } catch (error) {
    console.error(error);
  }

  return <div>Counter</div>;
}
```

Hooks는 컴포넌트의 최상위 수준에서 호출하고, 예외 처리는 Hook이 반환한 값을 사용하는 별도의 로직에서 처리해야 합니다.

## 3. Only Call Hooks from React Functions

Hooks는 React가 관리하는 함수 실행 환경에서 호출해야 합니다.

허용되는 호출 위치는 다음 두 가지입니다.

1. React 함수 컴포넌트
2. Custom Hook

일반 JavaScript 함수나 클래스 컴포넌트에서는 Hooks를 호출할 수 없습니다.

### 3.1. 함수 컴포넌트에서 호출하기

함수 컴포넌트는 React가 렌더링을 관리하는 함수입니다.

따라서 함수 컴포넌트의 최상위 수준에서는 Hooks를 호출할 수 있습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      {count}
    </button>
  );
}
```

### 3.2. Custom Hook에서 호출하기

Custom Hook은 React의 기본 Hooks를 조합하여 재사용 가능한 상태 기반 로직을 구성하는 함수입니다.

Custom Hook 역시 함수 컴포넌트가 렌더링되는 과정에서 호출되므로 내부에서 다른 Hooks를 호출할 수 있습니다.

```tsx
import { useState } from 'react';

function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return {
    count,
    increment,
  };
}

function Counter() {
  const { count, increment } = useCounter(0);

  return (
    <button onClick={increment}>
      {count}
    </button>
  );
}
```

Custom Hook은 일반 함수와 달리 React의 Hook 호출 규칙을 따릅니다.

또한 Custom Hook을 여러 컴포넌트에서 호출하더라도 각 호출은 독립적인 상태를 가집니다.

### 3.3. 일반 JavaScript 함수에서 호출하지 않기

일반 JavaScript 함수는 React의 컴포넌트 렌더링 과정에서 호출된다는 보장이 없습니다.

따라서 일반 함수 내부에서는 Hooks를 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { useState } from 'react';

function getCounter() {
  // 잘못된 사용
  const [count, setCount] = useState<number>(0);

  return count;
}
```

상태 관리가 필요한 로직이라면 Custom Hook으로 추출하고, 단순한 계산이나 데이터 변환이라면 일반 JavaScript 함수로 구현해야 합니다.

### 3.4. 클래스 컴포넌트에서 호출하지 않기

Hooks는 함수 컴포넌트를 위한 기능이므로 클래스 컴포넌트의 메서드 내부에서는 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
import { Component } from 'react';
import { useState } from 'react';

class Counter extends Component {
  render() {
    // 잘못된 사용
    const [count, setCount] = useState(0);

    return <div>{count}</div>;
  }
}
```

클래스 컴포넌트에서는 기존의 `this.state`, `this.setState` 및 생명주기 메서드를 사용해야 합니다.

Hooks를 활용하려면 함수 컴포넌트로 구현해야 합니다.

## 4. Rules of Hooks가 필요한 이유

Rules of Hooks가 필요한 핵심 이유는 React가 Hook의 호출 순서를 기준으로 각 Hook의 상태를 관리하기 때문입니다.

컴포넌트가 렌더링될 때마다 React는 Hook이 호출되는 순서가 일관되게 유지되기를 기대합니다.

### 4.1. Hook 호출 순서와 상태 관리

다음과 같은 컴포넌트를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function UserProfile() {
  const [name, setName] = useState('React');
  const [age, setAge] = useState(20);
  const [enabled, setEnabled] = useState(true);

  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
      <p>{enabled ? 'Enabled' : 'Disabled'}</p>
    </div>
  );
}
```

React는 컴포넌트가 렌더링될 때 Hook이 호출되는 순서를 일관되게 유지하여 각각의 상태를 관리합니다.

개념적으로 다음과 같은 순서로 이해할 수 있습니다.

| 호출 순서 | Hook | 관리하는 상태 |
|---|---|---|
| 1 | `useState('React')` | name |
| 2 | `useState(20)` | age |
| 3 | `useState(true)` | enabled |

다음 렌더링에서도 동일한 순서로 Hooks가 호출되어야 합니다.

Hook의 호출 순서가 변경되면 React가 기존 상태와 새로운 Hook 호출을 올바르게 대응시키지 못할 수 있습니다.

### 4.2. 조건부 Hook 호출로 인한 문제

다음은 조건문을 사용하여 Hook을 호출한 잘못된 예제입니다.

```tsx
import { useState } from 'react';

function UserProfile({
  showAge,
}: {
  showAge: boolean;
}) {
  const [name, setName] = useState('React');

  if (showAge) {
    // 잘못된 사용
    const [age, setAge] = useState(20);
  }

  const [enabled, setEnabled] = useState(true);

  return <div>{name}</div>;
}
```

첫 번째 렌더링에서 `showAge`가 `true`라면 Hook 호출 순서는 다음과 같습니다.

| 호출 순서 | Hook |
|---|---|
| 1 | name의 `useState` |
| 2 | age의 `useState` |
| 3 | enabled의 `useState` |

이후 `showAge`가 `false`로 변경되면 다음과 같이 호출 순서가 달라집니다.

| 호출 순서 | Hook |
|---|---|
| 1 | name의 `useState` |
| 2 | enabled의 `useState` |

React는 이전 렌더링에서 세 번째로 호출된 Hook과 현재 렌더링에서 두 번째로 호출된 Hook을 동일한 상태로 처리할 수 없게 됩니다.

이러한 문제는 Hook 개수 불일치 및 상태 관리 오류로 이어질 수 있습니다.

### 4.3. 조건은 Hook 내부에서 처리하기

특정 조건에서만 Effect를 실행해야 하는 경우 Hook 자체를 조건부로 호출하는 대신 Effect 내부에서 조건을 검사해야 합니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
if (isLoggedIn) {
  useEffect(() => {
    console.log('User logged in');
  }, []);
}
```

올바른 사용 방법은 다음과 같습니다.

```tsx
useEffect(() => {
  if (isLoggedIn) {
    console.log('User logged in');
  }
}, [isLoggedIn]);
```

Hook의 호출 위치는 고정하고 실행할 작업의 조건을 내부에서 처리하면 호출 순서를 유지할 수 있습니다.

## 5. Exception: use API

React 19에서 제공하는 `use` API는 일반적인 Hooks와 다른 호출 규칙을 갖습니다.

`use`는 Promise 또는 Context의 값을 읽을 때 사용하는 API입니다.

다른 Hooks와 달리 다음과 같은 위치에서 호출할 수 있습니다.

- 조건문 내부
- 반복문 내부

예를 들어 다음과 같은 사용이 가능합니다.

```tsx
import { use } from 'react';

function UserProfile({
  shouldShow,
  userPromise,
}: {
  shouldShow: boolean;
  userPromise: Promise<{ name: string }>;
}) {
  if (!shouldShow) {
    return null;
  }

  const user = use(userPromise);

  return <p>{user.name}</p>;
}
```

다음과 같이 반복문 내부에서도 사용할 수 있습니다.

```tsx
import { use } from 'react';

function UserList({
  userPromises,
}: {
  userPromises: Promise<{ id: number; name: string }>[];
}) {
  const users = [];

  for (const userPromise of userPromises) {
    users.push(use(userPromise));
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

그러나 `use` API 역시 모든 호출 제약에서 자유로운 것은 아닙니다.

다음 규칙은 여전히 준수해야 합니다.

- React 함수 컴포넌트 또는 Custom Hook 내부에서 호출해야 합니다.
- `try/catch` 블록 내부에서 호출할 수 없습니다.
- 일반 JavaScript 함수에서 호출할 수 없습니다.

따라서 `use` API는 일반적인 Rules of Hooks의 조건부 호출 금지 규칙에 대한 명시적인 예외로 이해해야 합니다.

## 6. ESLint를 통한 규칙 검증

Rules of Hooks를 올바르게 준수하기 위해 React는 `eslint-plugin-react-hooks`를 제공합니다.

이 플러그인은 정적 분석을 통해 Hooks의 잘못된 호출 위치와 관련된 문제를 사전에 발견할 수 있도록 지원합니다.

특히 `rules-of-hooks` 규칙은 Hooks가 허용된 위치에서 호출되는지 검사합니다.

### 6.1. 플러그인 설치

```bash
npm install -D eslint-plugin-react-hooks
```

### 6.2. ESLint 설정

ESLint Flat Config를 사용하는 경우 다음과 같이 설정할 수 있습니다.

```typescript
// eslint.config.ts

import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

`react-hooks/rules-of-hooks`는 Hook 호출 규칙을 검사하며, `react-hooks/exhaustive-deps`는 Effect 등의 의존성 배열이 올바르게 구성되었는지 검사합니다.

두 규칙은 서로 다른 목적을 가지므로 구분해서 이해해야 합니다.

### 6.3. React Hooks ESLint Plugin의 주요 규칙

| 규칙 | 설명 |
|---|---|
| `rules-of-hooks` | Hooks의 호출 위치와 순서를 검사합니다. |
| `exhaustive-deps` | Effect 및 관련 Hooks의 의존성 배열을 검사합니다. |

최신 `eslint-plugin-react-hooks`는 이외에도 React Compiler와 관련된 규칙 및 컴포넌트와 Hooks의 작성 규칙을 검사하는 다양한 기능을 제공합니다.

## 7. 정리

Rules of Hooks는 React가 컴포넌트의 렌더링 과정에서 Hook의 상태와 실행 순서를 올바르게 관리하기 위한 필수 규칙입니다.

핵심 원칙은 다음과 같습니다.

1. Hooks는 함수 컴포넌트 또는 Custom Hook의 최상위 수준에서 호출해야 합니다.
2. 조건문, 반복문, 중첩 함수, 이벤트 핸들러 내부에서 일반적인 Hooks를 호출하면 안 됩니다.
3. 조건부 `return` 이후에 Hooks를 호출하면 안 됩니다.
4. Hooks는 일반 JavaScript 함수나 클래스 컴포넌트에서 호출할 수 없습니다.
5. Custom Hooks 내부에서는 다른 Hooks를 호출할 수 있습니다.
6. React 19의 `use` API는 조건문과 반복문 내부에서 호출할 수 있지만 별도의 제약을 준수해야 합니다.
7. ESLint 플러그인을 활용하면 잘못된 Hook 호출을 정적으로 검사할 수 있습니다.

Rules of Hooks를 준수하면 React가 렌더링마다 Hook의 상태를 일관되게 추적할 수 있으며, 컴포넌트의 상태 관리와 동작을 예측 가능한 형태로 유지할 수 있습니다.

## 8. 참고 자료

- [React 공식 문서 - Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React 공식 문서 - Rules of React](https://react.dev/reference/rules)
- [React 공식 문서 - use API](https://react.dev/reference/react/use)
- [React 공식 문서 - Invalid Hook Call Warning](https://react.dev/warnings/invalid-hook-call-warning)
- [React 공식 문서 - eslint-plugin-react-hooks](https://react.dev/reference/eslint-plugin-react-hooks)
- [React 공식 문서 - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [한국어 React 공식 문서 - Rules of Hooks](https://ko.react.dev/reference/rules/rules-of-hooks)
- [한국어 React 공식 문서 - Rules of React](https://ko.react.dev/reference/rules)