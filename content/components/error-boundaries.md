# React Error Boundaries

## 1. 개요

Error Boundary는 하위 컴포넌트 트리에서 발생한 JavaScript 오류를 포착하고, 오류가 발생한 UI 대신 대체 UI(Fallback UI)를 표시하는 React 컴포넌트입니다.

일반적으로 React 컴포넌트에서 렌더링 오류가 발생하면 해당 컴포넌트뿐만 아니라 주변 UI에도 영향을 줄 수 있습니다. Error Boundary를 사용하면 오류가 발생한 영역을 격리하여 애플리케이션의 나머지 영역이 계속 동작하도록 구성할 수 있습니다.

Error Boundary의 주요 목적은 다음과 같습니다.

- **오류 격리:** 특정 컴포넌트 영역에서 발생한 오류가 전체 UI로 확산되는 것을 방지합니다.
- **Fallback UI 제공:** 정상적인 UI를 렌더링할 수 없는 경우 대체 화면을 표시합니다.
- **오류 정보 수집:** 오류 객체와 컴포넌트 Stack 정보를 이용하여 오류를 기록할 수 있습니다.
- **부분적인 복구:** 오류가 발생한 컴포넌트 영역을 다시 렌더링하도록 시도할 수 있습니다.

Error Boundary는 일반적인 JavaScript `try...catch`와 유사한 역할을 하지만, React 컴포넌트 트리의 렌더링 과정에서 발생하는 오류를 처리한다는 차이가 있습니다.

## 2. Error Boundary의 동작 원리

### 2.1. 오류 발생과 Fallback UI

Error Boundary는 하위 컴포넌트에서 오류가 발생하면 해당 영역의 정상적인 렌더링을 중단하고 Fallback UI를 표시합니다.

일반적인 동작 과정은 다음과 같습니다.

1. React가 컴포넌트 트리를 렌더링합니다.
2. Error Boundary의 하위 컴포넌트에서 오류가 발생합니다.
3. React가 가장 가까운 상위 Error Boundary를 찾습니다.
4. Error Boundary가 오류 상태를 업데이트합니다.
5. 기존 하위 컴포넌트 UI 대신 Fallback UI를 렌더링합니다.
6. 필요한 경우 오류 정보를 외부 모니터링 시스템에 전달합니다.

```text
App
 |
 +-- Header
 |
 +-- ErrorBoundary
 |    |
 |    +-- Dashboard
 |         |
 |         +-- UserProfile
 |         |
 |         +-- Statistics
 |              |
 |              +-- Rendering Error
 |
 +-- Footer
```

위 구조에서 `Statistics` 컴포넌트에 오류가 발생하면 가장 가까운 상위 Error Boundary가 오류를 처리합니다.

이 경우 `Header`와 `Footer`는 유지되며, Error Boundary가 감싸고 있는 영역에 Fallback UI가 표시됩니다.

### 2.2. 가장 가까운 Error Boundary

Error Boundary는 자신의 하위 컴포넌트 트리에서 발생한 오류만 처리합니다.

여러 Error Boundary가 중첩되어 있다면 오류가 발생한 컴포넌트에서 가장 가까운 상위 Error Boundary가 해당 오류를 처리합니다.

```tsx
function App() {
  return (
    <ErrorBoundary>
      <Dashboard>
        <ErrorBoundary>
          <Statistics />
        </ErrorBoundary>
      </Dashboard>
    </ErrorBoundary>
  );
}
```

위 구조에서 `Statistics`에 오류가 발생하면 내부 Error Boundary가 오류를 처리합니다.

내부 Error Boundary 자체에서 오류가 발생하거나 해당 Boundary가 오류를 처리할 수 없는 경우에는 상위 Error Boundary로 오류가 전파될 수 있습니다.

이러한 구조를 이용하면 애플리케이션 전체를 보호하는 전역 Error Boundary와 특정 기능을 보호하는 영역별 Error Boundary를 함께 구성할 수 있습니다.

## 3. Error Boundary 구현

