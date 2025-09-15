import {Break, MachineType, SupplyStatus, UserType} from "./initialState.type";
import {MachinesStatus, RepairStage} from "../constants";

export interface OptionTypes {
    value: string;
    label: string;
}

export type CreateRepairType = {
    description: string,
    machine: string,
}

export type CreateNewSupplyType = {
    break: Break,
    supplyTitle: string,
    supplyDescription: string,
    supplyImage?: File,
    supplyStatus: SupplyStatus | null,
    registerDate: string,
}

export type UpdateSupplyType = {
    id: string,
    supplyStatus?: SupplyStatus,
    acceptedDate?: string,
    paymentDate?: string,
    deliveryDate?: string,
    inStockDate?: string,
    supplyImage?: File,
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
    registerImage?: File,
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
    registerDate?: string,
    successPerson?: string,
    successDate?: string,
    successComment?: string,
    successImage?: string,
    repairingPerson?: string,
    repairingDate?: string,
    repairingComment?: string,
    repairCompletedPerson?: string,
    repairCompletedDate?: string,
    repairCompletedComment?: string,
    repairEndPerson?: string,
    repairEndDate?: string,
    repairEndComment?: string,
    status?: boolean,
    stages?: RepairStage | null,
    machine?: string,
}

type ValuePiece = Date | null;

export type Value = ValuePiece | [ValuePiece, ValuePiece];