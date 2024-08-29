"use client";

import axios from 'axios';
import WebApp from "@twa-dev/sdk";

const axiosApi = axios.create();

WebApp.ready();
WebApp.expand();


axiosApi.interceptors.request.use(async (config) => {
    WebApp.ready();

    console.log(window);

    const initData = WebApp.initData;

    console.log(WebApp);

    console.log('initData', initData);

    config.headers['--webapp-init'] = initData;

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosApi;