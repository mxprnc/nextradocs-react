# Reconciliation

Reconciliation(재조정)은 React가 새로운 렌더링 결과와 이전 렌더링 결과를 비교하여 UI 변경 사항을 결정하는 과정입니다.

React는 컴포넌트의 Props 또는 State가 변경되면 새로운 React Element Tree를 생성합니다. 이후 이전 렌더링 결과와 비교하여 기존 컴포넌트와 DOM 노드를 유지할지, 업데이트할지, 제거하고 새로 생성할지를 결정합니다.

이러한 과정을 통해 React는 개발자가 UI의 최종 상태를 선언적으로 표현할 수 있도록 지원하며, 실제 DOM에 필요한 변경 사항만 적용합니다.

Reconciliation은 React의 렌더링 과정 중 Render 단계에서 수행되는 핵심 작업이며, Commit 단계에서 실제 DOM 변경 사항이 반영됩니다.

## 1. Reconciliation Overview

React는 컴포넌트가 반환하는 React Element를 기반으로 UI 구조를 관리합니다.

State 또는 Props가 변경되면 새로운 Element Tree가 생성되며, React는 이전 트리와 새로운 트리를 비교하여 변경 사항을 계산합니다.

전체적인 흐름은 다음과 같습니다.

```text
State / Props Update
        |
        v
Component Rendering
        |
        v
New React Element Tree
        |
        v
Reconciliation
        |
        +--> Compare Previous Tree
        |
        +--> Compare Element Types
        |
        +--> Compare Keys
        |
        +--> Determine Required Updates
        |
        v
Commit Phase
        |
        v
Apply Changes to DOM
```

Reconciliation의 주요 목적은 다음과 같습니다.

- 이전 UI와 새로운 UI의 차이를 파악합니다.
- 기존 컴포넌트와 DOM 노드를 재사용할 수 있는지 판단합니다.
- 변경된 Props와 콘텐츠를 반영합니다.
- 더 이상 필요하지 않은 컴포넌트와 DOM 노드를 제거합니다.
- 컴포넌트의 State와 생명주기를 적절하게 유지합니다.

여기서 중요한 점은 Reconciliation이 단순히 DOM을 비교하는 과정이 아니라는 것입니다.

React는 Element의 Type, Key, 부모 및 형제 관계 등의 정보를 바탕으로 기존 UI 트리와 새로운 UI 트리의 대응 관계를 결정합니다.

## 2. React Element Tree

Reconciliation을 이해하려면 React Element와 Component Tree의 관계를 먼저 이해해야 합니다.

React Element는 화면에 표시할 UI의 구조와 속성을 표현하는 객체입니다.

다음 컴포넌트를 살펴보겠습니다.

```tsx
function App() {
  return (
    <main>
      <h1>Hello, React!</h1>
      <p>Welcome to React.</p>
    </main>
  );
}
```

컴포넌트가 반환하는 JSX는 개념적으로 다음과 같은 Element Tree를 구성합니다.

```text
App
 |
 v
main
 |
 +----> h1
 |       |
 |       +----> "Hello, React!"
 |
 +----> p
         |
         +----> "Welcome to React."
```

React는 이러한 Element Tree를 기반으로 화면을 구성합니다.

State가 변경되어 새로운 JSX가 반환되면 React는 이전 결과와 새로운 결과를 비교합니다.

예를 들어 다음과 같이 제목이 변경되는 경우를 살펴보겠습니다.

```tsx
function App({ title }: { title: string }) {
  return (
    <main>
      <h1>{title}</h1>
      <p>Welcome to React.</p>
    </main>
  );
}
```

이전 렌더링 결과가 다음과 같다고 가정합니다.

```tsx
<App title="Hello, React!" />
```

이후 다음과 같이 변경됩니다.

```tsx
<App title="Hello, TypeScript!" />
```

React는 두 Element Tree를 비교하여 다음과 같은 변경 사항을 파악합니다.

- `main` Element의 Type은 동일합니다.
- `h1` Element의 Type은 동일하지만 Text Content가 변경되었습니다.
- `p` Element는 변경되지 않았습니다.

따라서 기존 DOM 구조를 유지하면서 `h1`의 Text Content만 업데이트할 수 있습니다.

이처럼 React는 전체 DOM을 무조건 제거하고 다시 생성하는 대신 필요한 변경 사항을 계산합니다.

