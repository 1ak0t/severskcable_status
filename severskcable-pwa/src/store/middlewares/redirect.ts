import {PayloadAction} from "@reduxjs/toolkit";
import {Middleware} from 'redux';
import browserHistory from "../../browser-history";
import {rootReducer} from "../root-reducer";

type Reducer = ReturnType<typeof rootReducer>;


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