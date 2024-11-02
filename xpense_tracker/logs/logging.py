import logging

logging.basicConfig(
    level=logging.DEBUG,
    filename='text.log',
    format='%(asctime)s - %(levelname)s - %(message)s'

)

logger = logging.getLogger(__name__)

