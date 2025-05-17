import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor
axiosInstance.interceptors.request.use((config) => {
    // console.log("🛠️ API_URL:", import.meta.env.VITE_API_URL);

    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default axiosInstance;