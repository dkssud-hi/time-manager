import React, { useEffect, useRef, useState } from "react";
import TodoList from "../components/TodoList";
import "./home.css";

function Home() {
  const POMODORO_MODE = "pomodoro";
  const INFINITE_FOCUS_MODE = "infiniteFocus";
  const now = new Date();

  type timerModeName = "pomodoro" | "infiniteFocus";

  const [timerMode, setTimerMode] = useState<timerModeName>("pomodoro");
  const [Todo, setNewTodo] = useState<React.ReactNode[]>([]);
  const [selectListId, setSelectListId] = useState<string | undefined>();
  const pomodoroModeBtnRef = useRef(null);
  const infiniteFocusModeBtnRef = useRef(null);
  const inputEditTodo = useRef<HTMLInputElement>(null);
  const inputTodoRef = useRef<HTMLInputElement>(null);
  const addNewTodoWindow = useRef<HTMLSectionElement>(null);
  const editTodoWindow = useRef<HTMLSectionElement>(null);

  const changeToPomodoroMode = function (presentTimerMode: timerModeName) {
    if (presentTimerMode === POMODORO_MODE) {
      console.log("타이머 모드가 이미 포모도로 모드입니다.");
    } else {
      setTimerMode(POMODORO_MODE);
      pomodoroModeBtnRef.current!.style = "color:black";
      infiniteFocusModeBtnRef.current!.style = "color:white";
      console.log("타이머 모드가 포모도로모드로 바뀌었습니다.");
    }
  };

  const changeToInfiniteFocusMode = function (presentTimerMode: timerModeName) {
    if (presentTimerMode === INFINITE_FOCUS_MODE) {
      console.log("타이머가 이미 무한집중 모드입니다.");
    } else {
      setTimerMode(INFINITE_FOCUS_MODE);
      pomodoroModeBtnRef.current!.style = "color:white";
      infiniteFocusModeBtnRef.current!.style = "color:black";
      console.log("타이머가 무한 집중모드로 바뀌었습니다.");
    }
  };

  const openAddTodoBox = function (): void {
    addNewTodoWindow.current!.style = "display:block";
    inputTodoRef.current.focus();
  };

  //리스트 추가창 이벤트
  const addNewTodoList = (event) => {
    if (inputTodoRef.current!.value.length <= 0) {
      alert("할 일을 입력해주세요!");
      //한자라도 입력이 안되어있으면 버튼 비활성화로 변경
    } else {
      const year = now.getFullYear().toString();
      const month = now.getMonth().toString();
      const day = now.getDate().toString();
      const hours = now.getHours().toString();
      const minutes = now.getMinutes().toString();
      const seconds = now.getSeconds().toString();
      const newKey = year + month + day + hours + minutes + seconds;

      setNewTodo([
        ...Todo,
        <TodoList
          key={newKey}
          newTodo={inputTodoRef.current!.value}
          listId={newKey}
          setSelectListId={setSelectListId}
          controlEditWindow={editTodoWindow}
          controlInputTodo={inputEditTodo}
        />, //key값 교체 필요
      ]);
      inputTodoRef.current!.value = "";
      addNewTodoWindow.current!.style = "display:none";
    }
  };

  const cancelAddNewTodo = (event) => {
    //input태그의 value 정리후 모달창 닫기.
    inputTodoRef.current!.value = "";
    addNewTodoWindow.current!.style = "display:none";
  };

  //리스트 편집창 이벤트
  const deleteList = () => {
    const reNewTodoList = Todo.filter(
      (todoList) => todoList.props.listId !== selectListId
    );
    setNewTodo(reNewTodoList);
    inputEditTodo.current!.value = "";
    editTodoWindow.current.style = "display:none";
  };
  const saveList = () => {
    let index = -1;
    for (let i = 0; i < Todo.length; i++) {
      if (Todo[i].props.listId === selectListId) {
        index = i;
        break;
      }
    }

    const tempTodo = [...Todo];
    if (inputEditTodo.current.value) {
      tempTodo.splice(
        index,
        1,
        <TodoList
          key={selectListId}
          newTodo={inputEditTodo.current!.value}
          listId={selectListId}
          setSelectListId={setSelectListId}
          controlEditWindow={editTodoWindow}
          controlInputTodo={inputEditTodo}
        />
      );
      setNewTodo(tempTodo);
      inputEditTodo.current!.value = "";
      editTodoWindow.current.style = "display:none";
    } else {
      alert("수정사항을 입력하세요.");
    }
  };
  const cancelEditList = () => {
    inputEditTodo.current!.value = "";
    editTodoWindow.current.style = "display:none";
  };

  return (
    <main className="timer_page">
      <section className="add_todo_box" ref={addNewTodoWindow}>
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          ref={inputTodoRef}
        ></input>
        <div>
          <button onClick={addNewTodoList}>추가</button>
          <button onClick={cancelAddNewTodo}>닫기</button>
        </div>
      </section>
      <section className="edit_todo_box" ref={editTodoWindow}>
        <input
          type="text"
          placeholder="할 일을 입력해주세요"
          ref={inputEditTodo}
        ></input>
        <div>
          <button onClick={deleteList}>삭제</button>
          <button onClick={saveList}>저장</button>
          <button onClick={cancelEditList}>닫기</button>
        </div>
      </section>
      <div className="timer_page_innerbox">
        <section className="timer_and_todo_section">
          <section className="timer_box">
            <div className="timer_mode_area">
              <div
                onClick={() => changeToPomodoroMode(timerMode)}
                ref={pomodoroModeBtnRef}
              >
                포모도로
              </div>{" "}
              |{" "}
              <div
                style={{ color: "white" }}
                onClick={() => changeToInfiniteFocusMode(timerMode)}
                ref={infiniteFocusModeBtnRef}
              >
                무한집중
              </div>
            </div>
            <div className="full_screen_mode_btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
              >
                <path
                  d="M0 0V12.0952L4.5357 7.5595L9.0714 12.0952L12.0952 9.0714L7.5595 4.5357L12.0952 0H0ZM15.119 12.0952L12.0952 15.119L16.6309 19.6547L12.0952 24.1904H24.1904V12.0952L19.6547 16.6309L15.119 12.0952Z"
                  fill="#FAFAFA"
                />
              </svg>
            </div>
            <div className="timer_area">
              <div className="select_to-do">할 일</div>
              <div className="timer">25 : 00</div>
              <div className="control_timer">시작</div>
            </div>
          </section>
          <section className="todo_list_box">
            <div className="title_area">
              <div className="title">할 일 목록</div>
              <div className="add_list_btn" onClick={openAddTodoBox}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="23"
                  viewBox="0 0 22 23"
                  fill="none"
                >
                  <path
                    d="M20.4286 9.35257H13.6714C13.4979 9.35257 13.3571 9.21186 13.3571 9.03829V2.28115C13.3571 1.41342 12.6534 0.709717 11.7857 0.709717H10.2143C9.34656 0.709717 8.64286 1.41342 8.64286 2.28115V9.03829C8.64286 9.21186 8.50215 9.35257 8.32857 9.35257H1.57143C0.703705 9.35257 0 10.0563 0 10.924V12.4954C0 13.3632 0.703705 14.0669 1.57143 14.0669H8.32857C8.50215 14.0669 8.64286 14.2076 8.64286 14.3811V21.1383C8.64286 22.006 9.34656 22.7097 10.2143 22.7097H11.7857C12.6534 22.7097 13.3571 22.006 13.3571 21.1383V14.3811C13.3571 14.2076 13.4979 14.0669 13.6714 14.0669H20.4286C21.2963 14.0669 22 13.3632 22 12.4954V10.924C22 10.0563 21.2963 9.35257 20.4286 9.35257Z"
                    fill="black"
                  />
                </svg>
              </div>
            </div>
            <div className="list_area">{Todo}</div>
          </section>
        </section>
        <section className="focus_time_and_timeline_section">
          <section className="total_focus_time_box">시간 영역</section>
          <section className="time_line_box">타임라인 영역</section>
        </section>
      </div>
    </main>
  );
}

export default Home;
