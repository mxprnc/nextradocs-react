# React Overview

## 1. React란?

React는 사용자 인터페이스(User Interface, UI)를 구축하기 위한 JavaScript 라이브러리입니다.

Meta에서 개발하고 오픈 소스로 공개한 React는 UI를 독립적인 컴포넌트(Component) 단위로 분리하고, 각 컴포넌트를 조합하여 복잡한 사용자 인터페이스를 구성할 수 있도록 지원합니다.

React의 핵심 목적은 애플리케이션의 상태(State)와 데이터(Data)에 따라 사용자 인터페이스를 선언적으로 정의하고, 상태가 변경되었을 때 화면을 효율적으로 갱신하는 것입니다.

React는 웹 애플리케이션뿐만 아니라 React Native와 같은 기술을 통해 모바일 애플리케이션 개발에도 활용할 수 있습니다.

### 1.1. React의 주요 특징

React의 주요 특징은 다음과 같습니다.

- **Component-Based Architecture**: 사용자 인터페이스를 독립적이고 재사용 가능한 컴포넌트 단위로 구성합니다.
- **Declarative UI**: 현재 상태에 따라 화면에 무엇을 표시할 것인지 선언적으로 정의합니다.
- **One-Way Data Flow**: 일반적으로 부모 컴포넌트에서 자식 컴포넌트 방향으로 데이터를 전달합니다.
- **State Management**: 컴포넌트의 상태를 관리하고 상태 변경에 따라 UI를 갱신합니다.
- **Composition**: 작은 컴포넌트들을 조합하여 복잡한 사용자 인터페이스를 구성합니다.
- **Efficient Rendering**: UI 변경 사항을 계산하고 필요한 부분을 실제 렌더링 환경에 반영합니다.

## 2. Component-Based Architecture

React는 사용자 인터페이스를 컴포넌트(Component)라는 독립적인 단위로 분리하여 구성합니다.

컴포넌트는 특정 UI 영역의 구조와 동작을 정의하는 재사용 가능한 단위입니다. 버튼, 입력 필드, 사용자 프로필, 네비게이션 메뉴부터 전체 페이지까지 다양한 크기의 UI를 컴포넌트로 표현할 수 있습니다.

예를 들어 일반적인 쇼핑몰 페이지는 다음과 같이 구성할 수 있습니다.

```text
App
├── Header
│   ├── Logo
│   ├── Navigation
│   └── UserMenu
├── Main
│   ├── ProductList
│   │   ├── ProductCard
│   │   ├── ProductCard
│   │   └── ProductCard
│   └── Pagination
└── Footer
```

각 컴포넌트는 독립적으로 정의할 수 있으며, 상위 컴포넌트에서 하위 컴포넌트를 조합하여 전체 화면을 구성합니다.

### 2.1. Function Components

React의 함수 컴포넌트(Function Component)는 JavaScript 함수로 정의하며, 일반적으로 JSX를 반환합니다.

```tsx
function Welcome() {
  return <h1>Welcome to React</h1>;
}

export default function App() {
  return (
    <main>
      <Welcome />
    </main>
  );
}
```

`Welcome`은 하나의 독립적인 컴포넌트이며, `App`에서 해당 컴포넌트를 사용하여 화면을 구성합니다.

함수 컴포넌트는 일반적인 JavaScript 함수와 달리 React의 렌더링 과정에서 호출되며, React Hooks와 같은 기능을 활용할 수 있습니다.

현재 React 애플리케이션에서는 함수 컴포넌트가 기본적인 컴포넌트 작성 방식으로 사용됩니다.

## 3. Declarative UI

React는 선언적 프로그래밍(Declarative Programming) 방식을 기반으로 사용자 인터페이스를 구성합니다.

선언적 UI에서는 화면을 어떻게 변경할 것인지 직접 명령하는 대신, 현재 애플리케이션의 상태에 따라 화면에 어떤 결과가 표시되어야 하는지를 정의합니다.

예를 들어 다음과 같이 로그인 상태에 따라 서로 다른 UI를 표시할 수 있습니다.

```tsx
type LoginStatusProps = {
  isLoggedIn: boolean;
};

function LoginStatus({ isLoggedIn }: LoginStatusProps) {
  if (isLoggedIn) {
    return <h1>Welcome back!</h1>;
  }

  return <h1>Please sign in.</h1>;
}
```

