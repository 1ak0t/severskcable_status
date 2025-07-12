import {State} from "../../types/state.type";
import {NameSpace} from "../../constants";
import {
    Break,
    BreaksTypeByMachine, CurrenciesType,
    MachineType,
    NotificationType,
    SupplyOrdersType, UserType
} from "../../types/initialState.type";

export const getDataLoadingStatus = (state: State): boolean => state[NameSpace.Data].isDataLoading;
export const getMachines = (state: State): MachineType[] => state[NameSpace.Data].machines;
export const getBreaks = (state: State): Break[] => state[NameSpace.Data].breaks;
export const getBreaksTypesByMachine = (state: State): BreaksTypeByMachine[] => state[NameSpace.Data].breaksTypesByMachine;
export const getErrorStatus = (state: State): boolean => state[NameSpace.Data].hasError;
export const getBreakCreatingStatus = (state: State): boolean => state[NameSpace.Data].isCreatingNewBreak;
export const getBreakCreatedStatus = (state: State): null | boolean => state[NameSpace.Data].isCreatedNewBreak;
export const getPhotoDownloadingStatus = (state: State): boolean => state[NameSpace.Data].isPhotoDownloading;
export const getChangingStageStatus = (state: State): boolean => state[NameSpace.Data].isChangingStage;
export const getChangedStageStatus = (state: State): null | boolean => state[NameSpace.Data].isChangedStage;
export const getNotifications = (state: State): NotificationType[] => state[NameSpace.Data].notifications;
export const getSupplyOrders = (state: State): SupplyOrdersType[] => state[NameSpace.Data].supplies;
export const getUsers = (state: State): UserType[] => state[NameSpace.Data].users;
export const getCurrencies = (state: State): CurrenciesType[] => state[NameSpace.Data].currencies;