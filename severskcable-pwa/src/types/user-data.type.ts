import {UserRoles} from "../constants";

export type UserLoggedDataType = {
    id: string;
    token: string;
    email: string;
    surname: string;
    name: string;
    middleName: string;
    role: UserRoles[];
    notificationsCount: number;
};