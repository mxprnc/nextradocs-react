# Component Testing

## 1. 개요

컴포넌트 테스트(Component Testing)는 React 컴포넌트가 주어진 Props와 사용자 상호작용에 따라 의도한 UI를 렌더링하고 정상적으로 동작하는지 검증하는 테스트입니다.

React 애플리케이션은 여러 컴포넌트가 결합되어 UI를 구성하므로 개별 컴포넌트의 동작을 독립적으로 검증하는 것이 중요합니다.

컴포넌트 테스트에서는 일반적으로 실제 DOM에 컴포넌트를 렌더링한 후 사용자가 접근할 수 있는 요소와 화면에 표시되는 결과를 기준으로 테스트를 수행합니다.

주요 검증 대상은 다음과 같습니다.

- Props에 따른 렌더링 결과
- 초기 State 및 상태 변경
- 조건부 렌더링
- 이벤트 핸들링
- 사용자 입력 및 상호작용
- 컴포넌트의 비동기 동작
- 컴포넌트의 예외 및 경계 조건

React Testing Library는 이러한 테스트를 작성할 수 있도록 지원하며, 실제 사용자가 애플리케이션을 이용하는 방식과 유사한 테스트를 작성하도록 설계되었습니다.

## 2. 테스트 환경 구성

React 컴포넌트 테스트에서는 테스트 실행 프레임워크, DOM 환경 및 컴포넌트 테스트 라이브러리를 함께 사용합니다.

### 2.1. 주요 의존성

React + TypeScript 환경에서는 다음 라이브러리 조합을 사용할 수 있습니다.

| 라이브러리 | 역할 |
|---|---|
| Vitest | 테스트 실행 및 Assertion |
| React Testing Library | React 컴포넌트 렌더링 및 DOM 조회 |
| user-event | 사용자 상호작용 시뮬레이션 |
| jest-dom | DOM 관련 커스텀 Matcher 제공 |
| jsdom | 브라우저 DOM 환경 시뮬레이션 |

설치 명령은 다음과 같습니다.

```bash
npm install -D vitest jsdom \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom
```

### 2.2. Vitest 설정

`vitest.config.ts`에서 테스트 환경을 구성합니다.

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: false,
    clearMocks: true,
    restoreMocks: true,
  },
});
```

각 설정의 역할은 다음과 같습니다.

| 설정 | 설명 |
|---|---|
| `environment` | 테스트 실행 환경을 지정합니다. |
| `setupFiles` | 테스트 실행 전에 로드할 초기화 파일을 지정합니다. |
| `globals` | `describe`, `it`, `expect` 등의 전역 사용 여부를 지정합니다. |
| `clearMocks` | 각 테스트 전에 Mock 호출 기록을 초기화합니다. |
| `restoreMocks` | 각 테스트 전에 Spy 등의 Mock 구현을 원래 상태로 복원합니다. |

### 2.3. 테스트 초기화 파일

`src/test/setup.ts`에서 공통 테스트 환경을 초기화합니다.

```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

`@testing-library/jest-dom/vitest`는 Vitest 환경에서 DOM 검증을 위한 커스텀 Matcher를 제공합니다.

대표적인 Matcher는 다음과 같습니다.

- `toBeInTheDocument()`
- `toBeVisible()`
- `toBeDisabled()`
- `toHaveTextContent()`
- `toHaveAttribute()`
- `toHaveValue()`

`cleanup()`은 테스트에서 렌더링한 React 컴포넌트를 정리하여 테스트 간 DOM 상태가 공유되는 것을 방지합니다.

### 2.4. 테스트 파일 구성

컴포넌트 테스트 파일은 일반적으로 테스트 대상 컴포넌트와 동일한 디렉터리에 배치할 수 있습니다.

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.css
│   │
│   └── Counter/
│       ├── Counter.tsx
│       └── Counter.test.tsx
│
└── test/
    └── setup.ts
```

테스트 파일은 다음과 같은 명명 규칙을 사용합니다.

- `ComponentName.test.tsx`
- `ComponentName.spec.tsx`

`.test.tsx`와 `.spec.tsx` 중 하나를 선택하여 프로젝트 전체에서 일관되게 사용하는 것이 좋습니다.

## 3. 컴포넌트 렌더링 테스트

### 3.1. render

`render()`는 React 컴포넌트를 테스트용 DOM에 렌더링하는 함수입니다.

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

function Greeting() {
  return <h1>Hello, React!</h1>;
}

it('renders the greeting message', () => {
  render(<Greeting />);

  expect(
    screen.getByRole('heading', {
      name: 'Hello, React!',
    }),
  ).toBeInTheDocument();
});
```

