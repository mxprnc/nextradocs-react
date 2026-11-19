# Profiling

## 1. Profiling이란?

Profiling은 애플리케이션의 실행 과정에서 발생하는 성능 지표를 측정하고 분석하여 병목 지점을 식별하는 과정입니다.

React 애플리케이션에서는 컴포넌트의 렌더링 횟수, 렌더링에 소요된 시간, Commit 발생 시점 등을 분석하여 성능 저하의 원인을 파악할 수 있습니다.

컴포넌트가 자주 렌더링된다는 사실만으로 성능 문제가 있다고 판단할 수는 없습니다. 렌더링 작업이 실제로 얼마나 많은 비용을 발생시키는지, 사용자가 체감하는 지연과 어떤 관계가 있는지를 함께 분석해야 합니다.

### Profiling의 주요 목적

- **렌더링 병목 식별**: 렌더링에 많은 시간이 소요되는 컴포넌트를 찾습니다.
- **불필요한 렌더링 분석**: Props, State, Context 변경으로 인해 발생하는 렌더링을 분석합니다.
- **최적화 효과 검증**: `React.memo`, `useMemo`, `useCallback` 등의 적용 전후 성능을 비교합니다.
- **성능 회귀 탐지**: 코드 변경 이후 특정 화면이나 기능의 성능이 저하되었는지 확인합니다.
- **실행 환경 분석**: React 렌더링뿐 아니라 JavaScript 실행, 네트워크 요청, 브라우저 렌더링 작업을 함께 분석합니다.

Profiling은 최적화 기법을 적용하기 전에 문제를 측정하고, 최적화 이후 실제 개선 여부를 확인하는 데 사용합니다.

## 2. React 렌더링 과정과 Profiling

React의 렌더링 과정은 크게 Trigger, Render, Commit 단계로 구분할 수 있습니다.

### Trigger

State 변경, 부모 컴포넌트의 렌더링, Context 변경 등의 이유로 React가 렌더링 작업을 시작합니다.

### Render

React가 컴포넌트를 호출하여 새로운 React Element를 계산하고, 이전 렌더링 결과와 비교할 작업을 수행합니다.

이 과정에서 컴포넌트 함수의 실행과 계산 비용이 발생합니다.

### Commit

React가 렌더링 결과를 실제 DOM에 반영합니다.

필요한 DOM 변경을 적용하고 관련 작업을 수행합니다.

### Profiling에서 구분해야 하는 개념

| 개념 | 설명 |
|---|---|
| Render | 컴포넌트가 호출되고 새로운 렌더링 결과를 계산하는 과정입니다. |
| Commit | 계산된 변경 사항을 실제 DOM에 반영하는 과정입니다. |
| Re-render | 기존에 렌더링된 컴포넌트가 다시 렌더링되는 현상입니다. |
| DOM Update | 실제 DOM 노드에 변경 사항이 적용되는 작업입니다. |
| Mount | 컴포넌트가 처음으로 렌더링되어 화면에 추가되는 과정입니다. |
| Update | 기존 컴포넌트가 새로운 Props, State 등의 변경에 따라 갱신되는 과정입니다. |

렌더링 횟수와 DOM 변경 횟수는 동일하지 않습니다.

컴포넌트가 다시 렌더링되더라도 이전 결과와 차이가 없다면 실제 DOM 변경은 발생하지 않을 수 있습니다.

따라서 렌더링 횟수만으로 성능 문제를 판단하지 않고, 렌더링에 소요된 시간과 Commit 결과를 함께 분석해야 합니다.

## 3. React Developer Tools Profiler

React Developer Tools는 React 애플리케이션의 컴포넌트 구조와 렌더링 성능을 분석할 수 있는 브라우저 확장 도구입니다.

Chrome, Firefox, Edge 등의 브라우저에서 사용할 수 있으며, 개발자 도구에 Components와 Profiler 패널을 제공합니다.

### Profiler 사용 방법

