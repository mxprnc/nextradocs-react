# Utility Types

## 1. Utility Types란?

Utility Types는 기존 타입을 기반으로 새로운 타입을 생성하거나 변환할 수 있도록 TypeScript에서 기본 제공하는 타입입니다.

애플리케이션을 개발하다 보면 기존 객체 타입에서 일부 프로퍼티만 선택하거나, 특정 프로퍼티를 선택 사항으로 변경하거나, 함수의 매개변수와 반환 타입을 추출해야 하는 상황이 발생합니다.

이러한 작업을 매번 새로운 인터페이스나 타입 별칭으로 정의하면 중복이 발생하고 타입 변경에 따른 유지보수 비용이 증가할 수 있습니다.

TypeScript는 이러한 일반적인 타입 변환을 지원하기 위해 다양한 Utility Types를 제공합니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// 일부 프로퍼티만 선택
type UserPreview = Pick<User, "id" | "name">;

// 특정 프로퍼티 제외
type UserWithoutEmail = Omit<User, "email">;

// 모든 프로퍼티를 선택 사항으로 변경
type UserUpdate = Partial<User>;
```

Utility Types는 대부분 제네릭을 기반으로 동작합니다. 기존 타입을 타입 인자로 전달하면 해당 타입의 구조를 분석하여 새로운 타입을 생성합니다.

주요 Utility Types는 다음과 같이 분류할 수 있습니다.

| 분류 | 주요 Utility Types | 목적 |
|---|---|---|
| 프로퍼티 변환 | `Partial`, `Required`, `Readonly` | 프로퍼티의 속성 변경 |
| 객체 타입 구성 | `Record`, `Pick`, `Omit` | 객체 타입의 구조 변경 |
| Union Type 변환 | `Exclude`, `Extract`, `NonNullable` | Union 구성 요소 필터링 |
| 함수 타입 추출 | `Parameters`, `ReturnType`, `ThisParameterType`, `OmitThisParameter` | 함수 타입 정보 추출 및 변환 |
| 생성자 타입 추출 | `ConstructorParameters`, `InstanceType` | 생성자와 인스턴스 타입 추출 |
| 비동기 타입 처리 | `Awaited` | Promise 결과 타입 추출 |
| 타입 추론 제어 | `NoInfer` | 특정 타입 인자의 추론 방지 |
| 문맥적 타입 지정 | `ThisType` | 객체 메서드의 `this` 타입 지정 |
| 문자열 타입 변환 | `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` | 문자열 리터럴 타입 변환 |

## 2. 프로퍼티 변환 Utility Types

객체 타입의 프로퍼티에 적용되는 선택성(Optional), 필수성(Required), 읽기 전용(Readonly) 속성을 변경하는 Utility Types입니다.

### 2.1. `Partial<T>`

`Partial<T>`는 타입 `T`의 모든 프로퍼티를 선택 사항(Optional)으로 변경합니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
```

변환된 타입은 다음과 같은 구조를 가집니다.

```typescript
type PartialUser = {
  id?: number;
  name?: string;
  email?: string;
};
```

일부 프로퍼티만 전달해도 타입 검사를 통과하므로 부분 수정이나 선택적인 설정값을 전달할 때 유용합니다.

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function updateTodo(
  todo: Todo,
  fieldsToUpdate: Partial<Todo>,
): Todo {
  return {
    ...todo,
    ...fieldsToUpdate,
  };
}

const todo: Todo = {
  id: 1,
  title: "Learn TypeScript",
  completed: false,
};

const updatedTodo = updateTodo(todo, {
  completed: true,
});
```

`updateTodo()`는 기존 `Todo` 객체의 모든 프로퍼티를 유지하면서 전달된 프로퍼티만 변경할 수 있습니다.

다만 `Partial<T>`는 모든 프로퍼티를 선택 사항으로 변경하므로, 필수 프로퍼티가 필요한 상황에서는 별도의 검증 로직이 필요합니다.

### 2.2. `Required<T>`

`Required<T>`는 타입 `T`의 모든 프로퍼티를 필수(Required)로 변경합니다.

```typescript
interface User {
  id: number;
  name?: string;
  email?: string;
}

type RequiredUser = Required<User>;
```

변환된 타입은 다음과 같습니다.

```typescript
type RequiredUser = {
  id: number;
  name: string;
  email: string;
};
```

선택적으로 정의된 설정값을 실제 처리 단계에서 모두 갖추도록 요구할 때 활용할 수 있습니다.

```typescript
interface AppConfig {
  host?: string;
  port?: number;
  timeout?: number;
}

type CompleteConfig = Required<AppConfig>;

const config: CompleteConfig = {
  host: "localhost",
  port: 3000,
  timeout: 5000,
};
```

`Required<T>`는 선택적 프로퍼티를 필수로 변경하지만, 프로퍼티 타입에 명시적으로 포함된 `null`까지 제거하지는 않습니다.

```typescript
interface User {
  name?: string | null;
}

