# useEffect

## 1. useEffect란?

`useEffect`는 React 컴포넌트를 외부 시스템과 동기화하는 데 사용하는 Hook입니다.

React 컴포넌트는 props와 state를 기반으로 UI를 렌더링하지만, 애플리케이션에서는 React가 직접 관리하지 않는 외부 시스템과 상호작용해야 하는 경우가 있습니다.

대표적인 외부 시스템은 다음과 같습니다.

- 네트워크 연결 및 API 요청
- 브라우저의 DOM API
- 이벤트 리스너
- 타이머와 인터벌
- WebSocket 연결
- 서드파티 UI 라이브러리
- 지도, 차트 등 외부 위젯
- 브라우저의 미디어 및 기타 Web API

`useEffect`는 이러한 외부 시스템과 React 컴포넌트 사이의 동기화 작업을 선언적으로 관리합니다.

```tsx
import { useEffect } from 'react';

function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return <h1>{roomId} 채팅방</h1>;
}
```

위 코드에서는 `roomId`에 해당하는 채팅방에 연결하고, `roomId`가 변경되면 기존 연결을 정리한 후 새로운 채팅방에 연결합니다.

컴포넌트가 제거되면 마지막 연결도 정리됩니다.

`useEffect`를 사용할 때는 컴포넌트의 생명주기보다 외부 시스템과의 동기화 과정을 중심으로 이해하는 것이 중요합니다.

## 2. 기본 문법

`useEffect`는 다음과 같은 형태로 사용합니다.

```tsx
useEffect(setup, dependencies?);
```

- `setup`: Effect를 설정하는 함수입니다. 외부 시스템과 동기화하는 코드를 작성합니다.
- `dependencies`: Effect가 참조하는 반응형 값(Reactive Values)의 배열입니다. 해당 값이 변경되면 Effect를 다시 실행합니다.

`setup` 함수는 선택적으로 정리 함수(Cleanup Function)를 반환할 수 있습니다.

```tsx
useEffect(() => {
  // Setup
  connect();

  return () => {
    // Cleanup
    disconnect();
  };
}, [dependency]);
```

React는 컴포넌트가 커밋된 후 Effect를 실행하며, 의존성이 변경되거나 컴포넌트가 제거될 때 정리 함수를 실행합니다.

`useEffect`는 반환값이 없는 Hook으로, 항상 `undefined`를 반환합니다.

## 3. Effect 실행 시점

Effect의 실행 시점은 의존성 배열의 지정 여부에 따라 달라집니다.

### 3.1. 의존성 배열 생략

의존성 배열을 생략하면 컴포넌트가 커밋될 때마다 Effect가 실행됩니다.

```tsx
useEffect(() => {
  console.log('Effect 실행');
});
```

다음 상황에서 Effect가 실행됩니다.

- 최초 마운트 이후
- 컴포넌트가 다시 렌더링되어 커밋될 때마다

상태 변경으로 컴포넌트가 다시 렌더링되면 Effect도 다시 실행됩니다.

### 3.2. 빈 의존성 배열

빈 배열(`[]`)을 전달하면 Effect는 최초 마운트 이후 실행되고, 일반적인 업데이트에서는 다시 실행되지 않습니다.

```tsx
useEffect(() => {
  console.log('컴포넌트 마운트 이후 실행');
}, []);
```

빈 의존성 배열은 Effect 내부에서 사용하는 반응형 값이 없다는 의미입니다.

단, 개발 환경에서 Strict Mode가 활성화된 경우 React가 초기 Effect의 설정과 정리를 한 번 추가로 실행할 수 있습니다.

### 3.3. 특정 의존성 지정

의존성 배열에 특정 값을 전달하면 최초 마운트 이후 실행되고, 해당 값 중 하나 이상이 변경된 경우 다시 실행됩니다.

```tsx
useEffect(() => {
  console.log(`현재 사용자: ${userId}`);
}, [userId]);
```

`userId`가 변경되면 React는 이전 Effect의 정리 함수를 실행한 다음 새로운 Effect를 실행합니다.

### 3.4. 실행 조건 비교

