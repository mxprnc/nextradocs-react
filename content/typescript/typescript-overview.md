# TypeScript Overview

## 1. TypeScript란?

TypeScript는 JavaScript를 기반으로 정적 타입 시스템(Static Type System)을 추가한 프로그래밍 언어입니다. JavaScript의 문법과 런타임 동작을 유지하면서 타입 검사(Type Checking), 타입 추론(Type Inference), 코드 자동 완성(Code Completion) 등의 기능을 제공하여 대규모 애플리케이션을 보다 안정적으로 개발하고 유지보수할 수 있도록 지원합니다.

TypeScript는 JavaScript의 상위 집합(Superset)입니다. 따라서 유효한 JavaScript 코드는 대부분 별도의 수정 없이 TypeScript 코드로 사용할 수 있으며, TypeScript는 여기에 타입 선언과 타입 검사 기능을 추가합니다.

```typescript
// JavaScript
function add(a, b) {
  return a + b;
}

// TypeScript
function add(a: number, b: number): number {
  return a + b;
}
```

JavaScript에서는 매개변수의 타입이 명시적으로 제한되지 않으므로 다양한 형태의 인수가 전달될 수 있습니다. 반면 TypeScript에서는 매개변수와 반환값의 타입을 명시하여 의도하지 않은 값의 전달을 사전에 검사할 수 있습니다.

TypeScript의 핵심 목적은 JavaScript 코드를 실행하기 전에 타입 오류를 발견하고, 개발 과정에서 코드의 구조와 의도를 명확하게 표현하도록 지원하는 것입니다.

## 2. JavaScript와 TypeScript의 관계

TypeScript는 JavaScript의 실행 환경과 런타임 동작을 기반으로 동작합니다.

JavaScript는 브라우저, Node.js 등의 JavaScript 런타임에서 실행됩니다. TypeScript는 JavaScript 런타임이 직접 실행할 수 있는 언어가 아니므로, 일반적으로 컴파일 또는 변환 과정을 거쳐 JavaScript 코드로 변환됩니다.

```text
TypeScript Source Code
        |
        v
 Type Checking
        |
        v
 TypeScript Compiler
        |
        v
 JavaScript Output
        |
        v
 JavaScript Runtime
        |
        v
 Program Execution
```

TypeScript는 JavaScript의 런타임을 대체하지 않습니다. JavaScript가 제공하는 객체, 함수, 클래스, 비동기 처리 및 런타임 API를 그대로 활용하면서 정적 타입 검사 기능을 추가하는 구조입니다.

다음은 JavaScript와 TypeScript의 주요 차이점입니다.

| 구분 | JavaScript | TypeScript |
|---|---|---|
| 타입 시스템 | 동적 타입(Dynamic Typing) | 정적 타입 검사(Static Type Checking) |
| 타입 선언 | 별도의 타입 선언 불필요 | 타입 선언 지원 |
| 타입 추론 | 런타임 값에 따라 동작 | 정적 분석을 통한 타입 추론 |
| 오류 발견 | 주로 런타임 | 컴파일 전 정적 검사 및 런타임 |
| 실행 환경 | JavaScript 런타임 | JavaScript로 변환 후 실행 |
| 컴파일 | 일반적으로 별도 컴파일 불필요 | 일반적으로 변환 과정 필요 |
| 코드 자동 완성 | 런타임 및 편집기 분석에 의존 | 타입 정보를 활용한 향상된 지원 |

TypeScript는 JavaScript를 대체하는 별도의 런타임 언어가 아니라 JavaScript 개발 경험을 확장하는 정적 타입 검사 도구라는 점이 중요합니다.

## 3. 정적 타입 시스템(Static Type System)

정적 타입 시스템은 프로그램이 실행되기 전에 변수, 함수, 객체 등의 타입 정보를 분석하여 타입 오류를 검사하는 체계입니다.

TypeScript는 타입 정보를 기반으로 값이 사용되는 위치와 연산이 타입 규칙에 부합하는지 확인합니다.

```typescript
let username: string = "typescript";

username = "react";

// Type Error
username = 123;
```

위 코드에서 `username`은 `string` 타입으로 선언되었습니다. 따라서 문자열은 할당할 수 있지만 숫자는 할당할 수 없습니다.