`render()`는 컴포넌트를 DOM에 마운트하고 렌더링 결과를 조회할 수 있는 객체를 반환합니다.

주요 반환값은 다음과 같습니다.

| 반환값 | 설명 |
|---|---|
| `container` | 렌더링된 컴포넌트의 DOM 컨테이너입니다. |
| `baseElement` | 쿼리의 기준이 되는 DOM 요소입니다. |
| `rerender` | 새로운 React Element로 컴포넌트를 다시 렌더링합니다. |
| `unmount` | 렌더링된 컴포넌트를 언마운트합니다. |
| `asFragment` | 렌더링된 DOM을 DocumentFragment로 반환합니다. |

일반적인 테스트에서는 `render()`와 `screen`을 함께 사용하는 것이 좋습니다.

### 3.2. screen

`screen`은 `document.body`를 기준으로 렌더링된 DOM 요소를 조회하는 API입니다.

```tsx
import { render, screen } from '@testing-library/react';

function UserProfile() {
  return (
    <section>
      <h1>User Profile</h1>
      <p>Developer</p>
    </section>
  );
}

it('renders the user profile', () => {
  render(<UserProfile />);

  expect(
    screen.getByRole('heading', {
      name: 'User Profile',
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByText('Developer'),
  ).toBeInTheDocument();
});
```

`screen`을 사용하면 `render()`가 반환하는 객체에서 개별 쿼리 함수를 구조 분해하지 않아도 되므로 테스트 코드의 일관성을 유지하기 쉽습니다.

## 4. DOM Query

DOM Query는 테스트 대상 컴포넌트에서 특정 요소를 조회하는 방법입니다.

React Testing Library는 요소를 조회하는 목적과 시점에 따라 여러 Query API를 제공합니다.

### 4.1. Query 종류

| Query | 요소가 없을 때 | 요소가 여러 개일 때 | 비동기 |
|---|---|---|---|
| `getBy...` | 오류 발생 | 오류 발생 | 아니요 |
| `queryBy...` | `null` 반환 | 오류 발생 | 아니요 |
| `findBy...` | 대기 후 오류 발생 | 오류 발생 | 예 |
| `getAllBy...` | 오류 발생 | 배열 반환 | 아니요 |
| `queryAllBy...` | 빈 배열 반환 | 배열 반환 | 아니요 |
| `findAllBy...` | 대기 후 오류 발생 | 배열 반환 | 예 |

각 Query의 사용 목적은 다음과 같습니다.

**getBy**

요소가 반드시 존재해야 하는 경우 사용합니다.

```tsx
const heading = screen.getByRole('heading', {
  name: 'Dashboard',
});
```

요소가 존재하지 않으면 즉시 테스트가 실패합니다.

**queryBy**

요소의 존재 여부를 확인하거나 특정 요소가 없는 상태를 검증할 때 사용합니다.

```tsx
expect(
  screen.queryByText('Error'),
).not.toBeInTheDocument();
```

요소가 존재하지 않으면 `null`을 반환합니다.

**findBy**

비동기적으로 나타나는 요소를 조회할 때 사용합니다.

```tsx
const message = await screen.findByText(
  'Data loaded',
);
```

요소가 나타날 때까지 기다리며, 기본 대기 시간이 초과되면 테스트가 실패합니다.

### 4.2. 접근성 기반 Query

React Testing Library는 사용자가 실제로 UI를 인식하는 방식과 유사하게 DOM 요소를 조회하도록 권장합니다.

대표적인 Query 우선순위는 다음과 같습니다.

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByAltText`
7. `getByTitle`
8. `getByTestId`

예를 들어 버튼을 조회할 때는 CSS Class나 내부 DOM 구조보다 접근 가능한 Role과 이름을 기준으로 조회하는 것이 좋습니다.

```tsx
screen.getByRole('button', {
  name: 'Submit',
});
```

이러한 방식은 테스트가 접근성 요구사항을 함께 검증하도록 도와줍니다.

### 4.3. within

`within()`은 특정 DOM 영역을 기준으로 요소를 조회하는 API입니다.

동일한 이름을 가진 요소가 여러 영역에 존재하는 경우 조회 범위를 제한할 수 있습니다.

```tsx
import { render, screen, within } from '@testing-library/react';

