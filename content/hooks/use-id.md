

# useId

## 1. useId란?

`useId`는 컴포넌트 내부에서 고유한 ID를 생성하기 위한 React Hook입니다.

HTML 요소는 `id` 속성을 통해 다른 요소와 연결할 수 있습니다. 대표적으로 `label`과 `input`을 연결하거나, 입력 요소에 대한 설명 및 오류 메시지를 접근성 속성으로 연결할 때 사용합니다.

컴포넌트가 여러 번 렌더링되거나 동일한 컴포넌트가 여러 개 존재하는 경우에도 각 요소의 ID가 충돌하지 않도록 관리해야 합니다.

`useId`는 이러한 ID를 안정적으로 생성할 수 있도록 지원합니다.

기본 문법은 다음과 같습니다.

```tsx
import { useId } from 'react';

function Example() {
  const id = useId();

  return <div id={id}>Example</div>;
}
```

- 반환값은 현재 컴포넌트의 고유한 ID 문자열입니다.
- 동일한 컴포넌트 인스턴스에서는 렌더링 사이에 ID가 유지됩니다.
- 컴포넌트 인스턴스마다 서로 다른 ID가 생성됩니다.
- 서버 사이드 렌더링과 Hydration 환경에서도 일관된 ID를 생성하도록 설계되어 있습니다.

`useId`는 React가 관리하는 ID를 생성하는 Hook이며, 데이터베이스의 기본 키나 비즈니스 데이터의 식별자를 생성하기 위한 기능은 아닙니다.

## 2. 기본 사용법

다음은 `label`과 `input`을 연결하는 예제입니다.

```tsx
import { useId } from 'react';

function EmailField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>이메일</label>
      <input id={id} type="email" />
    </div>
  );
}

export default function App() {
  return (
    <div>
      <EmailField />
      <EmailField />
    </div>
  );
}
```

`EmailField` 컴포넌트가 여러 번 사용되더라도 각 인스턴스는 서로 다른 ID를 생성합니다.

브라우저에 렌더링되는 HTML은 개념적으로 다음과 같은 형태입니다.

```html
<div>
  <div>
    <label for=":R1:">이메일</label>
    <input id=":R1:" type="email" />
  </div>

  <div>
    <label for=":R2:">이메일</label>
    <input id=":R2:" type="email" />
  </div>
</div>
```

실제 생성되는 ID 문자열은 React의 구현에 따라 달라질 수 있습니다.

중요한 점은 각 `label`의 `htmlFor` 값이 해당 `input`의 `id`와 일치한다는 것입니다.

React 컴포넌트를 재사용하더라도 각 인스턴스의 HTML 요소 간 연결 관계를 독립적으로 유지할 수 있습니다.

## 3. 접근성(Accessibility)을 위한 활용

`useId`의 대표적인 사용 목적은 접근성을 위한 HTML 요소 간 연결입니다.

HTML과 ARIA는 요소 간 관계를 ID로 표현할 수 있도록 지원합니다.

### 3.1. label과 input 연결

`label` 요소의 `htmlFor` 속성은 연결할 입력 요소의 `id`를 지정합니다.

```tsx
import { useId } from 'react';

function UsernameField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>사용자 이름</label>
      <input id={id} type="text" />
    </div>
  );
}
```

이 구조에서는 사용자가 레이블을 클릭해도 연결된 입력 요소에 포커스가 이동합니다.

또한 스크린 리더가 입력 요소의 레이블을 올바르게 인식할 수 있도록 지원합니다.

### 3.2. aria-describedby 연결

`aria-describedby`는 특정 요소에 대한 추가 설명을 제공하는 다른 요소의 ID를 참조합니다.

```tsx
import { useId } from 'react';

function PasswordField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>비밀번호</label>

      <input
        id={id}
        type="password"
        aria-describedby={`${id}-description`}
      />

      <p id={`${id}-description`}>
        8자 이상의 비밀번호를 입력하세요.
      </p>
    </div>
  );
}
```

입력 요소와 설명 요소의 ID를 연결하면 보조 기술이 해당 입력 요소의 추가 설명을 인식할 수 있습니다.

### 3.3. aria-errormessage 연결

