import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {getToken} from "./token";
import {StatusCodes} from 'http-status-codes';
import {processErrorHandle} from "./process-error-handle";

const BACKEND_URL = 'http://192.168.23.50:5000';
const REQUEST_TIMEOUT = 5000;

type DetailMessageType = {
    type: string;
    message: string;
}

const StatusCodeMapping: Record<number, boolean> = {
    [StatusCodes.BAD_REQUEST]: true,
    [StatusCodes.UNAUTHORIZED]: true,
    [StatusCodes.NOT_FOUND]: true
};

const shouldDisplayError = (response: AxiosResponse) => !!StatusCodeMapping[response.status];

export const createAPI = (): AxiosInstance => {
    const api = axios.create({
        baseURL: BACKEND_URL,
        timeout: REQUEST_TIMEOUT,
    });

    api.interceptors.request.use(
        (config) => {
            const token = getToken();

            if (token && config.headers) {
                config.headers.setAuthorization(token);
            }

            return config;
        },
    );

    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError<DetailMessageType>) => {
            if (error.response && shouldDisplayError(error.response)) {
                const detailMessage = (error.response.data);
                processErrorHandle(detailMessage.message);
            }

            throw error;
        }
    );

    return api;
}