from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User
from schemas.ums.ums_model import UserBaseModel, UserUpdateModel
from services.authentication.oauth2 import get_current_user
from services.authentication.utils import hash_pass
from logs.logging import logger

ums_router = APIRouter(tags=['User Management System'])

@ums_router.get('/user_details',response_model=UserBaseModel,status_code=status.HTTP_200_OK)
def get_user_details(username: str,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):
    
    try: 
        user = db.exec(select(User).where(User.username == username)).one_or_none()

        if user is None:
            logger.warning("User not found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        logger.info("User found in DB")
        return UserBaseModel.model_validate(user)
    
    except Exception as e:
        logger.error("An error occurred while retrieving user details",e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving user details"
        )
    
    finally:
        db.close()

    
@ums_router.put('/update_user_details',response_model=UserBaseModel,status_code=status.HTTP_202_ACCEPTED)
def update_user(user_update: UserUpdateModel,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):
    
    user = db.exec(select(User).where(User.username == user_update.username)).one_or_none()

    if user is None:
        logger.warning("User not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user_update.username is not None:
        logger.debug("Updating username")
        user.username = user_update.username
    if user_update.password is not None:
        logger.debug("Updating password")
        user.password = hash_pass(user_update.password)
    if user_update.email is not None:
        logger.debug("Updating email")
        user.email = user_update.email
    
    try:

        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("User details updated successfully")

    except Exception as e:
        db.rollback()
        logger.error("Failed to update the details , rolling back")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user details"
        )
    
    finally:
        db.close()

    return UserBaseModel(username=user.username,email=user.email)


@ums_router.delete('/delete_user',status_code=status.HTTP_204_NO_CONTENT)
def delete_user(username:str,get_logged_in_user = Depends(get_current_user),db: Session = Depends(get_session)):

    user = db.exec(select(User).where(User.username == username)).one_or_none()

    if user is None:
        logger.warning("User not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    try :
        db.delete(user)
        db.commit()
        logger.info("User deleted successfully")
    except Exception as e:
        logger.error("Error in deleting the user")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the user."
        )
    finally:
        db.close()
        
    return f"User {username} successfully deleted !"