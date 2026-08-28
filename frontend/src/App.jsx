import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Discovery from './pages/Discovery'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar /> 
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute> }/>
          <Route path="/schemes" element={<Discovery />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App