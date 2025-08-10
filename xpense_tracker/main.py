from fastapi import FastAPI, Response
from services.authentication.auth import auth_router
from services.UserManagementSystem.ums import ums_router
from services.ExpenseManagementSystem.ems import ems_router
from services.ReportingManagementSystem.rms import rms_router
from config.prometheus.middleware import MetricsMiddleware
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

app = FastAPI()
 
app.add_middleware(MetricsMiddleware)

@app.get('/')
def on_startup():
    return {"Welcome to Expense Tracker API"}

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

app.include_router(auth_router)
app.include_router(ums_router)
app.include_router(ems_router)
app.include_router(rms_router)