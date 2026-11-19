# Generic Components

Generic Component는 TypeScript의 Generic을 활용하여 다양한 데이터 타입을 처리할 수 있도록 설계한 React 컴포넌트입니다.

일반적인 컴포넌트는 특정 데이터 타입을 기준으로 Props를 정의하는 경우가 많습니다. 반면 Generic Component는 데이터 타입을 외부에서 전달받거나 Props를 통해 추론하여 여러 데이터 구조에서 재사용할 수 있습니다.

예를 들어 문자열 목록, 숫자 목록, 객체 목록을 각각 별도의 컴포넌트로 구현하는 대신 하나의 Generic Component로 처리할 수 있습니다.

Generic Component는 다음과 같은 상황에서 유용합니다.

- 여러 데이터 타입을 지원하는 목록 및 테이블 컴포넌트
- 데이터 타입에 따라 동작하는 Select 및 Dropdown 컴포넌트
- 제네릭 데이터의 렌더링을 위임하는 컴포넌트
- 공통 데이터 구조를 처리하는 Form 및 Input 컴포넌트
- 재사용 가능한 UI 라이브러리 및 디자인 시스템

## 1. Generic Components 기본 개념

TypeScript의 Generic은 타입을 매개변수처럼 전달하여 재사용 가능한 타입과 함수를 정의하는 기능입니다.

React 컴포넌트에서도 Generic을 사용할 수 있습니다.

### 1.1 Basic Generic Component

일반적인 컴포넌트는 Props의 데이터 타입을 고정하여 정의합니다.

```tsx
type ListProps = {
  items: string[];
};

function List({ items }: ListProps) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

위 컴포넌트는 문자열 배열만 전달받을 수 있습니다.

숫자나 객체 배열을 처리하려면 별도의 타입과 컴포넌트를 정의해야 합니다.

Generic을 사용하면 이러한 제약을 줄일 수 있습니다.

```tsx
type ListProps<T> = {
  items: T[];
};

function List<T>({ items }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{String(item)}</li>
      ))}
    </ul>
  );
}
```

`ListProps<T>`에서 `T`는 컴포넌트가 처리할 데이터 타입을 나타냅니다.

컴포넌트의 Generic 매개변수 `T`는 `items`의 요소 타입과 연결됩니다.

```tsx
<List items={["React", "TypeScript"]} />

<List items={[10, 20, 30]} />

<List items={[true, false]} />
```

각 사용 방식에서 TypeScript는 전달된 배열을 기준으로 `T`를 추론합니다.

### 1.2 Explicit Generic Type

필요하다면 Generic 타입을 명시적으로 지정할 수 있습니다.

```tsx
<List<string> items={["React", "TypeScript"]} />

<List<number> items={[10, 20, 30]} />
```

일반적으로는 Props를 통해 타입을 추론할 수 있으므로 명시적인 Generic 지정은 필수는 아닙니다.

다만 타입 추론이 충분하지 않거나 특정 타입을 명확하게 지정해야 하는 경우에는 명시적으로 전달하는 것이 좋습니다.

## 2. Generic Props

Generic Component를 설계할 때는 Props 타입에도 동일한 Generic 매개변수를 적용해야 합니다.

이를 통해 컴포넌트가 전달받는 데이터와 내부에서 사용하는 데이터의 타입을 일관되게 유지할 수 있습니다.

### 2.1 Generic Interface

Props가 여러 속성으로 구성되어 있다면 Interface로 정의할 수 있습니다.

```tsx
interface SelectProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
}

