import { useState } from 'react'

import { ChevronLeft, ChevronRight, FolderX, SearchX } from 'lucide-react'

import { usePrograms } from '@/modules/business-simulation/api/queries/usePrograms'
import { ProgramCard } from '@/modules/business-simulation/components/ProgramCard'
import { ProgramsFilterBar } from '@/modules/business-simulation/components/ProgramsFilterBar'
import type { ListProgramsParams } from '@/modules/business-simulation/types/program.types'
import { Spinner } from '@/shared/ui/custom/Spinner'
import { EmptyState } from '@/shared/ui/custom/EmptyState'

const PAGE_SIZE = 9

export function ProgramsLibraryPage() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<Omit<ListProgramsParams, 'page' | 'page_size'>>({})

  const { data, isLoading, isError, isFetching } = usePrograms({
    ...filters,
    page,
    page_size: PAGE_SIZE,
  })

  const programs = data?.results ?? []
  const total = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  const handleFilterChange = (key: keyof ListProgramsParams, value: any) => {
    setPage(1) // Reset to first page when filter changes
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const hasActiveFilters = Object.values(filters).some(
    (val) => val !== null && val !== undefined && val !== ''
  )

  return (
    <div>
      {/* Header section */}
      <div className="mb-8">
        <h2 className="mb-2 text-xs font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
          Programs
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold text-[var(--color-foreground)] tracking-tight">
              Simulations library
            </h1>
            <p className="max-w-2xl text-[var(--color-text-muted)]">
              Every business simulation available across your workspace. Filter by mentor, cohort,
              status and more — click a card to open the program.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isFetching ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span>
                {isFetching ? 'Loading...' : `${total} program${total !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <ProgramsFilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      ) : isError ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] text-[var(--color-destructive)]">
          Failed to load programs.
        </div>
      ) : programs.length > 0 ? (
        <>
          <div
            className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
          >
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between border-t border-[var(--color-card-border)] pt-6">
              <p className="text-sm text-[var(--color-text-muted)]">
                Showing{' '}
                <span className="font-semibold text-[var(--color-foreground)]">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-[var(--color-foreground)]">{total}</span>{' '}
                programs
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="flex items-center gap-1.5 rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-ghost-bg)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        disabled={isFetching}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed ${
                          pageNum === page
                            ? 'bg-[var(--color-brand)] text-[var(--color-brand-on)]'
                            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-ghost-bg)] hover:text-[var(--color-foreground)]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="flex items-center gap-1.5 rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-ghost-bg)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-12">
          {hasActiveFilters ? (
            <EmptyState
              icon={<SearchX className="h-6 w-6" />}
              title="No matches found"
              description="We couldn't find any programs matching your filters. Try adjusting your search criteria."
              action={
                <button
                  onClick={() => { setFilters({}); setPage(1) }}
                  className="rounded-lg border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-ghost-bg)]"
                >
                  Clear all filters
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<FolderX className="h-6 w-6" />}
              title="No programs yet"
              description="There are currently no business simulations available in your workspace."
            />
          )}
        </div>
      )}
    </div>
  )
}
