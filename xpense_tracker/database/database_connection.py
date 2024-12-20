from sqlmodel import SQLModel,create_engine,Session

# DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
DB_URL = "postgresql://pstgres:JPF7EqkIr26aV6CusOOv5l6rurgFJERB@dpg-ctip84ggph6c738b0n70-a.frankfurt-postgres.render.com/testdb_a81n"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session