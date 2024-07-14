import React, { useState } from "../lib/react";

const TodoList = () => {
  const [todos, setTodos] = useState<{ text: string; completed: boolean }[]>(
    []
  );
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim() !== "") {
      setTodos([...todos, { text: text, completed: false }]);
      setText("");
    }
  };

  const onEnter = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      addTodo()
    }
  };

  const toggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const removeTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={text}
          onInput={(e) => setText(e.target.value)}
          className="input input-bordered flex-grow mr-2"
          placeholder="Add a new todo"
          onKeydown={onEnter}
        />
        <button onClick={addTodo} className="btn btn-primary">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo, index) => {
          return (
            <li
              key={index}
              className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                  className="checkbox mr-2"
                />
                <span className={todo.completed ? "line-through" : ""}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => removeTodo(index)}
                className="btn btn-error btn-sm"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;
