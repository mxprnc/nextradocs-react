# Typing Custom Hooks

Custom Hook은 React Hook을 조합하여 컴포넌트 간에 재사용할 수 있는 상태 관리 및 로직을 구현하는 함수입니다.

TypeScript와 함께 Custom Hook을 작성하면 매개변수, 반환값, 상태 및 외부에서 전달받는 함수의 타입을 명확하게 정의할 수 있습니다.

Custom Hook은 일반 함수와 달리 React Hook을 호출할 수 있는 규칙을 따르며, 일반적으로 `use` 접두사로 시작하는 이름을 사용합니다.

## 1. Custom Hook 기본 구조

Custom Hook은 React의 내장 Hook이나 다른 Custom Hook을 조합하여 구현합니다.

```tsx
import { useState } from "react";

function useCounter(initialValue: number = 0) {
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

위 예제의 `useCounter`는 다음과 같은 기능을 제공합니다.

- `initialValue`를 통해 초기값을 전달받습니다.
- `useState`로 카운터 상태를 관리합니다.
- `increment`와 `decrement`를 통해 상태를 변경합니다.
- 객체 형태로 상태와 함수를 반환합니다.

TypeScript는 매개변수와 내부 상태를 기반으로 반환 타입을 추론합니다.

```tsx
const counter = useCounter(10);

counter.count;      // number
counter.increment;  // () => void
counter.decrement;  // () => void
```

반환 타입을 명시하지 않아도 타입 추론이 가능한 경우에는 별도의 타입 선언이 필수는 아닙니다.

## 2. Typing Parameters

Custom Hook은 일반 함수와 동일하게 매개변수의 타입을 정의할 수 있습니다.

### 2.1 Primitive Parameters

문자열, 숫자, Boolean 등의 기본 타입을 매개변수로 사용할 수 있습니다.

```tsx
function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => {
    setValue((prev) => !prev);
  };

  return {
    value,
    toggle,
  };
}
```

`initialValue`는 `boolean` 타입이며 기본값이 지정되어 있으므로 호출할 때 생략할 수 있습니다.

```tsx
const toggle = useToggle();
const enabled = useToggle(true);
```

### 2.2 Object Parameters

여러 설정값을 전달해야 하는 경우 객체 형태의 매개변수를 사용할 수 있습니다.

```tsx
type PaginationOptions = {
  initialPage?: number;
  pageSize: number;
};

function usePagination({
  initialPage = 1,
  pageSize,
}: PaginationOptions) {
  const [page, setPage] = useState(initialPage);

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const previousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const offset = (page - 1) * pageSize;

  return {
    page,
    pageSize,
    offset,
    nextPage,
    previousPage,
  };
}
```

객체 매개변수의 타입을 별도로 정의하면 Hook의 설정 항목을 명확하게 표현할 수 있습니다.

### 2.3 Optional Parameters

선택적 매개변수에는 `?`를 사용합니다.

```tsx
type DebounceOptions = {
  delay?: number;
};

function useDebounce(
  value: string,
  { delay = 300 }: DebounceOptions = {},
) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce logic

  return debouncedValue;
}
```

위 예제에서는 설정 객체 자체와 `delay` 속성을 모두 선택적으로 지정할 수 있습니다.

선택적 매개변수에 기본값을 제공하면 Hook 내부에서 사용할 값을 명확하게 관리할 수 있습니다.

## 3. Typing Return Values

Custom Hook의 반환값은 일반적으로 객체 또는 배열 형태로 구성합니다.

반환 구조에 따라 TypeScript가 추론하는 타입과 호출하는 측의 사용 방식이 달라집니다.

### 3.1 Object Return

객체 형태로 반환하면 각 속성에 이름이 부여되므로 구조를 명확하게 파악할 수 있습니다.

```tsx
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return {
    count,
    setCount,
    increment,
  };
}
```

사용하는 측에서는 필요한 속성만 구조 분해하여 가져올 수 있습니다.

```tsx
const {
  count,
  increment,
} = useCounter();
```

객체 반환은 상태와 관련 함수를 여러 개 제공하는 Custom Hook에 적합합니다.

### 3.2 Tuple Return

배열 형태로 반환하면 호출하는 측에서 원하는 변수명을 지정할 수 있습니다.

```tsx
function useCounter(initialValue: number = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return [count, increment] as const;
}
```

`as const`를 사용하면 반환 배열이 일반적인 배열이 아니라 각 요소의 위치와 타입이 고정된 readonly Tuple로 추론됩니다.

```tsx
const [count, increment] = useCounter();
```

`as const`를 사용하지 않으면 반환값이 다음과 같은 Union 배열로 추론될 수 있습니다.

```tsx
(number | (() => void))[]
```

이 경우 각 인덱스가 어떤 타입인지 명확하게 보장되지 않습니다.

Tuple의 각 위치에 타입을 명시하고 싶다면 반환 타입을 직접 선언할 수도 있습니다.

```tsx
type CounterResult = [
  count: number,
  increment: () => void,
];

