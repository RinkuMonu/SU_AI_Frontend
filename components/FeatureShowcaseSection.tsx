type FeatureShowcaseKey =
  | 'ai-ads'
  | 'ai-avatar'
  | 'ai-photoshoot'
  | 'ai-post-maker'
  | 'ai-reel-maker'
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

type ShowcaseItem = {
  category: string;
  title: string;
  description: string;
};

type ShowcaseContent = {
  accent: string;
  eyebrow: string;
  title: string;
  description: string;
  items: [ShowcaseItem, ShowcaseItem, ShowcaseItem, ShowcaseItem];
};

const showcaseContent: Record<FeatureShowcaseKey, ShowcaseContent> = {
  'ai-ads': {
    accent: '#10b981',
    eyebrow: 'Campaigns built to perform',
    title: 'Creative directions for every step of your campaign.',
    description: 'Explore distinct angles for launches, offers, and evergreen ads, then choose the story that fits your audience.',
    items: [
      { category: 'Launch', title: 'Meet the new arrival', description: 'Lead with what makes your latest product worth a closer look.' },
      { category: 'Offer', title: 'A deal worth a pause', description: 'Make the value clear with a focused, action-led message.' },
      { category: 'Product story', title: 'Show what makes it different', description: 'Turn a standout feature into a clear reason to choose you.' },
      { category: 'Retargeting', title: 'Bring them back to browse', description: 'Reconnect with interested shoppers using a useful reminder.' },
    ],
  },
  'ai-avatar': {
    accent: '#2563eb',
    eyebrow: 'Made for the camera',
    title: 'Presenter-led videos for the moments that matter.',
    description: 'From the first hello to a product walkthrough, bring your message to life with a consistent on-screen presenter.',
    items: [
      { category: 'Welcome', title: 'A warmer first hello', description: 'Introduce your business with a face and voice customers can follow.' },
      { category: 'Product demo', title: 'Show how it works', description: 'Explain a product or service in a clear, easy-to-follow format.' },
      { category: 'Quick tip', title: 'One idea, made simple', description: 'Share practical advice in a short presenter-led clip.' },
      { category: 'Localization', title: 'Speak to more viewers', description: 'Prepare a localized version for the audience you want to reach.' },
    ],
  },
  'ai-photoshoot': {
    accent: '#10b981',
    eyebrow: 'Product imagery, reimagined',
    title: 'Studio-ready looks for every product story.',
    description: 'Explore different scenes and visual directions to make product photography feel polished, consistent, and ready to share.',
    items: [
      { category: 'Hero image', title: 'Make the product the hero', description: 'Give your featured item a clean, confident first impression.' },
      { category: 'Lifestyle scene', title: 'Show it in its element', description: 'Place a product in a setting that helps customers picture it.' },
      { category: 'Detail shot', title: 'Bring the details forward', description: 'Highlight the finish, texture, and features customers want to see.' },
      { category: 'Seasonal edit', title: 'Refresh the whole collection', description: 'Explore a timely visual direction while keeping the product in focus.' },
    ],
  },
  'ai-post-maker': {
    accent: '#9333ea',
    eyebrow: 'Social content, made for the scroll',
    title: 'Fresh post concepts for every kind of update.',
    description: 'Build a varied social presence with content directions for product launches, helpful tips, offers, and everyday brand stories.',
    items: [
      { category: 'New arrival', title: 'Give a launch its moment', description: 'Introduce a new product with a clear hook and a strong visual.' },
      { category: 'Helpful tip', title: 'Share something useful', description: 'Turn your expertise into a quick post your audience can save.' },
      { category: 'Promotion', title: 'Make the offer easy to get', description: 'Put the benefit and the next step front and center.' },
      { category: 'Brand story', title: 'Show the people behind it', description: 'Share a human moment that makes your brand more memorable.' },
    ],
  },
  'ai-reel-maker': {
    accent: '#db2777',
    eyebrow: 'Formats that earn attention',
    title: 'Short-form video concepts for every kind of business.',
    description: 'From festive offers and food cravings to product reveals and transformations, create video directions shaped for social.',
    items: [
      { category: 'Festive offer', title: 'Stop the scroll with a deal', description: 'Open with a timely hook and make your offer easy to understand.' },
      { category: 'Food & drink', title: 'Make the product irresistible', description: 'Use close-up storytelling to bring a menu favorite to life.' },
      { category: 'Tech & gadgets', title: 'Reveal the details that matter', description: 'Build curiosity with a quick look at features and value.' },
      { category: 'Before & after', title: 'Show the transformation', description: 'Tell a visual story that makes the change easy to see.' },
    ],
  },
  analytics: {
    accent: '#06b6d4',
    eyebrow: 'AI Marketing Signals That Drive Revenue',
    title: 'Every Reel, WhatsApp lead, and festive campaign in one view.',
    description: 'Stop guessing what worked. Connect AI generation activity directly with Instagram reach, customer chats, and sales revenue.',
    items: [
      { category: 'Content Velocity', title: 'Track every AI creation', description: 'Monitor output across reels, posts, photoshoots, and captions in real-time.' },
      { category: 'WhatsApp Funnel', title: 'Trace leads from chat to order', description: 'See catalogue enquiries, responses, and customer orders directly inside CRM.' },
      { category: 'Gemini Health Score', title: 'Measure marketing vitality (0-100)', description: 'AI evaluates your posting consistency, catalogue depth, and reel momentum.' },
      { category: 'Predictive Signals', title: 'Automated peak hour & budget alerts', description: 'Get smart suggestions on best posting times and festive campaign budget shifts.' },
    ],
  },
  'brand-brain': {
    accent: '#8b5cf6',
    eyebrow: 'DhandaGrow AI Brand Brain™',
    title: 'One central neural memory for your brand’s voice, visuals, and rules.',
    description: 'Never repeat your brand story or colors again. Brand Brain embeds your logo, hex palette, Devanagari fonts, festive tone, and pricing rules across every AI tool.',
    items: [
      { category: 'Brand Voice', title: 'Culturally warm Hinglish & tone', description: 'Remembers your persona—from polite Hindi greetings to high-energy festival offers.' },
      { category: 'Visual Memory', title: 'Exact hex codes, logos & fonts', description: 'Automatically applies your brand colors and watermarks to reels, ads, and posters.' },
      { category: 'Product Knowledge', title: '1,240+ SKUs & pricing memory', description: 'Stores your sarees, jewellery, and D2C inventory with specifications and return policies.' },
      { category: 'Guardrails', title: 'Hard business rules & limits', description: 'Enforces maximum discount caps, mandatory UPI payment links, and compliance rules.' },
    ],
  },
  catalogue: {
    accent: '#10b981',
    eyebrow: 'DhandaGrow AI Smart Catalogue',
    title: 'Transform raw product photos into high-converting storefront listings.',
    description: 'Centralize inventory with AI photoshoot backgrounds, Hinglish descriptions, live multi-channel stock sync, and instant UPI checkout.',
    items: [
      { category: 'AI Studio Shoot', title: 'Virtual Indian models & clean podiums', description: 'Transform raw mobile photos into high-fashion studio catalog imagery in 5 seconds.' },
      { category: 'Hinglish SEO Copy', title: 'Persuasive AI descriptions & tags', description: 'Gemini writes festival-ready descriptions, key specifications, and Instagram hashtags.' },
      { category: 'Omnichannel Sync', title: 'WhatsApp, Instagram & Web in 1-Click', description: 'Central inventory syncs live stock and price changes across WhatsApp Shop and Web store.' },
      { category: '1-Tap UPI QR', title: 'Instant in-chat payment links', description: 'Send dynamic Razorpay or BHIM UPI payment cards directly in customer conversations.' },
    ],
  },
  crm: {
    accent: '#0d9488',
    eyebrow: 'AI-Powered Omnichannel CRM',
    title: 'Turn WhatsApp, Instagram, YouTube, Facebook, LinkedIn & Twitter leads into revenue.',
    description: 'Capture inquiries across YouTube comments, Instagram DMs, Facebook Ads, LinkedIn B2B leads, Twitter DMs, and WhatsApp in one unified AI board.',
    items: [
      { category: 'AI Intent Score', title: 'Prioritize hot buyers instantly', description: 'AI evaluates incoming inquiries from YouTube, DMs, and WhatsApp to tag urgent buyers in real time.' },
      { category: 'Omnichannel Sync', title: '6 Platforms In One Pipeline', description: 'Capture leads across WhatsApp, Instagram, Facebook, YouTube, LinkedIn, and Twitter seamlessly.' },
      { category: 'Auto-Followups', title: 'Autonomous multi-channel nudges', description: 'Recover cold leads with scheduled WhatsApp & DM discount offers and personalized follow-up sequences.' },
      { category: 'Instant Checkout', title: 'Catalogue & UPI payment links', description: 'Send product cards and close deals with instant Razorpay and UPI QR links.' },
    ],
  },
  'fashion-ai': {
    accent: '#e11d48',
    eyebrow: 'A new lens on fashion',
    title: 'More ways to present every piece in your collection.',
    description: 'Explore product looks, styling directions, and catalogue-ready images without planning a separate shoot for every variation.',
    items: [
      { category: 'On-model', title: 'Bring the fit to life', description: 'Show a garment in a model-led product presentation.' },
      { category: 'Color study', title: 'Explore the palette', description: 'Preview different color directions for a collection.' },
      { category: 'Clean catalogue', title: 'Keep the product in focus', description: 'Create a simple, polished view for product listings.' },
      { category: 'Try-on concept', title: 'Help shoppers picture it', description: 'Explore a more personal way to visualize a style.' },
    ],
  },
  'festival-engine': {
    accent: '#d97706',
    eyebrow: 'Ready for the next big occasion',
    title: 'Seasonal campaign inspiration, right on time.',
    description: 'Turn important dates into thoughtful campaign ideas with a calendar, customizable creative, and a clear route to customers.',
    items: [
      { category: 'Festival calendar', title: 'See the moment coming', description: 'Keep relevant celebrations and sale dates on your radar.' },
      { category: 'Campaign idea', title: 'Start with a timely hook', description: 'Connect your offer to the occasion your customers care about.' },
      { category: 'Branded creative', title: 'Make it feel like you', description: 'Adapt seasonal visuals to fit your products and identity.' },
      { category: 'Customer reach', title: 'Share it where they are', description: 'Prepare a message for the channels your audience uses.' },
    ],
  },
  'indian-ai': {
    accent: '#ea580c',
    eyebrow: 'Language that feels local',
    title: 'Customer conversations in the words they use every day.',
    description: 'Create more natural support and marketing conversations with Hinglish and regional language awareness.',
    items: [
      { category: 'Hinglish', title: 'A more natural mix', description: 'Meet customers in the familiar flow of Hindi and English.' },
      { category: 'Regional support', title: 'Help in their language', description: 'Make common customer answers easier to understand.' },
      { category: 'Local context', title: 'Go beyond translation', description: 'Shape messages around the way people actually communicate.' },
      { category: 'Always-on replies', title: 'Keep the conversation open', description: 'Support customer questions across more of the day.' },
    ],
  },
  'instagram-dm': {
    accent: '#db2777',
    eyebrow: 'From interaction to conversation',
    title: 'Make every Instagram reply feel like a helpful next step.',
    description: 'Respond to comments and DMs, understand what people need, and smoothly bring your team into the conversation.',
    items: [
      { category: 'Comment reply', title: 'Continue the conversation', description: 'Follow up on public interest with a direct, relevant reply.' },
      { category: 'Lead questions', title: 'Find out what they need', description: 'Ask a few useful questions before recommending a next step.' },
      { category: 'Human support', title: 'Bring in your team', description: 'Hand off complex questions to a person with the right context.' },
      { category: 'Product enquiry', title: 'Make it easier to act', description: 'Share useful product or payment information in the chat.' },
    ],
  },
  'marketing-agent': {
    accent: '#4f46e5',
    eyebrow: 'Strategy that moves into action',
    title: 'A connected marketing plan, from brief to execution.',
    description: 'Bring goals, strategy, content, and follow-through into one clear path for making progress.',
    items: [
      { category: 'Objective', title: 'Start with the outcome', description: 'Set a clear goal to guide the work that follows.' },
      { category: 'Strategy', title: 'Choose a focused direction', description: 'Turn business context into a practical marketing approach.' },
      { category: 'Content', title: 'Create what the plan needs', description: 'Prepare messages and creative that support the strategy.' },
      { category: 'Execution', title: 'Keep the work moving', description: 'Connect the plan to the next actions your team can take.' },
    ],
  },
  'review-manager': {
    accent: '#d97706',
    eyebrow: 'Every review is a chance to connect',
    title: 'Turn customer feedback into a better experience.',
    description: 'Keep review responses thoughtful and timely, while learning from the themes customers bring up.',
    items: [
      { category: 'New review', title: 'Know when feedback arrives', description: 'Keep recent customer feedback in view for your team.' },
      { category: 'Thoughtful reply', title: 'Respond with care', description: 'Prepare a relevant, professional response for each situation.' },
      { category: 'Service recovery', title: 'Address concerns early', description: 'Help your team focus on feedback that needs attention.' },
      { category: 'Sentiment', title: 'Learn from the patterns', description: 'Spot recurring themes across customer experiences.' },
    ],
  },
  'social-calendar': {
    accent: '#ea580c',
    eyebrow: 'A social plan you can see',
    title: 'Make space for consistency, creativity, and timely posts.',
    description: 'Plan what to publish across your channels, choose a sensible cadence, and keep the next post from becoming a last-minute scramble.',
    items: [
      { category: 'Monthly plan', title: 'See the whole picture', description: 'Understand how posts and themes fit across the month.' },
      { category: 'Best time', title: 'Choose when to publish', description: 'Use suggested timing to guide your publishing schedule.' },
      { category: 'Content idea', title: 'Keep the ideas coming', description: 'Fill your plan with varied, relevant content directions.' },
      { category: 'Channel sync', title: 'Coordinate your platforms', description: 'Keep publishing activity organized across your social accounts.' },
    ],
  },
  'uni-ai': {
    accent: '#06b6d4',
    eyebrow: 'DhandaGrow UNI AI™',
    title: 'Your autonomous AI Co-Founder that commands your entire business.',
    description: 'Speak or chat in natural Hinglish. UNI AI coordinates Reels, Photoshoots, WhatsApp broadcasts, and Leads CRM in one single command.',
    items: [
      { category: 'Voice Command', title: 'Hinglish & audio voice execution', description: 'Speak naturally: “UNI, launch a 3-day festive sale on jewellery across WhatsApp & IG”.' },
      { category: 'Tool Orchestration', title: 'Controls all 6 DhandaGrow AI engines', description: 'Automatically triggers reel generation, flyer designs, catalog sync, and CRM pipelines.' },
      { category: 'Proactive Briefs', title: 'Daily morning WhatsApp intelligence', description: 'Wakes up with insights: yesterday’s won revenue, trending products, and ad recommendations.' },
      { category: 'Instant Checkout', title: 'Generates Razorpay & UPI links', description: 'Attaches dynamic payment cards and tracks conversion attribution to final sale.' },
    ],
  },
  'website-builder': {
    accent: '#2563eb',
    eyebrow: 'A better first impression online',
    title: 'A website built around what your customers need to know.',
    description: 'Bring your services, local details, and enquiry paths together in a polished home for your business.',
    items: [
      { category: 'Homepage', title: 'Tell your story clearly', description: 'Help visitors understand who you are and what you offer.' },
      { category: 'Services', title: 'Make your offer easy to explore', description: 'Present your services in a way customers can scan and understand.' },
      { category: 'Local discovery', title: 'Make location part of the story', description: 'Keep important local business details easy to find.' },
      { category: 'Lead capture', title: 'Make the next step simple', description: 'Give visitors a clear way to ask a question or get in touch.' },
    ],
  },
  'whatsapp-ai': {
    accent: '#16a34a',
    eyebrow: 'Commerce that feels like a conversation',
    title: 'Help customers go from a quick question to a confident choice.',
    description: 'Bring product discovery, helpful answers, and payment options into the chat experience customers already know.',
    items: [
      { category: 'Product discovery', title: 'Browse right in the chat', description: 'Help customers find the products and details they are looking for.' },
      { category: 'Order questions', title: 'Get a useful answer quickly', description: 'Make common customer questions easier to handle.' },
      { category: 'Payments', title: 'Make checkout the next step', description: 'Share a supported payment option when a customer is ready.' },
      { category: 'Local language', title: 'Keep the conversation natural', description: 'Support customers with a more familiar language and tone.' },
    ],
  },
};

