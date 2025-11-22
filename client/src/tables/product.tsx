import { Product } from '@/interfaces/models'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductActions from '@/components/ProductActions'
import { Badge } from '@/components/ui/badge'

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className="pl-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('nombre')}</div>
  },
  {
    accessorKey: 'categoria_nombre',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className="pl-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Categoría
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.getValue('categoria_nombre')}
      </Badge>
    )
  },
  {
    accessorKey: 'proveedor_nombre',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className="pl-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Proveedor
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue('proveedor_nombre')}</div>
    )
  },
  {
    accessorKey: 'precio_venta',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className="pl-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Precio Venta
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-green-600">
        ${row.getValue('precio_venta')}
      </div>
    )
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button
        variant='ghost'
        className="pl-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Stock
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      return (
        <Badge variant={stock < 10 ? "destructive" : "outline"}>
          {stock} u.
        </Badge>
      )
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProductActions product={row.original} />
  }
]