function Select<T>({
  options,
  value,
  onChange,
}: SelectProps<T>) {
  return (
    <div>
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onChange(option)}
        >
          {String(option)}
          {Object.is(value, option) ? " (Selected)" : ""}
        </button>
      ))}
    </div>
  );
}
```

`SelectProps<T>`는 다음 속성을 동일한 타입 `T`로 연결합니다.

| Prop | 타입 | 역할 |
|---|---|---|
| `options` | `T[]` | 선택 가능한 데이터 |
| `value` | `T \| null` | 현재 선택된 데이터 |
| `onChange` | `(value: T) => void` | 선택 변경 콜백 |

사용 예제는 다음과 같습니다.

```tsx
function Example() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Select
      options={[10, 20, 30]}
      value={selected}
      onChange={setSelected}
    />
  );
}
```

`options`가 `number[]`이므로 `T`는 `number`로 추론됩니다.

따라서 `value`와 `onChange`에도 동일한 타입이 적용됩니다.

### 2.2 Generic Props with Type Alias

Type Alias를 사용해도 동일한 구조를 정의할 수 있습니다.

```tsx
type TableProps<T> = {
  data: T[];
  onRowClick?: (row: T) => void;
};

function Table<T>({
  data,
  onRowClick,
}: TableProps<T>) {
  return (
    <div>
      {data.map((row, index) => (
        <div
          key={index}
          onClick={() => onRowClick?.(row)}
        >
          {String(row)}
        </div>
      ))}
    </div>
  );
}
```

Generic Props는 Interface와 Type Alias 모두에서 사용할 수 있습니다.

선택은 타입 확장 방식과 프로젝트의 코드 스타일에 따라 결정하면 됩니다.

## 3. Generic Constraints

Generic은 기본적으로 다양한 타입을 허용합니다.

하지만 컴포넌트 내부에서 특정 속성에 접근해야 한다면 타입의 조건을 제한해야 합니다.

이때 `extends`를 사용합니다.

### 3.1 Extends Constraint

다음 예제는 객체의 `id` 속성을 기준으로 목록을 렌더링하는 컴포넌트입니다.

```tsx
type Identifiable = {
  id: string | number;
};

type ListProps<T extends Identifiable> = {
  items: T[];
};

function List<T extends Identifiable>({
  items,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {String(item.id)}
        </li>
      ))}
    </ul>
  );
}
```

`T extends Identifiable`은 전달되는 타입이 `id` 속성을 반드시 포함해야 한다는 의미입니다.

따라서 컴포넌트 내부에서 `item.id`에 안전하게 접근할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

type Product = {
  id: string;
  price: number;
};

<List<User> items={users} />

<List<Product> items={products} />
```

반면 `id`가 없는 타입은 허용되지 않습니다.

```tsx
type Category = {
  name: string;
};

// Type Error
<List<Category> items={categories} />
```

Generic Constraint는 재사용성을 유지하면서 컴포넌트 내부에서 필요한 최소한의 타입 조건을 보장합니다.

### 3.2 keyof Constraint

`keyof`를 사용하면 객체의 속성 이름을 Generic으로 제한할 수 있습니다.

```tsx
type SortableTableProps<
  T,
  K extends keyof T,
> = {
  data: T[];
  sortKey: K;
};

function SortableTable<
  T,
  K extends keyof T,
>({
  data,
  sortKey,
}: SortableTableProps<T, K>) {
  const sortedData = [...data].sort((a, b) => {
    const first = a[sortKey];
    const second = b[sortKey];

    return String(first).localeCompare(String(second));
  });

  return (
    <ul>
      {sortedData.map((item, index) => (
        <li key={index}>
          {String(item[sortKey])}
        </li>
      ))}
    </ul>
  );
}
```

`K extends keyof T`는 `sortKey`가 데이터 타입 `T`에 실제로 존재하는 속성 이름이어야 한다는 의미입니다.

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

<SortableTable
  data={users}
  sortKey="name"
/>

// Type Error
<SortableTable
  data={users}
  sortKey="address"
/>
```

이 패턴은 테이블의 정렬 기준, 필드 선택, 데이터 접근 등의 기능을 구현할 때 유용합니다.

## 4. Generic Components with Render Props

Generic Component는 데이터를 직접 렌더링하는 대신 렌더링 함수를 Props로 전달받을 수 있습니다.

이러한 방식을 Render Props 패턴이라고 합니다.

### 4.1 Render Function

```tsx
type ListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
};

