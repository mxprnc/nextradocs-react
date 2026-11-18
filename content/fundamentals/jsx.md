# JSX (JavaScript XML)

## 1. 개요

JSX(JavaScript XML)는 JavaScript 코드 내부에서 HTML과 유사한 마크업을 작성할 수 있도록 확장된 구문(Syntax Extension)입니다.

React에서는 JSX를 사용하여 UI의 구조를 선언적으로 표현할 수 있으며, 컴포넌트의 렌더링 로직과 마크업을 동일한 위치에서 관리할 수 있습니다.

JSX는 HTML과 유사한 형태를 가지지만 HTML 자체는 아닙니다. JavaScript 코드로 변환되는 별도의 구문이며, React에서는 이를 통해 컴포넌트가 표현할 UI 구조를 선언합니다.

다음은 JSX를 사용한 기본적인 컴포넌트입니다.

```tsx
function Welcome() {
  const name = 'React';

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to JSX.</p>
    </div>
  );
}
```

위 코드에서 JSX는 `div`, `h1`, `p` 등의 요소를 사용하여 UI 구조를 표현합니다. `{name}`과 같이 중괄호를 사용하면 JavaScript 표현식의 결과를 JSX 내부에 포함할 수 있습니다.

JSX는 React를 사용하기 위한 필수 문법은 아닙니다. React는 JSX 없이도 JavaScript API를 사용하여 UI를 구성할 수 있지만, JSX가 마크업 구조를 직관적으로 표현할 수 있기 때문에 대부분의 React 프로젝트에서 사용됩니다.

> JSX와 React는 서로 다른 개념입니다. JSX는 JavaScript의 구문 확장이며, React는 UI를 구성하고 렌더링하는 JavaScript 라이브러리입니다. JSX는 React 이외의 라이브러리에서도 사용할 수 있습니다.

## 2. JSX의 동작 원리

JSX는 브라우저에서 직접 실행되는 JavaScript 문법이 아닙니다. 개발 과정에서 Babel이나 TypeScript와 같은 컴파일 도구를 통해 JavaScript 코드로 변환됩니다.

일반적인 React 프로젝트에서는 빌드 도구가 JSX 변환을 수행하며, 변환된 JavaScript 코드가 브라우저에서 실행됩니다.

### 2.1. JSX 변환

다음과 같은 JSX 코드가 있다고 가정하겠습니다.

```tsx
function Greeting() {
  return <h1>Hello, React!</h1>;
}
```

JSX 변환 방식에 따라 다음과 같은 JavaScript 코드로 변환될 수 있습니다.

**Automatic Runtime**

```tsx
import { jsx as _jsx } from 'react/jsx-runtime';

function Greeting() {
  return _jsx('h1', {
    children: 'Hello, React!',
  });
}
```

**Classic Runtime**

```tsx
import React from 'react';

function Greeting() {
  return React.createElement(
    'h1',
    null,
    'Hello, React!'
  );
}
```

두 방식 모두 JSX를 JavaScript 코드로 변환한다는 공통점이 있습니다.

- Automatic Runtime: `react/jsx-runtime`에서 제공하는 JSX 생성 함수를 사용합니다.
- Classic Runtime: 일반적으로 `React.createElement()`를 호출하여 React Element를 생성합니다.

현재 React 프로젝트에서는 Automatic Runtime이 일반적으로 사용됩니다. 따라서 JSX를 사용하기 위해 모든 파일에서 React를 명시적으로 import할 필요는 없습니다.

### 2.2. React Element

JSX가 변환되면 React가 UI를 구성하는 데 사용하는 React Element가 생성됩니다.

React Element는 화면에 표시할 UI 요소의 타입, 속성 및 자식 요소에 대한 정보를 나타내는 객체입니다.

```tsx
const element = <h1>Hello, React!</h1>;
```

위 코드는 `h1` 요소를 나타내는 React Element를 생성합니다.

React Element 자체가 실제 DOM 노드는 아닙니다. React는 이러한 요소를 기반으로 렌더링 과정을 수행하고, 필요한 경우 실제 DOM을 생성하거나 업데이트합니다.

다음과 같이 구분할 수 있습니다.

