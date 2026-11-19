# Typing Context

React Context는 컴포넌트 트리에서 여러 컴포넌트가 공통 데이터를 공유할 수 있도록 제공하는 기능입니다.

일반적으로 Props를 여러 단계에 걸쳐 전달해야 하는 상황에서 Prop Drilling을 줄이기 위해 사용합니다.

TypeScript와 함께 Context를 사용하면 공유 데이터의 구조와 변경 함수를 명확하게 정의할 수 있습니다. 이를 통해 Provider와 Consumer 사이의 타입 안정성을 확보하고, Context를 사용하는 컴포넌트에서 안전하게 데이터를 참조할 수 있습니다.

## 1. Context 기본 구조

React Context는 `createContext`로 생성하고, `Provider`를 통해 하위 컴포넌트에 값을 전달합니다. 하위 컴포넌트에서는 `useContext`를 사용하여 Context 값을 읽을 수 있습니다.

```tsx
import { createContext, useContext } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemeButton />
    </ThemeContext.Provider>
  );
}

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button>{theme}</button>;
}
```

`createContext<Theme>("light")`와 같이 Generic을 지정하면 Context가 전달하는 값의 타입을 `Theme`으로 제한할 수 있습니다.

Provider에 전달하는 `value` 역시 동일한 타입을 따라야 합니다.

Context를 생성할 때 지정한 타입은 이후 `useContext`를 사용하는 컴포넌트에도 적용됩니다.

## 2. createContext Type Definition

`createContext`는 Context가 공유할 값의 타입을 Generic으로 전달받습니다.

```tsx
const Context = createContext<ContextType>(defaultValue);
```

- `ContextType`: Context에서 공유할 데이터의 타입입니다.
- `defaultValue`: Provider가 존재하지 않을 때 사용하는 기본값입니다.

### 2.1 Primitive Context

문자열, 숫자, Boolean 등 기본 타입을 Context로 공유할 수 있습니다.

```tsx
import { createContext } from "react";

const LanguageContext = createContext<string>("ko");

const FontSizeContext = createContext<number>(16);

const AuthenticatedContext = createContext<boolean>(false);
```

이러한 방식은 공유 데이터가 단일 값으로 충분한 경우에 적합합니다.

### 2.2 Object Context

여러 데이터를 하나의 Context로 공유하려면 객체 타입을 정의할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

type UserContextType = {
  user: User | null;
  authenticated: boolean;
};

const UserContext = createContext<UserContextType>({
  user: null,
  authenticated: false,
});
```

객체 타입을 별도로 정의하면 Context가 제공하는 데이터 구조를 명확하게 표현할 수 있습니다.

### 2.3 Union Type Context

Context가 제한된 여러 상태 중 하나를 나타내는 경우에는 Union Type을 사용할 수 있습니다.

```tsx
type Theme = "light" | "dark" | "system";

const ThemeContext = createContext<Theme>("system");
```

이 경우 Provider에서 허용되지 않은 문자열을 전달하면 TypeScript 오류가 발생합니다.

## 3. Context Default Value

`createContext`의 기본값은 Provider가 없는 상황에서 `useContext`가 반환하는 값입니다.

기본값은 단순히 초기 상태를 의미하는 것이 아니라 Provider가 제공되지 않았을 때 사용하는 정적 대체값입니다.

### 3.1 Providing a Default Value

기본값이 명확한 경우에는 실제 기본값을 전달할 수 있습니다.

```tsx
type Theme = "light" | "dark";

const ThemeContext = createContext<Theme>("light");
```

Provider 외부에서 Context를 사용하면 `"light"`가 반환됩니다.

이 방식은 Provider가 없어도 합리적인 기본 동작을 제공할 수 있는 경우에 적합합니다.

### 3.2 Using null as Default Value

Provider가 반드시 존재해야 하는 Context라면 기본값으로 `null`을 사용하는 방법이 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

type UserContextType = {
  user: User | null;
  logout: () => void;
};

const UserContext = createContext<UserContextType | null>(null);
```

이 경우 `useContext(UserContext)`의 반환 타입은 `UserContextType | null`입니다.

