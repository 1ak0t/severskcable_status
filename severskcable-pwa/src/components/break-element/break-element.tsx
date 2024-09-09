import classNames from "classnames";
import {MachinesStatus, RepairStage} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {deleteRepair, setRepair} from "../../store/actions";
import {useState} from "react";
import {Break} from "../../types/initialState.type";
import dayjs from "dayjs";
import {getDurationString} from "../../helpers/helpers";
import {RepairCompletedType} from "../../types/types";
import {deleteBreakAction, updateBreakStageAction} from "../../store/api-actions";

type RepairElementProps = {
    repair: Break,
    agreement?: boolean,
}

function BreakElement({repair, agreement}: RepairElementProps) {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(state => state.user);
    const [comment, setComment] = useState('');

    const onCommentChange = (com: any) => {
        setComment(com.target.value);
    };

    const onSubmitHeadEngineer = () => {
        const newRepair: RepairCompletedType = {
            id: repair.id,
            repairCompletedPerson: currentUser,
            repairCompletedDate: dayjs().toString(),
            comment: comment,
            stages: RepairStage.RepairCompleted,
            machine: repair.machine
        }

        dispatch(setRepair(newRepair));
        dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: RepairStage.RepairCompleted, repairCompletedPerson: currentUser.id, repairCompletedDate: dayjs().toString(), comment: comment}));
    }

    return(
        <div className={classNames(
            'repair-element',
            {'repair-element--medium-priority': repair.machine.status === MachinesStatus.Warning},
            {'repair-element--low-priority': repair.machine.status === MachinesStatus.Inspection}
        )}>
            <h2 className="repair-element__title">{repair.machine.name}</h2>
            <div className="repair-element__row">
                <span>Поломка:</span>
                <span>{repair.breakName}</span>
            </div>
            {repair.stages &&
                <div className="repair-element__row">
                    <span>Этап ремонта:</span>
                    <span>{repair.stages}</span>
                </div>
            }
            <div className="repair-element__row">
                <span>Зарегистрировал:</span>
                <span>{repair.registerPerson.name} {repair.registerPerson.surname}</span>
            </div>
            <div className="repair-element__row">
                <span>Дата регистрации:</span>
                <span>{dayjs(repair.registerDate).format('H:mm DD-MM-YYYY')}</span>
            </div>
            {(repair.stages === null || repair.stages === RepairStage.RepairSuccess || repair.stages === RepairStage.Repairing || repair.stages === RepairStage.RepairCompleted) &&
                <>
                    <div className="repair-element__row">
                        <span>Согласовал:</span>
                        <span>{repair.successPerson?.name} {repair.successPerson?.surname}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Дата согласования:</span>
                        <span>{dayjs(repair.successDate).format('H:mm DD-MM-YYYY')}</span>
                    </div>
                </>
            }
            {(repair.stages === null || repair.status || repair.stages === RepairStage.Repairing || repair.stages === RepairStage.RepairCompleted) &&
                <>
                    <div className="repair-element__row">
                        <span>Приступил к ремонту:</span>
                        <span>{repair.repairingPerson?.name} {repair.repairingPerson?.surname}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Дата начала ремонта:</span>
                        <span>{dayjs(repair.repairingDate).format('H:mm DD-MM-YYYY')}</span>
                    </div>
                </>
            }
            {(repair.stages === null ||repair.status || repair.stages === RepairStage.RepairCompleted) &&
                <>
                    <div className="repair-element__row">
                        <span>Выполнил ремонт:</span>
                        <span>{repair.repairCompletedPerson?.name} {repair.repairingPerson?.surname}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Дата завершения ремонта:</span>
                        <span>{dayjs(repair.repairCompletedDate).format('H:mm DD-MM-YYYY')}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Длительность ремонта:</span>
                        <span>{getDurationString(dayjs(repair.repairingDate), dayjs(repair.repairCompletedDate))}</span>
                    </div>
                    <div className="repair-element__row">
                        <span>Что проделано:</span>
                        <span>{repair.comment}</span>
                    </div>
                </>
            }
            {(agreement && repair.stages === RepairStage.Register) &&
                <div className="repair-element__button-wrapper">
                <button className="repair-element__button repair-element__button--success" onClick={() => dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: RepairStage.RepairSuccess, successPerson: currentUser.id, successDate: dayjs().toString()}))}>Подтвердить</button>
                    <button className="repair-element__button repair-element__button--reject" onClick={() => dispatch(deleteBreakAction(repair.id))}>Отклонить</button>
                </div>
            }
            {(agreement && repair.stages === RepairStage.RepairSuccess) &&
                <div className="repair-element__button-wrapper">
                    <button className="repair-element__button repair-element__button--success" onClick={() => dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: RepairStage.Repairing, repairingPerson: currentUser.id, repairingDate: dayjs().toString()}))}>Начать ремонт</button>
                </div>
            }
            {(agreement && repair.stages === RepairStage.Repairing) &&
                <div className="repair-element__button-wrapper">
                    <textarea onChange={onCommentChange} cols={30} rows={10} placeholder="Комментарий о проделанной работе (мин 20 символов)" required={true}></textarea>
                    <button disabled={comment.length < 20} className={classNames(
                        'repair-element__button repair-element__button--success',
                        {'repair-element__button--inactive': comment.length < 20}
                    )} onClick={onSubmitHeadEngineer}>Завершить ремонт</button>
                </div>
            }
            {(agreement && repair.stages === RepairStage.RepairCompleted) &&
                <div className="repair-element__button-wrapper">
                    <button className="repair-element__button repair-element__button--success" onClick={() => dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: null, status: true, repairEndPerson: currentUser.id, repairEndDate: dayjs().toString()}))}>Подтвердить</button>
                    <button className="repair-element__button repair-element__button--reject" onClick={() => dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: RepairStage.RepairSuccess, repairingPerson: repair.repairingPerson?.id, repairingDate: repair.repairingDate}))}>Отклонить</button>
                </div>
            }
        </div>
    );
}

export default BreakElement;