

# Server Components

## 1. Server Components란?

**Server Components**는 서버 환경에서 실행되고 렌더링되는 React 컴포넌트입니다. 컴포넌트의 렌더링 결과를 클라이언트에 전달하므로, 해당 컴포넌트의 구현 코드와 서버 전용 의존성을 클라이언트 JavaScript 번들에 포함하지 않을 수 있습니다.

Server Components는 서버에서 데이터베이스, 파일 시스템, 내부 API 등의 리소스에 직접 접근할 수 있습니다. 이를 통해 데이터 조회 로직을 서버에 배치하고, 클라이언트에 필요한 렌더링 결과만 전달하는 구조를 구성할 수 있습니다.

기존 React 애플리케이션에서는 대부분의 컴포넌트가 브라우저에서 실행되는 것을 전제로 설계되었습니다. 데이터 조회를 위해 별도의 API 요청을 수행하고, 응답을 State에 저장한 다음 화면을 갱신하는 방식이 일반적이었습니다.

Server Components를 사용하면 서버에서 데이터 조회와 컴포넌트 렌더링을 함께 수행할 수 있습니다.

```tsx
// app/users/page.tsx

import { db } from "@/lib/database";

export default async function UsersPage() {
  const users = await db.user.findMany();

  return (
    <main>
      <h1>Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </main>
  );
}
```

위 예제는 서버에서 데이터베이스를 조회하고 결과를 React 요소로 구성하는 Server Component입니다.

브라우저에서 데이터베이스에 직접 접근하지 않으므로 데이터베이스 연결 정보나 서버 전용 라이브러리가 클라이언트 번들에 포함되지 않습니다.

Server Components는 React Server Components를 지원하는 프레임워크 또는 번들러 환경에서 사용해야 합니다. 일반적인 React 프로젝트에서 컴포넌트를 `async` 함수로 작성하는 것만으로 Server Components가 활성화되지는 않습니다.

## 2. Server Components와 Client Components

React Server Components 환경에서는 컴포넌트를 크게 Server Components와 Client Components로 구분합니다.

두 컴포넌트는 실행 환경과 사용할 수 있는 기능이 다릅니다.

### 2.1. Server Components

Server Components는 서버에서 실행되며 다음과 같은 작업에 적합합니다.

- 데이터베이스 및 서버 리소스 접근
- 서버 측 API 호출
- 파일 시스템 접근
- 서버 전용 라이브러리 사용
- 초기 화면을 구성하기 위한 데이터 조회
- 클라이언트 JavaScript 번들 크기 감소

Server Components에서는 다음과 같은 클라이언트 전용 기능을 사용할 수 없습니다.

- `useState`
- `useEffect`
- `useReducer`
- `useContext`
- 이벤트 핸들러
- `window`, `document` 등의 브라우저 API

Server Components는 사용자와의 상호작용을 직접 처리하는 용도가 아닙니다. 사용자 입력이나 브라우저 상태에 반응해야 하는 기능은 Client Components로 분리해야 합니다.

### 2.2. Client Components

Client Components는 클라이언트에서 실행되는 컴포넌트입니다.

다음과 같은 기능이 필요한 경우 Client Components를 사용합니다.

- State 관리
- Effect 실행
- 이벤트 핸들러 등록
- Context 사용
- 브라우저 API 접근
- 사용자 입력 및 상호작용 처리

