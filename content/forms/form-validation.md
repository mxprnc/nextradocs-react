# Form Validation

## 1. 개요

Form Validation은 사용자가 입력한 데이터가 애플리케이션에서 요구하는 조건을 만족하는지 확인하는 과정입니다.

폼 검증은 잘못된 데이터가 서버로 전달되는 것을 방지하고, 사용자에게 입력 오류를 안내하여 데이터의 일관성과 신뢰성을 유지하는 데 목적이 있습니다.

일반적인 폼 검증은 다음과 같은 단계로 구성됩니다.

1. 사용자가 입력 필드에 데이터를 입력합니다.
2. 입력값이 정의된 검증 조건을 만족하는지 확인합니다.
3. 검증 결과에 따라 오류 메시지를 표시하거나 제출을 허용합니다.
4. 서버에서도 입력값을 다시 검증합니다.
5. 검증을 통과한 데이터만 실제 처리 로직에 전달합니다.

폼 검증은 실행 위치와 목적에 따라 다음과 같이 구분할 수 있습니다.

| 구분 | 설명 |
|---|---|
| HTML Native Validation | 브라우저가 제공하는 기본 입력 검증 기능입니다. |
| Client-side Validation | React 또는 JavaScript에서 직접 구현하는 검증입니다. |
| Server-side Validation | 서버에서 입력 데이터의 유효성과 권한을 검증합니다. |
| Schema-based Validation | 데이터 스키마를 정의하고 해당 규칙에 따라 검증합니다. |

클라이언트 검증은 사용자 경험을 개선하는 데 유용하지만, 보안과 데이터 무결성을 보장하지는 않습니다. 따라서 서버 측 검증을 반드시 함께 수행해야 합니다.

## 2. HTML Native Validation

### 2.1. HTML Constraint Validation

HTML은 입력 요소에 검증 조건을 선언할 수 있는 Constraint Validation 기능을 제공합니다.

브라우저는 입력 요소에 지정된 제약 조건을 기준으로 유효성을 검사하고, 조건을 만족하지 않는 경우 기본 오류 메시지를 표시하거나 폼 제출을 차단합니다.

대표적인 검증 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `required` | 필수 입력 여부를 지정합니다. |
| `min` | 숫자 또는 날짜 입력의 최솟값을 지정합니다. |
| `max` | 숫자 또는 날짜 입력의 최댓값을 지정합니다. |
| `minLength` | 문자열의 최소 길이를 지정합니다. |
| `maxLength` | 문자열의 최대 길이를 지정합니다. |
| `pattern` | 정규표현식 기반의 입력 형식을 지정합니다. |
| `step` | 숫자 또는 날짜 입력의 허용 간격을 지정합니다. |
| `type` | 입력 데이터의 종류에 따른 기본 검증을 적용합니다. |

