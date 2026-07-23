import { createContext, useContext, useEffect, useState } from "react";
import { Languages, Moon, Sun } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Theme = "light" | "dark";
type Lang  = "en" | "hi";

interface ThemeCtx { theme: Theme; toggleTheme: () => void; }
interface LangCtx  { lang: Lang; toggleLang: () => void; t: (key: string) => string; }
interface AuthCtx  { isLoggedIn: boolean; login: () => void; logout: () => void; }

// ── Contexts ───────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeCtx>({ theme: "light", toggleTheme: () => {} });
const LangContext  = createContext<LangCtx>({ lang: "en", toggleLang: () => {}, t: (k) => k });
const AuthContext  = createContext<AuthCtx>({ isLoggedIn: false, login: () => {}, logout: () => {} });

export function useTheme() { return useContext(ThemeContext); }
export function useLang()  { return useContext(LangContext); }
export function useAuth()  { return useContext(AuthContext); }

// ── Translations ───────────────────────────────────────────────────────────

const T: Record<string, Record<Lang, string>> = {
  // ── Shared / Nav ──
  "nav.issues":         { en: "Issues",                 hi: "अंक" },
  "nav.writers":        { en: "Writers",                hi: "लेखक" },
  "nav.contact":        { en: "Contact",                hi: "संपर्क" },
  "nav.upload":         { en: "Upload Magazine",        hi: "पत्रिका अपलोड करें" },
  "nav.tagline":        { en: "Magazine",               hi: "पत्रिका" },

  // ── Hero ──
  "hero.eyebrow":       { en: "The Club Magazine",      hi: "क्लब की पत्रिका" },
  "hero.line1":         { en: "Welcome to",             hi: "में आपका स्वागत है" },
  "hero.line2":         { en: "Hindi Club",             hi: "हिंदी क्लब" },
  "hero.line3":         { en: "Magazine",               hi: "पत्रिका" },
  "hero.desc":          { en: "Celebrating Hindi language and literature through poetry, short stories, essays, and cultural features — written by club members and published each semester.", hi: "कविता, लघुकथा, निबंध और सांस्कृतिक लेखों के माध्यम से हिंदी भाषा और साहित्य का उत्सव — क्लब के सदस्यों द्वारा लिखित और प्रत्येक सेमेस्टर में प्रकाशित।" },
  "hero.cta":           { en: "Explore Issues",         hi: "अंक देखें" },
  "hero.stat1":         { en: "Published Issues",       hi: "प्रकाशित अंक" },
  "hero.stat2":         { en: "Contributors",           hi: "योगदानकर्ता" },
  "hero.stat3":         { en: "Readers",                hi: "पाठक" },

  // ── Issues section ──
  "issues.eyebrow":     { en: "Published Issues",       hi: "प्रकाशित अंक" },
  "issues.heading":     { en: "Past Issues",            hi: "पिछले अंक" },
  "issues.count":       { en: "issues published",       hi: "अंक प्रकाशित" },
  "issues.view":        { en: "View Issue",             hi: "अंक देखें" },
  "issues.theme":       { en: "Theme",                  hi: "विषय" },
  "modal.theme":        { en: "Theme",                  hi: "विषय" },
  "modal.pages":        { en: "Pages",                  hi: "पृष्ठ" },
  "modal.volume":       { en: "Volume",                 hi: "खंड" },
  "modal.download":     { en: "Download PDF",           hi: "PDF डाउनलोड करें" },
  "modal.nopdf":        { en: "No PDF uploaded yet",    hi: "अभी तक PDF अपलोड नहीं" },
  "modal.close":        { en: "Close",                  hi: "बंद करें" },
  "modal.pages.suffix": { en: "pages",                  hi: "पृष्ठ" },

  // ── Upload CTA banner ──
  "banner.heading":     { en: "Want to publish an issue?",    hi: "क्या आप कोई अंक प्रकाशित करना चाहते हैं?" },
  "banner.desc":        { en: "Uploading and publishing magazine issues is available to registered Hindi Club members only. Sign in to access the member portal.", hi: "पत्रिका अंक अपलोड और प्रकाशित करना केवल पंजीकृत हिंदी क्लब सदस्यों के लिए उपलब्ध है। सदस्य पोर्टल तक पहुँचने के लिए साइन इन करें।" },
  "banner.cta":         { en: "Sign In to Upload",            hi: "अपलोड करने के लिए साइन इन करें" },

  // ── Team ──
  "team.eyebrow":       { en: "Our Team",               hi: "हमारी टीम" },
  "team.heading":       { en: "Editorial Board",        hi: "संपादकीय बोर्ड" },
  "team.role":          { en: "Club Member",            hi: "क्लब सदस्य" },

  // ── FAQ ──
  "faq.eyebrow":        { en: "FAQ",                    hi: "सामान्य प्रश्न" },
  "faq.heading":        { en: "Frequently Asked",       hi: "अक्सर पूछे जाने वाले प्रश्न" },
  "faq.q1":  { en: "Who can publish to this magazine?",         hi: "इस पत्रिका में कौन प्रकाशित कर सकता है?" },
  "faq.a1":  { en: "Only registered Hindi Club members can upload and publish issues. Sign in to access the member upload portal.", hi: "केवल पंजीकृत हिंदी क्लब सदस्य ही अंक अपलोड और प्रकाशित कर सकते हैं।" },
  "faq.q2":  { en: "Can I write in both Hindi and English?",    hi: "क्या मैं हिंदी और अंग्रेज़ी दोनों में लिख सकता हूँ?" },
  "faq.a2":  { en: "Yes! We welcome bilingual contributions. Many of our articles feature both Hindi and English content.", hi: "हाँ! हम द्विभाषी योगदान का स्वागत करते हैं। हमारे कई लेख हिंदी और अंग्रेज़ी दोनों में होते हैं।" },
  "faq.q3":  { en: "When is the submission deadline?",          hi: "जमा करने की अंतिम तिथि कब है?" },
  "faq.a3":  { en: "Each edition has its own deadline. Check the editorial calendar or contact the editorial board.", hi: "प्रत्येक संस्करण की अपनी अंतिम तिथि होती है। संपादकीय कैलेंडर देखें या बोर्ड से संपर्क करें।" },
  "faq.q4":  { en: "Are illustrations and photos accepted?",    hi: "क्या चित्र और फ़ोटो स्वीकार किए जाते हैं?" },
  "faq.a4":  { en: "Absolutely. High-resolution images (at least 300 DPI) are welcome and encouraged.", hi: "बिल्कुल। उच्च-रिज़ॉल्यूशन चित्र (कम से कम 300 DPI) का स्वागत है।" },

  // ── Footer ──
  "footer.copy":        { en: "Hindi Club · Magazine · © 2025",  hi: "हिंदी क्लब · पत्रिका · © 2025" },
  "footer.privacy":     { en: "Privacy",                         hi: "गोपनीयता" },
  "footer.contact":     { en: "Contact",                         hi: "संपर्क" },
  "footer.guide":       { en: "Guidelines",                      hi: "दिशानिर्देश" },

  // ── Uploaded card ──
  "card.new":           { en: "New",                   hi: "नया" },
  "card.theme":         { en: "Theme",                 hi: "विषय" },
  "card.uploaded":      { en: "Uploaded",              hi: "अपलोड किया" },

  // ── Login page ──
  "login.heading":       { en: "Welcome back",                          hi: "वापस आपका स्वागत है" },
  "login.subheading":    { en: "Sign in to access the member portal and publish issues.", hi: "सदस्य पोर्टल तक पहुँचने और अंक प्रकाशित करने के लिए साइन इन करें।" },
  "login.email":         { en: "Email Address",                         hi: "ईमेल पता" },
  "login.password":      { en: "Password",                              hi: "पासवर्ड" },
  "login.forgot":        { en: "Forgot password?",                      hi: "पासवर्ड भूल गए?" },
  "login.cta":           { en: "Sign In",                               hi: "साइन इन करें" },
  "login.loading":       { en: "Signing in…",                           hi: "साइन इन हो रहा है…" },
  "login.error":         { en: "Please enter your email and password.",  hi: "कृपया ईमेल और पासवर्ड दर्ज करें।" },
  "login.error_invalid": { en: "No account found with these credentials. Please sign up first.", hi: "इन विवरणों से कोई खाता नहीं मिला। कृपया पहले साइन अप करें।" },
  "login.no_account":    { en: "Not a member yet?",                     hi: "अभी सदस्य नहीं हैं?" },
  "login.signup_link":   { en: "Sign up",                               hi: "साइन अप करें" },
  "login.quote":         { en: "\"Literature is the mirror of society\"", hi: "\"साहित्य समाज का दर्पण है\"" },
  "login.quote_attr":    { en: "— साहित्य समाज का दर्पण है",            hi: "— Literature is the mirror of society" },
  "login.stat_issues":   { en: "Issues",                                hi: "अंक" },
  "login.stat_writers":  { en: "Writers",                               hi: "लेखक" },
  "login.stat_readers":  { en: "Readers",                               hi: "पाठक" },
  "login.footer":        { en: "Hindi Club · Member Portal · © 2025",   hi: "हिंदी क्लब · सदस्य पोर्टल · © 2025" },
  "login.tagline":       { en: "Magazine",                              hi: "पत्रिका" },

  // ── Sign Up page ──
  "signup.heading":      { en: "Create an account",           hi: "खाता बनाएं" },
  "signup.subheading":   { en: "Already have an account?",   hi: "पहले से खाता है?" },
  "signup.signin_link":  { en: "Sign in",                    hi: "साइन इन करें" },
  "signup.name":         { en: "Full Name",                  hi: "पूरा नाम" },
  "signup.name_ph":      { en: "Your full name",             hi: "आपका पूरा नाम" },
  "signup.email":        { en: "Email Address",              hi: "ईमेल पता" },
  "signup.email_ph":     { en: "you@example.com",            hi: "you@example.com" },
  "signup.password":     { en: "Password",                   hi: "पासवर्ड" },
  "signup.password_ph":  { en: "Create a password",         hi: "पासवर्ड बनाएं" },
  "signup.confirm":      { en: "Confirm Password",           hi: "पासवर्ड की पुष्टि करें" },
  "signup.confirm_ph":   { en: "Repeat your password",      hi: "पासवर्ड दोहराएं" },
  "signup.terms":        { en: "I agree to the",             hi: "मैं सहमत हूँ" },
  "signup.terms_tos":    { en: "Terms of Service",           hi: "सेवा की शर्तें" },
  "signup.terms_and":    { en: "and",                        hi: "और" },
  "signup.terms_pp":     { en: "Privacy Policy",            hi: "गोपनीयता नीति" },
  "signup.cta":          { en: "Create Account",            hi: "खाता बनाएं" },
  "signup.loading":      { en: "Creating account…",         hi: "खाता बन रहा है…" },
  "signup.done_heading": { en: "Account Created!",          hi: "खाता बन गया!" },
  "signup.done_p1":      { en: "Your account has been created successfully.", hi: "आपका खाता सफलतापूर्वक बन गया है।" },
  "signup.done_p2":      { en: "A verification email has been sent to",       hi: "एक सत्यापन ईमेल भेजा गया है" },
  "signup.done_cta":     { en: "Go to Sign In",             hi: "साइन इन पर जाएं" },
  "signup.back":         { en: "Back to Sign In",           hi: "साइन इन पर वापस" },
  "signup.panel_heading":{ en: "Join our community of readers & writers.", hi: "पाठकों और लेखकों के हमारे समुदाय से जुड़ें।" },
  "signup.panel_desc":   { en: "Become part of the Hindi Club and get access to all published magazines, events, and the ability to contribute your writing.", hi: "हिंदी क्लब का हिस्सा बनें और सभी प्रकाशित पत्रिकाओं, कार्यक्रमों और अपना लेखन योगदान करने की सुविधा पाएं।" },
  "signup.benefit1":     { en: "Access all published magazine issues",      hi: "सभी प्रकाशित पत्रिका अंकों तक पहुँच" },
  "signup.benefit2":     { en: "Submit poems, stories & essays",            hi: "कविता, कहानियाँ और निबंध जमा करें" },
  "signup.benefit3":     { en: "Join member-only events & workshops",       hi: "सदस्य-केवल कार्यक्रमों और कार्यशालाओं में शामिल हों" },
  "signup.benefit4":     { en: "Early access to new editions",              hi: "नए संस्करणों तक पहले पहुँच" },
  "signup.err_name":     { en: "Full name is required.",                    hi: "पूरा नाम आवश्यक है।" },
  "signup.err_email":    { en: "Email is required.",                        hi: "ईमेल आवश्यक है।" },
  "signup.err_email2":   { en: "Enter a valid email address.",              hi: "एक वैध ईमेल पता दर्ज करें।" },
  "signup.err_pass":     { en: "Password is required.",                     hi: "पासवर्ड आवश्यक है।" },
  "signup.err_pass2":    { en: "Password must be at least 8 characters.",   hi: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए।" },
  "signup.err_confirm":  { en: "Please confirm your password.",             hi: "कृपया अपना पासवर्ड दोहराएं।" },
  "signup.err_confirm2": { en: "Passwords do not match.",                   hi: "पासवर्ड मेल नहीं खाते।" },
  "signup.err_terms":    { en: "You must agree to the terms to continue.",  hi: "जारी रखने के लिए शर्तों से सहमत होना आवश्यक है।" },

  // ── Upload page ──
  "upload.back":          { en: "Back to Magazine",            hi: "पत्रिका पर वापस" },
  "upload.portal":        { en: "Member Upload",               hi: "सदस्य अपलोड" },
  "upload.signed_in":     { en: "Signed in as Member",         hi: "सदस्य के रूप में साइन इन" },
  "upload.eyebrow":       { en: "Member Portal",               hi: "सदस्य पोर्टल" },
  "upload.heading":       { en: "Publish a New Issue",         hi: "नया अंक प्रकाशित करें" },
  "upload.subheading":    { en: "Upload a PDF, add a cover image, and fill in the issue details.", hi: "PDF अपलोड करें, कवर छवि जोड़ें और अंक का विवरण भरें।" },
  "upload.step1":         { en: "1. Upload PDF File",          hi: "1. PDF फ़ाइल अपलोड करें" },
  "upload.step2":         { en: "2. Cover Image",              hi: "2. कवर छवि" },
  "upload.step3":         { en: "3. Issue Details",            hi: "3. अंक विवरण" },
  "upload.pdf_heading":   { en: "Drag & drop your magazine PDF", hi: "पत्रिका PDF यहाँ खींचें और छोड़ें" },
  "upload.pdf_drop":      { en: "Drop your PDF here",          hi: "PDF यहाँ छोड़ें" },
  "upload.pdf_hint":      { en: "or browse files — PDF only, up to 50 MB", hi: "या फ़ाइलें ब्राउज़ करें — केवल PDF, 50 MB तक" },
  "upload.pdf_browse":    { en: "browse files",                hi: "ब्राउज़ करें" },
  "upload.cover_label":   { en: "Cover Image",                 hi: "कवर छवि" },
  "upload.cover_desc":    { en: "Upload a cover image to display on the magazine archive. This will appear as the issue thumbnail on the home page.", hi: "पत्रिका संग्रह में प्रदर्शित करने के लिए एक कवर छवि अपलोड करें। यह होम पेज पर अंक थंबनेल के रूप में दिखाई देगी।" },
  "upload.cover_hint":    { en: "Recommended: portrait ratio (3:4), min 600×800 px. JPG, PNG, or WEBP.", hi: "अनुशंसित: पोर्ट्रेट अनुपात (3:4), न्यूनतम 600×800 px। JPG, PNG, या WEBP।" },
  "upload.cover_optional":{ en: "Optional — a placeholder will be used if skipped.", hi: "वैकल्पिक — यदि छोड़ा तो प्लेसहोल्डर उपयोग होगा।" },
  "upload.cover_added":   { en: "Cover image added",           hi: "कवर छवि जोड़ी गई" },
  "upload.cover_drop":    { en: "Drop image",                  hi: "छवि छोड़ें" },
  "upload.cover_browse":  { en: "browse",                      hi: "ब्राउज़ करें" },
  "upload.cover_change":  { en: "Change",                      hi: "बदलें" },
  "upload.cover_remove":  { en: "Remove",                      hi: "हटाएं" },
  "upload.guidelines":    { en: "Upload Guidelines",           hi: "अपलोड दिशानिर्देश" },
  "upload.guide1":        { en: "PDF format only, maximum 50 MB per file",   hi: "केवल PDF प्रारूप, प्रति फ़ाइल अधिकतम 50 MB" },
  "upload.guide2":        { en: "Ensure all fonts are embedded in the PDF",  hi: "सुनिश्चित करें कि सभी फ़ॉन्ट PDF में एम्बेड हों" },
  "upload.guide3":        { en: "Images should be at least 150 DPI for print quality", hi: "प्रिंट गुणवत्ता के लिए चित्र कम से कम 150 DPI होने चाहिए" },
  "upload.guide4":        { en: "Include a cover page as the first page",    hi: "पहले पृष्ठ के रूप में एक कवर पृष्ठ शामिल करें" },
  "upload.guide5":        { en: "Review editorial guidelines before submitting", hi: "जमा करने से पहले संपादकीय दिशानिर्देश देखें" },
  "upload.title":         { en: "Issue Title",                 hi: "अंक शीर्षक" },
  "upload.title_ph":      { en: "e.g. दीपावली अंक",           hi: "जैसे दीपावली अंक" },
  "upload.subtitle":      { en: "English Subtitle",            hi: "अंग्रेज़ी उपशीर्षक" },
  "upload.subtitle_ph":   { en: "e.g. Diwali Special Edition", hi: "जैसे Diwali Special Edition" },
  "upload.volume":        { en: "Volume",                      hi: "खंड" },
  "upload.year":          { en: "Year",                        hi: "वर्ष" },
  "upload.pub_date":      { en: "Publication Date",            hi: "प्रकाशन तिथि" },
  "upload.theme":         { en: "Theme / Topic",               hi: "विषय / टॉपिक" },
  "upload.theme_ph":      { en: "Select a theme…",             hi: "विषय चुनें…" },
  "upload.theme_other":   { en: "Other (specify below)",       hi: "अन्य (नीचे लिखें)" },
  "upload.theme_custom":  { en: "Custom theme",                hi: "कस्टम विषय" },
  "upload.theme_custom_ph":{ en: "Describe your theme…",       hi: "अपना विषय लिखें…" },
  "upload.editors":       { en: "Editors / Contributors",      hi: "संपादक / योगदानकर्ता" },
  "upload.editors_ph":    { en: "Names of editors and contributors…", hi: "संपादकों और योगदानकर्ताओं के नाम…" },
  "upload.cta":           { en: "Publish Issue",               hi: "अंक प्रकाशित करें" },
  "upload.loading":       { en: "Publishing…",                 hi: "प्रकाशित हो रहा है…" },
  "upload.pdf_required":  { en: "Upload a PDF file above to enable publishing.", hi: "प्रकाशन सक्षम करने के लिए ऊपर PDF अपलोड करें।" },
  "upload.err_title":     { en: "Issue title is required.",    hi: "अंक शीर्षक आवश्यक है।" },
  "upload.err_volume":    { en: "Volume number is required.",  hi: "खंड संख्या आवश्यक है।" },
  "upload.err_wait":      { en: "Please wait for all files to finish uploading.", hi: "सभी फ़ाइलें अपलोड होने तक प्रतीक्षा करें।" },
  "upload.success_heading":{ en: "Issue Published!",           hi: "अंक प्रकाशित हो गया!" },
  "upload.success_p1":    { en: "has been submitted to the editorial queue.", hi: "संपादकीय कतार में जमा कर दिया गया है।" },
  "upload.success_p2":    { en: "The editorial board will review and publish it to the magazine archive.", hi: "संपादकीय बोर्ड इसकी समीक्षा करके पत्रिका संग्रह में प्रकाशित करेगा।" },
  "upload.another":       { en: "Upload Another",              hi: "और अपलोड करें" },
  "upload.view_mag":      { en: "View Magazine",               hi: "पत्रिका देखें" },
  "upload.done":          { en: "Uploaded",                    hi: "अपलोड हुआ" },
  "upload.failed":        { en: "Failed",                      hi: "असफल" },
};

function translate(key: string, lang: Lang): string {
  return T[key]?.[lang] ?? key;
}

// ── Theme options ──────────────────────────────────────────────────────────

export const THEME_OPTIONS: { en: string; hi: string }[] = [
  { en: "Poetry",                   hi: "कविता" },
  { en: "Short Story",              hi: "लघुकथा" },
  { en: "Essay",                    hi: "निबंध" },
  { en: "Drama & Theatre",          hi: "नाटक और रंगमंच" },
  { en: "Photography",              hi: "फ़ोटोग्राफ़ी" },
  { en: "Art & Illustration",       hi: "कला और चित्रण" },
  { en: "Music & Dance",            hi: "संगीत और नृत्य" },
  { en: "Cuisine & Food",           hi: "व्यंजन और खाद्य" },
  { en: "Culture & Tradition",      hi: "संस्कृति और परंपरा" },
  { en: "Festivals",                hi: "त्योहार" },
  { en: "Mythology & Folklore",     hi: "पौराणिक कथाएं और लोककथाएं" },
  { en: "History & Heritage",       hi: "इतिहास और विरासत" },
  { en: "Independence & Patriotism",hi: "स्वतंत्रता और देशभक्ति" },
  { en: "Nature & Environment",     hi: "प्रकृति और पर्यावरण" },
  { en: "Travel & Places",          hi: "यात्रा और स्थान" },
  { en: "Science & Technology",     hi: "विज्ञान और प्रौद्योगिकी" },
  { en: "Social Issues",            hi: "सामाजिक मुद्दे" },
  { en: "Philosophy & Spirituality",hi: "दर्शनशास्त्र और आध्यात्मिकता" },
  { en: "Humour & Satire",          hi: "हास्य और व्यंग्य" },
  { en: "Biography & Memoir",       hi: "जीवनी और संस्मरण" },
  { en: "Sports & Games",           hi: "खेल और मनोरंजन" },
  { en: "Youth & Student Life",     hi: "युवा और छात्र जीवन" },
  { en: "Women & Society",          hi: "महिला और समाज" },
  { en: "Language & Linguistics",   hi: "भाषा और भाषाविज्ञान" },
];

// ── Shared UI components ───────────────────────────────────────────────────

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useLang();
  return (
    <button
      onClick={toggleLang}
      title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
      className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-body px-2 py-1.5 rounded-sm hover:bg-secondary ${className}`}
    >
      <Languages size={15} />
      <span className="font-semibold">{lang === "en" ? "हिं" : "EN"}</span>
    </button>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className={`w-8 h-8 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors ${className}`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

// ── Combined provider ──────────────────────────────────────────────────────

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    (localStorage.getItem("hc_theme") as Theme | null) ?? "light"
  );
  const [lang, setLang] = useState<Lang>(() =>
    (localStorage.getItem("hc_lang") as Lang | null) ?? "en"
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    localStorage.getItem("hc_auth") === "1"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("hc_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const toggleLang  = () => setLang((l) => {
    const next = l === "en" ? "hi" : "en";
    localStorage.setItem("hc_lang", next);
    return next;
  });
  const t = (key: string) => translate(key, lang);

  const login  = () => { localStorage.setItem("hc_auth", "1"); setIsLoggedIn(true); };
  const logout = () => { localStorage.removeItem("hc_auth"); setIsLoggedIn(false); };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LangContext.Provider value={{ lang, toggleLang, t }}>
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
          {children}
        </AuthContext.Provider>
      </LangContext.Provider>
    </ThemeContext.Provider>
  );
}
