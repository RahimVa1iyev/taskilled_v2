import { Link } from 'react-router-dom'
import { Calendar, Clock, GraduationCap, User } from 'lucide-react'

import { useCategories } from '@/modules/business-simulation/api/queries/useCategories'
import type { ProgramResponse } from '@/modules/business-simulation/types/program.types'

interface ProgramCardProps {
  program: ProgramResponse
}

export function ProgramCard({ program }: ProgramCardProps) {
  // Format the date
  const dateStr = new Date(program.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  // Format price
  const priceDisplay =
    program.price === 0
      ? 'FREE'
      : `${program.price} ${program.currency}`

  // Status color mapping (backend returns lowercase: 'published', 'draft', 'archived')
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'bg-green-500/10 text-green-500'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'archived':
        return 'bg-gray-500/10 text-gray-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  // Capitalize status label for display
  const statusLabel = program.status
    ? program.status.charAt(0).toUpperCase() + program.status.slice(1).toLowerCase()
    : program.status

  // Category mapping (Mock for now, normally we would have a category name from backend or join it)
  // The API returns categoryId. We will just show a static category name or mapping for visual consistency.
  // We can pass category name as prop later, but for now we'll do a simple switch or just show "Category"
  const getCategoryColor = (categoryId: number) => {
    const colors = [
      'bg-blue-500/10 text-blue-500',
      'bg-purple-500/10 text-purple-500',
      'bg-pink-500/10 text-pink-500',
      'bg-indigo-500/10 text-indigo-500',
    ]
    return colors[categoryId % colors.length]
  }

  const { data: categories } = useCategories()
  const categoryName =
    categories?.find((c) => c.id === program.categoryId)?.name || `Category ${program.categoryId}`

  return (
    <Link 
      to={`/programs/${program.id}`}
      className="flex flex-col justify-between rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6 transition-all hover:shadow-md cursor-pointer hover:border-[--color-brand]/50"
    >
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
              program.status,
            )}`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${getStatusColor(program.status).replace(
                'bg-',
                'bg-current ',
              )}`}
              style={{ backgroundColor: 'currentColor' }}
            />
            {statusLabel}
          </div>
          <div
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              priceDisplay === 'FREE'
                ? 'bg-green-500/10 text-green-500'
                : 'bg-purple-500/10 text-purple-500'
            }`}
          >
            {priceDisplay}
          </div>
        </div>

        <h3 className="mb-2 text-xl font-bold text-[var(--color-foreground)] line-clamp-2">
          {program.title}
        </h3>
        <p className="mb-6 text-sm text-[var(--color-text-muted)] line-clamp-3">
          {program.description}
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          {/* Category Chip */}
          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${getCategoryColor(
              program.categoryId,
            )}`}
          >
            {categoryName}
          </div>

          {/* Duration Chip */}
          {program.durationWeeks > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-ghost-bg)] px-3 py-1 text-xs font-medium text-[var(--color-ghost-fg)]">
              <Clock className="h-3 w-3" />
              {program.durationWeeks}w
            </div>
          )}

          {/* Mentor Chip */}
          {program.hasMentor && (
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-ghost-bg)] px-3 py-1 text-xs font-medium text-[var(--color-ghost-fg)]">
              <User className="h-3 w-3" />
              Mentor
            </div>
          )}

          {/* Cohort Chip */}
          {program.hasCohort && (
            <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-ghost-bg)] px-3 py-1 text-xs font-medium text-[var(--color-ghost-fg)]">
              <GraduationCap className="h-3 w-3" />
              Cohort
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--color-card-border)] pt-4 text-xs font-medium text-[var(--color-text-muted)]">
        <Calendar className="h-4 w-4" />
        {dateStr}
      </div>
    </Link>
  )
}
