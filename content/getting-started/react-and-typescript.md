# React and TypeScript

## 1. React와 TypeScript의 결합

React는 JavaScript 기반의 UI 라이브러리이며, TypeScript는 JavaScript에 정적 타입 시스템을 추가한 프로그래밍 언어입니다.

React는 TypeScript를 필수적으로 요구하지 않지만, TypeScript를 함께 사용하면 컴포넌트의 데이터 구조와 함수의 입력 및 반환 타입을 명시적으로 정의할 수 있습니다.

React와 TypeScript를 결합하면 다음과 같은 이점을 얻을 수 있습니다.

- **Type Safety**: 컴파일 단계에서 잘못된 타입의 데이터 전달이나 함수 호출을 확인할 수 있습니다.
- **Improved Developer Experience**: IDE의 자동 완성, 타입 추론 및 정적 분석 기능을 활용할 수 있습니다.
- **Maintainability**: 컴포넌트의 Props와 데이터 구조를 명확하게 정의하여 코드의 유지보수성을 높일 수 있습니다.
- **Refactoring Safety**: 타입 정의를 기반으로 코드 변경 시 영향을 받는 영역을 확인할 수 있습니다.
- **Self-Documenting Code**: 타입 선언을 통해 컴포넌트가 요구하는 데이터 구조와 사용 방법을 명확하게 표현할 수 있습니다.

React와 TypeScript를 함께 사용하는 환경에서는 React의 컴포넌트 및 Hooks API와 TypeScript의 타입 시스템을 결합하여 애플리케이션을 개발합니다.

## 2. TypeScript와 React의 관계

React와 TypeScript는 서로 다른 역할을 담당합니다.

| 기술 | 주요 역할 |
|---|---|
| React | 컴포넌트 구성, 상태 관리, UI 렌더링 |
| TypeScript | 정적 타입 검사, 타입 추론, 타입 안정성 |
| React Type Definitions | React API 및 JSX에 대한 TypeScript 타입 정의 |
| TypeScript Compiler | TypeScript 코드의 타입 검사 및 JavaScript 변환 |

TypeScript는 React의 런타임 동작을 변경하지 않습니다.

TypeScript의 타입 정보는 일반적으로 JavaScript로 변환되는 과정에서 제거되며, 실제 애플리케이션 실행은 JavaScript와 React 런타임을 기반으로 이루어집니다.

따라서 TypeScript는 React의 렌더링이나 상태 관리 기능을 대체하는 기술이 아니라, 개발 단계에서 코드의 정확성을 검증하고 개발 경험을 개선하는 기술입니다.

### 2.1. React Type Definitions

React의 타입 정의는 `@types/react` 패키지를 통해 제공됩니다.

웹 환경에서는 `@types/react-dom` 패키지도 함께 사용합니다.

```bash
npm install --save-dev @types/react @types/react-dom
```

각 패키지의 역할은 다음과 같습니다.

| 패키지 | 역할 |
|---|---|
| `@types/react` | React 컴포넌트, Hooks, 이벤트, JSX 등의 타입 정의 |
| `@types/react-dom` | React DOM 관련 API의 타입 정의 |

TypeScript는 이러한 타입 정의를 활용하여 React API에 대한 정적 타입 검사를 수행합니다.

## 3. TypeScript Project Configuration

React 프로젝트에서 TypeScript를 사용하려면 TypeScript 컴파일러 설정과 JSX 처리 설정이 필요합니다.

일반적으로 프로젝트 루트에 `tsconfig.json` 파일을 배치하여 TypeScript 컴파일러 옵션을 관리합니다.

### 3.1. tsconfig.json

다음은 React + TypeScript 프로젝트에서 사용할 수 있는 설정 예제입니다.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

주요 옵션은 다음과 같습니다.

| 옵션 | 설명 |
|---|---|
| `target` | TypeScript가 생성할 JavaScript의 ECMAScript 버전을 지정합니다. |
| `lib` | 타입 검사에 사용할 JavaScript 및 브라우저 API의 타입 정의를 지정합니다. |
| `module` | 모듈 시스템을 지정합니다. |
| `moduleResolution` | 모듈을 탐색하고 해석하는 방식을 지정합니다. |
| `jsx` | JSX를 처리하는 방식을 지정합니다. |
| `strict` | 엄격한 타입 검사 옵션을 활성화합니다. |
| `noEmit` | TypeScript 컴파일러가 JavaScript 출력 파일을 생성하지 않도록 설정합니다. |
| `skipLibCheck` | 선언 파일에 대한 타입 검사를 생략합니다. |
| `esModuleInterop` | CommonJS와 ES Module 간의 상호 운용성을 개선합니다. |
| `forceConsistentCasingInFileNames` | 파일 이름의 대소문자를 일관되게 사용하도록 검사합니다. |

