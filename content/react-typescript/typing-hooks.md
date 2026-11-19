# Typing Hooks

React Hooks는 함수형 컴포넌트에서 상태 관리, 생명주기와 유사한 동작, Context 접근, 성능 최적화 등의 기능을 사용할 수 있도록 제공하는 함수입니다.

TypeScript와 함께 사용하면 Hooks의 인자와 반환값에 대한 타입을 지정하여 상태와 로직의 타입 안정성을 확보할 수 있습니다.

React는 대부분의 Hooks에 대해 타입 추론을 지원하므로 모든 값에 타입을 명시할 필요는 없습니다. 다만 초기값이 `null`이거나 빈 배열인 경우, 복잡한 상태 구조를 사용하는 경우에는 명시적인 타입 지정이 필요할 수 있습니다.

## 1. useState

`useState`는 함수형 컴포넌트에서 상태를 선언하고 관리하는 Hook입니다.

TypeScript는 초기값을 기반으로 상태 타입을 추론합니다.

### 1.1 Type Inference

초기값이 명확한 경우에는 별도의 타입 선언 없이 사용할 수 있습니다.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <button onClick={increment}>
      {count}
    </button>
  );
}
```

초기값이 숫자이므로 `count`는 `number` 타입으로 추론됩니다.

`setCount` 역시 숫자 또는 숫자를 반환하는 업데이트 함수를 인자로 받도록 타입이 추론됩니다.

### 1.2 Explicit Type Annotation

초기값만으로 상태 타입을 정확하게 추론하기 어려운 경우에는 Generic을 사용합니다.

```tsx
import { useState } from "react";

type User = {
  id: number;
  name: string;
};

function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = () => {
    setUser({
      id: 1,
      name: "Kim",
    });
  };

  return (
    <div>
      {user ? user.name : "No user"}
      <button onClick={loadUser}>
        Load User
      </button>
    </div>
  );
}
```

초기값이 `null`이더라도 실제 상태에서는 `User` 객체가 저장될 수 있으므로 `User | null`로 선언합니다.

이렇게 하면 상태가 초기화되지 않은 상황과 정상적인 데이터가 존재하는 상황을 타입 수준에서 구분할 수 있습니다.

### 1.3 Array State

빈 배열을 초기값으로 사용하는 경우에는 배열 요소의 타입을 명시하는 것이 좋습니다.

```tsx
import { useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = () => {
    setTodos((prev) => [
      ...prev,
      {
        id: 1,
        title: "Learn TypeScript",
        completed: false,
      },
    ]);
  };

  return (
    <button onClick={addTodo}>
      Add Todo: {todos.length}
    </button>
  );
}
```

`useState<Todo[]>([])`와 같이 선언하면 배열에 저장되는 요소가 `Todo` 타입으로 제한됩니다.

### 1.4 Union State

상태가 여러 종류의 값을 가질 수 있다면 Union Type을 사용할 수 있습니다.

```tsx
type Status = "idle" | "loading" | "success" | "error";

function DataLoader() {
  const [status, setStatus] = useState<Status>("idle");

  return (
    <button onClick={() => setStatus("loading")}>
      {status}
    </button>
  );
}
```

이 경우 `status`에는 선언된 네 가지 문자열만 할당할 수 있습니다.

### 1.5 Functional Updates

이전 상태를 기반으로 새로운 상태를 계산할 때는 함수형 업데이트를 사용할 수 있습니다.

```tsx
const [count, setCount] = useState(0);

setCount((prev) => prev + 1);
```

TypeScript는 `prev`의 타입을 현재 상태 타입인 `number`로 추론합니다.

상태 업데이트가 이전 상태에 의존하는 경우 함수형 업데이트를 사용하면 상태 변경 로직을 명확하게 표현할 수 있습니다.

## 2. useReducer

`useReducer`는 상태와 상태 변경 로직을 Reducer 함수로 분리하여 관리하는 Hook입니다.

상태 구조가 복잡하거나 여러 종류의 상태 변경 작업이 필요한 경우에 활용할 수 있습니다.

### 2.1 Typing State and Action

Reducer를 사용할 때는 상태 타입과 Action 타입을 정의하는 것이 좋습니다.

```tsx
import { useReducer } from "react";

type State = {
  count: number;
};

type Action =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" };

