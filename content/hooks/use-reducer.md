# useReducer

## 1. useReducer란?

`useReducer`는 컴포넌트의 상태(State)와 상태 변경 로직을 Reducer 함수로 관리하는 React Hook입니다.

일반적으로 단일 상태를 간단하게 관리할 때는 `useState`를 사용하지만, 여러 상태가 서로 연관되어 있거나 상태 변경 로직이 복잡한 경우에는 `useReducer`를 활용할 수 있습니다.

`useReducer`는 현재 상태와 Action을 Reducer 함수에 전달하고, Reducer가 반환한 새로운 상태를 다음 렌더링에 반영합니다.

기본 구조는 다음과 같습니다.

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

- `state`: 현재 상태입니다.
- `dispatch`: 상태 변경을 요청하는 함수입니다.
- `reducer`: 현재 상태와 Action을 받아 새로운 상태를 반환하는 함수입니다.
- `initialState`: 초기 상태입니다.

`useReducer`의 핵심은 상태 변경을 직접 수행하는 대신 Action을 전달하고, Reducer가 해당 Action에 따라 다음 상태를 결정하도록 하는 것입니다.

## 2. 기본 문법

```tsx
const [state, dispatch] = useReducer(reducer, initialState);
```

Reducer 함수는 일반적으로 다음과 같은 형태로 작성합니다.

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
      };

    case 'decrement':
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}
```

Reducer는 현재 상태와 Action을 입력받아 새로운 상태를 반환합니다.

```tsx
function reducer(state, action) {
  // 현재 상태와 Action을 기반으로
  // 새로운 상태를 계산합니다.

  return nextState;
}
```

Reducer는 순수 함수(Pure Function)여야 합니다.

동일한 상태와 동일한 Action이 전달되면 항상 동일한 결과를 반환해야 하며, 전달받은 기존 상태를 직접 변경해서는 안 됩니다.

## 3. 기본 사용 예제

다음은 `useReducer`를 사용하여 Counter를 구현한 예제입니다.

```tsx
import { useReducer } from 'react';

type State = {
  count: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

const initialState: State = {
  count: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
      };

    case 'decrement':
      return {
        count: state.count - 1,
      };

    case 'reset':
      return initialState;

    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>{state.count}</h1>

      <button onClick={() => dispatch({ type: 'increment' })}>
        증가
      </button>

      <button onClick={() => dispatch({ type: 'decrement' })}>
        감소
      </button>

      <button onClick={() => dispatch({ type: 'reset' })}>
        초기화
      </button>
    </div>
  );
}

export default Counter;
```

위 예제의 상태 변경 과정은 다음과 같습니다.

1. 사용자가 증가 버튼을 클릭합니다.
2. `dispatch({ type: 'increment' })`가 호출됩니다.
3. React가 현재 상태와 Action을 Reducer에 전달합니다.
4. Reducer가 새로운 상태를 계산하여 반환합니다.
5. React가 새로운 상태를 반영하고 컴포넌트를 다시 렌더링합니다.

이러한 구조에서는 컴포넌트가 상태 변경의 구체적인 계산 방식을 알 필요가 없습니다.

컴포넌트는 어떤 Action을 발생시킬지만 결정하고, 실제 상태 변경 규칙은 Reducer가 담당합니다.

## 4. Reducer와 Action

`useReducer`를 이해하기 위해서는 Reducer와 Action의 역할을 구분해야 합니다.

### 4.1. Reducer

Reducer는 현재 상태와 Action을 전달받아 다음 상태를 계산하는 함수입니다.

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

Reducer의 주요 책임은 다음과 같습니다.

- 현재 상태를 기반으로 다음 상태 계산
- Action 유형에 따른 상태 변경 규칙 정의
- 기존 상태를 변경하지 않고 새로운 상태 반환
- 동일한 입력에 대해 동일한 결과 반환

Reducer는 상태 변경 규칙을 중앙에서 관리하는 역할을 수행합니다.

### 4.2. Action

Action은 상태를 어떻게 변경할 것인지 설명하는 객체입니다.

일반적으로 `type` 속성을 사용하여 Action의 종류를 구분합니다.

```tsx
dispatch({
  type: 'increment',
});
```

추가 데이터가 필요한 경우에는 Payload를 함께 전달할 수 있습니다.

```tsx
dispatch({
  type: 'set-count',
  payload: 10,
});
```

Reducer에서는 Action의 유형과 Payload를 확인하여 새로운 상태를 계산합니다.

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'set-count':
      return {
        ...state,
        count: action.payload,
      };

    default:
      return state;
  }
}
```

