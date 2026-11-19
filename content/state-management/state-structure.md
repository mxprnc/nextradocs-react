# State Structure

## 1. 개요

React에서 State Structure는 컴포넌트가 관리하는 상태(State)의 개수, 데이터 형태, 관계 및 배치 방식을 설계하는 개념입니다.

상태 구조를 적절하게 설계하면 컴포넌트의 상태 변경을 예측하기 쉬워지고, 데이터 간 불일치나 불필요한 상태 업데이트로 발생하는 오류를 줄일 수 있습니다.

React에서는 상태를 단순히 필요한 데이터를 저장하는 공간으로 취급하기보다, **UI를 표현하는 데 필요한 최소한의 변경 가능 데이터 집합**으로 설계하는 것이 중요합니다.

예를 들어 사용자 입력을 기반으로 전체 이름을 표시하는 컴포넌트에서는 다음 두 가지 방식으로 상태를 관리할 수 있습니다.

```tsx
import { useState } from 'react';

function UserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  // ...
}
```

위 구조에서는 `fullName`이 `firstName`과 `lastName`으로부터 계산될 수 있음에도 별도의 상태로 관리하고 있습니다.

이러한 중복 상태는 데이터가 변경될 때마다 관련 상태를 함께 업데이트해야 하므로 동기화 문제가 발생할 수 있습니다.

반면 파생 가능한 데이터는 렌더링 과정에서 계산하도록 구성할 수 있습니다.

```tsx
import { useState } from 'react';

function UserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = `${firstName} ${lastName}`;

  return (
    <div>
      <input
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />

      <input
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />

      <p>{fullName}</p>
    </div>
  );
}
```

이처럼 상태 구조는 단순히 데이터의 형태를 결정하는 작업이 아니라, 애플리케이션에서 데이터의 일관성과 UI의 예측 가능성을 유지하기 위한 설계 과정입니다.

## 2. 상태 구조 설계 원칙

React에서는 상태 구조를 설계할 때 다음 원칙을 고려하는 것이 좋습니다.

1. 관련된 상태는 함께 그룹화합니다.
2. 서로 모순되는 상태가 존재하지 않도록 설계합니다.
3. 중복되거나 파생 가능한 상태를 최소화합니다.
4. 동일한 데이터를 여러 위치에 중복 저장하지 않습니다.
5. 지나치게 깊은 중첩 구조를 피합니다.

### 2.1. 관련된 상태 그룹화 (Group Related State)

항상 함께 변경되는 상태는 하나의 객체나 배열로 그룹화하는 것이 좋습니다.

예를 들어 화면에서 마우스 포인터의 좌표를 관리하는 경우 `x`와 `y`는 하나의 위치 정보를 구성하며 일반적으로 함께 업데이트됩니다.

각각의 상태 변수로 분리하는 방식은 다음과 같습니다.

```tsx
import { useState } from 'react';

function MovingDot() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    setX(event.clientX);
    setY(event.clientY);
  }

  return (
    <div onPointerMove={handlePointerMove}>
      <div
        style={{
          position: 'absolute',
          transform: `translate(${x}px, ${y}px)`,
        }}
      />
    </div>
  );
}
```

두 상태를 하나의 객체로 그룹화하면 다음과 같습니다.

```tsx
import { useState } from 'react';

function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  }

  return (
    <div onPointerMove={handlePointerMove}>
      <div
        style={{
          position: 'absolute',
          transform: `translate(
            ${position.x}px,
            ${position.y}px
          )`,
        }}
      />
    </div>
  );
}
```

두 방식 모두 유효하지만, 두 값이 항상 하나의 데이터 단위로 변경된다면 객체로 그룹화하는 편이 상태 간의 관계를 명확하게 표현할 수 있습니다.

다만 상태를 무조건 하나의 객체로 통합할 필요는 없습니다.

서로 독립적으로 변경되는 값이라면 별도의 상태 변수로 관리하는 편이 더 적절할 수 있습니다.

**객체 상태 업데이트 시 주의사항**

`useState`는 객체의 일부 속성만 자동으로 병합하지 않습니다.

