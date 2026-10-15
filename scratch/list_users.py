import sys
sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")
import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import asyncio

async def list_users():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    users = await db['users'].find().to_list(100)
    print(f"Total users: {len(users)}")
    for u in users:
        print(f"ID: {str(u['_id'])} | Email: {u.get('email')} | Name: {u.get('name') or u.get('fullName')} | IG_connected: {u.get('instagram_connected')} | IG_user: {u.get('instagram_username')}")

if __name__ == "__main__":
    asyncio.run(list_users())