function useCounter(initialValue: number = 0): CounterResult {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return [count, increment];
}
```

객체 반환과 Tuple 반환은 목적에 따라 선택할 수 있습니다.

| 반환 방식 | 특징 |
|---|---|
| Object | 속성 이름으로 접근하며 여러 값을 명확하게 구분합니다. |
| Tuple | 위치에 따라 값을 구분하며 호출하는 측에서 변수명을 지정할 수 있습니다. |

## 4. Generic Custom Hooks

Generic을 사용하면 특정 데이터 타입에 종속되지 않는 Custom Hook을 구현할 수 있습니다.

### 4.1 Generic State Hook

다양한 타입의 초기값을 처리하는 Hook을 구현할 수 있습니다.

```tsx
import { useState } from "react";

function useValue<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  const reset = () => {
    setValue(initialValue);
  };

  return {
    value,
    setValue,
    reset,
  };
}
```

`T`는 초기값으로부터 추론되며, 상태와 Setter에도 동일한 타입이 적용됩니다.

```tsx
const stringValue = useValue("hello");
// value: string

const numberValue = useValue(100);
// value: number

const booleanValue = useValue(true);
// value: boolean
```

Generic을 사용하면 동일한 로직을 여러 데이터 타입에서 재사용할 수 있습니다.

### 4.2 Generic List Hook

배열 데이터를 관리하는 Hook에도 Generic을 적용할 수 있습니다.

```tsx
import { useState } from "react";

function useList<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);

  const add = (item: T) => {
    setItems((prev) => [...prev, item]);
  };

  const remove = (index: number) => {
    setItems((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const clear = () => {
    setItems([]);
  };

  return {
    items,
    add,
    remove,
    clear,
  };
}
```

사용하는 데이터 타입에 따라 `T`가 결정됩니다.

```tsx
const numbers = useList<number>([1, 2, 3]);

numbers.add(4);
numbers.add(5);

// Type Error
// numbers.add("hello");
```

객체 배열도 동일한 방식으로 관리할 수 있습니다.

```tsx
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todos = useList<Todo>([]);
```

### 4.3 Generic Constraints

Generic에 `extends`를 사용하면 허용할 타입의 조건을 제한할 수 있습니다.

```tsx
type Identifiable = {
  id: string | number;
};

function useEntityList<T extends Identifiable>(
  initialItems: T[] = [],
) {
  const [items, setItems] = useState<T[]>(initialItems);

  const findById = (id: T["id"]) => {
    return items.find((item) => item.id === id);
  };

  return {
    items,
    findById,
  };
}
```

`T extends Identifiable`은 전달되는 타입이 반드시 `id` 속성을 포함해야 한다는 의미입니다.

```tsx
type User = {
  id: number;
  name: string;
};

const users = useEntityList<User>([]);

users.findById(1);
```

Generic Constraint를 사용하면 재사용성을 유지하면서 Hook 내부에서 필요한 속성에 안전하게 접근할 수 있습니다.

## 5. Typing Callbacks

Custom Hook은 호출하는 측에서 콜백 함수를 전달받을 수 있습니다.

이때 콜백의 매개변수와 반환 타입을 명시하면 Hook과 사용하는 컴포넌트 사이의 인터페이스를 명확하게 정의할 수 있습니다.

### 5.1 Callback Parameters

```tsx
type UseCounterOptions = {
  onChange?: (value: number) => void;
};

function useCounter(
  initialValue: number = 0,
  options: UseCounterOptions = {},
) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    setCount((prev) => {
      const next = prev + 1;
      options.onChange?.(next);
      return next;
    });
  };

  return {
    count,
    increment,
  };
}
```

`onChange`는 숫자를 전달받고 반환값이 없는 함수입니다.

호출하는 측에서는 다음과 같이 콜백을 전달할 수 있습니다.

```tsx
const counter = useCounter(0, {
  onChange: (value) => {
    console.log("Current count:", value);
  },
});
```

### 5.2 Function Type Alias

콜백 타입을 여러 곳에서 재사용해야 한다면 Type Alias로 정의할 수 있습니다.

```tsx
type ValueChangeHandler<T> = (value: T) => void;

