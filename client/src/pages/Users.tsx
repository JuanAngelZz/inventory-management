import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import useUserStore from '@/stores/userStore'
import { Slash, Plus, Search, MoreVertical, User as UserIcon, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from '@/interfaces/models'
import { useToast } from '@/hooks/use-toast'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const editUserSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  rol: z.string(),
  contrasena: z.string().optional()
})

const EditUserDialog = ({ user, open, onOpenChange }: { user: User | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const updateUser = useUserStore((state) => state.updateUser)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      nombre: '',
      rol: '',
      contrasena: ''
    }
  })

  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre,
        rol: user.rol,
        contrasena: ''
      })
    }
  }, [user, form])

  const onSubmit = async (data: z.infer<typeof editUserSchema>) => {
    if (!user?.usuario_id) return

    try {
      const updateData: any = {
        nombre: data.nombre,
        rol: data.rol
      }
      if (data.contrasena && data.contrasena.length > 0) {
        updateData.contrasena = data.contrasena
      }

      await updateUser(user.usuario_id, updateData)
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados."
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el usuario."
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="usuario">Usuario</SelectItem>
                      <SelectItem value="administrador">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Dejar en blanco para mantener actual" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const Users = () => {
  const users = useUserStore((state) => state.users)
  const getUsers = useUserStore((state) => state.getUsers)
  const deleteUser = useUserStore((state) => state.deleteUser)
  const [searchTerm, setSearchTerm] = useState('')
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [userToEdit, setUserToEdit] = useState<User | null>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    getUsers()
  }, [])

  const handleDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete)
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente."
      })
      setUserToDelete(null)
    }
  }

  const filteredUsers = users.filter(user => 
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const UserCard = ({ user }: { user: User }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.nombre}`} />
            <AvatarFallback><UserIcon /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-medium">{user.nombre}</CardTitle>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Shield className="h-3 w-3" /> {user.rol}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={(e) => {
              e.preventDefault()
              setUserToEdit(user)
            }}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600" 
              onSelect={(e) => {
                e.preventDefault()
                setUserToDelete(user.usuario_id || null)
              }}
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mt-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.rol === 'administrador' 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
          }`}>
            <Shield className="w-3 h-3 mr-1" />
            {user.rol}
          </span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <Breadcrumb className="mt-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to='/'>Inicio</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
              <BreadcrumbLink asChild><Link to='/administrate'>Administrar</Link></BreadcrumbLink>
              <BreadcrumbSeparator><Slash /></BreadcrumbSeparator>
              <BreadcrumbItem><BreadcrumbPage>Usuarios</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Button onClick={() => navigate('/administrate/users/create')}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </header>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <UserCard key={user.usuario_id} user={user} />
        ))}
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditUserDialog 
        user={userToEdit} 
        open={!!userToEdit} 
        onOpenChange={(open) => !open && setUserToEdit(null)} 
      />
    </div>
  )
}

export default Users
