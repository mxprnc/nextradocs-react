# Component Lifecycle

React Component Lifecycle은 컴포넌트가 생성되어 화면에 표시되고, 업데이트되며, 최종적으로 제거되기까지의 생명주기를 의미합니다.

React 컴포넌트는 UI Tree에 추가되거나, Props와 State 변경에 따라 다시 렌더링되거나, UI Tree에서 제거되는 과정을 거칩니다.

이러한 과정을 이해하면 컴포넌트가 언제 렌더링되는지, Effect가 언제 실행되는지, 외부 리소스를 언제 연결하고 해제해야 하는지 파악할 수 있습니다.

React의 컴포넌트 생명주기는 크게 다음 세 가지 단계로 구분할 수 있습니다.

1. **Mounting:** 컴포넌트가 UI Tree에 처음 추가되는 단계입니다.
2. **Updating:** Props 또는 State 등의 변경으로 컴포넌트가 다시 렌더링되는 단계입니다.
3. **Unmounting:** 컴포넌트가 UI Tree에서 제거되는 단계입니다.

함수형 컴포넌트에서는 Hooks를 사용하여 생명주기와 관련된 동작을 관리합니다. 특히 `useEffect`와 `useLayoutEffect`는 컴포넌트의 외부 시스템 연결, 동기화 및 정리 작업을 처리하는 데 사용됩니다.

## 1. Component Lifecycle Overview

React 컴포넌트는 UI Tree에서의 상태에 따라 생명주기를 거칩니다.

```text
             Component Created
                    |
                    v
                 Mounting
                    |
                    v
               First Render
                    |
                    v
                  Commit
                    |
                    v
             Component Mounted
                    |
                    v
                 Updating
                    |
                    v
              Re-rendering
                    |
                    v
                  Commit
                    |
                    v
             Component Updated
                    |
                    v
                Unmounting
                    |
                    v
            Component Removed
```

위 흐름은 컴포넌트의 일반적인 생명주기를 개념적으로 표현한 것입니다.

React의 실제 렌더링 과정에서는 Concurrent Rendering 등의 기능으로 인해 Render 작업이 중단되거나 다시 시작될 수 있습니다. 따라서 컴포넌트 함수의 실행 횟수와 실제 Mount 또는 Update 횟수가 항상 일치하는 것은 아닙니다.

또한 함수형 컴포넌트에서는 Class Component와 같은 명시적인 Lifecycle Method를 사용하지 않습니다. 대신 Hooks를 통해 필요한 작업을 선언적으로 관리합니다.

## 2. Mounting

Mounting은 컴포넌트가 React UI Tree에 처음 추가되는 과정입니다.

일반적으로 부모 컴포넌트가 해당 컴포넌트를 처음 렌더링하거나, 조건부 렌더링을 통해 컴포넌트가 새롭게 표시될 때 발생합니다.

다음 예제를 살펴보겠습니다.

```tsx
function UserProfile() {
  return (
    <section>
      <h1>User Profile</h1>
      <p>Welcome to React.</p>
    </section>
  );
}

function App() {
  return (
    <main>
      <UserProfile />
    </main>
  );
}
```

초기 렌더링이 진행되면 React는 `App`과 `UserProfile`을 렌더링하고, Commit 단계에서 필요한 DOM 노드를 생성하여 화면에 반영합니다.

Mounting 과정은 개념적으로 다음과 같습니다.

```text
App Render
    |
    v
UserProfile Render
    |
    v
DOM Creation
    |
    v
DOM Commit
    |
    v
UserProfile Mounted
```

### 2.1 State Initialization

컴포넌트가 처음 Mount될 때 State가 초기화됩니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
```

`Counter`가 처음 Mount되면 `count`는 초기값인 `0`으로 설정됩니다.

이후 컴포넌트가 다시 렌더링되더라도 동일한 컴포넌트 정체성이 유지된다면 기존 State가 보존됩니다.

### 2.2 Effect Setup

`useEffect`는 컴포넌트가 Commit된 이후 외부 시스템과 동기화하는 작업을 수행할 수 있습니다.

```tsx
import { useEffect } from 'react';

