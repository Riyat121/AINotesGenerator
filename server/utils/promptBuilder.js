export const buildPrompt = ({
  topic,
  classLevel,
  examType,
  revisionMode,
  includeDiagram,
  includeChart
}) => {
  return `
You are a STRICT JSON generator for an exam preparation system.

⚠️ VERY IMPORTANT:
- Output MUST be valid JSON
- Your response will be parsed using JSON.parse()
- INVALID JSON will cause system failure
- Use ONLY double quotes "
- NO comments, NO trailing commas
- NO markdown code fences around the JSON
- Escape line breaks using \\n
- Do NOT use emojis inside text values (except ⭐ in subTopics keys and importance)

TASK:
Convert the given topic into exam-focused notes.

INPUT:
Topic: ${topic}
Class Level: ${classLevel || "Not specified"}
Exam Type: ${examType || "General"}
Revision Mode: ${revisionMode ? "ON" : "OFF"}
Include Diagram: ${includeDiagram ? "YES" : "NO"}
Include Charts: ${includeChart ? "YES" : "NO"}

GLOBAL CONTENT RULES:
- Use clear, simple, exam-oriented language
- Notes MUST be Markdown formatted
- Headings and bullet points only
- Do NOT mention diagram or charts inside "notes"; they go only in the diagram and charts fields

REVISION MODE RULES (CRITICAL):
- If REVISION MODE is ON:
  - Notes must be VERY SHORT
  - Only bullet points
  - One-line answers only
  - Definitions, formulas, keywords
  - No paragraphs
  - No explanations
  - Content must feel like:
    - last-day revision
    - 5-minute exam cheat sheet
  - revisionPoints MUST summarize ALL important facts

- If REVISION MODE is OFF:
  - Notes must be DETAILED but exam-focused
  - Each topic should include:
    - definition
    - short explanation
    - examples (if applicable)
  - Paragraph length: max 2-4 lines
  - No storytelling, no extra theory

DIAGRAM RULES:
- If Include Diagram is YES: diagram must be { "type": "flowchart", "data": "<mermaid graph TD code with \\n for line breaks>" }
- If Include Diagram is NO: diagram must be null
- Mermaid syntax rules: start with "graph TD", every node must have an ID like A[Label], B[Label], connect with A --> B, keep labels short (max 4 words), avoid brackets and quotes inside labels, one connection per line separated by \\n

CHART RULES:
- If Include Charts is YES:
  - charts MUST be an array with 1 or 2 chart objects
  - Choose chart type based on the topic:
    - THEORY topic -> bar or pie (importance / weightage)
    - PROCESS topic -> bar or line (steps / stages)
  - Use numeric values ONLY
  - Labels must be short and exam-oriented
- If Include Charts is NO:
  - charts MUST be []

CHART TYPES ALLOWED:
- bar
- line
- pie

CHART OBJECT FORMAT:
{
  "type": "bar | line | pie",
  "title": "string",
  "data": [
    { "name": "string", "value": 10 }
  ]
}

OUTPUT FORMAT (return EXACTLY these keys, nothing else):
{
  "notes": "markdown string",
  "subTopics": {
    "⭐": ["low priority topic"],
    "⭐⭐": ["medium priority topic"],
    "⭐⭐⭐": ["high priority topic"]
  },
  "importance": "⭐⭐⭐",
  "revisionPoints": ["point 1", "point 2"],
  "questions": {
    "short": ["question 1", "question 2"],
    "long": ["question 1", "question 2"],
    "diagram": "one diagram based question"
  },
  "diagram": null,
  "charts": []
}
`
}