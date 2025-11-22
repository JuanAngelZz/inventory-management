import Header from '@/components/Header'
import { useEffect } from 'react'
import useCategoryStore from '@/stores/categoryStore'
import { Button } from '@/components/ui/button'
import CategoryItem from '@/components/CategoryItem'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/authContext'
import { Plus } from 'lucide-react'

const Categories = () => {
  const categories = useCategoryStore((state) => state.categories)
  const getCategories = useCategoryStore((state) => state.getCategories)
  const { user } = useAuth()

  useEffect(() => {
    getCategories()
  }, [])

  return (
    <>
      <Header 
        page='Categorías' 
        action={
          user?.rol === 'administrador' && (
            <Button asChild>
              <Link to='create'>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Categoría
              </Link>
            </Button>
          )
        }
      />
      <main>
        <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      </main>
    </>
  )
}

export default Categories