입력 오류 메시지를 연결할 때도 `useId`를 활용할 수 있습니다.

```tsx
import { useId, useState } from 'react';

function EmailField() {
  const id = useId();
  const [error, setError] = useState('');

  return (
    <div>
      <label htmlFor={id}>이메일</label>

      <input
        id={id}
        type="email"
        aria-invalid={Boolean(error)}
        aria-errormessage={error ? `${id}-error` : undefined}
        onChange={() => setError('')}
      />

      {error && (
        <p id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
```

`aria-invalid`는 입력값이 유효하지 않은 상태임을 나타냅니다.

`aria-errormessage`는 해당 입력 요소와 오류 메시지를 연결합니다.

오류 메시지가 표시되는 경우에만 ID를 연결하도록 구성할 수 있습니다.

### 3.4. aria-labelledby 연결

`aria-labelledby`는 특정 요소의 접근 가능한 이름을 다른 요소의 ID를 통해 지정합니다.

```tsx
import { useId } from 'react';

function Dialog() {
  const id = useId();

  return (
    <section
      role="dialog"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`}>
        회원 정보
      </h2>

      <p>회원 정보를 확인합니다.</p>
    </section>
  );
}
```

이 예제에서는 제목 요소의 ID를 `aria-labelledby`에 지정하여 Dialog의 접근 가능한 이름을 연결합니다.

## 4. 하나의 컴포넌트에서 여러 ID 생성하기

하나의 컴포넌트에서 여러 HTML 요소의 ID가 필요한 경우 `useId`를 여러 번 호출할 수 있습니다.

```tsx
import { useId } from 'react';

function RegistrationForm() {
  const usernameId = useId();
  const emailId = useId();
  const passwordId = useId();

  return (
    <form>
      <div>
        <label htmlFor={usernameId}>사용자 이름</label>
        <input id={usernameId} />
      </div>

      <div>
        <label htmlFor={emailId}>이메일</label>
        <input id={emailId} type="email" />
      </div>

      <div>
        <label htmlFor={passwordId}>비밀번호</label>
        <input id={passwordId} type="password" />
      </div>
    </form>
  );
}
```

각 호출은 서로 다른 ID를 생성합니다.

다만 `useId`는 일반적인 Hook과 마찬가지로 컴포넌트 또는 Custom Hook의 최상위에서 호출해야 합니다.

조건문이나 반복문 내부에서 호출할 수 없습니다.

다음과 같은 코드는 잘못된 사용입니다.

```tsx
function RegistrationForm() {
  const fields = ['username', 'email', 'password'];

  return (
    <form>
      {fields.map((field) => {
        // 잘못된 사용: 반복문 내부에서 Hook 호출
        const id = useId();

        return <input key={field} id={id} />;
      })}
    </form>
  );
}
```

반복되는 요소마다 ID가 필요한 경우에는 별도의 컴포넌트로 분리하거나 하나의 `useId` 반환값을 기반으로 하위 ID를 구성할 수 있습니다.

```tsx
import { useId } from 'react';

function RegistrationForm() {
  const baseId = useId();

  const fields = ['username', 'email', 'password'];

  return (
    <form>
      {fields.map((field) => {
        const id = `${baseId}-${field}`;

        return (
          <div key={field}>
            <label htmlFor={id}>{field}</label>
            <input id={id} />
          </div>
        );
      })}
    </form>
  );
}
```

이 방식에서는 하나의 고유한 기본 ID를 생성하고, 필드 이름을 조합하여 각 요소의 ID를 구분합니다.

## 5. 서버 사이드 렌더링(SSR)과 Hydration

`useId`는 서버 사이드 렌더링 환경에서도 안정적으로 ID를 생성하도록 설계되었습니다.

SSR 환경에서는 서버에서 생성한 HTML과 클라이언트에서 Hydration 과정에서 생성하는 ID가 일치해야 합니다.

일반적인 난수 기반 ID 생성 방식을 사용하면 서버와 클라이언트에서 서로 다른 값이 생성될 수 있습니다.

```tsx
function Example() {
  // 권장하지 않는 방식
  const id = Math.random().toString(36);

  return <input id={id} />;
}
```

서버 렌더링 과정에서 `Math.random()`이 실행된 결과와 브라우저에서 Hydration 과정에서 실행된 결과는 서로 다를 수 있습니다.

이로 인해 서버 HTML과 클라이언트 렌더링 결과 사이에 불일치가 발생할 수 있습니다.

`useId`는 React의 컴포넌트 트리 구조를 기반으로 ID를 생성하므로 서버와 클라이언트에서 동일한 컴포넌트 트리가 렌더링된다면 일관된 ID를 유지할 수 있습니다.

```tsx
import { useId } from 'react';

