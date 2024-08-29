"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

const TelegramWebAppInitializer = () => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            WebApp.ready();
            WebApp.expand();
        }
    }, []);

    return null;
};

export default TelegramWebAppInitializer;