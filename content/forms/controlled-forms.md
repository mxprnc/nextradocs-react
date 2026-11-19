# Controlled Forms

## 1. 개요

Controlled Forms는 React의 State를 통해 폼 입력 요소의 현재 값을 제어하는 방식입니다.

일반적인 HTML Form Elements는 브라우저의 DOM이 입력값을 자체적으로 관리합니다. 사용자가 입력하거나 선택하면 브라우저가 해당 요소의 내부 값을 변경합니다.

반면 React의 Controlled Component는 입력값을 React State와 연결하여 관리합니다. 사용자의 입력으로 발생한 변경 사항을 이벤트 핸들러에서 State에 반영하고, 업데이트된 State를 다시 입력 요소의 `value` 또는 `checked`에 전달합니다.

이 구조에서는 React State가 입력값의 단일 기준점(Single Source of Truth)으로 동작합니다.

Controlled Forms의 주요 특징은 다음과 같습니다.

- React State를 통해 입력값을 관리합니다.
- `value` 또는 `checked`를 사용하여 입력 요소의 현재 상태를 지정합니다.
- `onChange` 이벤트를 통해 사용자 입력을 State에 반영합니다.
- 입력값에 따라 다른 UI를 동적으로 갱신할 수 있습니다.
- 입력값 검증, 정규화, 조건부 렌더링 등을 구현하기 쉽습니다.
- 프로그램적인 상태 변경을 통해 입력값을 초기화하거나 수정할 수 있습니다.

## 2. Controlled Component의 동작 원리

Controlled Component는 React State와 DOM 입력 요소가 양방향으로 연결된 구조처럼 동작합니다.

다만 실제 데이터 흐름은 React State에서 DOM으로 전달되는 단방향 흐름을 기반으로 합니다.

사용자 입력은 이벤트를 통해 React에 전달되고, React는 State를 업데이트한 후 변경된 값을 다시 DOM에 반영합니다.

### 2.1. 동작 과정

Controlled Component의 기본 동작 과정은 다음과 같습니다.

1. React State를 초기화합니다.
2. State 값을 입력 요소의 `value` 또는 `checked`에 전달합니다.
3. 사용자가 입력 요소를 변경합니다.
4. React의 `onChange` 이벤트 핸들러가 실행됩니다.
5. 이벤트 핸들러에서 입력값을 읽고 State를 업데이트합니다.
6. React가 컴포넌트를 다시 렌더링합니다.
7. 변경된 State가 입력 요소에 반영됩니다.

```tsx
import { useState } from "react";

function UsernameForm() {
  const [username, setUsername] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setUsername(event.currentTarget.value);
  }

  return (
    <form>
      <label htmlFor="username">
        Username
      </label>

      <input
        id="username"
        name="username"
        type="text"
        value={username}
        onChange={handleChange}
      />

      <p>Current Value: {username}</p>
    </form>
  );
}
```

위 예제에서 `username` State는 입력 요소의 현재 값을 결정합니다.

사용자가 입력하면 `handleChange`가 실행되고, 새로운 입력값이 `setUsername`을 통해 State에 반영됩니다.

State가 변경되면 React가 컴포넌트를 다시 렌더링하며, 변경된 State가 Input의 `value`에 전달됩니다.

### 2.2. 데이터 흐름

```text
       React State
       username = ""
            |
            | value
            v
       Input Element
            |
            | User Input
            v
        onChange
            |
            | event.currentTarget.value
            v
       setUsername()
            |
            v
       React State
            |
            | Re-render
            v
       Input Element
```

이 구조에서 중요한 점은 입력 요소가 변경되었다고 해서 React State가 자동으로 변경되는 것은 아니라는 사실입니다.

반드시 이벤트 핸들러에서 State 업데이트를 수행해야 합니다.

### 2.3. Single Source of Truth

Single Source of Truth는 특정 데이터의 기준이 되는 상태를 하나의 위치에서 관리하는 개념입니다.

