// src/components/layout/Layout.jsx
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1" style={{ marginLeft: '250px', paddingTop: '70px' }}>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;