type UseValueOptions<T> = {
  onChange?: ValueChangeHandler<T>;
};
```

Generic Function Type을 사용하면 다양한 데이터 타입에 동일한 콜백 구조를 적용할 수 있습니다.

### 5.3 Async Callbacks

비동기 콜백을 전달받는 경우에는 `Promise` 반환 타입을 지정할 수 있습니다.

```tsx
type SubmitHandler<T> = (data: T) => Promise<void>;

type UseSubmitOptions<T> = {
  onSubmit: SubmitHandler<T>;
};
```

이러한 타입은 서버 요청이나 비동기 데이터 처리 로직을 Custom Hook에 연결할 때 활용할 수 있습니다.

다만 `Promise<void>`는 비동기 작업의 완료 여부만 표현하므로, 결과 데이터를 반환해야 한다면 반환 타입을 구체적으로 정의해야 합니다.

```tsx
type FetchHandler<T, R> = (input: T) => Promise<R>;
```

## 6. Custom Hooks with useEffect

Custom Hook에서는 `useEffect`를 사용하여 외부 시스템과 동기화하는 로직을 재사용할 수 있습니다.

대표적으로 API 요청, 이벤트 리스너 등록, 타이머 관리 등이 있습니다.

### 6.1 Typing Fetch Hooks

API 응답 데이터를 Generic으로 처리하면 다양한 응답 구조를 지원할 수 있습니다.

```tsx
import { useEffect, useState } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function useFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setState({
        data: null,
        loading: true,
        error: null,
      });

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = (await response.json()) as T;

        setState({
          data: result,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setState({
          data: null,
          loading: false,
          error: error instanceof Error
            ? error
            : new Error("Unknown error"),
        });
      }
    }

    void fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return state;
}
```

사용하는 측에서 응답 데이터 타입을 지정할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

function UserProfile() {
  const { data, loading, error } = useFetch<User>(
    "/api/users/1"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data) return <p>No user found</p>;

  return <p>{data.name}</p>;
}
```

다만 `response.json()`의 결과를 `T`로 단언하는 것은 실제 응답 데이터가 해당 타입과 일치하는지 검증하지 않습니다.

서버 응답은 런타임 데이터이므로 신뢰할 수 없는 외부 데이터라면 Zod 등의 스키마 검증을 함께 사용하는 것이 안전합니다.

또한 이 예제는 URL 변경에 따른 요청 취소를 처리하지만, 여러 요청의 경합이나 캐싱, 중복 요청, 재시도 등의 기능까지 제공하지는 않습니다.

### 6.2 Typing Event Listeners

브라우저 이벤트 리스너를 관리하는 Custom Hook에서도 이벤트 타입을 지정할 수 있습니다.

