import sys
sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")
import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from bson import ObjectId
import asyncio

async def test():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    sessions = await db['refresh_sessions'].find().sort('_id', -1).limit(10).to_list(10)
    print("Recent refresh sessions:")
    for s in sessions:
        uid = str(s.get('userId') or s.get('user_id'))
        oid = ObjectId(uid) if ObjectId.is_valid(uid) else uid
        u = await db['users'].find_one({'_id': oid})
        email = u.get('email') if u else 'unknown'
        print(f"Session user_id={uid} | email={email} | expires={s.get('expiresAt')}")

if __name__ == "__main__":
    asyncio.run(test())