const initialState: State = {
  count: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + 1,
      };

    case "decrement":
      return {
        count: state.count - 1,
      };

    case "reset":
      return initialState;

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>{state.count}</p>

      <button onClick={() => dispatch({ type: "increment" })}>
        Increment
      </button>

      <button onClick={() => dispatch({ type: "decrement" })}>
        Decrement
      </button>

      <button onClick={() => dispatch({ type: "reset" })}>
        Reset
      </button>
    </div>
  );
}
```

`State`는 Reducer가 관리하는 상태의 구조를 나타냅니다.

`Action`은 Reducer에 전달할 수 있는 작업의 종류를 Union Type으로 정의합니다.

이러한 구조를 사용하면 존재하지 않는 Action을 전달하거나 필수 데이터가 누락된 Action을 전달하는 실수를 방지할 수 있습니다.

### 2.2 Discriminated Union

Action을 Discriminated Union으로 선언하면 `action.type`에 따라 각 Action의 속성을 안전하게 사용할 수 있습니다.

```tsx
type State = {
  user: User | null;
  loading: boolean;
};

type User = {
  id: number;
  name: string;
};

type Action =
  | { type: "loading" }
  | { type: "success"; payload: User }
  | { type: "failure" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        loading: true,
      };

    case "success":
      return {
        user: action.payload,
        loading: false,
      };

    case "failure":
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
```

`success` Action에서만 `payload`에 접근할 수 있습니다.

Discriminated Union은 Reducer의 상태 변경 규칙을 타입으로 표현하는 데 유용합니다.

### 2.3 Lazy Initialization

초기 상태 계산에 별도의 로직이 필요한 경우에는 초기화 함수를 사용할 수 있습니다.

```tsx
import { useReducer } from "react";

type State = {
  count: number;
};

type Action = {
  type: "increment";
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + 1,
      };
  }
}

function init(initialCount: number): State {
  return {
    count: initialCount,
  };
}

function Counter() {
  const [state, dispatch] = useReducer(
    reducer,
    10,
    init
  );

  return (
    <button onClick={() => dispatch({ type: "increment" })}>
      {state.count}
    </button>
  );
}
```

초기화 함수는 세 번째 인자로 전달하며, 두 번째 인자로 전달된 초기값을 기반으로 실제 상태를 생성합니다.

## 3. useRef

`useRef`는 렌더링 사이에 유지되는 값을 저장하는 Hook입니다.

Ref 객체의 `current` 속성은 변경할 수 있으며, 해당 값의 변경만으로는 컴포넌트가 다시 렌더링되지 않습니다.

TypeScript에서는 Ref에 저장할 값의 타입을 Generic으로 지정할 수 있습니다.

### 3.1 DOM Reference

DOM 요소에 접근할 때는 요소의 타입과 `null`을 함께 지정합니다.

```tsx
import { useRef } from "react";

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} />

      <button onClick={handleFocus}>
        Focus
      </button>
    </>
  );
}
```

DOM 요소는 컴포넌트가 처음 렌더링되는 시점에 아직 연결되지 않았을 수 있으므로 초기값으로 `null`을 전달합니다.

따라서 `inputRef.current`는 `HTMLInputElement | null` 타입으로 취급됩니다.

`?.` 연산자를 사용하면 Ref가 연결되지 않은 상황을 안전하게 처리할 수 있습니다.

### 3.2 Mutable Value Reference

DOM 요소가 아닌 일반적인 값을 저장할 수도 있습니다.

```tsx
import { useRef } from "react";

function Timer() {
  const countRef = useRef<number>(0);

  const increment = () => {
    countRef.current += 1;

    console.log(countRef.current);
  };

  return (
    <button onClick={increment}>
      Increment
    </button>
  );
}
```

`countRef.current`는 숫자 타입으로 관리됩니다.

이 값은 변경되어도 컴포넌트를 다시 렌더링하지 않습니다.

따라서 화면에 표시되어야 하는 상태에는 `useState`를 사용하고, 렌더링과 무관하게 유지할 값에는 `useRef`를 사용하는 것이 적절합니다.

### 3.3 useRef and React 19

React 19에서는 Ref 관련 타입과 동작이 일부 변경되었습니다.

특히 React 19의 타입 정의에서는 `useRef`의 초기값을 필수로 전달해야 합니다.

```tsx
const countRef = useRef<number>(0);

