
"use client";

import { useState, type FormEvent } from "react";

export type PropertyFilters = {
  location: string;
  minPrice: string;
  maxPrice: string;
};

type PropertyFilterProps = {
  onSearch: (filters: PropertyFilters) => void;
};

const emptyFilters: PropertyFilters = {
  location: "",
  minPrice: "",
  maxPrice: "",
};

export default function PropertyFilter({
  onSearch,
}: PropertyFilterProps) {
  const [filters, setFilters] = useState<PropertyFilters>(emptyFilters);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-lg border p-6"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <input
          aria-label="Location"
          placeholder="Location"
          value={filters.location}
          onChange={(event) =>
            setFilters({
              ...filters,
              location: event.target.value,
            })
          }
          className="rounded-md border px-4 py-2"
        />

        <input
          aria-label="Minimum price"
          placeholder="Min Price"
          type="number"
          min="0"
          value={filters.minPrice}
          onChange={(event) =>
            setFilters({
              ...filters,
              minPrice: event.target.value,
            })
          }
          className="rounded-md border px-4 py-2"
        />

        <input
          aria-label="Maximum price"
          placeholder="Max Price"
          type="number"
          min="0"
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters({
              ...filters,
              maxPrice: event.target.value,
            })
          }
          className="rounded-md border px-4 py-2"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border px-5 py-2 text-sm font-medium hover:bg-muted"
        >
          Clear Filters
        </button>

        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Search Properties
        </button>
      </div>
    </form>
  );
}