`noEmit`을 활성화하면 TypeScript 컴파일러는 JavaScript 파일을 생성하지 않고 타입 검사만 수행합니다. 실제 코드 변환과 번들링은 Vite, Next.js 등의 빌드 도구가 담당할 수 있습니다.

### 3.2. JSX Compiler Option

TypeScript에서 JSX를 사용하려면 `jsx` 컴파일러 옵션을 설정해야 합니다.

대표적인 설정은 다음과 같습니다.

| 설정 | 설명 |
|---|---|
| `preserve` | JSX를 변환하지 않고 유지합니다. |
| `react` | JSX를 `React.createElement` 호출 형태로 변환합니다. |
| `react-jsx` | 새로운 JSX Transform을 사용합니다. |
| `react-jsxdev` | 개발 환경을 위한 JSX Transform을 사용합니다. |
| `react-native` | React Native 환경에서 사용하는 JSX 처리 방식입니다. |

일반적인 React + TypeScript 애플리케이션에서는 `react-jsx`를 사용할 수 있습니다.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

`react-jsx`는 React 17에서 도입된 새로운 JSX Transform을 기반으로 하며, JSX를 사용할 때마다 `React`를 명시적으로 import할 필요가 없습니다.

다만 `jsx` 옵션은 JSX의 변환 방식을 결정하는 설정이며, JSX에 대한 타입 검사 자체를 비활성화하거나 활성화하는 옵션은 아닙니다.

## 4. TypeScript File Extensions

React + TypeScript 프로젝트에서는 파일의 역할에 따라 확장자를 구분합니다.

| 확장자 | 용도 |
|---|---|
| `.ts` | JSX를 포함하지 않는 TypeScript 코드 |
| `.tsx` | JSX를 포함하는 TypeScript 코드 |

### 4.1. TS 파일

`.ts` 파일은 일반적인 TypeScript 코드를 작성할 때 사용합니다.

```ts
export type User = {
  id: number;
  name: string;
  email: string;
};

export function getUserDisplayName(user: User): string {
  return user.name;
}
```

타입 정의, API 요청 함수, 데이터 변환 함수, 유틸리티 함수 등 JSX를 포함하지 않는 코드를 작성할 때 적합합니다.

### 4.2. TSX 파일

`.tsx` 파일은 JSX를 포함하는 TypeScript 코드를 작성할 때 사용합니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>;
}

export default Greeting;
```

TypeScript는 `.tsx` 확장자를 통해 해당 파일에 JSX 문법이 포함될 수 있음을 인식합니다.

JSX를 포함하는 파일은 `.tsx` 확장자를 사용해야 합니다.

## 5. Typing React Components

React 컴포넌트는 일반적으로 Props를 입력받아 JSX를 반환하는 함수로 정의합니다.

TypeScript에서는 Props의 데이터 구조를 타입으로 선언하여 컴포넌트가 전달받을 수 있는 데이터의 형태를 제한할 수 있습니다.

### 5.1. Props Type Definition

컴포넌트의 Props는 `type` 또는 `interface`를 사용하여 정의할 수 있습니다.

```tsx
type UserProfileProps = {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
};

function UserProfile({
  id,
  name,
  email,
  isActive,
}: UserProfileProps) {
  return (
    <section>
      <h2>{name}</h2>
      <p>ID: {id}</p>
      <p>Email: {email}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </section>
  );
}
```

Props 타입을 별도로 정의하면 다음과 같은 이점을 얻을 수 있습니다.

- 컴포넌트가 요구하는 데이터 구조를 명확하게 표현할 수 있습니다.
- 필수 및 선택적 Props를 구분할 수 있습니다.
- 잘못된 타입의 데이터가 전달되는 것을 방지할 수 있습니다.
- IDE에서 Props의 자동 완성 및 타입 검사를 활용할 수 있습니다.

### 5.2. type and interface

TypeScript에서는 `type`과 `interface` 모두 객체 형태의 Props를 정의하는 데 사용할 수 있습니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
};
```

