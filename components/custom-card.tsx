import type * as React from "react"
import { cn } from "@/lib/utils"

interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomCard({ className, ...props }: CustomCardProps) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
}

interface CustomCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomCardContent({ className, ...props }: CustomCardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />
}

export { CustomCard, CustomCardContent }
