using todo.Enums;

namespace todo.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public TodoItemStatus Status { get; set; }
}