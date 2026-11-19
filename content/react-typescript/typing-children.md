# Typing Children

React에서 `children`은 컴포넌트의 여는 태그와 닫는 태그 사이에 전달되는 콘텐츠를 의미합니다.

컴포넌트는 `children`을 통해 다른 컴포넌트나 JSX 요소를 포함할 수 있으며, 이를 활용하면 컴포넌트의 구조와 콘텐츠를 분리하여 재사용성을 높일 수 있습니다.

TypeScript에서는 `children`의 타입을 명시적으로 정의하여 컴포넌트에 전달할 수 있는 콘텐츠의 종류를 제한할 수 있습니다.

React에서 Children을 타입으로 표현할 때는 주로 `React.ReactNode`, `React.ReactElement`, `React.PropsWithChildren` 등을 사용합니다.

## 1. Understanding Children

React 컴포넌트는 JSX에서 중첩된 형태로 사용할 수 있으며, 중첩된 콘텐츠는 부모 컴포넌트의 `children` Props로 전달됩니다.

```tsx
type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div className="container">{children}</div>;
}

function App() {
  return (
    <Container>
      <h1>Hello React</h1>
      <p>React with TypeScript</p>
    </Container>
  );
}
```

위 예제에서 `Container` 내부에 작성된 JSX 콘텐츠는 `children` Props로 전달됩니다.

개념적으로 다음과 같은 구조입니다.

```tsx
<Container>
  <h1>Hello React</h1>
  <p>React with TypeScript</p>
</Container>
```

이는 다음과 같이 Props를 직접 전달하는 것과 동일한 의미입니다.

```tsx
<Container
  children={
    <>
      <h1>Hello React</h1>
      <p>React with TypeScript</p>
    </>
  }
/>
```

`children`은 React가 특별하게 처리하는 Props이지만, TypeScript에서는 일반적인 객체 속성과 동일하게 타입을 지정할 수 있습니다.

## 2. React.ReactNode

`React.ReactNode`는 React가 렌더링할 수 있는 모든 종류의 노드를 표현하는 타입입니다.

일반적으로 컴포넌트가 다양한 형태의 콘텐츠를 Children으로 전달받아야 할 때 사용합니다.

```tsx
type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div>{children}</div>;
}
```

`React.ReactNode`에는 다음과 같은 값이 포함됩니다.

```tsx
const text: React.ReactNode = "Hello";

const number: React.ReactNode = 100;

const element: React.ReactNode = <h1>Hello</h1>;

const fragment: React.ReactNode = (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);

const empty: React.ReactNode = null;

const boolean: React.ReactNode = false;

const elements: React.ReactNode = [
  <li key="1">First</li>,
  <li key="2">Second</li>,
];
```

주요 특징은 다음과 같습니다.

- 문자열과 숫자를 포함합니다.
- JSX Element를 포함합니다.
- Fragment를 포함합니다.
- 배열 형태의 렌더링 가능한 노드를 포함합니다.
- `null`, `undefined`, Boolean과 같이 렌더링 결과가 없는 값도 포함합니다.

따라서 `React.ReactNode`는 일반적인 레이아웃 컴포넌트나 Wrapper 컴포넌트에서 Children 타입으로 사용하기 적합합니다.

```tsx
type CardProps = {
  title: string;
  children: React.ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

## 3. React.ReactElement

`React.ReactElement`는 React Element 객체를 나타내는 타입입니다.

`React.ReactNode`가 렌더링 가능한 다양한 값을 포함하는 반면, `React.ReactElement`는 React Element 자체를 표현합니다.

```tsx
type ElementContainerProps = {
  children: React.ReactElement;
};

function ElementContainer({
  children,
}: ElementContainerProps) {
  return <div className="container">{children}</div>;
}
```

위 컴포넌트는 React Element 형태의 Children을 전달받도록 제한합니다.

```tsx
<ElementContainer>
  <h1>Hello React</h1>
</ElementContainer>
```

반면 다음과 같은 값은 `React.ReactElement` 타입에 포함되지 않습니다.

```tsx
// Type Error: 문자열은 ReactElement가 아닙니다.
// <ElementContainer>Hello</ElementContainer>