1. React Developer Tools 브라우저 확장 프로그램을 설치합니다.
2. React 애플리케이션을 실행합니다.
3. 브라우저 개발자 도구를 엽니다.
4. Profiler 탭으로 이동합니다.
5. Record 버튼을 눌러 성능 측정을 시작합니다.
6. 분석하려는 사용자 동작을 수행합니다.
7. Record를 종료하고 측정 결과를 확인합니다.

예를 들어 다음과 같은 동작을 측정할 수 있습니다.

- 검색어 입력에 따른 리스트 갱신
- 탭 전환에 따른 화면 변경
- 모달 열기 및 닫기
- 대량의 데이터를 포함한 테이블 갱신
- 복잡한 차트 컴포넌트의 렌더링

실제 사용자가 수행하는 동작을 재현하여 측정하면 어떤 작업에서 렌더링 비용이 증가하는지 파악할 수 있습니다.

### Profiler 주요 화면

React Developer Tools Profiler는 여러 시각화 기능을 제공합니다.

#### Flamegraph

Flamegraph는 특정 Commit에서 렌더링된 컴포넌트의 계층 구조와 렌더링 비용을 시각적으로 표현합니다.

- 각 영역은 컴포넌트를 나타냅니다.
- 영역의 너비는 해당 컴포넌트와 하위 컴포넌트의 렌더링 시간 정보를 반영합니다.
- 색상은 컴포넌트의 렌더링 비용을 구분하는 데 사용됩니다.
- 특정 컴포넌트를 선택하면 관련 렌더링 정보를 확인할 수 있습니다.

Flamegraph를 사용하면 렌더링 비용이 큰 컴포넌트가 어디에 위치하는지 파악할 수 있습니다.

#### Ranked Chart

Ranked Chart는 선택한 Commit에서 렌더링 비용이 큰 컴포넌트를 기준으로 정렬하여 보여줍니다.

Flamegraph가 컴포넌트의 계층 구조를 파악하는 데 유용하다면, Ranked Chart는 상대적으로 비용이 큰 컴포넌트를 빠르게 찾는 데 유용합니다.

#### Commit 정보

Profiler는 애플리케이션에서 발생한 Commit을 기록하고 각 Commit의 렌더링 비용을 확인할 수 있도록 합니다.

특정 Commit을 선택하면 해당 시점에 렌더링된 컴포넌트와 관련 시간 정보를 분석할 수 있습니다.

#### Why did this render?

React Developer Tools의 설정에 따라 컴포넌트가 다시 렌더링된 이유를 확인할 수 있습니다.

대표적으로 다음과 같은 변경 사항을 분석할 수 있습니다.

- Props 변경
- State 변경
- Context 변경
- 부모 컴포넌트의 렌더링

이 정보는 불필요한 렌더링이 발생하는 원인을 추적하는 데 도움이 됩니다.

## 4. Profiler API

React는 `<Profiler>` 컴포넌트를 제공하여 React 트리의 렌더링 성능을 프로그래밍 방식으로 측정할 수 있도록 지원합니다.

React Developer Tools가 개발자에게 시각적인 분석 환경을 제공한다면, Profiler API는 애플리케이션 코드에서 렌더링 측정값을 수집할 수 있도록 합니다.

### 기본 사용법

```tsx
import { Profiler } from 'react';
import type { ProfilerOnRenderCallback } from 'react';

const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
  });
};

function App() {
  return (
    <Profiler id="App" onRender={onRender}>
      <Dashboard />
    </Profiler>
  );
}

export default App;
```

`Profiler`는 두 가지 필수 Props를 사용합니다.

| Prop | 설명 |
|---|---|
| `id` | 측정 대상 Profiler 트리를 식별하는 문자열입니다. |
| `onRender` | 하위 트리의 Commit이 발생할 때 호출되는 Callback입니다. |

`onRender`는 측정 대상 트리에서 Commit이 발생할 때 호출됩니다.

