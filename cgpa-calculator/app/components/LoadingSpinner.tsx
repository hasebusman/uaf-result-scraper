import { motion } from 'framer-motion';
import { GraduationCap, Book, Calculator } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  isRedirecting?: boolean;
}

export const LoadingSpinner = ({ message, isRedirecting = false }: LoadingSpinnerProps) => {
  const iconVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 }
  };

  const defaultMessage = isRedirecting ? "Results found! Redirecting..." : "Searching for your results...";
  const displayMessage = message || defaultMessage;

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-lg mx-auto mb-8"
    >
      <div className="space-y-6">
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

        <div className="flex justify-center">
          <motion.div
            className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.p
            key={displayMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-600 dark:text-gray-300 text-center font-medium"
          >
            {displayMessage}
          </motion.p>
          {isRedirecting && (
            <motion.div 
              className="text-blue-600 dark:text-blue-400 font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Please wait...
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
