# useMemo

## 1. useMemo란?

`useMemo`는 계산 결과를 메모이제이션(Memoization)하여 컴포넌트의 렌더링 사이에 재사용할 수 있도록 하는 Hook입니다.

React 컴포넌트는 State나 Props가 변경되면 다시 렌더링됩니다. 이 과정에서 컴포넌트 내부의 일반적인 계산 로직도 다시 실행됩니다.

계산 비용이 큰 작업이 포함되어 있다면 렌더링이 반복될 때마다 동일한 계산을 수행하게 되어 성능 저하가 발생할 수 있습니다.

`useMemo`는 의존성 배열에 포함된 값이 변경되지 않았다면 이전 계산 결과를 재사용하여 불필요한 계산을 줄입니다.

```tsx
const memoizedValue = useMemo(
  () => calculateValue(a, b),
  [a, b],
);
```

대표적인 사용 사례는 다음과 같습니다.

- 대량의 데이터 필터링 및 정렬
- 복잡한 수학적 계산
- 객체나 배열의 참조 안정화
- 하위 컴포넌트의 불필요한 렌더링 방지
- 다른 Hook의 의존성으로 전달되는 객체의 참조 안정화

`useMemo`는 성능 최적화를 위한 기능이며, 컴포넌트의 동작 정확성을 보장하기 위한 상태 저장 도구는 아닙니다.

## 2. 기본 문법

`useMemo`는 계산 함수와 의존성 배열을 인자로 전달받습니다.

```tsx
const cachedValue = useMemo(calculateValue, dependencies);
```

- `calculateValue`: 캐싱할 값을 계산하여 반환하는 함수입니다.
- `dependencies`: 계산 함수 내부에서 사용하는 반응형 값의 배열입니다.
- `cachedValue`: 계산 함수가 반환한 값입니다.

React는 최초 렌더링에서 계산 함수를 실행하고 결과를 저장합니다.

이후 렌더링에서는 의존성 배열의 값이 변경되었는지 확인합니다.

- 의존성이 변경되지 않았다면 이전 계산 결과를 반환합니다.
- 의존성이 변경되었다면 계산 함수를 다시 실행하고 새로운 결과를 저장합니다.

의존성 비교에는 `Object.is`가 사용됩니다.

### 2.1. 기본 사용 예제

다음 예제에서는 배열에서 짝수만 필터링하는 작업을 수행합니다.

```tsx
import { useMemo } from 'react';

function NumberList({ numbers }: { numbers: number[] }) {
  const evenNumbers = useMemo(() => {
    return numbers.filter(number => number % 2 === 0);
  }, [numbers]);

  return (
    <ul>
      {evenNumbers.map(number => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}
```

`numbers`가 변경되지 않았다면 이전에 계산한 `evenNumbers`를 재사용합니다.

반면 `numbers`가 변경되면 필터링 작업을 다시 수행합니다.

### 2.2. 의존성 배열

의존성 배열에는 계산 함수 내부에서 참조하는 모든 반응형 값을 포함해야 합니다.

```tsx
function ProductList({
  products,
  keyword,
}: {
  products: Product[];
  keyword: string;
}) {
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.includes(keyword),
    );
  }, [products, keyword]);

  return <ProductItems products={filteredProducts} />;
}
```

위 예제에서는 `products`와 `keyword`를 모두 참조하므로 두 값을 의존성 배열에 포함해야 합니다.

의존성 배열을 임의로 생략하거나 필요한 값을 제외하면 오래된 값을 참조하는 문제가 발생할 수 있습니다.

## 3. useMemo의 실행 과정

`useMemo`는 최초 렌더링과 이후 렌더링에서 다음과 같이 동작합니다.

### 3.1. 최초 렌더링

컴포넌트가 최초 렌더링될 때는 계산 함수를 실행하고 결과를 캐싱합니다.

```tsx
const result = useMemo(() => {
  console.log('계산 실행');

  return expensiveCalculation(value);
}, [value]);
```

최초 렌더링에서는 `expensiveCalculation(value)`가 실행됩니다.

### 3.2. 의존성이 변경되지 않은 경우