function EmailField() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>이메일</label>
      <input id={id} type="email" />
    </div>
  );
}
```

SSR과 Hydration 환경에서도 동일한 요소 간 연결 관계를 유지할 수 있습니다.

단, 서버와 클라이언트의 초기 렌더링 트리가 서로 다르면 ID 불일치가 발생할 수 있습니다.

따라서 `useId`를 사용하더라도 서버와 클라이언트가 동일한 초기 컴포넌트 구조를 렌더링하도록 구성해야 합니다.

## 6. 여러 개의 React Root와 identifierPrefix

하나의 페이지에서 여러 개의 독립적인 React Root를 사용하는 경우 각 Root에서 생성하는 ID가 충돌하지 않도록 관리해야 합니다.

React는 `createRoot`와 `hydrateRoot`에서 `identifierPrefix` 옵션을 제공합니다.

이를 사용하면 Root마다 서로 다른 접두사를 지정할 수 있습니다.

### 6.1. createRoot

```tsx
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root')!,
  {
    identifierPrefix: 'main-',
  },
);

root.render(<App />);
```

### 6.2. hydrateRoot

```tsx
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('root')!,
  <App />,
  {
    identifierPrefix: 'main-',
  },
);
```

SSR을 사용하는 경우 서버 렌더링 시 지정한 접두사와 클라이언트의 `hydrateRoot`에 지정한 접두사가 일치해야 합니다.

예를 들어 서버에서 `identifierPrefix: 'main-'`을 사용했다면 클라이언트에서도 동일한 값을 지정해야 합니다.

여러 Root를 사용하는 경우 다음과 같이 구분할 수 있습니다.

```tsx
const rootA = createRoot(
  document.getElementById('root-a')!,
  {
    identifierPrefix: 'app-a-',
  },
);

const rootB = createRoot(
  document.getElementById('root-b')!,
  {
    identifierPrefix: 'app-b-',
  },
);
```

각 Root에 서로 다른 접두사를 지정하면 Root 간 ID 충돌 가능성을 방지할 수 있습니다.

## 7. useId를 사용하면 안 되는 경우

`useId`는 모든 종류의 ID를 생성하기 위한 범용 식별자가 아닙니다.

특히 목록의 `key`나 비즈니스 데이터의 식별자로 사용해서는 안 됩니다.

### 7.1. 목록의 key로 사용하지 않습니다.

다음과 같은 코드는 적절하지 않습니다.

```tsx
import { useId } from 'react';

function ItemList({ items }: { items: string[] }) {
  const id = useId();

  return (
    <ul>
      {items.map((item) => (
        <li key={`${id}-${item}`}>
          {item}
        </li>
      ))}
    </ul>
  );
}
```

`useId`는 접근성 속성 등에 사용할 ID를 생성하기 위한 Hook입니다.

React의 `key`는 목록에서 각 항목의 식별과 변경 사항 추적을 위한 별도의 개념입니다.

목록의 `key`는 데이터가 가진 고유하고 안정적인 식별자를 사용해야 합니다.

```tsx
type User = {
  id: number;
  name: string;
};

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

데이터에 고유 식별자가 없다면 데이터를 생성하거나 수신하는 단계에서 안정적인 식별자를 관리하는 것이 좋습니다.

### 7.2. 데이터베이스 ID로 사용하지 않습니다.

`useId`는 React 렌더링 환경에 종속된 ID 생성 기능입니다.

따라서 다음과 같은 목적으로 사용해서는 안 됩니다.

- 데이터베이스 기본 키 생성
- API 요청의 리소스 식별자 생성
- 사용자 계정 식별자 생성
- 비즈니스 도메인의 고유 ID 생성

