# User Interaction Testing

사용자 상호작용 테스트(User Interaction Testing)는 사용자가 애플리케이션과 상호작용하는 과정을 검증하는 테스트입니다. 버튼 클릭, 키보드 입력, 텍스트 입력, 폼 제출, 포커스 이동 등 사용자의 실제 동작을 시뮬레이션하여 애플리케이션이 기대한 대로 동작하는지 확인합니다.

React 애플리케이션에서는 주로 `@testing-library/user-event`와 `@testing-library/react`를 함께 사용합니다.

## 1. User Interaction Testing의 목적

컴포넌트는 단순히 화면에 렌더링되는 것만으로 기능이 완성되지 않습니다. 사용자의 입력과 동작에 따라 상태가 변경되고, 변경된 상태가 화면에 반영되어야 합니다.

예를 들어 버튼을 클릭하면 다음과 같은 과정이 발생할 수 있습니다.

1. 사용자가 버튼을 클릭합니다.
2. 이벤트 핸들러가 실행됩니다.
3. React 상태가 변경됩니다.
4. React가 변경된 상태를 기반으로 컴포넌트를 다시 렌더링합니다.
5. 변경된 결과가 화면에 표시됩니다.

사용자 상호작용 테스트는 이러한 흐름이 정상적으로 수행되는지 검증합니다.

주요 테스트 대상은 다음과 같습니다.

- 버튼 클릭에 따른 상태 변경
- 입력 필드의 텍스트 입력 및 수정
- 키보드 이벤트와 단축키 처리
- 폼 입력 및 제출
- 포커스 이동과 접근성 관련 동작
- 파일 업로드와 클립보드 상호작용
- 비동기 작업 이후의 화면 변경

## 2. user-event와 fireEvent

React Testing Library는 사용자 상호작용을 시뮬레이션하기 위해 `fireEvent`와 `user-event`를 제공합니다.

두 API는 이벤트를 발생시키는 방식과 추상화 수준에서 차이가 있습니다.

### fireEvent

`fireEvent`는 DOM 이벤트를 직접 발생시키는 API입니다.

```tsx
import { fireEvent, render, screen } from "@testing-library/react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>
        Increase
      </button>
    </>
  );
}

test("버튼 클릭 시 카운터가 증가합니다.", () => {
  render(<Counter />);

  fireEvent.click(screen.getByRole("button", { name: "Increase" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

`fireEvent.click()`은 클릭 이벤트를 직접 발생시킵니다. 실제 브라우저에서 발생하는 포인터 이동, 마우스 버튼 입력, 클릭 등의 전체 상호작용 과정을 재현하지는 않습니다.

따라서 특정 DOM 이벤트 자체를 검증하거나 일반적인 사용자 상호작용으로 재현하기 어려운 이벤트를 발생시킬 때 적합합니다.

### user-event

`user-event`는 실제 사용자가 수행하는 동작에 가까운 상호작용을 시뮬레이션하는 라이브러리입니다.

단일 이벤트를 발생시키는 대신 사용자의 동작에 필요한 여러 이벤트를 순서에 따라 처리합니다.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("버튼 클릭 시 카운터가 증가합니다.", async () => {
  const user = userEvent.setup();

  render(<Counter />);

  await user.click(
    screen.getByRole("button", { name: "Increase" })
  );

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

`userEvent.setup()`으로 사용자 인스턴스를 생성한 후 `user.click()`을 호출합니다.

`user-event`의 상호작용 메서드는 비동기적으로 동작하므로 `await`를 사용해야 합니다.

### fireEvent와 user-event 비교

| 구분 | fireEvent | user-event |
|---|---|---|
| 추상화 수준 | DOM 이벤트 단위 | 사용자 동작 단위 |
| 이벤트 처리 | 지정한 이벤트 직접 발생 | 실제 동작에 필요한 이벤트 시퀀스 처리 |
| 비동기 처리 | 일반적으로 동기적 | 비동기 API 사용 |
| 포커스 및 입력 처리 | 직접 이벤트를 발생시켜야 함 | 사용자 동작에 맞게 관련 동작 처리 |
| 주요 용도 | 특정 이벤트 검증 | 실제 사용자 상호작용 검증 |

일반적인 사용자 상호작용 테스트에서는 `user-event`를 우선적으로 사용하는 것이 좋습니다.

반면 `fireEvent`는 특정 이벤트를 직접 발생시켜야 하는 상황에서 사용할 수 있습니다.

## 3. user-event 기본 설정

`user-event` v14에서는 `userEvent.setup()`을 사용하여 사용자 인스턴스를 생성합니다.

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

test("사용자 상호작용을 테스트합니다.", async () => {
  const user = userEvent.setup();

  render(<MyComponent />);

  await user.click(screen.getByRole("button"));

  expect(screen.getByText("Clicked")).toBeInTheDocument();
});
```

