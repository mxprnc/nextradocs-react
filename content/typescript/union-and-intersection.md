# Union and Intersection Types

## 1. Union Type과 Intersection Type이란?

Union Type과 Intersection Type은 기존 타입을 조합하여 새로운 타입을 정의하는 TypeScript의 타입 조합 기능입니다.

기본 타입이나 객체 타입을 개별적으로 사용하는 것뿐 아니라, 여러 타입을 조합하여 하나의 값이 가질 수 있는 타입의 범위와 구조를 표현할 수 있습니다.

두 타입은 다음과 같은 차이가 있습니다.

- Union Type(`|`): 여러 타입 중 하나에 해당하는 값을 표현합니다.
- Intersection Type(`&`): 여러 타입의 조건을 동시에 만족하는 값을 표현합니다.

```typescript
type Identifier = string | number;

type User = {
  id: number;
  name: string;
};

type Timestamped = {
  createdAt: Date;
};

type TimestampedUser = User & Timestamped;
```

`Identifier`는 문자열 또는 숫자 중 하나를 의미합니다.

반면 `TimestampedUser`는 `User`와 `Timestamped`의 모든 프로퍼티를 포함하는 객체 타입을 의미합니다.

이러한 타입 조합 기능은 복잡한 데이터 구조, API 응답, 컴포넌트 Props 및 상태 관리 등의 영역에서 활용됩니다.

## 2. Union Type

Union Type은 두 개 이상의 타입 중 하나에 해당하는 값을 표현하는 타입입니다.

수직선(`|`)을 사용하여 여러 타입을 연결하며, 해당 타입으로 선언된 값은 연결된 타입 중 하나에 해당해야 합니다.

### 2.1. Union Type 선언

다음과 같이 서로 다른 원시 타입을 조합할 수 있습니다.

```typescript
type Identifier = string | number;

let id: Identifier;

id = "user-001";
id = 100;

// Type Error
id = true;
```

`Identifier`는 `string` 또는 `number` 타입을 의미합니다.

따라서 문자열과 숫자는 할당할 수 있지만, Union Type에 포함되지 않은 Boolean 값은 할당할 수 없습니다.

Union Type은 변수뿐 아니라 함수의 매개변수와 반환 타입에도 사용할 수 있습니다.

```typescript
function printId(id: string | number): void {
  console.log(id);
}

printId("user-001");
printId(100);

// Type Error
printId(true);
```

이처럼 Union Type을 사용하면 하나의 함수가 여러 타입의 입력을 처리하면서도 허용되는 값의 범위를 명확하게 제한할 수 있습니다.

### 2.2. Union Type과 공통 프로퍼티

Union Type으로 선언된 값은 구성 요소 중 모든 타입이 공통으로 가지고 있는 프로퍼티에 접근할 수 있습니다.

```typescript
type User = {
  id: number;
  name: string;
};

type Admin = {
  id: number;
  name: string;
  permissions: string[];
};

function printUser(value: User | Admin): void {
  console.log(value.id);
  console.log(value.name);
}
```

`User`와 `Admin`은 모두 `id`와 `name`을 가지고 있으므로 두 프로퍼티에 안전하게 접근할 수 있습니다.

반면 `permissions`는 `Admin`에만 존재하므로 별도의 타입 검사가 필요합니다.

```typescript
function printPermissions(value: User | Admin): void {
  if ("permissions" in value) {
    console.log(value.permissions);
  }
}
```

`in` 연산자를 사용하면 해당 프로퍼티의 존재 여부를 기반으로 타입을 좁힐 수 있습니다.

Union Type에서는 모든 구성 타입에 공통으로 존재하는 멤버만 별도의 타입 좁히기 없이 안전하게 사용할 수 있다는 점이 중요합니다.

### 2.3. Union Type의 중첩

Union Type은 여러 개의 타입을 조합하거나 기존 Union Type을 다시 조합할 수 있습니다.

```typescript
type StringOrNumber = string | number;

type Value = StringOrNumber | boolean;
```

위 타입은 다음과 동일한 의미를 가집니다.

```typescript
type Value = string | number | boolean;
```

TypeScript는 중복된 타입을 정규화하여 처리하므로 다음과 같은 선언도 가능합니다.

```typescript
type Result = string | number | string;
```

