# Type Assertions

## 1. Type Assertion이란?

Type Assertion(타입 단언)은 개발자가 특정 값의 타입을 TypeScript 컴파일러에 명시적으로 알려주는 기능입니다.

TypeScript는 정적 분석을 통해 변수와 표현식의 타입을 추론합니다. 그러나 외부 라이브러리, DOM API, API 응답, 동적 데이터 등에서는 컴파일러가 실제 타입을 정확하게 파악하지 못하는 경우가 있습니다.

이러한 상황에서 개발자는 해당 값이 특정 타입이라고 판단하는 근거가 있을 때 Type Assertion을 사용하여 컴파일러의 타입 해석을 보완할 수 있습니다.

```typescript
const value: unknown = "Hello, TypeScript";

const message = value as string;

console.log(message.toUpperCase());
```

위 예제에서 `value`의 선언된 타입은 `unknown`입니다. `unknown` 타입의 값은 구체적인 타입을 확인하거나 단언하지 않으면 해당 타입의 메서드를 직접 호출할 수 없습니다.

`value as string`은 해당 값이 `string` 타입이라고 컴파일러에 단언합니다.

다만 Type Assertion은 실제 값을 변환하거나 런타임 타입을 검사하지 않습니다. 컴파일러의 정적 타입 검사에만 영향을 미칩니다.

## 2. Type Assertion 문법

TypeScript는 두 가지 Type Assertion 문법을 제공합니다.

### 2.1. as 문법

`as` 키워드를 사용하는 방식으로, 일반적인 TypeScript 코드에서 가장 널리 사용됩니다.

```typescript
const value: unknown = "React";

const text = value as string;

console.log(text.length);
```

기존 표현식 뒤에 `as`와 단언할 타입을 작성합니다.

```typescript
expression as Type
```

`as` 문법은 변수, 함수 반환값, 객체 프로퍼티, DOM 요소 등 다양한 표현식에 적용할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
}

const response: unknown = {
  id: 1,
  name: "Kim",
};

const user = response as User;

console.log(user.name);
```

### 2.2. Angle-bracket 문법

꺾쇠괄호를 사용하는 방식으로도 타입 단언을 표현할 수 있습니다.

```typescript
const value: unknown = "React";

const text = <string>value;

console.log(text.length);
```

문법은 다음과 같습니다.

```typescript
<Type>expression
```

그러나 JSX와 함께 사용하는 TypeScript에서는 이 문법을 사용할 수 없습니다. JSX의 태그 문법과 `<Type>` 형태가 충돌하기 때문입니다.

```tsx
// JSX 환경에서는 타입 단언으로 해석할 수 없습니다.
const text = <string>value;
```

따라서 React와 TSX 환경에서는 `as` 문법을 사용하는 것이 일반적입니다.

## 3. Type Assertion의 타입 호환성

Type Assertion은 임의의 타입을 제한 없이 지정할 수 있는 기능이 아닙니다.

TypeScript는 일반적으로 원본 타입과 단언 대상 타입 사이에 충분한 구조적 호환성이 있는지 검사합니다.

```typescript
const value = "Hello";

const text = value as string;
```

위 코드는 원본 값의 타입과 단언 대상 타입이 동일하므로 허용됩니다.

반면 서로 관련성이 없는 타입으로 직접 단언하면 컴파일 오류가 발생할 수 있습니다.

```typescript
const value = "Hello";

// 컴파일 오류
const count = value as number;
```

이러한 제약은 타입 단언으로 인해 명백히 잘못된 타입 관계가 만들어지는 것을 일부 방지합니다.

### 3.1. Double Assertion

원본 타입과 단언 대상 타입 사이에 직접적인 호환성이 부족한 경우 `unknown` 또는 `any`를 중간 타입으로 사용하여 타입 단언을 연결할 수 있습니다.

```typescript
const value = "Hello";

const count = value as unknown as number;
```

위 코드는 다음 두 단계로 구성됩니다.

1. `string` 타입의 값을 `unknown` 타입으로 단언합니다.
2. `unknown` 타입의 값을 `number` 타입으로 다시 단언합니다.

`unknown`은 모든 타입의 값을 할당받을 수 있으므로 이러한 중간 단언이 가능합니다.

그러나 Double Assertion은 컴파일러의 타입 호환성 검사를 우회할 뿐, 실제 값을 변환하지 않습니다.

```typescript
const value = "123";

