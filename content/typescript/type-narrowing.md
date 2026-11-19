# Type Narrowing

## 1. Type Narrowing이란?

Type Narrowing(타입 좁히기)은 여러 타입의 가능성을 가진 값을 조건문이나 타입 검사 등을 통해 더 구체적인 타입으로 좁히는 TypeScript의 기능입니다.

TypeScript에서는 Union Type과 같이 하나 이상의 타입을 가질 수 있는 값을 다룰 때, 실제로 어떤 타입인지 확인하기 전까지 해당 값에 대해 모든 타입에서 공통으로 보장되는 기능만 사용할 수 있습니다.

```typescript
function printValue(value: string | number): void {
  console.log(value);

  // Type Error
  // console.log(value.toUpperCase());
}
```

`value`는 `string | number` 타입이므로 `string`에만 존재하는 `toUpperCase()` 메서드를 직접 호출할 수 없습니다.

타입 검사를 통해 `value`가 `string`인지 확인하면 해당 분기에서는 문자열 메서드를 안전하게 사용할 수 있습니다.

```typescript
function printValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

TypeScript는 `typeof` 검사 결과에 따라 각 분기에서 `value`의 타입을 구체적으로 추론합니다.

- `if` 분기: `string`
- `else` 분기: `number`

이처럼 선언된 타입보다 구체적인 타입으로 범위를 좁히는 과정을 Type Narrowing이라고 합니다.

### 1.1. Type Guard

Type Guard(타입 가드)는 TypeScript가 값의 타입을 판별할 수 있도록 지원하는 조건식 또는 함수입니다.

대표적인 Type Guard는 다음과 같습니다.

| Type Guard | 설명 |
|---|---|
| `typeof` | 원시 타입 및 함수 여부 검사 |
| `instanceof` | 클래스 인스턴스 여부 검사 |
| `in` | 객체에 특정 프로퍼티가 존재하는지 검사 |
| Equality Check | 값 또는 타입의 동등성 검사 |
| Truthiness Check | 값의 참·거짓 여부 검사 |
| Type Predicate | 사용자 정의 타입 판별 함수 |
| Assertion Function | 조건을 만족하지 않으면 예외를 발생시키는 타입 단언 함수 |

Type Guard는 TypeScript의 제어 흐름 분석(Control Flow Analysis)과 함께 동작합니다.

TypeScript는 조건문, 반복문, 대입문 및 함수 호출 등의 실행 흐름을 분석하여 특정 위치에서 값이 가질 수 있는 타입을 계산합니다.

## 2. Control Flow Analysis

Control Flow Analysis는 프로그램의 실행 흐름을 분석하여 각 코드 위치에서 변수의 타입을 추론하는 TypeScript의 기능입니다.

Type Narrowing은 이러한 제어 흐름 분석을 기반으로 동작합니다.

```typescript
function process(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value.toFixed(2);
}
```

TypeScript는 `typeof value === "string"`이라는 조건을 확인하고 각 분기의 타입을 다르게 추론합니다.

- 조건이 참인 경로에서는 `value`가 `string`입니다.
- 조건이 거짓인 경로에서는 `value`가 `number`입니다.

이러한 분석은 단순한 `if` 문뿐 아니라 `switch`, 삼항 연산자, 반복문, 대입문 및 조기 반환(Early Return)에서도 적용됩니다.

### 2.1. Declared Type과 Observed Type

TypeScript는 변수의 선언된 타입(Declared Type)과 특정 코드 위치에서 실제로 추론되는 타입을 구분합니다.

```typescript
let value: string | number;

value = 100;

console.log(value.toFixed(2));

value = "React";

console.log(value.toUpperCase());
```

위 코드에서 `value`의 선언된 타입은 `string | number`입니다.

그러나 대입 이후 각 코드 위치에서 관찰되는 타입은 달라집니다.

| 코드 위치 | Declared Type | Observed Type |
|---|---|---|
| 선언 직후 | `string \| number` | `string \| number` |
| `value = 100` 이후 | `string \| number` | `number` |
| `value = "React"` 이후 | `string \| number` | `string` |

Observed Type은 실행 흐름에 따라 달라지지만, 새로운 값을 대입할 때의 유효성은 선언된 타입을 기준으로 검사합니다.

```typescript
let value: string | number;

