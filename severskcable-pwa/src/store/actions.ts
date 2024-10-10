import {createAction} from "@reduxjs/toolkit";
import {AppRoutes} from "../constants";

export const redirectToRoute = createAction<AppRoutes>('redirectToRoute');