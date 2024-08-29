"use client";

import axios from 'axios';
import WebApp from "@twa-dev/sdk";

const axiosApi = axios.create();
console.log(1, WebApp);
axiosApi.interceptors.request.use(async (config) => {
    WebApp.ready();

    const initData = WebApp.initData;

    console.log(WebApp);

    console.log('initData', initData);

    config.headers['--webapp-init'] = initData;

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosApi;