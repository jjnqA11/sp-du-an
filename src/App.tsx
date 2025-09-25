import React, { useState, useEffect } from 'react';
import { User, Container, Warehouse, Feedback, Theme, AppState } from './types';
import { mockUsers, mockContainers, mockWarehouses, mockFeedbacks } from './data/mockData';

import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import ContainerManagement from './components/ContainerManagement';
import WarehouseStatus from './components/WarehouseStatus';
import FeedbackComponent from './components/Feedback';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    currentUser: null,
    theme: 'light',
    users: mockUsers,
    containers: mockContainers,
    warehouses: mockWarehouses,
    feedbacks: mockFeedbacks
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setAppState(prev => ({ ...prev, theme: savedTheme }));
    }
  }, []);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('theme', appState.theme);
    // Apply theme to document
    if (appState.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appState.theme]);

  const toggleTheme = () => {
    setAppState(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const handleLogin = (user: User) => {
    setAppState(prev => ({ ...prev, currentUser: user }));
  };

  const handleLogout = () => {
    setAppState(prev => ({ ...prev, currentUser: null }));
    setActiveTab('dashboard');
  };

  // User management handlers
  const handleCreateUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAppState(prev => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === id ? { ...user, ...updates } : user
      )
    }));
  };

  const handleDeleteUser = (id: string) => {
    setAppState(prev => ({
      ...prev,
      users: prev.users.filter(user => user.id !== id)
    }));
  };

  // Container management handlers
  const handleCreateContainer = (containerData: Omit<Container, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newContainer: Container = {
      ...containerData,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    setAppState(prev => ({
      ...prev,
      containers: [...prev.containers, newContainer]
    }));
  };

  const handleUpdateContainer = (id: string, updates: Partial<Container>) => {
    setAppState(prev => ({
      ...prev,
      containers: prev.containers.map(container => 
        container.id === id ? { 
          ...container, 
          ...updates, 
          updatedAt: new Date().toISOString() 
        } : container
      )
    }));
  };

  const handleDeleteContainer = (id: string) => {
    setAppState(prev => ({
      ...prev,
      containers: prev.containers.filter(container => container.id !== id)
    }));
  };

  // Feedback management handlers
  const handleCreateFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setAppState(prev => ({
      ...prev,
      feedbacks: [...prev.feedbacks, newFeedback]
    }));
  };

  const handleUpdateFeedback = (id: string, updates: Partial<Feedback>) => {
    setAppState(prev => ({
      ...prev,
      feedbacks: prev.feedbacks.map(feedback => 
        feedback.id === id ? { ...feedback, ...updates } : feedback
      )
    }));
  };

  // If not logged in, show login page
  if (!appState.currentUser) {
    return (
      <Login 
        onLogin={handleLogin}
        theme={appState.theme}
        toggleTheme={toggleTheme}
        users={appState.users}
      />
    );
  }

  // Main application
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      appState.theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navigation
        currentUser={appState.currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={appState.theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            currentUser={appState.currentUser}
            containers={appState.containers}
            warehouses={appState.warehouses}
            feedbacks={appState.feedbacks}
            theme={appState.theme}
          />
        )}

        {activeTab === 'users' && appState.currentUser.role === 'admin' && (
          <UserManagement
            users={appState.users}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            theme={appState.theme}
          />
        )}

        {activeTab === 'containers' && (
          <ContainerManagement
            containers={appState.containers}
            onCreateContainer={handleCreateContainer}
            onUpdateContainer={handleUpdateContainer}
            onDeleteContainer={handleDeleteContainer}
            currentUser={appState.currentUser}
            theme={appState.theme}
          />
        )}

        {activeTab === 'warehouses' && (
          <WarehouseStatus
            warehouses={appState.warehouses}
            theme={appState.theme}
          />
        )}

        {activeTab === 'feedback' && (
          <FeedbackComponent
            feedbacks={appState.feedbacks}
            containers={appState.containers}
            onCreateFeedback={handleCreateFeedback}
            onUpdateFeedback={handleUpdateFeedback}
            currentUser={appState.currentUser}
            theme={appState.theme}
          />
        )}
      </main>
    </div>
  );
}