## 3. Reconciliation Rules

React는 이전 Element Tree와 새로운 Element Tree를 비교할 때 Element의 Type과 Key를 중요한 기준으로 사용합니다.

### 3.1 Different Element Types

같은 위치에 서로 다른 Type의 Element가 존재하면 React는 기존 Element를 제거하고 새로운 Element를 생성합니다.

예를 들어 다음과 같은 변경이 발생했다고 가정합니다.

```tsx
function App({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      {isAdmin ? (
        <AdminPanel />
      ) : (
        <UserPanel />
      )}
    </div>
  );
}
```

`isAdmin`이 `true`에서 `false`로 변경되면 다음과 같은 변화가 발생합니다.

```text
Before

div
 |
 +----> AdminPanel
          |
          +----> Admin Content


After

div
 |
 +----> UserPanel
          |
          +----> User Content
```

`AdminPanel`과 `UserPanel`은 서로 다른 Component Type이므로 기존 컴포넌트를 재사용하지 않습니다.

React는 기존 `AdminPanel`을 제거하고 새로운 `UserPanel`을 생성합니다.

이때 기존 컴포넌트에 연결된 State도 제거되며 새로운 컴포넌트의 State가 초기화됩니다.

같은 규칙은 Host Element에도 적용됩니다.

```tsx
function App({ isHeading }: { isHeading: boolean }) {
  return (
    <div>
      {isHeading ? (
        <h1>Hello</h1>
      ) : (
        <p>Hello</p>
      )}
    </div>
  );
}
```

`h1`이 `p`로 변경되면 React는 기존 `h1` DOM 노드를 제거하고 새로운 `p` DOM 노드를 생성합니다.

반면 동일한 Type의 Element라면 기존 노드를 유지하면서 변경된 속성만 업데이트할 수 있습니다.

### 3.2 Same Element Types

같은 위치에 동일한 Type의 Element가 존재하면 React는 기존 Element를 재사용하면서 변경된 속성을 반영합니다.

```tsx
function App({ className }: { className: string }) {
  return (
    <div className={className}>
      <h1>Hello, React!</h1>
    </div>
  );
}
```

다음과 같이 Props가 변경되었다고 가정합니다.

```tsx
<App className="before" />
```

```tsx
<App className="after" />
```

두 렌더링 결과의 `div` Element Type은 동일합니다.

따라서 React는 기존 DOM 노드를 유지하고 `className`만 업데이트합니다.

개념적으로 다음과 같이 처리됩니다.

```text
Before

div(class="before")
 |
 +----> h1


After

div(class="after")
 |
 +----> h1
```

이 과정에서 기존 `div`와 `h1` DOM 노드는 재사용됩니다.

동일한 Type의 Element라도 Props나 하위 Element가 변경되면 필요한 부분은 업데이트됩니다.

### 3.3 Component Types

동일한 위치에 동일한 Component Type이 유지되면 React는 기존 컴포넌트의 State를 보존하면서 새로운 Props를 반영합니다.

```tsx
import { useState } from 'react';

interface CounterProps {
  title: string;
}

function Counter({ title }: CounterProps) {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h2>{title}</h2>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </section>
  );
}
```

부모 컴포넌트에서 다음과 같이 사용한다고 가정합니다.

```tsx
function App({ title }: { title: string }) {
  return <Counter title={title} />;
}
```

`title`이 변경되어 `App`이 다시 렌더링되더라도 `Counter`의 Component Type과 위치가 유지되므로 기존 State가 보존됩니다.

```text
Before

App
 |
 v
Counter(title="First")
 |
 +----> State: count = 3


After

App
 |
 v
Counter(title="Second")
 |
 +----> State: count = 3
```

Props가 변경되었다고 해서 컴포넌트가 새로운 인스턴스로 교체되는 것은 아닙니다.

동일한 Type과 위치가 유지되면 기존 컴포넌트의 State를 유지하면서 새로운 Props를 전달합니다.

## 4. Key and Reconciliation

Key는 React가 형제 Element들을 식별하고 이전 렌더링 결과와 새로운 렌더링 결과 사이의 대응 관계를 결정하는 데 사용하는 특별한 속성입니다.

특히 동적으로 생성되는 리스트에서 Element의 순서가 변경되거나 추가 및 삭제되는 경우 중요한 역할을 합니다.

