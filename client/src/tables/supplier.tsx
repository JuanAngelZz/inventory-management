import { Supplier } from '@/interfaces/models'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SupplierActions from '@/components/SupplierActions'

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('nombre')}</div>
    }
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue('tipo')}</div>
    }
  },
  {
    accessorKey: 'numero_telefono',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Telefono
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-mono text-sm">{row.getValue('numero_telefono')}</div>
    }
  },
  {
    accessorKey: 'direccion',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dirección
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="truncate max-w-[300px]" title={row.getValue('direccion')}>{row.getValue('direccion')}</div>
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <SupplierActions supplier={row.original} />
  }
]
