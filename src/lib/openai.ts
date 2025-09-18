import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type Translation = { title: string; content: string };

type Target = { code: 'en' | 'ar' | 'sq' | 'bn' | 'ur'; name: string };

const SYSTEM_PROMPT = `You are a professional translator of Friday sermons (khutbah). Translate faithfully from Croatian into TARGET_LANGUAGE. Preserve meaning, religious terms, Qur'anic and Hadith citations, punctuation, and paragraph breaks. Do not add commentary or explanations. Output strict JSON only with keys: "title" and "content".`;

async function translateOnce(
  target: Target,
  hrTitle: string,
  hrContent: string
): Promise<Translation> {
  const user = [
    `Translate the following khutbah from Croatian to ${target.name} and return strict JSON with { "title", "content" }.`,
    `Croatian title:\n${hrTitle}`,
    `Croatian content:\n${hrContent}`
  ].join('\n\n');

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT.replace('TARGET_LANGUAGE', target.name) },
      { role: 'user', content: user }
    ],
    response_format: { type: 'json_object' }
  });

  const content = res.choices[0]?.message?.content;
  if (!content) throw new Error('Empty translation response');

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Failed to parse translation JSON');
  }

  if (typeof parsed.title !== 'string' || typeof parsed.content !== 'string') {
    throw new Error('Invalid translation shape');
  }

  return { title: parsed.title, content: parsed.content };
}

export async function translateAllSequential(
  hrTitle: string,
  hrContent: string
): Promise<Record<'en' | 'ar' | 'sq' | 'bn' | 'ur', Translation>> {
  const targets: Target[] = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'sq', name: 'Albanian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ur', name: 'Urdu' }
  ];

  const results: any = {};
  for (const t of targets) {
    let attempts = 0;
    while (true) {
      try {
        const r = await translateOnce(t, hrTitle, hrContent);
        results[t.code] = r;
        break;
      } catch (e) {
        attempts++;
        if (attempts >= 3) throw new Error(`Translation failed for ${t.code}: ${String(e)}`);
        await new Promise((res) => setTimeout(res, attempts === 1 ? 500 : 1500));
      }
    }
  }
  return results;
}