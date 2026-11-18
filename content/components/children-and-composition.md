# Children and Composition

## 1. 개요

Children and Composition은 React 컴포넌트의 `children` Props를 활용하여 콘텐츠를 전달하고, 여러 컴포넌트를 조합하여 유연한 UI 구조를 구성하는 패턴입니다.

React에서는 JSX 태그 내부에 다른 컴포넌트나 요소를 중첩할 수 있으며, 이때 중첩된 콘텐츠는 부모 컴포넌트의 `children` Props로 전달됩니다.

이를 통해 컴포넌트는 내부에 렌더링할 구체적인 콘텐츠를 직접 구현하지 않고도 외부에서 전달받은 콘텐츠를 특정 영역에 배치할 수 있습니다.

주요 목적은 다음과 같습니다.

- **콘텐츠 재사용:** 동일한 컨테이너 컴포넌트에 서로 다른 콘텐츠를 전달할 수 있습니다.
- **구조와 콘텐츠 분리:** 컴포넌트의 외부 구조와 내부 콘텐츠를 독립적으로 관리할 수 있습니다.
- **유연한 UI 구성:** 컴포넌트의 내부 구현을 변경하지 않고 렌더링할 콘텐츠를 교체할 수 있습니다.
- **컴포넌트 간 결합도 감소:** 상위 컴포넌트가 하위 콘텐츠의 구체적인 구현에 의존하지 않도록 설계할 수 있습니다.

## 2. Children의 기본 개념

### 2.1. Children Props

`children`은 JSX 태그 사이에 중첩된 콘텐츠를 전달하는 특별한 Props입니다.

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

function App() {
  return (
    <Card>
      <h2>Profile</h2>
      <p>User information</p>
    </Card>
  );
}
```

위 코드에서 `Card` 컴포넌트 내부에 작성된 `<h2>`와 `<p>`는 하나의 `children` Props로 전달됩니다.

`Card`는 전달받은 콘텐츠를 내부의 `<div>`에 렌더링하지만, 해당 콘텐츠가 어떤 컴포넌트로 구성되어 있는지는 알 필요가 없습니다.

이러한 특성은 콘텐츠의 구체적인 구현과 이를 감싸는 레이아웃 구조를 분리할 수 있도록 합니다.

### 2.2. Children의 전달 방식

`children`은 JSX를 중첩하는 방식뿐만 아니라 일반 Props처럼 명시적으로 전달할 수도 있습니다.

```tsx
import type { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
};

function Container({ children }: ContainerProps) {
  return (
    <section>
      {children}
    </section>
  );
}

function App() {
  return (
    <Container>
      <p>Nested JSX</p>
    </Container>
  );
}
```

위 코드는 다음과 같이 `children`을 명시적으로 전달하는 방식과 동일한 개념입니다.

```tsx
<Container
  children={<p>Nested JSX</p>}
