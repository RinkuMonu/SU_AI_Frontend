import sys
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")
import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.services.social_service import SocialService
from bson import ObjectId
import asyncio

async def test_publish():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    # Content 6ad08328a5b6ffaefdb6bbcd
    target_id = "6ad08328a5b6ffaefdb6bbcd"
    content = await db["contents"].find_one({"_id": ObjectId(target_id)})
    if not content:
        # Find any content with image_url
        content = await db["contents"].find_one({"image_url": {"$exists": True, "$ne": None}})
        target_id = str(content["_id"])
        
    print(f"Testing publish for content: {target_id}")
    print(f"Caption: {content.get('caption')}")
    print(f"Image URL: {content.get('image_url')}")
    
    user_id = "6ad06fe2b45fb4df3df59457"  # Deepak Yadav (has dev.deepak_ Instagram)
    res = await SocialService.publish_to_instagram(
        db=db,
        business_id=user_id,
        content_id=target_id
    )
    print("SUCCESS! Published Result:", res)

if __name__ == "__main__":
    asyncio.run(test_publish())
