from uuid import UUID
import uuid
from sqlmodel import SQLModel

class BaseUserModel(SQLModel):
    username: str
    password:str
    email: str

class UserResponseModel(SQLModel):
    id : uuid.UUID
    username: str
    email: str
    
    class Config:
        orm_mode = True