```tsx
const [position, setPosition] = useState({
  x: 0,
  y: 0,
});

// 기존 y 속성이 유지되지 않습니다.
setPosition({
  x: 100,
});
```

기존 속성을 유지하면서 일부 값만 변경하려면 전개 연산자를 사용해야 합니다.

```tsx
setPosition({
  ...position,
  x: 100,
});
```

또는 함수형 업데이트를 사용할 수 있습니다.

```tsx
setPosition((previousPosition) => ({
  ...previousPosition,
  x: 100,
}));
```

상태 객체의 일부 속성만 변경할 때에도 새로운 객체를 생성해야 합니다. 기존 상태 객체를 직접 수정하는 방식은 React의 상태 업데이트 원칙에 맞지 않습니다.

### 2.2. 모순되는 상태 방지 (Avoid Contradictions in State)

상태 구조는 동시에 성립할 수 없는 여러 상태가 함께 존재하지 않도록 설계해야 합니다.

예를 들어 데이터를 전송하는 UI에서 다음과 같이 상태를 관리한다고 가정하겠습니다.

```tsx
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);
```

이 구조에서는 두 상태가 동시에 `true`가 되는 상황을 허용합니다.

그러나 전송 중인 상태와 전송이 완료된 상태는 일반적으로 동시에 성립할 수 없습니다.

각 상태의 변경을 별도로 관리하면 특정 업데이트를 누락했을 때 논리적으로 잘못된 상태가 만들어질 수 있습니다.

이러한 경우 단일 상태 변수와 판별 가능한 상태값을 사용하는 것이 좋습니다.

```tsx
type SubmissionStatus =
  | 'typing'
  | 'sending'
  | 'sent';

function FeedbackForm() {
  const [status, setStatus] =
    useState<SubmissionStatus>('typing');

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  async function handleSubmit() {
    setStatus('sending');

    await sendMessage();

    setStatus('sent');
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit();
      }}
    >
      <button disabled={isSending}>
        Send
      </button>

      {isSending && <p>Sending...</p>}
      {isSent && <p>Message sent.</p>}
    </form>
  );
}

async function sendMessage(): Promise<void> {
  // API 요청 처리
}
```

TypeScript의 문자열 리터럴 유니온 타입을 활용하면 허용되는 상태를 명시적으로 제한할 수 있습니다.

이러한 방식은 상태의 가능한 조합을 제한하고, 상태 전이의 의미를 명확하게 표현하는 데 도움이 됩니다.

상태가 더 복잡해지면 Discriminated Union을 활용하여 각 상태에 필요한 데이터까지 함께 정의할 수 있습니다.

```tsx
type RequestState<T> =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'error';
      error: Error;
    };
```

위 구조에서는 성공 상태에만 `data`가 존재하고, 오류 상태에만 `error`가 존재합니다.

따라서 서로 관련된 상태와 데이터가 잘못된 조합으로 사용되는 상황을 TypeScript 수준에서 방지할 수 있습니다.

### 2.3. 중복 상태 방지 (Avoid Redundant State)

다른 상태나 Props로부터 계산할 수 있는 값은 별도의 State로 관리하지 않는 것이 좋습니다.

예를 들어 사용자 이름을 입력받고 전체 이름을 출력하는 경우를 살펴보겠습니다.

다음 코드는 `fullName`을 별도의 상태로 관리합니다.

```tsx
import { useState } from 'react';

function UserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

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
      <input
        value={firstName}
        onChange={(event) =>
          handleFirstNameChange(event.target.value)
        }
      />

      <input
        value={lastName}
        onChange={(event) =>
          handleLastNameChange(event.target.value)
        }
      />

      <p>{fullName}</p>
    </div>
  );
}
```

이 방식은 이름이 변경될 때마다 `fullName`도 함께 업데이트해야 합니다.

새로운 입력 필드나 데이터 처리 로직이 추가되면 관련 상태를 모두 동기화해야 하므로 유지보수 비용이 증가합니다.

대신 기존 상태를 기반으로 렌더링 과정에서 계산할 수 있습니다.

