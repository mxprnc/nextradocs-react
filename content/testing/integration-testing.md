# Integration Testing

통합 테스트(Integration Testing)는 여러 컴포넌트 또는 애플리케이션 계층이 결합된 상태에서 서로 올바르게 동작하는지 검증하는 테스트입니다.

React 애플리케이션에서는 컴포넌트와 Context Provider, 상태 관리 계층, 라우터, API 통신 계층 등이 함께 동작하는 상황을 테스트합니다.

단위 테스트가 개별 함수나 컴포넌트의 동작을 독립적으로 검증하는 데 중점을 둔다면, 통합 테스트는 여러 요소가 연결된 상태에서 실제 사용자 흐름이 정상적으로 수행되는지 확인하는 데 중점을 둡니다.

React Testing Library를 사용하면 실제 애플리케이션에 가까운 컴포넌트 환경을 구성하고, 사용자 상호작용과 화면에 표시되는 결과를 중심으로 통합 테스트를 작성할 수 있습니다.

## 1. Integration Testing의 목적

React 애플리케이션은 여러 계층이 결합되어 동작합니다.

예를 들어 로그인 기능은 다음과 같은 요소로 구성될 수 있습니다.

- LoginForm: 사용자 입력과 제출을 처리합니다.
- AuthProvider: 인증 상태를 관리합니다.
- API Client: 서버에 인증 요청을 전달합니다.
- Router: 로그인 성공 이후 페이지를 이동합니다.
- ProtectedRoute: 인증 상태에 따라 접근을 제어합니다.

각 요소를 개별적으로 테스트하더라도 요소 간 연결이 올바르다는 사실까지 보장할 수는 없습니다.

예를 들어 로그인 API 호출 자체가 정상적으로 동작하더라도 다음과 같은 문제가 발생할 수 있습니다.

- 로그인 성공 후 인증 상태가 갱신되지 않습니다.
- 인증 상태는 갱신되지만 화면이 다시 렌더링되지 않습니다.
- 로그인 성공 후 잘못된 경로로 이동합니다.
- 인증되지 않은 사용자가 보호된 페이지에 접근할 수 있습니다.

통합 테스트는 이러한 연결 지점에서 발생하는 문제를 검증합니다.

주요 목적은 다음과 같습니다.

1. 여러 컴포넌트가 결합된 상태에서 정상적으로 동작하는지 확인합니다.
2. Context, 상태 관리, 라우터 등의 의존성이 올바르게 연결되는지 검증합니다.
3. API 요청과 응답에 따른 화면 상태 변경을 확인합니다.
4. 사용자 동작부터 최종 결과까지의 흐름을 검증합니다.
5. 개별 단위 테스트에서 발견하기 어려운 컴포넌트 간 통합 문제를 발견합니다.

## 2. Unit Testing과 Integration Testing의 차이

단위 테스트와 통합 테스트는 테스트 대상의 범위와 검증 목적에서 차이가 있습니다.

| 구분 | Unit Testing | Integration Testing |
|---|---|---|
| 테스트 범위 | 개별 함수 또는 컴포넌트 | 여러 컴포넌트와 계층의 결합 |
| 주요 목적 | 독립적인 동작 검증 | 요소 간 연결과 협력 검증 |
| 의존성 | 필요한 의존성을 주로 모킹 | 실제 구현을 최대한 사용 |
| API 통신 | 일반적으로 직접 검증하지 않음 | 요청과 응답을 모킹하여 검증 가능 |
| 상태 관리 | 개별 상태 로직 중심 | 여러 컴포넌트 간 상태 전달과 변경 |
| 라우팅 | 라우팅 자체를 분리하여 검증 | 실제 경로 전환과 화면 연결 검증 |
| 실행 비용 | 상대적으로 낮음 | 상대적으로 높음 |

예를 들어 카운터 컴포넌트를 테스트한다고 가정하겠습니다.

**단위 테스트**

- 버튼 클릭 시 카운터 상태가 증가하는지 확인합니다.
- 초기 상태가 올바르게 렌더링되는지 확인합니다.

**통합 테스트**

- 여러 컴포넌트가 공유하는 Context 상태가 올바르게 변경되는지 확인합니다.
- 변경된 상태가 다른 컴포넌트에도 반영되는지 확인합니다.
- 사용자 동작 이후 관련 화면이 일관되게 갱신되는지 확인합니다.

