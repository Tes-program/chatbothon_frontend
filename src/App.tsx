import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Route, Routes } from "react-router-dom";
import './index.css';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DocumentUpload from "./pages/DocumentUpload";
import Chat from "./pages/Chat";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute>
              <DocumentUpload />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:id" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;