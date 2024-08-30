"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import UserAnalytics from "./components/UserAnalytics";
import CardDataStats from "../CardDataStats";
import UserTable from './components/UserTable'
import { formatPriceNumber } from "@/libs/custom";
import useAxios from "@/hooks/useAxios";
import { message, Modal } from "antd";

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

type Message = { is_test: boolean, message: string, photo: string, buttons: { text: string, url: string }[][] };

const MessageModal = ({ setNewMessage }: { setNewMessage: Dispatch<SetStateAction<Message>> }) => {
  const [message, setMessage] = useState<Message>({ is_test: true, message: '', photo: '', buttons: [] });

  useEffect(() => setNewMessage(message), [message]);

  return (
    <div className="space-y-2">
      <div className="w-full">
        <label className="mb-3 block text-sm font-medium">
          Message <span className="text-meta-1">*</span>
        </label>
        <textarea
          value={message.message}
          onChange={(e) => {
            setMessage((i) => ({ ...i, message: e.target.value }));
          }}
          rows={6}
          placeholder="Enter description"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
        ></textarea>
      </div>
      <div className="w-full">
        <label className="mb-3 block text-sm font-medium">
          Photo
        </label>
        <input
          value={message.photo}
          onChange={(e) => {
            setMessage((i) => ({ ...i, photo: e.target.value }));
          }}
          type="text"
          placeholder="Enter photo URL"
          className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
        />
      </div>
      <div className="w-full">
        <div className="flex mt-4">
          <label className="mb-3 block text-sm font-medium pr-1">
            Button List
          </label>
          <svg
            className={true ? 'hover:cursor-pointer' : 'hidden'}
            onClick={() => {
              setMessage((i) => ({ ...i, buttons: [...i.buttons, [{ text: '', url: '' }]] }));
            }}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {message.buttons.map((buttons, index) => (
          <>
            <div key={index} className="w-full h-full py-2">
              <div className="items-center bg-gray-3 border-solid border-[#474747] border-[1px] p-4 rounded-lg">
                <div className="w-full flex justify-between mb-4">
                  <svg
                    onClick={() => {
                      setMessage((i) => ({ ...i, buttons: i.buttons.filter((_, index_2) => index !== index_2) }));
                    }}
                    className="hover:cursor-pointer"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg
                    onClick={() => {
                      setMessage((i) => ({ ...i, buttons: i.buttons.map((_, index_2) => index === index_2 ? [..._, { text: '', url: '' }] : _) }));
                    }}
                    className="hover:cursor-pointer"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="space-y-2">
                  {buttons.map((button, index_2) => (
                    <div key={index_2} className="flex items-center space-x-2 border-solid border-[#474747] border-[1px] rounded-lg p-4">
                      <svg
                        onClick={() => {
                          setMessage((i) => ({ ...i, buttons: i.buttons.map((_, index_3) => index === index_3 ? _.filter((__, index_4) => index_2 !== index_4) : _) }));
                        }}
                        className="hover:cursor-pointer w-24"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <input
                        value={button.text}
                        onChange={(e) => {
                          setMessage((i) => ({ ...i, buttons: i.buttons.map((_, index_3) => index === index_3 ? _.map((__, index_4) => index_2 === index_4 ? { ...__, text: e.target.value } : __) : _) }));
                        }}
                        type="text"
                        placeholder="Enter text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                      />
                      <input
                        value={button.url}
                        onChange={(e) => {
                          setMessage((i) => ({ ...i, buttons: i.buttons.map((_, index_3) => index === index_3 ? _.map((__, index_4) => index_2 === index_4 ? { ...__, url: e.target.value } : __) : _) }));
                        }}
                        type="text"
                        placeholder="Enter url"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium">Is test ?</label>
        <label
          htmlFor={'todo-state'}
          className="flex cursor-pointer select-none items-center"
        >
          <div className="relative">
            <input
              type="checkbox"
              id={'todo-state'}
              className="sr-only"
              onChange={() => {
                setMessage((i) => ({ ...i, is_test: !i.is_test }));
              }}
            />
            <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
            <div
              className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${message.is_test && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                }`}
            >
              <span className={`hidden ${message.is_test && "!block"}`}>
                <svg
                  className="fill-white dark:fill-black"
                  width="11"
                  height="8"
                  viewBox="0 0 11 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                    fill=""
                    stroke=""
                    strokeWidth="0.4"
                  ></path>
                </svg>
              </span>
              <span className={`${message.is_test && "hidden"}`}>
                <svg
                  className="h-4 w-4 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </span>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}

const ECommerce: React.FC = () => {
  const [dataUser, setDataUser] = React.useState<DataUser>();
  const [messageApi, contextHolder] = message.useMessage();
  const [openModal, setOpenModal] = useState(false);
  const [comfirmModal, setComfirmModal] = useState(false);
  const [dataModal, setDataModal] = useState<{ title: string, description: JSX.Element | string, action: (data: any) => void }>();
  const [newMessage, setNewMessage] = useState<Message>({ is_test: true, message: '', photo: '', buttons: [] });

  const axiosApi = useAxios();
  useEffect(() => {
    axiosApi?.get("/api/users/get.users")
      .then(({ data }) => setDataUser(data))
      .catch(console.error);
  }, [axiosApi]);

  const showModal = (data: { title: string, description: JSX.Element | string, action: (data: any) => void } | false) => {
    if (data) {
      setDataModal(data);
      setOpenModal(true);
    } else {
      setDataModal(undefined);
      setOpenModal(false);
    };
  };

  return (
    dataUser && <>
      <Modal
        title={dataModal?.title}
        open={openModal}
        onOk={() => dataModal?.action(newMessage)}
        confirmLoading={comfirmModal}
        onCancel={() => setOpenModal(false)}
        okButtonProps={{ className: 'bg-primary' }}
      >
        {dataModal?.description}
      </Modal>
      {contextHolder}
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mt-4 mb-40">
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <button
            onClick={() => showModal({
              title: 'sendMessage',
              description: <MessageModal setNewMessage={setNewMessage} />,
              action: (data) => {
                if (!data.message) {
                  messageApi.open({
                    type: 'error',
                    content: 'Message is required',
                  });
                  return;
                };

                if (data.photo && !(new URL(data.photo))) {
                  messageApi.open({
                    type: 'error',
                    content: 'Photo is not a valid URL',
                  });
                  return;
                };

                if (data.buttons.length > 0) {
                  for (let i = 0; i < data.buttons.length; i++) {
                    for (let j = 0; j < data.buttons[i].length; j++) {
                      if (!data.buttons[i].text) {
                        messageApi.open({
                          type: 'error',
                          content: 'Button text is required',
                        });
                        return;
                      };

                      if (!data.buttons[i].url) {
                        messageApi.open({
                          type: 'error',
                          content: 'Button url is required',
                        });
                        return;
                      };
                    };
                  };
                };

                setComfirmModal(true);

                axiosApi?.post("/api/users/post.sendMessage", data)
                  .then(() => {
                    setComfirmModal(false);

                    showModal(false);

                    setNewMessage({ is_test: true, message: '', photo: '', buttons: [] });

                    messageApi.open({
                      type: 'success',
                      content: 'Message sent successfully',
                    });
                  })
                  .catch(error => {
                    setComfirmModal(false);

                    showModal(false);

                    if (error.response.status === 400) {
                      messageApi.open({
                        type: 'error',
                        content: error.response.data.message,
                      });
                    };
                  });
              },
            })}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            Send Message
          </button>
        </div>
      </div >
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
