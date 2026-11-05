// Shared Website Generator - powers both editor preview and live view
import { WebsiteSection, WebsiteSectionItem } from "@/services/website-builder.service";

const resolveCuratedUnsplash = (query: string): string => {
  const q = (query || "").toLowerCase();

  // Makeup & Beauty
  if (
    q.includes("makeup") || q.includes("make up") || q.includes("cosmetic") ||
    q.includes("beauty") || q.includes("lipstick") || q.includes("foundation") ||
    q.includes("skincare") || q.includes("eyeshadow") || q.includes("mascara") ||
    q.includes("fifa") || q.includes("glam") || q.includes("facial")
  ) {
    if (q.includes("tutorial") || q.includes("workshop") || q.includes("artist") || q.includes("class") || q.includes("lesson")) {
      return "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("foundation") || q.includes("base") || q.includes("primer") || q.includes("concealer")) {
      return "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("lipstick") || q.includes("lip") || q.includes("gloss")) {
      return "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("eye") || q.includes("palette") || q.includes("shadow") || q.includes("mascara")) {
      return "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("skin") || q.includes("serum") || q.includes("cream") || q.includes("moisturizer")) {
      return "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("brush") || q.includes("tool") || q.includes("kit")) {
      return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=85";
    }
    return "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=85";
  }

  // Shoes & Footwear
  if (q.includes("shoe") || q.includes("shoes") || q.includes("sneaker") || q.includes("footwear") || q.includes("boot") || q.includes("heel")) {
    if (q.includes("sneaker") || q.includes("sport") || q.includes("trainer")) {
      return "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("formal") || q.includes("leather") || q.includes("oxford")) {
      return "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("heel") || q.includes("pump") || q.includes("women")) {
      return "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85";
    }
    return "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85";
  }

  // Bakery & Sweets (Strict: not generic shop)
  if (q.includes("bakery") || q.includes("cake") || q.includes("pastry") || q.includes("mithai") || q.includes("cupcake") || q.includes("dessert") || q.includes("cookie")) {
    if (q.includes("cake") || q.includes("birthday")) {
      return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("mithai") || q.includes("halwa") || q.includes("laddu")) {
      return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85";
    }
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85";
  }

  // Clothing & Fashion
  if (q.includes("cloth") || q.includes("apparel") || q.includes("boutique") || q.includes("fashion") || q.includes("dress") || q.includes("wear")) {
    return "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85";
  }

  // Restaurant & Food
  if (q.includes("restaurant") || q.includes("dining") || q.includes("food") || q.includes("cuisine") || q.includes("cafe") || q.includes("coffee") || q.includes("pizza") || q.includes("bistro")) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85";
  }

  // Flowers & Florist
  if (q.includes("flower") || q.includes("florist") || q.includes("bouquet") || q.includes("rose")) {
    return "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85";
  }

  // Electronics & Gadgets
  if (
    q.includes("electronic") || q.includes("phone") || q.includes("mobile") ||
    q.includes("laptop") || q.includes("computer") || q.includes("tv") ||
    q.includes("audio") || q.includes("headphone") || q.includes("speaker") ||
    q.includes("camera") || q.includes("gadget") || q.includes("shyam")
  ) {
    if (q.includes("phone") || q.includes("mobile") || q.includes("smartphone")) {
      return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("laptop") || q.includes("computer") || q.includes("pc")) {
      return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("tv") || q.includes("television") || q.includes("screen") || q.includes("display")) {
      return "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("headphone") || q.includes("audio") || q.includes("sound") || q.includes("earbuds")) {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85";
    }
    if (q.includes("camera") || q.includes("dslr") || q.includes("lens")) {
      return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85";
    }
    return "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=85";
  }

  // Gym & Fitness
  if (q.includes("gym") || q.includes("fitness") || q.includes("workout") || q.includes("crossfit") || q.includes("training")) {
    return "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=85";
  }

  // Tech, Servers & Cloud
  if (q.includes("server") || q.includes("cloud") || q.includes("host") || q.includes("datacenter") || q.includes("tech") || q.includes("software")) {
    return "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85";
  }

  // Medical & Clinic
  if (q.includes("medic") || q.includes("clinic") || q.includes("doctor") || q.includes("hospital") || q.includes("pharma") || q.includes("health")) {
    return "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=85";
  }

  // Jewellery & Luxury
  if (q.includes("jewel") || q.includes("ring") || q.includes("diamond") || q.includes("gold") || q.includes("necklace") || q.includes("watch")) {
    return "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=85";
  }

  // Automotive
  if (q.includes("car") || q.includes("auto") || q.includes("garage") || q.includes("mechanic") || q.includes("vehicle")) {
    return "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=900&q=85";
  }

  // Real Estate
  if (q.includes("real estate") || q.includes("property") || q.includes("apartment") || q.includes("villa") || q.includes("home") || q.includes("interior")) {
    return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85";
  }

  // Education
  if (q.includes("educat") || q.includes("school") || q.includes("coach") || q.includes("course") || q.includes("tutor") || q.includes("book")) {
    return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=85";
  }

  return "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85";
};

const resolveImageUrl = (
  explicitUrl: string | undefined,
  category: string,
  sectionType: string,
  itemTitle?: string,
  businessName?: string,
  width = 800,
  height = 600
): string => {
  if (explicitUrl && typeof explicitUrl === "string" && explicitUrl.trim() !== "") {
    if (
      !explicitUrl.includes("photo-1551434678-e076c223a692") &&
      !explicitUrl.includes("source.unsplash.com") &&
      !explicitUrl.includes("pollinations.ai")
    ) {
      return explicitUrl.trim();
    }
  }

  const query = `${businessName || ""} ${category || ""} ${itemTitle || ""} ${sectionType || ""}`;
  return resolveCuratedUnsplash(query);
};

/* -------------------------------------------------------------------------- */
/*                     DYNAMIC VECTOR SVG LOGO GENERATOR                      */
/* -------------------------------------------------------------------------- */

