import UpdateProductForm from '@/components/UpdateProductForm'
import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import useProductStore from '@/stores/productStore'
import { productColumns } from '@/tables/product'
import { useEffect } from 'react'

const Products = () => {
  const products = useProductStore((state) => state.products)
  const getProducts = useProductStore((state) => state.getProducts)

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <Header page='Productos' />
      <DataTable
        columns={productColumns}
        data={products}
        customButtonLabel='Añadir nuevo producto'
        url='/products/create'
        searchFor='nombre'
        searchPlaceholder='Buscar por nombre de producto'
      />
    </>
  )
}

export default Products
