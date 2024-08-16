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
import ConfirmationModal from "./ConfirmationModal";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<CreateTodoItemDto>({
    name: "",
    dueDate: new Date(),
    description: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      dueDate: new Date(value),
    }));
  };

  const handleCreate = async () => {
    setIsLoadingApi(true);
    try {
      await createTodoItem(newTodo);
      if (connection) {
        connection.invoke("SendUpdate", "A new todo item has been created.");
      }
      setNewTodo({
        name: "",
        dueDate: new Date(),
        description: "",
      });
    } catch (error) {
      console.error("Failed to create todo item", error);
      setError("Failed to create todo item");
    } finally {
      setIsLoadingApi(false);
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

  const handleDelete = async () => {
    if (!todoToDelete) return;

    try {
      await deleteTodoItem(todoToDelete);
      if (connection) {
        connection.invoke("SendUpdate", "A todo item has been deleted.");
      }
    } catch (error) {
      console.error("Failed to delete todo item", error);
      setError("Failed to delete todo item");
    } finally {
      setIsModalOpen(false);
      setTodoToDelete(null);
    }
  };
  const openDeleteModal = (id: number) => {
    setTodoToDelete(id);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setTodoToDelete(null);
  };

  if (loading)
    return <div className="text-center text-lg text-gray-700">Loading...</div>;
  if (error)
    return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="p-4 w-full max-w-full mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>

      {/* Form to create a new Todo */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 lg:flex lg:space-x-4 max-w-[720px] ml-auto mr-auto">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Add New Todo</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Todo Name"
              value={newTodo.name}
              onChange={handleInputChange}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              name="dueDate"
              value={newTodo.dueDate.toISOString().substr(0, 10)}
              onChange={handleDateChange}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            name="description"
            placeholder="Description"
            value={newTodo.description}
            onChange={handleInputChange}
            className="mt-4 p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={isLoadingApi}
          className={`mt-4 py-2 px-4 rounded-lg transition duration-300 lg:mt-0 lg:self-end ${
            isLoadingApi
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Create Todo
        </button>
      </div>

      {/* List of Todos */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
          >
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {todo.name}
              </h2>
              <div className="text-sm text-gray-600">
                <p className="mb-1">
                  <span className="font-semibold">Status:</span>{" "}
                  {todo.statusText}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Due Date:</span>{" "}
                  {new Date(todo.dueDate).toLocaleDateString()}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Description:</span>{" "}
                  {todo.description}
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              {todo.status === TodoItemStatus.Pending && (
                <button
                  onClick={() =>
                    handleUpdate(todo.id, {
                      ...todo,
                      status: TodoItemStatus.InProgress,
                    })
                  }
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Start Task
                </button>
              )}
              {todo.status === TodoItemStatus.InProgress && (
                <button
                  onClick={() =>
                    handleUpdate(todo.id, {
                      ...todo,
                      status: TodoItemStatus.Completed,
                    })
                  }
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => openDeleteModal(todo.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={() => handleDelete()}
        onCancel={() => setIsModalOpen(false)}
        message="Are you sure you want to delete this todo?"
      />

      {isLoadingApi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="text-white text-xl">In Process...</div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
