# Typing Forms

React에서 Form은 사용자의 입력을 수집하고 처리하기 위한 주요 인터페이스입니다.

TypeScript와 함께 Form을 구현하면 입력 요소의 값, 이벤트 객체, 상태 구조 및 제출 데이터의 타입을 명확하게 정의할 수 있습니다.

특히 React의 이벤트 시스템은 HTML DOM 이벤트 타입과 구분되는 Synthetic Event 타입을 사용하므로 입력 요소의 종류와 이벤트 목적에 맞는 타입을 선택해야 합니다.

## 1. Form Element Types

React에서 Form을 처리할 때는 HTML 요소의 종류에 따라 적절한 DOM 타입을 사용합니다.

대표적인 Form 요소 타입은 다음과 같습니다.

| HTML 요소 | TypeScript 타입 |
|---|---|
| `<form>` | `HTMLFormElement` |
| `<input>` | `HTMLInputElement` |
| `<textarea>` | `HTMLTextAreaElement` |
| `<select>` | `HTMLSelectElement` |
| `<button>` | `HTMLButtonElement` |
| `<label>` | `HTMLLabelElement` |
| `<option>` | `HTMLOptionElement` |

이러한 타입은 이벤트 핸들러의 매개변수와 Ref를 정의할 때 활용할 수 있습니다.

## 2. Form Event Types

React는 Form과 관련된 이벤트를 처리하기 위해 여러 이벤트 타입을 제공합니다.

### 2.1 ChangeEvent

`React.ChangeEvent<T>`는 Input, Textarea, Select 등의 값이 변경될 때 발생하는 이벤트를 처리하는 데 사용합니다.

```tsx
import type { ChangeEvent } from "react";

function TextInput() {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <input
      type="text"
      onChange={handleChange}
    />
  );
}
```

Generic으로 지정한 `HTMLInputElement`는 이벤트 대상 요소의 타입을 나타냅니다.

따라서 `event.target.value`에 안전하게 접근할 수 있습니다.

Textarea와 Select에서도 동일한 이벤트 타입을 사용할 수 있지만, Generic에는 각 요소에 맞는 타입을 지정해야 합니다.

```tsx
const handleTextareaChange = (
  event: React.ChangeEvent<HTMLTextAreaElement>
) => {
  console.log(event.target.value);
};

const handleSelectChange = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  console.log(event.target.value);
};
```

### 2.2 FormEvent

`React.FormEvent<T>`는 Form 제출과 관련된 이벤트를 처리할 때 사용합니다.

```tsx
import type { FormEvent } from "react";

function LoginForm() {
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

`FormEvent<HTMLFormElement>`는 Form 요소에서 발생한 이벤트를 나타냅니다.

`preventDefault()`를 사용하면 Form 제출 시 브라우저가 수행하는 기본 동작을 방지할 수 있습니다.

### 2.3 FocusEvent

Input 요소에 포커스가 들어오거나 포커스를 잃을 때는 `React.FocusEvent<T>`를 사용할 수 있습니다.

```tsx
const handleFocus = (
  event: React.FocusEvent<HTMLInputElement>
) => {
  console.log("Focused:", event.target.value);
};

const handleBlur = (
  event: React.FocusEvent<HTMLInputElement>
) => {
  console.log("Blurred:", event.target.value);
};
```

각 이벤트는 다음과 같이 연결할 수 있습니다.

```tsx
<input
  onFocus={handleFocus}
  onBlur={handleBlur}
