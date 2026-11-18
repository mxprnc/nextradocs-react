# useCallback

## 1. useCallback이란?

`useCallback`은 함수 자체를 메모이제이션(Memoization)하여 컴포넌트의 렌더링 사이에 동일한 함수 참조를 재사용할 수 있도록 하는 Hook입니다.

React 컴포넌트는 State나 Props가 변경되면 다시 렌더링됩니다. 이때 컴포넌트 내부에서 선언한 함수도 렌더링마다 새롭게 생성됩니다.

JavaScript에서 함수는 객체와 마찬가지로 참조 타입이므로, 함수의 구현 내용이 동일하더라도 새롭게 생성된 함수는 이전 함수와 다른 참조를 가집니다.

이러한 특성은 `React.memo`를 사용하는 하위 컴포넌트의 불필요한 렌더링이나 다른 Hook의 의존성 비교에 영향을 줄 수 있습니다.

`useCallback`은 의존성 배열의 값이 변경되지 않았다면 이전에 생성한 함수 참조를 재사용합니다.

```tsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

대표적인 사용 사례는 다음과 같습니다.

- `React.memo`로 최적화된 하위 컴포넌트에 함수 전달
- `useEffect`의 의존성으로 사용되는 함수의 참조 안정화
- 다른 Hook에 전달하는 함수의 참조 안정화
- Custom Hook에서 반환하는 함수의 참조 안정화
- Callback Ref의 불필요한 재연결 방지

`useCallback`은 성능 최적화를 위한 기능이며, 함수의 실행 결과나 컴포넌트의 상태를 관리하기 위한 기능은 아닙니다.

## 2. 기본 문법

`useCallback`은 함수와 의존성 배열을 인자로 전달받습니다.

```tsx
const cachedFunction = useCallback(fn, dependencies);
```

- `fn`: 메모이제이션할 함수입니다.
- `dependencies`: 함수 내부에서 참조하는 반응형 값의 배열입니다.
- `cachedFunction`: 메모이제이션된 함수입니다.

React는 최초 렌더링에서 전달받은 함수를 저장합니다.

이후 렌더링에서는 의존성 배열의 값이 변경되었는지 확인합니다.

- 의존성이 변경되지 않았다면 이전 함수 참조를 반환합니다.
- 의존성이 변경되었다면 새로 전달된 함수 참조를 저장하고 반환합니다.

의존성 비교에는 `Object.is`가 사용됩니다.

### 2.1. 기본 사용 예제

```tsx
import { useCallback, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('현재 count:', count);
  }, [count]);

  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  );
}
```

`handleClick`은 `count`를 참조하므로 `count`를 의존성 배열에 포함해야 합니다.

`count`가 변경되지 않았다면 이전 렌더링에서 생성한 함수 참조를 재사용합니다.

`count`가 변경되면 새로운 함수 참조를 반환합니다.

### 2.2. 의존성 배열

의존성 배열에는 함수 내부에서 사용하는 모든 반응형 값을 포함해야 합니다.

```tsx
function SearchButton({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  const handleSearch = useCallback(() => {
    searchItems(query, category);
  }, [query, category]);

  return (
    <button onClick={handleSearch}>
      검색
    </button>
  );
}
```

위 예제에서는 `query`와 `category`를 모두 참조하므로 두 값을 의존성 배열에 포함해야 합니다.

반응형 값에는 일반적으로 Props, State, 컴포넌트 내부에서 선언한 변수와 함수 등이 포함됩니다.

의존성 배열에서 필요한 값을 임의로 제외하면 함수가 오래된 값을 참조하는 문제가 발생할 수 있습니다.

## 3. useCallback의 동작 원리

`useCallback`은 최초 렌더링과 이후 렌더링에서 다음과 같이 동작합니다.

### 3.1. 최초 렌더링

컴포넌트가 최초 렌더링되면 전달된 함수와 의존성을 저장합니다.

```tsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

최초 렌더링에서는 전달된 함수가 저장되고 해당 함수 참조가 반환됩니다.

### 3.2. 의존성이 변경되지 않은 경우

다음 렌더링에서 의존성 배열의 값이 이전 렌더링과 동일하면 이전 함수 참조를 재사용합니다.

```tsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

빈 의존성 배열을 사용하므로 일반적인 업데이트 렌더링에서는 동일한 함수 참조를 반환합니다.

### 3.3. 의존성이 변경된 경우

의존성 중 하나라도 이전 값과 다르면 새로운 함수 참조를 저장하고 반환합니다.

```tsx
const handleClick = useCallback(() => {
  console.log('현재 count:', count);
}, [count]);
```

`count`가 변경되면 새로운 함수 참조가 반환됩니다.

새로운 함수는 해당 렌더링에서 참조하는 최신 `count` 값을 사용합니다.

### 3.4. 빈 의존성 배열

빈 의존성 배열을 전달하면 일반적인 업데이트 렌더링에서는 최초 렌더링에서 저장한 함수 참조를 재사용합니다.

```tsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

단, 함수 내부에서 Props나 State 등 변경될 수 있는 값을 참조한다면 빈 의존성 배열을 사용하는 것이 적절하지 않을 수 있습니다.

의존성 배열은 함수 참조를 유지하기 위한 설정이 아니라 함수가 참조하는 반응형 값의 변경을 추적하기 위한 선언입니다.

또한 `useCallback`은 캐시의 영구적인 유지를 보장하지 않습니다. React는 특정 상황에서 캐시를 폐기할 수 있으므로 함수 참조가 반드시 유지되어야 하는 비즈니스 로직을 구현하는 용도로 사용해서는 안 됩니다.

## 4. useCallback과 React.memo

`React.memo`는 컴포넌트의 Props가 변경되지 않았을 때 불필요한 렌더링을 줄이는 데 사용합니다.

하지만 부모 컴포넌트에서 함수를 매번 새롭게 생성하여 전달하면 Props의 참조가 변경된 것으로 판단되어 최적화가 제대로 적용되지 않을 수 있습니다.

이때 `useCallback`을 함께 활용할 수 있습니다.

### 4.1. 메모이제이션이 없는 경우

```tsx
import { memo, useState } from 'react';

const Child = memo(function Child({
  onClick,
}: {
  onClick: () => void;
}) {
  console.log('Child rendered');

  return (
    <button onClick={onClick}>
      자식 컴포넌트 버튼
    </button>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('Child clicked');
  };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <Child onClick={handleClick} />
    </>
  );
}
```

`count`가 변경되면 `Parent`가 다시 렌더링됩니다.

이 과정에서 `handleClick`도 새로운 함수로 생성됩니다.

`Child`는 `memo`로 감싸져 있지만 `onClick` Props의 참조가 변경되었으므로 다시 렌더링됩니다.

### 4.2. useCallback 적용

```tsx
import { memo, useCallback, useState } from 'react';

const Child = memo(function Child({
  onClick,
}: {
  onClick: () => void;
}) {
  console.log('Child rendered');

  return (
    <button onClick={onClick}>
      자식 컴포넌트 버튼
    </button>
  );
});

function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log('Child clicked');
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <Child onClick={handleClick} />
    </>
  );
}
```

`handleClick`의 의존성 배열이 비어 있으므로 일반적인 업데이트 렌더링에서는 동일한 함수 참조가 유지됩니다.

따라서 `count`만 변경된 경우 `Child`의 Props가 변경되지 않았으므로 `memo`의 최적화 대상이 될 수 있습니다.

### 4.3. 두 기능의 역할

| 구분 | useCallback | React.memo |
| --- | --- | --- |
| 최적화 대상 | 함수 참조 | 컴포넌트 렌더링 |
| 주요 목적 | 함수 참조 안정화 | 불필요한 렌더링 방지 |
| 비교 대상 | 의존성 배열 | Props |
| 반환값 | 메모이제이션된 함수 | 메모이제이션된 컴포넌트 |

두 기능은 서로 다른 최적화 지점을 담당하며 함께 사용할 수 있습니다.

다만 `useCallback`을 적용했다고 하위 컴포넌트의 렌더링이 항상 생략되는 것은 아닙니다. 다른 Props가 변경되거나 Context가 변경되는 경우 등에는 하위 컴포넌트가 다시 렌더링될 수 있습니다.

## 5. useCallback과 useMemo 비교

`useCallback`과 `useMemo`는 모두 의존성 배열을 기준으로 이전 결과를 재사용하는 Hook입니다.

차이는 메모이제이션하는 대상입니다.

- `useCallback`: 함수 자체를 메모이제이션합니다.
- `useMemo`: 계산 함수의 실행 결과를 메모이제이션합니다.

### 5.1. useCallback

```tsx
const handleClick = useCallback(() => {
  console.log(value);
}, [value]);
```

함수 자체의 참조를 재사용합니다.

### 5.2. useMemo

```tsx
const result = useMemo(() => {
  return calculate(value);
}, [value]);
```

계산 함수가 반환한 결과를 재사용합니다.

### 5.3. 내부적인 관계

`useCallback`은 다음과 같은 형태의 `useMemo`로 이해할 수 있습니다.

```tsx
const handleClick = useMemo(() => {
  return () => {
    console.log(value);
  };
}, [value]);
```

두 Hook의 차이를 정리하면 다음과 같습니다.

| 구분 | useCallback | useMemo |
| --- | --- | --- |
| 캐싱 대상 | 함수 | 계산 결과 |
| 주요 반환값 | 함수 | 값 |
| 계산 함수 실행 | 메모이제이션 대상 함수를 실행하지 않음 | 전달된 계산 함수를 실행 |
| 주요 사용 사례 | 함수 참조 안정화 | 복잡한 계산 및 객체·배열 참조 안정화 |

`useCallback`에 전달한 함수는 Hook 내부에서 실행되지 않습니다. 반환된 함수를 이벤트 핸들러나 다른 함수에서 호출할 때 실행됩니다.

## 6. useCallback과 useEffect

`useEffect`는 의존성 배열에 포함된 값이 변경되면 Effect를 다시 실행합니다.

함수를 컴포넌트 내부에서 선언하고 Effect의 의존성으로 사용하면 렌더링마다 함수 참조가 변경되어 Effect가 불필요하게 반복 실행될 수 있습니다.

### 6.1. 함수 참조로 인한 Effect 재실행

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  function createOptions() {
    return {
      serverUrl: 'https://example.com',
      roomId,
    };
  }

  useEffect(() => {
    const options = createOptions();

    const connection = createConnection(options);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [createOptions]);

  return <h1>{roomId}</h1>;
}
```

`createOptions`는 렌더링마다 새로운 함수 참조로 생성됩니다.

따라서 `roomId`가 변경되지 않았더라도 컴포넌트가 다시 렌더링되면 Effect의 의존성이 변경된 것으로 판단될 수 있습니다.

### 6.2. useCallback으로 함수 참조 안정화

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://example.com',
      roomId,
    };
  }, [roomId]);

  useEffect(() => {
    const options = createOptions();

    const connection = createConnection(options);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [createOptions]);

  return <h1>{roomId}</h1>;
}
```

`roomId`가 변경되지 않았다면 `createOptions`의 참조가 유지됩니다.

따라서 다른 이유로 컴포넌트가 다시 렌더링되더라도 해당 함수의 참조가 변경되지 않아 Effect가 불필요하게 다시 실행되는 것을 방지할 수 있습니다.

### 6.3. Effect 내부로 함수 이동

다만 Effect에서만 사용하는 함수라면 반드시 `useCallback`으로 메모이제이션할 필요는 없습니다.

함수를 Effect 내부로 이동하면 의존성 자체를 단순화할 수 있습니다.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const options = {
      serverUrl: 'https://example.com',
      roomId,
    };

    const connection = createConnection(options);
    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <h1>{roomId}</h1>;
}
```

이 방식은 함수 참조를 관리할 필요가 없으므로 더 단순합니다.

Effect 내부에서만 사용하는 함수라면 Effect 내부로 이동하는 방법을 우선적으로 고려해야 합니다.

## 7. useCallback과 클로저

JavaScript 함수는 선언된 시점의 렉시컬 환경(Lexical Environment)을 기억합니다.

이를 클로저(Closure)라고 합니다.

`useCallback`으로 메모이제이션된 함수 역시 함수가 생성된 렌더링 시점의 Props와 State를 참조합니다.

따라서 의존성 배열에서 필요한 값을 제외하면 오래된 값을 참조하는 문제가 발생할 수 있습니다.

### 7.1. 의존성 누락으로 인한 Stale Closure

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log(count);
  }, []);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      <button onClick={handleClick}>
        현재 값 출력
      </button>
    </>
  );
}
```

