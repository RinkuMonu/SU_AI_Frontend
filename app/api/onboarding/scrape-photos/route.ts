import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get("url");
  if (!urlParam) {
    return NextResponse.json({ success: false, error: "Missing url parameter", photos: [] }, { status: 400 });
  }

  return handleScrape(urlParam);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urlParam = body.url || body.website_url;
    if (!urlParam) {
      return NextResponse.json({ success: false, error: "Missing url parameter", photos: [] }, { status: 400 });
    }
    return handleScrape(urlParam);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body", photos: [] }, { status: 400 });
  }
}

async function handleScrape(rawUrl: string) {
  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json({ success: false, error: `HTTP ${res.status}`, photos: [] });
    }

    const html = await res.text();
    const baseUrl = new URL(targetUrl);

    const photos: string[] = [];
    const seen = new Set<string>();

    const addPhoto = (src: string | null | undefined) => {
      if (!src) return;
      let clean = src.trim();
      if (!clean || clean.startsWith("data:") || clean.startsWith("blob:") || clean.includes("1x1") || clean.includes("pixel.gif") || clean.includes("spacer.gif")) {
        return;
      }
      try {
        let full = clean.startsWith("//") ? `https:${clean}` : clean;
        const resolved = new URL(full, baseUrl).href;
        // Exclude small icon SVGs, trackers, badges
        const lower = resolved.toLowerCase();
        if (
          lower.includes("analytics") ||
          lower.includes("tracker") ||
          lower.includes("facebook.com/tr") ||
          lower.includes("doubleclick") ||
          lower.endsWith(".svg")
        ) {
          return;
        }

        if (!seen.has(resolved)) {
          seen.add(resolved);
          photos.push(resolved);
        }
      } catch (_) {}
    };

    // 1. OG / Meta images
    const ogMatches = html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image|image)["'][^>]+content=["']([^"']+)["']/gi);
    for (const match of ogMatches) {
      addPhoto(match[1]);
    }
    const ogMatchesReversed = html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image|image)["']/gi);
    for (const match of ogMatchesReversed) {
      addPhoto(match[1]);
    }

    // 2. Link rel="image_src"
    const linkMatches = html.matchAll(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/gi);
    for (const match of linkMatches) {
      addPhoto(match[1]);
    }

    // 3. Img tags (src, data-src, data-lazy-src, data-original)
    const imgTagMatches = html.matchAll(/<img[^>]+>/gi);
    for (const imgMatch of imgTagMatches) {
      const tag = imgMatch[0];
      const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
      const dataSrc = tag.match(/\sdata-src=["']([^"']+)["']/i)?.[1];
      const dataLazy = tag.match(/\sdata-lazy-src=["']([^"']+)["']/i)?.[1];
      const dataOrig = tag.match(/\sdata-original=["']([^"']+)["']/i)?.[1];
      const srcset = tag.match(/\ssrcset=["']([^"']+)["']/i)?.[1];

      addPhoto(src);
      addPhoto(dataSrc);
      addPhoto(dataLazy);
      addPhoto(dataOrig);

      if (srcset) {
        const parts = srcset.split(",").map((s) => s.trim().split(/\s+/)[0]);
        for (const p of parts) {
          addPhoto(p);
        }
      }
    }

    // 4. Source tags inside picture
    const sourceMatches = html.matchAll(/<source[^>]+(?:srcset|src)=["']([^"']+)["']/gi);
    for (const match of sourceMatches) {
      const parts = match[1].split(",").map((s) => s.trim().split(/\s+/)[0]);
      for (const p of parts) {
        addPhoto(p);
      }
    }

    // 5. CSS background-image
    const bgMatches = html.matchAll(/background(?:-image)?:\s*url\((?:['"]?)([^'"\)]+)(?:['"]?)\)/gi);
    for (const match of bgMatches) {
      addPhoto(match[1]);
    }

    return NextResponse.json({
      success: true,
      count: photos.length,
      photos: photos.slice(0, 30),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || "Failed to fetch website photos",
      photos: [],
    });
  }
}

