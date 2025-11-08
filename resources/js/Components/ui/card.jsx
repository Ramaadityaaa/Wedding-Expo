import * as React from "react"

import { cn } from "@/lib/utils" // <-- Pastikan Anda sudah membuat utils.js

// Hapus: <HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
))
Card.displayName = "Card"

// Hapus: <HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Hapus: <HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Hapus: <HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Hapus: <HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Hapus: <HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }