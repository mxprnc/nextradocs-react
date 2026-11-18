# Render and Commit

React는 컴포넌트를 화면에 표시하거나 업데이트할 때 일련의 렌더링 과정을 수행합니다. 이 과정은 크게 **Trigger, Render, Commit** 세 단계로 구분됩니다.

React는 컴포넌트의 상태와 Props를 기반으로 다음 UI를 계산하고, 이전 렌더링 결과와 비교하여 실제 DOM에 필요한 변경 사항만 적용합니다.

이러한 과정을 이해하면 컴포넌트가 언제 다시 실행되는지, State 업데이트가 어떻게 화면에 반영되는지, 그리고 컴포넌트가 다시 렌더링되더라도 DOM이 항상 변경되는 것은 아닌 이유를 이해할 수 있습니다.

## 1. Rendering Overview

React의 렌더링 과정은 다음 세 단계로 구성됩니다.

1. **Trigger:** 렌더링을 시작하는 단계입니다.
2. **Render:** 컴포넌트를 실행하여 다음 UI 구조를 계산하는 단계입니다.
3. **Commit:** 계산된 변경 사항을 실제 DOM에 반영하는 단계입니다.

전체적인 흐름은 다음과 같습니다.

```text
Trigger
   |
   v
Render
   |
   v
Commit
   |
   v
Browser Paint
```

여기서 Browser Paint는 React의 Commit 단계와 구분되는 브라우저의 렌더링 과정입니다. React가 DOM을 업데이트한 이후 브라우저가 변경된 화면을 실제로 그립니다.

각 단계는 서로 다른 책임을 가지며, React의 렌더링 과정과 브라우저의 화면 출력 과정을 구분하는 것이 중요합니다.

## 2. Trigger: Rendering Trigger

Trigger 단계는 React가 새로운 렌더링 작업을 시작하도록 요청받는 단계입니다.

컴포넌트의 렌더링은 일반적으로 다음 두 가지 상황에서 시작됩니다.

- Initial Render
- State Update

### 2.1 Initial Render

React 애플리케이션이 처음 실행되면 Root Component를 기준으로 최초 렌더링이 시작됩니다.

React 18 이후의 일반적인 클라이언트 렌더링 환경에서는 `createRoot()`를 사용하여 React Root를 생성하고, `root.render()`를 호출하여 초기 렌더링을 요청합니다.

```tsx
import { createRoot } from 'react-dom/client';

function App() {
  return <h1>Hello, React!</h1>;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(<App />);
```

`createRoot()`는 React가 관리할 Root를 생성하며, `root.render()`는 해당 Root에 표시할 React Element를 전달하여 렌더링을 요청합니다.

초기 렌더링에서는 Root Component부터 시작하여 하위 컴포넌트까지 순차적으로 렌더링이 진행됩니다.

### 2.2 State Update

초기 렌더링이 완료된 이후에는 State 업데이트가 새로운 렌더링을 트리거합니다.

React에서 제공하는 State Setter를 호출하면 React는 해당 컴포넌트의 새로운 렌더링 작업을 예약합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

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
```

`setCount()`가 호출되면 React는 업데이트된 State를 반영하기 위해 새로운 렌더링을 예약합니다.

이후 React는 컴포넌트를 다시 실행하여 새로운 UI를 계산합니다.

State Setter를 호출했다고 해서 해당 시점에 DOM이 즉시 변경되는 것은 아닙니다. State 업데이트는 렌더링 작업을 예약하는 것이며, 실제 DOM 변경은 이후 Commit 단계에서 수행됩니다.

또한 React는 여러 State 업데이트를 하나의 렌더링으로 처리할 수 있도록 업데이트를 배치하는 Batching을 지원합니다.

관련 개념: [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot), [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

## 3. Render: Rendering Components

Render 단계에서는 React가 컴포넌트를 실행하여 다음에 화면에 표시해야 할 UI를 계산합니다.

함수형 컴포넌트에서 렌더링은 React가 해당 컴포넌트 함수를 호출하는 것을 의미합니다.

```tsx
interface GreetingProps {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  console.log('Greeting rendered');

  return <h1>Hello, {name}!</h1>;
}
```

React가 `Greeting` 컴포넌트를 렌더링하면 컴포넌트 함수가 실행되고, 전달받은 Props를 기반으로 React Element를 반환합니다.

React는 반환된 결과를 기반으로 다음 UI 구조를 계산합니다.

### 3.1 Component Tree Traversal

React는 컴포넌트 트리를 따라 필요한 컴포넌트들을 렌더링합니다.

초기 렌더링에서는 Root Component부터 시작하여 하위 컴포넌트까지 렌더링이 진행됩니다.

```tsx
interface UserProps {
  name: string;
}

function User({ name }: UserProps) {
  return <p>User: {name}</p>;
}

