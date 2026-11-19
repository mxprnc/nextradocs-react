# Typing Props

React 컴포넌트의 Props(Properties)는 부모 컴포넌트에서 자식 컴포넌트로 전달되는 데이터와 설정값을 의미합니다.

TypeScript를 함께 사용하는 환경에서는 Props의 타입을 명시적으로 정의하여 컴포넌트에 전달되는 데이터의 구조와 타입을 제한할 수 있습니다.

Props 타입을 정의하면 잘못된 데이터 전달을 컴파일 단계에서 확인할 수 있으며, 컴포넌트가 요구하는 입력값과 선택적으로 전달할 수 있는 속성을 명확하게 표현할 수 있습니다.

## 1. Defining Props Types

Props는 일반적으로 객체 형태로 전달되므로 TypeScript의 `type` 또는 `interface`를 사용하여 타입을 정의합니다.

### 1.1 Using Type Alias

`type`을 사용하여 Props의 구조를 정의할 수 있습니다.

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
```

`UserProps`는 컴포넌트가 전달받는 Props의 구조를 정의합니다.

- `name`: 문자열 타입의 필수 속성입니다.
- `age`: 숫자 타입의 필수 속성입니다.
- `email`: 문자열 타입의 필수 속성입니다.

컴포넌트를 사용하는 측에서는 정의된 타입에 맞는 값을 전달해야 합니다.

```tsx
function App() {
  return (
    <User
      name="Alice"
      age={30}
      email="alice@example.com"
    />
  );
}
```

### 1.2 Using Interface

`interface`를 사용해도 동일한 Props 타입을 정의할 수 있습니다.

```tsx
interface UserProps {
  name: string;
  age: number;
  email: string;
}

function User({ name, age, email }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
      <p>{email}</p>
    </div>
  );
}
```

`type`과 `interface`는 일반적인 객체 형태의 Props를 정의하는 데 모두 사용할 수 있습니다.

다만 다음과 같은 차이가 있습니다.

| 구분 | type | interface |
|---|---|---|
| 객체 타입 정의 | 지원 | 지원 |
| Union Type | 지원 | 직접 지원하지 않음 |
| Intersection Type | 지원 | `extends` 등으로 조합 가능 |
| 타입 확장 | Intersection 활용 | `extends` 활용 |
| 선언 병합 | 지원하지 않음 | 지원 |

프로젝트에서는 둘 중 하나를 일관되게 사용하는 것이 중요합니다.

## 2. Required and Optional Props

Props의 속성은 필수(Required) 또는 선택(Optional)으로 정의할 수 있습니다.

### 2.1 Required Props

기본적으로 타입에 선언된 속성은 필수 속성입니다.

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
```

`Button` 컴포넌트를 사용할 때는 두 속성을 모두 전달해야 합니다.

```tsx
<Button label="Submit" disabled={false} />
```

다음과 같이 필수 속성을 누락하면 TypeScript 오류가 발생합니다.

```tsx
// Type Error: disabled 속성이 누락되었습니다.
<Button label="Submit" />
```

### 2.2 Optional Props

속성 이름 뒤에 `?`를 지정하면 선택적 속성으로 정의됩니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

function Button({
  label,
  disabled,
  variant,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      data-variant={variant}
    >
      {label}
    </button>
  );
}
```

선택적 속성은 전달하지 않아도 됩니다.

```tsx
<Button label="Submit" />

<Button
  label="Cancel"
  disabled
  variant="secondary"
/>
```

선택적 속성은 값이 전달되지 않은 경우 `undefined`가 될 수 있으므로 이를 고려하여 처리해야 합니다.

```tsx
function Button({ disabled }: ButtonProps) {
  if (disabled) {
    return <button disabled>Disabled</button>;
  }

  return <button>Enabled</button>;
}
```

## 3. Default Props Values

선택적 Props에 기본값을 지정하면 값이 전달되지 않았을 때 해당 기본값을 사용할 수 있습니다.

함수형 컴포넌트에서는 구조 분해 할당(Destructuring Assignment)의 기본값을 사용하는 방식이 일반적입니다.

```tsx
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

