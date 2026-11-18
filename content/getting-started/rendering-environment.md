# Rendering Environment

## 1. Rendering Environment란?

Rendering Environment는 React 컴포넌트가 실행되고 UI를 생성하는 환경을 의미합니다.

React 애플리케이션은 크게 두 가지 환경에서 실행될 수 있습니다.

- **Client Environment**: 사용자의 웹 브라우저에서 React 코드가 실행되는 환경입니다.
- **Server Environment**: 서버 또는 빌드 환경에서 React 코드가 실행되는 환경입니다.

React 컴포넌트는 실행 환경에 따라 접근할 수 있는 API와 수행할 수 있는 작업이 달라집니다. 예를 들어 브라우저의 `window`, `document`, `localStorage`와 같은 Web API는 Client Environment에서 사용할 수 있지만 일반적인 서버 환경에서는 사용할 수 없습니다.

렌더링 환경과 함께 이해해야 하는 개념은 렌더링 전략(Rendering Strategy)입니다.

렌더링 전략은 React 컴포넌트를 언제, 어디에서 실행하여 HTML을 생성할 것인지 결정하는 방식입니다.

대표적인 렌더링 전략은 다음과 같습니다.

| 렌더링 전략 | HTML 생성 시점 | 실행 환경 |
| --- | --- | --- |
| CSR (Client-Side Rendering) | 브라우저에서 애플리케이션 실행 시 | Client |
| SSR (Server-Side Rendering) | 사용자 요청 시 | Server |
| SSG (Static Site Generation) | 애플리케이션 빌드 시 | Build / Server |
| ISR (Incremental Static Regeneration) | 빌드 이후 재생성 또는 재검증 시 | Build / Server |

이러한 전략은 서로 배타적인 관계가 아닙니다. 하나의 애플리케이션에서도 페이지의 특성에 따라 서로 다른 렌더링 전략을 조합할 수 있습니다.

---

## 2. Client Environment

Client Environment는 사용자의 웹 브라우저에서 JavaScript가 실행되는 환경입니다.

React 애플리케이션에서 Client는 일반적으로 다음과 같은 역할을 담당합니다.

- 사용자 이벤트 처리
- 컴포넌트 상태 관리
- 사용자 입력 및 상호작용 처리
- 브라우저 API 접근
- DOM 업데이트
- 클라이언트 측 페이지 전환

### 2.1 Client Rendering

Client Rendering은 브라우저에서 React 컴포넌트를 실행하고 DOM을 생성하는 방식입니다.

일반적인 Vite 기반 React 프로젝트는 별도의 서버 렌더링 설정이 없다면 Client Rendering을 사용하는 SPA(Single Page Application)로 동작합니다.

초기 HTML에는 React 애플리케이션을 마운트할 DOM 요소만 존재하며, JavaScript 파일이 로드되고 실행된 이후 React가 실제 UI를 생성합니다.

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>React Application</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

React 애플리케이션은 `createRoot`를 사용하여 브라우저의 DOM 요소에 마운트합니다.

```tsx
// main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`createRoot`는 React가 관리할 Root를 생성합니다. 이후 `render`를 호출하면 React가 컴포넌트 트리를 브라우저 DOM에 반영합니다.

### 2.2 Client Environment에서 사용할 수 있는 기능

Client Environment에서는 브라우저가 제공하는 Web API에 접근할 수 있습니다.

```tsx
import { useEffect, useState } from 'react';

function WindowWidth() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <p>Window Width: {width}px</p>;
}
```

위 컴포넌트는 브라우저의 `window.innerWidth`를 사용하여 화면 너비를 확인합니다.

다음과 같은 기능도 Client Environment에서 사용할 수 있습니다.

- `window`, `document`
- `localStorage`, `sessionStorage`
- `navigator`
- `window.matchMedia`
- DOM 이벤트 및 브라우저 이벤트
- 사용자 입력과 상호작용

다만 브라우저 API를 사용하는 코드가 반드시 컴포넌트 내부에서만 실행되어야 하는 것은 아닙니다. 중요한 것은 해당 코드가 실제 브라우저 환경에서 실행되는 시점에 접근해야 한다는 점입니다.

서버 렌더링을 지원하는 애플리케이션에서는 컴포넌트의 초기 렌더링 과정이 서버에서도 실행될 수 있으므로 브라우저 API에 대한 직접적인 접근에 주의해야 합니다.

---

## 3. Server Environment

Server Environment는 브라우저가 아닌 서버에서 React 컴포넌트 또는 관련 애플리케이션 코드가 실행되는 환경입니다.

서버는 일반적으로 다음과 같은 역할을 담당합니다.

- HTTP 요청 처리
- 데이터베이스 및 외부 API 접근
- 인증 및 권한 검증
- 서버 전용 리소스 접근
- HTML 생성
- 클라이언트에 필요한 데이터 전달

React에서는 `react-dom/server`가 제공하는 API를 사용하여 React 컴포넌트 트리를 HTML로 변환할 수 있습니다.

### 3.1 Server Rendering

Server Rendering은 서버에서 React 컴포넌트를 실행하여 HTML을 생성하는 방식입니다.

```tsx
import { renderToString } from 'react-dom/server';
import App from './App';