const count = value as unknown as number;

console.log(typeof count); // "string"
console.log(count + 1);    // "1231"
```

`count`는 TypeScript에서 `number`로 취급되지만 런타임에서는 여전히 문자열입니다.

따라서 Double Assertion은 일반적인 타입 설계 방식으로 사용하지 않는 것이 좋으며, 외부 라이브러리의 부정확한 타입 정의를 우회해야 하는 등 제한적인 상황에서만 사용해야 합니다.

## 4. Type Assertion과 Type Conversion의 차이

Type Assertion과 Type Conversion(타입 변환)은 서로 다른 개념입니다.

- Type Assertion: 컴파일러에 값의 타입을 특정 타입으로 취급하도록 단언합니다.
- Type Conversion: 실제 런타임 값의 표현이나 타입을 변환합니다.

```typescript
const value: unknown = "123";

// Type Assertion
const asserted = value as number;

// Type Conversion
const converted = Number(value);

console.log(typeof asserted);  // "string"
console.log(typeof converted); // "number"
```

`value as number`는 정적 타입 정보만 변경합니다. 실제 값은 문자열로 유지됩니다.

반면 `Number(value)`는 JavaScript의 숫자 변환 연산을 수행하여 실제 런타임 값을 숫자로 변환합니다.

외부 데이터를 특정 타입으로 사용해야 하는 경우에는 타입 단언만으로 충분하지 않습니다. 실제 데이터의 구조와 값을 검증하거나 필요한 변환을 수행해야 합니다.

## 5. Type Assertion의 주요 활용 사례

### 5.1. DOM 요소 접근

DOM API에서 `document.querySelector()`와 같은 메서드는 기본적으로 `Element | null` 타입을 반환합니다.

특정 HTML 요소의 프로퍼티나 메서드를 사용하려면 더 구체적인 타입이 필요할 수 있습니다.

```typescript
const input = document.querySelector("#username") as HTMLInputElement;

input.value = "React Developer";
```

위 코드에서는 선택된 요소가 `HTMLInputElement`라고 단언합니다.

다만 해당 선택자가 실제로 입력 요소를 반환한다는 보장은 없습니다. 잘못된 요소를 선택하면 타입 단언과 실제 DOM 구조가 일치하지 않을 수 있습니다.

보다 안전한 방식은 런타임 타입 검사와 null 검사를 함께 수행하는 것입니다.

```typescript
const element = document.querySelector("#username");

if (element instanceof HTMLInputElement) {
  element.value = "React Developer";
}
```

또는 제네릭을 사용하는 `querySelector`를 활용할 수 있습니다.

```typescript
const input = document.querySelector<HTMLInputElement>("#username");

if (input) {
  input.value = "React Developer";
}
```

이 방식은 반환 타입을 구체화하면서도 `null` 가능성을 유지합니다.

### 5.2. API 응답 데이터

외부 API에서 전달받은 데이터는 컴파일 시점에 실제 구조를 확인할 수 없습니다.

다음과 같이 타입 단언을 사용하면 응답을 특정 인터페이스로 취급할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(): Promise<User> {
  const response = await fetch("/api/users/1");

  const data = await response.json();

  return data as User;
}
```

그러나 `response.json()`의 반환값을 `User`로 단언한다고 해서 실제 응답 데이터가 해당 구조를 만족하는지 검증되는 것은 아닙니다.

안전한 데이터 처리를 위해서는 `unknown`으로 취급한 뒤 런타임 검증을 수행하는 방식이 적절합니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string" &&
    "email" in value &&
    typeof value.email === "string"
  );
}

async function fetchUser(): Promise<User> {
  const response = await fetch("/api/users/1");

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error("Invalid user response");
  }

  return data;
}
```

이 방식은 단순히 타입을 단언하는 대신 런타임에서 데이터 구조를 확인합니다.

### 5.3. 객체의 구체적인 타입 지정

객체 리터럴의 타입 추론 결과가 의도한 타입과 다르거나, 특정 인터페이스를 만족하는 객체임을 명시해야 하는 경우에도 타입 단언을 사용할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
}

const user = {
  id: 1,
  name: "Kim",
} as User;
```

