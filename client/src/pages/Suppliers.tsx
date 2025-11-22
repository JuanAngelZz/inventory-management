import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { supplierColumns } from '@/tables/supplier'
import { useEffect } from 'react'
import useSupplierStore from '@/stores/supplierStore'
import { useAuth } from '@/contexts/authContext'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const Suppliers = () => {
  const suppliers = useSupplierStore((state) => state.suppliers)
  const getSuppliers = useSupplierStore((state) => state.getSuppliers)
  const { user } = useAuth()

  useEffect(() => {
    getSuppliers()
  }, [])

  return (
    <>
      <Header 
        page='Proveedores' 
        action={
          user?.rol === 'administrador' && (
            <Button asChild>
              <Link to="/suppliers/create">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Proveedor
              </Link>
            </Button>
          )
        }
      />
      <DataTable
        columns={supplierColumns}
        data={suppliers}
        searchFor='nombre'
        searchPlaceholder='Buscar por nombre de proveedor'
      />
    </>
  )
}

export default Suppliers
