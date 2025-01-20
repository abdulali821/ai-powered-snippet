import Image from "next/image";
import AiPrompt from '@/components/AiPrompt';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-transparent bg-clip-text">
            AI Code Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Generate high-quality code snippets using AI. 
            Choose your programming language and describe what you want to create.
          </p>
        </div>
        <AiPrompt />
      </main>
    </div>
  );
}
