# Batching

Batching은 React가 여러 State 업데이트를 하나의 렌더링 작업으로 묶어서 처리하는 최적화 기법입니다.

React는 여러 State 업데이트가 발생할 때마다 즉시 컴포넌트를 다시 렌더링하지 않습니다. 대신 일정 범위 내에서 발생한 업데이트를 모아 처리한 후 필요한 렌더링을 수행합니다.

이를 통해 불필요한 렌더링 횟수를 줄이고, 여러 State가 일관된 상태로 UI에 반영되도록 합니다.

React 18부터는 Automatic Batching이 도입되어 React 이벤트 핸들러뿐 아니라 Promise, `setTimeout`, Native Event Handler 등 다양한 비동기 실행 환경에서도 자동으로 업데이트를 묶어 처리합니다.

## 1. What Is Batching?

일반적으로 State Setter를 호출하면 React에 새로운 렌더링을 요청하게 됩니다.

그러나 여러 State Setter가 연속으로 호출되더라도 호출 횟수만큼 렌더링이 발생하는 것은 아닙니다.

React는 업데이트를 큐에 등록하고, 배칭이 적용되는 범위 내의 코드 실행이 완료되면 업데이트를 처리합니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setCount(1);
    setIsActive(true);
  }

  console.log('Render');

  return (
    <button onClick={handleClick}>
      {count} / {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
```

버튼을 클릭하면 두 개의 State 업데이트가 발생합니다.

- `count`를 `1`로 변경합니다.
- `isActive`를 `true`로 변경합니다.

React는 두 업데이트를 하나로 묶어 처리하므로 일반적으로 한 번의 추가 렌더링으로 두 State 변경 사항을 반영합니다.

```text
Initial Render
      |
      v
User Click
      |
      v
handleClick()
      |
      +----> setCount(1)
      |
      +----> setIsActive(true)
      |
      v
Batch State Updates
      |
      v
Process Updates
      |
      v
Re-render
      |
      v
Commit
```

이러한 방식은 여러 State가 순차적으로 변경되는 동안 중간 상태가 UI에 노출되는 것을 방지합니다.

## 2. Why Batching Matters

Batching은 단순히 렌더링 횟수를 줄이는 것 이상의 의미를 가집니다.

### 2.1 Reduce Unnecessary Re-renders

여러 State 업데이트가 각각 별도의 렌더링을 발생시키면 컴포넌트 트리를 반복적으로 처리해야 합니다.

다음과 같은 상황을 가정해 보겠습니다.

```tsx
function handleClick() {
  setFirstName('John');
  setLastName('Doe');
  setAge(30);
}
```

배칭이 적용되지 않는다면 각각의 업데이트가 별도 렌더링을 발생시킬 수 있습니다.

반면 Batching이 적용되면 세 개의 업데이트를 한 번의 렌더링으로 처리할 수 있습니다.

```text
Without Batching

setFirstName()
      |
      v
Render 1

setLastName()
      |
      v
Render 2

setAge()
      |
      v
Render 3


With Batching

setFirstName()
      |
setLastName()
      |
setAge()
      |
      v
Batch Updates
      |
      v
Render 1
```

특히 여러 컴포넌트가 동일한 State 변경에 영향을 받는 경우 불필요한 렌더링 작업을 줄이는 데 도움이 됩니다.

### 2.2 Prevent Inconsistent UI States

Batching은 여러 State가 서로 연관된 경우 중간 상태가 UI에 반영되는 것을 방지합니다.

```tsx
import { useState } from 'react';

function LoginStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  function handleLogin() {
    setIsLoggedIn(true);
    setUserName('John');
  }

  return (
    <div>
      {isLoggedIn && <p>Welcome, {userName}</p>}

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
```

두 State가 별도로 렌더링된다면 다음과 같은 중간 상태가 발생할 수 있습니다.

```text
isLoggedIn = true
userName = ''

```

이 상태에서는 로그인 상태이지만 사용자 이름이 아직 설정되지 않은 UI가 렌더링될 수 있습니다.

Batching을 사용하면 두 State 업데이트가 함께 처리되므로 이러한 중간 상태가 불필요하게 노출되는 것을 방지할 수 있습니다.

## 3. React Event Handler Batching

React는 초기 버전부터 React가 관리하는 이벤트 핸들러 내부의 State 업데이트를 배칭했습니다.

대표적으로 다음과 같은 이벤트 핸들러가 있습니다.

- `onClick`
- `onChange`
- `onSubmit`
- `onKeyDown`

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Ready');

  function handleClick() {
    setCount((prev) => prev + 1);
    setMessage('Updated');
  }

  return (
    <div>
      <p>Count: {count}</p>
      <p>Message: {message}</p>

      <button onClick={handleClick}>
        Update
      </button>
    </div>
  );
}
```

`handleClick` 내부에서 두 개의 State 업데이트가 발생하지만 React는 이벤트 핸들러의 실행이 완료된 후 업데이트를 함께 처리합니다.

따라서 두 업데이트가 각각 별도의 렌더링을 발생시키지 않습니다.

React는 서로 다른 사용자 이벤트 사이까지 무조건 하나로 묶지는 않습니다.

예를 들어 첫 번째 클릭에서 버튼을 비활성화했다면 다음 클릭은 새로운 이벤트로 처리되며, 이전 클릭의 업데이트가 반영된 상태를 기준으로 동작할 수 있습니다.

이는 사용자 입력 이벤트 간의 일관성을 유지하기 위한 동작입니다.

## 4. Automatic Batching in React 18

React 18에서는 Automatic Batching이 도입되었습니다.

기존에는 React 이벤트 핸들러 내부의 업데이트가 주로 배칭되었으며, Promise나 Timer, Native Event Handler 내부의 업데이트는 기본적으로 동일한 방식으로 배칭되지 않았습니다.

React 18부터는 `createRoot`를 사용하는 경우 다양한 실행 환경에서 발생하는 State 업데이트도 자동으로 배칭됩니다.

### 4.1 Before React 18

React 18 이전에는 다음과 같은 코드에서 비동기 콜백 내부의 State 업데이트가 각각 렌더링을 발생시킬 수 있었습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setIsActive((prev) => !prev);
    }, 1000);
  }

  console.log('Render');

  return (
    <button onClick={handleClick}>
      {count} / {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
```

React 18 이전의 일반적인 동작에서는 `setTimeout` 콜백 내부의 두 업데이트가 각각 렌더링을 발생시킬 수 있었습니다.

```text
setTimeout Callback
       |
       +----> setCount()
       |         |
       |         v
       |       Render 1
       |
       +----> setIsActive()
                 |
                 v
               Render 2
```

### 4.2 React 18 and Later

React 18부터는 `createRoot`를 사용하는 환경에서 비동기 콜백 내부의 업데이트도 자동으로 배칭됩니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setIsActive((prev) => !prev);
    }, 1000);
  }

  console.log('Render');

  return (
    <button onClick={handleClick}>
      {count} / {isActive ? 'Active' : 'Inactive'}
    </button>
  );
}
```

두 State 업데이트가 하나의 배치로 처리되므로 일반적으로 한 번의 렌더링으로 변경 사항이 반영됩니다.

```text
setTimeout Callback
       |
       +----> setCount()
       |
       +----> setIsActive()
       |
       v
Automatic Batching
       |
       v
Render 1
```

Automatic Batching이 적용되는 대표적인 실행 환경은 다음과 같습니다.

| 실행 환경 | React 18 이전 | React 18 이후 (`createRoot`) |
|---|---|---|
| React Event Handler | Batching | Batching |
| Promise Callback | 기본적으로 미적용 | Automatic Batching |
| setTimeout | 기본적으로 미적용 | Automatic Batching |
| setInterval | 기본적으로 미적용 | Automatic Batching |
| Native Event Handler | 기본적으로 미적용 | Automatic Batching |

React 18의 Automatic Batching은 `createRoot`를 통해 사용하는 새로운 Root API를 기준으로 적용됩니다.

기존 `ReactDOM.render`를 계속 사용하는 경우에는 React 17과의 호환성을 위해 기존 배칭 동작이 유지됩니다.

```tsx
// React 18의 새로운 Root API
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root')!
);

root.render(<App />);
```

따라서 React 18 이상을 사용하더라도 Root 생성 방식에 따라 배칭 동작이 달라질 수 있습니다.

## 5. State Update Queue

Batching을 정확하게 이해하려면 State Update Queue의 동작을 함께 이해해야 합니다.

React는 State Setter가 호출될 때 새로운 State를 즉시 변경하는 대신 업데이트를 큐에 등록합니다.

이후 다음 렌더링 과정에서 큐에 등록된 업데이트를 순서대로 처리하여 최종 State를 계산합니다.

### 5.1 State Updates Using Values

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={handleClick}>
        +3
      </button>
    </div>
  );
}
```

세 번의 State 업데이트를 요청했지만 최종 결과는 `3`이 아니라 `1`입니다.

이유는 이벤트 핸들러에서 참조하는 `count`가 현재 렌더링의 State 값으로 고정되어 있기 때문입니다.

초기 `count`가 `0`이라면 다음 코드가 실행되는 것과 같습니다.

```tsx
setCount(0 + 1);
setCount(0 + 1);
setCount(0 + 1);
```

React는 세 번의 업데이트를 다음과 같은 값으로 큐에 등록합니다.

```text
Initial State: 0

