import re

with open(r"C:\Users\dy160\projects\SU_AI_Backend\app\api\endpoints\instagram.py", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.strip().startswith("@router."):
        print(f"Line {i+1}: {line.strip()}")
        for j in range(i+1, min(i+15, len(lines))):
            print(f"  {lines[j]}", end="")
            if lines[j].strip().startswith("def "):
                break
