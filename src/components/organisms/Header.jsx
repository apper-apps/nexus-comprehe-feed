import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";

const Header = ({
  title,
  searchValue,
  onSearchChange,
  onMobileMenuToggle,
  showSearch = true,
  children 
}) => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const LogoutButton = () => {
    if (!isAuthenticated) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ApperIcon name="LogOut" className="h-4 w-4" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    );
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-soft sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 mr-4"
            >
              <ApperIcon name="Menu" className="h-6 w-6" />
            </button>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          </div>

          {/* Center Section - Search */}
          {showSearch && (
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search contacts..."
              />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
{children}
            
            {/* Notifications */}
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 relative">
              <ApperIcon name="Bell" className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
              <ApperIcon name="Settings" className="h-6 w-6" />
            </button>

            {/* Logout Button */}
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Search contacts..."
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;