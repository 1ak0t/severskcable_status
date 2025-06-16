import {Link} from "react-router-dom";
import {AppRoutes, RepairStage, UserRoles} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {getUser} from "../../store/user-process/selectors";
import {getBreaks} from "../../store/data-process/selectors";
import {fetchAllData, fetchNotifications, fetchSupplyData, resetNotificationCountAction} from "../../store/api-actions";
import {CiDeliveryTruck, CiUser} from "react-icons/ci";
import {HiChartBar} from "react-icons/hi2";
import {useState} from "react";
import classNames from "classnames";
import {BsCurrencyExchange} from "react-icons/bs";

function BottomMenu () {
    const user = useAppSelector(getUser);
    const breaks = useAppSelector(getBreaks);
    const currentBreaks = breaks.filter(el => !el.status);
    const dispatch = useAppDispatch();

    const repairsRegister = currentBreaks.filter(repair => repair.stages === RepairStage.Register);
    const repairsSuccess = currentBreaks.filter(repair => repair.stages === RepairStage.RepairSuccess);
    const repairsRepairing = currentBreaks.filter(repair => repair.stages === RepairStage.Repairing);
    const repairsCompleted = currentBreaks.filter(repair => repair.stages === RepairStage.RepairCompleted);
    const repairsInSupply = currentBreaks.filter(repair => repair.stages === RepairStage.Supply);

    const [isProfileSubmenu, setIsProfileSubmenu] = useState(false);

    function getAgreementCount() {
        let count = 0;

        if (user.role.find(role => role === UserRoles.ITR) || user.role.find(role => role === UserRoles.CEO) || user.role.find(role => role === UserRoles.Admin)) {
            count+=repairsRegister.length + repairsCompleted.length;
        }

        if (user.role.find(role => role === UserRoles.HeadEngineer)) {
            count+=repairsRepairing.length;
            count+=repairsInSupply.length;
        }

        if (user.role.find(role => role === UserRoles.Engineers)) {
            count+=repairsSuccess.length;
        }

        return count;
    }

    return(
        <>
            <div className="bottom-menu">
                {!(user.role.find(role => role === UserRoles.Supply)) &&
                    <Link to={AppRoutes.Root} className="bottom-menu__button" onClick={() => dispatch(fetchAllData())}>
                        <img src="/icons/menu-icon/menu-status-icon.svg" alt=""/>
                        Статусы<br></br>оборудования
                    </Link>
                }
                {!(user.role.find(role => role === UserRoles.Supply)) &&
                    <Link to={AppRoutes.BreaksList} className="bottom-menu__button">
                    {currentBreaks.length > 0 &&
                        <span className="bottom-menu__breaks-counter">{currentBreaks.length}</span>
                    }
                    <img src="/icons/menu-icon/menu-breaks-icon.svg" alt=""/>
                    Текущие<br></br>поломки
                    </Link>
                }
                {/*{(user.role.find(role => role === UserRoles.Admin)  || user.role.find(role => role === UserRoles.CEO)) &&*/}
                {/*    <Link to={AppRoutes.Root} className="bottom-menu__button">*/}
                {/*    <img src="/icons/menu-icon/menu-analitics-icon.svg" alt=""/>*/}
                {/*    Статистика<br></br>поломок*/}
                {/*    </Link>*/}
                {/*}*/}
                {(!(user.role.find(role => role === UserRoles.Supply)) && !(user.role.find(role => role === UserRoles.Operator))) &&
                    <Link to={AppRoutes.Agreement} className="bottom-menu__button">
                    {getAgreementCount() > 0 && <span className="bottom-menu__breaks-counter">{getAgreementCount()}</span>}
                    <img src="/icons/menu-icon/menu-success-icon.svg" alt=""/>
                    Требуют<br></br>подтверждения
                    </Link>
                }
                {(user.role.find(role => role === UserRoles.Supply) || user.role.find(role => role === UserRoles.Admin) || user.role.find(role => role === UserRoles.CEO)) &&
                    <Link to={AppRoutes.Supply} className="bottom-menu__button" onClick={() => dispatch(fetchSupplyData())}>
                        {repairsInSupply.length > 0 && <span className="bottom-menu__breaks-counter">{repairsInSupply.length}</span>}
                        <CiDeliveryTruck size={"30px"} style={{marginBottom: "5px"}}/>
                        Запросы<br></br>снабжения
                    </Link>
                }
                <button className="bottom-menu__button" onClick={() => setIsProfileSubmenu(!isProfileSubmenu)}>
                    {user.notificationsCount > 0 && <span className="bottom-menu__breaks-counter">{user.notificationsCount}</span>}
                    <CiUser className="bottom-menu__button--profile"/>
                    <br></br>Профиль
                </button>
                <div className={classNames(
                    "bottom-menu__submenu",
                    {"bottom-menu__submenu--inactive": !isProfileSubmenu}
                )}>
                    <Link to={AppRoutes.Notifications} className="bottom-menu__button" onClick={() => dispatch(fetchNotifications())}>
                        {user.notificationsCount > 0 && <span className="bottom-menu__breaks-counter">{user.notificationsCount}</span>}
                        <img src="/icons/menu-icon/menu-notification-icon.svg" alt=""/>
                        <br></br>Уведомления
                    </Link>
                    {(user.role.find(role => role === UserRoles.ITR) || user.role.find(role => role === UserRoles.Admin) || user.role.find(role => role === UserRoles.CEO)) &&
                        <Link to={AppRoutes.Analytics} className="bottom-menu__button">
                            <HiChartBar className="bottom-menu__button--profile"/>
                            <br></br>Аналитика
                        </Link>
                    }
                    {(user.role.find(role => role === UserRoles.Admin) || user.role.find(role => role === UserRoles.CEO)) &&
                        <Link to={AppRoutes.Currencies} className="bottom-menu__button">
                            <BsCurrencyExchange className="bottom-menu__button--profile"/>
                            <br></br>Курсы
                        </Link>
                    }
                </div>
            </div>
        </>
    );
}

export default BottomMenu;