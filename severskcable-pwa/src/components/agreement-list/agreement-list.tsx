import {useAppSelector} from "../../hooks";
import BreakElement from "../break-element/break-element";
import {RepairStage, UserRoles} from "../../constants";
import {getUser} from "../../store/user-process/selectors";
import {getBreaks} from "../../store/data-process/selectors";
import {useEffect, useState} from "react";

function AgreementList() {
    const user = useAppSelector(getUser);
    const breaks = useAppSelector(getBreaks);
    const currentBreaks = breaks.filter(el => !el.status);
    const [delay, setDelay] = useState(true);

    function getITRAgreementList() {
        if (user.role.find(role => role === UserRoles.ITR) || user.role.find(role => role === UserRoles.CEO) || user.role.find(role => role === UserRoles.Admin)) {
            return (
                <>
                    {currentBreaks.find(repair => repair.stages === RepairStage.Register) &&
                        <h2 className="agreement-list__sub-title">Подтвердить поломку</h2>
                    }
                    {currentBreaks.filter(repair => repair.stages === RepairStage.Register).map(repair => <BreakElement repair={repair} agreement={true} key={repair.breakName}/>)}
                    {currentBreaks.find(repair => repair.stages === RepairStage.RepairCompleted) &&
                        <h2 className="agreement-list__sub-title">Принять ремонт</h2>
                    }
                    {currentBreaks.filter(repair => repair.stages === RepairStage.RepairCompleted).map(repair => <BreakElement repair={repair} agreement={true} key={repair.breakName}/>)}
                </>
            );
        }
    }

    function getEngineerAgreementList() {
        if (user.role.find(role => role === UserRoles.Engineers) || user.role.find(role => role === UserRoles.HeadEngineer)) {
            return (
                <>
                    {currentBreaks.find(repair => repair.stages === RepairStage.RepairSuccess) &&
                        <h2 className="agreement-list__sub-title">Приступить к ремонту</h2>
                    }
                    {currentBreaks.filter(repair => repair.stages === RepairStage.RepairSuccess).map(repair => <BreakElement repair={repair} agreement={true} key={repair.breakName}/>)}
                </>
            );
        }
    }

    function getHeadEngineerAgreementList() {
        if (user.role.find(role => role === UserRoles.HeadEngineer)) {
            return (
                <>
                    {currentBreaks.find(repair => repair.stages === RepairStage.Repairing) &&
                        <h2 className="agreement-list__sub-title">Подтвердить выполнение ремонта</h2>
                    }
                    {currentBreaks.filter(repair => repair.stages === RepairStage.Repairing).map(repair => <BreakElement repair={repair} agreement={true} key={repair.breakName}/>)}
                </>
            );
        }
    }


    return (
        <section className="agreement-list">
            {getITRAgreementList()}
            {getHeadEngineerAgreementList()}
            {getEngineerAgreementList()}
        </section>
    );

}

export default AgreementList;