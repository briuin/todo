using Microsoft.AspNetCore.Mvc;
using todo.Dtos;
using todo.Enums;
using todo.Services;

namespace todo.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoItemsController: ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoItemsController(ITodoService todoService)
    {
        _todoService = todoService;
    }
    
    [HttpGet("{id}")]
    public ActionResult<TodoItemDto> GetTodoItem(int id)
    {
        try
        {
            var item = _todoService.GetTodoItemById(id);

            if (item == null)
            {
                return NotFound(new { message = $"Todo item with ID {id} not found." });
            }

            return Ok(item);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the todo item.", details = ex.Message });
        }
    }

    [HttpPost]
    public IActionResult CreateTodoItem(CreateTodoItemDto todoItemDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _todoService.CreateTodoItem(todoItemDto);
            return CreatedAtAction(nameof(GetTodoItem), new { id = 0}, todoItemDto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while creating the todo item.", details = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public IActionResult DeleteTodoItem(int id)
    {
        try
        {
            var item = _todoService.GetTodoItemById(id);

            if (item == null)
            {
                return NotFound(new { message = $"Todo item with ID {id} not found." });
            }

            _todoService.DeleteTodoItem(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while deleting the todo item.", details = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public IActionResult UpdateTodoItem(int id, UpdateTodoItemDto todoItemDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var item = _todoService.GetTodoItemById(id);

            if (item == null)
            {
                return NotFound(new { message = $"Todo item with ID {id} not found." });
            }

            _todoService.UpdateTodoItem(id, todoItemDto);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while updating the todo item.", details = ex.Message });
        }
    }

    [HttpGet]
    public ActionResult<IEnumerable<TodoItemDto>> GetTodoItems(
        TodoItemStatus? status = null, 
        DateTime? dueDate = null, 
        string sortBy = "Name", 
        string sortDirection = "asc")
    {
        try
        {
            var items = _todoService.GetTodoItems(status, dueDate, sortBy, sortDirection);
            return Ok(items);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred while retrieving the todo items.", details = ex.Message });
        }
    }
}