import {AppRoutes, AuthorizationStatus, UserRoles} from "../../constants";
import {JSX} from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../hooks";
import {getUser} from "../../store/user-process/selectors";

type PrivateRouteProps = {
    authorizationStatus: AuthorizationStatus;
    children: JSX.Element;
    notAccess?: UserRoles[]
}

function PrivateRoute({authorizationStatus, children, notAccess}: PrivateRouteProps) {
    const user = useAppSelector(getUser);
    if (authorizationStatus === AuthorizationStatus.Auth) {
        if ((notAccess?.includes(UserRoles.Admin)) && (notAccess?.includes(UserRoles.CEO)) && notAccess !== undefined && (notAccess.filter(element => user.role.includes(element)).length > 0)) {
            let navigatePath = AppRoutes.Root;
            notAccess.map(role => {
                switch (role) {
                    case UserRoles.Supply: {
                        navigatePath = AppRoutes.Supply;
                    }
                }
            })
            return (<Navigate to={navigatePath} />);
        }

        return children;
    }

    return(<Navigate to={AppRoutes.Login} />);
}

export default PrivateRoute;