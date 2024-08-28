import {Link} from "react-router-dom";
import {AppRoutes, RepairStage, UserRoles} from "../../constants";
import {useAppSelector} from "../../hooks";
import {RepairElementType} from "../../types/types";

function BottomMenu () {
    const {user, machines} = useAppSelector(state => state);
    const repairList: RepairElementType[] = [];
    machines.forEach(machine => {
        if (machine.repairs.length > 0) {
            machine.repairs.filter(repair => !repair.status).map(repair => repairList.push({machine: machine.name, machineStatus: machine.status, repair: repair}));
        }
    });

    const repairsRegister = repairList.filter(repair => repair.repair.stages === RepairStage.Register);
    const repairsSuccess = repairList.filter(repair => repair.repair.stages === RepairStage.RepairSuccess);
    const repairsRepairing = repairList.filter(repair => repair.repair.stages === RepairStage.Repairing);
    const repairsCompleted = repairList.filter(repair => repair.repair.stages === RepairStage.RepairCompleted);

    return(
        <>
            <div className="bottom-menu">
                <Link to={AppRoutes.Root} className="bottom-menu__button">
                    <img src="/icons/menu-icon/menu-status-icon.svg" alt=""/>
                    Статусы<br></br>оборудования
                </Link>
                <Link to={AppRoutes.BreaksList} className="bottom-menu__button">
                    {repairList.length > 0 &&
                        <span className="bottom-menu__breaks-counter">{repairList.length}</span>
                    }
                    <img src="/icons/menu-icon/menu-breaks-icon.svg" alt=""/>
                    Текущие<br></br>поломки
                </Link>
                {((user.role as UserRoles) === UserRoles.Admin || (user.role as UserRoles) === UserRoles.CEO) && <Link to={AppRoutes.Root} className="bottom-menu__button">
                    <img src="/icons/menu-icon/menu-analitics-icon.svg" alt=""/>
                    Статистика<br></br>поломок
                </Link>}
                {((user.role as UserRoles) !== UserRoles.Operator) && <Link to={AppRoutes.Agreement} className="bottom-menu__button">
                    {(((user.role === UserRoles.ITR) || (user.role === UserRoles.CEO) || (user.role === UserRoles.Admin)) && (repairsRegister.length > 0 || repairsCompleted.length > 0)) &&
                        <span className="bottom-menu__breaks-counter">{repairsRegister.length + repairsCompleted.length}</span>
                    }
                    {((user.role === UserRoles.HeadEngineer) && repairsRepairing.length > 0) &&
                        <span className="bottom-menu__breaks-counter">{repairsRepairing.length}</span>
                    }
                    {((user.role === UserRoles.Engineers) && repairsSuccess.length > 0) &&
                        <span className="bottom-menu__breaks-counter">{repairsSuccess.length}</span>
                    }
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