# useRef

## 1. useRef란?

`useRef`는 렌더링에 영향을 주지 않는 값을 컴포넌트의 여러 렌더링에 걸쳐 유지할 수 있도록 하는 Hook입니다.

React 컴포넌트에서는 일반적으로 `useState`를 사용하여 상태를 관리합니다. State가 변경되면 React는 컴포넌트를 다시 렌더링하여 변경된 값을 UI에 반영합니다.

반면 `useRef`는 값을 저장하고 변경할 수 있지만, Ref의 값이 변경되어도 컴포넌트를 다시 렌더링하지 않습니다.

```tsx
const ref = useRef(initialValue);
```

`useRef`는 다음과 같은 상황에서 활용할 수 있습니다.

- DOM 요소에 직접 접근하는 경우
- Input 요소에 포커스를 설정하는 경우
- 타이머 ID나 인터벌 ID를 저장하는 경우
- 이전 렌더링의 값을 보관하는 경우
- 렌더링과 무관한 외부 객체를 유지하는 경우
- 컴포넌트 내부에서 변경 가능한 값을 보관하는 경우

`useRef`는 UI를 갱신하기 위한 상태 관리 도구가 아니라, 렌더링과 독립적으로 유지해야 하는 값을 보관하는 도구입니다.

## 2. 기본 문법

`useRef`는 초기값을 인자로 전달받아 Ref 객체를 반환합니다.

```tsx
const ref = useRef(initialValue);
```

반환되는 Ref 객체는 다음과 같은 구조를 가집니다.

```tsx
{
  current: initialValue
}
```

`current` 속성을 통해 저장된 값을 읽거나 변경할 수 있습니다.

```tsx
import { useRef } from 'react';

function Counter() {
  const countRef = useRef(0);

  function handleClick() {
    countRef.current += 1;

    console.log(countRef.current);
  }

  return (
    <button onClick={handleClick}>
      증가
    </button>
  );
}
```

버튼을 클릭하면 `countRef.current`가 증가하지만 컴포넌트는 다시 렌더링되지 않습니다.

따라서 Ref의 변경 사항은 자동으로 UI에 반영되지 않습니다.

## 3. useRef와 useState 비교

`useRef`와 `useState`는 모두 컴포넌트가 다시 렌더링되어도 값을 유지할 수 있지만, 값의 변경에 대한 동작이 다릅니다.

| 구분 | useRef | useState |
| --- | --- | --- |
| 값 저장 | 가능 | 가능 |
| 값 변경 | `ref.current` 직접 변경 | State Setter 사용 |
| 변경 시 재렌더링 | 발생하지 않음 | 발생함 |
| 주 용도 | 렌더링과 무관한 값 보관 | UI에 반영되는 상태 관리 |
| 반환값 | Ref 객체 | State와 Setter 함수 |

### 3.1. useState를 사용하는 경우

화면에 표시되는 카운터처럼 값이 변경될 때 UI도 갱신되어야 한다면 `useState`를 사용합니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

`setCount`를 호출하면 State가 변경되고 컴포넌트가 다시 렌더링됩니다.

### 3.2. useRef를 사용하는 경우

렌더링과 관계없이 값을 보관해야 한다면 `useRef`를 사용합니다.

```tsx
function Counter() {
  const countRef = useRef(0);

  function handleClick() {
    countRef.current += 1;

    console.log(countRef.current);
  }

  return (
    <button onClick={handleClick}>
      카운터 증가
    </button>
  );
}
```

`countRef.current`가 변경되어도 컴포넌트는 다시 렌더링되지 않습니다.

### 3.3. 선택 기준

다음 기준으로 두 Hook을 구분할 수 있습니다.

- 값이 변경되었을 때 화면을 갱신해야 한다면 `useState`를 사용합니다.
- 값이 변경되어도 화면을 갱신할 필요가 없다면 `useRef`를 사용합니다.

Ref에 저장한 값을 JSX에서 직접 사용하여 UI를 갱신하려는 방식은 적절하지 않습니다.

## 4. DOM 요소에 접근하기

`useRef`의 대표적인 사용 사례는 DOM 요소에 직접 접근하는 것입니다.

React에서는 일반적으로 선언적인 방식으로 UI를 관리하지만, 포커스 설정이나 스크롤 위치 조정처럼 DOM API를 직접 호출해야 하는 경우가 있습니다.

이때 Ref를 사용하면 특정 DOM 요소에 접근할 수 있습니다.

### 4.1. DOM 요소 연결

