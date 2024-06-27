import {InitialStateType} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {getState} from "./actions";

const initialState: InitialStateType = {
    currentUser: '',
    machines: []
}

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(getState, (state, action) => {
            state.currentUser = action.payload.currentUser;
            state.machines =action.payload.machines;
        })
})

export {reducer};