다음 렌더링에서 의존성 배열의 값이 이전 렌더링과 동일하면 계산 함수를 다시 실행하지 않습니다.

```tsx
const result = useMemo(
  () => expensiveCalculation(value),
  [value],
);
```

`value`가 이전 렌더링과 동일하다면 이전에 계산한 결과를 재사용합니다.

### 3.3. 의존성이 변경된 경우

의존성 중 하나라도 이전 값과 다르면 계산 함수를 다시 실행합니다.

```tsx
const result = useMemo(
  () => expensiveCalculation(value),
  [value],
);
```

`value`가 변경되면 새로운 계산 결과를 생성하고 해당 결과를 다음 렌더링에서 재사용할 수 있도록 저장합니다.

### 3.4. 빈 의존성 배열

빈 의존성 배열을 전달하면 컴포넌트의 마운트 이후 일반적인 업데이트에서는 계산 결과를 재사용합니다.

```tsx
const initialData = useMemo(() => {
  return createInitialData();
}, []);
```

단, `useMemo`는 영구적인 캐시를 보장하지 않습니다.

React는 특정 상황에서 캐시를 폐기할 수 있으며, 개발 환경의 Strict Mode에서는 계산 함수를 추가로 호출할 수 있습니다.

따라서 `useMemo`를 컴포넌트 생명주기 동안 반드시 유지되어야 하는 데이터 저장소처럼 사용해서는 안 됩니다.

## 4. useMemo와 일반 계산 비교

모든 계산에 `useMemo`를 적용할 필요는 없습니다.

계산 비용이 작다면 일반적인 변수 할당이나 계산을 사용하는 편이 더 간단하고 효율적일 수 있습니다.

### 4.1. 일반 계산

```tsx
function ProductList({ products }: { products: Product[] }) {
  const productCount = products.length;

  return <div>상품 수: {productCount}</div>;
}
```

배열의 길이를 확인하는 작업은 일반적으로 계산 비용이 작으므로 `useMemo`가 필요하지 않습니다.

### 4.2. 메모이제이션을 적용한 계산

```tsx
function ProductList({ products }: { products: Product[] }) {
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) =>
      a.price - b.price,
    );
  }, [products]);

  return <ProductItems products={sortedProducts} />;
}
```

데이터의 양이 많거나 정렬 작업이 반복적으로 수행되어 실제 성능 문제가 발생한다면 `useMemo`를 고려할 수 있습니다.

### 4.3. 적용 여부 판단

다음 기준을 활용할 수 있습니다.

| 상황 | useMemo 적용 |
| --- | --- |
| 단순한 산술 연산 | 일반적으로 불필요 |
| 배열의 길이 확인 | 일반적으로 불필요 |
| 소량 데이터의 단순 필터링 | 일반적으로 불필요 |
| 대량 데이터의 정렬 및 필터링 | 고려 가능 |
| 복잡한 수학적 계산 | 고려 가능 |
| 객체나 배열의 참조 안정화 | 필요에 따라 고려 |
| 실제 성능 병목이 없는 계산 | 일반적으로 불필요 |

메모이제이션 자체에도 비교와 캐시 관리 비용이 발생합니다.

따라서 계산 비용이 충분히 크거나 참조 안정화가 실제 최적화에 도움이 되는 경우에 적용해야 합니다.

## 5. 객체와 배열의 참조 안정화

JavaScript에서 객체와 배열은 참조 타입입니다.

컴포넌트 내부에서 객체나 배열을 생성하면 렌더링마다 새로운 참조가 생성됩니다.

React는 `Object.is`를 사용하여 의존성을 비교하므로 내용이 동일하더라도 참조가 다르면 변경된 값으로 판단합니다.

### 5.1. 객체 참조 문제

다음 예제에서는 `options` 객체가 렌더링마다 새롭게 생성됩니다.

```tsx
function SearchPage({ query }: { query: string }) {
  const options = {
    matchMode: 'whole-word',
    query,
  };

  const results = useMemo(() => {
    return searchItems(options);
  }, [options]);

  return <SearchResults results={results} />;
}
```

