import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import useProductStore from '@/stores/productStore'
import { productColumns } from '@/tables/product'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import { Plus, AlertTriangle } from 'lucide-react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ProductActions from '@/components/ProductActions'
import { Product } from '@/interfaces/models'

const Products = () => {
  const products = useProductStore((state) => state.products)
  const getProducts = useProductStore((state) => state.getProducts)
  const { user } = useAuth()

  useEffect(() => {
    getProducts()
  }, [])

  const renderMobileItem = (row: any) => {
    const product = row.original as Product
    return (
      <Card className='mb-4 hover:shadow-lg transition-all duration-300'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            {product.nombre}
          </CardTitle>
          <ProductActions product={product} />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${product.precio_venta}</div>
          <p className='text-xs text-muted-foreground'>
            Stock: {product.stock} | Cat: {product.categoria_nombre}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>
            {product.proveedor_nombre}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Header 
        page='Productos' 
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/expiring-products">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                Próximos a vencer
              </Link>
            </Button>
            {user?.rol === 'administrador' && (
              <Button asChild>
                <Link to="/products/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Link>
              </Button>
            )}
          </div>
        }
      />
      <DataTable
        columns={productColumns}
        data={products}
        searchFor='nombre'
        searchPlaceholder='Buscar por nombre de producto'
        renderMobileItem={renderMobileItem}
      />
    </>
  )
}

export default Products
