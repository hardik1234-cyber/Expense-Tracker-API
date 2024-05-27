from sqlmodel import SQLModel,create_engine,Session

DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
engine = create_engine(DB_URL,echo=True)

def get_session():
    with Session(engine) as session:
        yield session