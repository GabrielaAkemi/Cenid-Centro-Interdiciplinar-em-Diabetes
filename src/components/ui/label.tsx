"use client"
import React, { FC, LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
}

export const Label: FC<LabelProps> = ({ children, className, ...props }) => (
  <label
    className={`block text-sm font-medium text-gray-700 mb-1 ${className || ""}`}
    {...props}
  >
    {children}
  </label>
);
