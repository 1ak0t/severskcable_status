import {Route, Routes} from 'react-router-dom';
import {AppRoutes} from "./constants";
import AuthorizationPage from "./pages/authorization-page/authorization-page";
import StatusPage from "./pages/status-page/status-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";
import BreakRegisterPage from "./pages/break-register-page/break-register-page";
import PrivateRoute from "./components/private-route/private-route";
import {HelmetProvider} from "react-helmet-async";
import BreaksListPage from "./pages/breaks-list-page/breaks-list-page";
import SendingStatusPage from "./components/sending-status-page/sending-status-page";
import MachineBreaksPage from "./pages/machine-breaks-page/machine-breaks-page";
import AgreementPage from "./pages/agreement-page/agreement-page";
import {useAppSelector} from "./hooks";
import {SyncLoader} from "react-spinners";
import {getAuthCheckedStatus, getAuthorizationStatus, getUser} from "./store/user-process/selectors";
import {getDataLoadingStatus, getErrorStatus} from "./store/data-process/selectors";
import {CSSProperties, useEffect} from "react";
import companyLogo from './imgs/logo-main.svg';
import NetworkErrorPage from "./pages/network-error-page/network-error-page";
import NotificationPage from "./pages/notification-page/notification-page";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

function App () {
    const authorizationStatus = useAppSelector(getAuthorizationStatus);
    const isLoading = useAppSelector(getDataLoadingStatus);
    const isAuthChecked = useAppSelector(getAuthCheckedStatus);
    const hasError = useAppSelector(getErrorStatus);
    const user = useAppSelector(getUser);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // @ts-ignore
            navigator.setAppBadge(user.notificationsCount);
        }
    },[user]);

    if (!isAuthChecked || isLoading) {
        return (
            <>
                <img src={companyLogo} className="app__load-img" alt="logo"/>
                <SyncLoader
                    color={"#EA753EFF"}
                    cssOverride={override}
                    size={15}
                    margin={8}
                />
            </>
        );
    }

    if (hasError) {
        return (
            <NetworkErrorPage />
        );
    }

    return(
        <HelmetProvider>
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
                    <Route
                        path={AppRoutes.Notifications}
                        element={
                            <PrivateRoute authorizationStatus={authorizationStatus}>
                                <NotificationPage />
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
                                <SendingStatusPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
        </HelmetProvider>
    );
}

export default App;