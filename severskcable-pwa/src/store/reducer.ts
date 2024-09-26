import {InitialStateType} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {
    deleteRepair,
    loadBreaks,
    loadBreaksTypeByMachine,
    loadMachines, loadUser, requireAuthorization,
    setMachineStatus,
    setNewBreak,
    setNewRepairType, setRegisterImage, setRepairCompletedImage, setRepairingImage,
    setRepairStage, setSuccessImage
} from "./actions";
import {AuthorizationStatus, MachinesStatus, RepairStage} from "../constants";

const initialState: InitialStateType = {
    isLoading: false,
    authorizationStatus: AuthorizationStatus.Auth,
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
        })
        .addCase(setMachineStatus, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.id === action.payload.id);
            state.machines[currentMachineIndex].status = action.payload.status;
        })
        .addCase(setRepairStage, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.id);
            const currentMachineIndex = state.machines.findIndex(el => el.id === action.payload.machine.id);
            state.breaks[currentBreakIndex].stages = action.payload.stages;

            switch (action.payload.stages) {
                case RepairStage.RepairSuccess: {
                    state.breaks[currentBreakIndex].successPerson = action.payload.successPerson;
                    state.breaks[currentBreakIndex].successDate = action.payload.successDate;
                    state.breaks[currentBreakIndex].successComment = action.payload.successComment;
                    break;
                }
                case RepairStage.Repairing: {
                    state.breaks[currentBreakIndex].repairingPerson = action.payload.repairingPerson;
                    state.breaks[currentBreakIndex].repairingDate = action.payload.repairingDate;
                    state.breaks[currentBreakIndex].repairingComment = action.payload.repairingComment;
                    break;
                }
                case RepairStage.RepairCompleted: {
                    state.breaks[currentBreakIndex].repairCompletedPerson = action.payload.repairCompletedPerson;
                    state.breaks[currentBreakIndex].repairCompletedDate = action.payload.repairCompletedDate;
                    state.breaks[currentBreakIndex].repairCompletedComment = action.payload.repairCompletedComment;
                    break;
                }
            }

            if (action.payload.stages === null) {
                state.breaks[currentBreakIndex].status = true;
                if (!(state.breaks.find(el => el.machine.id === state.machines[currentMachineIndex].id))) {
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
        .addCase(setSuccessImage, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
            state.breaks[currentBreakIndex].successImage = action.payload.successImage;
        })
        .addCase(setRegisterImage, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
            state.breaks[currentBreakIndex].registerImage = action.payload.registerImage;
        })
        .addCase(setRepairingImage, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
            state.breaks[currentBreakIndex].repairingImage = action.payload.repairingImage;
        })
        .addCase(setRepairCompletedImage, (state, action) => {
            const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
            state.breaks[currentBreakIndex].repairCompletedImage = action.payload.repairCompletedImage;
        })
})

export {reducer};