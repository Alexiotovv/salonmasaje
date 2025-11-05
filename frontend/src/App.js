import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, login, register, logout } = useAuth();
  const navigate = useNavigate();

  const Login = () => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');

    const submit = (e) => {
      e.preventDefault();
      setError('');

      const result = login(email, pass);

      if (!result) {
        setError('Error interno. Intenta de nuevo.');
        return;
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    };

    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4" style={{ width: '380px' }}>
          <h3 className="text-center mb-4">Iniciar Sesión</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary w-100">
              Entrar
            </button>
          </form>
          <p className="text-center mt-3">
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        </div>
      </div>
    );
  };

  const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [error, setError] = useState('');

    const submit = (e) => {
      e.preventDefault();
      setError('');
      if (pass !== confirmPass) {
        setError('Las contraseñas no coinciden');
        return;
      }
      const result = register(name, email, pass);
      if (result?.success) {
        navigate('/');
      } else {
        setError(result?.error || 'Error al registrarse');
      }
    };

    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4" style={{ width: '380px' }}>
          <h3 className="text-center mb-4">Crear Cuenta</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <input type="text" className="form-control mb-3" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="email" className="form-control mb-3" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" className="form-control mb-3" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} required />
            <input type="password" className="form-control mb-3" placeholder="Confirmar" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
            <button type="submit" className="btn btn-success w-100">Registrarse</button>
          </form>
        </div>
      </div>
    );
  };

  const Dashboard = () => (
    <div className="p-5">
      <div className="alert alert-success">
        <h1>Bienvenido, {user?.name}!</h1>
      </div>
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