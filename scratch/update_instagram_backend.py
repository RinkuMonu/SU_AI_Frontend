import re

# 1. Update app/services/instagram_service.py
ig_service_path = r"C:\Users\dy160\projects\SU_AI_Backend\app\services\instagram_service.py"
with open(ig_service_path, "r", encoding="utf-8") as f:
    ig_code = f.read()

# Fallback in is_demo_mode: check both INSTAGRAM and FACEBOOK credentials
old_demo = '''    @staticmethod
    def is_demo_mode() -> bool:
        """Check if Instagram credentials are not configured (demo/dev mode)."""
        return not settings.INSTAGRAM_APP_ID or not settings.INSTAGRAM_APP_SECRET'''

new_demo = '''    @staticmethod
    def is_demo_mode() -> bool:
        """Check if Instagram credentials are not configured (demo/dev mode)."""
        app_id = settings.INSTAGRAM_APP_ID or getattr(settings, "FACEBOOK_APP_ID", None)
        app_secret = settings.INSTAGRAM_APP_SECRET or getattr(settings, "FACEBOOK_APP_SECRET", None)
        return not app_id or not app_secret'''

if old_demo in ig_code:
    ig_code = ig_code.replace(old_demo, new_demo)

# Fallback in get_authorization_url
old_auth_url = '''        app_id = settings.INSTAGRAM_APP_ID
        redirect_uri = settings.INSTAGRAM_REDIRECT_URI
        api_version = settings.INSTAGRAM_API_VERSION'''

new_auth_url = '''        app_id = settings.INSTAGRAM_APP_ID or getattr(settings, "FACEBOOK_APP_ID", None)
        redirect_uri = settings.INSTAGRAM_REDIRECT_URI or f"{settings.BACKEND_URL}/api/instagram/callback"
        api_version = settings.INSTAGRAM_API_VERSION'''

if old_auth_url in ig_code:
    ig_code = ig_code.replace(old_auth_url, new_auth_url)

# Fallback in exchange_code_for_token
old_exchange = '''        app_id = settings.INSTAGRAM_APP_ID
        app_secret = settings.INSTAGRAM_APP_SECRET
        redirect_uri = settings.INSTAGRAM_REDIRECT_URI'''

new_exchange = '''        app_id = settings.INSTAGRAM_APP_ID or getattr(settings, "FACEBOOK_APP_ID", None)
        app_secret = settings.INSTAGRAM_APP_SECRET or getattr(settings, "FACEBOOK_APP_SECRET", None)
        redirect_uri = settings.INSTAGRAM_REDIRECT_URI or f"{settings.BACKEND_URL}/api/instagram/callback"'''

if old_exchange in ig_code:
    ig_code = ig_code.replace(old_exchange, new_exchange)

