import { motion } from 'framer-motion';
import { GraduationCap, Book, Calculator } from 'lucide-react';

interface LoadingSpinnerProps {
  progress: number;
}

export const LoadingSpinner = ({ progress }: LoadingSpinnerProps) => {
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
      className="bg-white rounded-2xl p-8 border border-stone-200 w-full max-w-lg mx-auto"
    >
      <div className="space-y-6">
        {/* Animated Icons */}
        <div className="flex justify-center gap-8">
          {[
            { Icon: GraduationCap, delay: 0 },
            { Icon: Book, delay: 0.2 },
            { Icon: Calculator, delay: 0.4 }
          ].map(({ Icon, delay }, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 1
              }}
              className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center"
            >
              <Icon className="w-6 h-6 text-stone-600" />
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div className="flex flex-col items-center gap-2">
          <motion.p
            key={currentMessage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-stone-500 text-center"
          >
            {currentMessage}
          </motion.p>
          <span className="text-2xl font-bold text-stone-900">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};