Action은 일반적으로 다음과 같은 구조로 구성됩니다.

```tsx
{
  type: 'set-count',
  payload: 10,
}
```

- `type`: 수행할 상태 변경 작업의 종류입니다.
- `payload`: 상태 변경에 필요한 데이터입니다.

Action은 상태 변경을 직접 수행하지 않습니다. 상태 변경을 설명하고 요청하는 역할을 담당합니다.

### 4.3. Dispatch

`dispatch`는 Action을 React에 전달하는 함수입니다.

```tsx
dispatch({
  type: 'increment',
});
```

`dispatch`가 호출되면 React는 Action을 Reducer에 전달하고, Reducer가 반환한 상태를 다음 렌더링에 반영합니다.

`dispatch` 함수는 렌더링 사이에 안정적인 참조를 유지합니다.

따라서 일반적으로 다른 Hook의 의존성 배열에 포함하지 않아도 됩니다.

## 5. 여러 상태를 함께 관리하기

`useReducer`는 여러 상태가 서로 연관되어 있는 경우에 유용합니다.

예를 들어 사용자 로그인 기능에서는 로그인 여부, 사용자 정보, 로딩 상태, 오류 메시지 등을 함께 관리할 수 있습니다.

```tsx
import { useReducer } from 'react';

type User = {
  id: number;
  name: string;
};

type State = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'login-start' }
  | { type: 'login-success'; payload: User }
  | { type: 'login-failure'; payload: string }
  | { type: 'logout' };

const initialState: State = {
  user: null,
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login-start':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'login-success':
      return {
        user: action.payload,
        loading: false,
        error: null,
      };

    case 'login-failure':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case 'logout':
      return initialState;

    default:
      return state;
  }
}

function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      {state.loading && <p>로그인 중입니다.</p>}

      {state.error && <p>{state.error}</p>}

      {state.user ? (
        <>
          <p>{state.user.name}님 환영합니다.</p>

          <button onClick={() => dispatch({ type: 'logout' })}>
            로그아웃
          </button>
        </>
      ) : (
        <button onClick={() => dispatch({ type: 'login-start' })}>
          로그인
        </button>
      )}
    </div>
  );
}
```

여러 상태를 하나의 객체로 관리하면 상태 변경 시 관련 상태를 함께 갱신할 수 있습니다.

예를 들어 로그인 성공 시 사용자 정보, 로딩 상태, 오류 메시지를 하나의 Action으로 일관되게 변경할 수 있습니다.

이러한 방식은 상태 간의 관계와 전이 규칙을 명확하게 표현하는 데 도움이 됩니다.

## 6. useReducer와 불변성

React 상태는 불변성(Immutability)을 유지하는 방식으로 관리해야 합니다.

Reducer에서도 기존 상태를 직접 변경하지 않고 새로운 객체를 반환해야 합니다.

### 6.1. 잘못된 상태 변경

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      state.count += 1;

      return state;

    default:
      return state;
  }
}
```

위 예제는 기존 상태 객체를 직접 변경하고 동일한 참조를 반환합니다.

React는 이전 상태와 다음 상태의 참조가 동일한 경우 업데이트를 생략할 수 있으므로, 예상하지 못한 렌더링 문제가 발생할 수 있습니다.

또한 기존 상태를 직접 변경하면 상태 변경 이력을 추적하거나 디버깅하기 어려워집니다.

### 6.2. 올바른 상태 변경

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    default:
      return state;
  }
}
```

Spread 문법을 사용하여 기존 상태를 복사하고 변경할 속성을 새로운 값으로 설정합니다.

중첩된 객체를 변경하는 경우에도 변경이 필요한 경로의 객체를 새롭게 생성해야 합니다.

```tsx
type State = {
  user: {
    name: string;
    profile: {
      age: number;
    };
  };
};

function reducer(state: State, action: { type: string; payload?: number }): State {
  switch (action.type) {
    case 'update-age':
      return {
        ...state,
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            age: action.payload ?? state.user.profile.age,
          },
        },
      };

    default:
      return state;
  }
}
```

