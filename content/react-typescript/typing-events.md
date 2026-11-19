# Typing Events

React에서는 사용자와 애플리케이션 간의 상호작용을 처리하기 위해 다양한 이벤트를 제공합니다.

버튼 클릭, 입력값 변경, 폼 제출, 키보드 입력, 포커스 이동 등의 이벤트는 이벤트 핸들러(Event Handler)를 통해 처리합니다.

TypeScript를 함께 사용하는 환경에서는 이벤트 핸들러의 매개변수와 이벤트 객체의 타입을 명시하여 타입 안정성을 확보할 수 있습니다.

React는 브라우저의 네이티브 이벤트를 감싸는 Synthetic Event 시스템을 제공하며, 각 이벤트에 대응하는 타입을 `@types/react`에서 정의하고 있습니다.

## 1. Event Handler

이벤트 핸들러는 특정 이벤트가 발생했을 때 실행되는 함수입니다.

React에서는 JSX 요소의 이벤트 속성에 이벤트 핸들러를 전달합니다.

```tsx
function Button() {
  const handleClick = () => {
    console.log("Button clicked");
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

TypeScript는 이벤트 핸들러가 전달되는 JSX 요소와 이벤트 속성을 기반으로 이벤트 타입을 추론할 수 있습니다.

따라서 간단한 이벤트 처리에서는 매개변수의 타입을 직접 선언하지 않아도 됩니다.

```tsx
function Button() {
  return (
    <button
      onClick={(event) => {
        console.log(event.currentTarget);
      }}
    >
      Click Me
    </button>
  );
}
```

위 예제에서 TypeScript는 `event`를 해당 버튼의 클릭 이벤트 타입으로 추론합니다.

다만 이벤트 핸들러를 별도의 함수로 분리하거나 다른 컴포넌트에 Props로 전달하는 경우에는 이벤트 타입을 명시하는 것이 좋습니다.

## 2. React SyntheticEvent

React는 브라우저의 네이티브 이벤트를 감싸는 `SyntheticEvent` 객체를 제공합니다.

Synthetic Event는 브라우저별 이벤트 동작의 차이를 추상화하고 React에서 일관된 이벤트 처리 인터페이스를 제공합니다.

```tsx
function Button() {
  const handleClick = (
    event: React.SyntheticEvent
  ) => {
    console.log(event.type);
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

`React.SyntheticEvent`는 React 이벤트 타입의 기본 인터페이스입니다.

주요 속성과 메서드는 다음과 같습니다.

| 속성 및 메서드 | 설명 |
|---|---|
| `currentTarget` | 현재 이벤트 핸들러가 연결된 요소입니다. |
| `target` | 이벤트가 실제로 발생한 대상입니다. |
| `type` | 이벤트의 종류를 나타냅니다. |
| `bubbles` | 이벤트의 버블링 여부를 나타냅니다. |
| `cancelable` | 이벤트의 기본 동작을 취소할 수 있는지 나타냅니다. |
| `defaultPrevented` | 기본 동작이 취소되었는지 나타냅니다. |
| `preventDefault()` | 브라우저의 기본 동작을 취소합니다. |
| `stopPropagation()` | 이벤트 전파를 중단합니다. |
| `nativeEvent` | 기반이 되는 브라우저 네이티브 이벤트입니다. |

React의 Synthetic Event는 네이티브 이벤트를 기반으로 하지만 두 객체의 타입과 동작이 완전히 동일한 것은 아닙니다.

일반적인 React 이벤트 처리에서는 네이티브 이벤트 타입보다 React에서 제공하는 이벤트 타입을 사용하는 것이 적절합니다.

## 3. Mouse Events

마우스 이벤트는 클릭, 더블 클릭, 마우스 이동 등 마우스 입력과 관련된 이벤트를 처리합니다.

React에서는 `React.MouseEvent`를 사용하여 마우스 이벤트의 타입을 지정할 수 있습니다.

### 3.1 React.MouseEvent

```tsx
function Button() {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log(event.clientX);
    console.log(event.clientY);
    console.log(event.currentTarget.disabled);
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

`React.MouseEvent<T>`는 Generic을 지원하며, 첫 번째 타입 매개변수에 이벤트가 연결된 DOM 요소의 타입을 지정합니다.

위 예제에서는 `HTMLButtonElement`를 지정했으므로 `currentTarget`을 버튼 요소로 취급할 수 있습니다.

주요 마우스 이벤트 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `clientX` | 브라우저 뷰포트를 기준으로 한 X 좌표입니다. |
| `clientY` | 브라우저 뷰포트를 기준으로 한 Y 좌표입니다. |
| `pageX` | 문서 전체를 기준으로 한 X 좌표입니다. |
| `pageY` | 문서 전체를 기준으로 한 Y 좌표입니다. |
| `button` | 눌린 마우스 버튼을 나타냅니다. |
| `buttons` | 현재 눌려 있는 마우스 버튼의 상태를 나타냅니다. |
| `altKey` | Alt 키가 눌려 있었는지 나타냅니다. |
| `ctrlKey` | Ctrl 키가 눌려 있었는지 나타냅니다. |
| `shiftKey` | Shift 키가 눌려 있었는지 나타냅니다. |

### 3.2 Mouse Event Handler Types

마우스 이벤트 핸들러를 별도의 타입으로 선언할 수도 있습니다.

```tsx
type ClickHandler = (
  event: React.MouseEvent<HTMLButtonElement>
) => void;

function Button() {
  const handleClick: ClickHandler = (event) => {
    console.log(event.currentTarget);
  };

  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}
```

이벤트 핸들러 타입을 별도로 선언하면 여러 컴포넌트에서 동일한 이벤트 처리 규칙을 재사용할 수 있습니다.

## 4. Change Events

Change 이벤트는 입력 요소의 값이 변경되었을 때 발생합니다.

React에서는 `React.ChangeEvent<T>`를 사용하여 입력 요소의 변경 이벤트를 처리할 수 있습니다.

### 4.1 Input Change Event

```tsx
function TextInput() {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <input
      type="text"
      onChange={handleChange}
    />
  );
}
```

`React.ChangeEvent<HTMLInputElement>`는 HTML Input 요소의 변경 이벤트를 나타냅니다.

이벤트 객체를 통해 입력값에 접근할 수 있습니다.

```tsx
event.target.value
```

### 4.2 Textarea Change Event

Textarea 요소에서는 `HTMLTextAreaElement`를 지정합니다.

```tsx
function TextArea() {
  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <textarea onChange={handleChange} />
  );
}
```

### 4.3 Select Change Event

Select 요소에서는 `HTMLSelectElement`를 지정합니다.

```tsx
function SelectBox() {
  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
  };

  return (
    <select onChange={handleChange}>
      <option value="react">React</option>
      <option value="typescript">TypeScript</option>
    </select>
  );
}
```

각 입력 요소에 대응하는 DOM 타입을 정확하게 지정해야 해당 요소의 속성에 안전하게 접근할 수 있습니다.

## 5. Form Events

폼 이벤트는 Form 제출과 관련된 동작을 처리합니다.

React에서는 `React.FormEvent<T>`를 사용하여 폼 이벤트의 타입을 지정할 수 있습니다.

```tsx
function LoginForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" />
      <button type="submit">
        Submit
      </button>
    </form>
  );
}
```

`React.FormEvent<HTMLFormElement>`는 HTML Form 요소에서 발생하는 이벤트를 나타냅니다.

폼 제출 이벤트에서는 다음과 같은 동작을 자주 처리합니다.

- `preventDefault()`를 사용하여 브라우저의 기본 제출 동작을 방지합니다.
- 입력값을 수집합니다.
- 유효성 검사를 수행합니다.
- API 요청을 실행합니다.

### 5.1 FormData

`FormData` API를 활용하면 Form 요소에 포함된 입력값을 수집할 수 있습니다.

```tsx
function LoginForm() {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    console.log(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
      />

      <input
        name="password"
        type="password"
      />

      <button type="submit">
        Login
      </button>
    </form>
  );
}
```

`FormData.get()`은 `FormDataEntryValue | null` 타입을 반환하므로 실제 값의 타입을 확인한 후 사용해야 합니다.

`FormDataEntryValue`는 문자열 또는 파일을 나타내는 `string | File` 타입입니다.

## 6. Keyboard Events

키보드 이벤트는 키 입력과 관련된 동작을 처리합니다.

React에서는 `React.KeyboardEvent<T>`를 사용합니다.

```tsx
function SearchInput() {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      console.log("Search submitted");
    }
  };

  return (
    <input
      type="text"
      onKeyDown={handleKeyDown}
    />
  );
}
```

주요 키보드 이벤트 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `key` | 입력된 키의 값을 나타냅니다. |
| `code` | 키보드에서 물리적으로 눌린 키의 위치를 나타냅니다. |
| `altKey` | Alt 키의 눌림 여부입니다. |
| `ctrlKey` | Ctrl 키의 눌림 여부입니다. |
| `metaKey` | Meta 키의 눌림 여부입니다. |
| `shiftKey` | Shift 키의 눌림 여부입니다. |
| `repeat` | 키가 반복 입력되고 있는지 나타냅니다. |

React에서 제공하는 대표적인 키보드 이벤트는 다음과 같습니다.

- `onKeyDown`
- `onKeyUp`

일반적인 키보드 입력 처리에서는 `onKeyDown`을 많이 사용합니다.

## 7. Focus Events

Focus 이벤트는 DOM 요소가 포커스를 얻거나 잃을 때 발생합니다.

React에서는 `React.FocusEvent<T>`를 사용합니다.

```tsx
function TextInput() {
  const handleFocus = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    console.log("Focused:", event.currentTarget);
  };

  const handleBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    console.log("Blurred:", event.currentTarget);
  };

  return (
    <input
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}
```

주요 이벤트는 다음과 같습니다.

| 이벤트 | 설명 |
|---|---|
| `onFocus` | 요소가 포커스를 얻었을 때 발생합니다. |
| `onBlur` | 요소가 포커스를 잃었을 때 발생합니다. |

`React.FocusEvent<T>`는 `relatedTarget` 속성을 제공합니다.

이를 사용하면 포커스가 이동한 대상이나 포커스를 잃기 전의 관계를 확인할 수 있습니다.

## 8. Drag and Drop Events

Drag and Drop 이벤트는 요소를 드래그하거나 다른 요소에 놓는 동작을 처리합니다.

React에서는 `React.DragEvent<T>`를 사용합니다.

```tsx
function DropZone() {
  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    console.log(files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      Drop files here
    </div>
  );
}
```

`React.DragEvent<T>`는 `dataTransfer` 속성을 통해 드래그 데이터에 접근할 수 있습니다.

주요 이벤트는 다음과 같습니다.

- `onDrag`
- `onDragStart`
- `onDragEnd`
- `onDragEnter`
- `onDragLeave`
- `onDragOver`
- `onDrop`

파일 업로드, 드래그 정렬, 데이터 이동 등의 기능을 구현할 때 활용할 수 있습니다.

## 9. Pointer Events

Pointer Event는 마우스, 터치, 펜 입력을 통합적으로 처리하기 위한 이벤트입니다.

React에서는 `React.PointerEvent<T>`를 사용합니다.

```tsx
function Canvas() {
  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    console.log(event.pointerId);
    console.log(event.pointerType);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        width: 200,
        height: 200,
        background: "lightgray",
      }}
    />
  );
}
```

주요 속성은 다음과 같습니다.

| 속성 | 설명 |
|---|---|
| `pointerId` | 포인터의 고유 식별자입니다. |
| `pointerType` | 입력 장치의 종류를 나타냅니다. |
| `pressure` | 포인터의 압력 정도를 나타냅니다. |
| `width` | 포인터 접촉 영역의 너비입니다. |
| `height` | 포인터 접촉 영역의 높이입니다. |
| `isPrimary` | 주 포인터인지 나타냅니다. |

`pointerType`은 일반적으로 다음 값을 가질 수 있습니다.

- `mouse`
- `pen`
- `touch`

Pointer Event는 다양한 입력 장치를 하나의 이벤트 모델로 처리해야 하는 인터페이스에서 유용합니다.

## 10. Event Handler Props

이벤트 핸들러를 다른 컴포넌트에 Props로 전달할 수도 있습니다.

이 경우 이벤트 핸들러 함수의 타입을 명시적으로 정의해야 합니다.

### 10.1 Typing Event Handler Props

```tsx
type ButtonProps = {
  onClick: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

function Button({ onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      Click Me
    </button>
  );
}
```

부모 컴포넌트에서는 해당 이벤트 핸들러를 전달합니다.

```tsx
function App() {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log(event.currentTarget);
  };

  return <Button onClick={handleClick} />;
}
```

### 10.2 React.MouseEventHandler

React는 이벤트 핸들러의 타입을 간결하게 선언할 수 있도록 `React.MouseEventHandler<T>`와 같은 타입을 제공합니다.

```tsx
type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

