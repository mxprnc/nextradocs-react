# Conditional Rendering

## 1. Conditional Rendering 개요

Conditional Rendering은 특정 조건에 따라 서로 다른 UI를 렌더링하는 기법입니다.

React에서는 별도의 템플릿 문법을 제공하지 않고 JavaScript의 조건문과 표현식을 JSX에 결합하여 조건부 렌더링을 구현합니다.

예를 들어 로그인 여부에 따라 서로 다른 메시지를 표시할 수 있습니다.

```tsx
type User = {
  name: string;
};

type Props = {
  user: User | null;
};

function Greeting({ user }: Props) {
  if (user === null) {
    return <p>Please sign in.</p>;
  }

  return <p>Welcome, {user.name}!</p>;
}
```

`user`가 `null`이면 로그인 안내 메시지를 표시하고, 사용자 정보가 존재하면 환영 메시지를 표시합니다.

조건부 렌더링은 다음과 같은 상황에서 활용할 수 있습니다.

- 로그인 여부에 따른 화면 분기
- 데이터 로딩 상태에 따른 로딩 UI 표시
- 데이터 존재 여부에 따른 목록 또는 빈 화면 표시
- 사용자 권한에 따른 UI 노출
- 특정 조건을 만족할 때만 버튼이나 컴포넌트 표시
- 오류 발생 여부에 따른 오류 메시지 표시

React의 조건부 렌더링은 JavaScript의 제어 흐름을 기반으로 동작하므로, 기본적인 JavaScript 조건문과 표현식에 대한 이해가 필요합니다.

## 2. if 조건문

`if` 문은 조건에 따라 서로 다른 JSX를 반환해야 할 때 사용합니다.

```tsx
type Props = {
  isLoggedIn: boolean;
};

function LoginStatus({ isLoggedIn }: Props) {
  if (isLoggedIn) {
    return <p>Welcome back!</p>;
  }

  return <p>Please sign in.</p>;
}
```

`if` 문은 JSX 내부에서 직접 사용할 수 없습니다. JSX의 중괄호 `{}` 안에는 JavaScript 표현식이 들어가야 하며, `if` 문은 표현식이 아닌 문장(Statement)이기 때문입니다.

따라서 조건에 따라 컴포넌트 전체를 분기하거나 특정 JSX를 변수에 할당하는 방식으로 사용할 수 있습니다.

### 2.1 Early Return

조건에 따라 컴포넌트의 실행을 일찍 종료하는 방식을 Early Return이라고 합니다.

```tsx
type Props = {
  isLoading: boolean;
  error: Error | null;
  data: string[];
};

function UserList({ isLoading, error, data }: Props) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error !== null) {
    return <p>Failed to load data.</p>;
  }

  if (data.length === 0) {
    return <p>No data available.</p>;
  }

  return (
    <ul>
      {data.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

Early Return을 사용하면 예외적인 상태를 먼저 처리하고, 정상적인 렌더링 로직을 마지막에 배치할 수 있습니다.

특히 로딩, 오류, 빈 데이터 등 여러 상태를 구분해야 하는 컴포넌트에서 가독성을 높이는 데 유용합니다.

## 3. Ternary Operator

삼항 연산자(Ternary Operator)는 조건에 따라 두 개의 표현식 중 하나를 선택할 때 사용합니다.

기본 문법은 다음과 같습니다.

```tsx
condition ? expressionA : expressionB
```

JSX에서는 다음과 같이 활용할 수 있습니다.

```tsx
type Props = {
  isLoggedIn: boolean;
};

function LoginStatus({ isLoggedIn }: Props) {
  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please sign in.</p>
      )}
    </div>
  );
}
```

`isLoggedIn`이 참이면 첫 번째 JSX가 렌더링되고, 거짓이면 두 번째 JSX가 렌더링됩니다.

### 3.1 여러 조건 처리

삼항 연산자를 중첩하면 여러 조건을 처리할 수 있습니다.

```tsx
type Status = 'loading' | 'success' | 'error';

type Props = {
  status: Status;
};

function StatusMessage({ status }: Props) {
  return (
    <div>
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'success' ? (
        <p>Completed successfully.</p>
      ) : (
        <p>An error occurred.</p>
      )}
    </div>
  );
}
```

다만 삼항 연산자를 여러 단계로 중첩하면 조건의 우선순위와 UI 구조를 파악하기 어려워질 수 있습니다.

조건이 많거나 각 조건에 따른 렌더링 로직이 복잡하다면 `if` 문이나 `switch` 문을 사용하는 것이 적절합니다.

## 4. Logical AND Operator

논리 AND 연산자(`&&`)는 조건이 참일 때만 특정 JSX를 렌더링하는 데 사용할 수 있습니다.

```tsx
type Props = {
  hasNotification: boolean;
};

