# Type Inference

## 1. 타입 추론(Type Inference)이란?

타입 추론(Type Inference)은 TypeScript 컴파일러가 명시적인 타입 선언 없이도 변수의 초기값, 표현식, 함수의 반환값 및 사용되는 문맥 등을 분석하여 적절한 타입을 결정하는 기능입니다.

TypeScript는 모든 변수와 함수에 타입을 명시하지 않아도 코드의 구조와 사용 방식을 분석하여 타입 정보를 추론합니다.

```typescript
let username = "Alice";
let age = 30;
let isActive = true;
```

위 코드에서는 별도의 타입 선언이 없지만, 초기값을 기반으로 다음과 같이 타입이 추론됩니다.

```typescript
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
```

타입 추론은 불필요한 타입 선언을 줄이면서도 정적 타입 검사의 이점을 유지할 수 있도록 지원합니다.

TypeScript에서 타입 추론은 단순히 변수의 초기값을 분석하는 것에 그치지 않습니다. 함수의 반환 타입, 배열 요소의 공통 타입, 함수가 사용되는 문맥 등 다양한 정보를 종합하여 타입을 결정합니다.

## 2. 타입 추론이 적용되는 위치

TypeScript는 다양한 코드 위치에서 타입을 추론합니다.

대표적인 추론 대상은 다음과 같습니다.

- 변수 및 상수의 초기값
- 객체 프로퍼티의 초기값
- 함수의 반환값
- 함수 매개변수의 기본값
- 배열 및 객체 리터럴
- 함수 호출의 인수
- 표현식이 사용되는 문맥

### 2.1. 변수 초기값을 통한 추론

변수 선언 시 초기값을 제공하면 TypeScript는 해당 값의 타입을 기반으로 변수의 타입을 추론합니다.

```typescript
let username = "Alice";
let age = 30;

username = "Bob";
age = 40;

// Type Error
username = 100;

// Type Error
age = "40";
```

초기값이 문자열이면 `string`, 숫자이면 `number`로 추론됩니다.

이후 변수에 다른 값을 할당할 때도 처음 추론된 타입을 기준으로 호환성을 검사합니다.

단, `let`과 `const`는 리터럴 타입 추론에서 차이가 있습니다. 이에 대해서는 뒤에서 별도로 설명합니다.

### 2.2. 객체 프로퍼티를 통한 추론

객체를 선언할 때도 초기값을 기반으로 각 프로퍼티의 타입을 추론합니다.

```typescript
const user = {
  id: 1,
  name: "Alice",
  isActive: true,
};
```

각 프로퍼티의 타입은 다음과 같이 추론됩니다.

```typescript
const user: {
  id: number;
  name: string;
  isActive: boolean;
};
```

추론된 타입은 객체의 구조를 기반으로 프로퍼티 접근 및 재할당을 검사하는 데 사용됩니다.

```typescript
user.name = "Bob";

// Type Error
user.name = 100;

// Type Error
user.email = "alice@example.com";
```

객체 리터럴에서 추론된 구조에 존재하지 않는 프로퍼티를 직접 추가하는 것은 허용되지 않습니다.

### 2.3. 함수 반환 타입 추론

TypeScript는 함수 내부의 반환 표현식을 분석하여 반환 타입을 추론합니다.

```typescript
function getUsername() {
  return "Alice";
}
```

위 함수의 반환 타입은 `string`으로 추론됩니다.

다음과 같이 별도의 반환 타입을 명시하지 않아도 타입 검사가 수행됩니다.

```typescript
function add(a: number, b: number) {
  return a + b;
}
```

`a`와 `b`가 `number` 타입이므로 반환값 역시 `number`로 추론됩니다.

함수 내부에서 여러 종류의 값을 반환하는 경우 반환 타입은 각 반환 표현식의 타입을 종합하여 결정됩니다.

```typescript
function getValue(flag: boolean) {
  if (flag) {
    return "Success";
  }

  return 404;
}
```

위 함수의 반환 타입은 다음과 같이 추론됩니다.

```typescript
function getValue(flag: boolean): string | number;
```

이처럼 여러 반환 경로가 존재하면 TypeScript는 반환값의 타입을 종합하여 적절한 타입을 결정합니다.

### 2.4. 매개변수 기본값을 통한 추론

함수 매개변수에 기본값을 지정하면 TypeScript는 기본값을 기반으로 해당 매개변수의 타입을 추론할 수 있습니다.

