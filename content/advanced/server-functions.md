

# Server Functions

## 1. Server Functions란?

**Server Functions**는 클라이언트에서 호출할 수 있지만 실제 함수 실행은 서버에서 수행되는 비동기 함수입니다.

React Server Components 환경에서 제공되는 기능으로, 클라이언트 컴포넌트가 서버에 정의된 함수를 호출하여 데이터 변경이나 서버 측 작업을 수행할 수 있도록 합니다.

일반적인 클라이언트 애플리케이션에서는 서버의 데이터를 변경하기 위해 API 엔드포인트를 별도로 정의하고 HTTP 요청을 직접 작성해야 합니다.

Server Functions를 사용하면 서버에서 실행할 함수를 정의하고, 클라이언트에서는 일반 함수를 호출하는 것과 유사한 방식으로 사용할 수 있습니다.

```tsx
// app/actions.ts

"use server";

export async function createUser(name: string) {
  await db.user.create({
    data: { name },
  });
}
```

```tsx
// components/UserForm.tsx

"use client";

import { createUser } from "@/app/actions";

export default function UserForm() {
  async function handleSubmit() {
    await createUser("Alice");
  }

  return (
    <button onClick={handleSubmit}>
      Create User
    </button>
  );
}
```

위 예제에서 `createUser`는 서버에서 실행되는 함수입니다.

Client Component가 `createUser`를 호출하면 React와 이를 지원하는 프레임워크가 네트워크 요청을 구성하여 서버에서 함수를 실행합니다. 함수의 반환값이 있다면 직렬화되어 클라이언트로 전달됩니다.

따라서 클라이언트에서 서버 함수를 호출하는 코드를 작성하더라도 함수의 실제 구현이 브라우저에서 실행되는 것은 아닙니다.

Server Functions는 데이터베이스 접근, 데이터 생성 및 수정, 서버 측 비즈니스 로직 실행 등 서버에서 처리해야 하는 작업에 활용할 수 있습니다.

## 2. Server Functions와 Server Actions

React 공식 문서에서는 Server Functions와 Server Actions를 구분합니다.

Server Actions는 Server Function을 React의 Action으로 사용하는 경우를 의미합니다.

| 구분 | 설명 |
|---|---|
| Server Function | 서버에서 실행되는 비동기 함수 |
| Server Action | React의 Action으로 사용되는 Server Function |
| Action | 사용자 상호작용에 의해 실행되는 비동기 작업을 처리하는 React 패턴 |

예를 들어 Server Function을 일반적인 이벤트 핸들러 내부에서 호출할 수 있습니다.

```tsx
"use client";

import { createUser } from "@/app/actions";

export default function CreateButton() {
  return (
    <button onClick={() => createUser("Alice")}>
      Create User
    </button>
  );
}
```

이 경우 Server Function을 호출하고 있지만, 호출 자체가 React의 Action으로 구성된 것은 아닙니다.

반면 Server Function을 `<form>`의 `action` 속성에 전달하면 React의 Action으로 실행됩니다.

```tsx
import { createUser } from "@/app/actions";

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <button type="submit">Create User</button>
    </form>
  );
}
```

이처럼 Server Function은 여러 방식으로 호출할 수 있으며, 그중 Action으로 사용되는 경우를 Server Action이라고 합니다.

React는 2024년 9월까지 Server Functions를 Server Actions라는 이름으로 통칭했으나, 현재는 두 개념을 구분하여 사용합니다.

## 3. `'use server'` 지시어

`'use server'`는 함수가 서버에서 실행되는 Server Function임을 표시하는 React 지시어입니다.

함수 본문 또는 모듈 최상단에 선언할 수 있습니다.

### 3.1. 함수 단위 선언

개별 함수에 `'use server'`를 선언하면 해당 함수만 Server Function으로 지정됩니다.

```tsx
// app/page.tsx

import CreateButton from "@/components/CreateButton";

export default function Page() {
  async function createNote() {
    "use server";

    await db.note.create({
      data: {
        title: "New Note",
      },
    });
  }

  return <CreateButton action={createNote} />;
}
```

```tsx
// components/CreateButton.tsx

"use client";

interface CreateButtonProps {
  action: () => Promise<void>;
}

export default function CreateButton({
  action,
}: CreateButtonProps) {
  return (
    <button onClick={() => action()}>
      Create Note
    </button>
  );
}
```

Server Component 내부에서 선언한 `createNote`는 Server Function입니다.

React가 서버 컴포넌트를 렌더링할 때 함수에 대한 참조를 생성하고, 이를 Client Component에 전달합니다.

