import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'tngtech/deepseek-r1t2-chimera:free';

export async function optimizeProductListing(productData) {
  try {
    const prompt = `You are an Amazon listing optimization expert. Analyze the following product listing and provide optimized versions.

ORIGINAL LISTING:
Title: ${productData.title}

Bullet Points:
${productData.bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Description: ${productData.description}

TASK: Generate optimized versions following Amazon's best practices:

1. OPTIMIZED TITLE (50-200 characters):
   - Include primary keywords
   - Brand name first (if present)
   - Key features and benefits
   - Natural and readable

2. OPTIMIZED BULLET POINTS (5 bullets):
   - Start each with a key benefit or feature
   - Clear, concise, scannable
   - Include relevant keywords naturally
   - Focus on customer benefits

3. OPTIMIZED DESCRIPTION (150-300 words):
   - Persuasive and engaging
   - Tell the product story
   - Highlight benefits and features
   - Include keywords naturally
   - Amazon compliant (no promotional language, contact info, etc.)

4. KEYWORD SUGGESTIONS (3-5 keywords):
   - High-value search terms
   - Relevant to the product
   - Not already heavily used in title

IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "title": "optimized title here",
  "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "description": "optimized description here",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Amazon Listing Optimizer'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let optimized;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        optimized = JSON.parse(jsonMatch[0]);
      } else {
        optimized = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('AI returned invalid JSON format');
    }

    if (!optimized.title || !optimized.bullets || !optimized.description || !optimized.keywords) {
      throw new Error('AI response missing required fields');
    }

    return {
      title: optimized.title,
      bullets: Array.isArray(optimized.bullets) ? optimized.bullets : [optimized.bullets],
      description: optimized.description,
      keywords: Array.isArray(optimized.keywords) ? optimized.keywords : [optimized.keywords]
    };
  } catch (error) {
    console.error('❌ AI optimization error:', error.message);
    throw error;
  }
}