실질적으로 `string | number`와 동일한 타입으로 처리됩니다.

## 3. Literal Union Type

Literal Union Type은 문자열, 숫자 또는 Boolean 리터럴 타입을 Union Type으로 조합하는 방식입니다.

특정 값만 허용해야 하는 경우 유용합니다.

### 3.1. String Literal Union

```typescript
type Status = "pending" | "success" | "error";

let status: Status;

status = "pending";
status = "success";

// Type Error
status = "loading";
```

`Status`는 일반적인 문자열이 아니라 세 가지 문자열 리터럴 중 하나만 허용합니다.

이를 통해 상태값이나 역할, 설정 옵션 등 허용 가능한 값의 범위를 명확하게 제한할 수 있습니다.

### 3.2. Numeric Literal Union

숫자 리터럴도 동일한 방식으로 조합할 수 있습니다.

```typescript
type HttpStatus = 200 | 400 | 401 | 404 | 500;

let statusCode: HttpStatus;

statusCode = 200;
statusCode = 404;

// Type Error
statusCode = 201;
```

### 3.3. Boolean Literal Union

Boolean 타입은 `true`와 `false` 두 가지 리터럴 타입으로 구성됩니다.

```typescript
type MyBoolean = true | false;
```

이는 일반적인 `boolean` 타입과 동일한 의미입니다.

반면 다음과 같이 특정 Boolean 값만 허용하는 타입을 정의할 수도 있습니다.

```typescript
type Enabled = true;

let enabled: Enabled = true;

// Type Error
enabled = false;
```

Literal Union Type은 일반적인 원시 타입보다 허용되는 값의 범위를 구체적으로 표현할 수 있다는 장점이 있습니다.

## 4. Discriminated Union

Discriminated Union은 공통된 구분자 프로퍼티(Discriminant Property)를 기반으로 Union Type의 구성 타입을 구분하는 패턴입니다.

각 타입에 서로 다른 리터럴 타입을 가지는 공통 프로퍼티를 정의하면, 해당 프로퍼티의 값을 검사하여 현재 값이 어떤 타입에 해당하는지 판별할 수 있습니다.

### 4.1. 기본 구조

다음은 네트워크 요청 상태를 표현하는 예제입니다.

```typescript
type LoadingState = {
  status: "loading";
};

type SuccessState = {
  status: "success";
  data: {
    id: number;
    name: string;
  };
};

type ErrorState = {
  status: "error";
  message: string;
};

type NetworkState =
  | LoadingState
  | SuccessState
  | ErrorState;
```

각 타입은 `status`라는 공통 프로퍼티를 가지고 있지만, 해당 프로퍼티의 리터럴 타입은 서로 다릅니다.

| 타입 | status | 추가 프로퍼티 |
|---|---|---|
| `LoadingState` | `"loading"` | 없음 |
| `SuccessState` | `"success"` | `data` |
| `ErrorState` | `"error"` | `message` |

`NetworkState`는 세 가지 상태 중 하나를 표현합니다.

### 4.2. Discriminant를 이용한 타입 좁히기

`status` 프로퍼티를 조건문으로 검사하면 TypeScript는 각 조건에 해당하는 구체적인 타입으로 값을 좁힙니다.

```typescript
function handleNetworkState(state: NetworkState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";

    case "success":
      return `User: ${state.data.name}`;

    case "error":
      return `Error: ${state.message}`;
  }
}
```

각 `case` 내부에서는 다음과 같이 타입이 좁혀집니다.

- `"loading"`: `LoadingState`
- `"success"`: `SuccessState`
- `"error"`: `ErrorState`

따라서 각 상태에만 존재하는 프로퍼티에 별도의 타입 단언 없이 안전하게 접근할 수 있습니다.

### 4.3. Discriminated Union의 활용 목적

Discriminated Union은 서로 다른 상태나 데이터 구조를 하나의 타입으로 표현하면서도 각 상태의 특성을 명확하게 유지할 수 있습니다.

대표적인 활용 사례는 다음과 같습니다.

- API 요청 상태
- 비동기 작업 상태
- 인증 및 권한 상태
- 폼 처리 상태
- 이벤트 종류에 따른 데이터 구조
- UI 컴포넌트의 상태 표현

