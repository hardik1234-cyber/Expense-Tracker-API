from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User
from schemas.ums.ums_model import UserBaseModel

ums_router = APIRouter(tags=['User Management System'])

@ums_router.get('/user',response_model=UserBaseModel)
def get_user(user_name: str, db: Session = Depends(get_session)):

    user = db.exec(select(User).where(User.username == user_name)).one_or_none()

    return UserBaseModel(username=User.username,email=User.email)

    