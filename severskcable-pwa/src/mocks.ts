import {InitialStateType} from "./types/initialState.type";
import {MachinesStatus} from "./constants";
import {nanoid} from "@reduxjs/toolkit";

export const initialStateMock: InitialStateType = {
    currentUser: 'Игорь Кот',
    machines: [
        {
            id: nanoid(),
            name: 'МГВ',
            status: MachinesStatus.Wrong,
            repairs: [
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    operator: 'Оператор №1',
                    breakDate: '2024-06-23 19:34',
                    executor: 'Инженер №1',
                    repairDate: '2024-06-24 12:16',
                    repairDuration: 23,
                    comment: 'Не исправно было одно. Поменял на другое',
                    priority: 1,
                    status: true
                },
                {
                    id: nanoid(),
                    breakName: 'Раскладчик',
                    operator: 'Оператор №3',
                    breakDate: '2024-06-25 11:23',
                    executor: '',
                    repairDate: '',
                    repairDuration: 0,
                    comment: '',
                    priority: 2,
                    status: false
                }
            ],
            repairTypes: ['Ролики', 'Раскладчик', 'ПО']
        },
        {
            id: nanoid(),
            name: 'МСВ',
            status: MachinesStatus.Work,
            repairs: [
                {
                    id: nanoid(),
                    breakName: 'Ролики',
                    operator: 'Оператор №1',
                    breakDate: '2024-06-23 19:34',
                    executor: 'Инженер №1',
                    repairDate: '2024-06-24 12:16',
                    repairDuration: 22,
                    comment: 'Не исправно было одно. Поменял на другое',
                    priority: 3,
                    status: true
                }
            ],
            repairTypes: []
        },
        {
            id: nanoid(),
            name: 'МТВ 1',
            status: MachinesStatus.Work,
            repairs: [],
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
            status: MachinesStatus.Work,
            repairs: [],
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