특히 상태에 따라 사용할 수 있는 데이터가 달라지는 경우 유용합니다.

## 5. Exhaustive Check

Exhaustive Check는 Union Type에 정의된 모든 구성 타입이 처리되었는지 검사하는 기법입니다.

Discriminated Union과 `never` 타입을 활용하면 특정 상태가 처리되지 않은 경우 컴파일 타임에 오류를 발생시킬 수 있습니다.

### 5.1. 모든 상태를 처리해야 하는 이유

앞서 정의한 `NetworkState`를 처리하는 함수가 있다고 가정하겠습니다.

```typescript
function handleNetworkState(state: NetworkState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";

    case "success":
      return `User: ${state.data.name}`;

    case "error":
      return `Error: ${state.message}`;
  }
}
```

현재는 모든 상태를 처리하고 있습니다.

그러나 새로운 상태가 추가되면 기존 함수에서 해당 상태를 처리하지 못할 수 있습니다.

```typescript
type CachedState = {
  status: "cached";
  data: {
    id: number;
    name: string;
  };
};

type NetworkState =
  | LoadingState
  | SuccessState
  | ErrorState
  | CachedState;
```

기존 `switch` 문에는 `"cached"`에 대한 처리가 없습니다.

이러한 상황에서 Exhaustive Check를 사용하면 누락된 상태를 컴파일 타임에 발견할 수 있습니다.

### 5.2. never를 이용한 Exhaustive Check

`never`는 정상적으로 도달할 수 있는 값이 존재하지 않는 타입입니다.

Union Type의 모든 구성 타입을 처리하고 나면 남은 타입은 `never`가 됩니다.

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

위 함수를 활용하여 다음과 같이 작성할 수 있습니다.

```typescript
function handleNetworkState(state: NetworkState): string {
  switch (state.status) {
    case "loading":
      return "Loading...";

    case "success":
      return `User: ${state.data.name}`;

    case "error":
      return `Error: ${state.message}`;

    default:
      return assertNever(state);
  }
}
```

모든 상태가 처리되었다면 `default`에 도달하는 값은 존재하지 않으므로 `state`는 `never` 타입으로 추론됩니다.

반면 `"cached"` 상태가 추가되었지만 처리되지 않았다면 `state`는 `CachedState` 타입으로 남게 됩니다.

이 값을 `never` 타입의 매개변수에 전달할 수 없으므로 컴파일 타임에 오류가 발생합니다.

### 5.3. Exhaustive Check의 장점

Exhaustive Check를 활용하면 다음과 같은 이점을 얻을 수 있습니다.

- Union Type에 새로운 구성 타입이 추가되었을 때 누락된 처리 로직을 발견할 수 있습니다.
- 상태별 처리 로직이 완전하게 구현되었는지 검사할 수 있습니다.
- 불필요한 타입 단언 없이 안전하게 분기 처리를 구현할 수 있습니다.
- 코드 변경으로 인한 상태 처리 누락을 조기에 발견할 수 있습니다.

상태의 종류가 명확하게 정의된 시스템에서는 Exhaustive Check를 적극적으로 활용하는 것이 좋습니다.

## 6. Intersection Type

Intersection Type은 두 개 이상의 타입을 결합하여 모든 타입의 조건을 동시에 만족하는 새로운 타입을 정의하는 기능입니다.

앰퍼샌드(`&`)를 사용하여 여러 타입을 연결합니다.

### 6.1. 기본 구조

```typescript
type User = {
  id: number;
  name: string;
};

type Timestamped = {
  createdAt: Date;
};

type TimestampedUser = User & Timestamped;
```

`TimestampedUser`는 `User`와 `Timestamped`의 모든 프로퍼티를 포함합니다.

실질적으로 다음과 같은 구조를 가집니다.

```typescript
type TimestampedUser = {
  id: number;
  name: string;
  createdAt: Date;
};
```

따라서 해당 타입으로 객체를 선언하려면 모든 프로퍼티를 제공해야 합니다.

```typescript
const user: TimestampedUser = {
  id: 1,
  name: "Alice",
  createdAt: new Date(),
};
```

### 6.2. 여러 타입의 결합

Intersection Type은 두 개 이상의 타입을 결합할 수 있습니다.

