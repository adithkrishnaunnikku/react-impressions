import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";

/* ---------- Google Fonts ---------- */
const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?" +
  [
    "Playfair+Display:wght@400;500;600;700",
    "Great+Vibes",
    "Sacramento",
    "Parisienne",
    "Alex+Brush",
    "Tangerine:wght@400;700",
    "Dancing+Script:wght@400;500;600;700",
    "Cinzel:wght@400;500;600;700",
    "Italiana",
    "Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500",
    "Lora:ital,wght@0,400;0,500;0,600;1,400;1,500",
    "Raleway:ital,wght@0,300;0,400;0,500;1,300;1,400",
    "Montserrat:wght@300;400;500",
    "Pinyon+Script",
    "Mea+Culpa",
    "Tajawal:wght@400;500;700",
  ].join("&family=") +
  "&display=swap";

/* ============================================================
   Types
   ============================================================ */
interface TextElement {
  key: string;
  label: string;
  x: number;
  y: number;
  fontSize: number;
  defaultText: string;
  fontStyle?: "normal" | "italic" | "bold";
  textAnchor?: "start" | "middle" | "end";
  isName?: boolean;
}

interface IconElement {
  type: "cross" | "flower" | "heart" | "ring";
  x: number;
  y: number;
  size: number;
  defaultVisible: boolean;
}

interface Template {
  id: string;
  label: string;
  description: string;
  viewBox: string;
  background: string;
  border: string;
  borderWidth: number;
  textColor: string;
  fontFamily: string;
  groomFont: string;
  brideFont: string;
  elements: TextElement[];
  icons?: IconElement[];
  qrCode?: { x: number; y: number; size: number; defaultVisible: boolean };
}

type Tab = "content" | "design" | "style" | "extras";

/* ============================================================
   Icon paths
   ============================================================ */
const ICON_PATHS: Record<IconElement["type"], string> = {
  cross: "M6 2v6H0v4h6v6h4v-6h6V8h-6V2H6z",
  flower: "M12 2c-2 4-6 5-8 8 2 3 6 4 8 8 2-4 6-5 8-8-2-3-6-4-8-8z",
  heart: "M12 4 C8 0 2 2 2 8 c0 6 10 14 10 14 s10-8 10-14 C22 2 16 0 12 4z",
  ring: "M12 2a7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7zm0 2a5 5 0 015 5 5 5 0 01-5 5 5 5 0 01-5-5 5 5 0 015-5z",
};

/* ============================================================
   Bible quotes
   ============================================================ */
const BIBLE_QUOTES = [
  "The LORD hath done great things for us; whereof we are glad. (Psalms 126:3)",
  "I hold you in my heart… (Philippians 1:7)",
  "Let all that you do be done in love. (1 Corinthians 16:14)",
  "I have found the one whom my soul loves. (Song of Solomon 3:4)",
  "Therefore what God has joined together, let no one separate. (Mark 10:9)",
  "And now these three remain: faith, hope and love. But the greatest of these is love. (1 Corinthians 13:13)",
  "I am my beloved's, and my beloved is mine. (Song of Solomon 6:3)",
  "Two are better than one... For if they fall, one will lift up his fellow. (Ecclesiastes 4:9-10)",
  "He who finds a wife finds a good thing and obtains favor from the LORD. (Proverbs 18:22)",
  "Many waters cannot quench love, neither can floods drown it. (Song of Solomon 8:7)",
];

/* ============================================================
   Templates
   ============================================================ */
