import {useAppDispatch, useAppSelector} from "../../hooks";
import {NewBreakType, OptionTypes} from "../../types/types";
import Select from "react-select";
import {useEffect, useState} from "react";
import {Priority, RepairStage, StopedTypes, UserRoles} from "../../constants";
import CreatableSelect from "react-select/creatable";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {getPriorityNumber, handleImageUpload} from "../../helpers/helpers";
import {MachineType, UserType} from "../../types/initialState.type";
import {createNewBreakAction, createNewBreakTypeAction} from "../../store/api-actions";
import {
    getBreakCreatedStatus,
    getBreakCreatingStatus,
    getBreaksTypesByMachine,
    getMachines,
    getUsers
} from "../../store/data-process/selectors";
import {getUser} from "../../store/user-process/selectors";
import SendingStatusPage from "../sending-status-page/sending-status-page";
import {increaseNotificationCount} from "../../store/user-process/user-process";

function BreakForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const machines = useAppSelector(getMachines);
    const user = useAppSelector(getUser);
    const users = useAppSelector(getUsers);
    const breaksTypesByMachine = useAppSelector(getBreaksTypesByMachine);
    const isCreatingBreak = useAppSelector(getBreakCreatingStatus);
    const isCreatedBreak = useAppSelector(getBreakCreatedStatus);
    const [currentMachine, setCurrentMachine] = useState<null | MachineType>(null);
    const [isMachineSelected, setIsMachineSelected] = useState(true);
    const [isOpenMachineList, setIsOpenMachineList] = useState(true);
    const [currentRepair, setCurrentRepair] = useState('');
    const [isRepairSelected, setIsRepairSelected] = useState(true);
    const [repairList, setRepairList] = useState<OptionTypes[]>([]);
    const [isOpenRepairList, setIsOpenRepairList] = useState(false);
    const [currentPriority, setCurrentPriority] = useState('');
    const [priorityList, setPriorityList] = useState<OptionTypes[]>([]);
    const [isOpenPriorityList, setIsOpenPriorityList] = useState(false);
    const [registerImage, setRegisterImage] = useState<File>();
    const [currentUser, setCurrentUser] = useState<UserType>(user);
    const [isUserSelected, setIsUserSelected] = useState(false);
    const [isStoped, setIsStoped] = useState(false);
    let machineList: OptionTypes[] = [];
    machines.map(machine => machineList.push({label: machine.name, value: machine.name}));

    let usersList: OptionTypes[] = [];
    users.filter(user => user.role.includes(UserRoles.Operator)).map(user => usersList.push({label: `${user.surname} ${user.name}`, value: `${user.surname} ${user.name}`}));

    useEffect(() => {
        if (user.email === "slesarka@severskcable.ru") {
            setIsUserSelected(true);
        }
    }, [user]);

    const getMachineValue = () => {
        return currentMachine ? machineList.find(machine => machine.value === currentMachine.name) : '';
    }

    const getUserValue = () => {
        return currentUser ? usersList.find(user => user.value === currentUser.name) : '';
    }

    const getRepairValue = () => {
        return currentRepair ? repairList.find(repair => repair.value === currentRepair) : '';
    }

    const getPriorityValue = () => {
        if (currentPriority && isStoped) {
            return {label: "Простой", value: "Простой"};
        }
        if (currentPriority) {
            return priorityList.find(priority => priority.value === currentPriority)
        } else {
           return '';
        }
    }

    const onChangeMachine = (newValue: any) => {
        const machine = machines.find(machine => machine.name === newValue.value);
        if (machine){
            setCurrentMachine(machine);
        }
        setCurrentRepair('');
        setCurrentPriority('');
        setIsOpenRepairList(false);
        setIsOpenPriorityList(false);
        setIsMachineSelected(true);
        setIsRepairSelected(true);
        const findMachine = machines.find(machine => machine.name === newValue.value);
        if (findMachine) {
            const list: OptionTypes[] = [];
            if (isStoped) {
                setRepairList(list);
            } else {
                breaksTypesByMachine.filter(type => type.machine.id === findMachine.id).map(type => list.push({value: type.description, label: type.description}));
                setRepairList(list);
            }
            setIsMachineSelected(false);
            if (list.length > 0) {
                setIsOpenRepairList(true);
            }
        }
    }

    const onStopedChange = () => {
        setIsStoped(!isStoped);
        const list: OptionTypes[] = [];
        setRepairList([]);
        if (!isStoped) {
            StopedTypes.map(type => list.push({value: type, label: type}))
            setRepairList(list);
        } else {
            const findMachine = machines.find(machine => machine.name === currentMachine?.name);
            if (findMachine) {
                const list: OptionTypes[] = [];
                breaksTypesByMachine.filter(type => type.machine.id === findMachine.id).map(type => list.push({value: type.description, label: type.description}));
                setRepairList(list);
                setIsMachineSelected(false);
                if (list.length > 0) {
                    setIsOpenRepairList(true);
                }
            }
        }
    }

    const onChangeUser = (newValue: any) => {
        const user = users.find(user => `${user.surname} ${user.name}` === newValue.value);
        if (user){
            setCurrentUser(user);
        }
        setCurrentRepair('');
        setCurrentPriority('');
        setCurrentMachine(null);
        setIsOpenRepairList(false);
        setIsOpenPriorityList(false);
        setIsMachineSelected(true);
        setIsRepairSelected(true);
        setIsUserSelected(false);
    }

    const onRepairChange = (newValue: any) => {
        setCurrentRepair(newValue.value);
        setCurrentPriority('');
        setIsOpenRepairList(false);
        setIsRepairSelected(false);
        const list: OptionTypes[] = [];
        if (isStoped) {
            setIsOpenPriorityList(true);
            list.push({label: "Простой", value: "Простой"});
            setPriorityList(list);
            //setIsRepairSelected(true)
        } else {
            setIsOpenPriorityList(true);
            Priority.map(el => list.push({label: el, value: el}));
            setPriorityList(list);
        }

    }

    const onRepairListFocus = () => {
        setIsOpenRepairList(true);
        setCurrentRepair('');
    }

    const onPriorityListFocus = () => {
        setIsOpenPriorityList(true);
        setCurrentPriority('');
    }

    const onPriorityChange = (newValue: any) => {
        setCurrentPriority(newValue.value);
        setIsOpenPriorityList(false);
    }

    const onCreateRepair = (newRepair: string) => {
        const newList = repairList;
        newList.push({value: newRepair, label: newRepair});
        setRepairList(newList);
        setIsOpenRepairList(false);
        setCurrentRepair(newRepair);
        const list: OptionTypes[] = [];
        Priority.map(el => list.push({label: el, value: el}));
        setPriorityList(list);
        setIsRepairSelected(false);
        setIsOpenPriorityList(true);
    }

    const onBreakSubmit = () => {
        if (currentMachine) {
            let data: NewBreakType = {
                machine: currentMachine.id,
                breakName: currentRepair,
                priority: getPriorityNumber(currentPriority),
                registerPerson: currentUser.id,
                registerDate: dayjs().toString(),
                status: false,
                stages: RepairStage.Register
            }

            if (registerImage) {
                data = {...data, registerImage: registerImage};
            }

            if (breaksTypesByMachine.findIndex(type => type.description === currentRepair) === -1) {
                dispatch(createNewBreakTypeAction({machine: currentMachine.id, description: currentRepair}));
            }

            dispatch(createNewBreakAction(data));
            dispatch(increaseNotificationCount())
        }
    };

    if (isCreatingBreak || isCreatedBreak !== null) {
        return (
            <SendingStatusPage />
        );
    }

    return(
        <>
            <div className="break-form">
                {(user.email === "slesarka@severskcable.ru") && <label>Выберите сотрудника</label>}
                {(user.email === "slesarka@severskcable.ru") &&
                    <Select
                        options={usersList}
                        placeholder={'Выбрать'}
                        onChange={onChangeUser}
                        value={getUserValue()}
                        required={true}
                        noOptionsMessage={() => 'Нет вариантов'}

                    />
                }
                <label>Выберите оборудование</label>
                <Select
                    isDisabled={isUserSelected}
                    options={machineList}
                    placeholder={'Выбрать'}
                    onChange={onChangeMachine}
                    value={getMachineValue()}
                    required={true}
                    noOptionsMessage={() => 'Нет вариантов'}

                />
                <>
                    <input type="checkbox" name="stop" id="stop" onChange={() => onStopedChange()}/>
                    <label htmlFor="stop">Простой</label>
                </>
                <label>Выберите тип поломки или добавьте свой вариант</label>
                <CreatableSelect
                    isDisabled={isMachineSelected}
                    placeholder={'Выбрать или добавить'}
                    options={repairList}
                    value={getRepairValue()}
                    onChange={onRepairChange}
                    menuIsOpen={isOpenRepairList}
                    required={true}
                    onCreateOption={onCreateRepair}
                    onFocus={onRepairListFocus}
                    noOptionsMessage={() => 'Нет вариантов'}
                    formatCreateLabel={(userInput) => `Добавить: ${userInput}`}
                />
                <label>Укажите приоритет</label>
                <Select
                    isDisabled={isRepairSelected}
                    placeholder={'Выбрать'}
                    options={priorityList}
                    value={getPriorityValue()}
                    onChange={onPriorityChange}
                    menuIsOpen={isOpenPriorityList}
                    required={true}
                    noOptionsMessage={() => 'Нет вариантов'}
                    onFocus={onPriorityListFocus}
                />
                <label className="repair-element__photo-input">
                    <span>Прикрепить фото</span>
                    <input type="file" accept="image/png, image/jpeg"
                           onChange={(evt) => handleImageUpload(evt, setRegisterImage)}/>
                    {registerImage && <img src={URL.createObjectURL(registerImage)} alt=""/>}
                </label>
                <button className="break-form__submit" type="submit" onClick={onBreakSubmit}>Отправить</button>
            </div>
            <div className="break-form__result">
                <span>Кем зарегистрирован:</span>
                <span className="break-form__data">{currentUser.surname} {currentUser.name}</span>
            </div>
            <div className="break-form__result">
                <span>Дата:</span>
                <span className="break-form__data">{dayjs().format("DD.MM.YYYY HH:mm").toString()}</span>
            </div>
            {currentMachine &&
                <div className="break-form__result">
                    <span>Оборудование:</span>
                    <span className="break-form__data">{currentMachine.name}</span>
                </div>
            }
            {currentRepair.length > 0 &&
                <div className="break-form__result">
                    <span>Поломка:</span>
                    <span className="break-form__data">{currentRepair}</span>
                </div>
            }
            {currentPriority.length > 0 &&
                <div className="break-form__result">
                    <span>Приоритет:</span>
                    <span className="break-form__data">{currentPriority}</span>
                </div>
            }
        </>
    );
}

export default BreakForm;