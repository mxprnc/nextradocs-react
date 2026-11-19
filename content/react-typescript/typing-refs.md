# Typing Refs

React의 Ref(Reference)는 DOM 요소 또는 렌더링과 무관하게 유지해야 하는 값을 참조하기 위한 기능입니다.

일반적인 상태(State)는 변경될 때 컴포넌트의 리렌더링을 발생시키지만, Ref의 `current` 값은 변경되어도 리렌더링을 발생시키지 않습니다.

TypeScript에서는 Ref가 참조하는 값의 타입을 명시하여 DOM API 접근과 컴포넌트 간 Ref 전달을 안전하게 처리할 수 있습니다.

## 1. Ref 기본 개념

React에서 Ref는 주로 다음과 같은 목적으로 사용됩니다.

- DOM 요소에 직접 접근합니다.
- 입력 요소의 포커스, 스크롤, 크기 등을 제어합니다.
- 타이머 ID나 외부 라이브러리 인스턴스를 저장합니다.
- 렌더링과 무관하게 유지해야 하는 값을 저장합니다.
- 부모 컴포넌트에서 자식 컴포넌트의 특정 기능에 접근합니다.

Ref는 일반적으로 `useRef` Hook을 통해 생성합니다.

```tsx
import { useRef } from "react";

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <>
      <input ref={inputRef} />

      <button onClick={handleFocus}>
        Focus
      </button>
    </>
  );
}
```

`useRef<HTMLInputElement>(null)`은 `HTMLInputElement`를 참조하는 Ref 객체를 생성합니다.

초기 렌더링 시점에는 DOM 요소가 아직 연결되지 않았을 수 있으므로 `null`을 초기값으로 전달합니다.

따라서 `inputRef.current`는 `HTMLInputElement | null` 타입으로 처리됩니다.

## 2. Ref Types

React는 Ref를 표현하기 위해 여러 타입을 제공합니다.

대표적인 타입은 다음과 같습니다.

| 타입 | 설명 |
|---|---|
| `RefObject<T>` | `current`를 통해 참조 대상에 접근하는 Ref 객체 타입입니다. |
| `Ref<T>` | Ref 객체, Callback Ref 또는 `null`을 포함하는 Ref 타입입니다. |
| `RefCallback<T>` | Ref 연결 및 해제 시 호출되는 Callback Ref 타입입니다. |
| `MutableRefObject<T>` | 변경 가능한 `current` 속성을 표현하는 과거 타입 정의입니다. |

실제 타입 정의는 React 버전에 따라 차이가 있으므로 사용하는 React 및 `@types/react` 버전을 함께 고려해야 합니다.

### 2.1 RefObject

`RefObject<T>`는 Ref 객체의 형태를 표현하는 타입입니다.

React 19의 타입 정의에서는 다음과 유사한 구조를 가집니다.

```tsx
interface RefObject<T> {
  current: T;
}
```

React 19에서는 `useRef<HTMLInputElement>(null)`의 반환 타입에 `null`이 포함된 형태로 처리됩니다.

따라서 DOM Ref를 선언할 때는 다음과 같이 작성할 수 있습니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

`current`는 `HTMLInputElement | null` 타입으로 처리되므로 DOM 요소에 접근하기 전에 Null 검사를 수행해야 합니다.

### 2.2 Ref<T>

`Ref<T>`는 Ref를 전달하거나 컴포넌트 Props로 정의할 때 사용하는 타입입니다.

React 19의 타입 정의에서는 다음과 같은 형태입니다.

```tsx
type Ref<T> =
  | RefCallback<T>
  | RefObject<T | null>
  | null;
```

따라서 Ref 객체뿐 아니라 Callback Ref도 동일한 Ref 타입으로 전달할 수 있습니다.

```tsx
import type { Ref } from "react";

type InputProps = {
  ref?: Ref<HTMLInputElement>;
};
```

이 타입은 외부에서 전달되는 Ref의 다양한 형태를 허용해야 할 때 유용합니다.

### 2.3 RefCallback<T>

