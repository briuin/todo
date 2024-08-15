using FluentAssertions;
using todo.Enums;
using todo.Services;

public class TodoServiceTests
{
    [Fact]
    public void GetTodoItems_FiltersByStatus()
    {
        // Arrange
        var service = new TodoService();
        
        var result = service.GetTodoItems(TodoItemStatus.InProgress, null, "name", "asc");
        
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Test 2");
    }
}