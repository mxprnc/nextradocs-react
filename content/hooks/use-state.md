# useState

## 1. 개념

`useState`는 함수 컴포넌트에서 상태(State)를 선언하고 관리할 수 있도록 제공하는 React Hook입니다.

React 컴포넌트는 일반 JavaScript 함수와 달리 렌더링 사이에 유지해야 하는 데이터가 존재할 수 있습니다. 일반 변수는 컴포넌트가 다시 호출될 때마다 새로운 값으로 초기화되지만, State는 React가 별도로 관리하므로 여러 렌더링 사이에서도 값을 유지할 수 있습니다.

`useState`를 사용하면 컴포넌트 내부에 상태 변수를 선언하고, 상태 변경이 필요한 시점에 Setter 함수를 호출하여 새로운 상태를 요청할 수 있습니다.

상태가 업데이트되면 React는 해당 컴포넌트를 다시 렌더링하고 변경된 상태를 기반으로 새로운 UI를 계산합니다.

`useState`의 주요 특징은 다음과 같습니다.

- 함수 컴포넌트에서 상태를 선언하고 유지할 수 있습니다.
- 숫자, 문자열, 불리언, 객체, 배열 등 다양한 JavaScript 값을 상태로 관리할 수 있습니다.
- Setter 함수를 통해 상태 업데이트를 요청할 수 있습니다.
- 상태 변경에 따라 컴포넌트가 다시 렌더링됩니다.
- 이전 상태를 기반으로 새로운 상태를 계산하는 함수형 업데이트를 지원합니다.
- 여러 상태 업데이트를 하나의 렌더링으로 처리하는 Batching을 지원합니다.

## 2. 기본 사용법

`useState`는 React에서 Import하여 함수 컴포넌트의 최상위 수준에서 호출합니다.

기본적인 사용 형태는 다음과 같습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

`useState`는 배열 형태로 두 가지 값을 반환합니다.

```tsx
const [state, setState] = useState(initialState);
```

| 반환값 | 설명 |
|---|---|
| `state` | 현재 렌더링에서 사용하는 상태값입니다. |
| `setState` | 새로운 상태를 요청하는 Setter 함수입니다. |

각 반환값은 일반적으로 다음과 같은 명명 규칙을 사용합니다.

- 상태 변수: `count`
- 상태 업데이트 함수: `setCount`

Setter 함수에 새로운 값을 전달하면 React는 해당 상태의 업데이트를 예약하고 컴포넌트의 재렌더링을 요청합니다.

```tsx
const [count, setCount] = useState<number>(0);

// 새로운 상태값 지정
setCount(10);
```

이후 React가 컴포넌트를 다시 렌더링하면 `count`에는 새로운 상태값인 `10`이 반영됩니다.

## 3. State의 초기화

`useState`는 첫 번째 렌더링에서 사용할 초기 상태값을 인자로 전달받습니다.

```tsx
const [count, setCount] = useState<number>(0);
```

초기 상태값은 다음과 같은 다양한 타입을 사용할 수 있습니다.

```tsx
const [count, setCount] = useState<number>(0);
const [name, setName] = useState<string>('React');
const [enabled, setEnabled] = useState<boolean>(false);
const [items, setItems] = useState<string[]>([]);
```

초기 상태값은 컴포넌트가 최초로 마운트될 때 사용되며, 이후 렌더링에서는 다시 초기화되지 않습니다.

### 3.1. 초기값의 타입 추론

TypeScript 환경에서는 초기 상태값을 기반으로 타입이 자동으로 추론됩니다.

```tsx
const [count, setCount] = useState(0);
```

위 코드에서 TypeScript는 `count`를 `number` 타입으로 추론하고, `setCount`는 숫자 또는 숫자를 반환하는 업데이트 함수를 인자로 받을 수 있도록 타입을 결정합니다.

따라서 일반적인 경우에는 타입 매개변수를 명시하지 않아도 됩니다.

다만 초기 상태값만으로 전체 상태의 타입을 추론하기 어려운 경우에는 명시적으로 타입을 지정해야 합니다.

