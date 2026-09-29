import os
import re

path = "app/(dashboard)/social-platforms/instagram/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_func = re.compile(r"const handleInstagramLogin = \(\) => \{\s+setIsLoggingIn\(true\);\s+// Redirect to the backend Instagram OAuth endpoint directly\s+// The backend should issue a 302/307 redirect to the Instagram OAuth URL\s+const baseUrl = process\.env\.NEXT_PUBLIC_API_URL \|\| \"http://localhost:8000\";\s+window\.location\.href = `\$\{baseUrl\}/api/instagram/connect`;\s+\};")

new_func = """const handleInstagramLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      const res = await api.get('/api/instagram/connect');
      const authUrl = res.data.authorization_url;
      
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        console.error("Auth URL not found in response:", res.data);
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Failed to fetch Instagram connect URL:", error);
      setIsLoggingIn(false);
    }
  };"""

content = old_func.sub(new_func, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated handleInstagramLogin successfully")
