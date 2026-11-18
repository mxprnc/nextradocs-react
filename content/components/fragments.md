# React Fragments

## 1. 개요

React Fragment는 여러 React 요소를 별도의 DOM 노드로 감싸지 않고 하나의 그룹으로 반환할 수 있도록 하는 기능입니다.

React 컴포넌트는 일반적으로 하나의 React 노드를 반환해야 합니다. 여러 요소를 반환하려면 부모 요소로 감싸야 하지만, 이 과정에서 불필요한 DOM 요소가 추가될 수 있습니다.

Fragment를 사용하면 별도의 HTML 요소를 생성하지 않고 여러 요소를 그룹화할 수 있습니다.

React는 다음 두 가지 문법을 제공합니다.

- **Fragment 컴포넌트:** `<Fragment>...</Fragment>`
- **Fragment 단축 문법:** `<>...</>`

Fragment의 주요 특징은 다음과 같습니다.

- 여러 React 요소를 하나의 그룹으로 반환할 수 있습니다.
- 실제 DOM에 불필요한 Wrapper 요소를 생성하지 않습니다.
- React 컴포넌트의 반환 구조를 단순화할 수 있습니다.
- 목록 렌더링에서 `key`를 지정할 수 있습니다.
- DOM 구조와 CSS 레이아웃에 불필요한 영향을 주지 않습니다.

Fragment는 여러 요소를 논리적으로 그룹화하면서 실제 DOM 구조는 유지해야 하는 경우에 적합합니다.

## 2. Fragment가 필요한 이유

### 2.1. 단일 루트 요소 요구사항

React 컴포넌트는 여러 요소를 반환할 수 있지만, 반환 결과는 하나의 React 노드로 구성되어야 합니다.

다음 코드는 여러 요소를 독립적으로 반환하므로 유효하지 않습니다.

```tsx
function UserInfo() {
  return (
    <h1>User</h1>
    <p>User information</p>
  );
}
```

일반적으로 다음과 같이 부모 요소로 감싸서 해결할 수 있습니다.

```tsx
function UserInfo() {
  return (
    <div>
      <h1>User</h1>
      <p>User information</p>
    </div>
  );
}
```

하지만 단순히 여러 요소를 그룹화하기 위해 `div`를 추가하면 실제 DOM에도 불필요한 요소가 생성됩니다.

이러한 문제는 Fragment를 사용하여 해결할 수 있습니다.

```tsx
function UserInfo() {
  return (
    <>
      <h1>User</h1>
      <p>User information</p>
    </>
  );
}
```

Fragment는 React 요소들을 그룹화하지만 실제 DOM에는 별도의 Wrapper 요소를 생성하지 않습니다.

### 2.2. 불필요한 DOM 요소 방지

일반적인 Wrapper 요소와 Fragment의 DOM 결과는 다음과 같이 다릅니다.

**Wrapper 요소 사용**

```tsx
function Navigation() {
  return (
    <div>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </div>
  );
}
```

실제 DOM 구조:

```html
<div>
  <a href="/">Home</a>
  <a href="/about">About</a>
</div>
```

**Fragment 사용**

```tsx
function Navigation() {
  return (
    <>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </>
  );
}
```

실제 DOM 구조:

```html
<a href="/">Home</a>
<a href="/about">About</a>
```

Fragment는 실제 DOM에 추가적인 요소를 생성하지 않으므로 기존 HTML 구조를 유지할 수 있습니다.

## 3. Fragment 사용 방법

### 3.1. Fragment 컴포넌트

React는 `react` 패키지에서 `Fragment`를 제공합니다.

```tsx
import { Fragment } from 'react';

function UserInfo() {
  return (
    <Fragment>
      <h1>User</h1>
      <p>User information</p>
    </Fragment>
  );
}
```

`Fragment`는 여러 자식 요소를 하나의 그룹으로 묶습니다.

일반적인 HTML 요소와 달리 실제 DOM 노드로 렌더링되지 않습니다.

### 3.2. Fragment 단축 문법

Fragment는 다음과 같은 단축 문법으로도 사용할 수 있습니다.

```tsx
function UserInfo() {
  return (
    <>
      <h1>User</h1>
      <p>User information</p>
    </>
  );
}
```

단축 문법은 별도의 Import 없이 사용할 수 있으며, 일반적인 컴포넌트 반환 구조에서 가장 자주 사용됩니다.

두 문법의 동작 결과는 동일합니다.

