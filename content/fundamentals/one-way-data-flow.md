# One-Way Data Flow

## 1. 단방향 데이터 흐름이란?

React의 단방향 데이터 흐름(One-Way Data Flow)은 컴포넌트 간 데이터가 일반적으로 부모 컴포넌트에서 자식 컴포넌트 방향으로 전달되는 구조를 의미합니다.

부모 컴포넌트는 자신의 State를 Props로 자식 컴포넌트에 전달하며, 자식 컴포넌트는 전달받은 Props를 사용하여 UI를 렌더링합니다.

자식 컴포넌트에서 부모 컴포넌트의 State를 직접 변경하는 대신, 부모가 전달한 Callback을 호출하여 특정 동작이 발생했다는 사실이나 변경 의도를 전달합니다.

기본적인 데이터 흐름은 다음과 같습니다.

```text
        Parent Component
        ┌───────────────┐
        │     State     │
        └───────┬───────┘
                │
                │ Props
                ▼
        ┌───────────────┐
        │ Child Component
        │               │
        │    UI Event   │
        └───────┬───────┘
                │
                │ Callback
                ▼
        Parent Component
        ┌───────────────┐
        │ State Update  │
        └───────────────┘
```

단방향 데이터 흐름은 다음과 같은 특징을 가집니다.

- **데이터 전달 방향:** 부모 컴포넌트에서 자식 컴포넌트로 전달됩니다.
- **변경 요청 전달:** 자식 컴포넌트는 Callback을 통해 부모 컴포넌트에 변경 의도를 전달합니다.
- **State 관리:** State를 소유한 컴포넌트가 해당 State의 변경을 관리합니다.
- **UI 동기화:** State가 변경되면 React는 새로운 State를 기준으로 관련 컴포넌트를 다시 렌더링합니다.

이 구조를 통해 데이터의 소유권과 변경 책임을 명확하게 유지할 수 있습니다.

## 2. 부모에서 자식으로 데이터 전달

부모 컴포넌트는 자식 컴포넌트에 Props를 전달하여 데이터를 공유합니다.

자식 컴포넌트는 전달받은 Props를 읽고, 해당 데이터에 따라 UI를 구성합니다.

```tsx
type UserProfileProps = {
  name: string;
  email: string;
};

function UserProfile({ name, email }: UserProfileProps) {
  return (
    <section>
      <h2>{name}</h2>
      <p>{email}</p>
    </section>
  );
}

function App() {
  const user = {
    name: "Kim",
    email: "kim@example.com",
  };

  return (
    <UserProfile
      name={user.name}
      email={user.email}
    />
  );
}
```

위 예제에서 데이터 흐름은 다음과 같습니다.

1. `App` 컴포넌트가 사용자 데이터를 소유합니다.
2. `App`은 `UserProfile`에 사용자 데이터를 Props로 전달합니다.
3. `UserProfile`은 전달받은 Props를 사용하여 사용자 정보를 렌더링합니다.
4. `UserProfile`은 전달받은 데이터의 소유권을 가지지 않으며, 해당 데이터를 직접 변경하지 않습니다.

Props는 컴포넌트 간 데이터 전달을 위한 인터페이스입니다. Props의 정의, 전달 방식 및 불변성에 관한 자세한 내용은 `props.md`를 참고하시기 바랍니다.

## 3. 자식에서 부모로 변경 의도 전달

단방향 데이터 흐름에서 데이터 자체는 부모에서 자식으로 전달됩니다.

그렇다면 자식 컴포넌트에서 발생한 사용자 이벤트를 통해 부모 컴포넌트의 State를 변경하려면 어떻게 해야 할까요?

React에서는 부모 컴포넌트가 Callback 함수를 Props로 전달하고, 자식 컴포넌트가 해당 함수를 호출하는 방식을 사용합니다.

```tsx
type CounterButtonProps = {
  onIncrement: () => void;
};

function CounterButton({ onIncrement }: CounterButtonProps) {
  return (
    <button onClick={onIncrement}>
      Increment
    </button>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <CounterButton onIncrement={handleIncrement} />
    </div>
  );
}
```

