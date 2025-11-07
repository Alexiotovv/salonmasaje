import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          Spa Manager
        </Link>
        <div className="ms-auto d-flex align-items-center">
          {user ? (
            <>
              <span className="text-white me-3">Hola, {user.name}</span>
              <button onClick={onLogout} className="btn btn-outline-light btn-sm">
                Cerrar 
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;