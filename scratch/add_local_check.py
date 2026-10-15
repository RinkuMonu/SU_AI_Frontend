path = r"C:\Users\dy160\projects\SU_AI_Backend\app\services\instagram_service.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

target = '''        elif not (effective_image_url.startswith("http://") or effective_image_url.startswith("https://")):
            effective_image_url = settings.get_public_url(effective_image_url)

        logger.info(f"Publishing to Instagram {ig_user_id} with image {effective_image_url}")'''

replacement = r'''        elif not (effective_image_url.startswith("http://") or effective_image_url.startswith("https://")):
            effective_image_url = settings.get_public_url(effective_image_url)

        # Check if local /uploads file exists on disk, fallback if missing
        if "/uploads/" in effective_image_url:
            rel_path = effective_image_url.split("/uploads/", 1)[1]
            uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
            local_file = os.path.join(uploads_dir, rel_path.replace("/", os.sep))
            if not os.path.exists(local_file):
                logger.warning(f"Local file {local_file} does not exist! Using fallback image.")
                effective_image_url = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80"

        logger.info(f"Publishing to Instagram {ig_user_id} with image {effective_image_url}")'''

assert target in text, "Target not found!"
text = text.replace(target, replacement)
# Also make sure import os is present
if "import os\n" not in text:
    text = "import os\n" + text

with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("Added local file existence check!")
