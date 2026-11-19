# Generics

## 1. 제네릭(Generics)이란?

제네릭(Generics)은 특정 타입에 종속되지 않고 여러 타입에서 재사용할 수 있는 함수, 인터페이스, 클래스 및 타입을 정의하는 기능입니다.

일반적인 타입 선언은 매개변수나 반환값의 타입을 구체적으로 지정합니다. 이 방식은 타입 안정성을 제공하지만, 동일한 로직을 여러 타입에 적용하려면 타입마다 별도의 구현이 필요할 수 있습니다.

```typescript
function getNumber(value: number): number {
  return value;
}

function getString(value: string): string {
  return value;
}
```

두 함수는 입력값을 그대로 반환한다는 동일한 동작을 수행하지만, 입력 타입이 다르기 때문에 별도로 정의되어 있습니다.

제네릭을 사용하면 타입을 매개변수로 전달하여 하나의 구현으로 여러 타입을 처리할 수 있습니다.

```typescript
function identity<T>(value: T): T {
  return value;
}

const numberValue = identity<number>(100);
const stringValue = identity<string>("React");
const booleanValue = identity<boolean>(true);
```

`T`는 타입 매개변수(Type Parameter)입니다. 함수가 호출될 때 전달된 타입에 따라 구체적인 타입으로 결정됩니다.

위 예제에서 각 호출의 타입은 다음과 같습니다.

| 호출 | 결정된 타입 |
|---|---|
| `identity<number>(100)` | `(value: number) => number` |
| `identity<string>("React")` | `(value: string) => string` |
| `identity<boolean>(true)` | `(value: boolean) => boolean` |

제네릭은 입력 타입과 반환 타입 사이의 관계를 유지하면서 여러 타입을 처리할 수 있도록 합니다.

## 2. 타입 매개변수(Type Parameter)

타입 매개변수는 제네릭 선언 내부에서 사용할 타입을 나타내는 식별자입니다.

일반적인 함수 매개변수가 런타임 값을 전달받는 것과 달리, 타입 매개변수는 컴파일 시점에 타입 정보를 전달받습니다.

```typescript
function wrap<T>(value: T): { data: T } {
  return {
    data: value,
  };
}

const result = wrap<string>("Hello");
```

`T`는 함수의 매개변수와 반환 타입에 함께 사용됩니다.

따라서 `wrap<string>()`의 반환 타입은 다음과 같이 결정됩니다.

```typescript
{
  data: string;
}
```

### 2.1. 타입 매개변수 이름

타입 매개변수에는 일반적인 식별자 규칙에 따라 이름을 지정할 수 있습니다.

관례적으로 다음과 같은 이름을 자주 사용합니다.

| 이름 | 일반적인 의미 |
|---|---|
| `T` | Type |
| `U` | 두 번째 타입 매개변수 |
| `K` | Key |
| `V` | Value |
| `E` | Element 또는 Error |
| `R` | Return |

타입 매개변수가 여러 개라면 각 매개변수가 나타내는 의미를 구분할 수 있도록 작성하는 것이 좋습니다.

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("age", 30);
```

이때 `T`는 `string`, `U`는 `number`로 결정됩니다.

### 2.2. 타입 인자(Type Argument)

타입 매개변수에 실제로 전달하는 구체적인 타입을 타입 인자(Type Argument)라고 합니다.

```typescript
function identity<T>(value: T): T {
  return value;
}

const result = identity<string>("TypeScript");
```

위 예제에서 다음과 같이 구분할 수 있습니다.

- `T`: 타입 매개변수
- `string`: 타입 인자

타입 인자는 함수 호출 시 명시적으로 전달할 수도 있고, 타입 추론을 통해 생략할 수도 있습니다.

## 3. 타입 인자 추론(Type Argument Inference)

TypeScript는 함수의 인자와 타입 매개변수의 관계를 분석하여 타입 인자를 자동으로 추론할 수 있습니다.

```typescript
function identity<T>(value: T): T {
  return value;
}