Client Component에서 해당 참조를 호출하면 실제 함수는 서버에서 실행됩니다.

### 3.2. 모듈 단위 선언

파일 최상단에 `'use server'`를 선언하면 해당 모듈에서 Export하는 함수들을 Server Functions로 지정할 수 있습니다.

```tsx
// app/actions.ts

"use server";

export async function createUser(name: string) {
  await db.user.create({
    data: { name },
  });
}

export async function deleteUser(id: number) {
  await db.user.delete({
    where: { id },
  });
}

export async function updateUser(
  id: number,
  name: string,
) {
  await db.user.update({
    where: { id },
    data: { name },
  });
}
```

Client Component에서는 해당 함수를 Import하여 사용할 수 있습니다.

```tsx
// components/UserActions.tsx

"use client";

import {
  createUser,
  deleteUser,
  updateUser,
} from "@/app/actions";

export default function UserActions() {
  return (
    <div>
      <button onClick={() => createUser("Alice")}>
        Create
      </button>

      <button onClick={() => updateUser(1, "Bob")}>
        Update
      </button>

      <button onClick={() => deleteUser(1)}>
        Delete
      </button>
    </div>
  );
}
```

모듈 단위 선언은 여러 Server Functions를 별도의 파일에서 관리할 때 유용합니다.

다만 모듈 단위로 선언하면 Export되는 함수가 Server Function으로 취급되므로, 해당 파일에 서버에서 실행할 함수만 배치하는 것이 좋습니다.

### 3.3. `'use server'` 선언 시 주의사항

`'use server'`를 사용할 때는 다음 사항을 확인해야 합니다.

- 함수 본문 또는 모듈의 최상단에 선언해야 합니다.
- 지시어는 작은따옴표 또는 큰따옴표를 사용해야 합니다.
- 함수 단위로 선언하는 경우 비동기 함수여야 합니다.
- 모듈 단위로 선언하는 경우 클라이언트에서 Import할 Server Function을 Export해야 합니다.
- Server Function의 인자와 반환값은 React가 지원하는 직렬화 형식이어야 합니다.
- Server Function은 React Server Components를 지원하는 프레임워크 또는 번들러 환경이 필요합니다.

특히 `'use server'`는 Server Component를 선언하는 지시어가 아닙니다.

Server Component는 별도의 지시어 없이 기본적으로 서버 컴포넌트로 취급되는 환경에서 사용하며, `'use server'`는 서버에서 실행할 함수를 표시하는 데 사용합니다.

## 4. Server Functions의 실행 과정

Server Functions는 클라이언트에서 호출할 수 있지만 함수 자체는 서버에서 실행됩니다.

실행 과정은 다음과 같습니다.

1. 서버 코드에서 `'use server'`가 선언된 함수를 정의합니다.
2. 프레임워크 또는 번들러가 Server Function에 대한 참조를 생성합니다.
3. Client Component가 해당 참조를 전달받거나 Import합니다.
4. 사용자가 이벤트를 발생시키면 Client Component에서 Server Function을 호출합니다.
5. React와 프레임워크가 서버에 실행 요청을 전달합니다.
6. 서버에서 실제 함수가 실행됩니다.
7. 함수의 반환값이 직렬화되어 클라이언트로 전달됩니다.
8. React가 반환값이나 변경된 데이터를 기반으로 UI를 갱신합니다.

```text
Client Component
       |
       | Server Function 호출
       v
React / Framework
       |
       | Network Request
       v
Server
       |
       | 실제 함수 실행
       v
Database / External API
       |
       | 실행 결과
       v
Server Function
       |
       | Serialized Response
       v
Client Component
       |
       | State / UI Update
       v
Updated UI
```

Server Function을 호출하는 코드는 일반 함수 호출과 유사하지만, 실제로는 네트워크를 통한 서버 실행 요청이 발생합니다.

따라서 일반적인 로컬 함수 호출과 동일한 성능이나 실행 특성을 기대해서는 안 됩니다.

## 5. Server Functions와 Form

Server Functions의 대표적인 사용 사례는 서버 데이터 변경입니다.

React 19에서는 `<form>`의 `action` 속성에 Server Function을 전달하여 폼 제출을 서버 함수 실행과 연결할 수 있습니다.

### 5.1. 기본 Form Action

```tsx
// app/actions.ts

"use server";

export async function createUser(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Name is required");
  }

  await db.user.create({
    data: { name },
  });
}
```

```tsx
// components/UserForm.tsx

"use client";

import { createUser } from "@/app/actions";

export default function UserForm() {
  return (
    <form action={createUser}>
      <input
        type="text"
        name="name"
        placeholder="User name"
      />

      <button type="submit">
        Create User
      </button>
    </form>
  );
}
```

