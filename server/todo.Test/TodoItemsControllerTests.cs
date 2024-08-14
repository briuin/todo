using Microsoft.AspNetCore.Mvc;
using todo.Enums;

namespace todo.Test;
using Xunit;
using FluentAssertions;
using Moq;
using todo.Controllers;
using todo.Dtos;
using todo.Services;


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

    [Fact]
    public void DeleteTodoItem_ReturnsNoContentResult_WhenTodoItemIsDeleted()
    {
        // Arrange
        var mockService = new Mock<ITodoService>();
        int testTodoId = 1;

        mockService.Setup(service => service.DeleteTodoItem(testTodoId)).Verifiable();

        var controller = new TodoItemsController(mockService.Object);

        var result = controller.DeleteTodoItem(testTodoId);

        result.Should().BeOfType<NoContentResult>();

        mockService.Verify(service => service.DeleteTodoItem(testTodoId), Times.Once);
    }
}