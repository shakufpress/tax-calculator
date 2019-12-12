import React, { PureComponent } from 'react';
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import './Charts.css';
import { TreeNode } from './formulas';


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

interface TaxBarChartOwnProps {
    data: TreeNode[];
}

export default class TaxBarChart extends PureComponent<TaxBarChartOwnProps, {}> {

    render() {
        const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];

        const chartData = this.props.data.map((budgetItem: TreeNode) => {
            const title = budgetItem.title.split('/');
            return {name: title[1], total: budgetItem.value}
        });

        return (
            <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                    top: 10, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % 20]}/>
                    ))}
                </Bar>
            </BarChart>
        );
    }
}