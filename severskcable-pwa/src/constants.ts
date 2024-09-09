export const TIMEOUT_SHOW_ERROR = 2000;

export enum AppRoutes {
    Login = '/login',
    Root = '/',
    BreakRegistration = '/new-break',
    RepairRegistration = '/repair-registration',
    BreaksList = '/breaks-list',
    GoodSend = '/good-send',
    MachineBreaks = '/machine-breaks',
    NotFound = '*',
    Agreement = '/agreement'
}

export enum MachinesStatus {
    Work = "Работает",
    Warning = "Работает нештатно",
    Inspection = "Требует внимания",
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

export enum RepairStage {
    Register = "Зарегистрирована",
    RepairSuccess = "Поломка потверждена",
    Repairing = "Ремонт",
    RepairCompleted = "Ремонт выполнен"
}

export enum UserRoles {
    Operator = "Оператор",
    ITR = "ИТР",
    Engineers = "Инженеры",
    HeadEngineer = "Главный инженер",
    CEO = "Генеральный директор",
    Admin = "Администратор"
}

export const Priority = ['Высокий - Неработает', 'Средний - Работает нештатно','Низкий - Требует внимания'];

export enum APIRoute{
    Machines = '/machines',
    Breaks = '/breaks',
    BreaksTypeByMachine = '/break-types-by-machine',
    Login = '/users/login'
}