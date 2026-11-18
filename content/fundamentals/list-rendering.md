# List Rendering

## 1. List Rendering 개요

List Rendering은 배열이나 컬렉션 형태의 데이터를 기반으로 여러 개의 React Element를 반복적으로 생성하고 렌더링하는 기법입니다.

React에서는 JavaScript 배열 메서드인 `map()`을 사용하여 데이터 배열을 JSX 요소 배열로 변환하는 방식이 일반적입니다.

예를 들어 사용자 목록을 화면에 표시하는 경우 다음과 같이 구현할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

const users: User[] = [
  { id: 1, name: 'Kim' },
  { id: 2, name: 'Lee' },
  { id: 3, name: 'Park' },
];

function UserList() {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

`users.map()`은 배열의 각 요소를 순회하면서 새로운 JSX 요소를 생성합니다.

React는 반환된 JSX 요소 배열을 기반으로 여러 개의 목록 항목을 렌더링합니다.

List Rendering은 다음과 같은 상황에서 활용할 수 있습니다.

- 사용자 목록
- 상품 목록
- 게시글 및 댓글 목록
- 메뉴 및 네비게이션 항목
- 검색 결과
- 테이블의 행과 열
- 동적으로 추가되거나 삭제되는 데이터 목록

## 2. Array.map()을 활용한 렌더링

`map()`은 배열의 각 요소에 콜백 함수를 적용하고, 그 결과를 새로운 배열로 반환하는 JavaScript 메서드입니다.

React에서는 `map()`의 반환값으로 JSX 요소를 생성할 수 있습니다.

```tsx
const numbers = [1, 2, 3, 4, 5];

function NumberList() {
  return (
    <ul>
      {numbers.map(number => (
        <li key={number}>{number}</li>
      ))}
    </ul>
  );
}
```

위 코드는 다음과 같은 JSX 배열을 생성하는 것과 동일한 개념입니다.

```tsx
const listItems = [
  <li key={1}>1</li>,
  <li key={2}>2</li>,
  <li key={3}>3</li>,
  <li key={4}>4</li>,
  <li key={5}>5</li>,
];
```

생성된 배열은 JSX 내부에 직접 삽입할 수 있습니다.

```tsx
function NumberList() {
  const listItems = numbers.map(number => (
    <li key={number}>{number}</li>
  ));

  return <ul>{listItems}</ul>;
}
```

배열을 JSX 내부에서 직접 생성하거나 별도의 변수로 분리하는 방식 모두 사용할 수 있습니다.

목록 생성 로직이 단순하다면 JSX 내부에서 `map()`을 사용하는 것이 간결합니다. 반대로 데이터 가공이나 조건이 복잡하다면 별도의 변수나 함수로 분리하는 것이 좋습니다.

## 3. Array.filter()와 조합하기

`filter()`는 특정 조건을 만족하는 요소만 포함하는 새로운 배열을 반환합니다.

React에서는 `filter()`로 데이터를 먼저 필터링한 뒤 `map()`으로 JSX 요소를 생성할 수 있습니다.

```tsx
type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const todos: Todo[] = [
  { id: 1, title: 'Learn React', completed: true },
  { id: 2, title: 'Learn TypeScript', completed: false },
  { id: 3, title: 'Build Project', completed: false },
];

function TodoList() {
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <ul>
      {activeTodos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

위 코드는 완료되지 않은 항목만 필터링하여 화면에 표시합니다.

`filter()`와 `map()`을 연결하면 데이터 가공과 UI 생성을 분리하여 표현할 수 있습니다.

```tsx
const visibleItems = items
  .filter(item => item.isVisible)
  .map(item => (
    <li key={item.id}>{item.name}</li>
  ));
```

이 방식은 검색 결과, 카테고리별 목록, 완료 여부에 따른 목록 등 다양한 UI에 활용할 수 있습니다.

## 4. JSX에서 배열 렌더링하기

React는 JSX 내부에서 배열을 렌더링할 수 있습니다.

배열에 포함된 React Element는 배열의 순서에 따라 렌더링됩니다.

```tsx
function App() {
  const items = [
    <p key="first">First</p>,
    <p key="second">Second</p>,
    <p key="third">Third</p>,
  ];

  return <div>{items}</div>;
}
```

위 코드는 세 개의 `p` 요소를 순서대로 렌더링합니다.

문자열이나 숫자 배열도 JSX 내부에 삽입할 수 있습니다.

```tsx
function App() {
  const values = ['React', 'TypeScript', 'JavaScript'];

  return (
    <div>
      {values.map(value => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}
```

단, 일반적인 데이터 배열을 렌더링할 때는 `map()`으로 각 데이터에 대응하는 React Element를 생성하는 방식이 가장 많이 사용됩니다.

## 5. 목록 항목에 컴포넌트 사용하기

반복되는 UI의 구조가 복잡하거나 재사용할 필요가 있다면 각 항목을 별도의 컴포넌트로 분리할 수 있습니다.

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};

type ProductItemProps = {
  product: Product;
};

function ProductItem({ product }: ProductItemProps) {
  return (
    <li>
      <strong>{product.name}</strong>
      <span>{product.price.toLocaleString()}원</span>
    </li>
  );
}

function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
        />
      ))}
    </ul>
  );
}
```

각 항목을 별도 컴포넌트로 분리하면 다음과 같은 장점이 있습니다.

- 목록의 전체 구조와 항목의 UI를 분리할 수 있습니다.
- 항목 단위로 재사용할 수 있습니다.
- 컴포넌트별 책임이 명확해집니다.
- 개별 항목의 UI와 동작을 독립적으로 관리할 수 있습니다.

### 5.1 key의 위치

목록을 렌더링할 때 `key`는 `map()` 내부에서 반환하는 최상위 React Element에 지정해야 합니다.

```tsx
function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
        />
      ))}
    </ul>
  );
}
```

다음과 같이 자식 컴포넌트 내부에 `key`를 지정하는 것은 올바른 방식이 아닙니다.

```tsx
function ProductItem({ product }: ProductItemProps) {
  return (
    <li key={product.id}>
      {product.name}
    </li>
  );
}
```

React는 목록을 생성하는 부모 컴포넌트에서 각 항목을 구분해야 하므로, `key`는 부모의 배열 렌더링 단계에서 지정해야 합니다.

또한 `key`는 React가 내부적으로 사용하는 특별한 속성이므로 일반 Props처럼 자식 컴포넌트에 전달되지 않습니다.

자세한 내용은 [Keys](./keys.md) 문서를 참고할 수 있습니다.

## 6. 여러 요소를 반환하는 목록

하나의 데이터 항목이 여러 개의 React Element를 생성해야 하는 경우 Fragment를 사용할 수 있습니다.

예를 들어 테이블에서 하나의 데이터 항목이 여러 행을 생성하는 상황을 생각할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

function UserTable({ users }: { users: User[] }) {
  return (
    <table>
      <tbody>
        {users.map(user => (
          <Fragment key={user.id}>
            <tr>
              <th>Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
          </Fragment>
        ))}
      </tbody>
    </table>
  );
}
```

Fragment는 여러 요소를 하나의 그룹으로 묶지만 실제 DOM에는 별도의 래퍼 요소를 추가하지 않습니다.

목록 렌더링에서 Fragment를 사용할 때는 축약 문법인 `<>...</>` 대신 명시적인 `<Fragment>`를 사용해야 합니다.

```tsx
import { Fragment } from 'react';

// 목록에서 key 지정 가능
<Fragment key={item.id}>
  <h3>{item.title}</h3>
  <p>{item.description}</p>
</Fragment>
```

축약 문법은 `key`를 지정할 수 없기 때문입니다.

Fragment의 기본 개념과 사용 방법은 JSX 관련 문서 및 [Fragment 공식 문서](https://react.dev/reference/react/Fragment)를 참고할 수 있습니다.

## 7. 조건부 목록 렌더링

목록을 렌더링할 때 데이터의 존재 여부에 따라 서로 다른 UI를 표시할 수 있습니다.

### 7.1 빈 목록 처리

```tsx
type Props = {
  items: string[];
};

function ItemList({ items }: Props) {
  if (items.length === 0) {
    return <p>No items available.</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

빈 배열인 경우에는 목록 대신 안내 메시지를 표시합니다.

### 7.2 조건부 필터링

특정 조건을 만족하는 항목만 렌더링할 수도 있습니다.

```tsx
type Product = {
  id: number;
  name: string;
  inStock: boolean;
};

function ProductList({ products }: { products: Product[] }) {
  const availableProducts = products.filter(
    product => product.inStock
  );

  return (
    <ul>
      {availableProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

조건에 맞는 항목이 하나도 없는 경우에도 빈 목록이 렌더링됩니다. 빈 결과에 대한 별도 UI가 필요하다면 `availableProducts.length`를 검사하여 처리할 수 있습니다.

```tsx
function ProductList({ products }: { products: Product[] }) {
  const availableProducts = products.filter(
    product => product.inStock
  );

  if (availableProducts.length === 0) {
    return <p>No available products.</p>;
  }

  return (
    <ul>
      {availableProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

조건부 렌더링의 다양한 표현식과 사용 방식은 [Conditional Rendering](./conditional-rendering.md) 문서를 참고할 수 있습니다.

## 8. State와 목록 렌더링

목록 데이터가 State로 관리되는 경우 State가 변경되면 해당 데이터를 사용하는 컴포넌트가 다시 렌더링됩니다.

예를 들어 사용자가 항목을 추가하거나 삭제하는 목록은 다음과 같이 구현할 수 있습니다.

```tsx
import { useState } from 'react';

type Todo = {
  id: number;
  title: string;
};

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, title: 'Learn React' },
    { id: 2, title: 'Learn TypeScript' },
  ]);

  function addTodo() {
    const newTodo: Todo = {
      id: Date.now(),
      title: 'Build Project',
    };

    setTodos(previousTodos => [
      ...previousTodos,
      newTodo,
    ]);
  }

  function removeTodo(id: number) {
    setTodos(previousTodos =>
      previousTodos.filter(todo => todo.id !== id)
    );
  }

  return (
    <div>
      <button onClick={addTodo}>Add Todo</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => removeTodo(todo.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`addTodo()`는 기존 배열을 직접 변경하지 않고 새로운 배열을 생성하여 State를 업데이트합니다.

`removeTodo()`는 `filter()`를 사용하여 삭제 대상이 아닌 항목만 포함하는 새로운 배열을 생성합니다.

State가 변경되면 React는 새로운 배열을 기반으로 목록을 다시 렌더링합니다.

이때 `key`를 통해 각 항목의 식별 정보를 유지하므로, 항목이 추가되거나 제거되는 상황에서도 기존 항목을 올바르게 추적할 수 있습니다.

객체와 배열의 State 업데이트 및 불변성에 대한 자세한 내용은 [State](./state.md) 문서를 참고할 수 있습니다.

## 9. 목록 렌더링과 key

React에서 목록을 렌더링할 때는 각 항목에 고유한 `key`를 지정해야 합니다.

`key`는 React가 이전 렌더링과 다음 렌더링의 목록 항목을 구분하는 데 사용하는 식별자입니다.

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

React는 `key`를 기반으로 다음과 같은 변경을 파악할 수 있습니다.

- 새로운 항목의 추가
- 기존 항목의 제거
- 항목의 순서 변경
- 기존 항목의 업데이트

`key`가 없거나 적절하지 않으면 React가 목록 항목을 정확하게 식별하지 못할 수 있습니다.

### 9.1 key 선택 기준

일반적으로 데이터가 생성될 때 부여된 고유 ID를 사용하는 것이 좋습니다.

```tsx
<li key={user.id}>{user.name}</li>
```

다음과 같은 방식은 주의해야 합니다.

```tsx
// 배열 인덱스를 key로 사용
<li key={index}>{user.name}</li>

// 렌더링마다 새로운 값을 생성
<li key={Math.random()}>{user.name}</li>
```

배열 인덱스는 항목의 추가, 삭제, 정렬 등으로 순서가 바뀌면 실제 데이터와 식별 정보가 일치하지 않을 수 있습니다.

`Math.random()`처럼 렌더링마다 변경되는 값은 React가 매번 새로운 항목으로 인식하게 만들어 불필요한 컴포넌트 재생성과 State 초기화를 유발할 수 있습니다.

`key`의 안정성, 고유성, 인덱스 사용의 문제점 및 React의 재조정 과정은 별도의 [Keys](./keys.md) 문서에서 자세히 다룹니다.

## 10. 성능과 목록 렌더링

목록에 많은 데이터가 포함되면 렌더링 비용이 증가할 수 있습니다.

특히 대량의 데이터를 한 번에 렌더링하면 DOM 노드가 많아지고 초기 렌더링 및 업데이트 비용이 커질 수 있습니다.

### 10.1 필요한 데이터만 렌더링

검색이나 필터링을 통해 실제로 필요한 데이터만 렌더링하면 불필요한 UI 생성을 줄일 수 있습니다.

```tsx
function SearchResult({ items, keyword }: {
  items: string[];
  keyword: string;
}) {
  const filteredItems = items.filter(item =>
    item.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### 10.2 대량 목록과 가상화

수천 개 이상의 항목을 동시에 렌더링해야 하는 경우에는 가상화(Virtualization)를 고려할 수 있습니다.

가상화는 화면에 실제로 보이는 항목과 일부 여유 영역의 항목만 렌더링하고, 화면 밖의 항목은 필요할 때 생성하는 기법입니다.

이를 통해 실제 DOM에 존재하는 요소의 수를 제한하고 렌더링 비용을 줄일 수 있습니다.

대표적인 라이브러리는 다음과 같습니다.

- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [react-window](https://github.com/bvaughn/react-window)

가상화는 모든 목록에 필요한 최적화 기법은 아닙니다. 데이터 개수, 항목의 복잡도, 스크롤 성능 등을 고려하여 도입해야 합니다.

### 10.3 불필요한 재렌더링 최적화

목록의 각 항목이 복잡한 컴포넌트라면 불필요한 재렌더링을 줄이기 위해 `memo`를 고려할 수 있습니다.

```tsx
import { memo } from 'react';

type Item = {
  id: number;
  name: string;
};

const ListItem = memo(function ListItem({
  item,
}: {
  item: Item;
}) {
  return <li>{item.name}</li>;
});

function ItemList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
```

`memo`는 Props가 이전 렌더링과 비교하여 변경되지 않았다면 컴포넌트의 재렌더링을 생략할 수 있도록 하는 최적화 기능입니다.

다만 부모 컴포넌트가 다시 렌더링된다고 해서 모든 자식 컴포넌트가 항상 동일한 비용으로 다시 렌더링되는 것은 아닙니다. 실제 성능 문제를 측정한 뒤 필요한 경우에 최적화를 적용하는 것이 좋습니다.

자세한 내용은 [memo](https://react.dev/reference/react/memo) 및 `performance` 디렉터리의 관련 문서를 참고할 수 있습니다.

## 11. TypeScript와 목록 렌더링

TypeScript에서는 배열의 요소 타입을 정의하여 목록 데이터와 컴포넌트 Props의 타입을 안전하게 관리할 수 있습니다.

### 11.1 데이터 타입 정의

```tsx
type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [
  {
    id: 1,
    name: 'Kim',
    email: 'kim@example.com',
  },
  {
    id: 2,
    name: 'Lee',
    email: 'lee@example.com',
  },
];
```

`User[]`는 `User` 타입의 객체로 구성된 배열을 의미합니다.

### 11.2 컴포넌트 Props 타입 정의

```tsx
type UserListProps = {
  users: User[];
};

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </li>
      ))}
    </ul>
  );
}
```

Props의 타입을 정의하면 컴포넌트에 전달되는 데이터의 구조를 명확하게 제한할 수 있습니다.

### 11.3 빈 배열과 타입 추론

빈 배열로 State를 초기화할 때는 요소 타입을 명시하는 것이 좋습니다.

```tsx
type Todo = {
  id: number;
  title: string;
};

const [todos, setTodos] = useState<Todo[]>([]);
```

이렇게 선언하면 이후 `Todo` 타입에 맞는 데이터를 안전하게 추가할 수 있습니다.

```tsx
setTodos(previousTodos => [
  ...previousTodos,
  {
    id: 1,
    title: 'Learn React',
  },
]);
```

반면 잘못된 구조의 데이터를 추가하려고 하면 TypeScript가 오류를 표시합니다.

```tsx
// TypeScript 오류
setTodos(previousTodos => [
  ...previousTodos,
  {
    id: '1',
    title: 'Learn React',
  },
]);
```

`id`가 숫자로 정의되어 있으므로 문자열을 할당할 수 없습니다.

## 12. 주의사항

### 12.1 map()에서 key 누락하지 않기

목록을 렌더링할 때는 각 항목의 최상위 React Element에 고유하고 안정적인 `key`를 지정해야 합니다.

```tsx
// 잘못된 방식
{users.map(user => (
  <li>{user.name}</li>
))}

// 올바른 방식
{users.map(user => (
  <li key={user.id}>{user.name}</li>
))}
```

### 12.2 배열을 직접 변경하지 않기

State로 관리하는 배열은 직접 변경하지 않아야 합니다.

```tsx
// 잘못된 방식
todos.push(newTodo);
setTodos(todos);

// 올바른 방식
setTodos(previousTodos => [
  ...previousTodos,
  newTodo,
]);
```

새로운 배열을 생성하면 React가 이전 State와 새로운 State의 참조를 비교하여 변경을 처리할 수 있습니다.

### 12.3 map() 콜백에서 JSX 반환하기

`map()`을 사용할 때 중괄호를 사용하면 명시적으로 `return`해야 합니다.

```tsx
// 잘못된 방식: 반환값이 없음
{users.map(user => {
  <li key={user.id}>{user.name}</li>
})}

// 올바른 방식: 명시적인 return
{users.map(user => {
  return <li key={user.id}>{user.name}</li>;
})}

// 올바른 방식: 암시적인 return
{users.map(user => (
  <li key={user.id}>{user.name}</li>
))}
```

화살표 함수에서 소괄호를 사용하면 표현식의 결과가 자동으로 반환됩니다.

### 12.4 목록 항목의 식별자와 표시 값 구분하기

화면에 표시되는 이름이나 제목이 항상 고유한 식별자는 아닙니다.

```tsx
// 이름이 중복될 수 있다면 적절하지 않을 수 있음
<li key={user.name}>{user.name}</li>

// 고유 ID 사용
<li key={user.id}>{user.name}</li>
```

화면에 표시되는 값과 목록 항목을 식별하는 값은 구분해야 합니다.

### 12.5 빈 목록과 로딩 상태 구분하기

데이터 배열이 비어 있다는 사실만으로 데이터가 없는 상태인지 아직 로딩 중인 상태인지 구분할 수는 없습니다.

```tsx
type Props = {
  isLoading: boolean;
  items: string[];
};

function ItemList({ isLoading, items }: Props) {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (items.length === 0) {
    return <p>No items available.</p>;
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

로딩, 성공, 빈 데이터, 오류 등의 상태를 명확하게 구분하면 사용자에게 적절한 UI를 제공할 수 있습니다.

## 13. 핵심 정리

- List Rendering은 배열 데이터를 기반으로 반복적인 React Element를 생성하는 기법입니다.
- `map()`은 배열의 각 요소를 JSX로 변환할 때 가장 일반적으로 사용합니다.
- `filter()`와 `map()`을 조합하면 조건에 맞는 데이터만 렌더링할 수 있습니다.
- JSX 내부에는 React Element 배열을 직접 삽입할 수 있습니다.
- 반복되는 UI가 복잡하거나 재사용할 필요가 있다면 별도의 컴포넌트로 분리하는 것이 좋습니다.
- 하나의 데이터 항목에서 여러 요소를 반환해야 한다면 Fragment를 활용할 수 있습니다.
- 목록을 렌더링할 때는 최상위 React Element에 고유하고 안정적인 `key`를 지정해야 합니다.
- State로 관리하는 배열은 직접 변경하지 않고 새로운 배열을 생성하여 업데이트해야 합니다.
- 대량의 데이터를 렌더링하는 경우 필터링, 가상화, 컴포넌트 메모이제이션 등을 고려할 수 있습니다.
- TypeScript의 배열 타입과 Props 타입을 정의하면 목록 데이터의 구조를 안전하게 관리할 수 있습니다.

## 14. 참고 자료

### React 공식 문서

- [Rendering Lists](https://react.dev/learn/rendering-lists) - 배열 데이터를 기반으로 목록을 렌더링하는 방법
- [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces) - JSX 내부에서 JavaScript 표현식 사용
- [Fragment](https://react.dev/reference/react/Fragment) - 여러 요소를 DOM 래퍼 없이 그룹화하는 방법
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure) - 컴포넌트의 순수성과 렌더링 원칙
- [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state) - 배열 State의 불변성 및 업데이트
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) - State 데이터 구조 설계
- [memo](https://react.dev/reference/react/memo) - 컴포넌트 렌더링 최적화

### JavaScript 및 TypeScript 공식 문서

- [MDN - Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) - 배열 요소를 변환하여 새로운 배열 생성
- [MDN - Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) - 조건에 맞는 배열 요소 필터링
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) - 배열과 객체의 타입 정의

### 관련 라이브러리

- [TanStack Virtual](https://tanstack.com/virtual/latest) - 대량의 목록을 효율적으로 렌더링하기 위한 가상화 라이브러리
- [react-window](https://github.com/bvaughn/react-window) - 목록 및 그리드 가상화 라이브러리