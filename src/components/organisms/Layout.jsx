import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/organisms/Header";
import DesktopSidebar from "@/components/organisms/DesktopSidebar";
import MobileSidebar from "@/components/organisms/MobileSidebar";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <DesktopSidebar currentPath={location.pathname} />
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={location.pathname}
      />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <Header onMobileMenuToggle={() => setIsMobileMenuOpen(true)} />
        
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;