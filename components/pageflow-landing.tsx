"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
// Web3Forms - no import needed
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Monitor,
  MessageCircle,
  MessageSquare,
  Sparkles,
  Rocket,
  Zap,
  Smartphone,
  Code,
  Star,
  Check,
  ArrowLeft,
  ArrowDown,
  Play,
  ChevronDown,
  Globe,
  Shield,
  Clock,
  Users,
  TrendingUp,
  Menu,
  X,
  Tablet,
  Download,
  Copy,
  RefreshCw,
  Palette,
  Type,
  Layout,
  Eye,
  CheckCircle2,
  Loader2,
  Upload,
  Image as ImageIcon,
  Link,
  Trash2,
  Plus,
  Settings,
  ExternalLink,
  Mail,
  Phone,
} from "lucide-react"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"

// Types
interface FormData {
  businessName: string
  businessNameEn: string
  description: string
  targetAudience: string
  action: string
  phone: string
  email: string
  address: string
}

interface UploadedImage {
  id: string
  name: string
  url: string
  size: number
}

interface CustomizationOptions {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  headingFont: string
  borderRadius: number
  buttonStyle: "rounded" | "pill" | "square"
  logoUrl: string | null
  faviconUrl: string | null
  heroStyle: "centered" | "split" | "fullwidth"
  includeSections: {
    hero: boolean
    features: boolean
    about: boolean
    services: boolean
    testimonials: boolean
    gallery: boolean
    pricing: boolean
    faq: boolean
    contact: boolean
    cta: boolean
  }
  customCss: string
  referenceUrl: string
  socialLinks: {
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
    whatsapp: string
  }
}

type DeviceType = "desktop" | "tablet" | "mobile"

// Color presets
const colorPresets = [
  { name: "ירוק קלאסי", primary: "#8BDBAB", secondary: "#1A1A1A", bg: "#0A0A0A", text: "#FFFFFF" },
  { name: "כחול מקצועי", primary: "#3B82F6", secondary: "#1E40AF", bg: "#0F172A", text: "#F8FAFC" },
  { name: "סגול מודרני", primary: "#A855F7", secondary: "#7C3AED", bg: "#0C0A1D", text: "#FAFAFA" },
  { name: "כתום חם", primary: "#F97316", secondary: "#EA580C", bg: "#1C1412", text: "#FFF7ED" },
  { name: "ורוד רך", primary: "#EC4899", secondary: "#DB2777", bg: "#1A0A14", text: "#FDF2F8" },
  { name: "תכלת רגוע", primary: "#06B6D4", secondary: "#0891B2", bg: "#0A1A1F", text: "#ECFEFF" },
  { name: "לבן נקי", primary: "#18181B", secondary: "#3F3F46", bg: "#FFFFFF", text: "#18181B" },
  { name: "קרם אלגנטי", primary: "#B8860B", secondary: "#8B6914", bg: "#FFFEF5", text: "#1A1A1A" },
]

// Font options
const fontOptions = [
  { value: "heebo", label: "Heebo", hebrew: true },
  { value: "assistant", label: "Assistant", hebrew: true },
  { value: "rubik", label: "Rubik", hebrew: true },
  { value: "open-sans", label: "Open Sans", hebrew: false },
  { value: "inter", label: "Inter", hebrew: false },
  { value: "poppins", label: "Poppins", hebrew: false },
  { value: "montserrat", label: "Montserrat", hebrew: false },
]

// Device dimensions
const deviceDimensions: Record<DeviceType, { width: number; label: string }> = {
  desktop: { width: 1200, label: "מחשב" },
  tablet: { width: 768, label: "טאבלט" },
  mobile: { width: 375, label: "נייד" },
}

// Animated counter component
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (hasAnimated) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true)
          let start = 0
          const increment = target / (duration * 60)
          const timer = setInterval(() => {
            start += increment
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 1000 / 60)
        }
      },
      { threshold: 0.5 }
    )
    const element = document.getElementById(`counter-${target}`)
    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [target, duration, hasAnimated])

  return <span id={`counter-${target}`}>{count.toLocaleString()}</span>
}

// Magnetic button effect
function MagneticButton({ children, className, ...props }: React.ComponentProps<typeof Button>) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div style={{ x: springX, y: springY }}>
      <Button
        className={className}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}

// File upload component with validation
function FileUpload({
  onUpload,
  accept = "image/*",
  maxSize = 500000,
  label,
  currentFile,
  onRemove,
}: {
  onUpload: (file: File, url: string) => void
  accept?: string
  maxSize?: number
  label: string
  currentFile?: string | null
  onRemove?: () => void
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    setError(null)
    
    if (file.size > maxSize) {
      setError(`הקובץ גדול מדי. מקסימום ${Math.round(maxSize / 1000)}KB`)
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("נא להעלות קובץ תמונה בלבד")
      return
    }

    const url = URL.createObjectURL(file)
    onUpload(file, url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew">{label}</Label>
      
      {currentFile ? (
        <div className="relative group">
          <div className="w-full h-24 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
            <img src={currentFile} alt="Uploaded" className="max-h-full max-w-full object-contain" />
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`
            w-full h-24 rounded-xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-2 transition-all
            ${isDragging 
              ? "border-[#8BDBAB] bg-[#8BDBAB]/10" 
              : "border-white/20 hover:border-white/40 bg-white/5"
            }
          `}
        >
          <Upload className={`w-6 h-6 ${isDragging ? "text-[#8BDBAB]" : "text-[#9CA3AF]"}`} />
          <span className="text-xs text-[#9CA3AF] font-hebrew">גרור או לחץ להעלאה</span>
          <span className="text-xs text-[#9CA3AF]/60 font-hebrew">מקס׳ {Math.round(maxSize / 1000)}KB</span>
        </div>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
      
      {error && (
        <p className="text-xs text-red-400 font-hebrew">{error}</p>
      )}
    </div>
  )
}

// Color picker component
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew">{label}</Label>
      <div className="flex gap-2">
        <div
          className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white/5 border-white/10 text-white font-mono text-sm h-10"
          dir="ltr"
        />
      </div>
    </div>
  )
}

// Generate landing page HTML
function generateLandingPageHTML(
  formData: FormData,
  customization: CustomizationOptions,
  uploadedImages: UploadedImage[],
  aiContent?: any
): string {
  const {
    primaryColor,
    secondaryColor,
    backgroundColor,
    textColor,
    accentColor,
    fontFamily,
    headingFont,
    borderRadius,
    buttonStyle,
    logoUrl,
    heroStyle,
    includeSections,
    customCss,
    socialLinks,
  } = customization

  const buttonRadiusClass = buttonStyle === "pill" ? "9999px" : buttonStyle === "square" ? "0" : `${borderRadius}px`
  
  const actionTexts: Record<string, string> = {
    contact: "צור קשר",
    signup: "הרשמה",
    purchase: "לרכישה",
    booking: "הזמנת פגישה",
    quote: "קבל הצעת מחיר",
    download: "להורדה",
  }

  const ctaText = actionTexts[formData.action] || "צור קשר"
    // Extract AI content with fallbacks
  const heroHeadline = aiContent?.hero?.headline || "הפתרון המושלם עבורך"
  const heroSubheadline = aiContent?.hero?.subheadline || formData.description
  const aboutTitle = aiContent?.about?.title || `אודות ${formData.businessName}`
  const aboutText = aiContent?.about?.text || "אנחנו כאן כדי לספק לכם את השירות הטוב ביותר"
  
  const services = aiContent?.services || [
    { title: "שירות מקצועי", description: "תיאור קצר של השירות והיתרונות שהוא מציע ללקוחות", icon: "Star" },
    { title: "ייעוץ אישי", description: "תיאור קצר של השירות והיתרונות שהוא מציע ללקוחות", icon: "Heart" },
    { title: "תמיכה מלאה", description: "תיאור קצר של השירות והיתרונות שהוא מציע ללקוחות", icon: "Shield" },
    { title: "פתרונות מותאמים", description: "תיאור קצר של השירות והיתרונות שהוא מציע ללקוחות", icon: "Zap" },
  ]
  
  const testimonials = aiContent?.testimonials || [
    { name: "יוסי כהן", role: "לקוח", text: "שירות מעולה! ממליץ בחום לכולם" },
    { name: "רונית לוי", role: "לקוחה", text: "מקצוענים אמיתיים, תודה רבה על העבודה המצוינת" },
    { name: "דוד ישראלי", role: "לקוח", text: "חוויה נפלאה מההתחלה ועד הסוף" },
  ]
  
  const faqItems = aiContent?.faq || [
    { question: "כמה זמן לוקח התהליך?", answer: "התהליך לוקח בין 1-2 שבועות בהתאם להיקף הפרויקט" },
    { question: "מה כולל השירות?", answer: "השירות כולל ייעוץ מקצועי, ליווי אישי ותמיכה מלאה" },
    { question: "האם יש אחריות?", answer: "כן, אנחנו מספקים אחריות מלאה על כל העבודות שלנו" },
    { question: "איך מתחילים?", answer: "פשוט צרו איתנו קשר ונשמח לעזור" },
  ]
  
  const ctaPrimary = aiContent?.cta?.primary || ctaText
  const ctaSecondary = aiContent?.cta?.secondary || "למידע נוסף"

  // Determine if background is light or dark for text contrast
  const isLightBg = backgroundColor.toLowerCase() === "#ffffff" || 
                    backgroundColor.toLowerCase() === "#fff" || 
                    backgroundColor.toLowerCase() === "#fffef5"
  
  const cardBg = isLightBg ? "#F8F8F8" : "rgba(255,255,255,0.03)"
  const cardBorder = isLightBg ? "#E5E5E5" : "rgba(255,255,255,0.1)"
  const mutedText = isLightBg ? "#6B7280" : "rgba(255,255,255,0.7)"
  
  // Build gallery images HTML if available
  const galleryImagesHTML = uploadedImages.length > 0 
    ? uploadedImages.map(img => `
        <div style="border-radius: ${borderRadius}px; overflow: hidden; aspect-ratio: 16/9;">
          <img src="${img.url}" alt="${img.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `).join("")
    : ""

  // Hero style variations
  const heroStyles: Record<string, string> = {
    centered: "text-align: center; max-width: 800px; margin: 0 auto;",
    split: "display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;",
    fullwidth: "text-align: center; max-width: 100%;",
  }

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${formData.description.substring(0, 160)}">
  <meta name="keywords" content="${formData.businessName}, ${formData.targetAudience || ""}, שירותים, ישראל">
  <meta property="og:title" content="${formData.businessName}">
  <meta property="og:description" content="${formData.description.substring(0, 160)}">
  <meta property="og:type" content="website">
  <title>${formData.businessName}${formData.businessNameEn ? ` | ${formData.businessNameEn}` : ""}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&family=Assistant:wght@300;400;500;600;700;800&family=Rubik:wght@300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor || primaryColor};
      --background: ${backgroundColor};
      --text: ${textColor};
      --text-muted: ${mutedText};
      --card-bg: ${cardBg};
      --card-border: ${cardBorder};
      --radius: ${borderRadius}px;
      --btn-radius: ${buttonRadiusClass};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: '${fontFamily}', 'Heebo', sans-serif;
      background-color: var(--background);
      color: var(--text);
      line-height: 1.7;
      font-size: 16px;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: '${headingFont || fontFamily}', 'Heebo', sans-serif;
      font-weight: 700;
      line-height: 1.2;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    a {
      color: var(--primary);
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    a:hover {
      opacity: 0.8;
    }
    
    .btn-primary {
      background-color: var(--primary);
      color: ${isLightBg || primaryColor.toLowerCase() === "#ffffff" ? "#000000" : "#000000"};
      padding: 16px 36px;
      border-radius: var(--btn-radius);
      font-weight: 600;
      font-size: 1.1rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-decoration: none;
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 40px ${primaryColor}50;
      opacity: 1;
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--text);
      padding: 16px 36px;
      border-radius: var(--btn-radius);
      font-weight: 600;
      font-size: 1.1rem;
      border: 2px solid var(--text);
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-secondary:hover {
      background: var(--text);
      color: var(--background);
      opacity: 1;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }
    
    .section {
      padding: 100px 0;
    }
    
    .section-title {
      font-size: 2.75rem;
      margin-bottom: 16px;
      font-weight: 800;
    }
    
    .section-subtitle {
      font-size: 1.2rem;
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto 60px;
    }
    
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: var(--radius);
      padding: 32px;
      transition: all 0.3s ease;
    }
    
    .card:hover {
      border-color: var(--primary);
      transform: translateY(-6px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    .gradient-text {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .input {
      width: 100%;
      padding: 16px 20px;
      border-radius: var(--radius);
      border: 1px solid var(--card-border);
      background: var(--card-bg);
      color: var(--text);
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
      text-align: right;
      direction: rtl;
    }
    
    .input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 4px ${primaryColor}20;
    }
    
    .input::placeholder {
      color: var(--text-muted);
    }
    
    .icon-box {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: ${primaryColor}15;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .icon-box svg {
      width: 28px;
      height: 28px;
      stroke: var(--primary);
    }
    
    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: ${backgroundColor}ee;
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--card-border);
      transition: all 0.3s ease;
    }
    
    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo img {
      height: 44px;
      width: auto;
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
    }
    
    .nav {
      display: flex;
      gap: 32px;
      align-items: center;
    }
    
    .nav a {
      color: var(--text-muted);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }
    
    .nav a:hover {
      color: var(--text);
      opacity: 1;
    }
    
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
    }
    
    .mobile-menu-btn svg {
      width: 28px;
      height: 28px;
      stroke: var(--text);
    }
    
    /* Target audience badge */
    .audience-badge {
      display: inline-block;
      background: ${primaryColor}15;
      color: var(--primary);
      padding: 8px 20px;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 24px;
    }
    
    /* WhatsApp Float */
    .whatsapp-float {
      position: fixed;
      bottom: 24px;
      left: 24px;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #25D366;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 24px rgba(37,211,102,0.4);
      z-index: 1000;
      transition: all 0.3s ease;
    }
    
    .whatsapp-float:hover {
      transform: scale(1.1);
      box-shadow: 0 8px 32px rgba(37,211,102,0.5);
    }
    
    .whatsapp-float svg {
      width: 32px;
      height: 32px;
      fill: white;
    }
    
    /* Responsive */
    @media (max-width: 968px) {
      .desktop-nav {
        display: none !important;
      }

      .mobile-menu-btn {
        display: block !important;
      }

      .mobile-nav.active {
        display: block !important;
      }

      .section {
        padding: 70px 0;
      }

      .section-title {
        font-size: 2rem;
      }

      h1 {
        font-size: 2.5rem !important;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }

      .grid-2, .grid-3, .grid-4 {
        grid-template-columns: 1fr !important;
      }

      .contact-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 16px;
      }

      h1 {
        font-size: 2rem !important;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .card {
        padding: 24px;
      }
    }
    
    /* Custom CSS */
    ${customCss || ""}
  </style>
