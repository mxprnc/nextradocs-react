# Uncontrolled Components

## 1. 개요

Uncontrolled Components는 입력 요소의 현재 값을 React State가 아닌 DOM 자체에서 관리하는 컴포넌트 설계 방식입니다.

Controlled Components에서는 React State가 입력 요소의 현재 값을 결정하지만, Uncontrolled Components에서는 브라우저의 DOM이 입력값을 직접 관리합니다.

React에서는 `useRef`를 이용하여 DOM 요소에 접근하고, 필요할 때 해당 요소의 현재 값을 읽을 수 있습니다.

초기값은 `defaultValue` 또는 `defaultChecked` Props를 통해 설정할 수 있습니다.

Uncontrolled Components의 주요 특징은 다음과 같습니다.

- **DOM 기반 상태 관리:** 입력 요소의 현재 값을 브라우저 DOM에서 관리합니다.
- **Ref를 통한 접근:** React Ref를 이용하여 DOM 요소의 현재 값에 접근합니다.
- **초기값 설정:** `defaultValue`와 `defaultChecked`를 이용하여 초기값을 지정합니다.
- **State 관리 최소화:** 입력할 때마다 React State를 업데이트할 필요가 없습니다.
- **필요한 시점에 데이터 수집:** Form 제출 등의 특정 시점에 입력값을 읽을 수 있습니다.

Uncontrolled Components는 입력값을 실시간으로 React State와 동기화할 필요가 없는 Form이나 DOM 자체의 입력 관리 기능을 활용하려는 경우에 적합합니다.

## 2. 기본 동작 원리

### 2.1. DOM에서 입력값 관리

Uncontrolled Component에서는 입력 요소의 현재 값이 DOM에 저장됩니다.

사용자가 입력값을 변경하면 브라우저가 DOM의 값을 직접 업데이트합니다.

React는 해당 입력값을 State로 관리하지 않으므로 일반적인 입력 과정에서 입력값 변경만으로 React의 State 업데이트가 발생하지 않습니다.

```tsx
import { useRef } from 'react';

function NameInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    console.log(inputRef.current?.value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        defaultValue="Alice"
      />

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

위 코드에서 `inputRef`는 실제 HTML Input DOM 요소를 참조합니다.

사용자가 입력값을 변경하면 브라우저가 해당 DOM 요소의 `value`를 업데이트합니다.

`handleSubmit`이 실행되는 시점에 `inputRef.current.value`를 읽으면 현재 입력값을 가져올 수 있습니다.

### 2.2. 기본 동작 과정

Uncontrolled Component의 일반적인 동작 과정은 다음과 같습니다.

1. React가 컴포넌트를 렌더링합니다.
2. DOM 입력 요소가 생성됩니다.
3. `ref`가 해당 DOM 요소를 참조합니다.
4. `defaultValue` 또는 `defaultChecked`가 초기값으로 적용됩니다.
5. 사용자가 입력 요소의 값을 변경합니다.
6. 브라우저가 DOM의 현재 값을 관리합니다.
7. 필요한 시점에 Ref를 통해 DOM의 현재 값을 읽습니다.

```text
React Component
      |
      v
DOM Input Element
      |
      v
defaultValue
      |
      v
User Interaction
      |
      v
Browser Updates DOM Value
      |
      v
Ref Access
      |
      v
Read Current Value
```

Controlled Component와 달리 사용자 입력이 React State 업데이트를 거쳐 다시 DOM에 반영되는 과정이 필요하지 않습니다.

### 2.3. defaultValue와 value의 차이

React에서 `defaultValue`와 `value`는 입력 요소의 값을 설정하는 서로 다른 역할을 수행합니다.

| 구분 | value | defaultValue |
|---|---|---|
| 역할 | 현재 입력값 제어 | 초기 입력값 설정 |
| 상태 관리 | React | DOM |
| 사용자 입력 | State 업데이트 필요 | DOM에서 직접 변경 |
| 렌더링 이후 변경 | 새로운 Props에 따라 값 제어 | 일반적으로 현재 DOM 값에 영향을 주지 않음 |
| 사용 방식 | Controlled Component | Uncontrolled Component |

예를 들어 다음 코드는 초기값을 설정하는 Uncontrolled Input입니다.

```tsx
<input defaultValue="Hello" />
```

반면 다음 코드는 React State를 통해 현재 값을 제어하는 Controlled Input입니다.

```tsx
const [value, setValue] = useState('Hello');

<input
  value={value}
  onChange={(event) => {
    setValue(event.target.value);
  }}
/>
```

`defaultValue`는 초기값을 지정하는 용도이며, 입력 요소의 현재 값을 지속적으로 제어하지 않습니다.

## 3. Ref를 이용한 DOM 접근

### 3.1. useRef의 역할

`useRef`는 렌더링 사이에 유지되는 참조 객체를 생성하는 React Hook입니다.

Ref 객체는 일반적으로 다음과 같은 구조를 가집니다.

```tsx
{
  current: null
}
```

DOM 요소를 Ref에 연결하면 React가 해당 DOM 요소를 `current`에 할당합니다.

```tsx
import { useRef } from 'react';

function EmailInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={inputRef}
      type="email"
      defaultValue="user@example.com"
    />
  );
}
```

`useRef<HTMLInputElement>(null)`은 Ref가 초기 렌더링 시점에는 `null`이며, 이후 HTML Input 요소를 참조할 수 있음을 타입으로 표현합니다.

DOM 요소에 접근할 때는 `current`를 사용합니다.

```tsx
const email = inputRef.current?.value;
```

Ref는 컴포넌트의 렌더링 결과를 결정하는 State와 달리, DOM 요소나 렌더링에 직접 영향을 주지 않는 값을 참조할 때 활용합니다.

### 3.2. Ref를 이용한 입력값 읽기

입력값이 필요한 시점에 Ref를 통해 현재 DOM 값을 읽을 수 있습니다.

```tsx
import { useRef } from 'react';

function LoginForm() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    console.log({
      username,
      password,
    });
  };

  return (
    <div>
      <input
        ref={usernameRef}
        type="text"
        defaultValue=""
      />

      <input
        ref={passwordRef}
        type="password"
        defaultValue=""
      />

      <button onClick={handleSubmit}>
        Login
      </button>
    </div>
  );
}
```

각 Ref는 독립적인 DOM 요소를 참조하며, 제출 시점에 각각의 입력값을 읽을 수 있습니다.

### 3.3. Ref를 이용한 DOM 조작

Uncontrolled Components에서는 입력값 조회뿐만 아니라 DOM 요소의 메서드도 직접 호출할 수 있습니다.

```tsx
import { useRef } from 'react';

function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        defaultValue="React"
      />

      <button onClick={handleFocus}>
        Focus
      </button>

      <button onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}
```

위 코드에서는 `focus()`를 이용하여 입력 요소에 포커스를 설정하고, DOM의 `value`를 직접 변경하여 입력값을 초기화합니다.

다만 React가 관리하는 UI 상태와 직접적인 DOM 조작이 서로 충돌하지 않도록 주의해야 합니다.

특히 Controlled Component에서는 DOM의 값을 직접 변경하더라도 React State가 기존 값을 유지하면 다음 렌더링에서 다시 원래 값으로 변경될 수 있습니다.

## 4. 입력 요소별 구현

### 4.1. Text Input

Text Input은 `defaultValue`로 초기값을 설정하고 Ref를 통해 현재 값을 읽을 수 있습니다.

```tsx
import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const value = inputRef.current?.value ?? '';

    console.log(value);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        defaultValue="React"
      />

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

입력값 변경 과정에서 React State를 업데이트하지 않으므로 입력값 관리가 단순해집니다.

### 4.2. Textarea

Textarea도 `defaultValue`를 이용하여 초기값을 설정할 수 있습니다.

```tsx
import { useRef } from 'react';

function MessageInput() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const message = textareaRef.current?.value ?? '';

    console.log(message);
  };

  return (
    <div>
      <textarea
        ref={textareaRef}
        defaultValue="Initial message"
      />

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

Textarea는 HTMLInputElement가 아닌 HTMLTextAreaElement를 사용해야 합니다.

### 4.3. Select

Select는 `defaultValue`를 통해 초기 선택값을 지정할 수 있습니다.

```tsx
import { useRef } from 'react';

