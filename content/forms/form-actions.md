# Form Actions

## 1. 개요

Form Actions는 React 19에서 도입된 폼 제출 처리 방식으로, `<form>` 요소의 `action` 속성에 함수를 전달하여 폼 제출과 데이터 처리 로직을 연결하는 기능입니다.

기존 React에서는 `onSubmit` 이벤트 핸들러에서 제출 이벤트를 처리하고, FormData 생성, 비동기 요청, Pending 상태, 오류 처리 및 폼 초기화 등을 직접 구현하는 경우가 많았습니다.

React 19에서는 함수형 Action을 통해 이러한 작업을 React의 Transition 모델과 연결할 수 있습니다.

Form Actions의 주요 특징은 다음과 같습니다.

- `<form>`의 `action` 속성에 함수를 전달할 수 있습니다.
- React가 제출된 폼 데이터를 `FormData` 객체로 전달합니다.
- Action은 Transition 내부에서 실행됩니다.
- `useFormStatus`를 사용하여 제출 상태를 확인할 수 있습니다.
- `useActionState`를 사용하여 Action의 반환값과 Pending 상태를 관리할 수 있습니다.
- `useOptimistic`을 사용하여 서버 응답 전에 낙관적 UI를 표시할 수 있습니다.
- Action이 성공적으로 완료되면 Uncontrolled 입력 필드가 자동으로 초기화됩니다.
- Server Functions와 연결하여 서버 측 데이터 변경 작업을 처리할 수 있습니다.

Form Actions는 단순히 폼 제출 이벤트를 대체하는 기능이 아니라, 비동기 데이터 변경 작업을 React의 상태 관리 모델과 통합하는 기능입니다.

## 2. Action의 개념

### 2.1. Action이란?

Action은 비동기 작업을 수행하고 그 결과에 따라 React UI를 갱신하는 함수입니다.

React에서는 Transition 내부에서 실행되는 함수를 Action이라고 부릅니다. Action은 데이터 변경 요청, 서버 통신, 폼 제출과 같은 작업에 활용할 수 있습니다.

일반적인 이벤트 핸들러와 비교하면 다음과 같은 차이가 있습니다.

| 구분 | 일반 이벤트 핸들러 | Action |
|---|---|---|
| 주요 목적 | 사용자 이벤트 처리 | 비동기 데이터 변경 작업 |
| 비동기 처리 | 직접 구현 | Transition과 통합 |
| Pending 상태 | 별도 State 관리 | Action의 Pending 상태 활용 |
| 오류 처리 | 직접 처리 | Error Boundary와 연동 가능 |
| 낙관적 업데이트 | 직접 구현 | `useOptimistic` 활용 |
| 폼 제출 | `onSubmit`에서 처리 | `action` 속성에 함수 전달 |

Action은 반드시 폼에서만 사용하는 개념은 아닙니다. `startTransition`이나 React의 Action 관련 Hook을 통해 다른 비동기 작업에도 활용할 수 있습니다.

### 2.2. 일반 이벤트 핸들러와 Action 비교

기존 방식에서는 비동기 요청의 시작과 종료를 State로 직접 관리해야 합니다.

```tsx
import { useState } from "react";

function UpdateName() {
  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to update name");
      }
    } catch {
      setError("이름 변경에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Update"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19에서는 Action을 활용하여 제출 처리와 Pending 상태 관리를 간결하게 구성할 수 있습니다.

```tsx
import { useActionState } from "react";

type State = {
  error: string | null;
};

async function updateName(
  previousState: State,
  formData: FormData
): Promise<State> {
  const name = formData.get("name");

  if (typeof name !== "string" || !name.trim()) {
    return {
      error: "이름을 입력해 주세요.",
    };
  }

  const response = await fetch("/api/profile", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return {
      error: "이름 변경에 실패했습니다.",
    };
  }

  return {
    error: null,
  };
}

