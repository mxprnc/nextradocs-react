# Controlled Components

## 1. 개요

Controlled Components는 컴포넌트의 상태를 React에서 관리하고, 해당 상태를 기반으로 UI의 값을 제어하는 설계 방식입니다.

React에서는 입력 요소의 현재 값을 State로 관리하고, State를 입력 요소의 `value` 또는 `checked` Props에 연결하여 UI를 표현할 수 있습니다.

사용자가 입력 요소의 값을 변경하면 이벤트 핸들러가 호출되고, 이벤트 핸들러에서 State를 업데이트합니다. State가 변경되면 React는 새로운 값을 기반으로 UI를 다시 렌더링합니다.

Controlled Components의 주요 특징은 다음과 같습니다.

- **단일 상태 관리:** 입력 요소의 현재 값을 React State에서 관리합니다.
- **명시적인 데이터 흐름:** State가 UI의 현재 값을 결정합니다.
- **예측 가능한 상태 변경:** 이벤트 핸들러를 통해 상태 변경 과정을 명확하게 관리합니다.
- **유효성 검사 및 데이터 가공:** 입력값을 변경하거나 검증하는 로직을 쉽게 적용할 수 있습니다.
- **컴포넌트 간 상태 공유:** 입력값을 상위 컴포넌트로 전달하여 여러 컴포넌트에서 공유할 수 있습니다.

Controlled Components는 React에서 Form, Input, Select, Checkbox 등의 입력 요소를 관리하는 대표적인 방식입니다.

## 2. 기본 동작 원리

### 2.1. State와 UI의 관계

Controlled Component에서는 React State가 입력 요소의 현재 값을 결정합니다.

일반적인 동작 과정은 다음과 같습니다.

1. React State에 초기값을 설정합니다.
2. 입력 요소의 `value` 또는 `checked`에 State를 연결합니다.
3. 사용자가 입력 요소의 값을 변경합니다.
4. `onChange` 이벤트 핸들러가 호출됩니다.
5. 이벤트 핸들러에서 State를 업데이트합니다.
6. React가 변경된 State를 기반으로 컴포넌트를 다시 렌더링합니다.
7. 입력 요소에는 새로운 State 값이 반영됩니다.

```tsx
import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState('');

  return (
    <input
      type="text"
      value={name}
      onChange={(event) => {
        setName(event.target.value);
      }}
    />
  );
}
```

위 코드에서 `name` State는 입력 요소의 현재 값을 결정합니다.

사용자가 문자를 입력하면 `onChange`가 호출되고, `setName`을 통해 State가 변경됩니다.

새로운 State 값이 렌더링에 반영되면서 입력 요소의 `value`도 업데이트됩니다.

### 2.2. 단방향 데이터 흐름

Controlled Component는 React의 단방향 데이터 흐름을 기반으로 동작합니다.

```text
React State
    |
    v
Input value
    |
    v
User Interaction
    |
    v
onChange Handler
    |
    v
State Update
    |
    v
Re-render
    |
    +------> Input value
```

데이터는 State에서 UI 방향으로 전달되고, 사용자 입력은 이벤트를 통해 State 변경을 요청합니다.

입력 요소가 독립적으로 값을 관리하는 것이 아니라 React State를 기준으로 동작하기 때문에 데이터 흐름을 명확하게 추적할 수 있습니다.

### 2.3. value와 checked

HTML 입력 요소의 종류에 따라 제어하는 Props가 달라집니다.

| 입력 요소 | 제어 Props | 설명 |
|---|---|---|
| Text Input | `value` | 입력 문자열 |
| Textarea | `value` | 입력 문자열 |
| Select | `value` | 선택된 옵션 |
| Checkbox | `checked` | 체크 여부 |
| Radio | `checked` | 선택 여부 |

문자열이나 선택값을 관리하는 입력 요소에는 일반적으로 `value`를 사용합니다.

Checkbox와 Radio처럼 선택 여부를 관리하는 입력 요소에는 `checked`를 사용합니다.

## 3. 입력 요소별 구현

### 3.1. Text Input

Text Input은 문자열 State를 이용하여 입력값을 제어합니다.

```tsx
import { useState } from 'react';

function TextInput() {
  const [email, setEmail] = useState('');

  return (
    <input
      type="email"
      value={email}
      onChange={(event) => {
        setEmail(event.target.value);
      }}
      placeholder="Enter your email"
    />
  );
}
```

`value`에 State를 연결하면 React가 입력 요소의 현재 값을 관리합니다.

