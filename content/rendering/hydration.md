# Hydration

Hydration은 서버에서 생성한 HTML에 클라이언트 React가 연결되어 상호작용 가능한 상태로 전환하는 과정입니다.

Server-Side Rendering(SSR)에서는 서버가 React 컴포넌트를 HTML로 렌더링하여 브라우저에 전달합니다. 브라우저는 JavaScript가 로드되기 전에도 전달받은 HTML을 화면에 표시할 수 있습니다.

그러나 서버에서 생성한 HTML만으로는 React의 이벤트 핸들러나 State 업데이트와 같은 클라이언트 기능이 동작하지 않습니다.

Hydration은 이러한 HTML을 React가 인계받아 기존 DOM 구조를 재사용하면서 이벤트 처리와 State 관리 등의 기능을 연결하는 과정입니다.

Hydration을 통해 서버 렌더링의 초기 화면 표시 이점과 클라이언트 렌더링의 상호작용 기능을 함께 활용할 수 있습니다.

## 1. What Is Hydration?

일반적인 Client-Side Rendering(CSR)에서는 브라우저가 JavaScript를 다운로드하고 실행한 후 React가 DOM을 생성합니다.

반면 Server-Side Rendering(SSR)에서는 서버가 먼저 HTML을 생성하여 브라우저에 전달합니다.

Hydration은 SSR로 생성된 HTML을 클라이언트 React가 인계받는 과정입니다.

### 1.1 Client-Side Rendering

CSR에서는 브라우저에서 React가 실행되어 UI를 생성합니다.

```text
Browser
   |
   v
Download JavaScript
   |
   v
Execute React
   |
   v
Render Components
   |
   v
Create DOM
   |
   v
Display UI
   |
   v
Interactive UI
```

초기 HTML이 비어 있거나 최소한의 Root Element만 포함하는 경우 JavaScript가 로드되고 실행되기 전까지 실제 콘텐츠가 표시되지 않을 수 있습니다.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="/assets/main.js"></script>
  </body>
</html>
```

React는 `createRoot`를 사용하여 Root Element 내부에 UI를 렌더링합니다.

```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(<App />);
```

### 1.2 Server-Side Rendering

SSR에서는 서버에서 React 컴포넌트를 HTML로 변환합니다.

```text
Server
   |
   v
Execute React Components
   |
   v
Render HTML
   |
   v
Send HTML Response
   |
   v
Browser
   |
   v
Parse HTML
   |
   v
Display UI
```

예를 들어 다음과 같은 React 컴포넌트가 있다고 가정합니다.

```tsx
function App() {
  return (
    <main>
      <h1>Hello, React!</h1>
      <button>Click Me</button>
    </main>
  );
}
```

서버는 컴포넌트를 HTML 문자열로 렌더링할 수 있습니다.

```tsx
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

생성되는 HTML은 다음과 같은 형태입니다.

```html
<main>
  <h1>Hello, React!</h1>
  <button>Click Me</button>
</main>
```

브라우저는 전달받은 HTML을 파싱하여 화면에 표시합니다.

다만 이 시점에는 React의 이벤트 핸들러가 연결되지 않았으므로 버튼을 클릭해도 React의 이벤트 처리 로직은 실행되지 않습니다.

### 1.3 Hydration

Hydration은 브라우저에 이미 생성되어 있는 서버 HTML을 React가 인계받는 과정입니다.

```text
Server
   |
   v
Render React Components
   |
   v
Generate HTML
   |
   v
Send HTML Response
   |
   v
Browser
   |
   v
Parse and Display HTML
   |
   v
Download JavaScript
   |
   v
Execute React
   |
   v
Hydration
   |
   v
Interactive UI
```

Hydration이 완료되면 React는 기존 DOM을 기반으로 클라이언트 측 UI를 관리할 수 있습니다.

일반적인 SSR 환경에서는 서버가 생성한 DOM을 다시 전부 생성하는 대신 기존 DOM을 재사용하면서 React의 동작을 연결합니다.

## 2. Server Rendering and Hydration Flow

SSR과 Hydration은 서버와 브라우저에서 서로 다른 단계로 진행됩니다.

### 2.1 Server Rendering

서버에서는 React 컴포넌트를 HTML로 변환합니다.

```tsx
import { renderToString } from 'react-dom/server';

function App() {
  return (
    <main>
      <h1>Hello, React!</h1>
      <button>Click Me</button>
    </main>
  );
}

const html = renderToString(<App />);
```

