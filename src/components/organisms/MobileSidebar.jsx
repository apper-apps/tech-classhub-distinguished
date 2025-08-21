import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileSidebar = ({ isOpen, onClose, currentPath }) => {
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: "LayoutDashboard"
    },
    {
      name: "Students", 
      href: "/students",
      icon: "Users"
    },
    {
      name: "Attendance",
      href: "/attendance", 
      icon: "Calendar"
    },
    {
      name: "Grades",
      href: "/grades",
      icon: "BookOpen"
    }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">ClassHub</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border border-primary-200"
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  )}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "mr-3 w-5 h-5 transition-colors duration-200",
                      isActive 
                        ? "text-primary-600" 
                        : "text-secondary-400 group-hover:text-secondary-600"
                    )} 
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;