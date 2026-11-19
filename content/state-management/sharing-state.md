# Sharing State

## 1. 개요

Sharing State는 여러 컴포넌트가 동일한 데이터를 공유하고, 해당 데이터의 변경 사항을 일관되게 반영하도록 관리하는 개념입니다.

React에서 State는 기본적으로 이를 선언한 컴포넌트에 귀속됩니다. 각 컴포넌트는 독립적인 State를 가지며, 다른 컴포넌트의 State에 직접 접근하거나 변경할 수 없습니다.

그러나 실제 애플리케이션에서는 여러 컴포넌트가 동일한 데이터를 필요로 하는 경우가 많습니다.

예를 들어 다음과 같은 상황을 고려할 수 있습니다.

- 상품 목록과 상품 상세 정보가 동일한 선택 상품 데이터를 사용합니다.
- 여러 입력 필드가 동일한 검색어를 공유합니다.
- 장바구니와 헤더 컴포넌트가 동일한 장바구니 상품 개수를 표시합니다.
- 여러 화면에서 로그인한 사용자 정보를 참조합니다.
- 여러 컴포넌트가 동일한 필터 조건을 기반으로 데이터를 표시합니다.

이러한 상황에서 각 컴포넌트가 동일한 데이터를 별도의 State로 관리하면 데이터 불일치와 동기화 문제가 발생할 수 있습니다.

React에서는 컴포넌트 간 상태 공유를 위해 다음과 같은 방법을 활용할 수 있습니다.

1. **Lifting State Up:** 공유 State를 가장 가까운 공통 부모 컴포넌트로 이동합니다.
2. **Props:** 부모 컴포넌트에서 자식 컴포넌트로 State와 이벤트 핸들러를 전달합니다.
3. **Context API:** 컴포넌트 트리의 깊은 하위 컴포넌트에 데이터를 제공합니다.
4. **Reducer + Context:** 복잡한 상태 변경 로직과 여러 컴포넌트 간 상태 공유를 결합합니다.
5. **External State Management:** 컴포넌트 트리 외부의 공유 저장소를 통해 애플리케이션 전반의 상태를 관리합니다.

핵심은 모든 컴포넌트가 동일한 State를 직접 소유하는 것이 아니라, **각 상태에 명확한 소유자를 지정하고 필요한 컴포넌트가 해당 상태를 공유하도록 구성하는 것**입니다.

## 2. State Sharing의 기본 원칙

### 2.1. Single Source of Truth

Single Source of Truth는 하나의 데이터에 대해 신뢰할 수 있는 단일 원천을 유지하는 설계 원칙입니다.

React에서는 특정 State를 하나의 컴포넌트가 소유하고, 해당 데이터를 필요로 하는 다른 컴포넌트에 전달하는 방식으로 구현할 수 있습니다.

예를 들어 상품 목록과 상품 상세 정보가 동일한 선택 상품 데이터를 사용한다고 가정하겠습니다.

다음 구조에서는 두 컴포넌트가 각각 선택 상품을 관리합니다.

```tsx
import { useState } from 'react';

type Product = {
  id: number;
  name: string;
};

function ProductList() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // 상품 목록 렌더링
  return null;
}

function ProductDetail() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  // 상품 상세 정보 렌더링
  return null;
}
```

두 컴포넌트의 `selectedProduct`는 서로 독립적인 State입니다.

따라서 `ProductList`에서 상품을 선택하더라도 `ProductDetail`의 선택 상품은 자동으로 변경되지 않습니다.

이러한 문제를 해결하려면 공유 State를 공통 부모 컴포넌트에서 관리해야 합니다.

```tsx
import { useState } from 'react';

type Product = {
  id: number;
  name: string;
};

function ProductApp() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  return (
    <>
      <ProductList
        selectedProduct={selectedProduct}
        onSelect={setSelectedProduct}
      />

      <ProductDetail
        product={selectedProduct}
      />
    </>
  );
}

function ProductList({
  selectedProduct,
  onSelect,
}: {
  selectedProduct: Product | null;
  onSelect: (product: Product) => void;
}) {
  const products: Product[] = [
    { id: 1, name: 'Keyboard' },
    { id: 2, name: 'Mouse' },
  ];

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button
            onClick={() => onSelect(product)}
            aria-pressed={
              selectedProduct?.id === product.id
            }
          >
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ProductDetail({
  product,
}: {
  product: Product | null;
}) {
  if (!product) {
    return <p>Select a product.</p>;
  }

  return <p>{product.name}</p>;
}
```

