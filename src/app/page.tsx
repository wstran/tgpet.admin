import TgpetIndex from "@/components/TgpetIndex";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import WebApp from "@twa-dev/sdk";

export const metadata: Metadata = {
  title:
    "Ananlysts | TgpetAdmin",
  description: "",
};

WebApp.ready();
WebApp.expand();

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <TgpetIndex />
      </DefaultLayout>
    </>
  );
}
