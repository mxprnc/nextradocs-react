# Context API

## 1. 개요

Context API는 React 컴포넌트 트리에서 상위 컴포넌트가 하위 컴포넌트에 데이터를 전달할 수 있도록 제공하는 기능입니다.

일반적으로 React에서는 Props를 사용하여 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달합니다. 그러나 여러 단계의 컴포넌트를 거쳐야 하거나 서로 다른 하위 컴포넌트에서 동일한 데이터가 필요한 경우 Props 전달이 복잡해질 수 있습니다.

Context API를 사용하면 중간 컴포넌트에서 Props를 반복적으로 전달하지 않고도 하위 컴포넌트에서 필요한 데이터에 접근할 수 있습니다.

예를 들어 애플리케이션의 테마, 인증된 사용자 정보, 언어 설정처럼 여러 컴포넌트에서 공통으로 사용하는 데이터를 전달할 때 활용할 수 있습니다.

Context API는 상태를 저장하는 별도의 저장소가 아닙니다. 컴포넌트 트리를 통해 값을 제공하고 소비하는 메커니즘이며, `useState` 또는 `useReducer`와 결합하여 공유 상태를 구성할 수 있습니다.

## 2. Context API의 구성 요소

Context API를 사용하려면 다음 세 가지 요소를 이해해야 합니다.

| 구성 요소 | 역할 |
| --- | --- |
| `createContext` | Context 객체를 생성합니다. |
| Provider | 하위 컴포넌트에 Context 값을 제공합니다. |
| `useContext` | 하위 컴포넌트에서 Context 값을 읽고 구독합니다. |

일반적인 사용 흐름은 다음과 같습니다.

1. `createContext`로 Context 객체를 생성합니다.
2. Provider로 하위 컴포넌트를 감싸고 공유할 값을 전달합니다.
3. 하위 컴포넌트에서 `useContext`를 호출하여 값을 읽습니다.
4. Context 값이 변경되면 해당 Context를 사용하는 컴포넌트가 새로운 값을 반영합니다.

## 3. createContext

`createContext`는 새로운 Context 객체를 생성하는 React API입니다.

```tsx
import { createContext } from 'react';

type Theme = 'light' | 'dark';

export const ThemeContext = createContext<Theme>('light');
```

`createContext`는 컴포넌트 외부에서 호출해야 하며, 일반적으로 별도의 파일에 정의하여 여러 컴포넌트에서 공유합니다.

### 3.1. 기본값(Default Value)

`createContext`의 첫 번째 인수는 기본값입니다.

```tsx
const ThemeContext = createContext('light');
```

해당 Context를 제공하는 Provider가 상위 컴포넌트 트리에 존재하지 않는 경우 `useContext`는 이 기본값을 반환합니다.

기본값은 Provider가 없는 상황에서 사용하는 정적인 대체 값입니다. 이후 Provider에서 전달하는 값에 따라 변경되는 상태가 아닙니다.

예를 들어 다음과 같이 Context를 생성한 경우 기본값은 항상 `light`입니다.

```tsx
const ThemeContext = createContext('light');
```

Provider가 없으면 `useContext(ThemeContext)`는 `light`를 반환합니다.

반면 Provider가 존재하면 해당 Provider에서 전달한 값을 반환합니다.

### 3.2. 기본값으로 null 사용하기

의미 있는 기본값이 없거나 Provider가 반드시 존재해야 하는 Context라면 `null`을 기본값으로 사용할 수 있습니다.

```tsx
import { createContext } from 'react';

interface User {
  id: number;
  name: string;
}

export const UserContext = createContext<User | null>(null);
```

이 방식은 Provider가 누락된 상황을 명시적으로 확인하는 데 유용합니다.

## 4. Provider

Provider는 Context 값을 하위 컴포넌트에 제공하는 역할을 합니다.