위 예제에서의 동작 과정은 다음과 같습니다.

1. `Counter` 컴포넌트가 `count` State를 소유합니다.
2. `Counter`는 `handleIncrement` 함수를 자식 컴포넌트에 Props로 전달합니다.
3. `CounterButton`에서 버튼 클릭 이벤트가 발생합니다.
4. `CounterButton`은 전달받은 `onIncrement` Callback을 호출합니다.
5. Callback이 실행되면서 부모 컴포넌트의 `count` State가 변경됩니다.
6. React는 변경된 State를 기준으로 `Counter`와 관련된 UI를 다시 렌더링합니다.

여기서 중요한 점은 자식 컴포넌트가 부모의 State에 직접 접근하거나 변경하는 것이 아니라는 사실입니다.

자식 컴포넌트는 부모가 전달한 함수를 호출하여 변경 의도를 전달하고, 실제 State 변경은 해당 State를 소유한 부모 컴포넌트에서 수행합니다.

따라서 단방향 데이터 흐름에서 흔히 사용하는 `Props Down, Events Up`이라는 표현은 다음과 같은 의미를 가집니다.

- **Props Down:** 데이터와 동작에 필요한 인터페이스가 부모에서 자식으로 전달됩니다.
- **Events Up:** 자식에서 발생한 이벤트가 Callback을 통해 부모의 변경 로직을 실행하도록 전달됩니다.

실제로 데이터가 부모 방향으로 역전되는 것은 아닙니다. Callback 호출은 부모 컴포넌트가 제공한 함수를 실행하는 것이며, 데이터의 소유권과 State 변경 책임은 여전히 부모에게 있습니다.

이벤트 처리 및 Callback 작성 방식은 `event-handling.md`를 참고하시기 바랍니다.

## 4. State 소유 컴포넌트

컴포넌트 간 데이터 흐름을 설계할 때 중요한 기준은 **어떤 컴포넌트가 State를 소유해야 하는가**입니다.

State를 소유한 컴포넌트는 해당 State의 초기값과 변경 로직을 관리하며, 필요한 자식 컴포넌트에 Props와 Callback을 전달합니다.

일반적으로 State는 해당 데이터를 사용하는 컴포넌트들의 공통 부모 중 가장 가까운 컴포넌트에 배치하는 것이 적절합니다.

예를 들어 다음과 같은 컴포넌트 구조가 있다고 가정하겠습니다.

```text
App
├── Header
│   └── UserInfo
└── Main
    ├── UserProfile
    └── UserSettings
```

`UserProfile`과 `UserSettings`가 동일한 사용자 정보를 사용한다면, 각 컴포넌트가 별도의 사용자 State를 가지는 대신 공통 부모인 `App` 또는 적절한 상위 컴포넌트가 State를 소유할 수 있습니다.

```tsx
type User = {
  name: string;
  email: string;
};

type UserProfileProps = {
  user: User;
};

type UserSettingsProps = {
  user: User;
  onNameChange: (name: string) => void;
};

function UserProfile({ user }: UserProfileProps) {
  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
}

function UserSettings({
  user,
  onNameChange,
}: UserSettingsProps) {
  return (
    <section>
      <label>
        Name
        <input
          value={user.name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </label>
    </section>
  );
}

function App() {
  const [user, setUser] = useState<User>({
    name: "Kim",
    email: "kim@example.com",
  });

  const handleNameChange = (name: string) => {
    setUser((prevUser) => ({
      ...prevUser,
      name,
    }));
  };

  return (
    <>
      <UserProfile user={user} />
      <UserSettings
        user={user}
        onNameChange={handleNameChange}
      />
    </>
  );
}
```

위 구조에서는 `App`이 사용자 데이터를 소유하고, 두 자식 컴포넌트에 동일한 사용자 정보를 전달합니다.

`UserSettings`에서 이름을 변경하면 다음과 같은 흐름으로 UI가 갱신됩니다.

