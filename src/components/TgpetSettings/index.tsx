"use client";
import { Metadata } from "next";
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useMemo, useState } from "react";
import axiosApi from "@/hooks/axiosApi";
import { message, Modal } from "antd";
import { MessageInstance } from "antd/es/message/interface";

export const metadata: Metadata = {
    title: "Next.js Form Layout | TgpetAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Form Layout page for TgpetAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

type QuestValue = {
    like_post: {
        type: 'SWITCH_URL',
        label: string,
        urls: string[],
        icon: string
    },
    retweet_post: {
        type: 'SWITCH_URL',
        label: string,
        urls: string[],
        icon: string
    },
    _location: number,
    _description: string,
    _type: 'onetime' | 'daily',
    _icon: 'X' | 'TELEGRAM',
    _title: string,
    _rewards: {
        [key: string]: {
            amount: number,
            type: string
        }
    },
    _state: boolean,
};

type Quests = {
    [key: string]: QuestValue
};

const configRewardTypes: { [key: string]: 'food' | 'token' } = {
    "chicken": "food",
    "banana": "food",
    "pie": "food",
    "tgp": "token",
    "tgpet": "token"
};

const questActions = ['like_post', 'retweet_post', 'reply_post', 'custom_id_1', 'custom_id_2', 'custom_id_3', 'custom_id_4'];

const QuestPage = ({ quest_id, value, showModal, setComfirmModal, messageApi, setQuests }: { quest_id: string, value: QuestValue, showModal: (data: { title: string, description: JSX.Element | string, action: () => void } | false) => void, setComfirmModal: Dispatch<SetStateAction<boolean>>, messageApi: MessageInstance, setQuests: Dispatch<SetStateAction<Quests>> }) => {
    const [quest, setQuest] = useState({ quest_id, value });

    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);

    const can_update = quest && JSON.stringify(quest.value) !== JSON.stringify(value);

    return (
        <div className="flex flex-col gap-9">
            <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b w-full flex justify-between items-center border-stroke px-6.5 py-4 dark:border-strokedark">
                    <svg
                        onClick={() => showModal({
                            title: 'Delete Quest',
                            description: 'Are you sure you want to delete ?',
                            action: () => {
                                setComfirmModal(true);

                                axiosApi.post('/api/settings/post.delete_quest', { quest_id, value: quest.value })
                                    .then(() => {
                                        messageApi.open({
                                            type: 'success',
                                            content: 'Deleted successfully',
                                        });

                                        setQuests(i => {
                                            const updatedQuests = { ...i };

                                            delete updatedQuests[quest_id];

                                            return updatedQuests;
                                        });

                                        showModal(false);
                                    })
                                    .catch(console.error)
                                    .finally(() => {
                                        setComfirmModal(false);
                                    });
                            },
                        })}
                        className="hover:cursor-pointer"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                        <label
                            htmlFor={quest.quest_id}
                            className="flex cursor-pointer select-none items-center"
                        >
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id={quest.quest_id}
                                    className="sr-only"
                                    onChange={() => {
                                        setQuest(i => ({ ...i, value: { ...i.value, _state: !i.value._state } }));
                                        setIsOptionSelected(true);
                                    }}
                                />
                                <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                                <div
                                    className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${quest.value._state && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                                        }`}
                                >
                                    <span className={`hidden ${quest.value._state && "!block"}`}>
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
                                    <span className={`${quest.value._state && "hidden"}`}>
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
                <div className="p-6.5 space-y-4">
                    <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Quest ID <span className="text-meta-1">*</span>
                        </label>
                        <input
                            defaultValue={quest.quest_id}
                            type="text"
                            placeholder="Enter quest ID"
                            className="disabled:opacity-[0.7] w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                            disabled
                        />
                    </div>
                    <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Title <span className="text-meta-1">*</span>
                        </label>
                        <input
                            value={quest.value._title}
                            onChange={(e) => {
                                setQuest(i => ({ ...i, value: { ...i.value, _title: e.target.value } }));
                                setIsOptionSelected(true);
                            }}
                            type="text"
                            placeholder="Enter title"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                    <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Description <span className="text-meta-1">*</span>
                        </label>
                        <textarea
                            value={quest.value._description}
                            onChange={(e) => {
                                setQuest(i => ({ ...i, value: { ...i.value, _description: e.target.value } }));
                                setIsOptionSelected(true);
                            }}
                            rows={6}
                            placeholder="Enter description"
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        ></textarea>
                    </div>

                    <div className="w-full">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Icon <span className="text-meta-1">*</span>
                        </label>

                        <div className="relative z-20 bg-transparent dark:bg-form-input">
                            <select
                                defaultValue={quest.value._icon}
                                onChange={(e) => {
                                    setQuest(i => ({ ...i, value: { ...i.value, _icon: e.target.value as "X" | "TELEGRAM" } }));
                                    setIsOptionSelected(true);
                                }}
                                className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                            >
                                <option value="" disabled className="text-body dark:text-bodydark">
                                    Select icon
                                </option>
                                <option value="X" className="text-body dark:text-bodydark">
                                    X
                                </option>
                                <option value="TELEGRAM" className="text-body dark:text-bodydark">
                                    Telegram
                                </option>
                            </select>
                            <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                                <svg
                                    className="fill-current"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g opacity="0.8">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                            fill=""
                                        ></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white pr-1">
                                Rewards <span className="text-meta-1">*</span>
                            </label>
                            <svg
                                className={Object.keys(configRewardTypes).find(reward => !quest.value._rewards[reward]) ? 'hover:cursor-pointer' : 'hidden'}
                                onClick={() => {
                                    const reward_name = Object.keys(configRewardTypes).find(reward => !quest.value._rewards[reward]);

                                    if (!reward_name) return;

                                    setQuest(i => ({ ...i, value: { ...i.value, _rewards: { ...i.value._rewards, [reward_name]: { amount: 1, type: 'food' } } } }));
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
                        {Object.entries(quest.value._rewards).map(([reward_name, reward_data], index_2) => (
                            <div key={index_2} className="grid grid-cols-4 gap-4 items-center">
                                <svg
                                    onClick={() => {
                                        const updatedRewards = { ...quest.value._rewards };

                                        delete updatedRewards[reward_name];

                                        setQuest(i => ({ ...i, value: { ...i.value, _rewards: updatedRewards } }));
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
                                <select
                                    value={configRewardTypes[reward_name] + ':' + reward_name}
                                    onChange={(e) => {
                                        setQuest(i => {
                                            const current_rewards = i.value._rewards;

                                            delete current_rewards[reward_name];

                                            const [_, target_reward_name] = e.target.value.split(':');

                                            return ({ ...i, value: { ...i.value, _rewards: { ...i.value._rewards, [target_reward_name]: { amount: 1, type: configRewardTypes[target_reward_name] } } } })
                                        });
                                        setIsOptionSelected(true);
                                    }}
                                    className={`relative z-20 w-full col-span-2 appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                                >
                                    {['chicken', 'banana', 'pie', 'tgp', 'tgpet'].map((reward, index_3) => (
                                        (reward_name === reward || !quest.value._rewards[reward]) && <option key={index_3} value={configRewardTypes[reward] + ':' + reward} className="text-body dark:text-bodydark">
                                            {configRewardTypes[reward] + ':' + reward}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    value={reward_data.amount}
                                    onChange={e => {
                                        const parsedAmount = parseInt(e.target.value);

                                        if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount === Infinity) return;

                                        setQuest(i => ({ ...i, value: { ...i.value, _rewards: { ...i.value._rewards, [reward_name]: { amount: parsedAmount, type: reward_data.type } } } }));
                                    }}
                                    type="text"
                                    placeholder="Enter title"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="w-full">
                        <div className="flex">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white pr-1">
                                Quests <span className="text-meta-1">*</span>
                            </label>
                            {/*  <svg
                                className={questActions.find(reward => !(quest.value as any)[reward]) ? 'hover:cursor-pointer' : 'hidden'}
                                onClick={() => {
                                    const reward_name = questActions.find(reward => !(quest.value as any)[reward]);

                                    if (!reward_name) return;

                                    setQuest((i: any) => ({
                                        ...i, value: {
                                            ...i.value, [reward_name]: {
                                                type: 'SWITCH_URL',
                                                label: '',
                                                urls: [],
                                                icon: 'X',
                                            }
                                        }
                                    }));
                                }}
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg> */}
                        </div>
                        {Object.entries(quest.value).map(([action_name, action_data]: [string, any], index_2) => (
                            !action_name.startsWith('_') && (
                                <div key={index_2} className="w-full h-full py-2">
                                    <div className="grid grid-cols-3 gap-3 items-center bg-gray-3 border-solid border-[#474747] border-[1px] dark:bg-[#1d2a39] p-4 rounded-lg">
                                        <svg
                                            onClick={() => {
                                                const updatedQuest = { ...quest.value };

                                                // @ts-ignore
                                                delete updatedQuest[action_name];

                                                setQuest(i => ({ ...i, value: updatedQuest }));
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
                                        <select
                                            value={action_data.type}
                                            onChange={(e) => {
                                                setQuest(i => ({
                                                    ...i, value: { ...i.value, [action_name]: { ...(i.value as any)?.[action_name], type: e.target.value } }
                                                }));
                                                setIsOptionSelected(true);
                                            }}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                                        >
                                            {['SWITCH_URL'].map((action, index_3) => (
                                                <option key={index_3} value={action} className="text-body dark:text-bodydark">
                                                    {action}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            defaultValue={action_data._icon}
                                            onChange={(e) => {
                                                setQuest(i => ({ ...i, value: { ...i.value, [action_name]: { ...(i.value as any)?.[action_name], icon: e.target.value as "X" | "TELEGRAM" } } }));
                                                setIsOptionSelected(true);
                                            }}
                                            className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${isOptionSelected ? "text-black dark:text-white" : ""}`}
                                        >
                                            <option value="" disabled className="text-body dark:text-bodydark">
                                                Select icon
                                            </option>
                                            <option value="X" className="text-body dark:text-bodydark">
                                                X
                                            </option>
                                            <option value="TELEGRAM" className="text-body dark:text-bodydark">
                                                Telegram
                                            </option>
                                        </select>
                                        <input
                                            value={action_name}
                                            type="text"
                                            placeholder="Enter action ID"
                                            className="disabled:opacity-[0.7] w-full col-span-3 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black"
                                            disabled
                                        />
                                        <input
                                            value={action_data.label}
                                            onChange={e => {
                                                setQuest(i => ({
                                                    ...i, value: { ...i.value, [action_name]: { ...(i.value as any)?.[action_name], label: e.target.value } }
                                                }));
                                                setIsOptionSelected(true);
                                            }}
                                            type="text"
                                            placeholder="Enter label"
                                            className="w-full rounded border-[1.5px] col-span-3 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        <div className="w-full col-span-3 space-y-2">
                                            <label className="mb-3 flex space-x-1 text-sm font-medium text-black dark:text-white">
                                                URLs <span className="text-meta-1">*</span>
                                                <svg
                                                    onClick={() => {
                                                        setQuest(i => ({
                                                            ...i, value: {
                                                                ...i.value, [action_name]: {
                                                                    ...(i.value as any)?.[action_name], urls: [...(i.value as any)?.[action_name].urls, '']
                                                                }
                                                            }
                                                        }));
                                                        setIsOptionSelected(true);
                                                    }}
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </label>
                                            {(action_data.urls as string[]).map((url, index_3) => (
                                                <div key={index_3} className="flex items-center space-x-2">
                                                    <svg
                                                        onClick={() => {
                                                            setQuest(i => ({
                                                                ...i, value: {
                                                                    ...i.value, [action_name]: {
                                                                        ...(i.value as any)?.[action_name], urls: (i.value as any)?.[action_name].urls.filter((_: string, index_4: number) => index_3 !== index_4)
                                                                    }
                                                                }
                                                            }));
                                                            setIsOptionSelected(true);
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
                                                    <input
                                                        value={url}
                                                        onChange={(e) => {
                                                            setQuest(i => ({
                                                                ...i, value: {
                                                                    ...i.value, [action_name]: {
                                                                        ...(i.value as any)?.[action_name], urls: (i.value as any)?.[action_name].urls.map((url: string, index_4: number) => index_3 === index_4 ? e.target.value : url)
                                                                    }
                                                                }
                                                            }));
                                                            setIsOptionSelected(true);
                                                        }}
                                                        type="text"
                                                        placeholder="Enter title"
                                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                    <button
                        disabled={!can_update}
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-30"
                        onClick={() => showModal({
                            title: 'Update Quest',
                            description: 'Are you sure you want to update ?',
                            action: () => {
                                setComfirmModal(true);

                                axiosApi.post('/api/settings/post.update_quest', { quest_id, quest_data: quest.value })
                                    .then(() => {
                                        messageApi.open({
                                            type: 'success',
                                            content: 'Updated successfully',
                                        });

                                        setQuests(i => ({ ...i, [quest_id]: quest.value }));

                                        showModal(false);
                                    })
                                    .catch(console.error)
                                    .finally(() => {
                                        setComfirmModal(false);
                                    });
                            },
                        })}
                    >
                        Updated
                    </button>
                </div>
            </div>
        </div>
    )
};

const Description = ({ setNewQuest }: { setNewQuest: Dispatch<{ quest_id: string, quest_data: QuestValue }>, }) => {
    const [questId, setQuestId] = useState('');
    const [quest, setQuest] = useState<QuestValue>({
        '_title': '', '_description': '', '_icon': 'X', '_rewards': {},
        '_type': 'onetime', '_state': false, '_location': 1,
    } as QuestValue);

    useEffect(() => {
        setNewQuest({ quest_id: questId, quest_data: quest });
    }, [questId, quest]);

    return (
        <div className="space-y-2">
            <div className="w-full">
                <label className="mb-3 block text-sm font-medium">
                    Quest ID <span className="text-meta-1">*</span>
                </label>
                <input
                    value={questId}
                    onChange={(e) => {
                        setQuestId(e.target.value);
                    }}
                    type="text"
                    placeholder="Enter quest ID"
                    className="disabled:opacity-[0.7] w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                />
            </div>
            <div className="w-full">
                <label className="mb-3 block text-sm font-medium">
                    Title <span className="text-meta-1">*</span>
                </label>
                <input
                    value={quest._title}
                    onChange={(e) => {
                        setQuest((i: any) => ({ ...i, _title: e.target.value }));
                    }}
                    type="text"
                    placeholder="Enter title"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                />
            </div>
            <div className="w-full">
                <label className="mb-3 block text-sm font-medium">
                    Description <span className="text-meta-1">*</span>
                </label>
                <textarea
                    value={quest._description}
                    onChange={(e) => {
                        setQuest((i: any) => ({ ...i, _description: e.target.value }));
                    }}
                    rows={6}
                    placeholder="Enter description"
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                ></textarea>
            </div>

            <div className="w-full">
                <label className="mb-3 block text-sm font-medium">
                    Icon <span className="text-meta-1">*</span>
                </label>

                <div className="relative z-20 bg-transparent">
                    <select
                        defaultValue={'X'}
                        onChange={(e) => {
                            setQuest((i: any) => ({ ...i, _icon: e.target.value as "X" | "TELEGRAM" }));
                        }}
                        className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary`}
                    >
                        <option value="" disabled className="text-body dark:text-bodydark">
                            Select icon
                        </option>
                        <option value="X" className="text-body dark:text-bodydark">
                            X
                        </option>
                        <option value="TELEGRAM" className="text-body dark:text-bodydark">
                            Telegram
                        </option>
                    </select>
                    <span className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
                        <svg
                            className="fill-current"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g opacity="0.8">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                    fill=""
                                ></path>
                            </g>
                        </svg>
                    </span>
                </div>
            </div>
            <div className="w-full">
                <div className="flex">
                    <label className="mb-3 block text-sm font-medium pr-1">
                        Rewards <span className="text-meta-1">*</span>
                    </label>
                    <svg
                        className={questActions.find(reward => !quest._rewards[reward]) ? 'hover:cursor-pointer' : 'hidden'}
                        onClick={() => {
                            const reward_name = Object.keys(configRewardTypes).find(reward => !quest._rewards[reward]);

                            if (!reward_name) return;

                            setQuest((i: any) => ({ ...i, _rewards: { ...i._rewards, [reward_name]: { amount: 1, type: 'food' } } }));
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
                {Object.entries(quest._rewards).map(([reward_name, reward_data], index_2) => (
                    <div key={index_2} className="grid grid-cols-4 gap-4 items-center">
                        <svg
                            onClick={() => {
                                const updatedRewards = { ...quest._rewards };

                                delete updatedRewards[reward_name];

                                setQuest(i => ({ ...i, _rewards: updatedRewards }));
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
                        <select
                            value={configRewardTypes[reward_name] + ':' + reward_name}
                            onChange={(e) => {
                                setQuest(i => {
                                    const current_rewards = i._rewards;

                                    delete current_rewards[reward_name];

                                    const [_, target_reward_name] = e.target.value.split(':');

                                    return ({ ...i, _rewards: { ...i._rewards, [target_reward_name]: { amount: 1, type: configRewardTypes[target_reward_name] } } })
                                });
                            }}
                            className={`relative z-20 w-full col-span-2 appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary`}
                        >
                            {['chicken', 'banana', 'pie', 'tgp', 'tgpet'].map((reward, index_3) => (
                                (reward_name === reward || !quest._rewards[reward]) && <option key={index_3} value={configRewardTypes[reward] + ':' + reward} className="text-body dark:text-bodydark">
                                    {configRewardTypes[reward] + ':' + reward}
                                </option>
                            ))}
                        </select>
                        <input
                            value={reward_data.amount}
                            onChange={e => {
                                const parsedAmount = parseInt(e.target.value);

                                if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount === Infinity) return;

                                setQuest(i => ({ ...i, _rewards: { ...i._rewards, [reward_name]: { amount: parsedAmount, type: reward_data.type } } }));
                            }}
                            type="text"
                            placeholder="Enter title"
                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                        />
                    </div>
                ))}
            </div>
            <div className="w-full">
                <div className="flex">
                    <label className="mb-3 block text-sm font-medium pr-1">
                        Quests <span className="text-meta-1">*</span>
                    </label>
                    <svg
                        className={questActions.find(reward => !(quest as any)[reward]) ? 'hover:cursor-pointer' : 'hidden'}
                        onClick={() => {
                            const reward_name = questActions.find(reward => !(quest as any)[reward]);

                            if (!reward_name) return;

                            setQuest((i: any) => ({
                                ...i, [reward_name]: {
                                    type: 'SWITCH_URL',
                                    label: '',
                                    urls: [],
                                    icon: 'X',
                                }
                            }));
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
                {Object.entries(quest).map(([action_name, action_data]: [string, any], index_2) => (
                    !action_name.startsWith('_') && (
                        <div key={index_2} className="w-full h-full py-2">
                            <div className="grid grid-cols-3 gap-3 items-center bg-gray-3 border-solid border-[#474747] border-[1px] p-4 rounded-lg">
                                <svg
                                    onClick={() => {
                                        const updatedQuest = { ...quest };

                                        // @ts-ignore
                                        delete updatedQuest[action_name];

                                        setQuest(updatedQuest);
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
                                <select
                                    value={action_data.type}
                                    onChange={(e) => {
                                        setQuest(i => ({
                                            ...i, [action_name]: { ...(i as any)?.[action_name], type: e.target.value }
                                        }));
                                    }}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary`}
                                >
                                    {['SWITCH_URL'].map((action, index_3) => (
                                        <option key={index_3} value={action} className="text-body dark:text-bodydark">
                                            {action}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    defaultValue={action_data._icon}
                                    onChange={(e) => {
                                        setQuest(i => ({ ...i, [action_name]: { ...(i as any)?.[action_name], icon: e.target.value as "X" | "TELEGRAM" } }));
                                    }}
                                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary`}
                                >
                                    <option value="" disabled className="text-body dark:text-bodydark">
                                        Select icon
                                    </option>
                                    <option value="X" className="text-body dark:text-bodydark">
                                        X
                                    </option>
                                    <option value="TELEGRAM" className="text-body dark:text-bodydark">
                                        Telegram
                                    </option>
                                </select>
                                <input
                                    value={action_name}
                                    onChange={(e) => {
                                        const updatedQuest = { ...quest };

                                        // @ts-ignore
                                        updatedQuest[e.target.value] = updatedQuest[action_name];

                                        // @ts-ignore
                                        delete updatedQuest[action_name];

                                        setQuest(updatedQuest);
                                    }}
                                    type="text"
                                    placeholder="Enter action ID"
                                    className="w-full col-span-3 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary dark:focus:border-primary dark:disabled:bg-black"
                                />
                                <input
                                    value={action_data.label}
                                    onChange={e => {
                                        setQuest(i => ({
                                            ...i, [action_name]: { ...(i as any)?.[action_name], label: e.target.value }
                                        }));
                                    }}
                                    type="text"
                                    placeholder="Enter label"
                                    className="w-full rounded border-[1.5px] col-span-3 border-stroke bg-transparent px-5 py-3 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:focus:border-primary"
                                />
                                <div className="w-full col-span-3 space-y-2">
                                    <label className="mb-3 flex space-x-1 text-sm font-medium">
                                        URLs <span className="text-meta-1">*</span>
                                        <svg
                                            onClick={() => {
                                                setQuest(i => ({
                                                    ...i, [action_name]: {
                                                        ...(i as any)?.[action_name], urls: [...(i as any)?.[action_name].urls, '']
                                                    }
                                                }));
                                            }}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12 8V16M8 12H16M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </label>
                                    {(action_data.urls as string[]).map((url, index_3) => (
                                        <div key={index_3} className="flex items-center space-x-2">
                                            <svg
                                                onClick={() => {
                                                    setQuest(i => ({
                                                        ...i, [action_name]: {
                                                            ...(i as any)?.[action_name], urls: (i as any)?.[action_name].urls.filter((_: string, index_4: number) => index_3 !== index_4)
                                                        }
                                                    }));
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
                                            <input
                                                value={url}
                                                onChange={(e) => {
                                                    setQuest(i => ({
                                                        ...i, [action_name]: {
                                                            ...(i as any)?.[action_name], urls: (i as any)?.[action_name].urls.map((url: string, index_4: number) => index_3 === index_4 ? e.target.value : url)
                                                        }
                                                    }));
                                                }}
                                                type="text"
                                                placeholder="Enter title"
                                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default dark:focus:border-primary"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>)
}

const Index = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [quests, setQuests] = useState<Quests>({});
    const [openModal, setOpenModal] = useState(false);
    const [comfirmModal, setComfirmModal] = useState(false);
    const [dataModal, setDataModal] = useState<{ title: string, description: JSX.Element | string, action: (data: any) => void }>();
    const [newQuest, setNewQuest] = useState<{ quest_id: string, quest_data: QuestValue }>();

    useLayoutEffect(() => {
        axiosApi.get('/api/settings/get.quests')
            .then(({ data }) => setQuests(data as Quests))
            .catch(console.error);
    }, []);

    const verifyQuestData = useMemo(() => (quest_data: QuestValue) => {
        if (typeof quest_data !== 'object' || !quest_data) {
            messageApi.open({
                type: 'error',
                content: 'Quest data is invalid',
            });

            return false;
        };

        if (typeof quest_data._title !== 'string' || !quest_data._title) {
            messageApi.open({
                type: 'error',
                content: 'Quest title is invalid',
            });

            return false;
        };

        if (typeof quest_data._description !== 'string' || !quest_data._description) {
            messageApi.open({
                type: 'error',
                content: 'Quest description is invalid',
            });

            return false;
        };

        if (typeof quest_data._icon !== 'string' || !quest_data._icon) {
            messageApi.open({
                type: 'error',
                content: 'Quest icon is invalid',
            });

            return false;
        };

        if (typeof quest_data._rewards !== 'object' || !quest_data._rewards) {
            messageApi.open({
                type: 'error',
                content: 'Quest rewards is invalid',
            });

            return false;
        };

        if (typeof quest_data._type !== 'string' || !quest_data._type) {
            messageApi.open({
                type: 'error',
                content: 'Quest type is invalid',
            });

            return false;
        };

        if (typeof quest_data._state !== 'boolean') {
            messageApi.open({
                type: 'error',
                content: 'Quest state is invalid',
            });

            return false;
        };

        if (typeof quest_data._location !== 'number') {
            messageApi.open({
                type: 'error',
                content: 'Quest location is invalid',
            });

            return false;
        };

        if (Object.keys(quest_data._rewards).length === 0) {
            messageApi.open({
                type: 'error',
                content: 'Quest rewards is empty',
            });

            return false;
        };

        if (Object.keys(quest_data).filter(key => !key.startsWith('_')).length === 0) {
            messageApi.open({
                type: 'error',
                content: 'Quest actions is empty',
            });

            return false;
        };

        return true;
    }, [messageApi]);

    const showModal = (data: { title: string, description: JSX.Element | string, action: (data: any) => void } | false) => {
        if (data) {
            setDataModal(data);
            setOpenModal(true);
        } else {
            setDataModal(undefined);
            setOpenModal(false);
        };
    };

    const newQuestAction = (data: { quest_id: string, quest_data: QuestValue }) => {
        if (verifyQuestData(data.quest_data)) {
            setComfirmModal(true);

            axiosApi.post('/api/settings/post.add_quest', data)
                .then(() => {
                    messageApi.open({
                        type: 'success',
                        content: 'Created successfully',
                    });

                    setQuests(i => ({ ...i, [data.quest_id]: data.quest_data }));

                    showModal(false);
                })
                .catch(error => {
                    if (error.response?.status === 400) {
                        messageApi.open({
                            type: 'error',
                            content: error.response.data.message,
                        });
                    };
                })
                .finally(() => {
                    setComfirmModal(false);
                });
        };
    };

    return (
        Object.keys(quests).length !== 0 && <>
            <Modal
                title={dataModal?.title}
                open={openModal}
                onOk={() => dataModal?.action(newQuest)}
                confirmLoading={comfirmModal}
                onCancel={() => setOpenModal(false)}
                okButtonProps={{ className: 'bg-primary' }}
            >
                {dataModal?.description}
            </Modal>
            {contextHolder}
            <div className="flex items-center space-x-2 pb-2">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <nav>
                        <ol className="flex items-center gap-2">
                            <li>
                                Settings /
                            </li>
                            <li className="font-medium text-primary">Quests</li>
                        </ol>
                    </nav>
                </div>

                <svg
                    onClick={() => {
                        showModal({
                            title: 'Add Quest',
                            description: <Description setNewQuest={setNewQuest} />,
                            action: newQuestAction,
                        });
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
            <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                {Object.entries(quests).map(([quest_id, value], index) => <QuestPage key={index} quest_id={quest_id} value={value} showModal={showModal} setComfirmModal={setComfirmModal} messageApi={messageApi} setQuests={setQuests} />)}
            </div>
        </>
    );
};

export default Index;
