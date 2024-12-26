import axios, {AxiosInstance} from "axios";
import {getToken} from "./token";
import {toast} from "react-toastify";

// export const BACKEND_URL = 'http://localhost:5000';
export const BACKEND_URL = 'https://corp.severskcable.ru:4875';
const REQUEST_TIMEOUT = 5000;

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
        (error) => {
            if (error.response) {
                const detailMessage = (error.response.data);

                toast.warn(detailMessage.error);
            }

            throw error;
        }
    );

    return api;
}
