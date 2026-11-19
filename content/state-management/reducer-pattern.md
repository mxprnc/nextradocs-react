# Reducer Pattern

## 1. 개요

Reducer Pattern은 State 변경 로직을 하나의 Reducer 함수로 분리하고, Action을 전달하여 다음 State를 계산하는 상태 관리 패턴입니다.

React에서는 `useReducer` Hook을 통해 Reducer Pattern을 구현할 수 있습니다.

일반적으로 `useState`를 사용하면 이벤트 핸들러 내부에서 State 변경 로직을 직접 작성합니다. 상태가 단순할 때는 이러한 방식이 간결하지만, 여러 State가 서로 연관되어 있거나 다양한 이벤트에 따라 복잡하게 변경되는 경우에는 상태 변경 로직이 여러 곳에 분산될 수 있습니다.

Reducer Pattern을 사용하면 다음과 같이 역할을 분리할 수 있습니다.

- **State**: 현재 상태 데이터를 보관합니다.
- **Action**: 발생한 이벤트 또는 상태 변경 의도를 표현합니다.
- **Reducer**: 현재 State와 Action을 기반으로 다음 State를 계산합니다.
- **Dispatch**: Reducer에 Action을 전달하여 State 변경을 요청합니다.

이러한 구조를 사용하면 상태 변경 규칙을 한곳에서 관리할 수 있으며, 컴포넌트의 이벤트 처리 로직을 단순화할 수 있습니다.

## 2. Reducer의 동작 원리

Reducer는 현재 State와 Action을 입력받아 새로운 State를 반환하는 함수입니다.

```tsx
type State = {
  count: number;
};

type Action = {
  type: 'increment' | 'decrement';
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
}
```

Reducer의 기본 형태는 다음과 같습니다.

```tsx
function reducer(state, action) {
  // 현재 State와 Action을 기반으로
  // 다음 State를 계산합니다.

  return nextState;
}
```

Reducer는 다음과 같은 흐름으로 동작합니다.

1. 사용자가 버튼을 클릭하거나 입력값을 변경합니다.
2. 이벤트 핸들러에서 `dispatch`를 호출합니다.
3. Action이 Reducer에 전달됩니다.
4. Reducer가 현재 State와 Action을 기반으로 다음 State를 계산합니다.
5. React가 반환된 State를 적용합니다.
6. 컴포넌트가 새로운 State를 기준으로 렌더링됩니다.

Reducer는 상태 변경 방법을 정의하고, Dispatch는 어떤 상태 변경이 발생했는지를 전달합니다.

## 3. useReducer

`useReducer`는 React에서 Reducer 기반으로 State를 관리할 수 있도록 제공하는 Hook입니다.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

`useReducer`는 다음 두 가지 값을 반환합니다.

| 반환값 | 설명 |
| --- | --- |
| `state` | 현재 State입니다. |
| `dispatch` | Reducer에 Action을 전달하는 함수입니다. |

두 번째 인수인 `initialState`는 초기 State를 의미합니다.

### 3.1. 기본 사용법

다음 예제는 `useReducer`를 이용하여 Counter를 구현한 코드입니다.

```tsx
import { useReducer } from 'react';

type State = {
  count: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

const initialState: State = {
  count: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };

    case 'reset':
      return initialState;

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>

      <button onClick={() => dispatch({ type: 'increment' })}>
        Increment
      </button>

      <button onClick={() => dispatch({ type: 'decrement' })}>
        Decrement
      </button>

      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
```

이 예제에서는 세 가지 Action을 정의했습니다.

- `increment`: Count를 1 증가시킵니다.
- `decrement`: Count를 1 감소시킵니다.
- `reset`: Count를 초기값으로 복원합니다.

각 이벤트 핸들러는 구체적인 상태 변경 로직을 직접 구현하지 않고, 발생한 Action만 전달합니다.

실제 상태 변경 규칙은 Reducer에서 관리합니다.

### 3.2. dispatch

`dispatch`는 Reducer에 Action을 전달하는 함수입니다.

```tsx
dispatch({ type: 'increment' });
```

Action은 일반적으로 `type` 속성을 포함하는 객체로 구성하며, 상태 변경에 필요한 추가 데이터도 함께 전달할 수 있습니다.

```tsx
type Action =
  | { type: 'set_name'; name: string }
  | { type: 'set_age'; age: number };
```

