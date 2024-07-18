import {createAction} from "@reduxjs/toolkit";
import {InitialStateType} from "../types/initialState.type";
import {CreateRepairType, NewBreakType, SetMachineStatusActionType} from "../types/types";

export const getState = createAction<InitialStateType>('getState');
export const setNewRepairType = createAction<CreateRepairType>('setNewRepairType');
export const setNewBreak = createAction<NewBreakType>('setNewBreak');
export const setMachineStatus = createAction<SetMachineStatusActionType>('setMachineStatus');