다만 객체의 구조가 명확한 경우에는 타입 단언보다 변수 선언 시 타입을 지정하는 방식이 더 적절할 수 있습니다.

```typescript
const user: User = {
  id: 1,
  name: "Kim",
};
```

변수 선언에 타입을 지정하면 객체가 `User`의 구조를 만족하는지 검사할 수 있습니다.

반면 타입 단언은 개발자가 해당 타입이라고 판단했음을 컴파일러에 전달하는 것이므로, 타입 검사 과정에서 일부 오류를 놓칠 수 있습니다.

### 5.4. as const를 이용한 리터럴 타입 보존

`as const`는 일반적인 타입 단언과 구별되는 특별한 형태로, 값의 리터럴 타입과 읽기 전용 속성을 유지합니다.

```typescript
const status = "success" as const;

// status: "success"
```

일반적인 문자열 리터럴은 사용 위치에 따라 `string`으로 확장될 수 있지만, `as const`를 사용하면 구체적인 리터럴 타입이 유지됩니다.

객체와 배열에도 적용할 수 있습니다.

```typescript
const config = {
  method: "GET",
  retry: 3,
} as const;

// {
//   readonly method: "GET";
//   readonly retry: 3;
// }
```

배열에 적용하면 읽기 전용 튜플 타입으로 추론됩니다.

```typescript
const directions = ["left", "right"] as const;

// readonly ["left", "right"]
```

`as const`는 리터럴 타입을 보존하고 읽기 전용 타입을 생성하지만, 런타임 객체 자체를 불변 객체로 변경하지는 않습니다.

## 6. Non-null Assertion Operator

Non-null Assertion Operator(`!`)는 특정 표현식이 `null` 또는 `undefined`가 아님을 컴파일러에 단언하는 연산자입니다.

TypeScript의 `strictNullChecks`가 활성화된 환경에서는 null 가능성이 있는 값을 사용하기 전에 해당 가능성을 처리해야 합니다.

```typescript
const element = document.querySelector("#root");

element.innerHTML = "Hello";
```

위 코드는 `element`가 `null`일 가능성이 있기 때문에 컴파일 오류가 발생합니다.

Non-null Assertion Operator를 사용하면 null 또는 undefined 가능성을 타입에서 제거할 수 있습니다.

```typescript
const element = document.querySelector("#root")!;

element.innerHTML = "Hello";
```

이때 `!`는 런타임 null 검사를 수행하지 않습니다. 단지 컴파일러가 해당 값을 null이 아닌 것으로 취급하도록 합니다.

따라서 실제 값이 `null`이라면 런타임 오류가 발생할 수 있습니다.

### 6.1. Optional Chaining과의 차이

Non-null Assertion과 Optional Chaining은 null 가능성을 처리하는 방식이 다릅니다.

```typescript
const element = document.querySelector("#root");

// Non-null Assertion
element!.innerHTML = "Hello";

// Optional Chaining
element?.classList.add("active");
```

- `element!`: null 또는 undefined가 아니라고 단언합니다.
- `element?.`: null 또는 undefined인 경우 뒤의 프로퍼티 접근을 실행하지 않습니다.

Optional Chaining은 런타임에서 null 가능성을 처리하지만, Non-null Assertion은 컴파일러의 타입 검사만 변경합니다.

가능하다면 다음과 같이 명시적인 null 검사를 사용하는 것이 안전합니다.

```typescript
const element = document.querySelector("#root");

if (element !== null) {
  element.innerHTML = "Hello";
}
```

## 7. React에서의 Type Assertion

React와 TypeScript를 함께 사용하는 환경에서도 Type Assertion은 DOM 접근, 이벤트 처리, 외부 데이터 처리 등에서 활용됩니다.

### 7.1. useRef와 DOM 요소

`useRef`를 이용해 DOM 요소에 접근할 때는 참조 대상 요소의 타입을 지정해야 합니다.

```tsx
import { useRef } from "react";

function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>
        Focus
      </button>
    </div>
  );
}
```

위 예제에서는 `useRef<HTMLInputElement>(null)`을 통해 참조 대상이 `HTMLInputElement`임을 지정합니다.

