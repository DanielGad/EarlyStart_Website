// import React, { createContext, useState, useContext, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Create AuthContext
// const AuthContext = createContext(null);

// export const useAuth = () => useContext(AuthContext);

// interface AuthProviderProps {
//   children: ReactNode; // Explicitly type the children prop
//   userData: ReactNode; // Explicitly type the children prop
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState(null); // Store user data
//   const navigate = useNavigate();

//   const login = async (userData: React.SetStateAction<null>) => {
//     setUser(userData);
//     if (userData?.userRole === 'admin') {
//       navigate('/admin-dashboard');
//     } else {
//       navigate('/user-dashboard');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     navigate('/login');
//   };

//   const value = {
//     user,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
