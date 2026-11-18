# Keys

## 1. Key 개요

`key`는 React가 렌더링 트리에서 각 요소의 정체성(Identity)을 식별하기 위해 사용하는 특별한 속성입니다.

React는 컴포넌트가 다시 렌더링될 때 이전 렌더링 결과와 새로운 렌더링 결과를 비교하여 변경된 부분을 반영합니다. 이 과정에서 `key`는 목록의 각 항목이 이전 렌더링의 어떤 항목과 대응하는지 판단하는 기준으로 사용됩니다.

다음은 목록에 `key`를 지정하는 기본적인 예제입니다.

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
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

각 `li` 요소에 `key={user.id}`를 지정하면 React는 해당 값을 기준으로 각 항목을 식별합니다.

`key`는 단순히 목록에서 발생하는 경고를 제거하기 위한 속성이 아닙니다. 목록의 항목이 추가되거나 삭제되거나 순서가 변경될 때 React가 기존 요소와 새로운 요소의 관계를 파악하는 데 중요한 역할을 합니다.

## 2. Key의 역할

React는 렌더링 결과를 비교할 때 요소의 타입, 위치, `key` 등을 기준으로 기존 요소를 유지할지 새로운 요소로 생성할지 판단합니다.

특히 동적인 목록에서는 배열의 순서만으로 항목의 정체성을 판단하기 어렵습니다.

예를 들어 다음과 같은 목록이 있다고 가정합니다.

```tsx
const users = [
  { id: 1, name: 'Kim' },
  { id: 2, name: 'Lee' },
  { id: 3, name: 'Park' },
];
```

이후 첫 번째 항목이 제거되면 목록은 다음과 같이 변경됩니다.

```tsx
const users = [
  { id: 2, name: 'Lee' },
  { id: 3, name: 'Park' },
];
```

`key`가 없다면 React는 배열의 위치를 기준으로 요소를 대응시키는 데 의존하게 됩니다. 이 경우 기존 항목과 새로운 항목의 대응 관계를 정확하게 파악하기 어려울 수 있습니다.

반면 각 항목에 고유한 `key`가 있으면 React는 다음과 같이 식별할 수 있습니다.

| 이전 목록 | 새로운 목록 | 변경 사항 |
|---|---|---|
| Kim (id: 1) | - | 제거 |
| Lee (id: 2) | Lee (id: 2) | 유지 |
| Park (id: 3) | Park (id: 3) | 유지 |

React는 `key`를 통해 기존 항목과 새로운 항목의 대응 관계를 파악하고, 필요한 부분만 업데이트할 수 있습니다.

### 2.1 Reconciliation과 Key

Reconciliation은 이전 렌더링 결과와 새로운 렌더링 결과를 비교하여 UI 변경 사항을 계산하는 과정입니다.

React는 이 과정에서 컴포넌트와 요소의 정체성을 판단하고, 기존 DOM을 유지하거나 변경하거나 새로 생성합니다.

목록에서 `key`는 형제 요소(Sibling) 사이의 정체성을 구분하는 데 사용됩니다.

예를 들어 다음과 같은 목록에서 각 항목은 `key`를 기준으로 구분됩니다.

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}
    </ul>
  );
}
```

항목의 순서가 변경되더라도 `key`가 동일하면 React는 해당 항목을 이전 렌더링의 동일한 항목으로 인식할 수 있습니다.

`key`는 React가 컴포넌트의 정체성을 판단하는 여러 기준 중 하나입니다. `key`가 같더라도 컴포넌트 타입이 달라지면 기존 컴포넌트가 유지되지 않을 수 있습니다.

## 3. Key의 작성 규칙

React에서 `key`를 사용할 때는 다음 규칙을 준수해야 합니다.

### 3.1 형제 요소 사이에서 고유해야 합니다

`key`는 전체 애플리케이션에서 고유할 필요는 없지만, 동일한 부모 아래에 있는 형제 요소 사이에서는 고유해야 합니다.

```tsx
function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

위 예제에서는 `users` 배열의 각 사용자 ID가 서로 달라야 합니다.

서로 다른 부모 아래에 있는 목록에서는 동일한 `key`를 사용해도 문제가 없습니다.

```tsx
function App() {
  return (
    <div>
      <ul>
        <li key="item-1">First List Item</li>
      </ul>

      <ul>
        <li key="item-1">Second List Item</li>
      </ul>
    </div>
  );
}
```