서버는 생성된 HTML을 HTTP Response에 포함하여 브라우저로 전달합니다.

```html
<div id="root">
  <main>
    <h1>Hello, React!</h1>
    <button>Click Me</button>
  </main>
</div>
```

### 2.2 Browser Parsing

브라우저는 HTML Response를 수신한 후 HTML Parser를 통해 DOM Tree를 생성합니다.

이 과정에서 JavaScript가 아직 실행되지 않았더라도 서버가 전달한 콘텐츠를 화면에 표시할 수 있습니다.

```text
HTML Response
      |
      v
HTML Parser
      |
      v
DOM Tree
      |
      v
Browser Rendering
      |
      v
Visible Content
```

이 단계에서는 서버가 생성한 HTML을 기반으로 초기 화면을 표시할 수 있지만, React의 클라이언트 동작은 아직 연결되지 않았습니다.

### 2.3 Client JavaScript Execution

브라우저가 React와 애플리케이션 JavaScript를 다운로드하고 실행합니다.

클라이언트에서는 서버와 동일한 React 컴포넌트 구조를 사용하여 초기 렌더링 결과를 계산합니다.

```tsx
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

hydrateRoot(container, <App />);
```

React는 서버에서 생성된 HTML과 클라이언트에서 계산한 초기 렌더링 결과가 일치하는지 확인하면서 기존 DOM을 인계받습니다.

이때 이벤트 핸들러와 State 관리 등의 클라이언트 기능이 연결됩니다.

### 2.4 Interactive UI

Hydration이 진행되면 React는 해당 Root의 DOM을 관리합니다.

이후 State 업데이트가 발생하면 React의 일반적인 Render와 Commit 과정을 통해 UI를 업데이트합니다.

```text
Server Rendering
      |
      v
HTML Response
      |
      v
Browser DOM
      |
      v
Hydration
      |
      v
Interactive React Application
      |
      v
State Update
      |
      v
Render
      |
      v
Commit
      |
      v
DOM Update
```

Hydration은 초기 HTML을 클라이언트 React에 연결하는 과정이며, Hydration 이후에는 일반적인 React 렌더링 및 업데이트 흐름이 적용됩니다.

## 3. hydrateRoot

`hydrateRoot`는 서버에서 생성된 HTML이 이미 존재하는 DOM Node에 React 애플리케이션을 연결하는 API입니다.

React 18부터 제공되는 Client Root API이며, React 19에서도 사용됩니다.

### 3.1 Basic Usage

```tsx
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

hydrateRoot(container, <App />);
```

`hydrateRoot`는 다음과 같은 인자를 전달받습니다.

| 인자 | 설명 |
|---|---|
| `container` | 서버에서 생성된 HTML이 존재하는 DOM Element |
| `reactNode` | 해당 DOM에 Hydration할 React Element |
| `options` | Hydration 관련 설정을 전달하는 선택적 객체 |

기본적으로 애플리케이션이 시작될 때 한 번 호출합니다.

Hydration 이후에는 동일한 Root에 대해 `hydrateRoot`를 반복 호출하지 않고 React의 State와 Props를 이용하여 UI를 업데이트합니다.

### 3.2 hydrateRoot vs createRoot

`hydrateRoot`와 `createRoot`는 모두 브라우저에서 React 애플리케이션을 초기화하는 API이지만 목적이 다릅니다.

| 구분 | `createRoot` | `hydrateRoot` |
|---|---|---|
| 주요 목적 | 클라이언트 렌더링 | 서버 렌더링 HTML의 Hydration |
| 초기 DOM | 비어 있거나 기존 DOM을 대체할 수 있음 | 서버에서 생성한 HTML이 존재해야 함 |
| 초기 렌더링 | React가 DOM을 생성 | 기존 DOM을 재사용하며 React를 연결 |
| 사용 환경 | CSR | SSR, SSG |
| 주요 API | `root.render()` | `hydrateRoot()` |

서버 렌더링이나 정적 생성으로 HTML이 이미 존재하는 경우에는 `createRoot`가 아니라 `hydrateRoot`를 사용해야 합니다.

```tsx
// CSR
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <App />
);
```

```tsx
// SSR / SSG
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(
  document.getElementById('root')!,
  <App />
);
```

