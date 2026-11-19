# External State Management

## 1. 개요

External State Management(외부 상태 관리)는 React 컴포넌트 외부에 별도의 Store를 두고 여러 컴포넌트에서 공유할 수 있도록 상태를 관리하는 방식입니다.

React는 기본적으로 `useState`, `useReducer`, `useContext` 등의 기능을 통해 컴포넌트 내부 또는 컴포넌트 트리에서 상태를 관리합니다.

그러나 애플리케이션의 규모가 커지면 다음과 같은 요구사항이 발생할 수 있습니다.

- 서로 다른 컴포넌트에서 동일한 상태를 공유해야 하는 경우
- 여러 화면에서 공통으로 사용하는 상태가 필요한 경우
- 복잡한 상태 변경 로직을 중앙에서 관리해야 하는 경우
- 상태의 일부만 구독하여 불필요한 렌더링을 줄여야 하는 경우
- React 컴포넌트 외부에서도 상태에 접근해야 하는 경우
- 여러 상태 변경 작업과 비동기 로직을 체계적으로 관리해야 하는 경우

이러한 상황에서는 별도의 상태 관리 라이브러리를 도입할 수 있습니다.

대표적인 외부 상태 관리 라이브러리로는 Zustand, Redux Toolkit, Jotai, MobX 등이 있습니다.

외부 상태 관리는 React의 내장 상태 관리 기능을 대체하기 위한 필수 요소가 아닙니다. 애플리케이션의 상태 공유 범위와 복잡도에 따라 선택적으로 도입하는 아키텍처입니다.

## 2. React 내장 상태 관리와 External State Management

React는 컴포넌트 기반의 상태 관리 기능을 제공합니다.

| 구분 | React 내장 상태 관리 | External State Management |
| --- | --- | --- |
| 상태 저장 위치 | 컴포넌트 및 React 트리 | React 외부 Store |
| 주요 API | `useState`, `useReducer`, `useContext` | 라이브러리별 Store 및 Hook |
| 상태 공유 | Props, Context | Store 구독 |
| 상태 변경 | Setter, Dispatch | Action, Setter, Mutation 등 |
| 구독 범위 | Context 및 컴포넌트 상태에 종속 | 라이브러리별 구독 모델 |
| 주요 목적 | 컴포넌트와 UI 상태 관리 | 여러 영역에서 공유하는 상태 관리 |

### 2.1. React 내장 상태 관리

`useState`는 컴포넌트 단위의 상태를 관리합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((previous) => previous + 1)}>
      Count: {count}
    </button>
  );
}
```

여러 컴포넌트에서 상태를 공유해야 한다면 Props를 전달하거나 Context API를 사용할 수 있습니다.

```tsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext<string>('light');

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={theme}>
      {children}
    </ThemeContext>
  );
}

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Theme</button>;
}
```

이러한 방식은 별도의 라이브러리 없이도 공유 상태를 관리할 수 있다는 장점이 있습니다.

다만 상태 공유 범위가 넓어지고 상태 변경 규칙이 복잡해지면 Provider 구성, Context 분리, 상태 구독 등의 관리 비용이 증가할 수 있습니다.

### 2.2. External Store

External State Management는 상태를 React 컴포넌트 외부의 Store에서 관리합니다.

```tsx
// store.ts

interface State {
  count: number;
}

let state: State = {
  count: 0,
};

const listeners = new Set<() => void>();