type RequiredUser = Required<User>;

// {
//   name: string | null;
// }
```

프로퍼티의 선택성과 `null` 허용 여부는 서로 다른 개념입니다.

### 2.3. `Readonly<T>`

`Readonly<T>`는 타입 `T`의 모든 프로퍼티를 읽기 전용(Readonly)으로 변경합니다.

```typescript
interface User {
  id: number;
  name: string;
}

type ReadonlyUser = Readonly<User>;
```

변환된 타입은 다음과 같습니다.

```typescript
type ReadonlyUser = {
  readonly id: number;
  readonly name: string;
};
```

읽기 전용으로 지정된 프로퍼티는 생성 이후 재할당할 수 없습니다.

```typescript
const user: Readonly<User> = {
  id: 1,
  name: "Kim",
};

// Type Error
user.name = "Lee";
```

상태 변경을 허용하지 않는 데이터나 외부에서 전달받은 객체의 변경을 방지하는 타입을 정의할 때 활용할 수 있습니다.

다만 `Readonly<T>`는 TypeScript의 정적 타입 검사 기능입니다. 런타임 객체 자체를 불변 객체로 만들지는 않습니다.

또한 기본 `Readonly<T>`는 얕은 변환(Shallow Transformation)입니다.

```typescript
interface User {
  id: number;
  profile: {
    name: string;
  };
}

const user: Readonly<User> = {
  id: 1,
  profile: {
    name: "Kim",
  },
};

// Type Error
user.id = 2;

// 중첩 객체의 프로퍼티는 별도로 readonly 처리되지 않음
user.profile.name = "Lee";
```

중첩 객체까지 읽기 전용으로 제한하려면 별도의 재귀적 타입 정의가 필요합니다.

## 3. 객체 타입 구성 Utility Types

객체 타입에서 필요한 프로퍼티를 선택하거나 제외하고, 특정 키 집합을 기준으로 새로운 객체 타입을 구성하는 Utility Types입니다.

### 3.1. `Record<K, T>`

`Record<K, T>`는 키 타입 `K`와 값 타입 `T`를 기반으로 객체 타입을 생성합니다.

```typescript
type UserRole = "admin" | "user" | "guest";

type RoleDescription = Record<UserRole, string>;
```

생성된 타입은 다음과 같습니다.

```typescript
type RoleDescription = {
  admin: string;
  user: string;
  guest: string;
};
```

사용 예제는 다음과 같습니다.

```typescript
const roleDescriptions: Record<UserRole, string> = {
  admin: "Administrator",
  user: "Regular user",
  guest: "Guest user",
};
```

`Record`는 특정 키 집합에 대응하는 값을 빠짐없이 정의해야 하는 객체를 표현할 때 유용합니다.

특히 문자열 리터럴 Union Type과 함께 사용하면 정해진 키를 모두 구현하도록 타입 검사를 수행할 수 있습니다.

```typescript
type Page = "home" | "about" | "contact";

interface PageInfo {
  title: string;
  path: string;
}

const pages: Record<Page, PageInfo> = {
  home: {
    title: "Home",
    path: "/",
  },
  about: {
    title: "About",
    path: "/about",
  },
  contact: {
    title: "Contact",
    path: "/contact",
  },
};
```

`Record`는 키와 값의 타입을 지정하는 객체 매핑 타입으로 활용할 수 있습니다.

### 3.2. `Pick<T, K>`

`Pick<T, K>`는 타입 `T`에서 키 집합 `K`에 해당하는 프로퍼티만 선택하여 새로운 타입을 생성합니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserPreview = Pick<User, "id" | "name">;
```

변환된 타입은 다음과 같습니다.

```typescript
type UserPreview = {
  id: number;
  name: string;
};
```

기존 객체 타입의 일부 프로퍼티만 사용하는 데이터 구조를 정의할 때 활용할 수 있습니다.

```typescript
function getUserPreview(user: User): UserPreview {
  return {
    id: user.id,
    name: user.name,
  };
}
```

API 응답이나 컴포넌트 Props에서 전체 객체가 아닌 일부 데이터만 필요한 경우에도 유용합니다.

### 3.3. `Omit<T, K>`

