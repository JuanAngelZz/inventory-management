import { Product } from '@/interfaces/models'
import { ColumnDef } from '@tanstack/react-table'

import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import DeleteDialog from '@/components/DeleteDialog'
import { useToast } from '@/hooks/use-toast'
import useProductStore from '@/stores/productStore'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import UpdateProductForm from '@/components/UpdateProductForm'
import { useState } from 'react'

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nombre
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <p className='text-center'>{row.getValue('nombre')}</p>
  },
  {
    accessorKey: 'categoria_nombre',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Categoría
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center'>{row.getValue('categoria_nombre')}</p>
    )
  },
  {
    accessorKey: 'proveedor_nombre',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Proveedor
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center'>{row.getValue('proveedor_nombre')}</p>
    )
  },
  {
    accessorKey: 'precio_venta',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Precio de Venta
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center text-green-700'>
        ${row.getValue('precio_venta')}
      </p>
    )
  },
  {
    accessorKey: 'precio_compra',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Precio de Compra
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center text-red-700'>
        ${row.getValue('precio_compra')}
      </p>
    )
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Stock
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => <p className='text-center'>{row.getValue('stock')}</p>
  },
  {
    accessorKey: 'descripcion',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Descripción
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center'>{row.getValue('descripcion') || '---'}</p>
    )
  },
  {
    accessorKey: 'fecha_adquisicion',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de adquisición
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center'>{row.getValue('fecha_adquisicion')}</p>
    )
  },
  {
    accessorKey: 'fecha_vencimiento',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Fecha de vencimiento
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center'>{row.getValue('fecha_vencimiento')}</p>
    )
  },
  {
    accessorKey: 'producto_id',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        ID
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => (
      <p className='text-center'>{row.getValue('producto_id')}</p>
    )
  },
  {
    id: 'actions',
    header: () => <Button variant='ghost'>Acciones</Button>,
    cell: ({ row }) => {
      const { toast } = useToast()
      const deleteProduct = useProductStore((state) => state.deleteProduct)
      const [open, setOpen] = useState(false)

      const onClose = () => {
        setOpen(false)
      }

      const onDeleteItem = async () => {
        try {
          const productoId = row.getValue<number>('producto_id')
          await deleteProduct(productoId)
          toast({
            variant: 'destructive',
            title: 'Producto eliminado exitosamente del inventario'
          })
        } catch (error) {
          console.log(error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Pencil className='mr-2 h-4 w-4' />
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <span>Editar</span>
                </DialogTrigger>
                <DialogContent
                  onKeyDown={(e) => e.stopPropagation()}
                  className='sm:max-w-[425px]'
                >
                  <UpdateProductForm
                    id={row.getValue('producto_id')}
                    onClose={onClose}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className='mr-2 h-4 w-4 text-red-800' />
              <DeleteDialog
                onDeleteItem={onDeleteItem}
                description='Esta acción no se puede deshacer. Eliminará permanentemente el producto y los registros de movimientos asociados a él de nuestros servidores.'
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