value = 100;
value = "React";

// Type Error
value = true;
```

`boolean`은 선언된 타입에 포함되지 않으므로 대입할 수 없습니다.

### 2.2. Early Return을 활용한 타입 좁히기

Early Return은 특정 조건을 만족하면 함수 실행을 조기에 종료하는 방식입니다.

조건을 먼저 검사하고 해당 조건에서 반환하면 이후 코드에서는 불필요한 타입을 제외할 수 있습니다.

```typescript
function formatValue(value: string | number | null): string {
  if (value === null) {
    return "No value";
  }

  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return value.toUpperCase();
}
```

각 조건을 통과한 이후에는 다음과 같이 타입이 좁혀집니다.

1. 첫 번째 조건 이후: `string | number`
2. 두 번째 조건의 참 분기: `number`
3. 두 번째 조건의 나머지 경로: `string`

Early Return은 중첩된 조건문을 줄이면서 타입 좁히기를 명확하게 표현할 수 있습니다.

## 3. typeof Narrowing

`typeof`는 JavaScript에서 값의 기본적인 타입 정보를 확인하는 연산자입니다.

TypeScript는 `typeof`의 결과를 분석하여 해당 값의 타입을 좁힙니다.

```typescript
function printValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

JavaScript의 `typeof` 연산자는 다음과 같은 문자열을 반환합니다.

| typeof 결과 | 해당 값의 타입 |
|---|---|
| `"string"` | 문자열 |
| `"number"` | 숫자 |
| `"bigint"` | BigInt |
| `"boolean"` | 불리언 |
| `"symbol"` | Symbol |
| `"undefined"` | Undefined |
| `"object"` | 객체 및 `null` |
| `"function"` | 함수 |

### 3.1. 원시 타입 검사

`typeof`는 원시 타입을 구분할 때 가장 일반적으로 사용됩니다.

```typescript
function format(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return value ? "true" : "false";
}
```

각 조건에서 TypeScript는 해당 타입에 맞는 메서드와 연산을 허용합니다.

### 3.2. typeof null의 주의사항

JavaScript에서 `typeof null`은 `"object"`를 반환합니다.

이는 JavaScript의 기존 동작을 유지하기 위한 특성으로, `null`을 객체 타입으로 판별한다는 의미는 아닙니다.

```typescript
function printValue(value: string | string[] | null): void {
  if (typeof value === "object") {
    // value: string[] | null

    // Type Error
    // value.forEach(console.log);
  }
}
```

`typeof value === "object"`만으로는 `null`을 제외할 수 없습니다.

따라서 객체 여부를 검사할 때는 `null`을 별도로 확인해야 합니다.

```typescript
function printValue(value: string | string[] | null): void {
  if (value !== null && typeof value === "object") {
    value.forEach(console.log);
  }
}
```

### 3.3. 배열 검사

JavaScript에서 배열은 객체에 해당하므로 `typeof`만으로 배열과 일반 객체를 구분할 수 없습니다.

```typescript
const value = [1, 2, 3];

console.log(typeof value);

// "object"
```

배열 여부를 확인하려면 `Array.isArray()`를 사용해야 합니다.

```typescript
function process(value: string | number[]): void {
  if (Array.isArray(value)) {
    value.forEach((item) => {
      console.log(item.toFixed(2));
    });
  } else {
    console.log(value.toUpperCase());
  }
}
```

TypeScript는 `Array.isArray()`를 통해 배열 타입을 좁힐 수 있습니다.

## 4. Truthiness Narrowing

Truthiness Narrowing은 값의 참·거짓 여부를 검사하여 타입을 좁히는 방식입니다.

JavaScript에서는 조건문에서 값을 Boolean으로 변환하여 분기 여부를 결정합니다.

다음 값들은 Falsy Value에 해당합니다.

- `false`
- `0`
- `-0`
- `0n`
- `""`
- `null`
- `undefined`
- `NaN`

이외의 값은 일반적으로 Truthy Value로 취급됩니다.

