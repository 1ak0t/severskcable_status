import {useAppDispatch, useAppSelector} from "../../hooks";
import {NewBreakType, OptionTypes} from "../../types/types";
import Select from "react-select";
import {useState} from "react";
import {AppRoutes, Priority, RepairStage} from "../../constants";
import CreatableSelect from "react-select/creatable";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {getPriorityNumber, handleImageUpload} from "../../helpers/helpers";
import {MachineType} from "../../types/initialState.type";
import {
    createNewBreakAction,
    createNewBreakTypeAction,
    fetchBreakTypesByMachine
} from "../../store/api-actions";

function BreakForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {machines, user, breaksTypesByMachine} = useAppSelector(state => state);
    const [currentMachine, setCurrentMachine] = useState<null | MachineType>(null);
    const [isMachineSelected, setIsMachineSelected] = useState(true);
    const [currentRepair, setCurrentRepair] = useState('');
    const [isRepairSelected, setIsRepairSelected] = useState(true);
    const [repairList, setRepairList] = useState<OptionTypes[]>([]);
    const [isOpenRepairList, setIsOpenRepairList] = useState(false);
    const [currentPriority, setCurrentPriority] = useState('');
    const [priorityList, setPriorityList] = useState<OptionTypes[]>([]);
    const [isOpenPriorityList, setIsOpenPriorityList] = useState(false);
    const [registerImage, setRegisterImage] = useState<File>();
    let machineList: OptionTypes[] = [];
    machines.map(machine => machineList.push({label: machine.name, value: machine.name}));

    const getMachineValue = () => {
        return currentMachine ? machineList.find(machine => machine.value === currentMachine.name) : '';
    }

    const getRepairValue = () => {
        return currentRepair ? repairList.find(repair => repair.value === currentRepair) : '';
    }

    const getPriorityValue = () => {
        return currentPriority ? priorityList.find(priority => priority.value === currentPriority) : '';
    }

    const onChangeMachine = (newValue: any) => {
        const machine = machines.find(machine => machine.name === newValue.value);
        if (machine){
            setCurrentMachine(machine);
        }
        dispatch(fetchBreakTypesByMachine())
        setCurrentRepair('');
        setCurrentPriority('');
        setIsOpenRepairList(false);
        setIsOpenPriorityList(false);
        setIsMachineSelected(true);
        setIsRepairSelected(true);
        const findMachine = machines.find(machine => machine.name === newValue.value);
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

    const onRepairChange = (newValue: any) => {
        setCurrentRepair(newValue.value);
        setCurrentPriority('');
        setIsOpenRepairList(false);
        setIsRepairSelected(false);
        const list: OptionTypes[] = [];
        Priority.map(el => list.push({label: el, value: el}));
        setPriorityList(list);
        setIsOpenPriorityList(true);
    }

    const onRepairListFocus = () => {
        setIsOpenRepairList(true);
        setCurrentRepair('');
    }

    const onPriorityChange = (newValue: any) => {
        setCurrentPriority(newValue.value);
        setIsOpenPriorityList(false);
    }

    const onCreateRepair = (newRepair: string) => {
        if (currentMachine) {
            dispatch(createNewBreakTypeAction({machine: currentMachine.id, description: newRepair}));
        }
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
                registerPerson: user.id,
                registerDate: dayjs().toString(),
                status: false,
                stages: RepairStage.Register
            }

            if (registerImage) {
                data = {...data, registerImage: registerImage};
            }

            dispatch(createNewBreakAction(data));
            navigate(AppRoutes.GoodSend);
        }
    };

    return(
        <>
            <div className="break-form">
                <label>Выберите оборудование</label>
                <Select
                    options={machineList}
                    placeholder={'Выбрать'}
                    onChange={onChangeMachine}
                    value={getMachineValue()}
                    required={true}
                    noOptionsMessage={() => 'Нет вариантов'}

                />
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
                />
                <input type="file" accept="image/png, image/jpeg"
                       onChange={(evt) => handleImageUpload(evt, setRegisterImage)}/>
                {registerImage && <img src={URL.createObjectURL(registerImage)} alt=""/>}
                <button className="break-form__submit" type="submit" onClick={onBreakSubmit}>Отправить</button>
            </div>
            <div className="break-form__result">
                <span>Кем зарегистрирован:</span>
                <span className="break-form__data">{user.name}</span>
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