| 사용 방식 | 실행 시점 |
| --- | --- |
| `useEffect(fn)` | 모든 커밋 이후 |
| `useEffect(fn, [])` | 최초 마운트 이후 |
| `useEffect(fn, [a, b])` | 최초 마운트 및 의존성 변경 이후 |

의존성 배열에 포함된 값은 이전 렌더링의 값과 `Object.is`로 비교합니다.

모든 의존성이 이전 값과 동일하면 Effect를 다시 실행하지 않습니다.

## 4. Setup과 Cleanup

`useEffect`의 핵심은 Setup과 Cleanup으로 구성되는 동기화 주기입니다.

- Setup: 외부 시스템과의 연결을 생성하거나 동기화 작업을 시작합니다.
- Cleanup: Setup에서 시작한 작업을 중단하거나 이전 상태로 되돌립니다.

```tsx
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);

  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [serverUrl, roomId]);
```

위 코드의 실행 흐름은 다음과 같습니다.

1. 컴포넌트가 마운트되면 Setup을 실행합니다.
2. `serverUrl` 또는 `roomId`가 변경되면 이전 Cleanup을 실행합니다.
3. 이전 Effect를 정리한 후 새로운 Setup을 실행합니다.
4. 컴포넌트가 언마운트되면 마지막 Cleanup을 실행합니다.

중요한 점은 Cleanup이 컴포넌트가 언마운트될 때만 실행되는 것이 아니라는 점입니다.

의존성이 변경되어 Effect를 다시 실행하기 직전에도 이전 Effect의 Cleanup이 실행됩니다.

### 4.1. Cleanup의 대칭성

Cleanup은 Setup에서 수행한 작업을 정리하거나 취소할 수 있도록 작성해야 합니다.

```tsx
useEffect(() => {
  const handler = () => {
    console.log('Window resized');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
```

이벤트 리스너를 등록했다면 동일한 이벤트 리스너를 제거해야 합니다.

타이머를 생성했다면 타이머를 취소해야 하며, 연결을 생성했다면 연결을 종료해야 합니다.

| Setup | Cleanup |
| --- | --- |
| `addEventListener()` | `removeEventListener()` |
| `setInterval()` | `clearInterval()` |
| `setTimeout()` | `clearTimeout()` |
| WebSocket 연결 | WebSocket 연결 종료 |
| 외부 위젯 초기화 | 외부 위젯 정리 |
| 애니메이션 시작 | 애니메이션 초기화 또는 취소 |

Cleanup은 Setup에서 시작한 작업을 중단하거나 되돌리는 역할을 수행해야 합니다.

### 4.2. Cleanup이 없는 Effect

모든 Effect에 Cleanup이 필요한 것은 아닙니다.

외부 시스템에 값을 전달하거나 이미 존재하는 객체의 설정을 변경하는 작업은 별도의 정리 과정이 필요하지 않을 수 있습니다.