`current`는 초기 상태에서 `null`일 수 있으므로 Optional Chaining을 사용하여 안전하게 접근합니다.

이 경우에는 제네릭을 통한 타입 지정이므로 불필요한 Type Assertion을 사용하지 않아도 됩니다.

### 7.2. 이벤트 타깃 접근

React 이벤트 객체의 `target`과 `currentTarget`은 서로 다른 의미를 가집니다.

- `target`: 이벤트가 실제로 발생한 요소입니다.
- `currentTarget`: 현재 이벤트 핸들러가 등록된 요소입니다.

특정 요소의 타입을 확신할 수 있다면 Type Assertion을 사용할 수 있습니다.

```tsx
import type { ChangeEvent } from "react";

function SearchInput() {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;

    console.log(input.value);
  };

  return <input onChange={handleChange} />;
}
```

그러나 위 예제에서는 `ChangeEvent<HTMLInputElement>`로 이벤트 타입을 이미 지정했으므로 `event.target`도 입력 요소 타입으로 처리됩니다.

따라서 다음과 같이 직접 사용하는 편이 더 간결합니다.

```tsx
import type { ChangeEvent } from "react";

function SearchInput() {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  return <input onChange={handleChange} />;
}
```

이벤트 핸들러의 타입을 정확하게 지정하면 불필요한 Type Assertion을 줄일 수 있습니다.

### 7.3. 외부 라이브러리와의 연동

외부 라이브러리의 타입 정의가 실제 사용 방식과 일치하지 않거나, 라이브러리가 제공하는 값의 타입을 구체화해야 하는 경우에도 Type Assertion을 사용할 수 있습니다.

```tsx
interface ChartInstance {
  update(): void;
  destroy(): void;
}

function updateChart(instance: unknown) {
  const chart = instance as ChartInstance;

  chart.update();
}
```

다만 외부 라이브러리의 실제 객체가 `ChartInstance`의 구조를 만족하는지 확인할 수 있어야 합니다.

타입 정의가 부정확한 경우에는 타입 단언을 반복적으로 추가하기보다 라이브러리의 공식 타입 정의를 확인하거나 별도의 타입 어댑터를 작성하는 방식이 유지보수에 유리합니다.

## 8. Type Assertion과 Type Guard의 차이

Type Assertion과 Type Guard는 모두 특정 값의 타입을 구체화하는 데 사용할 수 있지만, 타입을 구체화하는 근거와 방식이 다릅니다.

| 구분 | Type Assertion | Type Guard |
|---|---|---|
| 목적 | 개발자가 특정 타입이라고 단언 | 런타임 조건을 통해 타입 판별 |
| 런타임 검사 | 수행하지 않음 | 조건에 따라 수행 |
| 타입 안전성 | 개발자의 판단에 의존 | 검사 결과를 기반으로 타입 좁히기 |
| 대표 문법 | `as Type` | `typeof`, `instanceof`, `in`, Type Predicate |
| 주요 용도 | 컴파일러가 알 수 없는 타입 정보 보완 | 값의 실제 타입 확인 |

Type Assertion은 개발자가 타입을 알고 있다는 전제에서 사용합니다.

```typescript
function printLength(value: unknown) {
  const text = value as string;

  console.log(text.length);
}
```

위 코드는 `value`가 실제 문자열인지 확인하지 않습니다. 문자열이 아닌 값이 전달되면 런타임 오류가 발생할 수 있습니다.

반면 Type Guard는 실제 조건을 검사한 뒤 타입을 좁힙니다.

```typescript
function printLength(value: unknown) {
  if (typeof value === "string") {
    console.log(value.length);
  }
}
```

이 방식은 문자열인 경우에만 `length`에 접근하므로 타입 안정성이 높습니다.

따라서 런타임에서 값의 타입을 확인할 수 있는 경우에는 Type Guard를 우선적으로 사용하는 것이 좋습니다.

## 9. Type Assertion 사용 시 주의사항

### 9.1. 런타임 검증을 대체하지 않습니다

Type Assertion은 실제 데이터의 타입이나 구조를 검증하지 않습니다.

