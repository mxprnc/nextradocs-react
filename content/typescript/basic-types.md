# Basic Types

## 1. 기본 타입(Basic Types)이란?

TypeScript의 기본 타입(Basic Types)은 변수, 함수 매개변수, 반환값 및 객체 프로퍼티 등에 사용되는 가장 기본적인 타입입니다.

TypeScript는 JavaScript의 데이터 타입을 기반으로 정적 타입 시스템을 제공하며, 각 값이 어떤 종류의 데이터를 표현하는지 명시하거나 추론할 수 있습니다.

기본 타입을 활용하면 데이터의 형태와 사용 가능한 연산을 제한할 수 있으며, 타입이 일치하지 않는 값을 사용하는 경우 컴파일 타임에 오류를 발견할 수 있습니다.

```typescript
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
```

TypeScript는 기본 타입 외에도 배열, 튜플, 객체, 함수 및 특수 타입을 제공합니다. 이러한 타입들은 이후 Union, Intersection, Generic 등의 복합적인 타입을 구성하는 기반이 됩니다.

## 2. 원시 타입(Primitive Types)

JavaScript에서 사용하는 원시 값(Primitive Values)은 TypeScript에서도 대응하는 타입을 제공합니다.

대표적인 원시 타입은 다음과 같습니다.

| 타입 | 설명 | 예시 |
|---|---|---|
| `string` | 문자열 | `"Hello"` |
| `number` | 숫자 | `10`, `3.14` |
| `boolean` | 참 또는 거짓 | `true`, `false` |
| `bigint` | 큰 정수 | `100n` |
| `symbol` | 고유한 식별자 | `Symbol("id")` |
| `null` | 의도적으로 비어 있는 값 | `null` |
| `undefined` | 값이 할당되지 않은 상태 | `undefined` |

### 2.1. string

`string`은 문자열 데이터를 표현하는 타입입니다.

문자열은 작은따옴표, 큰따옴표 또는 템플릿 리터럴을 사용하여 표현할 수 있습니다.

```typescript
let username: string = "Alice";

username = "Bob";
username = `Charlie`;

// Type Error
username = 100;
```

템플릿 리터럴(Template Literal)을 사용하면 문자열 내부에 변수나 표현식을 삽입할 수 있습니다.

```typescript
const name: string = "Alice";
const age: number = 30;

const message: string = `My name is ${name} and I am ${age} years old.`;
```

### 2.2. number

`number`는 정수와 실수를 포함한 숫자 데이터를 표현하는 타입입니다.

JavaScript는 정수(Integer)와 실수(Float)를 별도의 런타임 타입으로 구분하지 않으며, 모두 `number` 타입으로 처리합니다.

```typescript
let age: number = 30;
let price: number = 19.99;
let temperature: number = -5;

let infinity: number = Infinity;
let notANumber: number = NaN;
```

JavaScript의 숫자 체계는 IEEE 754 배정밀도 부동소수점(Double-Precision Floating-Point) 형식을 기반으로 합니다. 따라서 모든 정수를 안전하게 표현할 수 있는 것은 아닙니다.

정확한 정수 연산이 필요한 경우 `Number.MAX_SAFE_INTEGER`를 고려해야 하며, 범위를 초과하는 정수 연산에는 `bigint`를 사용할 수 있습니다.

### 2.3. boolean

`boolean`은 논리적인 참(True)과 거짓(False)을 표현하는 타입입니다.

```typescript
let isActive: boolean = true;
let isCompleted: boolean = false;

if (isActive) {
  console.log("Active");
}
```

조건문, 비교 연산 및 논리 연산 등에 사용됩니다.

### 2.4. bigint

`bigint`는 JavaScript의 `number`가 안전하게 표현할 수 있는 정수 범위를 초과하는 큰 정수를 표현하는 타입입니다.

숫자 리터럴 뒤에 `n`을 붙여 선언할 수 있습니다.

```typescript
const largeNumber: bigint = 9007199254740993n;

const anotherNumber: bigint = BigInt("9007199254740993");

const result: bigint = largeNumber + anotherNumber;
```

`bigint`와 `number`는 서로 다른 타입이므로 일반적인 산술 연산에서 혼합하여 사용할 수 없습니다.

```typescript
const count: number = 10;
const largeCount: bigint = 20n;

// Type Error
const result = count + largeCount;
```

