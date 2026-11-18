# State

## 1. State 개요

State는 React 컴포넌트가 렌더링 사이에 유지하는 데이터입니다. 사용자의 입력, 버튼 클릭, 서버 응답 등으로 데이터가 변경되면 React는 해당 State를 사용하는 컴포넌트를 다시 렌더링하여 화면을 갱신합니다.

일반 JavaScript 변수와 달리 State는 컴포넌트 함수가 다시 실행되더라도 이전 값을 유지합니다. React가 컴포넌트의 렌더링과 연결된 상태를 별도로 관리하기 때문입니다.

다음은 State를 사용하는 간단한 예제입니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increase</button>
    </div>
  );
}

export default Counter;
```

`useState`를 사용하면 다음과 같은 동작이 발생합니다.

1. 컴포넌트가 처음 렌더링될 때 초기 State를 설정합니다.
2. 사용자가 버튼을 클릭하면 `setCount`를 호출합니다.
3. React에 새로운 State를 반영한 렌더링을 요청합니다.
4. React가 컴포넌트를 다시 호출하고 새로운 State를 전달합니다.
5. 변경된 State를 기반으로 새로운 JSX가 생성됩니다.

State는 단순히 값을 저장하는 기능이 아니라, **컴포넌트의 데이터와 UI를 동기화하는 React의 핵심 메커니즘**입니다.

## 2. 일반 변수와 State의 차이

컴포넌트 내부에서 선언한 일반 변수는 컴포넌트가 다시 렌더링될 때마다 초기화됩니다. 또한 일반 변수의 값을 변경하더라도 React는 이를 감지하지 못하므로 화면을 다시 렌더링하지 않습니다.

```tsx
function Counter() {
  let count = 0;

  function handleClick() {
    count += 1;
    console.log(count);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increase</button>
    </div>
  );
}
```

위 코드에서는 버튼을 클릭할 때 `count` 값이 변경되지만 화면은 갱신되지 않습니다. React가 일반 변수의 변경을 추적하지 않기 때문입니다.

반면 State는 React가 관리하는 값이며, State Setter를 호출하면 새로운 렌더링을 요청합니다.

| 구분 | 일반 변수 | State |
|---|---|---|
| 값의 저장 | 컴포넌트 함수 내부 | React가 관리 |
| 렌더링 사이의 값 유지 | 유지되지 않음 | 유지됨 |
| 값 변경 시 렌더링 | 발생하지 않음 | 렌더링 요청 |
| 변경 방식 | 직접 할당 | State Setter 사용 |
| 주요 용도 | 임시 계산 및 지역 데이터 | UI에 영향을 주는 데이터 |

일반 변수는 렌더링과 무관한 임시 데이터를 저장하는 데 적합합니다. 화면에 표시되거나 사용자 상호작용에 따라 변경되는 데이터는 State로 관리해야 합니다.

## 3. useState

`useState`는 함수 컴포넌트에 State를 추가하는 React Hook입니다.

```tsx
import { useState } from 'react';

function Component() {
  const [state, setState] = useState(initialState);

  return <div>{state}</div>;
}
```

`useState`는 두 개의 값을 배열 형태로 반환합니다.

- `state`: 현재 렌더링에서 사용하는 State 값입니다.
- `setState`: 다음 State 값을 설정하고 새로운 렌더링을 요청하는 함수입니다.

일반적으로 배열 구조 분해 할당을 사용하며, State 변수와 Setter 함수는 `[stateName, setStateName]` 형태로 이름을 지정합니다.

```tsx
const [name, setName] = useState('React');
const [count, setCount] = useState(0);
const [isVisible, setIsVisible] = useState(true);
```

### 3.1 초기 State

`useState`의 첫 번째 인수는 State의 초기값입니다.

```tsx
const [count, setCount] = useState(0);
const [name, setName] = useState('React');
const [items, setItems] = useState<string[]>([]);
```

초기 State는 컴포넌트의 첫 렌더링에서 사용됩니다. 이후 렌더링에서는 `useState`에 전달한 초기값이 다시 적용되지 않습니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

버튼을 클릭하면 `count`가 변경되지만, 컴포넌트가 다시 렌더링될 때마다 `0`으로 초기화되지는 않습니다. React가 이전 렌더링에서 설정한 State를 유지하기 때문입니다.

### 3.2 지연 초기화

초기 State를 계산하는 작업에 비용이 많이 드는 경우에는 초기값 대신 초기화 함수를 전달할 수 있습니다.

```tsx
function createInitialItems() {
  return Array.from({ length: 1000 }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
  }));
}