Client Component는 파일 최상단에 `'use client'` 지시어를 선언하여 표시합니다.

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((count) => count + 1)}>
      Count: {count}
    </button>
  );
}
```

`'use client'`가 선언된 파일은 Client Component의 진입점이 됩니다.

Client Component는 서버에서 실행되지 않는다는 의미로만 이해해서는 안 됩니다. SSR을 지원하는 프레임워크에서는 초기 HTML 생성을 위해 Client Component도 서버에서 렌더링될 수 있습니다.

다만 State, Effect, 이벤트 핸들러 등의 클라이언트 기능은 브라우저에서 Hydration이 완료된 이후 사용할 수 있습니다.

### 2.3. Server Components와 Client Components 비교

| 구분 | Server Components | Client Components |
|---|---|---|
| 주요 실행 환경 | 서버 | 클라이언트 |
| State Hook | 사용 불가 | 사용 가능 |
| Effect Hook | 사용 불가 | 사용 가능 |
| 이벤트 핸들러 | 사용 불가 | 사용 가능 |
| Context 소비 | 사용 불가 | 사용 가능 |
| 브라우저 API | 사용 불가 | 사용 가능 |
| 데이터베이스 직접 접근 | 가능 | 불가 |
| 서버 전용 라이브러리 | 사용 가능 | 사용 불가 |
| 클라이언트 번들 포함 | 컴포넌트 구현 코드 제외 | 포함 |

Server Components와 Client Components는 서로 대체하는 관계가 아닙니다. 서버에서 처리할 작업과 브라우저에서 처리할 작업을 구분하여 함께 구성하는 것이 일반적입니다.

## 3. Server Components와 SSR의 차이

Server Components와 Server-Side Rendering(SSR)은 모두 서버에서 React 컴포넌트를 처리한다는 공통점이 있지만, 목적과 동작 방식이 다릅니다.

**SSR**은 서버에서 React 컴포넌트를 HTML로 렌더링하여 클라이언트에 전달하는 방식입니다.

반면 **Server Components**는 서버에서 컴포넌트를 실행하고 그 결과를 React Server Component Payload(RSC Payload)라는 별도의 형식으로 전달하는 아키텍처입니다.

| 구분 | SSR | Server Components |
|---|---|---|
| 주요 목적 | 초기 HTML 생성 | 서버 컴포넌트 실행 및 결과 전달 |
| 전달 결과 | HTML | RSC Payload |
| 컴포넌트 구현 코드 | Client Component의 경우 클라이언트 번들에 포함 | Server Component 구현 코드는 클라이언트 번들에서 제외 |
| Hydration | 상호작용을 위해 필요 | Server Component 자체에는 필요하지 않음 |
| 데이터 조회 | 서버 또는 클라이언트 로직과 조합 | 서버 컴포넌트에서 직접 수행 가능 |

두 방식은 서로 배타적인 기술이 아닙니다.

실제 프레임워크에서는 Server Components로 서버 측 컴포넌트를 실행하고, SSR로 초기 HTML을 생성하며, Client Components를 Hydration하는 방식으로 함께 사용할 수 있습니다.

## 4. React Server Component Payload

**React Server Component Payload(RSC Payload)**는 Server Components의 렌더링 결과와 관련 정보를 클라이언트에 전달하기 위한 React 전용 데이터 형식입니다.

일반적인 HTML 문서와는 다른 구조를 가지며, 다음과 같은 정보를 포함합니다.

- Server Component의 렌더링 결과
- Client Component에 대한 참조 정보
- Client Component에 전달할 Props
- 서버와 클라이언트 사이에서 React 트리를 구성하기 위한 정보

Server Component는 서버에서 실행되므로 컴포넌트의 구현 코드 자체를 클라이언트로 전달할 필요가 없습니다.

대신 React는 Server Component의 결과를 RSC Payload에 포함하여 전달합니다.

Client Component가 포함되어 있다면 해당 컴포넌트를 식별하기 위한 참조 정보도 함께 전달됩니다.

이를 통해 클라이언트는 서버에서 생성된 결과와 Client Component를 결합하여 React 트리를 구성할 수 있습니다.

### 4.1. RSC Payload와 HTML

RSC Payload와 HTML은 서로 다른 목적을 가집니다.

- HTML은 브라우저가 초기 화면을 표시하는 데 사용됩니다.
- RSC Payload는 React가 서버 컴포넌트의 결과와 클라이언트 컴포넌트 참조를 이해하고 트리를 구성하는 데 사용됩니다.

프레임워크는 이 두 형식을 함께 활용하여 초기 페이지 렌더링과 이후 클라이언트 내비게이션을 처리할 수 있습니다.

## 5. `'use client'` 지시어

`'use client'`는 해당 모듈을 Client Component 모듈로 지정하는 React 지시어입니다.

파일 최상단에 선언해야 하며, 해당 모듈을 클라이언트에서 사용할 수 있도록 클라이언트 의존성 그래프에 포함시킵니다.

```tsx
"use client";

