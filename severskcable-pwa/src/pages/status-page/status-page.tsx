import './status-page.scss';
import BottomMenu from "../../components/bottom-menu/bottom-menu";
import Machine from "../../components/machine/machine";
import {MachinesStatus} from "../../constants";

function StatusPage () {
    return (
        <div className="status-page">
            <h1 className="status-page__title">Статусы оборудования</h1>
            <section className="status-page__machines">
                <Machine name={"МГВ"} status={MachinesStatus.Work}/>
                <Machine name={"МТВ"} status={MachinesStatus.Work}/>
                <Machine name={"КЭЛ 70/1"} status={MachinesStatus.NotUse}/>
                <Machine name={"КЭЛ 70/2"} status={MachinesStatus.Work}/>
                <Machine name={"КЭЛ 90"} status={MachinesStatus.Wrong} stopDuration={"02:37"}/>
                <Machine name={"БМ"} status={MachinesStatus.Work}/>
                <Machine name={"МСТ"} status={MachinesStatus.Work}/>
            </section>
            <BottomMenu />
        </div>
    );
}

export default StatusPage;