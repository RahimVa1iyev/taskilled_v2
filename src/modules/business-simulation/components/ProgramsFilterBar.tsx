import { useState } from 'react'
import { LayoutGrid, List, Search, SlidersHorizontal, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useCategories } from '@/modules/business-simulation/api/queries/useCategories'
import type { ListProgramsParams } from '@/modules/business-simulation/types/program.types'

interface ProgramsFilterBarProps {
  filters: ListProgramsParams
  onFilterChange: (key: keyof ListProgramsParams, value: any) => void
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder = 'Any',
}: {
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { label: string; value: string | number }[]
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none cursor-pointer rounded-[10px] border border-[var(--color-border-soft,rgba(0,0,0,0.08))] bg-[var(--color-ghost-bg)] px-3 py-2 pr-9 text-[13px] font-medium text-[var(--color-foreground)] outline-none transition-colors hover:bg-[var(--color-card-bg)] focus:border-[var(--color-brand)] focus:bg-[var(--color-card-bg)] focus:ring-1 focus:ring-[var(--color-brand)]"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function ProgramsFilterBar({ filters, onFilterChange }: ProgramsFilterBarProps) {
  const { data: categories } = useCategories()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Count active filters (excluding search)
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => key !== 'search' && value !== null && value !== undefined && value !== ''
  ).length

  const clearFilters = () => {
    onFilterChange('categoryId', null)
    onFilterChange('status', null)
    onFilterChange('currency', null)
    onFilterChange('hasMentor', null)
    onFilterChange('hasCohort', null)
  }

  const getActiveFiltersList = () => {
    const list: { key: keyof ListProgramsParams; label: string }[] = []

    if (filters.categoryId) {
      const cat = categories?.find((c) => c.id === filters.categoryId)
      if (cat) list.push({ key: 'categoryId', label: `Category: ${cat.name}` })
    }
    if (filters.status) {
      list.push({ key: 'status', label: `Status: ${filters.status}` })
    }
    if (filters.currency) {
      list.push({ key: 'currency', label: `Currency: ${filters.currency}` })
    }
    if (filters.hasMentor !== null && filters.hasMentor !== undefined) {
      list.push({ key: 'hasMentor', label: `Mentor: ${filters.hasMentor ? 'Yes' : 'No'}` })
    }
    if (filters.hasCohort !== null && filters.hasCohort !== undefined) {
      list.push({ key: 'hasCohort', label: `Cohort: ${filters.hasCohort ? 'Yes' : 'No'}` })
    }

    return list
  }

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-placeholder)]" />
          <input
            type="text"
            placeholder="Search programs by title or description..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] py-3 pl-10 pr-4 text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-text-placeholder)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`relative flex items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--color-card-border)] px-4 py-2.5 text-sm font-medium transition-colors ${
              isFiltersOpen || activeFiltersCount > 0
                ? 'bg-[var(--color-ghost-bg)] text-[var(--color-foreground)]'
                : 'bg-[var(--color-card-bg)] text-[var(--color-foreground)] hover:bg-[var(--color-ghost-bg)]'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)] text-[10px] font-bold text-[var(--color-brand-on)] shadow-sm">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1 rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-1">
            <button className="rounded-lg bg-[var(--color-ghost-bg)] p-1.5 text-[var(--color-foreground)] shadow-sm transition-colors hover:bg-[var(--color-ghost-bg)] hover:text-[var(--color-foreground)]">
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-ghost-bg)] hover:text-[var(--color-foreground)]">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-[var(--color-text-muted)]">Active filters:</span>
          {getActiveFiltersList().map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-card-border)] bg-[var(--color-card-bg)] px-2.5 py-1 text-xs font-medium text-[var(--color-foreground)] shadow-sm transition-colors hover:border-[var(--color-border-soft)]"
            >
              <span className="capitalize">{f.label}</span>
              <button
                onClick={() => onFilterChange(f.key, null)}
                className="rounded-full p-0.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-ghost-bg)] hover:text-[var(--color-foreground)]"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button
            onClick={clearFilters}
            className="ml-2 text-xs font-medium text-[var(--color-text-muted)] underline transition-colors hover:text-[var(--color-foreground)]"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Expandable Secondary Filters */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">Advanced Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500 transition-colors hover:text-red-600"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
                <FilterSelect
                  label="Category"
                  placeholder="All Categories"
                  value={filters.categoryId || ''}
                  onChange={(e) =>
                    onFilterChange('categoryId', e.target.value ? Number(e.target.value) : null)
                  }
                  options={
                    categories?.map((c) => ({ label: c.name, value: c.id })) || []
                  }
                />

                <FilterSelect
                  label="Status"
                  placeholder="Any Status"
                  value={filters.status || ''}
                  onChange={(e) => onFilterChange('status', e.target.value || null)}
                  options={[
                    { label: 'Published', value: 'published' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Archived', value: 'archived' },
                  ]}
                />

                <FilterSelect
                  label="Currency"
                  placeholder="All Currencies"
                  value={filters.currency || ''}
                  onChange={(e) => onFilterChange('currency', e.target.value || null)}
                  options={[
                    { label: 'AZN', value: 'AZN' },
                    { label: 'USD', value: 'USD' },
                  ]}
                />

                <FilterSelect
                  label="Mentor"
                  placeholder="Any"
                  value={filters.hasMentor === null ? '' : String(filters.hasMentor)}
                  onChange={(e) => {
                    const val = e.target.value
                    onFilterChange('hasMentor', val === '' ? null : val === 'true')
                  }}
                  options={[
                    { label: 'Has Mentor', value: 'true' },
                    { label: 'No Mentor', value: 'false' },
                  ]}
                />

                <FilterSelect
                  label="Cohort"
                  placeholder="Any"
                  value={filters.hasCohort === null ? '' : String(filters.hasCohort)}
                  onChange={(e) => {
                    const val = e.target.value
                    onFilterChange('hasCohort', val === '' ? null : val === 'true')
                  }}
                  options={[
                    { label: 'Has Cohort', value: 'true' },
                    { label: 'No Cohort', value: 'false' },
                  ]}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
