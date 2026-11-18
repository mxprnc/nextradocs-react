# Component Composition

## 1. 개요

Component Composition은 여러 개의 독립적인 컴포넌트를 조합하여 더 복잡한 사용자 인터페이스를 구성하는 설계 방식입니다.

React에서는 컴포넌트를 작은 UI 단위로 분리하고, 이들을 계층적으로 결합하여 전체 인터페이스를 구성합니다. 각 컴포넌트는 특정한 역할과 책임을 가지며, 상위 컴포넌트는 하위 컴포넌트들을 조합하여 더 높은 수준의 UI를 표현합니다.

Component Composition의 핵심 목적은 다음과 같습니다.

- **재사용성(Reuse):** 기존 컴포넌트를 다양한 화면과 상황에서 재사용합니다.
- **관심사 분리(Separation of Concerns):** UI의 각 영역을 독립적인 컴포넌트로 분리합니다.
- **유연성(Flexibility):** 컴포넌트의 내부 구현을 변경하지 않고 외부에서 전달하는 콘텐츠를 교체할 수 있습니다.
- **확장성(Extensibility):** 기존 컴포넌트의 구조를 유지하면서 새로운 UI 요소를 추가할 수 있습니다.
- **유지보수성(Maintainability):** 컴포넌트 간 책임과 의존성을 명확하게 관리합니다.

React는 클래스 상속을 통한 컴포넌트 확장보다 컴포넌트 합성을 중심으로 UI를 설계하는 방식을 권장합니다.

## 2. 기본 개념

### 2.1. 컴포넌트의 계층적 구성

React 애플리케이션은 여러 컴포넌트가 부모-자식 관계를 형성하는 트리 구조로 구성됩니다.

상위 컴포넌트는 하위 컴포넌트를 JSX로 포함하여 UI를 구성하며, 하위 컴포넌트는 전달받은 Props를 기반으로 자신의 UI를 표현합니다.

```tsx
type ButtonProps = {
  label: string;
};

function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}

function Header() {
  return (
    <header>
      <h1>Application</h1>
      <Button label="Login" />
    </header>
  );
}

function App() {
  return (
    <main>
      <Header />
      <section>
        <h2>Welcome</h2>
        <p>Application content</p>
      </section>
    </main>
  );
}
```

위 구조에서 `App`은 `Header`를 포함하고, `Header`는 `Button`을 포함합니다.

각 컴포넌트는 독립적인 UI 단위로 구현되지만, JSX를 통해 조합되면서 하나의 화면을 구성합니다.

### 2.2. Props를 통한 컴포넌트 조합

컴포넌트는 Props를 통해 상위 컴포넌트로부터 데이터와 설정을 전달받습니다.

Props에는 문자열, 숫자, 객체, 배열, 함수뿐만 아니라 JSX로 표현된 React 요소도 전달할 수 있습니다.

```tsx
type AvatarProps = {
  name: string;
  imageUrl: string;
  size?: number;
};

function Avatar({
  name,
  imageUrl,
  size = 64,
}: AvatarProps) {
  return (
    <img
      src={imageUrl}
      alt={name}
      width={size}
      height={size}
    />
  );
}

function Profile() {
  return (
    <div>
      <Avatar
        name="Alice"
        imageUrl="/alice.png"
        size={100}
      />

      <Avatar
        name="Bob"
        imageUrl="/bob.png"
      />
    </div>
  );
}
```

`Avatar`는 사용자 정보를 표시하는 역할만 담당하며, 실제 데이터는 상위 컴포넌트인 `Profile`에서 전달합니다.

이러한 구조에서는 `Avatar`의 내부 구현과 `Profile`의 데이터 관리가 서로 분리됩니다.

## 3. Children을 이용한 컴포넌트 합성

### 3.1. Children의 개념

`children`은 JSX 태그 사이에 중첩된 콘텐츠를 전달하기 위해 React가 제공하는 특별한 Props입니다.

컴포넌트의 여는 태그와 닫는 태그 사이에 작성된 JSX는 해당 컴포넌트의 `children` Props로 전달됩니다.

