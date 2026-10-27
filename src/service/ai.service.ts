import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY

const ai = new GoogleGenAI({
  apiKey
})

export const genrateArticleDescription = async (promtText: string) => {
  const res = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `What is ${promtText}`,
    config: {
      maxOutputTokens: 500
    }
  })
  const description = res.text
  return description
}

// CCCCCC - 1 token
// description - 2 token

// 0, 1

// edirisinghaheshani70_db_user
// yyCCNrtirhZYBjlc

// mongodb+srv://edirisinghaheshani70_db_user:yyCCNrtirhZYBjlc@cluster0.72tvqs2.mongodb.net/rad_76_db