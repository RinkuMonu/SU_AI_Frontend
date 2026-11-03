const fs = require('fs');
let content = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// 1. Update noScrollSteps in useEffect
const target1 = `    const noScrollSteps = ["business_details", "business_details_2", "brand_preferences", "presence", "get_started"];
    if (currentStepObj && noScrollSteps.includes(currentStepObj.id)) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };`;

const replacement1 = `    const noScrollSteps = [
      "business_details",
      "business_details_2",
      "brand_preferences",
      "brand_services",
      "presence",
      "get_started",
      "maps_details",
      "maps_website",
      "website_connect",
      "website_url",
    ];
    if (currentStepObj && noScrollSteps.includes(currentStepObj.id)) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    } else {
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.height = "auto";
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  console.log('1. Updated useEffect successfully');
} else {
  console.log('1. Target 1 not found');
}

// 2. Update root container wrapper classes
const target2 = `  return (
    <div className={\`\${
      currentStepObj.id === "get_started"
        ? "h-screen h-[100dvh] max-h-screen overflow-hidden p-0"
        : ["business_details", "business_details_2", "brand_preferences", "presence"].includes(currentStepObj.id)
        ? "h-screen h-[100dvh] max-h-screen overflow-hidden py-1.5 sm:py-2 px-3 sm:px-6 select-none"
        : ["none_details", "none_brand_kit", "brand_services"].includes(currentStepObj.id)
        ? "min-h-screen py-3 sm:py-5 px-3 sm:px-6 overflow-y-auto overflow-x-hidden"
        : "min-h-screen lg:h-screen lg:max-h-screen lg:overflow-hidden py-2 sm:py-3 lg:py-2.5 px-3 sm:px-6 overflow-x-hidden"
    } bg-[#081226] text-[#ededf2] flex flex-col justify-between relative selection:bg-[#be32ff]/30 overflow-hidden\`}>`;

const replacement2 = `  return (
    <div className={\`\${
      currentStepObj.id === "get_started"
        ? "h-screen h-[100dvh] max-h-screen overflow-hidden p-0"
        : [
            "business_details",
            "business_details_2",
            "brand_preferences",
            "brand_services",
            "presence",
            "maps_details",
            "maps_website",
            "website_connect",
            "website_url",
          ].includes(currentStepObj.id)
        ? "h-screen h-[100dvh] max-h-screen overflow-hidden py-1.5 sm:py-2 px-3 sm:px-6 select-none"
        : ["website_photos", "maps_photos", "photos"].includes(currentStepObj.id)
        ? "min-h-screen py-4 sm:py-6 px-3 sm:px-6 overflow-y-auto overflow-x-hidden"
        : "min-h-screen py-2 sm:py-3 lg:py-2.5 px-3 sm:px-6 overflow-y-auto overflow-x-hidden"
    } bg-[#081226] text-[#ededf2] flex flex-col justify-between relative selection:bg-[#be32ff]/30 \${
      ["website_photos", "maps_photos", "photos"].includes(currentStepObj.id) ? "overflow-y-auto" : "overflow-hidden"
    }\`}>`;

if (content.includes(target2)) {
  content = content.replace(target2, replacement2);
  console.log('2. Updated root container classes successfully');
} else {
  console.log('2. Target 2 not found');
}

// 3. Update brand_preferences highlight color (#fc9a5d -> #be32ff)
const target3 = `                      className={\`w-12 h-12 sm:w-14 sm:h-14 rounded-full relative shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 block border-2 \${
                        idx === 0
                          ? "border-[#fc9a5d] ring-2 ring-[#fc9a5d]/50 shadow-[0_0_12px_rgba(252,154,93,0.35)]"
                          : "border-white/20 hover:border-[#fc9a5d]/60"
                      }\`}`;

const replacement3 = `                      className={\`w-12 h-12 sm:w-14 sm:h-14 rounded-full relative shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 block border-2 \${
                        idx === 0
                          ? "border-[#be32ff] ring-2 ring-[#be32ff]/50 shadow-[0_0_12px_rgba(190,50,255,0.4)]"
                          : "border-white/20 hover:border-[#be32ff]/60"
                      }\`}`;

if (content.includes(target3)) {
  content = content.replace(target3, replacement3);
  console.log('3. Updated primary color highlight successfully');
} else {
  console.log('3. Target 3 not found');
}

const target4 = `                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleToggleTone(tone)}
                        className={\`py-2 px-4.5 sm:px-5.5 rounded-full text-sm sm:text-base font-normal transition-all duration-200 cursor-pointer \${
                          isSelected
                            ? "bg-[#1f152b] border-2 border-[#fc9a5d] text-white shadow-[0_0_15px_rgba(252,154,93,0.35)] ring-1 ring-[#f0449b]/60"
                            : "bg-[#13192b] border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                        }\`}
                      >`;

const replacement4 = `                      <button
                        key={tone}
                        type="button"
                        onClick={() => handleToggleTone(tone)}
                        className={\`py-2 px-4.5 sm:px-5.5 rounded-full text-sm sm:text-base font-normal transition-all duration-200 cursor-pointer \${
                          isSelected
                            ? "bg-[#1f152b] border-2 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.4)] ring-1 ring-[#be32ff]/60"
                            : "bg-[#13192b] border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                        }\`}
                      >`;

if (content.includes(target4)) {
  content = content.replace(target4, replacement4);
  console.log('4. Updated tone button highlight successfully');
} else {
  console.log('4. Target 4 not found');
}

const target5 = `                <button
                  type="button"
                  onClick={() => setShowAllTones(!showAllTones)}
                  className="py-2 px-3 text-sm sm:text-base text-[#fc9a5d] hover:text-[#f0449b] font-medium transition-colors cursor-pointer"
                >`;

const replacement5 = `                <button
                  type="button"
                  onClick={() => setShowAllTones(!showAllTones)}
                  className="py-2 px-3 text-sm sm:text-base text-[#be32ff] hover:text-[#d946ef] font-medium transition-colors cursor-pointer"
                >`;

if (content.includes(target5)) {
  content = content.replace(target5, replacement5);
  console.log('5. Updated See all tone button successfully');
} else {
  console.log('5. Target 5 not found');
}

const target6 = `                      className={\`h-10.5 sm:h-11 px-5 rounded-xl text-sm sm:text-base font-normal transition-all duration-200 cursor-pointer \${
                        isSelected
                          ? "bg-[#1f152b] border-2 border-[#fc9a5d] text-white shadow-[0_0_15px_rgba(252,154,93,0.35)] ring-1 ring-[#f0449b]/60"
                          : "bg-[#13192b] border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                      }\`}`;

const replacement6 = `                      className={\`h-10.5 sm:h-11 px-5 rounded-xl text-sm sm:text-base font-normal transition-all duration-200 cursor-pointer \${
                        isSelected
                          ? "bg-[#1f152b] border-2 border-[#be32ff] text-white shadow-[0_0_15px_rgba(190,50,255,0.4)] ring-1 ring-[#be32ff]/60"
                          : "bg-[#13192b] border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                      }\`}`;

if (content.includes(target6)) {
  content = content.replace(target6, replacement6);
  console.log('6. Updated language buttons successfully');
} else {
  console.log('6. Target 6 not found');
}

// 7. Update website_photos wrapper
const target7 = `      {currentStepObj.id === "website_photos" && (
        <div className="w-full max-w-4xl lg:max-w-5xl mx-auto my-auto py-2 flex flex-col justify-between min-h-[580px] sm:min-h-[660px] animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">`;

const replacement7 = `      {currentStepObj.id === "website_photos" && (
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2 pb-14 flex flex-col justify-start relative z-10 px-4 sm:px-8">`;

if (content.includes(target7)) {
  content = content.replace(target7, replacement7);
  console.log('7. Updated website_photos container successfully');
} else {
  console.log('7. Target 7 not found');
}

// 8. Update maps_photos wrapper & remove inner max-h box
const target8 = `      {currentStepObj.id === "maps_photos" && (
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto pt-1 sm:pt-2 pb-1 flex flex-col justify-between animate-in fade-in duration-400 relative z-10 px-3 sm:px-6">`;

const replacement8 = `      {currentStepObj.id === "maps_photos" && (
        <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto pt-2 pb-14 flex flex-col justify-start relative z-10 px-4 sm:px-8">`;

if (content.includes(target8)) {
  content = content.replace(target8, replacement8);
  console.log('8. Updated maps_photos container successfully');
} else {
  console.log('8. Target 8 not found');
}

const target9 = `<div className="max-h-[30vh] sm:max-h-[33vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 pb-2">`;

const replacement9 = `<div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 pb-2">`;

if (content.includes(target9)) {
  content = content.replace(target9, replacement9);
  console.log('9. Removed maps_photos inner scrollbar successfully');
} else {
  console.log('9. Target 9 not found');
}

// 10. Update footer exclusion
const target10 = `      {/* Footer (hidden on single-screen steps to ensure zero vertical scroll and zero scrollbars) */}
      {!["get_started", "none_details", "none_brand_kit", "maps_details", "business_details", "business_details_2", "brand_preferences", "presence"].includes(currentStepObj.id) && (
        <footer className="w-full max-w-4xl mx-auto py-1 text-center text-[11px] text-neutral-500 shrink-0 z-10 relative select-none">
          &copy; {new Date().getFullYear()} DhandaGrow AI. Tailored for Indian enterprises and creators.
        </footer>
      )}`;

const replacement10 = `      {/* Footer (hidden on single-screen steps to ensure zero vertical scroll and zero scrollbars) */}
      {!["get_started", "none_details", "none_brand_kit", "maps_details", "business_details", "business_details_2", "brand_preferences", "brand_services", "presence", "maps_website", "website_connect"].includes(currentStepObj.id) && (
        <footer className="w-full max-w-4xl mx-auto py-1 text-center text-[11px] text-neutral-500 shrink-0 z-10 relative select-none">
          &copy; {new Date().getFullYear()} DhandaGrow AI. Tailored for Indian enterprises and creators.
        </footer>
      )}`;

if (content.includes(target10)) {
  content = content.replace(target10, replacement10);
  console.log('10. Updated footer exclusion successfully');
} else {
  console.log('10. Target 10 not found');
}

fs.writeFileSync('app/onboarding/page.tsx', content, 'utf8');

