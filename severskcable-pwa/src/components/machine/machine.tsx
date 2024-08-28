import {AppRoutes, MachinesStatus, RepairStage} from "../../constants";
import {Repair} from "../../types/initialState.type";
import dayjs from "dayjs";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {getDurationString} from "../../helpers/helpers";

type MachinePropsType = {
    name: string,
    status: string,
    currentRepairs?: Repair[],
    id: string
}

function Machine({name, status, currentRepairs, id} : MachinePropsType) {
    let duration = "";
    let repairStage: null | string = "Работает";
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
        repairStage = currentRepairsSorted[0].stages;
        duration = getDurationString(dayjs(currentRepairsSorted[0].registerDate), dayjs());
    }
    return(
        <Link to={machineBreaksUrl} className="machine">
            <span className={classNames(
                'machine__icon',
                {'machine__icon--warning': status === MachinesStatus.Warning},
                {'machine__icon--wrong': status === MachinesStatus.Wrong},
                {'machine__icon--inspection': status === MachinesStatus.Inspection}
            )}></span>
            <div className="machine__name-wrapper">
                <span className="machine__name">{name}</span>
                <span className="machine__status">{repairStage}</span>
            </div>
            {(!(repairStage === null) && !(repairStage === "Работает")) &&
                <div className="machine__progress-bar progress-bar">
                    <div className="progress-bar__time">{duration}</div>
                    <span className="progress-bar__dot progress-bar__dot--register"></span>
                    <span className={classNames(
                        "progress-bar__dot",
                        {"progress-bar__dot--repair-success": repairStage === (RepairStage.RepairSuccess) || (repairStage === RepairStage.Repairing) || (repairStage === RepairStage.RepairCompleted)}
                    )}></span>
                    <span className={classNames(
                        "progress-bar__dot",
                        {"progress-bar__dot--repairing": (repairStage === RepairStage.Repairing) || (repairStage === RepairStage.RepairCompleted)}
                    )}></span>
                    <span className={classNames(
                        "progress-bar__dot",
                        {"progress-bar__dot--repair-completed": repairStage === RepairStage.RepairCompleted}
                    )}></span>
                </div>
            }
        </Link>
    );
}

export default Machine;