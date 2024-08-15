using Microsoft.AspNetCore.Mvc;
using todo.Dtos;
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
        var item = _todoService.GetTodoItemById(id);

        if (item == null)
        {
            return NotFound();
        }

        return Ok(item);
    }

    [HttpPost]
    public IActionResult CreateTodoItem(CreateTodoItemDto todoItemDto)
    {
        _todoService.CreateTodoItem(todoItemDto);
        return CreatedAtAction(nameof(GetTodoItem), new { id = 1 }, todoItemDto);
    }

    [HttpDelete("{id:int}")]
    public IActionResult DeleteTodoItem(int id)
    {
        _todoService.DeleteTodoItem(id);
        return NoContent();
    }

    [HttpPut("{id:int}")]
    public IActionResult UpdateTodoItem(int id, UpdateTodoItemDto todoItemDto)
    {
        _todoService.UpdateTodoItem(id, todoItemDto);
        return NoContent();
    }

    [HttpGet]
    public ActionResult<IEnumerable<TodoItemDto>> GetTodoItems()
    {
        var items = _todoService.GetTodoItems();
        return Ok(items);
    }
}