const inputRef = useRef<HTMLInputElement>(null);
```

이전 버전의 React 타입 정의에서는 초기값이 없는 `useRef<T>()` 사용 패턴도 존재했으므로 React 버전과 `@types/react` 버전을 함께 고려해야 합니다.

또한 React 19에서는 함수형 컴포넌트가 `ref`를 일반 Props처럼 받을 수 있으므로 기존 `forwardRef` 사용 패턴과 차이가 있습니다. 관련 내용은 `typing-refs.md`에서 별도로 다룹니다.

## 4. useContext

`useContext`는 Context에 저장된 값을 컴포넌트에서 읽을 수 있도록 제공하는 Hook입니다.

TypeScript에서는 Context를 생성할 때 전달하는 초기값 또는 타입 매개변수를 통해 Context 값의 타입을 정의합니다.

### 4.1 Creating Typed Context

Context의 타입을 명시적으로 선언할 수 있습니다.

```tsx
import { createContext, useContext } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(
  null
);
```

위 Context는 `ThemeContextType` 또는 `null`을 값으로 가질 수 있습니다.

초기값으로 `null`을 사용하는 이유는 Provider 외부에서 Context에 접근하는 상황을 명확하게 처리하기 위해서입니다.

### 4.2 Typed Custom Hook

Context 접근 로직을 Custom Hook으로 분리할 수 있습니다.

```tsx
function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return context;
}
```

`context === null` 검사를 수행하면 TypeScript는 이후 반환되는 값이 `ThemeContextType`임을 추론합니다.

컴포넌트에서는 다음과 같이 사용할 수 있습니다.

```tsx
function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Current Theme: {theme}
    </button>
  );
}
```

이 패턴은 Context 사용 시 반복적인 Null 검사를 방지하고 Provider 사용 규칙을 명확하게 표현할 수 있습니다.

## 5. useMemo

`useMemo`는 계산 결과를 메모이제이션하는 Hook입니다.

TypeScript는 반환되는 계산 결과를 기반으로 타입을 추론합니다.

```tsx
import { useMemo } from "react";

type User = {
  id: number;
  name: string;
};

