import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { supplierColumns } from '@/tables/supplier'
import { useEffect } from 'react'
import useSupplierStore from '@/stores/supplierStore'

const Suppliers = () => {
  const suppliers = useSupplierStore((state) => state.suppliers)
  const getSuppliers = useSupplierStore((state) => state.getSuppliers)

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
      />
    </>
  )
}

export default Suppliers