// Type Error: 숫자는 ReactElement가 아닙니다.
// <ElementContainer>{100}</ElementContainer>
```

### 3.1 React.ReactNode와 React.ReactElement 비교

두 타입의 가장 중요한 차이는 허용하는 값의 범위입니다.

| 구분 | React.ReactNode | React.ReactElement |
|---|---|---|
| 문자열 | 지원 | 미지원 |
| 숫자 | 지원 | 미지원 |
| JSX Element | 지원 | 지원 |
| Fragment | 지원 | 지원 |
| 배열 | 지원 | 미지원 |
| null / undefined | 지원 | 미지원 |
| Boolean | 지원 | 미지원 |

예를 들어 일반적인 레이아웃 컴포넌트에서는 다양한 콘텐츠를 허용해야 하므로 `React.ReactNode`가 적합합니다.

반면 반드시 JSX Element 객체를 전달받아야 하는 컴포넌트에서는 `React.ReactElement`를 사용할 수 있습니다.

```tsx
type LayoutProps = {
  children: React.ReactNode;
};

type ElementProps = {
  children: React.ReactElement;
};
```

또한 `React.ReactElement`는 Generic을 통해 Element의 Props 타입과 Element 타입을 표현할 수 있습니다.

```tsx
type SpecificElementProps = {
  children: React.ReactElement<
    { value: string },
    "input"
  >;
};
```

다만 `React.ReactElement`를 이용한 타입 제한은 JSX Element의 정적인 타입을 검사하는 것이며, 런타임에서 전달된 Element의 구조나 동작까지 보장하지는 않습니다.

## 4. React.PropsWithChildren

`React.PropsWithChildren<P>`는 기존 Props 타입에 선택적인 `children` 속성을 추가하는 유틸리티 타입입니다.

직접 `children`을 선언하지 않고 기존 Props 타입을 확장할 때 사용할 수 있습니다.

```tsx
type CardProps = {
  title: string;
};

type CardWithChildrenProps =
  React.PropsWithChildren<CardProps>;

function Card({
  title,
  children,
}: CardWithChildrenProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

`React.PropsWithChildren<P>`는 개념적으로 다음과 같은 타입입니다.

```tsx
type PropsWithChildren<P = unknown> = P & {
  children?: React.ReactNode | undefined;
};
```

따라서 다음과 같이 작성한 것과 유사합니다.

```tsx
type CardProps = {
  title: string;
  children?: React.ReactNode;
};
```

### 4.1 PropsWithChildren의 특징

`React.PropsWithChildren`을 사용하면 다음과 같은 장점이 있습니다.

- 기존 Props 타입을 재사용할 수 있습니다.
- `children` 타입을 반복해서 선언하지 않아도 됩니다.
- Children이 선택적으로 전달되는 컴포넌트를 간결하게 표현할 수 있습니다.

다만 `PropsWithChildren`은 `children`을 선택적 속성으로 추가합니다.

따라서 Children을 반드시 전달받아야 하는 컴포넌트에서는 적합하지 않을 수 있습니다.

필수 Children이 필요한 경우에는 직접 Props 타입에 `children`을 선언하는 것이 좋습니다.

## 5. Required and Optional Children

Children은 컴포넌트의 요구사항에 따라 필수 또는 선택적으로 정의할 수 있습니다.

### 5.1 Required Children

Children을 반드시 전달받아야 하는 경우에는 `children`을 필수 속성으로 선언합니다.

```tsx
type ContainerProps = {
  children: React.ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div>{children}</div>;
}
```

다음과 같이 Children을 전달하지 않으면 타입 오류가 발생합니다.

```tsx
// Type Error: children이 누락되었습니다.
// <Container />
```

### 5.2 Optional Children

Children이 없어도 정상적으로 동작하는 컴포넌트라면 선택적 속성으로 선언할 수 있습니다.

```tsx
type PanelProps = {
  title: string;
  children?: React.ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children && <div>{children}</div>}
    </section>
  );
}
```

다음 두 형태를 모두 사용할 수 있습니다.

```tsx
<Panel title="Profile">
  <p>User information</p>
</Panel>

<Panel title="Profile" />
```

Children의 필수 여부는 컴포넌트의 설계 목적에 따라 결정해야 합니다.

## 6. Restricting Children Types

일반적인 `React.ReactNode` 대신 특정 형태의 Children만 허용하도록 타입을 제한할 수도 있습니다.

### 6.1 Restricting to a Single Element

하나의 React Element만 전달받아야 하는 경우 `React.ReactElement`를 사용할 수 있습니다.

```tsx
type TriggerProps = {
  children: React.ReactElement;
};

function Trigger({ children }: TriggerProps) {
  return <div className="trigger">{children}</div>;
}
```

이 타입은 문자열이나 숫자 대신 React Element를 전달하도록 제한합니다.

다만 `React.ReactElement`만으로는 특정 컴포넌트만 전달하도록 완전히 제한할 수 없습니다.

### 6.2 Restricting to a Specific Component

특정 컴포넌트의 Element만 Children으로 허용하려면 해당 컴포넌트의 Element 타입을 사용할 수 있습니다.

```tsx
type ItemProps = {
  value: string;
};

function Item({ value }: ItemProps) {
  return <li>{value}</li>;
}

type ListProps = {
  children: React.ReactElement<ItemProps>[];
};

function List({ children }: ListProps) {
  return <ul>{children}</ul>;
}
```

다음과 같이 `Item` 컴포넌트의 Element를 배열 형태로 전달할 수 있습니다.

```tsx
<List>
  {[
    <Item key="1" value="First" />,
    <Item key="2" value="Second" />,
  ]}
</List>
```

다만 JSX에서 여러 개의 Children을 작성하면 React Element 배열이 아니라 Fragment 등의 형태로 전달될 수 있으므로 위 타입과 JSX 사용 방식이 일치하는지 확인해야 합니다.

다음과 같이 배열을 명시적으로 전달하는 방식도 사용할 수 있습니다.

```tsx
<List>
  {[
    <Item key="1" value="First" />,
    <Item key="2" value="Second" />,
  ]}
</List>
```

또한 TypeScript의 Element 타입 검사는 JSX의 구조적 타입 시스템에 기반하므로 특정 컴포넌트만 허용한다는 제약이 런타임까지 보장되는 것은 아닙니다.

### 6.3 Restricting the Number of Children

Children의 개수를 제한하는 것도 타입으로 표현할 수 있습니다.

예를 들어 정확히 두 개의 Element를 전달받아야 하는 경우 Tuple 타입을 사용할 수 있습니다.

```tsx
type PairProps = {
  children: [
    React.ReactElement,
    React.ReactElement
  ];
};

function Pair({ children }: PairProps) {
  const [first, second] = children;

  return (
    <div>
      <div>{first}</div>
      <div>{second}</div>
    </div>
  );
}
```

이 방식은 배열의 길이와 각 요소의 타입을 정적으로 표현할 수 있습니다.

다만 JSX의 Children 전달 방식과 Tuple 타입 간의 호환성을 고려해야 합니다. 일반적인 JSX 중첩 문법에서 타입 추론이 기대와 다르게 동작할 수 있으므로, 실제 사용 방식에 맞춰 검증해야 합니다.

## 7. Function as Children

Children을 반드시 JSX Element로 전달할 필요는 없습니다.

함수를 Children으로 전달하고, 부모 컴포넌트가 해당 함수를 호출하여 렌더링 결과를 생성하는 패턴도 사용할 수 있습니다.

이를 Function as Children 또는 Render Props 패턴이라고 합니다.

```tsx
type Data = {
  id: number;
  name: string;
};

type DataProviderProps = {
  children: (data: Data) => React.ReactNode;
};

function DataProvider({ children }: DataProviderProps) {
  const data: Data = {
    id: 1,
    name: "Alice",
  };

  return <div>{children(data)}</div>;
}
```

사용하는 측에서는 함수를 Children으로 전달합니다.

```tsx
function App() {
  return (
    <DataProvider>
      {(data) => (
        <p>
          {data.id}: {data.name}
        </p>
      )}
    </DataProvider>
  );
}
```

`children`의 타입은 다음과 같습니다.

```tsx
children: (data: Data) => React.ReactNode;
```

이는 `Data` 타입의 매개변수를 전달받아 React Node를 반환하는 함수라는 의미입니다.

이 패턴은 다음과 같은 상황에서 활용할 수 있습니다.

- 부모 컴포넌트가 관리하는 데이터를 자식 렌더링 함수에 전달하는 경우
- 컴포넌트의 내부 상태를 외부 렌더링 로직에 노출하는 경우
- 동일한 데이터 처리 로직을 유지하면서 렌더링 구조를 사용하는 측에서 결정하는 경우

다만 현대 React에서는 Custom Hooks나 컴포넌트 합성을 통해 동일한 문제를 해결할 수도 있으므로 상황에 맞게 선택해야 합니다.

## 8. Cloning and Manipulating Children

React는 전달받은 Children을 검사하거나 복제하는 API를 제공합니다.

대표적으로 `React.Children`과 `React.cloneElement`를 사용할 수 있습니다.

### 8.1 React.Children

`React.Children`은 컴포넌트의 Children을 다루기 위한 유틸리티 API입니다.

```tsx
type ListProps = {
  children: React.ReactNode;
};

function List({ children }: ListProps) {
  return (
    <ul>
      {React.Children.map(children, (child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ul>
  );
}
```

주요 API는 다음과 같습니다.

| API | 설명 |
|---|---|
| `Children.map` | Children을 순회하면서 변환합니다. |
| `Children.forEach` | Children을 순회합니다. |
| `Children.count` | Children의 개수를 반환합니다. |
| `Children.only` | 단일 React Element를 반환하며, 단일 Element가 아니면 오류를 발생시킵니다. |
| `Children.toArray` | Children을 배열로 변환합니다. |

`React.Children`은 전달받은 Children을 다루는 기능을 제공하지만, 내부에 중첩된 컴포넌트 트리 전체를 탐색하지는 않습니다.

### 8.2 React.cloneElement

`React.cloneElement`는 기존 React Element를 복제하면서 새로운 Props를 추가하거나 기존 Props를 덮어쓸 수 있는 API입니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
};

