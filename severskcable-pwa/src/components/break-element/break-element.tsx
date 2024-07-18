import {RepairElementType} from "../../types/types";
import classNames from "classnames";
import {RepairPriority} from "../../constants";

type RepairElementProps = {
    repair: RepairElementType
}

function BreakElement({repair}: RepairElementProps) {

    return(
        <article className={classNames(
            'repair-element',
            {'repair-element--medium-priority': repair.repair.priority === RepairPriority.Medium},
            {'repair-element--low-priority': repair.repair.priority === RepairPriority.Low}
        )}>
            <h2 className="repair-element__title">{repair.machine}</h2>
            <span>Поломка:</span>
            <span>{repair.repair.breakName}</span>
            <span>Зарегистрировал:</span>
            <span>{repair.repair.operator}</span>
            <span>Дата:</span>
            <span>{repair.repair.breakDate}</span>
            {repair.repair.status &&
                <>
                    <span>Выполнил ремонт:</span>
                    <span>{repair.repair.executor}</span>
                    <span>Дата завершения ремонта:</span>
                    <span>{repair.repair.repairDate}</span>
                    <span>Длительность ремонта:</span>
                    <span>{repair.repair.repairDuration}</span>
                    <span>Что проделано:</span>
                    <span>{repair.repair.comment}</span>
                </>
            }
        </article>
    );
}

export default BreakElement;