상태의 중첩 깊이가 깊어질수록 불변성을 유지하기 위한 코드가 복잡해질 수 있습니다.

이러한 경우 상태 구조를 단순화하거나 별도의 불변성 관리 도구를 고려할 수 있습니다.

## 7. 초기 상태 관리

`useReducer`는 초기 상태를 전달받아 상태를 초기화합니다.

기본적으로 두 번째 인자로 초기 상태를 전달합니다.

```tsx
const initialState = {
  count: 0,
};

const [state, dispatch] = useReducer(reducer, initialState);
```

초기 상태를 계산하는 과정이 복잡하거나 비용이 큰 경우에는 세 번째 인자인 Initializer 함수를 사용할 수 있습니다.

### 7.1. Lazy Initialization

```tsx
function createInitialState(initialCount: number) {
  return {
    count: initialCount,
  };
}

function Counter({ initialCount }: { initialCount: number }) {
  const [state, dispatch] = useReducer(
    reducer,
    initialCount,
    createInitialState,
  );

  return <h1>{state.count}</h1>;
}
```

세 번째 인자로 전달한 함수는 최초 초기 상태를 계산하는 데 사용됩니다.

동작 구조는 다음과 같습니다.

```tsx
useReducer(reducer, initialArg, init);
```

- `reducer`: 상태 변경 함수입니다.
- `initialArg`: 초기 상태 계산에 사용할 인자입니다.
- `init`: 초기 상태를 계산하는 함수입니다.

React는 최초 렌더링에서 `init(initialArg)`를 실행하여 초기 상태를 생성합니다.

이후 렌더링에서는 초기 상태를 다시 계산하지 않습니다.

### 7.2. Lazy Initialization이 필요한 경우

초기 상태를 계산하는 과정에서 다음과 같은 작업이 필요할 수 있습니다.

- Local Storage에서 초기 데이터 읽기
- 복잡한 데이터 구조 생성
- 초기 Props를 기반으로 상태 객체 구성
- 초기 상태 계산에 필요한 변환 작업

이러한 초기화 작업이 비용이 큰 경우 Lazy Initialization을 활용하면 불필요한 계산을 줄일 수 있습니다.

다만 Initializer 함수는 순수 함수여야 합니다. Strict Mode에서는 개발 환경에서 순수성 검증을 위해 초기화 함수가 추가로 호출될 수 있습니다.

Local Storage 읽기와 같은 초기화 작업은 읽기 자체가 상태를 변경하지 않도록 설계하고, 서버 렌더링 환경에서는 브라우저 전용 API 사용에 주의해야 합니다.

## 8. useReducer와 useState 비교

`useState`와 `useReducer`는 모두 컴포넌트의 상태를 관리하는 Hook입니다.

두 Hook의 차이는 상태 변경 로직을 구성하는 방식에 있습니다.

### 8.1. useState

`useState`는 상태와 상태 변경 함수를 직접 관리합니다.

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

상태 변경 로직이 단순한 경우 코드가 간결하고 직관적입니다.

### 8.2. useReducer

`useReducer`는 상태 변경 규칙을 Reducer 함수로 분리합니다.

```tsx
function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
  });

  return (
    <button onClick={() => dispatch({ type: 'increment' })}>
      {state.count}
    </button>
  );
}
```

컴포넌트에서는 Action을 전달하고, Reducer에서 상태 변경 규칙을 관리합니다.

### 8.3. 비교

| 구분 | useState | useReducer |
| --- | --- | --- |
| 상태 변경 방식 | Setter 함수 호출 | Dispatch로 Action 전달 |
| 상태 변경 로직 | 컴포넌트에 직접 작성하는 경우가 많음 | Reducer 함수로 분리 |
| 적합한 상황 | 단순한 상태 관리 | 복잡하거나 연관된 상태 관리 |
| 코드 구조 | 간결하고 직관적 | 상태 변경 규칙을 중앙에서 관리 |
| 테스트 | 컴포넌트 및 상태 변경 로직 중심 | Reducer를 독립적으로 테스트 가능 |
| 상태 전이 표현 | Setter 호출로 표현 | Action과 Reducer로 명시적으로 표현 |

### 8.4. 어떤 경우에 사용해야 하는가?

다음과 같은 경우에는 `useState`가 적합합니다.

- 단일 Boolean 상태
- Input 값
- 단순한 숫자 또는 문자열 상태
- 상태 변경 규칙이 간단한 경우

