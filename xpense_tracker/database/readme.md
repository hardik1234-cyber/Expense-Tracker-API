# Steps to make the changes in the deployed database

1. Deploy the postgres database on render.
2. Copy the External Database URL from there.
3. Paste the External Database URL in the "PROD_DB_URL" in ".env" and "sqlalchemy.url" in "alembic.ini" file
4. Push the latest changes in the deployed database with "alembic revision --autogenerate -m "added new tables""      
5. If alembic error comes in the 5th step , then first run "alembic heads" and then "alembic upgrade head"
6. Run "alembic upgrade head" command.
7. deploy the changes and run the webapp with the latest changes.


