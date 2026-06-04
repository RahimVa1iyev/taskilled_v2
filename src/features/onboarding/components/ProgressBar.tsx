interface ProgressBarProps {
  width: string
  step: number
  total: number
}

export function ProgressBar({ width, step, total }: ProgressBarProps): React.JSX.Element {
  return (
    <>
      <div className="h-[4px] w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width }}
        />
      </div>
      <p className="mb-6 mt-1 text-right text-[10px] text-muted-foreground">
        Step {step} of {total}
      </p>
    </>
  )
}
