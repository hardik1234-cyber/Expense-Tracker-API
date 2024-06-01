from datetime import datetime
from sqlmodel import SQLModel


class UserBaseModel(SQLModel):
    username: str
    email:str