`options`는 렌더링마다 새로운 객체이므로 의존성 비교 결과가 달라집니다.

결과적으로 `useMemo`를 사용했음에도 계산 함수가 매번 실행될 수 있습니다.

### 5.2. 객체를 useMemo 내부에서 생성

객체를 계산 함수 내부로 이동하면 문제를 해결할 수 있습니다.

```tsx
function SearchPage({ query }: { query: string }) {
  const results = useMemo(() => {
    const options = {
      matchMode: 'whole-word',
      query,
    };

    return searchItems(options);
  }, [query]);

  return <SearchResults results={results} />;
}
```

이제 `useMemo`는 실제로 계산에 필요한 `query`에만 의존합니다.

가능하다면 객체를 `useMemo` 내부에서 생성하는 방식이 더 단순합니다.

### 5.3. 객체 자체를 메모이제이션

객체 자체를 다른 Hook이나 컴포넌트에 전달해야 한다면 객체를 `useMemo`로 메모이제이션할 수 있습니다.

```tsx
function SearchPage({ query }: { query: string }) {
  const options = useMemo(() => ({
    matchMode: 'whole-word',
    query,
  }), [query]);

  const results = useMemo(() => {
    return searchItems(options);
  }, [options]);

  return <SearchResults results={results} />;
}
```

`query`가 변경되지 않았다면 `options` 객체의 참조가 유지됩니다.

다만 객체를 메모이제이션하기 위해 불필요하게 여러 단계의 `useMemo`를 사용하는 것보다 계산 구조를 단순하게 만드는 방법을 우선적으로 고려해야 합니다.

## 6. useMemo와 React.memo

`React.memo`는 컴포넌트의 Props가 변경되지 않았을 때 불필요한 렌더링을 줄이는 데 사용합니다.

그러나 부모 컴포넌트에서 객체나 배열을 매번 새롭게 생성하여 전달하면 Props의 참조가 변경된 것으로 판단되어 최적화가 제대로 적용되지 않을 수 있습니다.

이때 `useMemo`를 함께 활용할 수 있습니다.

### 6.1. 메모이제이션이 없는 경우

```tsx
const ProductList = memo(function ProductList({
  products,
}: {
  products: Product[];
}) {
  console.log('ProductList rendered');

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
});

function App({ products }: { products: Product[] }) {
  const [count, setCount] = useState(0);

  const visibleProducts = products.filter(
    product => product.visible,
  );

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <ProductList products={visibleProducts} />
    </>
  );
}
```

`count`가 변경되면 `App`이 다시 렌더링됩니다.

이 과정에서 `filter()`가 다시 실행되어 새로운 배열이 생성됩니다.

`ProductList`는 `memo`로 감싸져 있지만 `products`의 참조가 변경되었으므로 다시 렌더링됩니다.

### 6.2. useMemo 적용

```tsx
function App({ products }: { products: Product[] }) {
  const [count, setCount] = useState(0);

  const visibleProducts = useMemo(() => {
    return products.filter(product => product.visible);
  }, [products]);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <ProductList products={visibleProducts} />
    </>
  );
}
```

`products`가 변경되지 않았다면 `visibleProducts`의 참조가 유지됩니다.

따라서 `count`만 변경된 경우 `ProductList`는 Props가 변경되지 않았으므로 `memo`의 최적화 대상이 될 수 있습니다.

### 6.3. 두 기능의 역할

| 구분 | useMemo | React.memo |
| --- | --- | --- |
| 최적화 대상 | 계산 결과 | 컴포넌트 렌더링 |
| 주요 목적 | 값 재계산 방지 | 불필요한 컴포넌트 렌더링 방지 |
| 비교 대상 | 의존성 배열 | Props |
| 반환값 | 메모이제이션된 값 | 메모이제이션된 컴포넌트 |

두 기능은 서로 다른 최적화 지점을 담당하며 함께 사용할 수 있습니다.

## 7. useMemo와 useCallback 비교

`useMemo`와 `useCallback`은 모두 의존성 배열을 기준으로 이전 결과를 재사용합니다.

차이는 메모이제이션하는 대상입니다.

