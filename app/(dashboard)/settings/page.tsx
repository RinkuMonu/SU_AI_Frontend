"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Settings as SettingsIcon, 
  Loader2, 
  Check, 
  User as UserIcon, 
  Building2, 
  Mail, 
  Phone, 
  Camera, 
  Upload, 
  Trash2, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { businessService } from "@/services/business.service";
import { userService } from "@/services/user.service";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  // Active tab: 'user' (Personal) or 'business' (Businessman)
  const isDefaultBusiness = user?.role === 'business' || user?.accountType === 'business';
  const [activeTab, setActiveTab] = useState<'user' | 'business'>(isDefaultBusiness ? 'business' : 'user');

  // User details state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Business details state
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [ownerFirstName, setOwnerFirstName] = useState("");
  const [ownerLastName, setOwnerLastName] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);

  // Status & Feedback
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [userUpdated, setUserUpdated] = useState(false);
  const [userError, setUserError] = useState("");

  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false);
  const [isUpdatingBusiness, setIsUpdatingBusiness] = useState(false);
  const [businessUpdated, setBusinessUpdated] = useState(false);
  const [businessError, setBusinessError] = useState("");

  // Security / Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // File Input Refs
  const userPhotoInputRef = useRef<HTMLInputElement>(null);
  const businessLogoInputRef = useRef<HTMLInputElement>(null);

  // Initialize User Fields from Auth Context
  useEffect(() => {
    if (user) {
      const parts = (user.name || "").trim().split(/\s+/);
      const derivedFirst = user.firstName || parts[0] || "";
      const derivedLast = user.lastName || parts.slice(1).join(" ") || "";

      setFirstName(derivedFirst);
      setLastName(derivedLast);
      setEmail(user.email || "");
      setContactNumber(user.contactNumber || user.phone || "");
      setProfileImage(user.image || user.avatar || null);

      if (user.role === 'business' || user.accountType === 'business') {
        setActiveTab('business');
      }

      setOwnerFirstName(derivedFirst);
      setOwnerLastName(derivedLast);
      setBusinessEmail(user.email || "");
      setBusinessPhone(user.contactNumber || user.phone || "");
    }
  }, [user]);

  // Fetch Fresh User Profile from Backend if available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const fresh = await userService.getProfile();
        if (fresh) {
          if (fresh.firstName) setFirstName(fresh.firstName);
          if (fresh.lastName) setLastName(fresh.lastName);
          if (fresh.email) setEmail(fresh.email);
          if (fresh.contactNumber || fresh.phone) setContactNumber(fresh.contactNumber || fresh.phone || "");
          if (fresh.image || (fresh as any).profileImageUrl) {
            setProfileImage(fresh.image || (fresh as any).profileImageUrl);
          }
        }
      } catch (_) {}
    };
    fetchUserProfile();
  }, []);

  // Fetch Business Data from Backend if available
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setIsLoadingBusiness(true);
      try {
        const data = await businessService.getMyBusiness();
        if (data) {
          if (data.id) setBusinessId(data.id);
          if (data.name) setBusinessName(data.name);
          if (data.category) setBusinessCategory(data.category);
          if (data.contact_email) setBusinessEmail(data.contact_email);
          if (data.contact_phone) setBusinessPhone(data.contact_phone);
          if (data.website) setWebsite(data.website);
          if (data.instagram) setInstagram(data.instagram);
          if (data.location) setLocation(data.location);
          if (data.description) setDescription(data.description);
        }
      } catch (err: any) {
        // If not found or fresh user, keep defaults from user state
      } finally {
        setIsLoadingBusiness(false);
      }
    };

    fetchBusinessDetails();
  }, []);

  // Handle User Photo Upload
  const handleUserPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUserError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUserError("Image size should be less than 5MB.");
      return;
    }

    setUserError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfileImage(result);
    };
    reader.readAsDataURL(file);

    try {
      const res = await userService.uploadAvatar(file);
      if (res?.image_url) {
        setProfileImage(res.image_url);
        updateUser({ image: res.image_url });
      }
    } catch (_) {
      // Fallback: will persist data-url on Update Profile
    }
  };

  // Handle Business Logo Upload
  const handleBusinessLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setBusinessError("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setBusinessError("Logo size should be less than 5MB.");
      return;
    }

    setBusinessError("");
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBusinessLogo(result);
    };
    reader.readAsDataURL(file);
  };

  // Remove Photo
  const handleRemoveUserPhoto = () => {
    setProfileImage(null);
    if (userPhotoInputRef.current) userPhotoInputRef.current.value = "";
  };

  const handleRemoveBusinessLogo = () => {
    setBusinessLogo(null);
    if (businessLogoInputRef.current) businessLogoInputRef.current.value = "";
  };

  // Save User Profile
  const handleUpdateUserProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setUserError("");

    if (!firstName.trim()) {
      setUserError("First name is required.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setUserError("Please enter a valid email address.");
      return;
    }

    setIsUpdatingUser(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

      // Persist to backend database
      try {
        await userService.updateProfile({
          name: fullName,
          fullName: fullName,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          contactNumber: contactNumber.trim(),
          phone: contactNumber.trim(),
          image: profileImage || undefined,
          profileImageUrl: profileImage || undefined,
          accountType: 'user',
        });
      } catch (backendErr: any) {
        console.warn("Backend user profile sync:", backendErr?.message);
      }
      
      // Update Auth context and local storage immediately
      updateUser({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        contactNumber: contactNumber.trim(),
        phone: contactNumber.trim(),
        image: profileImage || undefined,
        accountType: 'user',
      });

      setUserUpdated(true);
      setTimeout(() => setUserUpdated(false), 3500);
    } catch (err: any) {
      setUserError(err.message || "Failed to update profile.");
    } finally {
      setIsUpdatingUser(false);
    }
  };

  // Save Business Profile
  const handleUpdateBusinessProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setBusinessError("");

    if (!businessName.trim()) {
      setBusinessError("Business Name is required.");
      return;
    }

    if (!businessCategory.trim()) {
      setBusinessError("Business Category is required.");
      return;
    }

    setIsUpdatingBusiness(true);
    try {
      const payload = {
        name: businessName.trim(),
        category: businessCategory.trim(),
        location: location.trim() || "India",
        website: website.trim() || undefined,
        instagram: instagram.trim() || undefined,
        contact_email: businessEmail.trim() || email.trim() || undefined,
        contact_phone: businessPhone.trim() || contactNumber.trim() || undefined,
        description: description.trim() || undefined,
      };

      if (businessId) {
        await businessService.updateBusiness(payload);
      } else {
        try {
          const created = await businessService.createBusiness({
            ...payload,
            location: payload.location || "India",
          });
          if (created?.id) setBusinessId(created.id);
        } catch (_) {
          // If creation fails because it already exists, try update
          await businessService.updateBusiness(payload);
        }
      }

      // Sync with user auth context
      const ownerFullName = `${ownerFirstName.trim()} ${ownerLastName.trim()}`.trim();
      updateUser({
        name: ownerFullName || businessName.trim(),
        firstName: ownerFirstName.trim(),
        lastName: ownerLastName.trim(),
        email: businessEmail.trim() || user?.email,
        contactNumber: businessPhone.trim() || user?.contactNumber,
        phone: businessPhone.trim() || user?.phone,
        businessName: businessName.trim(),
        businessCategory: businessCategory.trim(),
        role: 'business',
        accountType: 'business',
        image: businessLogo || user?.image,
      });

      setBusinessUpdated(true);
      setTimeout(() => setBusinessUpdated(false), 3500);
    } catch (err: any) {
      setBusinessError(err.message || "Failed to update business details.");
    } finally {
      setIsUpdatingBusiness(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(currentPassword, newPassword, confirmPassword);
      setPasswordChanged(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordChanged(false), 3500);
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password. Please check your current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Avatar initial
  const userInitial = (firstName?.charAt(0) || user?.name?.charAt(0) || "U").toUpperCase();
  const businessInitial = (businessName?.charAt(0) || "B").toUpperCase();

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-purple/15 flex items-center justify-center text-brand-purple border border-brand-purple/30">
            <SettingsIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
            <p className="text-sm text-text-muted mt-0.5">Manage your personal identity, business details, and security.</p>
          </div>
        </div>
      </div>

      {/* Account Type Selector Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 rounded-2xl bg-surface border border-border">
        <div className="flex items-center gap-1.5 p-1 bg-surface-elevated/70 rounded-xl border border-border/50">
          <button
            type="button"
            onClick={() => setActiveTab('user')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'user'
                ? 'bg-brand-gradient text-white shadow-md'
                : 'text-text-muted hover:text-white hover:bg-surface-secondary'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>User Details</span>
            {user?.role !== 'business' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-normal ml-0.5">Current</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'business'
                ? 'bg-brand-gradient text-white shadow-md'
                : 'text-text-muted hover:text-white hover:bg-surface-secondary'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Business Details</span>
            {user?.role === 'business' && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-normal ml-0.5">Current</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 text-xs text-text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Role: <strong className="text-white capitalize">{user?.role || 'User'}</strong></span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: USER DETAILS (First name, Last name, Email, Contact no, Image) */}
      {/* ========================================================= */}
      {activeTab === 'user' && (
        <Card className="bg-surface border-border shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-brand-purple" />
                  Personal Profile Details
                </CardTitle>
                <CardDescription className="text-text-muted mt-1">
                  Update your name, email, contact number, and profile picture.
                </CardDescription>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-purple/10 text-brand-pink border border-brand-purple/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                User Account
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Error Message */}
            {userError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{userError}</span>
              </div>
            )}

            {/* Profile Picture Upload & Preview Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 p-4 rounded-2xl bg-surface-elevated/50 border border-border">
              <input
                type="file"
                ref={userPhotoInputRef}
                onChange={handleUserPhotoChange}
                accept="image/*"
                className="hidden"
                id="user-profile-photo-input"
              />

              <div className="relative group">
                <div className="h-24 w-24 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white/20 overflow-hidden ring-4 ring-brand-purple/20">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="User Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => userPhotoInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-surface-elevated hover:bg-brand-purple text-white shadow-md border border-border group-hover:scale-110 transition-all cursor-pointer"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => userPhotoInputRef.current?.click()}
                    className="border-border text-white hover:bg-brand-purple/20 hover:border-brand-purple/50 gap-2 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-brand-pink" />
                    Change Photo
                  </Button>

                  {profileImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveUserPhoto}
                      className="text-text-muted hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-text-muted">
                  Allowed formats: PNG, JPG, or WebP. Max size: 5MB. Photo will appear in your top profile header.
                </p>
              </div>
            </div>

            {/* Profile Input Fields Form */}
            <form onSubmit={handleUpdateUserProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-brand-purple" />
                    First Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                    className="bg-surface-elevated/70 border-border focus:border-brand-purple"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-brand-purple" />
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="bg-surface-elevated/70 border-border focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="space-y-2">
                  <Label htmlFor="userEmail" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-pink" />
                    Email Address <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="userEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="bg-surface-elevated/70 border-border focus:border-brand-purple"
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Contact Number
                  </Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="bg-surface-elevated/70 border-border focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={isUpdatingUser}
                  className="bg-brand-gradient hover:opacity-95 text-white font-semibold shadow-lg shadow-brand-purple/20 px-6 min-w-[150px]"
                >
                  {isUpdatingUser ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Saving...
                    </>
                  ) : userUpdated ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-white" /> 
                      Profile Updated!
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>

                {userUpdated && (
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" /> Changes saved to account & header!
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ========================================================= */}
      {/* TAB 2: BUSINESS DETAILS (Businessman Profile) */}
      {/* ========================================================= */}
      {activeTab === 'business' && (
        <Card className="bg-surface border-border shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  Business Profile Details
                </CardTitle>
                <CardDescription className="text-text-muted mt-1">
                  Manage your business identity, industry, contact info, and company logo.
                </CardDescription>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Businessman Account
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {/* Error Message */}
            {businessError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{businessError}</span>
              </div>
            )}

            {/* Business Logo Upload & Preview Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 p-4 rounded-2xl bg-surface-elevated/50 border border-border">
              <input
                type="file"
                ref={businessLogoInputRef}
                onChange={handleBusinessLogoChange}
                accept="image/*"
                className="hidden"
                id="business-logo-input"
              />

              <div className="relative group">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-white/20 overflow-hidden ring-4 ring-amber-500/20">
                  {businessLogo ? (
                    <img
                      src={businessLogo}
                      alt="Business Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{businessInitial}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => businessLogoInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-xl bg-surface-elevated hover:bg-amber-500 text-white shadow-md border border-border group-hover:scale-110 transition-all cursor-pointer"
                  title="Upload Business Logo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => businessLogoInputRef.current?.click()}
                    className="border-border text-white hover:bg-amber-500/20 hover:border-amber-500/50 gap-2 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    Change Business Logo
                  </Button>

                  {businessLogo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveBusinessLogo}
                      className="text-text-muted hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </Button>
                  )}
                </div>
                <p className="text-xs text-text-muted">
                  Upload your brand or company emblem. Appears on marketing materials and dashboard.
                </p>
              </div>
            </div>

            {/* Business Input Fields Form */}
            <form onSubmit={handleUpdateBusinessProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Name */}
                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    Business / Company Name <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. SevenUnique Enterprises"
                    required
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>

                {/* Business Category */}
                <div className="space-y-2">
                  <Label htmlFor="businessCategory" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Business Category / Industry <span className="text-rose-400">*</span>
                  </Label>
                  <Input
                    id="businessCategory"
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value)}
                    placeholder="e.g. Retail, Fashion, E-commerce, Restaurant, Technology"
                    required
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Owner First Name */}
                <div className="space-y-2">
                  <Label htmlFor="ownerFirstName" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-brand-purple" />
                    Contact Person First Name
                  </Label>
                  <Input
                    id="ownerFirstName"
                    value={ownerFirstName}
                    onChange={(e) => setOwnerFirstName(e.target.value)}
                    placeholder="First Name"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>

                {/* Owner Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="ownerLastName" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-brand-purple" />
                    Contact Person Last Name
                  </Label>
                  <Input
                    id="ownerLastName"
                    value={ownerLastName}
                    onChange={(e) => setOwnerLastName(e.target.value)}
                    placeholder="Last Name"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Email */}
                <div className="space-y-2">
                  <Label htmlFor="businessEmail" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-brand-pink" />
                    Business Contact Email
                  </Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="contact@mycompany.com"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>

                {/* Business Phone */}
                <div className="space-y-2">
                  <Label htmlFor="businessPhone" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Business Contact / WhatsApp No.
                  </Label>
                  <Input
                    id="businessPhone"
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-sky-400" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />
                    Instagram Handle
                  </Label>
                  <Input
                    id="instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@mybusiness"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-coral" />
                    Location / City
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="bg-surface-elevated/70 border-border focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-300">
                  Business Description / Tagline
                </Label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your business, main products or services offered..."
                  className="w-full rounded-md border border-border bg-surface-elevated/70 p-3 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={isUpdatingBusiness}
                  className="bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-semibold shadow-lg shadow-amber-500/20 px-6 min-w-[170px]"
                >
                  {isUpdatingBusiness ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Saving Business...
                    </>
                  ) : businessUpdated ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-white" /> 
                      Business Details Saved!
                    </>
                  ) : (
                    "Save Business Details"
                  )}
                </Button>

                {businessUpdated && (
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" /> Business profile updated successfully!
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ========================================================= */}
      {/* SECURITY / PASSWORD SETTINGS */}
      {/* ========================================================= */}
      <Card className="bg-surface border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-brand-purple" />
            Security & Password
          </CardTitle>
          <CardDescription className="text-text-muted">
            Update your account password to maintain security.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-xs font-semibold text-slate-300">
                Current Password
              </Label>
              <div className="relative">
                <Input 
                  id="current-password" 
                  type={showCurrentPass ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="bg-surface-elevated/70 border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-xs font-semibold text-slate-300">
                  New Password
                </Label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="bg-surface-elevated/70 border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-xs font-semibold text-slate-300">
                  Confirm New Password
                </Label>
                <Input 
                  id="confirm-new-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="bg-surface-elevated/70 border-border"
                />
              </div>
            </div>

            <div className="pt-1 flex items-center gap-3">
              <Button 
                type="submit"
                variant="outline" 
                disabled={isChangingPassword}
                className="border-border text-white hover:bg-surface-secondary"
              >
                {isChangingPassword ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Changing Password...</>
                ) : passwordChanged ? (
                  <><Check className="mr-2 h-4 w-4 text-emerald-400" /> Password Changed!</>
                ) : (
                  "Change Password"
                )}
              </Button>

              {passwordChanged && (
                <span className="text-xs text-emerald-400 font-medium">
                  Your password has been updated securely.
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
