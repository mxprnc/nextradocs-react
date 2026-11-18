# State Preservation

React에서 State Preservation은 컴포넌트가 다시 렌더링되더라도 기존 State를 유지하는 동작을 의미합니다.

React는 State를 컴포넌트 함수 내부에 직접 저장하는 것이 아니라 React가 관리하는 UI Tree의 특정 위치에 연결하여 관리합니다.

따라서 컴포넌트가 다시 렌더링되더라도 동일한 컴포넌트가 동일한 위치에 유지되면 기존 State가 보존됩니다.

반면 컴포넌트가 UI Tree에서 제거되거나 다른 컴포넌트로 교체되면 기존 State가 제거되고 새로운 State가 초기화됩니다.

이러한 동작은 React의 Reconciliation 과정과 밀접하게 연결되어 있으며, 컴포넌트의 정체성(Component Identity), 위치(Position), Key를 이해하는 데 중요한 개념입니다.

## 1. How React Stores State

React의 State는 컴포넌트 함수가 실행될 때마다 새롭게 생성되는 일반 변수와 다르게 동작합니다.

다음 예제를 살펴보겠습니다.

```tsx
function Counter() {
  let count = 0;

  function handleClick() {
    count += 1;
    console.log(count);
  }

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}
```

`count`는 일반 지역 변수이므로 컴포넌트가 다시 실행되면 초기값인 `0`으로 다시 설정됩니다.

또한 지역 변수의 변경은 React에 렌더링을 요청하지 않습니다.

반면 `useState`를 사용하면 React가 State를 관리합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Count: {count}
    </button>
  );
}
```

`setCount()`가 호출되면 React는 State 업데이트를 예약하고 새로운 렌더링을 수행합니다.

이때 React는 이전 렌더링에서 관리하던 State를 유지하여 새로운 컴포넌트 실행에 전달합니다.

개념적으로 다음과 같은 구조로 이해할 수 있습니다.

```text
React UI Tree
     |
     v
Counter Component
     |
     +----> State: count = 3
     |
     +----> State: otherValue = ...
```

실제 React 내부에서는 Fiber Node와 Hook 관련 자료구조를 통해 State를 관리합니다.

다만 이러한 내부 구현의 구체적인 구조와 별개로, 중요한 점은 State가 컴포넌트 함수의 지역 변수에 저장되는 것이 아니라 React가 관리하는 컴포넌트 인스턴스의 정체성에 연결된다는 것입니다.

## 2. State Is Tied to a Position in the UI Tree

React는 UI Tree에서 컴포넌트가 위치한 곳을 기준으로 State를 관리합니다.

동일한 컴포넌트 함수가 사용되더라도 서로 다른 위치에 렌더링되면 각각 독립적인 State를 가집니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{name}</h2>
      <p>Count: {count}</p>

      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

function App() {
  return (
    <main>
      <section>
        <Counter name="First" />
      </section>

      <section>
        <Counter name="Second" />
      </section>
    </main>
  );
}
```

두 `Counter` 컴포넌트는 동일한 Component Type을 사용하지만 UI Tree에서 서로 다른 위치에 존재합니다.

따라서 각각 독립적인 State를 가집니다.

```text
App
 |
 v
main
 |
 +----> section
 |        |
 |        +----> Counter
 |                 |
 |                 +----> State: count = 3
 |
 +----> section
          |
          +----> Counter
                   |
                   +----> State: count = 5
```

첫 번째 Counter의 State를 변경하더라도 두 번째 Counter의 State에는 영향을 주지 않습니다.

React는 컴포넌트 함수의 이름만으로 State를 구분하지 않습니다.

컴포넌트의 Type과 UI Tree에서의 위치, 그리고 필요한 경우 Key를 함께 고려하여 기존 State를 유지할지 결정합니다.

## 3. State Preservation

동일한 Component Type이 동일한 위치에 유지되면 React는 기존 State를 보존합니다.

컴포넌트의 Props가 변경되거나 부모 컴포넌트가 다시 렌더링되더라도 컴포넌트의 정체성이 유지되면 State는 초기화되지 않습니다.

### 3.1 State Preservation During Re-rendering

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

interface CounterProps {
  title: string;
}

function Counter({ title }: CounterProps) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>

      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}