```tsx
type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

위 예제에서는 초기 상태가 `null`이지만 이후 `User` 객체를 저장해야 하므로 `User | null` 타입을 명시합니다.

### 3.2. Lazy Initialization

초기 상태를 계산하는 과정에서 비용이 많이 발생하는 경우에는 초기화 함수를 전달할 수 있습니다.

```tsx
const [todos, setTodos] = useState(() => createInitialTodos());
```

`useState`에 함수를 전달하면 해당 함수는 일반적인 상태값이 아니라 초기화 함수(Initializer Function)로 처리됩니다.

React는 초기화 함수의 반환값을 초기 상태로 사용합니다.

다음 두 코드는 동작 방식에 차이가 있습니다.

```tsx
// 렌더링할 때마다 createInitialTodos()가 실행됩니다.
const [todos, setTodos] = useState(createInitialTodos());

// 초기화 과정에서만 createInitialTodos가 실행됩니다.
const [todos, setTodos] = useState(createInitialTodos);
```

첫 번째 코드는 컴포넌트가 렌더링될 때마다 함수 호출 결과를 계산하지만, 실제 초기 상태는 최초 렌더링에서만 사용됩니다.

두 번째 코드는 함수 자체를 전달하므로 React가 초기 상태를 설정할 때만 함수를 실행합니다.

따라서 초기 상태 계산에 비용이 많이 발생하는 경우에는 Lazy Initialization을 사용하는 것이 적절합니다.

초기화 함수는 순수 함수(Pure Function)여야 합니다. React Strict Mode에서는 개발 환경에서 초기화 함수가 두 번 호출될 수 있으므로, 함수 내부에서 외부 상태를 변경하거나 부수 효과를 발생시키면 안 됩니다.

## 4. State 업데이트

State는 Setter 함수를 호출하여 업데이트합니다.

Setter 함수에는 다음 두 가지 형태의 인자를 전달할 수 있습니다.

1. 새로운 상태값
2. 이전 상태를 기반으로 새로운 상태를 계산하는 함수

### 4.1. 새로운 상태값 전달

새로운 상태값을 직접 전달하는 가장 기본적인 방법입니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  function handleIncrement() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleIncrement}>
      {count}
    </button>
  );
}
```

`setCount(count + 1)`이 호출되면 React는 새로운 상태값을 예약합니다.

다음 렌더링에서 새로운 상태값이 반영되며, 컴포넌트의 UI도 해당 값에 맞게 갱신됩니다.

### 4.2. Functional Update

이전 상태값을 기반으로 새로운 상태를 계산해야 하는 경우에는 Setter 함수에 업데이트 함수를 전달할 수 있습니다.

이를 함수형 업데이트(Functional Update)라고 합니다.

```tsx
setCount((previousCount) => previousCount + 1);
```

업데이트 함수는 React가 처리할 대기 중인 상태값을 인자로 전달받으며, 새로운 상태값을 반환해야 합니다.

다음은 함수형 업데이트를 사용하는 Counter 예제입니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  function handleIncrement() {
    setCount((previousCount) => previousCount + 1);
  }

  return (
    <button onClick={handleIncrement}>
      {count}
    </button>
  );
}
```

함수형 업데이트는 특히 동일한 이벤트에서 여러 차례 상태를 업데이트하거나 이전 상태에 의존하는 계산이 필요한 경우 유용합니다.

### 4.3. 직접 업데이트와 함수형 업데이트의 차이

다음 예제에서는 하나의 이벤트 핸들러에서 상태 업데이트를 세 번 요청합니다.

```tsx
function handleIncrement() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

초기 `count`가 `0`이라면 최종 결과는 `3`이 아니라 `1`입니다.

이는 하나의 렌더링에서 사용하는 `count`가 해당 렌더링 시점의 값으로 고정되어 있기 때문입니다.

세 번의 호출은 모두 `setCount(1)`과 동일한 업데이트로 처리됩니다.

반면 함수형 업데이트를 사용하면 다음과 같습니다.

```tsx
function handleIncrement() {
  setCount((previousCount) => previousCount + 1);
  setCount((previousCount) => previousCount + 1);
  setCount((previousCount) => previousCount + 1);
}
```

