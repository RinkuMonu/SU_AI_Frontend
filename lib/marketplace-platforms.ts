export interface PlatformItem {
  id: string;
  name: string;
  description?: string;
}

export const MARKETPLACE_SELLER_PLATFORMS: PlatformItem[] = [
  { id: "amazon", name: "Amazon" },
  { id: "flipkart", name: "Flipkart" },
  { id: "myntra", name: "Myntra" },
  { id: "meesho", name: "Meesho" },
  { id: "blinkit", name: "Blinkit" },
  { id: "other", name: "Other" },
];

export const DIRECTORY_LISTING_PLATFORMS: PlatformItem[] = [
  { id: "indiamart", name: "IndiaMART" },
  { id: "justdial", name: "Justdial" },
  { id: "sulekha", name: "Sulekha" },
  { id: "tradeindia", name: "TradeIndia" },
  { id: "other", name: "Other" },
  { id: "none_of_these", name: "None of these" },
];

export const B2B_WHOLESALE_PLATFORMS: PlatformItem[] = [
  { id: "indiamart", name: "IndiaMART" },
  { id: "tradeindia", name: "TradeIndia" },
  { id: "alibaba", name: "Alibaba" },
  { id: "udaan", name: "Udaan" },
  { id: "amazon_business", name: "Amazon Business" },
  { id: "other", name: "Other" },
];

export const B2B_ADDITIONAL_LISTINGS: PlatformItem[] = [
  { id: "indiamart", name: "IndiaMART" },
  { id: "tradeindia", name: "TradeIndia" },
  { id: "alibaba", name: "Alibaba" },
  { id: "udaan", name: "Udaan" },
  { id: "amazon_business", name: "Amazon Business" },
  { id: "other", name: "Other" },
  { id: "none_of_these", name: "None of these" },
];
