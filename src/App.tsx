import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import LoginError from './pages/auth/LoginError';
import Callback from './pages/auth/Callback';
import Home from './pages/Home';
import RideService from './pages/ride/RideService';
import SelectDestination from './pages/ride/SelectDestination';
import LoadingScreen from './components/LoadingScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// App routes
const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
      <Route path="/register" element={user ? <Navigate to="/home" replace /> : <Register />} />
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/auth/login-error" element={<LoginError />} />
      <Route path="/auth/callback" element={<Callback />} />
      
      {/* Protected routes */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      
      <Route path="/ride-service" element={
        <ProtectedRoute>
          <RideService />
        </ProtectedRoute>
      } />
      
      <Route path="/select-destination" element={
        <ProtectedRoute>
          <SelectDestination />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
