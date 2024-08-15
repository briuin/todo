export interface TodoItemDto {
  id: number;
  name: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export interface CreateTodoItemDto {
  name: string;
  description: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export interface UpdateTodoItemDto {
  name: string;
  description: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export enum TodoItemStatus {
  Pending = 0,
  InProgress = 1,
  Completed = 2,
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
