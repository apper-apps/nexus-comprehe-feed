import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import UserSection from "@/components/molecules/UserSection";
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

{/* Footer */}
          <UserSection />
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

{/* Footer */}
              <UserSection />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;