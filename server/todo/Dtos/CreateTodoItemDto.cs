using todo.Enums;

namespace todo.Dtos;

public class CreateTodoItemDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime DueDate { get; set; }
}