테스트마다 사용자 인스턴스를 생성하는 방식이 기본적인 사용 패턴입니다.

사용자 인스턴스는 입력 장치의 상태를 유지하므로 하나의 테스트에서 여러 동작을 수행할 때 동일한 인스턴스를 사용하는 것이 좋습니다.

```tsx
test("여러 사용자 동작을 수행합니다.", async () => {
  const user = userEvent.setup();

  render(<LoginForm />);

  await user.type(
    screen.getByLabelText("Email"),
    "user@example.com"
  );

  await user.type(
    screen.getByLabelText("Password"),
    "password123"
  );

  await user.click(
    screen.getByRole("button", { name: "Login" })
  );

  expect(screen.getByText("Welcome")).toBeInTheDocument();
});
```

`userEvent.setup()`은 테스트 시작 시 호출하는 것이 좋습니다. 사용자 인스턴스를 생성한 후 컴포넌트를 렌더링하고 상호작용을 수행하면 테스트 흐름을 명확하게 유지할 수 있습니다.

## 4. 마우스 및 포인터 상호작용

버튼 클릭, 링크 클릭, 체크박스 선택 등은 `user-event`의 상호작용 메서드로 테스트할 수 있습니다.

### Click

`user.click()`은 사용자가 요소를 클릭하는 동작을 시뮬레이션합니다.

```tsx
function Toggle() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button onClick={() => setEnabled((prev) => !prev)}>
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
}

test("버튼을 클릭하면 상태가 변경됩니다.", async () => {
  const user = userEvent.setup();

  render(<Toggle />);

  const button = screen.getByRole("button");

  expect(button).toHaveTextContent("Disabled");

  await user.click(button);

  expect(button).toHaveTextContent("Enabled");
});
```

### Double Click

`user.dblClick()`은 더블 클릭 동작을 시뮬레이션합니다.

```tsx
test("더블 클릭하면 편집 모드로 전환됩니다.", async () => {
  const user = userEvent.setup();

  render(<EditableItem />);

  await user.dblClick(screen.getByText("Item"));

  expect(screen.getByRole("textbox")).toBeInTheDocument();
});
```

### Hover

`user.hover()`와 `user.unhover()`는 요소에 포인터를 올리거나 제거하는 동작을 시뮬레이션합니다.

```tsx
test("마우스를 올리면 툴팁이 표시됩니다.", async () => {
  const user = userEvent.setup();

  render(<Tooltip />);

  await user.hover(screen.getByText("Help"));

  expect(screen.getByRole("tooltip")).toBeInTheDocument();

  await user.unhover(screen.getByText("Help"));

  expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
});
```

### Pointer

`user.pointer()`는 포인터 입력을 보다 세부적으로 시뮬레이션할 때 사용합니다.

```tsx
test("포인터 입력을 처리합니다.", async () => {
  const user = userEvent.setup();

  render(<SelectableItem />);

  await user.pointer({
    target: screen.getByText("Item"),
    keys: "[MouseLeft]",
  });

  expect(screen.getByText("Selected")).toBeInTheDocument();
});
```

포인터 종류나 입력 순서 등을 명시해야 하는 복잡한 상호작용을 테스트할 때 활용할 수 있습니다.

## 5. 키보드 상호작용