const numberValue = identity(100);
const stringValue = identity("React");
```

위 예제에서는 타입 인자를 직접 지정하지 않았지만, TypeScript가 전달된 값으로부터 타입을 추론합니다.

```typescript
const numberValue: number;
const stringValue: string;
```

일반적으로 타입 추론이 명확하다면 타입 인자를 생략하는 것이 간결합니다.

반면 타입 추론만으로 의도한 타입을 결정하기 어렵거나 특정 타입으로 제한해야 한다면 명시적으로 타입 인자를 전달할 수 있습니다.

```typescript
function createArray<T>(value: T, length: number): T[] {
  return Array.from({ length }, () => value);
}

const numbers = createArray<number>(0, 3);
```

타입 인자 추론은 제네릭 사용성을 높이지만, 모든 상황에서 원하는 타입이 자동으로 결정되는 것은 아닙니다.

## 4. 제네릭 함수(Generic Function)

제네릭 함수는 타입 매개변수를 사용하여 여러 타입에 대응하는 함수입니다.

```typescript
function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = getFirst([10, 20, 30]);
const firstString = getFirst(["React", "TypeScript"]);
```

배열의 요소 타입에 따라 반환 타입이 결정됩니다.

- `getFirst([10, 20, 30])`: `number | undefined`
- `getFirst(["React", "TypeScript"])`: `string | undefined`

이처럼 제네릭 함수는 입력 데이터의 타입 정보를 반환 타입까지 전달할 수 있습니다.

### 4.1. 제네릭 타입 변수 사용

제네릭 타입 매개변수는 함수 내부에서도 사용할 수 있습니다.

```typescript
function loggingIdentity<T>(value: T[]): T[] {
  console.log(value.length);

  return value;
}
```

`value`는 `T` 타입의 요소를 가진 배열이므로 배열의 `length` 프로퍼티에 접근할 수 있습니다.

반면 다음 코드는 오류가 발생합니다.

```typescript
function loggingIdentity<T>(value: T): T {
  console.log(value.length);

  return value;
}
```

`T`는 특정 타입으로 제한되지 않았으므로 모든 타입이 `length` 프로퍼티를 가지고 있다고 보장할 수 없습니다.

제네릭 타입 매개변수는 임의의 타입을 나타내므로, 타입에 대해 보장되지 않은 프로퍼티나 메서드에 접근할 수 없습니다.

이러한 제약은 제네릭 함수가 타입 안정성을 유지하도록 합니다.

### 4.2. 제네릭 함수 타입

제네릭 함수 자체의 타입도 정의할 수 있습니다.

```typescript
type Identity = <T>(value: T) => T;

const identity: Identity = (value) => value;
```

함수의 호출 시점에 타입이 결정되는 구조입니다.

```typescript
const numberValue = identity(100);
const stringValue = identity("React");
```

제네릭 타입 매개변수는 함수 시그니처에 선언할 수 있으며, 함수 타입을 별도의 타입 별칭이나 인터페이스로 분리할 수 있습니다.

## 5. 제네릭 인터페이스(Generic Interface)

인터페이스에도 타입 매개변수를 선언할 수 있습니다.

```typescript
interface Response<T> {
  data: T;
  status: number;
}

const userResponse: Response<string> = {
  data: "User information",
  status: 200,
};

const countResponse: Response<number> = {
  data: 100,
  status: 200,
};
```

`Response<T>`는 데이터 타입에 관계없이 동일한 응답 구조를 표현합니다.

실제 애플리케이션에서는 API 응답 구조를 정의할 때 자주 활용합니다.

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface User {
  id: number;
  name: string;
}

interface Product {
  id: number;
  price: number;
}

const userResponse: ApiResponse<User> = {
  data: {
    id: 1,
    name: "Kim",
  },
  message: "User retrieved",
  success: true,
};

const productResponse: ApiResponse<Product> = {
  data: {
    id: 10,
    price: 15000,
  },
  message: "Product retrieved",
  success: true,
};
```

`ApiResponse<T>`는 응답 구조를 공통으로 유지하면서 `data`의 타입만 변경할 수 있습니다.

### 5.1. 인터페이스 전체에 타입 매개변수 적용

