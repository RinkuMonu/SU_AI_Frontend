path = r"C:\Users\dy160\projects\SU_AI_Backend\app\api\endpoints\onboarding.py"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

target = '''    # 1. Check business profile
    business = await BusinessService.get_business_by_owner(uid)
    business_completed = business is not None'''

replacement = '''    # 1. Check business profile
    business = await BusinessService.get_business_by_owner(uid)
    business_completed = False
    if business:
        name = getattr(business, "businessName", None) or getattr(business, "name", None) or ""
        name = str(name).strip()
        if name and name != "My Business":
            business_completed = True'''

if target in code:
    code = code.replace(target, replacement)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated onboarding.py: business_completed check refined")
else:
    print("Target not found in onboarding.py")
