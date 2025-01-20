import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

function isCodeGenerationPrompt(prompt: string): boolean {
  const codeIndicators = [
    'create',
    'generate',
    'write',
    'design',
    'build',
    'layout',
    'interface',
    'ui',
    'page',
    'landing',
    'website',
    'component'
  ];
  return codeIndicators.some(indicator => prompt.toLowerCase().includes(indicator));
}

function isLandingPage(prompt: string): boolean {
  const landingIndicators = ['landing', 'homepage', 'main page', 'website'];
  return landingIndicators.some(indicator => prompt.toLowerCase().includes(indicator));
}

function isFrameworkSpecific(prompt: string): boolean {
  const frameworkKeywords = [
    'react',
    'vue',
    'angular',
    'svelte',
    'next.js',
    'nuxt',
    'component',
    'jsx',
    'tsx',
    'props',
    'state',
    'hooks',
    'useEffect',
    'useState'
  ];
  return frameworkKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    if (!isCodeGenerationPrompt(prompt)) {
      return NextResponse.json({
        code: "I am trained to create responsive and beautiful UI components. Please ask me to design or create something specific.",
        language: "text"
      }, { status: 400 });
    }

    if (isFrameworkSpecific(prompt)) {
      return NextResponse.json({
        code: "I only generate vanilla HTML, CSS, and JavaScript code. Framework-specific code (React, Vue, Angular, etc.) is not supported. Please rephrase your request to use vanilla web technologies.",
        language: "text"
      }, { status: 400 });
    }

    const isLanding = isLandingPage(prompt);
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const enhancedPrompt = `Generate clean, modern ${isLanding ? 'landing page' : 'component'} code using only vanilla HTML, CSS (with Tailwind classes), and JavaScript. 

Key Requirements:
1. Use semantic HTML5 tags
2. Include responsive Tailwind classes
3. Add minimal, necessary JavaScript
4. Ensure cross-browser compatibility
5. Follow accessibility best practices

Design Features:
${isLanding ? `- Hero section with gradient background and CTA
- Feature cards with hover effects
- Testimonial slider/carousel
- Animated statistics counter
- FAQ accordion section
- Newsletter subscription form
- Smooth scroll navigation` : `- Interactive hover states
- Loading animations
- Form validation if applicable
- Micro-interactions
- Responsive layout
- Error states handling`}

Technical Features:
- Intersection Observer for scroll animations
- CSS transitions for smooth effects
- Local storage for user preferences
- Form validation with error messages
- Lazy loading for images
- Touch-friendly mobile interactions

Original request: ${prompt}

Return the code in the following format:
\`\`\`html
<!-- HTML code here -->
\`\`\`

\`\`\`css
/* Additional CSS if needed */
\`\`\`

\`\`\`javascript
// JavaScript code here
\`\`\``;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response.text();

    // Extract sections
    const htmlMatch = response.match(/```html\n([\s\S]*?)\n```/);
    const cssMatch = response.match(/```css\n([\s\S]*?)\n```/);
    const jsMatch = response.match(/```javascript\n([\s\S]*?)\n```/);

    const htmlContent = htmlMatch ? htmlMatch[1].trim() : '';
    const cssContent = cssMatch ? cssMatch[1].trim() : '';
    const jsContent = jsMatch ? jsMatch[1].trim() : '';

    // Clean HTML content and extract any inline JavaScript
    let cleanedHtml = htmlContent
        .replace(/<head>[\s\S]*?<\/head>/gi, '')
        .replace(/<\/?(!DOCTYPE|html|head|body)[^>]*>/gi, '')
        .trim();

    // Extract any inline JavaScript from the HTML
    const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
    const inlineScripts: string[] = [];
    let scriptMatch;
    
    while ((scriptMatch = scriptRegex.exec(cleanedHtml)) !== null) {
        if (scriptMatch[1].trim()) {
            inlineScripts.push(scriptMatch[1].trim());
        }
    }

    // Remove script tags from HTML
    cleanedHtml = cleanedHtml.replace(/<script[\s\S]*?<\/script>/gi, '');

    // Replace image sources with reliable placeholders
    cleanedHtml = cleanedHtml.replace(
        /src=["'](?:https?:\/\/[^"']+|[^"']+)["']/gi,
        (match) => {
            if (match.toLowerCase().includes('avatar') || match.includes('profile')) {
                return 'src="https://picsum.photos/200"';
            } else if (match.toLowerCase().includes('hero') || match.includes('banner')) {
                return 'src="https://picsum.photos/1920/1080"';
            } else if (match.toLowerCase().includes('product') || match.includes('item')) {
                return 'src="https://picsum.photos/400/300"';
            } else {
                return 'src="https://picsum.photos/800/600"';
            }
        }
    );

    // Extract title and description
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
    const descriptionMatch = htmlContent.match(/<meta\s+name="description"\s+content="([^"]*?)"\s*\/?>/);

    // Combine all JavaScript (original + inline scripts)
    const combinedJs = [...inlineScripts, jsContent].filter(js => js.trim()).join('\n\n');
    
    // Construct the final HTML document
    const finalCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleMatch ? titleMatch[1] : 'Modern UI'}</title>
    <meta name="description" content="${descriptionMatch ? descriptionMatch[1] : ''}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        // Modern primary colors with variations
                        primary: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            200: '#bae6fd',
                            300: '#7dd3fc',
                            400: '#38bdf8',
                            500: '#0ea5e9',
                            600: '#0284c7',
                            700: '#0369a1',
                            800: '#075985',
                            900: '#0c4a6e'
                        },
                        // Accent colors for highlights and CTAs
                        accent: {
                            50: '#fdf4ff',
                            100: '#fae8ff',
                            200: '#f5d0fe',
                            300: '#f0abfc',
                            400: '#e879f9',
                            500: '#d946ef',
                            600: '#c026d3',
                            700: '#a21caf',
                            800: '#86198f',
                            900: '#701a75'
                        },
                        // Success colors
                        success: {
                            50: '#ecfdf5',
                            100: '#d1fae5',
                            200: '#a7f3d0',
                            300: '#6ee7b7',
                            400: '#34d399',
                            500: '#10b981',
                            600: '#059669',
                            700: '#047857',
                            800: '#065f46',
                            900: '#064e3b'
                        }
                    },
                    // Modern gradient combinations
                    backgroundImage: {
                        'gradient-primary': 'linear-gradient(to right, var(--tw-gradient-stops))',
                        'gradient-accent': 'linear-gradient(135deg, var(--tw-gradient-stops))',
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
                    },
                    // Glass effect utilities
                    backdropBlur: {
                        'xs': '2px',
                    },
                    // Animation durations
                    transitionDuration: {
                        '2000': '2000ms',
                    }
                }
            }
        }
    </script>
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        /* Glass morphism effect */
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark .glass {
            background: rgba(17, 25, 40, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.125);
        }

        /* Gradient animations */
        .gradient-animate {
            background-size: 200% 200%;
            animation: gradient 15s ease infinite;
        }

        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        /* Smooth transitions */
        .transition-all {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 300ms;
        }
        
        /* Modern card hover effects */
        .hover-lift {
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        
        .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        ${cssContent}
    </style>
</head>
<body class="antialiased">
    ${cleanedHtml}
</body>

<!-- JavaScript -->
<script>
${combinedJs}
</script>
</html>`;

    return NextResponse.json({
        code: finalCode,
        language: 'html'
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}