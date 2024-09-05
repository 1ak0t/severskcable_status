import {createAction} from "@reduxjs/toolkit";
import {BreaksTypeByMachine, MachineType, UserType} from "../types/initialState.type";
import {
    CreateRepairType,
    NewBreakType,
    RepairCompletedType,
    SetMachineStatusActionType,
    SetRepairStageType
} from "../types/types";
import {Break} from "../types/initialState.type";
import {AppRoutes, AuthorizationStatus} from "../constants";

export const loadMachines = createAction<MachineType[]>('loadMachines');
export const loadUser = createAction<UserType>('loadUsers');
export const loadBreaks = createAction<Break[]>('loadBreaks');
export const loadBreaksTypeByMachine = createAction<BreaksTypeByMachine[]>('loadBreaksTypeByMachine');
export const requireAuthorization = createAction<AuthorizationStatus>('requireAuthorization');
export const setError = createAction<string | null>('setError');
export const setNewRepairType = createAction<BreaksTypeByMachine>('setNewRepairType');
export const setNewBreak = createAction<Break>('setNewBreak');
export const setMachineStatus = createAction<MachineType>('setMachineStatus');
export const setRepair = createAction<RepairCompletedType>('setRepair');
export const setRepairStage = createAction<Break>('setRepairStage');
export const deleteRepair = createAction<string>('deleteRepair');
export const isLoadingAction = createAction<boolean>('isLoadingAction');
export const redirectToRoute = createAction<AppRoutes>('redirectToRoute');