키보드 입력은 `user.keyboard()`를 사용하여 테스트합니다.

문자 입력, 특수 키, 조합 키, 키 누르기 및 해제 등의 동작을 시뮬레이션할 수 있습니다.

### 기본 키 입력

```tsx
test("키보드 입력을 처리합니다.", async () => {
  const user = userEvent.setup();

  render(<SearchInput />);

  const input = screen.getByRole("textbox");

  await user.click(input);
  await user.keyboard("React");

  expect(input).toHaveValue("React");
});
```

### 특수 키 입력

특수 키는 대괄호 문법을 사용합니다.

```tsx
await user.keyboard("{Enter}");
await user.keyboard("{Escape}");
await user.keyboard("{Tab}");
await user.keyboard("{Backspace}");
await user.keyboard("{ArrowDown}");
```

### 조합 키 입력

Ctrl, Shift, Alt, Meta 등의 조합 키도 시뮬레이션할 수 있습니다.

```tsx
await user.keyboard("{Control>}a{/Control}");
await user.keyboard("{Shift>}{Tab}{/Shift}");
```

`{Control>}`은 Control 키를 누르는 동작이며, `{/Control}`은 해당 키를 해제하는 동작입니다.

### 단축키 테스트

```tsx
function Editor() {
  const [saved, setSaved] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      setSaved(true);
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      {saved ? "Saved" : "Not saved"}
    </div>
  );
}

test("Ctrl + S를 누르면 저장 상태로 변경됩니다.", async () => {
  const user = userEvent.setup();

  render(<Editor />);

  const editor = screen.getByText("Not saved");

  editor.focus();

  await user.keyboard("{Control>}s{/Control}");

  expect(screen.getByText("Saved")).toBeInTheDocument();
});
```

운영체제에 따라 단축키가 다를 수 있으므로 Mac 환경에서는 Meta 키를 사용하는 경우도 고려해야 합니다.

## 6. 텍스트 입력 상호작용

텍스트 입력은 `user.type()` 또는 `user.keyboard()`를 사용합니다.

### type

`user.type()`은 지정한 입력 요소에 문자열을 입력하는 동작을 시뮬레이션합니다.

```tsx
test("텍스트를 입력합니다.", async () => {
  const user = userEvent.setup();

  render(<SearchInput />);

  const input = screen.getByRole("textbox");

  await user.type(input, "React Testing");

  expect(input).toHaveValue("React Testing");
});
```

### clear

`user.clear()`는 입력 필드의 내용을 제거합니다.

```tsx
test("입력 필드의 내용을 초기화합니다.", async () => {
  const user = userEvent.setup();

  render(<SearchInput />);

  const input = screen.getByRole("textbox");

  await user.type(input, "React");
  await user.clear(input);

  expect(input).toHaveValue("");
});
```

### selectOptions

`user.selectOptions()`는 `select` 요소의 옵션을 선택합니다.

```tsx
test("옵션을 선택합니다.", async () => {
  const user = userEvent.setup();

  render(
    <select aria-label="Language">
      <option value="react">React</option>
      <option value="vue">Vue</option>
    </select>
  );

  const select = screen.getByRole("combobox", {
    name: "Language",
  });

  await user.selectOptions(select, "react");

  expect(select).toHaveValue("react");
});
```

다중 선택을 지원하는 `select` 요소에서는 여러 값을 배열로 전달할 수 있습니다.

```tsx
await user.selectOptions(select, ["react", "vue"]);
```

### deselectOptions

다중 선택 `select` 요소에서 선택된 옵션을 해제할 때는 `user.deselectOptions()`를 사용합니다.

```tsx
await user.deselectOptions(select, "react");
```

## 7. 폼 상호작용

폼 테스트에서는 입력값 변경, 유효성 검사, 제출 이벤트, 제출 이후의 화면 변경 등을 검증합니다.

```tsx
function LoginForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" required />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" required />

      <button type="submit">Login</button>

      {submitted && <p>Login submitted</p>}
    </form>
  );
}
```

