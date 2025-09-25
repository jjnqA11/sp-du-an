import React from 'react';
import { User, Theme } from '../types';
import { 
  Home, 
  Users, 
  Package, 
  Warehouse, 
  MessageCircle, 
  LogOut, 
  Sun, 
  Moon,
  Settings
} from 'lucide-react';

interface NavigationProps {
  currentUser: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
}

export default function Navigation({ 
  currentUser, 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  onLogout 
}: NavigationProps) {
  const isDark = theme === 'dark';

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home, roles: ['admin', 'staff', 'user'] },
    { id: 'users', label: 'Quản lý tài khoản', icon: Users, roles: ['admin'] },
    { id: 'containers', label: 'Quản lý Container', icon: Package, roles: ['admin', 'staff', 'user'] },
    { id: 'warehouses', label: 'Trạng thái Kho', icon: Warehouse, roles: ['admin', 'staff', 'user'] },
    { id: 'feedback', label: 'Phản hồi', icon: MessageCircle, roles: ['admin', 'staff', 'user'] },
  ];

  const availableItems = menuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <nav className={`fixed top-0 left-0 h-full w-64 transition-colors duration-300 ${
      isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    } border-r shadow-lg z-30`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Container Manager
              </h1>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                v1.0.0
              </p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentUser.role === 'admin' ? 'bg-purple-500' :
              currentUser.role === 'staff' ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              <span className="text-white font-medium">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentUser.name}
              </p>
              <p className={`text-sm capitalize ${
                currentUser.role === 'admin' ? 'text-purple-600' :
                currentUser.role === 'staff' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {currentUser.role === 'admin' ? 'Quản trị viên' :
                 currentUser.role === 'staff' ? 'Nhân viên' : 'Người dùng'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {availableItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? isDark 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} space-y-2`}>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="font-medium">
              {isDark ? 'Chế độ sáng' : 'Chế độ tối'}
            </span>
          </button>
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
              isDark
                ? 'text-red-400 hover:bg-red-900/20'
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Đăng xuất</span>
          </button>
        </div>
      </div>
    </nav>
  );
}