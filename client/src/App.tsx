import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthContextProvider } from './contexts/authContext'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Movements from './pages/Movements'
import Home from './pages/Home'
import Suppliers from './pages/Suppliers'

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/*' element={<Dashboard />}>
          <Route path='' element={<Home />} />
          <Route path='movements' element={<Movements />} />
          <Route path='products' element={<Products />} />
          <Route path='suppliers' element={<Suppliers />} />
          <Route path='categories' element={<Categories />} />
        </Route>
      </Routes>
    </AuthContextProvider>
  )
}

export default App
