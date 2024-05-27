from sqlmodel import SQLModel,Field
from uuid import uuid4,UUID

class User(SQLModel,table=True):
    id: UUID = Field(primary_key=True)
    username: str
    password: str
    email: str