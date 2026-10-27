"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = 
  | "en"
  | "hinglish"
  | "hi"
  | "mr"
  | "gu"
  | "pa"
  | "bn"
  | "ta"
  | "te"
  | "kn"
  | "ml";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  shortName: string;
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", shortName: "English", englishName: "English" },
  { code: "hinglish", name: "Hinglish (हिंग्लिश)", shortName: "Hinglish", englishName: "Hinglish" },
  { code: "hi", name: "हिन्दी (Hindi)", shortName: "हिन्दी", englishName: "Hindi" },
  { code: "mr", name: "मराठी (Marathi)", shortName: "मराठी", englishName: "Marathi" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", shortName: "ગુજરાતી", englishName: "Gujarati" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", shortName: "ਪੰਜਾਬੀ", englishName: "Punjabi" },
  { code: "bn", name: "বাংলা (Bengali)", shortName: "বাংলা", englishName: "Bengali" },
  { code: "ta", name: "தமிழ் (Tamil)", shortName: "தமிழ்", englishName: "Tamil" },
  { code: "te", name: "తెలుగు (Telugu)", shortName: "తెలుగు", englishName: "Telugu" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", shortName: "ಕನ್ನಡ", englishName: "Kannada" },
  { code: "ml", name: "മലയാളം (Malayalam)", shortName: "മലയാളം", englishName: "Malayalam" },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    "lang_prefix": "Language:",
    "theme_light": "Switch to Light Mode",
    "theme_dark": "Switch to Dark Mode",

    // Banner
    "banner_badge": "Get the app • DhandaGrow AI",
    "banner_badge_new": "New Account • DhandaGrow AI",
    "banner_title": "Turn viewers into buyers",
    "banner_desc": "Put your business in front of thousands. Create viral reels, studio photoshoots, and ads that get noticed across every feed, and turn them into paying customers.",

    // Login Screen
    "welcome_title": "Welcome to DhandaGrow",
    "phone_label": "ENTER YOUR PHONE NUMBER",
    "phone_placeholder": "7857889083",
    "send_otp": "Send OTP",
    "sending_otp": "Sending OTP...",
    "or_divider": "OR",
    "google_login_title": "Sign in with Google",
    "whatsapp_login_title": "Continue with WhatsApp",
    "no_account": "Don't have an account?",
    "signup_link": "Sign up",

    // Signup Screen Specifics
    "signup_welcome_title": "Welcome to DhandaGrow",
    "signup_welcome_desc": "Create your account to start growing your business",
    "phone_verified_title": "Phone Verified!",
    "phone_verified_desc": "Complete your registration with Google to secure your account.",
    "continue_google_signup": "Continue with Google",
    "go_to_login": "Go to Login",
    "already_account": "Already have an account?",

    // OTP Screen
    "enter_otp_title": "Enter your OTP",
    "otp_sent_to": "OTP sent to",
    "change_mobile_number": "change mobile number",
    "verify_otp": "Verify OTP",
    "verifying_otp": "Verifying OTP...",
    "didnt_receive_otp": "Didn't receive the OTP?",
    "resend_in": "Resend in",
    "resend_code": "Resend Code",
    "sending": "Sending...",
    "try_other_method": "Try other method:",
    "send_via_sms": "Send via SMS",
    "send_via_whatsapp": "Send via WhatsApp",
    "right_number_alert_part1": "Sent the OTP to",
    "right_number_alert_part2": ". Is that the right number?",
    "keep_waiting": "Keep waiting",
    "change_number": "Change number",

    // Validation & Errors
    "valid_phone_error": "Please enter a valid mobile number.",
    "otp_length_error": "Please enter the complete 6-digit OTP.",

    // Footer Links
    "terms": "Terms",
    "privacy": "Privacy",
    "need_help": "Need help?",
    "version": "v1.9.7"
  },

  hinglish: {
    "lang_prefix": "Language:",
    "theme_light": "Light Mode karein",
    "theme_dark": "Dark Mode karein",

    // Banner
    "banner_badge": "App download karein • DhandaGrow AI",
    "banner_badge_new": "Naya Account • DhandaGrow AI",
    "banner_title": "Viewers ko customers banayein",
    "banner_desc": "Apne dhandhe ko hazaron logon tak pahuchayein. Viral reels, studio photoshoots aur ads banayein jo feed par chha jayein aur customers laayein.",

    // Login Screen
    "welcome_title": "DhandaGrow me Welcome",
    "phone_label": "APNA MOBILE NUMBER DAALEIN",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP Bhejein",
    "sending_otp": "OTP bhej rahe hain...",
    "or_divider": "YA",
    "google_login_title": "Google ke saath login karein",
    "whatsapp_login_title": "WhatsApp se aage badhein",
    "no_account": "Account nahi hai?",
    "signup_link": "Sign up karein",

    // Signup Screen Specifics
    "signup_welcome_title": "DhandaGrow me Welcome",
    "signup_welcome_desc": "Apna dhandha grow karne ke liye account banayein",
    "phone_verified_title": "Phone Number Verify Ho Gaya!",
    "phone_verified_desc": "Apna account secure karne ke liye Google se registration poora karein.",
    "continue_google_signup": "Google se aage badhein",
    "go_to_login": "Login par jayein",
    "already_account": "Pehle se account hai?",

    // OTP Screen
    "enter_otp_title": "Apna OTP Daalein",
    "otp_sent_to": "OTP bheja gaya hai",
    "change_mobile_number": "number badlein",
    "verify_otp": "OTP Verify Karein",
    "verifying_otp": "Verify ho raha hai...",
    "didnt_receive_otp": "OTP nahi mila?",
    "resend_in": "Dobara bhejein",
    "resend_code": "OTP Dobara Bhejein",
    "sending": "Bhej rahe hain...",
    "try_other_method": "Dusra tareeka dekhein:",
    "send_via_sms": "SMS se bhejein",
    "send_via_whatsapp": "WhatsApp se bhejein",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "par bheja hai. Kya number sahi hai?",
    "keep_waiting": "Rukein",
    "change_number": "Number badlein",

    // Validation & Errors
    "valid_phone_error": "Kripya sahi mobile number daalein.",
    "otp_length_error": "Kripya poora 6-digit OTP daalein.",

    // Footer Links
    "terms": "Niyam",
    "privacy": "Privacy",
    "need_help": "Madad chahiye?",
    "version": "v1.9.7"
  },

  hi: {
    "lang_prefix": "भाषा:",
    "theme_light": "लाइट मोड चुनें",
    "theme_dark": "डार्क मोड चुनें",

    // Banner
    "banner_badge": "ऐप प्राप्त करें • धंधाग्रो एआई",
    "banner_badge_new": "नया खाता • धंधाग्रो एआई",
    "banner_title": "दर्शकों को पक्के ग्राहकों में बदलें",
    "banner_desc": "अपने व्यापार को हजारों लोगों तक पहुँचाएं। वायरल रील्स, स्टूडियो फोटोशूट और आकर्षक विज्ञापन बनाकर ग्राहकों की संख्या बढ़ाएं।",

    // Login Screen
    "welcome_title": "धंधाग्रो में आपका स्वागत है",
    "phone_label": "अपना मोबाइल नंबर दर्ज करें",
    "phone_placeholder": "7857889083",
    "send_otp": "ओटीपी भेजें",
    "sending_otp": "ओटीपी भेजा जा रहा है...",
    "or_divider": "या",
    "google_login_title": "Google के साथ साइन इन करें",
    "whatsapp_login_title": "WhatsApp से जारी रखें",
    "no_account": "खाता नहीं है?",
    "signup_link": "साइन अप करें",

    // Signup Screen Specifics
    "signup_welcome_title": "धंधाग्रो में आपका स्वागत है",
    "signup_welcome_desc": "व्यापार बढ़ाने के लिए नया खाता बनाएं",
    "phone_verified_title": "फोन नंबर सत्यापित हुआ!",
    "phone_verified_desc": "सुरक्षित पंजीकरण पूरा करने के लिए Google से आगे बढ़ें।",
    "continue_google_signup": "Google के साथ जारी रखें",
    "go_to_login": "लॉग इन करें",
    "already_account": "क्या पहले से खाता है?",

    // OTP Screen
    "enter_otp_title": "अपना ओटीपी दर्ज करें",
    "otp_sent_to": "ओटीपी भेजा गया:",
    "change_mobile_number": "मोबाइल नंबर बदलें",
    "verify_otp": "ओटीपी सत्यापित करें",
    "verifying_otp": "सत्यापन हो रहा है...",
    "didnt_receive_otp": "ओटीपी नहीं मिला?",
    "resend_in": "पुनः भेजें",
    "resend_code": "ओटीपी दोबारा भेजें",
    "sending": "भेजा जा रहा है...",
    "try_other_method": "अन्य तरीका चुनें:",
    "send_via_sms": "SMS द्वारा भेजें",
    "send_via_whatsapp": "WhatsApp द्वारा भेजें",
    "right_number_alert_part1": "ओटीपी",
    "right_number_alert_part2": "पर भेजा गया। क्या यह सही नंबर है?",
    "keep_waiting": "प्रतीक्षा करें",
    "change_number": "नंबर बदलें",

    // Validation & Errors
    "valid_phone_error": "कृपया एक मान्य मोबाइल नंबर दर्ज करें।",
    "otp_length_error": "कृपया 6 अंकों का पूरा ओटीपी दर्ज करें।",

    // Footer Links
    "terms": "नियम व शर्तें",
    "privacy": "गोपनीयता नीति",
    "need_help": "मदद चाहिए?",
    "version": "v1.9.7"
  },

  mr: {
    "lang_prefix": "भाषा:",
    "theme_light": "लाइट मोड",
    "theme_dark": "डार्क मोड",

    // Banner
    "banner_badge": "ॲप मिळवा • धंदाग्रो AI",
    "banner_badge_new": "नवीन खाते • धंदाग्रो AI",
    "banner_title": "प्रेक्षकांना खरेदीदारांमध्ये बदला",
    "banner_desc": "आपला व्यवसाय हजारो लोकांपर्यंत पोहोचवा. व्हायरल रील्स, स्टुडिओ फोटोशूट्स आणि जाहिराती तयार करून थेट विक्री वाढवा.",

    // Login Screen
    "welcome_title": "धंदाग्रो मध्ये आपले स्वागत आहे",
    "phone_label": "आपला मोबाईल नंबर टाका",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP पाठवा",
    "sending_otp": "OTP पाठवत आहे...",
    "or_divider": "किंवा",
    "google_login_title": "Google सह साइन इन करा",
    "whatsapp_login_title": "WhatsApp द्वारे सुरू ठेवा",
    "no_account": "खाते नाही का?",
    "signup_link": "साइन अप करा",

    // Signup Screen Specifics
    "signup_welcome_title": "धंदाग्रो मध्ये आपले स्वागत आहे",
    "signup_welcome_desc": "व्यवसाय वाढवण्यासाठी नवीन खाते तयार करा",
    "phone_verified_title": "फोन पडताळणी यशस्वी!",
    "phone_verified_desc": "खाते सुरक्षित करण्यासाठी Google सह नोंदणी पूर्ण करा.",
    "continue_google_signup": "Google सह सुरू ठेवा",
    "go_to_login": "लॉग इन करा",
    "already_account": "आधीच खाते आहे का?",

    // OTP Screen
    "enter_otp_title": "आपला OTP प्रविष्ट करा",
    "otp_sent_to": "OTP पाठवला आहे:",
    "change_mobile_number": "मोबाईल नंबर बदला",
    "verify_otp": "OTP पडताळा",
    "verifying_otp": "पडताळणी सुरू आहे...",
    "didnt_receive_otp": "OTP मिळाला नाही?",
    "resend_in": "पुन्हा पाठवा",
    "resend_code": "OTP पुन्हा पाठवा",
    "sending": "पाठवत आहे...",
    "try_other_method": "दुसरा मार्ग निवडा:",
    "send_via_sms": "SMS द्वारे पाठवा",
    "send_via_whatsapp": "WhatsApp द्वारे पाठवा",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "वर पाठवला आहे. हा नंबर बरोबर आहे का?",
    "keep_waiting": "प्रतीक्षा करा",
    "change_number": "नंबर बदला",

    // Validation & Errors
    "valid_phone_error": "कृपया वैध मोबाईल नंबर प्रविष्ट करा.",
    "otp_length_error": "कृपया पूर्ण ६ अंकी OTP टाका.",

    // Footer Links
    "terms": "अटी",
    "privacy": "गोपनीयता",
    "need_help": "मदत हवी आहे?",
    "version": "v1.9.7"
  },

  gu: {
    "lang_prefix": "ભાષા:",
    "theme_light": "લાઇટ મોડ",
    "theme_dark": "ડાર્ક મોડ",

    // Banner
    "banner_badge": "એપ ડાઉનલોડ કરો • ધંધાગ્રો AI",
    "banner_badge_new": "નવું એકાઉન્ટ • ધંધાગ્રો AI",
    "banner_title": "દર્શકોને ખરીદદારોમાં રૂપાંતરિત કરો",
    "banner_desc": "તમારા ધંધાને હજારો લોકો સુધી પહોંચાડો. વાયરલ રીલ્સ, સ્ટુડિયો ફોટોશૂટ અને જાહેરાતો બનાવી ગ્રાહકો ઝડપથી વધારો.",

    // Login Screen
    "welcome_title": "ધંધાગ્રો માં આપનું સ્વાગત છે",
    "phone_label": "તમારો મોબાઈલ નંબર દાખલ કરો",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP મોકલો",
    "sending_otp": "OTP મોકલાઈ રહ્યો છે...",
    "or_divider": "અથવા",
    "google_login_title": "Google સાથે સાઇન ઇન કરો",
    "whatsapp_login_title": "WhatsApp સાથે આગળ વધો",
    "no_account": "ખાતું નથી?",
    "signup_link": "સાઇન અપ કરો",

    // Signup Screen Specifics
    "signup_welcome_title": "ધંધાગ્રો માં આપનું સ્વાગત છે",
    "signup_welcome_desc": "વેપાર વધારવા માટે નવું એકાઉન્ટ બનાવો",
    "phone_verified_title": "ફોન નંબર ચકાસાઈ ગયો!",
    "phone_verified_desc": "સુરક્ષિત ખાતા માટે Google સાથે સાઇન અપ પૂર્ણ કરો.",
    "continue_google_signup": "Google સાથે આગળ વધો",
    "go_to_login": "લૉગ ઇન કરો",
    "already_account": "પહેલેથી એકાઉન્ટ છે?",

    // OTP Screen
    "enter_otp_title": "તમારો OTP દાખલ કરો",
    "otp_sent_to": "OTP મોકલવામાં આવ્યો:",
    "change_mobile_number": "મોબાઇલ નંબર બદલો",
    "verify_otp": "OTP ચકાસો",
    "verifying_otp": "ચકાસણી ચાલુ છે...",
    "didnt_receive_otp": "OTP મળ્યો નથી?",
    "resend_in": "ફરી મોકલો",
    "resend_code": "OTP ફરીથી મોકલો",
    "sending": "મોકલી રહ્યું છે...",
    "try_other_method": "અન્ય રીત પસંદ કરો:",
    "send_via_sms": "SMS દ્વારા મોકલો",
    "send_via_whatsapp": "WhatsApp દ્વારા મોકલો",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "પર મોકલ્યો. શું આ સાચો નંબર છે?",
    "keep_waiting": "રાહ જુઓ",
    "change_number": "નંબર બદલો",

    // Validation & Errors
    "valid_phone_error": "કૃપા કરીને માન્ય મોબાઇલ નંબર દાખલ કરો.",
    "otp_length_error": "કૃપા કરીને પૂરો 6 અંકનો OTP દાખલ કરો.",

    // Footer Links
    "terms": "શરતો",
    "privacy": "ગોપનીયતા",
    "need_help": "મદદ જોઈએ છે?",
    "version": "v1.9.7"
  },

  pa: {
    "lang_prefix": "ਭਾਸ਼ਾ:",
    "theme_light": "ਲਾਈਟ ਮੋਡ",
    "theme_dark": "ਡਾਰਕ ਮੋਡ",

    // Banner
    "banner_badge": "ਐਪ ਲਵੋ • ਧੰਧਾਗ੍ਰੋ AI",
    "banner_badge_new": "ਨਵਾਂ ਖਾਤਾ • ਧੰਧਾਗ੍ਰੋ AI",
    "banner_title": "ਦਰਸ਼ਕਾਂ ਨੂੰ ਗਾਹਕਾਂ ਵਿੱਚ ਬਦਲੋ",
    "banner_desc": "ਆਪਣੇ ਕਾਰੋਬਾਰ ਨੂੰ ਹਜ਼ਾਰਾਂ ਲੋਕਾਂ ਤੱਕ ਪਹੁੰਚਾਓ। ਵਾਇਰਲ ਰੀਲਾਂ, ਸਟੂਡੀਓ ਫੋਟੋਸ਼ੂਟ ਅਤੇ ਇਸ਼ਤਿਹਾਰ ਬਣਾ ਕੇ ਵਿਕਰੀ ਵਧਾਓ।",

    // Login Screen
    "welcome_title": "ਧੰਧਾਗ੍ਰੋ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    "phone_label": "ਆਪਣਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP ਭੇਜੋ",
    "sending_otp": "OTP ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    "or_divider": "ਜਾਂ",
    "google_login_title": "Google ਨਾਲ ਸਾਈਨ ਇਨ ਕਰੋ",
    "whatsapp_login_title": "WhatsApp ਰਾਹੀਂ ਜਾਰੀ ਰੱਖੋ",
    "no_account": "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    "signup_link": "ਸਾਈਨ ਅੱਪ ਕਰੋ",

    // Signup Screen Specifics
    "signup_welcome_title": "ਧੰਧਾਗ੍ਰੋ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    "signup_welcome_desc": "ਕਾਰੋਬਾਰ ਵਧਾਉਣ ਲਈ ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ",
    "phone_verified_title": "ਫੋਨ ਨੰਬਰ ਤਸਦੀਕ ਹੋ ਗਿਆ!",
    "phone_verified_desc": "ਖਾਤਾ ਸੁਰੱਖਿਅਤ ਕਰਨ ਲਈ Google ਨਾਲ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪੂਰੀ ਕਰੋ।",
    "continue_google_signup": "Google ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    "go_to_login": "ਲਾਗਇਨ ਕਰੋ",
    "already_account": "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",

    // OTP Screen
    "enter_otp_title": "ਆਪਣਾ OTP ਦਰਜ ਕਰੋ",
    "otp_sent_to": "OTP ਭੇਜਿਆ ਗਿਆ:",
    "change_mobile_number": "ਮੋਬਾਈਲ ਨੰਬਰ ਬਦਲੋ",
    "verify_otp": "OTP ਤਸਦੀਕ ਕਰੋ",
    "verifying_otp": "ਤਸਦੀਕ ਹੋ ਰਿਹਾ ਹੈ...",
    "didnt_receive_otp": "OTP ਨਹੀਂ ਮਿਲਿਆ?",
    "resend_in": "ਮੁੜ ਭੇਜੋ",
    "resend_code": "OTP ਮੁੜ ਭੇਜੋ",
    "sending": "ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    "try_other_method": "ਦੂਜਾ ਤਰੀਕਾ ਅਜ਼ਮਾਓ:",
    "send_via_sms": "SMS ਰਾਹੀਂ ਭੇਜੋ",
    "send_via_whatsapp": "WhatsApp ਰਾਹੀਂ ਭੇਜੋ",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "ਤੇ ਭੇਜਿਆ ਗਿਆ। ਕੀ ਇਹ ਸਹੀ ਨੰਬਰ ਹੈ?",
    "keep_waiting": "ਉਡੀਕ ਕਰੋ",
    "change_number": "ਨੰਬਰ ਬਦਲੋ",

    // Validation & Errors
    "valid_phone_error": "ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ।",
    "otp_length_error": "ਕਿਰਪਾ ਕਰਕੇ ਪੂਰਾ 6 ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ।",

    // Footer Links
    "terms": "ਸ਼ਰਤਾਂ",
    "privacy": "ਪਰਦੇਦਾਰੀ",
    "need_help": "ਮਦਦ ਚਾਹੀਦੀ ਹੈ?",
    "version": "v1.9.7"
  },

  bn: {
    "lang_prefix": "ভাষা:",
    "theme_light": "লাইট মোড",
    "theme_dark": "ডার্ক মোড",

    // Banner
    "banner_badge": "অ্যাপ পান • ধন্ধাগ্রো AI",
    "banner_badge_new": "নতুন অ্যাকাউন্ট • ধন্ধাগ্রো AI",
    "banner_title": "দর্শকদের ক্রেতায় রূপান্তর করুন",
    "banner_desc": "আপনার ব্যবসাকে হাজার হাজার মানুষের কাছে পৌঁছে দিন। ভাইরাল রিল ও বিজ্ঞাপন তৈরি করে বিক্রি বাড়ান।",

    // Login Screen
    "welcome_title": "ধন্ধাগ্রো-তে আপনাকে স্বাগতম",
    "phone_label": "আপনার মোবাইল নম্বর লিখুন",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP পাঠান",
    "sending_otp": "OTP পাঠানো হচ্ছে...",
    "or_divider": "অথবা",
    "google_login_title": "Google দিয়ে সাইন ইন করুন",
    "whatsapp_login_title": "WhatsApp দিয়ে এগিয়ে যান",
    "no_account": "অ্যাকাউন্ট নেই?",
    "signup_link": "সাইন আপ করুন",

    // Signup Screen Specifics
    "signup_welcome_title": "ধন্ধাগ্রো-তে আপনাকে স্বাগতম",
    "signup_welcome_desc": "ব্যবসার বৃদ্ধির জন্য নতুন অ্যাকাউন্ট তৈরি করুন",
    "phone_verified_title": "ফোন নম্বর যাচাই সফল!",
    "phone_verified_desc": "অ্যাকাউন্ট সুরক্ষিত করতে Google দিয়ে সাইন আপ সম্পূর্ণ করুন।",
    "continue_google_signup": "Google দিয়ে এগিয়ে যান",
    "go_to_login": "লগ ইন করুন",
    "already_account": "ইতিমধ্যে অ্যাকাউন্ট আছে?",

    // OTP Screen
    "enter_otp_title": "আপনার OTP লিখুন",
    "otp_sent_to": "OTP পাঠানো হয়েছে:",
    "change_mobile_number": "নম্বর পরিবর্তন করুন",
    "verify_otp": "OTP যাচাই করুন",
    "verifying_otp": "যাচাই করা হচ্ছে...",
    "didnt_receive_otp": "OTP পাননি?",
    "resend_in": "পুনরায় পাঠান",
    "resend_code": "OTP পুনরায় পাঠান",
    "sending": "পাঠানো হচ্ছে...",
    "try_other_method": "অন্য মাধ্যম বেছে নিন:",
    "send_via_sms": "SMS দ্বারা পাঠান",
    "send_via_whatsapp": "WhatsApp দ্বারা পাঠান",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "-এ পাঠানো হয়েছে। নম্বরটি কি সঠিক?",
    "keep_waiting": "অপেক্ষা করুন",
    "change_number": "নম্বর বদলান",

    // Validation & Errors
    "valid_phone_error": "অনুগ্রহ করে একটি সঠিক মোবাইল নম্বর লিখুন।",
    "otp_length_error": "অনুগ্রহ করে সম্পূর্ণ ৬ অঙ্কের OTP দিন।",

    // Footer Links
    "terms": "শর্তাবলী",
    "privacy": "গোপনীয়তা",
    "need_help": "সাহায্য প্রয়োজন?",
    "version": "v1.9.7"
  },

  ta: {
    "lang_prefix": "மொழி:",
    "theme_light": "லைட் பயன்முறை",
    "theme_dark": "டார்க் பயன்முறை",

    // Banner
    "banner_badge": "செயலியைப் பெறவும் • DhandaGrow AI",
    "banner_badge_new": "புதிய கணக்கு • DhandaGrow AI",
    "banner_title": "பார்வையாளர்களை வாடிக்கையாளர்களாக்குங்கள்",
    "banner_desc": "உங்கள் வணிகத்தை ஆயிரக்கணக்கான வாடிக்கையாளர்களிடம் கொண்டு சேர்க்கவும். வைரல் ரீல்ஸ் மற்றும் விளம்பரங்களை உருவாக்கவும்.",

    // Login Screen
    "welcome_title": "DhandaGrow-விற்கு நல்வரவு",
    "phone_label": "உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP அனுப்பவும்",
    "sending_otp": "OTP அனுப்பப்படுகிறது...",
    "or_divider": "அல்லது",
    "google_login_title": "Google மூலம் உள்நுழைக",
    "whatsapp_login_title": "WhatsApp மூலம் தொடரவும்",
    "no_account": "கணக்கு இல்லையா?",
    "signup_link": "பதிவு செய்க",

    // Signup Screen Specifics
    "signup_welcome_title": "DhandaGrow-விற்கு நல்வரவு",
    "signup_welcome_desc": "உங்கள் வணிகத்தை வளர்க்க புதிய கணக்கை உருவாக்கவும்",
    "phone_verified_title": "தொலைபேசி எண் சரிபார்க்கப்பட்டது!",
    "phone_verified_desc": "Google மூலம் பதிவை நிறைவுசெய்க.",
    "continue_google_signup": "Google உடன் தொடரவும்",
    "go_to_login": "உள்நுழைக",
    "already_account": "ஏற்கனவே கணக்கு உள்ளதா?",

    // OTP Screen
    "enter_otp_title": "OTP-ஐ உள்ளிடவும்",
    "otp_sent_to": "OTP அனுப்பப்பட்ட எண்:",
    "change_mobile_number": "எண்ணை மாற்றவும்",
    "verify_otp": "OTP சரிபார்க்கவும்",
    "verifying_otp": "சரிபார்க்கப்படுகிறது...",
    "didnt_receive_otp": "OTP வரவில்லையா?",
    "resend_in": "மறுஅனுப்பல்",
    "resend_code": "OTP மீண்டும் அனுப்பவும்",
    "sending": "அனுப்பப்படுகிறது...",
    "try_other_method": "மாற்று முறை:",
    "send_via_sms": "SMS மூலம்",
    "send_via_whatsapp": "WhatsApp மூலம்",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "எண்ணிற்கு அனுப்பப்பட்டது. எண் சரியானதா?",
    "keep_waiting": "காத்திருக்கவும்",
    "change_number": "எண் மாற்றம்",

    // Validation & Errors
    "valid_phone_error": "சரியான தொலைபேசி எண்ணை உள்ளிடவும்.",
    "otp_length_error": "முழு 6 இலக்க OTP ஐ உள்ளிடவும்.",

    // Footer Links
    "terms": "விதிமுறைகள்",
    "privacy": "தனியுரிமை",
    "need_help": "உதவி தேவையா?",
    "version": "v1.9.7"
  },

  te: {
    "lang_prefix": "భాష:",
    "theme_light": "లైట్ మోడ్",
    "theme_dark": "డార్క్ మోడ్",

    // Banner
    "banner_badge": "యాప్ పొందండి • DhandaGrow AI",
    "banner_badge_new": "కొత్త ఖాతా • DhandaGrow AI",
    "banner_title": "వీక్షకులను కొనుగోలుదారులుగా మార్చండి",
    "banner_desc": "మీ వ్యాపారాన్ని వేలాది మందికి చేర్చండి. వైరల్ రీల్స్, స్టూడియో ఫోటోషూట్‌లు మరియు ఆకట్టుకునే ప్రకటనలను రూపొందించండి.",

    // Login Screen
    "welcome_title": "DhandaGrow కు స్వాగతం",
    "phone_label": "మీ మొబైల్ నంబర్ నమోదు చేయండి",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP పంపండి",
    "sending_otp": "OTP పంపబడుతోంది...",
    "or_divider": "లేదా",
    "google_login_title": "Google తో సైన్ ఇన్ చేయండి",
    "whatsapp_login_title": "WhatsApp తో కొనసాగించండి",
    "no_account": "ఖాతా లేదా?",
    "signup_link": "సైన్ అప్ చేయండి",

    // Signup Screen Specifics
    "signup_welcome_title": "DhandaGrow కు స్వాగతం",
    "signup_welcome_desc": "మీ వ్యాపారాన్ని విస్తరించడానికి కొత్త ఖాతా సృష్టించండి",
    "phone_verified_title": "ఫోన్ నంబర్ ధృవీకరించబడింది!",
    "phone_verified_desc": "ఖాతాను భద్రపరచడానికి Google తో నమోదు పూర్తి చేయండి.",
    "continue_google_signup": "Google తో కొనసాగించండి",
    "go_to_login": "లాగిన్ అవ్వండి",
    "already_account": "ఇప్పటికే ఖాతా ఉందా?",

    // OTP Screen
    "enter_otp_title": "మీ OTP నమోదు చేయండి",
    "otp_sent_to": "OTP పంపబడింది:",
    "change_mobile_number": "నంబర్ మార్చండి",
    "verify_otp": "OTP ధృవీకరించండి",
    "verifying_otp": "ధృవీకరిస్తోంది...",
    "didnt_receive_otp": "OTP రాలేదా?",
    "resend_in": "మళ్లీ పంపండి",
    "resend_code": "OTP మళ్లీ పంపండి",
    "sending": "పంపుతోంది...",
    "try_other_method": "మరో మార్గం:",
    "send_via_sms": "SMS ద్వారా",
    "send_via_whatsapp": "WhatsApp ద్వారా",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "నంబరుకు పంపబడింది. ఇది సరైన నంబరేనా?",
    "keep_waiting": "వేచి ఉండండి",
    "change_number": "నంబర్ మార్చు",

    // Validation & Errors
    "valid_phone_error": "దయచేసి సరైన మొబైల్ నంబరును నమోదు చేయండి.",
    "otp_length_error": "దయచేసి పూర్తి 6 అంకెల OTP ని నమోదు చేయండి.",

    // Footer Links
    "terms": "నిబంధనలు",
    "privacy": "గోప్యత",
    "need_help": "సహాయం కావాలా?",
    "version": "v1.9.7"
  },

  kn: {
    "lang_prefix": "ಭಾಷೆ:",
    "theme_light": "ಲೈಟ್ ಮೋಡ್",
    "theme_dark": "ಡಾರ್ಕ್ ಮೋಡ್",

    // Banner
    "banner_badge": "ಆ್ಯಪ್ ಪಡೆಯಿರಿ • DhandaGrow AI",
    "banner_badge_new": "ಹೊಸ ಖಾತೆ • DhandaGrow AI",
    "banner_title": "ವೀಕ್ಷಕರನ್ನು ಗ್ರಾಹಕರನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ",
    "banner_desc": "ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಸಾವಿರಾರು ಜನರಿಗೆ ತಲುಪಿಸಿ. ವೈರಲ್ ರೀಲ್ಸ್, ಸ್ಟುಡಿಯೋ ಫೋಟೋಶೂಟ್‌ಗಳು ಮತ್ತು ಜಾಹೀರಾತುಗಳನ್ನು ರಚಿಸಿ.",

    // Login Screen
    "welcome_title": "DhandaGrow ಗೆ ಸುಸ್ವಾಗತ",
    "phone_label": "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP ಕಳುಹಿಸಿ",
    "sending_otp": "OTP ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
    "or_divider": "ಅಥವಾ",
    "google_login_title": "Google ನೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ",
    "whatsapp_login_title": "WhatsApp ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    "no_account": "ಖಾತೆ ಇಲ್ಲವೇ?",
    "signup_link": "ಸೈನ್ ಅಪ್ ಮಾಡಿ",

    // Signup Screen Specifics
    "signup_welcome_title": "DhandaGrow ಗೆ ಸುಸ್ವಾಗತ",
    "signup_welcome_desc": "ವ್ಯಾಪಾರ ಬೆಳೆಸಲು ಹೊಸ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    "phone_verified_title": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಲಾಗಿದೆ!",
    "phone_verified_desc": "ಖಾತೆಯನ್ನು ಭದ್ರಪಡಿಸಲು Google ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ.",
    "continue_google_signup": "Google ನೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    "go_to_login": "ಲಾಗಿನ್ ಮಾಡಿ",
    "already_account": "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",

    // OTP Screen
    "enter_otp_title": "ನಿಮ್ಮ OTP ನಮೂದಿಸಿ",
    "otp_sent_to": "OTP ಕಳುಹಿಸಲಾಗಿದೆ:",
    "change_mobile_number": "ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ",
    "verify_otp": "OTP ಪರಿಶೀಲಿಸಿ",
    "verifying_otp": "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    "didnt_receive_otp": "OTP ಬಂದಿಲ್ಲವೇ?",
    "resend_in": "ಮತ್ತೆ ಕಳುಹಿಸಿ",
    "resend_code": "OTP ಮತ್ತೆ ಕಳುಹಿಸಿ",
    "sending": "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
    "try_other_method": "ಇನ್ನೊಂದು ವಿಧಾನ:",
    "send_via_sms": "SMS ಮೂಲಕ",
    "send_via_whatsapp": "WhatsApp ಮೂಲಕ",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಇದು ಸರಿಯಾದ ಸಂಖ್ಯೆಯೇ?",
    "keep_waiting": "ಕಾಯಿರಿ",
    "change_number": "ಸಂಖ್ಯೆ ಬದಲಿಸಿ",

    // Validation & Errors
    "valid_phone_error": "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    "otp_length_error": "ದಯವಿಟ್ಟು ಪೂರ್ಣ 6 ಅಂಕಿಗಳ OTP ನಮೂದಿಸಿ.",

    // Footer Links
    "terms": "ನಿಯಮಗಳು",
    "privacy": "ಗೌಪ್ಯತೆ",
    "need_help": "ಸಹಾಯ ಬೇಕೇ?",
    "version": "v1.9.7"
  },

  ml: {
    "lang_prefix": "ഭാഷ:",
    "theme_light": "ലൈറ്റ് മോഡ്",
    "theme_dark": "ഡാർക്ക് മോഡ്",

    // Banner
    "banner_badge": "ആപ്പ് നേടുക • DhandaGrow AI",
    "banner_badge_new": "പുതിയ അക്കൗണ്ട് • DhandaGrow AI",
    "banner_title": "കാഴ്ചക്കാരെ ഉപഭോക്താക്കളാക്കുക",
    "banner_desc": "നിങ്ങളുടെ ബിസിനസ്സ് ആയിരക്കണക്കിന് ആളുകളിലേക്ക് എത്തിക്കുക. വൈറൽ റീലുകളും പരസ്യങ്ങളും നിർമ്മിക്കുക.",

    // Login Screen
    "welcome_title": "DhandaGrow-ലേക്ക് സ്വാഗതം",
    "phone_label": "നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകുക",
    "phone_placeholder": "7857889083",
    "send_otp": "OTP അയക്കുക",
    "sending_otp": "OTP അയക്കുന്നു...",
    "or_divider": "അല്ലെങ്കിൽ",
    "google_login_title": "Google വഴി സൈൻ ഇൻ ചെയ്യുക",
    "whatsapp_login_title": "WhatsApp വഴി തുടരുക",
    "no_account": "അക്കൗണ്ട് ഇല്ലേ?",
    "signup_link": "സൈൻ അപ്പ് ചെയ്യുക",

    // Signup Screen Specifics
    "signup_welcome_title": "DhandaGrow-ലേക്ക് സ്വാഗതം",
    "signup_welcome_desc": "ബിസിനസ്സ് വളർത്താൻ ഒരു പുതിയ അക്കൗണ്ട് ഉണ്ടാക്കുക",
    "phone_verified_title": "ഫോൺ നമ്പർ സ്ഥിരീകരിച്ചു!",
    "phone_verified_desc": "അക്കൗണ്ട് സുരക്ഷിതമാക്കാൻ Google വഴി രജിസ്ട്രേഷൻ പൂർത്തിയാക്കുക.",
    "continue_google_signup": "Google വഴി തുടരുക",
    "go_to_login": "ലോഗിൻ ചെയ്യുക",
    "already_account": "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",

    // OTP Screen
    "enter_otp_title": "നിങ്ങളുടെ OTP നൽകുക",
    "otp_sent_to": "OTP അയച്ചത്:",
    "change_mobile_number": "നമ്പർ മാറ്റുക",
    "verify_otp": "OTP സ്ഥിരീകരിക്കുക",
    "verifying_otp": "സ്ഥിരീകരിക്കുന്നു...",
    "didnt_receive_otp": "OTP ലഭിച്ചില്ലേ?",
    "resend_in": "വീണ്ടും അയക്കാൻ",
    "resend_code": "OTP വീണ്ടും അയക്കുക",
    "sending": "അയക്കുന്നു...",
    "try_other_method": "മറ്റൊരു രീതി:",
    "send_via_sms": "SMS വഴി",
    "send_via_whatsapp": "WhatsApp വഴി",
    "right_number_alert_part1": "OTP",
    "right_number_alert_part2": "-ലേക്ക് അയച്ചു. ഇത് ശരിയായ നമ്പറാണോ?",
    "keep_waiting": "കാത്തിരിക്കുക",
    "change_number": "നമ്പർ മാറ്റുക",

    // Validation & Errors
    "valid_phone_error": "ദയവായി സാധുവായ ഒരു മൊബൈൽ നമ്പർ നൽകുക.",
    "otp_length_error": "ദയവായി പൂർണ്ണമായ 6 അക്ക OTP നൽകുക.",

    // Footer Links
    "terms": "നിബന്ധനകൾ",
    "privacy": "സ്വകാര്യത",
    "need_help": "സഹായം വേണോ?",
    "version": "v1.9.7"
  }
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  currentLanguageInfo: LanguageInfo;
  supportedLanguages: LanguageInfo[];
  t: (key: string, defaultVal?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "dhandagrow_preferred_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        setLanguageState(saved);
      }
    } catch {
      // LocalStorage might be blocked or SSR
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const currentLanguageInfo = 
    SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, defaultVal?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS.en;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return defaultVal || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currentLanguageInfo,
        supportedLanguages: SUPPORTED_LANGUAGES,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as SupportedLanguage,
      setLanguage: () => {},
      currentLanguageInfo: SUPPORTED_LANGUAGES[0],
      supportedLanguages: SUPPORTED_LANGUAGES,
      t: (key: string, defaultVal?: string) => TRANSLATIONS.en[key] || defaultVal || key
    };
  }
  return context;
}