```tsx
useEffect(() => {
  mapRef.current?.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

위 예제는 외부 지도 객체의 확대 수준을 React 상태와 동기화합니다.

동일한 확대 수준을 다시 설정하는 작업이 안전하다면 별도의 Cleanup은 필요하지 않습니다.

반면 이벤트 리스너, 타이머, 구독, 연결처럼 지속적으로 유지되는 작업은 적절한 Cleanup이 필요합니다.

## 5. 의존성 배열과 Reactive Values

의존성 배열은 Effect 내부에서 사용하는 반응형 값을 기준으로 결정됩니다.

반응형 값(Reactive Values)은 컴포넌트가 다시 렌더링될 때 변경될 수 있는 값입니다.

대표적으로 다음 항목이 포함됩니다.

- Props
- State
- 컴포넌트 함수 내부에서 선언한 변수
- 컴포넌트 함수 내부에서 선언한 함수

```tsx
function ChatRoom({
  roomId,
}: {
  roomId: string;
}) {
  const [serverUrl, setServerUrl] = useState(
    'https://localhost:1234',
  );

  useEffect(() => {
    const connection = createConnection(
      serverUrl,
      roomId,
    );

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return null;
}
```

Effect 내부에서 `serverUrl`과 `roomId`를 참조하므로 두 값 모두 의존성 배열에 포함해야 합니다.

### 5.1. 의존성은 선택하는 값이 아닙니다

의존성 배열은 Effect를 언제 실행하고 싶은지에 따라 임의로 구성하는 배열이 아닙니다.

Effect 내부에서 사용하는 반응형 값이 무엇인지에 따라 결정됩니다.

다음 코드는 잘못된 예입니다.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(roomId);

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, []); // 잘못된 의존성
}
```

`roomId`를 참조하면서 의존성 배열에서 제외했기 때문에 `roomId`가 변경되어도 Effect가 다시 실행되지 않습니다.

이로 인해 외부 연결이 최신 상태와 동기화되지 않는 문제가 발생할 수 있습니다.

올바른 방법은 다음과 같습니다.

```tsx
useEffect(() => {
  const connection = createConnection(roomId);

  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

의존성 배열을 임의로 수정하거나 ESLint 경고를 무시하기보다는 Effect가 실제로 필요한 값을 참조하도록 코드를 개선해야 합니다.

### 5.2. 반응형 값이 아닌 값

컴포넌트 외부에서 선언한 상수는 컴포넌트의 재렌더링에 따라 변경되지 않으므로 일반적으로 의존성 배열에 포함할 필요가 없습니다.

```tsx
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const connection = createConnection(
      serverUrl,
      roomId,
    );

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return null;
}
```

`serverUrl`은 컴포넌트 외부에 선언되어 있으므로 반응형 값이 아닙니다.

반면 컴포넌트 내부에서 선언한 값은 렌더링마다 새롭게 계산될 수 있으므로 Effect에서 참조한다면 의존성 여부를 검토해야 합니다.

## 6. 의존성 비교와 불필요한 재실행

React는 의존성 배열의 각 항목을 이전 렌더링의 값과 `Object.is`로 비교합니다.

원시 타입은 값으로 비교하지만 객체와 함수는 참조를 기준으로 비교합니다.

따라서 렌더링 과정에서 객체나 함수를 새롭게 생성하면 내용이 동일하더라도 이전 값과 다른 의존성으로 판단될 수 있습니다.

### 6.1. 객체 의존성 문제

다음 예제에서는 렌더링할 때마다 새로운 `options` 객체가 생성됩니다.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  const options = {
    serverUrl: 'https://localhost:1234',
    roomId,
  };

  useEffect(() => {
    const connection = createConnection(options);

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [options]);

  return null;
}
```

`options`는 매 렌더링마다 새로운 참조를 가지므로 Effect가 불필요하게 반복 실행될 수 있습니다.

객체를 Effect 내부에서 생성하면 문제를 해결할 수 있습니다.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    const options = {
      serverUrl: 'https://localhost:1234',
      roomId,
    };

    const connection = createConnection(options);

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return null;
}
```

이제 Effect는 실제로 동기화에 필요한 `roomId`에만 의존합니다.

### 6.2. 함수 의존성 문제

컴포넌트 내부에서 선언한 함수도 렌더링마다 새로운 참조가 생성됩니다.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId,
    };
  }

  useEffect(() => {
    const connection = createConnection(createOptions());

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [createOptions]);

  return null;
}
```

위 코드에서는 `createOptions`가 렌더링마다 새롭게 생성되므로 Effect가 반복 실행될 수 있습니다.

가능하다면 함수를 Effect 내부로 이동하는 방법이 가장 단순합니다.

```tsx
function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: 'https://localhost:1234',
        roomId,
      };
    }

    const connection = createConnection(createOptions());

    connection.connect();

    return () => {
      connection.disconnect();
    };
  }, [roomId]);

  return null;
}
```

`useCallback`이나 `useMemo`를 사용하여 참조를 안정화할 수도 있지만, 불필요한 의존성 자체를 제거하는 방법을 우선적으로 고려해야 합니다.

## 7. Effect 내부의 State 업데이트

Effect에서 State를 업데이트하면 컴포넌트가 다시 렌더링됩니다.

