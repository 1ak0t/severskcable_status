import {MachinesStatus} from "../constants";

export type Repair = {
    id: string
    breakName: string,
    operator: string,
    breakDate: string,
    executor?: string,
    repairDate?: string,
    repairDuration?: string,
    comment?: string,
    priority: number,
     status: boolean
}

export type Machine = {
    id: string,
    name: string,
    status: `${MachinesStatus}`,
    repairs: Repair[],
    repairTypes: string[]
}

export type InitialStateType = {
    currentUser: string,
    machines: Machine[]
}