"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { COUNTRY_CODES, validatePhoneNumber } from "@/lib/phone";

const signupSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    countryCode: z.string().min(1, { message: "Country code is required" }),
    phone: z.string().min(5, { message: "Mobile number is required" }),
    email: z
      .string()
      .min(1, { message: "Email ID is required" })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      countryCode: "+91",
      phone: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const phoneValue = useWatch({
    control,
    name: "phone",
    defaultValue: "",
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

  const requirements = [
    { label: "8+ characters", met: (passwordValue || "").length >= 8 },
    { label: "uppercase letter", met: /[A-Z]/.test(passwordValue || "") },
    { label: "lowercase letter", met: /[a-z]/.test(passwordValue || "") },
    { label: "number", met: /[0-9]/.test(passwordValue || "") },
    { label: "special character", met: /[^A-Za-z0-9]/.test(passwordValue || "") },
    {
      label: "passwords match",
      met: passwordValue !== "" && passwordValue === confirmPasswordValue,
    },
  ];

  const onSubmit = async (data: SignupFormValues) => {
    setError("");
    setPhoneError("");

    // Validate phone number format against selected country code
    const phoneValidation = validatePhoneNumber(data.countryCode, data.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    const normalizedPhone = phoneValidation.e164;

    try {
      await authService.signup({
        name: data.name.trim(),
        phone: normalizedPhone,
        email: data.email.trim(),
        password: data.password,
      });

      // No email verification step. Direct user straight to login with pre-filled phone number!
      const queryParams = new URLSearchParams({
        registered: "true",
        phone: normalizedPhone,
      });

      router.push(`/login/user?${queryParams.toString()}`);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Logo withText={false} className="scale-125 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
          <p className="text-sm text-text-muted">
            Start growing your business with AI Marketing
          </p>
        </div>

        <Card className="bg-card shadow-lg border-border">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-brand-pink">*</span></Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Mobile Phone Number with Country Code */}
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Phone Number <span className="text-brand-pink">*</span></Label>
                <div className="flex gap-2">
                  <div className="w-36 shrink-0">
                    <select
                      id="countryCode"
                      aria-label="Country Code"
                      {...register("countryCode")}
                      className="flex h-10 w-full rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
                    >
                      {COUNTRY_CODES.map((c, idx) => (
                        <option key={`${c.code}-${c.country}-${idx}`} value={c.code} className="bg-surface text-white">
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="98765 43210"
                      {...register("phone")}
                      className={errors.phone || phoneError ? "border-red-500" : ""}
                    />
                  </div>
                </div>
                {phoneError && (
                  <p className="text-xs text-red-500">{phoneError}</p>
                )}
                {errors.phone && !phoneError && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Email ID (Mandatory) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-brand-pink">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
                <p className="text-xs text-text-muted">
                  Used for account management and reports (no verification required).
                </p>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-brand-pink">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                <div className="pt-2 grid grid-cols-2 gap-1.5 text-xs text-text-muted">
                  {requirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 ${
                        req.met ? "text-green-500" : "text-text-muted"
                      }`}
                    >
                      {req.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-brand-pink">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

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
