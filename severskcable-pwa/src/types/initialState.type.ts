 export type Repair = {
    id: string
    breakName: string,
    operator: string,
    breakDate: string,
    executor?: string,
    repairDate?: string,
    repairDuration?: string,
    comment?: string,
    priority: number
}

export type Machine = {
    name: string,
    status: string,
    currentRepairId: string | null,
    repairs: Repair[],
    repairTypes: string[]
}

export type InitialStateType = {
    currentUser: string,
    machines: Machine[]
}