```typescript
interface User {
  id: number;
  name: string;
}

const response: unknown = {
  id: "invalid",
  name: 123,
};

const user = response as User;
```

위 코드는 컴파일될 수 있지만 실제 객체는 `User` 인터페이스의 구조를 만족하지 않습니다.

외부 API, 사용자 입력, JSON 파싱 결과 등 신뢰할 수 없는 데이터에는 런타임 검증을 적용해야 합니다.

### 9.2. 타입 단언을 남용하지 않습니다

다음과 같이 여러 단계의 타입 단언을 반복하면 타입 시스템의 보호 기능을 약화시킬 수 있습니다.

```typescript
const value = getExternalValue();

const result = value as unknown as SomeType;
```

타입 단언이 반복되는 코드는 데이터 흐름이나 타입 설계에 문제가 있다는 신호일 수 있습니다.

가능하면 다음과 같은 방법을 먼저 검토해야 합니다.

- 변수 선언 시 정확한 타입 지정
- 함수 매개변수와 반환 타입 정의
- 제네릭을 통한 타입 정보 전달
- Type Guard를 통한 런타임 타입 검사
- 외부 데이터의 스키마 검증
- 라이브러리의 타입 정의 보완

### 9.3. Non-null Assertion을 신중하게 사용합니다

`!` 연산자는 null 가능성을 제거하지만 실제 값의 존재를 보장하지 않습니다.

```typescript
const user = users.find((item) => item.id === 1)!;

console.log(user.name);
```

조건에 맞는 사용자가 존재하지 않으면 `find()`는 `undefined`를 반환합니다. 이 경우 `!`를 사용해도 런타임 오류를 방지할 수 없습니다.

다음과 같이 반환값을 검사하는 방식이 더 안전합니다.

```typescript
const user = users.find((item) => item.id === 1);

if (!user) {
  throw new Error("User not found");
}

console.log(user.name);
```

### 9.4. 타입 단언보다 타입 추론과 명시적 타입 지정을 우선합니다

TypeScript는 변수, 함수, 객체 등의 타입을 자동으로 추론할 수 있습니다.

불필요한 타입 단언은 코드의 복잡성을 높이고 타입 오류를 발견하기 어렵게 만들 수 있습니다.

```typescript
// 불필요한 타입 단언
const name = "React" as string;

// 타입 추론 활용
const name = "React";
```

타입을 명확하게 표현해야 하는 경우에는 타입 단언보다 명시적 타입 지정을 우선적으로 검토해야 합니다.

```typescript
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "Kim",
};
```

## 10. 정리

Type Assertion은 개발자가 특정 값의 타입을 알고 있지만 TypeScript 컴파일러가 해당 정보를 추론하지 못하는 상황에서 사용하는 기능입니다.

핵심 사항은 다음과 같습니다.

- `as Type`과 `<Type>` 문법으로 타입을 단언할 수 있습니다.
- TSX 환경에서는 JSX 문법과의 충돌을 방지하기 위해 `as` 문법을 사용합니다.
- Type Assertion은 컴파일러의 타입 해석만 변경하며 런타임 값은 변환하지 않습니다.
- `as unknown as Type` 형태의 Double Assertion은 타입 호환성 검사를 우회하므로 신중하게 사용해야 합니다.
- `as const`는 리터럴 타입을 보존하고 읽기 전용 타입을 생성합니다.
- Non-null Assertion Operator(`!`)는 null 및 undefined 가능성을 타입에서 제거하지만 런타임 검사를 수행하지 않습니다.
- 외부 데이터와 사용자 입력은 Type Assertion만으로 안전성을 확보할 수 없으므로 런타임 검증이 필요합니다.
- 실제 타입을 검사할 수 있는 상황에서는 Type Assertion보다 Type Guard를 우선적으로 사용하는 것이 좋습니다.

Type Assertion은 TypeScript의 정적 타입 시스템을 보완하는 기능이지, 타입 안정성을 보장하는 기능은 아닙니다. 따라서 타입 단언이 필요한 이유와 실제 값의 구조를 확인할 수 있는 근거를 함께 고려해야 합니다.

## 참고자료

- [TypeScript Handbook - Everyday Types: Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [TypeScript Handbook - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Const Assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- [TypeScript TSConfig - strictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)