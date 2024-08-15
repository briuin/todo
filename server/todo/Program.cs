using Microsoft.EntityFrameworkCore;
using todo;
using todo.Models;
using todo.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<TodoContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddSignalR();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policyBuilder => policyBuilder
            .WithOrigins("http://localhost:3000", "https://your-production-site.com")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()); 
});

builder.Services.AddScoped<ITodoService, TodoService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigins"); 

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<TodoHub>("/todoHub"); 

app.Run();