import "@/index.css";
import "react-toastify/dist/ReactToastify.css";
import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ToastContainer } from "react-toastify";
import userReducer from "./store/userSlice";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import Callback from "@/components/pages/Callback";
import ErrorPage from "@/components/pages/ErrorPage";
import ResetPassword from "@/components/pages/ResetPassword";
import PromptPassword from "@/components/pages/PromptPassword";
import ContactsPage from "@/components/pages/ContactsPage";
import MarketingPage from "@/components/pages/MarketingPage";
import ReportsPage from "@/components/pages/ReportsPage";
import DealsPage from "@/components/pages/DealsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import Sidebar from "@/components/organisms/Sidebar";
import { CustomPropertyProvider } from "@/contexts/CustomPropertyContext";
// Redux setup
const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Create auth context
export const AuthContext = createContext(null);

function AppRouter() {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          store.dispatch({ type: 'user/setUser', payload: JSON.parse(JSON.stringify(user)) });
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          store.dispatch({ type: 'user/clearUser' });
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        store.dispatch({ type: 'user/clearUser' });
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <CustomPropertyProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="flex h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
              <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
              <Route path="/*" element={
                <>
                  {/* Sidebar */}
                  <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                  
                  {/* Main Content */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <Routes>
                      <Route path="/" element={<Navigate to="/contacts" replace />} />
                      <Route 
                        path="/contacts" 
                        element={<ContactsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
                      />
                      <Route 
                        path="/deals" 
                        element={<DealsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
                      />
                      <Route 
                        path="/marketing" 
                        element={<MarketingPage onMobileMenuToggle={handleMobileMenuToggle} />} 
                      />
                      <Route 
                        path="/reports" 
                        element={<ReportsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
                      />
                      <Route 
                        path="/settings" 
                        element={<SettingsPage onMobileMenuToggle={handleMobileMenuToggle} />} 
                      />
                    </Routes>
                  </div>
                </>
              } />
            </Routes>
          </div>
          {/* Toast Notifications */}
          <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            theme="light" 
          />
        </div>
      </CustomPropertyProvider>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  );
}

export default App;