export const store = {
  getState() {
    return state;
  },

  setState(nextState: State) {
    state = nextState;

    listeners.forEach((listener) => listener());
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
```

위 예제에서는 React 컴포넌트와 독립적으로 State를 관리합니다.

컴포넌트는 Store에 접근하여 데이터를 읽고, 변경 사항을 구독할 수 있습니다.

외부 Store를 React와 연결할 때는 React에서 제공하는 `useSyncExternalStore`를 사용할 수 있습니다.

## 3. useSyncExternalStore

`useSyncExternalStore`는 React 외부에 존재하는 Store를 구독하기 위한 Hook입니다.

외부 Store의 데이터가 변경되었을 때 React가 변경 사항을 감지하고 필요한 컴포넌트를 다시 렌더링할 수 있도록 연결합니다.

```tsx
const snapshot = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot?
);
```

주요 인수는 다음과 같습니다.

| 인수 | 설명 |
| --- | --- |
| `subscribe` | Store의 변경 사항을 구독하고 구독 해제 함수를 반환합니다. |
| `getSnapshot` | Store에서 현재 스냅샷을 반환합니다. |
| `getServerSnapshot` | 서버 렌더링 및 Hydration에 사용할 초기 스냅샷을 반환합니다. |

### 3.1. 기본 구현

```tsx
import { useSyncExternalStore } from 'react';

interface Todo {
  id: number;
  text: string;
}

let todos: Todo[] = [
  { id: 1, text: 'Learn React' },
];

const listeners = new Set<() => void>();

const todoStore = {
  getSnapshot() {
    return todos;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  addTodo(text: string) {
    todos = [
      ...todos,
      {
        id: Date.now(),
        text,
      },
    ];

    listeners.forEach((listener) => listener());
  },
};

function TodoList() {
  const currentTodos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot
  );

  return (
    <div>
      <button onClick={() => todoStore.addTodo('New Todo')}>
        Add Todo
      </button>

      <ul>
        {currentTodos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

이 예제에서는 다음과 같은 흐름으로 동작합니다.

1. 컴포넌트가 `useSyncExternalStore`를 호출합니다.
2. React가 `getSnapshot`을 통해 현재 Store의 데이터를 읽습니다.
3. `subscribe`를 통해 Store의 변경 사항을 구독합니다.
4. Store의 데이터가 변경되면 구독 중인 Listener가 실행됩니다.
5. React가 새로운 스냅샷을 확인합니다.
6. 이전 스냅샷과 달라진 경우 컴포넌트를 다시 렌더링합니다.

### 3.2. Snapshot과 불변성

`getSnapshot`은 Store의 현재 상태를 나타내는 스냅샷을 반환해야 합니다.

Store가 변경되지 않았다면 `getSnapshot`을 반복 호출하더라도 동일한 값을 반환해야 합니다.

다음은 잘못된 구현입니다.

```tsx
function getSnapshot() {
  return {
    todos,
  };
}
```

위 함수는 호출할 때마다 새로운 객체를 생성합니다.

Store의 실제 데이터가 변경되지 않았더라도 객체 참조가 달라지므로 React가 계속해서 변경된 값으로 판단할 수 있습니다.

다음과 같이 기존의 불변 데이터 참조를 반환하는 방식이 적절합니다.

```tsx
function getSnapshot() {
  return todos;
}
```

Store의 데이터가 변경되면 새로운 배열을 생성하고, 변경되지 않았다면 기존 배열을 반환하도록 구성해야 합니다.

### 3.3. Server Rendering과 Hydration

외부 Store를 사용하는 애플리케이션에서 Server Rendering을 지원하려면 초기 스냅샷을 고려해야 합니다.

`getServerSnapshot`은 서버 렌더링과 클라이언트 Hydration 과정에서 사용할 초기 데이터를 제공합니다.

```tsx
function getServerSnapshot() {
  return initialTodos;
}

function TodoList() {
  const todos = useSyncExternalStore(
    todoStore.subscribe,
    todoStore.getSnapshot,
    getServerSnapshot
  );

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

서버에서 생성한 초기 스냅샷과 클라이언트의 Hydration 시점에 사용하는 스냅샷은 동일한 데이터를 기반으로 해야 합니다.

초기 데이터가 서로 다르면 서버에서 생성한 HTML과 클라이언트 렌더링 결과 사이에 불일치가 발생할 수 있습니다.

또한 서버 환경에서는 요청별로 Store를 분리해야 합니다. 서버에서 모듈 전역 Store를 공유하면 서로 다른 요청의 사용자 데이터가 섞일 수 있으므로 주의해야 합니다.

### 3.4. useSyncExternalStore의 활용 범위

`useSyncExternalStore`는 모든 상태를 외부 Store로 관리하기 위한 Hook이 아닙니다.

주로 다음과 같은 상황에서 활용합니다.

- React 외부에 이미 존재하는 상태 저장소와 통합할 때
- 외부 라이브러리의 상태를 React 컴포넌트에서 구독할 때
- 브라우저 API처럼 React 외부에서 변경되는 값을 구독할 때
- 별도로 구현한 Store를 React와 연결할 때

React 공식 문서에서는 가능하면 `useState`와 `useReducer`를 우선 사용하고, `useSyncExternalStore`는 기존의 비 React 코드와 통합해야 하는 경우 등에 활용하도록 안내합니다.

## 4. External State Management의 주요 개념

외부 상태 관리 라이브러리는 구현 방식에 차이가 있지만 일반적으로 다음과 같은 개념을 사용합니다.

### 4.1. Store

Store는 애플리케이션에서 공유하는 상태를 보관하는 저장소입니다.

```tsx
interface AppState {
  user: User | null;
  theme: 'light' | 'dark';
  notifications: Notification[];
}
```

Store는 여러 컴포넌트에서 접근할 수 있는 상태를 관리합니다.

라이브러리에 따라 하나의 Store를 사용하거나 여러 개의 Store 또는 Atom으로 상태를 분리할 수 있습니다.

### 4.2. Subscription

Subscription은 컴포넌트가 Store의 변경 사항을 구독하는 메커니즘입니다.

Store의 값이 변경되면 해당 변경을 구독하는 컴포넌트에 알림을 전달합니다.

모든 외부 상태 관리 라이브러리가 동일한 구독 방식을 사용하는 것은 아니며, 라이브러리마다 구독 단위와 업데이트 전략이 다릅니다.

### 4.3. Selector

Selector는 Store에서 필요한 데이터만 선택하여 가져오는 함수입니다.

```tsx
const selectUserName = (state: AppState) => state.user?.name;
```

전체 Store를 사용하는 대신 필요한 데이터만 선택하면 상태 의존성을 명확하게 표현할 수 있습니다.

일부 라이브러리는 Selector를 기반으로 선택한 데이터가 변경될 때만 컴포넌트를 다시 렌더링하도록 최적화할 수 있습니다.

### 4.4. Action과 Mutation

Store의 상태를 변경하는 방법은 라이브러리마다 다릅니다.

- Action 기반: 변경 의도를 Action으로 전달합니다.
- Setter 기반: 상태 변경 함수를 직접 호출합니다.
- Atom 기반: 개별 Atom의 값을 변경합니다.
- Observable 기반: 관찰 가능한 데이터의 변경을 추적합니다.

상태 변경 방식이 다르더라도 핵심 목적은 공유 상태의 변경 규칙을 일관되게 관리하는 것입니다.

## 5. 주요 External State Management 라이브러리

React 생태계에서는 다양한 외부 상태 관리 라이브러리를 사용할 수 있습니다.

대표적인 라이브러리의 특징은 다음과 같습니다.

| 라이브러리 | 주요 방식 | 특징 |
| --- | --- | --- |
| Zustand | Store 기반 | 간결한 API와 Selector 기반 구독 |
| Redux Toolkit | Flux / Redux 기반 | 명시적인 Action과 Reducer, 미들웨어 |
| Jotai | Atom 기반 | 작은 상태 단위의 조합 |
| MobX | Observable 기반 | 반응형 데이터 추적 |

### 5.1. Zustand

<https://zustand.docs.pmnd.rs/>

Zustand는 간결한 API를 제공하는 React 상태 관리 라이브러리입니다.

Store를 생성하고 컴포넌트에서 Hook을 호출하여 필요한 상태를 구독하는 방식으로 사용합니다.

#### Store 생성

```tsx
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,

  increment: () =>
    set((state) => ({
      count: state.count + 1,
    })),

  decrement: () =>
    set((state) => ({
      count: state.count - 1,
    })),
}));
```

`create` 함수로 Store를 생성합니다.

Store에는 상태 데이터와 상태 변경 함수를 함께 정의할 수 있습니다.

#### 컴포넌트에서 사용

```tsx
function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}
```

Selector를 사용하여 필요한 상태만 구독할 수 있습니다.

`count`를 선택한 컴포넌트는 해당 선택 결과가 변경될 때 업데이트됩니다.

#### 주요 특징

- 비교적 적은 코드로 Store를 구성할 수 있습니다.
- React Context Provider 없이 Store를 생성하고 사용할 수 있습니다.
- Selector를 이용한 상태 구독을 지원합니다.
- 상태와 변경 함수를 하나의 Store에서 관리할 수 있습니다.
- Middleware를 통해 Persist, Devtools 등의 기능을 확장할 수 있습니다.

Zustand는 별도의 복잡한 설정 없이 공유 상태를 관리하고 싶은 경우 고려할 수 있습니다.

### 5.2. Redux Toolkit

<https://redux-toolkit.js.org/>

Redux Toolkit은 Redux 기반 애플리케이션의 상태 관리 로직을 단순화하고 표준화하기 위한 공식 도구입니다.

Redux는 단방향 데이터 흐름과 명시적인 상태 변경 규칙을 기반으로 동작합니다.

Redux Toolkit은 `configureStore`, `createSlice`, `createAsyncThunk` 등의 API를 제공합니다.

#### Slice 생성

```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  count: number;
}

