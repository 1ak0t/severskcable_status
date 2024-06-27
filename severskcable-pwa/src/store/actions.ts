import {createAction} from "@reduxjs/toolkit";
import {InitialStateType} from "../types/initialState.type";

export const getState = createAction<InitialStateType>('getState');