인터페이스 이름 뒤에 타입 매개변수를 선언하면 인터페이스의 여러 멤버에서 해당 타입을 공유할 수 있습니다.

```typescript
interface Container<T> {
  value: T;
  getValue: () => T;
  setValue: (value: T) => void;
}

const container: Container<number> = {
  value: 10,

  getValue() {
    return this.value;
  },

  setValue(value) {
    this.value = value;
  },
};
```

이 구조에서는 `Container<number>`의 모든 관련 멤버가 동일한 `number` 타입을 사용합니다.

### 5.2. 인터페이스의 함수 시그니처에 타입 매개변수 적용

타입 매개변수를 인터페이스 자체가 아니라 함수 시그니처에 선언할 수도 있습니다.

```typescript
interface Identity {
  <T>(value: T): T;
}

const identity: Identity = (value) => value;

const numberValue = identity(100);
const stringValue = identity("React");
```

두 선언 방식은 제네릭 타입이 적용되는 범위가 다릅니다.

```typescript
interface GenericContainer<T> {
  value: T;
}

interface GenericFunction {
  <T>(value: T): T;
}
```

- `GenericContainer<T>`: 인터페이스를 사용하는 시점에 타입이 결정됩니다.
- `GenericFunction`: 함수가 호출되는 시점에 타입이 결정됩니다.

제네릭 타입 매개변수를 어디에 선언하는지에 따라 타입이 결정되는 시점과 적용 범위가 달라집니다.

## 6. 제네릭 타입 별칭(Generic Type Alias)

타입 별칭에도 제네릭을 적용할 수 있습니다.

```typescript
type Pair<T, U> = {
  first: T;
  second: U;
};

const pair: Pair<string, number> = {
  first: "age",
  second: 30,
};
```

여러 타입을 조합하는 구조를 재사용할 때 유용합니다.

배열이나 튜플, Union Type 등에도 적용할 수 있습니다.

```typescript
type Nullable<T> = T | null;

type List<T> = T[];

type Result<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};
```

사용 시점에 구체적인 타입을 전달합니다.

```typescript
const user: Nullable<string> = "Kim";

const numbers: List<number> = [1, 2, 3];

const result: Result<string> = {
  success: true,
  data: "Completed",
};
```

제네릭 타입 별칭은 반복되는 데이터 구조를 추상화하면서 타입 간의 관계를 유지할 수 있습니다.

## 7. 제네릭 클래스(Generic Class)

클래스에도 타입 매개변수를 선언할 수 있습니다.

```typescript
class Storage<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const numberStorage = new Storage<number>(100);
const stringStorage = new Storage<string>("React");
```

`Storage<T>`는 생성 시 전달된 타입을 기준으로 인스턴스의 프로퍼티와 메서드 타입을 결정합니다.

```typescript
numberStorage.setValue(200);

// Type Error
numberStorage.setValue("React");
```

클래스 내부에서 동일한 타입을 일관되게 사용해야 하는 경우 유용합니다.

### 7.1. 제네릭 클래스의 정적 멤버

제네릭 클래스의 타입 매개변수는 인스턴스 측면에 적용됩니다.

따라서 클래스의 정적 멤버에서는 클래스의 타입 매개변수를 직접 사용할 수 없습니다.

```typescript
class Container<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  // Type Error
  // static defaultValue: T;
}
```

정적 멤버는 특정 인스턴스가 생성되기 전에 클래스 자체에 속하므로, 인스턴스마다 달라질 수 있는 제네릭 타입 매개변수와 직접 연결할 수 없습니다.

## 8. 제네릭 제약 조건(Generic Constraints)

제네릭은 기본적으로 다양한 타입을 허용하지만, 특정 프로퍼티나 메서드가 존재한다는 사실까지 보장하지는 않습니다.

제네릭 함수 내부에서 특정 프로퍼티에 접근해야 한다면 제네릭 제약 조건(Generic Constraints)을 사용해야 합니다.