`Omit<T, K>`는 타입 `T`에서 키 집합 `K`에 해당하는 프로퍼티를 제외하여 새로운 타입을 생성합니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, "password">;
```

변환된 타입은 다음과 같습니다.

```typescript
type PublicUser = {
  id: number;
  name: string;
  email: string;
};
```

외부에 공개하면 안 되는 프로퍼티를 제외하거나 기존 타입을 기반으로 새로운 데이터 구조를 정의할 때 활용할 수 있습니다.

```typescript
function getPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user;

  return publicUser;
}
```

`Omit<T, K>`는 타입 수준에서 프로퍼티를 제외할 뿐, 런타임 객체에서 실제 프로퍼티를 제거하지는 않습니다.

실제 데이터를 제외하려면 위 예제와 같이 객체를 변환하는 로직이 필요합니다.

### 3.4. `Pick`과 `Omit` 비교

두 Utility Type은 기존 객체 타입을 기반으로 새로운 타입을 구성하지만, 접근 방식이 반대입니다.

| 구분 | `Pick<T, K>` | `Omit<T, K>` |
|---|---|---|
| 동작 | 지정한 키만 선택 | 지정한 키를 제외 |
| 기준 | 필요한 프로퍼티 | 제외할 프로퍼티 |
| 활용 | 데이터 일부 추출 | 데이터 일부 제거 |

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// id와 name만 선택
type UserPreview = Pick<User, "id" | "name">;

// password 제외
type PublicUser = Omit<User, "password">;
```

필요한 프로퍼티가 명확하다면 `Pick`을, 제외할 프로퍼티가 명확하다면 `Omit`을 사용하는 것이 일반적입니다.

## 4. Union Type 변환 Utility Types

Union Type의 구성 요소를 기준으로 특정 타입을 제외하거나 선택하는 Utility Types입니다.

### 4.1. `Exclude<T, U>`

`Exclude<T, U>`는 타입 `T`의 Union 구성 요소 중 타입 `U`에 할당할 수 있는 구성 요소를 제외합니다.

```typescript
type Status = "pending" | "success" | "error";

type CompletedStatus = Exclude<Status, "pending">;
```

변환 결과는 다음과 같습니다.

```typescript
type CompletedStatus = "success" | "error";
```

여러 타입을 제외할 수도 있습니다.

```typescript
type Status = "pending" | "success" | "error";

type FinalStatus = Exclude<Status, "pending" | "error">;

// "success"
```

문자열 리터럴 Union뿐 아니라 객체 Union에도 적용할 수 있습니다.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; width: number }
  | { kind: "triangle"; width: number; height: number };

type NonCircleShape = Exclude<
  Shape,
  { kind: "circle" }
>;
```

결과는 다음과 같습니다.

```typescript
type NonCircleShape =
  | { kind: "square"; width: number }
  | { kind: "triangle"; width: number; height: number };
```

특정 상태나 데이터 유형을 제외한 새로운 Union Type을 정의할 때 활용할 수 있습니다.

### 4.2. `Extract<T, U>`

`Extract<T, U>`는 타입 `T`의 Union 구성 요소 중 타입 `U`에 할당할 수 있는 구성 요소만 선택합니다.

```typescript
type Status = "pending" | "success" | "error";

type SuccessStatus = Extract<Status, "success" | "completed">;
```

변환 결과는 다음과 같습니다.

```typescript
type SuccessStatus = "success";
```

객체 Union에서도 특정 구조를 가진 구성 요소를 추출할 수 있습니다.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; width: number }
  | { kind: "triangle"; width: number; height: number };

type Circle = Extract<
  Shape,
  { kind: "circle" }
>;
```

결과는 다음과 같습니다.

```typescript
type Circle = {
  kind: "circle";
  radius: number;
};
```

`Extract`는 Discriminated Union에서 특정 상태에 해당하는 타입만 분리할 때 유용합니다.

### 4.3. `Exclude`와 `Extract` 비교

두 Utility Type은 Union Type의 구성 요소를 조건에 따라 필터링한다는 공통점이 있습니다.

| 구분 | `Exclude<T, U>` | `Extract<T, U>` |
|---|---|---|
| 동작 | 조건에 해당하는 타입 제외 | 조건에 해당하는 타입 선택 |
| 결과 | 조건에 해당하지 않는 구성 요소 | 조건에 해당하는 구성 요소 |
| 주요 활용 | 특정 상태 제거 | 특정 상태 추출 |

```typescript
type Status = "pending" | "success" | "error";

type Remaining = Exclude<Status, "pending">;
// "success" | "error"

type Selected = Extract<Status, "pending" | "success">;
// "pending" | "success"
```

### 4.4. `NonNullable<T>`

`NonNullable<T>`는 타입 `T`에서 `null`과 `undefined`를 제외한 타입을 생성합니다.

```typescript
type User = string | null | undefined;

type ValidUser = NonNullable<User>;
```

변환 결과는 다음과 같습니다.

```typescript
type ValidUser = string;
```

객체 타입에서도 사용할 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
}

type NullableUser = User | null | undefined;

type ValidUser = NonNullable<NullableUser>;
```

`ValidUser`는 `User` 타입으로 결정됩니다.

함수의 반환값이나 API 응답에서 Nullish Type을 제거한 타입을 별도로 정의할 때 유용합니다.

```typescript
function findUser(id: number): User | null {
  if (id === 1) {
    return {
      id: 1,
      name: "Kim",
    };
  }

  return null;
}

