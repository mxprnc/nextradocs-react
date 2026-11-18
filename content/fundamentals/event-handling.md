# Event Handling

## 1. Event Handling 개요

Event Handling은 사용자의 동작이나 브라우저에서 발생하는 이벤트를 감지하고 이에 대응하는 로직을 실행하는 기능입니다.

React에서는 JSX 요소에 이벤트 핸들러(Event Handler)를 등록하여 사용자와의 상호작용을 처리합니다.

대표적인 이벤트는 다음과 같습니다.

| 이벤트 | 설명 |
|---|---|
| `onClick` | 요소를 클릭했을 때 발생합니다. |
| `onDoubleClick` | 요소를 더블 클릭했을 때 발생합니다. |
| `onChange` | 입력 요소의 값이 변경되었을 때 발생합니다. |
| `onSubmit` | 폼이 제출되었을 때 발생합니다. |
| `onFocus` | 요소에 포커스가 설정되었을 때 발생합니다. |
| `onBlur` | 요소에서 포커스가 해제되었을 때 발생합니다. |
| `onKeyDown` | 키보드 키를 눌렀을 때 발생합니다. |
| `onKeyUp` | 키보드 키를 놓았을 때 발생합니다. |
| `onMouseEnter` | 마우스 포인터가 요소 영역에 진입했을 때 발생합니다. |
| `onMouseLeave` | 마우스 포인터가 요소 영역을 벗어났을 때 발생합니다. |

React의 이벤트 핸들링은 기본적으로 브라우저의 이벤트 시스템을 기반으로 하며, JSX를 통해 선언적으로 이벤트 핸들러를 연결할 수 있도록 지원합니다.

## 2. 이벤트 핸들러 등록

React에서는 JSX 요소의 이벤트 속성에 함수를 전달하여 이벤트 핸들러를 등록합니다.

이벤트 이름은 camelCase로 작성하며, 함수 참조를 전달해야 합니다.

```tsx
function Button() {
  function handleClick() {
    console.log('Button clicked');
  }

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

버튼을 클릭하면 `handleClick` 함수가 실행됩니다.

### 2.1 이벤트 이름은 camelCase로 작성합니다

React의 이벤트 속성은 HTML의 소문자 이벤트 속성과 달리 camelCase를 사용합니다.

```tsx
// HTML
<button onclick="handleClick()">Click</button>