const html = renderToString(<App />);
```

`renderToString`은 React 컴포넌트 트리를 HTML 문자열로 변환합니다.

이 HTML을 HTTP 응답에 포함하면 브라우저는 JavaScript 애플리케이션이 실행되기 전에도 초기 UI를 표시할 수 있습니다.

다만 `renderToString`은 서버 렌더링을 위한 API 중 하나일 뿐이며, 실제 프로덕션 애플리케이션에서는 스트리밍을 지원하는 API나 프레임워크가 제공하는 렌더링 기능을 사용할 수 있습니다.

### 3.2 Server Environment의 특징

Server Environment는 브라우저와 다른 실행 환경이므로 사용할 수 있는 API도 다릅니다.

| 구분 | Client Environment | Server Environment |
| --- | --- | --- |
| 실행 위치 | 웹 브라우저 | 서버 런타임 |
| DOM 접근 | 가능 | 일반적으로 불가능 |
| `window` 접근 | 가능 | 불가능 |
| `localStorage` 접근 | 가능 | 불가능 |
| 데이터베이스 접근 | 일반적으로 직접 접근하지 않음 | 가능 |
| 비밀 키 및 서버 자격 증명 | 노출 위험 | 서버 내부에서 관리 가능 |
| 사용자 이벤트 처리 | 가능 | 직접 처리하지 않음 |
| HTML 생성 | 가능 | 가능 |

서버에서 실행되는 코드에 API Key, Database Credential과 같은 민감한 정보가 포함되더라도 해당 코드가 클라이언트 번들로 전달되지 않는 구조라면 브라우저에 직접 노출되지 않습니다.

반대로 서버에서 가져온 데이터가 HTML, JavaScript 번들 또는 클라이언트에 전달되는 Props에 포함되면 사용자에게 노출될 수 있습니다. 서버에서 실행된다는 사실만으로 데이터가 자동으로 보호되는 것은 아닙니다.

---

## 4. Client-Side Rendering (CSR)

CSR은 Client-Side Rendering의 약자로, 브라우저에서 JavaScript를 실행하여 React UI를 생성하는 렌더링 전략입니다.

일반적인 React SPA가 사용하는 대표적인 방식입니다.

### 4.1 Rendering Process

CSR의 기본적인 동작 과정은 다음과 같습니다.

1. 브라우저가 서버에 페이지를 요청합니다.
2. 서버는 애플리케이션의 기본 HTML과 JavaScript 파일을 응답합니다.
3. 브라우저가 JavaScript 파일을 다운로드합니다.
4. JavaScript가 실행되면서 React 애플리케이션이 초기화됩니다.
5. React가 컴포넌트를 렌더링하고 DOM을 생성합니다.
6. 사용자의 이벤트에 따라 React가 UI를 업데이트합니다.

```text
Browser
   |
   | HTTP Request
   v
Web Server
   |
   | HTML + JavaScript
   v
Browser
   |
   | Download JavaScript
   v
React Application
   |
   | Render Components
   v
