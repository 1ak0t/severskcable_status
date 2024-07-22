import {createAction} from "@reduxjs/toolkit";
import {InitialStateType} from "../types/initialState.type";
import {CreateRepairType, NewBreakType, SetMachineStatusActionType} from "../types/types";
import {Repair} from "../types/initialState.type";

export const getState = createAction<InitialStateType>('getState');
export const setNewRepairType = createAction<CreateRepairType>('setNewRepairType');
export const setNewBreak = createAction<NewBreakType>('setNewBreak');
export const setMachineStatus = createAction<SetMachineStatusActionType>('setMachineStatus');
export const setRepair = createAction<Repair>('setRepair');