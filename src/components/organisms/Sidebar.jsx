import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";

// Inline UserSection component to replace missing import
function UserSectionInline() {
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  if (!user) return null;

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : user.emailAddress ? user.emailAddress[0].toUpperCase() : 'U';

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {userInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user.emailAddress
              }
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.emailAddress}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          title="Logout"
        >
          <ApperIcon name="LogOut" size={16} />
        </button>
      </div>
    </div>
  );
}
const Sidebar = ({ isOpen, onClose }) => {
const navigation = [
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "TrendingUp" },
    { name: "Marketing", href: "/marketing", icon: "Mail" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Settings", href: "/settings", icon: "Settings" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-soft">
          {/* Logo */}
          <div className="flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="h-5 w-5 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Nexus CRM
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
                  }`
                }
              >
                <ApperIcon
                  name={item.icon}
                  className="mr-3 h-5 w-5 transition-colors duration-200"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>

{/* Footer - User Section */}
          <UserSectionInline />
        </div>
      </div>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 modal-backdrop"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-strong transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Nexus CRM
                  </h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-4 border-primary-500"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
                      }`
                    }
                  >
                    <ApperIcon
                      name={item.icon}
                      className="mr-3 h-5 w-5 transition-colors duration-200"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>

{/* Footer - User Section */}
            <UserSectionInline />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;