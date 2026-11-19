# Transitions

## 1. Transitions란?

**Transition**은 React에서 사용자 인터페이스의 상태 업데이트를 긴급한 업데이트(Urgent Update)와 비긴급 업데이트(Non-Urgent Update)로 구분하기 위한 개념입니다.

모든 상태 업데이트가 동일한 우선순위로 처리될 필요는 없습니다. 사용자의 키보드 입력이나 버튼 클릭에 대한 피드백은 즉시 반영되어야 하지만, 복잡한 목록이나 차트처럼 많은 렌더링 작업이 필요한 UI는 상대적으로 늦게 반영되어도 사용자 경험에 큰 문제가 없을 수 있습니다.

React는 Transition을 사용하여 이러한 업데이트의 우선순위를 구분하고, 중요한 사용자 입력을 먼저 처리할 수 있습니다.

예를 들어 검색 기능에서 다음과 같이 업데이트를 구분할 수 있습니다.

- 검색어 입력: 사용자의 입력에 즉시 반응해야 하는 긴급한 업데이트입니다.
- 검색 결과 목록: 검색어에 따라 많은 컴포넌트를 다시 렌더링해야 하므로 비긴급 업데이트로 처리할 수 있습니다.

Transition을 사용하면 검색 결과를 렌더링하는 도중에도 사용자의 추가 입력을 우선 처리할 수 있습니다.

### 1.1. Transition의 목적

Transition의 주요 목적은 렌더링 작업의 우선순위를 구분하여 UI의 반응성을 유지하는 것입니다.

일반적인 상태 업데이트에서는 React가 변경된 상태를 기반으로 렌더링 작업을 수행합니다. 이때 복잡한 컴포넌트 트리를 렌더링하는 데 시간이 오래 걸리면 새로운 사용자 입력에 대한 반응이 지연될 수 있습니다.

Transition으로 표시된 업데이트는 다른 긴급한 업데이트에 의해 중단될 수 있습니다. React는 긴급한 업데이트를 먼저 처리한 후 필요한 렌더링 작업을 다시 수행합니다.

Transition은 다음과 같은 상황에서 유용합니다.

- 복잡한 탭 콘텐츠 전환
- 대량의 데이터를 사용하는 목록 필터링
- 검색 결과 렌더링
- 복잡한 차트 또는 시각화 업데이트
- 페이지 또는 화면 전환
- 서버 요청 결과를 반영하는 UI 업데이트

Transition은 렌더링 작업의 우선순위를 지정하는 기능이며, JavaScript 연산 자체를 백그라운드 스레드에서 실행하거나 CPU 작업을 병렬화하는 기능은 아닙니다.

## 2. Urgent Update와 Transition Update

React는 사용자 경험에 따라 상태 업데이트를 구분할 수 있습니다.

### 2.1. Urgent Update

Urgent Update는 사용자와 직접적으로 상호작용하는 작업에 해당합니다.

사용자는 입력이나 클릭에 대한 즉각적인 피드백을 기대하므로 해당 업데이트가 지연되면 UI가 느리게 느껴질 수 있습니다.

대표적인 예시는 다음과 같습니다.

- 텍스트 입력 필드의 값 변경
- 버튼 클릭에 대한 시각적 피드백
- 체크박스 및 라디오 버튼의 선택 상태 변경
- 드래그 중인 요소의 위치 변경

```tsx
import { useState } from "react";

function SearchInput() {
  const [query, setQuery] = useState("");

  return (
    <input
      value={query}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
    />
  );
}
```

입력 필드의 값은 사용자의 입력에 즉시 반응해야 하므로 일반적인 상태 업데이트로 처리합니다.

### 2.2. Transition Update

Transition Update는 사용자 입력에 비해 상대적으로 늦게 처리되어도 괜찮은 업데이트입니다.

대표적인 예시는 다음과 같습니다.

- 대량의 검색 결과 렌더링
- 복잡한 탭 콘텐츠 변경
- 데이터 기반 차트 갱신
- 화면 전환에 따른 복잡한 컴포넌트 렌더링

```tsx
import { startTransition, useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function handleChange(value: string) {
    setQuery(value);

    startTransition(() => {
      setSearchQuery(value);
    });
  }

  return (
    <>
      <input
        value={query}
        onChange={(event) => {
          handleChange(event.target.value);
        }}
      />

      <SearchResults query={searchQuery} />
    </>
  );
}
```

