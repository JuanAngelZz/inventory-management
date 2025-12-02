import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthContextProvider, useAuth } from './contexts/authContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Movements from './pages/Movements'
import Home from './pages/Home'
import Suppliers from './pages/Suppliers'
import { Toaster } from './components/ui/toaster'
import CreateProduct from './pages/CreateProduct'
import Administrate from './pages/Administrate'
import Users from './pages/Users'
import Backup from './pages/Backup'
import Migrate from './pages/Migrate'
import CreateSupplier from './pages/CreateSupplier'
import CreateMovement from './pages/CreateMovement'
import CreateCategory from './pages/CreateCategory'
import CreateUser from './pages/CreateUser'
import Report from './pages/Report'
import Charts from './pages/Charts'
import ExpiringProducts from './pages/ExpiringProducts'

function App() {
  return (
    <AuthContextProvider>
      <AppRoutes />
      <Toaster />
    </AuthContextProvider>
  )
}

function AppRoutes() {
  const { user } = useAuth()

  return (
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Dashboard />}>
          <Route path='' element={<Home />} />
          <Route path='movements' element={<Movements />} />
          <Route path='movements/create' element={<CreateMovement />} />
          <Route path='products' element={<Products />} />
          
          <Route element={<ProtectedRoute isAllowed={!!user && user.rol === 'administrador'} />}>
            <Route path='products/create' element={<CreateProduct />} />
            <Route path='suppliers/create' element={<CreateSupplier />} />
            <Route path='categories/create' element={<CreateCategory />} />
            
            <Route path='administrate' element={<Administrate />} />
            <Route path='administrate/users' element={<Users />} />
            <Route path='administrate/users/create' element={<CreateUser />} />
            <Route path='administrate/users/edit/:id' element={<CreateUser />} />
            <Route path='administrate/backup' element={<Backup />} />
            <Route path='administrate/migrate' element={<Migrate />} />
            <Route path='administrate/report' element={<Report />} />
          <Route path='charts' element={<Charts />} />
          </Route>

          <Route path='expiring-products' element={<ExpiringProducts />} />
          <Route path='suppliers' element={<Suppliers />} />
          <Route path='categories' element={<Categories />} />
        </Route>
      </Routes>
  )
}

export default App
