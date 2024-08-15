using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using todo.Enums;
using todo.Models;
using todo.Services;

namespace todo.Test;

public class TodoServiceTests
{
    [Fact]
    public void GetTodoItems_FiltersByStatus()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new TodoService(context);
        
        var result = service.GetTodoItems(TodoItemStatus.InProgress, null, "name", "asc");
        
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Test 2");
    }
    
    [Fact]
    public void GetTodoItems_FiltersByDueDate()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new TodoService(context);
        var filterDate = DateTime.Now.AddDays(1);
        
        var result = service.GetTodoItems(null, filterDate, "name", "asc");
        
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Test 1");
    }
    
    [Fact]
    public void GetTodoItems_SortsByDueDateAscending()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new TodoService(context);

        var result = service.GetTodoItems(null, null, "duedate", "desc");

        result.Should().HaveCount(3);
        result.First().Name.Should().Be("Test 3"); 
        result.Last().Name.Should().Be("Test 1"); 
    }
    
    [Fact]
    public void GetTodoItems_SortsByStatusDescending()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new TodoService(context);
        
        var result = service.GetTodoItems(null, null, "status", "desc");
        
        result.Should().HaveCount(3);
        result.First().Name.Should().Be("Test 3");  
        result.Last().Name.Should().Be("Test 1");  
    }
    
    [Fact]
    public void GetTodoItems_FiltersByStatusAndSortsByDueDate()
    {
        // Arrange
        using var context = GetInMemoryDbContext();
        var service = new TodoService(context);
        
        var result = service.GetTodoItems(TodoItemStatus.NotStarted, null, "duedate", "asc");
        
        result.Should().HaveCount(1);
        result.First().Name.Should().Be("Test 1");
    }
    
    private TodoContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<TodoContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()) // Unique database for each test
            .Options;
        var context = new TodoContext(options);

        // Seed data
        context.TodoItems.AddRange(new List<TodoItem>
        {
            new TodoItem { Id = 1, Name = "Test 1", Description = "Description 1", DueDate = DateTime.Now.AddDays(1), Status = TodoItemStatus.NotStarted },
            new TodoItem { Id = 2, Name = "Test 2", Description = "Description 2", DueDate = DateTime.Now.AddDays(2), Status = TodoItemStatus.InProgress },
            new TodoItem { Id = 3, Name = "Test 3", Description = "Description 3", DueDate = DateTime.Now.AddDays(3), Status = TodoItemStatus.Completed }
        });

        context.SaveChanges();
        return context;
    }
}