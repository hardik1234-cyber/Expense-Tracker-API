from sqlmodel import SQLModel,Field

class User(SQLModel,table=True):
    username: str = Field(index=True, unique=True,primary_key=True)
    password: str
    email: str = Field(index=True, unique=True)