```typescript
function greet(name = "Alice") {
  return `Hello, ${name}`;
}
```

`name`은 `string` 타입으로 추론됩니다.

기본값이 존재하므로 해당 매개변수는 선택적으로 전달할 수 있습니다.

```typescript
greet();
greet("Bob");

// Type Error
greet(100);
```

다만 기본값을 지정하지 않은 일반적인 함수 매개변수는 초기값만으로 타입을 추론할 수 없으므로 명시적인 타입 선언이나 문맥적 타이핑이 필요합니다.

## 3. 문맥적 타이핑(Contextual Typing)

문맥적 타이핑(Contextual Typing)은 표현식이 사용되는 위치나 주변의 타입 정보를 기반으로 타입을 추론하는 방식입니다.

일반적인 타입 추론이 값으로부터 타입을 결정하는 방식이라면, 문맥적 타이핑은 표현식이 사용되는 문맥에서 기대되는 타입을 기반으로 타입을 결정합니다.

### 3.1. 함수 인수의 문맥적 타이핑

배열의 `forEach()` 메서드는 배열 요소를 전달받는 콜백 함수를 인수로 받습니다.

```typescript
const names = ["Alice", "Bob", "Charlie"];

names.forEach((name) => {
  console.log(name.toUpperCase());
});
```

위 코드에서 `name`에 별도의 타입을 선언하지 않았지만 `string`으로 추론됩니다.

이는 `forEach()`가 제공하는 콜백 함수의 타입과 배열 요소의 타입을 기반으로 매개변수의 타입을 결정하기 때문입니다.

명시적으로 타입을 선언해도 동일하게 동작합니다.

```typescript
names.forEach((name: string) => {
  console.log(name.toUpperCase());
});
```

하지만 이미 문맥적 타이핑으로 타입을 추론할 수 있다면 중복된 타입 선언은 생략하는 것이 일반적입니다.

### 3.2. 함수 할당의 문맥적 타이핑

함수를 특정 타입의 변수나 프로퍼티에 할당할 때도 문맥적 타이핑이 적용됩니다.

```typescript
type EventHandler = (event: MouseEvent) => void;

const handleClick: EventHandler = (event) => {
  console.log(event.clientX);
  console.log(event.clientY);
};
```

`handleClick`의 매개변수인 `event`는 `MouseEvent` 타입으로 추론됩니다.

이는 변수에 지정된 `EventHandler` 타입이 함수의 매개변수 타입을 결정하는 문맥으로 작용하기 때문입니다.

### 3.3. 객체 리터럴의 문맥적 타이핑

객체 리터럴을 특정 타입의 변수에 할당하는 경우에도 문맥적 타이핑이 적용됩니다.

```typescript
type User = {
  id: number;
  name: string;
};

const user: User = {
  id: 1,
  name: "Alice",
};
```

객체의 각 프로퍼티는 `User` 타입에 정의된 구조를 기반으로 검사됩니다.

다음과 같이 객체 내부에 정의된 함수에도 문맥적 타이핑이 적용됩니다.

```typescript
type ButtonConfig = {
  label: string;
  onClick: (event: MouseEvent) => void;
};

const button: ButtonConfig = {
  label: "Submit",
  onClick: (event) => {
    console.log(event.clientX);
  },
};
```

`onClick`의 `event` 매개변수는 `MouseEvent` 타입으로 추론됩니다.

### 3.4. 문맥적 타이핑이 적용되는 주요 위치

문맥적 타이핑은 다음과 같은 상황에서 자주 나타납니다.

- 함수 호출에 전달되는 콜백 함수
- 특정 함수 타입을 가지는 변수에 할당되는 함수
- 객체 리터럴의 프로퍼티
- 배열 리터럴의 요소
- 타입이 지정된 위치에 반환되는 표현식
- 특정 타입을 기대하는 함수 인수

문맥적 타이핑은 명시적인 타입 선언을 줄이면서도 타입 안정성과 편집기 자동 완성 기능을 유지할 수 있도록 지원합니다.

## 4. 최적 공통 타입(Best Common Type)

최적 공통 타입(Best Common Type)은 여러 표현식의 타입을 분석하여 하나의 공통 타입을 추론하는 방식입니다.

특히 배열 리터럴처럼 여러 요소가 포함된 표현식에서 중요한 역할을 합니다.

### 4.1. 배열 요소의 타입 추론

