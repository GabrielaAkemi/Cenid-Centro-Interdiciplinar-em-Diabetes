import React, { FC, InputHTMLAttributes } from "react";

export const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    className={`border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 ${className || ""}`}
    {...props}
  />
);
