path = r"C:\Users\dy160\projects\SU_AI_Backend\app\schemas\auth.py"
with open(path, "r", encoding="utf-8") as f:
    code = f.read()

target = '''class FacebookAuthLoginRequest(BaseModel):
    access_token: Optional[str] = Field(default=None, description="Facebook Access Token from Facebook SDK login")
    code: Optional[str] = Field(default=None, description="OAuth authorization code")
    accountType: Optional[str] = Field(default="business", description="Account type: business or personal")'''

replacement = '''class FacebookAuthLoginRequest(BaseModel):
    access_token: Optional[str] = Field(default=None, description="Facebook Access Token from Facebook SDK login")
    code: Optional[str] = Field(default=None, description="OAuth authorization code")
    accountType: Optional[str] = Field(default="business", description="Account type: business or personal")
    mode: Optional[str] = Field(default="login", description="Auth mode: login or signup")
    redirect_uri: Optional[str] = None


class InstagramAuthLoginRequest(BaseModel):
    access_token: Optional[str] = Field(default=None, description="Instagram User Access Token")
    code: Optional[str] = Field(default=None, description="OAuth authorization code")
    accountType: Optional[str] = Field(default="business", description="Account type: business or personal")
    mode: Optional[str] = Field(default="login", description="Auth mode: login or signup")
    redirect_uri: Optional[str] = None'''

if target in code:
    code = code.replace(target, replacement)
    with open(path, "w", encoding="utf-8") as f:
        f.write(code)
    print("Updated auth.py schema: Added InstagramAuthLoginRequest and mode")
else:
    print("Target not found in auth.py schema")
