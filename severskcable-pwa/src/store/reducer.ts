import {InitialStateType, Repair} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {getState, setNewBreak, setNewRepairType} from "./actions";

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
        .addCase(setNewRepairType, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.name === action.payload.machine);
            state.machines[currentMachineIndex].repairTypes.push(action.payload.repair);
        })
        .addCase(setNewBreak, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.name === action.payload.machine);
            const newBreak: Repair = {
                id: action.payload.id,
                breakName: action.payload.breakName,
                priority: action.payload.priority,
                operator: action.payload.operator,
                breakDate: action.payload.breakDate
            }
            state.machines[currentMachineIndex].repairs.push(newBreak);
        })
})

export {reducer};