서버에서 생성한 HTML이 존재하는데 `createRoot`를 사용하면 React가 기존 DOM을 재사용하는 Hydration 과정을 수행하지 않고 해당 Root의 콘텐츠를 클라이언트 렌더링 결과로 대체합니다.

### 3.3 hydrateRoot Options

`hydrateRoot`는 Hydration과 관련된 선택적 설정을 전달받을 수 있습니다.

```tsx
hydrateRoot(
  document.getElementById('root')!,
  <App />,
  {
    identifierPrefix: 'app-',

    onRecoverableError(error, errorInfo) {
      console.error('Recoverable error:', error);
      console.error(errorInfo.componentStack);
    },
  }
);
```

대표적인 옵션은 다음과 같습니다.

| 옵션 | 설명 |
|---|---|
| `identifierPrefix` | `useId`가 생성하는 ID에 사용할 접두사 |
| `onRecoverableError` | React가 자동으로 복구한 오류를 전달받는 콜백 |
| `onCaughtError` | Error Boundary가 처리한 오류를 전달받는 콜백 |
| `onUncaughtError` | Error Boundary에서 처리되지 않은 오류를 전달받는 콜백 |

`identifierPrefix`는 여러 React Root가 동일한 페이지에 존재하는 경우 ID 충돌을 방지하는 데 활용할 수 있습니다.

서버 렌더링 API에도 동일한 `identifierPrefix`를 전달해야 합니다.

## 4. Hydration Mismatch

Hydration Mismatch는 서버에서 생성한 HTML과 클라이언트에서 계산한 초기 렌더링 결과가 일치하지 않는 현상입니다.

Hydration에서는 서버와 클라이언트의 초기 출력이 동일해야 합니다.

서버에서 생성한 HTML과 클라이언트의 초기 React Element가 서로 다르면 React는 Hydration 과정에서 불일치를 감지할 수 있습니다.

### 4.1 Example of Hydration Mismatch

다음 예제를 살펴보겠습니다.

```tsx
function App() {
  const currentTime = new Date().toLocaleTimeString();

  return <p>{currentTime}</p>;
}
```

서버와 클라이언트에서 컴포넌트가 실행되는 시점이 다르므로 서로 다른 시간이 출력될 수 있습니다.

```text
Server Rendering

<p>10:00:00</p>


Client Rendering

<p>10:00:02</p>
```

서버 HTML과 클라이언트 초기 렌더링 결과가 다르므로 Hydration Mismatch가 발생할 수 있습니다.

### 4.2 Common Causes

Hydration Mismatch는 서버와 클라이언트의 렌더링 환경 또는 데이터가 일치하지 않을 때 주로 발생합니다.

대표적인 원인은 다음과 같습니다.

#### Different Data

서버와 클라이언트가 서로 다른 데이터를 사용하면 초기 렌더링 결과가 달라질 수 있습니다.

```tsx
function App({ userName }: { userName: string }) {
  return <h1>Welcome, {userName}</h1>;
}
```

서버에서는 `Alice`를 전달하고 클라이언트에서는 `Bob`을 전달하면 서로 다른 HTML이 생성됩니다.

```text
Server:  Welcome, Alice
Client:  Welcome, Bob
```

서버에서 사용한 초기 데이터를 클라이언트에도 동일하게 전달해야 합니다.

#### Browser-only APIs

서버에는 존재하지 않는 브라우저 API를 렌더링 과정에서 직접 사용하면 문제가 발생할 수 있습니다.

```tsx
function App() {
  const width = window.innerWidth;

  return <p>Width: {width}</p>;
}
```

서버에서는 `window` 객체가 존재하지 않으므로 해당 코드가 실행되지 않거나 오류가 발생할 수 있습니다.

다음과 같이 실행 환경에 따라 서로 다른 UI를 렌더링하는 코드도 주의해야 합니다.

```tsx
function App() {
  const isBrowser = typeof window !== 'undefined';

  return (
    <p>
      {isBrowser ? 'Browser' : 'Server'}
    </p>
  );
}
```

서버에서는 `Server`, 클라이언트에서는 `Browser`가 출력되므로 Hydration Mismatch가 발생할 수 있습니다.

#### Random Values

렌더링 과정에서 `Math.random()`을 사용하면 서버와 클라이언트에서 서로 다른 값이 생성될 수 있습니다.

