using todo.Enums;

namespace todo.Dtos;

public class TodoItemDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
    public TodoItemStatus Status { get; set; }
}