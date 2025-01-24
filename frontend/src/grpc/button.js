import React from "react"

export const Button = ({ children, variant = "default", className, ...props }) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500 ", // Added margin
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