테스트의 경계는 프로젝트 구조와 검증 목적에 따라 달라질 수 있습니다. 특정 컴포넌트의 테스트라고 해서 반드시 단위 테스트인 것은 아니며, 여러 컴포넌트의 결합을 검증한다면 통합 테스트로 분류할 수 있습니다.

## 3. 통합 테스트의 범위와 구성

통합 테스트에서는 검증하려는 기능에 필요한 의존성을 실제 애플리케이션 구조와 유사하게 구성합니다.

일반적으로 다음 요소가 포함됩니다.

### Component Integration

부모 컴포넌트와 자식 컴포넌트가 함께 동작하는지 검증합니다.

예를 들어 부모 컴포넌트에서 전달한 Props가 자식 컴포넌트에 올바르게 전달되고, 자식 컴포넌트의 이벤트가 부모 컴포넌트의 상태 변경으로 연결되는지 확인합니다.

### Context Integration

Context Provider를 통해 여러 컴포넌트가 공유하는 상태와 데이터가 올바르게 전달되는지 검증합니다.

### State Management Integration

Redux, Zustand 등의 상태 관리 계층과 React 컴포넌트가 올바르게 연결되는지 확인합니다.

### Routing Integration

라우터를 통해 페이지가 전환되고, 경로에 따라 올바른 컴포넌트가 렌더링되는지 검증합니다.

### API Integration

API 요청과 응답에 따라 컴포넌트의 상태와 화면이 올바르게 변경되는지 확인합니다.

### User Flow Integration

사용자의 입력부터 여러 컴포넌트의 상태 변경, API 요청, 페이지 전환까지 하나의 기능 흐름이 정상적으로 동작하는지 검증합니다.

## 4. Custom Render를 이용한 테스트 환경 구성

실제 React 애플리케이션에서는 컴포넌트가 여러 Provider에 의존하는 경우가 많습니다.

예를 들어 다음과 같은 구조가 있을 수 있습니다.

```tsx
<ThemeProvider>
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </AuthProvider>
</ThemeProvider>
```

이러한 컴포넌트를 테스트할 때마다 모든 Provider를 직접 구성하면 테스트 코드가 반복되고 복잡해집니다.

React Testing Library는 `render()`의 `wrapper` 옵션을 제공하므로 공통 테스트 환경을 별도의 유틸리티로 구성할 수 있습니다.

### test-utils.tsx

```tsx
import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";

function AllTheProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export * from "@testing-library/react";
export { customRender as render };
```

테스트 파일에서는 기본 `render()` 대신 공통 테스트 유틸리티에서 제공하는 `render()`를 사용합니다.

```tsx
import { render, screen } from "./test-utils";
import { UserProfile } from "./UserProfile";

test("인증된 사용자의 프로필을 표시합니다.", () => {
  render(<UserProfile />);

  expect(
    screen.getByText("User Profile")
  ).toBeInTheDocument();
});
```

이 방식은 테스트마다 필요한 Provider를 반복해서 작성하지 않아도 된다는 장점이 있습니다.

다만 모든 테스트에서 동일한 Provider 구성을 강제할 필요는 없습니다. 테스트 대상에 따라 필요한 Provider만 선택적으로 구성할 수 있도록 옵션을 제공하는 방식도 고려할 수 있습니다.

## 5. Context Provider 통합 테스트

Context는 여러 컴포넌트가 공통 데이터를 공유할 수 있도록 지원합니다.

통합 테스트에서는 Provider에서 관리하는 상태가 여러 하위 컴포넌트에 올바르게 전달되고, 상태 변경이 전체 컴포넌트 트리에 반영되는지 검증할 수 있습니다.

다음은 인증 상태를 Context로 관리하는 예제입니다.

### AuthContext.tsx

```tsx
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(
  null
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<string | null>(null);

  const login = (name: string) => {
    setUser(name);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider가 필요합니다.");
  }

  return context;
}
```

### AuthStatus.tsx

```tsx
import { useAuth } from "./AuthContext";

export function AuthStatus() {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Not logged in</p>;
  }

  return (
    <>
      <p>Welcome, {user}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}
```

### LoginButton.tsx

```tsx
import { useAuth } from "./AuthContext";

export function LoginButton() {
  const { login } = useAuth();

  return (
    <button onClick={() => login("Alice")}>
      Login
    </button>
  );
}
```

### Auth Integration Test