### 3.1. Class Component 기반 구현

현재 React에서 사용자 정의 Error Boundary를 구현하는 공식적인 방법은 Class Component의 생명주기 메서드를 사용하는 것입니다.

Error Boundary를 구현하기 위해 사용하는 주요 메서드는 다음과 같습니다.

| 메서드 | 역할 |
|---|---|
| `static getDerivedStateFromError()` | 오류 발생에 대응하여 State를 업데이트합니다. |
| `componentDidCatch()` | 오류 정보와 컴포넌트 Stack을 수집합니다. |

두 메서드는 서로 다른 역할을 수행합니다.

- `getDerivedStateFromError()`는 다음 렌더링에서 Fallback UI를 표시하기 위한 State를 반환합니다.
- `componentDidCatch()`는 오류 로깅이나 외부 모니터링 서비스 전송 등의 부수 효과를 처리합니다.

### 3.2. getDerivedStateFromError

`static getDerivedStateFromError(error)`는 하위 컴포넌트에서 오류가 발생했을 때 호출되는 정적 생명주기 메서드입니다.

오류 발생에 대응하여 업데이트할 State를 반환합니다.

```tsx
static getDerivedStateFromError(error: Error) {
  return {
    hasError: true,
  };
}
```

반환된 State는 다음 렌더링에서 사용됩니다.

일반적으로 오류가 발생했는지 나타내는 Boolean State를 설정하고, 이를 기준으로 Fallback UI를 렌더링합니다.

이 메서드는 렌더링 과정에서 사용되므로 순수 함수로 작성해야 합니다.

따라서 API 호출, 로깅, 외부 서비스 전송 등의 부수 효과는 이 메서드에서 수행하지 않아야 합니다.

### 3.3. componentDidCatch

`componentDidCatch(error, info)`는 하위 컴포넌트에서 발생한 오류에 대한 추가 정보를 처리하는 생명주기 메서드입니다.

```tsx
componentDidCatch(
  error: Error,
  info: React.ErrorInfo
) {
  console.error('Caught error:', error);
  console.error('Component stack:', info.componentStack);
}
```

두 번째 인자인 `info`에는 오류가 발생한 컴포넌트와 관련된 정보가 포함됩니다.

주요 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `error` | 하위 컴포넌트에서 발생한 오류 객체입니다. |
| `info.componentStack` | 오류가 발생한 컴포넌트의 계층 구조를 나타내는 Stack 정보입니다. |

`componentDidCatch()`는 다음과 같은 용도로 활용할 수 있습니다.

- 오류 로그 기록
- 외부 오류 모니터링 서비스 전송
- 오류 발생 위치 분석
- 오류 발생 횟수 및 유형 수집

오류를 처리하기 위한 Fallback UI의 State 업데이트는 `getDerivedStateFromError()`에서 수행하고, `componentDidCatch()`는 로깅 등의 부수 효과에 사용하는 것이 권장됩니다.

### 3.4. 기본 Error Boundary 구현

다음은 React와 TypeScript를 이용한 기본적인 Error Boundary 구현입니다.

```tsx
import { Component, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  componentDidCatch(
    error: Error,
    info: React.ErrorInfo
  ) {
    console.error('Error Boundary caught an error:', error);

    console.error(
      'Component stack:',
      info.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <h2>Something went wrong.</h2>
          <p>Please try again later.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

위 컴포넌트는 다음과 같이 사용할 수 있습니다.

```tsx
function App() {
  return (
    <div>
      <h1>Application</h1>

      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
    </div>
  );
}
```

`Dashboard` 또는 그 하위 컴포넌트에서 렌더링 오류가 발생하면 Error Boundary가 오류를 포착하고 Fallback UI를 표시합니다.

## 4. Fallback UI 설계

### 4.1. Fallback UI의 역할

Fallback UI는 오류로 인해 정상적인 컴포넌트 UI를 표시할 수 없을 때 대신 렌더링되는 화면입니다.

Fallback UI는 단순히 오류 발생 사실을 표시하는 것뿐만 아니라 사용자에게 다음 행동을 안내하는 역할도 수행합니다.

예를 들어 다음과 같은 요소를 포함할 수 있습니다.

- 오류 발생 안내 메시지
- 다시 시도할 수 있는 버튼
- 이전 화면으로 이동하는 기능
- 고객 지원 또는 문의 경로
- 오류 식별 정보

오류가 발생한 컴포넌트의 상세한 Stack이나 내부 구현 정보는 일반 사용자에게 직접 노출하지 않는 것이 좋습니다.

### 4.2. Props를 이용한 Fallback UI 구성

Error Boundary에 Fallback UI를 Props로 전달하면 컴포넌트마다 서로 다른 오류 화면을 구성할 수 있습니다.

```tsx
import {
  Component,
  type ReactNode,
} from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

