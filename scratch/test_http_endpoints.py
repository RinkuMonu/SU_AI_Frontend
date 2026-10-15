import sys
sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")
import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.services.auth_service import AuthService
from datetime import timedelta
import asyncio, httpx

async def test_api():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    
    # Get user Deepak Yadav
    u = await db['users'].find_one({'email': 'dy160080@gmail.com'})
    user_id = str(u['_id'])
    
    # Create JWT access token for this user
    jwt_token = AuthService.create_token(
        user_id,
        settings.JWT_ACCESS_SECRET,
        timedelta(minutes=60)
    )
    
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json"
    }
    
    print(f"Testing HTTP endpoints for user: {u.get('email')} ({user_id})")
    
    # 1. Test POST /api/v1/instagram/publish-image
    async with httpx.AsyncClient(timeout=30.0) as http:
        print("\n--- Testing POST /api/v1/instagram/publish-image ---")
        payload1 = {
            "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80",
            "caption": "End-to-End API Test Post from DhandaGrow AI! #marketing #ai #growth"
        }
        res1 = await http.post("http://127.0.0.1:8000/api/v1/instagram/publish-image", json=payload1, headers=headers)
        print("Status code:", res1.status_code)
        print("Response:", res1.text)
        
        # 2. Test with content library: create a draft and publish via /api/v1/social/publish-instagram/{content_id}
        print("\n--- Testing POST /api/v1/social/publish-instagram/{content_id} ---")
        draft = await db["contents"].insert_one({
            "caption": "Effortless business growth with DhandaGrow AI automated marketing. #business #growth",
            "image_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80",
            "hashtags": ["#marketing", "#ai"],
            "status": "draft",
            "user_id": user_id,
        })
        cid = str(draft.inserted_id)
        
        res2 = await http.post(f"http://127.0.0.1:8000/api/v1/social/publish-instagram/{cid}", headers=headers)
        print("Status code:", res2.status_code)
        print("Response:", res2.text)

if __name__ == "__main__":
    asyncio.run(test_api())
