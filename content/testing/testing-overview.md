# Testing Overview

## 1. 개요

React 애플리케이션의 테스트(Testing)는 컴포넌트와 애플리케이션이 의도한 대로 동작하는지 검증하고, 코드 변경으로 인해 기존 기능이 손상되는 회귀(Regression)를 방지하는 개발 활동입니다.

React는 컴포넌트 기반으로 UI를 구성하므로 각 컴포넌트의 렌더링 결과, 사용자 상호작용, 상태 변경 및 컴포넌트 간의 데이터 흐름을 검증하는 것이 중요합니다.

테스트는 단순히 코드가 오류 없이 실행되는지 확인하는 것을 넘어, 실제 사용자가 애플리케이션을 이용하는 과정에서 기대한 결과를 얻을 수 있는지 검증하는 데 목적이 있습니다.

React 애플리케이션의 테스트는 일반적으로 다음 영역을 포함합니다.

- **Component Testing:** 개별 컴포넌트의 렌더링과 동작을 검증합니다.
- **Unit Testing:** 독립적인 함수나 로직이 예상한 결과를 반환하는지 검증합니다.
- **Integration Testing:** 여러 컴포넌트와 모듈이 결합된 상태에서 정상적으로 동작하는지 검증합니다.
- **End-to-End Testing:** 실제 브라우저 환경에서 애플리케이션의 전체 사용자 흐름을 검증합니다.

테스트 전략은 애플리케이션의 구조와 복잡도, 기능의 중요도 및 실행 환경에 따라 적절하게 구성해야 합니다.

## 2. 테스트의 목적

### 2.1. 기능의 정확성 검증

컴포넌트와 애플리케이션이 요구사항에 맞게 동작하는지 확인합니다.

예를 들어 버튼을 클릭하면 상태가 변경되고, 변경된 상태가 UI에 올바르게 반영되는지 검증할 수 있습니다.

```tsx
import { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

function Counter({ initialCount = 0 }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
```

위 컴포넌트는 다음과 같은 동작을 검증할 수 있습니다.

- 초기 상태가 올바르게 렌더링되는지 확인합니다.
- 버튼 클릭 시 상태가 증가하는지 확인합니다.
- 변경된 상태가 화면에 반영되는지 확인합니다.

### 2.2. 회귀 방지

회귀(Regression)는 기존에 정상적으로 동작하던 기능이 새로운 코드 변경으로 인해 정상적으로 동작하지 않게 되는 현상입니다.

테스트를 작성하면 기능 추가, 버그 수정 및 리팩터링 이후에도 기존 동작이 유지되는지 자동으로 확인할 수 있습니다.

특히 여러 컴포넌트가 상태와 데이터를 공유하는 애플리케이션에서는 한 영역의 변경이 다른 영역에 영향을 미칠 수 있으므로 회귀 테스트가 중요합니다.

### 2.3. 리팩터링 안정성 확보

테스트는 구현 방식과 외부에서 관찰할 수 있는 동작을 분리하여 검증하는 데 도움을 줍니다.

컴포넌트 내부의 상태 관리 방식이나 함수 구현을 변경하더라도 사용자가 관찰하는 결과가 동일하다면 기존 테스트가 유지될 수 있어야 합니다.

이를 위해 내부 구현 세부사항(Implementation Details)보다 사용자에게 노출되는 동작과 결과를 중심으로 테스트를 작성하는 것이 좋습니다.

### 2.4. 문서화 및 설계 명확성

테스트 코드는 컴포넌트가 어떤 입력을 받고 어떤 결과를 제공해야 하는지 보여주는 실행 가능한 명세(Executable Specification) 역할을 수행할 수 있습니다.

Props에 따른 렌더링 결과, 사용자 입력에 대한 반응, 예외 상황 등을 테스트로 표현하면 컴포넌트의 기대 동작을 명확하게 전달할 수 있습니다.

## 3. 테스트의 종류

React 애플리케이션에서는 검증 대상과 테스트 범위에 따라 여러 종류의 테스트를 활용합니다.

### 3.1. Unit Testing

단위 테스트(Unit Testing)는 독립적인 함수나 로직의 동작을 검증하는 테스트입니다.

React 애플리케이션에서는 다음과 같은 대상을 검증할 수 있습니다.

- 데이터 변환 함수
- 유효성 검사 함수
- 날짜 및 숫자 계산 함수
- 상태 업데이트를 위한 순수 함수
- 비즈니스 로직