function ItemList() {
  const [items, setItems] = useState(createInitialItems);

  return <div>{items.length} items</div>;
}
```

다음 두 방식에는 차이가 있습니다.

```tsx
// 렌더링할 때마다 함수 호출
const [items, setItems] = useState(createInitialItems());

// 초기 State를 계산하는 함수 전달
const [items, setItems] = useState(createInitialItems);
```

첫 번째 방식은 컴포넌트가 렌더링될 때마다 `createInitialItems()`를 실행합니다. 반환된 값은 최초 렌더링 이후 초기 State로 사용되지 않더라도 함수 호출 자체는 반복됩니다.

두 번째 방식은 함수 자체를 전달하므로 React가 초기 State를 설정할 때 해당 함수를 호출합니다.

초기화 함수는 순수 함수여야 합니다. 개발 환경의 Strict Mode에서는 순수하지 않은 초기화 로직을 발견하기 위해 초기화 함수가 두 번 호출될 수 있습니다. 이때 한 번의 결과는 무시됩니다.

## 4. State 업데이트

State를 변경하려면 `useState`가 반환하는 Setter 함수를 호출해야 합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(10)}>Set to 10</button>
    </div>
  );
}
```

Setter 함수에는 다음 State 값을 직접 전달할 수 있습니다.

```tsx
setCount(10);
setName('React');
setIsVisible(false);
```

Setter를 호출하면 React는 해당 State의 다음 값을 예약하고 컴포넌트의 새로운 렌더링을 요청합니다.

Setter 함수는 State 값을 즉시 변경하는 함수가 아닙니다. 현재 실행 중인 렌더링에서 사용하는 State는 그대로 유지되며, 새로운 값은 다음 렌더링에서 반영됩니다.

### 4.1 이전 State를 기반으로 업데이트하기

새로운 State가 이전 State를 기반으로 계산되어야 한다면 Setter에 함수를 전달할 수 있습니다. 이를 Updater Function이라고 합니다.

```tsx
const [count, setCount] = useState(0);

function handleClick() {
  setCount(previousCount => previousCount + 1);
}
```

Updater Function은 React가 전달하는 대기 중인 이전 State를 인수로 받고, 다음 State를 반환합니다.

```tsx
setCount(previousCount => previousCount + 1);
setCount(previousCount => previousCount * 2);
```

여러 State 업데이트가 연속으로 요청되는 경우 Updater Function은 이전 업데이트의 결과를 이어받아 계산합니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(previousCount => previousCount + 1);
    setCount(previousCount => previousCount + 1);
    setCount(previousCount => previousCount + 1);
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={handleClick}>Increase by 3</button>
    </div>
  );
}
```

버튼을 한 번 클릭하면 `count`는 3 증가합니다.

반면 다음 코드는 동일한 결과를 만들지 않습니다.

```tsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

각 호출에서 참조하는 `count`는 현재 렌더링의 동일한 값입니다. 초기값이 `0`이라면 세 번의 호출 모두 `setCount(1)`을 요청하므로 최종값은 `1`입니다.

두 방식의 차이는 다음과 같습니다.

| 방식 | 동작 |
|---|---|
| `setCount(count + 1)` | 현재 렌더링의 `count`를 기준으로 다음 값을 계산합니다. |
| `setCount(prev => prev + 1)` | React가 전달하는 대기 중인 이전 State를 기준으로 다음 값을 계산합니다. |

이전 State를 기반으로 값을 계산하는 경우에는 Updater Function을 사용하는 것이 적절합니다.

