using Microsoft.AspNetCore.SignalR;
using todo.Models;

namespace todo;

public class TodoHub : Hub
{
    public async Task UpdateTodos(List<TodoItem> todos)
    {
        try
        {
            await Clients.All.SendAsync("ReceiveTodos", todos);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in UpdateTodos: {ex.Message}");
            throw;
        }
    }
    
    public async Task SendUpdate(string message)
    {
        await Clients.All.SendAsync("ReceiveUpdate", message);
    }
}