배열에 동일한 타입의 값이 포함되어 있다면 해당 타입을 배열 요소의 타입으로 추론합니다.

```typescript
const numbers = [1, 2, 3, 4];
```

위 배열의 타입은 다음과 같이 추론됩니다.

```typescript
const numbers: number[];
```

여러 타입의 값이 포함된 경우에는 모든 요소를 수용할 수 있는 공통 타입을 탐색합니다.

```typescript
const values = [1, "Hello", true];
```

이 경우 배열 요소의 타입은 다음과 같이 추론됩니다.

```typescript
const values: (string | number | boolean)[];
```

TypeScript는 각 요소의 타입을 분석하여 모든 요소를 수용할 수 있는 타입을 결정합니다.

### 4.2. Union Type을 통한 공통 타입 추론

서로 다른 타입 사이에 하나의 공통 상위 타입을 선택하기 어려운 경우 Union Type이 사용될 수 있습니다.

```typescript
const values = [10, "Hello", 20, "World"];
```

추론 결과는 다음과 같습니다.

```typescript
const values: (number | string)[];
```

배열의 각 요소는 `number` 또는 `string` 타입이어야 합니다.

### 4.3. 공통 상위 타입이 존재하는 경우

서로 다른 객체 타입이 공통 상위 타입을 가지는 경우에도 최적 공통 타입이 항상 자동으로 해당 상위 타입을 선택하는 것은 아닙니다.

```typescript
class Animal {
  name: string = "";
}

class Dog extends Animal {
  bark() {
    console.log("Woof");
  }
}

class Cat extends Animal {
  meow() {
    console.log("Meow");
  }
}

const animals = [
  new Dog(),
  new Cat(),
];
```

위 배열은 다음과 같은 Union Type으로 추론될 수 있습니다.

```typescript
const animals: (Dog | Cat)[];
```

`Dog`와 `Cat`은 모두 `Animal`을 상속하지만, TypeScript가 배열 요소의 타입을 항상 `Animal`로 추론하는 것은 아닙니다.

상위 타입을 명확하게 사용하려면 타입을 명시적으로 선언할 수 있습니다.

```typescript
const animals: Animal[] = [
  new Dog(),
  new Cat(),
];
```

이렇게 하면 배열의 요소 타입은 `Animal`로 지정됩니다.

최적 공통 타입은 여러 후보 타입을 분석하는 과정에서 사용되지만, 모든 상황에서 개발자가 기대하는 추상적인 상위 타입을 자동으로 선택하는 것은 아닙니다.

## 5. 리터럴 타입 추론(Literal Type Inference)

리터럴 타입(Literal Type)은 특정한 하나의 값을 타입으로 표현하는 방식입니다.

TypeScript는 변수 선언 방식과 사용 문맥에 따라 리터럴 타입을 그대로 유지하거나 더 넓은 타입으로 확장(Widening)할 수 있습니다.

### 5.1. let과 const의 차이

`const`로 선언된 변수는 재할당할 수 없으므로 초기값의 리터럴 타입이 유지되는 경우가 많습니다.

반면 `let`으로 선언된 변수는 재할당할 수 있으므로 일반적인 원시 타입으로 확장됩니다.

```typescript
let username = "Alice";
const role = "admin";
```

추론 결과는 다음과 같습니다.

```typescript
let username: string;

const role: "admin";
```

`username`은 다른 문자열로 재할당될 수 있으므로 `string`으로 추론됩니다.

반면 `role`은 재할당할 수 없으므로 `"admin"`이라는 리터럴 타입으로 추론됩니다.

### 5.2. 타입 확장(Type Widening)

타입 확장(Type Widening)은 좁은 리터럴 타입이 더 넓은 일반 타입으로 확장되는 과정입니다.

```typescript
let status = "active";
```

초기값은 `"active"`이지만 `let` 변수는 다른 문자열로 재할당될 수 있으므로 타입이 `string`으로 확장됩니다.

```typescript
status = "inactive";
status = "pending";
```

반면 리터럴 타입을 명시하면 특정 값만 허용하도록 제한할 수 있습니다.

```typescript
let status: "active" | "inactive" = "active";

status = "inactive";

// Type Error
status = "pending";
```

리터럴 타입은 상태값, 역할, 옵션 등 허용되는 값의 범위를 제한할 때 유용합니다.

### 5.3. as const를 통한 리터럴 타입 유지

