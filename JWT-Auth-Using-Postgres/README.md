# JWT Auth API

A secure JWT-based authentication system built with Express.js, PostgreSQL, and Drizzle ORM. This API provides user registration, login, token refresh, and protected routes with Bearer token authentication.

## Features

- ✅ User Registration (Signup)
- ✅ User Login with JWT Access Tokens
- ✅ Refresh Token Generation
- ✅ Protected Routes with Bearer Token Authentication
- ✅ Password Hashing with Bcrypt
- ✅ PostgreSQL Database with Drizzle ORM
- ✅ CORS Support
- ✅ HttpOnly Secure Cookies
- ✅ Token Expiration & Refresh

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** Bcrypt
- **Environment Management:** Dotenv
- **Middleware:** Cookie Parser, CORS

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/jwt-auth-api.git
   cd jwt-auth-api
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/jwt_auth_db
   ACCESS_TOKEN_SECRET=your_access_token_secret_key
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   ```

4. **Set up the database:**

   ```bash
   npm run db:push
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:3000` with file watching enabled.

## API Endpoints

### Public Endpoints

#### 1. Signup

- **URL:** `POST /auth/signup`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User registered successfully."
  }
  ```

#### 2. Login

- **URL:** `POST /auth/login`
- **Description:** Authenticate user and receive tokens
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Cookies:** `refreshToken` (httpOnly, secure)

#### 3. Refresh Token

- **URL:** `POST /auth/refresh`
- **Description:** Generate a new access token using refresh token
- **Headers:** None required (uses httpOnly cookie)
- **Response (200):**
  ```json
  {
    "success": true,
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```

#### 4. Logout

- **URL:** `DELETE /auth/logout`
- **Description:** Logout user and invalidate tokens
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```

### Protected Endpoints

#### 5. Get User Profile

- **URL:** `GET /auth/`
- **Description:** Retrieve authenticated user information
- **Headers:**
  ```
  Authorization: Bearer <accessToken>
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```
- **Error (401):**
  ```json
  {
    "success": false,
    "message": "Authorization header missing."
  }
  ```

## Usage Examples

### Using cURL

**Signup:**

```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securePassword123"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securePassword123"}'
```

**Get Profile (Protected):**

```bash
curl -X GET http://localhost:3000/auth/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. **Create** a new request
2. **Select** the HTTP method (GET, POST, DELETE)
3. **Enter** the URL (e.g., `http://localhost:3000/auth/signup`)
4. **For protected routes:**
   - Go to **Authorization** tab
   - Select **Bearer Token**
   - Paste your access token
5. **Send** the request

### Using JavaScript/Fetch API

```javascript
// Signup
const signup = async () => {
  const response = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "John Doe",
      email: "john@example.com",
      password: "securePassword123",
    }),
  });
  const data = await response.json();
  console.log(data);
};

// Login
const login = async () => {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // For cookies
    body: JSON.stringify({
      email: "john@example.com",
      password: "securePassword123",
    }),
  });
  const data = await response.json();
  localStorage.setItem("accessToken", data.accessToken);
};

// Get Profile
const getProfile = async () => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch("http://localhost:3000/auth/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  const data = await response.json();
  console.log(data);
};
```

## Authentication Flow

1. **User Signup** → Password is hashed with Bcrypt (10 rounds)
2. **User Login** → Credentials verified, Access Token & Refresh Token generated
3. **Access Token** → Short-lived token (15 minutes) sent in response
4. **Refresh Token** → Long-lived token (7 days) stored in httpOnly cookie
5. **Protected Routes** → Bearer token required in Authorization header
6. **Token Refresh** → Use refresh token to get new access token
7. **Logout** → Refresh token cleared from database

## Security Features

- 🔒 **Password Hashing:** Bcrypt with 10 salt rounds
- 🔐 **JWT Tokens:** Signed with secret keys
- 🍪 **HttpOnly Cookies:** Refresh tokens stored securely
- 🔄 **Token Expiration:** Automatic token expiry and refresh
- 🛡️ **CORS Protection:** Configured for cross-origin requests
- ✅ **Input Validation:** All required fields checked

## Environment Variables

| Variable               | Default | Description                   |
| ---------------------- | ------- | ----------------------------- |
| `PORT`                 | 3000    | Server port                   |
| `DATABASE_URL`         | -       | PostgreSQL connection string  |
| `ACCESS_TOKEN_SECRET`  | -       | Secret key for access tokens  |
| `REFRESH_TOKEN_SECRET` | -       | Secret key for refresh tokens |
| `ACCESS_TOKEN_EXPIRY`  | 15m     | Access token expiration time  |
| `REFRESH_TOKEN_EXPIRY` | 7d      | Refresh token expiration time |

## Project Structure

```
20_JWT_Auth/
├── controllers/
│   └── user.controller.js      # Auth logic (signup, login, refresh, logout)
├── db/
│   └── index.js                # Database connection
├── drizzle/                    # Drizzle migrations
├── middlewares/
│   └── auth.middleware.js      # JWT verification middleware
├── models/
│   └── user.models.js          # User table schema
├── routes/
│   └── user.routes.js          # API routes
├── utils/
│   └── token.util.js           # Token generation helpers
├── docker-compose.yml          # PostgreSQL container setup
├── drizzle.config.js           # Drizzle ORM configuration
├── index.js                    # Express app setup
├── package.json                # Dependencies
└── README.md                   # This file
```

## Troubleshooting

### "Authorization header missing" Error

**Solution:** Ensure you're sending the Authorization header in your request:

```
Authorization: Bearer <your_access_token>
```

### "Invalid or expired token" Error

**Solution:** Your token has expired. Use the refresh token to get a new access token:

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Cookie: refreshToken=YOUR_REFRESH_TOKEN"
```

### Database Connection Error

**Solution:** Check your `DATABASE_URL` environment variable and ensure PostgreSQL is running.

## License

ISC License - feel free to use this project for your purposes.

## Author

Taksh Patel

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

For issues or questions, please open an issue on the GitHub repository.
