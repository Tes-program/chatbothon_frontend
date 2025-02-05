import React from "react";
import { Route, Routes } from "react-router-dom";
import './index.css';
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DocumentUpload from "./pages/DocumentUpload";


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/upload" element={<DocumentUpload/>} />
    </Routes>
  );
};

export default App;