다음과 같이 Action을 전달할 수 있습니다.

```tsx
dispatch({
  type: 'set_name',
  name: 'John',
});

dispatch({
  type: 'set_age',
  age: 30,
});
```

Reducer는 전달받은 Action의 `type`을 기준으로 적절한 상태 변경 로직을 실행합니다.

`dispatch`는 반환값이 없으며, 호출 직후 현재 렌더링에서 사용 중인 State가 즉시 변경되는 것도 아닙니다. 새로운 State는 다음 렌더링에 반영됩니다.

```tsx
function handleIncrement() {
  dispatch({ type: 'increment' });

  // 여기서 state.count를 읽으면
  // 현재 렌더링의 이전 값을 참조합니다.
}
```

따라서 `dispatch` 호출 직후 State가 변경되었다고 가정해서는 안 됩니다.

## 4. Action 설계

Action은 사용자가 수행한 작업이나 애플리케이션에서 발생한 이벤트를 표현합니다.

Reducer Pattern에서는 상태 변경 결과보다 상태 변경의 원인과 의도를 Action으로 표현하는 것이 중요합니다.

### 4.1. Action Type

Action의 `type`은 어떤 상태 변경이 발생했는지 식별하는 역할을 합니다.

```tsx
type Action =
  | { type: 'added' }
  | { type: 'removed'; id: number }
  | { type: 'completed'; id: number };
```

일반적으로 Action Type은 다음과 같은 특징을 가집니다.

- 상태 변경의 의도를 명확하게 표현합니다.
- 서로 다른 작업을 구분할 수 있도록 고유한 이름을 사용합니다.
- Reducer에서 처리할 수 있는 Action을 명시적으로 정의합니다.

`added`, `removed`, `completed`처럼 발생한 작업을 표현하는 이름을 사용할 수 있습니다.

### 4.2. Action Payload

Action은 상태 변경에 필요한 추가 데이터를 포함할 수 있습니다.

```tsx
type Action =
  | {
      type: 'add_todo';
      text: string;
    }
  | {
      type: 'remove_todo';
      id: number;
    }
  | {
      type: 'toggle_todo';
      id: number;
    };
```

이때 `text`, `id`와 같은 추가 데이터는 일반적으로 Payload라고 부릅니다.

Payload는 Reducer가 다음 State를 계산하는 데 필요한 정보를 전달합니다.

### 4.3. Discriminated Union을 이용한 Action 타입 정의

TypeScript에서는 Discriminated Union을 활용하여 Action의 종류와 Payload를 명확하게 정의할 수 있습니다.

```tsx
type Action =
  | { type: 'increment'; amount: number }
  | { type: 'decrement'; amount: number }
  | { type: 'reset' };
```

Reducer에서 `action.type`을 확인하면 TypeScript가 각 Action의 구체적인 타입을 추론합니다.

```tsx
type State = {
  count: number;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + action.amount,
      };

    case 'decrement':
      return {
        count: state.count - action.amount,
      };

    case 'reset':
      return {
        count: 0,
      };

    default:
      return state;
  }
}
```

각 Action에 필요한 Payload를 타입 수준에서 제한할 수 있으므로 잘못된 데이터 전달을 컴파일 단계에서 방지하는 데 도움이 됩니다.

## 5. Reducer의 순수성

Reducer는 반드시 순수 함수(Pure Function)로 작성해야 합니다.

순수 함수는 동일한 입력에 대해 항상 동일한 결과를 반환하며, 함수 외부의 상태를 변경하지 않는 함수입니다.

Reducer는 다음과 같은 조건을 만족해야 합니다.

- 전달받은 State를 직접 변경하지 않습니다.
- 전달받은 Action을 직접 변경하지 않습니다.
- 네트워크 요청이나 타이머와 같은 Side Effect를 수행하지 않습니다.
- 전역 변수나 외부 상태를 변경하지 않습니다.
- 동일한 State와 Action에 대해 동일한 다음 State를 반환합니다.

### 5.1. State 직접 변경 금지

다음은 기존 State를 직접 변경하는 잘못된 Reducer입니다.

```tsx
type State = {
  count: number;
};

type Action = {
  type: 'increment';
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      state.count += 1;

      return state;

    default:
      return state;
  }
}
```

