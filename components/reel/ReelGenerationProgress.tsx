import { useEffect, useState } from "react";
import { reelService } from "@/services/reel.service";
import { ReelJobStatus } from "@/types/reel";

interface ReelGenerationProgressProps {
  jobId: string;
  onComplete: (status: ReelJobStatus) => void;
  onError: (error: string) => void;
}

export function ReelGenerationProgress({ jobId, onComplete, onError }: ReelGenerationProgressProps) {
  const [status, setStatus] = useState<ReelJobStatus | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const data = await reelService.getReelStatus(jobId);
        setStatus(data);

        if (data.status === "completed") {
          clearInterval(interval);
          onComplete(data);
        } else if (data.status === "failed") {
          clearInterval(interval);
          onError(data.message || data.stage || "Reel generation failed.");
        }
      } catch (err: any) {
        clearInterval(interval);
        onError(err.message || "Failed to check status.");
      }
    };

    pollStatus();
    interval = setInterval(pollStatus, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [jobId, onComplete, onError]);

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8 text-text-muted bg-surface rounded-2xl border border-border">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple/20 border-t-brand-purple"></div>
        <p>Connecting to generation service...</p>
      </div>
    );
  }

    const stages = [
    { key: "queued", label: "Queued" },
    { key: "planning", label: "Gemini AI Storyboard" },
    { key: "generating_voice", label: "Neural Voiceover" },
    { key: "generating_video", label: "Google Veo 3.1 Video" },
    { key: "composing", label: "Syncing Captions & Export" },
  ];

  // Determine active stage by mapping progress percentage (0-100)
  let currentStageIndex = 0;
  if (status.progress >= 10 && status.progress < 30) currentStageIndex = 1;
  else if (status.progress >= 30 && status.progress < 50) currentStageIndex = 2;
  else if (status.progress >= 50 && status.progress < 80) currentStageIndex = 3;
  else if (status.progress >= 80) currentStageIndex = 4;
  
  if (status.status === "completed") currentStageIndex = 5;

  return (
    <div className="rounded-3xl border border-border bg-surface p-8 space-y-8 shadow-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-brand-purple"></span>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Crafting Your Reel</h2>
          {status.product_name && (
            <p className="text-xs text-text-muted mt-0.5">
              Generating tailored video, voiceover &amp; script for <span className="text-brand-purple font-semibold">{status.product_name}</span>
            </p>
          )}
        </div>
      </div>
      
      <div className="relative pt-2">
        <div className="flex mb-3 items-center justify-between">
          <div>
            <span className="text-xs font-bold inline-block py-1.5 px-3 uppercase rounded-full text-brand-purple bg-brand-purple/20 shadow-sm border border-brand-purple/30">
              {status.stage || "Processing"}
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold inline-block text-brand-purple">
              {status.progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-3 mb-6 text-xs flex rounded-full bg-[#0a142c] inset-shadow-sm border border-border">
          <div 
            style={{ width: `${status.progress}%` }} 
            className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-gradient bg-[length:200%_auto] animate-[gradient_2s_linear_infinite] transition-all duration-700 ease-out"
          ></div>
        </div>
      </div>

      <div className="bg-[#0a142c] rounded-2xl p-6 border border-border shadow-sm">
        <ul className="space-y-5">
          {stages.map((stage, index) => {
            const isCompleted = currentStageIndex > index || status.status === "completed";
            const isActive = currentStageIndex === index && status.status !== "completed";
            const isPending = currentStageIndex < index && status.status !== "completed";

            return (
              <li key={stage.key} className="flex items-center space-x-4 relative">
                {/* Connecting Line */}
                {index !== stages.length - 1 && (
                  <div className={`absolute left-3.5 top-8 w-0.5 h-6 -ml-px ${isCompleted ? 'bg-brand-purple' : 'bg-border'}`}></div>
                )}
                
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted ? 'bg-brand-purple border-brand-purple text-white shadow-md' : isActive ? 'border-brand-purple text-brand-purple bg-surface animate-pulse' : 'border-border text-text-muted bg-surface'}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : isActive ? (
                    <div className="w-2 h-2 rounded-full bg-brand-purple animate-ping"></div>
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                  )}
                </div>
                
                <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${isCompleted ? "text-white" : isActive ? "text-brand-purple" : "text-text-muted"}`}>
                  {stage.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