이 경우 React는 업데이트 함수를 순서대로 처리합니다.

| 순서 | 전달받은 이전 상태 | 반환하는 다음 상태 |
|---|---:|---:|
| 첫 번째 업데이트 | 0 | 1 |
| 두 번째 업데이트 | 1 | 2 |
| 세 번째 업데이트 | 2 | 3 |

따라서 최종 상태는 `3`이 됩니다.

React는 업데이트 함수를 큐에 저장하고 다음 렌더링 과정에서 순서대로 적용합니다.

이전 상태를 기반으로 새로운 상태를 계산해야 한다면 함수형 업데이트를 사용하는 것이 안전합니다.

### 4.4. Updater Function의 순수성

함수형 업데이트에 전달하는 함수는 순수 함수여야 합니다.

업데이트 함수 내부에서는 전달받은 이전 상태를 기반으로 새로운 상태를 계산하고 반환해야 합니다.

다음과 같이 부수 효과를 발생시키는 코드는 피해야 합니다.

```tsx
setCount((previousCount) => {
  console.log(previousCount);

  // 잘못된 사용: 업데이트 함수 내부에서 부수 효과 발생
  return previousCount + 1;
});
```

업데이트 함수는 React가 렌더링 과정에서 실행할 수 있으며, Strict Mode의 개발 환경에서는 순수성을 검사하기 위해 두 번 호출될 수 있습니다.

따라서 다음 작업을 수행해서는 안 됩니다.

- 외부 변수 변경
- 네트워크 요청
- DOM 직접 조작
- 다른 State 업데이트
- 외부 시스템에 영향을 주는 부수 효과

부수 효과가 필요한 작업은 이벤트 핸들러나 적절한 Effect에서 처리해야 합니다.

## 5. State as a Snapshot

React의 State는 일반적인 JavaScript 변수와 달리 Snapshot 형태로 동작합니다.

컴포넌트가 렌더링될 때 React는 해당 렌더링에서 사용할 상태값을 전달합니다.