따라서 Context를 사용하는 컴포넌트에서 Null 검사가 필요합니다.

```tsx
function UserProfile() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserContext Provider is missing");
  }

  return <div>{context.user?.name}</div>;
}
```

다만 여러 컴포넌트에서 동일한 Null 검사를 반복하는 것은 비효율적이므로 Custom Hook으로 분리하는 것이 좋습니다.

### 3.3 Avoiding Unsafe Type Assertions

다음과 같이 기본값을 빈 객체로 지정하고 Type Assertion을 사용하는 패턴은 권장하지 않습니다.

```tsx
type UserContextType = {
  user: User;
  logout: () => void;
};

const UserContext = createContext(
  {} as UserContextType
);
```

이 방식은 TypeScript에 실제로 존재하지 않는 값도 존재한다고 알려줍니다.

Provider가 없는 상황에서 `user`나 `logout`에 접근하면 런타임 오류가 발생할 수 있습니다.

Context의 실제 사용 조건을 타입에 반영하고, Provider가 필수인 경우 `null`을 초기값으로 사용하는 것이 안전합니다.

## 4. Typing Context Provider

Provider는 Context에 정의된 타입의 값을 하위 컴포넌트에 전달합니다.

Provider 컴포넌트를 별도로 정의하면 공유 데이터의 초기화와 변경 로직을 한곳에서 관리할 수 있습니다.

### 4.1 Provider Props

Provider가 전달받는 `children`은 `React.ReactNode` 타입으로 선언할 수 있습니다.

```tsx
import type { ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value="light">
      {children}
    </ThemeContext.Provider>
  );
}
```

`ReactNode`는 JSX 요소뿐 아니라 문자열, 숫자, Fragment, 배열, `null` 등 React가 렌더링할 수 있는 다양한 값을 포함합니다.

### 4.2 Provider with useState

Context에서 공유하는 데이터가 변경되어야 한다면 `useState`와 함께 사용할 수 있습니다.

```tsx
import {
  createContext,
  useState,
} from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(
  null
);

type ThemeProviderProps = {
  children: ReactNode;
};

function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

`ThemeContextType`은 Provider가 제공해야 하는 데이터와 함수를 정의합니다.

`value` 객체에 명시적인 타입을 지정하면 Context에서 공유하는 데이터 구조가 일관되게 유지됩니다.

### 4.3 Provider with PropsWithChildren

React는 `PropsWithChildren` 타입을 제공하여 `children`을 포함하는 Props를 간결하게 선언할 수 있습니다.

```tsx
import type { PropsWithChildren } from "react";

type ThemeProviderProps = PropsWithChildren<{
  initialTheme?: Theme;
}>;