예를 들어 다음 함수는 입력값에 따라 계산 결과를 반환하는 독립적인 로직입니다.

```tsx
function calculateTotal(
  price: number,
  quantity: number,
): number {
  return price * quantity;
}
```

테스트에서는 다양한 입력값에 대한 반환 결과를 검증합니다.

```tsx
import { describe, expect, it } from 'vitest';

describe('calculateTotal', () => {
  it('calculates the total price', () => {
    expect(calculateTotal(1000, 3)).toBe(3000);
  });

  it('returns zero when quantity is zero', () => {
    expect(calculateTotal(1000, 0)).toBe(0);
  });
});
```

단위 테스트는 실행 속도가 빠르고 실패 원인을 특정하기 쉽다는 장점이 있습니다.

### 3.2. Component Testing

컴포넌트 테스트(Component Testing)는 개별 React 컴포넌트가 올바르게 렌더링되고 동작하는지 검증합니다.

주요 검증 대상은 다음과 같습니다.

- Props에 따른 렌더링 결과
- 초기 상태 및 상태 변경
- 사용자 이벤트 처리
- 조건부 렌더링
- 사용자 입력 및 폼 처리
- 비동기 데이터 처리

React Testing Library를 사용하면 실제 DOM에 렌더링된 컴포넌트를 대상으로 테스트를 작성할 수 있습니다.

```tsx
import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}</h1>;
}

it('renders the greeting message', () => {
  render(<Greeting name="React" />);

  expect(
    screen.getByRole('heading', {
      name: 'Hello, React',
    }),
  ).toBeInTheDocument();
});
```

위 테스트는 컴포넌트 인스턴스나 내부 구현에 접근하지 않고 실제 DOM에 표시되는 결과를 검증합니다.

### 3.3. Integration Testing

통합 테스트(Integration Testing)는 여러 컴포넌트나 모듈이 결합된 상태에서 서로 올바르게 동작하는지 검증합니다.

React 애플리케이션에서는 다음과 같은 상황을 검증할 수 있습니다.

- 부모 컴포넌트와 자식 컴포넌트 간의 Props 전달
- Context Provider를 통한 상태 공유
- 폼 입력과 제출 처리의 연계
- API 요청 결과와 UI 업데이트
- React Router를 통한 페이지 이동
- 여러 컴포넌트가 참여하는 사용자 상호작용

예를 들어 로그인 폼을 테스트한다면 다음 흐름을 하나의 테스트 시나리오로 구성할 수 있습니다.

1. 사용자가 이메일과 비밀번호를 입력합니다.
2. 로그인 버튼을 클릭합니다.
3. 입력값이 제출 핸들러로 전달됩니다.
4. 인증 결과에 따라 UI가 변경됩니다.

통합 테스트는 개별 단위 테스트에서는 확인하기 어려운 컴포넌트 간의 상호작용과 데이터 흐름을 검증하는 데 유용합니다.

### 3.4. End-to-End Testing

E2E 테스트(End-to-End Testing)는 실제 브라우저 환경에서 애플리케이션의 전체 사용자 흐름을 검증합니다.

단위 테스트나 컴포넌트 테스트와 달리 브라우저, 페이지 이동, 사용자 입력 및 네트워크 요청 등 실제 서비스 환경에 가까운 조건을 대상으로 합니다.

대표적인 검증 대상은 다음과 같습니다.

- 회원가입 및 로그인
- 상품 검색 및 구매
- 데이터 생성 및 수정
- 페이지 이동 및 라우팅
- 사용자 인증 및 권한 처리
- 주요 비즈니스 워크플로

Playwright와 같은 브라우저 자동화 도구를 사용하면 실제 브라우저에서 사용자 동작을 재현하고 결과를 검증할 수 있습니다.

```tsx
import { expect, test } from '@playwright/test';

test('user can navigate to the login page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', {
    name: 'Login',
  }).click();

  await expect(page).toHaveURL(/login/);

  await expect(
    page.getByRole('heading', {
      name: 'Login',
    }),
  ).toBeVisible();
});
```

E2E 테스트는 실제 사용자 경험에 가까운 검증이 가능하지만, 실행 시간이 길고 환경 구성 및 유지보수 비용이 상대적으로 높습니다.

## 4. 테스트 범위 비교

테스트 유형별 특징은 다음과 같습니다.

