FROM python:3.10-slim

WORKDIR /app

COPY xpense_tracker/pyproject.toml xpense_tracker/poetry.lock /app/

RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

COPY . /app

EXPOSE 8080

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "xpense_tracker.main:app", "--reload", "--host", "127.0.0.1", "--port", "8080"]
