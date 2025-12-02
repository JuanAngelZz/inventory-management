import { Movement } from '@/interfaces/models'
import { format } from '@formkit/tempo'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

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
      const name = row.getValue('producto_nombre') as string
      // @ts-ignore
      const deletedAt = row.original.producto_deleted_at

      if (deletedAt) {
        const cleanName = name.split('_deleted_')[0]
        return (
          <Popover>
            <PopoverTrigger asChild>
              <div className="font-medium text-red-500 cursor-help underline decoration-dotted">
                {cleanName}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <p className="text-sm text-muted-foreground">
                Producto eliminado el {format(deletedAt, { date: 'medium', time: 'short' }, 'es')}
              </p>
            </PopoverContent>
          </Popover>
        )
      }

      return <div className="font-medium">{name}</div>
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
      return <div className="text-muted-foreground">{format(row.getValue('fecha'), { date: 'medium', time: 'short' }, 'es')}</div>
    }
  }
]
