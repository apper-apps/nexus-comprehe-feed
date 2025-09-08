import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../../App";
import { markAllNotificationsAsRead, markNotificationAsRead, setNotifications, setUnreadCount } from "../../store/userSlice";
import * as notificationService from "../../services/api/notificationService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
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
  const { user, isAuthenticated, notifications, unreadCount } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const notificationRef = useRef(null);
  // Load notifications on component mount
  useEffect(() => {
    if (user?.userId) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [user?.userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const loadNotifications = async () => {
    if (!user?.userId) return;
    
    setNotificationLoading(true);
    try {
      const notificationsData = await notificationService.getAll(user.userId);
      dispatch(setNotifications(notificationsData));
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    if (!user?.userId) return;
    
    try {
      const count = await notificationService.getUnreadCount(user.userId);
      dispatch(setUnreadCount(count));
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      loadNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        dispatch(markNotificationAsRead(notificationId));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user?.userId) return;
    
    try {
      const success = await notificationService.markAllAsRead(user.userId);
      if (success) {
        dispatch(markAllNotificationsAsRead());
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };
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
            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleNotificationClick}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 relative"
              >
                <ApperIcon name="Bell" className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-strong border border-gray-200 z-50 max-h-96 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notificationLoading ? (
                      <div className="p-4 text-center">
                        <div className="inline-block w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-4 text-center">
                        <ApperIcon name="Bell" className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.Id}
                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.is_read_c ? 'bg-primary-50' : ''
                            }`}
                            onClick={() => !notification.is_read_c && handleMarkAsRead(notification.Id)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.is_read_c ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                  {notification.message_c}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatNotificationTime(notification.timestamp_c)}
                                </p>
                              </div>
                              {!notification.is_read_c && (
                                <div className="w-2 h-2 bg-accent-500 rounded-full ml-2 flex-shrink-0"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
)}
            </div>
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