DOM
```

### 4.2 Advantages

- 서버에서 별도의 HTML 렌더링 과정을 구현하지 않아도 됩니다.
- 프론트엔드와 백엔드의 역할을 명확하게 분리할 수 있습니다.
- 사용자 상호작용이 많은 애플리케이션을 구현하기에 적합합니다.
- 초기 로딩 이후 클라이언트 측 페이지 전환을 효율적으로 처리할 수 있습니다.
- CDN을 통해 정적 리소스를 배포할 수 있습니다.

### 4.3 Disadvantages

- JavaScript 다운로드 및 실행이 완료되기 전까지 초기 화면이 비어 있거나 제한적으로 표시될 수 있습니다.
- 초기 렌더링에 필요한 JavaScript 번들이 커지면 초기 로딩 시간이 증가할 수 있습니다.
- 검색 엔진 크롤러가 JavaScript를 실행하지 못하거나 충분히 처리하지 못하면 콘텐츠 색인에 불리할 수 있습니다.
- 사용자의 네트워크 및 디바이스 성능에 따라 초기 렌더링 경험이 달라질 수 있습니다.

### 4.4 Suitable Use Cases

- 인증된 사용자만 접근하는 관리자 페이지
- 내부 업무 시스템
- 대시보드
- 사용자 상호작용이 많은 웹 애플리케이션
- 검색 엔진 최적화보다 애플리케이션의 상호작용이 중요한 서비스

---

## 5. Server-Side Rendering (SSR)

SSR은 Server-Side Rendering의 약자로, 사용자가 페이지를 요청할 때 서버에서 React 컴포넌트를 실행하여 HTML을 생성하는 렌더링 전략입니다.

서버에서 생성한 HTML을 브라우저에 전달하므로 JavaScript가 실행되기 전에도 초기 콘텐츠를 표시할 수 있습니다.

### 5.1 Rendering Process

SSR의 기본적인 동작 과정은 다음과 같습니다.

1. 브라우저가 서버에 페이지를 요청합니다.
2. 서버가 요청에 필요한 데이터를 조회합니다.
3. 서버에서 React 컴포넌트를 실행하여 HTML을 생성합니다.
4. 서버가 생성한 HTML을 브라우저에 전달합니다.
5. 브라우저가 HTML을 파싱하고 초기 UI를 표시합니다.
6. 브라우저가 JavaScript 파일을 다운로드하고 실행합니다.
7. React가 기존 HTML에 이벤트 처리 및 상호작용 기능을 연결합니다.

```text
Browser
   |
   | HTTP Request
   v
Application Server
   |
   | Fetch Data
   v
Database / External API
   |
   | Data
   v
Application Server
   |
   | Render React Components
   v
HTML
   |
   | HTTP Response
   v
Browser
   |
   | Parse HTML
   v
Initial UI
   |
   | Download JavaScript
   v
Hydration
   |
   v
Interactive UI
```

### 5.2 Advantages

- JavaScript 실행 이전에도 초기 HTML 콘텐츠를 표시할 수 있습니다.
- 검색 엔진 크롤러가 페이지 콘텐츠를 확인하기 쉽습니다.
- 요청 시점의 데이터를 HTML에 반영할 수 있습니다.
- 서버에서 데이터 접근 및 인증 처리를 수행할 수 있습니다.

### 5.3 Disadvantages

- 페이지 요청마다 서버에서 렌더링 작업을 수행하므로 서버 리소스가 필요합니다.
- 서버의 데이터 조회 및 렌더링 시간이 초기 응답 시간에 영향을 줄 수 있습니다.
- 서버와 클라이언트의 초기 렌더링 결과를 일치시켜야 합니다.
- 서버와 클라이언트 환경을 모두 고려해야 하므로 애플리케이션 구조가 복잡해질 수 있습니다.

### 5.4 Suitable Use Cases

- 요청 시점에 최신 데이터가 필요한 페이지
- 사용자별 개인화된 콘텐츠
- 검색 엔진 최적화가 중요한 서비스
- 상품 정보 및 상세 페이지
- 요청 정보에 따라 서버에서 다른 HTML을 생성해야 하는 페이지

---

## 6. Static Site Generation (SSG)

SSG는 Static Site Generation의 약자로, 애플리케이션을 빌드하는 시점에 React 컴포넌트를 HTML로 변환하여 정적 파일을 생성하는 렌더링 전략입니다.

생성된 HTML 파일은 웹 서버 또는 CDN에 배포되며, 사용자가 페이지를 요청하면 미리 생성된 HTML을 전달합니다.

### 6.1 Rendering Process

SSG의 기본적인 동작 과정은 다음과 같습니다.

1. 애플리케이션 빌드를 시작합니다.
2. 빌드 과정에서 필요한 데이터를 조회합니다.
3. React 컴포넌트를 실행하여 HTML을 생성합니다.
4. 생성된 HTML 파일을 정적 리소스와 함께 배포합니다.
5. 사용자가 페이지를 요청하면 CDN 또는 웹 서버가 HTML을 응답합니다.
6. 필요한 JavaScript가 로드되면 React가 상호작용 기능을 활성화합니다.

```text
Build Time
    |
    | Fetch Data
    v
Database / External API
    |
    | Data
    v
