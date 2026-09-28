import sys
path = r'c:\Users\PC8\Downloads\Sevenunique_AI_Backend\SU_AI_Backend\app\services\website_builder_service.py'
with open(path, 'r') as f:
    c = f.read()

old = '''        existing_doc = await collection.find_one({"user_id": user_id, "status": "active"})
        if existing_doc:
            return WebsiteBuilderSession(**existing_doc)'''

new_b = '''        await collection.update_many({"user_id": user_id, "status": "active"}, {"$set": {"status": "archived"}})'''

if old in c:
    c = c.replace(old, new_b)
    print("Replaced existing_doc check.")
else:
    print("Could not find old existing_doc block.")

old_load = 'await WebsiteBuilderService.load_existing_user_data(user_id, session)'
new_load = '# await WebsiteBuilderService.load_existing_user_data(user_id, session)'

if old_load in c:
    c = c.replace(old_load, new_load)
    print("Commented out load_existing_user_data.")
else:
    print("Could not find load_existing_user_data block.")

with open(path, 'w') as f:
    f.write(c)

print("Patch complete.")