각 `ul`의 자식은 서로 다른 형제 집합에 속하므로 동일한 `key`를 사용할 수 있습니다.

### 3.2 렌더링 사이에 안정적으로 유지되어야 합니다

`key`는 동일한 데이터 항목을 렌더링 사이에서 식별할 수 있도록 안정적인 값이어야 합니다.

```tsx
// 적절한 방식
<li key={user.id}>{user.name}</li>
```

다음과 같이 렌더링할 때마다 새로운 값을 생성하는 방식은 피해야 합니다.

```tsx
// 잘못된 방식
<li key={Math.random()}>{user.name}</li>
```

`Math.random()`은 렌더링마다 다른 값을 반환하므로 React는 기존 항목과 새로운 항목을 서로 다른 요소로 판단합니다.

그 결과 컴포넌트와 DOM이 불필요하게 재생성되고, 내부 State나 입력 중인 데이터가 초기화될 수 있습니다.

`Date.now()` 역시 렌더링 과정에서 `key`를 생성하는 용도로 사용하면 안 됩니다.

### 3.3 데이터의 정체성을 나타내야 합니다

`key`는 배열의 현재 위치가 아니라 데이터 항목 자체의 정체성을 표현하는 것이 적절합니다.

```tsx
type Product = {
  id: string;
  name: string;
  price: number;
};

function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
}
```

상품의 이름이나 가격은 변경될 수 있지만 상품 ID는 동일한 상품을 식별하는 값으로 유지됩니다.

따라서 데이터 모델에 고유 ID가 있다면 해당 값을 `key`로 사용하는 것이 일반적입니다.

## 4. Key의 선택 기준

`key`는 데이터의 출처와 생성 방식에 따라 적절한 값을 선택해야 합니다.

### 4.1 데이터베이스 ID 사용

서버나 데이터베이스에서 가져온 데이터라면 데이터베이스의 기본 키 또는 고유 ID를 사용하는 것이 일반적입니다.

```tsx
type User = {
  id: number;
  name: string;
};

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}
```

데이터베이스 ID는 일반적으로 데이터의 생명주기 동안 유지되므로 안정적인 `key`로 사용하기 적합합니다.

### 4.2 클라이언트에서 생성한 데이터

사용자가 브라우저에서 직접 생성하는 데이터처럼 서버에서 발급한 ID가 없는 경우에는 데이터가 생성되는 시점에 고유 ID를 부여할 수 있습니다.

```tsx
type Todo = {
  id: string;
  title: string;
};

function createTodo(title: string): Todo {
  return {
    id: crypto.randomUUID(),
    title,
  };
}
```

이후 생성된 ID를 데이터와 함께 저장하고 목록 렌더링에 사용합니다.

```tsx
function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

중요한 점은 ID를 렌더링할 때 생성하는 것이 아니라 데이터가 생성되는 시점에 한 번 생성하고 유지해야 한다는 것입니다.

브라우저 환경에서 생성한 데이터를 서버와 동기화하거나 영속적으로 저장해야 한다면 ID의 생성 및 관리 정책을 데이터 모델에 맞게 설계해야 합니다.

### 4.3 복합 식별자 사용

데이터 자체에 단일 고유 ID가 없는 경우에는 여러 속성을 조합하여 식별자를 구성할 수 있습니다.

```tsx
type Schedule = {
  date: string;
  roomId: string;
  title: string;
};

function ScheduleList({
  schedules,
}: {
  schedules: Schedule[];
}) {
  return (
    <ul>
      {schedules.map(schedule => (
        <li key={`${schedule.date}-${schedule.roomId}`}>
          {schedule.title}
        </li>
      ))}
    </ul>
  );
}
```

단, 조합한 값이 형제 요소 사이에서 실제로 고유해야 합니다.

단순히 여러 속성을 문자열로 연결하는 것만으로 항상 고유성이 보장되는 것은 아니므로 데이터 구조에 맞는 식별자 생성 규칙이 필요합니다.

## 5. 배열 Index를 Key로 사용하는 경우

배열의 인덱스도 숫자 형태의 `key`로 사용할 수 있습니다.

```tsx
function ItemList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

다만 배열의 순서가 변경될 수 있는 목록에서는 인덱스를 `key`로 사용하는 것을 일반적으로 권장하지 않습니다.

### 5.1 Index Key의 문제점

