using todo.Dtos;
using todo.Enums;

namespace todo.Services;

public interface ITodoService
{
    void CreateTodoItem(CreateTodoItemDto todoItemDto);
    TodoItemDto GetTodoItemById(int id);
    void DeleteTodoItem(int testTodoId);
    void UpdateTodoItem(int testTodoId, UpdateTodoItemDto updateTodoItemDto);
    IEnumerable<TodoItemDto> GetTodoItems(TodoItemStatus? status, DateTime? dueDate, string sortBy, string sortDirection);

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

    public void DeleteTodoItem(int testTodoId)
    {
       
    }

    public void UpdateTodoItem(int testTodoId, UpdateTodoItemDto updateTodoItemDto)
    {
       
    }

    public IEnumerable<TodoItemDto> GetTodoItems(TodoItemStatus? status, DateTime? dueDate, string sortBy, string sortDirection)
    {
        return new List<TodoItemDto>
        {
            new TodoItemDto(){ Name = "Test 2"}
        };
    }
}