두 타입을 함께 사용해야 하는 경우 명시적인 변환이 필요합니다. 단, `bigint`를 `number`로 변환하면 안전한 정수 범위를 초과하는 값에서 정밀도가 손실될 수 있습니다.

### 2.5. symbol

`symbol`은 고유하고 변경할 수 없는 식별자를 생성하는 원시 타입입니다.

`Symbol()` 함수를 호출할 때마다 새로운 Symbol 값이 생성됩니다.

```typescript
const id1: symbol = Symbol("id");
const id2: symbol = Symbol("id");

console.log(id1 === id2); // false
```

설명이 동일하더라도 생성된 Symbol 값은 서로 다른 고유한 값입니다.

객체의 프로퍼티 키로 사용할 수 있으며, 일반적인 문자열 프로퍼티와 구분되는 식별자가 필요한 경우 활용할 수 있습니다.

```typescript
const userId: unique symbol = Symbol("userId");

const user = {
  [userId]: 100,
};
```

`unique symbol`은 각각의 Symbol 선언을 고유한 타입으로 취급하기 위한 TypeScript의 특수 타입입니다.

### 2.6. null과 undefined

`null`과 `undefined`는 JavaScript에서 비어 있는 값이나 값이 존재하지 않는 상태를 표현하는 원시 값입니다.

TypeScript에서는 각각 `null`과 `undefined` 타입으로 구분합니다.

```typescript
let emptyValue: null = null;
let uninitializedValue: undefined = undefined;
```

두 타입의 할당 가능 여부는 `strictNullChecks` 옵션에 따라 달라집니다.

`strictNullChecks`가 활성화되면 `null`과 `undefined`는 다른 타입과 구분되어 처리됩니다.

```typescript
let username: string = "Alice";

// Type Error
username = null;

// Type Error
username = undefined;
```

`null` 또는 `undefined`가 허용되는 변수를 선언하려면 Union Type을 사용할 수 있습니다.

```typescript
let username: string | null = "Alice";

username = null;
username = "Bob";
```

실제 프로젝트에서는 `strictNullChecks`를 활성화하여 null 관련 오류를 사전에 발견하는 것이 좋습니다.

## 3. 배열(Array)

배열(Array)은 동일한 타입 또는 여러 타입의 요소를 순서대로 저장하는 자료구조입니다.

TypeScript에서는 배열에 포함되는 요소의 타입을 지정할 수 있습니다.

### 3.1. 배열 타입 선언

배열 타입은 일반적으로 다음 두 가지 방법으로 선언할 수 있습니다.

```typescript
// Array Type Syntax
const numbers: number[] = [1, 2, 3];

// Generic Array Syntax
const names: Array<string> = ["Alice", "Bob", "Charlie"];
```

두 방식은 동일한 의미를 가지며, 배열의 요소가 지정된 타입과 일치하는지 검사합니다.

```typescript
const numbers: number[] = [1, 2, 3];

// Type Error
numbers.push("4");
```

### 3.2. 다중 타입 배열

Union Type을 활용하면 하나의 배열에서 여러 타입의 요소를 허용할 수 있습니다.

```typescript
const values: (string | number)[] = [
  "Alice",
  100,
  "Bob",
  200,
];
```

괄호는 배열의 요소가 `string` 또는 `number` 타입이라는 의미를 명확하게 표현합니다.

### 3.3. 읽기 전용 배열(Readonly Array)

`readonly` 또는 `ReadonlyArray<T>`를 사용하면 배열의 요소를 변경할 수 없는 읽기 전용 배열 타입을 선언할 수 있습니다.

```typescript
const numbers: readonly number[] = [1, 2, 3];

// Type Error
numbers.push(4);

// Type Error
numbers[0] = 10;
```

다음과 같이 `ReadonlyArray<T>` 문법으로도 표현할 수 있습니다.

```typescript
const names: ReadonlyArray<string> = [
  "Alice",
  "Bob",
];
```

읽기 전용 배열은 배열 자체를 변경하는 작업을 방지하는 데 유용합니다. 다만 런타임에서 배열을 불변 객체로 만드는 기능은 아니며, 타입 검사 단계에서 변경을 제한합니다.

## 4. 튜플(Tuple)