따라서 컴포넌트 함수가 호출될 때마다 무조건 호출되는 Callback은 아닙니다.

### onRender Callback 매개변수

`onRender`는 다음 여섯 가지 매개변수를 전달받습니다.

| 매개변수 | 설명 |
|---|---|
| `id` | Commit이 발생한 Profiler 트리의 식별자입니다. |
| `phase` | 렌더링 단계입니다. `mount`, `update`, `nested-update` 중 하나입니다. |
| `actualDuration` | 현재 Commit을 위해 Profiler 하위 트리를 렌더링하는 데 소요된 시간입니다. |
| `baseDuration` | 메모이제이션 최적화가 적용되지 않았다고 가정할 때 하위 트리를 렌더링하는 데 예상되는 시간입니다. |
| `startTime` | React가 해당 렌더링 작업을 시작한 시점입니다. |
| `commitTime` | 해당 렌더링 작업의 Commit이 발생한 시점입니다. |

시간 값은 밀리초 단위입니다.

#### actualDuration

`actualDuration`은 현재 업데이트에서 실제로 렌더링 작업에 소요된 시간을 나타냅니다.

React.memo 등의 메모이제이션 최적화가 효과적으로 적용되면 일부 하위 컴포넌트의 렌더링 작업이 생략되어 값이 감소할 수 있습니다.

#### baseDuration

`baseDuration`은 하위 트리의 각 컴포넌트가 마지막으로 렌더링되었을 때 측정한 렌더링 비용을 기반으로 계산한 예상 시간입니다.

메모이제이션이 적용되지 않아 전체 하위 트리를 다시 렌더링한다고 가정했을 때의 비용을 추정하는 데 활용할 수 있습니다.

#### 두 값의 비교

일반적으로 다음과 같이 해석할 수 있습니다.

- `actualDuration`이 `baseDuration`보다 상당히 작다면 메모이제이션 등의 최적화가 렌더링 작업을 줄이고 있을 가능성이 있습니다.
- 두 값이 비슷하다면 해당 업데이트에서 하위 트리의 렌더링 작업이 대부분 수행되었을 가능성이 있습니다.

다만 두 값은 동일한 조건에서 측정한 전체 사용자 체감 시간이 아니므로 단순 비율만으로 성능 개선 정도를 확정해서는 안 됩니다.

### phase

`phase`는 해당 Commit이 어떤 렌더링 단계에서 발생했는지 나타냅니다.

| 값 | 설명 |
|---|---|
| `mount` | 해당 트리가 처음으로 마운트되었습니다. |
| `update` | 기존 트리가 업데이트되었습니다. |
| `nested-update` | Commit 과정에서 발생한 중첩 업데이트와 관련된 렌더링입니다. |

이 값을 활용하면 최초 렌더링 비용과 이후 업데이트 비용을 구분할 수 있습니다.

## 5. Profiler를 활용한 영역별 성능 측정

애플리케이션 전체를 하나의 Profiler로 감싸는 것뿐 아니라 특정 기능이나 영역을 구분하여 측정할 수도 있습니다.

### 영역별 Profiling

```tsx
import { Profiler } from 'react';

function App() {
  return (
    <div>
      <Profiler id="Header" onRender={onRender}>
        <Header />
      </Profiler>

      <Profiler id="Dashboard" onRender={onRender}>
        <Dashboard />
      </Profiler>

      <Profiler id="Sidebar" onRender={onRender}>
        <Sidebar />
      </Profiler>
    </div>
  );
}
```

각 Profiler에 서로 다른 `id`를 지정하면 영역별 렌더링 비용을 구분하여 수집할 수 있습니다.

이를 통해 특정 페이지의 어느 영역에서 렌더링 비용이 많이 발생하는지 파악할 수 있습니다.

### 중첩 Profiling

Profiler는 중첩하여 사용할 수도 있습니다.

