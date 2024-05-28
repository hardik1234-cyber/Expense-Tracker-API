from fastapi import FastAPI
from services.authentication.auth import auth_router
app = FastAPI()


@app.get('/')
def test():
    return {"ping":"pong"}

app.include_router(auth_router)