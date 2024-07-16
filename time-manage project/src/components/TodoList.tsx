import "./todoList.css";

type TodoListProps = {
  newTodo: string;
  listId: string | undefined;
  setSelectListId: React.Dispatch<React.SetStateAction<string | undefined>>;
  controlEditWindow: React.RefObject<HTMLSectionElement>;
  controlInputTodo: React.RefObject<HTMLInputElement>;
};

const TodoList: React.FC<TodoListProps> = ({
  newTodo,
  listId,
  setSelectListId,
  controlEditWindow,
  controlInputTodo,
}) => {
  const clickEditBtn = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //다시 입력 받을 수 있거나
    e.stopPropagation();

    setSelectListId(listId);
    controlInputTodo.current.value = newTodo;
    if (controlEditWindow.current) {
      controlEditWindow.current.style = "display : block";
      controlInputTodo.current.focus();
    }
  };

  return (
    <div className="todo_list">
      <div className="check_box">
        <input type="checkbox"></input>
      </div>
      <div className="list" onClick={clickEditBtn}>
        {newTodo}
      </div>
    </div>
  );
};

export default TodoList;