검색어 입력은 일반적인 상태 업데이트로 즉시 반영하고, 검색 결과를 변경하는 상태 업데이트는 Transition으로 처리합니다.

이렇게 하면 검색 결과를 렌더링하는 작업이 진행 중이더라도 새로운 입력을 우선적으로 처리할 수 있습니다.

### 2.3. 업데이트 우선순위 비교

| 구분 | Urgent Update | Transition Update |
| --- | --- | --- |
| 목적 | 즉각적인 사용자 피드백 | 비긴급 UI 변경 |
| 처리 우선순위 | 상대적으로 높음 | 상대적으로 낮음 |
| 중단 가능 여부 | Transition에 의해 지연되지 않도록 우선 처리 | 다른 긴급 업데이트에 의해 중단 가능 |
| 대표 사례 | 텍스트 입력, 버튼 클릭 | 검색 결과, 복잡한 화면 전환 |
| 구현 방법 | 일반적인 State 업데이트 | `startTransition`, `useTransition` |

두 업데이트는 서로 대체하는 관계가 아닙니다. 하나의 사용자 입력에서 긴급한 업데이트와 비긴급 업데이트를 함께 수행하는 것이 일반적입니다.

## 3. startTransition

`startTransition`은 특정 상태 업데이트를 Transition으로 표시하는 React API입니다.

컴포넌트 외부에서도 사용할 수 있는 독립적인 함수이며, 전달한 함수가 실행되는 동안 예약된 상태 업데이트를 Transition으로 처리합니다.

### 3.1. 기본 사용법

```tsx
import { startTransition, useState } from "react";

function TabContainer() {
  const [tab, setTab] = useState("about");

  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <button onClick={() => selectTab("about")}>
        About
      </button>

      <button onClick={() => selectTab("posts")}>
        Posts
      </button>

      <button onClick={() => selectTab("contact")}>
        Contact
      </button>

      <TabContent tab={tab} />
    </>
  );
}
```

`startTransition`은 다음과 같은 형태로 사용합니다.

```tsx
startTransition(() => {
  setState(nextState);
});
```

함수 자체는 즉시 실행되며, 실행 과정에서 동기적으로 예약된 상태 업데이트가 Transition으로 표시됩니다.

React는 해당 업데이트를 비긴급 작업으로 처리하고, 다른 긴급 업데이트가 발생하면 진행 중인 렌더링 작업을 중단할 수 있습니다.

### 3.2. 여러 상태 업데이트 처리

하나의 `startTransition` 내부에서 여러 상태를 업데이트할 수 있습니다.

```tsx
import { startTransition, useState } from "react";

function Dashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedFilter, setSelectedFilter] = useState("all");

  function updateDashboard() {
    startTransition(() => {
      setSelectedTab("analytics");
      setSelectedFilter("monthly");
    });
  }

  return (
    <>
      <button onClick={updateDashboard}>
        Show Analytics
      </button>

      <DashboardContent
        tab={selectedTab}
        filter={selectedFilter}
      />
    </>
  );
}
```

Transition 내부에서 예약된 두 상태 업데이트는 모두 Transition으로 처리됩니다.

### 3.3. startTransition의 반환값과 특징

`startTransition`은 반환값이 없습니다.

```tsx
const result = startTransition(() => {
  setState(nextState);
});

console.log(result); // undefined
```

다음과 같은 특징이 있습니다.

- 컴포넌트 외부에서도 호출할 수 있습니다.
- Transition의 진행 상태를 직접 추적하지 않습니다.
- 전달한 함수는 즉시 실행됩니다.
- Transition 업데이트는 다른 긴급 업데이트에 의해 중단될 수 있습니다.
- 텍스트 입력을 제어하는 상태 업데이트에는 사용할 수 없습니다.

Transition 진행 상태를 확인해야 한다면 `useTransition`을 사용해야 합니다.

## 4. useTransition

`useTransition`은 Transition의 진행 상태를 확인하면서 상태 업데이트를 Transition으로 처리할 수 있는 React Hook입니다.

`useTransition`은 다음과 같은 배열을 반환합니다.

```tsx
const [isPending, startTransition] = useTransition();
```

| 반환값 | 설명 |
| --- | --- |
| `isPending` | Transition이 진행 중인지 나타내는 Boolean 값입니다. |
| `startTransition` | 상태 업데이트를 Transition으로 표시하는 함수입니다. |