function Button({ label, disabled }: ButtonProps) {
  return (
    <button disabled={disabled}>
      {label}
    </button>
  );
}

type WrapperProps = {
  children: React.ReactElement<ButtonProps>;
};

function Wrapper({ children }: WrapperProps) {
  return React.cloneElement(children, {
    disabled: true,
  });
}
```

사용 예제는 다음과 같습니다.

```tsx
function App() {
  return (
    <Wrapper>
      <Button label="Submit" />
    </Wrapper>
  );
}
```

`Wrapper`는 전달받은 `Button` Element를 복제하고 `disabled` 속성을 추가합니다.

`React.cloneElement`는 특정 상황에서 유용하지만, Children의 Props를 외부에서 변경하는 구조는 데이터 흐름을 복잡하게 만들 수 있습니다.

따라서 일반적으로는 명시적인 Props 전달이나 컴포넌트 합성을 우선적으로 고려하는 것이 좋습니다.

## 9. Best Practices

React + TypeScript 환경에서 Children을 설계할 때 다음 사항을 고려하는 것이 좋습니다.

### 9.1 일반적인 Children에는 React.ReactNode를 사용합니다.

레이아웃, Wrapper, Container 등 다양한 콘텐츠를 포함해야 하는 컴포넌트에서는 `React.ReactNode`를 사용하는 것이 적절합니다.

```tsx
type LayoutProps = {
  children: React.ReactNode;
};
```

### 9.2 반드시 필요한 Children은 필수 속성으로 정의합니다.

컴포넌트의 정상적인 동작을 위해 Children이 반드시 필요하다면 `children`을 선택적으로 선언하지 않아야 합니다.

```tsx
type DialogProps = {
  children: React.ReactNode;
};
```

### 9.3 PropsWithChildren의 선택적 특성을 이해합니다.

`React.PropsWithChildren`은 선택적 `children` 속성을 추가합니다.

따라서 Children이 필수인 컴포넌트에서는 직접 타입을 정의하는 것이 더 명확합니다.

### 9.4 ReactNode와 ReactElement를 구분합니다.

두 타입은 허용하는 값의 범위가 다릅니다.

- 다양한 렌더링 가능한 값을 허용하려면 `React.ReactNode`를 사용합니다.
- React Element 객체만 허용하려면 `React.ReactElement`를 사용합니다.

### 9.5 Children을 과도하게 제한하지 않습니다.

특정 컴포넌트나 Element만 허용하도록 타입을 제한하면 컴포넌트의 재사용성이 낮아질 수 있습니다.

실제로 필요한 제약이 있는 경우에만 구체적인 타입을 사용하는 것이 좋습니다.

### 9.6 Children 조작보다 명시적인 합성을 우선합니다.

`React.Children`과 `React.cloneElement`는 유용하지만, 컴포넌트의 데이터 흐름을 파악하기 어렵게 만들 수 있습니다.

가능하다면 명시적인 Props 전달이나 컴포넌트 합성을 통해 구조를 표현하는 것이 좋습니다.

## 10. Summary

React + TypeScript에서 Children은 컴포넌트 간 콘텐츠를 전달하는 중요한 수단입니다.

| 타입 및 API | 설명 | 주요 용도 |
|---|---|---|
| `React.ReactNode` | 렌더링 가능한 다양한 값 | 일반적인 Children |
| `React.ReactElement` | React Element 객체 | Element로 제한된 Children |
| `React.PropsWithChildren<P>` | 기존 Props에 선택적 Children 추가 | 공통 Props 타입 확장 |
| `React.Children.map` | Children 순회 및 변환 | Children 목록 처리 |
| `React.Children.count` | Children 개수 계산 | Children 개수 확인 |
| `React.Children.only` | 단일 Element 반환 | 단일 Children 요구 |
| `React.Children.toArray` | Children 배열 변환 | Children 배열 처리 |
| `React.cloneElement` | 기존 Element 복제 및 Props 변경 | Element 조작 |

일반적인 컴포넌트에서는 `React.ReactNode`를 사용하여 Children을 정의하는 것이 가장 유연합니다.

특정 Element만 허용하거나 Children의 동작을 함수 형태로 전달해야 하는 경우에는 `React.ReactElement` 또는 Function as Children 패턴을 활용할 수 있습니다.

Children의 타입을 적절하게 설계하면 컴포넌트의 합성 구조를 명확하게 표현하고 재사용성을 높일 수 있습니다.

## 11. References

- [React 공식 문서 - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - 컴포넌트 간 Props 전달 및 Children의 기본 개념을 설명합니다.
- [React 공식 문서 - Passing JSX as Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
  - JSX를 Children으로 전달하는 방법과 컴포넌트 합성을 설명합니다.
- [React 공식 문서 - React TypeScript](https://react.dev/learn/typescript)
  - React에서 Children을 포함한 TypeScript 타입 지정 방법을 설명합니다.
- [React 공식 문서 - React.Children](https://react.dev/reference/react/Children)
  - Children을 순회하고 변환하는 API를 설명합니다.
- [React 공식 문서 - cloneElement](https://react.dev/reference/react/cloneElement)
  - React Element를 복제하고 Props를 변경하는 방법을 설명합니다.
- [React 공식 문서 - createElement](https://react.dev/reference/react/createElement)
  - React Element 생성과 관련된 개념을 설명합니다.
- [React TypeScript Cheatsheet - Basic Type Examples](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_examples/)
  - `ReactNode`, `ReactElement`, `PropsWithChildren` 등 React 타입의 활용 사례를 제공합니다.
- [DefinitelyTyped - React Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)
  - `ReactNode`, `ReactElement`, `PropsWithChildren` 등의 실제 타입 정의를 확인할 수 있습니다.