import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import EditModal from "./EditModal";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<CreateTodoItemDto>({
    name: "",
    dueDate: new Date(),
    description: "",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);
  const [todoToEdit, setTodoToEdit] = useState<TodoItemDto | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    TodoItemStatus | undefined
  >();
  const [dueDateFilter, setDueDateFilter] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState<string>("Name");
  const [sortDirection, setSortDirection] = useState<string>("asc");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todoItems = await getTodoItems(
          statusFilter,
          dueDateFilter,
          sortBy,
          sortDirection
        );
        setTodos(todoItems);
      } catch (error) {
        toast.error("Failed to fetch todo items");
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
  }, [statusFilter, dueDateFilter, sortBy, sortDirection]);

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
      toast.success("Todo created successfully!");
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
      toast.error("Failed to create todo item");
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleUpdate = async (id: number, updatedTodo: UpdateTodoItemDto) => {
    setIsLoadingApi(true);
    try {
      await updateTodoItem(id, updatedTodo);
      if (connection) {
        connection.invoke("SendUpdate", "A todo item has been updated.");
      }
      setTodoToEdit(null); // Close edit modal after successful update
    } catch (error) {
      console.error("Failed to update todo item", error);
      toast.error("Failed to update todo item");
    } finally {
      setIsLoadingApi(false);
    }
  };

  const handleDelete = async () => {
    if (!todoToDelete) return;

    setIsLoadingApi(true);
    try {
      await deleteTodoItem(todoToDelete);
      if (connection) {
        connection.invoke("SendUpdate", "A todo item has been deleted.");
      }
    } catch (error) {
      console.error("Failed to delete todo item", error);
      toast.error("Failed to delete todo item");
    } finally {
      setIsModalOpen(false);
      setTodoToDelete(null);
      setIsLoadingApi(false);
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

  const openEditModal = (todo: TodoItemDto) => {
    setTodoToEdit(todo);
  };

  const closeEditModal = () => {
    setTodoToEdit(null);
  };

  const isNotAbleToCreate = () => isLoadingApi || !newTodo.name;

  if (loading)
    return <div className="text-center text-lg text-gray-700">Loading...</div>;

  return (
    <div className="p-4 w-full max-w-full mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Todo List</h1>

      {/* Form to create a new Todo */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 lg:flex lg:space-x-4 max-w-[720px] ml-auto mr-auto">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">Add New Todo</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label
                htmlFor="label"
                className="block text-gray-700 font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Todo Name"
                value={newTodo.name}
                onChange={handleInputChange}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block text-gray-700 font-medium mb-2"
              >
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={newTodo.dueDate.toISOString().substr(0, 10)}
                onChange={handleDateChange}
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
          disabled={isNotAbleToCreate()}
          className={`mt-4 py-2 px-4 rounded-lg transition duration-300 lg:mt-0 lg:self-end ${
            isNotAbleToCreate()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Create Todo
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6 max-w-[720px] mx-auto flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        <div className="w-full lg:w-[48%]">
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setStatusFilter(e.target.value as unknown as TodoItemStatus)
            }
          >
            <option value="">All Statuses</option>
            <option value={TodoItemStatus.Pending}>Pending</option>
            <option value={TodoItemStatus.InProgress}>In Progress</option>
            <option value={TodoItemStatus.Completed}>Completed</option>
          </select>
        </div>
        <div className="w-full lg:w-[48%]">
          <label className="block text-gray-700 font-medium mb-2">
            Due Date
          </label>
          <input
            type="date"
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setDueDateFilter(new Date(e.target.value))}
          />
        </div>
        <div className="w-full lg:w-[48%]">
          <label className="block text-gray-700 font-medium mb-2">
            Sort By
          </label>
          <select
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Name">Name</option>
            <option value="DueDate">Due Date</option>
          </select>
        </div>
        <div className="w-full lg:w-[48%]">
          <label className="block text-gray-700 font-medium mb-2">
            Sort Direction
          </label>
          <select
            className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* List of Todos */}
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`shadow-md rounded-lg p-6 ${
              todo.status === TodoItemStatus.Pending
                ? "bg-blue-200"
                : todo.status === TodoItemStatus.InProgress
                ? "bg-yellow-200"
                : "bg-green-200"
            }`}
          >
            <div>
              <h2 className="text-xl font-semibold truncate max-w-full">
                {todo.name}
              </h2>
              <p className="text-gray-600">Status: {todo.statusText}</p>
              <p className="text-gray-600">
                Due Date: {new Date(todo.dueDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-4">
                Description: {todo.description}
              </p>
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
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-200 transition duration-300"
                >
                  Complete
                </button>
              )}
              <button
                onClick={() => openEditModal(todo)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Edit
              </button>
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

      <EditModal
        isOpen={!!todoToEdit}
        onClose={closeEditModal}
        onSave={(updatedTodo) => handleUpdate(updatedTodo.id, updatedTodo)}
        todo={todoToEdit}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={() => handleDelete()}
        onCancel={() => closeDeleteModal()}
        message="Are you sure you want to delete this todo?"
      />

      {isLoadingApi && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="text-white text-xl">In Process...</div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default TodoList;
