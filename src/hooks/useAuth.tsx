// src/hooks/useAuth.ts
import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};