튜플(Tuple)은 배열의 각 위치에 저장되는 요소의 개수와 타입을 미리 정의하는 타입입니다.

일반 배열과 달리 각 요소의 위치에 따라 서로 다른 타입을 지정할 수 있습니다.

```typescript
let user: [number, string] = [1, "Alice"];
```

위 튜플은 첫 번째 요소가 `number`, 두 번째 요소가 `string`이어야 합니다.

```typescript
let user: [number, string] = [1, "Alice"];

// Type Error
user = ["Alice", 1];

// Type Error
user = [1];
```

### 4.1. 선택적 튜플 요소

튜플의 일부 요소는 선택적으로 선언할 수 있습니다.

```typescript
let user: [number, string?];

user = [1];
user = [1, "Alice"];
```

선택적 요소는 `?`를 사용하여 표시하며, 생략할 수 있습니다.

### 4.2. 읽기 전용 튜플

`readonly`를 사용하면 튜플 요소의 재할당을 방지할 수 있습니다.

```typescript
const coordinates: readonly [number, number] = [10, 20];

// Type Error
coordinates[0] = 30;
```

### 4.3. 명명된 튜플 요소

튜플 요소에 이름을 지정하면 각 위치가 어떤 의미를 가지는지 명확하게 표현할 수 있습니다.

```typescript
type Coordinate = [x: number, y: number];

const position: Coordinate = [10, 20];
```

명명된 튜플 요소는 가독성을 높이기 위한 기능이며, 실제 타입 검사는 요소의 순서와 타입을 기준으로 수행됩니다.

### 4.4. 튜플과 배열의 차이

| 구분 | 배열(Array) | 튜플(Tuple) |
|---|---|---|
| 요소 타입 | 일반적으로 동일한 타입 | 위치별로 다른 타입 지정 가능 |
| 요소 개수 | 가변적 | 선언된 구조에 따라 제한 |
| 요소 순서 | 일반적으로 동일 타입 | 각 위치의 타입이 중요 |
| 주요 목적 | 동일한 종류의 데이터 관리 | 정해진 구조의 데이터 표현 |

튜플은 좌표, 함수의 다중 반환값, 키와 값의 쌍 등 요소의 위치가 의미를 가지는 데이터 구조에 적합합니다.

## 5. 객체 타입(Object Types)

객체 타입(Object Types)은 객체가 가지는 프로퍼티의 이름과 각 프로퍼티의 타입을 정의하는 타입입니다.

TypeScript는 객체의 구조를 기반으로 타입 호환성을 검사합니다.

```typescript
const user: {
  id: number;
  name: string;
  isActive: boolean;
} = {
  id: 1,
  name: "Alice",
  isActive: true,
};
```

객체 타입은 객체가 가져야 하는 프로퍼티와 각 프로퍼티의 타입을 정의합니다.

### 5.1. 선택적 프로퍼티(Optional Properties)

선택적 프로퍼티는 객체에서 반드시 존재하지 않아도 되는 프로퍼티입니다.

프로퍼티 이름 뒤에 `?`를 붙여 선언합니다.

```typescript
type User = {
  id: number;
  name: string;
  email?: string;
};

const user1: User = {
  id: 1,
  name: "Alice",
};

const user2: User = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
};
```

선택적 프로퍼티는 값이 생략될 수 있으므로 해당 프로퍼티를 읽을 때 `undefined`가 될 가능성을 고려해야 합니다.

```typescript
function printEmail(user: User): void {
  if (user.email !== undefined) {
    console.log(user.email);
  }
}
```

### 5.2. 읽기 전용 프로퍼티(Readonly Properties)

`readonly`를 사용하면 객체의 특정 프로퍼티를 초기화 이후 재할당할 수 없도록 제한할 수 있습니다.

```typescript
type User = {
  readonly id: number;
  name: string;
};

const user: User = {
  id: 1,
  name: "Alice",
};

user.name = "Bob";

// Type Error
user.id = 2;
```

`readonly`는 타입 검사 단계에서 프로퍼티의 재할당을 제한합니다. 객체 내부의 중첩된 프로퍼티까지 자동으로 불변 상태로 만드는 것은 아닙니다.

### 5.3. 중첩 객체 타입(Nested Object Types)

객체 프로퍼티의 타입으로 또 다른 객체 타입을 지정할 수 있습니다.

