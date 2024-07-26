import './status-page.scss';
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import Machine from "../../components/machine/machine";
import {Helmet} from "react-helmet-async";
import {useAppSelector} from "../../hooks";

function StatusPage () {
    const machines = useAppSelector(state => state.machines);
    const sortedMachines = [...machines].sort((machineA, machineB) => {
        if (machineA.repairs.find(repair => repair.status === false)) {
            return -1;
        }
        if (machineB.repairs.find(repair => repair.status === false)) {
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
                    if(machine.repairs.length > 0 && machine.repairs.find(repair => !repair.status)) {
                        return <Machine name={machine.name} status={machine.status} currentRepairs={machine.repairs} id={machine.id} key={machine.id}/>;
                    } else {
                        return <Machine name={machine.name} status={machine.status} id={machine.id} key={machine.id}/>;
                    }

                })}
            </section>
            <BottomMenu />
        </div>
    );
}

export default StatusPage;