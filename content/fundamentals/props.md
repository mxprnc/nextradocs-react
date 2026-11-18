# Props

## 1. 개요

Props(Properties)는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하기 위해 사용하는 입력 값입니다.

React 컴포넌트는 Props를 통해 외부에서 전달받은 데이터를 기반으로 UI를 구성할 수 있습니다. 이를 통해 컴포넌트의 재사용성을 높이고 컴포넌트 간 데이터 전달 구조를 명확하게 유지할 수 있습니다.

다음은 Props를 사용하는 기본적인 예제입니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  return <Greeting name="Alice" />;
}
```

위 예제에서 `App`은 부모 컴포넌트이고 `Greeting`은 자식 컴포넌트입니다.

`App`에서 `name="Alice"`를 전달하면 `Greeting`은 Props를 통해 해당 값을 전달받아 UI를 구성합니다.

Props의 주요 특징은 다음과 같습니다.

- 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달합니다.
- 문자열, 숫자, Boolean, 객체, 배열, 함수 및 React Element 등을 전달할 수 있습니다.
- 컴포넌트의 외부 입력을 정의하는 역할을 합니다.
- 전달받은 Props는 읽기 전용으로 취급해야 합니다.
- Props가 변경되면 React는 해당 컴포넌트의 업데이트를 수행할 수 있습니다.

## 2. Props 전달 방식

Props는 JSX에서 컴포넌트를 사용하는 위치에 속성 형태로 작성하여 전달합니다.

### 2.1. 기본적인 Props 전달

```tsx
type UserProps = {
  name: string;
  age: number;
};

function User({ name, age }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

function App() {
  return (
    <User
      name="Alice"
      age={25}
    />
  );
}
```

JSX에서 지정한 속성은 컴포넌트의 Props 객체에 포함되어 전달됩니다.

위 예제에서 `User` 컴포넌트는 다음과 같은 형태의 Props를 전달받습니다.

```tsx
{
  name: 'Alice',
  age: 25,
}
```

컴포넌트는 전달받은 Props를 사용하여 화면에 표시할 내용을 결정합니다.

### 2.2. 여러 종류의 데이터 전달

Props에는 다양한 JavaScript 값을 전달할 수 있습니다.

```tsx
type UserProps = {
  name: string;
  age: number;
  isAdmin: boolean;
  tags: string[];
  profile: {
    email: string;
    department: string;
  };
};

function User({
  name,
  age,
  isAdmin,
  tags,
  profile,
}: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Admin: {isAdmin ? 'Yes' : 'No'}</p>
      <p>Tags: {tags.join(', ')}</p>
      <p>Email: {profile.email}</p>
      <p>Department: {profile.department}</p>
    </div>
  );
}

function App() {
  return (
    <User
      name="Alice"
      age={25}
      isAdmin
      tags={['React', 'TypeScript']}
      profile={{
        email: 'alice@example.com',
        department: 'Engineering',
      }}
    />
  );
}
```

JSX에서 문자열은 따옴표로 전달할 수 있으며, 그 외의 JavaScript 표현식은 중괄호를 사용하여 전달합니다.

| 데이터 유형 | 전달 예제 |
|---|---|
| String | `name="Alice"` |
| Number | `age={25}` |
| Boolean | `isAdmin={true}` |
| Array | `tags={['React', 'TypeScript']}` |
| Object | `profile={{ email: 'alice@example.com' }}` |
| Function | `onClick={handleClick}` |
| React Element | `icon={<UserIcon />}` |

## 3. Props 접근 방식

Props는 함수 컴포넌트의 첫 번째 매개변수로 전달됩니다.

Props 객체 전체를 전달받거나 구조 분해 할당을 사용하여 필요한 값만 추출할 수 있습니다.

### 3.1. Props 객체 사용

```tsx
type UserProps = {
  name: string;
  age: number;
};

function User(props: UserProps) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
    </div>
  );
}
```

`props` 객체를 통해 전달된 각 속성에 접근할 수 있습니다.

### 3.2. 구조 분해 할당 (Destructuring)

JavaScript의 구조 분해 할당을 사용하면 Props 객체에서 필요한 속성을 직접 추출할 수 있습니다.

```tsx
type UserProps = {
  name: string;
  age: number;
};