1. 사용자가 `UserSettings`의 Input 값을 변경합니다.
2. `UserSettings`가 `onNameChange` Callback을 호출합니다.
3. `App`이 Callback을 통해 전달받은 이름으로 사용자 State를 갱신합니다.
4. React가 변경된 사용자 State를 기준으로 자식 컴포넌트에 새로운 Props를 전달합니다.
5. `UserProfile`과 `UserSettings`가 동일한 사용자 데이터를 기준으로 렌더링됩니다.

이처럼 하나의 State를 여러 컴포넌트가 공유하면 데이터의 일관성을 유지하기 쉽습니다.

State의 선언, 갱신 및 렌더링 동작에 관한 자세한 내용은 `state.md`를 참고하시기 바랍니다.

## 5. State 끌어올리기 (Lifting State Up)

State 끌어올리기(Lifting State Up)는 여러 컴포넌트가 동일한 State를 공유해야 할 때, 해당 State를 공통 부모 컴포넌트로 이동하는 설계 방법입니다.

각 자식 컴포넌트가 독립적으로 동일한 데이터를 관리하면 State 간 동기화 문제가 발생할 수 있습니다.

이 경우 State를 공통 부모로 이동하고, 부모가 Props와 Callback을 통해 자식 컴포넌트를 제어하도록 구성합니다.

### 5.1. State를 각각 관리하는 경우

다음 예제에서는 두 자식 컴포넌트가 각각 독립적인 State를 가지고 있습니다.

```tsx
function TemperatureInput() {
  const [temperature, setTemperature] = useState("");

  return (
    <input
      value={temperature}
      onChange={(event) => setTemperature(event.target.value)}
    />
  );
}

function TemperatureDisplay() {
  const [temperature] = useState("");

  return <p>{temperature}°C</p>;
}

function App() {
  return (
    <>
      <TemperatureInput />
      <TemperatureDisplay />
    </>
  );
}
```

두 컴포넌트가 동일한 온도 데이터를 표현해야 한다면, 현재 구조에서는 한쪽의 State가 변경되어도 다른 쪽의 State에는 반영되지 않습니다.

각 컴포넌트가 서로 다른 State를 소유하기 때문입니다.

### 5.2. State를 공통 부모로 이동

이 문제를 해결하려면 온도 State를 공통 부모인 `App`으로 이동해야 합니다.

```tsx
function TemperatureInput({
  temperature,
  onTemperatureChange,
}: {
  temperature: string;
  onTemperatureChange: (value: string) => void;
}) {
  return (
    <input
      value={temperature}
      onChange={(event) => onTemperatureChange(event.target.value)}
    />
  );
}

function TemperatureDisplay({
  temperature,
}: {
  temperature: string;
}) {
  return <p>{temperature}°C</p>;
}

function App() {
  const [temperature, setTemperature] = useState("");

  const handleTemperatureChange = (value: string) => {
    setTemperature(value);
  };

  return (
    <>
      <TemperatureInput
        temperature={temperature}
        onTemperatureChange={handleTemperatureChange}
      />

      <TemperatureDisplay temperature={temperature} />
    </>
  );
}
```

이제 `App`이 온도 State를 단일하게 관리하므로 Input에서 값이 변경되면 Display에도 동일한 데이터가 전달됩니다.

State 끌어올리기의 핵심은 다음과 같습니다.

1. 여러 컴포넌트에서 공유해야 하는 State를 식별합니다.
2. 해당 컴포넌트들의 공통 부모를 찾습니다.
3. State를 공통 부모로 이동합니다.
4. 필요한 자식 컴포넌트에 State를 Props로 전달합니다.
5. 자식에서 발생한 변경 요청은 Callback으로 부모에 전달합니다.

React 공식 문서에서는 이 패턴을 컴포넌트 간 State 공유를 위한 기본적인 설계 방법으로 설명합니다.

## 6. 형제 컴포넌트 간 데이터 공유

형제 컴포넌트(Sibling Components)는 동일한 부모 컴포넌트를 가지는 컴포넌트입니다.

