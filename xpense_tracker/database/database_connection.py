from sqlmodel import SQLModel,create_engine,Session

DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
# DB_URL = "postgresql://expense_tracker_prod_db_user:yUlbsCXSlPe9WhrVwmDSe4yABYyj37lz@dpg-ctiqlhogph6c738blsag-a.frankfurt-postgres.render.com/expense_tracker_prod_db"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session


        