const generateDynamicSvgLogo = (
  businessName: string,
  category: string = "",
  primaryColor: string = "#4F46E5"
): string => {
  const cleanName = (businessName || "Business").trim();
  const words = cleanName.split(/\s+/);
  const initials = words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : cleanName.slice(0, 2).toUpperCase() || "B";
  const color = primaryColor && primaryColor.startsWith("#") ? primaryColor : "#4F46E5";
  const c = (category || "").toLowerCase();

  let iconSvg = "";
  if (c.includes("medical") || c.includes("clinic") || c.includes("pharmacy") || c.includes("chemist") || c.includes("doctor") || c.includes("dawai")) {
    iconSvg = `<circle cx="50" cy="50" r="46" fill="${color}" /><circle cx="50" cy="50" r="41" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.4" /><path d="M42 26 H58 V42 H74 V58 H58 V74 H42 V58 H26 V42 H42 Z" fill="#ffffff" /><circle cx="50" cy="50" r="6" fill="${color}" />`;
  } else if (c.includes("gym") || c.includes("fitness") || c.includes("workout") || c.includes("yoga")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><rect x="20" y="44" width="60" height="12" rx="6" fill="#ffffff" /><rect x="14" y="32" width="12" height="36" rx="5" fill="#ffffff" /><rect x="74" y="32" width="12" height="36" rx="5" fill="#ffffff" /><rect x="26" y="37" width="6" height="26" rx="3" fill="#ffffff" opacity="0.85" /><rect x="68" y="37" width="6" height="26" rx="3" fill="#ffffff" opacity="0.85" />`;
  } else if (c.includes("flower") || c.includes("florist") || c.includes("floral") || c.includes("bloom")) {
    iconSvg = `<circle cx="50" cy="50" r="46" fill="${color}" /><circle cx="50" cy="34" r="14" fill="#ffffff" opacity="0.9" /><circle cx="66" cy="50" r="14" fill="#ffffff" opacity="0.9" /><circle cx="50" cy="66" r="14" fill="#ffffff" opacity="0.9" /><circle cx="34" cy="50" r="14" fill="#ffffff" opacity="0.9" /><circle cx="50" cy="50" r="11" fill="#FBBF24" />`;
  } else if (c.includes("sweet") || c.includes("mithai") || c.includes("bakery") || c.includes("cafe") || c.includes("dessert")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><path d="M30 40 Q50 20 70 40 Q80 60 70 75 Q50 85 30 75 Q20 60 30 40 Z" fill="#ffffff" opacity="0.95" /><circle cx="50" cy="30" r="6" fill="#EF4444" /><text x="50" y="66" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${color}" text-anchor="middle">${initials}</text>`;
  } else if (c.includes("stationery") || c.includes("book") || c.includes("pen")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><path d="M22 32 Q50 26 50 72 Q50 26 78 32 V74 Q50 68 50 74 Q50 68 22 74 Z" fill="#ffffff" /><line x1="50" y1="30" x2="50" y2="72" stroke="${color}" stroke-width="3" />`;
  } else if (c.includes("server") || c.includes("cloud") || c.includes("host") || c.includes("vps") || c.includes("datacenter") || c.includes("data center")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><rect x="22" y="24" width="56" height="14" rx="4" fill="#ffffff" /><circle cx="30" cy="31" r="2.5" fill="${color}" /><circle cx="38" cy="31" r="2.5" fill="${color}" /><rect x="22" y="43" width="56" height="14" rx="4" fill="#ffffff" /><circle cx="30" cy="50" r="2.5" fill="${color}" /><circle cx="38" cy="50" r="2.5" fill="${color}" /><rect x="22" y="62" width="56" height="14" rx="4" fill="#ffffff" /><circle cx="30" cy="69" r="2.5" fill="${color}" /><circle cx="38" cy="69" r="2.5" fill="${color}" />`;
  } else if (c.includes("farm") || c.includes("resort") || c.includes("nature") || c.includes("villa")) {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><circle cx="70" cy="30" r="12" fill="#FBBF24" /><path d="M30 75 L50 35 L70 75 Z" fill="#ffffff" opacity="0.9" /><rect x="47" y="65" width="6" height="15" fill="#ffffff" />`;
  } else {
    iconSvg = `<rect width="100" height="100" rx="24" fill="${color}" /><circle cx="50" cy="50" r="38" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.4" /><text x="50" y="61" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>`;
  }

  const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">${iconSvg}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(rawSvg)}`;
};

/* -------------------------------------------------------------------------- */
/*                     CATEGORY CONFLICT DETECTOR (REQ 5)                     */
/* -------------------------------------------------------------------------- */

const checkCategoryConflict = (
  instruction: string,
  category: string
): { hasConflict: boolean; reason?: string } => {
  const lowerInst = instruction.toLowerCase();
  const c = category.toLowerCase();

  const isFloral = c.includes("flower") || c.includes("florist");
  const isGym = c.includes("gym") || c.includes("fitness");
  const isRestaurant = c.includes("restaurant") || c.includes("food") || c.includes("cafe");

  if (isFloral) {
    if (
      lowerInst.includes("sports car") ||
      lowerInst.includes("automobile") ||
      lowerInst.includes("crypto") ||
      lowerInst.includes("car repair") ||
      lowerInst.includes("smartphone repair")
    ) {
      return {
        hasConflict: true,
        reason: "Your website is for a Flower Shop. Adding vehicles or electronics conflicts with your floral business."
      };
    }
  }

  if (isGym) {
    if (
      lowerInst.includes("fast food") ||
      lowerInst.includes("flower bouquet") ||
      lowerInst.includes("wedding florist")
    ) {
      return {
        hasConflict: true,
        reason: "Your website is for a Gym & Fitness Center. This content conflicts with your fitness brand."
      };
    }
  }

  if (isRestaurant) {
    if (
      lowerInst.includes("car repair") ||
      lowerInst.includes("gym equipment") ||
      lowerInst.includes("weightlifting")
    ) {
      return {
        hasConflict: true,
        reason: "Your website is for a Restaurant/Dining establishment. This content conflicts with your culinary theme."
      };
    }
  }

  return { hasConflict: false };
};

/* -------------------------------------------------------------------------- */
/*                       HTML BUILDER & RENDERER ENGINE                       */
/* -------------------------------------------------------------------------- */