`RefCallback<T>`는 DOM 요소가 연결되거나 해제될 때 실행되는 콜백 함수 타입입니다.

```tsx
import type { RefCallback } from "react";

const inputCallbackRef: RefCallback<HTMLInputElement> = (node) => {
  if (node) {
    node.focus();
  }
};
```

Callback Ref는 DOM 요소가 연결되면 해당 요소를 인자로 전달받습니다.

React 19에서는 Callback Ref가 정리 함수를 반환하는 방식도 지원합니다.

```tsx
const inputCallbackRef: RefCallback<HTMLInputElement> = (node) => {
  if (!node) {
    return;
  }

  console.log("Input connected");

  return () => {
    console.log("Input disconnected");
  };
};
```

이 방식은 DOM 연결 및 해제 시 필요한 작업을 하나의 Callback Ref에서 관리할 때 활용할 수 있습니다.

### 2.4 MutableRefObject<T>

`MutableRefObject<T>`는 과거 React 타입 정의에서 변경 가능한 Ref 객체를 표현하기 위해 사용되었습니다.

React 19의 타입 정의에서는 `useRef`가 변경 가능한 `RefObject`를 반환하는 방식으로 정리되었으므로, 새로운 코드에서는 `MutableRefObject`에 의존하기보다 `useRef`의 반환 타입 추론을 활용하는 것이 좋습니다.

기존 코드나 라이브러리에서 `MutableRefObject`를 사용하는 경우에는 해당 프로젝트의 React 타입 버전을 확인해야 합니다.

## 3. useRef for DOM Elements

DOM 요소를 참조하는 Ref는 가장 일반적인 Ref 사용 사례입니다.

TypeScript에서는 참조할 DOM 요소의 구체적인 타입을 지정해야 합니다.

### 3.1 HTML Element Types

DOM 요소의 종류에 따라 적절한 타입을 사용합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

const buttonRef = useRef<HTMLButtonElement>(null);

const divRef = useRef<HTMLDivElement>(null);

const formRef = useRef<HTMLFormElement>(null);

const textareaRef = useRef<HTMLTextAreaElement>(null);
```

대표적인 DOM 요소 타입은 다음과 같습니다.

| HTML 요소 | TypeScript 타입 |
|---|---|
| `<input>` | `HTMLInputElement` |
| `<button>` | `HTMLButtonElement` |
| `<div>` | `HTMLDivElement` |
| `<form>` | `HTMLFormElement` |
| `<textarea>` | `HTMLTextAreaElement` |
| `<select>` | `HTMLSelectElement` |
| `<ul>` | `HTMLUListElement` |
| `<canvas>` | `HTMLCanvasElement` |
| `<video>` | `HTMLVideoElement` |
| `<audio>` | `HTMLAudioElement` |

DOM 요소의 타입을 구체적으로 지정하면 해당 요소에서 제공하는 속성과 메서드를 타입 안전하게 사용할 수 있습니다.

### 3.2 Null Checking

Ref의 초기값은 일반적으로 `null`이므로 DOM 요소에 접근하기 전에 Null 검사를 수행해야 합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function focusInput() {
  if (inputRef.current !== null) {
    inputRef.current.focus();
  }
}
```

Optional Chaining을 사용하면 간결하게 표현할 수 있습니다.

```tsx
function focusInput() {
  inputRef.current?.focus();
}
```

다음과 같이 Non-null Assertion을 사용할 수도 있지만, 실제로 Ref가 연결되어 있다는 보장이 없다면 런타임 오류가 발생할 수 있으므로 주의해야 합니다.

```tsx
inputRef.current!.focus();
```

가능하면 Null 검사를 통해 Ref가 연결되지 않은 상황을 명시적으로 처리하는 것이 좋습니다.

### 3.3 DOM API Access

Ref를 통해 DOM 요소의 속성이나 메서드에 접근할 수 있습니다.

```tsx
function InputExample() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    const input = inputRef.current;

    if (!input) {
      return;
    }

    input.focus();
    input.select();

    console.log(input.value);
    console.log(input.disabled);
  };

  return (
    <>
      <input ref={inputRef} />

      <button onClick={handleClick}>
        Select Text
      </button>
    </>
  );
}
```

