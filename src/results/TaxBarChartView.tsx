import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { TreeNode } from './formulas';
import TaxBarChart from './TaxBarChart';
import './Charts.css';

interface TaxBarChartOwnProps {
    data: TreeNode;
}

export default class TaxBarChartView extends PureComponent<TaxBarChartOwnProps, {}> {

    render() {
        if (!this.props.data) {
            return null;
        }

        const cards = this.props.data.children.map((budgetItem: TreeNode) =>
            <Card title={budgetItem.name} size="small" key={budgetItem.code} style={{ width: '50%' }}>
                <TaxBarChart data={budgetItem.children}/>
            </Card>
        );

        return ( <div className="tax-bar-charts-view-container">
            {cards}
        </div>
        );
    }
}