import {useAppSelector} from "../../hooks";
import {RepairElementType} from "../../types/types";
import BreakElement from "../break-element/break-element";

function RepairsList() {
    const {machines} = useAppSelector(state => state);
    const repairList: RepairElementType[] = [];
    machines.map(machine => {
        if (machine.repairs.length > 0) {
            machine.repairs.map(repair => repairList.push({machine: machine.name, repair: repair}));
        }
        return true;
    });
    console.log(repairList);

    return (
        <section className="repair-list">
            {repairList.map(repair => {
                return <BreakElement repair={repair} key={repair.repair.breakName}/>;
            })}
        </section>
    );
}

export default RepairsList;