Update Queue:
  1. Replace with 1
  2. Replace with 1
  3. Replace with 1

Final State: 1
```

각 업데이트가 동일한 값으로 State를 교체하므로 최종 결과도 `1`이 됩니다.

### 5.2 State Updates Using Updater Functions

동일한 State를 여러 번 순차적으로 변경하려면 Updater Function을 사용할 수 있습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
    setCount((prev) => prev + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={handleClick}>
        +3
      </button>
    </div>
  );
}
```

Updater Function은 이전 업데이트의 결과를 다음 업데이트의 입력값으로 사용합니다.

초기값이 `0`이라면 다음과 같이 처리됩니다.

| 순서 | Updater Function 입력 | 결과 |
|---|---:|---:|
| 첫 번째 | 0 | 1 |
| 두 번째 | 1 | 2 |
| 세 번째 | 2 | 3 |

따라서 최종 State는 `3`이 됩니다.

```text
Initial State: 0
       |
       v
prev => prev + 1
       |
       v
State: 1
       |
       v
prev => prev + 1
       |
       v
State: 2
       |
       v
prev => prev + 1
       |
       v
Final State: 3
```

### 5.3 Mixing Values and Updater Functions

값을 전달하는 방식과 Updater Function을 혼합해서 사용할 수도 있습니다.

