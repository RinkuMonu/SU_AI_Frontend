import { AdRequest, AdResponse } from "@/types/ad";
import api from "@/lib/api";

export async function generateAd(
  data: AdRequest
): Promise<AdResponse> {
  const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!groqKey) {
    throw new Error("Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local");
  }

  const prompt = `
You are an expert copywriter. Generate ad copy based on the following details.
Platform: ${data.platform}
Objective: ${data.objective}
Language: ${data.language}
Target Audience: ${data.target_audience || "General Audience"}
CTA: ${data.cta || "Shop Now"}
Additional Instructions: ${data.additional_instruction || "None"}

Return ONLY a raw JSON object with NO markdown formatting, NO backticks, and NO extra text. The JSON object must have the following keys exactly:
"headline" (string, max 50 chars)
"primary_text" (string, 1-3 sentences)
"description" (string, short description)
"cta" (string)
"hashtags" (array of strings, e.g., ["fashion", "sale"])
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.NEXT_PUBLIC_GROQ_MODEL || "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate from Groq API");
    }

    const json = await response.json();
    let content = json.choices[0].message.content.trim();
    
    // Strip markdown formatting if the model still includes it
    if (content.startsWith("\`\`\`json")) {
      content = content.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    } else if (content.startsWith("\`\`\`")) {
      content = content.replace(/\`\`\`/g, "").trim();
    }

    const adData = JSON.parse(content);

    const resultAd = {
      id: "ad-" + Date.now(),
      headline: adData.headline || "Amazing Product",
      primary_text: adData.primary_text || "Check out this amazing product today.",
      description: adData.description || "Limited time offer.",
      cta: adData.cta || data.cta || "Shop Now",
      hashtags: adData.hashtags || [],
      // Groq cannot generate images, so we use a static placeholder
      creative_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000"
    };

    try {
      // Save to database
      await api.put("/api/v1/content/update", {
        type: "ad",
        platform: data.platform,
        title: resultAd.headline,
        caption: resultAd.primary_text,
        description: resultAd.description,
        hashtags: resultAd.hashtags,
        creative_url: resultAd.creative_url,
        status: "Draft",
        language: data.language,
        objective: data.objective,
        callToAction: resultAd.cta
      });
    } catch (dbErr) {
      console.error("Failed to save ad to db:", dbErr);
    }

    return resultAd;

  } catch (error: any) {
    console.error("Groq Ad Generation Error:", error);
    throw new Error(error.message || "Failed to generate dynamic ad copy.");
  }
}