| 구분 | 설명 |
|---|---|
| JSX | UI 구조를 표현하는 JavaScript 확장 구문 |
| React Element | UI 요소의 타입과 속성 등을 나타내는 객체 |
| React Component | React Element를 반환하는 재사용 가능한 UI 구성 단위 |
| DOM Element | 브라우저에서 실제로 관리하는 문서 객체 |

## 3. JSX의 기본 규칙

JSX는 HTML과 유사하지만 몇 가지 문법적인 차이가 있습니다.

### 3.1. 하나의 루트 요소로 감싸기

컴포넌트에서 여러 JSX 요소를 반환하려면 하나의 루트 요소로 감싸야 합니다.

다음 코드는 여러 요소가 독립적으로 반환되기 때문에 유효하지 않습니다.

```tsx
function Profile() {
  return (
    <h1>Profile</h1>
    <p>User information</p>
  );
}
```

다음과 같이 하나의 부모 요소로 감싸야 합니다.

```tsx
function Profile() {
  return (
    <div>
      <h1>Profile</h1>
      <p>User information</p>
    </div>
  );
}
```

추가적인 DOM 요소를 생성하지 않으려면 Fragment를 사용할 수 있습니다.

```tsx
function Profile() {
  return (
    <>
      <h1>Profile</h1>
      <p>User information</p>
    </>
  );
}
```

Fragment는 여러 JSX 요소를 하나로 그룹화하지만 실제 DOM에 별도의 노드를 추가하지 않습니다.

Fragment는 다음과 같이 명시적으로 작성할 수도 있습니다.

```tsx
import { Fragment } from 'react';

function Profile() {
  return (
    <Fragment>
      <h1>Profile</h1>
      <p>User information</p>
    </Fragment>
  );
}
```

여러 요소를 그룹화하는 것 외에도 배열을 반환하는 방식으로 여러 React Element를 구성할 수 있습니다. 다만 일반적인 컴포넌트에서는 루트 요소 또는 Fragment를 사용하는 방식이 더 직관적입니다.

### 3.2. 모든 태그 닫기

JSX에서는 모든 태그를 명시적으로 닫아야 합니다.

HTML에서는 일부 태그의 종료 태그를 생략할 수 있지만 JSX에서는 이러한 작성 방식을 허용하지 않습니다.

잘못된 작성 방식:

```tsx
function Gallery() {
  return (
    <div>
      <img src="/images/profile.png">
      <br>
    </div>
  );
}
```

올바른 작성 방식:

```tsx
function Gallery() {
  return (
    <div>
      <img src="/images/profile.png" />
      <br />
    </div>
  );
}
```

자체적으로 닫히는 요소는 `/>` 형태로 작성해야 합니다.

일반적인 요소는 시작 태그와 종료 태그를 모두 작성해야 합니다.

```tsx
function Description() {
  return (
    <p>
      React makes it easier to build user interfaces.
    </p>
  );
}
```

### 3.3. 속성 이름은 camelCase 사용

JSX의 속성 이름은 JavaScript 객체의 프로퍼티와 연결되므로 대부분 camelCase 형태로 작성합니다.

HTML의 속성 이름과 JSX의 속성 이름은 일부 차이가 있습니다.

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `tabindex` | `tabIndex` |
| `onclick` | `onClick` |
| `stroke-width` | `strokeWidth` |
| `fill-rule` | `fillRule` |

예를 들어 CSS 클래스를 지정할 때 HTML의 `class` 대신 `className`을 사용합니다.

```tsx
function Button() {
  return (
    <button className="primary-button">
      Submit
    </button>
  );
}
```

다만 모든 속성이 camelCase로 변경되는 것은 아닙니다.

`aria-*`, `data-*` 속성은 HTML과 동일하게 하이픈을 포함한 형태로 작성합니다.

```tsx
function Button() {
  return (
    <button
      aria-label="Close dialog"
      data-testid="close-button"
    >
      Close
    </button>
  );
}
```

### 3.4. 컴포넌트 이름은 대문자로 시작

JSX에서는 소문자로 시작하는 태그와 대문자로 시작하는 태그를 구분합니다.

- 소문자로 시작하는 이름: HTML 또는 환경에서 정의된 내장 요소(Intrinsic Element)
- 대문자로 시작하는 이름: 사용자 정의 컴포넌트(Value-based Element)

