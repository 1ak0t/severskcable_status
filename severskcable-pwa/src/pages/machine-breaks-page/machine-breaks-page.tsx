import {Link, useParams} from "react-router-dom";
import {useAppSelector} from "../../hooks";
import {AppRoutes} from "../../constants";
import BreakElement from "../../components/break-element/break-element";
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import {getBreaks, getMachines} from "../../store/data-process/selectors";

function MachineBreaksPage() {
    const {machineId} = useParams();
    const machines = useAppSelector(getMachines);
    const breaks = useAppSelector(getBreaks);
    const currentMachine = machines.find(machine => machine.id === machineId);

    if (currentMachine) {
        const currentMachineBreaks = breaks.filter(el => el.machine.id === currentMachine.id);
        const breaksCompleted = currentMachineBreaks.filter(el => el.status);
        const breaksInProgress = currentMachineBreaks.filter(el => !el.status);

        return (
            <div className="machine-breaks-page">
                <h1 className="machine-breaks-page__title">{currentMachine.name}</h1>
                {currentMachineBreaks.length === 0 && <h3>Не было ремонтов</h3>}
                {breaksInProgress.length > 0 && <h3>Ожидают ремонта</h3>}
                {breaksInProgress.map(el => <BreakElement repair={el} key={el.id}/>)}
                {breaksCompleted.length > 0 && <h3>Выполненные ремонты</h3>}
                {breaksCompleted.map(el => <BreakElement repair={el} key={el.id}/>)}
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