const TEMPLATES: Template[] = [
  {
    id: "classic-christian",
    label: "Classic Christian",
    description: "Bible verse, formal invitation, cross & QR code",
    viewBox: "0 0 600 500",
    background: "#fffdf5",
    border: "#b08d6a",
    borderWidth: 2,
    textColor: "#3e2c1b",
    fontFamily: "Cormorant Garamond, serif",
    groomFont: "Great Vibes, cursive",
    brideFont: "Great Vibes, cursive",
    elements: [
      { key: "bibleVerse", label: "Bible Verse", x: 300, y: 55, fontSize: 13, defaultText: BIBLE_QUOTES[0], fontStyle: "italic" },
      { key: "inviteLine1", label: "Invite Line 1", x: 300, y: 90, fontSize: 14, defaultText: "Mr. Ross Jacob and E.E. Jacob" },
      { key: "inviteLine2", label: "Invite Line 2", x: 300, y: 110, fontSize: 14, defaultText: "Langrake at Aprile House, Highway Park, TKV Nagar, Thrissur" },
      { key: "inviteLine3", label: "Invite Line 3", x: 300, y: 130, fontSize: 14, defaultText: "cordially invite your esteemed presence and blessings with family" },
      { key: "occasion", label: "Occasion", x: 300, y: 155, fontSize: 14, defaultText: "on the auspicious occasion of the wedding reception of our son" },
      { key: "groomName", label: "Groom Name", x: 300, y: 200, fontSize: 28, defaultText: "Vivek Anthony", fontStyle: "bold", isName: true },
      { key: "withText", label: "With Text", x: 300, y: 225, fontSize: 14, defaultText: "with" },
      { key: "brideName", label: "Bride Name", x: 300, y: 250, fontSize: 28, defaultText: "Lakshmi Gobi", fontStyle: "bold", isName: true },
      { key: "brideParents", label: "Bride's Parents", x: 300, y: 275, fontSize: 14, defaultText: "daughter of Mrs. Gita Gobi and Dr. V. K. Gobi, Vadel house, Cheramur, Thrissur" },
      { key: "date", label: "Date", x: 300, y: 320, fontSize: 18, defaultText: "Saturday, 14th August 2026" },
      { key: "time", label: "Time", x: 300, y: 345, fontSize: 14, defaultText: "6:30 p.m. onwards" },
      { key: "venue", label: "Venue", x: 300, y: 370, fontSize: 14, defaultText: "Regency Club Auditorium, Thrissur" },
      { key: "footer", label: "Footer", x: 300, y: 400, fontSize: 14, defaultText: "Join us for the reception and dinner" },
    ],
    icons: [{ type: "cross", x: 300, y: 450, size: 24, defaultVisible: true }],
    qrCode: { x: 480, y: 420, size: 60, defaultVisible: false },
  },
  {
    id: "traditional-indian",
    label: "Traditional Indian",
    description: "Warm golds, classic wording, floral motif",
    viewBox: "0 0 600 500",
    background: "#fdf8e8",
    border: "#c8a46e",
    borderWidth: 2,
    textColor: "#4a3b2c",
    fontFamily: "Garamond, serif",
    groomFont: "Cinzel, serif",
    brideFont: "Cinzel, serif",
    elements: [
      { key: "inviteLine1", label: "Invite Line 1", x: 300, y: 55, fontSize: 14, defaultText: "We cordially invite your esteemed presence and blessings" },
      { key: "inviteLine2", label: "Invite Line 2", x: 300, y: 75, fontSize: 14, defaultText: "with family on the auspicious occasion of the marriage of our son" },
      { key: "groomName", label: "Groom Name", x: 300, y: 130, fontSize: 30, defaultText: "Ajin", fontStyle: "bold", isName: true },
      { key: "withText", label: "With Text", x: 300, y: 155, fontSize: 14, defaultText: "with" },
      { key: "brideName", label: "Bride Name", x: 300, y: 180, fontSize: 30, defaultText: "Anjali", fontStyle: "bold", isName: true },
      { key: "groomParents", label: "Groom's Parents", x: 300, y: 210, fontSize: 14, defaultText: "Mr. John K.A. & Mrs. Jessy John, Kulangara House, Mannuthy" },
      { key: "brideParents", label: "Bride's Parents", x: 300, y: 235, fontSize: 14, defaultText: "Mr. Babu Varghese & Mrs. Mary Babu, Kalakkudiyil House, Kuriachira" },
      { key: "date", label: "Date", x: 300, y: 280, fontSize: 18, defaultText: "Thursday, 21st May 2026" },
      { key: "time", label: "Time", x: 300, y: 305, fontSize: 14, defaultText: "10:00 am" },
      { key: "venue", label: "Venue", x: 300, y: 330, fontSize: 14, defaultText: "Salam Plaza Auditorium, Mudikkode, Thrissur" },
      { key: "footer", label: "Footer", x: 300, y: 360, fontSize: 14, defaultText: "and lunch thereafter" },
    ],
    icons: [{ type: "flower", x: 300, y: 400, size: 24, defaultVisible: false }],
  },
  {
    id: "sacred-floral",
    label: "Sacred Floral",
    description: "Cross, floral motifs, classic church wedding",
    viewBox: "0 0 600 500",
    background: "#ffffff",
    border: "#b08968",
    borderWidth: 2,
    textColor: "#3b2f2f",
    fontFamily: "Times New Roman, serif",
    groomFont: "Playfair Display, serif",
    brideFont: "Playfair Display, serif",
    elements: [
      { key: "bibleVerse", label: "Bible Verse", x: 300, y: 50, fontSize: 12, defaultText: BIBLE_QUOTES[1], fontStyle: "italic" },
      { key: "groomParents", label: "Groom's Parents", x: 300, y: 90, fontSize: 14, defaultText: "Mr. John K.A. & Mrs. Jessy John" },
      { key: "groomAddress", label: "Groom's Address", x: 300, y: 110, fontSize: 12, defaultText: "Kulangara House, P.O. Mannuthy, Thrissur" },
      { key: "inviteLine1", label: "Invite Line", x: 300, y: 140, fontSize: 14, defaultText: "request the honour of your presence at the wedding of their son" },
      { key: "groomName", label: "Groom Name", x: 300, y: 180, fontSize: 26, defaultText: "Varghese", fontStyle: "bold", isName: true },
      { key: "withText", label: "With Text", x: 300, y: 205, fontSize: 14, defaultText: "with" },
      { key: "brideName", label: "Bride Name", x: 300, y: 230, fontSize: 26, defaultText: "Leena", fontStyle: "bold", isName: true },
      { key: "brideParents", label: "Bride's Parents", x: 300, y: 260, fontSize: 14, defaultText: "Mr. Mathai K.V. & Mrs. Lissy Mathai, Anthikatt House, Thrissur" },
      { key: "date", label: "Date", x: 300, y: 310, fontSize: 16, defaultText: "Saturday, 14th February 2029" },
      { key: "time", label: "Time", x: 300, y: 335, fontSize: 14, defaultText: "at 10:00 am" },
      { key: "venue", label: "Venue", x: 300, y: 360, fontSize: 14, defaultText: "St. Antony's Church, Mannuthy" },
      { key: "footer", label: "Footer", x: 300, y: 390, fontSize: 14, defaultText: "and thereafter for lunch at St. Antony's Parish Hall" },
    ],
    icons: [
      { type: "cross", x: 300, y: 430, size: 24, defaultVisible: true },
      { type: "flower", x: 530, y: 40, size: 20, defaultVisible: false },
    ],
    qrCode: { x: 480, y: 410, size: 60, defaultVisible: false },
  },
  {
    id: "elegant-script",
    label: "Elegant Script",
    description: "Beautiful cursive names, delicate flourishes",
    viewBox: "0 0 600 500",
    background: "#f9f7f1",
    border: "#c2a580",
    borderWidth: 2,
    textColor: "#4a3a2c",
    fontFamily: "Cormorant Garamond, serif",
    groomFont: "Great Vibes, cursive",
    brideFont: "Great Vibes, cursive",
    elements: [
      { key: "inviteLine1", label: "Invite Line 1", x: 300, y: 70, fontSize: 16, defaultText: "Together with their families" },
      { key: "groomName", label: "Groom Name", x: 300, y: 140, fontSize: 34, defaultText: "Alexander", fontStyle: "bold", isName: true },
      { key: "andText", label: "And", x: 300, y: 170, fontSize: 16, defaultText: "&" },
      { key: "brideName", label: "Bride Name", x: 300, y: 210, fontSize: 34, defaultText: "Isabella", fontStyle: "bold", isName: true },
      { key: "inviteLine2", label: "Invite Line 2", x: 300, y: 260, fontSize: 14, defaultText: "request the pleasure of your company at their wedding" },
      { key: "date", label: "Date", x: 300, y: 300, fontSize: 18, defaultText: "Saturday, the 19th of October 2026" },
      { key: "time", label: "Time", x: 300, y: 330, fontSize: 14, defaultText: "at half past four in the afternoon" },
      { key: "venue", label: "Venue", x: 300, y: 360, fontSize: 14, defaultText: "The Grand Ballroom, Thrissur" },
      { key: "footer", label: "Footer", x: 300, y: 400, fontSize: 14, defaultText: "Dinner and dancing to follow" },
    ],
    icons: [
      { type: "ring", x: 300, y: 240, size: 18, defaultVisible: true },
      { type: "flower", x: 120, y: 430, size: 22, defaultVisible: true },
      { type: "flower", x: 480, y: 430, size: 22, defaultVisible: true },
    ],
  },
  {
    id: "royal-gold",
    label: "Royal Gold",
    description: "Luxurious gold foil design, ornate borders",
    viewBox: "0 0 600 500",
    background: "#fcf8f2",
    border: "#d4af37",
    borderWidth: 3,
    textColor: "#3e2a1a",
    fontFamily: "Playfair Display, serif",
    groomFont: "Cinzel, serif",
    brideFont: "Cinzel, serif",
    elements: [
      { key: "bibleVerse", label: "Bible Verse", x: 300, y: 60, fontSize: 14, defaultText: BIBLE_QUOTES[3], fontStyle: "italic" },
      { key: "inviteLine1", label: "Invite Line 1", x: 300, y: 100, fontSize: 16, defaultText: "Mr. & Mrs. Johnson request the honour of your presence" },
      { key: "occasion", label: "Occasion", x: 300, y: 125, fontSize: 14, defaultText: "at the marriage of their daughter" },
      { key: "brideName", label: "Bride Name", x: 300, y: 180, fontSize: 32, defaultText: "Sophia", fontStyle: "bold", isName: true },
      { key: "withText", label: "To", x: 300, y: 210, fontSize: 16, defaultText: "to" },
      { key: "groomName", label: "Groom Name", x: 300, y: 250, fontSize: 32, defaultText: "Benjamin", fontStyle: "bold", isName: true },
      { key: "date", label: "Date", x: 300, y: 310, fontSize: 18, defaultText: "Saturday, the 2nd of December 2026" },
      { key: "time", label: "Time", x: 300, y: 340, fontSize: 14, defaultText: "at six o'clock in the evening" },
      { key: "venue", label: "Venue", x: 300, y: 370, fontSize: 14, defaultText: "Cathedral of St. Mary, Thrissur" },
      { key: "footer", label: "Footer", x: 300, y: 410, fontSize: 14, defaultText: "Reception to follow" },
    ],
    icons: [
      { type: "cross", x: 300, y: 440, size: 22, defaultVisible: true },
      { type: "ring", x: 300, y: 280, size: 16, defaultVisible: true },
    ],
    qrCode: { x: 480, y: 420, size: 60, defaultVisible: false },
  },
];

