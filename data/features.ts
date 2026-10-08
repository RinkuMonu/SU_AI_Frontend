import { 
  Sparkles, Image as ImageIcon, Video, Camera, UserCircle, Shirt, 
  Megaphone, Percent, Bot, Calendar, PartyPopper, Send, 
  MessageCircle, MessageSquare, Star, Briefcase, Globe, 
  BarChart2, Users, ShoppingBag, Brain, Languages, Smartphone
} from 'lucide-react';

export const featuresMenu = {
  title: "AI Features",
  subtitle: "Everything you need to grow your business with AI.",
  categories: [
    {
      title: "Create",
      icon: Sparkles,
      items: [
        { name: "AI Post Maker", description: "Create branded social media posts with AI.", icon: ImageIcon, route: "/features/ai-post-maker" },
        { name: "AI Reel Maker", description: "Generate reels from product photos, scripts and ideas.", icon: Video, route: "/features/ai-reel-maker" },
        { name: "AI Photoshoot", description: "Turn simple product photos into professional creatives.", icon: Camera, route: "/features/ai-photoshoot" },
        { name: "AI Avatar & Actor", description: "Create AI presenter videos in multiple Indian languages.", icon: UserCircle, route: "/features/ai-avatar" },
        { name: "Fashion AI", description: "Generate fashion models, poses, backgrounds and virtual try-ons.", icon: Shirt, route: "/features/fashion-ai" }
      ]
    },
    {
      title: "Marketing",
      icon: Megaphone,
      items: [
        { name: "AI Advertisement Maker", description: "Create Meta, Instagram, Facebook and Google ad creatives.", icon: Percent, route: "/features/ai-ads" },
        { name: "AI Marketing Agent", description: "Let AI build campaigns and marketing strategies for your business.", icon: Bot, route: "/features/marketing-agent" },
        { name: "Social Media Calendar", description: "Plan a complete month of posts, reels and campaigns.", icon: Calendar, route: "/features/social-calendar" },
        { name: "Indian Festival Engine", description: "Automatically create campaigns around Indian festivals.", icon: PartyPopper, route: "/features/festival-engine" }
      ]
    },
    {
      title: "Publish & Automate",
      icon: Send,
      items: [
        { name: "Instagram Autopilot", description: "Plan, schedule and automatically publish your content.", icon: Smartphone, route: "/features/instagram-autopilot" },
        { name: "Instagram DM AI", description: "Automatically respond to customer questions on Instagram.", icon: MessageCircle, route: "/features/instagram-dm" },
        { name: "WhatsApp AI Assistant", description: "Answer customer questions using your product catalogue.", icon: MessageSquare, route: "/features/whatsapp-ai" },
        { name: "AI Review Manager", description: "Manage and respond to Google customer reviews with AI.", icon: Star, route: "/features/review-manager" }
      ]
    },
    {
      title: "Business",
      icon: Briefcase,
      items: [
        { name: "AI Website Builder", description: "Generate a complete business website in minutes.", icon: Globe, route: "/features/website-builder" },
        { name: "Business Analytics", description: "Track marketing performance, reach, engagement and leads.", icon: BarChart2, route: "/features/analytics" },
        { name: "Leads CRM", description: "Manage enquiries from Instagram, WhatsApp and other sources.", icon: Users, route: "/features/crm" },
        { name: "Product Catalogue", description: "Manage products, prices, stock and customer-facing information.", icon: ShoppingBag, route: "/features/catalogue" }
      ]
    },
    {
      title: "AI Intelligence",
      icon: Brain,
      items: [
        { name: "AI Brand Brain", description: "AI remembers your brand, products, colours, tone and audience.", icon: Brain, route: "/features/brand-brain" },
        { name: "UNI AI", description: "Your central AI business growth assistant.", icon: Bot, route: "/features/uni-ai" },
        { name: "Hindi & Hinglish AI", description: "Create and manage marketing content naturally in Indian languages.", icon: Languages, route: "/features/indian-ai" }
      ]
    }
  ]
};
