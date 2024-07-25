import "./todoList.css";
import { useEffect, useRef, useState } from "react";

type TodoListProps = {
  newTodo: string;
  listId: string | undefined;
  setSelectListId: React.Dispatch<React.SetStateAction<string | undefined>>;
  controlEditWindow: React.RefObject<HTMLSectionElement>;
  controlInputTodo: React.RefObject<HTMLInputElement>;
  isComplete: boolean;
};

const TodoList: React.FC<TodoListProps> = ({
  newTodo,
  listId,
  setSelectListId,
  controlEditWindow,
  controlInputTodo,
  isComplete,
}) => {
  const TODO_COMPLETE = true;
  const TODO_NOT_COMPLETE = false;
  const [isChecked, setIsChecked] = useState(isComplete);
  const checkBoxRef = useRef<HTMLInputElement>(null);
  const todoListRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const clickEditBtn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setSelectListId(listId);
    controlInputTodo.current!.value = newTodo;

    if (controlEditWindow.current) {
      controlEditWindow.current.style.display = "block";
      controlInputTodo.current!.focus();
    }
  };

  const handleCheckbox = () => {
    if (isChecked === TODO_COMPLETE) {
      setIsChecked(TODO_NOT_COMPLETE);
      todoListRef.current!.style.color = "black";
    } else {
      setIsChecked(TODO_COMPLETE);
      todoListRef.current!.style.color = "rgba(0,0,0,0.5)";
    }
  };

  return (
    <div className="todo_list">
      <div className="check_box">
        <input
          type="checkbox"
          onChange={handleCheckbox}
          ref={checkBoxRef}
        ></input>
      </div>
      <div className="list_box" onClick={clickEditBtn}>
        <div className="list" ref={todoListRef}>
          <div
            className="line"
            ref={lineRef}
            style={isChecked ? { display: "block" } : { display: "none" }}
          ></div>
          {newTodo}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
