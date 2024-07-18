import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoutes, AuthorizationStatus} from "./constants";
import AuthorizationPage from "./pages/authorization-page/authorization-page";
import StatusPage from "./pages/status-page/status-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";
import BreakRegisterPage from "./pages/break-register-page/break-register-page";
import PrivateRoute from "./components/private-route/private-route";
import {HelmetProvider} from "react-helmet-async";
import BreaksListPage from "./pages/breaks-list-page/breaks-list-page";
import GoodSend from "./pages/good-send/good-send";
import MachineBreaksPage from "./pages/machine-breaks-page/machine-breaks-page";

function App () {
    return(
        <HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path={AppRoutes.Root}
                        element={
                            <PrivateRoute authorizationStatus={AuthorizationStatus.Auth}>
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
                            <PrivateRoute authorizationStatus={AuthorizationStatus.Auth}>
                                <BreakRegisterPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path={AppRoutes.BreaksList}
                        element={
                            <PrivateRoute authorizationStatus={AuthorizationStatus.Auth}>
                                <BreaksListPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path={AppRoutes.MachineBreaks}>
                        <Route path=":machineId" element={
                            <PrivateRoute authorizationStatus={AuthorizationStatus.Auth}>
                                <MachineBreaksPage />
                            </PrivateRoute>} />
                    </Route>
                    <Route
                        path={AppRoutes.GoodSend}
                        element={
                            <PrivateRoute authorizationStatus={AuthorizationStatus.Auth}>
                                <GoodSend />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;