Controlled Component에서는 React State가 입력값의 기준점이 됩니다.

```tsx
const [email, setEmail] = useState("");

<input
  type="email"
  value={email}
  onChange={(event) => {
    setEmail(event.currentTarget.value);
  }}
/>
```

위 구조에서는 DOM에 저장된 입력값을 직접 조회하지 않더라도 React State를 통해 현재 입력값을 확인할 수 있습니다.

또한 다른 이벤트 핸들러에서도 동일한 State를 변경할 수 있습니다.

```tsx
function EmailForm() {
  const [email, setEmail] = useState("");

  function resetEmail() {
    setEmail("");
  }

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={(event) => {
          setEmail(event.currentTarget.value);
        }}
      />

      <button
        type="button"
        onClick={resetEmail}
      >
        Reset
      </button>
    </form>
  );
}
```

Reset 버튼을 클릭하면 React State가 빈 문자열로 변경되고, 입력 요소에도 변경된 값이 반영됩니다.

## 3. Controlled Component의 주요 Props

React에서 입력 요소를 제어할 때 사용하는 주요 Props는 `value`, `checked`, `onChange`입니다.

### 3.1. value

`value`는 텍스트 기반 입력 요소의 현재 값을 지정합니다.

대표적으로 다음 요소에서 사용합니다.

- `<input type="text">`
- `<input type="email">`
- `<input type="password">`
- `<input type="number">`
- `<textarea>`
- `<select>`

```tsx
const [username, setUsername] = useState("");

<input
  type="text"
  value={username}
  onChange={(event) => {
    setUsername(event.currentTarget.value);
  }}
/>
```

`value`에 전달한 값이 입력 요소의 현재 표시값을 결정합니다.

따라서 State를 업데이트하지 않으면 사용자가 입력한 값이 유지되지 않고 기존 State 값으로 되돌아갑니다.

### 3.2. checked

`checked`는 Checkbox와 Radio의 선택 상태를 지정합니다.

```tsx
const [agreed, setAgreed] = useState(false);

<input
  type="checkbox"
  checked={agreed}
  onChange={(event) => {
    setAgreed(event.currentTarget.checked);
  }}
/>
```

`checked`는 Boolean 값을 사용합니다.

Checkbox와 Radio에서는 `value`와 `checked`의 역할을 구분해야 합니다.

| 속성 | 역할 |
|---|---|
| `value` | 선택된 경우 폼 제출에 사용할 값 |
| `checked` | 현재 선택 여부 |

### 3.3. onChange

`onChange`는 사용자가 입력 요소의 값을 변경할 때 실행되는 이벤트 핸들러입니다.

Controlled Component에서는 이 이벤트를 통해 입력값을 React State에 반영합니다.

```tsx
const [username, setUsername] = useState("");

function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setUsername(event.currentTarget.value);
}

<input
  value={username}
  onChange={handleChange}
/>
```

React의 `onChange`는 텍스트 입력에서 사용자가 타이핑할 때마다 실행됩니다.

일반적인 브라우저의 `change` 이벤트가 발생하는 시점과 다르게 동작할 수 있으므로 HTML 이벤트와 구분할 필요가 있습니다.

Controlled 입력 요소에서는 `onChange` 내부에서 State를 동기적으로 업데이트하는 것이 중요합니다.

## 4. Input 종류별 Controlled 구현

### 4.1. Text Input

Text Input은 문자열을 입력받는 가장 일반적인 입력 요소입니다.

```tsx
import { useState } from "react";

function UsernameInput() {
  const [username, setUsername] = useState("");

  return (
    <input
      type="text"
      value={username}
      onChange={(event) => {
        setUsername(event.currentTarget.value);
      }}
    />
  );
}
```

`value`에는 문자열을 전달해야 합니다.

초기값이 없는 경우에도 빈 문자열(`""`)을 사용하여 Controlled 상태를 유지하는 것이 좋습니다.

### 4.2. Number Input

Number Input은 숫자를 입력받는 요소입니다.

