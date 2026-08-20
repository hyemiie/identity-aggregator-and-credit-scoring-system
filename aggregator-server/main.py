from contextlib import asynccontextmanager

from fastapi import FastAPI

from db.models import Base
from db.session import engine


async def create_tables() -> None:
    print("HELLO - create_tables() is running!")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("Tables created!")


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("HELLO - lifespan() is running!")

    await create_tables()

    print("HELLO - create_tables() finished!")

    yield

    print("Application shutting down...")


app = FastAPI(lifespan=lifespan)