function Button({
  label,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      data-variant={variant}
    >
      {label}
    </button>
  );
}
```

다음과 같이 `variant`와 `disabled`를 생략해도 기본값이 적용됩니다.

```tsx
<Button label="Submit" />
```

기본값은 실제 값이 `undefined`인 경우에 적용됩니다.

```tsx
type Props = {
  count?: number;
};

function Counter({ count = 0 }: Props) {
  return <p>{count}</p>;
}
```

- `count`를 생략하면 `0`이 적용됩니다.
- `count={undefined}`를 전달해도 `0`이 적용됩니다.
- `count={null}`은 타입 오류가 발생합니다.

기본값을 지정했다고 해서 해당 Props가 필수 속성으로 변경되는 것은 아닙니다. 기본값을 사용하는 Props는 일반적으로 선택적 속성으로 선언합니다.

## 4. Union Types for Props

Union Type을 사용하면 Props에 허용되는 값의 범위를 제한할 수 있습니다.

특정 문자열이나 숫자만 허용해야 하는 경우 유용합니다.

### 4.1 String Literal Union

```tsx
type ButtonProps = {
  label: string;
  variant: "primary" | "secondary" | "danger";
};

function Button({ label, variant }: ButtonProps) {
  return (
    <button data-variant={variant}>
      {label}
    </button>
  );
}
```

`variant`에는 정의된 세 가지 문자열만 전달할 수 있습니다.

```tsx
<Button label="Save" variant="primary" />

<Button label="Delete" variant="danger" />

// Type Error
// <Button label="Save" variant="success" />
```

이를 통해 컴포넌트의 설정값을 제한하고 잘못된 값이 전달되는 것을 방지할 수 있습니다.

### 4.2 Discriminated Union

Discriminated Union은 공통 구분 속성(Discriminant)을 기반으로 서로 다른 객체 타입을 구분하는 방식입니다.

컴포넌트의 특정 Props 조합에 따라 허용되는 속성을 다르게 정의할 때 유용합니다.

```tsx
type InputProps =
  | {
      type: "text";
      value: string;
      maxLength?: number;
    }
  | {
      type: "number";
      value: number;
      min?: number;
      max?: number;
    };

function Input(props: InputProps) {
  if (props.type === "text") {
    return (
      <input
        type="text"
        value={props.value}
        maxLength={props.maxLength}
        readOnly
      />
    );
  }

  return (
    <input
      type="number"
      value={props.value}
      min={props.min}
      max={props.max}
      readOnly
    />
  );
}
```

`type` 속성을 기준으로 TypeScript가 현재 Props의 구체적인 타입을 좁힙니다.

- `type: "text"`인 경우 `value`는 문자열입니다.
- `type: "number"`인 경우 `value`는 숫자입니다.
- 각 분기에서 해당 타입에만 존재하는 속성을 안전하게 사용할 수 있습니다.

다음과 같이 잘못된 조합을 전달하면 타입 오류가 발생합니다.

```tsx
<Input type="text" value="Hello" />

<Input type="number" value={100} />

// Type Error
// <Input type="text" value={100} />
```

Discriminated Union은 컴포넌트의 동작 방식에 따라 Props의 유효한 조합을 제한할 때 효과적입니다.

## 5. Extending Props Types

기존 Props 타입을 확장하면 공통 속성을 재사용하면서 새로운 속성을 추가할 수 있습니다.

### 5.1 Interface Extension

`interface`는 `extends`를 사용하여 다른 인터페이스를 확장할 수 있습니다.

```tsx
interface BaseProps {
  id: string;
  className?: string;
}

interface ButtonProps extends BaseProps {
  label: string;
  disabled?: boolean;
}

