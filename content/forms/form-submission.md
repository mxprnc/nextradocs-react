# Form Submission

## 1. 개요

Form Submission은 사용자가 입력한 데이터를 수집하고 서버 또는 애플리케이션의 처리 로직으로 전달하는 과정입니다.

HTML Form은 브라우저에서 제공하는 기본 제출 메커니즘을 사용하며, React에서는 이벤트 핸들러나 Form Action을 통해 제출 과정을 제어할 수 있습니다.

React에서 폼을 제출하는 대표적인 방식은 다음과 같습니다.

- **HTML Form 기본 제출**: 브라우저가 폼 데이터를 지정된 URL로 전송합니다.
- **`onSubmit` 이벤트**: React 이벤트 핸들러에서 제출 과정을 직접 제어합니다.
- **FormData API**: 폼에 입력된 데이터를 수집하고 가공합니다.
- **Fetch API**: 수집한 데이터를 비동기 HTTP 요청으로 서버에 전달합니다.
- **React 19 Form Actions**: 함수형 `action` 속성을 사용하여 폼 제출과 데이터 처리 과정을 연결합니다.

폼 제출 방식은 애플리케이션의 구조와 데이터 처리 위치에 따라 선택해야 합니다. 특히 React 19의 Form Actions는 기존 `onSubmit` 방식과 실행 흐름 및 폼 초기화 동작에 차이가 있습니다.

## 2. HTML Form Submission

### 2.1. 기본 동작

HTML Form은 사용자가 입력한 데이터를 서버로 전송하기 위한 브라우저 기본 요소입니다.

`<form>` 요소의 주요 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `action` | 폼 데이터를 전송할 URL을 지정합니다. |
| `method` | HTTP 요청 메서드를 지정합니다. 일반적으로 `GET` 또는 `POST`를 사용합니다. |
| `enctype` | 폼 데이터의 인코딩 방식을 지정합니다. |
| `target` | 응답을 표시할 브라우저 컨텍스트를 지정합니다. |

```html
<form action="/api/users" method="POST">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" />

  <button type="submit">Submit</button>
</form>
```

브라우저는 제출 버튼을 클릭하거나 폼 내부에서 Enter 키를 입력하면 폼 제출을 수행합니다.

기본 제출 과정은 다음과 같습니다.

1. 브라우저가 제출 가능한 폼 컨트롤의 값을 수집합니다.
2. `name` 속성을 기준으로 데이터를 구성합니다.
3. `method`에 지정된 HTTP 메서드와 `enctype`에 지정된 인코딩 방식으로 데이터를 전송합니다.
4. 서버의 응답을 브라우저에 표시합니다.

폼 데이터에 포함되는 항목은 브라우저의 성공적인 컨트롤(Successful Controls) 규칙을 따릅니다.

일반적으로 다음 조건을 만족하는 컨트롤이 제출 데이터에 포함됩니다.

- `name` 속성이 지정되어 있어야 합니다.
- `disabled` 상태가 아니어야 합니다.
- 체크박스와 라디오 버튼은 선택된 상태여야 합니다.
- 제출 대상에서 제외되는 컨트롤이 아니어야 합니다.

### 2.2. GET과 POST

HTML Form은 `method` 속성을 통해 요청 방식을 지정할 수 있습니다.

| 구분 | GET | POST |
|---|---|---|
| 데이터 전달 위치 | URL Query String | HTTP Request Body |
| 주요 목적 | 데이터 조회 | 데이터 생성 및 변경 |
| 브라우저 캐싱 | 캐싱 대상이 될 수 있습니다. | 일반적으로 GET보다 캐싱에 덜 적합합니다. |
| URL 노출 | 입력값이 URL에 포함됩니다. | 입력값이 URL에 직접 포함되지 않습니다. |
| 파일 업로드 | 일반적인 파일 업로드에 적합하지 않습니다. | `multipart/form-data`를 사용하여 처리할 수 있습니다. |