function UserProfile() {
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  return <h1>User Profile</h1>;
}
```

빈 Dependency Array(`[]`)를 전달하면 Effect는 해당 컴포넌트 인스턴스의 최초 Commit 이후 실행됩니다.

일반적으로 Mount 시점에 수행하는 다음과 같은 작업에 활용할 수 있습니다.

- 외부 시스템과의 연결
- 이벤트 구독
- 타이머 설정
- 브라우저 API와의 동기화
- 외부 라이브러리 초기화

다만 `useEffect`의 실행 시점은 브라우저 Paint와 상호작용하는 업데이트 상황에 따라 달라질 수 있습니다.

`useEffect`는 단순히 컴포넌트가 Mount되었다는 사실을 기록하기 위한 Lifecycle Callback이라기보다, React 외부 시스템과 컴포넌트의 동기화 상태를 관리하는 Hook입니다.

## 3. Updating

Updating은 컴포넌트의 Props, State 또는 Context 등의 변경으로 새로운 렌더링이 발생하는 과정입니다.

컴포넌트가 다시 렌더링되면 React는 새로운 UI를 계산하고 기존 렌더링 결과와 비교하여 필요한 변경 사항을 Commit합니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
```

버튼을 클릭하여 `setCount()`가 호출되면 React는 새로운 렌더링을 예약합니다.

이후 `Counter` 컴포넌트가 다시 실행되고, 변경된 State를 기반으로 새로운 UI를 계산합니다.

```text
User Interaction
       |
       v
State Update
       |
       v
Re-render
       |
       v
New UI Calculation
       |
       v
Reconciliation
       |
       v
Commit
       |
       v
Updated UI
```

### 3.1 Props Update

부모 컴포넌트에서 전달하는 Props가 변경되면 자식 컴포넌트도 새로운 Props를 기반으로 렌더링될 수 있습니다.

```tsx
interface UserProps {
  name: string;
}

function UserProfile({ name }: UserProps) {
  return <h1>Hello, {name}</h1>;
}

function App() {
  const [name, setName] = useState('Alice');

  return (
    <div>
      <UserProfile name={name} />

      <button onClick={() => setName('Bob')}>
        Change User
      </button>
    </div>
  );
}
```

`name`이 변경되면 `App`이 다시 렌더링되고 새로운 Props가 `UserProfile`에 전달됩니다.

동일한 Component Type과 위치가 유지되므로 `UserProfile`은 기존 컴포넌트로 유지됩니다.

Props가 변경되었다고 해서 컴포넌트가 새롭게 Mount되는 것은 아닙니다.

### 3.2 State Update

컴포넌트 내부의 State가 변경되면 해당 컴포넌트의 새로운 렌더링이 예약됩니다.

```tsx
import { useState } from 'react';

function Toggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      {isVisible && <p>Visible Content</p>}

      <button onClick={() => setIsVisible((prev) => !prev)}>
        Toggle
      </button>
    </div>
  );
}
```

`isVisible`이 변경되면 `Toggle`이 다시 렌더링됩니다.

이때 조건부로 렌더링되는 `<p>` Element의 존재 여부도 변경됩니다.

- `false`에서 `true`로 변경되면 새로운 Element가 Mount됩니다.
- `true`에서 `false`로 변경되면 기존 Element가 Unmount됩니다.

즉, 부모 컴포넌트의 Updating 과정에서 자식 컴포넌트의 Mounting 또는 Unmounting이 함께 발생할 수 있습니다.

### 3.3 Effect Re-execution

`useEffect`는 Dependency Array에 지정된 값이 변경되면 기존 Effect의 Cleanup을 실행한 후 새로운 Effect를 실행합니다.

```tsx
import { useEffect } from 'react';

interface UserProfileProps {
  userId: string;
}

function UserProfile({ userId }: UserProfileProps) {
  useEffect(() => {
    console.log(`Subscribe to user: ${userId}`);

    return () => {
      console.log(`Unsubscribe from user: ${userId}`);
    };
  }, [userId]);

  return <h1>User ID: {userId}</h1>;
}
```

`userId`가 변경되면 다음 순서로 동작합니다.

1. 새로운 Props를 기반으로 컴포넌트가 렌더링됩니다.
2. 변경 사항이 Commit됩니다.
3. 기존 Effect의 Cleanup이 실행됩니다.
4. 새로운 Dependency를 기준으로 Effect가 실행됩니다.

개념적인 실행 흐름은 다음과 같습니다.

