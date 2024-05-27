from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import select
from sqlmodel import Session
from database.database_connection import init_db


app = FastAPI()


@app.get('/')
def test():
    return {"ping":"pong"}

