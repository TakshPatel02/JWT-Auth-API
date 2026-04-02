# JWT Auth Templates

This workspace contains two separate JWT authentication backend templates:

- `JWT-Auth-Using-Mongodb` - Express + MongoDB + Mongoose
- `JWT-Auth-Using-Postgres` - Express + PostgreSQL + Drizzle ORM

Each folder is a standalone API project with its own dependencies, environment variables, and route structure.

## Projects at a Glance

### JWT-Auth-Using-Mongodb

An Express API that uses MongoDB and Mongoose for user storage. It supports user registration, login, logout, and protected profile access with JWT access tokens and refresh tokens.

### JWT-Auth-Using-Postgres

An Express API that uses PostgreSQL and Drizzle ORM for user storage. It supports signup, login, logout, token refresh, and a protected route that returns the authenticated user.

## Features

- User registration and authentication
- Password hashing with bcrypt
- JWT access and refresh tokens
- HttpOnly refresh-token cookie support
- Protected authenticated routes
- Express-based REST API structure

## Folder Structure

```text
JWT-Auth-Using-Mongodb/
	connection.js
	index.js
	controllers/
	middlewares/
	models/
	routes/
	utils/

JWT-Auth-Using-Postgres/
	docker-compose.yml
	drizzle.config.js
	index.js
	controllers/
	db/
	drizzle/
	middlewares/
	models/
	routes/
	utils/
```

## Requirements

- Node.js
- npm
- MongoDB for the Mongo template
- PostgreSQL for the Postgres template

## Installation

Install dependencies inside the project you want to run:

```bash
cd JWT-Auth-Using-Mongodb
npm install
```

or

```bash
cd JWT-Auth-Using-Postgres
npm install
```

## Environment Variables

### MongoDB template

Create a `.env` file inside `JWT-Auth-Using-Mongodb`:

```env
PORT=4000
MONGODB_URL=your_mongodb_connection_string
ACCESS_JWT_SECRET=your_access_token_secret
REFRESH_JWT_SECRET=your_refresh_token_secret
```

### PostgreSQL template

Create a `.env` file inside `JWT-Auth-Using-Postgres`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/jwt_auth_db
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

## Running the Apps

### MongoDB template

```bash
cd JWT-Auth-Using-Mongodb
npm start
```

The server starts on `http://localhost:4000` by default.

### PostgreSQL template

```bash
cd JWT-Auth-Using-Postgres
npm start
```

The server starts on `http://localhost:3000` by default.

## API Overview

## JWT-Auth-Using-Mongodb

Base route: `/users`

- `POST /users/register` - Register a new user
- `POST /users/login` - Log in and receive an access token
- `DELETE /users/logout` - Clear the refresh token
- `GET /users/profile` - Protected route that returns the authenticated user

### MongoDB Request Example

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### MongoDB Auth Header

```http
Authorization: Bearer <access_token>
```

## JWT-Auth-Using-Postgres

Base route: `/auth`

- `GET /auth` - Protected route that returns the authenticated user
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Log in and receive an access token
- `DELETE /auth/logout` - Clear the refresh token
- `POST /auth/refresh` - Generate a new access token from the refresh token cookie

### Postgres Request Example

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Postgres Auth Header

```http
Authorization: Bearer <access_token>
```

## Notes

- The MongoDB template uses `secure` and `httpOnly` cookies for the refresh token.
- The PostgreSQL template also uses an `httpOnly` refresh-token cookie and includes a `/refresh` route for issuing a new access token.
- The two folders are independent projects, so install dependencies and run them separately.
