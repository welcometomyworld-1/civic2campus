import React from 'react';
import { MinimalistAuthCard } from '../auth/MinimalistAuthCard';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-5xl my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full text-white/70 hover:text-white bg-black/30 hover:bg-black/50 backdrop-blur-md transition-colors cursor-pointer"
            id="auth-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <MinimalistAuthCard onSuccess={onClose} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
