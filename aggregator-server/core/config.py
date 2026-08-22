from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"
    debug: bool = True

    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/idagg"
    redis_url: str = "redis://localhost:6379/0"

    dojah_app_id: str = ""
    dojah_secret_key: str = ""
    dojah_base_url: str = "https://api.dojah.io"

    smile_id_partner_id: str = ""
    smile_id_api_key: str = ""
    smile_id_base_url: str = "https://api.smileidentity.com/v1"

    api_key_hash_salt: str = "change-me-in-production"
    jwt_secret: str = "change-me-in-production"


settings = Settings()