React에서는 일반적으로 형제 컴포넌트끼리 State를 직접 공유하지 않습니다.

대신 공통 부모가 State를 소유하고, 각 자식 컴포넌트에 필요한 데이터를 전달합니다.

```text
        Parent
          │
          │ State
          │
     ┌────┴────┐
     ▼         ▼
  Child A    Child B
```

예를 들어 두 개의 패널 중 하나만 열리도록 구현하는 경우를 살펴보겠습니다.

```tsx
type PanelProps = {
  title: string;
  isActive: boolean;
  onShow: () => void;
};

function Panel({
  title,
  isActive,
  onShow,
}: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>

      {isActive ? (
        <p>Panel Content</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}

function Accordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <>
      <Panel
        title="Panel A"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      />

      <Panel
        title="Panel B"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      />
    </>
  );
}
```

`Accordion`이 `activeIndex` State를 소유하고, 각 `Panel`에 현재 활성화 여부와 활성화 요청 Callback을 전달합니다.

한 패널이 활성화되면 부모의 State가 변경되고, 두 패널은 동일한 State를 기준으로 활성화 여부를 결정합니다.

이 구조에서는 다음과 같은 장점이 있습니다.

- 형제 컴포넌트 간 데이터 동기화를 별도로 구현할 필요가 없습니다.
- 여러 컴포넌트가 동일한 기준으로 UI를 렌더링할 수 있습니다.
- 데이터 변경 로직이 한 곳에 모여 상태 관리가 명확해집니다.

## 7. Controlled Component

Controlled Component는 React의 State가 입력 요소의 값을 제어하는 컴포넌트를 의미합니다.

일반적으로 Input, Textarea, Select와 같은 폼 요소에서 사용됩니다.

React State를 입력 요소의 `value`에 연결하고, `onChange` 이벤트에서 State를 갱신하는 구조입니다.

```tsx
function SearchForm() {
  const [keyword, setKeyword] = useState("");

  return (
    <form>
      <input
        type="text"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      />

      <p>Search Keyword: {keyword}</p>
    </form>
  );
}
```

위 예제에서 데이터 흐름은 다음과 같습니다.

1. `SearchForm`이 `keyword` State를 소유합니다.
2. Input의 `value`에 `keyword`를 전달합니다.
3. 사용자가 Input 값을 변경하면 `onChange` 이벤트가 발생합니다.
4. 이벤트 핸들러가 `setKeyword`를 호출하여 State를 갱신합니다.
5. React가 새로운 State를 기준으로 Input의 `value`를 업데이트합니다.

Controlled Component에서는 React State가 입력 요소의 현재 값을 결정합니다.

반대로 Uncontrolled Component는 DOM 자체가 입력값을 관리하며, 일반적으로 `ref`를 통해 필요한 시점에 값을 읽습니다.

```tsx
function UncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <input type="text" ref={inputRef} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

두 방식의 주요 차이는 다음과 같습니다.

| 구분 | Controlled Component | Uncontrolled Component |
|---|---|---|
| 값의 소유자 | React State | DOM |
| 값 접근 | State | Ref |
| 값 변경 | State 갱신 | DOM 내부 변경 |
| UI 동기화 | React State 기준 | DOM 기준 |
| 주요 사용 사례 | 실시간 검증, 동적 UI | 간단한 폼, DOM 기반 라이브러리 연동 |

Controlled Component는 입력값과 UI를 React State에 연결하기 때문에 입력값 검증, 조건부 UI, 다른 컴포넌트와의 데이터 공유 등을 구현하기에 적합합니다.

다만 모든 입력 요소를 반드시 Controlled Component로 구현해야 하는 것은 아닙니다. 요구사항에 따라 Uncontrolled Component를 사용할 수도 있습니다.

## 8. 단방향 데이터 흐름과 Context

Props를 통해 여러 단계의 자식 컴포넌트에 데이터를 전달하는 구조가 복잡해지면 Prop Drilling 문제가 발생할 수 있습니다.

Prop Drilling은 중간 컴포넌트가 직접 사용하지 않는 데이터를 하위 컴포넌트에 전달하기 위해 여러 단계에서 Props를 중계하는 상황을 의미합니다.

```text
App
 │ user
 ▼