GET은 검색이나 필터링처럼 서버의 상태를 변경하지 않는 작업에 적합합니다.

```html
<form action="/search" method="GET">
  <input name="keyword" type="text" />
  <button type="submit">Search</button>
</form>
```

다음과 같은 요청이 생성될 수 있습니다.

```text
/search?keyword=react
```

POST는 로그인, 회원가입, 게시글 생성 등 서버에 데이터를 전달하여 처리하는 작업에 적합합니다.

```html
<form action="/api/users" method="POST">
  <input name="email" type="email" />
  <input name="password" type="password" />
  <button type="submit">Sign Up</button>
</form>
```

POST를 사용한다고 해서 데이터가 자동으로 암호화되는 것은 아닙니다. 민감한 데이터를 전송할 때는 HTTPS를 사용해야 합니다.

### 2.3. Enctype

`enctype`은 POST 요청에서 폼 데이터를 인코딩하는 방식을 지정합니다.

| 값 | 설명 |
|---|---|
| `application/x-www-form-urlencoded` | 기본 인코딩 방식으로, 데이터를 URL 인코딩된 문자열 형태로 전달합니다. |
| `multipart/form-data` | 텍스트와 파일 데이터를 여러 파트로 나누어 전달합니다. |
| `text/plain` | 데이터를 일반 텍스트 형태로 전달합니다. |

파일 업로드에는 일반적으로 `multipart/form-data`를 사용합니다.

```html
<form
  action="/api/upload"
  method="POST"
  enctype="multipart/form-data"
>
  <input name="file" type="file" />
  <button type="submit">Upload</button>
</form>
```

## 3. React onSubmit 이벤트

### 3.1. onSubmit의 역할

React에서는 `<form>` 요소의 `onSubmit` 이벤트를 통해 폼 제출 과정을 제어할 수 있습니다.

`onSubmit`은 폼 제출 시 발생하는 React 이벤트입니다. 제출 이벤트 핸들러에서 `preventDefault()`를 호출하면 브라우저의 기본 제출 동작을 중단할 수 있습니다.

```tsx
import { FormEvent } from "react";

function LoginForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />

      <button type="submit">Login</button>
    </form>
  );
}
```

React 애플리케이션에서는 일반적으로 브라우저의 페이지 이동이나 새로고침을 방지하고, JavaScript를 통해 데이터를 처리하기 위해 `preventDefault()`를 사용합니다.

### 3.2. FormEvent 타입

TypeScript에서는 폼 제출 이벤트의 타입으로 `FormEvent<HTMLFormElement>`를 사용할 수 있습니다.

```tsx
import type { FormEvent } from "react";

function SearchForm() {
  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="keyword" type="text" />
      <button type="submit">Search</button>
    </form>
  );
}
```

`event.currentTarget`은 이벤트 핸들러가 등록된 요소를 참조합니다. 위 예제에서는 `<form>` 요소가 반환됩니다.

반면 `event.target`은 실제 이벤트가 발생한 요소를 참조하므로, 이벤트가 발생한 위치에 따라 폼 내부의 입력 요소 등이 반환될 수 있습니다.

폼 자체에 접근해야 하는 경우에는 `currentTarget`을 사용하는 것이 명확합니다.

### 3.3. onSubmit과 버튼 이벤트의 차이

폼 제출 로직은 버튼의 `onClick`이 아니라 폼의 `onSubmit`에 연결하는 것이 일반적입니다.

```tsx
function SearchForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log("Search submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="keyword" type="text" />

      <button type="submit">
        Search
      </button>
    </form>
  );
}
```

`onSubmit`을 사용하면 다음과 같은 제출 경로를 동일한 로직으로 처리할 수 있습니다.

- 제출 버튼 클릭
- 폼 내부에서 Enter 키 입력
- JavaScript의 `requestSubmit()` 호출

버튼의 `onClick`에만 제출 로직을 연결하면 Enter 키를 통한 제출 등 다른 제출 경로를 별도로 처리해야 할 수 있습니다.