폼이 제출되면 React는 입력 요소 중 `name` 속성이 지정된 필드의 데이터를 `FormData`로 구성하여 Server Function의 첫 번째 인자로 전달합니다.

```tsx
const name = formData.get("name");
```

이때 `FormData.get()`의 반환값은 문자열 또는 `File`, `null` 등이 될 수 있으므로 입력값을 사용하기 전에 타입과 유효성을 검증해야 합니다.

### 5.2. Form Action의 특징

React 19에서 `<form action={function}>`을 사용하면 다음과 같은 기능을 제공합니다.

- 폼 제출을 React Action으로 실행합니다.
- 제출 데이터를 `FormData`로 전달합니다.
- Action 실행 중 Pending 상태를 확인할 수 있습니다.
- 성공적으로 실행되면 Uncontrolled Form 필드를 자동으로 초기화합니다.
- Error Boundary를 통한 오류 전파를 지원합니다.
- Server Function과 함께 사용하면 JavaScript 로딩 전에도 폼 제출이 가능한 Progressive Enhancement를 지원합니다.

기존 `onSubmit` 방식에서는 이벤트 객체를 전달받고 `preventDefault()`를 호출한 다음 직접 요청을 구성하는 경우가 많았습니다.

```tsx
"use client";

export default function UserForm() {
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name");

    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <button type="submit">Create</button>
    </form>
  );
}
```

반면 Server Function을 `action`에 전달하면 React가 제출 과정과 서버 함수 호출을 연결하므로 별도의 요청 코드를 직접 작성하지 않아도 됩니다.

### 5.3. 추가 데이터 전달

폼 입력값 이외에 별도의 ID나 식별자가 필요한 경우 Hidden Input 또는 `bind()`를 사용할 수 있습니다.

Hidden Input을 사용하는 방법은 다음과 같습니다.

```tsx
"use client";

import { deleteUser } from "@/app/actions";

export default function DeleteUserForm({
  userId,
}: {
  userId: number;
}) {
  return (
    <form action={deleteUser}>
      <input
        type="hidden"
        name="userId"
        value={userId}
      />

      <button type="submit">
        Delete User
      </button>
    </form>
  );
}
```

서버 함수는 `FormData`에서 해당 값을 조회합니다.

```tsx
// app/actions.ts

"use server";

export async function deleteUser(formData: FormData) {
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }

  await db.user.delete({
    where: {
      id: Number(userId),
    },
  });
}
```

다른 방법으로 `bind()`를 사용하면 추가 인자를 Server Function에 전달할 수 있습니다.

```tsx
"use client";

import { deleteUser } from "@/app/actions";

export default function DeleteUserForm({
  userId,
}: {
  userId: number;
}) {
  const deleteUserWithId = deleteUser.bind(null, userId);

  return (
    <form action={deleteUserWithId}>
      <button type="submit">
        Delete User
      </button>
    </form>
  );
}
```

```tsx
// app/actions.ts

"use server";

export async function deleteUser(
  userId: number,
  formData: FormData,
) {
  await db.user.delete({
    where: { id: userId },
  });
}
```

`bind()`로 전달한 인자는 `FormData`보다 먼저 Server Function에 전달됩니다.

Hidden Input과 `bind()` 모두 클라이언트에서 전달되는 값을 신뢰해서는 안 됩니다. 서버에서 해당 사용자가 대상 데이터에 접근하거나 변경할 권한이 있는지 확인해야 합니다.

## 6. useActionState

`useActionState`는 Action의 실행 결과와 Pending 상태를 관리하는 React Hook입니다.

Server Function을 Form Action으로 사용할 때 서버에서 반환한 결과를 UI에 반영하는 데 활용할 수 있습니다.

```tsx
const [state, formAction, isPending] = useActionState(
  action,
  initialState,
);
```

반환값은 다음과 같습니다.

| 반환값 | 설명 |
|---|---|
| `state` | 가장 최근 Action의 반환값 또는 현재 상태 |
| `formAction` | Form에 전달할 Action 함수 |
| `isPending` | Action 실행 중인지 나타내는 Boolean |

### 6.1. 기본 사용법

```tsx
// app/actions.ts

"use server";

interface FormState {
  error: string | null;
}

export async function updateName(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get("name");

  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return {
      error: "Name is required",
    };
  }

  await db.user.update({
    where: { id: 1 },
    data: { name },
  });

  return {
    error: null,
  };
}
```

```tsx
// components/UpdateNameForm.tsx

"use client";

import { useActionState } from "react";
import { updateName } from "@/app/actions";

const initialState = {
  error: null,
};

export default function UpdateNameForm() {
  const [state, formAction, isPending] = useActionState(
    updateName,
    initialState,
  );

  return (
    <form action={formAction}>
      <input
        type="text"
        name="name"
        disabled={isPending}
      />

      <button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </button>

      {state.error && (
        <p role="alert">{state.error}</p>
      )}
    </form>
  );
}
```

`useActionState`를 사용하면 서버 함수의 반환값을 `state`로 관리할 수 있습니다.

위 예제에서는 입력값이 유효하지 않은 경우 서버 함수가 오류 메시지를 반환하고, Client Component가 해당 메시지를 화면에 표시합니다.

### 6.2. Server Function의 인자 구조

`useActionState`를 통해 Server Function을 호출하면 함수의 인자 구조가 변경됩니다.

일반적인 Form Action에서는 `FormData`가 첫 번째 인자로 전달됩니다.

```tsx
export async function updateName(formData: FormData) {
  // ...
}
```

하지만 `useActionState`로 감싸면 이전 상태가 첫 번째 인자로 추가됩니다.

```tsx
export async function updateName(
  previousState: FormState,
  formData: FormData,
) {
  // ...
}
```

따라서 기존 Server Function을 `useActionState`와 함께 사용하려면 함수의 인자 구조를 확인해야 합니다.

### 6.3. Progressive Enhancement

`useActionState`는 Server Function과 함께 사용하면 Progressive Enhancement를 지원합니다.

Progressive Enhancement는 JavaScript가 로드되기 전이거나 Hydration이 완료되기 전에도 기본적인 기능을 사용할 수 있도록 구성하는 접근 방식입니다.

```tsx
"use client";

import { useActionState } from "react";
import { createUser } from "@/app/actions";

export default function UserForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    { message: "" },
    "/users/create",
  );

  return (
    <form action={formAction}>
      <input name="name" />

      <button type="submit" disabled={isPending}>
        Create
      </button>

      <p>{state.message}</p>
    </form>
  );
}
```

세 번째 인자로 `permalink`를 전달하면 JavaScript가 로드되기 전에 폼이 제출되었을 때 지정된 URL로 이동할 수 있습니다.

해당 URL에서도 동일한 폼 컴포넌트와 Server Function, `permalink` 구성을 사용해야 반환 상태를 이어서 처리할 수 있습니다.

## 7. useFormStatus

`useFormStatus`는 현재 Form의 제출 상태를 확인하는 React DOM Hook입니다.

Form Action이 실행 중인지 확인하고, 제출 버튼을 비활성화하거나 로딩 상태를 표시하는 데 활용할 수 있습니다.

```tsx
const { pending, data, method, action } = useFormStatus();
```

| 반환값 | 설명 |
|---|---|
| `pending` | 부모 Form의 Action 실행 여부 |
| `data` | 제출 중인 FormData |
| `method` | Form의 HTTP Method |
| `action` | 부모 Form에 지정된 Action |

### 7.1. 기본 사용법

```tsx
"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit"}
    </button>
  );
}
```

`useFormStatus`는 해당 Hook을 호출하는 컴포넌트의 부모 Form 상태를 확인합니다.

따라서 Form 내부에서 별도의 자식 컴포넌트로 분리하여 사용해야 합니다.

```tsx
"use client";

import { createUser } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" />
      <SubmitButton />
    </form>
  );
}
```

`useFormStatus`를 Form을 렌더링하는 컴포넌트 자체에서 호출하면 해당 컴포넌트가 반환하는 Form의 상태를 확인할 수 없습니다.

```tsx
// 잘못된 사용 예시

"use client";

import { useFormStatus } from "react-dom";

export default function UserForm() {
  const { pending } = useFormStatus();

  return (
    <form action={createUser}>
      <input name="name" />
      <button disabled={pending}>Submit</button>
    </form>
  );
}
```

위 예제에서 Hook이 확인하는 대상은 현재 컴포넌트의 부모 Form입니다. 반환하는 Form은 아직 Hook을 호출하는 컴포넌트의 하위 요소이므로 해당 Form의 제출 상태를 확인하지 못합니다.

## 8. useOptimistic

`useOptimistic`은 서버 작업이 완료되기 전에 UI를 먼저 갱신하는 낙관적 업데이트(Optimistic Update)를 구현하는 React Hook입니다.

서버 응답을 기다리는 동안 사용자에게 즉각적인 피드백을 제공할 수 있습니다.

예를 들어 댓글을 등록하는 경우 실제 서버 저장이 완료되기 전에 댓글이 화면에 추가된 것처럼 표시할 수 있습니다.

```tsx
const [optimisticState, addOptimistic] = useOptimistic(
  state,
  updateFunction,
);
```

- `optimisticState`: 낙관적 업데이트가 반영된 상태입니다.
- `addOptimistic`: 낙관적 업데이트를 적용하는 함수입니다.

### 8.1. 기본 사용법

```tsx
"use client";

import { useOptimistic } from "react";
import { addComment } from "@/app/actions";

interface Comment {
  id: number;
  message: string;
}

export default function CommentList({
  comments,
}: {
  comments: Comment[];
}) {
  const [optimisticComments, addOptimisticComment] =
    useOptimistic(
      comments,
      (state, newComment: Comment) => [
        ...state,
        newComment,
      ],
    );

  async function submitAction(formData: FormData) {
    const message = formData.get("message");

    if (
      typeof message !== "string" ||
      message.trim() === ""
    ) {
      return;
    }

    const optimisticComment = {
      id: Date.now(),
      message,
    };

    addOptimisticComment(optimisticComment);

    await addComment(message);
  }

  return (
    <div>
      <ul>
        {optimisticComments.map((comment) => (
          <li key={comment.id}>
            {comment.message}
          </li>
        ))}
      </ul>

      <form action={submitAction}>
        <input name="message" />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}
```

위 예제에서는 댓글을 서버에 저장하기 전에 `addOptimisticComment`를 호출하여 화면에 먼저 반영합니다.

서버 작업이 완료되면 실제 서버 데이터가 반영된 상태로 전환됩니다.

낙관적 업데이트는 서버 작업의 성공을 보장하지 않습니다. 서버 작업이 실패할 수 있으므로 실패 처리와 실제 데이터 동기화도 함께 설계해야 합니다.

## 9. Form 외부에서 Server Functions 호출하기

Server Functions는 Form Action 외부에서도 호출할 수 있습니다.

버튼 클릭, 사용자 선택, 특정 UI 이벤트 등에 따라 서버 함수를 실행할 수 있습니다.

다만 Form Action과 달리 일반 이벤트 핸들러에서 직접 호출하는 경우에는 React의 Transition으로 감싸는 것이 권장됩니다.

### 9.1. useTransition 활용

```tsx
"use client";

import { useState, useTransition } from "react";
import { incrementLike } from "@/app/actions";

export default function LikeButton() {
  const [likeCount, setLikeCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const nextCount = await incrementLike();

      startTransition(() => {
        setLikeCount(nextCount);
      });
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Updating..." : `Like ${likeCount}`}
    </button>
  );
}
```

```tsx
// app/actions.ts

"use server";

export async function incrementLike() {
  const result = await db.post.update({
    where: { id: 1 },
    data: {
      likeCount: {
        increment: 1,
      },
    },
  });

  return result.likeCount;
}
```

`useTransition`을 사용하면 Server Function 실행 중 `isPending` 상태를 확인할 수 있습니다.

또한 Transition은 비동기 작업을 React의 렌더링 우선순위 관리와 연결합니다.

비동기 작업이 `await` 이후 완료된 다음 수행하는 State 업데이트는 별도의 `startTransition`으로 감싸야 하는 경우가 있으므로 주의해야 합니다.

### 9.2. Form Action과 Transition

Form의 `action` 또는 버튼의 `formAction`에 함수를 전달하면 React가 해당 작업을 자동으로 Transition으로 실행합니다.

따라서 Form Action에서 Pending 상태를 관리하기 위해 반드시 `useTransition`을 직접 사용할 필요는 없습니다.

일반 이벤트 핸들러에서 Server Function을 호출하는 경우에는 `useTransition`을 활용하여 실행 상태를 관리하는 것이 좋습니다.

## 10. 오류 처리

Server Functions에서 발생한 오류는 클라이언트에 전달되는 과정에서 별도로 처리해야 합니다.

오류의 성격에 따라 다음 두 가지 방식을 구분할 수 있습니다.

### 10.1. 예상 가능한 오류 반환

사용자 입력 오류, 중복 데이터, 비즈니스 규칙 위반 등 예상 가능한 오류는 반환값으로 전달할 수 있습니다.

```tsx
// app/actions.ts

"use server";

interface ActionState {
  message: string;
  success: boolean;
}

export async function createUser(
  previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name");

  if (
    typeof name !== "string" ||
    name.trim() === ""
  ) {
    return {
      success: false,
      message: "Name is required",
    };
  }

  const existingUser = await db.user.findUnique({
    where: { name },
  });

  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  await db.user.create({
    data: { name },
  });

  return {
    success: true,
    message: "User created successfully",
  };
}
```

