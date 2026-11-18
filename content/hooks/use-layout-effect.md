# useLayoutEffect

## 1. useLayoutEffect란?

`useLayoutEffect`는 브라우저가 화면을 다시 그리기 전에 실행되는 Effect를 정의하는 React Hook입니다.

일반적인 `useEffect`는 브라우저가 화면을 업데이트한 이후에 실행될 수 있지만, `useLayoutEffect`는 브라우저가 화면을 다시 그리기 전에 실행됩니다.

이러한 특성은 DOM 요소의 크기나 위치를 측정하고, 측정 결과에 따라 화면을 보정해야 하는 경우에 유용합니다.

대표적인 사용 사례는 다음과 같습니다.

- DOM 요소의 크기와 위치 측정
- Tooltip이나 Popover의 위치 계산
- 화면에 표시되는 요소의 레이아웃 보정
- 화면이 그려지기 전에 수행해야 하는 동기적인 DOM 작업
- DOM 측정 결과에 따라 추가 렌더링이 필요한 경우

기본 문법은 다음과 같습니다.

```tsx
import { useLayoutEffect } from 'react';

useLayoutEffect(() => {
  // DOM 측정 및 레이아웃 관련 작업

  return () => {
    // 정리 작업
  };
}, [dependencies]);
```

`useLayoutEffect`는 `useEffect`와 동일한 형태로 사용하지만, 실행 시점이 다릅니다.

특히 브라우저가 화면을 그리기 전에 실행되므로 화면에 불필요한 중간 상태가 노출되는 것을 방지할 수 있습니다.

다만 `useLayoutEffect`는 브라우저의 화면 업데이트를 차단할 수 있으므로 반드시 필요한 경우에만 사용해야 합니다.

## 2. 기본 문법

```tsx
useLayoutEffect(setup, dependencies?);
```

- `setup`: Effect가 실행될 때 수행할 함수입니다.
- `dependencies`: Effect가 참조하는 반응형 값의 배열입니다.
- `cleanup`: Effect가 다시 실행되거나 컴포넌트가 제거될 때 수행할 정리 함수입니다.

의존성 배열의 동작 방식은 `useEffect`와 동일합니다.

### 2.1. 의존성 배열 생략

```tsx
useLayoutEffect(() => {
  console.log('렌더링 이후 Layout Effect 실행');
});
```

의존성 배열을 생략하면 컴포넌트가 렌더링될 때마다 Effect가 실행됩니다.

### 2.2. 빈 의존성 배열

```tsx
useLayoutEffect(() => {
  console.log('최초 마운트 이후 실행');
}, []);
```

빈 배열을 전달하면 최초 마운트 이후 실행되며, 일반적인 업데이트 렌더링에서는 다시 실행되지 않습니다.

컴포넌트가 언마운트될 때는 Cleanup 함수가 실행됩니다.

### 2.3. 특정 의존성 지정

```tsx
useLayoutEffect(() => {
  console.log('width 변경에 따른 레이아웃 측정');
}, [width]);
```

`width`가 변경되면 다음 화면 업데이트 전에 Effect가 다시 실행됩니다.

React는 이전 Effect의 Cleanup 함수를 실행한 다음 새로운 Effect를 실행합니다.

의존성 비교에는 `Object.is`가 사용됩니다.

## 3. useLayoutEffect의 실행 시점

`useLayoutEffect`의 핵심은 브라우저가 화면을 그리기 전에 실행된다는 점입니다.

React 애플리케이션의 화면 업데이트 과정은 대략 다음과 같이 구성됩니다.

1. React가 컴포넌트를 렌더링합니다.
2. React가 변경된 DOM을 실제 DOM에 반영합니다.
3. `useLayoutEffect`가 실행됩니다.
4. `useLayoutEffect` 내부에서 발생한 동기적인 상태 업데이트가 처리됩니다.
5. 브라우저가 화면을 다시 그립니다.
6. `useEffect`가 실행됩니다.