type FoundUser = NonNullable<ReturnType<typeof findUser>>;
```

`FoundUser`는 `User` 타입입니다.

다만 `NonNullable<T>`는 타입 선언을 변환할 뿐 런타임 값의 `null` 또는 `undefined`를 자동으로 제거하지 않습니다. 실제 값에 대한 검증은 별도로 수행해야 합니다.

## 5. 함수 타입 추출 Utility Types

함수 타입으로부터 매개변수, 반환값 및 `this` 타입을 추출하거나 변환하는 Utility Types입니다.

### 5.1. `Parameters<T>`

`Parameters<T>`는 함수 타입 `T`의 매개변수 타입을 튜플(Tuple) 형태로 추출합니다.

```typescript
type Handler = (
  id: number,
  name: string,
  active: boolean,
) => void;

type HandlerParams = Parameters<Handler>;
```

추출 결과는 다음과 같습니다.

```typescript
type HandlerParams = [
  id: number,
  name: string,
  active: boolean,
];
```

실제 함수 선언으로부터 타입을 추출할 수도 있습니다.

```typescript
function createUser(
  id: number,
  name: string,
  active: boolean,
) {
  return {
    id,
    name,
    active,
  };
}

type CreateUserParams = Parameters<typeof createUser>;
```

이 경우 `CreateUserParams`는 함수의 매개변수 타입을 순서대로 포함하는 튜플 타입입니다.

추출한 매개변수 타입을 다른 함수에서 재사용할 수도 있습니다.

```typescript
function executeCreateUser(
  ...args: CreateUserParams
) {
  return createUser(...args);
}
```

`Parameters<T>`는 기존 함수의 시그니처를 재사용하거나 래퍼 함수를 구현할 때 유용합니다.

### 5.2. `ReturnType<T>`

`ReturnType<T>`는 함수 타입 `T`의 반환 타입을 추출합니다.

```typescript
function getUser() {
  return {
    id: 1,
    name: "Kim",
  };
}

type User = ReturnType<typeof getUser>;
```

추출 결과는 다음과 같습니다.

```typescript
type User = {
  id: number;
  name: string;
};
```

함수의 반환 타입을 별도로 중복 선언하지 않고 기존 구현으로부터 추출할 수 있습니다.

비동기 함수에서도 사용할 수 있습니다.

```typescript
async function fetchUser() {
  return {
    id: 1,
    name: "Kim",
  };
}

type FetchUserResult = ReturnType<typeof fetchUser>;
```

이 경우 `FetchUserResult`는 다음과 같은 타입입니다.

```typescript
type FetchUserResult = Promise<{
  id: number;
  name: string;
}>;
```

Promise 내부의 결과 타입을 추출하려면 `Awaited<T>`를 함께 사용할 수 있습니다.

```typescript
type User = Awaited<ReturnType<typeof fetchUser>>;
```

### 5.3. `ConstructorParameters<T>`

`ConstructorParameters<T>`는 생성자 함수 타입에서 생성자 매개변수 타입을 튜플 형태로 추출합니다.

```typescript
class User {
  constructor(
    public id: number,
    public name: string,
  ) {}
}

type UserConstructorParams = ConstructorParameters<typeof User>;
```

추출 결과는 다음과 같습니다.

```typescript
type UserConstructorParams = [
  id: number,
  name: string,
];
```

추출한 타입은 생성자 호출에 필요한 인자 구조를 재사용할 때 활용할 수 있습니다.

```typescript
function createUser(
  ...args: ConstructorParameters<typeof User>
): User {
  return new User(...args);
}

const user = createUser(1, "Kim");
```

`ConstructorParameters<T>`는 일반 함수가 아닌 생성자 시그니처를 대상으로 합니다.

### 5.4. `InstanceType<T>`

`InstanceType<T>`는 생성자 함수 타입으로부터 생성되는 인스턴스의 타입을 추출합니다.

```typescript
class User {
  id = 1;
  name = "Kim";
}

type UserInstance = InstanceType<typeof User>;
```

추출 결과는 `User` 클래스의 인스턴스 타입입니다.

```typescript
const user: UserInstance = new User();
```

생성자 타입과 인스턴스 타입을 분리해서 사용해야 하는 경우 유용합니다.

```typescript
class Repository {
  findAll() {
    return [];
  }
}

type RepositoryConstructor = typeof Repository;
type RepositoryInstance = InstanceType<RepositoryConstructor>;
```

여기서 두 타입은 서로 다릅니다.

- `typeof Repository`: 클래스 생성자 자체의 타입
- `InstanceType<typeof Repository>`: 해당 클래스로 생성되는 인스턴스 타입

### 5.5. `ThisParameterType<T>`

`ThisParameterType<T>`는 함수 타입에 명시적으로 선언된 `this` 매개변수의 타입을 추출합니다.

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

type ThisType = ThisParameterType<typeof toHex>;
```

추출 결과는 `Number` 타입입니다.

일반적인 함수 매개변수와 달리 TypeScript의 `this` 매개변수는 함수 내부에서 사용할 `this`의 타입을 지정하기 위한 타입 선언입니다.

