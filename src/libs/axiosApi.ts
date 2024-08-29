import axios from 'axios';

const axiosApi = axios.create();

axiosApi.interceptors.request.use(async (config) => {
    const Telegram = (window as any).Telegram;

    if (Telegram?.WebApp) {
        Telegram.WebApp.ready();

        const initData = Telegram.WebApp.initData;

        config.headers['--webapp-init'] = initData;
    } else {
        console.warn("Telegram WebApp is not available.");
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosApi;