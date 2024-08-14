using Microsoft.AspNetCore.Mvc;
using todo.Enums;

namespace todo.Test;
using Xunit;
using FluentAssertions;
using Moq;
using todo.Controllers;
using todo.Dtos;
using todo.Models;


public class TodoItemsControllerTests
{
    [Fact]
    public void CreateTodoItem_ReturnsCreatedAtActionResult_WhenValidInput()
    {
        // Arrange
        var mockService = new Mock<ITodoService>();
        var controller = new TodoItemsController(mockService.Object);
        var newTodo = new CreateTodoItemDto
        {
            Name = "Test Todo",
            Description = "Test Description",
            DueDate = DateTime.Now.AddDays(1),
            Status = TodoItemStatus.NotStarted
        };

        var result = controller.CreateTodoItem(newTodo);

        result.Should().BeOfType<CreatedAtActionResult>();
    }

}

public class TodoItemsController
{
    public TodoItemsController(ITodoService mockServiceObject)
    {
        throw new NotImplementedException();
    }

    public object CreateTodoItem(CreateTodoItemDto newTodo)
    {
        throw new NotImplementedException();
    }
}

public interface ITodoService
{
}