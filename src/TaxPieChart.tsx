import React, { PureComponent } from 'react';
import {
    PieChart, Pie
} from 'recharts';
import './Charts.css';
import { TreeNode } from './formulas';


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {value}
        </text>
    );
};

interface TaxPieChartOwnProps {
    data: TreeNode;
}

export default class TaxPieChart extends PureComponent<TaxPieChartOwnProps> {

    render() {
        const data = this.props.data;

        const secondLevel: any = [];
        const topLevel = data.children.map((budgetItem: TreeNode) => {
            budgetItem.children.forEach((child: TreeNode) => {
                secondLevel.push({ name: child.title, value: child.value });
            });
            return { name: budgetItem.title, value: budgetItem.value };
        });

        return (
            <PieChart width={600} height={600}>
                <Pie data={topLevel} dataKey="value" cx={300} cy={300} outerRadius={200} fill="#8884d8" label={renderCustomizedLabel} isAnimationActive={false}/>
                <Pie data={secondLevel} dataKey="value" cx={300} cy={300} innerRadius={215} outerRadius={280} fill="#82ca9d" label={renderCustomizedLabel} isAnimationActive={false}/>
            </PieChart>
        );
    }
}
