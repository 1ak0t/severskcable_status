import {Repair} from "./initialState.type";

export interface OptionTypes {
    value: string;
    label: string;
};

export type CreateRepairType = {
    machine: string,
    repair: string
}

export type RepairElementType = {
    machine: string,
    repair: Repair,
}

export type NewBreakType = {
    id: string,
    machine: string,
    breakName: string,
    priority: number,
    operator: string,
    breakDate: string,
    status: boolean
}