</head>
<body>
  <!-- Header -->
  <header style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: ${backgroundColor}ee; backdrop-filter: blur(10px); border-bottom: 1px solid ${backgroundColor === "#FFFFFF" ? "#E5E5E5" : "rgba(255,255,255,0.05)"};">
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; padding: 16px 24px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${formData.businessName}" style="height: 40px; width: auto;">` : ""}
        <span style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${formData.businessName}</span>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="desktop-nav" style="display: flex; gap: 32px; align-items: center;">
        <a href="#about" style="color: var(--text); text-decoration: none; opacity: 0.8; transition: opacity 0.3s;">אודות</a>
        <a href="#services" style="color: var(--text); text-decoration: none; opacity: 0.8; transition: opacity 0.3s;">שירותים</a>
        <a href="#contact" style="color: var(--text); text-decoration: none; opacity: 0.8; transition: opacity 0.3s;">צור קשר</a>
        <button class="btn-primary" style="padding: 10px 24px; font-size: 0.95rem;">${ctaText}</button>
      </nav>
      
      <!-- Mobile Menu Button -->
      <button class="mobile-menu-btn" onclick="document.getElementById('mobile-menu').classList.toggle('active')" style="display: none; background: none; border: none; cursor: pointer; padding: 8px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text)" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="mobile-nav" style="display: none; padding: 16px 24px; border-top: 1px solid var(--card-border); background: var(--card-bg);">
      <a href="#about" style="display: block; padding: 12px 0; color: var(--text); text-decoration: none; border-bottom: 1px solid var(--card-border);">אודות</a>
      <a href="#services" style="display: block; padding: 12px 0; color: var(--text); text-decoration: none; border-bottom: 1px solid var(--card-border);">שירותים</a>
      <a href="#contact" style="display: block; padding: 12px 0; color: var(--text); text-decoration: none; border-bottom: 1px solid var(--card-border);">צור קשר</a>
      <button class="btn-primary" style="width: 100%; margin-top: 12px; padding: 12px 24px;">${ctaText}</button>
    </div>
  </header>

  ${includeSections.hero ? `
  <!-- Hero Section -->
  <section class="section" style="min-height: 100vh; display: flex; align-items: center; padding-top: 100px; position: relative; overflow: hidden;">
    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 30% 50%, ${primaryColor}15, transparent 50%);"></div>
    <div class="container" style="position: relative; z-index: 1;">
      <div style="max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="font-size: 4rem; font-weight: 900; line-height: 1.1; margin-bottom: 24px;">
          ${formData.businessName}
<span class="gradient-text" style="display: block; margin-top: 8px;">${heroHeadline}</span>
        </h1>
        <p style="font-size: 1.25rem; opacity: 0.8; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
          ${formData.description}
        </p>
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-primary">
            ${ctaText}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button class="btn-secondary">למידע נוסף</button>
        </div>
      </div>
    </div>
  </section>
  ` : ""}

  ${includeSections.about ? `
  <!-- About Section -->
  <section id="about" class="section">
    <div class="container">
      <div style="text-align: center; margin-bottom: 60px;">
        <h2 style="font-size: 3rem; margin-bottom: 16px;">אודות ${formData.businessName}</h2>
        <p style="font-size: 1.1rem; opacity: 0.7; max-width: 600px; margin: 0 auto;">אנחנו כאן כדי לספק לכם את השירות הטוב ביותר</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
        <div class="card">
          <div style="width: 60px; height: 60px; border-radius: 16px; background: ${primaryColor}20; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">ניסיון מוכח</h3>
          <p style="opacity: 0.7;">שנים של ניסיון בתחום מבטיחים לכם שירות מקצועי ואיכותי</p>
        </div>
        <div class="card">
          <div style="width: 60px; height: 60px; border-radius: 16px; background: ${primaryColor}20; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">לקוחות מרוצים</h3>
          <p style="opacity: 0.7;">מאות לקוחות שבעי רצון בחרו בנו ומספרים על החוויה שלהם</p>
        </div>
        <div class="card">
          <div style="width: 60px; height: 60px; border-radius: 16px; background: ${primaryColor}20; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">איכות ללא פשרות</h3>
          <p style="opacity: 0.7;">אנחנו מחויבים לאיכות הגבוהה ביותר בכל פרויקט</p>
        </div>
      </div>
    </div>
  </section>
  ` : ""}

  ${includeSections.services ? `
  <!-- Services Section -->
  <section id="services" class="section" style="background: ${backgroundColor === "#FFFFFF" ? "#F8F8F8" : "rgba(255,255,255,0.02)"};">
    <div class="container">
      <div style="text-align: center; margin-bottom: 60px;">
        <h2 style="font-size: 3rem; margin-bottom: 16px;">השירותים שלנו</h2>
        <p style="font-size: 1.1rem; opacity: 0.7; max-width: 600px; margin: 0 auto;">מגוון פתרונות מקצועיים המותאמים לצרכים שלכם</p>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
        ${services.map((service: any, i: number) => `
        <div class="card" style="text-align: center; padding: 40px;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px;">
            <span style="font-size: 2rem; color: white; font-weight: 800;">0${i + 1}</span>
          </div>
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">${service.title}</h3>
          <p style="opacity: 0.7;">${service.description}</p>
        </div>
        `).join("")}
      </div>
    </div>
  </section>
  ` : ""}

  ${includeSections.testimonials ? `
  <!-- Testimonials Section -->
  <section class="section">
    <div class="container">
      <div style="text-align: center; margin-bottom: 60px;">
        <h2 style="font-size: 3rem; margin-bottom: 16px;">מה הלקוחות שלנו אומרים</h2>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
        ${testimonials.map((t: any) => `
        <div class="card">
          <div style="display: flex; gap: 4px; margin-bottom: 16px;">
            ${[1,2,3,4,5].map(() => `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${primaryColor}" stroke="${primaryColor}">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            `).join("")}
          </div>
          <p style="font-size: 1.1rem; margin-bottom: 20px; opacity: 0.9;">"${t.text}"</p>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor}); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">${t.name[0]}</div>
            <div>
              <span style="font-weight: 600; display: block;">${t.name}</span>
              <span style="font-size: 0.85rem; opacity: 0.7;">${t.role || ''}</span>
            </div>
          </div>
        </div>
        `).join("")}
      </div>
    </div>
  </section>
  ` : ""}

  ${includeSections.contact ? `
  <!-- Contact Section -->
  <section id="contact" class="section" style="background: ${backgroundColor === "#FFFFFF" ? "#F8F8F8" : "rgba(255,255,255,0.02)"};">
    <div class="container">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 60px; align-items: center;">
        <div>
          <h2 style="font-size: 3rem; margin-bottom: 24px;">צרו איתנו קשר</h2>
          <p style="font-size: 1.1rem; opacity: 0.7; margin-bottom: 40px;">נשמח לשמוע מכם ולעזור בכל שאלה</p>
          <div style="display: flex; flex-direction: column; gap: 24px;">
            ${formData.phone ? `
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 50px; height: 50px; border-radius: 12px; background: ${primaryColor}20; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <p style="opacity: 0.6; font-size: 0.9rem;">טלפון</p>
                <p style="font-weight: 600; font-size: 1.1rem;" dir="ltr">${formData.phone}</p>
              </div>
            </div>
            ` : ""}
            ${formData.email ? `
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 50px; height: 50px; border-radius: 12px; background: ${primaryColor}20; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p style="opacity: 0.6; font-size: 0.9rem;">אימייל</p>
                <p style="font-weight: 600; font-size: 1.1rem;" dir="ltr">${formData.email}</p>
              </div>
            </div>
            ` : ""}
            ${formData.address ? `
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 50px; height: 50px; border-radius: 12px; background: ${primaryColor}20; display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${primaryColor}" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p style="opacity: 0.6; font-size: 0.9rem;">כתובת</p>
                <p style="font-weight: 600; font-size: 1.1rem;">${formData.address}</p>
              </div>
            </div>
            ` : ""}
          </div>
        </div>
        <div class="card" style="padding: 40px;">
          <form style="display: flex; flex-direction: column; gap: 20px;">
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">שם מלא</label>
              <input type="text" name="name" class="input" placeholder="הזינו את שמכם" required style="text-align: right; direction: rtl;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">אימייל</label>
              <input type="email" name="email" class="input" placeholder="אימייל" style="text-align: right; direction: rtl;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">טלפון</label>
              <input type="tel" name="phone" class="input" placeholder="מספר הטלפון שלכם" required style="text-align: right; direction: rtl;">
            </div>
            <div>
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">הודעה</label>
              <textarea name="message" class="input" rows="4" placeholder="במה נוכל לעזור?" required style="resize: none; text-align: right; direction: rtl;"></textarea>
            </div>
            <button type="submit" class="btn-primary" style="width: 100%; justify-content: center;">שלח הודעה</button>
          </form>
        </div>
      </div>
    </div>
  </section>
  ` : ""}

  ${includeSections.cta ? `
  <!-- Final CTA -->
  <section class="section" style="background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15);">
    <div class="container" style="text-align: center;">
      <h2 style="font-size: 3rem; margin-bottom: 24px;">מוכנים להתחיל?</h2>
      <p style="font-size: 1.25rem; opacity: 0.7; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">צרו איתנו קשר עוד היום ונתחיל לעבוד ביחד</p>
      <button class="btn-primary" style="font-size: 1.25rem; padding: 18px 48px;">
        ${ctaText}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
    </div>
  </section>
  ` : ""}

  <!-- Footer -->
  <footer style="padding: 60px 0 30px; border-top: 1px solid ${backgroundColor === "#FFFFFF" ? "#E5E5E5" : "rgba(255,255,255,0.05)"};">
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; margin-bottom: 40px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${logoUrl ? `<img src="${logoUrl}" alt="${formData.businessName}" style="height: 36px; width: auto;">` : ""}
          <span style="font-size: 1.25rem; font-weight: 700;">${formData.businessName}</span>
        </div>
        <div style="display: flex; gap: 16px;">
          ${socialLinks.whatsapp ? `
          <a href="https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, "")}" target="_blank" style="width: 44px; height: 44px; border-radius: 12px; background: #25D366; display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
          ` : ""}
          ${socialLinks.facebook ? `
          <a href="${socialLinks.facebook}" target="_blank" style="width: 44px; height: 44px; border-radius: 12px; background: ${backgroundColor === "#FFFFFF" ? "#E5E5E5" : "rgba(255,255,255,0.1)"}; display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="${textColor}">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          ` : ""}
          ${socialLinks.instagram ? `
          <a href="${socialLinks.instagram}" target="_blank" style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          ` : ""}
        </div>
      </div>
      <div style="text-align: center; opacity: 0.5; font-size: 0.9rem;">
        <p>© ${new Date().getFullYear()} ${formData.businessName}. כל הזכויות שמורות.</p>
      </div>
    </div>
  </footer>

  ${socialLinks.whatsapp ? `
  <!-- WhatsApp Float Button -->
  <a href="https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, "")}" target="_blank" style="position: fixed; bottom: 24px; left: 24px; width: 60px; height: 60px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(37,211,102,0.4); z-index: 1000; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
  ` : ""}

  <script>
    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function() {
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    });
  </script>

  <!-- Back to PageFlow Button -->
  <a href="https://pageflow.justintime.co.il" target="_blank" style="
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #8BDBAB;
    color: #0A0A0A;
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 9999;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.4)';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.3)';">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 12H5M12 19l-7-7 7-7"/>
    </svg>
    נוצר ב-PageFlow
  </a>