function Button({ onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      Click Me
    </button>
  );
}
```

이러한 타입은 이벤트 객체를 매개변수로 받고 `void`를 반환하는 이벤트 핸들러 함수의 타입을 표현합니다.

대표적인 이벤트 핸들러 타입은 다음과 같습니다.

| 타입 | 설명 |
|---|---|
| `React.MouseEventHandler<T>` | 마우스 이벤트 핸들러 |
| `React.ChangeEventHandler<T>` | Change 이벤트 핸들러 |
| `React.FormEventHandler<T>` | Form 이벤트 핸들러 |
| `React.KeyboardEventHandler<T>` | 키보드 이벤트 핸들러 |
| `React.FocusEventHandler<T>` | Focus 이벤트 핸들러 |
| `React.PointerEventHandler<T>` | Pointer 이벤트 핸들러 |
| `React.DragEventHandler<T>` | Drag 이벤트 핸들러 |

프로젝트에서는 함수 시그니처를 직접 작성하거나 React에서 제공하는 이벤트 핸들러 타입을 사용할 수 있습니다.

## 11. Event Target and CurrentTarget

이벤트 객체에서 자주 사용하는 속성으로 `target`과 `currentTarget`이 있습니다.

두 속성은 비슷해 보이지만 의미가 다릅니다.

- `target`: 이벤트가 실제로 발생한 대상입니다.
- `currentTarget`: 현재 이벤트 핸들러가 연결된 요소입니다.

다음 예제를 살펴보겠습니다.

```tsx
function Button() {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log(event.target);
    console.log(event.currentTarget);
  };

  return (
    <button onClick={handleClick}>
      <span>Click Me</span>
    </button>
  );
}
```

버튼 내부의 `span`을 클릭한 경우 다음과 같은 차이가 발생합니다.

- `event.target`: 실제 클릭된 `span` 요소입니다.
- `event.currentTarget`: 이벤트 핸들러가 연결된 `button` 요소입니다.

TypeScript에서 `currentTarget`은 이벤트 핸들러에 지정된 DOM 요소 타입을 기반으로 추론됩니다.

반면 `target`은 이벤트가 발생한 실제 대상이므로 일반적으로 더 넓은 타입으로 취급됩니다.

따라서 이벤트 핸들러가 연결된 요소의 속성에 접근할 때는 `currentTarget`을 사용하는 것이 안전합니다.

## 12. Event Propagation

React 이벤트도 이벤트 전파(Event Propagation)를 기반으로 동작합니다.

일반적인 이벤트 전파는 캡처링(Capturing)과 버블링(Bubbling) 단계로 구분됩니다.

```tsx
function App() {
  const handleParentClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    console.log("Parent clicked");
  };

  const handleChildClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log("Child clicked");
  };

  return (
    <div onClick={handleParentClick}>
      <button onClick={handleChildClick}>
        Click Me
      </button>
    </div>
  );
}
```

버튼을 클릭하면 자식 요소의 이벤트 핸들러가 실행된 후 부모 요소로 이벤트가 전파됩니다.

### 12.1 stopPropagation

`stopPropagation()`은 이벤트의 추가 전파를 중단합니다.

```tsx
function App() {
  const handleParentClick = () => {
    console.log("Parent clicked");
  };

  const handleChildClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    console.log("Child clicked");
  };

  return (
    <div onClick={handleParentClick}>
      <button onClick={handleChildClick}>
        Click Me
      </button>
    </div>
  );
}
```

이 경우 버튼의 이벤트 핸들러는 실행되지만 부모 요소의 클릭 이벤트 핸들러까지 전파되지 않습니다.

### 12.2 preventDefault

`preventDefault()`는 브라우저가 제공하는 기본 동작을 취소합니다.

```tsx
function Link() {
  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();

    console.log("Navigation prevented");
  };

  return (
    <a href="/dashboard" onClick={handleClick}>
      Dashboard
    </a>
  );
}
```

`preventDefault()`와 `stopPropagation()`은 서로 다른 기능입니다.

| 메서드 | 역할 |
|---|---|
| `preventDefault()` | 브라우저의 기본 동작을 취소합니다. |
| `stopPropagation()` | 이벤트의 추가 전파를 중단합니다. |

두 메서드는 독립적으로 동작하므로 필요한 상황에 맞게 사용해야 합니다.

## 13. Generic Event Handlers

Generic을 활용하면 여러 DOM 요소에서 재사용할 수 있는 이벤트 핸들러 타입을 정의할 수 있습니다.

```tsx
type ChangeHandler<T extends HTMLElement> = (
  event: React.ChangeEvent<T>
) => void;
```

위 타입은 DOM 요소 타입을 Generic으로 전달받아 해당 요소의 Change Event Handler 타입을 생성합니다.

```tsx
const handleInputChange: ChangeHandler<HTMLInputElement> = (
  event
) => {
  console.log(event.currentTarget.value);
};