```tsx
function handleClick() {
  setCount(count + 5);
  setCount((prev) => prev + 1);
}
```

초기 `count`가 `0`이라고 가정하면 다음과 같이 처리됩니다.

| 순서 | 업데이트 | 처리 결과 |
|---|---|---:|
| 1 | `setCount(5)` | 5 |
| 2 | `setCount(prev => prev + 1)` | 6 |

최종 State는 `6`입니다.

반면 다음과 같이 작성하면 최종 State는 `42`가 됩니다.

```tsx
function handleClick() {
  setCount(count + 5);
  setCount((prev) => prev + 1);
  setCount(42);
}
```

React는 업데이트 큐에 등록된 순서대로 작업을 처리합니다.

일반 값을 전달하면 해당 값으로 State를 교체하고, Updater Function을 전달하면 현재까지 계산된 State를 입력으로 사용하여 새로운 값을 계산합니다.

### 5.4 Updater Function Must Be Pure

Updater Function은 이전 State를 기반으로 다음 State를 계산하는 순수 함수여야 합니다.

```tsx
// Good
setCount((prev) => prev + 1);
```

다음과 같이 외부의 값을 변경하거나 Side Effect를 수행해서는 안 됩니다.

```tsx
// Bad
setCount((prev) => {
  console.log('Updating state');

  return prev + 1;
});
```