function Notification({ hasNotification }: Props) {
  return (
    <div>
      {hasNotification && <p>You have a new notification.</p>}
    </div>
  );
}
```

`hasNotification`이 참이면 메시지를 표시하고, 거짓이면 아무것도 렌더링하지 않습니다.

JavaScript의 `&&` 연산자는 첫 번째 피연산자가 Falsy이면 해당 값을 반환하고, Truthy이면 두 번째 피연산자를 반환합니다.

따라서 조건부 렌더링에서 `&&`를 사용할 때는 조건의 자료형에 주의해야 합니다.

### 4.1 숫자 조건의 주의사항

JavaScript에서 숫자 `0`은 Falsy 값입니다. 그러나 `&&` 연산자는 조건이 거짓일 때 `false`가 아니라 실제 피연산자 값인 `0`을 반환합니다.

```tsx
function Cart({ itemCount }: { itemCount: number }) {
  return (
    <div>
      {itemCount && <p>{itemCount} items in cart.</p>}
    </div>
  );
}
```

`itemCount`가 `0`이면 React는 `0`을 화면에 표시합니다.

이는 다음과 같은 이유로 발생합니다.

```tsx
console.log(0 && 'Items');
// 0

console.log(1 && 'Items');
// Items
```

숫자 조건을 사용할 때는 명시적으로 비교식을 작성하는 것이 안전합니다.

```tsx
function Cart({ itemCount }: { itemCount: number }) {
  return (
    <div>
      {itemCount > 0 && (
        <p>{itemCount} items in cart.</p>
      )}
    </div>
  );
}
```

또는 삼항 연산자를 사용할 수 있습니다.

```tsx
{itemCount > 0 ? <p>{itemCount} items</p> : null}
```

### 4.2 Boolean 표현식 사용

조건부 렌더링에는 다음과 같은 Boolean 표현식을 사용하는 것이 일반적입니다.

```tsx
{isVisible && <Modal />}
{user !== null && <UserProfile user={user} />}
{items.length > 0 && <ItemList items={items} />}
```

숫자나 문자열을 조건으로 직접 사용하는 경우 의도하지 않은 값이 렌더링되지 않는지 확인해야 합니다.

## 5. Logical OR Operator와 Nullish Coalescing

논리 OR 연산자(`||`)와 Nullish Coalescing 연산자(`??`)는 조건에 따라 기본 UI를 제공하거나 대체 값을 선택할 때 사용할 수 있습니다.

### 5.1 Logical OR Operator

`||`는 왼쪽 피연산자가 Falsy이면 오른쪽 피연산자를 반환합니다.

```tsx
type Props = {
  name: string;
};

function Greeting({ name }: Props) {
  return <p>{name || 'Guest'}</p>;
}
```

`name`이 빈 문자열이면 `Guest`를 표시합니다.

다만 `||`는 빈 문자열뿐 아니라 `0`, `false`, `NaN`, `null`, `undefined` 등 모든 Falsy 값을 대체합니다.

### 5.2 Nullish Coalescing Operator

`??`는 왼쪽 피연산자가 `null` 또는 `undefined`인 경우에만 오른쪽 피연산자를 반환합니다.

```tsx
type Props = {
  count: number | null;
};

function Count({ count }: Props) {
  return <p>{count ?? 0}</p>;
}
```

`count`가 `0`이면 `0`을 유지하고, `null`이면 기본값인 `0`을 사용합니다.

두 연산자의 차이는 다음과 같습니다.

| 표현식 | 왼쪽 값이 `0` | 왼쪽 값이 `''` | 왼쪽 값이 `null` |
|---|---|---|---|
| `value || fallback` | fallback | fallback | fallback |
| `value ?? fallback` | 0 | 빈 문자열 | fallback |

두 연산자는 UI를 렌더링할지 여부를 직접 결정하는 용도보다는 조건에 따라 표시할 값을 선택하는 데 적합합니다.

## 6. 변수에 JSX 할당하기

조건에 따라 JSX를 변수에 할당한 뒤 반환할 수도 있습니다.

```tsx
type Props = {
  isLoggedIn: boolean;
};

