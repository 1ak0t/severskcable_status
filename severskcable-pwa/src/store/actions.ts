import {createAction} from "@reduxjs/toolkit";
import {InitialStateType} from "../types/initialState.type";
import {CreateRepairType, NewBreakType, SetMachineStatusActionType, SetRepairStageType} from "../types/types";
import {Repair} from "../types/initialState.type";

export const getState = createAction<InitialStateType>('getState');
export const setNewRepairType = createAction<CreateRepairType>('setNewRepairType');
export const setNewBreak = createAction<NewBreakType>('setNewBreak');
export const setMachineStatus = createAction<SetMachineStatusActionType>('setMachineStatus');
export const setRepair = createAction<Repair>('setRepair');
export const setRepairStage = createAction<SetRepairStageType>('setRepairStage');
export const deleteRepair = createAction<string>('deleteRepair');