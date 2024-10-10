import {APIRoute, MachinesStatus, RepairPriority} from "../constants";
import dayjs from "dayjs";
import {ChangeEvent} from "react";
import {BACKEND_URL} from "../services/api";

export const getPriorityNumber = (name: string) => {
    if (name === 'Высокий - Неработает') {
        return RepairPriority.High;
    }

    if (name === 'Средний - Работает нештатно') {
        return RepairPriority.Medium;
    }

    return RepairPriority.Low;
}

export const getDurationString = (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => {
    const durationMinutes = endDate.diff(startDate, 'minute');
    const days = Math.floor(durationMinutes/60/24);
    if (days > 0) {
        return `${days.toFixed()} д. ${Math.floor(durationMinutes/60) - days*24} ч. ${durationMinutes % 24} мин.`;
    }
    return `${Math.floor(durationMinutes/60)} ч. ${durationMinutes % 24} мин.`;
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
//"blob:http://localhost:3000/5e080c48-e9c5-40c4-b7c0-e7eff65fc1bf"