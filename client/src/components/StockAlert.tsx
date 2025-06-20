import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function StockAlert() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000); // La alerta se cierra después de 10 segundos

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, []);

  if (!isVisible) return null;

  return (
    <Alert variant="destructive" className="absolute bottom-4 w-[800px]">
    <AlertCircleIcon size={40}  />
    <AlertTitle>¡Atención! Stock Crítico</AlertTitle>
    <AlertDescription >
    El producto <span>Nombre del Producto</span> tiene un stock bajo. Se recomienda realizar un nuevo pedido para evitar desabastecimiento.
    </AlertDescription>
  </Alert>
  );
}
