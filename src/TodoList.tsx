import React, { useState, useEffect } from "../lib/react";

const TodoItem = ({ todo, index, toggleTodo, removeTodo }) => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  useEffect(() => {
    console.log("TodoItem mounted", count);
    return () => {
      console.log("TodoItem unmounted", count);
    };
  }, [count])

  return (
    <li
      className="flex items-center justify-between bg-base-200 p-3 rounded-lg"
    >
      <div className="flex items-center">
        <button className="btn" onclick={() => setCount(count + 1)}>
          {count}
        </button>
        <input type="text" value={text} onInput={(e) => {
          setText(e.target.value)
        }} />
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
};

const TodoList = () => {
  useEffect(() => {
    console.log("List mounted");
    return () => {
      console.log("List unmounted");
    };
  }, [])

  const [todos, setTodos] = useState<{ text: string; completed: boolean, id: number }[]>(
    []
  );
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim() !== "") {
      setTodos([...todos, { text: text, completed: false, id: Math.random() }]);
      setText("");
    }
  };

  const onEnter = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      addTodo();
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
          onChange={(e) => {
            setText(e.target.value)
          }}
          className="input input-bordered flex-grow mr-2"
          placeholder="Add a new todo"
          onKeyDown={onEnter}
        />
        <button onClick={addTodo} className="btn btn-primary">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            index={index}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