따라서 이벤트 핸들러 내부에서 Setter를 호출하더라도 현재 실행 중인 함수가 참조하는 상태값은 변경되지 않습니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState<number>(0);

  function handleClick() {
    setCount(count + 1);

    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
```

초기 상태가 `0`인 경우 버튼을 클릭하면 다음과 같이 동작합니다.

1. 현재 렌더링의 `count`는 `0`입니다.
2. `setCount(1)`이 호출되어 상태 업데이트가 예약됩니다.
3. `console.log(count)`는 현재 렌더링의 상태값인 `0`을 출력합니다.
4. 이벤트 핸들러 실행이 완료됩니다.
5. React가 새로운 상태값으로 컴포넌트를 다시 렌더링합니다.
6. 다음 렌더링에서 `count`는 `1`이 됩니다.

즉, Setter 호출은 현재 실행 중인 코드의 상태 변수를 직접 변경하지 않습니다.

새로운 상태값이 필요한 경우에는 별도의 변수를 사용하여 계산할 수 있습니다.

```tsx
function handleClick() {
  const nextCount = count + 1;

  setCount(nextCount);

  console.log(count);     // 현재 렌더링의 값
  console.log(nextCount); // 계산한 다음 상태값
}
```

이러한 특성은 비동기 콜백에서도 동일하게 적용됩니다.

이벤트 핸들러가 생성된 렌더링의 상태값을 참조하므로, `setTimeout`이나 Promise 콜백에서도 해당 렌더링의 Snapshot을 사용합니다.

State Snapshot을 이해하면 상태 업데이트 이후에도 이전 값이 출력되는 이유와 Closure로 인해 발생하는 Stale State 문제를 이해하는 데 도움이 됩니다.

## 6. Batching

Batching은 여러 State 업데이트를 하나로 묶어 처리함으로써 불필요한 재렌더링을 줄이는 React의 최적화 메커니즘입니다.

일반적으로 React는 하나의 이벤트 핸들러에서 여러 Setter가 호출되더라도 각 호출마다 즉시 렌더링하지 않습니다.

이벤트 핸들러 실행이 완료된 이후 여러 상태 업데이트를 함께 처리하여 컴포넌트를 다시 렌더링합니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function UserProfile() {
  const [name, setName] = useState('React');
  const [age, setAge] = useState(20);
  const [enabled, setEnabled] = useState(true);

  function handleUpdate() {
    setName('TypeScript');
    setAge(25);
    setEnabled(false);
  }

  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
      <p>{enabled ? 'Enabled' : 'Disabled'}</p>

      <button onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}
```

`handleUpdate`에서 세 개의 Setter를 호출하지만 React는 일반적으로 이를 하나의 렌더링으로 처리합니다.

### 6.1. Automatic Batching

React 18부터는 Automatic Batching이 지원됩니다.

React 18 이전에는 주로 React 이벤트 핸들러 내부의 상태 업데이트가 Batching의 대상이었으며, Promise나 `setTimeout` 등의 비동기 콜백에서 발생하는 업데이트는 별도로 렌더링되는 경우가 있었습니다.

React 18 이후에는 이러한 비동기 작업 내부의 상태 업데이트도 기본적으로 Batching의 대상이 됩니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [enabled, setEnabled] = useState(false);

  function handleClick() {
    setTimeout(() => {
      setCount((prev) => prev + 1);
      setEnabled(true);
    }, 1000);
  }

  return (
    <div>
      <p>{count}</p>
      <p>{enabled ? 'Enabled' : 'Disabled'}</p>

      <button onClick={handleClick}>
        Update
      </button>
    </div>
  );
}
```

React 18 이상의 일반적인 환경에서는 두 상태 업데이트가 하나의 렌더링으로 처리됩니다.

Automatic Batching은 다음과 같은 상황에서 적용됩니다.

- React 이벤트 핸들러
- Promise 콜백
- `setTimeout` 및 `setInterval` 콜백
- Native Event Handler
- 기타 일반적인 비동기 작업의 콜백

### 6.2. flushSync

일반적으로 React의 Batching 동작을 직접 제어할 필요는 없습니다.

다만 특정 상황에서 상태 업데이트 결과를 DOM에 동기적으로 반영해야 한다면 `flushSync`를 사용할 수 있습니다.

```tsx
import { flushSync } from 'react-dom';

function handleClick() {
  flushSync(() => {
    setCount((prev) => prev + 1);
  });

  // 이 시점에는 업데이트된 DOM을 확인할 수 있습니다.
}
```

`flushSync`는 전달된 콜백 내부의 업데이트를 동기적으로 처리하도록 요청합니다.

그러나 렌더링 성능을 저하시킬 수 있으므로 일반적인 상태 업데이트에서는 사용하지 않는 것이 좋습니다.

## 7. 객체와 배열의 State 관리

`useState`는 원시 타입뿐 아니라 객체와 배열도 상태로 관리할 수 있습니다.

다만 React의 State는 읽기 전용(Read-only)으로 취급해야 합니다.

객체나 배열을 직접 변경(Mutation)하는 대신 새로운 객체 또는 배열을 생성하여 Setter에 전달해야 합니다.

### 7.1. 객체 State 업데이트

다음은 사용자 정보를 객체 형태로 관리하는 예제입니다.

```tsx
import { useState } from 'react';

type User = {
  name: string;
  age: number;
};

function UserProfile() {
  const [user, setUser] = useState<User>({
    name: 'React',
    age: 20,
  });

  function handleUpdateName() {
    setUser({
      ...user,
      name: 'TypeScript',
    });
  }

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.age}</p>

      <button onClick={handleUpdateName}>
        Update Name
      </button>
    </div>
  );
}
```

객체를 업데이트할 때 Spread Syntax를 사용하면 기존 객체의 속성을 복사하면서 특정 속성만 변경할 수 있습니다.

반면 다음과 같은 코드는 피해야 합니다.

```tsx
// 잘못된 사용
user.name = 'TypeScript';

