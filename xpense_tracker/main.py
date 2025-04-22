from fastapi import FastAPI
from xpense_tracker.services.authentication.auth import auth_router
from xpense_tracker.services.UserManagementSystem.ums import ums_router
from xpense_tracker.services.ExpenseManagementSystem.ems import ems_router
from xpense_tracker.services.ReportingManagementSystem.rms import rms_router
from redis import Redis 
import httpx

app = FastAPI()

@app.get('/')
def on_startup():
    return {"Welcome to Expense Tracker API"}

@app.on_event("startup")
def startup_event():
    app.state.redis = Redis(host='localhost',port=6379)
    app.state.http_client = httpx.AsyncClient()

@app.on_event("shutdown")
def shutdown_event():
    app.state.redis.close()

app.include_router(auth_router)
app.include_router(ums_router)
app.include_router(ems_router)
app.include_router(rms_router)