Updater Function은 순수 함수여야 합니다. React는 개발 환경의 Strict Mode에서 순수하지 않은 로직을 감지하기 위해 Updater Function을 두 번 호출할 수 있으며, 이때 한 번의 결과는 무시됩니다.

### 4.2 State 업데이트 큐와 Batching

React는 여러 State 업데이트를 하나의 렌더링으로 묶어 처리할 수 있습니다. 이를 Batching이라고 합니다.

```tsx
function Form() {
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);

  function handleClick() {
    setName('React');
    setAge(10);
  }

  return (
    <button onClick={handleClick}>
      Update
    </button>
  );
}
```

두 개의 Setter가 호출되더라도 일반적으로 React는 이벤트 핸들러가 실행을 마친 뒤 업데이트를 처리하여 한 번의 렌더링으로 반영합니다.

Batching은 불필요한 렌더링을 줄이고 UI가 중간 상태를 노출하지 않도록 하는 데 도움이 됩니다.

React 18부터는 React가 관리하는 이벤트 핸들러뿐 아니라 Promise, 타이머 등에서 발생한 업데이트도 자동으로 Batching하는 Automatic Batching이 적용됩니다.

```tsx
function handleClick() {
  setTimeout(() => {
    setName('React');
    setAge(10);
  }, 1000);
}
```

위 코드에서도 두 State 업데이트는 자동으로 묶여 처리될 수 있습니다.

단, Batching이 적용된다고 해서 State Setter 호출 직후에 새로운 State 값을 읽을 수 있는 것은 아닙니다. 현재 렌더링의 State 값은 해당 렌더링이 끝날 때까지 유지됩니다.

## 5. State는 Snapshot입니다

React의 State는 일반 변수처럼 즉시 변경되는 값이 아니라, **각 렌더링 시점에 고정된 Snapshot**으로 동작합니다.

컴포넌트가 렌더링되면 React는 해당 렌더링에 사용할 State 값을 전달합니다. 컴포넌트 함수에서 생성되는 변수와 이벤트 핸들러는 해당 렌더링의 State 값을 참조합니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

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

초기값이 `0`일 때 버튼을 클릭하면 콘솔에는 `0`이 출력됩니다.

`setCount(count + 1)`을 호출하더라도 현재 실행 중인 `handleClick` 함수가 참조하는 `count` 값은 변경되지 않습니다. 새로운 State는 다음 렌더링에서 반영됩니다.

동작 과정은 다음과 같습니다.

1. 첫 번째 렌더링에서 `count`는 `0`입니다.
2. `handleClick`이 실행됩니다.
3. `setCount(1)`이 호출되어 다음 렌더링이 요청됩니다.
4. 현재 실행 중인 함수에서는 여전히 `count`가 `0`입니다.
5. 다음 렌더링에서 `count`는 `1`이 됩니다.

이러한 특성은 비동기 코드에서도 동일하게 적용됩니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);

    setTimeout(() => {
      console.log(count);
    }, 1000);
  }

  return (
    <button onClick={handleClick}>
      {count}
    </button>
  );
}
```

위 코드에서 타이머 콜백이 실행되는 시점에 컴포넌트가 다시 렌더링되었더라도, 콜백이 참조하는 `count`는 해당 함수가 생성된 렌더링의 값입니다.

이는 각 렌더링의 이벤트 핸들러가 해당 렌더링의 State Snapshot을 참조하기 때문입니다.

새로운 값을 별도로 사용해야 한다면 다음 State를 변수로 계산할 수 있습니다.

```tsx
function handleClick() {
  const nextCount = count + 1;

  setCount(nextCount);

  console.log(nextCount);
}
```

State Snapshot의 개념을 이해하면 Setter 호출 직후 이전 값이 출력되는 이유와 여러 업데이트가 처리되는 방식을 이해할 수 있습니다.

## 6. 객체와 배열의 State 업데이트

React State에는 숫자, 문자열, 불리언뿐 아니라 객체와 배열도 저장할 수 있습니다.

다만 객체와 배열은 JavaScript에서 참조를 통해 관리되는 가변 데이터이므로, State에 저장된 객체나 배열을 직접 수정하지 않아야 합니다.

React에서는 기존 State를 변경하는 대신 새로운 객체나 배열을 생성하여 Setter에 전달하는 방식을 사용합니다.

### 6.1 객체 State

다음과 같이 객체를 State로 사용할 수 있습니다.

```tsx
type User = {
  name: string;
  age: number;
};

