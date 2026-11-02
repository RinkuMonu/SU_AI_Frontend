"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Camera, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  FolderOpen, 
  UserCheck, 
  Box, 
  ShieldCheck,
  Zap,
  ArrowRight
} from "lucide-react";
import { PhotoshootStepper } from "@/components/photoshoot/PhotoshootStepper";
import { Step1Upload } from "@/components/photoshoot/Step1Upload";
import { Step2Enhance } from "@/components/photoshoot/Step2Enhance";
import { Step3StyleAndModel } from "@/components/photoshoot/Step3StyleAndModel";
import { Step4PromptAndVoice } from "@/components/photoshoot/Step4PromptAndVoice";
import { Step5Results } from "@/components/photoshoot/Step5Results";
import { PhotoshootGalleryView } from "@/components/photoshoot/PhotoshootGalleryView";
import { 
  AIModelProfile,
  EnhancedVariation, 
  EnhancementStyle, 
  PhotographyStyleOption,
  PhotoshootFinalResult, 
  PhotoshootUploadedImage, 
  ProductCategory,
  PhotoshootTabMode
} from "@/components/photoshoot/types";
import { 
  AI_MODELS, 
  ENHANCEMENT_STYLES, 
  MODEL_POSES_CLOTHING, 
  MODEL_POSES_JEWELLERY, 
  PRODUCT_ONLY_STYLES,
  categoryIdToBackendName,
  backendNameToCategoryId
} from "@/components/photoshoot/data";
import { 
  productPhotoshootService,
  BackendProductAnalysisData
} from "@/services/productPhotoshoot.service";

const ACTIVE_TAB_KEY = "dhandagrow_photoshoot_active_tab";
const AVATAR_SESSION_KEY = "dhandagrow_photoshoot_avatar_session_id";
const PRODUCT_SESSION_KEY = "dhandagrow_photoshoot_product_session_id";
const AVATAR_CACHE_KEY = "dhandagrow_photoshoot_avatar_form_cache";
const PRODUCT_CACHE_KEY = "dhandagrow_photoshoot_product_form_cache";

interface StudioState {
  step: 1 | 2 | 3 | 4 | 5;
  highestStepReached: number;
  sessionId: string | null;
  uploadedImages: PhotoshootUploadedImage[];
  productCategory: ProductCategory;
  productName: string;
  productColor: string;
  detectedAnalysis: BackendProductAnalysisData | null;
  enhancementStyle: EnhancementStyle;
  enhancedVariations: EnhancedVariation[];
  selectedEnhancedIds: string[];
  isEnhancing: boolean;
  selectedModelId: string | null;
  selectedStyles: string[];
  customPrompt: string;
  preparedPrompt: string;
  isPreparingPrompt: boolean;
  isGenerating: boolean;
  generationProgress: number;
  generationStage: string;
  finalResults: PhotoshootFinalResult[];
  selectedResultIds: string[];
  errorMessage: string | null;
  activeJobId: string | null;
  canRetryJob: boolean;
  isRetryingJob: boolean;
  partialNotice: string | null;
}

function createInitialState(mode: PhotoshootTabMode): StudioState {
  if (mode === "avatar") {
    return {
      step: 1,
      highestStepReached: 1,
      sessionId: null,
      uploadedImages: [],
      productCategory: "womens_clothing",
      productName: "",
      productColor: "",
      detectedAnalysis: null,
      enhancementStyle: "studio_premium",
      enhancedVariations: [],
      selectedEnhancedIds: [],
      isEnhancing: false,
      selectedModelId: "model_f_01", // Default model selected for convenience
      selectedStyles: ["pose_front_view", "pose_sitting"],
      customPrompt: "",
      preparedPrompt: "",
      isPreparingPrompt: false,
      isGenerating: false,
      generationProgress: 0,
      generationStage: "",
      finalResults: [],
      selectedResultIds: [],
      errorMessage: null,
      activeJobId: null,
      canRetryJob: false,
      isRetryingJob: false,
      partialNotice: null,
    };
  }

  return {
    step: 1,
    highestStepReached: 1,
    sessionId: null,
    uploadedImages: [],
    productCategory: "beauty_cosmetics",
    productName: "",
    productColor: "",
    detectedAnalysis: null,
    enhancementStyle: "studio_premium",
    enhancedVariations: [],
    selectedEnhancedIds: [],
    isEnhancing: false,
    selectedModelId: null, // Always null for product photography mode
    selectedStyles: ["style_studio_premium", "style_luxury_cinematic"],
    customPrompt: "",
    preparedPrompt: "",
    isPreparingPrompt: false,
    isGenerating: false,
    generationProgress: 0,
    generationStage: "",
    finalResults: [],
    selectedResultIds: [],
    errorMessage: null,
    activeJobId: null,
    canRetryJob: false,
    isRetryingJob: false,
    partialNotice: null,
  };
}

interface PhotoshootWorkflowContainerProps {
  mode: PhotoshootTabMode;
}

