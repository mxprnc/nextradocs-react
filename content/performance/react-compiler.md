# React Compiler

## 1. React Compiler란?

React Compiler는 React 컴포넌트와 Hook을 분석하여 메모이제이션을 자동으로 적용하는 빌드 시점 컴파일러입니다.

기존 React에서는 불필요한 렌더링을 줄이거나 계산 결과를 재사용하기 위해 개발자가 다음 API를 직접 활용해야 했습니다.

- `React.memo`: Props가 변경되지 않은 컴포넌트의 불필요한 렌더링을 생략합니다.
- `useMemo`: 계산 결과를 메모이제이션합니다.
- `useCallback`: 함수 참조를 메모이제이션합니다.

이러한 API는 성능 최적화에 유용하지만, 의존성 배열을 직접 관리해야 하고 객체나 함수의 참조 안정성을 고려해야 한다는 부담이 있습니다.

React Compiler는 컴포넌트와 Hook의 코드를 정적으로 분석하여 필요한 메모이제이션을 자동으로 적용합니다.

### 주요 목적

- **자동 메모이제이션**: 컴포넌트, 계산 결과, 함수 및 JSX 등의 재사용을 자동으로 최적화합니다.
- **불필요한 렌더링 감소**: 변경되지 않은 하위 컴포넌트의 불필요한 렌더링 작업을 줄입니다.
- **코드 복잡도 감소**: 수동으로 작성해야 하는 `useMemo`, `useCallback`, `React.memo`의 사용을 줄입니다.
- **최적화 일관성 개선**: 개발자의 수동 메모이제이션에 의존하지 않고 컴파일러가 코드 구조를 분석하여 최적화를 수행합니다.

React Compiler는 React의 기존 프로그래밍 모델을 변경하지 않습니다. 일반적인 React 컴포넌트와 Hook을 작성하면 컴파일 과정에서 최적화된 코드가 생성됩니다.

## 2. React Compiler의 동작 원리

React Compiler는 애플리케이션의 빌드 과정에서 React 컴포넌트와 Hook을 분석하고 최적화된 코드를 생성합니다.

일반적인 실행 흐름은 다음과 같습니다.

1. 개발자가 React 컴포넌트와 Hook을 작성합니다.
2. 빌드 과정에서 React Compiler가 소스 코드를 분석합니다.
3. 컴포넌트와 Hook의 데이터 흐름 및 의존 관계를 파악합니다.
4. 불필요한 계산이나 렌더링을 줄일 수 있는 위치에 메모이제이션을 적용합니다.
5. 최적화된 JavaScript 코드가 빌드 결과물에 포함됩니다.
6. 브라우저에서는 생성된 코드를 실행합니다.

React Compiler는 런타임에서 매번 컴포넌트의 최적화 여부를 판단하는 방식이 아니라, 빌드 시점에 코드를 분석하고 최적화 로직을 생성하는 방식입니다.

### 2.1 컴포넌트 렌더링 최적화

일반적으로 부모 컴포넌트가 다시 렌더링되면 자식 컴포넌트도 다시 렌더링될 수 있습니다.

```tsx
import { useState } from 'react';

function UserProfile({ name }: { name: string }) {
  console.log('UserProfile rendered');

  return <div>{name}</div>;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <UserProfile name="React" />
    </div>
  );
}
```

위 예제에서 `count`가 변경되면 `App`이 다시 렌더링됩니다. 이에 따라 `UserProfile`도 다시 렌더링될 수 있습니다.

기존에는 `React.memo`를 사용하여 이를 최적화할 수 있었습니다.

```tsx
import { memo, useState } from 'react';

const UserProfile = memo(
  function UserProfile({ name }: { name: string }) {
    return <div>{name}</div>;
  }
);
```

React Compiler를 적용하면 컴파일러가 컴포넌트 간 데이터 의존 관계를 분석하여 변경되지 않은 하위 렌더링 결과를 재사용하도록 최적화할 수 있습니다.

따라서 위와 같은 단순한 상황에서는 `React.memo`를 직접 작성하지 않아도 됩니다.

### 2.2 계산 결과 최적화

컴포넌트 내부에서 수행하는 계산도 자동으로 메모이제이션할 수 있습니다.

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

function ProductList({
  products,
}: {
  products: Product[];
}) {
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

기존에는 `useMemo`를 사용하여 계산 결과를 메모이제이션할 수 있었습니다.

```tsx
import { useMemo } from 'react';

function ProductList({
  products,
}: {
  products: Product[];
}) {
  const filteredProducts = useMemo(
    () =>
      products
        .filter((product) => product.active)
        .sort((a, b) => a.price - b.price),
    [products]
  );

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

React Compiler를 적용하면 컴파일러가 컴포넌트 내부의 계산과 의존 관계를 분석하여 필요한 경우 계산 결과를 자동으로 메모이제이션합니다.

따라서 단순히 성능 최적화를 목적으로 `useMemo`를 추가하는 작업을 줄일 수 있습니다.

### 2.3 함수와 객체 참조 최적화

React에서는 렌더링이 발생할 때 객체, 배열, 함수가 새롭게 생성될 수 있습니다.

```tsx
function ProductPage({ productId }: { productId: number }) {
  const options = {
    showPrice: true,
    currency: 'KRW',
  };

  const handleSelect = (id: number) => {
    console.log(id);
  };

  return (
    <ProductDetail
      productId={productId}
      options={options}
      onSelect={handleSelect}
    />
  );
}
```

기존에는 객체와 함수의 참조를 안정화하기 위해 `useMemo`와 `useCallback`을 사용하기도 했습니다.

React Compiler는 컴포넌트 내부의 데이터 흐름을 분석하여 이러한 참조를 필요한 범위에서 재사용하도록 최적화할 수 있습니다.

따라서 컴파일러가 적용된 환경에서는 객체와 함수가 선언될 때마다 새로운 참조가 만들어지는 문제를 수동으로 관리해야 하는 부담이 줄어듭니다.

## 3. React Compiler가 최적화하는 범위

React Compiler의 자동 메모이제이션은 주로 다음 두 가지 영역에 집중합니다.

### 3.1 연쇄적인 리렌더링 방지

부모 컴포넌트가 다시 렌더링되더라도 변경되지 않은 자식 컴포넌트의 렌더링 결과를 재사용할 수 있습니다.

```tsx
function FriendList({
  friends,
}: {
  friends: Friend[];
}) {
  const onlineCount = useFriendOnlineCount();

  return (
    <div>
      <span>{onlineCount}명 온라인</span>

      {friends.map((friend) => (
        <FriendListCard
          key={friend.id}
          friend={friend}
        />
      ))}

      <MessageButton />
    </div>
  );
}
```

예를 들어 온라인 사용자 수가 변경되어 `FriendList`가 다시 렌더링되더라도, 친구 목록 데이터가 변경되지 않았다면 관련 하위 렌더링 결과를 재사용할 수 있습니다.

이러한 최적화는 컴포넌트 전체를 무조건 다시 렌더링하는 대신 변경된 데이터에 영향을 받는 영역을 중심으로 렌더링 작업을 줄이는 데 도움이 됩니다.

### 3.2 렌더링 과정의 계산 최적화

컴포넌트 또는 Hook 내부에서 수행하는 계산도 최적화 대상이 될 수 있습니다.

```tsx
function Dashboard({
  items,
}: {
  items: Item[];
}) {
  const summary = calculateDashboardSummary(items);

  return <DashboardView summary={summary} />;
}
```

`items`가 변경되지 않았고 다른 관련 의존 관계에도 변화가 없다면 계산 결과를 재사용하도록 최적화할 수 있습니다.

다만 React Compiler가 모든 JavaScript 함수를 전역적으로 메모이제이션하는 것은 아닙니다.

컴파일러의 최적화 대상은 React 컴포넌트와 Hook을 중심으로 하며, 일반 함수 자체를 여러 컴포넌트에서 공유하는 캐시로 자동 변환하지는 않습니다.

여러 컴포넌트에서 동일한 비용이 큰 함수를 반복적으로 호출한다면 별도의 캐싱 전략을 검토해야 합니다.

## 4. React Compiler 설치 및 설정

React Compiler는 빌드 과정에 통합하여 사용합니다.

현재 공식 문서에서는 React 19를 가장 적합한 환경으로 안내하고 있으며, React 17과 18도 추가 런타임 및 버전 설정을 통해 지원합니다.

### 4.1 패키지 설치

React Compiler의 Babel 플러그인을 개발 의존성으로 설치합니다.

```bash
npm install -D babel-plugin-react-compiler
```

또는 다음 패키지 관리자를 사용할 수 있습니다.

```bash
yarn add -D babel-plugin-react-compiler
```

```bash
pnpm add -D babel-plugin-react-compiler
```

### 4.2 Babel 설정

Babel을 사용하는 프로젝트에서는 `babel.config.js`에 React Compiler 플러그인을 추가합니다.

```js
module.exports = {
  plugins: [
    'babel-plugin-react-compiler',
    // 다른 Babel 플러그인
  ],
};
```

React Compiler는 Babel 플러그인 파이프라인에서 가장 먼저 실행되어야 합니다.

컴파일러가 원본 소스 코드를 분석해야 하므로 다른 Babel 변환 작업보다 앞에서 실행되도록 설정해야 합니다.

### 4.3 Vite 설정

Vite를 사용하는 경우에는 `@vitejs/plugin-react` 버전에 따라 설정 방식이 달라집니다.

`@vitejs/plugin-react` 6.0.0 이상에서는 `reactCompilerPreset`과 `@rolldown/plugin-babel`을 활용할 수 있습니다.

필요한 패키지를 설치합니다.

```bash
npm install -D babel-plugin-react-compiler @rolldown/plugin-babel
```

`vite.config.ts`를 다음과 같이 구성합니다.

```ts
import { defineConfig } from 'vite';
import react, {
  reactCompilerPreset,
} from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

export default defineConfig({
  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
});
```

기존 프로젝트에서 `@vitejs/plugin-react` 6.0.0 미만 버전을 사용한다면 다음과 같은 인라인 Babel 설정도 사용할 수 있습니다.

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
});
```

플러그인 버전에 따라 설정 API가 변경될 수 있으므로 프로젝트에서 사용하는 버전의 공식 문서를 확인해야 합니다.

### 4.4 React 17 및 18 지원

React Compiler는 React 17과 18에서도 사용할 수 있습니다.

다만 React 19와 달리 이전 버전에서는 Compiler Runtime 패키지와 대상 React 버전을 지정해야 합니다.

```bash
npm install -D babel-plugin-react-compiler
npm install react-compiler-runtime
```

Babel 설정 예제는 다음과 같습니다.

```js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler',
      {
        target: '18',
      },
    ],
  ],
};
```

`target`에는 프로젝트가 사용하는 React 버전에 맞게 `17` 또는 `18`을 지정합니다.

이전 React 버전을 지원하는 환경에서는 `react-compiler-runtime`의 설치 및 배포 방식도 함께 확인해야 합니다.

## 5. React Compiler와 ESLint

React Compiler는 React의 규칙을 준수하는 코드를 전제로 안전하게 최적화를 수행합니다.

컴파일러가 코드의 안전성을 확신할 수 없는 경우 해당 컴포넌트나 Hook의 최적화를 건너뛸 수 있습니다.

이를 사전에 확인하기 위해 `eslint-plugin-react-hooks`를 함께 사용하는 것이 좋습니다.

### 5.1 ESLint 플러그인 설치

```bash
npm install -D eslint-plugin-react-hooks
```

React Compiler 관련 규칙은 `recommended-latest` 프리셋을 통해 사용할 수 있습니다.

```js
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  reactHooks.configs.flat['recommended-latest'],
];
```

기존 ESLint 설정을 사용하고 있다면 프로젝트의 ESLint 구성 방식에 맞게 통합해야 합니다.

### 5.2 Rules of React 검사

ESLint 플러그인은 다음과 같은 문제를 식별하는 데 도움이 됩니다.

- Rules of React 위반
- 컴포넌트와 Hook의 잘못된 사용
- 렌더링 중 발생하는 부적절한 부수 효과
- 컴파일러가 최적화할 수 없는 코드 패턴

규칙 위반이 발견되더라도 반드시 전체 빌드가 실패하는 것은 아닙니다.

React Compiler는 안전하지 않다고 판단한 컴포넌트나 Hook의 최적화를 건너뛰고, 나머지 최적화 가능한 코드에 대해서는 계속 작업할 수 있습니다.

따라서 기존 코드베이스의 모든 위반 사항을 한 번에 수정하지 않더라도 점진적으로 도입할 수 있습니다.

## 6. React Compiler 적용 여부 확인

React Compiler를 설치하고 설정한 후에는 실제로 컴파일러가 동작하는지 확인해야 합니다.

### 6.1 React Developer Tools

React Developer Tools의 Components 패널에서 컴파일러가 최적화한 컴포넌트를 확인할 수 있습니다.

컴파일러가 적용된 컴포넌트에는 `Memo ✨` 표시가 나타납니다.

확인 절차는 다음과 같습니다.

1. React Developer Tools를 설치합니다.
2. 애플리케이션을 개발 환경에서 실행합니다.
3. 브라우저 개발자 도구에서 Components 패널을 엽니다.
4. 컴포넌트 목록에서 `Memo ✨` 표시를 확인합니다.

해당 표시를 통해 React Compiler가 컴포넌트에 자동 메모이제이션을 적용했는지 확인할 수 있습니다.

### 6.2 빌드 결과 확인

컴파일러가 실행되면 빌드된 코드에 자동 메모이제이션을 위한 런타임 로직이 포함될 수 있습니다.

예를 들어 다음과 같은 형태의 코드가 생성될 수 있습니다.

```tsx
import { c as _c } from 'react/compiler-runtime';

export default function MyApp() {
  const $ = _c(1);

  let t0;

  if ($[0] === Symbol.for('react.memo_cache_sentinel')) {
    t0 = <div>Hello World</div>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }

  return t0;
}
```

`react/compiler-runtime`은 컴파일러가 생성한 메모이제이션 로직을 실행하는 데 사용됩니다.

실제 생성 코드는 컴파일러 버전과 최적화 대상 코드에 따라 달라질 수 있습니다.

## 7. React Compiler와 기존 메모이제이션 API

React Compiler는 기존 메모이제이션 API를 대체하는 방향으로 설계되었지만, 기존 API를 사용할 수 없게 만드는 것은 아닙니다.

필요한 경우 개발자가 명시적으로 메모이제이션을 제어할 수 있습니다.

### 7.1 React.memo

기존에는 Props가 변경되지 않은 경우 자식 컴포넌트의 불필요한 렌더링을 줄이기 위해 `React.memo`를 사용했습니다.

```tsx
import { memo } from 'react';

const UserProfile = memo(
  function UserProfile({
    name,
  }: {
    name: string;
  }) {
    return <div>{name}</div>;
  }
);
```

React Compiler를 적용하면 컴파일러가 컴포넌트와 Props의 의존 관계를 분석하여 필요한 메모이제이션을 자동으로 적용할 수 있습니다.

따라서 단순히 렌더링 최적화를 목적으로 `React.memo`를 추가하는 코드는 줄일 수 있습니다.

### 7.2 useMemo

기존에는 계산 결과를 재사용하기 위해 `useMemo`를 사용했습니다.

```tsx
const filteredItems = useMemo(
  () => items.filter((item) => item.active),
  [items]
);
```

React Compiler는 컴포넌트 내부의 계산과 데이터 의존 관계를 분석하여 필요한 경우 계산 결과를 자동으로 메모이제이션합니다.

다만 컴파일러의 분석 범위와 별개로 특정 값의 재사용을 명시적으로 제어해야 하는 상황에서는 `useMemo`를 사용할 수 있습니다.

### 7.3 useCallback

기존에는 함수 참조를 안정화하기 위해 `useCallback`을 사용했습니다.

```tsx
const handleClick = useCallback(
  (id: number) => {
    onSelect(id);
  },
  [onSelect]
);
```

React Compiler는 함수와 해당 함수가 참조하는 값의 의존 관계를 분석하여 필요한 경우 함수 참조를 자동으로 재사용하도록 최적화합니다.

따라서 단순히 자식 컴포넌트에 전달하는 함수의 참조 안정성을 확보하기 위해 `useCallback`을 반복적으로 작성할 필요가 줄어듭니다.

### 7.4 기존 API와의 비교

| API | 기존 역할 | React Compiler 적용 시 |
|---|---|---|
| `React.memo` | Props 변경 여부에 따라 컴포넌트 렌더링 최적화 | 컴파일러가 필요한 메모이제이션을 자동 적용 |
| `useMemo` | 계산 결과 재사용 | 계산 결과와 의존 관계를 분석하여 자동 최적화 |
| `useCallback` | 함수 참조 재사용 | 함수와 참조 관계를 분석하여 자동 최적화 |
| React Compiler | 해당 없음 | 위 최적화 작업을 빌드 시점에 자동화 |

React Compiler가 적용되었다고 해서 기존 API를 모두 제거해야 하는 것은 아닙니다.

공식 문서에서는 신규 코드의 경우 컴파일러에 메모이제이션을 맡기고, 세밀한 제어가 필요한 부분에 `useMemo`와 `useCallback`을 사용하는 방향을 권장합니다.

기존 코드에서는 이미 작성된 메모이제이션을 그대로 유지하거나, 제거하려면 충분한 테스트를 거치는 것이 좋습니다.

## 8. React Compiler의 제어 지시어

React Compiler는 기본적으로 분석 가능한 컴포넌트와 Hook을 자동으로 최적화합니다.

그러나 점진적인 도입이나 특정 컴포넌트의 최적화 제어가 필요한 경우 지시어(Directive)를 활용할 수 있습니다.

### 8.1 use memo

`"use memo"`는 해당 컴포넌트 또는 Hook을 컴파일 대상으로 지정하는 지시어입니다.

```tsx
function UserProfile({ name }: { name: string }) {
  'use memo';

  return <div>{name}</div>;
}
```

특히 `compilationMode: 'annotation'` 설정을 사용하는 경우 이 지시어가 포함된 함수만 컴파일 대상으로 선택할 수 있습니다.

### 8.2 use no memo

`"use no memo"`는 특정 컴포넌트 또는 Hook에 대한 컴파일러 최적화를 제외하는 지시어입니다.

```tsx
function LegacyComponent() {
  'use no memo';

  return <div>Legacy Component</div>;
}
```

다음과 같은 상황에서 임시로 활용할 수 있습니다.

- 컴파일 이후 특정 컴포넌트에서 예상하지 못한 동작이 발생하는 경우
- 기존 코드와 컴파일러의 동작을 비교해야 하는 경우
- 문제의 원인이 컴파일러 최적화와 관련되어 있는지 확인해야 하는 경우

`"use no memo"`는 근본적인 문제를 해결하는 수단이 아닙니다.

문제가 해결되면 해당 지시어를 제거하고 컴파일러 최적화를 다시 적용하는 것이 좋습니다.

## 9. React Compiler의 점진적 도입

기존 애플리케이션에 React Compiler를 적용할 때는 전체 코드베이스에 한 번에 적용하기보다 점진적으로 도입하는 것이 좋습니다.

특히 오래된 코드베이스에서는 Rules of React를 위반하는 코드가 존재할 수 있으므로 적용 범위를 단계적으로 확대하는 전략이 유용합니다.

### 9.1 특정 영역부터 적용

초기에는 신규 기능이나 독립적인 디렉터리부터 적용할 수 있습니다.

예를 들어 다음과 같은 구조를 가정할 수 있습니다.

```text
src/
├── components/
│   ├── common/
│   └── legacy/
├── features/
│   ├── dashboard/
│   └── user/
└── pages/
```

신규 기능인 `dashboard` 영역부터 컴파일러를 적용하고, 안정성이 확인되면 적용 범위를 확대할 수 있습니다.

### 9.2 Annotation 모드 활용

`compilationMode: 'annotation'`을 사용하면 `"use memo"` 지시어가 포함된 컴포넌트와 Hook만 컴파일 대상으로 선택할 수 있습니다.

```js
module.exports = {
  plugins: [
    [
      'babel-plugin-react-compiler',
      {
        compilationMode: 'annotation',
      },
    ],
  ],
};
```

이 방식은 기존 코드베이스에서 컴파일 대상을 명시적으로 관리하고 싶을 때 유용합니다.

### 9.3 ESLint를 통한 코드 검증

`eslint-plugin-react-hooks`를 활용하여 Rules of React 위반 사항을 확인합니다.

컴파일러가 최적화할 수 없는 코드를 식별하고, 중요한 기능부터 문제를 수정해 나가는 방식으로 적용 범위를 확대할 수 있습니다.

### 9.4 최적화 결과 검증

컴파일러 적용 전후의 동작과 성능을 비교해야 합니다.

- 주요 사용자 시나리오 테스트
- 컴포넌트 렌더링 동작 확인
- Effect 실행 횟수 및 의존성 확인
- React Developer Tools를 통한 컴파일 여부 확인
- Profiler를 통한 렌더링 비용 비교
- Production 빌드의 동작 검증

컴파일러가 적용되었다는 사실만으로 성능 개선이 보장되는 것은 아닙니다. 실제 사용 흐름을 기준으로 결과를 확인해야 합니다.

## 10. React Compiler 적용 시 주의사항

### 10.1 Rules of React를 준수해야 합니다.

React Compiler는 React의 규칙을 기반으로 코드를 분석합니다.

다음과 같은 잘못된 패턴은 컴파일러가 최적화를 수행하지 못하게 하거나 예상하지 못한 동작을 발생시킬 수 있습니다.

- 렌더링 중 Props 또는 State를 직접 변경하는 행위
- 컴포넌트 렌더링 과정에서 발생하는 부수 효과
- Hook 호출 순서를 조건부로 변경하는 행위
- Hook을 컴포넌트 또는 다른 Hook의 최상위가 아닌 곳에서 호출하는 행위
- Props와 State의 불변성을 지키지 않는 행위

React Compiler를 도입하기 전에 기존 코드가 React의 기본 규칙을 준수하는지 확인해야 합니다.

### 10.2 메모이제이션을 정확성의 전제로 사용하지 않습니다.

메모이제이션은 성능 최적화 수단이며 애플리케이션의 정확성을 보장하기 위한 장치가 아닙니다.

예를 들어 특정 객체의 참조가 반드시 유지된다는 가정으로 비즈니스 로직을 작성하면 문제가 발생할 수 있습니다.

```tsx
function UserProfile({ user }: { user: User }) {
  const options = {
    userId: user.id,
  };

  useEffect(() => {
    connect(options);

    return () => {
      disconnect(options);
    };
  }, [options]);

  return <div>{user.name}</div>;
}
```

위 코드에서는 렌더링할 때마다 새로운 `options` 객체가 생성되므로 Effect가 반복적으로 실행될 수 있습니다.

기존 코드에서 `useMemo`로 참조를 안정화했다면 React Compiler를 도입한 이후에도 Effect의 의존성 관계가 올바르게 동작하는지 확인해야 합니다.

특히 참조 동일성에 의존하는 코드, Effect 의존성 배열, 캐싱 로직 등은 컴파일러 적용 전후를 비교하여 검증하는 것이 좋습니다.

### 10.3 기존 메모이제이션을 무조건 제거하지 않습니다.

React Compiler를 적용했다고 해서 기존의 `React.memo`, `useMemo`, `useCallback`을 일괄적으로 제거할 필요는 없습니다.

기존 메모이제이션을 제거하면 컴파일러의 분석 결과와 최적화 방식이 달라질 수 있습니다.

기존 코드에서는 우선 유지한 상태로 컴파일러를 적용하고, 실제 필요성이 낮은 메모이제이션부터 테스트를 거쳐 정리하는 것이 안전합니다.

### 10.4 모든 JavaScript 함수가 최적화되는 것은 아닙니다.

React Compiler는 일반적인 JavaScript 함수 전체를 대상으로 범용적인 메모이제이션을 수행하는 도구가 아닙니다.

주요 최적화 대상은 React 컴포넌트와 Hook입니다.

여러 컴포넌트에서 공통으로 사용하는 고비용 계산 함수가 있다면 별도의 캐싱 전략을 검토해야 합니다.

### 10.5 성능 측정 없이 최적화 효과를 단정하지 않습니다.

React Compiler는 불필요한 렌더링과 계산을 줄이는 데 도움을 주지만, 모든 성능 문제를 해결하지는 않습니다.

다음과 같은 문제는 별도의 최적화가 필요할 수 있습니다.

- 대량의 DOM 노드 생성
- 비효율적인 데이터 처리
- 과도한 네트워크 요청
- 대용량 이미지 및 리소스 다운로드
- 메인 스레드를 점유하는 긴 JavaScript 작업

따라서 React Profiler와 Browser Performance 등을 활용하여 실제 병목 지점을 확인해야 합니다.

## 11. React Compiler 오류 분석

React Compiler를 적용한 이후 예상하지 못한 동작이 발생하면 컴파일 단계의 문제와 런타임 문제를 구분해야 합니다.

### 11.1 컴파일 오류

컴파일 과정에서 오류가 발생하면 컴파일러 설정, 빌드 도구와의 호환성, 플러그인 실행 순서 등을 확인해야 합니다.

특히 Babel 플러그인 파이프라인에서 React Compiler가 다른 변환 플러그인보다 먼저 실행되는지 확인합니다.

### 11.2 런타임 오류

컴파일은 성공했지만 애플리케이션 실행 결과가 달라진 경우에는 Rules of React 위반 여부를 우선 확인해야 합니다.

특히 다음 사항을 점검하는 것이 좋습니다.

- 렌더링 중 객체나 배열을 변경하고 있는지 확인합니다.
- Props와 State를 직접 수정하고 있는지 확인합니다.
- Effect가 참조 동일성에 지나치게 의존하는지 확인합니다.
- 메모이제이션된 값이 유지된다는 가정으로 비즈니스 로직을 작성했는지 확인합니다.
- Hook 호출 규칙을 위반하고 있는지 확인합니다.

### 11.3 컴파일러 비활성화를 통한 원인 분리

특정 컴포넌트에서 문제가 발생하면 `"use no memo"`를 사용하여 컴파일러 최적화를 일시적으로 제외할 수 있습니다.

```tsx
function ProblematicComponent() {
  'use no memo';

  // 기존 컴포넌트 로직
}
```

이후 컴파일러를 적용했을 때와 적용하지 않았을 때의 동작을 비교합니다.

문제가 사라진다면 해당 컴포넌트의 Rules of React 위반 여부와 컴파일러 분석 결과를 추가로 확인해야 합니다.

근본적인 문제를 수정한 후에는 `"use no memo"`를 제거하고 다시 검증해야 합니다.

## 12. React Compiler와 관련 개념 비교

| 개념 | 설명 |
|---|---|
| React Compiler | 빌드 시점에 React 컴포넌트와 Hook을 분석하여 메모이제이션을 자동으로 적용하는 컴파일러입니다. |
| React.memo | Props가 변경되지 않은 컴포넌트의 불필요한 렌더링을 생략할 수 있도록 합니다. |
| useMemo | 계산 결과를 메모이제이션합니다. |
| useCallback | 함수 참조를 메모이제이션합니다. |
| Profiling | 렌더링 비용을 측정하고 성능 병목을 분석하는 과정입니다. |
| Rules of React | React 컴포넌트와 Hook이 준수해야 하는 기본 규칙입니다. |
| ESLint | React 규칙 위반과 컴파일러 최적화가 어려운 코드를 사전에 식별하는 데 활용합니다. |

React Compiler는 기존 메모이제이션 API의 역할을 컴파일 시점에 자동화하는 기술입니다. 기존 API를 폐기하거나 React의 렌더링 모델 자체를 변경하는 것은 아닙니다.

## 13. 참고 자료

### React 공식 문서

- [React Compiler - Introduction](https://react.dev/learn/react-compiler/introduction)
- [React Compiler - Installation](https://react.dev/learn/react-compiler/installation)
- [React Compiler - Incremental Adoption](https://react.dev/learn/react-compiler/incremental-adoption)
- [React Compiler - Debugging and Troubleshooting](https://react.dev/learn/react-compiler/debugging)
- [React Compiler - Configuration](https://react.dev/reference/react-compiler/configuration)
- [React Compiler - Directives](https://react.dev/reference/react-compiler/directives)
- [React - Rules of React](https://react.dev/reference/rules)

### React API

- [React - memo](https://react.dev/reference/react/memo)
- [React - useMemo](https://react.dev/reference/react/useMemo)
- [React - useCallback](https://react.dev/reference/react/useCallback)
- [React - Profiler](https://react.dev/reference/react/Profiler)

### 개발 도구

- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [React Compiler Playground](https://playground.react.dev/)