배열 인덱스는 데이터 항목 자체의 정체성이 아니라 현재 배열에서의 위치를 나타냅니다.

다음과 같은 목록을 가정합니다.

```tsx
const items = [
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
  { id: 'c', name: 'Cherry' },
];
```

인덱스를 `key`로 사용하면 다음과 같이 대응됩니다.

| 데이터 | 배열 인덱스 | Key |
|---|---:|---:|
| Apple | 0 | 0 |
| Banana | 1 | 1 |
| Cherry | 2 | 2 |

이후 Apple이 제거되면 배열은 다음과 같이 변경됩니다.

```tsx
const items = [
  { id: 'b', name: 'Banana' },
  { id: 'c', name: 'Cherry' },
];
```

인덱스를 `key`로 사용하면 다음과 같이 대응됩니다.

| 이전 항목 | 이전 Key | 새로운 항목 | 새로운 Key |
|---|---:|---|---:|
| Apple | 0 | Banana | 0 |
| Banana | 1 | Cherry | 1 |
| Cherry | 2 | - | - |

React는 `key`가 동일한 항목을 이전과 동일한 요소로 대응시킬 수 있지만, 실제 데이터는 다른 항목으로 변경되었습니다.

이로 인해 항목 내부의 State나 DOM 입력 상태가 잘못된 데이터에 연결되는 문제가 발생할 수 있습니다.

### 5.2 Index Key로 인한 입력 상태 불일치

다음은 각 목록 항목이 자체 입력 State를 갖는 예제입니다.

```tsx
import { useState } from 'react';

type Item = {
  id: string;
  name: string;
};

function EditableItem({ item }: { item: Item }) {
  const [value, setValue] = useState(item.name);

  return (
    <li>
      <span>{item.name}</span>
      <input
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    </li>
  );
}

function ItemList() {
  const [items, setItems] = useState<Item[]>([
    { id: 'a', name: 'Apple' },
    { id: 'b', name: 'Banana' },
    { id: 'c', name: 'Cherry' },
  ]);

  function removeFirstItem() {
    setItems(previousItems => previousItems.slice(1));
  }

  return (
    <div>
      <button onClick={removeFirstItem}>
        Remove First Item
      </button>

      <ul>
        {items.map((item, index) => (
          <EditableItem
            key={index}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
}
```

예를 들어 Apple의 입력 필드에 별도의 값을 입력한 뒤 Apple을 제거하면, 기존 Apple 항목의 컴포넌트 State가 Banana 항목에 대응될 수 있습니다.

이는 React가 배열 인덱스를 기준으로 기존 컴포넌트를 재사용하기 때문입니다.

데이터 ID를 `key`로 사용하면 이러한 문제를 방지할 수 있습니다.

```tsx
{items.map(item => (
  <EditableItem
    key={item.id}
    item={item}
  />
))}
```

### 5.3 Index Key를 사용할 수 있는 경우

다음 조건을 모두 만족하는 정적인 목록이라면 인덱스를 `key`로 사용하는 것이 문제가 되지 않을 수 있습니다.

- 목록의 항목이 정적입니다.
- 항목의 순서가 변경되지 않습니다.
- 항목이 추가되거나 삭제되지 않습니다.
- 항목이 필터링되거나 재정렬되지 않습니다.

예를 들어 고정된 안내 문구나 변경되지 않는 정적 데이터 목록에서는 인덱스를 사용할 수 있습니다.

```tsx
const labels = [
  'Name',
  'Email',
  'Phone',
];

function LabelList() {
  return (
    <ul>
      {labels.map((label, index) => (
        <li key={index}>{label}</li>
      ))}
    </ul>
  );
}
```

그러나 목록의 변경 가능성을 확실하게 보장할 수 없다면 데이터의 고유 ID를 사용하는 편이 안전합니다.

## 6. Key와 컴포넌트 State

`key`는 목록 항목의 정체성을 구분하는 것뿐 아니라 컴포넌트의 State 보존 및 초기화에도 영향을 줍니다.

React는 State를 컴포넌트 함수 내부에 저장하는 것이 아니라 렌더링 트리의 위치와 컴포넌트의 정체성을 기준으로 관리합니다.

동일한 컴포넌트가 동일한 위치에서 계속 렌더링되면 기존 State가 유지됩니다.

반대로 컴포넌트가 제거되거나 다른 컴포넌트로 교체되면 해당 State가 초기화될 수 있습니다.