React Components
    |
    | Generate HTML
    v
Static HTML Files
    |
    | Deploy
    v
CDN / Static Hosting
    |
    | HTTP Response
    v
Browser
    |
    | Hydration (if interactive)
    v
Interactive UI
```

### 6.2 Advantages

- 사용자 요청 시 서버에서 HTML을 생성할 필요가 없습니다.
- 생성된 HTML을 CDN에 캐싱하여 빠르게 전달할 수 있습니다.
- 서버의 렌더링 부하를 줄일 수 있습니다.
- HTML에 콘텐츠가 포함되어 있어 검색 엔진 색인에 유리합니다.
- 정적 호스팅 환경에서도 배포할 수 있습니다.

### 6.3 Disadvantages

- 데이터가 변경되면 정적 페이지를 다시 생성해야 할 수 있습니다.
- 빌드 시점에 생성할 페이지가 많으면 빌드 시간이 증가합니다.
- 사용자별 요청 데이터나 실시간 데이터에 직접 대응하기 어렵습니다.
- 빌드 이후 콘텐츠를 최신 상태로 유지하기 위한 별도의 재생성 전략이 필요할 수 있습니다.

### 6.4 Suitable Use Cases

- 블로그
- 기술 문서
- 제품 소개 페이지
- 포트폴리오
- 변경 빈도가 낮은 콘텐츠 페이지
- GitHub Pages와 같은 정적 호스팅 환경에 배포하는 웹사이트

### 6.5 SSG와 Static Hosting

SSG는 정적 HTML 파일을 생성하는 렌더링 전략이며, Static Hosting은 생성된 파일을 제공하는 배포 방식입니다.

두 개념은 밀접하게 관련되어 있지만 동일한 개념은 아닙니다.

예를 들어 React 애플리케이션을 CSR 방식으로 빌드한 경우에도 JavaScript, CSS, HTML 파일을 정적 호스팅 환경에 배포할 수 있습니다.

반대로 SSG는 빌드 시점에 페이지별 HTML을 생성한다는 점에서 CSR과 차이가 있습니다.

---

## 7. Incremental Static Regeneration (ISR)

ISR은 Incremental Static Regeneration의 약자로, 정적으로 생성된 페이지를 배포 이후에도 다시 생성하거나 갱신할 수 있도록 하는 전략입니다.

SSG는 일반적으로 빌드 시점에 HTML을 생성합니다. 따라서 콘텐츠가 변경되면 새로운 빌드와 배포가 필요할 수 있습니다.

ISR은 프레임워크가 제공하는 재검증(Revalidation) 기능을 활용하여 전체 애플리케이션을 다시 빌드하지 않고도 특정 페이지의 정적 결과를 갱신할 수 있도록 합니다.

### 7.1 Rendering Process

일반적인 ISR의 동작 방식은 다음과 같습니다.

1. 빌드 시점에 정적 HTML을 생성합니다.
2. 생성된 HTML을 캐시에 저장합니다.
3. 사용자가 페이지를 요청하면 캐시된 HTML을 전달합니다.
4. 재검증 조건이 충족되면 해당 페이지를 다시 생성합니다.
5. 새로운 HTML을 캐시에 반영합니다.
6. 이후 요청에는 갱신된 HTML을 전달합니다.

구체적인 재검증 시점과 캐시 갱신 방식은 프레임워크 및 설정에 따라 달라집니다.

### 7.2 Advantages

- SSG의 정적 콘텐츠 제공 성능을 유지하면서 콘텐츠를 갱신할 수 있습니다.
- 모든 페이지를 다시 빌드하지 않고 필요한 페이지를 갱신할 수 있습니다.
- 자주 변경되는 콘텐츠를 효율적으로 관리할 수 있습니다.
- 페이지 단위의 캐싱과 재검증을 조합할 수 있습니다.

### 7.3 Disadvantages

- 캐시 및 재검증 정책을 별도로 고려해야 합니다.
- 재검증이 완료되기 전까지 이전 콘텐츠가 제공될 수 있습니다.
- 프레임워크 및 배포 플랫폼의 지원이 필요할 수 있습니다.
- 실시간 데이터가 반드시 필요한 페이지에는 적합하지 않을 수 있습니다.

### 7.4 Suitable Use Cases

- 콘텐츠가 주기적으로 변경되는 블로그
- 상품 목록 및 상품 상세 페이지
- 뉴스 및 콘텐츠 서비스
- 많은 페이지를 정적으로 생성해야 하는 서비스

---

## 8. Hydration

Hydration은 서버에서 생성한 HTML을 브라우저에서 React가 이어받아 상호작용이 가능한 상태로 만드는 과정입니다.

SSR 또는 SSG를 사용하면 브라우저는 React JavaScript가 실행되기 전에도 서버나 빌드 환경에서 생성된 HTML을 표시할 수 있습니다.

하지만 HTML만으로는 React의 상태 관리 및 이벤트 처리 기능이 활성화되지 않습니다.

Hydration은 브라우저에서 React가 기존 HTML을 기반으로 컴포넌트 트리를 연결하고 이벤트 처리 기능 등을 활성화하는 과정입니다.

### 8.1 Hydration Process

```text
Server / Build Environment
          |
          | Render React Components
          v
      Static HTML
          |
          | HTTP Response
          v
        Browser
          |
          | Display HTML
          v
     Initial UI
          |
          | Download JavaScript
          v
      React Runtime
          |
          | hydrateRoot()
          v
       Hydration
          |
          v
    Interactive UI