function App({ title }: { title: string }) {
  return <Counter title={title} />;
}
```

초기 렌더링 이후 `count`가 `3`인 상태에서 `title`이 변경된다고 가정합니다.

```tsx
<App title="First Counter" />
```

이후 다음과 같이 변경됩니다.

```tsx
<App title="Updated Counter" />
```

두 렌더링 결과에서 `Counter`의 Component Type과 위치는 동일합니다.

따라서 React는 기존 컴포넌트를 유지하고 새로운 Props를 전달합니다.

```text
Before

App
 |
 v
Counter(title="First Counter")
 |
 +----> State: count = 3


After

App
 |
 v
Counter(title="Updated Counter")
 |
 +----> State: count = 3
```

Props 변경은 컴포넌트의 정체성을 변경하지 않으므로 기존 State가 보존됩니다.

### 3.2 State Preservation with Same Component Type

동일한 Component Type을 유지하는 것은 State 보존의 중요한 조건입니다.

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter({ label }: { label: string }) {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      {label}: {count}
    </button>
  );
}

function App({ isPrimary }: { isPrimary: boolean }) {
  return (
    <div>
      <Counter label={isPrimary ? 'Primary' : 'Secondary'} />
    </div>
  );
}
```

`isPrimary`가 변경되어도 React가 사용하는 Component Type은 계속 `Counter`입니다.

따라서 기존 State는 유지됩니다.

반면 동일한 위치에 서로 다른 Component Type이 렌더링되면 기존 State가 보존되지 않습니다.

```tsx
import { useState } from 'react';

function CounterA() {
  const [count, setCount] = useState(0);

  return <p>Counter A: {count}</p>;
}

function CounterB() {
  const [count, setCount] = useState(0);

  return <p>Counter B: {count}</p>;
}

function App({ isA }: { isA: boolean }) {
  return isA ? <CounterA /> : <CounterB />;
}
```

`CounterA`가 `CounterB`로 교체되면 기존 컴포넌트가 제거되고 새로운 컴포넌트가 생성됩니다.

따라서 기존 State는 제거되고 새로운 State가 초기화됩니다.

## 4. State Resetting

State Resetting은 기존 컴포넌트의 State가 제거되고 새로운 초기값으로 다시 설정되는 동작입니다.

React는 컴포넌트의 정체성이 변경되면 기존 State를 유지하지 않습니다.

대표적으로 다음과 같은 경우에 발생합니다.

- 기존 컴포넌트가 UI Tree에서 제거되는 경우
- 동일한 위치에 다른 Component Type이 렌더링되는 경우
- 동일한 위치에서 Key가 변경되는 경우

### 4.1 State Resetting by Component Removal

컴포넌트가 조건부 렌더링에 의해 제거되면 해당 컴포넌트의 State도 제거됩니다.

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

function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      {isVisible && <Counter />}

      <button onClick={() => setIsVisible((prev) => !prev)}>
        Toggle Counter
      </button>
    </div>
  );
}
```

`Counter`의 `count`를 `5`까지 증가시킨 후 `isVisible`을 `false`로 변경하면 `Counter`가 UI Tree에서 제거됩니다.

이후 다시 `true`로 변경하면 새로운 `Counter`가 Mount됩니다.

새로운 컴포넌트는 초기값인 `0`부터 시작합니다.

```text
Initial Mount
     |
     v
Counter
     |
     +----> count = 0
     |
     v
State Update
     |
     v
count = 5
     |
     v
Component Removed
     |
     v
State Discarded
     |
     v
Component Mounted Again
     |
     v
count = 0
```

컴포넌트가 화면에서 일시적으로 보이지 않는 것과 UI Tree에서 제거되는 것은 구분해야 합니다.

일반적인 조건부 렌더링에서 컴포넌트가 렌더링 결과에서 제외되면 해당 컴포넌트의 State가 제거됩니다.

### 4.2 State Resetting by Element Type

동일한 위치에 서로 다른 Element Type이 렌더링되면 기존 Element는 제거되고 새로운 Element가 생성됩니다.

```tsx
function App({ isHeading }: { isHeading: boolean }) {
  return (
    <div>
      {isHeading ? (
        <h1>Hello, React!</h1>
      ) : (
        <p>Hello, React!</p>
      )}
    </div>
  );
}
```

`h1`과 `p`는 서로 다른 Host Element Type입니다.

따라서 React는 기존 DOM 노드를 제거하고 새로운 DOM 노드를 생성합니다.

컴포넌트 내부에 State가 존재하는 경우에도 동일한 원리가 적용됩니다.

## 5. Resetting State with Key

Key는 React가 형제 Element를 구분하기 위해 사용하는 식별 정보입니다.

Key는 리스트 렌더링뿐 아니라 컴포넌트의 State를 의도적으로 초기화하는 데에도 활용할 수 있습니다.

React는 동일한 위치에 존재하는 Element라도 Key가 변경되면 기존 Element와 다른 Element로 취급합니다.

### 5.1 Using Key to Reset State

다음 예제를 살펴보겠습니다.

```tsx
import { useState } from 'react';

