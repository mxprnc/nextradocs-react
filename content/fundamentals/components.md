# Components

## 1. 개요

React Component는 사용자 인터페이스(UI)를 구성하는 독립적이고 재사용 가능한 단위입니다.

컴포넌트는 화면의 특정 영역을 표현하며, 필요에 따라 다른 컴포넌트를 조합하여 복잡한 UI를 구성할 수 있습니다.

React 애플리케이션은 일반적으로 여러 컴포넌트가 계층적으로 결합된 구조로 구성됩니다. 각 컴포넌트는 자신의 역할에 맞는 UI를 정의하고, 다른 컴포넌트와 데이터를 주고받으며 전체 애플리케이션을 구성합니다.

다음은 간단한 React 컴포넌트의 예제입니다.

```tsx
function Welcome() {
  return <h1>Hello, React!</h1>;
}
```

`Welcome`은 React 컴포넌트입니다. JSX를 반환하여 화면에 표시할 UI를 선언합니다.

다른 컴포넌트에서는 다음과 같이 사용할 수 있습니다.

```tsx
function App() {
  return (
    <main>
      <Welcome />
      <Welcome />
    </main>
  );
}
```

하나의 컴포넌트를 여러 위치에서 재사용할 수 있으며, 이러한 특성을 통해 UI의 중복을 줄이고 유지보수성을 높일 수 있습니다.

## 2. 컴포넌트의 기본 구조

React 컴포넌트는 일반적으로 JavaScript 또는 TypeScript 함수로 정의합니다.

함수 컴포넌트는 JSX, React Element 또는 다른 유효한 React 노드 등을 반환하여 UI를 표현합니다.

```tsx
function Greeting() {
  const message = 'Welcome to React';

  return (
    <section>
      <h1>{message}</h1>
    </section>
  );
}
```

컴포넌트는 다음과 같은 요소로 구성됩니다.

| 구성 요소 | 설명 |
|---|---|
| 컴포넌트 이름 | 컴포넌트를 식별하는 이름입니다. |
| 입력 데이터 | Props 등을 통해 외부에서 전달되는 데이터입니다. |
| 내부 로직 | UI 표현에 필요한 계산 및 데이터 처리 로직입니다. |
| 반환값 | 화면에 표시할 React Element 또는 React Node입니다. |

컴포넌트는 입력 데이터를 기반으로 UI를 결정합니다. 입력 데이터가 변경되면 React는 해당 컴포넌트를 다시 렌더링하여 UI를 갱신할 수 있습니다.

## 3. 함수 컴포넌트 (Function Components)

함수 컴포넌트는 JavaScript 또는 TypeScript 함수로 정의하는 React 컴포넌트입니다.

현재 React에서는 함수 컴포넌트가 일반적인 컴포넌트 작성 방식으로 사용됩니다.

```tsx
function UserProfile() {
  return (
    <div>
      <h2>User Profile</h2>
      <p>User information</p>
    </div>
  );
}
```

함수 컴포넌트는 일반 함수와 유사한 형태를 가지지만 React의 렌더링 시스템에서 컴포넌트로 인식되고 관리된다는 차이가 있습니다.

### 3.1. 함수 컴포넌트의 특징

함수 컴포넌트는 다음과 같은 특징을 가집니다.

- JavaScript 또는 TypeScript 함수로 정의합니다.
- 컴포넌트 이름은 대문자로 시작해야 합니다.
- Props를 매개변수로 전달받을 수 있습니다.
- JSX 또는 React Node를 반환할 수 있습니다.
- Hooks를 사용하여 State 및 Effect 등의 React 기능을 활용할 수 있습니다.
- 다른 컴포넌트를 내부에서 조합할 수 있습니다.

### 3.2. Props를 사용하는 함수 컴포넌트

Props는 부모 컴포넌트가 자식 컴포넌트에 전달하는 데이터입니다.

TypeScript에서는 Props의 타입을 정의하여 컴포넌트의 입력 데이터에 대한 정적 타입 검사를 수행할 수 있습니다.

```tsx
type UserProfileProps = {
  name: string;
  age: number;
};

function UserProfile({ name, age }: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

function App() {
  return (
    <UserProfile
      name="Alice"
      age={25}
    />
  );
}
```

