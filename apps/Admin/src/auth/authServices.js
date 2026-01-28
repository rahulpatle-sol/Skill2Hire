import axios from 'axios';
import { toast } from 'react-toastify';

// Vite mein environment variables import karne ke liye 'import.meta.env' use hota hai
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true 
});

// Debugging ke liye (Optional: Sirf development mein dikhega)
if (import.meta.env.DEV) {
    console.log("🔗 Connected to API at:", BASE_URL);
}

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message); 
        return Promise.reject(error);
    }
);

// --- AUTH & ADMIN FUNCTIONS (Baaki code same rahega) ---

export const login = async (credentials) => {
    const res = await api.post('/users/login', credentials);
    return res.data;
};

export const verifyOTP = async (data) => {
    const res = await api.post('/users/verify-otp', data);
    return res.data;
};

export const registerUser = async (formData) => {
    const res = await api.post('/users/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const getAllUsers = async () => {
    const res = await api.get('/admin/users');
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/user/${id}`);
    toast.success("User deleted successfully!");
    return res.data;
};