```typescript
function format(this: Date): string {
  return this.toISOString();
}

type FormatThis = ThisParameterType<typeof format>;
// Date
```

명시적인 `this` 매개변수가 없는 함수라면 결과는 `unknown`입니다.

### 5.6. `OmitThisParameter<T>`

`OmitThisParameter<T>`는 함수 타입에서 명시적인 `this` 매개변수를 제거한 새로운 함수 타입을 생성합니다.

```typescript
function toHex(this: Number) {
  return this.toString(16);
}

type BoundFunction = OmitThisParameter<typeof toHex>;
```

변환된 함수 타입에서는 `this` 매개변수가 제거됩니다.

```typescript
const numberToHex: BoundFunction = toHex.bind(255);

numberToHex();
```

`bind()`와 같이 함수의 `this`를 미리 지정하는 작업에서 활용할 수 있습니다.

`OmitThisParameter<T>`는 명시적인 `this` 매개변수가 없는 함수 타입에는 원래 타입을 그대로 반환합니다.

또한 제네릭 정보가 제거되며 오버로드가 있는 경우 마지막 오버로드 시그니처만 유지되는 등 제약이 있습니다.

## 6. 비동기 타입 Utility Type

### 6.1. `Awaited<T>`

`Awaited<T>`는 Promise와 유사한 타입(Promise-like Type)을 재귀적으로 분석하여 `await` 이후의 결과 타입을 추출합니다.

일반적인 `Promise<T>`는 비동기 작업이 완료되었을 때 `T` 타입의 값을 반환합니다.

```typescript
type Result = Awaited<Promise<string>>;

// string
```

중첩된 Promise도 처리할 수 있습니다.

```typescript
type Result = Awaited<Promise<Promise<number>>>;

// number
```

Union Type에도 적용할 수 있습니다.

```typescript
type Result = Awaited<boolean | Promise<number>>;

// boolean | number
```

실제 비동기 함수의 반환 타입을 추출하는 경우에도 유용합니다.

```typescript
async function fetchUser() {
  return {
    id: 1,
    name: "Kim",
  };
}

type FetchResult = ReturnType<typeof fetchUser>;

type User = Awaited<FetchResult>;
```

각 타입은 다음과 같이 결정됩니다.

```typescript
type FetchResult = Promise<{
  id: number;
  name: string;
}>;

type User = {
  id: number;
  name: string;
};
```

여러 비동기 함수의 결과 타입을 공통으로 처리해야 하는 경우 다음과 같이 사용할 수 있습니다.

```typescript
async function fetchUsers() {
  return [
    { id: 1, name: "Kim" },
    { id: 2, name: "Lee" },
  ];
}

type Users = Awaited<ReturnType<typeof fetchUsers>>;
type User = Users[number];
```

`Awaited<T>`는 비동기 함수의 반환 타입과 실제 결과 데이터 타입을 구분할 때 유용합니다.

## 7. 타입 추론 제어 Utility Type

### 7.1. `NoInfer<T>`

`NoInfer<T>`는 타입 추론 과정에서 특정 위치의 타입이 추론 후보로 사용되지 않도록 제한하는 Utility Type입니다.

TypeScript는 함수의 여러 인자를 분석하여 제네릭 타입 매개변수를 추론합니다.

이때 특정 인자를 기준으로 타입을 추론하고 다른 인자는 추론된 타입을 검증하는 용도로만 사용하고 싶을 수 있습니다.

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: C,
) {
  return {
    colors,
    defaultColor,
  };
}

createStreetLight(
  ["red", "yellow", "green"],
  "blue",
);
```

위 코드에서는 두 번째 인자도 타입 추론에 참여할 수 있으므로 `C`가 예상보다 넓은 타입으로 추론될 수 있습니다.

`NoInfer<T>`를 사용하면 첫 번째 인자에서 추론된 타입을 기준으로 두 번째 인자의 타입을 검사하도록 지정할 수 있습니다.

```typescript
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  return {
    colors,
    defaultColor,
  };
}

createStreetLight(
  ["red", "yellow", "green"],
  "red",
);

// Type Error
createStreetLight(
  ["red", "yellow", "green"],
  "blue",
);
```

첫 번째 인자에서 `C`는 `"red" | "yellow" | "green"`으로 추론됩니다.

두 번째 인자는 `NoInfer<C>`를 통해 추론에 참여하지 않고 이미 결정된 타입에 할당 가능한지 검사합니다.

`NoInfer<T>`는 TypeScript 5.4에서 추가되었습니다.

타입 추론의 기준이 되는 인자와 해당 타입을 검증해야 하는 인자를 명확히 구분할 때 활용할 수 있습니다.

## 8. 문맥적 타입 지정 Utility Type

### 8.1. `ThisType<T>`

`ThisType<T>`는 객체 리터럴 내부 메서드의 `this` 타입을 지정하기 위한 마커 인터페이스(Marker Interface)입니다.

일반적으로 객체 메서드의 `this` 타입은 객체의 구조나 문맥에 따라 결정됩니다.

`ThisType<T>`를 사용하면 특정 객체의 메서드 내부에서 사용할 `this` 타입을 명시적으로 지정할 수 있습니다.

```typescript
interface ObjectDescriptor<D, M> {
  data?: D;
  methods?: M & ThisType<D & M>;
}

