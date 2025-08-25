import React, { FC, ButtonHTMLAttributes } from "react";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition ${className || ""}`}
    {...props}
  >
    {children}
  </button>
);