| 구분 | Fragment | 단축 문법 |
|---|---|---|
| 문법 | `<Fragment>...</Fragment>` | `<>...</>` |
| Import | 필요 | 불필요 |
| DOM 요소 생성 | 생성하지 않음 | 생성하지 않음 |
| Key 지정 | 가능 | 불가능 |
| 일반적인 사용 | Key가 필요한 경우 등 | 단순 그룹화 |

단축 문법은 `key` 등의 Props를 전달할 수 없다는 차이가 있습니다.

따라서 목록 렌더링에서 그룹 단위로 Key를 지정해야 한다면 명시적인 `Fragment`를 사용해야 합니다.

## 4. 목록 렌더링에서의 Fragment

### 4.1. 여러 요소를 하나의 목록 항목으로 구성

목록 데이터를 렌더링할 때 하나의 데이터 항목이 여러 DOM 요소로 구성될 수 있습니다.

예를 들어 사용자 이름과 이메일을 하나의 그룹으로 출력하는 경우입니다.

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
  },
];

function UserList() {
  return (
    <dl>
      {users.map((user) => (
        <div key={user.id}>
          <dt>{user.name}</dt>
          <dd>{user.email}</dd>
        </div>
      ))}
    </dl>
  );
}
```

위 코드는 각 사용자 데이터를 `div`로 감싸고 있습니다.

그러나 HTML 구조상 추가적인 Wrapper 요소가 필요하지 않다면 Fragment를 사용하는 편이 적절합니다.

### 4.2. Key를 사용하는 Fragment

목록에서 여러 요소를 하나의 그룹으로 반환하면서 DOM Wrapper를 생성하지 않으려면 명시적인 `Fragment`를 사용합니다.

```tsx
import { Fragment } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
  },
];

