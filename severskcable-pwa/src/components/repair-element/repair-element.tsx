import {RepairElementType} from "../../types/types";
import classNames from "classnames";
import {RepairPriority} from "../../constants";

type RepairElementProps = {
    repair: RepairElementType
}

function RepairElement({repair}: RepairElementProps) {
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
        </article>
    );
}

export default RepairElement;