import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'Chart' },
    { to: '/admin/masajistas', label: 'Masajistas', icon: 'Person' },
    { to: '/admin/servicios', label: 'Servicios', icon: 'Spa' },
    { to: '/admin/agenda', label: 'Agenda', icon: 'Calendar' },
    { to: '/admin/clientes', label: 'Clientes', icon: 'People' },
    { to: '/admin/caja', label: 'Caja', icon: 'Money' },
    { to: '/admin/reportes', label: 'Reportes', icon: 'BarChart' },
  ];

  return (
    <div className="bg-dark text-white vh-100 position-fixed" style={{ width: '250px', top: 0, left: 0, paddingTop: '70px' }}>
      <div className="p-3">
        <h5 className="text-center mb-4">Menú</h5>
        <nav className="nav flex-column">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link text-white mb-2 px-3 py-2 rounded ${isActive ? 'bg-primary' : 'hover-bg-primary'}`
              }
              style={{ transition: '0.3s' }}
            >
              <span className="me-2">{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;