```typescript
type Address = {
  city: string;
  street: string;
};

type User = {
  id: number;
  name: string;
  address: Address;
};

const user: User = {
  id: 1,
  name: "Alice",
  address: {
    city: "Seoul",
    street: "Gangnam-daero",
  },
};
```

중첩 객체 타입을 활용하면 복잡한 데이터 구조를 계층적으로 표현할 수 있습니다.

### 5.4. object 타입과 객체 리터럴 타입

TypeScript의 `object` 타입은 원시 타입이 아닌 값을 의미합니다.

```typescript
let value: object;

value = {};
value = [];
value = new Date();

// Type Error
value = "Hello";

// Type Error
value = 100;
```

`object` 타입은 객체의 구체적인 프로퍼티 구조를 정의하지 않습니다.

따라서 객체의 프로퍼티에 접근하거나 특정 데이터 구조를 보장해야 하는 경우에는 객체 리터럴 타입(Object Literal Type) 또는 별도의 타입 정의를 사용하는 것이 적합합니다.

```typescript
type User = {
  id: number;
  name: string;
};

const user: User = {
  id: 1,
  name: "Alice",
};

console.log(user.name);
```

`object`는 객체라는 넓은 범주의 타입을 표현하고, 객체 리터럴 타입은 구체적인 프로퍼티 구조를 표현한다는 차이가 있습니다.

## 6. 특수 타입(Special Types)

TypeScript는 일반적인 데이터 타입 외에도 타입 검사와 함수 반환값 등을 표현하기 위한 특수 타입을 제공합니다.

대표적으로 `any`, `unknown`, `void`, `never` 등이 있습니다.

### 6.1. any

`any`는 TypeScript의 타입 검사를 사실상 우회하는 특수 타입입니다.

`any` 타입으로 선언된 값은 어떤 타입의 값이든 할당할 수 있으며, 임의의 프로퍼티 접근이나 함수 호출도 타입 검사 없이 허용됩니다.

```typescript
let value: any = 100;

value = "Hello";
value = true;

value.someProperty;
value.someMethod();
```

`any`는 기존 JavaScript 코드와의 호환성이나 타입 정보가 부족한 외부 라이브러리를 다룰 때 활용할 수 있습니다.

하지만 지나치게 사용하면 정적 타입 검사의 이점을 잃게 됩니다.

```typescript
let value: any = "Hello";

// 컴파일 타임에 오류가 발생하지 않음
const result: number = value;
```

가능하면 `any` 대신 `unknown`을 사용하고, 필요한 경우 타입 검사를 통해 구체적인 타입으로 좁히는 것이 좋습니다.

### 6.2. unknown

`unknown`은 어떤 종류의 값이든 할당할 수 있지만, 실제 타입이 확인되기 전까지는 해당 값을 구체적인 타입으로 사용할 수 없도록 제한하는 타입입니다.

```typescript
let value: unknown = "Hello";

value = 100;
value = true;
```

`unknown` 타입의 값은 모든 타입의 값을 받을 수 있지만, 반대로 `unknown` 값을 다른 구체적인 타입에 할당하려면 타입 검증이 필요합니다.

```typescript
let value: unknown = "Hello";

// Type Error
const username: string = value;
```

`typeof` 등의 타입 가드를 활용하면 실제 타입을 확인한 후 안전하게 사용할 수 있습니다.

```typescript
function printValue(value: unknown): void {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  }

  if (typeof value === "number") {
    console.log(value.toFixed(2));
  }
}
```

`unknown`은 외부 API 응답, JSON 파싱 결과, 사용자 입력 등 타입을 사전에 확신할 수 없는 데이터를 처리할 때 유용합니다.

### 6.3. any와 unknown의 차이

두 타입 모두 다양한 종류의 값을 허용하지만 타입 검사 방식에 차이가 있습니다.

| 구분 | any | unknown |
|---|---|---|
| 모든 타입의 값 할당 | 가능 | 가능 |
| 다른 타입으로 할당 | 가능 | 타입 검사 필요 |
| 임의의 프로퍼티 접근 | 가능 | 불가능 |
| 함수 호출 | 가능 | 불가능 |
| 타입 안정성 | 낮음 | 높음 |
| 주요 목적 | 타입 검사 우회 | 타입을 모르는 값의 안전한 처리 |

