import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user has a valid token
  useEffect(() => {
    const token = localStorage.getItem('pdftocl_token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          // Token expired or invalid — clear it
          localStorage.removeItem('pdftocl_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('pdftocl_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('pdftocl_token');
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — every component calls this
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}








// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { loginWithGoogle } from '../lib/firebase';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState({
//     name: 'Ramesh K. (Senior Typist)',
//     email: 'ramesh.k@speedycustoms.in',
//     role: 'Senior Customs Typist'
//   });

//   const [firmProfile, setFirmProfile] = useState({
//     firmName: 'Speedy Customs Logistics LLP',
//     chaLicenceNo: '11/1892/KND',
//     customsHousePort: 'INKND1 - Deendayal Port Authority, Kandla',
//     address: 'Plot 68-69, Gurukul City Center, Ward DC-2, Gandhidham',
//     city: 'Gandhidham, Kutch (Deendayal Port)',
//     gstin: '24AABCS9912E1Z8',
//     email: 'ops@speedycustoms.in',
//     phone: '+91 2836 230190',
//     plan: 'Enterprise Pro',
//     monthlyExtractionsUsed: 142,
//     monthlyLimit: 500
//   });

//   const loginGoogle = async () => {
//     try {
//       const user = await loginWithGoogle();
//       if (user) {
//         const userData = {
//           name: user.displayName || 'Senior Customs Typist',
//           email: user.email || 'typist@speedycustoms.in',
//           role: 'Senior Customs Typist'
//         };
//         setCurrentUser(userData);
//         return userData;
//       }
//     } catch (err) {
//       console.warn('Google Auth fallback to demo user:', err);
//       const fallback = {
//         name: 'Ramesh K.',
//         email: 'ramesh.k@speedycustoms.in',
//         role: 'Senior Customs Typist'
//       };
//       setCurrentUser(fallback);
//       return fallback;
//     }
//   };

//   const loginDemo = (role = 'Senior Customs Typist') => {
//     const user = {
//       name: 'Ramesh K. (Senior Typist)',
//       email: 'ramesh.k@speedycustoms.in',
//       role
//     };
//     setCurrentUser(user);
//     return user;
//   };

//   const loginWithEmail = (email, password) => {
//     const nameFromEmail = email.split('@')[0].replace('.', ' ');
//     const user = {
//       name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
//       email,
//       role: 'Customs Typist'
//     };
//     setCurrentUser(user);
//     return user;
//   };

//   const registerUser = ({ name, email, firmName, licenceNo }) => {
//     const user = {
//       name,
//       email,
//       role: 'CHA Agency Admin'
//     };
//     setCurrentUser(user);
//     if (firmName) {
//       setFirmProfile((prev) => ({
//         ...prev,
//         firmName,
//         chaLicenceNo: licenceNo || prev.chaLicenceNo,
//         email
//       }));
//     }
//     return user;
//   };

//   const logout = () => {
//     setCurrentUser(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         currentUser,
//         setCurrentUser,
//         firmProfile,
//         setFirmProfile,
//         loginGoogle,
//         loginDemo,
//         loginWithEmail,
//         registerUser,
//         logout
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
