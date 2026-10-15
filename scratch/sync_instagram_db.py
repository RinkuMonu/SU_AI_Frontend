import sys
sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")
import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from bson import ObjectId
from datetime import datetime, timezone
import asyncio

async def sync_connections():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    # 1. Find the real active connection for dev.deepak_
    real_conn = await db["instagram_connections"].find_one({
        "instagram_username": "dev.deepak_",
        "connected": True
    })
    
    if not real_conn:
        print("Real connection not found!")
        return

    print("Found real connection:", {
        "instagram_username": real_conn.get("instagram_username"),
        "instagram_user_id": real_conn.get("instagram_user_id"),
        "has_token": bool(real_conn.get("encrypted_access_token"))
    })
    
    encrypted_token = real_conn["encrypted_access_token"]
    ig_user_id = real_conn["instagram_user_id"]
    ig_username = real_conn["instagram_username"]
    now = datetime.now(timezone.utc)
    
    # Target users to sync
    target_emails = [
        "sejalgupta1838@gmail.com",
        "dy160080@gmail.com",
        "hrao20424@gmail.com",
        "ig_deepak_yadav@instagram.user"
    ]
    
    users = await db["users"].find({"email": {"$in": target_emails}}).to_list(100)
    print(f"Syncing connection to {len(users)} users...")
    
    for u in users:
        uid = str(u["_id"])
        # Update user doc
        await db["users"].update_one(
            {"_id": u["_id"]},
            {"$set": {
                "instagram_connected": True,
                "instagram_connected_at": now,
                "instagram_username": ig_username,
                "instagram_user_id": ig_user_id,
                "instagram_business_id": ig_user_id,
                "instagramId": ig_user_id,
                "instagram_access_token": encrypted_token,
            }}
        )
        
        # Update instagram_connections for this user_id
        await db["instagram_connections"].update_one(
            {"user_id": uid, "platform": "instagram"},
            {"$set": {
                "user_id": uid,
                "platform": "instagram",
                "account_type": "BUSINESS",
                "connected": True,
                "encrypted_access_token": encrypted_token,
                "instagram_user_id": ig_user_id,
                "instagram_username": ig_username,
                "login_method": "instagram_login",
                "updated_at": now,
            }},
            upsert=True
        )
        
        # Update any businesses owned by this user
        business_query_or = [
            {"ownerId": uid},
            {"owner_id": uid},
            {"user_id": uid},
            {"userId": uid},
            {"_id": u["_id"]},
        ]
        await db["businesses"].update_many(
            {"$or": business_query_or},
            {"$set": {
                "ig_connected": True,
                "ig_account_id": ig_user_id,
                "ig_username": ig_username,
                "updated_at": now,
            }}
        )
        print(f"  Synced to user: {u.get('email')} ({uid})")

    print("\n--- DB Sync Completed Successfully! ---")

if __name__ == "__main__":
    asyncio.run(sync_connections())