사용 예제는 다음과 같습니다.

```tsx
function App() {
  return (
    <ErrorBoundary
      fallback={
        <div role="alert">
          <h2>Dashboard is unavailable.</h2>
        </div>
      }
    >
      <Dashboard />
    </ErrorBoundary>
  );
}
```

이 방식은 Error Boundary의 오류 처리 로직과 화면 표현을 분리할 수 있다는 장점이 있습니다.

### 4.3. 영역별 Fallback UI

애플리케이션의 모든 오류에 동일한 화면을 표시할 필요는 없습니다.

오류가 발생한 영역의 역할에 따라 서로 다른 Fallback UI를 구성할 수 있습니다.

```tsx
function App() {
  return (
    <main>
      <Header />

      <ErrorBoundary
        fallback={<p>Profile is unavailable.</p>}
      >
        <UserProfile />
      </ErrorBoundary>

      <ErrorBoundary
        fallback={<p>Statistics could not be loaded.</p>}
      >
        <Statistics />
      </ErrorBoundary>

      <Footer />
    </main>
  );
}
```

이 구조에서는 `UserProfile`과 `Statistics`가 각각 독립적인 Error Boundary로 보호됩니다.

따라서 한 영역에서 오류가 발생하더라도 다른 영역의 UI는 계속 표시할 수 있습니다.

## 5. Error Boundary의 오류 처리 범위

### 5.1. Error Boundary가 포착하는 오류

Error Boundary는 하위 컴포넌트 트리에서 발생하는 특정 유형의 오류를 포착합니다.

주요 대상은 다음과 같습니다.

- 컴포넌트 렌더링 중 발생한 오류
- 클래스 컴포넌트의 생명주기 메서드에서 발생한 오류
- 하위 컴포넌트의 Constructor에서 발생한 오류

```tsx
function UserProfile() {
  const user = null;

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}
```

위 코드는 `user`가 `null`인 상태에서 `name` 속성에 접근하므로 렌더링 과정에서 오류가 발생합니다.

이 컴포넌트를 Error Boundary로 감싸면 해당 오류를 포착하여 Fallback UI를 표시할 수 있습니다.

### 5.2. Error Boundary가 포착하지 못하는 오류

Error Boundary는 모든 JavaScript 오류를 처리하는 전역 예외 처리기가 아닙니다.

다음과 같은 오류는 일반적인 Error Boundary의 처리 범위에 포함되지 않습니다.

| 오류 발생 위치 | Error Boundary 포착 여부 | 처리 방법 |
|---|---|---|
| 하위 컴포넌트 렌더링 | 가능 | Error Boundary |
| 하위 클래스 컴포넌트 생명주기 | 가능 | Error Boundary |
| 하위 컴포넌트 Constructor | 가능 | Error Boundary |
| Event Handler | 불가능 | `try...catch` |
| 일반적인 비동기 콜백 | 불가능 | `try...catch` 및 오류 State 관리 |
| Server Side Rendering | 불가능 | 서버 측 오류 처리 |
| Error Boundary 자신의 오류 | 해당 Boundary에서는 불가능 | 상위 Error Boundary |