```tsx
import { useState } from 'react';

function UserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = `${firstName} ${lastName}`;

  return (
    <div>
      <input
        value={firstName}
        onChange={(event) =>
          setFirstName(event.target.value)
        }
      />

      <input
        value={lastName}
        onChange={(event) =>
          setLastName(event.target.value)
        }
      />

      <p>{fullName}</p>
    </div>
  );
}
```

이처럼 기존 State 또는 Props를 기반으로 계산되는 값은 파생 상태(Derived State)라고 합니다.

파생 가능한 값을 별도의 State로 저장하지 않으면 데이터의 단일 원천을 유지할 수 있으며, 상태 간 동기화 문제도 줄일 수 있습니다.

**파생 상태와 메모이제이션**

계산 비용이 큰 파생 데이터는 `useMemo`를 이용해 계산 결과를 캐싱할 수 있습니다.

```tsx
import { useMemo, useState } from 'react';

function ProductList({
  products,
}: {
  products: Product[];
}) {
  const [keyword, setKeyword] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(keyword.toLowerCase())
    );
  }, [products, keyword]);

  return (
    <div>
      <input
        value={keyword}
        onChange={(event) =>
          setKeyword(event.target.value)
        }
      />

      <ul>
        {filteredProducts.map((product) => (
          <li key={product.id}>
            {product.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

type Product = {
  id: number;
  name: string;
};
```

`filteredProducts`는 여전히 State가 아니라 파생 데이터입니다.

`useMemo`는 계산 결과를 최적화하기 위한 메커니즘이며, 상태의 원본 데이터를 별도로 관리하는 수단은 아닙니다.

### 2.4. 중복 데이터 방지 (Avoid Duplication in State)

동일한 데이터를 여러 상태 변수에 저장하면 데이터의 일관성을 유지하기 어려워집니다.

특히 객체나 배열을 상태로 관리할 때 동일한 객체가 여러 위치에 중복 저장되는 상황을 주의해야 합니다.

예를 들어 상품 목록과 선택된 상품을 각각 State로 관리하는 경우를 살펴보겠습니다.

```tsx
const [products, setProducts] = useState<Product[]>([]);
const [selectedProduct, setSelectedProduct] =
  useState<Product | null>(null);
```

`selectedProduct`는 `products` 배열에 포함된 객체와 동일한 데이터를 참조할 수 있습니다.

이후 상품 목록에서 특정 상품의 가격을 변경하더라도 `selectedProduct`가 별도로 관리되고 있다면 서로 다른 데이터가 표시될 수 있습니다.

이러한 문제를 방지하려면 선택된 객체 자체보다 해당 객체를 식별할 수 있는 ID를 상태로 저장하는 것이 좋습니다.

```tsx
import { useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: number;
};

function ProductList({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] =
    useState(initialProducts);

  const [selectedProductId, setSelectedProductId] =
    useState<number | null>(null);

  const selectedProduct =
    products.find(
      (product) => product.id === selectedProductId
    ) ?? null;

  return (
    <div>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <button
              onClick={() =>
                setSelectedProductId(product.id)
              }
            >
              {product.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <p>
          {selectedProduct.name}: {selectedProduct.price}
        </p>
      )}
    </div>
  );
}
```

선택된 상품의 실제 데이터는 `products`에서 조회하고, State에는 식별자인 `selectedProductId`만 저장합니다.

이 구조에서는 상품 정보가 변경되더라도 선택된 상품을 별도로 동기화할 필요가 없습니다.

특히 목록에서 항목을 선택하거나, 특정 데이터를 활성화하거나, 여러 객체 중 하나를 선택하는 UI에서는 ID를 기반으로 상태를 관리하는 방식이 유용합니다.

### 2.5. 깊은 중첩 구조 방지 (Avoid Deeply Nested State)

상태 객체가 지나치게 깊은 계층 구조를 가지면 특정 데이터를 변경하거나 삭제할 때 여러 단계의 객체를 복사해야 합니다.

예를 들어 여행 계획 데이터를 다음과 같이 구성할 수 있습니다.

