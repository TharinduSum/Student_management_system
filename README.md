# Student Management System

A full-stack Student Management System with JWT authentication built using Spring Boot (Backend) and Next.js with TypeScript (Frontend). This system allows users to register, login, and manage student records with complete CRUD operations.

## Features

- 🔐 User Authentication - JWT-based secure authentication
- 👥 User Registration & Login - Complete user management
- 📚 Student Management - Full CRUD operations for students
- 🔍 Search & Filter - Real-time student search functionality
- 🎨 Modern UI - Beautiful, responsive design with Tailwind CSS
- 🔒 Protected Routes - Secure API endpoints and frontend routes
- 💾 PostgreSQL Database - Reliable data persistence
- 🚀 RESTful API - Well-structured backend API

## Tech stack

### Frontend

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- HTTP Client: Fetch API

### Backend

- Framework: Spring Boot 3.2.0
- Language: Java 17
- Security: Spring Security + JWT (0.13.0)
- Database: PostgreSQL
- ORM: Spring Data JPA (Hibernate)
- Build Tool: Maven

## Prerequisites

Before you begin, ensure you have the following installed:

- Java 17 or higher - Download Java
- Maven 3.6+ - Download Maven
- Node.js 18+ and npm - Download Node.js
- PostgreSQL 12+ - Download PostgreSQL
- Git - Download Git

## Repository layout

- /frontend — client application
- /backend — server application (API, models, migrations)
- /docker — docker-compose files (optional)
- README.md

## Quick start

1. Clone repository

```
git clone https://github.com/TharinduSum/Student_management_system.git
cd Student_management_system
```

2. Database Setup

Create PostgreSQL database:

```
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE student_db;

# Exit psql
\q
```

3. Backend Setup

Configure Database Connection:
Edit backend/src/main/resources/application.properties:

```
# Server Configuration
server.port=8080

# PostgreSQL Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
spring.datasource.username=postgres
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# Application Name
spring.application.name=Student Management System

# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000
```

Install Dependencies & Run

```
cd backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

Backend will be available at: http://localhost:8080

4. Frontend Setup

Install Dependencies:

```
cd frontend

# Install dependencies
npm install
```

Run Development Server

```
npm run dev
```

Frontend will be available at: http://localhost:3000

## 🎯 Usage

1. Register a New User

- Navigate to http://localhost:3000
- Click "Sign up" on the login page
- Fill in the registration form::
- - Full Name
- - Username
- - Email
- - Password (minimum 6 characters)
- Click "Sign Up"
- You'll be automatically logged in