다만 React의 `useTransition`에서 제공하는 `startTransition` 콜백 내부에서 발생한 오류는 Error Boundary로 전파될 수 있습니다.

### 5.3. Event Handler 오류 처리

Event Handler는 컴포넌트 렌더링 과정이 아니라 사용자 상호작용에 의해 실행됩니다.

따라서 Event Handler에서 발생한 오류는 일반적인 Error Boundary가 포착하지 않습니다.

다음과 같은 코드는 Error Boundary만으로 처리할 수 없습니다.

```tsx
function SubmitButton() {
  const handleClick = () => {
    throw new Error('Submit failed');
  };

  return (
    <button onClick={handleClick}>
      Submit
    </button>
  );
}
```

이러한 오류는 일반적인 JavaScript `try...catch`를 이용하여 처리해야 합니다.

```tsx
function SubmitButton() {
  const handleClick = () => {
    try {
      throw new Error('Submit failed');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleClick}>
      Submit
    </button>
  );
}
```

사용자에게 오류 상태를 표시해야 한다면 State를 이용할 수 있습니다.

```tsx
import { useState } from 'react';

function SubmitButton() {
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    try {
      throw new Error('Submit failed');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error';

      setError(message);
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        Submit
      </button>

      {error && (
        <p role="alert">{error}</p>
      )}
    </div>
  );
}
```

이처럼 이벤트 처리 과정에서 발생하는 오류는 해당 작업의 실행 흐름에서 직접 처리하는 것이 적절합니다.

### 5.4. 비동기 오류 처리

`setTimeout`, `Promise`, `async/await` 등의 일반적인 비동기 작업에서 발생하는 오류도 Error Boundary가 자동으로 포착하지 않습니다.

```tsx
function DataLoader() {
  const handleLoad = async () => {
    throw new Error('Failed to load data');
  };

  return (
    <button onClick={handleLoad}>
      Load Data
    </button>
  );
}
```

위 코드에서 발생한 오류는 Promise의 거부(Rejected Promise)로 처리되며, Error Boundary가 자동으로 포착하지 않습니다.

비동기 작업에서는 `try...catch`를 사용하여 오류를 처리하고 필요한 경우 State를 업데이트해야 합니다.

```tsx
import { useState } from 'react';

function DataLoader() {
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    try {
      await fetch('/api/data').then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load data');
        }

        return response.json();
      });

      setError(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error';

      setError(message);
    }
  };

  return (
    <div>
      <button onClick={handleLoad}>
        Load Data
      </button>

      {error && (
        <p role="alert">{error}</p>
      )}
    </div>
  );
}
```

비동기 작업의 오류를 Error Boundary의 Fallback UI와 연결하려면 오류를 State에 저장한 후 렌더링 과정에서 다시 발생시키는 방법도 사용할 수 있습니다.

```tsx
import { useState } from 'react';

function DataLoader() {
  const [error, setError] = useState<Error | null>(null);

  const handleLoad = async () => {
    try {
      await fetch('/api/data');
    } catch (error) {
      setError(
        error instanceof Error
          ? error
          : new Error('Unknown error')
      );
    }
  };

  if (error) {
    throw error;
  }

  return (
    <button onClick={handleLoad}>
      Load Data
    </button>
  );
}
```

이 경우 비동기 작업에서 발생한 오류를 State에 저장하고, 다음 렌더링 과정에서 다시 Throw하여 상위 Error Boundary가 처리하도록 합니다.

다만 실제 API 호출에서는 HTTP 응답의 성공 여부와 네트워크 오류를 구분하여 처리해야 합니다.

### 5.5. Server Side Rendering 오류

일반적인 React Error Boundary는 서버 렌더링 과정에서 발생한 오류를 포착하지 않습니다.

Server Side Rendering 환경에서는 서버 프레임워크나 서버 런타임의 오류 처리 체계를 이용해야 합니다.

예를 들어 Next.js App Router에서는 `error.tsx` 파일을 통해 라우트 영역의 런타임 오류를 처리할 수 있습니다.