const initialState: CounterState = {
  count: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.count += 1;
    },

    decrement(state) {
      state.count -= 1;
    },

    incrementByAmount(state, action: PayloadAction<number>) {
      state.count += action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
} = counterSlice.actions;

export default counterSlice.reducer;
```

`createSlice`는 Reducer와 Action Creator를 함께 생성합니다.

Reducer 내부에서 State를 직접 변경하는 것처럼 작성할 수 있지만, Redux Toolkit은 내부적으로 Immer를 사용하여 불변 업데이트를 처리합니다.

따라서 실제로 기존 State 객체를 직접 변경하는 것은 아닙니다.

#### Store 생성

```tsx
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

`configureStore`는 Redux Store를 생성하고 기본 미들웨어 및 개발 도구 설정을 제공합니다.

#### React 컴포넌트에서 사용

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { increment } from './counterSlice';
import type { RootState } from './store';

function Counter() {
  const count = useSelector(
    (state: RootState) => state.counter.count
  );

  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  );
}
```

React Redux의 `useSelector`는 Store의 특정 데이터를 구독하고, `useDispatch`는 Action을 Store에 전달합니다.

실제 프로젝트에서는 `RootState`와 `AppDispatch`를 기반으로 Typed Hook을 별도로 정의하여 사용하는 방식이 권장됩니다.

#### 주요 특징

- 명시적인 Action과 Reducer 구조를 사용합니다.
- 상태 변경 규칙을 중앙에서 관리할 수 있습니다.
- Redux DevTools를 활용한 상태 변경 추적을 지원합니다.
- Middleware를 통해 비동기 작업과 부가 로직을 처리할 수 있습니다.
- 규모가 크고 복잡한 애플리케이션에서 일관된 상태 관리 구조를 유지하는 데 유용합니다.

### 5.3. Jotai

<https://jotai.org/>

Jotai는 Atom 단위로 상태를 구성하는 상태 관리 라이브러리입니다.

전체 Store를 하나의 큰 객체로 관리하는 대신 작은 상태 단위인 Atom을 조합하여 상태를 구성합니다.

#### Atom 생성

```tsx
import { atom } from 'jotai';

