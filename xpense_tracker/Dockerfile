FROM python:3.12-slim

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --only main --no-interaction --no-ansi

COPY . /app

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

