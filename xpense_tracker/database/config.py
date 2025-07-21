from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROD_DB_URL: str
    lOCAL_DB_URL: str
    SECRET_KEY: str
    ALGORITHM : str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()