### 6.1 Key가 동일한 경우

```tsx
import { useState } from 'react';

function Counter({ userId }: { userId: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>User: {userId}</p>
      <p>Count: {count}</p>

      <button onClick={() => setCount(value => value + 1)}>
        Increase
      </button>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState('user-1');

  return (
    <div>
      <button onClick={() => setUserId('user-2')}>
        Change User
      </button>

      <Counter userId={userId} />
    </div>
  );
}
```

`userId`가 변경되어도 `Counter`의 타입과 렌더링 위치는 동일합니다.

따라서 React는 기존 `Counter` 컴포넌트를 유지하고 내부 State를 보존합니다.

이 경우 사용자 정보는 변경되지만 `count`는 기존 값을 유지합니다.

### 6.2 Key가 변경되는 경우

컴포넌트에 서로 다른 `key`를 전달하면 React는 이를 서로 다른 컴포넌트로 식별합니다.

```tsx
function App() {
  const [userId, setUserId] = useState('user-1');

  return (
    <div>
      <button onClick={() => setUserId('user-1')}>
        User 1
      </button>

      <button onClick={() => setUserId('user-2')}>
        User 2
      </button>

      <Counter
        key={userId}
        userId={userId}
      />
    </div>
  );
}
```

`userId`가 변경되면 `key`도 변경됩니다.

React는 기존 `Counter`를 제거하고 새로운 `Counter`를 생성하므로 해당 컴포넌트와 하위 컴포넌트의 State가 초기화됩니다.

이 방식은 다음과 같은 상황에서 유용합니다.

- 다른 사용자로 전환할 때 입력 폼 초기화
- 다른 채팅 상대를 선택할 때 메시지 입력 상태 초기화
- 다른 상품을 선택할 때 상세 화면의 로컬 State 초기화
- 특정 데이터 항목이 변경될 때 하위 컴포넌트 전체 초기화

### 6.3 Key를 이용한 Form 초기화

`key`는 폼의 입력 상태를 초기화할 때도 사용할 수 있습니다.

```tsx
import { useState } from 'react';

type User = {
  id: string;
  name: string;
};

function UserForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);

  return (
    <form>
      <label>
        Name
        <input
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </label>
    </form>
  );
}

function UserEditor({ user }: { user: User }) {
  return (
    <UserForm
      key={user.id}
      user={user}
    />
  );
}
```

`user.id`가 변경되면 `UserForm`이 새로운 컴포넌트로 생성되므로 입력 State가 새로운 사용자의 초기값으로 설정됩니다.

이 방식은 Props가 변경될 때마다 별도의 `useEffect`로 State를 동기화하는 대신, 컴포넌트의 정체성을 변경하여 State를 초기화하는 방법입니다.

단, `key`가 변경되면 해당 컴포넌트의 하위 트리 전체가 재생성될 수 있으므로 초기화가 필요한 범위를 고려해야 합니다.

## 7. Key는 일반 Props가 아닙니다

`key`는 React가 내부적으로 사용하는 특별한 속성입니다.

컴포넌트에 `key`를 전달하더라도 일반 Props처럼 컴포넌트 내부에서 접근할 수 없습니다.

```tsx
function UserItem(props: {
  id: number;
  name: string;
}) {
  return <li>{props.name}</li>;
}

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <UserItem
          key={user.id}
          id={user.id}
          name={user.name}
        />
      ))}
    </ul>
  );
}
```

위 코드에서 `key`는 React가 요소를 식별하는 데 사용하며, `UserItem`의 Props에는 포함되지 않습니다.

컴포넌트 내부에서 ID가 필요하다면 `key`와 별도로 일반 Props를 전달해야 합니다.

```tsx
function UserItem({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  return (
    <li>
      <strong>{name}</strong>
      <span>ID: {id}</span>
    </li>
  );
}
```

사용 예제는 다음과 같습니다.

```tsx
<UserItem
  key={user.id}
  id={user.id}
  name={user.name}
/>
```

두 속성의 역할은 다음과 같이 구분됩니다.

| 속성 | 목적 | 컴포넌트 내부 접근 |
|---|---|---|
| `key` | React가 요소의 정체성을 식별 | 불가능 |
| `id` | 컴포넌트에서 사용할 일반 데이터 | 가능 |

`key`는 React 전용 속성이므로 일반 데이터 전달 용도로 사용해서는 안 됩니다.

