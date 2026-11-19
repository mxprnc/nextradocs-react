# Polymorphic Components

Polymorphic Component는 하나의 React 컴포넌트가 여러 종류의 HTML 요소 또는 다른 React 컴포넌트로 렌더링될 수 있도록 설계한 컴포넌트입니다.

일반적으로 `as` 또는 `asChild`와 같은 Prop을 사용하여 실제 렌더링 대상을 결정합니다.

TypeScript에서는 Generic과 `React.ElementType`, `React.ComponentPropsWithoutRef` 등의 타입을 활용하여 렌더링 대상에 따라 허용되는 Props를 동적으로 변경할 수 있습니다.

Polymorphic Component는 디자인 시스템이나 UI 라이브러리에서 공통 스타일과 동작을 유지하면서 다양한 HTML 요소를 지원해야 할 때 유용합니다.

## 1. Basic Concept

일반적인 React 컴포넌트는 렌더링할 HTML 요소가 고정되어 있습니다.

```tsx
type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

function Button({ children, disabled }: ButtonProps) {
  return (
    <button disabled={disabled}>
      {children}
    </button>
  );
}
```

위 컴포넌트는 항상 `<button>` 요소를 렌더링합니다.

반면 Polymorphic Component는 렌더링할 요소를 Prop으로 전달받을 수 있습니다.

```tsx
type TextProps = {
  as?: "p" | "span" | "h1" | "h2";
  children: React.ReactNode;
};

function Text({ as: Component = "p", children }: TextProps) {
  return <Component>{children}</Component>;
}
```

사용하는 측에서 `as` Prop으로 렌더링할 요소를 결정할 수 있습니다.

```tsx
<Text>Paragraph</Text>

<Text as="span">Inline Text</Text>

<Text as="h1">Heading</Text>
```

이 방식은 동일한 스타일과 컴포넌트 인터페이스를 유지하면서 HTML 요소를 변경할 수 있도록 합니다.

다만 위 예제는 `as` 값에 따라 HTML 요소별 Props 타입이 달라지지 않습니다. 예를 들어 `as="a"`를 전달했을 때 `href`를 허용하거나, `as="button"`일 때 `disabled`를 허용하는 타입 안정성은 별도로 구현해야 합니다.

## 2. React.ElementType

Polymorphic Component를 구현할 때 핵심적으로 사용하는 타입은 `React.ElementType`입니다.

`React.ElementType`은 HTML 태그 이름이나 React 컴포넌트 타입을 나타냅니다.

```tsx
import type { ElementType } from "react";

type ComponentProps = {
  as?: ElementType;
};
```

다음과 같이 다양한 렌더링 대상을 지정할 수 있습니다.

```tsx
<Component as="div" />
<Component as="button" />
<Component as="a" />
<Component as={CustomComponent} />
```

`React.ElementType`은 기본적으로 다양한 HTML 요소와 React 컴포넌트를 허용합니다.

반면 `React.ComponentType`은 함수형 또는 클래스형 React 컴포넌트를 나타내며, 문자열 형태의 HTML 태그는 포함하지 않습니다.

```tsx
import type {
  ComponentType,
  ElementType,
} from "react";

type ElementProps = {
  as?: ElementType;
};

type CustomComponentProps = {
  as: ComponentType<{ value: string }>;
};
```

| 타입 | 허용 대상 |
|---|---|
| `React.ElementType` | HTML 태그 및 React 컴포넌트 |
| `React.ComponentType<P>` | Props 타입 `P`를 사용하는 React 컴포넌트 |
| `React.Element` | React Element 객체 |
| `React.ReactNode` | React가 렌더링할 수 있는 노드 |

Polymorphic Component에서는 HTML 태그와 사용자 정의 컴포넌트를 모두 지원해야 하는 경우가 많으므로 `React.ElementType`이 적합합니다.

## 3. ComponentProps

React는 특정 요소 또는 컴포넌트가 지원하는 Props 타입을 추출할 수 있는 유틸리티 타입을 제공합니다.