기존 State 객체의 속성을 직접 변경하고 동일한 객체를 반환하고 있습니다.

React는 State의 이전 값과 다음 값을 `Object.is`로 비교하여 변경 여부를 판단할 수 있습니다. 동일한 객체 참조를 반환하면 변경이 감지되지 않아 렌더링이 생략될 수 있습니다.

다음과 같이 새로운 객체를 반환해야 합니다.

```tsx
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

### 5.2. 배열 State 변경

배열도 기존 데이터를 직접 변경하지 않고 새로운 배열을 반환해야 합니다.

```tsx
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface State {
  todos: Todo[];
}

type Action = {
  type: 'add';
  todo: Todo;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        todos: [...state.todos, action.todo],
      };

    default:
      return state;
  }
}
```

`push()`, `splice()` 등 기존 배열을 직접 변경하는 메서드를 Reducer에서 사용하는 것은 피해야 합니다.

대신 다음과 같은 불변 업데이트 방식을 활용합니다.

| 작업 | 불변 업데이트 방식 |
| --- | --- |
| 항목 추가 | `[...items, newItem]` |
| 항목 제거 | `items.filter()` |
| 항목 수정 | `items.map()` |
| 항목 정렬 | `[...items].sort()` |

### 5.3. Side Effect 분리

Reducer 내부에서는 네트워크 요청이나 타이머 실행 등의 Side Effect를 수행하지 않아야 합니다.

다음은 잘못된 예제입니다.

```tsx
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'fetch':
      fetch('/api/users');

      return state;

    default:
      return state;
  }
}
```

네트워크 요청은 React 외부 시스템과의 상호작용이므로 Reducer 내부에서 실행하지 않습니다.

이벤트 핸들러나 Effect 등 적절한 위치에서 Side Effect를 수행하고, 그 결과를 Action으로 전달하는 구조가 적절합니다.

```tsx
function UserList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function handleFetch() {
    dispatch({ type: 'fetch_started' });

    try {
      const response = await fetch('/api/users');
      const users = await response.json();

      dispatch({
        type: 'fetch_succeeded',
        users,
      });
    } catch {
      dispatch({
        type: 'fetch_failed',
        message: '사용자 정보를 불러오지 못했습니다.',
      });
    }
  }

  // ...
}
```

Reducer는 전달받은 Action에 따라 로딩 상태, 성공 결과, 오류 상태 등을 순수하게 계산합니다.

## 6. Reducer와 useState 비교

`useState`와 `useReducer`는 모두 React 컴포넌트의 State를 관리하는 Hook입니다.

두 Hook은 서로 대체 가능한 상태 관리 방식이며, 애플리케이션의 모든 State를 반드시 하나의 방식으로 관리할 필요는 없습니다.

| 구분 | useState | useReducer |
| --- | --- | --- |
| 상태 변경 | Setter 함수 호출 | Dispatch로 Action 전달 |
| 변경 로직 | 이벤트 핸들러 등에 위치 | Reducer 함수에 집중 |
| 적합한 상태 | 단순하고 독립적인 상태 | 여러 변경 규칙이 연관된 상태 |
| 코드 구조 | 비교적 간결함 | 초기 구현 코드가 더 많음 |
| 테스트 | 컴포넌트 중심 | Reducer를 독립적으로 테스트 가능 |
| 확장성 | 복잡해지면 로직이 분산될 수 있음 | 변경 규칙을 한곳에서 관리하기 쉬움 |

### 6.1. useState가 적합한 경우

다음과 같이 단순한 상태 변경에는 `useState`가 적합합니다.

```tsx
import { useState } from 'react';

function Toggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button onClick={() => setIsOpen((previous) => !previous)}>
      {isOpen ? 'Close' : 'Open'}
    </button>
  );
}
```

상태가 하나이고 변경 규칙도 단순하기 때문에 별도의 Reducer를 정의할 필요가 없습니다.

### 6.2. useReducer가 적합한 경우

여러 상태가 서로 연관되어 있거나 상태 변경 규칙이 복잡한 경우에는 `useReducer`가 적합할 수 있습니다.

예를 들어 폼 데이터를 관리하면서 다음과 같은 작업이 필요하다고 가정할 수 있습니다.

- 입력값 변경
- 특정 필드 초기화
- 전체 폼 초기화
- 제출 시작
- 제출 성공
- 제출 실패

이러한 변경 로직을 이벤트 핸들러마다 구현하면 코드가 복잡해질 수 있습니다.

Reducer를 사용하면 각 이벤트 핸들러는 Action을 전달하고, 상태 변경 규칙은 Reducer에서 일관되게 관리할 수 있습니다.

## 7. Reducer Pattern 실전 예제

다음은 Todo 목록을 Reducer Pattern으로 관리하는 예제입니다.

### 7.1. State와 Action 정의

```tsx
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
}

