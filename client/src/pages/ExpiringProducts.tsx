import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

type Product = {
  id: number;
  name: string;
  expirationDate: string;
  stock: number;
};

const products: Product[] = [
  { id: 1, name: "Producto A", expirationDate: "2025-06-25", stock: 30 },
  { id: 2, name: "Producto B", expirationDate: "2025-06-28", stock: 15 },
  { id: 3, name: "Producto C", expirationDate: "2025-07-02", stock: 50 },
  { id: 4, name: "Producto D", expirationDate: "2025-07-05", stock: 10 },
  { id: 5, name: "Producto E", expirationDate: "2025-07-10", stock: 20 },
  { id: 6, name: "Producto F", expirationDate: "2025-07-12", stock: 5 },
  { id: 7, name: "Producto G", expirationDate: "2025-07-15", stock: 25 },
  { id: 8, name: "Producto H", expirationDate: "2025-07-18", stock: 35 },
  { id: 9, name: "Producto I", expirationDate: "2025-07-20", stock: 40 },
  { id: 10, name: "Producto J", expirationDate: "2025-07-22", stock: 45 },
];

export default function ExpiringProducts() {
  const [expiringProducts, setExpiringProducts] = useState<Product[]>([]);

  useEffect(() => {
    const today = new Date();
    const upcomingExpiration = products.filter((product) => {
      const expiration = new Date(product.expirationDate);
      return expiration > today && expiration <= new Date(today.setDate(today.getDate() + 30));
    });
    setExpiringProducts(upcomingExpiration);
  }, []);

  return (
    <div className="bg-gray-50 p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">📦 Productos Próximos a Vencer</h1>
      <Card className="shadow-lg">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-700">Inventario Crítico</h2>
        </CardHeader>
        <CardContent>
          {expiringProducts.length > 0 ? (
            <table className="min-w-full table-auto text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2">Fecha de Vencimiento</th>
                  <th className="px-4 py-2">Stock</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {expiringProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="link" className="text-blue-600">
                            {product.expirationDate}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">
                          <p>
                            Vence en{" "}
                            {formatDistanceToNow(new Date(product.expirationDate), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                    <td className="border px-4 py-2">{product.stock}</td>
                    <td className="border px-4 py-2">
                      <Button variant="outline" color="destructive">
                        Reponer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay productos próximos a vencer en los próximos 30 días.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