다음과 같은 경우에는 `useReducer`를 고려할 수 있습니다.

- 여러 상태가 서로 연관되어 있는 경우
- 하나의 이벤트에서 여러 상태를 함께 변경해야 하는 경우
- 상태 변경 규칙이 복잡한 경우
- 상태 전이 과정을 명확하게 표현해야 하는 경우
- Reducer를 독립적으로 테스트하고 싶은 경우

`useReducer`가 `useState`보다 항상 성능이 좋은 것은 아닙니다.

상태 관리의 복잡도와 유지보수성을 기준으로 선택하는 것이 중요합니다.

## 9. useReducer와 Context API

`useReducer`는 Context API와 함께 사용하여 여러 컴포넌트에서 공통 상태를 관리할 수 있습니다.

일반적으로 다음과 같은 구조를 구성합니다.

- Reducer: 상태 변경 규칙 관리
- Context: 상태와 Dispatch 전달
- Provider: 하위 컴포넌트에 상태 제공
- Consumer: Context를 통해 상태와 Dispatch 사용

### 9.1. Context와 Reducer 구성

```tsx
import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';

type State = {
  count: number;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' };

const initialState: State = {
  count: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + 1,
      };

    case 'decrement':
      return {
        count: state.count - 1,
      };

    default:
      return state;
  }
}

const StateContext = createContext<State | null>(null);

const DispatchContext = createContext<Dispatch<Action> | null>(null);

function CounterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useCounterState() {
  const context = useContext(StateContext);

  if (context === null) {
    throw new Error('useCounterState must be used within CounterProvider');
  }

  return context;
}

function useCounterDispatch() {
  const context = useContext(DispatchContext);

  if (context === null) {
    throw new Error('useCounterDispatch must be used within CounterProvider');
  }

  return context;
}
```

위 예제에서는 상태와 Dispatch를 서로 다른 Context로 분리했습니다.

상태를 구독하는 컴포넌트와 Action만 전달하는 컴포넌트를 구분하기 위한 구조입니다.

### 9.2. 하위 컴포넌트에서 사용

```tsx
function CounterDisplay() {
  const state = useCounterState();

  return <h1>{state.count}</h1>;
}

function CounterControls() {
  const dispatch = useCounterDispatch();

  return (
    <>
      <button onClick={() => dispatch({ type: 'increment' })}>
        증가
      </button>

      <button onClick={() => dispatch({ type: 'decrement' })}>
        감소
      </button>
    </>
  );
}

function App() {
  return (
    <CounterProvider>
      <CounterDisplay />
      <CounterControls />
    </CounterProvider>
  );
}
```

이러한 구조에서는 Props를 여러 단계로 전달하지 않고도 하위 컴포넌트에서 공통 상태와 상태 변경 기능에 접근할 수 있습니다.

### 9.3. Context 분리의 의미

상태와 Dispatch를 서로 다른 Context로 분리하면 Action만 사용하는 컴포넌트가 상태 변경으로 인한 Context 업데이트를 구독하지 않도록 구성할 수 있습니다.

`dispatch` 함수는 React에서 안정적인 참조를 유지하므로 상태가 변경되어도 Dispatch Context의 값은 일반적으로 변경되지 않습니다.

다만 상태를 구독하는 컴포넌트는 해당 Context의 값이 변경되면 다시 렌더링됩니다.

Context 분리만으로 상태 변경과 관련된 모든 렌더링을 방지할 수 있는 것은 아닙니다.

더 세밀한 구독 단위가 필요한 경우에는 상태 선택 기능을 제공하는 별도의 상태 관리 도구를 고려할 수 있습니다.

## 10. useReducer와 비동기 처리

Reducer는 순수 함수여야 하므로 내부에서 비동기 작업을 직접 실행해서는 안 됩니다.

다음과 같은 작업은 Reducer 내부에서 수행하지 않아야 합니다.

- API 요청
- setTimeout 또는 setInterval
- Local Storage 쓰기
- 외부 시스템과의 통신
- DOM 조작
- 기타 부수 효과(Side Effect)

비동기 작업은 이벤트 핸들러나 `useEffect`에서 실행하고, 작업 결과를 Action으로 전달하는 방식으로 구성해야 합니다.

### 10.1. 이벤트 핸들러에서 비동기 처리

