import TgpetIndex from "@/components/TgpetIndex";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WebApp from "@twa-dev/sdk";
import { useLayoutEffect } from "react";

export const metadata: Metadata = {
  title:
    "Ananlysts | TgpetAdmin",
  description: "",
};

export default function Home() {
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      WebApp.ready();
      WebApp.expand();
    }
  }, []);

  return (
    <>
      <DefaultLayout>
        <TgpetIndex />
      </DefaultLayout>
    </>
  );
}
