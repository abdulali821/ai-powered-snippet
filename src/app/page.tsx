'use client';

import AiPrompt from '@/components/AiPrompt';
import { motion } from 'framer-motion';
import { FiCode, FiZap, FiLayout, FiSmartphone } from 'react-icons/fi';
import AnimatedBackground from '@/components/AnimatedBackground';
import CodeIllustration from '@/components/CodeIllustration';
import ThemeToggle from '@/components/ThemeToggle';
import { useScrollTo } from '@/hooks/useScrollTo';

const features = [
  {
    icon: <FiCode className="w-6 h-6" />,
    title: 'Pure Code Generation',
    description: 'Generate clean HTML, CSS, and JavaScript code - no frameworks, just vanilla web technologies'
  },
  {
    icon: <FiZap className="w-6 h-6" />,
    title: 'Instant Preview',
    description: 'See your changes in real-time with our live preview feature'
  },
  {
    icon: <FiLayout className="w-6 h-6" />,
    title: 'Modern UI Components',
    description: 'Create beautiful, responsive UI components with Tailwind CSS'
  },
  {
    icon: <FiSmartphone className="w-6 h-6" />,
    title: 'Mobile-First Design',
    description: 'All generated code is fully responsive and mobile-optimized'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

export default function Home() {
  const scrollTo = useScrollTo();

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
      </div>
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <CodeIllustration />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
          >
            AI Powered Snippet Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto"
          >
            Transform your ideas into beautiful, responsive code snippets with the power of AI.
            Just describe what you want, and watch the magic happen.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-md text-blue-600 dark:text-blue-400 mb-8 max-w-2xl mx-auto font-medium"
          >
            Specializing in vanilla HTML, CSS, and JavaScript code generation only.
            No framework-specific code (React, Vue, Angular, etc.).
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <motion.button
              onClick={() => scrollTo('generator')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try it Now
            </motion.button>
            <motion.button
              onClick={() => scrollTo('features')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          id="features"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-blue-500 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          id="generator"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
        >
          <AiPrompt />
        </motion.div>
      </motion.div>
    </main>
  );
}