function UserList() {
  return (
    <section aria-label="Users">
      <article>
        <h2>Kim</h2>
        <button>Edit</button>
      </article>

      <article>
        <h2>Lee</h2>
        <button>Edit</button>
      </article>
    </section>
  );
}

it('finds the edit button for a specific user', () => {
  render(<UserList />);

  const user = screen.getByRole('article', {
    name: '',
  });

  const editButton = within(user).getByRole('button', {
    name: 'Edit',
  });

  expect(editButton).toBeInTheDocument();
});
```

실제 테스트에서는 사용자 이름을 기준으로 영역을 구분할 수 있도록 `aria-labelledby` 또는 적절한 접근성 구조를 구성하는 것이 좋습니다.

예를 들어 다음과 같이 테스트할 수 있습니다.

```tsx
const kim = screen.getByRole('article', {
  name: 'Kim',
});
```

`within()`은 반복되는 리스트 항목이나 테이블 행 등 특정 영역 내부의 요소를 검증할 때 유용합니다.

## 5. Props 테스트

Props 테스트는 전달된 Props에 따라 컴포넌트의 렌더링 결과가 올바르게 변경되는지 검증합니다.

### 5.1. 기본 Props 검증

```tsx
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

테스트 코드는 다음과 같습니다.

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

it('renders the name passed through props', () => {
  render(<Greeting name="React" />);

  expect(
    screen.getByRole('heading', {
      name: 'Hello, React!',
    }),
  ).toBeInTheDocument();
});
```

### 5.2. 기본값 검증

Optional Props에 기본값이 지정된 경우 해당 기본값이 정상적으로 적용되는지 검증합니다.

```tsx
interface GreetingProps {
  name?: string;
}

function Greeting({ name = 'Guest' }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

```tsx
it('uses the default prop value', () => {
  render(<Greeting />);

  expect(
    screen.getByRole('heading', {
      name: 'Hello, Guest!',
    }),
  ).toBeInTheDocument();
});
```

### 5.3. Props 변경 검증

`rerender()`를 사용하면 동일한 테스트에서 Props가 변경되었을 때 렌더링 결과가 어떻게 달라지는지 검증할 수 있습니다.

```tsx
it('updates the rendered output when props change', () => {
  const { rerender } = render(
    <Greeting name="React" />,
  );

  expect(
    screen.getByRole('heading', {
      name: 'Hello, React!',
    }),
  ).toBeInTheDocument();

  rerender(<Greeting name="TypeScript" />);

  expect(
    screen.getByRole('heading', {
      name: 'Hello, TypeScript!',
    }),
  ).toBeInTheDocument();
});
```

이 테스트는 동일한 컴포넌트 인스턴스에 새로운 Props가 전달되었을 때 UI가 정상적으로 갱신되는지 확인합니다.

## 6. State 테스트

State 테스트는 사용자의 동작이나 컴포넌트 내부 로직에 의해 상태가 변경되고, 변경 결과가 UI에 반영되는지 검증합니다.

### 6.1. 초기 State 검증

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      <button
        onClick={() => setCount((prev) => prev + 1)}
      >
        Increment
      </button>
    </div>
  );
}
```

```tsx
it('renders the initial state', () => {
  render(<Counter />);

  expect(
    screen.getByText('Count: 0'),
  ).toBeInTheDocument();
});
```

### 6.2. State 변경 검증

```tsx
import userEvent from '@testing-library/user-event';

it('updates the count when the button is clicked', async () => {
  const user = userEvent.setup();

  render(<Counter />);

  await user.click(
    screen.getByRole('button', {
      name: 'Increment',
    }),
  );

  expect(
    screen.getByText('Count: 1'),
  ).toBeInTheDocument();
});
```

이 테스트에서는 `useState`의 내부 값을 직접 확인하지 않습니다.

대신 사용자가 버튼을 클릭한 후 변경된 UI를 검증합니다.

이러한 접근은 내부 상태 관리 방식이 변경되더라도 컴포넌트의 외부 동작이 유지되는 한 테스트가 안정적으로 유지되도록 합니다.

## 7. 이벤트 핸들링 테스트

이벤트 핸들링 테스트는 사용자의 상호작용에 따라 컴포넌트가 올바른 동작을 수행하는지 검증합니다.

### 7.1. Click Event

```tsx
interface ButtonProps {
  onClick: () => void;
}

