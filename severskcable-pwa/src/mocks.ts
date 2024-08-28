import {InitialStateType} from "./types/initialState.type";
import {MachinesStatus, RepairStage, UserRoles} from "./constants";
import {nanoid} from "@reduxjs/toolkit";

export const initialStateMock: InitialStateType = {
    user: {
        name: 'Игорь Кот',
        role: UserRoles.ITR
    },
    machines: [
        {
            id: nanoid(),
            name: 'МГВ',
            status: MachinesStatus.Wrong,
            repairs: [
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    registerPerson: 'Оператор №1',
                    registerDate: '2024-06-23 19:34',
                    successPerson: 'Мастер',
                    successDate: '2024-06-24 19:34',
                    repairingPerson: 'Слесарь',
                    repairingDate: '2024-06-24 21:34',
                    repairCompletedPerson: 'Технический директор',
                    repairCompletedDate: '2024-06-25 10:34',
                    repairEndPerson: 'Мастер',
                    repairEndDate: '2024-06-25 11:34',
                    comment: 'Не исправно было одно. Поменял на другое',
                    priority: 1,
                    status: true,
                    stages: null
                },
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    registerPerson: 'Оператор №1',
                    registerDate: '2024-06-23 19:34',
                    successPerson: '',
                    successDate: '',
                    repairingPerson: '',
                    repairingDate: '',
                    repairCompletedPerson: '',
                    repairCompletedDate: '',
                    repairEndPerson: '',
                    repairEndDate: '',
                    comment: '',
                    priority: 2,
                    status: false,
                    stages: RepairStage.Register,
                }
            ],
            repairTypes: ['Ролики', 'Раскладчик', 'ПО']
        },
        {
            id: nanoid(),
            name: 'МСВ',
            status: MachinesStatus.Inspection,
            repairs: [
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    registerPerson: 'Оператор №1',
                    registerDate: '2024-06-23 19:34',
                    successPerson: 'Мастер',
                    successDate: '2024-06-24 19:34',
                    repairingPerson: 'Слесарь',
                    repairingDate: '2024-06-24 21:34',
                    repairCompletedPerson: '',
                    repairCompletedDate: '',
                    repairEndPerson: '',
                    repairEndDate: '',
                    comment: '',
                    priority: 3,
                    status: false,
                    stages: RepairStage.Repairing,
                }
            ],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МТВ 1',
            status: MachinesStatus.Warning,
            repairs: [
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    registerPerson: 'Оператор №1',
                    registerDate: '2024-06-23 19:34',
                    successPerson: 'Мастер',
                    successDate: '2024-06-24 19:34',
                    repairingPerson: '',
                    repairingDate: '',
                    repairCompletedPerson: '',
                    repairCompletedDate: '',
                    repairEndPerson: '',
                    repairEndDate: '',
                    comment: '',
                    priority: 3,
                    status: false,
                    stages: RepairStage.RepairSuccess,
                }
            ],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МТВ 2',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МТВ 3',
            status: MachinesStatus.Wrong,
            repairs: [
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    registerPerson: 'Оператор №1',
                    registerDate: '2024-06-23 19:34',
                    successPerson: 'Мастер',
                    successDate: '2024-06-24 19:34',
                    repairingPerson: 'Слесарь',
                    repairingDate: '2024-06-24 21:34',
                    repairCompletedPerson: 'Технический директор',
                    repairCompletedDate: '2024-06-25 10:34',
                    repairEndPerson: 'Мастер',
                    repairEndDate: '2024-06-25 11:34',
                    comment: 'Не исправно было одно. Поменял на другое',
                    priority: 3,
                    status: false,
                    stages: RepairStage.RepairCompleted,
                }
            ],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МТВ 4',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'Пасма 1',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'Пасма 2',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МДС 1',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МДС 2',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МДС 3',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МОС',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'КЭЛ70 1',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'КЭЛ70 2',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'КЭЛ90',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МСТ',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'БМ',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'ПУ-1000',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'ПУ-630',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'Шпильконарезной',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'Отрезной станок',
            status: MachinesStatus.Work,
            repairs: [],
            repairTypes: []
        },
    ]
}