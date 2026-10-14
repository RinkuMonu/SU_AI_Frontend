import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withText?: boolean;
  size?: "sm" | "default" | "lg";
  showSubtitle?: boolean;
  variant?: "horizontal" | "stacked" | "icon";
  theme?: "dark" | "light";
}

export function Logo({
  className,
  withText = true,
  size = "default",
  showSubtitle = false,
  variant = "horizontal",
  theme = "dark"
}: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  // If icon-only is requested
  if (!withText || variant === "icon") {
    return (
      <div className={cn("flex items-center justify-center shrink-0", className)}>
        <img
          src="/images/logo-icon.png"
          alt="Dhanda Grow AI"
          className={cn(
            "object-contain select-none",
            isSm ? "h-8 w-8" : isLg ? "h-14 w-14" : "h-10 w-10"
          )}
        />
      </div>
    );
  }

  // If full stacked logo is requested
  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col items-center justify-center shrink-0", className)}>
        <img
          src={theme === "light" ? "/images/logo-stacked.png" : "/images/logo-stacked-dark.png"}
          alt="Dhanda Grow AI"
          className={cn(
            "object-contain select-none",
            isSm ? "h-11 w-auto" : isLg ? "h-20 w-auto" : "h-14 w-auto"
          )}
        />
        {showSubtitle && (
          <span className="text-[10px] text-gray-400 mt-1 font-medium tracking-wide">
            India&apos;s AI Business Growth App
          </span>
        )}
      </div>
    );
  }

  // Default: Horizontal brand logo (Icon on left + Brand typography on right)
  const logoSrc = theme === "light" ? "/images/logo-horizontal-light.png" : "/images/logo-horizontal-dark.png";

  return (
    <div className={cn("flex flex-col justify-center min-w-0", className)}>
      <img
        src={logoSrc}
        alt="Dhanda Grow AI"
        className={cn(
          "object-contain select-none transition-all duration-200",
          isSm ? "h-8 md:h-9 w-auto max-w-[195px]" : isLg ? "h-12 md:h-14 w-auto" : "h-10 md:h-11 w-auto"
        )}
      />
      {showSubtitle && (
        <span className="text-[9px] text-gray-400 font-medium tracking-wide mt-0.5 truncate pl-1">
          India&apos;s AI Business Growth App
        </span>
      )}
    </div>
  );
}