```tsx
import { useEffect } from "react";

function useWindowEvent<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
) {
  useEffect(() => {
    const listener = (event: WindowEventMap[K]) => {
      handler(event);
    };

    window.addEventListener(eventName, listener);

    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, [eventName, handler]);
}
```

`WindowEventMap`은 브라우저의 Window 이벤트 이름과 이벤트 객체 타입을 연결하는 인터페이스입니다.

Generic Constraint를 사용하면 이벤트 이름에 따라 이벤트 객체 타입을 추론할 수 있습니다.

```tsx
function Component() {
  useWindowEvent("resize", (event) => {
    console.log(window.innerWidth);
  });

  useWindowEvent("keydown", (event) => {
    console.log(event.key);
  });

  return <div>Event Listener Example</div>;
}
```

`resize` 이벤트에는 `UIEvent`, `keydown` 이벤트에는 `KeyboardEvent`가 연결됩니다.

단, 위 구현은 `handler`가 렌더링마다 새로운 함수로 생성되면 Effect가 다시 실행될 수 있습니다. 필요하다면 호출 측에서 콜백을 안정화하거나 최신 콜백을 Ref로 관리하는 패턴을 고려할 수 있습니다.

## 7. Typing Custom Hook Return States

비동기 작업이나 복잡한 상태를 관리하는 Hook에서는 여러 Boolean 값보다 명시적인 상태 타입을 사용하는 것이 유용합니다.

### 7.1 Union Types for Async States

```tsx
type AsyncState<T> =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      error: Error;
    };
```

Discriminated Union을 사용하면 상태별로 필요한 데이터만 포함할 수 있습니다.

```tsx
function useAsyncState<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    status: "idle",
  });

  const loading = () => {
    setState({ status: "loading" });
  };

  const success = (data: T) => {
    setState({
      status: "success",
      data,
    });
  };

  const failure = (error: Error) => {
    setState({
      status: "error",
      error,
    });
  };

  return {
    state,
    loading,
    success,
    failure,
  };
}
```

사용하는 측에서는 `status`를 기준으로 상태를 구분할 수 있습니다.

```tsx
const { state } = useAsyncState<User>();

switch (state.status) {
  case "idle":
    return <p>Waiting...</p>;

  case "loading":
    return <p>Loading...</p>;

  case "success":
    return <p>{state.data.name}</p>;

  case "error":
    return <p>{state.error.message}</p>;
}
```

이 방식은 상태와 데이터의 관계를 타입으로 표현하므로 유효하지 않은 상태 조합을 줄이는 데 도움이 됩니다.

## 8. Typing Refs in Custom Hooks

Custom Hook에서 DOM 요소나 특정 값을 참조해야 한다면 `useRef`를 활용할 수 있습니다.

### 8.1 Generic Element Ref

```tsx
import { useRef } from "react";

function useInputRef() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focus = () => {
    inputRef.current?.focus();
  };

  return {
    inputRef,
    focus,
  };
}
```

`useRef<HTMLInputElement>(null)`은 Input DOM 요소를 참조할 수 있는 Ref를 생성합니다.

```tsx
function SearchInput() {
  const { inputRef, focus } = useInputRef();

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focus}>Focus</button>
    </div>
  );
}
```

### 8.2 Generic Element Type

여러 종류의 DOM 요소를 지원해야 한다면 Generic으로 요소 타입을 전달받을 수 있습니다.

```tsx
import { useRef } from "react";

function useElementRef<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  return ref;
}
```

사용하는 측에서 원하는 요소 타입을 지정할 수 있습니다.

```tsx
function SearchInput() {
  const inputRef = useElementRef<HTMLInputElement>();

  return <input ref={inputRef} />;
}
```

이 패턴은 특정 DOM 요소에 종속되지 않는 재사용 가능한 Ref Hook을 구현할 때 유용합니다.

## 9. Typing Custom Hooks with Reducer

복잡한 상태 전이가 필요한 경우 Custom Hook 내부에서 `useReducer`를 활용할 수 있습니다.

### 9.1 Defining State and Actions

```tsx
type CounterState = {
  count: number;
};

type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset"; payload: number };
```