`ProductApp`이 선택 상품의 유일한 State 소유자입니다.

- `ProductList`는 현재 선택된 상품을 표시하고 상품 선택을 요청합니다.
- `ProductDetail`은 부모 컴포넌트에서 전달받은 상품 정보를 표시합니다.
- `ProductApp`은 선택 상품의 State를 관리하고 변경된 값을 두 컴포넌트에 전달합니다.

이러한 구조에서는 선택 상품 데이터가 하나의 원천에서 관리되므로 여러 컴포넌트 간 데이터 일관성을 유지할 수 있습니다.

### 2.2. State Owner와 State Consumer

공유 State를 설계할 때는 상태의 소유자(State Owner)와 상태를 사용하는 컴포넌트(State Consumer)를 구분하는 것이 중요합니다.

**State Owner**

State를 실제로 선언하고 변경을 관리하는 컴포넌트입니다.

```tsx
function App() {
  const [count, setCount] = useState(0);

  return (
    <Counter
      count={count}
      onIncrement={() => setCount(count + 1)}
    />
  );
}
```

`App`이 `count` State의 소유자입니다.

**State Consumer**

State Owner로부터 Props 또는 Context를 전달받아 데이터를 사용하는 컴포넌트입니다.

```tsx
type CounterProps = {
  count: number;
  onIncrement: () => void;
};

function Counter({
  count,
  onIncrement,
}: CounterProps) {
  return (
    <div>
      <p>{count}</p>
      <button onClick={onIncrement}>
        Increment
      </button>
    </div>
  );
}
```

`Counter`는 전달받은 State를 표시하고 이벤트 핸들러를 호출하여 상태 변경을 요청합니다.

이처럼 상태 소유권과 사용 책임을 분리하면 컴포넌트 간 의존 관계를 명확하게 유지할 수 있습니다.

### 2.3. State와 이벤트 핸들러 공유

React에서 자식 컴포넌트는 부모 컴포넌트의 State를 직접 변경할 수 없습니다.

대신 부모 컴포넌트가 상태 변경 함수를 Props로 전달하면 자식 컴포넌트에서 해당 함수를 호출할 수 있습니다.

```tsx
import { useState } from 'react';

function Parent() {
  const [message, setMessage] = useState('');

  function handleMessageChange(value: string) {
    setMessage(value);
  }

  return (
    <>
      <MessageInput
        value={message}
        onChange={handleMessageChange}
      />

      <MessagePreview message={message} />
    </>
  );
}

function MessageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
    />
  );
}

function MessagePreview({
  message,
}: {
  message: string;
}) {
  return <p>{message}</p>;
}
```

이벤트 핸들러를 전달하는 방식은 다음과 같은 데이터 흐름을 구성합니다.

1. 부모 컴포넌트가 State를 소유합니다.
2. 부모 컴포넌트가 State를 자식 컴포넌트에 전달합니다.
3. 자식 컴포넌트가 사용자 이벤트를 처리합니다.
4. 자식 컴포넌트가 부모의 이벤트 핸들러를 호출합니다.
5. 부모 컴포넌트가 State를 업데이트합니다.
6. 변경된 State가 새로운 Props로 전달됩니다.

이 구조는 React의 단방향 데이터 흐름을 유지하면서 컴포넌트 간 상태 공유를 가능하게 합니다.

## 3. Props를 이용한 상태 공유

Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하는 기본적인 수단입니다.

공유 State를 소유한 부모 컴포넌트가 필요한 자식 컴포넌트에 Props를 전달하면 별도의 상태 관리 도구 없이도 컴포넌트 간 데이터를 공유할 수 있습니다.

### 3.1. 기본적인 상태 공유