제약 조건은 `extends` 키워드로 선언합니다.

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(value: T): T {
  console.log(value.length);

  return value;
}
```

`T extends Lengthwise`는 `T`가 `Lengthwise`의 구조를 만족해야 한다는 의미입니다.

따라서 `length` 프로퍼티를 가진 타입만 전달할 수 있습니다.

```typescript
loggingIdentity("React");

loggingIdentity([1, 2, 3]);

loggingIdentity({
  length: 10,
  value: "TypeScript",
});

// Type Error
loggingIdentity(100);
```

문자열, 배열, 객체는 `length` 프로퍼티를 가지고 있으므로 사용할 수 있지만, 숫자는 해당 프로퍼티를 가지고 있지 않으므로 사용할 수 없습니다.

### 8.1. 객체 프로퍼티를 기준으로 제약 조건 적용

객체의 특정 프로퍼티를 기준으로 타입을 제한할 수도 있습니다.

```typescript
interface Identifiable {
  id: number;
}

function getId<T extends Identifiable>(value: T): number {
  return value.id;
}

const user = {
  id: 1,
  name: "Kim",
};

const product = {
  id: 10,
  price: 15000,
};

getId(user);
getId(product);
```

두 객체는 서로 다른 구조를 가지고 있지만, 모두 `id: number`를 만족하므로 동일한 제네릭 함수를 사용할 수 있습니다.

제네릭 제약 조건은 특정 구체 타입을 요구하는 대신 필요한 구조만 요구할 수 있다는 점에서 유연합니다.

## 9. `keyof`를 활용한 제네릭 제약 조건

`keyof`는 객체 타입의 프로퍼티 키를 Union Type으로 추출하는 연산자입니다.

제네릭과 함께 사용하면 객체에 실제로 존재하는 프로퍼티만 접근하도록 제한할 수 있습니다.

```typescript
function getProperty<T, K extends keyof T>(
  object: T,
  key: K,
): T[K] {
  return object[key];
}
```

각 타입 매개변수의 역할은 다음과 같습니다.

- `T`: 객체의 타입
- `K`: 객체에서 접근할 프로퍼티 키의 타입
- `K extends keyof T`: `K`는 `T`에 존재하는 프로퍼티 키로 제한됩니다.
- `T[K]`: 해당 프로퍼티에 대응하는 값의 타입입니다.

다음과 같이 사용할 수 있습니다.

```typescript
const user = {
  id: 1,
  name: "Kim",
  active: true,
};

const id = getProperty(user, "id");
const name = getProperty(user, "name");
const active = getProperty(user, "active");
```

각 반환 타입은 접근한 프로퍼티에 따라 결정됩니다.

```typescript
const id: number;
const name: string;
const active: boolean;
```

존재하지 않는 프로퍼티에 접근하면 컴파일 오류가 발생합니다.

```typescript
// Type Error
getProperty(user, "email");
```

`keyof`와 제네릭을 함께 사용하면 객체의 구조와 프로퍼티 접근 사이의 타입 관계를 안전하게 표현할 수 있습니다.

## 10. 제네릭 기본 타입 매개변수(Default Type Parameter)

제네릭 타입 매개변수에는 기본 타입을 지정할 수 있습니다.

기본 타입 매개변수는 타입 인자를 생략했을 때 사용할 기본 타입을 정의합니다.

```typescript
interface Response<T = string> {
  data: T;
  status: number;
}

const stringResponse: Response = {
  data: "Success",
  status: 200,
};

const numberResponse: Response<number> = {
  data: 100,
  status: 200,
};
```

`Response`에서 타입 인자를 생략하면 기본값인 `string`이 사용됩니다.

타입 인자를 직접 전달하면 기본값 대신 지정한 타입이 적용됩니다.

여러 타입 매개변수에 기본값을 지정할 수도 있습니다.

```typescript
interface ApiResponse<T, E = Error> {
  data: T;
  error?: E;
}