### 3.1 React.ComponentProps

`React.ComponentProps<T>`는 특정 요소 또는 컴포넌트의 Props 타입을 추출합니다.

```tsx
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;
```

위 타입은 HTML Button 요소가 지원하는 Props를 가져옵니다.

```tsx
type AnchorProps = ComponentProps<"a">;

type InputProps = ComponentProps<"input">;
```

사용자 정의 컴포넌트에도 적용할 수 있습니다.

```tsx
type CustomButtonProps = {
  variant: "primary" | "secondary";
  size: "small" | "large";
};

function CustomButton(props: CustomButtonProps) {
  return <button>{props.variant}</button>;
}

type Props = ComponentProps<typeof CustomButton>;
```

`typeof`를 사용하면 컴포넌트 자체의 타입을 `ComponentProps`에 전달할 수 있습니다.

### 3.2 ComponentPropsWithoutRef

DOM Ref를 전달하지 않는 컴포넌트에서는 `React.ComponentPropsWithoutRef<T>`를 사용할 수 있습니다.

```tsx
import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;
```

이 타입은 해당 요소의 일반 Props를 포함하지만 `ref`는 제외합니다.

Polymorphic Component에서 Ref를 별도로 처리하지 않는다면 `ComponentPropsWithoutRef`를 사용하는 것이 명확합니다.

### 3.3 ComponentPropsWithRef

Ref를 지원해야 하는 경우에는 `React.ComponentPropsWithRef<T>`를 사용할 수 있습니다.

```tsx
import type { ComponentPropsWithRef } from "react";

type InputProps = ComponentPropsWithRef<"input">;
```

이 타입은 대상 요소가 지원하는 Ref 타입까지 포함합니다.

React 버전에 따라 `ref` 전달 방식에 차이가 있으므로 React 18 이하와 React 19 이상의 구현 방식을 구분해야 합니다.

## 4. Building a Polymorphic Component

Polymorphic Component의 핵심은 렌더링 대상에 따라 Props 타입을 동적으로 결정하는 것입니다.

이를 위해 다음과 같은 타입을 조합합니다.

- `React.ElementType`: 렌더링 대상 타입
- `React.ComponentPropsWithoutRef<T>`: 대상 컴포넌트의 Props
- Generic: 렌더링 대상에 따른 타입 추론
- `Omit`: 중복되거나 충돌하는 Props 제거

### 4.1 Defining Own Props

먼저 컴포넌트 자체가 제공하는 Props를 정의합니다.

```tsx
import type { ElementType, ReactNode } from "react";

type TextOwnProps = {
  children?: ReactNode;
  color?: string;
  fontSize?: number;
};
```

`TextOwnProps`는 렌더링 대상과 관계없이 Text 컴포넌트가 제공하는 공통 Props입니다.

### 4.2 Defining Polymorphic Props

렌더링 대상의 Props를 추출하고 컴포넌트 자체의 Props와 결합합니다.

```tsx
import type {
  ComponentPropsWithoutRef,
  ElementType,
} from "react";

type PolymorphicProps<
  C extends ElementType,
  OwnProps = {},
> = OwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | "as">;
```

각 타입의 역할은 다음과 같습니다.

| 타입 | 역할 |
|---|---|
| `C extends ElementType` | 렌더링할 요소 또는 컴포넌트의 타입 |
| `OwnProps` | Polymorphic Component 자체의 Props |
| `as?: C` | 렌더링 대상을 선택하는 Prop |
| `ComponentPropsWithoutRef<C>` | 렌더링 대상이 지원하는 Props |
| `Omit` | 자체 Props 및 `as`와 중복되는 속성 제거 |

`Omit`을 사용하는 이유는 자체 Props와 렌더링 대상의 Props가 동일한 이름을 가질 수 있기 때문입니다.

