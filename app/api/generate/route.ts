import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { 
      businessName, 
      description, 
      targetAudience, 
      action,
      includeSections 
    } = await request.json()

    const prompt = `You are a professional Hebrew copywriter. Generate marketing content for a landing page.

Business: ${businessName}
Description: ${description}
Target Audience: ${targetAudience}
Call to Action: ${action}

Generate the following content IN HEBREW. Return ONLY valid JSON, no markdown:

{
  "hero": {
    "headline": "קצר וחזק, 3-6 מילים",
    "subheadline": "משפט אחד שמסביר את הערך ללקוח"
  },
  "about": {
    "title": "כותרת לאודות",
    "text": "2-3 משפטים על העסק והערך שלו"
  },
  "services": [
    {
      "title": "שם השירות",
      "description": "תיאור קצר של השירות",
      "icon": "one of: Palette, Code, Megaphone, Camera, PenTool, Globe, Smartphone, Mail, Star, Heart, Zap, Shield"
    }
  ],
  "testimonials": [
    {
      "name": "שם ישראלי אמיתי",
      "role": "תפקיד או סוג לקוח",
      "text": "המלצה אותנטית בגוף ראשון, 1-2 משפטים"
    }
  ],
  "faq": [
    {
      "question": "שאלה נפוצה",
      "answer": "תשובה ממצה"
    }
  ],
  "cta": {
    "primary": "טקסט לכפתור הראשי",
    "secondary": "טקסט לכפתור המשני"
  }
}

Generate exactly:
- 4 services with different relevant icons
- 3 testimonials with realistic Israeli names
- 4 FAQ items relevant to the business
- Make all content specific to "${businessName}" and "${targetAudience}"
- Be creative but professional
- All text must be in Hebrew`

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Clean and parse JSON
    let cleanJson = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()

    // Parse JSON
    const content = JSON.parse(cleanJson)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate content", details: String(error) },
      { status: 500 }
    )
  }
}