```tsx
type Place = {
  id: number;
  title: string;
  childPlaces: Place[];
};

const initialPlan: Place = {
  id: 0,
  title: 'World',
  childPlaces: [
    {
      id: 1,
      title: 'Asia',
      childPlaces: [
        {
          id: 2,
          title: 'South Korea',
          childPlaces: [],
        },
        {
          id: 3,
          title: 'Japan',
          childPlaces: [],
        },
      ],
    },
  ],
};
```

이 구조에서 특정 국가를 삭제하려면 해당 국가가 포함된 객체뿐 아니라 상위 객체도 모두 새로운 객체로 생성해야 합니다.

```tsx
setPlan((previousPlan) => ({
  ...previousPlan,
  childPlaces: previousPlan.childPlaces.map(
    (continent) => ({
      ...continent,
      childPlaces: continent.childPlaces.filter(
        (country) => country.id !== 2
      ),
    })
  ),
}));
```

계층 구조가 깊어질수록 업데이트 로직이 복잡해지고, 특정 데이터의 변경을 위해 여러 상위 객체를 복사해야 합니다.

이러한 경우 상태를 평탄화(Flattening)하거나 정규화(Normalization)하는 방식을 고려할 수 있습니다.

**평탄화된 상태 구조**

```tsx
type PlaceRecord = {
  id: number;
  title: string;
  childIds: number[];
};

type PlaceState = Record<number, PlaceRecord>;

const initialPlan: PlaceState = {
  0: {
    id: 0,
    title: 'World',
    childIds: [1],
  },
  1: {
    id: 1,
    title: 'Asia',
    childIds: [2, 3],
  },
  2: {
    id: 2,
    title: 'South Korea',
    childIds: [],
  },
  3: {
    id: 3,
    title: 'Japan',
    childIds: [],
  },
};
```

각 객체는 하위 객체 전체를 직접 포함하지 않고, 하위 객체의 ID만 참조합니다.

이렇게 구성하면 데이터의 계층 관계와 실제 데이터 저장 구조를 분리할 수 있습니다.

특정 국가를 삭제하는 경우에는 상위 객체의 `childIds`와 전체 데이터 객체를 각각 업데이트하면 됩니다.

```tsx
import { useState } from 'react';

function TravelPlan() {
  const [plan, setPlan] =
    useState<PlaceState>(initialPlan);

  function removePlace(
    parentId: number,
    targetId: number
  ) {
    setPlan((previousPlan) => {
      const parent = previousPlan[parentId];

      return {
        ...previousPlan,

        [parentId]: {
          ...parent,
          childIds: parent.childIds.filter(
            (id) => id !== targetId
          ),
        },
      };
    });
  }

  return (
    <div>
      {/* Travel plan UI */}
    </div>
  );
}
```

위 예제는 부모의 참조 관계를 제거하는 기본적인 구현입니다. 실제 삭제 기능에서는 삭제 대상의 하위 데이터와 참조 관계도 함께 정리해야 합니다.

상태 평탄화는 다음과 같은 장점을 제공합니다.

- 특정 데이터에 ID를 이용해 직접 접근할 수 있습니다.
- 중첩 객체의 업데이트 범위를 줄일 수 있습니다.
- 동일한 데이터가 여러 계층에 중복 저장되는 것을 방지할 수 있습니다.
- 객체 간 참조 관계를 명확하게 표현할 수 있습니다.

다만 모든 상태를 평탄화해야 하는 것은 아닙니다. 데이터의 규모와 관계가 단순하다면 일반적인 객체와 배열로 관리하는 편이 더 읽기 쉽습니다.

## 3. Props와 State의 관계

Props를 State로 복사하는 패턴은 상태 구조를 설계할 때 주의해야 하는 대표적인 사례입니다.

다음 예제에서는 부모 컴포넌트로부터 전달받은 `messageColor`를 State로 초기화합니다.

```tsx
import { useState } from 'react';

type MessageProps = {
  messageColor: string;
};

function Message({
  messageColor,
}: MessageProps) {
  const [color, setColor] =
    useState(messageColor);

  return (
    <p style={{ color }}>
      Message
    </p>
  );
}
```