`unknown`은 타입을 모르는 상황에서도 타입 안정성을 유지할 수 있도록 지원하는 타입입니다.

### 6.4. void

`void`는 일반적으로 함수가 의미 있는 반환값을 제공하지 않는다는 것을 표현하는 타입입니다.

```typescript
function logMessage(message: string): void {
  console.log(message);
}
```

위 함수는 로그를 출력하지만 별도의 값을 반환하지 않습니다.

JavaScript 함수는 명시적인 반환문이 없으면 실제로 `undefined`를 반환합니다. 따라서 `void`는 런타임 값 자체를 의미하기보다는 함수의 반환값을 사용하지 않는다는 타입 수준의 의도를 나타냅니다.

```typescript
function logMessage(): void {
  console.log("Hello");
}

const result = logMessage();

console.log(result); // undefined
```

`void`는 주로 반환값이 필요하지 않은 함수의 반환 타입을 선언할 때 사용합니다.

### 6.5. never

`never`는 정상적으로 도달할 수 있는 값이 존재하지 않는 타입입니다.

함수가 항상 예외를 발생시키거나 종료되지 않는 무한 루프를 수행하는 경우 반환 타입으로 사용됩니다.

```typescript
function throwError(message: string): never {
  throw new Error(message);
}
```

위 함수는 정상적인 반환 경로가 존재하지 않으므로 `never` 타입을 반환합니다.

다음과 같이 무한 루프를 수행하는 함수에도 사용할 수 있습니다.

```typescript
function infiniteLoop(): never {
  while (true) {
    // Infinite Loop
  }
}
```

`never`는 모든 타입에 할당할 수 있지만, 일반적인 다른 타입의 값은 `never` 타입에 할당할 수 없습니다.

```typescript
let value: never;

// Type Error
value = 100;
```

`never`는 이후 Union Type, 타입 좁히기 및 Exhaustive Check 등의 개념에서 중요한 역할을 합니다.

### 6.6. 특수 타입 비교

| 타입 | 주요 역할 | 특징 |
|---|---|---|
| `any` | 타입 검사 우회 | 모든 타입의 연산과 할당 허용 |
| `unknown` | 알 수 없는 값 표현 | 사용 전에 타입 검사 필요 |
| `void` | 반환값이 없는 함수 표현 | 주로 함수 반환 타입에 사용 |
| `never` | 도달할 수 없는 값 표현 | 정상적인 값이 존재하지 않음 |

## 7. 타입 별칭(Type Alias)

타입 별칭(Type Alias)은 기존 타입에 새로운 이름을 부여하는 기능입니다.

`type` 키워드를 사용하여 선언하며, 원시 타입, 객체 타입, 배열, 튜플 등 다양한 타입에 이름을 지정할 수 있습니다.

```typescript
type UserId = number;

type Username = string;

type User = {
  id: UserId;
  name: Username;
};

const user: User = {
  id: 1,
  name: "Alice",
};
```

타입 별칭을 사용하면 복잡한 타입을 재사용할 수 있으며, 코드의 가독성과 유지보수성을 높일 수 있습니다.

다만 타입 별칭 자체가 새로운 타입을 생성하는 것은 아닙니다. 기존 타입에 새로운 이름을 부여하는 방식입니다.

`type`과 `interface`의 차이 및 활용 방법은 별도의 관련 개념에서 다룹니다.

## 8. 타입 표기(Type Annotation)와 타입 추론(Type Inference)

TypeScript에서는 타입을 직접 선언하는 방식과 컴파일러가 타입을 추론하도록 하는 방식을 모두 사용할 수 있습니다.

### 8.1. 타입 표기(Type Annotation)

타입 표기는 변수나 함수 등에 타입을 명시적으로 지정하는 방식입니다.

변수명 뒤에 콜론(`:`)을 사용하여 타입을 선언합니다.

```typescript
let username: string = "Alice";
let age: number = 30;

function add(a: number, b: number): number {
  return a + b;
}
```

타입 표기는 데이터 구조와 함수의 입출력 형태를 명확하게 표현할 때 유용합니다.

### 8.2. 타입 추론(Type Inference)

타입 추론은 초기값이나 코드의 문맥을 기반으로 TypeScript 컴파일러가 타입을 자동으로 결정하는 기능입니다.

```typescript
let username = "Alice";
let age = 30;

function getUsername() {
  return username;
}
```

