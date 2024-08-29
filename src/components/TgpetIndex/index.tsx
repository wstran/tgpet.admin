"use client";
import React, { useEffect } from "react";
import UserAnalytics from "./components/UserAnalytics";
import CardDataStats from "../CardDataStats";
import UserTable from './components/UserTable'
import { formatPriceNumber } from "@/libs/custom";
import useAxios from "@/hooks/useAxios";

/* const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const DeviceAnalytics = dynamic(() => import("./components/RegionAnalytics"), {
  ssr: false,
}); */

type DataUser = {
  analyst_time: string,
  analyst_type: string,
  last_active_1h_percent: number,
  last_active_1h_users: number,
  last_active_3h_percent: number,
  last_active_3h_users: number,
  last_active_6h_percent: number,
  last_active_6h_users: number,
  last_active_12h_percent: number,
  last_active_12h_users: number,
  new_users: number,
  new_users_percent: number,
  total_borrowed_users: number,
  total_borrowed_users_percent: number,
  total_tgpet_borrowed_amount: number,
  total_tgpet_borrowed_amount_percent: number,
  total_tgpet_repayed_amount: number,
  total_tgpet_repayed_amount_percent: number,
  total_ton_mortgage_amount: number,
  total_users: number,
  total_users_percent: number,
  updated_at: string,
  user_contries: { [key: string]: number },
  daily_data_chart: { dates: string[], categories: string[], series: { name: string, data: number[] }[] },
  weekly_data_chart: { dates: string[], categories: string[], series: { name: string, data: number[] }[] },
  monthly_data_chart: { dates: string[], categories: string[], series: { name: string, data: number[] }[] },
};

const ECommerce: React.FC = () => {
  const [dataUser, setDataUser] = React.useState<DataUser>();
  const axiosApi = useAxios();

  useEffect(() => {
    axiosApi?.get("/api/users/get.users")
      .then(({ data }) => setDataUser(data))
      .catch(console.error);
  }, [axiosApi]);

  return (
    dataUser && <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="User activity in the last 1 hour" total={String(dataUser?.last_active_1h_users ? formatPriceNumber(dataUser.last_active_1h_users, 0) : 0)} rate={String(dataUser?.last_active_1h_percent ? formatPriceNumber(dataUser.last_active_1h_percent, 2) : 0)} {...(dataUser?.last_active_1h_percent ? (dataUser.last_active_1h_percent > 0 ? { levelUp: true } : { levelDown: true }) : {})}>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="User activity in the last 6 hours" total={String(dataUser?.last_active_6h_users ? formatPriceNumber(dataUser.last_active_6h_users, 0) : 0)} rate={String(dataUser?.last_active_6h_percent ? formatPriceNumber(dataUser.last_active_6h_percent, 2) : 0)} {...(dataUser?.last_active_6h_percent ? (dataUser.last_active_6h_percent > 0 ? { levelUp: true } : { levelDown: true }) : {})}>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="16"
            viewBox="0 0 22 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z"
              fill=""
            />
            <path
              d="M11 10.9219C9.38438 10.9219 8.07812 9.61562 8.07812 8C8.07812 6.38438 9.38438 5.07812 11 5.07812C12.6156 5.07812 13.9219 6.38438 13.9219 8C13.9219 9.61562 12.6156 10.9219 11 10.9219ZM11 6.625C10.2437 6.625 9.625 7.24375 9.625 8C9.625 8.75625 10.2437 9.375 11 9.375C11.7563 9.375 12.375 8.75625 12.375 8C12.375 7.24375 11.7563 6.625 11 6.625Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Brrowed Users" total={String(dataUser?.total_borrowed_users ? formatPriceNumber(dataUser.total_borrowed_users, 0) : 0)} rate={String(dataUser?.total_borrowed_users_percent ? formatPriceNumber(dataUser.total_borrowed_users_percent, 2) : 0)} {...(dataUser?.total_borrowed_users_percent ? (dataUser.total_borrowed_users_percent > 0 ? { levelUp: true } : { levelDown: true }) : {})}>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Users" total={String(dataUser?.total_users ? formatPriceNumber(dataUser.total_users, 0) : 0)} rate={String(dataUser?.total_users_percent ? formatPriceNumber(dataUser.total_users_percent, 2) : 0)} {...(dataUser?.total_users_percent ? (dataUser.total_users_percent > 0 ? { levelUp: true } : { levelDown: true }) : {})}>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="18"
            viewBox="0 0 22 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.18418 8.03751C9.31543 8.03751 11.0686 6.35313 11.0686 4.25626C11.0686 2.15938 9.31543 0.475006 7.18418 0.475006C5.05293 0.475006 3.2998 2.15938 3.2998 4.25626C3.2998 6.35313 5.05293 8.03751 7.18418 8.03751ZM7.18418 2.05626C8.45605 2.05626 9.52168 3.05313 9.52168 4.29063C9.52168 5.52813 8.49043 6.52501 7.18418 6.52501C5.87793 6.52501 4.84668 5.52813 4.84668 4.29063C4.84668 3.05313 5.9123 2.05626 7.18418 2.05626Z"
              fill=""
            />
            <path
              d="M15.8124 9.6875C17.6687 9.6875 19.1468 8.24375 19.1468 6.42188C19.1468 4.6 17.6343 3.15625 15.8124 3.15625C13.9905 3.15625 12.478 4.6 12.478 6.42188C12.478 8.24375 13.9905 9.6875 15.8124 9.6875ZM15.8124 4.7375C16.8093 4.7375 17.5999 5.49375 17.5999 6.45625C17.5999 7.41875 16.8093 8.175 15.8124 8.175C14.8155 8.175 14.0249 7.41875 14.0249 6.45625C14.0249 5.49375 14.8155 4.7375 15.8124 4.7375Z"
              fill=""
            />
            <path
              d="M15.9843 10.0313H15.6749C14.6437 10.0313 13.6468 10.3406 12.7874 10.8563C11.8593 9.61876 10.3812 8.79376 8.73115 8.79376H5.67178C2.85303 8.82814 0.618652 11.0625 0.618652 13.8469V16.3219C0.618652 16.975 1.13428 17.4906 1.7874 17.4906H20.2468C20.8999 17.4906 21.4499 16.9406 21.4499 16.2875V15.4625C21.4155 12.4719 18.9749 10.0313 15.9843 10.0313ZM2.16553 15.9438V13.8469C2.16553 11.9219 3.74678 10.3406 5.67178 10.3406H8.73115C10.6562 10.3406 12.2374 11.9219 12.2374 13.8469V15.9438H2.16553V15.9438ZM19.8687 15.9438H13.7499V13.8469C13.7499 13.2969 13.6468 12.7469 13.4749 12.2313C14.0937 11.7844 14.8499 11.5781 15.6405 11.5781H15.9499C18.0812 11.5781 19.8343 13.3313 19.8343 15.4625V15.9438H19.8687Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>
      <div className="mt-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {dataUser && <UserAnalytics daily_data_chart={dataUser.daily_data_chart} weekly_data_chart={dataUser.weekly_data_chart} monthly_data_chart={dataUser.monthly_data_chart} />}
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        {/* <DeviceAnalytics />
        <MapOne /> */}
        {/* <div className="col-span-full">
          <UserTable />
        </div> */}
      </div>
    </>
  );
};

export default ECommerce;