## 8. Fragment와 Key

하나의 데이터 항목이 여러 개의 JSX 요소를 반환해야 하는 경우 Fragment를 사용할 수 있습니다.

```tsx
import { Fragment } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
};

function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.map(user => (
        <Fragment key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </Fragment>
      ))}
    </div>
  );
}
```

Fragment는 실제 DOM에 별도의 래퍼 요소를 생성하지 않으면서 여러 요소를 그룹화합니다.

목록에서 Fragment를 사용할 때는 `key`를 지정해야 하므로 축약 문법인 `<>...</>` 대신 명시적인 `<Fragment>`를 사용해야 합니다.

```tsx
// Key를 지정할 수 없는 축약 문법
<>
  <h3>{user.name}</h3>
  <p>{user.email}</p>
</>
```

```tsx
// Key를 지정할 수 있는 명시적 Fragment
<Fragment key={user.id}>
  <h3>{user.name}</h3>
  <p>{user.email}</p>
</Fragment>
```

## 9. Key와 중첩 목록

중첩된 목록을 렌더링하는 경우 각 목록의 형제 요소를 기준으로 `key`를 지정해야 합니다.

```tsx
type Category = {
  id: number;
  name: string;
  products: Product[];
};

type Product = {
  id: number;
  name: string;
};

function CategoryList({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <div>
      {categories.map(category => (
        <section key={category.id}>
          <h2>{category.name}</h2>

          <ul>
            {category.products.map(product => (
              <li key={product.id}>
                {product.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

위 예제에서는 두 단계의 목록이 존재합니다.

- `categories.map()`에서 생성되는 `section`에는 `category.id`를 사용합니다.
- `category.products.map()`에서 생성되는 `li`에는 `product.id`를 사용합니다.

`key`는 각 형제 집합 내에서 고유하면 되므로, 서로 다른 카테고리에 속한 상품들이 동일한 ID를 갖더라도 문제가 되지 않습니다.

## 10. Key와 정렬 및 필터링

목록의 정렬이나 필터링은 항목의 순서와 개수를 변경합니다.

이때 데이터의 고유 ID를 `key`로 사용하면 React가 항목의 정체성을 유지할 수 있습니다.

```tsx
type Product = {
  id: number;
  name: string;
  price: number;
};