위 예제에서 `handleClick`은 최초 렌더링 시점의 `count`를 참조합니다.

의존성 배열이 비어 있으므로 이후 `count`가 변경되어도 함수 참조가 갱신되지 않습니다.

따라서 버튼을 클릭하면 최신 `count`가 아닌 최초 렌더링의 값을 출력하게 됩니다.

이러한 문제를 Stale Closure라고 합니다.

### 7.2. 의존성 추가

```tsx
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

`count`를 의존성 배열에 포함하면 값이 변경될 때 새로운 함수가 생성됩니다.

새로운 함수는 최신 `count`를 참조합니다.

### 7.3. Functional Update 활용

State의 현재 값만 읽어 새로운 값을 계산해야 한다면 Functional Update를 활용하여 의존성을 줄일 수 있습니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = useCallback(() => {
    setCount(previousCount => previousCount + 1);
  }, []);

  return (
    <button onClick={handleIncrement}>
      Count: {count}
    </button>
  );
}
```

`setCount`는 React에서 안정적인 함수 참조를 제공하므로 의존성 배열에 포함하지 않아도 됩니다.

또한 이전 State를 인자로 전달받기 때문에 `count`를 직접 참조할 필요가 없습니다.

이러한 방식은 불필요한 함수 재생성을 줄이는 데 도움이 됩니다.

