using todo.Dtos;

namespace todo.Services;

public interface ITodoService
{
    void CreateTodoItem(CreateTodoItemDto todoItemDto);
    TodoItemDto GetTodoItemById(int id);
}

public class TodoService : ITodoService
{
    public void CreateTodoItem(CreateTodoItemDto todoItemDto)
    {
     
    }

    public TodoItemDto GetTodoItemById(int id)
    {
        return new TodoItemDto();
    }
}