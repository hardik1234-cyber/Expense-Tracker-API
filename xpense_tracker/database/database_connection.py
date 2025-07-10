from sqlmodel import create_engine,Session

# DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
DB_URL = "postgresql://xpense_tracker_prod_db_user:cvFpmu7H9u4W5Hw2FvelprYHrfIgheiC@dpg-d1nm82umcj7s73fc5qrg-a.oregon-postgres.render.com/xpense_tracker_prod_db"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session


        