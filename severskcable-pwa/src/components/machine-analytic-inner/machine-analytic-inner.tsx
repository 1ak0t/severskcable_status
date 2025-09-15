import {BsXLg} from "react-icons/bs";
import {
    Bar,
    BarChart,
    CartesianGrid, Cell,
    LabelList, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import React from "react";
import {Break} from "../../types/initialState.type";
import {Value} from "../../types/types";
import dayjs from "dayjs";

type MachineAnalyticInnerProps = {
    setCurrentMachine: React.Dispatch<React.SetStateAction<string | null>>,
    currentMachine: string | null,
    breaks: Break[],
    period: Value,
    hoursInPeriod: number,
    getBreaksHoursInPeriodByMachine: (
        breaks: Break[],
        currentMachine: string,
        period: Value,
        priority?: number,
        byDay?: boolean) =>
        {
            date: string,
            machine: string,
            breakHours: number
        }
    getBreaksInPeriod: (
        breaks: Break[],
        currentMachine: string,
        priority?: number
    ) => Break[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

function MachineAnalyticInner({setCurrentMachine, currentMachine, breaks, period, hoursInPeriod, getBreaksHoursInPeriodByMachine, getBreaksInPeriod}: MachineAnalyticInnerProps) {
    const windowInnerWidth = window.innerWidth;
    const getChartPriorityDataByMachine = (getBreaksHoursInPeriodByMachine: any) => {
        const breaksHoursFirstPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 1).breakHours;
        const breaksHoursSecondPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 2).breakHours;
        const breaksHoursThirdPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 3).breakHours;
        const breaksHoursStopPriority = getBreaksHoursInPeriodByMachine(breaks, currentMachine, period, 4).breakHours;

        return [
            {
                name: "Линия стоит",
                Факт: breaksHoursFirstPriority,
                Label: `${Math.round(breaksHoursFirstPriority * 100 / hoursInPeriod)}%`,
                fill: "#ff9c9c"
            },
            {
                name: "Работает нештатно",
                Факт: breaksHoursSecondPriority,
                Label: `${Math.round(breaksHoursSecondPriority * 100 / hoursInPeriod)}%`,
                fill: "#f3da90"
            },
            {
                name: "Требует внимания",
                Факт: breaksHoursThirdPriority,
                Label: `${Math.round(breaksHoursThirdPriority * 100 / hoursInPeriod)}%`,
                fill: "#a5c3e4"
            },
            {
                name: "Простой",
                Факт: breaksHoursStopPriority,
                Label: `${Math.round(breaksHoursStopPriority * 100 / hoursInPeriod)}%`,
                fill: "#d29fec"
            }
        ]
    };

    const getChartStagesDataByMachine = (currentMachine: string | null) => {
        if (currentMachine !== null) {
            const breaksInPeriod = getBreaksInPeriod(breaks, currentMachine);
            let successDuration = 0;
            breaksInPeriod.filter(el => el.registerDate && el.successDate).map(el => {
                successDuration = successDuration + dayjs(el.successDate).diff(dayjs(el.registerDate), 'minute')
            });
            let repairWaitingDuration = 0;
            breaksInPeriod.filter(el => el.successDate && el.repairingDate).map(el => {
                repairWaitingDuration = repairWaitingDuration + dayjs(el.repairingDate).diff(dayjs(el.successDate), 'minute')
            });
            let repairingDuration = 0;
            breaksInPeriod.filter(el => el.repairingDate && el.repairCompletedDate).map(el => {
                repairingDuration = repairingDuration + dayjs(el.repairCompletedDate).diff(dayjs(el.repairingDate), 'minute')
            });
            let repairAcceptDuration = 0;
            breaksInPeriod.filter(el => el.repairCompletedDate && el.repairEndDate).map(el => {
                repairAcceptDuration = repairAcceptDuration + dayjs(el.repairEndDate).diff(dayjs(el.repairCompletedDate), 'minute')
            });
            const allStagesDuration = successDuration + repairWaitingDuration + repairingDuration + repairAcceptDuration;

            return [
                {
                    name: "Согласование",
                    Процент: Math.round(successDuration * 100 / allStagesDuration),
                    Label: `${Math.round(successDuration * 100 / allStagesDuration)}%`,
                    fill: "#ff9c9c",
                },
                {
                    name: "Ожидание ремонта",
                    Процент: Math.round(repairWaitingDuration * 100 / allStagesDuration),
                    Label: `${Math.round(repairWaitingDuration * 100 / allStagesDuration)}%`,
                    fill: "#f3da90"
                },
                {
                    name: "Ремонт",
                    Процент: Math.round(repairingDuration * 100 / allStagesDuration),
                    Label: `${Math.round(repairingDuration * 100 / allStagesDuration)}%`,
                    fill: "#a5c3e4"
                },
                {
                    name: "Подтверждение ремонта",
                    Процент: Math.round(repairAcceptDuration * 100 / allStagesDuration),
                    Label: `${Math.round(repairAcceptDuration * 100 / allStagesDuration)}%`,
                    fill: "#a5c3e4"
                }
            ]
        }
        return [];
    }

    // @ts-ignore
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="inner-chart">
            <h1 className="inner-chart__title">{currentMachine}</h1>
            <BsXLg onClick={() => setCurrentMachine(null)} className="inner-chart__close"/>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartPriorityDataByMachine(getBreaksHoursInPeriodByMachine)}>
                    <Bar type="monotone" dataKey="Факт" stroke="#8884d8" fill="#f3da90" fillOpacity={1}>
                        <LabelList dataKey="Label" position="top"/>
                    </Bar>
                    <ReferenceLine y={hoursInPeriod} stroke="red" strokeDasharray="3 3" strokeWidth={2}/>
                    <CartesianGrid strokeDasharray="5 5"/>
                    <XAxis dataKey="name" interval={0} angle={windowInnerWidth > 1200 ? 0 : 45} height={windowInnerWidth > 1200 ? 30 : 120} dy={windowInnerWidth > 1200 ? 0 : 50}/>
                    <YAxis domain={[0, Math.round(hoursInPeriod + (hoursInPeriod * 0.1))]}/>
                    <Tooltip/>
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={getChartStagesDataByMachine(currentMachine)} dataKey="Процент" cx="50%" cy="50%" label={windowInnerWidth > 1200 ? renderCustomizedLabel : false}>
                        {windowInnerWidth > 1200 ? <LabelList dataKey="name" position="outside" style={{fill: '#565656', stroke:"none"}} offset={30}/> : <LabelList dataKey="Label" position="inside" style={{fill: 'white', stroke:"none"}} offset={30}/>}
                        {
                            getChartStagesDataByMachine(currentMachine).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index]}/>
                            ))
                        }
                    </Pie>
                    {windowInnerWidth > 1200 ? '' : <Legend />}
                    <Tooltip/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MachineAnalyticInner;