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
        
        mockService.Setup(service => service.UpdateTodoItem(testTodoId, updateTodoItemDto)).Verifiable();

        var controller = new TodoItemsController(mockService.Object);

        var result = controller.UpdateTodoItem(testTodoId, updateTodoItemDto);

        result.Should().BeOfType<NoContentResult>();
        
        mockService.Verify(service => service.UpdateTodoItem(testTodoId, updateTodoItemDto), Times.Once);
    }
    
    [Fact]
    public void GetTodoItems_ReturnsOkResult_WithListOfTodoItems()
    {
        // Arrange
        var mockService = new Mock<ITodoService>();

        var mockTodoItems = new List<TodoItemDto>
        {
            new TodoItemDto { Id = 1, Name = "Test 1", Description = "Description 1", DueDate = DateTime.Now.AddDays(1), Status = TodoItemStatus.NotStarted },
            new TodoItemDto { Id = 2, Name = "Test 2", Description = "Description 2", DueDate = DateTime.Now.AddDays(2), Status = TodoItemStatus.InProgress }
        };

        mockService.Setup(service => service.GetTodoItems()).Returns(mockTodoItems);

        var controller = new TodoItemsController(mockService.Object);

        var result = controller.GetTodoItems();

        var okResult = result.Result as OkObjectResult;

        okResult.Should().NotBeNull();

        var returnValue = okResult.Value as List<TodoItemDto>;
        returnValue.Should().NotBeNull();
        
        returnValue.Should().HaveCount(2);
        returnValue.Should().BeEquivalentTo(mockTodoItems);

        mockService.Verify(service => service.GetTodoItems(), Times.Once);
    }
}