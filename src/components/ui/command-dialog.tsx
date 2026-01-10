import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Search, X } from 'lucide-react'
import { cn } from '~/lib/utils'

interface CommandDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function CommandDialog({ open, onOpenChange, children }: CommandDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 glass-card overflow-hidden">
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <div className="flex items-center border-b border-slate-700 px-4">
      <Search className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
      <input
        className={cn(
          'flex h-14 w-full bg-transparent py-3 text-base text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono',
          className
        )}
        {...props}
      />
    </div>
  )
}

interface CommandListProps {
  children: React.ReactNode
  className?: string
}

export function CommandList({ children, className }: CommandListProps) {
  return (
    <div className={cn('max-h-80 overflow-y-auto p-2', className)}>
      {children}
    </div>
  )
}

interface CommandEmptyProps {
  children: React.ReactNode
}

export function CommandEmpty({ children }: CommandEmptyProps) {
  return (
    <div className="py-6 text-center text-sm text-slate-400">
      {children}
    </div>
  )
}

interface CommandGroupProps {
  heading?: string
  children: React.ReactNode
}

export function CommandGroup({ heading, children }: CommandGroupProps) {
  return (
    <div className="py-2">
      {heading && (
        <div className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase tracking-wider">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
}

interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void
  disabled?: boolean
}

export function CommandItem({ className, onSelect, disabled, children, ...props }: CommandItemProps) {
  return (
    <div
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-slate-800 text-slate-200',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      onClick={onSelect}
      {...props}
    >
      {children}
    </div>
  )
}
