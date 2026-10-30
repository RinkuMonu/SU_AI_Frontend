"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { PhotoshootStepper } from "@/components/photoshoot/PhotoshootStepper";
import { Step1Upload } from "@/components/photoshoot/Step1Upload";
import { Step2Enhance } from "@/components/photoshoot/Step2Enhance";
import { Step3StyleAndModel } from "@/components/photoshoot/Step3StyleAndModel";
import { Step4PromptAndVoice } from "@/components/photoshoot/Step4PromptAndVoice";
import { Step5Results } from "@/components/photoshoot/Step5Results";
import { 
  AIModelProfile,
  EnhancedVariation, 
  EnhancementStyle, 
  PhotographyStyleOption,
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
  PRODUCT_ONLY_STYLES,
  categoryIdToBackendName,
  backendNameToCategoryId
} from "@/components/photoshoot/data";
import { 
  productPhotoshootService,
  BackendProductAnalysisData,
  BackendAIModelItem,
  BackendPhotographyStyleItem
} from "@/services/productPhotoshoot.service";

const SESSION_STORAGE_KEY = "dhandagrow_photoshoot_session_id";

export default function AIPhotoshootPage() {
  // Shared Studio Workflow State
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [highestStepReached, setHighestStepReached] = useState<number>(1);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Step 1: Upload
  const [uploadedImages, setUploadedImages] = useState<PhotoshootUploadedImage[]>([]);
  const [productCategory, setProductCategory] = useState<ProductCategory>("womens_clothing");
  const [productName, setProductName] = useState("");
  const [productColor, setProductColor] = useState("");

  // Step 2: Analysis & Enhance
  const [detectedAnalysis, setDetectedAnalysis] = useState<BackendProductAnalysisData | null>(null);
  const [enhancementStyle, setEnhancementStyle] = useState<EnhancementStyle>("studio_premium");
  const [enhancedVariations, setEnhancedVariations] = useState<EnhancedVariation[]>([]);
  const [selectedEnhancedIds, setSelectedEnhancedIds] = useState<string[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Step 3: Model & Photography Styles
  const [withModel, setWithModel] = useState<boolean>(true);
  const [selectedModelId, setSelectedModelId] = useState<string | null>("model_f_01");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([
    "pose_front_view",
    "pose_sitting",
  ]);
  const [backendModels, setBackendModels] = useState<AIModelProfile[]>([]);
  const [backendStyles, setBackendStyles] = useState<PhotographyStyleOption[]>([]);

  // Step 4: Prompt & Voice
  const [customPrompt, setCustomPrompt] = useState("");
  const [preparedPrompt, setPreparedPrompt] = useState<string>("");
  const [isPreparingPrompt, setIsPreparingPrompt] = useState(false);

  // Step 5: Final Results & Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [finalResults, setFinalResults] = useState<PhotoshootFinalResult[]>([]);
  const [selectedResultIds, setSelectedResultIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clear polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Update highest step reached for stepper navigation
  useEffect(() => {
    if (step > highestStepReached) {
      setHighestStepReached(step);
    }
  }, [step, highestStepReached]);

  // Session restore on mount from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!savedSessionId) return;

    setSessionId(savedSessionId);
    // Attempt to retrieve existing results for this session
    productPhotoshootService
      .getSessionResults(savedSessionId)
      .then((res) => {
        if (res?.success && res.results && res.results.length > 0) {
          const mapped: PhotoshootFinalResult[] = res.results.map((r, i) => ({
            id: r.image_id,
            imageUrl: r.url,
            title: `Product Photoshoot — ${r.style_applied}`,
            prompt: `Commercial photoshoot with ${r.style_applied}`,
            styleName: r.style_applied,
            resolution: "4K Ultra-HD",
            selected: true,
            isSaved: r.is_saved,
            createdAt: r.created_at,
          }));
          setFinalResults(mapped);
          setSelectedResultIds(mapped.map((m) => m.id));
          setWithModel(res.use_model);
          setStep(5);
        }
      })
      .catch((_) => {
        // Silently ignore if session expired on backend
      });
  }, []);

  // Fetch dynamic models and styles from backend when category or model mode changes
  useEffect(() => {
    let isMounted = true;
    const categoryName = categoryIdToBackendName(productCategory);

    // Fetch Models
    productPhotoshootService
      .getModels({ category: categoryName })
      .then((models) => {
        if (!isMounted || !models || models.length === 0) return;
        const mapped: AIModelProfile[] = models.map((m) => ({
          id: m.model_id,
          name: m.name,
          gender: m.gender.toLowerCase() as any,
          ethnicity: m.ethnicity,
          specialty: m.description || "Commercial Fashion",
          avatarUrl: m.thumbnail_url,
          description: m.description,
          tags: m.supported_categories,
          recommendedCategories: [productCategory],
        }));
        setBackendModels(mapped);
      })
      .catch(() => {});

    // Fetch Styles
    productPhotoshootService
      .getStyles({
        category: categoryName,
        useModel: withModel,
        modelId: selectedModelId || undefined,
      })
      .then((styles) => {
        if (!isMounted || !styles || styles.length === 0) return;
        const mapped: PhotographyStyleOption[] = styles.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.requires_model ? "model" : "product_only",
          description: s.description,
          badge: s.lighting || "Studio",
          previewUrl: s.preview_url || "",
          recommendedFor: [productCategory],
        }));
        setBackendStyles(mapped);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [productCategory, withModel, selectedModelId]);

  // Transition Step 1 -> Step 2: Upload images, analyze product, enhance images via backend
  const handleProceedToEnhancement = async () => {
    if (uploadedImages.length === 0) return;
    setErrorMessage(null);
    setStep(2);
    setIsEnhancing(true);

    try {
      let activeSessionId = sessionId;

      // 1. Upload files to backend if any new local files exist
      const filesToUpload = uploadedImages
        .map((img) => img.file)
        .filter((f): f is File => Boolean(f));

      if (filesToUpload.length > 0 || !activeSessionId) {
        const angles = uploadedImages.map((img) => img.angle);
        const uploadRes = await productPhotoshootService.uploadImages({
          files: filesToUpload,
          category: categoryIdToBackendName(productCategory),
          angles,
          sessionId: activeSessionId || undefined,
        });

        if (uploadRes.success) {
          activeSessionId = uploadRes.session_id;
          setSessionId(activeSessionId);
          sessionStorage.setItem(SESSION_STORAGE_KEY, activeSessionId);

          // Update uploaded images with backend image_id and real URLs
          if (uploadRes.uploaded_images && uploadRes.uploaded_images.length > 0) {
            setUploadedImages((prev) =>
              prev.map((img, idx) => {
                const backendImg = uploadRes.uploaded_images[idx];
                return backendImg
                  ? {
                      ...img,
                      backendImageId: backendImg.image_id,
                      url: backendImg.url,
                      previewUrl: backendImg.url,
                    }
                  : img;
              })
            );
          }
        }
      }

      if (!activeSessionId) {
        throw new Error("Failed to initialize photoshoot session with backend.");
      }

      // 2. Run multimodal product analysis
      try {
        const analysisRes = await productPhotoshootService.analyzeProduct({
          sessionId: activeSessionId,
        });

        if (analysisRes.success && analysisRes.analysis) {
          setDetectedAnalysis(analysisRes.analysis);
          if (!productName && analysisRes.analysis.product_type) {
            setProductName(analysisRes.analysis.product_type);
          }
          if (analysisRes.analysis.product_category) {
            const detectedCat = backendNameToCategoryId(analysisRes.analysis.product_category);
            setProductCategory(detectedCat);
          }
          if (!productColor && analysisRes.analysis.main_colors?.length) {
            setProductColor(analysisRes.analysis.main_colors.join(", "));
          }
          if (typeof analysisRes.analysis.suitable_for_model === "boolean") {
            setWithModel(analysisRes.analysis.suitable_for_model);
          }
        }
      } catch (analysisErr) {
        console.warn("Product analysis notice:", analysisErr);
      }

      // 3. Generate enhancement variations via backend
      const enhanceRes = await productPhotoshootService.enhanceImages({
        sessionId: activeSessionId,
        styles: ["Studio Premium", "Luxury Cinematic", "Marketplace White"],
      });

      if (enhanceRes.success && enhanceRes.enhanced_images?.length > 0) {
        const variations: EnhancedVariation[] = enhanceRes.enhanced_images.map((item) => {
          const styleLower = item.style.toLowerCase();
          const mappedStyle: EnhancementStyle = styleLower.includes("luxury")
            ? "luxury_cinematic"
            : styleLower.includes("marketplace")
            ? "marketplace_white"
            : "studio_premium";

          return {
            id: item.image_id,
            sourceImageId: item.source_image_id,
            style: mappedStyle,
            styleName: item.style,
            originalUrl: uploadedImages[0]?.previewUrl || item.url,
            enhancedUrl: item.url,
            description: `Calibrated ${item.style} lighting with crisp edge fidelity and dynamic range.`,
            aspectRatio: "1:1",
          };
        });

        setEnhancedVariations(variations);
        const autoSelected = variations.slice(0, 2).map((v) => v.id);
        setSelectedEnhancedIds(autoSelected);

        // Save selected enhanced images to session
        await productPhotoshootService.selectEnhancedImages({
          sessionId: activeSessionId,
          selectedImageIds: autoSelected,
        });
      }
    } catch (err: any) {
      console.error("Enhancement pipeline error:", err);
      setErrorMessage(err?.response?.data?.detail || err.message || "Failed to enhance images.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Re-run enhancements if user changes style in Step 2
  const handleEnhancementStyleSelect = async (style: EnhancementStyle) => {
    setEnhancementStyle(style);
    if (!sessionId) return;

    const styleInfo = ENHANCEMENT_STYLES.find((s) => s.id === style);
    const styleName = styleInfo?.name || "Studio Premium";

    try {
      setIsEnhancing(true);
      const res = await productPhotoshootService.enhanceImages({
        sessionId,
        styles: [styleName],
      });

      if (res.success && res.enhanced_images?.length > 0) {
        const newVars: EnhancedVariation[] = res.enhanced_images.map((item) => ({
          id: item.image_id,
          sourceImageId: item.source_image_id,
          style,
          styleName: item.style,
          originalUrl: uploadedImages[0]?.previewUrl || item.url,
          enhancedUrl: item.url,
          description: `Calibrated ${item.style} lighting.`,
          aspectRatio: "1:1",
        }));
        setEnhancedVariations(newVars);
        setSelectedEnhancedIds(newVars.map((v) => v.id));
      }
    } catch (e) {
      console.warn("Style enhancement error:", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Toggle Enhanced Variation selection
  const handleVariationToggle = async (id: string) => {
    const updated = selectedEnhancedIds.includes(id)
      ? selectedEnhancedIds.filter((i) => i !== id)
      : [...selectedEnhancedIds, id];

    setSelectedEnhancedIds(updated);

    if (sessionId) {
      try {
        await productPhotoshootService.selectEnhancedImages({
          sessionId,
          selectedImageIds: updated,
        });
      } catch (err) {
        console.warn("Could not sync enhanced selections to backend:", err);
      }
    }
  };

  // Re-roll single enhancement variation
  const handleRegenerateVariation = async (id: string) => {
    setEnhancedVariations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isRegenerating: true } : v))
    );

    try {
      const res = await productPhotoshootService.regenerateImage({ imageId: id });
      if (res.success && res.regenerated_image) {
        setEnhancedVariations((prev) =>
          prev.map((v) =>
            v.id === id
              ? {
                  ...v,
                  enhancedUrl: res.regenerated_image.url,
                  isRegenerating: false,
                }
              : v
          )
        );
      } else {
        setEnhancedVariations((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isRegenerating: false } : v))
        );
      }
    } catch (_) {
      setEnhancedVariations((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isRegenerating: false } : v))
      );
    }
  };

  // Handle Model Mode Toggle (With Model vs. Without Model)
  const handleToggleWithModel = (newWithModel: boolean) => {
    setWithModel(newWithModel);
    if (newWithModel) {
      if (!selectedModelId) {
        setSelectedModelId(backendModels[0]?.id || AI_MODELS[0].id);
      }
      setSelectedStyles(["pose_front_view", "pose_sitting"]);
    } else {
      setSelectedModelId(null);
      setSelectedStyles(["style_clean_hero", "style_luxury_studio"]);
    }
  };

  // Toggle photography style
  const handleStyleToggle = (styleId: string) => {
    setSelectedStyles((prev) => {
      if (prev.includes(styleId)) {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s !== styleId);
      } else {
        return [...prev, styleId];
      }
    });
  };

  // Step 4: Preview synthesized backend prompt
  const handlePreparePrompt = async () => {
    if (!sessionId) return;
    setIsPreparingPrompt(true);
    try {
      const res = await productPhotoshootService.preparePrompt({
        sessionId,
        customPrompt,
        useModel: withModel,
        modelId: selectedModelId || undefined,
        selectedStyles,
      });
      if (res.success && res.prepared_prompt) {
        setPreparedPrompt(res.prepared_prompt);
      }
    } catch (e) {
      console.warn("Prepare prompt notice:", e);
    } finally {
      setIsPreparingPrompt(false);
    }
  };

  // Step 5: Start Batch Photoshoot Generation via Backend
  const handleGenerateFinalPhotoshoot = async () => {
    setErrorMessage(null);
    setStep(5);
    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStage("Initializing neural photoshoot job queue...");

    try {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        throw new Error("Photoshoot session missing. Please start from Step 1.");
      }

      // 1. Submit batch generation request to backend
      const genResponse = await productPhotoshootService.generatePhotoshoot({
        sessionId: activeSessionId,
        selectedEnhancedImageIds: selectedEnhancedIds.length > 0 ? selectedEnhancedIds : undefined,
        productCategory: categoryIdToBackendName(productCategory),
        useModel: withModel,
        modelId: selectedModelId || undefined,
        selectedStyles,
        customPrompt,
        imageCount: 5,
      });

      if (!genResponse.success || !genResponse.job_id) {
        throw new Error(genResponse.message || "Failed to start photoshoot generation.");
      }

      const jobId = genResponse.job_id;
      setGenerationStage("Rendering commercial lighting and camera perspectives...");

      // 2. Poll job status until complete
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }

      pollIntervalRef.current = setInterval(async () => {
        try {
          const statusRes = await productPhotoshootService.getJobStatus(jobId);

          if (statusRes.progress_percent) {
            setGenerationProgress(Math.min(95, statusRes.progress_percent));
          }

          if (statusRes.status === "processing") {
            setGenerationStage(
              `Rendering ${statusRes.completed_images || 0} of ${statusRes.total_images || 5} images...`
            );
          }

          if (statusRes.status === "completed") {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }

            setGenerationProgress(100);
            setGenerationStage("Finalizing ultra-HD catalog imagery...");

            // Fetch session results
            const resultsRes = await productPhotoshootService.getSessionResults(activeSessionId!);
            if (resultsRes.success && resultsRes.results) {
              const mappedResults: PhotoshootFinalResult[] = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${productName || "Product"} — ${r.style_applied}`,
                prompt: customPrompt || `High-fashion commercial photography in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: withModel && selectedModelId ? selectedModelId : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));

              setFinalResults(mappedResults);
              setSelectedResultIds(mappedResults.map((r) => r.id));
            }
            setIsGenerating(false);
          } else if (statusRes.status === "failed") {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setIsGenerating(false);
            setErrorMessage(statusRes.error || "Photoshoot generation failed. Please try again.");
          }
        } catch (pollErr: any) {
          console.warn("Poll job error:", pollErr);
        }
      }, 1400);
    } catch (err: any) {
      console.error("Photoshoot generation error:", err);
      setIsGenerating(false);
      setErrorMessage(
        err?.response?.data?.detail || err.message || "Could not complete photoshoot generation."
      );
    }
  };

  // Re-roll single final image variation via backend
  const handleRegenerateFinalResult = async (id: string) => {
    setFinalResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isRegenerating: true } : r))
    );

    try {
      const res = await productPhotoshootService.regenerateImage({ imageId: id });
      if (res.success && res.regenerated_image) {
        setFinalResults((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  imageUrl: res.regenerated_image.url,
                  isRegenerating: false,
                }
              : r
          )
        );
      } else {
        setFinalResults((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isRegenerating: false } : r))
        );
      }
    } catch (e) {
      console.warn("Regenerate result error:", e);
      setFinalResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isRegenerating: false } : r))
      );
    }
  };

  // Delete single final image variation
  const handleDeleteResult = async (id: string) => {
    setFinalResults((prev) => prev.filter((r) => r.id !== id));
    setSelectedResultIds((prev) => prev.filter((i) => i !== id));

    try {
      await productPhotoshootService.deleteImage(id);
    } catch (e) {
      console.warn("Delete image notice:", e);
    }
  };

  // Download single image asset via secure backend blob proxy
  const handleDownloadSingle = async (item: PhotoshootFinalResult) => {
    const filename = `${(productName || "product").toLowerCase().replace(/[^a-z0-9]/g, "-")}-${item.styleName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.jpg`;
    try {
      await productPhotoshootService.downloadImageBlob(item.id, filename);
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

  // Download entire session ZIP archive from backend
  const handleDownloadZip = async () => {
    if (!sessionId) return;
    try {
      await productPhotoshootService.downloadSessionZip(sessionId);
    } catch (e) {
      console.error("ZIP download failed:", e);
    }
  };

  // Save to My Gallery via backend
  const handleSaveToGallery = async () => {
    if (!sessionId || selectedResultIds.length === 0) return;
    try {
      await productPhotoshootService.saveSelectedImages({
        sessionId,
        imageIds: selectedResultIds,
      });
      // Mark as saved in local state
      setFinalResults((prev) =>
        prev.map((r) => (selectedResultIds.includes(r.id) ? { ...r, isSaved: true } : r))
      );
    } catch (e) {
      console.warn("Could not save images to backend gallery:", e);
    }
  };

  // Reset Studio session completely
  const handleStartNewPhotoshoot = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    setSessionId(null);
    setStep(1);
    setUploadedImages([]);
    setEnhancedVariations([]);
    setSelectedEnhancedIds([]);
    setFinalResults([]);
    setSelectedResultIds([]);
    setDetectedAnalysis(null);
    setPreparedPrompt("");
    setErrorMessage(null);
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
                  handleStartNewPhotoshoot();
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

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

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
          detectedAnalysis={detectedAnalysis}
          productCategory={productCategory}
          onCategoryChange={(cat) => setProductCategory(cat)}
          onStyleSelect={handleEnhancementStyleSelect}
          onVariationToggle={handleVariationToggle}
          onRegenerateVariation={handleRegenerateVariation}
          onRegenerateAll={() => handleProceedToEnhancement()}
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
          customModels={backendModels.length > 0 ? backendModels : undefined}
          customStyles={backendStyles.length > 0 ? backendStyles : undefined}
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
          preparedPrompt={preparedPrompt}
          isPreparingPrompt={isPreparingPrompt}
          onPreparePrompt={handlePreparePrompt}
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
          onDeleteResult={handleDeleteResult}
          onRegenerateResult={handleRegenerateFinalResult}
          onSaveToGallery={handleSaveToGallery}
          onDownloadSelected={handleDownloadSelected}
          onDownloadSingle={handleDownloadSingle}
          onDownloadZip={handleDownloadZip}
          onStartNewPhotoshoot={handleStartNewPhotoshoot}
          onBackToEdit={() => setStep(4)}
        />
      )}
    </div>
  );
}