### 4.1 Why Keys Are Needed

다음과 같은 리스트가 있다고 가정합니다.

```tsx
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
```

리스트를 렌더링하는 컴포넌트는 다음과 같습니다.

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

초기 Element Tree는 다음과 같습니다.

```text
ul
 |
 +----> li (key=1, Alice)
 |
 +----> li (key=2, Bob)
```

이후 새로운 항목이 리스트의 앞부분에 추가된다고 가정합니다.

```tsx
const users: User[] = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];
```

새로운 Element Tree는 다음과 같습니다.

```text
ul
 |
 +----> li (key=3, Charlie)
 |
 +----> li (key=1, Alice)
 |
 +----> li (key=2, Bob)
```

React는 Key를 통해 기존 Alice와 Bob Element를 식별하고, Charlie Element가 새롭게 추가되었다는 사실을 파악할 수 있습니다.

따라서 기존 항목을 불필요하게 제거하고 다시 생성하는 것을 방지할 수 있습니다.

### 4.2 Key Must Be Stable and Unique Among Siblings

Key는 형제 Element 사이에서 고유해야 하며, 렌더링 사이에서도 안정적으로 유지되어야 합니다.

일반적으로 데이터의 고유 ID를 Key로 사용하는 것이 좋습니다.

```tsx
{users.map((user) => (
  <UserItem key={user.id} user={user} />
))}
```

다음과 같은 방식은 권장하지 않습니다.

```tsx
{users.map((user) => (
  <UserItem
    key={Math.random()}
    user={user}
  />
))}
```

`Math.random()`은 렌더링마다 새로운 값을 생성합니다.

따라서 React는 이전 Element와 새로운 Element가 서로 다른 Element라고 판단하여 기존 컴포넌트를 제거하고 새로 생성할 수 있습니다.

이 과정에서 다음과 같은 문제가 발생할 수 있습니다.

- 불필요한 컴포넌트 재생성
- State 초기화
- DOM 노드 재생성
- Effect Cleanup 및 재실행
- 불필요한 성능 비용

Key는 데이터의 고유 식별자를 기반으로 안정적으로 유지해야 합니다.

### 4.3 Using Array Index as Key

배열의 Index를 Key로 사용하는 방식은 데이터의 순서가 변경되지 않는 정적인 리스트에서는 문제가 발생하지 않을 수 있습니다.

```tsx
{users.map((user, index) => (
  <UserItem key={index} user={user} />
))}
```

그러나 리스트의 항목이 추가, 삭제 또는 재정렬되는 경우 문제가 발생할 수 있습니다.

다음과 같은 리스트를 가정합니다.

```text
Before

Index 0 -> Alice
Index 1 -> Bob
Index 2 -> Charlie


After

Index 0 -> Charlie
Index 1 -> Alice
Index 2 -> Bob
```

Index를 Key로 사용하면 React는 기존 위치의 Element와 새로운 위치의 Element를 동일한 항목으로 판단할 수 있습니다.

이때 기존 컴포넌트의 State가 실제 데이터 항목이 아닌 위치를 기준으로 재사용되어 서로 다른 데이터에 잘못 연결될 수 있습니다.

특히 다음과 같은 경우 문제가 발생하기 쉽습니다.

- 각 리스트 항목이 독립적인 State를 가지는 경우
- Uncontrolled Input을 사용하는 경우
- 항목의 순서가 자주 변경되는 경우
- 리스트 중간에 항목이 추가되거나 삭제되는 경우

따라서 데이터에 고유 식별자가 있다면 Index보다 해당 식별자를 Key로 사용하는 것이 좋습니다.

## 5. State Preservation and Resetting

Reconciliation은 컴포넌트의 State를 유지할지 초기화할지 결정하는 과정과 밀접하게 연결됩니다.

React는 State를 JSX 태그 자체에 저장하는 것이 아니라 UI Tree에서 컴포넌트가 위치한 곳을 기준으로 관리합니다.

동일한 Component Type이 동일한 위치에 유지되면 State가 보존됩니다.

반면 컴포넌트가 제거되거나 다른 Component Type으로 교체되면 기존 State가 제거됩니다.

### 5.1 State Preservation

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{name}</h2>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

