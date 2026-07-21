import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ToolWorkspace from './pages/ToolWorkspace';
import Community from './pages/Community';
import Settings from './pages/Settings';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <>
      {/* Unauthenticated View: Show Auth Gate & Landing Screen */}
      <SignedOut>
        <AuthPage />
      </SignedOut>

      {/* Authenticated View: Full Studio Access */}
      <SignedIn>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="tools" element={<Navigate to="/tools/write-article" replace />} />
              <Route path="tools/:toolId" element={<ToolWorkspace />} />
              <Route path="community" element={<Community />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SignedIn>
    </>
  );
}