이러한 방식은 예상 가능한 오류를 일반적인 애플리케이션 상태로 관리할 수 있다는 장점이 있습니다.

### 10.2. 예기치 않은 오류 처리

데이터베이스 연결 실패, 서버 내부 오류 등 예상하지 못한 오류는 예외를 발생시켜 Error Boundary로 전달할 수 있습니다.

```tsx
"use server";

export async function createUser(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string") {
    throw new Error("Invalid name");
  }

  await db.user.create({
    data: { name },
  });
}
```

Server Function이 Action으로 실행되는 과정에서 발생한 예외는 가장 가까운 Error Boundary로 전파될 수 있습니다.

따라서 애플리케이션에서는 다음과 같이 오류 처리 방식을 구분하는 것이 좋습니다.

| 오류 유형 | 처리 방식 |
|---|---|
| 필수 입력 누락 | 상태 반환 |
| 입력 형식 오류 | 상태 반환 |
| 중복 데이터 | 상태 반환 |
| 권한 부족 | 정책에 따라 오류 또는 상태 반환 |
| 데이터베이스 연결 실패 | 예외 및 Error Boundary |
| 예상하지 못한 서버 오류 | 예외 및 Error Boundary |

단, 인증 및 권한 오류를 단순히 UI에 표시하는 것만으로 보안 처리가 완료되는 것은 아닙니다. 서버에서 실제 작업을 수행하기 전에 반드시 접근 권한을 확인해야 합니다.

## 11. 직렬화 제약

Server Functions는 네트워크를 통해 호출되므로 인자와 반환값을 직렬화할 수 있어야 합니다.

서버와 클라이언트는 서로 다른 실행 환경이므로 일반적인 JavaScript 객체나 함수 참조를 제한 없이 전달할 수 없습니다.

React가 지원하는 대표적인 직렬화 가능 타입은 다음과 같습니다.

- `string`
- `number`
- `bigint`
- `boolean`
- `undefined`
- `null`
- 전역 Symbol Registry에 등록된 Symbol
- Array
- Map
- Set
- TypedArray
- ArrayBuffer
- Date
- FormData
- 직렬화 가능한 속성으로 구성된 일반 객체
- 다른 Server Function
- Promise

반면 다음과 같은 값은 지원되지 않습니다.

- React Element 및 JSX
- 일반 JavaScript 함수
- React Component 함수
- 일반적인 클래스 인스턴스
- 전역 Symbol Registry에 등록되지 않은 Symbol
- 이벤트 객체

따라서 Server Function에 전달할 데이터는 React가 지원하는 직렬화 형식에 맞춰 구성해야 합니다.

```tsx
// 직렬화 가능한 데이터 전달

await updateUser({
  id: 1,
  name: "Alice",
  createdAt: new Date(),
});
```

```tsx
// 지원되지 않는 일반 함수 전달 예시

await updateUser({
  id: 1,
  callback: () => {
    console.log("Updated");
  },
});
```

직렬화 규칙은 단순히 JSON 직렬화와 동일하지 않습니다. React가 별도로 지원하는 타입이 있으므로 공식 문서의 Serializable Arguments and Return Values 항목을 확인해야 합니다.

## 12. 보안 고려사항

Server Functions는 클라이언트에서 호출할 수 있는 서버 측 진입점입니다.

따라서 서버에서 실행된다는 이유만으로 자동으로 안전해지는 것은 아닙니다.

특히 Server Function의 인자는 클라이언트에서 전달되므로 신뢰할 수 없는 입력으로 취급해야 합니다.

### 12.1. 입력값 검증

클라이언트에서 전달되는 값은 개발자 도구나 임의의 요청을 통해 변경할 수 있습니다.

따라서 서버에서 입력값의 타입, 형식, 길이, 범위 등을 검증해야 합니다.

```tsx
"use server";

export async function updateUser(formData: FormData) {
  const userId = formData.get("userId");
  const name = formData.get("name");

  if (
    typeof userId !== "string" ||
    !/^\d+$/.test(userId)
  ) {
    throw new Error("Invalid user ID");
  }

  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.length > 100
  ) {
    throw new Error("Invalid name");
  }

  // 검증이 완료된 값으로 서버 작업 수행
}
```

### 12.2. 인증 및 권한 확인

로그인한 사용자라고 해서 모든 데이터에 접근할 수 있는 것은 아닙니다.

Server Function 내부에서 사용자의 인증 상태와 요청한 작업에 대한 권한을 확인해야 합니다.