```tsx
import { useState } from 'react';

function Dashboard() {
  const [userName, setUserName] =
    useState('Guest');

  return (
    <div>
      <UserProfile userName={userName} />

      <UserGreeting userName={userName} />

      <button
        onClick={() => setUserName('React User')}
      >
        Login
      </button>
    </div>
  );
}

function UserProfile({
  userName,
}: {
  userName: string;
}) {
  return <p>Profile: {userName}</p>;
}

function UserGreeting({
  userName,
}: {
  userName: string;
}) {
  return <h2>Hello, {userName}</h2>;
}
```

`Dashboard`에서 관리하는 `userName`은 `UserProfile`과 `UserGreeting`에 동시에 전달됩니다.

버튼을 클릭하면 부모의 State가 변경되고 두 자식 컴포넌트는 새로운 값을 전달받습니다.

이 방식은 컴포넌트 계층이 단순하고 상태를 사용하는 컴포넌트가 공통 부모와 가까운 위치에 있을 때 적합합니다.

### 3.2. Props Drilling

Props Drilling은 특정 하위 컴포넌트에서 필요한 데이터를 전달하기 위해 중간 컴포넌트들이 해당 Props를 반복적으로 전달하는 현상입니다.

예를 들어 다음과 같은 컴포넌트 구조를 가정하겠습니다.

```text
App
└── Layout
    └── Page
        └── Section
            └── UserProfile
```

`App`에서 관리하는 사용자 정보를 `UserProfile`에서 사용하려면 중간 컴포넌트들이 Props를 전달해야 합니다.

```tsx
type User = {
  id: number;
  name: string;
};

function App() {
  const user: User = {
    id: 1,
    name: 'React User',
  };

  return <Layout user={user} />;
}

function Layout({ user }: { user: User }) {
  return <Page user={user} />;
}

function Page({ user }: { user: User }) {
  return <Section user={user} />;
}

function Section({ user }: { user: User }) {
  return <UserProfile user={user} />;
}

function UserProfile({ user }: { user: User }) {
  return <p>{user.name}</p>;
}
```

`Layout`, `Page`, `Section`은 사용자 정보를 직접 사용하지 않지만 하위 컴포넌트에 전달하기 위해 Props를 선언하고 있습니다.

컴포넌트 계층이 깊어지거나 여러 컴포넌트에서 동일한 데이터를 필요로 하면 다음과 같은 문제가 발생할 수 있습니다.

- 중간 컴포넌트의 Props가 증가합니다.
- 컴포넌트 인터페이스가 실제 역할과 무관하게 복잡해집니다.
- 컴포넌트 구조가 변경되면 Props 전달 경로도 함께 수정해야 합니다.
- 여러 계층에서 동일한 데이터를 전달하는 코드가 반복됩니다.

Props Drilling이 항상 문제가 되는 것은 아닙니다.

컴포넌트 계층이 단순하고 전달하는 데이터가 제한적이라면 Props를 사용하는 것이 가장 명확한 방법일 수 있습니다.

다만 깊은 계층의 여러 컴포넌트가 동일한 데이터를 필요로 한다면 Context API를 고려할 수 있습니다.

## 4. Context API를 이용한 상태 공유

Context API는 컴포넌트 트리에서 상위 컴포넌트가 제공한 데이터를 깊은 하위 컴포넌트에서도 사용할 수 있도록 지원합니다.

Props를 여러 단계에 걸쳐 전달하지 않아도 되므로 Props Drilling을 줄일 수 있습니다.

Context 자체는 데이터를 저장하거나 상태를 변경하는 기능이 아니라 컴포넌트 트리를 통해 값을 전달하는 메커니즘입니다.

따라서 일반적으로 `useState` 또는 `useReducer`와 함께 사용하여 공유 상태를 구성합니다.

### 4.1. Context 생성

`createContext`를 사용하여 Context 객체를 생성합니다.

```tsx
import { createContext } from 'react';

type User = {
  id: number;
  name: string;
};

type UserContextValue = {
  user: User | null;
};

export const UserContext =
  createContext<UserContextValue | null>(null);
```

Context에는 공유할 데이터의 타입을 지정할 수 있습니다.

여기서는 사용자 정보를 공유하기 위해 `UserContextValue` 타입을 정의했습니다.

### 4.2. Provider를 이용한 데이터 제공

React 19에서는 Context 객체 자체를 Provider로 사용할 수 있습니다.

