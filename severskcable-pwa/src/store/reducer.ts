import {Break, InitialStateType} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {
    deleteRepair,
    loadBreaks,
    loadBreaksTypeByMachine,
    loadMachines, loadUser, requireAuthorization, setError,
    setMachineStatus,
    setNewBreak,
    setNewRepairType,
    setRepair,
    setRepairStage
} from "./actions";
import {AuthorizationStatus, MachinesStatus, RepairStage, UserRoles} from "../constants";

const initialState: InitialStateType = {
    isLoading: false,
    authorizationStatus: AuthorizationStatus.Auth,
    error: null,
    user: {
        id: '',
        surname: '',
        name: '',
        middleName: '',
        email: '',
        role: [],
    },
    machines: [],
    breaks: [],
    breaksTypesByMachine: []
}

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(loadMachines, (state, action) => {
            state.machines = action.payload;
        })
        .addCase(loadBreaks, (state, action) => {
            state.breaks = action.payload;
        })
        .addCase(loadBreaksTypeByMachine, (state, action) => {
            state.breaksTypesByMachine = action.payload;
        })
        .addCase(loadUser, (state, action) => {
            state.user = action.payload;
        })
        .addCase(requireAuthorization, (state, action) => {
            state.authorizationStatus = action.payload;
        })
        .addCase(setError, (state, action) => {
            state.error = action.payload;
        })
        .addCase(setNewRepairType, (state, action) => {
            state.breaksTypesByMachine = state.breaksTypesByMachine.concat(action.payload);
        })
        .addCase(setNewBreak, (state, action) => {
            const currentMachine = state.machines.findIndex(machine => machine.id === action.payload.machine.id);
            state.breaks = state.breaks.concat(action.payload);
            const currentBreak = state.breaks.find(el => el.machine.id === action.payload.machine.id);
            switch (action.payload.priority) {
                case 1:
                    state.machines[currentMachine].status = MachinesStatus.Wrong;
                    if (currentBreak) {
                        currentBreak.machine.status = MachinesStatus.Wrong;
                    }
                    break;
                case 2:
                    state.machines[currentMachine].status = MachinesStatus.Warning;
                    if (currentBreak) {
                        currentBreak.machine.status = MachinesStatus.Warning;
                    }
                    break;
                case 3:
                    state.machines[currentMachine].status = MachinesStatus.Inspection;
                    if (currentBreak) {
                        currentBreak.machine.status = MachinesStatus.Inspection;
                    }
                    break;

            }
            state.breaks.find(el => el.machine.id === action.payload.machine.id)
        })
        .addCase(setMachineStatus, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.id === action.payload.id);
            state.machines[currentMachineIndex].status = action.payload.status;
        })
        .addCase(setRepair, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.id === action.payload.machine.id);
            const currentBreakIndex  = state.breaks.findIndex(breaks => breaks.id === action.payload.id);
            state.breaks[currentBreakIndex].comment = action.payload.comment;
            state.breaks[currentBreakIndex].repairCompletedDate = action.payload.repairCompletedDate;
            state.breaks[currentBreakIndex].repairCompletedPerson = action.payload.repairCompletedPerson;
            if (state.breaks[currentBreakIndex].status === true) {
                state.machines[currentMachineIndex].status = MachinesStatus.Work;
            }
        })
        .addCase(setRepairStage, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.id);
            const currentMachineIndex = state.machines.findIndex(el => el.id === action.payload.machine.id);
            state.breaks[currentBreakIndex].stages = action.payload.stages;

            switch (action.payload.stages) {
                case RepairStage.RepairSuccess: {
                    state.breaks[currentBreakIndex].successPerson = action.payload.successPerson;
                    state.breaks[currentBreakIndex].successDate = action.payload.successDate;
                    break;
                }
                case RepairStage.Repairing: {
                    state.breaks[currentBreakIndex].repairingPerson = action.payload.repairingPerson;
                    state.breaks[currentBreakIndex].repairingDate = action.payload.repairingDate;
                    break;
                }
                case RepairStage.RepairCompleted: {
                    state.breaks[currentBreakIndex].repairCompletedPerson = action.payload.repairCompletedPerson;
                    state.breaks[currentBreakIndex].repairCompletedDate = action.payload.repairCompletedDate;
                    break;
                }
            }

            if (action.payload.stages === null) {
                state.breaks[currentBreakIndex].status = true;
                if (!(state.breaks.filter(el => el.machine.id === state.machines[currentMachineIndex].id))) {
                    state.machines[currentMachineIndex].status = MachinesStatus.Work;
                }
            }
        })
        .addCase(deleteRepair, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload);
            const currentMachineIndex = state.machines.findIndex(machine => machine.id === state.breaks[currentBreakIndex].machine.id);

            state.breaks.splice(currentBreakIndex, 1);
            if (state.machines[currentMachineIndex].status !== MachinesStatus.Work) {
                state.machines[currentMachineIndex].status = MachinesStatus.Work;
            }
        })
})

export {reducer};