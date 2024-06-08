from typing import List
from sqlmodel import Relationship, SQLModel,Field
from datetime import datetime

class User(SQLModel,table=True):
    username: str = Field(index=True, unique=True,primary_key=True)
    password: str
    email: str = Field(index=True, unique=True)

    expenses: List["Expense"] = Relationship(back_populates='user',sa_relationship_kwargs={"cascade": "all, delete-orphan"})


class Expense(SQLModel,table=True):
    username: str = Field(foreign_key='user.username',primary_key=True)
    amount: float
    category: str
    description: str
    date: datetime

    user: User = Relationship(back_populates='expenses')