```typescript
type Identifiable = {
  id: number;
};

type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Auditable = {
  createdBy: string;
};

type Entity = Identifiable & Timestamped & Auditable;
```

`Entity`는 세 타입의 프로퍼티를 모두 포함하는 객체 타입입니다.

```typescript
const entity: Entity = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "admin",
};
```

이러한 방식은 공통 프로퍼티를 여러 타입에서 재사용할 때 유용합니다.

### 6.3. 함수 매개변수에서의 활용

Intersection Type은 함수가 여러 타입의 프로퍼티를 모두 필요로 하는 상황에서도 활용할 수 있습니다.

```typescript
type User = {
  name: string;
};

type Loggable = {
  log: () => void;
};

function processUser(value: User & Loggable): void {
  console.log(value.name);
  value.log();
}
```

`processUser`는 `User`와 `Loggable`의 조건을 모두 만족하는 값을 전달받아야 합니다.

```typescript
const user = {
  name: "Alice",
  log() {
    console.log("User processed");
  },
};

processUser(user);
```

한쪽 타입의 조건만 만족하는 값은 전달할 수 없습니다.

## 7. Union Type과 Intersection Type의 차이

Union Type과 Intersection Type은 여러 타입을 조합한다는 공통점이 있지만, 타입을 결합하는 방식과 결과는 서로 다릅니다.

### 7.1. 개념적 차이

| 구분 | Union Type | Intersection Type |
|---|---|---|
| 연산자 | `\|` | `&` |
| 의미 | 여러 타입 중 하나 | 여러 타입의 조건을 모두 만족 |
| 타입 관계 | 대안적인 타입 | 결합된 타입 |
| 주요 활용 | 여러 형태의 입력 및 상태 | 여러 구조의 조합 및 확장 |
| 객체 프로퍼티 | 공통 프로퍼티에 안전하게 접근 | 결합된 모든 프로퍼티에 접근 |

다음 예제를 통해 차이를 확인할 수 있습니다.

```typescript
type A = {
  id: number;
};

type B = {
  name: string;
};

type Union = A | B;
type Intersection = A & B;
```

`Union`은 `A` 또는 `B`에 해당하는 값을 표현합니다.

```typescript
const value1: Union = {
  id: 1,
};

const value2: Union = {
  name: "Alice",
};
```

반면 `Intersection`은 `A`와 `B`의 조건을 모두 만족해야 합니다.

```typescript
const value: Intersection = {
  id: 1,
  name: "Alice",
};
```

### 7.2. 집합 관점에서의 이해

타입을 해당 타입에 할당할 수 있는 값들의 집합으로 이해하면 두 연산자의 차이를 쉽게 파악할 수 있습니다.

- Union Type(`A | B`): A 또는 B에 속하는 모든 값의 집합입니다.
- Intersection Type(`A & B`): A와 B에 동시에 속하는 값의 집합입니다.

따라서 Union Type은 허용되는 값의 범위를 넓히는 방향으로 작용하고, Intersection Type은 여러 타입의 조건을 동시에 요구하는 방향으로 작용합니다.

다만 실제 TypeScript의 타입 시스템은 구조적 타입 검사와 타입 호환성 규칙을 기반으로 동작하므로, 집합 모델은 개념을 이해하기 위한 추상화로 사용하는 것이 적절합니다.

## 8. Intersection Type의 프로퍼티 충돌

Intersection Type을 사용할 때 동일한 이름의 프로퍼티가 서로 다른 타입으로 정의되어 있다면 주의해야 합니다.

### 8.1. 호환되지 않는 프로퍼티 타입

```typescript
type A = {
  value: string;
};

type B = {
  value: number;
};

type Combined = A & B;
```

`Combined`의 `value`는 다음과 같은 타입을 요구합니다.

```typescript
type Combined = {
  value: string & number;
};
```

`string`과 `number`를 동시에 만족하는 일반적인 값은 존재하지 않으므로 `value`는 사실상 `never` 타입이 됩니다.

```typescript
const value: Combined = {
  // Type Error
  value: "Hello",
};
```

이는 Intersection Type이 동일한 프로퍼티의 타입을 자동으로 덮어쓰거나 병합하지 않는다는 것을 의미합니다.

### 8.2. 호환되는 프로퍼티 타입

