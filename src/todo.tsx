import React from '../lib/react'
let i = 0

export default function todo() {
  const [count, setCount] = React.useState(1);
  const [todo, setTodo] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [todoHistory, setTodoHistory] = React.useState([]);

  React.useEffect(() => {
    const fetchTodo = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${count}`);
        const data = await response.json();
        setTodo(data);
        setTodoHistory(prevHistory => [...prevHistory, { id: count, title: data.title }]);
      } catch (error) {
        console.error('Error fetching todo:', error);
        setTodo({ title: 'Failed to fetch todo. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodo();
  }, [count]);

  const handleIncrement = () => setCount(prevCount => Math.min(prevCount + 1, 200));
  const handleDecrement = () => setCount(prevCount => Math.max(prevCount - 1, 1));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl mb-4 justify-center">Todo ID: {count}</h2>
          <div className="flex justify-center space-x-2 mb-4">
            <button className="btn btn-primary" onClick={handleDecrement}>Previous</button>
            <button className="btn btn-primary" onClick={handleIncrement}>Next</button>
          </div>
          <div className="divider"></div>
          <h3 className="text-xl mb-2 text-center">Todo Item:</h3>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <input type="checkbox" checked={todo?.completed} className="checkbox" readOnly />
              <p className="text-sm">{todo?.title}</p>
            </div>
          )}
          <div className="divider"></div>
          <h3 className="text-xl mb-2">Todo History:</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {todoHistory.slice().reverse().map((item, index) => (
                  <tr key={index} className="hover">
                    <td>{item.id}</td>
                    <td>{item.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