setUser(user);
```

기존 객체를 직접 변경하면 객체의 참조가 유지됩니다.

React는 이전 상태와 다음 상태를 `Object.is`로 비교하므로 동일한 객체 참조를 전달하면 업데이트를 무시할 수 있습니다.

따라서 새로운 객체를 생성하여 전달해야 합니다.

### 7.2. 중첩 객체 State 업데이트

중첩된 객체의 속성을 변경할 때는 변경이 필요한 경로에 있는 객체를 각각 복사해야 합니다.

```tsx
type User = {
  name: string;
  address: {
    city: string;
    country: string;
  };
};

const [user, setUser] = useState<User>({
  name: 'React',
  address: {
    city: 'Seoul',
    country: 'Korea',
  },
});
```

`city`를 변경하려면 다음과 같이 작성합니다.

```tsx
setUser((previousUser) => ({
  ...previousUser,
  address: {
    ...previousUser.address,
    city: 'Busan',
  },
}));
```

Spread Syntax는 얕은 복사(Shallow Copy)를 수행합니다.

따라서 최상위 객체만 복사하는 것으로는 중첩된 객체의 참조까지 분리되지 않습니다.

변경할 경로에 있는 객체를 각각 복사해야 불변성을 유지할 수 있습니다.

### 7.3. 배열 State 업데이트

배열을 상태로 관리하는 경우에도 기존 배열을 직접 변경하지 않고 새로운 배열을 생성해야 합니다.

```tsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState<string[]>([
    'Learn React',
    'Learn TypeScript',
  ]);

  function handleAddTodo() {
    setTodos((previousTodos) => [
      ...previousTodos,
      'Build Application',
    ]);
  }

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo}>{todo}</li>
        ))}
      </ul>

      <button onClick={handleAddTodo}>
        Add Todo
      </button>
    </div>
  );
}
```

배열 상태를 업데이트할 때 자주 사용하는 메서드는 다음과 같습니다.

| 작업 | 권장 방법 |
|---|---|
| 항목 추가 | Spread Syntax, `concat()` |
| 항목 제거 | `filter()` |
| 항목 변경 | `map()` |
| 항목 정렬 | 복사본에 `sort()` 적용 |
| 배열 일부 추출 | `slice()` |

다음과 같은 메서드는 기존 배열을 직접 변경하므로 주의해야 합니다.

- `push()`
- `pop()`
- `splice()`
- `sort()`
- `reverse()`

예를 들어 정렬이 필요한 경우 기존 배열을 복사한 후 정렬해야 합니다.

```tsx
setTodos((previousTodos) => {
  return [...previousTodos].sort();
});
```

## 8. State의 타입 관리

React + TypeScript 환경에서는 `useState`의 제네릭 타입을 활용하여 상태의 타입을 명확하게 지정할 수 있습니다.

일반적인 경우에는 초기값을 통해 타입이 추론되지만, 초기값만으로 타입을 결정하기 어려운 경우에는 타입 매개변수를 명시해야 합니다.

### 8.1. Union Type

상태가 여러 타입을 가질 수 있는 경우 Union Type을 활용합니다.

```tsx
type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

위 상태는 `User` 객체 또는 `null`을 가질 수 있습니다.

초기에는 사용자가 존재하지 않지만, 이후 API 응답을 통해 사용자 정보가 설정되는 상황에 적합합니다.

### 8.2. Literal Union Type

특정 문자열이나 값만 상태로 허용해야 한다면 Literal Union Type을 사용할 수 있습니다.

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<Status>('idle');
```

이렇게 선언하면 허용된 상태값 외의 문자열이 Setter에 전달되는 것을 TypeScript가 검사할 수 있습니다.

### 8.3. 함수 자체를 State로 관리하기

`useState`는 초기값과 Setter에 전달된 함수에 특별한 의미를 부여합니다.

- 초기값으로 전달된 함수는 초기화 함수로 처리됩니다.
- Setter에 전달된 함수는 이전 상태를 받는 업데이트 함수로 처리됩니다.

따라서 함수 자체를 상태값으로 저장해야 하는 경우에는 함수를 한 번 더 감싸야 합니다.

```tsx
type Handler = () => void;