| 구분 | Unit Testing | Component Testing | Integration Testing | E2E Testing |
|---|---|---|---|---|
| 검증 대상 | 독립적인 로직 | 개별 컴포넌트 | 여러 모듈의 결합 | 전체 사용자 흐름 |
| 실행 환경 | Node.js 등 | DOM 시뮬레이션 또는 브라우저 | DOM 시뮬레이션 또는 브라우저 | 실제 브라우저 |
| 실행 속도 | 빠름 | 빠름 | 상대적으로 느림 | 상대적으로 느림 |
| 검증 범위 | 좁음 | 컴포넌트 중심 | 여러 컴포넌트 | 전체 애플리케이션 |
| 유지보수 비용 | 낮음 | 낮음~중간 | 중간 | 상대적으로 높음 |

Unit Testing, Component Testing, Integration Testing 및 E2E Testing은 서로 대체하는 관계가 아니라 상호 보완적인 관계입니다.

프로젝트의 특성에 따라 테스트 범위를 적절히 조합해야 합니다.

## 5. React 테스트 도구

React 테스트 환경은 테스트 실행 도구, DOM 테스트 도구 및 브라우저 자동화 도구 등을 조합하여 구성합니다.

### 5.1. Vitest

Vitest는 Vite 기반의 테스트 프레임워크입니다.

테스트 실행, Assertion, Mocking, Code Coverage 및 테스트 환경 설정 등을 지원합니다.

주요 기능은 다음과 같습니다.

- 테스트 케이스 및 테스트 그룹 관리
- Assertion을 통한 결과 검증
- 함수 및 모듈 Mocking
- 테스트 실행 및 Watch Mode
- Code Coverage 측정
- TypeScript 및 Vite 설정과의 연계

React 프로젝트에서는 단위 테스트와 컴포넌트 테스트를 실행하는 용도로 활용할 수 있습니다.

### 5.2. Jest

Jest는 JavaScript 및 TypeScript 프로젝트에서 널리 사용되는 테스트 프레임워크입니다.

주요 기능은 다음과 같습니다.

- 테스트 실행 및 Assertion
- Mock Function 및 Module Mocking
- Timer Mocking
- Snapshot Testing
- Code Coverage 측정

Vitest와 Jest는 유사한 테스트 작성 방식을 제공하지만 실행 환경과 설정 방식에는 차이가 있습니다.

프로젝트의 빌드 도구, 기존 테스트 환경 및 팀의 기술 스택을 고려하여 선택하는 것이 좋습니다.

### 5.3. React Testing Library

React Testing Library(RTL)는 React 컴포넌트를 사용자 관점에서 테스트할 수 있도록 지원하는 라이브러리입니다.

컴포넌트 인스턴스나 내부 상태에 직접 접근하기보다는 렌더링된 DOM을 대상으로 테스트를 작성하도록 설계되었습니다.

주요 API는 다음과 같습니다.

| API | 역할 |
|---|---|
| `render` | React 컴포넌트를 DOM에 렌더링합니다. |
| `screen` | 렌더링된 DOM에서 요소를 조회합니다. |
| `within` | 특정 DOM 영역을 기준으로 요소를 조회합니다. |
| `waitFor` | 조건이 만족될 때까지 비동기적으로 대기합니다. |
| `fireEvent` | DOM 이벤트를 발생시킵니다. |
| `cleanup` | 테스트에 사용된 DOM을 정리합니다. |

RTL은 테스트 실행 프레임워크가 아닙니다. Vitest 또는 Jest와 함께 사용하여 React 컴포넌트의 동작을 검증합니다.

### 5.4. User Event

`@testing-library/user-event`는 실제 사용자의 상호작용에 가까운 방식으로 DOM 이벤트를 시뮬레이션하는 라이브러리입니다.

대표적인 기능은 다음과 같습니다.

- 클릭 및 더블 클릭
- 텍스트 입력
- 키보드 입력
- 포커스 이동
- 체크박스 및 라디오 버튼 조작
- 폼 요소 상호작용

`fireEvent`가 개별 DOM 이벤트를 직접 발생시키는 방식이라면, `user-event`는 실제 사용자 동작에서 발생하는 여러 이벤트를 고려하여 상호작용을 재현합니다.

따라서 일반적인 사용자 상호작용 테스트에서는 `user-event`를 우선적으로 사용하는 것이 좋습니다.

### 5.5. Playwright

