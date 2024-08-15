# TODO 

This project is a RESTful API for managing TODO items, built using ASP.NET Core with PostgreSQL as the database. It supports CRUD operations, filtering, and sorting of TODO items. The project is developed using Test-Driven Development (TDD) practices.

## Features

1. **TODOs CRUD**
   - Each TODO item has:
	 - Unique ID
	 - Name
	 - Description
	 - Due Date
	 - Status (e.g., Not Started, In Progress, Completed)
2. **Filtering** (e.g., by status, due date)
3. **Sorting** (e.g., by due date, status, name)

## Server Side Prerequisites

- [.NET Core 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/)
- [JetBrains Rider](https://www.jetbrains.com/rider/) (or another IDE such as Visual Studio or VS Code)
- Optional: Docker (for containerization)