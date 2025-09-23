# Steps to make the changes in the deployed database

1. Deploy the postgres database on render.
2. Copy the EXTERNAL URL from there.
3. Paste the EXTERNAL URL in the "PROD_DB_URL" in ".env" and "sqlalchemy.url" in "alembic.ini" file
4. Push the latest changes in the deployed database with "alembic revision --autogenerate -m "added new tables"" command      
5. Run "alembic upgrade head" command.
6. deploy the changes and run the webapp with the latest changes.