```tsx
import { useReducer } from 'react';

type User = {
  id: number;
  name: string;
};

type State = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: 'fetch-start' }
  | { type: 'fetch-success'; payload: User }
  | { type: 'fetch-failure'; payload: string };

const initialState: State = {
  user: null,
  loading: false,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'fetch-start':
      return {
        ...state,
        loading: true,
        error: null,
      };

    case 'fetch-success':
      return {
        user: action.payload,
        loading: false,
        error: null,
      };

    case 'fetch-failure':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user');

  if (!response.ok) {
    throw new Error('사용자 정보를 가져오지 못했습니다.');
  }

  return response.json();
}

function UserProfile() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFetch = async () => {
    dispatch({ type: 'fetch-start' });

    try {
      const user = await fetchUser();

      dispatch({
        type: 'fetch-success',
        payload: user,
      });
    } catch (error) {
      dispatch({
        type: 'fetch-failure',
        payload:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      });
    }
  };

  return (
    <div>
      <button onClick={handleFetch} disabled={state.loading}>
        사용자 정보 조회
      </button>

      {state.loading && <p>Loading...</p>}

      {state.error && <p>{state.error}</p>}

      {state.user && <p>{state.user.name}</p>}
    </div>
  );
}
```

위 예제에서는 비동기 API 요청을 이벤트 핸들러에서 실행합니다.

비동기 작업의 진행 상황과 결과는 Action을 통해 Reducer에 전달됩니다.

Reducer는 전달받은 Action에 따라 상태를 변경하는 역할만 수행합니다.

### 10.2. useEffect에서 비동기 처리

컴포넌트가 마운트되거나 특정 값이 변경될 때 API 요청이 필요한 경우에는 `useEffect`를 활용할 수 있습니다.

```tsx
function UserProfile() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      dispatch({ type: 'fetch-start' });

      try {
        const response = await fetch('/api/user', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('사용자 정보를 가져오지 못했습니다.');
        }

        const user = await response.json();

        dispatch({
          type: 'fetch-success',
          payload: user,
        });
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        dispatch({
          type: 'fetch-failure',
          payload:
            error instanceof Error
              ? error.message
              : '알 수 없는 오류가 발생했습니다.',
        });
      }
    }

    loadUser();

    return () => {
      controller.abort();
    };
  }, [dispatch]);

  return (
    <div>
      {state.loading && <p>Loading...</p>}
      {state.error && <p>{state.error}</p>}
      {state.user && <p>{state.user.name}</p>}
    </div>
  );
}
```

`dispatch`는 안정적인 참조를 유지하지만, Effect의 의존성 규칙에 따라 포함해도 무방합니다.

Effect Cleanup에서는 `AbortController`를 사용하여 불필요해진 요청을 취소합니다.

비동기 작업의 실행 위치는 작업의 목적에 따라 결정해야 합니다.

- 사용자 이벤트에 대한 요청: 이벤트 핸들러
- 컴포넌트의 생명주기나 외부 시스템 동기화에 대한 요청: `useEffect`

## 11. Reducer의 순수성과 Strict Mode

Reducer는 순수 함수로 작성해야 합니다.

순수 함수는 동일한 입력에 대해 항상 동일한 결과를 반환하며, 외부 상태를 변경하거나 부수 효과를 발생시키지 않습니다.

