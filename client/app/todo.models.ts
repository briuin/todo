export interface TodoItemDto {
  id: number;
  name: string;
  description: string;
  status: TodoItemStatus;
  dueDate: Date;
}

export interface CreateTodoItemDto {
  name: string;
  description: string;
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

export class Todo {
  id: number;
  name: string;
  description: string;
  status: TodoItemStatus;
  dueDate: Date;

  constructor(
    id: number,
    name: string,
    description: string,
    status: number,
    dueDate: Date
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.dueDate = new Date(dueDate);
  }

  get statusText() {
    switch (this.status) {
      case 2:
        return "Completed";
      case 1:
        return "In Progress";
      default:
        return "Pending";
    }
  }
}