function App({ name }: { name: string }) {
  return <Counter name={name} />;
}
```

`name`이 변경되어도 `Counter`의 Type과 위치가 유지되므로 `count`는 초기화되지 않습니다.

```text
Initial Render

App
 |
 v
Counter(name="Alice")
 |
 +----> count = 0


State Update

App
 |
 v
Counter(name="Alice")
 |
 +----> count = 3


Props Update

App
 |
 v
Counter(name="Bob")
 |
 +----> count = 3
```

Props 변경과 State 변경은 서로 다른 개념입니다.

Props가 변경되었다는 이유만으로 컴포넌트의 State가 초기화되지는 않습니다.

### 5.2 State Resetting by Component Type

동일한 위치에 서로 다른 Component Type이 렌더링되면 기존 컴포넌트의 State는 제거됩니다.

```tsx
import { useState } from 'react';

function CounterA() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Counter A: {count}
    </button>
  );
}

function CounterB() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Counter B: {count}
    </button>
  );
}

function App({ isA }: { isA: boolean }) {
  return isA ? <CounterA /> : <CounterB />;
}
```

`isA`가 변경되어 `CounterA`가 `CounterB`로 교체되면 기존 State가 제거되고 새로운 State가 초기화됩니다.

두 컴포넌트가 동일한 JSX 구조를 반환하더라도 Component Type이 다르면 서로 다른 컴포넌트로 취급됩니다.

### 5.3 State Resetting by Key

Key는 리스트 렌더링뿐만 아니라 컴포넌트의 State를 의도적으로 초기화하는 데에도 사용할 수 있습니다.

```tsx
import { useState } from 'react';

function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{name}</h2>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

function App({ userId }: { userId: string }) {
  return <Counter key={userId} name={userId} />;
}
```

`userId`가 변경되면 Key도 변경됩니다.

React는 새로운 Key를 가진 컴포넌트를 기존 컴포넌트와 다른 컴포넌트로 취급합니다.

따라서 기존 `Counter`의 State를 제거하고 새로운 `Counter`의 State를 초기화합니다.

이러한 방식은 다음과 같은 상황에서 유용합니다.

- 사용자 계정이 변경될 때 입력 폼 초기화
- 다른 데이터 항목으로 전환할 때 상세 화면의 State 초기화
- 새로운 대화방으로 이동할 때 메시지 입력 상태 초기화

Key는 단순한 리스트 최적화 속성이 아니라 React가 컴포넌트의 정체성을 판단하는 데 사용하는 중요한 요소입니다.

## 6. Component Identity and Position

React에서 컴포넌트의 정체성은 UI Tree에서의 위치, Element Type, 그리고 필요한 경우 Key를 기반으로 결정됩니다.

따라서 동일한 컴포넌트 함수를 사용하더라도 렌더링되는 위치가 달라지면 서로 다른 State를 가질 수 있습니다.

### 6.1 Different Positions

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter({ label }: { label: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{label}</h2>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

function App() {
  return (
    <div>
      <section>
        <Counter label="First" />
      </section>

      <section>
        <Counter label="Second" />
      </section>
    </div>
  );
}
```

두 `Counter`는 동일한 Component Type을 사용하지만 서로 다른 위치에 존재합니다.

따라서 각각 독립적인 State를 가집니다.

```text
App
 |
 v
div
 |
 +----> section
 |        |
 |        +----> Counter
 |                 |
 |                 +----> State A
 |
 +----> section
          |
          +----> Counter
                   |
                   +----> State B
```

각 컴포넌트는 독립적인 State를 유지하며, 한 컴포넌트의 State 업데이트가 다른 컴포넌트의 State를 변경하지 않습니다.

### 6.2 Nested Component Definitions

컴포넌트 함수를 다른 컴포넌트 함수 내부에서 정의하는 것은 주의해야 합니다.

다음 예제는 문제가 있는 코드입니다.

```tsx
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  function MyInput() {
    const [value, setValue] = useState('');

    return (
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>

      <MyInput />
    </div>
  );
}
```

`App`이 다시 렌더링될 때마다 내부에 정의된 `MyInput` 함수가 새롭게 생성됩니다.

따라서 React는 이전 렌더링에서 사용한 `MyInput`과 새로운 `MyInput`을 서로 다른 Component Type으로 판단할 수 있습니다.

그 결과 기존 컴포넌트가 제거되고 새로운 컴포넌트가 생성되면서 내부 State가 초기화될 수 있습니다.