### 11.1. 순수하지 않은 Reducer

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      console.log('increment');

      return {
        ...state,
        count: state.count + 1,
        updatedAt: Date.now(),
      };

    default:
      return state;
  }
}
```

위 예제는 Reducer 내부에서 로그를 출력하고 현재 시간을 직접 생성합니다.

동일한 상태와 Action을 전달하더라도 실행 시점에 따라 결과가 달라질 수 있으므로 순수 함수의 원칙에 맞지 않습니다.

### 11.2. 순수한 Reducer

```tsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    case 'set-updated-at':
      return {
        ...state,
        updatedAt: action.payload,
      };

    default:
      return state;
  }
}
```

현재 시간과 같은 외부 데이터는 Reducer 외부에서 생성한 후 Action의 Payload로 전달해야 합니다.

```tsx
dispatch({
  type: 'set-updated-at',
  payload: Date.now(),
});
```

이렇게 하면 Reducer는 전달받은 데이터만 사용하여 다음 상태를 계산할 수 있습니다.

### 11.3. Strict Mode

개발 환경에서 Strict Mode가 활성화되어 있으면 React는 Reducer와 Initializer 함수의 순수성을 확인하기 위해 해당 함수를 추가로 호출할 수 있습니다.

이러한 동작은 개발 환경에서만 적용되는 검증 과정이며, 한 번의 Action이 실제로 두 번 처리되어야 한다는 의미는 아닙니다.

따라서 Reducer 내부에서 다음과 같은 작업을 수행하면 안 됩니다.

- API 요청
- 로그 전송
- 외부 시스템 데이터 변경
- 랜덤 값 생성
- 시간에 의존하는 값 생성
- 기존 상태 객체 변경

Reducer를 순수 함수로 유지하면 Strict Mode에서도 예측 가능한 상태 변경을 보장할 수 있습니다.

## 12. dispatch와 상태 업데이트

`dispatch`는 Action을 전달하여 상태 업데이트를 요청하는 함수입니다.

```tsx
dispatch({
  type: 'increment',
});
```

`dispatch` 호출 시 현재 실행 중인 코드에서 `state` 값이 즉시 변경되는 것은 아닙니다.

React는 상태 업데이트를 예약하고, 다음 렌더링에서 Reducer가 계산한 새로운 상태를 제공합니다.

### 12.1. Dispatch 이후 상태 확인

```tsx
function Counter() {
  const [state, dispatch] = useReducer(reducer, {
    count: 0,
  });

  const handleClick = () => {
    dispatch({ type: 'increment' });

    console.log(state.count);
  };

  return (
    <button onClick={handleClick}>
      {state.count}
    </button>
  );
}
```

위 코드에서 `dispatch` 이후 `console.log(state.count)`는 현재 이벤트 핸들러가 참조하는 렌더링 시점의 상태를 출력합니다.

새로운 상태는 다음 렌더링에서 확인할 수 있습니다.

### 12.2. 여러 Dispatch 호출

```tsx
function handleClick() {
  dispatch({ type: 'increment' });
  dispatch({ type: 'increment' });
  dispatch({ type: 'increment' });
}
```

여러 번의 `dispatch` 호출은 React의 업데이트 처리 과정에 따라 다음 상태에 순차적으로 반영됩니다.

각 Action은 Reducer에 전달되어 이전 Action의 결과를 기반으로 다음 상태를 계산합니다.

따라서 위 예제에서는 최종적으로 `count`가 3 증가합니다.

단, 이벤트 핸들러 내부에서 `state`를 직접 읽으면 여전히 해당 렌더링 시점의 상태를 참조한다는 점에 주의해야 합니다.

## 13. TypeScript에서 useReducer 사용하기

TypeScript에서는 State와 Action의 타입을 명확하게 정의하여 Reducer의 입력과 반환값을 안전하게 관리할 수 있습니다.

### 13.1. State와 Action 타입 정의

```tsx
type State = {
  count: number;
  message: string;
};

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'set-message'; payload: string }
  | { type: 'reset' };
