from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROD_DB_URL: str | None = None
    lOCAL_DB_URL: str
    SECRET_KEY: str
    ALGORITHM : str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    LOKI_ENDPOINT: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()