```tsx
function App() {
  const value = Math.random();

  return <p>{value}</p>;
}
```

초기 렌더링 결과가 매번 달라지므로 서버와 클라이언트의 결과가 일치하지 않을 수 있습니다.

#### Locale and Timezone Differences

날짜, 시간, 숫자 등을 지역화하여 출력하는 경우 서버와 클라이언트의 Locale 또는 Timezone 설정이 다르면 결과가 달라질 수 있습니다.

```tsx
function App() {
  const date = new Date();

  return (
    <p>
      {date.toLocaleDateString()}
    </p>
  );
}
```

서버와 클라이언트의 Locale 및 Timezone 설정이 다르면 동일한 날짜라도 서로 다른 문자열로 출력될 수 있습니다.

#### Invalid HTML Nesting

HTML 명세에 맞지 않는 Element 중첩은 브라우저가 HTML을 파싱하는 과정에서 DOM 구조를 변경하게 만들 수 있습니다.

```tsx
function App() {
  return (
    <p>
      Paragraph
      <div>Nested Div</div>
    </p>
  );
}
```

`p` Element 내부에 `div`를 배치하는 것은 유효하지 않은 HTML 구조입니다.

브라우저의 HTML Parser가 예상과 다른 DOM 구조를 생성할 수 있으므로 Hydration Mismatch의 원인이 됩니다.

올바른 구조로 수정해야 합니다.

```tsx
function App() {
  return (
    <div>
      <p>Paragraph</p>
      <div>Nested Div</div>
    </div>
  );
}
```

### 4.3 Hydration Mismatch Handling

Hydration Mismatch가 발생하면 React는 불일치를 경고할 수 있습니다.

일부 불일치는 React가 복구할 수 있지만, 모든 불일치가 자동으로 수정되는 것은 아닙니다.

React는 성능상의 이유로 서버 HTML과 클라이언트 렌더링 결과의 모든 차이를 검증하거나 수정한다고 보장하지 않습니다.

따라서 Hydration Warning을 단순히 무시하기보다는 서버와 클라이언트의 초기 렌더링 결과가 동일하도록 수정하는 것이 중요합니다.

## 5. Preventing Hydration Mismatch

Hydration Mismatch를 방지하려면 서버와 클라이언트가 동일한 초기 렌더링 결과를 생성하도록 설계해야 합니다.

### 5.1 Use the Same Initial Data

서버에서 조회한 데이터를 클라이언트에도 동일하게 전달하는 방식이 권장됩니다.

```tsx
interface AppProps {
  userName: string;
}

function App({ userName }: AppProps) {
  return <h1>Welcome, {userName}</h1>;
}
```

서버에서 전달한 `userName`을 클라이언트의 초기 렌더링에서도 동일하게 사용하면 Hydration Mismatch를 방지할 수 있습니다.

SSR 프레임워크에서는 일반적으로 서버에서 가져온 데이터를 HTML 또는 별도의 데이터 전달 구조에 포함하여 클라이언트가 초기 렌더링에 재사용하도록 구성합니다.

### 5.2 Use useEffect for Browser-only Logic

브라우저에서만 사용할 수 있는 값에 의존하는 UI는 최초 렌더링 이후 Effect에서 처리할 수 있습니다.

```tsx
import { useEffect, useState } from 'react';

function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <p>
      {isClient ? 'Browser' : 'Server'}
    </p>
  );
}
```

서버와 클라이언트의 최초 렌더링에서는 모두 `Server`가 출력됩니다.

Hydration이 완료된 후 Effect가 실행되면 `isClient`가 `true`로 변경되고 새로운 렌더링이 수행됩니다.

```text
Server Rendering
      |
      v
isClient = false
      |
      v
HTML: Server
      |
      v
Client Initial Rendering
      |
      v
isClient = false
      |
      v
Hydration
      |
      v
Effect Execution
      |
      v
isClient = true
      |
      v
Re-render
      |
      v
UI: Browser
```

이 방식은 초기 서버 HTML과 클라이언트의 렌더링 결과를 일치시킨 후 브라우저 전용 UI를 표시하는 데 활용할 수 있습니다.

다만 Hydration 이후 추가 렌더링이 발생하므로 UI가 변경되는 순간 화면이 깜빡이거나 콘텐츠가 바뀌는 것처럼 보일 수 있습니다.

따라서 브라우저 전용 기능이 반드시 필요한 경우에 사용해야 합니다.