function Counter({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{name}</h2>
      <p>Count: {count}</p>

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

`userId`가 변경되면 `key`도 변경됩니다.

React는 기존 `Counter`를 제거하고 새로운 `Counter`를 생성합니다.

따라서 기존 State는 제거되고 새로운 State가 초기화됩니다.

```text
Before

Counter(key="user-1")
 |
 +----> State: count = 5


After

Counter(key="user-2")
 |
 +----> State: count = 0
```

Key를 이용한 State 초기화는 다음과 같은 상황에서 유용합니다.

- 사용자 계정이 변경될 때 입력 폼 초기화
- 상세 데이터가 변경될 때 이전 데이터의 UI State 제거
- 대화방이 변경될 때 메시지 입력 상태 초기화
- 서로 다른 데이터 항목을 전환할 때 컴포넌트 내부 State 초기화

### 5.2 Resetting Form State with Key

Key를 사용하면 폼 내부의 여러 State를 개별적으로 초기화하지 않고 컴포넌트 전체를 새로운 인스턴스로 교체할 수 있습니다.

```tsx
import { useState } from 'react';

interface ProfileEditorProps {
  userId: string;
  initialName: string;
}

function ProfileEditor({
  userId,
  initialName,
}: ProfileEditorProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState('');

  return (
    <form>
      <h2>{userId}</h2>

      <label>
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
    </form>
  );
}

function App({
  userId,
  initialName,
}: ProfileEditorProps) {
  return (
    <ProfileEditor
      key={userId}
      userId={userId}
      initialName={initialName}
    />
  );
}
```

사용자가 다른 계정으로 전환하면 `userId`가 변경됩니다.

이때 `ProfileEditor`의 Key도 변경되므로 기존 컴포넌트가 제거되고 새로운 컴포넌트가 생성됩니다.

결과적으로 다음 State가 모두 초기화됩니다.

- `name`
- `description`

Key를 사용하지 않는 경우에는 Props 변경에 따라 내부 State를 별도로 동기화하거나 초기화하는 로직이 필요할 수 있습니다.

단, 컴포넌트를 교체하는 방식은 내부 State뿐 아니라 하위 컴포넌트의 State와 Effect에도 영향을 주므로 의도적으로 초기화가 필요한 경우에 사용해야 합니다.

## 6. State Preservation in Conditional Rendering

조건부 렌더링은 컴포넌트의 Mounting과 Unmounting을 발생시킬 수 있으며, 결과적으로 State 보존 여부에도 영향을 줍니다.

특히 JSX에서 조건문을 작성하는 방식에 따라 컴포넌트의 위치와 정체성이 달라질 수 있습니다.

### 6.1 Same Position, Same Component Type

다음 예제를 살펴보겠습니다.

```tsx
function App({ isPrimary }: { isPrimary: boolean }) {
  return (
    <div>
      <Counter
        label={isPrimary ? 'Primary' : 'Secondary'}
      />
    </div>
  );
}
```

`Counter`는 조건과 관계없이 동일한 위치에 렌더링됩니다.

변경되는 것은 Props뿐이므로 State가 보존됩니다.

### 6.2 Different Component Types

다음 예제에서는 서로 다른 Component Type을 조건부로 렌더링합니다.

```tsx
function App({ isPrimary }: { isPrimary: boolean }) {
  return (
    <div>
      {isPrimary ? <CounterA /> : <CounterB />}
    </div>
  );
}
```

`isPrimary`가 변경되면 기존 컴포넌트가 제거되고 다른 컴포넌트가 생성됩니다.

따라서 기존 State가 보존되지 않습니다.

### 6.3 Different Positions

동일한 컴포넌트라도 UI Tree에서의 위치가 변경되면 기존 State가 유지되지 않을 수 있습니다.

```tsx
function App({ isPrimary }: { isPrimary: boolean }) {
  return (
    <div>
      {isPrimary && <Counter />}
      {!isPrimary && <Counter />}
    </div>
  );
}
```

`isPrimary`가 `true`에서 `false`로 변경되면 첫 번째 위치의 `Counter`가 제거되고 두 번째 위치에 새로운 `Counter`가 생성됩니다.

두 Element는 동일한 Component Type을 사용하지만 UI Tree에서 서로 다른 위치에 존재합니다.

따라서 기존 State가 유지되지 않습니다.

이러한 경우 컴포넌트가 동일한 Type이라는 사실만으로 State 보존을 보장할 수 없습니다.

## 7. State Preservation in Lists

리스트에서는 Key가 컴포넌트의 정체성을 식별하는 중요한 역할을 수행합니다.

특히 리스트 항목의 추가, 삭제 및 순서 변경이 발생하면 Key에 따라 기존 State를 어떤 항목에 연결할지 결정됩니다.

### 7.1 Stable Keys

다음과 같이 고유 ID를 Key로 사용하는 것이 권장됩니다.

```tsx
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
];

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
}
```

React는 Key를 기반으로 각 리스트 항목의 정체성을 식별합니다.

따라서 리스트의 순서가 변경되더라도 동일한 Key를 가진 항목은 기존 컴포넌트와 State를 유지할 수 있습니다.

### 7.2 Index as Key

배열의 Index를 Key로 사용하면 리스트의 순서가 변경될 때 문제가 발생할 수 있습니다.

```tsx
{users.map((user, index) => (
  <UserItem key={index} user={user} />
))}
```

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

Index를 Key로 사용하면 React는 기존 위치의 컴포넌트를 새로운 위치의 데이터와 대응시킬 수 있습니다.

그 결과 기존 컴포넌트의 State가 실제 데이터 항목이 아닌 배열의 위치에 연결되어 잘못된 데이터와 함께 유지될 수 있습니다.

특히 리스트 항목 내부에 입력값이나 독립적인 State가 존재하는 경우 예상하지 못한 UI 동작이 발생할 수 있습니다.

따라서 리스트의 순서가 변경될 가능성이 있다면 데이터의 고유 ID를 Key로 사용하는 것이 좋습니다.

## 8. Nested Component Definitions and State Resetting

컴포넌트 함수를 다른 컴포넌트 함수 내부에서 정의하면 렌더링 과정에서 새로운 Component Type이 생성될 수 있습니다.

이는 기존 State가 의도치 않게 초기화되는 원인이 될 수 있습니다.

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
      <p>Count: {count}</p>

      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>

      <MyInput />
    </div>
  );
}
```

`App`이 다시 렌더링될 때마다 내부의 `MyInput` 함수가 새롭게 생성됩니다.

React는 이전 렌더링에서 사용한 `MyInput`과 새로운 `MyInput`을 서로 다른 Component Type으로 판단할 수 있습니다.

따라서 기존 `MyInput`이 제거되고 새로운 컴포넌트가 생성되면서 내부 State가 초기화됩니다.

올바른 방식은 컴포넌트를 외부에 선언하는 것입니다.

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
      <p>Count: {count}</p>

      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>

      <MyInput />
    </div>
  );
}
```

