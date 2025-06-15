import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // default closed on mobile

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 bg-background h-screen overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />

        {/* Main chat page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default Layout;