```tsx
function Header() {
  return <header>Application Header</header>;
}

function App() {
  return (
    <div>
      <Header />
    </div>
  );
}
```

`header`는 HTML 요소이며, `Header`는 사용자 정의 React 컴포넌트입니다.

이러한 구분은 JSX 변환 및 TypeScript의 JSX 타입 검사에서도 사용됩니다.

## 4. JSX에서 JavaScript 표현식 사용하기

JSX에서는 중괄호 `{}`를 사용하여 JavaScript 표현식을 포함할 수 있습니다.

이를 통해 변수, 함수 호출, 연산 결과 등 동적으로 계산된 값을 UI에 반영할 수 있습니다.

### 4.1. 변수 사용

```tsx
function UserProfile() {
  const userName = 'Alice';
  const age = 25;

  return (
    <div>
      <h1>{userName}</h1>
      <p>Age: {age}</p>
    </div>
  );
}
```

중괄호 내부에 작성된 변수는 해당 변수의 값을 평가한 결과로 렌더링됩니다.

### 4.2. JavaScript 표현식 사용

중괄호 내부에는 변수뿐만 아니라 연산식과 함수 호출 등의 JavaScript 표현식을 사용할 수 있습니다.

```tsx
function Calculator() {
  const price = 100;
  const quantity = 3;

  return (
    <p>Total: {price * quantity}</p>
  );
}
```

함수 호출도 가능합니다.

```tsx
function Greeting() {
  const getMessage = () => 'Hello, React!';

  return <h1>{getMessage()}</h1>;
}
```

다만 JSX 내부에는 하나의 값으로 평가되는 표현식을 작성해야 합니다. 일반적인 `if`, `for`, `while`과 같은 제어문은 중괄호 내부에 직접 작성할 수 없습니다.

### 4.3. 문자열과 표현식 구분

JSX에서는 문자열과 JavaScript 표현식을 서로 다른 방식으로 작성합니다.

```tsx
function Avatar() {
  const imageUrl = '/images/avatar.png';

  return (
    <div>
      <img src="/images/default.png" alt="Default" />
      <img src={imageUrl} alt="User avatar" />
    </div>
  );
}
```

- 큰따옴표: 문자열 리터럴을 전달합니다.
- 중괄호: JavaScript 표현식의 평가 결과를 전달합니다.

### 4.4. 조건부 표현식

JSX 내부에서는 삼항 연산자와 논리 AND 연산자를 사용하여 조건부 렌더링을 구현할 수 있습니다.

**삼항 연산자**

```tsx
function LoginStatus() {
  const isLoggedIn = true;

  return (
    <div>
      {isLoggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
}
```

**논리 AND 연산자**

```tsx
function Notification() {
  const hasNotification = true;

  return (
    <div>
      {hasNotification && (
        <p>You have a new notification.</p>
      )}
    </div>
  );
}
```

논리 AND 연산자는 왼쪽 피연산자가 참일 때 오른쪽 표현식을 평가하고 반환합니다.

주의할 점은 숫자 `0`입니다.

```tsx
function ItemList() {
  const items: string[] = [];

  return (
    <div>
      {items.length && <p>Items available</p>}
    </div>
  );
}
```

위 코드는 `items.length`가 `0`일 때 `false`가 아닌 숫자 `0`을 JSX에 반환하므로 화면에 `0`이 표시될 수 있습니다.

다음과 같이 명시적인 Boolean 조건을 사용하면 이러한 문제를 방지할 수 있습니다.

```tsx
function ItemList() {
  const items: string[] = [];

  return (
    <div>
      {items.length > 0 && <p>Items available</p>}
    </div>
  );
}
```

### 4.5. 여러 줄의 JSX 표현식

JSX는 일반적으로 여러 줄에 걸쳐 작성할 수 있습니다.

```tsx
function UserCard() {
  const user = {
    name: 'Alice',
    role: 'Developer',
  };

  return (
    <section className="user-card">
      <h2>{user.name}</h2>
      <p>{user.role}</p>
    </section>
  );
}
```

`return` 다음에 괄호를 사용하는 방식은 여러 줄의 JSX를 명확하게 구분하기 위한 일반적인 작성 관례입니다.