function User({ name, age }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}
```

구조 분해 할당은 컴포넌트 내부에서 반복적으로 `props.`를 작성하지 않아도 되므로 일반적으로 널리 사용됩니다.

다음 두 방식은 동일한 Props 데이터를 사용합니다.

```tsx
function User(props: UserProps) {
  return <h2>{props.name}</h2>;
}
```

```tsx
function User({ name }: UserProps) {
  return <h2>{name}</h2>;
}
```

## 4. 기본값 (Default Props)

Props가 전달되지 않았을 때 사용할 기본값을 지정할 수 있습니다.

함수 컴포넌트에서는 구조 분해 할당의 기본값 문법을 사용하는 것이 일반적입니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
};

function Button({
  label,
  disabled = false,
}: ButtonProps) {
  return (
    <button disabled={disabled}>
      {label}
    </button>
  );
}
```

`disabled`가 전달되지 않으면 기본값인 `false`가 사용됩니다.

```tsx
function App() {
  return (
    <div>
      <Button label="Submit" />
      <Button label="Cancel" disabled={true} />
    </div>
  );
}
```

기본값은 해당 Props의 값이 `undefined`일 때 적용됩니다.

따라서 다음과 같은 차이가 있습니다.

| 전달 값 | 기본값 적용 여부 |
|---|---|
| Props 생략 | 적용 |
| `undefined` | 적용 |
| `null` | 적용되지 않음 |
| `false` | 적용되지 않음 |
| `0` | 적용되지 않음 |
| 빈 문자열 `''` | 적용되지 않음 |

기본값은 컴포넌트가 반드시 필요로 하지 않는 선택적 Props를 처리할 때 유용합니다.

### 4.1. 선택적 Props

TypeScript에서는 `?`를 사용하여 선택적 Props를 정의할 수 있습니다.

```tsx
type ProfileProps = {
  name: string;
  description?: string;
};

function Profile({
  name,
  description = 'No description available.',
}: ProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
}
```

선택적 Props는 전달하지 않아도 되지만, 기본값을 지정하지 않은 경우 해당 값이 `undefined`일 수 있다는 점을 고려해야 합니다.

## 5. Props의 불변성 (Immutability)

Props는 부모 컴포넌트에서 전달받은 입력 데이터이므로 자식 컴포넌트에서 직접 변경해서는 안 됩니다.

React는 Props를 읽기 전용으로 취급하며, 컴포넌트는 전달받은 값을 기반으로 UI를 계산해야 합니다.

다음은 Props를 직접 변경하는 잘못된 예제입니다.

```tsx
type UserProps = {
  name: string;
};

function User(props: UserProps) {
  props.name = 'Bob';

  return <h2>{props.name}</h2>;
}
```

위 코드는 전달받은 Props를 직접 변경하므로 React의 컴포넌트 설계 원칙에 위배됩니다.

올바른 방식은 Props를 변경하지 않고 필요한 값을 별도로 계산하는 것입니다.

```tsx
type UserProps = {
  name: string;
};

function User({ name }: UserProps) {
  const displayName = name.toUpperCase();

  return <h2>{displayName}</h2>;
}
```

### 5.1. 객체와 배열 Props의 불변성

Props에 객체나 배열이 포함된 경우에도 내부 데이터를 직접 변경해서는 안 됩니다.

```tsx
type UserProps = {
  user: {
    name: string;
    age: number;
  };
};

function User({ user }: UserProps) {
  // 잘못된 방식
  user.age = 30;

  return <p>{user.age}</p>;
}
```

객체의 참조가 동일하더라도 내부 속성은 변경될 수 있으므로 객체와 배열의 중첩된 데이터까지 불변성을 유지해야 합니다.

새로운 객체를 생성하여 값을 계산하는 방식이 적절합니다.

```tsx
type UserProps = {
  user: {
    name: string;
    age: number;
  };
};

function User({ user }: UserProps) {
  const updatedUser = {
    ...user,
    age: 30,
  };

  return <p>{updatedUser.age}</p>;
}
```

단, 위 예제의 `updatedUser`는 컴포넌트 내부에서 계산한 새로운 객체이며 부모 컴포넌트의 원본 데이터를 변경하지 않습니다.

Props를 직접 변경하지 않는 원칙은 컴포넌트의 순수성을 유지하고 데이터 흐름을 예측 가능하게 만드는 데 중요합니다.

## 6. Props와 Children

`children`은 JSX에서 컴포넌트의 시작 태그와 종료 태그 사이에 작성한 내용을 전달받는 특수한 Props입니다.

이를 활용하면 컴포넌트 내부에 표시할 콘텐츠를 외부에서 전달할 수 있습니다.