## 8. Custom Hook에서 useCallback 활용

Custom Hook에서 함수를 반환하는 경우에도 `useCallback`을 활용할 수 있습니다.

Custom Hook을 사용하는 컴포넌트가 해당 함수를 다른 Hook의 의존성으로 사용하거나 메모이제이션된 하위 컴포넌트에 전달할 수 있기 때문입니다.

### 8.1. Custom Hook 예제

```tsx
import { useCallback, useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(previousCount => previousCount + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(previousCount => previousCount - 1);
  }, []);

  return {
    count,
    increment,
    decrement,
  };
}
```

`increment`와 `decrement`는 의존성 배열이 비어 있으므로 일반적인 업데이트 렌더링에서 동일한 함수 참조를 재사용합니다.

### 8.2. Custom Hook 사용

```tsx
function Counter() {
  const { count, increment, decrement } = useCounter();

  return (
    <>
      <h1>{count}</h1>

      <button onClick={increment}>
        증가
      </button>

      <button onClick={decrement}>
        감소
      </button>
    </>
  );
}
```

Custom Hook이 반환하는 함수를 다른 컴포넌트나 Hook에서 전달받아 사용할 때도 참조 안정성을 유지할 수 있습니다.

다만 반환 객체 자체는 Custom Hook이 실행될 때마다 새롭게 생성될 수 있습니다.

