import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { TreeNode } from './formulas';
import './Charts.css';
import TaxPieChart from './TaxPieChart';

interface TaxBarChartOwnProps {
    data: TreeNode;
}

export default class TaxPieChartsView extends PureComponent<TaxBarChartOwnProps, {}> {

    render() {
        if (!this.props.data) {
            return null;
        }

        const cards = this.props.data.children.map((budgetItem: TreeNode) =>
            <Card title={budgetItem.name} size="small" key={budgetItem.code} style={{ width: '50%' }}>
                <TaxPieChart data={budgetItem.children}/>
            </Card>
        );

        return ( <div className="tax-bar-charts-view-container">
            {cards}
        </div>
        );
    }
}