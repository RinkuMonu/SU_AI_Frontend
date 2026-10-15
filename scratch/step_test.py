import sys
sys.path.insert(0, r"C:\Users\dy160\projects\SU_AI_Backend")
import dns.resolver
dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
dns.resolver.default_resolver.nameservers = ['8.8.8.8']
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.services.instagram_service import decrypt_token, InstagramService
import asyncio, httpx

async def step_by_step():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DATABASE_NAME]
    u = await db['users'].find_one({'instagram_username': 'dev.deepak_'})
    conn = await db['instagram_connections'].find_one({'user_id': str(u['_id']), 'platform': 'instagram'})
    token = decrypt_token(conn['encrypted_access_token'])
    ig_user_id = conn['instagram_user_id']
    
    print(f"Token: {token[:15]}... | User ID: {ig_user_id}")
    
    image_url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80"
    caption = "DhandaGrow AI Live Publish Test #dhandagrow #ai"
    
    print("\n--- STEP 1: Create Image Container ---")
    cid = await InstagramService.create_image_container(token, ig_user_id, image_url, caption)
    print("Container ID:", cid)
    
    print("\n--- STEP 2: Wait / Poll Container Status ---")
    st = await InstagramService.wait_for_container(token, cid, max_attempts=5, interval=2)
    print("Container Status:", st)
    
    print("\n--- STEP 3: Publish Container ---")
    mid = await InstagramService.publish_container(token, ig_user_id, cid)
    print("Published Media ID:", mid)
    
    print("\n--- STEP 4: Query me/media ---")
    async with httpx.AsyncClient(timeout=10.0) as http:
        r = await http.get(f"https://graph.instagram.com/v21.0/me/media?fields=id,caption,media_type,permalink,timestamp&access_token={token}")
        data = r.json().get("data", [])
        print(f"Total media items: {len(data)}")
        if data:
            print("Latest item on Instagram:", data[0])

if __name__ == "__main__":
    asyncio.run(step_by_step())