`onChange`에서는 `event.target.value`를 이용하여 사용자가 입력한 문자열을 가져올 수 있습니다.

### 3.2. Textarea

Textarea 역시 `value`와 `onChange`를 이용하여 입력값을 관리합니다.

```tsx
import { useState } from 'react';

function MessageInput() {
  const [message, setMessage] = useState('');

  return (
    <textarea
      value={message}
      onChange={(event) => {
        setMessage(event.target.value);
      }}
      placeholder="Enter your message"
    />
  );
}
```

HTML의 `<textarea>`는 기본적으로 태그 내부의 텍스트를 초기 콘텐츠로 사용하지만, React에서는 Controlled Component로 사용할 때 `value`를 통해 현재 값을 관리합니다.

### 3.3. Select

Select는 선택된 옵션의 값을 State로 관리합니다.

```tsx
import { useState } from 'react';

function CountrySelect() {
  const [country, setCountry] = useState('kr');

  return (
    <select
      value={country}
      onChange={(event) => {
        setCountry(event.target.value);
      }}
    >
      <option value="kr">Korea</option>
      <option value="us">United States</option>
      <option value="jp">Japan</option>
    </select>
  );
}
```

Select의 `value`에 현재 선택값을 연결하면 State에 따라 선택된 옵션이 결정됩니다.

여러 옵션 중 하나를 선택하면 `onChange`가 호출되고, 선택된 값이 State에 반영됩니다.

다중 선택 Select에서는 `multiple` 속성과 함께 문자열 배열을 `value`로 전달할 수 있습니다.

```tsx
import { useState } from 'react';

function LanguageSelect() {
  const [languages, setLanguages] = useState<string[]>([
    'typescript',
  ]);

  return (
    <select
      multiple
      value={languages}
      onChange={(event) => {
        const selected = Array.from(
          event.target.selectedOptions,
          (option) => option.value
        );

        setLanguages(selected);
      }}
    >
      <option value="typescript">TypeScript</option>
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
    </select>
  );
}
```

### 3.4. Checkbox

Checkbox는 `checked`를 이용하여 체크 여부를 관리합니다.

```tsx
import { useState } from 'react';

function AgreementCheckbox() {
  const [agreed, setAgreed] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={agreed}
        onChange={(event) => {
          setAgreed(event.target.checked);
        }}
      />
      Agree to the terms
    </label>
  );
}
```

Checkbox에서는 `event.target.value`가 아니라 `event.target.checked`를 사용하여 체크 상태를 가져와야 합니다.

`checked`는 Boolean 값을 가지며, 사용자의 선택에 따라 `true` 또는 `false`로 변경됩니다.

### 3.5. Radio

Radio Button은 여러 선택지 중 하나를 선택하는 입력 요소입니다.

```tsx
import { useState } from 'react';

type Role = 'user' | 'admin' | 'guest';

function RoleSelector() {
  const [role, setRole] = useState<Role>('user');

  return (
    <div>
      <label>
        <input
          type="radio"
          name="role"
          value="user"
          checked={role === 'user'}
          onChange={(event) => {
            setRole(event.target.value as Role);
          }}
        />
        User
      </label>

      <label>
        <input
          type="radio"
          name="role"
          value="admin"
          checked={role === 'admin'}
          onChange={(event) => {
            setRole(event.target.value as Role);
          }}
        />
        Admin
      </label>

      <label>
        <input
          type="radio"
          name="role"
          value="guest"
          checked={role === 'guest'}
          onChange={(event) => {
            setRole(event.target.value as Role);
          }}
        />
        Guest
      </label>
    </div>
  );
}
```

Radio Button은 동일한 `name`을 가진 요소들을 하나의 선택 그룹으로 구성합니다.

각 요소의 `checked`는 현재 State와 해당 옵션의 값을 비교하여 결정합니다.

위 예제에서는 `role` State가 `admin`이면 Admin Radio Button만 선택된 상태로 표시됩니다.

## 4. TypeScript를 이용한 Controlled Component 설계

### 4.1. 이벤트 타입 지정

TypeScript에서는 입력 요소의 이벤트 타입을 명시적으로 지정할 수 있습니다.

일반적인 Input 요소에서는 `React.ChangeEvent<HTMLInputElement>`를 사용합니다.

```tsx
import { useState } from 'react';

import type { ChangeEvent } from 'react';

function NameInput() {
  const [name, setName] = useState('');

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setName(event.target.value);
  };

  return (
    <input
      value={name}
      onChange={handleChange}
    />
  );
}
```

입력 요소에 따라 이벤트의 제네릭 타입이 달라집니다.

