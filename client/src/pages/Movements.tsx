import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { movementColumns } from '@/tables/movement'
import { useEffect } from 'react'
import useMovementStore from '@/stores/movementStore'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

const Movements = () => {
  const movements = useMovementStore((state) => state.movements)
  const getMovements = useMovementStore((state) => state.getMovements)

  useEffect(() => {
    getMovements()
  }, [])

  return (
    <>
      <Header 
        page='Movimientos' 
        action={
          <Button asChild>
            <Link to="/movements/create">
              <Plus className="mr-2 h-4 w-4" />
              Registrar Movimiento
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={movementColumns}
        data={movements}
        searchFor='producto_nombre'
        searchPlaceholder='Buscar por producto'
      />
    </>
  )
}

export default Movements