## 6. Error Boundary의 오류 복구

### 6.1. 오류 상태 초기화

Error Boundary는 오류가 발생한 이후 Fallback UI를 표시합니다.

오류의 원인이 일시적인 문제라면 사용자가 다시 시도할 수 있는 기능을 제공할 수 있습니다.

기본적인 구현은 다음과 같습니다.

```tsx
import {
  Component,
  type ReactNode,
} from 'react';

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  handleReset = () => {
    this.setState({
      hasError: false,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>Something went wrong.</p>

          <button onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

`handleReset()`은 Error Boundary의 오류 State를 초기화하여 자식 컴포넌트를 다시 렌더링하도록 합니다.

단, 오류를 발생시킨 원인이 해결되지 않았다면 동일한 오류가 다시 발생할 수 있습니다.

또한 오류가 발생한 하위 컴포넌트의 State를 확실하게 초기화해야 하는 경우에는 단순히 Boundary의 State만 초기화하는 것보다 하위 트리를 새로 마운트하는 전략이 적절할 수 있습니다.

### 6.2. Key를 이용한 하위 컴포넌트 재마운트

React에서 `key`가 변경되면 해당 컴포넌트는 기존 컴포넌트와 다른 정체성을 가진 것으로 처리됩니다.

이를 이용하면 오류 복구 시 하위 컴포넌트 트리를 새로 마운트할 수 있습니다.

```tsx
import { useState } from 'react';

function DashboardPage() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((key) => key + 1);
  };

  return (
    <div>
      <ErrorBoundary
        key={resetKey}
        fallback={
          <div role="alert">
            <p>Dashboard failed.</p>

            <button onClick={handleReset}>
              Try Again
            </button>
          </div>
        }
      >
        <Dashboard />
      </ErrorBoundary>
    </div>
  );
}
```

위 예제에서는 `resetKey`가 변경되면 기존 Error Boundary가 제거되고 새로운 Error Boundary가 생성됩니다.

이 과정에서 하위 컴포넌트도 새롭게 마운트되므로 기존 하위 컴포넌트의 State가 초기화됩니다.

다만 이 방식은 컴포넌트의 재마운트를 발생시키므로 Effect와 초기화 로직이 다시 실행될 수 있다는 점을 고려해야 합니다.

## 7. Error Boundary의 배치 전략

### 7.1. 애플리케이션 전체를 감싸는 방식

애플리케이션의 최상위에 Error Boundary를 배치하면 하위 컴포넌트에서 발생하는 오류를 포괄적으로 처리할 수 있습니다.

```tsx
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Main />
      <Footer />
    </ErrorBoundary>
  );
}
```

이 방식은 예상하지 못한 오류로 인해 전체 애플리케이션이 중단되는 상황을 방지하는 최종 방어선 역할을 합니다.

다만 최상위 Error Boundary가 오류를 처리하면 해당 Boundary가 감싸고 있는 전체 영역이 Fallback UI로 대체됩니다.

### 7.2. 주요 기능별로 분리하는 방식

서비스의 핵심 기능이나 독립적인 UI 영역을 기준으로 Error Boundary를 배치할 수 있습니다.

```tsx
function Dashboard() {
  return (
    <main>
      <Header />

      <section>
        <ErrorBoundary fallback={<p>Profile unavailable.</p>}>
          <UserProfile />
        </ErrorBoundary>

        <ErrorBoundary fallback={<p>Statistics unavailable.</p>}>
          <Statistics />
        </ErrorBoundary>

        <ErrorBoundary fallback={<p>Activity unavailable.</p>}>
          <ActivityFeed />
        </ErrorBoundary>
      </section>
    </main>
  );
}
```

각 기능이 독립적인 Error Boundary로 보호되므로 특정 기능에 오류가 발생하더라도 다른 기능은 계속 표시할 수 있습니다.

### 7.3. 배치 기준

Error Boundary는 단순히 컴포넌트 개수에 따라 배치하기보다 오류 발생 시 함께 대체되어도 되는 UI 영역을 기준으로 설계하는 것이 좋습니다.

다음과 같은 기준을 고려할 수 있습니다.

- 애플리케이션 전체를 보호하는 최상위 Boundary
- 페이지 또는 라우트 단위의 Boundary
- 독립적으로 동작하는 주요 기능 단위의 Boundary
- 오류 발생 시 다른 UI에 영향을 주지 않아야 하는 위젯 단위의 Boundary

너무 넓은 영역을 하나의 Boundary로 감싸면 일부 컴포넌트의 오류가 전체 화면을 대체할 수 있습니다.

반대로 지나치게 세분화하면 오류 처리 로직과 Fallback UI가 중복될 수 있으므로 적절한 격리 수준을 선택해야 합니다.

## 8. Next.js에서의 Error Boundary

### 8.1. error.tsx

Next.js App Router에서는 `error.tsx` 파일을 통해 라우트 세그먼트 단위의 오류를 처리할 수 있습니다.

`error.tsx`는 해당 라우트 세그먼트와 하위 영역을 감싸는 Error Boundary 역할을 수행합니다.

예를 들어 다음과 같은 디렉터리 구조를 구성할 수 있습니다.

```text
app/
├── layout.tsx
├── page.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   └── error.tsx
│
└── settings/
    ├── page.tsx
    └── error.tsx