```tsx
import { useState } from 'react';
import { UserContext } from './UserContext';

function App() {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'React User',
  });

  return (
    <UserContext
      value={{
        user,
      }}
    >
      <Dashboard />
    </UserContext>
  );
}
```

React 18 이하에서는 다음과 같이 `.Provider`를 사용합니다.

```tsx
<UserContext.Provider
  value={{
    user,
  }}
>
  <Dashboard />
</UserContext.Provider>
```

Provider의 `value`에는 하위 컴포넌트에 제공할 데이터를 전달합니다.

Provider 내부에 위치한 하위 컴포넌트는 해당 Context의 값을 사용할 수 있습니다.

### 4.3. useContext를 이용한 데이터 접근

`useContext`를 사용하면 컴포넌트에서 가장 가까운 상위 Provider가 제공하는 값을 읽을 수 있습니다.

```tsx
import { useContext } from 'react';
import { UserContext } from './UserContext';

function UserProfile() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      'UserProfile must be used within UserContext'
    );
  }

  return (
    <p>
      {context.user?.name ?? 'Guest'}
    </p>
  );
}
```

이제 `UserProfile`은 중간 컴포넌트로부터 사용자 정보를 Props로 전달받지 않아도 됩니다.

Context를 사용하는 컴포넌트가 Provider 하위에 위치하면 해당 값을 직접 읽을 수 있습니다.

### 4.4. Context 값 변경과 렌더링

Context Provider에 전달하는 `value`가 이전 값과 달라지면 해당 Context를 구독하는 하위 컴포넌트가 새로운 값을 반영하도록 업데이트됩니다.

```tsx
import {
  createContext,
  useContext,
  useState,
} from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');

function App() {
  const [theme, setTheme] =
    useState<Theme>('light');

  return (
    <ThemeContext value={theme}>
      <button
        onClick={() =>
          setTheme((previous) =>
            previous === 'light' ? 'dark' : 'light'
          )
        }
      >
        Toggle Theme
      </button>

      <Page />
    </ThemeContext>
  );
}

function Page() {
  return <ThemePanel />;
}

function ThemePanel() {
  const theme = useContext(ThemeContext);

  return (
    <div>
      Current theme: {theme}
    </div>
  );
}
```

`theme`이 변경되면 `ThemeContext`의 새로운 값이 하위 컴포넌트에 전달됩니다.

`ThemePanel`은 Context를 직접 구독하고 있으므로 변경된 테마를 반영합니다.

Context를 사용할 때는 다음 사항을 고려해야 합니다.

- Context는 컴포넌트 트리의 데이터 전달을 위한 기능입니다.
- Context Provider의 값이 변경되면 해당 Context를 구독하는 컴포넌트가 업데이트됩니다.
- Context를 사용하지 않는 중간 컴포넌트는 Context 값 변경만으로 업데이트되는 것은 아닙니다.
- Context에 많은 데이터를 무분별하게 통합하면 불필요한 렌더링과 데이터 의존성이 증가할 수 있습니다.
- 서로 다른 변경 주기를 가진 데이터는 Context를 분리하는 방식을 고려할 수 있습니다.

## 5. Reducer와 Context를 이용한 상태 공유

상태가 복잡해지면 `useState`만으로 상태 변경 로직을 관리하기 어려워질 수 있습니다.

이러한 경우 `useReducer`와 Context API를 함께 사용할 수 있습니다.

각 기능의 역할은 다음과 같습니다.

- `useReducer`: State와 상태 변경 로직을 Reducer로 관리합니다.
- Context API: State와 Dispatch 함수를 컴포넌트 트리의 하위 컴포넌트에 제공합니다.

이 두 기능을 결합하면 상태 변경 로직을 한곳에 모으면서 여러 컴포넌트가 해당 상태를 공유할 수 있습니다.

### 5.1. Reducer 정의

```tsx
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type TaskAction =
  | {
      type: 'added';
      task: Task;
    }
  | {
      type: 'toggled';
      id: number;
    }
  | {
      type: 'deleted';
      id: number;
    };

function taskReducer(
  state: Task[],
  action: TaskAction
): Task[] {
  switch (action.type) {
    case 'added':
      return [...state, action.task];

    case 'toggled':
      return state.map((task) =>
        task.id === action.id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      );

    case 'deleted':
      return state.filter(
        (task) => task.id !== action.id
      );

    default:
      return state;
  }
}
```

