
# TODO

This project is a RESTful API for managing TODO items, built using ASP.NET Core with PostgreSQL as the database. It supports CRUD operations, filtering, and sorting of TODO items.

## Server Features

1. **TODOs CRUD**
   - Each TODO item has:
	 - Unique ID
	 - Name
	 - Description
	 - Due Date
	 - Status (e.g., Not Started, In Progress, Completed)
2. **Filtering** (e.g., by status, due date)
3. **Sorting** (e.g., by due date, status, name)
4. **Error Handling and Validation**

## Server Prerequisites

- [.NET Core 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [PostgreSQL](https://www.postgresql.org/download/)
- [JetBrains Rider](https://www.jetbrains.com/rider/) (or another IDE such as Visual Studio or VS Code)
- Optional: Docker (for containerization)

## Installation

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/briuin/todo.git
cd server
\`\`\`

### 2. Configure the Database

Update the connection strings in `appsettings.json` and `appsettings.Development.json` to point to your PostgreSQL database.

\`\`\`json
{
  "ConnectionStrings": {
	"DefaultConnection": "Host=localhost;Database=TodoApi;Username=yourusername;Password=yourpassword"
  }
}
\`\`\`

### 3. Apply Migrations

Ensure that the database is set up by applying the Entity Framework migrations:

\`\`\`bash
dotnet ef database update
\`\`\`

### 4. Run the Application

You can run the application using the .NET CLI or your IDE.

\`\`\`bash
dotnet run
\`\`\`


## API Endpoints

you can saw swagger doc on http://localhost:YOUR_PORT/swagger/index.html

## Running Tests

The project includes unit tests for both the service layer and the controller layer. Tests are written using xUnit, Moq, and FluentAssertions.

To run the tests, use the following command:

\`\`\`bash
dotnet test
\`\`\`


## Client Features

- Create, update, delete, filter, and sort todo items.
- Real-time collaboration using SignalR.
- Responsive design with Tailwind CSS.
- Backend API integration with filtering and sorting.

## Client Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/briuin/todo.git
   cd client
   ```

2. **Install dependencies:**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

3. **Configure SignalR:**

   Ensure the SignalR connection is configured correctly in the frontend. In the `TodoList.tsx` file, update the SignalR connection URL if needed.

   ```typescript
   const connection = new signalR.HubConnectionBuilder()
	 .withUrl("http://localhost:YOUR_SERVER_PORT/todoHub", {
	   skipNegotiation: true,
	   transport: signalR.HttpTransportType.WebSockets,
	 })
	 .build();
   ```

## Running the Application

1. **Start the development server:**

   Using npm:
   ```bash
   npm dev
   ```

   Or using yarn:
   ```bash
   yarn dev
   ```

   The application will be running on `http://localhost:3000`.

