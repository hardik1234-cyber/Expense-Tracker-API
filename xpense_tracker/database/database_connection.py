from sqlmodel import create_engine,Session

# DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
DB_URL = "postgresql://pstgres:NouDsbHtIvwuUEQtCuQLZ3ZVr01vHQsB@dpg-d0pcnr6mcj7s73e07v20-a/testdb_ulvx"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session


        