Reducer는 현재 State와 Action을 입력받아 새로운 State를 반환합니다.

상태 변경 로직이 컴포넌트 외부에 분리되므로 여러 이벤트 처리 과정에서 동일한 상태 변경 규칙을 재사용할 수 있습니다.

### 5.2. Context 생성 및 Provider 구성

```tsx
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';

const initialTasks: Task[] = [];

const TasksContext = createContext<Task[] | null>(
  null
);

const TasksDispatchContext =
  createContext<Dispatch<TaskAction> | null>(null);

function TasksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [tasks, dispatch] = useReducer(
    taskReducer,
    initialTasks
  );

  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}
```

`TasksProvider`는 Task 목록과 Dispatch 함수를 각각 별도의 Context로 제공합니다.

이렇게 분리하면 State를 읽는 컴포넌트와 Action을 전달하는 컴포넌트의 의존성을 구분할 수 있습니다.

### 5.3. Context 접근을 위한 Custom Hook

```tsx
function useTasks() {
  const context = useContext(TasksContext);

  if (context === null) {
    throw new Error(
      'useTasks must be used within TasksProvider'
    );
  }

  return context;
}

function useTasksDispatch() {
  const context = useContext(
    TasksDispatchContext
  );

  if (context === null) {
    throw new Error(
      'useTasksDispatch must be used within TasksProvider'
    );
  }

  return context;
}
```

Custom Hook을 이용하면 Context 접근과 Provider 사용 여부 검증을 재사용할 수 있습니다.

### 5.4. 하위 컴포넌트에서 상태 사용

