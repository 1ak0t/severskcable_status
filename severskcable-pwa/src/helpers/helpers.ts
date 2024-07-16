import {RepairPriority} from "../constants";

export const getPriorityNumber = (name: string) => {
    if (name === 'Высокий - Неработает') {
        return RepairPriority.High;
    }

    if (name === 'Средний - Работает нештатно') {
        return RepairPriority.Medium;
    }

    return RepairPriority.Low;
}