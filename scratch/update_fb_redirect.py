import re

path = r"C:\Users\dy160\projects\SU_AI_Backend\app\api\endpoints\facebook.py"
with open(path, "r", encoding="utf-8") as f:
    c = f.read()

helper = '''
def build_facebook_redirect(frontend_url: str, query_params: str) -> str:
    url = frontend_url.rstrip("/")
    qs = query_params.lstrip("?&")
    sep = "&" if "?" in url else "?"
    if any(r in url for r in ["/login", "/signup", "/onboarding"]):
        return f"{url}{sep}{qs}"
    if url.endswith("/social-platforms/facebook"):
        return f"{url}{sep}{qs}"
    return f"{url}/social-platforms/facebook?{qs}"
'''

if "def build_facebook_redirect" not in c:
    c = c.replace("def resolve_frontend_url", helper.strip() + "\n\ndef resolve_frontend_url")

# Replace standard redirect lines
c = re.sub(
    r'return RedirectResponse\(f"\{frontend_url\}/social-platforms/facebook\?error=([^"]+)"\)',
    r'return RedirectResponse(build_facebook_redirect(frontend_url, f"error=\1"))',
    c
)

c = c.replace(
    'return RedirectResponse(f"{frontend_url}/social-platforms/facebook?error=missing_code")',
    'return RedirectResponse(build_facebook_redirect(frontend_url, "error=missing_code"))'
)

c = c.replace(
    'return RedirectResponse(f"{frontend_url}/social-platforms/facebook?error=invalid_state")',
    'return RedirectResponse(build_facebook_redirect(frontend_url, "error=invalid_state"))'
)

c = c.replace(
    'url=f"{frontend_url}/social-platforms/facebook?facebook_connected=true&fb_access_token={demo_token}&fb_page_id=100000000000001"',
    'url=build_facebook_redirect(frontend_url, f"facebook_connected=true&fb_access_token={demo_token}&fb_page_id=100000000000001")'
)

c = c.replace(
    'url=f"{frontend_url}/social-platforms/facebook?facebook_connected=true&fb_access_token={effective_token}&user_access_token={access_token}{page_param}{ig_param}{token_param}"',
    'url=build_facebook_redirect(frontend_url, f"facebook_connected=true&fb_access_token={effective_token}&user_access_token={access_token}{page_param}{ig_param}{token_param}")'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(c)

print("Backend facebook.py successfully updated with smart redirect!")
