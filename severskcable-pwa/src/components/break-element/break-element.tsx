import classNames from "classnames";
import {CommentType, MachinesStatus, RepairStage, UserRoles} from "../../constants";
import {useAppDispatch, useAppSelector} from "../../hooks";
import React, {useEffect, useState} from "react";
import {Break} from "../../types/initialState.type";
import dayjs from "dayjs";
import {getDurationString, handleImageUpload} from "../../helpers/helpers";
import {
    fetchImage,
    updateBreakStageAction,
    updateRepairCompletedImageAction,
    updateRepairingImageAction,
    updateSuccessImageAction
} from "../../store/api-actions";
import {getUser} from "../../store/user-process/selectors";
import {
    getChangedStageStatus,
    getChangingStageStatus,
    getPhotoDownloadingStatus,
    getSupplyOrders
} from "../../store/data-process/selectors";
import {SyncLoader} from "react-spinners";
import {FcHighPriority, FcOk} from "react-icons/fc";
import {setNullToChangesState} from "../../store/data-process/data-process";
import {increaseNotificationCount} from "../../store/user-process/user-process";
import {MdCreate} from "react-icons/md";
import Calendar from "react-calendar";
import {Value} from "../../types/types";

type RepairElementProps = {
    repair: Break,
    agreement?: boolean,
    setIsSupplyFormVisible?:  React.Dispatch<React.SetStateAction<boolean>>,
    setBreakToSupply?: React.Dispatch<React.SetStateAction<Break | undefined>>
}