Updater Function은 렌더링 과정에서 실행되며, Strict Mode에서는 개발 환경에서 순수성을 확인하기 위해 추가 호출될 수 있습니다.

따라서 Updater Function 내부에는 다음과 같은 작업을 포함하지 않는 것이 좋습니다.

- API 요청
- DOM 직접 조작
- 외부 변수 변경
- 다른 State Setter 호출
- 로그 출력이나 기타 Side Effect

Side Effect는 이벤트 핸들러나 Effect 등 적절한 위치에서 처리해야 합니다.

## 6. Batching and State Snapshot

Batching을 이해할 때 중요한 개념 중 하나는 State Snapshot입니다.

React 컴포넌트는 렌더링될 때마다 해당 렌더링 시점의 State 값을 기준으로 실행됩니다.

State Setter를 호출하더라도 현재 실행 중인 이벤트 핸들러 내부의 State 변수가 즉시 변경되지는 않습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count);

    setCount(count + 1);

    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}
```

초기 State가 `0`인 경우 버튼을 클릭하면 두 번의 `console.log` 모두 `0`을 출력합니다.

`setCount()`는 새로운 렌더링을 요청하지만 현재 이벤트 핸들러가 참조하는 `count` 값은 변경하지 않기 때문입니다.

```text
Current Render
      |
      v
count = 0
      |
      v
handleClick()
      |
      +----> console.log(count) // 0
      |
      +----> setCount(1)
      |
      +----> console.log(count) // 0
      |
      v
Event Handler Completed
      |
      v
Next Render
      |
      v
count = 1
```

이러한 동작은 Batching과 함께 이해해야 합니다.

State Setter 호출은 즉시 State 변수를 변경하는 작업이 아니라 React에 다음 렌더링을 요청하고 업데이트 큐에 작업을 등록하는 과정입니다.

## 7. Controlling Batching with flushSync

Automatic Batching은 대부분의 상황에서 성능과 UI 일관성을 개선하지만, 특정 상황에서는 DOM 업데이트를 동기적으로 완료해야 할 수 있습니다.

React DOM은 이러한 상황을 위해 `flushSync` API를 제공합니다.

`flushSync`는 전달된 콜백 내부의 State 업데이트를 동기적으로 처리하고 DOM에 반영하도록 React에 요청합니다.

### 7.1 Basic Usage

```tsx
import { useState } from 'react';
import { flushSync } from 'react-dom';

function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    flushSync(() => {
      setCount((prev) => prev + 1);
    });

    // 이 시점에는 React가 DOM 업데이트를 완료했습니다.
    console.log('DOM updated');
  }

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}
```

일반적인 State 업데이트는 React의 배칭 및 스케줄링에 따라 처리되므로 Setter 호출 직후 DOM 변경이 완료되었다고 보장할 수 없습니다.

반면 `flushSync`를 사용하면 콜백 내부의 업데이트가 동기적으로 처리되므로 콜백이 반환된 시점에는 관련 DOM 업데이트가 완료됩니다.

### 7.2 Integrating with Third-party APIs

`flushSync`는 React 외부의 API나 라이브러리가 DOM 업데이트 직후의 상태를 필요로 하는 경우에 활용할 수 있습니다.

예를 들어 새로운 항목을 추가한 직후 해당 DOM 요소를 기준으로 브라우저의 인쇄 기능을 실행해야 하는 상황을 가정할 수 있습니다.

```tsx
import { useState } from 'react';
import { flushSync } from 'react-dom';

