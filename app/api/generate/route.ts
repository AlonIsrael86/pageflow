import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { businessName, description, targetAudience, action } = await request.json()

    const actionMap: Record<string, string> = {
      contact: "יצירת קשר",
      signup: "הרשמה",
      purchase: "קנייה",
      booking: "הזמנת פגישה",
    }

    const prompt = `
אתה מעצב אתרים מקצועי. צור קוד HTML+Tailwind CSS לדף נחיתה בעברית עבור העסק הבא:

שם העסק: ${businessName}
תיאור: ${description}
קהל יעד: ${targetAudience}
קריאה לפעולה: ${actionMap[action] || action}

דרישות:
- עיצוב מודרני ונקי
- RTL לעברית
- רקע כהה (#0A0A0A)
- צבע מבטא ירוק (#8BDBAB)
- טקסט לבן (#FFFFFF) וטקסט משני (#9CA3AF)
- כפתור CTA בולט עם הצבע הירוק
- מותאם למובייל
- כולל: Hero section, תכונות/שירותים, וכפתור CTA
- רק את ה-HTML בתוך תג body, בלי DOCTYPE או head

החזר רק את הקוד, בלי הסברים או markdown.
`

const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const generatedCode = response.text()

    // Clean up the response - remove markdown code blocks if present
    const cleanCode = generatedCode
      .replace(/```html\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    return NextResponse.json({ code: cleanCode })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate landing page" },
      { status: 500 }
    )
  }
}