```typescript
function printName(name: string | null): void {
  if (name) {
    console.log(name.toUpperCase());
  }
}
```

`if (name)` 조건이 참인 분기에서는 `name`이 빈 문자열이나 `null`이 아닌 문자열로 좁혀집니다.

### 4.1. Truthiness 검사와 nullish 값

Truthiness 검사는 `null`과 `undefined`를 제거할 때 편리하지만, 모든 Falsy Value를 함께 제외한다는 점에 주의해야 합니다.

```typescript
function printCount(count: number | undefined): void {
  if (count) {
    console.log(count.toFixed(2));
  }
}
```

위 코드에서 `count`는 `number`로 좁혀집니다.

그러나 `count`가 `0`인 경우에도 조건이 거짓이므로 해당 분기를 실행하지 않습니다.

숫자 `0`을 유효한 값으로 처리해야 한다면 명시적으로 `undefined`를 검사하는 것이 적절합니다.

```typescript
function printCount(count: number | undefined): void {
  if (count !== undefined) {
    console.log(count.toFixed(2));
  }
}
```

`null`과 `undefined`만 제외하려면 다음과 같이 작성할 수도 있습니다.

```typescript
function printValue(value: string | null | undefined): void {
  if (value != null) {
    console.log(value.toUpperCase());
  }
}
```

JavaScript의 느슨한 동등 비교에서 `value != null`은 `null`과 `undefined`를 모두 제외합니다.

### 4.2. Logical Operator를 활용한 타입 좁히기

논리 연산자도 제어 흐름 분석에 영향을 줍니다.

```typescript
function printName(name?: string): void {
  name && console.log(name.toUpperCase());
}
```

`&&`의 오른쪽 표현식은 왼쪽 표현식이 Truthy인 경우에만 실행되므로, 해당 위치에서 `name`은 `string`으로 좁혀집니다.

Nullish Coalescing Operator(`??`)는 `null` 또는 `undefined`인 경우에만 기본값을 사용합니다.

```typescript
function getDisplayName(name: string | null | undefined): string {
  return name ?? "Anonymous";
}
```

`??`는 타입 좁히기뿐 아니라 Nullish Value에 대한 기본값 처리에도 유용합니다.

## 5. Equality Narrowing

Equality Narrowing은 동등성 비교를 통해 타입을 좁히는 방식입니다.

TypeScript는 `===`, `!==`, `==`, `!=` 및 `switch` 등의 비교 결과를 분석합니다.

```typescript
function printValue(value: string | number): void {
  if (value === "React") {
    console.log(value.toUpperCase());
  } else {
    console.log(value);
  }
}
```

`value === "React"`가 참인 경우 `value`는 문자열이므로 `string`으로 좁혀집니다.

### 5.1. Literal Value 비교

Union Type의 구성 요소가 문자열 또는 숫자 리터럴 타입이라면 특정 값과 비교하여 타입을 좁힐 수 있습니다.

```typescript
type Status = "pending" | "success" | "error";

function processStatus(status: Status): void {
  if (status === "success") {
    console.log("Completed");
  } else if (status === "error") {
    console.log("Failed");
  } else {
    console.log("Waiting");
  }
}
```

각 분기에서 `status`는 다음과 같이 좁혀집니다.

- 첫 번째 분기: `"success"`
- 두 번째 분기: `"error"`
- 마지막 분기: `"pending"`

### 5.2. 여러 변수의 Equality 검사

서로 다른 Union Type을 가진 두 변수가 동일한 값인지 검사할 때도 타입이 좁혀질 수 있습니다.

```typescript
function compare(
  first: string | number,
  second: string | boolean,
): void {
  if (first === second) {
    console.log(first.toUpperCase());
    console.log(second.toUpperCase());
  }
}
```

두 값이 동일하다면 두 타입 모두에 존재할 수 있는 공통 타입이어야 합니다.

위 예제에서 공통으로 가능한 타입은 `string`이므로 해당 분기에서 두 변수 모두 `string`으로 좁혀집니다.

### 5.3. null과 undefined 검사

`==`와 `!=`는 `null`과 `undefined`를 함께 검사할 때 사용할 수 있습니다.