State와 Action을 별도의 타입으로 정의하면 상태 전이 규칙을 명확하게 표현할 수 있습니다.

### 9.2 Defining Reducer

```tsx
function counterReducer(
  state: CounterState,
  action: CounterAction,
): CounterState {
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
      return {
        count: action.payload,
      };

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
```

`never`를 활용하면 모든 Action을 처리했는지 컴파일 단계에서 확인할 수 있습니다.

새로운 Action을 추가한 후 Reducer에서 처리하지 않으면 타입 오류가 발생합니다.

### 9.3 Creating Custom Hook

```tsx
import { useReducer } from "react";

function useCounter(initialValue: number = 0) {
  const [state, dispatch] = useReducer(
    counterReducer,
    {
      count: initialValue,
    },
  );

  const increment = () => {
    dispatch({ type: "increment" });
  };

  const decrement = () => {
    dispatch({ type: "decrement" });
  };

  const reset = () => {
    dispatch({
      type: "reset",
      payload: initialValue,
    });
  };

  return {
    count: state.count,
    increment,
    decrement,
    reset,
  };
}
```

사용하는 측에서는 Reducer의 내부 구현을 알 필요 없이 공개된 인터페이스만 사용할 수 있습니다.

```tsx
function Counter() {
  const {
    count,
    increment,
    decrement,
    reset,
  } = useCounter(10);

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

이처럼 Custom Hook은 복잡한 상태 전이 로직을 내부에 캡슐화하고 컴포넌트에는 단순한 인터페이스를 제공할 수 있습니다.

## 10. Custom Hook Composition

Custom Hook은 다른 Custom Hook을 호출하여 더 큰 기능을 구성할 수 있습니다.

이러한 조합을 통해 공통 로직을 작은 단위로 분리하고 재사용할 수 있습니다.

### 10.1 Combining Hooks

```tsx
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

function useCounterWithLimit(
  initialValue: number,
  max: number,
) {
  const { count, increment } = useCounter(initialValue);

  const incrementWithinLimit = () => {
    if (count < max) {
      increment();
    }
  };

  return {
    count,
    increment: incrementWithinLimit,
  };
}
```

`useCounterWithLimit`은 기존 `useCounter`를 조합하여 최대값 제한 기능을 추가합니다.

다만 위 예제는 현재 렌더링 시점의 `count`를 기준으로 제한을 검사합니다. 상태 업데이트가 연속적으로 발생하는 상황까지 엄격하게 제한해야 한다면 제한 조건을 포함한 상태 업데이트 함수를 하나의 Hook 내부에서 원자적으로 처리하는 것이 적절합니다.

### 10.2 Hook Composition Benefits

Custom Hook을 조합하면 다음과 같은 장점이 있습니다.

- 기능별 로직을 독립적으로 분리할 수 있습니다.
- 공통 기능을 여러 Hook에서 재사용할 수 있습니다.
- 각 Hook의 책임과 반환 인터페이스를 명확하게 유지할 수 있습니다.
- 컴포넌트에서 상태 관리 및 부수 효과의 세부 구현을 분리할 수 있습니다.

단, Custom Hook은 상태 자체를 여러 컴포넌트 사이에서 자동으로 공유하지 않습니다.

동일한 Custom Hook을 두 컴포넌트에서 각각 호출하면 각 호출마다 독립적인 Hook 상태가 생성됩니다. 상태를 공유해야 한다면 Context, 외부 Store 또는 상위 컴포넌트의 상태 관리가 필요합니다.

## 11. Common Type Errors

Custom Hook을 TypeScript와 함께 사용할 때 자주 발생하는 문제는 다음과 같습니다.

### 11.1 Incorrect Tuple Inference

다음과 같이 배열을 반환하면 Union 배열로 추론될 수 있습니다.

```tsx
function useToggle() {
  const [value, setValue] = useState(false);

  const toggle = () => {
    setValue((prev) => !prev);
  };

  return [value, toggle];
}
```

반환값이 `(boolean | (() => void))[]` 형태로 추론되면 각 요소의 타입을 정확하게 구분하기 어렵습니다.

Tuple이 필요한 경우 `as const` 또는 명시적인 Tuple 반환 타입을 사용해야 합니다.

```tsx
function useToggle() {
  const [value, setValue] = useState(false);

  const toggle = () => {
    setValue((prev) => !prev);
  };

  return [value, toggle] as const;
}
```

### 11.2 Missing Generic Type

초기값만으로 타입을 추론하기 어려운 경우에는 Generic을 명시해야 합니다.

```tsx
const [user, setUser] = useState<User | null>(null);
```

초기값이 `null`인 경우 `useState<User | null>`로 선언하면 이후 User 객체와 null을 모두 안전하게 관리할 수 있습니다.

### 11.3 Incorrect Callback Type

콜백 함수의 매개변수 타입이 실제 전달되는 데이터 타입과 일치하지 않으면 타입 오류가 발생합니다.

```tsx
type OnChange<T> = (value: T) => void;