export const countAtom = atom(0);
```

`atom` 함수로 독립적인 상태 단위를 생성합니다.

#### 컴포넌트에서 사용

```tsx
import { useAtom } from 'jotai';
import { countAtom } from './atoms';

function Counter() {
  const [count, setCount] = useAtom(countAtom);

  return (
    <button onClick={() => setCount((previous) => previous + 1)}>
      Count: {count}
    </button>
  );
}
```

`useAtom`은 Atom의 현재 값을 읽고 변경할 수 있는 인터페이스를 제공합니다.

#### 파생 Atom

Jotai는 기존 Atom을 기반으로 파생 Atom을 구성할 수 있습니다.

```tsx
import { atom } from 'jotai';

export const countAtom = atom(0);

export const doubledCountAtom = atom(
  (get) => get(countAtom) * 2
);
```

`doubledCountAtom`은 `countAtom`을 기반으로 계산되는 파생 상태입니다.

원본 Atom이 변경되면 파생 Atom도 새로운 값을 반영합니다.

#### 주요 특징

- 상태를 작은 Atom 단위로 분리합니다.
- Atom 간 의존 관계를 구성할 수 있습니다.
- 파생 상태를 선언적으로 정의할 수 있습니다.
- 필요한 Atom을 구독하는 컴포넌트 중심으로 업데이트할 수 있습니다.
- 복잡한 전역 객체보다 독립적인 상태 단위가 많은 애플리케이션에 적합할 수 있습니다.

### 5.4. MobX

<https://mobx.js.org/README.html>

MobX는 Observable 기반의 반응형 상태 관리 라이브러리입니다.

상태를 Observable로 정의하고, 해당 상태를 사용하는 컴포넌트나 함수가 변경 사항에 반응하도록 구성합니다.

#### Observable State 생성

```tsx
import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  get doubledCount() {
    return this.count * 2;
  }
}

