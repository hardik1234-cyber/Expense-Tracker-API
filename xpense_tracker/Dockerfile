FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN pip install poetry

RUN poetry config virtualenvs.create false && poetry install --no-dev --no-interaction --no-ansi

COPY . /app

EXPOSE 8080

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "main:app","--reload","--host", "127.0.0.1", "--port", "8080"]