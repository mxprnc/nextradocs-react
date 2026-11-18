# React Portals

## 1. 개요

React Portal은 컴포넌트의 자식 요소를 현재 컴포넌트의 DOM 계층 구조가 아닌, 다른 DOM 노드에 렌더링할 수 있도록 하는 기능입니다.

일반적으로 React 컴포넌트는 컴포넌트 트리의 구조에 따라 DOM 요소를 생성합니다. 하지만 모달, 툴팁, 드롭다운과 같이 특정 DOM 컨테이너를 기준으로 렌더링해야 하는 UI에서는 기존 DOM 계층 구조를 벗어날 필요가 있습니다.

React는 `createPortal` API를 제공하여 이러한 요구사항을 처리합니다.

Portal의 주요 특징은 다음과 같습니다.

- **DOM 렌더링 위치 분리:** React 컴포넌트 트리와 실제 DOM 배치 위치를 분리할 수 있습니다.
- **React 트리 유지:** Portal을 사용하더라도 React 컴포넌트 트리에서의 부모-자식 관계는 유지됩니다.
- **Context 유지:** Portal 내부 컴포넌트에서도 상위 컴포넌트의 Context에 접근할 수 있습니다.
- **이벤트 전파 유지:** 이벤트는 실제 DOM 계층이 아닌 React 트리의 부모 방향으로 전파됩니다.
- **DOM 컨테이너 지정:** `createPortal`의 두 번째 인자로 렌더링할 DOM 노드를 지정합니다.

Portal은 React 컴포넌트 구조를 변경하지 않고 DOM 배치 위치만 분리해야 하는 경우에 유용합니다.

## 2. createPortal

### 2.1. 기본 구조

React는 `react-dom` 패키지에서 `createPortal` 함수를 제공합니다.

```tsx
import { createPortal } from 'react-dom';

createPortal(children, domNode, key?);
```

| 인자 | 설명 |
|---|---|
| `children` | 다른 DOM 노드에 렌더링할 React 노드입니다. |
| `domNode` | 자식 요소를 렌더링할 실제 DOM 노드입니다. |
| `key` | Portal의 목록 렌더링 등에서 사용할 선택적 Key입니다. |

`createPortal`은 전달받은 React 노드를 지정한 DOM 노드에 렌더링합니다.

일반적인 컴포넌트 렌더링과 달리 컴포넌트의 React 트리상 위치와 DOM에 배치되는 위치가 달라집니다.

### 2.2. HTML 컨테이너 구성

Portal을 사용하려면 렌더링 대상이 되는 DOM 요소가 필요합니다.

예를 들어 다음과 같이 HTML 문서에 별도의 컨테이너를 구성할 수 있습니다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React Portal</title>
  </head>

  <body>
    <div id="root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

`root`는 일반적인 React 애플리케이션이 렌더링되는 영역이며, `modal-root`는 Portal 콘텐츠를 렌더링하기 위한 별도의 영역입니다.

### 2.3. 기본 사용 예제

```tsx
import { createPortal } from 'react-dom';

function Modal() {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className="modal">
      <h2>Modal Content</h2>
      <p>This content is rendered through a Portal.</p>
    </div>,
    modalRoot
  );
}

function App() {
  return (
    <main>
      <h1>Application</h1>
      <Modal />
    </main>
  );
}

export default App;
```

`Modal` 컴포넌트는 `App`의 자식으로 선언되어 있지만, 실제 DOM 요소는 `modal-root` 내부에 렌더링됩니다.

React 컴포넌트 트리는 다음과 같습니다.

```text
App
 └── Modal
      └── div.modal
```

실제 DOM 구조는 다음과 같습니다.

```text
body
 ├── div#root
 │    └── main
 │         └── h1
 │
 └── div#modal-root
      └── div.modal
```

즉, React 트리의 부모-자식 관계는 유지하면서 DOM 렌더링 위치만 변경합니다.