</body>
</html>`
}

export function PageFlowLanding() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessNameEn: "",
    description: "",
    targetAudience: "",
    action: "",
    phone: "",
    email: "",
    address: "",
  })

  // Customization state
  const [customization, setCustomization] = useState<CustomizationOptions>({
    primaryColor: "#8BDBAB",
    secondaryColor: "#1A1A1A",
    backgroundColor: "#0A0A0A",
    textColor: "#FFFFFF",
    accentColor: "#8BDBAB",
    fontFamily: "Heebo",
    headingFont: "Heebo",
    borderRadius: 12,
    buttonStyle: "rounded",
    logoUrl: null,
    faviconUrl: null,
    heroStyle: "centered",
    includeSections: {
      hero: true,
      features: false,
      about: true,
      services: true,
      testimonials: true,
      gallery: false,
      pricing: false,
      faq: false,
      contact: true,
      cta: true,
    },
    customCss: "",
    referenceUrl: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
      whatsapp: "",
    },
  })

  // UI state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [previewDevice, setPreviewDevice] = useState<DeviceType>("desktop")
  const [activeTab, setActiveTab] = useState("content")
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [showContactPrompt, setShowContactPrompt] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadData, setLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [pricingFormData, setPricingFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  const [pricingSubmitted, setPricingSubmitted] = useState(false)
  const [showEmbedDialog, setShowEmbedDialog] = useState(false)

  const { scrollY } = useScroll()
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.95)"])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const generated = localStorage.getItem("pageflow_generated")
    if (generated === "true") {
      setHasGenerated(true)
    }
  }, [])

  // Track page visit
  useEffect(() => {
    sendNotification('page_visit', {
      businessName: 'N/A',
      referrer: typeof document !== 'undefined' ? (document.referrer || 'direct') : 'direct',
    })
  }, [])

  // Handle form submission
  const handleGenerate = async () => {
    if (!formData.businessName || !formData.description) {
      return
    }

    // Check if already generated
    if (hasGenerated) {
      setShowContactPrompt(true)
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    // Send notification about generation start
    sendNotification('generation_started', {
      ...formData,
      primaryColor: customization.primaryColor,
      whatsapp: customization.socialLinks.whatsapp,
      sections: Object.entries(customization.includeSections)
        .filter(([_, v]) => v)
        .map(([k]) => k)
        .join(', '),
    })

    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 300)

    try {
      // Call Gemini API for AI-generated content
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.businessName,
          description: formData.description,
          targetAudience: formData.targetAudience,
          action: formData.action,
          includeSections: customization.includeSections
        })
      })

      let aiContent = null
      
      if (response.ok) {
        const data = await response.json()
        aiContent = data.content
        console.log('AI Content generated:', aiContent)
      } else {
        console.warn('AI generation failed, using fallback content')
      }

      // Generate HTML with AI content (or fallback to template)
      const html = generateLandingPageHTML(formData, customization, uploadedImages, aiContent)
      setGeneratedCode(html)
      setGenerationProgress(100)
      clearInterval(progressInterval)

      // Set generation limit
      localStorage.setItem("pageflow_generated", "true")
      setHasGenerated(true)
      setShowLeadForm(true)

      // Send notification about generation complete
      sendNotification('generation_completed', {
        ...formData,
        primaryColor: customization.primaryColor,
        whatsapp: customization.socialLinks.whatsapp,
        sections: Object.entries(customization.includeSections)
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .join(', '),
      })
    } catch (error) {
      console.error('Generation error:', error)
      // Fallback to template-only generation
      const html = generateLandingPageHTML(formData, customization, uploadedImages, null)
      setGeneratedCode(html)
      setGenerationProgress(100)
      clearInterval(progressInterval)
      setHasGenerated(true)
      setShowLeadForm(true)
    } finally {
      setIsGenerating(false)
    }
  }


  // Handle image upload
  const handleImageUpload = (file: File, url: string) => {
    const newImage: UploadedImage = {
      id: Date.now().toString(),
      name: file.name,
      url,
      size: file.size,
    }
    setUploadedImages((prev) => [...prev, newImage])
  }

  // Handle logo upload
  const handleLogoUpload = (file: File, url: string) => {
    setCustomization((prev) => ({ ...prev, logoUrl: url }))
  }

  // Copy code to clipboard
  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download HTML file
  const handleDownload = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.businessNameEn || formData.businessName || "landing-page"}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Reset generator
  const handleReset = () => {
    setGeneratedCode(null)
    setGenerationProgress(0)
  }

  // Send notification email via Web3Forms
  const sendNotification = async (action: string, data: Record<string, any>) => {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '6c06646b-04d2-4191-9230-b883e50f789e',
          subject: `PageFlow: ${action}`,
          from_name: 'PageFlow',
          action_type: action,
          timestamp: new Date().toLocaleString('he-IL'),
          business_name: data.businessName || 'לא צוין',
          business_name_en: data.businessNameEn || 'N/A',
          description: data.description || 'לא צוין',
          target_audience: data.targetAudience || 'לא צוין',
          cta_action: data.action || 'לא צוין',
          phone: data.phone || 'לא צוין',
          email: data.email || 'לא צוין',
          address: data.address || 'לא צוין',
          primary_color: data.primaryColor || '#8BDBAB',
          whatsapp: data.whatsapp || 'לא צוין',
          sections_enabled: data.sections || 'לא צוין',
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
          page_url: typeof window !== 'undefined' ? window.location.href : 'N/A',
        })
      })
      console.log('Notification sent successfully')
    } catch (error) {
      console.error('Failed to send notification:', error)
    }
  }

  // Submit lead form via Web3Forms
  const submitLead = async () => {
    try {
      // Send notification to Alon with lead details
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '6c06646b-04d2-4191-9230-b883e50f789e',
          subject: `🚀 ליד חדש: ${formData.businessName}`,
          from_name: leadData.name,
          action_type: 'ליד חדש + יצירת דף',
          business_name: formData.businessName || 'לא צוין',
          business_name_en: formData.businessNameEn || 'לא צוין',
          target_audience: formData.targetAudience || 'לא צוין',
          description: formData.description || 'לא צוין',
          lead_name: leadData.name,
          lead_phone: leadData.phone,
          lead_email: leadData.email || 'לא צוין',
          lead_message: leadData.message || 'ללא הודעה',
          phone: formData.phone || 'לא צוין',
          email: formData.email || 'לא צוין',
          whatsapp: customization.socialLinks.whatsapp || 'לא צוין',
          primary_color: customization.accentColor || customization.primaryColor,
          sections_enabled: Object.entries(customization.includeSections)
            .filter(([_, v]) => v)
            .map(([k]) => k)
            .join(', '),
          page_url: `https://pageflow.justintime.co.il/${formData.businessNameEn || 'preview'}`,
          timestamp: new Date().toLocaleString('he-IL'),
        })
      })

      setLeadSubmitted(true)
    } catch (error) {
      console.error('Lead submission error:', error)
      setLeadSubmitted(true)
    }
  }


  // Generate embed code for WordPress
  const generateEmbedCode = () => {
    if (!generatedCode) return ''
    
    // Create a minified version for embedding
    const encodedHTML = encodeURIComponent(generatedCode)
    
    return `<!-- PageFlow Landing Page Embed -->
<iframe 
  src="data:text/html;charset=utf-8,${encodedHTML}"
  style="width: 100%; height: 100vh; border: none;"
  title="${formData.businessName || 'Landing Page'}"
></iframe>`
  }

  // Generate standalone HTML file content
  const generateStandaloneEmbed = () => {
    return generatedCode || ''
  }

  // Apply color preset
  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setCustomization((prev) => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
      textColor: preset.text,
    }))
  }

  const scrollToBuilder = () => {
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
        {/* Noise texture */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Header */}
        <motion.header
          style={{ backgroundColor: headerBg }}
          className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5"
        >
          <div className="container mx-auto flex items-center justify-between px-6 py-4" dir="rtl">
            <div className="flex items-center gap-3">
              <img 
                src="/images/jit-logo.png" 
                alt="Just In Time" 
                className="h-8 w-auto"
              />
              <div className="h-5 w-[1px] bg-white/20" />
              <span className="text-xl font-black text-[#8BDBAB]">PageFlow</span>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <button onClick={scrollToBuilder} className="text-[#9CA3AF] hover:text-white font-hebrew text-sm transition-colors">
                נסו עכשיו
              </button>
              <a href="#features" className="text-[#9CA3AF] hover:text-white font-hebrew text-sm transition-colors">
                תכונות
              </a>
              <a href="#pricing" className="text-[#9CA3AF] hover:text-white font-hebrew text-sm transition-colors">
                מחירים
              </a>
              <MagneticButton
                onClick={scrollToBuilder}
                className="bg-[#8BDBAB] hover:bg-[#9FE4BC] text-[#0A0A0A] font-hebrew font-bold"
                size="sm"
              >
                התחל בחינם
              </MagneticButton>
            </nav>

            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-[#0A0A0A]/98 border-t border-white/5"
                dir="rtl"
              >
                <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
                  <button onClick={() => { scrollToBuilder(); setMobileMenuOpen(false); }} className="text-right py-2 text-white font-hebrew">
                    נסו עכשיו
                  </button>
                  <a href="#features" className="text-right py-2 text-[#9CA3AF] font-hebrew">תכונות</a>
                  <a href="#pricing" className="text-right py-2 text-[#9CA3AF] font-hebrew">מחירים</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>

        {/* Hero Section - Compact */}
        <section className="relative pt-28 pb-16 px-6">
          <div className="container mx-auto relative z-10" dir="rtl">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-[#8BDBAB]/10 text-[#8BDBAB] border-[#8BDBAB]/20 font-hebrew mb-6">
                  <Sparkles className="w-4 h-4 ml-2" />
                  חינם לשימוש
                </Badge>

                <h1 className="text-4xl md:text-6xl font-black font-hebrew mb-6 leading-tight">
                  צור דף נחיתה מקצועי
                  <br />
                  <span className="text-[#8BDBAB]">בדקות ספורות</span>
                </h1>

                <p className="text-lg md:text-xl text-[#9CA3AF] font-hebrew mb-8 max-w-2xl mx-auto">
                  התאמה אישית מלאה: צבעים, לוגו, תמונות, וכל מה שצריך לדף נחיתה מושלם
                </p>

                <MagneticButton
                  onClick={scrollToBuilder}
                  size="lg"
                  className="bg-[#8BDBAB] hover:bg-[#9FE4BC] text-[#0A0A0A] font-hebrew font-bold text-lg px-10 py-7 rounded-xl shadow-[0_0_40px_rgba(139,219,171,0.3)]"
                >
                  <span className="flex items-center gap-2">
                    התחל עכשיו
                    <ArrowDown className="w-5 h-5" />
                  </span>
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </section>


        {/* Builder Section */}
        <section id="builder" className="py-12 px-4 md:px-6">
          <div className="container mx-auto" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black font-hebrew mb-4">בנה את דף הנחיתה שלך</h2>
              <p className="text-lg text-[#9CA3AF] font-hebrew">מלא את הפרטים והתאם אישית לפי הצורך</p>
            </motion.div>

            <div className="flex flex-col xl:flex-row gap-6 max-w-[1920px] mx-auto px-2">
              {/* Left Panel - Form & Customization */}
              <div className="w-full xl:w-[400px] xl:flex-shrink-0">
                <div className="sticky top-24">
                  <Card className="bg-white/[0.02] border-white/10 overflow-hidden">
                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full focus:outline-none" dir="rtl">
                      <TabsList className="grid grid-cols-4 !bg-[#1A1A1A] p-1 rounded-xl gap-1 border border-white/10 focus:outline-none h-auto w-full" dir="rtl">
                        {[
                          { id: "content", icon: MessageSquare, label: "תוכן" },
                          { id: "design", icon: Palette, label: "עיצוב" },
                          { id: "sections", icon: Layout, label: "מקטעים" },
                          { id: "media", icon: ImageIcon, label: "מדיה" },
                        ].map((tab) => (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg !text-[#9CA3AF] !bg-transparent data-[state=active]:!bg-[#252525] data-[state=active]:!text-white transition-all font-hebrew text-sm focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 border-0 shadow-none h-auto"
                          >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-xs">{tab.label}</span>
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <ScrollArea className="h-[600px]">
                        {/* Content Tab */}
                        <TabsContent value="content" className="p-6 space-y-5 m-0" dir="rtl">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">שם העסק *</Label>
                            <Input
                              value={formData.businessName}
                              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                              placeholder="לדוגמה: סטודיו לעיצוב גרפי"
                              className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 font-hebrew h-12 text-right focus:border-[#8BDBAB]"
                              dir="rtl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">שם באנגלית (לכתובת)</Label>
                            <Input
                              value={formData.businessNameEn}
                              onChange={(e) => setFormData({ ...formData, businessNameEn: e.target.value })}
                              placeholder="my-business"
                              className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 font-mono h-12 text-left focus:border-[#8BDBAB]"
                              dir="ltr"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">תיאור העסק *</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              placeholder="ספרו על העסק שלכם - מה אתם עושים, מה הייחודיות שלכם..."
                              className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 font-hebrew min-h-[100px] text-right focus:border-[#8BDBAB]"
                              dir="rtl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">קהל יעד</Label>
                            <Input
                              value={formData.targetAudience}
                              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                              placeholder="לדוגמה: בעלי עסקים קטנים"
                              className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 font-hebrew h-12 text-right focus:border-[#8BDBAB]"
                              dir="rtl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">פעולה רצויה</Label>
                            <Select
                              value={formData.action}
                              onValueChange={(value) => setFormData({ ...formData, action: value })}
                            >
                              <SelectTrigger className="bg-[#252525] border-white/10 text-white font-hebrew h-12 text-right" dir="rtl">
                                <SelectValue placeholder="בחרו פעולה" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#252525] border-white/10" dir="rtl">
                                <SelectItem value="contact" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">יצירת קשר</SelectItem>
                                <SelectItem value="signup" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">הרשמה</SelectItem>
                                <SelectItem value="purchase" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">קנייה</SelectItem>
                                <SelectItem value="booking" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">הזמנת פגישה</SelectItem>
                                <SelectItem value="quote" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">קבלת הצעת מחיר</SelectItem>
                                <SelectItem value="download" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">הורדה</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator className="my-6" />

                          <div className="space-y-4">
                            <h4 className="font-hebrew font-semibold text-white">פרטי קשר</h4>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">טלפון</Label>
                              <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="050-0000000"
                                className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-12 text-left focus:border-[#8BDBAB]"
                                dir="ltr"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">אימייל</Label>
                              <Input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-12 text-left focus:border-[#8BDBAB]"
                                dir="ltr"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">כתובת</Label>
                              <Input
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="רחוב, עיר"
                                className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 font-hebrew h-12 text-right focus:border-[#8BDBAB]"
                                dir="rtl"
                              />
                            </div>
                          </div>

                          <Separator className="my-6" />

                          <div className="space-y-4">
                            <h4 className="font-hebrew font-semibold text-white">רשתות חברתיות</h4>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs text-[#E5E5E5] font-hebrew">וואטסאפ</Label>
                                <Input
                                  value={customization.socialLinks.whatsapp}
                                  onChange={(e) => setCustomization({
                                    ...customization,
                                    socialLinks: { ...customization.socialLinks, whatsapp: e.target.value }
                                  })}
                                  placeholder="972501234567"
                                  className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-10 text-sm text-left focus:border-[#8BDBAB]"
                                  dir="ltr"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-xs text-[#E5E5E5] font-hebrew">פייסבוק</Label>
                                <Input
                                  value={customization.socialLinks.facebook}
                                  onChange={(e) => setCustomization({
                                    ...customization,
                                    socialLinks: { ...customization.socialLinks, facebook: e.target.value }
                                  })}
                                  placeholder="https://facebook.com/..."
                                  className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-10 text-sm text-left focus:border-[#8BDBAB]"
                                  dir="ltr"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-xs text-[#E5E5E5] font-hebrew">אינסטגרם</Label>
                                <Input
                                  value={customization.socialLinks.instagram}
                                  onChange={(e) => setCustomization({
                                    ...customization,
                                    socialLinks: { ...customization.socialLinks, instagram: e.target.value }
                                  })}
                                  placeholder="https://instagram.com/..."
                                  className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-10 text-sm text-left focus:border-[#8BDBAB]"
                                  dir="ltr"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label className="text-xs text-[#E5E5E5] font-hebrew">לינקדאין</Label>
                                <Input
                                  value={customization.socialLinks.linkedin}
                                  onChange={(e) => setCustomization({
                                    ...customization,
                                    socialLinks: { ...customization.socialLinks, linkedin: e.target.value }
                                  })}
                                  placeholder="https://linkedin.com/..."
                                  className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-10 text-sm text-left focus:border-[#8BDBAB]"
                                  dir="ltr"
                                />
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        {/* Design Tab */}
                        <TabsContent value="design" className="p-6 space-y-6 m-0" dir="rtl">
                          {/* Color Presets */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">ערכות צבעים מוכנות</Label>
                            <div className="grid grid-cols-4 gap-2">
                              {colorPresets.map((preset) => (
                                <Tooltip key={preset.name}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => applyColorPreset(preset)}
                                      className="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-white/30 transition-all"
                                      style={{ background: preset.bg }}
                                    >
                                      <div
                                        className="absolute inset-2 rounded-lg"
                                        style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                                      />
                                      {customization.primaryColor === preset.primary && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                          <Check className="w-5 h-5 text-white" />
                                        </div>
                                      )}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="font-hebrew">{preset.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          </div>

                          {/* Custom Colors */}
                          <div className="grid grid-cols-2 gap-4">
                            <ColorPicker
                              label="צבע ראשי"
                              value={customization.primaryColor}
                              onChange={(color) => setCustomization({ ...customization, primaryColor: color })}
                            />
                            <ColorPicker
                              label="צבע משני"
                              value={customization.secondaryColor}
                              onChange={(color) => setCustomization({ ...customization, secondaryColor: color })}
                            />
                            <ColorPicker
                              label="צבע רקע"
                              value={customization.backgroundColor}
                              onChange={(color) => setCustomization({ ...customization, backgroundColor: color })}
                            />
                            <ColorPicker
                              label="צבע טקסט"
                              value={customization.textColor}
                              onChange={(color) => setCustomization({ ...customization, textColor: color })}
                            />
                          </div>

                          <Separator />

                          {/* Typography */}
                          <div className="space-y-4">
                            <h4 className="font-hebrew font-semibold text-white">טיפוגרפיה</h4>
                            
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">פונט ראשי</Label>
                              <Select
                                value={customization.fontFamily}
                                onValueChange={(value) => setCustomization({ ...customization, fontFamily: value })}
                              >
                                <SelectTrigger className="bg-[#252525] border-white/10 text-white h-12 text-right" dir="rtl">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#252525] border-white/10" dir="rtl">
                                  {fontOptions.map((font) => (
                                    <SelectItem key={font.value} value={font.value} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right">
                                      <span style={{ fontFamily: font.label }}>{font.label}</span>
                                      {font.hebrew && <Badge className="mr-2 text-xs">עברית</Badge>}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <Separator />

                          {/* Hero Style */}
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">סגנון</Label>
                            <Select
                              value={customization.heroStyle}
                              onValueChange={(value) => setCustomization({ ...customization, heroStyle: value as any })}
                            >
                              <SelectTrigger className="bg-[#252525] border-white/10 text-white h-12 text-right" dir="rtl">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-[#252525] border-white/10" dir="rtl">
                                <SelectItem value="centered" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">
                                  ממורכז
                                </SelectItem>
                                <SelectItem value="split" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">
                                  מפוצל
                                </SelectItem>
                                <SelectItem value="fullwidth" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white text-right font-hebrew">
                                  רוחב מלא
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Separator />

                          {/* Button Style */}
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">סגנון כפתורים</Label>
                            <div className="flex gap-2">
                              {[
                                { value: "rounded", label: "מעוגל" },
                                { value: "pill", label: "גלולה" },
                                { value: "square", label: "מרובע" },
                              ].map((style) => (
                                <button
                                  key={style.value}
                                  onClick={() => setCustomization({ ...customization, buttonStyle: style.value as any })}
                                  className={`
                                    flex-1 py-3 px-4 font-hebrew text-sm transition-all
                                    ${style.value === "rounded" ? "rounded-xl" : style.value === "pill" ? "rounded-full" : "rounded-none"}
                                    ${customization.buttonStyle === style.value
                                      ? "bg-[#8BDBAB] text-[#0A0A0A]"
                                      : "bg-white/5 text-white border border-white/10 hover:border-white/30"
                                    }
                                  `}
                                >
                                  {style.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Border Radius */}
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">עיגול פינות</Label>
                              <span className="text-sm text-[#8BDBAB]">{customization.borderRadius}px</span>
                            </div>
                            <Slider
                              value={[customization.borderRadius]}
                              onValueChange={([value]) => setCustomization({ ...customization, borderRadius: value })}
                              min={0}
                              max={24}
                              step={2}
                              className="w-full"
                            />
                          </div>
                        </TabsContent>

                        {/* Sections Tab */}
                        <TabsContent value="sections" className="p-6 space-y-3 m-0" dir="rtl">
                          <div className="bg-[#252525]/50 rounded-lg p-3 border border-white/5 mb-4">
                            <p className="text-[#9CA3AF] font-hebrew text-sm text-center">
                              בחרו אילו מקטעים יופיעו בדף הנחיתה
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            {Object.entries(customization.includeSections).map(([key, value]) => {
                              const labels: Record<string, string> = {
                                hero: "כותרת ראשית (Hero)",
                                features: "תכונות",
                                about: "אודות",
                                services: "שירותים",
                                testimonials: "המלצות",
                                gallery: "גלריה",
                                pricing: "מחירים",
                                faq: "שאלות נפוצות",
                                contact: "צור קשר",
                                cta: "קריאה לפעולה",
                              }
                              return (
                                <div
                                  key={key}
                                  className="flex items-center justify-between p-3 bg-[#0A0A0A] rounded-lg border border-white/5 hover:border-white/10 transition-all"
                                >
                                  <Label className="text-[#E5E5E5] font-hebrew cursor-pointer text-sm">{labels[key]}</Label>
                                  <Switch
                                    checked={value}
                                    onCheckedChange={(checked) =>
                                      setCustomization({
                                        ...customization,
                                        includeSections: { ...customization.includeSections, [key]: checked },
                                      })
                                    }
                                    className="data-[state=checked]:bg-[#8BDBAB] data-[state=unchecked]:bg-[#333333]"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media" className="p-6 space-y-6 m-0" dir="rtl">
                          <FileUpload
                            label="לוגו העסק"
                            onUpload={handleLogoUpload}
                            currentFile={customization.logoUrl}
                            onRemove={() => setCustomization({ ...customization, logoUrl: null })}
                            maxSize={500000}
                          />

                          <Separator />

                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">קישור לאתר קיים (להשראה)</Label>
                            <div className="flex gap-2">
                              <Input
                                value={customization.referenceUrl}
                                onChange={(e) => setCustomization({ ...customization, referenceUrl: e.target.value })}
                                placeholder="https://example.com"
                                className="bg-[#252525] border-white/10 text-white placeholder:text-white/40 h-12 flex-1 text-left focus:border-[#8BDBAB]"
                                dir="ltr"
                              />
                              {customization.referenceUrl && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-12 w-12 border-white/10"
                                  onClick={() => window.open(customization.referenceUrl, "_blank")}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-[#9CA3AF]/60 font-hebrew">הוסיפו קישור לאתר קיים שאוהבים כדי לקבל השראה לעיצוב</p>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="text-sm font-medium text-[#E5E5E5] font-hebrew text-right block w-full">תמונות נוספות</Label>
                              <span className="text-xs text-[#9CA3AF]/60">מקס׳ 500KB לתמונה</span>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              {uploadedImages.map((img) => (
                                <div key={img.id} className="relative group">
                                  <div className="aspect-video rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                  </div>
                                  <button
                                    onClick={() => setUploadedImages((prev) => prev.filter((i) => i.id !== img.id))}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              
                              {uploadedImages.length < 9 && (
                                <div
                                  onClick={() => document.getElementById("multi-image-upload")?.click()}
                                  className="aspect-video rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
                                >
                                  <Plus className="w-6 h-6 text-[#9CA3AF]" />
                                  <span className="text-xs text-[#9CA3AF] font-hebrew">הוסף תמונה</span>
                                </div>
                              )}
                              <input
                                id="multi-image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                  const files = e.target.files
                                  if (!files) return
                                  
                                  Array.from(files).forEach(file => {
                                    if (file.size > 500 * 1024) {
                                      alert('התמונה גדולה מדי. מקסימום 500KB')
                                      return
                                    }
                                    
                                    if (!file.type.startsWith('image/')) {
                                      alert('נא להעלות קובץ תמונה בלבד')
                                      return
                                    }
                                    
                                    handleImageUpload(file, URL.createObjectURL(file))
                                  })
                                  
                                  // Reset input to allow same file upload again
                                  e.target.value = ''
                                }}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </ScrollArea>
                    </Tabs>

                    {/* Generate Button */}
                    <div className="p-6 border-t border-white/10 bg-white/[0.02]">
                      <Button
                        onClick={handleGenerate}
                        disabled={isGenerating || !formData.businessName || !formData.description}
                        className={`w-full font-bold font-hebrew py-6 text-lg rounded-xl transition-all disabled:opacity-50 ${
                          hasGenerated 
                            ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                            : "bg-[#8BDBAB] hover:bg-[#9FE4BC] text-[#0A0A0A]"
                        }`}
                      >
                        {isGenerating ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            מייצר את הדף...
                          </span>
                        ) : hasGenerated ? (
                          <span className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            צור קשר לדפים נוספים
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            צור דף נחיתה
                          </span>
                        )}
                      </Button>
                      
                      {isGenerating && (
                        <div className="mt-4">
                          <Progress value={generationProgress} className="h-2" />
                          <p className="text-xs text-[#9CA3AF] text-center mt-2 font-hebrew">
                            {generationProgress < 30 && "מנתח את התוכן..."}
                            {generationProgress >= 30 && generationProgress < 60 && "בונה את המבנה..."}
                            {generationProgress >= 60 && generationProgress < 90 && "מוסיף עיצוב..."}
                            {generationProgress >= 90 && "מסיים..."}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="flex-1 min-w-0">
                <Card className="bg-[#1A1A1A] border-white/10 overflow-hidden w-full h-full">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10" dir="rtl">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-hebrew text-[#9CA3AF]">תצוגה מקדימה</span>
                      
                      {/* Device Toggle */}
                      <div className="flex bg-white/5 rounded-lg p-1">
                        {(["desktop", "tablet", "mobile"] as DeviceType[]).map((device) => {
                          const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone }
                          const Icon = icons[device]
                          return (
                            <Tooltip key={device}>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => setPreviewDevice(device)}
                                  className={`p-2 rounded-md transition-all ${
                                    previewDevice === device
                                      ? "bg-[#8BDBAB] text-[#0A0A0A]"
                                      : "text-[#9CA3AF] hover:text-white"
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-hebrew">{deviceDimensions[device].label}</p>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                      </div>
                    </div>

                     {/* Action Buttons */}
                     {generatedCode && (
                      <div className="flex gap-2 flex-row-reverse">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyCode}
                          className="bg-[#252525] border-white/10 text-white hover:bg-[#303030] hover:text-white font-hebrew"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          העתק קוד
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCodeDialog(true)}
                          className="bg-[#252525] border-white/10 text-white hover:bg-[#303030] hover:text-white font-hebrew"
                        >
                          <Code className="w-4 h-4 mr-1" />
                          צפה בקוד
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          className="bg-[#252525] border-white/10 text-white hover:bg-[#303030] hover:text-white font-hebrew"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          הורד HTML
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEmbedDialog(true)}
                          className="bg-[#252525] border-white/10 text-white hover:bg-[#303030] hover:text-white font-hebrew"
                        >
                          <Code className="w-4 h-4 mr-1" />
                          הטמעה
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (generatedCode) {
                              const blob = new Blob([generatedCode], { type: 'text/html' })
                              const url = URL.createObjectURL(blob)
                              window.open(url, '_blank')
                            }
                          }}
                          className="!bg-[#8BDBAB] !border-[#8BDBAB] !text-[#0A0A0A] hover:!bg-[#7BC99A] hover:!text-[#0A0A0A] font-hebrew font-bold"
                          >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          פתח בטאב חדש
                        </Button>
                      </div>
                    )}
                  </div>


                  {/* Preview Content */}
                  {generatedCode ? (
                    <div className="relative w-full flex justify-center bg-[#0A0A0A]" style={{ height: '700px', minHeight: '700px', padding: '20px' }}>
                      <iframe 
                        srcDoc={generatedCode}
                        className="border-0 bg-white transition-all duration-300"
                        title="Preview"
                        style={{
                          width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '390px',
                          height: '100%',
                          maxWidth: '100%',
                          boxShadow: previewDevice !== 'desktop' ? '0 0 30px rgba(0,0,0,0.5)' : 'none',
                          borderRadius: previewDevice !== 'desktop' ? '12px' : '0'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative w-full bg-[#0A0A0A] flex flex-col items-center justify-center" style={{ height: '700px', minHeight: '700px' }}>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-[#8BDBAB]/20 blur-3xl rounded-full scale-150" />
                        {previewDevice === 'desktop' && <Monitor className="relative w-20 h-20 text-[#8BDBAB]/50" />}
                        {previewDevice === 'tablet' && <Tablet className="relative w-20 h-20 text-[#8BDBAB]/50" />}
                        {previewDevice === 'mobile' && <Smartphone className="relative w-20 h-20 text-[#8BDBAB]/50" />}
                      </motion.div>
                      <p className="text-white font-hebrew text-xl mt-8">
                        {previewDevice === 'desktop' && 'תצוגת מחשב'}
                        {previewDevice === 'tablet' && 'תצוגת טאבלט'}
                        {previewDevice === 'mobile' && 'תצוגת מובייל'}
                      </p>
                      <p className="text-[#9CA3AF]/60 font-hebrew text-sm mt-2">מלאו את הפרטים ולחצו על ״צור דף נחיתה״</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-[#0D0D0D]/50">
          <div className="container mx-auto" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-[#8BDBAB]/10 text-[#8BDBAB] border-[#8BDBAB]/20 font-hebrew mb-6">
                הכל כלול
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black font-hebrew mb-6">תכונות מתקדמות</h2>
              <p className="text-xl text-[#9CA3AF] font-hebrew max-w-2xl mx-auto">
                כל מה שצריך ליצירת דף נחיתה מנצח
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Palette, title: "התאמה אישית מלאה", desc: "צבעים, פונטים, ועיצוב לפי הסגנון שלכם", badge: "עיצוב" },
                { icon: Smartphone, title: "רספונסיבי מושלם", desc: "נראה מצוין בכל גודל מסך", badge: "רספונסיבי" },
                { icon: Zap, title: "מהירות טעינה", desc: "קוד נקי וקל לטעינה מהירה", badge: "ביצועים" },
                { icon: Globe, title: "עברית מושלמת RTL", desc: "תמיכה מלאה בעברית מימין לשמאל", badge: "RTL" },
                { icon: ImageIcon, title: "העלאת מדיה", desc: "לוגו, תמונות, ומדיה בקלות", badge: "מדיה" },
                { icon: Code, title: "ייצוא קוד", desc: "הורידו את הקוד והשתמשו בו בכל מקום", badge: "קוד" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-[#1A1A1A] border-white/10 h-full hover:border-[#8BDBAB]/30 transition-all group p-8">
                    <Badge className="bg-[#8BDBAB]/10 text-[#8BDBAB] border-[#8BDBAB]/20 font-hebrew text-sm w-fit mb-6">
                      {feature.badge}
                    </Badge>
                    <feature.icon className="w-12 h-12 text-[#8BDBAB] mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="font-hebrew text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                    <p className="font-hebrew text-lg text-[#E5E5E5] leading-relaxed">{feature.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6">
          <div className="container mx-auto" dir="rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <Badge className="bg-[#8BDBAB]/10 text-[#8BDBAB] border-[#8BDBAB]/20 font-hebrew mb-6">
                תמחור
              </Badge>
              <h2 className="text-4xl md:text-5xl font-black font-hebrew mb-6">מחירים פשוטים ושקופים</h2>
              <p className="text-xl text-[#9CA3AF] font-hebrew">התחילו בחינם, שדרגו כשאתם מוכנים</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="bg-[#1A1A1A] border-white/10 h-full flex flex-col">
                  <CardHeader className="p-8 pb-6">
                    <CardTitle className="font-hebrew text-2xl font-bold text-white mb-2">חינם</CardTitle>
                    <CardDescription className="font-hebrew text-[#9CA3AF] text-base">מושלם להתחלה והתנסות</CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-black text-white">₪0</span>
                      <span className="text-[#9CA3AF] font-hebrew mr-2">/לתמיד</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 flex flex-col">
                    <Separator className="mb-8 bg-white/10" />
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "3 דפי נחיתה בחודש",
                        "כל התבניות",
                        "התאמה אישית מלאה",
                        "תמיכה קהילתית",
                        "ייצוא HTML",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 font-hebrew text-[#E5E5E5]">
                          <div className="w-5 h-5 rounded-full bg-[#8BDBAB]/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#8BDBAB]" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPlan('חינם')
                        setShowPricingModal(true)
                        sendNotification('pricing_click_free', formData)
                      }}
                      className="w-full border-white/20 text-white hover:bg-[#8BDBAB] hover:text-[#0A0A0A] hover:border-[#8BDBAB] font-hebrew py-6 text-lg bg-transparent rounded-xl mt-auto transition-all"
                    >
                      התחל בחינם
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pro Plan */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <Card className="bg-gradient-to-b from-[#8BDBAB]/10 to-[#1A1A1A] border-[#8BDBAB]/30 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8BDBAB] to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-[#8BDBAB] text-[#0A0A0A] font-hebrew font-bold px-3 py-1">
                    ⭐ הכי פופולרי
                  </Badge>
                  
                  <CardHeader className="p-8 pb-6 pt-12">
                    <CardTitle className="font-hebrew text-2xl font-bold text-white mb-2">Pro</CardTitle>
                    <CardDescription className="font-hebrew text-[#9CA3AF] text-base">לעסקים שרוצים להתבלט</CardDescription>
                    <div className="mt-6">
                      <span className="text-5xl font-black text-[#8BDBAB]">₪49</span>
                      <span className="text-[#9CA3AF] font-hebrew mr-2">/חודש</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 flex-1 flex flex-col">
                    <Separator className="mb-8 bg-white/10" />
                    <ul className="space-y-4 mb-8 flex-1">
                      {[
                        "דפי נחיתה ללא הגבלה",
                        "כל התבניות הפרימיום",
                        "ללא וואטרמארק",
                        "דומיין מותאם אישית",
                        "אנליטיקס מתקדם",
                        "תמיכה עדיפות 24/7",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 font-hebrew text-white">
                          <div className="w-5 h-5 rounded-full bg-[#8BDBAB]/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-[#8BDBAB]" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => {
                        setSelectedPlan('Pro - 49₪/חודש')
                        setShowPricingModal(true)
                        sendNotification('pricing_click_pro', formData)
                      }}
                      className="w-full bg-[#8BDBAB] hover:bg-[#9FE4BC] text-[#0A0A0A] font-hebrew font-bold py-6 text-lg rounded-xl shadow-[0_0_30px_rgba(139,219,171,0.3)] mt-auto"
                    >
                      התחל עם Pro
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#0A0A0A] py-12 px-6">
          <div className="container mx-auto" dir="rtl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img 
                  src="/images/jit-logo.png" 
                  alt="Just In Time" 
                  className="h-8 w-auto"
                />
                <div className="h-5 w-[1px] bg-white/20" />
                <span className="text-xl font-black text-[#8BDBAB]">PageFlow</span>
              </div>
              <p className="text-[#9CA3AF]/60 text-sm font-hebrew">
                © 2025 PageFlow. כל הזכויות שמורות.
              </p>
            </div>
          </div>
        </footer>

        {/* Code Dialog */}
        <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] bg-[#1A1A1A] border-white/10">
            <DialogHeader>
              <DialogTitle className="font-hebrew text-white">קוד HTML</DialogTitle>
              <DialogDescription className="font-hebrew text-[#9CA3AF]">
                העתיקו את הקוד או הורידו כקובץ HTML
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2 mb-4">
              <Button onClick={handleCopyCode} variant="outline" className="border-white/10 text-white">
                <Copy className="w-4 h-4 ml-2" />
                {copied ? "הועתק!" : "העתק"}
              </Button>
              <Button onClick={handleDownload} className="bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#9FE4BC]">
                <Download className="w-4 h-4 ml-2" />
                הורד קובץ
              </Button>
            </div>
            <ScrollArea className="h-[400px] rounded-lg border border-white/10 bg-[#0A0A0A]">
              <pre className="p-4 text-xs text-[#9CA3AF] font-mono whitespace-pre-wrap" dir="ltr">
                {generatedCode}
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Lead Form Dialog */}
        <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
          <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-lg" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center font-hebrew flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-[#8BDBAB]" />
                הדף שלך מוכן!
              </DialogTitle>
            </DialogHeader>

            {!leadSubmitted ? (
              <div className="space-y-4 py-4">
                <p className="text-center text-[#9CA3AF] font-hebrew">
                  השאירו פרטים ונשלח לכם את הדף + נעזור בהעלאה לאוויר
                </p>

                <div className="space-y-3">
                  <Input
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    placeholder="שם מלא *"
                    className="bg-[#252525] border-white/10 text-white h-12 text-right font-hebrew"
                    dir="rtl"
                  />
                  <Input
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                    placeholder="טלפון *"
                    className="bg-[#252525] border-white/10 text-white h-12 text-right font-hebrew"
                    dir="rtl"
                  />
                  <Input
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    placeholder="אימייל"
                    type="email"
                    className="bg-[#252525] border-white/10 text-white h-12 text-right placeholder:text-right font-hebrew"
                    dir="rtl"
                  />
                  <Textarea
                    value={leadData.message}
                    onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                    placeholder="הערות (אופציונלי)"
                    className="bg-[#252525] border-white/10 text-white min-h-[80px] text-right font-hebrew"
                    dir="rtl"
                  />
                </div>

                <Button
                  onClick={submitLead}
                  disabled={!leadData.name || !leadData.phone}
                  className="w-full h-12 bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A] font-bold font-hebrew"
                >
                  שלחו לי את הדף
                </Button>

                <Separator className="bg-white/10" />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCopyCode}
                    className="flex-1 bg-[#252525] border-white/10 text-white hover:bg-[#303030] hover:text-white font-hebrew"
                  >
                    <Copy className="w-4 h-4 ml-2" />
                    העתק קוד
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex-1 bg-[#252525] border-white/10 text-white hover:bg-[#303030] hover:text-white font-hebrew"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    הורד HTML
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-[#8BDBAB]/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-[#8BDBAB]" />
                </div>
                <h3 className="text-xl font-bold font-hebrew">תודה {leadData.name}!</h3>
                <p className="text-[#9CA3AF] font-hebrew">
                  נחזור אליך בהקדם עם הדף המושלם שלך
                </p>
                <Button
                  onClick={() => {
                    setShowLeadForm(false)
                    setLeadSubmitted(false)
                    setLeadData({ name: '', phone: '', email: '', message: '' })
                  }}
                  className="bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A] font-bold font-hebrew px-8"
                >
                  סגור
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Contact Prompt Dialog (for limit reached) */}
        <Dialog open={showContactPrompt} onOpenChange={setShowContactPrompt}>
          <DialogContent className="max-w-lg bg-[#1A1A1A] border-white/10" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-hebrew text-2xl text-white text-center mb-2">
                ⚡ הגעת למגבלת היצירה
              </DialogTitle>
              <DialogDescription className="font-hebrew text-[#9CA3AF] text-center text-base">
                כבר יצרת דף נחיתה אחד. צור איתנו קשר לקבלת דפים נוספים או שיפורים.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-6">
              <Separator className="bg-white/10" />
              
              {/* Prominent Email Section */}
              <div className="bg-gradient-to-br from-[#8BDBAB]/20 to-[#8BDBAB]/5 rounded-2xl p-6 text-center border border-[#8BDBAB]/30">
                <div className="w-16 h-16 rounded-full bg-[#8BDBAB]/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#8BDBAB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-hebrew text-white text-xl font-bold mb-2">צריכים עזרה או דפים נוספים?</p>
                <p className="font-hebrew text-[#9CA3AF] text-sm mb-4">צרו איתנו קשר ונשמח לעזור!</p>
                
                <a 
                  href="mailto:pageflow@justintime.co.il?subject=פנייה מ-PageFlow&body=שלום,%0A%0Aיצרתי דף נחיתה ב-PageFlow ואשמח לעזרה.%0A%0Aשם העסק: %0Aטלפון: %0A%0Aתודה!"
                  onClick={() => {
                    sendNotification('email_click', {
                      ...formData,
                      source: 'contact_dialog'
                    })
                  }}
                  className="block w-full bg-[#8BDBAB] hover:bg-[#9FE4BC] text-[#0A0A0A] font-bold font-hebrew py-4 px-6 rounded-xl transition-all hover:scale-[1.02] text-lg mb-3"
                >
                  pageflow@justintime.co.il
                </a>
                
                <div className="flex gap-3">
                  <a 
                    href="https://wa.me/972507877165?text=היי, יצרתי דף נחיתה ב-PageFlow ואשמח לעזרה"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      sendNotification('whatsapp_click', {
                        ...formData,
                        source: 'contact_dialog'
                      })
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3 px-4 rounded-xl transition-all font-hebrew"
                  >
                    <MessageCircle className="w-5 h-5" />
                    וואטסאפ
                  </a>
                  <a 
                    href="tel:050-7877165"
                    onClick={() => {
                      sendNotification('phone_click', {
                        ...formData,
                        source: 'contact_dialog'
                      })
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl transition-all font-hebrew border border-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    התקשרו
                  </a>
                </div>
              </div>
              
              <p className="text-center text-[#9CA3AF]/60 text-xs font-hebrew">
                נחזור אליכם תוך 24 שעות
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Floating Contact Button */}
        <motion.button
          onClick={() => setShowContactModal(true)}
          className="fixed bottom-6 left-6 z-50 bg-white/10 backdrop-blur-sm text-white p-3 rounded-xl shadow-lg hover:bg-white/20 transition-all border border-white/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="צור קשר"
        >
          <Mail className="w-5 h-5" />
        </motion.button>

        {/* Contact Modal */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center font-hebrew">
                צריכים עזרה?
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-6 space-y-4">
              <p className="text-center text-[#9CA3AF] font-hebrew">
                אנחנו כאן בשבילכם! בחרו איך נוח לכם ליצור קשר
              </p>
              
              <div className="space-y-3">
                <a
                  href="mailto:pageflow@justintime.co.il"
                  onClick={() => sendNotification('email_click', formData)}
                  className="flex items-center gap-4 p-4 bg-[#252525] rounded-xl hover:bg-[#303030] transition-all group"
                >
                  <div className="w-12 h-12 bg-[#8BDBAB]/20 rounded-full flex items-center justify-center group-hover:bg-[#8BDBAB]/30 transition-all">
                    <Mail className="w-6 h-6 text-[#8BDBAB]" />
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-hebrew">אימייל</div>
                    <div className="text-sm text-[#9CA3AF]" dir="ltr">pageflow@justintime.co.il</div>
                  </div>
                </a>
                
                <a
                  href="https://wa.me/972507877165"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sendNotification('whatsapp_click', formData)}
                  className="flex items-center gap-4 p-4 bg-[#252525] rounded-xl hover:bg-[#303030] transition-all group"
                >
                  <div className="w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center group-hover:bg-[#25D366]/30 transition-all">
                    <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-hebrew">וואטסאפ</div>
                    <div className="text-sm text-[#9CA3AF]" dir="ltr">050-787-7165</div>
                  </div>
                </a>
                
                <a
                  href="tel:050-7877165"
                  onClick={() => sendNotification('phone_click', formData)}
                  className="flex items-center gap-4 p-4 bg-[#252525] rounded-xl hover:bg-[#303030] transition-all group"
                >
                  <div className="w-12 h-12 bg-[#3B82F6]/20 rounded-full flex items-center justify-center group-hover:bg-[#3B82F6]/30 transition-all">
                    <Phone className="w-6 h-6 text-[#3B82F6]" />
                  </div>
                  <div className="text-right">
                    <div className="font-bold font-hebrew">טלפון</div>
                    <div className="text-sm text-[#9CA3AF]" dir="ltr">050-787-7165</div>
                  </div>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pricing Modal */}
        <Dialog open={showPricingModal} onOpenChange={(open) => {
          setShowPricingModal(open)
          if (!open) {
            setPricingSubmitted(false)
            setPricingFormData({ name: '', phone: '', email: '' })
          }
        }}>
          <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center font-hebrew">
                {pricingSubmitted 
                  ? '🎉 תודה רבה!' 
                  : (selectedPlan === 'חינם' ? '🎉 מעולה! בואו נתחיל' : '🚀 שדרוג ל-Pro')}
              </DialogTitle>
            </DialogHeader>
            
            {pricingSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-20 h-20 bg-[#8BDBAB]/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-[#8BDBAB]" />
                </div>
                <h3 className="text-xl font-bold font-hebrew">הפרטים נשלחו בהצלחה!</h3>
                <p className="text-[#9CA3AF] font-hebrew">
                  נחזור אליך בהקדם עם כל המידע
                </p>
                <Button
                  onClick={() => {
                    setShowPricingModal(false)
                    setPricingSubmitted(false)
                    setPricingFormData({ name: '', phone: '', email: '' })
                  }}
                  className="bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A] font-bold font-hebrew mt-4"
                >
                  סגור
                </Button>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="text-center p-4 bg-[#252525] rounded-xl">
                  <div className="text-[#8BDBAB] font-bold text-lg font-hebrew">{selectedPlan}</div>
                </div>
                
                <p className="text-center text-[#9CA3AF] font-hebrew">
                  {selectedPlan === 'חינם' 
                    ? 'השאירו פרטים ונעזור לכם להתחיל'
                    : 'השאירו פרטים ונחזור אליכם עם כל המידע'}
                </p>
                
                <div className="space-y-3">
                  <Input
                    value={pricingFormData.name}
                    onChange={(e) => setPricingFormData({ ...pricingFormData, name: e.target.value })}
                    placeholder="שם מלא"
                    className="bg-[#252525] border-white/10 text-white h-12 text-right placeholder:text-right"
                    dir="rtl"
                  />
                  <Input
                    value={pricingFormData.phone}
                    onChange={(e) => setPricingFormData({ ...pricingFormData, phone: e.target.value })}
                    placeholder="טלפון"
                    className="bg-[#252525] border-white/10 text-white h-12 text-right placeholder:text-right"
                    dir="rtl"
                  />
                  <Input
                    value={pricingFormData.email}
                    onChange={(e) => setPricingFormData({ ...pricingFormData, email: e.target.value })}
                    placeholder="אימייל"
                    type="email"
                    className="bg-[#252525] border-white/10 text-white h-12 text-right placeholder:text-right"
                    dir="rtl"
                  />
                </div>
                
                <Button
                  onClick={async () => {
                    try {
                      await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          access_key: '6c06646b-04d2-4191-9230-b883e50f789e',
                          subject: `💰 הרשמה לתוכנית ${selectedPlan}`,
                          from_name: pricingFormData.name,
                          action_type: `הרשמה לתוכנית ${selectedPlan}`,
                          name: pricingFormData.name || 'לא צוין',
                          phone: pricingFormData.phone || 'לא צוין',
                          email: pricingFormData.email || 'לא צוין',
                          plan: selectedPlan,
                          timestamp: new Date().toLocaleString('he-IL'),
                        })
                      })
                      
                      setPricingSubmitted(true)
                    } catch (error) {
                      console.error('Failed to send pricing form:', error)
                    }
                  }}
                  disabled={!pricingFormData.name || !pricingFormData.phone}
                  className="w-full h-12 bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A] font-bold font-hebrew disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  שלח פרטים
                </Button>
                
                <Separator className="bg-white/10" />
                
                <p className="text-center text-sm text-[#9CA3AF] font-hebrew">
                  או צרו קשר ישירות:
                </p>
                
                <div className="flex justify-center gap-4">
                  <a
                    href="https://wa.me/972507877165"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/20 rounded-lg hover:bg-[#25D366]/30 transition-all"
                  >
                    <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="text-[#25D366] font-hebrew">וואטסאפ</span>
                  </a>
                  <a
                    href="mailto:pageflow@justintime.co.il"
                    className="flex items-center gap-2 px-4 py-2 bg-[#8BDBAB]/20 rounded-lg hover:bg-[#8BDBAB]/30 transition-all"
                  >
                    <Mail className="w-5 h-5 text-[#8BDBAB]" />
                    <span className="text-[#8BDBAB] font-hebrew">אימייל</span>
                  </a>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Embed Instructions Dialog */}
        <Dialog open={showEmbedDialog} onOpenChange={setShowEmbedDialog}>
          <DialogContent className="max-w-4xl max-h-[85vh] bg-[#1A1A1A] border-white/10 overflow-hidden" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-hebrew text-2xl text-white flex items-center gap-2">
                <Code className="w-6 h-6 text-[#8BDBAB]" />
                הטמעת הדף באתר שלך
              </DialogTitle>
              <DialogDescription className="font-hebrew text-[#9CA3AF]">
                בחרו את השיטה המתאימה לאתר שלכם
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[60vh] pr-4">
              <Tabs defaultValue="wordpress" className="w-full" dir="rtl">
                <TabsList className="grid grid-cols-3 bg-[#252525] mb-6">
                  <TabsTrigger value="wordpress" className="font-hebrew data-[state=active]:bg-[#8BDBAB] data-[state=active]:text-[#0A0A0A]">
                    וורדפרס
                  </TabsTrigger>
                  <TabsTrigger value="elementor" className="font-hebrew data-[state=active]:bg-[#8BDBAB] data-[state=active]:text-[#0A0A0A]">
                    Elementor
                  </TabsTrigger>
                  <TabsTrigger value="html" className="font-hebrew data-[state=active]:bg-[#8BDBAB] data-[state=active]:text-[#0A0A0A]">
                    HTML רגיל
                  </TabsTrigger>
                </TabsList>
                
                {/* WordPress Instructions */}
                <TabsContent value="wordpress" className="space-y-4">
                  <div className="bg-[#252525] rounded-xl p-6 space-y-4">
                    <h3 className="font-hebrew font-bold text-white text-lg">הטמעה בוורדפרס (בלוק HTML)</h3>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-hebrew text-white">היכנסו לעורך הדפים בוורדפרס</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">Pages → Add New או ערכו דף קיים</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-hebrew text-white">הוסיפו בלוק "Custom HTML"</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">לחצו על + ← חפשו "Custom HTML" או "HTML מותאם"</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-hebrew text-white">הדביקו את הקוד הבא:</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <pre className="bg-[#0A0A0A] rounded-lg p-4 text-xs text-[#9CA3AF] overflow-x-auto" dir="ltr">
{`<iframe 
  src="YOUR_HOSTED_URL_HERE"
  style="width: 100%; min-height: 100vh; border: none;"
  title="${formData.businessName || 'Landing Page'}"
></iframe>`}
                      </pre>
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`<iframe src="YOUR_HOSTED_URL_HERE" style="width: 100%; min-height: 100vh; border: none;" title="${formData.businessName || 'Landing Page'}"></iframe>`)
                          setCopied(true)
                          setTimeout(() => setCopied(false), 2000)
                        }}
                        className="absolute top-2 left-2 bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A]"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="bg-[#8BDBAB]/10 border border-[#8BDBAB]/30 rounded-lg p-4">
                      <p className="font-hebrew text-[#8BDBAB] text-sm">
                        <strong>💡 טיפ:</strong> העלו את קובץ ה-HTML לשרת שלכם או לשירות כמו Netlify/Vercel והחליפו את YOUR_HOSTED_URL_HERE בכתובת האמיתית.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-[#252525] rounded-xl p-6 space-y-4">
                    <h3 className="font-hebrew font-bold text-white text-lg">אפשרות נוספת: דף נפרד</h3>
                    <p className="font-hebrew text-[#9CA3AF]">
                      הורידו את קובץ ה-HTML והעלו אותו ישירות לתיקיית האתר שלכם בשרת.
                      הדף יהיה זמין בכתובת כמו: yoursite.com/landing-page.html
                    </p>
                    <Button onClick={handleDownload} className="bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A] font-hebrew">
                      <Download className="w-4 h-4 ml-2" />
                      הורד קובץ HTML
                    </Button>
                  </div>
                </TabsContent>
                
                {/* Elementor Instructions */}
                <TabsContent value="elementor" className="space-y-4">
                  <div className="bg-[#252525] rounded-xl p-6 space-y-4">
                    <h3 className="font-hebrew font-bold text-white text-lg">הטמעה ב-Elementor</h3>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-hebrew text-white">צרו דף חדש עם Elementor</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">Pages → Add New → Edit with Elementor</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-hebrew text-white">גררו ווידג'ט HTML</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">מהתפריט השמאלי, חפשו "HTML" וגררו לעמוד</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-hebrew text-white">הדביקו את קוד ה-iframe</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">4</div>
                        <div>
                          <p className="font-hebrew text-white">הגדירו את הדף כ"Elementor Full Width"</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">Settings → Page Layout → Elementor Full Width</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#8BDBAB]/10 border border-[#8BDBAB]/30 rounded-lg p-4">
                      <p className="font-hebrew text-[#8BDBAB] text-sm">
                        <strong>💡 טיפ:</strong> ב-Elementor, הגדירו את הווידג'ט לרוחב מלא (Full Width) כדי שדף הנחיתה יתפוס את כל המסך.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Regular HTML Instructions */}
                <TabsContent value="html" className="space-y-4">
                  <div className="bg-[#252525] rounded-xl p-6 space-y-4">
                    <h3 className="font-hebrew font-bold text-white text-lg">הטמעה באתר HTML רגיל</h3>
                    
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                          <p className="font-hebrew text-white">הורידו את קובץ ה-HTML</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                          <p className="font-hebrew text-white">העלו לשרת שלכם</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">דרך FTP או File Manager בפאנל הניהול</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8BDBAB] text-[#0A0A0A] flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                          <p className="font-hebrew text-white">קשרו מהאתר הראשי</p>
                          <p className="font-hebrew text-[#9CA3AF] text-sm">הוסיפו לינק או הפנו את הדומיין לדף</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={handleDownload} className="flex-1 bg-[#8BDBAB] text-[#0A0A0A] hover:bg-[#7BC99A] font-hebrew">
                        <Download className="w-4 h-4 ml-2" />
                        הורד HTML
                      </Button>
                      <Button onClick={handleCopyCode} variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10 font-hebrew">
                        <Copy className="w-4 h-4 ml-2" />
                        העתק קוד
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-[#252525] rounded-xl p-6 space-y-4">
                    <h3 className="font-hebrew font-bold text-white text-lg">שירותי אחסון חינמיים</h3>
                    <p className="font-hebrew text-[#9CA3AF] text-sm">
                      אם אין לכם שרת, תוכלו להעלות את הדף בחינם לאחד מהשירותים הבאים:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] rounded-lg p-4 hover:bg-white/5 transition-all">
                        <p className="font-bold text-white">Netlify</p>
                        <p className="text-xs text-[#9CA3AF]">פשוט וחינמי</p>
                      </a>
                      <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] rounded-lg p-4 hover:bg-white/5 transition-all">
                        <p className="font-bold text-white">Vercel</p>
                        <p className="text-xs text-[#9CA3AF]">מהיר ואמין</p>
                      </a>
                      <a href="https://pages.github.com" target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] rounded-lg p-4 hover:bg-white/5 transition-all">
                        <p className="font-bold text-white">GitHub Pages</p>
                        <p className="text-xs text-[#9CA3AF]">חינמי לגמרי</p>
                      </a>
                      <a href="https://firebase.google.com/products/hosting" target="_blank" rel="noopener noreferrer" className="bg-[#0A0A0A] rounded-lg p-4 hover:bg-white/5 transition-all">
                        <p className="font-bold text-white">Firebase</p>
                        <p className="text-xs text-[#9CA3AF]">של Google</p>
                      </a>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <Separator className="my-6 bg-white/10" />
              
              <div className="bg-gradient-to-br from-[#8BDBAB]/20 to-transparent rounded-xl p-6 text-center">
                <h3 className="font-hebrew font-bold text-white text-lg mb-2">צריכים עזרה בהטמעה?</h3>
                <p className="font-hebrew text-[#9CA3AF] text-sm mb-4">
                  אנחנו כאן לעזור! צרו קשר ונטפל בהכל בשבילכם
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href="mailto:pageflow@justintime.co.il"
                    className="flex items-center gap-2 px-4 py-2 bg-[#8BDBAB] text-[#0A0A0A] rounded-lg font-hebrew font-bold hover:bg-[#7BC99A] transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    אימייל
                  </a>
                  <a
                    href="https://wa.me/972507877165"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg font-hebrew font-bold hover:bg-[#20BD5A] transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    וואטסאפ
                  </a>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Scroll to top */}
        <AnimatePresence>
          {scrolled && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-6 right-6 z-50 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <ChevronDown className="w-5 h-5 rotate-180" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}