/>
```

일반적으로 JSX 태그 내부에 콘텐츠를 작성하는 방식이 가독성과 사용성 측면에서 적합합니다.

### 2.3. Children의 다양한 형태

`children`에는 하나의 React 요소뿐만 아니라 여러 종류의 콘텐츠를 전달할 수 있습니다.

```tsx
function Container({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

function App() {
  return (
    <>
      <Container>
        <h2>Title</h2>
      </Container>

      <Container>
        Plain Text
      </Container>

      <Container>
        {123}
      </Container>

      <Container>
        {null}
      </Container>

      <Container>
        {[
          <p key="1">First</p>,
          <p key="2">Second</p>,
        ]}
      </Container>
    </>
  );
}
```

React는 `children`으로 다음과 같은 값을 처리할 수 있습니다.

- React Element
- 문자열(String)
- 숫자(Number)
- React Node의 배열
- Portal
- `null`, `undefined`, Boolean 등 렌더링 결과가 없는 값

다만 전달할 수 있는 값과 실제 화면에 표시되는 값은 구분해야 합니다. 예를 들어 Boolean과 `null`은 React Node에 포함되지만 일반적으로 화면에 표시되지 않습니다.

## 3. TypeScript에서 Children 타입 정의

### 3.1. ReactNode

`React.ReactNode`는 React에서 렌더링할 수 있는 다양한 콘텐츠를 표현하는 타입입니다.

일반적인 컨테이너 컴포넌트나 레이아웃 컴포넌트의 `children`을 정의할 때 가장 널리 사용됩니다.

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

`ReactNode`는 문자열, 숫자, React 요소, 배열 등 다양한 렌더링 가능 콘텐츠를 허용하므로 유연한 컴포넌트 설계에 적합합니다.

### 3.2. ReactElement

`React.ReactElement`는 React 요소 객체를 표현하는 타입입니다.

`ReactNode`보다 허용 범위가 좁으며, React 요소 객체만 전달받아야 하는 경우 사용할 수 있습니다.

```tsx
import type { ReactElement } from 'react';

type DialogProps = {
  children: ReactElement;
};

function Dialog({ children }: DialogProps) {
  return (
    <div className="dialog">
      {children}
    </div>
  );
}
```

위 컴포넌트는 일반 문자열이나 숫자 대신 React 요소를 전달받도록 제한합니다.

다만 `ReactElement`를 사용한다고 해서 특정 컴포넌트만 전달할 수 있는 것은 아닙니다. 구체적인 요소 타입까지 제한하려면 추가적인 타입 설계가 필요합니다.

### 3.3. ReactNode와 ReactElement 비교

| 구분 | ReactNode | ReactElement |
|---|---|---|
| 의미 | React가 렌더링할 수 있는 콘텐츠 | React 요소 객체 |
| 문자열 | 허용 | 허용하지 않음 |
| 숫자 | 허용 | 허용하지 않음 |
| React 요소 | 허용 | 허용 |
| 배열 | 허용 | 일반적인 배열 자체는 해당하지 않음 |
| null 및 Boolean | 허용 | 허용하지 않음 |
| 주요 사용 목적 | 일반적인 children 정의 | React 요소 객체 제한 |

일반적인 UI 컨테이너에서는 `ReactNode`를 사용하는 것이 적합합니다.

특정 React 요소를 대상으로 요소의 Props를 검사하거나 복제하는 등의 작업이 필요한 경우에는 `ReactElement`를 고려할 수 있습니다.

### 3.4. Optional Children

모든 컴포넌트에서 `children`이 필수인 것은 아닙니다.

콘텐츠가 없는 상태도 허용하려면 선택적 Props로 정의할 수 있습니다.

```tsx
import type { ReactNode } from 'react';

type PanelProps = {
  children?: ReactNode;
};

function Panel({ children }: PanelProps) {
  return (
    <section className="panel">
      {children ?? <p>No content</p>}
    </section>
  );
}
```

`children?`는 콘텐츠가 전달되지 않아도 컴포넌트를 사용할 수 있도록 합니다.

반대로 반드시 콘텐츠가 존재해야 하는 컴포넌트라면 `children`을 필수 Props로 정의하는 것이 적절합니다.

## 4. Children을 이용한 컴포넌트 패턴

### 4.1. Container Pattern

Container Pattern은 콘텐츠를 감싸는 공통 구조를 별도의 컴포넌트로 분리하는 방식입니다.

```tsx
import type { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <article className="card">
      {children}
    </article>
  );
}

function Profile() {
  return (
    <Card>
      <h2>Alice</h2>
      <p>Backend Engineer</p>
    </Card>
  );
}

function Product() {
  return (
    <Card>
      <h2>Mechanical Keyboard</h2>
      <p>Price: $120</p>
    </Card>
  );
}
```

`Card`는 공통적인 컨테이너 역할만 담당하며, 실제 콘텐츠는 사용하는 컴포넌트에서 결정합니다.

동일한 구조를 여러 화면에서 재사용해야 하는 경우에 적합합니다.

### 4.2. Layout Pattern

Layout Pattern은 페이지의 공통 레이아웃을 컴포넌트로 분리하고, 각 페이지에서 필요한 콘텐츠를 전달하는 방식입니다.

```tsx
import type { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <header>
        <h1>Application</h1>
      </header>

      <main>
        {children}
      </main>

      <footer>
        Copyright 2026
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <Layout>
      <h2>Home</h2>
      <p>Welcome to the application.</p>
    </Layout>
  );
}

function DashboardPage() {
  return (
    <Layout>
      <h2>Dashboard</h2>
      <p>Dashboard information.</p>
    </Layout>
  );
}
```

`Layout`은 페이지의 공통 구조를 유지하고, 각 페이지는 자신의 콘텐츠만 전달합니다.

이를 통해 여러 페이지에서 중복되는 레이아웃 구현을 줄일 수 있습니다.

### 4.3. Named Slots Pattern

하나의 `children`만으로 여러 콘텐츠 영역을 구분하기 어려운 경우에는 별도의 Props를 이용하여 각 영역에 콘텐츠를 전달할 수 있습니다.

이를 Named Slots Pattern이라고 합니다.

```tsx
import type { ReactNode } from 'react';

type DialogProps = {
  header: ReactNode;
  body: ReactNode;
  footer: ReactNode;
};