`useTransition`은 Transition을 시작하는 기능뿐만 아니라, 해당 작업이 진행 중인지 UI에 표시할 수 있다는 점에서 독립적인 `startTransition` API와 차이가 있습니다.

### 4.1. 기본 사용법

```tsx
import { useState, useTransition } from "react";

function TabContainer() {
  const [tab, setTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <button onClick={() => selectTab("about")}>
        About
      </button>

      <button onClick={() => selectTab("posts")}>
        Posts
      </button>

      <button onClick={() => selectTab("contact")}>
        Contact
      </button>

      {isPending && <p>Loading...</p>}

      <TabContent tab={tab} />
    </>
  );
}
```

`startTransition`으로 상태 업데이트를 예약하면 React는 Transition이 진행 중인 동안 `isPending`을 `true`로 설정합니다.

Transition이 완료되면 `isPending`은 다시 `false`가 됩니다.

이를 이용하면 기존 화면을 유지하면서 새로운 콘텐츠가 준비되는 동안 진행 상태를 표시할 수 있습니다.

### 4.2. isPending을 활용한 UI 처리

Transition을 사용하는 목적은 반드시 로딩 화면을 표시하는 것이 아닙니다.

기존 콘텐츠를 유지하면서 버튼의 상태나 진행 표시를 변경하는 방식으로도 사용할 수 있습니다.

```tsx
import { useState, useTransition } from "react";

function ProductTabs() {
  const [selectedTab, setSelectedTab] = useState("products");
  const [isPending, startTransition] = useTransition();

  function changeTab(tab: string) {
    startTransition(() => {
      setSelectedTab(tab);
    });
  }

  return (
    <section>
      <nav>
        <button
          disabled={isPending}
          onClick={() => changeTab("products")}
        >
          Products
        </button>

        <button
          disabled={isPending}
          onClick={() => changeTab("reviews")}
        >
          Reviews
        </button>
      </nav>

      <div
        style={{
          opacity: isPending ? 0.6 : 1,
        }}
      >
        <ProductTabContent tab={selectedTab} />
      </div>
    </section>
  );
}
```

이 예제에서는 Transition이 진행되는 동안 콘텐츠의 투명도를 변경하여 진행 상태를 표현합니다.

단, 모든 상황에서 버튼을 비활성화하는 것이 적절한 것은 아닙니다. Transition의 중요한 특징 중 하나는 사용자가 새로운 입력을 수행할 수 있도록 UI의 반응성을 유지하는 것입니다.

따라서 진행 중인 작업을 중복 실행하면 안 되는 경우에만 버튼을 비활성화하는 것이 좋습니다.

### 4.3. useTransition의 호출 위치

`useTransition`은 React Hook이므로 컴포넌트 또는 커스텀 Hook의 최상위 수준에서 호출해야 합니다.

```tsx
function Component() {
  const [isPending, startTransition] = useTransition();

  // ...
}
```

다음과 같이 이벤트 핸들러나 조건문 내부에서 호출할 수 없습니다.

```tsx
function Component() {
  function handleClick() {
    // 잘못된 사용
    const [isPending, startTransition] = useTransition();
  }

  // ...
}
```

컴포넌트 외부의 일반 함수나 데이터 라이브러리에서 Transition을 시작해야 한다면 독립적인 `startTransition` API를 사용합니다.

## 5. Transition과 Concurrent Rendering

Transition은 React의 Concurrent Rendering과 밀접하게 연관되어 있습니다.

Concurrent Rendering은 React가 렌더링 작업을 중단하거나 다시 시작할 수 있도록 하는 렌더링 모델입니다.

Transition은 이 모델을 활용하여 비긴급 상태 업데이트의 렌더링 작업을 다른 긴급 업데이트보다 낮은 우선순위로 처리할 수 있도록 합니다.

### 5.1. 렌더링 작업의 중단

일반적인 렌더링 작업에서는 복잡한 컴포넌트 트리를 다시 렌더링하는 동안 새로운 사용자 입력이 발생하면 해당 입력에 대한 반응이 늦어질 수 있습니다.

Transition을 사용하면 React는 비긴급 렌더링 작업을 진행하다가 더 긴급한 업데이트가 발생했을 때 해당 작업을 중단할 수 있습니다.

예를 들어 다음과 같은 상황을 가정할 수 있습니다.

