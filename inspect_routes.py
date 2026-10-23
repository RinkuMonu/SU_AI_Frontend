import os

file_path = "app/(auth)/login/user/page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    orig = f.read()

# Let's inspect imports in orig
print("File length:", len(orig))
