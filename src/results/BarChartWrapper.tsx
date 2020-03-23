import React from "react";
import { BarChart, XAxis, Tooltip, Bar, Cell } from "recharts";
import { TreeNode } from "./formulas";

export interface BarChartItem {
    name: string;
    total: number;
    code: string;
    data: TreeNode;
}

interface BarChartWrapperProps {
    chartData: BarChartItem[];
    handleClick: (event:BarChartItem, index: number) => void;
}

const data = [
    {
        name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
    },
    {
        name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
    },
    {
        name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
    },
    {
        name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
    },
    {
        name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
    },
    {
        name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
    },
    {
        name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
    },
];

const CustomTooltip = (data: any) => {
    if (data.active) {
        const clickMessage = data.payload[0].payload.data.children.length > 0 ? 'Click me' : '';

        return (
            <div className="custom-tooltip-wrapper">
                <p className="title">{`${data.label}`}</p>
                <p className="label">{`total: ${data.payload[0].value}`}</p>
                <p className="desc">{clickMessage}</p>
            </div>
        );
    }

    return null;
  };

const BarChartWrapper = (props: BarChartWrapperProps) => {
    const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

    return (<BarChart
        width={500}
        height={300}
        data={props.chartData}
        margin={{
            top: 10, right: 30, left: 20, bottom: 5,
        }}
    >
        <XAxis dataKey="name" />
        <Tooltip wrapperStyle={{ top: 0, left: 50 }} content={<CustomTooltip data={data}/>}/>
        {/* <Tooltip wrapperStyle={{ top: 0, left: 50 }} /> */}
        <Bar dataKey="total" onClick={props.handleClick} fill="#8884d8" label={{ position: 'top' }}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 20]}/>
                ))}
        </Bar>
</BarChart>);
}

export default BarChartWrapper;