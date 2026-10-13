'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Smartphone, 
  Globe, 
  Building2, 
  CreditCard, 
  Receipt, 
  QrCode, 
  FileCheck, 
  Server, 
  Scale, 
  FileText, 
  RefreshCw 
} from 'lucide-react';

type TabType = 'profiling' | 'payments' | 'privacy';

interface SubItem {
  id: string;
  navTitle: string;
  heading: string;
  inputCard: {
    label: string;
    flag: string;
    value: string;
    badge: string;
  };
  hubIcon: React.ReactNode;
  outputCard: {
    title: string;
    status: string;
    progressText: string;
    items: {
      icon: React.ReactNode;
      label: string;
      value: string;
    }[];
  };
  benefits: {
    icon: React.ReactNode;
    title: string;
    desc: string;
  }[];
}

interface SectionCategory {
  id: TabType;
  label: string;
  badge: string;
  description: string;
  subItems: SubItem[];
}

const sectionsData: SectionCategory[] = [
  {
    id: 'profiling',
    label: 'Profiling',
    badge: 'AI Customer Intelligence',
    description: 'Instant demographic, fraud, and buyer propensity signals powered by real-time mobile verification.',
    subItems: [
      {
        id: 'digital-identity',
        navTitle: 'Digital Identity Verification',
        heading: 'Digital Identity Verification',
        inputCard: {
          label: 'Personal Mobile Number',
          flag: '🇮🇳',
          value: '9876543210',
          badge: 'Customer Input'
        },
        hubIcon: <Zap className="w-6 h-6 text-white fill-white" />,
        outputCard: {
          title: 'Personal Information',
          status: 'Fetching..',
          progressText: 'Verified in 0.3s',
          items: [
            {
              icon: <UserCheck className="w-4 h-4 text-orange-500" />,
              label: 'Legal Name',
              value: 'Dinesh Kumar (Verified)'
            },
            {
              icon: <ShieldCheck className="w-4 h-4 text-orange-500" />,
              label: 'Fraud Check',
              value: 'Low Risk • 99% Trust'
            },
            {
              icon: <Smartphone className="w-4 h-4 text-orange-500" />,
              label: 'Mobile Network',
              value: 'Jio 5G • WhatsApp Active'
            },
            {
              icon: <Globe className="w-4 h-4 text-orange-500" />,
              label: 'Social Media Accounts',
              value: 'Meta & Instagram Verified'
            }
          ]
        },
        benefits: [
          {
            icon: <UserCheck className="w-5 h-5 text-orange-600" />,
            title: 'Build a 360° user profile',
            desc: 'Instant demographic, buyer intent, and social affinity signals.'
          },
          {
            icon: <ArrowRight className="w-5 h-5 text-orange-600" />,
            title: 'Reduce onboarding friction',
            desc: 'Zero manual paperwork, 1-click frictionless customer onboarding.'
          },
          {
            icon: <ShieldCheck className="w-5 h-5 text-orange-600" />,
            title: 'Ensure regulatory compliance',
            desc: '100% compliant with Indian KYC & digital verification frameworks.'
          }
        ]
      },
      {
        id: 'fraud-monitoring',
        navTitle: 'Live Fraud Monitoring',
        heading: 'Live Risk & Fraud Monitoring',
        inputCard: {
          label: 'Transaction / Order Event',
          flag: '🔍',
          value: 'IP: 103.24.x.x (Mumbai)',
          badge: 'Live Event'
        },
        hubIcon: <ShieldCheck className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Risk & Intent Score Engine',
          status: 'Safe to Transact',
          progressText: 'Trust Index: 98/100',
          items: [
            {
              icon: <Zap className="w-4 h-4 text-orange-500" />,
              label: 'Intent Velocity',
              value: 'High Purchase Propensity'
            },
            {
              icon: <ShieldCheck className="w-4 h-4 text-orange-500" />,
              label: 'Bot & VPN Check',
              value: '0% Bot Risk • Human Verified'
            },
            {
              icon: <Smartphone className="w-4 h-4 text-orange-500" />,
              label: 'Device Fingerprint',
              value: 'Authentic Mobile Hardware'
            },
            {
              icon: <Building2 className="w-4 h-4 text-orange-500" />,
              label: 'RTO Risk Scoring',
              value: 'Low Return-to-Origin Probability'
            }
          ]
        },
        benefits: [
          {
            icon: <ShieldCheck className="w-5 h-5 text-orange-600" />,
            title: 'Zero Fake Orders (RTO)',
            desc: 'Prevent high-cost return orders before parcel dispatch.'
          },
          {
            icon: <Zap className="w-5 h-5 text-orange-600" />,
            title: 'Real-Time Intent Scoring',
            desc: 'Route genuine high-value buyers to express checkout.'
          },
          {
            icon: <Lock className="w-5 h-5 text-orange-600" />,
            title: 'Automated Bot Defenses',
            desc: 'Block card-testing and credential stuffing attacks instantly.'
          }
        ]
      }
    ]
  },
  {
    id: 'payments',
    label: 'Payments',
    badge: 'Multi-Rail Payments Stack',
    description: 'Instant UPI collections, split vendor settlements, and automated GST billing with 99.9% success.',
    subItems: [
      {
        id: 'unified-upi',
        navTitle: 'Unified UPI & Checkout',
        heading: 'Unified UPI & Instant Payments',
        inputCard: {
          label: 'Order Checkout Link',
          flag: '₹',
          value: '₹4,999 (UPI / QR / Cards)',
          badge: 'Payment Link'
        },
        hubIcon: <CreditCard className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Real-Time Settlement Engine',
          status: 'Settlement Confirmed',
          progressText: 'Paid in 0.4s',
          items: [
            {
              icon: <QrCode className="w-4 h-4 text-orange-500" />,
              label: 'UPI Rail Routing',
              value: 'NPCI Ultra-Fast Payment Rail'
            },
            {
              icon: <Receipt className="w-4 h-4 text-orange-500" />,
              label: 'Automated GST Invoice',
              value: 'Generated & WhatsApp Sent'
            },
            {
              icon: <Building2 className="w-4 h-4 text-orange-500" />,
              label: 'Direct Bank Settlement',
              value: 'Next-Day Direct Credit (T+1)'
            },
            {
              icon: <Lock className="w-4 h-4 text-orange-500" />,
              label: 'Security Protocol',
              value: 'PCI-DSS Level 1 Bank-Grade'
            }
          ]
        },
        benefits: [
          {
            icon: <Zap className="w-5 h-5 text-orange-600" />,
            title: '99.9% Transaction Success',
            desc: 'Intelligent multi-gateway routing eliminates payment drops.'
          },
          {
            icon: <Smartphone className="w-5 h-5 text-orange-600" />,
            title: '1-Click WhatsApp Checkout',
            desc: 'Collect customer payments directly inside WhatsApp chats.'
          },
          {
            icon: <Receipt className="w-5 h-5 text-orange-600" />,
            title: 'Automated GST Invoicing',
            desc: 'Instant compliant tax invoices dispatched automatically.'
          }
        ]
      },
      {
        id: 'split-settlements',
        navTitle: 'Split Invoicing & AutoPay',
        heading: 'Automated Splits & Subscriptions',
        inputCard: {
          label: 'Subscription Mandate',
          flag: '🔄',
          value: 'Monthly AutoPay (UPI Mandate)',
          badge: 'Recurring'
        },
        hubIcon: <RefreshCw className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Automated Settlement Ledger',
          status: 'AutoPay Active',
          progressText: 'Dispatched & Reconciled',
          items: [
            {
              icon: <Building2 className="w-4 h-4 text-orange-500" />,
              label: 'Split Vendor Payouts',
              value: 'Instant Partner & Creator Splits'
            },
            {
              icon: <Receipt className="w-4 h-4 text-orange-500" />,
              label: 'Tally & Zoho Sync',
              value: 'Automated accounting sync'
            },
            {
              icon: <QrCode className="w-4 h-4 text-orange-500" />,
              label: 'UPI Recurring Rail',
              value: 'Zero-OTP recurring deductions'
            },
            {
              icon: <FileCheck className="w-4 h-4 text-orange-500" />,
              label: 'Ledger Reconciliation',
              value: '100% Automated Reconciliation'
            }
          ]
        },
        benefits: [
          {
            icon: <RefreshCw className="w-5 h-5 text-orange-600" />,
            title: 'Frictionless UPI AutoPay',
            desc: 'Automate subscription renewals with zero customer drop-off.'
          },
          {
            icon: <Building2 className="w-5 h-5 text-orange-600" />,
            title: 'Automated Vendor Splits',
            desc: 'Pay suppliers, affiliates, and creators automatically on delivery.'
          },
          {
            icon: <FileCheck className="w-5 h-5 text-orange-600" />,
            title: 'Live Cashflow Visibility',
            desc: 'Real-time financial ledgers without messy manual spreadsheets.'
          }
        ]
      }
    ]
  },
  {
    id: 'privacy',
    label: 'Privacy',
    badge: 'Enterprise Security & Trust',
    description: '100% Indian data sovereignty, military-grade encryption, and full DPDP Act statutory compliance.',
    subItems: [
      {
        id: 'data-encryption',
        navTitle: 'Enterprise Encryption Vault',
        heading: 'Bank-Grade Data Privacy & Vault',
        inputCard: {
          label: 'Customer & Business Data',
          flag: '🔒',
          value: 'AES-256 GCM Encrypted Vault',
          badge: 'Zero-Knowledge'
        },
        hubIcon: <Lock className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Zero-Trust Security Engine',
          status: 'Protected & Sovereign',
          progressText: 'Active Shield 100%',
          items: [
            {
              icon: <Server className="w-4 h-4 text-orange-500" />,
              label: 'India Data Sovereignty',
              value: '100% Hosted in Tier-4 Indian DCs'
            },
            {
              icon: <Lock className="w-4 h-4 text-orange-500" />,
              label: 'Cryptographic Standard',
              value: 'AES-256 at rest, TLS 1.3 in transit'
            },
            {
              icon: <ShieldCheck className="w-4 h-4 text-orange-500" />,
              label: 'Zero Third-Party Sharing',
              value: 'Customer data is never sold or mined'
            },
            {
              icon: <UserCheck className="w-4 h-4 text-orange-500" />,
              label: 'Role-Based Access',
              value: 'Strict multi-tier permission controls'
            }
          ]
        },
        benefits: [
          {
            icon: <Server className="w-5 h-5 text-orange-600" />,
            title: '100% Indian Data Sovereignty',
            desc: 'All business databases hosted locally under strict jurisdiction.'
          },
          {
            icon: <Lock className="w-5 h-5 text-orange-600" />,
            title: 'Bank-Grade Cryptography',
            desc: 'Military-grade encryption protects every customer record.'
          },
          {
            icon: <UserCheck className="w-5 h-5 text-orange-600" />,
            title: 'Role-Based Team Controls',
            desc: 'Grant granular access permissions across your staff safely.'
          }
        ]
      },
      {
        id: 'dpdp-compliance',
        navTitle: 'DPDP Act 2023 Compliance',
        heading: 'DPDP Act 2023 Regulatory Compliance',
        inputCard: {
          label: 'User Consent & Privacy Event',
          flag: '⚖️',
          value: 'Digital Data Protection Compliance',
          badge: 'Audit-Ready'
        },
        hubIcon: <Scale className="w-6 h-6 text-white" />,
        outputCard: {
          title: 'Compliance & Governance Engine',
          status: 'Fully Certified',
          progressText: '100% Compliant',
          items: [
            {
              icon: <Scale className="w-4 h-4 text-orange-500" />,
              label: 'DPDP Act 2023',
              value: 'Full statutory legal compliance'
            },
            {
              icon: <FileText className="w-4 h-4 text-orange-500" />,
              label: 'Consent Logging',
              value: 'Timestamped audit-ready consent trails'
            },
            {
              icon: <ShieldCheck className="w-4 h-4 text-orange-500" />,
              label: 'Right to be Forgotten',
              value: 'Automated 1-click data deletion API'
            },
            {
              icon: <CheckCircle2 className="w-4 h-4 text-orange-500" />,
              label: 'Security Audits',
              value: 'Regular posture and penetration audits'
            }
          ]
        },
        benefits: [
          {
            icon: <Scale className="w-5 h-5 text-orange-600" />,
            title: 'Statutory DPDP Compliance',
            desc: 'Guard your business against heavy statutory privacy penalties.'
          },
          {
            icon: <FileText className="w-5 h-5 text-orange-600" />,
            title: 'Audit-Ready Consent Logs',
            desc: 'Verifiable digital consent proofs for every user interaction.'
          },
          {
            icon: <ShieldCheck className="w-5 h-5 text-orange-600" />,
            title: 'Enterprise Trust Badge',
            desc: 'Win enterprise corporate clients with certified data posture.'
          }
        ]
      }
    ]
  }
];

