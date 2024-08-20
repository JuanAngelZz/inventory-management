import { getAllCategories } from '@/api/categories'
import CreateProductForm from '@/components/CreateProductForm'
import { DataTable } from '@/components/DataTable'
import Header from '@/components/Header'
import { Category } from '@/interfaces/models'
import { categoryColumns } from '@/tables/category'
import { useEffect, useState } from 'react'

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = async () => {
    try {
      const response = await getAllCategories()
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Header page='Categorías' />
      <DataTable
        columns={categoryColumns}
        data={categories}
        customButtonLabel='Añadir nueva categoría'
        customDialogContent={CreateProductForm}
      />
    </>
  )
}

export default Categories
