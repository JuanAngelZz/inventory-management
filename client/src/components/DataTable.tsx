import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import MyTableHead from './MyTableHead'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchFor,
  searchPlaceholder,
  renderMobileItem,
  defaultSorting
}: DataTableProps<TData, TValue> & {
  searchFor: string
  searchPlaceholder: string
  renderMobileItem?: (item: TData) => React.ReactNode
  defaultSorting?: SortingState
}) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting || [])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const resizeHandler = () => {
      const screenHeight = window.screen.height
      const screenWidth = window.innerWidth
      setIsMobile(screenWidth < 768)

      if (screenHeight <= 768) {
        setPagination({ pageIndex: 0, pageSize: 4 })
      } else if (screenHeight > 768 && screenHeight <= 1024) {
        setPagination({ pageIndex: 0, pageSize: 6 })
      } else if (screenHeight > 1024 && screenHeight <= 1366) {
        setPagination({ pageIndex: 0, pageSize: 8 })
      } else {
        setPagination({ pageIndex: 0, pageSize: 10 })
      }
    }

    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    return () => {
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination
    }
  })

  return (
    <>
      <MyTableHead
        filterValue={
          (table.getColumn(searchFor)?.getFilterValue() as string) ?? ''
        }
        onFilterChange={(value) =>
          table.getColumn(searchFor)?.setFilterValue(value)
        }
        placeholder={searchPlaceholder}
      />
      {isMobile && renderMobileItem ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {table.getRowModel().rows.map((row) => (
            <div key={row.id}>{renderMobileItem(row.original)}</div>
          ))}
        </div>
      ) : (
        <div className='rounded-md border shadow-sm bg-card'>
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-muted/50 transition-colors data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  )
}