`as const`는 표현식의 타입을 가능한 한 구체적인 리터럴 타입으로 유지하도록 지정하는 Const Assertion입니다.

```typescript
const user = {
  name: "Alice",
  age: 30,
};
```

일반적인 객체 타입 추론에서는 다음과 같이 프로퍼티가 확장됩니다.

```typescript
const user: {
  name: string;
  age: number;
};
```

반면 `as const`를 사용하면 다음과 같이 추론됩니다.

```typescript
const user = {
  name: "Alice",
  age: 30,
} as const;
```

추론되는 타입은 다음과 같습니다.

```typescript
{
  readonly name: "Alice";
  readonly age: 30;
}
```

객체의 프로퍼티는 `readonly`로 처리되며 원시값은 리터럴 타입으로 유지됩니다.

배열에서도 동일한 방식으로 사용할 수 있습니다.

```typescript
const roles = ["admin", "user"] as const;
```

추론 결과는 다음과 같습니다.

```typescript
readonly ["admin", "user"];
```

`as const`는 런타임에서 객체를 동결하는 기능이 아닙니다. 타입 검사 단계에서 리터럴 타입과 읽기 전용 특성을 유지하도록 지정하는 기능입니다.

## 6. 함수 반환 타입 추론과 명시적 타입 선언

TypeScript는 함수의 반환 표현식을 분석하여 반환 타입을 추론할 수 있습니다.

```typescript
function getUser() {
  return {
    id: 1,
    name: "Alice",
  };
}
```

반환 타입은 다음과 같이 추론됩니다.

```typescript
{
  id: number;
  name: string;
}
```

대부분의 내부 함수에서는 반환 타입 추론을 활용하면 불필요한 선언을 줄일 수 있습니다.

다만 외부에 공개되는 함수나 모듈의 API에서는 반환 타입을 명시하는 것이 유용할 수 있습니다.

```typescript
type User = {
  id: number;
  name: string;
};

function getUser(): User {
  return {
    id: 1,
    name: "Alice",
  };
}
```

명시적인 반환 타입을 지정하면 함수의 반환 계약을 명확하게 표현할 수 있습니다.

또한 함수 내부의 구현이 변경되더라도 반환 타입이 의도한 인터페이스와 일치하는지 검사할 수 있습니다.

## 7. 제네릭 타입 추론(Generic Type Inference)

TypeScript는 제네릭 함수의 타입 매개변수도 함수 호출에 전달된 인수 등을 기반으로 추론할 수 있습니다.

제네릭 타입 추론을 활용하면 호출할 때마다 타입 인수를 명시하지 않아도 됩니다.

```typescript
function identity<T>(value: T): T {
  return value;
}

const username = identity("Alice");
const age = identity(30);
```

각 호출의 타입 매개변수는 다음과 같이 추론됩니다.

```typescript
const username: string;
const age: number;
```

제네릭 타입을 명시적으로 전달하는 것도 가능합니다.

```typescript
const username = identity<string>("Alice");
const age = identity<number>(30);
```

두 방식은 동일한 타입 결과를 가집니다.

제네릭 타입 추론은 배열이나 객체를 처리하는 함수에서도 활용됩니다.

```typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst([1, 2, 3]);
const firstName = getFirst(["Alice", "Bob"]);
```

추론 결과는 다음과 같습니다.

```typescript
const firstNumber: number | undefined;
const firstName: string | undefined;
```

제네릭 타입 추론을 활용하면 함수의 재사용성을 높이면서도 호출 지점에서 구체적인 타입 정보를 유지할 수 있습니다.

## 8. React에서의 타입 추론

React와 TypeScript를 함께 사용하는 환경에서도 타입 추론은 중요한 역할을 합니다.

React의 컴포넌트, Hook, 이벤트 핸들러 및 배열 렌더링 과정에서 타입 추론을 활용하면 불필요한 타입 선언을 줄일 수 있습니다.

### 8.1. useState의 타입 추론

`useState`는 초기값을 기반으로 상태값의 타입을 추론할 수 있습니다.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

초기값이 `0`이므로 `count`는 `number` 타입으로 추론됩니다.

따라서 `setCount`에도 숫자 이외의 값을 전달할 수 없습니다.

```tsx
const [count, setCount] = useState(0);

setCount(10);

// Type Error
setCount("10");
```

여러 타입의 상태값이 필요한 경우에는 제네릭 타입을 명시할 수 있습니다.