이러한 검사는 프로그램 실행 이전에 수행되므로 잘못된 타입의 값이 전달되는 문제를 개발 단계에서 발견할 수 있습니다.

### 3.1. 컴파일 타임과 런타임

TypeScript를 이해하려면 컴파일 타임(Compile Time)과 런타임(Runtime)의 차이를 구분해야 합니다.

- 컴파일 타임: 소스 코드의 타입 검사 및 JavaScript 변환이 수행되는 시점입니다.
- 런타임: 변환된 JavaScript 코드가 실제 실행되는 시점입니다.

TypeScript의 타입 시스템은 주로 컴파일 타임에 동작합니다.

```typescript
function multiply(a: number, b: number): number {
  return a * b;
}

multiply(10, 20);

// Type Error
multiply(10, "20");
```

두 번째 함수 호출은 인수의 타입이 매개변수의 타입과 일치하지 않으므로 정적 타입 검사에서 오류가 발생합니다.

다만 TypeScript의 기본 컴파일 설정에서는 타입 오류가 존재하더라도 JavaScript 출력이 생성될 수 있습니다. `noEmitOnError` 등의 컴파일러 옵션을 통해 오류 발생 시 출력 생성을 제한할 수 있습니다.

따라서 타입 오류가 발생했다는 사실만으로 JavaScript 코드가 생성되지 않는다고 이해해서는 안 됩니다.

### 3.2. 정적 타입 검사의 한계

TypeScript의 타입 검사는 런타임의 모든 오류를 방지하지 않습니다.

TypeScript의 타입 정보는 일반적으로 JavaScript로 변환되는 과정에서 제거되므로, 실제 실행 중 전달되는 값의 구조나 유효성을 자동으로 검증하지 않습니다.

```typescript
interface User {
  id: number;
  name: string;
}

const user = JSON.parse(
  '{"id": "100", "name": "Alice"}'
) as User;

console.log(user.id.toFixed());
```

위 코드에서 `JSON.parse()`의 반환값은 `any` 타입이므로 `User` 타입으로 단언할 수 있습니다.

그러나 실제 JSON 데이터의 `id`는 문자열입니다. 타입 단언은 컴파일러에 타입 정보를 전달할 뿐 실제 데이터를 검증하거나 변환하지 않으므로 런타임에서 예상하지 못한 동작이 발생할 수 있습니다.

외부 API 응답, 사용자 입력, 파일 데이터 등 신뢰할 수 없는 입력값은 런타임 검증(Runtime Validation)을 별도로 수행해야 합니다.

## 4. 타입 추론(Type Inference)

TypeScript는 모든 변수와 함수에 타입을 명시하지 않아도 코드의 문맥과 초기값을 분석하여 적절한 타입을 추론합니다.

```typescript
let count = 10;

count = 20;

// Type Error
count = "30";
```

`count`에 별도의 타입을 선언하지 않았지만, 초기값인 `10`을 기반으로 `number` 타입이 추론됩니다.

함수의 반환 타입도 함수 내부의 반환 표현식을 분석하여 추론할 수 있습니다.

```typescript
function getUsername() {
  return "Alice";
}

// Inferred return type: string
const username = getUsername();
```

타입 추론을 활용하면 불필요한 타입 선언을 줄이면서도 정적 타입 검사의 이점을 유지할 수 있습니다.

다만 함수의 공개 API, 복잡한 데이터 구조, 컴포넌트의 Props 등 타입 의도가 명확하게 드러나야 하는 영역에서는 명시적인 타입 선언이 유용합니다.

## 5. 타입 시스템의 주요 특징

TypeScript는 JavaScript의 동적 특성을 모델링하면서도 다양한 타입 표현 기능을 제공합니다.

### 5.1. 구조적 타입 시스템(Structural Type System)

TypeScript는 타입의 명칭보다는 객체가 실제로 가지고 있는 프로퍼티와 그 타입을 기준으로 호환성을 판단합니다.

```typescript
interface User {
  id: number;
  name: string;
}

const user = {
  id: 1,
  name: "Alice",
};

const member: User = user;
```

`user`와 `User`는 서로 다른 이름을 가지고 있지만, 필요한 프로퍼티와 타입 구조가 일치하므로 할당할 수 있습니다.

이러한 방식을 구조적 타입 시스템이라고 합니다.

### 5.2. 점진적 타입 적용(Gradual Typing)

