path = r"C:\Users\dy160\projects\SU_AI_Backend\app\services\social_service.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

import re
old_pattern = r'if not image_url:[\s\S]*?pollinations\.ai[\s\S]*?nologo=true"'
new_pattern = 'if not image_url:\n            image_url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80"'

text = re.sub(old_pattern, new_pattern, text)
with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("Updated image_url fallback!")
