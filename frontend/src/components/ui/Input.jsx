// src/components/ui/Input.jsx
const Input = ({ className = '', ...props }) => (
  <input className={`form-control ${className}`} {...props} />
);
export default Input;