이 과정에서 `useLayoutEffect`는 브라우저의 Paint 이전에 실행되므로 화면이 그려지기 전에 DOM을 측정하거나 보정할 수 있습니다.

반면 `useEffect`는 일반적으로 Paint 이후에 실행되지만, 상호작용에 의해 발생한 업데이트 등 일부 상황에서는 Paint 이전에 실행될 수도 있습니다.

따라서 두 Hook의 차이는 단순히 실행 순서만이 아니라 브라우저의 화면 업데이트를 차단하는지 여부와도 관련이 있습니다.

## 4. useEffect와 useLayoutEffect 비교

두 Hook은 모두 컴포넌트 렌더링 이후 특정 작업을 수행하기 위한 Effect를 정의합니다.

가장 중요한 차이는 실행 시점입니다.

| 구분 | useEffect | useLayoutEffect |
| --- | --- | --- |
| 실행 시점 | 일반적으로 브라우저 Paint 이후 | 브라우저 Paint 이전 |
| 화면 업데이트 차단 | 일반적으로 차단하지 않음 | 실행이 완료될 때까지 차단 |
| 주요 용도 | 데이터 요청, 구독, 외부 시스템 동기화 | DOM 측정, 레이아웃 보정 |
| 성능 영향 | 비교적 적음 | 동기 실행으로 렌더링 지연 가능 |
| 서버 렌더링 | 서버에서는 Effect 실행 안 됨 | 서버에서는 Effect 실행 안 됨 |

### 4.1. useEffect 사용

```tsx
import { useEffect, useState } from 'react';

function Example() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = document.getElementById('target');

    if (!element) {
      return;
    }

    setWidth(element.getBoundingClientRect().width);
  }, []);

  return (
    <div>
      <div id="target">Target Element</div>
      <p>Width: {width}</p>
    </div>
  );
}
```

`useEffect`를 사용하면 최초 화면이 그려진 이후 DOM 크기를 측정할 수 있습니다.

측정 결과를 State에 반영하면 컴포넌트가 다시 렌더링됩니다.

따라서 최초 화면에서 측정 전의 값이 잠시 표시될 수 있습니다.

### 4.2. useLayoutEffect 사용

```tsx
import { useLayoutEffect, useState } from 'react';

function Example() {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = document.getElementById('target');

    if (!element) {
      return;
    }

    setWidth(element.getBoundingClientRect().width);
  }, []);

  return (
    <div>
      <div id="target">Target Element</div>
      <p>Width: {width}</p>
    </div>
  );
}
```

`useLayoutEffect`는 브라우저가 화면을 그리기 전에 실행됩니다.

측정 결과에 따른 State 업데이트도 화면이 그려지기 전에 처리되므로, 측정 전의 값이 사용자에게 노출되는 것을 방지할 수 있습니다.

다만 단순한 DOM 측정이나 외부 시스템 동기화에는 일반적으로 `useEffect`를 우선 고려해야 합니다.

화면에 잘못된 위치나 크기가 잠시 노출되는 문제가 실제로 발생하는 경우에 `useLayoutEffect`를 사용하는 것이 적절합니다.

## 5. DOM 요소 측정

`useLayoutEffect`의 대표적인 사용 사례는 DOM 요소의 크기와 위치를 측정하는 것입니다.

브라우저의 레이아웃 계산이 완료된 DOM 요소에 접근하여 실제 렌더링 크기를 확인할 수 있습니다.

### 5.1. getBoundingClientRect

`getBoundingClientRect()`는 DOM 요소의 크기와 뷰포트 기준 위치를 반환합니다.

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

