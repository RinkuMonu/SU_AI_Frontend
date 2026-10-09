"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Check, X, Store, Users, Landmark, Download, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const passwordValue = useWatch({
    control,
    name: "password",
    defaultValue: "",
  });

  const confirmPasswordValue = useWatch({
    control,
    name: "confirmPassword",
    defaultValue: "",
  });



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
      if (response.token && response.user) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("business_just_registered", "1");
        window.location.href = "/dashboard";
      } else {
        router.push("/login/user");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10 bg-background">
      <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Logo withText={false} className="scale-125 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-text-muted">
            Start growing your business with AI Marketing
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">

                {/* Business Logo Card */}
                <div className="border border-border/50 bg-[#0B1120] rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
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
                <div className="border border-border/50 bg-card/40 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
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
                <div className="border border-border/50 bg-card/40 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
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
                <div className="border border-border/50 bg-card/40 rounded-xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
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

                {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">{error}</div>}

                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
                </Button>
              </div>

        </form>


        
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

