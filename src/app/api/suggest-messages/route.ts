import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const prompt = `Generate exactly three short, open-ended personal questions in a single line. Each question should be concise and separated by '||'. Do not include any explanations or formatting instructions. Time: ${new Date().toISOString()}`;

export const config = {
  runtime: 'edge', // Specifies that this is an Edge Function
};


export async function POST(req: Request) {
  try {
    const response = await hf.textGeneration({
      model: 'Qwen/Qwen2.5-1.5B-Instruct',
      inputs: prompt,
      parameters: {
        max_new_tokens: 50,
        temperature: Math.random() * (1 - 0.6) + 0.6, // Randomize temperature slightly
        top_p: 0.9,
      },
    });

    // Ensure the response has `generated_text`
    const text = response.generated_text || '';
  

    // Strip the prompt if it appears at the beginning
    const cleanText = text.startsWith(prompt) ? text.slice(prompt.length).trim() : text;

    // Split and process the questions
    const questions = cleanText.split('||').map((q) => q.trim());
    const validQuestions = questions.slice(0, 3).filter((q) => q); // Limit to 3 questions
    const finalResponse = validQuestions.join(' || ');

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(finalResponse); // Stream only the cleaned questions
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain' },
    });

  } catch (error) {
    console.error("Error during Hugging Face request:", error);
    return new Response("Failed to fetch response.", { status: 500 });
  }
}
