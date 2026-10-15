import sys
import os

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")

import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import asyncio

async def diagnose():
    print("Connecting to MongoDB:", settings.DATABASE_NAME)
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]

    print("\n--- Recent contents in db['contents'] ---")
    contents = await db["contents"].find().sort("_id", -1).limit(5).to_list(5)
    for c in contents:
        print("CONTENT:", {
            "id": str(c.get("_id")),
            "title": c.get("title"),
            "caption": c.get("caption", "")[:35] if c.get("caption") else None,
            "image_url": (c.get("image_url") or c.get("media_url") or "")[:45],
            "ig_media_id": c.get("ig_media_id"),
            "ig_post_id": c.get("ig_post_id"),
            "ig_status": c.get("ig_status"),
            "status": c.get("status"),
            "user_id": str(c.get("user_id")),
            "created_at": str(c.get("created_at")),
            "published_at": str(c.get("published_at")),
        })

    print("\n--- Instagram Connections in db['instagram_connections'] ---")
    conns = await db["instagram_connections"].find().to_list(10)
    for conn in conns:
        safe_c = {k: v for k, v in conn.items() if k != "encrypted_access_token"}
        safe_c["has_encrypted_token"] = bool(conn.get("encrypted_access_token"))
        print("CONN:", safe_c)

    print("\n--- Businesses in db['businesses'] ---")
    businesses = await db["businesses"].find().sort("_id", -1).limit(5).to_list(5)
    for b in businesses:
        print("BUSINESS:", {
            "id": str(b.get("_id")),
            "name": b.get("name"),
            "ownerId": str(b.get("ownerId") or b.get("owner_id")),
            "ig_account_id": b.get("ig_account_id"),
            "ig_username": b.get("ig_username"),
            "ig_connected": b.get("ig_connected"),
            "has_ig_token": bool(b.get("ig_access_token")),
            "facebook_page_id": b.get("facebook_page_id"),
            "fb_connected": b.get("fb_connected"),
        })

    print("\n--- Users with Instagram/Facebook details ---")
    users = await db["users"].find().sort("_id", -1).limit(5).to_list(5)
    for u in users:
        print("USER:", {
            "id": str(u.get("_id")),
            "email": u.get("email"),
            "name": u.get("name") or u.get("fullName"),
            "instagram_connected": u.get("instagram_connected"),
            "instagram_username": u.get("instagram_username"),
            "instagram_user_id": u.get("instagram_user_id"),
            "instagram_business_id": u.get("instagram_business_id"),
            "has_ig_token": bool(u.get("instagram_access_token")),
            "facebook_connected": u.get("facebook_connected"),
            "facebook_page_id": u.get("facebook_page_id"),
        })

if __name__ == "__main__":
    asyncio.run(diagnose())