```typescript
function processValue(value: string | null | undefined): void {
  if (value != null) {
    console.log(value.toUpperCase());
  }
}
```

`value != null`은 `null`과 `undefined`를 모두 제외하므로 해당 분기에서 `value`는 `string`입니다.

일반적으로 명시적인 비교가 필요한 경우 `===`와 `!==`를 우선 사용하는 것이 좋지만, Nullish Value를 동시에 검사하려는 목적에서는 `!= null`도 유용합니다.

## 6. in Operator Narrowing

`in` 연산자는 객체에 특정 프로퍼티가 존재하는지 검사합니다.

TypeScript는 이를 이용하여 Union Type에 포함된 객체 타입을 좁힐 수 있습니다.

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function move(animal: Fish | Bird): void {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

`"swim" in animal`의 결과에 따라 다음과 같이 타입이 좁혀집니다.

- 참인 분기: `Fish`
- 거짓인 분기: `Bird`

### 6.1. Optional Property의 주의사항

검사 대상 프로퍼티가 선택 사항(Optional Property)이라면 양쪽 분기에 해당 타입이 모두 포함될 수 있습니다.

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

interface Human {
  swim?: () => void;
  fly?: () => void;
}

function move(animal: Fish | Bird | Human): void {
  if ("swim" in animal) {
    // Fish | Human
  } else {
    // Bird | Human
  }
}
```

`Human`은 `swim` 프로퍼티가 존재할 수도 있고 존재하지 않을 수도 있으므로 두 분기 모두에 포함됩니다.

따라서 `in` 연산자는 프로퍼티의 존재 여부를 기준으로 타입을 좁히며, 선택적 프로퍼티의 실제 값이 유효한지까지 보장하지는 않습니다.

### 6.2. 프로퍼티 값까지 확인하기

프로퍼티가 존재하더라도 값이 `undefined`일 수 있다면 추가 검사가 필요합니다.

```typescript
interface User {
  name?: string;
}

function printName(user: User): void {
  if ("name" in user && user.name !== undefined) {
    console.log(user.name.toUpperCase());
  }
}
```

객체의 프로퍼티 존재 여부와 프로퍼티 값의 유효성은 별도로 확인해야 합니다.

## 7. instanceof Narrowing

`instanceof`는 객체가 특정 클래스의 인스턴스인지 검사하는 JavaScript 연산자입니다.

TypeScript는 `instanceof`의 검사 결과를 기반으로 타입을 좁힙니다.

```typescript
function formatValue(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value.toUpperCase();
}
```

각 분기에서 다음과 같이 타입이 결정됩니다.

- 참인 분기: `Date`
- 거짓인 분기: `string`

### 7.1. 클래스 상속 관계

`instanceof`는 클래스의 프로토타입 체인을 기반으로 동작하므로 상속 관계에서도 활용할 수 있습니다.

```typescript
class Animal {
  move(): void {
    console.log("Moving");
  }
}

class Dog extends Animal {
  bark(): void {
    console.log("Barking");
  }
}

function handleAnimal(animal: Animal): void {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.move();
  }
}
```

`animal`이 `Dog`의 인스턴스인 경우 `Dog`에 정의된 메서드에 접근할 수 있습니다.

### 7.2. instanceof 사용 시 주의사항

`instanceof`는 클래스와 생성자 함수의 런타임 인스턴스 관계를 확인하는 연산자입니다.

따라서 일반적인 객체 리터럴이나 인터페이스의 구조적 타입을 판별하는 용도로는 적합하지 않습니다.

```typescript
interface User {
  id: number;
  name: string;
}

const user = {
  id: 1,
  name: "Kim",
};