예를 들어 자체적으로 `color` Prop을 정의한 상태에서 HTML 요소의 Props와 결합하면 타입이 충돌할 수 있습니다.

### 4.3 Implementing the Component

앞서 정의한 타입을 사용하여 Text 컴포넌트를 구현합니다.

```tsx
import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

type TextOwnProps = {
  children?: ReactNode;
  color?: string;
  fontSize?: number;
};

type PolymorphicProps<
  C extends ElementType,
  OwnProps = {},
> = OwnProps & {
  as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof OwnProps | "as">;

function Text<C extends ElementType = "span">({
  as,
  color,
  fontSize,
  style,
  ...rest
}: PolymorphicProps<C, TextOwnProps>) {
  const Component = as || "span";

  return (
    <Component
      {...rest}
      style={{
        ...style,
        color,
        fontSize,
      }}
    />
  );
}
```

기본 렌더링 대상은 `span`입니다.

`as` Prop이 전달되면 해당 요소로 렌더링하며, 렌더링 대상에 맞는 Props를 함께 사용할 수 있습니다.

```tsx
<Text color="red" fontSize={16}>
  Default Span
</Text>

<Text as="p" color="blue" fontSize={18}>
  Paragraph
</Text>

<Text as="a" href="/about" color="green">
  About
</Text>

<Text as="button" type="button" disabled>
  Button
</Text>
```

각 사용 방식에 따라 TypeScript가 허용하는 Props가 달라집니다.

```tsx
// Valid
<Text as="a" href="/about">
  About
</Text>

// Valid
<Text as="button" disabled>
  Submit
</Text>

// Type Error
<Text as="a" disabled>
  Invalid Anchor Prop
</Text>

// Type Error
<Text as="button" href="/about">
  Invalid Button Prop
</Text>
```

이처럼 Polymorphic Component는 렌더링 대상에 맞는 Props를 제공하면서 공통 스타일과 기능을 유지할 수 있습니다.

## 5. Polymorphic Component with Custom Components

`React.ElementType`을 사용하면 HTML 태그뿐 아니라 사용자 정의 React 컴포넌트도 렌더링 대상으로 지정할 수 있습니다.

```tsx
type LinkProps = {
  to: string;
  children: React.ReactNode;
};

function CustomLink({ to, children }: LinkProps) {
  return <a href={to}>{children}</a>;
}
```

앞서 구현한 Polymorphic Component에 사용자 정의 컴포넌트를 전달할 수 있습니다.

```tsx
<Text as={CustomLink} to="/dashboard">
  Dashboard
</Text>
```

`as={CustomLink}`를 전달하면 TypeScript는 `CustomLink`의 Props를 추론합니다.

따라서 `to`는 허용되지만 `href`는 허용되지 않습니다.

```tsx
// Valid
<Text as={CustomLink} to="/dashboard">
  Dashboard
</Text>

// Type Error
<Text as={CustomLink} href="/dashboard">
  Dashboard
</Text>
```

이 기능은 디자인 시스템에서 공통 스타일 컴포넌트와 라우팅 라이브러리의 Link 컴포넌트를 결합할 때 유용합니다.

단, 전달하는 사용자 정의 컴포넌트가 실제로 필요한 Props를 전달받고 처리할 수 있어야 합니다.

## 6. Polymorphic Component with Ref

Polymorphic Component에서 Ref를 지원하려면 렌더링 대상에 따라 Ref 타입도 변경되어야 합니다.

예를 들어 `as="button"`이면 `HTMLButtonElement`, `as="input"`이면 `HTMLInputElement`를 참조해야 합니다.

### 6.1 Defining Ref-aware Props

다음과 같이 Ref를 제외한 Props와 Ref를 포함한 Props를 구분할 수 있습니다.

```tsx
import type {
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from "react";

type PolymorphicPropsWithRef<
  C extends ElementType,
  OwnProps = {},
> = OwnProps & {
  as?: C;
} & Omit<ComponentPropsWithRef<C>, keyof OwnProps | "as">;
```