type TodoAction =
  | {
      type: 'add';
      todo: Todo;
    }
  | {
      type: 'remove';
      id: number;
    }
  | {
      type: 'toggle';
      id: number;
    }
  | {
      type: 'reset';
    };

const initialState: TodoState = {
  todos: [],
};
```

State는 Todo 목록을 관리하며, Action은 추가, 제거, 완료 상태 변경, 초기화 작업으로 구성합니다.

### 7.2. Reducer 구현

```tsx
function todoReducer(
  state: TodoState,
  action: TodoAction
): TodoState {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        todos: [...state.todos, action.todo],
      };

    case 'remove':
      return {
        ...state,
        todos: state.todos.filter(
          (todo) => todo.id !== action.id
        ),
      };

    case 'toggle':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case 'reset':
      return initialState;

    default:
      return state;
  }
}
```

Reducer는 Action의 종류에 따라 다음 State를 반환합니다.

각 작업은 기존 State를 직접 변경하지 않고 새로운 객체와 배열을 생성합니다.

### 7.3. 컴포넌트에서 사용

```tsx
import { useReducer, useState } from 'react';

function TodoApp() {
  const [state, dispatch] = useReducer(
    todoReducer,
    initialState
  );

  const [text, setText] = useState('');

  function handleAdd() {
    if (!text.trim()) {
      return;
    }

    dispatch({
      type: 'add',
      todo: {
        id: Date.now(),
        text,
        completed: false,
      },
    });

    setText('');
  }

  return (
    <div>
      <input
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <button onClick={handleAdd}>
        Add
      </button>

      <ul>
        {state.todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  dispatch({
                    type: 'toggle',
                    id: todo.id,
                  })
                }
              />

              {todo.text}
            </label>

            <button
              onClick={() =>
                dispatch({
                  type: 'remove',
                  id: todo.id,
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
```

이 예제에서는 Todo 목록을 `useReducer`로 관리하고, 입력 필드의 값은 `useState`로 관리합니다.

각 State의 복잡도와 변경 특성에 따라 서로 다른 Hook을 함께 사용할 수 있습니다.

## 8. 초기 State와 초기화 함수

`useReducer`는 두 번째 인수로 초기 State를 전달합니다.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

초기 State를 계산하는 데 비용이 많이 들거나 초기화 로직을 분리해야 하는 경우 세 번째 인수인 `init` 함수를 사용할 수 있습니다.

### 8.1. 초기화 함수 사용

```tsx
interface State {
  count: number;
}

function init(initialCount: number): State {
  return {
    count: initialCount,
  };
}

function reducer(state: State, action: Action): State {
  // ...
}

function Counter({ initialCount }: { initialCount: number }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialCount,
    init
  );

  return <p>{state.count}</p>;
}
```

세 번째 인수로 전달한 `init` 함수는 초기 State를 계산하는 역할을 합니다.

이 방식은 초기 데이터의 가공이나 복잡한 초기화 작업을 컴포넌트의 렌더링 로직과 분리할 때 유용합니다.

### 8.2. 초기화 함수의 실행 시점

`useReducer`는 컴포넌트의 최초 렌더링에서 초기 State를 설정합니다.

이후 컴포넌트가 다시 렌더링되더라도 새로운 초기 State를 자동으로 적용하지 않습니다.

초기화 함수는 컴포넌트의 최초 State를 계산하는 용도로 사용해야 합니다.

## 9. Reducer와 Context API 결합

`useReducer`는 특정 컴포넌트 내부에서 State를 관리합니다.

여러 컴포넌트가 동일한 Reducer State를 공유해야 한다면 Context API와 결합할 수 있습니다.

Context는 State와 Dispatch를 하위 컴포넌트에 전달하고, Reducer는 상태 변경 규칙을 관리하는 역할을 담당합니다.

### 9.1. State와 Dispatch Context 분리

```tsx
import {
  createContext,
  useContext,
  useReducer,
} from 'react';

interface CounterState {
  count: number;
}

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' };

const CounterStateContext =
  createContext<CounterState | null>(null);

const CounterDispatchContext =
  createContext<React.Dispatch<CounterAction> | null>(null);

function counterReducer(
  state: CounterState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
      };

    case 'decrement':
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}
```

State와 Dispatch를 서로 다른 Context로 분리하면 각 컴포넌트가 필요한 데이터에만 의존하도록 구성할 수 있습니다.

### 9.2. Provider 구현

```tsx
function CounterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
  });

  return (
    <CounterStateContext value={state}>
      <CounterDispatchContext value={dispatch}>
        {children}
      </CounterDispatchContext>
    </CounterStateContext>
  );
}
```

Provider는 Reducer State와 Dispatch 함수를 각각의 Context를 통해 제공합니다.

### 9.3. Custom Hook 구현

```tsx
function useCounterState() {
  const context = useContext(CounterStateContext);

  if (context === null) {
    throw new Error(
      'useCounterState must be used within CounterProvider'
    );
  }

  return context;
}