function LoginStatus({ isLoggedIn }: Props) {
  let content;

  if (isLoggedIn) {
    content = <p>Welcome back!</p>;
  } else {
    content = <p>Please sign in.</p>;
  }

  return <div>{content}</div>;
}
```

이 방식은 조건에 따른 JSX가 여러 줄이거나 별도의 분기 로직이 필요한 경우 유용합니다.

삼항 연산자나 `&&`를 사용하기 어려운 복잡한 조건도 일반 JavaScript 제어문으로 처리할 수 있습니다.

### 6.1 Switch 문 활용

여러 상태에 따라 서로 다른 UI를 반환해야 하는 경우 `switch` 문을 사용할 수 있습니다.

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';

function StatusMessage({ status }: { status: Status }) {
  let content;

  switch (status) {
    case 'loading':
      content = <p>Loading...</p>;
      break;

    case 'success':
      content = <p>Completed successfully.</p>;
      break;

    case 'error':
      content = <p>Something went wrong.</p>;
      break;

    case 'idle':
    default:
      content = <p>Waiting...</p>;
      break;
  }

  return <div>{content}</div>;
}
```

`switch` 문은 여러 개의 상호 배타적인 상태를 처리할 때 유용합니다.

TypeScript의 Union Type과 함께 사용하면 가능한 상태를 제한하고 각 상태에 대한 분기를 명확하게 표현할 수 있습니다.

## 7. null을 반환하는 컴포넌트

React 컴포넌트는 `null`을 반환하여 아무것도 렌더링하지 않도록 할 수 있습니다.

```tsx
type Props = {
  isVisible: boolean;
};

function Warning({ isVisible }: Props) {
  if (!isVisible) {
    return null;
  }

  return <p>Warning: Check your settings.</p>;
}
```

`isVisible`이 거짓이면 해당 컴포넌트는 UI를 출력하지 않습니다.

부모 컴포넌트에서 조건부로 렌더링하는 방식과 컴포넌트 내부에서 `null`을 반환하는 방식은 모두 화면에 UI를 표시하지 않는 결과를 만들 수 있습니다.

```tsx
// 부모 컴포넌트에서 조건 처리
{isVisible && <Warning />}

// 자식 컴포넌트에서 조건 처리
<Warning isVisible={isVisible} />
```

첫 번째 방식은 부모가 컴포넌트의 표시 여부를 결정합니다. 두 번째 방식은 컴포넌트가 자신의 표시 여부를 결정합니다.

어떤 방식이 적절한지는 조건의 소유 위치와 컴포넌트의 책임에 따라 결정할 수 있습니다.

## 8. 조건부 렌더링과 컴포넌트 분리

조건부 렌더링 로직이 복잡해지면 각 UI를 별도의 컴포넌트로 분리할 수 있습니다.

```tsx
type Status = 'loading' | 'success' | 'error';

function LoadingView() {
  return <p>Loading...</p>;
}

function SuccessView() {
  return <p>Completed successfully.</p>;
}

function ErrorView() {
  return <p>Failed to load data.</p>;
}

function StatusView({ status }: { status: Status }) {
  switch (status) {
    case 'loading':
      return <LoadingView />;

    case 'success':
      return <SuccessView />;

    case 'error':
      return <ErrorView />;

    default:
      return null;
  }
}
```

컴포넌트를 분리하면 다음과 같은 장점이 있습니다.

- 각 UI의 역할과 책임을 명확하게 구분할 수 있습니다.
- 조건 분기와 UI 구현을 분리할 수 있습니다.
- 개별 UI를 독립적으로 재사용할 수 있습니다.
- 컴포넌트별 테스트를 작성하기 쉬워집니다.

단순한 조건을 처리하기 위해 지나치게 많은 컴포넌트를 생성할 필요는 없습니다. 조건의 복잡도와 재사용 가능성을 고려하여 분리하는 것이 좋습니다.

## 9. 조건부 렌더링과 State

조건부 렌더링은 State와 결합하여 사용자 상호작용에 따라 UI를 변경하는 데 자주 사용됩니다.

```tsx
import { useState } from 'react';

function TogglePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(value => !value)}>
        {isOpen ? 'Close' : 'Open'}
      </button>

      {isOpen && (
        <section>
          <p>Panel Content</p>
        </section>
      )}
    </div>
  );
}
```

버튼을 클릭하면 `isOpen` State가 변경되고, 변경된 값에 따라 패널의 렌더링 여부가 결정됩니다.

이때 조건부 렌더링은 UI의 표시 여부를 결정하고, State는 해당 조건을 표현하는 데이터를 관리합니다.

### 9.1 컴포넌트 제거와 State 초기화

조건부 렌더링으로 컴포넌트를 제거하면 해당 컴포넌트의 State도 제거될 수 있습니다.

