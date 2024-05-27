import uuid
from sqlmodel import SQLModel,Field
from uuid import uuid4,UUID

class User(SQLModel,table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    username: str 
    password: str
    email: str