### 5.3 Use Deterministic Values

렌더링 과정에서 사용하는 값은 서버와 클라이언트에서 동일한 결과를 생성할 수 있어야 합니다.

예를 들어 다음과 같은 값은 초기 렌더링에 직접 사용하지 않는 것이 좋습니다.

- `Math.random()`
- 현재 시간에 의존하는 값
- 브라우저의 화면 크기
- `localStorage` 또는 `sessionStorage`의 값
- 사용자 Locale에 따라 달라지는 출력

이러한 값이 필요하다면 서버에서 결정한 값을 클라이언트에 전달하거나 Hydration 이후 적절한 시점에 반영해야 합니다.

### 5.4 suppressHydrationWarning

React는 특정 Element에서 발생하는 불가피한 Hydration Warning을 억제하기 위한 `suppressHydrationWarning` 속성을 제공합니다.

```tsx
function App() {
  const currentTime = new Date().toLocaleTimeString();

  return (
    <time suppressHydrationWarning>
      {currentTime}
    </time>
  );
}
```

이 속성은 서버와 클라이언트의 텍스트 콘텐츠가 의도적으로 다를 수 있는 경우 등에 제한적으로 사용할 수 있습니다.

주의사항은 다음과 같습니다.

- 불일치를 근본적으로 해결하는 기능이 아닙니다.
- 해당 Element의 한 단계 아래에서 발생하는 불일치에 대한 경고를 억제하는 용도입니다.
- React가 불일치한 콘텐츠를 자동으로 수정하도록 보장하지 않습니다.
- 일반적인 Hydration 문제를 해결하기 위한 기본적인 방법으로 사용해서는 안 됩니다.

가능하면 서버와 클라이언트의 초기 렌더링 결과를 일치시키는 방식으로 문제를 해결해야 합니다.

## 6. Hydration and Event Handling

Hydration의 중요한 목적 중 하나는 서버에서 생성한 HTML에 React의 이벤트 처리 기능을 연결하는 것입니다.

서버에서 생성된 HTML에는 실제 JavaScript 이벤트 핸들러가 포함되지 않습니다.

예를 들어 다음과 같은 컴포넌트가 있다고 가정합니다.

```tsx
function Counter() {
  function handleClick() {
    console.log('Button clicked');
  }

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

서버에서 생성되는 HTML은 다음과 같은 형태입니다.

```html
<button>Click Me</button>
```

HTML에는 `handleClick` 함수가 포함되어 있지 않습니다.

클라이언트에서 React가 실행되고 Hydration이 진행되면 React는 컴포넌트의 이벤트 처리 로직을 연결합니다.

이후 버튼을 클릭하면 React의 이벤트 시스템을 통해 `handleClick`이 실행됩니다.

```text
Server HTML
      |
      v
<button>Click Me</button>
      |
      v
Browser DOM
      |
      v
React Hydration
      |
      v
Attach React Event Handling
      |
      v
User Click
      |
      v
handleClick()
      |
      v
React Event Processing
```

Hydration은 단순히 HTML을 화면에 표시하는 작업이 아니라 서버 HTML과 클라이언트 React의 동작을 연결하는 과정입니다.

## 7. Hydration and Streaming SSR

기존 SSR 방식은 서버에서 전체 HTML을 생성한 후 브라우저에 전달하는 방식으로 구현할 수 있습니다.

그러나 페이지의 일부 콘텐츠를 생성하는 데 오랜 시간이 걸리면 전체 HTML이 준비될 때까지 응답을 지연해야 할 수 있습니다.

Streaming SSR은 HTML을 하나의 완성된 결과로 기다리지 않고 준비된 부분부터 순차적으로 전송하는 방식입니다.

React는 `Suspense`와 Streaming SSR을 함께 사용하여 이러한 문제를 해결할 수 있습니다.

### 7.1 Traditional Server Rendering

일반적인 전체 HTML 렌더링 흐름은 다음과 같습니다.

```text
Request
   |
   v
Render Entire React Tree
   |
   v
Wait for All Content
   |
   v
Generate Complete HTML
   |
   v
Send HTML Response
   |
   v
Browser Display
```

페이지의 일부 콘텐츠가 늦게 준비되더라도 전체 렌더링이 완료될 때까지 응답을 기다릴 수 있습니다.

### 7.2 Streaming Server Rendering

Streaming SSR에서는 먼저 준비된 HTML을 전송하고 나머지 콘텐츠는 준비되는 대로 이어서 전송합니다.

```text
Request
   |
   v
