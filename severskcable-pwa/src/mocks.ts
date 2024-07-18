import {InitialStateType} from "./types/initialState.type";
import {MachinesStatus} from "./constants";

export const initialStateMock: InitialStateType = {
    currentUser: 'Игорь Кот',
    machines: [
        {
            name: 'МГВ',
            status: MachinesStatus.Wrong,
            currentRepairId: '2',
            repairs: [
                {
                    id: "1",
                    breakName: 'Ролики',
                    operator: 'Оператор №1',
                    breakDate: '2024-06-23 19:34',
                    executor: 'Инженер №1',
                    repairDate: '2024-06-24 12:16',
                    repairDuration: '16:23',
                    comment: 'Не исправно было одно. Поменял на другое',
                    priority: 1,
                    status: true
                },
                {
                    id: "2",
                    breakName: 'Раскладчик',
                    operator: 'Оператор №3',
                    breakDate: '2024-06-25 11:23',
                    executor: '',
                    repairDate: '',
                    repairDuration: '',
                    comment: '',
                    priority: 2,
                    status: false
                }
            ],
            repairTypes: ['Ролики', 'Раскладчик', 'ПО']
        },
        {
            name: 'МСВ',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [
                {
                    id: "1",
                    breakName: 'Ролики',
                    operator: 'Оператор №1',
                    breakDate: '2024-06-23 19:34',
                    executor: 'Инженер №1',
                    repairDate: '2024-06-24 12:16',
                    repairDuration: '16:23',
                    comment: 'Не исправно было одно. Поменял на другое',
                    priority: 3,
                    status: true
                }
            ],
            repairTypes: []
        },
        {
            name: 'МТВ 1',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МТВ 2',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МТВ 3',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МТВ 4',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'Пасма 1',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'Пасма 2',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МДС 1',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МДС 2',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МДС 3',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МОС',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'КЭЛ70 1',
            currentRepairId: null,
            status: MachinesStatus.NotUse,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'КЭЛ70 2',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'КЭЛ90',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'МСТ',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'БМ',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'ПУ-1000',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'ПУ-630',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'Шпильконарезной',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            name: 'Отрезной станок',
            currentRepairId: null,
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
    ]
}