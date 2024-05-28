from sqlmodel import SQLModel


class UserLogin(SQLModel):
    username: str
    password:str

class UserSignUp(UserLogin):
    email: str

