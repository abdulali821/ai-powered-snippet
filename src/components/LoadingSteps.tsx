'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const steps = [
  { id: 1, text: 'Analyzing your request...' },
  { id: 2, text: 'Creating HTML structure...' },
  { id: 3, text: 'Styling with CSS...' },
  { id: 4, text: 'Adding JavaScript functionality...' },
  { id: 5, text: 'Optimizing and structuring code...' },
];

export default function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: index <= currentStep ? 1 : 0.3,
            y: 0,
          }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{
              scale: index <= currentStep ? 1 : 0,
              backgroundColor: index < currentStep ? '#22c55e' : '#3b82f6',
            }}
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
          >
            {index < currentStep ? '✓' : step.id}
          </motion.div>
          <div className="ml-4">
            <p className="text-gray-700 dark:text-gray-300">{step.text}</p>
            {index <= currentStep && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
                className="h-0.5 bg-blue-500 mt-1"
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
