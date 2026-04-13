# MzansiBuilds

A platform that helps developers build in public and keep up with what other developers are building.
 Video Link of how the system works: https://youtu.be/Yymfbig1mXQ 

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 + TypeScript |
| Backend | ASP.NET Core 10 Web API (C#) |
| Database | Microsoft SQL Server |
| ORM | Entity Framework Core |
| Auth | JWT Bearer Tokens + BCrypt |


---

## Prerequisites

Make sure you have the following installed before running the project:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.io/cli) — install with `npm install -g @angular/cli`
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (free version)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup) — to view your database

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/MzansiBuilds.git
cd MzansiBuilds
```

---

### 2. Set up the Backend

#### Navigate to the backend folder

```bash
cd backend
```

#### Install NuGet packages

```bash
dotnet restore
```

#### Update the database connection string

Open `appsettings.json` and update the connection string to match your local SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MzansiBuildsDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
}
```

#### Run database migrations

```bash
dotnet ef database update
```

This will create the `MzansiBuildsDb` database with all the tables in your local SQL Server.

#### Run the backend

```bash
dotnet run
```

The API will start at `https://localhost:7272`. You can open Swagger UI at:

```
https://localhost:7272
```

---

### 3. Set up the Frontend

#### Open a new terminal and navigate to the frontend folder

```bash
cd frontend
```

#### Install dependencies

```bash
npm install
```

#### Run the Angular app

```bash
ng serve
```

The frontend will start at:

```
http://localhost:4200
```

## Features

- Developer account creation and login with JWT authentication
- Create, edit, delete and manage projects
- Kanban board with 4 stages — Planning, In Progress, Testing, Completed
- Click-to-edit stage badges that instantly move cards between columns
- Project detail page with a milestone journey timeline
- Live developer feed showing all community projects
- Comment on any project in the feed
- Raise hand to request collaboration on a project
- Celebration Wall showcasing all completed projects
- Developer dashboard with charts showing project stats