`UserProfile`은 `name`과 `age`를 입력받아 사용자 정보를 표현합니다.

Props의 상세한 전달 방식과 타입 설계는 `props.md` 및 `react-typescript/typing-props.md`에서 다룹니다.

## 4. 클래스 컴포넌트 (Class Components)

클래스 컴포넌트는 ES6 Class를 사용하여 정의하는 React 컴포넌트입니다.

함수 컴포넌트가 일반적인 개발 방식으로 자리 잡기 이전에는 State 및 Lifecycle을 관리하기 위해 널리 사용되었습니다.

```tsx
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, React!</h1>;
  }
}
```

클래스 컴포넌트는 `React.Component`를 상속하며, `render()` 메서드를 통해 UI를 반환합니다.

### 4.1. 클래스 컴포넌트의 특징

- ES6 Class를 기반으로 정의합니다.
- `React.Component` 또는 `React.PureComponent`를 상속합니다.
- `render()` 메서드를 구현하여 UI를 반환합니다.
- `this.props`를 통해 전달된 Props에 접근합니다.
- `this.state`와 `setState()`를 사용하여 State를 관리합니다.
- Lifecycle 메서드를 통해 특정 시점의 작업을 처리합니다.

예제:

```tsx
import { Component } from 'react';

type CounterProps = {
  initialCount: number;
};

type CounterState = {
  count: number;
};

class Counter extends Component<CounterProps, CounterState> {
  state: CounterState = {
    count: this.props.initialCount,
  };

  handleIncrement = () => {
    this.setState((previousState) => ({
      count: previousState.count + 1,
    }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.handleIncrement}>
          Increment
        </button>
      </div>
    );
  }
}
```

위 예제에서는 `Component<CounterProps, CounterState>` 형태로 Props와 State의 타입을 지정합니다.

### 4.2. 함수 컴포넌트와 클래스 컴포넌트 비교

| 구분 | 함수 컴포넌트 | 클래스 컴포넌트 |
|---|---|---|
| 정의 방식 | JavaScript 함수 | ES6 Class |
| UI 반환 | 함수의 반환값 | `render()` 메서드 |
| Props 접근 | 함수 매개변수 | `this.props` |
| State 관리 | Hooks | `this.state`, `setState()` |
| Effect 및 Lifecycle | Hooks | Lifecycle 메서드 |
| 코드 구조 | 상대적으로 간결함 | 클래스 및 메서드 구조 |
| 현재 사용 방식 | 일반적으로 권장 | 기존 코드 유지보수 등에 활용 |

새로운 React 컴포넌트는 일반적으로 함수 컴포넌트로 작성하는 것이 권장됩니다.

다만 클래스 컴포넌트는 기존 React 애플리케이션에서 여전히 사용되며, Error Boundary와 같은 일부 기능에서는 현재도 클래스 컴포넌트가 활용됩니다.

## 5. 컴포넌트의 계층 구조 (Component Hierarchy)

React 애플리케이션은 여러 컴포넌트가 부모와 자식 관계를 형성하는 계층 구조로 구성됩니다.

일반적으로 최상위 컴포넌트에서 시작하여 하위 컴포넌트를 조합하는 방식으로 UI를 구성합니다.

```tsx
function Header() {
  return <header>Application Header</header>;
}

function Sidebar() {
  return <aside>Navigation Menu</aside>;
}

function Content() {
  return <section>Main Content</section>;
}

function App() {
  return (
    <div>
      <Header />

      <div className="layout">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
```

위 구조는 다음과 같은 계층 관계를 가집니다.

```text
App
├── Header
└── div.layout
    ├── Sidebar
    └── Content
```

컴포넌트의 계층 구조는 다음과 같은 장점을 제공합니다.

- UI를 기능별로 분리할 수 있습니다.
- 개별 컴포넌트를 독립적으로 개발하고 수정할 수 있습니다.
- 동일한 컴포넌트를 여러 위치에서 재사용할 수 있습니다.
- 데이터 전달 및 상태 관리의 범위를 명확하게 설계할 수 있습니다.
- 복잡한 UI를 작은 단위로 분해하여 관리할 수 있습니다.