function Button({
  id,
  className,
  label,
  disabled,
}: ButtonProps) {
  return (
    <button
      id={id}
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

`ButtonProps`는 `BaseProps`의 속성을 상속받으므로 `id`와 `className`을 별도로 선언할 필요가 없습니다.

### 5.2 Intersection Types

`type`은 Intersection Type(`&`)을 사용하여 여러 타입을 결합할 수 있습니다.

```tsx
type BaseProps = {
  id: string;
  className?: string;
};

type ButtonProps = BaseProps & {
  label: string;
  disabled?: boolean;
};

function Button({
  id,
  className,
  label,
  disabled,
}: ButtonProps) {
  return (
    <button
      id={id}
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

Intersection Type은 여러 타입의 속성을 결합하여 하나의 타입으로 구성합니다.

다만 동일한 속성이 서로 호환되지 않는 타입으로 정의되어 있다면 예상과 다른 결과가 발생할 수 있으므로 주의해야 합니다.

## 6. Extending HTML Element Props

React 컴포넌트에서 기존 HTML 요소의 속성을 그대로 지원해야 하는 경우가 있습니다.

예를 들어 사용자 정의 Button 컴포넌트가 `disabled`, `type`, `onClick`, `className` 등 기본 HTML Button 속성을 지원하도록 구성할 수 있습니다.

이때 `React.ComponentProps`를 활용하면 기존 HTML 요소에 정의된 Props 타입을 재사용할 수 있습니다.

### 6.1 React.ComponentProps

`React.ComponentProps`는 특정 컴포넌트 또는 JSX 요소의 Props 타입을 추출하는 유틸리티 타입입니다.

```tsx
type ButtonProps = React.ComponentProps<"button">;

function Button(props: ButtonProps) {
  return <button {...props} />;
}
```

위 예제에서 `ButtonProps`는 HTML `<button>` 요소에 적용할 수 있는 Props 타입을 나타냅니다.

따라서 별도로 정의하지 않아도 다음과 같은 속성을 사용할 수 있습니다.

```tsx
<Button
  type="submit"
  disabled
  className="submit-button"
  onClick={() => console.log("Clicked")}
/>
```

### 6.2 Extending Native HTML Props

기존 HTML 속성에 사용자 정의 속성을 추가할 수도 있습니다.

```tsx
type ButtonProps = React.ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

function Button({
  variant = "primary",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      {...rest}
    >
      {children}
    </button>
  );
}
```

이 방식은 기존 HTML 요소의 속성을 유지하면서 사용자 정의 컴포넌트만의 기능을 추가할 때 유용합니다.

HTML 요소의 Props 타입을 재사용하면 다음과 같은 장점이 있습니다.

- 기존 HTML 속성을 중복 선언하지 않아도 됩니다.
- DOM 이벤트의 타입을 별도로 정의하지 않아도 됩니다.
- HTML 요소의 타입 정의가 변경되더라도 이를 자연스럽게 반영할 수 있습니다.
- 사용자 정의 컴포넌트와 기본 HTML 요소 간의 인터페이스를 일관되게 유지할 수 있습니다.

### 6.3 React.ComponentPropsWithoutRef

`React.ComponentPropsWithoutRef`는 특정 요소의 Props 타입에서 `ref`를 제외한 타입을 추출합니다.

```tsx
type ButtonProps =
  React.ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary";
  };

function Button({
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      data-variant={variant}
      {...rest}
    />
  );
}
```

컴포넌트에서 `ref`를 별도로 전달하거나 처리하지 않는 경우 활용할 수 있습니다.

반대로 `ref`까지 포함한 Props 타입이 필요하다면 `React.ComponentPropsWithRef`를 사용할 수 있습니다.

이러한 타입은 DOM 요소의 속성을 기반으로 사용자 정의 컴포넌트를 설계할 때 유용합니다.

## 7. Generic Props

Generic을 사용하면 컴포넌트가 전달받는 데이터의 타입을 유연하게 정의할 수 있습니다.

특정 데이터 타입에 종속되지 않는 재사용 가능한 컴포넌트를 구현할 때 활용합니다.

### 7.1 Basic Generic Props

다음은 전달받은 값을 화면에 출력하는 컴포넌트입니다.

```tsx
type DisplayProps<T> = {
  value: T;
};

function Display<T>({ value }: DisplayProps<T>) {
  return <div>{String(value)}</div>;
}
```

`T`는 Generic Type Parameter로, 컴포넌트를 사용하는 시점에 구체적인 타입으로 결정됩니다.

```tsx
function App() {
  return (
    <>
      <Display value="Hello" />
      <Display value={100} />
      <Display value={true} />
    </>
  );
}
```

TypeScript는 전달된 값에 따라 `T`의 타입을 추론합니다.

### 7.2 Generic Props with Constraints

Generic에 제약 조건(Constraint)을 지정하면 허용되는 타입의 범위를 제한할 수 있습니다.

```tsx
type ListProps<T extends { id: number }> = {
  items: T[];
};

function List<T extends { id: number }>({
  items,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.id}
        </li>
      ))}
    </ul>
  );
}
```

`T extends { id: number }`는 Generic 타입이 반드시 숫자형 `id` 속성을 포함해야 한다는 의미입니다.

따라서 `List` 컴포넌트는 다양한 데이터 타입을 전달받으면서도 `id` 속성에 안전하게 접근할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  title: string;
};

function App() {
  return (
    <>
      <List<User>
        items={[
          { id: 1, name: "Alice" },
          { id: 2, name: "Bob" },
        ]}
      />

      <List<Product>
        items={[
          { id: 1, title: "Keyboard" },
          { id: 2, title: "Mouse" },
        ]}
      />
    </>
  );
}
```

