declare module "driver.js" {
  export interface DriveStep {
    element?: string | HTMLElement;
    popover?: {
      title?: string;
      description?: string;
      side?: "top" | "right" | "bottom" | "left";
      align?: "start" | "center" | "end";
      showButtons?: ("next" | "previous" | "close")[];
      nextBtnText?: string;
      prevBtnText?: string;
      doneBtnText?: string;
      onNextClick?: () => void;
      onPrevClick?: () => void;
      onCloseClick?: () => void;
      [key: string]: any;
    };
    onHighlightStarted?: () => void;
    onHighlighted?: () => void;
    onDeselected?: () => void;
    [key: string]: any;
  }

  export interface DriverConfig {
    showProgress?: boolean;
    progressText?: string;
    animate?: boolean;
    smoothScroll?: boolean;
    overlayColor?: string;
    overlayOpacity?: number;
    stagePadding?: number;
    stageRadius?: number;
    allowClose?: boolean;
    overlayClickNext?: boolean;
    doneBtnText?: string;
    closeBtnText?: string;
    nextBtnText?: string;
    prevBtnText?: string;
    showButtons?: ("next" | "previous" | "close")[];
    steps?: DriveStep[];
    onDestroyStarted?: () => void;
    onDestroyed?: () => void;
    popoverClass?: string;
    [key: string]: any;
  }

  export interface DriverInstance {
    drive: (stepIndex?: number) => void;
    destroy: () => void;
    hasNextStep: () => boolean;
    hasPreviousStep: () => boolean;
    isFirstStep: () => boolean;
    isLastStep: () => boolean;
    getActiveStep: () => DriveStep | undefined;
    getActiveIndex: () => number | undefined;
    moveNext: () => void;
    movePrevious: () => void;
    moveTo: (index: number) => void;
    highlight: (step: DriveStep) => void;
    setConfig: (config: DriverConfig) => void;
    getConfig: () => DriverConfig;
    getState: () => any;
    [key: string]: any;
  }

  export function driver(config?: DriverConfig): DriverInstance;
}

declare module "driver.js/dist/driver.css" {
  const content: any;
  export default content;
}
