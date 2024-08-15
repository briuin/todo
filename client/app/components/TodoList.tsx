import React, { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import * as signalR from "@microsoft/signalr";
import {
  createTodoItem,
  deleteTodoItem,
  getTodoItems,
  mapDTOtoModel,
  updateTodoItem,
} from "../services/todo.service";
import {
  CreateTodoItemDto,
  Todo,
  TodoItemDto,
  TodoItemStatus,
  UpdateTodoItemDto,
} from "../todo.models";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todoItems = await getTodoItems();
        setTodos(todoItems);
      } catch (error) {
        setError("Failed to fetch todo items");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5064/todoHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    setConnection(connection);
    connection.start().then(() => {
      console.log("Connected to SignalR");
    });

    connection.on("ReceiveTodos", (updatedTodos: TodoItemDto[]) => {
      console.log("Receive");
      setTodos(updatedTodos.map((x) => mapDTOtoModel(x)));
    });

    connection.on("ReceiveUpdate", (message) => {
        console.log("Update received: ", message);
        fetchTodos();
    });

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const handleCreate = async () => {
    try {
      const dto: CreateTodoItemDto = {
        name: newTodo,
        dueDate: new Date(),
        status: TodoItemStatus.Pending,
      };
      await createTodoItem(dto);
      if (connection) {
        connection.invoke("SendUpdate", "A new todo item has been created.");
      }
    } catch (error) {
      console.error("Failed to create todo item", error);
      setError("Failed to create todo item");
    }
  };

  const handleUpdate = async (id: number, updatedTodo: UpdateTodoItemDto) => {
    try {
      await updateTodoItem(id, updatedTodo);
      if (connection) {
        connection.invoke("SendUpdate", "A todo item has been updated.");
      }
    } catch (error) {
      console.error("Failed to update todo item", error);
      setError("Failed to update todo item");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodoItem(id);
      if (connection) {
        connection.invoke("SendUpdate", "A todo item has been deleted.");
      }
    } catch (error) {
      console.error("Failed to delete todo item", error);
      setError("Failed to delete todo item");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
          onClick={handleCreate}
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
            onDelete={() => handleDelete(todo.id)}
            onUpdate={(newTitle) =>
              handleUpdate(todo.id, {
                name: newTitle,
                dueDate: new Date(),
                status: TodoItemStatus.Pending,
              })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