function List<T>({
  items,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );
}
```

`renderItem`은 현재 데이터와 인덱스를 전달받아 ReactNode를 반환합니다.

Generic 타입 `T`가 `items`와 `renderItem`에 함께 적용되므로 렌더링 함수에서도 데이터 타입을 추론할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
  },
];

function UserList() {
  return (
    <List
      items={users}
      renderItem={(user) => (
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
      )}
    />
  );
}
```

`renderItem` 내부의 `user`는 `User` 타입으로 추론됩니다.

따라서 별도의 타입 선언 없이도 `name`과 `email`에 접근할 수 있습니다.

### 4.2 Children as a Render Function

Children 자체를 함수로 정의하는 것도 가능합니다.

```tsx
type DataProviderProps<T> = {
  data: T;
  children: (data: T) => React.ReactNode;
};

function DataProvider<T>({
  data,
  children,
}: DataProviderProps<T>) {
  return <>{children(data)}</>;
}
```

사용하는 측에서 전달한 데이터에 맞게 렌더링 로직을 구성할 수 있습니다.

```tsx
<DataProvider data={{ name: "Alice", age: 30 }}>
  {(user) => (
    <p>
      {user.name}: {user.age}
    </p>
  )}
</DataProvider>
```

이 패턴은 데이터 공급과 렌더링 책임을 분리할 수 있다는 장점이 있습니다.

## 5. Generic Components with Multiple Type Parameters

Generic Component는 하나 이상의 타입 매개변수를 가질 수 있습니다.

서로 다른 데이터 타입 사이의 관계를 표현해야 할 때 유용합니다.

### 5.1 Multiple Generic Parameters

```tsx
type SelectProps<T, V> = {
  options: T[];
  getValue: (option: T) => V;
  onChange: (value: V) => void;
};

function Select<T, V>({
  options,
  getValue,
  onChange,
}: SelectProps<T, V>) {
  return (
    <ul>
      {options.map((option, index) => (
        <li key={index}>
          <button
            type="button"
            onClick={() => onChange(getValue(option))}
          >
            {String(getValue(option))}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

위 컴포넌트는 다음 두 가지 타입을 사용합니다.

- `T`: 실제 선택 항목의 데이터 타입
- `V`: 선택 항목에서 추출하는 값의 타입

예를 들어 객체 배열에서 ID만 선택값으로 전달할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

<Select
  options={users}
  getValue={(user) => user.id}
  onChange={(id) => {
    console.log(id);
  }}
/>
```

TypeScript는 `T`를 `User`, `V`를 `number`로 추론합니다.

따라서 `getValue`의 매개변수는 User이고 `onChange`의 매개변수는 number입니다.

### 5.2 Generic Relationships

여러 Generic 매개변수를 사용하면 데이터와 결과 사이의 관계를 타입으로 표현할 수 있습니다.

예를 들어 다음과 같은 관계를 정의할 수 있습니다.

```tsx
type MapperProps<T, R> = {
  items: T[];
  mapItem: (item: T) => R;
  renderItem: (result: R) => React.ReactNode;
};
```

`T`는 원본 데이터 타입이며 `R`은 변환 결과 타입입니다.

이처럼 Generic 매개변수는 단순히 여러 타입을 허용하는 역할뿐 아니라 서로 다른 타입 사이의 관계를 표현하는 역할도 수행합니다.

## 6. Generic Components with Default Types

Generic에는 기본 타입을 지정할 수 있습니다.

기본 타입을 지정하면 사용하는 측에서 Generic을 생략했을 때 해당 타입이 적용됩니다.

```tsx
type ListProps<T = string> = {
  items: T[];
};

function List<T = string>({
  items,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {String(item)}
        </li>
      ))}
    </ul>
  );
}
```

Generic을 생략하면 기본 타입인 `string`이 사용됩니다.

```tsx
<List items={["React", "TypeScript"]} />
```