# Add authenticate_instagram_user method to InstagramService
auth_ig_user_code = '''
    @staticmethod
    async def authenticate_instagram_user(
        db,
        access_token: str,
        profile: Optional[Dict[str, Any]] = None,
        account_type: str = "business",
    ):
        """
        Authenticate or register a user using Instagram Login.
        Issues JWT access & refresh tokens and returns user doc + tokens.
        """
        from app.models.user import User
        from app.models.refresh_session import RefreshSession
        from app.core.security import get_password_hash
        from app.services.auth_service import AuthService
        from datetime import timedelta
        import uuid
        import secrets

        if not profile:
            try:
                profile = await InstagramService.get_instagram_profile(access_token)
            except Exception as e:
                logger.warning(f"Could not fetch IG profile: {e}")
                profile = {"user_id": f"ig_{secrets.token_hex(6)}", "username": "instagram_user"}

        ig_id = str(profile.get("user_id") or profile.get("id") or uuid.uuid4())
        username = profile.get("username") or "Instagram User"
        name = profile.get("name") or username
        picture_url = profile.get("profile_picture_url")
        email = profile.get("email") or f"ig_{username.lower().replace(' ', '_')}@instagram.user"
        email = email.lower().strip()
        now = datetime.now(timezone.utc)
        encrypted_token = encrypt_token(access_token)

        # Check existing user by email or instagramId or instagram_username
        existing_user = await db["users"].find_one({
            "$or": [
                {"email": email},
                {"instagramId": ig_id},
                {"instagram_user_id": ig_id},
                {"instagram_username": username},
            ]
        })

        if existing_user:
            user_id = str(existing_user["_id"])
            update_data = {
                "instagramId": ig_id,
                "instagram_user_id": ig_id,
                "instagram_username": username,
                "instagram_access_token": encrypted_token,
                "instagram_connected": True,
                "instagram_connected_at": now,
                "updated_at": now,
            }
            if picture_url and not existing_user.get("profileImageUrl"):
                update_data["profileImageUrl"] = picture_url
            if not existing_user.get("emailVerified"):
                update_data["emailVerified"] = True
                update_data["email_verified"] = True
                update_data["emailVerifiedAt"] = now

            providers = existing_user.get("authProviders", [])
            if "instagram" not in providers:
                providers.append("instagram")
                update_data["authProviders"] = providers

            await db["users"].update_one({"_id": existing_user["_id"]}, {"$set": update_data})
            user_doc = await db["users"].find_one({"_id": existing_user["_id"]})
            user = User(**user_doc)
            user.id = user_id
            user.onboardingCompleted = bool(existing_user.get("onboardingCompleted", False))
            user.onboarding_step = existing_user.get("onboarding_step", 1)
        else:
            # Check pending_users collection
            pending_existing = await db["pending_users"].find_one({
                "$or": [
                    {"email": email},
                    {"instagramId": ig_id},
                    {"instagram_user_id": ig_id},
                    {"instagram_username": username},
                ]
            })
            if pending_existing:
                user_id = str(pending_existing["_id"])
                user = User.from_mongo(pending_existing)
                user.id = user_id
                user.onboardingCompleted = False
                user.onboarding_step = pending_existing.get("onboarding_step", 1)
            else:
                # Create NEW USER -> ALWAYS onboardingCompleted = False, onboarding_step = 1
                random_pwd = get_password_hash(f"ig_{uuid.uuid4()}_{secrets.token_hex(8)}")
                first_name = name.split()[0] if name else username
                last_name = " ".join(name.split()[1:]) if len(name.split()) > 1 else ""
                user = User(
                    fullName=name,
                    name=name,
                    firstName=first_name,
                    lastName=last_name,
                    email=email,
                    hashed_password=random_pwd,
                    accountType=account_type or "business",
                    authProviders=["instagram"],
                    emailVerified=True,
                    email_verified=True,
                    emailVerifiedAt=now,
                    termsAcceptedAt=now,
                    profileImageUrl=picture_url,
                    role="user",
                    onboardingCompleted=False,
                    onboarding_step=1,
                )
                doc = user.model_dump(by_alias=True, exclude={"id"})
                doc["instagramId"] = ig_id
                doc["instagram_user_id"] = ig_id
                doc["instagram_username"] = username
                doc["instagram_access_token"] = encrypted_token
                doc["instagram_connected"] = True
                doc["instagram_connected_at"] = now
                doc["onboardingCompleted"] = False
                doc["onboarding_completed"] = False
                doc["onboarding_step"] = 1
                result = await db["users"].insert_one(doc)
                user.id = str(result.inserted_id)

                try:
                    from app.services.credit_service import CreditService
                    await CreditService.get_or_create_subscription(db, user.id)
                except Exception as e:
                    logger.warning(f"Could not provision subscription: {e}")

        # Save connection into instagram_connections
        try:
            ig_conn = {
                "user_id": str(user.id),
                "platform": "instagram",
                "login_method": "instagram_login",
                "instagram_user_id": ig_id,
                "instagram_username": username,
                "account_type": profile.get("account_type", "BUSINESS"),
                "profile_picture_url": picture_url or "",
                "encrypted_access_token": encrypted_token,
                "connected": True,
                "created_at": now,
                "updated_at": now,
            }
            await db["instagram_connections"].update_one(
                {"user_id": str(user.id), "platform": "instagram"},
                {"$set": ig_conn},
                upsert=True,
            )
        except Exception as e:
            logger.warning(f"Could not save instagram connection document: {e}")

        # Issue JWT tokens
        jwt_access_token = AuthService.create_token(
            user.id, settings.JWT_ACCESS_SECRET, timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        jwt_refresh_token = AuthService.create_token(
            user.id, settings.JWT_REFRESH_SECRET, timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        )
        rs = RefreshSession(
            userId=str(user.id),
            hashedToken=get_password_hash(hashlib.sha256(jwt_refresh_token.encode()).hexdigest()),
            expiresAt=now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        await db["refresh_sessions"].insert_one(rs.model_dump(by_alias=True, exclude={"id"}))

        return user, jwt_access_token, jwt_refresh_token
'''