따라서 폼 전체의 제출 동작을 처리할 때는 `onSubmit`을 사용하는 것이 적절합니다.

## 4. FormData API

### 4.1. FormData의 개념

`FormData`는 HTML Form에 포함된 데이터를 Key-Value 형태로 수집하고 관리하는 Web API입니다.

React에서는 `onSubmit` 이벤트를 통해 폼 요소에 접근한 다음 `FormData` 객체를 생성할 수 있습니다.

```tsx
function SignupForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log(formData.get("email"));
    console.log(formData.get("password"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

`new FormData(form)`은 전달된 폼 요소의 제출 가능한 컨트롤을 기준으로 데이터를 수집합니다.

### 4.2. 주요 메서드

| 메서드 | 설명 |
|---|---|
| `append(name, value)` | 지정한 이름에 새로운 값을 추가합니다. |
| `set(name, value)` | 지정한 이름의 값을 설정합니다. 기존 값이 있다면 대체합니다. |
| `get(name)` | 지정한 이름의 첫 번째 값을 반환합니다. |
| `getAll(name)` | 지정한 이름에 해당하는 모든 값을 배열로 반환합니다. |
| `has(name)` | 지정한 이름의 데이터가 존재하는지 확인합니다. |
| `delete(name)` | 지정한 이름의 데이터를 삭제합니다. |
| `entries()` | 모든 Key-Value 항목을 순회할 수 있는 Iterator를 반환합니다. |

`get()`과 `getAll()`의 반환 타입은 다음과 같습니다.

```ts
FormDataEntryValue | null
FormDataEntryValue[]
```

`FormDataEntryValue`는 다음 타입으로 구성됩니다.

```ts
type FormDataEntryValue = string | File;
```

따라서 파일 입력이 포함된 폼에서는 반환값이 문자열이 아닐 수 있다는 점에 주의해야 합니다.

### 4.3. FormData를 객체로 변환하기

`Object.fromEntries()`를 사용하면 FormData의 항목을 일반 JavaScript 객체로 변환할 수 있습니다.

```tsx
function SignupForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const data = Object.fromEntries(formData.entries());

    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="username" type="text" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

다만 `Object.fromEntries()`는 동일한 이름으로 여러 값이 존재하는 경우 중복 항목을 하나의 속성으로 표현하지 못합니다.

예를 들어 여러 개의 체크박스가 동일한 `name`을 사용하면 `getAll()`을 사용해야 모든 값을 보존할 수 있습니다.

```tsx
const formData = new FormData(formElement);

const selectedSkills = formData.getAll("skills");
```

### 4.4. FormData 사용 시 주의사항

FormData는 브라우저의 폼 제출 규칙에 따라 데이터를 수집합니다.

따라서 다음과 같은 사항을 고려해야 합니다.

- `name` 속성이 없는 입력 요소는 데이터에 포함되지 않습니다.
- `disabled` 상태인 입력 요소는 데이터에 포함되지 않습니다.
- 체크되지 않은 체크박스와 라디오 버튼은 데이터에 포함되지 않습니다.
- 동일한 `name`을 가진 여러 항목은 중복으로 존재할 수 있습니다.
- 파일 입력은 문자열이 아닌 `File` 객체로 반환될 수 있습니다.

특히 `disabled`와 `readOnly`는 동작이 다릅니다. `readOnly` 입력 요소는 수정할 수 없지만 일반적으로 FormData에 포함되는 반면, `disabled` 입력 요소는 제출 데이터에서 제외됩니다.

## 5. Fetch API를 이용한 Form Submission

### 5.1. 기본 제출 구조

React의 `onSubmit`과 FormData를 조합하면 브라우저의 기본 페이지 이동 없이 비동기 HTTP 요청으로 폼 데이터를 전달할 수 있습니다.

```tsx
import { useState } from "react";
import type { FormEvent } from "react";

function SignupForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();

      console.log(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unknown error"
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Sign Up"}
      </button>

      {error && <p>{error}</p>}
    </form>
  );
}
```