다른 타입을 사용해야 한다면 Generic을 명시할 수 있습니다.

```tsx
<List<number> items={[1, 2, 3]} />
```

단, 기본 Generic 타입은 타입 추론보다 우선하는 고정값이 아닙니다. Props 등에서 다른 타입을 추론할 수 있다면 TypeScript는 추론된 타입을 사용할 수 있습니다.

기본 타입은 타입 추론이 충분하지 않거나 명시적인 기본 동작을 제공하고자 할 때 활용하는 것이 적절합니다.

## 7. Generic Components with React Hooks

Generic Component 내부에서도 React Hook을 사용할 수 있습니다.

특히 `useState`, `useReducer`, `useMemo` 등을 사용하면 Generic 데이터의 상태와 계산 결과를 타입 안정성을 유지하면서 관리할 수 있습니다.

### 7.1 Generic useState

```tsx
import { useState } from "react";

type SelectableListProps<T> = {
  items: T[];
};

function SelectableList<T>({
  items,
}: SelectableListProps<T>) {
  const [selected, setSelected] = useState<T | null>(null);

  return (
    <div>
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setSelected(item)}
        >
          {String(item)}
        </button>
      ))}

      <p>
        Selected: {selected === null ? "None" : String(selected)}
      </p>
    </div>
  );
}
```

`useState<T | null>`을 사용하면 선택된 데이터가 없거나 `T` 타입의 데이터가 선택된 상태를 표현할 수 있습니다.

### 7.2 Generic useReducer

Generic Component에서 Reducer를 사용하면 데이터 타입에 맞는 상태 전이 로직을 구성할 수 있습니다.

```tsx
import { useReducer } from "react";

type ListAction<T> =
  | { type: "add"; payload: T }
  | { type: "remove"; payload: number }
  | { type: "clear" };

function listReducer<T>(
  state: T[],
  action: ListAction<T>,
): T[] {
  switch (action.type) {
    case "add":
      return [...state, action.payload];

    case "remove":
      return state.filter((_, index) => index !== action.payload);

    case "clear":
      return [];

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}

type ListManagerProps<T> = {
  initialItems: T[];
};

function ListManager<T>({
  initialItems,
}: ListManagerProps<T>) {
  const [items, dispatch] = useReducer(
    listReducer<T>,
    initialItems,
  );

  return {
    items,
    dispatch,
  };
}
```

`ListAction<T>`의 `add` Action은 현재 목록과 동일한 데이터 타입을 전달받습니다.

따라서 서로 다른 데이터 타입이 혼합되는 것을 방지할 수 있습니다.

## 8. Generic Components and JSX

Generic Component를 JSX에서 사용할 때는 TypeScript와 JSX 문법 사이의 구문 차이를 고려해야 합니다.

### 8.1 Generic Function Component

일반적인 함수 선언 방식은 다음과 같습니다.

```tsx
function List<T>(props: ListProps<T>) {
  return <div>{/* ... */}</div>;
}
```

이 방식은 JSX와 충돌하지 않으므로 가장 간결하게 사용할 수 있습니다.

### 8.2 Arrow Function Component

화살표 함수로 Generic Component를 정의할 때는 다음과 같이 작성할 수 있습니다.

```tsx
const List = <T,>(props: ListProps<T>) => {
  return <div>{/* ... */}</div>;
};
```

TSX 파일에서 `<T>`는 JSX 태그의 시작으로 해석될 수 있습니다.

따라서 `<T,>`처럼 쉼표를 추가하여 Generic 매개변수 선언임을 명확하게 표현합니다.

또는 `extends`를 사용할 수도 있습니다.

```tsx
const List = <T extends unknown>(
  props: ListProps<T>,
) => {
  return <div>{/* ... */}</div>;
};
```

### 8.3 Generic Component Type

Generic Component의 타입을 별도로 정의할 수도 있습니다.

```tsx
type ListComponent = <T>(
  props: ListProps<T>,
) => React.ReactNode;

const List: ListComponent = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{String(item)}</li>
      ))}
    </ul>
  );
};
```

