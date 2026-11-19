# Derived State

## 1. 개요

Derived State(파생 상태)는 기존 Props 또는 State를 기반으로 계산할 수 있는 값입니다. 원본 데이터에서 필요한 정보를 도출하므로 별도의 상태로 저장하지 않고 렌더링 과정에서 계산할 수 있습니다.

예를 들어 사용자 이름을 `firstName`과 `lastName`으로 관리한다면, 전체 이름인 `fullName`은 두 값을 조합하여 계산할 수 있습니다.

```tsx
import { useState } from 'react';

function Profile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');

  const fullName = `${firstName} ${lastName}`;

  return (
    <div>
      <p>{fullName}</p>

      <input
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />

      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
    </div>
  );
}
```

`fullName`은 `firstName`과 `lastName`으로부터 항상 계산할 수 있으므로 별도의 State로 관리할 필요가 없습니다.

React에서는 Props나 기존 State로부터 계산할 수 있는 값을 불필요하게 State에 저장하지 않는 것을 권장합니다.

## 2. Derived State의 기본 원칙

### 2.1. 원본 데이터와 파생 데이터 구분

State를 설계할 때는 사용자가 직접 변경하거나 애플리케이션에서 독립적으로 관리해야 하는 원본 데이터와, 원본 데이터를 기반으로 계산할 수 있는 파생 데이터를 구분해야 합니다.

다음은 상품 목록과 필터링된 상품 목록을 각각 State로 관리하는 예제입니다.

```tsx
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Keyboard', price: 100 },
    { id: 2, name: 'Mouse', price: 50 },
    { id: 3, name: 'Monitor', price: 300 },
  ]);

  const [minPrice, setMinPrice] = useState(100);

  const filteredProducts = products.filter(
    (product) => product.price >= minPrice
  );

  return (
    <div>
      <input
        type="number"
        value={minPrice}
        onChange={(event) => setMinPrice(Number(event.target.value))}
      />

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name}: {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

이 예제에서는 다음과 같이 데이터를 구분합니다.

- `products`: 상품 목록을 보관하는 원본 State입니다.
- `minPrice`: 사용자가 변경하는 필터 조건입니다.
- `filteredProducts`: 상품 목록과 필터 조건으로 계산되는 파생 값입니다.

`filteredProducts`는 원본 데이터가 변경되면 자동으로 다시 계산되므로 별도의 State로 관리하지 않습니다.

### 2.2. 중복 State 방지

동일한 데이터를 여러 State에 중복 저장하면 각각의 값이 서로 다른 시점에 갱신되어 불일치가 발생할 수 있습니다.

다음 예제는 이름과 전체 이름을 각각 State로 관리하는 잘못된 설계입니다.

```tsx
import { useState } from 'react';

function Profile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [fullName, setFullName] = useState('John Doe');

  function handleFirstNameChange(value: string) {
    setFirstName(value);
    setFullName(`${value} ${lastName}`);
  }

  function handleLastNameChange(value: string) {
    setLastName(value);
    setFullName(`${firstName} ${value}`);
  }

  return (
    <div>
      <p>{fullName}</p>

      <input
        value={firstName}
        onChange={(event) => handleFirstNameChange(event.target.value)}
      />

      <input
        value={lastName}
        onChange={(event) => handleLastNameChange(event.target.value)}
      />
    </div>
  );
}
```

`fullName`은 다른 두 State로부터 계산할 수 있지만, 별도로 저장하고 있습니다. 따라서 이름을 변경하는 모든 경로에서 `fullName`도 함께 갱신해야 합니다.

갱신 로직이 누락되거나 잘못 구현되면 원본 데이터와 파생 데이터 사이에 불일치가 발생할 수 있습니다.

다음과 같이 개선할 수 있습니다.

```tsx
import { useState } from 'react';