function UserProfile() {
  const [user, setUser] = useState<User>({
    name: 'Kim',
    age: 20,
  });

  function handleNameChange() {
    setUser({
      ...user,
      name: 'Lee',
    });
  }

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.age}</p>
      <button onClick={handleNameChange}>
        Change Name
      </button>
    </div>
  );
}
```

객체의 일부 속성만 변경하더라도 새로운 객체를 생성하여 전달해야 합니다.

```tsx
// 잘못된 방식: 기존 객체를 직접 변경
user.name = 'Lee';
setUser(user);

// 올바른 방식: 새로운 객체 생성
setUser({
  ...user,
  name: 'Lee',
});
```

`setUser(user)`처럼 기존 객체를 수정한 뒤 동일한 객체 참조를 전달하면 React가 변경을 감지하지 못할 수 있습니다.

React는 이전 State와 새로운 State를 `Object.is`로 비교하여 동일한 값이라고 판단하면 렌더링을 생략할 수 있습니다.

### 6.2 중첩 객체 State

중첩된 객체를 업데이트할 때는 변경 대상이 포함된 모든 단계에서 새로운 객체를 생성해야 합니다.

```tsx
type User = {
  name: string;
  address: {
    city: string;
    country: string;
  };
};

function UserProfile() {
  const [user, setUser] = useState<User>({
    name: 'Kim',
    address: {
      city: 'Seoul',
      country: 'Korea',
    },
  });

  function handleCityChange() {
    setUser({
      ...user,
      address: {
        ...user.address,
        city: 'Busan',
      },
    });
  }

  return (
    <button onClick={handleCityChange}>
      Change City
    </button>
  );
}
```

객체의 Spread 문법은 얕은 복사(Shallow Copy)를 수행합니다. 따라서 최상위 객체만 복사하면 내부에 포함된 중첩 객체는 기존 참조를 그대로 유지합니다.

중첩된 객체를 수정하려면 해당 객체도 새로운 객체로 생성해야 합니다.

### 6.3 배열 State

배열을 State로 사용하는 경우에도 기존 배열을 직접 변경하지 않고 새로운 배열을 생성해야 합니다.

```tsx
function TodoList() {
  const [todos, setTodos] = useState<string[]>([
    'Learn React',
    'Learn TypeScript',
  ]);

  function addTodo() {
    setTodos(previousTodos => [
      ...previousTodos,
      'Build Project',
    ]);
  }

  function removeTodo(target: string) {
    setTodos(previousTodos =>
      previousTodos.filter(todo => todo !== target)
    );
  }

  return (
    <div>
      {todos.map(todo => (
        <p key={todo}>{todo}</p>
      ))}

      <button onClick={addTodo}>Add</button>
      <button onClick={() => removeTodo('Learn React')}>
        Remove
      </button>
    </div>
  );
}
```

배열을 업데이트할 때는 다음과 같은 비변경 메서드를 활용할 수 있습니다.

| 작업 | 사용 가능한 메서드 |
|---|---|
| 요소 추가 | Spread 문법, `concat()` |
| 요소 제거 | `filter()` |
| 요소 변경 | `map()` |
| 정렬된 새 배열 생성 | `toSorted()` |
| 배열 복사 | Spread 문법, `slice()` |

다음 메서드들은 기존 배열을 직접 변경하므로 State 업데이트에 그대로 사용하지 않아야 합니다.

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

기존 배열을 변경하는 메서드가 필요한 경우에는 먼저 배열을 복사한 뒤 복사본을 변경하거나, `toSorted()`처럼 새로운 배열을 반환하는 메서드를 사용할 수 있습니다.

객체와 배열의 불변성에 대한 자세한 내용은 다음 문서를 참고할 수 있습니다.

- [Updating Objects in State](https://react.dev/learn/updating-objects-in-state)
- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)

## 7. State 설계 원칙

State는 단순히 컴포넌트에서 사용하는 모든 데이터를 저장하는 공간이 아닙니다. UI를 표현하는 데 필요한 최소한의 데이터를 관리하고, 나머지 값은 가능한 한 계산하여 사용하는 것이 좋습니다.

### 7.1 최소한의 State 유지

다른 State나 Props로부터 계산할 수 있는 값은 별도의 State로 관리하지 않는 것이 좋습니다.

다음 예제는 상품 가격과 수량, 총액을 각각 State로 관리합니다.

```tsx
function Product() {
  const [price, setPrice] = useState(1000);
  const [quantity, setQuantity] = useState(2);
  const [total, setTotal] = useState(2000);

  return <div>{total}</div>;
}
```

`total`은 `price`와 `quantity`를 곱한 값이므로 별도의 State로 관리할 필요가 없습니다.

```tsx
function Product() {
  const [price, setPrice] = useState(1000);
  const [quantity, setQuantity] = useState(2);

  const total = price * quantity;

  return <div>{total}</div>;
}
```

별도의 State로 관리하면 가격이나 수량이 변경될 때 총액도 함께 갱신해야 합니다. 이 과정에서 데이터가 서로 일치하지 않는 문제가 발생할 수 있습니다.

계산 가능한 값은 렌더링 과정에서 계산하고, 계산 비용이 큰 경우에는 `useMemo`를 고려할 수 있습니다.

### 7.2 관련된 State 그룹화

서로 밀접하게 연관된 데이터는 하나의 객체로 그룹화할 수 있습니다.

```tsx
type FormState = {
  name: string;
  email: string;
  age: number;
};