컴포넌트 계층 구조는 단순히 화면의 DOM 구조를 나누는 것에 그치지 않습니다. 애플리케이션의 기능적 책임과 데이터 흐름을 설계하는 데에도 중요한 역할을 합니다.

## 6. 컴포넌트 합성 (Component Composition)

컴포넌트 합성은 여러 컴포넌트를 조합하여 더 큰 기능 단위의 컴포넌트를 구성하는 방식입니다.

React는 상속보다는 컴포넌트 합성을 통해 UI를 재사용하고 확장하는 방식을 권장합니다.

### 6.1. 기본적인 컴포넌트 합성

```tsx
function Avatar() {
  return (
    <img
      src="/images/avatar.png"
      alt="User avatar"
    />
  );
}

function UserInfo() {
  return (
    <div>
      <h2>Alice</h2>
      <p>Software Engineer</p>
    </div>
  );
}

function UserCard() {
  return (
    <article>
      <Avatar />
      <UserInfo />
    </article>
  );
}
```

`UserCard`는 `Avatar`와 `UserInfo`를 조합하여 하나의 사용자 카드 UI를 구성합니다.

각 컴포넌트는 자신의 역할에 집중하며, 상위 컴포넌트는 이들을 조합하여 더 큰 UI를 표현합니다.

### 6.2. Children을 활용한 합성

`children`은 컴포넌트의 여는 태그와 닫는 태그 사이에 작성된 자식 요소를 전달받는 데 사용하는 특수한 Props입니다.

```tsx
import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

function App() {
  return (
    <Card>
      <h2>User Profile</h2>
      <p>User information</p>
    </Card>
  );
}
```

`Card`는 내부 콘텐츠의 구체적인 구조를 알 필요 없이 전달받은 `children`을 자신의 UI에 배치합니다.

이러한 방식은 컴포넌트의 재사용성과 확장성을 높이는 데 유용합니다.

### 6.3. 특수화된 컴포넌트 구성

공통적인 UI 구조를 가진 컴포넌트에 Props를 전달하여 서로 다른 용도로 사용할 수 있습니다.

```tsx
import type { ReactNode } from 'react';

type DialogProps = {
  title: string;
  children: ReactNode;
};

function Dialog({ title, children }: DialogProps) {
  return (
    <section className="dialog">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function AlertDialog() {
  return (
    <Dialog title="Warning">
      <p>Are you sure you want to continue?</p>
    </Dialog>
  );
}

function ConfirmDialog() {
  return (
    <Dialog title="Confirmation">
      <p>Your changes have been saved.</p>
    </Dialog>
  );
}
```

`Dialog`는 공통 레이아웃을 담당하며, `AlertDialog`와 `ConfirmDialog`는 각각 필요한 콘텐츠를 전달합니다.

이처럼 공통적인 구조를 추출하고 구체적인 콘텐츠를 조합하는 방식은 React 컴포넌트 설계에서 자주 사용됩니다.

## 7. 컴포넌트의 재사용성 (Reusability)

컴포넌트는 동일한 UI 구조나 기능을 여러 위치에서 재사용할 수 있도록 설계할 수 있습니다.

일반적으로 재사용 가능한 컴포넌트는 특정 데이터나 사용 사례에 지나치게 종속되지 않도록 구성합니다.

### 7.1. 재사용 가능한 컴포넌트

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