function Dialog({
  header,
  body,
  footer,
}: DialogProps) {
  return (
    <div className="dialog">
      <header>{header}</header>

      <section>{body}</section>

      <footer>{footer}</footer>
    </div>
  );
}

function App() {
  return (
    <Dialog
      header={<h2>Confirm</h2>}
      body={<p>Do you want to continue?</p>}
      footer={<button>Continue</button>}
    />
  );
}
```

각 Props는 특정 영역에 대응하므로 콘텐츠의 배치 위치가 명확해집니다.

`children`이 단일 콘텐츠 영역을 표현하는 데 적합하다면, Named Slots는 여러 개의 독립적인 영역을 구성하는 데 적합합니다.

### 4.4. Compound Components Pattern

Compound Components Pattern은 여러 하위 컴포넌트가 하나의 논리적인 UI 단위를 구성하도록 설계하는 패턴입니다.

부모 컴포넌트와 하위 컴포넌트들이 공통된 Context를 이용하여 상태나 동작을 공유할 수 있습니다.

```tsx
import {
  createContext,
  useContext,
  useState,
} from 'react';

import type { ReactNode } from 'react';

type TabsContextValue = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(
  null
);

function useTabs() {
  const context = useContext(TabsContext);

  if (context === null) {
    throw new Error(
      'Tabs components must be used within Tabs'
    );
  }

  return context;
}

function Tabs({
  children,
}: {
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab }}
    >
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabs();

  return (
    <button
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
}

