"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Camera, Sparkles, RefreshCw, Layers } from "lucide-react";
import { PhotoshootStepper } from "@/components/photoshoot/PhotoshootStepper";
import { Step1Upload } from "@/components/photoshoot/Step1Upload";
import { Step2Enhance } from "@/components/photoshoot/Step2Enhance";
import { Step3StyleAndModel } from "@/components/photoshoot/Step3StyleAndModel";
import { Step4PromptAndVoice } from "@/components/photoshoot/Step4PromptAndVoice";
import { Step5Results } from "@/components/photoshoot/Step5Results";
import { 
  EnhancedVariation, 
  EnhancementStyle, 
  PhotoshootFinalResult, 
  PhotoshootUploadedImage, 
  ProductCategory 
} from "@/components/photoshoot/types";
import { 
  AI_MODELS, 
  ENHANCEMENT_STYLES, 
  MODEL_POSES_CLOTHING, 
  MODEL_POSES_JEWELLERY, 
  PRODUCT_CATEGORIES, 
  PRODUCT_ONLY_STYLES 
} from "@/components/photoshoot/data";
import { imageService } from "@/services/image.service";
import { getAiFallbackImage } from "@/lib/imageUtils";

export default function AIPhotoshootPage() {
  // Shared Studio Workflow State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);

  const [uploadedImages, setUploadedImages] = useState<PhotoshootUploadedImage[]>([]);
  const [productCategory, setProductCategory] = useState<ProductCategory>("womens_clothing");
  const [productName, setProductName] = useState("");
  const [productColor, setProductColor] = useState("");

  const [enhancementStyle, setEnhancementStyle] = useState<EnhancementStyle>("studio_premium");
  const [enhancedVariations, setEnhancedVariations] = useState<EnhancedVariation[]>([]);
  const [selectedEnhancedIds, setSelectedEnhancedIds] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Model & Photography Styles
  const [withModel, setWithModel] = useState<boolean>(true);
  const [selectedModelId, setSelectedModelId] = useState<string | null>("model_f_01");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "pose_front_view",
    "pose_sitting",
  ]);

  // Prompt & Voice
  const [customPrompt, setCustomPrompt] = useState("");

  // Final Results
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [finalResults, setFinalResults] = useState<PhotoshootFinalResult[]>([]);
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]);

  // Update highest step reached for stepper navigation
  useEffect(() => {
    if (step > highestStepReached) {
      setHighestStepReached(step);
    }
  }, [step, highestStepReached]);

  // Generate Enhanced Variations for Step 2
  const generateEnhancements = useCallback(
    async (style: EnhancementStyle, baseImages: PhotoshootUploadedImage[]) => {
      setIsEnhancing(true);
      const styleInfo = ENHANCEMENT_STYLES.find((s) => s.id === style) || ENHANCEMENT_STYLES[0];
      const primeImg = baseImages[0]?.previewUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";

      const variations: EnhancedVariation[] = [
        {
          id: `enh_1_${Date.now()}`,
          style,
          styleName: `${styleInfo.name} • Clean Key`,
          originalUrl: primeImg,
          enhancedUrl: getAiFallbackImage(
            `${productName || "commercial product"} ${styleInfo.name} clean commercial lighting, studio backdrop, hyper-sharp product edges`,
            101
          ),
          description: `Balanced 5600K soft daylight with crisp natural shadows and true-to-life ${productColor || "original"} tones.`,
          aspectRatio: "1:1",
        },
        {
          id: `enh_2_${Date.now()}`,
          style,
          styleName: `${styleInfo.name} • Subtle Rim Light`,
          originalUrl: primeImg,
          enhancedUrl: getAiFallbackImage(
            `${productName || "commercial product"} ${styleInfo.name} rim light luxury reflection studio showcase`,
            202
          ),
          description: "Subtle specular rim-lighting accentuating product contours, stitching, and fine material texture.",
          aspectRatio: "1:1",
        },
        {
          id: `enh_3_${Date.now()}`,
          style,
          styleName: `${styleInfo.name} • High-Contrast Depth`,
          originalUrl: primeImg,
          enhancedUrl: getAiFallbackImage(
            `${productName || "commercial product"} ${styleInfo.name} high contrast depth commercial advertising studio shot`,
            303
          ),
          description: "Enhanced dynamic contrast and calibrated color vibrancy engineered for social media and marketplace feeds.",
          aspectRatio: "1:1",
        },
      ];

      setEnhancedVariations(variations);
      setSelectedEnhancedIds([variations[0].id, variations[1].id]);
      setIsEnhancing(false);
    },
    [productName, productColor]
  );

  // Transition Step 1 -> Step 2
  const handleProceedToEnhancement = () => {
    if (uploadedImages.length === 0) return;
    setStep(2);
    if (enhancedVariations.length === 0) {
      generateEnhancements(enhancementStyle, uploadedImages);
    }
  };

  // Re-run enhancements if user changes style
  const handleEnhancementStyleSelect = (style: EnhancementStyle) => {
    setEnhancementStyle(style);
    generateEnhancements(style, uploadedImages);
  };

  // Toggle Enhanced Variation selection
  const handleVariationToggle = (id: string) => {
    setSelectedEnhancedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Re-roll single enhancement variation
  const handleRegenerateVariation = async (id: string) => {
    setEnhancedVariations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isRegenerating: true } : v))
    );

    const styleInfo = ENHANCEMENT_STYLES.find((s) => s.id === enhancementStyle);
    const newSeed = Math.floor(Math.random() * 900000) + 1000;
    const newUrl = getAiFallbackImage(
      `${productName || "product"} ${styleInfo?.name || "studio"} high resolution product enhancement`,
      newSeed
    );

    await new Promise((r) => setTimeout(r, 600));

    setEnhancedVariations((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              enhancedUrl: newUrl,
              isRegenerating: false,
            }
          : v
      )
    );
  };

  // Handle Model Mode Toggle (With Model vs. Without Model)
  const handleToggleWithModel = (newWithModel: boolean) => {
    setWithModel(newWithModel);
    if (newWithModel) {
      // Switching to With Model: ensure model selected and valid model poses
      if (!selectedModelId) {
        setSelectedModelId(AI_MODELS[0].id);
      }
      setSelectedStyles(["pose_front_view", "pose_sitting"]);
    } else {
      // Switching to Without Model: select suitable product-only styles
      setSelectedModelId(null);
      setSelectedStyles(["style_clean_hero", "style_luxury_studio"]);
    }
  };

  // Toggle photography style
  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter((s) => s !== styleId);
      } else {
        return [...prev, styleId];
      }
    });
  };

  // Generate Final 5-6 Photoshoot Results (Step 4 -> Step 5)
  const handleGenerateFinalPhotoshoot = async () => {
    setStep(5);
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStage("Analyzing product geometries and color palette...");

    const selectedModel = AI_MODELS.find((m) => m.id === selectedModelId);
    const chosenStyles = selectedStyles.length > 0 ? selectedStyles : ["style_clean_hero"];

    // Multi-stage progress animation
    setTimeout(() => {
      setGenerationProgress(40);
      setGenerationStage(
        withModel
          ? `Fitting product to ${selectedModel?.name || "AI model"} with realistic drape and pose...`
          : "Synthesizing luxury studio background and dynamic key lighting..."
      );
    }, 700);

    setTimeout(() => {
      setGenerationProgress(75);
      setGenerationStage("Rendering 4K Ultra-HD specular highlights and shadows...");
    }, 1500);

    // Build 5–6 variations
    const generatedItems: PhotoshootFinalResult[] = [];
    const count = 6;

    for (let i = 0; i < count; i++) {
      const styleId = chosenStyles[i % chosenStyles.length];
      const allPossibleStyles = [
        ...MODEL_POSES_CLOTHING,
        ...MODEL_POSES_JEWELLERY,
        ...PRODUCT_ONLY_STYLES,
      ];
      const matchedStyle = allPossibleStyles.find((s) => s.id === styleId);
      const styleName = matchedStyle?.name || "Hero Studio Composition";

      const promptParts = [
        productName || "luxury commercial product",
        productColor ? `color: ${productColor}` : "",
        `category: ${productCategory.replace(/_/g, " ")}`,
        withModel && selectedModel ? `worn by ${selectedModel.name} (${selectedModel.gender} model, ${selectedModel.ethnicity})` : "standalone hero product placement, no human",
        styleName,
        customPrompt ? `instructions: ${customPrompt}` : "",
        "commercial photography, 8k uhd, studio lighting, advertising quality, ultra-detailed fabric and textures",
      ].filter(Boolean);

      const fullPrompt = promptParts.join(", ");
      const seed = Math.floor(Math.random() * 800000) + (i + 1) * 100;
      const imageUrl = getAiFallbackImage(fullPrompt, seed);

      generatedItems.push({
        id: `res_${Date.now()}_${i}`,
        imageUrl,
        title: `${productName || "Product"} — ${styleName}`,
        prompt: fullPrompt,
        styleName,
        modelUsed: withModel && selectedModel ? selectedModel.name : undefined,
        resolution: "4K Ultra-HD",
        selected: true,
        createdAt: new Date().toISOString(),
      });
    }

    setTimeout(() => {
      setGenerationProgress(100);
      setGenerationStage("Finalizing neural polish...");
      setFinalResults(generatedItems);
      setSelectedResultIds(generatedItems.map((g) => g.id));
      setIsGenerating(false);
    }, 2200);
  };

  // Re-roll single final image variation
  const handleRegenerateFinalResult = async (id: string) => {
    setFinalResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRegenerating: true } : r))
    );

    const target = finalResults.find((r) => r.id === id);
    const newSeed = Math.floor(Math.random() * 900000) + 5000;
    const newUrl = getAiFallbackImage(target?.prompt || "commercial product photoshoot", newSeed);

    await new Promise((r) => setTimeout(r, 700));

    setFinalResults((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              imageUrl: newUrl,
              isRegenerating: false,
            }
          : r
      )
    );
  };

  // Download single image
  const handleDownloadSingle = async (item: PhotoshootFinalResult) => {
    try {
      const response = await fetch(item.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const filename = `${(productName || "product").toLowerCase().replace(/[^a-z0-9]/g, "-")}-${item.styleName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(item.imageUrl, "_blank");
    }
  };

  // Download all selected images
  const handleDownloadSelected = async () => {
    const selected = finalResults.filter((r) => selectedResultIds.includes(r.id));
    for (const item of selected) {
      await handleDownloadSingle(item);
      await new Promise((r) => setTimeout(r, 300));
    }
  };

  // Save to My Gallery handler
  const handleSaveToGallery = () => {
    try {
      const savedExisting = JSON.parse(localStorage.getItem("dhandagrow_photoshoots") || "[]");
      const newSaves = finalResults.filter((r) => selectedResultIds.includes(r.id));
      localStorage.setItem(
        "dhandagrow_photoshoots",
        JSON.stringify([...newSaves, ...savedExisting])
      );
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
  };

  // Navigation validation for Stepper clicks
  const canNavigateToStep = (targetStep: 1 | 2 | 3 | 4 | 5): boolean => {
    if (targetStep === 1) return true;
    if (targetStep === 2) return uploadedImages.length > 0;
    if (targetStep === 3) return uploadedImages.length > 0 && selectedEnhancedIds.length > 0;
    if (targetStep === 4) return uploadedImages.length > 0 && selectedStyles.length > 0;
    if (targetStep === 5) return finalResults.length > 0;
    return false;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 pb-16">
      {/* Page Title & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center text-white shadow-lg shadow-brand-purple/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>AI Product Photoshoot</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-pink border border-brand-purple/40">
                  Unified Studio
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400">
                Transform ordinary product images into studio-grade commercial visuals with or without AI models.
              </p>
            </div>
          </div>
        </div>

        {/* Global Reset / Restart Action */}
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Start a new photoshoot? Your current session will reset.")) {
                  setStep(1);
                  setUploadedImages([]);
                  setFinalResults([]);
                }
              }}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Studio</span>
            </button>
          )}
        </div>
      </div>

      {/* 5-Step Progress Stepper */}
      <PhotoshootStepper
        currentStep={step}
        onStepClick={(s) => setStep(s)}
        canNavigateToStep={canNavigateToStep}
      />

      {/* 5-Step Workflow View */}
      {step === 1 && (
        <Step1Upload
          uploadedImages={uploadedImages}
          productCategory={productCategory}
          productName={productName}
          productColor={productColor}
          onImagesChange={(imgs) => setUploadedImages(imgs)}
          onCategoryChange={(cat) => setProductCategory(cat)}
          onNameChange={(name) => setProductName(name)}
          onColorChange={(col) => setProductColor(col)}
          onNext={handleProceedToEnhancement}
        />
      )}

      {step === 2 && (
        <Step2Enhance
          uploadedImages={uploadedImages}
          enhancedVariations={enhancedVariations}
          selectedEnhancedIds={selectedEnhancedIds}
          enhancementStyle={enhancementStyle}
          isEnhancing={isEnhancing}
          onStyleSelect={handleEnhancementStyleSelect}
          onVariationToggle={handleVariationToggle}
          onRegenerateVariation={handleRegenerateVariation}
          onRegenerateAll={() => generateEnhancements(enhancementStyle, uploadedImages)}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Step3StyleAndModel
          productCategory={productCategory}
          withModel={withModel}
          selectedModelId={selectedModelId}
          selectedStyles={selectedStyles}
          onToggleWithModel={handleToggleWithModel}
          onModelSelect={(mId) => setSelectedModelId(mId)}
          onStyleToggle={handleStyleToggle}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Step4PromptAndVoice
          customPrompt={customPrompt}
          productCategory={productCategory}
          productName={productName}
          productColor={productColor}
          enhancementStyle={enhancementStyle}
          withModel={withModel}
          selectedModelId={selectedModelId}
          selectedStyles={selectedStyles}
          uploadedImages={uploadedImages}
          isGenerating={isGenerating}
          onPromptChange={(p) => setCustomPrompt(p)}
          onBack={() => setStep(3)}
          onGenerate={handleGenerateFinalPhotoshoot}
        />
      )}

      {step === 5 && (
        <Step5Results
          results={finalResults}
          selectedResultIds={selectedResultIds}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          generationStage={generationStage}
          productName={productName}
          onToggleSelect={(id) =>
            setSelectedResultIds((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            )
          }
          onSelectAll={() => setSelectedResultIds(finalResults.map((r) => r.id))}
          onDeselectAll={() => setSelectedResultIds([])}
          onDeleteResult={(id) => {
            setFinalResults((prev) => prev.filter((r) => r.id !== id));
            setSelectedResultIds((prev) => prev.filter((i) => i !== id));
          }}
          onRegenerateResult={handleRegenerateFinalResult}
          onSaveToGallery={handleSaveToGallery}
          onDownloadSelected={handleDownloadSelected}
          onDownloadSingle={handleDownloadSingle}
          onStartNewPhotoshoot={() => {
            setStep(1);
            setUploadedImages([]);
            setFinalResults([]);
          }}
          onBackToEdit={() => setStep(4)}
        />
      )}
    </div>
  );
}