```tsx
function SignupForm() {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        minLength={8}
        maxLength={32}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

위 예제에서는 다음과 같은 검증이 브라우저에 의해 수행됩니다.

- 이메일 입력값이 이메일 형식인지 확인합니다.
- 이메일 입력값이 비어 있지 않은지 확인합니다.
- 비밀번호가 최소 8자 이상인지 확인합니다.
- 비밀번호가 최대 32자를 초과하지 않는지 확인합니다.

HTML 속성을 사용하면 별도의 JavaScript 검증 로직을 작성하지 않고도 기본적인 입력 조건을 적용할 수 있습니다.

### 2.2. Input Type에 따른 검증

`type` 속성은 입력 UI뿐 아니라 브라우저의 기본 검증 동작에도 영향을 줍니다.

| Type | 검증 및 입력 특성 |
|---|---|
| `text` | 일반 문자열을 입력합니다. |
| `email` | 이메일 형식인지 확인합니다. |
| `url` | URL 형식인지 확인합니다. |
| `number` | 숫자 형식과 `min`, `max`, `step` 조건을 확인합니다. |
| `date` | 날짜 형식과 날짜 범위를 확인합니다. |
| `tel` | 전화번호 입력에 적합한 UI를 제공합니다. 별도의 형식 검증은 자동으로 수행하지 않습니다. |

```tsx
function ProductForm() {
  return (
    <form>
      <input
        name="email"
        type="email"
        required
      />

      <input
        name="age"
        type="number"
        min={1}
        max={120}
        required
      />

      <input
        name="website"
        type="url"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

`type="tel"`은 전화번호 입력에 적합한 키보드와 입력 UI를 제공하지만, 전화번호의 유효한 형식까지 자동으로 검증하지는 않습니다.

### 2.3. Pattern Validation

`pattern` 속성은 정규표현식을 사용하여 입력 형식을 제한합니다.

```tsx
function AccountForm() {
  return (
    <form>
      <label htmlFor="username">Username</label>

      <input
        id="username"
        name="username"
        type="text"
        pattern="[a-zA-Z0-9]{4,12}"
        title="4~12자의 영문자와 숫자만 입력할 수 있습니다."
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

위 예제는 영문자와 숫자로 구성된 4~12자의 입력값만 허용합니다.

`pattern`은 전체 입력값이 정규표현식과 일치하는지 검사합니다. 부분적으로 일치하는 문자열을 허용하려면 정규표현식을 적절하게 설계해야 합니다.

정규표현식은 입력 형식 검증에 유용하지만, 복잡한 비즈니스 규칙이나 데이터 간의 관계를 검증하는 데는 적합하지 않을 수 있습니다.

### 2.4. Constraint Validation API

브라우저는 입력 요소의 유효성을 프로그래밍 방식으로 확인할 수 있는 Constraint Validation API를 제공합니다.

대표적인 속성과 메서드는 다음과 같습니다.

| 속성 및 메서드 | 설명 |
|---|---|
| `validity` | 입력 요소의 상세한 유효성 상태를 반환합니다. |
| `validationMessage` | 브라우저가 제공하는 검증 메시지를 반환합니다. |
| `willValidate` | 해당 요소가 제약 조건 검증 대상인지 확인합니다. |
| `checkValidity()` | 유효성을 검사하고 결과를 반환합니다. |
| `reportValidity()` | 유효성을 검사하고 오류가 있으면 브라우저 UI로 표시합니다. |
| `setCustomValidity()` | 사용자 정의 오류 메시지를 설정합니다. |

```tsx
function EmailForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.elements.namedItem("email");

    if (email instanceof HTMLInputElement) {
      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }
    }

    console.log("Form is valid");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

`checkValidity()`는 유효성 검사 결과를 Boolean으로 반환합니다. `reportValidity()`는 유효하지 않은 입력이 있는 경우 브라우저의 기본 오류 UI를 표시합니다.

### 2.5. Custom Validity

`setCustomValidity()`를 사용하면 브라우저의 기본 검증 조건 외에 사용자 정의 오류 메시지를 설정할 수 있습니다.

```tsx
function PasswordForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const password = form.elements.namedItem("password");
    const confirmPassword = form.elements.namedItem("confirmPassword");

    if (
      !(password instanceof HTMLInputElement) ||
      !(confirmPassword instanceof HTMLInputElement)
    ) {
      return;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity(
        "비밀번호가 일치하지 않습니다."
      );
    } else {
      confirmPassword.setCustomValidity("");
    }

    if (!form.reportValidity()) {
      return;
    }

    console.log("Form is valid");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="password"
        type="password"
        required
      />

      <input
        name="confirmPassword"
        type="password"
        required
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

`setCustomValidity()`에 빈 문자열을 전달하면 사용자 정의 오류가 해제됩니다.

사용자 정의 오류 메시지가 설정된 상태에서는 입력값이 다른 기본 조건을 만족하더라도 해당 요소는 유효하지 않은 상태로 처리됩니다.

따라서 입력값이 변경될 때마다 이전에 설정한 사용자 정의 오류를 다시 검사하고 필요하면 해제해야 합니다.

## 3. React Client-side Validation

### 3.1. React에서의 검증 구조

React에서는 입력값과 검증 결과를 State로 관리하여 사용자 정의 검증 로직을 구현할 수 있습니다.

일반적인 검증 구조는 다음과 같습니다.

- 입력값을 State로 관리합니다.
- 입력값이 변경될 때 검증 함수를 실행합니다.
- 검증 결과를 State로 관리합니다.
- 검증 오류가 존재하면 오류 메시지를 표시합니다.
- 모든 검증 조건을 통과한 경우 제출을 허용합니다.

```tsx
import { useState } from "react";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string): string => {
    if (!value) {
      return "이메일을 입력해 주세요.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "올바른 이메일 형식이 아닙니다.";
    }

    return "";
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationError = validateEmail(email);

    setError(validationError);

    if (validationError) {
      return;
    }

    console.log("Submitted:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

위 예제에서는 이메일 입력값을 Controlled 방식으로 관리하고, 제출 시 검증 함수를 실행하여 결과에 따라 제출을 허용합니다.

실제 애플리케이션에서는 검증 로직을 별도 함수로 분리하여 여러 컴포넌트에서 재사용할 수 있도록 구성하는 것이 좋습니다.

### 3.2. 검증 함수 분리

검증 로직을 컴포넌트 내부에 직접 작성하면 입력 필드가 늘어날수록 컴포넌트의 복잡도가 증가할 수 있습니다.

검증 함수를 별도 모듈로 분리하면 UI 로직과 검증 규칙을 독립적으로 관리할 수 있습니다.

```ts
export function validateEmail(value: string): string | null {
  if (!value.trim()) {
    return "이메일을 입력해 주세요.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "올바른 이메일 형식이 아닙니다.";
  }

  return null;
}
```

컴포넌트에서는 검증 함수를 호출하고 반환된 결과를 화면에 반영합니다.

```tsx
import { useState } from "react";
import { validateEmail } from "./validation";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationError = validateEmail(email);

    setError(validationError);

    if (validationError) {
      return;
    }

    console.log("Submitted:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

검증 함수는 입력값을 받아 검증 결과를 반환하는 순수 함수로 구현하는 것이 좋습니다.

이렇게 구성하면 UI와 독립적으로 검증 규칙을 테스트할 수 있으며, 여러 화면에서 동일한 검증 로직을 재사용할 수 있습니다.

## 4. Validation Timing

### 4.1. 검증 시점

폼 검증은 언제 실행하는지에 따라 사용자 경험과 구현 방식이 달라집니다.

대표적인 검증 시점은 다음과 같습니다.

| 검증 시점 | 설명 | 특징 |
|---|---|---|
| On Change | 입력값이 변경될 때마다 검증합니다. | 즉각적인 피드백을 제공하지만 검증이 자주 실행됩니다. |
| On Blur | 입력 필드에서 포커스가 벗어날 때 검증합니다. | 입력을 마친 시점에 오류를 표시할 수 있습니다. |
| On Submit | 폼 제출 시 검증합니다. | 제출 직전에 모든 입력값을 검사합니다. |
| On Input | 입력 이벤트가 발생할 때 검증합니다. | 입력 과정에 맞춘 세밀한 피드백을 구현할 수 있습니다. |

검증 시점은 입력 필드의 특성과 사용자 경험을 고려하여 결정해야 합니다.

예를 들어 필수 입력 여부는 제출 시 검증해도 충분할 수 있지만, 비밀번호 강도와 같은 조건은 입력 중에 피드백을 제공하는 것이 유용할 수 있습니다.

### 4.2. On Change Validation

`onChange` 이벤트에서 입력값을 검증하면 사용자가 입력하는 즉시 오류 상태를 갱신할 수 있습니다.

```tsx
import { useState } from "react";

function UsernameForm() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const validate = (value: string) => {
    if (value.length < 4) {
      return "아이디는 4자 이상이어야 합니다.";
    }

    return "";
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    setUsername(value);
    setError(validate(value));
  };

  return (
    <form>
      <input
        value={username}
        onChange={handleChange}
      />

      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

이 방식은 빠른 피드백을 제공하지만, 사용자가 아직 입력을 완료하지 않은 상태에서도 오류가 표시될 수 있습니다.

따라서 입력 시작 전에는 오류를 표시하지 않거나, 입력을 시작한 이후에만 검증 결과를 노출하는 등의 처리가 필요할 수 있습니다.

### 4.3. On Blur Validation

`onBlur`는 입력 필드에서 포커스가 벗어날 때 발생하는 이벤트입니다.

입력 중에는 오류 메시지를 표시하지 않고, 사용자가 입력을 마친 시점에 검증할 수 있습니다.

```tsx
import { useState } from "react";

function EmailForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = (value: string) => {
    if (!value) {
      return "이메일을 입력해 주세요.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "올바른 이메일 형식이 아닙니다.";
    }

    return "";
  };

  return (
    <form>
      <input
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setError(validate(email))}
      />

      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

다만 `onBlur`에서 사용하는 값이 최신 입력값과 일치하도록 관리해야 합니다. 위 예제에서는 `onChange`에서 State를 갱신하고, 포커스가 벗어나는 시점에 해당 State를 기준으로 검증합니다.

### 4.4. On Submit Validation

`onSubmit`에서 전체 입력값을 검증하는 방식은 제출 직전에 데이터의 유효성을 확인하는 데 적합합니다.

```tsx
type FormValues = {
  email: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.email) {
    errors.email = "이메일을 입력해 주세요.";
  }

  if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  return errors;
}
```

검증 결과에 오류가 존재하는 경우 제출을 중단하고 오류 메시지를 표시합니다.

```tsx
import { useState } from "react";

function SignupForm() {
  const [values, setValues] = useState<FormValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const validationErrors = validate(values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log("Submitted:", values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={(event) =>
          setValues((previous) => ({
            ...previous,
            email: event.target.value,
          }))
        }
      />

      {errors.email && (
        <p role="alert">{errors.email}</p>
      )}

      <input
        name="password"
        type="password"
        value={values.password}
        onChange={(event) =>
          setValues((previous) => ({
            ...previous,
            password: event.target.value,
          }))
        }
      />

      {errors.password && (
        <p role="alert">{errors.password}</p>
      )}

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

실제 애플리케이션에서는 검증 시점을 하나로 제한하기보다 On Blur와 On Submit을 조합하는 경우도 많습니다.

## 5. Validation State 관리

### 5.1. 입력값과 오류 상태 분리

폼 검증에서는 입력값과 검증 결과를 별도의 State로 관리하는 것이 일반적입니다.

```tsx
type FormValues = {
  username: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
```

입력값은 사용자가 작성한 원본 데이터를 나타내고, 오류 상태는 해당 데이터가 검증 규칙을 만족하는지 나타냅니다.

```tsx
const [values, setValues] = useState<FormValues>({
  username: "",
  email: "",
});

const [errors, setErrors] = useState<FormErrors>({});
```

이렇게 분리하면 입력값 변경과 검증 결과 변경을 독립적으로 처리할 수 있습니다.

### 5.2. Touched State

`Touched`는 사용자가 특정 입력 필드와 상호작용했는지를 나타내는 상태입니다.

일반적으로 입력 필드에 포커스를 두었다가 벗어난 경우 해당 필드를 Touched 상태로 표시합니다.

```tsx
type TouchedFields = Partial<Record<keyof FormValues, boolean>>;

const [touched, setTouched] = useState<TouchedFields>({});
```

Touched 상태를 사용하면 사용자가 입력 필드를 확인하기도 전에 모든 오류 메시지가 표시되는 문제를 줄일 수 있습니다.

```tsx
{touched.email && errors.email && (
  <p role="alert">{errors.email}</p>
)}
```

### 5.3. Dirty State

`Dirty`는 입력값이 초기값에서 변경되었는지를 나타내는 개념입니다.

Touched가 입력 필드와의 상호작용 여부를 나타낸다면, Dirty는 실제 값의 변경 여부를 나타냅니다.

| 상태 | 의미 |
|---|---|
| Pristine | 초기값에서 변경되지 않은 상태입니다. |
| Dirty | 초기값과 다른 값으로 변경된 상태입니다. |
| Touched | 사용자가 해당 입력 필드와 상호작용한 상태입니다. |
| Untouched | 사용자가 해당 입력 필드와 아직 상호작용하지 않은 상태입니다. |

Touched와 Dirty는 서로 다른 개념입니다.

예를 들어 사용자가 입력 필드에 포커스를 두었다가 아무것도 입력하지 않고 벗어나면 Touched는 `true`가 될 수 있지만 Dirty는 `false`로 유지됩니다.

### 5.4. isValid와 isSubmitting

폼 전체의 검증 상태와 제출 상태를 별도로 관리하면 폼의 동작을 명확하게 표현할 수 있습니다.

| 상태 | 설명 |
|---|---|
| `isValid` | 모든 검증 조건을 통과했는지 나타냅니다. |
| `isSubmitting` | 폼 제출 요청이 진행 중인지 나타냅니다. |
| `isDirty` | 초기값과 비교하여 변경된 입력값이 있는지 나타냅니다. |
| `isTouched` | 하나 이상의 입력 필드가 상호작용되었는지 나타냅니다. |

이러한 상태는 입력값과 검증 결과를 기반으로 계산할 수 있습니다.

예를 들어 오류 객체가 비어 있는지 확인하여 `isValid`를 계산할 수 있습니다.

```tsx
const isValid = Object.keys(errors).length === 0;
```

다만 초기 입력값이 비어 있고 아직 검증을 수행하지 않은 상태에서도 오류 객체가 비어 있을 수 있으므로, 실제 구현에서는 초기 검증 여부나 제출 여부 등을 함께 고려해야 합니다.

## 6. Cross-field Validation

### 6.1. 필드 간 의존성 검증

일부 검증 규칙은 하나의 입력값만으로 판단할 수 없습니다.

대표적인 예는 비밀번호와 비밀번호 확인 입력값의 일치 여부입니다.

이처럼 여러 입력 필드의 값을 함께 비교하는 검증을 Cross-field Validation이라고 합니다.

```tsx
type PasswordValues = {
  password: string;
  confirmPassword: string;
};

function validatePassword(values: PasswordValues) {
  const errors: Partial<Record<keyof PasswordValues, string>> = {};

  if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
  }

  return errors;
}
```

검증 함수는 관련된 입력값을 함께 전달받아 두 값의 관계를 확인합니다.

### 6.2. 날짜 범위 검증

시작일과 종료일의 관계를 검증하는 것도 Cross-field Validation에 해당합니다.

```tsx
type DateRangeValues = {
  startDate: string;
  endDate: string;
};

function validateDateRange(values: DateRangeValues) {
  const errors: Partial<Record<keyof DateRangeValues, string>> = {};

  if (
    values.startDate &&
    values.endDate &&
    values.startDate > values.endDate
  ) {
    errors.endDate = "종료일은 시작일보다 빠를 수 없습니다.";
  }

  return errors;
}
```

위 예제는 `YYYY-MM-DD` 형식의 날짜 문자열을 비교하는 경우를 가정합니다.

날짜 형식이 일정하지 않거나 시간대가 포함되는 경우에는 문자열 비교에 의존하지 않고 Date 객체 또는 명확한 날짜 처리 로직을 사용해야 합니다.

Cross-field Validation은 입력값 간의 관계를 검증하는 데 유용하지만, 관련 입력값 중 하나가 변경되었을 때 다른 필드의 검증 결과도 다시 계산해야 한다는 점에 주의해야 합니다.

## 7. Asynchronous Validation

### 7.1. 비동기 검증의 개념

일부 검증은 클라이언트에서 즉시 수행할 수 없습니다.

예를 들어 회원가입 시 사용자 이름이나 이메일이 이미 사용 중인지 확인하려면 서버에 요청해야 합니다.

이처럼 외부 API 또는 서버 응답을 필요로 하는 검증을 Asynchronous Validation이라고 합니다.

```tsx
async function checkUsernameAvailability(
  username: string
): Promise<boolean> {
  const response = await fetch(
    `/api/users/check-username?username=${encodeURIComponent(username)}`
  );

  if (!response.ok) {
    throw new Error("Failed to check username");
  }

  const result: { available: boolean } = await response.json();

  return result.available;
}
```

비동기 검증은 다음과 같은 상태를 고려해야 합니다.

- 검증 요청 진행 중
- 검증 성공
- 검증 실패
- 네트워크 또는 서버 오류

### 7.2. 비동기 검증 구현

```tsx
import { useState } from "react";

function UsernameForm() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleBlur = async () => {
    if (!username.trim()) {
      setMessage("아이디를 입력해 주세요.");
      return;
    }

    setIsChecking(true);
    setMessage("");

    try {
      const available = await checkUsernameAvailability(username);

      setMessage(
        available
          ? "사용 가능한 아이디입니다."
          : "이미 사용 중인 아이디입니다."
      );
    } catch {
      setMessage("아이디 확인 중 오류가 발생했습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <form>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        onBlur={handleBlur}
      />

      {isChecking && <p>확인 중...</p>}
      {message && <p>{message}</p>}
    </form>
  );
}
```

위 예제는 입력 필드에서 포커스가 벗어났을 때 서버에 사용자 이름의 사용 가능 여부를 요청합니다.

실제 서비스에서는 비동기 검증 요청이 여러 번 발생할 수 있으므로 추가적인 처리가 필요합니다.

### 7.3. Race Condition 방지

비동기 검증에서는 이전 요청의 응답이 이후 요청보다 늦게 도착할 수 있습니다.

예를 들어 다음과 같은 상황이 발생할 수 있습니다.

1. 사용자가 `react`를 입력합니다.
2. `react`에 대한 검증 요청을 전송합니다.
3. 사용자가 `reactjs`로 수정합니다.
4. `reactjs`에 대한 새로운 검증 요청을 전송합니다.
5. `reactjs` 요청이 먼저 완료됩니다.
6. 이전 `react` 요청이 나중에 완료되어 최신 검증 결과를 덮어씁니다.

이러한 문제는 요청 취소 또는 요청 식별자를 사용하여 방지할 수 있습니다.

```tsx
import { useEffect, useState } from "react";

function UsernameForm() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!username.trim()) {
      setMessage("");
      return;
    }

    const controller = new AbortController();

    const checkUsername = async () => {
      try {
        const response = await fetch(
          `/api/users/check-username?username=${encodeURIComponent(username)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        const result: { available: boolean } = await response.json();

        setMessage(
          result.available
            ? "사용 가능한 아이디입니다."
            : "이미 사용 중인 아이디입니다."
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        setMessage("검증 요청에 실패했습니다.");
      }
    };

    checkUsername();

    return () => {
      controller.abort();
    };
  }, [username]);

  return (
    <div>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <p>{message}</p>
    </div>
  );
}
```

`AbortController`를 사용하면 입력값이 변경되었을 때 이전 요청을 취소할 수 있습니다.

또한 입력값 변경이 빈번한 경우에는 Debounce를 적용하여 일정 시간 동안 추가 입력이 없을 때만 서버에 요청하도록 구성할 수 있습니다.

비동기 검증 결과는 사용자 경험을 위한 사전 확인에 활용하고, 실제 데이터 저장 시점에는 서버에서 다시 검증해야 합니다.

## 8. Schema-based Validation

### 8.1. Schema-based Validation의 개념

Schema-based Validation은 데이터의 구조와 검증 규칙을 스키마 형태로 정의하고, 해당 스키마를 기준으로 입력값을 검증하는 방식입니다.

검증 규칙을 컴포넌트 내부에 직접 작성하는 대신 별도의 스키마로 관리할 수 있습니다.

이 방식은 다음과 같은 장점이 있습니다.

- 검증 규칙을 UI 로직과 분리할 수 있습니다.
- 여러 폼에서 동일한 스키마를 재사용할 수 있습니다.
- 복잡한 검증 조건을 선언적으로 표현할 수 있습니다.
- TypeScript 타입과 검증 규칙을 연결할 수 있습니다.
- 클라이언트와 서버에서 동일한 검증 규칙을 공유할 수 있습니다.

대표적인 Schema Validation 라이브러리는 다음과 같습니다.

| 라이브러리 | 특징 |
|---|---|
| Zod | TypeScript 중심의 스키마 정의 및 런타임 검증을 지원합니다. |
| Yup | 스키마 기반 검증과 Formik 등의 폼 라이브러리 연동을 지원합니다. |
| Valibot | 모듈형 구조와 TypeScript 타입 추론을 지원합니다. |

### 8.2. Zod를 이용한 검증

Zod는 TypeScript와 함께 사용할 수 있는 스키마 기반 검증 라이브러리입니다.

```ts
import { z } from "zod";

const signupSchema = z.object({
  email: z.email({
    error: "올바른 이메일 형식이 아닙니다.",
  }),

  password: z.string().min(8, {
    error: "비밀번호는 8자 이상이어야 합니다.",
  }),

  age: z.number().min(18, {
    error: "만 18세 이상이어야 합니다.",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;
```

위 스키마는 이메일, 비밀번호, 나이에 대한 검증 규칙을 정의합니다.

`z.infer`를 사용하면 스키마로부터 TypeScript 타입을 추론할 수 있습니다.

검증은 `parse()` 또는 `safeParse()`를 사용하여 수행할 수 있습니다.

```ts
const result = signupSchema.safeParse({
  email: "user@example.com",
  password: "password123",
  age: 20,
});

if (result.success) {
  console.log(result.data);
} else {
  console.log(result.error.issues);
}
```

`parse()`는 검증에 실패하면 예외를 발생시키고, `safeParse()`는 성공 여부를 포함한 결과 객체를 반환합니다.

폼 검증에서는 실패 결과를 오류 메시지로 변환해야 하는 경우가 많으므로 `safeParse()`가 유용합니다.

### 8.3. Zod와 React Form

Zod 스키마는 React 컴포넌트의 제출 로직과 연결할 수 있습니다.

```tsx
import { useState } from "react";
import { z } from "zod";

const signupSchema = z.object({
  email: z.email({
    error: "올바른 이메일 형식이 아닙니다.",
  }),

  password: z.string().min(8, {
    error: "비밀번호는 8자 이상이어야 합니다.",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignupFormValues, string>>
  >({});

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const values = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = signupSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof SignupFormValues, string>
      > = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];

        if (field === "email" || field === "password") {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});

    console.log("Validated:", result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
      />

      {errors.email && (
        <p role="alert">{errors.email}</p>
      )}

      <input
        name="password"
        type="password"
      />

      {errors.password && (
        <p role="alert">{errors.password}</p>
      )}

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

위 예제는 FormData로 입력값을 수집하고 Zod 스키마로 검증한 다음 오류 결과를 React State에 반영합니다.

실제 프로젝트에서는 입력값의 타입 변환, 필드별 오류 매핑, 비동기 검증 및 서버 응답 처리 등을 함께 설계해야 합니다.

## 9. Form Validation 라이브러리

### 9.1. 라이브러리 사용 목적

폼의 입력 필드와 검증 규칙이 많아지면 입력값, 오류, Touched, Dirty, Pending 상태를 직접 관리하는 코드가 복잡해질 수 있습니다.

Form Validation 라이브러리는 이러한 반복적인 상태 관리와 검증 과정을 추상화합니다.

대표적인 라이브러리는 다음과 같습니다.

| 라이브러리 | 주요 특징 |
|---|---|
| React Hook Form | Uncontrolled 입력을 중심으로 효율적인 폼 상태 관리 기능을 제공합니다. |
| Formik | 입력값, 오류, Touched 및 제출 상태를 통합적으로 관리합니다. |
| TanStack Form | 타입 안전성과 유연한 폼 상태 관리 기능을 제공합니다. |

검증 라이브러리와 폼 상태 관리 라이브러리는 서로 다른 역할을 수행할 수 있습니다.

예를 들어 React Hook Form은 폼 상태와 입력값 관리를 담당하고, Zod는 입력 데이터의 검증 규칙을 정의하는 역할을 담당합니다.

### 9.2. React Hook Form과 Zod

React Hook Form은 입력값과 폼 상태를 관리하고, Zod는 스키마 기반 검증을 수행하도록 구성할 수 있습니다.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const signupSchema = z.object({
  email: z.email({
    error: "올바른 이메일 형식이 아닙니다.",
  }),

  password: z.string().min(8, {
    error: "비밀번호는 8자 이상이어야 합니다.",
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignupFormValues) => {
    await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        {...register("email")}
      />

      {errors.email && (
        <p role="alert">{errors.email.message}</p>
      )}

      <input
        type="password"
        {...register("password")}
      />

      {errors.password && (
        <p role="alert">{errors.password.message}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Sign Up"}
      </button>
    </form>
  );
}
```

이 구조에서는 다음과 같이 역할이 분리됩니다.

- React Hook Form: 입력값, 오류, 제출 상태를 관리합니다.
- Zod: 입력 데이터의 구조와 검증 규칙을 정의합니다.
- `zodResolver`: React Hook Form과 Zod를 연결합니다.
- `handleSubmit`: 제출 시 검증을 수행하고 성공한 데이터를 전달합니다.

폼의 복잡도가 높아지거나 검증 규칙을 여러 화면에서 재사용해야 하는 경우 이러한 조합을 고려할 수 있습니다.

## 10. Server-side Validation

### 10.1. 서버 검증의 필요성

Client-side Validation은 사용자 경험을 개선하고 잘못된 요청을 사전에 줄이는 데 유용합니다.

그러나 클라이언트에서 수행되는 검증은 사용자가 JavaScript를 수정하거나 HTTP 요청을 직접 전송하여 우회할 수 있습니다.

따라서 서버는 클라이언트 검증 결과를 신뢰해서는 안 됩니다.

서버에서는 전달된 모든 입력값에 대해 검증을 수행해야 합니다.

```ts
async function createUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return {
      success: false,
      message: "올바른 이메일을 입력해 주세요.",
    };
  }

  if (typeof password !== "string" || password.length < 8) {
    return {
      success: false,
      message: "비밀번호는 8자 이상이어야 합니다.",
    };
  }

  // 서버 측 데이터 처리
}
```

서버 측에서는 입력값의 존재 여부뿐 아니라 데이터 타입, 길이, 허용 범위, 사용자 권한 등을 함께 확인해야 합니다.

### 10.2. 클라이언트와 서버의 검증 규칙 공유

클라이언트와 서버에서 동일한 검증 규칙을 사용해야 하는 경우 스키마를 공유하는 방법을 고려할 수 있습니다.

```ts
import { z } from "zod";

export const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type UserInput = z.infer<typeof userSchema>;
```

클라이언트에서는 사용자 입력을 검증하고, 서버에서는 실제 요청 데이터를 다시 검증합니다.

```ts
const result = userSchema.safeParse(requestBody);

if (!result.success) {
  // 검증 실패 처리
  return;
}

// 검증된 데이터 사용
const user = result.data;
```

동일한 스키마를 공유하면 검증 규칙이 서로 달라지는 문제를 줄일 수 있습니다.

다만 서버 측에서는 스키마 검증 외에도 인증, 권한, 데이터베이스 제약 조건 등 서버 환경에서만 확인할 수 있는 조건을 별도로 검증해야 합니다.

## 11. 접근성과 오류 메시지

### 11.1. 오류 메시지 연결

폼 검증 오류는 시각적으로만 표시해서는 안 됩니다.

스크린 리더와 같은 보조 기술에서도 입력 오류를 인식할 수 있도록 입력 요소와 오류 메시지를 연결해야 합니다.

`aria-invalid`와 `aria-describedby`를 활용할 수 있습니다.

```tsx
function EmailField() {
  const error = "올바른 이메일 형식이 아닙니다.";

  return (
    <div>
      <label htmlFor="email">Email</label>

      <input
        id="email"
        name="email"
        type="email"
        aria-invalid={Boolean(error)}
        aria-describedby="email-error"
      />

      {error && (
        <p id="email-error">
          {error}
        </p>
      )}
    </div>
  );
}
```

| 속성 | 설명 |
|---|---|
| `aria-invalid` | 입력값이 유효하지 않은 상태인지 보조 기술에 전달합니다. |
| `aria-describedby` | 입력 요소에 대한 추가 설명이나 오류 메시지 요소를 연결합니다. |
| `aria-label` | 시각적인 레이블이 없는 경우 접근 가능한 이름을 제공합니다. |

`aria-invalid`는 입력값이 실제로 유효하지 않은 경우에만 `true`로 설정하는 것이 적절합니다.

### 11.2. 오류 메시지 표시

오류 메시지는 어떤 입력이 왜 잘못되었는지 이해할 수 있도록 구체적으로 작성해야 합니다.

다음과 같은 메시지는 사용자에게 충분한 정보를 제공하지 못합니다.

```text
Invalid input.
```

다음과 같이 수정하면 오류 원인과 해결 방법을 명확하게 전달할 수 있습니다.

```text
비밀번호는 8자 이상이어야 합니다.
```

오류 메시지는 다음 원칙을 고려하여 작성하는 것이 좋습니다.

- 오류가 발생한 입력 필드를 명확하게 식별합니다.
- 오류 원인을 구체적으로 설명합니다.
- 사용자가 수정할 수 있는 방법을 안내합니다.
- 동일한 검증 조건에는 일관된 메시지를 사용합니다.
- 서버 내부 정보나 민감한 데이터를 노출하지 않습니다.

## 12. Form Validation 설계 시 고려사항

폼 검증을 설계할 때는 단순히 입력값의 형식만 확인하는 것이 아니라 검증 규칙의 위치와 실행 시점, 오류 상태 관리 방식을 함께 고려해야 합니다.

| 고려사항 | 설명 |
|---|---|
| 검증 위치 | HTML, React, 서버 중 어느 계층에서 검증할지 구분합니다. |
| 검증 시점 | 입력 중, 포커스 해제, 제출 시점 등 적절한 시점을 선택합니다. |
| 검증 규칙 | 필수 입력, 형식, 길이, 범위 및 필드 간 관계를 정의합니다. |
| 상태 관리 | 입력값, 오류, Touched, Dirty 및 Pending 상태를 관리합니다. |
| 비동기 검증 | 서버 요청의 실패, 취소 및 응답 순서를 고려합니다. |
| 접근성 | 오류 상태와 메시지를 보조 기술에 전달합니다. |
| 서버 검증 | 클라이언트 검증과 별개로 서버에서 입력값과 권한을 확인합니다. |
| 재사용성 | 공통 검증 규칙을 함수 또는 스키마로 분리합니다. |

특히 검증 로직이 복잡해지는 경우 컴포넌트에 모든 조건을 직접 작성하기보다 검증 함수 또는 스키마를 별도로 구성하는 것이 유지보수에 유리합니다.

## 13. 정리

Form Validation은 입력 데이터의 유효성을 확인하고 잘못된 데이터가 처리되는 것을 방지하는 과정입니다.

HTML은 `required`, `minLength`, `maxLength`, `pattern` 등의 속성을 통해 기본적인 검증 기능을 제공합니다. Constraint Validation API를 활용하면 브라우저의 검증 상태를 프로그래밍 방식으로 확인하고 사용자 정의 오류 메시지를 설정할 수 있습니다.

React에서는 입력값과 검증 결과를 State로 관리하여 사용자 정의 검증 로직을 구현할 수 있습니다. 검증 시점은 On Change, On Blur, On Submit 등으로 구분되며, Touched와 Dirty 상태를 함께 사용하면 오류 메시지를 표시하는 시점을 세밀하게 제어할 수 있습니다.

검증 규칙이 복잡해지면 Zod와 같은 Schema Validation 라이브러리를 활용할 수 있으며, React Hook Form과 결합하면 입력값 및 폼 상태 관리와 검증 로직을 분리할 수 있습니다.

폼 검증에서 중요한 원칙은 다음과 같습니다.

- HTML Native Validation은 기본적인 입력 검증에 활용합니다.
- React에서는 입력값과 검증 결과를 명확하게 분리하여 관리합니다.
- 검증 시점은 사용자 경험을 고려하여 결정합니다.
- 여러 입력값의 관계를 확인하는 Cross-field Validation을 고려합니다.
- 비동기 검증에서는 요청 취소와 Race Condition을 처리합니다.
- 복잡한 검증 규칙은 별도의 함수 또는 스키마로 분리합니다.
- 오류 메시지는 접근성을 고려하여 입력 요소와 연결합니다.
- 클라이언트 검증과 관계없이 서버에서도 반드시 입력값을 검증합니다.

## 14. 참고자료

### React 공식 문서

- [React - `<input>`](https://react.dev/reference/react-dom/components/input)
- [React - `<form>`](https://react.dev/reference/react-dom/components/form)
- [React - `<textarea>`](https://react.dev/reference/react-dom/components/textarea)
- [React - `useState`](https://react.dev/reference/react/useState)
- [React - `useEffect`](https://react.dev/reference/react/useEffect)

### HTML 및 Web API

- [MDN - Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation)
- [MDN - Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)
- [MDN - HTMLInputElement: validity](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/validity)
- [MDN - HTMLInputElement: setCustomValidity()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity)
- [MDN - HTML attribute: pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern)
- [MDN - AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)

### Validation 라이브러리

- [Zod 공식 문서](https://zod.dev/)
- [React Hook Form 공식 문서](https://react-hook-form.com/)
- [React Hook Form - Resolvers](https://github.com/react-hook-form/resolvers)
- [Yup 공식 문서](https://github.com/jquense/yup)
- [Valibot 공식 문서](https://valibot.dev/)

### 접근성

- [W3C WAI - Forms Tutorial](https://www.w3.org/WAI/tutorials/forms/)
- [W3C WAI - Form Notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)