import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

// Estados de autenticación
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

// Acciones del reducer
const authActions = {
  SET_USER: 'SET_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT'
};

// Reducer para manejar el estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };
    case authActions.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case authActions.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case authActions.LOGOUT:
      return {
        ...initialState,
        loading: false
      };
    default:
      return state;
  }
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        
        if (currentUser) {
          // Verificar que el token siga siendo válido
          try {
            const response = await authService.getProfile();
            dispatch({ type: authActions.SET_USER, payload: response.user });
          } catch (error) {
            // Token inválido, limpiar storage
            authService.logout();
            dispatch({ type: authActions.LOGOUT });
          }
        } else {
          dispatch({ type: authActions.LOGOUT });
        }
      } else {
        dispatch({ type: authActions.LOGOUT });
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      dispatch({ type: authActions.SET_ERROR, payload: error.message });
      dispatch({ type: authActions.LOGOUT });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      dispatch({ type: authActions.SET_ERROR, payload: null });
      
      const response = await authService.login(credentials);
      dispatch({ type: authActions.SET_USER, payload: response.user });
      
      return response;
    } catch (error) {
      dispatch({ type: authActions.SET_ERROR, payload: error.response?.data?.message || error.message });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: authActions.SET_LOADING, payload: true });
      dispatch({ type: authActions.SET_ERROR, payload: null });
      
      const response = await authService.register(userData);
      dispatch({ type: authActions.SET_USER, payload: response.user });
      
      return response;
    } catch (error) {
      dispatch({ type: authActions.SET_ERROR, payload: error.response?.data?.message || error.message });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: authActions.LOGOUT });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      dispatch({ type: authActions.SET_USER, payload: response.user });
      
      return response;
    } catch (error) {
      dispatch({ type: authActions.SET_ERROR, payload: error.response?.data?.message || error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: authActions.SET_ERROR, payload: null });
  };

  const value = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;