```tsx
function AgeInput() {
  const [age, setAge] = useState("");

  return (
    <input
      type="number"
      value={age}
      onChange={(event) => {
        setAge(event.currentTarget.value);
      }}
    />
  );
}
```

여기서 주의할 점은 `type="number"`를 사용하더라도 `event.currentTarget.value`는 문자열이라는 사실입니다.

숫자 연산이 필요한 경우 명시적으로 변환해야 합니다.

```tsx
const [age, setAge] = useState("");

const numericAge =
  age === "" ? null : Number(age);
```

입력 중에는 빈 문자열이나 숫자로 완성되지 않은 상태가 발생할 수 있으므로, 입력값 자체는 문자열로 관리하고 필요한 시점에 숫자로 변환하는 방식이 유용합니다.

### 4.3. Textarea

Textarea는 여러 줄의 문자열을 입력받는 요소입니다.

```tsx
function CommentInput() {
  const [comment, setComment] = useState("");

  return (
    <textarea
      value={comment}
      onChange={(event) => {
        setComment(event.currentTarget.value);
      }}
    />
  );
}
```

React에서는 Textarea의 현재 입력값을 `value`로 지정합니다.

HTML과 달리 초기 콘텐츠를 자식 요소로 지정하는 방식 대신 `value` 또는 `defaultValue`를 사용합니다.

### 4.4. Select

Select는 선택 가능한 항목 중 하나를 선택하는 요소입니다.

```tsx
type Country = "kr" | "us" | "jp";

function CountrySelect() {
  const [country, setCountry] = useState<Country>("kr");

  return (
    <select
      value={country}
      onChange={(event) => {
        setCountry(event.currentTarget.value as Country);
      }}
    >
      <option value="kr">South Korea</option>
      <option value="us">United States</option>
      <option value="jp">Japan</option>
    </select>
  );
}
```

Select의 선택 상태는 부모 `<select>` 요소의 `value`를 통해 관리합니다.

개별 `<option>`에 `selected`를 지정하지 않습니다.

### 4.5. Multiple Select

`multiple` 속성을 사용하면 여러 항목을 선택할 수 있습니다.

이 경우 `value`에는 문자열 배열을 전달합니다.

```tsx
function TechnologySelect() {
  const [technologies, setTechnologies] = useState<string[]>([
    "react",
    "typescript",
  ]);

  return (
    <select
      multiple
      value={technologies}
      onChange={(event) => {
        const selectedValues = Array.from(
          event.currentTarget.selectedOptions,
          (option) => option.value
        );

        setTechnologies(selectedValues);
      }}
    >
      <option value="react">React</option>
      <option value="typescript">TypeScript</option>
      <option value="vue">Vue</option>
      <option value="angular">Angular</option>
    </select>
  );
}
```

`selectedOptions`는 현재 선택된 Option 요소들의 컬렉션입니다.

`Array.from()`을 사용하여 해당 컬렉션을 배열로 변환하고 State에 저장할 수 있습니다.

### 4.6. Checkbox

Checkbox는 선택 여부를 Boolean State로 관리합니다.

```tsx
function AgreementCheckbox() {
  const [agreed, setAgreed] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={agreed}
        onChange={(event) => {
          setAgreed(event.currentTarget.checked);
        }}
      />

      Agree to the terms.
    </label>
  );
}
```

Checkbox에서는 `event.currentTarget.value`가 아니라 `event.currentTarget.checked`를 사용해야 합니다.

여러 개의 Checkbox를 관리하는 경우에는 배열이나 객체를 활용할 수 있습니다.

```tsx
type Preferences = {
  email: boolean;
  sms: boolean;
  push: boolean;
};

function NotificationForm() {
  const [preferences, setPreferences] = useState<Preferences>({
    email: false,
    sms: false,
    push: false,
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, checked } = event.currentTarget;

    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  return (
    <form>
      <label>
        <input
          type="checkbox"
          name="email"
          checked={preferences.email}
          onChange={handleChange}
        />
        Email
      </label>

      <label>
        <input
          type="checkbox"
          name="sms"
          checked={preferences.sms}
          onChange={handleChange}
        />
        SMS
      </label>

      <label>
        <input
          type="checkbox"
          name="push"
          checked={preferences.push}
          onChange={handleChange}
        />
        Push
      </label>
    </form>
  );
}
```

