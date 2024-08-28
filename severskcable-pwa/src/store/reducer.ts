import {InitialStateType, Repair} from "../types/initialState.type";
import {createReducer} from "@reduxjs/toolkit";
import {
    deleteRepair,
    getState,
    setMachineStatus,
    setNewBreak,
    setNewRepairType,
    setRepair,
    setRepairStage
} from "./actions";
import {MachinesStatus, RepairStage, UserRoles} from "../constants";

const initialState: InitialStateType = {
    user: {
        name: '',
        role: UserRoles.Operator
    },
    machines: []
}

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(getState, (state, action) => {
            state.user = action.payload.user;
            state.machines = action.payload.machines;
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
                registerPerson: action.payload.operator,
                registerDate: action.payload.breakDate,
                status: action.payload.status,
                stages: action.payload.stages
            }
            state.machines[currentMachineIndex].repairs.push(newBreak);
            switch (action.payload.priority) {
                case 1:
                    state.machines[currentMachineIndex].status = MachinesStatus.Wrong;
                    break;
                case 2:
                    state.machines[currentMachineIndex].status = MachinesStatus.Warning;
                    break;
                case 3:
                    state.machines[currentMachineIndex].status = MachinesStatus.Inspection;
                    break;

            }
        })
        .addCase(setMachineStatus, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.name === action.payload.machine);
            state.machines[currentMachineIndex].status = action.payload.status;
        })
        .addCase(setRepair, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.repairs.find(repair => repair.id === action.payload.id));
            const currentRepairIndex  = state.machines[currentMachineIndex].repairs.findIndex(repair => repair.id === action.payload.id);
            state.machines[currentMachineIndex].repairs[currentRepairIndex] = action.payload;
            if (!state.machines[currentMachineIndex].repairs.find(repair => repair.status === false)) {
                state.machines[currentMachineIndex].status = MachinesStatus.Work;
            }
        })
        .addCase(setRepairStage, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.repairs.find(repair => repair.id === action.payload.repair));
            const currentRepairIndex = state.machines[currentMachineIndex].repairs.findIndex(repair => repair.id === action.payload.repair);
            state.machines[currentMachineIndex].repairs[currentRepairIndex].stages = action.payload.stage;

            switch (action.payload.stage) {
                case RepairStage.RepairSuccess: {
                    state.machines[currentMachineIndex].repairs[currentRepairIndex].successPerson = action.payload.user;
                    state.machines[currentMachineIndex].repairs[currentRepairIndex].successDate = action.payload.date;
                    break;
                }
                case RepairStage.Repairing: {
                    state.machines[currentMachineIndex].repairs[currentRepairIndex].repairingPerson = action.payload.user;
                    state.machines[currentMachineIndex].repairs[currentRepairIndex].repairingDate = action.payload.date;
                    break;
                }
                case RepairStage.RepairCompleted: {
                    state.machines[currentMachineIndex].repairs[currentRepairIndex].repairCompletedPerson = action.payload.user;
                    state.machines[currentMachineIndex].repairs[currentRepairIndex].repairCompletedDate = action.payload.date;
                    break;
                }
            }

            if (action.payload.stage === null) {
                state.machines[currentMachineIndex].repairs[currentRepairIndex].status = true;
                if (!state.machines[currentMachineIndex].repairs.find(repair => repair.status === false)) {
                    state.machines[currentMachineIndex].status = MachinesStatus.Work;
                }
            }
        })
        .addCase(deleteRepair, (state, action) => {
            const currentMachineIndex = state.machines.findIndex(machine => machine.repairs.find(repair => repair.id === action.payload));
            const currentRepairIndex = state.machines[currentMachineIndex].repairs.findIndex(repair => repair.id === action.payload);
            state.machines[currentMachineIndex].repairs.splice(currentRepairIndex, 1);
            if (!state.machines[currentMachineIndex].repairs.find(repair => repair.status === false)) {
                state.machines[currentMachineIndex].status = MachinesStatus.Work;
            }
        })
})

export {reducer};