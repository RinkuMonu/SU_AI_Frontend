import os

path = "app/(dashboard)/social-platforms/instagram/page.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

import re

old_func = re.compile(r"const handleInstagramLogin = \(\) => \{\s+setIsLoggingIn\(true\);\s+// Redirect to the backend Instagram OAuth endpoint\s+const baseUrl = process\.env\.NEXT_PUBLIC_API_URL \|\| \"http://localhost:8000\";\s+window\.location\.href = `\$\{baseUrl\}/api/instagram/connect`;\s+\};")

new_func = """const handleInstagramLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      const res = await api.get('/api/instagram/connect');
      const authUrl = res.data.auth_url || res.data.url;
      
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

old_effect = re.compile(r"// Clean URL to hide token\s+window\.history\.replaceState\(\{\}, document\.title, window\.location\.pathname\);\s+\}\s+\}")

new_effect = """// Clean URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Send token to the backend API
        if (tokenFromUrl) {
          api.put('/api/v1/businesses/me', {
            ig_account_id: accIdFromUrl || "",
            ig_access_token: tokenFromUrl
          }).then(() => console.log("Token sent to API successfully"))
            .catch(err => console.error("Failed to send token to API", err));
        }
      }
    }"""

content = old_effect.sub(new_effect, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated successfully")