```tsx
test("폼 입력 후 제출할 수 있습니다.", async () => {
  const user = userEvent.setup();

  render(<LoginForm />);

  await user.type(
    screen.getByLabelText("Email"),
    "user@example.com"
  );

  await user.type(
    screen.getByLabelText("Password"),
    "password123"
  );

  await user.click(
    screen.getByRole("button", { name: "Login" })
  );

  expect(
    screen.getByText("Login submitted")
  ).toBeInTheDocument();
});
```

폼 제출 테스트에서는 입력값이 올바르게 전달되는지뿐만 아니라 제출 이후의 상태 변경과 사용자 피드백도 함께 검증하는 것이 좋습니다.

### Form Validation

필수 입력값이나 유효하지 않은 값에 대한 검증도 사용자 관점에서 테스트할 수 있습니다.

```tsx
test("필수 입력값이 없으면 폼을 제출할 수 없습니다.", async () => {
  const user = userEvent.setup();

  render(<LoginForm />);

  await user.click(
    screen.getByRole("button", { name: "Login" })
  );

  expect(
    screen.queryByText("Login submitted")
  ).not.toBeInTheDocument();
});
```

브라우저의 기본 HTML 제약 검증과 애플리케이션에서 구현한 사용자 정의 검증은 서로 다른 동작입니다. 각 검증 로직에 맞는 테스트를 작성해야 합니다.

## 8. Focus와 Blur

포커스 이동은 키보드 접근성과 사용자 입력 흐름에서 중요한 요소입니다.

`user.tab()`을 사용하면 Tab 키를 통한 포커스 이동을 시뮬레이션할 수 있습니다.

```tsx
function FocusForm() {
  return (
    <>
      <input aria-label="First" />
      <input aria-label="Second" />
      <button>Submit</button>
    </>
  );
}
```

```tsx
test("Tab 키를 사용하여 포커스를 이동합니다.", async () => {
  const user = userEvent.setup();

  render(<FocusForm />);

  const first = screen.getByRole("textbox", {
    name: "First",
  });

  const second = screen.getByRole("textbox", {
    name: "Second",
  });

  first.focus();

  expect(first).toHaveFocus();

  await user.tab();

  expect(second).toHaveFocus();
});
```

`user.tab()`은 Tab 및 Shift + Tab을 통한 포커스 이동을 테스트하는 데 사용할 수 있습니다.

```tsx
await user.tab();
await user.tab({ shift: true });
```

특정 요소에 포커스를 직접 설정하거나 제거해야 하는 경우에는 DOM의 `focus()`와 `blur()`를 사용할 수도 있습니다.

```tsx
input.focus();

expect(input).toHaveFocus();

input.blur();

expect(input).not.toHaveFocus();
```

## 9. 파일 업로드

파일 업로드는 `user.upload()`를 사용하여 테스트할 수 있습니다.

```tsx
function FileUpload() {
  const [fileName, setFileName] = useState("");

  return (
    <>
      <input
        type="file"
        aria-label="Upload file"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            setFileName(file.name);
          }
        }}
      />

      {fileName && <p>{fileName}</p>}
    </>
  );
}
```

```tsx
test("파일을 업로드합니다.", async () => {
  const user = userEvent.setup();

  render(<FileUpload />);

  const file = new File(
    ["file content"],
    "example.txt",
    { type: "text/plain" }
  );

  await user.upload(
    screen.getByLabelText("Upload file"),
    file
  );

  expect(
    screen.getByText("example.txt")
  ).toBeInTheDocument();
});
```

여러 파일을 업로드하는 경우 파일 배열을 전달할 수 있습니다.

```tsx
const files = [
  new File(["first"], "first.txt", {
    type: "text/plain",
  }),
  new File(["second"], "second.txt", {
    type: "text/plain",
  }),
];

await user.upload(input, files);
```

파일 입력 요소에 `accept` 속성이 설정되어 있다면 해당 속성에 따른 파일 선택 제한도 테스트 환경에서 고려해야 합니다.

## 10. Clipboard 상호작용

클립보드 API는 `user.copy()`, `user.cut()`, `user.paste()`를 사용하여 테스트할 수 있습니다.

