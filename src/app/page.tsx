import TgpetIndex from "@/components/TgpetIndex";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title:
    "Ananlysts | TgpetAdmin",
  description: "",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <TgpetIndex />
      </DefaultLayout>
    </>
  );
}