```tsx
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "./AuthContext";
import { AuthStatus } from "./AuthStatus";
import { LoginButton } from "./LoginButton";

test("로그인 상태가 여러 컴포넌트에 반영됩니다.", async () => {
  const user = userEvent.setup();

  render(
    <AuthProvider>
      <LoginButton />
      <AuthStatus />
    </AuthProvider>
  );

  expect(
    screen.getByText("Not logged in")
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Login" })
  );

  expect(
    screen.getByText("Welcome, Alice")
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Logout" })
  );

  expect(
    screen.getByText("Not logged in")
  ).toBeInTheDocument();
});
```

이 테스트는 개별 컴포넌트의 상태 변경뿐 아니라 Context Provider를 통해 서로 다른 컴포넌트가 동일한 인증 상태를 공유하는 과정까지 검증합니다.

## 6. API 통합 테스트

React 컴포넌트는 API를 통해 데이터를 가져오거나 서버에 데이터를 전달할 수 있습니다.

API 통합 테스트에서는 실제 서버에 요청을 보내지 않고도 요청과 응답에 따른 컴포넌트의 동작을 검증할 수 있습니다.

이때 HTTP 요청을 가로채고 미리 정의한 응답을 반환하는 MSW(Mock Service Worker)를 활용할 수 있습니다.

MSW는 애플리케이션의 API 호출 코드를 직접 모킹하는 대신 네트워크 요청 계층에서 요청을 가로챕니다.

따라서 실제 API Client와 데이터 처리 로직을 유지하면서 서버 응답만 테스트 환경에 맞게 제어할 수 있습니다.

### MSW 설치

```bash
npm install -D msw
```

### handlers.ts

MSW v2에서는 `http`와 `HttpResponse`를 사용하여 요청 핸들러를 정의합니다.

```tsx
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      {
        id: 1,
        name: "Alice",
      },
      {
        id: 2,
        name: "Bob",
      },
    ]);
  }),
];
```

### server.ts

Node.js 테스트 환경에서는 `setupServer()`를 사용합니다.

