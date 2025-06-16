import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">

      {/* Sidebar: Always rendered, but toggled */}
      <div className={`fixed inset-y-0 left-0 z-50 md:static md:translate-x-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} md:w-64`}>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-screen bg-background overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        {/* Main Chat Window */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile dark overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
};

export default Layout;
