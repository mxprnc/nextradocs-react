# Lifting State Up

## 1. 개요

Lifting State Up은 여러 컴포넌트가 동일한 상태를 공유하거나 서로의 상태 변경에 영향을 주어야 할 때, 해당 상태를 가장 가까운 공통 부모 컴포넌트(Common Parent Component)로 이동하는 설계 패턴입니다.

React에서는 각 컴포넌트가 독립적인 State를 가질 수 있습니다. 그러나 여러 컴포넌트가 동일한 데이터를 기반으로 동작해야 한다면 각각의 컴포넌트에서 상태를 개별적으로 관리하는 방식은 데이터 동기화 문제를 발생시킬 수 있습니다.

이러한 문제를 해결하기 위해 공유해야 하는 State를 공통 부모 컴포넌트로 이동하고, 자식 컴포넌트에는 Props를 통해 상태를 전달합니다.

자식 컴포넌트에서 상태 변경이 필요한 경우에는 부모 컴포넌트가 전달한 이벤트 핸들러를 호출하도록 구성합니다.

Lifting State Up의 핵심 구조는 다음과 같습니다.

- 공통 부모 컴포넌트가 공유 State를 소유합니다.
- 부모 컴포넌트는 State를 Props로 자식 컴포넌트에 전달합니다.
- 자식 컴포넌트는 전달받은 이벤트 핸들러를 호출하여 부모의 State 변경을 요청합니다.
- 부모 컴포넌트가 State를 변경하면 해당 State를 전달받는 자식 컴포넌트들이 새로운 Props를 기반으로 다시 렌더링됩니다.

이러한 구조는 React의 단방향 데이터 흐름(One-Way Data Flow)을 유지하면서 여러 컴포넌트 간의 상태를 일관되게 관리할 수 있도록 합니다.

## 2. Lifting State Up이 필요한 이유

### 2.1. 독립적인 State 관리의 한계

각 컴포넌트가 동일한 목적의 상태를 독립적으로 관리하면 상태 변경이 다른 컴포넌트에 자동으로 반영되지 않습니다.

예를 들어 두 개의 입력 컴포넌트가 동일한 텍스트를 표시해야 하는 상황을 가정하겠습니다.

각 입력 컴포넌트가 자체 State를 관리하는 경우 다음과 같이 구현할 수 있습니다.

```tsx
import { useState } from 'react';

type InputProps = {
  label: string;
};

function Input({ label }: InputProps) {
  const [text, setText] = useState('');

  return (
    <label>
      {label}
      <input
        value={text}
        onChange={(event) =>
          setText(event.target.value)
        }
      />
    </label>
  );
}

function SyncedInputs() {
  return (
    <>
      <Input label="First Input" />
      <Input label="Second Input" />
    </>
  );
}
```

위 구조에서는 각 `Input` 컴포넌트가 독립적인 `text` State를 가지고 있습니다.

따라서 첫 번째 입력 필드의 값이 변경되더라도 두 번째 입력 필드의 값에는 영향을 주지 않습니다.

각 컴포넌트의 State는 서로 다른 컴포넌트 인스턴스에 속하기 때문에 자동으로 공유되지 않습니다.

두 입력 필드가 항상 동일한 값을 표시하도록 만들려면 두 컴포넌트가 동일한 State를 참조하도록 구조를 변경해야 합니다.

### 2.2. 공통 부모 컴포넌트 활용

두 입력 컴포넌트가 공유해야 하는 State를 공통 부모인 `SyncedInputs`로 이동하면 문제를 해결할 수 있습니다.

```tsx
import { useState } from 'react';

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Input({
  label,
  value,
  onChange,
}: InputProps) {
  return (
    <label>
      {label}
      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function SyncedInputs() {
  const [text, setText] = useState('');

  return (
    <>
      <Input
        label="First Input"
        value={text}
        onChange={setText}
      />

      <Input
        label="Second Input"
        value={text}
        onChange={setText}
      />
    </>
  );
}
```

이제 두 입력 컴포넌트는 동일한 `text` State를 기반으로 동작합니다.

첫 번째 입력 필드에서 텍스트를 변경하면 `setText`가 부모 컴포넌트의 State를 업데이트합니다. 부모 컴포넌트가 다시 렌더링되면서 새로운 `text` 값이 두 자식 컴포넌트에 전달됩니다.

그 결과 두 입력 필드는 항상 동일한 값을 표시합니다.

