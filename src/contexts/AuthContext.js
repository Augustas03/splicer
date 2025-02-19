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
        console.log("Setting up auth listener");
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log("Auth state changed:", user ? "User exists" : "No user");
            setAuthUser(user);
            setIsLoggedIn(!!user);
            setLoading(false);
        });
    
        return () => {
            console.log("Cleaning up auth listener");
            unsubscribe();
        };
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