const initialHandler: Handler = () => {
  console.log('Initial handler');
};

const [handler, setHandler] = useState<Handler>(
  () => initialHandler
);
```

함수 상태를 업데이트할 때도 동일한 원칙이 적용됩니다.

```tsx
const nextHandler: Handler = () => {
  console.log('Next handler');
};

setHandler(() => nextHandler);
```

바깥쪽 함수는 React가 실행하는 초기화 함수 또는 업데이트 함수이며, 내부에서 반환하는 함수가 실제 State로 저장됩니다.

## 9. State 초기화와 컴포넌트 재설정

`useState`의 초기값은 컴포넌트가 최초로 마운트될 때 결정됩니다.

이후 Props가 변경되더라도 기존 State가 자동으로 초기화되지는 않습니다.

다음 예제를 살펴보겠습니다.

```tsx
function UserProfile({
  initialName,
}: {
  initialName: string;
}) {
  const [name, setName] = useState(initialName);

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

`initialName`이 변경되더라도 이미 생성된 `name` State는 자동으로 변경되지 않습니다.

이는 초기값이 이후 렌더링에서 무시되기 때문입니다.

### 9.1. Key를 활용한 State 초기화

컴포넌트의 상태 전체를 초기화해야 하는 경우에는 `key`를 변경하는 방법을 사용할 수 있습니다.

```tsx
import { useState } from 'react';

function App() {
  const [userId, setUserId] = useState(1);

  return (
    <div>
      <button onClick={() => setUserId(2)}>
        Change User
      </button>

      <UserProfile
        key={userId}
        initialName={`User ${userId}`}
      />
    </div>
  );
}

function UserProfile({
  initialName,
}: {
  initialName: string;
}) {
  const [name, setName] = useState(initialName);

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

`key`가 변경되면 React는 기존 컴포넌트를 제거하고 새로운 컴포넌트로 생성합니다.

이 과정에서 해당 컴포넌트와 하위 컴포넌트의 State도 새롭게 초기화됩니다.

따라서 특정 데이터가 변경될 때 컴포넌트의 전체 상태를 초기화해야 한다면 `key`를 활용할 수 있습니다.

## 10. State 설계 시 주의사항

### 10.1. 파생 상태(Derived State) 최소화

기존 Props나 State를 통해 계산할 수 있는 값은 별도의 State로 관리하지 않는 것이 좋습니다.

다음은 불필요하게 파생 상태를 관리하는 예제입니다.

```tsx
function UserProfile({
  firstName,
  lastName,
}: {
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

`fullName`은 기존 Props를 통해 계산할 수 있으므로 별도의 State와 Effect가 필요하지 않습니다.

다음과 같이 렌더링 과정에서 직접 계산하는 것이 적절합니다.

```tsx
function UserProfile({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const fullName = `${firstName} ${lastName}`;

  return <p>{fullName}</p>;
}
```

계산 비용이 높은 경우에는 `useMemo`를 고려할 수 있습니다.

### 10.2. 관련된 State의 구조화

서로 밀접하게 관련된 여러 상태는 하나의 객체로 관리할 수 있습니다.

```tsx
type FormState = {
  name: string;
  email: string;
  age: number;
};

const [form, setForm] = useState<FormState>({
  name: '',
  email: '',
  age: 0,
});
```

다만 모든 상태를 하나의 객체로 묶는 것이 항상 좋은 것은 아닙니다.

독립적으로 변경되는 상태는 별도로 관리하는 편이 코드의 가독성과 유지보수에 유리할 수 있습니다.

상태 간 의존성이 복잡해지거나 여러 업데이트 로직을 명확하게 관리해야 한다면 `useReducer`를 고려할 수 있습니다.

### 10.3. State를 직접 변경하지 않기

State의 객체나 배열을 직접 변경하면 React가 변경을 올바르게 감지하지 못할 수 있습니다.

항상 새로운 참조를 생성하여 Setter에 전달해야 합니다.

### 10.4. State 업데이트는 즉시 반영되지 않음

Setter를 호출해도 현재 렌더링의 상태값은 변경되지 않습니다.

따라서 Setter 호출 직후 상태값을 읽으면 이전 렌더링의 값이 반환됩니다.

새로운 상태를 기준으로 작업해야 하는 경우에는 함수형 업데이트나 별도의 계산값을 활용해야 합니다.

### 10.5. 불필요한 State 업데이트 방지

새로운 상태값이 기존 상태값과 `Object.is` 기준으로 동일하다면 React는 재렌더링을 생략할 수 있습니다.

```tsx
const [count, setCount] = useState(0);

setCount(0);
```

위 코드는 현재 상태가 이미 `0`이라면 실질적인 상태 변경이 발생하지 않습니다.

다만 동일한 상태값이 전달되더라도 React가 컴포넌트 함수를 호출한 후 하위 렌더링을 생략하는 경우가 있을 수 있으므로, 컴포넌트 함수의 호출 여부에 의존하는 로직을 작성해서는 안 됩니다.

## 11. useState와 useReducer 비교

`useState`와 `useReducer`는 모두 함수 컴포넌트의 상태를 관리하는 State Hooks입니다.

두 Hook은 상태 관리 방식과 업데이트 로직을 구성하는 방법에 차이가 있습니다.

| 구분 | useState | useReducer |
|---|---|---|
| 상태 관리 | 개별 상태값 중심 | 하나의 Reducer를 통한 상태 관리 |
| 업데이트 방식 | Setter 호출 | Dispatch 호출 |
| 업데이트 로직 | 컴포넌트에서 직접 구성 | Reducer 함수에서 정의 |
| 적합한 상황 | 단순하고 독립적인 상태 | 복잡하고 연관된 상태 |
| 상태 변경 규칙 | Setter에 전달한 값 또는 함수 | Action에 따라 Reducer가 결정 |

`useState`는 단순한 상태를 관리할 때 적합합니다.

반면 `useReducer`는 여러 상태가 서로 연관되어 있거나 상태 변경 로직을 명확하게 분리해야 하는 경우 유용합니다.

## 12. 정리

`useState`는 함수 컴포넌트에서 상태를 선언하고 관리할 수 있도록 지원하는 기본적인 React Hook입니다.

React는 State를 컴포넌트 외부에서 관리하며, 각 렌더링에 해당하는 상태값을 Snapshot 형태로 제공합니다.

Setter를 호출하면 상태 업데이트가 예약되고, React는 업데이트를 처리한 후 새로운 상태를 기반으로 컴포넌트를 다시 렌더링합니다.

`useState`를 올바르게 사용하기 위해서는 다음 사항을 이해해야 합니다.

- `useState`는 현재 상태값과 Setter 함수를 반환합니다.
- 초기 상태값은 최초 렌더링에서만 사용됩니다.
- Lazy Initialization을 통해 초기 상태 계산을 최적화할 수 있습니다.
- 함수형 업데이트를 사용하면 이전 상태를 기반으로 새로운 상태를 계산할 수 있습니다.
- State는 Snapshot 형태로 동작하므로 Setter 호출 직후 현재 상태 변수가 변경되지 않습니다.
- Batching을 통해 여러 상태 업데이트를 하나의 렌더링으로 처리할 수 있습니다.
- 객체와 배열은 직접 변경하지 않고 새로운 참조를 생성해야 합니다.
- `key`를 변경하면 컴포넌트의 상태를 초기화할 수 있습니다.
- 기존 Props나 State로 계산할 수 있는 값은 불필요하게 별도의 State로 관리하지 않는 것이 좋습니다.
- 상태 업데이트 로직이 복잡해지는 경우 `useReducer`를 고려할 수 있습니다.

## 13. 참고 자료

- [React 공식 문서 - useState](https://react.dev/reference/react/useState)
- [React 공식 문서 - State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React 공식 문서 - State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [React 공식 문서 - Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [React 공식 문서 - Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [React 공식 문서 - Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [React 공식 문서 - Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React 공식 문서 - Using TypeScript](https://react.dev/learn/typescript)
- [React 공식 문서 - useReducer](https://react.dev/reference/react/useReducer)