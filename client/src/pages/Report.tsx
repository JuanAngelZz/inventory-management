import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Slash } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export default function Report() {
  return (
    <>
    <header className='mb-4'>
        <section>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to='/'>Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbLink asChild>
                <Link to='/administrate'>Administrar</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Reportes</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </section>
      </header>
    <div className="bg-gray-50 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">📊 Reporte de Inventario</h1>
        <div className="flex gap-4">
          <Input type="date" />
          <Button variant="default">
            <Download className="mr-2 h-5 w-5" />
            Descargar PDF
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Total artículos", value: "1 250" },
          { title: "Ganancia del mes", value: "$12 300" },
          { title: "Pérdida por compras", value: "$1 750" },
        ].map(card => (
          <Card key={card.title} className="shadow">
            <CardHeader>
              <h2 className="text-sm font-medium text-gray-500">{card.title}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tablas lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detalle del Inventario */}
        <Card className="shadow">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-800">Detalle del Inventario</h2>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["ID", "Nombre", "Stock", "Precio de venta", "Proveedor"].map(h => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">{100 + i}</td>
                    <td className="px-4 py-2">Producto {i + 1}</td>
                    <td className="px-4 py-2">{Math.floor(Math.random() * 200)}</td>
                    <td className="px-4 py-2">{Math.floor(Math.random() * 50) + 1}$</td>
                    <td className="px-4 py-2">Proveedor {i + 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Últimos Movimientos */}
        <Card className="shadow">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-800">Últimos Movimientos</h2>
          </CardHeader>
          <CardContent className="overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {["Fecha", "Tipo", "Producto", "Cantidad", "Usuario"].map(h => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">
                      2025-06-{10 + i}
                    </td>
                    <td className="px-4 py-2">
                      {i % 2 === 0 ? "Venta" : "Compra"}
                    </td>
                    <td className="px-4 py-2">Producto {i + 1}</td>
                    <td className="px-4 py-2">{Math.floor(Math.random() * 50) + 1}</td>
                    <td className="px-4 py-2">User{ i + 1 }</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