Context 객체를 생성하는 것만으로는 동적인 값을 공유할 수 없습니다. 실제로 공유할 값을 Provider의 `value`에 전달해야 합니다.

### 4.1. React 19 이전 방식

React 18 이하에서는 Context 객체의 `.Provider`를 사용합니다.

```tsx
import { createContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}
```

`ThemeContext.Provider`로 감싼 하위 컴포넌트에서는 `dark` 값을 사용할 수 있습니다.

### 4.2. React 19 방식

React 19부터는 Context 객체 자체를 Provider로 사용할 수 있습니다.

```tsx
import { createContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}
```

React 19에서는 `<ThemeContext>`가 Provider 역할을 수행하므로 `.Provider`를 생략할 수 있습니다.

기존의 `<ThemeContext.Provider>` 방식도 계속 사용할 수 있습니다.

### 4.3. Provider의 범위

Context 값은 Provider가 감싸고 있는 하위 컴포넌트 트리에서만 사용할 수 있습니다.

```tsx
function App() {
  return (
    <>
      <ThemeContext value="dark">
        <Header />
        <Main />
      </ThemeContext>

      <Footer />
    </>
  );
}
```

이 구조에서는 `Header`와 `Main`이 `dark` 값을 사용할 수 있습니다.

반면 `Footer`는 해당 Provider의 하위 컴포넌트가 아니므로 Context의 기본값을 사용합니다.

Context는 컴포넌트 트리의 범위에 따라 제공되며, 애플리케이션 전체에서 자동으로 공유되는 전역 변수가 아닙니다.

### 4.4. 중첩 Provider

동일한 Context에 여러 Provider를 중첩할 수 있습니다.

이 경우 `useContext`는 컴포넌트 자신을 기준으로 가장 가까운 상위 Provider의 값을 반환합니다.

```tsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function Button() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Button</button>;
}

function App() {
  return (
    <ThemeContext value="dark">
      <Button />

      <ThemeContext value="light">
        <Button />
      </ThemeContext>
    </ThemeContext>
  );
}
```

첫 번째 `Button`은 `dark`를 사용하고, 두 번째 `Button`은 더 가까운 Provider에서 제공하는 `light`를 사용합니다.

이러한 특성은 특정 영역에만 다른 설정이나 환경을 적용할 때 유용합니다.

## 5. useContext

`useContext`는 컴포넌트에서 Context 값을 읽고 해당 값의 변경을 구독하는 React Hook입니다.

```tsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Button() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Button</button>;
}
```

`useContext`에 Context 객체를 전달하면 현재 컴포넌트 위쪽에서 가장 가까운 Provider의 값을 반환합니다.

상위에 Provider가 없다면 `createContext`에서 지정한 기본값을 반환합니다.

### 5.1. 가장 가까운 Provider 탐색

Context는 컴포넌트 트리에서 가장 가까운 상위 Provider를 기준으로 값을 결정합니다.

```tsx
function Toolbar() {
  return (
    <ThemeContext value="dark">
      <Panel />
    </ThemeContext>
  );
}

function Panel() {
  return <Button />;
}

function Button() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Button</button>;
}
```

`Button`과 Provider 사이에 `Panel`과 같은 중간 컴포넌트가 존재하더라도 Context 값을 읽을 수 있습니다.

중간 컴포넌트는 Context 값을 직접 전달하지 않아도 됩니다.

### 5.2. Provider와 useContext의 위치 관계

`useContext`는 호출하는 컴포넌트보다 위쪽에 위치한 Provider만 탐색합니다.

같은 컴포넌트에서 Provider를 반환하더라도 해당 Provider의 값을 읽을 수는 없습니다.

```tsx
function Button() {
  const theme = useContext(ThemeContext);

  return (
    <ThemeContext value="dark">
      <button className={theme}>Button</button>
    </ThemeContext>
  );
}
```

위 코드에서 `theme`은 현재 `Button` 컴포넌트 위쪽에 있는 Provider를 기준으로 결정됩니다. 반환하는 JSX 내부의 Provider는 해당 호출에 영향을 주지 않습니다.

