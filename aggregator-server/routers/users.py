import hashlib
import uuid

from fastapi import FastAPI, APIRouter
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

from db.models import Base
from db.session import engine, AsyncSessionLocal
from core.errors import NotFoundError, register_exception_handlers
from sqlalchemy import text



router= APIRouter()

class UserSignup(BaseModel):
    name: str
    email: str 
    company_name: str




@router.post('/signup')
async def user_signup(user_details: UserSignup):
    print('received detials', user_details)
    name = user_details.name
    email = user_details.email
    company_name = user_details.company_name

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            text("""
                INSERT INTO developers (id, name, email, company_name)
                VALUES (gen_random_uuid(), :name, :email, :company_name)
                RETURNING id
            """),
    {"name": name, "email": email, "company_name": company_name},
        )
        developer_id = result.scalar_one()


        await session.commit()

    print(f"Developer created: {developer_id}")
    return result

@router.put("/update/{id}")
async def user_edit(user_details: UserSignup, id: uuid.UUID):
    name = user_details.name
    email = user_details.email
    company_name = user_details.company_name

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            text("""
                UPDATE developers
                SET name = :name, email = :email, company_name = :company_name
                WHERE id = :id
                RETURNING id
            """),
            {"id": id, "name": name, "email": email, "company_name": company_name},
        )
        updated_id = result.scalar_one_or_none()

        if updated_id is None:
            raise NotFoundError(f"No developer found for id={id}")

        await session.commit()

    return {"id": updated_id, "status": "updated"}

@router.get("/user/{id}")
async def get_user(id: uuid.UUID):
    print('received detials', id)
  
    async with AsyncSessionLocal() as session:
           result = await session.execute(
        text("""
            SELECT id, name, email, company_name FROM developers
            WHERE id = :id
        """),
        {"id": id},
    )
    developer = result.mappings().one_or_none()

    if developer is None:
            raise NotFoundError(f"No developer found for id={id}")
    
    await session.commit()

    return {"developer": developer}


@router.get("/users")
async def list_users():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            text("SELECT id, name, email, company_name, created_at FROM api_keys")
        )
        developers = result.mappings().all()

    return {"developers": [dict(d) for d in developers]}


@router.delete("/user/{id}")
async def delete_user(id: uuid.UUID):
    print('received detials', id)
  
    async with AsyncSessionLocal() as session:
           result = await session.execute(
        text("""
            SELECT id, name, email, company_name FROM developers
            WHERE id = :id
        """),
        {"id": id},
    )
           
           if not result.mappings(). one_or_none():
                await session.execute(text("""
            DELETE FROM developers 
                WHERE id = :id
            """), 
            {"id": id})
                
    await session.commit()

    return {"developer deleted"}


@router.post("/user/{id}/key")
async def create_key(id: uuid.UUID):
    raw_key = f"sk_test_{uuid.uuid4().hex[:16]}"
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()

    async with AsyncSessionLocal() as session:
        dev_check = await session.execute(
            text("SELECT id FROM developers WHERE id = :id"),
            {"id": id},
        )

        if dev_check.scalar_one_or_none() is None:
            raise NotFoundError(f"No developer found for id={id}")

        key_result = await session.execute(
            text("""
                INSERT INTO api_keys (id, developer_id, key_hash, mode, is_active)
                VALUES (gen_random_uuid(), :developer_id, :key_hash, 'sandbox', true)
                RETURNING id
            """),
            {"developer_id": id, "key_hash": key_hash},
        )
        api_key_id = key_result.scalar_one()
        await session.commit()

    return {"api_key_id": api_key_id, "raw_key": raw_key, "status": "created"}