function useCounterDispatch() {
  const context = useContext(CounterDispatchContext);

  if (context === null) {
    throw new Error(
      'useCounterDispatch must be used within CounterProvider'
    );
  }

  return context;
}
```

Custom Hook을 사용하면 Context 접근 로직과 Provider 누락 검사를 공통으로 처리할 수 있습니다.

### 9.4. 하위 컴포넌트에서 사용

```tsx
function CounterDisplay() {
  const state = useCounterState();

  return <p>Count: {state.count}</p>;
}

function CounterControls() {
  const dispatch = useCounterDispatch();

  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'increment' })}
      >
        Increment
      </button>

      <button
        onClick={() => dispatch({ type: 'decrement' })}
      >
        Decrement
      </button>
    </div>
  );
}

function App() {
  return (
    <CounterProvider>
      <CounterDisplay />
      <CounterControls />
    </CounterProvider>
  );
}
```

이 구조에서는 `CounterDisplay`가 State를 구독하고, `CounterControls`는 Dispatch 함수만 사용합니다.

`useReducer`와 Context API를 결합하면 여러 컴포넌트에서 공유하는 상태 변경 규칙을 일관되게 관리할 수 있습니다.

단, State와 Dispatch Context를 분리하더라도 State Context의 값이 변경되면 해당 Context를 구독하는 컴포넌트는 새로운 값을 반영합니다. 또한 컴포넌트의 부모 렌더링 등 다른 요인에 의한 렌더링까지 차단하는 것은 아닙니다.

## 10. Reducer 테스트

Reducer는 컴포넌트와 독립적으로 실행할 수 있는 순수 함수이므로 단위 테스트에 적합합니다.

특정 State와 Action을 전달했을 때 예상한 State가 반환되는지 검증할 수 있습니다.

다음은 Vitest를 이용한 테스트 예제입니다.

```tsx
import { describe, expect, it } from 'vitest';