import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Search..."
    />
  );
}
```

위 컴포넌트는 State와 이벤트 핸들러를 사용하므로 Client Component로 선언해야 합니다.

### 5.1. Client Boundary

`'use client'`가 선언된 모듈은 Server Components와 Client Components를 구분하는 경계인 **Client Boundary**를 형성합니다.

Client Boundary는 단순히 해당 파일 하나에만 영향을 주지 않습니다. 해당 모듈이 일반적인 방식으로 import하는 의존성도 클라이언트 의존성 그래프에 포함됩니다.

```tsx
// components/InteractivePanel.tsx

"use client";

import { useState } from "react";
import { formatDate } from "@/lib/format-date";
import { DatePicker } from "./DatePicker";

export default function InteractivePanel() {
  const [date, setDate] = useState(new Date());

  return (
    <section>
      <p>{formatDate(date)}</p>
      <DatePicker value={date} onChange={setDate} />
    </section>
  );
}
```

위 예제에서 `InteractivePanel`은 Client Component입니다.

`formatDate`와 `DatePicker`도 해당 모듈의 클라이언트 의존성에 포함됩니다.

따라서 `formatDate`가 서버 전용 라이브러리나 Node.js API에 의존한다면 클라이언트에서 실행할 수 없는 문제가 발생할 수 있습니다.

Client Boundary 내부의 의존성은 브라우저에서 실행할 수 있는 코드로 구성해야 합니다.

### 5.2. `'use client'`의 선언 위치

모든 Client Component 파일에 `'use client'`를 선언할 필요는 없습니다.

Server Component에서 직접 import되는 클라이언트 진입점에 선언하면, 해당 모듈을 기준으로 클라이언트 의존성 그래프가 구성됩니다.

```tsx
// app/page.tsx

import InteractivePanel from "@/components/InteractivePanel";

export default function Page() {
  return (
    <main>
      <h1>Dashboard</h1>
      <InteractivePanel />
    </main>
  );
}
```

```tsx
// components/InteractivePanel.tsx

"use client";

import { useState } from "react";

export default function InteractivePanel() {
  const [active, setActive] = useState(false);

  return (
    <button onClick={() => setActive((value) => !value)}>
      {active ? "Active" : "Inactive"}
    </button>
  );
}
```

`page.tsx`는 Server Component이고 `InteractivePanel.tsx`는 Client Component입니다.

Server Component에서 Client Component를 import하는 것은 허용됩니다.

## 6. Transitive Dependencies와 Client Boundary

Client Component가 import하는 모듈은 일반적으로 클라이언트 의존성 그래프에 포함됩니다.

이러한 의존성 관계를 **Transitive Dependencies(전이적 의존성)**라고 합니다.

예를 들어 다음과 같은 구조가 있다고 가정합니다.

```text
InteractivePanel
 ├── useState
 ├── DatePicker
 │    ├── Calendar
 │    └── DateUtils
 └── formatDate
```

`InteractivePanel`이 Client Component로 선언되어 있다면 해당 컴포넌트가 의존하는 `DatePicker`, `Calendar`, `DateUtils`, `formatDate`도 클라이언트에서 사용할 수 있는 코드여야 합니다.

따라서 Client Boundary를 설정할 때는 컴포넌트 자체뿐 아니라 의존성까지 고려해야 합니다.

### 6.1. Client Boundary 최소화

상호작용이 필요한 영역만 Client Component로 분리하면 클라이언트 JavaScript 번들의 크기를 줄일 수 있습니다.

```tsx
// app/dashboard/page.tsx

import SearchInput from "@/components/SearchInput";

export default async function DashboardPage() {
  const reports = await getReports();

  return (
    <main>
      <h1>Dashboard</h1>

      <SearchInput />

      <ul>
        {reports.map((report) => (
          <li key={report.id}>{report.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

```tsx
// components/SearchInput.tsx

"use client";

import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  );
}
```

위 구조에서는 데이터 조회와 목록 렌더링을 Server Component가 담당하고, 검색 입력 기능만 Client Component가 담당합니다.

반대로 페이지 전체를 Client Component로 지정하면 불필요한 모듈까지 클라이언트 번들에 포함될 수 있습니다.

## 7. Server Components와 Client Components의 Composition Pattern

Server Components와 Client Components를 함께 사용할 때는 컴포넌트의 import 방향과 구성 방식을 이해해야 합니다.

Server Component는 Client Component를 import할 수 있습니다.

```tsx
// app/page.tsx

import Counter from "@/components/Counter";

export default function Page() {
  return (
    <main>
      <h1>Server Page</h1>
      <Counter />
    </main>
  );
}
```

```tsx
// components/Counter.tsx

"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((value) => value + 1)}>
      {count}
    </button>
  );
}
```

이 구조에서는 Server Component가 Client Component를 React 트리의 일부로 포함합니다.

반면 Client Component가 Server Component 모듈을 일반적인 방식으로 import하는 패턴은 사용할 수 없습니다.

```tsx
// 잘못된 구성 예시

"use client";

import ServerContent from "./ServerContent";

export default function ClientPanel() {
  return <ServerContent />;
}
```

이 방식은 Server Component를 클라이언트 의존성 그래프에 포함하려는 구조이므로 적절하지 않습니다.

대신 서버에서 생성한 React 요소를 Client Component의 Props로 전달하는 **Composition Pattern**을 사용합니다.

### 7.1. `children`을 활용한 Composition

```tsx
// app/page.tsx

import ClientPanel from "@/components/ClientPanel";
import ServerContent from "@/components/ServerContent";

export default function Page() {
  return (
    <ClientPanel>
      <ServerContent />
    </ClientPanel>
  );
}
```

```tsx
// components/ClientPanel.tsx

"use client";

import { useState, type ReactNode } from "react";

interface ClientPanelProps {
  children: ReactNode;
}

export default function ClientPanel({
  children,
}: ClientPanelProps) {
  const [open, setOpen] = useState(true);

  return (
    <section>
      <button onClick={() => setOpen((value) => !value)}>
        Toggle
      </button>

      {open && children}
    </section>
  );
}
```

```tsx
// components/ServerContent.tsx

export default async function ServerContent() {
  const data = await getServerData();

  return <p>{data.message}</p>;
}
```

위 예제에서 `ServerContent`는 서버에서 실행됩니다.

`ClientPanel`은 서버에서 생성된 React 요소를 `children`으로 전달받아 표시 여부를 제어합니다.

Client Component가 Server Component를 직접 import하지 않으면서도 서버에서 생성한 콘텐츠를 클라이언트 상호작용 영역 안에 배치할 수 있습니다.

이 패턴은 모달, 탭, 아코디언, 패널 등 상호작용이 필요한 UI를 구성할 때 유용합니다.

## 8. Context Provider 사용

Server Components는 Context를 생성하거나 `useContext`를 호출할 수 없습니다.

Context는 클라이언트에서 실행되는 상태 관리 및 컴포넌트 간 데이터 전달 기능이기 때문입니다.

따라서 Context가 필요한 경우 Client Component로 Provider를 구현해야 합니다.

```tsx
// context/theme-context.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((value) => (value === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
```

Server Component에서는 Provider를 렌더링할 수 있습니다.

```tsx
// app/layout.tsx

import { ThemeProvider } from "@/context/theme-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

이때 `ThemeProvider`는 Client Component이고, `RootLayout`은 Server Component입니다.

Server Component가 Provider를 직접 생성하는 것이 아니라 Client Component인 Provider를 React 트리에 배치하는 구조입니다.

## 9. Async Server Components

Server Components는 비동기 함수로 선언할 수 있습니다.

이를 통해 컴포넌트 렌더링 과정에서 `async/await`를 사용하여 데이터를 조회할 수 있습니다.

```tsx
interface User {
  id: number;
  name: string;
}

async function getUsers(): Promise<User[]> {
  const response = await fetch("https://example.com/api/users");

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

위 예제에서는 `UsersPage`가 서버에서 실행되며 데이터 조회가 완료된 후 렌더링 결과를 생성합니다.

일반적인 Client Component는 `async` 함수 컴포넌트로 작성할 수 없습니다.

```tsx
// 일반적인 Client Component에서 사용할 수 없는 패턴

"use client";

export default async function UsersPage() {
  const response = await fetch("/api/users");
  const users = await response.json();

  return <div>{users.length}</div>;
}
```

Client Component에서 비동기 데이터를 처리하려면 일반적으로 Effect, 데이터 fetching 라이브러리 또는 React의 지원 API를 사용합니다.

React 19에서는 `use` API를 활용하여 Promise의 결과를 읽는 방식도 지원합니다. 이 경우 Promise의 대기 상태는 Suspense와 연동될 수 있습니다.

## 10. Suspense와 Streaming

Server Components는 Suspense와 함께 사용하여 비동기 데이터가 준비되는 동안 화면의 일부를 점진적으로 전달할 수 있습니다.

```tsx
import { Suspense } from "react";

async function UserList() {
  const users = await getUsers();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <main>
      <h1>Users</h1>

      <Suspense fallback={<p>Loading users...</p>}>
        <UserList />
      </Suspense>
    </main>
  );
}
```

`UserList`가 데이터를 조회하는 동안 Suspense Boundary는 fallback을 표시할 수 있습니다.

서버 렌더링 환경에서는 Suspense Boundary를 기준으로 준비된 콘텐츠를 점진적으로 전달하는 Streaming Server Rendering과 결합할 수 있습니다.

이러한 방식을 사용하면 페이지의 모든 데이터가 준비될 때까지 전체 응답을 기다리지 않고, 준비된 영역부터 사용자에게 전달할 수 있습니다.

다만 Suspense가 모든 비동기 작업을 자동으로 감지하는 것은 아닙니다. Server Components의 비동기 렌더링, React의 `use` API, Suspense를 지원하는 프레임워크 및 라이브러리의 데이터 로딩 방식 등을 구분해야 합니다.

## 11. Hydration 및 Client Navigation

Server Components는 서버에서 실행되므로 컴포넌트 자체가 브라우저에서 Hydration되는 것은 아닙니다.

Hydration은 서버에서 HTML로 렌더링된 Client Component를 브라우저에서 활성화하여 이벤트 핸들러와 상호작용 기능을 연결하는 과정입니다.

일반적인 프레임워크 환경에서는 다음과 같은 흐름으로 동작합니다.

1. 서버에서 Server Components를 실행합니다.
2. Client Components의 초기 렌더링 결과도 필요에 따라 HTML로 생성합니다.
3. HTML과 RSC Payload 등을 클라이언트에 전달합니다.
4. 브라우저가 HTML을 표시합니다.
5. Client Component의 JavaScript를 로드하고 Hydration을 수행합니다.
6. 이후 클라이언트 상호작용을 처리합니다.

### 11.1. Client Navigation

Server Components를 지원하는 프레임워크에서는 페이지 이동 시에도 RSC Payload를 활용할 수 있습니다.

기존 페이지 전체를 다시 요청하는 대신, 이동할 페이지에 필요한 서버 컴포넌트의 렌더링 결과를 요청하고 기존 React 트리와 결합하는 방식으로 동작할 수 있습니다.

이를 통해 다음과 같은 이점을 얻을 수 있습니다.

- 페이지 이동 시 불필요한 HTML 전체 재전송 감소
- Server Component 결과의 재사용
- 클라이언트 상태 유지
- 필요한 영역 중심의 화면 갱신

실제 캐싱, 재검증, 내비게이션 동작은 사용하는 프레임워크의 구현 방식에 따라 달라질 수 있습니다.

## 12. Props와 직렬화 제약

Server Component에서 Client Component로 데이터를 전달할 때는 React가 지원하는 직렬화 형식을 사용해야 합니다.

서버와 클라이언트는 서로 다른 실행 환경이므로 서버의 객체나 실행 컨텍스트를 그대로 전달할 수는 없습니다.

다음과 같이 기본적인 데이터 타입을 전달할 수 있습니다.

```tsx
// Server Component

import UserProfile from "./UserProfile";

export default async function Page() {
  const user = await getUser();

  return (
    <UserProfile
      id={user.id}
      name={user.name}
      email={user.email}
    />
  );
}
```

```tsx
// Client Component

"use client";

interface UserProfileProps {
  id: number;
  name: string;
  email: string;
}

export default function UserProfile({
  id,
  name,
  email,
}: UserProfileProps) {
  return (
    <section>
      <h2>{name}</h2>
      <p>{email}</p>
      <small>{id}</small>
    </section>
  );
}
```

일반적인 JavaScript 함수나 클래스 인스턴스처럼 직렬화할 수 없는 값을 일반 Props로 전달하는 것은 허용되지 않습니다.

다만 React는 일반적인 직렬화 규칙과 별도로 React Element, Server Function 등 지원되는 특수한 값을 전달할 수 있도록 합니다.

따라서 Server Component와 Client Component 사이의 데이터 전달에서는 React가 지원하는 직렬화 범위를 확인해야 합니다.

## 13. `'use server'`와 Server Functions

`'use server'`는 Server Function을 표시하는 React 지시어입니다.

`'use client'`가 클라이언트 모듈 경계를 지정하는 지시어라면, `'use server'`는 서버에서 실행되어야 하는 함수를 표시합니다.

Server Function은 클라이언트에서 호출할 수 있지만 실제 실행은 서버에서 수행됩니다.

```tsx
// app/actions.ts

"use server";

export async function createUser(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid name");
  }

  await db.user.create({
    data: {
      name,
    },
  });
}
```

Client Component에서는 Server Function을 호출할 수 있습니다.

```tsx
// components/UserForm.tsx

"use client";

import { createUser } from "@/app/actions";

export default function UserForm() {
  return (
    <form action={createUser}>
      <input name="name" placeholder="Name" />
      <button type="submit">Create User</button>
    </form>
  );
}
```

이 구조에서 `createUser`의 구현 코드는 클라이언트에서 실행되지 않습니다.

클라이언트의 호출은 네트워크를 통해 서버로 전달되며, 서버에서 함수가 실행됩니다.

Server Functions는 데이터 변경 작업이나 서버에서 수행해야 하는 작업을 처리하는 데 활용할 수 있습니다.

단, `'use server'`는 Server Component를 지정하는 지시어가 아닙니다. Server Components와 Server Functions는 서로 다른 개념입니다.

### 13.1. 보안 및 입력 검증

Server Function은 클라이언트에서 호출할 수 있으므로 클라이언트 입력을 신뢰해서는 안 됩니다.

서버에서 다음 항목을 검증해야 합니다.

- 입력 데이터의 타입과 형식
- 필수 필드 및 값의 범위
- 사용자 인증 여부
- 작업에 대한 권한
- 데이터 변경의 유효성

Server Function은 서버에서 실행된다는 이유만으로 자동으로 안전해지는 것이 아닙니다. 외부 요청을 처리하는 서버 API와 동일한 수준의 보안 검토가 필요합니다.

## 14. Server Components 사용 시 주의사항

### 14.1. 실행 환경 구분

Server Component와 Client Component는 사용할 수 있는 API가 다릅니다.

브라우저 API나 이벤트 핸들러가 필요한 기능을 Server Component에 작성하지 않도록 주의해야 합니다.

### 14.2. Client Boundary 최소화

필요한 컴포넌트에만 `'use client'`를 선언하는 것이 좋습니다.

불필요하게 넓은 영역을 Client Component로 지정하면 클라이언트 JavaScript 번들이 커질 수 있습니다.

### 14.3. 서버 전용 의존성 관리

Client Component가 import하는 모듈은 클라이언트 환경에서 실행할 수 있어야 합니다.

데이터베이스 드라이버, 파일 시스템 API, 서버 전용 환경 변수 등을 클라이언트 의존성 그래프에 포함하지 않도록 주의해야 합니다.

### 14.4. Server Component와 Client Component의 구성 방향

Server Component에서 Client Component를 import하는 것은 가능하지만, Client Component에서 Server Component를 일반 모듈처럼 import하는 방식은 적절하지 않습니다.

서버에서 생성한 React 요소를 Props로 전달하는 Composition Pattern을 활용해야 합니다.

### 14.5. 직렬화 가능한 데이터 전달

Server Component에서 Client Component로 전달하는 Props는 React가 지원하는 직렬화 규칙을 따라야 합니다.

서버에서만 사용할 수 있는 객체나 임의의 함수 참조를 일반 Props로 전달하지 않도록 주의해야 합니다.

### 14.6. 데이터 조회와 캐싱 정책

Server Components에서 수행하는 데이터 조회의 캐싱 및 재검증 동작은 프레임워크에 따라 달라질 수 있습니다.

데이터가 항상 최신 상태여야 하는지, 캐싱을 허용할 수 있는지, 요청마다 다시 조회해야 하는지를 구분하여 설계해야 합니다.

### 14.7. Server Components와 SSR 구분

Server Components와 SSR은 동일한 개념이 아닙니다.

Server Components는 서버에서 컴포넌트를 실행하고 결과를 전달하는 아키텍처이며, SSR은 HTML을 서버에서 생성하는 렌더링 방식입니다.

두 기술은 함께 사용될 수 있으므로 각각의 역할을 구분해야 합니다.

### 14.8. 버전 및 구현 참고

React 19에서 Server Components 자체는 안정화되었지만, RSC를 구현하는 프레임워크 및 번들러용 저수준 API는 별도의 안정성 정책을 따릅니다. 실제 프로젝트에서는 사용하는 프레임워크의 React 버전 호환성과 RSC 지원 범위를 확인해야 합니다.

## 15. 정리

Server Components는 서버에서 React 컴포넌트를 실행하고 그 결과를 클라이언트에 전달하는 React 아키텍처입니다.

Server Components를 사용하면 데이터 조회와 서버 전용 로직을 서버에 배치하고, 해당 컴포넌트의 구현 코드를 클라이언트 번들에서 제외할 수 있습니다.

Client Components는 State, Effect, 이벤트 핸들러, 브라우저 API 등 사용자 상호작용에 필요한 기능을 담당합니다.

두 컴포넌트는 다음과 같은 기준으로 구분할 수 있습니다.

- 서버 리소스 접근과 데이터 조회가 중심인 영역은 Server Component로 구성합니다.
- 사용자 입력과 브라우저 상호작용이 필요한 영역은 Client Component로 구성합니다.
- Client Boundary는 필요한 영역에 한정하여 설정합니다.
- Server Component와 Client Component는 Composition Pattern으로 결합합니다.
- 서버에서 클라이언트로 전달하는 Props는 React가 지원하는 직렬화 규칙을 따라야 합니다.

Server Components는 SSR, Streaming, Suspense, Client Components와 함께 사용하여 서버와 클라이언트의 역할을 분리하고 React 애플리케이션의 렌더링 구조를 설계하는 데 활용할 수 있습니다.

## 16. 참고 자료

- [React 공식 문서 - Server Components](https://react.dev/reference/rsc/server-components)
- [React 공식 문서 - `'use client'`](https://react.dev/reference/rsc/use-client)
- [React 공식 문서 - `'use server'`](https://react.dev/reference/rsc/use-server)
- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream)
- [React RFC - Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [React RFC - Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md)
- [Next.js 공식 문서 - Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