Render React Tree
   |
   +----> Shell Ready
   |          |
   |          v
   |       Send HTML
   |
   +----> Suspense Content Loading
              |
              v
         Content Ready
              |
              v
         Send Additional HTML
              |
              v
         Browser Updates Content
```

다음 예제를 살펴보겠습니다.

```tsx
import { Suspense } from 'react';

function ProfilePage() {
  return (
    <main>
      <h1>Profile</h1>

      <Suspense fallback={<p>Loading posts...</p>}>
        <Posts />
      </Suspense>
    </main>
  );
}
```

`Posts`가 Suspense를 활성화하는 데이터 소스에 의존하여 렌더링을 중단하면 React는 해당 콘텐츠가 준비될 때까지 Fallback을 표시할 수 있습니다.

서버는 먼저 다음과 같은 HTML을 전송할 수 있습니다.

```html
<main>
  <h1>Profile</h1>
  <p>Loading posts...</p>
</main>
```

이후 `Posts`의 렌더링이 완료되면 추가 HTML과 이를 표시하기 위한 스크립트가 전송됩니다.

브라우저는 추가 콘텐츠를 반영하고 화면에 실제 게시물 목록을 표시할 수 있습니다.

이러한 과정은 클라이언트 React가 다운로드되고 Hydration이 완료되기 전에도 진행될 수 있습니다.

### 7.3 renderToPipeableStream

Node.js 환경에서는 `renderToPipeableStream`을 사용하여 React Tree를 HTML Stream으로 렌더링할 수 있습니다.

```tsx
import { renderToPipeableStream } from 'react-dom/server';
import App from './App';

const { pipe, abort } = renderToPipeableStream(
  <App />,
  {
    bootstrapScripts: ['/main.js'],

    onShellReady() {
      response.setHeader(
        'content-type',
        'text/html'
      );

      pipe(response);
    },

    onShellError(error) {
      console.error(error);

      response.statusCode = 500;
      response.send('<h1>Something went wrong</h1>');
    },

    onError(error) {
      console.error(error);
    },
  }
);
```

주요 옵션은 다음과 같습니다.

| 옵션 | 설명 |
|---|---|
| `bootstrapScripts` | 클라이언트에서 실행할 JavaScript 파일 지정 |
| `onShellReady` | 초기 Shell의 렌더링이 완료되었을 때 실행 |
| `onShellError` | 초기 Shell 렌더링 중 오류가 발생했을 때 실행 |
| `onAllReady` | Suspense 경계를 포함한 전체 렌더링이 완료되었을 때 실행 |
| `onError` | 서버 렌더링 중 오류가 발생했을 때 실행 |

`renderToPipeableStream`은 Node.js Stream을 사용하는 환경을 위한 API입니다.

Web Streams를 지원하는 환경에서는 `renderToReadableStream`을 사용할 수 있습니다.

### 7.4 Selective Hydration

Streaming SSR과 Suspense는 클라이언트의 Hydration을 더 세분화할 수 있도록 지원합니다.

일반적인 Hydration에서는 Root 내부의 React Tree를 인계받는 과정이 진행됩니다.

그러나 Suspense Boundary를 활용하면 전체 UI가 한 번에 Hydration될 때까지 기다리지 않고 특정 영역을 우선적으로 처리할 수 있습니다.

이를 Selective Hydration이라고 합니다.

예를 들어 다음과 같은 페이지가 있다고 가정합니다.

```tsx
import { Suspense } from 'react';

function App() {
  return (
    <main>
      <Header />

      <Suspense fallback={<p>Loading profile...</p>}>
        <Profile />
      </Suspense>

      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments />
      </Suspense>
    </main>
  );
}
```

각 Suspense Boundary는 독립적인 Hydration 단위로 처리될 수 있습니다.

```text
App
 |
 +----> Header
 |
 +----> Suspense Boundary
 |          |
 |          +----> Profile
 |
 +----> Suspense Boundary
            |
            +----> Comments