```tsx
interface ButtonProps {
  label: string;
  disabled?: boolean;
}
```

두 방식 모두 React 컴포넌트의 Props 타입을 정의할 수 있습니다.

다만 두 문법은 타입 확장과 선언 병합 등에서 차이가 있습니다.

| 구분 | type | interface |
|---|---|---|
| 객체 타입 정의 | 지원 | 지원 |
| Union Type | 지원 | 직접 지원하지 않음 |
| Intersection Type | 지원 | `extends` 등을 통해 유사한 확장 가능 |
| 선언 병합 | 지원하지 않음 | 지원 |
| 타입 별칭 | 지원 | 지원하지 않음 |

일반적인 컴포넌트 Props에서는 두 방식 모두 적합합니다.

프로젝트 내에서는 일관된 규칙을 정하여 사용하는 것이 좋습니다.

### 5.3. Optional Props

Props의 속성 이름 뒤에 `?`를 지정하면 해당 속성을 선택적으로 전달할 수 있습니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

function Button({
  label,
  disabled = false,
  variant = 'primary',
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

`disabled`와 `variant`는 전달하지 않아도 되며, 전달하지 않은 경우 구조 분해 할당의 기본값이 적용됩니다.

### 5.4. Children Props

React 컴포넌트는 다른 컴포넌트나 JSX 요소를 자식으로 전달받을 수 있습니다.

이러한 자식 요소는 `children` Props를 통해 접근합니다.

```tsx
import type { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
};

function Card({ title, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

사용 예제는 다음과 같습니다.

```tsx
function App() {
  return (
    <Card title="User Information">
      <p>Name: Alice</p>
      <p>Email: alice@example.com</p>
    </Card>
  );
}
```

`ReactNode`는 React에서 렌더링할 수 있는 다양한 종류의 값을 표현하는 타입입니다.

반면 `ReactElement`는 React 요소 객체를 표현하는 타입으로, 두 타입은 허용하는 값의 범위가 다릅니다.

```tsx
import type { ReactElement, ReactNode } from 'react';

type ContainerProps = {
  content: ReactNode;
  element: ReactElement;
};
```

일반적으로 다양한 종류의 자식 콘텐츠를 허용하는 컴포넌트에서는 `ReactNode`를 사용합니다.

## 6. Type Inference in React

TypeScript는 변수의 초기값이나 함수의 반환값 등을 기반으로 타입을 자동으로 추론합니다.

React와 TypeScript를 함께 사용하는 환경에서도 이러한 타입 추론 기능을 적극적으로 활용할 수 있습니다.

### 6.1. useState Type Inference

`useState`는 초기값을 기반으로 상태의 타입을 추론합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

초기값이 숫자이므로 `count`는 `number` 타입으로 추론됩니다.

따라서 다음과 같은 코드는 타입 오류가 발생합니다.

```tsx
setCount('10');
```

상태의 초기값을 명확하게 제공할 수 없는 경우에는 타입 인자를 명시하는 것이 좋습니다.

```tsx
type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);
```

위 예제에서는 상태가 `User` 객체 또는 `null`이 될 수 있도록 정의했습니다.

### 6.2. Event Type Inference

JSX의 이벤트 핸들러에서는 TypeScript가 이벤트 타입을 자동으로 추론할 수 있습니다.

```tsx
function SearchInput() {
  return (
    <input
      onChange={(event) => {
        console.log(event.currentTarget.value);
      }}
    />
  );
}
```

`input` 요소의 `onChange` 이벤트에 전달되는 이벤트 객체의 타입을 TypeScript가 추론합니다.

따라서 이벤트 핸들러를 JSX 내부에서 직접 작성하는 경우에는 별도의 타입 선언이 필요하지 않은 경우가 많습니다.

### 6.3. Return Type Inference

함수 컴포넌트의 반환 타입 역시 반환하는 JSX를 기반으로 추론됩니다.

```tsx
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}
```

일반적인 함수 컴포넌트에서는 반환 타입을 명시적으로 선언하지 않아도 충분합니다.

반환 타입을 명시해야 하는 특별한 요구사항이 있는 경우에는 `React.JSX.Element` 등을 사용할 수 있습니다.

```tsx
function Greeting({ name }: GreetingProps): React.JSX.Element {
  return <h1>Hello, {name}</h1>;
}
```

다만 모든 함수 컴포넌트의 반환 타입이 반드시 `React.JSX.Element`인 것은 아닙니다. 컴포넌트의 반환 조건에 따라 `null` 등을 포함할 수 있으므로 실제 반환 범위에 적합한 타입을 사용해야 합니다.

## 7. React Hooks with TypeScript

React Hooks는 함수 컴포넌트에서 상태 관리, Effect 처리, Context 접근 등의 기능을 사용할 수 있도록 지원합니다.

React의 기본 Hooks는 `@types/react`에서 타입이 제공되므로 대부분의 경우 타입을 직접 선언하지 않아도 됩니다.

### 7.1. useState

`useState`는 컴포넌트의 상태를 관리하는 Hook입니다.

```tsx
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

