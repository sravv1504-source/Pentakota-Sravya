import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: Live AI Mock Interview Turn
app.post('/api/interview/chat', async (req, res) => {
  try {
    const {
      candidateMessage,
      history = [],
      currentQuestion,
      domain,
      difficulty,
      language = 'English',
      interviewerName = 'Maya',
      interviewerTitle = 'Senior Lead Architect',
      candidateAnxietyMode = true,
      stageFearTipRequested = false,
    } = req.body;

    if (!ai) {
      // Graceful rich mock response if API key is not yet provided
      return res.json({
        response: `Thank you for sharing that answer. As your coach, I loved how clearly you started. Remember that in an interview, taking a 2-second pause before speaking shows poise, not hesitation. Could you elaborate on how you would handle edge cases in this scenario?`,
        interviewerMood: 'encouraging',
        calmingTip: 'Pro-tip for introverts: Ground yourself by feeling both feet flat on the floor and breathing out slowly.',
        rubric: {
          score: 82,
          strengths: ['Clear terminology', 'Structured thought process'],
          areasToRefine: ['Provide a quick concrete example', 'Keep your speaking pace relaxed'],
          confidenceFeedback: 'Your composure is improving! You sounded calm and methodical.',
        },
        followUpQuestion: 'How would you test this implementation in production?',
      });
    }

    const systemPrompt = `You are ${interviewerName}, a ${interviewerTitle} conducting a supportive, comforting mock technical interview.
The candidate is a job seeker and introvert who struggles with stage fear and nervousness during interviews.
Your mission:
1. Speak in the requested language: "${language}". If the language is not English, respond in that language naturally.
2. Be warm, calming, respectful, and human-like. Never be aggressive, condescending, or cold.
3. Assess the candidate's answer for the domain "${domain}" (Difficulty: "${difficulty}") on question: "${currentQuestion}".
4. Acknowledge what they did well first, then kindly suggest one constructive improvement.
5. Offer an empathetic "calmingTip" specifically aimed at stage fear, breathing, or introvert pacing.
6. Provide a JSON response matching this schema strictly:
{
  "response": "Your spoken dialogue to the candidate (2-4 sentences max, warm and direct)",
  "interviewerMood": "smiling" | "listening" | "nodding" | "encouraging" | "thinking",
  "calmingTip": "A 1-sentence stage-fear / relaxation tip tailored to introverts",
  "rubric": {
    "score": number between 40 and 100,
    "strengths": ["string", "string"],
    "areasToRefine": ["string"],
    "confidenceFeedback": "warm observation on their confidence and delivery"
  },
  "followUpQuestion": "A thoughtful next question or follow-up to deepen their skill"
}`;

    const conversationHistoryText = history
      .slice(-6)
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Candidate' : interviewerName}: ${m.content}`)
      .join('\n');

    const prompt = `Current Context:
Target Domain: ${domain}
Difficulty: ${difficulty}
Current Question: ${currentQuestion}
Candidate's Latest Response: "${candidateMessage}"
Recent Conversation:
${conversationHistoryText}
Language requested: ${language}
${stageFearTipRequested ? 'The candidate is feeling very nervous right now and needs extra warmth and gentle grounding.' : ''}

Evaluate their response, provide conversational dialogue, mood, calming tip, rubric score, and follow up in JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        response: text,
        interviewerMood: 'nodding',
        calmingTip: 'Remember to breathe deeply and take your time.',
        rubric: { score: 75, strengths: ['Good attempt'], areasToRefine: ['Add more detail'], confidenceFeedback: 'Stay relaxed!' },
      };
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error generating interview response:', error);
    res.status(500).json({
      error: 'Failed to generate interviewer response',
      message: error?.message || 'Server error',
      fallback: {
        response: "That's a very solid approach. Let's take a calm breath. What would you do if performance became a bottleneck?",
        interviewerMood: 'encouraging',
        calmingTip: 'Exhale twice as long as your inhale to immediately trigger your parasympathetic nervous system.',
        rubric: { score: 80, strengths: ['Good structure'], areasToRefine: ['Keep expanding'], confidenceFeedback: 'You are doing great!' },
      },
    });
  }
});

// Endpoint: AI Deep Answer Feedback & STAR Method Review
app.post('/api/interview/feedback', async (req, res) => {
  try {
    const { question, answer, domain, difficulty, language = 'English' } = req.body;

    if (!ai) {
      return res.json({
        score: 85,
        breakdown: {
          accuracy: 88,
          clarity: 82,
          introvertDelivery: 85,
        },
        strengths: ['Identified core architectural trade-offs', 'Calm and concise syntax explanation'],
        improvements: ['Include how you would monitor this in production', 'Adopt a STAR (Situation-Task-Action-Result) narrative format'],
        modelAnswer: 'A high-scoring answer would introduce the concept concisely, cite a practical use-case, and mention complexity analysis.',
        affirmation: 'You have deep technical competence. Trust your knowledge and let your natural thoughtfulness shine.',
      });
    }

    const systemPrompt = `You are an expert interview coach specializing in mentoring introverted tech candidates and overcoming stage anxiety.
Analyze the candidate's answer for question: "${question}" in domain "${domain}" (${difficulty}).
Return JSON in language: "${language}":
{
  "score": number (0-100),
  "breakdown": {
    "accuracy": number (0-100),
    "clarity": number (0-100),
    "introvertDelivery": number (0-100)
  },
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "modelAnswer": "An exemplary, introvert-friendly answer (calm, structured, authoritative)",
  "affirmation": "An empowering psychological affirmation to banish imposter syndrome"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Question: ${question}\nCandidate Answer: ${answer}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: any) {
    console.error('Feedback error:', err);
    res.status(500).json({ error: 'Could not generate feedback' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZenInterview server listening on port ${PORT}`);
  });
}

startServer();
