"use client";
import axios from 'axios';
import useTelegramInitData from './useInitData';
import { useMemo } from 'react';

export default function useAxios() {
    const initData = useTelegramInitData();

    const axiosApi = useMemo(() => {
        const axiosInstance = axios.create();

        axiosInstance.interceptors.request.use(async (config) => {

            config.headers['--webapp-init'] = initData;

            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        return axiosInstance;
    }, [initData]);

    console.log('useAxios');

    return initData ? axiosApi : null;
}