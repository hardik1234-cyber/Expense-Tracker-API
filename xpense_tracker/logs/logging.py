import logging
import logging_loki
from multiprocessing import Queue
from database.config import settings

loki_logs_handler  = logging_loki.LokiQueueHandler(
    Queue(-1),
    url=settings.LOKI_ENDPOINT,
    tags={"application": "xpense_tracker"},
    version="1",
)

logger = logging.getLogger(__name__)

uvicorn_access_logger = logging.getLogger("uvicorn.access")
uvicorn_access_logger.addHandler(loki_logs_handler)
logging.getLogger().addHandler(loki_logs_handler) 