```tsx
test("텍스트를 복사하고 붙여넣습니다.", async () => {
  const user = userEvent.setup();

  render(
    <>
      <input aria-label="Source" defaultValue="React" />
      <input aria-label="Target" />
    </>
  );

  const source = screen.getByRole("textbox", {
    name: "Source",
  });

  const target = screen.getByRole("textbox", {
    name: "Target",
  });

  source.focus();

  await user.keyboard("{Control>}a{/Control}");
  await user.copy();

  target.focus();

  await user.paste();

  expect(target).toHaveValue("React");
});
```

클립보드 관련 테스트는 브라우저 환경과 테스트 환경의 API 지원 여부에 영향을 받을 수 있습니다. `userEvent.setup()`에서 제공하는 클립보드 동작을 사용하면 테스트 환경에서 관련 상호작용을 시뮬레이션할 수 있습니다.

## 11. 비동기 상호작용

사용자 동작 이후 비동기 작업이 수행되는 경우에는 상호작용과 화면 업데이트를 구분하여 테스트해야 합니다.

예를 들어 버튼 클릭 이후 API 요청이 발생하고, 응답에 따라 화면이 변경되는 경우가 있습니다.

```tsx
function SearchButton() {
  const [result, setResult] = useState("");

  const handleSearch = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    setResult("Search completed");
  };

  return (
    <>
      <button onClick={handleSearch}>Search</button>
      {result && <p>{result}</p>}
    </>
  );
}
```

```tsx
test("검색 완료 후 결과가 표시됩니다.", async () => {
  const user = userEvent.setup();

  render(<SearchButton />);

  await user.click(
    screen.getByRole("button", { name: "Search" })
  );

  expect(
    await screen.findByText("Search completed")
  ).toBeInTheDocument();
});
```

`user.click()`은 클릭 상호작용을 완료할 때까지 기다립니다. 그러나 클릭 핸들러 내부에서 시작된 별도의 비동기 작업이 모두 완료되었다는 의미는 아닙니다.

따라서 비동기 작업 이후 나타나는 요소를 검증할 때는 `findBy...` 쿼리나 `waitFor()`를 사용해야 합니다.

```tsx
await waitFor(() => {
  expect(screen.getByText("Search completed")).toBeInTheDocument();
});
```

비동기 상호작용 테스트에서는 다음 사항을 구분하는 것이 중요합니다.

- `await user.click()`: 사용자 클릭 동작의 완료를 기다립니다.
- `findBy...`: 특정 요소가 나타날 때까지 기다립니다.
- `waitFor()`: 지정한 검증 조건이 통과할 때까지 반복적으로 확인합니다.

## 12. Fake Timer와 user-event

`user-event`는 입력 동작을 시뮬레이션하는 과정에서 타이머를 사용할 수 있습니다.

따라서 Jest 또는 Vitest의 Fake Timer를 사용하는 테스트에서는 `userEvent.setup()`의 `advanceTimers` 옵션을 설정해야 할 수 있습니다.

```tsx
test("Fake Timer 환경에서 사용자 입력을 처리합니다.", async () => {
  vi.useFakeTimers();

  const user = userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  });

  render(<SearchInput />);

  await user.type(
    screen.getByRole("textbox"),
    "React"
  );

  expect(
    screen.getByRole("textbox")
  ).toHaveValue("React");

  vi.useRealTimers();
});
```

Jest를 사용하는 경우에는 다음과 같이 설정할 수 있습니다.

```tsx
const user = userEvent.setup({
  advanceTimers: jest.advanceTimersByTime,
});
```

Fake Timer를 사용하는 테스트에서는 타이머를 복원하는 작업도 중요합니다. 테스트가 실패하더라도 타이머 설정이 다른 테스트에 영향을 주지 않도록 `afterEach()` 등에서 복원하는 방식을 고려해야 합니다.

```tsx
afterEach(() => {
  vi.useRealTimers();
});
```

`delay` 옵션을 `null`로 설정하여 타이머 문제를 우회하는 방식보다는 `advanceTimers`를 사용하는 것이 권장됩니다.