`isLoggedIn` 값에 따라 React가 렌더링할 UI가 결정됩니다.

개발자는 DOM 요소를 직접 탐색하거나 변경하는 대신, 상태에 따른 UI를 선언하면 됩니다.

### 3.1. Imperative UI와 Declarative UI 비교

명령형 방식과 선언형 방식은 UI를 구성하고 변경하는 접근 방식에서 차이가 있습니다.

**Imperative Programming**

명령형 방식에서는 DOM 요소를 직접 조회하고 변경하는 과정을 명시적으로 작성합니다.

```javascript
const button = document.querySelector('#counter');
const output = document.querySelector('#count');

let count = 0;

button.addEventListener('click', () => {
  count += 1;
  output.textContent = String(count);
});
```

개발자가 상태 변경과 DOM 업데이트 과정을 직접 관리해야 합니다.

**Declarative Programming**

React에서는 상태를 기준으로 화면을 정의합니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

상태가 변경되면 React가 컴포넌트를 다시 렌더링하고 변경된 UI를 반영합니다.

이러한 방식은 UI 변경 로직과 애플리케이션 상태를 일관성 있게 관리할 수 있도록 지원합니다.

## 4. JSX (JavaScript XML)

JSX는 JavaScript 코드 내부에서 HTML과 유사한 마크업을 작성할 수 있도록 지원하는 JavaScript 문법 확장입니다.

React에서는 JSX를 사용하여 UI 구조와 컴포넌트의 렌더링 로직을 가까운 위치에서 관리할 수 있습니다.

```tsx
function Greeting() {
  const name = 'React';

  return <h1>Hello, {name}!</h1>;
}
```

JSX 내부에서는 중괄호 `{}`를 사용하여 JavaScript 표현식을 포함할 수 있습니다.

```tsx
function Profile() {
  const user = {
    name: 'Alice',
    age: 25,
  };

  return (
    <section>
      <h1>{user.name}</h1>
      <p>Age: {user.age}</p>
    </section>
  );
}
```

JSX는 브라우저가 직접 해석하는 문법이 아닙니다. 빌드 과정에서 JavaScript 코드로 변환되어 실행됩니다.

JSX는 React의 필수 요소는 아니지만, 대부분의 React 프로젝트에서 UI를 표현하기 위한 기본적인 문법으로 사용됩니다.

## 5. Props and State

Props와 State는 React 컴포넌트의 데이터와 동작을 구성하는 핵심 개념입니다.

### 5.1. Props

Props(Properties)는 부모 컴포넌트에서 자식 컴포넌트로 전달하는 데이터입니다.

컴포넌트는 전달받은 Props를 기반으로 서로 다른 UI를 표현할 수 있습니다.

```tsx
type UserProfileProps = {
  name: string;
  age: number;
};

function UserProfile({ name, age }: UserProfileProps) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
    </div>
  );
}

function App() {
  return (
    <UserProfile
      name="Alice"
      age={25}
    />
  );
}
```

Props의 주요 특징은 다음과 같습니다.

- 부모 컴포넌트에서 자식 컴포넌트로 전달됩니다.
- 문자열, 숫자, 객체, 배열, 함수 등 다양한 JavaScript 값을 전달할 수 있습니다.
- 컴포넌트 내부에서 Props를 직접 변경하지 않습니다.
- 컴포넌트의 재사용성과 조합 가능성을 높입니다.

### 5.2. State

State는 컴포넌트가 자체적으로 관리하는 변경 가능한 데이터입니다.

사용자 입력, 버튼 클릭, 서버 응답 등으로 인해 변경되는 데이터를 관리할 때 사용합니다.

React에서는 `useState` Hook을 사용하여 함수 컴포넌트의 상태를 관리할 수 있습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    setCount((previousCount) => previousCount + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>
        Increment
      </button>
    </div>
  );
}
```

State가 변경되면 React는 해당 컴포넌트를 다시 렌더링하여 새로운 상태에 맞는 UI를 계산합니다.

State는 일반적인 JavaScript 변수와 다르게 React의 렌더링 과정에서 유지되고 관리됩니다.

## 6. One-Way Data Flow

React는 일반적으로 단방향 데이터 흐름(One-Way Data Flow)을 기반으로 컴포넌트 간 데이터를 전달합니다.

부모 컴포넌트가 자식 컴포넌트에 Props를 전달하고, 자식 컴포넌트는 전달받은 데이터를 사용하여 UI를 구성합니다.

```text
        Parent Component
                |
                | Props
                v
        Child Component
                |
                | Props
                v
       Grandchild Component
