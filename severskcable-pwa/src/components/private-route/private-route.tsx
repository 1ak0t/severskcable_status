import {AppRoutes, AuthorizationStatus} from "../../constants";
import {JSX} from "react";
import {Navigate} from "react-router-dom";

type PrivateRouteProps = {
    authorizationStatus: AuthorizationStatus;
    children: JSX.Element;
}

function PrivateRoute({authorizationStatus, children}: PrivateRouteProps) {
    return(
        authorizationStatus === AuthorizationStatus.Auth
            ? children
            : <Navigate to={AppRoutes.Login} />
    );
}

export default PrivateRoute;