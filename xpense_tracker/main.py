from fastapi import FastAPI
from services.authentication.auth import auth_router
from services.UserManagementSystem.ums import ums_router
from services.ExpenseManagementSystem.ems import ems_router
from services.ReportingManagementSystem.rms import rms_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(ums_router)
app.include_router(ems_router)
app.include_router(rms_router)