## 5. JSX 속성(Attribute)

JSX 요소에는 속성을 지정하여 요소의 동작이나 표시 방식을 제어할 수 있습니다.

HTML 속성과 유사하지만 JavaScript 표현식, 객체, 함수 등을 전달할 수 있다는 차이가 있습니다.

### 5.1. 문자열 속성

문자열 리터럴은 큰따옴표를 사용하여 지정합니다.

```tsx
function Link() {
  return (
    <a href="https://react.dev">
      React Documentation
    </a>
  );
}
```

### 5.2. JavaScript 표현식 속성

중괄호를 사용하면 변수나 계산된 값을 속성에 전달할 수 있습니다.

```tsx
function Avatar() {
  const imageUrl = '/images/avatar.png';
  const imageSize = 100;

  return (
    <img
      src={imageUrl}
      width={imageSize}
      height={imageSize}
      alt="User avatar"
    />
  );
}
```

### 5.3. Boolean 속성

Boolean 값을 속성에 전달할 수 있습니다.

```tsx
function SubmitButton() {
  const isDisabled = true;

  return (
    <button disabled={isDisabled}>
      Submit
    </button>
  );
}
```

Boolean 속성은 다음과 같이 축약해서 작성할 수도 있습니다.

```tsx
<button disabled>
  Submit
</button>
```

이는 다음 코드와 동일한 의미입니다.

```tsx
<button disabled={true}>
  Submit
</button>
```

### 5.4. 객체 속성

일부 속성에는 JavaScript 객체를 전달할 수 있습니다.

대표적인 예가 `style` 속성입니다.

```tsx
function StyledText() {
  const styles = {
    color: 'blue',
    fontSize: '20px',
    fontWeight: 'bold',
  };

  return (
    <p style={styles}>
      Styled Text
    </p>
  );
}
```

인라인 스타일은 CSS 문자열이 아니라 JavaScript 객체 형태로 전달합니다.

CSS 속성 이름은 일반적으로 camelCase를 사용합니다.

```tsx
<p
  style={{
    backgroundColor: 'lightgray',
    marginTop: '10px',
    padding: '16px',
  }}
>
  Styled Content
</p>
```

일부 CSS 속성은 숫자를 그대로 전달할 수 있으며, React는 해당 속성의 규칙에 따라 단위를 처리합니다.

```tsx
<div style={{ width: 200, opacity: 0.5 }}>
  Content
</div>
```

일반적으로 `width: 200`은 `200px`로 처리되지만, `opacity`와 같은 단위가 없는 속성은 숫자 그대로 사용합니다.

### 5.5. Spread Attributes

JavaScript의 Spread 문법을 사용하면 객체의 속성을 JSX 요소에 일괄 전달할 수 있습니다.

```tsx
function Avatar() {
  const imageProps = {
    src: '/images/avatar.png',
    alt: 'User avatar',
    width: 100,
    height: 100,
  };

  return <img {...imageProps} />;
}
```

Spread 문법은 컴포넌트의 Props를 다른 컴포넌트에 전달할 때도 활용할 수 있습니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
};

function Button(props: ButtonProps) {
  return (
    <button disabled={props.disabled}>
      {props.label}
    </button>
  );
}