Ref 객체를 JSX 요소의 `ref` 속성에 전달하면 React가 해당 DOM 요소를 `ref.current`에 연결합니다.

```tsx
import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input ref={inputRef} type="text" />
  );
}
```

DOM 요소가 생성되고 연결되면 `inputRef.current`를 통해 해당 요소에 접근할 수 있습니다.

DOM 요소가 연결되기 전이거나 요소가 제거된 이후에는 `current`가 `null`일 수 있습니다.

### 4.2. Input 포커스 설정

DOM Ref를 활용하면 특정 Input 요소에 포커스를 설정할 수 있습니다.

```tsx
function TextInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFocus() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} type="text" />

      <button onClick={handleFocus}>
        포커스
      </button>
    </>
  );
}
```

`inputRef.current`에 연결된 DOM 요소의 `focus()` 메서드를 호출합니다.

Optional Chaining(`?.`)을 사용하면 Ref가 `null`인 경우에도 오류 없이 처리할 수 있습니다.

### 4.3. DOM 요소의 스크롤 위치 조정

Ref를 사용하여 특정 DOM 요소를 화면에 표시할 수도 있습니다.

```tsx
function MessageList() {
  const bottomRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <>
      <div className="messages">
        <p>메시지 1</p>
        <p>메시지 2</p>
        <div ref={bottomRef} />
      </div>

      <button onClick={scrollToBottom}>
        마지막 메시지로 이동
      </button>
    </>
  );
}
```

`scrollIntoView()`를 사용하면 Ref가 연결된 요소가 화면에 표시되도록 스크롤할 수 있습니다.

### 4.4. DOM 요소의 속성 변경

Ref를 사용하면 DOM API를 통해 특정 요소의 속성이나 스타일을 직접 변경할 수도 있습니다.

```tsx
function Highlight() {
  const elementRef = useRef<HTMLDivElement>(null);

  function handleClick() {
    const element = elementRef.current;

    if (element) {
      element.style.backgroundColor = 'yellow';
    }
  }

  return (
    <>
      <div ref={elementRef}>
        Highlight 대상
      </div>

      <button onClick={handleClick}>
        강조
      </button>
    </>
  );
}
```

다만 React가 관리하는 DOM을 직접 변경하면 React가 예상하는 UI와 실제 DOM 상태가 달라질 수 있습니다.

포커스, 스크롤, 크기 측정 등 DOM API 사용이 필요한 경우에 우선 활용하고, 일반적인 스타일이나 콘텐츠 변경은 Props와 State를 통한 선언적 렌더링을 사용하는 것이 좋습니다.

## 5. Ref의 생명주기

Ref 객체는 컴포넌트가 마운트될 때 생성되고, 해당 컴포넌트의 여러 렌더링에 걸쳐 동일한 객체가 유지됩니다.

```tsx
function Example() {
  const ref = useRef(0);

  console.log(ref);

  return <div>Example</div>;
}
```

컴포넌트가 다시 렌더링되어도 동일한 Ref 객체를 참조합니다.

반면 컴포넌트가 언마운트되면 해당 Ref 객체는 더 이상 컴포넌트에서 사용되지 않습니다.

### 5.1. DOM Ref의 연결과 해제

DOM 요소에 Ref를 연결하면 React가 `ref.current`에 해당 DOM 노드를 할당합니다.

```tsx
function Example() {
  const divRef = useRef<HTMLDivElement>(null);

  return <div ref={divRef}>Hello</div>;
}
```

일반적인 연결 과정은 다음과 같습니다.

1. 컴포넌트가 렌더링됩니다.
2. React가 DOM 요소를 생성하고 Commit Phase에서 Ref를 연결합니다.
3. `divRef.current`에 해당 DOM 노드가 할당됩니다.
4. 컴포넌트가 제거되면 Ref 연결이 해제됩니다.

DOM 요소가 제거되면 React는 해당 Ref의 `current`를 `null`로 설정합니다.

따라서 DOM Ref를 사용하는 경우 요소가 아직 연결되지 않았거나 이미 제거되었을 가능성을 고려해야 합니다.

## 6. 렌더링과 무관한 값 저장

`useRef`는 DOM 접근 외에도 컴포넌트 내부에서 유지해야 하는 다양한 값을 저장하는 데 사용할 수 있습니다.

### 6.1. 타이머 ID 저장

타이머 ID는 화면에 표시할 필요가 없지만, 타이머를 취소하기 위해 유지해야 하는 값입니다.

이러한 값은 Ref에 저장하기 적합합니다.