function UserList() {
  return (
    <dl>
      {users.map((user) => (
        <Fragment key={user.id}>
          <dt>{user.name}</dt>
          <dd>{user.email}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

각 사용자 데이터는 하나의 Fragment로 그룹화됩니다.

`key`는 Fragment에 지정되며, React는 이를 통해 목록 항목의 변경, 추가 및 제거를 추적합니다.

실제 DOM에는 Fragment 요소가 생성되지 않으므로 `dl` 내부에 `dt`와 `dd`가 직접 배치됩니다.

### 4.3. 단축 문법에서는 Key 지정 불가

다음과 같은 코드는 사용할 수 없습니다.

```tsx
function UserList() {
  return (
    <dl>
      {users.map((user) => (
        <>
          <dt>{user.name}</dt>
          <dd>{user.email}</dd>
        </>
      ))}
    </dl>
  );
}
```

단축 문법에는 `key`를 전달할 수 없으므로 목록 렌더링 시 React가 각 그룹을 안정적으로 식별할 수 없습니다.

따라서 다음과 같이 명시적인 Fragment를 사용해야 합니다.

```tsx
import { Fragment } from 'react';

function UserList() {
  return (
    <dl>
      {users.map((user) => (
        <Fragment key={user.id}>
          <dt>{user.name}</dt>
          <dd>{user.email}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

목록의 각 항목에는 안정적이고 고유한 Key를 지정해야 합니다.

## 5. Fragment와 DOM 구조

### 5.1. DOM 계층 구조 유지

Fragment는 실제 DOM 요소를 추가하지 않으므로 부모 요소가 요구하는 HTML 구조를 유지하는 데 유용합니다.

예를 들어 `table` 내부에서는 `tbody`, `tr`, `td` 등 HTML 테이블 요소의 구조를 고려해야 합니다.

```tsx
function TableRows() {
  return (
    <>
      <tr>
        <td>Alice</td>
        <td>Developer</td>
      </tr>

      <tr>
        <td>Bob</td>
        <td>Designer</td>
      </tr>
    </>
  );
}

function UserTable() {
  return (
    <table>
      <tbody>
        <TableRows />
      </tbody>
    </table>
  );
}
```

`TableRows`는 여러 `tr` 요소를 반환하지만 별도의 Wrapper 요소를 생성하지 않습니다.

따라서 실제 DOM에서도 `tbody` 내부에 `tr` 요소가 직접 배치됩니다.

### 5.2. CSS 레이아웃에 미치는 영향

일반적인 HTML Wrapper 요소는 CSS 레이아웃 계산에 영향을 줍니다.

예를 들어 Flexbox 컨테이너의 직접적인 자식 요소는 Flex Item이 됩니다.

```tsx
function Navigation() {
  return (
    <nav className="navigation">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  );
}
```

위 구조에서는 두 링크가 `navigation`의 직접적인 자식이므로 Flex Item으로 배치됩니다.

반면 Wrapper 요소를 추가하면 Flex Item의 구조가 달라집니다.

```tsx
function Navigation() {
  return (
    <nav className="navigation">
      <div>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </div>
    </nav>
  );
}
```

이 경우 Flex Item은 두 링크가 아니라 Wrapper인 `div`가 됩니다.

Fragment를 사용하면 추가적인 DOM 요소 없이 여러 요소를 그룹화할 수 있으므로 기존 CSS 레이아웃 구조를 유지하는 데 도움이 됩니다.

다만 Fragment 자체는 DOM 요소가 아니므로 CSS 클래스나 스타일을 직접 지정할 수 없습니다.

```tsx
// 잘못된 사용 예시
<Fragment className="container">
  <div>Content</div>
</Fragment>
```

스타일을 적용해야 하는 실제 컨테이너가 필요하다면 적절한 HTML 요소를 사용해야 합니다.

## 6. Fragment와 React 컴포넌트 구조

### 6.1. 컴포넌트 반환값으로 사용

Fragment는 컴포넌트의 반환값을 그룹화하는 용도로 사용할 수 있습니다.

```tsx
function Profile() {
  return (
    <>
      <h1>Profile</h1>
      <section>
        <p>Name: Alice</p>
        <p>Role: Developer</p>
      </section>
    </>
  );
}
```

Fragment를 사용하면 별도의 Wrapper 컴포넌트를 생성하지 않고도 여러 요소를 반환할 수 있습니다.

### 6.2. 조건부 렌더링과 Fragment

조건부 렌더링에서 여러 요소를 하나의 그룹으로 표시할 때도 사용할 수 있습니다.

```tsx
type ProfileProps = {
  isLoggedIn: boolean;
};

function Profile({ isLoggedIn }: ProfileProps) {
  if (!isLoggedIn) {
    return <p>Please log in.</p>;
  }

  return (
    <>
      <h1>Welcome</h1>
      <p>You are logged in.</p>
      <button>Logout</button>
    </>
  );
}
```

조건에 따라 여러 요소를 반환하더라도 추가적인 DOM Wrapper를 생성하지 않습니다.

### 6.3. Fragment 중첩

Fragment는 다른 Fragment 내부에 중첩하여 사용할 수 있습니다.

```tsx
function Dashboard() {
  return (
    <>
      <header>
        <h1>Dashboard</h1>
      </header>

      <>
        <main>
          <section>Overview</section>
          <section>Statistics</section>
        </main>
      </>
    </>
  );
}
```

중첩된 Fragment 역시 실제 DOM 요소를 생성하지 않습니다.

다만 단순한 구조에서는 불필요한 중첩을 줄이고 코드의 가독성을 유지하는 것이 좋습니다.

## 7. Fragment의 렌더링 동작

### 7.1. Fragment와 React Element

Fragment는 일반적인 HTML 요소를 나타내는 React Element와 달리 여러 자식 노드를 하나의 그룹으로 구성하는 역할을 합니다.

```tsx
const element = (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);
```

위 JSX는 React가 처리할 수 있는 React 노드 구조로 변환됩니다.

Fragment는 React가 컴포넌트의 자식 요소들을 하나의 렌더링 결과로 관리할 수 있도록 하며, 실제 DOM에서는 별도의 요소를 생성하지 않습니다.

### 7.2. Fragment는 렌더링을 생략하는 기능이 아님

Fragment를 사용한다고 해서 내부 자식 요소의 렌더링이나 업데이트 과정이 생략되는 것은 아닙니다.

Fragment는 DOM Wrapper를 생성하지 않는 그룹화 기능입니다.

내부 자식 컴포넌트는 일반적인 React 컴포넌트와 동일하게 State, Props, Context 및 렌더링 규칙의 영향을 받습니다.

따라서 Fragment 사용 자체가 성능 최적화를 의미하지는 않습니다.

### 7.3. Fragment와 Key의 관계

목록 렌더링에서 Fragment에 Key를 지정하면 React가 그룹 단위로 항목을 식별할 수 있습니다.

```tsx
import { Fragment } from 'react';

function ItemList() {
  const items = [
    { id: 1, title: 'First', description: 'First item' },
    { id: 2, title: 'Second', description: 'Second item' },
  ];

  return (
    <>
      {items.map((item) => (
        <Fragment key={item.id}>
          <h2>{item.title}</h2>
          <p>{item.description}</p>
        </Fragment>
      ))}
    </>
  );
}
```

Key는 실제 DOM 속성으로 렌더링되지 않습니다.

Key는 React가 목록 항목의 정체성을 추적하기 위해 사용하는 특별한 속성입니다.

## 8. Fragment 사용 시 주의사항

### 8.1. DOM 속성 전달 불가

Fragment에는 일반적인 HTML 요소처럼 `className`, `style`, `onClick` 등의 DOM 속성을 전달할 수 없습니다.

```tsx
// 잘못된 사용 예시
<Fragment className="wrapper">
  <p>Content</p>
</Fragment>
```

Fragment는 실제 DOM 요소를 생성하지 않으므로 DOM 속성을 적용할 대상이 없습니다.

이러한 속성이 필요하다면 실제 HTML 요소를 사용해야 합니다.

### 8.2. Key가 필요한 경우 명시적 Fragment 사용

단축 문법은 `key`를 지정할 수 없습니다.

따라서 `map()` 등을 이용하여 목록을 렌더링할 때 그룹 단위의 Key가 필요하다면 명시적인 Fragment를 사용해야 합니다.

```tsx
import { Fragment } from 'react';

items.map((item) => (
  <Fragment key={item.id}>
    <h2>{item.title}</h2>
    <p>{item.description}</p>
  </Fragment>
));
```

### 8.3. 불필요한 Fragment 사용 지양

이미 단일 요소를 반환하는 컴포넌트라면 Fragment를 추가할 필요가 없습니다.

```tsx
// 불필요한 Fragment
function Heading() {
  return (
    <>
      <h1>React</h1>
    </>
  );
}

// 단순화한 구조
function Heading() {
  return <h1>React</h1>;
}
```

Fragment는 여러 요소를 그룹화해야 하는 경우에 사용하는 것이 적절합니다.

### 8.4. 실제 DOM 요소가 필요한 경우 Wrapper 사용

Fragment는 실제 DOM 노드를 생성하지 않으므로 다음과 같은 기능이 필요하다면 적절한 HTML 요소를 사용해야 합니다.

- CSS 스타일 적용
- DOM 이벤트 핸들러 등록
- DOM Ref 연결
- 특정 요소를 기준으로 한 레이아웃 구성
- 접근성 의미를 표현하는 시맨틱 요소 사용

Fragment 사용 여부는 단순히 DOM 요소를 줄이는 것만이 아니라 올바른 HTML 구조와 컴포넌트 설계를 기준으로 결정해야 합니다.

## 9. 정리

React Fragment는 여러 React 요소를 하나의 그룹으로 반환하면서 실제 DOM에는 별도의 Wrapper 요소를 생성하지 않는 기능입니다.

주요 특징은 다음과 같습니다.

- 여러 React 요소를 하나의 반환 노드로 그룹화할 수 있습니다.
- `<Fragment>` 또는 `<>` 단축 문법을 사용할 수 있습니다.
- 실제 DOM에 추가적인 Wrapper 요소를 생성하지 않습니다.
- React 컴포넌트 트리의 구조와 자식 요소의 렌더링은 유지됩니다.
- 목록 렌더링에서 그룹 단위의 Key를 지정하려면 명시적인 `Fragment`를 사용해야 합니다.
- CSS 속성이나 DOM 이벤트 핸들러를 Fragment에 직접 지정할 수 없습니다.
- Fragment 자체는 성능 최적화 기능이 아니라 DOM 구조를 단순화하는 기능입니다.

Fragment는 React 컴포넌트의 논리적인 그룹화와 실제 DOM 구조를 분리하는 데 유용합니다. 불필요한 Wrapper 요소를 줄이고 기존 HTML 및 CSS 레이아웃 구조를 유지해야 하는 경우 활용할 수 있습니다.

## 10. 참고자료

### React 공식 문서

- [Fragment](https://react.dev/reference/react/Fragment)
  - Fragment의 기본 사용법, 단축 문법, Key 지정 및 DOM 렌더링 동작을 설명합니다.
- [Rendering Lists](https://react.dev/learn/rendering-lists)
  - 목록 렌더링에서 Key를 사용하는 이유와 Fragment를 이용한 그룹 단위 렌더링을 설명합니다.
- [Your First Component](https://react.dev/learn/your-first-component)
  - React 컴포넌트의 기본 구조와 JSX 반환 방식을 설명합니다.
- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
  - JSX의 구조와 여러 요소를 반환하는 방법을 설명합니다.

### MDN Web Docs

- [Document Object Model (DOM)](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
  - 브라우저 DOM의 구조와 요소 간 계층 관계를 설명합니다.
- [CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout)
  - Flexbox의 컨테이너와 직접 자식 요소의 레이아웃 동작을 설명합니다.
- [HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
  - HTML 요소의 역할과 올바른 문서 구조를 이해하는 데 참고할 수 있습니다.