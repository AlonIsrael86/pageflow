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
          src="https://www.googletagmanager.com/gtag/js?id=G-51WZ6YS6EV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-51WZ6YS6EV');
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