type UseValueOptions<T> = {
  onChange?: OnChange<T>;
};
```

Generic Callback Type을 활용하면 Hook의 데이터 타입과 콜백의 매개변수 타입을 일관되게 유지할 수 있습니다.

### 11.4 Incorrect DOM Ref Type

Ref의 타입과 실제 연결되는 DOM 요소의 타입이 일치하지 않으면 타입 오류가 발생합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

return <input ref={inputRef} />;
```

DOM 요소의 종류에 맞는 타입을 지정해야 합니다.

### 11.5 Missing Hook Dependencies

Custom Hook 내부에서 `useEffect`, `useMemo`, `useCallback` 등을 사용할 때는 의존성 배열을 정확하게 관리해야 합니다.

```tsx
useEffect(() => {
  handler();
}, [handler]);
```

의존성 배열이 실제 사용하는 값과 일치하지 않으면 오래된 값을 참조하는 Stale Closure 문제가 발생할 수 있습니다.

TypeScript는 이러한 의존성 문제를 자동으로 해결하지 않으므로 `eslint-plugin-react-hooks` 등의 정적 분석 도구를 함께 사용하는 것이 좋습니다.

## 12. Best Practices

Custom Hook을 TypeScript와 함께 설계할 때는 다음 사항을 고려하는 것이 좋습니다.

### 12.1 Hook의 입력과 출력 타입을 명확하게 유지합니다.

매개변수와 반환값이 복잡한 경우 별도의 Type Alias 또는 Interface를 정의하면 사용 방법을 쉽게 파악할 수 있습니다.

### 12.2 Generic을 필요한 경우에만 사용합니다.

여러 데이터 타입에서 동일한 로직을 재사용해야 한다면 Generic을 활용합니다.

특정 데이터 타입에만 사용되는 Hook이라면 불필요한 Generic을 추가하지 않는 것이 좋습니다.

### 12.3 반환 구조를 일관되게 설계합니다.

여러 상태와 함수를 반환하는 경우 객체 형태가 유용합니다.

두세 개의 값이 명확한 순서로 연결되는 경우에는 Tuple을 사용할 수 있습니다.

### 12.4 런타임 데이터 검증을 별도로 처리합니다.

TypeScript의 타입 선언은 런타임 데이터의 유효성을 보장하지 않습니다.

API 응답이나 사용자 입력을 처리하는 Hook에서는 필요한 경우 스키마 검증을 수행해야 합니다.

### 12.5 Hook의 책임을 작게 유지합니다.

하나의 Custom Hook에 서로 관련이 없는 상태 관리와 부수 효과를 지나치게 많이 포함하지 않는 것이 좋습니다.

기능별로 분리하면 재사용성과 테스트 용이성을 높일 수 있습니다.

### 12.6 Hook 호출 규칙을 준수합니다.

Custom Hook은 React 컴포넌트 또는 다른 Custom Hook의 최상위 수준에서 호출해야 합니다.

조건문, 반복문, 중첩 함수 내부에서 Hook을 호출해서는 안 됩니다.