## 3. React 트리와 DOM 트리

### 3.1. 두 트리의 차이

Portal을 이해하려면 React 컴포넌트 트리와 실제 DOM 트리를 구분해야 합니다.

React 컴포넌트 트리는 React가 컴포넌트 간의 관계를 관리하는 논리적인 구조입니다.

DOM 트리는 브라우저가 실제로 렌더링하는 HTML 요소의 계층 구조입니다.

일반적인 컴포넌트 렌더링에서는 두 구조가 대체로 비슷하게 나타납니다.

그러나 Portal을 사용하면 두 구조가 달라집니다.

```tsx
function Parent() {
  return (
    <div>
      <h1>Parent</h1>
      <Child />
    </div>
  );
}
```

위 구조에서는 React 트리와 DOM 트리 모두 `Parent` 내부에 `Child`가 배치됩니다.

반면 Portal을 사용하면 다음과 같이 구성할 수 있습니다.

```tsx
function Parent() {
  const portalRoot = document.getElementById('portal-root');

  if (!portalRoot) {
    return null;
  }

  return (
    <div>
      <h1>Parent</h1>

      {createPortal(
        <Child />,
        portalRoot
      )}
    </div>
  );
}
```

이 경우 `Child`는 React 트리에서는 `Parent`의 자식이지만, DOM에서는 `portal-root` 내부에 배치됩니다.

### 3.2. React 트리 기준의 컴포넌트 관계

Portal은 DOM 계층 구조를 변경하더라도 React 트리의 컴포넌트 관계를 유지합니다.

따라서 다음과 같은 특성이 유지됩니다.

- 부모 컴포넌트의 Context를 사용할 수 있습니다.
- 부모 컴포넌트에서 전달한 Props를 사용할 수 있습니다.
- React 이벤트가 React 트리의 부모 방향으로 전파됩니다.
- 부모 컴포넌트의 렌더링과 생명주기 흐름에 영향을 받습니다.

Portal은 새로운 React Root를 생성하는 기능이 아닙니다.

기존 React 트리 내부의 자식 요소를 다른 DOM 컨테이너에 렌더링하는 기능입니다.

## 4. Portal과 이벤트 전파

### 4.1. 이벤트 버블링의 기준

Portal 내부에서 발생한 이벤트는 실제 DOM 계층이 아니라 React 트리의 부모 방향으로 전파됩니다.

일반적인 DOM 이벤트에서는 이벤트가 실제 DOM 트리의 부모 요소를 따라 버블링됩니다.

하지만 React Portal 내부에서 발생한 이벤트는 React 컴포넌트 트리의 부모 컴포넌트에 등록된 이벤트 핸들러까지 전달될 수 있습니다.

```tsx
import { createPortal } from 'react-dom';

function Modal() {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <button>
      Click Modal
    </button>,
    modalRoot
  );
}

function App() {
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <h1>Application</h1>
      <Modal />
    </div>
  );
}
```

버튼을 클릭하면 `Parent clicked`가 출력됩니다.

실제 DOM에서는 버튼이 `#modal-root` 내부에 있으므로 `#root` 내부의 `div`가 DOM 조상 요소가 아닙니다.

그러나 React 트리에서는 `Modal`이 `App`의 자식이므로 React 이벤트 전파 과정에서 부모의 이벤트 핸들러가 실행됩니다.

### 4.2. 이벤트 전파 제어

Portal 내부의 이벤트가 부모 컴포넌트에 전달되지 않도록 하려면 `stopPropagation()`을 사용할 수 있습니다.

```tsx
import { createPortal } from 'react-dom';

function Modal() {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div
      className="modal"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <button>
        Click Modal
      </button>
    </div>,
    modalRoot
  );
}

function App() {
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <Modal />
    </div>
  );
}
```

위 코드에서는 모달 내부에서 발생한 클릭 이벤트의 전파를 중단합니다.

