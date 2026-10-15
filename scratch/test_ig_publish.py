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
from app.services.instagram_service import decrypt_token
from bson import ObjectId
import asyncio
import httpx

async def test_publish():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    # Get dev.deepak_
    u = await db['users'].find_one({"instagram_username": "dev.deepak_"})
    user_id = str(u["_id"])
    conn = await db['instagram_connections'].find_one({"user_id": user_id, "platform": "instagram"})
    token = decrypt_token(conn["encrypted_access_token"])
    ig_user_id = conn["instagram_user_id"]
    
    print(f"Testing for user {u['name']} (IG: {conn['instagram_username']}, ID: {ig_user_id})")
    print(f"Token length: {len(token)}")
    
    # Public test image
    test_image_url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80"
    
    async with httpx.AsyncClient(timeout=30.0) as http_client:
        # Check permissions on graph.instagram.com/me/permissions or me
        # First: graph.instagram.com/me?fields=id,username,account_type
        r = await http_client.get(f"https://graph.instagram.com/me?fields=id,username,account_type&access_token={token}")
        print("graph.instagram.com/me:", r.status_code, r.text)

        # Check me?fields=permissions
        r_perm = await http_client.get(f"https://graph.instagram.com/me?fields=permissions&access_token={token}")
        print("graph.instagram.com/me?fields=permissions:", r_perm.status_code, r_perm.text)

        # Let's test creating a container on graph.instagram.com/v21.0/{ig_user_id}/media
        url1 = f"https://graph.instagram.com/v21.0/{ig_user_id}/media"
        payload = {
            "image_url": test_image_url,
            "caption": "Testing DhandaGrow AI automated post #ai #business",
            "access_token": token
        }
        res1 = await http_client.post(url1, params=payload)
        print(f"POST {url1}:", res1.status_code, res1.text)

        # Let's also test on graph.instagram.com/{ig_user_id}/media (without version or with v21.0)
        url2 = f"https://graph.instagram.com/{ig_user_id}/media"
        res2 = await http_client.post(url2, params=payload)
        print(f"POST {url2}:", res2.status_code, res2.text)

        # Let's also test on graph.instagram.com/me/media
        url3 = "https://graph.instagram.com/me/media"
        res3 = await http_client.post(url3, params=payload)
        print(f"POST {url3}:", res3.status_code, res3.text)

if __name__ == "__main__":
    asyncio.run(test_publish())
