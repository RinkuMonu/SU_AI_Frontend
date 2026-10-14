import re

# 1. Update app/services/facebook_service.py
fb_path = r"C:\Users\dy160\projects\SU_AI_Backend\app\services\facebook_service.py"
with open(fb_path, "r", encoding="utf-8") as f:
    fb_code = f.read()

# Fix save_connection to NOT insert dummy businesses
old_insert = '''        res = await db["businesses"].update_many(
            business_query,
            {"$set": business_update},
        )
        if res.matched_count == 0:
            business_update["created_at"] = now
            await db["businesses"].insert_one(business_update)'''

new_insert = '''        res = await db["businesses"].update_many(
            business_query,
            {"$set": business_update},
        )
        # Note: If no business exists yet for this user, do NOT insert a dummy business.
        # The Facebook tokens are already securely saved on the user document below.'''

if old_insert in fb_code:
    fb_code = fb_code.replace(old_insert, new_insert)
    print("Updated facebook_service.py: Removed dummy business insertion")

# Fix authenticate_facebook_user to set onboardingCompleted = False on new user
old_new_user = '''            doc = user.model_dump(by_alias=True, exclude={"id"})
            doc["facebookId"] = fb_id
            doc["facebook_access_token"] = encrypted_token
            doc["facebook_connected"] = True
            doc["facebook_connected_at"] = now
            result = await db["users"].insert_one(doc)'''

new_new_user = '''            user.onboardingCompleted = False
            user.onboarding_step = 1
            doc = user.model_dump(by_alias=True, exclude={"id"})
            doc["facebookId"] = fb_id
            doc["facebook_access_token"] = encrypted_token
            doc["facebook_connected"] = True
            doc["facebook_connected_at"] = now
            doc["onboardingCompleted"] = False
            doc["onboarding_completed"] = False
            doc["onboarding_step"] = 1
            result = await db["users"].insert_one(doc)'''

if old_new_user in fb_code:
    fb_code = fb_code.replace(old_new_user, new_new_user)
    print("Updated facebook_service.py: Explicitly set onboardingCompleted=False for new Facebook user")

with open(fb_path, "w", encoding="utf-8") as f:
    f.write(fb_code)

# 2. Update app/api/endpoints/businesses.py: Avoid upserting empty businesses
biz_path = r"C:\Users\dy160\projects\SU_AI_Backend\app\api\endpoints\businesses.py"
with open(biz_path, "r", encoding="utf-8") as f:
    biz_code = f.read()

old_upsert = 'await db["businesses"].update_one(query, {"$set": clean_req}, upsert=True)'
new_upsert = '''has_name = bool(clean_req.get("businessName") or clean_req.get("name") or clean_req.get("business_name"))
        await db["businesses"].update_one(query, {"$set": clean_req}, upsert=has_name)'''

if old_upsert in biz_code:
    biz_code = biz_code.replace(old_upsert, new_upsert)
    with open(biz_path, "w", encoding="utf-8") as f:
        f.write(biz_code)
    print("Updated businesses.py: Protected against empty business upserts")

print("Backend base updates completed successfully!")
