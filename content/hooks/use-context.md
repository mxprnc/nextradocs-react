# useContext

## 1. useContext란?

`useContext`는 React Context에 저장된 값을 컴포넌트에서 읽을 수 있도록 제공하는 Hook입니다.

일반적으로 React에서는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달할 때 Props를 사용합니다. 하지만 여러 단계에 걸쳐 데이터를 전달해야 하거나, 컴포넌트 트리의 여러 위치에서 동일한 데이터를 공유해야 하는 경우 Props 전달이 복잡해질 수 있습니다.

이러한 문제를 Props Drilling이라고 합니다.

`useContext`는 Context를 통해 컴포넌트 트리의 상위에서 제공한 값을 하위 컴포넌트가 직접 읽을 수 있도록 하여 Props Drilling을 줄여줍니다.

대표적인 사용 사례는 다음과 같습니다.

- 테마 설정(Theme)
- 사용자 인증 정보(Authentication)
- 언어 및 지역 설정(Localization)
- 애플리케이션 전역 설정(Configuration)
- 현재 선택된 메뉴나 탭 정보
- 여러 컴포넌트에서 공유하는 UI 상태

Context는 컴포넌트 간 데이터를 공유하기 위한 메커니즘이며, 그 자체가 상태 관리 기능을 제공하는 것은 아닙니다. State와 함께 사용하면 변경 가능한 공유 데이터를 관리할 수 있습니다.

## 2. 기본 문법

`useContext`는 Context 객체를 인자로 전달받아 가장 가까운 상위 Provider가 제공하는 값을 반환합니다.

```tsx
const value = useContext(SomeContext);
```

- `SomeContext`: `createContext`로 생성한 Context 객체입니다.
- `value`: 가장 가까운 상위 Provider가 전달한 값입니다.

Context가 제공하는 값이 없으면 `createContext`에서 지정한 기본값(Default Value)을 반환합니다.

### 2.1. Context 생성

Context는 `createContext`를 사용하여 생성합니다.

```tsx
import { createContext } from 'react';

type Theme = 'light' | 'dark';

export const ThemeContext = createContext<Theme>('light');
```

`createContext`는 Context 객체를 반환합니다.

Context 객체는 Provider와 Consumer가 공유할 데이터의 통로 역할을 수행합니다.

### 2.2. Provider를 통한 값 제공

Context를 사용하는 하위 컴포넌트가 값을 읽을 수 있도록 상위 컴포넌트에서 Provider를 지정해야 합니다.

React 19 이전에는 `.Provider`를 사용했습니다.

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

React 19부터는 Context 객체 자체를 Provider로 사용할 수 있습니다.

```tsx
function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}
```

두 방식 모두 하위 컴포넌트에 동일한 Context 값을 제공합니다.

기존 `.Provider` 방식도 계속 지원되지만, React 19에서는 Context 객체 자체를 Provider로 사용하는 방식을 권장합니다.

### 2.3. useContext로 값 읽기

하위 컴포넌트에서는 `useContext`를 호출하여 상위 Provider의 값을 읽을 수 있습니다.

```tsx
import { useContext } from 'react';

function Page() {
  const theme = useContext(ThemeContext);

  return <div className={theme}>현재 테마: {theme}</div>;
}
```

`Page` 컴포넌트는 Props를 전달받지 않아도 상위 Provider에서 제공한 `theme` 값을 사용할 수 있습니다.

전체 구조는 다음과 같습니다.

```tsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}

function Page() {
  return <Header />;
}

function Header() {
  const theme = useContext(ThemeContext);

  return <h1>현재 테마: {theme}</h1>;
}
```

`App`에서 `Header`까지 Props를 전달하지 않아도 Context를 통해 값을 공유할 수 있습니다.

## 3. Context의 동작 원리

Context는 컴포넌트 트리를 따라 상위 Provider가 제공한 값을 하위 Consumer에 전달합니다.

`useContext`를 호출한 컴포넌트는 자신을 기준으로 가장 가까운 상위 Provider를 탐색하여 값을 읽습니다.

### 3.1. 가장 가까운 Provider 사용

동일한 Context Provider가 중첩되어 있다면 가장 가까운 Provider의 값을 사용합니다.

```tsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}

function Page() {
  return (
    <ThemeContext value="light">
      <Header />
    </ThemeContext>
  );
}

function Header() {
  const theme = useContext(ThemeContext);

  return <div>{theme}</div>;
}
```

위 구조에서 `Header`는 가장 가까운 `Page`의 Provider가 제공하는 `light`를 반환합니다.

상위 Provider의 값이 `dark`이더라도 더 가까운 Provider가 존재하면 해당 값이 우선합니다.

### 3.2. Provider가 없는 경우

컴포넌트 상위에 해당 Context의 Provider가 없다면 `createContext`에서 지정한 기본값을 반환합니다.

```tsx
const ThemeContext = createContext('light');

function Header() {
  const theme = useContext(ThemeContext);

  return <div>{theme}</div>;
}
```

위 컴포넌트는 상위에 Provider가 없으므로 `light`를 반환합니다.

기본값은 Provider가 존재하지 않을 때 사용하는 정적 대체값입니다.

Provider가 존재하지만 `value`로 `undefined`를 전달했다면 기본값이 아니라 `undefined`가 반환됩니다.

```tsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext value={undefined}>
      <Header />
    </ThemeContext>
  );
}
```

이 경우 `Header`에서 반환되는 값은 `light`가 아니라 `undefined`입니다.

### 3.3. 같은 컴포넌트에서 선언한 Provider

Provider는 해당 컴포넌트 자체가 아니라 하위 컴포넌트에 값을 제공합니다.

따라서 같은 컴포넌트에서 Provider를 반환하더라도 Provider가 선언되기 전의 `useContext` 호출에는 영향을 주지 않습니다.

잘못된 예:

```tsx
function App() {
  const theme = useContext(ThemeContext);

  return (
    <ThemeContext value="dark">
      <Page />
    </ThemeContext>
  );
}
```

`App`의 `useContext`는 `App` 자신을 감싸는 가장 가까운 상위 Provider를 탐색합니다.

반환할 JSX 내부에 선언한 Provider는 `App`의 Context 값을 변경하지 않습니다.

## 4. createContext와 useContext

`createContext`와 `useContext`는 서로 다른 역할을 수행합니다.

| 구분 | createContext | useContext |
| --- | --- | --- |
| 역할 | Context 객체 생성 | Context 값 읽기 |
| 호출 위치 | 일반적으로 모듈 최상위 | 컴포넌트 또는 Custom Hook |
| 주요 인자 | 기본값 | Context 객체 |
| 반환값 | Context 객체 | Provider가 제공한 값 또는 기본값 |

일반적으로 Context 객체는 별도 모듈에서 생성하고, Provider와 Consumer에서 동일한 객체를 import하여 사용합니다.

```tsx
// ThemeContext.ts
import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export const ThemeContext = createContext<Theme>('light');
```

```tsx
// Header.tsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function Header() {
  const theme = useContext(ThemeContext);

  return <header className={theme}>Header</header>;
}
```

Context 객체를 생성하는 모듈과 사용하는 컴포넌트를 분리하면 재사용성과 의존성 관리 측면에서 유리합니다.

## 5. State와 함께 사용하는 Context

Context는 기본적으로 값을 전달하는 기능만 제공하므로, 값이 변경되어야 하는 경우에는 일반적으로 `useState` 또는 `useReducer`와 함께 사용합니다.

Provider에서 State와 State 변경 함수를 함께 전달하면 하위 컴포넌트에서 공유 상태를 읽고 변경할 수 있습니다.

```tsx
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  function toggleTheme() {
    setTheme(current =>
      current === 'light' ? 'dark' : 'light',
    );
  }

  return (
    <ThemeContext
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext>
  );
}

function Header() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeProvider가 필요합니다.');
  }

  const { theme, toggleTheme } = context;

  return (
    <header className={theme}>
      <span>현재 테마: {theme}</span>
      <button onClick={toggleTheme}>
        테마 변경
      </button>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}
```

위 예제의 데이터 흐름은 다음과 같습니다.

