import { motion } from 'framer-motion';
import { GraduationCap, Book, Calculator } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  isRedirecting?: boolean;
}

export const LoadingSpinner = ({ message, isRedirecting = false }: LoadingSpinnerProps) => {

  const defaultMessage = isRedirecting ? "Results found! Redirecting..." : "Searching for your results...";
  const displayMessage = message || defaultMessage;

  return (
    <motion.div
      role="status"
      aria-label="Loading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-sm w-full max-w-lg mx-auto mb-8 overflow-hidden"
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="space-y-8 relative z-10">
        <div className="flex justify-center gap-10">
          {[GraduationCap, Book, Calculator].map((Icon, index) => (
            <motion.div
              key={index}
              className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 relative"
              style={{ perspective: 1000 }}
              whileHover={{ scale: 1.1, rotateY: 180 }}
              animate={{
                y: [0, -8, 0],
                rotateX: [0, 10, 0],
                rotateY: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                delay: index * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Icon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              <motion.div
                className="absolute inset-0 bg-blue-500 opacity-10 rounded-xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          ))}
        </div>

        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 background-animate"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="flex flex-col items-center gap-3">
          <motion.p
            key={displayMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold"
          >
            {displayMessage}
          </motion.p>
          {isRedirecting && (
            <motion.div 
              className="relative"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <span className="text-blue-600 dark:text-blue-400 font-bold relative z-10">
                Please wait...
              </span>
              <motion.div
                className="absolute inset-0 bg-blue-400 opacity-20 blur-lg rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