function UserList({ users }: { users: User[] }) {
  const activeUsers = useMemo(() => {
    return users.filter((user) => user.id > 0);
  }, [users]);

  return (
    <ul>
      {activeUsers.map((user) => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

`activeUsers`는 `User[]` 타입으로 추론됩니다.

계산 결과의 타입이 명확하다면 별도의 Generic을 지정할 필요가 없습니다.

필요한 경우에는 반환 타입을 명시할 수도 있습니다.

```tsx
const activeUsers = useMemo<User[]>(() => {
  return users.filter((user) => user.id > 0);
}, [users]);
```

다만 일반적으로는 반환값을 기반으로 한 타입 추론을 우선적으로 활용하는 것이 좋습니다.

## 6. useCallback

`useCallback`은 함수 정의를 메모이제이션하는 Hook입니다.

TypeScript는 함수의 매개변수와 반환값을 기반으로 함수 타입을 추론합니다.

```tsx
import { useCallback } from "react";

function Counter() {
  const handleClick = useCallback(() => {
    console.log("Clicked");
  }, []);

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

매개변수가 존재하는 경우에도 일반적인 함수 타입 추론을 활용할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

function UserButton() {
  const handleSelect = useCallback((user: User) => {
    console.log(user.name);
  }, []);

  return (
    <button
      onClick={() =>
        handleSelect({
          id: 1,
          name: "Kim",
        })
      }
    >
      Select User
    </button>
  );
}
```

`handleSelect`는 `User`를 매개변수로 받는 함수로 추론됩니다.

필요한 경우 `React.MouseEventHandler`와 같은 함수 타입을 명시적으로 사용할 수도 있습니다.

```tsx
const handleClick: React.MouseEventHandler<HTMLButtonElement> =
  useCallback((event) => {
    console.log(event.currentTarget);
  }, []);
```

`useCallback`은 함수의 타입을 결정하는 기능이 아니라 함수 참조를 메모이제이션하는 기능입니다.

## 7. useEffect

`useEffect`는 컴포넌트가 외부 시스템과 동기화되도록 하는 Hook입니다.

외부 데이터 구독, 타이머, 브라우저 API 연동, 네트워크 연결 등의 작업에 활용할 수 있습니다.

### 7.1 Effect Callback

```tsx
import { useEffect } from "react";

function Timer() {
  useEffect(() => {
    const timerId = window.setInterval(() => {
      console.log("Tick");
    }, 1000);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return <div>Timer</div>;
}
```

Effect 콜백은 정리 함수 또는 `undefined`를 반환할 수 있습니다.

따라서 `useEffect`의 콜백은 비동기 함수로 직접 선언하지 않아야 합니다.

```tsx
// 잘못된 방식
useEffect(async () => {
  const response = await fetch("/api/users");
}, []);
```

`async` 함수는 항상 Promise를 반환하지만 React의 Effect 콜백은 정리 함수 또는 `undefined`를 반환해야 합니다.

비동기 작업이 필요한 경우 Effect 내부에 별도의 비동기 함수를 선언하고 실행합니다.

```tsx
useEffect(() => {
  async function fetchUsers() {
    const response = await fetch("/api/users");
    const users = await response.json();

    console.log(users);
  }

  void fetchUsers();
}, []);
```

실제 데이터 요청에서는 Effect가 정리되거나 요청 대상이 변경되는 상황도 고려하여 취소 또는 결과 무시 처리를 추가해야 합니다.

### 7.2 Cleanup Function

Effect에서 반환하는 정리 함수는 구독 해제, 타이머 제거, 이벤트 리스너 제거 등의 작업을 수행합니다.

```tsx
useEffect(() => {
  const handleResize = () => {
    console.log(window.innerWidth);
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, []);
```

TypeScript는 브라우저 이벤트 리스너의 매개변수와 반환값도 추론할 수 있습니다.

## 8. useLayoutEffect

`useLayoutEffect`는 브라우저가 화면을 다시 그리기 전에 실행되는 Effect Hook입니다.

DOM 측정이나 레이아웃 변경처럼 브라우저의 페인팅 이전에 동기적으로 처리해야 하는 작업에 사용할 수 있습니다.

```tsx
import { useLayoutEffect, useRef, useState } from "react";

function Tooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (tooltipRef.current) {
      setHeight(
        tooltipRef.current.getBoundingClientRect().height
      );
    }
  }, []);

  return (
    <div ref={tooltipRef}>
      Tooltip Height: {height}
    </div>
  );
}
```

`useLayoutEffect`의 타입 구조는 `useEffect`와 유사합니다.

일반적인 Effect 작업에는 `useEffect`를 우선적으로 사용하고, 화면 깜빡임을 방지하기 위해 페인팅 전에 처리해야 하는 경우에만 `useLayoutEffect`를 사용하는 것이 좋습니다.

## 9. useId

`useId`는 접근성 속성 등을 연결하기 위한 고유 ID를 생성하는 Hook입니다.

```tsx
import { useId } from "react";

function EmailField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>
        Email
      </label>

      <input
        id={id}
        type="email"
      />
    </div>
  );
}
```

`useId`는 문자열을 반환하므로 별도의 타입 지정이 필요하지 않습니다.

여러 컴포넌트 인스턴스에서 고유한 ID가 필요한 경우 유용합니다.

다만 `useId`는 목록의 React `key`를 생성하기 위한 용도로 사용하지 않아야 합니다. 목록의 `key`는 데이터 자체의 고유 식별자를 사용하는 것이 적절합니다.

## 10. Custom Hooks

Custom Hook은 여러 컴포넌트에서 재사용할 수 있는 상태 관리 및 로직을 함수로 분리한 것입니다.

Custom Hook의 반환 타입은 일반 함수와 동일한 TypeScript 타입 시스템을 따릅니다.

### 10.1 Return Type Inference

반환 타입이 명확하다면 TypeScript의 추론을 활용할 수 있습니다.

```tsx
import { useState } from "react";

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => prev - 1);
  };

  return {
    count,
    increment,
    decrement,
  };
}
```

반환 객체의 각 속성은 내부 상태와 함수의 타입을 기반으로 추론됩니다.

```tsx
function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### 10.2 Explicit Return Type

반환 구조가 복잡하거나 외부에서 재사용해야 하는 경우에는 반환 타입을 별도로 선언할 수 있습니다.

```tsx
type CounterResult = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

function useCounter(initialValue = 0): CounterResult {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => prev - 1);
  };

  return {
    count,
    increment,
    decrement,
  };
}
```

이렇게 하면 Custom Hook의 반환 인터페이스가 명확해지고 반환 구조가 변경될 때 타입 오류를 통해 영향을 확인할 수 있습니다.

### 10.3 Tuple Return Type

Custom Hook에서 여러 값을 배열 형태로 반환할 수도 있습니다.

```tsx
import { useState } from "react";

function useToggle() {
  const [enabled, setEnabled] = useState(false);

  const toggle = () => {
    setEnabled((prev) => !prev);
  };

  return [enabled, toggle] as const;
}
```

`as const`를 사용하면 반환 배열이 일반적인 배열이 아니라 각 위치의 타입이 고정된 readonly Tuple로 추론됩니다.

따라서 다음과 같이 구조 분해 할당을 사용할 때 각 값의 타입이 명확하게 유지됩니다.

```tsx
const [enabled, toggle] = useToggle();
```

- `enabled`: `boolean`
- `toggle`: `() => void`

`as const`를 사용하지 않으면 반환 배열의 각 요소가 Union Type으로 추론될 수 있으므로 Tuple 형태가 필요한 경우 명시적인 반환 타입이나 `as const`를 사용하는 것이 좋습니다.

## 11. Hook Type Inference and Annotation

React Hooks는 TypeScript의 타입 추론을 적극적으로 활용할 수 있도록 설계되어 있습니다.

따라서 모든 Hook에 Generic이나 반환 타입을 명시하는 것보다 타입 추론이 정확한 부분은 그대로 활용하는 것이 좋습니다.

| Hook | 일반적인 타입 지정 방식 |
|---|---|
| `useState` | 초기값으로 타입 추론, 필요하면 Generic 지정 |
| `useReducer` | State와 Action 타입 명시 |
| `useRef` | Ref에 저장할 값의 타입 지정 |
| `useContext` | Context 생성 시 타입 지정 |
| `useMemo` | 반환값으로 타입 추론 |
| `useCallback` | 함수 매개변수와 반환값으로 타입 추론 |
| `useEffect` | 콜백과 정리 함수의 타입 추론 |
| `useLayoutEffect` | 콜백과 정리 함수의 타입 추론 |
| `useId` | 문자열 타입 추론 |

### 11.1 When Explicit Types Are Useful

다음과 같은 상황에서는 명시적인 타입 선언이 유용합니다.

- 초기값만으로 상태 타입을 정확하게 추론하기 어려운 경우
- 빈 배열을 상태로 사용하는 경우
- `null`을 초기값으로 사용하는 경우
- Reducer의 State와 Action 구조를 명확하게 정의해야 하는 경우
- Context의 데이터 구조를 명시해야 하는 경우
- Custom Hook의 반환 인터페이스를 외부에 제공해야 하는 경우

### 11.2 Avoid Unnecessary Type Annotations

반대로 다음과 같이 타입 추론이 충분히 정확한 경우에는 불필요한 타입 선언을 줄일 수 있습니다.

```tsx
const [count, setCount] = useState(0);

const doubled = useMemo(() => count * 2, [count]);

const handleClick = useCallback(() => {
  setCount((prev) => prev + 1);
}, []);
```

불필요한 타입 선언을 줄이면 코드가 간결해지고 타입 정의와 실제 구현 사이의 중복을 줄일 수 있습니다.

## 12. Best Practices

React Hooks를 TypeScript와 함께 사용할 때는 다음 사항을 고려하는 것이 좋습니다.

### 12.1 상태의 의미에 맞는 타입을 선언합니다.

상태가 가질 수 있는 값을 명확하게 표현해야 합니다.

예를 들어 데이터가 아직 존재하지 않는 상태를 `null`로 표현하거나 여러 상태를 Union Type으로 구분할 수 있습니다.

```tsx
type Status = "idle" | "loading" | "success" | "error";
```

### 12.2 복잡한 상태 변경에는 useReducer를 고려합니다.

여러 Action에 따라 상태가 변경되거나 상태 간 의존성이 복잡한 경우 `useReducer`를 활용하면 상태 변경 규칙을 명확하게 관리할 수 있습니다.

### 12.3 Ref와 State의 용도를 구분합니다.

화면 렌더링에 영향을 주는 데이터는 `useState`로 관리하고, 렌더링을 발생시키지 않으면서 유지해야 하는 값은 `useRef`로 관리하는 것이 적절합니다.

### 12.4 Context 생성 시 타입을 명확하게 정의합니다.

Context를 생성할 때 데이터 구조를 명시하고, 필요한 경우 Custom Hook을 통해 Provider 사용 여부를 검증하면 안정적인 Context 접근이 가능합니다.

### 12.5 Custom Hook의 반환 구조를 일관되게 설계합니다.

반환값이 여러 개라면 객체 또는 Tuple 중 적절한 방식을 선택해야 합니다.

- 객체 반환: 반환값의 이름이 명확하고 구조 확장이 편리합니다.
- Tuple 반환: 반환 순서가 명확하고 `useState`와 유사한 사용 경험을 제공합니다.

### 12.6 Hook의 호출 규칙을 준수합니다.

Hook은 컴포넌트 또는 Custom Hook의 최상위 수준에서 호출해야 합니다.

조건문, 반복문, 중첩 함수 내부에서 호출하지 않아야 하며 TypeScript의 타입 검사만으로 Hook 호출 규칙이 완전히 보장되는 것은 아닙니다.

ESLint의 React Hooks 관련 규칙을 함께 사용하는 것이 좋습니다.

## 13. Summary

React Hooks는 TypeScript의 Generic, Union Type, 함수 타입 및 타입 추론을 활용하여 안정적으로 사용할 수 있습니다.

| Hook | 주요 타입 관련 개념 |
|---|---|
| `useState` | 상태 타입 추론 및 Generic |
| `useReducer` | State, Action, Discriminated Union |
| `useRef` | DOM 요소 및 Mutable Value 타입 |
| `useContext` | Context 타입 정의 및 Null 검사 |
| `useMemo` | 계산 결과 타입 추론 |
| `useCallback` | 함수 매개변수 및 반환 타입 추론 |
| `useEffect` | Effect Callback 및 Cleanup Function |
| `useLayoutEffect` | Layout Effect Callback 및 Cleanup Function |
| `useId` | 문자열 타입 추론 |
| Custom Hooks | 반환 타입 및 Tuple 타입 |

Hooks를 TypeScript와 함께 사용할 때는 초기값과 함수의 반환값을 기반으로 한 타입 추론을 우선적으로 활용하는 것이 좋습니다.

다만 상태의 초기값이 불완전하거나 여러 종류의 데이터를 표현해야 하는 경우에는 Generic과 Union Type을 사용하여 상태 구조를 명확하게 정의해야 합니다.

Custom Hook은 일반 함수와 동일한 타입 시스템을 따르므로 반환 타입을 명확하게 설계하면 여러 컴포넌트에서 재사용할 수 있는 안정적인 로직을 구성할 수 있습니다.

## 14. References

- [React 공식 문서 - Built-in React Hooks](https://react.dev/reference/react/hooks)
  - React에서 제공하는 기본 Hooks의 종류와 역할을 설명합니다.
- [React 공식 문서 - useState](https://react.dev/reference/react/useState)
  - 상태 선언, 초기화, 업데이트 및 함수형 업데이트 방법을 설명합니다.
- [React 공식 문서 - useReducer](https://react.dev/reference/react/useReducer)
  - Reducer 기반 상태 관리와 초기 상태 설정 방법을 설명합니다.
- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
  - Ref 객체와 DOM 참조, 렌더링과 무관한 값의 관리 방법을 설명합니다.
- [React 공식 문서 - useContext](https://react.dev/reference/react/useContext)
  - Context를 생성하고 컴포넌트에서 사용하는 방법을 설명합니다.
- [React 공식 문서 - useEffect](https://react.dev/reference/react/useEffect)
  - Effect의 실행, 의존성 및 정리 함수에 대해 설명합니다.
- [React 공식 문서 - useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
  - 브라우저 페인팅 이전에 실행되는 Layout Effect의 동작을 설명합니다.
- [React 공식 문서 - useMemo](https://react.dev/reference/react/useMemo)
  - 계산 결과의 메모이제이션과 사용 시 주의사항을 설명합니다.
- [React 공식 문서 - useCallback](https://react.dev/reference/react/useCallback)
  - 함수 참조의 메모이제이션과 의존성 관리 방법을 설명합니다.
- [React 공식 문서 - useId](https://react.dev/reference/react/useId)
  - 접근성 속성 등에 사용할 수 있는 고유 ID 생성 방법을 설명합니다.
- [React 공식 문서 - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
  - Custom Hook의 설계와 재사용 가능한 로직 구성 방법을 설명합니다.
- [React 공식 문서 - Using TypeScript](https://react.dev/learn/typescript)
  - React 프로젝트에서 TypeScript를 활용하는 기본 방법을 설명합니다.
- [React TypeScript Cheatsheet - Hooks](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks)
  - React Hooks를 TypeScript와 함께 사용하는 대표적인 패턴을 설명합니다.
- [DefinitelyTyped - React Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)
  - React Hooks의 실제 타입 정의와 Generic 구조를 확인할 수 있습니다.