## 13. 접근성을 고려한 상호작용 테스트

사용자 상호작용 테스트에서는 실제 사용자가 접근할 수 있는 방식으로 요소를 조회하는 것이 중요합니다.

React Testing Library는 `getByRole()`, `getByLabelText()` 등의 쿼리를 제공합니다.

```tsx
test("접근 가능한 방식으로 버튼을 조회하고 클릭합니다.", async () => {
  const user = userEvent.setup();

  render(
    <button type="button">
      Save
    </button>
  );

  const button = screen.getByRole("button", {
    name: "Save",
  });

  await user.click(button);

  expect(button).toBeInTheDocument();
});
```

다음과 같은 우선순위를 고려할 수 있습니다.

| 쿼리 | 사용 목적 |
|---|---|
| `getByRole()` | 접근성 역할과 이름을 기준으로 요소 조회 |
| `getByLabelText()` | 폼 입력 요소의 레이블을 기준으로 조회 |
| `getByPlaceholderText()` | Placeholder를 기준으로 조회 |
| `getByText()` | 화면에 표시된 텍스트를 기준으로 조회 |
| `getByTestId()` | 다른 방식으로 조회하기 어려운 요소를 식별 |

가능하면 `getByRole()`과 `getByLabelText()`를 우선적으로 사용합니다.

이는 테스트가 실제 사용자의 접근 방식과 가까워지도록 하고, 컴포넌트의 접근성 문제를 발견하는 데도 도움이 됩니다.

## 14. 사용자 상호작용 테스트 작성 원칙

사용자 상호작용 테스트를 작성할 때는 다음 원칙을 고려해야 합니다.

### 사용자 관점에서 테스트 작성

컴포넌트 내부의 구현 세부 사항보다 사용자가 실제로 수행하는 동작과 화면에 나타나는 결과를 중심으로 테스트합니다.

```tsx
// 권장: 사용자 동작과 화면 결과 검증
await user.click(
  screen.getByRole("button", { name: "Open" })
);

expect(
  screen.getByRole("dialog")
).toBeInTheDocument();
```

내부 상태나 특정 이벤트 핸들러의 호출 여부만 검증하는 테스트는 사용자에게 제공되는 기능을 충분히 검증하지 못할 수 있습니다.

### user-event 우선 사용

일반적인 사용자 동작은 `user-event`를 사용합니다.

특정 DOM 이벤트 자체를 직접 발생시켜야 하는 경우에만 `fireEvent`를 사용하는 것이 좋습니다.

### 상호작용과 결과를 함께 검증

사용자 동작을 수행했다는 사실만 확인하는 것이 아니라 해당 동작으로 인해 기대한 결과가 나타났는지 검증해야 합니다.

```tsx
await user.click(button);

expect(screen.getByText("Completed")).toBeInTheDocument();
```

### 비동기 동작 구분

사용자 상호작용의 완료와 API 요청 또는 비동기 상태 변경의 완료를 구분해야 합니다.

비동기 작업 이후의 화면 변경은 `findBy...` 또는 `waitFor()`를 사용하여 검증합니다.

### 접근성 기반 요소 조회

테스트에서는 사용자가 실제로 인식하고 접근할 수 있는 요소를 기준으로 조회하는 것이 좋습니다.

접근성 역할과 레이블을 활용하면 테스트 코드의 의도가 명확해지고 접근성 문제도 함께 확인할 수 있습니다.

## 참고 자료

- React Testing Library 공식 문서: https://testing-library.com/docs/react-testing-library/intro/
- Testing Library Queries: https://testing-library.com/docs/queries/about/
- Testing Library User Interactions: https://testing-library.com/docs/user-event/intro/
- user-event v14 공식 문서: https://testing-library.com/docs/user-event/intro/
- user-event v14 API: https://testing-library.com/docs/user-event/utility/
- user-event GitHub 저장소: https://github.com/testing-library/user-event
- Jest 공식 문서: https://jestjs.io/docs/getting-started
- Vitest 공식 문서: https://vitest.dev/guide/