1. `ThemeProvider`에서 `useState`로 테마 상태를 관리합니다.
2. Provider를 통해 `theme`과 `toggleTheme`을 하위 컴포넌트에 전달합니다.
3. `Header`에서 `useContext`로 Context 값을 읽습니다.
4. `toggleTheme`을 호출하면 Provider의 State가 변경됩니다.
5. 변경된 Context 값을 사용하는 Consumer가 다시 렌더링됩니다.

이러한 구조를 사용하면 여러 컴포넌트가 동일한 상태와 변경 함수를 공유할 수 있습니다.

## 6. TypeScript와 Context

TypeScript에서는 Context가 제공하는 값의 타입을 명확하게 지정하는 것이 중요합니다.

### 6.1. 기본값을 사용하는 방법

Context의 기본값을 명확하게 지정할 수 있는 경우에는 제네릭 타입을 활용합니다.

```tsx
type Theme = 'light' | 'dark';

const ThemeContext = createContext<Theme>('light');
```

이 경우 `useContext(ThemeContext)`의 반환 타입은 `Theme`으로 추론됩니다.

### 6.2. null을 기본값으로 사용하는 방법

Provider가 반드시 필요하고 기본값이 적절하지 않은 경우에는 `null`을 기본값으로 지정할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

const UserContext = createContext<User | null>(null);
```

Context를 사용하는 컴포넌트에서는 `null` 여부를 검사해야 합니다.

```tsx
function UserProfile() {
  const user = useContext(UserContext);

  if (user === null) {
    return <p>로그인이 필요합니다.</p>;
  }

  return <p>{user.name}</p>;
}
```

이 방식은 Provider가 누락된 상황을 명시적으로 처리할 수 있다는 장점이 있습니다.

### 6.3. Custom Hook으로 Provider 사용 강제하기

Context를 사용할 때마다 `null` 검사를 반복하는 대신 Custom Hook을 만들어 Provider 사용을 강제할 수 있습니다.

```tsx
const UserContext = createContext<User | null>(null);

export function useUser() {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error('useUser는 UserProvider 내부에서 사용해야 합니다.');
  }

  return context;
}
```

Consumer에서는 다음과 같이 사용할 수 있습니다.

```tsx
function UserProfile() {
  const user = useUser();

  return <p>{user.name}</p>;
}
```

이 방식은 Context 접근 로직을 추상화하고, Provider가 누락된 상황을 일관되게 처리할 수 있도록 합니다.

### 6.4. Context에 함수 타입 정의하기

State와 함께 함수를 전달하는 경우에는 함수의 매개변수와 반환 타입을 명확하게 지정해야 합니다.

```tsx
type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
```

Context가 제공하는 값의 타입을 별도로 정의하면 Provider와 Consumer 양쪽에서 타입 안정성을 확보할 수 있습니다.

## 7. Context 값 변경과 렌더링

Context Provider가 제공하는 값이 변경되면 해당 Context를 사용하는 하위 컴포넌트가 다시 렌더링됩니다.

React는 이전 Provider 값과 새로운 Provider 값을 `Object.is`로 비교합니다.

두 값이 다르면 해당 Context를 사용하는 Consumer에 변경 사항이 전달됩니다.

### 7.1. Context 값 변경

```tsx
const ThemeContext = createContext('light');

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext value={theme}>
      {children}
    </ThemeContext>
  );
}
```

`theme`이 변경되면 Provider의 Context 값도 변경됩니다.

해당 Context를 읽는 하위 컴포넌트는 새로운 값을 전달받기 위해 다시 렌더링됩니다.

### 7.2. 객체 Context 값과 불필요한 렌더링

Context Provider에 객체를 전달하는 경우 객체의 참조가 변경되는지 주의해야 합니다.

```tsx
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext>
  );
}
```

위 코드에서는 Provider가 다시 렌더링될 때마다 새로운 객체가 생성됩니다.

객체의 내용이 동일하더라도 참조가 달라지면 `Object.is` 비교 결과가 달라지므로 Context Consumer가 다시 렌더링될 수 있습니다.

`useMemo`와 `useCallback`을 사용하면 불필요한 참조 변경을 줄일 수 있습니다.

```tsx
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((nextUser: User) => {
    setUser(nextUser);
  }, []);

  const value = useMemo(() => ({
    user,
    login,
  }), [user, login]);

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}
```

이제 `user` 또는 `login`이 변경되지 않으면 Context 값의 참조도 유지됩니다.

다만 `useMemo`와 `useCallback`은 성능 최적화를 위한 기능이지 Context의 정확성을 보장하기 위한 필수 요소는 아닙니다.

### 7.3. Context 변경과 React.memo

`React.memo`는 Props가 변경되지 않은 컴포넌트의 불필요한 렌더링을 줄이는 데 사용됩니다.

그러나 Context 값이 변경되면 해당 Context를 직접 읽는 컴포넌트는 `React.memo`로 감싸져 있더라도 다시 렌더링됩니다.

```tsx
const ThemeContext = createContext('light');

