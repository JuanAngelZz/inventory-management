import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthContextProvider } from './contexts/authContext'
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

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Dashboard />}>
          <Route path='' element={<Home />} />
          <Route path='movements' element={<Movements />} />
          <Route path='products' element={<Products />} />
          <Route path='products/create' element={<CreateProduct />} />
          <Route path='suppliers' element={<Suppliers />} />
          <Route path='suppliers/create' element={<CreateSupplier />} />
          <Route path='categories' element={<Categories />} />
          <Route path='administrate' element={<Administrate />} />
          <Route path='administrate/users' element={<Users />} />
          <Route path='administrate/backup' element={<Backup />} />
          <Route path='administrate/migrate' element={<Migrate />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthContextProvider>
  )
}

export default App