| 요소 | 이벤트 타입 |
|---|---|
| Input | `ChangeEvent<HTMLInputElement>` |
| Textarea | `ChangeEvent<HTMLTextAreaElement>` |
| Select | `ChangeEvent<HTMLSelectElement>` |

이벤트 타입을 정확하게 지정하면 `event.target`에 대한 타입 추론과 자동 완성을 활용할 수 있습니다.

### 4.2. 재사용 가능한 Input 컴포넌트

Controlled Component는 Props를 통해 입력값과 이벤트 핸들러를 전달받도록 설계할 수 있습니다.

```tsx
import type {
  ChangeEvent,
} from 'react';

type InputProps = {
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder?: string;
};

function Input({
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
```

상위 컴포넌트에서는 State를 관리하고, Input 컴포넌트에는 현재 값과 이벤트 핸들러를 전달합니다.

```tsx
import { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');

  return (
    <Input
      value={username}
      onChange={(event) => {
        setUsername(event.target.value);
      }}
      placeholder="Enter username"
    />
  );
}
```

이러한 구조에서는 Input이 자체적인 입력 상태를 관리하지 않습니다.

입력값의 소유권은 상위 컴포넌트에 있으며, Input은 전달받은 Props를 기반으로 UI를 표현합니다.

### 4.3. Generic Input 컴포넌트

입력값의 타입이 문자열뿐만 아니라 다양한 형태로 구성되는 경우 Generic을 활용할 수 있습니다.

```tsx
type ControlledFieldProps<T> = {
  value: T;
  onChange: (value: T) => void;
};

function ControlledField<T>({
  value,
  onChange,
}: ControlledFieldProps<T>) {
  return (
    <div>
      <span>{String(value)}</span>
      <button
        onClick={() => {
          onChange(value);
        }}
      >
        Update
      </button>
    </div>
  );
}
```

Generic을 이용하면 입력값의 타입에 관계없이 공통적인 Props 구조를 정의할 수 있습니다.

다만 실제 HTML Input 요소는 `value`가 문자열 중심으로 동작하므로, 숫자나 Boolean 등 다른 타입을 처리할 때는 변환 및 검증 로직이 필요합니다.

## 5. 상위 컴포넌트에서 상태 관리

### 5.1. State Lifting

여러 컴포넌트에서 동일한 입력값을 사용해야 한다면 State를 공통 상위 컴포넌트로 이동할 수 있습니다.

이를 State Lifting 또는 Lifting State Up이라고 합니다.

```tsx
import { useState } from 'react';

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}

function SearchResult({
  query,
}: {
  query: string;
}) {
  return (
    <p>Search Query: {query}</p>
  );
}

function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <SearchInput
        value={query}
        onChange={setQuery}
      />

      <SearchResult query={query} />
    </div>
  );
}
```

`SearchPage`가 입력값을 관리하고, `SearchInput`과 `SearchResult`에 동일한 State를 전달합니다.

입력값이 변경되면 두 컴포넌트가 동일한 상태를 기준으로 UI를 표현할 수 있습니다.

### 5.2. Single Source of Truth

Single Source of Truth는 특정 데이터의 기준이 되는 상태를 하나의 위치에서 관리하는 원칙입니다.

Controlled Component에서는 입력 요소의 현재 값을 React State를 기준으로 관리합니다.

동일한 입력값을 여러 컴포넌트에서 별도로 관리하면 상태 간 불일치가 발생할 수 있습니다.

따라서 여러 컴포넌트가 동일한 값을 사용해야 한다면 공통 상위 컴포넌트에서 State를 관리하는 방식을 고려해야 합니다.

## 6. Form과 Controlled Components

### 6.1. 여러 입력 요소의 상태 관리

하나의 Form에 여러 입력 요소가 존재하는 경우 각각의 입력값을 State로 관리할 수 있습니다.

```tsx
import { useState } from 'react';

type FormData = {
  username: string;
  email: string;
  password: string;
};

function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        value={formData.username}
        onChange={handleChange}
      />

      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
      />

      <button type="submit">
        Sign Up
      </button>
    </form>
  );
}
```

여러 입력 요소의 값을 하나의 객체 State로 관리하면 Form 데이터를 구조적으로 관리할 수 있습니다.

`name` 속성을 이용하여 변경된 입력 요소를 식별하고, 해당 필드만 업데이트합니다.

### 6.2. 입력값 검증

Controlled Component에서는 입력값이 변경되는 시점에 검증 로직을 실행할 수 있습니다.

