from collections.abc import AsyncGenerator
import ssl
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from dotenv import load_dotenv
import os

load_dotenv()

ssl_context = ssl.create_default_context()

engine = create_async_engine(
    os.getenv("DB_URL"),
    # echo=settings.debug,       # logs SQL statements in dev, silent in prod
    pool_pre_ping=True,        # avoids stale connections after idle periods
    pool_size=5,
    max_overflow=10,
    connect_args={
        "ssl": ssl_context,
    },
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,    # keeps loaded attributes usable after commit
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency — yields a session per request and guarantees
    cleanup even if the request raises.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()