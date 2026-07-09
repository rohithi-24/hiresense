type ButtonProps = {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline"
  onClick?: () => void
  type?: "button" | "submit"
  disabled?: boolean
  className?: string
}

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const base = "px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer"

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-indigo-200",
    secondary: "bg-violet-600 text-white hover:bg-violet-700",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  )
}