`ComponentPropsWithRef<C>`를 사용하면 렌더링 대상의 Ref 타입을 포함할 수 있습니다.

### 6.2 React 19

React 19에서는 함수형 컴포넌트의 `ref`를 일반 Prop처럼 전달할 수 있습니다.

따라서 `forwardRef` 없이 Ref를 전달받는 컴포넌트를 작성할 수 있습니다.

```tsx
import type {
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from "react";

type BoxOwnProps = {
  children?: ReactNode;
};

type BoxProps<C extends ElementType> =
  BoxOwnProps & {
    as?: C;
  } & Omit<
    ComponentPropsWithRef<C>,
    keyof BoxOwnProps | "as"
  >;

function Box<C extends ElementType = "div">({
  as,
  ...props
}: BoxProps<C>) {
  const Component = as || "div";

  return <Component {...props} />;
}
```

사용하는 측에서는 렌더링 대상에 맞는 Ref를 전달할 수 있습니다.

```tsx
import { useRef } from "react";

function Example() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Box as="button" ref={buttonRef}>
        Click
      </Box>

      <Box as="input" ref={inputRef} />
    </>
  );
}
```

이 방식은 React 19의 Ref 전달 방식을 활용한 예제입니다.

### 6.3 React 18 and Earlier

React 18 이하에서는 함수형 컴포넌트가 `ref`를 일반 Prop으로 전달받지 않으므로 `forwardRef`를 사용해야 합니다.

```tsx
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <button {...props} ref={ref} />;
  },
);
```

Polymorphic Component에서 `forwardRef`를 사용하면 렌더링 대상에 따라 Ref 타입을 추론하도록 추가적인 타입 설계가 필요합니다.

특히 `forwardRef`의 제네릭 구조와 Polymorphic Props의 제네릭 구조가 일치하지 않으므로 단순한 타입 결합만으로 원하는 타입 추론이 보장되지는 않습니다.

React 18 이하를 지원하는 라이브러리에서는 검증된 Polymorphic 타입 유틸리티를 사용하거나 별도의 오버로드 및 타입 단언을 활용하는 방식을 고려할 수 있습니다.

## 7. Polymorphic Component Type Utilities

Polymorphic Component를 여러 개 구현하는 경우 공통 타입을 유틸리티로 분리할 수 있습니다.

### 7.1 Polymorphic Component Props

```tsx
import type {
  ComponentPropsWithoutRef,
  ElementType,
} from "react";

type AsProp<C extends ElementType> = {
  as?: C;
};

type PolymorphicComponentProps<
  C extends ElementType,
  OwnProps = {},
> = OwnProps &
  AsProp<C> &
  Omit<
    ComponentPropsWithoutRef<C>,
    keyof OwnProps | "as"
  >;
```

`AsProp`과 `PolymorphicComponentProps`를 분리하면 여러 컴포넌트에서 동일한 타입 구조를 재사용할 수 있습니다.

### 7.2 Extracting the Default Element

기본 렌더링 요소를 지정할 수 있도록 Generic에 기본 타입을 선언합니다.

```tsx
type PolymorphicComponentPropsWithDefault<
  C extends ElementType,
  DefaultElement extends ElementType,
  OwnProps = {},
> = PolymorphicComponentProps<
  C extends ElementType ? C : DefaultElement,
  OwnProps
>;
```

다만 위 타입은 `C`가 항상 `ElementType`으로 제한되는 구조에서는 기본 요소를 선택하는 조건이 실질적으로 동작하지 않습니다.

실제 기본 요소를 표현할 때는 Generic 자체에 기본값을 지정하는 방식이 더 간결합니다.

```tsx
type BoxProps<C extends ElementType = "div"> =
  PolymorphicComponentProps<C, BoxOwnProps>;
```

`C`를 생략하면 `div`가 기본 렌더링 요소로 추론됩니다.

### 7.3 Extracting the Polymorphic Ref

