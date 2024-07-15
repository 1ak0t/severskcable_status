import {InitialStateType} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {getState, setNewRepair} from "./actions";
import machine from "../components/machine/machine";

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
        .addCase(setNewRepair, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.name === action.payload.machine);
            state.machines[currentMachineIndex].repairTypes.push(action.payload.repair);
        })
})

export {reducer};