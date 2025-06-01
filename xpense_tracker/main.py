from fastapi import FastAPI
from services.authentication.auth import auth_router
from services.UserManagementSystem.ums import ums_router
from services.ExpenseManagementSystem.ems import ems_router
from services.ReportingManagementSystem.rms import rms_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def on_startup():
    return {"Welcome to Expense Tracker API"}


app.include_router(auth_router)
app.include_router(ums_router)
app.include_router(ems_router)
app.include_router(rms_router)