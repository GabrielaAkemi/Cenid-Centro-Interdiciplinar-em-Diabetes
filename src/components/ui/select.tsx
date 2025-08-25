import React, { FC, ReactNode, SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const Select: FC<SelectProps> = ({ children, className, value, onChange, onValueChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <select
      className={`border rounded-md p-2 ${className || ""}`}
      value={value}
      onChange={handleChange}
      {...props}
    >
      {children}
    </select>
  );
};

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: ReactNode;
}

export const SelectItem: FC<SelectItemProps> = ({ value, children, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
);