Layout
 │ user
 ▼
Sidebar
 │ user
 ▼
UserProfile
```

이러한 경우 React Context를 사용하면 상위 컴포넌트가 제공한 데이터를 하위 컴포넌트에서 직접 읽을 수 있습니다.

```tsx
import { createContext, useContext } from "react";

type User = {
  name: string;
};

const UserContext = createContext<User | null>(null);

function UserProfile() {
  const user = useContext(UserContext);

  if (!user) {
    return null;
  }

  return <p>{user.name}</p>;
}

function App() {
  const user = {
    name: "Kim",
  };

  return (
    <UserContext.Provider value={user}>
      <UserProfile />
    </UserContext.Provider>
  );
}
```

Context를 사용하면 중간 컴포넌트에서 Props를 반복적으로 전달하지 않아도 됩니다.

그러나 Context를 사용하더라도 데이터 흐름의 기본 원칙이 바뀌는 것은 아닙니다.

- Provider가 하위 트리에 데이터를 제공합니다.
- 하위 컴포넌트는 Context를 통해 제공된 데이터를 읽습니다.
- Context의 값이 변경되면 해당 Context를 사용하는 컴포넌트에 새로운 값이 전달됩니다.
- Context를 통해 State를 공유하더라도 State의 소유권과 변경 책임은 명확하게 설계해야 합니다.

Context는 여러 단계에 걸친 데이터 전달을 단순화하는 수단이지, 모든 Props 전달을 대체하거나 모든 State를 전역으로 관리하기 위한 도구는 아닙니다.

Context의 구체적인 사용법과 렌더링 영향은 별도의 Context 관련 문서에서 다룹니다.

## 9. 데이터 흐름 설계 원칙

단방향 데이터 흐름을 기반으로 컴포넌트를 설계할 때는 다음 원칙을 고려해야 합니다.

### 9.1. State 소유권을 명확하게 정의

각 State가 어느 컴포넌트에 속하는지 명확하게 정의해야 합니다.

여러 컴포넌트가 동일한 데이터를 사용한다면 공통 부모에 State를 배치하는 방식을 우선 고려합니다.

반면 특정 컴포넌트에서만 사용하는 State는 불필요하게 상위 컴포넌트로 이동하지 않는 것이 좋습니다.

State를 무조건 최상위 컴포넌트에 배치하면 관련 없는 컴포넌트까지 데이터 전달 구조에 포함될 수 있고, 상태 변경의 영향 범위가 불필요하게 커질 수 있습니다.

### 9.2. Props를 직접 변경하지 않기

Props는 부모 컴포넌트가 자식 컴포넌트에 전달하는 읽기 전용 데이터입니다.

자식 컴포넌트에서 Props를 직접 변경하는 방식은 React의 데이터 흐름과 맞지 않습니다.

```tsx
type UserProps = {
  name: string;
};

