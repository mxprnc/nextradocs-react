# Hooks Overview

## 1. 개념

Hooks는 함수 컴포넌트(Function Component)에서 React의 상태(State), Context, Ref, Effect 등 다양한 기능을 사용할 수 있도록 제공하는 함수입니다.

React는 Hooks를 통해 함수 컴포넌트에서도 상태 관리, 컴포넌트 생명주기와 관련된 작업, 외부 시스템과의 동기화 및 성능 최적화 등의 기능을 사용할 수 있도록 지원합니다.

Hooks가 도입되기 전에는 컴포넌트의 상태 관리와 생명주기 관련 기능을 주로 클래스 컴포넌트(Class Component)를 통해 구현했습니다. Hooks가 도입된 이후에는 함수 컴포넌트에서도 이러한 기능을 직접 활용할 수 있게 되었으며, 여러 컴포넌트에서 재사용할 수 있는 상태 기반 로직(Stateful Logic)을 Custom Hooks로 추출할 수 있게 되었습니다.

Hooks의 주요 특징은 다음과 같습니다.

- 함수 컴포넌트에서 React의 다양한 기능을 사용할 수 있습니다.
- 상태 관리와 Effect 등의 로직을 컴포넌트 내부에 선언적으로 구성할 수 있습니다.
- Custom Hooks를 통해 컴포넌트 간 상태 기반 로직을 재사용할 수 있습니다.
- 컴포넌트의 역할과 관심사에 따라 로직을 분리할 수 있습니다.
- React가 제공하는 렌더링 및 상태 관리 모델과 일관된 방식으로 동작합니다.

Hooks는 일반적인 JavaScript 함수와 달리 호출 위치와 호출 방식에 관한 규칙이 존재합니다. 이러한 규칙은 React가 렌더링 과정에서 각 Hook의 상태와 실행 순서를 올바르게 관리하기 위해 필요합니다.

## 2. Hooks의 주요 역할

Hooks는 제공하는 기능에 따라 여러 범주로 구분할 수 있습니다.

### 2.1. State Management

State Hooks는 컴포넌트가 렌더링 사이에 데이터를 유지하고 관리할 수 있도록 지원합니다.

컴포넌트의 상태가 변경되면 React는 해당 상태를 사용하는 컴포넌트를 다시 렌더링하여 변경된 UI를 반영합니다.

대표적인 State Hooks는 다음과 같습니다.

| Hook | 설명 |
|---|---|
| `useState` | 컴포넌트의 상태를 선언하고 직접 업데이트합니다. |
| `useReducer` | Reducer 함수를 통해 상태와 상태 변경 로직을 관리합니다. |
| `useOptimistic` | 비동기 작업이 진행되는 동안 낙관적 상태를 표시합니다. |

`useState`는 독립적인 상태를 간단하게 관리할 때 적합하며, `useReducer`는 여러 상태 변경 작업을 명확한 규칙으로 관리해야 할 때 유용합니다.

### 2.2. Context

Context Hook은 컴포넌트 트리의 상위 컴포넌트에서 제공하는 데이터를 하위 컴포넌트가 직접 읽을 수 있도록 지원합니다.

일반적으로 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달하려면 Props를 사용합니다. 그러나 여러 단계에 걸쳐 동일한 데이터를 전달해야 하는 경우 Props Drilling이 발생할 수 있습니다.

Context는 이러한 상황에서 컴포넌트 간 데이터 전달 구조를 단순화할 수 있습니다.

| Hook | 설명 |
|---|---|
| `useContext` | 지정된 Context의 값을 읽고 해당 Context의 변경을 구독합니다. |

Context는 테마, 인증 정보, 언어 설정 등 여러 컴포넌트에서 공유하는 데이터를 전달할 때 활용할 수 있습니다.

### 2.3. Ref

Ref Hooks는 렌더링에 직접 사용되지 않는 값을 컴포넌트의 여러 렌더링 사이에서 유지하거나 DOM 요소에 접근할 수 있도록 지원합니다.

State와 달리 Ref의 값을 변경해도 컴포넌트가 다시 렌더링되지 않습니다.

| Hook | 설명 |
|---|---|
| `useRef` | 렌더링 사이에서 유지되는 Ref 객체를 생성합니다. |
| `useImperativeHandle` | 부모 컴포넌트에 노출되는 Ref의 기능을 사용자 정의합니다. |

Ref는 DOM 요소에 직접 접근하거나 타이머 ID, 이전 값 등 렌더링을 발생시키지 않아야 하는 데이터를 보관할 때 활용할 수 있습니다.

다만 UI에 반영되어야 하는 데이터는 Ref가 아닌 State로 관리해야 합니다.