// 인터페이스는 런타임에 존재하지 않음
// user instanceof User;
```

TypeScript의 인터페이스는 컴파일 과정에서 제거되므로 런타임에 `instanceof`의 검사 대상으로 사용할 수 없습니다.

객체의 구조를 기준으로 판별하려면 `in` 연산자나 사용자 정의 Type Predicate를 활용해야 합니다.

## 8. Type Predicate

Type Predicate는 사용자 정의 함수가 특정 조건을 만족하는지 검사하고, 그 결과에 따라 타입을 좁힐 수 있도록 선언하는 기능입니다.

`parameterName is Type` 형태로 반환 타입을 작성합니다.

```typescript
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(animal: Fish | Bird): animal is Fish {
  return "swim" in animal;
}
```

`animal is Fish`는 해당 함수가 참을 반환하면 전달된 `animal`을 `Fish` 타입으로 좁힐 수 있다는 의미입니다.

```typescript
function move(animal: Fish | Bird): void {
  if (isFish(animal)) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

TypeScript는 `isFish()`의 반환 결과를 기반으로 타입을 좁힙니다.

### 8.1. Type Predicate를 활용한 배열 필터링

Type Predicate는 배열의 `filter()` 메서드와 함께 사용할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

const values: unknown[] = [
  { id: 1, name: "Kim" },
  { id: 2, name: "Lee" },
  "invalid",
  null,
];

const users = values.filter(isUser);
```

`isUser()`는 런타임에 객체의 구조를 검사하고, 조건을 만족하는 경우 `User` 타입이라고 선언합니다.

따라서 `users`는 `User[]` 타입으로 추론됩니다.

### 8.2. Type Predicate의 정확성

Type Predicate는 반환 타입에 선언한 타입과 실제 검사 로직이 일치해야 합니다.

```typescript
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null;
}
```

위 함수는 객체 여부만 확인하지만, 반환 타입은 `User`라고 선언되어 있습니다.

`id`와 `name`이 존재하는지 확인하지 않으므로 실제로는 잘못된 타입 판별을 수행할 수 있습니다.

Type Predicate는 컴파일러가 함수 내부의 검증 로직을 완전하게 증명하는 기능이 아닙니다. 개발자가 선언한 타입 판별 결과를 신뢰하므로 검증 로직을 정확하게 구현해야 합니다.

## 9. Assertion Function

Assertion Function은 특정 조건이 충족되지 않으면 예외를 발생시키고, 이후 코드에서 타입을 좁힐 수 있도록 지원하는 함수입니다.

반환 타입에 `asserts` 키워드를 사용합니다.

```typescript
function assertIsString(
  value: unknown,
): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Value must be a string");
  }
}
```

`asserts value is string`은 함수 실행이 정상적으로 완료되었다면 `value`가 `string` 타입임을 보장한다는 의미입니다.

```typescript
function processValue(value: unknown): string {
  assertIsString(value);

  return value.toUpperCase();
}
```

`assertIsString()`이 예외 없이 종료되었다면 이후 코드에서 `value`는 `string`으로 좁혀집니다.

### 9.1. 조건 자체를 단언하는 Assertion Function

특정 변수의 타입뿐 아니라 조건이 참이라는 사실을 단언할 수도 있습니다.

```typescript
function assert(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
```

사용 예제는 다음과 같습니다.

```typescript
function getUserName(user: { name?: string }): string {
  assert(user.name !== undefined, "Name is required");

  return user.name.toUpperCase();
}
```

`asserts condition`은 해당 조건이 참이라는 사실을 이후 코드에서 반영하도록 합니다.

### 9.2. Type Predicate와 Assertion Function 비교

두 기능은 사용자 정의 검증 로직을 기반으로 타입을 좁힌다는 공통점이 있지만 동작 방식이 다릅니다.

| 구분 | Type Predicate | Assertion Function |
|---|---|---|
| 선언 방식 | `value is Type` | `asserts value is Type` |
| 반환 형태 | `boolean` | 일반적으로 `void` |
| 실패 처리 | `false` 반환 | 예외 발생 |
| 타입 좁히기 | 조건문 분기 | 함수 호출 이후 |
| 주요 활용 | 조건부 타입 검사 | 필수 조건 검증 |

Type Predicate는 값이 특정 타입인지 확인하고 분기할 때 적합하며, Assertion Function은 특정 조건이 반드시 만족되어야 하는 상황에서 유용합니다.

## 10. Discriminated Union Narrowing

Discriminated Union은 공통 프로퍼티를 통해 서로 다른 객체 타입을 구분하는 Union Type입니다.

공통 프로퍼티는 일반적으로 `kind`, `type`, `status`와 같은 리터럴 타입으로 선언합니다.

```typescript
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

`Shape`는 `Circle` 또는 `Square` 타입이 될 수 있습니다.

각 타입은 `kind`라는 공통 프로퍼티를 가지며, 해당 프로퍼티의 리터럴 값으로 타입을 구분합니다.

```typescript
function getArea(shape: Shape): number {
  if (shape.kind === "circle") {
    return Math.PI * shape.radius ** 2;
  }

  return shape.sideLength ** 2;
}
```

`shape.kind`를 검사하면 TypeScript가 `shape`의 타입을 자동으로 좁힙니다.

- `kind === "circle"`: `Circle`
- 그 외의 경우: `Square`

### 10.1. switch를 활용한 Discriminated Union

`switch` 문은 여러 종류의 Union 구성 요소를 분기 처리할 때 유용합니다.

```typescript
type Payment =
  | {
      type: "card";
      cardNumber: string;
    }
  | {
      type: "bank";
      accountNumber: string;
    }
  | {
      type: "cash";
      amount: number;
    };

function processPayment(payment: Payment): void {
  switch (payment.type) {
    case "card":
      console.log(payment.cardNumber);
      break;

    case "bank":
      console.log(payment.accountNumber);
      break;

    case "cash":
      console.log(payment.amount);
      break;
  }
}
```

각 `case`에서 `payment.type`에 따라 해당 객체의 구체적인 타입으로 좁혀집니다.

이 패턴은 API 응답, 이벤트 객체, 상태 관리, 결제 방식 및 비동기 처리 상태 등을 모델링할 때 유용합니다.

### 10.2. 비동기 상태 모델링

비동기 요청의 상태를 Discriminated Union으로 표현하면 상태별 데이터 구조를 명확하게 구분할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
}

