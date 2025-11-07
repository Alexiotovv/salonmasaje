// src/components/ui/Button.jsx
const Button = ({ children, loading, className = '', ...props }) => (
  <button className={`btn ${className}`} disabled={loading} {...props}>
    {loading ? '⏳ Cargando...' : children}
  </button>
);
export default Button;