import {useAppSelector} from "../../hooks";
import {RepairElementType} from "../../types/types";
import RepairElement from "../repair-element/repair-element";

function RepairsList() {
    const {machines} = useAppSelector(state => state);
    const repairList: RepairElementType[] = [];
    machines.map(machine => {
        if (machine.repairs.length > 0) {
            machine.repairs.map(repair => repairList.push({machine: machine.name, repair: repair}));
        }
    });
    console.log(repairList);

    return (
        <section className="repair-list">
            {repairList.map(repair => <RepairElement repair={repair} key={repair.repair.breakName}/>)}
        </section>
    );
}

export default RepairsList;