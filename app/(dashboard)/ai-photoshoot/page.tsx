"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Camera, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  FolderOpen, 
  Layers, 
  CheckCircle2, 
  UserCheck, 
  Box, 
  ArrowRight,
  ShieldCheck,
  Zap
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

// Storage keys for preserving separate tab workflows
const ACTIVE_TAB_KEY = "dhandagrow_photoshoot_active_tab";
const AVATAR_SESSION_KEY = "dhandagrow_photoshoot_avatar_session_id";
const PRODUCT_SESSION_KEY = "dhandagrow_photoshoot_product_session_id";
const AVATAR_CACHE_KEY = "dhandagrow_photoshoot_avatar_form_cache";
const PRODUCT_CACHE_KEY = "dhandagrow_photoshoot_product_form_cache";

interface TabStudioState {
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

function createInitialAvatarState(): TabStudioState {
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

function createInitialProductState(): TabStudioState {
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
    selectedModelId: null, // Always null for product mode
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

export default function AIPhotoshootPage() {
  // Top Level View Mode: Studio (Generator) vs. My Gallery (History)
  const [activeView, setActiveView] = useState<"studio" | "gallery">("studio");

  // Active Tab Mode: "avatar" (AI Avatar Photoshoot) vs. "product" (AI Product Photography)
  const [activeTab, setActiveTab] = useState<PhotoshootTabMode>("avatar");

  // Separate, Isolated Studio Workflow State for both tabs
  const [avatarState, setAvatarState] = useState<TabStudioState>(createInitialAvatarState);
  const [productState, setProductState] = useState<TabStudioState>(createInitialProductState);

  // Dynamic Models and Styles from Backend
  const [backendModels, setBackendModels] = useState<AIModelProfile[]>([]);
  const [backendStyles, setBackendStyles] = useState<PhotographyStyleOption[]>([]);

  // Polling Intervals & Duplicate Submission Guards (one per tab)
  const avatarPollRef = useRef<NodeJS.Timeout | null>(null);
  const productPollRef = useRef<NodeJS.Timeout | null>(null);
  const isSubmittingGenRef = useRef(false);

  // Clear polling intervals on unmount
  useEffect(() => {
    return () => {
      if (avatarPollRef.current) clearInterval(avatarPollRef.current);
      if (productPollRef.current) clearInterval(productPollRef.current);
    };
  }, []);

  // Update highest step reached for stepper navigation
  const updateCurrentState = useCallback(
    (updater: Partial<TabStudioState> | ((prev: TabStudioState) => Partial<TabStudioState>)) => {
      if (activeTab === "avatar") {
        setAvatarState((prev) => {
          const partial = typeof updater === "function" ? updater(prev) : updater;
          const next = { ...prev, ...partial };
          if (next.step > next.highestStepReached) {
            next.highestStepReached = next.step;
          }
          return next;
        });
      } else {
        setProductState((prev) => {
          const partial = typeof updater === "function" ? updater(prev) : updater;
          const next = { ...prev, ...partial };
          if (next.step > next.highestStepReached) {
            next.highestStepReached = next.step;
          }
          return next;
        });
      }
    },
    [activeTab]
  );

  // Read current active tab state
  const currentState = activeTab === "avatar" ? avatarState : productState;

  // Restore Session & Form Cache for both tabs on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Restore active tab
    const savedTab = sessionStorage.getItem(ACTIVE_TAB_KEY) as PhotoshootTabMode | null;
    if (savedTab === "avatar" || savedTab === "product") {
      setActiveTab(savedTab);
    }

    // Helper to restore cache for a tab
    const restoreTab = (cacheKey: string, sessionKey: string, isAvatar: boolean) => {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        let partialData: Partial<TabStudioState> = {};
        if (cached) {
          const parsed = JSON.parse(cached);
          partialData = {
            step: parsed.step || 1,
            highestStepReached: parsed.highestStepReached || parsed.step || 1,
            productCategory: parsed.productCategory,
            productName: parsed.productName,
            productColor: parsed.productColor,
            enhancementStyle: parsed.enhancementStyle || "studio_premium",
            selectedModelId: isAvatar ? (parsed.selectedModelId || "model_f_01") : null,
            selectedStyles: parsed.selectedStyles || [],
            customPrompt: parsed.customPrompt || "",
            uploadedImages: parsed.uploadedImages || [],
            enhancedVariations: parsed.enhancedVariations || [],
            selectedEnhancedIds: parsed.selectedEnhancedIds || [],
            detectedAnalysis: parsed.detectedAnalysis || null,
          };
        }

        const savedSessionId = sessionStorage.getItem(sessionKey);
        if (savedSessionId) {
          partialData.sessionId = savedSessionId;
          productPhotoshootService
            .getSessionResults(savedSessionId)
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
                const stateSetter = isAvatar ? setAvatarState : setProductState;
                stateSetter((prev) => ({
                  ...prev,
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
          const stateSetter = isAvatar ? setAvatarState : setProductState;
          stateSetter((prev) => ({ ...prev, ...partialData }));
        }
      } catch (_) {}
    };

    restoreTab(AVATAR_CACHE_KEY, AVATAR_SESSION_KEY, true);
    restoreTab(PRODUCT_CACHE_KEY, PRODUCT_SESSION_KEY, false);
  }, []);

  // Save active tab preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  // Cache Avatar state on changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const serializableImages = avatarState.uploadedImages.map((img) => ({
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
        sessionId: avatarState.sessionId,
        step: avatarState.step,
        highestStepReached: avatarState.highestStepReached,
        productCategory: avatarState.productCategory,
        productName: avatarState.productName,
        productColor: avatarState.productColor,
        enhancementStyle: avatarState.enhancementStyle,
        selectedModelId: avatarState.selectedModelId,
        selectedStyles: avatarState.selectedStyles,
        customPrompt: avatarState.customPrompt,
        uploadedImages: serializableImages,
        enhancedVariations: avatarState.enhancedVariations,
        selectedEnhancedIds: avatarState.selectedEnhancedIds,
        detectedAnalysis: avatarState.detectedAnalysis,
      };

      sessionStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify(stateToCache));
      if (avatarState.sessionId) {
        sessionStorage.setItem(AVATAR_SESSION_KEY, avatarState.sessionId);
      }
    } catch (_) {}
  }, [avatarState]);

  // Cache Product state on changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const serializableImages = productState.uploadedImages.map((img) => ({
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
        sessionId: productState.sessionId,
        step: productState.step,
        highestStepReached: productState.highestStepReached,
        productCategory: productState.productCategory,
        productName: productState.productName,
        productColor: productState.productColor,
        enhancementStyle: productState.enhancementStyle,
        selectedModelId: null,
        selectedStyles: productState.selectedStyles,
        customPrompt: productState.customPrompt,
        uploadedImages: serializableImages,
        enhancedVariations: productState.enhancedVariations,
        selectedEnhancedIds: productState.selectedEnhancedIds,
        detectedAnalysis: productState.detectedAnalysis,
      };

      sessionStorage.setItem(PRODUCT_CACHE_KEY, JSON.stringify(stateToCache));
      if (productState.sessionId) {
        sessionStorage.setItem(PRODUCT_SESSION_KEY, productState.sessionId);
      }
    } catch (_) {}
  }, [productState]);

  // Fetch dynamic models and styles from backend when category or active tab changes
  useEffect(() => {
    let isMounted = true;
    const isAvatarMode = activeTab === "avatar";
    const currentCat = isAvatarMode ? avatarState.productCategory : productState.productCategory;
    const categoryName = categoryIdToBackendName(currentCat);

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
              recommendedCategories: [currentCat],
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
        modelId: isAvatarMode ? (avatarState.selectedModelId || undefined) : undefined,
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
            recommendedFor: [currentCat],
          };
        });
        setBackendStyles(mapped);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [activeTab, avatarState.productCategory, avatarState.selectedModelId, productState.productCategory]);

  // Transition Step 1 -> Step 2: Upload images, analyze product, enhance images
  const handleProceedToEnhancement = async () => {
    const isAvatarMode = activeTab === "avatar";
    const tabState = isAvatarMode ? avatarState : productState;
    if (tabState.uploadedImages.length === 0) return;

    updateCurrentState({
      errorMessage: null,
      step: 2,
      isEnhancing: true,
    });

    try {
      let activeSessionId = tabState.sessionId;

      // 1. Upload files to backend if any new local files exist
      const filesToUpload = tabState.uploadedImages
        .map((img) => img.file)
        .filter((f): f is File => Boolean(f));

      if (filesToUpload.length > 0 || !activeSessionId) {
        const angles = tabState.uploadedImages.map((img) => img.angle);
        const uploadRes = await productPhotoshootService.uploadImages({
          files: filesToUpload,
          category: categoryIdToBackendName(tabState.productCategory),
          angles,
          sessionId: activeSessionId || undefined,
        });

        if (uploadRes.success) {
          activeSessionId = uploadRes.session_id;
          const sessionKey = isAvatarMode ? AVATAR_SESSION_KEY : PRODUCT_SESSION_KEY;
          sessionStorage.setItem(sessionKey, activeSessionId);

          // Update uploaded images with backend image_id and real URLs
          if (uploadRes.uploaded_images && uploadRes.uploaded_images.length > 0) {
            const updatedImages = tabState.uploadedImages.map((img, idx) => {
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
            updateCurrentState({
              sessionId: activeSessionId,
              uploadedImages: updatedImages,
            });
          } else {
            updateCurrentState({ sessionId: activeSessionId });
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
          const updates: Partial<TabStudioState> = {
            detectedAnalysis: analysisRes.analysis,
          };
          if (!tabState.productName && analysisRes.analysis.product_type) {
            updates.productName = analysisRes.analysis.product_type;
          }
          if (analysisRes.analysis.product_category) {
            const detectedCat = backendNameToCategoryId(analysisRes.analysis.product_category);
            updates.productCategory = detectedCat;
          }
          if (!tabState.productColor && analysisRes.analysis.main_colors?.length) {
            updates.productColor = analysisRes.analysis.main_colors.join(", ");
          }
          updateCurrentState(updates);
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
            originalUrl: tabState.uploadedImages[0]?.previewUrl || item.url,
            enhancedUrl: item.url,
            description: `Calibrated ${item.style} lighting with crisp edge fidelity.`,
            aspectRatio: "1:1",
          };
        });

        const autoSelected = variations.slice(0, 2).map((v) => v.id);
        updateCurrentState({
          enhancedVariations: variations,
          selectedEnhancedIds: autoSelected,
          isEnhancing: false,
        });

        // Save selected enhanced images to session
        await productPhotoshootService.selectEnhancedImages({
          sessionId: activeSessionId,
          selectedImageIds: autoSelected,
        });
      } else {
        updateCurrentState({ isEnhancing: false });
      }
    } catch (err: any) {
      console.error("Enhancement error:", err);
      updateCurrentState({
        isEnhancing: false,
        errorMessage: err?.response?.data?.detail || err.message || "Failed to enhance images.",
      });
    }
  };

  // Re-run enhancements if user changes style in Step 2
  const handleEnhancementStyleSelect = async (style: EnhancementStyle) => {
    updateCurrentState({ enhancementStyle: style });
    const tabState = activeTab === "avatar" ? avatarState : productState;
    if (!tabState.sessionId) return;

    const styleInfo = ENHANCEMENT_STYLES.find((s) => s.id === style);
    const styleName = styleInfo?.name || "Studio Premium";

    try {
      updateCurrentState({ isEnhancing: true });
      const res = await productPhotoshootService.enhanceImages({
        sessionId: tabState.sessionId,
        styles: [styleName],
      });

      if (res.success && res.enhanced_images?.length > 0) {
        const newVars: EnhancedVariation[] = res.enhanced_images.map((item) => ({
          id: item.image_id,
          sourceImageId: item.source_image_id,
          style,
          styleName: item.style,
          originalUrl: tabState.uploadedImages[0]?.previewUrl || item.url,
          enhancedUrl: item.url,
          description: `Calibrated ${item.style} lighting.`,
          aspectRatio: "1:1",
        }));
        updateCurrentState({
          enhancedVariations: newVars,
          selectedEnhancedIds: newVars.map((v) => v.id),
          isEnhancing: false,
        });
      } else {
        updateCurrentState({ isEnhancing: false });
      }
    } catch (e) {
      updateCurrentState({ isEnhancing: false });
    }
  };

  // Toggle Enhanced Variation selection
  const handleVariationToggle = async (id: string) => {
    const tabState = activeTab === "avatar" ? avatarState : productState;
    const updated = tabState.selectedEnhancedIds.includes(id)
      ? tabState.selectedEnhancedIds.filter((i) => i !== id)
      : [...tabState.selectedEnhancedIds, id];

    updateCurrentState({ selectedEnhancedIds: updated });

    if (tabState.sessionId) {
      try {
        await productPhotoshootService.selectEnhancedImages({
          sessionId: tabState.sessionId,
          selectedImageIds: updated,
        });
      } catch (err) {
        console.warn("Could not sync enhanced selections:", err);
      }
    }
  };

  // Re-roll single enhancement variation
  const handleRegenerateVariation = async (id: string) => {
    updateCurrentState((prev) => ({
      enhancedVariations: prev.enhancedVariations.map((v) =>
        v.id === id ? { ...v, isRegenerating: true } : v
      ),
    }));

    try {
      const res = await productPhotoshootService.regenerateImage({ imageId: id });
      if (res.success && res.regenerated_image) {
        updateCurrentState((prev) => ({
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
        updateCurrentState((prev) => ({
          enhancedVariations: prev.enhancedVariations.map((v) =>
            v.id === id ? { ...v, isRegenerating: false } : v
          ),
        }));
      }
    } catch (_) {
      updateCurrentState((prev) => ({
        enhancedVariations: prev.enhancedVariations.map((v) =>
          v.id === id ? { ...v, isRegenerating: false } : v
        ),
      }));
    }
  };

  // Toggle photography style / pose
  const handleStyleToggle = (styleId: string) => {
    updateCurrentState((prev) => {
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
    const isAvatarMode = activeTab === "avatar";
    const tabState = isAvatarMode ? avatarState : productState;
    if (!tabState.sessionId) return;

    updateCurrentState({ isPreparingPrompt: true });
    try {
      const res = await productPhotoshootService.preparePrompt({
        sessionId: tabState.sessionId,
        customPrompt: tabState.customPrompt,
        useModel: isAvatarMode,
        modelId: isAvatarMode ? (tabState.selectedModelId || undefined) : undefined,
        selectedStyles: tabState.selectedStyles,
      });
      if (res.success && res.prepared_prompt) {
        updateCurrentState({ preparedPrompt: res.prepared_prompt });
      }
    } catch (e) {
      console.warn("Prepare prompt notice:", e);
    } finally {
      updateCurrentState({ isPreparingPrompt: false });
    }
  };

  // Step 5: Start Batch Photoshoot Generation
  const handleGenerateFinalPhotoshoot = async () => {
    if (isSubmittingGenRef.current) return;
    isSubmittingGenRef.current = true;

    const isAvatarMode = activeTab === "avatar";
    const tabState = isAvatarMode ? avatarState : productState;

    // Avatar mode validation: mandatory model
    if (isAvatarMode && !tabState.selectedModelId) {
      isSubmittingGenRef.current = false;
      updateCurrentState({
        errorMessage: "Model selection is mandatory for AI Avatar Photoshoot. Please select a model in Step 3.",
      });
      return;
    }

    if (!tabState.sessionId) {
      isSubmittingGenRef.current = false;
      updateCurrentState({
        errorMessage: "Photoshoot session missing. Please upload images in Step 1.",
      });
      return;
    }

    const currentPollRef = isAvatarMode ? avatarPollRef : productPollRef;

    updateCurrentState({
      errorMessage: null,
      step: 5,
      isGenerating: true,
      generationProgress: 12,
      generationStage: isAvatarMode
        ? "Initializing AI avatar draping & lighting pipeline..."
        : "Initializing commercial studio product lighting...",
    });

    try {
      const genResponse = await productPhotoshootService.generatePhotoshoot({
        sessionId: tabState.sessionId,
        selectedEnhancedImageIds:
          tabState.selectedEnhancedIds.length > 0 ? tabState.selectedEnhancedIds : undefined,
        productCategory: categoryIdToBackendName(tabState.productCategory),
        useModel: isAvatarMode,
        modelId: isAvatarMode ? (tabState.selectedModelId || undefined) : undefined,
        selectedStyles: tabState.selectedStyles,
        customPrompt: tabState.customPrompt,
        imageCount: 5,
      });

      if (!genResponse.success || !genResponse.job_id) {
        throw new Error(genResponse.message || "Failed to start photoshoot generation.");
      }

      const jobId = genResponse.job_id;
      updateCurrentState({
        activeJobId: jobId,
        generationStage: isAvatarMode
          ? "Synthesizing high-fashion model poses and apparel realism..."
          : "Rendering studio reflections and camera perspectives...",
      });

      if (currentPollRef.current) clearInterval(currentPollRef.current);

      let pollAttempts = 0;
      currentPollRef.current = setInterval(async () => {
        pollAttempts++;
        try {
          const statusRes = await productPhotoshootService.getJobStatus(jobId);

          if (statusRes.progress_percent) {
            updateCurrentState({
              generationProgress: Math.min(95, statusRes.progress_percent),
            });
          }

          if (statusRes.status === "processing") {
            updateCurrentState({
              generationStage: `Rendering variation ${statusRes.completed_images || 0} of ${statusRes.total_images || 5}...`,
            });
          }

          if (statusRes.status === "completed" || statusRes.status === "partial") {
            if (currentPollRef.current) {
              clearInterval(currentPollRef.current);
              currentPollRef.current = null;
            }

            const resultsRes = await productPhotoshootService.getSessionResults(tabState.sessionId!);
            let mappedResults: PhotoshootFinalResult[] = [];
            if (resultsRes.success && resultsRes.results) {
              mappedResults = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${tabState.productName || "Product"} — ${r.style_applied}`,
                prompt: tabState.customPrompt || `Commercial photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: isAvatarMode && tabState.selectedModelId ? tabState.selectedModelId : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
            }

            updateCurrentState({
              generationProgress: 100,
              generationStage: "Photoshoot complete!",
              isGenerating: false,
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
            if (currentPollRef.current) {
              clearInterval(currentPollRef.current);
              currentPollRef.current = null;
            }
            updateCurrentState({
              isGenerating: false,
              canRetryJob: Boolean(statusRes.can_retry),
              errorMessage: statusRes.error || "Photoshoot generation failed. Please try again.",
            });
            isSubmittingGenRef.current = false;
          } else if (pollAttempts > 65) {
            if (currentPollRef.current) {
              clearInterval(currentPollRef.current);
              currentPollRef.current = null;
            }
            isSubmittingGenRef.current = false;
            const resultsRes = await productPhotoshootService.getSessionResults(tabState.sessionId!);
            if (resultsRes.success && resultsRes.results?.length) {
              const mapped = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${tabState.productName || "Product"} — ${r.style_applied}`,
                prompt: tabState.customPrompt || `Photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                modelUsed: isAvatarMode ? tabState.selectedModelId || undefined : undefined,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
              updateCurrentState({
                isGenerating: false,
                finalResults: mapped,
                selectedResultIds: mapped.map((r) => r.id),
                partialNotice: "Rendering took slightly longer; available variations are loaded.",
              });
            } else {
              updateCurrentState({
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
      updateCurrentState({
        isGenerating: false,
        errorMessage: err?.response?.data?.detail || err.message || "Photoshoot generation could not complete.",
      });
    }
  };

  // Retry failed images
  const handleRetryFailedJob = async () => {
    const tabState = activeTab === "avatar" ? avatarState : productState;
    if (!tabState.activeJobId || tabState.isRetryingJob) return;

    updateCurrentState({
      isRetryingJob: true,
      errorMessage: null,
      partialNotice: "Retrying failed variations in background...",
    });

    try {
      const res = await productPhotoshootService.retryFailedJob(tabState.activeJobId);
      if (res.success && res.retrying_count > 0) {
        updateCurrentState({ isGenerating: true });
        // Trigger status check after short delay
        setTimeout(async () => {
          if (tabState.sessionId) {
            const resultsRes = await productPhotoshootService.getSessionResults(tabState.sessionId);
            if (resultsRes.success && resultsRes.results) {
              const mapped = resultsRes.results.map((r) => ({
                id: r.image_id,
                imageUrl: r.url,
                title: `${tabState.productName || "Product"} — ${r.style_applied}`,
                prompt: tabState.customPrompt || `Photoshoot in ${r.style_applied}`,
                styleName: r.style_applied,
                resolution: "4K Ultra-HD",
                selected: true,
                isSaved: r.is_saved,
                createdAt: r.created_at,
              }));
              updateCurrentState({
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
        updateCurrentState({
          isRetryingJob: false,
          partialNotice: res.message || "No variations available to retry.",
        });
      }
    } catch (e: any) {
      updateCurrentState({
        isRetryingJob: false,
        errorMessage: e?.response?.data?.detail || "Could not retry failed variations.",
      });
    }
  };

  // Re-roll single final image variation
  const handleRegenerateFinalResult = async (id: string) => {
    updateCurrentState((prev) => ({
      finalResults: prev.finalResults.map((r) =>
        r.id === id ? { ...r, isRegenerating: true, isFailed: false } : r
      ),
    }));

    try {
      const res = await productPhotoshootService.regenerateImage({ imageId: id });
      if (res.success && res.regenerated_image) {
        updateCurrentState((prev) => ({
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
        updateCurrentState((prev) => ({
          finalResults: prev.finalResults.map((r) =>
            r.id === id ? { ...r, isRegenerating: false, isFailed: true } : r
          ),
        }));
      }
    } catch (e) {
      updateCurrentState((prev) => ({
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
    updateCurrentState((prev) => ({
      finalResults: prev.finalResults.filter((r) => r.id !== id),
      selectedResultIds: prev.selectedResultIds.filter((i) => i !== id),
    }));
  };

  // Save selected final photoshoot images to permanent library
  const handleSaveToGallery = async () => {
    const tabState = activeTab === "avatar" ? avatarState : productState;
    if (!tabState.sessionId || tabState.selectedResultIds.length === 0) return;
    try {
      await productPhotoshootService.saveSelectedImages({
        sessionId: tabState.sessionId,
        imageIds: tabState.selectedResultIds,
      });
      updateCurrentState((prev) => ({
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
        `${(currentState.productName || "photoshoot").toLowerCase().replace(/\s+/g, "_")}_${item.id}.jpg`
      );
    } catch (_) {
      window.open(item.imageUrl, "_blank");
    }
  };

  const handleDownloadSelected = async () => {
    const toDownload = currentState.finalResults.filter((r) =>
      currentState.selectedResultIds.includes(r.id)
    );
    for (const item of toDownload) {
      await handleDownloadSingle(item);
    }
  };

  const handleDownloadZip = async () => {
    if (!currentState.sessionId) return;
    try {
      await productPhotoshootService.downloadSessionZip(currentState.sessionId);
    } catch (e) {
      console.warn("Download zip error:", e);
    }
  };

  // Reset Studio for current tab
  const handleResetCurrentStudio = () => {
    if (activeTab === "avatar") {
      sessionStorage.removeItem(AVATAR_CACHE_KEY);
      sessionStorage.removeItem(AVATAR_SESSION_KEY);
      setAvatarState(createInitialAvatarState());
    } else {
      sessionStorage.removeItem(PRODUCT_CACHE_KEY);
      sessionStorage.removeItem(PRODUCT_SESSION_KEY);
      setProductState(createInitialProductState());
    }
  };

  const canNavigateToStep = (targetStep: 1 | 2 | 3 | 4 | 5): boolean => {
    if (targetStep === currentState.step) return true;
    if (targetStep <= currentState.highestStepReached) return true;
    if (targetStep === 2) return currentState.uploadedImages.length > 0;
    if (targetStep === 3) return currentState.enhancedVariations.length > 0;
    if (targetStep === 4) {
      return activeTab === "avatar"
        ? Boolean(currentState.selectedModelId) && currentState.selectedStyles.length > 0
        : currentState.selectedStyles.length > 0;
    }
    if (targetStep === 5) return currentState.finalResults.length > 0;
    return false;
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto px-3 sm:px-6">
      {/* Top Header Row with Navigation & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 tracking-tight">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-pink flex items-center justify-center text-white shadow-lg shadow-brand-purple/30">
              <Camera className="w-5 h-5" />
            </span>
            <span>AI Photoshoot Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Produce commercial marketing imagery with AI avatars or dedicated product compositions.
          </p>
        </div>

        {/* Action Buttons: View Gallery & Reset Studio */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveView(activeView === "gallery" ? "studio" : "gallery")}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeView === "gallery"
                ? "bg-brand-purple text-white border-brand-purple shadow-lg shadow-brand-purple/20"
                : "bg-white/5 hover:bg-white/10 border-white/10 text-neutral-300 hover:text-white"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>{activeView === "gallery" ? "Back to Studio" : "My Gallery"}</span>
          </button>

          {activeView === "studio" && (
            <button
              type="button"
              onClick={handleResetCurrentStudio}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-neutral-400 hover:text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset current tab workflow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* TWO PRIMARY WORKFLOW TABS (Minimal visual tabs with image previews & purple gradient) */}
      {activeView === "studio" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {/* TAB 1: AI Avatar Photoshoot */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("avatar");
              setActiveView("studio");
            }}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 sm:gap-4 relative overflow-hidden group ${
              activeTab === "avatar"
                ? "bg-gradient-to-r from-brand-purple/25 via-[#18112d] to-[#0d0f20] border-brand-purple shadow-xl shadow-brand-purple/25 ring-2 ring-brand-purple/40"
                : "bg-[#0b0e1b]/80 hover:bg-[#12152a] border-white/10 hover:border-white/20"
            }`}
          >
            {/* Model Thumbnail Preview */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
                alt="AI Avatar Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-brand-pink text-white flex items-center justify-center shadow">
                <Sparkles className="w-2.5 h-2.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`text-sm sm:text-base font-extrabold truncate ${
                  activeTab === "avatar" ? "text-white" : "text-neutral-200 group-hover:text-white"
                }`}>
                  AI Avatar Photoshoot
                </h2>
                {activeTab === "avatar" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-purple/30 border border-brand-purple/50 text-brand-pink font-bold shrink-0">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                Showcase apparel and fashion with male &amp; female AI models.
              </p>
            </div>
          </button>

          {/* TAB 2: AI Product Photography */}
          <button
            type="button"
            onClick={() => {
              setActiveTab("product");
              setActiveView("studio");
            }}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 sm:gap-4 relative overflow-hidden group ${
              activeTab === "product"
                ? "bg-gradient-to-r from-blue-600/25 via-[#10192e] to-[#0d0f20] border-blue-500 shadow-xl shadow-blue-500/25 ring-2 ring-blue-500/40"
                : "bg-[#0b0e1b]/80 hover:bg-[#12152a] border-white/10 hover:border-white/20"
            }`}
          >
            {/* Product Photography Thumbnail Preview */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                alt="Product Photography Preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow">
                <Camera className="w-2.5 h-2.5" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h2 className={`text-sm sm:text-base font-extrabold truncate ${
                  activeTab === "product" ? "text-white" : "text-neutral-200 group-hover:text-white"
                }`}>
                  AI Product Photography
                </h2>
                {activeTab === "product" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/30 border border-blue-500/50 text-blue-300 font-bold shrink-0">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                Commercial studio, lifestyle, and marketplace product-only shots.
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Global Error Banner */}
      {currentState.errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{currentState.errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => updateCurrentState({ errorMessage: null })}
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
                // Route to appropriate tab based on session use_model
                const targetTab: PhotoshootTabMode = res.use_model ? "avatar" : "product";
                setActiveTab(targetTab);
                const setter = targetTab === "avatar" ? setAvatarState : setProductState;
                setter((prev) => ({
                  ...prev,
                  sessionId: sessId,
                  finalResults: mapped,
                  selectedResultIds: mapped.map((m) => m.id),
                  step: 5,
                  highestStepReached: 5,
                }));
                setActiveView("studio");
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

                const targetTab: PhotoshootTabMode = sess.use_model ? "avatar" : "product";
                setActiveTab(targetTab);
                const setter = targetTab === "avatar" ? setAvatarState : setProductState;
                setter((prev) => ({
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

      {/* VIEW B: 5-Step Studio Workflow */}
      {activeView === "studio" && (
        <>
          {/* 5-Step Stepper Header */}
          <PhotoshootStepper
            currentStep={currentState.step}
            mode={activeTab}
            onStepClick={(s) => updateCurrentState({ step: s })}
            canNavigateToStep={canNavigateToStep}
          />

          {/* STEP 1: Upload Product */}
          {currentState.step === 1 && (
            <Step1Upload
              mode={activeTab}
              uploadedImages={currentState.uploadedImages}
              productCategory={currentState.productCategory}
              productName={currentState.productName}
              productColor={currentState.productColor}
              onImagesChange={(imgs) => updateCurrentState({ uploadedImages: imgs })}
              onCategoryChange={(cat) => updateCurrentState({ productCategory: cat })}
              onNameChange={(name) => updateCurrentState({ productName: name })}
              onColorChange={(col) => updateCurrentState({ productColor: col })}
              onNext={handleProceedToEnhancement}
            />
          )}

          {/* STEP 2: AI Enhancement & Inspection */}
          {currentState.step === 2 && (
            <Step2Enhance
              uploadedImages={currentState.uploadedImages}
              enhancedVariations={currentState.enhancedVariations}
              selectedEnhancedIds={currentState.selectedEnhancedIds}
              enhancementStyle={currentState.enhancementStyle}
              isEnhancing={currentState.isEnhancing}
              detectedAnalysis={currentState.detectedAnalysis}
              productCategory={currentState.productCategory}
              onCategoryChange={(cat) => updateCurrentState({ productCategory: cat })}
              onStyleSelect={handleEnhancementStyleSelect}
              onVariationToggle={handleVariationToggle}
              onRegenerateVariation={handleRegenerateVariation}
              onRegenerateAll={handleProceedToEnhancement}
              onBack={() => updateCurrentState({ step: 1 })}
              onNext={() => updateCurrentState({ step: 3 })}
            />
          )}

          {/* STEP 3: Choose Model & Style (Avatar Mode) OR Choose Style (Product Mode) */}
          {currentState.step === 3 && (
            <Step3StyleAndModel
              mode={activeTab}
              productCategory={currentState.productCategory}
              selectedModelId={currentState.selectedModelId}
              selectedStyles={currentState.selectedStyles}
              customModels={backendModels.length > 0 ? backendModels : undefined}
              customStyles={backendStyles.length > 0 ? backendStyles : undefined}
              onModelSelect={(mId) => updateCurrentState({ selectedModelId: mId })}
              onStyleToggle={handleStyleToggle}
              onBack={() => updateCurrentState({ step: 2 })}
              onNext={() => updateCurrentState({ step: 4 })}
            />
          )}

          {/* STEP 4: Instructions & Voice Input */}
          {currentState.step === 4 && (
            <Step4PromptAndVoice
              mode={activeTab}
              customPrompt={currentState.customPrompt}
              productCategory={currentState.productCategory}
              productName={currentState.productName}
              productColor={currentState.productColor}
              enhancementStyle={currentState.enhancementStyle}
              selectedModelId={currentState.selectedModelId}
              selectedStyles={currentState.selectedStyles}
              uploadedImages={currentState.uploadedImages}
              isGenerating={currentState.isGenerating}
              preparedPrompt={currentState.preparedPrompt}
              isPreparingPrompt={currentState.isPreparingPrompt}
              onPreparePrompt={handlePreparePrompt}
              onPromptChange={(p) => updateCurrentState({ customPrompt: p })}
              onBack={() => updateCurrentState({ step: 3 })}
              onGenerate={handleGenerateFinalPhotoshoot}
            />
          )}

          {/* STEP 5: Final Commercial Results */}
          {currentState.step === 5 && (
            <Step5Results
              results={currentState.finalResults}
              selectedResultIds={currentState.selectedResultIds}
              isGenerating={currentState.isGenerating}
              generationProgress={currentState.generationProgress}
              generationStage={currentState.generationStage}
              productName={currentState.productName}
              onRetryFailedJob={handleRetryFailedJob}
              canRetryJob={currentState.canRetryJob}
              isRetryingJob={currentState.isRetryingJob}
              partialNotice={currentState.partialNotice}
              onToggleSelect={(id) =>
                updateCurrentState((prev) => ({
                  selectedResultIds: prev.selectedResultIds.includes(id)
                    ? prev.selectedResultIds.filter((i) => i !== id)
                    : [...prev.selectedResultIds, id],
                }))
              }
              onSelectAll={() =>
                updateCurrentState((prev) => ({
                  selectedResultIds: prev.finalResults.map((r) => r.id),
                }))
              }
              onDeselectAll={() => updateCurrentState({ selectedResultIds: [] })}
              onDeleteResult={handleDeleteResult}
              onRegenerateResult={handleRegenerateFinalResult}
              onSaveToGallery={handleSaveToGallery}
              onDownloadSelected={handleDownloadSelected}
              onDownloadSingle={handleDownloadSingle}
              onDownloadZip={handleDownloadZip}
              onStartNewPhotoshoot={handleResetCurrentStudio}
              onBackToEdit={() => updateCurrentState({ step: 4 })}
            />
          )}
        </>
      )}
    </div>
  );
}
