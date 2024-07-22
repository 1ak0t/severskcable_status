import {InitialStateType, Repair} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {getState, setMachineStatus, setNewBreak, setNewRepairType, setRepair} from "./actions";

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
                breakDate: action.payload.breakDate,
                status: action.payload.status
            }
            state.machines[currentMachineIndex].repairs.push(newBreak);
        })
        .addCase(setMachineStatus, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.name === action.payload.machine);
            state.machines[currentMachineIndex].status = action.payload.status;
        })
        .addCase(setRepair, (state, action) => {
            const currentMachineId = state.machines.findIndex(machine => machine.repairs.find(repair => repair.id === action.payload.id));
            const currentRepairId  = state.machines[currentMachineId].repairs.findIndex(repair => repair.id === action.payload.id);
            state.machines[currentMachineId].repairs[currentRepairId] = action.payload;
        })
})

export {reducer};