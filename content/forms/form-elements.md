# Form Elements

## 1. 개요

Form Elements는 사용자로부터 데이터를 입력받고, 입력된 데이터를 수집하거나 제출하기 위해 사용하는 HTML 요소입니다.

React에서는 브라우저에 내장된 HTML Form Elements를 JSX를 통해 사용할 수 있으며, React의 상태 관리 및 이벤트 처리 기능과 결합하여 사용자 입력을 관리할 수 있습니다.

대표적인 Form Elements는 다음과 같습니다.

| 요소 | 설명 |
|---|---|
| `<form>` | 사용자 입력을 그룹화하고 데이터를 제출하는 컨테이너입니다. |
| `<input>` | 다양한 형태의 단일 입력 필드를 제공합니다. |
| `<textarea>` | 여러 줄의 텍스트를 입력받습니다. |
| `<select>` | 미리 정의된 선택 항목을 제공합니다. |
| `<option>` | Select 요소에서 선택 가능한 항목을 정의합니다. |
| `<button>` | 폼 제출 및 기타 사용자 동작을 수행합니다. |
| `<label>` | 입력 요소의 설명 및 접근 가능한 이름을 제공합니다. |
| `<fieldset>` | 관련 입력 요소들을 논리적으로 그룹화합니다. |
| `<legend>` | Fieldset 그룹의 제목을 정의합니다. |

React는 이러한 HTML 요소의 기본 동작을 지원하면서 `value`, `defaultValue`, `checked`, `defaultChecked` 등의 Props를 통해 입력값을 관리할 수 있도록 확장된 기능을 제공합니다.

## 2. Form Elements의 기본 구조

HTML Form은 일반적으로 `<form>` 요소 내부에 입력 요소와 제출 버튼을 배치하는 구조로 구성됩니다.

