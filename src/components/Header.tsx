import React from 'react';
import { User, LogOut, BarChart3, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast.success('Logout successful'); 
    navigate('/admin/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img src='/logo.png' alt='iimi' className='w-[50px] h-[50px] object-contain' />
            <span className='text-[#C93232] font-bold text-xl'>IIMI</span>
          </div>

          {/* Centered Navigation Menu */}
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-4 sm:space-x-8">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                  currentPath.includes('/admin/dashboard')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                onClick={() => navigate('/admin/applications')}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                  currentPath.includes('/admin/applications')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Applications</span>
              </button>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
            <button
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition duration-200 p-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