```tsx
function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

function Profile() {
  return (
    <Card>
      <h2>Alice</h2>
      <p>Software Engineer</p>
    </Card>
  );
}
```

`Card`는 내부에 전달되는 콘텐츠의 구체적인 구조를 알 필요가 없습니다.

상위 컴포넌트가 전달한 콘텐츠를 지정된 위치에 렌더링하는 역할만 수행합니다.

이러한 방식을 통해 하나의 컨테이너 컴포넌트를 다양한 콘텐츠에 재사용할 수 있습니다.

### 3.2. Children의 TypeScript 타입

TypeScript 환경에서는 `children`의 타입을 명시적으로 정의할 수 있습니다.

일반적으로 다양한 종류의 React 렌더링 가능 콘텐츠를 허용하려면 `React.ReactNode`를 사용합니다.

```tsx
import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
```

`ReactNode`는 React에서 렌더링할 수 있는 콘텐츠를 포괄하는 타입입니다.

주요 대상은 다음과 같습니다.

- React Element
- 문자열(String)
- 숫자(Number)
- 여러 React Node의 배열
- `null`, `undefined`, Boolean 등 렌더링 결과가 없는 값
- Portal

반면 `ReactElement`는 React 요소 객체를 나타내는 타입으로, `ReactNode`보다 범위가 좁습니다.

따라서 일반적인 컨테이너 컴포넌트에서는 `ReactNode`가 적합하며, 실제 React 요소 객체만 허용해야 하는 경우에는 `ReactElement`를 고려할 수 있습니다.

### 3.3. Children을 이용한 레이아웃 컴포넌트

`children`은 특정 UI 구조를 감싸는 레이아웃 컴포넌트를 구현할 때 유용합니다.

```tsx
import type { ReactNode } from 'react';

type PageLayoutProps = {
  header?: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
};

function PageLayout({
  header,
  sidebar,
  children,
}: PageLayoutProps) {
  return (
    <div className="page-layout">
      <header>{header}</header>

      <div className="page-content">
        <aside>{sidebar}</aside>

        <main>{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <PageLayout
      header={<h1>Dashboard</h1>}
      sidebar={<nav>Navigation</nav>}
    >
      <h2>Overview</h2>
      <p>Dashboard content</p>
    </PageLayout>
  );
}
```

`PageLayout`은 페이지의 전체적인 구조를 담당하고, 각 영역에 표시할 구체적인 콘텐츠는 외부에서 전달받습니다.

이러한 구조는 페이지마다 동일한 레이아웃을 유지하면서 내부 콘텐츠를 독립적으로 구성할 수 있도록 합니다.

## 4. Named Slots를 이용한 컴포넌트 합성

### 4.1. Named Slots의 개념

하나의 컴포넌트에 여러 종류의 콘텐츠를 전달해야 하는 경우에는 `children`뿐만 아니라 별도의 Props를 이용하여 각 콘텐츠의 위치를 지정할 수 있습니다.

이러한 방식을 Named Slots 또는 Slot Pattern이라고 부릅니다.

React에 별도의 Slot 전용 API가 존재하는 것은 아니며, 일반적인 Props에 JSX를 전달하는 방식으로 구현합니다.

```tsx
import type { ReactNode } from 'react';

type DialogProps = {
  title: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
};

function Dialog({
  title,
  content,
  footer,
}: DialogProps) {
  return (
    <div className="dialog">
      <header className="dialog-header">
        {title}
      </header>

      <section className="dialog-content">
        {content}
      </section>

      <footer className="dialog-footer">
        {footer}
      </footer>
    </div>
  );
}

function App() {
  return (
    <Dialog
      title={<h2>Confirm</h2>}
      content={<p>Are you sure?</p>}
      footer={<button>Continue</button>}
    />
  );
}
```

각 Props는 컴포넌트 내부의 특정 위치에 대응합니다.

따라서 전달되는 콘텐츠의 종류와 배치 위치를 명확하게 구분할 수 있습니다.