function Profile() {
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');

  const fullName = `${firstName} ${lastName}`;

  return (
    <div>
      <p>{fullName}</p>

      <input
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />

      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />
    </div>
  );
}
```

원본 State만 관리하고 파생 값은 렌더링 과정에서 계산하므로 별도의 동기화 로직이 필요하지 않습니다.

## 3. Props로부터 State를 파생하는 문제

Props로 전달받은 값을 State에 복사하는 패턴은 주의해야 합니다.

`useState`의 초기값은 컴포넌트가 처음 렌더링될 때 사용됩니다. 이후 부모 컴포넌트가 새로운 Props를 전달하더라도 기존 State가 자동으로 갱신되지는 않습니다.

```tsx
import { useState } from 'react';

interface MessageProps {
  messageColor: string;
}

function Message({ messageColor }: MessageProps) {
  const [color, setColor] = useState(messageColor);

  return <p style={{ color }}>Message</p>;
}
```

부모 컴포넌트가 `messageColor`를 `blue`에서 `red`로 변경하더라도 `color` State는 기존 값을 유지합니다.

이는 Props와 State가 서로 다른 데이터로 관리되기 때문입니다.

Props를 그대로 사용하면 이러한 문제를 방지할 수 있습니다.

```tsx
interface MessageProps {
  messageColor: string;
}

function Message({ messageColor }: MessageProps) {
  return (
    <p style={{ color: messageColor }}>
      Message
    </p>
  );
}
```

Props를 짧은 이름으로 사용하고 싶다면 일반 변수로 할당할 수 있습니다.

```tsx
function Message({ messageColor }: MessageProps) {
  const color = messageColor;

  return <p style={{ color }}>Message</p>;
}
```

### 3.1. 초기 Props를 State로 사용하는 경우

Props를 State의 초기값으로 사용하는 것이 항상 잘못된 것은 아닙니다.

부모 컴포넌트가 전달한 초기값을 기준으로 내부에서 독립적으로 수정하는 컴포넌트라면 사용할 수 있습니다.

```tsx
import { useState } from 'react';

interface EditorProps {
  initialTitle: string;
}

function Editor({ initialTitle }: EditorProps) {
  const [title, setTitle] = useState(initialTitle);

  return (
    <input
      value={title}
      onChange={(event) => setTitle(event.target.value)}
    />
  );
}
```

이 경우 `initialTitle`은 초기값으로만 사용되며 이후 Props가 변경되어도 `title` State에는 반영되지 않습니다.

이러한 의도를 명확하게 표현하기 위해 `initial` 또는 `default` 접두사를 사용하는 것이 좋습니다.

### 3.2. Props 변경 시 State 초기화

Props가 변경될 때 컴포넌트 내부의 State 전체를 초기화해야 한다면 `key`를 활용할 수 있습니다.

```tsx
import { useState } from 'react';

interface EditorProps {
  initialTitle: string;
}

function Editor({ initialTitle }: EditorProps) {
  const [title, setTitle] = useState(initialTitle);

  return (
    <input
      value={title}
      onChange={(event) => setTitle(event.target.value)}
    />
  );
}

function App() {
  const [documentId, setDocumentId] = useState('document-1');

  return (
    <div>
      <Editor
        key={documentId}
        initialTitle="Untitled"
      />

      <button onClick={() => setDocumentId('document-2')}>
        Change Document
      </button>
    </div>
  );
}
```

React는 컴포넌트의 위치, 타입, `key` 등을 기준으로 State의 보존 여부를 결정합니다.

`key`가 변경되면 기존 컴포넌트와 다른 컴포넌트로 취급하므로 해당 컴포넌트의 State가 초기화됩니다.

이는 Props 변경에 맞춰 State를 수동으로 동기화하는 것보다 명확한 방법입니다.

## 4. Derived State와 useMemo

파생 값은 일반적으로 렌더링 과정에서 계산하면 됩니다. 다만 계산 비용이 큰 경우에는 `useMemo`를 사용하여 계산 결과를 메모이제이션할 수 있습니다.

`useMemo`는 특정 의존성이 변경되지 않는 동안 이전 계산 결과를 재사용하는 Hook입니다.

### 4.1. useMemo를 사용하지 않는 경우

```tsx
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList({ products }: { products: Product[] }) {
  const [minPrice, setMinPrice] = useState(100);

  const filteredProducts = products.filter(
    (product) => product.price >= minPrice
  );

  return (
    <div>
      <input
        type="number"
        value={minPrice}
        onChange={(event) => setMinPrice(Number(event.target.value))}
      />

      {filteredProducts.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  );
}
```

컴포넌트가 렌더링될 때마다 `filter()`가 실행됩니다.

상품 목록이 작거나 필터링 비용이 낮다면 일반적인 계산 방식으로 충분합니다.

### 4.2. useMemo를 사용하는 경우

```tsx
import { useMemo, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList({ products }: { products: Product[] }) {
  const [minPrice, setMinPrice] = useState(100);

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.price >= minPrice
    );
  }, [products, minPrice]);

  return (
    <div>
      <input
        type="number"
        value={minPrice}
        onChange={(event) => setMinPrice(Number(event.target.value))}
      />

      {filteredProducts.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  );
}
```

`products` 또는 `minPrice`가 변경되면 필터링을 다시 수행합니다. 두 의존성이 변경되지 않았다면 이전 계산 결과를 재사용합니다.

### 4.3. useMemo 사용 기준

`useMemo`는 파생 값을 State로 저장하기 위한 수단이 아닙니다. 계산 결과를 캐싱하여 불필요한 연산이나 참조 변경을 줄이는 성능 최적화 도구입니다.

다음과 같은 경우에 사용을 고려할 수 있습니다.

- 계산 비용이 크고 렌더링마다 반복되는 경우
- 계산 결과를 `memo`로 최적화된 자식 컴포넌트에 Props로 전달하는 경우
- 계산 결과가 다른 Hook의 의존성으로 사용되는 경우

반대로 단순한 문자열 결합이나 작은 배열의 필터링처럼 계산 비용이 낮은 작업에는 일반 변수를 사용하는 편이 코드의 가독성에 유리합니다.

또한 `useMemo`는 성능 최적화를 위한 메커니즘이며, 계산 결과가 반드시 유지되어야 하는 의미적 보장 수단은 아닙니다.

## 5. Derived State와 useEffect

파생 값을 계산하기 위해 `useEffect`와 별도의 State를 사용하는 패턴은 일반적으로 피하는 것이 좋습니다.

다음 예제는 Props로 전달받은 상품 목록을 기반으로 필터링 결과를 State에 저장합니다.

```tsx
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList({ products }: { products: Product[] }) {
  const [minPrice, setMinPrice] = useState(100);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const result = products.filter(
      (product) => product.price >= minPrice
    );

    setFilteredProducts(result);
  }, [products, minPrice]);

  return (
    <div>
      <input
        type="number"
        value={minPrice}
        onChange={(event) => setMinPrice(Number(event.target.value))}
      />

      {filteredProducts.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  );
}
```

이 방식은 다음과 같은 불필요한 처리 과정을 발생시킵니다.

1. `products` 또는 `minPrice`가 변경됩니다.
2. 컴포넌트가 렌더링됩니다.
3. Effect가 실행되어 필터링 결과를 계산합니다.
4. `setFilteredProducts()`가 호출됩니다.
5. State 변경으로 인해 컴포넌트가 다시 렌더링됩니다.

파생 값을 계산하기 위해 Effect와 별도의 State를 사용하면 렌더링과 State 업데이트가 추가로 발생합니다.

다음과 같이 렌더링 과정에서 직접 계산하는 것이 더 적절합니다.

```tsx
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

function ProductList({ products }: { products: Product[] }) {
  const [minPrice, setMinPrice] = useState(100);

  const filteredProducts = products.filter(
    (product) => product.price >= minPrice
  );

  return (
    <div>
      <input
        type="number"
        value={minPrice}
        onChange={(event) => setMinPrice(Number(event.target.value))}
      />

      {filteredProducts.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  );
}
```

React에서는 Props나 기존 State로부터 계산할 수 있는 값을 동기화하기 위해 Effect를 사용하지 않는 것을 권장합니다.

Effect는 일반적으로 React 외부 시스템과 동기화할 때 사용합니다. 예를 들어 브라우저 API, 외부 구독, 네트워크 연결 등의 작업이 이에 해당합니다.

## 6. Derived State 설계 시 주의사항

### 6.1. 계산 가능한 값을 State로 저장하지 않기

기존 Props와 State만으로 계산할 수 있는 값이라면 별도의 State로 저장하지 않는 것이 좋습니다.

불필요한 State를 줄이면 데이터 동기화 로직과 상태 변경 경로가 단순해집니다.

### 6.2. State의 단일 소유권 유지하기

동일한 데이터를 여러 컴포넌트나 State 변수에서 중복 관리하지 않도록 주의해야 합니다.

원본 데이터는 적절한 State Owner가 관리하고, 필요한 컴포넌트에서는 Props를 통해 전달받거나 해당 데이터를 기반으로 파생 값을 계산하는 구조가 적절합니다.

### 6.3. 객체 참조와 불변성 고려하기

React는 State의 변경을 판단할 때 객체의 참조 동일성을 중요하게 사용합니다.

객체나 배열을 직접 변경하면 React가 변경을 올바르게 감지하지 못할 수 있습니다.

```tsx
const [products, setProducts] = useState<Product[]>([]);

// 잘못된 방식
products.push(newProduct);
setProducts(products);

// 올바른 방식
setProducts((previousProducts) => [
  ...previousProducts,
  newProduct,
]);
```

원본 배열을 불변 방식으로 갱신하면 React가 새로운 참조를 확인할 수 있으며, 이를 기반으로 파생 값도 올바르게 다시 계산할 수 있습니다.

### 6.4. 파생 값과 독립적인 State 구분하기

모든 값이 기존 데이터로부터 계산 가능하다고 해서 반드시 파생 값으로 처리해야 하는 것은 아닙니다.

사용자가 직접 수정하는 입력값이나 원본 데이터와 독립적인 UI 상태는 별도의 State로 관리해야 합니다.

예를 들어 검색 화면에서는 다음과 같이 구분할 수 있습니다.

| 데이터 | 구분 | 설명 |
| --- | --- | --- |
| `products` | 원본 State | 상품 데이터 |
| `searchQuery` | 원본 State | 사용자가 입력한 검색어 |
| `isOpen` | 독립적인 State | 검색 패널의 열림 여부 |
| `filteredProducts` | Derived State | 검색어에 따라 필터링된 상품 |
| `resultCount` | Derived State | 검색 결과의 개수 |

`filteredProducts`와 `resultCount`는 기존 데이터로부터 계산할 수 있지만, `searchQuery`와 `isOpen`은 독립적으로 변경되는 값이므로 State로 관리합니다.

## 7. 정리

Derived State는 기존 Props 또는 State를 기반으로 계산되는 값입니다. React에서는 파생 값을 불필요하게 State로 저장하지 않고 렌더링 과정에서 계산하는 방식을 권장합니다.

핵심 원칙은 다음과 같습니다.

- 원본 데이터와 파생 데이터를 구분합니다.
- 계산 가능한 값은 별도의 State로 저장하지 않습니다.
- Props를 State에 복사하는 패턴은 동기화 문제를 일으킬 수 있으므로 주의합니다.
- Props 변경에 따라 컴포넌트 전체의 State를 초기화해야 한다면 `key`를 활용할 수 있습니다.
- 계산 비용이 큰 경우 `useMemo`를 활용하여 계산 결과를 메모이제이션할 수 있습니다.
- 파생 값을 동기화하기 위해 불필요한 `useEffect`와 State 업데이트를 사용하지 않습니다.
- 독립적으로 변경되는 데이터는 파생 값과 구분하여 State로 관리합니다.

파생 상태를 적절하게 설계하면 중복 데이터와 동기화 로직을 줄이고, 컴포넌트의 렌더링 흐름과 State 구조를 단순하게 유지할 수 있습니다.

## 참고자료

### React 공식 문서

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Managing State](https://react.dev/learn/managing-state)
- [useState](https://react.dev/reference/react/useState)
- [useMemo](https://react.dev/reference/react/useMemo)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

### 관련 개념

- [State Structure](./state-structure.md)
- [Sharing State](./sharing-state.md)
- [Lifting State Up](./lifting-state-up.md)