export function PaymentsStackSection() {
  const [activeTab, setActiveTab] = useState<TabType>('profiling');
  const [activeCardId, setActiveCardId] = useState<string>('digital-identity');
  const [line1Progress, setLine1Progress] = useState(0); // 0 to 1 between profiling and payments
  const [line2Progress, setLine2Progress] = useState(0); // 0 to 1 between payments and privacy

  // Scroll listener to update sticky pill tabs and active sub-item highlights
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const secProfiling = document.getElementById('section-profiling');
          const secPayments = document.getElementById('section-payments');
          const secPrivacy = document.getElementById('section-privacy');

          if (!secProfiling || !secPayments || !secPrivacy) {
            ticking = false;
            return;
          }

          const pageY = window.pageYOffset || document.documentElement.scrollTop;
          const triggerY = pageY + 240; // Trigger line below sticky navigation

          const topProfiling = secProfiling.getBoundingClientRect().top + pageY;
          const topPayments = secPayments.getBoundingClientRect().top + pageY;
          const topPrivacy = secPrivacy.getBoundingClientRect().top + pageY;

          const cardFraud = document.getElementById('card-fraud-monitoring');
          const cardSplit = document.getElementById('card-split-invoicing');

          const topFraud = cardFraud 
            ? (cardFraud.getBoundingClientRect().top + pageY) 
            : (topProfiling + (topPayments - topProfiling) * 0.5);

          const topSplit = cardSplit 
            ? (cardSplit.getBoundingClientRect().top + pageY) 
            : (topPayments + (topPrivacy - topPayments) * 0.5);

          // 1. Line 1 progress (Profiling -> Payments)
          // Rule: Gated until the second profiling card (Live Fraud Monitoring) is reached!
          let p1 = 0;
          if (triggerY >= topPayments - 80) {
            p1 = 1;
          } else if (triggerY >= topFraud) {
            const dist1 = (topPayments - 80) - topFraud;
            if (dist1 > 0) {
              p1 = (triggerY - topFraud) / dist1;
              p1 = Math.min(1, Math.max(0, p1));
            }
          } else {
            p1 = 0;
          }

          // 2. Line 2 progress (Payments -> Privacy)
          // Rule: Gated until the second payments card (Split Invoicing) is reached!
          let p2 = 0;
          if (triggerY >= topPrivacy - 80) {
            p2 = 1;
          } else if (triggerY >= topSplit) {
            const dist2 = (topPrivacy - 80) - topSplit;
            if (dist2 > 0) {
              p2 = (triggerY - topSplit) / dist2;
              p2 = Math.min(1, Math.max(0, p2));
            }
          } else {
            p2 = 0;
          }

          setLine1Progress(p1);
          setLine2Progress(p2);

          // 3. Active Category Tab (Only switches to Payments/Privacy when actually reaching them!)
          if (triggerY >= topPrivacy - 80) {
            setActiveTab('privacy');
          } else if (triggerY >= topPayments - 80) {
            setActiveTab('payments');
          } else {
            setActiveTab('profiling');
          }

          // 4. Active Sub-Item Card (Track which of the 6 cards is in viewport)
          const cardIds = [
            'digital-identity',
            'fraud-monitoring',
            'unified-upi',
            'split-invoicing',
            'data-encryption',
            'dpdp-compliance'
          ];

          for (let i = cardIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(`card-${cardIds[i]}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 300) {
                setActiveCardId(cardIds[i]);
                break;
              }
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (tabId: TabType) => {
    setActiveTab(tabId);
    const targetEl = document.getElementById(`section-${tabId}`);
    if (targetEl) {
      const yOffset = -150; // Clearance for navbar + sticky pill
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToCard = (cardId: string) => {
    setActiveCardId(cardId);
    const targetEl = document.getElementById(`card-${cardId}`);
    if (targetEl) {
      const yOffset = -150;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#faf9f6] relative z-10 w-full">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Sticky Top Floating Navigation Pill Bar */}
        <div className="sticky top-20 sm:top-24 z-40 pointer-events-none flex justify-center mb-10 sm:mb-14 py-2">
          <div className="pointer-events-auto inline-flex items-center p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-slate-200/90 gap-1 sm:gap-2">
            
            {/* 1. Profiling Tab */}
            <button
              onClick={() => scrollToSection('profiling')}
              className={`relative px-4 sm:px-7 py-2 rounded-full text-xs sm:text-base font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'profiling' 
                  ? 'text-orange-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {activeTab === 'profiling' && (
                <motion.div
                  layoutId="activeStickyPill"
                  className="absolute inset-0 bg-orange-50/90 rounded-full border border-orange-200/70"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">Profiling</span>
            </button>

            {/* Connecting Line 1: Profiling -> Payments */}
            <div className="relative w-8 sm:w-16 md:w-20 h-1 sm:h-1.5 bg-slate-200/80 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${line1Progress * 100}%` }}
              />
              {line1Progress > 0 && line1Progress < 1 && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(249,115,22,1)]"
                  style={{ left: `calc(${line1Progress * 100}% - 4px)` }}
                />
              )}
            </div>

            {/* 2. Payments Tab */}
            <button
              onClick={() => scrollToSection('payments')}
              className={`relative px-4 sm:px-7 py-2 rounded-full text-xs sm:text-base font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'payments' 
                  ? 'text-orange-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {activeTab === 'payments' && (
                <motion.div
                  layoutId="activeStickyPill"
                  className="absolute inset-0 bg-orange-50/90 rounded-full border border-orange-200/70"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">Payments</span>
            </button>

            {/* Connecting Line 2: Payments -> Privacy */}
            <div className="relative w-8 sm:w-16 md:w-20 h-1 sm:h-1.5 bg-slate-200/80 rounded-full overflow-hidden shrink-0">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 rounded-full transition-all duration-100 ease-out"
                style={{ width: `${line2Progress * 100}%` }}
              />
              {line2Progress > 0 && line2Progress < 1 && (
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(249,115,22,1)]"
                  style={{ left: `calc(${line2Progress * 100}% - 4px)` }}
                />
              )}
            </div>

            {/* 3. Privacy Tab */}
            <button
              onClick={() => scrollToSection('privacy')}
              className={`relative px-4 sm:px-7 py-2 rounded-full text-xs sm:text-base font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === 'privacy' 
                  ? 'text-orange-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {activeTab === 'privacy' && (
                <motion.div
                  layoutId="activeStickyPill"
                  className="absolute inset-0 bg-orange-50/90 rounded-full border border-orange-200/70"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">Privacy</span>
            </button>

          </div>
        </div>

        {/* Sequential Sections (Natural Scroll: Profiling -> Payments -> Privacy) */}
        <div className="space-y-24 sm:space-y-36">
          {sectionsData.map((category) => (
            <div 
              key={category.id} 
              id={`section-${category.id}`}
              className="scroll-mt-36"
            >
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left Column: Sticky alongside the 2 cards */}
                <div className="lg:col-span-3 lg:sticky lg:top-36 pt-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    {category.label}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-tight">
                    {category.badge}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="space-y-3.5 border-l-2 border-slate-200/70 pl-3">
                    {category.subItems.map((sub) => {
                      const isSubSelected = activeCardId === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => scrollToCard(sub.id)}
                          className="w-full text-left flex items-start gap-2.5 group transition-colors cursor-pointer py-1"
                        >
                          <div className="relative w-2.5 h-2.5 mt-1.5 shrink-0 flex items-center justify-center">
                            {isSubSelected ? (
                              <>
                                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.85)] scale-110" />
                                <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-60" />
                              </>
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
                            )}
                          </div>
                          <span 
                            className={`text-sm sm:text-base leading-snug transition-colors ${
                              isSubSelected 
                                ? 'text-slate-900 font-bold' 
                                : 'text-slate-500 font-medium group-hover:text-slate-800'
                            }`}
                          >
                            {sub.navTitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Both Content Cards Rendered Sequentially */}
                <div className="lg:col-span-9 space-y-10 sm:space-y-14">
                  {category.subItems.map((sub) => (
                    <div
                      key={sub.id}
                      id={`card-${sub.id}`}
                      className="scroll-mt-36 bg-[#fffdfa] rounded-[24px] sm:rounded-[32px] border border-orange-200/50 shadow-[0_20px_50px_-15px_rgba(249,115,22,0.06)] p-5 sm:p-8 relative overflow-hidden"
                    >
                      {/* Main Serif Heading */}
                      <h4 className="font-serif text-xl sm:text-2xl lg:text-[30px] font-bold text-slate-900 tracking-tight mb-6 leading-tight">
                        {sub.heading}
                      </h4>

                      {/* Interactive Diagram Canvas */}
                      <div className="relative rounded-2xl bg-gradient-to-br from-[#fffdfa] via-white to-orange-50/20 border border-orange-100 p-4 sm:p-6 mb-6 overflow-hidden shadow-xs">
                        {/* Subtle Grid Overlay */}
                        <div 
                          className="absolute inset-0 pointer-events-none opacity-40"
                          style={{
                            backgroundImage: `linear-gradient(to right, #f8ede3 1px, transparent 1px), linear-gradient(to bottom, #f8ede3 1px, transparent 1px)`,
                            backgroundSize: '36px 36px'
                          }}
                        />

                        {/* Connecting Diagram: Left Input -> Center Glowing Hub -> Right Intelligence Card */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
                          
                          {/* 1. Left Input Card */}
                          <div className="w-full md:w-[250px] shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-orange-200/80 shadow-md shadow-orange-950/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] sm:text-xs font-semibold text-orange-600">
                                {sub.inputCard.label}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100/70 text-orange-700">
                                {sub.inputCard.badge}
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5 bg-[#faf8f5] border border-orange-100/80 rounded-xl px-3 py-2 mt-2">
                              <span className="text-lg">{sub.inputCard.flag}</span>
                              <span className="text-sm sm:text-base font-bold text-slate-800 tracking-wide font-mono">
                                {sub.inputCard.value}
                              </span>
                            </div>
                          </div>

                          {/* 2. Center Connector Network Lines & Glowing Processing Hub */}
                          <div className="relative flex items-center justify-center my-2 md:my-0">
                            <div className="hidden md:block w-16 lg:w-24 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                            </div>

                            <div className="relative z-10 w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-orange-500 via-[#f0449b] to-[#7d36fa] flex items-center justify-center shadow-lg shadow-orange-500/35 border-2 border-white scale-100 hover:scale-105 transition-transform p-3">
                              {sub.hubIcon}
                            </div>

                            <div className="hidden md:block w-16 lg:w-24 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-500 animate-ping delay-150" />
                            </div>
                          </div>

                          {/* 3. Right Output / Intelligence Card */}
                          <div className="w-full md:w-[320px] shrink-0 bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-orange-200/70 shadow-lg shadow-orange-950/5">
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-xs font-bold text-slate-600">
                                {sub.outputCard.title}
                              </span>
                              <span className="text-[11px] font-semibold text-orange-600">
                                {sub.outputCard.progressText}
                              </span>
                            </div>

                            {/* Progress Line */}
                            <div className="w-full h-1.5 bg-orange-100 rounded-full overflow-hidden mb-4">
                              <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full w-[85%] animate-pulse" />
                            </div>

                            {/* Verified Signal Items */}
                            <div className="space-y-2.5">
                              {sub.outputCard.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs sm:text-[13px] border-b border-slate-100 pb-1.5 last:border-none last:pb-0">
                                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                                    {item.icon}
                                    <span>{item.label}</span>
                                  </div>
                                  <span className="font-semibold text-slate-900 text-right">
                                    {item.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Bottom 3 Feature Benefit Badges */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-orange-100/80">
                        {sub.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3 group">
                            <div className="w-9 h-9 rounded-xl bg-orange-100/70 border border-orange-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              {benefit.icon}
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5 leading-snug">
                                {benefit.title}
                              </h5>
                              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-medium">
                                {benefit.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
