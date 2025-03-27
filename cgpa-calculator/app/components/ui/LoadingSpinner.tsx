import { motion } from 'framer-motion';
import { GraduationCap, Book, Calculator } from 'lucide-react';

interface LoadingSpinnerProps {
  progress: number;
}

export const LoadingSpinner = ({ progress }: LoadingSpinnerProps) => {
  const iconVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  };

  const messages = [
    "Fetching your academic records...",
    "Calculating your grades...",
    "Almost there...",
  ];

  const currentMessage = messages[Math.floor((progress / 100) * messages.length)] || messages[0];

  return (
    <motion.div
      role="progressbar"
      aria-label="Loading progress"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-lg mx-auto mb-8"
    >
      <div className="space-y-6">
        {/* Animated Icons */}
        <div className="flex justify-center gap-8">
          {[GraduationCap, Book, Calculator].map((Icon, index) => (
            <motion.div
              key={index}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              transition={{
                delay: index * 0.2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1
              }}
            >
              <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {/* Animated Pulse Dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"
            initial={{ left: "0%" }}
            animate={{ left: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            />
          </motion.div>
        </div>

        {/* Status Message */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-600 dark:text-gray-300 text-center"
          >
            {currentMessage}
          </motion.p>
          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};
