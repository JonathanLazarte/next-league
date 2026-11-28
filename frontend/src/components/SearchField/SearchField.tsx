"use client";

import { FaSearch } from "react-icons/fa";
import "./SearchField.css";

interface SearchFieldProps {
  placeholder: string;
  onChange: (value: string) => void;
  value?: string;
  className?: string;
  ariaLabel?: string;
}

export default function SearchField({
  placeholder,
  onChange,
  value,
  className,
  ariaLabel,
}: SearchFieldProps) {
  return (
    <div className={className ? `search-filter ${className}` : "search-filter"}>
      <FaSearch className="search-icon" aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
