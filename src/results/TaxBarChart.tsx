import React, { PureComponent } from 'react';
import './Charts.css';
import { TreeNode } from './formulas';
import { Modal } from 'antd';
import BarChartWrapper, { BarChartItem } from './BarChartWrapper';

interface TaxBarChartState {
    showModal: boolean;
    modalData: BarChartItem[];
    modalTitle: string;
    currentCode: string;
}

interface TaxBarChartOwnProps {
    data: TreeNode;
}



export default class TaxBarChart extends PureComponent<TaxBarChartOwnProps, TaxBarChartState> {

    constructor(props: TaxBarChartOwnProps) {
        super(props);
        this.state = {
            showModal: false,
            modalData: [],
            modalTitle: '',
            currentCode: props.data.code
        }
    }

    getItemByCode = (root: TreeNode, code: string): TreeNode => {
        if (root.code === code) {
            return root;
        } else if (root.children.length > 0) {
            root.children.forEach((child: TreeNode) => {
                return this.getItemByCode(child, code);
            });
        }

        return root;
    }

    getParentByCode = (root: TreeNode, code: string): TreeNode => {
        if (!root.children || root.children.length === 0) {
            return root;
        } else if (root.children.some(item => item.code === code)) {
            return root;
        } else {
            root.children.forEach((child: TreeNode) => {
                return this.getParentByCode(child, code);
            });
        }

        return root;
    }

    handleClick = (event: BarChartItem, index: number) => {
        const item = this.getItemByCode(event.data, event.code);
        if (item && item.children.length > 0) {
            const modalData: BarChartItem[] = item.children.map(this.getChartData);
            this.setState({
                showModal: true,
                modalData: modalData,
                modalTitle: item.title,
                currentCode: item.code
            });
        }
    }

    handleBackClick = () => {
        const parent = this.getParentByCode(this.props.data, this.state.currentCode);
        console.log(`current: ${this.state.currentCode}. parent: ${parent.code}`);
        const modalData: BarChartItem[] = parent.children.map(this.getChartData);
        this.setState({
            showModal: true,
            modalData: modalData,
            modalTitle: parent.title,
            currentCode: parent.code
        });
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
        return {name: title[title.length - 1], total: budgetItem.value, code: budgetItem.code, data: budgetItem}
    };

    render() {
        const chartData = this.props.data.children.map(this.getChartData);
        const backButton = this.props.data.children.length > 0 ?
                        (<button onClick={this.handleBackClick} style={{float: 'left', marginBottom: 20}}>back</button>) : null;
        const title = (<div>
            <div>{this.state.modalTitle}</div>
            {backButton}
        </div>)
        return (
            <React.Fragment>
                <BarChartWrapper chartData={chartData} handleClick={this.handleClick} />
               <Modal
                    title={<div style={{marginRight: 20}}>{title}</div>}
                    visible={this.state.showModal}
                    onCancel={this.closeModal}
                    footer={null}>
                   <BarChartWrapper chartData={this.state.modalData} handleClick={this.handleClick} />
             </Modal>
            </React.Fragment>

        );
    }
}