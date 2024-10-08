import supertest from "supertest";
import { getTodoItems } from "./todo.service";
import { Env } from "../env-variable";

const API_BASE_URL = Env.API_URL; 

describe("Todo Integration Tests", () => {
  const api = supertest(API_BASE_URL);

  it("should fetch todo items from API", async () => {
    const response = await api.get("/TodoItems");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const result = await getTodoItems();
    expect(result.length).toBeGreaterThan(0);
  });

});