`useState`의 초기값은 컴포넌트가 처음 렌더링될 때 사용됩니다.

따라서 부모 컴포넌트에서 `messageColor`가 변경되더라도 기존 `color` State가 자동으로 변경되지는 않습니다.

Props의 최신 값을 그대로 사용하려면 State로 복사하지 않고 Props를 직접 참조해야 합니다.

```tsx
type MessageProps = {
  messageColor: string;
};

function Message({
  messageColor,
}: MessageProps) {
  return (
    <p style={{ color: messageColor }}>
      Message
    </p>
  );
}
```

다만 Props를 State로 초기화하는 방식이 항상 잘못된 것은 아닙니다.

부모로부터 전달받은 초기값을 기반으로 독립적인 편집 상태를 구성하고, 이후 부모의 변경을 반영하지 않으려는 경우에는 사용할 수 있습니다.

이러한 의도를 명확하게 표현하려면 `initial` 또는 `default` 접두사를 사용하는 것이 좋습니다.

```tsx
import { useState } from 'react';

type EditorProps = {
  initialTitle: string;
};

function Editor({
  initialTitle,
}: EditorProps) {
  const [title, setTitle] =
    useState(initialTitle);

  return (
    <input
      value={title}
      onChange={(event) =>
        setTitle(event.target.value)
      }
    />
  );
}
```

이 경우 `initialTitle`은 초기값으로만 사용되며, 이후 변경되는 Props를 자동으로 반영하지 않습니다.

## 4. 컴포넌트와 상태의 배치

상태 구조를 설계할 때는 데이터의 형태뿐 아니라 상태를 어느 컴포넌트에서 관리할지도 고려해야 합니다.

모든 상태를 하나의 상위 컴포넌트에서 관리할 필요는 없습니다.

특정 컴포넌트에서만 사용되는 일시적인 UI 상태는 해당 컴포넌트 내부에 두는 것이 적절합니다.

예를 들어 마우스 Hover 여부, 입력 필드의 임시 열림 상태, 개별 메뉴의 확장 여부 등은 다른 컴포넌트와 공유할 필요가 없다면 해당 컴포넌트에서 관리할 수 있습니다.

반면 여러 컴포넌트가 동일한 상태를 기반으로 동작해야 한다면 공통 상위 컴포넌트에서 상태를 관리하는 방식을 고려해야 합니다.

이러한 상태 배치와 공유 방식은 다음 개념과 밀접하게 관련됩니다.

- Lifting State Up
- Sharing State Between Components
- State Colocation
- Context API
- External State Management

## 5. TypeScript를 활용한 상태 구조 설계

TypeScript는 상태의 데이터 구조와 허용되는 값을 명시적으로 정의할 수 있도록 지원합니다.

특히 복잡한 UI 상태를 관리할 때 타입을 통해 잘못된 데이터 구조나 상태 조합을 방지할 수 있습니다.

**5.1. 명시적인 상태 타입 정의**

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

type UserState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};
```

상태가 관리하는 데이터의 구조를 타입으로 정의하면 컴포넌트에서 사용하는 상태의 의미와 제약 조건을 명확하게 표현할 수 있습니다.

**5.2. Union Type을 이용한 상태 모델링**

```tsx
type AsyncState<T> =
  | {
      status: 'idle';
    }
  | {
      status: 'loading';
    }
  | {
      status: 'success';
      data: T;
    }
  | {
      status: 'error';
      error: string;
    };

type User = {
  id: number;
  name: string;
};