type AsyncState<T> =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "success";
      data: T;
    }
  | {
      status: "error";
      error: Error;
    };
```

각 상태에 필요한 프로퍼티만 정의할 수 있습니다.

```tsx
function UserView({ state }: { state: AsyncState<User> }) {
  switch (state.status) {
    case "idle":
      return <p>Waiting</p>;

    case "loading":
      return <p>Loading...</p>;

    case "success":
      return <p>{state.data.name}</p>;

    case "error":
      return <p>{state.error.message}</p>;
  }
}
```

`status`를 기준으로 상태가 좁혀지므로 각 상태에서 사용할 수 있는 프로퍼티가 명확해집니다.

예를 들어 `success` 상태에서는 `data`에 접근할 수 있지만, `loading` 상태에서는 `data`가 존재하지 않으므로 접근할 수 없습니다.

## 11. never와 Exhaustive Check

`never`는 어떤 값도 존재할 수 없는 타입을 나타냅니다.

Type Narrowing을 통해 Union Type의 모든 구성 요소를 제거하면 해당 위치의 타입은 `never`가 됩니다.

`never`는 모든 타입에 할당할 수 있지만, `never`가 아닌 일반적인 타입의 값은 `never`에 할당할 수 없습니다.

이 특성을 활용하면 Union Type의 모든 경우를 처리했는지 검사할 수 있습니다.

### 11.1. Exhaustive Check

Exhaustive Check(완전성 검사)는 Union Type에 포함된 모든 경우가 처리되었는지 확인하는 기법입니다.

```typescript
type Status = "pending" | "success" | "error";

function getMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting";

    case "success":
      return "Completed";

    case "error":
      return "Failed";

    default: {
      const exhaustiveCheck: never = status;
      return exhaustiveCheck;
    }
  }
}
```

모든 상태를 처리했으므로 `default` 분기에서 `status`는 `never` 타입으로 좁혀집니다.

만약 새로운 상태가 추가되면 기존 코드에서 컴파일 오류가 발생합니다.

```typescript
type Status =
  | "pending"
  | "success"
  | "error"
  | "cancelled";