/>
```

### 2.4 KeyboardEvent

키보드 입력을 처리할 때는 `React.KeyboardEvent<T>`를 사용합니다.

```tsx
const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  if (event.key === "Enter") {
    console.log("Enter pressed");
  }
};
```

Input 요소에서 키보드 이벤트를 처리할 때 유용합니다.

### 2.5 Event Type Summary

| 이벤트 타입 | 주요 용도 |
|---|---|
| `ChangeEvent<T>` | 입력값 변경 |
| `FormEvent<T>` | Form 제출 |
| `FocusEvent<T>` | 포커스 진입 및 이탈 |
| `KeyboardEvent<T>` | 키보드 입력 |
| `MouseEvent<T>` | 마우스 이벤트 |

이벤트 타입의 Generic에는 이벤트를 처리하는 요소의 DOM 타입을 지정합니다.

## 3. Typing Input Elements

Input 요소는 `type` 속성에 따라 다양한 입력 형태를 제공합니다.

TypeScript에서는 기본적으로 `HTMLInputElement`를 사용하여 입력값에 접근할 수 있습니다.

### 3.1 Text Input

```tsx
import { useState } from "react";

function UsernameInput() {
  const [username, setUsername] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(event.target.value);
  };

  return (
    <input
      type="text"
      value={username}
      onChange={handleChange}
    />
  );
}
```

`HTMLInputElement.value`는 문자열을 반환하므로 `username`은 `string` 타입으로 관리할 수 있습니다.

### 3.2 Number Input

HTML의 `input type="number"`도 `value` 속성은 문자열을 반환합니다.

따라서 숫자로 사용하려면 별도의 변환이 필요합니다.

```tsx
function AgeInput() {
  const [age, setAge] = useState<number>(0);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAge(event.target.valueAsNumber);
  };

  return (
    <input
      type="number"
      value={age}
      onChange={handleChange}
    />
  );
}
```

`valueAsNumber`는 입력값을 숫자로 변환합니다.

단, 입력값이 비어 있거나 유효한 숫자가 아닌 경우 `NaN`을 반환할 수 있으므로 필요한 경우 별도의 검증이 필요합니다.

문자열 상태를 유지하면서 제출 시점에 숫자로 변환하는 방법도 있습니다.

```tsx
const [age, setAge] = useState("");

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  setAge(event.target.value);
};

const parsedAge = age === "" ? null : Number(age);
```

이 방식은 사용자가 입력하는 중간 상태와 실제 숫자 데이터를 구분하기 쉽다는 장점이 있습니다.

### 3.3 Checkbox

Checkbox는 `value`가 아니라 `checked` 속성을 통해 선택 여부를 관리합니다.

```tsx
function AgreementCheckbox() {
  const [agreed, setAgreed] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAgreed(event.target.checked);
  };

  return (
    <label>
      <input
        type="checkbox"
        checked={agreed}
        onChange={handleChange}
      />
      I agree to the terms.
    </label>
  );
}
```

`HTMLInputElement.checked`는 Boolean 값을 반환합니다.

따라서 Checkbox 상태는 일반적으로 `boolean` 타입으로 관리합니다.

### 3.4 Radio Button

Radio Button은 여러 선택지 중 하나를 선택하는 입력 요소입니다.

```tsx
type Gender = "male" | "female" | "other";

