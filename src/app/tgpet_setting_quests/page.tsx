import TgpetSettings from "@/components/TgpetSettings";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Next.js Calender | TgpetAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Calender page for TgpetAdmin  Tailwind CSS Admin Dashboard Template",
};

const Index = () => {
    return (
        <DefaultLayout>
            <TgpetSettings />
        </DefaultLayout>
    );
};

export default Index;