export const counterStore = new CounterStore();
```

`makeAutoObservable`은 객체의 속성과 메서드를 Observable, Action, Computed 등의 역할로 자동 분류합니다.

#### React 컴포넌트에서 사용

```tsx
import { observer } from 'mobx-react-lite';
import { counterStore } from './CounterStore';

const Counter = observer(() => {
  return (
    <button onClick={() => counterStore.increment()}>
      Count: {counterStore.count}
    </button>
  );
});
```

`observer`로 감싼 컴포넌트는 렌더링 과정에서 읽은 Observable 데이터의 변경을 추적합니다.

사용 중인 Observable 값이 변경되면 해당 컴포넌트가 다시 렌더링됩니다.

#### 주요 특징

- Observable 기반의 반응형 상태 관리를 지원합니다.
- 상태 변경을 사용하는 컴포넌트의 의존성에 따라 추적합니다.
- Computed를 통해 파생 값을 관리할 수 있습니다.
- 객체지향적인 Store 구조를 구성할 수 있습니다.
- 상태와 변경 로직을 객체 중심으로 관리하는 데 적합할 수 있습니다.

## 6. External State Management 선택 기준

외부 상태 관리 라이브러리는 단순히 인기가 많거나 코드가 짧다는 이유만으로 선택하기보다는 애플리케이션의 상태 구조와 요구사항을 기준으로 판단해야 합니다.

### 6.1. 상태의 공유 범위

상태가 특정 컴포넌트에서만 사용된다면 `useState`로 충분할 수 있습니다.

여러 컴포넌트에서 공유하지만 범위가 제한적이라면 Context API와 `useReducer`를 활용할 수 있습니다.

애플리케이션 전반에서 다양한 상태를 공유하고 선택적으로 구독해야 한다면 외부 Store를 고려할 수 있습니다.

### 6.2. 상태 변경 로직의 복잡도

상태 변경 규칙이 단순하다면 별도의 라이브러리를 도입할 필요가 없습니다.

반면 다음과 같은 요구사항이 많다면 외부 상태 관리가 유용할 수 있습니다.

- 여러 상태 변경 작업의 조합
- 복잡한 상태 전이
- 공통 상태 변경 로직의 재사용
- 상태 변경 이력 추적
- 비동기 작업과 상태 변경의 체계적인 분리

### 6.3. 구독 및 렌더링 최적화

Context는 Context 값을 구독하는 컴포넌트에 변경 사항을 전달합니다.

하나의 Context에 많은 상태를 포함하면 특정 데이터의 변경이 다른 데이터까지 구독하는 컴포넌트에 영향을 줄 수 있습니다.

외부 상태 관리 라이브러리는 Selector, Atom, Observable 등의 방식을 통해 더 세밀한 구독 구조를 제공할 수 있습니다.

다만 라이브러리마다 구독 및 렌더링 최적화 방식이 다르므로 실제 사용 패턴을 고려해야 합니다.

### 6.4. 개발 및 유지보수 요구사항

다음과 같은 요구사항도 라이브러리 선택에 영향을 줍니다.

- 상태 변경 이력 및 디버깅 기능
- Middleware 지원
- Persistence 및 복원 기능
- 비동기 작업 처리
- SSR 및 Hydration 지원
- TypeScript 지원
- 팀의 기존 기술 스택과 학습 비용

### 6.5. 선택 가이드

| 요구사항 | 고려할 방식 |
| --- | --- |
| 단순한 컴포넌트 상태 | `useState` |
| 복잡한 컴포넌트 내부 상태 | `useReducer` |
| 제한된 컴포넌트 트리의 공유 상태 | Context API |
| 간결한 외부 Store | Zustand |
| 명시적인 Action과 Reducer 및 Middleware | Redux Toolkit |
| Atom 단위 상태 구성 | Jotai |
| Observable 기반 반응형 상태 | MobX |

특정 라이브러리가 모든 상황에서 더 우수한 것은 아닙니다. 상태의 규모와 구조, 팀의 개발 방식, 유지보수 요구사항을 함께 고려해야 합니다.

## 7. Client State와 Server State

External State Management를 설계할 때는 Client State와 Server State를 구분하는 것이 중요합니다.

두 상태는 데이터의 소유권과 변경 주기가 다릅니다.

### 7.1. Client State

Client State는 클라이언트 애플리케이션에서 관리하는 상태입니다.

대표적인 예시는 다음과 같습니다.

- 선택된 탭
- 모달 열림 여부
- 테마 설정
- 폼 입력값
- 장바구니의 임시 UI 상태
- 클라이언트에서만 사용하는 필터 조건

일반적으로 `useState`, `useReducer`, Context API 또는 외부 상태 관리 라이브러리로 관리할 수 있습니다.

### 7.2. Server State

Server State는 서버가 소유하고 클라이언트가 요청을 통해 가져오는 데이터입니다.

대표적인 예시는 다음과 같습니다.

- 사용자 프로필
- 상품 목록
- 주문 내역
- 게시글
- 서버에서 제공하는 통계 데이터

Server State는 단순히 데이터를 저장하는 것 외에도 다음과 같은 관리가 필요합니다.

- 데이터 캐싱
- 데이터 재검증
- 서버 데이터 동기화
- 요청 상태 관리
- 중복 요청 제어
- 캐시 무효화
- 페이지네이션 및 무한 스크롤

이러한 기능은 TanStack Query와 같은 Server State 관리 라이브러리를 활용할 수 있습니다.

### 7.3. TanStack Query

<https://tanstack.com/query/latest>

TanStack Query는 서버에서 가져온 데이터를 캐싱하고 동기화하는 데 특화된 라이브러리입니다.

```tsx
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