`HTMLInputElement` 타입을 지정했기 때문에 `focus()`, `select()`, `value`, `disabled` 등의 API를 타입 검사와 함께 사용할 수 있습니다.

## 4. useRef for Mutable Values

`useRef`는 DOM 요소뿐 아니라 일반적인 JavaScript 값도 저장할 수 있습니다.

이 경우 Ref는 렌더링과 무관하게 유지해야 하는 데이터를 저장하는 용도로 사용됩니다.

### 4.1 Storing Timer IDs

타이머 ID를 Ref에 저장할 수 있습니다.

```tsx
import { useRef } from "react";

function Timer() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const startTimer = () => {
    if (timerRef.current !== null) {
      return;
    }

    timerRef.current = setInterval(() => {
      console.log("Tick");
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <>
      <button onClick={startTimer}>
        Start
      </button>

      <button onClick={stopTimer}>
        Stop
      </button>
    </>
  );
}
```

`ReturnType<typeof setInterval>`을 사용하면 현재 TypeScript 환경에서 `setInterval`이 반환하는 타입을 추론할 수 있습니다.

브라우저 환경에서는 일반적으로 숫자 타입이지만, Node.js 타입 정의가 함께 포함된 환경에서는 반환 타입이 다를 수 있으므로 `ReturnType`을 활용하면 환경에 따른 차이를 줄일 수 있습니다.

### 4.2 Storing Previous Values

이전 렌더링에서 사용한 값을 저장할 수도 있습니다.

```tsx
import { useEffect, useRef } from "react";

function PreviousValue({ value }: { value: number }) {
  const previousValueRef = useRef<number | null>(null);

  useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return (
    <div>
      Current: {value}
      Previous: {previousValueRef.current}
    </div>
  );
}
```

Effect에서 현재 값을 Ref에 저장하면 다음 렌더링에서 이전 값을 참조할 수 있습니다.

Ref의 변경 자체는 리렌더링을 발생시키지 않으므로, Ref 값을 화면에 반영해야 하는 경우에는 별도의 상태 관리가 필요할 수 있습니다.

### 4.3 useRef vs useState

`useRef`와 `useState`는 모두 렌더링 사이에 값을 유지할 수 있지만 동작 방식이 다릅니다.

| 구분 | useRef | useState |
|---|---|---|
| 값 유지 | 유지합니다. | 유지합니다. |
| 값 변경 | `current`를 직접 변경합니다. | Setter를 통해 변경합니다. |
| 변경 시 리렌더링 | 발생하지 않습니다. | 일반적으로 발생합니다. |
| 주 용도 | DOM 참조, 타이머 ID, 외부 객체 | 화면에 표시되는 상태 |
| 접근 방식 | `ref.current` | 상태 변수 |

화면에 표시되어야 하는 데이터라면 `useState`를 사용하고, 화면 렌더링과 무관하게 유지해야 하는 데이터라면 `useRef`를 사용하는 것이 적절합니다.

## 5. Ref as Component Props

Ref를 컴포넌트에 전달하면 부모 컴포넌트에서 자식 컴포넌트가 렌더링한 DOM 요소에 접근할 수 있습니다.

Ref를 Props로 정의하는 방식은 React 버전에 따라 달라집니다.

### 5.1 React 19: ref as a Prop

React 19에서는 함수형 컴포넌트가 `ref`를 일반적인 Props처럼 받을 수 있습니다.

```tsx
import type { Ref } from "react";

type InputProps = {
  ref?: Ref<HTMLInputElement>;
  placeholder?: string;
};

function CustomInput({
  ref,
  placeholder,
}: InputProps) {
  return (
    <input
      ref={ref}
      placeholder={placeholder}
    />
  );
}
```

부모 컴포넌트에서는 다음과 같이 사용할 수 있습니다.

```tsx
function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <CustomInput
        ref={inputRef}
        placeholder="Enter text"
      />

      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
    </>
  );
}
```