function UserProfile({ name }: UserProps) {
  // 잘못된 접근 방식
  // name = "Lee";

  return <p>{name}</p>;
}
```

값을 변경해야 한다면 부모가 제공한 Callback을 호출하거나, 해당 컴포넌트가 독립적으로 소유해야 하는 State를 사용해야 합니다.

### 9.3. 중복 State 최소화

동일한 데이터를 여러 컴포넌트에서 각각 State로 관리하면 데이터 불일치가 발생할 수 있습니다.

가능하면 하나의 State를 기준으로 여러 UI를 렌더링하도록 설계해야 합니다.

또한 기존 State에서 계산할 수 있는 값은 별도의 State로 중복 저장하지 않는 것이 좋습니다.

```tsx
function ShoppingCart() {
  const [items, setItems] = useState([
    { id: 1, price: 1000 },
    { id: 2, price: 2000 },
  ]);

  // 별도의 State로 저장할 필요가 없는 파생 데이터
  const totalPrice = items.reduce(
    (total, item) => total + item.price,
    0
  );

  return <p>Total: {totalPrice}</p>;
}
```

`totalPrice`는 `items`를 기반으로 계산할 수 있으므로 별도의 State로 관리할 필요가 없습니다.

중복 State를 줄이면 데이터 동기화 로직과 불필요한 업데이트를 방지할 수 있습니다.

### 9.4. State를 필요한 범위에 배치

State를 소유하는 컴포넌트는 해당 State의 변경에 따라 다시 렌더링될 수 있습니다.

따라서 모든 State를 최상위 컴포넌트에 배치하기보다는 실제로 데이터를 공유해야 하는 컴포넌트의 공통 부모에 배치하는 것이 좋습니다.

State의 범위를 적절하게 제한하면 컴포넌트 간 의존성을 줄이고 UI 업데이트 범위를 관리하기 쉬워집니다.

### 9.5. 컴포넌트의 역할 분리

컴포넌트는 데이터 소유, 데이터 표현, 사용자 입력 처리 등의 역할을 적절하게 분리할 수 있습니다.

예를 들어 다음과 같은 구조를 고려할 수 있습니다.

- **상위 컴포넌트:** State 소유 및 변경 로직 관리
- **하위 컴포넌트:** 전달받은 Props를 기반으로 UI 렌더링
- **입력 컴포넌트:** 사용자 입력을 처리하고 Callback 호출

다만 모든 컴포넌트를 이러한 역할로 엄격하게 분리해야 하는 것은 아닙니다. 컴포넌트의 규모와 재사용성, 데이터 공유 범위에 따라 적절하게 구성해야 합니다.

## 10. TypeScript와 단방향 데이터 흐름

TypeScript를 사용하면 컴포넌트 간 데이터 전달과 Callback의 타입을 명시적으로 정의할 수 있습니다.

특히 Props 타입을 통해 부모가 전달해야 하는 데이터와 자식이 호출할 수 있는 Callback의 계약을 명확하게 표현할 수 있습니다.

### 10.1. 데이터 Props 타입 정의

```tsx
type User = {
  id: number;
  name: string;
};

type UserProfileProps = {
  user: User;
};

function UserProfile({ user }: UserProfileProps) {
  return <p>{user.name}</p>;
}
```

`UserProfileProps`는 부모 컴포넌트가 전달해야 하는 데이터의 구조를 정의합니다.

### 10.2. Callback Props 타입 정의

Callback Props는 함수 시그니처를 사용하여 정의할 수 있습니다.

```tsx
type UserEditorProps = {
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
};