function RequestStatus() {
  const [status, setStatus] = useState<Status>('idle');

  return (
    <div>
      <p>{status}</p>
      <button onClick={() => setStatus('loading')}>
        Start
      </button>
    </div>
  );
}
```

Union Type을 사용하면 상태가 가질 수 있는 값을 제한할 수 있습니다.

### 7.2. useRef

`useRef`는 렌더링 간에 유지되는 참조 객체를 생성합니다.

DOM 요소를 참조할 때는 대상 요소의 타입을 지정할 수 있습니다.

```tsx
import { useRef } from 'react';

function SearchForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();
  }

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleFocus}>
        Focus
      </button>
    </div>
  );
}
```

초기값으로 `null`을 전달하므로 참조 객체의 `current`는 `HTMLInputElement` 또는 `null`이 될 수 있습니다.

### 7.3. useReducer

`useReducer`는 상태와 상태 변경 로직을 Reducer 함수로 분리하여 관리하는 Hook입니다.

```tsx
import { useReducer } from 'react';

type State = {
  count: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

const initialState: State = {
  count: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };

    case 'decrement':
      return { count: state.count - 1 };

    case 'reset':
      return initialState;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: 'decrement' })}>
        Decrement
      </button>
      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>
    </div>
  );
}
```

`Action`을 Discriminated Union으로 정의하면 허용된 액션의 종류와 각 액션의 데이터 구조를 명확하게 제한할 수 있습니다.

### 7.4. Custom Hooks

Custom Hook은 React Hooks를 조합하여 재사용 가능한 로직을 정의하는 함수입니다.

TypeScript를 사용하면 Custom Hook의 매개변수와 반환값을 명확하게 정의할 수 있습니다.

```tsx
import { useState } from 'react';

function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue((previousValue) => !previousValue);
  }

  return {
    value,
    toggle,
  };
}
```

초기값이 Boolean이므로 상태의 타입도 자동으로 `boolean`으로 추론됩니다.

Custom Hook의 반환 타입을 명시적으로 선언할 수도 있지만, 반환 객체의 타입이 명확하게 추론되는 경우에는 타입 추론을 활용하는 것이 일반적입니다.

## 8. React Event Handling with TypeScript

React는 브라우저의 DOM 이벤트를 기반으로 SyntheticEvent 시스템을 제공합니다.

TypeScript에서는 React가 제공하는 이벤트 타입을 사용하여 이벤트 객체의 구조를 정의할 수 있습니다.

### 8.1. Common Event Types

자주 사용하는 이벤트 타입은 다음과 같습니다.

| 이벤트 타입 | 설명 |
|---|---|
| `React.MouseEvent<T>` | 마우스 이벤트 |
| `React.ChangeEvent<T>` | 입력 요소 등의 값 변경 이벤트 |
| `React.FormEvent<T>` | 폼 관련 이벤트 |
| `React.KeyboardEvent<T>` | 키보드 이벤트 |
| `React.FocusEvent<T>` | 포커스 이벤트 |
| `React.PointerEvent<T>` | 포인터 이벤트 |
| `React.DragEvent<T>` | 드래그 이벤트 |
| `React.ClipboardEvent<T>` | 클립보드 이벤트 |

`T`에는 이벤트가 발생하는 DOM 요소의 타입을 지정합니다.

### 8.2. ChangeEvent

입력 요소의 값을 변경할 때는 `ChangeEvent`를 사용할 수 있습니다.

```tsx
import { useState } from 'react';
import type { ChangeEvent } from 'react';