function Button({
  label,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

위 `Button` 컴포넌트는 특정 화면이나 비즈니스 로직에 종속되지 않고, 다양한 위치에서 재사용할 수 있습니다.

```tsx
function App() {
  return (
    <div>
      <Button
        label="Save"
        onClick={() => console.log('Saved')}
      />

      <Button
        label="Delete"
        disabled
        onClick={() => console.log('Deleted')}
      />
    </div>
  );
}
```

### 7.2. 재사용 가능한 컴포넌트 설계 원칙

재사용 가능한 컴포넌트를 설계할 때는 다음 사항을 고려해야 합니다.

- 명확한 책임: 하나의 컴포넌트는 명확한 역할을 담당하도록 구성합니다.
- 적절한 추상화: 실제로 필요한 수준까지만 공통 기능을 추출합니다.
- 유연한 입력: Props를 통해 콘텐츠와 동작을 외부에서 전달할 수 있도록 구성합니다.
- 낮은 결합도: 특정 컴포넌트나 비즈니스 로직에 과도하게 의존하지 않도록 설계합니다.
- 높은 응집도: 관련된 UI와 로직을 하나의 기능 단위로 관리합니다.

재사용성을 높이기 위해 모든 컴포넌트를 범용적으로 설계할 필요는 없습니다. 지나치게 많은 Props와 조건 분기를 가진 컴포넌트는 오히려 이해하기 어렵고 유지보수가 복잡해질 수 있습니다.

## 8. 컴포넌트와 렌더링

React는 컴포넌트를 호출하고 반환된 React Element를 기반으로 UI를 구성합니다.

컴포넌트의 렌더링은 일반적인 함수 호출과 유사하게 보일 수 있지만, React가 렌더링 과정을 관리한다는 점에서 차이가 있습니다.

### 8.1. 컴포넌트 호출 방식

다음과 같이 JSX를 사용하여 컴포넌트를 표현합니다.

```tsx
function Greeting() {
  return <h1>Hello, React!</h1>;
}

function App() {
  return <Greeting />;
}
```

`<Greeting />`은 JSX를 통해 `Greeting` 컴포넌트를 표현하는 방식입니다.

다음과 같이 일반 함수처럼 직접 호출하는 방식은 일반적인 React 컴포넌트 사용 방식이 아닙니다.

```tsx
function App() {
  return Greeting();
}
```

React는 JSX를 통해 표현된 컴포넌트를 렌더링 트리의 구성 요소로 인식하고 관리합니다.

컴포넌트를 일반 함수처럼 직접 호출하면 React가 컴포넌트의 독립적인 렌더링 경계를 관리할 수 없으며, Hooks의 호출 순서와 관련된 규칙을 위반할 수 있습니다.

따라서 다른 컴포넌트 내부에서 컴포넌트를 사용할 때는 JSX 형태로 작성해야 합니다.

### 8.2. 렌더링과 컴포넌트 함수의 실행

React는 초기 렌더링이나 State 및 Props 등의 변경으로 인해 업데이트가 필요할 때 컴포넌트 함수를 호출하여 새로운 UI를 계산합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

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

위 예제에서 `setCount`가 호출되면 React는 해당 컴포넌트의 업데이트를 예약합니다.

이후 React는 컴포넌트를 다시 렌더링하여 새로운 UI를 계산하고, 필요한 변경 사항을 실제 DOM에 반영합니다.

컴포넌트 함수가 다시 실행된다고 해서 항상 실제 DOM이 변경되는 것은 아닙니다.

React는 이전 렌더링 결과와 새로운 렌더링 결과를 비교하여 필요한 변경 사항을 결정합니다.

렌더링 과정과 DOM 업데이트에 대한 자세한 내용은 `rendering/render-and-commit.md`에서 다룹니다.

## 9. 컴포넌트 설계 원칙

컴포넌트를 효과적으로 설계하려면 기능의 책임, 데이터 흐름, 재사용 범위 등을 함께 고려해야 합니다.

### 9.1. 단일 책임 원칙

컴포넌트는 가능한 한 명확한 하나의 책임을 가지도록 설계하는 것이 좋습니다.

다음과 같이 사용자 정보 표시, 데이터 조회, 폼 처리 및 여러 UI 영역을 하나의 컴포넌트에 모두 포함하면 코드가 복잡해질 수 있습니다.

```tsx
function UserManagement() {
  // 사용자 조회
  // 사용자 수정
  // 사용자 삭제
  // 폼 검증
  // 사용자 목록 렌더링
  // 사용자 상세 정보 렌더링

  return <div>User Management</div>;
}
```

기능을 적절한 컴포넌트로 분리하면 각 영역의 역할을 명확하게 할 수 있습니다.

```tsx
function UserManagement() {
  return (
    <main>
      <UserForm />
      <UserList />
    </main>
  );
}

function UserForm() {
  return <form>User Form</form>;
}

function UserList() {
  return <section>User List</section>;
}
```

단, 컴포넌트를 지나치게 잘게 분리하면 오히려 구조가 복잡해질 수 있으므로 적절한 추상화 수준을 유지해야 합니다.

### 9.2. 순수 함수로서의 컴포넌트

React 컴포넌트는 동일한 입력에 대해 동일한 결과를 반환하도록 작성하는 것이 권장됩니다.

React에서는 이를 컴포넌트의 순수성(Purity) 원칙과 연결하여 설명합니다.

순수한 컴포넌트는 다음과 같은 특징을 가집니다.

- 동일한 Props와 State에 대해 동일한 JSX를 반환합니다.
- 렌더링 과정에서 외부 데이터를 직접 변경하지 않습니다.
- 렌더링 과정에서 예상하지 못한 부수 효과를 발생시키지 않습니다.
- 입력으로 전달된 객체나 배열을 직접 수정하지 않습니다.

예를 들어 다음과 같은 코드는 렌더링 과정에서 외부 변수를 변경하므로 순수하지 않습니다.

```tsx
let visitorCount = 0;

function Visitor() {
  visitorCount += 1;

  return <p>Visitors: {visitorCount}</p>;
}
```

React는 개발 환경에서 컴포넌트의 순수성을 확인하기 위해 렌더링 함수를 추가로 호출할 수 있습니다.

따라서 렌더링 과정에서 외부 상태를 변경하는 코드는 예상하지 못한 결과를 발생시킬 수 있습니다.

렌더링 과정에서는 UI 계산에 집중하고, 부수 효과는 이벤트 핸들러나 Effect 등 적절한 위치에서 처리해야 합니다.

### 9.3. 컴포넌트 내부에서 컴포넌트 정의 금지

컴포넌트 내부에서 다른 컴포넌트를 정의하는 방식은 일반적으로 피하는 것이 좋습니다.

```tsx
function Parent() {
  function Child() {
    return <p>Child Component</p>;
  }

  return (
    <div>
      <Child />
    </div>
  );
}
```

위 코드는 `Parent`가 다시 렌더링될 때마다 새로운 `Child` 함수가 생성됩니다.

React는 컴포넌트의 타입과 위치 등을 기반으로 렌더링 트리의 요소를 식별합니다. 부모 컴포넌트가 렌더링될 때마다 새로운 컴포넌트 타입이 생성되면 기존 하위 컴포넌트가 새로운 컴포넌트로 인식될 수 있습니다.

이 경우 하위 컴포넌트의 State가 초기화되거나 DOM이 불필요하게 교체될 수 있습니다.

다음과 같이 컴포넌트를 외부에 정의하는 방식이 적절합니다.

```tsx
function Child() {
  return <p>Child Component</p>;
}

function Parent() {
  return (
    <div>
      <Child />
    </div>
  );
}
```

### 9.4. 컴포넌트의 파일 분리

애플리케이션 규모가 커지면 컴포넌트별로 파일을 분리하여 관리할 수 있습니다.

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.css
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.css
│   └── UserCard/
│       ├── UserCard.tsx
│       └── UserCard.css
├── pages/
│   └── Home.tsx
└── App.tsx
```

컴포넌트의 파일 구조는 프로젝트 규모와 팀의 개발 규칙에 따라 달라질 수 있습니다.

모든 컴포넌트를 무조건 별도 디렉터리로 분리할 필요는 없으며, 컴포넌트의 복잡도와 관련 파일의 수를 고려하여 적절한 구조를 선택해야 합니다.

## 10. 컴포넌트와 TypeScript

TypeScript를 사용하면 컴포넌트의 Props와 반환값 등에 대한 타입 정보를 명시할 수 있습니다.

이를 통해 컴포넌트의 입력 데이터에 대한 안정성을 높이고 잘못된 사용을 컴파일 단계에서 발견할 수 있습니다.

### 10.1. Props 타입 정의

```tsx
type UserProps = {
  name: string;
  age: number;
};

function User({ name, age }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}
```

Props 타입을 정의하면 컴포넌트를 사용하는 위치에서 전달해야 하는 데이터의 구조를 검사할 수 있습니다.

### 10.2. 컴포넌트 반환 타입

React 함수 컴포넌트의 반환 타입은 일반적으로 TypeScript와 React 타입 정의를 통해 추론할 수 있습니다.

필요한 경우 `React.JSX.Element` 등의 타입을 명시할 수 있습니다.

```tsx
function Greeting(): React.JSX.Element {
  return <h1>Hello, React!</h1>;
}
```

다만 컴포넌트가 문자열, 숫자, `null` 등 다양한 React Node를 반환할 수 있는 상황에서는 `React.JSX.Element`가 반환 타입의 범위를 지나치게 제한할 수 있습니다.

따라서 특별한 이유가 없다면 TypeScript의 반환 타입 추론을 활용하는 것이 일반적입니다.

### 10.3. React.FC

React에서는 `React.FC` 또는 `React.FunctionComponent` 타입을 사용하여 함수 컴포넌트를 정의할 수도 있습니다.

```tsx
import type { FC } from 'react';

type GreetingProps = {
  name: string;
};

const Greeting: FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
```

`React.FC`는 함수 컴포넌트의 타입을 표현하는 방법 중 하나입니다.

다만 일반적인 함수 선언 방식으로도 Props 타입을 명확하게 지정할 수 있으므로 반드시 사용해야 하는 것은 아닙니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}
```

최근 React + TypeScript 프로젝트에서는 별도의 이유가 없다면 일반 함수 선언 방식도 널리 사용됩니다.

## 11. 핵심 정리

React 컴포넌트는 UI를 독립적인 단위로 분리하고 조합하여 애플리케이션을 구성하는 핵심 요소입니다.

주요 특징은 다음과 같습니다.

1. 컴포넌트는 UI를 구성하는 독립적이고 재사용 가능한 단위입니다.
2. 현재 React에서는 함수 컴포넌트가 일반적인 작성 방식입니다.
3. 컴포넌트는 Props를 통해 외부 데이터를 전달받을 수 있습니다.
4. 여러 컴포넌트를 계층적으로 조합하여 복잡한 UI를 구성할 수 있습니다.
5. 컴포넌트 합성을 통해 공통 UI 구조와 기능을 재사용할 수 있습니다.
6. React는 JSX로 표현된 컴포넌트를 렌더링 트리의 구성 요소로 관리합니다.
7. 컴포넌트는 동일한 입력에 대해 일관된 UI를 반환하도록 설계하는 것이 좋습니다.
8. 렌더링 과정에서는 외부 상태 변경 등의 부수 효과를 발생시키지 않아야 합니다.
9. 컴포넌트의 책임과 재사용 범위를 고려하여 적절한 단위로 분리해야 합니다.
10. TypeScript를 활용하면 컴포넌트의 입력 데이터와 구조를 정적으로 검사할 수 있습니다.

## 12. 참고 자료

### React 공식 문서

- [Your First Component](https://react.dev/learn/your-first-component) - React 컴포넌트의 기본 개념과 작성 방법
- [Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components) - 컴포넌트의 모듈 분리 및 가져오기와 내보내기
- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) - JSX를 사용한 UI 표현
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces) - JSX 내부에서 JavaScript 표현식 사용
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) - 컴포넌트 간 Props 전달
- [Passing JSX as Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) - Children을 활용한 컴포넌트 합성
- [Thinking in React](https://react.dev/learn/thinking-in-react) - UI를 컴포넌트 계층 구조로 분해하고 설계하는 방법
- [React Calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks) - React가 컴포넌트와 Hooks를 호출하고 관리하는 방식
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure) - 컴포넌트의 순수성과 렌더링 규칙
- [Component](https://react.dev/reference/react/Component) - 클래스 컴포넌트의 API와 Lifecycle

### TypeScript 공식 문서

- [Using TypeScript with React](https://react.dev/learn/typescript) - React와 TypeScript를 함께 사용하는 방법
- [TypeScript JSX Handbook](https://www.typescriptlang.org/docs/handbook/jsx.html) - TypeScript의 JSX 지원 및 타입 검사