```

### 8.2 createRoot와 hydrateRoot

React DOM은 애플리케이션의 렌더링 방식에 따라 서로 다른 Root API를 제공합니다.

**createRoot**

`createRoot`는 React가 관리할 DOM Root를 생성하는 API입니다.

일반적인 CSR 애플리케이션에서 사용합니다.

```tsx
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
```

**hydrateRoot**

`hydrateRoot`는 서버 또는 빌드 환경에서 미리 생성된 HTML을 React가 이어받도록 하는 API입니다.

SSR 또는 SSG를 통해 HTML이 이미 생성된 애플리케이션에서 사용합니다.

```tsx
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

hydrateRoot(rootElement, <App />);
```

두 API의 차이는 다음과 같습니다.

| 구분 | createRoot | hydrateRoot |
| --- | --- | --- |
| 주요 목적 | 새로운 React Root 생성 | 기존 HTML에 React 연결 |
| 초기 DOM | React가 생성 | 서버 또는 빌드 환경에서 생성 |
| 주요 사용 환경 | CSR | SSR / SSG |
| 기존 HTML 활용 | 일반적으로 초기 콘텐츠를 React가 생성 | 기존 HTML을 재사용 |

서버에서 HTML을 생성한 애플리케이션에 `createRoot`를 사용하면 기존 HTML을 재사용하는 Hydration 동작이 수행되지 않습니다. SSR 또는 SSG로 생성된 HTML을 사용하는 애플리케이션에서는 `hydrateRoot`를 사용해야 합니다.

### 8.3 Hydration Mismatch

Hydration Mismatch는 서버에서 생성한 HTML과 브라우저에서 React가 최초로 렌더링한 결과가 일치하지 않을 때 발생하는 문제입니다.

React는 서버에서 생성된 HTML을 기반으로 클라이언트 컴포넌트를 연결하기 때문에 두 환경의 초기 렌더링 결과가 일치해야 합니다.

다음은 Hydration Mismatch를 발생시킬 수 있는 대표적인 사례입니다.

**브라우저 API를 렌더링 과정에서 직접 사용하는 경우**

```tsx
function CurrentWidth() {
  return <p>{window.innerWidth}</p>;
}
```

서버에서는 `window`가 존재하지 않으므로 해당 코드는 오류를 발생시킬 수 있습니다.

**서버와 클라이언트에서 서로 다른 값을 생성하는 경우**

```tsx
function CurrentTime() {
  return <p>{new Date().toLocaleString()}</p>;
}
```

서버와 브라우저에서 렌더링되는 시점 및 시간대가 다르면 서로 다른 결과가 생성될 수 있습니다.

**랜덤 값을 렌더링하는 경우**

```tsx
function RandomNumber() {
  return <p>{Math.random()}</p>;
}
```

서버와 클라이언트에서 각각 다른 값이 생성되므로 초기 렌더링 결과가 일치하지 않습니다.

### 8.4 Hydration Mismatch 해결 방법

브라우저에서만 필요한 작업은 `useEffect`와 같은 Effect 내부에서 실행할 수 있습니다.

```tsx
import { useEffect, useState } from 'react';

