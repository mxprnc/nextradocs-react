# Typing Components

React와 TypeScript를 함께 사용하는 환경에서는 컴포넌트의 입력값과 반환값에 대한 타입을 정의하여 컴파일 단계에서 타입 안정성을 확보할 수 있습니다.

React 컴포넌트는 일반적으로 함수로 선언하며, TypeScript에서는 컴포넌트의 매개변수인 `props`와 반환값에 대한 타입 검사를 수행합니다.

컴포넌트 타입을 올바르게 정의하면 잘못된 Props 전달을 방지하고, IDE의 자동 완성 및 타입 추론 기능을 활용할 수 있습니다.

## 1. Function Components

함수형 컴포넌트(Function Component)는 Props를 매개변수로 전달받아 React Element를 반환하는 함수입니다.

TypeScript에서는 일반 함수와 동일한 방식으로 컴포넌트를 선언할 수 있으며, Props의 타입을 함수 매개변수에 지정합니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}
```

위 예제에서 `GreetingProps`는 컴포넌트가 전달받는 Props의 구조를 정의합니다.

- `name`: 문자열 타입의 필수 속성입니다.
- `Greeting`: `GreetingProps`를 매개변수로 전달받는 함수형 컴포넌트입니다.
- 반환값: JSX 표현식이며 TypeScript가 반환 타입을 추론합니다.

컴포넌트를 사용하는 측에서는 정의된 Props 타입에 따라 전달할 수 있는 속성이 제한됩니다.

```tsx
function App() {
  return (
    <>
      <Greeting name="React" />

      {/* Type Error: name은 필수 속성입니다. */}
      {/* <Greeting /> */}

      {/* Type Error: name은 string 타입이어야 합니다. */}
      {/* <Greeting name={123} /> */}
    </>
  );
}
```

이처럼 Props 타입을 선언하면 컴포넌트의 사용 규칙을 명확하게 정의할 수 있습니다.

## 2. Declaring Component Props

컴포넌트의 Props는 객체 타입으로 정의합니다.

Props의 구조가 단순한 경우에는 매개변수에 직접 타입을 지정할 수 있지만, 여러 속성을 사용하거나 타입을 재사용해야 하는 경우에는 별도의 `type` 또는 `interface`로 정의하는 것이 좋습니다.

### 2.1 Inline Type Declaration

Props의 타입을 함수 매개변수에 직접 지정하는 방식입니다.

```tsx
function UserProfile({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}
```

별도의 타입 선언 없이 간단하게 컴포넌트를 정의할 수 있다는 장점이 있습니다.

다만 Props가 많아지면 함수 선언부가 복잡해지고, 동일한 타입을 다른 컴포넌트에서 재사용하기 어려워집니다.

### 2.2 Type Alias

`type`을 사용하여 Props 타입을 별도로 정의하는 방식입니다.

```tsx
type UserProfileProps = {
  name: string;
  age: number;
  email?: string;
};

function UserProfile({
  name,
  age,
  email,
}: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
      {email && <p>{email}</p>}
    </div>
  );
}
```

`email`에는 선택적 속성(Optional Property)을 의미하는 `?`가 지정되어 있습니다.

따라서 해당 속성은 전달하지 않아도 되며, 전달하는 경우에는 문자열 타입이어야 합니다.

### 2.3 Interface

`interface`를 사용하여 Props 타입을 정의할 수도 있습니다.

```tsx
interface UserProfileProps {
  name: string;
  age: number;
  email?: string;
}

function UserProfile({
  name,
  age,
  email,
}: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
      {email && <p>{email}</p>}
    </div>
  );
}
```

`type`과 `interface` 모두 컴포넌트의 Props를 정의하는 데 사용할 수 있습니다.

일반적인 객체 형태의 Props에서는 두 방식 모두 적절합니다. `interface`는 선언 병합(Declaration Merging)과 확장에 활용할 수 있으며, `type`은 Union, Intersection 등 다양한 타입 조합을 표현하는 데 유용합니다.

프로젝트 내에서는 일관된 선언 방식을 유지하는 것이 중요합니다.

## 3. Component Return Type

함수형 컴포넌트의 반환값은 React가 렌더링할 수 있는 결과여야 합니다.

TypeScript는 컴포넌트의 반환값을 추론하므로 대부분의 경우 반환 타입을 명시적으로 지정할 필요가 없습니다.

```tsx
type ButtonProps = {
  label: string;
};