다만 React 컴포넌트의 반환 타입은 React 버전과 컴포넌트 유형에 따라 적절하게 선택해야 합니다.

일반적으로 함수 컴포넌트의 반환 타입을 TypeScript가 추론하도록 두는 방식이 간결합니다.

## 9. Generic Components with forwardRef

Ref를 전달받는 Generic Component는 React 버전에 따라 구현 방식이 달라집니다.

### 9.1 React 19

React 19에서는 함수형 컴포넌트가 `ref`를 일반 Prop으로 전달받을 수 있습니다.

따라서 Generic Props에 Ref 타입을 포함하여 구현할 수 있습니다.

```tsx
import type {
  ComponentPropsWithRef,
  ReactNode,
} from "react";

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
} & Pick<
  ComponentPropsWithRef<"ul">,
  "ref"
>;

function List<T>({
  items,
  renderItem,
  ref,
}: ListProps<T>) {
  return (
    <ul ref={ref}>
      {items.map((item, index) => (
        <li key={index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}
```

사용하는 측에서 `HTMLUListElement` 타입의 Ref를 전달할 수 있습니다.

```tsx
const listRef = useRef<HTMLUListElement>(null);

<List
  ref={listRef}
  items={users}
  renderItem={(user) => user.name}
/>
```

### 9.2 React 18 and Earlier

React 18 이하에서는 함수형 컴포넌트에서 Ref를 전달받기 위해 `forwardRef`를 사용해야 합니다.

```tsx
import {
  forwardRef,
  type ReactNode,
} from "react";

type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
};

const List = forwardRef<
  HTMLUListElement,
  ListProps<User>
>(function List(
  { items, renderItem },
  ref,
) {
  return (
    <ul ref={ref}>
      {items.map((item, index) => (
        <li key={index}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
});
```

위 예제는 `User` 타입으로 고정된 컴포넌트입니다.

`forwardRef`의 일반적인 타입 선언은 Generic Component의 호출 시점별 타입 추론을 보존하기 어렵습니다.

여러 데이터 타입을 지원하는 Generic Component에서 `forwardRef`를 사용해야 한다면 별도의 타입 설계가 필요합니다.

이 경우 타입 단언이나 함수 오버로드를 활용할 수 있지만, 실제 구현과 타입 선언이 일치하는지 검증해야 합니다.

React 19에서는 `ref`가 일반 Prop으로 전달되므로 이러한 제약을 줄일 수 있습니다.

## 10. Generic Components in Real-world Applications

Generic Component는 UI 라이브러리나 실제 애플리케이션에서 다양한 방식으로 활용할 수 있습니다.

### 10.1 Generic Table

테이블은 데이터 구조가 달라져도 동일한 렌더링 구조를 재사용해야 하는 대표적인 사례입니다.

```tsx
type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string | number;
};

function Table<T>({
  data,
  columns,
  getRowKey,
}: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={getRowKey(row)}>
            {columns.map((column) => {
              const value = row[column.key];

              return (
                <td key={String(column.key)}>
                  {column.render
                    ? column.render(value, row)
                    : String(value)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

사용 예제는 다음과 같습니다.

```tsx
type User = {
  id: number;
  name: string;
  age: number;
};

const columns: Column<User>[] = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "age",
    header: "Age",
    render: (value) => `${value} years old`,
  },
];

<Table
  data={users}
  columns={columns}
  getRowKey={(user) => user.id}
/>
```

위 예제는 여러 데이터 타입에서 재사용할 수 있는 테이블의 기본 구조를 보여줍니다.

다만 `Column<T>`의 `render`에서 사용하는 `T[keyof T]`는 모든 속성의 값 타입을 Union으로 표현합니다.

컬럼별 속성 타입까지 정확하게 연결하려면 다음과 같이 속성 키를 별도의 Generic으로 분리하는 것이 좋습니다.

```tsx
type Column<T, K extends keyof T> = {
  key: K;
  header: string;
  render?: (value: T[K], row: T) => React.ReactNode;
};