객체 전체의 참조 안정화가 필요한 상황이라면 별도로 `useMemo`를 고려할 수 있습니다.

## 9. Callback Ref와 useCallback

Callback Ref는 DOM 요소가 연결되거나 해제될 때 실행되는 함수 형태의 Ref입니다.

Callback Ref를 컴포넌트 내부에서 매번 새롭게 생성하면 React는 이전 Callback Ref가 해제되고 새로운 Callback Ref가 연결된 것으로 처리할 수 있습니다.

이러한 불필요한 연결 및 해제 작업을 방지하기 위해 `useCallback`을 활용할 수 있습니다.

### 9.1. Callback Ref 예제

```tsx
function Input() {
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  }, []);

  return <input ref={inputRef} />;
}
```

`inputRef`는 일반적인 업데이트 렌더링에서 동일한 함수 참조를 유지합니다.

따라서 Callback Ref의 참조가 불필요하게 변경되는 것을 방지할 수 있습니다.

### 9.2. React 19의 Callback Ref Cleanup

React 19에서는 Callback Ref가 Cleanup 함수를 반환할 수 있습니다.

```tsx
function Component() {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(() => {
      console.log('크기 변경');
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={ref}>Resize Observer</div>;
}
```

DOM 요소가 연결되면 Observer를 등록하고, Ref가 해제될 때 반환한 Cleanup 함수가 실행되어 Observer를 정리합니다.

