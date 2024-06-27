import {MachinesStatus} from "../../constants";
import {Repair} from "../../types/initialState.type";
import dayjs from "dayjs";

type MachinePropsType = {
    name: string,
    status: string,
    currentRepairDuration?: Repair;
}

const setMachineStatusClass = (status: string) => {
    if (status === MachinesStatus.NotUse) {
        return "machine machine--not-use";
    }
    if (status === MachinesStatus.Wrong) {
        return "machine machine--wrong";
    }
    return "machine";
}

function Machine({name, status, currentRepairDuration} : MachinePropsType) {
    const currentTime = dayjs();
    let duration = "";

    if (currentRepairDuration !== undefined) {
        const breakDate = dayjs(currentRepairDuration.breakDate);
        const durationMinutes = currentTime.diff(breakDate, 'minute');
        duration = `${Math.floor(durationMinutes/60)}:${durationMinutes % 24}`;
    }
    return(
        <article className={setMachineStatusClass(status)}>
            <span className="machine__name">{name}</span>
            {currentRepairDuration !== undefined && <span className="machine__status">{status}<br></br>{(`Длительность - ${duration}`)}</span>}
        </article>
    );
}

export default Machine;