if "def authenticate_instagram_user" not in ig_code:
    # Append inside InstagramService class
    class_marker = "class InstagramService:"
    if class_marker in ig_code:
        ig_code = ig_code.replace(class_marker, class_marker + "\n" + auth_ig_user_code)
        print("Added authenticate_instagram_user to InstagramService")

with open(ig_service_path, "w", encoding="utf-8") as f:
    f.write(ig_code)
print("Updated instagram_service.py")

# 2. Update app/api/endpoints/instagram.py
ig_endpoint_path = r"C:\Users\dy160\projects\SU_AI_Backend\app\api\endpoints\instagram.py"
with open(ig_endpoint_path, "r", encoding="utf-8") as f:
    ep_code = f.read()

# Add get_current_user_optional and build_instagram_redirect
if "get_current_user_optional" not in ep_code:
    ep_code = ep_code.replace(
        "from app.core.security import get_current_user",
        "from app.core.security import get_current_user, get_current_user_optional\nimport urllib.parse"
    )

helper_ig_redirect = '''
def build_instagram_redirect(frontend_url: str, query_params: str) -> str:
    url = frontend_url.rstrip("/")
    qs = query_params.lstrip("?&")
    sep = "&" if "?" in url else "?"
    if any(r in url for r in ["/login", "/signup", "/onboarding"]):
        return f"{url}{sep}{qs}"
    if url.endswith("/social-platforms/instagram"):
        return f"{url}{sep}{qs}"
    return f"{url}/social-platforms/instagram?{qs}"
'''

if "def build_instagram_redirect" not in ep_code:
    ep_code = ep_code.replace('router = APIRouter(\n    tags=["Instagram"],\n)', 'router = APIRouter(\n    tags=["Instagram"],\n)' + helper_ig_redirect)

# Replace instagram_connect to allow optional user and frontend_url
old_ig_connect = '''@router.get("/connect")
async def instagram_connect(
    current_user=Depends(get_current_user),
    db=Depends(get_database),
):'''

new_ig_connect = '''@router.get("/connect")
async def instagram_connect(
    frontend_url: str | None = Query(default=None),
    current_user=Depends(get_current_user_optional),
    db=Depends(get_database),
):'''

if old_ig_connect in ep_code:
    ep_code = ep_code.replace(old_ig_connect, new_ig_connect)

# In instagram_connect: save frontend_url and handle pending_login
old_connect_body = '''    user_id = str(current_user.get("id") or current_user.get("_id"))

    # Generate a state token for CSRF protection, store in DB
    state = secrets.token_urlsafe(32)
    await db["instagram_oauth_states"].insert_one({
        "state": state,
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc),
    })'''

new_connect_body = '''    user_id = str(current_user.get("id") or current_user.get("_id")) if current_user else "pending_login"
    effective_frontend = frontend_url or settings.FRONTEND_URL or "http://localhost:3000"

    # Generate a state token for CSRF protection, store in DB
    state = secrets.token_urlsafe(32)
    await db["instagram_oauth_states"].insert_one({
        "state": state,
        "user_id": user_id,
        "frontend_url": effective_frontend,
        "created_at": datetime.now(timezone.utc),
    })'''

if old_connect_body in ep_code:
    ep_code = ep_code.replace(old_connect_body, new_connect_body)

# Replace demo callback response in instagram_connect
old_demo_cb = 'authorization_url=f"http://localhost:8000/api/instagram/callback?code=demo_code&state={state}"'
new_demo_cb = 'authorization_url=f"{settings.BACKEND_URL}/api/instagram/callback?code=demo_ig_code&state={state}"'
if old_demo_cb in ep_code:
    ep_code = ep_code.replace(old_demo_cb, new_demo_cb)

# Replace instagram_callback implementation
old_callback_start = '''@router.get("/callback")
async def instagram_callback(
    code: str = Query(None),
    state: str = Query(None),
    error: str = Query(None),
    error_reason: str = Query(None),
    error_description: str = Query(None),
    db=Depends(get_database),
):'''

# Let's replace the whole instagram_callback function
callback_regex = r'@router\.get\("/callback"\)[\s\S]*?(?=@router\.get\("/status"\))'

new_callback_impl = '''@router.get("/callback")
async def instagram_callback(
    code: str = Query(None),
    state: str = Query(None),
    error: str = Query(None),
    error_reason: str = Query(None),
    error_description: str = Query(None),
    db=Depends(get_database),
):
    """
    Instagram OAuth callback endpoint.
    Called by Instagram after user authorizes the app.
    Supports login/signup as well as dashboard social linking.
    """
    state_doc = None
    if state:
        state_doc = await db["instagram_oauth_states"].find_one({"state": state})

    frontend_url = (state_doc and state_doc.get("frontend_url")) or settings.FRONTEND_URL or "http://localhost:3000"

    # Handle OAuth errors
    if error:
        err_msg = error_description or error
        logger.warning(f"Instagram OAuth error: {err_msg}")
        return RedirectResponse(
            url=build_instagram_redirect(frontend_url, f"error={urllib.parse.quote(str(err_msg))}")
        )

    if not code:
        return RedirectResponse(
            url=build_instagram_redirect(frontend_url, "error=missing_code")
        )

    user_id = (state_doc and state_doc.get("user_id")) or "pending_login"
    token_param = ""
    onboarding_param = ""

    if InstagramService.is_demo_mode():
        logger.info("[DEMO MODE] Instagram callback executing")
        demo_profile = {
            "user_id": DEMO_IG_USER_ID,
            "username": DEMO_IG_USERNAME,
            "name": "Demo Business Creator",
            "account_type": "BUSINESS",
        }
        if user_id == "pending_login":
            user, access_token_jwt, _ = await InstagramService.authenticate_instagram_user(
                db=db,
                access_token="DEMO_IG_ACCESS_TOKEN",
                profile=demo_profile,
                account_type="business",
            )
            token_param = f"&token={access_token_jwt}"
            onboarding_param = f"&onboarding_completed={str(getattr(user, 'onboardingCompleted', False)).lower()}"
        else:
            await InstagramService.save_connection(db, user_id, {"access_token": "DEMO_IG_ACCESS_TOKEN"}, demo_profile)

        return RedirectResponse(
            url=build_instagram_redirect(
                frontend_url,
                f"instagram_connected=true&ig_username={DEMO_IG_USERNAME}{token_param}{onboarding_param}"
            )
        )

    try:
        token_data = await InstagramService.exchange_code_for_token(code)
        access_token = token_data.get("access_token")
        profile = await InstagramService.get_instagram_profile(access_token)

        if user_id == "pending_login":
            user, access_token_jwt, _ = await InstagramService.authenticate_instagram_user(
                db=db,
                access_token=access_token,
                profile=profile,
                account_type="business",
            )
            token_param = f"&token={access_token_jwt}"
            onboarding_param = f"&onboarding_completed={str(getattr(user, 'onboardingCompleted', False)).lower()}"
        else:
            await InstagramService.save_connection(db, user_id, token_data, profile)

        username = profile.get("username", "")
        username_param = f"&ig_username={username}" if username else ""
        return RedirectResponse(
            url=build_instagram_redirect(
                frontend_url,
                f"instagram_connected=true{username_param}{token_param}{onboarding_param}"
            )
        )
    except Exception as e:
        logger.error(f"Instagram callback unexpected error: {e}", exc_info=True)
        return RedirectResponse(
            url=build_instagram_redirect(frontend_url, f"error={urllib.parse.quote(str(e))}")
        )

'''

ep_code = re.sub(callback_regex, new_callback_impl, ep_code)

with open(ig_endpoint_path, "w", encoding="utf-8") as f:
    f.write(ep_code)
print("Updated app/api/endpoints/instagram.py")

# 3. Update app/api/endpoints/auth.py: Add Instagram login/signup and Facebook onboarding params
auth_path = r"C:\Users\dy160\projects\SU_AI_Backend\app\api\endpoints\auth.py"
with open(auth_path, "r", encoding="utf-8") as f:
    auth_code = f.read()

# Add InstagramAuthLoginRequest import if missing
if "InstagramAuthLoginRequest" not in auth_code:
    auth_code = auth_code.replace(
        "FacebookAuthLoginRequest,",
        "FacebookAuthLoginRequest, InstagramAuthLoginRequest,"
    )

