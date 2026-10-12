"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/ui/Logo";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await authService.login(data.email, data.password);
      if (response?.user?.role !== "admin") {
        throw new Error("Unauthorized: Admin privileges required.");
      }
      if (response?.token && response?.user) {
        login(response.token, response.user);
      } else {
        throw new Error("Authentication failed: Missing token or user data.");
      }
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      if (msg.includes("EMAIL_NOT_VERIFIED") || msg.toLowerCase().includes("verification")) {
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
      } else {
        setError(msg);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Logo withText={false} className="scale-125 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Login</h1>
          <p className="text-sm text-brand-coral uppercase tracking-widest font-semibold">
            Secure access
          </p>
        </div>

        <Card className="bg-surface shadow-2xl border-border">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-text-secondary">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-text-secondary">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">{error}</div>}

              <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Authenticate"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