```text
Initial Commit
      |
      v
Effect Setup
      |
      v
Dependency Changed
      |
      v
Component Update
      |
      v
Commit
      |
      v
Previous Cleanup
      |
      v
New Effect Setup
```

이러한 방식은 외부 시스템과 React 컴포넌트의 동기화 상태를 유지하는 데 사용됩니다.

## 4. Unmounting

Unmounting은 컴포넌트가 React UI Tree에서 제거되는 과정입니다.

다음과 같은 상황에서 발생할 수 있습니다.

- 조건부 렌더링의 결과로 컴포넌트가 제거되는 경우
- 부모 컴포넌트가 제거되는 경우
- 리스트에서 특정 항목이 삭제되는 경우
- Component Type 또는 Key 변경으로 기존 컴포넌트가 교체되는 경우

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function UserProfile() {
  return <h1>User Profile</h1>;
}

function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      {isVisible && <UserProfile />}

      <button onClick={() => setIsVisible(false)}>
        Remove Profile
      </button>
    </div>
  );
}
```

`isVisible`이 `false`로 변경되면 React는 `UserProfile`을 UI Tree에서 제거합니다.

이 과정에서 컴포넌트에 연결된 State가 제거되고 관련 Effect의 Cleanup이 실행됩니다.

### 4.1 Effect Cleanup

`useEffect`에서 반환하는 함수는 Effect의 Cleanup Function입니다.

```tsx
import { useEffect } from 'react';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, []);

  return <h1>Chat Room</h1>;
}
```

`ChatRoom`이 Mount되면 연결을 생성하고, Unmount되면 연결을 해제합니다.

Cleanup은 다음과 같은 상황에서 실행됩니다.

- 컴포넌트가 Unmount될 때
- Effect의 Dependency가 변경되어 Effect를 다시 실행하기 직전

Cleanup은 Effect가 설정한 외부 리소스를 정리하는 역할을 수행합니다.

대표적인 대상은 다음과 같습니다.

- WebSocket 연결
- Event Listener
- Timer
- Subscription
- 외부 라이브러리 리소스

### 4.2 Event Listener Cleanup

브라우저 이벤트를 구독하는 경우 Cleanup에서 구독을 해제해야 합니다.

```tsx
import { useEffect } from 'react';

function WindowResizeListener() {
  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <h1>Resize the Window</h1>;
}
```

컴포넌트가 Mount되면 `resize` 이벤트를 구독합니다.

Unmount되면 동일한 이벤트 핸들러를 사용하여 구독을 해제합니다.

Cleanup을 수행하지 않으면 컴포넌트가 제거된 이후에도 이벤트 리스너가 남아 불필요한 리소스를 소비하거나 예상하지 못한 동작을 유발할 수 있습니다.

## 5. useEffect and Component Lifecycle

함수형 컴포넌트에서는 `useEffect`를 사용하여 컴포넌트의 외부 시스템과 동기화하는 작업을 관리합니다.

Class Component에서 사용하던 Lifecycle Method와 일부 유사한 동작을 구현할 수 있지만, `useEffect`를 단순히 Lifecycle Method의 대체물로 이해해서는 안 됩니다.

`useEffect`는 Dependency에 따라 Effect의 Setup과 Cleanup을 관리하는 구조입니다.

### 5.1 Effect with Empty Dependency Array

빈 Dependency Array를 전달하면 해당 컴포넌트 인스턴스의 최초 Commit 이후 Effect가 실행됩니다.

```tsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log('Effect setup');

    return () => {
      console.log('Effect cleanup');
    };
  }, []);

  return <h1>Hello, React!</h1>;
}
```

일반적인 프로덕션 환경에서는 다음과 같이 동작합니다.

```text
Mount
  |
  v
Effect Setup
  |
  v
Unmount
  |
  v
Effect Cleanup
```

이 방식은 컴포넌트가 유지되는 동안 외부 시스템과 연결 상태를 유지해야 하는 경우에 사용할 수 있습니다.

### 5.2 Effect with Dependencies

Dependency Array에 특정 값을 전달하면 해당 값이 변경될 때 Effect가 다시 실행됩니다.

```tsx
import { useEffect, useState } from 'react';