```

각 라우트 세그먼트에 `error.tsx`를 배치하면 해당 영역에서 발생한 오류를 독립적으로 처리할 수 있습니다.

### 8.2. error.tsx 구현

Next.js의 `error.tsx`는 Client Component여야 합니다.

```tsx
'use client';

import { useEffect } from 'react';

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>

      <button onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
```

주요 Props는 다음과 같습니다.

| Props | 설명 |
|---|---|
| `error` | 오류 정보를 포함하는 Error 객체입니다. |
| `error.digest` | 서버 측 오류 로그와 연결하는 데 사용할 수 있는 식별 정보입니다. |
| `reset` | 오류가 발생한 라우트 세그먼트를 다시 렌더링하도록 시도하는 함수입니다. |

`reset()`은 오류가 발생한 영역을 다시 렌더링하도록 요청합니다.

오류의 원인이 해결되었다면 정상적인 UI로 복구될 수 있습니다.

### 8.3. Global Error Boundary

Next.js에서는 Root Layout 자체에서 발생한 오류를 처리하기 위해 `global-error.tsx`를 사용할 수 있습니다.

```text
app/
├── layout.tsx
├── global-error.tsx
├── error.tsx
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    └── error.tsx
```

`global-error.tsx`는 Root Layout을 포함한 애플리케이션 최상위 영역의 오류를 처리하기 위한 파일입니다.

```tsx
'use client';