function makeObject<D, M>(
  descriptor: ObjectDescriptor<D, M>,
): D & M {
  const data: object = descriptor.data ?? {};
  const methods: object = descriptor.methods ?? {};

  return {
    ...data,
    ...methods,
  } as D & M;
}
```

사용 예제는 다음과 같습니다.

```typescript
const obj = makeObject({
  data: {
    x: 10,
    y: 20,
  },

  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx;
      this.y += dy;
    },
  },
});

obj.moveBy(5, 10);
```

`moveBy()` 내부의 `this`는 `data`와 `methods`의 타입을 결합한 구조로 추론됩니다.

따라서 `this.x`, `this.y`에 안전하게 접근할 수 있습니다.

`ThisType<T>`는 실제 객체 타입을 변환하는 일반적인 Utility Type과 달리 문맥적 타입(Contextual Typing)을 지정하기 위한 마커 역할을 합니다.

이 기능을 사용하려면 `noImplicitThis` 등의 타입 검사 설정도 함께 고려해야 합니다.

## 9. 문자열 리터럴 타입 변환 Utility Types

TypeScript는 문자열 리터럴 타입을 변환하기 위한 네 가지 내장 Utility Types를 제공합니다.

이 타입들은 문자열 값 자체를 변경하는 것이 아니라 문자열 리터럴 타입을 변환합니다.

### 9.1. `Uppercase<T>`

`Uppercase<T>`는 문자열 리터럴 타입을 대문자로 변환합니다.

```typescript
type Method = "get" | "post" | "put";

type UpperMethod = Uppercase<Method>;
```

결과는 다음과 같습니다.

```typescript
type UpperMethod = "GET" | "POST" | "PUT";
```

### 9.2. `Lowercase<T>`

`Lowercase<T>`는 문자열 리터럴 타입을 소문자로 변환합니다.

```typescript
type Status = "SUCCESS" | "ERROR";

type LowerStatus = Lowercase<Status>;

// "success" | "error"
```

### 9.3. `Capitalize<T>`

`Capitalize<T>`는 문자열 리터럴 타입의 첫 글자를 대문자로 변환합니다.

```typescript
type Event = "click" | "change" | "submit";

type CapitalizedEvent = Capitalize<Event>;

// "Click" | "Change" | "Submit"
```

### 9.4. `Uncapitalize<T>`

`Uncapitalize<T>`는 문자열 리터럴 타입의 첫 글자를 소문자로 변환합니다.

```typescript
type Event = "Click" | "Change" | "Submit";

type UncapitalizedEvent = Uncapitalize<Event>;

// "click" | "change" | "submit"
```

### 9.5. 문자열 변환 Utility Types 활용

문자열 변환 Utility Types는 Template Literal Types와 함께 사용하면 다양한 문자열 기반 타입을 생성할 수 있습니다.

```typescript
type EventName = "click" | "change" | "submit";

type HandlerName = `on${Capitalize<EventName>}`;
```

결과는 다음과 같습니다.

```typescript
type HandlerName =
  | "onClick"
  | "onChange"
  | "onSubmit";
```

React 이벤트 핸들러 이름과 유사한 문자열 타입을 생성하거나 명명 규칙을 기반으로 타입을 구성할 때 활용할 수 있습니다.

## 10. Utility Types를 활용한 실무 패턴

Utility Types는 개별적으로 사용하는 것뿐 아니라 여러 타입 변환을 조합하여 실무에서 필요한 데이터 구조를 설계할 때도 유용합니다.

### 10.1. API 요청 타입과 응답 타입 분리

서버에서 사용하는 전체 객체 타입과 클라이언트가 생성 요청에 사용하는 타입은 서로 다를 수 있습니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
```

사용자 생성 요청에서는 서버가 생성하는 `id`와 `createdAt`을 제외하고, 응답에서는 민감한 `password`를 제외할 수 있습니다.

```typescript
type CreateUserRequest = Omit<
  User,
  "id" | "createdAt"
>;

type UserResponse = Omit<
  User,
  "password"
>;
```

수정 요청에서는 모든 프로퍼티를 선택 사항으로 변경할 수 있습니다.

```typescript
type UpdateUserRequest = Partial<
  Pick<User, "name" | "email" | "password">
>;
```

이렇게 정의하면 하나의 기본 타입을 기반으로 여러 API 데이터 구조를 일관되게 관리할 수 있습니다.

### 10.2. React Props 재사용

React 컴포넌트에서 기존 Props 타입의 일부를 선택하거나 특정 프로퍼티를 제외할 때 Utility Types를 활용할 수 있습니다.