이벤트 전파는 DOM 배치 위치가 아니라 React 트리를 기준으로 동작한다는 점을 고려해야 합니다.

## 5. Portal과 Context

Portal은 별도의 React Root를 생성하지 않으므로 기존 React 트리의 Context를 그대로 사용할 수 있습니다.

```tsx
import {
  createContext,
  useContext,
} from 'react';

import { createPortal } from 'react-dom';

const ThemeContext = createContext('light');

function Modal() {
  const theme = useContext(ThemeContext);
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <div className={`modal ${theme}`}>
      Current Theme: {theme}
    </div>,
    modalRoot
  );
}

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Modal />
    </ThemeContext.Provider>
  );
}
```

`Modal` 컴포넌트는 DOM에서는 별도의 컨테이너에 렌더링되지만, React 트리에서는 `ThemeContext.Provider`의 하위 컴포넌트입니다.

따라서 `useContext(ThemeContext)`를 통해 상위 Provider가 제공하는 값을 읽을 수 있습니다.

Portal은 DOM 렌더링 위치만 변경하며 Context의 전달 경로에는 영향을 주지 않습니다.

## 6. Portal의 주요 활용 사례

### 6.1. Modal

Modal은 Portal의 대표적인 활용 사례입니다.

일반적인 DOM 계층 구조 내부에 모달을 배치하면 부모 요소의 `overflow`, `transform`, `z-index` 등의 CSS 속성에 영향을 받을 수 있습니다.

예를 들어 부모 요소에 `overflow: hidden`이 설정되어 있으면 모달이 부모 영역 밖으로 표시되지 않을 수 있습니다.

Portal을 사용하면 모달을 별도의 DOM 컨테이너에 배치하여 이러한 문제를 줄일 수 있습니다.

```tsx
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function Modal({
  open,
  onClose,
  children,
}: ModalProps) {
  const modalRoot = document.getElementById('modal-root');

  if (!open || !modalRoot) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
      >
        {children}

        <button onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    modalRoot
  );
}
```

위 예제에서는 `open`이 `true`인 경우에만 모달을 렌더링합니다.

모달의 표시 여부는 부모 컴포넌트가 관리하고, Portal은 실제 DOM 배치 위치를 분리하는 역할을 수행합니다.

실제 서비스 수준의 Modal을 구현할 때는 다음 항목도 고려해야 합니다.

- 키보드 접근성 및 Tab 이동 제어
- 모달 내부로의 포커스 이동
- 모달 종료 시 기존 포커스 복원
- Escape 키를 이용한 닫기
- 배경 영역의 스크롤 제어
- 모달의 접근 가능한 이름 및 설명 제공
- 여러 모달이 겹치는 경우의 레이어 관리

Portal 자체가 이러한 접근성 및 동작을 자동으로 제공하지는 않습니다.

### 6.2. Tooltip

Tooltip은 특정 UI 요소의 설명을 화면의 다른 위치에 표시해야 하는 경우에 활용할 수 있습니다.

```tsx
import { createPortal } from 'react-dom';

type TooltipProps = {
  visible: boolean;
  children: React.ReactNode;
};

function Tooltip({
  visible,
  children,
}: TooltipProps) {
  const tooltipRoot = document.getElementById('tooltip-root');

  if (!visible || !tooltipRoot) {
    return null;
  }

  return createPortal(
    <div className="tooltip">
      {children}
    </div>,
    tooltipRoot
  );
}
```

Tooltip을 별도의 DOM 컨테이너에 배치하면 부모 요소의 `overflow` 설정으로 인해 콘텐츠가 잘리는 문제를 줄일 수 있습니다.

다만 실제 Tooltip의 위치를 정확하게 계산하려면 기준 요소의 위치, 화면 크기, 스크롤 상태 등을 추가로 고려해야 합니다.

### 6.3. Dropdown 및 Popover

Dropdown이나 Popover도 Portal을 이용하여 구현할 수 있습니다.

