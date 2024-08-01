import React, { useEffect, useRef, useState } from "react";
import TodoList from "../components/TodoList";
import TimeLineItem from "../components/TimeLineItem";
import "./home.css";

function Home() {
  const POMODORO_MODE = "pomodoro";
  const INFINITE_FOCUS_MODE = "infiniteFocus";
  const WORK_DURATION = 10;
  const BREAK_DURATION = 5;
  const RECORD_INTERVAL = 5 * 60 * 1000; //5분
  const now = new Date();

  type timerModeName = "pomodoro" | "infiniteFocus";
  type intervalID = number;

  const [timerMode, setTimerMode] = useState<timerModeName>("pomodoro");
  const [Todo, setNewTodo] = useState<React.ReactNode[]>([]);
  const [TimeLineItems, setTimeLineItems] = useState<React.ReactNode[]>([]);
  const [selectListId, setSelectListId] = useState<string | undefined>();
  const [seconds, setSeconds] = useState<number>(WORK_DURATION);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [latestTime, setLatestTime] = useState<null | Date>(null);

  const startHourRef = useRef<number>();
  const startMinuitesRef = useRef<number>();
  const latestRef = useRef<null | Date>(null);
  const recordWorkDurationRef = useRef<intervalID>();

  const onFocusBtnRef = useRef<HTMLButtonElement>(null);
  const onBreakBtnRef = useRef<HTMLButtonElement>(null);
  const selectToDoRef = useRef<HTMLDivElement>(null);
  const controlTimerBoxRef = useRef<HTMLDivElement>(null);
  const timerBoxRef = useRef<HTMLDivElement>(null);
  const startTimerBtnRef = useRef<HTMLButtonElement>(null);
  const endTimerBtnRef = useRef<HTMLButtonElement>(null);
  const workDurationRef = useRef<number>(WORK_DURATION);
  const breakDurationRef = useRef<number>(BREAK_DURATION);
  const editSettingTimeWindowRef = useRef<HTMLSectionElement>(null);
  const minuitesInputRef = useRef<HTMLInputElement>(null);
  const isBreakRef = useRef<boolean>(false);
  const timerRef = useRef<intervalID>();
  const pomodoroModeBtnRef = useRef<HTMLDivElement>(null);
  const infiniteFocusModeBtnRef = useRef<HTMLDivElement>(null);
  const inputEditTodo = useRef<HTMLInputElement>(null);
  const inputTodoRef = useRef<HTMLInputElement>(null);
  const addNewTodoWindow = useRef<HTMLSectionElement>(null);
  const editTodoWindow = useRef<HTMLSectionElement>(null);

  useEffect(() => {
    timerStateChange();
    setTimeLine();
  }, []);

  //isRunning이 의존성 타이머시작 이벤트 클릭시 타이머 진행
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSecondsLeft) => {
          return prevSecondsLeft - 1;
        });
      }, 1000);

      //5분 간격으로 총 집중시간 업데이트.
      if (!isBreakRef.current) {
        recordWorkDurationRef.current = setInterval(() => {
          //5분 간격으로 현재 시간 latestRef에 저장
          const now = new Date();
          setLatestTime(now);
        }, 3000);
      }
    }

    //타이머 종료/정지시 intervalId 해제
    return () => {
      clearInterval(timerRef.current);
      if (isBreakRef.current) {
        clearInterval(recordWorkDurationRef.current);
        //타이머 종료,정지 시점의 시간 저장
        const now = new Date();
        setLatestTime(now);
      }
    };
  }, [isRunning]);

  //집중시간 업데이트마다 타임라인컴포넌트 업데이트
  useEffect(() => {
    setTimeLine();
  }, [latestTime]);

  useEffect(() => {
    if (seconds === 0) {
      setIsRunning(false);
      isBreakRef.current = !isBreakRef.current;
      setSeconds(
        isBreakRef.current ? breakDurationRef.current : workDurationRef.current
      );
      timerStateChange();
    }
  }, [seconds]);

  // 키다운 이벤트 관련 코드
  const keyDownEvent = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const addNewTodoWindowDisplayStyle = window.getComputedStyle(
      addNewTodoWindow.current
    ).display;
    const editTodoWindowDisplayStyle = window.getComputedStyle(
      editTodoWindow.current
    ).display;
    const editSettingTimeWindowDisplayStyle = window.getComputedStyle(
      editSettingTimeWindowRef.current
    ).display;

    if (addNewTodoWindowDisplayStyle === "block") {
      if (event.key === "Enter") {
        addNewTodoList();
      } else if (event.key === "Escape") {
        cancelAddNewTodo();
      }
    } else if (editTodoWindowDisplayStyle === "block") {
      if (event.key === "Enter") {
        saveList();
      } else if (event.key === "Escape") {
        cancelEditList();
      }
    } else if (editSettingTimeWindowDisplayStyle === "block") {
      if (event.key === "Enter") {
        saveSettingTime();
      } else if (event.key === "Escape") {
        cancelSettingTime();
      }
    }
  };

  //타임라인 관련 코드
  const setTimeLine = () => {
    const tempArr = new Array(25).fill(0);
    const arr: React.ReactNode[] = [];

    tempArr.forEach((val, idx) => {
      arr.push(<TimeLineItem key={idx} time={idx} latestTime={latestTime} />);
    });

    setTimeLineItems(arr);
  };

  //타이머 관련 코드
  const timerStateChange = () => {
    if (isBreakRef.current) {
      onFocusBtnRef.current!.style.background = "rgba(50,50,50, 0)";
      onBreakBtnRef.current!.style.background = "rgba(50,50,50, 0.34)";
      timerBoxRef.current!.style.background = "rgba(30, 144, 255, 0.85)";
      startTimerBtnRef.current!.style.color = "rgba(30, 144, 255, 0.85)";
      endTimerBtnRef.current!.style.color = "rgba(30, 144, 255, 0.85)";
      selectToDoRef.current!.style.visibility = "hidden";
    } else {
      onFocusBtnRef.current!.style.background = "rgba(50,50,50, 0.34)";
      onBreakBtnRef.current!.style.background = "rgba(50,50,50, 0)";
      timerBoxRef.current!.style.background = "rgba(255, 63, 63, 0.85)";
      startTimerBtnRef.current!.style.color = "rgba(255, 63, 63, 0.85)";
      endTimerBtnRef.current!.style.color = "rgba(255, 63, 63, 0.85)";
      selectToDoRef.current!.style.visibility = "visible";
    }
  };
  const timerStateOnFocus = () => {
    isBreakRef.current = !isBreakRef.current;
    setSeconds(
      isBreakRef.current ? breakDurationRef.current : workDurationRef.current
    );
    timerStateChange();
  };
  const timerStateOnBreak = () => {
    isBreakRef.current = !isBreakRef.current;
    setSeconds(
      isBreakRef.current ? breakDurationRef.current : workDurationRef.current
    );
    timerStateChange();
  };
  const changeToPomodoroMode = (presentTimerMode: timerModeName) => {
    if (presentTimerMode === POMODORO_MODE) {
      console.log("타이머 모드가 이미 포모도로 모드입니다.");
    } else {
      setTimerMode(POMODORO_MODE);
      pomodoroModeBtnRef.current!.style.color = "black";
      infiniteFocusModeBtnRef.current!.style.color = "white";
      console.log("타이머 모드가 포모도로모드로 바뀌었습니다.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  const startOrStopPomodoroTimerEvent = () => {
    const now = new Date();
    startHourRef.current = now.getHours();
    startMinuitesRef.current = now.getMinutes();
    setIsRunning((prev) => !prev);
  };

  const endPomodoroTimerEvent = () => {
    //타이머 종료 이벤트 발생
    setIsRunning(false);
    //모달창으로 집중 or 휴식을 끝내겠냐는 알림 띄워주기(체크시 다시보지않음 포함)
    isBreakRef.current = !isBreakRef.current;
    setSeconds(
      isBreakRef.current ? breakDurationRef.current : workDurationRef.current
    );

    //타이머 종료시 isBreakRef의 여부에 따라서 타이머의 테마 변경해주기.
    timerStateChange();
  };

  //시간 설정 이벤트
  const openEdtiSettingTimeBox = () => {
    editSettingTimeWindowRef.current.style.display = "block";
    minuitesInputRef.current!.focus();
  };

  const saveSettingTime = () => {
    const editMinuites = Number(minuitesInputRef.current!.value);
    if (editMinuites > 0) {
      if (isBreakRef.current) {
        breakDurationRef.current = editMinuites * 60;
        setSeconds(breakDurationRef.current);
      } else {
        workDurationRef.current = editMinuites * 60;
        setSeconds(workDurationRef.current);
      }

      minuitesInputRef.current!.value = "";
      editSettingTimeWindowRef.current.style.display = "none";
    } else {
      alert("1 이상의 수를 입력해주세요!");
      minuitesInputRef.current!.value = "";
    }
  };

  const cancelSettingTime = () => {
    minuitesInputRef.current!.value = "";
    editSettingTimeWindowRef.current.style.display = "none";
  };

  //리스트 추가창 이벤트
  const openAddTodoBox = function (): void {
    addNewTodoWindow.current!.style.display = "block";
    inputTodoRef.current!.focus();
  };

  const addNewTodoList = () => {
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
          isComplete={false}
        />, //key값 교체 필요
      ]);

      inputTodoRef.current!.value = "";
      addNewTodoWindow.current!.style.display = "none";
    }
  };

  const cancelAddNewTodo = () => {
    //input태그의 value 정리후 모달창 닫기.
    inputTodoRef.current!.value = "";
    addNewTodoWindow.current!.style.display = "none";
  };

  //리스트 편집창 이벤트
  const deleteList = () => {
    const reNewTodoList = Todo.filter(
      (todoList) => todoList.props.listId !== selectListId
    );
    setNewTodo(reNewTodoList);
    inputEditTodo.current!.value = "";
    editTodoWindow.current.style.display = "none";
  };
  const saveList = () => {
    let index = -1;
    console.log(Todo);
    for (let i = 0; i < Todo.length; i++) {
      if (Todo[i].props.listId === selectListId) {
        index = i;
        break;
      }
    }
    console.log(index);
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
          isComplete={Todo[index].props.isComplete}
        />
      );
      setNewTodo(tempTodo);
      inputEditTodo.current!.value = "";
      editTodoWindow.current.style.display = "none";
    } else {
      alert("수정사항을 입력하세요.");
    }
  };
  const cancelEditList = () => {
    inputEditTodo.current!.value = "";
    editTodoWindow.current.style.display = "none";
  };

  //인풋박스 focus, blur 이벤트 함수

  const handleFocus = (event) => {
    event.target.style.borderBottom = "1px solid dodgerblue"; // 포커스 시 밑줄 색 변경
  };

  const handleBlur = (event) => {
    event.target.style.borderBottom = "1px solid black"; // 포커스 해제 시 원래 색으로 변경
  };

  return (
    <main className="timer_page">
      <section className="modal_box" ref={addNewTodoWindow}>
        <div className="modal_title">할일 목록 추가</div>
        <div className="modal_inner_box">
          <input
            type="text"
            placeholder="할 일을 입력해주세요"
            ref={inputTodoRef}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={keyDownEvent}
            className="input_box"
          />
          <div className="button_box">
            <div className="button_inner_box">
              <div id="delete_and_save_btns">
                <button onClick={addNewTodoList} id="add_btn">
                  추가
                </button>
                <button onClick={cancelAddNewTodo} id="close_btn">
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="modal_box" ref={editTodoWindow}>
        <div className="modal_inner_box">
          <div className="modal_title">할일 목록 편집</div>
          <input
            type="text"
            placeholder="할 일을 입력해주세요"
            ref={inputEditTodo}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={keyDownEvent}
            className="input_box"
          />
          <div className="button_box">
            <div className="button_inner_box">
              <button onClick={deleteList} id="delete_btn">
                삭제
              </button>
              <div id="delete_and_save_btns">
                <button onClick={saveList} onKeyDown={saveList} id="save_btn">
                  저장
                </button>
                <button onClick={cancelEditList} id="close_btn">
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="modal_box" ref={editSettingTimeWindowRef}>
        <div className="modal_inner_box">
          <div className="modal_title">타이머 시간설정</div>
          <input
            type="number"
            min="1"
            ref={minuitesInputRef}
            className="input_box"
            id="minuites"
            onKeyDown={keyDownEvent}
          />
          <div className="button_box">
            <div className="button_inner_box">
              <div id="delete_and_save_btns">
                <button onClick={saveSettingTime} id="add_btn">
                  저장
                </button>
                <button onClick={cancelSettingTime} id="close_btn">
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="timer_page_innerbox">
        <section className="timer_and_todo_section">
          <section className="timer_box" ref={timerBoxRef}>
            <div className="timer_top_area">
              <div
                className="timer_mode_area"
                onClick={() => changeToPomodoroMode(timerMode)}
                ref={pomodoroModeBtnRef}
              >
                모드변경
              </div>
              <div className="state_btn_box">
                <button
                  className="state_btn"
                  id="focus_btn"
                  ref={onFocusBtnRef}
                  onClick={timerStateOnFocus}
                >
                  집 중
                </button>
                <button
                  className="state_btn"
                  id="break_btn"
                  ref={onBreakBtnRef}
                  onClick={timerStateOnBreak}
                >
                  휴 식
                </button>
              </div>
              <div className="full_screen_mode_btn">전체화면</div>
            </div>
            <div className="timer_area">
              <div className="select_to-do" ref={selectToDoRef}>
                할 일
              </div>
              <div className="timer" onClick={openEdtiSettingTimeBox}>
                {formatTime(seconds)}
              </div>
              <div className="control_timer_box" ref={controlTimerBoxRef}>
                <button
                  className="control_btn"
                  onClick={startOrStopPomodoroTimerEvent}
                  ref={startTimerBtnRef}
                >
                  {isRunning ? "정 지" : "시 작"}
                </button>
                <button
                  className="control_btn"
                  onClick={endPomodoroTimerEvent}
                  ref={endTimerBtnRef}
                >
                  종 료
                </button>
              </div>
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
          <section className="time_line_box">
            <div className="time_line_inner_box">{TimeLineItems}</div>
          </section>
        </section>
      </div>
    </main>
  );
}

export default Home;