이때도 Callback Ref의 참조가 불필요하게 변경되지 않도록 `useCallback`을 활용할 수 있습니다.

## 10. TypeScript와 useCallback

`useCallback`은 함수의 타입을 추론할 수 있으므로 일반적인 사용에서는 타입을 별도로 지정하지 않아도 됩니다.

### 10.1. 매개변수가 없는 함수

```tsx
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

함수의 타입은 `() => void`로 추론됩니다.

### 10.2. 매개변수가 있는 함수

```tsx
const handleSearch = useCallback((keyword: string) => {
  console.log(keyword);
}, []);
```

매개변수와 반환 타입을 명시할 수 있습니다.

### 10.3. 이벤트 핸들러

```tsx
const handleChange = useCallback(
  (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  },
  [],
);
```

React 이벤트 타입을 활용하여 이벤트 핸들러의 타입을 지정할 수 있습니다.

### 10.4. 함수 Props

하위 컴포넌트에 전달하는 함수의 타입도 명확하게 정의할 수 있습니다.

```tsx
type ChildProps = {
  onSubmit: (value: string) => void;
};

function Child({ onSubmit }: ChildProps) {
  return (
    <button onClick={() => onSubmit('React')}>
      제출
    </button>
  );
}

function Parent() {
  const handleSubmit = useCallback((value: string) => {
    console.log(value);
  }, []);

  return <Child onSubmit={handleSubmit} />;
}
```

`ChildProps`에서 함수의 매개변수와 반환 타입을 정의하므로 부모 컴포넌트와 자식 컴포넌트 사이의 함수 계약을 명확하게 유지할 수 있습니다.

## 11. React Compiler와 useCallback

React Compiler는 컴포넌트의 렌더링 과정에서 발생하는 불필요한 계산과 함수 재생성을 자동으로 최적화할 수 있는 컴파일러입니다.

Compiler가 활성화된 프로젝트에서는 컴포넌트와 Hook의 값을 자동으로 메모이제이션할 수 있으므로 수동으로 `useCallback`을 작성해야 하는 상황을 줄일 수 있습니다.

```tsx
function Parent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <Child onClick={handleClick} />
    </>
  );
}
```

React Compiler가 적용된 환경에서는 `handleClick`과 같은 함수도 자동으로 최적화할 수 있습니다.

다만 다음 사항을 고려해야 합니다.

- React Compiler가 프로젝트에 실제로 설정되어 있어야 합니다.
- 컴파일러가 최적화할 수 있는 코드 구조를 유지해야 합니다.
- 컴파일러가 적용되지 않은 환경에서는 수동 최적화가 필요할 수 있습니다.
- 컴파일러를 사용하더라도 실제 성능 측정과 코드 구조 개선은 중요합니다.

React Compiler가 활성화되어 있다면 불필요한 수동 메모이제이션을 줄이고 컴파일러의 최적화 기능을 활용하는 것이 좋습니다.

## 12. useCallback 사용 시 주의사항

### 12.1. 모든 함수에 사용하지 않습니다

모든 함수에 `useCallback`을 적용할 필요는 없습니다.

메모이제이션에는 의존성 비교와 캐시 관리 비용이 발생합니다.

실제 성능 문제가 확인되었거나 함수 참조의 안정성이 필요한 경우에 적용하는 것이 좋습니다.

### 12.2. 의존성을 임의로 생략하지 않습니다

함수 내부에서 참조하는 반응형 값을 의존성 배열에 모두 포함해야 합니다.

의존성이 누락되면 오래된 Props나 State를 참조하는 Stale Closure 문제가 발생할 수 있습니다.

### 12.3. 함수 실행 결과를 캐싱하지 않습니다

`useCallback`은 함수 자체를 메모이제이션합니다.

함수의 실행 결과를 캐싱하려면 `useMemo`를 사용해야 합니다.

### 12.4. 함수 참조 안정성과 실행 횟수를 구분합니다

`useCallback`은 함수 참조를 안정화하는 기능입니다.

함수가 실행되는 횟수를 자동으로 제한하거나 이벤트가 중복 발생하는 것을 방지하지는 않습니다.

특정 함수의 실행 횟수를 제어해야 한다면 별도의 로직을 구현해야 합니다.

### 12.5. 캐시의 영속성을 가정하지 않습니다

`useCallback`은 성능 최적화를 위한 기능입니다.

React는 특정 상황에서 캐시를 폐기할 수 있으므로 함수 참조가 컴포넌트 생명주기 동안 반드시 유지된다고 가정해서는 안 됩니다.

함수 참조의 영속성이 비즈니스 로직의 정확성을 결정하도록 구현해서는 안 됩니다.

### 12.6. Effect 내부에서만 사용하는 함수라면 이동을 고려합니다

Effect에서만 사용하는 함수라면 `useCallback`으로 메모이제이션하는 것보다 Effect 내부로 이동하는 방법이 더 단순할 수 있습니다.

이렇게 하면 함수 참조를 별도로 관리할 필요가 없어집니다.

### 12.7. React Compiler 적용 여부를 고려합니다

React Compiler가 활성화되어 있다면 함수 참조 안정화를 위한 수동 메모이제이션을 줄일 수 있습니다.

컴파일러의 적용 여부와 프로젝트의 최적화 전략을 함께 고려해야 합니다.

## 13. useCallback 사용 원칙

`useCallback`을 효과적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **함수 참조 안정성이 필요한 경우에 적용합니다.** `React.memo`를 사용하는 하위 컴포넌트에 전달하는 함수나 다른 Hook의 의존성으로 사용하는 함수 등을 대상으로 합니다.
2. **의존성을 정확하게 선언합니다.** 함수 내부에서 참조하는 반응형 값을 모두 포함해야 합니다.
3. **Stale Closure를 주의합니다.** 의존성을 임의로 생략하지 않고 필요한 경우 Functional Update를 활용합니다.
4. **useMemo와 목적을 구분합니다.** 함수 참조의 재사용에는 `useCallback`, 계산 결과의 재사용에는 `useMemo`를 사용합니다.
5. **Effect 내부로 이동할 수 있는 함수를 검토합니다.** Effect에서만 사용하는 함수라면 불필요한 메모이제이션을 피할 수 있습니다.
6. **Custom Hook의 반환 함수에 활용할 수 있습니다.** Hook을 사용하는 컴포넌트에서 함수 참조의 안정성이 필요한 경우 적용합니다.
7. **Callback Ref의 참조 안정화에 활용할 수 있습니다.** 불필요한 Ref 연결 및 해제 작업을 방지할 수 있습니다.
8. **모든 함수에 적용하지 않습니다.** 실제 성능 문제가 확인되거나 참조 안정성이 필요한 경우에만 적용합니다.
9. **캐시의 영속성을 가정하지 않습니다.** `useCallback`은 함수 참조를 재사용하기 위한 성능 최적화 기능입니다.
10. **React Compiler의 적용 여부를 고려합니다.** 자동 메모이제이션이 적용된 환경에서는 수동 최적화를 줄일 수 있습니다.

## 참고 자료

### React 공식 문서

- [useCallback – React API Reference](https://react.dev/reference/react/useCallback)
- [useMemo – React API Reference](https://react.dev/reference/react/useMemo)
- [memo – React API Reference](https://react.dev/reference/react/memo)
- [useEffect – React API Reference](https://react.dev/reference/react/useEffect)
- [useRef – React API Reference](https://react.dev/reference/react/useRef)
- [useState – React API Reference](https://react.dev/reference/react/useState)
- [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [React Compiler](https://react.dev/learn/react-compiler)
- [React Compiler Introduction](https://react.dev/learn/react-compiler/introduction)

### 관련 개발 도구

- [React Developer Tools](https://react.dev/learn/react-developer-tools)