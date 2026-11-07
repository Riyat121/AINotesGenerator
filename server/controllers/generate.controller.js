import UserModel from "../models/user.model.js";
import Notes from "../models/notes.model.js";
import { buildPrompt } from "../utils/promptBuilder.js";
// import { generateGeminiResponse } from "../services/gemini.services.js";
import { generateAIResponse } from "../services/groq.services.js";
const cleanText = (data) => {
  if (typeof data === "string") {
    return data
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"');
  }
  if (Array.isArray(data)) return data.map(cleanText);
  if (data && typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, cleanText(v)])
    );
  }
  return data;
};
export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
    } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }

    if (user.credits < 10) {
      user.isCreditAvailable = false;
      await user.save();
      return res.status(403).json({
        message: "Insufficient credits",
      });
    }

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
    });

   const aiResponse = await generateAIResponse(prompt);

let parsed = aiResponse;
if (typeof aiResponse === "string") {
  parsed = JSON.parse(aiResponse.replace(/```json|```/g, "").trim());
}
parsed = cleanText(parsed);

    const notes = await Notes.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagram,
      includeChart,
      content: parsed,
    });

    user.credits -= 10;
    if (user.credits <= 0) user.isCreditAvailable = false;

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }

    user.notes.push(notes._id);

    await user.save();

    return res.status(200).json({
      data: parsed,
      noteId: notes._id,
      creditsLeft: user.credits,
    });
  } catch (error) {
    console.error("Generate Notes Error:", error.message);

    const isTransientGroqError =
      error?.status === 429 ||
      error?.status === 500 ||
      error?.status === 502 ||
      error?.status === 503 ||
      error?.status === 504 ||
      /temporarily unavailable|high demand|rate limit|too many requests/i.test(
        error?.message || "",
      );

    if (isTransientGroqError) {
      return res.status(503).json({
        message:
          "The AI service is temporarily unavailable. Please try again in a moment.",
      });
    }

    return res.status(500).json({ error: error.message });
  }
};
