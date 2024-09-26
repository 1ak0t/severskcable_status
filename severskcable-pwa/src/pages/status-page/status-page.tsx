import './status-page.scss';
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import Machine from "../../components/machine/machine";
import {Helmet} from "react-helmet-async";
import {useAppSelector} from "../../hooks";
import {AppRoutes, MachinesStatus} from "../../constants";
import {Link} from "react-router-dom";

function StatusPage () {
    const machines = useAppSelector(state => state.machines);
    const breaks = useAppSelector(state => state.breaks);
    const sortedMachines = [...machines].sort((machineA, machineB) => {
        if (machineA.status === MachinesStatus.Inspection) {
            return -1;
        }
        if (machineB.status === MachinesStatus.Work) {
            return 1;
        }
        return 0;
    }).sort((machineA, machineB) => {
        if (machineA.status === MachinesStatus.Warning) {
            return -1;
        }
        if (machineB.status === MachinesStatus.Inspection) {
            return 1;
        }
        return 0;
    }).sort((machineA, machineB) => {
        if (machineA.status === MachinesStatus.Wrong) {
            return -1;
        }
        if (machineB.status === MachinesStatus.Warning) {
            return 1;
        }
        return 0;
    });

    return (
        <div className="status-page">
            <Helmet>
                <title>Статусы оборудования</title>
            </Helmet>
            <h1 className="status-page__title">Статусы оборудования</h1>
            <section className="status-page__machines">
                {sortedMachines.map(machine => {
                    const breaksByMachine = breaks.filter(el => el.machine.id === machine.id);
                    if(breaksByMachine.length > 0 && breaksByMachine.find(el => !el.status)) {
                        return <Machine name={machine.name} status={machine.status} currentRepairs={breaksByMachine} id={machine.id} key={machine.id}/>;
                    } else {
                        return <Machine name={machine.name} status={machine.status} id={machine.id} key={machine.id}/>;
                    }

                })}
            </section>
            <Link to={AppRoutes.BreakRegistration} className="status-page__add-break-button"></Link>
            <BottomMenu />
        </div>
    );
}

export default StatusPage;