
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import { Box } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <>
      <Box p={3}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    
    </>
  )
}

export default App
