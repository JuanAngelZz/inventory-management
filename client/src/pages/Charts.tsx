import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Charts() {
  // Datos de ejemplo
  const data = [
    { month: 'Ene', ventas: 4000, compras: 2500, ventasAcumuladas: 4000 },
    { month: 'Feb', ventas: 3000, compras: 2000, ventasAcumuladas: 7000 },
    { month: 'Mar', ventas: 5000, compras: 3200, ventasAcumuladas: 12000 },
    { month: 'Abr', ventas: 4000, compras: 2800, ventasAcumuladas: 16000 },
    { month: 'May', ventas: 6000, compras: 3500, ventasAcumuladas: 22000 },
    { month: 'Jun', ventas: 7000, compras: 4000, ventasAcumuladas: 29000 },
  ];

  const pieData = [
    { name: "Ventas", value: 4000 },
    { name: "Compras", value: 3000 },
    { name: "Devoluciones", value: 2000 },
    { name: "Otros", value: 1000 },
  ];

  const COLORS = [
    "#4caf50", // Ventas
    "#2196f3", // Compras
    "#f44336", // Devoluciones
    "#ff9800", // Otros
  ];

  return (
    <div className=" bg-gray-50 p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">📈 Zona de gráficos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Gráfico de Barras */}
        <Card className="shadow-lg p-4">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Ventas vs Compras</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#4caf50" />
                <Bar dataKey="compras" fill="#2196f3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pastel */}
        <Card className="shadow-lg p-4">
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-700">Distribución de Inventario</h2>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Tooltip />
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* <Card className="shadow-lg p-4">
            <CardHeader>
                <h2 className="text-xl font-semibold text-gray-700">Tendencia de Ventas Acumuladas</h2>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ventasAcumuladas" stroke="#4caf50" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card> */}

      </div>
    </div>
  );
}