function CountrySelect() {
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleSubmit = () => {
    const country = selectRef.current?.value;

    console.log(country);
  };

  return (
    <div>
      <select
        ref={selectRef}
        defaultValue="kr"
      >
        <option value="kr">Korea</option>
        <option value="us">United States</option>
        <option value="jp">Japan</option>
      </select>

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

다중 선택 Select에서는 `selectedOptions`를 통해 선택된 모든 옵션을 가져올 수 있습니다.

```tsx
const selectedValues = Array.from(
  selectRef.current?.selectedOptions ?? [],
  (option) => option.value
);
```

### 4.4. Checkbox

Checkbox는 `defaultChecked`를 이용하여 초기 체크 상태를 설정합니다.

```tsx
import { useRef } from 'react';

function AgreementCheckbox() {
  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const agreed = checkboxRef.current?.checked ?? false;

    console.log(agreed);
  };

  return (
    <div>
      <label>
        <input
          ref={checkboxRef}
          type="checkbox"
          defaultChecked={false}
        />

        Agree to the terms
      </label>

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

Checkbox의 현재 체크 상태는 `value`가 아니라 `checked` 속성으로 확인해야 합니다.

### 4.5. Radio

Radio Button은 `defaultChecked`를 이용하여 초기 선택 상태를 지정할 수 있습니다.

```tsx
import { useRef } from 'react';

function RoleSelector() {
  const userRef = useRef<HTMLInputElement>(null);
  const adminRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    let role = '';

    if (userRef.current?.checked) {
      role = 'user';
    } else if (adminRef.current?.checked) {
      role = 'admin';
    }

    console.log(role);
  };

  return (
    <div>
      <label>
        <input
          ref={userRef}
          type="radio"
          name="role"
          value="user"
          defaultChecked
        />
        User
      </label>

      <label>
        <input
          ref={adminRef}
          type="radio"
          name="role"
          value="admin"
        />
        Admin
      </label>

      <button onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
```

Radio Button은 동일한 `name`을 가진 요소들을 하나의 선택 그룹으로 구성합니다.

실제 선택 여부는 각 요소의 `checked`를 통해 확인할 수 있습니다.

## 5. FormData를 이용한 입력값 수집

### 5.1. FormData의 개념

Uncontrolled Component에서는 개별 입력 요소마다 Ref를 생성하지 않고, 브라우저의 `FormData` API를 이용하여 Form에 포함된 데이터를 수집할 수 있습니다.

`FormData`는 HTML Form 요소에 포함된 입력 데이터를 키-값 형태로 추출하는 Web API입니다.

```tsx
function SignupForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const username = formData.get('username');
    const email = formData.get('email');

    console.log({
      username,
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        defaultValue=""
      />

      <input
        name="email"
        type="email"
        defaultValue=""
      />

      <button type="submit">
        Sign Up
      </button>
    </form>
  );
}
```

`new FormData(event.currentTarget)`는 현재 제출된 Form 요소를 기반으로 Form 데이터를 생성합니다.

각 입력 요소에 지정된 `name` 속성을 기준으로 데이터를 조회할 수 있습니다.

### 5.2. FormData의 주요 메서드

| 메서드 | 설명 |
|---|---|
| `get(name)` | 지정한 이름의 첫 번째 값을 반환합니다. |
| `getAll(name)` | 지정한 이름에 해당하는 모든 값을 배열로 반환합니다. |
| `has(name)` | 지정한 이름의 데이터가 존재하는지 확인합니다. |
| `set(name, value)` | 지정한 이름의 값을 설정하거나 대체합니다. |
| `append(name, value)` | 기존 데이터에 새로운 값을 추가합니다. |
| `delete(name)` | 지정한 이름의 데이터를 제거합니다. |
| `entries()` | 키와 값의 반복자를 반환합니다. |

Checkbox나 동일한 이름을 가진 여러 입력 요소처럼 하나의 이름에 여러 값이 연결되는 경우에는 `getAll()`을 사용할 수 있습니다.

### 5.3. FormData를 이용한 전체 데이터 추출

```tsx
function LoginForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(
      formData.entries()
    );

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        defaultValue=""
      />

      <input
        name="email"
        type="email"
        defaultValue=""
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

`Object.fromEntries()`를 이용하면 FormData의 키-값 데이터를 일반 JavaScript 객체로 변환할 수 있습니다.

다만 동일한 이름을 가진 여러 입력값은 객체 변환 과정에서 하나의 값으로 합쳐지지 않고 일부 값이 손실될 수 있습니다.

이러한 경우에는 `getAll()`을 사용하여 배열 형태로 별도 처리해야 합니다.

또한 FormData는 문자열과 File 등을 포함할 수 있으므로, 모든 값을 문자열이라고 가정해서는 안 됩니다.

### 5.4. FormData와 name 속성

FormData는 입력 요소의 `name` 속성을 기준으로 데이터를 수집합니다.

따라서 Uncontrolled Form을 구현할 때는 각 입력 요소에 적절한 `name`을 지정해야 합니다.

다음과 같은 요소들은 일반적으로 FormData에 포함되지 않습니다.

- `name` 속성이 없는 입력 요소
- `disabled` 상태인 입력 요소
- 선택되지 않은 Radio Button
- 체크되지 않은 Checkbox

따라서 FormData를 사용할 때는 HTML Form의 데이터 제출 규칙을 이해해야 합니다.

## 6. TypeScript를 이용한 Uncontrolled Component 설계

### 6.1. Ref 타입 정의

TypeScript에서는 Ref가 참조하는 DOM 요소의 종류를 명시해야 합니다.

```tsx
import { useRef } from 'react';

function Input() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input ref={inputRef} />
  );
}
```

주요 DOM 요소의 타입은 다음과 같습니다.

| DOM 요소 | TypeScript 타입 |
|---|---|
| Input | `HTMLInputElement` |
| Textarea | `HTMLTextAreaElement` |
| Select | `HTMLSelectElement` |
| Form | `HTMLFormElement` |
| Button | `HTMLButtonElement` |
| Div | `HTMLDivElement` |

초기값으로 `null`을 전달하면 Ref의 초기화 전 상태를 타입에 반영할 수 있습니다.

### 6.2. null 처리

Ref는 컴포넌트가 처음 렌더링될 때 `null`일 수 있으며, DOM 요소가 연결되기 전이나 연결이 해제된 이후에도 `null`일 수 있습니다.

따라서 DOM 요소에 접근할 때는 null 여부를 고려해야 합니다.

```tsx
const value = inputRef.current?.value ?? '';
```

또는 명시적인 조건문을 사용할 수 있습니다.

```tsx
if (inputRef.current !== null) {
  console.log(inputRef.current.value);
}
```

이러한 처리는 TypeScript의 strict null checking 환경에서 안전한 DOM 접근을 가능하게 합니다.

### 6.3. React.RefObject와 Ref 타입

React의 Ref는 DOM 요소뿐만 아니라 컴포넌트나 기타 값을 참조하는 데도 활용됩니다.

DOM 요소를 참조하는 경우에는 일반적으로 다음과 같이 선언합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

이때 `inputRef.current`는 `HTMLInputElement | null`로 취급됩니다.

Ref를 Props로 전달하는 컴포넌트를 구현할 때는 React의 Ref 관련 타입을 활용할 수 있습니다.

```tsx
import type { Ref } from 'react';

type InputProps = {
  inputRef: Ref<HTMLInputElement>;
};

function Input({ inputRef }: InputProps) {
  return (
    <input ref={inputRef} />
  );
}
```

이를 통해 상위 컴포넌트에서 생성한 Ref를 하위 컴포넌트에 전달할 수 있습니다.

## 7. Controlled Components와 Uncontrolled Components 비교

### 7.1. 주요 차이점

| 구분 | Controlled Components | Uncontrolled Components |
|---|---|---|
| 값의 관리 주체 | React State | DOM |
| 현재 값 접근 | State | Ref 또는 FormData |
| 초기값 설정 | `value`, `checked` | `defaultValue`, `defaultChecked` |
| 입력 이벤트 | State 업데이트에 사용 | 선택적으로 사용 |
| 입력값 변경 | React State 업데이트 | 브라우저가 DOM 값 변경 |
| 데이터 수집 | State에서 조회 | Ref 또는 FormData |
| 유효성 검사 | State 기반으로 실시간 처리 가능 | 이벤트 또는 제출 시점에 처리 가능 |
| 상태 공유 | Props 및 Context 활용 | 별도의 데이터 전달 필요 |
| 렌더링 | 입력 State 변경에 따른 렌더링 발생 | 입력값 변경만으로 React State 업데이트가 발생하지 않음 |

### 7.2. Controlled Components가 적합한 경우

다음과 같은 상황에서는 Controlled Components가 적합합니다.

- 입력값을 실시간으로 검증해야 하는 경우
- 입력값에 따라 다른 UI를 표시해야 하는 경우
- 입력값을 여러 컴포넌트에서 공유해야 하는 경우
- 입력값을 즉시 가공하거나 제한해야 하는 경우
- React State를 기준으로 Form 전체의 상태를 관리해야 하는 경우

### 7.3. Uncontrolled Components가 적합한 경우

다음과 같은 상황에서는 Uncontrolled Components가 적합합니다.

- 입력값을 제출 시점에만 수집하는 경우
- 입력값을 React State로 지속적으로 관리할 필요가 없는 경우
- 기존 HTML Form 동작을 활용하려는 경우
- 파일 입력과 같이 DOM 기반 접근이 필요한 경우
- 간단한 Form을 구현하면서 State 및 이벤트 관리 코드를 줄이려는 경우

### 7.4. 두 방식의 혼합 사용

실제 애플리케이션에서는 모든 입력 요소를 하나의 방식으로 구현할 필요는 없습니다.

입력값의 실시간 관리가 필요한 요소에는 Controlled Components를 사용하고, 제출 시점에만 값이 필요한 요소에는 Uncontrolled Components를 사용할 수 있습니다.

다만 동일한 입력 요소를 Controlled와 Uncontrolled 방식으로 동시에 관리해서는 안 됩니다.

예를 들어 `value`와 `defaultValue`를 혼용하거나, React State와 DOM 값을 서로 독립적으로 변경하면 상태 불일치가 발생할 수 있습니다.

## 8. Uncontrolled Components의 주의사항

### 8.1. defaultValue는 초기값 설정 용도

`defaultValue`는 입력 요소가 처음 생성될 때 초기값을 설정하기 위한 Props입니다.

렌더링 이후 `defaultValue`가 변경되어도 사용자가 입력한 현재 DOM 값이 자동으로 변경되는 것은 아닙니다.

```tsx
function Input({
  initialValue,
}: {
  initialValue: string;
}) {
  return (
    <input defaultValue={initialValue} />
  );
}
```

`initialValue`가 변경되더라도 기존 입력 요소의 현재 값은 유지될 수 있습니다.

외부 데이터 변경에 따라 입력값을 다시 설정해야 한다면 Controlled Component를 사용하거나 명시적인 DOM 조작 또는 컴포넌트의 재생성 전략을 고려해야 합니다.

### 8.2. DOM 직접 조작의 범위 제한

Ref를 이용하면 DOM의 값을 직접 변경할 수 있지만, React의 렌더링 흐름과 충돌하지 않도록 주의해야 합니다.

DOM 조작은 포커스, 스크롤, 미디어 제어 등 React State로 관리할 필요가 없는 DOM 동작에 우선적으로 활용하는 것이 좋습니다.

입력값 자체를 지속적으로 동기화하거나 여러 UI 요소에서 공유해야 한다면 Controlled Component가 더 적합할 수 있습니다.

### 8.3. Ref 접근 시점

Ref는 DOM 요소가 실제로 생성되어 연결된 이후에 접근할 수 있습니다.

따라서 렌더링 과정에서 Ref의 `current`를 읽어 DOM 값을 사용하는 방식은 피해야 합니다.

일반적으로 이벤트 핸들러나 Effect 내부에서 DOM 요소에 접근하는 것이 적절합니다.

### 8.4. FormData의 데이터 타입

FormData의 `get()`은 `FormDataEntryValue | null`을 반환합니다.

`FormDataEntryValue`는 문자열 또는 File을 의미합니다.

따라서 다음과 같이 무조건 문자열이라고 가정하는 코드는 주의해야 합니다.

```tsx
const username = formData.get('username');
```

문자열이 필요한 경우에는 타입을 확인하거나 적절하게 변환해야 합니다.

```tsx
const value = formData.get('username');

const username =
  typeof value === 'string' ? value : '';
```

### 8.5. 파일 입력 처리

File Input은 브라우저의 보안 정책에 따라 사용자가 선택한 파일을 DOM을 통해 접근하는 방식으로 관리합니다.

```tsx
import { useRef } from 'react';

function FileInput() {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const files = fileRef.current?.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    console.log(file.name);
    console.log(file.size);
    console.log(file.type);
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
      />

      <button onClick={handleSubmit}>
        Upload
      </button>
    </div>
  );
}
```

`files`는 선택된 파일을 포함하는 `FileList` 객체입니다.

파일 선택값은 일반적인 문자열 입력과 다르게 처리해야 하며, 보안상의 이유로 JavaScript에서 임의의 파일 경로를 지정할 수 없습니다.

## 9. 정리

Uncontrolled Components는 DOM 자체에서 입력 요소의 현재 값을 관리하고, React Ref나 FormData를 이용하여 필요한 시점에 해당 값을 읽는 컴포넌트 설계 방식입니다.

주요 특징은 다음과 같습니다.

- 입력 요소의 현재 값을 브라우저 DOM에서 관리합니다.
- `defaultValue`와 `defaultChecked`를 통해 초기값을 설정합니다.
- `useRef`를 이용하여 DOM 요소에 접근할 수 있습니다.
- `FormData`를 이용하면 개별 Ref 없이 Form 데이터를 수집할 수 있습니다.
- 입력값 변경만으로 React State 업데이트가 발생하지 않습니다.
- 실시간 입력값 동기화가 필요하지 않은 단순한 Form에 적합합니다.
- 파일 입력과 같이 DOM 기반 접근이 필요한 요소에서도 활용됩니다.
- Controlled와 Uncontrolled 방식이 동일한 입력 요소에서 혼용되지 않도록 주의해야 합니다.

Uncontrolled Components는 React State를 사용하지 않고 DOM의 기본 입력 관리 기능을 활용하는 방식입니다. 입력값의 실시간 상태 관리가 필요하지 않은 경우 불필요한 State와 이벤트 처리 코드를 줄일 수 있습니다.

## 10. 참고자료

### React 공식 문서

- [React Input](https://react.dev/reference/react-dom/components/input)
  - Input의 `defaultValue`, `defaultChecked` 및 Uncontrolled Input의 동작을 설명합니다.
- [React Textarea](https://react.dev/reference/react-dom/components/textarea)
  - Textarea의 초기값 설정과 DOM 기반 입력값 관리 방식을 설명합니다.
- [React Select](https://react.dev/reference/react-dom/components/select)
  - Select의 `defaultValue` 및 Uncontrolled Select의 동작을 설명합니다.
- [useRef](https://react.dev/reference/react/useRef)
  - Ref 객체의 생성과 DOM 요소 참조, `current`를 이용한 값 접근을 설명합니다.
- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
  - Ref를 이용한 DOM 접근 및 조작 방법과 주의사항을 설명합니다.

### MDN Web Docs

- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
  - FormData 객체의 생성과 Form 데이터 수집 및 조작 메서드를 설명합니다.
- [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
  - Input DOM 요소의 속성과 메서드를 설명합니다.
- [HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)
  - HTML Form 요소의 속성과 제출 동작을 설명합니다.
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API)
  - 브라우저에서 File 및 FileList 객체를 다루는 방법을 설명합니다.

### TypeScript 공식 문서

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  - DOM 요소의 타입 지정과 Ref의 타입 안정성을 확보할 때 참고할 수 있는 공식 문서입니다.