function GenderForm() {
  const [gender, setGender] = useState<Gender>("other");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGender(event.target.value as Gender);
  };

  return (
    <>
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={gender === "male"}
          onChange={handleChange}
        />
        Male
      </label>

      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={gender === "female"}
          onChange={handleChange}
        />
        Female
      </label>

      <label>
        <input
          type="radio"
          name="gender"
          value="other"
          checked={gender === "other"}
          onChange={handleChange}
        />
        Other
      </label>
    </>
  );
}
```

`event.target.value`는 문자열이므로 Union Type으로 정의한 `Gender`에 할당할 때는 값이 해당 타입에 포함되는지 검증해야 합니다.

위 예제의 Type Assertion은 입력값이 정의된 선택지 중 하나라는 전제에 의존합니다. 외부 데이터나 동적으로 생성된 선택지를 처리하는 경우에는 별도의 런타임 검증이 필요합니다.

### 3.5 File Input

File Input은 `files` 속성을 통해 업로드된 파일 목록에 접근합니다.

```tsx
function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
      />

      {file && <p>{file.name}</p>}
    </div>
  );
}
```

`HTMLInputElement.files`는 `FileList | null` 타입입니다.

선택된 파일이 없을 수 있으므로 Null 가능성을 처리해야 합니다.

여러 파일을 선택할 수 있는 경우에는 `FileList`를 배열로 변환하여 관리할 수 있습니다.

```tsx
const [files, setFiles] = useState<File[]>([]);

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  setFiles(Array.from(event.target.files ?? []));
};
```

## 4. Typing Textarea and Select

Input 이외의 Form 요소도 해당 DOM 타입을 지정하여 이벤트를 처리할 수 있습니다.

### 4.1 Textarea

```tsx
function MessageForm() {
  const [message, setMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  return (
    <textarea
      value={message}
      onChange={handleChange}
    />
  );
}
```

Textarea는 `HTMLTextAreaElement` 타입을 사용합니다.

### 4.2 Select

```tsx
type Country = "kr" | "us" | "jp";

function CountrySelect() {
  const [country, setCountry] = useState<Country>("kr");

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCountry(event.target.value as Country);
  };

  return (
    <select
      value={country}
      onChange={handleChange}
    >
      <option value="kr">Korea</option>
      <option value="us">United States</option>
      <option value="jp">Japan</option>
    </select>
  );
}
```

Select의 `value` 역시 문자열입니다.

Union Type으로 제한된 값을 사용하는 경우 실제 선택값이 허용된 값인지 검증하는 것이 안전합니다.

## 5. Controlled Components

Controlled Component는 React State가 입력 요소의 값을 제어하는 방식입니다.

입력값은 `value` 또는 `checked` 속성으로 전달하고, 이벤트 핸들러를 통해 State를 업데이트합니다.

```tsx
import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

Controlled Component의 특징은 다음과 같습니다.

- 입력값이 React State에 저장됩니다.
- 입력값 변경 시 State를 업데이트합니다.
- State가 변경되면 입력 요소의 값도 갱신됩니다.
- 입력값 검증 및 조건부 UI 처리에 유리합니다.

Controlled Component는 입력값을 React가 직접 관리해야 하는 경우에 적합합니다.

### 5.1 Controlled Input Type

Controlled Input의 State는 입력 요소의 데이터 형태에 맞게 선언합니다.

```tsx
type FormState = {
  username: string;
  age: string;
  subscribed: boolean;
};

const [form, setForm] = useState<FormState>({
  username: "",
  age: "",
  subscribed: false,
});
```

특히 Number Input의 경우에도 입력 중에는 빈 문자열이 존재할 수 있으므로 문자열로 관리하는 방법이 유용합니다.

## 6. Uncontrolled Components

Uncontrolled Component는 입력 요소가 자체적으로 값을 관리하고 React에서는 필요할 때 Ref를 통해 값을 읽는 방식입니다.

