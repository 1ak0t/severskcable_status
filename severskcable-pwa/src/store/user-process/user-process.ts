import {UserProcess} from "../../types/state.type";
import {AuthorizationStatus, NameSpace} from "../../constants";
import {createSlice} from "@reduxjs/toolkit";
import {
    checkAuthAction,
    fetchUserNotificationCount,
    loginAction,
    logoutAction,
    resetNotificationCountAction
} from "../api-actions";

const initialState: UserProcess = {
    authorizationStatus: AuthorizationStatus.Unknown,
    user: {
        id: '',
        surname: '',
        name: '',
        middleName: '',
        email: '',
        role: [],
        notificationsCount: 0
    },
}

export const userProcess = createSlice({
    name: NameSpace.User,
    initialState,
    reducers: {
        increaseNotificationCount: (state) => {
            state.user.notificationsCount = state.user.notificationsCount + 1;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(checkAuthAction.fulfilled, (state, action) => {
                state.authorizationStatus = AuthorizationStatus.Auth;
                state.user = action.payload;
            })
            .addCase(checkAuthAction.rejected, (state) => {
                state.authorizationStatus = AuthorizationStatus.NoAuth;
            })
            .addCase(loginAction.fulfilled, (state, action) => {
                state.authorizationStatus = AuthorizationStatus.Auth;
                state.user = action.payload;
            })
            .addCase(loginAction.rejected, (state) => {
                state.authorizationStatus = AuthorizationStatus.NoAuth;
            })
            .addCase(logoutAction.fulfilled, (state) => {
                state.authorizationStatus = AuthorizationStatus.NoAuth;
            })
            .addCase(resetNotificationCountAction.fulfilled, (state) => {
                state.user.notificationsCount = 0;
            })
            .addCase(fetchUserNotificationCount.fulfilled, (state, action) => {
                state.user.notificationsCount = action.payload;
            })

    }
})

export const {increaseNotificationCount} = userProcess.actions;