type GlobalErrorProps = {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body>
        <main>
          <h1>Application Error</h1>

          <p>Something went wrong.</p>

          <button onClick={reset}>
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
```

`global-error.tsx`는 Root Layout을 대체하므로 자체적으로 `<html>`과 `<body>` 요소를 정의해야 합니다.

또한 Next.js의 `error.tsx`는 같은 세그먼트의 `layout.tsx`에서 발생한 오류를 처리하지 않습니다.

이러한 오류는 상위 세그먼트의 Error Boundary로 전파되며, Root Layout의 오류는 `global-error.tsx`에서 처리할 수 있습니다.

### 8.4. React Error Boundary와 Next.js error.tsx 비교

| 구분 | React Error Boundary | Next.js error.tsx |
|---|---|---|
| 구현 방식 | Class Component | 파일 시스템 규칙 |
| 적용 범위 | 지정한 컴포넌트 하위 트리 | 해당 라우트 세그먼트 및 하위 영역 |
| Fallback UI | 직접 구현 | 파일에서 정의 |
| 오류 객체 | `componentDidCatch` 등으로 접근 | `error` Props |
| 복구 방식 | State 초기화 및 재마운트 등 | `reset()` |
| Client Component | React 기본 API 기준 별도 제한 없음 | 필수 |
| 전역 오류 처리 | 최상위 Boundary 구성 | `global-error.tsx` |

Next.js의 `error.tsx`는 React의 Error Boundary 개념을 라우팅 구조에 통합한 기능입니다.

일반적인 React 애플리케이션에서는 직접 Error Boundary를 구현할 수 있으며, Next.js App Router에서는 파일 시스템 기반의 오류 처리 규칙을 활용할 수 있습니다.

## 9. Error Boundary와 Suspense의 차이

Error Boundary와 Suspense는 모두 컴포넌트 하위 영역의 렌더링 결과를 대체할 수 있지만, 처리하는 상황이 다릅니다.

| 구분 | Error Boundary | Suspense |
|---|---|---|
| 주요 목적 | 렌더링 오류 처리 | 로딩 상태 처리 |
| 처리 대상 | 하위 컴포넌트에서 발생한 오류 | 하위 컴포넌트가 Suspense가 이해할 수 있는 Promise를 기다리는 상황 |
| 대체 UI | Fallback Error UI | Loading UI |
| 대표적인 사용 사례 | 렌더링 오류, 컴포넌트 예외 | Lazy Loading, Suspense 기반 데이터 로딩 |
| 주요 API | `getDerivedStateFromError`, `componentDidCatch` | `<Suspense fallback={...}>` |

Error Boundary는 정상적으로 렌더링할 수 없는 오류 상황을 처리합니다.

Suspense는 하위 컴포넌트가 준비되지 않아 렌더링을 완료할 수 없는 대기 상황을 처리합니다.

두 기능은 서로 다른 목적을 가지므로 함께 사용할 수 있습니다.

```tsx
import { Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <ErrorBoundary
      fallback={<p>Dashboard failed to load.</p>}
    >
      <Suspense fallback={<p>Loading dashboard...</p>}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}
```

위 구조에서는 다음과 같이 동작합니다.

- `Dashboard`가 로딩 중이면 Suspense의 Fallback UI가 표시됩니다.
- `Dashboard`의 로딩이나 렌더링 과정에서 포착 가능한 오류가 발생하면 Error Boundary의 Fallback UI가 표시됩니다.

즉, Suspense는 대기 상태를 처리하고 Error Boundary는 오류 상태를 처리합니다.

## 10. Error Boundary 설계 시 주의사항

### 10.1. 오류와 정상적인 제어 흐름 구분

Error Boundary는 예상하지 못한 런타임 오류를 처리하기 위한 기능입니다.

일반적인 데이터 부재, 검색 결과 없음, 권한 부족 등 정상적인 비즈니스 상태를 처리하기 위한 용도로 사용해서는 안 됩니다.

예를 들어 다음과 같은 상황은 반드시 Error Boundary로 처리할 필요가 없습니다.

- 검색 결과가 없는 경우
- 사용자가 로그인하지 않은 경우
- 입력값 검증에 실패한 경우
- 요청 결과가 정상적으로 빈 데이터인 경우

이러한 상황은 컴포넌트의 일반적인 State와 조건부 렌더링으로 처리하는 것이 적절합니다.

### 10.2. 오류 정보 노출 제한

오류 객체에는 내부 구현 정보, API 응답 내용, Stack Trace 등이 포함될 수 있습니다.

따라서 사용자에게 표시하는 Fallback UI와 내부 오류 로그를 구분해야 합니다.

- 사용자에게는 이해하기 쉬운 오류 안내를 제공합니다.
- 개발자에게는 오류 원인과 Stack 정보를 기록합니다.
- 외부 모니터링 서비스에는 필요한 오류 정보만 전달합니다.
- 민감한 정보가 로그나 사용자 화면에 노출되지 않도록 관리합니다.

### 10.3. Error Boundary 자체의 오류

Error Boundary는 자신의 하위 컴포넌트에서 발생한 오류만 처리할 수 있습니다.

따라서 Fallback UI를 렌더링하는 과정에서 다시 오류가 발생하면 동일한 Error Boundary가 해당 오류를 처리할 수 없습니다.

이러한 상황에서는 상위 Error Boundary가 오류를 처리하도록 구성해야 합니다.

### 10.4. 모든 오류를 복구할 수 있는 것은 아님

Error Boundary는 오류를 포착하고 대체 UI를 표시하는 기능이지, 오류의 원인을 자동으로 해결하는 기능은 아닙니다.

`reset()` 또는 State 초기화 이후에도 동일한 오류 조건이 유지된다면 다시 오류가 발생할 수 있습니다.

따라서 복구 기능을 구현할 때는 다음 사항을 고려해야 합니다.

- 오류 원인이 일시적인지 확인합니다.
- 다시 렌더링하기 전에 필요한 데이터나 상태를 초기화합니다.
- 복구 실패 시 사용자에게 다른 대응 방법을 제공합니다.
- 반복적인 오류 발생을 모니터링합니다.

## 11. 정리

Error Boundary는 하위 컴포넌트 트리에서 발생한 렌더링 관련 오류를 포착하고 Fallback UI를 표시하는 React 기능입니다.

주요 특징은 다음과 같습니다.

- 하위 컴포넌트의 렌더링 오류를 포착합니다.
- `static getDerivedStateFromError()`를 통해 오류 상태를 설정합니다.
- `componentDidCatch()`를 통해 오류 정보를 수집할 수 있습니다.
- 가장 가까운 상위 Error Boundary가 오류를 처리합니다.
- Event Handler와 일반적인 비동기 콜백의 오류는 자동으로 포착하지 않습니다.
- Class Component를 이용하여 직접 구현할 수 있습니다.
- Fallback UI를 이용하여 오류가 발생한 영역을 대체할 수 있습니다.
- `key` 변경 등을 이용하여 하위 컴포넌트 트리를 재마운트할 수 있습니다.
- Next.js App Router에서는 `error.tsx`와 `global-error.tsx`를 통해 라우트 단위 및 전역 오류를 처리할 수 있습니다.
- Suspense와 함께 사용하면 로딩 상태와 오류 상태를 구분하여 관리할 수 있습니다.

Error Boundary는 애플리케이션의 안정성을 높이기 위한 오류 격리 메커니즘입니다. 적절한 위치에 배치하면 특정 컴포넌트의 오류가 전체 UI에 영향을 주는 것을 줄이고, 사용자에게 일관된 오류 처리 경험을 제공할 수 있습니다.

## 12. 참고자료

### React 공식 문서

- [Component](https://react.dev/reference/react/Component)
  - `getDerivedStateFromError()`와 `componentDidCatch()`의 동작 및 Error Boundary 구현 방법을 설명합니다.
- [React Error Boundaries](https://legacy.reactjs.org/docs/error-boundaries.html)
  - Error Boundary의 도입 배경, 오류 포착 범위 및 처리할 수 없는 오류 유형을 설명합니다.
- [Suspense](https://react.dev/reference/react/Suspense)
  - Suspense의 Fallback UI와 Error Boundary의 역할 차이를 이해하는 데 참고할 수 있습니다.
- [lazy](https://react.dev/reference/react/lazy)
  - 컴포넌트의 지연 로딩과 Error Boundary를 함께 사용하는 방법을 설명합니다.
- [createRoot](https://react.dev/reference/react-dom/client/createRoot)
  - React Root의 `onCaughtError`, `onUncaughtError`, `onRecoverableError` 등의 오류 처리 옵션을 설명합니다.

### Next.js 공식 문서

- [Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
  - Next.js App Router의 예상 가능한 오류와 처리되지 않은 런타임 오류의 처리 방식을 설명합니다.
- [error.js File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/error)
  - `error.tsx`, `reset()`, `global-error.tsx`의 사용 방법과 동작 범위를 설명합니다.

### TypeScript 공식 문서

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  - Error Boundary Props, State 및 오류 객체의 타입을 정의할 때 참고할 수 있습니다.