```

`cancelled`를 처리하지 않았으므로 `default` 분기의 `status`는 더 이상 `never`가 아닙니다.

따라서 다음 대입에서 타입 오류가 발생합니다.

```typescript
const exhaustiveCheck: never = status;
```

이러한 방식으로 Union Type의 구성 요소가 변경되었을 때 누락된 분기 처리를 컴파일 시점에 확인할 수 있습니다.

### 11.2. 별도의 assertNever 함수 활용

완전성 검사를 별도의 함수로 분리할 수도 있습니다.

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;

    case "square":
      return shape.sideLength ** 2;

    default:
      return assertNever(shape);
  }
}
```

새로운 타입이 `Shape`에 추가되면 해당 타입을 처리하지 않은 경우 `assertNever(shape)` 호출에서 컴파일 오류가 발생합니다.

Exhaustive Check는 상태나 이벤트의 종류가 명확하게 정의된 시스템에서 누락된 처리를 방지하는 데 유용합니다.

## 12. Type Narrowing과 Type Assertion 비교

Type Narrowing과 Type Assertion은 모두 특정 타입으로 값을 취급할 수 있도록 하지만, 타입을 다루는 방식이 다릅니다.

### 12.1. Type Narrowing

Type Narrowing은 런타임 조건을 검사하고 해당 검사 결과를 기반으로 TypeScript가 타입을 추론하는 방식입니다.

```typescript
function printValue(value: string | number): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }
}
```

실제 값의 타입을 검사하므로 조건에 맞지 않는 값은 해당 분기에 진입하지 않습니다.

### 12.2. Type Assertion

Type Assertion은 개발자가 특정 값의 타입을 TypeScript 컴파일러에 명시적으로 알려주는 기능입니다.

```typescript
const value: unknown = "React";

const text = value as string;

console.log(text.toUpperCase());
```

`as string`은 런타임 검사를 수행하지 않습니다. 컴파일러에게 해당 값을 `string`으로 취급하도록 요청할 뿐입니다.

실제 값이 문자열이 아니라면 런타임 오류가 발생할 수 있습니다.

### 12.3. 비교

| 구분 | Type Narrowing | Type Assertion |
|---|---|---|
| 타입 결정 방식 | 조건 검사 및 제어 흐름 분석 | 개발자의 명시적 선언 |
| 런타임 검사 | 검사 방식에 따라 수행 | 수행하지 않음 |
| 타입 안정성 | 실제 검사 결과에 기반 | 개발자의 책임 |
| 주요 사용 목적 | 값의 타입 판별 | 컴파일러가 알지 못하는 타입 정보 전달 |

가능하면 실제 런타임 검사를 통한 Type Narrowing을 우선하고, 외부에서 타입이 보장되는 상황 등 필요한 경우에만 Type Assertion을 사용하는 것이 좋습니다.

## 13. Type Narrowing 사용 시 주의사항

### 13.1. 타입 검사가 실제 데이터 구조를 보장하는지 확인

`typeof`, `in`, `instanceof` 등의 검사는 각기 다른 수준의 정보를 제공합니다.

예를 들어 `typeof value === "object"`는 객체 여부만 확인하며, 객체 내부의 프로퍼티 구조까지 검증하지 않습니다.

```typescript
function process(value: unknown): void {
  if (typeof value === "object" && value !== null) {
    // 객체라는 사실만 확인됨
    // 특정 프로퍼티의 존재나 타입은 보장되지 않음
  }
}
```

외부 API 응답이나 사용자 입력처럼 신뢰할 수 없는 데이터는 필요한 프로퍼티와 값의 타입을 추가로 검증해야 합니다.

### 13.2. Optional Property의 존재 여부와 값 검사 구분

`in` 연산자는 프로퍼티가 객체에 존재하는지 검사합니다.

그러나 프로퍼티가 선택 사항이거나 `undefined`를 허용한다면 실제 값에 대한 추가 검사가 필요합니다.

```typescript
interface Config {
  timeout?: number;
}

function setTimeoutValue(config: Config): void {
  if ("timeout" in config && config.timeout !== undefined) {
    console.log(config.timeout.toFixed(0));
  }
}
```

### 13.3. Truthiness 검사에서 유효한 Falsy Value 확인

숫자 `0`, 문자열 `""`, 불리언 `false` 등이 유효한 값이라면 Truthiness 검사로 해당 값을 제외하지 않도록 주의해야 합니다.

