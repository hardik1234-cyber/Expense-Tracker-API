from datetime import datetime
from sqlmodel import SQLModel

class ExpenseModel(SQLModel):
    username: str
    amount: float
    category: str
    description: str
    date: datetime

class ExpenseDetails(SQLModel):
    amount: float
    category: str
    description: str
    date: datetime

    class Config:
        from_attributes = True

class ExpenseUpdateModel(SQLModel):
    amount: float
    category: str
    description: str
    date: datetime