Playwright는 실제 브라우저를 자동화하여 웹 애플리케이션을 테스트하는 프레임워크입니다.

Chromium, Firefox, WebKit 기반 브라우저를 지원하며 실제 브라우저 환경에서 사용자 동작과 화면 결과를 검증할 수 있습니다.

주요 기능은 다음과 같습니다.

- 브라우저 자동화
- 사용자 상호작용 시뮬레이션
- 페이지 이동 및 URL 검증
- 비동기 Assertion 및 자동 대기
- 브라우저별 테스트 실행
- 테스트 격리 및 병렬 실행
- Trace 및 테스트 리포트

React 애플리케이션에서는 주로 E2E 테스트에 활용하며, 지원되는 Component Testing 기능을 활용하여 브라우저 기반 컴포넌트 테스트를 구성할 수도 있습니다.

## 6. 테스트 환경 구성

React + TypeScript 프로젝트에서는 테스트 실행 환경과 브라우저 환경을 구분하여 구성해야 합니다.

### 6.1. Node.js 환경

Node.js 환경은 DOM이 필요하지 않은 독립적인 로직을 테스트할 때 적합합니다.

예를 들어 다음과 같은 코드를 검증할 수 있습니다.

- 데이터 변환 함수
- 유틸리티 함수
- 비즈니스 로직
- 순수 함수
- 타입과 무관한 계산 로직

Vitest에서는 기본적으로 `node` 환경을 사용할 수 있습니다.

### 6.2. DOM 시뮬레이션 환경

React 컴포넌트는 DOM API를 사용하므로 컴포넌트 테스트에는 DOM 환경이 필요합니다.

대표적으로 다음 환경을 사용할 수 있습니다.

- **jsdom:** JavaScript 기반으로 브라우저 DOM 및 관련 API를 시뮬레이션합니다.
- **happy-dom:** DOM API를 제공하는 경량 브라우저 환경 시뮬레이터입니다.

이러한 환경은 실제 브라우저를 실행하지 않고도 컴포넌트 렌더링과 기본적인 사용자 상호작용을 검증할 수 있도록 지원합니다.

다만 실제 브라우저의 레이아웃 엔진, CSS 렌더링 및 모든 브라우저 동작을 완전히 재현하지는 않습니다.

따라서 실제 레이아웃이나 브라우저별 동작이 중요한 기능은 브라우저 기반 테스트로 검증해야 합니다.

### 6.3. 실제 브라우저 환경

실제 브라우저 환경은 브라우저의 렌더링 및 사용자 상호작용을 포함한 전체 동작을 검증하는 데 사용됩니다.

다음과 같은 기능은 실제 브라우저 환경에서 검증하는 것이 적합합니다.

- CSS 레이아웃 및 반응형 UI
- 실제 브라우저 이벤트 처리
- 페이지 이동 및 라우팅
- 쿠키 및 세션 처리
- 파일 업로드 및 다운로드
- 브라우저별 호환성

Playwright는 실제 브라우저를 실행하여 이러한 동작을 검증할 수 있습니다.

## 7. 테스트 작성 원칙

유지보수하기 쉬운 테스트를 작성하기 위해 다음 원칙을 적용하는 것이 좋습니다.

### 7.1. 사용자 관점에서 테스트 작성

테스트는 컴포넌트 내부의 구현 방식보다 사용자가 실제로 경험하는 동작을 중심으로 작성해야 합니다.

예를 들어 버튼 클릭으로 상태가 변경되는 컴포넌트라면 내부 `useState` 값을 직접 확인하기보다는 버튼 클릭 이후 화면에 표시되는 결과를 검증하는 것이 좋습니다.

### 7.2. 접근성 기반 요소 조회

RTL에서는 접근성 정보를 기반으로 DOM 요소를 조회하는 방식을 권장합니다.

일반적으로 다음 순서로 요소 조회 방법을 고려할 수 있습니다.