const Header = memo(function Header() {
  const theme = useContext(ThemeContext);

  return <header>{theme}</header>;
});
```

`Header`가 `memo`로 최적화되어 있더라도 `ThemeContext`의 값이 변경되면 다시 렌더링됩니다.

`React.memo`는 Context 업데이트를 차단하는 기능이 아닙니다.

## 8. Context 성능 최적화

Context는 컴포넌트 트리의 여러 위치에서 값을 공유하기 편리하지만, 하나의 Context에 많은 데이터를 넣으면 불필요한 렌더링이 발생할 수 있습니다.

다음과 같은 상황에서 성능 문제가 나타날 수 있습니다.

- 변경 빈도가 높은 상태와 변경 빈도가 낮은 상태를 하나의 Context에 포함하는 경우
- 서로 관련이 없는 여러 상태를 하나의 Context에서 관리하는 경우
- Provider가 렌더링될 때마다 새로운 객체를 전달하는 경우
- Context를 사용하는 Consumer가 지나치게 많은 경우

### 8.1. Context 분리

서로 다른 목적의 데이터를 하나의 Context에서 관리하기보다 역할에 따라 분리할 수 있습니다.

```tsx
const ThemeContext = createContext<Theme>('light');

const AuthContext = createContext<User | null>(null);

const LocaleContext = createContext('ko');
```

각 Consumer는 필요한 Context만 구독하므로 관련 없는 Context 값의 변경으로 인한 렌더링을 줄일 수 있습니다.

### 8.2. State Context와 Dispatch Context 분리

`useReducer`를 사용하는 경우 State와 Dispatch를 별도의 Context로 분리할 수 있습니다.

```tsx
type State = {
  count: number;
};

type Action = {
  type: 'increment' | 'decrement';
};

const StateContext = createContext<State | null>(null);

const DispatchContext = createContext<React.Dispatch<Action> | null>(null);

function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <StateContext value={state}>
      <DispatchContext value={dispatch}>
        {children}
      </DispatchContext>
    </StateContext>
  );
}
```

State를 읽는 컴포넌트와 Dispatch만 사용하는 컴포넌트를 구분할 수 있습니다.

`useReducer`의 Dispatch 함수는 안정적인 참조를 유지하므로 State가 변경되더라도 Dispatch Context의 값은 변경되지 않습니다.

따라서 Dispatch Context만 사용하는 컴포넌트는 해당 Context의 변경으로 인해 다시 렌더링되지 않습니다.

다만 부모 컴포넌트의 렌더링이나 Props 변경 등 다른 이유로 렌더링될 수는 있습니다.

### 8.3. Context와 컴포넌트 분리

Context를 직접 읽는 컴포넌트와 실제 UI를 렌더링하는 컴포넌트를 분리할 수 있습니다.

```tsx
function Header() {
  const theme = useContext(ThemeContext);

  return <HeaderView theme={theme} />;
}

