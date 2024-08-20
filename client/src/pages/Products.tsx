import { getAllProducts } from '@/api/products'
import CreateProductForm from '@/components/CreateProductForm'
import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { Product } from '@/interfaces/models'
import { productColumns } from '@/tables/product'
import { useEffect, useState } from 'react'

const Products = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts()
  }, [])

  const getProducts = async () => {
    try {
      const response = await getAllProducts()
      setProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header page='Productos' />
      <DataTable
        columns={productColumns}
        data={products}
        customButtonLabel='Añadir nuevo producto'
        customDialogContent={CreateProductForm}
      />
    </>
  )
}

export default Products