이 방식에서는 다음과 같은 순서로 제출이 처리됩니다.

1. 사용자가 폼을 제출합니다.
2. `onSubmit` 이벤트가 발생합니다.
3. `preventDefault()`를 통해 브라우저의 기본 제출을 중단합니다.
4. FormData 객체를 생성하여 입력 데이터를 수집합니다.
5. Fetch API를 통해 서버에 HTTP 요청을 전송합니다.
6. 응답 결과를 처리하고 로딩 및 오류 상태를 갱신합니다.

### 5.2. Content-Type 설정

FormData 객체를 Fetch API의 `body`로 전달할 때는 일반적으로 `Content-Type` 헤더를 직접 지정하지 않습니다.

```tsx
await fetch("/api/upload", {
  method: "POST",
  body: formData,
});
```

브라우저는 FormData를 전송할 때 `multipart/form-data`와 함께 필요한 boundary 값을 자동으로 설정합니다.

다음과 같이 `Content-Type`을 직접 지정하면 boundary가 누락되어 서버가 데이터를 정상적으로 파싱하지 못할 수 있습니다.

```tsx
// 주의: FormData 전송 시 직접 지정하지 않는 것이 일반적입니다.
await fetch("/api/upload", {
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  body: formData,
});
```

반면 JSON 데이터를 전송하는 경우에는 JSON 문자열로 변환하고 Content-Type을 지정해야 합니다.

```tsx
const data = {
  email: "user@example.com",
  username: "react-user",
};

await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
});
```

### 5.3. Pending 및 Error 상태 관리

기존 `onSubmit` 기반 구현에서는 요청 처리 상태를 직접 관리해야 합니다.

대표적으로 다음 상태를 사용할 수 있습니다.

| 상태 | 설명 |
|---|---|
| `isPending` | 요청이 진행 중인지 나타냅니다. |
| `error` | 요청 실패 또는 처리 오류를 나타냅니다. |
| `result` | 서버에서 반환된 처리 결과를 저장합니다. |

폼 제출 중에는 중복 제출을 방지하기 위해 제출 버튼을 비활성화할 수 있습니다.

```tsx
<button type="submit" disabled={isPending}>
  Submit
</button>
```

이러한 상태 관리는 React의 `useState` 등을 사용하여 구현할 수 있습니다.

## 6. React 19 Form Actions

### 6.1. Form Action의 개념

React 19에서는 `<form>` 요소의 `action` 속성에 URL뿐 아니라 함수를 전달할 수 있습니다.

기존 HTML Form의 `action` 속성은 데이터를 전송할 URL을 지정하는 용도로 사용되었습니다.

React 19에서는 함수형 Action을 전달하여 폼 제출과 데이터 처리 로직을 직접 연결할 수 있습니다.

```tsx
function SignupForm() {
  async function signup(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log({ email, password });
  }

  return (
    <form action={signup}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

함수형 Action은 폼이 제출될 때 FormData를 인자로 전달받습니다.

이 방식에서는 `onSubmit`에서 직접 이벤트를 처리하고 `FormData`를 생성하는 과정이 필요하지 않습니다.

### 6.2. Action 함수의 실행 방식

React 19의 함수형 Form Action은 일반적인 이벤트 핸들러와 실행 방식이 다릅니다.

React는 함수형 Action을 Transition 내부에서 실행합니다. 따라서 Action 처리 과정은 React의 Transition 및 Pending 상태 관리 기능과 연결됩니다.

다음과 같은 특징이 있습니다.

- Action 함수는 폼 제출 시 FormData를 전달받습니다.
- React가 Action을 Transition으로 실행합니다.
- Action 실행 중에는 Pending 상태를 확인할 수 있습니다.
- Action이 성공적으로 완료되면 Uncontrolled 입력 필드가 자동으로 초기화됩니다.

특히 Uncontrolled 입력 필드의 자동 초기화 동작은 기존 `onSubmit` 기반 제출과 구분해야 합니다.

기존 `onSubmit` 방식에서는 이벤트 핸들러에서 직접 제출 로직을 실행하므로, 제출 후 입력 필드를 초기화하려면 `form.reset()` 등의 처리를 별도로 수행해야 합니다.

반면 React 19의 함수형 Form Action에서는 Action이 성공적으로 완료되면 React가 Uncontrolled 필드를 자동으로 초기화합니다.

```tsx
async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  await fetch("/api/posts", {
    method: "POST",
    body: formData,
  });

  console.log({ title, content });
}

