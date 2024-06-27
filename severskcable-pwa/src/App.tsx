import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {AppRoutes, AuthorizationStatus} from "./constants";
import AuthorizationPage from "./pages/authorization-page/authorization-page";
import StatusPage from "./pages/status-page/status-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";
import BreakRegisterPage from "./pages/break-register-page/break-register-page";
import PrivateRoute from "./components/private-route/private-route";
import {HelmetProvider} from "react-helmet-async";

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
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;