이처럼 여러 컴포넌트가 공유해야 하는 State를 공통 부모로 이동하는 것이 Lifting State Up입니다.

## 3. Lifting State Up의 구현 과정

Lifting State Up은 일반적으로 다음 세 단계로 진행됩니다.

### 3.1. 자식 컴포넌트의 State 제거

먼저 공유해야 하는 State를 각 자식 컴포넌트에서 제거합니다.

기존에는 다음과 같이 자식 컴포넌트가 자체 State를 관리했습니다.

```tsx
function Panel() {
  const [isActive, setIsActive] = useState(false);

  // ...
}
```

상태를 부모 컴포넌트에서 관리하도록 변경하면 `isActive`를 Props로 전달받도록 수정합니다.

```tsx
type PanelProps = {
  isActive: boolean;
};

function Panel({ isActive }: PanelProps) {
  // ...
}
```

이제 `Panel`은 자신의 활성화 여부를 직접 결정하지 않고 부모 컴포넌트가 전달한 값을 기반으로 동작합니다.

### 3.2. 공통 부모 컴포넌트에서 상태 전달

두 자식 컴포넌트가 공유해야 하는 State를 관리할 가장 가까운 공통 부모를 찾습니다.

예를 들어 다음과 같은 컴포넌트 구조가 존재한다고 가정하겠습니다.

```text
Accordion
├── Panel
└── Panel
```

`Accordion`은 두 `Panel`의 공통 부모이므로 공유 State를 관리하기에 적절한 위치입니다.

부모 컴포넌트에서 각 자식 컴포넌트에 Props를 전달합니다.

```tsx
function Accordion() {
  return (
    <>
      <Panel isActive={true} />
      <Panel isActive={false} />
    </>
  );
}
```

이 단계에서는 부모 컴포넌트가 전달하는 값을 통해 자식 컴포넌트의 동작을 제어할 수 있습니다.

### 3.3. 부모 컴포넌트에서 State 및 이벤트 핸들러 관리

마지막으로 부모 컴포넌트에서 실제 State를 관리하고, 자식 컴포넌트가 State 변경을 요청할 수 있도록 이벤트 핸들러를 Props로 전달합니다.

```tsx
import { useState } from 'react';

type PanelProps = {
  title: string;
  isActive: boolean;
  onShow: () => void;
  children: React.ReactNode;
};

function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        About content
      </Panel>

      <Panel
        title="Details"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Details content
      </Panel>
    </>
  );
}

function Panel({
  title,
  isActive,
  onShow,
  children,
}: PanelProps) {
  return (
    <section>
      <h3>{title}</h3>

      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

`Accordion`은 `activeIndex`를 통해 현재 활성화된 패널을 관리합니다.

각 `Panel`에는 다음 두 가지 Props가 전달됩니다.

- `isActive`: 현재 패널이 활성화되었는지를 나타냅니다.
- `onShow`: 해당 패널을 활성화하기 위한 이벤트 핸들러입니다.

사용자가 특정 패널의 버튼을 클릭하면 `onShow`가 실행되고, 부모 컴포넌트의 `activeIndex`가 변경됩니다.

부모 컴포넌트가 다시 렌더링되면서 각 `Panel`에 전달되는 `isActive` 값이 변경됩니다.

이 과정에서 한 패널이 활성화되면 다른 패널은 자동으로 비활성화됩니다.

## 4. 상태 공유와 단방향 데이터 흐름

Lifting State Up은 React의 단방향 데이터 흐름을 기반으로 동작합니다.

React에서는 일반적으로 부모 컴포넌트에서 자식 컴포넌트로 Props를 전달합니다.

반면 자식 컴포넌트에서 부모 컴포넌트의 State를 직접 변경할 수는 없습니다.

대신 부모 컴포넌트가 제공하는 이벤트 핸들러를 호출하여 상태 변경을 요청합니다.

전체적인 데이터 흐름은 다음과 같습니다.

```text
              Parent Component
              ┌───────────────┐
              │  State        │
              │  setState     │
              └───────┬───────┘
                      │
                Props 전달
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Child Component A       Child Component B
    ┌────────────────┐      ┌────────────────┐
    │ value          │      │ value          │
    │ onChange       │      │ onChange       │
    └───────┬────────┘      └───────┬────────┘
            │                       │
            └───────────┬───────────┘
                        │
                 이벤트 핸들러 호출
                        │
                        ▼
                 Parent State 변경
                        │
                        ▼
                  자식 재렌더링