TypeScript는 기존 JavaScript 프로젝트에 점진적으로 타입을 도입할 수 있도록 설계되었습니다.

파일 확장자를 `.js`에서 `.ts`로 변경하고 필요한 부분부터 타입을 선언하는 방식으로 마이그레이션할 수 있습니다.

또한 `allowJs`, `checkJs` 등의 컴파일러 옵션을 활용하면 JavaScript 파일과 TypeScript 파일을 하나의 프로젝트에서 함께 관리할 수 있습니다.

`any` 타입을 사용하면 특정 영역에서 타입 검사를 우회할 수도 있지만, 지나치게 사용하면 정적 타입 시스템의 이점을 잃을 수 있습니다.

따라서 가능한 경우 `unknown`과 타입 좁히기(Type Narrowing)를 활용하여 타입 안정성을 유지하는 것이 좋습니다.

### 5.3. 타입 소거(Type Erasure)

TypeScript의 타입 정보는 일반적으로 JavaScript로 변환되는 과정에서 제거됩니다.

```typescript
interface User {
  id: number;
  name: string;
}

function getUser(id: number): User {
  return {
    id,
    name: "Alice",
  };
}
```

위 코드는 다음과 같은 JavaScript 코드로 변환됩니다.

```javascript
function getUser(id) {
  return {
    id,
    name: "Alice",
  };
}
```

`interface`, 매개변수 타입, 반환 타입 등의 정보는 JavaScript 실행에 필요하지 않으므로 결과물에 포함되지 않습니다.

따라서 TypeScript의 타입 선언만으로 런타임 객체의 유효성을 검증하거나 타입 정보를 조회할 수는 없습니다.

참고로 `enum`과 같이 JavaScript 출력 코드를 생성하는 일부 TypeScript 기능도 존재하므로 모든 TypeScript 문법이 단순히 타입 정보만 제거되는 것은 아닙니다.

## 6. TypeScript 컴파일 과정

TypeScript 컴파일러는 소스 코드를 분석하고 타입 검사를 수행한 다음 설정에 따라 JavaScript 코드를 생성합니다.

일반적인 `tsc` 컴파일 과정은 다음과 같이 이해할 수 있습니다.

1. 소스 코드 분석: TypeScript 파일과 프로젝트 설정을 읽습니다.
2. 구문 분석: 소스 코드의 문법 구조를 분석합니다.
3. 타입 검사: 변수, 함수, 객체 등의 타입 관계와 호환성을 검사합니다.
4. 코드 변환: TypeScript 문법을 JavaScript 문법으로 변환합니다.
5. 출력 생성: 설정된 출력 디렉터리에 JavaScript 파일을 생성합니다.

```text
        TypeScript Source
                |
                v
          Parsing
                |
                v
         Type Checking
                |
                v
        Transformation
                |
                v
        JavaScript Output
                |
                v
         JavaScript Runtime
```

TypeScript 컴파일러는 `tsc` 명령어를 통해 사용할 수 있습니다.

```bash
# TypeScript 설치
npm install -D typescript

# tsconfig.json 생성
npx tsc --init

# TypeScript 컴파일
npx tsc

# 타입 검사만 수행하고 출력 파일 생성 생략
npx tsc --noEmit
```

다만 실제 프론트엔드 프로젝트에서는 컴파일러의 역할이 빌드 도구에 따라 달라질 수 있습니다.

예를 들어 Vite, Babel, SWC 등의 도구가 TypeScript 문법을 JavaScript로 변환할 수 있지만, 이러한 변환 과정이 반드시 TypeScript의 정적 타입 검사를 수행하는 것은 아닙니다.

따라서 빌드 과정에서 코드 변환과 타입 검사가 분리되어 있는지 확인해야 합니다.

## 7. TypeScript를 사용하는 이유

TypeScript는 애플리케이션의 규모가 커지고 코드 간 의존성이 복잡해질수록 개발 및 유지보수 과정에서 유용한 이점을 제공합니다.

### 7.1. 오류의 조기 발견

정적 타입 검사를 통해 잘못된 함수 인수, 존재하지 않는 프로퍼티 접근, 호환되지 않는 타입 할당 등을 실행 전에 발견할 수 있습니다.

### 7.2. 코드 가독성과 명확성 향상

타입 선언은 데이터의 구조와 함수의 입출력 형태를 명확하게 표현합니다.

