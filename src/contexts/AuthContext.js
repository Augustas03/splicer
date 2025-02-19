import React, { useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); 

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check last login time
                const lastLogin = localStorage.getItem('lastLoginTime');
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours
                
                if (lastLogin && Date.now() - parseInt(lastLogin) > maxAge) {
                    // Token expired
                    await auth.signOut();
                    localStorage.removeItem('lastLoginTime');
                } else {
                    // User is valid
                    setAuthUser(user);
                    setIsLoggedIn(true);
                }
            } else {
                setAuthUser(null);
                setIsLoggedIn(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        authUser,
        setAuthUser,
        isLoggedIn,
        setIsLoggedIn
    };

    // Don't render children until auth state is checked
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}