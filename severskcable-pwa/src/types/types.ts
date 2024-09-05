import {Break, MachineType, UserType} from "./initialState.type";
import {MachinesStatus, RepairStage} from "../constants";

export interface OptionTypes {
    value: string;
    label: string;
}

export type CreateRepairType = {
    description: string,
    machine: string,
}

export type RepairElementType = {
    machine: MachineType,
    machineStatus: MachinesStatus
    repair: Break,
}

export type NewBreakType = {
    breakName: string,
    registerPerson: string,
    registerDate: string,
    priority: number,
    status: boolean,
    stages: RepairStage | null,
    machine: string
}

export type SetMachineStatusActionType = {
    id: string,
    name: string,
    status: MachinesStatus
}

export type SetRepairStageType = {
    breakId: string,
    machineId: string,
    user: UserType,
    date: string,
    stage: null | RepairStage
}

export type RepairCompletedType = {
    id: string,
    repairCompletedPerson: UserType,
    repairCompletedDate: string,
    comment: string,
    stages: RepairStage | null,
    machine: MachineType
}

export type UpdateMachineStatusType = {
    id: string,
    status: MachinesStatus
}

export type UpdateBreakStageType = {
    id: string,
    successPerson?: string,
    successDate?: string,
    repairingPerson?: string,
    repairingDate?: string,
    repairCompletedPerson?: string,
    repairCompletedDate?: string,
    repairEndPerson?: string,
    repairEndDate?: string,
    comment?: string,
    status?: boolean,
    stages: RepairStage | null,
    machine: string
}