const handleSelectChange: ChangeHandler<HTMLSelectElement> = (
  event
) => {
  console.log(event.currentTarget.value);
};
```

다만 실제 컴포넌트의 이벤트 핸들러 Props에서는 React가 제공하는 `React.ChangeEventHandler<T>`를 직접 사용하는 편이 더 간결할 수 있습니다.

Generic 이벤트 타입은 공통적인 타입 추상화가 필요한 경우에 활용하는 것이 좋습니다.

## 14. Best Practices

React + TypeScript 환경에서 이벤트를 처리할 때 다음 사항을 고려하는 것이 좋습니다.

### 14.1 이벤트 타입 추론을 우선적으로 활용합니다.

JSX 내부에서 직접 이벤트 핸들러를 선언하는 경우 TypeScript가 이벤트 타입을 추론할 수 있습니다.

불필요하게 타입을 반복해서 선언하지 않는 것이 좋습니다.

### 14.2 이벤트 대상의 DOM 타입을 정확하게 지정합니다.

이벤트 타입의 Generic 매개변수에는 실제 이벤트가 연결된 DOM 요소의 타입을 지정해야 합니다.

```tsx
React.MouseEvent<HTMLButtonElement>
React.ChangeEvent<HTMLInputElement>
React.FormEvent<HTMLFormElement>
```

이를 통해 `currentTarget`의 타입 안정성을 확보할 수 있습니다.

### 14.3 currentTarget을 우선적으로 사용합니다.

이벤트 핸들러가 연결된 DOM 요소에 접근할 때는 `currentTarget`을 사용하는 것이 일반적으로 안전합니다.

`target`은 실제 이벤트 발생 요소이므로 내부에 중첩된 요소가 존재하는 경우 예상한 DOM 타입과 다를 수 있습니다.

### 14.4 이벤트 핸들러 Props에는 명시적인 타입을 사용합니다.

이벤트 핸들러를 다른 컴포넌트에 전달하는 경우 `React.MouseEventHandler<T>` 등의 타입을 사용하면 인터페이스를 명확하게 정의할 수 있습니다.

### 14.5 Native Event와 Synthetic Event를 구분합니다.

React 이벤트 핸들러에서는 `React.MouseEvent`와 같은 Synthetic Event 타입을 사용합니다.

브라우저의 네이티브 이벤트가 필요한 경우에는 `event.nativeEvent`를 사용하고 해당 이벤트의 타입을 별도로 확인해야 합니다.

### 14.6 이벤트 핸들러를 Props로 전달할 때는 함수 참조를 전달합니다.

```tsx
// 올바른 방식
<button onClick={handleClick}>
  Click