function MeasureElement() {
  const elementRef = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    setSize({
      width: rect.width,
      height: rect.height,
    });
  }, []);

  return (
    <div>
      <div
        ref={elementRef}
        style={{
          width: '300px',
          height: '150px',
          padding: '20px',
          border: '1px solid black',
        }}
      >
        측정 대상 요소
      </div>

      <p>Width: {size.width}px</p>
      <p>Height: {size.height}px</p>
    </div>
  );
}
```

`getBoundingClientRect()`는 다음과 같은 정보를 제공합니다.

- `width`: 요소의 너비
- `height`: 요소의 높이
- `top`: 뷰포트 상단으로부터의 거리
- `left`: 뷰포트 왼쪽으로부터의 거리
- `right`: 뷰포트 오른쪽 좌표
- `bottom`: 뷰포트 하단 좌표

반환되는 크기는 일반적으로 CSS Transform의 영향을 포함한 화면상의 경계 크기입니다.

### 5.2. offsetWidth와 clientWidth

DOM 요소의 크기를 측정할 때는 목적에 따라 적절한 API를 선택해야 합니다.

| API | 측정 대상 |
| --- | --- |
| getBoundingClientRect() | 화면상 경계 영역의 크기와 위치 |
| offsetWidth | 요소의 레이아웃 너비와 Padding, Border |
| clientWidth | Padding을 포함하고 Border와 Scrollbar를 제외한 내부 너비 |
| scrollWidth | 스크롤 영역을 포함한 전체 콘텐츠 너비 |

요소의 실제 레이아웃 크기가 필요한지, 화면에 표시되는 경계 크기가 필요한지에 따라 측정 API를 선택해야 합니다.

## 6. Tooltip 위치 계산

Tooltip은 대표적인 `useLayoutEffect` 활용 사례입니다.

Tooltip의 위치는 표시 대상 요소와 Tooltip 자체의 크기를 측정한 다음 결정해야 합니다.

일반적인 구현에서는 Tooltip이 처음 렌더링된 이후 위치를 계산합니다.

이때 `useEffect`를 사용하면 Tooltip이 잘못된 위치에 잠시 표시된 후 이동하는 현상이 발생할 수 있습니다.

`useLayoutEffect`를 사용하면 화면이 그려지기 전에 위치를 보정할 수 있습니다.

### 6.1. Tooltip 구현

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

function Tooltip() {
  const targetRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    const target = targetRef.current;
    const tooltip = tooltipRef.current;

    if (!target || !tooltip) {
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    setPosition({
      top: targetRect.top - tooltipRect.height - 8,
      left:
        targetRect.left +
        targetRect.width / 2 -
        tooltipRect.width / 2,
    });
  }, []);

  return (
    <div>
      <button ref={targetRef}>
        마우스를 올려보세요
      </button>

      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
        }}
      >
        Tooltip
      </div>
    </div>
  );
}
```

위 예제에서는 다음과 같은 과정으로 Tooltip 위치를 계산합니다.

1. 기준 요소의 DOM 위치와 크기를 측정합니다.
2. Tooltip의 DOM 위치와 크기를 측정합니다.
3. 기준 요소의 중앙을 기준으로 Tooltip의 좌표를 계산합니다.
4. 계산된 좌표를 State에 반영합니다.
5. 새로운 위치가 반영된 화면을 브라우저가 그립니다.

실제 Tooltip을 구현할 때는 화면 경계 초과, 스크롤, 리사이즈, 중첩된 스크롤 컨테이너 등을 함께 고려해야 합니다.

이러한 복잡한 위치 계산은 Floating UI와 같은 전용 라이브러리를 활용할 수도 있습니다.

## 7. DOM 측정 이후 State 업데이트

`useLayoutEffect` 내부에서 State를 변경하면 React는 해당 업데이트를 동기적으로 처리하고 브라우저가 화면을 그리기 전에 다시 렌더링합니다.

```tsx
function Example() {
  const [height, setHeight] = useState(0);

  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    setHeight(element.getBoundingClientRect().height);
  }, []);

  return (
    <div>
      <div ref={elementRef}>
        측정 대상
      </div>

      <p>{height}px</p>
    </div>
  );
}
```