```

Action은 Discriminated Union 형태로 정의할 수 있습니다.

각 Action의 `type`에 따라 사용할 수 있는 Payload를 구분할 수 있습니다.

### 13.2. Reducer 타입 정의

```tsx
const initialState: State = {
  count: 0,
  message: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };

    case 'set-message':
      return {
        ...state,
        message: action.payload,
      };

    case 'reset':
      return initialState;

    default:
      return state;
  }
}
```

`action.type`을 기준으로 분기하면 TypeScript가 각 Action의 타입을 추론합니다.

따라서 `set-message`에서는 `action.payload`가 문자열로 추론됩니다.

### 13.3. Exhaustive Check

Action이 추가되었을 때 Reducer에서 해당 Action을 처리하지 않는 문제를 방지하려면 Exhaustive Check를 적용할 수 있습니다.

```tsx
function assertNever(value: never): never {
  throw new Error(`Unhandled action: ${JSON.stringify(value)}`);
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return {
        ...state,
        count: state.count + 1,
      };

    case 'decrement':
      return {
        ...state,
        count: state.count - 1,
      };

    case 'set-message':
      return {
        ...state,
        message: action.payload,
      };

    case 'reset':
      return initialState;

    default:
      return assertNever(action);
  }
}
```

`assertNever`는 모든 Action을 처리했는지 컴파일 시점에 확인하는 데 도움이 됩니다.

Action 타입에 새로운 항목이 추가되었지만 Reducer에서 처리하지 않았다면 TypeScript가 오류를 표시할 수 있습니다.

## 14. useReducer 사용 시 주의사항

### 14.1. 상태가 단순하다면 useState를 우선 고려합니다

상태가 단순하고 변경 규칙이 복잡하지 않다면 `useReducer`보다 `useState`가 더 적합할 수 있습니다.

상태 관리 방식은 복잡도와 유지보수성을 기준으로 선택해야 합니다.

### 14.2. Reducer 내부에서 부수 효과를 실행하지 않습니다

Reducer는 순수 함수로 유지해야 합니다.

API 요청, 타이머, DOM 조작 등의 작업은 이벤트 핸들러나 Effect에서 처리해야 합니다.

### 14.3. 기존 상태를 직접 변경하지 않습니다

기존 상태 객체나 배열을 직접 수정하지 않고 새로운 상태를 반환해야 합니다.

### 14.4. Action의 의미를 명확하게 정의합니다

Action은 상태 변경 의도를 설명하는 이름으로 작성하는 것이 좋습니다.

```tsx
dispatch({
  type: 'user-login-success',
  payload: user,
});
```

Action의 이름만으로 어떤 상태 변경이 발생하는지 이해할 수 있도록 설계해야 합니다.

### 14.5. Reducer에 과도한 책임을 부여하지 않습니다

Reducer는 상태 변경 규칙을 담당합니다.

API 요청, 데이터 변환을 위한 외부 서비스 호출, 로깅, 네트워크 통신 등의 책임을 Reducer에 포함하지 않아야 합니다.

### 14.6. 상태 구조를 적절하게 설계합니다

상태가 지나치게 중첩되면 Reducer의 불변성 유지와 업데이트 로직이 복잡해질 수 있습니다.

가능하면 상태 구조를 단순하게 유지하고 서로 독립적인 상태와 연관된 상태를 구분해야 합니다.

### 14.7. Reducer를 무조건 하나로 통합하지 않습니다

여러 상태를 하나의 Reducer에서 관리할 수도 있지만, 관련성이 낮은 상태까지 하나로 통합하면 오히려 복잡도가 증가할 수 있습니다.

상태 변경 규칙과 생명주기가 비슷한 상태를 중심으로 Reducer를 구성하는 것이 좋습니다.

## 15. useReducer 사용 원칙

`useReducer`를 효과적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **상태 변경 규칙을 분리합니다.** 복잡한 상태 변경 로직은 Reducer로 분리하여 컴포넌트의 책임을 줄입니다.
2. **Action을 명확하게 정의합니다.** 상태 변경의 의도를 표현하는 Action을 사용합니다.
3. **Reducer를 순수 함수로 유지합니다.** 동일한 입력에 대해 동일한 결과를 반환하도록 작성합니다.
4. **불변성을 유지합니다.** 기존 상태를 직접 변경하지 않고 새로운 상태를 반환합니다.
5. **비동기 작업을 분리합니다.** API 요청과 같은 부수 효과는 이벤트 핸들러나 Effect에서 처리합니다.
6. **초기 상태 계산을 최적화합니다.** 초기화 비용이 큰 경우 Lazy Initialization을 고려합니다.
7. **TypeScript 타입을 명확하게 정의합니다.** State와 Action을 Discriminated Union으로 구성하면 상태 변경 로직의 안정성을 높일 수 있습니다.
8. **Context와 조합할 수 있습니다.** 여러 컴포넌트에서 상태와 Dispatch를 공유해야 하는 경우 Context API를 활용합니다.
9. **상태 관리의 복잡도를 기준으로 선택합니다.** 단순한 상태에는 `useState`, 복잡한 상태 전이에는 `useReducer`를 고려합니다.
10. **Reducer의 책임을 제한합니다.** 상태 계산과 변경 규칙에 집중하도록 설계합니다.

## 참고 자료

### React 공식 문서

- [useReducer – React API Reference](https://react.dev/reference/react/useReducer)
- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [Managing State](https://react.dev/learn/managing-state)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)
- [useState – React API Reference](https://react.dev/reference/react/useState)
- [StrictMode – React API Reference](https://react.dev/reference/react/StrictMode)

### TypeScript 공식 문서

- [TypeScript Handbook – Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook – Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook – Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)