Generic Props는 테이블, 리스트, Select, Dropdown 등 다양한 데이터 구조를 처리하는 공통 컴포넌트에서 특히 유용합니다.

## 8. Readonly Props

Props는 React의 단방향 데이터 흐름에 따라 부모 컴포넌트에서 자식 컴포넌트로 전달됩니다.

일반적으로 자식 컴포넌트는 전달받은 Props를 직접 수정하지 않고, 새로운 값이 필요하면 부모 컴포넌트에 변경을 요청하는 구조로 설계합니다.

TypeScript에서는 `readonly`를 사용하여 특정 속성의 재할당을 방지할 수 있습니다.

```tsx
type UserProps = {
  readonly id: number;
  readonly name: string;
};

function User({ id, name }: UserProps) {
  // Type Error
  // id = 100;

  // Type Error
  // name = "Bob";

  return (
    <div>
      <p>{id}</p>
      <p>{name}</p>
    </div>
  );
}
```

객체의 모든 속성을 읽기 전용으로 지정하려면 `Readonly<T>` 유틸리티 타입을 사용할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

type UserProps = {
  user: Readonly<User>;
};
```

다만 `readonly`는 컴파일 단계에서 재할당을 제한하는 타입 수준의 제약입니다. 런타임에서 객체를 완전히 불변 상태로 만드는 기능은 아닙니다.

또한 Props의 속성을 직접 재할당하지 않는 일반적인 컴포넌트 코드에서는 반드시 `readonly`를 선언해야 하는 것은 아닙니다.

## 9. Best Practices

React + TypeScript에서 Props를 설계할 때 다음 사항을 고려하는 것이 좋습니다.

### 9.1 Props의 역할을 명확하게 정의합니다.

컴포넌트가 실제로 사용하는 속성만 Props에 포함하는 것이 좋습니다.

불필요한 속성을 많이 전달하면 컴포넌트의 책임이 불명확해지고 재사용성이 낮아질 수 있습니다.

### 9.2 Optional Props를 신중하게 사용합니다.

모든 속성을 선택적으로 선언하면 컴포넌트가 정상적으로 동작하기 위해 필요한 입력값이 무엇인지 불명확해질 수 있습니다.

필수 속성과 선택적 속성을 명확하게 구분해야 합니다.

### 9.3 Union Type으로 잘못된 조합을 제한합니다.

서로 다른 동작에 따라 필요한 Props가 달라지는 경우 Discriminated Union을 활용하는 것이 좋습니다.

단순히 모든 속성을 선택적으로 만드는 것보다 유효한 Props 조합을 명시적으로 정의할 수 있습니다.

### 9.4 기존 HTML Props 타입을 재사용합니다.

버튼, 입력 필드 등 기본 HTML 요소를 감싸는 컴포넌트에서는 `React.ComponentProps` 계열 타입을 활용하면 중복된 타입 선언을 줄일 수 있습니다.

### 9.5 Generic은 실제 재사용성이 필요한 경우에 적용합니다.

Generic을 사용하면 컴포넌트의 재사용성을 높일 수 있지만, 지나치게 복잡한 타입 선언은 코드의 가독성을 떨어뜨릴 수 있습니다.

실제 여러 데이터 타입을 처리해야 하는 컴포넌트에 적용하는 것이 좋습니다.

## 10. Summary

React + TypeScript에서 Props 타입은 컴포넌트의 입력 인터페이스를 정의하는 역할을 합니다.

| 개념 | 설명 |
|---|---|
| Type Alias | Props의 객체 타입 정의 |
| Interface | Props의 객체 타입 및 확장 정의 |
| Optional Props | 선택적으로 전달할 수 있는 속성 |
| Default Values | Props가 전달되지 않을 때 사용할 기본값 |
| Union Types | 허용되는 값 또는 타입의 범위 제한 |
| Discriminated Union | 특정 속성을 기준으로 Props 타입 구분 |
| Intersection Types | 여러 타입을 결합 |
| ComponentProps | 기존 컴포넌트 또는 HTML 요소의 Props 타입 추출 |
| ComponentPropsWithoutRef | `ref`를 제외한 Props 타입 추출 |
| Generic Props | 다양한 데이터 타입을 지원하는 Props 설계 |
| Readonly Props | 타입 수준에서 속성 재할당 제한 |

Props 타입을 명확하게 정의하면 컴포넌트의 입력 규칙을 코드로 표현할 수 있으며, 재사용성과 타입 안정성을 함께 확보할 수 있습니다.

특히 Union Type, HTML 속성 타입 재사용, Generic Props는 복잡한 컴포넌트 인터페이스를 설계할 때 중요한 역할을 합니다.

## 11. References

- [React 공식 문서 - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - 컴포넌트 간 Props 전달 및 데이터 흐름을 설명합니다.
- [React 공식 문서 - Using TypeScript](https://react.dev/learn/typescript)
  - React 컴포넌트의 Props 타입 정의와 TypeScript 활용 방법을 설명합니다.
- [TypeScript 공식 문서 - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  - 기본 타입, Optional Properties, Union Types 등 일반적인 타입 시스템을 설명합니다.
- [TypeScript 공식 문서 - Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
  - 객체 타입, Interface, Optional Properties, Readonly Properties를 설명합니다.
- [TypeScript 공식 문서 - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - Generic Type Parameter와 제약 조건을 설명합니다.
- [TypeScript 공식 문서 - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - `Partial`, `Required`, `Readonly`, `Pick`, `Omit` 등 유틸리티 타입을 설명합니다.
- [React TypeScript Cheatsheet - Basic Type Examples](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/basic_type_examples/)
  - React 환경에서 Props, 컴포넌트, 이벤트 등에 활용하는 타입을 설명합니다.
- [React TypeScript Cheatsheet - Advanced Patterns](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/)
  - Generic 컴포넌트, Props 확장, 다형성 컴포넌트 등 고급 타입 설계 패턴을 설명합니다.