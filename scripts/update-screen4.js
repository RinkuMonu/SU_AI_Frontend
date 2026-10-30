const fs = require('fs');

let code = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

const hadCRLF = code.includes('\r\n');
code = code.replace(/\r\n/g, '\n');

const s2StartStr = '{currentStepObj.id === "business_services" && (';
const s2EndStr = '{/* ══════════════════════════════════════════════════════════════════════\n          SCREEN 3: WHERE DOES YOUR BUSINESS LIVE ONLINE? (Designer Screenshot 2)';

const s2StartIdx = code.indexOf(s2StartStr);
const s2EndIdx = code.indexOf(s2EndStr);

if (s2StartIdx !== -1 && s2EndIdx !== -1) {
  const newS2JSX = `{currentStepObj.id === "business_services" && (
        <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 flex flex-col justify-between min-h-[540px] sm:min-h-[580px] animate-in fade-in duration-400 relative z-10 px-4 sm:px-6">
          <div>
            {/* Top Bar: Back button + Long Gradient Progress Bar (Image 4) */}
            <div className="flex items-center w-full mb-6">
              <button
                type="button"
                onClick={handleServicesBack}
                aria-label="Go back"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shrink-0 border border-slate-700/60"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
              <div className="flex-1 h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden ml-4 sm:ml-6">
                <div
                  className="h-full bg-gradient-to-r from-[#FA5D42] via-[#E84E8F] to-[#9936F1] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(232,78,143,0.5)]"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* Heading & Subtitle Area (Image 4) */}
            <div className="mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Choose your{" "}
                <span className="bg-gradient-to-r from-[#FA5D42] via-[#E84E8F] to-[#9936F1] bg-clip-text text-transparent">
                  business services
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 font-normal">
                Select the tool you want to use for your business
              </p>
            </div>

            {/* 7 Services Cards: 4 Top Row + 3 Bottom Row (Exact Image 4 Grid) */}
            <div className="space-y-3 sm:space-y-4 my-2">
              {/* Row 1: Top 4 Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {BUSINESS_SERVICES_OPTIONS.slice(0, 4).map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  const IconComp = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      id={\`service-card-\${srv.id}\`}
                      onClick={() => handleToggleService(srv.id)}
                      className={\`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[155px] relative select-none \${
                        isSelected
                          ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50"
                          : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36]"
                      }\`}
                    >
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className={\`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 \${srv.iconBg}\`}>
                          <IconComp className={\`w-5 h-5 \${srv.iconColor}\`} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                          {srv.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug font-normal line-clamp-2">
                          {srv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Row 2: Bottom 3 Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
                {BUSINESS_SERVICES_OPTIONS.slice(4).map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  const IconComp = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      id={\`service-card-\${srv.id}\`}
                      onClick={() => handleToggleService(srv.id)}
                      className={\`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[140px] sm:min-h-[155px] relative select-none \${
                        isSelected
                          ? "bg-[#141B34] border-2 border-[#BE32FF] shadow-[0_0_20px_rgba(190,50,255,0.3)] ring-1 ring-[#BE32FF]/50"
                          : "bg-[#10172B] border-slate-800 hover:border-slate-700 hover:bg-[#131C36]"
                      }\`}
                    >
                      <div className="flex items-start justify-between w-full mb-3">
                        <div className={\`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 \${srv.iconBg}\`}>
                          <IconComp className={\`w-5 h-5 \${srv.iconColor}\`} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                          {srv.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug font-normal line-clamp-2">
                          {srv.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Validation & Centered Continue Button (Image 4) */}
          <div className="pt-6 pb-4 flex flex-col items-center">
            {servicesError && (
              <div className="mb-3 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in max-w-sm w-full">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{servicesError}</span>
              </div>
            )}
            <button
              type="button"
              id="services-continue-btn"
              onClick={handleServicesContinue}
              disabled={isSavingServices || selectedServices.length === 0}
              className={\`w-full max-w-sm h-12 sm:h-13 rounded-full font-semibold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#d334d7]/25 \${
                selectedServices.length > 0 && !isSavingServices
                  ? "bg-gradient-to-r from-[#8241fd] via-[#d334d7] to-[#f56983] hover:brightness-110 active:scale-[0.98] text-white"
                  : "bg-white/10 text-neutral-500 cursor-not-allowed border border-white/5 opacity-60"
              }\`}
            >
              {isSavingServices ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      )}\n\n      `;

  code = code.substring(0, s2StartIdx) + newS2JSX + code.substring(s2EndIdx);
  console.log('Successfully updated Screen 4 (business_services) to match Image 4!');
} else {
  console.error('Could not locate Screen 4 indices', { s2StartIdx, s2EndIdx });
  process.exit(1);
}

if (hadCRLF) {
  code = code.replace(/\n/g, '\r\n');
}

fs.writeFileSync('app/onboarding/page.tsx', code, 'utf8');

