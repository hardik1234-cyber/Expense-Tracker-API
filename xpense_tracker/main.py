from fastapi import FastAPI, Response,Request
from services.authentication.auth import auth_router
from services.UserManagementSystem.ums import ums_router
from services.ExpenseManagementSystem.ems import ems_router
from services.ReportingManagementSystem.rms import rms_router
from prometheus_client import Counter, Histogram, Gauge, generate_latest
import time
import psutil


app = FastAPI()
 
REQUEST_COUNT = Counter("http_requests_total", "Total HTTP requests", ["method", "endpoint", "status"])
REQUEST_DURATION = Histogram("request_duration_seconds", "Request duration in seconds")
CPU_USAGE = Gauge("cpu_usage_percent", "CPU usage percent")
MEMORY_USAGE = Gauge("memory_usage_percent", "Memory usage percent")

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    REQUEST_COUNT.labels(request.method, request.url.path, str(response.status_code)).inc()
    REQUEST_DURATION.observe(duration)
    return response


@app.get("/metrics")
def metrics():
    CPU_USAGE.set(psutil.cpu_percent())
    MEMORY_USAGE.set(psutil.virtual_memory().percent)
    return Response(generate_latest(), media_type="text/plain")


@app.get('/')
def on_startup():
    return {"Welcome to Expense Tracker API"}


app.include_router(auth_router)
app.include_router(ums_router)
app.include_router(ems_router)
app.include_router(rms_router)