function TabPanel({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { activeTab } = useTabs();

  if (activeTab !== id) {
    return null;
  }

  return <div>{children}</div>;
}

Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

function App() {
  return (
    <Tabs>
      <Tabs.Tab id="tab1">Overview</Tabs.Tab>
      <Tabs.Tab id="tab2">Settings</Tabs.Tab>

      <Tabs.Panel id="tab1">
        <p>Overview content</p>
      </Tabs.Panel>

      <Tabs.Panel id="tab2">
        <p>Settings content</p>
      </Tabs.Panel>
    </Tabs>
  );
}
```

위 예제에서 `Tabs`는 상태를 관리하는 부모 컴포넌트이며, `Tab`과 `TabPanel`은 Context를 통해 선택 상태를 공유합니다.

사용자는 JSX의 중첩 구조를 통해 컴포넌트의 구성을 직관적으로 표현할 수 있습니다.

Compound Components는 Tabs, Accordion, Menu, Select 등 여러 하위 요소가 공통 상태를 공유해야 하는 UI에서 활용할 수 있습니다.

단, 위 예제는 개념을 설명하기 위한 단순화된 구현이며, 실제 접근성 있는 Tabs를 구현하려면 키보드 이동, 포커스 관리, ARIA 속성 등을 추가해야 합니다.

## 5. Render Props Pattern

### 5.1. 개념

Render Props는 컴포넌트에 함수를 Props로 전달하고, 해당 함수의 반환값을 UI로 렌더링하는 패턴입니다.

일반적인 `children`은 렌더링할 콘텐츠 자체를 전달하지만, Render Props는 콘텐츠를 생성하는 함수를 전달한다는 차이가 있습니다.

```tsx
import type { ReactNode } from 'react';

type MouseTrackerProps = {
  children: (position: {
    x: number;
    y: number;
  }) => ReactNode;
};

function MouseTracker({
  children,
}: MouseTrackerProps) {
  const position = {
    x: 100,
    y: 200,
  };

  return (
    <div>
      {children(position)}
    </div>
  );
}

function App() {
  return (
    <MouseTracker>
      {({ x, y }) => (
        <p>
          Mouse Position: {x}, {y}
        </p>
      )}
    </MouseTracker>
  );
}
```

`MouseTracker`는 위치 데이터를 제공하고, 실제로 데이터를 어떻게 표현할지는 외부에서 전달한 함수가 결정합니다.

Render Props는 데이터나 상태를 제공하는 로직과 해당 데이터를 표현하는 UI를 분리하는 데 활용할 수 있습니다.

### 5.2. Children과 Render Props 비교

| 구분 | 일반적인 Children | Render Props |
|---|---|---|
| 전달 방식 | React Node | 함수 |
| 반환 결과 | 전달된 콘텐츠 | 함수가 반환한 콘텐츠 |
| 데이터 전달 | Props 또는 Context 등 별도 전달 | 함수 인자로 전달 가능 |
| 주요 목적 | 콘텐츠 및 레이아웃 조합 | 데이터와 렌더링 책임 분리 |
| 활용 사례 | Card, Panel, Layout | 데이터 기반 UI 렌더링 |

Render Props는 함수 호출을 통해 데이터를 전달할 수 있다는 장점이 있지만, 단순한 콘텐츠 조합에는 일반적인 `children`이 더 적합합니다.

## 6. Children과 Context의 관계

`children`과 Context는 서로 다른 문제를 해결하는 기능이지만, 함께 사용하면 복잡한 컴포넌트 구조를 유연하게 설계할 수 있습니다.

`children`은 컴포넌트 내부에 렌더링할 콘텐츠를 전달하는 역할을 담당합니다.

Context는 상위 컴포넌트에서 제공한 데이터를 하위 컴포넌트가 중간 단계의 Props 전달 없이 사용할 수 있도록 합니다.

```tsx
import {
  createContext,
  useContext,
} from 'react';

import type { ReactNode } from 'react';

const ThemeContext = createContext('light');

function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeContext.Provider value="dark">
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeButton() {
  const theme = useContext(ThemeContext);

  return (
    <button data-theme={theme}>
      Current Theme: {theme}
    </button>
  );
}

function App() {
  return (
    <ThemeProvider>
      <main>
        <ThemeButton />
      </main>
    </ThemeProvider>
  );
}
```

위 구조에서 `ThemeProvider`는 `children`을 통해 하위 콘텐츠를 전달받고, Context를 통해 테마 정보를 제공합니다.

`ThemeButton`은 중간 컴포넌트가 테마 정보를 전달하지 않아도 Context에서 해당 값을 읽을 수 있습니다.

다만 단순히 Props를 여러 단계 전달해야 한다는 이유만으로 Context를 도입할 필요는 없습니다.

React 공식 문서에서는 JSX를 `children`으로 전달하거나 컴포넌트를 추출하는 방식도 Props 전달을 줄이는 대안으로 제시합니다.

## 7. Children 조작과 주의사항

### 7.1. Children의 불투명성

`children`은 다양한 종류의 React Node를 포함할 수 있으므로 일반적인 배열이나 단일 React 요소라고 가정해서는 안 됩니다.

예를 들어 다음과 같은 구조가 전달될 수 있습니다.

```tsx
<Card>
  <h2>Title</h2>
  Text
  {condition && <p>Additional Content</p>}
</Card>
```

따라서 `children`에 배열 메서드를 직접 호출하거나 특정 요소 구조를 가정하는 방식은 주의해야 합니다.

필요한 경우 React에서 제공하는 `Children` API를 이용할 수 있습니다.

### 7.2. Children API

React는 `children`을 다루기 위한 `Children` API를 제공합니다.

대표적인 API는 다음과 같습니다.

| API | 설명 |
|---|---|
| `Children.map` | 각 자식 요소를 순회하고 변환합니다. |
| `Children.forEach` | 각 자식 요소를 순회합니다. |
| `Children.count` | 자식 요소의 개수를 반환합니다. |
| `Children.only` | 단일 React 요소인지 확인하고 반환합니다. |
| `Children.toArray` | 자식 요소를 배열로 변환합니다. |

예를 들어 `Children.map`을 이용하면 전달받은 콘텐츠를 순회할 수 있습니다.

```tsx
import { Children } from 'react';

import type { ReactNode } from 'react';

function List({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ul>
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  );
}
```

다만 `Children` API는 전달받은 `children`의 직접적인 구조만 다룹니다.

하위 컴포넌트 내부에 중첩된 콘텐츠까지 재귀적으로 탐색하지는 않습니다.

또한 `Children` API를 이용한 복잡한 자식 요소 조작은 컴포넌트 간 데이터 흐름을 이해하기 어렵게 만들 수 있으므로 필요한 경우에만 사용해야 합니다.

### 7.3. cloneElement

`cloneElement`는 기존 React 요소를 기반으로 새로운 요소를 생성하면서 Props나 Children을 변경하는 API입니다.

```tsx
import { cloneElement } from 'react';

import type { ReactElement } from 'react';

type WrapperProps = {
  children: ReactElement<{
    className?: string;
  }>;
};

function Wrapper({
  children,
}: WrapperProps) {
  return cloneElement(children, {
    className: 'custom-element',
  });
}

function App() {
  return (
    <Wrapper>
      <button>Click</button>
    </Wrapper>
  );
}
```

위 코드에서 `Wrapper`는 전달받은 React 요소를 복제하고 `className` Props를 추가합니다.

다만 `cloneElement`는 원본 요소의 구조와 Props를 알아야 하며, 부모와 자식 간 데이터 흐름을 추적하기 어렵게 만들 수 있습니다.

React 공식 문서에서도 `cloneElement` 사용은 일반적이지 않으며, 가능한 경우 Render Props나 Context 등의 대안을 고려하도록 안내합니다.

## 8. Children과 Composition 설계 원칙

### 8.1. 콘텐츠와 구조의 분리

컴포넌트는 가능한 한 자신의 책임에 해당하는 구조와 동작에 집중해야 합니다.

컨테이너 컴포넌트가 내부 콘텐츠의 구체적인 구현까지 담당하기보다는 `children`을 통해 외부에서 전달받는 구조를 고려할 수 있습니다.

### 8.2. 필요한 수준의 유연성 제공

모든 컴포넌트에 `children`을 사용할 필요는 없습니다.

콘텐츠의 구조가 고정되어 있고 컴포넌트의 목적이 명확하다면 일반적인 Props만으로 충분할 수 있습니다.

반대로 콘텐츠를 자유롭게 교체하거나 다양한 화면에서 재사용해야 한다면 `children`을 활용하는 것이 적합합니다.

### 8.3. 명확한 컴포넌트 인터페이스 유지

`children`은 다양한 콘텐츠를 허용하기 때문에 유연성이 높지만, 지나치게 자유로운 콘텐츠 구조는 컴포넌트 사용 규칙을 불명확하게 만들 수 있습니다.

Header, Body, Footer 등 콘텐츠의 위치와 역할이 명확해야 하는 경우에는 Named Slots를 사용하는 것이 적합합니다.

### 8.4. Context의 무분별한 사용 방지

여러 단계에 걸친 Props 전달이 발생하더라도 무조건 Context를 도입할 필요는 없습니다.

중간 컴포넌트가 데이터를 직접 사용하지 않고 하위 컴포넌트를 조합하는 역할만 수행한다면, JSX를 `children`으로 전달하는 방식이 더 단순할 수 있습니다.

## 9. 정리

Children and Composition은 React에서 컴포넌트 간 콘텐츠를 전달하고 UI 구조를 조합하는 핵심 설계 방식입니다.

주요 특징은 다음과 같습니다.

- `children`은 JSX 태그 사이에 작성된 콘텐츠를 전달하는 특별한 Props입니다.
- `ReactNode`는 일반적인 콘텐츠 전달에 사용하며, `ReactElement`는 React 요소 객체를 제한적으로 전달할 때 사용합니다.
- Container Pattern과 Layout Pattern은 공통 구조와 콘텐츠를 분리하는 데 활용됩니다.
- Named Slots는 하나의 컴포넌트에 여러 개의 독립적인 콘텐츠 영역을 구성할 때 활용됩니다.
- Compound Components는 여러 하위 컴포넌트가 하나의 논리적인 UI 단위를 구성하도록 합니다.
- Render Props는 함수를 통해 렌더링 로직과 데이터를 전달하는 패턴입니다.
- Context는 컴포넌트 계층 전반에 데이터를 제공하며, `children`과 함께 사용하여 유연한 컴포넌트 구조를 구성할 수 있습니다.
- `Children` API와 `cloneElement`는 자식 요소를 직접 조작할 때 사용할 수 있지만, 복잡한 데이터 흐름을 만들지 않도록 주의해야 합니다.

Children and Composition은 컴포넌트의 내부 구조와 외부 콘텐츠를 분리하여 재사용성과 확장성을 확보하는 중요한 React 설계 원칙입니다.

## 10. 참고자료

### React 공식 문서

- [Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - Props 전달 및 JSX 중첩을 통한 `children` 전달 방식을 설명합니다.
- [Passing JSX as Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
  - `children`을 이용하여 컴포넌트에 JSX 콘텐츠를 전달하는 방법을 설명합니다.
- [Children](https://react.dev/reference/react/Children)
  - `Children.map`, `Children.count`, `Children.toArray` 등 Children API를 설명합니다.
- [cloneElement](https://react.dev/reference/react/cloneElement)
  - 기존 React 요소를 복제하고 Props 및 Children을 변경하는 방법과 대안을 설명합니다.
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
  - Context를 이용한 데이터 전달과 컴포넌트 추출 및 JSX Children을 활용한 대안을 설명합니다.
- [Thinking in React](https://react.dev/learn/thinking-in-react)
  - 컴포넌트 계층 구조를 설계하고 UI를 독립적인 컴포넌트로 분리하는 방법을 설명합니다.

### TypeScript 공식 문서

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
  - React 컴포넌트 Props와 Children 타입을 설계할 때 참고할 수 있는 TypeScript 공식 문서입니다.