### 4.2. Children과 Named Slots의 차이

두 방식은 모두 외부에서 JSX를 전달받아 컴포넌트를 구성하지만, 콘텐츠를 배치하는 방식에 차이가 있습니다.

| 구분 | Children | Named Slots |
|---|---|---|
| 전달 방식 | JSX 태그 내부 | 별도의 Props |
| 배치 위치 | 일반적으로 하나의 지정된 영역 | 여러 개의 독립적인 영역 |
| 사용 목적 | 단일 콘텐츠 영역 및 컨테이너 | 여러 UI 영역의 구성 |
| 유연성 | 단순한 콘텐츠 교체에 적합 | 영역별 콘텐츠 교체에 적합 |

일반적인 콘텐츠 래퍼나 카드 컴포넌트에는 `children`을 사용하고, Header, Body, Footer처럼 여러 영역을 독립적으로 구성해야 하는 컴포넌트에는 Named Slots를 사용하는 것이 적합합니다.

## 5. Specialization을 이용한 컴포넌트 합성

### 5.1. Specialization의 개념

Specialization은 일반적인 목적의 컴포넌트를 기반으로 특정한 사용 목적에 맞는 컴포넌트를 구성하는 방식입니다.

기본 컴포넌트의 구조와 동작을 재사용하면서 Props를 통해 특정 상황에 필요한 콘텐츠나 설정을 전달합니다.

```tsx
import type { ReactNode } from 'react';

type DialogProps = {
  title: string;
  children: ReactNode;
};

function Dialog({
  title,
  children,
}: DialogProps) {
  return (
    <div className="dialog">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function AlertDialog() {
  return (
    <Dialog title="Warning">
      <p>An unexpected error occurred.</p>
      <button>Close</button>
    </Dialog>
  );
}

function ConfirmDialog() {
  return (
    <Dialog title="Confirm">
      <p>Do you want to continue?</p>
      <button>Cancel</button>
      <button>Continue</button>
    </Dialog>
  );
}
```

`AlertDialog`와 `ConfirmDialog`는 모두 공통 구조를 가진 `Dialog`를 재사용하지만, 전달하는 콘텐츠에 따라 서로 다른 목적의 컴포넌트로 구성됩니다.

### 5.2. 일반화와 특수화

컴포넌트를 설계할 때는 공통적인 UI 구조를 일반화하고, 구체적인 사용 목적은 별도의 컴포넌트에서 표현할 수 있습니다.

- **일반화(Generalization):** 공통적인 UI 구조와 동작을 추출하여 재사용 가능한 컴포넌트로 구성합니다.
- **특수화(Specialization):** 일반화된 컴포넌트를 특정 목적에 맞게 조합합니다.

이러한 접근 방식은 비슷한 UI가 여러 곳에서 사용되는 경우 중복 구현을 줄이고, 공통 구조의 변경 사항을 일관되게 반영할 수 있도록 합니다.

## 6. Composition over Inheritance

### 6.1. 개념

Composition over Inheritance는 상속을 통한 기능 확장보다 객체나 구성 요소를 조합하여 기능을 확장하는 설계 원칙입니다.

React는 UI를 컴포넌트 단위로 구성하며, 다른 컴포넌트를 JSX로 포함하거나 Props를 통해 콘텐츠와 동작을 전달하는 방식으로 재사용성을 확보합니다.

예를 들어 특정 컴포넌트를 상속하여 여러 종류의 UI를 구현하기보다는 공통 컴포넌트를 만들고 필요한 콘텐츠를 조합하는 방식을 사용할 수 있습니다.

```tsx
import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  children: ReactNode;
};

function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function UserPanel() {
  return (
    <Panel title="User Information">
      <p>Name: Alice</p>
      <p>Role: Administrator</p>
    </Panel>
  );
}

function StatisticsPanel() {
  return (
    <Panel title="Statistics">
      <p>Total Users: 120</p>
      <p>Active Users: 85</p>
    </Panel>
  );
}
```

