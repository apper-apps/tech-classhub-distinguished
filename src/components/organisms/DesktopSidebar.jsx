import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const DesktopSidebar = ({ currentPath }) => {
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
    <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">ClassHub</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-center mb-2">
              <ApperIcon name="Sparkles" className="w-4 h-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-primary-700">Quick Tip</span>
            </div>
            <p className="text-xs text-primary-600">
              Use the search bar to quickly find students, assignments, or grades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;