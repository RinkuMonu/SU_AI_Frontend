"use client";

import { useEffect, useState } from "react";
import { getBrandKit, createBrandKit, updateBrandKit } from "@/services/brand.service";
import { imageService } from "@/services/image.service";
import { BrandKit, BrandCreate } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, Loader2, Save, Download, Globe, AtSign, Phone, Mail, MapPin } from "lucide-react";

export default function BrandKitPage() {
  const [brand, setBrand] = useState<BrandKit | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPrompt, setLogoPrompt] = useState("");
  const [logoGenerating, setLogoGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<BrandCreate>({
    primary_color: "#204972",
    secondary_color: "#84CC16",
    font: "Inter",
    tone: "",
    brand_description: "",
    target_audience: "",
    website: "",
    instagram: "",
    social_style: "",
    contact: { phone: "", email: "" },
    location: { city: "", state: "" },
  });

  useEffect(() => {
    loadBrand();
  }, []);

  const loadBrand = async () => {
    try {
      const data = await getBrandKit();
      setBrand(data);
      setForm({
        logo_url: data.logo_url,
        primary_color: data.primary_color || "#204972",
        secondary_color: data.secondary_color || "#84CC16",
        font: data.font || "Inter",
        tone: data.tone || "",
        brand_description: data.brand_description || "",
        target_audience: data.target_audience || "",
        website: data.website || "",
        instagram: data.instagram || "",
        social_style: data.social_style || "",
        contact: data.contact || { phone: "", email: "" },
        location: data.location || { city: "", state: "" },
      });
    } catch {
      // No brand kit yet — will create on save
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLogo = async () => {
    if (!logoPrompt.trim()) {
      setErrorMsg("Please enter a prompt to generate the logo.");
      return;
    }
    try {
      setLogoGenerating(true);
      setErrorMsg("");
      const res = await imageService.generateImage({
        prompt: logoPrompt + " logo design, vector, flat, minimalist, clean background",
      });
      if (res.success && res.data?.image_url) {
        setForm((prev) => ({ ...prev, logo_url: res.data!.image_url }));
        setSuccessMsg("Logo generated successfully!");
      } else {
        setErrorMsg(res.message || "Failed to generate logo.");
      }
    } catch {
      setErrorMsg("Logo generation failed. Please try again.");
    } finally {
      setLogoGenerating(false);
    }
  };

  const handleDownloadLogo = () => {
    if (!form.logo_url) return;
    const link = document.createElement("a");
    link.href = getLogoUrl(form.logo_url);
    link.download = "brand_logo.png";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMsg("");
      setErrorMsg("");
      const result = brand ? await updateBrandKit(form) : await createBrandKit(form);
      setBrand(result);
      setSuccessMsg("Brand Kit saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Failed to save Brand Kit. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof BrandCreate, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const updateContact = (key: "phone" | "email", value: string) =>
    setForm((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));

  const updateLocation = (key: "city" | "state", value: string) =>
    setForm((prev) => ({ ...prev, location: { ...prev.location, [key]: value } }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  const primaryColor = form.primary_color || "#204972";
  const secondaryColor = form.secondary_color || "#84CC16";

  const getLogoUrl = (url: string | undefined) => {
    if (!url) return "";
    const normalizedUrl = url.replace(/\\/g, "/");
    if (normalizedUrl.startsWith("http")) return normalizedUrl;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    return `${baseUrl}${normalizedUrl.startsWith("/") ? "" : "/"}${normalizedUrl}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-brand-purple" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Brand Kit</h1>
            <p className="text-text-muted text-sm mt-0.5">Define your brand identity for consistent AI-generated content.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-brand-gradient hover:opacity-90 transition-opacity text-white">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {saving ? "Saving..." : "Save Brand Kit"}
        </Button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Logo */}
          <Card className="bg-surface border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Brand Logo</CardTitle>
              <CardDescription>Generate your logo using Groq AI to use in content.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getLogoUrl(form.logo_url)} alt="Brand Logo" className="h-20 w-20 rounded-xl object-contain border border-border bg-surface-elevated" />
                ) : (
                  <div className="h-20 w-20 rounded-xl border-2 border-dashed border-border bg-surface-elevated flex items-center justify-center shrink-0">
                    <Palette className="h-8 w-8 text-text-muted" />
                  </div>
                )}
                <div className="flex-1 space-y-3 w-full">
                  <div className="flex flex-col sm:flex-row gap-2 w-full">
                    <Input 
                      placeholder="Describe your logo (e.g. minimalist tech startup logo)" 
                      value={logoPrompt}
                      onChange={(e) => setLogoPrompt(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleGenerateLogo} disabled={logoGenerating} className="bg-brand-purple hover:bg-brand-purple/90 text-white whitespace-nowrap">
                      {logoGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      {logoGenerating ? "Generating..." : "Generate Logo"}
                    </Button>
                  </div>
                  {form.logo_url && (
                    <Button variant="outline" size="sm" onClick={handleDownloadLogo} className="mt-2">
                      <Download className="h-4 w-4 mr-2" /> Download Logo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Colors & Font */}
          <Card className="bg-surface border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Colors &amp; Typography</CardTitle>
              <CardDescription>Set your brand colour palette and preferred font.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={primaryColor} onChange={(e) => update("primary_color", e.target.value)} className="w-12 h-10 rounded-md border border-border cursor-pointer p-1 bg-transparent" />
                    <Input value={primaryColor} onChange={(e) => update("primary_color", e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={secondaryColor} onChange={(e) => update("secondary_color", e.target.value)} className="w-12 h-10 rounded-md border border-border cursor-pointer p-1 bg-transparent" />
                    <Input value={secondaryColor} onChange={(e) => update("secondary_color", e.target.value)} className="font-mono uppercase" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="font">Font</Label>
                  <select
                    id="font"
                    value={form.font || "Inter"}
                    onChange={(e) => update("font", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-surface-elevated text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    {["Inter", "Roboto", "Open Sans", "Montserrat", "Playfair Display", "Lato", "Poppins"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_style">Social Style</Label>
                  <select
                    id="social_style"
                    value={form.social_style || ""}
                    onChange={(e) => update("social_style", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-surface-elevated text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  >
                    <option value="">Select style</option>
                    {["Minimal", "Bold", "Elegant", "Playful", "Professional", "Vibrant"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Voice */}
          <Card className="bg-surface border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Brand Voice</CardTitle>
              <CardDescription>Help AI understand how to write for your brand.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Brand Tone</Label>
                <select
                  id="tone"
                  value={form.tone || ""}
                  onChange={(e) => update("tone", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-border bg-surface-elevated text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
                >
                  <option value="">Select tone</option>
                  {["Professional", "Friendly", "Luxury", "Playful", "Inspirational", "Casual", "Authoritative"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand_description">Brand Description</Label>
                <textarea
                  id="brand_description"
                  rows={3}
                  value={form.brand_description || ""}
                  onChange={(e) => update("brand_description", e.target.value)}
                  placeholder="Describe your brand, what you sell, and your unique value..."
                  className="flex w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_audience">Target Audience</Label>
                <Input
                  id="target_audience"
                  value={form.target_audience || ""}
                  onChange={(e) => update("target_audience", e.target.value)}
                  placeholder="e.g. Women aged 25–45 interested in ethnic fashion"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Contact &amp; Location</CardTitle>
              <CardDescription>Used in AI-generated promotional content and local targeting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">
                    <Globe className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Website
                  </Label>
                  <Input id="website" value={form.website || ""} onChange={(e) => update("website", e.target.value)} placeholder="https://yourbrand.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">
                    <AtSign className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Instagram
                  </Label>
                  <Input id="instagram" value={form.instagram || ""} onChange={(e) => update("instagram", e.target.value)} placeholder="@yourbrand" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Phone
                  </Label>
                  <Input id="phone" value={form.contact?.phone || ""} onChange={(e) => updateContact("phone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />Email
                  </Label>
                  <Input id="email" type="email" value={form.contact?.email || ""} onChange={(e) => updateContact("email", e.target.value)} placeholder="hello@yourbrand.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    <MapPin className="h-3.5 w-3.5 inline mr-1 text-muted-foreground" />City
                  </Label>
                  <Input id="city" value={form.location?.city || ""} onChange={(e) => updateLocation("city", e.target.value)} placeholder="Mumbai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.location?.state || ""} onChange={(e) => updateLocation("state", e.target.value)} placeholder="Maharashtra" />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="overflow-hidden bg-surface shadow-lg" style={{ borderColor: `${primaryColor}60` }}>
              <div className="h-36 flex items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${primaryColor}25, ${secondaryColor}25)` }}>
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={getLogoUrl(form.logo_url)} alt="Logo" className="h-20 object-contain" />
                ) : (
                  <Sparkles className="w-14 h-14 opacity-60" style={{ color: primaryColor }} />
                )}
              </div>
              <CardContent className="pt-5 text-center space-y-3">
                <div>
                  <h3 className="text-lg font-bold" style={{ color: primaryColor }}>Your Brand</h3>
                  <p className="text-xs font-medium mt-1" style={{ color: secondaryColor }}>{form.tone || "Brand Tone"}</p>
                </div>
                <div className="h-px w-full bg-border" />
                <p className="text-xs text-text-muted line-clamp-3">{form.brand_description || "Your brand description will appear here and be used in AI-generated content."}</p>
                <div className="flex justify-center gap-2 pt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: primaryColor }} />
                    <span className="text-xs text-text-muted font-mono">{primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full border border-border/50" style={{ backgroundColor: secondaryColor }} />
                    <span className="text-xs text-text-muted font-mono">{secondaryColor}</span>
                  </div>
                </div>
                {form.font && (
                  <p className="text-xs text-text-muted">Font: <span className="font-medium text-white">{form.font}</span></p>
                )}
              </CardContent>
            </Card>

            <p className="text-xs text-center text-text-muted px-2">
              This preview shows how your brand identity will guide AI-generated content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
