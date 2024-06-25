import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AppRoutes} from "./constants";
import AuthorizationPage from "./pages/authorization-page/authorization-page";
import StatusPage from "./pages/status-page/status-page";
import NotFoundPage from "./pages/not-found-page/not-found-page";

function App () {
    return(
        <BrowserRouter>
            <Routes>
                <Route
                    path={AppRoutes.Root}
                    element={<StatusPage />}
                />
                <Route
                    path={AppRoutes.Login}
                    element={<AuthorizationPage />}
                />
                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;