function ProductList({
  products,
}: {
  products: Product[];
}) {
  const sortedProducts = [...products].sort(
    (a, b) => a.price - b.price
  );

  return (
    <ul>
      {sortedProducts.map(product => (
        <li key={product.id}>
          {product.name}: {product.price}
        </li>
      ))}
    </ul>
  );
}
```

정렬 전후에 상품의 순서가 변경되더라도 `product.id`는 유지됩니다.

React는 동일한 `key`를 가진 항목을 대응시켜 기존 컴포넌트를 재사용할 수 있습니다.

필터링에서도 동일한 원리가 적용됩니다.

```tsx
function ProductList({
  products,
}: {
  products: Product[];
}) {
  const availableProducts = products.filter(
    product => product.price > 0
  );

  return (
    <ul>
      {availableProducts.map(product => (
        <li key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
}
```

필터링으로 일부 항목이 제거되더라도 남아 있는 항목의 `key`가 유지되므로 React는 각 항목의 정체성을 구분할 수 있습니다.

## 11. TypeScript와 Key

TypeScript에서 `key`는 React의 특별한 속성이므로 일반적인 컴포넌트 Props 타입에 포함하지 않아도 됩니다.

```tsx
type User = {
  id: number;
  name: string;
};

type UserItemProps = {
  user: User;
};

function UserItem({ user }: UserItemProps) {
  return <li>{user.name}</li>;
}

function UserList({ users }: { users: User[] }) {
  return (
    <ul>
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
        />
      ))}
    </ul>
  );
}
```

React와 TypeScript의 타입 정의에서는 `key`를 `IntrinsicAttributes`를 통해 JSX 요소에 사용할 수 있도록 지원합니다.

따라서 컴포넌트의 Props 타입에 `key`를 직접 추가하는 것은 일반적으로 필요하지 않습니다.

```tsx
// 일반적으로 불필요한 정의
type UserItemProps = {
  key: number;
  user: User;
};
```

컴포넌트 내부에서 해당 ID가 필요하다면 `user.id`와 같이 일반 Props로 전달되는 데이터에 접근하거나 별도의 Props를 선언해야 합니다.

## 12. 주의사항

### 12.1 Key가 있다고 모든 변경을 최적화하는 것은 아닙니다

`key`는 React가 요소의 정체성을 식별하도록 돕는 기준입니다.

`key`를 지정했다고 해서 컴포넌트의 모든 재렌더링이 방지되거나 렌더링 비용이 자동으로 줄어드는 것은 아닙니다.

렌더링 최적화가 필요하다면 `memo`, `useMemo`, `useCallback` 등의 기능을 별도로 검토해야 합니다.

### 12.2 Key는 전체 목록에서 고유할 필요가 없습니다

`key`는 전역적으로 고유할 필요가 없으며 동일한 부모 아래의 형제 요소 사이에서만 고유하면 됩니다.

### 12.3 Key를 변경하면 State가 초기화될 수 있습니다

컴포넌트의 `key`가 변경되면 React는 기존 컴포넌트와 새로운 컴포넌트를 서로 다른 요소로 취급합니다.

따라서 해당 컴포넌트와 하위 트리의 State가 초기화될 수 있습니다.

의도하지 않은 `key` 변경은 입력 데이터 손실이나 불필요한 컴포넌트 재생성으로 이어질 수 있으므로 주의해야 합니다.

### 12.4 Index Key는 동적인 목록에서 피해야 합니다

항목의 추가, 삭제, 정렬, 필터링이 발생하는 목록에서는 배열 인덱스를 `key`로 사용하지 않는 것이 좋습니다.

데이터 자체의 고유 ID를 사용하는 방식이 더 안정적입니다.

### 12.5 Key와 데이터 ID를 구분해야 합니다

`key`는 React 내부에서 요소를 식별하기 위한 속성입니다.

컴포넌트 내부에서 ID를 사용해야 한다면 별도의 Props로 전달해야 합니다.

## 13. 핵심 정리

- `key`는 React가 렌더링 트리에서 요소의 정체성을 식별하기 위해 사용하는 특별한 속성입니다.
- React는 이전 렌더링과 새로운 렌더링을 비교할 때 `key`를 활용하여 목록 항목의 대응 관계를 판단합니다.
- `key`는 동일한 부모 아래의 형제 요소 사이에서 고유해야 합니다.
- `key`는 렌더링 사이에서 안정적으로 유지되어야 합니다.
- 데이터베이스 ID나 데이터 생성 시점에 발급한 고유 식별자를 사용하는 것이 좋습니다.
- 배열 인덱스는 항목의 위치를 나타내므로 동적으로 변경되는 목록에서는 사용을 피해야 합니다.
- `Math.random()`처럼 렌더링마다 변경되는 값을 `key`로 사용하면 컴포넌트가 불필요하게 재생성될 수 있습니다.
- `key`는 컴포넌트의 정체성과 State 보존 및 초기화에도 영향을 줍니다.
- 컴포넌트의 `key`가 변경되면 해당 컴포넌트와 하위 트리의 State가 초기화될 수 있습니다.
- `key`는 React 전용 속성이므로 일반 Props처럼 컴포넌트 내부에서 접근할 수 없습니다.
- 하나의 데이터 항목에서 여러 요소를 렌더링할 때는 명시적인 `<Fragment key={...}>`를 사용할 수 있습니다.
- `key`는 렌더링 식별을 위한 기준이며, 그 자체가 성능 최적화 기능은 아닙니다.

## 14. 참고 자료

### React 공식 문서

- [Rendering Lists](https://react.dev/learn/rendering-lists) - 목록 렌더링과 Key의 기본 개념, 고유성 및 안정성
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) - Key에 따른 컴포넌트 State 보존 및 초기화
- [Fragment](https://react.dev/reference/react/Fragment) - Fragment와 Key 사용 방법
- [useState](https://react.dev/reference/react/useState) - Key를 이용한 컴포넌트 State 초기화 예제
- [React calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks) - React의 컴포넌트 호출 및 렌더링 규칙

### 추가 자료

- [React Reconciliation (Legacy Documentation)](https://legacy.reactjs.org/docs/reconciliation.html) - Key를 활용한 이전 트리와 새로운 트리의 비교 개념
- [Tutorial: Tic-Tac-Toe](https://react.dev/learn/tutorial-tic-tac-toe) - 목록 항목의 정체성과 Key의 역할에 대한 예제