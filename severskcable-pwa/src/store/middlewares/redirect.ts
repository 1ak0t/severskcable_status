import {PayloadAction} from "@reduxjs/toolkit";
import {Middleware} from 'redux';
import {reducer} from "../reducer";
import browserHistory from "../../browser-history";

type Reducer = ReturnType<typeof reducer>;


export const redirect: Middleware<unknown, Reducer> =
    () =>
        (next) =>
            // @ts-ignore
            (action: PayloadAction<string>) => {
                // @ts-ignore
                if (action.type === 'redirectToRoute') {
                    // @ts-ignore
                    browserHistory.push(action.payload);
                }

                return next(action);
            };