```tsx
function TaskList() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                dispatch({
                  type: 'toggled',
                  id: task.id,
                })
              }
            />

            {task.title}
          </label>

          <button
            onClick={() =>
              dispatch({
                type: 'deleted',
                id: task.id,
              })
            }
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

애플리케이션에서는 Provider로 하위 컴포넌트를 감싸서 공유 상태를 제공합니다.

```tsx
function App() {
  return (
    <TasksProvider>
      <TaskList />
    </TasksProvider>
  );
}
```

이 구조에서는 `TaskList`가 `TasksProvider`로부터 State와 Dispatch 함수를 직접 가져옵니다.

중간 컴포넌트가 Props를 전달하지 않아도 되며, 상태 변경 로직은 Reducer에 집중됩니다.

## 6. External State Management

애플리케이션의 규모가 커지면 컴포넌트 트리의 여러 영역에서 동일한 상태를 공유해야 하는 상황이 발생합니다.

Context API와 `useReducer`만으로도 많은 상태 관리 요구사항을 해결할 수 있지만, 상태의 규모와 변경 빈도, 비동기 처리, 캐싱, 개발 도구 등의 요구사항에 따라 별도의 상태 관리 라이브러리를 사용할 수 있습니다.

External State Management는 React 컴포넌트 외부에 별도의 상태 저장소(Store)를 두고 여러 컴포넌트가 해당 상태를 공유하는 방식입니다.

대표적인 라이브러리는 다음과 같습니다.

| 라이브러리 | 주요 특징 |
|---|---|
| Redux Toolkit | 중앙 집중식 Store, Reducer 및 Action 기반 상태 관리 |
| Zustand | 간결한 Store 기반 상태 관리 |
| Jotai | Atom 단위의 세분화된 상태 관리 |
| MobX | Observable 기반 반응형 상태 관리 |

### 6.1. Zustand

Zustand는 Store를 생성하고 React 컴포넌트에서 필요한 상태를 선택하여 사용할 수 있도록 지원하는 상태 관리 라이브러리입니다.

```tsx
import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const useCounterStore = create<CounterStore>(
  (set) => ({
    count: 0,

    increment: () =>
      set((state) => ({
        count: state.count + 1,
      })),

    decrement: () =>
      set((state) => ({
        count: state.count - 1,
      })),
  })
);
```

컴포넌트에서는 Store Hook을 사용하여 필요한 상태와 동작을 가져옵니다.

```tsx
function Counter() {
  const count = useCounterStore(
    (state) => state.count
  );

  const increment = useCounterStore(
    (state) => state.increment
  );

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}
```

이 구조에서는 컴포넌트 간 공통 부모를 통해 State를 전달하지 않아도 동일한 Store를 공유할 수 있습니다.

또한 Selector를 이용하여 컴포넌트가 실제로 사용하는 상태를 선택할 수 있습니다.

다만 External State Management를 도입한다고 해서 모든 State를 외부 Store로 이동해야 하는 것은 아닙니다.

특정 컴포넌트에서만 사용하는 일시적인 UI 상태는 컴포넌트 내부에 유지하는 것이 더 적절할 수 있습니다.

## 7. 상태 공유 방식의 선택 기준

상태 공유 방식은 컴포넌트의 관계, 데이터의 사용 범위, 상태 변경의 복잡도에 따라 결정해야 합니다.

| 상황 | 권장 방식 | 설명 |
|---|---|---|
| 가까운 자식 컴포넌트 간 데이터 공유 | Props | 가장 단순하고 명시적인 데이터 전달 |
| 형제 컴포넌트 간 상태 공유 | Lifting State Up | 가장 가까운 공통 부모가 State 관리 |
| 깊은 컴포넌트 트리에서 데이터 공유 | Context API | 중간 Props 전달 최소화 |
| 복잡한 상태 변경 로직 관리 | useReducer | 상태 전이 로직 분리 |
| Reducer 기반 복잡한 상태의 깊은 공유 | Reducer + Context | 상태 변경과 데이터 전달 역할 분리 |
| 여러 영역에서 공유하는 전역 상태 관리 | External State Management | 독립적인 Store를 통한 상태 공유 |

상태 공유 방식을 선택할 때는 다음 사항을 함께 고려하는 것이 좋습니다.

**1. 상태를 사용하는 컴포넌트의 범위**

공유 State를 사용하는 컴포넌트가 가까운 위치에 있다면 Props와 Lifting State Up만으로 충분할 수 있습니다.

**2. 상태의 변경 빈도**

자주 변경되는 상태를 Context로 공유한다면 Context 값의 변경에 따른 구독 컴포넌트의 렌더링 비용을 고려해야 합니다.

**3. 상태 변경 로직의 복잡도**

단순한 값 변경은 `useState`로 관리할 수 있지만, 여러 Action과 복잡한 상태 전이가 존재한다면 `useReducer`가 적합할 수 있습니다.

**4. 상태의 사용 범위**

애플리케이션 전반에서 여러 기능이 동일한 상태를 공유해야 한다면 외부 상태 관리 라이브러리를 고려할 수 있습니다.

**5. 상태의 성격**

모든 데이터가 React State에 적합한 것은 아닙니다. 서버에서 가져온 데이터의 캐싱 및 동기화는 TanStack Query와 같은 서버 상태 관리 도구를 별도로 고려할 수 있습니다.

## 8. 상태 공유 시 주의사항

### 8.1. 모든 State를 전역화하지 않습니다.

공유가 필요한 State와 특정 컴포넌트에서만 사용하는 State를 구분해야 합니다.

모든 State를 최상위 컴포넌트나 전역 Store에 배치하면 컴포넌트 간 결합도가 증가하고 상태 관리 구조가 복잡해질 수 있습니다.

상태는 실제 사용 범위에 맞는 가장 적절한 위치에 배치하는 것이 좋습니다.

### 8.2. 동일한 데이터를 중복 저장하지 않습니다.

여러 컴포넌트에서 동일한 데이터를 사용한다고 해서 각 컴포넌트에 별도의 State를 생성할 필요는 없습니다.

공유 데이터의 소유자를 명확하게 지정하고, 필요한 컴포넌트에서 해당 데이터를 참조하도록 구성해야 합니다.

### 8.3. Context를 무분별하게 사용하지 않습니다.

Context는 깊은 컴포넌트 트리에서 데이터를 전달하는 데 유용하지만 모든 Props 전달을 대체하기 위한 기능은 아닙니다.

컴포넌트 간 의존 관계가 명확하게 드러나는 Props가 더 적절한 경우도 많습니다.

### 8.4. Context의 변경 범위를 고려합니다.

Context Provider의 `value`가 변경되면 해당 Context를 사용하는 하위 컴포넌트가 새로운 값을 반영합니다.

따라서 변경 주기가 다른 상태를 하나의 거대한 Context에 통합하는 것은 비효율적일 수 있습니다.

필요에 따라 Context를 분리하거나 상태 선택 범위를 세분화하는 방식을 고려해야 합니다.

### 8.5. 서버 상태와 클라이언트 상태를 구분합니다.

모든 공유 데이터를 동일한 방식으로 관리할 필요는 없습니다.

일반적으로 다음과 같이 구분할 수 있습니다.

- **Client State:** 모달 표시 여부, 선택된 탭, 사용자 입력값 등 클라이언트에서 관리하는 상태입니다.
- **Server State:** API 응답, 서버 데이터의 캐싱 및 동기화 등 서버를 원본으로 하는 데이터입니다.

서버 상태는 데이터의 캐싱, 재검증, 로딩 및 오류 처리 등의 요구사항이 있으므로 일반적인 UI State와 구분하여 관리하는 것이 좋습니다.

## 9. 정리

React에서 Sharing State는 여러 컴포넌트가 동일한 데이터를 사용하고 일관된 UI를 유지하기 위한 핵심적인 상태 관리 개념입니다.

주요 원칙은 다음과 같습니다.

1. 동일한 데이터를 여러 컴포넌트에서 별도로 관리하지 않고 명확한 State Owner를 지정합니다.
2. 가까운 컴포넌트 간의 상태 공유는 Props와 Lifting State Up을 우선적으로 고려합니다.
3. 깊은 컴포넌트 트리에서 공유 데이터가 필요한 경우 Context API를 활용합니다.
4. 복잡한 상태 변경 로직은 `useReducer`로 분리할 수 있습니다.
5. Reducer와 Context를 결합하면 복잡한 상태를 여러 하위 컴포넌트에서 공유할 수 있습니다.
6. 애플리케이션 전반의 상태 관리 요구사항이 증가하면 External State Management를 고려합니다.
7. Client State와 Server State의 특성을 구분하여 적절한 관리 방식을 선택합니다.

궁극적으로 상태 공유의 목적은 여러 컴포넌트가 동일한 데이터를 사용하더라도 데이터의 소유권과 변경 책임을 명확하게 유지하는 것입니다.

컴포넌트의 관계와 데이터의 사용 범위에 따라 적절한 상태 공유 방식을 선택하면 불필요한 데이터 중복과 컴포넌트 간 결합도를 줄이고 유지보수하기 쉬운 React 애플리케이션을 설계할 수 있습니다.

## 10. 참고자료

### React 공식 문서

- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) — 컴포넌트 간 상태 공유, Lifting State Up, Controlled 및 Uncontrolled Components
- [Managing State](https://react.dev/learn/managing-state) — React 상태 관리의 전반적인 개념과 상태 공유 방식
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) — Context API를 이용한 깊은 컴포넌트 트리의 데이터 전달
- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) — Reducer를 이용한 상태 변경 로직 분리
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context) — Reducer와 Context를 결합한 복합 상태 관리
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) — 상태 구조 설계 및 데이터 중복 방지

### 상태 관리 라이브러리

- [Redux Toolkit](https://redux-toolkit.js.org/) — Redux 기반 상태 관리 공식 도구
- [Zustand](https://zustand.docs.pmnd.rs/) — 간결한 Store 기반 상태 관리 라이브러리
- [Jotai](https://jotai.org/) — Atom 기반 상태 관리 라이브러리
- [MobX](https://mobx.js.org/README.html) — Observable 기반 반응형 상태 관리 라이브러리
- [TanStack Query](https://tanstack.com/query/latest) — 서버 상태의 캐싱 및 동기화 라이브러리

### 관련 개념

- [State Structure](./state-structure.md) — 상태 구조 설계 원칙
- [Lifting State Up](./lifting-state-up.md) — 공통 부모 컴포넌트로 상태를 이동하는 방법
- [Context API](./context-api.md) — Context를 이용한 데이터 전달
- [Reducer Pattern](./reducer-pattern.md) — Reducer 기반 상태 관리
- [One-Way Data Flow](../fundamentals/one-way-data-flow.md) — React의 단방향 데이터 흐름