import { getAllMovements } from '@/api/movements'
import CreateProductForm from '@/components/CreateProductForm'
import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { Movement } from '@/interfaces/models'
import { movementColumns } from '@/tables/movement'
import { useEffect, useState } from 'react'

const Movements = () => {
  const [movements, setMovements] = useState<Movement[]>([])

  useEffect(() => {
    getMovements()
  }, [])

  const getMovements = async () => {
    try {
      const response = await getAllMovements()
      setMovements(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header page='Movimientos' />
      <DataTable
        columns={movementColumns}
        data={movements}
        customButtonLabel='Registrar movimiento'
        customDialogContent={CreateProductForm}
      />
    </>
  )
}

export default Movements
