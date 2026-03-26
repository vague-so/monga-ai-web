/**
 * CustomTable
 *
 * A fully-generic, reusable table component. Drop it anywhere and describe
 * your columns declaratively — no separate library required.
 *
 * Features
 * ────────
 *  • Strongly-typed column definitions (generics)
 *  • Global text search across all string-valued cells
 *  • Per-column select filters (enum-like filters)
 *  • Client-side sorting (asc / desc toggle)
 *  • Integrated pagination via <CustomPagination />
 *  • Loading skeleton and empty state
 *  • Optional row click handler
 *
 * Usage
 * ─────
 *  const columns: Column<MyType>[] = [
 *    { key: "name",   header: "Name",   sortable: true },
 *    { key: "status", header: "Status", sortable: true,
 *      cell: (row) => <StatusBadge status={row.status} />,
 *      filter: { label: "Status", options: [
 *        { label: "Active", value: "active" },
 *        { label: "Inactive", value: "inactive" },
 *      ]},
 *    },
 *  ];
 *
 *  <CustomTable data={myData} columns={columns} searchable />
 */

import React, { useMemo, useState } from "react";
import { CustomPagination } from "./CustomPagination";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/** A select-style filter attached to a single column. */
export interface ColumnFilter {
  /** Label shown above the dropdown. */
  label: string;
  /** All available options the user can pick from. */
  options: { label: string; value: string }[];
}

/** Definition for a single table column. */
export interface Column<T> {
  /**
   * The property key on your data object, or any unique string for
   * computed/custom columns.
   */
  key: keyof T | string;
  /** The text shown in the `<th>`. */
  header: string;
  /**
   * Custom cell renderer. Receives the full row and must return a
   * React node. If omitted the raw value is rendered as a string.
   */
  cell?: (row: T, index: number) => React.ReactNode;
  /** Allow the user to click the header to sort by this column. */
  sortable?: boolean;
  /** Text alignment for both the `<th>` and `<td>`. */
  align?: "left" | "center" | "right";
  /** Optional fixed width (CSS value, e.g. "120px" or "10%"). */
  width?: string;
  /**
   * If supplied, a select dropdown for this column appears in the
   * filter bar. The dropdown filters rows whose `key` value matches
   * the selected option.
   */
  filter?: ColumnFilter;
}

