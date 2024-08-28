import {Repair} from "./initialState.type";
import {MachinesStatus, RepairStage} from "../constants";

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
    machineStatus: `${MachinesStatus}`
    repair: Repair,
}

export type NewBreakType = {
    id: string,
    machine: string,
    breakName: string,
    priority: number,
    operator: string,
    breakDate: string,
    status: boolean,
    stages: null | `${RepairStage}`,
}

export type SetMachineStatusActionType = {
    machine: string,
    status: `${MachinesStatus}`
}

export type SetRepairStageType = {
    repair: string,
    user: string,
    date: string,
    stage: null | `${RepairStage}`
}