function UserEditor({
  name,
  onNameChange,
  onSave,
}: UserEditorProps) {
  return (
    <div>
      <input
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
      />

      <button onClick={onSave}>
        Save
      </button>
    </div>
  );
}
```

위 예제에서 각 Callback의 타입은 다음과 같습니다.

| Props | 타입 | 역할 |
|---|---|---|
| `onNameChange` | `(name: string) => void` | 변경된 이름 전달 |
| `onSave` | `() => void` | 저장 동작 요청 |

부모 컴포넌트는 해당 타입에 맞는 함수를 전달해야 합니다.

```tsx
function UserPage() {
  const [name, setName] = useState("Kim");

  const handleNameChange = (nextName: string) => {
    setName(nextName);
  };

  const handleSave = () => {
    console.log("Saved:", name);
  };

  return (
    <UserEditor
      name={name}
      onNameChange={handleNameChange}
      onSave={handleSave}
    />
  );
}
```

이처럼 TypeScript는 데이터 전달뿐만 아니라 자식 컴포넌트가 부모에 전달할 수 있는 변경 요청의 형태까지 명확하게 제한합니다.

## 11. 주의사항

### 11.1. 자식 컴포넌트에서 부모 State에 직접 접근하지 않기

자식 컴포넌트가 부모 컴포넌트의 내부 State를 직접 참조하거나 변경하는 구조는 React의 컴포넌트 독립성과 데이터 흐름을 해칠 수 있습니다.

필요한 데이터는 Props로 전달하고, 변경이 필요하다면 Callback을 사용해야 합니다.

### 11.2. 모든 State를 상위 컴포넌트로 끌어올리지 않기

State 끌어올리기는 여러 컴포넌트가 동일한 데이터를 공유해야 할 때 사용하는 설계 방법입니다.

단순히 State를 상위 컴포넌트에 배치한다고 해서 항상 좋은 구조가 되는 것은 아닙니다.

공유가 필요하지 않은 State까지 상위로 이동하면 Props 전달이 복잡해지고 컴포넌트 간 의존성이 증가할 수 있습니다.

### 11.3. Props 변경과 State 변경 구분하기

Props는 부모 컴포넌트가 전달하는 값이며, 자식 컴포넌트에서 직접 변경할 수 없습니다.

반면 State는 해당 State를 소유한 컴포넌트가 변경할 수 있습니다.

자식 컴포넌트에서 Props로 전달받은 데이터를 변경해야 한다면 부모가 제공한 Callback을 통해 변경을 요청해야 합니다.

### 11.4. Callback 호출과 State 갱신 구분하기

자식 컴포넌트가 Callback을 호출했다고 해서 반드시 State가 변경되는 것은 아닙니다.

Callback은 부모가 정의한 함수이므로 실제 동작은 부모의 구현에 따라 결정됩니다.

따라서 Callback 호출은 변경 요청 또는 이벤트 전달로 이해하는 것이 정확합니다.

### 11.5. Context를 무조건 사용하지 않기

Props 전달이 여러 단계에 걸쳐 있다는 이유만으로 Context를 도입할 필요는 없습니다.

데이터의 공유 범위와 변경 빈도, 컴포넌트 구조를 고려하여 Props 전달과 Context 중 적절한 방식을 선택해야 합니다.

## 12. 핵심 정리

- React는 부모에서 자식으로 데이터가 전달되는 단방향 데이터 흐름을 기본으로 사용합니다.
- 부모 컴포넌트는 Props를 통해 자식 컴포넌트에 데이터를 전달합니다.
- 자식 컴포넌트는 Callback을 호출하여 부모에 이벤트나 변경 의도를 전달합니다.
- State는 해당 데이터를 소유하는 컴포넌트에서 관리하는 것이 기본 원칙입니다.
- 여러 컴포넌트가 동일한 State를 공유해야 한다면 공통 부모로 State를 끌어올립니다.
- 형제 컴포넌트 간 데이터 공유는 공통 부모의 State와 Props를 통해 구현할 수 있습니다.
- Controlled Component는 React State를 기준으로 입력 요소의 값을 제어합니다.
- Context는 여러 단계의 Props 전달을 단순화할 수 있지만, 단방향 데이터 흐름의 원칙을 대체하지 않습니다.
- 중복 State를 최소화하고 필요한 범위에 State를 배치하면 데이터 일관성과 컴포넌트 구조를 유지하기 쉽습니다.
- TypeScript의 Props 및 Callback 타입을 활용하면 컴포넌트 간 데이터 전달 계약을 명확하게 정의할 수 있습니다.

## 13. 참고 자료

### React 공식 문서

- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) - 컴포넌트 간 State 공유와 State 끌어올리기
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) - Props 전달 및 컴포넌트 간 데이터 공유
- [Thinking in React](https://react.dev/learn/thinking-in-react) - React 애플리케이션의 컴포넌트 구조와 State 설계
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) - State 구조 설계와 중복 State 방지
- [Responding to Events](https://react.dev/learn/responding-to-events) - 이벤트 핸들러와 Callback을 통한 이벤트 처리
- [Managing State](https://react.dev/learn/managing-state) - React State 관리 방식
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) - Context를 통한 깊은 컴포넌트 트리의 데이터 전달
- [Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state) - State 기반 입력 처리
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) - 파생 데이터와 불필요한 Effect 방지

### TypeScript 공식 문서

- [TypeScript Handbook - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) - JSX와 TypeScript 타입 정의
- [TypeScript Handbook - Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) - 함수 및 Callback 타입 정의