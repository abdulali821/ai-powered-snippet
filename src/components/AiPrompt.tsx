'use client';

import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import { useTheme } from 'next-themes';
import LivePreview from './LivePreview';
import LoadingSteps from './LoadingSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiCode, FiEye, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CodeResponse {
  code: string;
  language: string;
}

export default function AiPrompt() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<CodeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (response) {
      setEditedCode(response.code);
    }
  }, [response]);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    // Check for framework-specific keywords
    const frameworkKeywords = ['react', 'vue', 'angular', 'svelte', 'component', 'jsx', 'tsx'];
    const hasFrameworkKeywords = frameworkKeywords.some(keyword => 
      prompt.toLowerCase().includes(keyword)
    );

    if (hasFrameworkKeywords) {
      toast.error('This tool only generates vanilla HTML, CSS, and JavaScript code. Framework-specific code generation is not supported.');
      return;
    }

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

  if (!mounted) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={(e) => e.preventDefault()}
          className="w-full"
        >
          <div className="relative">
            <motion.textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the code you want to generate... (e.g., 'Create a responsive navigation bar with a logo and mobile menu')"
              className="w-full p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] sm:min-h-[100px] resize-none text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !prompt.trim()}
              className={`absolute bottom-4 sm:bottom-4 right-2 sm:right-2 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium text-white text-sm sm:text-base
                ${loading || !prompt.trim() 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}
                transition-colors duration-200`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Generating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiCode className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Generate</span>
                  <span className="sm:hidden">Generate</span>
                </div>
              )}
            </motion.button>
          </div>
        </motion.form>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full"
            >
              <LoadingSteps />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {showPreview ? (
                    <>
                      <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Show Editor
                    </>
                  ) : (
                    <>
                      <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      Show Preview
                    </>
                  )}
                </button>
                <motion.button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FiCopy className="w-3 h-3 sm:w-4 sm:h-4" />
                  {copied ? 'Copied!' : 'Copy Code'}
                </motion.button>
              </div>

              {showPreview ? (
                <LivePreview code={editedCode} />
              ) : (
                <div className="relative w-full overflow-hidden rounded-lg">
                  <CodeMirror
                    value={editedCode}
                    onChange={setEditedCode}
                    theme={theme === 'dark' ? vscodeDark : 'light'}
                    extensions={[javascript()]}
                    className="text-sm sm:text-base"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
