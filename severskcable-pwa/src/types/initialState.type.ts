import {AuthorizationStatus, MachinesStatus, RepairStage, UserRoles} from "../constants";

export type Break = {
    id: string
    breakName: string,
    registerPerson: UserType,
    registerDate: string,
    registerComment?: string,
    registerImage?: string,
    successPerson?: UserType,
    successDate?: string,
    successComment?: string,
    successImage?: string,
    repairingPerson?: UserType,
    repairingDate?: string,
    repairingComment?: string,
    repairingImage?: string,
    repairCompletedPerson?: UserType,
    repairCompletedDate?: string,
    repairCompletedComment?: string,
    repairCompletedImage?: string,
    repairEndPerson?: UserType,
    repairEndDate?: string,
    repairEndComment?: string,
    priority: number,
    status: boolean,
    stages: RepairStage | null,
    machine: MachineType
}

export type NotificationType = {
    title: string,
    text: string,
    createdAt: string,
    roles?: UserRoles[]
}

export type CurrenciesType = {
    usd: number,
    cooper: number,
    createdAt: string,
}

export type SupplyOrdersType = {
    id: string;
    break: Break;
    supplyTitle: string;
    supplyDescription: string;
    supplyImage?: string;
    supplyStatus: SupplyStatus | null;
    acceptedDate?: string;
    paymentDate?: string;
    deliveryDate?: string;
    inStockDate?: string;
}

export enum SupplyStatus {
    Accepted = "Принят в работу",
    Payment = "Ожидает оплаты",
    Delivery = "Ожидает поступления",
    InStock = "На складе",
    New = "Новый"
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
    role: UserRoles[],
    notificationsCount: number
}

export type InitialStateType = {
    isDataLoading: boolean,
    authorizationStatus: AuthorizationStatus,
    user: UserType,
    machines: MachineType[],
    breaksTypesByMachine: BreaksTypeByMachine[],
    breaks: Break[]
}