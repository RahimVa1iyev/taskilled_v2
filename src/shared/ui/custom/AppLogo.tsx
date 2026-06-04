import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export interface AppLogoProps {
  href?: string
  variant?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE = {
  sm: { fontSize: 18, lineHeight: 22, barWidth: 32, totalWidth: 130, totalHeight: 28 },
  md: { fontSize: 22, lineHeight: 27, barWidth: 40, totalWidth: 160, totalHeight: 34 },
  lg: { fontSize: 26, lineHeight: 32, barWidth: 48, totalWidth: 190, totalHeight: 40 },
}

const COLOR = {
  dark:  { text: '#FFFFFF', barRight: '#1E293B' },
  light: { text: '#0F172A', barRight: '#E2E8F0' },
}

export function AppLogo({ href = '/', variant = 'dark', size = 'md', className }: AppLogoProps) {
  const s = SIZE[size]
  const c = COLOR[variant]

  const logo = (
    <svg
      width={s.totalWidth}
      height={s.totalHeight}
      viewBox={`0 0 ${s.totalWidth} ${s.totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Taskilled"
    >
      <text
        x="0"
        y={s.lineHeight}
        fontFamily="system-ui,-apple-system,BlinkMacSystemFont,sans-serif"
        fontWeight="800"
        fontSize={s.fontSize}
        fill={c.text}
        letterSpacing="-1"
      >
        taskilled
      </text>
      {/* Brand accent bar — "task" portion */}
      <rect
        x="0"
        y={s.lineHeight + 5}
        width={s.barWidth}
        height="3"
        rx="1.5"
        fill="#D1E728"
      />
      {/* Muted bar — "illed" portion */}
      <rect
        x={s.barWidth + 4}
        y={s.lineHeight + 5}
        width={s.totalWidth - s.barWidth - 4}
        height="3"
        rx="1.5"
        fill={c.barRight}
      />
    </svg>
  )

  if (!href) return <span className={cn('inline-flex', className)}>{logo}</span>

  return (
    <Link
      to={href}
      className={cn('inline-flex', className)}
      aria-label="Taskilled — ana səhifə"
    >
      {logo}
    </Link>
  )
}