function UserProfile() {
  const [userId, setUserId] = useState('user-1');

  useEffect(() => {
    console.log(`Loading user: ${userId}`);

    return () => {
      console.log(`Cleanup user: ${userId}`);
    };
  }, [userId]);

  return (
    <div>
      <p>{userId}</p>

      <button onClick={() => setUserId('user-2')}>
        Change User
      </button>
    </div>
  );
}
```

`userId`가 변경되면 이전 Effect의 Cleanup이 실행된 후 새로운 Effect가 실행됩니다.

React는 Dependency Array의 각 항목을 이전 렌더링과 비교할 때 `Object.is`를 사용합니다.

따라서 객체나 함수가 Dependency에 포함되어 있다면 참조가 변경되는 경우 Effect가 다시 실행될 수 있습니다.

### 5.3 Effect Without Dependency Array

Dependency Array를 생략하면 컴포넌트가 Commit될 때마다 Effect가 실행됩니다.

```tsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log('Effect executed');

    return () => {
      console.log('Effect cleanup');
    };
  });

  return <h1>Hello, React!</h1>;
}
```

이 경우 Effect는 최초 Commit 이후뿐 아니라 이후의 모든 Commit 이후에도 실행됩니다.

Effect를 다시 실행하기 전에는 이전 Cleanup이 먼저 수행됩니다.

이 방식은 모든 Commit 이후 외부 시스템과 동기화해야 하는 경우에 사용할 수 있지만, 불필요한 Effect 실행이 발생하지 않는지 주의해야 합니다.

### 5.4 Dependency Array Comparison

세 가지 형태를 비교하면 다음과 같습니다.

| 형태 | Effect 실행 조건 |
|---|---|
| Dependency Array 생략 | 모든 Commit 이후 |
| `[]` | 최초 Commit 이후 |
| `[value]` | 최초 Commit 이후 및 Dependency 변경 이후 |

Dependency가 변경되어 Effect가 다시 실행되는 경우 이전 Cleanup이 먼저 수행됩니다.

Effect는 컴포넌트의 렌더링 자체를 제어하는 수단이 아니라 외부 시스템과의 동기화를 위한 수단이라는 점을 이해해야 합니다.

## 6. useLayoutEffect and Lifecycle

`useLayoutEffect`는 `useEffect`와 유사하지만 실행 시점이 다릅니다.

`useLayoutEffect`는 DOM 변경이 Commit된 이후 브라우저가 화면을 Paint하기 전에 실행됩니다.

반면 `useEffect`는 일반적으로 브라우저 Paint 이후 실행될 수 있습니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

function Tooltip() {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const element = tooltipRef.current;

    if (element) {
      setHeight(element.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div>
      <div ref={tooltipRef}>
        Tooltip Content
      </div>

      <p>Height: {height}</p>
    </div>
  );
}
```

`useLayoutEffect`는 DOM 요소의 크기나 위치를 측정하고, 화면이 그려지기 전에 필요한 업데이트를 수행해야 하는 경우에 사용할 수 있습니다.

일반적인 Effect는 `useEffect`를 우선적으로 사용하고, Paint 이전에 동기적인 DOM 측정이나 변경이 필요한 경우에 `useLayoutEffect`를 고려하는 것이 좋습니다.

## 7. Class Component Lifecycle Methods

React의 초기 버전부터 사용되어 온 Class Component는 명시적인 Lifecycle Method를 제공합니다.

주요 Lifecycle Method는 다음과 같습니다.

| Lifecycle Method | 실행 시점 |
|---|---|
| `constructor` | 인스턴스 생성 시 |
| `render` | 초기 렌더링 및 업데이트 시 |
| `componentDidMount` | Mount 이후 |
| `componentDidUpdate` | 업데이트 Commit 이후 |
| `componentWillUnmount` | Unmount 직전 |
| `shouldComponentUpdate` | 업데이트 여부를 결정하기 전 |
| `getSnapshotBeforeUpdate` | DOM 변경 직전 |
| `getDerivedStateFromProps` | 렌더링 과정에서 Props 기반 State 계산 |
| `getDerivedStateFromError` | 하위 컴포넌트의 렌더링 오류 처리 |
| `componentDidCatch` | 하위 컴포넌트의 오류 발생 이후 |

### 7.1 Mounting Methods

Class Component의 Mounting 과정에서는 다음 Method가 사용됩니다.

```tsx
import { Component } from 'react';

class UserProfile extends Component {
  componentDidMount() {
    console.log('Component mounted');
  }

  render() {
    return <h1>User Profile</h1>;
  }
}
```