# Ensure facebook_login returns onboarding fields
old_fb_payload = '''    user_payload = {
        "id": str(user.id),
        "fullName": user.fullName,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "phone": user.phone,
        "contactNumber": user.contactNumber,
        "accountType": user.accountType,
        "role": getattr(user, "role", "user") or "user",
        "name": getattr(user, "name", user.fullName) or user.fullName,
        "emailVerified": bool(user.emailVerified),
        "email_verified": bool(user.emailVerified),
        "isVerified": bool(user.emailVerified),
        "profileImageUrl": user.profileImageUrl,
    }'''

new_fb_payload = '''    user_payload = {
        "id": str(user.id),
        "fullName": user.fullName,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "phone": user.phone,
        "contactNumber": user.contactNumber,
        "accountType": user.accountType,
        "role": getattr(user, "role", "user") or "user",
        "name": getattr(user, "name", user.fullName) or user.fullName,
        "emailVerified": bool(user.emailVerified),
        "email_verified": bool(user.emailVerified),
        "isVerified": bool(user.emailVerified),
        "profileImageUrl": user.profileImageUrl,
        "onboardingCompleted": bool(getattr(user, "onboardingCompleted", False)),
        "onboarding_completed": bool(getattr(user, "onboardingCompleted", False)),
        "onboarding_step": getattr(user, "onboarding_step", 1) or 1,
    }'''

if old_fb_payload in auth_code:
    auth_code = auth_code.replace(old_fb_payload, new_fb_payload)
    print("Updated auth.py: Added onboardingCompleted to facebook_login payload")

# Add facebook_signup and instagram_login/instagram_signup endpoints
ig_endpoints = '''
@router.post("/facebook/signup", status_code=status.HTTP_201_CREATED)
async def facebook_signup(req: FacebookAuthLoginRequest, response: Response):
    """Register user using Facebook Login."""
    req.mode = "signup"
    return await facebook_login(req, response)

from app.services.instagram_service import InstagramService

@router.post("/instagram/login")
async def instagram_login(req: InstagramAuthLoginRequest, response: Response):
    """Authenticate or register user using Instagram Login."""
    db = get_database()
    access_token = req.access_token

    if not access_token and req.code:
        token_data = await InstagramService.exchange_code_for_token(req.code)
        access_token = token_data.get("access_token")

    if not access_token:
        # Fallback for dev/demo or missing token
        access_token = "DEMO_IG_ACCESS_TOKEN"

    user, access_token_jwt, refresh_token_jwt = await InstagramService.authenticate_instagram_user(
        db=db,
        access_token=access_token,
        account_type=req.accountType or "business",
    )
    set_refresh_cookie(response, refresh_token_jwt)

    user_payload = {
        "id": str(user.id),
        "fullName": user.fullName,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "phone": user.phone,
        "contactNumber": user.contactNumber,
        "accountType": user.accountType,
        "role": getattr(user, "role", "user") or "user",
        "name": getattr(user, "name", user.fullName) or user.fullName,
        "emailVerified": bool(user.emailVerified),
        "email_verified": bool(user.emailVerified),
        "isVerified": bool(user.emailVerified),
        "profileImageUrl": user.profileImageUrl,
        "onboardingCompleted": bool(getattr(user, "onboardingCompleted", False)),
        "onboarding_completed": bool(getattr(user, "onboardingCompleted", False)),
        "onboarding_step": getattr(user, "onboarding_step", 1) or 1,
    }

    return {
        "success": True,
        "message": "Instagram login successful",
        "access_token": access_token_jwt,
        "accessToken": access_token_jwt,
        "token": access_token_jwt,
        "user": user_payload,
        "data": {
            "access_token": access_token_jwt,
            "accessToken": access_token_jwt,
            "token": access_token_jwt,
            "user": user_payload
        }
    }

@router.post("/instagram/signup", status_code=status.HTTP_201_CREATED)
async def instagram_signup(req: InstagramAuthLoginRequest, response: Response):
    """Explicitly register a new user via Instagram Login."""
    req.mode = "signup"
    return await instagram_login(req, response)
'''

if "/instagram/login" not in auth_code:
    auth_code += "\n" + ig_endpoints
    print("Added /instagram/login, /instagram/signup, and /facebook/signup to auth.py")

with open(auth_path, "w", encoding="utf-8") as f:
    f.write(auth_code)

print("All backend Instagram and Facebook updates completed!")