위 코드에서 `username`은 `string`, `age`는 `number`, `getUsername()`의 반환 타입은 `string`으로 추론됩니다.

불필요한 타입 표기를 줄이면서도 정적 타입 검사의 이점을 유지할 수 있습니다.

### 8.3. 타입 표기와 타입 추론의 활용

타입 추론이 가능한 영역에서는 불필요한 타입 표기를 생략할 수 있습니다.

```typescript
const count: number = 10;

// 타입 추론을 활용한 선언
const total = 100;
```

반면 함수의 공개 인터페이스나 복잡한 데이터 구조 등에서는 명시적인 타입 표기를 활용하는 것이 좋습니다.

## 9. 원시 타입과 래퍼 객체 타입(Wrapper Object Types)

TypeScript에서는 원시 타입을 표현할 때 소문자로 시작하는 타입 이름을 사용하는 것이 일반적입니다.

```typescript
let username: string = "Alice";
let age: number = 30;
let isActive: boolean = true;
```

반면 `String`, `Number`, `Boolean`과 같이 대문자로 시작하는 타입은 JavaScript의 원시 값과 관련된 래퍼 객체 타입(Wrapper Object Types)을 나타냅니다.

JavaScript는 원시 값에 객체처럼 메서드를 호출할 수 있도록 내부적으로 래퍼 객체를 사용하는 동작을 지원합니다.

```typescript
const username: string = "Alice";

console.log(username.toUpperCase());
```

이러한 동작이 가능하더라도 원시 타입과 래퍼 객체 타입은 구분해야 합니다.

```typescript
let primitive: string = "Hello";

let wrapper: String = new String("Hello");
```

`String`과 같은 래퍼 객체 타입은 일반적인 원시 문자열과 타입 호환성 및 런타임 동작에서 차이가 있습니다.

따라서 타입 선언에는 다음과 같은 소문자 원시 타입을 사용하는 것이 권장됩니다.

| 권장 타입 | 지양할 타입 |
|---|---|
| `string` | `String` |
| `number` | `Number` |
| `boolean` | `Boolean` |
| `symbol` | `Symbol` |
| `bigint` | `BigInt` |

## 10. 정리

TypeScript의 기본 타입은 데이터의 형태와 사용 가능한 연산을 명확하게 표현하기 위한 핵심 요소입니다.

주요 내용을 정리하면 다음과 같습니다.

- `string`, `number`, `boolean`은 가장 기본적인 원시 타입입니다.
- `bigint`와 `symbol`은 JavaScript의 추가 원시 타입을 표현합니다.
- `null`과 `undefined`는 `strictNullChecks` 설정에 따라 타입 호환성이 달라집니다.
- 배열은 `T[]` 또는 `Array<T>`로 선언할 수 있습니다.
- 튜플은 요소의 순서와 위치별 타입을 정의하는 배열 형태의 타입입니다.
- 객체 타입은 프로퍼티의 구조와 타입을 정의합니다.
- `any`는 타입 검사를 우회하며, `unknown`은 타입 검사를 통해 안전한 사용을 요구합니다.
- `void`는 일반적으로 반환값이 없는 함수를 표현합니다.
- `never`는 정상적인 반환값이 존재하지 않는 상황을 표현합니다.
- 타입 별칭은 기존 타입에 새로운 이름을 부여하여 재사용성을 높입니다.
- 타입 표기와 타입 추론을 적절하게 활용하면 명확하면서도 간결한 코드를 작성할 수 있습니다.
- 원시 타입을 선언할 때는 `String`, `Number`, `Boolean`이 아닌 `string`, `number`, `boolean`을 사용하는 것이 권장됩니다.

기본 타입은 이후 다루게 될 Union Type, Intersection Type, Literal Type, Generic 및 Type Narrowing 등의 기반이 됩니다. 따라서 각 타입의 의미뿐 아니라 타입 간 호환성과 사용 범위도 함께 이해하는 것이 중요합니다.

## 참고 자료

- [TypeScript Documentation - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Documentation - Basic Types](https://www.typescriptlang.org/docs/handbook/basic-types.html)
- [TypeScript Handbook - Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Documentation - TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [MDN - JavaScript Data Types and Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures)
- [TypeScript Playground](https://www.typescriptlang.org/play/)