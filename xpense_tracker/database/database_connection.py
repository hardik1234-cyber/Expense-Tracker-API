from sqlmodel import create_engine,Session

DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
# DB_URL = "postgresql://pstgres:ZGOk2sv5HSY3CTovdMuruKla3aLKyw42@dpg-d03tvt7gi27c738d8v30-a/testdb_83lk"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session


        