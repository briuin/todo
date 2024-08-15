import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import * as signalR from "@microsoft/signalr";

interface TodoHttpResponse {
  id: number;
  name: string;
  description: string;
  dueDate: Date;
  status: number;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5064/todoHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    connection.start().then(() => {
      console.log("Connected to SignalR");
    });

    connection.on("ReceiveTodos", (updatedTodos: TodoHttpResponse[]) => {
      console.log("Receive");
      setTodos(
        updatedTodos.map((x) => ({
          id: x.id,
          title: x.name,
          completed: x.status !== 0,    
        }))
      );
    });

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const updatedTodos = [
        ...todos,
        { id: 5, title: newTodo, completed: false },
      ];
      setTodos(updatedTodos);
      setNewTodo("");
      sendUpdate(updatedTodos);
    }
  };

  const sendUpdate = (updatedTodos: Todo[]) => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5064/todoHub")
      .build();

    connection.start().then(() => {
      connection.invoke("UpdateTodos", updatedTodos);
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
          className="flex-grow p-2 border border-gray-300 rounded-l"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      <div className="space-y-4">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            title={todo.title}
            completed={todo.completed}
            onToggle={() => {}}
            onDelete={() => {}}
            onUpdate={(newTitle) => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