```tsx
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

### vitest.setup.ts

테스트 실행 전 요청 가로채기를 시작하고, 테스트 종료 후 정리하도록 구성합니다.

```tsx
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./mocks/server";

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "error",
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
```

`onUnhandledRequest: "error"`는 핸들러가 정의되지 않은 요청이 발생하면 오류를 발생시킵니다. 이를 통해 테스트에서 의도하지 않은 외부 네트워크 요청이 발생하는 상황을 발견할 수 있습니다.

`resetHandlers()`는 개별 테스트에서 추가하거나 변경한 핸들러를 초기화합니다.

### vitest.config.ts

```tsx
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/vitest.setup.ts"],
  },
});
```

### UserList.tsx

```tsx
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
};

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("사용자 조회에 실패했습니다.");
        }

        const data: User[] = await response.json();

        setUsers(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p role="alert">Failed to load users</p>;
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

### UserList.test.tsx

```tsx
import { render, screen } from "./test-utils";
import { UserList } from "./UserList";

test("API 응답을 기반으로 사용자 목록을 표시합니다.", async () => {
  render(<UserList />);

  expect(screen.getByText("Loading...")).toBeInTheDocument();

  expect(
    await screen.findByText("Alice")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Bob")
  ).toBeInTheDocument();

  expect(
    screen.queryByText("Loading...")
  ).not.toBeInTheDocument();
});
```

이 테스트에서는 다음 흐름을 검증합니다.

1. 컴포넌트가 렌더링됩니다.
2. API 요청이 발생합니다.
3. MSW가 요청을 가로채고 정의된 응답을 반환합니다.
4. 컴포넌트가 응답 데이터를 상태에 저장합니다.
5. 로딩 상태가 종료됩니다.
6. 사용자 목록이 화면에 표시됩니다.

실제 서버에 의존하지 않으면서 API 통신과 React 컴포넌트 사이의 연결을 검증할 수 있습니다.

## 7. API 성공 및 실패 시나리오

통합 테스트에서는 정상 응답뿐 아니라 오류 응답과 네트워크 장애 상황도 검증해야 합니다.

MSW에서는 테스트별로 요청 핸들러를 변경하여 다양한 응답을 시뮬레이션할 수 있습니다.

### API 오류 응답 테스트

```tsx
import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { render, screen } from "./test-utils";
import { UserList } from "./UserList";

test("API 요청이 실패하면 오류 메시지를 표시합니다.", async () => {
  server.use(
    http.get("/api/users", () => {
      return HttpResponse.json(
        {
          message: "Internal Server Error",
        },
        {
          status: 500,
        }
      );
    })
  );

  render(<UserList />);

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Failed to load users");
});
```

### 네트워크 오류 테스트

HTTP 응답 자체를 받지 못하는 상황도 검증할 수 있습니다.

```tsx
test("네트워크 오류가 발생하면 오류 메시지를 표시합니다.", async () => {
  server.use(
    http.get("/api/users", () => {
      return HttpResponse.error();
    })
  );

  render(<UserList />);

  expect(
    await screen.findByRole("alert")
  ).toHaveTextContent("Failed to load users");
});
```

API 통합 테스트에서는 다음 시나리오를 고려할 수 있습니다.

| 시나리오 | 검증 내용 |
|---|---|
| 성공 응답 | 응답 데이터가 화면에 표시되는지 확인합니다. |
| 빈 응답 | 데이터가 없을 때 빈 상태가 표시되는지 확인합니다. |
| HTTP 오류 | 오류 응답에 맞는 사용자 피드백이 표시되는지 확인합니다. |
| 네트워크 오류 | 네트워크 연결 실패를 적절하게 처리하는지 확인합니다. |
| 지연 응답 | 요청이 완료되기 전 로딩 상태가 유지되는지 확인합니다. |
| 재요청 | 다시 시도하는 동작이 정상적으로 수행되는지 확인합니다. |

## 8. Router 통합 테스트

React Router를 사용하는 애플리케이션에서는 라우팅 환경을 구성한 상태에서 페이지 전환과 경로별 화면을 테스트할 수 있습니다.

일반적으로 `MemoryRouter`를 사용하면 브라우저 주소 표시줄이나 실제 브라우저 히스토리에 의존하지 않고 메모리 내에서 라우팅을 검증할 수 있습니다.

### App.tsx

```tsx
import {
  Link,
  Route,
  Routes,
} from "react-router-dom";

function HomePage() {
  return (
    <>
      <h1>Home</h1>
      <Link to="/profile">Profile</Link>
    </>
  );
}

function ProfilePage() {
  return <h1>Profile</h1>;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
```

### Router Integration Test

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { App } from "./App";

test("링크를 클릭하면 프로필 페이지로 이동합니다.", async () => {
  const user = userEvent.setup();

  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  expect(
    screen.getByRole("heading", { name: "Home" })
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("link", { name: "Profile" })
  );

  expect(
    screen.getByRole("heading", { name: "Profile" })
  ).toBeInTheDocument();
});
```

`MemoryRouter`의 `initialEntries`를 사용하면 테스트 시작 경로를 지정할 수 있습니다.

이를 통해 특정 경로에서 컴포넌트가 올바르게 렌더링되는지 확인할 수 있습니다.

### Protected Route 테스트

인증 상태에 따라 페이지 접근을 제어하는 경우에도 통합 테스트를 작성할 수 있습니다.

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

```tsx
import { render, screen } from "./test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";

test("인증되지 않은 사용자는 로그인 페이지로 이동합니다.", () => {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route
            path="/login"
            element={<h1>Login Page</h1>}
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <h1>Profile Page</h1>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

  expect(
    screen.getByRole("heading", { name: "Login Page" })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole("heading", { name: "Profile Page" })
  ).not.toBeInTheDocument();
});
```

라우터 통합 테스트에서는 경로 변경 이후의 화면뿐 아니라 인증 상태, 경로 매개변수, 쿼리 문자열 등에 따른 동작도 검증할 수 있습니다.

React Router의 Data Router 또는 Framework 기능을 사용하는 경우에는 일반적인 `MemoryRouter` 구성만으로 충분하지 않을 수 있습니다. 해당 기능에 맞는 테스트 라우터 구성이나 `createRoutesStub()` 등을 사용해야 합니다.

특히 실제 Route 컴포넌트 전체의 동작을 검증하는 경우에는 테스트용 Route 구성과 운영 환경의 Route 구성이 달라질 수 있으므로, 필요한 검증 범위에 따라 실행 중인 애플리케이션을 대상으로 하는 E2E 테스트를 고려해야 합니다.

## 9. State Management 통합 테스트

Redux, Zustand 등의 상태 관리 라이브러리를 사용하는 경우 컴포넌트와 상태 관리 계층이 올바르게 연결되는지 검증할 수 있습니다.

상태 관리 라이브러리의 내부 동작을 직접 테스트하는 것과 실제 Provider 또는 Store를 통해 컴포넌트가 동작하는지 검증하는 것은 구분해야 합니다.

예를 들어 Redux를 사용하는 경우 테스트마다 새로운 Store를 생성하고 Provider에 전달하는 방식이 일반적입니다.

### Counter.tsx

```tsx
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./store";
import { increment } from "./counterSlice";

export function Counter() {
  const count = useSelector(
    (state: RootState) => state.counter.value
  );

  const dispatch = useDispatch();

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>
        Increase
      </button>
    </>
  );
}
```

### Counter.test.tsx

```tsx
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { counterReducer } from "./counterSlice";
import { Counter } from "./Counter";