1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByDisplayValue`
6. `getByTestId`

특히 `getByRole`과 `getByLabelText`는 사용자가 접근성 트리에서 요소를 인식하는 방식과 유사하므로 우선적으로 사용하는 것이 좋습니다.

`data-testid`는 접근 가능한 역할이나 텍스트만으로 요소를 식별하기 어려운 경우에 제한적으로 사용합니다.

### 7.3. 구현 세부사항 검증 지양

다음과 같은 항목을 직접 검증하는 테스트는 구현 변경에 취약할 수 있습니다.

- 컴포넌트 내부 State
- 내부 함수의 호출 순서
- React 컴포넌트의 내부 인스턴스
- 특정 Hook의 호출 횟수
- 구현에만 사용되는 CSS Class

다만 외부 시스템과의 통신이나 중요한 부수 효과를 검증하기 위해 함수 호출 여부를 확인하는 것은 적절할 수 있습니다.

중요한 것은 테스트의 목적과 관련이 없는 내부 구현에 과도하게 의존하지 않는 것입니다.

### 7.4. 테스트 간 독립성 유지

각 테스트는 다른 테스트의 실행 결과에 영향을 받지 않도록 독립적으로 작성해야 합니다.

테스트 간 상태 공유나 실행 순서에 대한 의존성이 존재하면 특정 테스트만 실행할 때는 성공하지만 전체 테스트를 실행할 때 실패하는 문제가 발생할 수 있습니다.

이를 방지하기 위해 다음 사항을 고려해야 합니다.

- 테스트 전후 상태 초기화
- Mock 및 Spy 초기화
- 테스트 데이터 독립성 유지
- DOM 정리
- 외부 시스템 의존성 격리

### 7.5. 비동기 동작 고려

React 애플리케이션에서는 API 요청, 비동기 상태 업데이트 및 Effect 등으로 인해 UI가 비동기적으로 변경될 수 있습니다.

이러한 동작을 테스트할 때는 실제 상태 변경이 완료된 이후 결과를 검증해야 합니다.

RTL에서는 다음 API를 활용할 수 있습니다.

- `findBy*`: 특정 DOM 요소가 나타날 때까지 비동기적으로 대기합니다.
- `waitFor`: 특정 Assertion이 성공할 때까지 재시도합니다.
- `act`: React 업데이트가 테스트 환경에서 적절하게 처리되도록 지원합니다.

특히 비동기 테스트에서는 임의의 시간 지연을 사용하는 것보다 실제로 기대하는 DOM 상태를 기준으로 대기하는 것이 안정적입니다.

### 7.6. Mocking 최소화

Mocking은 테스트 대상이 외부 시스템이나 다른 모듈에 의존하는 경우 해당 의존성을 대체하여 테스트를 독립적으로 실행할 수 있도록 지원합니다.

대표적인 Mocking 대상은 다음과 같습니다.

- API 요청
- 외부 서비스
- 브라우저 API
- 타이머
- 특정 모듈의 함수

그러나 Mocking을 과도하게 사용하면 실제 시스템과 테스트 환경 사이에 차이가 발생할 수 있습니다.

따라서 테스트 대상의 핵심 동작은 가능한 한 실제 구현을 사용하고, 외부 의존성에 대해서만 필요한 범위에서 Mocking을 적용하는 것이 좋습니다.

## 8. 테스트 피라미드

테스트 피라미드(Test Pyramid)는 테스트의 실행 비용과 검증 범위를 고려하여 테스트 유형별 비중을 구성하는 개념입니다.

일반적으로 실행 속도가 빠르고 범위가 작은 테스트를 많이 작성하고, 실행 비용이 높고 범위가 넓은 테스트는 핵심 기능을 중심으로 구성합니다.

```text
                 /\
                /  \
               / E2E \
              /------\
             /        \
            /Integration\
           /------------\
          /              \
         / Unit & Component\
        /------------------\
