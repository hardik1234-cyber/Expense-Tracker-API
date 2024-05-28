from fastapi import APIRouter,Depends,status,HTTPException,Response
from sqlmodel import Session, select

from database.database_connection import get_session
from database.tables import User
from schemas.authentication.auth_model import UserSignUp, UserLogin
from services.authentication.utils import hash_pass

auth_router = APIRouter(tags=['Authentication'])


@auth_router.post('/signup',status_code=status.HTTP_201_CREATED)
def sign_up(user: UserSignUp, db: Session = Depends(get_session)):

    hashed_password = hash_pass(user.password)
    print(hashed_password)
    new_user = User(username=user.username,password=hashed_password,email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return "Registered"

@auth_router.post('/login')
def login(user_creds:UserLogin,db: Session = Depends(get_session)):

    user = db.exec(select(User).filter(User.username == user_creds.username))

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Invalid Credentials")
    
    return "Logged in Successfully!"
    

    

    




