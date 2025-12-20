import type { Metadata } from "next"
import { Heebo } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const heebo = Heebo({ 
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
})

export const metadata: Metadata = {
  title: "בניית דף נחיתה עם AI בחינם | PageFlow by JustInTime",
  description: "צרו דף נחיתה מקצועי בדקות עם AI. התאמה אישית מלאה: צבעים, לוגו, תמונות. ללא צורך בידע טכני. התחילו בחינם עכשיו!",
  keywords: ["דף נחיתה", "בניית אתרים", "AI", "עיצוב", "שיווק דיגיטלי", "landing page", "PageFlow", "JustInTime", "בניית דף נחיתה עם ai בחינם"],
  authors: [{ name: "JustInTime" }],
  creator: "JustInTime",
  publisher: "JustInTime",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://pageflow.justintime.co.il",
    siteName: "PageFlow by JustInTime",
    title: "בניית דף נחיתה עם AI בחינם | PageFlow",
    description: "צרו דף נחיתה מקצועי בדקות עם AI. התאמה אישית מלאה. התחילו בחינם!",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PageFlow - בניית דפי נחיתה עם AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "בניית דף נחיתה עם AI בחינם | PageFlow",
    description: "צרו דף נחיתה מקצועי בדקות עם AI. התחילו בחינם!",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://pageflow.justintime.co.il",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A0A0A" />
        
        {/* Structured Data - WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "PageFlow",
              "description": "בניית דף נחיתה עם AI בחינם - צרו דף נחיתה מקצועי בדקות",
              "url": "https://pageflow.justintime.co.il",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "inLanguage": "he",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS",
                "availability": "https://schema.org/InStock"
              },
              "creator": {
                "@type": "Organization",
                "name": "JustInTime",
                "url": "https://justintime.co.il"
              }
            })
          }}
        />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "JustInTime",
              "url": "https://justintime.co.il",
              "logo": "https://pageflow.justintime.co.il/logo.png",
              "sameAs": [
                "https://www.facebook.com/justintimeil",
                "https://www.instagram.com/justintime.il",
                "https://wa.me/972507877165"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+972-50-787-7165",
                "contactType": "customer service",
                "availableLanguage": ["Hebrew", "English"]
              }
            })
          }}
        />

        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PageFlow Landing Page Builder",
              "operatingSystem": "Web Browser",
              "applicationCategory": "WebApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "ILS"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "150"
              }
            })
          }}
        />

        {/* Structured Data - FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "האם PageFlow באמת בחינם?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "כן, ניתן ליצור דף נחיתה אחד בחינם לחלוטין. לדפים נוספים ניתן לשדרג לחבילת Pro."
                  }
                },
                {
                  "@type": "Question",
                  "name": "האם צריך ידע בתכנות?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "לא, PageFlow מיועד לכל אחד. פשוט מלאו את הפרטים והמערכת תייצר עבורכם דף נחיתה מקצועי."
                  }
                },
                {
                  "@type": "Question",
                  "name": "איך AI עוזר ביצירת הדף?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "הבינה המלאכותית כותבת את התוכן עבורכם - כותרות, תיאורים, שירותים והמלצות - בהתאם לפרטי העסק שהזנתם."
                  }
                },
                {
                  "@type": "Question",
                  "name": "האם הדף מותאם לנייד?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "כן, כל דף שנוצר מותאם באופן מלא לצפייה בנייד, טאבלט ומחשב."
                  }
                }
              ]
            })
          }}
        />

        {/* Structured Data - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "JustInTime",
                  "item": "https://justintime.co.il"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "PageFlow",
                  "item": "https://pageflow.justintime.co.il"
                }
              ]
            })
          }}
        />

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-WD3H7H3R');
          `}
        </Script>
        
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3BERGT88GY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3BERGT88GY');
          `}
        </Script>
      </head>
      <body className={`${heebo.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WD3H7H3R"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
      </body>
    </html>
  )
}
