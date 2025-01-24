import React from "react"

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}