```tsx
function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(value => !value)}>
        Toggle
      </button>

      {isVisible && <Counter />}
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(value => value + 1)}>
      Count: {count}
    </button>
  );
}
```

`Counter`가 렌더링 트리에서 제거되면 해당 컴포넌트의 State도 제거됩니다. 다시 렌더링되면 새로운 컴포넌트로 생성되므로 `count`는 초기값부터 시작합니다.

State를 유지해야 한다면 컴포넌트를 제거하지 않고 CSS 등을 이용해 화면에서 숨기는 방법을 고려할 수 있습니다.

```tsx
function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(value => !value)}>
        Toggle
      </button>

      <div hidden={!isVisible}>
        <Counter />
      </div>
    </div>
  );
}
```

이 방식에서는 `Counter`가 렌더링 트리에 계속 존재하므로 내부 State가 유지됩니다.

다만 CSS로 숨기는 방식은 컴포넌트가 계속 렌더링 트리에 존재한다는 점에서 조건부 렌더링과 차이가 있습니다. 실제 UI 요구사항에 따라 컴포넌트를 제거할지, 숨길지 결정해야 합니다.

State 보존과 초기화에 대한 자세한 내용은 [State](./state.md) 및 [Preserving and Resetting State](../rendering/state-preservation.md) 문서를 참고할 수 있습니다.

## 10. TypeScript와 조건부 렌더링

TypeScript에서는 Union Type과 타입 가드를 활용하여 조건부 렌더링의 안정성을 높일 수 있습니다.

### 10.1 Union Type을 활용한 상태 분기

```tsx
type ApiState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

type User = {
  id: number;
  name: string;
};

function UserView({ state }: { state: ApiState<User> }) {
  switch (state.status) {
    case 'idle':
      return <p>Waiting...</p>;

    case 'loading':
      return <p>Loading...</p>;

    case 'success':
      return <p>{state.data.name}</p>;

    case 'error':
      return <p>{state.message}</p>;

    default:
      return null;
  }
}
```

`status`를 기준으로 분기하면 TypeScript는 각 분기에서 사용할 수 있는 속성을 좁혀서 추론합니다.

예를 들어 `success` 상태에서는 `data`에 접근할 수 있고, `error` 상태에서는 `message`에 접근할 수 있습니다.

이러한 방식은 API 요청 상태처럼 서로 다른 데이터 구조를 갖는 상태를 표현할 때 유용합니다.

### 10.2 Optional Chaining

Optional Chaining(`?.`)을 사용하면 값이 `null` 또는 `undefined`인 경우 속성 접근을 안전하게 처리할 수 있습니다.

```tsx
type User = {
  name: string;
};

function Greeting({ user }: { user?: User }) {
  return (
    <p>
      {user?.name ?? 'Guest'}
    </p>
  );
}
```

`user`가 존재하지 않으면 `Guest`를 표시하고, 존재하면 사용자 이름을 표시합니다.

Optional Chaining은 조건에 따라 값을 안전하게 접근하는 기능이며, 컴포넌트 자체의 렌더링 여부를 결정하는 조건문과는 구분해야 합니다.

## 11. 조건부 렌더링 방식 비교

React에서 자주 사용하는 조건부 렌더링 방식은 다음과 같습니다.

| 방식 | 주요 용도 | 특징 |
|---|---|---|
| `if` 문 | 컴포넌트 전체 분기 | 복잡한 조건 처리에 적합 |
| Early Return | 예외 상황 및 초기 상태 처리 | 정상 렌더링 로직을 단순화 |
| 삼항 연산자 | 두 가지 UI 중 하나 선택 | JSX 내부에서 간결하게 사용 |
| `&&` 연산자 | 조건이 참일 때만 UI 표시 | 단일 조건의 표시 여부 처리 |
| `||` 연산자 | Falsy 값에 대한 대체값 제공 | 모든 Falsy 값에 반응 |
| `??` 연산자 | null 또는 undefined에 대한 대체값 제공 | 0이나 빈 문자열을 유지 |
| 변수에 JSX 할당 | 여러 조건에 따른 UI 구성 | 복잡한 분기 로직과 UI 분리 |
| `null` 반환 | UI를 표시하지 않음 | 컴포넌트 내부에서 렌더링 생략 |

일반적인 사용 기준은 다음과 같습니다.

- 컴포넌트 전체를 분기해야 한다면 `if` 문이나 Early Return을 사용합니다.
- 두 가지 UI 중 하나를 선택해야 한다면 삼항 연산자를 사용합니다.
- 특정 조건에서만 UI를 표시한다면 `&&` 연산자를 사용합니다.
- 기본값을 지정해야 한다면 `||` 또는 `??`의 차이를 고려합니다.
- 여러 상태를 처리해야 한다면 `switch` 문이나 별도 컴포넌트 분리를 고려합니다.