type Columns<T> = {
  [K in keyof T]: Column<T, K>;
}[keyof T];
```

이 방식은 컬럼의 `key`와 `render`에 전달되는 값의 타입을 연결할 때 유용합니다.

### 10.2 Generic Select

Select 컴포넌트는 문자열이나 숫자뿐 아니라 객체를 선택 항목으로 사용할 수 있습니다.

```tsx
type SelectProps<T> = {
  options: T[];
  getLabel: (option: T) => string;
  getValue: (option: T) => string | number;
  onChange: (option: T) => void;
};

function Select<T>({
  options,
  getLabel,
  getValue,
  onChange,
}: SelectProps<T>) {
  return (
    <select
      onChange={(event) => {
        const selected = options.find(
          (option) =>
            String(getValue(option)) === event.target.value
        );

        if (selected !== undefined) {
          onChange(selected);
        }
      }}
    >
      {options.map((option) => (
        <option
          key={getValue(option)}
          value={getValue(option)}
        >
          {getLabel(option)}
        </option>
      ))}
    </select>
  );
}
```

객체 데이터에서 표시할 문자열과 실제 선택값을 분리할 수 있습니다.

```tsx
type Country = {
  code: string;
  name: string;
};

<Select
  options={countries}
  getLabel={(country) => country.name}
  getValue={(country) => country.code}
  onChange={(country) => {
    console.log(country.code);
  }}