이러한 식별자는 데이터 생성 및 관리 계층에서 별도로 관리해야 합니다.

### 7.3. 임의의 고유 문자열이 필요한 경우에는 적절하지 않습니다.

`useId`는 컴포넌트 트리를 기반으로 생성되는 ID이므로 UUID와 같은 범용 고유 식별자 생성 기능과 다릅니다.

독립적인 데이터 객체나 서버 리소스에 대한 고유 식별자가 필요하다면 UUID 또는 해당 시스템에서 제공하는 식별자 생성 방식을 사용해야 합니다.

## 8. useId 사용 시 주의사항

### 8.1. Hook 호출 규칙을 준수해야 합니다.

`useId`는 React Hook이므로 컴포넌트 또는 Custom Hook의 최상위에서 호출해야 합니다.

조건문, 반복문, 중첩 함수 내부에서 호출할 수 없습니다.

```tsx
function Example({ enabled }: { enabled: boolean }) {
  // 올바른 사용
  const id = useId();

  if (!enabled) {
    return null;
  }

  return <div id={id}>Content</div>;
}
```

### 8.2. 동일한 컴포넌트 인스턴스에서 ID가 유지됩니다.

`useId`는 컴포넌트가 다시 렌더링되더라도 동일한 컴포넌트 인스턴스에서 동일한 ID를 유지합니다.

따라서 렌더링마다 새로운 ID가 생성되는 방식으로 동작하지 않습니다.

### 8.3. ID 문자열의 형식에 의존하지 않습니다.

React가 생성하는 ID 문자열은 내부 구현에 따라 달라질 수 있습니다.

ID가 특정 숫자나 문자열 형식으로 생성된다고 가정해서는 안 됩니다.

또한 생성된 ID를 분석하거나 변환하여 별도의 비즈니스 로직에 활용하지 않는 것이 좋습니다.

### 8.4. CSS 선택자에서 사용할 때 주의해야 합니다.

`useId`가 반환하는 문자열은 HTML의 `id` 속성에 사용할 수 있습니다.

다만 생성된 문자열에는 CSS 선택자에서 별도 처리가 필요한 문자가 포함될 수 있습니다.

CSS에서 해당 ID를 직접 선택해야 한다면 `CSS.escape()`를 활용할 수 있습니다.

```tsx
const selector = `#${CSS.escape(id)}`;
```

가능하다면 ID 문자열을 CSS 선택자로 직접 조합하는 대신 컴포넌트의 클래스나 데이터 속성을 사용하는 방식도 고려할 수 있습니다.

## 9. 정리

`useId`는 React 컴포넌트에서 접근성을 위한 고유한 ID를 생성하는 Hook입니다.

주요 특징은 다음과 같습니다.

- 컴포넌트 인스턴스마다 고유한 ID를 생성합니다.
- 동일한 컴포넌트 인스턴스에서는 렌더링 사이에 ID가 유지됩니다.
- `label`과 `input`의 연결에 활용할 수 있습니다.
- `aria-describedby`, `aria-labelledby`, `aria-errormessage` 등의 접근성 속성과 함께 사용할 수 있습니다.
- SSR과 Hydration 환경에서 일관된 ID를 생성하도록 설계되어 있습니다.
- 여러 React Root에서는 `identifierPrefix`를 사용하여 ID 충돌을 방지할 수 있습니다.
- 목록의 `key`나 데이터베이스 식별자로 사용해서는 안 됩니다.

`useId`는 컴포넌트 재사용성과 접근성을 함께 고려해야 하는 React 애플리케이션에서 유용합니다.

특히 Form, Dialog, Tooltip, Accordion 등의 컴포넌트에서 HTML 요소 간 연결 관계를 안정적으로 관리하는 데 적합합니다.

## 참고 자료

- [React 공식 문서 - useId](https://react.dev/reference/react/useId)
- [React 공식 문서 - createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [React 공식 문서 - hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
- [React 공식 문서 - Rendering Lists](https://react.dev/learn/rendering-lists)
- [React 공식 문서 - Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)
- [MDN - HTML id global attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)
- [MDN - aria-describedby](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)
- [MDN - CSS.escape()](https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape_static)