Ref 타입만 별도로 추출할 수도 있습니다.

```tsx
import type {
  ComponentPropsWithRef,
  ElementType,
} from "react";

type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithRef<C>["ref"];
```

이 타입을 사용하면 특정 렌더링 대상의 Ref 타입을 추출할 수 있습니다.

```tsx
type ButtonRef = PolymorphicRef<"button">;
// React.Ref<HTMLButtonElement> | undefined
```

Ref 타입을 별도로 분리하면 Ref를 지원하는 Polymorphic Component의 타입을 구성할 때 유용합니다.

## 8. Polymorphic Component Patterns

Polymorphic Component는 구현 방식에 따라 여러 패턴으로 구분할 수 있습니다.

### 8.1 The `as` Prop Pattern

가장 일반적인 방식으로 `as` Prop에 렌더링할 요소 또는 컴포넌트를 전달합니다.

```tsx
<Box as="section" />
<Box as="button" />
<Box as={CustomComponent} />
```

장점은 다음과 같습니다.

- 렌더링 대상이 명시적입니다.
- HTML 태그와 사용자 정의 컴포넌트를 함께 지원할 수 있습니다.
- 대상에 따라 Props 타입을 추론할 수 있습니다.

디자인 시스템에서 `Box`, `Text`, `Button` 등의 공통 컴포넌트를 구현할 때 자주 사용합니다.

### 8.2 The `asChild` Pattern

`asChild`는 자식 요소를 실제 렌더링 대상으로 사용하는 패턴입니다.

```tsx
function Button({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  if (asChild) {
    return children;
  }

  return <button>{children}</button>;
}
```

사용 예제는 다음과 같습니다.

```tsx
<Button>
  Default Button
</Button>

<Button asChild>
  <a href="/about">About</a>
</Button>
```

위 예제는 기본적인 구조만 보여주는 것으로, 실제 `asChild` 구현에서는 자식 요소에 Props와 Ref를 전달하고 기존 이벤트 핸들러 및 속성을 적절하게 병합하는 처리가 필요합니다.

이 패턴은 Radix UI의 Slot과 같은 구현에서 활용됩니다.

```tsx
import { Slot } from "@radix-ui/react-slot";

function Button({
  asChild,
  ...props
}: {
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<"button">) {
  const Component = asChild ? Slot : "button";

  return <Component {...props} />;
}
```

사용 예제는 다음과 같습니다.

```tsx
<Button asChild>
  <a href="/dashboard">Dashboard</a>
</Button>
```

`Slot`은 자식 요소를 실제 렌더링 대상으로 사용하면서 부모 컴포넌트의 Props를 자식에게 전달하는 역할을 합니다.

다만 `asChild` 패턴은 `as` Prop과 구현 방식이 다릅니다.

| 구분 | `as` Prop | `asChild` Pattern |
|---|---|---|
| 렌더링 대상 | Prop으로 전달 | 자식 요소 |
| 요소 선택 | 컴포넌트 내부 | 호출하는 측의 JSX |
| Props 전달 | 대상 요소에 직접 전달 | Slot 등을 통해 자식에 병합 |
| 주요 활용 | 디자인 시스템 | 조합 가능한 UI 컴포넌트 |

## 9. Limitations and Considerations

Polymorphic Component는 유연한 인터페이스를 제공하지만 모든 상황에 적합한 것은 아닙니다.

### 9.1 Semantic HTML

렌더링 대상을 자유롭게 변경할 수 있다고 해서 모든 HTML 요소를 동일한 의미로 사용할 수 있는 것은 아닙니다.

예를 들어 클릭 동작을 수행하는 요소에는 일반적으로 `<button>`을 사용하고 페이지 이동에는 `<a>`를 사용하는 것이 적절합니다.

```tsx
// Appropriate
<Button as="button" onClick={handleClick}>
  Submit
</Button>

<Button as="a" href="/about">
  About
</Button>
```