1. 사용자가 검색어를 입력합니다.
2. 검색 결과를 갱신하는 Transition이 시작됩니다.
3. 검색 결과를 렌더링하는 데 시간이 오래 걸립니다.
4. 사용자가 새로운 검색어를 입력합니다.
5. React는 새로운 입력에 대한 긴급 업데이트를 우선 처리합니다.
6. 변경된 검색어를 기준으로 검색 결과 렌더링 작업을 다시 수행합니다.

이 과정에서 React는 이전 검색 결과 렌더링을 반드시 끝까지 완료할 필요가 없습니다.

### 5.2. 렌더링 작업의 재시작

Transition으로 표시된 업데이트가 진행 중일 때 새로운 긴급 업데이트가 발생하면 React는 최신 상태를 기준으로 렌더링 작업을 다시 수행할 수 있습니다.

따라서 Transition 내부의 렌더링 결과가 항상 화면에 표시되는 것은 아닙니다.

```tsx
import { startTransition, useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState("");

  function handleChange(value: string) {
    setQuery(value);

    startTransition(() => {
      setResultQuery(value);
    });
  }

  return (
    <>
      <input
        value={query}
        onChange={(event) => handleChange(event.target.value)}
      />

      <ExpensiveSearchResults query={resultQuery} />
    </>
  );
}
```

검색어 입력은 즉시 처리되며, 검색 결과 렌더링은 Transition으로 처리됩니다.

사용자가 빠르게 여러 검색어를 입력하면 React는 이전 렌더링 작업을 중단하고 최신 검색어를 기준으로 렌더링을 다시 수행할 수 있습니다.

### 5.3. Transition과 Render Phase

Transition은 Render Phase의 우선순위와 작업 스케줄링에 영향을 줍니다.

다음과 같은 점을 구분해야 합니다.

- Transition은 렌더링 작업을 비긴급 업데이트로 표시합니다.
- React는 렌더링 작업을 중단하거나 다시 시작할 수 있습니다.
- Render Phase에서 수행되는 계산이 반드시 한 번만 실행되는 것은 아닙니다.
- Commit Phase는 React가 실제 DOM 변경 사항을 반영하는 단계입니다.

따라서 컴포넌트의 렌더링 과정에서 외부 시스템을 변경하거나 부수 효과를 실행해서는 안 됩니다.

렌더링은 중단되거나 재시작될 수 있으므로 Render Phase의 순수성을 유지해야 합니다.

## 6. Transition과 Suspense

Transition은 Suspense와 함께 사용할 때 기존 콘텐츠를 유지하면서 새로운 콘텐츠를 준비할 수 있도록 도와줍니다.

Suspense는 하위 컴포넌트가 준비되지 않았을 때 지정된 Fallback UI를 표시하는 기능입니다.

일반적인 상태 업데이트로 Suspense가 활성화되면 기존 콘텐츠가 Fallback으로 교체될 수 있습니다.

반면 Transition으로 상태를 업데이트하면 React는 새로운 콘텐츠가 준비되는 동안 기존 콘텐츠를 유지하는 방향으로 처리할 수 있습니다.

### 6.1. Suspense와 일반 상태 업데이트

```tsx
import { Suspense, useState } from "react";

function TabContainer() {
  const [tab, setTab] = useState("about");

  return (
    <>
      <button onClick={() => setTab("posts")}>
        Posts
      </button>

      <Suspense fallback={<p>Loading...</p>}>
        <TabContent tab={tab} />
      </Suspense>
    </>
  );
}
```

`TabContent`가 Suspense를 활성화하는 리소스를 읽고 아직 준비되지 않은 상태라면 Fallback UI가 표시될 수 있습니다.

### 6.2. Suspense와 Transition 결합

```tsx
import { Suspense, useState, useTransition } from "react";

function TabContainer() {
  const [tab, setTab] = useState("about");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab: string) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      <button onClick={() => selectTab("about")}>
        About
      </button>

      <button onClick={() => selectTab("posts")}>
        Posts
      </button>

      {isPending && <p>Updating...</p>}

      <Suspense fallback={<p>Loading...</p>}>
        <TabContent tab={tab} />
      </Suspense>
    </>
  );
}
```

Transition으로 탭 상태를 변경하면 새로운 콘텐츠가 준비되는 동안 기존 콘텐츠를 유지할 수 있습니다.

`isPending`을 활용하면 새로운 콘텐츠가 준비되는 동안 별도의 진행 표시를 제공할 수도 있습니다.