```

이를 정리하면 다음과 같습니다.

1. 부모 컴포넌트가 State를 소유합니다.
2. 부모 컴포넌트가 State를 Props로 자식 컴포넌트에 전달합니다.
3. 자식 컴포넌트는 전달받은 이벤트 핸들러를 호출합니다.
4. 부모 컴포넌트가 State를 업데이트합니다.
5. 변경된 State가 새로운 Props로 전달되면서 관련 자식 컴포넌트가 다시 렌더링됩니다.

이러한 구조에서는 상태를 실제로 변경하는 컴포넌트가 명확하므로 데이터 흐름을 추적하고 오류를 분석하기 쉽습니다.

## 5. Controlled Component와 Uncontrolled Component

Lifting State Up은 Controlled Component와 Uncontrolled Component의 차이를 이해하는 데에도 중요합니다.

### 5.1. Uncontrolled Component

Uncontrolled Component는 중요한 UI 상태를 컴포넌트 자체의 State로 관리하는 컴포넌트입니다.

```tsx
import { useState } from 'react';

function Panel() {
  const [isActive, setIsActive] = useState(false);

  return (
    <section>
      {isActive ? (
        <p>Panel Content</p>
      ) : (
        <button
          onClick={() => setIsActive(true)}
        >
          Show
        </button>
      )}
    </section>
  );
}
```

이 컴포넌트의 활성화 여부는 내부 State에 의해 결정됩니다.

부모 컴포넌트는 별도의 Props를 전달하지 않는 한 해당 상태를 직접 제어할 수 없습니다.

Uncontrolled Component는 자체적으로 동작하기 때문에 사용하기 간단하지만, 여러 컴포넌트 간의 상태를 조정하기에는 제한적입니다.

### 5.2. Controlled Component

Controlled Component는 중요한 UI 상태를 부모 컴포넌트가 전달하는 Props를 통해 제어하는 컴포넌트입니다.

```tsx
type PanelProps = {
  isActive: boolean;
  onShow: () => void;
};

