"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  User as UserIcon, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Store, 
  Briefcase, 
  Tag, 
  Globe, 
  Calendar, 
  Palette, 
  Upload, 
  ShieldCheck, 
  Layers, 
  Loader2,
  Users,
  Target,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/components/auth/AuthProvider";
import { userService } from "@/services/user.service";
import { businessService } from "@/services/business.service";
import { OnboardingService } from "@/services/onboarding.service";
import { authService } from "@/services/auth.service";
import influencerService from "@/services/influencer.service";

type AccountType = "user" | "business" | "influencer";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  // Selection: "user" | "business" | "influencer"
  const [accountType, setAccountType] = useState<AccountType>("user");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Influencer Profile Form State
  const [influencerProfile, setInfluencerProfile] = useState({
    fullName: "",
    username: "",
    category: "Fashion",
    bio: "",
    city: "",
    state: "",
    location: "",
    phone: "",
    preferredLanguage: "hinglish",
    instagram_url: "",
    youtube_url: "",
    follower_count: 50000,
    engagement_rate: 4.8,
    expectedPricePerPost: 5000,
  });

  // User Profile Form State
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredLanguage: "hinglish",
    profileImageUrl: "",
    primaryGoal: "content_creation",
    interests: ["Instagram Reels", "AI Photoshoots"],
    platforms: ["instagram", "youtube", "whatsapp"],
  });

  // Business Profile Form State (matching MongoDB document fields)
  const [businessProfile, setBusinessProfile] = useState({
    business_name: "",
    business_type: "Retail Store",
    business_category: "clothing",
    business_description: "",
    business_logo: "",
    brand_color: "#be32ff",
    registration_number: "",
    year_established: new Date().getFullYear().toString(),
    country: "India",
    state: "",
    city: "",
    area: "",
    pincode: "",
    full_address: "",
    google_maps_url: "",
    business_model: "B2C",
    selling_model: "Retail Store",
    target_age_group: ["18-24", "25-34"],
    target_gender: "All",
    target_location: "Local City",
    customer_type: "Mass Market",
    phone: "",
    preferredLanguage: "hinglish",
  });

  // Initialize fields with pending signup or logged-in user's details
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const pendingRole = sessionStorage.getItem("signup_role");
        if (pendingRole === "influencer") {
          setAccountType("influencer");
        }

        const pendingStr = sessionStorage.getItem("pending_signup");
        if (pendingStr) {
          const pending = JSON.parse(pendingStr);
          if (pending) {
            setUserProfile((prev) => ({
              ...prev,
              fullName: pending.fullName || prev.fullName,
              firstName: pending.firstName || prev.firstName,
              lastName: pending.lastName || prev.lastName,
              email: pending.email || prev.email,
              phone: pending.phone || pending.contactNumber || prev.phone,
            }));
            setBusinessProfile((prev) => ({
              ...prev,
              phone: pending.phone || pending.contactNumber || prev.phone,
              business_name: pending.firstName ? `${pending.firstName}'s Brand` : prev.business_name,
            }));
            setInfluencerProfile((prev) => ({
              ...prev,
              fullName: pending.fullName || pending.name || prev.fullName,
              username: pending.email ? pending.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") : prev.username,
              phone: pending.phone || pending.contactNumber || prev.phone,
            }));
            return;
          }
        }

        // Check if user has already completed onboarding via /api/v1/onboarding/status
        const token = localStorage.getItem("access_token");
        if (token) {
          OnboardingService.isCompleted(token).then((done) => {
            if (done) {
              const cached = localStorage.getItem("user");
              const uObj = cached ? JSON.parse(cached) : null;
              if (uObj?.role === "influencer" || uObj?.accountType === "influencer") {
                router.replace("/influencer");
              } else {
                router.replace("/dashboard");
              }
            }
          }).catch(() => {});
        }

        const stored = localStorage.getItem("user");
        const u = stored ? JSON.parse(stored) : user;
        if (u) {
          if (u.onboardingCompleted === true || u.onboarding_completed === true) {
            if (u.role === "influencer" || u.accountType === "influencer") {
              router.replace("/influencer");
            } else {
              router.replace("/dashboard");
            }
            return;
          }
          const first = u.firstName || (u.name ? u.name.split(" ")[0] : "");
          const last = u.lastName || (u.name && u.name.split(" ").length > 1 ? u.name.split(" ").slice(1).join(" ") : "");
          const full = u.fullName || u.name || `${first} ${last}`.trim();

          setUserProfile((prev) => ({
            ...prev,
            fullName: full || prev.fullName,
            firstName: first || prev.firstName,
            lastName: last || prev.lastName,
            email: u.email || prev.email,
            phone: u.contactNumber || u.phone || prev.phone,
            preferredLanguage: u.preferredLanguage || prev.preferredLanguage,
            profileImageUrl: u.profileImageUrl || prev.profileImageUrl,
          }));

          setBusinessProfile((prev) => ({
            ...prev,
            business_name: u.business_name || (first ? `${first}'s Brand` : prev.business_name),
            business_type: u.business_type || prev.business_type,
            business_category: u.business_category || prev.business_category,
            phone: u.contactNumber || u.phone || prev.phone,
            preferredLanguage: u.preferredLanguage || prev.preferredLanguage,
            city: u.city || prev.city,
            state: u.state || prev.state,
          }));

          setInfluencerProfile((prev) => ({
            ...prev,
            fullName: full || prev.fullName,
            username: u.username || (u.email ? u.email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_") : prev.username),
            phone: u.contactNumber || u.phone || prev.phone,
            preferredLanguage: u.preferredLanguage || prev.preferredLanguage,
            city: u.city || prev.city,
            state: u.state || prev.state,
          }));

          if (pendingRole === "influencer" || u.accountType === "influencer" || u.role === "influencer") {
            setAccountType("influencer");
          } else if (u.accountType === "business" || u.role === "business") {
            setAccountType("business");
          } else if (u.accountType === "user") {
            setAccountType("user");
          }
        }
      } catch (err) {
        console.error("Failed to parse stored user in onboarding:", err);
      }
    }
  }, [user]);

  // Handle Logo file upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setLogoPreview(dataUrl);
        setBusinessProfile((prev) => ({ ...prev, business_logo: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Define steps dynamically based on selected AccountType
  const userSteps = [
    { id: "account_type", title: "Account Type", desc: "Select role" },
    { id: "personal_profile", title: "Profile", desc: "Your details" },
    { id: "goals", title: "Goals", desc: "Usage preferences" },
    { id: "ready", title: "Ready", desc: "Start exploring" },
  ];

  const influencerSteps = [
    { id: "account_type", title: "Account Type", desc: "Select role" },
    { id: "creator_profile", title: "Creator Profile", desc: "Niche & media kit" },
    { id: "social_reach", title: "Social Reach", desc: "Platforms & rates" },
    { id: "ready", title: "Ready", desc: "Start collaborating" },
  ];

  const businessSteps = [
    { id: "account_type", title: "Account Type", desc: "Select role" },
    { id: "identity", title: "Business Identity", desc: "Name & category" },
    { id: "registration", title: "Registration", desc: "Contact & legal" },
    { id: "location", title: "Location", desc: "Address details" },
    { id: "audience", title: "Target Audience", desc: "Market & customers" },
    { id: "ready", title: "Ready", desc: "Launch AI engine" },
  ];

  const activeSteps = 
    accountType === "business" 
      ? businessSteps 
      : accountType === "influencer" 
        ? influencerSteps 
        : userSteps;
  const isLastStep = currentStep === activeSteps.length - 1;

  // Validation before advancing to next step
  const validateCurrentStep = () => {
    setError("");
    if (accountType === "user") {
      if (currentStep === 1) {
        if (!userProfile.fullName.trim()) {
          setError("Please enter your full name.");
          return false;
        }
      }
    } else if (accountType === "influencer") {
      if (currentStep === 1) {
        if (!influencerProfile.fullName.trim()) {
          setError("Please enter your Creator / Display Name.");
          return false;
        }
        if (!influencerProfile.category) {
          setError("Please select your primary niche / category.");
          return false;
        }
      } else if (currentStep === 2) {
        if (!influencerProfile.instagram_url.trim() && !influencerProfile.youtube_url.trim()) {
          setError("Please provide at least one social media link or handle (Instagram or YouTube).");
          return false;
        }
      }
    } else {
      if (currentStep === 1) {
        if (!businessProfile.business_name.trim()) {
          setError("Business Name is required.");
          return false;
        }
        if (!businessProfile.business_category) {
          setError("Please select a business category.");
          return false;
        }
      } else if (currentStep === 3) {
        if (!businessProfile.city.trim()) {
          setError("City is required for localized AI marketing.");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;

    if (currentStep < activeSteps.length - 2) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === activeSteps.length - 2) {
      // Final submission step
      await submitOnboarding();
    } else {
      // Already on ready screen -> Go to Dashboard or Creator Hub
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          u.onboardingCompleted = true;
          if (accountType === "influencer") {
            u.role = "influencer";
            u.accountType = "influencer";
          }
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch (_) {}
      if (accountType === "influencer") {
        router.push("/influencer");
      } else {
        router.push("/dashboard");
      }
    }
  };

  const handleBack = () => {
    setError("");
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit onboarding payload to backend APIs
  const submitOnboarding = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const pendingStr = typeof window !== "undefined" ? sessionStorage.getItem("pending_signup") : null;
      const pending = pendingStr ? JSON.parse(pendingStr) : null;

      if (accountType === "user") {
        // ─── USER ONBOARDING: Send ONLY user profile fields ───
        // Business fields are intentionally NOT sent so they remain null in DB
        const userPayload = {
          accountType: "user",
          role: "user",
          fullName: userProfile.fullName.trim(),
          name: userProfile.fullName.trim(),
          firstName: userProfile.firstName.trim() || userProfile.fullName.split(" ")[0],
          lastName: userProfile.lastName.trim() || userProfile.fullName.split(" ").slice(1).join(" "),
          phone: userProfile.phone.trim() || null,
          contactNumber: userProfile.phone.trim() || null,
          contact_phone: userProfile.phone.trim() || null,
          preferredLanguage: userProfile.preferredLanguage,
          profileImageUrl: userProfile.profileImageUrl || null,
          onboardingCompleted: true,
          onboarding_step: 3,
        };

        if (pending) {
          // Deferred MongoDB account creation: user was not in MongoDB until now!
          const signupPayload = {
            ...userPayload,
            name: userProfile.fullName.trim() || pending.name || pending.fullName,
            fullName: userProfile.fullName.trim() || pending.fullName || pending.name,
            firstName: userProfile.firstName.trim() || pending.firstName || userProfile.fullName.split(" ")[0],
            lastName: userProfile.lastName.trim() || pending.lastName || "",
            email: pending.email,
            password: pending.password,
            confirmPassword: pending.confirmPassword || pending.password,
            phone: userProfile.phone.trim() || pending.phone || pending.contactNumber || null,
            contactNumber: userProfile.phone.trim() || pending.contactNumber || pending.phone || null,
            otp: pending.otp,
            accountType: "user",
          };
          const res = await authService.signup(signupPayload);
          if (res.token && res.user) {
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            login(res.token, res.user);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe(userPayload);
          } catch (_) {}
        } else {
          // Existing session (e.g. Google OAuth user)
          await userService.updateMe(userPayload);
        }

        // Update Onboarding Progress API
        try {
          await OnboardingService.updateProgress({
            onboarding_step: 3,
            social_connection_completed: true,
            business_profile_completed: true,
            completed: true,
            onboarding_completed: true,
            onboardingCompleted: true,
            is_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          });
        } catch (_) {}

        // Advance to Ready step
        setCurrentStep(activeSteps.length - 1);
      } else if (accountType === "influencer") {
        // ─── INFLUENCER / CREATOR ONBOARDING ───
        const influencerPayload = {
          accountType: "influencer",
          role: "influencer",
          fullName: influencerProfile.fullName.trim() || userProfile.fullName.trim(),
          name: influencerProfile.fullName.trim() || userProfile.fullName.trim(),
          username: (influencerProfile.username.trim() || (influencerProfile.fullName.trim() || "creator").toLowerCase().replace(/\s+/g, "_")).replace(/^@/, ""),
          bio: influencerProfile.bio.trim() || undefined,
          category: influencerProfile.category,
          niche: influencerProfile.category,
          city: influencerProfile.city.trim() || undefined,
          state: influencerProfile.state.trim() || undefined,
          location: influencerProfile.location.trim() || (influencerProfile.city ? `${influencerProfile.city}, ${influencerProfile.state}`.replace(/^,\s*|,\s*$/g, "") : "India"),
          phone: influencerProfile.phone.trim() || userProfile.phone.trim() || null,
          contactNumber: influencerProfile.phone.trim() || userProfile.phone.trim() || null,
          contact_phone: influencerProfile.phone.trim() || userProfile.phone.trim() || null,
          preferredLanguage: influencerProfile.preferredLanguage || "hinglish",
          instagram_url: influencerProfile.instagram_url.trim() || undefined,
          youtube_url: influencerProfile.youtube_url.trim() || undefined,
          follower_count: Number(influencerProfile.follower_count) || 50000,
          engagement_rate: Number(influencerProfile.engagement_rate) || 4.8,
          expectedPricePerPost: Number(influencerProfile.expectedPricePerPost) || 5000,
          onboardingCompleted: true,
          onboarding_step: 3,
        };

        if (pending) {
          const signupPayload = {
            ...influencerPayload,
            name: influencerPayload.name,
            fullName: influencerPayload.fullName,
            firstName: influencerPayload.name.split(" ")[0] || pending.firstName,
            lastName: influencerPayload.name.split(" ").slice(1).join(" ") || pending.lastName || "",
            email: pending.email,
            password: pending.password,
            confirmPassword: pending.confirmPassword || pending.password,
            phone: influencerPayload.phone || pending.phone || pending.contactNumber || null,
            contactNumber: influencerPayload.contactNumber || pending.contactNumber || pending.phone || null,
            otp: pending.otp,
            accountType: "influencer",
            role: "influencer",
          };
          const res = await authService.signup(signupPayload);
          if (res.token && res.user) {
            const finalInfUser = { ...res.user, role: "influencer", accountType: "influencer" };
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("user", JSON.stringify(finalInfUser));
            login(res.token, finalInfUser);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe(influencerPayload);
          } catch (_) {}
        } else {
          await userService.updateMe(influencerPayload);
        }

        // Update Influencer Profile in /api/v1/influencers/me
        try {
          await influencerService.updateMyProfile({
            fullName: influencerPayload.fullName,
            username: influencerPayload.username,
            bio: influencerPayload.bio,
            category: influencerPayload.category,
            location: influencerPayload.location,
            phone: influencerPayload.phone || undefined,
            instagram_url: influencerPayload.instagram_url,
            youtube_url: influencerPayload.youtube_url,
            follower_count: influencerPayload.follower_count,
            engagement_rate: influencerPayload.engagement_rate,
            expectedPricePerPost: influencerPayload.expectedPricePerPost,
            preferredLanguage: influencerPayload.preferredLanguage,
          });
        } catch (infErr) {
          console.warn("Influencer profile update warning:", infErr);
        }

        // Update Onboarding Progress API
        try {
          await OnboardingService.updateProgress({
            onboarding_step: 3,
            completed: true,
            onboarding_completed: true,
            onboardingCompleted: true,
            is_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          });
        } catch (_) {}

        // Advance to Ready step
        setCurrentStep(activeSteps.length - 1);
      } else {
        // ─── BUSINESS ONBOARDING: Send ALL business fields from DB schema ───
        const businessPayload = {
          accountType: "business",
          role: "business",
          business_name: businessProfile.business_name.trim(),
          business_type: businessProfile.business_type,
          business_category: businessProfile.business_category,
          business_description: businessProfile.business_description.trim() || null,
          business_logo: businessProfile.business_logo || null,
          brand_color: businessProfile.brand_color || null,
          registration_number: businessProfile.registration_number.trim() || null,
          year_established: businessProfile.year_established.trim() || null,
          country: businessProfile.country || "India",
          state: businessProfile.state.trim() || null,
          city: businessProfile.city.trim() || null,
          area: businessProfile.area.trim() || null,
          pincode: businessProfile.pincode.trim() || null,
          full_address: businessProfile.full_address.trim() || null,
          google_maps_url: businessProfile.google_maps_url.trim() || null,
          business_model: businessProfile.business_model || null,
          selling_model: businessProfile.selling_model || null,
          target_age_group: businessProfile.target_age_group || [],
          target_gender: businessProfile.target_gender || "All",
          target_location: businessProfile.target_location || null,
          customer_type: businessProfile.customer_type || null,
          phone: businessProfile.phone.trim() || null,
          contactNumber: businessProfile.phone.trim() || null,
          contact_phone: businessProfile.phone.trim() || null,
          preferredLanguage: businessProfile.preferredLanguage || "hinglish",
          onboardingCompleted: true,
          onboarding_step: 2,
        };

        if (pending) {
          // Deferred MongoDB account creation with all business data:
          const signupPayload = {
            name: businessProfile.business_name.trim(),
            fullName: pending.fullName || businessProfile.business_name.trim(),
            firstName: pending.firstName || businessProfile.business_name.split(" ")[0],
            lastName: pending.lastName || "",
            email: pending.email,
            password: pending.password,
            confirmPassword: pending.confirmPassword || pending.password,
            phone: businessProfile.phone.trim() || pending.phone || pending.contactNumber || null,
            contactNumber: businessProfile.phone.trim() || pending.contactNumber || pending.phone || null,
            otp: pending.otp,
            accountType: "business",
          };
          const res = await authService.signup(signupPayload);
          if (res.token && res.user) {
            localStorage.setItem("access_token", res.token);
            localStorage.setItem("user", JSON.stringify(res.user));
            login(res.token, res.user);
          }
          sessionStorage.removeItem("pending_signup");
          try {
            await userService.updateMe({
              ...businessPayload,
              onboardingData: businessPayload,
            });
          } catch (_) {}
        } else {
          // Existing session (e.g. Google OAuth user)
          await userService.updateMe({
            ...businessPayload,
            onboardingData: businessPayload,
          });
        }

        // Create/Update record in Business Collection
        try {
          await businessService.createBusiness({
            businessName: businessProfile.business_name.trim(),
            name: businessProfile.business_name.trim(),
            businessType: businessProfile.business_type,
            category: businessProfile.business_category,
            industry: businessProfile.business_category,
            location: `${businessProfile.city}, ${businessProfile.state}`.replace(/^,\s*|,\s*$/g, "") || "India",
            description: businessProfile.business_description || undefined,
            contact_phone: businessProfile.phone || undefined,
            preferred_language: businessProfile.preferredLanguage || "hinglish",
            preferredLanguage: businessProfile.preferredLanguage || "hinglish",
            targetAudience: businessProfile.target_location || "Local",
          });
        } catch (_) {
          try {
            await businessService.updateBusiness({
              name: businessProfile.business_name.trim(),
              category: businessProfile.business_category,
              location: `${businessProfile.city}, ${businessProfile.state}`.replace(/^,\s*|,\s*$/g, "") || "India",
              description: businessProfile.business_description || undefined,
              contact_phone: businessProfile.phone || undefined,
            });
          } catch (_) {}
        }

        // Update Onboarding Progress API
        try {
          await OnboardingService.updateProgress({
            onboarding_step: 5,
            business_profile_completed: true,
            completed: true,
            onboarding_completed: true,
            onboardingCompleted: true,
            is_completed: true,
            onboarding_completed_at: new Date().toISOString(),
          });
        } catch (_) {}

        // Advance to Ready step
        setCurrentStep(activeSteps.length - 1);
      }
    } catch (err: any) {
      console.error("Onboarding submission failed:", err);
      setError(err.message || "Failed to save profile. Please check the information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle interest pill
  const toggleInterest = (item: string) => {
    setUserProfile((prev) => {
      const exists = prev.interests.includes(item);
      return {
        ...prev,
        interests: exists ? prev.interests.filter((i) => i !== item) : [...prev.interests, item],
      };
    });
  };

  // Toggle target age group pill
  const toggleAgeGroup = (age: string) => {
    setBusinessProfile((prev) => {
      const exists = prev.target_age_group.includes(age);
      return {
        ...prev,
        target_age_group: exists
          ? prev.target_age_group.filter((a) => a !== age)
          : [...prev.target_age_group, age],
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-[#ededf2] flex flex-col justify-between py-8 px-4 sm:px-6 relative overflow-hidden selection:bg-[#be32ff]/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto mb-8 flex items-center justify-between z-10 relative">
        <Link href="/" className="inline-flex items-center group">
          <img
            src="/images/dhandagrow.png"
            alt="DhandaGrow AI"
            className="h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="text-xs text-neutral-400 font-medium flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Step {currentStep + 1} of {activeSteps.length}</span>
        </div>
      </header>

      {/* Stepper Progress Bar */}
      <div className="w-full max-w-4xl mx-auto mb-8 z-10 relative">
        <div className="flex items-center justify-between relative px-2">
          {/* Background rail */}
          <div className="absolute left-6 right-6 top-4 h-0.5 bg-white/10 -z-0" />
          {/* Active progress track */}
          <div
            className="absolute left-6 top-4 h-0.5 bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] transition-all duration-500 -z-0"
            style={{
              width: `${(currentStep / (activeSteps.length - 1)) * 90}%`,
            }}
          />

          {activeSteps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={() => {
                    if (idx < currentStep) setCurrentStep(idx);
                  }}
                  disabled={idx > currentStep}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-r from-[#fc9a5d] to-[#f0449b] text-white shadow-[0_0_15px_rgba(240,68,155,0.4)] cursor-pointer"
                      : isCurrent
                      ? "bg-[#181a24] border-2 border-[#be32ff] text-white shadow-[0_0_20px_rgba(190,50,255,0.6)] scale-110"
                      : "bg-[#12131b] border border-white/10 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : idx + 1}
                </button>
                <div className="text-center hidden sm:block">
                  <p className={`text-xs font-semibold leading-tight ${isCurrent ? "text-white" : isCompleted ? "text-neutral-300" : "text-neutral-500"}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-light">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form Container Card */}
      <Card className="w-full max-w-5xl mx-auto bg-[#14151f]/90 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(190,50,255,0.1)] backdrop-blur-xl rounded-2xl relative z-10 overflow-hidden">
        <CardContent className="p-6 sm:p-10">

          {/* ══════════════════════════════════════════════════════════════════════
              STEP 0: ROLE / ACCOUNT TYPE SELECTION (User vs Businessman vs Influencer)
          ══════════════════════════════════════════════════════════════════════ */}
          {currentStep === 0 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#fc9a5d]/10 via-[#f0449b]/10 to-[#be32ff]/10 border border-[#f0449b]/30 text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] to-[#be32ff]">
                  <Sparkles className="w-3.5 h-3.5 text-[#f0449b]" /> Tailored Experience
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  How will you be using DhandaGrow AI?
                </h1>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto">
                  Select whether you are an individual user, a business owner, or a creator/influencer. We will customize your onboarding stepper and features accordingly.
                </p>
              </div>

              {/* 3 Interactive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {/* 1. Individual User Card */}
                <div
                  onClick={() => setAccountType("user")}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                    accountType === "user"
                      ? "bg-gradient-to-b from-[#1e1c2e] to-[#141522] border-[#be32ff] shadow-[0_0_30px_rgba(190,50,255,0.25)] ring-1 ring-[#be32ff]/50"
                      : "bg-[#101118] border-white/10 hover:border-white/20 hover:bg-[#161722]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        accountType === "user"
                          ? "bg-gradient-to-br from-[#fc9a5d] to-[#be32ff] text-white shadow-lg"
                          : "bg-white/5 text-neutral-400 group-hover:text-white"
                      }`}>
                        <UserIcon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Individual
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-colors">
                        Individual User
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                        For personal creators and individuals who want to explore AI tools, create video reels, and generate content without business details.
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-neutral-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>AI Video Reel Generation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Social Media Posts &amp; Captions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>No business details required</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
                    <span className={accountType === "user" ? "text-[#be32ff]" : "text-neutral-400"}>
                      {accountType === "user" ? "Selected" : "Select Option"}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      accountType === "user" ? "border-[#be32ff] bg-[#be32ff]" : "border-white/20"
                    }`}>
                      {accountType === "user" && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* 2. Businessman / Business Card */}
                <div
                  onClick={() => setAccountType("business")}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                    accountType === "business"
                      ? "bg-gradient-to-b from-[#251828] to-[#141522] border-[#f0449b] shadow-[0_0_30px_rgba(240,68,155,0.25)] ring-1 ring-[#f0449b]/50"
                      : "bg-[#101118] border-white/10 hover:border-white/20 hover:bg-[#161722]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        accountType === "business"
                          ? "bg-gradient-to-br from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-lg"
                          : "bg-white/5 text-neutral-400 group-hover:text-white"
                      }`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f0449b]/20 text-[#f0449b] border border-[#f0449b]/30">
                        Merchant
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-pink-200 transition-colors">
                        Business / Brand
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                        For shop owners, companies, and brands looking to automate marketing, hire top influencers, run multi-channel ads, and boost sales.
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-neutral-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Business Identity &amp; Brand Kit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Local Area &amp; Demographics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>AI Ad Generator &amp; Multi-Channel</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
                    <span className={accountType === "business" ? "text-[#f0449b]" : "text-neutral-400"}>
                      {accountType === "business" ? "Selected" : "Select Option"}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      accountType === "business" ? "border-[#f0449b] bg-[#f0449b]" : "border-white/20"
                    }`}>
                      {accountType === "business" && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>

                {/* 3. Creator & Influencer Card */}
                <div
                  onClick={() => setAccountType("influencer")}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                    accountType === "influencer"
                      ? "bg-gradient-to-b from-[#221730] to-[#141522] border-[#7d36fa] shadow-[0_0_30px_rgba(125,54,250,0.25)] ring-1 ring-[#7d36fa]/50"
                      : "bg-[#101118] border-white/10 hover:border-white/20 hover:bg-[#161722]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        accountType === "influencer"
                          ? "bg-gradient-to-br from-[#be32ff] via-[#7d36fa] to-[#fc9a5d] text-white shadow-lg"
                          : "bg-white/5 text-neutral-400 group-hover:text-white"
                      }`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#be32ff]/20 text-[#be32ff] border border-[#be32ff]/30">
                        Influencer
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-200 transition-colors">
                        Creator / Influencer
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed font-light">
                        For content creators and social media influencers looking to showcase their media kit, get hired by top brands, and earn via secured escrow.
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-neutral-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Direct Brand Deals &amp; Paid Collabs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Media Kit &amp; Social Reach</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Digital Contracts &amp; Escrow Payouts</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
                    <span className={accountType === "influencer" ? "text-[#7d36fa]" : "text-neutral-400"}>
                      {accountType === "influencer" ? "Selected" : "Select Option"}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      accountType === "influencer" ? "border-[#7d36fa] bg-[#7d36fa]" : "border-white/20"
                    }`}>
                      {accountType === "influencer" && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              BRANCH A: USER STEPPER (accountType === 'user')
          ══════════════════════════════════════════════════════════════════════ */}
          {accountType === "user" && currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Your Personal Profile</h2>
                <p className="text-xs text-neutral-400">Tell us a bit about yourself to personalize your creative suite.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="userFullName" className="text-xs font-medium text-neutral-300">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="userFullName"
                      placeholder="e.g. Deepak Yadav"
                      value={userProfile.fullName}
                      onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="userPhone" className="text-xs font-medium text-neutral-300">Contact Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="userPhone"
                      placeholder="e.g. +91 98765 43210"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="userLanguage" className="text-xs font-medium text-neutral-300">Preferred Language</Label>
                  <select
                    id="userLanguage"
                    value={userProfile.preferredLanguage}
                    onChange={(e) => setUserProfile({ ...userProfile, preferredLanguage: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  >
                    <option value="hinglish">Hinglish (Hindi + English)</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="marathi">Marathi</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="bengali">Bengali</option>
                    <option value="tamil">Tamil</option>
                    <option value="telugu">Telugu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {accountType === "user" && currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">What would you like to create?</h2>
                <p className="text-xs text-neutral-400">Select what interests you most to curate AI tools on your dashboard.</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-medium text-neutral-300">Creative Interests</Label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Instagram Reels",
                    "AI Photoshoots",
                    "Viral Scripts",
                    "Posters & Banners",
                    "Captions & Copywriting",
                    "Fashion AI Modeling",
                    "Festival Greeting Posts",
                    "Personal Portfolio",
                  ].map((item) => {
                    const isSelected = userProfile.interests.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-[#fc9a5d]/20 to-[#be32ff]/20 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.25)]"
                            : "bg-[#0f1015] border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 inline mr-1 text-[#be32ff]" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-xs font-medium text-neutral-300">Primary Platforms</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "instagram", name: "Instagram" },
                    { id: "youtube", name: "YouTube" },
                    { id: "facebook", name: "Facebook" },
                    { id: "whatsapp", name: "WhatsApp" },
                  ].map((p) => {
                    const isSelected = userProfile.platforms.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setUserProfile((prev) => ({
                            ...prev,
                            platforms: isSelected
                              ? prev.platforms.filter((x) => x !== p.id)
                              : [...prev.platforms, p.id],
                          }));
                        }}
                        className={`p-3 rounded-xl border text-center text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-600/15 border-purple-500/50 text-white"
                            : "bg-[#0f1015] border-white/10 text-neutral-400 hover:text-white"
                        }`}
                      >
                        {p.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {accountType === "user" && currentStep === 3 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-400 py-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#fc9a5d]/20 via-[#f0449b]/20 to-[#be32ff]/30 rounded-2xl border border-[#be32ff]/40 flex items-center justify-center mx-auto text-[#be32ff] shadow-[0_0_30px_rgba(190,50,255,0.4)]">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white">
                  Welcome aboard, {userProfile.fullName || "Creator"}!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Your personal creator workspace is ready. Explore high-converting reels, generative photoshoot tools, and automated content creation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Account Role</span>
                  <span className="text-white font-medium capitalize">Individual User</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Language</span>
                  <span className="text-white font-medium capitalize">{userProfile.preferredLanguage}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Selected Interests</span>
                  <span className="text-white font-medium">{userProfile.interests.length} topics selected</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              BRANCH B: BUSINESS STEPPER (accountType === 'business')
              Matches exact DB schema:
              business_name, business_type, business_category, business_description,
              business_logo, brand_color, registration_number, year_established,
              country, state, city, area, pincode, full_address, google_maps_url,
              business_model, selling_model, target_age_group, target_gender,
              target_location, customer_type.
          ══════════════════════════════════════════════════════════════════════ */}
          {accountType === "business" && currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Business Identity &amp; Branding</h2>
                <p className="text-xs text-neutral-400">Configure your business name, industry type, and visual brand identity.</p>
              </div>

              <div className="space-y-4">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="b_name" className="text-xs font-medium text-neutral-300">
                    Business Name <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_name"
                      placeholder="e.g. Sharma Fashion"
                      value={businessProfile.business_name}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_name: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                {/* Business Type & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="b_type" className="text-xs font-medium text-neutral-300">
                      Business Type <span className="text-red-400">*</span>
                    </Label>
                    <select
                      id="b_type"
                      value={businessProfile.business_type}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_type: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Retail Store">Retail Store / Physical Shop</option>
                      <option value="E-Commerce">E-Commerce / Online Brand</option>
                      <option value="Restaurant">Restaurant / Cafe / Food</option>
                      <option value="Service Provider">Service Provider / Freelance</option>
                      <option value="Manufacturing">Manufacturer / Producer</option>
                      <option value="Healthcare">Doctor / Clinic / Hospital</option>
                      <option value="Salon & Beauty">Salon / Spa / Wellness</option>
                      <option value="Real Estate">Real Estate / Construction</option>
                      <option value="Wholesale">Wholesale &amp; Distribution</option>
                      <option value="Other">Other Business</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="b_category" className="text-xs font-medium text-neutral-300">
                      Category <span className="text-red-400">*</span>
                    </Label>
                    <select
                      id="b_category"
                      value={businessProfile.business_category}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_category: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="clothing">Clothing / Fashion &amp; Apparel</option>
                      <option value="restaurant">Restaurant &amp; Food Services</option>
                      <option value="jewellery">Jewellery &amp; Luxury Accessories</option>
                      <option value="salon">Salon, Beauty &amp; Personal Care</option>
                      <option value="real_estate">Real Estate &amp; Housing</option>
                      <option value="doctor">Healthcare, Doctor &amp; Clinic</option>
                      <option value="gym">Gym &amp; Fitness</option>
                      <option value="electronics">Electronics &amp; Appliances</option>
                      <option value="fmcg">Grocery &amp; FMCG</option>
                      <option value="other">Other Local Business</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="b_desc" className="text-xs font-medium text-neutral-300">Business Description</Label>
                  <textarea
                    id="b_desc"
                    rows={2}
                    placeholder="Short description of your products or services (e.g. Trendy ethnic wear for modern women)..."
                    value={businessProfile.business_description}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, business_description: e.target.value })}
                    className="flex w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  />
                </div>

                {/* Logo & Brand Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Business Logo</Label>
                    <div className="flex items-center gap-3">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-12 h-12 rounded-xl object-contain border border-white/20 bg-white/5" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-neutral-500 bg-white/5">
                          <Upload className="w-5 h-5" />
                        </div>
                      )}
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-medium text-white transition-colors">
                        <span>Upload Logo</span>
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-neutral-300">Brand Color Accent</Label>
                    <div className="flex items-center gap-2">
                      {["#be32ff", "#f0449b", "#fc9a5d", "#3b82f6", "#10b981", "#eab308"].map((c) => (
                        <button
                          type="button"
                          key={c}
                          onClick={() => setBusinessProfile({ ...businessProfile, brand_color: c })}
                          className={`w-7 h-7 rounded-lg transition-transform ${
                            businessProfile.brand_color === c ? "scale-125 ring-2 ring-white shadow-md" : "opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Registration &amp; Contact Info</h2>
                <p className="text-xs text-neutral-400">Add optional official registration details and direct contact numbers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b_reg" className="text-xs font-medium text-neutral-300">GSTIN / Registration Number (Optional)</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_reg"
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      value={businessProfile.registration_number}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, registration_number: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_year" className="text-xs font-medium text-neutral-300">Year Established</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_year"
                      type="number"
                      placeholder="e.g. 2021"
                      value={businessProfile.year_established}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, year_established: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_phone" className="text-xs font-medium text-neutral-300">Official Business Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_phone"
                      placeholder="e.g. +91 98765 43210"
                      value={businessProfile.phone}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, phone: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_lang" className="text-xs font-medium text-neutral-300">Preferred Marketing Language</Label>
                  <select
                    id="b_lang"
                    value={businessProfile.preferredLanguage}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, preferredLanguage: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  >
                    <option value="hinglish">Hinglish (Recommended for Indian Retail)</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                    <option value="marathi">Marathi</option>
                    <option value="gujarati">Gujarati</option>
                    <option value="punjabi">Punjabi</option>
                    <option value="tamil">Tamil</option>
                    <option value="bengali">Bengali</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Business Location &amp; Address</h2>
                <p className="text-xs text-neutral-400">Enables city-specific ad targeting and local festival promotions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="b_city" className="text-xs font-medium text-neutral-300">
                    City <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_city"
                      placeholder="e.g. Mumbai, Jaipur, Bengaluru"
                      value={businessProfile.city}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, city: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_state" className="text-xs font-medium text-neutral-300">State</Label>
                  <Input
                    id="b_state"
                    placeholder="e.g. Maharashtra, Rajasthan, Karnataka"
                    value={businessProfile.state}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, state: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_area" className="text-xs font-medium text-neutral-300">Area / Market Name</Label>
                  <Input
                    id="b_area"
                    placeholder="e.g. Andheri West, MI Road, Sector 18"
                    value={businessProfile.area}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, area: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b_pincode" className="text-xs font-medium text-neutral-300">Pincode</Label>
                  <Input
                    id="b_pincode"
                    placeholder="e.g. 400053"
                    value={businessProfile.pincode}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, pincode: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="b_full_addr" className="text-xs font-medium text-neutral-300">Full Address</Label>
                  <Input
                    id="b_full_addr"
                    placeholder="Shop/Office number, building name, street..."
                    value={businessProfile.full_address}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, full_address: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="b_gmaps" className="text-xs font-medium text-neutral-300">Google Maps Link (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="b_gmaps"
                      placeholder="https://maps.app.goo.gl/..."
                      value={businessProfile.google_maps_url}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, google_maps_url: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Target Audience &amp; Selling Model</h2>
                <p className="text-xs text-neutral-400">Our AI uses this demographic data to craft high-converting ad copy and reel scripts.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="b_model" className="text-xs font-medium text-neutral-300">Business Model</Label>
                    <select
                      id="b_model"
                      value={businessProfile.business_model}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, business_model: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="B2C">B2C (Business to Consumer)</option>
                      <option value="B2B">B2B (Business to Business)</option>
                      <option value="D2C">D2C (Direct to Consumer)</option>
                      <option value="B2B2C">B2B2C (Hybrid Partnership)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="s_model" className="text-xs font-medium text-neutral-300">Selling Channel</Label>
                    <select
                      id="s_model"
                      value={businessProfile.selling_model}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, selling_model: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Retail Store">Physical Retail Store / Walk-ins</option>
                      <option value="Online E-Commerce">Online E-Commerce Store</option>
                      <option value="Hybrid Store">Hybrid (Store + Online/WhatsApp)</option>
                      <option value="Wholesale">Wholesale &amp; Bulk Orders</option>
                    </select>
                  </div>
                </div>

                {/* Target Age Group Multi-Select Pills */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs font-medium text-neutral-300">Target Age Groups</Label>
                  <div className="flex flex-wrap gap-2">
                    {["18-24", "25-34", "35-44", "45-54", "55+"].map((age) => {
                      const isSelected = businessProfile.target_age_group.includes(age);
                      return (
                        <button
                          type="button"
                          key={age}
                          onClick={() => toggleAgeGroup(age)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-pink-600/20 border-pink-500 text-white shadow-sm"
                              : "bg-[#0f1015] border-white/10 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 inline mr-1 text-pink-400" />}
                          {age} yrs
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="t_gender" className="text-xs font-medium text-neutral-300">Target Gender</Label>
                    <select
                      id="t_gender"
                      value={businessProfile.target_gender}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, target_gender: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="All">All Genders</option>
                      <option value="Female">Women / Female Focus</option>
                      <option value="Male">Men / Male Focus</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="t_loc" className="text-xs font-medium text-neutral-300">Target Reach</Label>
                    <select
                      id="t_loc"
                      value={businessProfile.target_location}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, target_location: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Local City">Local City / Neighborhood</option>
                      <option value="State-wide">State-wide Reach</option>
                      <option value="Pan India">Pan India Delivery</option>
                      <option value="Global">Global / International</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c_type" className="text-xs font-medium text-neutral-300">Customer Segment</Label>
                    <select
                      id="c_type"
                      value={businessProfile.customer_type}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, customer_type: e.target.value })}
                      className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                    >
                      <option value="Mass Market">Mass Market</option>
                      <option value="Value for Money">Value for Money</option>
                      <option value="Premium / Luxury">Premium / Luxury</option>
                      <option value="B2B Clients">B2B Clients</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "business" && currentStep === 5 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-400 py-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white shadow-2xl transition-all"
                style={{
                  background: `linear-gradient(135deg, ${businessProfile.brand_color || "#be32ff"}, #f0449b)`,
                  boxShadow: `0 0 35px ${businessProfile.brand_color || "#be32ff"}55`,
                }}
              >
                <Store className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white">
                  {businessProfile.business_name || "Your Business"} is Ready!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  We have mapped your business category, target location, and demographic preferences into our AI Marketing &amp; Ad Engine.
                </p>
              </div>

              {/* Summary of Business Identity */}
              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Business Name</span>
                  <span className="text-white font-semibold">{businessProfile.business_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Type &amp; Category</span>
                  <span className="text-white font-medium capitalize">{businessProfile.business_type} • {businessProfile.business_category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Location</span>
                  <span className="text-white font-medium">{businessProfile.city ? `${businessProfile.city}, ${businessProfile.state}` : "India"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Target Audience</span>
                  <span className="text-white font-medium">{businessProfile.target_gender} • {businessProfile.target_location}</span>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════════
              BRANCH C: INFLUENCER / CREATOR STEPPER (accountType === 'influencer')
          ══════════════════════════════════════════════════════════════════════ */}
          {accountType === "influencer" && currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Creator Identity &amp; Niche</h2>
                <p className="text-xs text-neutral-400">Set up your creator display name, primary content category, and bio for brands to discover.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infFullName" className="text-xs font-medium text-neutral-300">Creator / Display Name *</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infFullName"
                      placeholder="e.g. Rohit Verma"
                      value={influencerProfile.fullName}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, fullName: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infUsername" className="text-xs font-medium text-neutral-300">Creator Handle / Username</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-500 font-bold">@</span>
                    <Input
                      id="infUsername"
                      placeholder="rohit_fashion_vibe"
                      value={influencerProfile.username}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, username: e.target.value.replace(/^@/, "") })}
                      className="pl-9 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infCategory" className="text-xs font-medium text-neutral-300">Primary Content Niche *</Label>
                  <select
                    id="infCategory"
                    value={influencerProfile.category}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, category: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-white/10 bg-[#0f1015] px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#be32ff]"
                  >
                    <option value="Fashion">Fashion &amp; Apparel</option>
                    <option value="Technology">Technology &amp; Gadgets</option>
                    <option value="Food &amp; Travel">Food &amp; Travel</option>
                    <option value="Fitness &amp; Health">Fitness &amp; Health</option>
                    <option value="Beauty &amp; Lifestyle">Beauty &amp; Lifestyle</option>
                    <option value="Gaming">Gaming &amp; Esports</option>
                    <option value="Entertainment">Entertainment &amp; Comedy</option>
                    <option value="Business &amp; Finance">Business &amp; Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infBio" className="text-xs font-medium text-neutral-300">Creator Bio / Profile Summary</Label>
                  <textarea
                    id="infBio"
                    rows={3}
                    placeholder="Briefly describe your content niche, audience vibe, and brand collaboration style..."
                    value={influencerProfile.bio}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, bio: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0f1015] p-3 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#be32ff]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infCity" className="text-xs font-medium text-neutral-300">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infCity"
                      placeholder="e.g. Mumbai"
                      value={influencerProfile.city}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, city: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infState" className="text-xs font-medium text-neutral-300">State / Region</Label>
                  <Input
                    id="infState"
                    placeholder="e.g. Maharashtra"
                    value={influencerProfile.state}
                    onChange={(e) => setInfluencerProfile({ ...influencerProfile, state: e.target.value })}
                    className="h-11 bg-[#0f1015] border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {accountType === "influencer" && currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white">Social Channels &amp; Commercials</h2>
                <p className="text-xs text-neutral-400">Add your social channels and base commercial rate per deliverable.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infInstagram" className="text-xs font-medium text-neutral-300">Instagram Profile Link or Handle *</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                    <Input
                      id="infInstagram"
                      placeholder="https://instagram.com/yourhandle"
                      value={influencerProfile.instagram_url}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, instagram_url: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infYoutube" className="text-xs font-medium text-neutral-300">YouTube Channel URL (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                    <Input
                      id="infYoutube"
                      placeholder="https://youtube.com/@channel"
                      value={influencerProfile.youtube_url}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, youtube_url: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infFollowers" className="text-xs font-medium text-neutral-300">Total Followers / Audience</Label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infFollowers"
                      type="number"
                      placeholder="50000"
                      value={influencerProfile.follower_count}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, follower_count: Number(e.target.value) })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="infPrice" className="text-xs font-medium text-neutral-300">Expected Rate per Reel (₹ INR)</Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400 font-bold">₹</span>
                    <Input
                      id="infPrice"
                      type="number"
                      placeholder="5000"
                      value={influencerProfile.expectedPricePerPost}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, expectedPricePerPost: Number(e.target.value) })}
                      className="pl-9 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="infPhone" className="text-xs font-medium text-neutral-300">Contact Number (For Private Brand Inquiries)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <Input
                      id="infPhone"
                      placeholder="+91 98765 43210"
                      value={influencerProfile.phone}
                      onChange={(e) => setInfluencerProfile({ ...influencerProfile, phone: e.target.value })}
                      className="pl-10 h-11 bg-[#0f1015] border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {accountType === "influencer" && currentStep === 3 && (
            <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-400 py-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-[#fc9a5d]/20 via-[#be32ff]/20 to-[#7d36fa]/30 rounded-2xl border border-[#be32ff]/40 flex items-center justify-center mx-auto text-[#be32ff] shadow-[0_0_30px_rgba(190,50,255,0.4)]">
                <Sparkles className="w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-white">
                  Welcome aboard, {influencerProfile.fullName || "Creator"}!
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Your Creator Profile and Media Kit are now live! Brands can discover your profile, send bilateral digital agreements, and fund escrow-secured campaigns.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0f1015] border border-white/10 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Account Type</span>
                  <span className="text-white font-medium capitalize">Creator &amp; Influencer</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Primary Niche</span>
                  <span className="text-white font-medium capitalize">{influencerProfile.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Location</span>
                  <span className="text-white font-medium">{influencerProfile.city ? `${influencerProfile.city}, ${influencerProfile.state}` : "India"}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Starting Reel Rate</span>
                  <span className="text-[#fc9a5d] font-bold">₹{Number(influencerProfile.expectedPricePerPost).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error notice */}
          {error && (
            <div className="mt-6 p-3.5 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 animate-in fade-in">
              <span className="font-semibold text-red-400">Error:</span> {error}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className={`h-11 px-4 rounded-xl border-white/10 bg-[#0f1015] text-neutral-300 hover:text-white hover:bg-white/5 text-xs font-semibold ${
                currentStep === 0 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:to-[#7d36fa] text-white font-bold text-xs tracking-wide shadow-[0_4px_25px_rgba(240,68,155,0.35)] hover:shadow-[0_6px_30px_rgba(190,50,255,0.5)] transition-all cursor-pointer min-w-[140px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Setup...
                </span>
              ) : isLastStep ? (
                <span className="flex items-center gap-1.5">
                  {accountType === "influencer" ? "Go to Creator Dashboard" : "Go to Dashboard"} <ArrowRight className="w-4 h-4" />
                </span>
              ) : currentStep === activeSteps.length - 2 ? (
                <span className="flex items-center gap-1.5">
                  Complete Setup <Sparkles className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto mt-6 text-center text-xs text-neutral-500 z-10 relative">
        &copy; {new Date().getFullYear()} DhandaGrow AI. Tailored for creators and Indian enterprises.
      </footer>
    </div>
  );
}
