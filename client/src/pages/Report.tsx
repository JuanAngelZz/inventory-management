import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Calendar as CalendarIcon, FileText } from "lucide-react"
import Header from '@/components/Header'
import { useQuery } from '@tanstack/react-query'
import { getReportData } from '@/api/report'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Report() {
  const [filters, setFilters] = useState({
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    type: 'all'
  })

  const { data: movements, isLoading } = useQuery({
    queryKey: ['reportData', { 
      ...filters, 
      startDate: filters.startDate?.toISOString(), 
      endDate: filters.endDate?.toISOString() 
    }],
    queryFn: () => getReportData({
      startDate: filters.startDate?.toISOString().split('T')[0],
      endDate: filters.endDate?.toISOString().split('T')[0],
      type: filters.type
    })
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.text("Reporte de Movimientos", 14, 10)
    
    const tableData = movements?.map((m: any) => [
      new Date(m.fecha).toLocaleDateString('es-VE'),
      m.producto,
      m.tipo,
      m.cantidad,
      `$${m.total_valor}`
    ]) || []

    autoTable(doc, {
      head: [['Fecha', 'Producto', 'Tipo', 'Cantidad', 'Total']],
      body: tableData,
      startY: 20
    })

    doc.save('reporte_inventario.pdf')
  }

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(movements || [])
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte")
    XLSX.writeFile(workbook, "reporte_inventario.xlsx")
  }

  return (
    <div className="space-y-6 pb-8">
      <Header page="Reportes Detallados" />

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
          <CardDescription>Selecciona el rango de fechas y tipo de movimiento</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label className="text-sm font-medium">Fecha Inicio</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !filters.startDate && "text-muted-foreground"
                  )}
                >
                  {filters.startDate ? (
                    format(filters.startDate, "dd/MM/yyyy")
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) => handleFilterChange('startDate', date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label className="text-sm font-medium">Fecha Fin</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !filters.endDate && "text-muted-foreground"
                  )}
                >
                  {filters.endDate ? (
                    format(filters.endDate, "dd/MM/yyyy")
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) => handleFilterChange('endDate', date)}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label className="text-sm font-medium">Tipo de Movimiento</label>
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="entrada">Entradas (Compras)</SelectItem>
                <SelectItem value="salida">Salidas (Ventas)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={exportPDF} disabled={!movements?.length}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" onClick={exportExcel} disabled={!movements?.length}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            {movements?.length || 0} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Cargando datos...
                    </TableCell>
                  </TableRow>
                ) : movements?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron movimientos con los filtros seleccionados
                    </TableCell>
                  </TableRow>
                ) : (
                  movements?.map((movement: any) => (
                    <TableRow key={movement.movimiento_id}>
                      <TableCell>{new Date(movement.fecha).toLocaleDateString('es-VE')}</TableCell>
                      <TableCell className="font-medium">{movement.producto}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          movement.tipo === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {movement.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{movement.cantidad}</TableCell>
                      <TableCell className="text-right font-bold">
                        ${Number(movement.total_valor).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
