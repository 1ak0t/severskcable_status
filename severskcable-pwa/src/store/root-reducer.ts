import {combineReducers} from "@reduxjs/toolkit";
import {NameSpace} from "../constants";
import {userProcess} from "./user-process/user-process";
import {dataProcess} from "./data-process/data-process";

export const rootReducer = combineReducers({
    [NameSpace.User]: userProcess.reducer,
    [NameSpace.Data]: dataProcess.reducer
});