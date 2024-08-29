"use client";

import TgpetIndex from "@/components/TgpetIndex";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TelegramWebAppInitializer from "./init";

export const metadata: Metadata = {
  title:
    "Ananlysts | TgpetAdmin",
  description: "",
};

export default function Home() {
  return (
    <>
      <TelegramWebAppInitializer />
      <DefaultLayout>
        <TgpetIndex />
      </DefaultLayout>
    </>
  );
}
