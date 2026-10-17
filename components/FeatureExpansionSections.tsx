type FeatureKey =
  | 'ai-ads'
  | 'ai-avatar'
  | 'analytics'
  | 'brand-brain'
  | 'catalogue'
  | 'crm'
  | 'fashion-ai'
  | 'festival-engine'
  | 'indian-ai'
  | 'instagram-dm'
  | 'marketing-agent'
  | 'review-manager'
  | 'social-calendar'
  | 'uni-ai'
  | 'website-builder'
  | 'whatsapp-ai';


  import { Bot, MessageSquare, Target, LineChart, Sparkles, CheckCircle2, } from 'lucide-react';


type ContentCard = {
  title: string;
  description: string;
};

type FeatureContent = {
  eyebrow: string;
  title: string;
  description: string;
  benefits: ContentCard[];
  steps: ContentCard[];
  faqs: ContentCard[];
  dark?: boolean;
};

const featureContent: Record<FeatureKey, FeatureContent> = {
  'ai-ads': {
    eyebrow: 'Campaign playbook',
    title: 'Turn a product idea into a campaign that is ready to test.',
    description: 'Build a repeatable creative workflow that gives every campaign a clear audience, message, and next step.',
    benefits: [
      { title: 'Start with a clear brief', description: 'Bring your offer, audience, and campaign goal together before creating the first variation.' },
      { title: 'Create for every placement', description: 'Adapt the message and creative for the channels where your customers already spend time.' },
      { title: 'Learn from performance', description: 'Compare campaign variations and use the results to make the next round more focused.' },
    ],
    steps: [
      { title: 'Choose your objective', description: 'Set the outcome you want, from product discovery to a qualified enquiry.' },
      { title: 'Shape the creative', description: 'Generate campaign-ready copy and visual directions around your offer.' },
      { title: 'Launch and improve', description: 'Review results, keep the strongest variations, and iterate with purpose.' },
    ],
    faqs: [
      { title: 'Can I create more than one ad variation?', description: 'Yes. Explore different messages and creative directions so you can compare what resonates with your audience.' },
      { title: 'Can I tailor ads to different channels?', description: 'The campaign workflow is designed to help you prepare creative for the formats and placements you use.' },
      { title: 'Do I need an advertising team to get started?', description: 'No. Start with your product and campaign goal, then use the guided workflow to develop your first campaign.' },
    ],
    dark: true,
  },
  'ai-avatar': {
    eyebrow: 'Video studio guide',
    title: 'Make every video feel personal, polished, and on brand.',
    description: 'From a quick product explainer to a multilingual welcome, create presenter-led videos without organizing a shoot.',
    benefits: [
      { title: 'Give your message a face', description: 'Choose a presenter style that feels right for your brand, audience, and subject.' },
      { title: 'Keep production moving', description: 'Turn a finished script into a shareable video without coordinating cameras or schedules.' },
      { title: 'Reach more viewers', description: 'Prepare localized versions to make your message easier to understand across markets.' },
    ],
    steps: [
      { title: 'Pick a presenter', description: 'Select an available avatar or use a suitable custom presenter option.' },
      { title: 'Write your script', description: 'Add the words you want spoken and choose a language and delivery style.' },
      { title: 'Generate your video', description: 'Review the result, make refinements, and export the version you need.' },
    ],
    faqs: [
      { title: 'What can I use an avatar video for?', description: 'Create product explainers, onboarding messages, social videos, and other presenter-led content.' },
      { title: 'Can I make videos in different languages?', description: 'Yes. Prepare localized scripts and select from the language options available in the video studio.' },
      { title: 'Do I need video-editing experience?', description: 'No. The guided workflow takes you from presenter and script selection to a generated video.' },
    ],
  },
  analytics: {
    eyebrow: 'Your data, put to work',
    title: 'Move from scattered metrics to confident next steps.',
    description: 'Bring your most useful business signals into one place, then turn trends into decisions your team can act on.',
    benefits: [
      { title: 'See the full journey', description: 'Connect campaign activity with the traffic and customer actions that follow.' },
      { title: 'Spot changes sooner', description: 'Keep an eye on live trends so unusual movement does not get buried in a monthly report.' },
      { title: 'Plan with context', description: 'Use historical patterns and current performance to inform your next business priorities.' },
    ],
    steps: [
      { title: 'Connect your sources', description: 'Bring together the business and marketing data you want to understand.' },
      { title: 'Choose the questions', description: 'Focus your dashboards on the metrics that matter to your current goals.' },
      { title: 'Review and take action', description: 'Use the resulting view to identify opportunities and agree on what to do next.' },
    ],
    faqs: [
      { title: 'What can I track in analytics?', description: 'Use the dashboards to understand key business, marketing, traffic, and customer trends.' },
      { title: 'Can I use this to understand campaign performance?', description: 'Yes. Attribution views help connect marketing activity with the outcomes you want to measure.' },
      { title: 'Do I need an analyst to read the reports?', description: 'The dashboards are designed to make important patterns and performance indicators easier to review.' },
    ],
    dark: true,
  },
  'brand-brain': {
    eyebrow: 'Central Neural Brand Architecture',
    title: 'An AI that remembers your Indian business, tone, products, and audience forever.',
    description: 'DhandaGrow AI Brand Brain™ acts as your digital co-founder. It stores your brand identity, tone of voice, product catalog, and pricing guardrails, radiating consistent context to AI Reels, Photoshoots, WhatsApp Bots, and Ads.',
    benefits: [
      { title: 'Zero Prompt Repetition', description: 'Never type “Use our brand colors and polite Hinglish tone” again. Brand Brain auto-injects brand parameters into every generation.' },
      { title: 'Cross-Tool Intelligence Sync', description: 'When you update your festive offer or logo in Brand Brain, it reflects immediately in AI Post Maker, WhatsApp CRM, and Photoshoots.' },
      { title: 'Strict Business Guardrails', description: 'Prevent AI hallucinations. Lock rules like “Never discount above 20%”, “Always mention BIS Hallmark”, or “Attach Razorpay UPI link”.' },
    ],
    steps: [
      { title: '1. Connect Website or Catalog', description: 'Input your store URL or upload your product catalog. Brand Brain automatically extracts colors, fonts, and brand tone in 10 seconds.' },
      { title: '2. Define Tone & Guardrails', description: 'Set your preferred language mix (Hinglish/Hindi/English), target buyer cities (Jaipur, Delhi, Mumbai), and payment preferences.' },
      { title: '3. Radiate to All AI Engines', description: 'Every reel, photoshoot, WhatsApp reply, and ad creative automatically respects your exact brand identity.' },
    ],
    faqs: [
      { title: 'How does Brand Brain differ from generic ChatGPT prompts?', description: 'Generic AI forgets your context every session. DhandaGrow Brand Brain uses a persistent vector memory database, ensuring every post, reel, and WhatsApp reply matches your brand flawlessly.' },
      { title: 'Can I set different tones for WhatsApp vs Instagram Reels?', description: 'Yes! Brand Brain lets you fine-tune channel-specific personas—e.g., highly polite and consultative on WhatsApp, while fast-paced and trendy on Instagram Reels.' },
      { title: 'Does Brand Brain work with Indian regional languages?', description: 'Yes. It natively supports Hindi, Hinglish, Marathi, Gujarati, Tamil, Telugu, and English, maintaining cultural greetings like “Namaste” and festival blessings.' },
    ],
    dark: true,
  },
  catalogue: {
    eyebrow: 'AI Smart Inventory & Catalogue',
    title: 'From raw mobile photos to high-converting listings across WhatsApp, Instagram & Web.',
    description: 'DhandaGrow AI automates product photography, writes persuasive Hinglish descriptions, synchronizes live stock levels across every selling channel, and issues instant UPI checkout links.',
    benefits: [
      { title: 'Zero Studio Expenses with AI Photoshoots', description: 'Snap a photo on any mobile phone. The AI removes messy backgrounds and puts your sarees, jewellery, or products on virtual Indian models.' },
      { title: 'Real-Time Omnichannel Stock Lock', description: 'When an item sells on WhatsApp, stock decrements instantly on your Website and Instagram Shop, preventing embarrassing overselling.' },
      { title: 'Persuasive Multilingual Descriptions', description: 'Generate festival-ready product copy in Hinglish, Hindi, and English with auto-tagged sizes, care instructions, and SEO keywords.' },
    ],
    steps: [
      { title: '1. Snap & Upload Photo', description: 'Upload raw product snaps from your phone camera. No fancy studio or DSLR needed.' },
      { title: '2. AI Styling & Copy Generation', description: 'DhandaGrow AI enhances textures, generates model previews, and writes complete product descriptions with price and SKU.' },
      { title: '3. 1-Click Multi-Channel Publish', description: 'Broadcast product cards to WhatsApp Business catalogue, Instagram Shop, and your live web storefront with dynamic UPI QR checkout.' },
    ],
    faqs: [
      { title: 'Can I upload photos taken directly from my phone camera?', description: 'Yes! DhandaGrow AI is built specifically for smartphone photos. It automatically removes wrinkles, corrects studio lighting, and places products on professional backdrops.' },
      { title: 'How does multi-channel inventory sync work?', description: 'Your DhandaGrow Master Catalogue acts as the single source of truth. Any price change, discount, or stock update reflects in real-time across WhatsApp, Instagram, and Web.' },
      { title: 'Can customers buy directly via UPI from the catalogue?', description: 'Yes. Every catalogue card includes a 1-tap Razorpay and UPI checkout link that allows customers to pay immediately via Google Pay, PhonePe, or Paytm.' },
    ],
    dark: true,
  },
  crm: {
    eyebrow: 'Autonomous AI Sales Pipeline',
    title: 'Qualify, follow up, and close leads across WhatsApp, Instagram, YouTube, Facebook, LinkedIn & Twitter.',
    description: 'Stop dropping high-intent buyers across fragmented channels. DhandaGrow AI automatically captures leads from YouTube, Facebook, LinkedIn, Twitter, Instagram & WhatsApp, evaluates purchasing probability with AI scoring, and schedules smart follow-up triggers.',
    benefits: [
      { title: 'AI Intent & Readiness Scoring', description: 'Our Gemini-powered engine scans inquiries from YouTube comments, DMs, and WhatsApp in Hinglish, Hindi, and English to instantly distinguish hot buyers from window shoppers.' },
      { title: 'Unified Omnichannel Inbox', description: 'Consolidate WhatsApp, Instagram DMs, Facebook Ads & Messenger, YouTube video inquiries, LinkedIn B2B forms, and Twitter DMs into a single Kanban sales board.' },
      { title: 'Zero-Effort Automated Follow-ups', description: 'Schedule intelligent 24h, 48h, and 7-day multi-channel follow-up nudges with personalized catalogue suggestions and coupon codes.' },
    ],
    steps: [
      { title: '1. Ingest Leads Instantly', description: 'Every DM, YouTube comment, LinkedIn form, WhatsApp message, Facebook ad click, and Twitter inquiry flows directly into your live master pipeline.' },
      { title: '2. AI Qualification & Scoring', description: 'UNI AI tags budget, urgency, and product interest, providing your sales team with a pre-written response and deal probability score.' },
      { title: '3. Close Deals via UPI & Catalogue', description: 'Send instant Razorpay or UPI payment links and product cards directly in chat, automatically marking won revenue.' },
    ],
    faqs: [
      { title: 'Can my sales team manage conversations together?', description: 'Yes. Shared inbox, automated lead routing, and role-based assignments ensure your top closers get the highest-value opportunities immediately.' },
      { title: 'Which channels are natively supported?', description: 'WhatsApp Business API, Instagram DMs & Stories, YouTube Video Comments & Shorts, Facebook Messenger & Lead Ads, LinkedIn B2B Forms & InMail, Twitter (X) DMs, and Website Webhooks.' },
      { title: 'How does the AI handle Indian languages & Hinglish?', description: 'The AI natively understands natural Hinglish (e.g., “Price kitna hai?”, “Bhaiya delivery kab tak hogi?”, “Discount milega kya?”) across all connected social channels.' },
    ],
  },
  'fashion-ai': {
    eyebrow: 'A modern fashion studio',
    title: 'Explore new product looks without slowing down your launch.',
    description: 'Create more ways to present a collection, test styling directions, and prepare product imagery for the storefront.',
    benefits: [
      { title: 'Show pieces on a model', description: 'Create model-led product imagery to help customers picture how a garment can be worn.' },
      { title: 'Explore more colorways', description: 'Preview product colors and styling directions before committing to a full shoot.' },
      { title: 'Keep the garment in focus', description: 'Prepare clean product imagery that gives shoppers a clearer view of the item.' },
    ],
    steps: [
      { title: 'Choose a product', description: 'Start with a suitable garment image and the product you want to showcase.' },
      { title: 'Set the visual direction', description: 'Select a model, styling, and scene that fit your collection.' },
      { title: 'Review and publish', description: 'Check the generated result and prepare the imagery for your product pages.' },
    ],
    faqs: [
      { title: 'What fashion content can I create?', description: 'Create model imagery, try-on concepts, product color variations, and clean catalogue visuals.' },
      { title: 'Can I explore different models and scenes?', description: 'Yes. Try different visual directions to find a presentation that suits your collection.' },
      { title: 'Do I need a studio shoot for every variation?', description: 'AI-assisted workflows help you explore additional concepts without organizing a separate shoot for each one.' },
    ],
  },
  'festival-engine': {
    eyebrow: 'Seasonal campaign planner',
    title: 'Be ready for the moments your customers are already planning around.',
    description: 'Move from a festival date to a timely, branded campaign with less last-minute scrambling.',
    benefits: [
      { title: 'Plan ahead with a calendar', description: 'Keep important occasions visible so your team can prepare offers and creative in advance.' },
      { title: 'Make every campaign yours', description: 'Adapt ready-to-use creative directions to fit your products and brand identity.' },
      { title: 'Reach customers directly', description: 'Share timely promotions through the channels your audience already uses.' },
    ],
    steps: [
      { title: 'Choose an occasion', description: 'Pick an upcoming festival or sale moment that matters to your audience.' },
      { title: 'Prepare the offer', description: 'Set your promotion and tailor the campaign creative to your brand.' },
      { title: 'Schedule and share', description: 'Get your message ready early and send it through the channels you use.' },
    ],
    faqs: [
      { title: 'Can I prepare campaigns before a festival?', description: 'Yes. Planning ahead helps you build and review the campaign before the occasion arrives.' },
      { title: 'Can I customize the templates?', description: 'Use the campaign templates as a starting point and adapt the creative to your offer and branding.' },
      { title: 'How can I share a campaign with customers?', description: 'Prepare campaign content for the channels available in your marketing workflow, including WhatsApp.' },
    ],
  },
  'indian-ai': {
    eyebrow: 'Speak naturally with every customer',
    title: 'Make every message sound like it belongs in the conversation.',
    description: 'Go beyond word-for-word translation with language and tone that feel more familiar to the people you serve.',
    benefits: [
      { title: 'Meet customers in their language', description: 'Create conversations for audiences who prefer regional languages or a mix of languages.' },
      { title: 'Keep the local tone', description: 'Use natural phrasing and familiar expressions instead of stiff, literal translations.' },
      { title: 'Support more conversations', description: 'Give your customer messaging workflows a multilingual foundation.' },
    ],
    steps: [
      { title: 'Understand your audience', description: 'Choose the languages and conversational style your customers use.' },
      { title: 'Shape your responses', description: 'Prepare helpful answers that reflect your business and local context.' },
      { title: 'Keep the conversation going', description: 'Use localized messaging to answer questions and guide customers to the next step.' },
    ],
    faqs: [
      { title: 'Is this just a translation tool?', description: 'It is designed for localized customer conversations, including natural Hinglish and regional language support.' },
      { title: 'Can I support multiple regional languages?', description: 'Yes. Use the available language options to prepare customer messaging for a broader audience.' },
      { title: 'Can it help with customer enquiries?', description: 'Multilingual messaging can support common customer questions and direct people toward the right next step.' },
    ],
  },
  'instagram-dm': {
    eyebrow: 'Instagram conversation flow',
    title: 'Turn a comment or message into a useful next step.',
    description: 'Respond to interest while it is fresh, qualify enquiries, and make it easy for a person to step in when needed.',
    benefits: [
      { title: 'Follow up on comments', description: 'Continue a public interaction in a direct conversation when a customer asks for more.' },
      { title: 'Understand buying intent', description: 'Ask helpful questions to learn what a customer needs before handing off the conversation.' },
      { title: 'Keep people in control', description: 'Make a human handoff part of the flow for nuanced questions and high-value opportunities.' },
    ],
    steps: [
      { title: 'Choose a conversation trigger', description: 'Decide which incoming message or comment should start a response.' },
      { title: 'Guide the customer', description: 'Share relevant information and ask the next useful question.' },
      { title: 'Route or convert', description: 'Pass the conversation to your team or direct the customer to a suitable next step.' },
    ],
    faqs: [
      { title: 'Can a comment start a private conversation?', description: 'Comment-to-DM workflows can help continue a public interaction in a direct message.' },
      { title: 'Can my team take over a conversation?', description: 'Yes. Human handoff lets a team member respond when a customer needs personal assistance.' },
      { title: 'Can the flow help customers make a purchase?', description: 'Use the conversation to answer questions and share the relevant purchase or payment next step.' },
    ],
  },
  'marketing-agent': {
    eyebrow: 'Your marketing workflow, connected',
    title: 'Give your marketing goals a plan and a path to execution.',
    description: 'Move from a business objective to coordinated content and actions with an AI partner that keeps the broader goal in view.',
    benefits: [
      { title: 'Start with your objective', description: 'Describe what you want to achieve so recommendations stay grounded in a real business goal.' },
      { title: 'Connect strategy to content', description: 'Turn a plan into practical creative tasks instead of leaving it as a document.' },
      { title: 'Keep work moving', description: 'Bring planning and execution closer together so it is easier to make progress.' },
    ],
    steps: [
      { title: 'Set the goal', description: 'Share the outcome, audience, and constraints that should guide the work.' },
      { title: 'Build the strategy', description: 'Turn the objective into a set of focused marketing actions.' },
      { title: 'Create and execute', description: 'Prepare the supporting content and move the chosen actions forward.' },
    ],
    faqs: [
      { title: 'What should I tell the marketing agent?', description: 'Start with your business objective, target audience, and any important campaign context.' },
      { title: 'Does it help with content creation?', description: 'Yes. The workflow connects marketing planning with practical content creation.' },
      { title: 'Can I review the plan before execution?', description: 'Use the proposed strategy as a working plan and review the actions before moving forward.' },
    ],
    dark: true,
  },
  'review-manager': {
    eyebrow: 'Reputation, handled thoughtfully',
    title: 'Make it easier to hear customers and respond with care.',
    description: 'Bring review monitoring, timely replies, and reputation insights into a workflow your team can keep up with.',
    benefits: [
      { title: 'Respond with consistency', description: 'Use thoughtful reply guidance to keep your customer communication clear and professional.' },
      { title: 'Catch issues early', description: 'Notice negative feedback sooner and give your team a chance to address it constructively.' },
      { title: 'Understand recurring themes', description: 'Use sentiment and review trends to spot what customers value and where service can improve.' },
    ],
    steps: [
      { title: 'Bring reviews together', description: 'Create a working view of the feedback your business receives.' },
      { title: 'Prioritize a response', description: 'Identify urgent feedback and prepare a reply that fits the situation.' },
      { title: 'Learn from the patterns', description: 'Review recurring themes and share useful insights with your team.' },
    ],
    faqs: [
      { title: 'Can I manage more than one business location?', description: 'Location-aware workflows help teams keep track of feedback across multiple business locations.' },
      { title: 'Can replies be tailored to my business?', description: 'Use response guidance as a starting point, then review and personalize each reply before it is sent.' },
      { title: 'How does sentiment analysis help?', description: 'Sentiment insights can help you identify recurring customer concerns and prioritize follow-up.' },
    ],
  },
  'social-calendar': {
    eyebrow: 'Plan your next month of content',
    title: 'Make your social presence consistent without planning every post from scratch.',
    description: 'Turn your publishing goals into a practical calendar with suggested timing and a clearer view of what is coming next.',
    benefits: [
      { title: 'Keep a steady cadence', description: 'See your upcoming posts together and spot quiet gaps before they happen.' },
      { title: 'Find a better time to post', description: 'Use audience and channel context to guide when your content goes live.' },
      { title: 'Coordinate your channels', description: 'Keep a connected view of publishing plans across the platforms you use.' },
    ],
    steps: [
      { title: 'Set your publishing goals', description: 'Choose the platforms, themes, and frequency that fit your team.' },
      { title: 'Build the calendar', description: 'Create a balanced plan and place content into the dates that make sense.' },
      { title: 'Review and publish', description: 'Check what is scheduled, make adjustments, and keep your plan current.' },
    ],
    faqs: [
      { title: 'Can I plan content for multiple platforms?', description: 'Yes. The calendar is designed to give you a coordinated view of your social channels.' },
      { title: 'How do suggested post times help?', description: 'Timing suggestions provide a starting point for scheduling content when your audience may be more active.' },
      { title: 'Can I adjust a generated plan?', description: 'Yes. Treat the proposed calendar as a draft and refine it to match your campaign and publishing priorities.' },
    ],
  },
  'uni-ai': {
    eyebrow: 'Autonomous AI Co-Founder',
    title: 'Speak in Hinglish. Watch UNI execute campaigns, sales, and analytics autonomously.',
    description: 'UNI AI isn’t just a chatbot—it is the central intelligence director of DhandaGrow AI. Give a single voice note or chat prompt, and UNI commands your AI Reel Studio, Photoshoots, WhatsApp CRM, and Web Store simultaneously.',
    benefits: [
      { title: 'Natural Hinglish Voice & Text Commands', description: 'Talk to UNI like a business partner. It natively understands Indian business terms, festival timelines, and local bargaining nuances.' },
      { title: 'Multi-Agent Tool Orchestration', description: 'One instruction triggers simultaneous workflows: generating 9:16 reels, launching Meta ads, and notifying sales reps.' },
      { title: 'Proactive Morning Business Briefs', description: 'UNI monitors your store 24/7. Get WhatsApp voice notes summarizing daily sales, top products, and lead recovery suggestions.' },
    ],
    steps: [
      { title: '1. Give a Voice or Chat Goal', description: 'Speak or type: “UNI, start Diwali festive campaign with 20% discount on silk sarees and silver coins”.' },
      { title: '2. Autonomous Multi-Tool Execution', description: 'UNI scripts reels, updates catalog prices, prepares WhatsApp broadcasts, and syncs CRM pipelines in seconds.' },
      { title: '3. Track Revenue & Celebrate', description: 'Review real-time conversion rates, won UPI orders, and automated customer follow-ups on your unified cockpit.' },
    ],
    faqs: [
      { title: 'How does UNI AI differ from ChatGPT?', description: 'ChatGPT only gives text suggestions that you must execute manually. UNI AI is connected to your actual tools—it directly generates the video, updates your website, and sends the WhatsApp messages.' },
      { title: 'Can I command UNI AI in Hindi or Hinglish?', description: 'Yes! UNI AI is trained specifically for Indian entrepreneurs and speaks fluent Hinglish, Hindi, and English.' },
      { title: 'Can UNI AI track real sales revenue and UPI payments?', description: 'Yes. UNI AI monitors your Leads CRM and Razorpay/UPI gateway, tracking which reels and broadcasts produced actual paid orders.' },
    ],
    dark: true,
  },
  'website-builder': {
    eyebrow: 'A site that is ready to grow',
    title: 'Build a useful business website without starting from a blank page.',
    description: 'Bring your offer, services, and local presence together in a website workflow designed to help you get online.',
    benefits: [
      { title: 'Start with your business', description: 'Use your goals and business details to shape a site that feels relevant from the first draft.' },
      { title: 'Help customers find you', description: 'Build key local information and search-friendly details into your online presence.' },
      { title: 'Make the next step clear', description: 'Give visitors useful ways to contact you, ask a question, or become a lead.' },
    ],
    steps: [
      { title: 'Tell us about your business', description: 'Share your services, audience, location, and the purpose of your website.' },
      { title: 'Shape your site', description: 'Review the generated pages and refine the content and details to match your needs.' },
      { title: 'Publish and improve', description: 'Launch your site and keep essential business information up to date.' },
    ],
    faqs: [
      { title: 'Do I need to know how to code?', description: 'No. The guided builder helps you create and refine a site without writing code.' },
      { title: 'Will my website work on mobile?', description: 'The site-building workflow is designed to create responsive pages for visitors on mobile devices.' },
      { title: 'Can customers contact me from my site?', description: 'Add lead-capture options so visitors have a clear way to get in touch.' },
    ],
    dark: true,
  },
  'whatsapp-ai': {
    eyebrow: 'More helpful WhatsApp conversations',
    title: 'Turn your business chat into a smoother path from question to order.',
    description: 'Help customers discover products, get answers, and choose what to do next without leaving the conversation.',
    benefits: [
      { title: 'Make products easy to browse', description: 'Bring catalogue details into the chat so customers can explore what you offer.' },
      { title: 'Reduce checkout friction', description: 'Share payment options in the conversation when a customer is ready to buy.' },
      { title: 'Speak your customers’ language', description: 'Support natural, localized conversations that feel comfortable to your audience.' },
    ],
    steps: [
      { title: 'Welcome the customer', description: 'Understand what they are looking for and guide them to a useful starting point.' },
      { title: 'Answer and recommend', description: 'Share relevant product details and respond to common questions in the chat.' },
      { title: 'Help them take action', description: 'Offer the next step, from a payment option to a conversation with your team.' },
    ],
    faqs: [
      { title: 'Can customers browse products in WhatsApp?', description: 'Catalogue integration helps customers discover your products within the chat experience.' },
      { title: 'Can I accept payments through the conversation?', description: 'Share supported payment options, including available UPI or card payment links, when customers are ready.' },
      { title: 'Can the assistant support different languages?', description: 'Use multilingual support options to make customer conversations more accessible.' },
    ],
  },
};