## 12. 주의사항

### 12.1 JSX 내부에서 if 문을 직접 사용하지 않기

JSX의 중괄호에는 표현식을 작성해야 하므로 `if` 문을 직접 작성할 수 없습니다.

```tsx
// 잘못된 방식
return (
  <div>
    {if (isVisible) {
      <p>Visible</p>
    }}
  </div>
);
```

삼항 연산자나 `&&`를 사용하거나, JSX 바깥에서 `if` 문을 처리해야 합니다.

### 12.2 숫자 조건에서 0 렌더링 주의

다음 코드는 `itemCount`가 `0`일 때 숫자 `0`을 화면에 표시할 수 있습니다.

```tsx
{itemCount && <ItemList />}
```

명시적인 비교식을 사용하는 것이 안전합니다.

```tsx
{itemCount > 0 && <ItemList />}
```

### 12.3 중첩된 삼항 연산자 지양

삼항 연산자를 여러 단계로 중첩하면 코드의 가독성이 떨어질 수 있습니다.

조건이 많다면 `if` 문이나 `switch` 문으로 분리하는 것이 좋습니다.

### 12.4 조건부 렌더링과 컴포넌트 생명주기 구분

조건부 렌더링으로 컴포넌트가 제거되면 해당 컴포넌트의 State도 제거될 수 있습니다.

단순히 화면에서 숨기는 것과 렌더링 트리에서 제거하는 것은 서로 다른 동작입니다. State 유지 여부와 접근성 요구사항 등을 고려하여 구현 방식을 선택해야 합니다.

### 12.5 Hook 호출 규칙 준수

Hook은 조건문이나 반복문 내부에서 호출하지 않아야 합니다.

```tsx
function Component({ isVisible }: { isVisible: boolean }) {
  // 잘못된 방식
  if (isVisible) {
    const [count, setCount] = useState(0);
  }

  return <div />;
}
```

조건에 따라 UI를 분기하더라도 Hook은 컴포넌트의 최상위에서 호출해야 합니다.

```tsx
function Component({ isVisible }: { isVisible: boolean }) {
  const [count, setCount] = useState(0);

  if (!isVisible) {
    return null;
  }

  return <div>{count}</div>;
}
```

Hook 호출 규칙에 대한 자세한 내용은 `hooks` 디렉터리의 관련 문서를 참고할 수 있습니다.

## 13. 핵심 정리

- Conditional Rendering은 조건에 따라 서로 다른 UI를 렌더링하는 기법입니다.
- React는 JavaScript의 조건문과 표현식을 사용하여 조건부 렌더링을 구현합니다.
- `if` 문과 Early Return은 컴포넌트 전체의 분기 및 예외 상태 처리에 적합합니다.
- 삼항 연산자는 두 가지 UI 중 하나를 선택할 때 사용합니다.
- `&&` 연산자는 조건이 참일 때만 UI를 표시하는 데 사용하며, 숫자 `0`이 렌더링되는 상황에 주의해야 합니다.
- `||`는 모든 Falsy 값을 대체하고, `??`는 `null`과 `undefined`만 대체합니다.
- 컴포넌트는 `null`을 반환하여 아무것도 렌더링하지 않을 수 있습니다.
- 조건부 렌더링으로 컴포넌트가 제거되면 해당 컴포넌트의 State도 초기화될 수 있습니다.
- TypeScript의 Union Type과 타입 가드를 활용하면 복잡한 상태 분기를 안전하게 표현할 수 있습니다.
- 조건이 복잡해지면 별도의 컴포넌트로 분리하여 가독성과 재사용성을 높일 수 있습니다.

## 14. 참고 자료

### React 공식 문서

- [Conditional Rendering](https://react.dev/learn/conditional-rendering) - React의 조건부 렌더링 기본 개념과 사용 방법
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces) - JSX에서 JavaScript 표현식 사용
- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory) - State의 기본 개념
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) - 컴포넌트의 State 보존과 초기화
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) - Hook 호출 규칙

### JavaScript 및 TypeScript 공식 문서

- [MDN - Conditional (ternary) operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_ternary) - 삼항 연산자
- [MDN - Logical AND (&&)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) - 논리 AND 연산자
- [MDN - Logical OR (||)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR) - 논리 OR 연산자
- [MDN - Nullish coalescing operator (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) - Nullish Coalescing 연산자
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) - Type Guard와 타입 좁히기