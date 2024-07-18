import {Link, useParams} from "react-router-dom";
import {useAppSelector} from "../../hooks";
import {AppRoutes} from "../../constants";
import BreakElement from "../../components/break-element/break-element";
import BottomMenu from "../../components/bottom-menu/bottom-menu";

function MachineBreaksPage() {
    const {machineId} = useParams();
    const machines = useAppSelector(state => state.machines);
    const currentMachine = machines.find(machine => machine.id === machineId);

    if (currentMachine) {
        const repairsCompleted = currentMachine.repairs.filter(repair => repair.status === true);
        const repairsInProgress = currentMachine.repairs.filter(repair => repair.status === false);

        return (
            <div className="machine-breaks-page">
                <h1 className="machine-breaks-page__title">{currentMachine.name}</h1>
                {currentMachine.repairs.length === 0 && <h3>Не было ремонтов</h3>}
                {repairsInProgress.length > 0 && <h3>Ожидают ремонта</h3>}
                {repairsInProgress.map(repair => <BreakElement repair={{machine: currentMachine.name, repair: repair}} />)}
                {repairsCompleted.length > 0 && <h3>Выполненные ремонты</h3>}
                {repairsCompleted.map(repair => <BreakElement repair={{machine: currentMachine.name, repair: repair}} />)}
                <BottomMenu />
            </div>
        );
    } else {
        return (
            <div className="machine-breaks-page">
                <h1 className="machine-breaks-page__title">Такого оборудования не существует</h1>
                <Link to={AppRoutes.Root}>На главную</Link>
                <BottomMenu />
            </div>
        );
    }
}

export default MachineBreaksPage;