이렇게 하면 `MyInput`의 Component Type이 렌더링 사이에 안정적으로 유지됩니다.

따라서 부모 컴포넌트가 다시 렌더링되더라도 `MyInput`의 State가 불필요하게 초기화되지 않습니다.

## 9. State Preservation and Reconciliation

State Preservation은 React의 Reconciliation 과정과 밀접하게 연결되어 있습니다.

Reconciliation은 이전 Element Tree와 새로운 Element Tree를 비교하여 기존 컴포넌트를 유지할지, 업데이트할지, 제거하고 새로 생성할지 결정합니다.

이 과정에서 Element Type, Key, UI Tree에서의 위치 등이 고려됩니다.

대표적인 동작은 다음과 같습니다.

| 조건 | State 동작 |
|---|---|
| 동일한 위치와 Component Type | 기존 State 보존 |
| Props 변경 | 기존 State 보존 |
| 부모 컴포넌트 재렌더링 | 컴포넌트 정체성이 유지되면 State 보존 |
| Component Type 변경 | 기존 State 제거 및 초기화 |
| 컴포넌트 제거 후 재생성 | 새로운 State 초기화 |
| 동일 위치에서 Key 변경 | 기존 State 제거 및 초기화 |
| 리스트 항목의 안정적인 Key 유지 | 해당 항목의 State 보존 가능 |
| 리스트 Index Key 사용 후 재정렬 | State가 다른 데이터에 연결될 가능성 존재 |

Reconciliation이 컴포넌트의 정체성을 판단하는 과정이라면 State Preservation은 그 결과에 따라 기존 State를 유지하거나 초기화하는 동작이라고 이해할 수 있습니다.