test("사용자 동작에 따라 Redux 상태가 변경됩니다.", async () => {
  const user = userEvent.setup();

  const store = configureStore({
    reducer: {
      counter: counterReducer,
    },
  });

  render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );

  expect(screen.getByText("Count: 0")).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: "Increase" })
  );

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

이 테스트는 다음 연결 관계를 검증합니다.

1. Redux Store가 Provider를 통해 컴포넌트에 전달됩니다.
2. 컴포넌트가 `useSelector()`로 상태를 조회합니다.
3. 버튼 클릭으로 Action이 Dispatch됩니다.
4. Reducer가 상태를 변경합니다.
5. 변경된 상태가 컴포넌트에 반영됩니다.

테스트마다 독립적인 Store를 생성하면 테스트 간 상태가 공유되는 문제를 방지할 수 있습니다.

## 10. 전체 사용자 흐름 통합 테스트

통합 테스트에서는 개별 상호작용을 넘어 실제 기능의 시작부터 완료까지 하나의 사용자 흐름으로 검증할 수 있습니다.

예를 들어 상품 검색 기능은 다음과 같은 과정으로 구성될 수 있습니다.

1. 사용자가 검색어를 입력합니다.
2. 검색 버튼을 클릭합니다.
3. API 요청이 발생합니다.
4. 서버 응답을 처리합니다.
5. 검색 결과가 화면에 표시됩니다.
6. 사용자가 검색 결과를 선택합니다.
7. 상세 페이지로 이동합니다.

이 과정에 포함되는 컴포넌트와 API 요청, 라우팅이 올바르게 연결되는지 검증합니다.

```tsx
import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import { render, screen } from "./test-utils";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ProductSearch } from "./ProductSearch";

test("상품을 검색하고 상세 페이지로 이동합니다.", async () => {
  const user = userEvent.setup();

  server.use(
    http.get("/api/products", ({ request }) => {
      const url = new URL(request.url);
      const keyword = url.searchParams.get("keyword");

      if (keyword === "React") {
        return HttpResponse.json([
          {
            id: 1,
            name: "React Book",
          },
        ]);
      }

      return HttpResponse.json([]);
    })
  );

  render(
    <MemoryRouter>
      <ProductSearch />
    </MemoryRouter>
  );

  await user.type(
    screen.getByRole("textbox", { name: "Search" }),
    "React"
  );

  await user.click(
    screen.getByRole("button", { name: "Search" })
  );

  const product = await screen.findByRole("link", {
    name: "React Book",
  });

  expect(product).toBeInTheDocument();
});
```

위 예제는 검색어 입력, 검색 요청, 응답 데이터 렌더링까지의 흐름을 보여줍니다.

상세 페이지로 이동하는 동작까지 검증하려면 실제 링크 대상 경로와 Route 구성을 포함하고, 이동 후 상세 페이지의 주요 콘텐츠가 표시되는지 확인해야 합니다.

```tsx
await user.click(
  screen.getByRole("link", { name: "React Book" })
);

expect(
  await screen.findByRole("heading", {
    name: "React Book",
  })
).toBeInTheDocument();
```

이처럼 통합 테스트는 여러 컴포넌트와 계층이 협력하여 하나의 기능을 완성하는 과정을 검증하는 데 적합합니다.

## 11. 비동기 처리와 테스트 안정성

통합 테스트에서는 API 요청, 상태 업데이트, 라우팅 등 여러 비동기 작업이 함께 발생할 수 있습니다.

따라서 테스트가 비동기 작업의 완료를 기다리지 않고 종료되지 않도록 주의해야 합니다.

### findBy 쿼리