### 2.4. Effect

Effect Hooks는 React 외부의 시스템과 컴포넌트를 동기화할 수 있도록 지원합니다.

외부 시스템에는 다음과 같은 대상이 포함됩니다.

- 브라우저 DOM API
- 네트워크 연결
- 이벤트 구독
- 타이머
- 외부 JavaScript 라이브러리
- React 외부에서 관리하는 UI 위젯

대표적인 Effect Hooks는 다음과 같습니다.

| Hook | 설명 |
|---|---|
| `useEffect` | 컴포넌트를 외부 시스템과 동기화합니다. |
| `useLayoutEffect` | 브라우저가 화면을 다시 그리기 전에 동기적으로 Effect를 실행합니다. |
| `useInsertionEffect` | React가 DOM 변경 사항을 적용하기 전에 실행되며, 주로 CSS-in-JS 라이브러리에서 활용합니다. |
| `useEffectEvent` | Effect 내부에서 최신 Props와 State를 참조하는 비반응형 이벤트 함수를 생성합니다. |

Effect는 컴포넌트의 렌더링 과정과 구분되는 작업입니다.

React 외부 시스템과 동기화할 필요가 없는 경우에는 Effect를 사용하지 않는 것이 좋습니다. 단순한 데이터 변환이나 다른 상태로부터 계산할 수 있는 값은 렌더링 과정에서 계산하는 것이 적절합니다.

### 2.5. Performance Optimization

Performance Hooks는 불필요한 계산이나 렌더링 작업을 줄이고, UI 업데이트의 우선순위를 조정할 수 있도록 지원합니다.

| Hook | 설명 |
|---|---|
| `useMemo` | 계산 결과를 캐싱하여 불필요한 재계산을 줄입니다. |
| `useCallback` | 함수 정의를 캐싱하여 불필요한 함수 재생성을 줄입니다. |
| `useTransition` | 특정 상태 업데이트를 긴급하지 않은 Transition으로 처리합니다. |
| `useDeferredValue` | 특정 값의 업데이트를 지연하여 중요한 UI 업데이트가 먼저 처리되도록 지원합니다. |

`useMemo`와 `useCallback`은 캐싱을 통해 불필요한 계산이나 참조 변경을 줄이는 데 활용할 수 있습니다.

`useTransition`과 `useDeferredValue`는 UI 업데이트의 우선순위를 조정하여 사용자가 중요한 상호작용을 먼저 수행할 수 있도록 지원합니다.

단, 이러한 Hooks를 무조건 사용하는 것이 성능 향상으로 이어지는 것은 아닙니다. 실제 성능 병목을 확인한 후 적절하게 적용해야 합니다.

### 2.6. Other Hooks

앞서 설명한 범주 외에도 특정 목적을 위해 제공되는 Hooks가 있습니다.

| Hook | 설명 |
|---|---|
| `useId` | 접근성 속성 등에 활용할 수 있는 고유 ID를 생성합니다. |
| `useSyncExternalStore` | React 외부에서 관리하는 Store를 구독합니다. |
| `useDebugValue` | React Developer Tools에서 Custom Hook의 디버깅 정보를 표시합니다. |
| `useActionState` | Action의 실행 결과에 따른 상태를 관리합니다. |

이러한 Hooks는 특정 라이브러리를 개발하거나 접근성, 외부 상태 관리, Action 처리 등을 구현할 때 유용합니다.

## 3. Hooks 사용 방법

Hooks는 일반적으로 React에서 제공하는 함수를 Import하여 함수 컴포넌트 내부에서 호출합니다.

다음은 `useState`를 사용하여 컴포넌트의 상태를 관리하는 예제입니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  const handleIncrement = () => {
    setCount((previousCount) => previousCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
}

export default Counter;
```

위 예제에서는 `useState`를 사용하여 `count`라는 상태를 선언합니다.

- `count`: 현재 상태값을 나타냅니다.
- `setCount`: 상태를 업데이트하는 함수입니다.
- `useState<number>(0)`: 초기 상태를 숫자 타입으로 선언합니다.
- `handleIncrement`: 이전 상태값을 기반으로 새로운 상태를 계산합니다.

`setCount`가 호출되면 React는 상태 업데이트를 예약하고 해당 상태를 사용하는 컴포넌트를 다시 렌더링합니다.

이처럼 Hooks를 활용하면 함수 컴포넌트 내부에서 상태와 관련된 동작을 선언적으로 구성할 수 있습니다.

## 4. Custom Hooks

React는 기본적으로 제공하는 Built-in Hooks 외에도 개발자가 직접 Hooks를 정의할 수 있도록 지원합니다.

Custom Hooks는 여러 컴포넌트에서 반복적으로 사용되는 상태 기반 로직을 재사용하기 위한 함수입니다.

Custom Hooks는 일반적으로 `use` 접두사로 시작하는 이름을 사용하며, 내부에서 다른 Hooks를 호출할 수 있습니다.

다음은 화면의 온라인 상태를 확인하는 Custom Hook의 예제입니다.

```tsx
import { useEffect, useState } from 'react';

function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(
    navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

function StatusIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <p>
      {isOnline ? 'Online' : 'Offline'}
    </p>
  );
}
```

`useOnlineStatus`는 `useState`와 `useEffect`를 조합하여 온라인 상태를 관리하는 Custom Hook입니다.

다른 컴포넌트에서도 동일한 Hook을 호출하면 별도의 이벤트 구독 로직을 작성하지 않고 온라인 상태를 확인할 수 있습니다.

여기서 주의할 점은 Custom Hooks가 상태 자체를 여러 컴포넌트 사이에서 공유하는 것은 아니라는 것입니다.

동일한 Custom Hook을 여러 컴포넌트에서 호출하더라도 각 컴포넌트는 독립적인 Hook 상태를 갖습니다. Custom Hooks가 공유하는 것은 상태를 관리하는 로직이며, 실제 상태의 인스턴스는 호출하는 컴포넌트마다 별도로 생성됩니다.

## 5. Rules of Hooks

Hooks는 React가 컴포넌트의 렌더링 과정에서 각 Hook의 상태와 실행 순서를 올바르게 추적할 수 있도록 정해진 규칙을 따라야 합니다.

이를 Rules of Hooks라고 합니다.

### 5.1. Only Call Hooks at the Top Level

Hooks는 함수 컴포넌트 또는 Custom Hook의 최상위 수준에서만 호출해야 합니다.

조건문, 반복문, 중첩 함수, 이벤트 핸들러 내부에서는 Hooks를 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
function Counter({ enabled }: { enabled: boolean }) {
  if (enabled) {
    // 잘못된 사용
    const [count, setCount] = useState(0);
  }

  return <div>Counter</div>;
}
```

조건에 따라 Hook 호출 여부가 달라지면 렌더링마다 Hook 호출 순서가 달라질 수 있습니다.

올바른 사용 방법은 다음과 같습니다.

```tsx
function Counter({ enabled }: { enabled: boolean }) {
  const [count, setCount] = useState(0);

  if (!enabled) {
    return null;
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

Hook을 항상 동일한 순서로 호출한 다음 조건에 따라 렌더링 결과를 결정해야 합니다.

### 5.2. Only Call Hooks from React Functions

Hooks는 다음 두 가지 위치에서만 호출해야 합니다.

- React 함수 컴포넌트의 최상위 수준
- Custom Hook의 최상위 수준

일반 JavaScript 함수나 클래스 컴포넌트에서는 Hooks를 호출할 수 없습니다.

잘못된 사용 예제는 다음과 같습니다.

```tsx
function getCounter() {
  // 잘못된 사용
  const [count, setCount] = useState(0);

  return count;
}
```

올바른 사용 방법은 함수 컴포넌트 또는 Custom Hook으로 구현하는 것입니다.

```tsx
function useCounter() {
  const [count, setCount] = useState(0);

  return {
    count,
    setCount,
  };
}

function Counter() {
  const { count, setCount } = useCounter();

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

### 5.3. Exception: use API

React에서 제공하는 `use` API는 일반적인 Hooks와 다른 호출 규칙을 갖습니다.

`use`는 Promise 또는 Context의 값을 읽는 데 사용하며, 일반적인 Hooks와 달리 조건문이나 반복문 내부에서도 호출할 수 있습니다.

다만 `try/catch` 내부에서는 호출할 수 없으며, React 컴포넌트 또는 Hook 내부에서 사용해야 합니다.

따라서 일반적인 Rules of Hooks를 설명할 때 `use` API의 예외적인 동작을 구분할 필요가 있습니다.

## 6. Hooks 사용 시 주의사항

Hooks를 올바르게 사용하기 위해 다음 사항을 고려해야 합니다.

### 6.1. State와 Ref의 차이

State와 Ref는 모두 렌더링 사이에서 값을 유지할 수 있지만, 값 변경에 따른 동작이 다릅니다.

| 구분 | State | Ref |
|---|---|---|
| 값 유지 | 렌더링 사이에서 유지 | 렌더링 사이에서 유지 |
| 값 변경 | Setter를 통해 업데이트 | `current` 직접 변경 |
| 재렌더링 | 상태 업데이트에 따라 발생 | 변경만으로는 발생하지 않음 |
| 주요 목적 | UI에 반영되는 데이터 관리 | 렌더링과 무관한 데이터 관리 |

화면에 표시되어야 하는 값은 State로 관리하고, 타이머 ID나 DOM 참조 등 렌더링을 발생시키지 않아야 하는 값은 Ref로 관리하는 것이 적절합니다.

### 6.2. Effect의 무분별한 사용 방지

`useEffect`는 외부 시스템과의 동기화를 위한 Hook입니다.

단순히 하나의 State를 기반으로 다른 값을 계산하기 위해 Effect를 사용하는 것은 불필요한 추가 렌더링을 발생시킬 수 있습니다.

예를 들어 다음과 같은 코드는 피하는 것이 좋습니다.

```tsx
function UserProfile({ firstName, lastName }: {
  firstName: string;
  lastName: string;
}) {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    setFullName(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  return <p>{fullName}</p>;
}
```

위 코드는 Props로부터 계산할 수 있는 값을 별도의 State와 Effect로 관리합니다.

다음과 같이 렌더링 과정에서 직접 계산하는 것이 더 적절합니다.

```tsx
function UserProfile({ firstName, lastName }: {
  firstName: string;
  lastName: string;
}) {
  const fullName = `${firstName} ${lastName}`;

  return <p>{fullName}</p>;
}
```

### 6.3. Hook의 반환값과 상태 업데이트

Hook에서 반환하는 값은 해당 렌더링 시점의 상태를 기준으로 합니다.

State Setter를 호출하더라도 현재 실행 중인 함수의 상태 변수가 즉시 변경되는 것은 아닙니다.

따라서 이전 상태를 기반으로 새로운 상태를 계산해야 하는 경우 Functional Update를 사용하는 것이 안전합니다.

```tsx
setCount((previousCount) => previousCount + 1);
```

### 6.4. Hooks의 순수성 유지

컴포넌트와 Hooks는 렌더링 과정에서 예측 가능한 결과를 제공해야 합니다.

렌더링 도중 DOM을 직접 변경하거나 외부 시스템에 영향을 주는 작업을 수행하면 안 됩니다.

외부 시스템과의 동기화 및 부수 효과는 적절한 Effect나 이벤트 핸들러에서 처리해야 합니다.

## 7. 관련 개념

Hooks를 이해하기 위해 다음 개념을 함께 학습하는 것이 좋습니다.

| 개념 | 관련 파일 | 설명 |
|---|---|---|
| Rules of Hooks | `rules-of-hooks.md` | Hooks의 호출 규칙과 제약 사항 |
| useState | `use-state.md` | 컴포넌트 상태 관리 |
| useEffect | `use-effect.md` | 외부 시스템과의 동기화 |
| useContext | `use-context.md` | Context를 통한 데이터 공유 |
| useRef | `use-ref.md` | 렌더링과 무관한 값 유지 |
| useMemo | `use-memo.md` | 계산 결과 캐싱 |
| useCallback | `use-callback.md` | 함수 정의 캐싱 |
| Custom Hooks | `custom-hooks.md` | 상태 기반 로직의 재사용 |

## 8. 정리

Hooks는 함수 컴포넌트에서 React의 다양한 기능을 사용할 수 있도록 지원하는 핵심 메커니즘입니다.

State, Context, Ref, Effect 등의 기능을 제공하며, Custom Hooks를 통해 상태 기반 로직을 재사용 가능한 단위로 추출할 수 있습니다.

Hooks를 올바르게 사용하기 위해서는 Rules of Hooks를 준수해야 하며, 각 Hook이 제공하는 기능과 사용 목적을 명확하게 구분해야 합니다.

특히 다음 사항을 이해하는 것이 중요합니다.

- State는 UI에 반영되는 데이터를 관리합니다.
- Context는 컴포넌트 트리 전반에 데이터를 전달합니다.
- Ref는 렌더링과 무관하게 유지해야 하는 값을 관리합니다.
- Effect는 React 외부 시스템과 동기화합니다.
- Performance Hooks는 불필요한 계산을 줄이거나 업데이트 우선순위를 조정합니다.
- Custom Hooks는 상태 기반 로직을 재사용할 수 있도록 지원합니다.
- Rules of Hooks는 React가 Hook의 상태와 실행 순서를 올바르게 관리하기 위한 규칙입니다.

## 9. 참고 자료

- [React 공식 문서 - Built-in React Hooks](https://react.dev/reference/react/hooks)
- [React 공식 문서 - Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [React 공식 문서 - Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React 공식 문서 - Rules of React](https://react.dev/reference/rules)
- [React 공식 문서 - Quick Start](https://react.dev/learn)