/* ============================================================
   Font options
   ============================================================ */
const FONT_OPTIONS = [
  "Cormorant Garamond, serif",
  "Playfair Display, serif",
  "Great Vibes, cursive",
  "Sacramento, cursive",
  "Parisienne, cursive",
  "Alex Brush, cursive",
  "Tangerine, cursive",
  "Dancing Script, cursive",
  "Cinzel, serif",
  "Italiana, serif",
  "Lora, serif",
  "Raleway, sans-serif",
  "Montserrat, sans-serif",
  "Pinyon Script, cursive",
  "Mea Culpa, cursive",
  "Tajawal, sans-serif",
  "Times New Roman, serif",
  "Garamond, serif",
  "Georgia, serif",
  "Arial, sans-serif",
];

/* Key fields shown upfront — everything else is collapsed */
const KEY_FIELDS = ["groomName", "brideName", "date", "time", "venue"];

/* ============================================================
   Small reusable components
   ============================================================ */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`w-9 h-5 rounded-full transition-colors duration-200 relative flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal/50 ${
        checked ? "bg-royal/50" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-pearl shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ============================================================
   Route
   ============================================================ */
export const Route = createFileRoute("/customise")({
  head: () => ({
    meta: [
      { title: "Customise Your Card — Impressions Wedding Cards" },
      { name: "description", content: "Design your own wedding invitation card with live preview." },
    ],
  }),
  component: CustomiseYourCard,
});

/* ============================================================
   Component
   ============================================================ */
function CustomiseYourCard() {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = GOOGLE_FONTS_URL;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  const [textValues, setTextValues]     = useState<Record<string, string>>({});
  const [fontSizes, setFontSizes]       = useState<Record<string, number>>({});
  const [globalFont, setGlobalFont]     = useState(template.fontFamily);
  const [groomFont, setGroomFont]       = useState(template.groomFont);
  const [brideFont, setBrideFont]       = useState(template.brideFont);
  const [textColor, setTextColor]       = useState(template.textColor);
  const [iconVisibility, setIconVisibility] = useState<Record<string, boolean>>({});
  const [qrUrl, setQrUrl]               = useState("");
  const [qrVisible, setQrVisible]       = useState(template.qrCode?.defaultVisible ?? false);
  const [qrImage, setQrImage]           = useState("");

  const [activeTab, setActiveTab]       = useState<Tab>("content");
  const [showAllText, setShowAllText]   = useState(false);

  /* Reset on template change */
  useEffect(() => {
    const newTexts: Record<string, string> = {};
    const newSizes: Record<string, number> = {};
    const newIcons: Record<string, boolean> = {};
    template.elements.forEach((el) => {
      newTexts[el.key] = el.defaultText;
      newSizes[el.key] = el.fontSize;
    });
    template.icons?.forEach((icon, i) => {
      newIcons[`${icon.type}_${i}`] = icon.defaultVisible;
    });
    setTextValues(newTexts);
    setFontSizes(newSizes);
    setIconVisibility(newIcons);
    setGlobalFont(template.fontFamily);
    setGroomFont(template.groomFont);
    setBrideFont(template.brideFont);
    setTextColor(template.textColor);
    setQrVisible(template.qrCode?.defaultVisible ?? false);
    setQrUrl("");
    setQrImage("");
    setShowAllText(false);
  }, [template]);

  /* QR code image */
  useEffect(() => {
    if (qrUrl.trim() && qrVisible) {
      setQrImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`);
    } else {
      setQrImage("");
    }
  }, [qrUrl, qrVisible]);

  const updateText    = (key: string, value: string) => setTextValues(prev => ({ ...prev, [key]: value }));
  const updateSize    = (key: string, size: number)  => setFontSizes(prev => ({ ...prev, [key]: size }));
  const toggleIcon    = (k: string) => setIconVisibility(prev => ({ ...prev, [k]: !prev[k] }));
  const handleBibleSelect = (verse: string) => { if (textValues["bibleVerse"] !== undefined) updateText("bibleVerse", verse); };

  const groomKey = template.elements.find(el => el.isName && el.key.includes("groom"))?.key;
  const brideKey = template.elements.find(el => el.isName && el.key.includes("bride"))?.key;

  const keyElements       = template.elements.filter(el => KEY_FIELDS.includes(el.key));
  const secondaryElements = template.elements.filter(el => !KEY_FIELDS.includes(el.key));
  const nameElements      = template.elements.filter(el => el.isName);

  const hasBibleVerse  = textValues["bibleVerse"] !== undefined;
  const hasDecorations = (template.icons?.length ?? 0) > 0;
  const hasQr          = !!template.qrCode;
  const hasExtras      = hasBibleVerse || hasDecorations || hasQr;

  const TABS: { id: Tab; label: string }[] = [
    { id: "content", label: "Content"  },
    { id: "design",  label: "Design"   },
    { id: "style",   label: "Style"    },
    ...(hasExtras ? [{ id: "extras" as Tab, label: "Extras" }] : []),
  ];

  /* Shared class strings */
  const inputCls  = "w-full bg-white/[0.05] border border-pearl/10 rounded-lg px-4 py-2.5 text-sm text-pearl placeholder-pearl/20 focus:outline-none focus:border-pearl/30 transition-colors";
  const selectCls = "w-full bg-background border border-pearl/10 rounded-lg px-3 py-2.5 text-sm text-pearl focus:outline-none focus:border-pearl/30 transition-colors";
  const labelCls  = "block text-[10px] uppercase tracking-widest text-pearl/40 mb-1.5";

  /* ---- Render ---- */
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-serif text-[clamp(1.8rem,4vw,2.5rem)] text-pearl leading-tight">
              Design Your Invitation
            </h1>
            <p className="text-sm text-pearl/40 mt-1">Personalise and share with us in minutes</p>
          </div>
          <Link
            to="/"
            className="text-xs text-pearl/40 hover:text-pearl/70 transition-colors border border-pearl/10 hover:border-pearl/20 rounded-full px-4 py-2"
          >
            ← Back
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px] gap-8 xl:gap-12 items-start">

          {/* ======================== Preview ======================== */}
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="rounded-2xl border border-pearl/10 bg-white/[0.02] backdrop-blur-sm p-4 sm:p-6 flex justify-center">
              <svg
                viewBox={template.viewBox}
                className="w-full max-w-[600px] h-auto shadow-2xl rounded"
                style={{ background: template.background }}
              >
                <rect x="8" y="8" width="584" height="484" fill="none" stroke={template.border} strokeWidth={template.borderWidth} rx="6" />
                <rect x="14" y="14" width="572" height="472" fill="none" stroke={template.border} strokeWidth="0.5" rx="2" />

                {template.elements.map((el) => {
                  let font = globalFont;
                  if (el.isName && el.key === groomKey) font = groomFont;
                  else if (el.isName && el.key === brideKey) font = brideFont;
                  return (
                    <text
                      key={el.key}
                      x={el.x}
                      y={el.y}
                      fontSize={fontSizes[el.key] || el.fontSize}
                      fill={textColor}
                      fontFamily={font}
                      fontStyle={el.fontStyle === "italic" ? "italic" : "normal"}
                      fontWeight={el.fontStyle === "bold" ? "bold" : "normal"}
                      textAnchor={el.textAnchor || "middle"}
                    >
                      {textValues[el.key] || ""}
                    </text>
                  );
                })}

                {template.icons?.map((icon, i) => {
                  const key = `${icon.type}_${i}`;
                  if (!iconVisibility[key]) return null;
                  return (
                    <g key={key} transform={`translate(${icon.x - icon.size / 2}, ${icon.y - icon.size / 2})`}>
                      <path
                        d={ICON_PATHS[icon.type]}
                        fill="none"
                        stroke={template.border}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        transform={`scale(${icon.size / 24})`}
                      />
                    </g>
                  );
                })}

                {qrVisible && qrImage && template.qrCode && (
                  <image href={qrImage} x={template.qrCode.x} y={template.qrCode.y} width={template.qrCode.size} height={template.qrCode.size} />
                )}
              </svg>
            </div>

            {/* CTA lives under the preview, not buried in the controls */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-full text-sm tracking-widest uppercase font-medium"
              style={{
                background: "linear-gradient(180deg, var(--royal) 0%, var(--royal-deep) 100%)",
                color: "var(--pearl)",
                boxShadow: "0 10px 25px -8px color-mix(in oklab, var(--royal) 75%, transparent)",
              }}
              onClick={() => alert("Preview ready! Share this design with us on WhatsApp or continue editing.")}
            >
              Save & Share Design
            </motion.button>
          </div>

          {/* ======================== Controls ======================== */}
          <div>
            {/* Tab bar */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-pearl/10 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                    activeTab === tab.id
                      ? "bg-white/10 text-pearl"
                      : "text-pearl/40 hover:text-pearl/65"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <AnimatePresence mode="wait">

              {/* -------- CONTENT -------- */}
              {activeTab === "content" && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* The 5 fields people actually need */}
                  {keyElements.map((el) => (
                    <div key={el.key}>
                      <label className={labelCls}>{el.label}</label>
                      <input
                        type="text"
                        value={textValues[el.key] || ""}
                        onChange={(e) => updateText(el.key, e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  ))}

                  {/* Everything else — hidden until requested */}
                  {secondaryElements.length > 0 && (
                    <div className="pt-1">
                      <button
                        onClick={() => setShowAllText(!showAllText)}
                        className="flex items-center gap-2 text-xs text-pearl/35 hover:text-pearl/55 transition-colors py-1 select-none"
                      >
                        <ChevronIcon open={showAllText} />
                        {showAllText ? "Hide full invitation text" : "Edit full invitation text"}
                      </button>

                      <AnimatePresence>
                        {showAllText && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pl-4 border-l border-pearl/10 space-y-4">
                              {secondaryElements.map((el) => (
                                <div key={el.key}>
                                  <label className={labelCls}>{el.label}</label>
                                  {["inviteLine1","inviteLine2","inviteLine3","bibleVerse","brideParents","groomParents","groomAddress","occasion","footer"].includes(el.key) ? (
                                    <textarea
                                      value={textValues[el.key] || ""}
                                      onChange={(e) => updateText(el.key, e.target.value)}
                                      rows={2}
                                      className={`${inputCls} resize-none`}
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      value={textValues[el.key] || ""}
                                      onChange={(e) => updateText(el.key, e.target.value)}
                                      className={inputCls}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {/* -------- DESIGN -------- */}
              {activeTab === "design" && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {TEMPLATES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`w-full p-4 rounded-xl border transition-all text-left flex items-center gap-4 ${
                        templateId === t.id
                          ? "border-pearl/30 bg-white/[0.05]"
                          : "border-pearl/10 bg-white/[0.02] hover:border-pearl/20 hover:bg-white/[0.03]"
                      }`}
                    >
                      {/* Colour swatch */}
                      <div
                        className="w-11 h-11 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: t.background,
                          border: `${t.borderWidth}px solid ${t.border}`,
                        }}
                      >
                        <div className="w-5 h-px rounded-full opacity-60" style={{ background: t.textColor }} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-pearl">{t.label}</div>
                        <div className="text-xs text-pearl/40 mt-0.5">{t.description}</div>
                      </div>

                      {templateId === t.id && (
                        <div className="w-1.5 h-1.5 rounded-full bg-pearl/60 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* -------- STYLE -------- */}
              {activeTab === "style" && (
                <motion.div
                  key="style"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <label className={labelCls}>Body Font</label>
                    <select value={globalFont} onChange={(e) => setGlobalFont(e.target.value)} className={selectCls}>
                      {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f.split(",")[0]}</option>)}
                    </select>
                  </div>

                  {groomKey && (
                    <div>
                      <label className={labelCls}>Groom Name Font</label>
                      <select value={groomFont} onChange={(e) => setGroomFont(e.target.value)} className={selectCls}>
                        {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f.split(",")[0]}</option>)}
                      </select>
                    </div>
                  )}

                  {brideKey && (
                    <div>
                      <label className={labelCls}>Bride Name Font</label>
                      <select value={brideFont} onChange={(e) => setBrideFont(e.target.value)} className={selectCls}>
                        {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f.split(",")[0]}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className={labelCls}>Text Colour</label>
                    <div className="flex items-center gap-3 mt-0.5">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-12 h-10 rounded-lg border border-pearl/10 bg-transparent cursor-pointer p-0.5"
                      />
                      <span className="text-sm text-pearl/40 font-mono tracking-wide">{textColor.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Name sizes — the only sliders worth exposing */}
                  {nameElements.length > 0 && (
                    <div>
                      <label className={labelCls}>Name Sizes</label>
                      <div className="space-y-4">
                        {nameElements.map((el) => (
                          <div key={`size-${el.key}`}>
                            <div className="flex justify-between mb-1.5">
                              <span className="text-xs text-pearl/50">{el.label}</span>
                              <span className="text-xs text-pearl/40 font-mono">{fontSizes[el.key] || el.fontSize}px</span>
                            </div>
                            <input
                              type="range"
                              min="18"
                              max="56"
                              value={fontSizes[el.key] || el.fontSize}
                              onChange={(e) => updateSize(el.key, Number(e.target.value))}
                              className="w-full accent-royal h-1 rounded-full appearance-none bg-white/10 cursor-pointer"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* -------- EXTRAS -------- */}
              {activeTab === "extras" && (
                <motion.div
                  key="extras"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-7"
                >
                  {/* Bible verse */}
                  {hasBibleVerse && (
                    <div>
                      <label className={labelCls}>Bible Verse</label>
                      <select onChange={(e) => handleBibleSelect(e.target.value)} className={selectCls}>
                        <option value="">— Choose a verse —</option>
                        {BIBLE_QUOTES.map((q, i) => (
                          <option key={i} value={q}>
                            {q.length > 55 ? q.substring(0, 55) + "…" : q}
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={textValues["bibleVerse"] || ""}
                        onChange={(e) => updateText("bibleVerse", e.target.value)}
                        rows={2}
                        placeholder="Or type your own…"
                        className={`${inputCls} resize-none mt-2`}
                      />
                    </div>
                  )}

                  {/* Decorations */}
                  {hasDecorations && (
                    <div>
                      <label className={labelCls}>Decorations</label>
                      <div className="space-y-3">
                        {template.icons?.map((icon, i) => {
                          const key = `${icon.type}_${i}`;
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm text-pearl/60 capitalize">{icon.type}</span>
                              <Toggle checked={iconVisibility[key] || false} onChange={() => toggleIcon(key)} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* QR Code */}
                  {hasQr && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-sm text-pearl/60">Venue QR Code</span>
                          <span className="block text-xs text-pearl/30 mt-0.5">Links guests to Google Maps</span>
                        </div>
                        <Toggle checked={qrVisible} onChange={() => setQrVisible(!qrVisible)} />
                      </div>

                      <AnimatePresence>
                        {qrVisible && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden"
                          >
                            <input
                              type="text"
                              placeholder="Paste Google Maps URL…"
                              value={qrUrl}
                              onChange={(e) => setQrUrl(e.target.value)}
                              className={inputCls}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}