```tsx
import type { ComponentProps } from "react";

interface ButtonProps {
  label: string;
  variant: "primary" | "secondary";
  disabled?: boolean;
  onClick: () => void;
}

type IconButtonProps = Omit<ButtonProps, "label"> & {
  icon: React.ReactNode;
};
```

`IconButtonProps`는 기존 `ButtonProps`를 기반으로 `label`을 제외하고 `icon`을 추가한 타입입니다.

또한 React에서 제공하는 `ComponentProps<T>`를 이용하면 기존 컴포넌트나 HTML 요소의 Props 타입을 추출할 수 있습니다.

```tsx
type NativeButtonProps = ComponentProps<"button">;

type CustomButtonProps = Omit<
  NativeButtonProps,
  "onClick"
> & {
  onClick: (value: string) => void;
};
```

이러한 방식은 기존 HTML 요소의 Props를 재사용하면서 애플리케이션에 필요한 속성만 변경할 때 유용합니다.

### 10.3. 비동기 함수의 결과 타입 재사용

비동기 함수의 반환 타입을 기반으로 다른 타입을 정의하면 중복된 타입 선언을 줄일 수 있습니다.

```typescript
async function fetchProducts() {
  return [
    {
      id: 1,
      name: "Keyboard",
      price: 50000,
    },
  ];
}

type FetchProductsResult = Awaited<
  ReturnType<typeof fetchProducts>
>;

type Product = FetchProductsResult[number];
```

이 구조에서는 함수 구현이 변경되면 추출되는 타입도 함께 변경됩니다.

따라서 별도의 인터페이스를 중복 정의하지 않고 실제 구현과 타입을 연결할 수 있습니다.

### 10.4. 함수 래퍼의 타입 재사용

기존 함수의 매개변수와 반환 타입을 추출하여 래퍼 함수를 구현할 수 있습니다.

```typescript
function createUser(id: number, name: string) {
  return {
    id,
    name,
  };
}

function logExecution(
  fn: (...args: Parameters<typeof createUser>) =>
    ReturnType<typeof createUser>,
  ...args: Parameters<typeof createUser>
) {
  console.log("Executing function");

  return fn(...args);
}

const user = logExecution(createUser, 1, "Kim");
```

`Parameters<T>`와 `ReturnType<T>`를 조합하면 기존 함수의 시그니처를 기반으로 다른 함수를 설계할 수 있습니다.

다만 여러 종류의 함수에 범용적으로 적용하는 래퍼를 구현할 때는 제네릭과 함수 타입 제약 조건을 함께 사용하는 방식이 더 적절할 수 있습니다.

## 11. Utility Types 사용 시 주의사항

### 11.1. Utility Types는 런타임 객체를 변경하지 않음

Utility Types는 컴파일 시점의 타입 변환을 수행합니다.

```typescript
interface User {
  id: number;
  name: string;
  password: string;
}

type PublicUser = Omit<User, "password">;
```

`PublicUser`에서 `password`가 제외되더라도 기존 JavaScript 객체의 `password` 프로퍼티가 자동으로 삭제되는 것은 아닙니다.

실제 데이터에서 프로퍼티를 제거하려면 별도의 객체 변환이 필요합니다.

```typescript
function toPublicUser(user: User): PublicUser {
  const { password, ...publicUser } = user;

  return publicUser;
}
```

타입 수준의 변환과 런타임 데이터 변환은 구분해야 합니다.

### 11.2. Utility Types는 기본적으로 얕은 변환을 수행함

`Partial<T>`, `Readonly<T>` 등의 기본 Utility Types는 최상위 프로퍼티에 적용됩니다.

```typescript
interface User {
  id: number;
  profile: {
    name: string;
    age: number;
  };
}

type PartialUser = Partial<User>;
```

변환 결과는 다음과 같습니다.

```typescript
type PartialUser = {
  id?: number;
  profile?: {
    name: string;
    age: number;
  };
};
```

`profile` 자체는 선택 사항이 되었지만 내부의 `name`과 `age`는 필수 상태로 유지됩니다.

중첩된 모든 프로퍼티까지 변환하려면 재귀적 제네릭 타입을 별도로 정의해야 합니다.

### 11.3. `Partial<T>`와 `T | undefined` 구분

선택적 프로퍼티와 `undefined`를 포함하는 프로퍼티 타입은 서로 다른 의미를 가집니다.

```typescript
interface User {
  name?: string;
  email: string | undefined;
}
```

- `name?`: 프로퍼티 자체가 존재하지 않을 수 있습니다.
- `email: string | undefined`: 프로퍼티는 필수이지만 값으로 `undefined`를 허용합니다.

`Partial<T>`는 프로퍼티의 선택성을 변경하는 기능이므로 이 차이를 고려해야 합니다.

### 11.4. `Readonly<T>`가 런타임 불변성을 보장하지 않음

