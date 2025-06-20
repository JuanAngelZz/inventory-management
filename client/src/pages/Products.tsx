import UpdateProductForm from '@/components/UpdateProductForm'
import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import useProductStore from '@/stores/productStore'
import { productColumns } from '@/tables/product'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Products = () => {
  const products = useProductStore((state) => state.products)
  const getProducts = useProductStore((state) => state.getProducts)

  useEffect(() => {
    getProducts()
  }, [])

  return (
    <>
      <Header page='Productos' />
      <div className="flex justify-end">
      <Button className='flex'>
        <Link to="/expiring-products">Ver productos proximos a vencer</Link>
      </Button>
      </div>
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