특히 스크롤 컨테이너 내부에 위치한 Dropdown이 컨테이너 밖으로 표시되어야 하는 경우 유용합니다.

```tsx
import { createPortal } from 'react-dom';

type DropdownProps = {
  open: boolean;
  children: React.ReactNode;
};

function Dropdown({
  open,
  children,
}: DropdownProps) {
  const dropdownRoot = document.getElementById('overlay-root');

  if (!open || !dropdownRoot) {
    return null;
  }

  return createPortal(
    <div className="dropdown">
      {children}
    </div>,
    dropdownRoot
  );
}
```

Portal은 DOM 배치 위치를 분리하지만 Dropdown의 위치 계산, 외부 클릭 감지, 키보드 탐색 등은 별도로 구현해야 합니다.

## 7. Portal의 생명주기와 렌더링

### 7.1. Portal의 생성과 제거

Portal은 React 컴포넌트의 렌더링 결과에 포함되므로 조건부 렌더링을 통해 생성하거나 제거할 수 있습니다.

```tsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

function Modal() {
  const [open, setOpen] = useState(false);

  const modalRoot = document.getElementById('modal-root');

  return (
    <>
      <button onClick={() => setOpen(true)}>
        Open Modal
      </button>

      {open && modalRoot
        ? createPortal(
            <div className="modal">
              <p>Modal Content</p>

              <button onClick={() => setOpen(false)}>
                Close
              </button>
            </div>,
            modalRoot
          )
        : null}
    </>
  );
}
```

`open`이 `true`가 되면 Portal 콘텐츠가 생성되고, `false`가 되면 해당 콘텐츠가 제거됩니다.

Portal 내부 컴포넌트도 일반적인 React 컴포넌트와 동일하게 State와 Effect를 사용할 수 있습니다.

### 7.2. DOM 컨테이너 변경

`createPortal`의 두 번째 인자인 DOM 노드가 변경되면 React는 Portal 콘텐츠를 기존 컨테이너에서 새로운 컨테이너로 이동시키는 대신 기존 Portal 콘텐츠를 제거하고 새로운 컨테이너에 다시 생성합니다.

이 과정에서 Portal 내부 컴포넌트의 State가 초기화될 수 있습니다.

따라서 DOM 컨테이너는 렌더링 사이에 안정적으로 유지되는 요소를 사용하는 것이 좋습니다.

```tsx
const modalRoot = document.getElementById('modal-root');

if (!modalRoot) {
  return null;
}

return createPortal(
  <ModalContent />,
  modalRoot
);
```

Portal의 대상 DOM 노드가 불필요하게 변경되지 않도록 관리해야 합니다.

### 7.3. Portal의 Key

`createPortal`은 세 번째 인자로 선택적인 `key`를 전달받을 수 있습니다.

```tsx
createPortal(
  <ModalContent />,
  modalRoot,
  'modal-content'
);
```

Key는 여러 Portal을 목록 형태로 렌더링하거나 React가 Portal의 렌더링 대상을 구분해야 하는 경우 활용할 수 있습니다.

일반적인 단일 Portal 구현에서는 반드시 지정할 필요는 없습니다.

## 8. Server Rendering과 Hydration

### 8.1. DOM 접근 시점

Portal의 대상이 되는 DOM 노드는 브라우저의 실제 DOM 요소여야 합니다.

따라서 다음과 같이 `document`를 직접 사용하는 코드는 서버 렌더링 환경에서 주의해야 합니다.

```tsx
const modalRoot = document.getElementById('modal-root');
```

서버 환경에는 브라우저의 `document` 객체가 존재하지 않기 때문입니다.

Next.js와 같은 Server Rendering 환경에서는 컴포넌트가 서버에서도 실행될 수 있으므로, 브라우저 전용 DOM API를 사용하는 시점을 고려해야 합니다.

### 8.2. Client Component에서 Portal 사용