HTML 요소의 의미와 기본 동작을 고려하지 않으면 접근성과 브라우저 동작에 문제가 발생할 수 있습니다.

### 9.2 Accessibility

Polymorphic Component는 실제 렌더링 요소가 변경될 수 있으므로 접근성 요구사항을 고려해야 합니다.

예를 들어 `<div>`를 버튼처럼 사용한다면 키보드 접근, 포커스 관리, 역할 및 상태 정보 등을 직접 구현해야 할 수 있습니다.

가능하면 의미에 맞는 네이티브 HTML 요소를 사용하는 것이 좋습니다.

### 9.3 Prop Conflicts

컴포넌트 자체의 Props와 렌더링 대상의 Props가 동일한 이름을 사용할 수 있습니다.

```tsx
type OwnProps = {
  color?: "primary" | "secondary";
};
```

렌더링 대상의 `color` 타입과 자체 `color` 타입이 다르면 충돌이 발생할 수 있습니다.

이 경우 `Omit`으로 대상의 기존 Prop을 제거한 후 자체 Prop을 적용하는 방식으로 해결할 수 있습니다.

```tsx
type PolymorphicProps<
  C extends ElementType,
  OwnProps = {},
> = OwnProps &
  Omit<
    ComponentPropsWithoutRef<C>,
    keyof OwnProps | "as"
  > & {
    as?: C;
  };
```

### 9.4 Custom Component Compatibility

사용자 정의 컴포넌트를 렌더링 대상으로 전달할 경우 해당 컴포넌트가 전달받은 Props를 적절하게 처리해야 합니다.

예를 들어 Ref를 전달하려면 사용자 정의 컴포넌트가 해당 Ref 전달 방식을 지원해야 합니다.

또한 `as` Prop으로 전달한 컴포넌트가 특정 Props를 필수로 요구한다면 해당 Props를 호출하는 측에서 제공해야 합니다.

### 9.5 Type Complexity

Polymorphic Component는 Generic, Conditional Type, `Omit`, `ComponentPropsWithoutRef` 등을 조합하므로 타입 정의가 복잡해질 수 있습니다.

특히 다음과 같은 경우에는 타입 안정성을 별도로 검증해야 합니다.

- 사용자 정의 컴포넌트를 렌더링 대상으로 전달하는 경우
- Ref를 지원하는 경우
- 자체 Props와 대상 Props가 충돌하는 경우
- 기본 렌더링 요소를 지정하는 경우
- React 버전에 따라 Ref 처리 방식이 달라지는 경우

컴포넌트의 사용성이 타입 유틸리티의 복잡성보다 중요할 수 있으므로 필요한 범위에서만 Polymorphic 설계를 적용하는 것이 좋습니다.

## 10. Best Practices

Polymorphic Component를 설계할 때는 다음 사항을 고려하는 것이 좋습니다.

### 10.1 `React.ElementType`을 사용합니다.

HTML 태그와 사용자 정의 컴포넌트를 모두 지원해야 한다면 `React.ElementType`을 활용합니다.

### 10.2 대상 컴포넌트의 Props를 추출합니다.

`React.ComponentPropsWithoutRef<C>` 또는 `React.ComponentPropsWithRef<C>`를 활용하여 렌더링 대상에 맞는 Props를 제공합니다.

### 10.3 `Omit`으로 Props 충돌을 방지합니다.

컴포넌트 자체의 Props와 대상 컴포넌트의 Props가 중복되지 않도록 명시적으로 제거합니다.

### 10.4 기본 렌더링 요소를 지정합니다.

Generic의 기본 타입을 설정하면 `as` Prop을 생략했을 때의 렌더링 대상을 명확하게 정의할 수 있습니다.

### 10.5 Ref 지원 여부를 명확하게 결정합니다.

Ref가 필요하지 않다면 `ComponentPropsWithoutRef`를 사용하고, 필요하다면 `ComponentPropsWithRef`를 기반으로 Ref 타입을 설계합니다.