`name` 속성을 활용하면 하나의 이벤트 핸들러에서 여러 Checkbox의 상태를 처리할 수 있습니다.

### 4.7. Radio

Radio는 동일한 그룹에서 하나의 항목만 선택할 수 있는 입력 요소입니다.

```tsx
type Gender = "male" | "female";

function GenderSelect() {
  const [gender, setGender] = useState<Gender>("male");

  return (
    <div>
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={gender === "male"}
          onChange={(event) => {
            setGender(event.currentTarget.value as Gender);
          }}
        />
        Male
      </label>

      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={gender === "female"}
          onChange={(event) => {
            setGender(event.currentTarget.value as Gender);
          }}
        />
        Female
      </label>
    </div>
  );
}
```

Radio 그룹에서는 각 항목의 `value`와 현재 State를 비교하여 `checked`를 결정합니다.

```tsx
checked={gender === "male"}
```

이 구조를 통해 Radio 그룹 전체의 선택 상태를 하나의 State로 관리할 수 있습니다.

## 5. 여러 입력 요소의 상태 관리

실제 폼에서는 여러 입력 요소를 하나의 컴포넌트에서 관리하는 경우가 많습니다.

입력 요소마다 별도의 State를 선언할 수도 있지만, 입력 필드가 많아지면 객체 형태로 상태를 통합하는 방법이 유용합니다.

### 5.1. 개별 State 관리

```tsx
function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
      <input
        value={username}
        onChange={(event) => {
          setUsername(event.currentTarget.value);
        }}
      />

      <input
        value={email}
        onChange={(event) => {
          setEmail(event.currentTarget.value);
        }}
      />

      <input
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.currentTarget.value);
        }}
      />
    </form>
  );
}
```

각 입력 요소의 상태가 독립적으로 관리된다는 장점이 있습니다.

반면 입력 필드가 많아지면 State 선언과 이벤트 핸들러가 반복될 수 있습니다.

### 5.2. 객체 형태의 State 관리

여러 입력값을 하나의 객체로 관리할 수도 있습니다.

```tsx
import { useState } from "react";

type SignupFormData = {
  username: string;
  email: string;
  password: string;
};

function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form>
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
    </form>
  );
}
```

이 방식에서는 `name` 속성과 객체의 속성명을 일치시켜 하나의 이벤트 핸들러로 여러 입력 요소를 처리할 수 있습니다.

객체의 일부 속성만 변경할 때는 Spread Syntax를 사용하여 기존 상태를 복사해야 합니다.

React State의 객체와 배열은 직접 변경하지 않고 새로운 객체나 배열을 생성하여 업데이트해야 합니다.

### 5.3. Functional State Update

이전 State를 기반으로 새로운 State를 계산할 때는 Functional Update 방식을 사용하는 것이 좋습니다.

```tsx
setFormData((prev) => ({
  ...prev,
  username: "react-user",
}));
```

State Setter에 함수를 전달하면 React가 이전 State를 인자로 제공하며, 해당 값을 기반으로 새로운 State를 계산할 수 있습니다.

이는 이벤트 핸들러가 이전 렌더링의 State 값을 참조하는 상황에서도 안전하게 상태를 업데이트하는 데 유용합니다.

## 6. Controlled Forms와 Form Submission

Controlled Forms에서는 입력값이 React State에 저장되므로 폼 제출 시 State를 직접 활용할 수 있습니다.

