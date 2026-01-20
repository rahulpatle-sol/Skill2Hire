import axios from 'axios';
import { toast } from 'react-toastify';

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    withCredentials: true 
});

// Response Interceptor for Global Error Handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Something went wrong";
        toast.error(message); 
        return Promise.reject(error);
    }
);

// --- AUTH FUNCTIONS (YE MISSING THE) ---

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

// --- ADMIN FUNCTIONS ---

export const getAllUsers = async () => {
    const res = await api.get('/admin/users');
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await api.delete(`/admin/user/${id}`);
    toast.success("User deleted successfully!");
    return res.data;
};