function Button({ onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      Submit
    </button>
  );
}
```

```tsx
import { vi } from 'vitest';

it('calls the onClick handler when clicked', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();

  render(<Button onClick={handleClick} />);

  await user.click(
    screen.getByRole('button', {
      name: 'Submit',
    }),
  );

  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

`vi.fn()`은 Vitest에서 제공하는 Mock Function입니다.

함수 호출 여부와 호출 횟수, 전달된 인자 등을 검증할 수 있습니다.

### 7.2. Input Event

입력 요소에 사용자가 값을 입력했을 때 컴포넌트가 정상적으로 동작하는지 검증합니다.

```tsx
function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <label htmlFor="name">Name</label>

      <input
        id="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <p>Hello, {name}</p>
    </div>
  );
}
```

```tsx
it('updates the displayed name when typing', async () => {
  const user = userEvent.setup();

  render(<NameInput />);

  await user.type(
    screen.getByRole('textbox', {
      name: 'Name',
    }),
    'React',
  );

  expect(
    screen.getByText('Hello, React'),
  ).toBeInTheDocument();
});
```

이 테스트는 입력 이벤트가 State 변경으로 이어지고, 변경된 State가 UI에 반영되는 과정을 검증합니다.

## 8. 조건부 렌더링 테스트

조건부 렌더링은 State 또는 Props의 값에 따라 서로 다른 UI를 표시하는 방식입니다.

테스트에서는 특정 조건에서 올바른 요소가 표시되는지, 표시되지 않아야 하는 요소가 제거되는지 검증합니다.

```tsx
interface StatusProps {
  isLoggedIn: boolean;
}

function LoginStatus({ isLoggedIn }: StatusProps) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
}
```

```tsx
it('renders the logged-in message', () => {
  render(<LoginStatus isLoggedIn />);

  expect(
    screen.getByText('Welcome back!'),
  ).toBeInTheDocument();

  expect(
    screen.queryByText('Please log in.'),
  ).not.toBeInTheDocument();
});

it('renders the logged-out message', () => {
  render(<LoginStatus isLoggedIn={false} />);

  expect(
    screen.getByText('Please log in.'),
  ).toBeInTheDocument();
});
```

조건부 렌더링에서는 정상 조건뿐만 아니라 반대 조건도 검증하는 것이 중요합니다.

## 9. 비동기 컴포넌트 테스트

React 컴포넌트는 API 요청이나 비동기 작업의 결과에 따라 UI를 변경할 수 있습니다.

이러한 컴포넌트는 Loading, Success, Error 등 각각의 상태를 검증해야 합니다.

### 9.1. 비동기 데이터 조회

```tsx
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface UserProfileProps {
  fetchUser: () => Promise<User>;
}

function UserProfile({ fetchUser }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, [fetchUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return <h1>{user.name}</h1>;
}
```

### 9.2. Loading 상태 검증

```tsx
it('renders the loading state', () => {
  const fetchUser = () => new Promise<User>(() => {});

  render(<UserProfile fetchUser={fetchUser} />);

  expect(
    screen.getByText('Loading...'),
  ).toBeInTheDocument();
});
```

### 9.3. Success 상태 검증

```tsx
it('renders the user after fetching data', async () => {
  const fetchUser = vi.fn().mockResolvedValue({
    id: 1,
    name: 'Kim',
  });

  render(<UserProfile fetchUser={fetchUser} />);

  expect(
    await screen.findByRole('heading', {
      name: 'Kim',
    }),
  ).toBeInTheDocument();

  expect(fetchUser).toHaveBeenCalledTimes(1);
});
```

### 9.4. Error 상태 검증

실제 서비스에서는 네트워크 오류나 서버 오류가 발생할 수 있으므로 실패 상황도 검증해야 합니다.

앞선 컴포넌트는 Promise가 Reject될 때 오류를 처리하지 않으므로 다음과 같이 Error 상태를 처리하도록 개선할 수 있습니다.

```tsx
interface UserProfileProps {
  fetchUser: () => Promise<User>;
}

function UserProfile({ fetchUser }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUser()
      .then(setUser)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [fetchUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">Failed to load user.</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return <h1>{user.name}</h1>;
}
```

```tsx
it('renders an error message when fetching fails', async () => {
  const fetchUser = vi.fn().mockRejectedValue(
    new Error('Network Error'),
  );

  render(<UserProfile fetchUser={fetchUser} />);

  expect(
    await screen.findByRole('alert'),
  ).toHaveTextContent('Failed to load user.');
});
```

비동기 테스트에서는 Promise의 완료 시점과 React의 재렌더링 시점을 고려해야 합니다.

또한 실제 API 통신을 검증하는 경우에는 MSW(Mock Service Worker) 등을 활용하여 네트워크 요청을 모킹하는 방법도 사용할 수 있습니다.

## 10. 컴포넌트 재렌더링 테스트

컴포넌트는 Props나 State가 변경되면 다시 렌더링됩니다.

테스트에서는 입력값의 변경이나 상위 컴포넌트의 데이터 변경에 따라 UI가 정상적으로 갱신되는지 검증할 수 있습니다.

### 10.1. rerender

`rerender()`는 기존에 렌더링된 컴포넌트에 새로운 React Element를 전달합니다.

```tsx
function Message({ text }: { text: string }) {
  return <p>{text}</p>;
}

it('updates the component when props change', () => {
  const { rerender } = render(
    <Message text="Initial" />,
  );

  expect(
    screen.getByText('Initial'),
  ).toBeInTheDocument();

  rerender(<Message text="Updated" />);

  expect(
    screen.getByText('Updated'),
  ).toBeInTheDocument();

  expect(
    screen.queryByText('Initial'),
  ).not.toBeInTheDocument();
});
```

### 10.2. unmount

`unmount()`는 렌더링된 컴포넌트를 DOM에서 제거합니다.

Effect Cleanup이나 구독 해제 등 컴포넌트의 언마운트 동작을 검증할 때 활용할 수 있습니다.

```tsx
function Subscription({
  onCleanup,
}: {
  onCleanup: () => void;
}) {
  useEffect(() => {
    return () => {
      onCleanup();
    };
  }, [onCleanup]);

  return <p>Subscribed</p>;
}
```

```tsx
it('runs cleanup when the component unmounts', () => {
  const onCleanup = vi.fn();

  const { unmount } = render(
    <Subscription onCleanup={onCleanup} />,
  );

  unmount();

  expect(onCleanup).toHaveBeenCalledTimes(1);
});
```

이 테스트는 컴포넌트가 언마운트될 때 Effect Cleanup이 실행되는지 확인합니다.

## 11. Provider를 사용하는 컴포넌트 테스트

React 컴포넌트는 Context, Router, Theme Provider 등 상위 Provider에 의존할 수 있습니다.

이러한 컴포넌트를 테스트할 때는 필요한 Provider를 함께 렌더링해야 합니다.

### 11.1. Context Provider

```tsx
import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';

interface ThemeContextValue {
  theme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | null>(
  null,
);

function ThemeLabel() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeProvider is required');
  }

  return <p>{context.theme}</p>;
}
```

```tsx
it('renders the theme from context', () => {
  render(
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      <ThemeLabel />
    </ThemeContext.Provider>,
  );

  expect(
    screen.getByText('dark'),
  ).toBeInTheDocument();
});
```

### 11.2. Custom Render

Provider를 사용하는 컴포넌트가 많다면 매번 Provider를 직접 작성하는 대신 공통 렌더링 함수를 정의할 수 있습니다.

`src/test/test-utils.tsx`

```tsx
import {
  render,
  type RenderOptions,
} from '@testing-library/react';
import type { ReactElement } from 'react';

function AllProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: AllProviders,
    ...options,
  });
}

export * from '@testing-library/react';
export { customRender as render };
```

이후 테스트에서는 공통 `render()` 함수를 사용합니다.

```tsx
import { render, screen } from '../test/test-utils';

it('renders the theme from the shared provider', () => {
  render(<ThemeLabel />);

  expect(
    screen.getByText('dark'),
  ).toBeInTheDocument();
});
```

Custom Render는 Context, Router, Theme 및 전역 상태 관리 Provider가 필요한 테스트에서 반복적인 설정을 줄이는 데 유용합니다.

## 12. act와 비동기 업데이트

`act()`는 React의 업데이트가 테스트 환경에서 처리된 이후 결과를 검증할 수 있도록 지원하는 API입니다.

상태 업데이트, Effect 및 기타 React 작업이 완료된 시점을 고려하여 테스트를 작성하는 데 사용됩니다.

```tsx
import { act } from '@testing-library/react';
```

React Testing Library의 `render()`와 `user-event`는 일반적인 사용 사례에서 필요한 `act()` 처리를 내부적으로 수행합니다.

따라서 대부분의 컴포넌트 테스트에서는 직접 `act()`를 호출할 필요가 없습니다.

다만 테스트 코드에서 외부 이벤트나 비동기 작업을 직접 발생시키는 경우에는 명시적인 `act()`가 필요할 수 있습니다.

```tsx
it('updates the UI after an external state update', async () => {
  const { rerender } = render(
    <Message text="Before" />,
  );

  await act(async () => {
    rerender(<Message text="After" />);
  });

  expect(
    screen.getByText('After'),
  ).toBeInTheDocument();
});
```

`act()`는 테스트를 위한 API이며, 일반적인 사용자 이벤트 처리에는 `user-event`를 우선적으로 사용하는 것이 좋습니다.

## 13. Snapshot Testing

Snapshot Testing은 컴포넌트의 렌더링 결과를 스냅샷으로 저장하고 이후 실행 결과와 비교하는 테스트 방식입니다.

```tsx
it('matches the snapshot', () => {
  const { asFragment } = render(
    <Greeting name="React" />,
  );

  expect(asFragment()).toMatchSnapshot();
});
```

최초 실행 시 렌더링 결과가 스냅샷으로 저장되며, 이후 테스트 실행에서 결과가 변경되면 차이를 확인할 수 있습니다.

Snapshot Testing의 장점은 다음과 같습니다.

- 렌더링 결과의 변경 사항을 빠르게 확인할 수 있습니다.
- 반복적인 UI 구조 검증에 활용할 수 있습니다.
- 대규모 렌더링 결과의 변경을 감지할 수 있습니다.

반면 다음과 같은 한계도 존재합니다.

- 변경된 결과가 의도된 것인지 판단하지 못합니다.
- 스냅샷이 지나치게 커지면 검토하기 어렵습니다.
- 내부 DOM 구조 변경에도 테스트가 실패할 수 있습니다.
- 테스트가 성공하더라도 사용자 관점의 기능이 정상이라는 것을 보장하지 않습니다.

따라서 일반적인 컴포넌트 테스트에서는 Snapshot Testing에 과도하게 의존하기보다 실제 사용자에게 표시되는 결과를 직접 검증하는 방식을 권장합니다.

## 14. 테스트 작성 패턴

컴포넌트 테스트는 일반적으로 Arrange-Act-Assert(AAA) 패턴을 사용합니다.

### 14.1. Arrange

테스트를 실행하기 위한 환경과 입력값을 준비합니다.

- 테스트 대상 컴포넌트를 선택합니다.
- 필요한 Props를 전달합니다.
- Mock Function을 구성합니다.
- 컴포넌트를 렌더링합니다.

### 14.2. Act

사용자의 동작이나 테스트 대상에 대한 입력을 수행합니다.

- 버튼을 클릭합니다.
- 입력값을 변경합니다.
- 폼을 제출합니다.
- 필요한 비동기 작업을 실행합니다.

### 14.3. Assert

동작 이후 기대한 결과가 나타났는지 검증합니다.

- DOM 요소가 존재하는지 확인합니다.
- 텍스트가 변경되었는지 확인합니다.
- 버튼이 활성화 또는 비활성화되었는지 확인합니다.
- 이벤트 핸들러가 호출되었는지 확인합니다.

예제는 다음과 같습니다.

```tsx
it('increments the counter', async () => {
  // Arrange
  const user = userEvent.setup();

  render(<Counter />);

  // Act
  await user.click(
    screen.getByRole('button', {
      name: 'Increment',
    }),
  );

  // Assert
  expect(
    screen.getByText('Count: 1'),
  ).toBeInTheDocument();
});
```

AAA 패턴은 테스트의 준비, 실행 및 검증 단계를 분리하여 테스트 코드의 가독성을 높입니다.

## 15. 컴포넌트 테스트 작성 시 주의사항

### 15.1. 내부 구현보다 사용자 관점의 동작 검증

컴포넌트의 내부 State나 Hook 호출 여부를 직접 검증하기보다 화면에 표시되는 결과와 사용자 상호작용을 중심으로 테스트해야 합니다.

내부 구현이 변경되더라도 외부 동작이 유지된다면 테스트도 유지될 수 있어야 합니다.

### 15.2. Query 우선순위 준수

가능하면 `getByRole`과 `getByLabelText`를 우선적으로 사용합니다.

`getByTestId`는 접근성 기반 Query로 요소를 식별하기 어려운 경우에 제한적으로 사용합니다.

### 15.3. user-event 우선 사용

실제 사용자 상호작용을 검증할 때는 `fireEvent`보다 `user-event`를 우선적으로 사용합니다.

`user-event`는 단일 이벤트 발생뿐 아니라 실제 브라우저에서 발생하는 사용자 입력 과정을 보다 충실하게 재현합니다.

### 15.4. 불필요한 Mocking 방지

Mocking은 외부 시스템과의 의존성을 격리하는 데 유용하지만 과도하게 사용하면 실제 동작과 테스트 환경 사이에 차이가 발생할 수 있습니다.

가능하면 테스트 대상의 핵심 로직은 실제 구현을 사용하고, 외부 API나 브라우저 환경 등 필요한 의존성만 대체합니다.

### 15.5. 테스트 독립성 유지

각 테스트는 독립적으로 실행할 수 있어야 합니다.

공유 State, Mock 호출 기록 및 DOM 상태가 다른 테스트에 영향을 미치지 않도록 정리해야 합니다.

### 15.6. StrictMode 고려

React StrictMode는 개발 환경에서 일부 렌더링 및 Effect 관련 로직을 추가로 실행하여 잠재적인 문제를 발견하도록 지원합니다.

StrictMode가 적용된 테스트 환경에서는 Effect의 실행 및 Cleanup 횟수가 예상과 다르게 나타날 수 있습니다.

따라서 테스트에서 특정 함수의 호출 횟수를 검증할 때는 StrictMode의 동작을 고려해야 합니다.

## 16. 정리

컴포넌트 테스트는 React 애플리케이션의 개별 컴포넌트가 예상한 UI를 렌더링하고 사용자 상호작용에 올바르게 반응하는지 검증하는 과정입니다.

주요 테스트 대상은 다음과 같습니다.

| 검증 영역 | 주요 API 및 방법 |
|---|---|
| 컴포넌트 렌더링 | `render()` |
| DOM 요소 조회 | `screen`, `within()` |
| Props 변경 | `rerender()` |
| 사용자 상호작용 | `user-event` |
| 상태 변경 | DOM Assertion |
| 비동기 렌더링 | `findBy`, `waitFor` |
| 컴포넌트 언마운트 | `unmount()` |
| React 업데이트 처리 | `act()` |
| Provider 구성 | Custom Render |
| Mock Function | `vi.fn()` |

효과적인 컴포넌트 테스트를 작성하기 위해서는 다음 원칙을 유지하는 것이 중요합니다.

- 컴포넌트의 외부 동작을 중심으로 검증합니다.
- 접근성 기반 Query를 우선적으로 사용합니다.
- 실제 사용자 상호작용을 재현합니다.
- Props와 State의 변경 결과를 검증합니다.
- 비동기 작업의 성공 및 실패 상황을 모두 고려합니다.
- Provider와 외부 의존성을 적절하게 구성합니다.
- 테스트 간 독립성을 유지합니다.

컴포넌트 테스트의 핵심은 컴포넌트가 내부적으로 어떻게 구현되었는지가 아니라, 주어진 조건에서 사용자가 기대하는 결과를 제공하는지 확인하는 것입니다.

## 17. 참고 자료

### React Testing Library

- [React Testing Library - Introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Library - API](https://testing-library.com/docs/react-testing-library/api/)
- [React Testing Library - Setup](https://testing-library.com/docs/react-testing-library/setup/)
- [React Testing Library - Example](https://testing-library.com/docs/react-testing-library/example-intro/)

### Testing Library

- [Testing Library - Query Priority](https://testing-library.com/docs/queries/about/#priority)
- [Testing Library - ByRole](https://testing-library.com/docs/queries/byrole/)
- [Testing Library - Async Methods](https://testing-library.com/docs/dom-testing-library/api-async/)
- [User Event - Introduction](https://testing-library.com/docs/user-event/intro/)
- [User Event - Convenience APIs](https://testing-library.com/docs/user-event/convenience/)

### Vitest

- [Vitest - Getting Started](https://vitest.dev/guide/)
- [Vitest - Mock Functions](https://vitest.dev/guide/mocking/functions.html)
- [Vitest - Mocking](https://vitest.dev/guide/mocking.html)

### React

- [React - act](https://react.dev/reference/react/act)
- [React - StrictMode](https://react.dev/reference/react/StrictMode)