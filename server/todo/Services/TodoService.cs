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
    private readonly TodoContext _context;

    public TodoService(TodoContext context)
    {
        _context = context;
    }
    public void CreateTodoItem(CreateTodoItemDto todoItemDto)
    {
        var todoItem = new TodoItemDto()
        {
            Name = todoItemDto.Name,
            Description = todoItemDto.Description,
            DueDate = todoItemDto.DueDate,
            Status = TodoItemStatus.NotStarted
        };

        _context.TodoItems.Add(todoItem);

        _context.SaveChanges();
    }

    public TodoItemDto GetTodoItemById(int id)
    {
        var todoItem = _context.TodoItems.Find(id);

        if (todoItem == null)
        {
            throw new KeyNotFoundException($"Todo item with ID {id} not found.");
        }

        return todoItem;
    }

    public void DeleteTodoItem(int id)
    {
        var todoItem = GetTodoItemById(id);

       _context.TodoItems.Remove(todoItem);

       _context.SaveChanges();
    }

    public void UpdateTodoItem(int id, UpdateTodoItemDto updateTodoItemDto)
    {
        var todoItem = GetTodoItemById(id);
        todoItem.Status = updateTodoItemDto.Status;
        todoItem.Description = updateTodoItemDto.Description;
        todoItem.DueDate = updateTodoItemDto.DueDate;
        todoItem.Name = updateTodoItemDto.Name;

        _context.SaveChanges();
    }

    public IEnumerable<TodoItemDto> GetTodoItems(TodoItemStatus? status, DateTime? dueDate, string sortBy, string sortDirection)
    {
        var query = _context.TodoItems.AsQueryable();
        if (status != null)
        {
            query = query.Where(todo => todo.Status == status);
        }

        if (dueDate.HasValue)
        {
            query = query.Where(todo => todo.DueDate.Date == dueDate.Value.Date);
        }
        
        query = sortBy.ToLower() switch
        {
            "duedate" => sortDirection.ToLower() == "desc"
                ? query.OrderByDescending(todo => todo.DueDate)
                : query.OrderBy(todo => todo.DueDate),
            "status" => sortDirection.ToLower() == "desc"
                ? query.OrderByDescending(todo => todo.Status)
                : query.OrderBy(todo => todo.Status),
            "name" => sortDirection.ToLower() == "desc"
                ? query.OrderByDescending(todo => todo.Name)
                : query.OrderBy(todo => todo.Name),
            _ => query.OrderBy(todo => todo.Name) 
        };

        
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