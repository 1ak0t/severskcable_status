import {APIRoute, MachinesStatus, RepairPriority} from "../constants";
import dayjs from "dayjs";
import {ChangeEvent} from "react";
import {BACKEND_URL} from "../services/api";
import {Value} from "../types/types";

export const getPriorityNumber = (name: string) => {
    if (name === 'Высокий - Неработает') {
        return RepairPriority.High;
    }

    if (name === 'Средний - Работает нештатно') {
        return RepairPriority.Medium;
    }

    if (name === 'Простой') {
        return RepairPriority.Stop;
    }

    return RepairPriority.Low;
}

export const getDurationString = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    const durationMinutes = endDate.diff(startDate, 'minute');
    const days = Math.floor(durationMinutes/60/24);
    if (days > 0) {
        return `${days.toFixed()} д. ${Math.floor(durationMinutes/60) - days*24} ч. ${durationMinutes - (days*24*60) - (Math.floor(durationMinutes/60)*60 - days*24*60)} мин.`;
    }
    return `${Math.floor(durationMinutes/60)} ч. ${durationMinutes - (Math.floor(durationMinutes/60)*60)} мин.`;
}

export const getMachineStatusByPriority = (priority: number) => {
    let machineStatus: MachinesStatus = MachinesStatus.Work;

    switch (priority) {
        case 1:
            machineStatus = MachinesStatus.Wrong;
            break;
        case 2:
            machineStatus = MachinesStatus.Warning;
            break;
        case 3:
            machineStatus = MachinesStatus.Inspection;
            break;

    }

    return machineStatus;
}

export const handleImageUpload = (evt: ChangeEvent<HTMLInputElement>, setImageType: any) => {
    if (!evt.target.files) {
        return;
    }

    const file = evt.target.files[0];
    setImageType(file);
};

export const fetchImageTest = async (imageName: string | undefined, setImg: any, imgURL: string | undefined, setImgVisible: any, imgVisible: boolean) => {
    if(!imgURL) {
        const imageUrl = BACKEND_URL + APIRoute.Images + imageName;
        const res = await fetch(imageUrl);
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImg(imageObjectURL);
    }
    setImgVisible(!imgVisible);
};

export const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const getPeriodDayjs = (period: Value)=> {
    if (Array.isArray(period)) {
        const periodArr: any[] = [];
        period.map(date => {
            periodArr.push(dayjs(date));
        });
        return periodArr;
    }

    return [];
}