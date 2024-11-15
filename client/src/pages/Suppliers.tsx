import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { supplierColumns } from '@/tables/supplier'
import { useEffect } from 'react'
import useSupplierStore from '@/stores/supplierStore'
import { useAuth } from '@/contexts/authContext'

const Suppliers = () => {
  const suppliers = useSupplierStore((state) => state.suppliers)
  const getSuppliers = useSupplierStore((state) => state.getSuppliers)
  const { user } = useAuth()

  useEffect(() => {
    getSuppliers()
  }, [])

  return (
    <>
      <Header page='Proveedores' />
      <DataTable
        columns={supplierColumns}
        data={suppliers}
        customButtonLabel='Agregar nuevo proveedor'
        url='/suppliers/create'
        searchFor='nombre'
        searchPlaceholder='Buscar por nombre de proveedor'
        rol={user?.rol}
      />
    </>
  )
}

export default Suppliers