```tsx
import { useRef } from "react";

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";

    console.log({
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        ref={emailRef}
      />

      <input
        type="password"
        ref={passwordRef}
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

Uncontrolled Component의 특징은 다음과 같습니다.

- 입력값을 DOM 요소가 직접 관리합니다.
- Ref를 통해 현재 입력값에 접근합니다.
- 입력값이 변경될 때마다 React State를 업데이트할 필요가 없습니다.
- 간단한 Form이나 기존 HTML Form과의 연동에 유용합니다.

입력값을 실시간으로 검증하거나 다른 UI와 동기화해야 하는 경우에는 Controlled Component가 더 적합할 수 있습니다.

## 7. FormData API

HTML의 `FormData` API를 사용하면 Form 요소에 입력된 데이터를 수집할 수 있습니다.

React에서는 `FormEvent<HTMLFormElement>`와 `FormData`를 결합하여 제출 데이터를 처리할 수 있습니다.

```tsx
function ContactForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");

    console.log({
      name,
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        type="text"
      />

      <input
        name="email"
        type="email"
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

`FormData.get()`은 `FormDataEntryValue | null` 타입을 반환합니다.

`FormDataEntryValue`는 다음 Union Type입니다.

```tsx
type FormDataEntryValue = string | File;
```

따라서 FormData에서 가져온 값이 항상 문자열이라고 가정해서는 안 됩니다.

### 7.1 Type Narrowing

FormData의 값을 문자열로 사용하려면 타입을 검사해야 합니다.

```tsx
const name = formData.get("name");

if (typeof name === "string") {
  console.log(name.toUpperCase());
}
```

파일 입력값을 처리하는 경우에는 `instanceof File` 등을 활용할 수 있습니다.

```tsx
const file = formData.get("attachment");

if (file instanceof File) {
  console.log(file.name);
}
```

### 7.2 FormData Entries

Form 전체의 데이터를 객체 형태로 변환할 수도 있습니다.

```tsx
const formData = new FormData(event.currentTarget);

const entries = Object.fromEntries(formData.entries());
```

다만 `Object.fromEntries()`의 결과는 입력 필드의 구체적인 구조를 자동으로 보장하지 않습니다.

또한 동일한 `name`을 가진 여러 입력값은 객체 변환 과정에서 하나의 속성으로 합쳐지므로, 다중 선택 데이터를 처리할 때는 `getAll()`을 사용하는 것이 적절합니다.

```tsx
const selectedValues = formData.getAll("interests");
```

## 8. Typing Form State

여러 입력 필드가 존재하는 Form에서는 전체 입력 상태를 하나의 타입으로 정의할 수 있습니다.

### 8.1 Defining Form Data Type

```tsx
type RegistrationForm = {
  username: string;
  email: string;
  age: number | null;
  subscribed: boolean;
};

const initialForm: RegistrationForm = {
  username: "",
  email: "",
  age: null,
  subscribed: false,
};
```

Form 데이터의 타입을 명확하게 정의하면 입력값의 누락이나 잘못된 데이터 타입을 방지할 수 있습니다.

### 8.2 Managing Form State

```tsx
import { useState } from "react";

type RegistrationForm = {
  username: string;
  email: string;
  age: number | null;
  subscribed: boolean;
};

function RegistrationFormComponent() {
  const [form, setForm] = useState<RegistrationForm>({
    username: "",
    email: "",
    age: null,
    subscribed: false,
  });

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      subscribed: event.target.checked,
    }));
  };

  return (
    <form>
      <input
        name="username"
        value={form.username}
        onChange={handleTextChange}
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleTextChange}
      />

      <input
        type="checkbox"
        checked={form.subscribed}
        onChange={handleCheckboxChange}
      />
    </form>
  );
}
```

위 예제의 `name`은 일반적인 문자열이므로 TypeScript가 `RegistrationForm`의 특정 속성이라는 사실을 자동으로 보장하지 않습니다.

동적 필드 업데이트를 구현할 때는 필드 이름을 `keyof`로 제한하는 방법을 사용할 수 있습니다.

### 8.3 keyof for Form Fields

`keyof`를 활용하면 Form 필드 이름을 타입으로 제한할 수 있습니다.

```tsx
type RegistrationForm = {
  username: string;
  email: string;
  subscribed: boolean;
};

type RegistrationField = keyof RegistrationForm;
```

`RegistrationField`는 다음 Union Type으로 추론됩니다.

```tsx
type RegistrationField =
  | "username"
  | "email"
  | "subscribed";
```

이 타입을 활용하여 필드 업데이트 함수를 정의할 수 있습니다.

```tsx
function updateField<K extends keyof RegistrationForm>(
  field: K,
  value: RegistrationForm[K]
) {
  setForm((prev) => ({
    ...prev,
    [field]: value,
  }));
}
```

이 방식은 필드 이름과 값의 타입을 연결합니다.

예를 들어 `username`에는 문자열만 전달할 수 있고, `subscribed`에는 Boolean만 전달할 수 있습니다.

다만 실제 이벤트 핸들러에서는 `event.target.value`가 문자열이므로 필드별 변환 및 검증 로직을 별도로 구성해야 합니다.

## 9. Generic Form Components

여러 Form에서 공통으로 사용하는 Input 컴포넌트를 Generic으로 설계할 수 있습니다.

### 9.1 Generic Input Props

```tsx
type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: React.HTMLInputTypeAttribute;
};

function TextInput({
  label,
  name,
  value,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <label>
      {label}

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

`React.HTMLInputTypeAttribute`는 Input의 `type` 속성에 사용할 수 있는 타입입니다.

이와 같이 이벤트 타입과 속성 타입을 명시하면 여러 컴포넌트에서 재사용할 수 있는 Input 컴포넌트를 구현할 수 있습니다.

### 9.2 Reusing Native Input Attributes

기존 HTML Input 속성을 대부분 그대로 지원해야 한다면 `React.ComponentProps<"input">`을 활용할 수 있습니다.

```tsx
import type { ComponentProps } from "react";

type TextInputProps = ComponentProps<"input"> & {
  label: string;
};

function TextInput({
  label,
  ...inputProps
}: TextInputProps) {
  return (
    <label>
      {label}
      <input {...inputProps} />
    </label>
  );
}
```

`ComponentProps<"input">`은 React가 정의한 Input 요소의 Props 타입을 가져옵니다.

이 방식은 `placeholder`, `disabled`, `required`, `onChange` 등 기본 Input 속성을 직접 다시 선언하지 않아도 된다는 장점이 있습니다.

Textarea나 Select도 동일한 방식으로 정의할 수 있습니다.

```tsx
type TextareaProps = ComponentProps<"textarea"> & {
  label: string;
};

type SelectProps = ComponentProps<"select"> & {
  label: string;
};
```

## 10. Form Validation

Form Validation은 입력된 데이터가 요구 조건을 만족하는지 확인하는 과정입니다.

TypeScript는 데이터 구조와 타입을 검사할 수 있지만, 사용자가 입력한 문자열의 유효성까지 자동으로 검증하지는 않습니다.

따라서 런타임 검증 로직을 별도로 구성해야 합니다.

### 10.1 Basic Validation

```tsx
type LoginForm = {
  email: string;
  password: string;
};

type LoginErrors = Partial<
  Record<keyof LoginForm, string>
>;

function validate(form: LoginForm): LoginErrors {
  const errors: LoginErrors = {};

  if (!form.email.includes("@")) {
    errors.email = "Invalid email address";
  }

  if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
}
```

`Partial<Record<keyof LoginForm, string>>`는 Form 필드 이름을 키로 사용하고 각 필드의 오류 메시지를 선택적으로 저장할 수 있는 타입입니다.

### 10.2 Managing Validation State

```tsx
function LoginFormComponent() {
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationErrors = validate(form);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log("Login submitted", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={form.email}
        onChange={(event) =>
          setForm((prev) => ({
            ...prev,
            email: event.target.value,
          }))
        }
      />

      {errors.email && <p>{errors.email}</p>}

      <input
        type="password"
        value={form.password}
        onChange={(event) =>
          setForm((prev) => ({
            ...prev,
            password: event.target.value,
          }))
        }
      />

      {errors.password && <p>{errors.password}</p>}

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

검증 결과를 별도의 타입으로 관리하면 입력 데이터와 오류 데이터를 구분할 수 있습니다.

### 10.3 Runtime Schema Validation

복잡한 Form에서는 Zod와 같은 스키마 검증 라이브러리를 사용할 수 있습니다.

```tsx
import { z } from "zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;
```

`z.infer`를 사용하면 스키마에서 TypeScript 타입을 추출할 수 있습니다.

이를 통해 런타임 데이터 검증과 정적 타입 정의를 동일한 스키마를 기반으로 관리할 수 있습니다.

다만 TypeScript 타입은 컴파일 단계에서 적용되는 정적 검사이며, 실제 입력 데이터는 런타임 검증을 통과해야 합니다.

## 11. Form Libraries

Form의 필드가 많거나 검증, 오류 처리, 제출 상태 관리가 복잡해지면 전용 Form 라이브러리를 활용할 수 있습니다.

대표적인 라이브러리는 다음과 같습니다.

| 라이브러리 | 주요 특징 |
|---|---|
| React Hook Form | Uncontrolled 기반 접근과 성능 최적화에 중점을 둡니다. |
| Formik | Form State와 Validation을 구조화하여 관리합니다. |
| Zod | 스키마 기반 런타임 데이터 검증과 TypeScript 타입 추론을 제공합니다. |
| Valibot | 스키마 기반 데이터 검증과 타입 추론을 제공합니다. |

### 11.1 React Hook Form

React Hook Form은 TypeScript Generic을 활용하여 Form 데이터 구조를 정의할 수 있습니다.

```tsx
import { useForm } from "react-hook-form";

type LoginForm = {
  email: string;
  password: string;
};

function LoginFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log(data.email);
    console.log(data.password);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("email", {
          required: "Email is required",
        })}
      />

      {errors.email && (
        <p>{errors.email.message}</p>
      )}

      <input
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      {errors.password && (
        <p>{errors.password.message}</p>
      )}

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

`useForm<LoginForm>()`으로 Form 데이터 구조를 정의하면 `register`, `handleSubmit` 및 오류 객체에서 해당 타입을 활용할 수 있습니다.

### 11.2 React Hook Form with Zod

React Hook Form은 Zod와 함께 사용할 수 있습니다.

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register("password")}
      />
      {errors.password && (
        <p>{errors.password.message}</p>
      )}

      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

Zod 스키마를 기반으로 Form 데이터를 검증하고, TypeScript 타입을 함께 사용할 수 있습니다.

## 12. Best Practices

React Form을 TypeScript와 함께 구현할 때는 다음 사항을 고려하는 것이 좋습니다.

### 12.1 이벤트 대상 요소에 맞는 타입을 사용합니다.

Input, Textarea, Select 등 요소의 종류에 맞는 DOM 타입을 지정해야 합니다.

- Input: `ChangeEvent<HTMLInputElement>`
- Textarea: `ChangeEvent<HTMLTextAreaElement>`
- Select: `ChangeEvent<HTMLSelectElement>`
- Form: `FormEvent<HTMLFormElement>`

### 12.2 Input의 value와 checked를 구분합니다.

일반적인 텍스트 입력은 `value`와 `event.target.value`를 사용합니다.

Checkbox는 `checked`와 `event.target.checked`를 사용해야 합니다.

### 12.3 Number Input의 실제 값 타입을 고려합니다.

`input type="number"`도 기본적으로 문자열 값을 반환합니다.

`valueAsNumber` 또는 명시적인 변환과 검증을 통해 숫자로 처리해야 합니다.

### 12.4 Form 상태 구조를 명확하게 정의합니다.

여러 입력 필드를 관리할 때는 별도의 Form 타입을 정의하면 데이터 구조를 일관되게 유지할 수 있습니다.

### 12.5 Type Assertion을 최소화합니다.

`event.target.value as SomeUnionType`과 같은 단언은 실제 값이 해당 타입에 포함된다는 것을 보장하지 않습니다.

동적 입력값이나 외부 데이터는 런타임 검증을 거치는 것이 안전합니다.

### 12.6 정적 타입 검사와 런타임 검증을 구분합니다.

TypeScript는 데이터의 정적 타입을 검사하지만 이메일 형식, 비밀번호 길이, 필수 입력 여부 등을 자동으로 검증하지는 않습니다.

실제 사용자 입력은 별도의 Validation 로직을 통해 검증해야 합니다.

### 12.7 Form의 복잡도에 맞는 관리 방식을 선택합니다.

단순한 Form은 React State와 기본 이벤트 핸들러만으로 충분할 수 있습니다.

필드가 많거나 동적 필드, 복잡한 Validation, 비동기 제출 상태 등을 관리해야 한다면 React Hook Form 등의 라이브러리를 고려할 수 있습니다.

## 13. Summary

React Form을 TypeScript와 함께 사용하면 입력 요소, 이벤트, Form State 및 제출 데이터의 타입을 명확하게 정의할 수 있습니다.

| 개념 | 주요 타입 및 API |
|---|---|
| Input Event | `ChangeEvent<HTMLInputElement>` |
| Textarea Event | `ChangeEvent<HTMLTextAreaElement>` |
| Select Event | `ChangeEvent<HTMLSelectElement>` |
| Form Submit | `FormEvent<HTMLFormElement>` |
| Focus Event | `FocusEvent<HTMLInputElement>` |
| Keyboard Event | `KeyboardEvent<HTMLInputElement>` |
| Form DOM | `HTMLFormElement` |
| Input DOM | `HTMLInputElement` |
| Controlled Form | `useState` |
| Uncontrolled Form | `useRef` |
| Form Data | `FormData` |
| Form Field Types | `keyof`, `Record`, `Partial` |
| Runtime Validation | Zod, Valibot |
| Form Management | React Hook Form, Formik |

Form을 구현할 때는 이벤트가 발생하는 요소에 맞는 타입을 지정하고, 입력값의 실제 데이터 형태를 고려해야 합니다.

Controlled Component와 Uncontrolled Component는 각각 State와 DOM을 중심으로 입력값을 관리하므로 Form의 요구사항에 맞게 선택해야 합니다.

또한 TypeScript의 정적 타입 검사와 런타임 데이터 검증은 서로 다른 역할을 수행하므로 실제 사용자 입력에 대한 Validation을 별도로 구성해야 합니다.

## 14. References

- [React 공식 문서 - Responding to Events](https://react.dev/learn/responding-to-events)
  - React 이벤트 핸들러의 선언과 사용 방법을 설명합니다.
- [React 공식 문서 - Responding to Input with State](https://react.dev/learn/reacting-to-input-with-state)
  - 사용자 입력과 React State를 연결하는 방법을 설명합니다.
- [React 공식 문서 - Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
  - 여러 입력 컴포넌트에서 상태를 공유하고 관리하는 방법을 설명합니다.
- [React 공식 문서 - useState](https://react.dev/reference/react/useState)
  - Controlled Form 구현에 활용하는 State 관리 방법을 설명합니다.
- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
  - Uncontrolled Form에서 DOM 요소의 값을 참조하는 방법을 설명합니다.
- [React 공식 문서 - React DOM Components](https://react.dev/reference/react-dom/components)
  - Input, Textarea, Select, Form 등 React DOM 요소의 Props와 동작을 설명합니다.
- [React 공식 문서 - TypeScript](https://react.dev/learn/typescript)
  - React 이벤트와 컴포넌트 Props의 타입 지정 방법을 설명합니다.
- [MDN - HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
  - Input 요소의 DOM 속성과 메서드, 입력값 처리 방법을 설명합니다.
- [MDN - FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
  - Form 데이터를 수집하고 처리하는 Web API를 설명합니다.
- [TypeScript 공식 문서 - keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
  - 객체의 속성 이름을 타입으로 추출하는 방법을 설명합니다.
- [React Hook Form 공식 문서](https://react-hook-form.com/)
  - TypeScript 기반 Form 관리와 Validation 방법을 설명합니다.
- [Zod 공식 문서](https://zod.dev/)
  - 스키마 기반 런타임 데이터 검증과 TypeScript 타입 추론 방법을 설명합니다.