```tsx
import { useState } from 'react';

function EmailForm() {
  const [email, setEmail] = useState('');

  const isValidEmail =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />

      {email.length > 0 && !isValidEmail && (
        <p>Invalid email address.</p>
      )}

      <button disabled={!isValidEmail}>
        Submit
      </button>
    </div>
  );
}
```

입력값을 State로 관리하면 현재 값에 따라 검증 결과를 계산하고, 버튼의 활성화 여부나 오류 메시지를 제어할 수 있습니다.

이처럼 Controlled Component는 Form의 유효성 검사와 UI 상태 관리에 적합합니다.

## 7. Controlled Components의 주의사항

### 7.1. value와 onChange의 관계

Controlled Input에 `value`를 전달하면서 `onChange`에서 해당 State를 업데이트하지 않으면 입력값을 변경할 수 없습니다.

```tsx
function Input() {
  return (
    <input value="Fixed Value" />
  );
}
```

위 코드는 입력값이 고정된 Read-only 형태로 동작합니다.

사용자의 입력을 허용하려면 `onChange`에서 State를 업데이트해야 합니다.

```tsx
import { useState } from 'react';

function Input() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
      }}
    />
  );
}
```

사용자의 입력을 허용하지 않는 것이 목적이라면 `readOnly`를 명시하는 것이 좋습니다.

### 7.2. Controlled와 Uncontrolled 상태 전환 방지

React 입력 요소는 처음 렌더링될 때 Controlled 또는 Uncontrolled 방식 중 하나로 일관되게 사용해야 합니다.

다음 코드는 초기값이 `undefined`일 수 있기 때문에 문제가 발생할 수 있습니다.

```tsx
function Input({
  value,
}: {
  value?: string;
}) {
  return (
    <input value={value} />
  );
}
```

처음에는 `undefined`로 렌더링되어 Uncontrolled 방식으로 동작하다가 이후 문자열이 전달되면 Controlled 방식으로 전환될 수 있습니다.

이러한 전환은 React 경고의 원인이 됩니다.

문자열 입력 요소에서는 초기값을 빈 문자열로 설정하는 것이 일반적입니다.

```tsx
function Input({
  value,
}: {
  value?: string;
}) {
  return (
    <input value={value ?? ''} />
  );
}
```

Checkbox의 경우에는 Boolean 값이 필요하므로 다음과 같이 처리할 수 있습니다.

```tsx
<input
  type="checkbox"
  checked={checked ?? false}
  onChange={handleChange}
/>
```

### 7.3. State 업데이트의 비동기적 특성

React의 State 업데이트는 현재 실행 중인 JavaScript 코드에서 즉시 변수의 값을 변경하는 방식으로 동작하지 않습니다.

따라서 State 업데이트 직후 기존 State 변수를 읽으면 이전 렌더링의 값이 반환될 수 있습니다.

```tsx
import { useState } from 'react';

function CounterInput() {
  const [value, setValue] = useState('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue(event.target.value);

    console.log(value);
  };

  return (
    <input
      value={value}
      onChange={handleChange}
    />
  );
}
```

위 코드의 `console.log(value)`는 State 업데이트 이전의 값을 참조합니다.

새로운 입력값을 즉시 사용해야 하는 경우에는 이벤트 객체에서 직접 값을 가져와 사용할 수 있습니다.

```tsx
const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const nextValue = event.target.value;

  setValue(nextValue);

  console.log(nextValue);
};
```

### 7.4. 불필요한 렌더링

Controlled Component는 입력값이 변경될 때 State 업데이트를 발생시키므로 해당 State를 사용하는 컴포넌트의 렌더링이 발생할 수 있습니다.

특히 Form 전체를 상위 컴포넌트에서 관리하고 해당 State를 많은 하위 컴포넌트에서 사용하면 입력할 때마다 넓은 컴포넌트 영역이 다시 렌더링될 수 있습니다.

다음과 같은 방법을 고려할 수 있습니다.

- 입력값을 사용하는 가장 가까운 공통 상위 컴포넌트에서 State를 관리합니다.
- 관련 없는 UI와 입력 상태를 분리합니다.
- 불필요하게 큰 컴포넌트에서 모든 입력값을 관리하지 않습니다.
- 실제 성능 문제가 확인된 경우에만 Memoization을 적용합니다.

Controlled Component 자체가 반드시 성능 문제를 일으키는 것은 아닙니다. 상태의 소유 위치와 렌더링 범위를 적절하게 설계하는 것이 중요합니다.

### 7.5. Number Input의 값 처리