function ThemeProvider({
  children,
  initialTheme = "light",
}: ThemeProviderProps) {
  // Provider implementation
  return (
    <ThemeContext.Provider value={initialTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
```

`PropsWithChildren<T>`는 기존 Props 타입에 선택적인 `children?: ReactNode`를 추가합니다.

`children`이 필수여야 한다면 `ReactNode`를 직접 필수 속성으로 선언하는 편이 적절합니다.

## 5. Custom Hook for Context

Context를 사용하는 컴포넌트마다 `useContext`와 Null 검사를 반복하는 대신 Custom Hook으로 접근 로직을 분리할 수 있습니다.

이 방식은 Provider가 없는 상황을 일관되게 처리하고 Context 사용 방법을 단순화합니다.

### 5.1 Basic Custom Hook

```tsx
import { useContext } from "react";

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

Context가 `null`인지 검사한 후 반환하기 때문에 `useTheme`의 반환 타입은 `ThemeContextType`으로 추론됩니다.

이제 컴포넌트에서는 별도의 Null 검사를 수행하지 않아도 됩니다.

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

### 5.2 Custom Hook Naming

Custom Hook은 일반적으로 `use` 접두사로 시작하는 이름을 사용합니다.

```tsx
function useAuth() {
  // Authentication Context
}

function useTheme() {
  // Theme Context
}

function useUser() {
  // User Context
}
```

이러한 명명 규칙은 React Hooks의 호출 규칙을 적용하고 코드의 역할을 명확하게 구분하는 데 도움이 됩니다.

## 6. Context with State and Actions

실제 애플리케이션에서는 Context를 통해 데이터뿐 아니라 데이터를 변경하는 함수도 함께 공유하는 경우가 많습니다.

이때 State와 Action을 별도로 정의하면 Context의 역할을 명확하게 구분할 수 있습니다.

### 6.1 Defining State and Actions

```tsx
type User = {
  id: number;
  name: string;
};

type AuthState = {
  user: User | null;
  authenticated: boolean;
};

type AuthActions = {
  login: (user: User) => void;
  logout: () => void;
};

type AuthContextType = AuthState & AuthActions;
```

`AuthState`는 현재 인증 상태를 표현하고, `AuthActions`는 상태를 변경하는 함수를 표현합니다.

Intersection Type을 사용하면 두 타입을 결합하여 Context 전체 구조를 정의할 수 있습니다.

### 6.2 Provider Implementation

```tsx
import {
  createContext,
  useState,
} from "react";
import type { ReactNode } from "react";

type User = {
  id: number;
  name: string;
};

type AuthState = {
  user: User | null;
  authenticated: boolean;
};

type AuthActions = {
  login: (user: User) => void;
  logout: () => void;
};

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | null>(
  null
);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    authenticated: user !== null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

`authenticated`는 `user`의 존재 여부를 기반으로 계산합니다.

이처럼 파생 가능한 상태는 별도로 관리하기보다 기존 상태를 기반으로 계산하면 상태 간 불일치를 방지할 수 있습니다.

### 6.3 Context Consumer

```tsx
function useAuth() {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}

function UserProfile() {
  const { user, authenticated, logout } = useAuth();

  if (!authenticated || user === null) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <p>{user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

Context에 정의된 타입이 Consumer에도 적용되므로 데이터와 Action을 안전하게 사용할 수 있습니다.

## 7. Context with useReducer

상태 변경 로직이 복잡한 경우에는 `useReducer`와 Context를 결합할 수 있습니다.

Reducer를 사용하면 상태 변경 규칙과 Action을 명확하게 분리할 수 있습니다.

### 7.1 Define State and Action

```tsx
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoState = {
  todos: Todo[];
};

type TodoAction =
  | {
      type: "add";
      payload: Todo;
    }
  | {
      type: "remove";
      payload: number;
    }
  | {
      type: "toggle";
      payload: number;
    };
```

Action을 Discriminated Union으로 정의하면 `type`에 따라 필요한 Payload 타입을 구분할 수 있습니다.

### 7.2 Reducer Implementation

```tsx
function todoReducer(
  state: TodoState,
  action: TodoAction
): TodoState {
  switch (action.type) {
    case "add":
      return {
        todos: [...state.todos, action.payload],
      };

    case "remove":
      return {
        todos: state.todos.filter(
          (todo) => todo.id !== action.payload
        ),
      };

    case "toggle":
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    default:
      return state;
  }
}
```

Reducer는 현재 상태와 Action을 받아 새로운 상태를 반환합니다.

TypeScript는 Action의 `type`을 기준으로 각 Payload의 타입을 추론합니다.

### 7.3 Separate State and Dispatch Contexts

State와 Dispatch를 별도의 Context로 분리할 수 있습니다.

```tsx
import {
  createContext,
  useContext,
  useReducer,
} from "react";
import type { ReactNode } from "react";

const TodoStateContext = createContext<TodoState | null>(
  null
);

const TodoDispatchContext = createContext<
  React.Dispatch<TodoAction> | null
>(null);
```

State Context는 현재 상태를 전달하고, Dispatch Context는 Action을 전달하는 역할을 담당합니다.

Provider는 다음과 같이 구현할 수 있습니다.

```tsx
function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
  });

  return (
    <TodoStateContext.Provider value={state}>
      <TodoDispatchContext.Provider value={dispatch}>
        {children}
      </TodoDispatchContext.Provider>
    </TodoStateContext.Provider>
  );
}
```

각 Context에 접근하는 Custom Hook을 별도로 제공합니다.

```tsx
function useTodoState() {
  const context = useContext(TodoStateContext);

  if (context === null) {
    throw new Error(
      "useTodoState must be used within TodoProvider"
    );
  }

  return context;
}

function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);

  if (context === null) {
    throw new Error(
      "useTodoDispatch must be used within TodoProvider"
    );
  }

  return context;
}
```

Consumer에서는 필요한 Context만 선택적으로 사용할 수 있습니다.

```tsx
function TodoList() {
  const { todos } = useTodoState();

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
}

function AddTodoButton() {
  const dispatch = useTodoDispatch();

  const handleAdd = () => {
    dispatch({
      type: "add",
      payload: {
        id: Date.now(),
        title: "Learn React Context",
        completed: false,
      },
    });
  };

  return (
    <button onClick={handleAdd}>
      Add Todo
    </button>
  );
}
```

State와 Dispatch를 분리하면 Dispatch만 사용하는 컴포넌트가 State Context의 변경에 직접 구독되지 않도록 구성할 수 있습니다.

다만 State Context를 구독하는 컴포넌트는 해당 Context의 `value`가 변경되면 리렌더링될 수 있습니다. Context 분리만으로 모든 불필요한 리렌더링이 해결되는 것은 아닙니다.

## 8. Context Type Patterns

Context의 타입을 정의하는 방법은 프로젝트의 구조와 사용 목적에 따라 달라질 수 있습니다.

### 8.1 Interface vs Type

Context 타입은 `interface` 또는 `type`으로 정의할 수 있습니다.

```tsx
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}
```

```tsx
type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};
```

두 방식 모두 객체 형태의 Context 타입을 표현할 수 있습니다.

일반적으로 객체 구조를 확장해야 한다면 `interface`를 사용할 수 있으며, Union Type이나 Intersection Type과 결합해야 한다면 `type`이 유용합니다.

프로젝트 내에서 일관된 규칙을 유지하는 것이 중요합니다.

### 8.2 Extracting Context Types

Context의 타입 정의와 Provider 구현을 분리하면 재사용과 유지보수가 쉬워집니다.

```tsx
// theme-context.ts
export type Theme = "light" | "dark";

export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};
```

```tsx
// theme-provider.tsx
import { createContext } from "react";
import type { ThemeContextType } from "./theme-context";

export const ThemeContext =
  createContext<ThemeContextType | null>(null);
```

타입과 Context를 별도의 모듈로 관리하면 여러 컴포넌트에서 동일한 타입을 공유할 수 있습니다.

### 8.3 Readonly Context Values

Context에서 공유하는 데이터가 외부에서 변경되지 않아야 한다면 `readonly`를 활용할 수 있습니다.

```tsx
type AppConfig = {
  readonly apiUrl: string;
  readonly environment: "development" | "production";
};

const AppConfigContext = createContext<AppConfig | null>(null);
```

`readonly`는 TypeScript의 정적 타입 검사 단계에서 해당 속성의 재할당을 제한합니다.

다만 런타임에서 객체를 완전히 불변으로 만드는 것은 아니므로 실제 불변성이 필요한 경우에는 별도의 처리도 고려해야 합니다.

## 9. Context Performance and Type Design

Context의 타입 설계는 데이터 구조뿐 아니라 구독 범위와 리렌더링에도 영향을 줄 수 있습니다.

React Context는 Provider의 `value`가 변경되면 해당 Context를 구독하는 하위 컴포넌트에 변경 사항을 전달합니다.

### 9.1 Avoid Creating Unnecessary Objects

Provider에서 매번 새로운 객체를 생성하면 렌더링할 때마다 새로운 참조가 만들어질 수 있습니다.

```tsx
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme: () => {
          setTheme((prev) =>
            prev === "light" ? "dark" : "light"
          );
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```

이 경우 Provider가 다시 렌더링될 때 새로운 객체와 함수가 생성됩니다.

필요하다면 `useCallback`과 `useMemo`를 활용하여 참조를 안정화할 수 있습니다.

```tsx
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = useCallback(() => {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

이렇게 하면 `theme`이 변경되지 않은 상태에서 Provider가 다시 렌더링되더라도 `value` 객체의 참조를 유지할 수 있습니다.

단, 메모이제이션은 성능 최적화 수단이지 정확성을 보장하기 위한 필수 조건은 아닙니다.

### 9.2 Split Context by Responsibility

서로 다른 목적의 데이터를 하나의 Context에 모두 포함하면 관련 없는 데이터 변경에도 많은 컴포넌트가 영향을 받을 수 있습니다.

다음과 같이 Context를 목적별로 분리할 수 있습니다.

```tsx
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};
```

인증, 테마, 언어 설정처럼 변경 주기와 사용 범위가 다른 데이터는 별도의 Context로 관리하는 것이 적절할 수 있습니다.

### 9.3 Context Is Not a Global State Optimization Tool

Context는 전역 상태 관리 라이브러리와 동일한 방식으로 동작하지 않습니다.

Context는 값을 하위 컴포넌트에 전달하고 변경 사항을 구독자에게 전파하는 기능입니다.

상태가 자주 변경되거나 일부 데이터만 선택적으로 구독해야 하는 복잡한 상황에서는 Context만으로 성능을 최적화하기 어려울 수 있습니다.

이러한 경우에는 상태 분리, 컴포넌트 구조 조정, 메모이제이션 또는 외부 상태 관리 도구를 함께 고려해야 합니다.

## 10. Common Type Errors

Context를 TypeScript와 함께 사용할 때 자주 발생하는 오류를 정리합니다.

### 10.1 Context Value Type Mismatch

Context의 타입과 Provider의 `value` 타입이 일치하지 않으면 오류가 발생합니다.

```tsx
type ThemeContextType = {
  theme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
});

// Type Error
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>;
```

Provider에는 `ThemeContextType` 객체를 전달해야 합니다.

```tsx
<ThemeContext.Provider value={{ theme: "dark" }}>
  <App />
</ThemeContext.Provider>
```

### 10.2 Context May Be Null

Context의 기본값이 `null`이라면 `useContext`의 반환값에도 `null`이 포함됩니다.

```tsx
const context = useContext(UserContext);

return <div>{context.user?.name}</div>;
```

위 코드는 `context`가 `null`일 수 있으므로 오류가 발생합니다.

Null 검사를 수행하거나 Custom Hook을 통해 안전한 접근을 제공해야 합니다.

### 10.3 Missing Provider

Context의 기본값이 실제 데이터와 동일한 타입이더라도 Provider가 누락되면 의도하지 않은 기본값이 반환될 수 있습니다.

Provider가 반드시 필요한 Context라면 `null`을 기본값으로 설정하고 Custom Hook에서 예외를 발생시키는 패턴을 고려할 수 있습니다.

### 10.4 Incorrect Dispatch Type

Reducer와 Context를 결합할 때 Dispatch의 Action 타입을 잘못 지정하면 올바르지 않은 Action이 전달될 수 있습니다.

```tsx
const TodoDispatchContext = createContext<
  React.Dispatch<TodoAction> | null
>(null);
```

`React.Dispatch<TodoAction>`과 같이 구체적인 Action 타입을 지정해야 합니다.

`React.Dispatch<any>`처럼 `any`를 사용하면 Action 타입 검사의 장점을 잃게 됩니다.

## 11. Best Practices

React Context를 TypeScript와 함께 사용할 때는 다음 사항을 고려하는 것이 좋습니다.

### 11.1 Context 데이터 구조를 명확하게 정의합니다.

Context가 제공하는 상태와 함수의 타입을 별도로 정의하면 Provider와 Consumer 사이의 데이터 구조를 일관되게 유지할 수 있습니다.

### 11.2 Provider가 필수라면 null을 기본값으로 사용합니다.

Provider가 없는 상황에서 임의의 기본값을 반환하는 것보다 명시적으로 오류를 발생시키는 편이 안전할 수 있습니다.

### 11.3 Custom Hook으로 Context 접근을 추상화합니다.

Null 검사와 Provider 사용 규칙을 Custom Hook에 모으면 Consumer 컴포넌트의 코드를 간결하게 유지할 수 있습니다.

### 11.4 State와 Dispatch Context를 분리합니다.

Reducer 기반 상태 관리에서는 State와 Dispatch를 별도 Context로 분리하여 구독 범위를 구분할 수 있습니다.

다만 State Context의 변경으로 발생하는 리렌더링은 별도로 고려해야 합니다.

### 11.5 Context의 책임을 작게 유지합니다.

인증, 테마, 언어 설정 등 서로 다른 책임을 하나의 Context에 모두 포함하지 않는 것이 좋습니다.

데이터의 사용 범위와 변경 주기를 고려하여 Context를 분리합니다.

### 11.6 타입 추론과 명시적 타입을 적절히 활용합니다.

Context의 데이터 구조는 명시적으로 정의하는 것이 좋지만, Provider 내부의 지역 변수나 함수 반환 타입까지 불필요하게 반복 선언할 필요는 없습니다.

TypeScript의 타입 추론을 활용하여 중복을 줄이는 것이 좋습니다.

## 12. Summary

React Context는 컴포넌트 트리에서 데이터를 공유하기 위한 기능이며, TypeScript를 사용하면 공유 데이터와 변경 함수의 구조를 명확하게 정의할 수 있습니다.

| 개념 | 주요 역할 |
|---|---|
| `createContext<T>` | Context가 공유할 값의 타입 정의 |
| `defaultValue` | Provider가 없을 때 사용할 기본값 |
| `Context.Provider` | 하위 컴포넌트에 Context 값 전달 |
| `useContext` | Context 값 접근 |
| `ReactNode` | Provider의 Children 타입 정의 |
| `PropsWithChildren` | Children을 포함하는 Props 타입 정의 |
| Custom Hook | Context 접근 및 Null 검사 추상화 |
| `useReducer` | 복잡한 상태 변경 로직 관리 |
| `React.Dispatch<Action>` | Reducer Action 전달 타입 정의 |
| `useMemo` | Provider value 참조 안정화 |

Context를 TypeScript와 함께 사용할 때는 공유 데이터의 구조를 명확하게 정의하고 Provider와 Consumer가 동일한 타입을 사용하도록 구성해야 합니다.

Provider가 필수인 Context라면 `null`을 기본값으로 설정하고 Custom Hook에서 유효성을 검사하는 패턴이 유용합니다.

상태 변경 로직이 복잡하다면 `useReducer`를 결합하고, State와 Dispatch를 분리하여 구독 범위를 관리할 수 있습니다.

마지막으로 Context는 데이터 전달 및 구독 메커니즘이므로 전역 상태 관리와 성능 최적화를 모두 해결하는 도구로 간주해서는 안 됩니다. 데이터의 변경 빈도와 구독 범위를 고려하여 적절한 구조를 선택해야 합니다.

## 13. References

- [React 공식 문서 - createContext](https://react.dev/reference/react/createContext)
  - Context 생성과 기본값 설정 방법을 설명합니다.
- [React 공식 문서 - useContext](https://react.dev/reference/react/useContext)
  - 컴포넌트에서 Context 값을 읽고 Provider의 변경 사항을 구독하는 방법을 설명합니다.
- [React 공식 문서 - Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
  - Props Drilling을 줄이고 Context를 활용하여 데이터를 전달하는 방법을 설명합니다.
- [React 공식 문서 - Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
  - Reducer와 Context를 결합하여 복잡한 상태를 관리하는 방법을 설명합니다.
- [React 공식 문서 - useReducer](https://react.dev/reference/react/useReducer)
  - Reducer 기반 상태 관리와 Dispatch 타입 설계에 참고할 수 있습니다.
- [React 공식 문서 - useMemo](https://react.dev/reference/react/useMemo)
  - Provider value의 참조 안정화 등 메모이제이션 관련 내용을 설명합니다.
- [React 공식 문서 - Using TypeScript](https://react.dev/learn/typescript)
  - React 프로젝트에서 TypeScript를 사용하는 기본 방법을 설명합니다.
- [React TypeScript Cheatsheet - Context](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/)
  - Context의 타입 지정, 기본값 처리 및 Custom Hook 패턴을 설명합니다.
- [TypeScript 공식 문서 - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  - Union Type, Intersection Type 및 객체 타입 정의 방법을 설명합니다.