describe('counterReducer', () => {
  it('increments the count', () => {
    const state = { count: 0 };

    const nextState = counterReducer(state, {
      type: 'increment',
    });

    expect(nextState).toEqual({
      count: 1,
    });
  });

  it('decrements the count', () => {
    const state = { count: 1 };

    const nextState = counterReducer(state, {
      type: 'decrement',
    });

    expect(nextState).toEqual({
      count: 0,
    });
  });
});
```

Reducer 테스트에서는 다음 항목을 확인할 수 있습니다.

- Action에 따른 다음 State가 올바르게 계산되는지
- 기존 State가 변경되지 않는지
- 여러 State 속성이 변경되는 경우 나머지 데이터가 유지되는지
- 각 Action의 경계 조건이 올바르게 처리되는지

상태 변경 로직을 컴포넌트 외부로 분리하면 UI 렌더링과 관계없이 상태 전이 규칙을 검증할 수 있습니다.

## 11. Reducer Pattern 사용 시 주의사항

### 11.1. 불필요한 Reducer 도입 방지

상태가 단순하고 변경 로직이 적다면 `useState`가 더 간결합니다.

Reducer는 상태 변경 규칙이 복잡하거나 여러 이벤트 핸들러에서 동일한 상태를 변경하는 경우에 도입하는 것이 적절합니다.

### 11.2. Action을 지나치게 세분화하지 않기

Action은 개별적인 사용자 상호작용이나 의미 있는 상태 변경을 표현하는 것이 좋습니다.

예를 들어 여러 필드가 있는 폼을 초기화할 때 각 필드를 개별 Action으로 초기화하기보다는 하나의 `reset_form` Action으로 처리하는 것이 명확합니다.

### 11.3. Reducer 내부에서 외부 상태에 의존하지 않기

Reducer는 동일한 입력에 대해 동일한 결과를 반환해야 합니다.

전역 변수, 현재 시간, 난수 생성 결과 등에 직접 의존하면 동일한 State와 Action으로도 다른 결과가 나올 수 있습니다.

필요한 데이터는 Action의 Payload로 전달하는 방식이 적절합니다.

### 11.4. Strict Mode 고려

React Strict Mode가 활성화된 개발 환경에서는 Reducer와 초기화 함수가 순수성을 검증하기 위해 두 번 호출될 수 있습니다.

이는 개발 환경에서만 발생하는 동작이며, 두 호출 중 하나의 결과는 무시됩니다.

Reducer에 Side Effect가 있거나 기존 State를 직접 변경한다면 이러한 동작에서 문제가 드러날 수 있습니다.

따라서 Reducer와 초기화 함수는 반드시 순수하게 작성해야 합니다.

### 11.5. 알 수 없는 Action 처리

Reducer에서 처리하지 않는 Action이 전달되었을 때 조용히 초기 State나 `undefined`를 반환하지 않도록 주의해야 합니다.

TypeScript의 Discriminated Union을 활용하면 잘못된 Action 전달을 줄일 수 있습니다.

또한 Reducer의 기본 분기에서 예외를 발생시키면 정의되지 않은 Action을 빠르게 발견할 수 있습니다.

```tsx
function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(value)}`);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return assertNever(action);
  }
}
```

이 방식은 Action Union에 새로운 종류를 추가했을 때 Reducer에서 해당 분기를 처리하지 않으면 TypeScript 오류를 발생시킵니다.

## 12. 정리

Reducer Pattern은 State 변경 로직을 Reducer 함수로 분리하고 Action을 통해 상태 변경을 요청하는 패턴입니다.

React에서는 `useReducer`를 통해 이를 구현할 수 있으며, 복잡한 상태 변경 규칙을 명확하게 관리하는 데 유용합니다.

핵심 개념은 다음과 같습니다.

- Reducer는 현재 State와 Action을 입력받아 다음 State를 반환합니다.
- `useReducer`는 현재 State와 Dispatch 함수를 제공합니다.
- Dispatch는 Reducer에 Action을 전달합니다.
- Action은 발생한 이벤트나 상태 변경 의도를 표현합니다.
- TypeScript의 Discriminated Union을 활용하면 Action의 구조를 명확하게 정의할 수 있습니다.
- Reducer는 반드시 순수 함수로 작성해야 하며 기존 State를 직접 변경해서는 안 됩니다.
- 네트워크 요청과 같은 Side Effect는 Reducer 외부에서 처리합니다.
- 단순한 상태에는 `useState`, 복잡하고 연관된 상태 변경 로직에는 `useReducer`를 고려합니다.
- Context API와 결합하면 여러 컴포넌트에서 동일한 Reducer State를 공유할 수 있습니다.
- Reducer는 순수 함수이므로 컴포넌트와 분리하여 독립적으로 테스트할 수 있습니다.

Reducer Pattern의 핵심은 상태 변경의 원인(Action)과 상태 변경 규칙(Reducer)을 분리하는 것입니다. 이를 통해 컴포넌트의 이벤트 처리 로직을 단순화하고 상태 전이 과정을 예측 가능하게 유지할 수 있습니다.

## 참고자료

### React 공식 문서

- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [useReducer](https://react.dev/reference/react/useReducer)
- [Managing State](https://react.dev/learn/managing-state)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

### 관련 라이브러리

- [Immer](https://immerjs.github.io/immer/)
- [Vitest](https://vitest.dev/)

### 관련 개념

- [State Structure](./state-structure.md)
- [Sharing State](./sharing-state.md)
- [Context API](./context-api.md)
- [Derived State](./derived-state.md)