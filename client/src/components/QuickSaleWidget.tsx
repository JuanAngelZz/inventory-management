import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Check, ChevronsUpDown, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import useProductStore from '@/stores/productStore'
import { createBulkMovements } from '@/api/movements'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { Movement } from '@/interfaces/models'

interface SaleItem {
  id: string
  producto_nombre: string
  cantidad: number
}

export const QuickSaleWidget = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const products = useProductStore((state) => state.products)
  const getProducts = useProductStore((state) => state.getProducts)

  const [items, setItems] = useState<SaleItem[]>([
    { id: crypto.randomUUID(), producto_nombre: '', cantidad: 1 }
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getProducts()
  }, [])

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), producto_nombre: '', cantidad: 1 }])
  }

  const removeItem = (id: string) => {
    if (items.length === 1) {
      // If it's the last item, just reset it instead of removing
      setItems([{ id: crypto.randomUUID(), producto_nombre: '', cantidad: 1 }])
      return
    }
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const handleSubmit = async () => {
    // Validation
    const invalidItems = items.filter(
      (item) => !item.producto_nombre || item.cantidad <= 0
    )

    if (invalidItems.length > 0) {
      toast({
        title: 'Error de validación',
        description: 'Por favor selecciona un producto y una cantidad válida para todos los items.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      const movements: Movement[] = items.map((item) => ({
        tipo: 'salida',
        cantidad: item.cantidad,
        fecha: new Date().toISOString(), // Will be formatted by backend or ignored if backend uses current time
        producto_nombre: item.producto_nombre
      }))

      await createBulkMovements(movements)

      toast({
        title: 'Venta registrada',
        description: 'La venta rápida se ha procesado correctamente.'
      })

      // Reset form
      setItems([{ id: crypto.randomUUID(), producto_nombre: '', cantidad: 1 }])
      
      // Refresh dashboard stats
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] })
      
    } catch (error: any) {
      console.error(error)
      const errorMessage = error.response?.data?.error || 'Ocurrió un error al procesar la venta.'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-l-4 border-l-primary shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Venta Rápida
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                {index === 0 && <Label>Producto</Label>}
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between font-normal",
                        !item.producto_nombre && "text-muted-foreground"
                      )}
                    >
                      {item.producto_nombre
                        ? products.find((p) => p.nombre === item.producto_nombre)?.nombre
                        : "Seleccionar producto..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar producto..." />
                      <CommandList>
                        <CommandEmpty>No encontrado.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.producto_id}
                              value={product.nombre}
                              onSelect={(currentValue) => {
                                updateItem(item.id, 'producto_nombre', currentValue)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.producto_nombre === product.nombre
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.nombre}
                              <span className="ml-auto text-xs text-muted-foreground">
                                Stock: {product.stock}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="w-24 space-y-2">
                {index === 0 && <Label>Cantidad</Label>}
                <Input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => updateItem(item.id, 'cantidad', parseInt(e.target.value) || 0)}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive mb-0.5"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1 && !item.producto_nombre && item.cantidad === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={addItem}
              className="text-primary hover:text-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar otro producto
            </Button>

            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Procesando...' : 'Registrar Venta'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