function Form() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    age: 0,
  });

  function handleNameChange(name: string) {
    setForm(previousForm => ({
      ...previousForm,
      name,
    }));
  }

  return <div>{form.name}</div>;
}
```

관련된 데이터를 하나의 객체로 관리하면 데이터의 관계를 명확하게 표현할 수 있습니다.

다만 모든 State를 하나의 거대한 객체로 관리하는 것이 항상 좋은 것은 아닙니다. 서로 독립적으로 변경되는 값은 개별 State로 분리하는 편이 이해하고 관리하기 쉬울 수 있습니다.

### 7.3 불필요한 중복 State 방지

동일한 데이터를 여러 State에 중복해서 저장하면 데이터 간 동기화를 직접 관리해야 합니다.

```tsx
// 중복된 데이터를 관리하는 구조
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [selectedUserName, setSelectedUserName] = useState('');
```

`selectedUserName`은 `selectedUser`에서 계산할 수 있으므로 별도로 저장할 필요가 없습니다.

```tsx
const [selectedUser, setSelectedUser] = useState<User | null>(null);

const selectedUserName = selectedUser?.name ?? '';
```

중복 State를 줄이면 데이터 불일치 가능성을 낮추고 상태 변경 로직을 단순화할 수 있습니다.

### 7.4 State는 Props로 전달할 수 있습니다

부모 컴포넌트에서 관리하는 State는 자식 컴포넌트에 Props로 전달할 수 있습니다.

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <Child
      count={count}
      onIncrease={() => setCount(previous => previous + 1)}
    />
  );
}

type ChildProps = {
  count: number;
  onIncrease: () => void;
};

function Child({ count, onIncrease }: ChildProps) {
  return (
    <div>
      <p>{count}</p>
      <button onClick={onIncrease}>Increase</button>
    </div>
  );
}
```

이 구조에서는 부모 컴포넌트가 State를 소유하고 자식 컴포넌트는 Props를 통해 값을 전달받습니다.

자식 컴포넌트는 전달받은 값을 직접 변경하지 않고, 부모가 전달한 콜백을 호출하여 상태 변경을 요청합니다.

