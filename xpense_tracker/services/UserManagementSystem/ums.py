from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User
from schemas.ums.ums_model import UserBaseModel, UserUpdateModel
from services.authentication.oauth2 import get_current_user
from services.authentication.utils import hash_pass

ums_router = APIRouter(tags=['User Management System'])

@ums_router.get('/user_details',response_model=UserBaseModel,status_code=status.HTTP_200_OK)
def get_user_details(username: str,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):
    
    user = db.exec(select(User).where(User.username == username)).one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserBaseModel.model_validate(user)

    
@ums_router.put('/update_user_details',response_model=UserBaseModel,status_code=status.HTTP_202_ACCEPTED)
def update_user(user_update: UserUpdateModel,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):
    
    user = db.exec(select(User).where(User.username == user_update.username)).one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user_update.username is not None:
        user.username = user_update.username
    if user_update.password is not None:
        user.password = hash_pass(user_update.password)
    if user_update.email is not None:
        user.email = user_update.email
    
    db.add(user)
    db.commit()
    db.refresh(user)

    return UserBaseModel(username=user.username,email=user.email)


@ums_router.delete('/delete_user',status_code=status.HTTP_204_NO_CONTENT)
def delete_user(username:str,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    user = db.exec(select(User).where(User.username == username)).one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()

    return f"User {username} successfully deleted !"