export function FeatureShowcaseSection({ feature }: { feature: FeatureShowcaseKey }) {
  const content = showcaseContent[feature];

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-12 max-w-4xl text-center sm:mb-16">
          <span
            className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
            style={{ color: content.accent }}
          >
            {content.eyebrow}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            {content.description}
          </p>
        </header>

        <div
          className="relative overflow-hidden rounded-[28px] p-5 shadow-xl sm:rounded-[36px] sm:p-8 lg:p-10"
          style={{
            background: `radial-gradient(ellipse at 15% 10%, ${content.accent} 0%, transparent 42%), radial-gradient(ellipse at 85% 90%, #7c3aed 0%, transparent 45%), linear-gradient(135deg, #07152f, #15102d 55%, #32104d)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_1px,transparent_1.5px)] bg-[size:14px_14px]" />
          </div>
          <div className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {content.items.map((item, index) => (
              <article
                key={item.category}
                className="mx-auto w-full max-w-[250px] rounded-[24px] border border-white/25 bg-slate-950 p-1.5 shadow-[0_18px_45px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-1 sm:rounded-[30px] sm:p-2"
              >
                <div className="relative flex min-h-[230px] flex-col overflow-hidden rounded-[19px] bg-white sm:min-h-[330px] sm:rounded-[23px]">
                  <div className="relative flex items-center justify-center px-3 pt-3 sm:px-4 sm:pt-4">
                    <div className="absolute left-3 top-4 flex gap-1 sm:left-4 sm:top-5" aria-hidden="true">
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                    </div>
                    <span className="max-w-[70%] truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                      {item.category}
                    </span>
                    <span className="absolute right-3 top-4 text-[8px] font-semibold text-slate-400 sm:right-4 sm:top-5">
                      0{index + 1}
                    </span>
                  </div>
                  <div
                    className="relative mx-2 mt-3 flex min-h-[118px] flex-1 flex-col justify-between overflow-hidden rounded-[14px] p-3 text-white sm:mx-3 sm:mt-4 sm:min-h-[190px] sm:rounded-[18px] sm:p-4"
                    style={{
                      background: `radial-gradient(circle at ${index % 2 === 0 ? '80% 20%' : '20% 80%'}, ${content.accent} 0%, transparent 55%), linear-gradient(${135 + index * 18}deg, #10172d, #30114a 65%, #111827)`,
                    }}
                  >
                    <span className="relative z-10 w-fit rounded-full border border-white/30 bg-black/20 px-2 py-1 text-[7px] font-bold uppercase tracking-[0.14em] text-white/90 sm:text-[8px]">
                      {item.category}
                    </span>
                    <div className="pointer-events-none absolute -right-6 top-1/4 h-24 w-24 rounded-full border border-white/20 sm:h-36 sm:w-36" aria-hidden="true" />
                    <div className="pointer-events-none absolute -right-1 top-1/3 h-16 w-16 rounded-full border border-white/20 sm:h-24 sm:w-24" aria-hidden="true" />
                    <h3 className="relative z-10 max-w-[13ch] text-base font-extrabold leading-tight tracking-tight sm:text-xl">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex min-h-[70px] flex-col justify-center px-3 py-2.5 sm:min-h-[86px] sm:px-4 sm:py-3">
                    <p className="line-clamp-2 text-[10px] leading-4 text-slate-600 sm:text-xs sm:leading-5">
                      {item.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: content.accent }} />
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">Preview concept</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, index) => (
            <article key={item.category} className="rounded-2xl border border-slate-200 bg-[#faf9f6] p-5 transition-colors hover:border-slate-300 sm:p-6">
              <span
                className="mb-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{ color: content.accent, backgroundColor: `${content.accent}14` }}
              >
                {item.category}
              </span>
              <h3 className="font-serif text-base font-bold leading-snug text-slate-900 sm:text-lg">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{item.description}</p>
              <span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Concept 0{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
