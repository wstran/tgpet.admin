"use client";

import axios from 'axios';
import WebApp from "@twa-dev/sdk";

const axiosApi = axios.create();

axiosApi.interceptors.request.use(async (config) => {
    const Telegram = WebApp;

    if (Telegram) {
        Telegram.ready();

        const initData = Telegram.initData;

        config.headers['--webapp-init'] = initData;
    } else {
        console.warn("Telegram WebApp is not available.");
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosApi;