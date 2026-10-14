"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Check, X, Store, Users, Landmark, Download, Upload, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { DoneAnimation } from "@/components/ui/DoneAnimation";

const signupSchema = z.object({
  business_logo: z.string().optional(),
  brand_color: z.string().optional(),
  business_name: z.string().min(2, { message: "Business Name is required" }),
  business_type: z.string().min(1, { message: "Business Type is required" }),
  business_category: z.string().optional(),
  business_description: z.string().optional(),
  registration_number: z.string().optional(),
  year_established: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  area: z.string().optional(),
  pincode: z.string().optional(),
  full_address: z.string().optional(),
  google_maps_url: z.string().optional(),
  business_model: z.string().optional(),
  selling_model: z.string().optional(),
  target_age_group: z.array(z.string()).optional(),
  target_gender: z.string().optional(),
  target_location: z.string().optional(),
  customer_type: z.string().optional(),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredBusinessName, setRegisteredBusinessName] = useState("");
  const [isRegisteredSuccess, setIsRegisteredSuccess] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("signup_prefill");
        if (stored) {
          const data = JSON.parse(stored);
          if (data.email) setValue("email", data.email);
          if (data.password) setValue("password", data.password);
          if (data.confirmPassword) setValue("confirmPassword", data.confirmPassword);
          if (data.business_name) setValue("business_name", data.business_name);
        }
      } catch (_) {}
    }
  }, [setValue]);

  const watchedBusinessName = watch("business_name", "");
  const watchedBusinessType = watch("business_type", "");
  const watchedTargetGender = watch("target_gender", "");
  const watchedCustomerType = watch("customer_type", "");
  const watchedTargetLocation = watch("target_location", "");
  const watchedTargetAgeGroup = watch("target_age_group", []);
  const watchedEmail = watch("email", "");
  const watchedPassword = watch("password", "");
  const watchedConfirmPassword = watch("confirmPassword", "");



  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState("");
  const [logoColor, setLogoColor] = useState("#000000");

  const handleGenerateLogo = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!logoPrompt) return;
    setIsGeneratingLogo(true);
    try {
      const colorText = logoColor ? `using a ${logoColor} color scheme` : "";
      const fullPrompt = `${logoPrompt} ${colorText} professional business logo minimalist`;
      const seed = Math.floor(Math.random() * 1000000);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=512&height=512&nologo=true&seed=${seed}`;
      setLogoPreview(url);
      // Automatically advance to Step 2 (Business Detail)
      setTimeout(() => {
        scrollToSection("section-business");
      }, 500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        // Automatically advance to Step 2 (Business Detail)
        setTimeout(() => {
          scrollToSection("section-business");
        }, 400);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const payload = {
        ...data,
        business_logo: logoPreview || undefined,
        brand_color: logoColor || undefined,
        name: data.business_name,
        role: "business"
      };
      const response = await authService.signup(payload);
      if (response && response.token && response.user) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("business_just_registered", "1");
        login(response.token, response.user);
      }
      setRegisteredBusinessName(data.business_name);
      setIsRegisteredSuccess(true);
      setShowSuccessModal(true);
    } catch (err: any) {
      // In case of error but user was created or testing, show error
      setError(err.message || "Failed to register business. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step Completion Status
  const isLogoDone = Boolean(logoPreview);
  const isBusinessDone = Boolean(watchedBusinessName?.trim() && watchedBusinessType);
  const isAudienceDone = Boolean(
    watchedTargetGender ||
    watchedCustomerType ||
    watchedTargetLocation ||
    (Array.isArray(watchedTargetAgeGroup) && watchedTargetAgeGroup.length > 0)
  );
  const isAccountDone = Boolean(
    watchedEmail &&
    watchedEmail.includes("@") &&
    watchedPassword &&
    watchedConfirmPassword &&
    watchedPassword === watchedConfirmPassword
  );

  const steps = [
    {
      id: "section-logo",
      stepNum: 1,
      title: "Business Logo",
      subtitle: "Logo & Brand",
      isDone: isLogoDone,
    },
    {
      id: "section-business",
      stepNum: 2,
      title: "Business Detail",
      subtitle: "Name & Type",
      isDone: isBusinessDone,
    },
    {
      id: "section-audience",
      stepNum: 3,
      title: "Target Audience",
      subtitle: "Demographics",
      isDone: isAudienceDone,
    },
    {
      id: "section-account",
      stepNum: 4,
      title: "Account Details",
      subtitle: "Email & Pass",
      isDone: isAccountDone,
    },
    {
      id: "section-submit",
      stepNum: 5,
      title: "Submit",
      subtitle: "Register Now",
      isDone: isRegisteredSuccess,
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0f14] text-[#ededf2] flex flex-col justify-between p-4 py-10 relative overflow-hidden selection:bg-[#be32ff]/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[32rem] h-[32rem] bg-pink-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] bg-blue-600/[0.02] rounded-full blur-[200px] pointer-events-none" />

      <div className="w-full max-w-3xl mx-auto space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <Link href="/" className="inline-flex items-center mb-1 group">
            <img
              src="/images/dhandagrow.png"
              alt="DhandaGrow AI"
              className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#fc9a5d]/10 via-[#f0449b]/10 to-[#be32ff]/10 border border-[#f0449b]/25 text-[11px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] to-[#be32ff] uppercase tracking-wider">
            Enterprise Onboarding
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Business Profile &amp; Details
          </h1>
          <p className="text-sm text-neutral-400 max-w-lg">
            Set up your brand identity, AI assets, target demographics, and enterprise credentials
          </p>
        </div>

        {/* Interactive Progress Stepper */}
        <div className="bg-[#12131b]/90 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => {
              const isLast = idx === steps.length - 1;
              const isCurrent = !step.isDone && (idx === 0 || steps[idx - 1].isDone);

              return (
                <div key={step.id} className="flex-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => scrollToSection(step.id)}
                    className="flex flex-col sm:flex-row items-center sm:gap-3 cursor-pointer group text-center sm:text-left focus:outline-none"
                  >
                    {/* Circle Indicator */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 shadow-md shrink-0 ${
                        step.isDone
                          ? "bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] text-white shadow-[0_0_15px_rgba(240,68,155,0.45)] scale-105"
                          : isCurrent
                          ? "border-2 border-[#f0449b] text-[#f0449b] bg-[#f0449b]/15 shadow-[0_0_10px_rgba(240,68,155,0.3)] animate-pulse"
                          : "border border-white/20 bg-[#0F172A] text-neutral-400 group-hover:border-white/40 group-hover:text-white"
                      }`}
                    >
                      {step.isDone ? (
                        <Check className="w-5 h-5 text-white stroke-[3] animate-in zoom-in-75 duration-200" />
                      ) : (
                        <span>{step.stepNum}</span>
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="mt-1 sm:mt-0">
                      <div
                        className={`text-xs sm:text-sm font-semibold transition-colors ${
                          step.isDone
                            ? "text-white"
                            : isCurrent
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] to-[#f0449b]"
                            : "text-neutral-400 group-hover:text-neutral-200"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="hidden md:block text-[11px] text-neutral-400">
                        {step.isDone ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> Done
                          </span>
                        ) : (
                          step.subtitle
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Connecting Line between steps */}
                  {!isLast && (
                    <div className="flex-1 mx-2 sm:mx-4 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          step.isDone
                            ? "w-full bg-gradient-to-r from-[#f0449b] to-[#be32ff]"
                            : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">

                {/* Business Logo Card */}
                <div id="section-logo" className="border border-border/50 bg-[#0B1120] rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm scroll-mt-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Business Logo</h3>
                  
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden bg-black/40 relative shrink-0">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-xs text-text-muted text-center p-2">No Logo</div>
                      )}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Option 1: Upload Logo</Label>
                        <Input type="file" accept="image/*" onChange={handleFileUpload} className="cursor-pointer file:text-white bg-[#0F172A] border-border/50 text-white h-11" />
                      </div>
                      <div className="text-xs text-text-muted text-center uppercase relative py-2">
                        <span className="bg-[#0B1120] px-3 relative z-10 text-white/50">OR</span>
                        <div className="absolute top-1/2 left-0 w-full h-px bg-border/50 -translate-y-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white font-medium">Option 2: Generate with AI</Label>
                        <div className="flex flex-col sm:flex-row gap-3 items-center">
                          <div className="flex w-full gap-2 items-center bg-[#0F172A] p-1.5 rounded-lg border border-border/50">
                            <Input 
                              type="color"
                              value={logoColor}
                              onChange={(e) => setLogoColor(e.target.value)}
                              className="w-10 h-10 p-0.5 shrink-0 cursor-pointer rounded bg-black border-border/50"
                              title="Brand Color"
                            />
                            <Input 
                              placeholder="Describe your logo (e.g., A minimalist tech icon)" 
                              value={logoPrompt}
                              onChange={(e) => setLogoPrompt(e.target.value)}
                              className="h-10 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-white/40 w-full"
                            />
                          </div>
                          <Button onClick={handleGenerateLogo} disabled={isGeneratingLogo || !logoPrompt} type="button" className="whitespace-nowrap shrink-0 w-full sm:w-auto h-11 px-6 bg-[#1E293B] hover:bg-[#334155] text-white border-border/50">
                            {isGeneratingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                          </Button>
                        </div>
                      </div>
                      <div className="pt-2">
                        {logoPreview ? (
                          <a href={logoPreview} download="business_logo.png" target="_blank" rel="noreferrer">
                            <Button type="button" variant="outline" className="w-full h-11 bg-transparent border-border/50 text-white font-bold hover:bg-white/5">Download Logo</Button>
                          </a>
                        ) : (
                           <Button type="button" disabled variant="outline" className="w-full h-11 bg-transparent border-border/50 text-white/70 font-bold">Download Logo</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

{/* Business Details Card */}
                <div id="section-business" className="border border-border/50 bg-card/40 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm scroll-mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-pink/20 flex items-center justify-center">
                      <Store className="w-5 h-5 text-brand-pink" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Business Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_name">Business Name</Label>
                      <Input id="business_name" placeholder="Enter your business name" {...register("business_name")} className={`bg-[#0B1120] border-border/50 h-11 ${errors.business_name ? "border-red-500" : ""}`} />
                      {errors.business_name && <p className="text-xs text-red-500">{errors.business_name.message as string}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business_type">Business Type</Label>
                        <select id="business_type" {...register("business_type")} className={`flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white ${errors.business_type ? "border-red-500" : ""}`}>
                          <option className="bg-[#0F172A] text-white" value="">Select business type</option>
                          <option className="bg-[#0F172A] text-white" value="Retail">Retail</option>
                          <option className="bg-[#0F172A] text-white" value="SaaS">SaaS</option>
                          <option className="bg-[#0F172A] text-white" value="Agency">Agency</option>
                          <option className="bg-[#0F172A] text-white" value="E-commerce">E-commerce</option>
                          <option className="bg-[#0F172A] text-white" value="Other">Other</option>
                        </select>
                        {errors.business_type && <p className="text-xs text-red-500">{errors.business_type.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="registration_number">Registration Number</Label>
                        <Input id="registration_number" placeholder="Enter Registration Number" {...register("registration_number")} className="bg-[#0B1120] border-border/50 h-11 text-white placeholder:text-white/40" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="business_model">Business Model</Label>
                        <select id="business_model" {...register("business_model")} className="flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white">
                          <option className="bg-[#0F172A] text-white" value="">Select business model</option>
                          <option className="bg-[#0F172A] text-white" value="Physical Store">Physical Store</option>
                          <option className="bg-[#0F172A] text-white" value="Online Business">Online Business</option>
                          <option className="bg-[#0F172A] text-white" value="Home Business">Home Business</option>
                          <option className="bg-[#0F172A] text-white" value="Service Business">Service Business</option>
                          <option className="bg-[#0F172A] text-white" value="Both Online & Offline">Both Online & Offline</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="selling_model">Selling Model</Label>
                        <select id="selling_model" {...register("selling_model")} className="flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white">
                          <option className="bg-[#0F172A] text-white" value="">Select selling model</option>
                          <option className="bg-[#0F172A] text-white" value="Products">Products</option>
                          <option className="bg-[#0F172A] text-white" value="Services">Services</option>
                          <option className="bg-[#0F172A] text-white" value="Products + Services">Products + Services</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_category">Business Category</Label>
                      <select id="business_category" {...register("business_category")} className="flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white">
                        <option className="bg-[#0F172A] text-white" value="">Select category</option>
                        <option className="bg-[#0F172A] text-white" value="Fashion & Clothing">Fashion & Clothing</option>
                        <option className="bg-[#0F172A] text-white" value="Beauty & Salon">Beauty & Salon</option>
                        <option className="bg-[#0F172A] text-white" value="Restaurant / Cafe">Restaurant / Cafe</option>
                        <option className="bg-[#0F172A] text-white" value="Technology">Technology</option>
                        <option className="bg-[#0F172A] text-white" value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="business_description">Business Description</Label>
                      <textarea id="business_description" {...register("business_description")} className="flex min-h-[100px] w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-purple" />
                    </div>
                  </div>
                </div>

                {/* Target Audience Card */}
                <div id="section-audience" className="border border-border/50 bg-card/40 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm scroll-mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-purple" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Target Audience</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Age Group</Label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {['15 - 25', '25 - 35', '35 - 50', '50 +'].map(age => (
                          <label key={age} className="relative flex items-center justify-center px-4 py-2 rounded-full border border-border/60 bg-[#0B1120] border-border/50 cursor-pointer hover:border-brand-purple transition-all has-[:checked]:border-brand-purple has-[:checked]:bg-brand-purple/10">
                            <input type="checkbox" value={age} {...register("target_age_group")} className="peer sr-only" />
                            <span className="text-sm text-white">{age}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="target_gender">Gender</Label>
                        <select id="target_gender" {...register("target_gender")} className="flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white">
                          <option className="bg-[#0F172A] text-white" value="">Select gender</option>
                          <option className="bg-[#0F172A] text-white" value="Male">Male</option>
                          <option className="bg-[#0F172A] text-white" value="Female">Female</option>
                          <option className="bg-[#0F172A] text-white" value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer_type">Select Customer</Label>
                        <select id="customer_type" {...register("customer_type")} className="flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white">
                          <option className="bg-[#0F172A] text-white" value="">Select customer type</option>
                          <option className="bg-[#0F172A] text-white" value="B2C">B2C</option>
                          <option className="bg-[#0F172A] text-white" value="B2B">B2B</option>
                          <option className="bg-[#0F172A] text-white" value="Both">Both</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="target_location">Location Focus</Label>
                      <select id="target_location" {...register("target_location")} className="flex h-11 w-full rounded-md border border-border/50 bg-[#0B1120] px-3 py-2 text-sm text-white">
                        <option className="bg-[#0F172A] text-white" value="">Select location</option>
                        <option className="bg-[#0F172A] text-white" value="Local">Local</option>
                        <option className="bg-[#0F172A] text-white" value="City">City</option>
                        <option className="bg-[#0F172A] text-white" value="State">State</option>
                        <option className="bg-[#0F172A] text-white" value="Global">Global</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Details Card */}
                <div id="section-account" className="border border-border/50 bg-card/40 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm scroll-mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Account Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" {...register("email")} className={`bg-[#0B1120] border-border/50 h-11 ${errors.email ? "border-red-500" : ""}`} />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message as string}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Create a password" {...register("password")} className={`bg-[#0B1120] border-border/50 h-11 ${errors.password ? "border-red-500" : ""}`} />
                        {errors.password && <p className="text-xs text-red-500">{errors.password.message as string}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm password" {...register("confirmPassword")} className={`bg-[#0B1120] border-border/50 h-11 ${errors.confirmPassword ? "border-red-500" : ""}`} />
                        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message as string}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 5: Review & Submit Card */}
                <div id="section-submit" className="border border-border/50 bg-[#0B1120] rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm scroll-mt-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fc9a5d]/20 to-[#be32ff]/20 flex items-center justify-center border border-[#be32ff]/30">
                      <Sparkles className="w-5 h-5 text-[#be32ff]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Step 5: Review &amp; Submit</h3>
                      <p className="text-xs text-neutral-400">Confirm your details and complete business registration</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5 mb-6 text-xs text-neutral-300">
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-neutral-400">Business Logo</span>
                      <span className="font-medium text-white flex items-center gap-1.5">
                        {isLogoDone ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Uploaded / Generated
                          </span>
                        ) : (
                          <span className="text-amber-400">Not set</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-neutral-400">Business Name</span>
                      <span className="font-medium text-white">
                        {watchedBusinessName || <span className="text-neutral-500 italic">Pending input</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-white/5">
                      <span className="text-neutral-400">Business Type</span>
                      <span className="font-medium text-white">
                        {watchedBusinessType || <span className="text-neutral-500 italic">Pending selection</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-neutral-400">Account Email</span>
                      <span className="font-medium text-white">
                        {watchedEmail || <span className="text-neutral-500 italic">Pending input</span>}
                      </span>
                    </div>
                  </div>

                  {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md mb-4">{error}</div>}

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:to-[#7d36fa] text-white shadow-[0_4px_25px_rgba(240,68,155,0.35)] hover:shadow-[0_6px_35px_rgba(190,50,255,0.55)] transition-all cursor-pointer" 
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Register Business & Submit"}
                  </Button>
                </div>
              </div>

        </form>

        {/* Registered Successfully Popup Modal (Redesigned with WOW factor) */}
        {showSuccessModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setShowSuccessModal(false)}
          >
            <div 
              className="relative w-full max-w-lg bg-[#0e0f16] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(190,50,255,0.3)] overflow-hidden text-center animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top ambient colored lighting aura */}
              <div className="absolute -top-28 -right-20 w-64 h-64 bg-gradient-to-br from-[#fc9a5d]/30 via-[#f0449b]/30 to-[#be32ff]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-28 -left-20 w-64 h-64 bg-gradient-to-tr from-[#be32ff]/30 to-[#7d36fa]/30 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-5 relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-4" />
                <span>Registration Complete &amp; Verified</span>
              </div>

              {/* Lottie Animation from public/Done.json */}
              <div className="relative mx-auto w-36 h-36 mb-2 flex items-center justify-center z-10 select-none">
                {/* Soft ambient colored glow behind animation */}
                <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#fc9a5d]/20 via-[#f0449b]/25 to-[#be32ff]/25 blur-xl pointer-events-none" />
                <DoneAnimation className="w-36 h-36" />
              </div>

              {/* Main Headline */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight relative z-10">
                Registered Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed relative z-10 max-w-sm mx-auto">
                Welcome aboard! Your business account is activated and ready to power your AI marketing engine.
              </p>

              {/* Highlighted Business Name Card */}
              <div className="mt-5 p-4 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/10 relative z-10 text-left backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fc9a5d] via-[#f0449b] to-[#be32ff] flex items-center justify-center text-white shrink-0 shadow-md">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">Active Business</div>
                    <div className="text-base font-bold text-white truncate">
                      {registeredBusinessName || "SevenUnique Fashion Store AI"}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    Live
                  </span>
                </div>

                {/* 3 Metrics / Badges */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-neutral-400">Plan Tier</div>
                    <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fc9a5d] to-[#f0449b]">Pro Free</div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-neutral-400">AI Hub</div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3" /> Ready
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-[10px] text-neutral-400">Brand Kit</div>
                    <div className="text-xs font-bold text-[#be32ff]">Synced</div>
                  </div>
                </div>
              </div>

              {/* Big CTA Button with gradient hover */}
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
                className="w-full mt-6 h-12 rounded-xl bg-gradient-to-r from-[#fc9a5d] via-[#f0449b] to-[#be32ff] hover:to-[#7d36fa] text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(240,68,155,0.4)] hover:shadow-[0_6px_40px_rgba(190,50,255,0.6)] hover:brightness-110 transition-all cursor-pointer relative z-10 active:scale-[0.98]"
              >
                <span>Launch Dashboard Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-text-muted mt-6 pb-6">
          Already have an account?{" "}
          <Link href="/login/user" className="text-brand-pink font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

