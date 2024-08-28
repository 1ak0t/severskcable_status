import {MachinesStatus, RepairStage, UserRoles} from "../constants";

export type Repair = {
    id: string
    breakName: string,
    registerPerson: string,
    registerDate: string,
    successPerson?: string,
    successDate?: string,
    repairingPerson?: string,
    repairingDate?: string,
    repairCompletedPerson?: string,
    repairCompletedDate?: string,
    repairEndPerson?: string,
    repairEndDate?: string,
    comment?: string,
    priority: number,
    status: boolean,
    stages: null | `${RepairStage}`,
}

export type Machine = {
    id: string,
    name: string,
    status: `${MachinesStatus}`,
    repairs: Repair[],
    repairTypes: string[]
}

export type InitialStateType = {
    user: {
    name: string,
    role: `${UserRoles}`
    }
    machines: Machine[]
}