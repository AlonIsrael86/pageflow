import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function testGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
  const result = await model.generateContent("Say hello in Hebrew")
  const response = await result.response
  console.log("Gemini response:", response.text())
  return response.text()
}
