import { Movement } from '@/interfaces/models'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const movementColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: 'producto_nombre',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Producto
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('producto_nombre')}</p>
    }
  },
  {
    accessorKey: 'tipo',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Tipo
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return row.getValue('tipo') == 'entrada' ? (
        <p className='text-center text-green-700'>{row.getValue('tipo')}</p>
      ) : (
        <p className='text-center text-red-700'>{row.getValue('tipo')}</p>
      )
    }
  },
  {
    accessorKey: 'cantidad',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cantidad
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('cantidad')}</p>
    }
  },
  {
    accessorKey: 'fecha',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('fecha')}</p>
    }
  },
  {
    accessorKey: 'movimiento_id',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          ID
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('movimiento_id')}</p>
    }
  }
]
