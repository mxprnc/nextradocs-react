

# useImperativeHandle

## 1. useImperativeHandle이란?

`useImperativeHandle`은 부모 컴포넌트에 전달되는 ref의 값을 사용자 정의 값으로 설정하는 React Hook입니다.

일반적으로 부모 컴포넌트가 자식 컴포넌트의 DOM 요소에 접근하려면 자식 컴포넌트에서 전달받은 ref를 DOM 요소에 연결해야 합니다.

```tsx
import { useRef } from 'react';

function Child() {
  return <input />;
}

function Parent() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <Child ref={inputRef} />;
}
```

그러나 자식 컴포넌트가 내부 DOM 요소를 그대로 노출하면 부모 컴포넌트가 자식의 구현 세부 사항에 직접 의존하게 됩니다.

`useImperativeHandle`을 사용하면 부모에게 필요한 기능만 노출할 수 있습니다.

예를 들어 부모 컴포넌트가 자식의 내부 `input` 요소에 직접 접근하지 않고도 포커스 설정이나 입력값 초기화 기능을 호출하도록 구성할 수 있습니다.

기본 문법은 다음과 같습니다.

```tsx
useImperativeHandle(ref, createHandle, dependencies?)
```

- `ref`: 부모로부터 전달받은 ref입니다.
- `createHandle`: 부모에게 노출할 객체 또는 값을 반환하는 함수입니다.
- `dependencies`: `createHandle`에서 참조하는 반응형 값들의 의존성 배열입니다.

`createHandle`이 반환하는 객체가 부모 컴포넌트에서 접근할 수 있는 ref의 값이 됩니다.

## 2. 기본 사용법

다음은 자식 컴포넌트가 부모에게 `focus` 메서드만 노출하는 예제입니다.

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

type InputHandle = {
  focus: () => void;
};

const CustomInput = forwardRef<InputHandle>(
  function CustomInput(_, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
    }));

    return <input ref={inputRef} />;
  },
);

function Parent() {
  const inputRef = useRef<InputHandle>(null);

  return (
    <div>
      <CustomInput ref={inputRef} />

      <button onClick={() => inputRef.current?.focus()}>
        입력창에 포커스
      </button>
    </div>
  );
}
```

위 예제의 동작 구조는 다음과 같습니다.

1. 부모 컴포넌트가 `useRef`를 사용하여 ref를 생성합니다.
2. 부모가 해당 ref를 `CustomInput`에 전달합니다.
3. 자식 컴포넌트는 내부 DOM 요소를 별도의 `inputRef`로 관리합니다.
4. `useImperativeHandle`을 통해 부모의 ref에 `focus` 메서드를 노출합니다.
5. 부모는 `inputRef.current.focus()`를 호출하여 자식의 입력 요소에 포커스를 설정합니다.

부모 컴포넌트는 자식의 실제 DOM 구조를 알 필요가 없습니다.

자식 컴포넌트가 내부적으로 `<input>`을 사용하든 다른 요소를 사용하든, 외부에 노출한 `focus` 인터페이스만 유지하면 됩니다.

## 3. 부모에게 여러 메서드 노출하기

`useImperativeHandle`은 하나의 메서드뿐만 아니라 여러 메서드와 속성을 가진 객체를 노출할 수 있습니다.

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

type InputHandle = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
};

const CustomInput = forwardRef<InputHandle>(
  function CustomInput(_, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },

      blur() {
        inputRef.current?.blur();
      },

      clear() {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      },
    }));

    return <input ref={inputRef} />;
  },
);

function Parent() {
  const inputRef = useRef<InputHandle>(null);

  return (
    <div>
      <CustomInput ref={inputRef} />

      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>

      <button onClick={() => inputRef.current?.blur()}>
        Blur
      </button>

      <button onClick={() => inputRef.current?.clear()}>
        Clear
      </button>
    </div>
  );
}
```

부모 컴포넌트는 `InputHandle`에 정의된 메서드만 사용할 수 있습니다.

내부 DOM 요소에 직접 접근하는 대신 자식 컴포넌트가 제공하는 기능을 호출하는 구조입니다.

이러한 방식은 컴포넌트의 캡슐화를 유지하는 데 도움이 됩니다.

## 4. forwardRef와의 관계

`useImperativeHandle`을 사용하려면 부모로부터 전달받은 ref에 접근할 수 있어야 합니다.

React 18 이하에서는 함수 컴포넌트가 기본적으로 `ref`를 일반 Props처럼 전달받지 못했기 때문에 `forwardRef`를 사용해야 했습니다.

