import { User } from '@/interfaces/models'
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
import useUserStore from '@/stores/userStore'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import UpdateUserForm from '@/components/UpdateUserForm'
import { useAuth } from '@/contexts/authContext'

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'usuario_id',
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
      return <p className='text-center'>{row.getValue('usuario_id')}</p>
    }
  },
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
    accessorKey: 'rol',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='w-full text-center'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Rol
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <p className='text-center'>{row.getValue('rol')}</p>
    }
  },
  {
    id: 'actions',
    header: () => (
      <Button variant='ghost' className='w-full text-center'>
        Acciones
      </Button>
    ),
    cell: ({ row }) => {
      const { toast } = useToast()
      const deleteUser = useUserStore((state) => state.deleteUser)
      const [open, setOpen] = useState(false)
      const { user } = useAuth()

      const onClose = () => {
        setOpen(false)
      }

      const onDeleteItem = async () => {
        try {
          const usuarioId = row.getValue<number>('usuario_id')
          await deleteUser(usuarioId)
          toast({
            variant: 'destructive',
            title: 'Usuario eliminado exitosamente'
          })
        } catch (error) {
          console.log(error)
        }
      }

      if (row.getValue('usuario_id') === user?.usuario_id) {
        return (
          <p className='text-center text-red-800 '>
            No se puede eliminar el usuario actual
          </p>
        )
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-full p-0'>
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
                  <UpdateUserForm
                    id={row.getValue('usuario_id')}
                    onClose={onClose}
                  />
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className='mr-2 h-4 w-4 text-red-800' />
              <DeleteDialog
                description='¿Estas seguro de eliminar el usuario?'
                onDeleteItem={onDeleteItem}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