Next.js App Router에서는 브라우저 이벤트와 Ref 등을 사용하는 컴포넌트를 Client Component로 구성해야 합니다.

```tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  children: React.ReactNode;
};

function Portal({ children }: PortalProps) {
  const [portalRoot, setPortalRoot] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(
      document.getElementById('modal-root')
    );
  }, []);

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    children,
    portalRoot
  );
}

export default Portal;
```

이 구현은 다음 순서로 동작합니다.

1. 서버 렌더링 및 초기 클라이언트 렌더링에서는 `portalRoot`가 `null`입니다.
2. 컴포넌트가 마운트된 이후 Effect가 실행됩니다.
3. 브라우저의 `document`에서 Portal 컨테이너를 조회합니다.
4. State가 업데이트되면서 컴포넌트가 다시 렌더링됩니다.
5. Portal 콘텐츠가 지정된 DOM 컨테이너에 렌더링됩니다.

초기 서버 렌더링 결과와 클라이언트의 초기 렌더링 결과가 일치하도록 구성하면 Hydration 불일치 문제를 방지할 수 있습니다.

단, 이 패턴은 Portal 콘텐츠가 Effect 실행 이후에 표시되므로 초기 렌더링 시점에 즉시 표시해야 하는 요구사항이 있다면 별도의 SSR 및 렌더링 구조를 고려해야 합니다.

## 9. Portal과 React Root의 차이

Portal과 React Root는 모두 특정 DOM 노드에 React 콘텐츠를 렌더링할 수 있지만, React 트리에서의 관계가 다릅니다.

| 구분 | Portal | React Root |
|---|---|---|
| API | `createPortal` | `createRoot` |
| React 트리 | 기존 트리에 포함 | 독립적인 React Root 생성 |
| DOM 위치 | 지정한 DOM 노드 | Root로 생성한 DOM 노드 |
| 부모 Context 접근 | 가능 | 별도 설정 필요 |
| 부모 컴포넌트의 이벤트 전파 | React 트리 기준으로 유지 | 기존 React 트리와 별개 |
| 주요 목적 | 기존 컴포넌트의 DOM 배치 위치 변경 | 독립적인 React 애플리케이션 렌더링 |

Portal은 기존 React 애플리케이션의 컴포넌트 구조를 유지하면서 DOM 위치만 변경할 때 사용합니다.

반면 `createRoot`는 독립적인 React 렌더링 루트를 생성할 때 사용합니다.

따라서 단순히 모달이나 Tooltip을 별도의 DOM 영역에 표시하려는 목적이라면 새로운 React Root를 생성하기보다 Portal을 사용하는 것이 적절합니다.

## 10. Portal 사용 시 주의사항

### 10.1. CSS stacking context

Portal을 사용하면 부모 DOM 요소의 stacking context에서 벗어나 별도의 DOM 영역에 콘텐츠를 배치할 수 있습니다.

하지만 Portal을 사용한다고 해서 모든 `z-index` 문제가 자동으로 해결되는 것은 아닙니다.

Portal 대상 컨테이너의 조상 요소에도 stacking context가 존재할 수 있으며, 해당 컨테이너의 위치와 CSS 설정에 따라 여전히 레이어 순서가 영향을 받을 수 있습니다.

따라서 Portal 컨테이너의 DOM 위치와 `z-index` 정책을 함께 설계해야 합니다.

### 10.2. 접근성

Portal은 DOM 구조를 분리하기 위한 기능이며, 접근성을 자동으로 보장하지 않습니다.

특히 Modal을 구현할 때는 다음 사항을 고려해야 합니다.

- 적절한 `role="dialog"` 및 `aria-modal="true"` 설정
- Dialog의 제목과 설명 연결
- 키보드만으로 조작할 수 있는 구조
- 포커스 이동 및 복원
- 모달 외부 콘텐츠의 상호작용 제어

시각적으로 화면 위에 표시되는 것과 접근성 트리에서 올바르게 표현되는 것은 별개의 문제입니다.