특정 요소가 비동기적으로 화면에 나타나는 경우 `findBy...`를 사용할 수 있습니다.

```tsx
expect(
  await screen.findByText("Loaded")
).toBeInTheDocument();
```

### waitFor

여러 조건이 충족될 때까지 기다려야 하는 경우 `waitFor()`를 사용할 수 있습니다.

```tsx
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});
```

### 비동기 작업과 act()

React Testing Library의 `render()`와 `user-event`는 일반적인 사용 흐름에서 필요한 React 업데이트 처리를 지원합니다.

하지만 테스트가 직접 React 업데이트를 유발하는 외부 작업을 수행하거나 비동기 업데이트를 적절히 기다리지 않으면 `act()` 관련 경고가 발생할 수 있습니다.

이 경우에는 우선 비동기 작업의 완료를 기다리는 테스트 구조인지 확인해야 합니다.

테스트에서 직접 React 상태 업데이트를 유발하는 작업을 수행해야 하는 경우에는 `act()`를 사용할 수 있습니다.

```tsx
import { act } from "@testing-library/react";

await act(async () => {
  // React 상태 업데이트를 유발하는 작업
});
```

일반적인 사용자 상호작용 테스트에서 `act()`를 무조건 직접 호출할 필요는 없습니다. `user-event`와 Testing Library의 비동기 쿼리를 우선적으로 활용하는 것이 좋습니다.

## 12. 테스트 격리와 데이터 초기화

통합 테스트는 여러 계층과 의존성을 함께 사용하기 때문에 테스트 간 상태 공유로 인한 문제가 발생하기 쉽습니다.

예를 들어 다음과 같은 상태가 테스트 간에 남아 있을 수 있습니다.

- Redux Store 또는 전역 상태
- Context Provider의 상태
- MSW에서 변경한 요청 핸들러
- Mock 함수의 호출 기록
- Fake Timer 설정
- 브라우저 Storage 데이터
- 테스트 중 생성한 DOM 요소

테스트 간 영향을 방지하려면 다음과 같은 원칙을 적용해야 합니다.

### 독립적인 상태 생성

테스트마다 새로운 Store 또는 Query Client를 생성합니다.

```tsx
function createTestStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
  });
}
```

테스트마다 새로운 인스턴스를 생성하면 이전 테스트의 상태가 다음 테스트에 영향을 주지 않습니다.

### Mock 초기화

테스트마다 Mock 호출 기록과 구현을 적절히 초기화합니다.

Vitest에서는 다음 API를 사용할 수 있습니다.

```tsx
afterEach(() => {
  vi.clearAllMocks();
});
```

Mock 구현 자체도 초기화해야 하는 경우에는 `vi.resetAllMocks()`를 사용할 수 있습니다.

### MSW 핸들러 초기화

개별 테스트에서 변경한 요청 핸들러는 `server.resetHandlers()`로 초기화합니다.

```tsx
afterEach(() => {
  server.resetHandlers();
});
```

### DOM 정리

React Testing Library는 일반적으로 테스트 종료 후 자동으로 `cleanup()`을 수행합니다. 테스트 환경 설정에 따라 자동 정리가 동작하지 않는 경우에는 별도의 정리 작업이 필요할 수 있습니다.

## 13. 통합 테스트 작성 원칙

통합 테스트를 작성할 때는 검증 범위와 테스트 유지보수 비용을 함께 고려해야 합니다.

### 사용자 관점에서 테스트 작성

컴포넌트 내부 구현보다는 사용자가 실제로 경험하는 기능을 중심으로 테스트합니다.

```tsx
await user.click(
  screen.getByRole("button", { name: "Submit" })
);

expect(
  await screen.findByText("Submission completed")
).toBeInTheDocument();
```

특정 컴포넌트의 내부 상태나 함수 호출 여부에 지나치게 의존하면 구현 변경만으로 테스트가 깨질 수 있습니다.

### 실제 구현을 최대한 유지

통합 테스트에서는 검증하려는 컴포넌트와 계층을 실제 구현으로 구성하는 것이 좋습니다.

예를 들어 API 요청을 테스트할 때 API Client 자체를 모킹하기보다는 MSW를 통해 네트워크 요청을 가로채면 API Client와 데이터 처리 로직까지 함께 검증할 수 있습니다.

다만 외부 결제 시스템, 인증 서비스 등 테스트 환경에서 실제로 실행하기 어렵거나 부작용이 발생할 수 있는 외부 시스템은 적절한 경계에서 모킹해야 합니다.