React 19에서는 `ref`가 일반 Props에 포함될 수 있으므로 `forwardRef`를 사용하지 않고도 Ref를 전달할 수 있습니다.

### 5.2 React 18 and Earlier: forwardRef

React 18 및 이전 버전에서는 일반적인 함수형 컴포넌트가 `ref`를 일반 Props처럼 전달받을 수 없었습니다.

이 경우 `forwardRef`를 사용해야 합니다.

```tsx
import { forwardRef } from "react";

type InputProps = {
  placeholder?: string;
};

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  function CustomInput({ placeholder }, ref) {
    return (
      <input
        ref={ref}
        placeholder={placeholder}
      />
    );
  }
);
```

`forwardRef`의 Generic은 다음 순서로 지정합니다.

```tsx
forwardRef<RefElementType, PropsType>(renderFunction)
```

- 첫 번째 Generic: Ref가 참조하는 요소의 타입
- 두 번째 Generic: 컴포넌트가 전달받는 Props 타입

부모 컴포넌트에서는 다음과 같이 사용할 수 있습니다.

```tsx
function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <CustomInput
        ref={inputRef}
        placeholder="Enter text"
      />

      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
    </>
  );
}
```

React 19에서는 `forwardRef`가 더 이상 필수적인 패턴이 아니며 향후 사용이 권장되지 않는 방향으로 변경되었습니다. 기존 React 18 이하 프로젝트에서는 여전히 필요한 패턴입니다.

## 6. Exposing Imperative Methods

부모 컴포넌트가 자식 컴포넌트의 DOM 요소 전체에 접근하는 대신, 제한된 기능만 호출하도록 설계할 수 있습니다.

이를 위해 `useImperativeHandle`을 사용합니다.

### 6.1 Typing Imperative Handle

먼저 부모에게 공개할 메서드의 타입을 정의합니다.

```tsx
type InputHandle = {
  focus: () => void;
  clear: () => void;
};
```

React 19에서는 `ref`를 Props로 전달받아 `useImperativeHandle`에 연결할 수 있습니다.

```tsx
import {
  useImperativeHandle,
  useRef,
} from "react";
import type { Ref } from "react";

type InputHandle = {
  focus: () => void;
  clear: () => void;
};

type CustomInputProps = {
  ref?: Ref<InputHandle>;
};

function CustomInput({ ref }: CustomInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },

    clear() {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  }));

  return <input ref={inputRef} />;
}
```

부모 컴포넌트는 실제 DOM 요소가 아니라 `InputHandle`에 정의된 메서드에 접근할 수 있습니다.

```tsx
function App() {
  const inputRef = useRef<InputHandle>(null);

  return (
    <>
      <CustomInput ref={inputRef} />

      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>

      <button onClick={() => inputRef.current?.clear()}>
        Clear
      </button>
    </>
  );
}
```

이 방식은 자식 컴포넌트의 내부 구현을 숨기고 외부에 필요한 기능만 공개할 수 있다는 장점이 있습니다.

### 6.2 React 18 and Earlier

React 18 및 이전 버전에서는 `forwardRef`를 사용하여 Ref를 전달해야 합니다.

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

type InputHandle = {
  focus: () => void;
  clear: () => void;
};

const CustomInput = forwardRef<InputHandle>(
  function CustomInput(_, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },

      clear() {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },
    }));

    return <input ref={inputRef} />;
  }
);
```

React 버전에 따라 Ref 전달 방식은 달라지지만 `useImperativeHandle`을 사용하여 공개할 메서드의 타입을 정의하는 방식은 동일합니다.

## 7. Callback Refs

Callback Ref는 DOM 요소가 연결되거나 해제될 때 실행되는 함수 형태의 Ref입니다.

Ref 객체를 사용하는 대신 콜백 함수를 전달하여 DOM 요소의 연결 시점을 직접 처리할 수 있습니다.

### 7.1 Basic Callback Ref

```tsx
function TextInput() {
  const inputRef = (node: HTMLInputElement | null) => {
    if (node) {
      node.focus();
    }
  };

  return <input ref={inputRef} />;
}
```

React는 DOM 요소가 연결되면 해당 요소를 전달하고, 연결이 해제되면 `null`을 전달합니다.

Callback Ref를 사용하면 DOM 요소가 연결되는 시점에 별도의 작업을 수행할 수 있습니다.

### 7.2 Explicit RefCallback Type

Callback Ref의 타입을 명시적으로 선언할 수도 있습니다.

```tsx
import type { RefCallback } from "react";

const inputRef: RefCallback<HTMLInputElement> = (node) => {
  if (node) {
    node.focus();
  }
};
```

이렇게 하면 콜백이 전달받는 DOM 요소의 타입을 명확하게 지정할 수 있습니다.

### 7.3 React 19 Cleanup Function

React 19에서는 Callback Ref가 정리 함수를 반환할 수 있습니다.

```tsx
import type { RefCallback } from "react";

const inputRef: RefCallback<HTMLInputElement> = (node) => {
  if (!node) {
    return;
  }

  const handleFocus = () => {
    console.log("Focused");
  };

  node.addEventListener("focus", handleFocus);

  return () => {
    node.removeEventListener("focus", handleFocus);
  };
};
```

DOM 요소가 연결되면 이벤트 리스너를 등록하고, Ref가 정리될 때 반환된 정리 함수가 실행됩니다.

React 19의 Callback Ref는 이처럼 연결과 해제에 필요한 로직을 하나의 함수에서 관리할 수 있습니다.

## 8. Ref Composition

여러 Ref를 하나의 DOM 요소에 연결해야 하는 상황이 있습니다.

예를 들어 컴포넌트 내부에서 관리하는 Ref와 외부에서 전달받은 Ref를 동시에 연결해야 할 수 있습니다.

이러한 작업을 Ref Composition이라고 합니다.

### 8.1 Ref Object Composition

React 19에서는 Ref 객체를 직접 갱신하는 방식으로 여러 Ref를 연결할 수 있습니다.

```tsx
import { useCallback, useRef } from "react";
import type { Ref } from "react";

function assignRef<T>(
  ref: Ref<T> | undefined,
  value: T | null
) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}
```

다만 이와 같은 단순 구현은 Callback Ref가 반환하는 정리 함수를 처리하지 않습니다.

React 19의 Callback Ref 정리 동작까지 고려해야 하는 라이브러리나 공통 유틸리티에서는 Ref 연결 및 해제 로직을 별도로 설계해야 합니다.

Ref Composition은 React 버전별 Callback Ref 동작 차이와 타입 정의를 고려해야 하므로, 직접 구현하기보다 검증된 유틸리티를 사용하는 방법도 고려할 수 있습니다.

## 9. Ref and React 19

React 19에서는 Ref 관련 API와 타입 정의에 중요한 변화가 있습니다.

### 9.1 ref as a Regular Prop

React 18까지는 함수형 컴포넌트에 Ref를 전달하려면 일반적으로 `forwardRef`를 사용해야 했습니다.

React 19에서는 `ref`를 일반 Props처럼 전달받을 수 있습니다.

```tsx
import type { Ref } from "react";

type InputProps = {
  ref?: Ref<HTMLInputElement>;
};

function CustomInput({ ref }: InputProps) {
  return <input ref={ref} />;
}
```

이 변경으로 새로운 함수형 컴포넌트에서는 `forwardRef`를 사용하지 않고도 Ref 전달이 가능합니다.

### 9.2 forwardRef Deprecation

React 19에서는 `forwardRef`가 더 이상 필수적이지 않으며 향후 제거될 예정인 API로 안내되고 있습니다.

기존 프로젝트와 라이브러리에서는 호환성을 고려하여 기존 패턴을 유지할 수 있지만, React 19를 대상으로 새로운 컴포넌트를 작성할 때는 `ref`를 Props로 받는 방식을 우선적으로 고려할 수 있습니다.

### 9.3 Ref Callback Cleanup

React 19에서는 Callback Ref가 정리 함수를 반환하는 패턴을 지원합니다.

이를 활용하면 DOM 요소가 연결될 때 등록한 이벤트 리스너나 외부 리소스를 해제하는 로직을 명확하게 구성할 수 있습니다.

### 9.4 Type Definition Differences

React 버전에 따라 Ref 관련 타입 정의가 변경되었으므로 다음 사항을 고려해야 합니다.

- `RefObject<T>`의 `current` 타입
- `useRef`의 초기값 전달 방식
- `MutableRefObject` 사용 여부
- Callback Ref의 반환 타입
- 함수형 컴포넌트에서 `ref`를 Props로 받는 방식

특히 React 런타임 버전과 `@types/react` 버전이 일치하지 않으면 예상하지 못한 타입 오류가 발생할 수 있습니다.

## 10. Common Type Errors

Ref를 사용할 때 자주 발생하는 타입 오류와 해결 방법을 정리합니다.

### 10.1 Property Does Not Exist on Type null

```tsx
const inputRef = useRef<HTMLInputElement>(null);

