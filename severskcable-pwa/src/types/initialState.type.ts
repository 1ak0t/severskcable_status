import {AuthorizationStatus, MachinesStatus, RepairStage, UserRoles} from "../constants";

export type Break = {
    id: string
    breakName: string,
    registerPerson: UserType,
    registerDate: string,
    successPerson?: UserType,
    successDate?: string,
    repairingPerson?: UserType,
    repairingDate?: string,
    repairCompletedPerson?: UserType,
    repairCompletedDate?: string,
    repairEndPerson?: UserType,
    repairEndDate?: string,
    comment?: string,
    priority: number,
    status: boolean,
    stages: RepairStage | null,
    machine: MachineType
}

export type MachineType = {
    id: string,
    name: string,
    status: MachinesStatus,
}

export type BreaksTypeByMachine = {
    id: string,
    description: string,
    machine: MachineType
}

export type UserType = {
    id: string,
    surname: string,
    name: string,
    middleName: string,
    email: string,
    role: UserRoles[]
}

export type InitialStateType = {
    isLoading: boolean,
    authorizationStatus: AuthorizationStatus,
    error: string | null,
    user: UserType,
    machines: MachineType[],
    breaksTypesByMachine: BreaksTypeByMachine[],
    breaks: Break[]
}