```tsx
import { useState } from "react";

type LoginFormData = {
  email: string;
  password: string;
};

function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.currentTarget;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    console.log(formData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

`event.preventDefault()`는 브라우저의 기본 폼 제출 동작을 방지합니다.

이후 React State에 저장된 입력값을 활용하여 API 요청이나 추가 검증을 수행할 수 있습니다.

단, `setState()`를 호출한 직후 동일한 이벤트 핸들러에서 State 변수를 읽으면 아직 이전 렌더링의 값을 참조할 수 있습니다.

현재 입력값을 제출하려는 경우에는 이미 State에 반영된 값을 사용하거나, 이벤트에서 수집한 값을 직접 활용하는 방식으로 처리해야 합니다.

자세한 제출 처리 방식은 `form-submission.md`에서 다룹니다.

## 7. 입력값 검증과 동적 UI

Controlled Forms는 입력값이 변경될 때마다 React State가 갱신되므로 입력값을 기반으로 UI를 동적으로 구성하기 쉽습니다.

### 7.1. 실시간 입력값 검증

```tsx
function UsernameForm() {
  const [username, setUsername] = useState("");

  const isValid = username.length >= 3;

  return (
    <div>
      <input
        value={username}
        onChange={(event) => {
          setUsername(event.currentTarget.value);
        }}
      />

      {!isValid && (
        <p>
          Username must contain at least 3 characters.
        </p>
      )}

      {isValid && (
        <p>
          Username is valid.
        </p>
      )}
    </div>
  );
}
```

입력값이 변경되면 State가 업데이트되고, 해당 State를 기반으로 검증 결과가 다시 계산됩니다.

이러한 방식으로 실시간 검증 메시지나 입력 상태에 따른 UI를 구현할 수 있습니다.

### 7.2. Derived State 활용

입력값으로부터 계산할 수 있는 값은 별도의 State로 관리하지 않고 기존 State를 기반으로 계산할 수 있습니다.

```tsx
function PriceForm() {
  const [price, setPrice] = useState("1000");
  const [quantity, setQuantity] = useState("2");

  const totalPrice =
    Number(price || 0) * Number(quantity || 0);

  return (
    <div>
      <input
        type="number"
        value={price}
        onChange={(event) => {
          setPrice(event.currentTarget.value);
        }}
      />

      <input
        type="number"
        value={quantity}
        onChange={(event) => {
          setQuantity(event.currentTarget.value);
        }}
      />

      <p>Total: {totalPrice}</p>
    </div>
  );
}
```

`totalPrice`는 `price`와 `quantity`로부터 계산할 수 있으므로 별도의 State로 관리할 필요가 없습니다.

이를 Derived State라고 하며, 불필요한 State 중복을 방지하는 데 도움이 됩니다.

## 8. Controlled Forms의 주의사항

### 8.1. onChange에서 동기적으로 State 업데이트

Controlled Input은 `onChange`에서 입력값을 동기적으로 State에 반영해야 합니다.

```tsx
// 잘못된 예시
function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setTimeout(() => {
    setUsername(event.currentTarget.value);
  }, 100);
}
```

비동기적으로 State를 업데이트하면 React가 입력값을 즉시 반영하지 못하여 입력 커서가 이동하거나 입력값이 되돌아가는 문제가 발생할 수 있습니다.

올바른 방식은 다음과 같습니다.

```tsx
function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setUsername(event.currentTarget.value);
}
```

입력값은 먼저 동기적으로 State에 반영하고, 별도의 비동기 작업은 State 업데이트 이후에 처리하는 것이 좋습니다.

### 8.2. Controlled와 Uncontrolled 방식 혼용 금지

입력 요소는 생명주기 동안 Controlled 또는 Uncontrolled 중 하나의 방식으로 일관되게 관리해야 합니다.

다음과 같은 코드는 문제가 발생할 수 있습니다.

```tsx
const [username, setUsername] = useState<string | undefined>(
  undefined
);

<input
  value={username}
  onChange={(event) => {
    setUsername(event.currentTarget.value);
  }}
