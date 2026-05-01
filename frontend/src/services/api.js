import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post(`${API.defaults.baseURL}/auth/refresh`, { refreshToken });
                localStorage.setItem('token', data.token);
                originalRequest.headers.Authorization = `Bearer ${data.token}`;
                return API(originalRequest);
            } catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default API;