```

각 계층의 특징은 다음과 같습니다.

| 계층 | 특징 | 일반적인 비중 |
|---|---|---|
| Unit / Component | 빠른 실행과 세밀한 검증 | 높음 |
| Integration | 모듈 간 상호작용 검증 | 중간 |
| E2E | 핵심 사용자 흐름 검증 | 낮음 |

테스트 피라미드는 모든 프로젝트에 동일한 테스트 비율을 강제하는 규칙이 아닙니다.

애플리케이션의 복잡도, 위험도 및 테스트 환경에 따라 적절한 테스트 구성을 결정하기 위한 가이드로 활용해야 합니다.

## 9. Code Coverage

코드 커버리지(Code Coverage)는 테스트가 실제 소스 코드의 어느 정도를 실행했는지 측정하는 지표입니다.

대표적인 커버리지 지표는 다음과 같습니다.

| 지표 | 설명 |
|---|---|
| Statement Coverage | 실행된 코드 구문의 비율 |
| Branch Coverage | 실행된 조건 분기의 비율 |
| Function Coverage | 호출된 함수의 비율 |
| Line Coverage | 실행된 코드 라인의 비율 |

예를 들어 조건문에 여러 분기가 존재하는 경우 특정 조건만 테스트하면 Statement Coverage가 높더라도 Branch Coverage는 낮을 수 있습니다.

커버리지는 테스트가 코드를 얼마나 실행했는지 보여주는 지표이지, 테스트의 품질이나 기능의 정확성을 직접 보장하는 지표는 아닙니다.

따라서 커버리지 수치만 높이는 것보다 중요한 기능과 예외 상황을 적절하게 검증하는 것이 중요합니다.

## 10. CI 환경에서의 테스트

테스트는 로컬 개발 환경에서만 실행하는 것이 아니라 CI(Continuous Integration) 파이프라인에도 통합하는 것이 좋습니다.

코드 변경이 발생하면 자동으로 테스트를 실행하여 기존 기능의 손상 여부를 확인할 수 있습니다.

일반적인 CI 테스트 흐름은 다음과 같습니다.

```text
Code Push
    |
    v
Install Dependencies
    |
    v
Type Checking
    |
    v
Linting
    |
    v
Unit / Component Tests
    |
    v
Integration Tests
    |
    v
E2E Tests
    |
    v
Build
    |
    v
Deployment
```

각 단계는 프로젝트의 요구사항에 따라 병렬 실행하거나 순서를 조정할 수 있습니다.

CI에 테스트를 통합하면 다음과 같은 이점이 있습니다.

- 코드 변경에 따른 회귀를 조기에 발견합니다.
- 개발자 간 코드 품질을 일정하게 유지합니다.
- 배포 전에 주요 기능의 정상 동작을 확인합니다.
- 반복적인 수동 테스트 비용을 줄입니다.

## 11. 정리

React 애플리케이션의 테스트는 컴포넌트의 렌더링 결과와 사용자 상호작용부터 전체 애플리케이션의 사용자 흐름까지 다양한 범위에서 수행됩니다.

테스트 유형과 도구는 다음과 같이 구분할 수 있습니다.

| 목적 | 주요 도구 |
|---|---|
| 단위 테스트 실행 | Vitest, Jest |
| React 컴포넌트 테스트 | React Testing Library |
| 사용자 상호작용 테스트 | user-event |
| DOM 환경 구성 | jsdom, happy-dom |
| 브라우저 기반 E2E 테스트 | Playwright |

효과적인 테스트 전략을 위해서는 다음 사항을 고려해야 합니다.

- 사용자에게 노출되는 동작을 중심으로 테스트를 작성합니다.
- 테스트 대상과 검증 범위를 명확하게 구분합니다.
- 테스트 간 독립성을 유지합니다.
- 비동기 동작과 외부 의존성을 적절하게 처리합니다.
- 테스트 피라미드를 참고하여 실행 비용과 검증 범위의 균형을 유지합니다.
- Code Coverage를 참고하되 테스트 품질을 커버리지 수치만으로 판단하지 않습니다.
- CI 파이프라인에 테스트를 통합하여 지속적으로 검증합니다.

테스트의 핵심 목적은 테스트 코드 자체를 늘리는 것이 아니라, 애플리케이션의 동작에 대한 신뢰도를 높이고 안전한 코드 변경을 가능하게 하는 것입니다.

## 12. 참고 자료

### React

- [React 공식 문서 - Testing](https://legacy.reactjs.org/docs/testing.html)
- [React 공식 문서 - Testing Environments](https://legacy.reactjs.org/docs/testing-environments.html)

### Testing Library

- [Testing Library - Introduction](https://testing-library.com/docs/)
- [React Testing Library - Introduction](https://testing-library.com/docs/react-testing-library/intro/)
- [React Testing Library - API](https://testing-library.com/docs/react-testing-library/api/)
- [User Event - Introduction](https://testing-library.com/docs/user-event/intro/)

### Test Frameworks

- [Vitest - Guide](https://vitest.dev/guide/)
- [Vitest - Test Environment](https://vitest.dev/guide/environment.html)
- [Jest - Documentation](https://jestjs.io/docs/getting-started)

### E2E Testing

- [Playwright - Introduction](https://playwright.dev/docs/intro)
- [Playwright - Writing Tests](https://playwright.dev/docs/writing-tests)
- [Playwright - Best Practices](https://playwright.dev/docs/best-practices)