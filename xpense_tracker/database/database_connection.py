from sqlmodel import create_engine,Session
from xpense_tracker.config import settings

DB_URL = settings.lOCAL_DB_URL
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session


        