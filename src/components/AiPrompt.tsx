'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from 'next-themes';
import CodeLivePreview from './LivePreview';
import ThemeToggle from './ThemeToggle';
import { format } from 'date-fns';

interface CodeResponse {
  code: string;
  language: string;
  similarPrompts?: Array<{
    prompt: string;
    createdAt: string;
  }>;
}

interface HistoryItem {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export default function AiPrompt() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<CodeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchHistory();
  }, []);

  // Update edited code when response changes
  useEffect(() => {
    if (response) {
      setEditedCode(response.code);
    }
  }, [response]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to generate code');

      const data = await res.json();
      setResponse(data);
      await fetchHistory(); // Refresh history after new prompt
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setPrompt(item.prompt);
    setResponse({
      code: item.response,
      language: 'html'
    });
    setShowHistory(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-8">
      <div className="max-w-[90rem] mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                HTML/CSS/JavaScript Generator
              </h1>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 
                         rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
            </div>
            <ThemeToggle />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={`space-y-6 ${showHistory ? 'lg:col-span-1' : 'lg:col-span-4'}`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="prompt" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    What would you like me to create?
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Create a responsive navigation menu' or 'Create a button with hover effect using Tailwind CSS'"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             min-h-[100px] resize-y"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-colors duration-200"
                  >
                    {loading ? 'Generating...' : 'Generate Code'}
                  </button>
                </div>
              </form>

              {showHistory && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Previous Prompts
                  </h2>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleHistoryClick(item)}
                        className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg
                                 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                          {item.prompt}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {format(new Date(item.createdAt), 'MMM d, yyyy HH:mm')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {response && (
              <div className={`space-y-4 ${showHistory ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Generated Code
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 
                             hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <div className="h-[400px] border rounded-lg overflow-hidden">
                      <CodeMirror
                        value={editedCode}
                        height="400px"
                        theme={theme === 'dark' ? vscodeDark : undefined}
                        extensions={[javascript({ jsx: true })]}
                        onChange={setEditedCode}
                        style={{
                          fontSize: '0.875rem',
                          lineHeight: '1.25rem',
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="h-[400px] border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                    <CodeLivePreview code={editedCode} framework="html" />
                  </div>
                </div>

                {response.similarPrompts && response.similarPrompts.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Similar Previous Prompts
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {response.similarPrompts.map((item, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs
                                   bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                        >
                          {item.prompt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
