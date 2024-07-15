import './status-page.scss';
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import Machine from "../../components/machine/machine";
import {Helmet} from "react-helmet-async";
import {useAppSelector} from "../../hooks";

function StatusPage () {
    const machines = useAppSelector(state => state.machines);

    return (
        <div className="status-page">
            <Helmet>
                <title>Статусы оборудования</title>
            </Helmet>
            <h1 className="status-page__title">Статусы оборудования</h1>
            <section className="status-page__machines">
                {machines.map(machine => {
                    if(machine.currentRepairId) {
                        const currentRepair = machine.repairs.find(repair => repair.id === machine.currentRepairId);
                        return <Machine name={machine.name} status={machine.status} currentRepairDuration={currentRepair}/>;
                    } else {
                        return <Machine name={machine.name} status={machine.status}/>;
                    }

                })}
            </section>
            <BottomMenu />
        </div>
    );
}

export default StatusPage;