function UserList() {
  return (
    <section>
      <h1>User List</h1>
      <User name="Alice" />
      <User name="Bob" />
    </section>
  );
}

function App() {
  return (
    <main>
      <UserList />
    </main>
  );
}
```

초기 렌더링에서는 다음과 같은 순서로 컴포넌트가 호출됩니다.

```text
App
 |
 v
UserList
 |
 +----> User (Alice)
 |
 +----> User (Bob)
```

React는 각 컴포넌트의 반환 결과를 바탕으로 전체 UI 구조를 계산합니다.

이후 State 업데이트가 발생하면 업데이트가 필요한 컴포넌트를 기준으로 새로운 렌더링 작업이 진행됩니다.

일반적인 경우 해당 컴포넌트와 하위 컴포넌트들도 다시 렌더링됩니다. 단, `memo` 등의 최적화 기법이나 React Compiler에 의해 불필요한 하위 컴포넌트 렌더링이 생략될 수 있습니다.

### 3.2 Rendering Does Not Mean DOM Update

컴포넌트가 렌더링되었다는 사실이 실제 DOM이 변경되었다는 의미는 아닙니다.

Render 단계에서 React는 새로운 UI 구조를 계산하고 이전 렌더링 결과와 비교하여 필요한 변경 사항을 파악합니다.

실제 DOM 변경은 Commit 단계에서 수행됩니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  console.log('Counter rendered');

  return (
    <div>
      <h1>Counter</h1>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

버튼을 클릭하면 다음 과정이 진행됩니다.

1. `setCount()`가 호출됩니다.
2. React가 새로운 렌더링 작업을 예약합니다.
3. `Counter` 컴포넌트가 다시 실행됩니다.
4. 새로운 State를 기반으로 UI가 계산됩니다.
5. React가 이전 렌더링 결과와 비교합니다.
6. 변경이 필요한 DOM만 Commit 단계에서 업데이트합니다.

이 과정에서 `<h1>`과 `<button>`의 내용이나 구조가 변경되지 않았다면 해당 DOM 노드는 불필요하게 다시 생성되거나 교체되지 않습니다.

즉, **컴포넌트의 재실행과 실제 DOM 변경은 서로 다른 개념입니다.**

### 3.3 Rendering Must Be Pure

React의 렌더링 과정은 순수한 계산(Pure Calculation)이어야 합니다.

동일한 Props와 State가 주어지면 동일한 UI 결과를 반환해야 하며, 렌더링 과정에서 외부 상태를 임의로 변경해서는 안 됩니다.

다음과 같은 원칙을 지켜야 합니다.

- 동일한 입력에 대해 동일한 JSX를 반환해야 합니다.
- 기존 Props와 State를 직접 변경해서는 안 됩니다.
- 렌더링 과정에서 외부 시스템에 부수 효과를 발생시키지 않아야 합니다.
- 렌더링 과정에서 DOM을 직접 조작하지 않아야 합니다.

잘못된 예제는 다음과 같습니다.

```tsx
interface User {
  name: string;
  visited: boolean;
}

function UserProfile({ user }: { user: User }) {
  // Props로 전달받은 객체를 직접 변경합니다.
  user.visited = true;

  return <p>{user.name}</p>;
}
```

Props로 전달받은 객체를 직접 변경하면 React가 관리하는 데이터의 일관성이 깨질 수 있습니다.

올바른 방식은 렌더링 과정에서 기존 객체를 변경하지 않는 것입니다.

```tsx
interface User {
  name: string;
  visited: boolean;
}