function CurrentWidth() {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <p>{width ?? 'Loading...'}</p>;
}
```

이 방식에서는 서버 렌더링과 브라우저의 최초 렌더링이 모두 `Loading...`을 출력합니다.

이후 Hydration이 완료되고 Effect가 실행되면 브라우저 너비를 반영합니다.

Hydration Mismatch를 방지하기 위해서는 다음 사항을 고려해야 합니다.

- 서버와 클라이언트에서 동일한 초기 렌더링 결과를 생성해야 합니다.
- 브라우저 API는 브라우저에서 실행되는 시점에 접근해야 합니다.
- 날짜, 시간, 랜덤 값 등 환경에 따라 달라지는 값은 초기 렌더링에 직접 사용하지 않도록 주의해야 합니다.
- 서버에서 가져온 데이터와 클라이언트의 초기 데이터가 일치하도록 관리해야 합니다.
- HTML 구조가 올바르게 작성되었는지 확인해야 합니다.

---

## 9. React Server Components (RSC)

React Server Components(RSC)는 컴포넌트를 서버에서 실행하고 렌더링 결과를 클라이언트에 전달할 수 있도록 하는 React 아키텍처입니다.

SSR과 RSC는 서버에서 React 컴포넌트를 실행한다는 공통점이 있지만 서로 다른 개념입니다.

SSR은 서버에서 HTML을 생성하는 렌더링 전략이며, RSC는 컴포넌트가 실행될 환경과 서버 및 클라이언트 간의 컴포넌트 구성을 다루는 아키텍처입니다.

### 9.1 Server Components

Server Components는 서버 환경에서 실행되는 컴포넌트입니다.

대표적인 특징은 다음과 같습니다.

- 서버에서 데이터베이스 또는 서버 전용 리소스에 접근할 수 있습니다.
- 서버 전용 의존성을 클라이언트 번들에 포함하지 않을 수 있습니다.
- 컴포넌트의 서버 실행 결과를 클라이언트로 전달할 수 있습니다.
- 일반적으로 브라우저의 이벤트 처리나 상태 관리 기능을 직접 사용할 수 없습니다.

```tsx
// UserProfile.tsx

import { getUser } from '@/server/users';