function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" type="text" required />
      <textarea name="content" required />

      <button type="submit">Create Post</button>
    </form>
  );
}
```

위 예제에서 Action이 정상적으로 완료되면 Uncontrolled 입력 필드가 초기화됩니다.

단, Controlled 입력 필드는 React State가 입력값을 관리하므로 Action 완료만으로 State가 초기화되지는 않습니다. Controlled 입력 필드까지 초기화하려면 해당 State를 별도로 갱신해야 합니다.

### 6.3. onSubmit과 Form Action 비교

두 방식은 모두 폼 제출을 처리하지만 실행 흐름과 상태 관리 방식에 차이가 있습니다.

| 구분 | onSubmit | React 19 Form Action |
|---|---|---|
| 연결 위치 | `<form onSubmit={...}>` | `<form action={...}>` |
| 실행 시점 | 제출 이벤트 발생 시 | 폼 제출 시 |
| 함수 인자 | FormEvent | FormData |
| 기본 동작 제어 | 필요에 따라 `preventDefault()` 사용 | 함수형 Action 실행 방식에 따름 |
| 비동기 처리 | 직접 구현 | Action에서 Promise 반환 가능 |
| Transition | 필요하면 직접 구성 | React가 Action을 Transition에서 실행 |
| Pending 상태 | State 등으로 직접 관리 | `useFormStatus`, `useActionState` 활용 |
| Uncontrolled 필드 초기화 | 직접 처리 | 성공적으로 완료되면 자동 초기화 |

`onSubmit`은 폼 제출 이벤트를 세밀하게 제어해야 하는 경우에 적합합니다.

React 19 Form Action은 폼 제출과 비동기 처리, Pending 상태 관리 및 입력 필드 초기화를 React의 기능과 연결할 때 적합합니다.

두 방식은 반드시 상호 배타적인 것은 아니지만, 동일한 제출 로직을 중복해서 실행하지 않도록 역할을 명확하게 구분해야 합니다.

## 7. Form Action과 Pending 상태 관리

### 7.1. useFormStatus

`useFormStatus`는 현재 상위 Form의 제출 상태를 확인할 수 있는 React DOM Hook입니다.

```tsx
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
```

`useFormStatus`는 자신이 속한 상위 Form의 상태를 확인합니다.

따라서 `<form>`을 렌더링하는 컴포넌트에서 직접 호출하는 것이 아니라, 해당 Form 내부에 렌더링되는 자식 컴포넌트에서 호출해야 합니다.

```tsx
import { useFormStatus } from "react-dom";

