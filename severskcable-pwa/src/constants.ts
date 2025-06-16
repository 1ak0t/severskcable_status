export const TIMEOUT_SHOW_ERROR = 2000;
export const publicVapidKey = 'BG2M57wQ4s6MhyXhryYdfpmaPGUSWhZgbWGf7kHkNTfMaVbIC7HIRaeq5h4wr9BmREx_toP0DvJAkPTfuVBgTP8';

export enum AppRoutes {
    Login = '/login',
    Root = '/',
    BreakRegistration = '/new-break',
    RepairRegistration = '/repair-registration',
    BreaksList = '/breaks-list',
    GoodSend = '/good-send',
    MachineBreaks = '/machine-breaks',
    NotFound = '*',
    Agreement = '/agreement',
    Notifications = '/notifications',
    Supply = '/supply',
    Analytics = '/analytics',
    Currencies = '/currencies',
}

export enum MachinesStatus {
    Work = "Работает",
    Warning = "Работает нештатно",
    Inspection = "Требует внимания",
    Wrong = "Линия стоит"
}

export enum MachinesStatusPriority {
    "Работает",
    "Работает нештатно",
    "Требует внимания",
    "Поломка"
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

export enum CommentType {
    RegisterComment ,
    SuccessComment,
    RepairingComment ,
    RepairCompletedComment ,
    RepairEndComment ,
}

export enum RepairStage {
    Register = "Зарегистрирована",
    RepairSuccess = "Поломка потверждена",
    Repairing = "Ремонт",
    RepairCompleted = "Ремонт выполнен",
    Supply = "Ожидает снабжения"
}

export enum UserRoles {
    Operator = "Оператор",
    ITR = "ИТР",
    Engineers = "Инженеры",
    HeadEngineer = "Главный инженер",
    CEO = "Генеральный директор",
    Admin = "Администратор",
    Supply = "Снабжение"
}

export const Priority = ['Высокий - Неработает', 'Средний - Работает нештатно','Низкий - Требует внимания'];

export enum APIRoute{
    Machines = '/machines',
    Breaks = '/breaks',
    BreaksTypeByMachine = '/break-types-by-machine',
    Login = '/users/login',
    Images = '/upload/',
    Logout = '/logout',
    Notifications = '/notifications',
    Users = '/users',
    SupplyOrders = '/supplies',
}

export enum NameSpace {
    Data = 'DATA',
    User = 'USER',
}