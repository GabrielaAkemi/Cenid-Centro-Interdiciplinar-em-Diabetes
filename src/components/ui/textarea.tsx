"use client"
import { TextareaHTMLAttributes } from "react"

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea {...props} className="w-full border rounded-md p-2 focus:ring-2 focus:ring-teal-500" />
)