```tsx
const CustomInput = forwardRef<InputHandle, Props>(
  function CustomInput(props, ref) {
    // ref를 사용할 수 있습니다.
  },
);
```

`forwardRef`는 부모가 전달한 ref를 자식 컴포넌트의 두 번째 인자로 전달하는 역할을 합니다.

React 19에서는 함수 컴포넌트가 `ref`를 일반 Props처럼 전달받을 수 있도록 변경되었습니다.

따라서 React 19에서는 `forwardRef` 없이 `ref`를 직접 전달받을 수 있습니다.

```tsx
import {
  useImperativeHandle,
  useRef,
} from 'react';

type InputHandle = {
  focus: () => void;
};

type CustomInputProps = {
  ref?: React.Ref<InputHandle>;
};

function CustomInput({ ref }: CustomInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current?.focus();
    },
  }));

  return <input ref={inputRef} />;
}
```

React 19에서는 `ref`가 Props로 전달되므로 별도의 `forwardRef` 래퍼가 필요하지 않습니다.

다만 React 18 이하와의 호환성이 필요하다면 `forwardRef`를 사용하는 기존 패턴을 유지해야 합니다.

React 공식 문서에서는 `forwardRef`가 React 19부터 더 이상 필수적이지 않으며, 향후 제거될 예정이라고 안내합니다.

## 5. dependencies 배열

`useImperativeHandle`의 세 번째 인자인 `dependencies`는 `createHandle` 함수가 참조하는 반응형 값들의 목록입니다.

```tsx
useImperativeHandle(
  ref,
  () => ({
    focus() {
      inputRef.current?.focus();
    },
  }),
  [],
);
```

React는 이전 렌더링의 의존성 값과 새로운 의존성 값을 `Object.is`로 비교합니다.

의존성 중 하나라도 변경되면 `createHandle`을 다시 실행하여 새로운 ref 값을 생성합니다.

### 5.1. 의존성 배열을 생략하는 경우

의존성 배열을 생략하면 컴포넌트가 렌더링될 때마다 `createHandle`이 다시 실행됩니다.

```tsx
useImperativeHandle(ref, () => ({
  focus() {
    inputRef.current?.focus();
  },
}));
```

### 5.2. 빈 의존성 배열을 사용하는 경우

빈 배열을 전달하면 컴포넌트의 초기 렌더링 이후 의존성 변경으로 인한 핸들 재생성이 발생하지 않습니다.

```tsx
useImperativeHandle(
  ref,
  () => ({
    focus() {
      inputRef.current?.focus();
    },
  }),
  [],
);
```

다만 `createHandle` 내부에서 참조하는 반응형 값이 있다면 해당 값을 의존성에 포함해야 합니다.

### 5.3. 반응형 값을 사용하는 경우

다음 예제에서는 `value`를 기반으로 입력값을 초기화하는 메서드를 제공합니다.

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

type InputHandle = {
  reset: () => void;
};

type Props = {
  initialValue: string;
};

const CustomInput = forwardRef<InputHandle, Props>(
  function CustomInput({ initialValue }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        reset() {
          if (inputRef.current) {
            inputRef.current.value = initialValue;
          }
        },
      }),
      [initialValue],
    );

    return (
      <input
        ref={inputRef}
        defaultValue={initialValue}
      />
    );
  },
);
```

`initialValue`가 변경되면 새로운 핸들이 생성되며, 해당 메서드는 최신 `initialValue`를 참조합니다.

의존성 배열에는 `createHandle` 내부에서 사용하는 모든 반응형 값을 포함해야 합니다.

## 6. useImperativeHandle과 ref의 동작 방식

`useImperativeHandle`은 부모로부터 전달받은 ref의 `current` 값을 사용자 정의 핸들로 설정합니다.

일반적인 `useRef`와 비교하면 다음과 같습니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

일반적인 DOM ref에서는 `inputRef.current`가 실제 DOM 요소를 가리킵니다.

반면 `useImperativeHandle`을 사용하면 다음과 같이 동작합니다.

```tsx
useImperativeHandle(ref, () => ({
  focus() {
    inputRef.current?.focus();
  },
}));
```

부모 컴포넌트에서 접근하는 `ref.current`는 실제 DOM 요소가 아니라 `focus` 메서드를 포함한 사용자 정의 객체입니다.

즉, 내부 DOM ref와 외부에 노출되는 ref의 역할을 분리할 수 있습니다.

```text
Parent
  |
  | ref
  v
CustomInput
  |
  +-- 외부 ref
  |     |
  |     v
  |   { focus(), blur(), clear() }
  |
  +-- 내부 inputRef
        |
        v
      <input>
```

이러한 구조를 통해 자식 컴포넌트는 내부 DOM 요소를 캡슐화하면서 필요한 기능만 외부에 공개할 수 있습니다.

## 7. useImperativeHandle 활용 사례

### 7.1. 입력 컴포넌트 제어

입력 컴포넌트가 포커스, 초기화, 선택 등의 기능을 제공해야 하는 경우 활용할 수 있습니다.

```tsx
type InputHandle = {
  focus: () => void;
  clear: () => void;
  select: () => void;
};
```

부모는 내부 DOM 구조에 접근하지 않고도 필요한 동작을 호출할 수 있습니다.

### 7.2. Modal 또는 Dialog 제어

부모 컴포넌트에서 Modal의 열기 및 닫기 기능을 명령형으로 호출할 수 있습니다.

```tsx
import {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

type ModalHandle = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef<ModalHandle>(
  function Modal(_, ref) {
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      open() {
        setIsOpen(true);
      },

      close() {
        setIsOpen(false);
      },
    }));

    if (!isOpen) {
      return null;
    }

    return (
      <div role="dialog" aria-modal="true">
        <p>Modal Content</p>

        <button onClick={() => setIsOpen(false)}>
          Close
        </button>
      </div>
    );
  },
);

function Parent() {
  const modalRef = useRef<ModalHandle>(null);

  return (
    <div>
      <button onClick={() => modalRef.current?.open()}>
        Open Modal
      </button>

      <Modal ref={modalRef} />
    </div>
  );
}
```

위 예제에서는 부모가 `open()`과 `close()`를 호출하여 Modal의 동작을 제어합니다.

실제 Modal 구현에서는 포커스 이동 및 복원, 키보드 접근성, 배경 스크롤 제어 등도 함께 고려해야 합니다.

### 7.3. 복합 UI 컴포넌트 제어

다음과 같은 컴포넌트에서도 명령형 인터페이스를 제공할 수 있습니다.

- Carousel: 특정 슬라이드로 이동
- Video Player: 재생, 일시 정지, 현재 위치 변경
- Rich Text Editor: 커서 이동, 텍스트 삽입
- Canvas: 특정 영역 초기화, 그리기 명령 실행
- Form: 특정 입력 요소에 포커스 설정

이러한 기능은 부모 컴포넌트가 자식 컴포넌트의 내부 구현을 알 필요 없이 제한된 인터페이스를 통해 제어할 수 있도록 합니다.

## 8. useImperativeHandle과 선언적 상태 관리

React에서는 가능한 한 UI 상태를 Props와 State로 표현하는 선언적 방식을 권장합니다.

`useImperativeHandle`은 부모가 자식 컴포넌트에 특정 동작을 직접 요청하는 명령형 방식입니다.

두 방식은 목적에 따라 구분하여 사용해야 합니다.

### 8.1. 선언적 방식

Modal의 열림 상태를 부모가 관리하는 경우입니다.

```tsx
function Parent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

function Modal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div role="dialog">
      <p>Modal Content</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

부모가 `isOpen`이라는 상태를 관리하고 자식에게 Props로 전달합니다.

상태가 변경되면 React가 UI를 선언적으로 갱신합니다.

### 8.2. 명령형 방식

`useImperativeHandle`을 사용하면 부모가 자식에게 직접 명령을 전달할 수 있습니다.

```tsx
modalRef.current?.open();
```

이 방식은 포커스 이동, 스크롤, 미디어 재생 등 특정 시점에 명령을 실행해야 하는 작업에 적합합니다.

### 8.3. 선택 기준

| 구분 | 선언적 상태 관리 | useImperativeHandle |
|---|---|---|
| 제어 방식 | Props 및 State | Ref를 통한 메서드 호출 |
| 주요 목적 | UI 상태 표현 | 특정 동작 명령 |
| 상태 동기화 | React 렌더링 흐름에 포함 | 별도의 명령형 인터페이스 |
| 적합한 사례 | Modal 표시 여부, 탭 선택, 메뉴 상태 | 포커스, 스크롤, 재생, 초기화 |
| 권장 방향 | 일반적인 UI 제어에 우선 사용 | 선언적으로 표현하기 어려운 동작에 제한적으로 사용 |

단순히 Modal을 열고 닫는 상태를 관리하기 위해 반드시 `useImperativeHandle`을 사용할 필요는 없습니다.

가능하다면 Props와 State를 사용하고, 선언적 상태 관리만으로 표현하기 어려운 명령형 동작에 활용하는 것이 좋습니다.

## 9. 주의사항

### 9.1. Hook 호출 규칙을 준수해야 합니다.

`useImperativeHandle`은 React Hook이므로 컴포넌트 또는 Custom Hook의 최상위에서 호출해야 합니다.

조건문, 반복문, 중첩 함수 내부에서 호출해서는 안 됩니다.

### 9.2. createHandle은 렌더링 중 실행됩니다.

`createHandle`은 React가 렌더링 과정에서 실행하는 함수입니다.

따라서 해당 함수 내부에서 외부 시스템을 변경하거나 부수 효과를 실행해서는 안 됩니다.

다음과 같이 핸들에 메서드를 정의하고, 실제 동작은 메서드가 호출될 때 수행하도록 구성해야 합니다.

```tsx
useImperativeHandle(ref, () => ({
  focus() {
    inputRef.current?.focus();
  },
}));
```

### 9.3. 필요한 기능만 노출해야 합니다.

자식 컴포넌트의 내부 DOM 전체를 외부에 노출하기보다는 부모에게 필요한 최소한의 메서드만 공개하는 것이 좋습니다.

예를 들어 부모가 포커스 기능만 필요하다면 `focus()`만 제공하는 것이 적절합니다.

이렇게 하면 자식 컴포넌트의 내부 구현을 변경하더라도 외부 API를 유지하기 쉬워집니다.

### 9.4. 반환 객체의 참조 변경을 고려해야 합니다.

`createHandle`이 다시 실행되면 새로운 핸들 객체가 생성됩니다.

따라서 의존성 배열을 적절하게 지정하여 불필요한 핸들 재생성을 방지해야 합니다.

다만 의존성 배열을 무조건 빈 배열로 설정해서는 안 됩니다. 최신 Props나 State를 참조해야 하는 경우 해당 값을 의존성에 포함해야 합니다.

### 9.5. Ref는 커밋 단계에서 연결됩니다.

`useImperativeHandle`은 React가 컴포넌트의 렌더링 결과를 커밋하는 과정에서 ref에 핸들을 연결합니다.

따라서 렌더링 중에 부모가 해당 ref의 최신 핸들에 접근할 수 있다고 가정해서는 안 됩니다.

Ref를 통해 제공하는 메서드는 일반적으로 이벤트 핸들러나 Effect에서 호출하도록 구성합니다.

### 9.6. Ref 접근 가능성을 고려해야 합니다.

부모 컴포넌트가 자식의 메서드를 호출하는 시점에 자식 컴포넌트가 마운트되어 있지 않을 수 있습니다.

따라서 다음과 같이 null 가능성을 고려해야 합니다.

```tsx
ref.current?.focus();
```

TypeScript에서도 ref의 초기값을 `null`로 지정하고 호출 시점의 접근 가능성을 고려하는 것이 일반적입니다.

## 10. 정리

`useImperativeHandle`은 부모 컴포넌트에 노출되는 ref의 값을 사용자 정의 인터페이스로 구성하는 React Hook입니다.

주요 특징은 다음과 같습니다.

- 부모로부터 전달받은 ref에 사용자 정의 객체를 연결합니다.
- 자식 컴포넌트의 내부 DOM 구조를 직접 노출하지 않고 필요한 기능만 공개할 수 있습니다.
- `forwardRef`와 함께 사용하여 부모의 ref를 전달받을 수 있습니다.
- React 19에서는 `ref`를 Props로 직접 전달할 수 있으므로 `forwardRef`가 필수가 아닙니다.
- 의존성 배열을 통해 핸들 객체의 재생성 시점을 제어할 수 있습니다.
- 포커스, 스크롤, 미디어 제어 등 명령형 동작을 제공하는 데 적합합니다.
- 일반적인 UI 상태 관리는 Props와 State를 사용하는 선언적 방식을 우선하는 것이 좋습니다.

`useImperativeHandle`은 컴포넌트의 캡슐화를 유지하면서 외부에 제한된 명령형 인터페이스를 제공해야 할 때 유용합니다.

다만 모든 자식 컴포넌트의 상태를 ref로 제어하는 방식은 피해야 합니다. React의 선언적 렌더링 모델을 우선하고, 명령형 제어가 필요한 경우에 한정하여 사용하는 것이 좋습니다.

## 참고 자료

- [React 공식 문서 - useImperativeHandle](https://react.dev/reference/react/useImperativeHandle)
- [React 공식 문서 - forwardRef](https://react.dev/reference/react/forwardRef)
- [React 공식 문서 - useRef](https://react.dev/reference/react/useRef)
- [React 공식 문서 - Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
- [React 공식 문서 - Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React 공식 문서 - Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)

