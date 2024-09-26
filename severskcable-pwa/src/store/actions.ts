import {createAction} from "@reduxjs/toolkit";
import {BreaksTypeByMachine, MachineType, UserType} from "../types/initialState.type";
import {
    UpdateBreakStageType
} from "../types/types";
import {Break} from "../types/initialState.type";
import {AppRoutes, AuthorizationStatus} from "../constants";
import {
    registerImageActionType,
    repairCompletedImageActionType,
    repairingImageActionType,
    successImageActionType
} from "../types/image-response";

export const loadMachines = createAction<MachineType[]>('loadMachines');
export const loadUser = createAction<UserType>('loadUsers');
export const loadBreaks = createAction<Break[]>('loadBreaks');
export const loadBreaksTypeByMachine = createAction<BreaksTypeByMachine[]>('loadBreaksTypeByMachine');
export const requireAuthorization = createAction<AuthorizationStatus>('requireAuthorization');
export const setNewRepairType = createAction<BreaksTypeByMachine>('setNewRepairType');
export const setNewBreak = createAction<Break>('setNewBreak');
export const setMachineStatus = createAction<MachineType>('setMachineStatus');
export const setRepair = createAction<UpdateBreakStageType>('setRepair');
export const setRepairStage = createAction<Break>('setRepairStage');
export const deleteRepair = createAction<string>('deleteRepair');
export const isLoadingAction = createAction<boolean>('isLoadingAction');
export const redirectToRoute = createAction<AppRoutes>('redirectToRoute');
export const setSuccessImage = createAction<successImageActionType>('setSuccessImage');
export const setRegisterImage = createAction<registerImageActionType>('setRegisterImage');
export const setRepairingImage = createAction<repairingImageActionType>('setRepairingImage');
export const setRepairCompletedImage = createAction<repairCompletedImageActionType>('setRepairCompletedImage');