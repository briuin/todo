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
    
    [Fact]
    public void GetTodoItems_FiltersByDueDate()
    {
        // Arrange
        var service = new TodoService();
        var filterDate = DateTime.Now.AddDays(1);
        
        var result = service.GetTodoItems(null, filterDate, "name", "asc");
        
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Test 1");
    }
    
    [Fact]
    public void GetTodoItems_SortsByDueDateAscending()
    {
        // Arrange
        var service = new TodoService();

        var result = service.GetTodoItems(null, null, "duedate", "desc");

        result.Should().HaveCount(3);
        result.First().Name.Should().Be("Test 3"); 
        result.Last().Name.Should().Be("Test 1"); 
    }
    
    [Fact]
    public void GetTodoItems_SortsByStatusDescending()
    {
        // Arrange
        var service = new TodoService();
        
        var result = service.GetTodoItems(null, null, "status", "desc");
        
        result.Should().HaveCount(3);
        result.First().Name.Should().Be("Test 3");  
        result.Last().Name.Should().Be("Test 1");  
    }
    
    [Fact]
    public void GetTodoItems_FiltersByStatusAndSortsByDueDate()
    {
        // Arrange
        var service = new TodoService();
        
        var result = service.GetTodoItems(TodoItemStatus.NotStarted, null, "duedate", "asc");
        
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Test 1");
    }
}