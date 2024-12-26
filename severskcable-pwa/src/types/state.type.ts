import {store} from "../store";
import {AuthorizationStatus} from "../constants";
import {
    Break,
    BreaksTypeByMachine,
    MachineType,
    NotificationType,
    SupplyOrdersType,
    UserType
} from "./initialState.type";

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type UserProcess = {
    authorizationStatus: AuthorizationStatus;
    user: UserType;
}

export type DataProcess = {
    isDataLoading: boolean;
    machines: MachineType[];
    breaksTypesByMachine: BreaksTypeByMachine[];
    breaks: Break[];
    notifications: NotificationType[];
    supplies: SupplyOrdersType[];
    hasError: boolean;
    isCreatedNewBreak: null | boolean;
    isCreatingNewBreak: boolean;
    isPhotoDownloading: boolean;
    isChangingStage: boolean;
    isChangedStage: null | boolean;
}

