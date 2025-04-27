import classNames from "classnames";
import {Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import React, {useCallback, useMemo} from "react";
import {Break, MachineType} from "../../types/initialState.type";
import dayjs from "dayjs";
import {getPeriodDayjs} from "../../helpers/helpers";
import {Value} from "../../types/types";
import {log} from "node:util";
import {ExcelRowType} from "../../types/export.type";

type MachineAnalyticProps = {
    machine: MachineType,
    getBreaksHoursInPeriodByMachine: (
        breaks: Break[],
        currentMachine: string,
        periodDays: Value,
        priority?: number,
        byDay?: boolean) =>
        {
            date: string,
            machine: string,
            breakHours: number
        }
    period: Value,
    breaks: Break[],
    hoursInPeriod: number,
    setCurrentMachine: React.Dispatch<React.SetStateAction<string | null>>,
    excelRows: ExcelRowType
}

function MachineAnalytic({machine, getBreaksHoursInPeriodByMachine, period, breaks, hoursInPeriod, setCurrentMachine, excelRows}: MachineAnalyticProps) {
    const getHoursByDayInPeriod = (getBreaksHoursInPeriodByMachine: any, period: Value, breaks: Break[], machine: MachineType) => {
        const hoursByDayInPeriod = [];
        for (let i = dayjs(getPeriodDayjs(period)[0]).date(); i <= (dayjs(getPeriodDayjs(period)[1]).diff(dayjs(getPeriodDayjs(period)[0]), 'day') + 1); i++) {
            let startPeriod = dayjs(getPeriodDayjs(period)[0]).add(24*(i-1), 'hour');
            let day: Value = [startPeriod.toDate(), startPeriod.add(24, 'hour').toDate()]
            hoursByDayInPeriod.push(getBreaksHoursInPeriodByMachine(breaks, machine.name, day, 1, true));
            startPeriod.add(24, 'hour');
        }
        return hoursByDayInPeriod;
    }

    const hoursByDayInPeriod = useMemo(
        (): any[] => getHoursByDayInPeriod(getBreaksHoursInPeriodByMachine, period, breaks, machine),
        [getBreaksHoursInPeriodByMachine, period, breaks, machine]
    )

    const hoursByMachine = useMemo(
        () => getBreaksHoursInPeriodByMachine(breaks, machine.name, period, 1),
            [machine, breaks, period]
    );


    const machineAccessability = (Math.round(hoursByMachine.breakHours * 100 / hoursInPeriod) - 100) * (-1);
    const chartData = []
    let factPercCount = 0;
    for (let i = dayjs(getPeriodDayjs(period)[0]).date(); i <= (dayjs(getPeriodDayjs(period)[1]).diff(dayjs(getPeriodDayjs(period)[0]), 'day') + 1); i++) {
        const factCount = (Math.round((hoursByDayInPeriod[factPercCount] ? hoursByDayInPeriod[factPercCount].breakHours : 0) * 100/24) - 100) * (-1);
        chartData.push({
            name: hoursByDayInPeriod[factPercCount] ? hoursByDayInPeriod[factPercCount].date : '?',
            Факт: factCount
        })
        factPercCount++;
    }

    if (!excelRows.find(row => row.id === machine.id)){
        excelRows.push({
            id: machine.id,
            machine: machine.name,
            efficiency: machineAccessability
        });
    }

    return (
        <div className="analytics-page__machine" onClick={() => setCurrentMachine(machine.name)}>
                            <span className={classNames(
                                "analytics-page__machine-accessibility",
                                {"analytics-page__machine-accessibility--warning": machineAccessability < 85},
                                {"analytics-page__machine-accessibility--bad": machineAccessability < 60}
                            )}>{machineAccessability}%</span>
            <h2 className="analytics-page__machine-title">{hoursByMachine.machine}</h2>
            <AreaChart width={300} height={170} className="analytics-page__machine-chart" data={chartData}>
                <defs>
                    <linearGradient id={machine.id} x1="0" y1="0" x2="0" y2="1">
                        {machineAccessability >= 85 &&
                            <>
                                <stop offset="5%" stopColor="#a6dfa4" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#a6dfa4" stopOpacity={0.2}/>
                            </>
                        }
                        {(machineAccessability < 85 && machineAccessability > 60) &&
                            <>
                                <stop offset="5%" stopColor="#f3da90" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#f3da90" stopOpacity={0.2}/>
                            </>
                        }
                        {machineAccessability <= 60 &&
                            <>
                                <stop offset="5%" stopColor="#ff9c9c" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#ff9c9c" stopOpacity={0.2}/>
                            </>
                        }
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey="Факт" stroke="#8884d8" fillOpacity={1}
                      fill={`url(#${machine.id})`}/>
                <CartesianGrid strokeDasharray="5 5"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
            </AreaChart>
        </div>
    );
}

export default MachineAnalytic;