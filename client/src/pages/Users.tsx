import { DataTable } from '@/components/DataTable'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import useUserStore from '@/stores/userStore'
import { usersColumns } from '@/tables/users'
import { Slash } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  const users = useUserStore((state) => state.users)
  const getUsers = useUserStore((state) => state.getUsers)

  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <header className='mb-4'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
          Usuarios
        </h1>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/'>Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink asChild>
                <Link to='/administrate'>Administrar</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Usuarios</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
      </header>
      <DataTable
        columns={usersColumns}
        data={users}
        url='create'
        searchFor='nombre'
        searchPlaceholder='Buscar por nombre de usuario'
      />
    </>
  )
}

export default Users
