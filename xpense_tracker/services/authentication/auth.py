from fastapi import APIRouter,Depends,status,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User
from schemas.authentication.auth_model import Token, UserSignUp, UserLogin
from services.authentication.utils import hash_pass,verify_pass
from services.authentication.oauth2 import create_access_token
from logs.logging import logger

auth_router = APIRouter(tags=['Authentication'])


@auth_router.post('/signup',status_code=status.HTTP_201_CREATED)
def sign_up(user: UserSignUp, db: Session = Depends(get_session)):

    new_user = User(username=user.username,password=hash_pass(user.password),email=user.email)

    try:
        logger.info("Adding the user in DB")
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception as e:
        logger.error("Unable to add user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Unable to add user , try again")
    finally:
        db.close()
    return "User Registered"

@auth_router.post('/login',response_model=Token)
def login(user_creds: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_session)):
    
    user = db.exec(select(User).where(User.username == user_creds.username)).one_or_none()

    if user is None:
        logger.error("Invalid user Credentials")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials!"
        )

    if not verify_pass(user_creds.password,user.password):
        logger.error("Invalid password Credentials")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials!"
        )
    
    try:
        access_token = create_access_token(data={"username": user.username})
    except Exception as e:
        logger.warning("Unable to login this user")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Unable to login this user")
    finally:
        db.close()
    return Token(access_token=access_token,token_type="bearer")
            