```tsx
function UserForm() {
  return (
    <form>
      <label htmlFor="username">
        Username
      </label>

      <input
        id="username"
        name="username"
        type="text"
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

각 요소의 역할은 다음과 같습니다.

- `form`: 입력 요소들을 그룹화하고 제출 동작을 관리합니다.
- `label`: 입력 요소의 목적을 설명합니다.
- `input`: 사용자 입력을 받습니다.
- `button`: 폼 제출을 실행합니다.
- `name`: 폼 데이터를 식별하는 키로 사용됩니다.
- `id`: HTML 요소를 식별하며 Label과 입력 요소를 연결하는 데 사용됩니다.

### 2.1. name 속성

`name`은 폼 제출 시 입력값을 식별하는 데 사용되는 속성입니다.

브라우저의 FormData API는 `name`이 지정된 폼 컨트롤을 기준으로 입력 데이터를 수집합니다.

```tsx
function UserForm() {
  return (
    <form>
      <input
        name="username"
        type="text"
        defaultValue="react-user"
      />

      <input
        name="email"
        type="email"
        defaultValue="user@example.com"
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

폼 데이터를 수집하면 다음과 같은 구조로 접근할 수 있습니다.

```tsx
const formData = new FormData(formElement);

const username = formData.get("username");
const email = formData.get("email");
```

`name`이 없는 입력 요소는 일반적인 폼 데이터 수집 대상에 포함되지 않습니다.

다만 `name`은 React의 상태 관리 자체를 위한 속성이 아니라 HTML 폼 데이터 전송을 위한 속성입니다.

## 3. Input

`<input>`은 다양한 형태의 사용자 입력을 처리하는 HTML 요소입니다.

`type` 속성에 따라 텍스트, 숫자, 이메일, 비밀번호, 체크박스, 라디오 버튼 등의 입력 방식을 제공합니다.

### 3.1. 주요 Input Type

| Type | 설명 |
|---|---|
| `text` | 일반 텍스트 입력 |
| `password` | 비밀번호 입력 |
| `email` | 이메일 주소 입력 |
| `number` | 숫자 입력 |
| `tel` | 전화번호 입력 |
| `url` | URL 입력 |
| `search` | 검색어 입력 |
| `date` | 날짜 입력 |
| `datetime-local` | 날짜 및 시간 입력 |
| `time` | 시간 입력 |
| `checkbox` | 복수 선택이 가능한 체크박스 |
| `radio` | 그룹 내 단일 선택 |
| `file` | 파일 선택 |
| `hidden` | 사용자에게 표시되지 않는 입력값 |
| `submit` | 폼 제출 버튼 |
| `reset` | 폼 입력값 초기화 |

### 3.2. 기본 사용법

```tsx
function ProfileForm() {
  return (
    <form>
      <input
        type="text"
        name="username"
        placeholder="Enter username"
      />

      <input
        type="email"
        name="email"
        placeholder="Enter email"
      />

      <input
        type="password"
        name="password"
        placeholder="Enter password"
      />

      <input
        type="number"
        name="age"
        min={1}
        max={100}
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

HTML의 기본 입력 검증 기능을 활용하면 별도의 JavaScript 검증 로직 없이도 일부 입력값을 제한할 수 있습니다.

대표적인 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `required` | 필수 입력 여부를 지정합니다. |
| `min` | 최소 입력값을 지정합니다. |
| `max` | 최대 입력값을 지정합니다. |
| `minLength` | 최소 문자열 길이를 지정합니다. |
| `maxLength` | 최대 문자열 길이를 지정합니다. |
| `pattern` | 정규표현식 기반 입력 조건을 지정합니다. |
| `placeholder` | 입력 전 안내 문구를 표시합니다. |
| `readOnly` | 입력값을 읽기 전용으로 설정합니다. |
| `disabled` | 입력 요소를 비활성화합니다. |

### 3.3. Checkbox

Checkbox는 여러 선택 항목 중 하나 이상을 선택할 수 있는 입력 요소입니다.

React에서는 `checked`와 `defaultChecked`를 사용하여 선택 상태를 관리합니다.

```tsx
function AgreementForm() {
  return (
    <form>
      <label>
        <input
          type="checkbox"
          name="terms"
          value="agree"
          required
        />
        I agree to the terms.
      </label>

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

Checkbox의 주요 특징은 다음과 같습니다.

- `checked`: 현재 선택 상태를 지정합니다.
- `defaultChecked`: 최초 렌더링 시 기본 선택 상태를 지정합니다.
- `value`: 선택된 경우 FormData에 포함될 값을 지정합니다.
- `name`: 체크박스 그룹의 데이터 식별자를 지정합니다.

Checkbox는 텍스트 입력과 달리 `value`가 선택 여부를 의미하지 않습니다. 선택 여부는 `checked`로 관리합니다.

### 3.4. Radio

Radio는 동일한 그룹에서 하나의 항목만 선택할 수 있는 입력 요소입니다.

일반적으로 동일한 `name`을 가진 Radio 요소들을 하나의 그룹으로 구성합니다.

```tsx
function GenderForm() {
  return (
    <form>
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
        />
        Male
      </label>

      <label>
        <input
          type="radio"
          name="gender"
          value="female"
        />
        Female
      </label>

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

동일한 `name`을 가진 Radio 요소 중 하나를 선택하면 기존 선택 항목은 자동으로 해제됩니다.

Checkbox와 Radio 모두 선택 상태는 `checked`를 통해 관리하지만, Radio는 그룹 내 단일 선택이라는 차이가 있습니다.

## 4. Textarea

`<textarea>`는 여러 줄의 텍스트를 입력받기 위한 요소입니다.

일반적인 텍스트 입력을 위한 `<input type="text">`와 달리 여러 줄의 내용을 입력하고 편집할 수 있습니다.

```tsx
function CommentForm() {
  return (
    <form>
      <label htmlFor="comment">
        Comment
      </label>

      <textarea
        id="comment"
        name="comment"
        rows={5}
        cols={40}
        placeholder="Enter your comment"
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

주요 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `rows` | 기본 표시 행 수를 지정합니다. |
| `cols` | 기본 표시 열 수를 지정합니다. |
| `placeholder` | 입력 전 안내 문구를 표시합니다. |
| `maxLength` | 최대 입력 문자열 길이를 지정합니다. |
| `minLength` | 최소 입력 문자열 길이를 지정합니다. |
| `readOnly` | 읽기 전용 상태를 지정합니다. |
| `required` | 필수 입력 여부를 지정합니다. |

HTML에서는 Textarea의 초기값을 자식 텍스트로 지정하지만, React에서는 `defaultValue`를 사용하는 방식을 권장합니다.

```tsx
<textarea
  name="description"
  defaultValue="Initial description"
/>
```

React의 Textarea는 `value`를 전달하면 Controlled Component로 동작하며, `defaultValue`를 전달하면 Uncontrolled Component로 동작합니다.

또한 `<textarea>`에는 일반적인 HTML 자식 텍스트를 전달하는 대신 `defaultValue` 또는 `value`를 사용해야 합니다.

## 5. Select와 Option

`<select>`는 미리 정의된 선택 항목 중 하나 또는 여러 항목을 선택할 수 있도록 하는 요소입니다.

각 선택 항목은 `<option>`으로 정의합니다.

### 5.1. 기본 사용법

```tsx
function CountryForm() {
  return (
    <form>
      <label htmlFor="country">
        Country
      </label>

      <select
        id="country"
        name="country"
        defaultValue="kr"
      >
        <option value="kr">
          South Korea
        </option>

        <option value="us">
          United States
        </option>

        <option value="jp">
          Japan
        </option>
      </select>

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

주요 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `value` | 현재 선택된 항목을 지정합니다. |
| `defaultValue` | 최초 선택 항목을 지정합니다. |
| `multiple` | 복수 항목 선택을 허용합니다. |
| `disabled` | 선택 요소를 비활성화합니다. |
| `required` | 필수 선택 여부를 지정합니다. |
| `name` | 폼 데이터에서 사용할 식별자를 지정합니다. |

### 5.2. Multiple Select

`multiple` 속성을 사용하면 여러 항목을 동시에 선택할 수 있습니다.

```tsx
function TechnologyForm() {
  return (
    <form>
      <select
        name="technologies"
        multiple
        defaultValue={["react", "typescript"]}
      >
        <option value="react">
          React
        </option>

        <option value="typescript">
          TypeScript
        </option>

        <option value="vue">
          Vue
        </option>
      </select>

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

React에서 Multiple Select를 Controlled 방식으로 관리할 경우 `value`에는 문자열 배열을 전달해야 합니다.

```tsx
<select
  multiple
  value={selectedTechnologies}
  onChange={handleChange}
>
  {/* options */}
</select>
```

이때 `selectedTechnologies`는 `string[]` 타입으로 관리할 수 있습니다.

### 5.3. React에서 Option 선택 관리

HTML에서는 `<option>` 요소에 `selected` 속성을 지정할 수 있지만, React에서는 부모 `<select>` 요소의 `value` 또는 `defaultValue`를 통해 선택 상태를 관리하는 방식을 사용합니다.

```tsx
<select
  name="framework"
  defaultValue="react"
>
  <option value="react">
    React
  </option>

  <option value="vue">
    Vue
  </option>
</select>
```

이를 통해 선택 상태를 부모 요소에서 일관되게 관리할 수 있습니다.

## 6. Button

`<button>`은 사용자 입력을 제출하거나 특정 동작을 실행하기 위한 요소입니다.

React에서도 HTML Button의 기본 동작을 지원하며, `type` 속성으로 동작을 구분합니다.

| Type | 설명 |
|---|---|
| `submit` | 연결된 폼을 제출합니다. |
| `reset` | 연결된 폼의 입력값을 초기 상태로 되돌립니다. |
| `button` | 기본 폼 동작 없이 일반 버튼으로 사용합니다. |

```tsx
function ActionForm() {
  return (
    <form>
      <input
        type="text"
        name="username"
      />

      <button type="submit">
        Submit
      </button>

      <button type="reset">
        Reset
      </button>

      <button type="button">
        Cancel
      </button>
    </form>
  );
}
```

폼 내부의 Button은 `type`을 명시하지 않으면 기본적으로 제출 버튼으로 동작합니다.

따라서 제출 목적이 아닌 버튼에는 `type="button"`을 명시하는 것이 좋습니다.

## 7. Label과 Fieldset

### 7.1. Label

`<label>`은 입력 요소의 목적을 설명하고 접근성을 개선하는 요소입니다.

`htmlFor` 속성으로 입력 요소의 `id`와 연결할 수 있습니다.

```tsx
function EmailField() {
  return (
    <>
      <label htmlFor="email">
        Email Address
      </label>

      <input
        id="email"
        name="email"
        type="email"
      />
    </>
  );
}
```

Label을 입력 요소와 연결하면 Label 영역을 클릭했을 때 해당 입력 요소가 활성화됩니다.

React에서는 HTML의 `for` 속성 대신 `htmlFor`를 사용합니다.

또한 다음과 같이 입력 요소를 Label 내부에 배치하는 방식도 사용할 수 있습니다.

```tsx
<label>
  Email Address
  <input
    name="email"
    type="email"
  />
</label>
```

### 7.2. Fieldset과 Legend

`<fieldset>`은 관련된 폼 입력 요소들을 하나의 그룹으로 묶는 데 사용합니다.

`<legend>`는 해당 그룹의 제목을 정의합니다.

```tsx
function NotificationForm() {
  return (
    <form>
      <fieldset>
        <legend>
          Notification Preferences
        </legend>

        <label>
          <input
            type="checkbox"
            name="emailNotification"
          />
          Email
        </label>

        <label>
          <input
            type="checkbox"
            name="smsNotification"
          />
          SMS
        </label>
      </fieldset>

      <button type="submit">
        Save
      </button>
    </form>
  );
}
```

Fieldset과 Legend를 활용하면 관련 입력 요소의 의미적 관계를 명확하게 표현할 수 있으며, 보조 기술을 사용하는 사용자에게도 입력 그룹의 목적을 전달할 수 있습니다.

## 8. React Form Elements의 주요 특징

React의 Form Elements는 기본 HTML 동작을 유지하면서 React의 상태 및 이벤트 시스템과 통합됩니다.

대표적인 특징은 다음과 같습니다.

### 8.1. Controlled와 Uncontrolled 입력 지원

React는 `value`, `checked`를 사용하여 입력 요소의 현재 상태를 React State와 연결할 수 있습니다.

반면 `defaultValue`, `defaultChecked`를 사용하면 초기값만 지정하고 이후 입력값은 DOM에서 관리하도록 할 수 있습니다.

이러한 두 가지 방식은 각각 Controlled Component와 Uncontrolled Component라고 합니다.

자세한 내용은 [Controlled Forms](./controlled-forms) 및 [Uncontrolled Components](../components/uncontrolled-components) 문서를 참고하세요.

### 8.2. HTML 기본 입력 검증 지원

React의 Form Elements는 브라우저에서 제공하는 HTML Constraint Validation 기능을 지원합니다.

```tsx
function RegistrationForm() {
  return (
    <form>
      <input
        type="email"
        name="email"
        required
      />

      <input
        type="password"
        name="password"
        minLength={8}
        required
      />

      <button type="submit">
        Register
      </button>
    </form>
  );
}
```

브라우저는 제출 시 `required`, `minLength`, `type="email"` 등의 조건을 검사하고 조건을 충족하지 못하면 기본 검증 동작을 수행합니다.

다만 클라이언트 측 검증은 사용자 편의를 위한 기능이며, 서버에서도 입력값을 검증해야 합니다.

### 8.3. FormData API와의 통합

React의 Form Elements는 브라우저의 FormData API와 함께 사용할 수 있습니다.

```tsx
function SearchForm() {
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const formData = new FormData(
      event.currentTarget
    );

    const query = formData.get("query");

    console.log(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="query"
      />

      <button type="submit">
        Search
      </button>
    </form>
  );
}
```

FormData는 폼 내부의 제출 가능한 입력 요소에서 데이터를 수집하는 브라우저 API입니다.

수집된 데이터는 `get()`, `getAll()`, `entries()` 등의 메서드를 통해 접근할 수 있습니다.

React 19에서는 `<form action>`에 함수를 전달하는 방식도 지원합니다. 이 경우 React가 FormData를 Action 함수에 전달하며, 비동기 제출 처리 및 Pending 상태 관리와 결합할 수 있습니다.

자세한 내용은 [Form Submission](./form-submission) 문서를 참고하세요.

## 9. TypeScript와 Form Elements

React + TypeScript 환경에서는 Form Elements의 이벤트와 상태에 적절한 타입을 지정하는 것이 중요합니다.

### 9.1. Input 이벤트 타입

Input의 `onChange` 이벤트에는 일반적으로 `React.ChangeEvent<HTMLInputElement>`를 사용합니다.

```tsx
import { useState } from "react";

function UsernameInput() {
  const [username, setUsername] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setUsername(event.currentTarget.value);
  }

  return (
    <input
      type="text"
      value={username}
      onChange={handleChange}
    />
  );
}
```

### 9.2. Textarea 이벤트 타입

Textarea의 이벤트에는 `React.ChangeEvent<HTMLTextAreaElement>`를 사용합니다.

```tsx
import { useState } from "react";

function CommentInput() {
  const [comment, setComment] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setComment(event.currentTarget.value);
  }

  return (
    <textarea
      value={comment}
      onChange={handleChange}
    />
  );
}
```

### 9.3. Select 이벤트 타입

Select의 이벤트에는 `React.ChangeEvent<HTMLSelectElement>`를 사용합니다.

```tsx
import { useState } from "react";

function CountrySelect() {
  const [country, setCountry] = useState("kr");

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setCountry(event.currentTarget.value);
  }

  return (
    <select
      value={country}
      onChange={handleChange}
    >
      <option value="kr">South Korea</option>
      <option value="us">United States</option>
      <option value="jp">Japan</option>
    </select>
  );
}
```

### 9.4. Checkbox 이벤트 타입

Checkbox의 이벤트에는 `React.ChangeEvent<HTMLInputElement>`를 사용합니다.

선택 여부는 `event.currentTarget.checked`를 통해 가져옵니다.

```tsx
import { useState } from "react";

function AgreementCheckbox() {
  const [agreed, setAgreed] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setAgreed(event.currentTarget.checked);
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={agreed}
        onChange={handleChange}
      />
      Agree to terms
    </label>
  );
}
```

### 9.5. 주요 이벤트 타입 정리

| 요소 | 이벤트 타입 | 입력값 접근 |
|---|---|---|
| Input | `ChangeEvent<HTMLInputElement>` | `currentTarget.value` |
| Checkbox | `ChangeEvent<HTMLInputElement>` | `currentTarget.checked` |
| Radio | `ChangeEvent<HTMLInputElement>` | `currentTarget.value` |
| Textarea | `ChangeEvent<HTMLTextAreaElement>` | `currentTarget.value` |
| Select | `ChangeEvent<HTMLSelectElement>` | `currentTarget.value` |
| Form | `FormEvent<HTMLFormElement>` | `currentTarget` |

TypeScript는 HTML 요소별 타입을 제공하므로 이벤트 대상의 속성에 안전하게 접근할 수 있습니다.

## 10. 주의사항

React에서 Form Elements를 사용할 때 다음 사항을 고려해야 합니다.

### 10.1. Controlled와 Uncontrolled 방식 혼용 금지

하나의 입력 요소를 Controlled 방식과 Uncontrolled 방식으로 혼용해서는 안 됩니다.

예를 들어 초기에는 `undefined`를 전달하고 이후 문자열을 전달하면 입력 요소가 Uncontrolled에서 Controlled로 전환될 수 있습니다.

```tsx
// 잘못된 예시
const [value, setValue] = useState<string | undefined>(
  undefined
);

<input
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>
```

Controlled 입력 요소는 초기 상태부터 일관된 값을 유지해야 합니다.

```tsx
// 올바른 예시
const [value, setValue] = useState("");

<input
  value={value}
  onChange={(event) => setValue(event.target.value)}
/>
```

### 10.2. Checkbox는 value와 checked를 구분

Checkbox에서 `value`는 제출될 값을 의미하고 `checked`는 선택 상태를 의미합니다.

```tsx
<input
  type="checkbox"
  name="terms"
  value="agree"
  checked={agreed}
  onChange={handleChange}
/>
```

두 속성은 서로 다른 역할을 수행하므로 혼동하지 않아야 합니다.

### 10.3. Select의 선택 상태는 부모 요소에서 관리

React에서는 개별 `<option>`의 `selected` 속성 대신 부모 `<select>`의 `value` 또는 `defaultValue`를 사용합니다.

### 10.4. Button의 type 명시

폼 내부의 Button은 기본적으로 제출 버튼으로 동작할 수 있습니다.

제출 목적이 아닌 버튼에는 `type="button"`을 명시해야 의도하지 않은 폼 제출을 방지할 수 있습니다.

### 10.5. Form 요소의 접근성 고려

입력 요소에는 적절한 Label을 연결하고, 필수 입력 여부와 오류 메시지를 명확하게 전달해야 합니다.

또한 단순히 Placeholder만으로 입력 요소의 목적을 설명하는 방식은 피하는 것이 좋습니다.

### 10.6. 클라이언트 검증과 서버 검증 구분

HTML의 기본 검증 및 React의 입력 검증 로직은 사용자 경험을 개선하기 위한 수단입니다.

클라이언트에서 전달된 데이터는 조작될 수 있으므로 서버에서도 데이터 형식, 필수값, 권한 및 비즈니스 규칙을 검증해야 합니다.

## 11. 정리

React의 Form Elements는 HTML에서 제공하는 기본 입력 요소를 React 컴포넌트 환경에서 사용하는 기능입니다.

`<input>`, `<textarea>`, `<select>` 등의 요소를 통해 다양한 사용자 입력을 처리할 수 있으며, `value`, `defaultValue`, `checked`, `defaultChecked` 등의 속성을 통해 입력 상태를 관리할 수 있습니다.

주요 개념은 다음과 같습니다.

- Form Elements는 브라우저의 기본 HTML 입력 요소를 기반으로 동작합니다.
- `name`은 FormData에서 입력 데이터를 식별하는 데 사용됩니다.
- `value`와 `checked`는 Controlled 입력 요소의 현재 상태를 지정합니다.
- `defaultValue`와 `defaultChecked`는 Uncontrolled 입력 요소의 초기 상태를 지정합니다.
- Checkbox는 `checked`를 통해 선택 여부를 관리합니다.
- Select는 부모 요소의 `value` 또는 `defaultValue`를 통해 선택 항목을 관리합니다.
- TypeScript에서는 HTML 요소별 이벤트 타입을 지정하여 입력값에 안전하게 접근할 수 있습니다.
- HTML Constraint Validation과 FormData API를 활용하여 기본적인 폼 검증 및 데이터 수집을 수행할 수 있습니다.

## 12. 참고자료

### React 공식 문서

- [React DOM Components](https://react.dev/reference/react-dom/components)
- [React `<form>`](https://react.dev/reference/react-dom/components/form)
- [React `<input>`](https://react.dev/reference/react-dom/components/input)
- [React `<textarea>`](https://react.dev/reference/react-dom/components/textarea)
- [React `<select>`](https://react.dev/reference/react-dom/components/select)
- [React Built-in Hooks](https://react.dev/reference/react-dom/hooks)

### MDN Web Docs

- [HTML Forms](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms)
- [HTML `<form>` Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form)
- [HTML `<input>` Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input)
- [HTML `<textarea>` Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea)
- [HTML `<select>` Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/select)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)

### TypeScript 공식 문서

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)