올바른 방식은 컴포넌트 함수를 외부에 정의하는 것입니다.

```tsx
import { useState } from 'react';

function MyInput() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>

      <MyInput />
    </div>
  );
}
```

이렇게 하면 `MyInput`의 Component Type이 렌더링 사이에 안정적으로 유지되므로 State가 의도치 않게 초기화되는 문제를 방지할 수 있습니다.

## 7. Reconciliation and Performance

Reconciliation은 UI 업데이트의 효율성을 높이기 위한 중요한 과정입니다.

React는 이전 트리와 새로운 트리를 비교하여 필요한 변경 사항을 계산합니다.

모든 가능한 트리 비교 결과를 완벽하게 탐색하는 알고리즘은 일반적으로 높은 계산 비용을 요구합니다.

React의 전통적인 Reconciliation 설명에서는 다음 두 가지 가정을 기반으로 비교 작업을 효율화한다고 설명합니다.

1. 서로 다른 Element Type은 서로 다른 UI 트리를 생성합니다.
2. 개발자는 Key를 사용하여 형제 Element의 안정적인 식별 정보를 제공할 수 있습니다.

이러한 휴리스틱 기반 접근 방식은 일반적인 UI 업데이트에서 효율적인 비교를 가능하게 합니다.

### 7.1 Tree Comparison

React는 이전 트리와 새로운 트리를 비교할 때 Element의 Type과 Key를 기준으로 대응 관계를 결정합니다.

대표적인 비교 결과는 다음과 같습니다.

| 비교 조건 | 처리 방식 |
|---|---|
| 동일한 Type과 Key | 기존 Element 재사용 및 업데이트 |
| 서로 다른 Type | 기존 Element 제거 후 새로운 Element 생성 |
| 서로 다른 Key | 기존 Element 제거 후 새로운 Element 생성 |
| 기존 Element만 존재 | 해당 Element 제거 |
| 새로운 Element만 존재 | 새로운 Element 생성 |

이러한 규칙을 통해 React는 기존 UI 구조를 최대한 재사용하면서 필요한 부분만 변경합니다.

### 7.2 Avoid Unnecessary Remounting

불안정한 Key나 매 렌더링마다 새롭게 생성되는 Component Type은 불필요한 Remount를 발생시킬 수 있습니다.

다음과 같은 패턴은 피해야 합니다.

```tsx
function App() {
  const DynamicComponent = () => {
    return <input />;
  };

  return <DynamicComponent />;
}
```

`DynamicComponent`가 렌더링마다 새로운 함수 객체로 생성되기 때문에 React는 이전 컴포넌트와 동일한 Type으로 인식하지 못할 수 있습니다.

컴포넌트는 가능한 한 컴포넌트 외부에 선언하여 Type의 안정성을 유지해야 합니다.

또한 `key`에 `Math.random()`이나 매번 변경되는 값을 사용하지 않아야 합니다.

### 7.3 Reconciliation and Memoization

Reconciliation과 Memoization은 서로 다른 개념입니다.

Reconciliation은 새로운 UI와 기존 UI를 비교하여 업데이트할 내용을 결정하는 과정입니다.

반면 Memoization은 동일한 입력에 대한 계산 결과를 재사용하여 불필요한 계산이나 컴포넌트 렌더링을 줄이는 최적화 기법입니다.

React에서는 다음과 같은 기능을 제공합니다.

- `memo`: Props가 변경되지 않은 경우 컴포넌트의 불필요한 렌더링을 생략할 수 있습니다.
- `useMemo`: 계산 결과를 재사용할 수 있습니다.
- `useCallback`: 함수 참조를 재사용할 수 있습니다.

이러한 기능은 Reconciliation 자체를 대체하지 않으며, React의 렌더링 작업을 줄이기 위한 별도의 최적화 수단입니다.

## 8. Important Considerations

Reconciliation을 이해할 때 다음 사항에 주의해야 합니다.

### 8.1 Reconciliation Is Not the Same as Re-rendering

Re-rendering은 컴포넌트 함수가 다시 실행되어 새로운 UI를 계산하는 과정입니다.

Reconciliation은 새롭게 계산된 UI와 기존 UI를 비교하여 변경 사항을 결정하는 과정입니다.