`UserPanel`과 `StatisticsPanel`은 `Panel`의 구현을 상속하지 않습니다.

대신 공통 UI를 담당하는 `Panel`을 조합하여 각자의 목적에 맞는 화면을 구성합니다.

### 6.2. 상속 방식과 합성 방식 비교

| 구분 | Inheritance | Composition |
|---|---|---|
| 확장 방식 | 상위 클래스의 기능 상속 | 컴포넌트 조합 |
| 의존 관계 | 상속 계층에 의존 | Props 및 컴포넌트 구성에 의존 |
| 재사용 방식 | 상위 클래스의 구현 재사용 | 독립적인 컴포넌트 재사용 |
| 유연성 | 상속 구조에 영향을 받음 | 필요한 요소를 선택적으로 조합 |
| React 활용 | 일반적인 UI 확장 방식으로 권장하지 않음 | React의 주요 설계 방식 |

React에서는 일반적으로 컴포넌트 합성을 우선적으로 고려합니다.

다만 Composition over Inheritance가 객체지향 상속 자체를 금지한다는 의미는 아닙니다. React 컴포넌트의 UI 구조와 기능을 확장할 때 합성을 우선적으로 활용한다는 의미입니다.

## 7. 컴포넌트 합성과 Props 전달

### 7.1. Props Forwarding

Props Forwarding은 상위 컴포넌트가 전달받은 Props를 하위 컴포넌트에 다시 전달하는 방식입니다.

```tsx
type ButtonProps = {
  label: string;
  disabled?: boolean;
};

function Button({
  label,
  disabled,
}: ButtonProps) {
  return (
    <button disabled={disabled}>
      {label}
    </button>
  );
}

function ButtonWrapper(props: ButtonProps) {
  return (
    <div className="button-wrapper">
      <Button {...props} />
    </div>
  );
}
```

`ButtonWrapper`는 전달받은 Props를 개별적으로 분해하지 않고 Spread Syntax를 이용하여 하위 컴포넌트에 전달합니다.

다만 모든 Props를 무분별하게 전달하면 컴포넌트 간 의존성이 높아지고, 각 컴포넌트가 실제로 사용하는 Props의 범위를 파악하기 어려워질 수 있습니다.

따라서 필요한 Props만 명시적으로 전달하는 방식을 우선적으로 고려해야 합니다.

### 7.2. Props를 통한 동작 조합

컴포넌트는 JSX뿐만 아니라 함수를 Props로 전달받아 동작을 조합할 수도 있습니다.

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
};

function Button({
  label,
  onClick,
}: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}

function App() {
  const handleClick = () => {
    console.log('Button clicked');
  };

  return (
    <Button
      label="Click Me"
      onClick={handleClick}
    />
  );
}
```

`Button`은 클릭 이벤트가 발생했을 때 실행할 구체적인 동작을 직접 결정하지 않습니다.

대신 상위 컴포넌트에서 전달한 함수를 호출합니다.

이러한 구조를 통해 UI 표현과 비즈니스 로직을 분리하고, 동일한 컴포넌트를 서로 다른 동작에 재사용할 수 있습니다.

## 8. 컴포넌트 합성 시 주의사항

### 8.1. 컴포넌트 함수 직접 호출 금지

React 컴포넌트는 일반 함수처럼 직접 호출하지 않고 JSX를 통해 사용해야 합니다.

```tsx
function Child() {
  return <p>Child Component</p>;
}