단, 모든 Suspense 상황에서 기존 콘텐츠가 무조건 유지되는 것은 아닙니다. Boundary의 배치, 현재 UI 상태, 업데이트의 종류 등에 따라 동작이 달라집니다.

## 7. Transition과 useDeferredValue

`useDeferredValue`도 비긴급 업데이트를 처리하는 데 사용되지만, Transition과는 사용 방식이 다릅니다.

| 구분 | Transition | useDeferredValue |
| --- | --- | --- |
| 주요 목적 | 특정 상태 업데이트를 비긴급 작업으로 표시 | 특정 값의 최신 반영을 지연 |
| 사용 대상 | State 업데이트 | Props 또는 계산된 값 |
| 사용 방법 | `startTransition`, `useTransition` | `useDeferredValue` |
| 주요 사용 상황 | 직접 상태 업데이트를 제어할 수 있는 경우 | 전달받은 값이나 외부 값의 렌더링을 지연해야 하는 경우 |

Transition은 상태를 변경하는 코드에 직접 적용합니다.

```tsx
import { startTransition, useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState("");

  function handleChange(value: string) {
    setQuery(value);

    startTransition(() => {
      setResultQuery(value);
    });
  }

  return (
    <>
      <input
        value={query}
        onChange={(event) => handleChange(event.target.value)}
      />

      <SearchResults query={resultQuery} />
    </>
  );
}
```

반면 `useDeferredValue`는 이미 전달받은 값을 기준으로 지연된 값을 생성합니다.

```tsx
import { useDeferredValue, useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");

  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <SearchResults query={deferredQuery} />
    </>
  );
}
```

`query`는 사용자의 입력에 즉시 반응하고, `deferredQuery`는 렌더링 우선순위에 따라 나중에 최신 값으로 반영될 수 있습니다.

따라서 직접 상태 업데이트를 제어할 수 있다면 Transition을 사용할 수 있으며, 전달받은 값의 반영을 지연해야 한다면 `useDeferredValue`를 고려할 수 있습니다.

## 8. React 19의 Async Transition과 Actions

React 19부터 Transition은 비동기 함수를 처리하는 Actions와 연계하여 사용할 수 있습니다.

기존에는 서버 요청을 수행하고 그 결과를 상태에 반영하는 과정에서 다음과 같은 상태를 직접 관리해야 했습니다.

- 요청 진행 상태
- 요청 성공 및 실패
- 요청 결과 반영
- Optimistic Update
- 연속적인 요청 처리

React 19에서는 `useTransition`의 `startTransition`에 비동기 함수를 전달하여 이러한 작업을 더 쉽게 구성할 수 있습니다.

### 8.1. Async Transition 기본 사용법

```tsx
import { useState, useTransition } from "react";

type UpdateResult = {
  success: boolean;
  message: string;
};

async function updateProfile(
  name: string
): Promise<UpdateResult> {
  const response = await fetch("/api/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    return {
      success: false,
      message: "Profile update failed.",
    };
  }

  return {
    success: true,
    message: "Profile updated.",
  };
}

function ProfileForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await updateProfile(name);

      setMessage(result.message);
    });
  }

  return (
    <section>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
      >
        Update
      </button>

      {isPending && <p>Updating profile...</p>}
      {message && <p>{message}</p>}
    </section>
  );
}
```

비동기 Transition을 사용하면 비동기 작업이 진행되는 동안 `isPending`을 활용할 수 있습니다.

위 예제에서는 프로필 업데이트 요청이 완료될 때까지 진행 상태를 표시합니다.

### 8.2. Actions의 개념

React 19에서 비동기 Transition을 활용하여 데이터 변경 작업을 수행하는 함수를 Actions라고 부릅니다.

Actions는 다음과 같은 기능과 연계할 수 있습니다.

- Pending State 관리
- Error Boundary를 활용한 오류 처리
- `useOptimistic`을 활용한 Optimistic Update
- Form Action과의 연계
- 비동기 데이터 변경 작업 처리

Actions는 비동기 요청을 자동으로 실행하는 별도의 데이터 통신 라이브러리가 아닙니다. 비동기 작업과 그 결과에 따른 UI 상태 업데이트를 React의 Transition 모델에 통합하는 방식입니다.

### 8.3. await 이후 상태 업데이트 주의사항

현재 React에서는 `startTransition` 내부에서 `await`를 사용하더라도 `await` 이후의 상태 업데이트를 별도의 Transition으로 감싸야 합니다.

