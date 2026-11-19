

# Strict Mode

## 1. Strict Mode란?

**Strict Mode**는 React 애플리케이션의 개발 과정에서 잠재적인 문제를 조기에 발견하기 위한 검사 기능입니다.

`StrictMode` 컴포넌트로 특정 컴포넌트 트리를 감싸면 React는 해당 영역에 추가적인 검사와 개발 환경 전용 동작을 적용합니다.

Strict Mode는 별도의 UI를 렌더링하지 않으며 애플리케이션의 실제 기능을 변경하지 않습니다. 대신 컴포넌트의 순수성, Effect의 정리 로직, Ref Callback의 정리 로직, Deprecated API 사용 여부 등을 검사합니다.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(
  document.getElementById("root")!,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

위 예제에서는 `App`과 그 하위 컴포넌트 전체에 Strict Mode 검사가 적용됩니다.

Strict Mode의 추가 검사는 개발 환경에서만 수행되며 프로덕션 빌드에서는 적용되지 않습니다.

## 2. Strict Mode의 주요 기능

Strict Mode는 개발 환경에서 다음과 같은 추가 검사를 수행합니다.

| 검사 항목 | 목적 |
|---|---|
| 컴포넌트 추가 렌더링 | 순수하지 않은 렌더링 로직 탐지 |
| Effect 추가 실행 | Effect cleanup 누락 및 외부 리소스 정리 문제 탐지 |
| Callback Ref 추가 실행 | Ref Callback cleanup 누락 및 메모리 누수 탐지 |
| Deprecated API 검사 | 더 이상 권장되지 않는 API 사용 탐지 |

이러한 검사는 실제 프로덕션 환경에서 발생할 수 있는 버그를 개발 단계에서 미리 확인하기 위한 것입니다.

특히 React는 컴포넌트가 여러 번 렌더링되거나 Effect가 여러 번 설정 및 해제되더라도 올바르게 동작할 수 있도록 설계되어야 합니다. Strict Mode는 이러한 조건을 개발 환경에서 의도적으로 검증합니다.

## 3. Strict Mode 적용 범위

Strict Mode는 애플리케이션 전체 또는 특정 컴포넌트 영역에 적용할 수 있습니다.

### 3.1. 애플리케이션 전체에 적용

일반적으로 애플리케이션의 최상위 컴포넌트를 `StrictMode`로 감싸는 방식을 사용합니다.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(
  document.getElementById("root")!,
);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

이 경우 `App`과 모든 하위 컴포넌트에 Strict Mode 검사가 적용됩니다.

애플리케이션 전체에 적용하면 컴포넌트 간의 의존 관계와 Effect 실행 흐름을 일관된 기준으로 검증할 수 있습니다.

### 3.2. 특정 컴포넌트 영역에 적용

Strict Mode는 애플리케이션의 일부 영역에만 적용할 수도 있습니다.

```tsx
import { StrictMode } from "react";

export default function App() {
  return (
    <>
      <Header />

      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>

      <Footer />
    </>
  );
}
```

위 예제에서는 `Sidebar`, `Content`와 해당 컴포넌트의 하위 트리에만 Strict Mode 검사가 적용됩니다.

`Header`와 `Footer`에는 적용되지 않습니다.

단, Strict Mode를 루트가 아닌 하위 트리에만 적용하는 경우에는 루트 전체에 적용했을 때와 일부 동작이 다릅니다.

예를 들어 Effect의 초기 추가 실행은 실제 프로덕션에서 발생할 수 없는 부모와 자식 Effect의 실행 순서를 만들지 않도록, 루트에 Strict Mode가 적용된 경우에만 수행됩니다.

따라서 하위 트리에만 Strict Mode를 적용하면 초기 마운트 시 Effect의 추가 setup → cleanup → setup 검사가 수행되지 않을 수 있습니다.

## 4. 컴포넌트의 순수성 검사

React는 컴포넌트를 동일한 입력에 대해 동일한 결과를 반환하는 순수 함수로 작성할 것을 권장합니다.

컴포넌트의 렌더링 로직은 Props, State, Context 등의 입력값을 바탕으로 JSX를 계산해야 합니다.

렌더링 과정에서 외부 데이터를 직접 변경하거나 예측할 수 없는 부수 효과를 발생시키면 여러 번 렌더링되는 상황에서 예상하지 못한 결과가 발생할 수 있습니다.

Strict Mode는 이러한 문제를 발견하기 위해 개발 환경에서 컴포넌트 함수를 추가로 호출합니다.

### 4.1. 추가 렌더링

Strict Mode에서는 컴포넌트 함수가 개발 환경에서 추가로 호출됩니다.

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Counter() {
  console.log("Counter rendered");

  return <h1>Counter</h1>;
}

const root = createRoot(
  document.getElementById("root")!,
);

root.render(
  <StrictMode>
    <Counter />
  </StrictMode>,
);
```

Strict Mode가 활성화된 개발 환경에서는 초기 렌더링 과정에서 다음과 같이 컴포넌트 함수가 추가로 호출될 수 있습니다.

```text
Counter rendered
Counter rendered
```

이는 실제 DOM에 동일한 컴포넌트가 두 번 표시된다는 의미가 아닙니다.

React가 렌더링 로직의 순수성을 확인하기 위해 컴포넌트 함수를 추가로 호출하는 것입니다.

순수한 컴포넌트라면 동일한 입력으로 여러 번 호출되어도 동일한 결과를 반환해야 합니다.

### 4.2. 렌더링 중 외부 데이터 변경

다음 예제는 Props로 전달받은 배열을 직접 변경하는 잘못된 구현입니다.

```tsx
interface Story {
  id: number;
  title: string;
}

interface StoryListProps {
  stories: Story[];
}

function StoryList({ stories }: StoryListProps) {
  stories.push({
    id: 999,
    title: "Create Story",
  });

  return (
    <ul>
      {stories.map((story) => (
        <li key={story.id}>
          {story.title}
        </li>
      ))}
    </ul>
  );
}
```

위 컴포넌트는 렌더링할 때마다 전달받은 배열에 새로운 항목을 추가합니다.

Strict Mode에서는 컴포넌트가 추가로 호출되므로 동일한 항목이 중복으로 추가되는 문제가 드러날 수 있습니다.

Props는 컴포넌트 외부에서 전달받은 입력값이므로 직접 변경해서는 안 됩니다.

다음과 같이 배열을 복사한 후 변경해야 합니다.

```tsx
function StoryList({ stories }: StoryListProps) {
  const items = [...stories];

  items.push({
    id: 999,
    title: "Create Story",
  });

  return (
    <ul>
      {items.map((story) => (
        <li key={story.id}>
          {story.title}
        </li>
      ))}
    </ul>
  );
}
```

새로운 배열을 생성하여 사용하면 원본 Props를 변경하지 않으므로 렌더링 과정의 순수성을 유지할 수 있습니다.

### 4.3. 추가 호출되는 함수

Strict Mode는 컴포넌트 함수뿐 아니라 순수해야 하는 일부 함수도 추가로 호출합니다.

대표적인 대상은 다음과 같습니다.

- 함수형 컴포넌트의 최상위 렌더링 로직
- `useState`의 초기화 함수
- State Setter에 전달하는 함수형 업데이트 함수
- `useReducer`의 Reducer 함수
- `useReducer`의 초기화 함수
- `useMemo`의 계산 함수
- 일부 Class Component의 메서드

예를 들어 `useState`의 초기화 함수는 다음과 같이 추가 호출될 수 있습니다.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(() => {
    console.log("Initialize State");

    return 0;
  });

  return (
    <button
      onClick={() => {
        setCount((previous) => previous + 1);
      }}
    >
      {count}
    </button>
  );
}
```

따라서 초기화 함수나 State 업데이트 함수 내부에서 외부 데이터를 변경하는 등의 부수 효과를 발생시키지 않아야 합니다.

반면 이벤트 핸들러는 사용자의 상호작용에 따라 실행되는 함수이므로 Strict Mode가 순수성 검사를 위해 임의로 두 번 호출하지 않습니다.

### 4.4. Class Component의 추가 호출

Strict Mode는 일부 Class Component 메서드도 추가로 호출하여 부작용을 검사합니다.

대표적인 대상은 다음과 같습니다.

- `constructor`
- `render`
- `shouldComponentUpdate`
- `getDerivedStateFromProps`
- `getSnapshotBeforeUpdate`

이러한 메서드는 렌더링 과정의 순수성을 유지해야 합니다.

특히 `constructor`나 `render`에서 외부 리소스를 생성하거나 데이터를 변경하는 로직을 작성하지 않도록 주의해야 합니다.

## 5. Effect의 추가 실행과 Cleanup 검사

Strict Mode는 Effect의 cleanup 로직이 올바르게 구현되어 있는지 확인하기 위해 개발 환경에서 Effect를 추가로 실행합니다.

일반적으로 Effect는 다음과 같은 순서로 동작합니다.

1. 컴포넌트가 마운트되면 Effect의 setup 함수를 실행합니다.
2. 의존성이 변경되면 이전 Effect의 cleanup 함수를 실행합니다.
3. 변경된 의존성을 기준으로 새로운 Effect의 setup 함수를 실행합니다.
4. 컴포넌트가 언마운트되면 마지막 Effect의 cleanup 함수를 실행합니다.

Strict Mode에서는 초기 마운트 시 추가적인 setup 및 cleanup 사이클을 수행합니다.

```text
일반적인 초기 마운트

setup


Strict Mode의 초기 마운트

setup
cleanup
setup
```

이 검사는 Effect가 여러 번 설정되고 해제되는 상황에서도 올바르게 동작하는지 확인하기 위한 것입니다.

### 5.1. Cleanup이 없는 Effect

다음 예제는 외부 서버에 연결하지만 연결을 해제하는 cleanup 함수를 반환하지 않습니다.

```tsx
import { useEffect } from "react";

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(
      "https://example.com",
      "general",
    );

    connection.connect();
  }, []);

  return <h1>Chat Room</h1>;
}
```

위 Effect는 초기 마운트 시 연결을 생성하지만 컴포넌트가 언마운트되거나 Effect가 다시 실행될 때 기존 연결을 해제하지 않습니다.

Strict Mode에서는 초기 마운트 과정에서 Effect가 추가 실행되므로 연결이 중복으로 생성되는 문제가 드러날 수 있습니다.

### 5.2. Cleanup을 통한 해결

외부 리소스를 생성하는 Effect는 해당 리소스를 정리하는 cleanup 함수를 반환해야 합니다.

```tsx
import { useEffect } from "react";

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(
      "https://example.com",
      "general",
    );

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, []);

  return <h1>Chat Room</h1>;
}
```

이제 Effect가 다시 실행되거나 컴포넌트가 언마운트되면 기존 연결을 해제할 수 있습니다.

Strict Mode에서는 다음과 같은 실행 순서가 만들어집니다.

```text
1. setup
   - 연결 생성

2. cleanup
   - 연결 해제

3. setup
   - 새로운 연결 생성
```

최종적으로 활성화된 연결은 하나만 유지됩니다.

### 5.3. Cleanup이 필요한 대표적인 작업

Effect에서 다음과 같은 작업을 수행한다면 정리 로직이 필요한지 확인해야 합니다.

| 작업 | Cleanup 예시 |
|---|---|
| WebSocket 연결 | 연결 종료 |
| 이벤트 리스너 등록 | 리스너 제거 |
| 타이머 등록 | 타이머 해제 |
| 구독 등록 | 구독 해제 |
| Observer 등록 | Observer 연결 해제 |
| 외부 라이브러리 인스턴스 생성 | 인스턴스 정리 |
| 네트워크 요청 | 필요에 따라 요청 취소 또는 결과 무시 |

예를 들어 이벤트 리스너를 등록하는 Effect는 다음과 같이 작성할 수 있습니다.

```tsx
import { useEffect } from "react";

function WindowListener() {
  useEffect(() => {
    function handleResize() {
      console.log(window.innerWidth);
    }

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  return <div>Window Listener</div>;
}
```

setup에서 등록한 이벤트 리스너를 cleanup에서 제거하므로 Effect가 여러 번 실행되어도 리스너가 중복 등록되지 않습니다.

### 5.4. Effect 실행을 막는 방식은 올바른 해결책이 아닙니다

Strict Mode에서 Effect가 두 번 실행되는 현상을 피하기 위해 `useRef`로 실행 여부를 확인하는 패턴은 일반적인 해결책이 아닙니다.

```tsx
import { useEffect, useRef } from "react";

function ChatRoom() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const connection = createConnection();

    connection.connect();
  }, []);

  return <div>Chat Room</div>;
}
```

위 코드는 두 번째 Effect 실행을 차단하지만 연결을 해제하는 로직은 여전히 없습니다.

컴포넌트가 실제로 언마운트되거나 다시 마운트되는 상황에서는 리소스가 정상적으로 정리되지 않을 수 있습니다.

Strict Mode의 목적은 Effect 실행 횟수를 줄이는 것이 아니라 Effect가 반복적으로 설정되고 해제되더라도 올바르게 동작하도록 만드는 것입니다.

따라서 실행 여부를 차단하기보다 setup과 cleanup이 대칭적으로 동작하도록 구현해야 합니다.

## 6. Callback Ref의 추가 실행과 Cleanup 검사

React에서 Ref는 DOM 요소나 특정 객체에 접근할 때 사용합니다.

Ref를 전달하는 방법 중 하나인 **Callback Ref**는 DOM 요소가 연결되거나 해제될 때 실행되는 함수입니다.

```tsx
function Input() {
  return (
    <input
      ref={(node) => {
        console.log(node);
      }}
    />
  );
}
```

Callback Ref는 DOM 노드가 연결될 때 해당 노드를 인자로 전달받습니다.

DOM 노드가 제거되면 일반적으로 `null`을 전달받아 기존 참조를 정리할 수 있습니다.

React 19에서는 Callback Ref가 cleanup 함수를 반환하는 방식도 지원합니다.

Strict Mode는 개발 환경에서 Callback Ref의 setup 및 cleanup 동작을 추가로 검사합니다.

### 6.1. Cleanup이 없는 Callback Ref

다음 예제는 Callback Ref에서 DOM 노드를 배열에 저장하지만 제거하는 로직이 없습니다.

```tsx
import { useRef } from "react";

function ItemList() {
  const itemsRef = useRef<HTMLElement[]>([]);

  const items = ["Apple", "Banana", "Orange"];

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          ref={(node) => {
            if (node) {
              itemsRef.current.push(node);
            }
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

이 코드는 Callback Ref가 실행될 때마다 배열에 DOM 노드를 추가합니다.

그러나 해당 노드가 제거될 때 배열에서도 제거하지 않으므로 오래된 DOM 참조가 남을 수 있습니다.

Strict Mode에서는 Callback Ref가 추가로 실행되므로 이러한 문제가 더 쉽게 드러납니다.

### 6.2. React 19의 Cleanup 함수 활용

React 19에서는 Callback Ref에서 cleanup 함수를 반환하여 DOM 노드가 제거될 때 실행할 정리 작업을 정의할 수 있습니다.

```tsx
import { useRef } from "react";

function ItemList() {
  const itemsRef = useRef<HTMLElement[]>([]);

  const items = ["Apple", "Banana", "Orange"];

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          ref={(node) => {
            if (!node) {
              return;
            }

            itemsRef.current.push(node);

            return () => {
              itemsRef.current =
                itemsRef.current.filter(
                  (element) => element !== node,
                );
            };
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
```

위 예제에서는 Callback Ref가 실행될 때 DOM 노드를 배열에 저장합니다.

노드가 제거되면 반환된 cleanup 함수가 실행되어 해당 노드를 배열에서 제거합니다.

이러한 방식은 Ref가 여러 번 연결되고 해제되는 상황에서도 참조 상태를 일관되게 유지할 수 있도록 합니다.

### 6.3. React 18과 React 19의 차이

Callback Ref의 cleanup 반환 방식은 React 19에서 추가된 기능입니다.

React 18에서는 Callback Ref에서 cleanup 함수를 반환하는 방식이 지원되지 않습니다.

React 18을 사용하는 프로젝트에서는 기존 방식처럼 노드가 해제될 때 전달되는 `null`을 처리해야 합니다.

```tsx
import { useRef } from "react";

function ItemList() {
  const itemsRef = useRef<HTMLElement[]>([]);

  return (
    <ul>
      <li
        ref={(node) => {
          if (node) {
            itemsRef.current.push(node);
          } else {
            // DOM 노드가 제거된 경우 정리
          }
        }}
      >
        Item
      </li>
    </ul>
  );
}
```

React 19에서는 cleanup 함수를 반환하는 방식을 사용할 수 있으며, React 19 환경에서는 해당 방식을 활용하여 정리 로직을 명확하게 구성할 수 있습니다.

## 7. Deprecated API 검사

Strict Mode는 더 이상 권장되지 않는 React API를 사용하는 경우 개발 환경에서 경고를 출력합니다.

이러한 API는 기존 코드와의 호환성을 위해 남아 있지만 새로운 코드에서는 사용을 피하는 것이 좋습니다.

대표적인 검사 대상은 다음과 같습니다.

| Deprecated API | 설명 | 대체 방향 |
|---|---|---|
| `UNSAFE_componentWillMount` | 마운트 이전 생명주기 메서드 | Constructor 또는 적절한 Effect |
| `UNSAFE_componentWillReceiveProps` | Props 변경 전 호출되는 메서드 | Derived State 또는 Effect |
| `UNSAFE_componentWillUpdate` | 업데이트 이전 생명주기 메서드 | `componentDidUpdate` 등 |
| `findDOMNode` | 컴포넌트의 DOM 노드 탐색 | Ref 사용 |
| Legacy Context API | 이전 Context 전달 방식 | `createContext` 및 Context Provider |
| String Refs | 문자열로 Ref 지정 | `createRef` 또는 `useRef` |

### 7.1. Legacy Lifecycle Methods

기존 Class Component에서 사용하던 일부 생명주기 메서드는 React의 렌더링 방식과 호환성 문제가 발생할 수 있습니다.

```tsx
class UserProfile extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.userId !== this.props.userId) {
      // 기존 데이터 갱신 로직
    }
  }

  render() {
    return <div>User Profile</div>;
  }
}
```

이러한 메서드 대신 컴포넌트의 목적에 맞는 생명주기 메서드나 함수형 컴포넌트의 Hook을 사용하는 것이 좋습니다.

### 7.2. findDOMNode

`findDOMNode`는 Class Component 인스턴스에 대응하는 DOM 노드를 찾기 위해 사용하던 API입니다.

```tsx
import { findDOMNode } from "react-dom";

class MyComponent extends React.Component {
  componentDidMount() {
    const node = findDOMNode(this);

    console.log(node);
  }

  render() {
    return <div>Hello</div>;
  }
}
```

이 API는 컴포넌트와 DOM 구조 사이의 명시성이 부족하므로 사용이 권장되지 않습니다.

대신 Ref를 직접 연결하는 방식을 사용할 수 있습니다.

```tsx
import { createRef } from "react";

class MyComponent extends React.Component {
  private elementRef = createRef<HTMLDivElement>();

  componentDidMount() {
    console.log(this.elementRef.current);
  }

  render() {
    return (
      <div ref={this.elementRef}>
        Hello
      </div>
    );
  }
}
```

Ref를 사용하면 접근할 DOM 요소를 명시적으로 지정할 수 있습니다.

## 8. Strict Mode와 Concurrent Rendering

Strict Mode는 Concurrent Rendering과 관련된 문제를 조기에 발견하는 데에도 도움이 됩니다.

Concurrent Rendering 환경에서는 React가 렌더링 작업을 중단하거나 재시작하거나 폐기할 수 있습니다.

따라서 렌더링 과정에서 외부 상태를 변경하거나 부수 효과를 발생시키는 코드는 예상하지 못한 결과를 만들 수 있습니다.

예를 들어 컴포넌트 렌더링 중 다음과 같은 작업을 수행하는 것은 적절하지 않습니다.

- 전역 변수 변경
- Props로 전달받은 객체 변경
- 외부 Store 직접 수정
- DOM 직접 조작
- 네트워크 요청 실행
- 구독 등록

이러한 작업은 렌더링 과정이 중단되거나 반복될 때 중복 실행될 수 있습니다.

Strict Mode에서 컴포넌트의 추가 렌더링을 수행하는 이유도 렌더링 로직의 순수성을 검증하기 위한 것입니다.

외부 시스템과의 동기화는 Effect로 분리하고, 사용자 상호작용에 따른 작업은 이벤트 핸들러에서 처리하는 것이 적절합니다.

## 9. Strict Mode에서 자주 발생하는 오해

### 9.1. 컴포넌트가 실제로 두 번 마운트되는 것은 아닙니다

Strict Mode에서 컴포넌트 함수가 추가로 호출되거나 Effect의 setup 및 cleanup이 반복되는 현상을 실제 UI가 두 번 생성되는 것으로 이해해서는 안 됩니다.

React는 개발 환경에서 추가 검사를 수행하여 컴포넌트가 반복적인 실행에도 올바르게 동작하는지 확인합니다.

### 9.2. 모든 함수가 두 번 실행되는 것은 아닙니다

Strict Mode는 모든 JavaScript 함수를 무조건 두 번 호출하지 않습니다.

컴포넌트 렌더링 로직과 순수해야 하는 특정 함수가 검사 대상입니다.

이벤트 핸들러는 사용자의 이벤트에 따라 실행되므로 Strict Mode가 임의로 두 번 호출하지 않습니다.

### 9.3. API 요청이 두 번 발생한다고 반드시 React 버그는 아닙니다

Effect 내부에서 네트워크 요청을 실행하고 cleanup을 구현하지 않았다면 Strict Mode에서 요청이 추가로 발생하는 현상을 확인할 수 있습니다.

이 경우 Effect의 실행 횟수를 강제로 제한하기보다 요청 취소 또는 결과 무시 등의 정리 로직을 설계해야 합니다.

```tsx
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`);
      const data: User = await response.json();

      if (!ignore) {
        setUser(data);
      }
    }

    fetchUser();

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return <p>{user.name}</p>;
}
```

위 예제에서는 Effect가 정리될 때 `ignore`를 활성화하여 이전 요청의 응답이 현재 화면 상태를 변경하지 못하도록 합니다.

실제 네트워크 요청 자체를 취소하려면 `AbortController`를 활용할 수도 있습니다.

다만 모든 요청이 반드시 취소되어야 하는 것은 아닙니다. 요청의 성격과 데이터 캐싱 정책에 따라 적절한 방식을 선택해야 합니다.

### 9.4. Strict Mode를 제거하는 것은 근본적인 해결책이 아닙니다

Strict Mode에서 문제가 발견되었다고 해서 Strict Mode를 제거하는 것이 올바른 해결책은 아닙니다.

Strict Mode는 실제로 존재하는 순수성 위반, 리소스 정리 누락, Deprecated API 사용 등의 문제를 발견하기 위한 기능입니다.

검사로 인해 문제가 드러났다면 원인을 수정하여 반복적인 렌더링과 Effect 실행에도 안정적으로 동작하도록 구성해야 합니다.

## 10. React 버전별 주요 동작

Strict Mode는 React 버전에 따라 검사 범위와 동작이 확장되어 왔습니다.

| 버전 | 주요 변경 사항 |
|---|---|
| React 16.3 | Strict Mode 도입 |
| React 16.9 | 일부 추가 경고 및 검사 기능 개선 |
| React 18 | 초기 마운트 시 Effect의 추가 setup 및 cleanup 검사 도입 |
| React 19 | Callback Ref 추가 검사 및 Ref cleanup 기능과 관련된 개선 |

### 10.1. React 18

React 18에서는 Strict Mode에 초기 마운트 시 Effect를 추가로 실행하는 검사가 도입되었습니다.

이 동작은 컴포넌트가 마운트와 해제를 반복하는 상황에서도 Effect가 올바르게 동작하는지 확인하기 위한 것입니다.

React는 향후 UI를 제거했다가 기존 State를 유지한 상태로 다시 표시하는 기능 등을 고려하여 이러한 검사를 도입했습니다.

### 10.2. React 19

React 19에서는 Strict Mode의 Ref Callback 검사와 관련된 동작이 개선되었습니다.

Callback Ref도 초기 연결 과정에서 추가 setup 및 cleanup 사이클을 거칠 수 있으므로 Ref 정리 로직을 올바르게 작성해야 합니다.

또한 React 19에서는 Callback Ref가 cleanup 함수를 반환하는 방식을 지원합니다.

`useMemo`와 `useCallback`의 개발 환경 추가 렌더링 관련 동작도 개선되었습니다. 두 Hook의 계산 결과는 첫 번째 렌더링에서 생성된 메모이제이션 결과를 두 번째 렌더링에서 재사용하도록 변경되었습니다.

이러한 변경 사항은 Strict Mode의 검사 목적을 유지하면서 불필요한 계산을 줄이기 위한 것입니다.

## 11. Strict Mode 사용 시 주의사항

### 11.1. 개발 환경과 프로덕션 환경 구분

Strict Mode의 추가 렌더링, Effect 검사, Callback Ref 검사는 개발 환경에서만 수행됩니다.

따라서 개발 환경에서 콘솔 로그나 네트워크 요청이 추가로 발생한다고 해서 프로덕션에서도 동일하게 발생한다고 판단해서는 안 됩니다.

### 11.2. Effect의 대칭적인 구조 유지

Effect에서 외부 리소스를 설정한다면 해당 리소스를 해제하는 cleanup 함수를 함께 구현해야 합니다.

setup과 cleanup이 대칭적으로 동작하도록 구성하면 Effect가 여러 번 실행되는 상황에서도 안정적으로 동작할 수 있습니다.

### 11.3. 렌더링 로직의 순수성 유지

렌더링 과정에서 Props나 외부 객체를 직접 변경하지 않아야 합니다.

동일한 입력에 대해 동일한 결과를 반환하도록 컴포넌트를 구성하고, 부수 효과는 적절한 위치로 분리해야 합니다.

### 11.4. Callback Ref 정리

Callback Ref에서 외부 배열이나 Map에 DOM 노드를 저장하는 경우 노드가 제거될 때 해당 참조도 정리해야 합니다.

특히 React 19에서는 cleanup 함수를 반환하는 방식을 활용할 수 있습니다.

### 11.5. 외부 라이브러리와의 호환성

Strict Mode를 적용했을 때 외부 라이브러리에서 중복 이벤트 등록, 연결 누수, DOM 참조 누적 등의 문제가 발생할 수 있습니다.

이러한 경우 라이브러리의 초기화 및 정리 방식이 React의 반복적인 Effect 실행과 호환되는지 확인해야 합니다.

### 11.6. 성능 측정 시 주의

Strict Mode는 개발 환경에서 추가 렌더링과 검사를 수행하므로 개발 환경의 실행 시간이나 콘솔 출력만으로 프로덕션 성능을 판단해서는 안 됩니다.

실제 성능 측정은 프로덕션 빌드와 적절한 성능 측정 도구를 활용해야 합니다.

## 12. 정리

Strict Mode는 React 애플리케이션의 개발 과정에서 잠재적인 문제를 조기에 발견하기 위한 검사 기능입니다.

별도의 UI를 렌더링하지 않으며 개발 환경에서만 추가적인 검사와 실행 동작을 수행합니다.

주요 기능은 다음과 같습니다.

- 컴포넌트의 순수성을 검사하기 위해 렌더링 로직을 추가로 호출합니다.
- Effect의 cleanup 누락을 확인하기 위해 초기 setup 및 cleanup 사이클을 추가로 실행합니다.
- Callback Ref의 정리 로직을 검사합니다.
- Deprecated API 사용 여부를 확인하고 경고합니다.
- Concurrent Rendering 환경에서도 안전하게 동작할 수 있는 컴포넌트 구조를 유도합니다.

Strict Mode의 목적은 추가 실행을 방지하는 것이 아니라, 컴포넌트가 반복적으로 렌더링되고 Effect와 Ref가 설정 및 해제되는 상황에서도 올바르게 동작하도록 만드는 것입니다.

따라서 개발 과정에서는 Strict Mode를 활성화하고, 검사 과정에서 발견되는 문제를 근본적으로 수정하는 것이 좋습니다.

## 13. 참고 자료

- [React 공식 문서 - StrictMode](https://react.dev/reference/react/StrictMode)
- [React 공식 문서 - useEffect](https://react.dev/reference/react/useEffect)
- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
- [React 공식 문서 - useState](https://react.dev/reference/react/useState)
- [React 공식 문서 - useMemo](https://react.dev/reference/react/useMemo)
- [React 공식 문서 - useReducer](https://react.dev/reference/react/useReducer)
- [React 공식 문서 - Component](https://react.dev/reference/react/Component)
- [React 공식 문서 - React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [React 공식 블로그 - React v18](https://react.dev/blog/2022/03/29/react-v18)

