import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  mapDTOtoModel,
  getTodoItems,
  getTodoItem,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
} from "./todo.service";
import {
  TodoItemDto,
  CreateTodoItemDto,
  UpdateTodoItemDto,
  TodoItemStatus,
} from "../todo.models";
import { Env } from "../env-variable";

const API_BASE_URL = `${Env.API_URL}/TodoItems`; 

const mock = new MockAdapter(axios);

describe("Todo Service", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mock.reset();
  });

  it("should correctly map a TodoItemDto to a Todo model", () => {
    const dto: TodoItemDto = {
      id: 1,
      name: "Test Todo",
      description: "Test Description",
      status: TodoItemStatus.Pending,
      dueDate: new Date(),
    };

    const result = mapDTOtoModel(dto);

    expect(result.id).toBe(dto.id);
    expect(result.name).toBe(dto.name);
    expect(result.description).toBe(dto.description);
    expect(result.status).toBe(dto.status);
    expect(result.dueDate).toStrictEqual(dto.dueDate);
  });

  it("should fetch todo items without any filters", async () => {
    const mockData: TodoItemDto[] = [
      {
        id: 1,
        name: "Test Todo",
        description: "Test Desc",
        status: TodoItemStatus.Pending,
        dueDate: new Date(),
      },
    ];

    mock.onGet(API_BASE_URL).reply(200, mockData);

    const result = await getTodoItems();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Todo");
  });

  it("should fetch todo items with a specific status", async () => {
    const mockData: TodoItemDto[] = [
      {
        id: 1,
        name: "Test Todo",
        description: "Test Desc",
        status: TodoItemStatus.Completed,
        dueDate: new Date(),
      },
    ];

    mock.onGet(API_BASE_URL).reply((config) => {
      if (config.params.status == 2) {
        return [200, mockData];
      } else {
        return [400];
      }
    });

    const result = await getTodoItems(TodoItemStatus.Completed);

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(TodoItemStatus.Completed);
  });

  it("should fetch todo items with a specific dueDate", async () => {
    const mockDate = new Date();
    const mockData: TodoItemDto[] = [
      {
        id: 1,
        name: "Test Todo",
        description: "Test Desc",
        status: TodoItemStatus.Pending,
        dueDate: mockDate,
      },
    ];

    mock.onGet(API_BASE_URL).reply((config) => {
      if (config.params.dueDate.getTime() == mockDate.getTime()) {
        return [200, mockData];
      } else {
        return [400];
      }
    });

    const result = await getTodoItems(undefined, mockDate);

    expect(result).toHaveLength(1);
    expect(result[0].dueDate).toStrictEqual(mockDate);
  });

  it("should fetch todo items with sortBy and sortDirection", async () => {
    const mockData: TodoItemDto[] = [
      {
        id: 1,
        name: "Test Todo",
        description: "Test Desc",
        status: TodoItemStatus.Pending,
        dueDate: new Date(),
      },
    ];

    mock.onGet(API_BASE_URL).reply((config) => {
      if (
        config.params.sortBy == "Name" &&
        config.params.sortDirection == "asc"
      ) {
        return [200, mockData];
      } else {
        return [400];
      }
    });

    const result = await getTodoItems(undefined, undefined, "Name", "asc");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Test Todo");
  });

  it("should handle invalid dueDate and ignore it", async () => {
    const mockData: TodoItemDto[] = [
      {
        id: 1,
        name: "Test Todo",
        description: "Test Desc",
        status: TodoItemStatus.Pending,
        dueDate: new Date(),
      },
    ];

    mock.onGet(API_BASE_URL).reply(200, mockData);

    const result = await getTodoItems(undefined, new Date("invalid date"));

    expect(result).toHaveLength(1);
  });

  it("should handle network errors when fetching todo items", async () => {
    mock.onGet(API_BASE_URL).reply(500);

    await expect(getTodoItems()).rejects.toThrow();
  });

  it("should fetch a single todo item by ID", async () => {
    const mockData: TodoItemDto = {
      id: 1,
      name: "Test Todo",
      description: "Test Desc",
      status: TodoItemStatus.Pending,
      dueDate: new Date(),
    };

    mock.onGet(`${API_BASE_URL}/1`).reply(200, mockData);

    const result = await getTodoItem(1);

    expect(result.id).toBe(1);
    expect(result.name).toBe("Test Todo");
  });

  it("should handle network errors when fetching a single todo item", async () => {
    mock.onGet(`${API_BASE_URL}/1`).reply(500);

    await expect(getTodoItem(1)).rejects.toThrow();
  });

  it("should create a new todo item", async () => {
    const mockData: CreateTodoItemDto = {
      name: "New Todo",
      description: "New Desc",
      dueDate: new Date(),
    };

    mock.onPost(API_BASE_URL).reply(201, { id: 1, ...mockData });

    const result = await createTodoItem(mockData);

    expect(result.id).toBe(1);
    expect(result.name).toBe("New Todo");
  });

  it("should handle input errors when creating a new todo item", async () => {
    const mockData = {
      name: "New Todo",
      description: "New Desc",
      status: TodoItemStatus.Pending,
      dueDate: new Date(),
    };

    mock.onPost(API_BASE_URL).reply(400);

    await expect(createTodoItem(mockData)).rejects.toThrow();
  });

  it("should update an existing todo item", async () => {
    const mockData: UpdateTodoItemDto = {
      name: "Updated Todo",
      description: "Updated Desc",
      status: TodoItemStatus.Completed,
      dueDate: new Date(),
    };

    mock.onPut(`${API_BASE_URL}/1`).reply(200);

    await expect(updateTodoItem(1, mockData)).resolves.not.toThrow();
  });

  it("should handle network errors when updating an existing todo item", async () => {
    const mockData: UpdateTodoItemDto = {
      name: "Updated Todo",
      description: "Updated Desc",
      status: TodoItemStatus.Completed,
      dueDate: new Date(),
    };

    mock.onPut(`${API_BASE_URL}/1`).reply(500);

    await expect(updateTodoItem(1, mockData)).rejects.toThrow();
  });

  it("should delete a todo item", async () => {
    mock.onDelete(`${API_BASE_URL}/1`).reply(200);

    await expect(deleteTodoItem(1)).resolves.not.toThrow();
  });

  it("should handle network errors when deleting a todo item", async () => {
    mock.onDelete(`${API_BASE_URL}/1`).reply(500);

    await expect(deleteTodoItem(1)).rejects.toThrow();
  });
});