const response: ApiResponse<string> = {
  data: "Success",
};
```

기본 타입 매개변수는 선택적인 타입 인자를 제공하여 제네릭 타입의 사용성을 높입니다.

다만 기본 타입 매개변수는 필수 타입 매개변수보다 뒤에 선언해야 합니다.

```typescript
// 올바른 선언
type Result<T, E = Error> = {
  data: T;
  error?: E;
};
```

## 11. 여러 타입 매개변수의 관계 표현

제네릭은 하나의 타입만 추상화하는 것이 아니라 여러 타입 사이의 관계를 표현할 수도 있습니다.

```typescript
function map<T, U>(
  items: T[],
  callback: (item: T) => U,
): U[] {
  return items.map(callback);
}
```

위 함수는 입력 배열의 요소 타입 `T`와 변환 결과 타입 `U`를 각각 표현합니다.

```typescript
const names = map(
  [1, 2, 3],
  (value) => `User ${value}`,
);
```

입력 타입과 반환 타입은 다음과 같습니다.

- 입력 배열: `number[]`
- 콜백 입력: `number`
- 콜백 반환: `string`
- 최종 반환: `string[]`

이처럼 제네릭은 단순히 여러 타입을 허용하는 것뿐 아니라, 서로 다른 타입 사이의 변환 관계도 표현할 수 있습니다.

## 12. 제네릭과 `any`, `unknown`의 차이

제네릭은 `any`와 마찬가지로 여러 타입을 처리할 수 있지만, 타입 정보를 유지한다는 점에서 차이가 있습니다.

### 12.1. `any` 사용

```typescript
function identity(value: any): any {
  return value;
}

const result = identity(100);
```

`any`를 사용하면 입력 타입과 반환 타입 사이의 관계가 사라집니다.

함수 호출 이후에도 반환값을 자유롭게 사용할 수 있으므로 타입 안정성이 낮아질 수 있습니다.

### 12.2. 제네릭 사용

```typescript
function identity<T>(value: T): T {
  return value;
}

const result = identity(100);
```

제네릭은 입력값의 타입 정보를 반환값까지 유지합니다.

따라서 `result`는 `number` 타입으로 추론됩니다.

### 12.3. `unknown` 사용

`unknown`은 모든 타입의 값을 할당받을 수 있지만, 실제 타입을 확인하기 전에는 해당 값을 임의로 사용할 수 없습니다.

```typescript
function identity(value: unknown): unknown {
  return value;
}

const result = identity(100);

