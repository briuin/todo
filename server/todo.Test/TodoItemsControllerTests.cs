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
    
    [Fact]
    public void UpdateTodoItem_ReturnsNoContentResult_WhenTodoItemIsUpdated()
    {
        // Arrange
        var mockService = new Mock<ITodoService>();
        int testTodoId = 1;

        var updateTodoItemDto = new UpdateTodoItemDto
        {
            Name = "Updated Name",
            Description = "Updated Description",
            DueDate = DateTime.Now.AddDays(2),
            Status = TodoItemStatus.NotStarted
        };

        // We setup the mock to expect a call to UpdateTodoItem with the specific ID and DTO.
        mockService.Setup(service => service.UpdateTodoItem(testTodoId, updateTodoItemDto)).Verifiable();

        var controller = new TodoItemsController(mockService.Object);

        // Act
        var result = controller.UpdateTodoItem(testTodoId, updateTodoItemDto);

        // Assert
        result.Should().BeOfType<NoContentResult>();

        // Verify that UpdateTodoItem was called once with the correct ID and DTO
        mockService.Verify(service => service.UpdateTodoItem(testTodoId, updateTodoItemDto), Times.Once);
    }
}