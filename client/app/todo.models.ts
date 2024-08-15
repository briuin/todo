export interface TodoItemDto {
  id: number;
  name: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export interface CreateTodoItemDto {
  name: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export interface UpdateTodoItemDto {
  name: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export enum TodoItemStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Completed = "Completed",
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}