const HeaderView = memo(function HeaderView({
  theme,
}: {
  theme: Theme;
}) {
  return <header className={theme}>Header</header>;
});
```

이 구조에서는 Context를 읽는 컴포넌트가 변경 사항을 전달받고, 실제 UI 컴포넌트는 Props가 변경되지 않으면 렌더링을 생략할 수 있습니다.

다만 Context 값이 실제로 변경되면 해당 값을 전달받는 UI 컴포넌트도 다시 렌더링됩니다.

### 8.4. Context는 세밀한 구독 기능을 제공하지 않습니다

Context는 Provider의 값이 변경되면 해당 Context를 사용하는 Consumer에 변경 사항을 전달합니다.

Consumer가 객체의 특정 필드만 사용하더라도 해당 필드만 선택적으로 구독하는 기능은 기본적으로 제공하지 않습니다.

예를 들어 다음 Context가 있다고 가정합니다.

```tsx
type AppContextValue = {
  user: User | null;
  theme: Theme;
  notifications: Notification[];
};
```

어떤 컴포넌트가 `theme`만 사용하더라도 Context 전체 값이 변경되면 해당 Consumer는 다시 렌더링될 수 있습니다.

상태가 복잡하거나 업데이트 빈도가 높은 경우에는 다음과 같은 방법을 고려할 수 있습니다.

- Context를 역할별로 분리합니다.
- State와 Dispatch를 분리합니다.
- 컴포넌트 구조를 조정하여 Context 구독 범위를 줄입니다.
- 외부 상태 관리 라이브러리의 선택적 구독 기능을 활용합니다.

## 9. Context와 Props 비교

Context와 Props는 모두 컴포넌트에 데이터를 전달하는 기능이지만 사용 목적과 데이터 전달 방식에 차이가 있습니다.

| 구분 | Props | Context |
| --- | --- | --- |
| 데이터 전달 | 부모에서 자식으로 명시적 전달 | Provider에서 하위 Consumer로 전달 |
| 전달 범위 | 직접적인 자식 관계 중심 | 컴포넌트 트리의 하위 범위 |
| Props Drilling | 여러 단계에서 전달할 수 있음 | 중간 컴포넌트의 전달 과정 생략 가능 |
| 데이터 의존성 | 컴포넌트 인터페이스에 명시적 | Context 사용을 통해 암묵적으로 연결 |
| 주요 용도 | 컴포넌트 간 명시적인 데이터 전달 | 여러 하위 컴포넌트가 공유하는 데이터 |

Props는 컴포넌트의 입력과 의존성을 명확하게 표현할 수 있다는 장점이 있습니다.

Context는 여러 하위 컴포넌트에서 공통으로 필요한 데이터를 전달하는 데 적합합니다.

모든 Props 전달을 Context로 대체하기보다는 데이터의 사용 범위와 컴포넌트 구조에 따라 적절한 방식을 선택해야 합니다.

## 10. Context와 다른 상태 관리 방식 비교

Context는 React가 제공하는 데이터 전달 메커니즘입니다.

State와 결합하여 공유 상태를 관리할 수 있지만, Redux나 Zustand와 같은 상태 관리 라이브러리와는 목적과 기능에 차이가 있습니다.

| 구분 | Context | useState / useReducer | 외부 상태 관리 라이브러리 |
| --- | --- | --- | --- |
| 주요 역할 | 하위 컴포넌트에 값 전달 | 상태 생성 및 변경 | 공유 상태 관리 |
| 상태 저장 | 자체적으로 상태를 저장하지 않음 | React 컴포넌트 내부 | 라이브러리 Store |
| 공유 범위 | Provider 하위 트리 | 해당 컴포넌트 및 전달받은 하위 컴포넌트 | 라이브러리 설계에 따름 |
| 업데이트 방식 | Provider 값 변경 | State 업데이트 | Store 업데이트 |
| 선택적 구독 | 기본적으로 지원하지 않음 | 해당 없음 | 라이브러리별 지원 |
| 주요 용도 | 공유 데이터 전달 | 컴포넌트 상태 관리 | 복잡한 전역 상태 관리 |

Context와 State는 서로 대체하는 개념이 아닙니다.

일반적으로 Context는 State를 여러 컴포넌트에 전달하는 역할을 수행하고, 실제 상태 변경은 `useState` 또는 `useReducer`가 담당합니다.

상태의 복잡도와 업데이트 빈도가 높아지면 외부 상태 관리 라이브러리를 고려할 수 있습니다.

## 11. Context 사용 시 주의사항

### 11.1. Context를 전역 변수처럼 사용하지 않습니다

Context는 애플리케이션 어디서나 접근할 수 있는 전역 변수가 아닙니다.

Provider가 존재하는 컴포넌트 하위 트리에서만 해당 값을 읽을 수 있습니다.

컴포넌트 트리의 범위에 따라 Context 접근 가능 여부가 달라집니다.

### 11.2. 불필요하게 많은 Context를 생성하지 않습니다

Context를 지나치게 많이 생성하면 Provider 구조가 복잡해질 수 있습니다.

데이터의 변경 주기, 사용 범위, 책임에 따라 적절하게 분리해야 합니다.

### 11.3. Context에 너무 많은 책임을 부여하지 않습니다

하나의 Context에서 인증, UI 상태, 데이터 캐싱, 네트워크 요청 등을 모두 관리하면 컴포넌트 간 결합도가 높아질 수 있습니다.

Context는 데이터 전달에 집중하고 상태 관리 및 비즈니스 로직은 적절한 계층으로 분리하는 것이 좋습니다.

### 11.4. Context 객체의 동일성을 유지합니다

Provider와 Consumer는 동일한 Context 객체를 참조해야 합니다.

동일한 Context 모듈이 중복 번들링되거나 서로 다른 모듈 경로에서 별개의 Context 객체가 생성되면 Provider와 Consumer가 연결되지 않을 수 있습니다.

따라서 Context 객체는 공통 모듈에서 생성하고 일관된 경로로 import하는 것이 좋습니다.

### 11.5. Context와 보안 경계를 혼동하지 않습니다

Context는 컴포넌트 간 데이터를 전달하는 기능이지 접근 제어 또는 보안 기능이 아닙니다.

인증 정보를 Context에 저장하더라도 실제 API 서버에서 사용자 권한과 접근 권한을 검증해야 합니다.

클라이언트에 전달된 값은 사용자가 확인하거나 변경할 수 있으므로 보안 경계로 사용해서는 안 됩니다.

## 12. useContext 사용 원칙

`useContext`를 안정적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **공유 범위가 명확한 데이터를 전달합니다.** 여러 하위 컴포넌트에서 공통으로 사용하는 테마, 인증 정보, 언어 설정 등에 적합합니다.
2. **Context와 State의 역할을 구분합니다.** Context는 값을 전달하고, State와 Reducer는 변경 가능한 상태를 관리합니다.
3. **가장 가까운 Provider의 값을 사용한다는 점을 이해합니다.** 중첩 Provider가 존재하면 가장 가까운 Provider가 우선합니다.
4. **기본값을 명확하게 지정합니다.** Provider가 누락된 경우의 동작을 고려하고 필요한 경우 `null`과 Custom Hook을 활용합니다.
5. **Context 값의 참조 변경에 주의합니다.** 객체나 함수를 전달할 때 불필요한 재렌더링이 발생하지 않도록 관리합니다.
6. **Context를 역할에 따라 분리합니다.** 서로 관련이 없거나 변경 주기가 다른 데이터는 별도 Context로 관리하는 것이 좋습니다.
7. **Props를 무조건 Context로 대체하지 않습니다.** 컴포넌트의 입력과 의존성을 명시적으로 표현해야 하는 경우에는 Props가 더 적합합니다.
8. **성능 최적화는 실제 병목을 기준으로 수행합니다.** Context 분리, `useMemo`, `useCallback`, 컴포넌트 분리 등을 필요에 따라 적용합니다.
9. **보안 기능으로 사용하지 않습니다.** Context에 전달된 데이터는 클라이언트 측 데이터이므로 서버의 권한 검증을 대체할 수 없습니다.

## 참고 자료

### React 공식 문서

- [useContext – React API Reference](https://react.dev/reference/react/useContext)
- [createContext – React API Reference](https://react.dev/reference/react/createContext)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [useReducer – React API Reference](https://react.dev/reference/react/useReducer)
- [useMemo – React API Reference](https://react.dev/reference/react/useMemo)
- [useCallback – React API Reference](https://react.dev/reference/react/useCallback)
- [memo – React API Reference](https://react.dev/reference/react/memo)

### TypeScript 공식 문서

- [TypeScript – React Documentation](https://react.dev/learn/typescript)