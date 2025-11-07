import React from 'react';
import CalendarView from './components/CalendarView';
import './App.css';

function App() {
  return (
    <div className="App">
      <CalendarView />
    </div>
  );

  // ✅ CORREGIDO: ahora pasa user y onLogout al Navbar
  const ProtectedLayout = ({ children }) => {
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    return (
      <>
        <Navbar user={user} onLogout={handleLogout} />
        <div className="d-flex">
          <Sidebar />
          <main className="flex-grow-1 p-4" style={{ marginLeft: '250px' }}>
            {children}
          </main>
        </div>
      </>
    );
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/*" element={user ? <ProtectedLayout><Dashboard /></ProtectedLayout> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;