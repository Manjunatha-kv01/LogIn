# Simple Login System — HLD + LLD

A beginner-friendly backend project that implements the exact login flow discussed in the HLD/LLD example.

## Architecture

```text
                HTTPS
[Client] ----------------------> [Express API]
                                    |
                         +----------+----------+
                         |                     |
                         v                     v
                 [AuthService]           [AuthController]
                         |
              +----------+----------+
              |                     |
              v                     v
      [UserRepository]      [PasswordHasher]
              |                     |
              v                     v
         [PostgreSQL]          [BCrypt]
              
After successful login:
[AuthService] --> [TokenFactory] --> JWT
       |
       +--------------------------> [Redis session]
```

## HLD view

- Client calls `POST /auth/login` over HTTPS.
- Express API receives the request.
- `AuthService` coordinates authentication.
- PostgreSQL stores the user and password hash.
- BCrypt verifies the password.
- JWT identifies the session.
- Redis stores the active session for revocation/validation.

## LLD view

### Classes

`AuthController -> AuthService -> UserRepository`

`AuthService -> PasswordHasher`

`AuthService -> TokenFactory`

`AuthService -> Redis`

### Database

```text
users
--------------------------------
id            UUID PK
email         VARCHAR(255) UNIQUE
password_hash VARCHAR(100)
created_at    TIMESTAMP
```

## API

### Register

`POST /auth/register`

```json
{
  "email": "manjunath@example.com",
  "password": "password123"
}
```

### Login

`POST /auth/login`

```json
{
  "email": "manjunath@example.com",
  "password": "password123"
}
```

Response contains a JWT. Send it as:

`Authorization: Bearer <token>`

### Current session

`GET /auth/me`

### Logout

`POST /auth/logout`

## Run

Requirements: Node.js 20+, Docker Desktop.

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Then test:

```bash
curl http://localhost:3000/health
```

Register:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"manjunath@example.com","password":"password123"}'
```

Login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"manjunath@example.com","password":"password123"}'
```

Copy the returned token and call:

```bash
curl http://localhost:3000/auth/me \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## What to study in this project

1. HLD: components and request flow.
2. LLD: controller/service/repository separation.
3. Interface/abstraction thinking: service depends on small utility/repository responsibilities.
4. Security basics: HTTPS in deployment, bcrypt password hashing, JWT, active sessions in Redis.
5. Database design: primary key, unique constraint, index.
6. API design: status codes 201, 400, 401, 409, 500.

## Important production improvements

This is intentionally a learning project. A production system should additionally use strict input validation, rate limiting, refresh-token rotation or another session strategy, secret management, structured logging, auditing, stronger error handling, and HTTPS at the edge.