동일한 프로퍼티가 호환되는 타입을 가지는 경우에는 해당 타입의 교집합으로 처리됩니다.

```typescript
type A = {
  id: number;
};

type B = {
  id: number;
  name: string;
};

type Combined = A & B;
```

결과적으로 다음과 같은 구조가 됩니다.

```typescript
type Combined = {
  id: number;
  name: string;
};
```

### 8.3. 기존 프로퍼티 타입을 변경해야 하는 경우

Intersection Type은 기존 프로퍼티의 타입을 덮어쓰는 용도로 적합하지 않습니다.

기존 타입의 특정 프로퍼티를 다른 타입으로 변경하려면 `Omit` 등의 Utility Type을 활용하는 것이 일반적입니다.

```typescript
type User = {
  id: number;
  name: string;
  role: string;
};

type Admin = Omit<User, "role"> & {
  role: "admin" | "super-admin";
};
```

위 타입은 기존 `User`의 `role` 프로퍼티를 제거한 다음 새로운 Literal Union Type으로 대체합니다.

`Omit`은 이후 Utility Types 문서에서 별도로 다룹니다.

## 9. Interface 확장과 Intersection Type

TypeScript에서는 기존 객체 타입을 확장하는 방법으로 Interface 상속과 Intersection Type을 모두 사용할 수 있습니다.

### 9.1. Interface Extends

`interface`는 `extends` 키워드를 사용하여 다른 인터페이스의 프로퍼티를 상속할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
}

interface Admin extends User {
  permissions: string[];
}
```

`Admin`은 `User`의 프로퍼티를 포함하면서 `permissions`를 추가합니다.

### 9.2. Intersection Type

동일한 구조를 Intersection Type으로도 표현할 수 있습니다.

```typescript
type User = {
  id: number;
  name: string;
};

type Admin = User & {
  permissions: string[];
};
```

두 방식 모두 기존 객체 타입을 기반으로 새로운 타입을 구성할 수 있습니다.

### 9.3. 주요 차이점

| 구분 | Interface Extends | Intersection Type |
|---|---|---|
| 선언 방식 | `extends` | `&` |
| 대상 | 주로 Interface | 다양한 타입 |
| 타입 결합 | 인터페이스 확장 | 여러 타입의 교차 |
| 프로퍼티 충돌 | 호환되지 않는 재선언은 오류 | 교차 결과가 `never`가 될 수 있음 |
| 활용 | 객체 계약 및 상속 구조 | 여러 타입의 조합 |

객체의 명확한 계약과 확장 관계를 표현할 때는 Interface를 활용할 수 있으며, 기존 타입들을 조합하여 새로운 타입을 구성할 때는 Intersection Type을 활용할 수 있습니다.

두 기능은 사용 목적과 타입 충돌 처리 방식에 차이가 있으므로 상황에 맞게 선택해야 합니다.

## 10. React에서의 활용

React와 TypeScript를 함께 사용하는 환경에서는 Union Type과 Intersection Type을 컴포넌트 Props, 상태 관리 및 이벤트 데이터 구조를 정의하는 데 활용할 수 있습니다.

### 10.1. Union Type을 이용한 Props 정의

컴포넌트가 여러 종류의 입력값을 허용하는 경우 Union Type을 활용할 수 있습니다.

```tsx
type ButtonProps = {
  label: string;
  size: "small" | "medium" | "large";
};

function Button({ label, size }: ButtonProps) {
  return (
    <button className={`button-${size}`}>
      {label}
    </button>
  );
}
```

`size`는 세 가지 문자열 리터럴 중 하나만 허용합니다.

이를 통해 잘못된 컴포넌트 설정값이 전달되는 상황을 방지할 수 있습니다.

### 10.2. Discriminated Union을 이용한 Props 설계

컴포넌트의 동작 방식에 따라 서로 다른 Props를 요구하는 경우 Discriminated Union을 사용할 수 있습니다.

```tsx
type ButtonProps =
  | {
      variant: "link";
      href: string;
    }
  | {
      variant: "action";
      onClick: () => void;
    };