function App() {
  const buttonProps: ButtonProps = {
    label: 'Submit',
    disabled: false,
  };

  return <Button {...buttonProps} />;
}
```

Spread 문법을 사용하면 여러 속성을 간결하게 전달할 수 있지만, 의도하지 않은 속성까지 전달하지 않도록 주의해야 합니다.

## 6. JSX의 자식 요소(Children)

JSX 요소 사이에 작성된 내용은 부모 요소의 자식 요소로 전달됩니다.

자식 요소는 문자열, 숫자, 다른 JSX 요소, JavaScript 표현식 등을 포함할 수 있습니다.

### 6.1. 문자열 자식 요소

```tsx
function Greeting() {
  return (
    <h1>
      Hello, React!
    </h1>
  );
}
```

태그 사이의 문자열은 텍스트 콘텐츠로 렌더링됩니다.

### 6.2. JSX 요소 중첩

다른 JSX 요소를 자식으로 포함할 수 있습니다.

```tsx
function Card() {
  return (
    <section>
      <h2>User Profile</h2>
      <p>User information</p>
    </section>
  );
}
```

### 6.3. 동적 자식 요소

중괄호를 사용하여 JavaScript 표현식의 결과를 자식 요소로 전달할 수 있습니다.

```tsx
function Greeting() {
  const userName = 'Alice';

  return (
    <h1>
      Welcome, {userName}!
    </h1>
  );
}
```

### 6.4. 배열을 사용한 자식 요소

배열을 사용하면 여러 React Element를 동적으로 생성할 수 있습니다.

```tsx
function UserList() {
  const users = ['Alice', 'Bob', 'Charlie'];

  return (
    <ul>
      {users.map((user) => (
        <li key={user}>
          {user}
        </li>
      ))}
    </ul>
  );
}
```

배열을 렌더링할 때는 각 요소를 구분하기 위한 `key`를 지정해야 합니다.

`key`는 React가 목록의 요소를 식별하고 업데이트 과정에서 변경 사항을 추적하는 데 사용됩니다.

자세한 내용은 `list-rendering.md` 및 `keys.md`에서 다룹니다.

## 7. JSX 주석

JSX 내부에서 주석을 작성할 때는 중괄호와 JavaScript 주석 문법을 사용합니다.

```tsx
function Profile() {
  return (
    <div>
      {/* User profile information */}
      <h1>Profile</h1>
      <p>User information</p>
    </div>
  );
}
```

JSX 바깥의 JavaScript 영역에서는 일반적인 JavaScript 주석을 사용할 수 있습니다.

```tsx
// User profile component
function Profile() {
  return <h1>Profile</h1>;
}
```

JSX 태그 사이에 `//` 또는 `/* */`를 직접 작성하면 일반적인 JavaScript 주석으로 처리되지 않으므로 주의해야 합니다.

## 8. TypeScript와 JSX

React와 TypeScript를 함께 사용하는 프로젝트에서는 JSX가 포함된 파일의 확장자로 `.tsx`를 사용합니다.

`.ts` 파일은 TypeScript 문법을 처리하지만 JSX 구문을 포함할 수 없습니다.

```text
src/
├── components/
│   ├── Button.tsx
│   ├── Header.tsx
│   └── UserProfile.tsx
├── App.tsx
└── main.tsx
```

### 8.1. TSX 파일

다음은 TypeScript를 사용하여 Props 타입을 정의한 컴포넌트입니다.

```tsx
type GreetingProps = {
  name: string;
  age: number;
};

function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  );
}
```

JSX 구문과 TypeScript의 정적 타입 검사를 함께 사용할 수 있습니다.

이를 통해 컴포넌트에 전달되는 Props의 타입을 검사하고 잘못된 데이터 전달을 컴파일 단계에서 발견할 수 있습니다.

### 8.2. JSX 컴파일 옵션

TypeScript에서는 `tsconfig.json`의 `jsx` 옵션을 사용하여 JSX 변환 방식을 설정합니다.

대표적인 설정은 다음과 같습니다.

| 옵션 | 설명 |
|---|---|
| `preserve` | JSX 구문을 유지하고 다음 변환 도구에 전달합니다. |
| `react` | Classic Runtime 방식으로 `React.createElement` 호출을 생성합니다. |
| `react-jsx` | Automatic Runtime 방식으로 JSX 변환을 수행합니다. |
| `react-jsxdev` | 개발 환경을 위한 Automatic Runtime 변환을 수행합니다. |
| `react-native` | JSX를 유지하면서 React Native 환경에 맞는 출력을 생성합니다. |