```tsx
const [username, setUsername] = useState<string | null>(null);
```

이 경우 상태값은 `string` 또는 `null`을 가질 수 있습니다.

### 8.2. 이벤트 핸들러의 문맥적 타이핑

React의 이벤트 핸들러는 JSX의 이벤트 프로퍼티 타입을 기반으로 매개변수 타입이 추론됩니다.

```tsx
function SearchInput() {
  return (
    <input
      onChange={(event) => {
        console.log(event.target.value);
      }}
    />
  );
}
```

`onChange`의 콜백 함수에서 `event`는 해당 요소에 맞는 React 이벤트 타입으로 추론됩니다.

명시적으로 타입을 지정하는 것도 가능합니다.

```tsx
import type { ChangeEvent } from "react";

function SearchInput() {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
  };

  return <input onChange={handleChange} />;
}
```

인라인 이벤트 핸들러에서는 문맥적 타이핑을 활용하고, 별도로 분리한 이벤트 핸들러에서는 필요한 경우 타입을 명시하는 방식이 일반적입니다.

### 8.3. 배열 렌더링의 타입 추론

배열의 `map()`을 사용하여 컴포넌트를 렌더링할 때도 배열 요소의 타입이 콜백 함수에 전달됩니다.

```tsx
type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

`user`는 `User` 타입으로 추론되므로 별도의 매개변수 타입 선언 없이도 프로퍼티 접근과 자동 완성이 지원됩니다.

### 8.4. useRef의 타입 추론

`useRef`에서도 초기값과 제네릭 타입을 활용하여 타입 정보를 지정할 수 있습니다.

```tsx
import { useRef } from "react";

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <input ref={inputRef} />;
}
```

위 예제에서는 `inputRef`가 HTMLInputElement를 참조하거나 초기 상태에서 `null`일 수 있도록 타입을 지정합니다.

DOM 요소를 참조하는 경우에는 실제 참조 대상의 타입을 명시하는 것이 일반적입니다.

React Hook별 구체적인 타입 선언 방식은 `react-typescript/` 디렉터리에서 별도로 다룹니다.

## 9. 타입 추론과 컴파일러 옵션

TypeScript의 타입 추론은 컴파일러 설정에 따라서도 영향을 받을 수 있습니다.

특히 엄격한 타입 검사를 위한 옵션은 타입 추론 결과가 실제 코드에서 어떻게 검사되는지에 영향을 줍니다.

### 9.1. strict

`strict`는 여러 엄격한 타입 검사 옵션을 활성화하는 상위 설정입니다.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

이 설정은 `strictNullChecks`, `noImplicitAny` 등 다양한 엄격한 검사 옵션을 활성화합니다.

이를 통해 타입이 명확하게 지정되지 않은 영역에서 발생할 수 있는 오류를 더 일찍 발견할 수 있습니다.

### 9.2. noImplicitAny

`noImplicitAny`는 TypeScript가 타입을 추론하지 못하여 암시적으로 `any`가 되는 상황을 오류로 처리하는 옵션입니다.

```json
{
  "compilerOptions": {
    "noImplicitAny": true
  }
}
```

예를 들어 다음 함수는 매개변수 타입을 추론할 수 있는 문맥이 없으므로 오류가 발생합니다.

```typescript
function printValue(value) {
  console.log(value);
}
```

매개변수의 타입을 명시하면 해결할 수 있습니다.

```typescript
function printValue(value: string) {
  console.log(value);
}
```

다만 문맥적 타이핑을 통해 매개변수 타입이 추론되는 경우에는 별도의 타입 선언이 필요하지 않습니다.

```typescript
const names = ["Alice", "Bob"];

names.forEach((name) => {
  console.log(name.toUpperCase());
});
```

### 9.3. strictNullChecks

`strictNullChecks`는 `null`과 `undefined`를 다른 타입과 구분하여 검사하는 옵션입니다.

```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

이 설정이 활성화되면 값이 존재하지 않을 가능성을 타입에 반영해야 합니다.

```typescript
function findUser(): string | undefined {
  return undefined;
}

const username = findUser();

// Type Error
console.log(username.toUpperCase());
```

반환값에 `undefined`가 포함될 수 있으므로 실제 사용 전에 타입 검사가 필요합니다.

```typescript
if (username !== undefined) {
  console.log(username.toUpperCase());
}
```

