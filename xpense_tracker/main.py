from fastapi import FastAPI, Depends, HTTPException,APIRouter
from services.user_registration.registration import registration_router 
from services.authentication.auth import auth_router
app = FastAPI()


@app.get('/')
def test():
    return {"ping":"pong"}

app.include_router(registration_router)
app.include_router(auth_router)