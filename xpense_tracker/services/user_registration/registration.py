from typing import List
from fastapi import Depends,APIRouter
from sqlmodel import Session, select
from database.database_connection import get_session
from schemas.user_registration.user_model import BaseUserModel, UserResponseModel
from database.tables import User
registration_router = APIRouter()

@registration_router.post('/signup')
def user_sign_up(user: BaseUserModel, db: Session = Depends(get_session)):
    new_user = User(username=user.username,password=user.password,email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponseModel(id=new_user.id, username=new_user.username, email=new_user.email)

    
@registration_router.get('/users',response_model=List[UserResponseModel])
def get_all_users(db: Session = Depends(get_session)):
    all_users = db.exec(select(User)).all()
    return all_users

@registration_router.delete('/delete')
def delete_user(user_name:str,db: Session = Depends(get_session)):
    deleteuser = db.exec(select(User).where(User.username == user_name)).first()
    db.delete(deleteuser)
    db.commit()
    return f"User {user_name} deleted successfully!"
    