이 과정에서 의존성이 변경되면 Effect가 다시 실행될 수 있습니다.

따라서 Effect 내부에서 State를 업데이트할 때는 업데이트가 필요한 이유와 재실행 조건을 명확하게 설계해야 합니다.

### 7.1. 이전 State를 기반으로 업데이트

다음 예제는 1초마다 카운터를 증가시키는 코드입니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [count]);

  return <h1>{count}</h1>;
}
```

`count`가 변경될 때마다 Effect가 정리되고 새로운 인터벌이 생성됩니다.

이전 State를 기반으로 업데이트하는 Functional Update를 사용하면 `count`를 의존성에서 제외할 수 있습니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(current => current + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <h1>{count}</h1>;
}
```

State Updater 함수는 최신 State를 인자로 전달받으므로 Effect가 특정 렌더링 시점의 `count` 값을 참조할 필요가 없습니다.

따라서 인터벌을 다시 생성하지 않고도 카운터를 증가시킬 수 있습니다.

### 7.2. 무한 렌더링 방지

다음 코드는 의존성 배열 없이 매번 State를 업데이트하므로 무한 렌더링을 발생시킬 수 있습니다.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(count + 1);
  });

  return <h1>{count}</h1>;
}
```

실행 흐름은 다음과 같습니다.

1. 컴포넌트가 렌더링됩니다.
2. Effect가 실행됩니다.
3. Effect에서 State를 업데이트합니다.
4. State 변경으로 컴포넌트가 다시 렌더링됩니다.
5. Effect가 다시 실행됩니다.

이 과정이 반복되면서 렌더링 루프가 발생합니다.

Effect에서 State를 업데이트해야 한다면 외부 시스템의 상태 변경을 반영하는 데 필요한 경우인지 먼저 확인해야 합니다.

단순히 다른 State에서 계산할 수 있는 값을 동기화하려는 목적이라면 Effect를 사용하지 않는 것이 좋습니다.

## 8. 비동기 작업과 데이터 요청

`useEffect`는 외부 시스템과 동기화하기 위한 Hook이므로 API 요청과 같은 비동기 작업에도 사용할 수 있습니다.

다만 Effect의 Setup 함수 자체를 `async` 함수로 선언해서는 안 됩니다.

`async` 함수는 Promise를 반환하지만, Effect의 Setup 함수는 Cleanup 함수 또는 `undefined`를 반환해야 하기 때문입니다.

### 8.1. 기본적인 API 요청

비동기 함수를 Effect 내부에서 별도로 선언하고 실행할 수 있습니다.

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      setUser(data);
    }

    fetchUser();
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

위 코드는 `userId`가 변경될 때마다 해당 사용자 정보를 요청합니다.

하지만 요청이 여러 번 발생하거나 이전 요청이 늦게 완료되면 오래된 응답이 최신 State를 덮어쓸 수 있습니다.

이를 Race Condition이라고 합니다.

### 8.2. AbortController를 이용한 요청 취소

`AbortController`를 사용하면 더 이상 필요하지 않은 네트워크 요청을 취소할 수 있습니다.

```tsx
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        const response = await fetch(
          `/api/users/${userId}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error('사용자 정보를 가져오지 못했습니다.');
        }

        const data = await response.json();

        setUser(data);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        console.error(error);
      }
    }

    fetchUser();

    return () => {
      controller.abort();
    };
  }, [userId]);

  return <div>{user?.name}</div>;
}
```

`userId`가 변경되면 이전 Effect의 Cleanup이 실행되면서 진행 중인 요청을 취소합니다.

컴포넌트가 언마운트되는 경우에도 요청을 취소합니다.

### 8.3. 요청 결과 무시하기

요청 자체를 취소할 수 없는 경우에는 이전 요청의 결과가 State에 반영되지 않도록 처리할 수 있습니다.

```tsx
useEffect(() => {
  let ignore = false;

  async function fetchUser() {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();

    if (!ignore) {
      setUser(data);
    }
  }

  fetchUser();

  return () => {
    ignore = true;
  };
}, [userId]);
```

이전 Effect의 Cleanup이 실행되면 해당 Effect에서 선언한 `ignore` 값이 `true`로 변경됩니다.

이후 이전 요청이 완료되더라도 State를 업데이트하지 않습니다.

이 방식은 네트워크 요청 자체를 취소하지는 않지만 오래된 응답이 최신 데이터를 덮어쓰는 문제를 방지합니다.

### 8.4. 데이터 요청에서 고려할 사항

Effect를 이용한 직접적인 데이터 요청은 다음과 같은 문제를 발생시킬 수 있습니다.

- 컴포넌트가 마운트될 때마다 중복 요청이 발생할 수 있습니다.
- 컴포넌트 간 요청 결과를 공유하기 어렵습니다.
- 캐싱과 중복 요청 제거를 직접 구현해야 할 수 있습니다.
- Race Condition과 요청 취소를 직접 관리해야 합니다.
- 네트워크 요청과 UI 상태 관리가 컴포넌트에 결합될 수 있습니다.

실제 애플리케이션에서는 React 기반 프레임워크의 데이터 로딩 기능이나 TanStack Query와 같은 데이터 관리 라이브러리를 사용하는 방법도 고려할 수 있습니다.

## 9. Effect Event와 최신 값 읽기

Effect는 의존성으로 선언한 반응형 값이 변경될 때 다시 동기화됩니다.

그러나 일부 상황에서는 특정 값의 최신 상태를 읽어야 하지만, 해당 값의 변경이 Effect를 다시 실행하는 원인이 되어서는 안 될 수 있습니다.

React는 이러한 상황을 처리하기 위해 `useEffectEvent`를 제공합니다.

`useEffectEvent`는 Effect 내부에서 호출되는 비반응형 로직을 분리하고, 해당 로직에서 최신 props와 state를 읽을 수 있도록 합니다.

```tsx
import { useEffect, useEffectEvent } from 'react';

function Page({
  url,
  shoppingCart,
}: {
  url: string;
  shoppingCart: Product[];
}) {
  const onVisit = useEffectEvent((visitedUrl: string) => {
    logVisit(visitedUrl, shoppingCart.length);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);

  return null;
}
```

위 코드에서는 `url`이 변경될 때만 방문 기록을 남깁니다.

`shoppingCart`의 최신 값은 `onVisit` 내부에서 읽지만, 장바구니 변경만으로 Effect가 다시 실행되지는 않습니다.

Effect Event는 일반적인 의존성 배열에 포함하지 않습니다.

또한 Effect Event는 Effect 내부에서 호출하기 위한 기능이며, 일반적인 이벤트 핸들러를 대체하는 용도로 사용해서는 안 됩니다.

Effect Event가 필요한 상황인지 먼저 검토하고, 단순히 의존성 배열에서 값을 제외하기 위한 목적으로 사용하지 않아야 합니다.

## 10. Strict Mode와 Effect의 추가 실행

React Strict Mode가 활성화된 개발 환경에서는 최초 마운트 시 Effect의 Setup과 Cleanup을 한 번 추가로 실행합니다.

```tsx
useEffect(() => {
  console.log('Setup');

  return () => {
    console.log('Cleanup');
  };
}, []);
```

개발 환경에서 출력되는 순서는 다음과 같습니다.

```text
Setup
Cleanup
Setup
```

이는 Effect가 반복 실행되는 문제를 검출하고 Cleanup이 올바르게 구현되었는지 확인하기 위한 동작입니다.

프로덕션 환경에서는 이러한 추가 실행이 발생하지 않습니다.

### 10.1. Strict Mode가 추가 실행하는 이유

React는 Effect가 다음과 같은 상황에서도 안전하게 동작하는지 확인해야 합니다.

- 컴포넌트가 화면에 나타나는 경우
- 외부 시스템과 동기화하는 경우
- 동기화 대상이 변경되는 경우
- 컴포넌트가 제거되는 경우
- 컴포넌트가 다시 화면에 나타나는 경우

Cleanup이 제대로 구현되지 않았다면 이벤트 리스너가 중복 등록되거나 연결이 누적되는 등의 문제가 발생할 수 있습니다.

Strict Mode의 추가 실행은 이러한 문제를 개발 단계에서 발견하기 위한 검증 과정입니다.

### 10.2. 실행 횟수를 제한하는 방식은 피해야 합니다

다음과 같이 Ref를 사용하여 Effect의 실행을 강제로 한 번으로 제한하는 방식은 올바른 해결책이 아닙니다.

```tsx
const initialized = useRef(false);

useEffect(() => {
  if (initialized.current) {
    return;
  }

  initialized.current = true;

  connect();
}, []);
```

이 방식은 Effect의 추가 실행을 막을 뿐, 외부 시스템과의 연결을 정리하지 못하는 문제를 해결하지 않습니다.

올바른 방법은 Setup에서 시작한 작업을 Cleanup에서 정확하게 정리하는 것입니다.

```tsx
useEffect(() => {
  const connection = createConnection();

  connection.connect();

  return () => {
    connection.disconnect();
  };
}, []);
```

Effect는 한 번만 실행되는 것을 전제로 설계하는 것이 아니라, Setup과 Cleanup이 반복되어도 올바르게 동작하도록 설계해야 합니다.

## 11. useEffect와 렌더링 과정

React의 렌더링 과정은 크게 Render Phase와 Commit Phase로 구분할 수 있습니다.

- Render Phase: 컴포넌트를 실행하여 다음 UI를 계산합니다.
- Commit Phase: 계산된 변경 사항을 실제 DOM에 반영합니다.
- Effect Phase: 커밋 이후 외부 시스템과의 동기화를 수행합니다.

`useEffect`는 일반적으로 브라우저가 화면을 다시 그린 이후 실행됩니다.

다만 사용자 상호작용에 의해 발생한 Effect 등에서는 실행 시점이 달라질 수 있으므로, 모든 Effect가 반드시 Paint 이후에 실행된다고 가정해서는 안 됩니다.

### 11.1. Paint 이후 실행

대부분의 Effect는 브라우저가 화면을 다시 그린 이후 실행됩니다.

```tsx
useEffect(() => {
  document.title = `현재 사용자: ${userName}`;
}, [userName]);
```

화면에 표시되는 UI를 계산하고 반영하는 작업과 외부 시스템을 동기화하는 작업을 분리할 수 있습니다.

### 11.2. Paint 이전 실행이 필요한 경우

툴팁의 위치 측정이나 화면 요소의 위치 조정처럼 브라우저가 화면을 그리기 전에 작업을 완료해야 하는 경우에는 `useLayoutEffect`를 고려할 수 있습니다.

```tsx
useLayoutEffect(() => {
  const rect = elementRef.current?.getBoundingClientRect();

  if (rect) {
    setTooltipPosition({
      top: rect.bottom,
      left: rect.left,
    });
  }
}, []);
```

`useLayoutEffect`는 브라우저가 화면을 다시 그리기 전에 실행되므로 시각적인 깜빡임을 방지할 수 있습니다.

단, 브라우저의 Paint를 지연시킬 수 있으므로 반드시 필요한 경우에만 사용해야 합니다.

## 12. useEffect와 다른 Hook 비교

### 12.1. useEffect vs useLayoutEffect

두 Hook 모두 컴포넌트와 외부 시스템을 동기화하는 데 사용할 수 있지만 실행 시점이 다릅니다.

| 구분 | useEffect | useLayoutEffect |
| --- | --- | --- |
| 실행 시점 | 일반적으로 Paint 이후 | Paint 이전 |
| 브라우저 렌더링 차단 | 일반적으로 차단하지 않음 | 차단함 |
| 주요 용도 | 외부 시스템 동기화 | DOM 측정 및 레이아웃 조정 |
| 성능 영향 | 상대적으로 적음 | 불필요한 사용 시 성능 저하 가능 |

일반적인 외부 시스템 동기화에는 `useEffect`를 사용하고, 화면에 반영되기 전에 DOM 측정이나 시각적 조정이 필요한 경우에만 `useLayoutEffect`를 고려합니다.

### 12.2. useEffect vs useInsertionEffect

`useInsertionEffect`는 CSS-in-JS 라이브러리처럼 DOM 변경 이전에 스타일을 삽입해야 하는 특수한 상황을 위한 Hook입니다.

일반적인 애플리케이션 로직에서는 사용할 필요가 거의 없습니다.

| 구분 | useEffect | useLayoutEffect | useInsertionEffect |
| --- | --- | --- | --- |
| 실행 시점 | 일반적으로 Paint 이후 | Paint 이전 | DOM 변경 이전 |
| 주요 용도 | 외부 시스템 동기화 | DOM 측정 및 레이아웃 | 동적 스타일 삽입 |
| 일반적인 사용 빈도 | 높음 | 제한적 | 매우 제한적 |

### 12.3. useEffect vs useSyncExternalStore

외부 시스템의 변경 가능한 데이터를 구독하고 React UI와 동기화해야 하는 경우에는 `useSyncExternalStore`가 더 적합할 수 있습니다.

```tsx
const snapshot = useSyncExternalStore(
  store.subscribe,
  store.getSnapshot,
);
```

`useEffect`를 사용하여 외부 Store를 구독하고 State를 수동으로 업데이트하는 방식보다 React의 외부 Store 구독 모델에 맞게 동기화할 수 있습니다.

## 13. useEffect를 사용하지 않아야 하는 경우

`useEffect`는 외부 시스템과의 동기화를 위한 기능이지, 모든 부수 효과나 데이터 흐름을 관리하기 위한 범용 도구가 아닙니다.

외부 시스템과 상호작용하지 않는다면 Effect가 필요하지 않을 가능성이 높습니다.

### 13.1. 파생 State 계산

다른 State나 Props를 기반으로 계산할 수 있는 값은 렌더링 과정에서 직접 계산하는 것이 좋습니다.

잘못된 예:

```tsx
function UserList({ users }: { users: User[] }) {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);

  useEffect(() => {
    setActiveUsers(users.filter(user => user.active));
  }, [users]);

  return <UserListView users={activeUsers} />;
}
```

`activeUsers`는 `users`에서 계산할 수 있는 파생 값입니다.

Effect를 이용하면 불필요한 렌더링이 추가로 발생할 수 있습니다.

올바른 예:

```tsx
function UserList({ users }: { users: User[] }) {
  const activeUsers = users.filter(user => user.active);

  return <UserListView users={activeUsers} />;
}
```

계산 비용이 큰 경우에는 `useMemo`를 고려할 수 있습니다.

### 13.2. 사용자 이벤트 처리

버튼 클릭과 같은 사용자 상호작용에 직접 대응하는 작업은 Effect보다 이벤트 핸들러에서 처리하는 것이 적절합니다.

잘못된 예:

```tsx
function PurchaseButton() {
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (purchased) {
      purchaseProduct();
    }
  }, [purchased]);

  return (
    <button onClick={() => setPurchased(true)}>
      구매
    </button>
  );
}
```

구매 요청은 사용자가 버튼을 클릭했을 때 발생해야 하는 작업입니다.

이를 Effect로 처리하면 State 변경과 실제 사용자 이벤트 사이의 관계가 불필요하게 분리됩니다.

올바른 예:

```tsx
function PurchaseButton() {
  async function handlePurchase() {
    await purchaseProduct();
  }

  return (
    <button onClick={handlePurchase}>
      구매
    </button>
  );
}
```

사용자 이벤트에 직접 연결되는 작업은 이벤트 핸들러에서 처리하고, Effect는 컴포넌트의 상태와 외부 시스템 사이의 동기화에 사용해야 합니다.

### 13.3. 컴포넌트 내부의 데이터 흐름 관리

여러 State를 서로 동기화하기 위해 Effect를 반복적으로 사용하는 방식은 피해야 합니다.

```tsx
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

`fullName`은 기존 State에서 계산할 수 있으므로 별도 State로 관리할 필요가 없습니다.

```tsx
const fullName = `${firstName} ${lastName}`;
```

Effect를 이용한 불필요한 State 동기화는 데이터 흐름을 복잡하게 만들고 추가 렌더링을 발생시킬 수 있습니다.

## 14. Effect 디버깅

Effect가 예상과 다르게 실행된다면 다음 항목을 확인해야 합니다.

### 14.1. Effect가 매 렌더링마다 실행되는 경우

의존성 배열이 생략되었는지 확인합니다.

```tsx
useEffect(() => {
  synchronize();
});
```

의존성 배열이 없다면 모든 커밋 이후 Effect가 실행됩니다.

### 14.2. Effect가 예상보다 자주 실행되는 경우

의존성 배열에 포함된 객체나 함수가 매 렌더링마다 새롭게 생성되는지 확인합니다.

```tsx
const options = { roomId };

useEffect(() => {
  synchronize(options);
}, [options]);
```

객체를 Effect 내부에서 생성하거나, 불필요한 의존성을 제거하는 방법을 고려합니다.

### 14.3. Effect가 무한 반복되는 경우

무한 반복은 일반적으로 다음 두 조건이 함께 발생할 때 나타납니다.

1. Effect 내부에서 State를 업데이트합니다.
2. 해당 State 업데이트로 인해 Effect의 의존성이 변경됩니다.

Effect가 반드시 필요한지 먼저 확인하고, 파생 State를 계산하는 용도라면 Effect를 제거하는 것이 좋습니다.

### 14.4. Cleanup이 예상하지 못한 시점에 실행되는 경우

Cleanup은 컴포넌트가 언마운트될 때뿐만 아니라 의존성이 변경되어 다음 Setup을 실행하기 직전에도 호출됩니다.

따라서 Cleanup을 언마운트 전용 로직으로 작성하지 않아야 합니다.

### 14.5. Strict Mode에서 Effect가 두 번 실행되는 경우

개발 환경의 Strict Mode에서는 초기 Setup → Cleanup → Setup 순서가 발생할 수 있습니다.

실행 횟수를 제한하기보다는 Cleanup이 Setup과 대칭적으로 구현되어 있는지 확인해야 합니다.

## 15. useEffect 사용 원칙

`useEffect`를 안정적으로 사용하기 위해 다음 원칙을 고려해야 합니다.

1. **외부 시스템과의 동기화에 사용합니다.** 단순한 데이터 계산이나 컴포넌트 내부의 State 관리에는 사용하지 않습니다.
2. **의존성 배열을 정확하게 선언합니다.** Effect 내부에서 참조하는 모든 반응형 값을 포함해야 합니다.
3. **Setup과 Cleanup을 대칭적으로 작성합니다.** 등록한 리스너, 생성한 타이머, 연결한 외부 시스템을 적절히 정리해야 합니다.
4. **Effect를 독립적인 동기화 프로세스로 구성합니다.** 서로 다른 외부 시스템을 동기화한다면 Effect를 분리하는 것이 좋습니다.
5. **불필요한 객체와 함수 의존성을 제거합니다.** 렌더링마다 새롭게 생성되는 참조로 인해 Effect가 반복 실행되지 않도록 주의합니다.
6. **비동기 작업의 취소와 Race Condition을 고려합니다.** 이전 요청의 결과가 최신 상태를 덮어쓰지 않도록 처리해야 합니다.
7. **Strict Mode의 추가 실행을 정상적인 검증 과정으로 이해합니다.** Effect가 반복 실행되어도 올바르게 동작하도록 설계해야 합니다.
8. **Effect를 사용하기 전에 제거할 수 있는지 검토합니다.** 파생 State와 사용자 이벤트 처리는 각각 렌더링 과정과 이벤트 핸들러에서 처리하는 것이 적절합니다.

## 참고 자료

### React 공식 문서

- [useEffect – React API Reference](https://react.dev/reference/react/useEffect)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
- [useLayoutEffect – React API Reference](https://react.dev/reference/react/useLayoutEffect)
- [useInsertionEffect – React API Reference](https://react.dev/reference/react/useInsertionEffect)
- [useSyncExternalStore – React API Reference](https://react.dev/reference/react/useSyncExternalStore)
- [StrictMode – React API Reference](https://react.dev/reference/react/StrictMode)

### 관련 기술 문서

- [MDN – AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [MDN – Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)