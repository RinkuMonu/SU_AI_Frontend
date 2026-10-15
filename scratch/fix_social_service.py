path = r"C:\Users\dy160\projects\SU_AI_Backend\app\services\social_service.py"
with open(path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if "return await InstagramService.publish_image(" in line:
        new_lines.append(line)
        new_lines.append("            db=db,\n")
        new_lines.append("            user_id=effective_user_id,\n")
        new_lines.append("            image_url=image_url,\n")
        new_lines.append("            caption=full_caption,\n")
        new_lines.append("            content_id=content_id,\n")
        new_lines.append("        )\n")
        skip = True
    elif skip:
        if "@staticmethod" in line:
            skip = False
            new_lines.append("\n    " + line.strip() + "\n")
    else:
        new_lines.append(line)

with open(path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Cleaned up social_service.py!")
