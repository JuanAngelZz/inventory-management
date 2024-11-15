import Header from '@/components/Header'
import { useEffect } from 'react'
import useCategoryStore from '@/stores/categoryStore'
import { Button } from '@/components/ui/button'
import CategoryItem from '@/components/CategoryItem'
import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <Header page='Categorías' />
      <main>
        <Button variant='outline' className='float-end' asChild>
          <Link to='create'>Agregar nueva Categoría</Link>
        </Button>
        <div className='w-full mt-12 grid grid-cols-4 grid-rows-4 gap-4'>
          {categories.map((category) => (
            <CategoryItem key={category.categoria_id} category={category} />
          ))}
        </div>
      </main>
    </>
  )
}

export default Categories
