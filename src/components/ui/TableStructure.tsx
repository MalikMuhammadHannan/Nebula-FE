import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import React from "react";
import Shimmer from "./Shimmer";
import { Pagination } from "./pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export type Column<T> = {
  key: string;
  title: React.ReactNode;
  dataIndex: keyof T;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  tooltip?: boolean;
  showSortIcons?: boolean;
};

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey: keyof T;
  onRowSelect?: (selectedRows: T[]) => void;
  selectable?: boolean;
  className?: string;
  emptyText?: string;
  showSortIcons?: boolean;
  disabledRows?: (record: T) => boolean;
  highlightedRows?: (record: T) => boolean;
  rowClassName?: (record: T) => string;
  rowProps?: (record: T) => React.HTMLAttributes<HTMLTableRowElement>;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  sorts?: { field: string; direction: "asc" | "desc" }[];
  onSort?: (field: string, e?: React.MouseEvent) => void;
  refreshData?: () => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (value: number) => void;
    showInfo?: boolean;
  };
  groupBy?: keyof T;
  renderGroupHeader?: (value: any, records: T[]) => React.ReactNode;
  tableFooter?: React.ReactNode;
  showHorizontalScroll?: boolean;
}

export function TableStructure<T>({
  columns,
  data,
  loading = false,
  rowKey,
  selectable = false,
  className = "",
  emptyText = "No data available",
  disabledRows,
  highlightedRows,
  rowClassName,
  rowProps,
  pagination,
  refreshData,
  groupBy,
  renderGroupHeader,
  sortField,
  sortDirection,
  sorts,
  onSort,
  showSortIcons = false,
  tableFooter,
  showHorizontalScroll = false,
}: TableProps<T>) {
  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.itemsPerPage
    : 0;
  const endIndex = pagination
    ? startIndex + pagination.itemsPerPage
    : data.length;

  return (
    <>
      <div className={`w-full max-w-full `}>
        <div
          className={`bg-card rounded-lg border border-border overflow-hidden w-full`}
        >
          <div
            className={`
                    ${showHorizontalScroll
                ? 'horizontal-scrollbar overflow-x-auto pb-2'
                : 'scroll-container overflow-x-auto'
              }
              hide-vertical-scrollbar
              overflow-y-auto
              max-h-[800px]
              w-full
              max-w-full
              ${className}
            `}
          >
            <table className="min-w-full w-full">
              <thead className="bg-muted border-b border-border sticky top-0 z-1">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      onClick={column.sortable && onSort ? (e) => onSort(String(column.dataIndex), e) : undefined}
                      className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-muted-foreground ${column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left"
                        } ${column.sortable ? "cursor-pointer select-none hover:bg-muted/80" : ""}`}
                      style={{ width: column.width }}
                    >
                      <div className={`flex items-center gap-1 sm:gap-2 whitespace-nowrap ${column.align === "center" ? "justify-center" : column.align === "right" ? "justify-end" : ""}`}>
                        {column.title}
                        {column.sortable && (column.showSortIcons || showSortIcons) && (
                          <span className="ml-1 flex-shrink-0">
                            {(() => {
                              const sortInfo = sorts?.find((s) => s.field === String(column.dataIndex));
                              if (sortInfo) {
                                return sortInfo.direction === "asc" ? (
                                  <ArrowUp className="h-4 w-4 text-primary" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-primary" />
                                );
                              }
                              if (!sorts && sortField === String(column.dataIndex)) {
                                return sortDirection === "asc" ? (
                                  <ArrowUp className="h-4 w-4 text-primary" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-primary" />
                                );
                              }
                              return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
                            })()}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  [...Array(5)].map((_, rowIndex) => (
                    <tr key={`shimmer-${rowIndex}`}>
                      {columns.map((col) => (
                        <td key={col.key} className="px-2 sm:px-4 py-2 sm:py-3">
                          <Shimmer height={25} width={col.width} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : !Array.isArray(data) || data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (selectable ? 1 : 0)}
                      className="px-2 sm:px-4 py-4 sm:py-8 text-center text-muted-foreground"
                    >
                      <div className="text-center flex flex-col items-center py-8 sm:py-16">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                          {emptyText}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          Try adjusting your search or filter criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  (() => {
                    let lastGroupValue: any = null;
                    return (data as T[]).map((record, index) => {
                      const isDisabled = disabledRows
                        ? disabledRows(record)
                        : false;
                      const isHighlighted = highlightedRows
                        ? highlightedRows(record)
                        : false;
                      const groupValue = groupBy ? record[groupBy] : null;
                      const showHeader =
                        groupBy && groupValue !== lastGroupValue;
                      lastGroupValue = groupValue;

                      return (
                        <React.Fragment key={String(record[rowKey])}>
                          {showHeader && (
                            <tr className="bg-muted hover:bg-muted border-b border-border">
                              <td
                                colSpan={columns.length}
                                className="px-2 sm:px-4 py-2 text-sm font-semibold text-foreground"
                              >
                                {renderGroupHeader
                                  ? renderGroupHeader(
                                    groupValue,
                                    data.filter(
                                      (d) => d[groupBy!] === groupValue
                                    )
                                  )
                                  : String(groupValue)}
                              </td>
                            </tr>
                          )}
                          <tr
                            {...(rowProps ? rowProps(record) : {})}
                            className={`transition-colors duration-150 ${isDisabled
                              ? "bg-muted/50 opacity-60"
                              : isHighlighted
                                ? "bg-destructive/10 hover:bg-destructive/15"
                                : "hover:bg-muted/50"
                              } ${rowClassName ? rowClassName(record) : ""}`}
                          >
                            {columns.map((column) => (
                              <td
                                key={column.key}
                                className={`px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground whitespace-nowrap ${column.align === "center"
                                  ? "text-center"
                                  : column.align === "right"
                                    ? "text-right"
                                    : "text-left"
                                  }`}
                              >
                                {(() => {
                                  const cellContent = column.render
                                    ? column.render(
                                      record[column.dataIndex],
                                      record,
                                      index
                                    )
                                    : String(record[column.dataIndex] || "");

                                  if (column.tooltip) {
                                    const rawValue = String(record[column.dataIndex] || "");
                                    return rawValue ? (
                                      <TooltipProvider delayDuration={300}>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className="truncate" style={{ maxWidth: column.width }}>
                                              {cellContent}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent side="top" className="max-w-xs break-words">
                                            {rawValue}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    ) : cellContent;
                                  }

                                  return cellContent;
                                })()}
                              </td>
                            ))}
                          </tr>
                        </React.Fragment>
                      );
                    });
                  })()
                )}
                {tableFooter}
              </tbody>
            </table>
          </div>
        </div>
        {pagination && Array.isArray(data) && data.length > 0 && (
          <div className="mt-4 py-1 px-2 bg-card rounded-lg border border-border overflow-visible w-full">
            <Pagination
              refreshData={refreshData}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={pagination.onPageChange}
              onItemsPerPageChange={
                pagination.onItemsPerPageChange || (() => { })
              }
            />
          </div>
        )}
      </div>
    </>
  );
}