HTML의 `<input type="number">`도 `event.target.value`를 통해 문자열을 반환합니다.

따라서 숫자 State로 관리하려면 문자열을 숫자로 변환하는 과정이 필요합니다.

```tsx
import { useState } from 'react';

function AgeInput() {
  const [age, setAge] = useState<number | ''>('');

  return (
    <input
      type="number"
      value={age}
      onChange={(event) => {
        const value = event.target.value;

        setAge(
          value === '' ? '' : Number(value)
        );
      }}
    />
  );
}
```

빈 문자열을 별도로 처리하는 이유는 사용자가 입력값을 지우는 중간 상태도 표현해야 하기 때문입니다.

입력 단계에서 무조건 숫자로 변환하면 빈 문자열이 `0`으로 변환되는 등 원하지 않는 동작이 발생할 수 있습니다.

## 8. Controlled Components의 장단점

### 8.1. 장점

- 입력값을 React State에서 명시적으로 관리할 수 있습니다.
- 입력값 검증과 데이터 가공을 쉽게 적용할 수 있습니다.
- 여러 컴포넌트 간 입력값을 공유할 수 있습니다.
- 입력값에 따른 UI 변경을 예측 가능하게 관리할 수 있습니다.
- Form 제출 전에 데이터를 검증하거나 변환할 수 있습니다.
- 테스트 환경에서 입력 상태와 동작을 명확하게 검증할 수 있습니다.

### 8.2. 단점

- 입력값마다 State와 이벤트 핸들러를 관리해야 합니다.
- 입력값이 변경될 때 React 렌더링이 발생할 수 있습니다.
- 많은 입력 요소를 관리할 경우 상태 관리 코드가 증가합니다.
- 입력값과 DOM 값 사이의 동기화 로직을 직접 관리해야 합니다.

입력 요소가 많거나 입력값을 React에서 실시간으로 관리할 필요가 없는 경우에는 Uncontrolled Component가 더 적합할 수 있습니다.

## 9. 정리

Controlled Components는 React State를 기준으로 입력 요소의 현재 값을 제어하는 컴포넌트 설계 방식입니다.

주요 특징은 다음과 같습니다.

- 입력 요소의 현재 값을 React State에서 관리합니다.
- `value` 또는 `checked` Props를 통해 입력 요소의 값을 제어합니다.
- `onChange` 이벤트 핸들러에서 State를 업데이트합니다.
- State 변경에 따라 React가 UI를 다시 렌더링합니다.
- 입력값 검증, 데이터 가공, Form 관리에 적합합니다.
- 여러 컴포넌트에서 동일한 입력값을 사용해야 한다면 State Lifting을 활용할 수 있습니다.
- TypeScript의 `ChangeEvent` 타입을 이용하여 입력 요소별 이벤트 타입을 명확하게 정의할 수 있습니다.
- Controlled와 Uncontrolled 방식이 런타임에 전환되지 않도록 초기값을 일관되게 관리해야 합니다.

Controlled Components는 입력 요소의 상태와 UI를 React의 데이터 흐름에 통합하는 방식으로, 예측 가능한 Form 동작과 명시적인 상태 관리를 구현하는 데 중요한 역할을 합니다.

## 10. 참고자료

### React 공식 문서

- [React Input](https://react.dev/reference/react-dom/components/input)
  - Input 컴포넌트의 `value`, `defaultValue`, `checked`, `defaultChecked` 및 Controlled Input의 동작을 설명합니다.
- [React Textarea](https://react.dev/reference/react-dom/components/textarea)
  - Textarea의 Controlled 및 Uncontrolled 동작과 입력값 관리 방식을 설명합니다.
- [React Select](https://react.dev/reference/react-dom/components/select)
  - Select의 선택값 관리, 다중 선택 및 Controlled Select의 동작을 설명합니다.
- [React Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
  - State Lifting을 이용하여 여러 컴포넌트 간 상태를 공유하는 방법을 설명합니다.
- [React State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
  - React State의 기본 개념과 상태 업데이트 및 렌더링의 관계를 설명합니다.
- [React Responding to Events](https://react.dev/learn/responding-to-events)
  - 이벤트 핸들러를 통한 사용자 상호작용 처리 방식을 설명합니다.
- [React Managing State](https://react.dev/learn/managing-state)
  - 컴포넌트의 상태 구조와 상태 관리 원칙을 설명합니다.

### TypeScript 공식 문서

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  - React 이벤트 타입과 입력값 타입을 설계할 때 참고할 수 있는 TypeScript 공식 문서입니다.