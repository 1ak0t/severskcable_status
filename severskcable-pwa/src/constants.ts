export enum AppRoutes {
    Login = '/login',
    Root = '/',
    BreakRegistration = '/new-break',
    RepairRegistration = '/repair',
    GoodSend = '/good-send'
}

export enum MachinesStatus {
    Work = "Работает",
    NotUse = "Простаивает",
    Wrong = "Поломка"
}

export enum AuthorizationStatus {
    Auth = 'AUTH',
    NoAuth = 'NO_AUTH',
    Unknown = 'UNKNOWN',
}

export enum RepairPriority {
    High = 1,
    Medium = 2,
    Low = 3
}

export const Priority = ['Высокий - Неработает', 'Средний - Работает нештатно','Низкий - Требует внимания'];