type CardProps = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-2xl border border-gray-100
        shadow-sm hover:shadow-md transition-shadow duration-200
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  )
}