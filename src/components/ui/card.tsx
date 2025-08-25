import React, { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white shadow rounded-lg p-4 ${className || ""}`}>{children}</div>
);

export const CardHeader: FC<CardProps> = ({ children, className }) => (
  <div className={`mb-2 ${className || ""}`}>{children}</div>
);

export const CardTitle: FC<CardProps> = ({ children, className }) => (
  <h3 className={`text-lg font-semibold ${className || ""}`}>{children}</h3>
);

export const CardDescription: FC<CardProps> = ({ children, className }) => (
  <p className={`text-sm text-gray-500 ${className || ""}`}>{children}</p>
);

export const CardContent: FC<CardProps> = ({ children, className }) => (
  <div className={`mt-2 ${className || ""}`}>{children}</div>
);
