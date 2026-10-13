export interface PolicySection {
  number?: number;
  title: string;
  content?: string;
  items?: string[];
}

export interface Policy {
  title: string;
  slug: string;
  lastUpdated?: string;
  website?: string;
  poweredBy?: string;
  company?: {
    name: string;
    address: string;
    email: string;
    mobile: string;
  };
  publicationNote?: string;
  content: {
    introduction: string;
    sections: PolicySection[];
  };
}

export interface LegalData {
  title: string;
  description: string;
  policies: Policy[];
}

export const legalData: LegalData = {
  title: "Legal",
  description: "Please review our policies and terms before using DhandaGrow AI services.",
  policies: [
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91-8741886688"
      },
      publicationNote: "Review this policy against your actual data practices, AI providers, cookie settings, retention periods, and applicable legal requirements before publishing.",
      content: {
        introduction: "This document describes how DhandaGrow AI (\"DhandaGrow,\" \"we,\" \"our,\" or \"us\"), powered by Sevenunique Tech Solutions Private Limited, handles personal information, AI content, connected accounts, payments, subscriptions, and KYC/business verification information when you visit our website, register for an account, use our AI tools, connect third-party platforms, or purchase a subscription.",
        sections: [
          {
            number: 1,
            title: "Introduction",
            content: "DhandaGrow AI (“DhandaGrow,” “we,” “our,” or “us”) is an AI-powered business platform that helps individuals, creators, entrepreneurs, and businesses create content, manage marketing activities, automate workflows, and grow their digital presence.\n\nDhandaGrow AI is powered by Sevenunique Tech Solutions Private Limited.\n\nThis Privacy Policy explains how we collect, use, store, process, and protect your personal information when you visit our website, register for an account, use our AI tools, connect third-party platforms, or purchase a subscription."
          },
          {
            number: 2,
            title: "Company and Contact Information",
            content: "Powered by: Sevenunique Tech Solutions Private Limited\nBusiness Address: Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India.\nEmail: support@dhandagrow.com\nMobile: +91 8741886688\nWebsite: https://dhandagrow.com\n\nFor privacy questions, personal data requests, or complaints, please contact us using the details above."
          },
          {
            number: 3,
            title: "Information We Collect",
            content: "We collect information across the following categories to provide and maintain our services:",
            items: [
              "3.1 Account Information: Name, email address, and phone number; login and authentication information; business name, industry, website, and profile details; account preferences and subscription information.",
              "3.2 Payment and Billing Information: When you purchase a paid plan, we may process subscription details, transaction references, payment status, invoices, billing information, and renewal or cancellation records. Payments are processed by third-party payment gateways; we do not store complete payment card numbers or card security codes on our own servers.",
              "3.3 AI Prompts, Uploads, and Generated Content: When you use our AI features, we may process text prompts, images, videos, audio, documents, brand assets, product images, generated outputs, and saved projects to provide requested functionality, generate content, save projects, troubleshoot errors, and maintain service quality.",
              "3.4 Connected Social Media Accounts: If you connect supported third-party platforms, we may process account identifiers, profile information, authorized access tokens, page information, content selected for publishing, scheduling information, and available analytics to provide authorized integrations.",
              "3.5 Technical and Usage Information: IP addresses, device and browser information, pages visited, feature usage, diagnostic logs, timestamps, and security events to maintain and improve our services.",
              "3.6 Support Communications: When you contact our support team, we may retain your messages and relevant account details to respond to your request and resolve issues."
            ]
          },
          {
            number: 4,
            title: "How We Use Your Information",
            content: "We process personal information in accordance with applicable law for the following purposes:",
            items: [
              "Create and manage user accounts.",
              "Provide AI-powered content generation and business tools.",
              "Support authorized social media publishing and automation.",
              "Process subscriptions, payments, renewals, and cancellations.",
              "Provide customer support and troubleshoot technical issues.",
              "Protect accounts, detect fraud, and maintain platform security.",
              "Analyze performance and improve our services.",
              "Send important service, security, and billing notifications.",
              "Meet applicable legal, tax, accounting, and regulatory obligations."
            ]
          },
          {
            number: 5,
            title: "AI Processing and Third-Party Providers",
            content: "DhandaGrow AI may use third-party AI models, APIs, hosting providers, cloud infrastructure, and other service providers to deliver its features. When you submit a prompt or upload content, relevant information may be transmitted to the provider required to perform the requested operation.\n\nThird-party providers may process information under their own privacy policies and contractual terms. We will describe the use of customer content for model training or service improvement according to our actual provider configurations, contractual commitments, and applicable legal requirements. Users should review any feature-specific privacy notices before submitting confidential information.\n\nAI-generated outputs may be inaccurate or incomplete and should be reviewed before publication or use."
          },
          {
            number: 6,
            title: "Cookies and Similar Technologies",
            content: "We may use cookies and similar technologies for authentication, session management, preferences, security, and website analytics. Where required by law, we will obtain consent before using non-essential cookies or tracking technologies.\n\nYou may manage available cookie preferences through our website settings or your browser. Disabling certain cookies may affect functionality. Please refer to our Cookie Policy for additional information."
          },
          {
            number: 7,
            title: "Sharing of Information",
            content: "We may share information with service providers supporting hosting, databases, AI processing, analytics, email, and customer support; payment gateways processing transactions and subscriptions; third-party platforms you connect to perform authorized actions; legal or regulatory authorities where disclosure is required or permitted by law; and relevant parties in a business merger, acquisition, or transfer, subject to applicable safeguards.\n\nWe do not intend to sell personal information to third parties."
          },
          {
            number: 8,
            title: "Data Retention",
            content: "We retain personal information for as long as reasonably necessary to provide our services, maintain accounts, process transactions, resolve disputes, ensure security, and meet legal obligations. Retention periods vary depending on the information and purpose.\n\nWhere information is no longer required, we will take appropriate steps to delete or anonymize it, subject to applicable legal requirements and technical limitations."
          },
          {
            number: 9,
            title: "Data Security",
            content: "We implement appropriate technical and organizational safeguards designed to protect information from unauthorized access, loss, misuse, or disclosure. These measures may include access controls, secure authentication, encryption where appropriate, monitoring, and restricted access to customer data.\n\nNo internet-based service can guarantee absolute security. Please protect your login credentials and contact us if you suspect unauthorized account access."
          },
          {
            number: 10,
            title: "Your Privacy Rights",
            content: "Subject to applicable law, you may have the right to request information about your personal data, request correction of inaccurate information, request deletion of personal information where applicable, withdraw consent where processing is based on consent, and raise a grievance regarding the handling of personal information.\n\nTo submit a request, email support@dhandagrow.com with the subject line “Privacy Request.” We may verify your identity before processing requests. Some information may need to be retained to comply with legal obligations or resolve disputes."
          },
          {
            number: 11,
            title: "Account Deletion and Connected Accounts",
            content: "You may request account deletion through available account settings or by contacting our support team. You may also disconnect third-party integrations through the relevant settings or revoke access through the third-party platform.\n\nDisconnecting an integration may stop future access but does not automatically delete content already published on external platforms or information retained by those platforms. We will handle deletion requests according to applicable law and our data-retention obligations."
          },
          {
            number: 12,
            title: "Children's Privacy",
            content: "DhandaGrow AI is designed for business, professional, and creator use. We will handle children's personal data in accordance with applicable legal requirements, including any required parental consent and safeguards.\n\nIf you believe that personal information has been collected inappropriately, please contact support@dhandagrow.com."
          },
          {
            number: 13,
            title: "Third-Party Websites",
            content: "Our services may contain links to external websites or integrations. We are not responsible for the independent privacy practices of third-party services. Please review their privacy policies before providing them with personal information."
          },
          {
            number: 14,
            title: "Marketing Communications",
            content: "We may send essential account, security, payment, and subscription notifications. Promotional communications will be sent in accordance with applicable law and required consent. You may unsubscribe from marketing emails using the available unsubscribe mechanism."
          },
          {
            number: 15,
            title: "Changes to This Policy",
            content: "We may update this Privacy Policy to reflect changes in our services, data practices, or applicable legal requirements. Updated versions will be published on this page with a revised “Last Updated” date. Where required, we will notify users or obtain additional consent."
          },
          {
            number: 16,
            title: "Contact and Grievance Redressal",
            content: "Sevenunique Tech Solutions Private Limited\nPowered by: DhandaGrow AI\nAddress: Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India.\nEmail: support@dhandagrow.com\nMobile: +91 8741886688\n\nWe will review and respond to privacy requests and grievances in accordance with applicable law."
          },
          {
            number: 17,
            title: "Applicable Law",
            content: "This Privacy Policy will be interpreted in accordance with applicable Indian laws and other applicable data-protection requirements. Nothing in this Policy limits any rights that cannot lawfully be excluded."
          },
          {
            number: 18,
            title: "KYC, Identity Verification, and Business Information",
            content: "DhandaGrow AI may collect and process identity and business verification information where necessary to provide specific services, verify accounts, prevent fraud, meet legal obligations, or comply with third-party service provider requirements:",
            items: [
              "18.1 Individual Identity Information: Depending on the service, information may include full legal name, date of birth where required, residential or business address, mobile number and email address, government-issued identity document details where legally permitted and necessary, and verification status or related records.",
              "18.2 Business KYC Information: For business accounts, merchant accounts, or business verification, we may collect registered business name and address, business registration or incorporation certificate, company PAN or other applicable tax identification details, GSTIN where applicable, details of directors, partners, proprietors, authorized representatives or beneficial owners where required, business bank account verification information, and relevant licences or supporting documents.",
              "18.3 Documents and Supporting Evidence: Where required for a specific service or verification process, users may be asked to provide PAN card or other permitted identity documents, address proof, certificate of incorporation or business registration documents, GST registration certificate, authorized signatory or ownership documentation, bank account proof, or other financial verification documents. We will request only information reasonably necessary for the relevant purpose and subject to applicable law. Users should not submit identity documents unless the relevant feature or verification request requires them.",
              "18.4 Payment Gateway and Third-Party KYC: Payments and subscriptions may be processed by third-party payment gateways or other service providers. These providers may independently collect and verify identity, business, banking, tax, and beneficial ownership information under their own policies and legal obligations. DhandaGrow AI does not claim to perform regulated KYC verification unless the relevant service and legal authorization permit it.",
              "18.5 Purpose of KYC Processing: We may use KYC and business verification information to verify identity and business ownership; confirm eligibility for specific services; prevent impersonation, fraudulent accounts, and unauthorized transactions; support payment gateway onboarding and merchant verification; meet applicable legal, contractual, tax, accounting, and compliance requirements; investigate suspicious activity; and maintain appropriate verification and audit records.",
              "18.6 Storage, Access, and Retention of KYC Documents: KYC documents and related verification information will be handled using appropriate access controls and security safeguards. Access will be restricted to authorized personnel and service providers who need the information for legitimate operational, verification, or compliance purposes. We will retain KYC information only for the period necessary for stated purposes or as required by law.",
              "18.7 Accuracy and User Responsibility: Users must provide accurate, complete, and up-to-date information when submitting verification details. Providing false, misleading, or unauthorized documents may result in verification failure or restrictions on specific services or account suspension where justified and permitted by applicable law. Users must not submit another person's identity documents or personal information without appropriate authority."
            ]
          },
          {
            number: 19,
            title: "Sensitive Personal Information and Financial Details",
            content: "Certain identity, financial, and verification information may require additional safeguards under applicable law. Where necessary and legally permitted, we may process relevant bank account details, tax identification information, identity verification records, and other information required to provide the requested service.\n\nWe do not request passwords, card security codes, or unrelated sensitive information through ordinary email. Users should provide documents only through an authorized and secure submission channel.\n\nWhere Aadhaar information or other specially regulated identifiers are involved, we will follow applicable legal restrictions and use permitted verification methods."
          },
          {
            number: 20,
            title: "Privacy Requests Relating to KYC Information",
            content: "Users may contact support@dhandagrow.com to request information about their personal data, correction of inaccurate information, or deletion where applicable. Before responding, we may need to verify the requester's identity. We may retain certain verification or transaction records where required by law or necessary for legitimate compliance purposes.\n\nIf a payment gateway or another independent service provider collected the information directly, users may also need to contact that provider to exercise rights relating to its separate processing activities."
          }
        ]
      }
    },
    {
      title: "DhandaGrow AI Terms & Conditions",
      slug: "terms-of-service",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91 8741886688"
      },
      publicationNote: "Review these Terms against your actual product features, pricing, refund policy, subscription flow, and applicable legal requirements before publishing.",
      content: {
        introduction: "These Terms and Conditions (“Terms”) govern your access to and use of DhandaGrow AI, available at https://dhandagrow.com, including its website, applications, AI tools, integrations, and subscription services (“Services”). DhandaGrow AI is powered by Sevenunique Tech Solutions Private Limited (“Company,” “we,” “us,” or “our”). By accessing or using the Services, creating an account, or purchasing a subscription, you agree to these Terms. If you do not agree, do not use the Services. If you use the Services on behalf of a business or other organization, you confirm that you are authorized to bind that organization to these Terms.",
        sections: [
          {
            number: 1,
            title: "Introduction and Acceptance",
            content: "These Terms and Conditions (“Terms”) govern your access to and use of DhandaGrow AI, available at https://dhandagrow.com, including its website, applications, AI tools, integrations, and subscription services (“Services”). DhandaGrow AI is powered by Sevenunique Tech Solutions Private Limited (“Company,” “we,” “us,” or “our”). By accessing or using the Services, creating an account, or purchasing a subscription, you agree to these Terms. If you do not agree, do not use the Services. If you use the Services on behalf of a business or other organization, you confirm that you are authorized to bind that organization to these Terms."
          },
          {
            number: 2,
            title: "Company Information and Contact",
            content: "Powered by: Sevenunique Tech Solutions Private Limited\nAddress: Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India.\nEmail: support@dhandagrow.com\nMobile: +91 8741886688\nWebsite: https://dhandagrow.com"
          },
          {
            number: 3,
            title: "Eligibility and Accounts",
            content: "You must provide accurate and current information when creating an account and keep your account details updated. You are responsible for safeguarding your login credentials and for activities carried out through your account, subject to applicable law. You must be legally capable of entering into a binding agreement under applicable law. If you are using the Services for a business, you must have the authority to accept these Terms on its behalf. We may request identity or business verification information where reasonably necessary for security, payment gateway onboarding, fraud prevention, or legal compliance. Any such information will be handled in accordance with our Privacy Policy and applicable law."
          },
          {
            number: 4,
            title: "Services and Availability",
            content: "DhandaGrow AI provides AI-powered tools and workflows that may include content generation, image or video tools, social media scheduling, marketing automation, analytics, messaging integrations, website tools, and other features made available from time to time. Features may vary by plan, location, platform permissions, third-party provider availability, or technical requirements. We may add, modify, suspend, or discontinue features, subject to applicable law and any rights that cannot lawfully be excluded. We aim to maintain reliable service but do not guarantee uninterrupted, error-free, or continuous availability. Maintenance, outages, third-party failures, or events outside our reasonable control may affect access."
          },
          {
            number: 5,
            title: "User Responsibilities and Acceptable Use",
            content: "You agree to use the Services lawfully and responsibly. You must not:\n- Violate applicable laws, regulations, court orders, or third-party rights.\n- Upload or distribute content that you do not have the rights or permissions to use.\n- Use the Services for fraud, impersonation, harassment, scams, spam, or deceptive activity.\n- Attempt to gain unauthorized access to accounts, systems, APIs, or data.\n- Interfere with platform security, bypass usage limits, or reverse engineer the Services except where applicable law expressly permits.\n- Use automation to violate the terms, rate limits, or policies of connected third-party platforms.\n- Submit malicious code or use the Services to create or distribute unlawful material.\nYou are responsible for your prompts, uploaded materials, generated content, connected accounts, and actions performed through your account."
          },
          {
            number: 6,
            title: "AI-Generated Content and Limitations",
            content: "AI outputs may be inaccurate, incomplete, outdated, biased, or unsuitable for a particular purpose. AI-generated content should be reviewed by you before publication, distribution, or reliance. Unless expressly agreed otherwise in writing, we do not guarantee that an AI output will be unique, accurate, legally compliant, non-infringing, or suitable for your intended use. You are responsible for checking the accuracy of factual claims, advertising statements, product descriptions, legal or financial claims, and other content before using it. Do not rely on AI outputs as a substitute for professional legal, medical, financial, tax, or other expert advice."
          },
          {
            number: 7,
            title: "User Content and Permissions",
            content: "You retain whatever rights you have in the content you submit to the Services. You grant the Company a limited, non-exclusive permission to host, process, transmit, reproduce, and modify that content only as reasonably necessary to provide, secure, and support the Services, subject to our Privacy Policy and applicable law. You confirm that you have the rights and permissions necessary to submit content, use relevant likenesses or trademarks, and authorize requested publication or processing. You are responsible for maintaining copies of important content. Features for saving or exporting content may be subject to technical limits and availability."
          },
          {
            number: 8,
            title: "Third-Party Integrations",
            content: "The Services may integrate with third-party platforms, AI providers, payment gateways, hosting providers, social media services, or messaging services. Your use of those services may be subject to their separate terms and policies. You authorize us to perform actions through connected accounts only to the extent you grant the required permissions and request the relevant functionality. You are responsible for reviewing scheduled posts, messages, campaigns, and other actions before they are executed where review is offered. Third-party APIs, permissions, pricing, and availability may change. We are not responsible for independent third-party services to the extent permitted by applicable law."
          },
          {
            number: 9,
            title: "Plans, Pricing, and Payments",
            content: "Paid features, plan names, prices, included usage, and billing periods will be shown on the applicable pricing or checkout page. The price and terms displayed at the time of purchase will apply to that purchase, subject to applicable law. Payments may be processed by third-party payment gateways. You authorize the selected payment provider to process your transaction using the payment method you choose. We may receive transaction references, payment status, and billing-related information. You must provide accurate billing information and pay applicable charges, taxes, and fees disclosed at checkout. We will not knowingly charge an amount different from the amount properly disclosed and authorized, except as permitted by law and the agreed billing terms. We may change future plan prices with appropriate notice where required. Price changes will not retroactively change a completed transaction."
          },
          {
            number: 10,
            title: "Manual Renewal and Automatic Subscription Billing",
            content: "Some plans may renew manually, while others may offer automatic recurring billing. The available billing method will be disclosed during checkout. For manual renewal, you must complete a new payment to continue the paid service after the applicable period expires. For automatic renewal, you authorize recurring charges according to the plan, payment mandate, and renewal terms presented during checkout. Recurring payments may be subject to payment-provider rules, bank requirements, applicable law, and successful authorization. You are responsible for reviewing the billing frequency, renewal date, amount, and cancellation instructions before confirming an automatic subscription. If a recurring payment fails, access may be restricted, suspended, or moved to a limited state according to the plan terms and applicable law. We may notify you and allow you to update your payment method or resolve the failure."
          },
          {
            number: 11,
            title: "Cancellation, Refunds, and Failed Payments",
            content: "You may request cancellation through the account billing settings, where available, or by contacting support@dhandagrow.com. The effective date and effect of cancellation will depend on your plan and the terms shown at purchase. Where a subscription is cancelled at the end of a paid period, access may continue until that period ends. Cancellation may not automatically refund an amount already paid. Refund eligibility, timelines, exceptions, and processing methods are described in our Refund and Cancellation Policy, which should be read together with these Terms. Applicable statutory rights remain unaffected. If a payment is pending, duplicated, failed, or incorrectly recorded, contact support with the relevant order or transaction reference. Do not send full card numbers, security codes, passwords, or unnecessary sensitive information by email."
          },
          {
            number: 12,
            title: "Subscription Limits, Credits, and Fair Use",
            content: "Plans may include usage limits, AI credits, storage limits, rate limits, or feature restrictions. The applicable limits will be displayed in the product or plan description. You must not circumvent usage limits, share accounts in a manner that breaches your plan, or use automated access in a way that harms service availability. Unless the plan terms expressly state otherwise, unused credits or allowances may expire at the end of the applicable period and may not be redeemable for cash. Any specific credit purchase terms displayed at checkout will apply."
          },
          {
            number: 13,
            title: "Intellectual Property",
            content: "The Services, including software, branding, interface design, documentation, and other Company materials, are owned by or licensed to the Company and are protected by applicable intellectual property laws. Except for the limited right to use the Services under these Terms, no ownership rights in Company materials are transferred to you. Rights in user-provided content remain with their respective owners. Ownership and permitted use of AI-generated outputs may depend on applicable law, third-party model terms, and the rights in source materials. You are responsible for ensuring that your use of outputs does not violate another person's rights."
          },
          {
            number: 14,
            title: "Privacy and Data Protection",
            content: "Our Privacy Policy explains how we collect, use, disclose, retain, and protect personal information, including account details, AI prompts, uploads, payment-related records, connected account data, and KYC or business verification information. By using the Services, you acknowledge that your information will be handled as described in the Privacy Policy and under applicable law. Where consent is legally required, we will seek it separately. Please do not upload identity documents or sensitive information unless required for a specific authorized verification process. Any KYC information requested will be handled under our Privacy Policy and applicable requirements."
          },
          {
            number: 15,
            title: "Security and Account Suspension",
            content: "We may take reasonable steps to protect the Services, users, and third parties from security threats, fraud, abuse, or unlawful activity. Where reasonably necessary and permitted by law, we may suspend, restrict, or terminate access if you materially breach these Terms, misuse the Services, fail required verification, create a security risk, or use the Services unlawfully. Where appropriate, we will provide notice or an opportunity to resolve the issue. Suspension or termination will not remove rights or obligations that accrued before it, and will remain subject to applicable law."
          },
          {
            number: 16,
            title: "Disclaimers",
            content: "To the extent permitted by applicable law, the Services are provided on an “as available” basis. We do not guarantee that the Services will meet every requirement, operate without interruption, or produce any particular business, marketing, audience, or revenue result. Nothing in these Terms excludes a warranty, guarantee, or consumer right that cannot lawfully be excluded under applicable law."
          },
          {
            number: 17,
            title: "Limitation of Liability",
            content: "To the extent permitted by applicable law, the Company will not be liable for indirect, incidental, special, consequential, or punitive losses, or loss of profits, revenue, goodwill, or data arising from use of the Services. Nothing in these Terms limits liability where such limitation is prohibited by law, including applicable liability for fraud, wilful misconduct, or other matters that cannot legally be excluded. Where a limitation of liability is legally enforceable, the extent of liability will be determined in accordance with applicable law and the circumstances of the claim."
          },
          {
            number: 18,
            title: "Indemnity",
            content: "To the extent permitted by applicable law, you are responsible for claims arising from your unlawful use of the Services, your breach of these Terms, or your infringement of third-party rights. This section does not apply to the extent a claim results from the Company's own unlawful conduct or where such allocation is prohibited by law."
          },
          {
            number: 19,
            title: "Changes to the Services or Terms",
            content: "We may update these Terms to reflect changes in our Services, operations, or legal requirements. We will publish the revised version with an updated effective or last-updated date and provide additional notice where required by law. Your continued use after changes take effect may constitute acceptance where permitted by law. If you do not agree to material changes, you should stop using the affected Services and may contact us about cancellation of any paid plan, subject to applicable terms and law."
          },
          {
            number: 20,
            title: "Governing Law and Disputes",
            content: "These Terms are intended to be governed by the laws of India, subject to applicable consumer-protection and other mandatory legal rights. If you have a concern or dispute, please first contact support@dhandagrow.com so we can attempt to resolve it. Nothing in this section removes any right to approach a competent authority, consumer forum, or court where permitted by law."
          },
          {
            number: 21,
            title: "Contact and Grievances",
            content: "For questions about these Terms, billing, cancellation, or complaints, contact:\nSevenunique Tech Solutions Private Limited\nPowered by DhandaGrow AI\nAddress: Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India.\nEmail: support@dhandagrow.com\nMobile: +91 8741886688"
          },
          {
            number: 22,
            title: "Entire Agreement and Severability",
            content: "These Terms, together with the Privacy Policy, Refund and Cancellation Policy, and any additional terms displayed for a specific feature or purchase, form the agreement governing your use of the Services to the extent permitted by law. If any provision is held unenforceable, the remaining provisions will continue to apply to the extent permitted by applicable law."
          }
        ]
      }
    },
    {
      title: "DhandaGrow AI Terms & Conditions",
      slug: "terms-and-conditions",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91 8741886688"
      },
      publicationNote: "Review these Terms against your actual product features, pricing, refund policy, subscription flow, and applicable legal requirements before publishing.",
      content: {
        introduction: "These Terms and Conditions (“Terms”) govern your access to and use of DhandaGrow AI, available at https://dhandagrow.com, including its website, applications, AI tools, integrations, and subscription services (“Services”). DhandaGrow AI is powered by Sevenunique Tech Solutions Private Limited (“Company,” “we,” “us,” or “our”). By accessing or using the Services, creating an account, or purchasing a subscription, you agree to these Terms. If you do not agree, do not use the Services. If you use the Services on behalf of a business or other organization, you confirm that you are authorized to bind that organization to these Terms.",
        sections: [
          {
            number: 1,
            title: "Introduction and Acceptance",
            content: "These Terms and Conditions (“Terms”) govern your access to and use of DhandaGrow AI, available at https://dhandagrow.com, including its website, applications, AI tools, integrations, and subscription services (“Services”). DhandaGrow AI is powered by Sevenunique Tech Solutions Private Limited (“Company,” “we,” “us,” or “our”). By accessing or using the Services, creating an account, or purchasing a subscription, you agree to these Terms. If you do not agree, do not use the Services. If you use the Services on behalf of a business or other organization, you confirm that you are authorized to bind that organization to these Terms."
          },
          {
            number: 2,
            title: "Company Information and Contact",
            content: "Powered by: Sevenunique Tech Solutions Private Limited\nAddress: Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India.\nEmail: support@dhandagrow.com\nMobile: +91 8741886688\nWebsite: https://dhandagrow.com"
          },
          {
            number: 3,
            title: "Eligibility and Accounts",
            content: "You must provide accurate and current information when creating an account and keep your account details updated. You are responsible for safeguarding your login credentials and for activities carried out through your account, subject to applicable law. You must be legally capable of entering into a binding agreement under applicable law. If you are using the Services for a business, you must have the authority to accept these Terms on its behalf. We may request identity or business verification information where reasonably necessary for security, payment gateway onboarding, fraud prevention, or legal compliance. Any such information will be handled in accordance with our Privacy Policy and applicable law."
          },
          {
            number: 4,
            title: "Services and Availability",
            content: "DhandaGrow AI provides AI-powered tools and workflows that may include content generation, image or video tools, social media scheduling, marketing automation, analytics, messaging integrations, website tools, and other features made available from time to time. Features may vary by plan, location, platform permissions, third-party provider availability, or technical requirements. We may add, modify, suspend, or discontinue features, subject to applicable law and any rights that cannot lawfully be excluded. We aim to maintain reliable service but do not guarantee uninterrupted, error-free, or continuous availability. Maintenance, outages, third-party failures, or events outside our reasonable control may affect access."
          },
          {
            number: 5,
            title: "User Responsibilities and Acceptable Use",
            content: "You agree to use the Services lawfully and responsibly. You must not:\n- Violate applicable laws, regulations, court orders, or third-party rights.\n- Upload or distribute content that you do not have the rights or permissions to use.\n- Use the Services for fraud, impersonation, harassment, scams, spam, or deceptive activity.\n- Attempt to gain unauthorized access to accounts, systems, APIs, or data.\n- Interfere with platform security, bypass usage limits, or reverse engineer the Services except where applicable law expressly permits.\n- Use automation to violate the terms, rate limits, or policies of connected third-party platforms.\n- Submit malicious code or use the Services to create or distribute unlawful material.\nYou are responsible for your prompts, uploaded materials, generated content, connected accounts, and actions performed through your account."
          },
          {
            number: 6,
            title: "AI-Generated Content and Limitations",
            content: "AI outputs may be inaccurate, incomplete, outdated, biased, or unsuitable for a particular purpose. AI-generated content should be reviewed by you before publication, distribution, or reliance. Unless expressly agreed otherwise in writing, we do not guarantee that an AI output will be unique, accurate, legally compliant, non-infringing, or suitable for your intended use. You are responsible for checking the accuracy of factual claims, advertising statements, product descriptions, legal or financial claims, and other content before using it. Do not rely on AI outputs as a substitute for professional legal, medical, financial, tax, or other expert advice."
          },
          {
            number: 7,
            title: "User Content and Permissions",
            content: "You retain whatever rights you have in the content you submit to the Services. You grant the Company a limited, non-exclusive permission to host, process, transmit, reproduce, and modify that content only as reasonably necessary to provide, secure, and support the Services, subject to our Privacy Policy and applicable law. You confirm that you have the rights and permissions necessary to submit content, use relevant likenesses or trademarks, and authorize requested publication or processing. You are responsible for maintaining copies of important content. Features for saving or exporting content may be subject to technical limits and availability."
          },
          {
            number: 8,
            title: "Third-Party Integrations",
            content: "The Services may integrate with third-party platforms, AI providers, payment gateways, hosting providers, social media services, or messaging services. Your use of those services may be subject to their separate terms and policies. You authorize us to perform actions through connected accounts only to the extent you grant the required permissions and request the relevant functionality. You are responsible for reviewing scheduled posts, messages, campaigns, and other actions before they are executed where review is offered. Third-party APIs, permissions, pricing, and availability may change. We are not responsible for independent third-party services to the extent permitted by applicable law."
          },
          {
            number: 9,
            title: "Plans, Pricing, and Payments",
            content: "Paid features, plan names, prices, included usage, and billing periods will be shown on the applicable pricing or checkout page. The price and terms displayed at the time of purchase will apply to that purchase, subject to applicable law. Payments may be processed by third-party payment gateways. You authorize the selected payment provider to process your transaction using the payment method you choose. We may receive transaction references, payment status, and billing-related information. You must provide accurate billing information and pay applicable charges, taxes, and fees disclosed at checkout. We will not knowingly charge an amount different from the amount properly disclosed and authorized, except as permitted by law and the agreed billing terms. We may change future plan prices with appropriate notice where required. Price changes will not retroactively change a completed transaction."
          },
          {
            number: 10,
            title: "Manual Renewal and Automatic Subscription Billing",
            content: "Some plans may renew manually, while others may offer automatic recurring billing. The available billing method will be disclosed during checkout. For manual renewal, you must complete a new payment to continue the paid service after the applicable period expires. For automatic renewal, you authorize recurring charges according to the plan, payment mandate, and renewal terms presented during checkout. Recurring payments may be subject to payment-provider rules, bank requirements, applicable law, and successful authorization. You are responsible for reviewing the billing frequency, renewal date, amount, and cancellation instructions before confirming an automatic subscription. If a recurring payment fails, access may be restricted, suspended, or moved to a limited state according to the plan terms and applicable law. We may notify you and allow you to update your payment method or resolve the failure."
          },
          {
            number: 11,
            title: "Cancellation, Refunds, and Failed Payments",
            content: "You may request cancellation through the account billing settings, where available, or by contacting support@dhandagrow.com. The effective date and effect of cancellation will depend on your plan and the terms shown at purchase. Where a subscription is cancelled at the end of a paid period, access may continue until that period ends. Cancellation may not automatically refund an amount already paid. Refund eligibility, timelines, exceptions, and processing methods are described in our Refund and Cancellation Policy, which should be read together with these Terms. Applicable statutory rights remain unaffected. If a payment is pending, duplicated, failed, or incorrectly recorded, contact support with the relevant order or transaction reference. Do not send full card numbers, security codes, passwords, or unnecessary sensitive information by email."
          },
          {
            number: 12,
            title: "Subscription Limits, Credits, and Fair Use",
            content: "Plans may include usage limits, AI credits, storage limits, rate limits, or feature restrictions. The applicable limits will be displayed in the product or plan description. You must not circumvent usage limits, share accounts in a manner that breaches your plan, or use automated access in a way that harms service availability. Unless the plan terms expressly state otherwise, unused credits or allowances may expire at the end of the applicable period and may not be redeemable for cash. Any specific credit purchase terms displayed at checkout will apply."
          },
          {
            number: 13,
            title: "Intellectual Property",
            content: "The Services, including software, branding, interface design, documentation, and other Company materials, are owned by or licensed to the Company and are protected by applicable intellectual property laws. Except for the limited right to use the Services under these Terms, no ownership rights in Company materials are transferred to you. Rights in user-provided content remain with their respective owners. Ownership and permitted use of AI-generated outputs may depend on applicable law, third-party model terms, and the rights in source materials. You are responsible for ensuring that your use of outputs does not violate another person's rights."
          },
          {
            number: 14,
            title: "Privacy and Data Protection",
            content: "Our Privacy Policy explains how we collect, use, disclose, retain, and protect personal information, including account details, AI prompts, uploads, payment-related records, connected account data, and KYC or business verification information. By using the Services, you acknowledge that your information will be handled as described in the Privacy Policy and under applicable law. Where consent is legally required, we will seek it separately. Please do not upload identity documents or sensitive information unless required for a specific authorized verification process. Any KYC information requested will be handled under our Privacy Policy and applicable requirements."
          },
          {
            number: 15,
            title: "Security and Account Suspension",
            content: "We may take reasonable steps to protect the Services, users, and third parties from security threats, fraud, abuse, or unlawful activity. Where reasonably necessary and permitted by law, we may suspend, restrict, or terminate access if you materially breach these Terms, misuse the Services, fail required verification, create a security risk, or use the Services unlawfully. Where appropriate, we will provide notice or an opportunity to resolve the issue. Suspension or termination will not remove rights or obligations that accrued before it, and will remain subject to applicable law."
          },
          {
            number: 16,
            title: "Disclaimers",
            content: "To the extent permitted by applicable law, the Services are provided on an “as available” basis. We do not guarantee that the Services will meet every requirement, operate without interruption, or produce any particular business, marketing, audience, or revenue result. Nothing in these Terms excludes a warranty, guarantee, or consumer right that cannot lawfully be excluded under applicable law."
          },
          {
            number: 17,
            title: "Limitation of Liability",
            content: "To the extent permitted by applicable law, the Company will not be liable for indirect, incidental, special, consequential, or punitive losses, or loss of profits, revenue, goodwill, or data arising from use of the Services. Nothing in these Terms limits liability where such limitation is prohibited by law, including applicable liability for fraud, wilful misconduct, or other matters that cannot legally be excluded. Where a limitation of liability is legally enforceable, the extent of liability will be determined in accordance with applicable law and the circumstances of the claim."
          },
          {
            number: 18,
            title: "Indemnity",
            content: "To the extent permitted by applicable law, you are responsible for claims arising from your unlawful use of the Services, your breach of these Terms, or your infringement of third-party rights. This section does not apply to the extent a claim results from the Company's own unlawful conduct or where such allocation is prohibited by law."
          },
          {
            number: 19,
            title: "Changes to the Services or Terms",
            content: "We may update these Terms to reflect changes in our Services, operations, or legal requirements. We will publish the revised version with an updated effective or last-updated date and provide additional notice where required by law. Your continued use after changes take effect may constitute acceptance where permitted by law. If you do not agree to material changes, you should stop using the affected Services and may contact us about cancellation of any paid plan, subject to applicable terms and law."
          },
          {
            number: 20,
            title: "Governing Law and Disputes",
            content: "These Terms are intended to be governed by the laws of India, subject to applicable consumer-protection and other mandatory legal rights. If you have a concern or dispute, please first contact support@dhandagrow.com so we can attempt to resolve it. Nothing in this section removes any right to approach a competent authority, consumer forum, or court where permitted by law."
          },
          {
            number: 21,
            title: "Contact and Grievances",
            content: "For questions about these Terms, billing, cancellation, or complaints, contact:\nSevenunique Tech Solutions Private Limited\nPowered by DhandaGrow AI\nAddress: Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India.\nEmail: support@dhandagrow.com\nMobile: +91 8741886688"
          },
          {
            number: 22,
            title: "Entire Agreement and Severability",
            content: "These Terms, together with the Privacy Policy, Refund and Cancellation Policy, and any additional terms displayed for a specific feature or purchase, form the agreement governing your use of the Services to the extent permitted by law. If any provision is held unenforceable, the remaining provisions will continue to apply to the extent permitted by applicable law."
          }
        ]
      }
    },
    {
      title: "DhandaGrow AI Cookie Policy",
      slug: "cookie-policy",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91 8741886688"
      },
      publicationNote: "This Cookie Policy explains how DhandaGrow AI uses cookies and similar technologies on https://dhandagrow.com and related web pages or services. It should be published only after it has been checked against the cookies, analytics tools, advertising pixels and other technologies actually enabled on the website.",
      content: {
        introduction: "This Cookie Policy explains how DhandaGrow AI (“DhandaGrow”, “we”, “us” or “our”) uses cookies and similar technologies on https://dhandagrow.com and related web pages or services. Similar technologies include local storage, pixels, tags, SDKs and scripts that remember settings, measure website use or support features.",
        sections: [
          {
            number: 1,
            title: "What Are Cookies?",
            content: "Cookies are small text files that a website may store on your browser or device. Similar technologies include local storage, pixels, tags, SDKs and scripts that remember settings, measure website use or support features. This policy uses “cookies” as a general term for these technologies."
          },
          {
            number: 2,
            title: "Why We Use Cookies",
            content: "We may use cookies and similar technologies to:",
            items: [
              "Make the website and account sign-in work;",
              "Keep sessions secure, prevent fraud and protect accounts;",
              "Remember preferences such as language or interface settings;",
              "Understand website traffic, page performance and feature usage;",
              "Diagnose errors and improve reliability; and",
              "Measure marketing campaigns or show relevant advertising, but only where these tools are actually used and any required consent has been obtained."
            ]
          },
          {
            number: 3,
            title: "Categories of Cookies",
            items: [
              "Strictly necessary: Support core functions such as navigation, security, load balancing, session management and payment or checkout flows. These generally cannot be switched off through a preference tool if the requested service depends on them.",
              "Preferences / functional: Remember choices and settings to make the experience more convenient.",
              "Analytics / performance: Help us understand how visitors use the site, which pages perform well and where errors occur. We will configure these tools to respect applicable consent requirements.",
              "Advertising / measurement: If enabled, these may measure campaign effectiveness or help deliver ads. They may be set by us or by third-party providers and should be used only in accordance with applicable law and the consent choices presented to you."
            ]
          },
          {
            number: 4,
            title: "First-Party and Third-Party Technologies",
            content: "Some technologies may be set by DhandaGrow directly (first-party), while others may be provided by service providers such as hosting, security, analytics, customer-support, payment or advertising partners (third-party). Third parties may process information under their own policies and terms. We will identify material third-party technologies in our cookie-preference interface or cookie list where applicable.\n\nThis policy does not assert that any particular analytics, advertising or payment provider is currently active. The actual provider list should be verified against the website’s production configuration before publication."
          },
          {
            number: 5,
            title: "Cookie Choices and Consent",
            content: "When required, we will ask for consent before placing non-essential cookies or using similar technologies. You should be able to accept, reject or customise non-essential categories through the cookie banner or preference settings. Rejecting non-essential cookies should not disable features that do not depend on them.\n\nYou may change or withdraw your choice later using the website’s “Cookie Settings” link or equivalent control, if available. Withdrawing consent does not make prior processing unlawful, but it will affect future use of technologies covered by that choice."
          },
          {
            number: 6,
            title: "Browser and Device Controls",
            content: "Most browsers let you block, delete or limit cookies through their settings. The method varies by browser and device. Blocking all cookies may cause some website or account features to stop working. Browser-based “Do Not Track” signals are not interpreted consistently across services; we will respond to any legally recognised preference signal where required by applicable law."
          },
          {
            number: 7,
            title: "Information Collected Through Cookies",
            content: "Depending on the technology and your choices, cookie-related information may include an online identifier, device and browser details, IP address, approximate region, pages viewed, referral source, timestamps, session events, settings and interactions with website features. We aim to collect only information reasonably needed for the stated purpose and to avoid placing sensitive account, password or payment-card information in cookies."
          },
          {
            number: 8,
            title: "How We Use Cookie-Related Information",
            content: "We may use this information to provide requested website functionality, maintain security, remember preferences, analyse performance, troubleshoot errors, understand service usage, and measure marketing where enabled and permitted. We do not use cookie consent as permission for unrelated processing; our Privacy Policy also applies to personal information collected through these technologies."
          },
          {
            number: 9,
            title: "Retention",
            content: "Cookie lifetimes vary. Session cookies generally expire when the browser session ends; persistent cookies remain until they expire or are deleted. The exact duration depends on the cookie’s purpose and provider. We will document the actual cookie names, purposes, providers and lifetimes in the cookie list or settings panel where practical."
          },
          {
            number: 10,
            title: "International Processing and Sharing",
            content: "Some service providers may process information in locations outside your state or country. Where this occurs, we will use appropriate contractual, security and other safeguards required by applicable law. Information may be shared with service providers who help operate, secure, analyse or support DhandaGrow, subject to applicable agreements and our Privacy Policy."
          },
          {
            number: 11,
            title: "Your Privacy Rights",
            content: "Depending on applicable law, you may have rights to request access, correction, deletion, restriction or other action regarding personal information. You may also withdraw consent for optional cookies through Cookie Settings. To make a privacy request, contact support@dhandagrow.com. We may need to verify your request before acting on it."
          },
          {
            number: 12,
            title: "Children",
            content: "DhandaGrow is not intended for children who are not permitted to use the service under applicable law. We do not knowingly use cookies to profile children in violation of applicable legal requirements. If you believe a child’s personal information has been collected improperly, contact us."
          },
          {
            number: 13,
            title: "Updates to This Policy",
            content: "We may update this Cookie Policy when our technology, practices or legal obligations change. We will update the effective date when a revised version is published. Where legally required, we will request consent again for material changes to optional cookie use."
          },
          {
            number: 14,
            title: "Contact Us",
            content: "For questions or requests relating to this Cookie Policy, contact:\nSevenunique Tech Solutions Private Limited\nDakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India\nEmail: support@dhandagrow.com\nPhone: +91-8741886688"
          },
          {
            number: 15,
            title: "Important Implementation Note",
            content: "Before publishing, audit the live website and list the exact cookies and similar technologies in use, including each name, provider, purpose, category and expiry. Configure a consent manager so that non-essential analytics or advertising tags do not fire before consent where required. Add a visible “Cookie Settings” control and ensure that rejecting optional cookies is as easy as accepting them. Remove any statements or categories that do not match the site’s actual setup."
          }
        ]
      }
    },
    {
      title: "DhandaGrow AI Cookie Policy",
      slug: "cookies-policy",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91 8741886688"
      },
      publicationNote: "This Cookie Policy explains how DhandaGrow AI uses cookies and similar technologies on https://dhandagrow.com and related web pages or services.",
      content: {
        introduction: "This Cookie Policy explains how DhandaGrow AI (“DhandaGrow”, “we”, “us” or “our”) uses cookies and similar technologies on https://dhandagrow.com and related web pages or services.",
        sections: [
          {
            number: 1,
            title: "What Are Cookies?",
            content: "Cookies are small text files that a website may store on your browser or device. Similar technologies include local storage, pixels, tags, SDKs and scripts that remember settings, measure website use or support features. This policy uses “cookies” as a general term for these technologies."
          },
          {
            number: 2,
            title: "Why We Use Cookies",
            content: "We may use cookies and similar technologies to:",
            items: [
              "Make the website and account sign-in work;",
              "Keep sessions secure, prevent fraud and protect accounts;",
              "Remember preferences such as language or interface settings;",
              "Understand website traffic, page performance and feature usage;",
              "Diagnose errors and improve reliability; and",
              "Measure marketing campaigns or show relevant advertising, but only where these tools are actually used and any required consent has been obtained."
            ]
          },
          {
            number: 3,
            title: "Categories of Cookies",
            items: [
              "Strictly necessary: Support core functions such as navigation, security, load balancing, session management and payment or checkout flows. These generally cannot be switched off through a preference tool if the requested service depends on them.",
              "Preferences / functional: Remember choices and settings to make the experience more convenient.",
              "Analytics / performance: Help us understand how visitors use the site, which pages perform well and where errors occur. We will configure these tools to respect applicable consent requirements.",
              "Advertising / measurement: If enabled, these may measure campaign effectiveness or help deliver ads. They may be set by us or by third-party providers and should be used only in accordance with applicable law and the consent choices presented to you."
            ]
          },
          {
            number: 4,
            title: "First-Party and Third-Party Technologies",
            content: "Some technologies may be set by DhandaGrow directly (first-party), while others may be provided by service providers such as hosting, security, analytics, customer-support, payment or advertising partners (third-party). Third parties may process information under their own policies and terms. We will identify material third-party technologies in our cookie-preference interface or cookie list where applicable.\n\nThis policy does not assert that any particular analytics, advertising or payment provider is currently active. The actual provider list should be verified against the website’s production configuration before publication."
          },
          {
            number: 5,
            title: "Cookie Choices and Consent",
            content: "When required, we will ask for consent before placing non-essential cookies or using similar technologies. You should be able to accept, reject or customise non-essential categories through the cookie banner or preference settings. Rejecting non-essential cookies should not disable features that do not depend on them.\n\nYou may change or withdraw your choice later using the website’s “Cookie Settings” link or equivalent control, if available. Withdrawing consent does not make prior processing unlawful, but it will affect future use of technologies covered by that choice."
          },
          {
            number: 6,
            title: "Browser and Device Controls",
            content: "Most browsers let you block, delete or limit cookies through their settings. The method varies by browser and device. Blocking all cookies may cause some website or account features to stop working. Browser-based “Do Not Track” signals are not interpreted consistently across services; we will respond to any legally recognised preference signal where required by applicable law."
          },
          {
            number: 7,
            title: "Information Collected Through Cookies",
            content: "Depending on the technology and your choices, cookie-related information may include an online identifier, device and browser details, IP address, approximate region, pages viewed, referral source, timestamps, session events, settings and interactions with website features. We aim to collect only information reasonably needed for the stated purpose and to avoid placing sensitive account, password or payment-card information in cookies."
          },
          {
            number: 8,
            title: "How We Use Cookie-Related Information",
            content: "We may use this information to provide requested website functionality, maintain security, remember preferences, analyse performance, troubleshoot errors, understand service usage, and measure marketing where enabled and permitted. We do not use cookie consent as permission for unrelated processing; our Privacy Policy also applies to personal information collected through these technologies."
          },
          {
            number: 9,
            title: "Retention",
            content: "Cookie lifetimes vary. Session cookies generally expire when the browser session ends; persistent cookies remain until they expire or are deleted. The exact duration depends on the cookie’s purpose and provider. We will document the actual cookie names, purposes, providers and lifetimes in the cookie list or settings panel where practical."
          },
          {
            number: 10,
            title: "International Processing and Sharing",
            content: "Some service providers may process information in locations outside your state or country. Where this occurs, we will use appropriate contractual, security and other safeguards required by applicable law. Information may be shared with service providers who help operate, secure, analyse or support DhandaGrow, subject to applicable agreements and our Privacy Policy."
          },
          {
            number: 11,
            title: "Your Privacy Rights",
            content: "Depending on applicable law, you may have rights to request access, correction, deletion, restriction or other action regarding personal information. You may also withdraw consent for optional cookies through Cookie Settings. To make a privacy request, contact support@dhandagrow.com. We may need to verify your request before acting on it."
          },
          {
            number: 12,
            title: "Children",
            content: "DhandaGrow is not intended for children who are not permitted to use the service under applicable law. We do not knowingly use cookies to profile children in violation of applicable legal requirements. If you believe a child’s personal information has been collected improperly, contact us."
          },
          {
            number: 13,
            title: "Updates to This Policy",
            content: "We may update this Cookie Policy when our technology, practices or legal obligations change. We will update the effective date when a revised version is published. Where legally required, we will request consent again for material changes to optional cookie use."
          },
          {
            number: 14,
            title: "Contact Us",
            content: "For questions or requests relating to this Cookie Policy, contact:\nSevenunique Tech Solutions Private Limited\nDakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India\nEmail: support@dhandagrow.com\nPhone: +91-8741886688"
          },
          {
            number: 15,
            title: "Important Implementation Note",
            content: "Before publishing, audit the live website and list the exact cookies and similar technologies in use, including each name, provider, purpose, category and expiry. Configure a consent manager so that non-essential analytics or advertising tags do not fire before consent where required. Add a visible “Cookie Settings” control and ensure that rejecting optional cookies is as easy as accepting them. Remove any statements or categories that do not match the site’s actual setup."
          }
        ]
      }
    },
    {
      title: "Refund Policy",
      slug: "refund-policy",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91-8741886688"
      },
      publicationNote: "Confirm your real refund stance before publishing: whether any first-time subscription refunds are allowed, whether credits are refundable, how free trials convert, how long support takes to respond, and how cancellation works. Display key terms clearly before payment and keep them consistent across pricing, checkout, and gateway configuration.",
      content: {
        introduction: "This Refund Policy explains how cancellation and refund requests are handled for subscriptions and paid services offered by DhandaGrow AI (\"DhandaGrow\", \"we\", \"us\" or \"our\") through https://dhandagrow.com. Please read this policy before purchasing a plan. The final published policy must match the actual product features, checkout disclosures, payment gateway rules and applicable law.",
        sections: [
          {
            number: 1,
            title: "Scope",
            content: "This policy applies to paid DhandaGrow AI plans, subscription renewals, add-ons, credits and other paid features purchased directly through our website, unless a separate written agreement or a third-party platform’s terms apply."
          },
          {
            number: 2,
            title: "Subscription Cancellation",
            content: "You may request cancellation through your account billing settings, if available, or by contacting support@dhandagrow.com from your registered email address. Include your account email, plan name and transaction reference; do not send your password or full card details.\n\nUnless the checkout page or applicable law states otherwise, cancellation stops future renewals and the plan remains available until the end of the current paid billing period. Cancellation does not automatically create a refund for an amount already paid."
          },
          {
            number: 3,
            title: "Refund Eligibility",
            content: "Because DhandaGrow AI provides access to digital services and may make features, usage limits or AI credits available immediately, payments are generally non-refundable once a paid billing period or digital service has started, except where a refund is required by applicable law or expressly stated at checkout.\n\nWe may review refund requests individually where, for example:",
            items: [
              "A payment was successfully charged more than once for the same purchase;",
              "Payment was taken but the relevant paid plan was not activated and we cannot resolve the issue within a reasonable time;",
              "A technical issue attributable to DhandaGrow materially prevented access to a paid service for a substantial period and we cannot provide a reasonable fix or alternative; or",
              "A refund is required by applicable consumer-protection law or another binding obligation."
            ]
          },
          {
            number: 4,
            title: "Cases Generally Not Eligible for Refund",
            content: "Subject to applicable law and the exceptions above, refunds are generally not available for:",
            items: [
              "Partial or unused time in a billing period after cancellation;",
              "A change of mind or a failure to use the service after purchase;",
              "AI outputs, generated images, text, videos or other results that do not meet subjective expectations, where the service operated substantially as described;",
              "Credits or usage already consumed, or features already delivered;",
              "Issues caused by unsupported devices, incorrect settings, poor connectivity, third-party outages or a failure to follow published instructions; or",
              "A renewal where the renewal terms and amount were disclosed before purchase and cancellation was not completed before the renewal date."
            ]
          },
          {
            number: 5,
            title: "Duplicate, Failed or Pending Payments",
            content: "If your bank or payment provider shows a debit but DhandaGrow does not confirm the order, the transaction may be pending or may be reversed automatically by the payment provider. Contact us with the transaction reference if the status does not resolve. We will check our records and coordinate with the payment gateway where appropriate.\n\nIf the same purchase was charged more than once and the duplicate charge is confirmed, we will arrange a refund for the duplicate amount."
          },
          {
            number: 6,
            title: "Automatic Renewals",
            content: "For recurring subscriptions, the checkout page should clearly disclose the billing frequency, amount, renewal terms and how to cancel. You are responsible for cancelling before the next renewal date if you do not wish to be charged again. If a renewal charge occurs after a valid cancellation was recorded, contact support so we can investigate.\n\nAny legally required reminders, authorisations or cancellation rights will be followed."
          },
          {
            number: 7,
            title: "How to Request a Refund",
            content: "Email support@dhandagrow.com with the subject line “Refund Request” and include the following details (Never email your password, CVV, PIN, OTP or full payment-card number. We may request reasonable information to verify the purchase and prevent fraud):",
            items: [
              "Your registered account email;",
              "Plan or product purchased;",
              "Date and amount of payment;",
              "Payment gateway / order / transaction reference; and",
              "A short explanation of the issue."
            ]
          },
          {
            number: 8,
            title: "Review and Response Time",
            content: "We aim to acknowledge refund requests within 3 business days and provide an initial decision or status update within 7–10 business days. Complex cases, payment-provider investigations or requests requiring additional information may take longer. These are target service times, not a waiver of any mandatory statutory deadlines."
          },
          {
            number: 9,
            title: "Refund Method and Processing Time",
            content: "Approved refunds will generally be sent to the original payment method where supported by the payment provider. After we initiate a refund, the time for funds to appear depends on the bank, card issuer, UPI provider or payment gateway. We will share a reference or status when available.\n\nWe cannot guarantee a particular settlement date controlled by a bank or payment provider."
          },
          {
            number: 10,
            title: "Promotional Offers, Trials and Discounts",
            content: "Promotional pricing, free trials and discounted plans may have special conditions displayed at the time of offer. If a trial converts to a paid subscription, the price, billing date and cancellation method should be disclosed before the conversion. Any offer-specific terms will apply only to the extent they are consistent with applicable law."
          },
          {
            number: 11,
            title: "Third-Party Purchases",
            content: "If you purchased through an app store, reseller or another third-party platform, the refund request may need to be submitted to that platform under its refund process. We will provide reasonable guidance where possible."
          },
          {
            number: 12,
            title: "Service Changes or Discontinuation",
            content: "If we discontinue a paid service or materially restrict access to a service you have already paid for, we may provide an alternative, account credit or a proportionate refund, as appropriate and as required by applicable law or the circumstances."
          },
          {
            number: 13,
            title: "Chargebacks and Payment Disputes",
            content: "If you believe a charge is incorrect, please contact support@dhandagrow.com so we can investigate. You retain any dispute rights available through your bank, card issuer, UPI provider or applicable law. We may provide transaction and service records to the payment provider to respond to a disputed payment, consistent with law and our Privacy Policy."
          },
          {
            number: 14,
            title: "Changes to This Policy",
            content: "We may update this policy from time to time. The updated version will be published on our website with a revised effective date. Changes will not remove rights that have already accrued or rights that cannot legally be excluded."
          },
          {
            number: 15,
            title: "Contact Us",
            content: "For cancellation and refund requests, contact:\nSevenunique Tech Solutions Private Limited\nDakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India\nEmail: support@dhandagrow.com\nPhone: +91-8741886688"
          },
          {
            number: 16,
            title: "Important Before Publication",
            content: "Confirm your real refund stance before publishing: whether any first-time subscription refunds are allowed, whether credits are refundable, how free trials convert, how long support takes to respond, and how cancellation works. Display the key terms clearly before payment and keep them consistent across the pricing page, checkout, Terms & Conditions and payment gateway configuration. Have the final policy reviewed for applicable Indian consumer-protection and e-commerce requirements."
          }
        ]
      }
    },
    {
      title: "Cancellation & Refund Policy",
      slug: "cancellation-and-refund-policy",
      lastUpdated: "12 October 2026",
      website: "https://dhandagrow.com",
      poweredBy: "Sevenunique Tech Solutions Private Limited",
      company: {
        name: "Sevenunique Tech Solutions Private Limited",
        address: "Dakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India",
        email: "support@dhandagrow.com",
        mobile: "+91-8741886688"
      },
      publicationNote: "Confirm your real refund stance before publishing: whether any first-time subscription refunds are allowed, whether credits are refundable, how free trials convert, how long support takes to respond, and how cancellation works.",
      content: {
        introduction: "This Refund Policy explains how cancellation and refund requests are handled for subscriptions and paid services offered by DhandaGrow AI (\"DhandaGrow\", \"we\", \"us\" or \"our\") through https://dhandagrow.com. Please read this policy before purchasing a plan.",
        sections: [
          {
            number: 1,
            title: "Scope",
            content: "This policy applies to paid DhandaGrow AI plans, subscription renewals, add-ons, credits and other paid features purchased directly through our website, unless a separate written agreement or a third-party platform’s terms apply."
          },
          {
            number: 2,
            title: "Subscription Cancellation",
            content: "You may request cancellation through your account billing settings, if available, or by contacting support@dhandagrow.com from your registered email address. Include your account email, plan name and transaction reference; do not send your password or full card details.\n\nUnless the checkout page or applicable law states otherwise, cancellation stops future renewals and the plan remains available until the end of the current paid billing period. Cancellation does not automatically create a refund for an amount already paid."
          },
          {
            number: 3,
            title: "Refund Eligibility",
            content: "Because DhandaGrow AI provides access to digital services and may make features, usage limits or AI credits available immediately, payments are generally non-refundable once a paid billing period or digital service has started, except where a refund is required by applicable law or expressly stated at checkout.",
            items: [
              "A payment was successfully charged more than once for the same purchase;",
              "Payment was taken but the relevant paid plan was not activated and we cannot resolve the issue within a reasonable time;",
              "A technical issue attributable to DhandaGrow materially prevented access to a paid service for a substantial period and we cannot provide a reasonable fix or alternative; or",
              "A refund is required by applicable consumer-protection law or another binding obligation."
            ]
          },
          {
            number: 4,
            title: "Cases Generally Not Eligible for Refund",
            content: "Subject to applicable law and the exceptions above, refunds are generally not available for:",
            items: [
              "Partial or unused time in a billing period after cancellation;",
              "A change of mind or a failure to use the service after purchase;",
              "AI outputs, generated images, text, videos or other results that do not meet subjective expectations, where the service operated substantially as described;",
              "Credits or usage already consumed, or features already delivered;",
              "Issues caused by unsupported devices, incorrect settings, poor connectivity, third-party outages or a failure to follow published instructions; or",
              "A renewal where the renewal terms and amount were disclosed before purchase and cancellation was not completed before the renewal date."
            ]
          },
          {
            number: 5,
            title: "Duplicate, Failed or Pending Payments",
            content: "If your bank or payment provider shows a debit but DhandaGrow does not confirm the order, the transaction may be pending or may be reversed automatically by the payment provider. Contact us with the transaction reference if the status does not resolve. We will check our records and coordinate with the payment gateway where appropriate.\n\nIf the same purchase was charged more than once and the duplicate charge is confirmed, we will arrange a refund for the duplicate amount."
          },
          {
            number: 6,
            title: "Automatic Renewals",
            content: "For recurring subscriptions, the checkout page should clearly disclose the billing frequency, amount, renewal terms and how to cancel. You are responsible for cancelling before the next renewal date if you do not wish to be charged again. If a renewal charge occurs after a valid cancellation was recorded, contact support so we can investigate.\n\nAny legally required reminders, authorisations or cancellation rights will be followed."
          },
          {
            number: 7,
            title: "How to Request a Refund",
            content: "Email support@dhandagrow.com with the subject line “Refund Request” and include the following details:",
            items: [
              "Your registered account email;",
              "Plan or product purchased;",
              "Date and amount of payment;",
              "Payment gateway / order / transaction reference; and",
              "A short explanation of the issue."
            ]
          },
          {
            number: 8,
            title: "Review and Response Time",
            content: "We aim to acknowledge refund requests within 3 business days and provide an initial decision or status update within 7–10 business days. Complex cases, payment-provider investigations or requests requiring additional information may take longer."
          },
          {
            number: 9,
            title: "Refund Method and Processing Time",
            content: "Approved refunds will generally be sent to the original payment method where supported by the payment provider. After we initiate a refund, the time for funds to appear depends on the bank, card issuer, UPI provider or payment gateway."
          },
          {
            number: 10,
            title: "Promotional Offers, Trials and Discounts",
            content: "Promotional pricing, free trials and discounted plans may have special conditions displayed at the time of offer. If a trial converts to a paid subscription, the price, billing date and cancellation method should be disclosed before the conversion."
          },
          {
            number: 11,
            title: "Third-Party Purchases",
            content: "If you purchased through an app store, reseller or another third-party platform, the refund request may need to be submitted to that platform under its refund process."
          },
          {
            number: 12,
            title: "Service Changes or Discontinuation",
            content: "If we discontinue a paid service or materially restrict access to a service you have already paid for, we may provide an alternative, account credit or a proportionate refund, as appropriate."
          },
          {
            number: 13,
            title: "Chargebacks and Payment Disputes",
            content: "If you believe a charge is incorrect, please contact support@dhandagrow.com so we can investigate. You retain any dispute rights available through your bank, card issuer, UPI provider or applicable law."
          },
          {
            number: 14,
            title: "Changes to This Policy",
            content: "We may update this policy from time to time. The updated version will be published on our website with a revised effective date."
          },
          {
            number: 15,
            title: "Contact Us",
            content: "For cancellation and refund requests, contact:\nSevenunique Tech Solutions Private Limited\nDakshinpuri - I Shrikishan, Sanganer, Jagatpura, Jaipur, Rajasthan 302017, India\nEmail: support@dhandagrow.com\nPhone: +91-8741886688"
          },
          {
            number: 16,
            title: "Important Before Publication",
            content: "Confirm your real refund stance before publishing: whether any first-time subscription refunds are allowed, whether credits are refundable, how free trials convert, how long support takes to respond, and how cancellation works. Display the key terms clearly before payment and keep them consistent across the pricing page, checkout, Terms & Conditions and payment gateway configuration."
          }
        ]
      }
    }
  ]
};
