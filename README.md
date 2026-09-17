# StepNotes

A full-stack notes management application built with **FastAPI** (Python), **Next.js 16** (React 19 & Tailwind CSS), **MySQL / TiDB**, and **JWT Authentication**.

---

## Project Structure

```
StepNotes/
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── app/                # App router (login, register, notes)
│   │   ├── lib/                # Axios instance & API client
│   │   └── types/              # TypeScript types
│   ├── .env.example
│   └── package.json
├── server/                     # FastAPI backend
│   ├── app/                    # Application source code
│   │   ├── models/             # SQLAlchemy database models
│   │   ├── routers/            # API endpoints (users, notes)
│   │   ├── schemas/            # Pydantic validation schemas
│   │   ├── auth.py             # JWT token handling & password hashing
│   │   ├── database.py         # Database engine & session
│   │   └── main.py             # FastAPI entrypoint
│   ├── .env.example
│   ├── queries.sql             # SQL table definitions
│   └── requirements.txt        # Python backend dependencies
├── .venv/                      # Python virtual environment
└── README.md
```

---

## How to Run the Project

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & `npm`
- **MySQL** or **TiDB Cloud** database

---

### 1. Backend Setup (FastAPI)

1. **Activate the Virtual Environment**:
   - **Windows (PowerShell)**:
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux**:
     ```bash
     source .venv/bin/activate
     ```

2. **Install Dependencies**:
   ```bash
   pip install -r server/requirements.txt
   ```

3. **Configure Environment Variables**:
   Copy `server/.env.example` to `server/.env`:
   ```bash
   cp server/.env.example server/.env
   ```
   Open `server/.env` and fill in your database credentials and secret key:
   ```env
   DATABASE_URL=mysql+pymysql://<username>:<password>@<host>:<port>/<database>?ssl_verify_cert=true&ssl_verify_identity=true
   SECRET_KEY=your-super-secret-jwt-key-change-this
   ```

4. **Initialize Database Tables**:
   The app automatically creates tables upon startup via SQLAlchemy. Alternatively, you can run the queries in `server/queries.sql` directly in your MySQL / TiDB console.

5. **Start the Backend Server**:
   From the `server` directory:
   ```bash
   cd server
   uvicorn app.main:app --reload
   ```
   - API runs at: `http://localhost:8000`
   - Interactive Swagger API Docs: `http://localhost:8000/docs`

---

### 2. Frontend Setup (Next.js)

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Ensure the API URL points to the FastAPI server:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   - Open your browser at: `http://localhost:3000`

---

## How JWT Authentication Works in This Project

This project uses **JSON Web Tokens (JWT)** and **bcrypt** password hashing for secure authentication.

```
+----------+             1. POST /users/login (email, password)             +----------+
|          | -------------------------------------------------------------> |          |
|          | <------------------------------------------------------------- |          |
|          |             2. Returns { access_token, token_type: "bearer" }  |          |
|  Client  |                                                                | FastAPI  |
| (Next.js)|             3. Store token in localStorage                     | Backend  |
|          |                                                                |          |
|          |             4. GET /notes/ with Header:                        |          |
|          |                Authorization: Bearer <access_token>            |          |
|          | -------------------------------------------------------------> |          |
+----------+                                                                +----------+
```

### 1. Password Hashing (`server/app/auth.py`)
- Passwords are never saved as plain text.
- We use `passlib` with `bcrypt`:
  ```python
  pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

  def hash_password(password: str) -> str:
      return pwd_context.hash(password)

  def verify_password(plain_password: str, hashed_password: str) -> bool:
      return pwd_context.verify(plain_password, hashed_password)
  ```

### 2. Creating the Token (`server/app/auth.py`)
- When a user logs in via `POST /users/login`, the backend verifies their password and creates a signed JWT token containing the user's email (`sub` claim) and expiration timestamp (60 minutes):
  ```python
  def create_access_token(data: dict) -> str:
      to_encode = data.copy()
      to_encode["exp"] = datetime.utcnow() + timedelta(minutes=60)
      return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
  ```

### 3. Protecting Routes (`get_current_user`)
- Protected FastAPI endpoints use dependency injection `Depends(get_current_user)`:
  ```python
  def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
      payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
      email = payload.get("sub")
      user = db.query(User).filter(User.email == email).first()
      return user
  ```

### 4. Client-Side Token Storage & Request Interceptor (`client/src/lib/api.ts`)
- On successful login, the client saves the token into browser `localStorage`:
  ```javascript
  localStorage.setItem("token", response.data.access_token);
  ```
- An **Axios Interceptor** automatically attaches the JWT token in the `Authorization` header on every outgoing API request:
  ```typescript
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```
- If the token expires or becomes invalid, the backend responds with `401 Unauthorized`, and the frontend removes the token and redirects the user to `/login`.

---

## API Endpoints Overview

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| `POST` | `/users/register` | Register a new user | No |
| `POST` | `/users/login` | Login and receive a JWT token | No |
| `GET` | `/notes/` | List notes | Yes / Optional |
| `GET` | `/notes/{id}` | Get single note by ID | Yes / Optional |
| `POST` | `/notes/` | Create a new note | Yes / Optional |
| `PUT` | `/notes/{id}` | Update an existing note | Yes / Optional |
| `DELETE`| `/notes/{id}` | Delete a note | Yes / Optional |

---

## Helpful Commands

- **Run Backend**: `cd server && uvicorn app.main:app --reload`
- **Run Frontend**: `cd client && npm run dev`
- **Build Frontend**: `cd client && npm run build`