export default async function UserProfile() {
  const user = await getUser();

  return (
    <section>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </section>
  );
}
```

위 예시는 서버 환경에서 데이터를 조회하고 UI를 생성하는 Server Component의 개념적인 형태입니다.

실제 Server Components의 실행 방식과 데이터 접근 방법은 사용하는 프레임워크의 지원 및 구성에 따라 달라집니다.

### 9.2 Client Components

Client Components는 브라우저에서 상호작용 기능을 수행하는 컴포넌트입니다.

다음과 같은 기능이 필요할 때 사용합니다.

- `useState`, `useReducer` 등의 상태 관리
- `useEffect` 등의 Effect
- `onClick`, `onChange` 등의 이벤트 처리
- `window`, `document`, `localStorage` 등의 브라우저 API

Next.js App Router와 같은 RSC 지원 프레임워크에서는 파일 최상단에 `'use client'` 지시문을 선언하여 Client Component의 경계를 지정합니다.

```tsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((prev) => prev + 1)}>
      Count: {count}
    </button>
  );
}
```

`'use client'`는 컴포넌트가 브라우저에서만 렌더링된다는 의미가 아닙니다.

RSC를 지원하는 프레임워크에서는 Client Component도 최초 페이지 요청 시 서버에서 HTML을 생성하는 과정에 참여할 수 있습니다. 이후 브라우저에서 JavaScript가 실행되고 Hydration을 거쳐 상호작용 기능이 활성화됩니다.

또한 `'use client'`가 선언된 모듈에서 가져오는 의존성은 클라이언트 모듈 그래프에 포함될 수 있으므로 Client Component의 경계를 필요한 범위로 제한하는 것이 중요합니다.

### 9.3 Server Components와 Client Components 비교

| 구분 | Server Components | Client Components |
| --- | --- | --- |
| 주요 실행 환경 | Server | Client |
| 서버 전용 데이터 접근 | 가능 | 직접 접근 불가 |
| `useState` | 사용 불가 | 사용 가능 |
| `useEffect` | 사용 불가 | 사용 가능 |
| 이벤트 핸들러 | 사용 불가 | 사용 가능 |
| 브라우저 API | 사용 불가 | 사용 가능 |
| 클라이언트 JavaScript 번들 | 컴포넌트 코드가 포함되지 않음 | 컴포넌트 코드가 포함됨 |
| 주요 목적 | 데이터 조회 및 서버 중심 UI 구성 | 사용자 상호작용 구현 |

Server Components와 Client Components는 서로 대체하는 관계가 아닙니다. 서버에서 데이터 조회 및 콘텐츠 구성을 담당하고, 클라이언트에서 필요한 상호작용을 담당하도록 조합할 수 있습니다.

### 9.4 Server Components와 SSR의 관계

Server Components와 SSR을 동일한 개념으로 이해해서는 안 됩니다.

| 구분 | SSR | RSC |
| --- | --- | --- |
| 개념 | 서버에서 HTML을 생성하는 렌더링 전략 | 서버와 클라이언트의 컴포넌트 실행 및 구성 아키텍처 |
| 주요 목적 | 초기 HTML 생성 | 서버 중심 컴포넌트 구성 및 클라이언트 JavaScript 최적화 |
| 결과물 | HTML | React Server Component Payload 등 |
| 클라이언트 상호작용 | Hydration 등을 통해 활성화 | Client Components의 Hydration 등을 통해 활성화 |

RSC를 지원하는 프레임워크는 Server Components와 Client Components를 조합하고, 초기 페이지 요청에서 HTML을 생성하는 SSR 또는 정적 렌더링을 함께 사용할 수 있습니다.

RSC는 React 자체의 기능이지만 실제 애플리케이션에서 이를 구성하고 사용하는 과정은 프레임워크와 빌드 도구의 지원이 필요합니다.

---

## 10. Rendering Strategy 비교

각 렌더링 전략은 HTML 생성 시점과 데이터의 최신성, 서버 리소스 사용 방식에 차이가 있습니다.

| 구분 | CSR | SSR | SSG | ISR |
| --- | --- | --- | --- | --- |
| HTML 생성 시점 | 브라우저 실행 시 | 요청 시점 | 빌드 시점 | 빌드 및 재검증 시점 |
| 주요 실행 위치 | Client | Server | Build / Server | Build / Server |
| 초기 HTML | 일반적으로 비어 있거나 최소한의 구조 | 콘텐츠 포함 | 콘텐츠 포함 | 콘텐츠 포함 |
| 요청별 렌더링 | 브라우저에서 수행 | 서버에서 수행 | 수행하지 않음 | 일반적으로 수행하지 않음 |
| 데이터 최신성 | 클라이언트 요청 시점에 조회 가능 | 요청 시점 데이터 반영 가능 | 빌드 시점 데이터 기준 | 재검증 정책에 따라 갱신 |
| CDN 캐싱 | 정적 리소스 중심 | 설정에 따라 가능 | 적합 | 적합 |
| 서버 렌더링 부하 | 없음 | 요청별 발생 | 빌드 시점에 발생 | 재생성 시 발생 |
| 주요 사용 사례 | 대시보드, SPA | 개인화 및 동적 페이지 | 블로그, 문서 | 주기적으로 갱신되는 콘텐츠 |

### 10.1 렌더링 전략 선택 기준

렌더링 전략을 선택할 때는 다음과 같은 기준을 고려해야 합니다.

**초기 콘텐츠 표시가 중요한 경우**

SSR 또는 SSG를 고려할 수 있습니다. 브라우저에서 JavaScript가 실행되기 전에도 HTML에 포함된 콘텐츠를 표시할 수 있습니다.

**콘텐츠가 자주 변경되지 않는 경우**

SSG가 적합합니다. 빌드 시점에 HTML을 생성하고 CDN을 통해 제공할 수 있습니다.

**요청 시점의 최신 데이터가 중요한 경우**

SSR 또는 CSR을 고려할 수 있습니다. 데이터가 사용자별로 달라지거나 요청마다 최신 상태를 반영해야 하는 경우 적합합니다.

**콘텐츠 변경이 주기적으로 발생하는 경우**

ISR을 고려할 수 있습니다. 정적으로 생성된 페이지를 일정한 정책에 따라 재검증할 수 있습니다.

**사용자 상호작용이 중요한 경우**

CSR 또는 Client Components를 활용할 수 있습니다. 단, 사용자 상호작용이 필요하다는 이유만으로 애플리케이션 전체를 CSR로 구성할 필요는 없습니다.

실제 애플리케이션에서는 페이지별 특성에 따라 여러 전략을 조합하는 것이 일반적입니다.

---

## 11. Rendering Environment에 따른 주의사항

### 11.1 Browser API 접근

서버 환경에서는 브라우저 API에 직접 접근할 수 없습니다.

다음과 같은 코드는 SSR 환경에서 문제가 발생할 수 있습니다.

```tsx
const theme = localStorage.getItem('theme');
```

브라우저 API를 사용하는 코드는 브라우저에서 실행되는 시점에 접근하도록 구성해야 합니다.

```tsx
import { useEffect, useState } from 'react';

