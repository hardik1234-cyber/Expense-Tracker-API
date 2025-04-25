# 💸 Expense Tracker API

A RESTful API for tracking personal expenses, managing user profiles, and generating monthly and yearly financial reports. Built with **FastAPI**, **PostgreSQL**, and **JWT** authentication for secure and efficient data handling.

---

## 🛠️ Tech Stack

- **Backend Framework**: [Python](https://www.python.org/) with [FastAPI](https://fastapi.tiangolo.com/) for building a high-performance RESTful API.
- **Database**: [PostgreSQL](https://www.postgresql.org/) for reliable, scalable, and structured data storage.
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/) for secure user authentication and session management.
- **ORM**: [SQLModel](https://sqlmodel.tiangolo.com/) for intuitive and elegant object-relational mapping, built on top of SQLAlchemy and Pydantic.

---

## 🚀 Features

- ✅ User registration and authentication
- 🧾 Expense CRUD operations
- 📊 Monthly and yearly expense reports with category breakdown
- 🔐 JWT-based secure access
- 📌 User profile management

---

## 📦 Installation (Poetry)

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/hardik1234-cyber/Expense-Tracker-API.git
   cd Expense-Tracker-API/xpense_tracker
   ```

2. **Install Poetry** (if not installed)  
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

3. **Install Dependencies**  
   ```bash
   poetry install
   ```

4. **Activate the Virtual Environment**  
   ```bash
   poetry shell
   ```

5. **Run the Application**  
   ```bash
   uvicorn main:app --reload
   ```

## 🧪 API Endpoints

### 🔐 User Management APIs

#### 1. Register User  
`POST /api/register`
```json
Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "strongpassword"
}

Response:
{
  "message": "User registered successfully"
}
```

#### 2. Login  
`POST /api/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "strongpassword"
}

Response:
{
  "token": "JWT token"
}
```

#### 3. Get Profile  
`GET /api/profile`  
**Headers**: `Authorization: Bearer <token>`
```json
Response:
{
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2025-01-01T12:00:00"
}
```

#### 4. Update Profile  
`PUT /api/profile`  
**Headers**: `Authorization: Bearer <token>`
```json
Request:
{
  "username": "new_username",
  "email": "new_email@example.com"
}

Response:
{
  "message": "Profile updated successfully"
}
```

---

### 💸 Expense Management APIs

#### 5. Add Expense  
`POST /api/expenses`  
**Headers**: `Authorization: Bearer <token>`
```json
Request:
{
  "amount": 250.50,
  "category": "Groceries",
  "description": "Supermarket run",
  "date": "2025-04-25T10:00:00"
}

Response:
{
  "message": "Expense added successfully"
}
```

#### 6. Get All Expenses  
`GET /api/expenses`  
**Headers**: `Authorization: Bearer <token>`
```json
Response:
[
  {
    "id": 1,
    "amount": 250.50,
    "category": "Groceries",
    "description": "Supermarket run",
    "date": "2025-04-25T10:00:00"
  }
]
```

#### 7. Get Expense by ID  
`GET /api/expenses/{id}`  
**Headers**: `Authorization: Bearer <token>`
```json
Response:
{
  "id": 1,
  "amount": 250.50,
  "category": "Groceries",
  "description": "Supermarket run",
  "date": "2025-04-25T10:00:00"
}
```

#### 8. Update Expense  
`PUT /api/expenses/{id}`  
**Headers**: `Authorization: Bearer <token>`
```json
Request:
{
  "amount": 300,
  "category": "Utilities",
  "description": "Electricity bill",
  "date": "2025-04-20T09:00:00"
}

Response:
{
  "message": "Expense updated successfully"
}
```

#### 9. Delete Expense  
`DELETE /api/expenses/{id}`  
**Headers**: `Authorization: Bearer <token>`
```json
Response:
{
  "message": "Expense deleted successfully"
}
```

---

### 📈 Reporting APIs

#### 10. Monthly Report  
`GET /api/reports/monthly`  
**Headers**: `Authorization: Bearer <token>`
```json
Response:
{
  "month": "April",
  "total_expenses": 1500.75,
  "category_breakdown": {
    "Groceries": 600.50,
    "Utilities": 300.25
  }
}
```

#### 11. Yearly Report  
`GET /api/reports/yearly`  
**Headers**: `Authorization: Bearer <token>`
```json
Response:
{
  "year": "2025",
  "total_expenses": 18250.00,
  "category_breakdown": {
    "Groceries": 8000,
    "Utilities": 5250,
    "Travel": 3000
  }
}
```

---


## 🔐 Authentication

- Uses **JWT Tokens** for secure session handling.
- Every protected endpoint requires:
  ```
  Authorization: Bearer <your_token>
  ```

---

## 📌 Contribution

Feel free to fork this repo, create a feature branch, and open a pull request!  
If you find any bugs or have suggestions, open an issue.

---

## 📃 License

MIT License – use it freely in your own projects.

---

## 📞 Contact

Made with 💙 by [Hardik](https://github.com/hardik1234-cyber)

---