이러한 검사는 타입 좁히기(Type Narrowing)와 밀접하게 관련됩니다.

## 10. 타입 추론 활용 시 주의사항

타입 추론은 불필요한 타입 선언을 줄여주지만, 모든 상황에서 추론 결과가 개발자의 의도와 일치하는 것은 아닙니다.

다음과 같은 상황에서는 명시적인 타입 선언을 고려해야 합니다.

### 10.1. 의도한 타입과 추론된 타입이 다른 경우

객체나 배열의 초기값만으로는 개발자가 의도한 추상적인 타입을 추론하지 못할 수 있습니다.

```typescript
type Status = "pending" | "success" | "error";

let status = "pending";
```

위 변수는 일반적으로 `string`으로 추론됩니다.

허용할 수 있는 값을 제한하려면 타입을 명시해야 합니다.

```typescript
let status: Status = "pending";
```

### 10.2. 외부 데이터의 타입을 신뢰하는 경우

JSON 파싱이나 외부 API 응답은 TypeScript가 실제 데이터의 구조를 자동으로 검증하지 않습니다.

```typescript
const user = JSON.parse(response);
```

`JSON.parse()`의 반환 타입은 `any`이므로 타입 추론만으로 데이터의 유효성을 보장할 수 없습니다.

외부 데이터는 `unknown`으로 취급하고 런타임 검증을 수행하는 것이 안전합니다.

### 10.3. 공개 API의 타입이 불명확한 경우

다른 모듈이나 개발자가 사용하는 함수는 반환 타입을 명시하여 인터페이스를 명확하게 만드는 것이 좋습니다.

```typescript
type User = {
  id: number;
  name: string;
};

export function getUser(): User {
  return {
    id: 1,
    name: "Alice",
  };
}
```

명시적인 반환 타입은 함수 구현과 외부 계약을 분리하는 데 도움이 됩니다.

### 10.4. 지나치게 복잡한 추론 결과

복잡한 제네릭 함수, 중첩된 객체 및 여러 단계의 타입 변환에서는 추론 결과가 상당히 복잡해질 수 있습니다.

이러한 경우 타입 별칭이나 명시적인 타입 선언을 활용하여 코드의 의도를 분명하게 표현하는 것이 좋습니다.

## 11. 정리

타입 추론은 TypeScript 컴파일러가 코드의 초기값과 문맥을 분석하여 타입 정보를 자동으로 결정하는 기능입니다.

주요 내용을 정리하면 다음과 같습니다.

- 변수와 객체의 초기값을 기반으로 타입을 추론할 수 있습니다.
- 함수의 반환 표현식을 분석하여 반환 타입을 추론할 수 있습니다.
- 함수 매개변수의 기본값을 기반으로 타입을 추론할 수 있습니다.
- 문맥적 타이핑을 통해 함수 인수와 콜백 함수의 매개변수 타입을 추론할 수 있습니다.
- 최적 공통 타입을 통해 여러 표현식이 포함된 배열 등의 타입을 결정할 수 있습니다.
- `let`과 `const`는 리터럴 타입 추론 및 타입 확장에서 차이가 있습니다.
- `as const`를 사용하면 리터럴 타입과 읽기 전용 특성을 유지할 수 있습니다.
- 제네릭 타입 매개변수도 함수 호출의 인수 등을 기반으로 추론할 수 있습니다.
- React의 Hook, 이벤트 핸들러 및 배열 렌더링에서도 타입 추론이 활용됩니다.
- `strict`, `noImplicitAny`, `strictNullChecks` 등의 컴파일러 옵션은 타입 검사의 엄격성에 영향을 줍니다.

타입 추론을 적절하게 활용하면 불필요한 타입 선언을 줄이면서도 코드의 타입 안정성을 유지할 수 있습니다.

다만 추론 결과가 개발자의 의도를 충분히 표현하지 못하거나 외부 데이터의 타입을 신뢰할 수 없는 경우에는 명시적인 타입 선언과 런타임 검증을 함께 사용해야 합니다.

## 참고 자료

- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript TSConfig Reference - strict](https://www.typescriptlang.org/tsconfig/#strict)
- [TypeScript TSConfig Reference - noImplicitAny](https://www.typescriptlang.org/tsconfig/#noImplicitAny)
- [TypeScript TSConfig Reference - strictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks)
- [React Documentation - Using TypeScript](https://react.dev/learn/typescript)