```tsx
function Timer() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startTimer() {
    timerRef.current = setTimeout(() => {
      console.log('Timer executed');
    }, 3000);
  }

  function clearTimer() {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  return (
    <>
      <button onClick={startTimer}>
        시작
      </button>

      <button onClick={clearTimer}>
        취소
      </button>
    </>
  );
}
```

타이머 ID는 UI 렌더링에 직접 사용하지 않으므로 State 대신 Ref에 보관할 수 있습니다.

컴포넌트가 언마운트될 때 타이머를 정리해야 한다면 Effect의 Cleanup을 활용할 수 있습니다.

```tsx
function Timer() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      console.log('Interval executed');
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return <div>Timer</div>;
}
```

### 6.2. 이전 렌더링 값 저장

Ref를 사용하면 이전 렌더링에서 사용한 값을 보관할 수 있습니다.

```tsx
function Counter({ count }: { count: number }) {
  const previousCountRef = useRef<number | null>(null);

  useEffect(() => {
    previousCountRef.current = count;
  }, [count]);

  return (
    <div>
      <p>현재 값: {count}</p>
      <p>이전 값: {previousCountRef.current}</p>
    </div>
  );
}
```

Effect가 실행되기 전까지 Ref에는 이전에 저장된 값이 유지됩니다.

새로운 `count`가 커밋된 후 Effect에서 Ref를 갱신하므로 다음 렌더링에서 이전 값으로 활용할 수 있습니다.

### 6.3. 외부 객체 유지

외부 라이브러리의 인스턴스나 렌더링과 무관한 객체를 컴포넌트 내부에서 유지해야 하는 경우에도 Ref를 사용할 수 있습니다.

```tsx
function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const playerRef = useRef<VideoPlayerInstance | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    playerRef.current = createPlayer(video);

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  return <video ref={videoRef} />;
}
```

외부 라이브러리 인스턴스는 React의 UI 상태가 아니므로 Ref에 보관할 수 있습니다.

단, 외부 시스템과의 연결 및 정리는 Effect의 Setup과 Cleanup에서 관리하는 것이 적절합니다.

## 7. useRef와 렌더링

Ref 객체의 `current` 값을 변경해도 React는 해당 변경을 감지하여 컴포넌트를 다시 렌더링하지 않습니다.

```tsx
function Example() {
  const valueRef = useRef(0);

  function handleClick() {
    valueRef.current += 1;
  }

  return (
    <button onClick={handleClick}>
      {valueRef.current}
    </button>
  );
}
```

버튼을 클릭하면 `valueRef.current`는 증가하지만 화면에 표시되는 값은 갱신되지 않습니다.

React는 Ref의 `current` 변경을 State 업데이트처럼 추적하지 않기 때문입니다.

### 7.1. Ref 변경은 렌더링을 유발하지 않습니다

React의 렌더링 과정에서 Ref 객체의 변경 여부를 감지하여 UI를 갱신하지 않습니다.

따라서 다음과 같은 코드는 Ref의 변경만으로 화면이 갱신될 것이라고 기대해서는 안 됩니다.

```tsx
function Counter() {
  const countRef = useRef(0);

  function handleClick() {
    countRef.current += 1;
  }

  return (
    <button onClick={handleClick}>
      {countRef.current}
    </button>
  );
}
```

화면에 표시되는 값이 변경되어야 한다면 `useState`를 사용해야 합니다.

### 7.2. Ref를 렌더링 데이터로 사용하지 않습니다

Ref는 렌더링 과정에서 변경 가능한 값이므로 일반적으로 JSX를 계산하는 데 사용하지 않는 것이 좋습니다.

렌더링 중 Ref를 읽거나 변경하면 React의 렌더링 일관성을 해칠 수 있습니다.

다음과 같은 작업은 피해야 합니다.

```tsx
function Example() {
  const ref = useRef(0);

  // 렌더링 중 Ref 변경
  ref.current += 1;

  return <div>{ref.current}</div>;
}
```

렌더링 중 Ref를 변경하면 렌더링이 다시 실행되는 시점이나 횟수에 따라 예상하지 못한 결과가 발생할 수 있습니다.

Ref는 이벤트 핸들러나 Effect 등 렌더링 외부의 로직에서 읽고 변경하는 것이 기본 원칙입니다.

## 8. Ref와 React의 렌더링 규칙

React 컴포넌트는 동일한 Props와 State를 기반으로 동일한 JSX를 반환하는 순수한 렌더링 로직을 유지해야 합니다.

