import {RepairPriority} from "../constants";
import dayjs from "dayjs";

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
    console.log(durationMinutes)
    const days = Math.floor(durationMinutes/60/24);
    if (days > 0) {
        return `${days.toFixed()} д. ${Math.floor(durationMinutes/60) - days*24} ч. ${durationMinutes % 24} мин.`;
    }
    return `${Math.floor(durationMinutes/60)} ч. ${durationMinutes % 24} мин.`;
}