### 필요한 의존성만 구성

테스트 대상과 관계없는 Provider나 전역 서비스를 불필요하게 포함하지 않습니다.

테스트 범위가 넓어질수록 실행 비용과 실패 원인 분석의 복잡성이 증가할 수 있습니다.

### 성공과 실패 시나리오 모두 검증

정상적인 데이터 흐름뿐 아니라 다음과 같은 예외 상황도 고려합니다.

- API 오류
- 네트워크 장애
- 인증 실패
- 권한 부족
- 빈 데이터
- 잘못된 입력값
- 중복 요청
- 비동기 작업 지연

### 구현 세부 사항에 대한 의존성 최소화

컴포넌트의 내부 상태, 특정 Hook 호출 횟수, 자식 컴포넌트의 구체적인 구현 구조보다 화면에 표시되는 결과와 사용자 동작을 기준으로 검증합니다.

### 통합 테스트와 E2E 테스트의 경계 구분

통합 테스트는 여러 애플리케이션 계층이 결합된 동작을 검증하지만, 실제 브라우저와 운영 환경 전체를 검증하는 것은 아닙니다.

실제 브라우저 렌더링, 네트워크 환경, 쿠키 및 인증, 서버와의 전체 통신, 배포 환경 등을 검증하려면 E2E 테스트를 함께 고려해야 합니다.

## 14. Integration Testing과 E2E Testing

통합 테스트와 E2E 테스트는 여러 요소가 함께 동작하는 상황을 검증한다는 공통점이 있지만, 테스트 환경과 범위에서 차이가 있습니다.

| 구분 | Integration Testing | E2E Testing |
|---|---|---|
| 테스트 범위 | 애플리케이션 내부의 여러 계층 | 사용자 관점의 전체 시스템 |
| 실행 환경 | 주로 JSDOM 또는 테스트 환경 | 실제 브라우저 |
| API 통신 | 주로 MSW 등으로 모킹 | 실제 테스트 서버 또는 별도 테스트 API |
| 라우팅 | 테스트용 Router 구성 가능 | 실제 애플리케이션 라우팅 |
| 검증 대상 | 컴포넌트와 계층 간 통합 | UI부터 백엔드까지의 전체 흐름 |
| 실행 속도 | 상대적으로 빠름 | 상대적으로 느림 |
| 유지보수 비용 | 중간 수준 | 상대적으로 높음 |
| 주요 도구 | React Testing Library, MSW | Playwright, Cypress |

예를 들어 로그인 기능을 검증한다고 가정하겠습니다.

**통합 테스트**

- 로그인 폼에 입력할 수 있는지 확인합니다.
- 인증 API 요청과 응답 처리가 올바른지 확인합니다.
- 인증 상태가 Context 또는 Store에 반영되는지 확인합니다.
- 로그인 성공 후 라우팅이 정상적으로 변경되는지 확인합니다.

**E2E 테스트**

- 실제 브라우저에서 로그인 페이지에 접근합니다.
- 사용자 계정 정보를 입력합니다.
- 실제 테스트 서버에 인증 요청을 전달합니다.
- 인증이 완료된 후 대시보드로 이동하는지 확인합니다.
- 브라우저 새로고침 이후에도 인증 상태가 유지되는지 확인합니다.

두 테스트는 서로 대체하는 관계가 아닙니다. 통합 테스트로 애플리케이션 내부의 연결을 폭넓게 검증하고, E2E 테스트로 실제 실행 환경에서 핵심 사용자 흐름을 검증하는 방식이 효과적입니다.

## 참고 자료

- React Testing Library 공식 문서: https://testing-library.com/docs/react-testing-library/intro/
- React Testing Library Setup 및 Custom Render: https://testing-library.com/docs/react-testing-library/setup/
- React Testing Library Example: https://testing-library.com/docs/react-testing-library/example-intro/
- Testing Library Guiding Principles 및 FAQ: https://testing-library.com/docs/react-testing-library/faq/
- Testing Library User Event: https://testing-library.com/docs/user-event/intro/
- MSW 공식 문서: https://mswjs.io/docs/
- MSW Quick Start: https://mswjs.io/docs/quick-start
- MSW setupServer API: https://mswjs.io/api/setup-server/
- React Router Testing: https://reactrouter.com/start/framework/testing
- Vitest 공식 문서: https://vitest.dev/guide/