function TextInput() {
  const [value, setValue] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <input
      value={value}
      onChange={handleChange}
    />
  );
}
```

### 8.3. FormEvent

폼 제출 이벤트는 `FormEvent`를 사용하여 처리할 수 있습니다.

```tsx
import type { FormEvent } from 'react';

function LoginForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Form submitted');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 8.4. EventHandler Types

React는 이벤트 핸들러 함수의 타입도 제공합니다.

예를 들어 `React.MouseEventHandler<HTMLButtonElement>`는 버튼 요소의 마우스 이벤트 핸들러 타입입니다.

```tsx
import type { MouseEventHandler } from 'react';

type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement>;
};

function Button({ onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      Click
    </button>
  );
}
```

이러한 타입을 사용하면 이벤트 객체의 매개변수 타입과 반환 타입을 직접 작성하지 않아도 됩니다.

## 9. Type Safety and Runtime Validation

TypeScript는 정적 타입 시스템을 제공하지만, 모든 데이터의 유효성을 런타임까지 보장하지는 않습니다.

특히 API 응답, 사용자 입력, Local Storage 데이터 등 외부에서 전달되는 값은 TypeScript의 타입 선언만으로 안전성을 보장할 수 없습니다.

### 9.1. Compile-Time Type Checking

TypeScript는 컴파일 과정에서 코드에 선언된 타입과 실제 사용 방식이 일치하는지 검사합니다.

```tsx
type User = {
  id: number;
  name: string;
};

function UserProfile({ user }: { user: User }) {
  return <h1>{user.name}</h1>;
}
```

다음과 같이 잘못된 데이터 구조를 전달하면 타입 오류가 발생합니다.

```tsx
<UserProfile
  user={{
    id: '1',
    name: 'Alice',
  }}
/>
```

`id`는 `number` 타입이어야 하지만 문자열이 전달되었기 때문입니다.

### 9.2. Runtime Data Validation

외부 API에서 전달되는 데이터는 TypeScript의 타입 선언과 일치한다는 보장이 없습니다.

다음 예제에서 `User` 타입은 개발자가 기대하는 데이터 구조를 나타내지만, 실제 API 응답이 해당 구조를 만족하는지는 별도로 확인해야 합니다.

```tsx
type User = {
  id: number;
  name: string;
};

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user');

  return response.json();
}
```

위 예제는 API 응답이 `User` 구조를 만족한다고 TypeScript에 선언한 것입니다. 실제 응답의 타입을 런타임에 검증하는 코드는 포함되어 있지 않습니다.

안전한 데이터 처리를 위해서는 `unknown` 타입으로 응답을 받은 후 별도의 검증 과정을 거치는 것이 좋습니다.

```tsx
type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user');

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const data: unknown = await response.json();

  if (!isUser(data)) {
    throw new Error('Invalid user response');
  }

  return data;
}
```

이러한 방식으로 정적 타입 검사와 런타임 데이터 검증을 함께 적용할 수 있습니다.

## 10. Recommended Development Practices

React + TypeScript 프로젝트에서는 타입 안정성과 코드 유지보수성을 높이기 위해 다음과 같은 개발 원칙을 권장합니다.

### 10.1. Enable Strict Mode

`tsconfig.json`에서 `strict` 옵션을 활성화하는 것이 좋습니다.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Strict Mode는 `strictNullChecks`, `noImplicitAny` 등을 포함한 엄격한 타입 검사 옵션을 활성화합니다.

이를 통해 타입이 명확하지 않은 코드와 잠재적인 오류를 개발 단계에서 발견할 수 있습니다.

### 10.2. Avoid Any

`any`는 TypeScript의 타입 검사를 사실상 우회하는 타입입니다.

```tsx
function UserProfile({ user }: { user: any }) {
  return <h1>{user.name}</h1>;
}
```

위 코드에서는 `user`의 구조와 속성 타입을 검사할 수 없습니다.

가능하면 명확한 타입을 선언하거나, 타입을 알 수 없는 데이터에는 `unknown`을 사용하고 타입 가드를 통해 검증하는 것이 좋습니다.

### 10.3. Prefer Type Inference

모든 변수와 함수에 타입을 명시적으로 선언할 필요는 없습니다.

```tsx
const count = 10;
const name = 'Alice';

function add(a: number, b: number) {
  return a + b;
}
```