`componentDidMount()`는 컴포넌트의 초기 렌더링 결과가 DOM에 Commit된 이후 실행됩니다.

주로 다음과 같은 작업에 활용됩니다.

- 외부 시스템 연결
- DOM 측정
- 데이터 구독
- 외부 라이브러리 초기화

### 7.2 Updating Methods

Class Component가 업데이트되면 `render()`가 다시 실행되고, Commit 이후 `componentDidUpdate()`가 호출됩니다.

```tsx
import { Component } from 'react';

interface UserProps {
  name: string;
}

class UserProfile extends Component<UserProps> {
  componentDidUpdate(prevProps: UserProps) {
    if (prevProps.name !== this.props.name) {
      console.log('User name updated');
    }
  }

  render() {
    return <h1>{this.props.name}</h1>;
  }
}
```

`componentDidUpdate()`는 이전 Props와 State를 현재 값과 비교하여 업데이트 이후 필요한 작업을 수행할 수 있도록 지원합니다.

### 7.3 Unmounting Methods

`componentWillUnmount()`는 컴포넌트가 제거되기 직전에 실행됩니다.

```tsx
import { Component } from 'react';

class ChatRoom extends Component {
  componentDidMount() {
    console.log('Connect to chat room');
  }

  componentWillUnmount() {
    console.log('Disconnect from chat room');
  }

  render() {
    return <h1>Chat Room</h1>;
  }
}
```

주로 외부 연결 해제, 이벤트 구독 취소, 타이머 제거 등의 작업에 사용됩니다.

## 8. Lifecycle Methods and Hooks Comparison

Class Component의 Lifecycle Method와 함수형 컴포넌트의 Hooks는 서로 다른 방식으로 생명주기 관련 작업을 관리합니다.

다음 표는 대표적인 대응 관계를 설명합니다.

| Class Component | Function Component |
|---|---|
| `componentDidMount` | `useEffect(..., [])` |
| `componentDidUpdate` | Dependency가 변경된 `useEffect` |
| `componentWillUnmount` | `useEffect`의 Cleanup |
| `componentDidMount` / `componentDidUpdate` | `useLayoutEffect`를 통한 Layout 동기화 |
| `shouldComponentUpdate` | `memo` 등의 최적화 |

이 표는 개념적인 대응 관계이며 완전히 동일한 실행 시점을 의미하지는 않습니다.

예를 들어 `componentDidUpdate()`는 Commit 이후 실행되지만, `useEffect()`는 브라우저 Paint 이후 실행될 수 있습니다.

또한 `useEffect(..., [])`는 Class Component의 `componentDidMount()`와 유사한 사용 사례를 제공하지만, Effect의 Setup과 Cleanup이라는 별도의 동기화 모델을 사용합니다.

React에서는 새로운 컴포넌트를 작성할 때 함수형 컴포넌트와 Hooks를 사용하는 방식을 권장합니다.

Class Component는 기존 코드베이스를 유지보수하거나 Error Boundary를 구현하는 등의 상황에서 여전히 사용될 수 있습니다.

## 9. Strict Mode and Lifecycle

Strict Mode는 개발 환경에서 컴포넌트의 잠재적인 문제를 탐지하기 위한 검사 기능입니다.

React 18 이후의 개발 환경에서는 Strict Mode가 활성화된 경우 최초 Mount 과정에서 Effect의 Setup과 Cleanup을 추가로 실행하여 Effect가 올바르게 정리되는지 확인합니다.

다음 예제를 살펴보겠습니다.

```tsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  useEffect(() => {
    console.log('Effect setup');

    return () => {
      console.log('Effect cleanup');
    };
  }, []);

  return <h1>Hello, React!</h1>;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

개발 환경에서 일반적으로 다음과 같은 Effect 실행 순서를 확인할 수 있습니다.

```text
Initial Mount
     |
     v
Effect Setup
     |
     v
Effect Cleanup
     |
     v
