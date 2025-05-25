# Steps to make the changes in the deployed database

1. Deploy the postgres database on render.
2. Copy the EXTERNAL URL from there.
3. Paste the EXTERNAL URL in the DB_URL in "database_connection.py" and "sqlalchemy.url" in "alembic.ini" file
4. deploy the changes and run the webapp with the latest changes.
5. Run "alembic upgrade head" command.
6. Push the latest changes in the deployed database with "alembic revision --autogenerate -m "added new tables"" command