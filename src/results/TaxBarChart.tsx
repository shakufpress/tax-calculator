import React, { PureComponent } from 'react';
import './Charts.css';
import { TreeNode } from './formulas';
import { Modal } from 'antd';
import BarChartWrapper, { BarChartItem } from './BarChartWrapper';

interface TaxBarChartState {
    showModal: boolean;
    modalData: BarChartItem[];
    modalTitle: string;
}

interface TaxBarChartOwnProps {
    data: TreeNode[];
}



export default class TaxBarChart extends PureComponent<TaxBarChartOwnProps, TaxBarChartState> {

    constructor(props: TaxBarChartOwnProps) {
        super(props);
        this.state = {
            showModal: false,
            modalData: [],
            modalTitle: ''
        }
    }

    handleClick = (event: BarChartItem, index: number) => {
        const item = this.props.data.filter(item => item.code === event.code)[0];
        if (item) {
            const modalData: BarChartItem[] = item.children.map(this.getChartData);
            this.setState({
                showModal: true,
                modalData: modalData,
                modalTitle: item.title
            });
        }
    }

    closeModal = () => {
        this.setState({
            showModal: false,
            modalData: [],
            modalTitle: ''
        })
    }

    getChartData = (budgetItem: TreeNode) => {
        const title = budgetItem.title.split('/');
        return {name: title[title.length - 1], total: budgetItem.value, code: budgetItem.code}
    };

    render() {
        const chartData = this.props.data.map(this.getChartData);

        return (
            <React.Fragment>
                <BarChartWrapper chartData={chartData} handleClick={this.handleClick} />
               <Modal
                    title={<div style={{marginRight: 20}}>{this.state.modalTitle}</div>}
                    visible={this.state.showModal}
                    onCancel={this.closeModal}
                    footer={null}>
                   <BarChartWrapper chartData={this.state.modalData} handleClick={this.handleClick} />
             </Modal>
            </React.Fragment>

        );
    }
}