- `useMemo`: 계산 함수의 실행 결과를 메모이제이션합니다.
- `useCallback`: 함수 자체를 메모이제이션합니다.

### 7.1. useMemo

```tsx
const result = useMemo(() => {
  return calculate(a, b);
}, [a, b]);
```

계산 함수가 반환한 값을 캐싱합니다.

### 7.2. useCallback

```tsx
const handleClick = useCallback(() => {
  console.log(value);
}, [value]);
```

함수 자체의 참조를 유지합니다.

### 7.3. 관계

`useCallback`은 다음과 같은 형태의 `useMemo`로 이해할 수 있습니다.

```tsx
const handleClick = useMemo(() => {
  return () => {
    console.log(value);
  };
}, [value]);
```

두 Hook의 역할을 구분하면 다음과 같습니다.

| 구분 | useMemo | useCallback |
| --- | --- | --- |
| 캐싱 대상 | 계산 결과 | 함수 |
| 주요 반환값 | 값 | 함수 |
| 주요 사용 사례 | 복잡한 계산, 객체 및 배열 참조 안정화 | 이벤트 핸들러 등 함수 참조 안정화 |

## 8. useMemo와 useEffect

`useMemo`와 `useEffect`는 모두 의존성 배열을 사용하지만 목적과 실행 방식이 다릅니다.

- `useMemo`: 렌더링 과정에서 계산 결과를 메모이제이션합니다.
- `useEffect`: 렌더링 이후 외부 시스템과 동기화합니다.

### 8.1. 계산 결과를 State로 동기화하는 잘못된 예

```tsx
function ProductList({ products }: { products: Product[] }) {
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

  useEffect(() => {
    setSortedProducts(
      [...products].sort((a, b) => a.price - b.price),
    );
  }, [products]);

  return <ProductItems products={sortedProducts} />;
}
```

`sortedProducts`는 `products`에서 계산할 수 있는 파생 데이터입니다.

Effect에서 State를 업데이트하면 불필요한 추가 렌더링이 발생할 수 있습니다.

### 8.2. useMemo를 이용한 개선

```tsx
function ProductList({ products }: { products: Product[] }) {
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  return <ProductItems products={sortedProducts} />;
}
```

계산 결과를 별도의 State로 관리하지 않고 렌더링 과정에서 직접 계산합니다.

`useMemo`는 계산 결과를 재사용하여 불필요한 재계산을 줄입니다.

### 8.3. 사용 목적 비교

| 구분 | useMemo | useEffect |
| --- | --- | --- |
| 주요 목적 | 계산 결과 메모이제이션 | 외부 시스템 동기화 |
| 실행 영역 | 렌더링 과정 | 커밋 이후 |
| 주요 작업 | 계산 및 참조 안정화 | 구독, 연결, 타이머, DOM 외부 작업 |
| 반환값 | 메모이제이션된 값 | 없음 |

단순히 계산된 값을 관리하기 위해 Effect를 사용하는 것은 피해야 합니다.

## 9. useMemo의 계산 함수와 순수성

`useMemo`에 전달하는 계산 함수는 순수 함수로 작성해야 합니다.

순수 함수는 동일한 입력에 대해 동일한 결과를 반환하며, 외부 상태를 변경하는 부수 효과를 발생시키지 않습니다.

잘못된 예:

```tsx
const result = useMemo(() => {
  document.title = 'React';

  return calculate(value);
}, [value]);
```

위 코드는 계산 함수 내부에서 DOM을 변경하는 부수 효과를 발생시킵니다.

`useMemo`는 렌더링 과정에서 실행되므로 이러한 작업은 적절하지 않습니다.

외부 시스템과의 동기화는 `useEffect`를 사용해야 합니다.

```tsx
const result = useMemo(() => {
  return calculate(value);
}, [value]);

useEffect(() => {
  document.title = 'React';
}, []);
```

또한 개발 환경의 Strict Mode에서는 계산 함수가 순수한지 확인하기 위해 두 번 호출될 수 있습니다.

계산 함수가 외부 상태를 변경한다면 이러한 추가 실행으로 예상하지 못한 결과가 발생할 수 있습니다.

따라서 계산 함수 내부에서는 입력 데이터를 직접 변경하지 않아야 합니다.

```tsx
const sortedProducts = useMemo(() => {
  return [...products].sort((a, b) => a.price - b.price);
}, [products]);
```

위 예제처럼 원본 배열을 복사한 뒤 정렬하면 기존 Props를 변경하지 않고 새로운 계산 결과를 반환할 수 있습니다.

## 10. Strict Mode와 useMemo

개발 환경에서 Strict Mode가 활성화되어 있으면 React는 계산 함수가 순수한지 확인하기 위해 `useMemo`의 계산 함수를 추가로 호출할 수 있습니다.

```tsx
const result = useMemo(() => {
  console.log('계산 실행');

  return calculate(value);
}, [value]);
```

개발 환경에서는 최초 렌더링 시 계산 함수가 두 번 호출되는 것처럼 보일 수 있습니다.

이 동작은 순수하지 않은 계산 로직을 발견하기 위한 검증 과정입니다.

프로덕션 환경에서는 이러한 개발용 추가 호출이 발생하지 않습니다.

계산 함수가 순수하게 작성되어 있다면 추가 호출이 발생하더라도 애플리케이션의 동작에 영향을 주지 않아야 합니다.

## 11. useMemo의 캐시와 한계

`useMemo`는 계산 결과를 재사용하기 위한 성능 최적화 기능입니다.

따라서 캐시가 영구적으로 유지된다고 가정해서는 안 됩니다.

React는 다음과 같은 특정 상황에서 메모이제이션된 값을 폐기할 수 있습니다.

- 개발 환경에서 파일 수정으로 컴포넌트가 편집되는 경우
- 컴포넌트가 초기 마운트 과정에서 일시 중단되는 경우
- React가 향후 추가적인 캐시 폐기 기능을 적용하는 경우

따라서 `useMemo`를 애플리케이션의 필수 상태 저장소로 사용해서는 안 됩니다.

캐시가 폐기되어 계산 함수가 다시 실행되더라도 컴포넌트가 정확하게 동작해야 합니다.

### 11.1. 상태 저장 목적으로 사용하지 않습니다

다음과 같이 객체를 생성하고 유지하기 위해 `useMemo`를 사용하는 것은 적절하지 않을 수 있습니다.

```tsx
const user = useMemo(() => ({
  name: 'React',
}), []);
```

이 객체가 반드시 유지되어야 하는 상태라면 `useState` 또는 `useRef` 등 목적에 맞는 기능을 사용해야 합니다.

- UI에 반영되는 변경 가능한 값: `useState`
- 렌더링과 무관하게 유지하는 변경 가능한 값: `useRef`
- 렌더링 중 계산 결과의 재사용: `useMemo`

## 12. React Compiler와 useMemo

React Compiler는 컴포넌트의 렌더링 과정에서 발생하는 불필요한 계산과 렌더링을 자동으로 최적화할 수 있는 컴파일러입니다.

Compiler가 활성화된 프로젝트에서는 컴포넌트와 Hook의 값을 자동으로 메모이제이션하여 수동으로 `useMemo`를 작성해야 하는 상황을 줄일 수 있습니다.

```tsx
function ProductList({ products }: { products: Product[] }) {
  const filteredProducts = products.filter(
    product => product.visible,
  );

  return <ProductItems products={filteredProducts} />;
}
```

React Compiler가 적용된 환경에서는 위와 같은 계산도 컴파일러가 최적화할 수 있습니다.

다만 다음 사항을 고려해야 합니다.

- React Compiler가 프로젝트에 실제로 설정되어 있어야 합니다.
- 컴파일러가 최적화할 수 있는 코드 구조를 유지해야 합니다.
- 컴파일러가 적용되지 않은 환경에서는 수동 최적화가 필요할 수 있습니다.
- 컴파일러를 사용하더라도 성능 측정과 코드 구조 개선은 중요합니다.

React Compiler가 활성화되어 있다면 불필요한 수동 메모이제이션을 줄이고 컴파일러의 최적화 기능을 활용하는 것이 좋습니다.

## 13. useMemo 사용 시 주의사항

### 13.1. 모든 계산에 사용하지 않습니다

계산 비용이 작은 작업에 `useMemo`를 적용하면 오히려 코드 복잡도와 메모이제이션 관리 비용만 증가할 수 있습니다.

실제 성능 문제가 확인된 경우에 적용하는 것이 좋습니다.

### 13.2. 의존성을 임의로 생략하지 않습니다

계산 함수에서 참조하는 반응형 값을 모두 의존성 배열에 포함해야 합니다.

의존성이 누락되면 오래된 값이 사용될 수 있습니다.

### 13.3. 계산 함수에서 부수 효과를 발생시키지 않습니다

계산 함수는 순수하게 작성해야 합니다.

네트워크 요청, DOM 변경, 이벤트 리스너 등록 등 외부 시스템과의 동기화는 `useEffect`를 사용해야 합니다.

### 13.4. 원본 데이터를 직접 변경하지 않습니다

배열이나 객체를 계산할 때 기존 Props나 State를 직접 변경하지 않아야 합니다.

새로운 배열이나 객체를 생성하여 계산 결과를 반환하는 것이 좋습니다.

### 13.5. 캐시의 영속성을 가정하지 않습니다

`useMemo`는 성능 최적화를 위한 기능입니다.

계산 결과가 반드시 유지되어야 하는 비즈니스 로직이나 상태 저장에 사용해서는 안 됩니다.

### 13.6. 성능 측정 없이 적용하지 않습니다

`useMemo`를 사용한다고 항상 성능이 개선되는 것은 아닙니다.

React DevTools Profiler 등을 활용하여 실제 렌더링 비용과 계산 비용을 확인한 후 적용하는 것이 좋습니다.

## 14. useMemo 사용 원칙

`useMemo`를 효과적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **계산 비용이 큰 작업에 적용합니다.** 대량 데이터의 필터링, 정렬, 복잡한 계산 등 실제 비용이 큰 작업을 대상으로 합니다.
2. **의존성을 정확하게 선언합니다.** 계산 함수에서 참조하는 반응형 값을 모두 포함해야 합니다.
3. **객체와 배열의 참조 안정화에 활용합니다.** `React.memo`를 사용하는 하위 컴포넌트나 다른 Hook의 의존성에 전달하는 값의 참조를 안정화할 수 있습니다.
4. **계산 함수는 순수하게 작성합니다.** 외부 시스템을 변경하거나 입력 데이터를 직접 수정하지 않아야 합니다.
5. **단순한 계산에는 일반적인 변수를 사용합니다.** 불필요한 메모이제이션으로 코드 복잡도를 높이지 않아야 합니다.
6. **useEffect와 역할을 구분합니다.** 계산 결과는 렌더링 과정에서 처리하고 외부 시스템과의 동기화는 Effect에서 처리합니다.
7. **useCallback과 목적을 구분합니다.** 값의 재사용에는 `useMemo`, 함수 참조의 재사용에는 `useCallback`을 사용합니다.
8. **캐시의 영속성을 가정하지 않습니다.** `useMemo`는 상태 저장 기능이 아닌 성능 최적화 기능입니다.
9. **React Compiler의 적용 여부를 고려합니다.** Compiler가 자동으로 최적화하는 환경에서는 불필요한 수동 메모이제이션을 줄일 수 있습니다.
10. **실제 성능 측정을 기반으로 적용합니다.** 최적화 전후의 렌더링과 계산 비용을 비교해야 합니다.

## 참고 자료

### React 공식 문서

- [useMemo – React API Reference](https://react.dev/reference/react/useMemo)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Skipping Re-rendering with memo](https://react.dev/reference/react/memo)
- [useCallback – React API Reference](https://react.dev/reference/react/useCallback)
- [StrictMode – React API Reference](https://react.dev/reference/react/StrictMode)
- [React Compiler](https://react.dev/learn/react-compiler)
- [React Compiler Introduction](https://react.dev/learn/react-compiler/introduction)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

### 관련 개발 도구

- [React Developer Tools](https://react.dev/learn/react-developer-tools)