/>
```

이 방식은 UI에 표시되는 값과 애플리케이션에서 사용하는 데이터 구조를 분리할 수 있다는 장점이 있습니다.

실제 구현에서는 초기 선택값, 빈 옵션, Controlled 상태, 접근성 및 중복 Value 처리도 고려해야 합니다.

## 11. Best Practices

Generic Component를 설계할 때는 다음 사항을 고려하는 것이 좋습니다.

### 11.1 데이터와 동작의 타입 관계를 명확하게 정의합니다.

Generic은 단순히 여러 타입을 허용하기 위한 기능이 아닙니다.

`items`, `value`, `onChange`, `renderItem` 등 서로 관련된 Props 사이의 타입 관계를 표현하는 데 활용해야 합니다.

### 11.2 필요한 최소한의 Constraint를 사용합니다.

컴포넌트 내부에서 필요한 속성만 Constraint로 제한합니다.

불필요하게 구체적인 타입 조건을 추가하면 재사용성이 떨어질 수 있습니다.

### 11.3 타입 추론을 우선적으로 활용합니다.

Props에서 충분히 타입을 추론할 수 있다면 호출하는 측에서 Generic을 반복적으로 지정하지 않는 것이 좋습니다.

```tsx
<List items={users} />
```

### 11.4 Generic 매개변수의 역할을 구분합니다.

여러 Generic을 사용하는 경우 각 타입 매개변수가 어떤 데이터를 표현하는지 명확하게 유지해야 합니다.

```tsx
type MapperProps<TInput, TOutput> = {
  input: TInput;
  transform: (value: TInput) => TOutput;
  render: (value: TOutput) => React.ReactNode;
};
```

### 11.5 ReactNode와 JSX.Element를 구분합니다.

렌더링 결과를 Props로 전달받는 경우 반환 가능한 값의 범위에 따라 타입을 선택해야 합니다.

- `React.ReactNode`: 문자열, 숫자, JSX Element, Fragment, `null` 등 React가 렌더링할 수 있는 노드
- `React.JSX.Element`: JSX 표현식이 생성하는 React Element 타입

일반적인 Render Props에서는 다양한 렌더링 결과를 허용할 수 있는 `React.ReactNode`가 적합합니다.

### 11.6 Generic Component의 타입 복잡성을 관리합니다.

Generic Constraint, Conditional Type, Mapped Type 등을 지나치게 조합하면 컴포넌트의 사용성과 유지보수성이 떨어질 수 있습니다.

복잡한 타입은 별도의 Type Alias로 분리하고 실제 필요한 추상화만 유지하는 것이 좋습니다.

### 11.7 런타임 검증과 정적 타입 검사를 구분합니다.

TypeScript의 Generic은 컴파일 단계에서 타입 관계를 검사합니다.

실제 API 응답이나 사용자 입력이 선언한 타입과 일치하는지는 보장하지 않으므로 필요한 경우 런타임 검증을 수행해야 합니다.

## 12. Summary

Generic Component는 TypeScript의 Generic을 활용하여 다양한 데이터 타입을 처리할 수 있도록 설계한 React 컴포넌트입니다.

Generic을 Props와 연결하면 데이터, 상태, 콜백 및 렌더링 함수 사이의 타입 관계를 일관되게 유지할 수 있습니다.

| 개념 | 주요 타입 및 문법 |
|---|---|
| Generic Component | `function Component<T>()` |
| Generic Props | `Props<T>` |
| Generic Constraint | `T extends SomeType` |
| 속성 이름 제한 | `K extends keyof T` |
| 기본 Generic 타입 | `T = string` |
| 복수 Generic | `<T, U>` |
| Render Props | `(item: T) => React.ReactNode` |
| Children Function | `(data: T) => React.ReactNode` |
| State | `useState<T>()` |
| Reducer | `useReducer`와 Generic Action |
| Ref | `ComponentPropsWithRef<T>` |
| 타입 추론 | Props를 통한 Generic 추론 |

Generic Component의 핵심은 데이터 타입을 고정하지 않으면서도 컴포넌트 내부와 외부의 타입 관계를 유지하는 것입니다.

이를 통해 여러 데이터 구조에서 동일한 UI 로직을 재사용할 수 있으며, 컴포넌트 사용 단계에서도 타입 안정성을 확보할 수 있습니다.

## 13. References

- [React 공식 문서 - TypeScript](https://react.dev/learn/typescript)
  - React 컴포넌트와 Props를 TypeScript로 정의하는 방법을 설명합니다.
- [React 공식 문서 - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
  - 컴포넌트 Props의 전달 및 구조화 방법을 설명합니다.
- [React 공식 문서 - Rendering Lists](https://react.dev/learn/rendering-lists)
  - 배열 데이터를 기반으로 컴포넌트를 렌더링하는 방법과 Key의 역할을 설명합니다.
- [React 공식 문서 - Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
  - 컴포넌트 사이에서 상태를 공유하고 관리하는 방법을 설명합니다.
- [React 공식 문서 - forwardRef](https://react.dev/reference/react/forwardRef)
  - Ref를 전달하는 컴포넌트의 구현 방식과 React 버전에 따른 차이를 설명합니다.
- [TypeScript 공식 문서 - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - Generic을 이용한 재사용 가능한 함수와 타입 설계 방법을 설명합니다.
- [TypeScript 공식 문서 - Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
  - `extends`를 이용해 Generic 타입의 조건을 제한하는 방법을 설명합니다.
- [TypeScript 공식 문서 - keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
  - 객체의 속성 이름을 타입으로 추출하는 방법을 설명합니다.
- [TypeScript 공식 문서 - Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
  - `T[K]` 형태로 객체 속성의 타입을 추출하는 방법을 설명합니다.
- [TypeScript 공식 문서 - Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
  - 기존 타입의 속성을 기반으로 새로운 타입을 구성하는 방법을 설명합니다.
- [TypeScript 공식 문서 - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
  - TypeScript에서 JSX와 TSX를 사용하는 방법을 설명합니다.
- [TypeScript 공식 문서 - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
  - TypeScript의 타입 추론 원리와 활용 방법을 설명합니다.
- [React TypeScript Cheatsheet - Advanced Patterns](https://react-typescript-cheatsheet.netlify.app/docs/advanced/patterns_by_usecase/)
  - Generic Component, Render Props 등 React와 TypeScript를 조합한 고급 패턴을 설명합니다.