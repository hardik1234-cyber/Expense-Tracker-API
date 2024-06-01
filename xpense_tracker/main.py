from fastapi import Depends, FastAPI
from services.authentication.auth import auth_router
from services.authentication.oauth2 import get_current_user
app = FastAPI()


@app.get('/')
def test(get_logged_in_user = Depends(get_current_user)):
    return {"ping":"pong"}

app.include_router(auth_router)