```

예를 들어 `Comments` 영역의 JavaScript나 데이터가 아직 준비되지 않았더라도 다른 영역의 Hydration이 진행될 수 있습니다.

또한 사용자가 아직 Hydration되지 않은 영역과 상호작용하면 React는 해당 영역의 Hydration 우선순위를 높여 처리할 수 있습니다.

Selective Hydration은 큰 애플리케이션에서 페이지 전체가 Hydration될 때까지 모든 상호작용을 기다려야 하는 상황을 줄이는 데 도움이 됩니다.

## 8. Hydration and Performance

Hydration은 SSR의 초기 화면 표시 이점을 클라이언트 상호작용으로 연결하는 중요한 과정입니다.

그러나 HTML이 화면에 표시되는 시점과 React가 상호작용을 처리할 수 있는 시점은 서로 다릅니다.

따라서 SSR 애플리케이션의 성능을 평가할 때는 초기 화면 표시뿐 아니라 Hydration 및 상호작용 준비 상태도 고려해야 합니다.

### 8.1 HTML Display vs Interactivity

서버가 HTML을 전달하면 브라우저는 JavaScript가 로드되기 전에도 콘텐츠를 표시할 수 있습니다.

그러나 Hydration이 진행되기 전까지 React의 이벤트 처리 기능은 연결되지 않았습니다.

```text
HTML Received
      |
      v
Content Visible
      |
      v
JavaScript Loading
      |
      v
React Execution
      |
      v
Hydration
      |
      v
