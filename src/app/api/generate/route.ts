import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

function isCodeGenerationPrompt(prompt: string): boolean {
  const codeIndicators = [
    'create', 'generate', 'make', 'build', 'implement', 'develop',
    'button', 'component', 'layout', 'design', 'page', 'section',
    'style', 'animation', 'effect', 'hover', 'transition',
    'html', 'css', 'javascript', 'tailwind', 'responsive',
    'code', 'script', 'program'
  ];
  
  const promptLower = prompt.toLowerCase();
  return codeIndicators.some(indicator => promptLower.includes(indicator));
}

function shouldUseTailwind(prompt: string): boolean {
  const promptLower = prompt.toLowerCase();
  return promptLower.includes('tailwind') || promptLower.includes('tailwindcss');
}

async function findSimilarPrompts(prompt: string) {
  // Get recent prompts
  const recentPrompts = await prisma.promptHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Simple similarity check (you might want to use a more sophisticated algorithm)
  const promptWords = new Set(prompt.toLowerCase().split(' '));
  const similarPrompts = recentPrompts.filter(history => {
    const historyWords = new Set(history.prompt.toLowerCase().split(' '));
    const intersection = new Set([...promptWords].filter(x => historyWords.has(x)));
    return intersection.size > 2; // At least 3 words in common
  });

  return similarPrompts;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    // Check if it's a code generation request
    if (!isCodeGenerationPrompt(prompt)) {
      return NextResponse.json({
        code: "I am trained only for HTML, CSS, and JavaScript code generation. Please ask me to create or design something specific.",
        language: "text"
      });
    }

    // Find similar prompts from history
    const similarPrompts = await findSimilarPrompts(prompt);
    const useTailwind = shouldUseTailwind(prompt);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Include similar prompts in the context
    const contextPrompt = similarPrompts.length > 0
      ? `Previous similar requests and their responses:
${similarPrompts.map(p => `Request: ${p.prompt}\nResponse: ${p.response}`).join('\n\n')}

Based on these similar examples, `
      : '';

    const enhancedPrompt = `${contextPrompt}Generate a complete HTML file that includes ${useTailwind ? 'Tailwind CSS classes' : 'CSS in a <style> tag'} and JavaScript in a <script> tag if needed. The HTML should be properly structured with DOCTYPE, html, head, and body tags. Make sure the code is semantic, accessible, and follows best practices. ${useTailwind ? 'Use Tailwind CSS classes for styling.' : 'Write clean and maintainable CSS.'} Include comments to explain the code structure. Only return the code, no explanations:

${prompt}`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response.text();

    // Extract code from the response (remove any markdown code blocks if present)
    let code = response.replace(/```[\w]*\n?|\n```/g, '').trim();

    // If not already a complete HTML document, wrap it in one
    if (!code.includes('<!DOCTYPE html>')) {
      const formattedCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Code</title>
    ${useTailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : ''}
    <style>
        /* Reset default styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            background-color: #f5f5f5;
        }
        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
        }
        ${!useTailwind ? (code.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '') : ''}
    </style>
</head>
<body>
    <div class="container">
        ${code.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<script>[\s\S]*?<\/script>/, '')}
    </div>
    <script>
    ${code.match(/<script>([\s\S]*?)<\/script>/)?.[1] || ''}
    </script>
</body>
</html>`;
      
      code = formattedCode;
    }

    // Save the prompt and response to history
    await prisma.promptHistory.create({
      data: {
        prompt,
        response: code,
        language: 'html'
      }
    });

    return NextResponse.json({
      code,
      language: 'html',
      similarPrompts: similarPrompts.map(p => ({
        prompt: p.prompt,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