export const PhotoshootWorkflowContainer: React.FC<PhotoshootWorkflowContainerProps> = ({ mode }) => {
  const router = useRouter();
  const isAvatarMode = mode === "avatar";

  // Mode-specific storage keys
  const cacheKey = isAvatarMode ? AVATAR_CACHE_KEY : PRODUCT_CACHE_KEY;
  const sessionKey = isAvatarMode ? AVATAR_SESSION_KEY : PRODUCT_SESSION_KEY;

  // View state: Studio (5-step workflow) vs Gallery (saved & past shoots)
  const [activeView, setActiveView] = useState<"studio" | "gallery">("studio");

  // Studio Workflow State
  const [state, setState] = useState<StudioState>(() => createInitialState(mode));

  // Dynamic models & styles fetched from backend
  const [backendModels, setBackendModels] = useState<AIModelProfile[]>([]);
  const [backendStyles, setBackendStyles] = useState<PhotographyStyleOption[]>([]);

  // Generation polling ref & submission guard
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingGenRef = useRef(false);

  // Clear polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Update state helper with highestStepReached tracking
  const updateState = useCallback(
    (updater: Partial<StudioState> | ((prev: StudioState) => Partial<StudioState>)) => {
      setState((prev) => {
        const partial = typeof updater === "function" ? updater(prev) : updater;
        const next = { ...prev, ...partial };
        if (next.step > next.highestStepReached) {
          next.highestStepReached = next.step;
        }
        return next;
      });
    },
    []
  );

  // Save active tab preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ACTIVE_TAB_KEY, mode);
  }, [mode]);

  // Restore State from sessionStorage and query parameters on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Check URL query parameters for session_id (e.g. from gallery navigation)
      const urlParams = new URLSearchParams(window.location.search);
      const querySessionId = urlParams.get("session_id");

      const cached = sessionStorage.getItem(cacheKey);
      let partialData: Partial<StudioState> = {};
      if (cached) {
        const parsed = JSON.parse(cached);
        partialData = {
          step: parsed.step || 1,
          highestStepReached: parsed.highestStepReached || parsed.step || 1,
          productCategory: parsed.productCategory,
          productName: parsed.productName,
          productColor: parsed.productColor,
          enhancementStyle: parsed.enhancementStyle || "studio_premium",
          selectedModelId: isAvatarMode ? (parsed.selectedModelId || "model_f_01") : null,
          selectedStyles: parsed.selectedStyles || [],
          customPrompt: parsed.customPrompt || "",
          uploadedImages: parsed.uploadedImages || [],
          enhancedVariations: parsed.enhancedVariations || [],
          selectedEnhancedIds: parsed.selectedEnhancedIds || [],
          detectedAnalysis: parsed.detectedAnalysis || null,
        };
      }

      const activeSessionId = querySessionId || sessionStorage.getItem(sessionKey);
      if (activeSessionId) {
        partialData.sessionId = activeSessionId;
        productPhotoshootService
          .getSessionResults(activeSessionId)
          .then((res) => {
            if (res?.success && res.results && res.results.length > 0) {
              const mapped: PhotoshootFinalResult[] = res.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `Commercial Photoshoot — ${r.style_applied}`,
                prompt: `Photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
              setState((prev) => ({
                ...prev,
                errorMessage: null,
                finalResults: mapped,
                selectedResultIds: mapped.map((m) => m.id),
                step: 5,
                highestStepReached: 5,
              }));
            }
          })
          .catch(() => {});
      }

      if (Object.keys(partialData).length > 0) {
        setState((prev) => ({ ...prev, ...partialData }));
      }
    } catch (_) {}
  }, [cacheKey, sessionKey, isAvatarMode]);

  // Persist State to sessionStorage on changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const serializableImages = state.uploadedImages.map((img) => ({
        id: img.id,
        name: img.name,
        size: img.size,
        url: img.url,
        previewUrl: img.previewUrl,
        angle: img.angle,
        uploadedAt: img.uploadedAt,
        backendImageId: img.backendImageId,
      }));

      const stateToCache = {
        sessionId: state.sessionId,
        step: state.step,
        highestStepReached: state.highestStepReached,
        productCategory: state.productCategory,
        productName: state.productName,
        productColor: state.productColor,
        enhancementStyle: state.enhancementStyle,
        selectedModelId: isAvatarMode ? state.selectedModelId : null,
        selectedStyles: state.selectedStyles,
        customPrompt: state.customPrompt,
        uploadedImages: serializableImages,
        enhancedVariations: state.enhancedVariations,
        selectedEnhancedIds: state.selectedEnhancedIds,
        detectedAnalysis: state.detectedAnalysis,
      };

      sessionStorage.setItem(cacheKey, JSON.stringify(stateToCache));
      if (state.sessionId) {
        sessionStorage.setItem(sessionKey, state.sessionId);
      }
    } catch (_) {}
  }, [state, cacheKey, sessionKey, isAvatarMode]);

  // Fetch dynamic models and styles from backend when category changes
  useEffect(() => {
    let isMounted = true;
    const categoryName = categoryIdToBackendName(state.productCategory);

    // Fetch Models (only relevant for Avatar mode)
    if (isAvatarMode) {
      productPhotoshootService
        .getModels({ category: categoryName })
        .then((models) => {
          if (!isMounted || !models || models.length === 0) return;
          const mapped: AIModelProfile[] = models.map((m) => {
            const matchedStatic = AI_MODELS.find(
              (sm) => sm.id === m.model_id || sm.name.toLowerCase() === m.name.toLowerCase()
            );
            return {
              id: m.model_id,
              name: m.name,
              gender: m.gender.toLowerCase() as any,
              ethnicity: m.ethnicity,
              specialty: m.description || "Commercial Fashion",
              avatarUrl: m.thumbnail_url || matchedStatic?.avatarUrl || "",
              description: m.description,
              tags: m.supported_categories,
              recommendedCategories: [state.productCategory],
            };
          });
          setBackendModels(mapped);
        })
        .catch(() => {});
    }

    // Fetch Styles
    productPhotoshootService
      .getStyles({
        category: categoryName,
        useModel: isAvatarMode,
        modelId: isAvatarMode ? (state.selectedModelId || undefined) : undefined,
        workflowMode: isAvatarMode ? "avatar_photoshoot" : "product_photography",
      })
      .then((styles) => {
        if (!isMounted || !styles || styles.length === 0) return;
        const allStaticStyles = isAvatarMode
          ? [...MODEL_POSES_CLOTHING, ...MODEL_POSES_JEWELLERY]
          : PRODUCT_ONLY_STYLES;

        const mapped: PhotographyStyleOption[] = styles.map((s) => {
          const matchedStatic = allStaticStyles.find(
            (staticS) => staticS.id === s.id || staticS.name.toLowerCase() === s.name.toLowerCase()
          );
          return {
            id: s.id,
            name: s.name,
            category: s.requires_model ? "model" : "product_only",
            description: s.description,
            badge: s.lighting || "Studio",
            previewUrl: s.preview_url || matchedStatic?.previewUrl || "",
            recommendedFor: [state.productCategory],
          };
        });
        setBackendStyles(mapped);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [mode, isAvatarMode, state.productCategory, state.selectedModelId]);

  // Transition Step 1 -> Step 2: Upload images, analyze product, enhance images
  const handleProceedToEnhancement = async () => {
    if (state.uploadedImages.length === 0) return;

    updateState({
      errorMessage: null,
      step: 2,
      isEnhancing: true,
    });

    try {
      let activeSessionId = state.sessionId;

      // 1. Upload files to backend if any new local files exist
      const filesToUpload = state.uploadedImages
        .map((img) => img.file)
        .filter((f): f is File => Boolean(f));

      if (filesToUpload.length > 0 || !activeSessionId) {
        const angles = state.uploadedImages.map((img) => img.angle);
        const uploadRes = await productPhotoshootService.uploadImages({
          files: filesToUpload,
          category: categoryIdToBackendName(state.productCategory),
          angles,
          sessionId: activeSessionId || undefined,
        });

        if (uploadRes.success) {
          activeSessionId = uploadRes.session_id;
          sessionStorage.setItem(sessionKey, activeSessionId);

          if (uploadRes.uploaded_images && uploadRes.uploaded_images.length > 0) {
            const updatedImages = state.uploadedImages.map((img, idx) => {
              const backendImg = uploadRes.uploaded_images[idx];
              return backendImg
                ? {
                    ...img,
                    backendImageId: backendImg.image_id,
                    url: backendImg.url,
                    previewUrl: backendImg.url,
                  }
                : img;
            });
            updateState({
              sessionId: activeSessionId,
              uploadedImages: updatedImages,
            });
          } else {
            updateState({ sessionId: activeSessionId });
          }
        }
      }

      if (!activeSessionId) {
        throw new Error("Failed to initialize photoshoot session with backend.");
      }

      // 2. Multimodal product inspection
      try {
        const analysisRes = await productPhotoshootService.analyzeProduct({
          sessionId: activeSessionId,
        });

        if (analysisRes.success && analysisRes.analysis) {
          const updates: Partial<StudioState> = {
            detectedAnalysis: analysisRes.analysis,
          };
          if (!state.productName && analysisRes.analysis.product_type) {
            updates.productName = analysisRes.analysis.product_type;
          }
          if (analysisRes.analysis.product_category) {
            const detectedCat = backendNameToCategoryId(analysisRes.analysis.product_category);
            updates.productCategory = detectedCat;
          }
          if (!state.productColor && analysisRes.analysis.main_colors?.length) {
            updates.productColor = analysisRes.analysis.main_colors.join(", ");
          }
          updateState(updates);
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
            originalUrl: state.uploadedImages[0]?.previewUrl || item.url,
            enhancedUrl: item.url,
            description: `Calibrated ${item.style} lighting with crisp edge fidelity.`,
            aspectRatio: "1:1",
          };
        });

        const autoSelected = variations.slice(0, 2).map((v) => v.id);
        updateState({
          enhancedVariations: variations,
          selectedEnhancedIds: autoSelected,
          isEnhancing: false,
        });

        await productPhotoshootService.selectEnhancedImages({
          sessionId: activeSessionId,
          selectedImageIds: autoSelected,
        });
      } else {
        updateState({ isEnhancing: false });
      }
    } catch (err: any) {
      console.error("Enhancement error:", err);
      const detail = err?.response?.data?.detail;
      const isNet = err?.message?.toLowerCase()?.includes("network error") || err?.code === "ERR_NETWORK";
      updateState({
        isEnhancing: false,
        errorMessage:
          detail ||
          (isNet
            ? "Connection interrupted while preparing enhancement. Please retry."
            : err?.message || "Failed to enhance images."),
      });
    }
  };

  // Re-run enhancements if user changes style in Step 2
  const handleEnhancementStyleSelect = async (style: EnhancementStyle) => {
    updateState({ enhancementStyle: style });
    if (!state.sessionId) return;

    const styleInfo = ENHANCEMENT_STYLES.find((s) => s.id === style);
    const styleName = styleInfo?.name || "Studio Premium";

    try {
      updateState({ isEnhancing: true });
      const res = await productPhotoshootService.enhanceImages({
        sessionId: state.sessionId,
        styles: [styleName],
      });

      if (res.success && res.enhanced_images?.length > 0) {
        const newVars: EnhancedVariation[] = res.enhanced_images.map((item) => ({
          id: item.image_id,
          sourceImageId: item.source_image_id,
          style,
          styleName: item.style,
          originalUrl: state.uploadedImages[0]?.previewUrl || item.url,
          enhancedUrl: item.url,
          description: `Calibrated ${item.style} lighting.`,
          aspectRatio: "1:1",
        }));
        updateState({
          enhancedVariations: newVars,
          selectedEnhancedIds: newVars.map((v) => v.id),
          isEnhancing: false,
        });
      } else {
        updateState({ isEnhancing: false });
      }
    } catch (e) {
      updateState({ isEnhancing: false });
    }
  };

  // Toggle Enhanced Variation selection
  const handleVariationToggle = async (id: string) => {
    const updated = state.selectedEnhancedIds.includes(id)
      ? state.selectedEnhancedIds.filter((i) => i !== id)
      : [...state.selectedEnhancedIds, id];

    updateState({ selectedEnhancedIds: updated });

    if (state.sessionId) {
      try {
        await productPhotoshootService.selectEnhancedImages({
          sessionId: state.sessionId,
          selectedImageIds: updated,
        });
      } catch (err) {
        console.warn("Could not sync enhanced selections:", err);
      }
    }
  };

  // Re-roll single enhancement variation
  const handleRegenerateVariation = async (id: string) => {
    updateState((prev) => ({
      enhancedVariations: prev.enhancedVariations.map((v) =>
        v.id === id ? { ...v, isRegenerating: true } : v
      ),
    }));

    try {
      const res = await productPhotoshootService.regenerateImage({ imageId: id });
      if (res.success && res.regenerated_image) {
        updateState((prev) => ({
          enhancedVariations: prev.enhancedVariations.map((v) =>
            v.id === id
              ? {
                  ...v,
                  enhancedUrl: res.regenerated_image.url,
                  isRegenerating: false,
                }
              : v
          ),
        }));
      } else {
        updateState((prev) => ({
          enhancedVariations: prev.enhancedVariations.map((v) =>
            v.id === id ? { ...v, isRegenerating: false } : v
          ),
        }));
      }
    } catch (_) {
      updateState((prev) => ({
        enhancedVariations: prev.enhancedVariations.map((v) =>
          v.id === id ? { ...v, isRegenerating: false } : v
        ),
      }));
    }
  };

  // Toggle photography style / pose
  const handleStyleToggle = (styleId: string) => {
    updateState((prev) => {
      const exists = prev.selectedStyles.includes(styleId);
      if (exists) {
        if (prev.selectedStyles.length === 1) return prev;
        return {
          selectedStyles: prev.selectedStyles.filter((s) => s !== styleId),
        };
      } else {
        return {
          selectedStyles: [...prev.selectedStyles, styleId],
        };
      }
    });
  };

  // Step 4: Preview synthesized backend prompt
  const handlePreparePrompt = async () => {
    if (!state.sessionId) return;

    updateState({ isPreparingPrompt: true });
    try {
      const res = await productPhotoshootService.preparePrompt({
        sessionId: state.sessionId,
        customPrompt: state.customPrompt,
        useModel: isAvatarMode,
        modelId: isAvatarMode ? (state.selectedModelId || undefined) : undefined,
        workflowMode: isAvatarMode ? "avatar_photoshoot" : "product_photography",
        selectedStyles: state.selectedStyles,
      });
      if (res.success && res.prepared_prompt) {
        updateState({ preparedPrompt: res.prepared_prompt });
      }
    } catch (e) {
      console.warn("Prepare prompt notice:", e);
    } finally {
      updateState({ isPreparingPrompt: false });
    }
  };

  // Step 5: Start Batch Photoshoot Generation
  const handleGenerateFinalPhotoshoot = async () => {
    if (isSubmittingGenRef.current) return;
    isSubmittingGenRef.current = true;

    // Avatar mode validation: mandatory model
    if (isAvatarMode && !state.selectedModelId) {
      isSubmittingGenRef.current = false;
      updateState({
        errorMessage: "Model selection is mandatory for AI Avatar Photoshoot. Please select a model in Step 3.",
      });
      return;
    }

    if (!state.sessionId) {
      isSubmittingGenRef.current = false;
      updateState({
        errorMessage: "Photoshoot session missing. Please upload images in Step 1.",
      });
      return;
    }

    updateState({
      errorMessage: null,
      step: 5,
      isGenerating: true,
      generationProgress: 12,
      generationStage: isAvatarMode
        ? "Initializing AI avatar draping & lighting pipeline..."
        : "Initializing commercial studio product lighting...",
    });

    try {
      const preferredVar =
        state.enhancedVariations.find((v) => state.selectedEnhancedIds.includes(v.id)) ||
        state.enhancedVariations[0];
      const targetEnhancedIds =
        state.selectedEnhancedIds.length > 0
          ? state.selectedEnhancedIds
          : preferredVar
          ? [preferredVar.id]
          : undefined;

      const genResponse = await productPhotoshootService.generatePhotoshoot({
        sessionId: state.sessionId,
        selectedEnhancedImageIds: targetEnhancedIds,
        productCategory: categoryIdToBackendName(state.productCategory),
        useModel: isAvatarMode,
        modelId: isAvatarMode ? (state.selectedModelId || undefined) : undefined,
        workflowMode: isAvatarMode ? "avatar_photoshoot" : "product_photography",
        selectedStyles: state.selectedStyles,
        customPrompt: state.customPrompt,
        imageCount: 5,
      });

      if (!genResponse.success || !genResponse.job_id) {
        throw new Error(genResponse.message || "Failed to start photoshoot generation.");
      }

      const jobId = genResponse.job_id;
      updateState({
        activeJobId: jobId,
        generationStage: isAvatarMode
          ? "Synthesizing high-fashion model poses and apparel realism..."
          : "Rendering studio reflections and camera perspectives...",
      });

      if (pollRef.current) clearInterval(pollRef.current);

      let pollAttempts = 0;
      pollRef.current = setInterval(async () => {
        pollAttempts++;
        try {
          const statusRes = await productPhotoshootService.getJobStatus(jobId);

          if (statusRes.progress_percent) {
            updateState({
              generationProgress: Math.min(95, statusRes.progress_percent),
            });
          }

          if (statusRes.status === "processing") {
            updateState({
              generationStage: `Rendering variation ${statusRes.completed_images || 0} of ${statusRes.total_images || 5}...`,
            });
          }

          if (statusRes.status === "completed" || statusRes.status === "partial") {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }

            const resultsRes = await productPhotoshootService.getSessionResults(state.sessionId!);
            let mappedResults: PhotoshootFinalResult[] = [];
            if (resultsRes.success && resultsRes.results && resultsRes.results.length > 0) {
              mappedResults = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${state.productName || "Product"} — ${r.style_applied}`,
                prompt: state.customPrompt || `Commercial photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: isAvatarMode && state.selectedModelId ? state.selectedModelId : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
            } else if (statusRes.result_images && statusRes.result_images.length > 0) {
              mappedResults = statusRes.result_images.map((r: any) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${state.productName || "Product"} — ${r.style_applied}`,
                prompt: state.customPrompt || `Commercial photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: isAvatarMode && state.selectedModelId ? state.selectedModelId : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved || false,
                createdAt: r.created_at,
              }));
            }

            updateState({
              generationProgress: 100,
              generationStage: "Photoshoot complete!",
              isGenerating: false,
              errorMessage: null,
              finalResults: mappedResults,
              selectedResultIds: mappedResults.map((r) => r.id),
              partialNotice:
                statusRes.status === "partial"
                  ? `${statusRes.completed_images || 0} of ${statusRes.total_images || 5} variations generated.`
                  : null,
              canRetryJob: Boolean(statusRes.can_retry),
            });
            isSubmittingGenRef.current = false;
          } else if (statusRes.status === "failed") {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            let fallbackResults: PhotoshootFinalResult[] = [];
            if (statusRes.result_images && statusRes.result_images.length > 0) {
              fallbackResults = statusRes.result_images.map((r: any) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${state.productName || "Product"} — ${r.style_applied}`,
                prompt: state.customPrompt || `Commercial photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: isAvatarMode && state.selectedModelId ? state.selectedModelId : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved || false,
                createdAt: r.created_at,
              }));
            } else {
              try {
                const res = await productPhotoshootService.getSessionResults(state.sessionId!);
                if (res?.success && res.results && res.results.length > 0) {
                  fallbackResults = res.results.map((r) => ({
                    id: r.image_id,
                    imageUrl: r.url,
                    title: `${state.productName || "Product"} — ${r.style_applied}`,
                    prompt: state.customPrompt || `Commercial photoshoot in ${r.style_applied}`,
                    styleName: r.style_applied,
                    modelUsed: isAvatarMode && state.selectedModelId ? state.selectedModelId : undefined,
                    resolution: "4K Ultra-HD",
                    selected: true,
                    isSaved: r.is_saved,
                    createdAt: r.created_at,
                  }));
                }
              } catch (_) {}
            }

            if (fallbackResults.length > 0) {
              updateState({
                generationProgress: 100,
                generationStage: "Photoshoot complete!",
                isGenerating: false,
                errorMessage: null,
                finalResults: fallbackResults,
                selectedResultIds: fallbackResults.map((r) => r.id),
              });
            } else {
              updateState({
                isGenerating: false,
                canRetryJob: Boolean(statusRes.can_retry),
                errorMessage: statusRes.error || "Photoshoot generation failed. Please try again.",
              });
            }
            isSubmittingGenRef.current = false;
          } else if (pollAttempts > 65) {
            if (pollRef.current) {
              clearInterval(pollRef.current);
              pollRef.current = null;
            }
            isSubmittingGenRef.current = false;
            const resultsRes = await productPhotoshootService.getSessionResults(state.sessionId!);
            if (resultsRes.success && resultsRes.results?.length) {
              const mapped = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${state.productName || "Product"} — ${r.style_applied}`,
                prompt: state.customPrompt || `Photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: isAvatarMode ? state.selectedModelId || undefined : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
              updateState({
                isGenerating: false,
                errorMessage: null,
                finalResults: mapped,
                selectedResultIds: mapped.map((r) => r.id),
                partialNotice: "Rendering took slightly longer; available variations are loaded.",
              });
            } else {
              updateState({
                isGenerating: false,
                errorMessage: "Photoshoot rendering timed out. Please check your gallery in a moment.",
              });
            }
          }
        } catch (pollErr) {
          console.warn("Poll job error:", pollErr);
        }
      }, 1400);
    } catch (err: any) {
      isSubmittingGenRef.current = false;
      const detail = err?.response?.data?.detail;
      const rawMsg = err?.message || "";
      const isNet = rawMsg.toLowerCase().includes("network error") || err?.code === "ERR_NETWORK";
      const userMsg =
        detail ||
        (isNet
          ? "Connection temporarily interrupted. The server is processing in background; please refresh or check results."
          : rawMsg) ||
        "Photoshoot generation could not complete.";
      updateState((prev) => ({
        isGenerating: false,
        errorMessage: prev.finalResults.length > 0 ? null : userMsg,
      }));
    }
  };

  // Retry failed images
  const handleRetryFailedJob = async () => {
    if (!state.activeJobId || state.isRetryingJob) return;

    updateState({
      isRetryingJob: true,
      errorMessage: null,
      partialNotice: "Retrying failed variations in background...",
    });

    try {
      const res = await productPhotoshootService.retryFailedJob(state.activeJobId);
      if (res.success && res.retrying_count > 0) {
        updateState({ isGenerating: true });
        setTimeout(async () => {
          if (state.sessionId) {
            const resultsRes = await productPhotoshootService.getSessionResults(state.sessionId);
            if (resultsRes.success && resultsRes.results) {
              const mapped = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${state.productName || "Product"} — ${r.style_applied}`,
                prompt: state.customPrompt || `Photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
              updateState({
                finalResults: mapped,
                selectedResultIds: mapped.map((r) => r.id),
                isGenerating: false,
                isRetryingJob: false,
                partialNotice: "Retry completed. Available variations updated.",
              });
            }
          }
        }, 6000);
      } else {
        updateState({
          isRetryingJob: false,
          partialNotice: res.message || "No variations available to retry.",
        });
      }
    } catch (e: any) {
      updateState({
        isRetryingJob: false,
        errorMessage: e?.response?.data?.detail || "Could not retry failed variations.",
      });
    }
  };

  // Re-roll single final image variation
  const handleRegenerateFinalResult = async (id: string) => {
    updateState((prev) => ({
      finalResults: prev.finalResults.map((r) =>
        r.id === id ? { ...r, isRegenerating: true, isFailed: false } : r
      ),
    }));

    try {
      const res = await productPhotoshootService.regenerateImage({ imageId: id });
      if (res.success && res.regenerated_image) {
        updateState((prev) => ({
          finalResults: prev.finalResults.map((r) =>
            r.id === id
              ? {
                  ...r,
                  id: res.regenerated_image.image_id,
                  imageUrl: res.regenerated_image.url,
                  isRegenerating: false,
                  isFailed: false,
                }
              : r
          ),
        }));
      } else {
        updateState((prev) => ({
          finalResults: prev.finalResults.map((r) =>
            r.id === id ? { ...r, isRegenerating: false, isFailed: true } : r
          ),
        }));
      }
    } catch (e) {
      updateState((prev) => ({
        finalResults: prev.finalResults.map((r) =>
          r.id === id ? { ...r, isRegenerating: false, isFailed: true } : r
        ),
      }));
    }
  };

  // Delete single final image variation
  const handleDeleteResult = async (id: string) => {
    try {
      await productPhotoshootService.deleteImage(id);
    } catch (e) {
      console.warn("Delete image error:", e);
    }
    updateState((prev) => ({
      finalResults: prev.finalResults.filter((r) => r.id !== id),
      selectedResultIds: prev.selectedResultIds.filter((i) => i !== id),
    }));
  };

  // Save selected final photoshoot images to permanent library
  const handleSaveToGallery = async () => {
    if (!state.sessionId || state.selectedResultIds.length === 0) return;
    try {
      await productPhotoshootService.saveSelectedImages({
        sessionId: state.sessionId,
        imageIds: state.selectedResultIds,
      });
      updateState((prev) => ({
        finalResults: prev.finalResults.map((r) =>
          prev.selectedResultIds.includes(r.id) ? { ...r, isSaved: true } : r
        ),
      }));
    } catch (e) {
      console.warn("Save images notice:", e);
    }
  };

  // Downloads
  const handleDownloadSingle = async (item: PhotoshootFinalResult) => {
    try {
      await productPhotoshootService.downloadImageBlob(
        item.id,
        `${(state.productName || "photoshoot").toLowerCase().replace(/\s+/g, "_")}_${item.id}.jpg`
      );
    } catch (_) {
      window.open(item.imageUrl, "_blank");
    }
  };

  const handleDownloadSelected = async () => {
    const toDownload = state.finalResults.filter((r) =>
      state.selectedResultIds.includes(r.id)
    );
    for (const item of toDownload) {
      await handleDownloadSingle(item);
    }
  };

  const handleDownloadZip = async () => {
    if (!state.sessionId) return;
    try {
      await productPhotoshootService.downloadSessionZip(state.sessionId);
    } catch (e) {
      console.warn("Download zip error:", e);
    }
  };

  // Reset Studio for current mode only
  const handleResetCurrentStudio = () => {
    sessionStorage.removeItem(cacheKey);
    sessionStorage.removeItem(sessionKey);
    setState(createInitialState(mode));
  };

  const canNavigateToStep = (targetStep: 1 | 2 | 3 | 4 | 5): boolean => {
    if (targetStep === state.step) return true;
    if (targetStep <= state.highestStepReached) return true;
    if (targetStep === 2) return state.uploadedImages.length > 0;
    if (targetStep === 3) return state.enhancedVariations.length > 0;
    if (targetStep === 4) {
      return isAvatarMode
        ? Boolean(state.selectedModelId) && state.selectedStyles.length > 0
        : state.selectedStyles.length > 0;
    }
    if (targetStep === 5) return state.finalResults.length > 0;
    return false;
  };

  return (
    <div className="space-y-5 pb-16 max-w-7xl mx-auto px-3 sm:px-6">
      {/* Top Header Row with Navigation & Reset - Option 3 Visual Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-tr from-[#A855F7] to-[#EC4899] shadow-lg shadow-brand-purple/30 shrink-0">
              {isAvatarMode ? <UserCheck className="w-4 h-4" /> : <Box className="w-4 h-4" />}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAvatarMode ? "AI Avatar Photoshoot" : "AI Product Photography"}
            </h1>

            <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-[#2D164D] text-[#E085FF] border border-[#A855F7]/40 shadow-sm">
              {isAvatarMode ? "AVATAR STUDIO" : "PRODUCT STUDIO"}
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-text-muted">
            {isAvatarMode
              ? "Create studio-quality model photoshoots showcasing your apparel and jewelry with diverse AI fashion models."
              : "Create professional, high-converting product photos for your products using AI."}
          </p>
        </div>

        {/* Action Buttons: View Gallery & Reset Studio */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveView(activeView === "gallery" ? "studio" : "gallery")}
            className={`px-4 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              activeView === "gallery"
                ? "bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white border-transparent"
                : "bg-[#0F1735] hover:bg-[#152047] border-white/10 text-white"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{activeView === "gallery" ? "Back to Studio" : "My Gallery"}</span>
          </button>

          {activeView === "studio" && (
            <button
              type="button"
              onClick={handleResetCurrentStudio}
              className="px-4 py-2 rounded-xl bg-[#0F1735] hover:bg-[#152047] border border-white/10 text-white text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              title="Reset current studio workflow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Error Banner */}
      {state.errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{state.errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => updateState({ errorMessage: null })}
            className="text-rose-400 hover:text-white font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* VIEW A: Photoshoot Gallery View */}
      {activeView === "gallery" && (
        <PhotoshootGalleryView
          onOpenSession={async (sessId) => {
            try {
              const res = await productPhotoshootService.getSessionResults(sessId);
              if (res?.success && res.results?.length > 0) {
                const isSessionAvatar = Boolean(res.use_model);

                // If session matches this page's mode, load results directly
                if (isSessionAvatar === isAvatarMode) {
                  const mapped: PhotoshootFinalResult[] = res.results.map((r) => ({
                    id: r.image_id,
                    imageUrl: r.url,
                    title: `Photoshoot — ${r.style_applied}`,
                    prompt: `Commercial photoshoot in ${r.style_applied}`,
                    styleName: r.style_applied,
                    resolution: "4K Ultra-HD",
                    selected: true,
                    isSaved: r.is_saved,
                    createdAt: r.created_at,
                  }));
                  setState((prev) => ({
                    ...prev,
                    sessionId: sessId,
                    finalResults: mapped,
                    selectedResultIds: mapped.map((m) => m.id),
                    step: 5,
                    highestStepReached: 5,
                  }));
                  setActiveView("studio");
                } else {
                  // Session belongs to the other mode: navigate to its dedicated page
                  const targetRoute = isSessionAvatar ? "/ai-photoshoot/avatar" : "/ai-photoshoot/product";
                  router.push(`${targetRoute}?session_id=${sessId}`);
                }
              }
            } catch (e) {
              console.warn("Could not load session results:", e);
            }
          }}
          onReuseProduct={async (sessId) => {
            try {
              const res = await productPhotoshootService.getSession(sessId);
              if (res?.success && res.session) {
                const sess = res.session;
                const sessImages = sess.original_images || sess.uploaded_images || [];
                const restoredImages: PhotoshootUploadedImage[] = sessImages.map(
                  (img: any, i: number) => ({
                    id: img.image_id || `img_${i}`,
                    name: img.filename || `product_${i + 1}.jpg`,
                    size: img.file_size || 0,
                    url: img.url,
                    previewUrl: img.url,
                    angle: (img.angle?.toLowerCase() as any) || "front",
                    uploadedAt: new Date().toISOString(),
                    backendImageId: img.image_id,
                  })
                );

                const isSessionAvatar = Boolean(sess.use_model);
                if (isSessionAvatar === isAvatarMode) {
                  setState((prev) => ({
                    ...prev,
                    uploadedImages: restoredImages,
                    productCategory: sess.product_category
                      ? backendNameToCategoryId(sess.product_category)
                      : prev.productCategory,
                    productName: sess.product_type || prev.productName,
                    sessionId: null,
                    finalResults: [],
                    enhancedVariations: [],
                    selectedEnhancedIds: [],
                    step: 1,
                  }));
                  setActiveView("studio");
                } else {
                  const targetRoute = isSessionAvatar ? "/ai-photoshoot/avatar" : "/ai-photoshoot/product";
                  router.push(targetRoute);
                }
              }
            } catch (e) {
              console.warn("Reuse product error:", e);
            }
          }}
          onStartNew={() => {
            handleResetCurrentStudio();
            setActiveView("studio");
          }}
        />
      )}

      {/* VIEW B: 5-Step Dedicated Studio Workflow */}
      {activeView === "studio" && (
        <>
          {/* 5-Step Stepper Header */}
          <PhotoshootStepper
            currentStep={state.step}
            mode={mode}
            onStepClick={(s) => updateState({ step: s, errorMessage: null })}
            canNavigateToStep={canNavigateToStep}
          />

          {/* STEP 1: Upload Product */}
          {state.step === 1 && (
            <Step1Upload
              mode={mode}
              uploadedImages={state.uploadedImages}
              productCategory={state.productCategory}
              productName={state.productName}
              productColor={state.productColor}
              onImagesChange={(imgs) => updateState({ uploadedImages: imgs })}
              onCategoryChange={(cat) => updateState({ productCategory: cat })}
              onNameChange={(name) => updateState({ productName: name })}
              onColorChange={(col) => updateState({ productColor: col })}
              onNext={handleProceedToEnhancement}
              onBack={() => router.push("/dashboard")}
            />
          )}

          {/* STEP 2: AI Enhancement & Inspection */}
          {state.step === 2 && (
            <Step2Enhance
              uploadedImages={state.uploadedImages}
              enhancedVariations={state.enhancedVariations}
              selectedEnhancedIds={state.selectedEnhancedIds}
              enhancementStyle={state.enhancementStyle}
              isEnhancing={state.isEnhancing}
              detectedAnalysis={state.detectedAnalysis}
              productCategory={state.productCategory}
              onCategoryChange={(cat) => updateState({ productCategory: cat })}
              onStyleSelect={handleEnhancementStyleSelect}
              onVariationToggle={handleVariationToggle}
              onRegenerateVariation={handleRegenerateVariation}
              onRegenerateAll={handleProceedToEnhancement}
              onBack={() => updateState({ step: 1, errorMessage: null })}
              onNext={() => {
                if (state.selectedEnhancedIds.length === 0 && state.enhancedVariations.length > 0) {
                  const autoId = state.enhancedVariations[0].id;
                  updateState({ selectedEnhancedIds: [autoId], step: 3, errorMessage: null });
                  if (state.sessionId) {
                    productPhotoshootService.selectEnhancedImages({
                      sessionId: state.sessionId,
                      selectedImageIds: [autoId],
                    }).catch(() => {});
                  }
                } else {
                  updateState({ step: 3, errorMessage: null });
                }
              }}
            />
          )}

          {/* STEP 3: Choose Model & Style (Avatar Mode) OR Choose Style (Product Mode) */}
          {state.step === 3 && (
            <Step3StyleAndModel
              mode={mode}
              productCategory={state.productCategory}
              selectedEnhancedImage={
                state.enhancedVariations.find((v) => state.selectedEnhancedIds.includes(v.id)) ||
                state.enhancedVariations[0] ||
                null
              }
              selectedModelId={state.selectedModelId}
              selectedStyles={state.selectedStyles}
              customModels={backendModels.length > 0 ? backendModels : undefined}
              customStyles={backendStyles.length > 0 ? backendStyles : undefined}
              onModelSelect={(mId) => updateState({ selectedModelId: mId })}
              onStyleToggle={handleStyleToggle}
              onBack={() => updateState({ step: 2, errorMessage: null })}
              onNext={() => updateState({ step: 4, errorMessage: null })}
            />
          )}

          {/* STEP 4: Instructions & Voice Input */}
          {state.step === 4 && (
            <Step4PromptAndVoice
              mode={mode}
              customPrompt={state.customPrompt}
              productCategory={state.productCategory}
              productName={state.productName}
              productColor={state.productColor}
              enhancementStyle={state.enhancementStyle}
              selectedEnhancedImage={
                state.enhancedVariations.find((v) => state.selectedEnhancedIds.includes(v.id)) ||
                state.enhancedVariations[0] ||
                null
              }
              selectedModelId={state.selectedModelId}
              selectedStyles={state.selectedStyles}
              uploadedImages={state.uploadedImages}
              isGenerating={state.isGenerating}
              preparedPrompt={state.preparedPrompt}
              isPreparingPrompt={state.isPreparingPrompt}
              onPreparePrompt={handlePreparePrompt}
              onPromptChange={(p) => updateState({ customPrompt: p })}
              onBack={() => updateState({ step: 3, errorMessage: null })}
              onGenerate={handleGenerateFinalPhotoshoot}
            />
          )}

          {/* STEP 5: Final Commercial Results */}
          {state.step === 5 && (
            <Step5Results
              results={state.finalResults}
              selectedResultIds={state.selectedResultIds}
              isGenerating={state.isGenerating}
              generationProgress={state.generationProgress}
              generationStage={state.generationStage}
              productName={state.productName}
              onRetryFailedJob={handleRetryFailedJob}
              canRetryJob={state.canRetryJob}
              isRetryingJob={state.isRetryingJob}
              partialNotice={state.partialNotice}
              onToggleSelect={(id) =>
                updateState((prev) => ({
                  selectedResultIds: prev.selectedResultIds.includes(id)
                    ? prev.selectedResultIds.filter((i) => i !== id)
                    : [...prev.selectedResultIds, id],
                }))
              }
              onSelectAll={() =>
                updateState((prev) => ({
                  selectedResultIds: prev.finalResults.map((r) => r.id),
                }))
              }
              onDeselectAll={() => updateState({ selectedResultIds: [] })}
              onDeleteResult={handleDeleteResult}
              onRegenerateResult={handleRegenerateFinalResult}
              onSaveToGallery={handleSaveToGallery}
              onDownloadSelected={handleDownloadSelected}
              onDownloadSingle={handleDownloadSingle}
              onDownloadZip={handleDownloadZip}
              onStartNewPhotoshoot={handleResetCurrentStudio}
              onBackToEdit={() => updateState({ step: 4, errorMessage: null })}
            />
          )}
        </>
      )}
    </div>
  );
};