```tsx
import { startTransition, useState } from "react";

function Page() {
  const [page, setPage] = useState("/");

  function navigate() {
    startTransition(async () => {
      await fetch("/api/data");

      // await 이후의 업데이트는 별도로 Transition 처리
      startTransition(() => {
        setPage("/about");
      });
    });
  }

  return (
    <button onClick={navigate}>
      Navigate
    </button>
  );
}
```

`await` 이전에 실행되는 상태 업데이트와 `await` 이후에 실행되는 상태 업데이트는 구분해야 합니다.

이는 현재 JavaScript 비동기 실행 컨텍스트의 한계와 관련된 동작입니다. React 공식 문서에서 해당 제한 사항과 향후 개선 가능성을 설명하고 있으므로 비동기 Transition을 사용할 때 참고해야 합니다.

### 8.4. 비동기 Transition과 오류 처리

비동기 함수에서 발생한 오류를 무조건 `useTransition`이 반환하는 `isPending`으로 처리할 수 있는 것은 아닙니다.

오류를 직접 처리하려면 `try...catch`를 사용하거나, React Actions 및 Error Boundary에서 제공하는 오류 처리 방식을 활용해야 합니다.

```tsx
import { useState, useTransition } from "react";

async function saveData(): Promise<void> {
  const response = await fetch("/api/data", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to save data.");
  }
}

function SaveButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await saveData();
        setError(null);
      } catch {
        setError("데이터 저장에 실패했습니다.");
      }
    });
  }

  return (
    <>
      <button
        onClick={handleSave}
        disabled={isPending}
      >
        Save
      </button>

      {isPending && <p>Saving...</p>}
      {error && <p>{error}</p>}
    </>
  );
}
```

비동기 작업의 실패를 사용자에게 전달해야 한다면 오류 상태를 명시적으로 관리하거나 Error Boundary를 적절히 구성해야 합니다.

### 8.5. 비동기 요청의 순서와 경쟁 상태

비동기 Transition을 여러 번 실행한다고 해서 요청이 시작된 순서대로 완료되거나 상태가 반영되는 것은 아닙니다.

예를 들어 사용자가 짧은 시간 동안 여러 번 요청을 실행하면 이전 요청이 나중에 완료될 수 있습니다. 이때 오래된 요청의 결과가 최신 상태를 덮어쓰는 문제가 발생할 수 있습니다.

Transition은 이러한 네트워크 요청의 완료 순서를 자동으로 보장하지 않습니다.

요청 순서가 중요한 경우 다음과 같은 방법을 고려해야 합니다.

- 요청 식별자를 사용하여 최신 요청만 반영합니다.
- `AbortController`를 사용하여 이전 요청을 취소합니다.
- 요청을 순차적으로 처리하는 Queue를 구성합니다.
- `useActionState` 또는 Form Action 등 요청 순서 관리를 지원하는 React API를 활용합니다.

Transition은 렌더링 우선순위를 관리하는 기능이며, 비동기 요청의 동시성 제어나 데이터 일관성을 자동으로 보장하는 기능은 아닙니다.

## 9. Transition과 View Transitions의 차이

Transition과 View Transition은 이름이 유사하지만 서로 다른 개념입니다.

**React Transition**은 상태 업데이트의 우선순위를 구분하는 기능입니다.

**View Transition**은 화면 요소의 변경 과정에 시각적인 애니메이션을 적용하는 기능입니다.

React 19.3부터 `<ViewTransition>` 컴포넌트가 안정화되어 사용할 수 있으며, 브라우저의 View Transition API를 활용하여 요소의 등장, 제거, 이동 및 크기 변경 등을 애니메이션으로 표현할 수 있습니다.

| 구분 | React Transition | View Transition |
| --- | --- | --- |
| 목적 | 상태 업데이트 우선순위 관리 | 화면 변경 애니메이션 |
| 주요 API | `startTransition`, `useTransition` | `<ViewTransition>` |
| 주요 관심사 | 렌더링 작업의 반응성 | UI 변경의 시각적 표현 |
| 처리 대상 | State 업데이트 | DOM 요소의 시각적 변화 |

두 기능은 함께 사용할 수 있습니다.

```tsx
import {
  ViewTransition,
  useState,
  startTransition,
} from "react";

function Gallery() {
  const [showImage, setShowImage] = useState(false);

  function toggleImage() {
    startTransition(() => {
      setShowImage((previous) => !previous);
    });
  }

  return (
    <section>
      <button onClick={toggleImage}>
        Toggle Image
      </button>

      {showImage && (
        <ViewTransition>
          <img
            src="/images/sample.jpg"
            alt="Sample"
          />
        </ViewTransition>
      )}
    </section>
  );
}
```

