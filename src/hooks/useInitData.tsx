import { useEffect, useState } from 'react';

const useTelegramInitData = () => {
    const [initData, setInitData] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Telegram && (window as any).Telegram?.WebApp) {
            setInitData((window as any).Telegram.WebApp.initData);
        }
    }, []);

    return initData;
};

export default useTelegramInitData;