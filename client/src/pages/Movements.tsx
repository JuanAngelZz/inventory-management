import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { movementColumns } from '@/tables/movement'
import { useEffect } from 'react'
import useMovementStore from '@/stores/movementStore'

const Movements = () => {
  const movements = useMovementStore((state) => state.movements)
  const getMovements = useMovementStore((state) => state.getMovements)

  useEffect(() => {
    getMovements()
  }, [])

  return (
    <>
      <Header page='Movimientos' />
      <DataTable
        columns={movementColumns}
        data={movements}
        customButtonLabel='Registrar movimiento'
        url='/movements/create'
        searchFor='producto_nombre'
        searchPlaceholder='Buscar por producto'
      />
    </>
  )
}

export default Movements
