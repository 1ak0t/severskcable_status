import {Route, Routes} from 'react-router-dom';
import {AppRoutes} from "./constants";
import AuthorizationPage from "./pages/authorization-page/authorization-page";
import StatusPage from "./pages/status-page/status-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";
import BreakRegisterPage from "./pages/break-register-page/break-register-page";
import PrivateRoute from "./components/private-route/private-route";
import {HelmetProvider} from "react-helmet-async";
import BreaksListPage from "./pages/breaks-list-page/breaks-list-page";
import GoodSend from "./pages/good-send/good-send";
import MachineBreaksPage from "./pages/machine-breaks-page/machine-breaks-page";
import AgreementPage from "./pages/agreement-page/agreement-page";
import {useAppDispatch, useAppSelector} from "./hooks";
import HistoryRouter from "./components/history-route/history-route";
import browserHistory from "./browser-history";
import {useEffect} from "react";
import {fetchAllData} from "./store/api-actions";
import {BroadcastChannel} from "node:worker_threads";


function App () {
    const {authorizationStatus, user} = useAppSelector(state => state);
    const dispatch = useAppDispatch();



    const publicVapidKey = 'BG2M57wQ4s6MhyXhryYdfpmaPGUSWhZgbWGf7kHkNTfMaVbIC7HIRaeq5h4wr9BmREx_toP0DvJAkPTfuVBgTP8';

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const send = async () => {
        const register = await navigator.serviceWorker.ready;

        if (!register.pushManager) {
            throw { errorCode: "PushManagerUnavailable" };
        }

        const existingSubscription = await register.pushManager.getSubscription();

        if (existingSubscription) {
            throw { errorCode: "ExistingSubscription" };
        }


        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        if (user.id) {
            await fetch(`http://localhost:5000/users/${user.id}/subscribe`, {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'content-type': 'application/json'
                }
            });
        }
    };

    useEffect(() => {

        if ('serviceWorker' in navigator) {
            send().catch(err => console.error(err));
        }
    }, [user]);

    useEffect(() => {

    }, []);

    return(
        <HelmetProvider>
            <HistoryRouter history={browserHistory}>
                <Routes>
                    <Route
                        path={AppRoutes.Root}
                        element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <StatusPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.Login}
                        element={<AuthorizationPage />}
                    />
                    <Route
                        path={AppRoutes.BreakRegistration}
                        element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <BreakRegisterPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.BreaksList}
                        element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <BreaksListPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.Agreement}
                        element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <AgreementPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path={AppRoutes.MachineBreaks}>
                        <Route path=":machineId" element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <MachineBreaksPage />
                            </PrivateRoute>} />
                    </Route>
                    <Route
                        path={AppRoutes.GoodSend}
                        element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <GoodSend />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </HistoryRouter>
        </HelmetProvider>
    );
}

export default App;