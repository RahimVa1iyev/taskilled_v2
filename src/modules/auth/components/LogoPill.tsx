import { cn } from '@/shared/utils/cn'
import logo from '@/assets/logo.png'
interface LogoPillProps {
  size?: 'sm' | 'md'
  className?: string
}

export function LogoPill({ size = 'md', className }: LogoPillProps): React.JSX.Element {
  const h = size === 'md' ? 'h-8' : 'h-7'
  return <img src={logo} alt="Taskilled" className={cn(h, 'w-auto', className)} />
}