// React JSX
<button onClick={handleClick}>Click</button>
```

React에서는 `onClick`, `onChange`, `onSubmit`과 같은 형식으로 이벤트 속성을 작성합니다.

### 2.2 함수 참조를 전달합니다

이벤트 핸들러에는 함수 자체를 전달해야 합니다.

```tsx
function Button() {
  function handleClick() {
    console.log('Clicked');
  }

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

다음과 같이 함수를 직접 호출하면 안 됩니다.

```tsx
function Button() {
  function handleClick() {
    console.log('Clicked');
  }

  // 잘못된 방식
  return (
    <button onClick={handleClick()}>
      Click
    </button>
  );
}
```

`handleClick()`은 함수 참조를 전달하는 것이 아니라 렌더링 과정에서 함수를 즉시 호출하는 표현식입니다.

따라서 이벤트가 발생하기 전에 함수가 실행되며, 반환값이 이벤트 핸들러 자리에 전달됩니다.

이벤트가 발생했을 때 실행하려면 함수 참조를 전달해야 합니다.

### 2.3 인자가 필요한 이벤트 핸들러

이벤트 핸들러에 추가 인자를 전달해야 한다면 화살표 함수를 사용할 수 있습니다.

```tsx
type User = {
  id: number;
  name: string;
};

function UserList({ users }: { users: User[] }) {
  function handleDelete(userId: number) {
    console.log(`Delete user: ${userId}`);
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}

          <button onClick={() => handleDelete(user.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

`onClick={() => handleDelete(user.id)}`는 이벤트가 발생했을 때 `handleDelete`를 호출하는 새로운 함수를 전달합니다.

화살표 함수 내부에서 전달하는 인자는 이벤트 객체가 아닌 별도의 데이터입니다.

### 2.4 이벤트 객체와 추가 인자 전달

이벤트 핸들러는 이벤트 객체를 첫 번째 인자로 전달받습니다.

추가 인자와 이벤트 객체를 함께 사용하려면 다음과 같이 작성할 수 있습니다.

```tsx
function Button() {
  function handleClick(
    userId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    console.log('User ID:', userId);
    console.log('Event:', event);
  }

  return (
    <button onClick={event => handleClick(10, event)}>
      Click
    </button>
  );
}
```

React는 이벤트가 발생했을 때 이벤트 객체를 핸들러에 전달합니다.

따라서 추가 인자를 전달하는 화살표 함수에서 이벤트 객체를 명시적으로 받아 내부 함수에 전달할 수 있습니다.

## 3. Event Handler의 네이밍

React에서는 이벤트 핸들러 함수의 이름에 `handle` 접두사를 사용하는 관례가 널리 사용됩니다.

```tsx
function SearchForm() {
  function handleSubmit() {
    console.log('Form submitted');
  }

  function handleChange() {
    console.log('Input changed');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
}
```

일반적으로 다음과 같이 구분하여 작성합니다.

- `onClick`: 이벤트를 연결하는 JSX 속성
- `handleClick`: 이벤트 발생 시 실행되는 함수

이벤트 핸들러 이름은 함수가 수행하는 동작을 명확하게 표현하는 것이 좋습니다.

```tsx
function handleDelete() {}
function handleSave() {}
function handleSearch() {}
function handleSubmit() {}
```

컴포넌트의 Props로 이벤트 핸들러를 전달하는 경우에는 `on` 접두사를 사용하는 방식이 일반적입니다.

```tsx
type SaveButtonProps = {
  onSave: () => void;
};

function SaveButton({ onSave }: SaveButtonProps) {
  return (
    <button onClick={onSave}>
      Save
    </button>
  );
}
```

부모 컴포넌트는 `onSave`를 전달하고, 자식 컴포넌트는 내부의 클릭 이벤트와 연결합니다.

## 4. React Event와 SyntheticEvent

React는 브라우저 이벤트를 일관된 방식으로 처리할 수 있도록 React 이벤트 객체를 제공합니다.

React의 이벤트 객체는 브라우저의 네이티브 이벤트를 감싸는 인터페이스이며, 일반적으로 `SyntheticEvent`라고 부릅니다.

```tsx
function Button() {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(event.type);
    console.log(event.currentTarget);
    console.log(event.target);
    console.log(event.nativeEvent);
  }

  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

React 이벤트 객체는 네이티브 이벤트와 유사한 인터페이스를 제공하므로 이벤트 종류에 관계없이 일관된 방식으로 처리할 수 있습니다.

### 4.1 SyntheticEvent의 주요 속성

| 속성 | 설명 |
|---|---|
| `type` | 이벤트의 종류를 나타냅니다. |
| `target` | 이벤트가 실제로 발생한 대상 요소입니다. |
| `currentTarget` | 현재 이벤트 핸들러가 연결된 요소입니다. |
| `nativeEvent` | 브라우저의 네이티브 이벤트 객체입니다. |
| `bubbles` | 이벤트의 버블링 여부를 나타냅니다. |
| `cancelable` | 기본 동작을 취소할 수 있는지 나타냅니다. |
| `defaultPrevented` | 기본 동작이 취소되었는지 나타냅니다. |

### 4.2 target과 currentTarget

`target`과 `currentTarget`은 이벤트 전파를 이해할 때 중요한 속성입니다.

- `target`: 이벤트가 실제로 발생한 요소입니다.
- `currentTarget`: 현재 실행 중인 이벤트 핸들러가 등록된 요소입니다.

```tsx
function handleClick(event: React.MouseEvent<HTMLDivElement>) {
  console.log('target:', event.target);
  console.log('currentTarget:', event.currentTarget);
}

function App() {
  return (
    <div onClick={handleClick}>
      <button>
        Click
      </button>
    </div>
  );
}
```

버튼을 클릭하면 다음과 같은 차이가 발생합니다.

- `event.target`: 실제 클릭된 `button` 요소입니다.
- `event.currentTarget`: `onClick` 핸들러가 등록된 `div` 요소입니다.

이벤트가 버블링되어 부모 요소의 핸들러가 실행되는 경우 두 속성의 값이 달라질 수 있습니다.

### 4.3 Native Event와의 관계

React 이벤트 객체는 `nativeEvent`를 통해 브라우저의 원본 이벤트에 접근할 수 있습니다.

```tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  const nativeEvent = event.nativeEvent;

  console.log(nativeEvent);
}
```

대부분의 일반적인 이벤트 처리에서는 React 이벤트 객체만으로 충분합니다.

브라우저 고유 이벤트 속성이나 네이티브 이벤트 API가 필요한 경우 `nativeEvent`를 활용할 수 있습니다.

React 이벤트 객체와 네이티브 이벤트의 세부적인 매핑은 React 내부 구현에 따라 달라질 수 있으므로 특정 네이티브 이벤트 타입에 대한 일대일 대응을 가정해서는 안 됩니다.

### 4.4 SyntheticEvent의 풀링(Pooling)

과거 React에서는 성능 최적화를 위해 SyntheticEvent 객체를 재사용하는 이벤트 풀링 방식을 사용했습니다.

React 17부터 웹 환경의 이벤트 풀링은 제거되었습니다.

따라서 최신 React에서는 이벤트 핸들러가 종료된 이후에도 비동기 작업에서 이벤트 객체를 사용하는 것이 가능합니다.

```tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  setTimeout(() => {
    console.log(event.currentTarget);
  }, 1000);
}
```

다만 `currentTarget`은 이벤트 핸들러가 실행되는 동안 현재 핸들러가 연결된 요소를 가리키는 속성입니다. 비동기 작업에서는 필요한 DOM 요소나 값을 이벤트 핸들러 내부에서 별도로 저장하는 편이 명확합니다.

```tsx
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  const button = event.currentTarget;

  setTimeout(() => {
    console.log(button);
  }, 1000);
}
```

## 5. Event Propagation

브라우저의 이벤트는 DOM 트리의 구조에 따라 전파될 수 있습니다.

일반적인 이벤트 전파는 다음 세 단계로 구분됩니다.

1. Capturing Phase: 상위 요소에서 이벤트 대상 요소 방향으로 전파됩니다.
2. Target Phase: 이벤트가 실제로 발생한 대상 요소에서 처리됩니다.
3. Bubbling Phase: 이벤트 대상 요소에서 상위 요소 방향으로 전파됩니다.

React에서도 이벤트 전파를 활용하여 부모 요소에서 자식 요소의 이벤트를 처리할 수 있습니다.

### 5.1 Bubbling

Bubbling은 이벤트가 발생한 요소에서 상위 요소 방향으로 전파되는 방식입니다.

```tsx
function App() {
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <button onClick={() => console.log('Child clicked')}>
        Click
      </button>
    </div>
  );
}
```

버튼을 클릭하면 다음 순서로 핸들러가 실행됩니다.

```text
Child clicked
Parent clicked
```

자식 요소의 이벤트가 발생한 뒤 부모 요소의 이벤트 핸들러가 실행됩니다.

React에서는 대부분의 이벤트 핸들링에서 버블링을 활용할 수 있습니다.

### 5.2 Capturing

이벤트 캡처링을 사용하려면 이벤트 속성 이름에 `Capture`를 추가합니다.

```tsx
function App() {
  return (
    <div onClickCapture={() => console.log('Parent capture')}>
      <button
        onClickCapture={() => console.log('Child capture')}
        onClick={() => console.log('Child bubble')}
      >
        Click
      </button>
    </div>
  );
}
```

버튼을 클릭하면 다음 순서로 실행됩니다.

```text
Parent capture
Child capture
Child bubble
```

캡처링 핸들러는 상위 요소에서 하위 요소 방향으로 실행됩니다.

이후 버블링 단계에서 일반 `onClick` 핸들러가 실행됩니다.

캡처링은 하위 요소의 이벤트가 버블링되기 전에 상위 요소에서 이벤트를 감지해야 하는 경우에 활용할 수 있습니다.

## 6. Event Propagation 제어

이벤트가 상위 요소로 전파되는 것을 중단하거나 브라우저의 기본 동작을 취소해야 하는 경우 이벤트 객체의 메서드를 사용할 수 있습니다.

### 6.1 stopPropagation()

`stopPropagation()`은 현재 이벤트의 전파를 중단합니다.

```tsx
function App() {
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <button
        onClick={event => {
          event.stopPropagation();
          console.log('Child clicked');
        }}
      >
        Click
      </button>
    </div>
  );
}
```

버튼을 클릭하면 다음과 같이 실행됩니다.

```text
Child clicked
```

`stopPropagation()`을 호출했기 때문에 이벤트가 부모 요소까지 버블링되지 않습니다.

단, 이벤트 전파를 중단한다고 해서 같은 요소에 등록된 다른 이벤트 핸들러까지 모두 중단되는 것은 아닙니다.

### 6.2 preventDefault()

`preventDefault()`는 브라우저가 제공하는 이벤트의 기본 동작을 취소합니다.

예를 들어 HTML 폼은 기본적으로 제출될 때 페이지를 새로고침하거나 현재 페이지를 다른 응답으로 이동시킬 수 있습니다.

React에서는 `preventDefault()`를 사용하여 기본 제출 동작을 제어할 수 있습니다.

```tsx
function SearchForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Custom form submission');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">Search</button>
    </form>
  );
}
```

`preventDefault()`를 호출하면 브라우저의 기본 폼 제출 동작이 취소됩니다.

이후 필요한 데이터 검증이나 서버 요청 등의 로직을 직접 실행할 수 있습니다.

### 6.3 stopPropagation과 preventDefault 비교

두 메서드는 서로 다른 목적을 가집니다.

| 메서드 | 목적 | 제어 대상 |
|---|---|---|
| `stopPropagation()` | 이벤트 전파 중단 | 이벤트 전파 |
| `preventDefault()` | 브라우저 기본 동작 취소 | 기본 동작 |

두 메서드는 독립적으로 사용할 수 있습니다.

```tsx
function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  event.stopPropagation();
}
```

위 코드는 링크의 기본 이동 동작을 취소하고 이벤트의 상위 요소 전파도 중단합니다.

필요한 목적에 맞는 메서드를 선택해야 하며, 이벤트 전파와 기본 동작을 무조건 차단하는 방식은 피하는 것이 좋습니다.

## 7. Event Handler와 State

이벤트 핸들러는 일반적으로 사용자의 상호작용에 따라 State를 변경하거나 특정 동작을 실행하는 역할을 합니다.

예를 들어 버튼 클릭에 따라 숫자를 증가시키는 경우 다음과 같이 구현할 수 있습니다.

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    setCount(previousCount => previousCount + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>

      <button onClick={handleIncrement}>
        Increase
      </button>
    </div>
  );
}
```

이벤트 핸들러가 `setCount()`를 호출하면 State 업데이트가 예약되고 React는 변경된 State를 기반으로 컴포넌트를 다시 렌더링합니다.

이벤트 핸들러는 렌더링 과정에서 호출되는 것이 아니라 실제 이벤트가 발생했을 때 실행됩니다.

State의 구조와 업데이트 방식은 [State](./state.md) 문서를 참고할 수 있습니다.

### 7.1 이벤트 핸들러에서 State 직접 변경 금지

State는 직접 변경하지 않고 State Setter를 사용하여 업데이트해야 합니다.

```tsx
// 잘못된 방식
function handleIncrement() {
  count += 1;
}

// 올바른 방식
function handleIncrement() {
  setCount(previousCount => previousCount + 1);
}
```

State는 React가 관리하는 렌더링 데이터이므로 직접 변경하면 React가 변경 사항을 올바르게 감지하지 못할 수 있습니다.

## 8. Event Handler와 비동기 처리

이벤트 핸들러에서는 서버 요청, 파일 처리, 타이머 등 비동기 작업을 실행할 수 있습니다.

```tsx
function SearchButton() {
  async function handleSearch() {
    try {
      const response = await fetch('/api/search');
      const result = await response.json();

      console.log(result);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  return (
    <button onClick={handleSearch}>
      Search
    </button>
  );
}
```

`async` 함수도 이벤트 핸들러로 전달할 수 있습니다.

다만 React의 이벤트 핸들러는 반환된 Promise를 자동으로 기다리거나 일반적인 오류 처리를 대신 수행하지 않습니다.

따라서 비동기 작업에서 발생할 수 있는 오류는 `try...catch` 등으로 직접 처리해야 합니다.

또한 비동기 요청의 진행 상태나 결과를 화면에 표시하려면 State를 활용해야 합니다.

```tsx
import { useState } from 'react';

type SearchResult = {
  message: string;
};

function SearchButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  async function handleSearch() {
    setIsLoading(true);

    try {
      const response = await fetch('/api/search');

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data: SearchResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Search'}
      </button>

      {result && <p>{result.message}</p>}
    </div>
  );
}
```

이벤트 핸들러는 요청을 시작하고, State는 요청 진행 상태와 결과를 화면에 반영하는 역할을 담당합니다.

## 9. React와 브라우저 이벤트의 차이

React의 이벤트 핸들링은 JSX를 통해 선언적으로 작성하지만, 모든 브라우저 이벤트를 JSX 속성만으로 처리하는 것은 아닙니다.

일반적인 사용자 상호작용은 JSX 이벤트 핸들러로 처리할 수 있습니다.

```tsx
function Button() {
  return (
    <button onClick={() => console.log('Clicked')}>
      Click
    </button>
  );
}
```

반면 컴포넌트의 생명주기와 관계없이 전역 이벤트를 구독하거나 브라우저 API를 직접 사용해야 하는 경우에는 `addEventListener()`를 사용할 수 있습니다.

```tsx
import { useEffect } from 'react';

function WindowResizeListener() {
  useEffect(() => {
    function handleResize() {
      console.log(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <p>Resize the browser window.</p>;
}
```

위 예제는 컴포넌트가 화면에 표시되는 동안 브라우저의 `resize` 이벤트를 구독합니다.

컴포넌트가 제거되면 이벤트 리스너를 해제합니다.

이벤트 구독과 정리 과정은 Effect의 생명주기와 관련되므로 자세한 내용은 [useEffect](../hooks/use-effect.md) 문서를 참고할 수 있습니다.

## 10. TypeScript와 Event Handling

TypeScript에서는 React 이벤트 객체의 타입을 지정하여 이벤트 핸들러 내부의 요소와 이벤트 속성을 안전하게 사용할 수 있습니다.

React는 이벤트 종류와 대상 요소에 따라 다양한 이벤트 타입을 제공합니다.

### 10.1 MouseEvent

마우스 이벤트는 `React.MouseEvent`를 사용합니다.

```tsx
function handleClick(
  event: React.MouseEvent<HTMLButtonElement>
) {
  console.log(event.currentTarget);
}

function Button() {
  return (
    <button onClick={handleClick}>
      Click
    </button>
  );
}
```

`HTMLButtonElement`는 이벤트가 연결된 요소의 타입을 의미합니다.

따라서 `event.currentTarget`은 `HTMLButtonElement` 타입으로 추론됩니다.

### 10.2 ChangeEvent

입력 요소의 값이 변경되는 이벤트는 `React.ChangeEvent`를 사용할 수 있습니다.

```tsx
function handleChange(
  event: React.ChangeEvent<HTMLInputElement>
) {
  console.log(event.target.value);
}

function Input() {
  return <input onChange={handleChange} />;
}
```

`HTMLInputElement`를 지정하면 `value`, `checked` 등의 입력 요소 속성에 타입 안전하게 접근할 수 있습니다.

Textarea와 Select도 각각 실제 요소 타입을 지정합니다.

```tsx
function handleTextareaChange(
  event: React.ChangeEvent<HTMLTextAreaElement>
) {
  console.log(event.target.value);
}

function handleSelectChange(
  event: React.ChangeEvent<HTMLSelectElement>
) {
  console.log(event.target.value);
}
```

### 10.3 FormEvent

폼 제출 이벤트에는 `React.FormEvent`를 사용할 수 있습니다.

```tsx
function handleSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  console.log('Form submitted');
}

function Form() {
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

`HTMLFormElement`를 지정하면 이벤트가 연결된 폼 요소에 맞는 타입을 사용할 수 있습니다.

### 10.4 KeyboardEvent

키보드 이벤트에는 `React.KeyboardEvent`를 사용합니다.

```tsx
function handleKeyDown(
  event: React.KeyboardEvent<HTMLInputElement>
) {
  if (event.key === 'Enter') {
    console.log('Enter pressed');
  }
}

function SearchInput() {
  return (
    <input
      type="text"
      onKeyDown={handleKeyDown}
    />
  );
}
```

`event.key`를 사용하면 입력된 키의 값을 확인할 수 있습니다.

### 10.5 FocusEvent

포커스 이벤트에는 `React.FocusEvent`를 사용할 수 있습니다.

```tsx
function handleFocus(
  event: React.FocusEvent<HTMLInputElement>
) {
  console.log('Focused:', event.currentTarget);
}

function Input() {
  return <input onFocus={handleFocus} />;
}
```

### 10.6 주요 React 이벤트 타입

| 이벤트 종류 | TypeScript 타입 |
|---|---|
| Mouse | `React.MouseEvent<T>` |
| Change | `React.ChangeEvent<T>` |
| Form | `React.FormEvent<T>` |
| Keyboard | `React.KeyboardEvent<T>` |
| Focus | `React.FocusEvent<T>` |
| Pointer | `React.PointerEvent<T>` |
| Drag | `React.DragEvent<T>` |
| Touch | `React.TouchEvent<T>` |
| Clipboard | `React.ClipboardEvent<T>` |
| Wheel | `React.WheelEvent<T>` |

`T`에는 이벤트가 연결된 실제 HTML 요소 타입을 지정합니다.

### 10.7 이벤트 핸들러 타입 정의

이벤트 핸들러를 Props로 전달해야 하는 경우에는 React가 제공하는 이벤트 핸들러 타입을 활용할 수 있습니다.

```tsx
type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

function Button({ onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      Click
    </button>
  );
}
```

다른 컴포넌트에서 이벤트 핸들러를 전달할 때도 동일한 타입을 사용할 수 있습니다.

```tsx
function App() {
  function handleClick(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    console.log(event.currentTarget);
  }

  return <Button onClick={handleClick} />;
}
```

반면 이벤트 객체를 사용하지 않고 단순히 특정 동작만 전달한다면 다음과 같이 함수 타입을 정의할 수도 있습니다.

```tsx
type ButtonProps = {
  onClick: () => void;
};
```

이 경우에는 이벤트 객체를 전달받지 않는 콜백이라는 점이 타입에 명확하게 표현됩니다.

### 10.8 인라인 이벤트 핸들러의 타입 추론

JSX에 이벤트 핸들러를 직접 작성하면 TypeScript가 이벤트 객체의 타입을 추론합니다.

```tsx
function Input() {
  return (
    <input
      onChange={event => {
        console.log(event.target.value);
      }}
    />
  );
}
```

별도로 이벤트 타입을 지정하지 않아도 JSX 속성과 대상 요소를 기반으로 적절한 타입이 추론됩니다.

따라서 간단한 이벤트 핸들러는 인라인 함수로 작성해도 괜찮습니다.

## 11. 주의사항

### 11.1 렌더링 중 이벤트 핸들러를 실행하지 않기

이벤트 핸들러는 함수 참조로 전달해야 하며 렌더링 과정에서 직접 실행해서는 안 됩니다.

```tsx
// 잘못된 방식
<button onClick={handleClick()} />

// 올바른 방식
<button onClick={handleClick} />
```

이벤트 핸들러를 직접 호출하면 이벤트가 발생하기 전에 함수가 실행됩니다.

### 11.2 이벤트 핸들러에서 컴포넌트 State를 직접 변경하지 않기

State는 직접 수정하지 않고 Setter를 사용하여 변경해야 합니다.

```tsx
// 잘못된 방식
count += 1;

// 올바른 방식
setCount(previousCount => previousCount + 1);
```

### 11.3 이벤트 전파를 무조건 차단하지 않기

`stopPropagation()`은 부모 컴포넌트가 이벤트를 처리하지 못하게 만들 수 있습니다.

컴포넌트 간 이벤트 처리 구조를 고려하여 필요한 경우에만 사용해야 합니다.

### 11.4 preventDefault와 stopPropagation을 혼동하지 않기

`preventDefault()`는 브라우저의 기본 동작을 취소하고, `stopPropagation()`은 이벤트 전파를 중단합니다.

두 메서드는 서로 다른 목적을 가지고 있습니다.

### 11.5 비동기 작업의 오류 처리

이벤트 핸들러에서 비동기 작업을 실행하는 경우 요청 실패나 예외 상황을 직접 처리해야 합니다.

`async` 함수에서 발생한 오류가 자동으로 React Error Boundary에 전달된다고 가정해서는 안 됩니다.

### 11.6 이벤트 리스너 정리하기

`addEventListener()`로 직접 등록한 이벤트 리스너는 더 이상 필요하지 않을 때 제거해야 합니다.

컴포넌트가 제거되거나 구독 대상이 변경될 때 이벤트 리스너가 남아 있으면 중복 실행이나 불필요한 리소스 사용으로 이어질 수 있습니다.

## 12. 핵심 정리

- React에서는 JSX의 이벤트 속성에 이벤트 핸들러 함수를 전달하여 사용자 상호작용을 처리합니다.
- 이벤트 속성은 `onClick`, `onChange`, `onSubmit`처럼 camelCase로 작성합니다.
- 이벤트 핸들러에는 함수 참조를 전달해야 하며 렌더링 중 직접 호출해서는 안 됩니다.
- 추가 인자가 필요한 경우 화살표 함수를 사용하여 이벤트 발생 시 함수를 호출할 수 있습니다.
- React는 SyntheticEvent 인터페이스를 제공하여 브라우저 이벤트를 일관된 방식으로 처리할 수 있도록 지원합니다.
- `target`은 실제 이벤트 발생 요소이고 `currentTarget`은 현재 핸들러가 연결된 요소입니다.
- 이벤트는 캡처링과 버블링 과정을 통해 전파될 수 있습니다.
- `stopPropagation()`은 이벤트 전파를 중단하고 `preventDefault()`는 브라우저의 기본 동작을 취소합니다.
- 이벤트 핸들러에서는 State 업데이트, API 요청, 사용자 입력 처리 등을 수행할 수 있습니다.
- 전역 브라우저 이벤트를 직접 구독하는 경우 `addEventListener()`와 정리 함수를 함께 사용해야 합니다.
- TypeScript에서는 `React.MouseEvent`, `React.ChangeEvent`, `React.FormEvent` 등의 타입을 활용할 수 있습니다.
- 비동기 이벤트 핸들러의 오류는 직접 처리해야 합니다.

## 13. 참고 자료

### React 공식 문서

- [Responding to Events](https://react.dev/learn/responding-to-events) - React 이벤트 핸들러의 등록, 호출 및 전달
- [Event Object](https://react.dev/reference/react-dom/components/common#react-event-object) - React 이벤트 객체의 속성과 메서드
- [React DOM Components](https://react.dev/reference/react-dom/components/common) - 공통 DOM 컴포넌트의 이벤트 속성
- [React calls Components and Hooks](https://react.dev/reference/rules/react-calls-components-and-hooks) - React의 컴포넌트 및 Hook 호출 규칙
- [useEffect](https://react.dev/reference/react/useEffect) - 외부 시스템과의 동기화 및 이벤트 리스너 정리

### JavaScript 및 브라우저 공식 문서

- [MDN - Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) - 브라우저 이벤트 객체
- [MDN - EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) - 이벤트 리스너 등록
- [MDN - Event.stopPropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) - 이벤트 전파 중단
- [MDN - Event.preventDefault()](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) - 브라우저 기본 동작 취소
- [MDN - Event Bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling) - 이벤트 캡처링과 버블링

### TypeScript 참고 자료

- [React TypeScript Cheatsheet - Event Types](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/) - React 이벤트 핸들러의 TypeScript 타입 지정
- [TypeScript Handbook - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) - TypeScript의 JSX 타입 검사