type UserState = AsyncState<User>;
```

위 구조는 비동기 요청의 진행 상태를 하나의 상태 모델로 표현합니다.

각 상태에 필요한 데이터만 포함하도록 구성할 수 있으므로 불필요하거나 모순되는 상태 조합을 방지할 수 있습니다.

**5.3. Record를 이용한 정규화된 상태**

```tsx
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodoState = {
  todosById: Record<number, Todo>;
  todoIds: number[];
  selectedTodoId: number | null;
};
```

`Record`를 활용하면 ID를 기준으로 데이터를 관리하는 객체 구조를 명시적으로 정의할 수 있습니다.

이 방식은 목록 데이터와 선택 상태를 분리하고, 데이터에 대한 접근 및 변경을 단순화하는 데 유용합니다.

## 6. 상태 구조 설계 시 고려사항

상태 구조는 무조건 단순하거나 평탄해야 하는 것이 아니라, 실제 데이터의 관계와 업데이트 방식에 적합해야 합니다.

다음 사항을 고려하여 상태를 설계하는 것이 좋습니다.

| 고려사항 | 권장 방식 |
|---|---|
| 항상 함께 변경되는 데이터 | 하나의 객체나 배열로 그룹화 |
| 서로 배타적인 UI 상태 | Union Type 또는 단일 상태 변수 사용 |
| 기존 상태로 계산 가능한 데이터 | 렌더링 과정에서 계산 |
| 여러 위치에 중복되는 데이터 | 단일 원천 유지 |
| 목록에서 선택된 객체 | 객체보다 ID 저장 |
| 깊은 계층의 데이터 | 필요에 따라 평탄화 |
| 특정 컴포넌트에서만 사용하는 UI 상태 | 해당 컴포넌트 내부에 배치 |
| 여러 컴포넌트가 공유하는 상태 | 공통 상위 컴포넌트 또는 공유 상태 관리 방식 활용 |

또한 상태 구조를 설계할 때 다음 사항을 구분해야 합니다.

- **State:** 사용자 상호작용이나 외부 이벤트에 따라 변경되며 UI를 갱신하는 데 필요한 데이터입니다.
- **Props:** 부모 컴포넌트에서 전달하는 읽기 전용 입력 데이터입니다.
- **Derived Data:** 기존 Props 또는 State를 기반으로 계산할 수 있는 데이터입니다.
- **Ref:** 렌더링 결과에 영향을 주지 않는 값을 유지하거나 DOM 요소 등에 접근하기 위한 데이터입니다.

이러한 구분은 불필요한 State 생성을 방지하고 각 데이터의 책임을 명확하게 만드는 데 도움이 됩니다.

## 7. 정리

React에서 상태 구조는 컴포넌트의 데이터 관리 방식과 UI의 일관성을 결정하는 중요한 설계 요소입니다.

효율적인 상태 구조를 위해서는 다음 원칙을 유지하는 것이 좋습니다.

1. 함께 변경되는 데이터는 하나의 상태로 그룹화합니다.
2. 서로 모순되는 상태가 만들어지지 않도록 상태 모델을 설계합니다.
3. Props나 기존 State에서 계산할 수 있는 데이터는 별도의 State로 저장하지 않습니다.
4. 동일한 데이터를 여러 위치에 중복 저장하지 않고 ID를 이용해 참조하는 방식을 고려합니다.
5. 깊은 중첩 구조는 필요에 따라 평탄화하여 업데이트 복잡도를 줄입니다.
6. Props와 State의 역할을 구분하고, 상태가 필요한 컴포넌트에 적절하게 배치합니다.
7. TypeScript의 Union Type과 명시적인 타입 정의를 활용하여 잘못된 상태 조합을 방지합니다.

궁극적으로 좋은 상태 구조는 **최소한의 데이터를 유지하면서 상태 간의 관계를 명확하게 표현하고, 일관성 있는 UI를 구현할 수 있도록 설계된 구조**입니다.

## 8. 참고자료

### React 공식 문서

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) — 상태 구조 설계 원칙, 중복 상태 방지, 데이터 그룹화 및 평탄화
- [Managing State](https://react.dev/learn/managing-state) — React의 상태 관리 개념 및 컴포넌트 간 상태 공유
- [Thinking in React](https://react.dev/learn/thinking-in-react) — 최소한의 UI 상태를 식별하고 데이터 흐름을 설계하는 방법
- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) — 여러 컴포넌트에서 상태를 공유하는 방법

### TypeScript 공식 문서

- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) — TypeScript의 기본 타입 및 Union Type
- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) — 객체 타입 및 속성 구조 정의
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) — Record 등 내장 유틸리티 타입