function Theme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return <p>Current Theme: {theme}</p>;
}
```

### 11.2 Environment Variables

환경 변수는 실행 환경에 따라 접근 방식과 보안 수준이 다릅니다.

서버 환경에서는 데이터베이스 연결 정보나 API Secret과 같은 민감한 정보를 관리할 수 있습니다.

반면 클라이언트 번들에 포함되는 환경 변수는 사용자가 확인할 수 있으므로 비밀 정보를 저장해서는 안 됩니다.

예를 들어 Vite에서는 `VITE_` 접두사가 붙은 환경 변수를 클라이언트 코드에서 접근할 수 있습니다.

```env
VITE_API_BASE_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

```tsx
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

`VITE_API_BASE_URL`은 클라이언트 코드에 노출될 수 있지만 `DATABASE_URL`과 같은 서버 전용 정보는 클라이언트에 전달하지 않아야 합니다.

### 11.3 Initial Data Consistency

SSR 또는 SSG를 사용하는 경우 서버에서 생성한 초기 HTML과 클라이언트의 최초 렌더링 결과가 일치해야 합니다.

초기 데이터가 서로 다르면 Hydration Mismatch가 발생할 수 있습니다.

서버에서 조회한 데이터를 클라이언트 초기 렌더링에도 동일하게 전달하는 방식으로 데이터 일관성을 유지해야 합니다.

### 11.4 Rendering과 Data Fetching의 구분

Rendering과 Data Fetching은 서로 밀접하게 관련되어 있지만 동일한 개념은 아닙니다.

- Rendering은 컴포넌트와 데이터를 기반으로 UI를 생성하는 과정입니다.
- Data Fetching은 UI 생성에 필요한 데이터를 가져오는 과정입니다.

예를 들어 CSR에서도 브라우저에서 API를 호출하여 데이터를 가져올 수 있으며, SSR에서도 서버에서 데이터베이스나 외부 API를 호출할 수 있습니다.

따라서 데이터 조회 위치와 HTML 생성 위치를 구분하여 설계해야 합니다.

---

## 12. Summary

- Rendering Environment는 React 코드가 실행되는 환경을 의미하며 Client와 Server로 구분됩니다.
- Client Environment는 브라우저 API, 사용자 이벤트, 상태 관리 및 DOM 업데이트를 담당합니다.
- Server Environment는 서버 전용 데이터 접근, 인증 처리 및 HTML 생성을 담당할 수 있습니다.
- CSR은 브라우저에서 React 컴포넌트를 실행하여 UI를 생성하는 방식입니다.
- SSR은 사용자 요청 시 서버에서 HTML을 생성하는 방식입니다.
- SSG는 빌드 시점에 HTML을 생성하는 방식입니다.
- ISR은 정적으로 생성된 페이지를 배포 이후에도 재검증하고 갱신하는 방식입니다.
- Hydration은 서버에서 생성한 HTML에 React의 상호작용 기능을 연결하는 과정입니다.
- `createRoot`는 일반적인 CSR에 사용하고, `hydrateRoot`는 서버 또는 빌드 환경에서 생성한 HTML을 재사용할 때 사용합니다.
- RSC는 Server Components와 Client Components를 조합하여 서버와 클라이언트의 역할을 분리하는 React 아키텍처입니다.
- SSR, SSG, CSR 및 RSC는 서로 다른 관점의 개념이므로 동일한 기준으로 비교해서는 안 됩니다.
- 애플리케이션의 페이지 특성, 데이터 최신성, 초기 로딩 성능, SEO 및 인프라 환경을 고려하여 적절한 렌더링 전략을 선택해야 합니다.

---

## References

### React Official Documentation

- [React - Build a React App from Scratch](https://react.dev/learn/build-a-react-app-from-scratch)
- [React - Creating a React App](https://react.dev/learn/creating-a-react-app)
- [React - createRoot](https://react.dev/reference/react-dom/client/createRoot)
- [React - hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)
- [React - React DOM Server APIs](https://react.dev/reference/react-dom/server)

### Next.js Documentation

- [Next.js - Client-side Rendering](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering)
- [Next.js - Server-side Rendering](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering)
- [Next.js - Static Site Generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)
- [Next.js - Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js - Static and Dynamic Rendering](https://nextjs.org/learn/dashboard-app/static-and-dynamic-rendering)

### Web Fundamentals

- [web.dev - Rendering on the Web](https://web.dev/articles/rendering-on-the-web)