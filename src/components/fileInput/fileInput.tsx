import React, { forwardRef } from "react";

const FileInput = forwardRef<HTMLInputElement, { name: string; label?: string; multiple?: boolean }>(
  ({ name, label, multiple }, ref) => {
    return (
      <div className="space-y-2">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <input
          type="file"
          name={name}
          multiple={multiple}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-100 file:text-blue-700
            hover:file:bg-blue-200"
          ref={ref}
        />
      </div>
    );
  }
);

export default FileInput;