function UserProfile({ user }: { user: User }) {
  return (
    <p>
      {user.name} - {user.visited ? 'Visited' : 'Not visited'}
    </p>
  );
}
```

렌더링 중 수행해야 하는 계산은 순수하게 유지하고, 외부 시스템과의 동기화나 부수 효과는 Effect 또는 이벤트 핸들러 등 적절한 위치에서 처리해야 합니다.

### 3.4 Strict Mode and Rendering

React의 Strict Mode는 개발 환경에서 컴포넌트의 순수성을 확인하는 데 도움을 줍니다.

Strict Mode가 활성화된 개발 환경에서는 일부 컴포넌트와 Hook의 실행이 추가로 발생할 수 있습니다.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  console.log('App rendered');

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

개발 환경에서 `App` 컴포넌트 함수가 추가로 호출되는 것을 확인할 수 있습니다.

이는 렌더링 과정에서 발생하는 불순한 동작을 탐지하기 위한 검사입니다.

Strict Mode의 추가 검사는 개발 환경에서만 수행되며, 프로덕션 빌드에서는 동일한 방식으로 실행되지 않습니다.

따라서 개발 환경에서 컴포넌트가 두 번 호출되는 현상을 반드시 실제 사용자 환경에서도 두 번 렌더링된다는 의미로 해석해서는 안 됩니다.

## 4. Commit: Applying Changes to DOM

Commit 단계에서는 Render 단계에서 계산한 변경 사항을 실제 DOM에 반영합니다.

React는 이전 렌더링 결과와 새로운 렌더링 결과를 비교하여 필요한 DOM 작업을 수행합니다.

Commit 단계는 다음과 같은 작업을 포함합니다.

- 새로운 DOM 노드 생성 및 삽입
- 기존 DOM 노드의 속성 및 콘텐츠 업데이트
- 더 이상 필요하지 않은 DOM 노드 제거
- 관련 Ref 업데이트 및 Layout Effect 처리

### 4.1 Initial Commit

초기 렌더링에서는 React가 필요한 DOM 노드를 생성하고 Root DOM에 삽입합니다.

```tsx
function App() {
  return (
    <main>
      <h1>Hello, React!</h1>
      <p>Initial Rendering</p>
    </main>
  );
}
```

React는 위 컴포넌트가 반환한 UI 구조를 기반으로 필요한 DOM 노드를 생성하고 실제 DOM에 반영합니다.

개념적으로 다음과 같은 구조가 만들어집니다.

```html
<div id="root">
  <main>
    <h1>Hello, React!</h1>
    <p>Initial Rendering</p>
  </main>
</div>
```

### 4.2 Re-render Commit

State 또는 Props 변경으로 새로운 렌더링이 발생하면 React는 이전 UI와 새로운 UI를 비교하여 실제 변경이 필요한 부분만 DOM에 반영합니다.

```tsx
import { useState } from 'react';

function Clock() {
  const [time, setTime] = useState('10:00');

  return (
    <div>
      <h1>{time}</h1>
      <input placeholder="Enter text" />
      <button onClick={() => setTime('10:01')}>
        Update Time
      </button>
    </div>
  );
}
```

버튼을 클릭하면 `time`이 변경되고 `Clock` 컴포넌트가 다시 렌더링됩니다.

하지만 실제 DOM에서 변경되는 부분은 `<h1>`의 텍스트 콘텐츠입니다.

`<input>`과 `<button>`은 이전 렌더링 결과와 동일한 위치에 있고 해당 DOM 속성에도 변경이 없으므로 기존 DOM 노드가 유지됩니다.

이러한 방식으로 React는 불필요한 DOM 변경을 최소화합니다.

단, 어떤 DOM 노드를 유지하거나 교체할지는 단순히 JSX의 텍스트만 비교하는 것이 아니라 Element의 타입, 위치, Key 등의 정보를 바탕으로 결정됩니다.

관련 개념: [Reconciliation](./reconciliation.md)

## 5. Browser Paint

Commit 단계에서 DOM 변경이 완료되면 브라우저는 변경된 DOM과 스타일을 기반으로 화면을 다시 그리는 과정을 수행합니다.

이 과정을 Browser Paint라고 합니다.

브라우저의 화면 출력 과정은 일반적으로 다음과 같은 단계로 설명할 수 있습니다.

1. Style Calculation: DOM과 CSS를 기반으로 요소에 적용할 스타일을 계산합니다.
2. Layout: 요소의 크기와 위치를 계산합니다.
3. Paint: 텍스트, 색상, 테두리 등의 시각적 요소를 그립니다.
4. Composite: 여러 레이어를 합성하여 최종 화면을 구성합니다.

모든 화면 업데이트에서 모든 단계가 반드시 동일하게 수행되는 것은 아닙니다. 변경된 속성에 따라 브라우저가 필요한 작업만 수행할 수 있습니다.

React의 Commit과 Browser Paint는 구분해야 합니다.

- **Commit:** React가 실제 DOM에 변경 사항을 반영하는 과정입니다.
- **Browser Paint:** 브라우저가 변경된 화면을 실제로 그리는 과정입니다.

또한 `useLayoutEffect`는 DOM 변경 이후 브라우저가 화면을 그리기 전에 실행되는 반면, `useEffect`는 일반적으로 페인트 이후 실행될 수 있습니다. 다만 사용자 상호작용에 의해 발생한 업데이트 등에서는 실행 시점에 차이가 있을 수 있습니다.

따라서 DOM 업데이트와 브라우저의 실제 화면 출력은 동일한 작업이 아닙니다.

관련 개념: [useEffect](../hooks/use-effect.md), [useLayoutEffect](../hooks/use-layout-effect.md)

## 6. Render and Commit Execution Flow

지금까지 설명한 내용을 하나의 실행 흐름으로 정리하면 다음과 같습니다.

### 6.1 Initial Rendering

```text
Application Start
       |
       v
createRoot()
       |
       v
root.render()
       |
       v
Trigger Initial Render
       |
       v