export interface CustomTableProps<T extends object> {
  /** The full dataset — the table handles filtering / sorting / paging. */
  data: T[];
  /** Column definitions. */
  columns: Column<T>[];
  /** Show a global full-text search box. */
  searchable?: boolean;
  /** Placeholder text for the search box. */
  searchPlaceholder?: string;
  /** Number of rows per page (default: 20). */
  defaultPageSize?: number;
  /** Show the loading skeleton instead of rows. */
  loading?: boolean;
  /** Slot rendered when the filtered result set is empty. */
  emptyState?: React.ReactNode;
  /** Called when the user clicks a row. */
  onRowClick?: (row: T, index: number) => void;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

// ─── Sort state ───────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc";

interface SortState {
  key: string;
  dir: SortDir;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Safely extract a primitive value from a row by column key. */
function getCellValue<T extends object>(row: T, key: string): unknown {
  return (row as Record<string, unknown>)[key];
}

/** Compare two scalar values for sorting. */
function compareValues(a: unknown, b: unknown, dir: SortDir): number {
  const factor = dir === "asc" ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return factor;
  if (b == null) return -factor;
  if (typeof a === "number" && typeof b === "number") return (a - b) * factor;
  return String(a).localeCompare(String(b)) * factor;
}

/** Check whether a row matches the global text search. */
function rowMatchesSearch<T extends object>(
  row: T,
  search: string,
  columns: Column<T>[],
): boolean {
  if (!search) return true;
  const needle = search.toLowerCase();
  return columns.some((col) => {
    const v = getCellValue(row, col.key as string);
    return v != null && String(v).toLowerCase().includes(needle);
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SortIcon({ dir, active }: { dir: SortDir | null; active: boolean }) {
  return (
    <span className="ml-1.5 inline-flex flex-col gap-[2px]">
      <span
        className={cn(
          "block w-0 h-0 border-l-[4px] border-r-[4px] border-b-[5px] border-l-transparent border-r-transparent transition-colors",
          active && dir === "asc" ? "border-b-indigo-400" : "border-b-zinc-600",
        )}
      />
      <span
        className={cn(
          "block w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent transition-colors",
          active && dir === "desc"
            ? "border-t-indigo-400"
            : "border-t-zinc-600",
        )}
      />
    </span>
  );
}

function FilterSelect({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <label
        htmlFor={id}
        className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-lg border border-zinc-700/50 bg-zinc-800/60 px-3 text-xs text-zinc-300 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LoadingSkeleton({ rows, cols }: { rows: number; cols: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, ri) => (
        <tr key={ri} className="border-b border-zinc-800/30">
          {Array.from({ length: cols }).map((_, ci) => (
            <td key={ci} className="px-6 py-4">
              <div
                className="h-4 rounded-md bg-zinc-800/80 animate-pulse"
                style={{ width: `${60 + ((ri * 3 + ci * 7) % 30)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

//  Main component

export function CustomTable<T extends object>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = "Search…",
  defaultPageSize = 20,
  loading = false,
  emptyState,
  onRowClick,
  className,
}: CustomTableProps<T>) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);

  // Per-column filter values, keyed by column key string.
  const [colFilters, setColFilters] = useState<Record<string, string>>({});

  // ── Derived: filtered → sorted → paginated ────────────────────────────────

  const filtered = useMemo(() => {
    return data.filter((row) => {
      // 1. Global search
      if (!rowMatchesSearch(row, search, columns)) return false;

      // 2. Per-column filters
      for (const [key, filterValue] of Object.entries(colFilters)) {
        if (!filterValue) continue;
        const cell = getCellValue(row, key);
        if (String(cell) !== filterValue) return false;
      }

      return true;
    });
  }, [data, search, colFilters, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) =>
      compareValues(
        getCellValue(a, sort.key),
        getCellValue(b, sort.key),
        sort.dir,
      ),
    );
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  // Reset to page 1 whenever filters/search change.
  const stableFilters = JSON.stringify({ search, colFilters });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    setPage(1);
  }, [stableFilters]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleSort(colKey: string) {
    setSort((prev) => {
      if (prev?.key !== colKey) return { key: colKey, dir: "asc" };
      if (prev.dir === "asc") return { key: colKey, dir: "desc" };
      return null; // third click clears sort
    });
  }

  function handleColFilter(key: string, value: string) {
    setColFilters((prev) => ({ ...prev, [key]: value }));
  }

  // ── Filter columns (those that declare a filter) ───────────────────────────
  const filterColumns = columns.filter((c) => c.filter);

  const hasFilterBar = searchable || filterColumns.length > 0;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "flex flex-col gap-0 glass rounded-2xl overflow-hidden border-zinc-800/50",
        className,
      )}
    >
      {/* ── Filter bar ── */}
      {hasFilterBar && (
        <div className="flex flex-wrap items-end gap-3 px-5 py-4 border-b border-zinc-800/40 bg-zinc-900/40">
          {/* Global search */}
          {searchable && (
            <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
              <label
                htmlFor="custom-table-search"
                className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500"
              >
                Search
              </label>
              <div className="relative">
                {/* Search icon */}
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                  />
                </svg>
                <input
                  id="custom-table-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 rounded-lg border border-zinc-700/50 bg-zinc-800/60 pl-8 pr-3 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          )}

          {/* Per-column select filters */}
          {filterColumns.map((col) => (
            <FilterSelect
              key={col.key as string}
              id={`filter-${col.key as string}`}
              label={col.filter!.label}
              options={col.filter!.options}
              value={colFilters[col.key as string] ?? ""}
              onChange={(v) => handleColFilter(col.key as string, v)}
            />
          ))}

          {/* Active filter count + clear */}
          {(search || Object.values(colFilters).some(Boolean)) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setColFilters({});
              }}
              className="self-end mb-0.5 h-8 px-3 rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 border border-zinc-700/50 hover:border-rose-500/40 bg-zinc-800/60 hover:bg-rose-500/5 transition-all"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-900/50 text-[11px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800/50">
              {columns.map((col) => {
                const isActive = sort?.key === (col.key as string);
                return (
                  <th
                    key={col.key as string}
                    style={{ width: col.width }}
                    className={cn(
                      "px-6 py-4 select-none",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.sortable &&
                        "cursor-pointer hover:text-zinc-300 transition-colors",
                    )}
                    onClick={() =>
                      col.sortable && handleSort(col.key as string)
                    }
                  >
                    <span className="inline-flex items-center">
                      {col.header}
                      {col.sortable && (
                        <SortIcon
                          dir={isActive ? sort!.dir : null}
                          active={isActive}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-800/30">
            {/* Loading skeleton */}
            {loading && <LoadingSkeleton rows={8} cols={columns.length} />}

            {/* Empty state */}
            {!loading && pageRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  {emptyState ?? (
                    <div className="flex flex-col items-center gap-2 text-zinc-600">
                      <svg
                        className="size-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
                        />
                      </svg>
                      <span className="text-sm">No results found.</span>
                    </div>
                  )}
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!loading &&
              pageRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={cn(
                    "group transition-colors",
                    onRowClick && "cursor-pointer hover:bg-zinc-800/20",
                  )}
                >
                  {columns.map((col) => {
                    const rawValue = getCellValue(row, col.key as string);
                    return (
                      <td
                        key={col.key as string}
                        className={cn(
                          "px-6 py-4 text-sm text-zinc-300 whitespace-nowrap",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                        )}
                      >
                        {col.cell ? (
                          col.cell(row, rowIndex)
                        ) : rawValue != null ? (
                          String(rawValue)
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination footer ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 py-3 bg-zinc-900/30 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600 order-2 sm:order-1">
          {sorted.length === 0
            ? "No results"
            : `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, sorted.length)} of ${sorted.length}`}
          {sorted.length !== data.length && ` (filtered from ${data.length})`}
        </p>
        <div className="order-1 sm:order-2">
          <CustomPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            maxVisiblePages={5}
          />
        </div>
      </div>
    </div>
  );
}
