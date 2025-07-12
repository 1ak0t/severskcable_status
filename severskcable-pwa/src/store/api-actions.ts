import {createAsyncThunk} from "@reduxjs/toolkit";
import {AppDispatch, State} from "../types/state.type";
import {AxiosInstance} from "axios";
import {
    Break,
    BreaksTypeByMachine,
    CurrenciesType,
    MachineType,
    NotificationType,
    SupplyOrdersType
} from "../types/initialState.type";
import {APIRoute, AppRoutes, MachinesStatus, NameSpace, RepairStage} from "../constants";
import {redirectToRoute} from "./actions";
import {AuthDataType} from "../types/auth-data.type";
import {UserLoggedDataType} from "../types/user-data.type";
import {dropToken, saveToken} from "../services/token";
import {store} from "./index";
import {
    CreateNewSupplyType,
    CreateRepairType,
    NewBreakType,
    UpdateBreakStageType,
    UpdateMachineStatusType,
    UpdateSupplyType
} from "../types/types";
import {getMachineStatusByPriority} from "../helpers/helpers";
import {
    registerImageActionType,
    repairCompletedImageActionType,
    repairingImageActionType,
    successImageResponse
} from "../types/image-response";
import {BACKEND_URL} from "../services/api";


export const fetchAllData = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchAllData',
    async (_arg, {dispatch}) => {
        dispatch(fetchMachines());
        dispatch(fetchBreaks());
        dispatch(fetchBreakTypesByMachine());
        dispatch(fetchNotifications());
        dispatch(fetchUsersAction());
        dispatch(fetchCurrencies());
        dispatch(fetchUserNotificationCount(<string>store.getState().USER?.user.id))
        //@ts-ignore
        navigator.setAppBadge(store.getState().USER?.user.notificationsCount);
    }
);

export const fetchSupplyData = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchSupplyData',
    async (_arg, {dispatch}) => {
        dispatch(fetchNotifications());
        dispatch(fetchUserNotificationCount(<string>store.getState().USER?.user.id));
        dispatch(fetchBreaks());
        dispatch(fetchSupplyOrders());
        //@ts-ignore
        navigator.setAppBadge(store.getState().USER?.user.notificationsCount);
    }
);

export const fetchMachines = createAsyncThunk<MachineType[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchMachines',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<MachineType[]>(APIRoute.Machines);
        return data;
    }
);

export const fetchSupplyOrders = createAsyncThunk<SupplyOrdersType[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchSupplyOrders',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<SupplyOrdersType[]>(APIRoute.SupplyOrders);
        return data;
    }
);

export const fetchBreaks = createAsyncThunk<Break[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchBreaks',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<Break[]>(APIRoute.Breaks);
        return data;
    }
);

export const fetchBreakTypesByMachine = createAsyncThunk<BreaksTypeByMachine[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchBreakTypesByMachine',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<BreaksTypeByMachine[]>(APIRoute.BreaksTypeByMachine);
        return data;
    }
);

export const fetchUserNotificationCount = createAsyncThunk<number, string, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchUserNotificationCount',
    async (arg, {extra: api}) => {
        const userUrl = APIRoute.Users + `/${arg}/info`;
        const {data} = await api.get<number>(userUrl);
        if ('serviceWorker' in navigator) {
            //@ts-ignore
            navigator.setAppBadge(data);
        }
        return data;
    }
);

export const fetchNotifications = createAsyncThunk<NotificationType[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchNotifications',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<NotificationType[]>(APIRoute.Notifications);
        return data;
    }
);

export const fetchCurrencies = createAsyncThunk<CurrenciesType[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchCurrencies',
    async (_arg, {extra: api}) => {
        const {data} = await api.get<CurrenciesType[]>(APIRoute.Currecies);
        return data;
    }
)

export const checkAuthAction = createAsyncThunk<UserLoggedDataType, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'checkAuthAction',
    async (_arg, {dispatch, extra: api}) => {
        const {data} = await api.get<UserLoggedDataType>(APIRoute.Login);
        return data;
    }
);

export const loginAction = createAsyncThunk<UserLoggedDataType, AuthDataType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'loginAction',
    async ({ email, password}, {dispatch, extra: api}) => {
        dropToken();
        const {data} = await api.post<UserLoggedDataType>(APIRoute.Login, {email, password});
        saveToken(data.token);
        dispatch(redirectToRoute(AppRoutes.Root));
        return data;
    },
);

export const logoutAction = createAsyncThunk<void, undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'logoutAction',
    async (_arg, {extra: api}) => {
        await api.delete(APIRoute.Logout);
        dropToken();
    },
);

export const fetchUsersAction = createAsyncThunk<UserLoggedDataType[], undefined, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'getUsersAction',
    async (_arg, {dispatch, extra: api}) => {
        const {data} = await api.get<UserLoggedDataType[]>(APIRoute.Users);
        return data;
    }
);

export const createNewBreakTypeAction = createAsyncThunk<BreaksTypeByMachine, CreateRepairType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'createNewBreakTypeAction',
    async ({ description, machine}, {extra: api}) => {
        const {data} = await api.post<BreaksTypeByMachine>(APIRoute.BreaksTypeByMachine, { description, machine});
        return data;
    },
);