`Readonly<T>`는 TypeScript의 타입 검사 단계에서 프로퍼티 재할당을 제한합니다.

JavaScript 런타임에서 객체를 변경할 수 없도록 만들려면 `Object.freeze()`와 같은 별도 기능이 필요합니다.

```typescript
const user = Object.freeze({
  id: 1,
  name: "Kim",
});
```

다만 `Object.freeze()`도 기본적으로 얕은 동결(Shallow Freeze)을 수행하므로 중첩 객체까지 완전히 불변으로 만들지는 않습니다.

### 11.5. `any` 사용 시 타입 안정성 저하

일부 Utility Types는 함수 타입이나 생성자 타입을 기반으로 동작합니다.

이때 `any`를 사용하면 추출 결과 역시 `any`가 될 수 있습니다.

```typescript
type Result = ReturnType<any>;

// any
```

타입 정보가 불분명한 상황에서는 `any`를 무분별하게 사용하기보다 `unknown`과 타입 검증을 활용하는 것이 좋습니다.

## 12. 정리

TypeScript의 Utility Types는 기존 타입을 재사용하면서 필요한 형태로 변환할 수 있도록 지원하는 기본 기능입니다.

주요 Utility Types와 역할은 다음과 같습니다.

| Utility Type | 주요 역할 |
|---|---|
| `Partial<T>` | 모든 프로퍼티를 선택 사항으로 변경 |
| `Required<T>` | 모든 프로퍼티를 필수로 변경 |
| `Readonly<T>` | 모든 프로퍼티를 읽기 전용으로 변경 |
| `Record<K, T>` | 키와 값 타입을 기반으로 객체 타입 생성 |
| `Pick<T, K>` | 지정한 프로퍼티만 선택 |
| `Omit<T, K>` | 지정한 프로퍼티 제외 |
| `Exclude<T, U>` | Union에서 특정 타입 제외 |
| `Extract<T, U>` | Union에서 특정 타입 추출 |
| `NonNullable<T>` | `null`, `undefined` 제외 |
| `Parameters<T>` | 함수 매개변수 타입 추출 |
| `ReturnType<T>` | 함수 반환 타입 추출 |
| `ConstructorParameters<T>` | 생성자 매개변수 타입 추출 |
| `InstanceType<T>` | 생성자에서 인스턴스 타입 추출 |
| `ThisParameterType<T>` | 함수의 `this` 타입 추출 |
| `OmitThisParameter<T>` | 함수의 `this` 매개변수 제거 |
| `Awaited<T>` | Promise 결과 타입 추출 |
| `NoInfer<T>` | 특정 위치의 타입 추론 방지 |
| `ThisType<T>` | 객체 메서드의 문맥적 `this` 타입 지정 |
| `Uppercase<T>` | 문자열 리터럴 타입을 대문자로 변환 |
| `Lowercase<T>` | 문자열 리터럴 타입을 소문자로 변환 |
| `Capitalize<T>` | 문자열 리터럴 타입의 첫 글자를 대문자로 변환 |
| `Uncapitalize<T>` | 문자열 리터럴 타입의 첫 글자를 소문자로 변환 |

Utility Types는 제네릭, Union Type, 타입 추론 및 타입 연산자를 기반으로 동작합니다.

기존 타입을 그대로 복제하여 새로운 타입을 선언하는 대신, 필요한 타입 변환을 조합하면 중복을 줄이고 타입 정의의 일관성을 유지할 수 있습니다.

특히 API 요청 및 응답 모델, React 컴포넌트 Props, 비동기 함수의 반환 타입, 공통 데이터 구조를 설계할 때 Utility Types를 적극적으로 활용할 수 있습니다.

## 참고 자료

- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - TypeScript에서 기본 제공하는 Utility Types의 전체 목록과 사용 방법을 설명하는 공식 문서입니다.
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - Utility Types의 기반이 되는 제네릭 타입 매개변수와 제약 조건을 설명합니다.
- [TypeScript Handbook - Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
  - 객체 타입의 프로퍼티 키를 추출하는 `keyof` 연산자를 설명합니다.
- [TypeScript Handbook - Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
  - `T[K]` 형태의 인덱스 접근 타입을 설명하며, `Pick`이나 `Record` 등의 타입 변환 원리를 이해하는 데 도움이 됩니다.
- [TypeScript Handbook - Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
  - 조건부 타입과 `infer`를 설명하며, `Exclude`, `Extract`, `ReturnType` 등의 동작 원리를 이해하는 데 참고할 수 있습니다.
- [TypeScript Handbook - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
  - 기존 객체 타입의 프로퍼티를 순회하고 변환하는 매핑 타입을 설명합니다. `Partial`, `Required`, `Readonly` 등의 구현 원리를 이해하는 데 도움이 됩니다.
- [React Documentation - Using TypeScript](https://react.dev/learn/typescript)
  - React 컴포넌트와 Props에 TypeScript를 적용하는 방법을 설명합니다.