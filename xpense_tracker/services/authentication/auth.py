from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select
from database.database_connection import get_session
from database.tables import User
from schemas.authentication.auth_model import Token, UserSignUp, UserLogin
from services.authentication.utils import hash_pass,verify_pass
from services.authentication.oauth2 import create_access_token

auth_router = APIRouter(tags=['Authentication'])


@auth_router.post('/signup',status_code=status.HTTP_201_CREATED)
def sign_up(user: UserSignUp, db: Session = Depends(get_session)):
    new_user = User(username=user.username,password=hash_pass(user.password),email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return "User Registered"

@auth_router.post('/login',response_model=Token)
def login(user_creds:UserLogin,db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.username == user_creds.username)).one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials!"
        )

    if not verify_pass(user_creds.password,user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid Credentials!"
        )
    
    access_token = create_access_token(data={"username": user.username})

    return Token(access_token=access_token,token_type="bearer")
            