export function FeatureExpansionSections({ feature }: { feature: FeatureKey }) {
  const content = featureContent[feature];
  const sectionClass = content.dark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900';
  const mutedTextClass = content.dark ? 'text-slate-300' : 'text-slate-600';
  const cardClass = content.dark
    ? 'border border-white/10 bg-white/[0.04]'
    : 'border border-slate-200 bg-white shadow-sm';

  return (
    <>
       <section className="bg-[#070b14] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] text-indigo-300 sm:text-sm">
              Your campaign command center
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Keep the plan, content, and next steps connected.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              See the moving parts of a campaign together, from its objective and creative tasks to the signals worth reviewing.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active plan</p>
                  <h3 className="mt-1 text-xl font-bold">Weekend foot traffic</h3>
                </div>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">On track</span>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Target, label: 'Campaign objective', value: 'Reach nearby customers', state: 'Defined' },
                  { icon: Sparkles, label: 'Creative direction', value: 'Weekend Treat offer', state: 'Ready to review' },
                  { icon: MessageSquare, label: 'Social content', value: '3 short-form concepts', state: 'Drafted' },
                  { icon: LineChart, label: 'Performance check', value: 'Review campaign signals', state: 'Next step' },
                ].map(({ icon: Icon, label, value, state }, index) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
                    </div>
                    <span className={`hidden text-right text-xs font-medium sm:block ${index < 2 ? 'text-emerald-300' : 'text-slate-400'}`}>{state}</span>
                    <CheckCircle2 className={`h-4 w-4 shrink-0 ${index < 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                ))}
              </div>
            </div>

            <aside className="flex flex-col justify-between rounded-3xl border border-indigo-300/20 bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-slate-950 p-6 sm:p-8">
              <div>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-300/10 text-indigo-200">
                  <Bot className="h-6 w-6" />
                </span>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">Agent insight</p>
                <h3 className="mt-3 text-2xl font-bold leading-snug">Make the next action clear to your team.</h3>
                <p className="mt-4 leading-7 text-slate-300">
                  Keep each task connected to the campaign goal, so it is easier to review what is ready and what needs attention.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Plan ready for review</p>
                  <p className="mt-1 text-xs text-slate-400">You stay in control of what goes live.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={`py-20 sm:py-24 ${sectionClass}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className={`mb-3 text-sm font-bold uppercase tracking-[0.18em] ${content.dark ? 'text-violet-300' : 'text-violet-700'}`}>
              {content.eyebrow}
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{content.title}</h2>
            <p className={`mt-5 text-base leading-7 sm:text-lg ${mutedTextClass}`}>{content.description}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {content.benefits.map((benefit, index) => (
              <article key={benefit.title} className={`rounded-2xl p-6 sm:p-8 ${cardClass}`}>
                <span className={`mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${content.dark ? 'bg-violet-400/15 text-violet-200' : 'bg-violet-100 text-violet-800'}`}>
                  0{index + 1}
                </span>
                <h3 className="text-xl font-bold">{benefit.title}</h3>
                <p className={`mt-3 leading-7 ${mutedTextClass}`}>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 text-white sm:py-24"
        style={{
          backgroundImage: 'linear-gradient(to right, #fc9a5d, #f0449b, #be32ff, #7d36fa)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/90">
              A simple workflow
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">From first step to finished work.</h2>
          </div>
          <ol className="grid gap-5 md:grid-cols-3">
            {content.steps.map((step, index) => (
              <li key={step.title} className={`relative rounded-2xl p-6 sm:p-8 ${cardClass}`}>
                <span className="mb-5 block text-sm font-bold text-white/80">
                  STEP 0{index + 1}
                </span>
                <h3 className={`text-xl font-bold ${content.dark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h3>
                <p className={`mt-3 leading-7 ${mutedTextClass}`}>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`py-20 sm:py-24 ${sectionClass}`}>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className={`mb-3 text-sm font-bold uppercase tracking-[0.18em] ${content.dark ? 'text-violet-300' : 'text-violet-700'}`}>
              Frequently asked questions
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">A few helpful details.</h2>
          </div>
          <div className="space-y-3">
            {content.faqs.map((faq) => (
              <details key={faq.title} className={`rounded-xl p-5 sm:p-6 ${cardClass}`}>
                <summary className="cursor-pointer pr-8 text-lg font-semibold">
                  {faq.title}
                </summary>
                <p className={`mt-3 leading-7 ${mutedTextClass}`}>{faq.description}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