function Panel({
  isActive,
  onShow,
}: PanelProps) {
  return (
    <section>
      {isActive ? (
        <p>Panel Content</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

이 컴포넌트는 자체적으로 활성화 상태를 관리하지 않습니다.

대신 부모 컴포넌트에서 전달한 `isActive` 값에 따라 UI를 결정합니다.

부모 컴포넌트는 Props를 변경함으로써 자식 컴포넌트의 동작을 제어할 수 있습니다.

### 5.3. Controlled와 Uncontrolled의 비교

| 구분 | Controlled Component | Uncontrolled Component |
|---|---|---|
| 주요 상태 관리 | 부모 컴포넌트 | 컴포넌트 내부 |
| 상태 전달 | Props | 내부 State |
| 상태 변경 | 부모의 상태 업데이트 | 자체 상태 업데이트 |
| 컴포넌트 간 동기화 | 상대적으로 용이 | 별도 조정 필요 |
| 재사용성 | 제어 범위가 넓음 | 독립적인 사용에 적합 |
| 구현 복잡도 | 상대적으로 높음 | 상대적으로 낮음 |

Controlled와 Uncontrolled는 엄격한 React API 구분이 아니라 컴포넌트의 상태 관리 방식을 설명하는 설계 용어입니다.

하나의 컴포넌트가 일부 상태는 Props로 제어하고 다른 상태는 자체 State로 관리하는 것도 가능합니다.

예를 들어 모달 컴포넌트의 표시 여부는 부모가 제어하면서, 모달 내부의 임시 입력값은 컴포넌트 자체에서 관리할 수 있습니다.

## 6. Single Source of Truth

Lifting State Up은 Single Source of Truth 원칙과 밀접하게 관련됩니다.

Single Source of Truth는 특정 데이터에 대해 하나의 명확한 상태 소유자를 유지하는 설계 원칙입니다.

여러 컴포넌트가 동일한 데이터를 필요로 한다고 해서 각 컴포넌트에 동일한 State를 복제하는 대신, 하나의 컴포넌트가 해당 State를 소유하고 필요한 컴포넌트에 전달하는 방식입니다.

예를 들어 여러 컴포넌트에서 현재 선택된 상품을 표시해야 하는 경우 다음과 같이 구성할 수 있습니다.

```tsx
import { useState } from 'react';

type Product = {
  id: number;
  name: string;
};

type ProductDetailProps = {
  product: Product | null;
};

function ProductApp() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  return (
    <>
      <ProductList
        selectedProduct={selectedProduct}
        onSelect={setSelectedProduct}
      />

      <ProductDetail
        product={selectedProduct}
      />
    </>
  );
}

function ProductList({
  selectedProduct,
  onSelect,
}: {
  selectedProduct: Product | null;
  onSelect: (product: Product) => void;
}) {
  const products: Product[] = [
    { id: 1, name: 'Keyboard' },
    { id: 2, name: 'Mouse' },
  ];

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <button
            onClick={() => onSelect(product)}
            aria-pressed={
              selectedProduct?.id === product.id
            }
          >
            {product.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

function ProductDetail({
  product,
}: ProductDetailProps) {
  if (!product) {
    return <p>Select a product.</p>;
  }

  return <p>Selected: {product.name}</p>;
}
```

`ProductApp`이 선택된 상품의 유일한 State 소유자입니다.

`ProductList`는 상품 선택을 요청하고, `ProductDetail`은 선택된 상품을 표시합니다.

두 자식 컴포넌트는 동일한 상태를 기반으로 동작하므로 데이터의 일관성을 유지할 수 있습니다.

Single Source of Truth는 모든 애플리케이션 상태를 하나의 컴포넌트에 모아야 한다는 의미는 아닙니다.

각각의 독립적인 상태에 대해 적절한 소유자를 지정하고, 해당 상태를 필요로 하는 컴포넌트가 공유하도록 구성하는 것이 핵심입니다.

## 7. Lifting State Up의 적용 범위와 한계

Lifting State Up은 여러 컴포넌트가 공유하는 상태를 관리하는 효과적인 방법이지만, 모든 상태를 최상위 컴포넌트로 이동해야 한다는 의미는 아닙니다.

### 7.1. 가장 가까운 공통 부모 선택

상태는 해당 상태를 사용하는 모든 컴포넌트의 가장 가까운 공통 부모에 배치하는 것이 일반적입니다.

너무 낮은 위치에 배치하면 필요한 컴포넌트가 상태를 공유할 수 없고, 너무 높은 위치에 배치하면 불필요하게 많은 컴포넌트가 해당 상태의 변경에 영향을 받을 수 있습니다.

따라서 상태를 사용하는 컴포넌트의 관계를 기준으로 적절한 소유자를 결정해야 합니다.

### 7.2. 과도한 상태 끌어올리기 방지

특정 컴포넌트에서만 사용하는 일시적인 UI 상태까지 부모 컴포넌트로 이동할 필요는 없습니다.

예를 들어 버튼의 Hover 여부나 특정 입력 필드의 임시 상태처럼 독립적으로 관리할 수 있는 데이터는 해당 컴포넌트 내부에 유지하는 편이 적절할 수 있습니다.

불필요한 상태 끌어올리기는 부모 컴포넌트의 책임을 증가시키고 Props 전달 구조를 복잡하게 만들 수 있습니다.

### 7.3. Props Drilling

공유 State를 여러 단계 위의 부모 컴포넌트로 이동하면 중간 컴포넌트들이 해당 State를 직접 사용하지 않더라도 Props를 전달해야 할 수 있습니다.

이러한 현상을 Props Drilling이라고 합니다.

```text
App
 │
 ├── state
 │
 ▼
Layout
 │
 ▼
Page
 │
 ▼
Section
 │
 ▼
Child
```

`Child`에서 필요한 State를 전달하기 위해 `Layout`, `Page`, `Section`이 중간에서 Props를 전달하는 구조입니다.

컴포넌트 계층이 깊어지고 동일한 데이터를 여러 경로로 전달해야 한다면 Context API를 고려할 수 있습니다.

Context API는 부모 컴포넌트에서 하위 컴포넌트에 데이터를 제공하고, 중간 컴포넌트에서 명시적으로 Props를 전달하지 않아도 해당 데이터에 접근할 수 있도록 합니다.

다만 Context API는 Lifting State Up의 대체 개념이라기보다 컴포넌트 트리에서 상태를 전달하는 방식을 보완하는 수단입니다.

### 7.4. 상태 변경에 따른 렌더링 범위

부모 컴포넌트의 State가 변경되면 해당 부모 컴포넌트가 다시 렌더링됩니다.

이때 부모 컴포넌트가 반환하는 자식 컴포넌트들도 기본적으로 다시 렌더링될 수 있습니다.

상태를 불필요하게 상위 컴포넌트로 이동하면 상태 변경과 관계없는 컴포넌트까지 렌더링 작업에 포함될 가능성이 있습니다.

따라서 상태를 필요한 컴포넌트의 공통 부모에 배치하고, 실제 성능 문제가 확인되는 경우 컴포넌트 분리나 `memo` 등의 최적화 기법을 고려하는 것이 좋습니다.

## 8. Lifting State Up과 다른 상태 관리 방식

Lifting State Up은 React에서 컴포넌트 간 상태를 공유하는 기본적인 방법입니다.

다만 애플리케이션의 규모와 상태의 사용 범위에 따라 다른 방식과 함께 사용하거나 별도의 상태 관리 구조를 고려할 수 있습니다.

| 방식 | 주요 목적 | 특징 |
|---|---|---|
| Lifting State Up | 가까운 컴포넌트 간 상태 공유 | 공통 부모가 State 소유 |
| Context API | 깊은 컴포넌트 트리에서 데이터 공유 | 중간 Props 전달 감소 |
| useReducer | 복잡한 상태 변경 로직 관리 | 상태 전이 로직을 Reducer로 분리 |
| External State Management | 여러 영역에서 공유하는 상태 관리 | React 컴포넌트 외부의 상태 저장소 활용 |

일반적으로 가까운 컴포넌트 사이에서 상태를 공유하는 경우에는 Lifting State Up부터 고려하는 것이 좋습니다.

상태를 사용하는 컴포넌트가 멀리 떨어져 있거나 여러 하위 영역에서 공통 데이터를 필요로 한다면 Context API를 검토할 수 있습니다.

복잡한 상태 전이 로직을 관리해야 한다면 `useReducer`를 함께 사용할 수 있습니다.

애플리케이션 전반에서 광범위하게 공유되는 상태를 관리해야 한다면 외부 상태 관리 라이브러리의 도입도 고려할 수 있습니다.

## 9. 정리

Lifting State Up은 여러 컴포넌트가 동일한 상태를 공유하거나 상태 변경을 서로 동기화해야 할 때 사용하는 React의 기본적인 상태 관리 패턴입니다.

핵심 원칙은 다음과 같습니다.

1. 여러 컴포넌트가 공유해야 하는 State를 가장 가까운 공통 부모 컴포넌트로 이동합니다.
2. 부모 컴포넌트가 공유 State의 유일한 소유자가 되도록 구성합니다.
3. State는 Props를 통해 부모에서 자식으로 전달합니다.
4. 자식 컴포넌트는 이벤트 핸들러를 호출하여 부모의 State 변경을 요청합니다.
5. 부모 컴포넌트의 State가 변경되면 새로운 Props를 전달받은 자식 컴포넌트가 변경된 상태를 반영합니다.
6. 모든 상태를 상위 컴포넌트로 이동하지 않고, 실제 공유 범위에 맞는 위치에 배치합니다.

Lifting State Up은 단순히 State의 위치를 변경하는 기법이 아니라, 컴포넌트 간 데이터 소유권과 데이터 흐름을 명확하게 정의하는 설계 방식입니다.

이를 통해 상태 동기화 문제를 줄이고, 컴포넌트 간의 책임을 분리하며, 예측 가능한 UI 업데이트 구조를 유지할 수 있습니다.

## 10. 참고자료

### React 공식 문서

- [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) — Lifting State Up의 개념, 구현 단계, Controlled 및 Uncontrolled Component
- [Managing State](https://react.dev/learn/managing-state) — React 상태 관리의 전반적인 개념과 상태 공유 방법
- [Thinking in React](https://react.dev/learn/thinking-in-react) — 컴포넌트 구조와 데이터 흐름을 설계하는 방법
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) — Context API를 이용한 깊은 컴포넌트 트리의 데이터 공유
- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) — 복잡한 상태 변경 로직을 Reducer로 분리하는 방법
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) — 컴포넌트 트리에서 State가 유지되거나 초기화되는 원리

### 관련 개념

- [One-Way Data Flow](../fundamentals/one-way-data-flow.md) — React의 단방향 데이터 흐름
- [State Structure](./state-structure.md) — 상태 구조 설계 원칙
- [Sharing State](./sharing-state.md) — 컴포넌트 간 상태 공유
- [Context API](./context-api.md) — Context를 이용한 데이터 전달
- [Reducer Pattern](./reducer-pattern.md) — Reducer 기반 상태 관리