const escapeHtml = (unsafe?: string): string => {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const generateHtmlFromJSON = (rawData: any, mode: "desktop" | "tablet" | "mobile" = "desktop"): string => {
  if (!rawData) return "";

  let data = rawData;
  if (typeof rawData === "string") {
    try {
      data = JSON.parse(rawData);
    } catch {
      return rawData;
    }
  }

  if (data.html && typeof data.html === "string") return data.html;

  const pages = Array.isArray(data) ? data : data.pages ? data.pages : [data];
  if (!pages || pages.length === 0) {
    return "<h1 style='padding:2rem;text-align:center;'>No website draft available yet</h1>";
  }

  const bName = escapeHtml(data.business_name || "My Business");
  const bCategory = data.business_category || "Business";
  const theme = data.theme || {};
  const primaryColor = theme.primary || theme.primary_color || "#4F46E5";
  const secondaryColor = theme.secondary || theme.secondary_color || "#4338CA";
  const accentColor = theme.accent || theme.accent_color || "#EC4899";
  const fontFamily = theme.font || theme.font_family || "Outfit";
  const buttonColor = theme.button_color || theme.buttonColor || primaryColor;
  const buttonTextColor = theme.button_text_color || theme.buttonTextColor || "#ffffff";
  const buttonHoverColor = theme.button_hover || theme.buttonHoverColor || secondaryColor;
  const buttonRadius = theme.button_radius || theme.buttonRadius || "0.75rem";

  // Gather all available sections across all incoming pages
  const allIncomingSections: WebsiteSection[] = [];
  pages.forEach((p: any) => {
    if (Array.isArray(p.sections)) {
      allIncomingSections.push(...p.sections);
    }
  });

  const navbarSection = allIncomingSections.find((s: any) => s.type === "navbar");
  const rawLogo = (typeof data.logo === "string" && data.logo) ? data.logo : data.logo?.url || navbarSection?.logo || null;
  const logoUrl = rawLogo || generateDynamicSvgLogo(bName, bCategory, primaryColor);

  const existingPageMap = new Map<string, any>();
  pages.forEach((p: any) => {
    if (p.name) existingPageMap.set(p.name.toLowerCase(), p);
  });

  const isRetail = ["shop", "store", "flower", "sweet", "boutique", "bakery", "jewel"].some((w) =>
    bCategory.toLowerCase().includes(w)
  );
  const serviceTabName = isRetail ? "Products" : "Services";

  // Guaranteed 4-page multi-page website model
  const resolvedPages: { name: string; id: string; sections: WebsiteSection[] }[] = [];

  // 1. HOME PAGE
  const rawHomePage = existingPageMap.get("home");
  let homeSections: WebsiteSection[] = [];
  if (rawHomePage?.sections?.length) {
    homeSections = rawHomePage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  }

  // Ensure hero is present
  if (!homeSections.some((s) => s.type === "hero")) {
    const existingHero = allIncomingSections.find((s: any) => s.type === "hero");
    homeSections.unshift(existingHero || {
      type: "hero",
      title: `${bName}`,
      subtitle: `Discover unmatched craftsmanship, authentic dedication, and exquisite quality in every detail.`,
      cta: "Explore Offerings",
      secondary_cta: "Our Story"
    });
  }

  const catLower = bCategory.toLowerCase();

  // 1. Stats Bar (Metrics)
  if (!homeSections.some((s) => s.type === "stats" || s.type === "metrics")) {
    let statsItems: any[] = [];
    if (catLower.includes("server") || catLower.includes("cloud") || catLower.includes("host")) {
      statsItems = [
        { label: "Uptime SLA", value: "99.99%", description: "Guaranteed high availability" },
        { label: "Active Deployments", value: "5,000+", description: "Deployed worldwide" },
        { label: "Port Speeds", value: "10 Gbps", description: "Ultra-low latency uplinks" },
        { label: "Support", value: "24/7/365", description: "Expert technical assistance" }
      ];
    } else if (catLower.includes("flower") || catLower.includes("florist")) {
      statsItems = [
        { label: "Fresh Daily Blooms", value: "100%", description: "Handpicked morning blossoms" },
        { label: "Bouquets Crafted", value: "15,000+", description: "Artistic floral arrangements" },
        { label: "Express Delivery", value: "Same-Day", description: "Guaranteed on-time arrival" },
        { label: "Customer Rating", value: "4.9 ★", description: "Top-rated local florist" }
      ];
    } else if (catLower.includes("sweet") || catLower.includes("mithai") || catLower.includes("bakery")) {
      statsItems = [
        { label: "Pure Ingredients", value: "100%", description: "Traditional pure desi ghee" },
        { label: "Signature Delicacies", value: "60+", description: "Traditional & festive treats" },
        { label: "Happy Customers", value: "25,000+", description: "Spreading sweetness everyday" },
        { label: "Daily Preparation", value: "Fresh Batch", description: "Crafted fresh every morning" }
      ];
    } else if (catLower.includes("medical") || catLower.includes("clinic") || catLower.includes("pharma")) {
      statsItems = [
        { label: "Certified Medicines", value: "100%", description: "Authentic & quality verified" },
        { label: "Years of Trust", value: "15+ Years", description: "Dedicated healthcare services" },
        { label: "Availability", value: "24/7", description: "Ready for urgent prescriptions" },
        { label: "Families Served", value: "20,000+", description: "Trusted community pharmacy" }
      ];
    } else {
      statsItems = [
        { label: "Quality Guarantee", value: "100%", description: "Uncompromised excellence" },
        { label: "Satisfied Clients", value: "10,000+", description: "Delivering lasting value" },
        { label: "Turnaround Time", value: "Prompt", description: "Fast & dedicated response" },
        { label: "Customer Rating", value: "4.9 ★", description: "Verified positive reviews" }
      ];
    }
    const heroIndex = homeSections.findIndex((s) => s.type === "hero");
    homeSections.splice(heroIndex + 1, 0, {
      type: "stats",
      title: "Key Highlights",
      subtitle: `Why customers choose ${bName}`,
      items: statsItems
    });
  }

  // 2. Features / Signature Highlights
  if (!homeSections.some((s) => ["features", "facilities", "services", "products"].includes(s.type))) {
    const existingFeatures = allIncomingSections.find((s: any) =>
      ["features", "facilities", "services", "products"].includes(s.type)
    );
    homeSections.push(existingFeatures || {
      type: "features",
      title: "Signature Highlights",
      subtitle: `Experience the best of ${bCategory} at ${bName}`,
      items: [
        { title: "Premium Quality", description: `Uncompromising standards across all our ${bCategory} offerings.` },
        { title: "Personalized Care", description: "Attentive service tailored specifically to your unique needs." },
        { title: "Trusted Craft", description: "Passionate professionals devoted to exceptional results." }
      ]
    });
  }

  // 3. Brand Story & Craftsmanship preview (About)
  if (!homeSections.some((s) => ["about", "story"].includes(s.type))) {
    const existingAbout = allIncomingSections.find((s: any) => ["about", "story"].includes(s.type));
    homeSections.push(existingAbout || {
      type: "about",
      title: `Welcome to ${bName}`,
      subtitle: "Devoted to Craftsmanship & Excellence",
      description: `At ${bName}, our journey is rooted in an unwavering passion for superior quality and genuine customer care. Every single day, we strive to bring you the finest ${bCategory} solutions with uncompromised integrity, warm service, and attention to detail.`
    });
  }

  // 4. Testimonials
  if (!homeSections.some((s) => ["testimonials", "reviews"].includes(s.type))) {
    let testItems: any[] = [];
    if (catLower.includes("server") || catLower.includes("cloud") || catLower.includes("host")) {
      testItems = [
        { name: "Vikram Malhotra", role: "CTO, CloudScale", rating: 5, quote: `${bName} delivered incredible stability with zero downtime. Deployment was instant and network speeds exceeded all expectations.` },
        { name: "Sneha Sen", role: "Lead Systems Architect", rating: 5, quote: "Rock-solid infrastructure and responsive 24/7 technical support. Truly enterprise grade service." },
        { name: "Rohan Mehra", role: "Startup Founder", rating: 5, quote: `Migrating to ${bName} reduced our latency dramatically. Highly recommended for production workloads.` }
      ];
    } else if (catLower.includes("flower") || catLower.includes("florist")) {
      testItems = [
        { name: "Pooja Sharma", role: "Verified Customer", rating: 5, quote: `The floral arrangement from ${bName} was breathtaking! Fresh blooms that stayed vibrant for over a week.` },
        { name: "Amit Verma", role: "Anniversary Order", rating: 5, quote: "Flawless same-day delivery and gorgeous presentation. My wife absolutely loved the bouquet!" },
        { name: "Kavita Rao", role: "Event Coordinator", rating: 5, quote: `${bName} handled our venue floral decor with such artistry and elegance. Truly spectacular.` }
      ];
    } else if (catLower.includes("sweet") || catLower.includes("mithai") || catLower.includes("bakery")) {
      testItems = [
        { name: "Rajesh Gupta", role: "Regular Patron", rating: 5, quote: `Authentic taste, rich aroma of pure ghee, and heavenly sweets. ${bName} is our family's favorite for every celebration.` },
        { name: "Neha Kapoor", role: "Festival Shopper", rating: 5, quote: "Ordered custom gift boxes for Diwali and every guest called to compliment the extraordinary flavors." },
        { name: "Manish Joshi", role: "Sweet Lover", rating: 5, quote: `Freshness you can taste in every single bite. The craftsmanship at ${bName} is truly unmatched.` }
      ];
    } else if (catLower.includes("medical") || catLower.includes("clinic") || catLower.includes("pharma")) {
      testItems = [
        { name: "Suresh Singhal", role: "Local Resident", rating: 5, quote: `${bName} is our most trusted pharmacy. They always have genuine medicines in stock and provide caring assistance.` },
        { name: "Dr. Sunita Nair", role: "Healthcare Professional", rating: 5, quote: "Reliable, hygienic, and extremely helpful staff. Emergency prescriptions are fulfilled promptly without delay." },
        { name: "Arjun Saxena", role: "Caregiver", rating: 5, quote: `Doorstep delivery and patient guidance from ${bName} have been an absolute blessing for our family.` }
      ];
    } else {
      testItems = [
        { name: "Priya Sharma", role: "Verified Client", rating: 5, quote: `The experience with ${bName} has been phenomenal. Top quality, attentive staff, and outstanding professionalism.` },
        { name: "Rahul Verma", role: "Repeat Customer", rating: 5, quote: "Super impressed by their consistency and attention to detail. Would recommend to anyone without hesitation." },
        { name: "Ananya Patel", role: "Community Member", rating: 5, quote: `Fast, friendly, and dependable every time. ${bName} sets the gold standard in ${bCategory || "service"}.` }
      ];
    }
    homeSections.push({
      type: "testimonials",
      title: "What Our Customers Say",
      subtitle: `Real experiences from people who love ${bName}`,
      items: testItems
    });
  }

  // 5. Frequently Asked Questions
  if (!homeSections.some((s) => ["faq", "faqs"].includes(s.type))) {
    let faqItems: any[] = [];
    if (catLower.includes("server") || catLower.includes("cloud") || catLower.includes("host")) {
      faqItems = [
        { question: "How quickly are dedicated and cloud servers deployed?", answer: "Most standard server instances are provisioned instantly within 5 to 15 minutes following order confirmation." },
        { question: "Is DDoS protection and firewall security included?", answer: "Yes, automated enterprise multi-layer DDoS mitigation and advanced firewall filtering are standard on all servers." },
        { question: "Do I receive full root and IPMI / KVM access?", answer: "Absolutely. You get 100% root/administrator access and out-of-band management console control." },
        { question: "What level of customer and technical support is provided?", answer: "Our dedicated system engineers provide round-the-clock 24/7/365 assistance via ticket and priority chat." }
      ];
    } else if (catLower.includes("flower") || catLower.includes("florist")) {
      faqItems = [
        { question: "How fresh are your flowers and arrangements?", answer: "We hand-select fresh morning blossoms directly from verified growers every single day to ensure lasting vibrancy." },
        { question: "Can I place custom orders for specific bouquets or events?", answer: `Yes! ${bName} specializes in custom designed bouquets, festive hampers, and full event floral styling.` },
        { question: "Do you provide same-day flower delivery?", answer: "Yes, we offer express same-day doorstep delivery for orders placed before our afternoon cutoff." },
        { question: "How can I keep my flowers fresh for longer?", answer: "Trim stems slightly at an angle, change the vase water every two days, and keep flowers away from direct sunlight." }
      ];
    } else if (catLower.includes("sweet") || catLower.includes("mithai") || catLower.includes("bakery")) {
      faqItems = [
        { question: "Are your sweets prepared fresh daily?", answer: "Yes, all our sweets and delicacies are freshly prepared every morning using pure ingredients and traditional recipes." },
        { question: "Do you accept bulk orders for weddings and festivals?", answer: `Yes, ${bName} provides personalized bulk gift boxes and event catering for weddings, corporate gifts, and festivals.` },
        { question: "What is the typical shelf life of your offerings?", answer: "Dry and roasted varieties typically last 2 to 3 weeks, while milk-based sweets are best enjoyed within 3 to 5 days." },
        { question: "Do you offer sugar-free or dietary-conscious options?", answer: "Yes, we craft special sugar-free and dry-fruit-only selections to cater to health-conscious patrons." }
      ];
    } else if (catLower.includes("medical") || catLower.includes("clinic") || catLower.includes("pharma")) {
      faqItems = [
        { question: "Are all medications and health supplies verified and genuine?", answer: "100%. We source strictly from authorized pharmaceutical distributors with verified batch certificates." },
        { question: "Do you offer prescription fulfillment and consultations?", answer: "Yes, our qualified pharmacists review your prescription carefully and guide you on dosage and instructions." },
        { question: "Do you provide home delivery for essential medicines?", answer: "Yes, we offer prompt doorstep delivery across our local coverage area for your convenience." },
        { question: "What are your operating hours for urgent needs?", answer: `${bName} operates extended daily hours and provides on-call emergency healthcare assistance.` }
      ];
    } else {
      faqItems = [
        { question: `How can I inquire about products or services at ${bName}?`, answer: "You can reach us directly through our Contact form, visit our location, or call our customer service desk." },
        { question: "Do you provide customized solutions tailored to specific needs?", answer: "Yes! We work closely with each client to provide personalized recommendations and custom packages." },
        { question: "What is your commitment to quality and satisfaction?", answer: "We back every offering with a 100% satisfaction guarantee, ensuring uncompromised standards." },
        { question: "What are your standard turnaround or delivery times?", answer: "We prioritize fast, efficient fulfillment and will keep you updated every step of the way." }
      ];
    }
    homeSections.push({
      type: "faq",
      title: "Frequently Asked Questions",
      subtitle: `Helpful answers to common questions about ${bName}`,
      items: faqItems
    });
  }

  // 6. Call to Action Banner
  if (!homeSections.some((s) => ["cta", "banner"].includes(s.type))) {
    homeSections.push({
      type: "cta",
      title: `Ready to Experience the Best in ${bCategory}?`,
      subtitle: `Connect with ${bName} today. We are here to deliver exceptional quality, personalized care, and lasting satisfaction.`,
      cta: "Contact Us Today",
      secondary_cta: `Explore ${serviceTabName}`
    });
  }

  resolvedPages.push({ name: "Home", id: "home", sections: homeSections });

  // 2. ABOUT PAGE
  const rawAboutPage = existingPageMap.get("about");
  let aboutSections: WebsiteSection[] = [];
  if (rawAboutPage?.sections?.length) {
    aboutSections = rawAboutPage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  } else {
    const existingAbout = allIncomingSections.find((s: any) => ["about", "story"].includes(s.type));
    const aboutStory = existingAbout || {
      type: "about",
      title: `Our Story & Mission`,
      subtitle: `Dedicated to excellence in ${bCategory}`,
      description: `At ${bName}, our journey is built upon a profound passion for excellence. We believe in delivering genuine value, personal attention, and memorable experiences for every customer who walks through our doors or visits us online.`
    };
    const aboutFeatures = {
      type: "features",
      title: "Our Guiding Values",
      subtitle: "The principles that define our craft and customer experience",
      items: [
        { title: "Authenticity & Care", description: "Every offering is created and handled with true dedication." },
        { title: "Customer Focused", description: "Your satisfaction and joy inspire everything we do." },
        { title: "Continuous Excellence", description: "Constantly refining our standards to bring you the very best." }
      ]
    };
    const existingGallery = allIncomingSections.find((s: any) => ["gallery", "portfolio"].includes(s.type));
    aboutSections = [aboutStory, aboutFeatures];
    if (existingGallery) aboutSections.push(existingGallery);
  }
  resolvedPages.push({ name: "About", id: "about", sections: aboutSections });

  // 3. SERVICES / PRODUCTS PAGE
  const rawServicePage =
    existingPageMap.get("services") ||
    existingPageMap.get("products") ||
    existingPageMap.get(serviceTabName.toLowerCase());
  let serviceSections: WebsiteSection[] = [];
  if (rawServicePage?.sections?.length) {
    serviceSections = rawServicePage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  } else {
    const existingProducts = allIncomingSections.find((s: any) =>
      ["products", "menu", "bouquets", "catalog", "programs", "offerings"].includes(s.type)
    );
    const prodSection = existingProducts || {
      type: "products",
      title: `Featured ${serviceTabName}`,
      subtitle: `Explore our specialized ${bCategory} catalog and offerings`,
      items: [
        {
          title: "Signature Selection",
          description: `Our most beloved, handcrafted ${bCategory} offering.`,
          price: "Inquire for quote"
        },
        {
          title: "Premium Choice",
          description: "Elevated quality and bespoke attention to every single detail.",
          price: "Inquire for quote"
        },
        {
          title: "Custom Tailored Package",
          description: "Designed specifically according to your personal requirements.",
          price: "Custom quote"
        },
        {
          title: "Seasonal Special",
          description: "Freshly curated, timely, and always crafted with the utmost care.",
          price: "Inquire for quote"
        }
      ]
    };
    const gallery = allIncomingSections.find((s: any) => ["gallery", "portfolio"].includes(s.type)) || {
      type: "gallery",
      title: "Showcase Gallery",
      subtitle: `A visual glimpse into ${bName}`,
      items: [
        { title: "Showcase One" },
        { title: "Showcase Two" },
        { title: "Showcase Three" },
        { title: "Showcase Four" }
      ]
    };
    serviceSections = [prodSection, gallery];
  }
  resolvedPages.push({
    name: serviceTabName,
    id: serviceTabName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    sections: serviceSections
  });

  // 4. CONTACT PAGE
  const rawContactPage = existingPageMap.get("contact");
  let contactSections: WebsiteSection[] = [];
  if (rawContactPage?.sections?.length) {
    contactSections = rawContactPage.sections.filter((s: any) => s.type !== "navbar" && s.type !== "footer");
  } else {
    const existingContact = allIncomingSections.find((s: any) => s.type === "contact");
    const contactSec = existingContact || {
      type: "contact",
      title: "Contact & Inquiries",
      subtitle: `We are here to assist you. Get in touch with ${bName} today.`,
      hours: "Monday - Saturday: 9:00 AM - 8:00 PM"
    };
    contactSections = [contactSec];
  }
  resolvedPages.push({ name: "Contact", id: "contact", sections: contactSections });

  // Navigation tabs derived from guaranteed pages
  const navTabs = resolvedPages.map((p) => ({
    name: escapeHtml(p.name),
    id: p.id
  }));

  let pagesBodyHtml = "";

  resolvedPages.forEach((page, pIdx) => {
    let pageSectionsHtml = "";

    page.sections.forEach((section: WebsiteSection, idx: number) => {
      const sectionType = (section.type || "section").toLowerCase();
      // Skip redundant navbar and footer sections in page body
      if (sectionType === "navbar" || sectionType === "footer") return;

      const rawTitle = section.title || section.name || "";
      const sTitle = escapeHtml(rawTitle);
      const sSubtitle = escapeHtml(section.subtitle || "");
      const sDesc = escapeHtml(section.description || section.content || "");
      const sectionId = rawTitle
        ? `section-${rawTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`
        : `section-${sectionType}-${idx}`;

      // 1. HERO SECTION
      if (sectionType === "hero") {
        const heroImg = resolveImageUrl(section.image_url, bCategory, "hero", rawTitle, data.business_name, 1200, 700);

        pageSectionsHtml += `
          <section id="${sectionId}" class="relative bg-gradient-to-b from-gray-50/70 to-white py-10 sm:py-16 md:py-20 border-b border-gray-100 overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
                <div class="text-center md:text-left">
                  <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 sm:mb-4 tracking-wider uppercase">${escapeHtml(bCategory)}</span>
                  <h1 class="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
                    <span class="block text-primary">${sTitle || bName}</span>
                  </h1>
                  ${sSubtitle || sDesc ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto md:mx-0">${sSubtitle || sDesc}</p>` : ""}
                  <div class="mt-6 sm:mt-8 flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
                    <button type="button" onclick="switchWebsitePage('contact')" class="inline-flex items-center justify-center px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-white font-semibold bg-primary hover:bg-secondary transition shadow-lg shadow-primary/25 text-xs sm:text-sm cursor-pointer">
                      ${escapeHtml(section.cta || "Explore Now")}
                    </button>
                    ${
                      section.secondary_cta
                        ? `<button type="button" onclick="switchWebsitePage('about')" class="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition text-xs sm:text-sm cursor-pointer">${escapeHtml(section.secondary_cta)}</button>`
                        : ""
                    }
                  </div>
                  <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center md:justify-start gap-3 sm:gap-5 text-[11px] sm:text-xs text-gray-500 font-medium">
                    <span class="flex items-center gap-1"><span class="text-amber-500 font-bold">★</span> 4.9/5 Rating</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><span class="text-emerald-500 font-bold">✓</span> Verified Quality</span>
                    <span>•</span>
                    <span class="flex items-center gap-1"><span class="text-primary font-bold">⚡</span> Prompt Service</span>
                  </div>
                </div>
                <div class="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-video md:aspect-[4/3] bg-gray-100 max-h-96">
                  <img src="${heroImg}" alt="${sTitle || bName}" class="w-full h-full object-cover transition duration-700 hover:scale-105" loading="eager" />
                </div>
              </div>
            </div>
          </section>
        `;
      }

      // 1b. STATS / METRICS BAR
      else if (sectionType === "stats" || sectionType === "metrics") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-8 sm:py-12 bg-gray-50/80 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                ${items
                  .map((stat: any) => {
                    const val = escapeHtml(stat.value || "100%");
                    const lbl = escapeHtml(stat.label || stat.title || "Quality");
                    const desc = escapeHtml(stat.description || "");
                    return `
                      <div class="p-4 sm:p-6 bg-white rounded-2xl border border-gray-100 text-center shadow-xs hover:border-primary/30 hover:shadow-md transition duration-300">
                        <div class="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">${val}</div>
                        <div class="mt-1 text-xs sm:text-sm font-bold text-gray-900">${lbl}</div>
                        ${desc ? `<p class="mt-1 text-[11px] sm:text-xs text-gray-500 leading-snug">${desc}</p>` : ""}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 2. PRODUCTS / BOUQUETS / MENU / CATALOG / ITEMS
      else if (
        sectionType === "products" ||
        sectionType === "menu" ||
        sectionType === "bouquets" ||
        sectionType === "catalog" ||
        sectionType === "programs" ||
        sectionType === "items" ||
        sectionType === "offerings"
      ) {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-gray-50/70 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Featured Offerings"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">${sSubtitle}</p>` : ""}
              </div>
              <div class="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                ${items
                  .map((item: WebsiteSectionItem, itemIdx: number) => {
                    const itemTitle = escapeHtml(item.title || item.name || `Option ${itemIdx + 1}`);
                    const itemDesc = escapeHtml(item.description || "");
                    const itemPrice = escapeHtml(item.price || "");
                    const itemImg = resolveImageUrl(item.image_url, bCategory, sectionType, item.title || item.name, data.business_name, 600, 450);

                    return `
                      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
                        <div class="relative h-48 sm:h-56 bg-gray-100 overflow-hidden">
                          <img class="w-full h-full object-cover transition duration-500 hover:scale-105" src="${itemImg}" alt="${itemTitle}" loading="lazy" />
                          ${itemPrice ? `<span class="absolute top-3 right-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow">${itemPrice}</span>` : ""}
                        </div>
                        <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 class="text-lg sm:text-xl font-bold text-gray-900">${itemTitle}</h3>
                            ${itemDesc ? `<p class="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">${itemDesc}</p>` : ""}
                          </div>
                          <div class="mt-4 sm:mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                            ${itemPrice ? `<span class="text-base sm:text-lg font-bold text-primary">${itemPrice}</span>` : `<span></span>`}
                            <button onclick="alert('Inquiry for: ${itemTitle.replace(/'/g, "\\'")}')" class="px-4 py-2 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition cursor-pointer">Select</button>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 3. FEATURES / SERVICES / FACILITIES
      else if (sectionType === "features" || sectionType === "services" || sectionType === "facilities") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-20 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Why Choose Us"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : ""}
              </div>
              <div class="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                ${items
                  .map((item: WebsiteSectionItem, itemIdx: number) => {
                    const itemTitle = escapeHtml(item.title || item.name || `Feature ${itemIdx + 1}`);
                    const itemDesc = escapeHtml(item.description || "");
                    const itemImg = item.image_url ? resolveImageUrl(item.image_url, bCategory, sectionType, item.title, data.business_name, 500, 320) : null;

                    return `
                      <div class="p-6 sm:p-8 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary/30 transition duration-300">
                        ${itemImg ? `<div class="mb-4 sm:mb-5 h-36 sm:h-44 rounded-xl overflow-hidden"><img src="${itemImg}" alt="${itemTitle}" class="w-full h-full object-cover" loading="lazy" /></div>` : `<div class="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base sm:text-lg mb-4 sm:mb-5">✓</div>`}
                        <h3 class="text-lg sm:text-xl font-bold text-gray-900">${itemTitle}</h3>
                        ${itemDesc ? `<p class="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">${itemDesc}</p>` : ""}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 4. GALLERY / PORTFOLIO
      else if (sectionType === "gallery" || sectionType === "portfolio") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-gray-50 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Visual Gallery"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : ""}
              </div>
              <div class="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                ${items
                  .map((item: WebsiteSectionItem, itemIdx: number) => {
                    const itemTitle = escapeHtml(item.title || item.name || `Photo ${itemIdx + 1}`);
                    const itemImg = resolveImageUrl(item.image_url, bCategory, "gallery", item.title || item.name, data.business_name, 600, 600);

                    return `
                      <div class="relative group rounded-xl overflow-hidden aspect-square shadow-sm bg-gray-200">
                        <img src="${itemImg}" alt="${itemTitle}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-2 sm:p-4">
                          <span class="text-white text-xs sm:text-sm font-semibold truncate">${itemTitle}</span>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 5. ABOUT SECTION
      else if (sectionType === "about" || sectionType === "story") {
        const aboutImg = resolveImageUrl(section.image_url, bCategory, "about", "workshop", data.business_name, 800, 600);

        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                <div>
                  <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || `About ${bName}`}</h2>
                  ${sSubtitle ? `<p class="mt-2 sm:mt-3 text-base sm:text-lg font-medium text-primary">${sSubtitle}</p>` : ""}
                  <div class="mt-4 sm:mt-6 text-gray-600 space-y-3 sm:space-y-4 text-sm sm:text-base leading-relaxed">
                    <p>${sDesc || `At ${bName}, we are dedicated to providing the highest quality ${escapeHtml(bCategory)} offerings. We strive for excellence, personal care, and customer satisfaction.`}</p>
                  </div>
                </div>
                <div class="mt-4 sm:mt-8 lg:mt-0">
                  <div class="relative rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                    <img class="w-full h-56 sm:h-72 md:h-96 object-cover" src="${aboutImg}" alt="${sTitle || bName}" loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        `;
      }

      // 6. CONTACT SECTION
      else if (sectionType === "contact") {
        const address = escapeHtml(section.address || data.address || "");
        const phone = escapeHtml(section.phone || data.phone || "");
        const email = escapeHtml(section.email || data.email || "");
        const hours = escapeHtml(section.hours || data.hours || "");

        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">${sTitle || "Contact & Inquiries"}</h2>
                <p class="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle || sDesc || `Reach out to ${bName}. We look forward to serving you.`}</p>
              </div>
              <div class="max-w-xl mx-auto bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
                ${
                  address || phone || email || hours
                    ? `
                  <div class="space-y-2 sm:space-y-3 mb-6 text-xs sm:text-sm text-gray-700">
                    ${address ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Location:</span> ${address}</p>` : ""}
                    ${phone ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Phone:</span> ${phone}</p>` : ""}
                    ${email ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Email:</span> ${email}</p>` : ""}
                    ${hours ? `<p class="flex items-center gap-2"><span class="font-bold text-primary">Hours:</span> ${hours}</p>` : ""}
                  </div>
                `
                    : ""
                }
                <form onsubmit="event.preventDefault(); alert('Message sent successfully!');" class="space-y-3 sm:space-y-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                    <input type="text" required placeholder="Full Name" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">Email / Phone</label>
                    <input type="text" required placeholder="contact@example.com" class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1">How can we help?</label>
                    <textarea rows="3" required placeholder="Tell us what you need..." class="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                  </div>
                  <button type="submit" class="w-full py-3 px-6 rounded-xl text-white font-semibold bg-primary hover:bg-secondary transition shadow-md text-sm sm:text-base cursor-pointer">Send Inquiry</button>
                </form>
              </div>
            </div>
          </section>
        `;
      }

      // 7. TESTIMONIALS / REVIEWS
      else if (sectionType === "testimonials" || sectionType === "reviews") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-gray-50/70 border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 tracking-wider uppercase">Customer Love</span>
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "What Our Customers Say"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Hear directly from clients who trust ${bName} every day.</p>`}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                ${items
                  .map((item: any, i: number) => {
                    const ratingNum = item.rating || 5;
                    const stars = "★".repeat(ratingNum) + "☆".repeat(Math.max(0, 5 - ratingNum));
                    const authorName = escapeHtml(item.name || item.author || `Client ${i + 1}`);
                    const authorRole = escapeHtml(item.role || item.title || "Verified Customer");
                    const quoteText = escapeHtml(item.quote || item.text || item.description || "Outstanding quality and service!");
                    const initial = authorName.charAt(0).toUpperCase();

                    return `
                      <div class="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between">
                        <div>
                          <div class="flex items-center gap-1 text-amber-400 text-sm sm:text-base mb-4 tracking-wider">
                            ${stars}
                          </div>
                          <p class="text-xs sm:text-sm text-gray-700 leading-relaxed italic">"${quoteText}"</p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-gray-50 flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-primary/10 text-primary font-extrabold flex items-center justify-center text-sm shadow-xs">
                            ${initial}
                          </div>
                          <div>
                            <h4 class="text-xs sm:text-sm font-bold text-gray-900">${authorName}</h4>
                            <p class="text-[11px] sm:text-xs text-gray-500">${authorRole}</p>
                          </div>
                        </div>
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 8. FAQ SECTION
      else if (sectionType === "faq" || sectionType === "faqs") {
        const items = section.items || [];
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 md:py-24 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary mb-3 tracking-wider uppercase">Answers & Support</span>
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">${sTitle || "Frequently Asked Questions"}</h2>
                ${sSubtitle ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">${sSubtitle}</p>` : `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Quick answers to common questions about our products and services.</p>`}
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
                ${items
                  .map((item: any, i: number) => {
                    const question = escapeHtml(item.question || item.title || `Question ${i + 1}`);
                    const answer = escapeHtml(item.answer || item.description || item.content || "");
                    return `
                      <div class="p-5 sm:p-7 bg-gray-50/80 rounded-2xl border border-gray-100 hover:border-primary/40 hover:bg-white transition duration-200">
                        <h3 class="text-sm sm:text-base font-bold text-gray-900 flex items-start gap-2.5">
                          <span class="text-primary font-black shrink-0">Q.</span>
                          <span>${question}</span>
                        </h3>
                        ${answer ? `<p class="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">${answer}</p>` : ""}
                      </div>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </section>
        `;
      }

      // 9. CTA BANNER
      else if (sectionType === "cta" || sectionType === "banner") {
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-14 sm:py-20 bg-gradient-to-r from-gray-900 via-primary/95 to-gray-900 text-white relative overflow-hidden">
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <span class="inline-block px-3 py-1 text-xs font-bold rounded-full bg-white/10 text-white mb-3 sm:mb-4 tracking-wider uppercase border border-white/20">Get Started</span>
              <h2 class="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">${sTitle || `Ready to experience ${bName}?`}</h2>
              <p class="mt-3 sm:mt-5 text-sm sm:text-base md:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed">
                ${sSubtitle || sDesc || `Connect with us today for personalized solutions, orders, or consultations.`}
              </p>
              <div class="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                <button type="button" onclick="switchWebsitePage('contact')" class="inline-flex items-center justify-center px-7 sm:px-9 py-3 sm:py-3.5 rounded-xl font-bold bg-white text-gray-900 hover:bg-gray-100 transition shadow-xl text-xs sm:text-sm cursor-pointer">
                  ${escapeHtml(section.cta || "Contact Us Today")}
                </button>
                ${
                  section.secondary_cta
                    ? `<button type="button" onclick="switchWebsitePage('${serviceTabName.toLowerCase().replace(/[^a-z0-9]/g, "-")}')" class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold border border-white/30 text-white hover:bg-white/10 transition text-xs sm:text-sm cursor-pointer">${escapeHtml(section.secondary_cta)}</button>`
                    : ""
                }
              </div>
            </div>
          </section>
        `;
      }

      // 10. GENERIC SECTION FALLBACK
      else {
        pageSectionsHtml += `
          <section id="${sectionId}" class="py-12 sm:py-16 bg-white border-b border-gray-100">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              ${sTitle ? `<h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">${sTitle}</h2>` : ""}
              ${sDesc ? `<p class="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">${sDesc}</p>` : ""}
            </div>
          </section>
        `;
      }
    });

    pagesBodyHtml += `
      <div id="page-view-${page.id}" class="website-page-view ${pIdx === 0 ? "" : "hidden"}">
        ${pageSectionsHtml}
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${bName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = {
          theme: {
            extend: {
              colors: {
                primary: '${primaryColor}',
                secondary: '${secondaryColor}',
                accent: '${accentColor}'
              }
            }
          }
        }
      </script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap');
        
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
          --accent-color: ${accentColor};
          --btn-bg: ${buttonColor};
          --btn-text: ${buttonTextColor};
          --btn-hover: ${buttonHoverColor};
          --btn-radius: ${buttonRadius};
          --font-family: '${fontFamily}', sans-serif;
        }

        html { scroll-behavior: smooth; }
        body { font-family: var(--font-family); }
        h1, h2, h3, h4, .font-heading { font-family: var(--font-family); }

        /* Button styling overrides */
        .bg-primary, .site-btn-primary, button.cta-btn, button[type="submit"] {
          background-color: var(--btn-bg) !important;
          color: var(--btn-text) !important;
          border-radius: var(--btn-radius) !important;
        }
        .bg-primary:hover, .site-btn-primary:hover, button.cta-btn:hover, button[type="submit"]:hover {
          background-color: var(--btn-hover) !important;
          filter: brightness(0.95);
        }
        .text-primary { color: var(--primary-color) !important; }
        .border-primary { border-color: var(--primary-color) !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      </style>
    </head>
    <body class="bg-gray-50 text-gray-900 antialiased selection:bg-primary selection:text-white min-h-screen flex flex-col justify-between">
      <!-- Navbar with Desktop Tabs and Mobile Toggle -->
      <nav class="bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 sm:h-20 items-center">
            <!-- Brand Logo & Name side by side -->
            <div class="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer shrink-0" onclick="switchWebsitePage('home')">
              ${
                logoUrl
                  ? `<img src="${logoUrl}" alt="${bName}" class="h-8 sm:h-10 w-auto object-contain rounded-md" />`
                  : `<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm sm:text-base bg-primary shadow-xs">${bName.charAt(0).toUpperCase()}</div>`
              }
              <span class="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight">${bName}</span>
            </div>

            <!-- Desktop Navigation Tabs -->
            <div class="${mode === "mobile" ? "hidden" : mode === "tablet" ? "flex" : "hidden md:flex"} items-center space-x-1 lg:space-x-3">
              ${navTabs
                .filter((t) => t.id !== "contact")
                .map(
                  (tab: any, idx: number) =>
                    `<button type="button" onclick="switchWebsitePage('${tab.id}')" data-nav-id="${tab.id}" class="nav-tab-btn px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                      idx === 0
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }">${tab.name}</button>`
                )
                .join("")}
              <button type="button" onclick="switchWebsitePage('contact')" data-nav-id="contact" class="nav-tab-btn ml-3 bg-primary text-white px-4 sm:px-5 py-2 rounded-xl font-bold hover:bg-secondary transition shadow-md shadow-primary/20 text-xs sm:text-sm whitespace-nowrap cursor-pointer">
                Contact
              </button>
            </div>

            <!-- Mobile Hamburger Toggle Button -->
            <div class="${mode === "mobile" ? "flex" : mode === "tablet" ? "hidden" : "flex md:hidden"} items-center">
              <button type="button" id="mobile-menu-btn" onclick="toggleMobileNavbar()" aria-label="Toggle navigation menu" class="p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 transition focus:outline-none cursor-pointer">
                <svg id="hamburger-svg" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg id="close-svg" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Dropdown Drawer -->
        <div id="mobile-menu-dropdown" class="hidden border-t border-gray-100 bg-white/98 backdrop-blur-md px-4 pt-2 pb-4 space-y-1 shadow-lg">
          ${navTabs
            .map(
              (tab: any, idx: number) =>
                `<button type="button" onclick="switchWebsitePage('${tab.id}'); toggleMobileNavbar(false);" data-nav-id="${tab.id}" class="nav-tab-btn block w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                  idx === 0
                    ? "text-primary bg-primary/10 font-bold"
                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                }">${tab.name}</button>`
            )
            .join("")}
        </div>
      </nav>

      <main class="flex-1">
        ${pagesBodyHtml}
      </main>

      <footer class="bg-gray-950 text-gray-400 border-t border-gray-800">
        <div class="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 text-center sm:text-left">
            <div>
              <div class="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                ${logoUrl ? `<img src="${logoUrl}" alt="${bName}" class="h-6 w-auto object-contain" />` : ""}
                <h3 class="text-xl sm:text-2xl font-black text-white">${bName}</h3>
              </div>
              <p class="text-xs sm:text-sm leading-relaxed">${escapeHtml(data.tagline || `Quality products and exceptional service tailored to you.`)}</p>
            </div>
            <div>
              <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">Pages & Links</h4>
              <ul class="space-y-2 text-xs sm:text-sm">
                ${navTabs.map((tab: any) => `<li><button type="button" onclick="switchWebsitePage('${tab.id}')" class="hover:text-white transition text-xs sm:text-sm cursor-pointer">${tab.name}</button></li>`).join("")}
              </ul>
            </div>
            <div class="sm:col-span-2 md:col-span-1">
              <h4 class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">About</h4>
              <p class="text-xs sm:text-sm leading-relaxed">${bCategory ? `${bName} is your trusted ${escapeHtml(bCategory)}.` : `Dedicated to outstanding quality and customer satisfaction.`}</p>
            </div>
          </div>
          <div class="border-t border-gray-900 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs text-gray-500">
            &copy; ${new Date().getFullYear()} ${bName}. All rights reserved.
          </div>
        </div>
      </footer>

      <script>
        function toggleMobileNavbar(forcedState) {
          var menu = document.getElementById('mobile-menu-dropdown');
          var burger = document.getElementById('hamburger-svg');
          var close = document.getElementById('close-svg');
          if (!menu) return;
          var isOpen = !menu.classList.contains('hidden');
          var shouldOpen = typeof forcedState === 'boolean' ? forcedState : !isOpen;
          if (shouldOpen) {
            menu.classList.remove('hidden');
            if (burger) burger.classList.add('hidden');
            if (close) close.classList.remove('hidden');
          } else {
            menu.classList.add('hidden');
            if (burger) burger.classList.remove('hidden');
            if (close) close.classList.add('hidden');
          }
        }

        function switchWebsitePage(targetId) {
          var cleanId = (targetId || 'home').toLowerCase().replace(/[^a-z0-9]/g, '-');
          var views = document.querySelectorAll('.website-page-view');
          var targetView = document.getElementById('page-view-' + cleanId);

          if (!targetView) {
            targetView = document.querySelector('[id*="page-view-' + cleanId + '"]');
          }

          if (targetView) {
            views.forEach(function(v) { v.classList.add('hidden'); });
            targetView.classList.remove('hidden');
          } else {
            // Keep first view visible and scroll to section anchor
            if (views.length > 0) {
              views.forEach(function(v, i) {
                if (i === 0) v.classList.remove('hidden');
                else v.classList.add('hidden');
              });
            }
            var targetSec = document.getElementById(targetId) || document.getElementById('section-' + cleanId);
            if (targetSec) {
              targetSec.scrollIntoView({ behavior: 'smooth' });
            }
          }

          // Update active state on nav buttons (desktop and mobile)
          var buttons = document.querySelectorAll('.nav-tab-btn');
          buttons.forEach(function(btn) {
            if (btn.getAttribute('data-nav-id') === cleanId) {
              btn.classList.add('text-primary', 'bg-primary/10', 'font-bold');
              btn.classList.remove('text-gray-600', 'text-gray-700', 'hover:bg-gray-50');
            } else {
              btn.classList.remove('text-primary', 'bg-primary/10', 'font-bold');
              btn.classList.add('text-gray-600', 'hover:bg-gray-50');
            }
          });

          // Close mobile menu if open
          toggleMobileNavbar(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        window.addEventListener('message', function(e) {
          if (e.data && e.data.action === 'switchPage') {
            switchWebsitePage(e.data.pageId);
          }
        });
      </script>
    </body>
    </html>
  `;
};

export { generateHtmlFromJSON, resolveImageUrl, resolveCuratedUnsplash, generateDynamicSvgLogo, escapeHtml };
