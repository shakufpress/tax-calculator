import React from 'react';
import { Card } from 'antd';
import { TreeNode } from './formulas';
import TaxBarChart from './TaxBarChart';
import './Charts.css';

interface TaxBarChartOwnProps {
    data: TreeNode;
}

const TaxBarChartView = (props: TaxBarChartOwnProps) => {
    if (!props.data) {
        return null;
    }

    const cards = props.data.children.map((budgetItem: TreeNode) =>
        <Card title={budgetItem.name} size="small" key={budgetItem.code} style={{ width: '50%' }}>
            <TaxBarChart data={budgetItem.children} />
        </Card>
    );

    return ( <div className="tax-bar-charts-view-container">
        {cards}
    </div>
    );
}

export default TaxBarChartView;