function Parent() {
  // 올바른 방식
  return <Child />;
}
```

다음과 같이 컴포넌트 함수를 직접 호출하는 방식은 권장되지 않습니다.

```tsx
function Parent() {
  // 잘못된 방식
  return Child();
}
```

React는 JSX를 기반으로 컴포넌트의 렌더링을 관리합니다.

컴포넌트를 직접 호출하면 React가 해당 컴포넌트를 독립적인 컴포넌트로 인식하고 관리하는 구조를 유지할 수 없습니다.

특히 Hooks의 호출 순서와 컴포넌트의 생명주기 관리에 문제가 발생할 수 있습니다.

### 8.2. 과도한 컴포넌트 분리 지양

컴포넌트 합성은 UI를 작은 단위로 분리하는 데 유용하지만, 모든 JSX 요소를 별도의 컴포넌트로 분리해야 한다는 의미는 아닙니다.

불필요하게 작은 컴포넌트가 지나치게 많아지면 다음과 같은 문제가 발생할 수 있습니다.

- 컴포넌트 간 관계를 파악하기 어려워집니다.
- Props 전달 단계가 불필요하게 증가합니다.
- 파일과 코드의 탐색 비용이 증가합니다.
- 단순한 UI 변경에도 여러 컴포넌트를 수정해야 할 수 있습니다.

컴포넌트는 독립적인 책임, 재사용 가능성, 복잡도 등을 고려하여 적절한 수준으로 분리해야 합니다.

### 8.3. 과도한 Props Forwarding 지양

Spread Syntax를 이용한 Props 전달은 코드의 중복을 줄일 수 있지만, 불필요한 Props까지 하위 컴포넌트에 전달할 가능성이 있습니다.

각 컴포넌트가 실제로 사용하는 Props를 명확하게 정의하고, 컴포넌트 간 인터페이스를 적절하게 제한하는 것이 좋습니다.

### 8.4. 컴포넌트의 책임 분리

하나의 컴포넌트가 데이터 조회, 상태 관리, 비즈니스 로직, UI 표현까지 모두 담당하면 재사용성과 유지보수성이 저하될 수 있습니다.

공통 UI를 담당하는 컴포넌트와 특정 기능을 담당하는 컴포넌트를 구분하고, Props를 통해 필요한 데이터를 전달하는 구조를 고려해야 합니다.

## 9. 정리

Component Composition은 독립적인 React 컴포넌트들을 조합하여 복잡한 UI를 구성하는 핵심 설계 방식입니다.

주요 특징은 다음과 같습니다.

- React 애플리케이션은 컴포넌트의 계층적인 조합으로 구성됩니다.
- Props를 이용하여 데이터, 함수, JSX를 전달할 수 있습니다.
- `children`은 컴포넌트 내부에 중첩된 콘텐츠를 전달하는 기본적인 합성 방식입니다.
- Named Slots는 여러 UI 영역에 서로 다른 콘텐츠를 전달할 때 활용할 수 있습니다.
- Specialization은 일반적인 컴포넌트를 특정 목적에 맞게 조합하는 방식입니다.
- React에서는 상속보다 합성을 통한 컴포넌트 확장을 우선적으로 고려합니다.
- 적절한 컴포넌트 분리와 Props 설계를 통해 재사용성과 유지보수성을 확보할 수 있습니다.

Component Composition은 단순히 JSX를 중첩하는 기술이 아니라, UI의 책임을 분리하고 독립적인 컴포넌트를 유연하게 결합하기 위한 React의 핵심 설계 원칙입니다.

## 10. 참고자료

### React 공식 문서

- [Describing the UI](https://react.dev/learn/describing-the-ui)
  - React 컴포넌트의 기본 개념과 UI의 계층적 구성에 관한 설명입니다.
- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - Props 전달, JSX를 이용한 Children 전달, Props Forwarding에 관한 설명입니다.
- [Thinking in React](https://react.dev/learn/thinking-in-react)
  - UI를 컴포넌트 계층으로 분리하고 데이터 흐름을 설계하는 방법을 설명합니다.
- [React Calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks)
  - React가 컴포넌트와 Hooks의 실행을 관리하는 방식 및 컴포넌트 함수를 직접 호출하지 않아야 하는 이유를 설명합니다.
- [Common Components](https://react.dev/reference/react-dom/components/common)
  - React의 기본 DOM 컴포넌트와 `children`을 포함한 공통 Props를 설명합니다.

### TypeScript 공식 문서

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  - TypeScript의 타입 시스템 및 컴포넌트 Props 타입 설계에 참고할 수 있는 공식 문서입니다.