동작 과정은 다음과 같습니다.

1. 최초 렌더링에서 측정 대상 DOM을 생성합니다.
2. DOM이 실제 DOM에 반영됩니다.
3. `useLayoutEffect`가 DOM 크기를 측정합니다.
4. `setHeight`가 호출됩니다.
5. React가 변경된 State를 반영하여 다시 렌더링합니다.
6. 브라우저가 최종 화면을 그립니다.

이러한 동작을 통해 측정 전의 중간 화면이 사용자에게 노출되지 않도록 할 수 있습니다.

다만 `useLayoutEffect` 내부에서 State 업데이트를 반복적으로 발생시키면 화면 렌더링이 지연될 수 있으므로 주의해야 합니다.

## 8. useLayoutEffect와 Cleanup

`useLayoutEffect`도 `useEffect`와 동일하게 Cleanup 함수를 반환할 수 있습니다.

Cleanup 함수는 다음 상황에서 실행됩니다.

- 의존성이 변경되어 Effect가 다시 실행되기 직전
- 컴포넌트가 언마운트될 때

```tsx
useLayoutEffect(() => {
  const element = ref.current;

  if (!element) {
    return;
  }

  const rect = element.getBoundingClientRect();

  console.log(rect);

  return () => {
    console.log('Layout Effect Cleanup');
  };
}, [dependency]);
```

Cleanup은 이전 Effect가 설정한 작업을 정리하는 용도로 사용합니다.

다만 `useLayoutEffect`를 사용한다고 해서 모든 DOM 이벤트나 외부 리소스를 자동으로 관리해 주는 것은 아닙니다.

이벤트 리스너, Observer, 타이머 등의 리소스는 직접 정리해야 합니다.

## 9. ResizeObserver와 useLayoutEffect

DOM 요소의 크기가 변경될 때마다 측정해야 한다면 `ResizeObserver`를 활용할 수 있습니다.

`useLayoutEffect`는 특정 시점에 DOM을 측정하는 데 유용하지만, 요소의 크기가 이후에도 변경되는 상황을 자동으로 감지하지는 않습니다.

이때 `ResizeObserver`를 등록하여 크기 변경을 관찰할 수 있습니다.

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