</button>

// 잘못된 방식: 렌더링 중 핸들러를 실행합니다.
<button onClick={handleClick()}>
  Click
</button>
```

매개변수가 필요한 경우에는 화살표 함수를 사용하여 이벤트 발생 시 실행되도록 구성합니다.

```tsx
<button onClick={(event) => handleClick(event, 10)}>
  Click
</button>
```

## 15. Summary

React + TypeScript에서는 이벤트 종류와 연결된 DOM 요소에 따라 적절한 이벤트 타입을 지정해야 합니다.

| 이벤트 타입 | 설명 | 일반적인 DOM 요소 |
|---|---|---|
| `React.SyntheticEvent<T>` | 기본 Synthetic Event | 다양한 요소 |
| `React.MouseEvent<T>` | 마우스 이벤트 | Button, Div 등 |
| `React.ChangeEvent<T>` | 값 변경 이벤트 | Input, Textarea, Select |
| `React.FormEvent<T>` | 폼 이벤트 | Form |
| `React.KeyboardEvent<T>` | 키보드 이벤트 | Input, Textarea 등 |
| `React.FocusEvent<T>` | 포커스 이벤트 | Input, Button 등 |
| `React.DragEvent<T>` | 드래그 앤 드롭 이벤트 | Div 등 |
| `React.PointerEvent<T>` | 포인터 이벤트 | 다양한 요소 |

이벤트 핸들러를 선언할 때는 TypeScript의 타입 추론을 우선적으로 활용하고, 별도 함수나 Props로 분리하는 경우에는 명시적인 이벤트 타입을 사용하는 것이 좋습니다.

특히 `React.SyntheticEvent`, `React.MouseEvent`, `React.ChangeEvent` 등의 차이와 `target`, `currentTarget`의 차이를 이해하면 안정적인 이벤트 처리 코드를 작성할 수 있습니다.

## 16. References

- [React 공식 문서 - Responding to Events](https://react.dev/learn/responding-to-events)
  - React에서 이벤트 핸들러를 선언하고 이벤트 전파를 처리하는 방법을 설명합니다.
- [React 공식 문서 - Using TypeScript](https://react.dev/learn/typescript)
  - React 이벤트 핸들러와 TypeScript 타입 지정 방법을 설명합니다.
- [React 공식 문서 - React DOM Components](https://react.dev/reference/react-dom/components/common)
  - HTML 요소에서 지원하는 React 이벤트 속성과 DOM Props를 설명합니다.
- [React 공식 문서 - SyntheticEvent](https://react.dev/reference/react-dom/components/common#react-event-object)
  - React Synthetic Event 객체의 속성과 메서드를 설명합니다.
- [TypeScript 공식 문서 - JSX](https://www.typescriptlang.org/docs/handbook/jsx.html)
  - TypeScript의 JSX 타입 검사와 JSX 요소의 타입 지정 방법을 설명합니다.
- [React TypeScript Cheatsheet - Forms and Events](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/)
  - React에서 MouseEvent, ChangeEvent, FormEvent 등의 이벤트 타입을 사용하는 방법을 설명합니다.
- [DefinitelyTyped - React Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)
  - React에서 제공하는 SyntheticEvent 및 각 이벤트 타입의 실제 정의를 확인할 수 있습니다.