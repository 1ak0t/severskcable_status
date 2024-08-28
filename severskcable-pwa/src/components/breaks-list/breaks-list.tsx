import {useAppSelector} from "../../hooks";
import {RepairElementType} from "../../types/types";
import BreakElement from "../break-element/break-element";
import {RepairStage} from "../../constants";

function BreaksList() {
    const {machines} = useAppSelector(state => state);
    const repairList: RepairElementType[] = [];
    machines.forEach(machine => {
        if (machine.repairs.length > 0) {
            machine.repairs.filter(repair => !repair.status).map(repair => repairList.push({machine: machine.name, machineStatus: machine.status, repair: repair}));
        }
    });

    repairList.sort(function (a,b) {
        if (a.repair.priority > b.repair.priority) {
            return 1;
        }
        if (a.repair.priority < b.repair.priority) {
            return -1;
        }
        return 0;
    });


    return (
        <section className="repair-list">
            {repairList.find(repair => repair.repair.stages === RepairStage.Register) &&
                <h2 className="repair-list__sub-title">Зарегистрированы</h2>
            }
            {repairList.filter(repair => repair.repair.stages === RepairStage.Register).map(repair => <BreakElement repair={repair} key={repair.repair.breakName}/>)}
            {repairList.find(repair => repair.repair.stages === RepairStage.RepairSuccess) &&
                <h2 className="repair-list__sub-title">Поломка подтверждена</h2>
            }
            {repairList.filter(repair => repair.repair.stages === RepairStage.RepairSuccess).map(repair => <BreakElement repair={repair} key={repair.repair.breakName}/>)}
            {repairList.find(repair => repair.repair.stages === RepairStage.Repairing) &&
                <h2 className="repair-list__sub-title">Ремонтируются</h2>
            }
            {repairList.filter(repair => repair.repair.stages === RepairStage.Repairing).map(repair => <BreakElement repair={repair} key={repair.repair.breakName}/>)}
            {repairList.find(repair => repair.repair.stages === RepairStage.RepairCompleted) &&
                <h2 className="repair-list__sub-title">Ремонт завершен</h2>
            }
            {repairList.filter(repair => repair.repair.stages === RepairStage.RepairCompleted).map(repair => <BreakElement repair={repair} key={repair.repair.breakName}/>)}
        </section>
    );
}

export default BreaksList;