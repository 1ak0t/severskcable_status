import {useAppSelector} from "../../hooks";
import {RepairElementType} from "../../types/types";
import BreakElement from "../break-element/break-element";

function BreaksList() {
    const {machines} = useAppSelector(state => state);
    const repairList: RepairElementType[] = [];
    machines.map(machine => {
        if (machine.repairs.length > 0) {
            machine.repairs.filter(repair => repair.status === true).map(repair => repairList.push({machine: machine.name, repair: repair}));
            return true;
        }
        return true;
    });

    return (
        <section className="repair-list">
            {repairList
            .sort(function (a,b) {
                if (a.repair.priority > b.repair.priority) {
                    return 1;
                }
                if (a.repair.priority < b.repair.priority) {
                    return -1;
                }
                return 0;
            })
                .map(repair => <BreakElement repair={repair} key={repair.repair.breakName}/>)}
        </section>
    );
}

export default BreaksList;