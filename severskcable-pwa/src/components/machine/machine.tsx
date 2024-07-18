import {AppRoutes, MachinesStatus} from "../../constants";
import {Repair} from "../../types/initialState.type";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import classNames from "classnames";

type MachinePropsType = {
    name: string,
    status: string,
    currentRepairs?: Repair[],
    id: string
}

function Machine({name, status, currentRepairs, id} : MachinePropsType) {
    const currentTime = dayjs();
    let duration = "";
    const machineBreaksUrl = `${AppRoutes.MachineBreaks}/${id}`;

    if (currentRepairs) {
        const currentRepairsSorted = [...currentRepairs].sort(function (repairA, repairB) {
            if (repairA.status > repairB.status) {
                return 1;
            }
            if (repairA.status < repairB.status) {
                return -1;
            }
            return 0;
        })
        console.log(currentRepairs)
        console.log(currentRepairsSorted)
        const breakDate = dayjs(currentRepairsSorted[0].breakDate);
        const durationMinutes = currentTime.diff(breakDate, 'minute');
        duration = `${Math.floor(durationMinutes/60)}:${durationMinutes % 24}`;
    }
    return(
        <Link to={machineBreaksUrl} className={classNames(
            'machine',
            {'machine--not-use': status === MachinesStatus.NotUse},
            {'machine--wrong': status === MachinesStatus.Wrong}
        )}>
            <span className="machine__name">{name}</span>
            {currentRepairs && <span className="machine__status">{status}<br></br>{(`Длительность - ${duration}`)}</span>}
        </Link>
    );
}

export default Machine;