function UserList() {
  const {
    data: users,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load users.</p>;
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

`useQuery`는 서버 데이터를 가져오고 캐싱하며 요청 상태를 관리합니다.

이러한 서버 데이터 관리 기능을 일반적인 Client State Store에 직접 구현할 필요는 없습니다.

### 7.4. 상태 관리 도구의 역할 구분

Client State와 Server State는 서로 다른 문제를 해결하므로 도구를 구분하여 사용하는 것이 좋습니다.

| 구분 | 주요 관리 대상 | 대표적인 도구 |
| --- | --- | --- |
| Component State | 컴포넌트 내부 UI 상태 | `useState`, `useReducer` |
| Shared Client State | 여러 컴포넌트가 공유하는 상태 | Context, Zustand, Redux Toolkit, Jotai, MobX |
| Server State | 서버에서 가져온 데이터 | TanStack Query |

하나의 애플리케이션에서 여러 상태 관리 도구를 함께 사용하는 것도 가능합니다.

예를 들어 Zustand로 사용자 인터페이스 설정을 관리하고, TanStack Query로 서버에서 가져온 사용자 정보를 관리할 수 있습니다.

## 8. External State Management 도입 시 주의사항

### 8.1. 전역 상태 남용 방지

여러 컴포넌트에서 사용할 수 있다는 이유만으로 모든 상태를 외부 Store에 저장할 필요는 없습니다.

특정 컴포넌트에서만 사용하는 상태는 해당 컴포넌트 내부에서 관리하는 것이 적절합니다.

상태의 소유권과 사용 범위를 기준으로 저장 위치를 결정해야 합니다.

### 8.2. 중복 상태 저장 방지

동일한 데이터를 React State와 외부 Store에 중복 저장하면 데이터 동기화 문제가 발생할 수 있습니다.

예를 들어 사용자 정보를 Context와 Zustand Store에서 각각 관리한다면 어느 쪽이 원본 데이터인지 불명확해질 수 있습니다.

가능하면 하나의 데이터에 대한 명확한 소유자를 유지해야 합니다.

### 8.3. Selector 활용

외부 Store를 구독할 때는 필요한 상태만 선택하는 것이 좋습니다.

```tsx
const count = useCounterStore((state) => state.count);
```

전체 Store를 구독하는 대신 필요한 값만 선택하면 컴포넌트의 의존성을 줄이고 불필요한 렌더링을 방지하는 데 도움이 됩니다.

단, Selector의 비교 방식과 객체 반환 시의 동작은 라이브러리마다 다르므로 해당 라이브러리의 구독 규칙을 확인해야 합니다.

### 8.4. 상태 변경 로직의 책임 분리

Store에 모든 비즈니스 로직을 무조건 포함하면 Store가 지나치게 복잡해질 수 있습니다.

상태 변경 로직, 비즈니스 규칙, API 통신, UI 이벤트 처리를 적절하게 분리해야 합니다.

특히 API 요청과 같은 비동기 작업은 라이브러리의 Middleware, Action 또는 별도의 서비스 계층을 활용하여 관리할 수 있습니다.

### 8.5. SSR과 요청별 Store 생성

서버 렌더링을 지원하는 애플리케이션에서는 Store의 생명주기를 고려해야 합니다.

서버에서 사용자별 상태를 모듈 전역 Singleton Store에 저장하면 여러 요청이 동일한 상태를 공유할 위험이 있습니다.

따라서 서버 환경에서는 요청별로 Store를 생성하고 초기 데이터를 적절하게 전달해야 합니다.

### 8.6. 라이브러리 도입 비용 고려

외부 상태 관리 라이브러리를 도입하면 새로운 API와 개념을 학습해야 하며, 프로젝트의 의존성과 유지보수 범위도 증가합니다.

React 내장 상태 관리 기능으로 충분한 상황이라면 별도의 라이브러리를 도입하지 않는 것이 더 단순할 수 있습니다.

## 9. 정리

External State Management는 React 컴포넌트 외부의 Store를 통해 여러 컴포넌트에서 공유하는 상태를 관리하는 방식입니다.

애플리케이션의 규모가 커지고 상태 공유 범위와 변경 로직이 복잡해지는 경우 유용하게 활용할 수 있습니다.

핵심 개념은 다음과 같습니다.

- External State Management는 React 외부 Store에서 공유 상태를 관리하는 방식입니다.
- `useSyncExternalStore`는 외부 Store의 데이터를 React 컴포넌트에서 구독하기 위한 Hook입니다.
- Store는 상태를 보관하고 Subscription은 변경 사항을 전달합니다.
- Selector를 사용하면 필요한 상태만 선택하여 구독할 수 있습니다.
- Zustand는 간결한 Store 기반 상태 관리에 적합합니다.
- Redux Toolkit은 명시적인 Action과 Reducer를 기반으로 복잡한 상태 변경을 관리하는 데 유용합니다.
- Jotai는 Atom 단위로 상태를 구성하고 조합합니다.
- MobX는 Observable 기반의 반응형 상태 관리를 제공합니다.
- Client State와 Server State는 데이터의 소유권과 관리 목적에 따라 구분해야 합니다.
- 서버 데이터의 캐싱과 동기화에는 TanStack Query와 같은 도구를 고려할 수 있습니다.
- 전역 상태를 남용하거나 동일한 데이터를 여러 저장소에 중복 관리하지 않도록 주의해야 합니다.
- SSR 환경에서는 요청별 Store 생성과 초기 스냅샷의 일관성을 고려해야 합니다.

External State Management의 핵심은 상태를 무조건 전역화하는 것이 아니라, 공유가 필요한 상태를 적절한 저장소에서 관리하고 필요한 컴포넌트가 효율적으로 구독하도록 구성하는 것입니다.

React 내장 상태 관리 기능을 우선적으로 활용하고, 실제 애플리케이션의 복잡도와 요구사항이 증가할 때 외부 상태 관리 라이브러리를 도입하는 것이 적절합니다.

## 참고자료

### React 공식 문서

- [useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [Managing State](https://react.dev/learn/managing-state)
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)

### 상태 관리 라이브러리

- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Documentation](https://redux.js.org/)
- [React Redux Documentation](https://react-redux.js.org/)
- [Jotai Documentation](https://jotai.org/)
- [MobX Documentation](https://mobx.js.org/README.html)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

### 관련 개념

- [State Structure](./state-structure.md)
- [Sharing State](./sharing-state.md)
- [Context API](./context-api.md)
- [Reducer Pattern](./reducer-pattern.md)
- [Derived State](./derived-state.md)