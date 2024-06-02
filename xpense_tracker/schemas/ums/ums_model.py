from datetime import datetime
from sqlmodel import SQLModel


class UserBaseModel(SQLModel):
    username: str
    email:str
    class Config:
        orm_mode = True

class UserUpdateModel(SQLModel):
    username: str
    password: str
    email: str
    