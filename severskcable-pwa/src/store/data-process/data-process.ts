import {createSlice} from "@reduxjs/toolkit";
import {MachinesStatus, NameSpace, RepairStage} from "../../constants";
import {DataProcess} from "../../types/state.type";
import {
    createNewBreakAction,
    createNewBreakTypeAction,
    deleteBreakAction,
    fetchBreaks,
    fetchBreakTypesByMachine,
    fetchImage,
    fetchMachines,
    fetchNotifications,
    updateBreakStageAction,
    updateMachineStatusAction,
    updateRegisterImageAction,
    updateRepairCompletedImageAction,
    updateRepairingImageAction,
    updateSuccessImageAction,
    fetchSupplyOrders,
    createNewSuppliesAction,
    updateSupplyAction,
    fetchUsersAction,
    fetchCurrencies
} from "../api-actions";

const initialState: DataProcess = {
    isDataLoading: false,
    machines: [],
    breaks: [],
    breaksTypesByMachine: [],
    notifications: [],
    currencies: [],
    supplies: [],
    users: [],
    hasError: false,
    isCreatingNewBreak: false,
    isCreatedNewBreak: null,
    isPhotoDownloading: false,
    isChangingStage: false,
    isChangedStage: null
}

export const dataProcess = createSlice({
    name: NameSpace.Data,
    initialState,
    reducers: {
        setNewBreakFinished: (state) => {
            state.isCreatedNewBreak = null;
        },
        setNullToChangesState: (state) => {
            state.isChangedStage = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMachines.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchMachines.fulfilled, (state, action) => {
                state.machines = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchMachines.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(fetchSupplyOrders.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchSupplyOrders.fulfilled, (state, action) => {
                state.supplies = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchSupplyOrders.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(fetchBreaks.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchBreaks.fulfilled, (state, action) => {
                state.breaks = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchBreaks.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(fetchBreakTypesByMachine.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchBreakTypesByMachine.fulfilled, (state, action) => {
                state.breaksTypesByMachine = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchBreakTypesByMachine.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(fetchNotifications.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchNotifications.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(fetchCurrencies.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchCurrencies.fulfilled, (state, action) => {
                state.currencies = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchCurrencies.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(fetchUsersAction.pending, (state) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(fetchUsersAction.fulfilled, (state, action) => {
                state.users = action.payload;
                state.isDataLoading = false;
            })
            .addCase(fetchUsersAction.rejected, (state) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(updateMachineStatusAction.pending, (state) => {
                state.isDataLoading = true;
            })
            .addCase(updateMachineStatusAction.fulfilled, (state, action) => {
                const currentMachineIndex = state.machines.findIndex(machine => machine.id === action.payload.id);
                state.machines[currentMachineIndex].status = action.payload.status;
                state.isDataLoading = false;
            })
            .addCase(createNewBreakTypeAction.pending, (state) => {
                state.isDataLoading = true;
            })
            .addCase(createNewBreakTypeAction.fulfilled, (state, action) => {
                state.breaksTypesByMachine = state.breaksTypesByMachine.concat(action.payload);
                state.isDataLoading = false;
            })
            .addCase(createNewBreakAction.pending, (state) => {
                state.isCreatingNewBreak = true;
            })
            .addCase(createNewBreakAction.fulfilled, (state, action) => {
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
                state.isDataLoading = false;
                state.isCreatedNewBreak = true;
                state.isCreatingNewBreak = false;
            })
            .addCase(createNewBreakAction.rejected, (state, action) => {
                state.isCreatedNewBreak = false;
                state.isCreatingNewBreak = false;
            })
            .addCase(updateBreakStageAction.pending, (state, action) => {
                state.isChangingStage = true;
            })
            .addCase(updateBreakStageAction.fulfilled, (state, action) => {
                const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.id);
                const currentMachineIndex = state.machines.findIndex(el => el.id === action.payload.machine.id);
                state.breaks[currentBreakIndex].stages = action.payload.stages;

                if (action.payload.registerDate) {
                    state.breaks[currentBreakIndex].registerDate = action.payload.registerDate;
                }

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
                state.isChangingStage = false;
                state.isChangedStage = true;
            })
            .addCase(updateBreakStageAction.rejected, (state) => {
                state.isChangedStage = false;
                state.isChangingStage = false;
            })
            .addCase(deleteBreakAction.pending, (state, action) => {
                state.isDataLoading = true;
            })
            .addCase(deleteBreakAction.fulfilled, (state, action) => {
                const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload);
                const currentMachineIndex = state.machines.findIndex(machine => machine.id === state.breaks[currentBreakIndex].machine.id);

                state.breaks.splice(currentBreakIndex, 1);
                if (state.machines[currentMachineIndex].status !== MachinesStatus.Work) {
                    state.machines[currentMachineIndex].status = MachinesStatus.Work;
                }

                state.isDataLoading = false;
            })
            .addCase(updateSuccessImageAction.pending, (state, action) => {
                state.isChangingStage = true;
            })
            .addCase(updateSuccessImageAction.fulfilled, (state, action) => {
                const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
                state.breaks[currentBreakIndex].successImage = action.payload.successImage;
                state.isChangingStage = false;
                state.isChangedStage = true;
            })
            .addCase(updateSuccessImageAction.rejected, (state, action) => {
                state.isChangedStage = false;
                state.isChangingStage = false;
            })
            .addCase(updateRegisterImageAction.pending, (state, action) => {
                state.isDataLoading = true;
            })
            .addCase(updateRegisterImageAction.fulfilled, (state, action) => {
                const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
                state.breaks[currentBreakIndex].registerImage = action.payload.registerImage;
                state.isDataLoading = false;
            })
            .addCase(updateRepairingImageAction.pending, (state, action) => {
                state.isDataLoading = true;
            })
            .addCase(updateRepairingImageAction.fulfilled, (state, action) => {
                const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
                state.breaks[currentBreakIndex].repairingImage = action.payload.repairingImage;
                state.isDataLoading = false;
            })
            .addCase(updateRepairCompletedImageAction.pending, (state, action) => {
                state.isDataLoading = true;
            })
            .addCase(updateRepairCompletedImageAction.fulfilled, (state, action) => {
                const currentBreakIndex = state.breaks.findIndex(el => el.id === action.payload.breakId);
                state.breaks[currentBreakIndex].repairCompletedImage = action.payload.repairCompletedImage;
                state.isDataLoading = false;
            })
            .addCase(fetchImage.pending, (state) => {
                state.isPhotoDownloading = true;
            })
            .addCase(fetchImage.fulfilled, (state) => {
                state.isPhotoDownloading = false;
            })
            .addCase(createNewSuppliesAction.pending, (state, action) => {
                state.isDataLoading = true;
                state.hasError = false;
            })
            .addCase(createNewSuppliesAction.fulfilled, (state, action) => {
                state.supplies = state.supplies.concat(action.payload);
                state.isDataLoading = false;
            })
            .addCase(createNewSuppliesAction.rejected, (state, action) => {
                state.isDataLoading = false;
                state.hasError = true;
            })
            .addCase(updateSupplyAction.pending, (state, action) => {
                state.hasError = false;
            })
            .addCase(updateSupplyAction.fulfilled, (state, action) => {
                const currentSupplyIndex = state.supplies.findIndex(order => order.id === action.payload.id);
                state.supplies[currentSupplyIndex] = action.payload;
            })
            .addCase(updateSupplyAction.rejected, (state, action) => {
                state.hasError = true;
            })
    }
});

export const {setNewBreakFinished, setNullToChangesState} = dataProcess.actions;