위 예제에서 `startTransition`은 상태 업데이트를 비긴급 작업으로 표시하며, `<ViewTransition>`은 해당 업데이트로 발생하는 요소의 시각적 변화를 애니메이션으로 표현합니다.

따라서 Transition 자체가 애니메이션을 실행하는 것은 아닙니다.

## 10. Transition 사용 시 주의사항

### 10.1. 텍스트 입력 상태에 사용하지 않기

Transition으로 표시된 상태 업데이트는 텍스트 입력을 제어하는 데 사용할 수 없습니다.

텍스트 입력은 사용자의 입력에 즉시 반응해야 하므로 일반적인 상태 업데이트로 처리해야 합니다.

```tsx
import { startTransition, useState } from "react";

function SearchInput() {
  const [query, setQuery] = useState("");
  const [resultQuery, setResultQuery] = useState("");

  function handleChange(value: string) {
    // 긴급 업데이트
    setQuery(value);

    // 비긴급 업데이트
    startTransition(() => {
      setResultQuery(value);
    });
  }

  return (
    <>
      <input
        value={query}
        onChange={(event) => handleChange(event.target.value)}
      />

      <SearchResults query={resultQuery} />
    </>
  );
}
```

### 10.2. startTransition 내부의 상태 업데이트 범위

`startTransition`에 전달한 함수는 즉시 실행됩니다.

따라서 해당 함수가 종료된 이후에 실행되는 `setTimeout` 콜백의 상태 업데이트는 자동으로 Transition으로 표시되지 않습니다.

```tsx
startTransition(() => {
  setTimeout(() => {
    // Transition으로 처리되지 않음
    setState(nextState);
  }, 1000);
});
```

다음과 같이 실제 상태 업데이트가 실행되는 위치에서 `startTransition`을 호출해야 합니다.

```tsx
setTimeout(() => {
  startTransition(() => {
    setState(nextState);
  });
}, 1000);
```

### 10.3. 모든 렌더링 비용을 해결하지는 않음

Transition은 렌더링 작업의 우선순위를 구분하는 기능이지, 렌더링에 필요한 계산량 자체를 줄이는 기능은 아닙니다.

복잡한 계산이나 불필요한 렌더링이 발생하는 경우 다음과 같은 최적화도 함께 고려해야 합니다.

- 불필요한 State 업데이트 제거
- 컴포넌트 구조 개선
- `memo`를 활용한 불필요한 렌더링 방지
- `useMemo`를 활용한 계산 결과 재사용
- 대량의 목록에 Virtualization 적용
- 긴 작업을 Web Worker로 분리

Transition은 이러한 최적화를 대체하지 않으며, 사용자 입력에 대한 반응성을 유지하기 위한 별도의 수단입니다.

### 10.4. 여러 Transition의 처리

여러 Transition이 동시에 진행되는 경우 React는 현재 일부 Transition을 함께 일괄 처리합니다.

따라서 각 Transition의 진행 상태를 독립적으로 관리해야 하는 복잡한 상황에서는 이 동작을 고려해야 합니다.

### 10.5. 외부 시스템과의 부수 효과

Transition은 렌더링 우선순위에 영향을 주므로 렌더링이 중단되거나 재시작될 수 있습니다.

따라서 컴포넌트의 Render Phase에서 네트워크 요청, 외부 Store 변경, DOM 직접 조작과 같은 부수 효과를 실행해서는 안 됩니다.

부수 효과는 이벤트 핸들러나 Effect 등 적절한 위치에서 실행해야 합니다.

## 11. 버전 및 API 지원 범위

Transition 관련 API는 React 버전에 따라 지원 범위가 다릅니다. 특히 Async Transition과 View Transition은 도입 시점과 안정화 시점을 구분해야 합니다.

### 11.1. React 18

React 18에서는 다음 API를 사용할 수 있습니다.

- `startTransition`
- `useTransition`
- `useDeferredValue`
- Concurrent Rendering 기반의 Transition 처리
- Suspense와 Transition의 연계

React 18의 Transition은 기본적으로 동기적인 상태 업데이트를 비긴급 업데이트로 표시하는 데 사용합니다.

React 18에서는 `startTransition`에 비동기 함수를 전달하여 React 19의 Actions와 동일한 방식으로 처리할 수 없습니다.

### 11.2. React 19

React 19에서는 기존 Transition 기능에 더해 비동기 함수를 지원하는 Async Transition과 Actions가 도입되었습니다.

주요 특징은 다음과 같습니다.

- `startTransition` 내부에서 비동기 함수 사용
- 비동기 작업이 진행되는 동안 Pending State 관리
- Actions를 활용한 상태 변경 작업 구성
- `useOptimistic`, `useActionState`, Form Actions와의 연계

다만 `await` 이후의 상태 업데이트는 현재 별도의 `startTransition`으로 감싸야 하는 제한이 있습니다.

### 11.3. React 19.3

React 19.3에서는 `<ViewTransition>` API가 안정화되었습니다.

`<ViewTransition>`은 Transition으로 표시된 업데이트에 브라우저의 View Transition API를 연계하여 화면 요소의 등장, 제거, 변경 등을 애니메이션으로 표현합니다.

React 19.3 이전에는 해당 API가 실험적인 배포 채널에서 제공되었으므로 일반적인 안정 버전에서 사용할 수 있는 API와 구분해야 합니다.

### 11.4. 버전별 비교

| 기능 | React 18 | React 19 | React 19.3 |
| --- | --- | --- | --- |
| `startTransition` | 지원 | 지원 | 지원 |
| `useTransition` | 지원 | 지원 | 지원 |
| `useDeferredValue` | 지원 | 지원 | 지원 |
| Async Transition / Actions | 미지원 | 지원 | 지원 |
| `<ViewTransition>` | 미지원 | 실험적 배포 채널에서 제공 | 안정화 |

실제 프로젝트에서는 설치된 React 버전과 사용하는 배포 채널을 확인해야 합니다. 특히 `<ViewTransition>`은 React 19.3부터 안정 API로 사용할 수 있으므로 React 18이나 React 19 초기 버전의 일반적인 안정 배포 환경과 구분해야 합니다.

## 12. 정리

Transition은 React에서 비긴급 상태 업데이트를 구분하여 사용자 인터페이스의 반응성을 유지하는 기능입니다.

핵심 개념은 다음과 같습니다.

1. **Urgent Update**는 사용자 입력과 같이 즉각적인 반응이 필요한 업데이트입니다.
2. **Transition Update**는 복잡한 화면 변경이나 검색 결과 렌더링처럼 상대적으로 늦게 처리해도 되는 업데이트입니다.
3. `startTransition`은 특정 상태 업데이트를 Transition으로 표시하는 독립적인 API입니다.
4. `useTransition`은 Transition을 시작하면서 `isPending`으로 진행 상태를 확인할 수 있는 Hook입니다.
5. Transition으로 표시된 렌더링 작업은 더 긴급한 업데이트에 의해 중단되고 다시 시작될 수 있습니다.
6. Suspense와 결합하면 새로운 콘텐츠가 준비되는 동안 기존 콘텐츠를 유지하는 사용자 경험을 구현할 수 있습니다.
7. React 19부터 Async Transition과 Actions를 통해 비동기 데이터 변경 작업을 Transition 모델과 연계할 수 있습니다.
8. React 19.3부터 `<ViewTransition>`을 안정적으로 사용할 수 있으며, 화면 변경에 애니메이션을 적용할 수 있습니다.
9. React Transition은 애니메이션 기능이 아니며, 렌더링 작업의 우선순위를 조정하는 기능입니다.

Transition은 단순히 화면 업데이트를 지연하는 기능이 아니라, 사용자 입력과 복잡한 렌더링 작업 사이의 우선순위를 조정하여 React 애플리케이션의 반응성을 유지하는 메커니즘입니다.

## 참고 자료

- [React 공식 문서 - startTransition](https://react.dev/reference/react/startTransition)
- [React 공식 문서 - useTransition](https://react.dev/reference/react/useTransition)
- [React 공식 문서 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [React 공식 문서 - Suspense](https://react.dev/reference/react/Suspense)
- [React 공식 문서 - ViewTransition](https://react.dev/reference/react/ViewTransition)
- [React 공식 블로그 - React 18](https://react.dev/blog/2022/03/29/react-v18)
- [React 공식 블로그 - React 19](https://react.dev/blog/2024/12/05/react-19)
- [React 공식 블로그 - React 19.3](https://react.dev/blog/2026/09/09/react-19-3)