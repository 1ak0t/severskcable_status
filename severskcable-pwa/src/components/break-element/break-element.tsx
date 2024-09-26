import classNames from "classnames";
import {CommentType, MachinesStatus, RepairStage} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import {useState} from "react";
import {Break} from "../../types/initialState.type";
import dayjs from "dayjs";
import {fetchImage, getDurationString, handleImageUpload} from "../../helpers/helpers";
import {
    updateBreakStageAction,
    updateRepairCompletedImageAction,
    updateRepairingImageAction,
    updateSuccessImageAction
} from "../../store/api-actions";

type RepairElementProps = {
    repair: Break,
    agreement?: boolean,
}

function BreakElement({repair, agreement}: RepairElementProps) {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(state => state.user);
    const [successComment, setSuccessComment] = useState('');
    const [successImage, setSuccessImage] = useState<File>();
    const [successImageURL, setSuccessImageURL] = useState<string>();
    const [successImageVisible, setSuccessImageVisible] = useState<boolean>(false);
    const [registerImageURL, setRegisterImageURL] = useState<string>();
    const [registerImageVisible, setRegisterImageVisible] = useState<boolean>(false);
    const [repairingImage, setRepairingImage] = useState<File>();
    const [repairingImageURL, setRepairingImageURL] = useState<string>();
    const [repairingImageVisible, setRepairingImageVisible] = useState<boolean>(false);
    const [repairCompletedImage, setRepairCompletedImage] = useState<File>();
    const [repairCompletedImageURL, setRepairCompletedImageURL] = useState<string>();
    const [repairCompletedImageVisible, setRepairCompletedImageVisible] = useState<boolean>(false);
    const [repairingComment, setRepairingComment] = useState('');
    const [repairCompletedComment, setRepairCompletedComment] = useState('');
    const [repairEndComment, setRepairEndComment] = useState('');

    const onCommentChange = (com: any, type: CommentType) => {
        switch (type) {
            case CommentType.SuccessComment:
                setSuccessComment(com.target.value);
                break;
            case CommentType.RepairingComment:
                setRepairingComment(com.target.value);
                break;
            case CommentType.RepairCompletedComment:
                setRepairCompletedComment(com.target.value);
                break;
            case CommentType.RepairEndComment:
                setRepairEndComment(com.target.value);
                break;
        }
    };


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
            {repair.registerComment &&
                <div className="repair-element__row">
                    <span>Комментарий регистратора:</span>
                    <span>{repair.registerComment}</span>
                </div>
            }
            {repair.registerImage &&
                <div className="repair-element__row">
                    <span>Фото зарегистрировавшего:</span>
                    <span onClick={() => fetchImage(repair.registerImage, setRegisterImageURL, registerImageURL, setRegisterImageVisible, registerImageVisible)}>Показать</span>
                </div>
            }
            {registerImageURL && registerImageVisible && repair.registerImage &&
                <div className="repair-element__row">
                    <img src={registerImageURL} alt=""/>
                </div>
            }
            {(repair.stages === null || repair.stages === RepairStage.RepairSuccess || repair.stages === RepairStage.Repairing || repair.stages === RepairStage.RepairCompleted) &&
                <>
                    {repair.successPerson && <div className="repair-element__row">
                        <span>Согласовал:</span>
                        <span>{repair.successPerson?.name} {repair.successPerson?.surname}</span>
                    </div>}
                    {repair.successDate && <div className="repair-element__row">
                        <span>Дата согласования:</span>
                        <span>{dayjs(repair.successDate).format('H:mm DD-MM-YYYY')}</span>
                    </div>}
                    {repair.successComment &&
                        <div className="repair-element__row">
                            <span>Комментарий согласовавшего:</span>
                            <span>{repair.successComment}</span>
                        </div>
                    }
                    {repair.successImage &&
                        <div className="repair-element__row">
                            <span>Фото согласовавшего:</span>
                            <span onClick={() => fetchImage(repair.successImage, setSuccessImageURL, successImageURL, setSuccessImageVisible, successImageVisible)}>Показать</span>
                        </div>
                    }
                    {successImageURL && successImageVisible && repair.successImage &&
                        <div className="repair-element__row">
                            <img src={successImageURL} alt=""/>
                        </div>
                    }
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
                    {repair.repairingComment &&
                        <div className="repair-element__row">
                            <span>Комментарий ремонтирующего:</span>
                            <span>{repair.repairingComment}</span>
                        </div>
                    }
                    {repair.repairingImage &&
                        <div className="repair-element__row">
                            <span>Фото до ремонта:</span>
                            <span onClick={() => fetchImage(repair.repairingImage, setRepairingImageURL, repairingImageURL, setRepairingImageVisible, repairingImageVisible)}>Показать</span>
                        </div>
                    }
                    {repairingImageURL && repairingImageVisible && repair.repairingImage &&
                        <div className="repair-element__row">
                            <img src={repairingImageURL} alt=""/>
                        </div>
                    }
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
                        <span>{repair.repairCompletedComment}</span>
                    </div>
                    {repair.repairEndComment &&
                        <div className="repair-element__row">
                            <span>Комментарий завершившего:</span>
                            <span>{repair.repairEndComment}</span>
                        </div>
                    }
                    {repair.repairCompletedImage &&
                        <div className="repair-element__row">
                            <span>Фото до после:</span>
                            <span onClick={() => fetchImage(repair.repairCompletedImage, setRepairCompletedImageURL, repairCompletedImageURL, setRepairCompletedImageVisible, repairCompletedImageVisible)}>Показать</span>
                        </div>
                    }
                    {repairCompletedImageURL && repairCompletedImageVisible && repair.repairCompletedImage &&
                        <div className="repair-element__row">
                            <img src={repairCompletedImageURL} alt=""/>
                        </div>
                    }
                </>
            }
            {(agreement && repair.stages === RepairStage.Register) &&
                <div className="repair-element__button-wrapper">
                    <textarea onChange={(event) => onCommentChange(event, CommentType.SuccessComment)} cols={30}
                              rows={10} placeholder="Комментарий к согласованию"></textarea>
                    <input type="file" accept="image/png, image/jpeg" onChange={(evt) => handleImageUpload(evt, setSuccessImage)} />
                    {successImage && <img src={URL.createObjectURL(successImage)} alt=""/>}
                    <button className="repair-element__button repair-element__button--success"
                            onClick={() => {
                                dispatch(updateBreakStageAction({
                                    id: repair.id,
                                    machine: repair.machine.id,
                                    stages: RepairStage.RepairSuccess,
                                    successPerson: currentUser.id,
                                    successDate: dayjs().toString(),
                                    successComment: successComment,
                                }));
                                if (successImage) {
                                    dispatch(updateSuccessImageAction({file: successImage, id: repair.id}));
                                }
                            }}>Подтвердить
                    </button>
                    <button className="repair-element__button repair-element__button--reject"
                            onClick={() => {
                                dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: null, status: true, successPerson: currentUser.id, successDate: dayjs().toString(), successComment: successComment}))
                            }
                    }>Отклонить
                    </button>
                </div>
            }
            {(agreement && repair.stages === RepairStage.RepairSuccess) &&
                <div className="repair-element__button-wrapper">
                    <textarea onChange={(event) => onCommentChange(event, CommentType.RepairingComment)} cols={30}
                              rows={10} placeholder="Комментарий ремонту"></textarea>
                    <input type="file" accept="image/png, image/jpeg" onChange={(evt) => handleImageUpload(evt, setRepairingImage)} />
                    {repairingImage && <img src={URL.createObjectURL(repairingImage)} alt=""/>}
                    <button className="repair-element__button repair-element__button--success"
                            onClick={() => {
                                dispatch(updateBreakStageAction({
                                    id: repair.id,
                                    machine: repair.machine.id,
                                    stages: RepairStage.Repairing,
                                    repairingPerson: currentUser.id,
                                    repairingDate: dayjs().toString(),
                                    repairingComment: repairingComment
                                }));
                                if (repairingImage) {
                                    dispatch(updateRepairingImageAction({file: repairingImage, id: repair.id}));
                                }
                            }}>Начать ремонт
                    </button>
                </div>
            }
            {(agreement && repair.stages === RepairStage.Repairing) &&
                <div className="repair-element__button-wrapper">
                    <textarea onChange={(event) => onCommentChange(event, CommentType.RepairCompletedComment)} cols={30} rows={10} placeholder="Комментарий о проделанной работе (мин 20 символов)" required={true}></textarea>
                    <input type="file" accept="image/png, image/jpeg" onChange={(evt) => handleImageUpload(evt, setRepairCompletedImage)} />
                    {repairCompletedImage && <img src={URL.createObjectURL(repairCompletedImage)} alt=""/>}
                    <button disabled={repairCompletedComment.length < 20} className={classNames(
                        'repair-element__button repair-element__button--success',
                        {'repair-element__button--inactive': repairCompletedComment.length < 20}
                    )} onClick={() =>{
                        dispatch(updateBreakStageAction({id: repair.id, machine: repair.machine.id, stages: RepairStage.RepairCompleted, repairCompletedPerson: currentUser.id, repairCompletedDate: dayjs().toString(), repairCompletedComment: repairCompletedComment}));
                        if (repairCompletedImage) {
                            dispatch(updateRepairCompletedImageAction({file: repairCompletedImage, id: repair.id}));
                        }
                    }}>Завершить ремонт</button>
                </div>
            }
            {(agreement && repair.stages === RepairStage.RepairCompleted) &&
                <div className="repair-element__button-wrapper">
                    <textarea onChange={(event) => onCommentChange(event, CommentType.RepairEndComment)} cols={30}
                              rows={10} placeholder="Комментарий по завершению ремонта"></textarea>
                    <button className="repair-element__button repair-element__button--success"
                            onClick={() => dispatch(updateBreakStageAction({
                                id: repair.id,
                                machine: repair.machine.id,
                                stages: null,
                                status: true,
                                repairEndPerson: currentUser.id,
                                repairEndDate: dayjs().toString(),
                                repairEndComment: repairEndComment
                            }))}>Подтвердить
                    </button>
                    <button className="repair-element__button repair-element__button--reject"
                            onClick={() => dispatch(updateBreakStageAction({
                                id: repair.id,
                                machine: repair.machine.id,
                                stages: RepairStage.RepairSuccess,
                                repairingPerson: repair.repairingPerson?.id,
                                repairingDate: repair.repairingDate,
                                repairEndComment: repairEndComment
                            }))}>Отклонить
                    </button>
                </div>
            }
        </div>
    );
}

export default BreakElement;