코드를 처음 접하는 개발자도 타입 정보를 통해 각 함수와 객체가 어떤 데이터를 사용하는지 파악할 수 있습니다.

### 7.3. 개발 도구 지원 향상

TypeScript는 타입 정보를 기반으로 다음과 같은 개발 도구 기능을 지원합니다.

- 코드 자동 완성(Autocomplete)
- 타입 정보 표시(Type Information)
- 정의로 이동(Go to Definition)
- 참조 검색(Find References)
- 안전한 리팩터링(Refactoring)

### 7.4. 유지보수성 향상

공통 데이터 구조나 함수의 인터페이스가 변경되었을 때 해당 변경 사항과 호환되지 않는 코드 영역을 타입 검사로 확인할 수 있습니다.

이를 통해 대규모 코드베이스에서 변경의 영향을 파악하고 리팩터링 과정의 안정성을 높일 수 있습니다.

### 7.5. 협업 효율성 향상

타입 선언은 코드 자체를 문서화하는 역할도 수행합니다.

별도의 문서를 확인하지 않더라도 함수의 매개변수, 반환값, 객체 구조 등을 파악할 수 있으므로 개발자 간 인터페이스 계약(Interface Contract)을 명확하게 유지할 수 있습니다.

## 8. React와 TypeScript

React 프로젝트에서 TypeScript는 컴포넌트의 데이터 구조와 상태, 이벤트, Hook 등의 타입을 명확하게 정의하는 데 활용됩니다.

특히 컴포넌트 간 데이터 전달과 상태 변경이 빈번한 React 애플리케이션에서는 타입 정보가 코드의 안정성과 유지보수성에 중요한 역할을 합니다.

### 8.1. 컴포넌트 Props 타입 정의

컴포넌트가 전달받는 Props의 구조를 타입으로 정의할 수 있습니다.

```tsx
interface UserProps {
  name: string;
  age: number;
}

function User({ name, age }: UserProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age}</p>
    </div>
  );
}

export default User;
```

`User` 컴포넌트는 `name`과 `age`를 필수 Props로 전달받습니다. 타입 정의를 통해 잘못된 데이터가 전달되는 상황을 사전에 검사할 수 있습니다.

### 8.2. State 타입 정의

Hook을 사용할 때도 상태값의 타입을 명시하거나 초기값을 기반으로 추론하도록 할 수 있습니다.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

`useState<number>`는 상태값과 상태 변경 함수에 대한 타입 정보를 제공합니다.

### 8.3. 이벤트 타입 정의

React 이벤트 핸들러에서도 이벤트 객체의 타입을 지정할 수 있습니다.

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

이벤트 타입을 지정하면 이벤트 객체의 프로퍼티와 관련 메서드를 타입 검사 및 자동 완성 기능과 함께 사용할 수 있습니다.

React와 TypeScript를 결합하는 구체적인 방법은 `react-typescript/` 디렉터리에서 별도로 다룹니다.

## 9. 정리

TypeScript는 JavaScript의 실행 모델을 유지하면서 정적 타입 검사 기능을 추가한 언어입니다.

주요 특징은 다음과 같습니다.

- JavaScript의 상위 집합으로 기존 JavaScript 문법과 런타임 동작을 기반으로 합니다.
- 컴파일 타임에 정적 타입 검사를 수행하여 다양한 타입 오류를 조기에 발견합니다.
- 타입 추론을 통해 명시적인 타입 선언 없이도 타입 정보를 활용할 수 있습니다.
- 구조적 타입 시스템을 기반으로 객체의 형태와 타입 호환성을 판단합니다.
- 타입 정보는 일반적으로 JavaScript 변환 과정에서 제거됩니다.
- 런타임 데이터 검증은 별도의 로직을 통해 수행해야 합니다.
- React와 결합하면 컴포넌트, Props, State, 이벤트 등의 타입 안정성을 확보할 수 있습니다.

TypeScript를 효과적으로 사용하려면 타입 선언 문법뿐 아니라 JavaScript의 런타임 동작과 TypeScript의 정적 타입 검사 원리를 함께 이해해야 합니다.

## 참고 자료

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [TypeScript Playground](https://www.typescriptlang.org/play/)
- [TypeScript TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [React - Using TypeScript](https://react.dev/learn/typescript)