Render Phase
       |
       +--> Root Component Execution
       |
       +--> Child Components Execution
       |
       +--> UI Calculation
       |
       v
Commit Phase
       |
       +--> Create DOM Nodes
       |
       +--> Insert DOM Nodes
       |
       v
Browser Paint
       |
       v
UI Displayed
```

### 6.2 State Update Rendering

```text
User Interaction
       |
       v
State Setter
       |
       v
Trigger Re-render
       |
       v
Render Phase
       |
       +--> Component Execution
       |
       +--> New UI Calculation
       |
       +--> Compare Previous UI
       |
       v
Commit Phase
       |
       +--> Apply Necessary DOM Changes
       |
       v
Browser Paint
       |
       v
Updated UI Displayed
```

위 흐름은 React의 개념적인 렌더링 과정입니다. 실제 React 내부에서는 업데이트 우선순위, Concurrent Rendering, Suspense 등의 기능에 따라 렌더링 작업이 중단되거나 다시 시작될 수 있습니다.

특히 Render 단계에서 계산된 결과가 항상 Commit 단계까지 이어지는 것은 아닙니다. React는 더 높은 우선순위의 업데이트를 처리하거나 최신 상태에 맞지 않는 렌더링 작업을 폐기할 수 있습니다.

## 7. Important Considerations

React의 Render and Commit 과정을 이해할 때 다음 사항에 주의해야 합니다.

### 7.1 Re-render Does Not Always Mean DOM Mutation

컴포넌트가 다시 실행되더라도 실제 DOM에 변경 사항이 없으면 DOM 업데이트가 발생하지 않을 수 있습니다.

컴포넌트 렌더링 횟수와 DOM 변경 횟수를 동일하게 취급해서는 안 됩니다.

### 7.2 Render Phase Must Remain Pure

Render 단계는 언제든 다시 실행되거나 중단될 수 있습니다.

특히 Concurrent Rendering에서는 React가 렌더링 작업을 시작했다가 중단하거나 다시 시작할 수 있으며, 완료된 렌더링 결과를 Commit하지 않고 폐기할 수도 있습니다.

따라서 Render 단계에서는 외부 상태 변경이나 예측할 수 없는 부수 효과를 발생시키지 않아야 합니다.

### 7.3 State Updates Are Not Immediate DOM Updates

State Setter 호출은 React에 업데이트를 요청하는 작업입니다.

State 변경 요청 이후 새로운 렌더링과 Commit이 수행되어야 실제 DOM에 변경 사항이 반영됩니다.

또한 React는 여러 업데이트를 Batching하여 불필요한 렌더링을 줄일 수 있습니다.

### 7.4 Rendering and Painting Are Different Processes

React가 DOM을 업데이트했다고 해서 브라우저가 즉시 화면을 다시 그렸다는 의미는 아닙니다.

React의 Commit과 브라우저의 Paint는 별개의 과정이며, 이 차이는 `useEffect`, `useLayoutEffect` 등의 실행 시점을 이해하는 데 중요합니다.

## 8. Summary

React의 Render and Commit은 컴포넌트의 UI를 계산하고 실제 화면에 반영하는 핵심 과정입니다.

| 단계 | 주요 역할 |
|---|---|
| Trigger | 초기 렌더링 또는 State 업데이트를 통해 렌더링 시작 |
| Render | 컴포넌트를 실행하고 새로운 UI 계산 |
| Commit | 계산된 변경 사항을 실제 DOM에 반영 |
| Browser Paint | 브라우저가 변경된 화면을 그림 |

핵심적으로 다음 사항을 이해해야 합니다.

- 초기 렌더링은 Root Component에서 시작됩니다.
- State 업데이트는 새로운 렌더링을 트리거합니다.
- Render 단계에서는 컴포넌트가 실행되고 새로운 UI가 계산됩니다.
- Render 단계와 Commit 단계는 서로 다른 책임을 가집니다.
- 컴포넌트가 다시 렌더링되더라도 실제 DOM이 반드시 변경되는 것은 아닙니다.
- React의 렌더링 과정은 순수한 계산이어야 합니다.
- Commit 이후 브라우저가 Paint 과정을 수행합니다.

이러한 개념은 Reconciliation, Fiber Architecture, State Preservation, Batching, Concurrent Rendering 등의 내부 동작을 이해하기 위한 기초가 됩니다.

## 9. References

- [React Official Documentation - Render and Commit](https://react.dev/learn/render-and-commit)
- [React Official Documentation - State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React Official Documentation - Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [React Official Documentation - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React Official Documentation - StrictMode](https://react.dev/reference/react/StrictMode)
- [React Official Documentation - Components and Hooks Must Be Pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)
- [React Official Documentation - useEffect](https://react.dev/reference/react/useEffect)
- [React Official Documentation - useLayoutEffect](https://react.dev/reference/react/useLayoutEffect)