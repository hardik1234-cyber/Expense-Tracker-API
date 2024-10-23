from fastapi import FastAPI
from xpense_tracker.services.authentication.auth import auth_router
from xpense_tracker.services.UserManagementSystem.ums import ums_router
from xpense_tracker.services.ExpenseManagementSystem.ems import ems_router
from xpense_tracker.services.ReportingManagementSystem.rms import rms_router

app = FastAPI()

app.include_router(auth_router)
app.include_router(ums_router)
app.include_router(ems_router)
app.include_router(rms_router)