function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}
```

TypeScript는 JSX 표현식의 반환 타입을 추론합니다.

반환 타입을 명시적으로 지정하고 싶다면 `React.JSX.Element`를 사용할 수 있습니다.

```tsx
function Button({
  label,
}: ButtonProps): React.JSX.Element {
  return <button>{label}</button>;
}
```

### 3.1 React.JSX.Element

`React.JSX.Element`는 JSX 표현식의 결과를 나타내는 타입입니다.

```tsx
function Heading(): React.JSX.Element {
  return <h1>React + TypeScript</h1>;
}
```

JSX를 반환하는 컴포넌트의 반환 타입을 명시적으로 제한할 때 사용할 수 있습니다.

다만 `React.JSX.Element`는 JSX 결과를 나타내는 타입이므로 문자열, 숫자, 배열 등 모든 React 렌더링 가능 값을 포괄하지는 않습니다.

### 3.2 React.ReactNode

`React.ReactNode`는 React가 렌더링할 수 있는 다양한 종류의 값을 표현하는 타입입니다.

```tsx
type MessageProps = {
  message: React.ReactNode;
};

function Message({ message }: MessageProps) {
  return <div>{message}</div>;
}
```

다음과 같은 값들을 표현할 수 있습니다.

```tsx
const message1: React.ReactNode = "Hello React";

const message2: React.ReactNode = 123;

const message3: React.ReactNode = <strong>Hello</strong>;

const message4: React.ReactNode = null;

const message5: React.ReactNode = [
  <span key="1">First</span>,
  <span key="2">Second</span>,
];
```

`React.ReactNode`와 `React.JSX.Element`는 용도가 다릅니다.

- `React.JSX.Element`: JSX 표현식의 결과를 나타냅니다.
- `React.ReactNode`: React가 렌더링할 수 있는 다양한 값을 나타냅니다.

특히 `React.ReactNode`는 컴포넌트의 반환 타입뿐 아니라 Children과 같은 렌더링 가능한 값을 전달받는 Props를 정의할 때도 활용됩니다.

## 4. React.FC and React.FunctionComponent

React에서는 함수형 컴포넌트의 타입을 표현하기 위해 `React.FunctionComponent`와 `React.FC`를 제공합니다.

두 타입은 동일한 타입을 가리키는 이름입니다.

```tsx
type GreetingProps = {
  name: string;
};

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}</h1>;
};
```

위 코드는 다음과 같이 작성한 것과 동일한 의미를 가집니다.

```tsx
const Greeting: React.FunctionComponent<GreetingProps> = ({
  name,
}) => {
  return <h1>Hello, {name}</h1>;
};
```

`React.FC`를 사용하면 함수 자체에 컴포넌트 타입을 지정할 수 있으며, 반환 타입 및 일부 컴포넌트 관련 속성에 대한 타입 검사를 지원합니다.

### 4.1 React.FC를 사용하지 않는 방식

최근 React + TypeScript 프로젝트에서는 `React.FC`를 반드시 사용할 필요가 없습니다.

일반 함수의 매개변수에 Props 타입을 지정하는 것만으로도 컴포넌트의 타입을 안전하게 검사할 수 있습니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}
```

화살표 함수도 동일한 방식으로 작성할 수 있습니다.

```tsx
const Greeting = ({ name }: GreetingProps) => {
  return <h1>Hello, {name}</h1>;
};
```

이 방식은 다음과 같은 장점이 있습니다.

- 불필요한 컴포넌트 타입 선언을 줄일 수 있습니다.
- 반환 타입을 TypeScript가 자연스럽게 추론합니다.
- 함수의 매개변수와 반환 타입을 일반적인 TypeScript 문법으로 이해할 수 있습니다.
- Props 타입과 컴포넌트 타입의 역할을 명확하게 구분할 수 있습니다.

따라서 일반적인 함수형 컴포넌트에서는 Props 타입만 명시하는 방식을 권장합니다.

### 4.2 React.FC와 Children

과거 React 타입 정의에서는 `React.FC`가 `children`을 암묵적으로 포함하는 형태로 제공되었습니다.

하지만 현재 React 타입 정의에서는 `React.FC`를 사용한다고 해서 `children`이 자동으로 Props에 추가되지 않습니다.

Children을 전달받아야 한다면 Props에 명시적으로 정의해야 합니다.

