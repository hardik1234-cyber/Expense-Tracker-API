from datetime import datetime
from sqlmodel import SQLModel


class UserLogin(SQLModel):
    username: str
    password:str

class UserSignUp(UserLogin):
    email: str

class Token(SQLModel):
    access_token: str
    token_type: str

class DataToken(SQLModel):
    username: str

