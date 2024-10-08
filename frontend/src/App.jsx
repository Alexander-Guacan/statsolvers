import { Route, Routes } from 'react-router-dom'
import './App.css'
import { NavBar } from './components/sections/NavBar'
import { Home } from './pages/Home'
import { Numeric } from './pages/Numeric'
import { Categoric } from './pages/Categoric'
import { Bivariable } from './pages/Bivariable'
import { Multivariable } from './pages/Multivariable'

function App() {

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/numeric' element={<Numeric />} />
        <Route path='/categoric' element={<Categoric />} />
        <Route path='/bivariable' element={<Bivariable />} />
        <Route path='/multivariable' element={<Multivariable />} />
      </Routes>
    </>
  )
}

export default App
