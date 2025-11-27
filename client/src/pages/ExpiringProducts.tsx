import { useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import { DataTable } from '@/components/DataTable'
import { Badge } from '@/components/ui/badge'
import useProductStore from '@/stores/productStore'
import { Product } from '@/interfaces/models'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function ExpiringProducts() {
  const products = useProductStore((state) => state.products)
  const getProducts = useProductStore((state) => state.getProducts)

  useEffect(() => {
    getProducts()
  }, [])

  // Filter products expiring in next 30 days
  const expiringProducts = useMemo(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    return products
      .filter((product) => {
        if (!product.fecha_vencimiento) return false
        const expirationDate = new Date(product.fecha_vencimiento)
        return expirationDate > today && expirationDate <= thirtyDaysFromNow
      })
      .sort((a, b) => {
        const dateA = new Date(a.fecha_vencimiento!)
        const dateB = new Date(b.fecha_vencimiento!)
        return dateA.getTime() - dateB.getTime()
      })
  }, [products])

  // Calculate urgency stats
  const urgencyStats = useMemo(() => {
    const critical = expiringProducts.filter(p => {
      const days = differenceInDays(new Date(p.fecha_vencimiento!), new Date())
      return days <= 7
    }).length

    const warning = expiringProducts.filter(p => {
      const days = differenceInDays(new Date(p.fecha_vencimiento!), new Date())
      return days > 7 && days <= 15
    }).length

    const normal = expiringProducts.length - critical - warning

    return { critical, warning, normal }
  }, [expiringProducts])

  const getUrgencyBadge = (expirationDate: string) => {
    const days = differenceInDays(new Date(expirationDate), new Date())
    
    if (days <= 7) {
      return <Badge variant="destructive" className="font-normal">Crítico ({days}d)</Badge>
    } else if (days <= 15) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600 font-normal">Advertencia ({days}d)</Badge>
    } else {
      return <Badge variant="outline" className="font-normal">Normal ({days}d)</Badge>
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'nombre',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Producto
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue('nombre')}</div>
    },
    {
      accessorKey: 'categoria_nombre',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Categoría
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.getValue('categoria_nombre')}
        </Badge>
      )
    },
    {
      accessorKey: 'fecha_vencimiento',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Fecha de Vencimiento
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue('fecha_vencimiento') as string
        return (
          <div className="text-sm">
            <div className="font-medium">{date}</div>
            <div className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: es
              })}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'stock',
      header: ({ column }) => (
        <Button
          variant='ghost'
          className="pl-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Stock
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.getValue('stock') as number
        return (
          <Badge variant={stock < 10 ? "destructive" : "outline"}>
            {stock} u.
          </Badge>
        )
      }
    },
    {
      id: 'urgency',
      header: 'Urgencia',
      cell: ({ row }) => {
        const expirationDate = row.getValue('fecha_vencimiento') as string
        return getUrgencyBadge(expirationDate)
      }
    }
  ]

  return (
    <>
      <Header 
        page="Productos Próximos a Vencer" 
        breadcrumbs={[
          { label: 'Productos', href: '/products' },
          { label: 'Próximos a Vencer' }
        ]}
      />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Críticos (≤7 días)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgencyStats.critical}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Advertencia (8-15 días)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgencyStats.warning}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Planificar acciones
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Normal (16-30 días)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgencyStats.normal}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Monitoreo regular
            </p>
          </CardContent>
        </Card>
      </div>

      {expiringProducts.length > 0 ? (
        <DataTable
          columns={columns}
          data={expiringProducts}
          searchFor='nombre'
          searchPlaceholder='Buscar por nombre de producto'
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sin productos próximos a vencer</CardTitle>
            <CardDescription>
              No hay productos que venzan en los próximos 30 días.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </>
  )
}