두 과정은 밀접하게 연결되어 있지만 동일한 개념은 아닙니다.

### 8.2 Reconciliation Is Not Direct DOM Comparison

React는 실제 DOM 전체를 매번 직접 비교하는 방식으로 동작하지 않습니다.

React Element와 내부적으로 관리하는 UI Tree를 기반으로 변경 사항을 계산하고, Commit 단계에서 필요한 DOM 작업을 수행합니다.

### 8.3 Keys Are Part of Component Identity

Key는 리스트의 경고 메시지를 제거하기 위한 속성만은 아닙니다.

React가 형제 Element의 정체성을 구분하고 State를 보존하거나 초기화하는 데에도 영향을 줍니다.

### 8.4 Reconciliation Is an Implementation Detail

Reconciliation 알고리즘의 구체적인 내부 구현은 React의 버전과 내부 아키텍처에 따라 변경될 수 있습니다.

따라서 특정 알고리즘의 세부 구현에 의존하기보다는 다음과 같은 공개된 동작 원리를 중심으로 이해해야 합니다.

- 동일한 Type과 위치에서의 State 보존
- Key를 통한 Element 식별
- 서로 다른 Type으로 교체될 때의 State 초기화
- 필요한 DOM 변경 사항만 반영하는 동작

특히 React의 Concurrent Rendering에서는 Render 작업이 중단되거나 다시 시작될 수 있으므로, 내부 비교 작업이 항상 하나의 단순한 순차 과정으로 완료된다고 가정해서는 안 됩니다.

## 9. Summary

Reconciliation은 React가 이전 렌더링 결과와 새로운 렌더링 결과를 비교하여 UI 업데이트를 결정하는 핵심 과정입니다.

| 개념 | 설명 |
|---|---|
| Reconciliation | 이전 UI와 새로운 UI의 대응 관계를 결정하는 과정 |
| Element Type | 기존 Element와 새로운 Element가 동일한 유형인지 판단하는 기준 |
| Key | 형제 Element를 식별하기 위한 고유 식별 정보 |
| State Preservation | 동일한 컴포넌트 정체성이 유지될 때 State를 보존하는 동작 |
| State Resetting | 컴포넌트가 제거되거나 정체성이 변경될 때 State를 초기화하는 동작 |
| Remount | 기존 컴포넌트를 제거하고 새로운 컴포넌트를 생성하는 동작 |
| Memoization | 계산 결과 또는 컴포넌트 렌더링을 재사용하는 최적화 기법 |

핵심적으로 다음 사항을 이해해야 합니다.

- React는 이전 UI와 새로운 UI를 비교하여 필요한 변경 사항을 계산합니다.
- 동일한 Type과 위치가 유지되면 기존 컴포넌트와 State를 재사용할 수 있습니다.
- 서로 다른 Type으로 교체되면 기존 컴포넌트와 State가 제거됩니다.
- Key는 형제 Element의 정체성을 식별하는 데 사용됩니다.
- 안정적인 Key를 사용하면 리스트의 추가, 삭제 및 재정렬을 올바르게 처리할 수 있습니다.
- Key 변경은 의도적인 컴포넌트 State 초기화에도 활용할 수 있습니다.
- Reconciliation과 Memoization은 서로 다른 개념입니다.

Reconciliation은 React의 UI 업데이트 원리를 이해하기 위한 핵심 개념이며, State Preservation, List Rendering, Fiber Architecture 등의 개념과 밀접하게 연결됩니다.

## 10. References

- [React Official Documentation - Render and Commit](https://react.dev/learn/render-and-commit)
- [React Official Documentation - Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React Official Documentation - Rendering Lists](https://react.dev/learn/rendering-lists)
- [React Official Documentation - Managing State](https://react.dev/learn/managing-state)
- [React Official Documentation - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React Official Documentation - memo](https://react.dev/reference/react/memo)
- [React Legacy Documentation - Reconciliation](https://legacy.reactjs.org/docs/reconciliation.html)

참고: Legacy Reconciliation 문서는 React의 전통적인 Diffing 알고리즘과 Type 및 Key 비교 원리를 이해하기 위한 보충 자료입니다. 새로운 React 애플리케이션의 동작을 이해할 때는 최신 공식 문서의 State Preservation 및 Rendering 관련 설명을 우선적으로 참고하는 것이 좋습니다.