Provider에서 제공하는 값을 사용하려면 Context를 소비하는 컴포넌트를 Provider의 하위 컴포넌트로 분리해야 합니다.

## 6. State와 Context 결합하기

Context API 자체는 상태를 변경하는 기능을 제공하지 않습니다.

동적으로 변경되는 공유 상태를 구성하려면 `useState` 또는 `useReducer`와 결합해야 합니다.

### 6.1. useState와 Context

다음 예제는 `useState`로 관리하는 테마 상태를 Context를 통해 하위 컴포넌트에 공유하는 구조입니다.

```tsx
import { createContext, useContext, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext value={{ theme, setTheme }}>
      {children}
    </ThemeContext>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const nextTheme = theme === 'light' ? 'dark' : 'light';

  return (
    <button onClick={() => setTheme(nextTheme)}>
      Current Theme: {theme}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemeButton />
    </ThemeProvider>
  );
}
```

이 구조에서는 다음과 같은 역할 분리가 이루어집니다.

- `ThemeProvider`: State를 소유하고 Context를 제공합니다.
- `ThemeContext`: 공유할 데이터와 변경 함수를 전달합니다.
- `useTheme`: Context 접근과 Provider 누락 검사를 추상화합니다.
- `ThemeButton`: Context를 소비하고 상태 변경을 요청합니다.

상태를 소유하는 컴포넌트와 상태를 사용하는 컴포넌트가 분리되므로 여러 하위 컴포넌트에서 동일한 상태를 공유할 수 있습니다.

### 6.2. useReducer와 Context

상태 구조가 복잡하거나 여러 종류의 상태 변경 로직이 필요한 경우 `useReducer`와 Context를 결합할 수 있습니다.

```tsx
import {
  createContext,
  useContext,
  useReducer,
} from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number };

function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Date.now(),
          text: action.text,
          completed: false,
        },
      ];

    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );

    default:
      return state;
  }
}

const TodoStateContext = createContext<Todo[] | null>(null);
const TodoDispatchContext = createContext<React.Dispatch<Action> | null>(null);

function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, dispatch] = useReducer(todoReducer, []);

  return (
    <TodoStateContext value={todos}>
      <TodoDispatchContext value={dispatch}>
        {children}
      </TodoDispatchContext>
    </TodoStateContext>
  );
}

function useTodos() {
  const context = useContext(TodoStateContext);

  if (context === null) {
    throw new Error('useTodos must be used within TodoProvider');
  }

  return context;
}

function useTodoDispatch() {
  const context = useContext(TodoDispatchContext);

  if (context === null) {
    throw new Error('useTodoDispatch must be used within TodoProvider');
  }

  return context;
}

function TodoList() {
  const todos = useTodos();
  const dispatch = useTodoDispatch();

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() =>
                dispatch({ type: 'TOGGLE_TODO', id: todo.id })
              }
            />
            {todo.text}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

이 방식에서는 상태와 상태 변경 로직을 `useReducer`로 관리하고, Context를 통해 하위 컴포넌트에 전달합니다.

또한 State와 Dispatch를 서로 다른 Context로 분리하여 상태를 읽는 컴포넌트와 변경 함수만 사용하는 컴포넌트의 의존성을 구분할 수 있습니다.

## 7. Context의 렌더링 특성

Context는 값을 제공하는 것뿐 아니라 해당 값을 구독하는 컴포넌트의 렌더링에도 영향을 줍니다.

### 7.1. Context 값 변경과 렌더링

Provider에 전달한 `value`가 이전 값과 달라지면 해당 Context를 사용하는 하위 컴포넌트는 새로운 값을 반영하도록 다시 렌더링됩니다.

React는 이전 값과 새로운 값을 `Object.is` 비교로 판단합니다.

```tsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={theme}>
      <ThemeButton />

      <button
        onClick={() =>
          setTheme((previous) =>
            previous === 'light' ? 'dark' : 'light'
          )
        }
      >
        Toggle Theme
      </button>
    </ThemeContext>
  );
}

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Theme: {theme}</button>;
}
```

`theme`이 변경되면 `ThemeButton`은 새로운 Context 값을 반영합니다.

Context를 소비하지 않는 중간 컴포넌트가 Context 값 변경만으로 반드시 다시 렌더링되는 것은 아닙니다. 실제 렌더링 여부는 해당 컴포넌트의 Props, State, 부모 컴포넌트의 렌더링 등 다른 조건에도 영향을 받습니다.

### 7.2. 객체와 함수 전달 시 주의사항

Context에는 문자열, 숫자뿐 아니라 객체와 함수도 전달할 수 있습니다.

다만 Provider의 `value`에 새로운 객체를 매 렌더링마다 생성하면 실제 데이터가 변경되지 않았더라도 참조가 달라질 수 있습니다.

```tsx
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext
      value={{
        theme,
        setTheme,
      }}
    >
      <Page />
    </ThemeContext>
  );
}
```

위 코드에서 `App`이 다시 렌더링될 때마다 새로운 객체가 생성됩니다.

React는 이전 객체와 새로운 객체의 참조가 다르다고 판단하므로 해당 Context를 사용하는 컴포넌트도 새로운 값을 반영하기 위해 다시 렌더링될 수 있습니다.

불필요한 Context 값 변경을 줄이려면 `useMemo`와 `useCallback`을 활용할 수 있습니다.

```tsx
import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from 'react';

