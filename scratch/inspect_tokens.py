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

async def inspect():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    conns = await db['instagram_connections'].find().to_list(20)
    for c in conns:
        user_id = str(c.get('user_id'))
        oid = ObjectId(user_id) if ObjectId.is_valid(user_id) else user_id
        u = await db['users'].find_one({'_id': oid})
        token = None
        if c.get('encrypted_access_token'):
            try:
                token = decrypt_token(c['encrypted_access_token'])
            except Exception as e:
                token = f"Error: {e}"
        
        email = u.get("email") if u else "No user"
        name = u.get("name") if u else "No user"
        print("--------------------------------------------------")
        print(f"User ID: {user_id} | Name: {name} | Email: {email}")
        print(f"IG Username: {c.get('instagram_username')} | IG User ID: {c.get('instagram_user_id')}")
        print(f"Login Method: {c.get('login_method')} | Connected: {c.get('connected')}")
        token_str = token or ""
        print(f"Token: {token_str[:15]}...{token_str[-10:] if token_str else ''} (len: {len(token_str)})")
        
        # If token is real, test it with Graph API!
        if token and not token.startswith("DEMO") and not token.startswith("Error"):
            print("Testing token with Instagram / Graph API...")
            async with httpx.AsyncClient(timeout=10.0) as http_client:
                # Test debug_token or /me
                # 1. Test graph.facebook.com/me
                r1 = await http_client.get(f"https://graph.facebook.com/v21.0/me?access_token={token}&fields=id,name")
                print(f"  Graph /me status: {r1.status_code} -> {r1.text}")
                
                # 2. Test graph.instagram.com/me
                r2 = await http_client.get(f"https://graph.instagram.com/me?access_token={token}&fields=id,username,account_type")
                print(f"  Instagram Graph /me status: {r2.status_code} -> {r2.text}")

                # 3. Test permissions / debug token
                app_token = f"{settings.INSTAGRAM_APP_ID}|{settings.INSTAGRAM_APP_SECRET}"
                r3 = await http_client.get(f"https://graph.facebook.com/debug_token?input_token={token}&access_token={app_token}")
                print(f"  Debug token status: {r3.status_code} -> {r3.text}")

                # 4. If IG User ID exists, test /{ig_user_id}
                ig_uid = c.get('instagram_user_id')
                if ig_uid:
                    r4 = await http_client.get(f"https://graph.facebook.com/v21.0/{ig_uid}?access_token={token}&fields=id,username,name")
                    print(f"  Graph /{ig_uid} status: {r4.status_code} -> {r4.text}")

if __name__ == "__main__":
    asyncio.run(inspect())