inputRef.current.focus();
```

`current`가 `null`일 수 있으므로 위 코드는 TypeScript에서 오류가 발생합니다.

Null 검사를 추가해야 합니다.

```tsx
if (inputRef.current) {
  inputRef.current.focus();
}
```

또는 Optional Chaining을 사용할 수 있습니다.

```tsx
inputRef.current?.focus();
```

### 10.2 Incorrect DOM Element Type

```tsx
const inputRef = useRef<HTMLDivElement>(null);

return <input ref={inputRef} />;
```

`input` 요소는 `HTMLInputElement` 타입이지만 Ref는 `HTMLDivElement` 타입으로 선언되어 있으므로 타입이 일치하지 않습니다.

다음과 같이 수정해야 합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

return <input ref={inputRef} />;
```

### 10.3 Ref Type Mismatch

컴포넌트가 전달받는 Ref 타입과 실제 참조 대상의 타입이 일치하지 않으면 오류가 발생합니다.

```tsx
type InputProps = {
  ref?: React.Ref<HTMLButtonElement>;
};

function CustomInput({ ref }: InputProps) {
  return <input ref={ref} />;
}
```

`HTMLButtonElement`를 참조하는 Ref를 `input` 요소에 연결할 수 없습니다.

Ref의 타입을 실제 DOM 요소에 맞게 지정해야 합니다.

```tsx
type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
};
```

### 10.4 Ref Used for Rendering

```tsx
const countRef = useRef(0);

function increment() {
  countRef.current += 1;
}
```

위 코드는 Ref 값을 변경하지만 컴포넌트를 다시 렌더링하지 않습니다.

변경된 값을 화면에 즉시 반영해야 한다면 `useState`를 사용해야 합니다.

```tsx
const [count, setCount] = useState(0);

function increment() {
  setCount((prev) => prev + 1);
}
```

## 11. Best Practices

Ref를 TypeScript와 함께 사용할 때는 다음 사항을 고려하는 것이 좋습니다.

### 11.1 구체적인 DOM 타입을 사용합니다.

가능하면 `HTMLElement`나 `Element`와 같은 상위 타입보다 `HTMLInputElement`, `HTMLButtonElement` 등 실제 요소에 맞는 타입을 사용하는 것이 좋습니다.

### 11.2 Ref 초기값과 Null 가능성을 명확하게 표현합니다.

DOM 요소는 초기 렌더링 시점에 연결되지 않을 수 있으므로 일반적으로 `useRef<HTMLInputElement>(null)`과 같이 선언합니다.

### 11.3 Non-null Assertion을 남용하지 않습니다.

`ref.current!`는 컴파일 단계의 Null 검사를 우회합니다.

실제 Ref 연결 여부가 보장되지 않는 상황에서는 Null 검사를 수행하는 것이 안전합니다.

### 11.4 State와 Ref의 역할을 구분합니다.

렌더링 결과에 영향을 주는 값은 State로 관리하고, 렌더링과 무관하게 유지해야 하는 값은 Ref로 관리합니다.

### 11.5 필요한 기능만 외부에 공개합니다.