```

자식 컴포넌트에서 부모 컴포넌트의 상태를 직접 변경하는 방식은 사용하지 않습니다.

대신 부모 컴포넌트가 상태 변경 함수를 Props로 전달하면 자식 컴포넌트가 해당 함수를 호출하여 부모의 상태 변경을 요청할 수 있습니다.

```tsx
import { useState } from 'react';

type ChildProps = {
  onIncrement: () => void;
};

function Child({ onIncrement }: ChildProps) {
  return (
    <button onClick={onIncrement}>
      Increment
    </button>
  );
}

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <Child onIncrement={() => setCount((prev) => prev + 1)} />
    </div>
  );
}
```

이러한 데이터 흐름은 상태의 소유 위치와 변경 지점을 명확하게 만들어 애플리케이션의 예측 가능성과 유지보수성을 높이는 데 도움이 됩니다.

## 7. Rendering and Reconciliation

React는 컴포넌트의 상태나 Props가 변경되었을 때 새로운 UI를 계산하고 실제 렌더링 환경에 변경 사항을 반영합니다.

이 과정은 크게 다음과 같은 개념으로 이해할 수 있습니다.

1. **Trigger**: 최초 렌더링 또는 상태 업데이트 등에 의해 렌더링이 시작됩니다.
2. **Render**: React가 컴포넌트를 호출하여 새로운 UI 결과를 계산합니다.
3. **Reconciliation**: 이전 렌더링 결과와 새로운 결과를 비교하여 필요한 변경 사항을 결정합니다.
4. **Commit**: React가 결정된 변경 사항을 실제 렌더링 환경에 반영합니다.

웹 브라우저 환경에서는 React DOM이 실제 DOM 업데이트를 담당합니다.

```text
       State / Props Change
                |
                v
          Render Phase
                |
                v
       New UI Description
                |
                v
         Reconciliation
                |
                v
          Commit Phase
                |
                v
          Browser DOM
```

이 과정에서 컴포넌트 함수가 다시 실행되는 것과 실제 DOM이 변경되는 것은 서로 다른 개념입니다.

컴포넌트가 다시 렌더링되더라도 실제 DOM 변경이 발생하지 않을 수 있습니다.

React의 렌더링과 Reconciliation에 관한 자세한 내용은 `rendering/` 및 `architecture/` 디렉터리에서 다룹니다.

## 8. React and TypeScript

React는 JavaScript 기반의 라이브러리이며 TypeScript를 필수적으로 요구하지 않습니다.

다만 TypeScript를 함께 사용하면 컴포넌트의 Props, State, 이벤트, Hook 등의 타입을 명시적으로 정의할 수 있어 개발 과정에서 발생할 수 있는 타입 오류를 사전에 확인할 수 있습니다.

React와 TypeScript를 함께 사용하는 환경에서는 일반적으로 `.tsx` 확장자를 사용합니다.

`.tsx`는 TypeScript 코드 내부에 JSX 문법을 작성할 수 있도록 지원하는 파일 형식입니다.

### 8.1. Props Typing

TypeScript를 사용하면 컴포넌트가 전달받는 Props의 구조와 타입을 명확하게 정의할 수 있습니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

function Button({
  label,
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

위 예제에서는 다음과 같은 타입을 정의했습니다.

- `label`: 필수 문자열
- `disabled`: 선택적 Boolean
- `onClick`: 반환값이 없는 함수

이를 통해 컴포넌트 사용 시 잘못된 타입의 데이터가 전달되는 문제를 컴파일 단계에서 확인할 수 있습니다.

### 8.2. Type Safety

TypeScript는 정적 타입 검사를 통해 개발 단계에서 다양한 오류를 발견할 수 있도록 지원합니다.

```tsx
type User = {
  id: number;
  name: string;
};