```typescript
function getCount(count: number | undefined): number {
  if (count !== undefined) {
    return count;
  }

  return 0;
}
```

값의 존재 여부와 값 자체의 참·거짓 여부를 구분하는 것이 중요합니다.

### 13.4. Type Predicate의 검증 로직 유지

Type Predicate는 함수의 반환 타입에 선언된 타입을 기준으로 타입을 좁힙니다.

검증 로직이 실제 데이터 구조와 일치하지 않으면 잘못된 타입 추론으로 이어질 수 있습니다.

외부 데이터에 대한 Type Predicate를 작성할 때는 각 프로퍼티의 존재 여부와 타입을 충분히 검증해야 합니다.

### 13.5. Type Assertion으로 타입 오류를 무조건 해결하지 않기

타입 오류가 발생했을 때 `as`를 사용하여 강제로 타입을 변경하면 실제 데이터의 문제를 발견하지 못할 수 있습니다.

```typescript
const value: unknown = 100;

// 타입 오류를 우회할 뿐 실제 값은 number
const text = value as string;
```

타입이 실제로 보장되는지 확인할 수 있다면 Type Guard를 사용하고, 그렇지 않다면 런타임 검증을 수행해야 합니다.

## 14. 정리

Type Narrowing은 여러 가능성을 가진 타입을 실행 흐름과 조건 검사에 따라 구체적인 타입으로 좁히는 기능입니다.

주요 Type Guard와 활용 방법은 다음과 같습니다.

| 방법 | 주요 역할 | 대표적인 사용 사례 |
|---|---|---|
| `typeof` | 원시 타입 판별 | 문자열, 숫자, 불리언 구분 |
| Truthiness Check | 참·거짓 여부 검사 | `null`, `undefined`, 빈 값 처리 |
| Equality Check | 값의 동등성 검사 | 리터럴 Union 분기 |
| `in` | 객체 프로퍼티 존재 여부 검사 | 서로 다른 객체 구조 판별 |
| `instanceof` | 클래스 인스턴스 여부 검사 | 클래스 및 상속 관계 판별 |
| Type Predicate | 사용자 정의 타입 판별 | 외부 데이터 검증, 배열 필터링 |
| Assertion Function | 조건 충족 여부 단언 | 필수 데이터 검증 |
| Discriminated Union | 공통 판별 프로퍼티로 타입 구분 | API 상태, 이벤트, 비동기 상태 |
| Exhaustive Check | 모든 Union 구성 요소 처리 여부 검사 | 상태 및 이벤트 처리 누락 방지 |

Type Narrowing은 단순히 타입 오류를 제거하는 기능이 아니라, 런타임 데이터의 상태와 구조를 타입 시스템에 반영하는 기능입니다.

특히 Union Type과 Discriminated Union을 함께 사용하면 복잡한 데이터 구조를 명확하게 모델링할 수 있으며, Type Predicate와 Assertion Function을 활용하면 외부 데이터에 대한 검증 로직도 타입 시스템과 연결할 수 있습니다.

안전한 TypeScript 코드를 작성하려면 타입을 강제로 변경하기보다 실제 값의 조건을 검사하고, 해당 검사 결과를 기반으로 타입을 좁히는 방식을 우선적으로 사용하는 것이 좋습니다.

## 참고 자료

- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
  - Type Narrowing의 기본 개념과 Control Flow Analysis, `typeof`, Truthiness, Equality, `in`, `instanceof`, Type Predicate, Assertion Function, Discriminated Union 및 Exhaustive Check를 설명하는 공식 문서입니다.
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  - 원시 타입, Union Type, Type Assertion 등 타입 좁히기의 기반이 되는 TypeScript 기본 개념을 설명합니다.
- [TypeScript Handbook - Unions and Intersection Types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
  - Union Type과 Discriminated Union을 활용한 타입 구성 및 분기 처리를 설명합니다.
- [TypeScript Handbook - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
  - TypeScript의 구조적 타입 시스템과 타입 간 호환성에 관한 내용을 설명합니다.
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - `Extract`, `Exclude`, `NonNullable` 등의 타입 변환 기능을 설명합니다.