function Button(props: ButtonProps) {
  if (props.variant === "link") {
    return <a href={props.href}>Link</a>;
  }

  return (
    <button onClick={props.onClick}>
      Action
    </button>
  );
}
```

`variant`에 따라 사용할 수 있는 Props가 달라집니다.

- `variant: "link"`인 경우 `href`를 사용합니다.
- `variant: "action"`인 경우 `onClick`을 사용합니다.

각 분기에서 TypeScript가 타입을 자동으로 좁혀주므로 불필요한 타입 단언 없이 안전하게 구현할 수 있습니다.

### 10.3. Intersection Type을 이용한 Props 확장

기존 Props에 공통 프로퍼티를 추가하거나 HTML 속성을 결합할 때 Intersection Type을 활용할 수 있습니다.

```tsx
import type { ComponentProps } from "react";

type ButtonProps = {
  variant: "primary" | "secondary";
};

type NativeButtonProps = ButtonProps &
  ComponentProps<"button">;

function Button({
  variant,
  children,
  ...props
}: NativeButtonProps) {
  return (
    <button
      className={`button-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

`ComponentProps<"button">`은 기본 HTML button 요소가 지원하는 Props 타입을 가져옵니다.

여기에 `ButtonProps`를 결합하여 커스텀 Props와 기본 HTML 속성을 함께 사용할 수 있습니다.

### 10.4. Union Type을 이용한 비동기 상태 관리

비동기 작업의 상태를 관리할 때 Discriminated Union을 활용하면 상태별 데이터 구조를 명확하게 정의할 수 있습니다.

```tsx
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

상태별로 필요한 프로퍼티만 정의하므로 잘못된 데이터 조합을 방지할 수 있습니다.

```tsx
function UserView({ state }: { state: AsyncState<string> }) {
  switch (state.status) {
    case "idle":
      return <p>Waiting...</p>;

    case "loading":
      return <p>Loading...</p>;

    case "success":
      return <p>{state.data}</p>;

    case "error":
      return <p>{state.error.message}</p>;
  }
}
```

각 상태에 맞는 데이터만 접근할 수 있으며, 새로운 상태가 추가되는 경우 Exhaustive Check를 통해 처리 누락을 발견할 수 있습니다.

## 11. 정리

Union Type과 Intersection Type은 기존 타입을 조합하여 새로운 타입을 정의하는 핵심 기능입니다.

주요 내용을 정리하면 다음과 같습니다.

- Union Type(`|`)은 여러 타입 중 하나에 해당하는 값을 표현합니다.
- Intersection Type(`&`)은 여러 타입의 조건을 동시에 만족하는 값을 표현합니다.
- Union Type에서는 모든 구성 타입이 공통으로 가지는 프로퍼티에 안전하게 접근할 수 있습니다.
- Literal Union Type은 허용되는 값을 특정 리터럴 집합으로 제한합니다.
- Discriminated Union은 공통 구분자 프로퍼티를 기반으로 타입을 구분합니다.
- Exhaustive Check는 `never` 타입을 활용하여 모든 Union 구성 타입이 처리되었는지 검사합니다.
- Intersection Type은 여러 객체 타입의 프로퍼티를 결합하는 데 유용합니다.
- Intersection Type에서 동일한 프로퍼티의 타입이 충돌하면 해당 프로퍼티가 `never`가 될 수 있습니다.
- 기존 프로퍼티의 타입을 교체해야 하는 경우 `Omit` 등의 Utility Type을 활용할 수 있습니다.
- Interface의 `extends`와 Intersection Type은 모두 타입 확장에 활용되지만 동작 방식과 충돌 처리 방식에 차이가 있습니다.
- React에서는 컴포넌트 Props, 비동기 상태 및 HTML 속성 결합 등에 활용할 수 있습니다.

Union Type은 값이 가질 수 있는 여러 가능성을 표현하고, Intersection Type은 여러 타입의 요구사항을 하나의 타입으로 결합합니다.

두 기능의 차이를 이해하면 복잡한 데이터 구조와 컴포넌트 인터페이스를 보다 명확하고 안전하게 설계할 수 있습니다.

## 참고 자료

- [TypeScript Handbook - Everyday Types: Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScript Handbook - Object Types: Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)
- [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook - Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [TypeScript Handbook - Exhaustiveness Checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [React Documentation - Using TypeScript](https://react.dev/learn/typescript)
- [TypeScript Playground](https://www.typescriptlang.org/play/)