/>
```

초기에는 `undefined`가 전달되어 Uncontrolled로 취급될 수 있지만, 이후 문자열이 전달되면 Controlled로 전환됩니다.

이러한 전환은 React에서 경고를 발생시킵니다.

초기값을 빈 문자열로 지정하면 문제를 방지할 수 있습니다.

```tsx
const [username, setUsername] = useState("");

<input
  value={username}
  onChange={(event) => {
    setUsername(event.currentTarget.value);
  }}
/>
```

외부 데이터가 `null` 또는 `undefined`일 수 있다면 다음과 같이 기본값을 지정할 수도 있습니다.

```tsx
<input
  value={username ?? ""}
  onChange={(event) => {
    setUsername(event.currentTarget.value);
  }}
/>
```

Checkbox와 Radio의 경우 `checked`에 항상 Boolean 값을 전달해야 합니다.

### 8.3. 입력값을 임의로 변환하는 경우

`onChange`에서 입력값을 즉시 변환하여 State에 저장하면 입력 커서 위치가 변경되거나 사용자가 입력하는 과정에서 의도하지 않은 동작이 발생할 수 있습니다.

```tsx
// 주의가 필요한 예시
function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setUsername(event.currentTarget.value.toUpperCase());
}
```

사용자가 입력한 값과 State에 저장되는 값이 다르기 때문에 입력 커서 및 IME 조합 입력 과정에서 문제가 발생할 수 있습니다.

일반적으로 입력값은 원본 그대로 동기적으로 저장하고, 화면 표시나 제출 단계에서 별도로 변환하는 방식이 안전합니다.

```tsx
function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  setUsername(event.currentTarget.value);
}

