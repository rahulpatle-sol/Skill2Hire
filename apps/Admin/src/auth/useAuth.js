import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from './authServices';

export const useAuth = () => {
    // Check karo agar pehle se user local storage mein hai
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const data = await loginApi(credentials);
            const loggedInUser = data.data.user;
            
            // 1. State update karo
            setUser(loggedInUser);
            
            // 2. Browser ki memory (Local Storage) mein save karo
            localStorage.setItem("user", JSON.stringify(loggedInUser));

            // 3. Role based navigation
            if (loggedInUser.role === "ADMIN") navigate("/admin/users");
            else if (loggedInUser.role === "MANAGER") navigate("/manager/bridge");
            else navigate("/dashboard");

            return data;
        } catch (error) {
            // Error handling jo tumne likha tha
            throw error.response?.data || error;
        }
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return { user, handleLogin, logout };
};