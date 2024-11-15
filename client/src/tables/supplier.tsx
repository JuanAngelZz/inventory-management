import { Supplier } from '@/interfaces/models'
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
import { useToast } from '@/hooks/use-toast'
import useSupplierStore from '@/stores/supplierStore'
import { useState } from 'react'
import DeleteDialog from '@/components/DeleteDialog'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import UpdateSupplierForm from '@/components/UpdateSupplierForm'

export const supplierColumns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'nombre',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('nombre')}</p>
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
      return <p className='text-center'>{row.getValue('tipo')}</p>
    }
  },
  {
    accessorKey: 'numero_telefono',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Telefono
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('numero_telefono')}</p>
    }
  },
  {
    accessorKey: 'direccion',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Dirección
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('direccion')}</p>
    }
  },
  {
    accessorKey: 'proveedor_id',
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
      return <p className='text-center'>{row.getValue('proveedor_id')}</p>
    }
  },
  {
    id: 'actions',
    header: () => <Button variant='ghost'>Acciones</Button>,
    cell: ({ row }) => {
      const { toast } = useToast()
      const deleteSupplier = useSupplierStore((state) => state.deleteSupplier)
      const [open, setOpen] = useState(false)

      const onClose = () => {
        setOpen(false)
      }

      const onDeleteItem = async () => {
        try {
          const supplierId = row.getValue<number>('proveedor_id')
          await deleteSupplier(supplierId)
          toast({
            variant: 'destructive',
            title: 'Proveedor eliminado exitosamente'
          })
        } catch (error) {
          console.log(error)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
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
                  <UpdateSupplierForm
                    id={row.getValue('proveedor_id')}
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
                description='Esta acción no se puede deshacer. Se eliminará permanentemente el registro de este proveedor de nuestros servidores.'
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