```tsx
function Dashboard() {
  return (
    <Profiler id="Dashboard" onRender={onRender}>
      <DashboardHeader />

      <Profiler id="Chart" onRender={onRender}>
        <Chart />
      </Profiler>

      <Profiler id="DataTable" onRender={onRender}>
        <DataTable />
      </Profiler>
    </Profiler>
  );
}
```

이 구조에서는 Dashboard 전체와 Chart, DataTable 영역의 렌더링 성능을 각각 측정할 수 있습니다.

중첩된 Profiler에서는 동일한 Commit에 대해 상위와 하위 Profiler의 Callback이 모두 호출될 수 있습니다. 측정값을 집계할 때 중복 합산하지 않도록 주의해야 합니다.

## 6. Browser Performance와 React Profiling

React Developer Tools의 Profiler는 React 컴포넌트의 렌더링 비용을 분석하는 데 특화되어 있습니다.

하지만 실제 웹 애플리케이션의 성능은 React 렌더링만으로 결정되지 않습니다.

다음과 같은 작업도 사용자 체감 성능에 영향을 줍니다.

- JavaScript 실행 및 계산
- 네트워크 요청과 응답
- 브라우저의 Style Recalculation
- Layout 및 Paint
- 이미지 및 폰트 다운로드
- 메인 스레드의 장시간 작업

따라서 React Profiler와 브라우저 Performance 도구를 함께 활용하는 것이 좋습니다.

### Chrome DevTools Performance

Chrome DevTools의 Performance 패널은 브라우저에서 발생하는 실행 작업을 시간순으로 기록하고 분석할 수 있습니다.

#### 사용 방법

1. Chrome 개발자 도구를 엽니다.
2. Performance 패널로 이동합니다.
3. Record 버튼을 눌러 기록을 시작합니다.
4. 분석할 사용자 동작을 수행합니다.
5. 기록을 종료합니다.
6. Main Thread, Network, Rendering 등의 트랙을 확인합니다.

#### 주요 분석 대상

| 항목 | 분석 내용 |
|---|---|
| Main Thread | JavaScript 실행과 브라우저 작업이 집중되는 구간을 확인합니다. |
| Scripting | JavaScript 실행에 소요되는 시간을 분석합니다. |
| Rendering | 브라우저의 렌더링 관련 작업을 확인합니다. |
| Painting | 실제 화면을 그리는 작업을 분석합니다. |
| Network | 리소스 다운로드와 API 요청의 흐름을 확인합니다. |
| Long Tasks | 메인 스레드를 장시간 점유하는 작업을 식별합니다. |

### React Performance Tracks

React는 브라우저 Performance 패널에서 React 전용 트랙을 확인할 수 있는 기능을 제공합니다.

React Performance Tracks는 React의 렌더링 작업과 브라우저의 실행 활동을 동일한 시간축에서 분석할 수 있도록 합니다.

주요 트랙은 다음과 같습니다.

- **Scheduler Track**: React Scheduler의 작업 및 우선순위 관련 정보를 확인합니다.
- **Components Track**: React 컴포넌트의 렌더링과 Commit 관련 정보를 확인합니다.
- **Server Tracks**: 지원되는 개발 환경에서 서버 컴포넌트 및 서버 요청 관련 정보를 확인합니다.

React Performance Tracks는 React 개발 빌드와 프로파일링 빌드에서 사용할 수 있으며, 제공되는 트랙은 빌드 종류와 환경에 따라 달라집니다.

이를 활용하면 특정 컴포넌트의 렌더링 지연이 JavaScript 실행 때문인지, 네트워크 요청 때문인지, 브라우저 렌더링 작업 때문인지 구분하는 데 도움이 됩니다.

## 7. Profiling을 활용한 성능 최적화 사례

Profiling은 측정 결과를 기반으로 최적화 대상을 선정하는 데 사용합니다.

다음은 React 애플리케이션에서 자주 발생하는 성능 문제와 분석 방법입니다.

### 7.1 불필요한 자식 컴포넌트 렌더링

부모 컴포넌트의 State가 변경될 때 자식 컴포넌트도 다시 렌더링될 수 있습니다.

```tsx
import { useState } from 'react';

function UserProfile() {
  console.log('UserProfile rendered');

  return <div>사용자 프로필</div>;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <UserProfile />
    </div>
  );
}
```

위 예제에서는 `count`가 변경될 때 `App`이 다시 렌더링되며 `UserProfile`도 다시 렌더링됩니다.

Profiler를 사용하면 해당 업데이트에서 `UserProfile`의 렌더링이 실제로 발생하는지 확인할 수 있습니다.

자식 컴포넌트가 무거운 렌더링 작업을 수행한다면 `React.memo` 등의 최적화를 검토할 수 있습니다.

### 7.2 비용이 큰 계산 작업

컴포넌트 내부에서 수행하는 계산이 오래 걸리면 렌더링 성능이 저하될 수 있습니다.

```tsx
function ProductList({ products }: { products: Product[] }) {
  const filteredProducts = products
    .filter((product) => product.active)
    .sort((a, b) => a.price - b.price);

  return (
    <ul>
      {filteredProducts.map((product) => (
        <li key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
}
```

데이터의 크기가 크거나 계산 과정이 복잡하다면 렌더링이 발생할 때마다 상당한 비용이 발생할 수 있습니다.

Profiler에서 해당 컴포넌트의 `actualDuration`이 높게 나타나는지 확인한 후 `useMemo` 등의 최적화를 검토할 수 있습니다.

```tsx
import { useMemo } from 'react';

function ProductList({ products }: { products: Product[] }) {
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product.active)
      .sort((a, b) => a.price - b.price);
  }, [products]);

  return (
    <ul>
      {filteredProducts.map((product) => (
        <li key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
}
```

단, 계산 비용이 충분히 크지 않다면 메모이제이션으로 얻는 이점보다 캐시 관리 비용이 더 클 수 있으므로 측정 결과를 기준으로 적용해야 합니다.

### 7.3 대량의 리스트 렌더링

수천 개의 항목을 한 번에 렌더링하면 많은 컴포넌트와 DOM 노드가 생성되어 성능이 저하될 수 있습니다.

```tsx
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

Profiler와 Browser Performance를 활용하면 대량의 리스트를 렌더링하는 시점에 비용이 증가하는지 확인할 수 있습니다.

필요하다면 다음과 같은 최적화를 검토할 수 있습니다.

- Pagination
- Infinite Scroll
- Virtualization
- 리스트 항목 컴포넌트 분리

Virtualization은 실제 Viewport에 표시되는 항목과 주변 항목만 렌더링하여 DOM 노드와 렌더링 작업량을 줄이는 기법입니다.

### 7.4 최적화 전후 비교

Profiling은 최적화가 실제로 효과가 있었는지 검증하는 데도 사용합니다.

예를 들어 특정 컴포넌트에 `React.memo`를 적용하기 전과 후의 렌더링 비용을 비교할 수 있습니다.

| 비교 항목 | 최적화 전 | 최적화 후 |
|---|---|---|
| 컴포넌트 렌더링 횟수 | 측정값 기록 | 측정값 기록 |
| actualDuration | 측정값 기록 | 측정값 기록 |
| baseDuration | 측정값 기록 | 측정값 기록 |
| Commit 횟수 | 측정값 기록 | 측정값 기록 |
| 사용자 체감 지연 | 측정값 기록 | 측정값 기록 |

최적화 적용 후 특정 컴포넌트의 렌더링 비용이 감소하더라도 전체 사용자 경험이 개선되었다고 단정할 수는 없습니다.

브라우저의 JavaScript 실행 시간과 화면 업데이트, 네트워크 지연 등도 함께 확인해야 합니다.

## 8. Development와 Production 환경의 차이

React의 Development 빌드는 개발 과정에서 필요한 경고와 검증 작업을 수행하기 때문에 Production 빌드보다 실행 오버헤드가 클 수 있습니다.

또한 Strict Mode는 개발 환경에서 컴포넌트와 일부 로직을 추가로 실행하여 부수 효과가 없는지 확인합니다.

따라서 Development 환경에서 측정한 렌더링 횟수와 실행 시간은 Production 환경과 다를 수 있습니다.

### Strict Mode의 영향

```tsx
import { StrictMode } from 'react';

function App() {
  return (
    <StrictMode>
      <Dashboard />
    </StrictMode>
  );
}
```

Strict Mode는 개발 환경에서 일부 함수를 추가로 호출하여 예상하지 못한 부수 효과를 발견하도록 돕습니다.

이로 인해 개발 환경에서 컴포넌트 함수가 두 번 호출되는 것처럼 보일 수 있습니다.

이는 일반적으로 Strict Mode의 검증 동작과 관련된 것이며, 실제 Production 환경의 렌더링 동작과 동일하게 해석해서는 안 됩니다.

### Production Profiling

React의 일반적인 Production 빌드에서는 Profiling에 필요한 측정 기능이 기본적으로 비활성화되어 있습니다.

실제 운영 환경에서 React 렌더링 성능을 측정하려면 별도의 Profiling 빌드를 사용해야 합니다.

React DOM은 다음과 같은 Profiling 빌드를 제공합니다.

```tsx
import { createRoot } from 'react-dom/profiling';
```

실제 적용 시에는 번들러의 Alias 설정 등을 통해 `react-dom/client`를 `react-dom/profiling`으로 대체할 수 있습니다.

다만 프로젝트의 빌드 도구와 프레임워크에 따라 설정 방법이 달라질 수 있으므로 공식 문서를 확인해야 합니다.

Production Profiling 빌드는 일반 Production 빌드와 동일한 성능 특성을 보장하지 않습니다. 측정 기능 자체가 추가 오버헤드를 발생시킬 수 있으므로 이를 고려해야 합니다.

## 9. Profiling 측정 시 주의사항

### 9.1 렌더링 횟수만으로 판단하지 않습니다.

렌더링 횟수가 많더라도 각 렌더링 작업이 매우 가볍다면 실제 성능 문제로 이어지지 않을 수 있습니다.

반대로 렌더링 횟수가 적더라도 한 번의 렌더링에서 복잡한 계산이 수행되면 성능 저하가 발생할 수 있습니다.

렌더링 횟수와 소요 시간을 함께 분석해야 합니다.

### 9.2 실제 사용자 동작을 기준으로 측정합니다.

임의의 컴포넌트 렌더링만 측정하는 것보다 실제 사용자가 수행하는 동작을 재현하는 것이 유용합니다.

예를 들어 검색 기능이라면 다음 과정을 측정할 수 있습니다.

1. 검색 페이지에 진입합니다.
2. 검색어를 입력합니다.
3. 검색 결과가 갱신되는 과정을 확인합니다.
4. 결과 항목을 선택합니다.
5. 다른 검색어로 다시 검색합니다.

이러한 과정을 반복하여 실제 사용 흐름에서 성능 문제가 발생하는 지점을 확인합니다.

### 9.3 동일한 조건에서 비교합니다.

최적화 전후 성능을 비교할 때는 가능한 한 동일한 환경과 조건을 유지해야 합니다.

- 동일한 브라우저와 기기
- 동일한 데이터 크기
- 동일한 사용자 동작
- 동일한 네트워크 및 CPU 환경
- 동일한 빌드 설정

한 번의 측정 결과만으로 성능 개선 여부를 판단하지 않고 여러 번 측정한 결과를 함께 검토하는 것이 좋습니다.

### 9.4 Profiling 오버헤드를 고려합니다.

Profiler API와 개발자 도구는 성능 측정을 위해 추가적인 작업을 수행합니다.

따라서 측정 도구를 활성화한 상태의 결과가 도구를 사용하지 않는 일반 실행 환경과 완전히 동일하지는 않습니다.

Profiling 결과는 병목 지점을 파악하는 데 활용하고, 실제 사용자 성능은 별도의 Production 환경 측정과 함께 판단해야 합니다.

### 9.5 측정 결과를 기준으로 최적화합니다.

렌더링 횟수가 많다는 이유만으로 모든 컴포넌트에 `React.memo`를 적용하거나 모든 계산에 `useMemo`를 사용하는 방식은 권장하지 않습니다.

최적화는 다음 순서로 진행하는 것이 좋습니다.

1. 성능 문제가 발생하는 사용자 동작을 식별합니다.
2. Profiler로 렌더링 비용이 큰 영역을 찾습니다.
3. Browser Performance로 JavaScript 및 브라우저 작업을 분석합니다.
4. 병목의 원인을 확인합니다.
5. 적절한 최적화 기법을 적용합니다.
6. 동일한 조건에서 다시 측정합니다.
7. 실제 개선 여부와 부작용을 확인합니다.

## 10. Profiling 도구 비교

| 도구 | 주요 목적 | 분석 대상 |
|---|---|---|
| React Developer Tools Profiler | React 컴포넌트의 렌더링 분석 | Commit, 컴포넌트별 렌더링 비용 |
| React Profiler API | 코드 기반 렌더링 측정 | actualDuration, baseDuration, Commit 시점 |
| Chrome DevTools Performance | 브라우저 실행 성능 분석 | JavaScript, Rendering, Painting, Network |
| React Performance Tracks | React와 브라우저 작업의 통합 분석 | Scheduler, Components, 브라우저 실행 흐름 |
| Lighthouse | 페이지의 전반적인 성능 평가 | Core Web Vitals 및 성능 개선 항목 |

각 도구는 분석 대상과 목적이 다르므로 성능 문제의 특성에 따라 함께 활용하는 것이 좋습니다.

## 11. Profiling과 관련 개념

| 개념 | 설명 |
|---|---|
| Rendering Optimization | 렌더링 비용을 줄이기 위한 최적화 기법입니다. |
| Memoization | 계산 결과나 함수 참조를 재사용하여 불필요한 작업을 줄이는 기법입니다. |
| React.memo | Props가 변경되지 않은 경우 컴포넌트의 불필요한 렌더링을 생략할 수 있도록 합니다. |
| useMemo | 계산 결과를 메모이제이션합니다. |
| useCallback | 함수 참조를 메모이제이션합니다. |
| React Compiler | 컴파일 시점에 자동 메모이제이션을 적용할 수 있습니다. |
| Virtualization | 화면에 필요한 항목만 렌더링하여 대량의 리스트 렌더링 비용을 줄입니다. |
| Core Web Vitals | 실제 사용자 경험을 평가하는 주요 웹 성능 지표입니다. |

Profiling은 위 최적화 기법을 직접 수행하는 기능이 아니라, 어떤 최적화가 필요한지 판단하고 적용 결과를 검증하기 위한 측정 및 분석 과정입니다.

## 12. 참고 자료

### React 공식 문서

- [React - Profiler](https://react.dev/reference/react/Profiler)
- [React - React Developer Tools](https://react.dev/learn/react-developer-tools)
- [React - React Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks)
- [React - React Compiler](https://react.dev/learn/react-compiler)

### Browser Performance

- [Chrome DevTools - Performance Overview](https://developer.chrome.com/docs/devtools/performance/overview)
- [Chrome DevTools - Performance Insights](https://developer.chrome.com/docs/devtools/performance-insights)
- [Chrome DevTools - Performance Monitor](https://developer.chrome.com/docs/devtools/performance-monitor)

### Web Performance

- [web.dev - Web Vitals](https://web.dev/articles/vitals)
- [web.dev - Optimize INP](https://web.dev/articles/optimize-inp)
- [web.dev - Optimize LCP](https://web.dev/articles/optimize-lcp)