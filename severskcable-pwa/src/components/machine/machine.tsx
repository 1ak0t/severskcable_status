import {AppRoutes, MachinesStatus, RepairStage} from "../../constants";
import {Break} from "../../types/initialState.type";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {getDurationString} from "../../helpers/helpers";

type MachinePropsType = {
    name: string,
    status: string,
    currentRepairs?: Break[],
    id: string
}

function Machine({name, status, currentRepairs, id} : MachinePropsType) {
    let duration = "";
    let repairStage: null | string = "Работает";
    const machineBreaksUrl = `${AppRoutes.MachineBreaks}/${id}`;
    const activeBreaks = currentRepairs?.filter(repair => repair.status === false);

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
        repairStage = currentRepairsSorted[0].stages;
        duration = getDurationString(dayjs(currentRepairsSorted[0].registerDate), dayjs());
    }
    return(
        <Link to={machineBreaksUrl} className={classNames(
            'machine',
            {'machine--warning': status === MachinesStatus.Warning},
            {'machine--wrong': status === MachinesStatus.Wrong},
            {'machine--inspection': status === MachinesStatus.Inspection}
        )}>
            <div className="machine__name-wrapper">
                <span className="machine__name">{name}</span>
                <span className="machine__status">{status}</span>
            </div>
            {(activeBreaks && activeBreaks.length > 0) &&
                <span className="machine__active-break-counter">{activeBreaks.length}</span>
            }
        </Link>
    );
}

export default Machine;