Ref는 렌더링에 영향을 주지 않는 변경 가능한 객체이므로 렌더링 과정에서 임의로 변경하거나 외부에서 변경되는 값을 읽으면 순수성이 깨질 수 있습니다.

### 8.1. 렌더링 중 Ref 읽기

렌더링 과정에서 Ref의 `current`를 읽는 것은 일반적으로 피해야 합니다.

```tsx
function Example() {
  const valueRef = useRef(0);

  // 렌더링 중 Ref 읽기
  const value = valueRef.current;

  return <div>{value}</div>;
}
```

Ref는 렌더링 과정에서 변경될 수 있으므로 렌더링 결과가 일관되지 않을 수 있습니다.

React 공식 문서에서는 일반적으로 이벤트 핸들러와 Effect 외부에서 Ref를 읽거나 변경하지 않도록 권장합니다.

다만 초기화 목적의 제한적인 예외가 있습니다.

### 8.2. 초기화 과정에서 Ref 설정

Ref의 초기값을 결정하기 위해 렌더링 중 `null` 여부를 확인하고 객체를 생성하는 패턴은 허용되는 예외적인 사용 방식입니다.

```tsx
function VideoPlayer() {
  const playerRef = useRef<VideoPlayer | null>(null);

  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }

  return <div>Video Player</div>;
}
```

위 코드는 Ref가 비어 있을 때만 객체를 생성합니다.

동일한 초기값을 기반으로 결정적인 초기화를 수행하는 제한적인 패턴이며, 일반적인 렌더링 중 Ref 변경과 구분해야 합니다.

외부 시스템과 연결하거나 DOM에 의존하는 초기화 작업은 Effect에서 수행하는 것이 적절합니다.

## 9. TypeScript와 useRef

TypeScript에서는 Ref가 연결되는 대상이나 저장할 값의 타입을 명확하게 지정하는 것이 좋습니다.

### 9.1. DOM Ref 타입 지정

DOM 요소에 연결하는 Ref는 해당 DOM 요소의 타입을 지정합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

const divRef = useRef<HTMLDivElement>(null);

const buttonRef = useRef<HTMLButtonElement>(null);
```

초기에는 DOM 요소가 연결되지 않았으므로 일반적으로 `null`을 초기값으로 지정합니다.

### 9.2. 변경 가능한 값의 타입 지정

DOM 요소가 아닌 일반 데이터를 저장할 때는 해당 값의 타입을 지정할 수 있습니다.

```tsx
const countRef = useRef<number>(0);

const nameRef = useRef<string>('React');

const userRef = useRef<User | null>(null);
```

초기값과 저장할 수 있는 값의 범위에 따라 타입을 지정합니다.

### 9.3. Ref의 null 처리

DOM Ref는 요소가 아직 연결되지 않았거나 제거되었을 때 `null`일 수 있습니다.

따라서 `current`에 접근할 때는 null 검사를 수행해야 합니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function handleFocus() {
  inputRef.current?.focus();
}
```

또는 명시적으로 조건을 확인할 수 있습니다.

```tsx
function handleFocus() {
  const input = inputRef.current;

  if (input !== null) {
    input.focus();
  }
}
```

### 9.4. useRef와 RefObject 타입

React TypeScript 타입 정의에서는 Ref 객체와 관련된 타입으로 `RefObject`, `Ref`, `RefCallback` 등을 제공합니다.

DOM 요소에 Ref를 연결할 때는 다음과 같이 작성할 수 있습니다.

```tsx
const inputRef = useRef<HTMLInputElement>(null);
```

Ref를 Props로 전달해야 하는 경우에는 다음과 같이 타입을 지정할 수 있습니다.

```tsx
type InputProps = {
  inputRef: React.Ref<HTMLInputElement>;
};

function CustomInput({ inputRef }: InputProps) {
  return <input ref={inputRef} />;
}
```

`React.Ref<T>`는 Ref 객체뿐 아니라 Callback Ref도 표현할 수 있는 타입입니다.

React 버전과 타입 정의에 따라 `useRef`의 타입 시그니처와 Ref 객체의 읽기 및 쓰기 가능 여부에 차이가 있을 수 있으므로 사용하는 React 및 `@types/react` 버전을 기준으로 확인해야 합니다.

## 10. Callback Ref

Ref는 일반적으로 `useRef`로 생성한 객체를 JSX의 `ref` 속성에 전달하는 방식으로 사용합니다.

