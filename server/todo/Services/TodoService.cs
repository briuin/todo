using todo.Dtos;
using todo.Enums;
using todo.Models;

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
        var fakeData = new List<TodoItem>
        {
            new TodoItem
            {
                Id = 1, Name = "Test 1", Description = "Description 1", DueDate = DateTime.Now.AddDays(1),
                Status = TodoItemStatus.NotStarted
            },
            new TodoItem
            {
                Id = 2, Name = "Test 2", Description = "Description 2", DueDate = DateTime.Now.AddDays(2),
                Status = TodoItemStatus.InProgress
            },
            new TodoItem
            {
                Id = 3, Name = "Test 3", Description = "Description 3", DueDate = DateTime.Now.AddDays(3),
                Status = TodoItemStatus.Completed
            }
        };

        var query = fakeData.AsQueryable();
        if (status != null)
        {
            query = query.Where(todo => todo.Status == status);
        }

        if (dueDate.HasValue)
        {
            query = query.Where(todo => todo.DueDate.Date == dueDate.Value.Date);
        }
        
        return query.Select(todo => new TodoItemDto
        {
            Id = todo.Id,
            Name = todo.Name,
            Description = todo.Description,
            DueDate = todo.DueDate,
            Status = todo.Status
        }).ToList();

    }
}