여러 컴포넌트가 동일한 State를 사용해야 한다면 해당 컴포넌트들의 공통 부모로 State를 이동하는 방식을 사용할 수 있습니다. 이를 State 끌어올리기(Lifting State Up)라고 합니다.

관련 내용은 [Props](./props.md) 문서와 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)를 참고할 수 있습니다.

## 8. State의 보존과 초기화

React는 State를 컴포넌트 함수 내부에 저장하지 않습니다. React는 렌더링 트리에서 컴포넌트가 위치한 곳을 기준으로 State를 관리합니다.

따라서 컴포넌트가 다시 렌더링되더라도 동일한 위치에 동일한 컴포넌트가 유지된다면 기존 State가 보존됩니다.

반대로 컴포넌트가 렌더링 트리에서 제거되면 해당 컴포넌트의 State도 함께 제거됩니다.

```tsx
function App() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setVisible(value => !value)}>
        Toggle
      </button>

      {visible && <Counter />}
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(value => value + 1)}>
      {count}
    </button>
  );
}
```

`Counter`를 숨기면 해당 컴포넌트는 렌더링 트리에서 제거되고 State도 초기화됩니다. 다시 표시하면 새로운 컴포넌트 인스턴스로 생성되므로 `count`는 `0`부터 시작합니다.

컴포넌트의 `key`를 변경하는 방식으로도 State를 초기화할 수 있습니다.

```tsx
function App() {
  const [userId, setUserId] = useState('user-1');

  return (
    <div>
      <button onClick={() => setUserId('user-1')}>
        User 1
      </button>

      <button onClick={() => setUserId('user-2')}>
        User 2
      </button>

      <Profile key={userId} userId={userId} />
    </div>
  );
}
```

`userId`가 변경되면 `Profile`의 `key`도 변경됩니다. React는 이를 새로운 컴포넌트로 인식하므로 기존 State를 제거하고 새로운 State를 초기화합니다.

State가 보존되거나 초기화되는 기준은 컴포넌트의 타입, 렌더링 트리에서의 위치, `key` 등에 따라 결정됩니다.

자세한 내용은 [Preserving and Resetting State](../rendering/state-preservation.md) 및 [Keys](./keys.md) 문서를 참고할 수 있습니다.

## 9. State와 TypeScript

TypeScript에서는 `useState`의 초기값을 기반으로 State 타입을 추론할 수 있습니다.

```tsx
const [count, setCount] = useState(0);
// number

const [name, setName] = useState('React');
// string

const [isVisible, setIsVisible] = useState(true);
// boolean
```

초기값만으로 타입을 정확하게 추론하기 어려운 경우에는 제네릭을 명시할 수 있습니다.

### 9.1 Union Type

초기값이 `null`이지만 이후 객체가 할당될 수 있는 경우에는 Union Type을 사용합니다.

```tsx
type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

이후 State를 사용할 때는 `null` 가능성을 고려해야 합니다.

```tsx
if (user !== null) {
  console.log(user.name);
}
```

### 9.2 배열 타입

배열의 요소 타입을 지정하려면 제네릭을 사용할 수 있습니다.

```tsx
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const [todos, setTodos] = useState<Todo[]>([]);
```

빈 배열로 초기화하는 경우에는 TypeScript가 요소 타입을 충분히 추론하지 못할 수 있으므로 명시적으로 타입을 지정하는 것이 좋습니다.

### 9.3 객체 타입

객체 State의 구조를 명확하게 표현하려면 `type` 또는 `interface`를 사용할 수 있습니다.

```tsx
interface FormState {
  email: string;
  password: string;
  isSubmitted: boolean;
}

const [form, setForm] = useState<FormState>({
  email: '',
  password: '',
  isSubmitted: false,
});
```

State Setter는 지정된 타입에 맞는 값을 전달해야 합니다. Updater Function을 사용하는 경우에도 이전 State와 반환값의 타입이 일치해야 합니다.

```tsx
setForm(previousForm => ({
  ...previousForm,
  isSubmitted: true,
}));
```

TypeScript와 React의 타입 구성에 대한 자세한 내용은 `react-typescript` 디렉터리의 관련 문서를 참고할 수 있습니다.

## 10. 주의사항

### 10.1 State를 직접 변경하지 않기

State를 직접 변경하면 React가 변경을 감지하지 못하거나 예상하지 못한 렌더링 결과가 발생할 수 있습니다.

```tsx
// 잘못된 방식
count = count + 1;