function UpdateName() {
  const [state, formAction, isPending] = useActionState(
    updateName,
    { error: null }
  );

  return (
    <form action={formAction}>
      <input name="name" required />

      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </button>

      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
```

위 예제에서는 `useActionState`가 Action의 반환값과 Pending 상태를 관리합니다.

기존 방식처럼 제출 상태를 별도의 `useState`로 관리하지 않아도 되며, Action의 결과를 UI에 연결할 수 있습니다.

## 3. Function Action

### 3.1. form action에 함수 전달

React 19에서는 `<form>`의 `action` 속성에 URL 대신 함수를 전달할 수 있습니다.

```tsx
async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  console.log({
    title,
    content,
  });
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

사용자가 폼을 제출하면 React는 해당 함수에 `FormData` 객체를 전달합니다.

기존 `onSubmit` 방식과 달리 함수형 Action에서는 다음 작업을 별도로 구현할 필요가 없습니다.

- 제출 이벤트 객체 접근
- `preventDefault()` 호출
- `new FormData()`를 통한 데이터 수집
- 제출을 위한 Transition 구성

React가 함수형 Action을 실행하고 제출 과정을 관리합니다.

### 3.2. Action 함수의 매개변수

일반적인 Form Action은 첫 번째 인자로 `FormData`를 전달받습니다.

```ts
async function createPost(formData: FormData): Promise<void> {
  const title = formData.get("title");
  const content = formData.get("content");

  // 데이터 처리
}
```

FormData의 주요 메서드는 다음과 같습니다.

| 메서드 | 설명 |
|---|---|
| `get(name)` | 지정한 이름의 첫 번째 값을 반환합니다. |
| `getAll(name)` | 지정한 이름의 모든 값을 반환합니다. |
| `has(name)` | 지정한 이름의 데이터 존재 여부를 확인합니다. |
| `entries()` | 전체 Key-Value 항목을 순회합니다. |

반환값은 `string | File | null`일 수 있으므로 TypeScript에서는 타입을 확인한 후 사용해야 합니다.

```tsx
async function createPost(formData: FormData) {
  const title = formData.get("title");
  const image = formData.get("image");

  if (typeof title !== "string" || !title.trim()) {
    return;
  }

  if (image instanceof File && image.size > 0) {
    console.log(image.name);
  }
}
```

### 3.3. Uncontrolled 입력 필드

Function Action은 Uncontrolled 입력 필드와 자연스럽게 연결됩니다.

Uncontrolled 입력 필드는 React State가 아니라 DOM이 입력값을 관리합니다.

```tsx
function SearchForm() {
  async function search(formData: FormData) {
    const keyword = formData.get("keyword");

    console.log(keyword);
  }

  return (
    <form action={search}>
      <input name="keyword" type="text" />

      <button type="submit">Search</button>
    </form>
  );
}
```

입력 요소의 `name` 속성을 기준으로 React가 FormData를 구성하므로 별도의 `value`와 `onChange`를 선언하지 않아도 됩니다.

Action이 성공적으로 완료되면 React는 Uncontrolled 입력 필드를 자동으로 초기화합니다.

이 동작은 기존 `onSubmit` 기반 제출과 구분해야 합니다. 기존 방식에서는 폼 초기화를 직접 수행해야 하지만, 함수형 Form Action에서는 성공적인 실행 후 Uncontrolled 필드가 자동으로 초기화됩니다.

반면 Controlled 입력 필드는 React State가 값을 관리하므로 Action 완료만으로 State가 초기화되지는 않습니다.

## 4. formAction

### 4.1. formAction의 개념

`formAction`은 개별 제출 버튼 또는 입력 요소에 별도의 Action을 지정하는 기능입니다.

하나의 폼에서 여러 종류의 제출 작업을 제공해야 하는 경우 사용할 수 있습니다.

예를 들어 게시글 작성 화면에서 다음과 같은 작업이 필요할 수 있습니다.

- 임시 저장
- 게시글 발행
- 게시글 삭제

각 버튼에 서로 다른 `formAction`을 지정하면 하나의 폼에서 여러 제출 동작을 처리할 수 있습니다.

```tsx
async function saveDraft(formData: FormData) {
  console.log("Save draft:", formData.get("title"));
}

async function publishPost(formData: FormData) {
  console.log("Publish:", formData.get("title"));
}

function PostForm() {
  return (
    <form action={saveDraft}>
      <input name="title" required />
      <textarea name="content" />

      <button type="submit">
        Save Draft
      </button>

      <button
        type="submit"
        formAction={publishPost}
      >
        Publish
      </button>
    </form>
  );
}
```

위 예제에서 첫 번째 버튼은 폼에 지정된 `saveDraft`를 실행하고, 두 번째 버튼은 자체적으로 지정한 `publishPost`를 실행합니다.

### 4.2. action과 formAction의 차이

| 구분 | `action` | `formAction` |
|---|---|---|
| 지정 위치 | `<form>` | 제출 버튼 또는 제출 입력 요소 |
| 적용 범위 | 폼 전체의 기본 Action | 해당 제출 요소의 Action |
| 사용 목적 | 기본 제출 로직 정의 | 특정 버튼에 별도 제출 로직 지정 |
| 우선순위 | 기본값 | 해당 제출 요소로 제출할 때 우선 적용 |

`formAction`은 특정 제출 버튼의 동작을 분리할 때 유용합니다.

다만 여러 Action이 동일한 데이터를 수정할 수 있으므로 서버 측 권한 검사와 데이터 일관성을 고려해야 합니다.

## 5. useFormStatus

### 5.1. useFormStatus의 역할

`useFormStatus`는 현재 컴포넌트가 속한 상위 Form의 제출 상태를 확인하는 React DOM Hook입니다.

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

`useFormStatus`는 자신을 포함하는 가장 가까운 상위 `<form>`의 상태를 읽습니다.

따라서 폼을 렌더링하는 컴포넌트가 아니라 폼 내부에 배치되는 자식 컴포넌트에서 호출해야 합니다.

```tsx
import { useFormStatus } from "react-dom";

async function submitForm(formData: FormData) {
  await fetch("/api/submit", {
    method: "POST",
    body: formData,
  });
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function ContactForm() {
  return (
    <form action={submitForm}>
      <input name="email" type="email" required />

      <SubmitButton />
    </form>
  );
}
```

### 5.2. 반환값

React 19의 `useFormStatus`는 다음 정보를 반환합니다.

| 속성 | 타입 | 설명 |
|---|---|---|
| `pending` | `boolean` | 폼 Action이 실행 중인지 나타냅니다. |
| `data` | `FormData \| null` | 현재 제출 중인 폼 데이터입니다. |
| `method` | `string` | 제출에 사용된 HTTP 메서드입니다. |
| `action` | `function \| null` | 현재 실행 중인 Action 함수입니다. |

```tsx
import { useFormStatus } from "react-dom";

function FormStatus() {
  const {
    pending,
    data,
    method,
    action,
  } = useFormStatus();

  return (
    <div>
      <p>Pending: {String(pending)}</p>
      <p>Method: {method}</p>
      <p>Action: {action ? "Assigned" : "None"}</p>
      <p>
        Email: {data?.get("email")?.toString() ?? ""}
      </p>
    </div>
  );
}
```

`useFormStatus`는 폼의 상태를 구독하는 Hook이므로 폼의 제출 상태를 여러 하위 컴포넌트에 전달하지 않고도 사용할 수 있습니다.

### 5.3. useFormStatus 사용 시 주의사항

`useFormStatus`는 자신이 렌더링하는 컴포넌트의 반환 결과에 포함된 `<form>`을 읽을 수 없습니다.

잘못된 구조는 다음과 같습니다.

```tsx
function ContactForm() {
  const { pending } = useFormStatus();

  return (
    <form action={submitForm}>
      <button type="submit" disabled={pending}>
        Submit
      </button>
    </form>
  );
}
```

이 컴포넌트에서 호출한 `useFormStatus`는 반환되는 `<form>`의 상태를 읽지 못합니다.

다음과 같이 자식 컴포넌트로 분리해야 합니다.

```tsx
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}

function ContactForm() {
  return (
    <form action={submitForm}>
      <input name="email" type="email" />

      <SubmitButton />
    </form>
  );
}
```

## 6. useActionState

### 6.1. useActionState의 역할

`useActionState`는 Action의 실행 결과와 Pending 상태를 관리하는 React Hook입니다.

일반적인 Form Action은 FormData를 전달받아 작업을 수행하지만, Action의 결과를 컴포넌트의 State로 관리하려면 별도의 상태 관리가 필요합니다.

`useActionState`는 Action을 래핑하여 이전 실행 결과를 다음 실행에 전달하고, 마지막 반환값을 React State로 제공합니다.

```tsx
import { useActionState } from "react";

async function updateProfile(
  previousState: string | null,
  formData: FormData
): Promise<string | null> {
  const username = formData.get("username");

  if (typeof username !== "string" || !username.trim()) {
    return "이름을 입력해 주세요.";
  }

  return null;
}

function ProfileForm() {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    null
  );

  return (
    <form action={formAction}>
      <input name="username" />

      <button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update"}
      </button>

      {state && <p role="alert">{state}</p>}
    </form>
  );
}
```

### 6.2. 반환값

`useActionState`는 다음 배열을 반환합니다.

```tsx
const [state, formAction, isPending] = useActionState(
  action,
  initialState
);
```

| 반환값 | 설명 |
|---|---|
| `state` | Action이 마지막으로 반환한 결과입니다. |
| `formAction` | Form의 `action` 속성에 전달할 래핑된 Action입니다. |
| `isPending` | Action이 실행 중인지 나타냅니다. |

세 번째 인자로는 선택적으로 `permalink`를 전달할 수 있습니다. 이는 Server Function과 점진적 향상(Progressive Enhancement)을 사용하는 환경에서 제출 전후의 페이지 위치를 처리하는 데 활용됩니다.

### 6.3. Action 함수의 매개변수

`useActionState`를 사용하는 경우 Action 함수의 매개변수 구조가 일반 Form Action과 다릅니다.

일반 Form Action은 FormData를 첫 번째 인자로 받습니다.

```tsx
async function action(formData: FormData) {
  // ...
}
```

반면 `useActionState`로 래핑되는 Action은 이전 State와 FormData를 순서대로 전달받습니다.

```tsx
async function action(
  previousState: State,
  formData: FormData
): Promise<State> {
  // ...
}
```

이전 State는 초기값 또는 직전 Action의 반환값입니다.

따라서 `useActionState`를 사용할 때는 Action 함수의 첫 번째 인자를 FormData로 처리하지 않도록 주의해야 합니다.

### 6.4. 검증 결과 관리

`useActionState`는 서버 또는 Action 내부에서 수행한 검증 결과를 반환하는 데 활용할 수 있습니다.

```tsx
import { useActionState } from "react";

type State = {
  success: boolean;
  message: string;
};

async function signup(
  previousState: State,
  formData: FormData
): Promise<State> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.includes("@")) {
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

  const response = await fetch("/api/signup", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return {
      success: false,
      message: "회원가입에 실패했습니다.",
    };
  }

  return {
    success: true,
    message: "회원가입이 완료되었습니다.",
  };
}

function SignupForm() {
  const initialState: State = {
    success: false,
    message: "",
  };

  const [state, formAction, isPending] = useActionState(
    signup,
    initialState
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" required />

      <input
        name="password"
        type="password"
        required
      />

      <button type="submit" disabled={isPending}>
        {isPending ? "Signing up..." : "Sign Up"}
      </button>

      {state.message && (
        <p role={state.success ? "status" : "alert"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
```

이 구조에서는 검증 실패나 업무 처리 결과를 State로 반환하여 UI에 표시할 수 있습니다.

검증 실패와 같이 정상적인 업무 결과로 처리할 수 있는 상황은 State로 반환하는 방식이 적합합니다. 반면 예상하지 못한 시스템 오류는 Error Boundary와 같은 오류 처리 구조를 고려할 수 있습니다.

## 7. useOptimistic

### 7.1. 낙관적 업데이트의 개념

낙관적 업데이트(Optimistic Update)는 서버 요청이 완료되기 전에 작업이 성공할 것으로 가정하고 UI를 먼저 갱신하는 방식입니다.

일반적인 데이터 변경 과정에서는 서버 응답을 기다린 후 UI를 갱신합니다.

```text
사용자 입력
    ↓
서버 요청
    ↓
서버 응답 대기
    ↓
UI 갱신
```

낙관적 업데이트에서는 서버 응답을 기다리지 않고 UI를 먼저 갱신합니다.

```text
사용자 입력
    ↓
UI 즉시 갱신
    ↓
서버 요청
    ↓
서버 응답
    ↓
최종 상태 반영
```

이 방식은 댓글 작성, 좋아요, 장바구니 수량 변경 등 즉각적인 피드백이 중요한 작업에 유용합니다.

### 7.2. useOptimistic의 역할

`useOptimistic`은 서버 응답을 기다리는 동안 임시 UI 상태를 관리하는 React Hook입니다.

```tsx
import { useOptimistic } from "react";

function LikeButton({
  currentLikes,
  onLike,
}: {
  currentLikes: number;
  onLike: () => Promise<void>;
}) {
  const [optimisticLikes, addOptimisticLike] =
    useOptimistic(currentLikes);

  async function likeAction() {
    addOptimisticLike(currentLikes + 1);

    await onLike();
  }

  return (
    <form action={likeAction}>
      <p>Likes: {optimisticLikes}</p>

      <button type="submit">
        Like
      </button>
    </form>
  );
}
```

위 예제에서는 사용자가 좋아요 버튼을 누르면 서버 응답을 기다리지 않고 좋아요 수를 먼저 증가시킵니다.

Action이 완료되면 실제 State가 기준이 됩니다. 서버 요청이 실패하거나 Action이 종료되었는데 실제 State가 갱신되지 않았다면 낙관적 값은 원래 기준값으로 돌아갑니다.

### 7.3. Reducer를 이용한 낙관적 업데이트

`useOptimistic`은 두 번째 인자로 Reducer 함수를 전달할 수도 있습니다.

```tsx
import { useOptimistic } from "react";

type Comment = {
  id: string;
  text: string;
};

function CommentForm({
  comments,
  saveComment,
}: {
  comments: Comment[];
  saveComment: (text: string) => Promise<void>;
}) {
  const [optimisticComments, addOptimisticComment] =
    useOptimistic(
      comments,
      (state, newComment: Comment) => [
        ...state,
        newComment,
      ]
    );

  async function submitAction(formData: FormData) {
    const text = formData.get("comment");

    if (typeof text !== "string" || !text.trim()) {
      return;
    }

    addOptimisticComment({
      id: crypto.randomUUID(),
      text,
    });

    await saveComment(text);
  }

  return (
    <div>
      <ul>
        {optimisticComments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>

      <form action={submitAction}>
        <input name="comment" required />

        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}
```

Reducer는 현재 기준 State와 새로운 낙관적 값을 받아 다음 낙관적 State를 반환합니다.

```tsx
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  reducer
);
```

여러 개의 낙관적 변경 작업을 순차적으로 반영해야 하는 경우 Reducer를 활용하면 상태 변경 규칙을 명확하게 관리할 수 있습니다.

`useOptimistic`은 실제 서버 데이터를 저장하는 State가 아닙니다. 서버 응답이 도착하기 전까지 UI에 임시로 표시할 값을 관리하는 기능입니다.

따라서 서버 응답이 성공하면 실제 데이터 State도 갱신해야 합니다.

## 8. Error Handling

### 8.1. Action 오류 처리

Action 실행 중 예외가 발생하면 React는 해당 오류를 가장 가까운 Error Boundary로 전달할 수 있습니다.

```tsx
async function submitForm(formData: FormData) {
  const response = await fetch("/api/submit", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to submit form");
  }
}
```

Action 내부에서 예상하지 못한 오류가 발생하면 Error Boundary가 해당 오류를 처리하도록 구성할 수 있습니다.

```tsx
import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return <p>요청 처리 중 오류가 발생했습니다.</p>;
    }

    return this.props.children;
  }
}
```

```tsx
function App() {
  return (
    <ErrorBoundary>
      <ContactForm />
    </ErrorBoundary>
  );
}
```

Error Boundary는 렌더링 과정에서 발생한 오류와 React가 전달하는 Action 오류를 처리하는 데 활용할 수 있습니다.

### 8.2. 업무 오류와 시스템 오류 구분

모든 오류를 예외로 처리할 필요는 없습니다.

폼 처리에서는 오류의 성격에 따라 처리 방식을 구분하는 것이 좋습니다.

| 오류 유형 | 처리 방식 |
|---|---|
| 필수 입력 누락 | 검증 결과를 State로 반환 |
| 입력 형식 오류 | 검증 결과를 State로 반환 |
| 중복 데이터 | 업무 오류 메시지를 State로 반환 |
| 인증 및 권한 오류 | 서버에서 검증하고 적절한 응답 처리 |
| 네트워크 오류 | 예외 처리 또는 별도 오류 상태 관리 |
| 예상하지 못한 서버 오류 | Error Boundary 등 오류 처리 구조 활용 |

예를 들어 사용자가 이미 사용 중인 이메일을 입력한 경우는 시스템 장애가 아니라 정상적인 업무 검증 결과입니다.

이러한 오류는 `useActionState`를 통해 반환하여 폼 내부에 표시하는 것이 적절합니다.

반면 서버 연결 실패나 예상하지 못한 예외는 Error Boundary 또는 별도의 오류 처리 로직을 고려해야 합니다.

## 9. Server Functions와 Form Actions

### 9.1. Server Function의 개념

Server Function은 서버에서 실행되는 비동기 함수로, 클라이언트에서 직접 수행할 수 없는 데이터 변경 작업을 처리하는 데 사용됩니다.

React 19에서는 Server Function을 Form Action으로 전달할 수 있습니다.

```tsx
// actions.ts
"use server";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  const content = formData.get("content");

  // 서버 측 데이터 검증 및 저장
}
```

```tsx
// PostForm.tsx
import { createPost } from "./actions";

function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />

      <textarea name="content" required />

      <button type="submit">Create Post</button>
    </form>
  );
}
```

사용자가 폼을 제출하면 React와 프레임워크의 Server Function 실행 메커니즘을 통해 서버에서 함수가 실행됩니다.

이 과정에서 폼 데이터는 서버 함수에 FormData로 전달됩니다.

### 9.2. useActionState와 Server Function

Server Function과 `useActionState`를 함께 사용하면 서버에서 반환한 검증 결과를 클라이언트 UI에 표시할 수 있습니다.

```tsx
// actions.ts
"use server";

type State = {
  error: string | null;
};

export async function createUser(
  previousState: State,
  formData: FormData
): Promise<State> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.includes("@")) {
    return {
      error: "올바른 이메일을 입력해 주세요.",
    };
  }

  // 데이터베이스 저장 및 서버 측 처리

  return {
    error: null,
  };
}
```

```tsx
// SignupForm.tsx
"use client";

import { useActionState } from "react";
import { createUser } from "./actions";

function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    { error: null }
  );

  return (
    <form action={formAction}>
      <input name="email" type="email" required />

      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Account"}
      </button>

      {state.error && (
        <p role="alert">{state.error}</p>
      )}
    </form>
  );
}
```

Server Function의 반환값은 `useActionState`의 State로 전달됩니다.

이를 통해 서버에서 수행한 검증 결과를 클라이언트의 폼 UI에 연결할 수 있습니다.

### 9.3. Progressive Enhancement

Progressive Enhancement는 JavaScript가 아직 로드되지 않았거나 비활성화된 상황에서도 핵심 기능을 사용할 수 있도록 설계하는 접근 방식입니다.

Server Function을 Form Action으로 사용하면 React의 Hydration이 완료되기 전에도 폼 제출을 처리할 수 있는 구조를 구성할 수 있습니다.

```tsx
import { createPost } from "./actions";

function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />

      <textarea name="content" required />

      <button type="submit">Create Post</button>
    </form>
  );
}
```

이 구조는 서버에서 처리할 수 있는 Form Action을 사용하므로 클라이언트 JavaScript에만 의존하는 제출 방식보다 점진적 향상에 유리합니다.

`useActionState`와 Server Function을 함께 사용하면 Hydration이 완료되기 전에 발생한 제출의 결과를 처리하는 구조도 구성할 수 있습니다.

다만 Progressive Enhancement를 활용하려면 Server Function을 지원하는 프레임워크 및 서버 실행 환경이 필요합니다. 일반적인 정적 호스팅만으로 Server Function이 자동 실행되는 것은 아닙니다.

## 10. Action에 추가 데이터 전달하기

### 10.1. FormData 외부 데이터 전달

Form Action은 기본적으로 폼의 입력값을 FormData로 전달합니다.

하지만 실제 애플리케이션에서는 폼에 포함되지 않은 추가 데이터가 필요한 경우가 있습니다.

예를 들어 특정 게시글의 ID를 기준으로 수정 작업을 수행할 수 있습니다.

이 경우 클로저를 사용하여 Action 함수에 추가 데이터를 전달할 수 있습니다.

```tsx
function EditPost({
  postId,
}: {
  postId: string;
}) {
  async function updatePost(formData: FormData) {
    const title = formData.get("title");

    await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      body: formData,
    });

    console.log(title);
  }

  return (
    <form action={updatePost}>
      <input name="title" required />

      <button type="submit">Update</button>
    </form>
  );
}
```

클로저는 함수가 선언된 환경의 변수에 접근할 수 있도록 하므로 컴포넌트의 Props나 State를 Action에서 사용할 수 있습니다.

### 10.2. bind를 이용한 데이터 전달

`bind()`를 사용하면 Action 함수에 추가 인자를 미리 전달할 수 있습니다.

```tsx
async function updatePost(
  postId: string,
  formData: FormData
) {
  const title = formData.get("title");

  console.log({
    postId,
    title,
  });
}

function EditPost({
  postId,
}: {
  postId: string;
}) {
  const updatePostWithId = updatePost.bind(
    null,
    postId
  );

  return (
    <form action={updatePostWithId}>
      <input name="title" required />

      <button type="submit">Update</button>
    </form>
  );
}
```

`bind()`를 사용하면 추가 인자가 Action의 앞부분에 전달되고, React가 제출 시 전달하는 FormData는 다음 인자로 전달됩니다.

```ts
async function updatePost(
  postId: string,
  formData: FormData
) {
  // ...
}
```

Server Function에서도 `bind()`를 활용할 수 있습니다.

다만 클라이언트에서 전달된 추가 인자는 신뢰할 수 있는 권한 정보가 아닙니다. 게시글 ID와 같은 값을 전달하더라도 서버에서 해당 리소스에 대한 접근 권한을 다시 확인해야 합니다.

## 11. Action과 Transition

### 11.1. Action의 Transition 실행

React 19의 함수형 Form Action은 React가 Transition 내부에서 실행합니다.

Transition은 업데이트의 우선순위를 관리하여 사용자 입력과 같은 긴급한 UI 업데이트가 비동기 작업에 의해 불필요하게 지연되지 않도록 지원합니다.

```tsx
function ContactForm() {
  async function submitForm(formData: FormData) {
    await fetch("/api/contact", {
      method: "POST",
      body: formData,
    });
  }

  return (
    <form action={submitForm}>
      <input name="email" type="email" />

      <button type="submit">Submit</button>
    </form>
  );
}
```

함수형 Action을 사용하면 React가 제출 과정을 Transition과 연결하므로 일반적인 폼 제출에서는 `startTransition()`을 직접 호출할 필요가 없습니다.

### 11.2. 직접 Action을 실행하는 경우

폼의 `action` 속성을 사용하지 않고 일반 이벤트 핸들러에서 비동기 데이터 변경 작업을 수행하는 경우에는 `startTransition()`을 직접 사용할 수 있습니다.

```tsx
import { startTransition, useState } from "react";

function UpdateButton() {
  const [isPending, setIsPending] = useState(false);

  function handleClick() {
    startTransition(async () => {
      setIsPending(true);

      await fetch("/api/update", {
        method: "POST",
      });

      setIsPending(false);
    });
  }

  return (
    <button onClick={handleClick}>
      Update
    </button>
  );
}
```

실제 구현에서는 Transition의 Pending 상태를 `useTransition`으로 관리하는 방법도 고려할 수 있습니다.

```tsx
import { useTransition } from "react";

function UpdateButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await fetch("/api/update", {
        method: "POST",
      });
    });
  }

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Updating..." : "Update"}
    </button>
  );
}
```

Form Action과 일반 이벤트 핸들러의 실행 구조를 구분해야 합니다. 이미 함수형 Form Action으로 실행되는 작업을 불필요하게 다시 Transition으로 감싸지 않아도 됩니다.

## 12. Form Actions 사용 시 주의사항

### 12.1. name 속성 지정

React는 폼 제출 시 `name` 속성이 지정된 입력 요소를 기준으로 FormData를 구성합니다.

```tsx
<form action={submitForm}>
  <input name="email" type="email" />
  <input type="password" />

  <button type="submit">Submit</button>
</form>
```

위 예제에서 `email`은 FormData에 포함되지만 `name` 속성이 없는 비밀번호 입력값은 포함되지 않습니다.

Action에서 입력값을 사용하려면 각 입력 요소에 적절한 `name`을 지정해야 합니다.

### 12.2. Controlled 입력 필드 초기화

함수형 Action이 성공적으로 완료되면 Uncontrolled 필드는 자동으로 초기화됩니다.

그러나 Controlled 입력 필드는 React State가 값을 관리하므로 별도의 초기화 처리가 필요합니다.

```tsx
import { useState } from "react";

function MessageForm() {
  const [message, setMessage] = useState("");

  async function submitMessage(formData: FormData) {
    await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });

    setMessage("");
  }

  return (
    <form action={submitMessage}>
      <input
        name="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <button type="submit">Send</button>
    </form>
  );
}
```

위 예제에서는 Action 내부에서 `setMessage("")`를 호출하여 Controlled 입력값을 초기화합니다.

### 12.3. Action의 반환값

일반적인 Form Action의 반환값은 React가 자동으로 UI에 표시하지 않습니다.

Action의 결과를 컴포넌트 State로 관리해야 한다면 `useActionState`를 사용하는 것이 적절합니다.

```tsx
async function submitForm(formData: FormData) {
  return {
    message: "Submitted",
  };
}
```

위 함수의 반환값을 화면에 표시하려면 다음과 같이 `useActionState`로 연결할 수 있습니다.

```tsx
const [state, formAction] = useActionState(
  submitForm,
  { message: "" }
);
```

### 12.4. 비동기 오류 처리

Action 내부에서 예외가 발생하면 React의 Error Boundary와 연동할 수 있습니다.

반면 사용자 입력 오류나 업무 규칙 위반처럼 예상 가능한 결과는 State로 반환하여 사용자에게 안내하는 것이 적절합니다.

오류의 성격에 따라 처리 방식을 구분해야 합니다.

### 12.5. 서버 측 검증과 권한 검사

Form Action을 사용하더라도 서버 측 검증은 생략할 수 없습니다.

특히 Server Function은 클라이언트에서 전달되는 입력값을 기반으로 서버에서 실행되므로 다음 사항을 확인해야 합니다.

- 입력값의 타입과 형식
- 필수 필드 및 데이터 범위
- 인증된 사용자 여부
- 리소스에 대한 접근 권한
- 데이터베이스 제약 조건
- 중복 요청 및 비정상적인 요청

Form Action은 제출 과정을 간결하게 관리하기 위한 기능이지, 데이터 검증이나 보안 처리를 자동으로 보장하는 기능은 아닙니다.

## 13. Form Actions 관련 API 비교

React 19에서 Form Actions를 구현할 때 사용하는 주요 API는 다음과 같습니다.

| API | 패키지 | 역할 |
|---|---|---|
| `action` | React DOM | 폼 전체의 기본 Action을 지정합니다. |
| `formAction` | React DOM | 개별 제출 요소의 Action을 지정합니다. |
| `useFormStatus` | `react-dom` | 상위 Form의 제출 상태를 확인합니다. |
| `useActionState` | `react` | Action의 반환값과 Pending 상태를 관리합니다. |
| `useOptimistic` | `react` | 서버 응답 전 임시 UI 상태를 관리합니다. |
| `requestFormReset` | `react-dom` | 지정한 폼의 초기화를 요청합니다. |
| `startTransition` | `react` | 업데이트를 Transition으로 실행합니다. |
| `useTransition` | `react` | Transition의 Pending 상태를 관리합니다. |

각 API는 서로 다른 역할을 수행하므로 폼의 요구사항에 맞게 조합해야 합니다.

## 14. Form Submission 방식 비교

| 구분 | onSubmit | Function Action | Server Function Action |
|---|---|---|---|
| 주요 실행 위치 | 클라이언트 | 클라이언트 | 서버 |
| 연결 방식 | 이벤트 핸들러 | `action`에 함수 전달 | 서버 함수 전달 |
| 데이터 전달 | 이벤트에서 직접 수집 | FormData 자동 전달 | FormData 자동 전달 |
| Transition | 직접 구성 가능 | React가 자동 구성 | React가 자동 구성 |
| Pending 상태 | 직접 관리 | React Hook 활용 | React Hook 활용 |
| 오류 처리 | 직접 구현 | Error Boundary 및 State 활용 | 서버 결과 및 Error Boundary 활용 |
| Progressive Enhancement | 별도 구현 필요 | 일반적으로 JavaScript 실행 환경에 의존 | 지원 환경에서 활용 가능 |

일반적인 클라이언트 측 제출 처리에는 Function Action을 사용할 수 있습니다.

서버에서 직접 데이터 변경을 처리하고 Progressive Enhancement를 지원해야 하는 경우에는 Server Function Action을 고려할 수 있습니다.

## 15. 정리

Form Actions는 React 19에서 도입된 폼 제출 처리 모델로, 함수형 `action` 속성을 통해 폼 제출과 데이터 변경 로직을 연결합니다.

React는 Form Action을 Transition 내부에서 실행하고, 제출된 데이터를 FormData로 전달합니다. 또한 `useFormStatus`를 통해 제출 상태를 확인하고, `useActionState`를 통해 Action의 반환값과 Pending 상태를 관리할 수 있습니다.

`useOptimistic`을 활용하면 서버 응답을 기다리지 않고 UI를 먼저 갱신할 수 있으며, Server Functions와 결합하면 서버 측 데이터 변경 작업과 Progressive Enhancement를 지원하는 구조를 구성할 수 있습니다.

Form Actions를 설계할 때 고려해야 할 핵심 사항은 다음과 같습니다.

- 일반 Form Action과 `useActionState`를 사용하는 Action의 함수 시그니처를 구분합니다.
- 입력 데이터를 전달하려면 각 입력 요소에 `name`을 지정합니다.
- `useFormStatus`는 해당 Form 내부의 자식 컴포넌트에서 호출합니다.
- Action의 반환값을 UI에 반영하려면 `useActionState`를 활용합니다.
- Uncontrolled 입력 필드와 Controlled 입력 필드의 초기화 동작을 구분합니다.
- 예상 가능한 업무 오류는 State로 반환하고 예상하지 못한 예외는 별도로 처리합니다.
- `useOptimistic`은 실제 서버 데이터를 대체하는 State가 아니라 임시 UI 상태를 관리하는 기능입니다.
- Server Function을 사용할 때는 서버 측 검증과 권한 검사를 반드시 수행합니다.
- Progressive Enhancement는 Server Function을 지원하는 실행 환경을 전제로 합니다.

## 16. 참고자료

### React 공식 문서

- [React 19 - Actions](https://react.dev/blog/2024/12/05/react-19)
- [React - `<form>`](https://react.dev/reference/react-dom/components/form)
- [React - `useActionState`](https://react.dev/reference/react/useActionState)
- [React - `useOptimistic`](https://react.dev/reference/react/useOptimistic)
- [React - `useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [React - `requestFormReset`](https://react.dev/reference/react-dom/requestFormReset)
- [React - `useTransition`](https://react.dev/reference/react/useTransition)
- [React - `startTransition`](https://react.dev/reference/react/startTransition)

### Server Functions 및 React Server Components

- [React - Server Functions](https://react.dev/reference/rsc/server-functions)
- [React - `'use server'` directive](https://react.dev/reference/rsc/use-server)

### 프레임워크 참고자료

- [Next.js - Forms](https://nextjs.org/docs/app/guides/forms)