부모 컴포넌트가 자식 컴포넌트의 전체 DOM 구조에 접근할 필요가 없다면 `useImperativeHandle`을 활용하여 필요한 메서드만 공개하는 것이 좋습니다.

### 11.6 React 버전에 맞는 Ref 패턴을 사용합니다.

React 18 이하에서는 `forwardRef`가 일반적인 Ref 전달 방식이며, React 19에서는 `ref`를 일반 Props로 전달할 수 있습니다.

프로젝트의 React 버전과 타입 정의를 함께 확인해야 합니다.

### 11.7 Render 중 Ref 변경을 피합니다.

일반적인 Ref 값은 이벤트 핸들러나 Effect 등 렌더링 외부의 적절한 시점에서 변경해야 합니다.

렌더링 과정에서 Ref를 임의로 읽거나 변경하면 예측하기 어려운 동작이 발생할 수 있습니다. 단, React에서 허용하는 초기화 패턴과 같은 예외적인 경우는 별도로 고려해야 합니다.

## 12. Summary

React Ref는 DOM 요소와 렌더링에 영향을 주지 않는 값을 참조하기 위한 기능입니다.

TypeScript에서는 Ref의 대상 타입을 명시하여 DOM API 접근과 컴포넌트 간 Ref 전달을 안전하게 처리할 수 있습니다.

| 개념 | 주요 역할 |
|---|---|
| `useRef` | Ref 객체 생성 |
| `RefObject<T>` | Ref 객체의 타입 표현 |
| `Ref<T>` | Ref 객체, Callback Ref 및 null을 포함하는 Ref 타입 |
| `RefCallback<T>` | DOM 연결 및 해제 시 실행되는 콜백 타입 |
| `forwardRef` | React 18 이하에서 컴포넌트에 Ref 전달 |
| `useImperativeHandle` | 부모에게 공개할 Ref 인터페이스 정의 |
| Callback Ref | DOM 요소 연결 및 해제 시점의 작업 처리 |
| Ref Composition | 여러 Ref를 하나의 요소에 연결 |

Ref를 사용할 때는 참조 대상의 타입을 정확하게 지정하고 Null 가능성을 고려해야 합니다.

또한 화면에 반영되어야 하는 상태와 렌더링에 영향을 주지 않는 참조 값을 구분해야 합니다.

React 19에서는 `ref`를 일반 Props로 전달할 수 있도록 변경되었으므로 기존 `forwardRef` 기반 코드와의 차이를 이해하고 프로젝트 버전에 맞는 방식을 선택해야 합니다.

## 13. References

- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
  - Ref 객체 생성과 DOM 요소 참조, 렌더링과 무관한 값 관리 방법을 설명합니다.
- [React 공식 문서 - forwardRef](https://react.dev/reference/react/forwardRef)
  - React 18 이하에서 컴포넌트 간 Ref를 전달하는 방법과 React 19의 변경 사항을 설명합니다.
- [React 공식 문서 - useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)
  - 부모 컴포넌트에 공개할 명령형 메서드와 Ref 인터페이스를 정의하는 방법을 설명합니다.
- [React 공식 문서 - Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
  - Ref를 이용한 DOM 접근과 조작 방법을 설명합니다.
- [React 공식 문서 - Passing a ref to a DOM node](https://react.dev/learn/manipulating-the-dom-with-refs#accessing-another-components-dom-nodes)
  - 컴포넌트 간 Ref 전달과 DOM 노드 접근에 대해 설명합니다.
- [React 공식 문서 - Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
  - State와 Ref의 차이 및 Ref를 통한 값 유지 방법을 설명합니다.
- [React 공식 문서 - React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
  - React 19의 Ref 관련 변경 사항과 업그레이드 시 고려사항을 설명합니다.
- [React TypeScript Cheatsheet - Ref](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forward_and_create_ref/)
  - TypeScript 환경에서 Ref, `forwardRef`, DOM Ref 타입을 사용하는 패턴을 설명합니다.
- [DefinitelyTyped - React Type Definitions](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react)
  - `RefObject`, `Ref`, `RefCallback`, `useRef` 등의 실제 타입 정의를 확인할 수 있습니다.