function ResponsiveElement() {
  const elementRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const element = elementRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      setWidth(entry.contentRect.width);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <div
        ref={elementRef}
        style={{
          width: '50%',
          minWidth: '200px',
          resize: 'horizontal',
          overflow: 'auto',
        }}
      >
        크기 변경이 가능한 요소
      </div>

      <p>Width: {width}px</p>
    </div>
  );
}
```

위 예제에서는 요소의 크기가 변경될 때마다 `ResizeObserver`가 콜백을 실행하고 측정된 너비를 State에 반영합니다.

`ResizeObserver` 콜백은 브라우저의 렌더링 과정에서 실행되므로, 콜백 내부의 State 업데이트가 레이아웃 계산에 영향을 줄 수 있습니다.

크기 변경에 따라 다시 크기를 변경하는 로직을 작성하면 ResizeObserver Loop 문제가 발생할 수 있으므로 주의해야 합니다.

또한 단순한 크기 변경 감지에는 `useEffect`를 사용해도 충분한 경우가 많습니다. 초기 DOM 측정 결과를 첫 Paint 전에 반드시 반영해야 하는 경우에 `useLayoutEffect`를 고려해야 합니다.

## 10. 브라우저 렌더링 과정과 useLayoutEffect

`useLayoutEffect`의 동작을 이해하려면 브라우저의 렌더링 과정과 연결해서 이해하는 것이 좋습니다.

브라우저는 DOM과 CSSOM을 기반으로 화면을 구성합니다.

일반적인 렌더링 과정은 다음과 같습니다.

1. JavaScript 실행
2. Style 계산
3. Layout(Reflow)
4. Paint
5. Composite

각 단계의 역할은 다음과 같습니다.

| 단계 | 설명 |
| --- | --- |
| JavaScript | DOM 변경 및 JavaScript 실행 |
| Style | 적용할 CSS 스타일 계산 |
| Layout | 요소의 크기와 위치 계산 |
| Paint | 픽셀 단위로 화면 그리기 |
| Composite | 레이어를 합성하여 최종 화면 구성 |

React의 `useLayoutEffect`는 React가 DOM 변경을 반영한 이후, 브라우저가 Paint를 수행하기 전에 실행됩니다.

따라서 이 시점에서 DOM 요소의 크기와 위치를 측정하고 필요한 레이아웃 변경을 수행할 수 있습니다.

다만 `useLayoutEffect`가 실행될 때 브라우저의 모든 렌더링 단계가 항상 별도의 독립적인 과정으로 완료되어 있다는 의미는 아닙니다.

DOM 측정 API는 필요한 경우 브라우저의 동기적인 Style 및 Layout 계산을 유발할 수 있습니다.

이러한 특성 때문에 `useLayoutEffect` 내부에서 DOM 측정과 스타일 변경을 반복하면 Layout Thrashing이 발생할 수 있습니다.

## 11. useLayoutEffect와 Layout Thrashing

Layout Thrashing은 DOM의 스타일을 변경한 직후 레이아웃 정보를 반복적으로 읽으면서 브라우저가 Layout 계산을 여러 번 수행하게 되는 현상입니다.

예를 들어 다음과 같은 코드는 비효율적일 수 있습니다.

```tsx
useLayoutEffect(() => {
  const elements = document.querySelectorAll('.item');

  elements.forEach(element => {
    const width = element.getBoundingClientRect().width;

    element.style.width = `${width + 10}px`;
  });
}, []);
```

DOM 요소의 크기를 읽고 스타일을 변경하는 작업이 반복되면 브라우저의 동기적인 Layout 계산이 여러 번 발생할 수 있습니다.

가능하면 DOM 읽기 작업과 쓰기 작업을 분리하는 것이 좋습니다.

```tsx
useLayoutEffect(() => {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>('.item'),
  );

  // DOM 읽기 작업
  const widths = elements.map(element => {
    return element.getBoundingClientRect().width;
  });

  // DOM 쓰기 작업
  elements.forEach((element, index) => {
    element.style.width = `${widths[index] + 10}px`;
  });
}, []);
```

위 예제는 먼저 모든 요소의 크기를 측정한 다음 스타일을 변경합니다.

이렇게 하면 반복적인 Layout 계산이 발생할 가능성을 줄일 수 있습니다.

다만 실제 성능은 DOM 구조, CSS, 브라우저 최적화 등에 따라 달라질 수 있으므로 성능 측정을 통해 확인해야 합니다.

## 12. 서버 렌더링과 useLayoutEffect

`useLayoutEffect`는 브라우저 DOM을 기반으로 동작하는 Hook입니다.

서버 렌더링 환경에서는 브라우저 DOM이 존재하지 않으므로 `useLayoutEffect`를 실행할 수 없습니다.

React의 서버 렌더링 과정에서는 `useLayoutEffect`와 `useEffect`가 실행되지 않습니다.

따라서 서버에서 렌더링된 HTML에는 Effect에서 수행하려던 DOM 측정 및 레이아웃 보정이 반영되지 않습니다.

### 12.1. 서버 렌더링에서의 문제

다음과 같은 컴포넌트를 생각할 수 있습니다.

```tsx
function Tooltip() {
  const ref = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setPosition({
      top: rect.top,
      left: rect.left,
    });
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
      }}
    >
      Tooltip
    </div>
  );
}
```

서버에서는 `useLayoutEffect`가 실행되지 않으므로 초기 위치를 계산할 수 없습니다.

이러한 컴포넌트는 서버에서 렌더링된 HTML과 브라우저에서 측정한 최종 화면 사이에 차이가 발생할 수 있습니다.

### 12.2. 해결 방법

서버 렌더링 환경에서 레이아웃 측정이 필요한 경우에는 다음 방법을 고려할 수 있습니다.

**1. useEffect로 변경**

화면이 먼저 표시된 후 측정해도 문제가 없는 경우에는 `useEffect`를 사용합니다.

**2. 클라이언트에서만 컴포넌트 렌더링**

레이아웃 측정이 반드시 필요한 컴포넌트라면 서버에서 렌더링하지 않고 클라이언트에서만 렌더링하도록 구성할 수 있습니다.

**3. 초기 화면에서 레이아웃 측정이 필요하지 않도록 설계**

CSS를 활용하여 서버에서 생성된 HTML만으로도 안정적인 초기 레이아웃을 제공할 수 있습니다.

서버 렌더링 환경에서는 `useLayoutEffect`가 실행되지 않는다는 점을 고려하여 초기 화면을 설계해야 합니다.

## 13. useLayoutEffect와 TypeScript

`useLayoutEffect`는 별도의 제네릭 타입을 지정하지 않아도 대부분의 상황에서 타입을 추론합니다.

DOM 요소에 접근하는 경우에는 `useRef`와 함께 구체적인 DOM 타입을 지정하는 것이 좋습니다.

### 13.1. DOM 요소 측정

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

function MeasureBox() {
  const boxRef = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    const element = boxRef.current;

    if (!element) {
      return;
    }

    setHeight(element.getBoundingClientRect().height);
  }, []);

  return (
    <div>
      <div ref={boxRef}>
        측정 대상
      </div>

      <p>{height}px</p>
    </div>
  );
}
```