```tsx
"use server";

export async function deleteUser(userId: number) {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const targetUser = await db.user.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  if (
    session.user.role !== "ADMIN" &&
    session.user.id !== targetUser.id
  ) {
    throw new Error("Forbidden");
  }

  await db.user.delete({
    where: { id: userId },
  });
}
```

위 예제에서는 로그인 여부뿐 아니라 대상 사용자에 대한 접근 권한까지 확인합니다.

### 12.3. Server Function을 공개 엔드포인트로 취급

Server Function은 클라이언트에서 호출할 수 있도록 노출되는 서버 측 진입점입니다.

따라서 다음과 같은 사항을 고려해야 합니다.

- 클라이언트가 임의의 인자를 전달할 수 있습니다.
- 숨겨진 버튼이나 UI 비활성화만으로 서버 작업을 보호할 수 없습니다.
- 인증 및 권한 검증은 서버에서 수행해야 합니다.
- 민감한 데이터가 반환값에 포함되지 않도록 주의해야 합니다.
- 반복 호출이나 대량 요청에 대한 제한을 고려해야 합니다.
- 데이터 변경 작업의 중복 실행 및 동시성 문제를 고려해야 합니다.

또한 사용하는 프레임워크가 제공하는 CSRF 방어, Origin 검증, 요청 제한 등의 보안 기능과 설정을 확인해야 합니다.

Server Function의 참조가 생성되거나 호출 URL이 외부에 노출되지 않는다는 사실만으로 보안이 보장되는 것은 아닙니다.

## 13. Server Functions와 일반 API의 차이

Server Functions와 일반 API는 모두 클라이언트에서 서버 작업을 요청하는 수단이지만 사용 방식과 목적에 차이가 있습니다.

| 구분 | Server Functions | 일반 API |
|---|---|---|
| 정의 방식 | 서버 함수로 정의 | HTTP Endpoint로 정의 |
| 호출 방식 | 함수 참조 호출 | HTTP 요청 |
| 실행 위치 | 서버 | 서버 |
| 네트워크 통신 | 프레임워크가 처리 | 직접 구현하거나 API Client 사용 |
| 인자 전달 | 지원되는 직렬화 형식 | HTTP Request 형식 |
| 반환값 | 직렬화된 함수 반환값 | HTTP Response |
| 주된 활용 | React 애플리케이션의 서버 작업 | 외부 시스템 및 다양한 클라이언트와의 통신 |

일반 API는 모바일 애플리케이션, 외부 서비스, 다른 백엔드 등 다양한 클라이언트가 접근해야 하는 경우에 적합합니다.

Server Functions는 React 애플리케이션 내부에서 서버 측 작업을 호출하고 데이터 변경을 처리하는 데 적합합니다.

Server Functions가 일반 API를 완전히 대체하는 것은 아닙니다. 애플리케이션의 통신 대상과 재사용 범위에 따라 적절한 방식을 선택해야 합니다.

## 14. Server Functions 사용 시 주의사항

### 14.1. React Server Components 지원 환경 필요

Server Functions는 React Server Components를 지원하는 프레임워크 또는 번들러 환경에서 사용해야 합니다.

일반적인 React 프로젝트에 `'use server'`를 선언하는 것만으로 서버 실행 기능이 자동으로 구현되지는 않습니다.

실제 프로젝트에서 사용하는 프레임워크가 Server Functions를 지원하는지 확인해야 합니다.

### 14.2. 데이터 조회보다 데이터 변경에 적합

Server Functions는 서버 상태를 변경하는 작업에 적합하도록 설계되었습니다.

대표적인 사용 사례는 다음과 같습니다.

- 사용자 생성 및 수정
- 게시글 작성 및 삭제
- 댓글 등록
- 장바구니 변경
- 주문 생성
- 서버 측 비즈니스 로직 실행

반면 반복적인 데이터 조회나 캐싱이 중요한 데이터 fetching에는 일반적인 서버 데이터 조회 기능이나 프레임워크의 데이터 로딩 메커니즘을 사용하는 것이 적합할 수 있습니다.

### 14.3. 일반 함수 호출과 실행 비용 구분

Server Function은 클라이언트에서 함수 호출 형태로 사용할 수 있지만 실제 실행에는 네트워크 통신이 필요합니다.

따라서 다음과 같은 방식은 주의해야 합니다.

- 렌더링 중 Server Function 호출
- 짧은 시간 동안 반복적인 Server Function 호출
- 대량 데이터를 한 번에 전달
- 단순 계산을 위해 서버 함수를 반복 호출

