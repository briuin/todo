import axios from "axios";
import {
  TodoItemDto,
  CreateTodoItemDto,
  UpdateTodoItemDto,
  TodoItemStatus,
  Todo,
} from "../todo.models";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/TodoItems`;

export const mapDTOtoModel = (dto: TodoItemDto) => {
  return new Todo(dto.id, dto.name, dto.description, dto.status, dto.dueDate);
};

export const getTodoItems = async (
  status?: TodoItemStatus,
  dueDate?: Date,
  sortBy: string = "Name",
  sortDirection: string = "asc"
) => {
  if (dueDate && !isDateValid(dueDate)) {
    dueDate = undefined;
  }
  try {
    const response = await axios.get<TodoItemDto[]>(`${API_BASE_URL}`, {
      params: {
        status,
        dueDate,
        sortBy,
        sortDirection,
      },
    });
    return response.data.map((x) => mapDTOtoModel(x));
  } catch (error) {
    console.error("Error fetching todo items", error);
    throw error;
  }
};

export const getTodoItem = async (id: number) => {
  try {
    const response = await axios.get<TodoItemDto>(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching todo item", error);
    throw error;
  }
};

export const createTodoItem = async (todoItemDto: CreateTodoItemDto) => {
  try {
    const response = await axios.post(`${API_BASE_URL}`, todoItemDto);
    return response.data;
  } catch (error) {
    console.error("Error creating todo item", error);
    throw error;
  }
};

export const updateTodoItem = async (
  id: number,
  todoItemDto: UpdateTodoItemDto
) => {
  try {
    await axios.put(`${API_BASE_URL}/${id}`, todoItemDto);
  } catch (error) {
    console.error("Error updating todo item", error);
    throw error;
  }
};

export const deleteTodoItem = async (id: number) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`);
  } catch (error) {
    console.error("Error deleting todo item", error);
    throw error;
  }
};

const isDateValid = (date: Date) => {
  return !isNaN(date as any);
};