`useRef<HTMLDivElement>(null)`을 사용하면 Ref가 `HTMLDivElement` 또는 `null`을 가질 수 있도록 타입이 지정됩니다.

따라서 DOM에 접근하기 전에 `null` 여부를 확인해야 합니다.

### 13.2. 측정값 타입 정의

측정 결과를 객체로 관리하는 경우 별도의 타입을 정의할 수 있습니다.

```tsx
type DOMRectSize = {
  width: number;
  height: number;
};

const [size, setSize] = useState<DOMRectSize>({
  width: 0,
  height: 0,
});
```

이러한 타입 정의는 DOM 측정 결과를 여러 컴포넌트에서 공유하거나 Custom Hook으로 추출할 때 유용합니다.

## 14. useLayoutEffect와 Custom Hook

DOM 측정 로직이 여러 컴포넌트에서 반복된다면 Custom Hook으로 분리할 수 있습니다.

예를 들어 특정 요소의 크기를 측정하는 기능을 다음과 같이 구현할 수 있습니다.

```tsx
import { useLayoutEffect, useRef, useState } from 'react';

type Size = {
  width: number;
  height: number;
};

function useElementSize() {
  const ref = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();

      setSize({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    ref,
    size,
  };
}
```

컴포넌트에서는 다음과 같이 사용할 수 있습니다.

```tsx
function ResponsiveBox() {
  const { ref, size } = useElementSize();

  return (
    <div>
      <div ref={ref}>
        크기 측정 대상
      </div>

      <p>
        {size.width} x {size.height}
      </p>
    </div>
  );
}
```

Custom Hook을 사용하면 DOM 측정과 Observer 관리 로직을 컴포넌트에서 분리할 수 있습니다.

단, 실제 프로젝트에서는 `ResizeObserver`의 지원 환경과 서버 렌더링 여부를 고려해야 합니다.

## 15. useLayoutEffect 사용 시 주의사항

### 15.1. 반드시 필요한 경우에만 사용합니다

`useLayoutEffect`는 브라우저의 Paint를 차단할 수 있습니다.

실행 시간이 길어질수록 화면 표시가 지연될 수 있으므로 일반적인 Effect에는 `useEffect`를 우선 사용해야 합니다.

### 15.2. Effect 내부에서 과도한 State 업데이트를 피합니다