// 올바른 방식
setCount(count + 1);
```

객체와 배열도 마찬가지로 기존 값을 직접 수정하지 않고 새로운 값을 생성해야 합니다.

### 10.2 렌더링 중 무분별하게 Setter 호출하지 않기

컴포넌트가 렌더링되는 과정에서 조건 없이 State Setter를 호출하면 렌더링이 반복되어 무한 루프가 발생할 수 있습니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  // 잘못된 방식
  setCount(count + 1);

  return <div>{count}</div>;
}
```

일반적으로 State 업데이트는 이벤트 핸들러나 필요한 로직에서 수행해야 합니다.

렌더링 과정에서의 조건부 State 업데이트는 특정한 상황에서만 사용하는 예외적인 패턴이며, 대부분의 경우 파생 State를 계산하거나 이벤트 핸들러에서 업데이트하는 방식이 적절합니다.

### 10.3 State Setter의 반환값에 의존하지 않기

State Setter는 반환값을 제공하지 않습니다.

```tsx
const result = setCount(10);

console.log(result); // undefined
```

새로운 State 값을 사용해야 한다면 별도의 변수로 계산하거나 다음 렌더링에서 State를 참조해야 합니다.

### 10.4 모든 데이터를 State로 관리하지 않기

렌더링에 영향을 주지 않는 값까지 State로 관리할 필요는 없습니다.

예를 들어 렌더링 사이에 유지해야 하지만 UI 갱신을 발생시킬 필요가 없는 타이머 ID, DOM 요소 참조 등은 `useRef`가 더 적절할 수 있습니다.

반대로 화면에 표시되는 값이나 사용자 상호작용에 따라 변경되는 값은 State로 관리하는 것이 적절합니다.

## 11. 핵심 정리

- State는 React가 컴포넌트의 렌더링 사이에 유지하는 데이터입니다.
- 일반 변수와 달리 State Setter를 호출하면 새로운 렌더링이 요청됩니다.
- `useState`는 현재 State와 State Setter를 반환합니다.
- 초기 State는 최초 렌더링에서 설정되며, 이후 렌더링에서는 다시 초기화되지 않습니다.
- 이전 State를 기반으로 다음 값을 계산할 때는 Updater Function을 사용할 수 있습니다.
- 여러 State 업데이트는 Batching을 통해 하나의 렌더링으로 처리될 수 있습니다.
- State는 각 렌더링 시점의 Snapshot으로 동작하므로 Setter 호출 직후에도 현재 렌더링의 값은 변경되지 않습니다.
- 객체와 배열은 직접 변경하지 않고 새로운 참조를 생성하여 업데이트해야 합니다.
- 파생 가능한 데이터는 별도의 State로 중복 관리하지 않는 것이 좋습니다.
- State는 컴포넌트의 렌더링 트리상 위치와 타입, `key` 등에 따라 보존되거나 초기화됩니다.
- TypeScript에서는 제네릭과 Union Type을 사용하여 State의 타입을 명확하게 정의할 수 있습니다.

## 12. 참고 자료

### React 공식 문서

- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory) - State의 기본 개념
- [useState](https://react.dev/reference/react/useState) - `useState` API 및 State 업데이트
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot) - 렌더링별 State Snapshot
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates) - State 업데이트 큐와 Batching
- [Updating Objects in State](https://react.dev/learn/updating-objects-in-state) - 객체 State 업데이트와 불변성
- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) - 배열 State 업데이트와 불변성
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) - State 설계 원칙
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) - 컴포넌트 간 State 공유
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) - State 보존 및 초기화
- [Components and Hooks Must Be Pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure) - Props와 State의 불변성 및 순수성