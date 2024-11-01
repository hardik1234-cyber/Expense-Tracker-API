from sqlmodel import SQLModel,create_engine,Session

# DB_URL = "postgresql://postgres:root@localhost:5432/testdb"
DB_URL = "postgresql://walter:nyBsH4HuV5k1bNEzSv7XYmyW9Ccsy5XV@dpg-cscfk1tds78s738phf0g-a.frankfurt-postgres.render.com/xpense_db_hcls"
engine = create_engine(DB_URL)

def get_session():
    with Session(engine) as session:
        yield session