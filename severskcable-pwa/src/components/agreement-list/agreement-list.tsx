import {useAppSelector} from "../../hooks";
import {RepairElementType} from "../../types/types";
import BreakElement from "../break-element/break-element";
import {RepairStage, UserRoles} from "../../constants";

function AgreementList() {
    const {machines, user} = useAppSelector(state => state);
    const repairList: RepairElementType[] = [];
    machines.forEach(machine => {
        if (machine.repairs.length > 0) {
            machine.repairs.filter(repair => !repair.status).map(repair => repairList.push({machine: machine.name, machineStatus: machine.status, repair: repair}));
        }
    });

    if ((user.role === UserRoles.ITR) || (user.role === UserRoles.CEO) || (user.role === UserRoles.Admin)) {
        return (
            <section className="agreement-list">
                {repairList.find(repair => repair.repair.stages === RepairStage.Register) &&
                    <h2 className="agreement-list__sub-title">Подтвердить поломку</h2>
                }
                {repairList.filter(repair => repair.repair.stages === RepairStage.Register).map(repair => <BreakElement repair={repair} agreement={true} key={repair.repair.breakName}/>)}
                {repairList.find(repair => repair.repair.stages === RepairStage.RepairCompleted) &&
                    <h2 className="agreement-list__sub-title">Принять ремонт</h2>
                }
                {repairList.filter(repair => repair.repair.stages === RepairStage.RepairCompleted).map(repair => <BreakElement repair={repair} agreement={true} key={repair.repair.breakName}/>)}
            </section>
        );
    }

    if ((user.role === UserRoles.HeadEngineer)) {
        return (
            <section className="repair-list">
                {repairList.find(repair => repair.repair.stages === RepairStage.Repairing) &&
                    <h2 className="agreement-list__sub-title">Подтвердить выполнение ремонта</h2>
                }
                {repairList.filter(repair => repair.repair.stages === RepairStage.Repairing).map(repair => <BreakElement repair={repair} agreement={true} key={repair.repair.breakName}/>)}
            </section>
        );
    }
    if ((user.role === UserRoles.Engineers)) {
        return (
            <section className="repair-list">
                {repairList.find(repair => repair.repair.stages === RepairStage.RepairSuccess) &&
                    <h2 className="agreement-list__sub-title">Приступить к ремонту</h2>
                }
                {repairList.filter(repair => repair.repair.stages === RepairStage.RepairSuccess).map(repair => <BreakElement repair={repair} agreement={true} key={repair.repair.breakName}/>)}
            </section>
        );
    }

    return (
        <></>
    );

}

export default AgreementList;