Effect Setup
```

이는 실제 프로덕션 환경에서 컴포넌트가 반드시 Unmount되고 다시 Mount된다는 의미가 아닙니다.

React는 Effect가 외부 리소스를 올바르게 정리하고 다시 연결할 수 있는지 검증하기 위해 개발 환경에서 추가적인 Setup 및 Cleanup 사이클을 수행합니다.

따라서 Effect를 구현할 때는 특정 횟수만 실행된다는 가정에 의존하지 않고 Setup과 Cleanup이 대칭적으로 동작하도록 작성해야 합니다.

## 10. Important Considerations

컴포넌트 생명주기를 이해할 때 다음 사항에 주의해야 합니다.

### 10.1 Rendering Is Not the Same as Mounting

컴포넌트 함수가 실행되었다고 해서 항상 새로운 Mount가 발생하는 것은 아닙니다.

동일한 Component Type과 위치가 유지되는 경우에는 기존 컴포넌트가 다시 렌더링되는 Updating 과정입니다.

### 10.2 Effect Is Not a Direct Lifecycle Replacement

`useEffect`는 Class Component의 Lifecycle Method를 단순하게 대체하기 위한 Hook이 아닙니다.

Effect는 외부 시스템과 React 컴포넌트의 상태를 동기화하는 목적으로 설계되었습니다.

### 10.3 Cleanup Runs Before Re-execution

Effect의 Dependency가 변경되면 이전 Effect의 Cleanup이 새로운 Effect의 Setup보다 먼저 실행됩니다.

따라서 Cleanup은 단순히 Unmount 시점에만 실행되는 것이 아닙니다.

### 10.4 Strict Mode May Perform Additional Checks

개발 환경에서는 Strict Mode에 의해 컴포넌트 함수나 Effect가 추가로 실행될 수 있습니다.

이는 React의 동작 오류를 의미하지 않으며, 컴포넌트의 순수성과 Effect Cleanup을 검증하기 위한 동작입니다.

### 10.5 Concurrent Rendering Changes Execution Assumptions

Concurrent Rendering 환경에서는 Render 작업이 중단되거나 다시 시작될 수 있습니다.

Render 단계에서 실행되는 코드는 Commit이 보장되지 않으므로 렌더링 과정에서 부수 효과를 발생시키지 않아야 합니다.

외부 시스템과의 동기화는 `useEffect` 또는 `useLayoutEffect` 등 적절한 API를 사용해야 합니다.

## 11. Summary

React Component Lifecycle은 컴포넌트가 UI Tree에 추가되고, 업데이트되며, 제거되는 과정을 설명하는 개념입니다.

| Lifecycle | 주요 역할 | 관련 Hooks |
|---|---|---|
| Mounting | 컴포넌트가 UI Tree에 처음 추가됩니다. | `useEffect`, `useLayoutEffect` |
| Updating | Props, State 등의 변경으로 새로운 UI가 계산됩니다. | `useEffect`, `useLayoutEffect`, `useState` |
| Unmounting | 컴포넌트가 UI Tree에서 제거됩니다. | Effect Cleanup |

핵심적으로 다음 사항을 이해해야 합니다.

- Mounting은 컴포넌트가 UI Tree에 처음 추가되는 과정입니다.
- Updating은 Props, State 등의 변경으로 컴포넌트가 다시 렌더링되는 과정입니다.
- Unmounting은 컴포넌트가 UI Tree에서 제거되는 과정입니다.
- `useEffect`는 외부 시스템과의 동기화를 관리합니다.
- Effect의 Cleanup은 Dependency 변경 전과 컴포넌트 Unmount 시 실행됩니다.
- `useLayoutEffect`는 브라우저 Paint 이전에 동기적인 작업을 수행해야 하는 경우 사용합니다.
- Strict Mode는 개발 환경에서 추가 검사를 수행할 수 있습니다.
- Render 단계의 실행과 실제 Mount 또는 Commit은 구분해야 합니다.

컴포넌트 생명주기는 Hooks, Reconciliation, State Preservation 및 Rendering 과정을 이해하기 위한 기본 개념입니다.

## 12. References

- [React Official Documentation - Render and Commit](https://react.dev/learn/render-and-commit)
- [React Official Documentation - Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React Official Documentation - Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [React Official Documentation - useEffect](https://react.dev/reference/react/useEffect)
- [React Official Documentation - useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)
- [React Official Documentation - StrictMode](https://react.dev/reference/react/StrictMode)
- [React Official Documentation - Component](https://react.dev/reference/react/Component)
- [React Official Documentation - Your First Component](https://react.dev/learn/your-first-component)
- [React Legacy Documentation - State and Lifecycle](https://legacy.reactjs.org/docs/state-and-lifecycle.html)