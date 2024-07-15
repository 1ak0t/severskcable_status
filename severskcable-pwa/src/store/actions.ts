import {createAction} from "@reduxjs/toolkit";
import {InitialStateType} from "../types/initialState.type";
import {CreateRepairType} from "../types/types";

export const getState = createAction<InitialStateType>('getState');
export const setNewRepair = createAction<CreateRepairType>('setNewRepair');