interface ThemeContextValue {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme((previous) =>
      previous === 'light' ? 'dark' : 'light'
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
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  );
}
```

이렇게 하면 `theme`이 변경되지 않았을 때 불필요하게 새로운 Context 객체를 생성하는 상황을 줄일 수 있습니다.

다만 `useMemo`와 `useCallback`은 성능 최적화 도구이므로 모든 Context에 무조건 적용할 필요는 없습니다.

### 7.3. React.memo와 Context

`React.memo`는 Props가 변경되지 않은 컴포넌트의 불필요한 렌더링을 줄이는 데 사용됩니다.

그러나 Context를 직접 구독하는 컴포넌트는 Context 값이 변경되면 `React.memo`로 감싸져 있더라도 새로운 값을 반영하기 위해 다시 렌더링됩니다.

```tsx
import { memo, useContext } from 'react';

const ThemeContext = createContext('light');

const ThemeButton = memo(function ThemeButton() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Button</button>;
});
```

`ThemeButton`의 Props가 변경되지 않았더라도 구독 중인 Context 값이 변경되면 다시 렌더링됩니다.

따라서 `React.memo`만으로 Context 변경에 따른 렌더링을 차단할 수는 없습니다.

## 8. Context API 사용 기준

Context API는 모든 상태를 전역화하기 위한 수단이 아닙니다. 데이터가 필요한 컴포넌트의 위치와 공유 범위를 고려하여 사용하는 것이 좋습니다.

### 8.1. Context 사용이 적절한 경우

다음과 같이 여러 컴포넌트에서 공통으로 사용하는 데이터를 전달할 때 적합합니다.

- 테마 설정: 다크 모드, 라이트 모드
- 인증 정보: 현재 로그인한 사용자
- 언어 설정: 다국어 지원을 위한 Locale
- UI 설정: 화면 밀도, 접근성 설정
- 애플리케이션 설정: 공통 환경 설정
- 컴포넌트 그룹의 상태: 특정 UI 영역에서 공유하는 선택 상태

### 8.2. Props 전달이 더 적절한 경우

다음과 같은 상황에서는 Context보다 Props를 사용하는 편이 명확할 수 있습니다.

- 부모와 자식 사이의 전달 단계가 적은 경우
- 특정 컴포넌트에서만 사용하는 데이터인 경우
- 데이터의 의존성을 명시적으로 표현해야 하는 경우
- 컴포넌트 재사용성과 독립성이 중요한 경우

Props는 컴포넌트가 어떤 데이터에 의존하는지 명확하게 드러내므로 컴포넌트의 인터페이스를 이해하기 쉽습니다.

### 8.3. children을 활용한 컴포넌트 구조 개선

Props Drilling이 발생하는 원인이 반드시 Context의 부재 때문인 것은 아닙니다.

중간 컴포넌트가 실제로 데이터를 사용하지 않고 하위 컴포넌트로 전달만 한다면 `children`을 활용하여 컴포넌트 구조를 개선할 수 있습니다.

```tsx
function Layout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Layout>
      <Profile user={user} />
    </Layout>
  );
}
```

이 방식에서는 `Layout`이 사용자 정보에 직접 의존하지 않습니다.

데이터가 필요한 컴포넌트를 상위에서 구성하고 JSX를 `children`으로 전달하면 중간 컴포넌트가 불필요한 Props를 전달하지 않아도 됩니다.

## 9. Context API 사용 시 주의사항

### 9.1. Context 남용 방지

여러 컴포넌트에서 사용한다는 이유만으로 모든 데이터를 Context로 관리할 필요는 없습니다.

Context를 지나치게 많이 사용하면 컴포넌트의 데이터 의존성이 명시적으로 드러나지 않아 구조를 이해하기 어려워질 수 있습니다.

데이터의 실제 사용 범위가 좁다면 Props를 사용하는 것이 더 적절합니다.

### 9.2. Context 분리

하나의 Context에 서로 관련이 적은 여러 데이터를 함께 저장하면 일부 데이터만 변경되어도 동일한 Context를 구독하는 컴포넌트에 영향을 줄 수 있습니다.

```tsx
interface AppContextValue {
  theme: string;
  user: User | null;
  locale: string;
  notifications: Notification[];
}
```

위와 같이 여러 종류의 데이터를 하나의 Context에서 관리하기보다는 데이터의 목적과 변경 빈도에 따라 분리하는 방법을 고려할 수 있습니다.

```tsx
const ThemeContext = createContext<Theme | null>(null);
const UserContext = createContext<User | null>(null);
const LocaleContext = createContext<string>('ko');
```

다만 Context를 지나치게 잘게 분리하면 Provider 구성이 복잡해질 수 있으므로 실제 사용 범위와 변경 특성을 고려해야 합니다.

### 9.3. Provider의 위치 결정

Provider를 애플리케이션 최상단에 배치하면 넓은 범위에서 Context를 사용할 수 있지만, 모든 데이터를 반드시 최상단에서 관리할 필요는 없습니다.

특정 화면이나 컴포넌트 그룹에서만 사용하는 상태라면 해당 영역에 Provider를 배치하는 것이 적절합니다.

Provider의 범위를 좁히면 상태의 소유권과 사용 범위를 명확하게 유지할 수 있습니다.

### 9.4. Server State와 Client State 구분

Context API는 주로 React 컴포넌트 트리에서 공유할 Client State를 전달하는 데 사용합니다.

서버에서 가져온 데이터의 캐싱, 재검증, 동기화, 요청 상태 관리까지 Context로 직접 구현하는 것은 별도의 복잡성을 유발할 수 있습니다.

서버 데이터 관리가 필요한 경우에는 TanStack Query와 같은 Server State 관리 도구를 고려할 수 있습니다.

Context API와 Server State 관리 도구는 서로 대체 관계가 아니라 서로 다른 문제를 해결하는 도구입니다.

## 10. Context API와 External State Management 비교

Context API와 Zustand, Redux Toolkit 등의 상태 관리 도구는 모두 여러 컴포넌트에서 데이터를 공유하는 데 활용할 수 있지만 내부 동작과 제공하는 기능에는 차이가 있습니다.

| 구분 | Context API | External State Management |
| --- | --- | --- |
| 주요 목적 | 컴포넌트 트리에 값 전달 | 공유 상태 관리 |
| 상태 저장 | 자체적으로 상태를 저장하지 않음 | 외부 Store 또는 별도 상태 모델 사용 |
| 상태 변경 | `useState`, `useReducer` 등과 결합 | 각 라이브러리의 API 사용 |
| 데이터 접근 | Provider 하위 컴포넌트에서 접근 | 라이브러리의 구독 API 등을 통해 접근 |
| 렌더링 최적화 | Context 값 변경을 구독하는 컴포넌트 중심 | 라이브러리에 따라 선택적 구독 지원 |
| 주요 활용 | 테마, 인증 정보, 설정 | 복잡한 전역 상태, 도메인 상태 |

대표적인 상태 관리 도구는 다음과 같습니다.

- **Zustand**: 간결한 API와 선택적 구독을 지원하는 상태 관리 라이브러리입니다.
- **Redux Toolkit**: Redux 기반 애플리케이션의 상태 관리 로직을 표준화하고 단순화하는 도구입니다.
- **Jotai**: Atom 단위로 상태를 구성하고 구독하는 방식의 상태 관리 라이브러리입니다.
- **MobX**: Observable 기반의 반응형 상태 관리 라이브러리입니다.

Context API만으로 충분한 경우 별도의 상태 관리 라이브러리를 도입할 필요는 없습니다. 반면 상태의 규모와 복잡성이 커지고 세밀한 구독이나 상태 관리 기능이 필요하다면 외부 라이브러리를 고려할 수 있습니다.

## 11. 정리

Context API는 React 컴포넌트 트리에서 상위 컴포넌트가 하위 컴포넌트에 데이터를 전달할 수 있도록 지원하는 기능입니다.

Props Drilling을 줄이고 여러 컴포넌트에서 공통으로 사용하는 데이터를 공유할 때 유용합니다.

핵심 개념은 다음과 같습니다.

- `createContext`로 Context 객체를 생성합니다.
- Provider의 `value`를 통해 하위 컴포넌트에 데이터를 제공합니다.
- `useContext`로 가장 가까운 상위 Provider의 값을 읽고 구독합니다.
- React 19부터는 `<Context>`를 Provider로 사용할 수 있으며, 이전 버전에서는 `<Context.Provider>`를 사용합니다.
- Context 자체는 상태 저장소가 아니므로 동적인 상태 관리에는 `useState` 또는 `useReducer`와 결합합니다.
- Context 값이 변경되면 해당 Context를 구독하는 컴포넌트가 새로운 값을 반영합니다.
- 객체와 함수를 Context로 전달할 때는 참조 변경에 따른 렌더링을 고려해야 합니다.
- Context를 사용하기 전에 Props 전달이나 `children`을 활용한 컴포넌트 구조 개선을 고려합니다.
- 복잡한 상태 관리가 필요하다면 External State Management 도구를 검토할 수 있습니다.

Context API는 컴포넌트 간 데이터 전달 구조를 단순화하는 기능입니다. 데이터의 공유 범위와 변경 특성을 고려하여 적절한 위치에 Provider를 배치하고, 필요한 상태만 Context를 통해 공유하는 것이 중요합니다.

## 참고자료

### React 공식 문서

- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [createContext](https://react.dev/reference/react/createContext)
- [useContext](https://react.dev/reference/react/useContext)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Managing State](https://react.dev/learn/managing-state)
- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### 상태 관리 라이브러리

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Jotai](https://jotai.org/)
- [MobX](https://mobx.js.org/README.html)
- [TanStack Query](https://tanstack.com/query/latest)

### 관련 개념

- [State Structure](./state-structure.md)
- [Lifting State Up](./lifting-state-up.md)
- [Sharing State](./sharing-state.md)
- [Derived State](./derived-state.md)