서버에서 처리할 필요가 없는 계산이나 UI 상태 변경은 Client Component 내부에서 처리하는 것이 적절합니다.

### 14.4. 중복 요청 및 동시성 고려

Server Function은 네트워크 요청으로 실행되므로 사용자의 반복 클릭, 재전송, 여러 탭에서의 요청 등으로 동일한 작업이 중복 실행될 수 있습니다.

데이터 변경 작업에서는 다음과 같은 방식을 고려해야 합니다.

- 중복 요청 방지
- Idempotency Key 적용
- 데이터베이스 트랜잭션
- Unique Constraint
- 낙관적 잠금 또는 동시성 제어

버튼을 비활성화하는 것만으로 서버 측 중복 실행을 완전히 방지할 수는 없습니다.

### 14.5. 오류와 반환값 설계

Server Function에서 예상 가능한 오류를 예외로 처리할지, 명시적인 반환 상태로 전달할지 구분해야 합니다.

입력 검증 실패나 비즈니스 규칙 위반처럼 예상 가능한 결과는 반환값으로 전달하면 UI에서 처리하기 쉽습니다.

예상하지 못한 시스템 오류는 예외로 전달하여 Error Boundary 등의 오류 처리 체계에서 관리할 수 있습니다.

### 14.6. 반환 데이터 최소화

Server Function의 반환값은 클라이언트로 전달됩니다.

따라서 서버 내부 객체 전체를 그대로 반환하지 않고 클라이언트에 필요한 데이터만 구성하여 반환하는 것이 좋습니다.

특히 인증 정보, 내부 식별자, 비밀 키, 개인정보 등 민감한 데이터가 포함되지 않도록 주의해야 합니다.

### 14.7. 버전 및 구현 참고

React 19에서 Server Functions 자체는 안정화되었으며 React의 마이너 버전 간 공개 기능의 호환성이 유지됩니다.

다만 Server Functions를 구현하는 React Server Components 번들러 및 프레임워크용 저수준 API는 별도의 안정성 정책을 따르며, React 19.x 마이너 버전 사이에서도 변경될 수 있습니다.

실제 프로젝트에서는 사용하는 프레임워크의 React 버전 호환성과 Server Functions 지원 범위를 확인해야 합니다. 프레임워크 및 번들러를 개발하거나 RSC 저수준 API에 직접 의존하는 경우에는 특정 React 버전에 고정하는 등의 추가적인 버전 관리가 필요할 수 있습니다.

## 15. 정리

Server Functions는 클라이언트에서 호출할 수 있지만 실제 실행은 서버에서 수행되는 비동기 함수입니다.

`'use server'` 지시어를 사용하여 Server Function을 정의할 수 있으며, 프레임워크와 번들러가 함수 참조 및 네트워크 통신을 처리합니다.

주요 특징은 다음과 같습니다.

- 서버에서 실행되는 비동기 함수를 클라이언트에서 호출할 수 있습니다.
- Server Component에서 정의하여 Client Component에 전달할 수 있습니다.
- 모듈 단위로 정의하여 Client Component에서 Import할 수 있습니다.
- React 19의 `<form action>`과 연동하여 폼 제출을 처리할 수 있습니다.
- `useActionState`를 통해 Action의 반환값과 Pending 상태를 관리할 수 있습니다.
- `useFormStatus`를 통해 부모 Form의 제출 상태를 확인할 수 있습니다.
- `useOptimistic`을 통해 서버 응답 이전에 UI를 낙관적으로 갱신할 수 있습니다.
- 서버에서 입력값 검증, 인증 및 권한 확인을 수행해야 합니다.

Server Functions는 일반적인 API 호출 코드를 간결하게 구성하고 React 애플리케이션의 서버 측 데이터 변경 작업을 통합하는 데 유용합니다.

다만 일반 API를 완전히 대체하는 기술은 아니며, 네트워크 통신과 직렬화가 발생하는 서버 실행 경계라는 점을 고려하여 설계해야 합니다.

## 16. 참고 자료

- [React 공식 문서 - Server Functions](https://react.dev/reference/rsc/server-functions)
- [React 공식 문서 - `'use server'`](https://react.dev/reference/rsc/use-server)
- [React 공식 문서 - `<form>`](https://react.dev/reference/react-dom/components/form)
- [React 공식 문서 - `useActionState`](https://react.dev/reference/react/useActionState)
- [React 공식 문서 - `useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [React 공식 문서 - `useOptimistic`](https://react.dev/reference/react/useOptimistic)
- [React 공식 문서 - `useTransition`](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [React 공식 문서 - React 19](https://react.dev/blog/2024/12/05/react-19)