// Type Error
// result.toFixed();
```

`unknown`은 타입 정보를 유지하지 않는 대신 사용 시점에 타입 검증을 요구합니다.

반면 제네릭은 입력 타입과 반환 타입 사이의 관계를 유지합니다.

| 구분 | `any` | `unknown` | 제네릭 |
|---|---|---|---|
| 다양한 타입 허용 | 가능 | 가능 | 가능 |
| 입력 타입 정보 유지 | 보장하지 않음 | 보장하지 않음 | 가능 |
| 반환 타입의 정밀도 | 낮음 | 낮음 | 높음 |
| 사용 전 타입 검증 | 요구하지 않음 | 요구함 | 추론된 타입에 따름 |
| 주요 목적 | 타입 검사 우회 | 알 수 없는 타입 표현 | 타입 관계 유지 및 재사용 |

타입 간의 관계를 표현할 수 있다면 `any` 대신 제네릭을 우선적으로 고려하는 것이 좋습니다.

## 13. React에서의 제네릭 활용

React와 TypeScript를 함께 사용할 때 제네릭은 컴포넌트의 재사용성과 Props 타입 안정성을 높이는 데 활용됩니다.

### 13.1. 제네릭 컴포넌트

여러 데이터 타입을 동일한 UI 구조로 렌더링하는 컴포넌트에 제네릭을 적용할 수 있습니다.

```tsx
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({
  items,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
```

`List<T>`는 배열의 요소 타입을 특정 타입으로 제한하지 않습니다.

대신 `items`와 `renderItem`이 동일한 `T` 타입을 사용하도록 관계를 정의합니다.

```tsx
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Kim" },
  { id: 2, name: "Lee" },
];

function App() {
  return (
    <List
      items={users}
      renderItem={(user) => user.name}
    />
  );
}
```

`items`로부터 `T`가 `User`로 추론되므로 `renderItem`의 매개변수도 `User` 타입으로 결정됩니다.

다른 데이터 타입에도 동일한 컴포넌트를 사용할 수 있습니다.

```tsx
const numbers = [10, 20, 30];

function App() {
  return (
    <List
      items={numbers}
      renderItem={(value) => value.toFixed(2)}
    />
  );
}
```

### 13.2. JSX에서 제네릭 화살표 함수 선언

TSX 파일에서 제네릭 화살표 함수를 선언할 때는 주의해야 합니다.

```tsx
const identity = <T,>(value: T): T => value;
```

TSX에서는 `<T>`가 JSX 태그의 시작으로 해석될 수 있으므로, `<T,>`와 같이 쉼표를 추가하여 제네릭 타입 매개변수 선언임을 명확하게 표현할 수 있습니다.

다음과 같이 함수 선언문을 사용하면 해당 모호성을 피할 수 있습니다.

```tsx
function identity<T>(value: T): T {
  return value;
}
```

### 13.3. 제네릭 `useState`

`useState`는 제네릭을 활용하여 상태값의 타입을 지정할 수 있습니다.

```tsx
const [user, setUser] = useState<User | null>(null);
```

이때 상태 타입은 `User | null`로 지정됩니다.

따라서 초기값이 `null`이더라도 이후 `User` 타입의 값을 안전하게 설정할 수 있습니다.

```tsx
setUser({
  id: 1,
  name: "Kim",
});

setUser(null);

// Type Error
setUser("Kim");
```

`useState<T>`의 타입 매개변수는 상태값과 상태 변경 함수 사이의 타입 관계를 유지합니다.

타입 추론이 충분히 명확하다면 타입 인자를 생략할 수도 있습니다.

```tsx
const [count, setCount] = useState(0);
```

### 13.4. 제네릭 커스텀 Hook

제네릭은 커스텀 Hook에서도 활용할 수 있습니다.

```tsx
function useArray<T>(initialValue: T[]) {
  const [items, setItems] = useState<T[]>(initialValue);

  const add = (item: T) => {
    setItems((previous) => [...previous, item]);
  };

  const remove = (index: number) => {
    setItems((previous) =>
      previous.filter((_, i) => i !== index),
    );
  };

  return {
    items,
    add,
    remove,
  };
}
```

호출 시 전달한 배열의 요소 타입에 따라 Hook 내부의 상태 타입과 메서드 매개변수 타입이 결정됩니다.

```tsx
const users = useArray<User>([
  { id: 1, name: "Kim" },
]);

users.add({
  id: 2,
  name: "Lee",
});
```

`useArray<T>`는 특정 데이터 구조에 종속되지 않고 여러 타입의 배열 상태를 관리할 수 있습니다.

## 14. 제네릭 사용 시 주의사항

### 14.1. 필요하지 않은 제네릭 사용 지양

제네릭은 타입 간의 관계를 표현할 때 유용하지만, 모든 함수에 제네릭을 적용할 필요는 없습니다.

```typescript
function getLength<T extends { length: number }>(
  value: T,
): number {
  return value.length;
}
```

위 함수는 입력값의 구체적인 타입을 반환하거나 다른 타입과 연결하지 않습니다.

따라서 다음과 같이 작성하는 편이 더 간결합니다.

```typescript
function getLength(value: { length: number }): number {
  return value.length;
}
```

제네릭은 타입 정보를 유지하거나 타입 간의 관계를 표현해야 할 때 사용하는 것이 적절합니다.

### 14.2. 불필요한 타입 매개변수 선언 지양

타입 매개변수가 실제로 사용되지 않거나 타입 간의 관계를 추가로 표현하지 않는다면 제네릭의 이점이 크지 않습니다.

```typescript
function logValue<T>(value: T): void {
  console.log(value);
}
```

위 함수는 모든 타입을 입력받지만, 타입 매개변수를 반환 타입이나 다른 매개변수와 연결하지 않습니다.

다음과 같이 작성해도 동일한 목적을 달성할 수 있습니다.

```typescript
function logValue(value: unknown): void {
  console.log(value);
}
```

### 14.3. 제네릭 제약 조건을 지나치게 제한하지 않기

제약 조건은 함수 내부에서 필요한 기능만 보장하도록 설계하는 것이 좋습니다.

```typescript
interface Entity {
  id: number;
  name: string;
  createdAt: Date;
}

function getEntityId<T extends Entity>(entity: T): number {
  return entity.id;
}
```

함수에서 실제로 사용하는 프로퍼티는 `id`뿐이지만, `Entity` 전체를 제약 조건으로 지정하면 `name`과 `createdAt`까지 요구하게 됩니다.

필요한 구조만 별도로 정의하는 것이 더 유연합니다.

```typescript
interface HasId {
  id: number;
}

function getEntityId<T extends HasId>(entity: T): number {
  return entity.id;
}
```

제네릭 제약 조건은 함수가 필요로 하는 최소한의 구조를 표현하는 것이 좋습니다.

### 14.4. 제네릭이 런타임 타입 검사를 제공하지는 않음

TypeScript의 제네릭은 컴파일 시점에 타입을 검사하기 위한 기능입니다.

타입 매개변수는 JavaScript로 변환되는 과정에서 제거되므로 런타임에 직접 사용할 수 없습니다.

```typescript
function createValue<T>(): T {
  // 런타임에 T를 확인할 수 없음
  throw new Error("Not implemented");
}
```

런타임에 실제 타입을 확인해야 한다면 생성자 함수, 타입 가드 또는 별도의 검증 로직을 사용해야 합니다.

```typescript
function createInstance<T>(
  constructor: new () => T,
): T {
  return new constructor();
}
```

위 예제는 생성자 함수를 런타임 값으로 전달받기 때문에 실제 인스턴스를 생성할 수 있습니다.

## 15. 정리

제네릭은 타입을 매개변수화하여 다양한 타입에 재사용할 수 있는 함수와 데이터 구조를 정의하는 TypeScript의 핵심 기능입니다.

주요 개념은 다음과 같습니다.

| 개념 | 설명 |
|---|---|
| Type Parameter | 제네릭 선언에 사용하는 타입 매개변수 |
| Type Argument | 타입 매개변수에 전달하는 실제 타입 |
| Type Argument Inference | 함수 인자 등을 기반으로 타입 인자를 자동 추론하는 기능 |
| Generic Function | 타입 매개변수를 사용하는 함수 |
| Generic Interface | 타입 매개변수를 사용하는 인터페이스 |
| Generic Type Alias | 타입 매개변수를 사용하는 타입 별칭 |
| Generic Class | 타입 매개변수를 사용하는 클래스 |
| Generic Constraint | `extends`를 사용하여 타입 매개변수의 허용 범위를 제한하는 기능 |
| Default Type Parameter | 타입 인자를 생략했을 때 사용할 기본 타입 |
| `keyof`와 제네릭 | 객체의 프로퍼티 키와 값 사이의 타입 관계를 표현하는 방식 |

제네릭의 핵심은 여러 타입을 허용하는 데 그치지 않고, 입력값과 반환값, 객체의 프로퍼티, 함수의 매개변수 사이에 존재하는 타입 관계를 유지하는 것입니다.

따라서 제네릭을 설계할 때는 재사용성뿐 아니라 타입 정보가 어떤 범위에서 공유되고, 어떤 시점에 구체화되는지 함께 고려해야 합니다.

## 참고 자료

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - 제네릭의 기본 개념, 타입 매개변수, 제네릭 함수와 인터페이스, 제약 조건 및 클래스에 관한 공식 문서입니다.
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
  - 타입 추론의 동작 방식과 제네릭 함수에서의 타입 추론을 이해하는 데 참고할 수 있습니다.
- [TypeScript Handbook - Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
  - `keyof`를 활용한 객체 프로퍼티 키 추출과 타입 관계를 설명합니다.
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, T>` 등 제네릭을 기반으로 제공되는 유틸리티 타입을 설명합니다.
- [React - Using TypeScript](https://react.dev/learn/typescript)
  - React 컴포넌트, Props, Hook 등에 TypeScript를 적용하는 방법을 설명합니다.