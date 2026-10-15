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
    c = await db['contents'].find_one({'_id': ObjectId('6aab91c2e4199b3bde517973')})
    print('ID:', c.get('_id'))
    print('image_url:', repr(c.get('image_url')))
    print('media_url:', repr(c.get('media_url')))
    print('imageUrl:', repr(c.get('imageUrl')))
    print('media_type:', repr(c.get('media_type')))

if __name__ == "__main__":
    asyncio.run(test())
