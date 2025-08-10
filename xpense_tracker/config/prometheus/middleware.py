from time import time
from starlette.middleware.base import BaseHTTPMiddleware
from prometheus_client import Counter,Histogram

REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["app_name", "method", "endpoint", "http_status"]
)

REQUEST_LATENCY = Histogram(
    "http_request_latency_seconds",
    "HTTP request latency in seconds",
    ["app_name", "method", "endpoint", "http_status"]
)

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        start_time = time()
        REQUEST_COUNT.labels(
            app_name="xpense_tracker",
            method=request.method,
            endpoint=request.url.path,
            http_status=str(response.status_code)
        ).inc()

        REQUEST_LATENCY.labels(
        app_name="xpense_tracker",
        method=request.method,
        endpoint=request.url.path,
        http_status=str(response.status_code)
        ).observe(time() - start_time)

        return response