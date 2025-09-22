// src/components/ui/Table.tsx
import React from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function Table<T extends object>({
  data,
  columns,
  loading,
  emptyMessage = 'No data available',
  className
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="table">
          <div className="table-header">
            {columns.map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="table-row">
              {columns.map((_, colIndex) => (
                <div key={colIndex} className="table-cell">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`table-wrapper ${className || ''}`.trim()}>
      <table className="table">
        <thead className="table-header">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                className={`table-header-cell ${column.className || ''}`.trim()}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty-message">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="table-row">
                {columns.map((column) => {
                  const key = typeof column.key === 'string' ? column.key : String(column.key);
                  const value = (item as Record<string, unknown>)[key] as React.ReactNode;
                  return (
                    <td key={column.key.toString()} className="table-cell">
                      {column.render ? column.render(item) : value}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};