`useLayoutEffect` 내부의 State 업데이트는 화면이 그려지기 전에 처리됩니다.

여러 번의 동기적인 업데이트가 발생하면 렌더링 성능이 저하될 수 있습니다.

### 15.3. DOM 읽기와 쓰기를 분리합니다

DOM 측정과 스타일 변경을 반복하면 Layout Thrashing이 발생할 수 있습니다.

가능하면 DOM 읽기 작업을 먼저 수행하고, 이후 변경 작업을 수행하는 구조로 작성해야 합니다.

### 15.4. SSR 환경을 고려합니다

서버에서는 `useLayoutEffect`가 실행되지 않습니다.

서버 렌더링이 필요한 컴포넌트에서는 초기 HTML만으로도 안정적인 화면을 제공할 수 있도록 설계해야 합니다.

### 15.5. Strict Mode를 고려합니다

개발 환경에서 Strict Mode가 활성화되면 Effect의 Setup과 Cleanup이 추가로 실행될 수 있습니다.

따라서 Cleanup을 올바르게 구현하고 Effect가 반복 실행되어도 문제가 발생하지 않도록 작성해야 합니다.

### 15.6. DOM 측정 API의 특성을 이해합니다

`getBoundingClientRect`, `offsetWidth`, `clientHeight` 등의 API는 상황에 따라 브라우저의 동기적인 Layout 계산을 유발할 수 있습니다.

DOM 측정 자체에도 비용이 발생할 수 있으므로 불필요한 측정을 줄여야 합니다.

## 16. useLayoutEffect 사용 원칙

`useLayoutEffect`를 효과적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **브라우저 Paint 이전에 작업해야 하는 경우에 사용합니다.** 화면이 그려지기 전에 DOM을 측정하거나 레이아웃을 보정해야 하는 경우에 적합합니다.
2. **일반적인 Effect에는 useEffect를 우선 사용합니다.** 데이터 요청, 구독, 외부 시스템 동기화 등은 대부분 `useEffect`로 처리할 수 있습니다.
3. **DOM 측정과 레이아웃 보정에 활용합니다.** Tooltip, Popover 등의 위치 계산과 요소 크기 측정에 사용할 수 있습니다.
4. **불필요한 State 업데이트를 피합니다.** Paint 이전의 동기적인 렌더링 과정이 길어지지 않도록 관리해야 합니다.
5. **DOM 읽기와 쓰기를 분리합니다.** Layout Thrashing을 방지하기 위해 DOM 측정과 변경 작업을 구분합니다.
6. **Cleanup을 올바르게 구현합니다.** Observer, 이벤트 리스너 등 외부 리소스를 Effect 종료 시 정리해야 합니다.
7. **서버 렌더링 환경을 고려합니다.** 서버에서는 Effect가 실행되지 않으므로 초기 화면을 별도로 설계해야 합니다.
8. **실제 성능 문제를 기준으로 선택합니다.** `useEffect` 사용 시 화면 깜빡임이나 잘못된 초기 레이아웃이 발생하는지 확인한 후 적용합니다.

## 참고 자료

### React 공식 문서

- [useLayoutEffect – React API Reference](https://react.dev/reference/react/useLayoutEffect)
- [useEffect – React API Reference](https://react.dev/reference/react/useEffect)
- [useRef – React API Reference](https://react.dev/reference/react/useRef)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [StrictMode – React API Reference](https://react.dev/reference/react/StrictMode)
- [Server React DOM APIs](https://react.dev/reference/react-dom/server)

### MDN 브라우저 API 및 렌더링 참고 자료

- [Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)
- [HTMLElement.offsetWidth](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth)
- [Element.clientWidth](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth)
- [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [Rendering performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Rendering_performance)
- [Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path)

### 관련 라이브러리

- [Floating UI](https://floating-ui.com/) – Tooltip, Popover 등의 요소 위치 계산을 위한 라이브러리