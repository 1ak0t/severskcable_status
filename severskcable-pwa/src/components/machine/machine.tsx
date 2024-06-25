import {MachinesStatus} from "../../constants";

type MachinePropsType = {
    name: string,
    status: string,
    stopDuration?: string;
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

function Machine({name, status, stopDuration} : MachinePropsType) {
    return(
        <article className={setMachineStatusClass(status)}>
            <span className="machine__name">{name}</span>
            <span className="machine__status">{status}<br></br>{stopDuration ? (`Длительность - ${stopDuration}`) : ""}</span>
        </article>
    );
}

export default Machine;