export const createNewBreakAction = createAsyncThunk<Break, NewBreakType, {
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
        if (registerImg && data.id) {
            dispatch(updateRegisterImageAction({file: registerImg, id: data.id}));
        }
        return data;
    },
);

export const updateMachineStatusAction = createAsyncThunk<MachineType, UpdateMachineStatusType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateMachineStatusAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Machines + `/${arg.id}`;
        const machine = await api.get<MachineType>(updateUrl);
        if (arg.status !== MachinesStatus.Work) {
            switch (machine.data.status) {
                case MachinesStatus.Wrong:
                    return machine.data;
                case MachinesStatus.Warning:
                    if (arg.status === MachinesStatus.Wrong) {
                        const {data} = await api.patch<MachineType>(updateUrl, {status: arg.status});
                        return data;
                    }
                    return machine.data;
                default:
                    const {data} = await api.patch<MachineType>(updateUrl, {status: arg.status});
                    return data;
            }
        } else {
            const {data} = await api.patch<MachineType>(updateUrl, {status: arg.status});
            return data;
        }
    },
);

export const updateBreakStageAction = createAsyncThunk<Break, UpdateBreakStageType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateBreakStageAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}`;
        const {data} = await api.patch<Break>(updateUrl, arg);
        return data;
    },
);

export const deleteBreakAction = createAsyncThunk<string, string, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'deleteBreakAction',
    async (arg, {dispatch, extra: api}) => {
        const machine = store.getState()[NameSpace.Data].breaks.find(el => el.id === arg)?.machine.id;
        const updateUrl = APIRoute.Breaks + `/${arg}`;
        await api.delete(updateUrl);
        const find = store.getState()[NameSpace.Data].breaks.find(el => (el.machine.id === machine) && (!el.status));
        if (machine && (find === undefined)) {
            dispatch(updateMachineStatusAction({status: MachinesStatus.Work, id: machine}));
        }
        return arg;
    },
);

export const updateSuccessImageAction = createAsyncThunk<{breakId: string, successImage: string}, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateSuccessImageAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/success-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<successImageResponse>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });

        return {breakId: arg.id, successImage: data.successImage};
    },
);

export const updateRegisterImageAction = createAsyncThunk<{breakId: string, registerImage: string}, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateRegisterImageAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/register-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<registerImageActionType>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });

        return {breakId: arg.id, registerImage: data.registerImage};
    },
);

export const updateRepairingImageAction = createAsyncThunk<{breakId: string, repairingImage: string}, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateRepairingImageAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/repairing-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<repairingImageActionType>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });

        return {breakId: arg.id, repairingImage: data.repairingImage}
    },
);

export const updateRepairCompletedImageAction = createAsyncThunk<{breakId: string, repairCompletedImage: string}, {file: File, id: string}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateRepairCompletedImageAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Breaks + `/${arg.id}/repair-completed-image`;
        const formData = new FormData();
        formData.set('image', arg.file);
        const { data } = await api.post<repairCompletedImageActionType>(updateUrl, formData, {
            headers: {'Content-Type': 'multipart/form-data'},
        });

        return {breakId: arg.id, repairCompletedImage: data.repairCompletedImage};
    },
);

export const fetchImage = createAsyncThunk<void, {imageName: string | undefined, setImg: any, imgURL: string | undefined, setImgVisible: any, imgVisible: boolean}, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'fetchImage',
    async (arg, {extra: api}) => {
        if(!arg.imgURL) {
            const imageUrl = BACKEND_URL + APIRoute.Images + arg.imageName;
            const res = await fetch(imageUrl);
            const imageBlob = await res.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            arg.setImg(imageObjectURL);
        }
        arg.setImgVisible(!arg.imgVisible);
    },
);

export const resetNotificationCountAction = createAsyncThunk<void, string, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'resetNotificationCountAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.Users + `/${arg}/reset-notification-status`;
        await api.post(updateUrl);
    },
);

export const updateSupplyAction = createAsyncThunk<SupplyOrdersType, UpdateSupplyType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'updateSupplyAction',
    async (arg, {extra: api}) => {
        const updateUrl = APIRoute.SupplyOrders + `/${arg.id}/change-status`;
        if (arg.supplyImage) {
            const formData = new FormData();
            formData.set('image', arg.supplyImage);
            const { data } = await api.patch<SupplyOrdersType>(updateUrl, formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });

            return data;
        }

        const {data} = await api.patch<SupplyOrdersType>(updateUrl, arg);

        return data;
    },
);

export const createNewSuppliesAction = createAsyncThunk<SupplyOrdersType, CreateNewSupplyType, {
    dispatch: AppDispatch;
    state: State;
    extra: AxiosInstance;
}>(
    'createNewSuppliesAction',
    async (arg, {dispatch, extra: api}) => {
        let supplyImage = null;
        if (arg.supplyImage) {
            supplyImage = arg.supplyImage;
            delete arg.supplyImage;
        }
        const {data} = await api.post<SupplyOrdersType>(APIRoute.SupplyOrders, {...arg, break: arg.break.id});
        if (supplyImage && data.id) {
            dispatch(updateSupplyAction({supplyImage: supplyImage, id: data.id}));
        }
        dispatch(updateBreakStageAction({id: arg.break.id, stages: RepairStage.Supply, machine: arg.break.machine.id}))
        return data;
    },
);