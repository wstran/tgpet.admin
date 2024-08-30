import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const useTelegramInitData = () => {
    const [initData, setInitData] = useState(null);

    useEffect(() => {
        WebApp.ready();
        WebApp.expand();

        if (typeof window !== 'undefined' && (window as any).Telegram && (window as any).Telegram?.WebApp) {
            setInitData((window as any).Telegram.WebApp.initData);
        }
    }, []);

    return initData;
};

export default useTelegramInitData;