그러나 DOM 요소가 연결되거나 해제되는 시점에 특정 작업을 수행해야 하는 경우에는 Callback Ref를 사용할 수 있습니다.

Callback Ref는 DOM 노드가 연결되거나 해제될 때 React가 호출하는 함수입니다.

```tsx
function TextInput() {
  const setInputRef = (node: HTMLInputElement | null) => {
    if (node !== null) {
      node.focus();
    }
  };

  return <input ref={setInputRef} />;
}
```

React가 해당 Input 요소를 연결하면 DOM 노드가 전달되고, 연결이 해제되면 `null`이 전달됩니다.

### 10.1. Callback Ref의 Cleanup

React 19에서는 Callback Ref가 Cleanup 함수를 반환하는 방식을 지원합니다.

```tsx
function Example() {
  const setRef = (node: HTMLDivElement | null) => {
    if (node === null) {
      return;
    }

    console.log('DOM 연결');

    return () => {
      console.log('DOM 연결 해제');
    };
  };

  return <div ref={setRef}>Hello</div>;
}
```

React는 요소가 제거되거나 Ref 콜백이 교체되는 경우 반환된 Cleanup 함수를 실행합니다.

Cleanup 함수를 반환하지 않는 기존 Callback Ref 방식도 사용할 수 있습니다.

### 10.2. Callback Ref의 재생성 주의

컴포넌트 렌더링마다 새로운 Callback Ref가 생성되면 React는 기존 Callback Ref의 연결을 해제하고 새로운 Callback Ref를 연결할 수 있습니다.

```tsx
function Example() {
  return (
    <div
      ref={node => {
        console.log(node);
      }}
    >
      Hello
    </div>
  );
}
```

위 함수는 렌더링마다 새로운 참조를 갖습니다.

Callback Ref의 연결과 해제 과정이 불필요하게 반복되지 않도록 해야 하는 경우 `useCallback`으로 참조를 안정화할 수 있습니다.

```tsx
function Example() {
  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      console.log('DOM 연결');
    }
  }, []);

  return <div ref={setRef}>Hello</div>;
}
```

## 11. React 19와 Ref 전달

React에서는 컴포넌트에 Ref를 전달하는 방식이 버전에 따라 달라졌습니다.

### 11.1. React 18 이전의 forwardRef

React 18 및 이전 버전에서는 함수 컴포넌트에 Ref를 전달하려면 일반적으로 `forwardRef`를 사용했습니다.

```tsx
import { forwardRef } from 'react';

const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  function CustomInput(props, ref) {
    return <input {...props} ref={ref} />;
  },
);
```

부모 컴포넌트는 다음과 같이 Ref를 전달할 수 있습니다.

```tsx
function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <CustomInput ref={inputRef} />;
}
```

### 11.2. React 19의 Ref as a Prop

React 19부터는 함수 컴포넌트에서 `ref`를 일반적인 Props처럼 전달받을 수 있습니다.

```tsx
type InputProps = {
  ref?: React.Ref<HTMLInputElement>;
  placeholder?: string;
};

function CustomInput({ ref, placeholder }: InputProps) {
  return (
    <input
      ref={ref}
      placeholder={placeholder}
    />
  );
}
```

부모 컴포넌트에서는 동일하게 Ref를 전달합니다.

```tsx
function App() {
  const inputRef = useRef<HTMLInputElement>(null);

  return <CustomInput ref={inputRef} />;
}
```

React 19에서는 `forwardRef` 없이도 Ref를 전달할 수 있습니다.

`forwardRef`는 기존 코드와의 호환성을 위해 계속 지원되지만, React 공식 문서에서는 향후 `ref`를 Props로 전달하는 방식으로 대체할 수 있다고 안내합니다.

### 11.3. useImperativeHandle과 Ref

컴포넌트 내부의 DOM 요소 전체를 노출하지 않고 특정 기능만 부모 컴포넌트에서 호출하도록 제한하려면 `useImperativeHandle`을 사용할 수 있습니다.

```tsx
import {
  useImperativeHandle,
  useRef,
} from 'react';

type InputHandle = {
  focus: () => void;
  clear: () => void;
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
    clear() {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
  }));

  return <input ref={inputRef} />;
}
```

부모 컴포넌트는 다음과 같이 제한된 기능만 호출할 수 있습니다.

```tsx
function App() {
  const inputRef = useRef<InputHandle>(null);

  return (
    <>
      <CustomInput ref={inputRef} />

      <button onClick={() => inputRef.current?.focus()}>
        포커스
      </button>

      <button onClick={() => inputRef.current?.clear()}>
        초기화
      </button>
    </>
  );
}
```

이 방식은 자식 컴포넌트의 내부 구현을 직접 노출하지 않고 필요한 명령형 인터페이스만 제공할 수 있습니다.

## 12. useRef 사용 시 주의사항

### 12.1. UI 상태 관리에 사용하지 않습니다

화면에 표시되는 값이 변경되어야 한다면 `useState`를 사용해야 합니다.

Ref 변경은 렌더링을 발생시키지 않으므로 UI 상태를 관리하는 용도로 적합하지 않습니다.

### 12.2. 렌더링 중 Ref를 읽거나 변경하지 않습니다

렌더링 과정에서 Ref를 읽거나 변경하면 React의 순수성 원칙을 위반할 수 있습니다.

Ref는 이벤트 핸들러와 Effect 등 렌더링 외부의 로직에서 사용해야 합니다.

### 12.3. DOM을 직접 변경할 때 주의합니다

React가 관리하는 DOM을 직접 변경하면 React가 예상하는 UI와 실제 DOM 상태가 달라질 수 있습니다.

포커스, 스크롤, 측정 등 필요한 DOM 작업에 한정하여 사용하는 것이 좋습니다.

### 12.4. 초기값 계산에 주의합니다

`useRef(initialValue)`에 전달하는 인자는 컴포넌트가 렌더링될 때마다 평가될 수 있습니다.

```tsx
function Example() {
  const playerRef = useRef(new VideoPlayer());

  return <div>Video Player</div>;
}
```

`VideoPlayer` 생성자가 비용이 큰 작업이라면 렌더링마다 새로운 객체를 생성할 수 있으므로 주의해야 합니다.

초기화가 필요한 경우에는 다음과 같은 패턴을 사용할 수 있습니다.

```tsx
function Example() {
  const playerRef = useRef<VideoPlayer | null>(null);

  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }

  return <div>Video Player</div>;
}
```

이 패턴은 초기화가 순수하고 결정적일 때 사용해야 합니다.

외부 시스템에 연결하거나 DOM에 의존하는 작업은 Effect에서 수행해야 합니다.

### 12.5. Ref 변경만으로 UI가 갱신된다고 가정하지 않습니다

Ref의 `current` 값은 React의 반응형 데이터 흐름에 포함되지 않습니다.

Ref를 변경한 후 화면에도 변경 사항을 반영해야 한다면 State를 함께 사용하는 것이 적절합니다.

## 13. useRef 사용 원칙

`useRef`를 안정적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **렌더링과 무관한 값을 보관합니다.** 타이머 ID, 외부 객체, 이전 값 등 UI 갱신이 필요하지 않은 데이터를 저장합니다.
2. **DOM 접근에 활용합니다.** 포커스, 스크롤, 크기 측정 등 명령형 DOM API가 필요한 경우 사용합니다.
3. **UI 상태에는 useState를 사용합니다.** 값이 변경될 때 화면을 갱신해야 한다면 Ref가 아닌 State로 관리해야 합니다.
4. **렌더링 중 Ref를 읽거나 변경하지 않습니다.** 렌더링의 순수성과 일관성을 유지해야 합니다.
5. **DOM Ref의 null 가능성을 고려합니다.** DOM 요소가 연결되기 전이나 제거된 이후에는 `current`가 `null`일 수 있습니다.
6. **외부 시스템의 생명주기를 관리합니다.** 외부 객체의 생성과 정리는 Effect의 Setup과 Cleanup을 통해 관리하는 것이 좋습니다.
7. **Ref의 참조가 유지된다는 특성을 이해합니다.** 컴포넌트가 다시 렌더링되어도 동일한 Ref 객체를 사용할 수 있습니다.
8. **Ref 전달은 필요한 인터페이스만 노출합니다.** 부모 컴포넌트에 제한된 명령형 기능을 제공하려면 `useImperativeHandle`을 고려합니다.

## 참고 자료

### React 공식 문서

- [useRef – React API Reference](https://react.dev/reference/react/useRef)
- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
- [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- [Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [forwardRef – React API Reference](https://react.dev/reference/react/forwardRef)
- [useImperativeHandle – React API Reference](https://react.dev/reference/react/useImperativeHandle)
- [useCallback – React API Reference](https://react.dev/reference/react/useCallback)
- [useEffect – React API Reference](https://react.dev/reference/react/useEffect)

### TypeScript 공식 문서

- [React TypeScript – Typing useRef](https://react.dev/learn/typescript#typing-use-refs)