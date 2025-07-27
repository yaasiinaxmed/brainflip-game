"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

function CustomDialog({ open, onOpenChange, children }: CustomDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div
        className="fixed inset-0"
        onClick={() => onOpenChange(false)} // Close dialog when clicking outside
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
        {children}
      </div>
    </div>
  )
}

interface CustomDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomDialogContent({ className, ...props }: CustomDialogContentProps) {
  return <div className={cn("bg-background p-6 shadow-lg duration-200 sm:rounded-lg", className)} {...props} />
}

interface CustomDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function CustomDialogHeader({ className, ...props }: CustomDialogHeaderProps) {
  return <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
}

interface CustomDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

function CustomDialogTitle({ className, ...props }: CustomDialogTitleProps) {
  return <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
}

interface CustomDialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function CustomDialogDescription({ className, ...props }: CustomDialogDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogDescription }
