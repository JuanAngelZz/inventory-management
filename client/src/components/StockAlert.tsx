
import { AlertCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function StockAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  if (!isVisible) return null;

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 w-full max-w-md transition-all duration-300 ease-in-out",
      isClosing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
    )}>
      <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 border-l-4 border-l-red-500 shadow-lg rounded-lg p-4 pr-12 flex items-start gap-4">
        <div className="flex-shrink-0 text-red-500 mt-0.5">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            ¡Atención! Stock Crítico
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Se ha detectado inventario bajo en algunos productos. Revisa el panel de control para más detalles.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