### 10.3. 이벤트 전파

Portal 내부 이벤트는 React 트리를 기준으로 전파됩니다.

따라서 DOM 구조만 확인하고 이벤트 전파를 예상하면 의도하지 않은 부모 이벤트 핸들러가 실행될 수 있습니다.

필요한 경우 `stopPropagation()`을 사용하여 이벤트 전파를 제어해야 합니다.

### 10.4. Portal 컨테이너의 존재 여부

Portal을 생성할 때 전달하는 DOM 노드는 실제로 존재해야 합니다.

```tsx
const portalRoot = document.getElementById('modal-root');

if (!portalRoot) {
  return null;
}
```

컨테이너가 존재하지 않는 경우에는 Portal을 렌더링하지 않도록 처리하거나, 애플리케이션 초기화 과정에서 해당 컨테이너가 항상 생성되도록 보장해야 합니다.

### 10.5. 과도한 Portal 사용 지양

모든 UI 요소를 Portal로 렌더링할 필요는 없습니다.

일반적인 콘텐츠는 기존 DOM 계층 구조를 유지하는 편이 자연스럽습니다.

Portal은 다음과 같이 DOM 배치 위치를 분리해야 하는 명확한 이유가 있을 때 사용하는 것이 좋습니다.

- Modal
- Tooltip
- Dropdown
- Popover
- Toast Notification
- 전역 Overlay

## 11. 정리

React Portal은 React 컴포넌트 트리의 구조를 유지하면서 자식 요소를 다른 DOM 노드에 렌더링하는 기능입니다.

주요 특징은 다음과 같습니다.

- `createPortal`을 통해 Portal 콘텐츠를 렌더링합니다.
- React 트리와 실제 DOM 트리의 구조를 분리할 수 있습니다.
- Portal 내부에서도 상위 컴포넌트의 Props와 Context를 사용할 수 있습니다.
- 이벤트는 실제 DOM 계층이 아닌 React 트리를 기준으로 전파됩니다.
- Modal, Tooltip, Dropdown, Toast Notification 등의 UI에 적합합니다.
- Portal은 새로운 React Root를 생성하지 않습니다.
- Server Rendering 환경에서는 브라우저 DOM 접근 시점을 고려해야 합니다.
- 접근성, 포커스 관리, CSS stacking context 등은 별도로 설계해야 합니다.

Portal은 React 컴포넌트의 논리적인 구조와 브라우저 DOM의 물리적인 배치 구조를 분리할 수 있도록 하는 기능입니다. 이를 통해 기존 컴포넌트 구조를 유지하면서도 Overlay와 같은 독립적인 UI 영역을 효과적으로 구성할 수 있습니다.

## 12. 참고자료

### React 공식 문서

- [createPortal](https://react.dev/reference/react-dom/createPortal)
  - Portal 생성 방법, DOM 컨테이너 지정, 이벤트 전파 및 React 트리와의 관계를 설명합니다.
- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
  - Ref를 이용한 DOM 접근과 조작 방법을 설명합니다.
- [useContext](https://react.dev/reference/react/useContext)
  - Context를 이용한 컴포넌트 간 데이터 전달과 Portal 내부에서의 Context 접근을 이해하는 데 참고할 수 있습니다.
- [createRoot](https://react.dev/reference/react-dom/client/createRoot)
  - Portal과 독립적인 React Root의 차이를 이해하는 데 참고할 수 있습니다.

### Next.js 공식 문서

- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
  - App Router 환경에서 Server Component와 Client Component의 역할 및 브라우저 API 사용 범위를 설명합니다.

### MDN Web Docs

- [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
  - 브라우저 DOM의 구조와 동작을 설명합니다.
- [Event bubbling](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Event_bubbling)
  - DOM 이벤트의 캡처링과 버블링 동작을 설명합니다.
- [Document.getElementById](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)
  - DOM 요소를 ID로 조회하는 방법을 설명합니다.