### 6.1. 기본적인 Children 사용

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

`Card` 컴포넌트는 내부 콘텐츠를 직접 정의하지 않고 `children`을 통해 전달받습니다.

이러한 구조를 사용하면 동일한 레이아웃을 다양한 콘텐츠에 재사용할 수 있습니다.

### 6.2. Children의 타입

TypeScript에서는 일반적으로 `ReactNode`를 사용하여 Children의 타입을 정의합니다.

`ReactNode`는 React가 렌더링할 수 있는 다양한 유형의 값을 포괄하는 타입입니다.

대표적으로 다음과 같은 값이 포함됩니다.

- React Element
- 문자열
- 숫자
- `null`
- `undefined`
- Boolean
- 다른 React Node의 배열

```tsx
import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <main>
      {children}
    </main>
  );
}
```

Children의 구체적인 타입과 사용 패턴은 `react-typescript/typing-children.md`에서 다룹니다.

## 7. Props를 활용한 컴포넌트 합성

Props를 사용하면 단순한 데이터뿐만 아니라 다른 컴포넌트나 React Element를 전달할 수 있습니다.

이러한 방식은 컴포넌트 간 결합도를 낮추고 UI 구성의 유연성을 높이는 데 활용됩니다.

### 7.1. React Element 전달

```tsx
import type { ReactNode } from 'react';

type LayoutProps = {
  header: ReactNode;
  content: ReactNode;
};

function Layout({ header, content }: LayoutProps) {
  return (
    <div>
      <header>{header}</header>
      <main>{content}</main>
    </div>
  );
}

function App() {
  return (
    <Layout
      header={<h1>Application</h1>}
      content={<p>Main Content</p>}
    />
  );
}
```

`Layout`은 전달받은 요소의 내부 구현을 알 필요 없이 지정된 위치에 배치합니다.

### 7.2. 컴포넌트 자체를 Props로 전달

컴포넌트의 타입을 Props로 전달하는 방식도 사용할 수 있습니다.

```tsx
import type { ComponentType } from 'react';

type IconProps = {
  size: number;
};

type ButtonProps = {
  icon: ComponentType<IconProps>;
};

function Button({ icon: Icon }: ButtonProps) {
  return (
    <button>
      <Icon size={20} />
      Submit
    </button>
  );
}

function SearchIcon({ size }: IconProps) {
  return (
    <span style={{ fontSize: size }}>
      Search
    </span>
  );
}

function App() {
  return <Button icon={SearchIcon} />;
}
```

이 방식은 컴포넌트 자체를 전달하여 내부에서 필요한 Props를 지정하고 렌더링할 수 있다는 특징이 있습니다.

React Element를 전달하는 방식과 컴포넌트 타입을 전달하는 방식은 구분해야 합니다.

| 구분 | 전달 형태 | 사용 방식 |
|---|---|---|
| React Element | `<Icon />` | `{icon}` |
| Component Type | `Icon` | `<Icon />` |

React Element는 이미 생성된 요소를 전달하며, Component Type은 컴포넌트 자체를 전달하여 사용하는 위치에서 인스턴스를 구성합니다.

## 8. Spread Props

JavaScript의 Spread 문법을 사용하면 객체에 포함된 여러 속성을 컴포넌트에 일괄적으로 전달할 수 있습니다.

```tsx
type UserProps = {
  name: string;
  age: number;
  email: string;
};

function User({ name, age, email }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
      <p>{email}</p>
    </div>
  );
}

function App() {
  const user = {
    name: 'Alice',
    age: 25,
    email: 'alice@example.com',
  };

  return <User {...user} />;
}
```

`{...user}`는 객체의 속성을 개별 Props로 전달하는 것과 동일한 결과를 만듭니다.

```tsx
<User
  name="Alice"
  age={25}
  email="alice@example.com"
/>
```

### 8.1. Props 확장 및 덮어쓰기

Spread 문법을 사용할 때는 속성의 작성 순서에 주의해야 합니다.

동일한 이름의 속성이 여러 번 전달되면 뒤에 작성된 값이 앞의 값을 덮어씁니다.

```tsx
type ButtonProps = {
  label: string;
  disabled: boolean;
};

function Button({ label, disabled }: ButtonProps) {
  return (
    <button disabled={disabled}>
      {label}
    </button>
  );
}

function App() {
  const buttonProps = {
    label: 'Submit',
    disabled: false,
  };

  return (
    <Button
      {...buttonProps}
      disabled={true}
    />
  );
}
```

위 예제에서는 `disabled={true}`가 Spread 이후에 작성되었으므로 최종적으로 `true`가 전달됩니다.

반대로 Spread 문법을 뒤에 작성하면 객체의 속성이 앞서 지정한 값을 덮어쓸 수 있습니다.

Spread 문법은 코드의 간결성을 높이지만 불필요하거나 의도하지 않은 속성이 전달되지 않도록 주의해야 합니다.

## 9. Props와 단방향 데이터 흐름

React에서는 일반적으로 부모 컴포넌트에서 자식 컴포넌트 방향으로 데이터가 전달됩니다.

이러한 데이터 전달 구조를 단방향 데이터 흐름(One-way Data Flow)이라고 합니다.

```tsx
type UserProps = {
  name: string;
};

function User({ name }: UserProps) {
  return <h2>{name}</h2>;
}

function App() {
  const userName = 'Alice';

  return <User name={userName} />;
}
```

위 예제에서 `App`은 `userName`을 소유하고 있으며, `User`는 해당 값을 Props로 전달받아 사용합니다.

자식 컴포넌트는 부모 컴포넌트의 데이터를 직접 변경하지 않습니다.

자식 컴포넌트에서 부모의 상태 변경이 필요한 경우에는 부모가 전달한 이벤트 핸들러나 콜백 함수를 호출하는 방식을 사용합니다.

```tsx
import { useState } from 'react';

type CounterProps = {
  count: number;
  onIncrement: () => void;
};

function Counter({ count, onIncrement }: CounterProps) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>
        Increment
      </button>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <Counter
      count={count}
      onIncrement={() => setCount((previous) => previous + 1)}
    />
  );
}
```

위 구조에서 데이터는 부모에서 자식으로 전달되며, 자식은 부모가 제공한 콜백을 호출하여 부모의 상태 변경을 요청합니다.

실제 상태 변경은 상태를 소유한 부모 컴포넌트에서 수행됩니다.

이러한 방식은 데이터의 소유권과 변경 책임을 명확하게 유지할 수 있도록 합니다.

## 10. Props와 컴포넌트 렌더링

Props는 컴포넌트의 입력 데이터이므로 변경되면 새로운 UI를 계산하기 위한 렌더링이 발생할 수 있습니다.

다음 예제를 살펴보겠습니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  console.log('Greeting rendered');

  return <h1>Hello, {name}!</h1>;
}

function App() {
  return <Greeting name="Alice" />;
}
```

부모 컴포넌트가 다시 렌더링되면 일반적으로 자식 컴포넌트도 렌더링 과정에 포함됩니다.

다만 다음 사항을 구분해야 합니다.

- Props가 변경되면 컴포넌트의 새로운 UI를 계산해야 할 수 있습니다.
- Props가 동일하더라도 부모 컴포넌트의 렌더링으로 자식 컴포넌트가 다시 렌더링될 수 있습니다.
- React는 렌더링 결과를 기반으로 실제 DOM에 필요한 변경 사항을 결정합니다.
- `memo` 등을 사용하면 특정 조건에서 불필요한 자식 컴포넌트 렌더링을 건너뛸 수 있습니다.

Props가 변경되었다고 해서 항상 실제 DOM이 변경되는 것은 아닙니다.

React는 렌더링 과정에서 새로운 결과를 계산하고 기존 결과와 비교하여 필요한 DOM 변경 사항만 반영합니다.

컴포넌트 렌더링과 업데이트 과정에 대한 상세한 내용은 `rendering/`에서 다룹니다.

## 11. Props와 TypeScript

TypeScript를 사용하면 Props의 데이터 구조와 타입을 명확하게 정의할 수 있습니다.

이를 통해 컴포넌트 사용 시 잘못된 데이터 전달을 컴파일 단계에서 발견할 수 있습니다.

### 11.1. Props 타입 정의

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
  size: 'small' | 'medium' | 'large';
};

function Button({
  label,
  disabled = false,
  size,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      data-size={size}
    >
      {label}
    </button>
  );
}
```

위 예제에서는 다음과 같은 타입을 사용합니다.

- `label`: 문자열
- `disabled`: 선택적 Boolean
- `size`: 지정된 문자열 리터럴 중 하나

문자열 리터럴 유니온 타입을 사용하면 허용되는 값을 제한할 수 있습니다.

### 11.2. Interface를 사용한 Props 정의

Props 타입은 `type`뿐만 아니라 `interface`로도 정의할 수 있습니다.

```tsx
interface ButtonProps {
  label: string;
  disabled?: boolean;
}

function Button({ label, disabled = false }: ButtonProps) {
  return (
    <button disabled={disabled}>
      {label}
    </button>
  );
}
```

두 방식 모두 컴포넌트의 Props 구조를 정의하는 데 사용할 수 있습니다.

### 11.3. HTML 기본 속성 확장

기존 HTML 요소가 제공하는 속성을 재사용하고 싶다면 React에서 제공하는 타입을 활용할 수 있습니다.

```tsx
import type { ComponentProps } from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary';
} & ComponentProps<'button'>;

function Button({
  variant = 'primary',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant}`}
      {...rest}
    >
      {children}
    </button>
  );
}
```

`ComponentProps<'button'>`은 기본 HTML button 요소에서 사용할 수 있는 Props 타입을 가져옵니다.

따라서 `disabled`, `type`, `onClick`, `aria-label` 등 기본 버튼 속성을 별도로 정의하지 않고 재사용할 수 있습니다.

이러한 방식은 기존 HTML 요소의 기능을 확장하는 커스텀 컴포넌트를 작성할 때 유용합니다.

### 11.4. 함수 타입 Props

이벤트 핸들러나 콜백 함수도 Props로 전달할 수 있습니다.

```tsx
type ButtonProps = {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}
```

함수 Props는 컴포넌트 내부에서 발생한 이벤트나 특정 작업의 결과를 외부 컴포넌트에 전달하는 데 사용됩니다.

실제 이벤트 타입과 함수 Props의 타입 설계는 `react-typescript/typing-events.md`에서 다룹니다.

## 12. 핵심 정리

Props는 부모 컴포넌트가 자식 컴포넌트에 데이터를 전달하는 React의 기본적인 데이터 전달 메커니즘입니다.

주요 특징은 다음과 같습니다.

1. Props는 부모 컴포넌트에서 자식 컴포넌트로 데이터를 전달합니다.
2. 함수 컴포넌트에서는 첫 번째 매개변수를 통해 Props에 접근합니다.
3. 구조 분해 할당을 사용하면 필요한 속성을 간결하게 추출할 수 있습니다.
4. 기본값을 지정하여 선택적 Props의 기본 동작을 정의할 수 있습니다.
5. Props는 읽기 전용으로 취급해야 하며 직접 변경해서는 안 됩니다.
6. `children`을 사용하면 컴포넌트 내부에 표시할 콘텐츠를 외부에서 전달할 수 있습니다.
7. React Element와 Component Type을 Props로 전달하여 유연한 컴포넌트 합성을 구현할 수 있습니다.
8. Spread 문법을 사용하면 객체의 여러 속성을 일괄적으로 전달할 수 있습니다.
9. 콜백 함수를 Props로 전달하면 자식 컴포넌트에서 부모 컴포넌트의 상태 변경을 요청할 수 있습니다.
10. TypeScript를 활용하면 Props의 구조와 타입을 명확하게 정의할 수 있습니다.

Props를 효과적으로 설계하면 컴포넌트 간 의존성을 줄이고 데이터 흐름을 명확하게 유지할 수 있습니다.

## 13. 참고 자료

### React 공식 문서

- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component) - Props의 개념과 컴포넌트 간 데이터 전달
- [Passing JSX as Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children) - Children을 사용한 컴포넌트 합성
- [Thinking in React](https://react.dev/learn/thinking-in-react) - 컴포넌트 구조와 데이터 흐름 설계
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) - 컴포넌트 간 상태 공유
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure) - Props의 불변성과 컴포넌트의 순수성
- [React.memo](https://react.dev/reference/react/memo) - Props를 기반으로 한 컴포넌트 렌더링 최적화
- [React Calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks) - React가 컴포넌트를 호출하고 관리하는 방식

### TypeScript 공식 문서

- [Using TypeScript with React](https://react.dev/learn/typescript) - React 컴포넌트의 Props 타입 정의
- [TypeScript JSX Handbook](https://www.typescriptlang.org/docs/handbook/jsx.html) - JSX 요소의 타입 검사 및 속성 타입 정의
- [ComponentProps](https://react-typescript-cheatsheet.netlify.app/docs/reference/componentprops/) - 기존 React 컴포넌트와 HTML 요소의 Props 타입 재사용