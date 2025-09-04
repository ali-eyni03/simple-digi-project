import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState({ access: "demo-token", refresh: "demo-refresh" });
    const [user, setUser] = useState({ 
        phone_number: "09123456789", 
        user_id: 1,
        full_name: "کاربر دمو"
    });
    const [userRole, setUserRole] = useState('user'); 
    const [isAuthenticated, setIsAuthenticated] = useState(true); 

    const loginUser = async (username, password) => {
        console.log("Demo mode - Mock login:", username);
        const mockUser = { 
            phone_number: username || "09123456789", 
            user_id: Math.floor(Math.random() * 1000),
            full_name: "کاربر دمو"
        };
        setUser(mockUser);
        setIsAuthenticated(true);
        
        if (username && username.startsWith('seller')) {
            setUserRole('seller');
        } else if (username && username.startsWith('admin')) {
            setUserRole('admin');
        } else {
            setUserRole('user');
        }
        
        return { success: true, message: "ورود موفقیت‌آمیز در حالت دمو" };
    };

    const logoutUser = () => {
        console.log("Demo mode - Mock logout");
        alert("این یک نسخه دمو است - عملیات خروج شبیه‌سازی شد");
        setUser({ 
            phone_number: "09123456789", 
            user_id: 1,
            full_name: "کاربر دمو"
        });
        setUserRole('user');
    };

    const refreshUserRole = async () => {
        console.log("Demo mode - Mock refresh user role");
        return userRole;
    };

    const switchDemoRole = (newRole) => {
        console.log("Demo mode - Switching role to:", newRole);
        setUserRole(newRole);
        
        const roleNames = {
            'user': 'کاربر دمو',
            'seller': 'فروشنده دمو', 
            'admin': 'ادمین دمو'
        };
        
        setUser(prev => ({
            ...prev,
            full_name: roleNames[newRole] || 'کاربر دمو'
        }));
    };

    const contextData = {
        authTokens,
        setAuthTokens: (tokens) => {
            console.log("Demo mode - Mock token update:", tokens);
            setAuthTokens(tokens || { access: "demo-token", refresh: "demo-refresh" });
        },
        user,
        setUser,
        userRole,
        isAuthenticated,
        setIsAuthenticated: (status) => {
            console.log("Demo mode - Auth status:", status);
            setIsAuthenticated(status);
        },
        loginUser,
        logoutUser,
        refreshUserRole,
        switchDemoRole, 
        isDemoMode: true 
    };

    useEffect(() => {
        console.log("Demo mode initialized - All features accessible");
        console.log("Current user:", user);
        console.log("Current role:", userRole);
    }, []);

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};