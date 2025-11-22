import { Movement } from '@/interfaces/models'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const movementColumns: ColumnDef<Movement>[] = [
  {
    accessorKey: 'producto_nombre',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Producto
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('producto_nombre')}</div>
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
      const tipo = row.getValue('tipo') as string
      return (
        <Badge variant={tipo === 'entrada' ? 'default' : 'destructive'}>
          {tipo === 'entrada' ? 'Entrada' : 'Salida'}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'cantidad',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Cantidad
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('cantidad')}</div>
    }
  },
  {
    accessorKey: 'fecha',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue('fecha')}</div>
    }
  }
]