```tsx
type ContainerProps = {
  children: React.ReactNode;
};

const Container: React.FC<ContainerProps> = ({
  children,
}) => {
  return <div>{children}</div>;
};
```

일반 함수로 작성해도 동일하게 동작합니다.

```tsx
type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div>{children}</div>;
}
```

Children의 구체적인 타입 설계와 활용 방법은 별도의 Children 관련 문서에서 다룹니다.

## 5. Component Types

React 컴포넌트 자체를 변수에 저장하거나 다른 컴포넌트의 Props로 전달하는 경우에는 컴포넌트 타입을 지정할 수 있습니다.

대표적으로 `React.ComponentType`과 `React.ElementType`을 사용할 수 있습니다.

### 5.1 React.ComponentType

`React.ComponentType<P>`는 특정 Props 타입을 전달받을 수 있는 React 컴포넌트를 나타냅니다.

함수형 컴포넌트와 클래스형 컴포넌트를 모두 포함합니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}

const Component: React.ComponentType<GreetingProps> =
  Greeting;

function App() {
  return <Component name="React" />;
}
```

`React.ComponentType`은 컴포넌트 자체를 값으로 전달받아야 하는 상황에서 유용합니다.

예를 들어 특정 컴포넌트를 Props로 전달하는 Higher-Order Component(HOC), 레이아웃 구성, 컴포넌트 주입 패턴 등에서 활용할 수 있습니다.

```tsx
type PageProps = {
  component: React.ComponentType<{ title: string }>;
};

function Page({ component: Component }: PageProps) {
  return <Component title="Dashboard" />;
}