Interactive
```

따라서 화면이 먼저 표시되었다고 해서 애플리케이션의 모든 기능이 즉시 동작하는 것은 아닙니다.

이러한 차이를 고려하여 SSR 애플리케이션에서는 다음과 같은 성능 지표를 함께 살펴볼 수 있습니다.

| 지표 | 설명 |
|---|---|
| TTFB | 브라우저가 서버로부터 첫 번째 바이트를 수신하는 데 걸린 시간 |
| FCP | 브라우저에서 첫 번째 콘텐츠가 렌더링된 시점 |
| LCP | 주요 콘텐츠가 렌더링된 시점 |
| TTI | 페이지가 사용자 입력에 안정적으로 응답할 수 있는 상태에 도달하는 시점 |
| INP | 사용자 상호작용에 대한 응답 지연을 측정하는 Core Web Vital |

특히 Hydration 작업이 길어지면 콘텐츠가 이미 표시되어 있더라도 사용자 입력에 대한 응답이 늦어질 수 있습니다.

### 8.2 Hydration Cost

Hydration은 서버에서 생성한 HTML을 클라이언트 React가 인계받기 위해 수행하는 작업입니다.

컴포넌트가 많고 초기 렌더링에 필요한 JavaScript가 클수록 클라이언트에서 처리해야 하는 작업이 증가할 수 있습니다.

따라서 다음과 같은 방법을 고려할 수 있습니다.

- 불필요한 Client Component와 JavaScript 제거
- 코드 분할(Code Splitting) 적용
- Suspense를 활용한 Streaming SSR
- Selective Hydration을 고려한 UI 구조 설계
- 초기 렌더링에서 불필요한 계산 최소화
- 서버에서 처리할 수 있는 작업과 클라이언트에서 처리할 작업 구분

Hydration 성능은 HTML 크기만으로 결정되지 않으며 JavaScript 다운로드, 실행, 렌더링 및 Hydration 작업을 함께 고려해야 합니다.

## 9. Important Considerations

Hydration을 사용할 때 다음 사항을 이해해야 합니다.

### 9.1 Server and Client Initial Output Must Match

서버에서 생성한 HTML과 클라이언트의 최초 렌더링 결과는 일치해야 합니다.

서버와 클라이언트의 데이터, Locale, Timezone, 렌더링 조건이 다르면 Hydration Mismatch가 발생할 수 있습니다.

### 9.2 Use hydrateRoot Instead of createRoot

서버 렌더링 또는 정적 생성된 HTML이 존재하는 경우에는 `hydrateRoot`를 사용해야 합니다.

`createRoot`는 클라이언트 렌더링을 위한 API이며 기존 서버 HTML을 Hydration하는 용도가 아닙니다.

### 9.3 Hydration Is Different from Rendering

Hydration은 기존 DOM을 React가 인계받는 초기 과정입니다.

Hydration이 완료된 이후에는 일반적인 React Render와 Commit 과정을 통해 State와 Props 변경 사항이 DOM에 반영됩니다.

### 9.4 Server Rendering Does Not Automatically Mean Hydration

서버에서 생성한 HTML을 반드시 React로 Hydration해야 하는 것은 아닙니다.

예를 들어 정적인 콘텐츠만 제공하는 경우에는 HTML을 생성하여 전달하는 것으로 충분할 수 있습니다.

`renderToStaticMarkup`은 정적인 HTML을 생성하는 API이며 일반적인 Hydration 용도로 사용하지 않습니다.

### 9.5 Frameworks Usually Handle Hydration

Next.js와 같은 React 프레임워크를 사용하는 경우 서버 렌더링, HTML 전달, Hydration 및 클라이언트 JavaScript 로딩 과정을 프레임워크가 관리할 수 있습니다.

따라서 프레임워크 기반 애플리케이션에서는 일반적으로 `hydrateRoot`를 직접 호출하지 않습니다.

다만 Hydration Mismatch의 원인과 서버 및 클라이언트의 초기 렌더링 일치 조건은 프레임워크를 사용하는 경우에도 동일하게 중요합니다.

## 10. Summary

Hydration은 서버에서 생성된 HTML에 클라이언트 React를 연결하여 상호작용 가능한 애플리케이션으로 전환하는 과정입니다.

| 개념 | 설명 |
|---|---|
| SSR | 서버에서 React 컴포넌트를 HTML로 렌더링하는 방식 |
| Hydration | 서버 HTML에 클라이언트 React를 연결하는 과정 |
| `hydrateRoot` | 서버에서 생성한 HTML을 Hydration하는 Client Root API |
| Hydration Mismatch | 서버 HTML과 클라이언트 초기 렌더링 결과가 일치하지 않는 현상 |
| Automatic Recovery | Hydration 과정에서 발생한 일부 오류를 React가 복구하는 동작 |
| Streaming SSR | 준비된 HTML을 Stream으로 순차 전송하는 방식 |
| Selective Hydration | Suspense Boundary 등을 기반으로 Hydration 작업을 세분화하는 방식 |

핵심적으로 다음 사항을 이해해야 합니다.

- SSR은 서버에서 React 컴포넌트를 HTML로 변환하여 브라우저에 전달하는 방식입니다.
- Hydration은 기존 HTML에 React의 이벤트 처리와 State 관리 기능을 연결하는 과정입니다.
- 서버 HTML은 JavaScript가 실행되기 전에도 화면에 표시될 수 있습니다.
- 서버와 클라이언트의 초기 렌더링 결과가 일치해야 합니다.
- `hydrateRoot`는 서버에서 생성한 HTML을 React가 인계받을 때 사용합니다.
- `createRoot`는 기존 서버 HTML을 Hydration하는 API가 아닙니다.
- Hydration Mismatch는 서로 다른 초기 데이터, 브라우저 API, 시간 및 Locale 차이, 잘못된 HTML 구조 등으로 발생할 수 있습니다.
- `suppressHydrationWarning`은 근본적인 불일치 해결 방법이 아니라 제한적인 경고 억제 기능입니다.
- Streaming SSR은 준비된 HTML을 순차적으로 전달하여 초기 콘텐츠 표시를 앞당길 수 있습니다.
- Suspense와 Selective Hydration은 UI 영역별 Hydration 처리를 지원합니다.
- SSR로 HTML을 생성했다고 해서 반드시 Hydration이 필요한 것은 아닙니다.

Hydration은 React의 Server Rendering과 Client Rendering을 연결하는 핵심 개념입니다. SSR, `hydrateRoot`, Hydration Mismatch, Streaming SSR을 함께 이해하면 서버에서 생성한 UI가 브라우저에서 상호작용 가능한 React 애플리케이션으로 전환되는 과정을 명확하게 파악할 수 있습니다.

## 11. References

- [React Official Documentation - hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
- [React Official Documentation - renderToString](https://react.dev/reference/react-dom/server/renderToString)
- [React Official Documentation - renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream)
- [React Official Documentation - renderToReadableStream](https://react.dev/reference/react-dom/server/renderToReadableStream)
- [React Official Documentation - createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [React Official Documentation - Suspense](https://react.dev/reference/react/Suspense)
- [React Official Documentation - useId](https://react.dev/reference/react/useId)
- [React Official Documentation - Render and Commit](https://react.dev/learn/render-and-commit)
- [React Official Blog - React v18](https://react.dev/blog/2022/03/29/react-v18)
- [React Official Blog - React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)