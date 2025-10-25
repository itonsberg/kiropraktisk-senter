import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'dark'
}

export function Section({ children, className = '', variant = 'default' }: SectionProps) {
  return (
    <section className={`relative z-10 py-24 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

export function SectionHeader({ title, description, className = '' }: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="text-xl text-gray-700 dark:text-white/80 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'light' | 'glass'
}

export function Card({ children, className = '', variant = 'light' }: CardProps) {
  const baseClasses = 'rounded-2xl backdrop-blur transition-all'
  const variantClasses = {
    light: 'bg-[#f9f9f9] dark:bg-black/20 ring-1 ring-gray-200 dark:ring-white/15',
    glass: 'bg-white/5 ring-1 ring-white/10'
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-8 ${className}`}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-xl font-semibold mb-4 text-gray-900 dark:text-white ${className}`}>
      {children}
    </h3>
  )
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`text-gray-700 dark:text-white/80 leading-relaxed ${className}`}>
      {children}
    </p>
  )
}

interface IconWrapperProps {
  children: ReactNode
  className?: string
}

export function IconWrapper({ children, className = '' }: IconWrapperProps) {
  return (
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-[#d6c5ab]/30 ring-1 ring-gray-200 dark:ring-[#d6c5ab]/40 mb-6 ${className}`}>
      {children}
    </div>
  )
}