### 12.7 상태 공유와 로직 재사용을 구분합니다.

Custom Hook은 상태 로직을 재사용하는 수단이지, 호출 간 상태를 자동으로 공유하는 수단은 아닙니다.

여러 컴포넌트가 동일한 상태를 공유해야 한다면 Context 또는 외부 상태 관리 도구를 고려해야 합니다.

## 13. Summary

Custom Hook은 React의 상태 관리 및 부수 효과 로직을 재사용 가능한 함수로 분리하는 방법입니다.

TypeScript를 함께 사용하면 Hook의 입력값, 반환값, Generic, Callback 및 상태 구조를 명확하게 정의할 수 있습니다.

| 개념 | 주요 타입 및 API |
|---|---|
| 기본 Custom Hook | `use` 접두사 함수 |
| 매개변수 타입 | `type`, `interface` |
| 반환 타입 | Object, Tuple |
| Tuple 반환 | `as const` |
| Generic Hook | `<T>` |
| Generic Constraint | `T extends SomeType` |
| Callback Type | `(value: T) => void` |
| Async Callback | `Promise<T>` |
| State Management | `useState`, `useReducer` |
| Side Effects | `useEffect` |
| DOM Reference | `useRef<T>` |
| Event Typing | `WindowEventMap` |
| State Modeling | Discriminated Union |
| Type Safety | `keyof`, `never`, `typeof` |

Custom Hook을 설계할 때는 재사용할 로직의 책임을 명확히 분리하고, 입력과 출력의 타입을 일관되게 정의해야 합니다.

Generic과 Union Type을 적절하게 활용하면 다양한 데이터 구조를 지원하면서도 타입 안정성을 유지할 수 있습니다.

또한 Custom Hook의 로직 재사용과 컴포넌트 간 상태 공유는 서로 다른 개념이므로 요구사항에 맞는 상태 관리 방식을 선택해야 합니다.

## 14. References

- [React 공식 문서 - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
  - Custom Hook의 기본 개념과 재사용 가능한 로직을 구성하는 방법을 설명합니다.
- [React 공식 문서 - Rules of Hooks](https://react.dev/reference/rules)
  - Hook 호출 규칙과 올바른 사용 방법을 설명합니다.
- [React 공식 문서 - useState](https://react.dev/reference/react/useState)
  - Custom Hook에서 사용하는 State 관리와 타입 추론을 설명합니다.
- [React 공식 문서 - useEffect](https://react.dev/reference/react/useEffect)
  - Effect의 생명주기, 의존성 및 정리 함수의 동작을 설명합니다.
- [React 공식 문서 - useReducer](https://react.dev/reference/react/useReducer)
  - Reducer를 이용한 상태 전이와 Action 처리 방법을 설명합니다.
- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
  - Ref를 이용한 DOM 참조와 변경 가능한 값의 관리 방법을 설명합니다.
- [React 공식 문서 - TypeScript](https://react.dev/learn/typescript)
  - React에서 TypeScript를 사용하는 방법과 Hook의 타입 지정 방법을 설명합니다.
- [TypeScript 공식 문서 - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - Generic을 이용한 재사용 가능한 함수와 타입 설계 방법을 설명합니다.
- [TypeScript 공식 문서 - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
  - TypeScript의 타입 추론 원리와 활용 방법을 설명합니다.
- [TypeScript 공식 문서 - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
  - Union Type과 타입 가드를 이용한 타입 좁히기 방법을 설명합니다.
- [TypeScript 공식 문서 - keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
  - 객체의 속성 이름을 타입으로 추출하는 방법을 설명합니다.
- [TypeScript 공식 문서 - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - `Partial`, `Record`, `ReturnType` 등 유틸리티 타입의 사용 방법을 설명합니다.
- [React Hooks ESLint Plugin](https://react.dev/reference/eslint-plugin-react-hooks)
  - Hook 호출 규칙과 Effect 의존성 등을 정적으로 검사하는 방법을 설명합니다.