일반적인 TypeScript + React 프로젝트에서는 다음과 같은 설정을 사용할 수 있습니다.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true
  }
}
```

실제 프로젝트에서는 Vite, Next.js 등의 프레임워크와 빌드 도구가 JSX 변환을 담당할 수 있으므로 프로젝트 환경에 맞는 설정을 사용해야 합니다.

TypeScript의 `jsx` 옵션은 JSX 변환 방식을 결정하며, JSX 내부의 타입 검사 자체와는 구분되는 설정입니다.

## 9. JSX 사용 시 주의사항

### 9.1. JSX와 HTML을 동일하게 취급하지 않기

JSX는 HTML과 유사하지만 동일한 문법이 아닙니다.

`className`, `htmlFor`, 자체 종료 태그 등 JSX의 문법 규칙을 준수해야 합니다.

### 9.2. JSX 내부에서 복잡한 로직 최소화

JSX 내부에서는 중괄호를 사용하여 JavaScript 표현식을 실행할 수 있지만, 지나치게 복잡한 계산이나 조건 분기를 포함하면 가독성이 저하됩니다.

다음과 같이 작성할 수 있습니다.

```tsx
function UserStatus() {
  const isLoggedIn = true;
  const userName = 'Alice';

  const message = isLoggedIn
    ? `Welcome, ${userName}!`
    : 'Please log in.';

  return <p>{message}</p>;
}
```

복잡한 로직은 별도의 변수나 함수로 분리하여 JSX가 UI 구조를 명확하게 표현하도록 구성하는 것이 좋습니다.

### 9.3. JSX 생성 이후 데이터 변경 금지

React는 컴포넌트와 JSX를 기반으로 렌더링을 수행하므로 렌더링 과정에서 사용되는 Props와 State는 불변 데이터로 취급해야 합니다.

특히 JSX에 전달한 객체나 배열을 이후에 직접 변경하는 방식은 예기치 않은 동작을 유발할 수 있습니다.

```tsx
function UserProfile() {
  const user = {
    name: 'Alice',
  };

  const element = <p>{user.name}</p>;

  // JSX에 사용한 값은 변경하지 않는 것이 좋습니다.
  return element;
}
```

React에서는 Props와 State를 직접 변경하지 않고 새로운 값을 생성하는 불변성 원칙을 준수해야 합니다.

### 9.4. 렌더링 과정에서 부수 효과 실행 금지

JSX를 반환하는 컴포넌트의 렌더링 과정에서는 동일한 입력에 대해 일관된 결과를 반환하도록 구성해야 합니다.

API 요청, DOM 직접 조작, 외부 상태 변경 등의 부수 효과는 렌더링 과정에서 실행하지 않아야 합니다.

이러한 작업은 이벤트 핸들러나 적절한 Effect를 통해 처리해야 합니다.

자세한 내용은 `rendering/` 및 `hooks/use-effect.md`에서 다룹니다.

## 10. 핵심 정리

JSX는 React 컴포넌트가 표현할 UI 구조를 JavaScript 내부에서 선언적으로 작성할 수 있도록 지원하는 구문 확장입니다.

핵심적인 특징은 다음과 같습니다.

1. JSX는 HTML이 아니라 JavaScript의 구문 확장입니다.
2. JSX는 Babel 또는 TypeScript 등의 도구를 통해 JavaScript 코드로 변환됩니다.
3. 변환된 JSX는 React Element를 생성하는 데 사용됩니다.
4. 여러 JSX 요소를 반환하려면 하나의 루트 요소 또는 Fragment로 감싸야 합니다.
5. 모든 태그는 명시적으로 닫아야 합니다.
6. 대부분의 HTML 속성 이름은 camelCase 형태로 작성합니다.
7. 중괄호 `{}`를 사용하여 JavaScript 표현식을 포함할 수 있습니다.
8. JSX 속성에는 문자열, 변수, 객체 및 함수 등을 전달할 수 있습니다.
9. TypeScript에서 JSX를 포함하는 파일은 `.tsx` 확장자를 사용합니다.
10. JSX는 React에서 UI를 선언적으로 표현하는 주요 수단이지만 React 자체와 동일한 개념은 아닙니다.

## 11. 참고 자료

### React 공식 문서

- [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx) - JSX의 기본 개념, HTML과의 차이점 및 작성 규칙
- [Quick Start](https://react.dev/learn) - React 컴포넌트, JSX 및 기본 렌더링 개념
- [Describing the UI](https://react.dev/learn/describing-the-ui) - JSX를 활용한 UI 구성 및 컴포넌트 개념
- [Rules of React](https://react.dev/reference/rules) - React 컴포넌트의 순수성과 렌더링 규칙

### TypeScript 공식 문서

- [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) - TypeScript의 JSX 지원, JSX 컴파일 옵션 및 타입 검사
- [Using TypeScript with React](https://react.dev/learn/typescript) - React와 TypeScript 통합 및 TSX 사용법