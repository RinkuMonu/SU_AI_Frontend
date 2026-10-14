import pymongo
from bson import ObjectId

client = pymongo.MongoClient('mongodb+srv://rinkuyadav9460_db_user:PJrNGHmujot6YovI@cluster0.wrmtwnk.mongodb.net/', serverSelectionTimeoutMS=5000)
db = client['sevenunique_ai_db']

# 1. Delete dummy business with no name
res = db['businesses'].delete_many({
    'ownerId': '6acf4ec53bfd534e3822c495',
    'name': {'$exists': False},
    'businessName': {'$exists': False}
})
print('Deleted dummy businesses for test user:', res.deleted_count)

# Delete any other orphaned dummy businesses without name/businessName
res_all = db['businesses'].delete_many({
    'name': {'$exists': False},
    'businessName': {'$exists': False}
})
print('Deleted total empty dummy businesses:', res_all.deleted_count)

# 2. Reset FB test user onboardingCompleted to False
u_res = db['users'].update_one(
    {'_id': ObjectId('6acf4ec53bfd534e3822c495')},
    {'$set': {'onboardingCompleted': False, 'onboarding_step': 1}, '$unset': {'onboarding_completed_at': ''}}
)
print('Updated test user:', u_res.modified_count)
