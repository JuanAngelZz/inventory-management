import { getAllSuppliers } from '@/api/suppliers'
import CreateProductForm from '@/components/CreateProductForm'
import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { Supplier } from '@/interfaces/models'
import { supplierColumns } from '@/tables/supplier'
import { useEffect, useState } from 'react'

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const response = await getAllSuppliers()
      setSuppliers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header page='Proveedores' />
      <DataTable
        columns={supplierColumns}
        data={suppliers}
        customButtonLabel='Añadir nuevo proveedor'
        customDialogContent={CreateProductForm}
      />
    </>
  )
}

export default Suppliers