TypeScript는 초기값과 함수의 구현을 기반으로 타입을 추론합니다.

타입 추론이 명확한 경우에는 불필요한 타입 선언을 줄이는 것이 코드의 가독성을 높이는 데 도움이 됩니다.

다만 컴포넌트의 Props, 외부 API 데이터, 복잡한 상태 모델 등 명시적인 타입 정의가 중요한 영역에서는 타입을 선언하는 것이 좋습니다.

### 10.4. Use Discriminated Unions for State

서로 다른 상태를 하나의 객체 구조에 Boolean 값으로 나누어 표현하기보다 Discriminated Union을 활용하면 상태의 유효한 조합을 명확하게 표현할 수 있습니다.

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

위 구조에서는 다음과 같은 상태를 명확하게 구분할 수 있습니다.

- `idle`: 초기 상태
- `loading`: 요청 진행 중
- `success`: 요청 성공 및 데이터 보유
- `error`: 요청 실패 및 오류 정보 보유

이를 통해 서로 모순되는 상태 조합을 줄이고 상태 처리 로직을 명확하게 구성할 수 있습니다.

### 10.5. Keep Type Definitions Organized

컴포넌트와 데이터 모델이 복잡해질수록 타입 정의를 적절한 위치에 분리하는 것이 좋습니다.

예를 들어 다음과 같은 구조를 사용할 수 있습니다.

```text
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.types.ts
│   └── UserProfile/
│       ├── UserProfile.tsx
│       └── UserProfile.types.ts
├── hooks/
│   └── useUser.ts
├── types/
│   └── user.ts
└── App.tsx
```

단순한 컴포넌트의 Props 타입은 컴포넌트 파일 내부에 정의할 수 있으며, 여러 컴포넌트에서 공유하거나 도메인 전반에서 사용하는 타입은 별도 파일로 분리할 수 있습니다.

## 11. Summary

React와 TypeScript를 함께 사용하면 React의 컴포넌트 기반 UI 개발 방식에 정적 타입 시스템을 결합할 수 있습니다.

주요 개념은 다음과 같습니다.

| 개념 | 설명 |
|---|---|
| `@types/react` | React API의 TypeScript 타입 정의 |
| `@types/react-dom` | React DOM API의 TypeScript 타입 정의 |
| `tsconfig.json` | TypeScript 컴파일러 설정 |
| `.ts` | JSX를 포함하지 않는 TypeScript 파일 |
| `.tsx` | JSX를 포함하는 TypeScript 파일 |
| `type` / `interface` | 컴포넌트 Props 및 데이터 구조 정의 |
| Type Inference | 초기값과 표현식을 기반으로 타입을 자동 추론하는 기능 |
| `ReactNode` | React에서 렌더링 가능한 다양한 콘텐츠를 표현하는 타입 |
| `ReactElement` | React 요소 객체를 표현하는 타입 |
| Event Types | React 이벤트 객체의 타입 정의 |
| Custom Hooks | 재사용 가능한 React 로직을 타입과 함께 구성하는 방법 |
| Runtime Validation | 외부에서 전달되는 데이터의 실제 구조를 실행 중 검증하는 과정 |

React + TypeScript 개발에서는 모든 코드에 타입을 명시하는 것보다 타입 추론과 명시적 타입 선언을 적절히 조합하는 것이 중요합니다.

특히 컴포넌트 Props, 상태 모델, 이벤트 처리, 외부 데이터 경계에 명확한 타입을 적용하면 애플리케이션의 안정성과 유지보수성을 높일 수 있습니다.

## 12. References

### Official Documentation

- [React - Using TypeScript](https://react.dev/learn/typescript)
- [React - TypeScript with Components](https://react.dev/learn/typescript#typescript-with-react-components)
- [React - React Reference](https://react.dev/reference/react)
- [TypeScript - Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [TypeScript - TSConfig Reference](https://www.typescriptlang.org/tsconfig/)

### React Type Definitions

- [DefinitelyTyped - React Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)
- [DefinitelyTyped - React DOM Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-dom)

### Community Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Related Topics

- [React - Describing the UI](https://react.dev/learn/describing-the-ui)
- [React - Managing State](https://react.dev/learn/managing-state)
- [React - Built-in Hooks](https://react.dev/reference/react/hooks)
- [TypeScript - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)