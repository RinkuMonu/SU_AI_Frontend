export interface CompanyProfile {
  name: string;
  poweredBy: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  taglines: {
    primary: string;
    supporting: string;
    brandPromise: string;
    slogan: string;
  };
  aboutUs: {
    heading: string;
    paragraphs: string[];
  };
  mission: {
    heading: string;
    subtitle: string;
    description: string;
    pillars: string[];
    conclusion: string;
  };
  vision: {
    heading: string;
    subtitle: string;
    paragraphs: string[];
    statement: string;
  };
  directorsVoice: {
    heading: string;
    subtitle: string;
    intro?: string;
    role?: string;
    quote: string[];
    author: string;
    poweredBy: string;
  };
  coreBelief: {
    heading: string;
    subtitle: string;
    description: string;
  };
}

export const companyProfile: CompanyProfile = {
  name: "DhandaGrow AI",
  poweredBy: "Sevenunique Tech Solutions Private Limited",
  website: "https://dhandagrow.com",
  email: "support@dhandagrow.com",
  phone: "+91-8741886688",
  address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
  taglines: {
    primary: "Har Dukaan Digital, Har Dhanda Grow.",
    supporting: "Create Smarter. Automate Better. Grow Faster.",
    brandPromise: "Your AI Partner for Digital Business Growth.",
    slogan: "DhandaGrow AI — Digital Bano, Smart Bano, Business Grow Karo.",
  },
  aboutUs: {
    heading: "Empowering Every Business to Grow Digitally",
    paragraphs: [
      "DhandaGrow AI is an AI-powered business growth platform built to help shopkeepers, small businesses, entrepreneurs, and growing brands establish a strong digital presence and grow their business smarter.",
      "We believe every shopkeeper deserves access to the digital tools, marketing capabilities, and automation that were once available only to large businesses.",
      "With DhandaGrow AI, businesses can create social media posts, generate reels and marketing creatives, manage their online presence, automate content planning, and streamline customer engagement — all from one platform.",
      "Our mission is to simplify digital transformation by combining artificial intelligence, marketing automation, and easy-to-use technology so business owners can spend less time managing repetitive tasks and more time growing their business.",
    ],
  },
  mission: {
    heading: "Our Mission",
    subtitle: "Har Dukaan Ko Digital, Har Business Ko Growth",
    description:
      "Our mission is to empower every shopkeeper, entrepreneur, and small business in India with affordable, accessible, and innovative AI-powered digital tools. Through DhandaGrow AI, we aim to simplify digital marketing, automate repetitive tasks, and make professional content creation accessible to businesses of every size. We help businesses build a strong online presence, create engaging social media content, connect with their target audience, and manage their digital marketing more efficiently. Our goal is to reduce the complexity and cost of digital growth so that every business can focus on what matters most — serving customers, building trust, and growing successfully in the digital marketplace.",
    paragraphs: [
      "Our mission is to empower every shopkeeper, entrepreneur, and small business in India with affordable, accessible, and innovative AI-powered digital tools. Through DhandaGrow AI, we aim to simplify digital marketing, automate repetitive tasks, and make professional content creation accessible to businesses of every size.",
      "We help businesses build a strong online presence, create engaging social media content, connect with their target audience, and manage their digital marketing more efficiently. Our goal is to reduce the complexity and cost of digital growth so that every business can focus on what matters most — serving customers, building trust, and growing successfully in the digital marketplace."
    ],
    conclusion:
      "We want digital growth to be practical, affordable, and accessible to businesses of every size.",
  },
  vision: {
    heading: "Our Vision",
    subtitle: "A Digitally Empowered India",
    description:
      "Our vision is to build a digitally empowered India where every local shopkeeper, small business owner, and entrepreneur has the opportunity to grow and compete in the modern marketplace. We envision a future where advanced AI technology and smart digital solutions are no longer limited to large companies but are accessible to businesses in every city, town, and village. Through DhandaGrow AI, we aspire to make digital marketing simpler, business automation smarter, and brand growth more achievable for everyone. We believe every business deserves the right tools, opportunities, and support to establish its digital identity, reach more customers, and turn its ambitions into lasting success.",
    paragraphs: [
      "Our vision is to build a digitally empowered India where every local shopkeeper, small business owner, and entrepreneur has the opportunity to grow and compete in the modern marketplace. We envision a future where advanced AI technology and smart digital solutions are no longer limited to large companies but are accessible to businesses in every city, town, and village.",
      "Through DhandaGrow AI, we aspire to make digital marketing simpler, business automation smarter, and brand growth more achievable for everyone. We believe every business deserves the right tools, opportunities, and support to establish its digital identity, reach more customers, and turn its ambitions into lasting success."
    ],
    statement:
      "Our vision: Every business digital. Every brand visible. Every entrepreneur empowered to grow.",
  },
  directorsVoice: {
    heading: "Director’s Voice",
    subtitle: "A Message from Our Leadership",
    intro:
      "Hi, I’m Dinesh Kumar, Founder, Promoter & Managing Director of Sevenunique Tech Solutions Private Limited.",
    role: "Founder, Promoter & Managing Director",
    quote: [
      "When we look at local shops and small businesses, we see hard work, ambition, and enormous potential. But many business owners do not have the time, resources, or technical expertise to manage digital marketing consistently.",
      "We started building DhandaGrow AI with a simple belief: technology should make business easier, not more complicated.",
      "Our goal is to bring AI-powered content creation, marketing automation, and digital business tools together in one accessible platform. We want shopkeepers and entrepreneurs to create content more easily, maintain a consistent online presence, connect with customers, and focus on what matters most — growing their business.",
      "For us, DhandaGrow AI is more than a technology platform. It is a step toward making digital growth accessible to every business, regardless of its size.",
      "We are working toward a future where every shopkeeper has the opportunity to become digitally empowered and every ambitious business has the tools to grow.",
    ],
    author: "Dinesh Kumar",
    poweredBy: "Sevenunique Tech Solutions Private Limited",
  },
  coreBelief: {
    heading: "Our Core Belief",
    subtitle: "Technology for Everyone. Digital Growth for Every Business.",
    description:
      "At DhandaGrow AI, we believe that business growth should not be limited by a lack of marketing knowledge, time, or resources. By making AI and automation easier to use, we aim to help businesses build their digital identity and grow with confidence.",
  },
};