async function saveProfile(formData: FormData) {
  await fetch("/api/profile", {
    method: "POST",
    body: formData,
  });
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

function ProfileForm() {
  return (
    <form action={saveProfile}>
      <input name="username" type="text" />

      <SubmitButton />
    </form>
  );
}
```

`useFormStatus`는 다음과 같은 정보를 제공합니다.

| 속성 | 설명 |
|---|---|
| `pending` | 상위 Form의 Action이 진행 중인지 나타냅니다. |
| `data` | 현재 제출 중인 FormData입니다. 제출 중이 아니면 `null`입니다. |
| `method` | 제출에 사용된 HTTP 메서드입니다. |
| `action` | 현재 실행 중인 Form Action 함수입니다. |

`useFormStatus`는 폼 제출 상태를 자식 컴포넌트에서 분리하여 관리할 수 있도록 합니다.

### 7.2. useActionState

`useActionState`는 Action 실행 결과를 State로 관리하고 Pending 상태를 함께 제공하는 Hook입니다.

```tsx
import { useActionState } from "react";

type State = {
  message: string;
};

async function updateProfile(
  previousState: State,
  formData: FormData
): Promise<State> {
  const username = formData.get("username");

  if (typeof username !== "string" || !username.trim()) {
    return {
      message: "Username is required.",
    };
  }

  await fetch("/api/profile", {
    method: "POST",
    body: formData,
  });

  return {
    message: "Profile updated successfully.",
  };
}

function ProfileForm() {
  const initialState: State = {
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="username" type="text" />

      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </button>

      <p>{state.message}</p>
    </form>
  );
}
```

`useActionState`는 다음과 같은 배열을 반환합니다.

```ts
const [state, formAction, isPending] = useActionState(
  action,
  initialState
);
```

| 반환값 | 설명 |
|---|---|
| `state` | 가장 최근 Action의 반환값입니다. |
| `formAction` | Form의 `action` 속성에 전달할 함수입니다. |
| `isPending` | Action이 진행 중인지 나타냅니다. |

`useActionState`에 전달하는 Action 함수는 기존 Action과 달리 이전 State를 첫 번째 인자로 전달받습니다.

```ts
async function action(
  previousState: State,
  formData: FormData
): Promise<State> {
  // ...
}
```

따라서 `useActionState`를 사용하는 경우 Action 함수의 매개변수 순서를 정확하게 지정해야 합니다.

## 8. 폼 초기화

### 8.1. HTML Form reset

HTML Form은 `reset()` 메서드를 통해 입력 필드를 초기 상태로 되돌릴 수 있습니다.

```tsx
function ContactForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;

    console.log("Submitted");

    form.reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" />
      <textarea name="message" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

`form.reset()`은 폼 컨트롤을 HTML에서 정의된 초기값으로 되돌립니다.

따라서 `value` 속성이나 `defaultValue` 등으로 설정된 초기값이 존재한다면 해당 값으로 복원됩니다.

### 8.2. Controlled 입력 필드 초기화

Controlled 입력 필드는 React State가 입력값을 관리하므로 State를 초기화해야 합니다.

```tsx
import { useState } from "react";

function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log({ name, message });

    setName("");
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <textarea
        name="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

Controlled 입력 필드는 React State가 실제 입력값을 결정합니다. 따라서 DOM의 `reset()`만 호출하는 것으로 React State까지 초기화되지는 않습니다.

### 8.3. React 19 requestFormReset

React 19에서는 `react-dom`의 `requestFormReset` API를 통해 폼 초기화를 요청할 수 있습니다.

```tsx
import { requestFormReset } from "react-dom";

function ContactForm() {
  async function submitForm(formData: FormData) {
    await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });

    // 폼 초기화 요청
    // 실제 Form 요소에 대한 참조가 필요한 별도 사용 방식과 구분해야 합니다.
  }

  return (
    <form action={submitForm}>
      <input name="name" type="text" />
      <textarea name="message" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

`requestFormReset(form)`은 지정한 폼의 필드를 초기화하도록 요청하는 API입니다.

일반적으로 함수형 Form Action이 성공적으로 완료되면 Uncontrolled 필드가 자동으로 초기화되므로, 별도의 초기화 처리가 필요하지 않은 경우가 많습니다.

`requestFormReset`은 별도의 폼 초기화 동작이 필요한 경우 사용할 수 있습니다. 이 API는 React DOM에서 제공되며, 호출 시 초기화할 Form 요소를 전달해야 합니다.

## 9. Server Functions와 Form Submission

### 9.1. Server Function의 개념

React 19에서는 Server Function을 Form Action으로 전달할 수 있습니다.

Server Function은 서버 환경에서 실행되는 비동기 함수로, 클라이언트에서 직접 실행할 수 없는 서버 측 로직을 처리할 때 사용합니다.

```tsx
"use server";

export async function createUser(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  // 서버 측 데이터 처리
}
```

클라이언트 컴포넌트에서는 해당 함수를 Form Action으로 사용할 수 있습니다.

```tsx
import { createUser } from "./actions";

function SignupForm() {
  return (
    <form action={createUser}>
      <input name="email" type="email" />
      <input name="password" type="password" />

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

이 구조에서는 클라이언트가 서버 함수를 직접 실행하는 대신, React와 프레임워크가 제공하는 Server Function 호출 메커니즘을 통해 서버에서 함수를 실행합니다.

Server Function은 서버 런타임과 이를 지원하는 프레임워크 환경이 필요합니다. 일반적인 정적 웹 호스팅 환경만으로 Server Function이 자동으로 실행되는 것은 아닙니다.

### 9.2. 보안 및 데이터 검증

클라이언트에서 전달되는 FormData는 신뢰할 수 있는 데이터가 아닙니다.

따라서 서버 측에서는 반드시 다음 사항을 검증해야 합니다.

- 필수 입력값의 존재 여부
- 데이터 타입과 형식
- 입력값의 길이 및 범위
- 사용자 인증 및 권한
- 데이터베이스 제약 조건
- 중복 요청 및 비정상적인 요청 여부

HTML의 `required`, `type`, `min`, `max` 등의 속성은 사용자 입력을 보조적으로 검증하는 기능입니다. 이러한 브라우저 검증만으로 서버의 데이터 무결성과 보안을 보장할 수는 없습니다.

Server Function 역시 외부에서 호출될 수 있는 서버 측 진입점으로 취급하고, 인증과 권한 검사를 수행해야 합니다.

## 10. Form Submission 구현 시 주의사항

### 10.1. 중복 제출 방지

사용자가 제출 버튼을 여러 번 클릭하면 동일한 요청이 중복으로 전송될 수 있습니다.

Pending 상태를 사용하여 제출 중에는 버튼을 비활성화하는 것이 일반적입니다.

```tsx
<button type="submit" disabled={isPending}>
  Submit
</button>
```

다만 클라이언트의 버튼 비활성화만으로 중복 요청을 완전히 방지할 수는 없습니다. 중요한 작업은 서버에서도 중복 요청을 처리할 수 있도록 설계해야 합니다.

### 10.2. 입력값 검증

클라이언트 검증은 사용자 경험을 개선하는 데 유용합니다.

```tsx
<input
  name="email"
  type="email"
  required
/>
```

하지만 클라이언트 검증은 우회할 수 있으므로 서버에서도 동일한 검증 규칙을 적용해야 합니다.

### 10.3. Controlled와 Uncontrolled 입력 구분

폼 제출 및 초기화 동작을 설계할 때는 Controlled와 Uncontrolled 입력 필드의 차이를 이해해야 합니다.

| 구분 | Controlled | Uncontrolled |
|---|---|---|
| 값 관리 | React State | DOM |
| 주요 속성 | `value`, `checked` | `defaultValue`, `defaultChecked` |
| 값 변경 | State 갱신 | 사용자 입력 |
| 값 수집 | State 또는 FormData | FormData |
| 초기화 | State 갱신 필요 | `reset()` 또는 Form Action의 자동 초기화 |

React 19의 함수형 Form Action이 성공적으로 완료되면 Uncontrolled 필드는 자동 초기화되지만, Controlled 필드는 React State를 별도로 갱신해야 합니다.

### 10.4. Form Action의 HTTP Method

React 19의 함수형 Form Action은 POST 방식으로 처리됩니다.

HTML Form의 URL 기반 Action과 함수형 Action은 동작 방식이 다르므로 구분해야 합니다.

```tsx
<form action="/api/users" method="POST">
  {/* URL 기반 제출 */}
</form>
```

```tsx
<form action={createUser}>
  {/* 함수형 Action */}
</form>
```

함수형 Action에서는 일반적인 HTML Form의 `method` 설정과 동일하게 동작한다고 가정해서는 안 됩니다.

### 10.5. 오류 처리

비동기 Action에서 오류가 발생할 수 있으므로 오류 처리 전략을 함께 설계해야 합니다.

일반적인 `onSubmit` 방식에서는 `try/catch`를 사용하여 요청 오류를 처리할 수 있습니다.

React 19의 Action에서는 `useActionState`를 통해 검증 실패와 같은 결과를 State로 반환하는 방식도 사용할 수 있습니다.

오류의 종류에 따라 다음과 같이 구분할 수 있습니다.

- 입력값 검증 실패
- 인증 및 권한 오류
- 네트워크 오류
- 서버 내부 오류

사용자에게 전달할 오류 메시지와 서버 내부 오류 정보는 구분해야 합니다.

## 11. Form Submission 방식 비교

| 방식 | 주요 특징 | 적합한 사용 사례 |
|---|---|---|
| HTML Form | 브라우저 기본 제출 기능 사용 | 서버 중심 페이지 및 단순 폼 |
| `onSubmit` | 제출 이벤트와 처리 과정을 직접 제어 | 기존 React 애플리케이션, 세밀한 제출 제어 |
| FormData + Fetch | 폼 데이터를 비동기 HTTP 요청으로 전송 | REST API 기반 애플리케이션 |
| React 19 Form Actions | 제출 함수, Transition, Pending 상태 및 Uncontrolled 초기화 지원 | React 19 기반 폼 처리 |
| Server Functions | 서버 측 함수를 Form Action과 연결 | Server Function을 지원하는 프레임워크 환경 |

## 12. 정리

Form Submission은 HTML Form의 기본 제출 동작을 기반으로 하며, React에서는 이벤트 핸들러와 Form Action을 통해 제출 과정을 제어할 수 있습니다.

기존 `onSubmit` 방식은 제출 이벤트를 직접 처리하고, FormData와 Fetch API를 조합하여 서버 요청을 구현하는 구조입니다. 이 방식에서는 Pending 상태, 오류 처리 및 입력 필드 초기화를 직접 관리해야 합니다.

React 19의 Form Actions는 함수형 `action`을 통해 제출 로직을 폼에 연결합니다. Action은 Transition 내부에서 실행되며, `useFormStatus`와 `useActionState`를 활용하여 제출 상태와 처리 결과를 관리할 수 있습니다.

또한 Action이 성공적으로 완료되면 Uncontrolled 입력 필드가 자동으로 초기화됩니다. Controlled 입력 필드는 React State가 값을 관리하므로 별도의 State 갱신이 필요합니다.

폼 제출 방식을 선택할 때는 다음 기준을 고려해야 합니다.

- 브라우저의 기본 제출 동작이 필요한지 확인합니다.
- 제출 이벤트를 직접 제어해야 하는지 확인합니다.
- 서버 요청 및 비동기 상태를 어떻게 관리할지 결정합니다.
- Controlled와 Uncontrolled 입력 필드의 초기화 방식을 구분합니다.
- React 19 Form Actions 및 Server Functions를 사용할 수 있는 실행 환경인지 확인합니다.
- 클라이언트와 서버 양쪽에서 입력값 검증 및 보안 처리를 수행합니다.

## 13. 참고자료

### React 공식 문서

- [React - `<form>`](https://react.dev/reference/react-dom/components/form)
- [React - `useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [React - `useActionState`](https://react.dev/reference/react/useActionState)
- [React - `requestFormReset`](https://react.dev/reference/react-dom/requestFormReset)
- [React - `<input>`](https://react.dev/reference/react-dom/components/input)
- [React - `<textarea>`](https://react.dev/reference/react-dom/components/textarea)

### Web API 및 HTML 문서

- [MDN - HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement)
- [MDN - FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN - Submit event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)
- [MDN - HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)