function BreakElement({repair, agreement, setIsSupplyFormVisible, setBreakToSupply}: RepairElementProps) {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(getUser);
    const supplies = useAppSelector(getSupplyOrders);
    const currentSupplies = supplies.filter(order => order.break.id === repair.id);
    const photoDownloadingStatus = useAppSelector(getPhotoDownloadingStatus);
    const isChangedStage = useAppSelector(getChangedStageStatus);
    const isChangingStage = useAppSelector(getChangingStageStatus);
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
    const [isPhotoGet, setIsPhotoGet] = useState(false);
    const [isAgreementChange, setIsAgreementChange] = useState(true);
    const [isOpened, setIsOpened] = useState(false);
    const [isDateChange, setIsDateChange] = useState(false);
    const [newRegDate, setNewRegDate] = useState<Value>(dayjs(repair.registerDate).toDate());

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

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setNullToChangesState());
            setIsAgreementChange(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [isChangedStage]);

    const getMinDate = (breaks : Break) => {
        return dayjs(breaks.registerDate).add(-5, "days").toDate();
    }

    const getMaxDate = () => {
        return dayjs().toDate();
    }

    const calendarOnChange = async (value: Value) => {
        dispatch(updateBreakStageAction({
            id: repair.id,
            registerDate: dayjs(value?.toString()).toString()
        }))
        setIsDateChange(false);
        setNewRegDate(value);
    }

    return (
        <>
            <div className='repair-element'>
                {isChangingStage && isAgreementChange &&
                    <div className="repair-element__blur-wrapper">
                        <SyncLoader
                            color={"#EA753EFF"}
                            size={15}
                            margin={8}
                        />
                        <h3>Отправляем данные</h3>
                    </div>
                }
                {isChangedStage && isAgreementChange &&
                    <div className="repair-element__blur-wrapper">
                        <FcOk size={150}/>
                    </div>
                }
                {!isChangedStage && isChangedStage !== null && isAgreementChange &&
                    <div className="repair-element__blur-wrapper">
                        <FcHighPriority size={150}/>
                        <h3>Не удалось отправить, попробуйте еще раз</h3>
                    </div>
                }
                <div className={classNames(
                    'repair-element__header',
                    {'repair-element__header--work': !repair.status},
                    {'repair-element__header--wrong': repair.priority === 1},
                    {'repair-element__header--warning': repair.priority === 2},
                    {'repair-element__header--inspection': repair.priority === 3},
                    {'repair-element__header--stop': repair.priority === 4}
                )} onClick={() => {
                        setIsOpened(!isOpened);
                }}>
                    <div className='repair-element__machine-wrapper'>
                        <span className="repair-element__title">{repair.machine.name}</span>
                        <span className="repair-element__machine-status">{repair.machine.status}</span>
                    </div>
                    {repair.status === true &&
                        <div className="repair-element__header-complete-wrapper">
                            <span><b>Поломка: </b>{repair.breakName}</span>
                            <span><b>Длительность: </b>{getDurationString(dayjs(repair.registerDate), dayjs(repair.repairEndDate))}</span>
                            <span><b>Завершена: </b>{dayjs(repair.repairEndDate).format('DD-MM-YYYY')}</span>
                        </div>
                    }
                    {(!(repair.stages === null)) &&
                        <div className="repair-element__progress-bar progress-bar">
                            <div className="repair-element__header-time">{getDurationString(dayjs(repair.registerDate), dayjs())}</div>
                            <span className="progress-bar__dot progress-bar__dot--register"></span>
                            <span className={classNames(
                                "progress-bar__dot",
                                {"progress-bar__dot--repair-success": repair.stages === (RepairStage.RepairSuccess) || (repair.stages === RepairStage.Repairing) || (repair.stages === RepairStage.Supply) || (repair.stages === RepairStage.RepairCompleted)},
                                {"progress-bar__dot--repair-success": repair.stages === (RepairStage.RepairSuccess) || (repair.stages === RepairStage.Repairing) || (repair.stages === RepairStage.Supply) || (repair.stages === RepairStage.RepairCompleted)}
                            )}></span>
                            <span className={classNames(
                                "progress-bar__dot",
                                {"progress-bar__dot--repairing": (repair.stages === RepairStage.Repairing) || (repair.stages === RepairStage.Supply) || (repair.stages === RepairStage.RepairCompleted)}
                            )}></span>
                            <span className={classNames(
                                "progress-bar__dot",
                                {"progress-bar__dot--repair-completed": repair.stages === RepairStage.RepairCompleted}
                            )}></span>
                        </div>
                    }
                </div>
                {!isOpened && <div className={classNames(
                    "repair-element__short-discription",
                    {"repair-element__short-agr-discription": agreement}
                )}><b>Поломка:</b> {repair.breakName}</div>}
                <div className={classNames(
                    "repair-element__stages",
                    {"repair-element__stages__closed": isOpened === false},
                    {"repair-element__stages__opened": isOpened === true}
                )}>
                    <Calendar
                        className={classNames(
                            {"react-calendar--inactive": !isDateChange}
                        )}
                        minDate={getMinDate(repair)}
                        maxDate={getMaxDate()}
                        selectRange={false}
                        onChange={calendarOnChange}
                        value={newRegDate}
                    />
                    <div className="repair-element__stage">
                        <h3 className='repair-element__stage-title'>Регистрация</h3>
                        <span className='repair-element__stage-status repair-element__stage-status--comleted'>Этап завершен</span>
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
                            {((currentUser.role.find(role => role === UserRoles.ITR) || currentUser.role.find(role => role === UserRoles.CEO) || currentUser.role.find(role => role === UserRoles.Admin)) && repair.stages !== null && !isDateChange) &&
                                <MdCreate onClick={() => setIsDateChange(!isDateChange)} className="repair-element__change-date"></MdCreate>
                            }
                            <span>Дата регистрации:</span>
                            <span>{dayjs(newRegDate?.toString()).format('H:mm DD-MM-YYYY')}</span>
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
                                {!photoDownloadingStatus &&
                                    <span className="repair-element__photo-button" onClick={() => {
                                        setIsPhotoGet(true);
                                        dispatch(fetchImage({
                                            imageName: repair.registerImage,
                                            setImg: setRegisterImageURL,
                                            imgURL: registerImageURL,
                                            setImgVisible: setRegisterImageVisible,
                                            imgVisible: registerImageVisible
                                        }));
                                    }
                                    }>{registerImageVisible ? 'Скрыть' : 'Показать'}</span>}
                                {isPhotoGet && photoDownloadingStatus && !registerImageURL &&
                                    <SyncLoader
                                        color={"#EA753EFF"}
                                        size={5}
                                        margin={3}
                                    />
                                }
                            </div>
                        }
                        {registerImageURL && registerImageVisible && repair.registerImage &&
                            <div className="repair-element__row">
                                <img src={registerImageURL} alt=""/>
                            </div>
                        }
                    </div>
                    <div className="repair-element__timer">
                        <span>{!(repair.stages === null || repair.stages === RepairStage.RepairSuccess || repair.stages === RepairStage.Repairing || (repair.stages === RepairStage.Supply) || repair.stages === RepairStage.RepairCompleted) ? getDurationString(dayjs(repair.registerDate), dayjs()) : getDurationString(dayjs(repair.registerDate), dayjs(repair.successDate))}</span>
                    </div>
                    <div className="repair-element__stage">
                        <h3 className='repair-element__stage-title'>Согласование</h3>
                        {!(repair.stages === null || repair.stages === RepairStage.RepairSuccess || repair.stages === RepairStage.Repairing || (repair.stages === RepairStage.Supply) || repair.stages === RepairStage.RepairCompleted) &&
                            <span className='repair-element__stage-status repair-element__stage-status--not-start'>Ожидается согласования</span>}
                        {(repair.stages === null || repair.stages === RepairStage.RepairSuccess || repair.stages === RepairStage.Repairing || (repair.stages === RepairStage.Supply) || repair.stages === RepairStage.RepairCompleted) &&
                            <>
                                <span className='repair-element__stage-status repair-element__stage-status--comleted'>Этап завершен</span>
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
                                        {!photoDownloadingStatus &&
                                            <span className="repair-element__photo-button" onClick={() => {
                                                setIsPhotoGet(true);
                                                dispatch(fetchImage({
                                                    imageName: repair.successImage,
                                                    setImg: setSuccessImageURL,
                                                    imgURL: successImageURL,
                                                    setImgVisible: setSuccessImageVisible,
                                                    imgVisible: successImageVisible
                                                }));
                                            }
                                            }>{successImageVisible ? 'Скрыть' : 'Показать'}</span>}
                                        {isPhotoGet && photoDownloadingStatus && !successImageURL &&
                                            <SyncLoader
                                                color={"#EA753EFF"}
                                                size={5}
                                                margin={3}
                                            />
                                        }
                                    </div>
                                }
                                {successImageURL && successImageVisible && repair.successImage &&
                                    <div className="repair-element__row">
                                        <img src={successImageURL} alt=""/>
                                    </div>
                                }
                            </>
                        }
                    </div>
                    <div className="repair-element__timer">
                        {!(repair.stages === null || repair.stages === RepairStage.RepairSuccess || repair.stages === RepairStage.Repairing || (repair.stages === RepairStage.Supply) || repair.stages === RepairStage.RepairCompleted)
                            ? <span>Ожидание</span>
                            :
                            <span>{!(repair.stages === null || repair.status || repair.stages === RepairStage.Repairing || (repair.stages === RepairStage.Supply) || repair.stages === RepairStage.RepairCompleted) ? (getDurationString(dayjs(repair.successDate), dayjs())) : getDurationString(dayjs(repair.successDate), dayjs(repair.repairingDate))}</span>
                        }
                    </div>
                    <div className="repair-element__stage">
                        <h3 className='repair-element__stage-title'>Ремонт</h3>
                        {!(repair.stages === null || repair.status || repair.stages === RepairStage.Repairing || repair.stages === RepairStage.Supply || repair.stages === RepairStage.RepairCompleted) &&
                            <span className='repair-element__stage-status repair-element__stage-status--not-start'>Ожидает ремонта</span>}
                        {(repair.stages === RepairStage.Supply) &&
                            <span className='repair-element__stage-status repair-element__stage-status--not-start'>Ожидает снабжение</span>}
                        {(repair.stages === null || repair.status || repair.stages === RepairStage.Repairing || (repair.stages === RepairStage.Supply) || repair.stages === RepairStage.RepairCompleted) &&
                            <>
                                {(repair.stages === RepairStage.Repairing) &&
                                    <span
                                        className='repair-element__stage-status repair-element__stage-status--in-progress'>В процессе</span>}
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
                                        {!photoDownloadingStatus &&
                                            <span className="repair-element__photo-button" onClick={() => {
                                                setIsPhotoGet(true);
                                                dispatch(fetchImage({
                                                    imageName: repair.repairingImage,
                                                    setImg: setRepairingImageURL,
                                                    imgURL: repairingImageURL,
                                                    setImgVisible: setRepairingImageVisible,
                                                    imgVisible: repairingImageVisible
                                                }));
                                            }
                                            }>{repairingImageVisible ? 'Скрыть' : 'Показать'}</span>}
                                        {isPhotoGet && photoDownloadingStatus && !repairingImageURL &&
                                            <SyncLoader
                                                color={"#EA753EFF"}
                                                size={5}
                                                margin={3}
                                            />
                                        }
                                    </div>
                                }

                                {repairingImageURL && repairingImageVisible && repair.repairingImage &&
                                    <div className="repair-element__row">
                                        <img src={repairingImageURL} alt=""/>
                                    </div>
                                }
                                {currentSupplies.length > 0 &&
                                    <div className="repair-element__row repair-element__row--supply-list">
                                        <span>{repair.stages === RepairStage.Supply ? 'Ожидает снабжения' : 'Обеспечено:'}</span>
                                        {currentSupplies &&
                                            <ol>
                                                {currentSupplies.map(order => <li>{order.supplyTitle} ({order.supplyStatus})</li>)}
                                            </ol>
                                        }
                                    </div>
                                }
                            </>
                        }
                        {(repair.stages === null || repair.status || repair.stages === RepairStage.RepairCompleted) &&
                            <>
                            <span className='repair-element__stage-status repair-element__stage-status--comleted'>Этап завершен</span>
                                <div className="repair-element__row">
                                    <span>Завершил ремонт:</span>
                                    <span>{repair.repairCompletedPerson?.name} {repair.repairCompletedPerson?.surname}</span>
                                </div>
                                <div className="repair-element__row">
                                    <span>Дата завершения:</span>
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
                                        {!photoDownloadingStatus &&
                                            <span className="repair-element__photo-button" onClick={() => {
                                                setIsPhotoGet(true);
                                                dispatch(fetchImage({
                                                    imageName: repair.repairCompletedImage,
                                                    setImg: setRepairCompletedImageURL,
                                                    imgURL: repairCompletedImageURL,
                                                    setImgVisible: setRepairCompletedImageVisible,
                                                    imgVisible: repairCompletedImageVisible
                                                }));
                                            }
                                            }>{repairCompletedImageVisible ? 'Скрыть' : 'Показать'}</span>}
                                        {isPhotoGet && photoDownloadingStatus && !repairCompletedImageURL &&
                                            <SyncLoader
                                                color={"#EA753EFF"}
                                                size={5}
                                                margin={3}
                                            />
                                        }
                                    </div>
                                }
                                {repairCompletedImageURL && repairCompletedImageVisible && repair.repairCompletedImage &&
                                    <div className="repair-element__row">
                                        <img src={repairCompletedImageURL} alt=""/>
                                    </div>
                                }
                            </>
                        }
                    </div>
                    <div className="repair-element__timer">
                        {!(repair.stages === null || repair.status || repair.stages === RepairStage.RepairCompleted)
                            ? <span>Ожидание</span>
                            :
                            <span>{!(repair.stages === null) ? getDurationString(dayjs(repair.repairCompletedDate), dayjs()) : getDurationString(dayjs(repair.repairCompletedDate), dayjs(repair.repairEndDate))}</span>
                        }
                    </div>
                    <div className="repair-element__stage">
                        <h3 className='repair-element__stage-title'>Ремонт принят</h3>
                        {!(repair.stages === null) &&
                            <span className='repair-element__stage-status repair-element__stage-status--not-start'>Не подтвержден</span>}
                        {(repair.stages === null) &&
                            <>
                                <span className='repair-element__stage-status repair-element__stage-status--comleted'>Этап завершен</span>
                                {repair.repairEndPerson && <div className="repair-element__row">
                                    <span>Принял:</span>
                                    <span>{repair.repairEndPerson?.name} {repair.repairEndPerson?.surname}</span>
                                </div>}
                                {repair.repairEndDate && <div className="repair-element__row">
                                    <span>Дата согласования:</span>
                                    <span>{dayjs(repair.repairEndDate).format('H:mm DD-MM-YYYY')}</span>
                                </div>}
                                {repair.repairEndComment &&
                                    <div className="repair-element__row">
                                        <span>Комментарий:</span>
                                        <span>{repair.repairEndComment}</span>
                                    </div>
                                }
                            </>
                        }
                    </div>
                </div>
                {(agreement && repair.stages === RepairStage.Register) &&
                    <div className="repair-element__button-wrapper">
                            <textarea className="repair-element__textarea" onChange={(event) => onCommentChange(event, CommentType.SuccessComment)} cols={30}
                                      rows={3} placeholder="Комментарий к согласованию"></textarea>
                        <label className="repair-element__photo-input">
                            <span>Прикрепить фото</span>
                            <input type="file" accept="image/png, image/jpeg"
                                   onChange={(evt) => handleImageUpload(evt, setSuccessImage)}/>
                        </label>
                        {successImage && <img src={URL.createObjectURL(successImage)} alt=""/>}
                        <button className="repair-element__button repair-element__button--success"
                                onClick={() => {
                                    if (successImage) {
                                        dispatch(updateSuccessImageAction({
                                            file: successImage,
                                            id: repair.id
                                        })).then(() => {
                                            dispatch(updateBreakStageAction({
                                                id: repair.id,
                                                machine: repair.machine.id,
                                                stages: RepairStage.RepairSuccess,
                                                successPerson: currentUser.id,
                                                successDate: dayjs().toString(),
                                                successComment: successComment,
                                            }));
                                            setIsAgreementChange(true);
                                            dispatch(increaseNotificationCount());
                                        });
                                    } else {
                                        dispatch(updateBreakStageAction({
                                            id: repair.id,
                                            machine: repair.machine.id,
                                            stages: RepairStage.RepairSuccess,
                                            successPerson: currentUser.id,
                                            successDate: dayjs().toString(),
                                            successComment: successComment,
                                        }));
                                        setIsAgreementChange(true);
                                        dispatch(increaseNotificationCount());
                                    }
                                }}>Подтвердить
                        </button>
                        <button className="repair-element__button repair-element__button--reject"
                                onClick={() => {
                                    dispatch(updateBreakStageAction({
                                        id: repair.id,
                                        machine: repair.machine.id,
                                        stages: null,
                                        status: true,
                                        successPerson: currentUser.id,
                                        successDate: dayjs().toString(),
                                        successComment: successComment
                                    }));

                                    setIsAgreementChange(true);
                                    dispatch(increaseNotificationCount());
                                }
                                }>Отклонить
                        </button>
                    </div>
                }
                {(agreement && repair.stages === RepairStage.RepairSuccess) &&
                    <div className="repair-element__button-wrapper">
                            <textarea className="repair-element__textarea"
                                      onChange={(event) => onCommentChange(event, CommentType.RepairingComment)}
                                      cols={30}
                                      rows={3} placeholder="Комментарий ремонту"></textarea>
                        <label className="repair-element__photo-input">
                            <span>Прикрепить фото</span>
                            <input type="file" accept="image/png, image/jpeg"
                                   onChange={(evt) => handleImageUpload(evt, setRepairingImage)}/>
                        </label>
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

                                    setIsAgreementChange(true);
                                    dispatch(increaseNotificationCount());
                                }}>Начать ремонт
                        </button>
                    </div>
                }
                {((agreement && repair.stages === RepairStage.Repairing) || (agreement && repair.stages === RepairStage.Supply)) &&
                    <div className="repair-element__button-wrapper">
                        {((currentSupplies.length > 0) && repair.stages === RepairStage.Supply) &&
                            <div className="repair-element__row repair-element__row--supply-list">
                                <span>{repair.stages === RepairStage.Supply ? 'Ожидает снабжения' : 'Обеспечено:'}</span>
                                {currentSupplies &&
                                    <ol>
                                        {currentSupplies.map(order => <li>{order.supplyTitle} ({order.supplyStatus})</li>)}
                                    </ol>
                                }
                            </div>
                        }
                        {currentSupplies.length > 0 && <h3>Снабжение обеспечено</h3>}
                        <textarea className="repair-element__textarea"
                                  onChange={(event) => onCommentChange(event, CommentType.RepairCompletedComment)}
                                  cols={30}
                                  rows={3} placeholder="Комментарий о проделанной работе (мин 20 символов)"
                                  required={true}></textarea>
                        <button className="repair-element__button repair-element__button--supply"
                                onClick={() => {
                                    if (setIsSupplyFormVisible && setBreakToSupply) {
                                        setIsSupplyFormVisible(true);
                                        setBreakToSupply(repair);
                                    }
                                }}>{repair.stages === RepairStage.Supply ? 'Добавить к снабжению' : 'Запросить снабжение'}
                        </button>
                        {repair.stages !== RepairStage.Supply &&
                            <label className="repair-element__photo-input">
                            <span>Прикрепить фото</span>
                            <input type="file" accept="image/png, image/jpeg"
                                   onChange={(evt) => handleImageUpload(evt, setRepairCompletedImage)}/>
                        </label>}
                        {repairCompletedImage && repair.stages !== RepairStage.Supply && <img src={URL.createObjectURL(repairCompletedImage)} alt=""/>}
                        {repair.stages !== RepairStage.Supply && <button disabled={repairCompletedComment.length < 20} className={classNames(
                            'repair-element__button repair-element__button--success',
                            {'repair-element__button--inactive': repairCompletedComment.length < 20}
                        )} onClick={() => {
                            dispatch(updateBreakStageAction({
                                id: repair.id,
                                machine: repair.machine.id,
                                stages: RepairStage.RepairCompleted,
                                repairCompletedPerson: currentUser.id,
                                repairCompletedDate: dayjs().toString(),
                                repairCompletedComment: repairCompletedComment
                            }));
                            if (repairCompletedImage) {
                                dispatch(updateRepairCompletedImageAction({
                                    file: repairCompletedImage,
                                    id: repair.id
                                }));
                            }

                            setIsAgreementChange(true);
                            dispatch(increaseNotificationCount());
                        }}>Завершить ремонт
                        </button>}
                    </div>
                }
                {(agreement && repair.stages === RepairStage.RepairCompleted) &&
                    <div className="repair-element__button-wrapper">
                            <textarea className="repair-element__textarea"
                                      onChange={(event) => onCommentChange(event, CommentType.RepairEndComment)}
                                      cols={30}
                                      rows={3} placeholder="Комментарий по завершению ремонта"></textarea>
                        <button className="repair-element__button repair-element__button--success"
                                onClick={() => {
                                    dispatch(updateBreakStageAction({
                                        id: repair.id,
                                        machine: repair.machine.id,
                                        stages: null,
                                        status: true,
                                        repairEndPerson: currentUser.id,
                                    repairEndDate: dayjs().toString(),
                                    repairEndComment: repairEndComment
                                }));

                                    setIsAgreementChange(true);
                                    dispatch(increaseNotificationCount());
                                }}>Подтвердить
                        </button>
                        <button className="repair-element__button repair-element__button--reject"
                                onClick={() => {
                                    dispatch(updateBreakStageAction({
                                    id: repair.id,
                                    machine: repair.machine.id,
                                    stages: RepairStage.RepairSuccess,
                                    repairingPerson: repair.repairingPerson?.id,
                                    repairingDate: repair.repairingDate,
                                    repairEndComment: repairEndComment
                                }));

                                    setIsAgreementChange(true);
                                    dispatch(increaseNotificationCount());
                                }}>Отклонить
                        </button>
                    </div>
                }
            </div>
        </>
);
}

export default BreakElement;