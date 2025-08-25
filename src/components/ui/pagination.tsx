"use client";

import React from "react";

/**
 * Container do componente de paginação.
 */
export const Pagination = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <nav className={`flex items-center justify-center space-x-2 mt-4 ${className || ""}`}>
    {children}
  </nav>
);

/**
 * Wrapper para os botões da paginação.
 */
export const PaginationContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`flex items-center space-x-1 ${className || ""}`}>{children}</div>
);

/**
 * Botão de página individual (com suporte a ativo e desabilitado).
 */
export const PaginationButton = ({
  onClick,
  active,
  disabled,
  children,
}: {
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-3 py-1 rounded-md border border-gray-200 
      text-sm font-medium transition-colors
      ${active ? "text-teal-600 font-semibold" : "text-gray-600"} 
      ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-50"}
    `}
    type="button"
  >
    {children}
  </button>
);

/**
 * Função utilitária para gerar a lista de páginas (com reticências se necessário).
 */
export function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
      );
    }
  }
  return pages;
}