const normalizedUsername = username.toUpperCase();
```

### 8.4. 불필요한 리렌더링

Controlled Input은 입력할 때마다 State가 변경되므로 해당 State를 소유한 컴포넌트가 다시 렌더링됩니다.

폼의 State가 상위 컴포넌트에 위치하고 해당 컴포넌트가 큰 UI 트리를 포함한다면 입력할 때마다 불필요한 렌더링이 발생할 수 있습니다.

이를 개선하는 방법은 다음과 같습니다.

- 폼 상태를 실제로 사용하는 컴포넌트 가까이에 배치합니다.
- 독립적인 폼 컴포넌트로 분리합니다.
- 입력 상태와 무관한 무거운 UI를 적절히 분리합니다.
- 필요한 경우 `memo`, `useMemo`, `useDeferredValue` 등을 활용합니다.

Controlled Forms 자체가 비효율적인 방식이라는 의미는 아닙니다. 실제 렌더링 비용을 측정하고 필요한 부분을 최적화해야 합니다.

### 8.5. File Input의 예외

`<input type="file">`은 일반적인 Controlled Input과 다르게 취급됩니다.

브라우저의 보안 정책에 따라 JavaScript가 파일 선택 요소의 값을 임의로 설정할 수 없으므로 일반적인 `value` 방식으로 파일 선택 상태를 제어할 수 없습니다.

파일 정보는 `files` 속성을 통해 접근합니다.

```tsx
function FileInput() {
  const [fileName, setFileName] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.currentTarget.files?.[0];

    setFileName(file?.name ?? "");
  }

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
      />

      <p>{fileName}</p>
    </div>
  );
}
```

이 예제에서는 파일 자체의 선택 상태를 `value`로 제어하지 않고, 선택된 파일의 이름만 React State에 저장합니다.

파일 선택 요소를 초기화하려면 일반적으로 DOM 요소의 값을 빈 문자열로 설정하거나 요소를 다시 생성하는 방식을 사용합니다.

## 9. Controlled Forms와 Uncontrolled Forms 비교

React에서 폼 입력값을 관리하는 대표적인 방식은 Controlled와 Uncontrolled 두 가지입니다.

| 구분 | Controlled Forms | Uncontrolled Forms |
|---|---|---|
| 상태 관리 주체 | React State | DOM |
| 현재 입력값 접근 | React State | DOM Ref 또는 FormData |
| 주요 Props | `value`, `checked` | `defaultValue`, `defaultChecked` |
| 이벤트 처리 | 일반적으로 `onChange` 사용 | 필요에 따라 사용 |
| 입력값 변경 | State 업데이트를 통해 반영 | DOM이 자체적으로 관리 |
| 실시간 검증 | 구현하기 용이 | 별도의 DOM 접근 등이 필요할 수 있음 |
| 동적 UI | State 기반으로 구현하기 용이 | 추가적인 상태 관리가 필요할 수 있음 |
| 렌더링 | 입력 변경 시 State를 소유한 컴포넌트 리렌더링 | 입력 자체의 변경만으로 React State가 갱신되지는 않음 |

### 9.1. Controlled Forms를 사용하는 경우

다음과 같은 상황에서는 Controlled Forms가 적합합니다.

- 입력값에 따라 UI를 실시간으로 변경해야 하는 경우
- 입력값을 기반으로 실시간 검증을 수행해야 하는 경우
- 다른 컴포넌트와 입력 상태를 공유해야 하는 경우
- 외부 이벤트를 통해 입력값을 변경해야 하는 경우
- 입력값을 정규화하거나 제한해야 하는 경우

### 9.2. Uncontrolled Forms를 사용하는 경우

다음과 같은 상황에서는 Uncontrolled Forms가 적합할 수 있습니다.

- 입력값을 실시간으로 추적할 필요가 없는 경우
- 폼 제출 시점에만 입력값을 수집하는 경우
- 간단한 HTML Form을 구성하는 경우
- 입력할 때마다 React State를 업데이트할 필요가 없는 경우

두 방식 중 어느 하나가 항상 우수한 것은 아닙니다. 입력값을 React에서 지속적으로 관리해야 하는지에 따라 적절한 방식을 선택해야 합니다.

## 10. 정리

Controlled Forms는 React State를 통해 폼 입력 요소의 현재 값을 관리하는 방식입니다.

사용자 입력은 `onChange` 이벤트를 통해 React에 전달되며, State 업데이트 이후 변경된 값이 `value` 또는 `checked`를 통해 입력 요소에 반영됩니다.

주요 개념은 다음과 같습니다.

- Controlled Component는 React State를 입력값의 기준점으로 사용합니다.
- `value`는 텍스트 기반 입력 요소의 현재 값을 제어합니다.
- `checked`는 Checkbox와 Radio의 선택 상태를 제어합니다.
- `onChange`는 사용자 입력을 State에 반영하는 역할을 수행합니다.
- 여러 입력값은 개별 State 또는 객체 형태의 State로 관리할 수 있습니다.
- 입력값을 기반으로 실시간 검증 및 동적 UI를 구현할 수 있습니다.
- Controlled Input은 `onChange`에서 State를 동기적으로 업데이트해야 합니다.
- 입력 요소는 생명주기 동안 Controlled와 Uncontrolled 방식을 전환해서는 안 됩니다.
- File Input은 브라우저 보안 정책으로 인해 일반적인 Controlled Input과 다르게 처리해야 합니다.
- 입력 변경에 따른 리렌더링 비용은 State 위치 조정과 컴포넌트 분리 등을 통해 최적화할 수 있습니다.

Controlled Forms는 입력값과 UI의 관계를 React State 중심으로 명확하게 관리할 수 있다는 점에서 복잡한 사용자 입력 및 상호작용을 구현하는 데 유용합니다.

## 11. 참고자료

### React 공식 문서

- [React - `<input>`](https://react.dev/reference/react-dom/components/input)
- [React - `<textarea>`](https://react.dev/reference/react-dom/components/textarea)
- [React - `<select>`](https://react.dev/reference/react-dom/components/select)
- [React - `<form>`](https://react.dev/reference/react-dom/components/form)
- [React - Managing State](https://react.dev/learn/managing-state)
- [React - Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React - Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [React - You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### TypeScript 공식 문서

- [TypeScript - React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### MDN Web Docs

- [HTML Forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms)
- [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
- [HTMLSelectElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement)
- [HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)