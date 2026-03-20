import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import GameLobby from './components/GameLobby';
import MotionArena from './components/MotionArena';
import { useStore } from './store';
import AdminLogin from './components/AdminLogin';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    return (
        <div className="flex flex-col min-h-screen bg-bg-app text-text-primary overflow-hidden">
            <Navbar onMenuOpen={() => setSidebarOpen(true)} />
            <div className="flex flex-1 min-h-0 relative">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <main className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {children}
                </main>
            </div>
        </div>
    );
};

// Route Guard Component
const ProtectedAdminRoute = ({ children }) => {
    const isAdminAuthenticated = useStore(state => state.isAdminAuthenticated);

    if (!isAdminAuthenticated) {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

const App = () => {
    const activeTheme = useStore(state => state.activeTheme);

    useEffect(() => {
        // Force Stake theme everywhere to fix 'black background' bug from cache
        document.documentElement.setAttribute('data-theme', 'stake');
        document.body.setAttribute('data-theme', 'stake');

        // Initialize dark/light mode from localStorage (default: dark)
        const savedMode = localStorage.getItem('elev8-theme-mode');
        if (savedMode === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            document.documentElement.classList.add('dark');
        }
    }, []);

    return (
        <Router>
            <Routes>
                {/* Full Screen Unwrapped Routes */}
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/arena" element={<MotionArena />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedAdminRoute>
                            <SuperAdminDashboard />
                        </ProtectedAdminRoute>
                    }
                />

                {/* Dashboard Wrapped Routes */}
                <Route
                    path="/*"
                    element={
                        <DashboardLayout>
                            <Routes>
                                <Route path="/lobby" element={<GameLobby />} />
                                <Route path="*" element={<Navigate to="/lobby" replace />} />
                            </Routes>
                        </DashboardLayout>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
