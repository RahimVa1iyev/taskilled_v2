import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/utils/cn'

export interface SheetProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  className?: string
  hideCloseButton?: boolean
}

export function Sheet({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideCloseButton = false,
}: SheetProps) {
  // Prevent scrolling when sheet is open
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

  const sheetContent = (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 200 
            }}
            className={cn(
              "relative w-full max-w-lg h-full flex flex-col",
              "bg-white shadow-2xl border-l border-zinc-200",
              className
            )}
          >
            {/* Header */}
            {(title || !hideCloseButton) && (
              <div className="flex items-center px-5 py-4 border-b border-zinc-200 shrink-0">
                {title && (
                  <h2 className="text-[18px] font-bold text-zinc-900 truncate pr-4">
                    {title}
                  </h2>
                )}
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors focus:outline-none"
                    aria-label="Close sheet"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  if (typeof document === 'undefined') return null

  return createPortal(sheetContent, document.body)
}
