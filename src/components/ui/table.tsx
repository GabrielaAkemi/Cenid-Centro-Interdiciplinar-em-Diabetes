// src/components/ui/table.tsx
"use client";

import React from "react";

// -------------------- Table --------------------
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <table className={`min-w-full border-collapse ${className || ""}`} {...props}>
      {children}
    </table>
  );
};

// -------------------- TableHeader --------------------
interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
};

// -------------------- TableBody --------------------
interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

// -------------------- TableRow --------------------
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr className={`${className || ""}`} {...props}>
      {children}
    </tr>
  );
};

// -------------------- TableHead --------------------
interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => {
  return (
    <th
      className={`px-4 py-2 text-left font-medium text-green-900 bg-green-100 border-b border-green-200 ${className || ""}`}
      {...props}
    >
      {children}
    </th>
  );
};

// -------------------- TableCell --------------------
interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell: React.FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td
      className={`px-4 py-2 border-b border-green-200 ${className || ""}`}
      {...props} // aqui passa colSpan, onClick, etc
    >
      {children}
    </td>
  );
};
