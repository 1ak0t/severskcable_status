import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, State} from "../types/state.type";
import {AxiosInstance} from "axios";
import {Break, BreaksTypeByMachine, MachineType} from "../types/initialState.type";
import {APIRoute, AppRoutes, AuthorizationStatus, MachinesStatus} from "../constants";
import {
    deleteRepair,
    isLoadingAction,
    loadBreaks,
    loadBreaksTypeByMachine,
    loadMachines,
    loadUser,
    redirectToRoute,
    requireAuthorization,
    setMachineStatus,
    setNewBreak,
    setNewRepairType,
    setRegisterImage, setRepairCompletedImage,
    setRepairingImage,
    setRepairStage,
    setSuccessImage
} from "./actions";
import {AuthDataType} from "../types/auth-data.type";
import {UserLoggedDataType} from "../types/user-data.type";
import {dropToken, saveToken} from "../services/token";
import {store} from "./index";
import {CreateRepairType, NewBreakType, UpdateBreakStageType, UpdateMachineStatusType} from "../types/types";
import {getMachineStatusByPriority} from "../helpers/helpers";
import {
    registerImageActionType,
    repairCompletedImageActionType,
    repairingImageActionType,
    successImageResponse
} from "../types/image-response";


export const fetchAllData = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchAllData',
    async (_arg, {dispatch,extra: api}) => {
        dispatch(isLoadingAction(true));
        dispatch(fetchMachines());
        dispatch(fetchBreaks());
        dispatch(fetchBreakTypesByMachine());
        dispatch(isLoadingAction(false));
    }
);

export const fetchMachines = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchMachines',
    async (_arg, {dispatch,extra: api}) => {
        const {data} = await api.get<MachineType[]>(APIRoute.Machines);
        dispatch(loadMachines(data));
    }
);

export const fetchBreaks = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchBreaks',
    async (_arg, {dispatch,extra: api}) => {
        const {data} = await api.get<Break[]>(APIRoute.Breaks);
        dispatch(loadBreaks(data));
    }
);

export const fetchBreakTypesByMachine = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchBreakTypesByMachine',
    async (_arg, {dispatch,extra: api}) => {
        const {data} = await api.get<BreaksTypeByMachine[]>(APIRoute.BreaksTypeByMachine);
        dispatch(loadBreaksTypeByMachine(data));
    }
);

export const checkAuthAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'checkAuthAction',
    async (_arg, {dispatch, extra: api}) => {
        try {
            const {data} = await api.get<UserLoggedDataType>(APIRoute.Login);
            dispatch(loadUser(data));
            dispatch(requireAuthorization(AuthorizationStatus.Auth));
        } catch {
            dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
        }
    },
);

export const loginAction = createAsyncThunk<void, AuthDataType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'loginAction',
    async ({ email, password}, {dispatch, extra: api}) => {
        const {data} = await api.post<UserLoggedDataType>(APIRoute.Login, {email, password});
        saveToken(data.token);
        dispatch(loadUser(data));
        dispatch(requireAuthorization(AuthorizationStatus.Auth));
        dispatch(redirectToRoute(AppRoutes.Root));
    },
);

export const logoutAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'logoutAction',
    async (_arg, {dispatch, extra: api}) => {
        dropToken();
        dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    },
);

export const createNewBreakTypeAction = createAsyncThunk<void, CreateRepairType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'createNewBreakTypeAction',
    async ({ description, machine}, {dispatch, extra: api}) => {
        const {data} = await api.post<BreaksTypeByMachine>(APIRoute.BreaksTypeByMachine, { description, machine});
        dispatch(setNewRepairType(data));
    },
);

export const createNewBreakAction = createAsyncThunk<void, NewBreakType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'createNewBreakAction',
    async (arg, {dispatch, extra: api}) => {
        let registerImg = null;
        if (arg.registerImage) {
            registerImg = arg.registerImage;
            delete arg.registerImage;
        }
        const {data} = await api.post<Break>(APIRoute.Breaks, arg);
        dispatch(updateMachineStatusAction({id: data.machine.id, status: getMachineStatusByPriority(data.priority)}));
        dispatch(setNewBreak(data));
        if (registerImg && data.id) {
            dispatch(updateRegisterImageAction({file: registerImg, id: data.id}));
        }
    },
);

export const updateMachineStatusAction = createAsyncThunk<void, UpdateMachineStatusType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateMachineStatusAction',
    async (arg, {dispatch, extra: api}) => {
        const updateUrl = APIRoute.Machines + `/${arg.id}`;
        const {data} = await api.patch<MachineType>(updateUrl, {status: arg.status});
        dispatch(setMachineStatus(data));
    },
);

export const updateBreakStageAction = createAsyncThunk<void, UpdateBreakStageType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateBreakStageAction',
    async (arg, {dispatch, extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}`;
        const {data} = await api.patch<Break>(updateUrl, arg);
        dispatch(setRepairStage(data));
    },
);

export const deleteBreakAction = createAsyncThunk<void, string, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'deleteBreakAction',
    async (arg, {dispatch, extra: api}) => {
        const machine = store.getState().breaks.find(el => el.id === arg)?.machine.id;
        const updateUrl = APIRoute.Breaks + `/${arg}`;
        await api.delete(updateUrl);
        dispatch(deleteRepair(arg));
        const find = store.getState().breaks.find(el => (el.machine.id === machine) && (!el.status));
        if (machine && (find === undefined)) {
            dispatch(updateMachineStatusAction({status: MachinesStatus.Work, id: machine}));
        }
    },
);

export const updateSuccessImageAction = createAsyncThunk<void, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateSuccessImageAction',
    async (arg, {dispatch, extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/success-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<successImageResponse>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        dispatch(setSuccessImage({breakId: arg.id, successImage: data.successImage}));
    },
);

export const updateRegisterImageAction = createAsyncThunk<void, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateRegisterImageAction',
    async (arg, {dispatch, extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/register-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<registerImageActionType>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        dispatch(setRegisterImage({breakId: arg.id, registerImage: data.registerImage}));
    },
);

export const updateRepairingImageAction = createAsyncThunk<void, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateRepairingImageAction',
    async (arg, {dispatch, extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/repairing-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<repairingImageActionType>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        dispatch(setRepairingImage({breakId: arg.id, repairingImage: data.repairingImage}));
    },
);

export const updateRepairCompletedImageAction = createAsyncThunk<void, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateRepairCompletedImageAction',
    async (arg, {dispatch, extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/repair-completed-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<repairCompletedImageActionType>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });
        dispatch(setRepairCompletedImage({breakId: arg.id, repairCompletedImage: data.repairCompletedImage}));
    },
);