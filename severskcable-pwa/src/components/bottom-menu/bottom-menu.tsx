import {Link} from "react-router-dom";
import {AppRoutes, RepairStage, UserRoles} from "../../constants";
import {useAppSelector} from "../../hooks";

function BottomMenu () {
    const {user, breaks} = useAppSelector(state => state);
    const currentBreaks = breaks.filter(el => !el.status);

    const repairsRegister = currentBreaks.filter(repair => repair.stages === RepairStage.Register);
    const repairsSuccess = currentBreaks.filter(repair => repair.stages === RepairStage.RepairSuccess);
    const repairsRepairing = currentBreaks.filter(repair => repair.stages === RepairStage.Repairing);
    const repairsCompleted = currentBreaks.filter(repair => repair.stages === RepairStage.RepairCompleted);

    function getAgreementCount() {
        let count = 0;

        if (user.role.filter(role => role === UserRoles.ITR) || user.role.filter(role => role === UserRoles.CEO) || user.role.filter(role => role === UserRoles.Admin)) {
            count+=repairsRegister.length + repairsCompleted.length;
        }

        if (user.role.filter(role => role === UserRoles.HeadEngineer)) {
            count+=repairsRepairing.length;
        }

        if (user.role.filter(role => role === UserRoles.Engineers)) {
            count+=repairsSuccess.length;
        }

        return count;
    }

    return(
        <>
            <div className="bottom-menu">
                <Link to={AppRoutes.Root} className="bottom-menu__button">
                    <img src="/icons/menu-icon/menu-status-icon.svg" alt=""/>
                    Статусы<br></br>оборудования
                </Link>
                <Link to={AppRoutes.BreaksList} className="bottom-menu__button">
                    {currentBreaks.length > 0 &&
                        <span className="bottom-menu__breaks-counter">{currentBreaks.length}</span>
                    }
                    <img src="/icons/menu-icon/menu-breaks-icon.svg" alt=""/>
                    Текущие<br></br>поломки
                </Link>
                {(user.role.filter(role => role === UserRoles.Admin)  || user.role.filter(role => role === UserRoles.CEO)) && <Link to={AppRoutes.Root} className="bottom-menu__button">
                    <img src="/icons/menu-icon/menu-analitics-icon.svg" alt=""/>
                    Статистика<br></br>поломок
                </Link>}
                {(user.role.filter(role => role === UserRoles.Operator)) && <Link to={AppRoutes.Agreement} className="bottom-menu__button">
                    {getAgreementCount() > 0 && <span className="bottom-menu__breaks-counter">{getAgreementCount()}</span>}
                    <img src="/icons/menu-icon/menu-success-icon.svg" alt=""/>
                    Требуют<br></br>подтверждения
                </Link>}
                <Link to={AppRoutes.Root} className="bottom-menu__button">
                    <img src="/icons/menu-icon/menu-notification-icon.svg" alt=""/>
                    Уведомления
                </Link>
            </div>
        </>
    );
}

export default BottomMenu;