## 10. Important Considerations

State Preservation을 이해할 때 다음 사항에 주의해야 합니다.

### 10.1 State Is Not Stored in Component Functions

컴포넌트 함수는 렌더링될 때마다 다시 실행될 수 있습니다.

그러나 React가 관리하는 State는 컴포넌트의 정체성에 연결되어 있으므로 컴포넌트가 다시 실행되더라도 유지될 수 있습니다.

### 10.2 Props Changes Do Not Automatically Reset State

Props가 변경되었다고 해서 컴포넌트의 State가 자동으로 초기화되지는 않습니다.

컴포넌트의 Type과 위치, Key가 유지되면 기존 State를 계속 사용할 수 있습니다.

### 10.3 Component Identity Matters More Than Function Name

컴포넌트 함수의 이름이 동일하다는 사실만으로 State 보존이 보장되지는 않습니다.

React가 관리하는 UI Tree에서의 위치와 Component Type, Key를 함께 고려해야 합니다.

### 10.4 Key Changes Can Reset an Entire Subtree

컴포넌트의 Key가 변경되면 해당 컴포넌트뿐 아니라 하위 컴포넌트들의 State도 초기화될 수 있습니다.

따라서 Key를 변경하는 것은 단순히 리스트의 식별 정보를 수정하는 작업이 아니라 해당 UI 영역의 정체성을 변경하는 작업입니다.

### 10.5 State Preservation and DOM Preservation Are Related but Different

State 보존과 DOM 노드 재사용은 서로 밀접하게 연결되어 있지만 동일한 개념은 아닙니다.

React는 Element의 Type과 Key 등을 기반으로 기존 UI 구조를 유지하면서 변경된 DOM 속성이나 콘텐츠를 업데이트할 수 있습니다.

반면 DOM 노드가 유지되더라도 하위 구조나 다른 UI 요소의 State는 별도로 제거되거나 초기화될 수 있습니다.

따라서 State와 DOM의 보존 여부를 동일한 기준으로 판단해서는 안 됩니다.

## 11. Summary

State Preservation은 React가 컴포넌트의 정체성을 기준으로 기존 State를 유지하는 동작입니다.

| 개념 | 설명 |
|---|---|
| State Preservation | 컴포넌트의 정체성이 유지될 때 기존 State를 보존하는 동작 |
| State Resetting | 컴포넌트의 정체성이 변경될 때 기존 State를 초기화하는 동작 |
| Component Identity | UI Tree에서 컴포넌트를 식별하는 기준 |
| Position | UI Tree에서 컴포넌트가 위치한 곳 |
| Key | 형제 Element를 식별하기 위한 고유 식별 정보 |
| Reconciliation | 이전 UI와 새로운 UI를 비교하여 업데이트를 결정하는 과정 |

핵심적으로 다음 사항을 이해해야 합니다.

- React State는 컴포넌트 함수의 지역 변수가 아니라 React가 관리하는 UI Tree의 컴포넌트 정체성에 연결됩니다.
- 동일한 Component Type과 위치가 유지되면 기존 State가 보존됩니다.
- Props가 변경되어도 컴포넌트의 정체성이 유지되면 State는 초기화되지 않습니다.
- 컴포넌트가 UI Tree에서 제거되면 해당 State도 제거됩니다.
- Component Type이나 Key가 변경되면 기존 State가 초기화될 수 있습니다.
- Key는 리스트 항목의 정체성을 식별하는 동시에 State 초기화에도 활용할 수 있습니다.
- 배열의 Index를 Key로 사용하면 리스트 재정렬 시 State가 잘못 연결될 수 있습니다.
- 중첩된 컴포넌트 정의는 Component Type의 불안정성을 유발하여 State 초기화 문제를 발생시킬 수 있습니다.

State Preservation은 React의 State 관리 원리를 이해하기 위한 핵심 개념이며, Reconciliation과 Component Lifecycle을 함께 이해하면 컴포넌트가 언제 유지되고 언제 새롭게 생성되는지 명확하게 파악할 수 있습니다.

## 12. References

- [React Official Documentation - Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [React Official Documentation - Render and Commit](https://react.dev/learn/render-and-commit)
- [React Official Documentation - Rendering Lists](https://react.dev/learn/rendering-lists)
- [React Official Documentation - State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React Official Documentation - Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React Official Documentation - Managing State](https://react.dev/learn/managing-state)
- [React Official Documentation - Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [React Official Documentation - Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [React Official Documentation - useState](https://react.dev/reference/react/useState)