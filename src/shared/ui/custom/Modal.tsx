import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/utils/cn'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
  hideCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  hideCloseButton = false,
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
  }, [isOpen])

  // Cleanup on unmount to be safe
  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleExitComplete = () => {
    if (!isOpen) {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }

  const modalContent = (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300 
            }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden",
              "bg-white dark:bg-zinc-950",
              "rounded-3xl border border-zinc-200 dark:border-zinc-800",
              "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]",
              className
            )}
          >
            {/* Header */}
            {(title || description || !hideCloseButton) && (
              <div className="relative px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors focus:outline-none"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                
                {title && (
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 pr-8">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1.5 text-[14px] text-zinc-500 dark:text-zinc-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  // Wait for document.body to be available (SSR safety, though Vite is CSR)
  if (typeof document === 'undefined') return null

  return createPortal(modalContent, document.body)
}