function PrintList() {
  const [items, setItems] = useState<string[]>([]);

  function handlePrint() {
    flushSync(() => {
      setItems((prev) => [...prev, 'New Item']);
    });

    window.print();
  }

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <button onClick={handlePrint}>
        Add and Print
      </button>
    </div>
  );
}
```

이 예제에서는 `flushSync`가 반환된 이후 인쇄 기능을 실행하므로 새 항목이 DOM에 반영된 상태를 기준으로 작업을 진행할 수 있습니다.

다만 실제 리스트에서는 Index 대신 안정적인 고유 ID를 Key로 사용하는 것이 권장됩니다.

### 7.3 Cautions When Using flushSync

`flushSync`는 일반적인 State 업데이트 흐름을 제어하는 API가 아닙니다.

필요한 경우에만 제한적으로 사용해야 합니다.

주요 주의사항은 다음과 같습니다.

- 성능에 부정적인 영향을 줄 수 있습니다.
- React가 필요한 작업을 동기적으로 완료하도록 강제하므로 불필요한 렌더링 비용이 발생할 수 있습니다.
- 콜백 내부의 업데이트뿐 아니라 필요한 경우 다른 대기 중인 업데이트나 Effect까지 처리할 수 있습니다.
- Suspense Boundary가 존재하는 경우 Fallback UI가 다시 표시될 수 있습니다.
- 컴포넌트의 Render 과정이나 Effect 내부에서 호출해서는 안 됩니다.

특히 다음과 같은 사용은 피해야 합니다.

```tsx
// Avoid
useEffect(() => {
  flushSync(() => {
    setCount(1);
  });
}, []);
```

React가 이미 렌더링 또는 Effect 실행을 처리하는 과정에서 `flushSync`를 호출하면 경고가 발생하거나 의도한 대로 동작하지 않을 수 있습니다.

일반적으로 `flushSync`는 외부 시스템과의 동기화가 필요한 경우에만 최후의 수단으로 사용하는 것이 좋습니다.

## 8. Batching and Component Rendering

Batching은 여러 State 업데이트를 하나의 렌더링 작업으로 묶지만, 모든 컴포넌트가 반드시 한 번만 실행된다는 의미는 아닙니다.

React의 렌더링은 State 업데이트가 발생한 컴포넌트뿐 아니라 해당 업데이트의 영향을 받는 컴포넌트 트리의 처리와 연결됩니다.

또한 다음과 같은 요소에 따라 컴포넌트의 실제 실행 횟수는 달라질 수 있습니다.

- 부모 컴포넌트의 렌더링
- Context 변경
- 컴포넌트의 Props 변경
- `memo`를 통한 렌더링 최적화
- Strict Mode의 개발 환경 검사
- Concurrent Rendering에 따른 작업 중단 및 재시작

따라서 Batching은 컴포넌트 실행 횟수를 무조건 한 번으로 제한하는 기능이 아니라, 여러 State 업데이트를 효율적으로 처리하기 위한 렌더링 최적화 기법으로 이해해야 합니다.

또한 Batching과 `memo`, `useMemo`, `useCallback`은 서로 다른 목적을 가집니다.

| 기능 | 주요 목적 |
|---|---|
| Batching | 여러 State 업데이트를 하나의 렌더링 작업으로 묶음 |
| `memo` | Props가 변경되지 않은 컴포넌트의 불필요한 렌더링 방지 |
| `useMemo` | 계산 결과를 재사용 |
| `useCallback` | 함수 참조를 재사용 |

이러한 기능은 서로 대체하는 관계가 아니며, 각각의 동작 원리에 맞게 사용해야 합니다.

## 9. Important Considerations

Batching을 사용할 때 다음 사항을 이해해야 합니다.

### 9.1 State Setter Does Not Immediately Update State

State Setter를 호출하더라도 현재 렌더링에서 사용 중인 State 값은 변경되지 않습니다.

새로운 State는 다음 렌더링에서 확인할 수 있습니다.

### 9.2 Batching Does Not Mean Multiple Updates Become One Update

여러 State 업데이트는 각각 큐에 등록됩니다.

React가 이 업데이트들을 순서대로 처리한 후 하나의 렌더링 결과에 반영하는 것입니다.

따라서 동일한 State를 여러 번 계산해야 한다면 Updater Function을 사용해야 합니다.

### 9.3 Automatic Batching Depends on the Root API

React 18의 Automatic Batching은 `createRoot`를 사용하는 환경을 기준으로 동작합니다.

기존 `ReactDOM.render`를 사용하면 이전 버전과의 호환성을 위해 기존 배칭 동작이 유지됩니다.

### 9.4 Batching Does Not Cross Every Event Boundary

React는 서로 다른 사용자 이벤트를 무조건 하나의 배치로 묶지 않습니다.

특히 개별 클릭이나 입력 이벤트의 결과가 다음 이벤트 처리에 영향을 주는 경우 이벤트별로 업데이트가 처리됩니다.

### 9.5 flushSync Should Be Used Sparingly

`flushSync`는 DOM 업데이트의 동기적 완료가 필요한 특수한 상황에서만 사용해야 합니다.

일반적인 State 업데이트를 빠르게 만들거나 렌더링 성능을 개선하기 위한 목적으로 사용해서는 안 됩니다.

## 10. Summary

Batching은 React가 여러 State 업데이트를 하나의 렌더링 작업으로 묶어 처리하는 최적화 기법입니다.

| 개념 | 설명 |
|---|---|
| Batching | 여러 State 업데이트를 하나의 렌더링 작업으로 묶는 동작 |
| State Update Queue | State 업데이트를 등록하고 순서대로 처리하는 큐 |
| Updater Function | 이전 State를 입력받아 다음 State를 계산하는 함수 |
| State Snapshot | 특정 렌더링 시점에 고정된 State 값 |
| Automatic Batching | React 18부터 다양한 실행 환경에서 자동으로 적용되는 배칭 |
| `flushSync` | State 업데이트와 DOM 반영을 동기적으로 완료하도록 요청하는 API |

핵심적으로 다음 사항을 이해해야 합니다.

- React는 여러 State 업데이트를 하나의 렌더링 작업으로 묶어 처리할 수 있습니다.
- Batching은 불필요한 렌더링 작업을 줄이고 UI의 일관성을 유지하는 데 도움이 됩니다.
- React 이벤트 핸들러 내부의 State 업데이트는 기존부터 배칭되었습니다.
- React 18부터 `createRoot`를 사용하는 경우 Promise, Timer, Native Event Handler 등에서도 Automatic Batching이 적용됩니다.
- 동일한 State를 여러 번 순차적으로 업데이트하려면 Updater Function을 사용하는 것이 적절합니다.
- State Setter를 호출해도 현재 렌더링의 State Snapshot은 변경되지 않습니다.
- `flushSync`는 DOM 업데이트를 동기적으로 완료해야 하는 특수한 상황에서만 사용해야 합니다.
- Batching은 `memo`, `useMemo`, `useCallback`과 목적이 다른 최적화 기법입니다.

Batching은 React의 State 업데이트 처리 과정과 렌더링 최적화를 이해하기 위한 핵심 개념입니다. State Update Queue와 State Snapshot을 함께 이해하면 여러 State Setter가 호출될 때 React가 최종 State를 계산하는 과정을 명확하게 파악할 수 있습니다.

## 11. References

- [React Official Documentation - Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [React Official Documentation - State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React Official Documentation - useState](https://react.dev/reference/react/useState)
- [React Official Documentation - flushSync](https://react.dev/reference/react-dom/flushSync)
- [React Official Blog - React v18: Automatic Batching](https://react.dev/blog/2022/03/29/react-v18)
- [React Official Blog - How to Upgrade to React 18](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [React 18 RFC - Automatic Batching](https://github.com/reactjs/rfcs/blob/main/text/0212-react-18.md)