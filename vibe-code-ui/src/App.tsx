import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TaskBar from './components/TaskBar'
import Login from './components/Login'
import Register from './components/Register'
import CodePage from './components/CodePage'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { token } = useAuth()

  return (
    <BrowserRouter>
      <div
        className={token ? 'app-content' : ''}
        style={{
          backgroundColor: token ? 'white' : '#f3f4f6',
          color: token ? '#1a1a1a' : '',
          minHeight: '100vh',
          paddingTop: token ? '48px' : '0px',
        }}
      >
        {token && <TaskBar />}

        <Routes>
          {!token ? (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/login"    element={<Login />} />
              <Route path="*"         element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/problem/:slug" element={<CodePage />} />
              <Route path="*"               element={<Navigate to="/problem/two-sum" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  )
}
