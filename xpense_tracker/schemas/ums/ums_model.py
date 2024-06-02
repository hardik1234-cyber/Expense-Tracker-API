from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel


class UserBaseModel(SQLModel):
    username: str
    email:str
    class Config:
        orm_mode = True

class UserUpdateModel(SQLModel):
    username: Optional[str]
    password: Optional[str]
    email: Optional[str]
    