React 18 이하와 React 19 이상의 Ref 전달 방식 차이도 고려해야 합니다.

### 10.6 HTML 의미와 접근성을 유지합니다.

렌더링 요소를 변경하더라도 해당 요소의 기본 의미와 키보드 동작, 접근성 요구사항을 유지해야 합니다.

### 10.7 지나친 추상화를 피합니다.

모든 컴포넌트가 Polymorphic 구조를 가져야 하는 것은 아닙니다.

렌더링 대상 변경이 실제 요구사항인 경우에만 적용하고, 단순한 UI 컴포넌트라면 고정된 HTML 요소를 사용하는 것이 더 명확할 수 있습니다.

## 11. Summary

Polymorphic Component는 하나의 컴포넌트가 여러 HTML 요소 또는 사용자 정의 컴포넌트로 렌더링될 수 있도록 설계하는 패턴입니다.

TypeScript의 Generic과 React Props 유틸리티 타입을 활용하면 렌더링 대상에 따라 허용되는 Props를 동적으로 추론할 수 있습니다.

| 개념 | 주요 타입 및 API |
|---|---|
| 렌더링 대상 | `React.ElementType` |
| 컴포넌트 Props 추출 | `React.ComponentProps<T>` |
| Ref 제외 Props | `React.ComponentPropsWithoutRef<T>` |
| Ref 포함 Props | `React.ComponentPropsWithRef<T>` |
| Props 충돌 제거 | `Omit<T, K>` |
| Generic 기본 타입 | `<C extends ElementType = "div">` |
| Ref 타입 추출 | `ComponentPropsWithRef<C>["ref"]` |
| 렌더링 대상 변경 | `as` Prop |
| 자식 요소 기반 렌더링 | `asChild` Pattern |
| Props 조합 | Intersection Type (`&`) |

Polymorphic Component의 핵심은 렌더링 대상의 변경과 Props 타입 추론을 연결하는 것입니다.

`React.ElementType`으로 렌더링 대상을 제한하고 `ComponentPropsWithoutRef` 또는 `ComponentPropsWithRef`로 대상의 Props를 추출하면 재사용성과 타입 안정성을 함께 확보할 수 있습니다.

다만 타입의 유연성만 고려해서는 안 되며 HTML 의미, 접근성, Ref 전달 방식 및 실제 컴포넌트의 동작을 함께 설계해야 합니다.

## 12. References

- [React 공식 문서 - TypeScript](https://react.dev/learn/typescript)
  - React 컴포넌트와 Props를 TypeScript로 정의하는 방법을 설명합니다.
- [React 공식 문서 - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - 컴포넌트 간 Props 전달과 타입 설계의 기본 개념을 설명합니다.
- [React 공식 문서 - forwardRef](https://react.dev/reference/react/forwardRef)
  - React 18 이하에서 Ref를 전달하는 방법과 React 19에서의 변경 사항을 설명합니다.
- [React 공식 문서 - createElement](https://react.dev/reference/react/createElement)
  - 동적으로 React Element를 생성하는 방법을 설명합니다.
- [React 공식 문서 - React APIs](https://react.dev/reference/react)
  - React의 주요 API 및 타입 관련 개념을 확인할 수 있습니다.
- [TypeScript 공식 문서 - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - Generic을 활용한 재사용 가능한 타입 설계 방법을 설명합니다.
- [TypeScript 공식 문서 - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - `Omit`, `Pick`, `Partial` 등의 유틸리티 타입을 설명합니다.
- [TypeScript 공식 문서 - Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
  - 기존 타입을 조합하고 변환하는 방법을 설명합니다.
- [Radix UI - Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
  - `asChild` 패턴을 구현하는 Slot 컴포넌트의 동작과 사용 방법을 설명합니다.
- [TypeScript React Cheatsheet - Advanced Patterns](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/)
  - React와 TypeScript를 조합한 컴포넌트 타입 설계 및 고급 패턴을 설명합니다.