function UserProfile({ user }: { user: User }) {
  return <h1>{user.name}</h1>;
}
```

`user` 객체가 `User` 타입의 구조를 만족하지 않으면 TypeScript가 타입 오류를 표시합니다.

다만 TypeScript의 타입 검사는 주로 컴파일 및 개발 단계에서 이루어지며, 런타임 데이터의 유효성을 자동으로 보장하지는 않습니다. API 응답과 같이 외부에서 전달되는 데이터는 별도의 런타임 검증이 필요할 수 있습니다.

React와 TypeScript의 구체적인 결합 방식은 `react-typescript/` 디렉터리에서 다룹니다.

## 9. React Library and Ecosystem

React는 사용자 인터페이스를 구성하는 라이브러리이며, 애플리케이션 개발에 필요한 모든 기능을 하나의 패키지에서 제공하는 풀스택 프레임워크는 아닙니다.

React는 UI 구성과 렌더링에 집중하며, 라우팅, 서버 데이터 관리, 빌드 및 배포, 애플리케이션 구조 등의 영역은 별도의 도구나 프레임워크를 조합하여 구성할 수 있습니다.

대표적인 기술은 다음과 같습니다.

| 기술 | 주요 역할 |
|---|---|
| React DOM | 웹 브라우저의 DOM 환경에서 React UI 렌더링 |
| React Native | 모바일 네이티브 UI 개발 |
| Next.js | React 기반 웹 애플리케이션 프레임워크 |
| React Router | 클라이언트 및 서버 라우팅 |
| TanStack Query | 서버 상태 및 비동기 데이터 관리 |
| Zustand | 애플리케이션 상태 관리 |
| Redux Toolkit | 중앙 집중식 상태 관리 |
| Vite | 개발 서버 및 빌드 도구 |
| Vitest | 테스트 프레임워크 |

React 생태계에서는 프로젝트의 요구사항에 따라 필요한 기술을 선택하여 조합할 수 있습니다.

## 10. Summary

React는 컴포넌트 기반 아키텍처와 선언적 UI를 통해 사용자 인터페이스를 효율적으로 구성하고 관리할 수 있도록 지원하는 JavaScript 라이브러리입니다.

핵심 개념은 다음과 같습니다.

| 개념 | 설명 |
|---|---|
| Component | UI를 구성하는 독립적이고 재사용 가능한 단위 |
| JSX | JavaScript 내부에서 UI 마크업을 표현하는 문법 확장 |
| Props | 부모 컴포넌트에서 자식 컴포넌트로 전달하는 데이터 |
| State | 컴포넌트에서 관리하는 변경 가능한 데이터 |
| Declarative UI | 상태에 따른 UI 결과를 선언적으로 정의하는 방식 |
| One-Way Data Flow | 부모에서 자식 방향으로 데이터를 전달하는 구조 |
| Rendering | 컴포넌트의 UI 결과를 계산하는 과정 |
| Reconciliation | 이전 UI와 새로운 UI의 차이를 계산하는 과정 |
| Hooks | 함수 컴포넌트에서 React 기능을 사용할 수 있도록 지원하는 API |
| TypeScript | 정적 타입 검사를 통해 React 애플리케이션의 타입 안정성을 높이는 기술 |

React를 이해하기 위해서는 개별 API의 사용법뿐만 아니라 컴포넌트의 구성 방식, 데이터 흐름, 상태 관리, 렌더링 과정 등을 함께 이해해야 합니다.

이러한 개념을 기반으로 React 애플리케이션의 구조와 동작 원리를 단계적으로 학습할 수 있습니다.

## 11. References

### Official Documentation

- [React Official Website](https://react.dev/)
- [React - Quick Start](https://react.dev/learn)
- [React - Describing the UI](https://react.dev/learn/describing-the-ui)
- [React - Your First Component](https://react.dev/learn/your-first-component)
- [React - Adding Interactivity](https://react.dev/learn/adding-interactivity)
- [React - Managing State](https://react.dev/learn/managing-state)
- [React - Render and Commit](https://react.dev/learn/render-and-commit)
- [React - React Reference](https://react.dev/reference/react)

### TypeScript Documentation

- [TypeScript Official Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
- [React TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/)

### Related Topics

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [React and React Native](https://react.dev/)
- [React Compiler](https://react.dev/learn/react-compiler)