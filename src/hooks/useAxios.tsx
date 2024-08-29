"use client";
import axios from 'axios';
import useTelegramInitData from './useInitData';

export default function useAxios() {
    const initData = useTelegramInitData();

    const axiosApi = axios.create();

    axiosApi.interceptors.request.use(async (config) => {

        config.headers['--webapp-init'] = initData;

        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    return initData ? axiosApi : null;
}