function Dashboard({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

function App() {
  return <Page component={Dashboard} />;
}
```

여기서 `component`는 JSX Element가 아니라 컴포넌트 자체를 전달받습니다.

### 5.2 React.ElementType

`React.ElementType`은 React에서 JSX 요소의 타입으로 사용할 수 있는 대상을 나타냅니다.

사용자 정의 컴포넌트뿐 아니라 `div`, `button`과 같은 HTML 태그도 포함합니다.

```tsx
type PolymorphicProps = {
  as: React.ElementType;
};

function Wrapper({ as: Component }: PolymorphicProps) {
  return <Component />;
}
```

다음과 같이 HTML 태그를 전달할 수 있습니다.

```tsx
function App() {
  return (
    <>
      <Wrapper as="div" />
      <Wrapper as="section" />
      <Wrapper as="button" />
    </>
  );
}
```

사용자 정의 컴포넌트도 전달할 수 있습니다.

```tsx
function CustomComponent() {
  return <strong>Custom Component</strong>;
}

function App() {
  return <Wrapper as={CustomComponent} />;
}
```

`React.ElementType`은 다양한 종류의 컴포넌트를 동적으로 선택하는 다형성 컴포넌트(Polymorphic Component)를 구현할 때 활용됩니다.

다만 위 예제는 `as`에 전달되는 컴포넌트의 Props와 실제 전달되는 속성 간의 관계까지 검사하지는 않습니다. 해당 관계를 안전하게 표현하려면 Generic과 `ComponentProps` 등을 활용한 추가적인 타입 설계가 필요합니다.

## 6. Class Components

React에서는 클래스형 컴포넌트도 TypeScript로 작성할 수 있습니다.

클래스형 컴포넌트는 `React.Component<P, S>`를 상속하며, 제네릭 타입 매개변수를 통해 Props와 State의 타입을 지정합니다.

```tsx
type CounterProps = {
  initialCount: number;
};

type CounterState = {
  count: number;
};

class Counter extends React.Component<
  CounterProps,
  CounterState
> {
  state: CounterState = {
    count: this.props.initialCount,
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button
          onClick={() =>
            this.setState((state) => ({
              count: state.count + 1,
            }))
          }
        >
          Increment
        </button>
      </div>
    );
  }
}
```

제네릭 매개변수는 다음과 같은 역할을 합니다.

- 첫 번째 매개변수 `CounterProps`: `this.props`의 타입을 지정합니다.
- 두 번째 매개변수 `CounterState`: `this.state`의 타입을 지정합니다.

클래스형 컴포넌트도 타입 안정성을 확보할 수 있지만, 현대 React 애플리케이션에서는 함수형 컴포넌트와 Hooks를 사용하는 방식이 일반적으로 권장됩니다.

클래스형 컴포넌트는 기존 코드베이스 유지보수나 Error Boundary와 같은 특정 상황에서 여전히 사용됩니다.

## 7. Best Practices

React + TypeScript 환경에서 컴포넌트를 작성할 때 다음 사항을 고려하는 것이 좋습니다.

### 7.1 Props 타입을 명시적으로 정의합니다.

컴포넌트가 전달받는 데이터의 구조를 명확하게 정의해야 합니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
};

function Button({ label, disabled = false }: ButtonProps) {
  return (
    <button disabled={disabled}>
      {label}
    </button>
  );
}
```

### 7.2 반환 타입 추론을 우선적으로 활용합니다.

일반적인 함수형 컴포넌트에서는 TypeScript의 반환 타입 추론만으로 충분합니다.

```tsx
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}
```

명시적인 반환 타입이 필요한 경우에만 `React.JSX.Element` 등의 타입을 지정하는 것이 좋습니다.

### 7.3 React.FC를 필수적으로 사용하지 않습니다.

`React.FC`는 유효한 컴포넌트 타입 선언 방식이지만, 일반 함수 선언만으로도 동일한 타입 안정성을 확보할 수 있습니다.

프로젝트의 코드 스타일에 따라 선택할 수 있으나, 특별한 이유가 없다면 일반 함수형 컴포넌트 선언을 사용하는 것이 간결합니다.

### 7.4 컴포넌트와 JSX Element를 구분합니다.

컴포넌트 자체와 컴포넌트를 실행한 결과인 JSX Element는 서로 다른 개념입니다.

```tsx
function Greeting() {
  return <h1>Hello</h1>;
}

// 컴포넌트 자체
const Component = Greeting;

// JSX Element
const element = <Greeting />;
```

컴포넌트 자체를 전달해야 한다면 `React.ComponentType` 또는 `React.ElementType`을 사용하고, 렌더링된 결과를 전달해야 한다면 `React.ReactNode` 또는 `React.ReactElement` 등을 사용해야 합니다.

## 8. Summary

React + TypeScript에서 컴포넌트의 타입을 지정하는 핵심은 Props와 컴포넌트 자체의 타입을 구분하는 것입니다.

| 타입 | 설명 | 주요 용도 |
|---|---|---|
| `React.JSX.Element` | JSX 표현식의 결과 타입 | JSX 반환 타입 |
| `React.ReactNode` | React가 렌더링할 수 있는 값 | Children 및 렌더링 가능한 Props |
| `React.ReactElement` | React Element 객체 | Element 자체를 전달받는 경우 |
| `React.FC<P>` | 함수형 컴포넌트 타입 | 함수형 컴포넌트 타입 선언 |
| `React.ComponentType<P>` | 함수형 및 클래스형 컴포넌트 타입 | 컴포넌트 자체 전달 |
| `React.ElementType` | JSX 요소로 사용할 수 있는 타입 | HTML 태그 및 사용자 정의 컴포넌트 전달 |

일반적인 함수형 컴포넌트에서는 Props 타입을 명시하고 반환 타입은 TypeScript에 추론하도록 하는 방식을 권장합니다.

컴포넌트 자체를 다른 컴포넌트에 전달하거나 동적으로 선택해야 하는 경우에는 `React.ComponentType`과 `React.ElementType`을 활용할 수 있습니다.

이러한 타입을 구분하면 컴포넌트의 역할과 데이터 전달 구조를 보다 명확하게 표현할 수 있습니다.

## 9. References

- [React 공식 문서 - Using TypeScript](https://react.dev/learn/typescript)
  - React 컴포넌트의 Props 타입 정의, Children, DOM Event 및 React 관련 타입을 설명합니다.
- [React 공식 문서 - Your First Component](https://react.dev/learn/your-first-component)
  - 함수형 컴포넌트의 선언과 기본 구조를 설명합니다.
- [React 공식 문서 - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - 컴포넌트 간 Props 전달과 데이터 흐름을 설명합니다.
- [React TypeScript Cheatsheet - Function Components](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/)
  - 함수형 컴포넌트 선언 방식과 `React.FC`의 사용에 관한 실무적인 가이드를 제공합니다.
- [TypeScript 공식 문서 - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
  - TypeScript의 JSX 타입 검사와 JSX 요소 타입의 동작 원리를 설명합니다.
- [DefinitelyTyped - React Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)
  - `@types/react`에서 제공하는 React 타입 정의를 확인할 수 있습니다.